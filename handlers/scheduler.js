// 定时任务处理器：自动同步已启用的数据源和刷新缓存
import { getDB, fetchAndParseM3U, initDB, getSyncFilterConfig } from '../database.js';
import { cacheChannelsToKV } from '../utils/channel-cache.js';
import { flushCacheToDB } from '../utils/cache.js';

// 并发控制锁
let syncInProgress = false;
let cacheRefreshInProgress = false;

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

    // 每天2:40执行数据源同步
    if (hour === 2 && minute === 40) {
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
    } else {
      // 每10分钟刷新缓存
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
    }

  } catch (error) {
    console.error('[Scheduler] Error in scheduled event:', error);
    syncInProgress = false;
    cacheRefreshInProgress = false;
  }
}

// 同步所有数据源（每天2:40执行）
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

    for (const source of enabledSources) {
      try {
        console.log(`[Scheduler] Syncing source ${source.id}: ${source.name}`);

        // 获取旧的频道数量
        const oldCountResult = await db.prepare('SELECT COUNT(*) as count FROM channels WHERE source_id = ?').bind(source.id).first();
        const oldChannelCount = oldCountResult?.count || 0;

        // 先同步新频道
        console.log(`[Scheduler] Starting fetch and parse for source ${source.id}: ${source.name}`);
        const syncResult = await fetchAndParseM3U(source.url, source.id, filter);

        if (syncResult.success && syncResult.channelCount > 0) {
          // 只有成功获取新频道时才删除旧频道
          console.log(`[Scheduler] Deleting old channels for source ${source.id}`);
          await db.prepare('DELETE FROM channels WHERE source_id = ?').bind(source.id).run();
          totalDeleted += oldChannelCount;
          totalAdded += syncResult.channelCount;

          results.push({
            source_id: source.id,
            source_name: source.name,
            success: true,
            deleted_channels: oldChannelCount,
            new_channels: syncResult.channelCount,
            error: null
          });
          console.log(`[Scheduler] Source ${source.id} synced successfully: deleted ${oldChannelCount}, added ${syncResult.channelCount}`);
        } else {
          // 同步失败或没有新频道，不删除旧频道
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: false,
            deleted_channels: 0,
            new_channels: 0,
            error: syncResult.error || 'No channels fetched'
          });
          console.error(`[Scheduler] Source ${source.id} sync failed: ${syncResult.error}`);
        }
      } catch (error) {
        console.error(`[Scheduler] Error syncing source ${source.id}:`, error);
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

    // 记录同步结果
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`[Scheduler] Sync completed: ${successCount}/${enabledSources.length} sources synced, ${failCount} failed`);
    console.log(`[Scheduler] Total: ${totalDeleted} channels deleted, ${totalAdded} channels added`);

    // 清理过期的记录
    await cleanupOldRecords(db);

    // 缓存频道数据到 KV
    console.log('[Scheduler] Caching channels to KV...');
    const cacheResult = await cacheChannelsToKV(env);
    if (cacheResult.success) {
      console.log(`[Scheduler] Cached ${cacheResult.cachedCount} channels to KV`);
    } else {
      console.error('[Scheduler] Failed to cache channels:', cacheResult.error);
    }

  } catch (error) {
    console.error('[Scheduler] Error in syncAllSources:', error);
    throw error;
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

    // 逐个同步源
    for (const source of enabledSources) {
      try {
        const oldCountResult = await db.prepare('SELECT COUNT(*) as count FROM channels WHERE source_id = ?').bind(source.id).first();
        const oldChannelCount = oldCountResult?.count || 0;

        // 先同步新频道
        const syncResult = await fetchAndParseM3U(source.url, source.id, filter);

        if (syncResult.success && syncResult.channelCount > 0) {
          // 只有成功获取新频道时才删除旧频道
          await db.prepare('DELETE FROM channels WHERE source_id = ?').bind(source.id).run();

          results.push({
            source_id: source.id,
            source_name: source.name,
            success: true,
            deleted_channels: oldChannelCount,
            new_channels: syncResult.channelCount,
            error: null
          });
        } else {
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: false,
            deleted_channels: 0,
            new_channels: 0,
            error: syncResult.error || 'No channels fetched'
          });
        }
      } catch (error) {
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

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`[Scheduler] Manual sync completed: ${successCount}/${enabledSources.length} sources synced, ${failCount} failed`);

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
