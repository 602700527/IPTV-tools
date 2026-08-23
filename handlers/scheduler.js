// 定时任务处理器：自动同步已启用的数据源和刷新缓存
import { getDB, fetchAndParseM3U, fetchAndParseM3UOnly, initDB, getSyncFilterConfig, getTypeMappingConfig } from '../database.js';
import { cacheChannelsToKV, generateAndCacheSitemap } from '../utils/channel-cache.js';
import { saveStaticFile } from '../utils/static-storage.js';
import { generateTokenAndAddresses } from '../utils/token-manager.js';
import { classifyEmptyTypeChannels } from './ai-classify.js';
import { sendEmail, generateVipExpiringHtml, generateVipExpiredHtml, generateReEngagementHtml } from '../utils/email.js';

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
export { syncAllSources, refreshCache, generateAndCacheSitemap, refreshStaticPages };

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

    // 每天4:00执行独立token生成任务（在同步任务之后）
    if (hour === 4 && minute === 0) {
      // 先等待同步锁释放
      console.log('[Scheduler] [Token] Checking if sync lock is held...');
      const canProceed = await waitForSyncLockRelease(env, 3, 30000);

      if (!canProceed) {
        console.log('[Scheduler] [Token] Sync still in progress, skipping token generation');
        return;
      }

      console.log('[Scheduler] [Token] Starting independent token generation');
      try {
        const tokenResult = await generateTokenAndAddresses(env);
        console.log(`[Scheduler] [Token] Token generated: ${tokenResult}`);
      } catch (error) {
        console.error('[Scheduler] [Token] Token generation failed:', error);
      }
      return;
    }

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
        // Regenerate static pages so R2/KV has fresh content for bots
        await refreshStaticPages(env);
      } finally {
        await releaseKVLock(env, LOCK_KEY_CACHE_REFRESH);
        console.log('[Scheduler] Cache refresh lock released');
      }
    } else if (hour === 10 && minute === 0) {
      // 每天10:00 — 客户成功 lifecycle 邮件（VIP 临到期 / 失活挽留）
      console.log('[Scheduler] [Lifecycle] Starting daily lifecycle email scan');
      try {
        await sendLifecycleEmails(db, env);
      } catch (error) {
        console.error('[Scheduler] [Lifecycle] Failed:', error);
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
        } else {
          // 降级：同步执行 AI 分类（ctx 不可用时）
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

// 刷新静态页面（在缓存刷新后执行，确保 R2/KV 有最新内容）
async function refreshStaticPages(env) {
  try {
    console.log('[Scheduler] Refreshing static pages...');

    const { getChannelsFromCache, getAllGroups } = await import('../utils/channel-cache.js');
    const { slugify: slugifyUtils } = await import('../utils/search-utils.js');

    // 获取已缓存的频道和分组（KV 内存缓存，秒级响应）
    const cacheData = await getChannelsFromCache(env);
    if (!cacheData || !cacheData.channels || cacheData.channels.length === 0) {
      console.warn('[Scheduler] No cached channels available for static page generation');
      return;
    }

    const origin = env.APP_URL || 'https://iptv-search.com';
    const channels = cacheData.channels;
    const groups = cacheData.groups || [];

    // Slugify 函数（与页面模板一致）
    function slugify(str) {
      if (!str) return '';
      return str.trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u2000-\u206f\u2600-\u26ff\u3000-\u303f\ufe30-\ufe4f-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    function escapeHtml(s) {
      if (!s) return '';
      return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    // 按分组聚合频道
    const grouped = {};
    for (const ch of channels) {
      const g = ch.group_title || 'Other';
      if (!grouped[g]) grouped[g] = [];
      grouped[g].push(ch);
    }

    // ── 1. Homepage ──────────────────────────────────────────────────────────
    try {
      const { generateHomePage } = await import('../pages/home-page.js');
      const regionCats = Object.keys(grouped).sort((a, b) => grouped[b].length - grouped[a].length).map(g => ({
        name: g, slug: slugify(g), count: grouped[g].length
      }));
      const html = generateHomePage({
        origin,
        regionCategories: regionCats.slice(0, 50),
        typeCategories: [],
        totalChannels: channels.length,
        totalGroups: groups.length
      });
      await saveStaticFile(env, '/index.html', html);
      console.log(`[StaticPages] Homepage: ${channels.length} channels`);
    } catch (e) {
      console.error('[StaticPages] Homepage failed:', e.message);
    }

    // ── 2. Top 20 category pages ────────────────────────────────────────────
    const topGroups = Object.keys(grouped)
      .sort((a, b) => grouped[b].length - grouped[a].length)
      .slice(0, 20);

    for (const group of topGroups) {
      try {
        const catChannels = grouped[group];
        const { generateCategoryPage } = await import('../pages/category-page.js');
        const html = generateCategoryPage({
          origin,
          slug: slugify(group),
          category: group,
          channels: catChannels.map(ch => ({
            name: ch.channel_name, hash: ch.channel_hash, logo: ch.logo, group: ch.group_title
          })),
          totalChannels: catChannels.length
        });
        await saveStaticFile(env, `/category/${slugify(group)}.html`, html);
      } catch (e) {
        console.error(`[StaticPages] Category ${group} failed:`, e.message);
      }
    }

    // ── 3. Top 100 channel pages (by group size) ────────────────────────────
    const topChannelGroups = Object.keys(grouped)
      .sort((a, b) => grouped[b].length - grouped[a].length)
      .slice(0, 20);

    let channelCount = 0;
    for (const group of topChannelGroups) {
      const catChannels = grouped[group].slice(0, 5); // 5 per group = up to 100
      for (const ch of catChannels) {
        try {
          const { generateChannelPage } = await import('../pages/channel-page.js');
          const html = generateChannelPage({
            origin,
            hash: ch.channel_hash,
            channel: {
              name: ch.channel_name,
              group: ch.group_title,
              description: ch.description || '',
              logo: ch.logo,
              sourceName: ch.source_name || ''
            },
            relatedChannels: []
          });
          await saveStaticFile(env, `/channel/${slugify(ch.channel_name)}.html`, html);
          channelCount++;
        } catch (e) {
          console.error(`[StaticPages] Channel ${ch.channel_name} failed:`, e.message);
        }
      }
    }

    console.log(`[StaticPages] Done: ${channelCount} channel pages + ${topGroups.length} category pages`);
  } catch (error) {
    console.error('[Scheduler] refreshStaticPages failed:', error);
  }
}

/**
 * 客户成功 lifecycle 邮件（每日10:00 由 cron 调用）
 * - VIP 临到期 T-3 提醒（每个 user/code 仅发一次，由 lifecycle_emails UNIQUE 去重）
 * - 14+ 天未活跃的 VIP re-engagement
 * - email 发送失败不抛错；记录到 lifecycle_emails 表 + user_orders.expiry_reminded_at
 */
export async function sendLifecycleEmails(db, env) {
  const renewUrl = (env.APP_URL || 'https://iptv-search.com') + '/subscription';
  const browseUrl = env.APP_URL || 'https://iptv-search.com';

  // (a) VIP 临到期 T-3
  const expiring = await db.prepare(`
    SELECT u.id AS user_id, u.email, c.code, c.expired_at,
           CAST((julianday(c.expired_at) - julianday('now')) AS INTEGER) AS days_left
    FROM users u
    JOIN user_orders o ON o.user_id = u.id AND o.status = 'completed'
    JOIN codes c ON c.code = o.code
    WHERE c.status = 'active'
      AND c.expired_at > datetime('now')
      AND c.expired_at < datetime('now', '+3 days')
      AND o.expiry_reminded_at IS NULL
  `).all();

  let sentExpiring = 0;
  for (const row of expiring.results || []) {
    try {
      const html = generateVipExpiringHtml(row.email, row.days_left, renewUrl);
      await sendEmail(row.email, '您的 VIP 还有 ' + row.days_left + ' 天到期 — 续费保留现有设置', html, env);
      await db.prepare('INSERT OR IGNORE INTO lifecycle_emails (user_id, email_type, sent_at) VALUES (?, ?, datetime("now"))')
        .bind(row.user_id, 'vip_expiring_3d').run();
      await db.prepare('UPDATE user_orders SET expiry_reminded_at = datetime("now") WHERE user_id = ? AND code = ?')
        .bind(row.user_id, row.code).run();
      sentExpiring++;
    } catch (error) {
      console.error('[Lifecycle] expiring email failed for', row.email, ':', error.message);
    }
  }

  // (b) 失活 VIP（14+ 天未活跃，按 codes.last_fetched_at）
  // 多 code 用户按 MAX(last_fetched_at) 判定：任一 code 仍在拉 = 用户活跃
  // 同时覆盖"已购买但从未加载 M3U"的用户（IS NULL）
  const lapsed = await db.prepare(`
    SELECT user_id, email, days_since
    FROM (
      SELECT u.id AS user_id, u.email,
             CAST((julianday('now') - julianday(MAX(c.last_fetched_at))) AS INTEGER) AS days_since
      FROM users u
      JOIN user_orders o ON o.user_id = u.id AND o.status = 'completed'
      JOIN codes c ON c.code = o.code
      WHERE c.status = 'active'
        AND c.expired_at > datetime('now')
      GROUP BY u.id, u.email
      HAVING MAX(c.last_fetched_at) IS NULL
          OR MAX(c.last_fetched_at) < datetime('now', '-14 days')
    )
    WHERE NOT EXISTS (
      SELECT 1 FROM lifecycle_emails le
      WHERE le.user_id = user_id AND le.email_type = 're_engagement'
        AND le.sent_at > datetime('now', '-7 days')
    )
    LIMIT 50
  `).all();

  let sentLapsed = 0;
  for (const row of lapsed.results || []) {
    try {
      const html = generateReEngagementHtml(row.email, row.days_since, browseUrl);
      await sendEmail(row.email, row.days_since + ' 天没见您了 — 来看看新频道', html, env);
      await db.prepare('INSERT OR IGNORE INTO lifecycle_emails (user_id, email_type, sent_at) VALUES (?, ?, datetime("now"))')
        .bind(row.user_id, 're_engagement').run();
      sentLapsed++;
    } catch (error) {
      console.error('[Lifecycle] re-engagement failed for', row.email, ':', error.message);
    }
  }

  console.log(`[Lifecycle] Sent ${sentExpiring} expiring + ${sentLapsed} re-engagement emails`);
}
