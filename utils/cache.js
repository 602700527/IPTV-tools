// 内存缓存管理器 - 减少数据库写入频率
// 使用 KV 作为备份，防止数据丢失

// 播放计数缓存
const playCountCache = new Map(); // { "code:hash:date": count }

// IP 访问计数缓存
const ipAccessCache = new Map(); // { "ip:path:date": count }

// 订阅IP缓存（用于减少数据库查询）
const subscriptionIPCache = new Map(); // { "code:date": Set<IP> }
const subscriptionIPTimestamp = new Map(); // { "code:ip": timestamp } - 记录IP订阅时间

// 导出缓存变量，供外部直接访问
export { playCountCache, ipAccessCache, subscriptionIPCache, subscriptionIPTimestamp };

// 导出获取缓存状态的函数（用于调试）
export function getSubscriptionIPCacheStatus() {
  const status = {};
  for (const [key, value] of subscriptionIPCache.entries()) {
    status[key] = {
      ips: Array.from(value),
      count: value.size
    };
  }
  return status;
}

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

      // 恢复订阅IP缓存
      if (cacheData.subscriptionIPCache) {
        Object.entries(cacheData.subscriptionIPCache).forEach(([key, value]) => {
          subscriptionIPCache.set(key, new Set(value));
        });
      }

      // 恢复订阅IP时间戳
      if (cacheData.subscriptionIPTimestamp) {
        Object.entries(cacheData.subscriptionIPTimestamp).forEach(([key, value]) => {
          subscriptionIPTimestamp.set(key, value);
        });
      }

      // 恢复最后刷新时间
      if (cacheData.lastCacheFlush) {
        lastCacheFlush = cacheData.lastCacheFlush;
      }

      console.log('Cache restored from KV:', {
        playCounts: playCountCache.size,
        ipAccess: ipAccessCache.size,
        subscriptionIPs: subscriptionIPCache.size
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
      subscriptionIPCache: Object.fromEntries(
        Array.from(subscriptionIPCache.entries()).map(([key, value]) => [key, Array.from(value)])
      ),
      subscriptionIPTimestamp: Object.fromEntries(subscriptionIPTimestamp),
      lastCacheFlush: Date.now()
    };

    await env.KV.put('memory_cache_backup', JSON.stringify(cacheData), {
      expirationTtl: CACHE_FLUSH_INTERVAL / 1000 + 60
    });

    console.log('Cache backed up to KV:', {
      playCounts: playCountCache.size,
      ipAccess: ipAccessCache.size,
      subscriptionIPs: subscriptionIPCache.size
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
 * 检查并添加订阅IP到缓存
 * @param {string} code - 卡密
 * @param {string} ip - 客户端IP
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @param {number} maxIPs - 最大IP数
 * @returns {boolean} 是否允许订阅
 */
export function checkAndAddSubscriptionIP(code, ip, date, maxIPs) {
  const cacheKey = `${code}:${date}`;
  const timestampKey = `${code}:${ip}`;
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  console.log(`[Cache checkAndAdd] Code: ${code}, IP: ${ip}, Date: ${date}, maxIPs: ${maxIPs}`);

  // 获取或创建IP集合
  if (!subscriptionIPCache.has(cacheKey)) {
    subscriptionIPCache.set(cacheKey, new Set());
    console.log(`[Cache checkAndAdd] Created new IP set for ${cacheKey}`);
  }

  const ipSet = subscriptionIPCache.get(cacheKey);

  // 检查IP是否在30分钟内已存在
  const lastTimestamp = subscriptionIPTimestamp.get(timestampKey);
  if (lastTimestamp && now - lastTimestamp < thirtyMinutes) {
    // 30分钟内已存在，允许但不更新时间戳
    console.log(`[Cache checkAndAdd] IP ${ip} already in cache (within 30min)`);
    return true;
  }

  // 如果IP已存在于集合中但已超过30分钟，先移除（重新计时）
  if (ipSet.has(ip)) {
    ipSet.delete(ip);
    console.log(`[Cache checkAndAdd] Removed expired IP ${ip} for re-adding`);
  }

  // 新IP或30分钟后的旧IP，添加到缓存（不限制数量）
  ipSet.add(ip);
  subscriptionIPTimestamp.set(timestampKey, now);
  console.log(`[Cache checkAndAdd] Added IP ${ip} to cache, total: ${ipSet.size}`);
  return true;
}

/**
 * 检查订阅IP是否在缓存中（用于播放验证）
 * @param {string} code - 卡密
 * @param {string} ip - 客户端IP
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @returns {boolean} IP是否在授权列表中
 */
export function isSubscriptionIPAuthorized(code, ip, date) {
  const cacheKey = `${code}:${date}`;
  const timestampKey = `${code}:${ip}`;
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  const ipSet = subscriptionIPCache.get(cacheKey);
  if (!ipSet || !ipSet.has(ip)) {
    return false;
  }

  // 检查时间戳是否在30分钟内
  const lastTimestamp = subscriptionIPTimestamp.get(timestampKey);
  if (!lastTimestamp || now - lastTimestamp >= thirtyMinutes) {
    return false;
  }

  return true;
}

/**
 * 获取订阅IP列表（用于播放验证）
 * @param {string} code - 卡密
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @param {number} maxIPs - 最大IP数
 * @returns {Set<string>} 授权的IP集合
 */
export function getAuthorizedSubscriptionIPs(code, date, maxIPs) {
  const cacheKey = `${code}:${date}`;
  const ipSet = subscriptionIPCache.get(cacheKey);

  console.log(`[Cache getAuthorized] Looking up ${cacheKey}`);
  console.log(`[Cache getAuthorized] subscriptionIPCache size: ${subscriptionIPCache.size}, keys: ${Array.from(subscriptionIPCache.keys()).join(', ')}`);

  if (!ipSet) {
    console.log(`[Cache getAuthorized] No IP set found for ${cacheKey}`);
    return new Set();
  }

  console.log(`[Cache getAuthorized] IP set size: ${ipSet.size}, IPs: ${Array.from(ipSet).join(', ')}`);

  // 按时间戳排序，取最新的maxIPs个（不限制30分钟）
  const now = Date.now();

  const validIPs = [];
  for (const ip of ipSet) {
    const timestampKey = `${code}:${ip}`;
    const lastTimestamp = subscriptionIPTimestamp.get(timestampKey);

    console.log(`[Cache getAuthorized] Checking IP ${ip}, timestamp: ${lastTimestamp}, age: ${lastTimestamp ? Math.floor((now - lastTimestamp) / 1000) + 's' : 'null'}`);

    if (lastTimestamp) {
      validIPs.push({ ip, timestamp: lastTimestamp });
    }
  }

  // 按时间戳降序排序，取最新的maxIPs个
  validIPs.sort((a, b) => b.timestamp - a.timestamp);
  const latestIPs = validIPs.slice(0, maxIPs).map(item => item.ip);

  console.log(`[Cache getAuthorized] Returning ${latestIPs.length} IPs: ${latestIPs.join(', ')}`);

  return new Set(latestIPs);
}

/**
 * 清理过期的订阅IP缓存
 */
export function cleanupExpiredSubscriptionIPs() {
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  let cleanedCount = 0;

  for (const [cacheKey, ipSet] of subscriptionIPCache.entries()) {
    const [code, date] = cacheKey.split(':');

    // 检查每个IP的时间戳
    const toRemove = [];
    for (const ip of ipSet) {
      const timestampKey = `${code}:${ip}`;
      const lastTimestamp = subscriptionIPTimestamp.get(timestampKey);

      if (!lastTimestamp || now - lastTimestamp >= thirtyMinutes) {
        toRemove.push(ip);
        subscriptionIPTimestamp.delete(timestampKey);
        cleanedCount++;
      }
    }

    // 从集合中移除过期IP
    toRemove.forEach(ip => ipSet.delete(ip));

    // 如果集合为空，删除整个缓存项
    if (ipSet.size === 0) {
      subscriptionIPCache.delete(cacheKey);
    }
  }

  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired subscription IPs from cache`);
  }

  return cleanedCount;
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

    // 1. 批量写入播放计数到 play_counts 表
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

    // 2. 批量写入 IP 访问计数
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

    // 3. 批量写入订阅IP到 subscription_ips 表
    // 注意：不立即清空订阅IP缓存，只清理过期的IP
    const cleanedCount = cleanupExpiredSubscriptionIPs();

    const subIPBatch = [];
    for (const [cacheKey, ipSet] of subscriptionIPCache.entries()) {
      const [code, date] = cacheKey.split(':');

      for (const ip of ipSet) {
        const timestampKey = `${code}:${ip}`;
        const timestamp = subscriptionIPTimestamp.get(timestampKey);

        if (timestamp) {
          subIPBatch.push({
            code,
            ip,
            subscribed_at: new Date(timestamp).toISOString(),
            date
          });
        }
      }
    }

    if (subIPBatch.length > 0) {
      let insertedCount = 0;
      let skippedCount = 0;

      for (const { code, ip, subscribed_at, date } of subIPBatch) {
        // 检查是否已存在（去重）
        const existing = await db.prepare(`
          SELECT id FROM subscription_ips
          WHERE code = ? AND client_ip = ? AND subscribed_at = ? AND created_date = ?
        `).bind(code, ip, subscribed_at, date).first();

        if (!existing) {
          // 插入新记录
          await db.prepare(`
            INSERT INTO subscription_ips (code, client_ip, subscribed_at, created_date)
            VALUES (?, ?, ?, ?)
          `).bind(code, ip, subscribed_at, date).run();
          insertedCount++;
        } else {
          skippedCount++;
        }
      }

      console.log(`Flushed ${insertedCount} subscription IP records (skipped ${skippedCount} duplicates, cleaned ${cleanedCount} expired IPs)`);
    }

    // 清空播放计数和IP访问计数缓存
    playCountCache.clear();
    ipAccessCache.clear();

    // 注意：不清空订阅IP缓存，因为它需要持续运行
    // subscriptionIPCache 和 subscriptionIPTimestamp 保持运行状态
    // cleanupExpiredSubscriptionIPs() 会定期清理过期IP

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
    subscriptionIPEntries: subscriptionIPCache.size,
    subscriptionIPTimestampEntries: subscriptionIPTimestamp.size,
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
  subscriptionIPCache.clear();
  subscriptionIPTimestamp.clear();
  lastCacheFlush = Date.now();
}
