// 内存缓存管理器 - 减少数据库写入频率
// 使用 KV 作为备份，防止数据丢失

// 播放计数缓存
const playCountCache = new Map(); // { "code:hash:date": count }

// IP 访问计数缓存
const ipAccessCache = new Map(); // { "ip:path:date": count }

// 导出缓存变量，供外部直接访问
export { playCountCache, ipAccessCache };

// 缓存最后刷新时间
let lastCacheFlush = Date.now();

// 缓存刷新间隔（10分钟）
const CACHE_FLUSH_INTERVAL = 10 * 60 * 1000;

/**
 * 初始化缓存（从 KV 恢复）
 */
export async function initCache(env) {
  if (!env?.KV) return;

  try {
    const cacheData = await env.KV.get('memory_cache_backup', { type: 'json' });
    if (cacheData) {
      // 恢复播放计数缓存
      if (cacheData.playCountCache) {
        Object.entries(cacheData.playCountCache).forEach(([key, value]) => {
          playCountCache.set(key, value);
        });
      }

      // 恢复 IP 访问缓存
      if (cacheData.ipAccessCache) {
        Object.entries(cacheData.ipAccessCache).forEach(([key, value]) => {
          ipAccessCache.set(key, value);
        });
      }

      // 恢复最后刷新时间
      if (cacheData.lastCacheFlush) {
        lastCacheFlush = cacheData.lastCacheFlush;
      }

      console.log('Cache restored from KV:', {
        playCounts: playCountCache.size,
        ipAccess: ipAccessCache.size
      });
    }
  } catch (error) {
    console.error('Failed to restore cache from KV:', error);
  }
}

/**
 * 备份缓存到 KV
 */
export async function backupCache(env) {
  if (!env?.KV) return;

  try {
    const cacheData = {
      playCountCache: Object.fromEntries(playCountCache),
      ipAccessCache: Object.fromEntries(ipAccessCache),
      lastCacheFlush: Date.now()
    };

    await env.KV.put('memory_cache_backup', JSON.stringify(cacheData), {
      expirationTtl: CACHE_FLUSH_INTERVAL / 1000 + 60
    });

    console.log('Cache backed up to KV:', {
      playCounts: playCountCache.size,
      ipAccess: ipAccessCache.size
    });
  } catch (error) {
    console.error('Failed to backup cache to KV:', error);
  }
}

/**
 * 增加播放计数（缓存）
 */
export function incrementPlayCount(code, channelHash, date) {
  const key = `${code}:${channelHash}:${date}`;
  const current = playCountCache.get(key) || 0;
  playCountCache.set(key, current + 1);
  return current + 1;
}

/**
 * 获取播放计数（从缓存）
 */
export function getPlayCount(code, channelHash, date) {
  const key = `${code}:${channelHash}:${date}`;
  return playCountCache.get(key) || 0;
}

/**
 * 增加 IP 访问计数（缓存）
 */
export function incrementIPAccess(ip, path, date) {
  const key = `${ip}:${path}:${date}`;
  const current = ipAccessCache.get(key) || 0;
  ipAccessCache.set(key, current + 1);
  return current + 1;
}

/**
 * 获取 IP 访问计数（从缓存）
 */
export function getIPAccessCount(ip, path, date) {
  const key = `${ip}:${path}:${date}`;
  return ipAccessCache.get(key) || 0;
}

/**
 * 获取 IP 总访问计数（所有路径）
 */
export function getIPTotalAccess(ip, date) {
  let total = 0;
  const prefix = `${ip}:`;

  for (const [key, count] of ipAccessCache.entries()) {
    if (key.startsWith(prefix) && key.endsWith(`:${date}`)) {
      total += count;
    }
  }

  return total;
}

/**
 * 刷新缓存到数据库
 */
export async function flushCacheToDB(env, ctx) {
  const now = Date.now();

  // 检查是否到达刷新时间
  if (now - lastCacheFlush < CACHE_FLUSH_INTERVAL) {
    return false;
  }

  console.log('Flushing cache to database...');

  try {
    const { getDB } = await import('../database.js');
    const db = getDB();
    const today = new Date().toISOString().split('T')[0];

    // 批量写入播放计数到 play_counts 表
    const playBatch = [];
    for (const [key, count] of playCountCache.entries()) {
      const [code, channelHash, date] = key.split(':');
      if (date === today) {
        playBatch.push({ code, channelHash, count });
      }
    }

    if (playBatch.length > 0) {
      for (const { code, channelHash, count } of playBatch) {
        // 使用 INSERT OR REPLACE 更新计数
        await db.prepare(`
          INSERT OR REPLACE INTO play_counts (code, channel_hash, play_count, created_date, updated_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(code, channelHash, count, today).run();
      }

      console.log(`Flushed ${playBatch.length} play count records to play_counts table`);
    }

    // 批量写入 IP 访问计数
    const ipBatch = [];
    for (const [key, count] of ipAccessCache.entries()) {
      const [ip, path, date] = key.split(':');
      if (date === today) {
        ipBatch.push({ ip, path, count });
      }
    }

    if (ipBatch.length > 0) {
      for (const { ip, path, count } of ipBatch) {
        const existing = await db.prepare(`
          SELECT request_count FROM ip_access_logs
          WHERE ip = ? AND path = ? AND created_date = ?
        `).bind(ip, path, today).first();

        if (existing) {
          // 只在计数有变化时才更新
          if (existing.request_count !== count) {
            await db.prepare(`
              UPDATE ip_access_logs
              SET request_count = ?, last_access = CURRENT_TIMESTAMP
              WHERE ip = ? AND path = ? AND created_date = ?
            `).bind(count, ip, path, today).run();
          }
        } else {
          // 插入新记录
          await db.prepare(`
            INSERT INTO ip_access_logs (ip, path, request_count, created_date)
            VALUES (?, ?, ?, ?)
          `).bind(ip, path, count, today).run();
        }
      }

      console.log(`Flushed ${ipBatch.length} IP access records`);
    }

    // 清空今日的缓存
    playCountCache.clear();
    ipAccessCache.clear();

    // 更新最后刷新时间
    lastCacheFlush = now;

    // 备份到 KV
    await backupCache(env);

    console.log('Cache flushed successfully');
    return true;
  } catch (error) {
    console.error('Failed to flush cache:', error);
    return false;
  }
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return {
    playCountEntries: playCountCache.size,
    ipAccessEntries: ipAccessCache.size,
    lastFlush: new Date(lastCacheFlush).toISOString(),
    nextFlush: new Date(lastCacheFlush + CACHE_FLUSH_INTERVAL).toISOString()
  };
}

/**
 * 清空缓存
 */
export function clearCache() {
  playCountCache.clear();
  ipAccessCache.clear();
  lastCacheFlush = Date.now();
}
