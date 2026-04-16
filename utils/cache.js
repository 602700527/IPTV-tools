// 内存缓存管理器 - 减少数据库写入频率
// 使用 KV 作为备份，防止数据丢失

// IP 访问计数缓存
const ipAccessCache = new Map(); // { "ip:path:date": count }

// 订阅IP缓存（用于减少数据库查询）
const subscriptionIPCache = new Map(); // { "code:date": Set<IP> }
const subscriptionIPTimestamp = new Map(); // { "code:ip": timestamp } - 记录IP订阅时间

// 导出缓存变量，供外部直接访问
export { ipAccessCache, subscriptionIPCache, subscriptionIPTimestamp };

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
      ipAccess: ipAccessCache.size,
      subscriptionIPs: subscriptionIPCache.size
    });
  } catch (error) {
    console.error('Failed to backup cache to KV:', error);
  }
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
 * 清理过期的订阅IP缓存（只保留最新的10个记录）
 */
export function cleanupExpiredSubscriptionIPs() {
  let cleanedCount = 0;

  for (const [cacheKey, ipSet] of subscriptionIPCache.entries()) {
    const [code] = cacheKey.split(':');

    // 将IP转换为数组并按时间戳排序
    const ipArray = Array.from(ipSet).map(ip => {
      const timestampKey = `${code}:${ip}`;
      const timestamp = subscriptionIPTimestamp.get(timestampKey) || 0;
      return { ip, timestamp };
    });

    // 按时间戳降序排序（最新的在前）
    ipArray.sort((a, b) => b.timestamp - a.timestamp);

    // 只保留最新的10个
    if (ipArray.length > 10) {
      const toRemove = ipArray.slice(10);
      const toKeep = ipArray.slice(0, 10);

      console.log(`[Cleanup] Code: ${code}, Total IPs: ${ipArray.length}, Keeping: ${toKeep.length}, Removing: ${toRemove.length}`);

      // 移除多余的IP
      toRemove.forEach(({ ip }) => {
        ipSet.delete(ip);
        const timestampKey = `${code}:${ip}`;
        subscriptionIPTimestamp.delete(timestampKey);
        cleanedCount++;
      });
    }
  }

  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} excess subscription IPs (keeping latest 10 per code)`);
  }

  return cleanedCount;
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return {
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
  ipAccessCache.clear();
  subscriptionIPCache.clear();
  subscriptionIPTimestamp.clear();
  lastCacheFlush = Date.now();
}
