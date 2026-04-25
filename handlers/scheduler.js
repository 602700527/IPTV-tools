// 定时任务处理器：自动同步已启用的数据源和刷新缓存
import { getDB, fetchAndParseM3U, fetchAndParseM3UOnly, initDB, getSyncFilterConfig, getTypeMappingConfig } from '../database.js';
import { cacheChannelsToKV, generateAndCacheSitemap } from '../utils/channel-cache.js';
import { generateTokenAndAddresses } from '../utils/token-manager.js';
import { classifyEmptyTypeChannels } from './ai-classify.js';

// KV 分布式锁配置
const LOCK_TTL_SECONDS = 7200; // 锁自动过期时间 2小时
const CACHE_LOCK_TTL_SECONDS = 600; // 缓存刷新锁过期时间 10分钟

// KV 锁键名
const LOCK_KEY_SYNC = 'lock:sync';
const LOCK_KEY_CACHE_REFRESH = 'lock:cache_refresh';

/**
 * 获取 KV 分布式锁
 * @param {object} env - Cloudflare Workers env
 * @param {string} lockKey - 锁键名
 * @param {number} ttlSeconds - 锁过期秒数
 * @returns {Promise<boolean>} 是否成功获取锁
 */
async function acquireKVLock(env, lockKey, ttlSeconds) {
  try {
    // 尝试获取锁（只在前一个值不存在时设置）
    const existing = await env.KV.get(lockKey);
    if (existing === '1') {
      return false; // 锁已被占用
    }
    // 使用 put 设置锁，带有过期时间防止死锁
    await env.KV.put(lockKey, '1', { expirationTtl: ttlSeconds });
    return true;
  } catch (error) {
    console.error(`[Lock] Failed to acquire lock ${lockKey}:`, error);
    return false;
  }
}

/**
 * 释放 KV 分布式锁
 * @param {object} env - Cloudflare Workers env
 * @param {string} lockKey - 锁键名
 */
async function releaseKVLock(env, lockKey) {
  try {
    await env.KV.delete(lockKey);
  } catch (error) {
    console.error(`[Lock] Failed to release lock ${lockKey}:`, error);
  }
}

/**
 * 睡眠函数
 * @param {number} ms - 毫秒数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 等待同步锁释放（指数退避重试）
 * @param {object} env - Cloudflare Workers env
 * @param {number} maxRetries - 最大重试次数
 * @param {number} baseDelayMs - 基础延迟毫秒数
 * @returns {Promise<boolean>} 是否等到锁释放
 */
async function waitForSyncLockRelease(env, maxRetries = 5, baseDelayMs = 60000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const lockValue = await env.KV.get(LOCK_KEY_SYNC);
    if (lockValue !== '1') {
      // 锁已释放
      return true;
    }

    if (attempt < maxRetries - 1) {
      // 还有重试次数，指数退避等待
      const delayMs = baseDelayMs * Math.pow(2, attempt);
      console.log(`[Scheduler] Sync lock detected, waiting ${delayMs / 1000}s before retry ${attempt + 1}/${maxRetries}`);
      await sleep(delayMs);
    } else {
      // 最后一次重试也失败了
      console.log(`[Scheduler] Sync still in progress after ${maxRetries} retries, giving up`);
      return false;
    }
  }
  return false;
}

// 导出内部函数供测试使用
export { syncAllSources, refreshCache, generateAndCacheSitemap };

export async function handleScheduledEvent(event, env, ctx) {
  try {
    const now = new Date().toISOString();
    console.log(`[${now}] Scheduled task started`);

    // 初始化数据库
    const db = await initDB(env);
    if (!db) {
      console.error('[Scheduler] Failed to initialize database');
      return;
    }
    console.log('[Scheduler] Database initialized successfully');

    // 检查cron类型（通过时间判断）
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();

    // 每天3:00执行数据源同步（在缓存刷新之前）
    if (hour === 3 && minute === 0) {
      // 尝试获取 KV 分布式锁
      if (!await acquireKVLock(env, LOCK_KEY_SYNC, LOCK_TTL_SECONDS)) {
        console.log('[Scheduler] Sync lock is held by another instance, skipping this run');
        return;
      }

      console.log('[Scheduler] Starting data source sync (KV lock acquired)');

      try {
        // 传递 ctx 用于异步操作
        await syncAllSources(db, env, ctx);
        // 数据源同步完成后，清理过期90天的免费订阅
        await cleanupExpiredFreeSubscriptions(db);
      } finally {
        await releaseKVLock(env, LOCK_KEY_SYNC);
        console.log('[Scheduler] Sync lock released');
      }
    } else if ((hour === 9 || hour === 21) && minute === 0) {
      // 每天9:00, 21:00刷新缓存
      // 先等待同步锁释放（指数退避重试）
      console.log('[Scheduler] Checking if sync lock is held...');
      const canProceed = await waitForSyncLockRelease(env, 5, 60000);

      if (!canProceed) {
        console.log('[Scheduler] Sync still in progress after retries, skipping cache refresh');
        return;
      }

      // 尝试获取缓存刷新的 KV 锁
      if (!await acquireKVLock(env, LOCK_KEY_CACHE_REFRESH, CACHE_LOCK_TTL_SECONDS)) {
        console.log('[Scheduler] Cache refresh lock is held by another instance, skipping');
        return;
      }

      console.log('[Scheduler] Starting cache refresh (cache refresh lock acquired)');

      try {
        await refreshCache(db, env);
      } finally {
        await releaseKVLock(env, LOCK_KEY_CACHE_REFRESH);
        console.log('[Scheduler] Cache refresh lock released');
      }
    } else {
      console.log(`[Scheduler] No task scheduled for this time (${hour}:${minute})`);
    }

  } catch (error) {
    console.error('[Scheduler] Error in scheduled event:', error);
    // 确保锁被释放
    await releaseKVLock(env, LOCK_KEY_SYNC);
    await releaseKVLock(env, LOCK_KEY_CACHE_REFRESH);
  }
}

// 同步所有数据源（每天3:00执行）
async function syncAllSources(db, env, ctx = null) {
  try {
    // 获取同步过滤规则配置
    let filter = null;
    try {
      filter = await getSyncFilterConfig();
      console.log('[Scheduler] Loaded sync filter config:', filter);
    } catch (error) {
      console.error('[Scheduler] Failed to load sync filter config:', error);
      filter = {};
    }

    // 获取类型映射配置
    try {
      const typeMappingConfig = await getTypeMappingConfig();
      filter.typeMappingConfig = typeMappingConfig;
      console.log('[Scheduler] Loaded type mapping config:', typeMappingConfig);
    } catch (error) {
      console.error('[Scheduler] Failed to load type mapping config:', error);
    }

    // 获取所有启用的数据源
    const sources = await db.prepare(`
      SELECT id, name, url, type, parse_mode
      FROM sources
      WHERE is_active = 1
      ORDER BY id
    `).all();

    if (!sources.results || sources.results.length === 0) {
      console.log('[Scheduler] No enabled sources found');
      return;
    }

    const enabledSources = sources.results;
    console.log(`[Scheduler] Found ${enabledSources.length} enabled source(s) to sync`);

    // 逐个同步源
    const results = [];
    let totalDeleted = 0;
    let totalAdded = 0;
    const syncData = {}; // 暂存每个源的新数据 {sourceId: {channels, adBindings}}

    // 第一步：获取所有数据源的新数据（不删除旧数据）
    for (const source of enabledSources) {
      try {
        console.log(`[Scheduler] Fetching data for source ${source.id}: ${source.name}`);

        // 同步新频道（只获取数据，不删除）
        const syncResult = await fetchAndParseM3UOnly(source.url, source.id, filter);

        if (syncResult.success && syncResult.channelCount > 0) {
          // 暂存新数据
          syncData[source.id] = {
            channels: syncResult.channels,
            adBindings: syncResult.adBindings,
            channelCount: syncResult.channelCount
          };

          results.push({
            source_id: source.id,
            source_name: source.name,
            success: true,
            deleted_channels: 0,
            new_channels: syncResult.channelCount,
            error: null
          });
          console.log(`[Scheduler] Source ${source.id} data fetched: ${syncResult.channelCount} channels`);
        } else {
          // 获取数据失败
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: false,
            deleted_channels: 0,
            new_channels: 0,
            error: syncResult.error || 'No channels fetched'
          });
          console.error(`[Scheduler] Source ${source.id} fetch failed: ${syncResult.error}`);
        }
      } catch (error) {
        console.error(`[Scheduler] Error fetching source ${source.id}:`, error);
        results.push({
          source_id: source.id,
          source_name: source.name,
          success: false,
          deleted_channels: 0,
          new_channels: 0,
          error: error.message
        });
      }
    }

    // 第二步：只有所有数据源都成功获取数据后，才删除旧数据并写入新数据
    const successSources = results.filter(r => r.success);
    const failedSources = results.filter(r => !r.success);

    if (failedSources.length > 0) {
      console.log(`[Scheduler] ${failedSources.length} source(s) failed to fetch data, skipping database update`);
      console.log(`[Scheduler] Only ${successSources.length} source(s) will be updated`);
    }

    // 加载频道类型映射（用于同步时回填type）
    const typeMap = await loadChannelTypeMapping(db);

    // 只更新成功获取数据的源
    for (const result of successSources) {
      const sourceId = result.source_id;
      const newData = syncData[sourceId];

      if (!newData) {
        console.error(`[Scheduler] No data found for source ${sourceId}, skipping`);
        continue;
      }

      try {
        // 获取旧的频道数量
        const oldCountResult = await db.prepare('SELECT COUNT(*) as count FROM channels WHERE source_id = ?').bind(sourceId).first();
        const oldChannelCount = oldCountResult?.count || 0;

        // 删除旧频道
        console.log(`[Scheduler] Deleting old channels for source ${sourceId}`);
        await db.prepare('DELETE FROM channels WHERE source_id = ?').bind(sourceId).run();
        totalDeleted += oldChannelCount;

        // 写入新频道数据（直接使用暂存的数据，带type回填）
        console.log(`[Scheduler] Writing new channels for source ${sourceId}`);
        await writeChannelsToDB(db, newData.channels, newData.adBindings, sourceId, typeMap);
        totalAdded += newData.channelCount;

        // 更新源的同步时间
        const now = new Date().toISOString();
        await db.prepare(`UPDATE sources SET last_updated = ? WHERE id = ?`).bind(now, sourceId).run();
        console.log(`[Scheduler] Updated last_updated time for source ${sourceId}`);

        // 更新结果中的删除数量
        result.deleted_channels = oldChannelCount;
        console.log(`[Scheduler] Source ${sourceId} synced successfully: deleted ${oldChannelCount}, added ${newData.channelCount}`);
      } catch (error) {
        console.error(`[Scheduler] Error writing data for source ${sourceId}:`, error);
        result.success = false;
        result.error = `Data write failed: ${error.message}`;
        result.new_channels = 0;
      }
    }

    // 记录同步结果
    const finalSuccessCount = results.filter(r => r.success).length;
    const finalFailCount = results.filter(r => !r.success).length;

    console.log(`[Scheduler] Sync completed: ${finalSuccessCount}/${enabledSources.length} sources synced, ${finalFailCount} failed`);
    console.log(`[Scheduler] Total: ${totalDeleted} channels deleted, ${totalAdded} channels added`);

    // 清理过期的记录
    await cleanupOldRecords(db);

    // 第三步：只有在所有源都同步成功后，才缓存频道数据到KV
    if (finalFailCount === 0) {
      console.log('[Scheduler] All sources synced successfully, caching channels to KV...');
      const cacheResult = await cacheChannelsToKV(env);
      if (cacheResult.success) {
        console.log(`[Scheduler] Cached ${cacheResult.cachedCount} channels to KV`);

        // 第四步：AI 分类空类型频道（异步，不阻塞主流程）
        if (ctx) {
          console.log('[Scheduler] Scheduling async AI channel classification...');
          ctx.waitUntil(async () => {
            try {
              console.log('[Scheduler] [ASYNC] Starting AI channel classification...');
              const classifyResult = await classifyEmptyTypeChannels(env);
              console.log(`[Scheduler] [ASYNC] AI classified ${classifyResult.classified} channels`);
            } catch (asyncError) {
              console.error('[Scheduler] [ASYNC] AI classification failed:', asyncError);
            }
          });
        }

        // 异步执行 sitemap 和 token 生成（不阻塞主流程）
        // 使用 ctx.waitUntil 确保在后台完成
        if (ctx) {
          console.log('[Scheduler] Scheduling async sitemap and token generation...');
          ctx.waitUntil(async () => {
            try {
              console.log('[Scheduler] [ASYNC] Generating and caching sitemap...');
              const sitemapResult = await generateAndCacheSitemap(env);
              if (sitemapResult.success) {
                console.log('[Scheduler] [ASYNC] Sitemap cached to KV');
              } else {
                console.error('[Scheduler] [ASYNC] Failed to cache sitemap:', sitemapResult.error);
              }

              console.log('[Scheduler] [ASYNC] Generating new token and play addresses...');
              const tokenResult = await generateTokenAndAddresses(env);
              console.log(`[Scheduler] [ASYNC] Token generated: ${tokenResult}`);
            } catch (asyncError) {
              console.error('[Scheduler] [ASYNC] Error in async operations:', asyncError);
            }
          });
        } else {
          // 降级：同步执行（ctx 不可用时）
          console.log('[Scheduler] Generating and caching sitemap...');
          const sitemapResult = await generateAndCacheSitemap(env);
          if (sitemapResult.success) {
            console.log('[Scheduler] Sitemap cached to KV');
          } else {
            console.error('[Scheduler] Failed to cache sitemap:', sitemapResult.error);
          }

          console.log('[Scheduler] Generating new token and play addresses...');
          const tokenResult = await generateTokenAndAddresses(env);
          console.log(`[Scheduler] Token generated: ${tokenResult}`);

          // 同步执行 AI 分类（降级路径）
          console.log('[Scheduler] Running AI channel classification...');
          const classifyResult = await classifyEmptyTypeChannels(env);
          console.log(`[Scheduler] AI classified ${classifyResult.classified} channels`);
        }
      } else {
        console.error('[Scheduler] Failed to cache channels:', cacheResult.error);
      }
    } else {
      console.log(`[Scheduler] Some sources failed (${finalFailCount}), skipping KV cache refresh to maintain stability`);
    }

  } catch (error) {
    console.error('[Scheduler] Error in syncAllSources:', error);
    throw error;
  }
}

// 加载频道类型映射表到内存
async function loadChannelTypeMapping(db) {
  const mapping = new Map();
  try {
    const rows = await db.prepare('SELECT channel_name, type FROM channel_type_mapping').all();
    if (rows.results) {
      for (const row of rows.results) {
        mapping.set(row.channel_name, row.type);
      }
    }
    console.log(`[Scheduler] Loaded ${mapping.size} channel type mappings`);
  } catch (e) {
    console.warn('[Scheduler] Failed to load channel type mapping:', e.message);
  }
  return mapping;
}

// 写入频道数据到数据库
async function writeChannelsToDB(db, channels, adBindings, sourceId, typeMap = null) {
  if (!channels || channels.length === 0) {
    return;
  }

  // 使用批量插入提高性能
  const channelStatements = channels.map(channel => {
    // 优先用映射表的type，其次用channel自带的type
    const type = (typeMap && typeMap.has(channel.channel_name)) ? typeMap.get(channel.channel_name) : (channel.type || '');
    return db.prepare(`
      INSERT INTO channels (source_id, channel_name, group_title, type, logo, play_url, headers, channel_hash, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sourceId,
      channel.channel_name || '',
      channel.group_title || '',
      type,
      channel.logo || '',
      channel.url || '',
      channel.headers || '{}',
      channel.hash || '',
      1  // is_active = 1
    );
  });

  if (channelStatements.length > 0) {
    await db.batch(channelStatements);
  }

  // 批量插入广告绑定（如果表存在）
  if (adBindings && adBindings.length > 0) {
    try {
      const adStatements = adBindings.map(binding =>
        db.prepare(`
          INSERT INTO ad_bindings (source_id, channel_hash, ad_url, ad_duration)
          VALUES (?, ?, ?, ?)
        `).bind(
          sourceId,
          binding.channel_hash,
          binding.ad_url || '',
          binding.ad_duration || 0
        )
      );

      if (adStatements.length > 0) {
        await db.batch(adStatements);
      }
    } catch (adError) {
      // 如果ad_bindings表不存在，忽略错误
      console.warn('[Scheduler] Failed to insert ad bindings:', adError.message);
    }
  }
}

// 刷新缓存（每10分钟执行）
async function refreshCache(db, env) {
  try {
    console.log('[Scheduler] Refreshing cache...');

    // 清理过期的记录
    await cleanupOldRecords(db);

    // 缓存频道数据到 KV
    const cacheResult = await cacheChannelsToKV(env);
    if (cacheResult.success) {
      console.log(`[Scheduler] Cache refreshed: ${cacheResult.cachedCount} channels cached`);
    } else {
      console.error('[Scheduler] Failed to refresh cache:', cacheResult.error);
    }

    console.log('[Scheduler] Cache refresh completed');
  } catch (error) {
    console.error('[Scheduler] Error in refreshCache:', error);
    throw error;
  }
}

// 清理过期记录
async function cleanupOldRecords(db) {
  try {
    // 清理过期的 play_logs 记录（超过10分钟）
    const tenMinutesAgo = new Date(Date.now() - 600000).toISOString();
    const deleteResult = await db.prepare(`
      DELETE FROM play_logs
      WHERE played_at < ?
    `).bind(tenMinutesAgo).run();

    if (deleteResult.meta?.changes > 0) {
      console.log(`[Scheduler] Cleaned up ${deleteResult.meta.changes} expired play_logs records`);
    }

    // 清理旧的 ip_access_logs 记录（7天前）
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const deleteIpResult = await db.prepare(`
      DELETE FROM ip_access_logs
      WHERE created_date < ?
    `).bind(sevenDaysAgo).run();

    if (deleteIpResult.meta?.changes > 0) {
      console.log(`[Scheduler] Cleaned up ${deleteIpResult.meta.changes} old ip_access_logs records`);
    }

    // 清理旧的 subscription_ips 记录（30天前）
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const deleteSubResult = await db.prepare(`
      DELETE FROM subscription_ips
      WHERE created_date < ?
    `).bind(thirtyDaysAgo).run();

    if (deleteSubResult.meta?.changes > 0) {
      console.log(`[Scheduler] Cleaned up ${deleteSubResult.meta.changes} old subscription_ips records`);
    }

    // 清理旧的 ad_play_logs 记录（7天前）
    const deleteAdLogsResult = await db.prepare(`
      DELETE FROM ad_play_logs
      WHERE played_at < datetime('now', '-7 days')
    `).run();

    if (deleteAdLogsResult.meta?.changes > 0) {
      console.log(`[Scheduler] Cleaned up ${deleteAdLogsResult.meta.changes} old ad_play_logs records`);
    }

  } catch (error) {
    console.error('[Scheduler] Error in cleanupOldRecords:', error);
  }
}

// 手动同步所有数据源（供管理员手动触发）
export async function manualSyncAll(env, filter = null) {
  // 尝试获取 KV 分布式锁
  if (!await acquireKVLock(env, LOCK_KEY_SYNC, LOCK_TTL_SECONDS)) {
    console.log('[Scheduler] Manual sync skipped: sync lock is held by another instance');
    return { success: false, error: '同步任务正在进行中，请稍后再试' };
  }

  console.log('[Scheduler] Manual sync started (KV lock acquired)');

  try {
    const db = await initDB(env);
    if (!db) {
      console.error('[Scheduler] Failed to initialize database');
      return { success: false, error: 'Database initialization failed' };
    }

    // 如果没有传入 filter，加载默认配置
    if (!filter) {
      filter = {};
    }

    // 加载类型映射配置
    try {
      const typeMappingConfig = await getTypeMappingConfig();
      filter.typeMappingConfig = typeMappingConfig;
      console.log('[Scheduler] Loaded type mapping config');
    } catch (error) {
      console.error('[Scheduler] Failed to load type mapping config:', error);
    }

    // 获取所有启用的数据源
    const sources = await db.prepare(`
      SELECT id, name, url, type, parse_mode
      FROM sources
      WHERE is_active = 1
      ORDER BY id
    `).all();

    if (!sources.results || sources.results.length === 0) {
      return { success: true, message: '没有启用的数据源', results: [] };
    }

    const enabledSources = sources.results;
    const results = [];
    const syncData = {}; // 暂存每个源的新数据 {sourceId: {channels, adBindings}}

    // 第一步：获取所有数据源的新数据（不删除旧数据）
    for (const source of enabledSources) {
      try {
        console.log(`[Scheduler] Fetching data for source ${source.id}: ${source.name}`);

        // 同步新频道（只获取数据，不删除）
        const syncResult = await fetchAndParseM3UOnly(source.url, source.id, filter);

        if (syncResult.success && syncResult.channelCount > 0) {
          // 暂存新数据
          syncData[source.id] = {
            channels: syncResult.channels,
            adBindings: syncResult.adBindings,
            channelCount: syncResult.channelCount
          };

          results.push({
            source_id: source.id,
            source_name: source.name,
            success: true,
            deleted_channels: 0,
            new_channels: syncResult.channelCount,
            error: null
          });
          console.log(`[Scheduler] Source ${source.id} data fetched: ${syncResult.channelCount} channels`);
        } else {
          // 获取数据失败
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: false,
            deleted_channels: 0,
            new_channels: 0,
            error: syncResult.error || 'No channels fetched'
          });
          console.error(`[Scheduler] Source ${source.id} fetch failed: ${syncResult.error}`);
        }
      } catch (error) {
        console.error(`[Scheduler] Error fetching source ${source.id}:`, error);
        results.push({
          source_id: source.id,
          source_name: source.name,
          success: false,
          deleted_channels: 0,
          new_channels: 0,
          error: error.message
        });
      }
    }

    // 第二步：加载频道类型映射（用于同步时回填type）
    const typeMap = await loadChannelTypeMapping(db);

    // 只更新成功获取数据的源
    for (const result of results) {
      if (!result.success) continue;

      const sourceId = result.source_id;
      const newData = syncData[sourceId];

      if (!newData) {
        console.error(`[Scheduler] No data found for source ${sourceId}, skipping`);
        continue;
      }

      try {
        // 获取旧的频道数量
        const oldCountResult = await db.prepare('SELECT COUNT(*) as count FROM channels WHERE source_id = ?').bind(sourceId).first();
        const oldChannelCount = oldCountResult?.count || 0;

        // 删除旧频道
        console.log(`[Scheduler] Deleting old channels for source ${sourceId}`);
        await db.prepare('DELETE FROM channels WHERE source_id = ?').bind(sourceId).run();

        // 写入新频道数据（直接使用暂存的数据，带type回填）
        console.log(`[Scheduler] Writing new channels for source ${sourceId}`);
        await writeChannelsToDB(db, newData.channels, newData.adBindings, sourceId, typeMap);

        // 更新源的同步时间
        const now = new Date().toISOString();
        await db.prepare(`UPDATE sources SET last_updated = ? WHERE id = ?`).bind(now, sourceId).run();
        console.log(`[Scheduler] Updated last_updated time for source ${sourceId}`);

        // 更新结果中的删除数量
        result.deleted_channels = oldChannelCount;
        console.log(`[Scheduler] Source ${sourceId} synced successfully: deleted ${oldChannelCount}, added ${newData.channelCount}`);
      } catch (error) {
        console.error(`[Scheduler] Error writing data for source ${sourceId}:`, error);
        result.success = false;
        result.error = `Data write failed: ${error.message}`;
        result.new_channels = 0;
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`[Scheduler] Manual sync completed: ${successCount}/${enabledSources.length} sources synced, ${failCount} failed`);

    // 第三步：只有在所有源都同步成功后，才缓存频道数据到KV
    if (failCount === 0) {
      console.log('[Scheduler] All sources synced successfully, caching channels to KV...');
      const cacheResult = await cacheChannelsToKV(env);
      if (cacheResult.success) {
        console.log(`[Scheduler] Cached ${cacheResult.cachedCount} channels to KV`);

        // 生成sitemap并缓存
        console.log('[Scheduler] Generating and caching sitemap...');
        const sitemapResult = await generateAndCacheSitemap(env);
        if (sitemapResult.success) {
          console.log('[Scheduler] Sitemap cached to KV');
        } else {
          console.error('[Scheduler] Failed to cache sitemap:', sitemapResult.error);
        }


      } else {
        console.error('[Scheduler] Failed to cache channels:', cacheResult.error);
      }
    } else {
      console.log(`[Scheduler] Some sources failed (${failCount}), skipping KV cache refresh to maintain stability`);
    }

    const returnResult = {
      success: true,
      message: `同步完成: ${successCount}个源成功, ${failCount}个源失败`,
      success_count: successCount,
      fail_count: failCount,
      results
    };

    // 保存同步结果到KV，供前端轮询获取
    await env.KV.put('sync:last_result', JSON.stringify(returnResult), { expirationTtl: 3600 });

    return returnResult;
  } catch (error) {
    console.error('[Scheduler] Error in manualSyncAll:', error);
    const returnResult = { success: false, error: error.message };
    // 保存错误结果到KV
    await env.KV.put('sync:last_result', JSON.stringify(returnResult), { expirationTtl: 3600 });
    return returnResult;
  } finally {
    await releaseKVLock(env, LOCK_KEY_SYNC);
    console.log('[Scheduler] Manual sync lock released');
  }
}

/**
 * 清理过期90天的免费订阅
 * 删除过期超过90天且超过90天未签到的订阅及其相关数据
 */
async function cleanupExpiredFreeSubscriptions(db) {
  try {
    console.log('[Cleanup] Starting cleanup of expired free subscriptions');

    // 查找过期超过90天且超过90天未签到的订阅
    const expiredSubs = await db.prepare(`
      SELECT id, sub_id, expired_at, last_checkin
      FROM free_subscriptions
      WHERE expired_at < datetime('now', '-90 days')
        AND (last_checkin IS NULL OR last_checkin < datetime('now', '-90 days'))
    `).all();

    if (!expiredSubs.results || expiredSubs.results.length === 0) {
      console.log('[Cleanup] No expired subscriptions to clean up');
      return;
    }

    console.log(`[Cleanup] Found ${expiredSubs.results.length} expired subscriptions to clean up`);

    // 删除这些订阅及其相关数据（签到记录会通过外键级联删除）
    for (const sub of expiredSubs.results) {
      await db.prepare(`
        DELETE FROM free_subscriptions WHERE id = ?
      `).bind(sub.id).run();

      console.log(`[Cleanup] Deleted expired subscription: ${sub.sub_id}`);
    }

    console.log(`[Cleanup] Cleanup completed: deleted ${expiredSubs.results.length} expired subscriptions`);
  } catch (error) {
    console.error('[Cleanup] Error cleaning up expired subscriptions:', error);
  }
}
