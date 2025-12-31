// 定时任务处理器：自动同步已启用的数据源
import { getDB, fetchAndParseM3U, initDB } from '../database.js';

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

        // 删除该源的旧频道
        await db.prepare('DELETE FROM channels WHERE source_id = ?').bind(source.id).run();

        // 同步新频道
        console.log(`[Sync] Starting fetch and parse for source ${source.id}: ${source.name}`);
        const syncResult = await fetchAndParseM3U(source.url, source.id);
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
