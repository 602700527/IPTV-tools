// 定时任务处理器：自动同步已启用的数据源
import { getDB, fetchAndParseM3U, initDB, getSyncFilterConfig } from '../database.js';
import { cacheChannelsToKV } from '../utils/channel-cache.js';

export async function handleScheduledEvent(event, env, ctx) {
  try {
    const now = new Date().toISOString();
    console.log(`[${now}] Scheduled task started: Auto-sync enabled sources`);

    // 初始化数据库
    const db = await initDB(env);
    if (!db) {
      console.error('[Scheduler] Failed to initialize database');
      return;
    }
    console.log('[Scheduler] Database initialized successfully');

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
      console.log('No enabled sources found');
      return;
    }

    const enabledSources = sources.results;
    console.log(`Found ${enabledSources.length} enabled source(s) to sync`);

    // 逐个同步源
    const results = [];
    for (const source of enabledSources) {
      try {
        console.log(`Syncing source ${source.id}: ${source.name}`);

        // 获取旧的频道数量
        const oldCountResult = await db.prepare('SELECT COUNT(*) as count FROM channels WHERE source_id = ?').bind(source.id).first();
        const oldChannelCount = oldCountResult?.count || 0;

        // 删除该源的旧频道（使用更高效的方式：先删除索引列）
        // 先按 source_id 批量删除索引，然后清理表
        await db.prepare('DELETE FROM channels WHERE source_id = ?').bind(source.id).run();

        // 同步新频道（传入过滤规则）
        console.log(`[Sync] Starting fetch and parse for source ${source.id}: ${source.name}`);
        const syncResult = await fetchAndParseM3U(source.url, source.id, filter);
        console.log(`[Sync] Sync result for source ${source.id}:`, syncResult);

        if (syncResult.success) {
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: true,
            deleted_channels: oldChannelCount,
            new_channels: syncResult.channelCount,
            error: null
          });
          console.log(`[Sync] Source ${source.id} synced successfully: deleted ${oldChannelCount}, added ${syncResult.channelCount}`);
        } else {
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: false,
            deleted_channels: oldChannelCount,
            new_channels: 0,
            error: syncResult.error
          });
          console.error(`Source ${source.id} sync failed: ${syncResult.error}`);
        }
      } catch (error) {
        console.error(`Error syncing source ${source.id}:`, error);
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
    const totalDeleted = results.reduce((sum, r) => sum + r.deleted_channels, 0);
    const totalAdded = results.reduce((sum, r) => sum + r.new_channels, 0);

    console.log(`Scheduled task completed: ${successCount}/${enabledSources.length} sources synced, ${failCount} failed`);
    console.log(`Total: ${totalDeleted} channels deleted, ${totalAdded} channels added`);

    // 清理过期的 play_logs 记录（超过10分钟）
    const tenMinutesAgo = new Date(Date.now() - 600000).toISOString();
    const deleteResult = await db.prepare(`
      DELETE FROM play_logs
      WHERE played_at < ?
    `).bind(tenMinutesAgo).run();

    console.log(`Cleaned up ${deleteResult.meta?.changes || 0} expired play_logs records`);

    // 清理旧的 play_counts 记录（7天前）
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const deleteCountsResult = await db.prepare(`
      DELETE FROM play_counts
      WHERE created_date < ?
    `).bind(sevenDaysAgo).run();

    console.log(`Cleaned up ${deleteCountsResult.meta?.changes || 0} old play_counts records`);

    // 清理旧的 ip_access_logs 记录（7天前）
    const deleteIpResult = await db.prepare(`
      DELETE FROM ip_access_logs
      WHERE created_date < ?
    `).bind(sevenDaysAgo).run();

    console.log(`Cleaned up ${deleteIpResult.meta?.changes || 0} old ip_access_logs records`);

    // 缓存频道数据到 KV
    console.log('Caching channels to KV...');
    const cacheResult = await cacheChannelsToKV(env);
    if (cacheResult.success) {
      console.log(`Channels cached successfully: ${cacheResult.channels} channels, ${cacheResult.groups} groups`);
    } else {
      console.error('Failed to cache channels:', cacheResult.error);
    }

    // 可选：将结果存储到KV或发送通知
    // await env.KV.put('last_sync_result', JSON.stringify({
    //   timestamp: new Date().toISOString(),
    //   results
    // }), { expirationTtl: 86400 * 7 });

  } catch (error) {
    console.error('Scheduled task error:', error);
  }
}

// 手动触发同步（用于测试或立即同步）
export async function manualSyncAll(env, filter = null) {
  try {
    // 初始化数据库
    const db = await initDB(env);
    if (!db) {
      console.error('[ManualSync] Failed to initialize database');
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

        // 删除该源的旧频道（使用索引优化的 DELETE）
        await db.prepare('DELETE FROM channels WHERE source_id = ?').bind(source.id).run();
        const syncResult = await fetchAndParseM3U(source.url, source.id, filter);

        if (syncResult.success) {
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
            deleted_channels: oldChannelCount,
            new_channels: 0,
            error: syncResult.error
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

    return {
      success: true,
      message: `同步完成：${successCount}个成功，${failCount}个失败`,
      total_sources: enabledSources.length,
      success_count: successCount,
      fail_count: failCount,
      results
    };
  } catch (error) {
    console.error('Manual sync error:', error);
    return { success: false, error: error.message };
  }
}
