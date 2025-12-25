// IP黑名单安全系统
// 防止撞库攻击：监控订阅地址访问频率，超出限制永久封禁
import { getIPBlacklistConfig } from '../database.js';

/**
 * 获取客户端真实IP
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('CF-Connecting-IP');
  if (forwarded) {
    return forwarded;
  }

  // 备选方案
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIP = request.headers.get('X-Real-IP');
  if (xRealIP) {
    return xRealIP;
  }

  return null;
}

/**
 * 检查IP访问频率
 * @param {Object} env - Cloudflare Workers环境
 * @param {Object} ctx - Cloudflare Workers上下文
 * @param {string} ip - IP地址
 * @param {string} path - 请求路径
 * @returns {Promise<{allowed: boolean, blocked: boolean, message: string}>} 检查结果
 */
export async function checkIPRateLimit(env, ctx, ip, path) {
  if (!ip) return { allowed: true, blocked: false, message: '' };

  // 1. 检查是否已永久封禁
  const blacklisted = await isIPBlacklisted(env, ip);
  if (blacklisted) {
    return {
      allowed: false,
      blocked: true,
      message: 'Your IP has been permanently banned due to suspicious activity.'
    };
  }

  // 2. 获取访问记录
  const today = new Date().toISOString().split('T')[0];
  const accessKey = `ip_access:${today}:${ip}`;
  const accessData = await env.KV.get(accessKey, { type: 'json' }) || {
    requests: 0,
    paths: {},
    firstAccess: new Date().toISOString()
  };

  // 3. 更新访问计数
  accessData.requests += 1;
  accessData.paths[path] = (accessData.paths[path] || 0) + 1;

  // 4. 获取配置的阈值
  const config = await getIPBlacklistConfig();
  const THRESHOLDS = {
    // 订阅地址
    '/sub': {
      maxPerMin: config.sub_rate_min,
      maxPerHour: config.sub_rate_hour,
      maxPerDay: config.sub_rate_day
    },
    // 播放地址
    '/live': {
      maxPerMin: config.live_rate_min,
      maxPerHour: config.live_rate_hour,
      maxPerDay: config.live_rate_day
    },
    // 管理地址
    '/admin': {
      maxPerMin: 10,
      maxPerHour: config.admin_rate_hour,
      maxPerDay: 50
    }
  };

  // 5. 检查是否超过阈值
  let threshold = null;
  for (const [key, value] of Object.entries(THRESHOLDS)) {
    if (path.startsWith(key)) {
      threshold = value;
      break;
    }
  }

  if (!threshold) {
    // 默认阈值
    threshold = { maxPerHour: 60, maxPerDay: 500 };
  }

  // 6. 异步保存访问记录
  ctx.waitUntil(env.KV.put(accessKey, accessData, { expirationTtl: 86400 * 2 }));

  // 7. 检查是否触发封禁
  if (accessData.requests > threshold.maxPerDay) {
    // 超过每日限制，永久封禁
    await banIP(env, ip, 'Daily request limit exceeded', {
      totalRequests: accessData.requests,
      paths: accessData.paths,
      threshold: threshold.maxPerDay
    });
    return {
      allowed: false,
      blocked: true,
      message: 'Your IP has been permanently banned due to excessive requests.'
    };
  }

  // 检查单个路径的频率（防止刷单一路径）
  for (const [key, count] of Object.entries(accessData.paths)) {
    // 检查每分钟限制
    if (threshold.maxPerMin && count > threshold.maxPerMin) {
      // 这里需要更细粒度的时间记录，暂时使用每小时限制
    }
    
    if (count > threshold.maxPerHour) {
      // 单个路径超过每小时限制，永久封禁
      await banIP(env, ip, `Excessive requests to path: ${key}`, {
        path: key,
        count: count,
        threshold: threshold.maxPerHour
      });
      return {
        allowed: false,
        blocked: true,
        message: 'Your IP has been permanently banned due to excessive requests to a specific endpoint.'
      };
    }
  }

  return { allowed: true, blocked: false, message: '' };
}

/**
 * 获取所有被封禁的IP列表
 * @param {Object} env - Cloudflare Workers环境
 * @param {number} limit - 返回的最大数量（用于分页）
 * @param {number} offset - 偏移量（用于分页）
 * @returns {Promise<{data: Array, total: number}>} 封禁列表
 */
export async function getBlacklistedIPs(env, limit = 100, offset = 0) {
  const allBannedKey = 'ip_blacklist_all';
  const allData = await env.KV.get(allBannedKey, { type: 'json' }) || [];

  // 分页返回数据
  const data = allData.slice(offset, offset + limit);
  const total = allData.length;

  return { data, total };
}

// 永久封禁IP
export async function banIP(env, ip, reason, details = {}) {
  const blacklistData = {
    ip,
    bannedAt: new Date().toISOString(),
    reason,
    details,
    permanent: true
  };

  await env.KV.put(`ip_blacklist:${ip}`, JSON.stringify(blacklistData));
  await addToBanIndex(env, ip);
  console.log(`IP ${ip} has been permanently banned. Reason: ${reason}`);
}

// 解封IP
export async function unbanIP(env, ip) {
  const allBannedKey = 'ip_blacklist_all';
  const existingData = await env.KV.get(allBannedKey, { type: 'json' }) || [];

  // 过滤掉要解封的IP
  const newData = existingData.filter(item => item.ip !== ip);

  // 更新存储
  if (newData.length === 0) {
    // 如果没有数据了，删除键
    await env.KV.delete(allBannedKey);
  } else {
    await env.KV.put(allBannedKey, JSON.stringify(newData));
  }

  console.log(`IP ${ip} has been unbanned`);
  return true;
}

/**
 * 获取IP的访问统计
 * @param {Object} env - Cloudflare Workers环境
 * @param {string} ip - IP地址
 * @returns {Promise<Object>} 访问统计
 */
export async function getIPAccessStats(env, ip) {
  const today = new Date().toISOString().split('T')[0];
  const accessKey = `ip_access:${today}:${ip}`;
  const accessData = await env.KV.get(accessKey, { type: 'json' }) || {
    requests: 0,
    paths: {},
    firstAccess: null
  };

  return accessData;
}

/**
 * 检查IP是否在黑名单中
 * @param {Object} env - Cloudflare Workers环境
 * @param {string} ip - IP地址
 * @returns {Promise<boolean>} 是否被封禁
 */
export async function isIPBlacklisted(env, ip) {
  if (!ip) return false;

  const allBannedKey = 'ip_blacklist_all';
  const allData = await env.KV.get(allBannedKey, { type: 'json' }) || [];

  return allData.some(item => item.ip === ip);
}
