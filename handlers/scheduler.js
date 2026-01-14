// 定时任务处理器：自动同步已启用的数据源和刷新缓存
import { getDB, fetchAndParseM3U, fetchAndParseM3UOnly, initDB, getSyncFilterConfig } from '../database.js';
import { cacheChannelsToKV } from '../utils/channel-cache.js';
import { flushCacheToDB } from '../utils/cache.js';

// 并发控制锁
let syncInProgress = false;
let cacheRefreshInProgress = false;

// 导出内部函数供测试使用
export { syncAllSources, refreshCache };

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
      if (syncInProgress) {
        console.log('[Scheduler] Data source sync already in progress, skipping');
        return;
      }

      syncInProgress = true;
      console.log('[Scheduler] Starting data source sync');

      try {
        await syncAllSources(db, env);
      } finally {
        syncInProgress = false;
      }
    } else if ((hour === 9 || hour === 21) && minute === 0) {
      // 每天9:00, 15:00, 21:00刷新缓存（确保数据源同步完成）
      if (cacheRefreshInProgress) {
        console.log('[Scheduler] Cache refresh already in progress, skipping');
        return;
      }

      cacheRefreshInProgress = true;
      console.log('[Scheduler] Starting cache refresh');

      try {
        await refreshCache(db, env);
      } finally {
        cacheRefreshInProgress = false;
      }
    } else {
      console.log(`[Scheduler] No task scheduled for this time (${hour}:${minute})`);
    }

  } catch (error) {
    console.error('[Scheduler] Error in scheduled event:', error);
    syncInProgress = false;
    cacheRefreshInProgress = false;
  }
}

// 同步所有数据源（每天3:00执行）
async function syncAllSources(db, env) {
  try {
    // 获取同步过滤规则配置
    let filter = null;
    try {
      filter = await getSyncFilterConfig();
      console.log('[Scheduler] Loaded sync filter config:', filter);
    } catch (error) {
      console.error('[Scheduler] Failed to load sync filter config:', error);
      filter = null;
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

        // 写入新频道数据（直接使用暂存的数据）
        console.log(`[Scheduler] Writing new channels for source ${sourceId}`);
        await writeChannelsToDB(db, newData.channels, newData.adBindings, sourceId);
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

// 写入频道数据到数据库
async function writeChannelsToDB(db, channels, adBindings, sourceId) {
  if (!channels || channels.length === 0) {
    return;
  }

  // 使用批量插入提高性能
  const channelStatements = channels.map(channel =>
    db.prepare(`
      INSERT INTO channels (source_id, channel_name, group_title, logo, play_url, headers, channel_hash, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sourceId,
      channel.channel_name || '',
      channel.group_title || '',
      channel.logo || '',
      channel.url || '',
      channel.headers || '{}',
      channel.hash || '',
      1  // is_active = 1
    )
  );

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

    // 清理旧的 play_counts 记录（7天前）
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const deleteCountsResult = await db.prepare(`
      DELETE FROM play_counts
      WHERE created_date < ?
    `).bind(sevenDaysAgo).run();

    if (deleteCountsResult.meta?.changes > 0) {
      console.log(`[Scheduler] Cleaned up ${deleteCountsResult.meta.changes} old play_counts records`);
    }

    // 清理旧的 ip_access_logs 记录（7天前）
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
  try {
    console.log('[Scheduler] Manual sync started');

    const db = await initDB(env);
    if (!db) {
      console.error('[Scheduler] Failed to initialize database');
      return { success: false, error: 'Database initialization failed' };
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

    // 第二步：只更新成功获取数据的源
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

        // 写入新频道数据（直接使用暂存的数据）
        console.log(`[Scheduler] Writing new channels for source ${sourceId}`);
        await writeChannelsToDB(db, newData.channels, newData.adBindings, sourceId);

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
      } else {
        console.error('[Scheduler] Failed to cache channels:', cacheResult.error);
      }
    } else {
      console.log(`[Scheduler] Some sources failed (${failCount}), skipping KV cache refresh to maintain stability`);
    }

    return {
      success: true,
      message: `同步完成: ${successCount}个源成功, ${failCount}个源失败`,
      results
    };
  } catch (error) {
    console.error('[Scheduler] Error in manualSyncAll:', error);
    return { success: false, error: error.message };
  }
}
