// IP黑名单安全系统
// 防止撞库攻击：监控订阅地址访问频率，超出限制永久封禁
import { getIPBlacklistConfig } from '../database.js';
import { incrementIPAccess, getIPAccessCount, getIPTotalAccess, flushCacheToDB, ipAccessCache } from '../utils/cache.js';

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

  // 2. 获取或创建访问记录（使用缓存）
  const today = new Date().toISOString().split('T')[0];

  // 尝试刷新缓存（10分钟间隔）
  await flushCacheToDB(env, ctx);

  // 从缓存获取计数
  let pathRequests = getIPAccessCount(ip, path, today);
  let todayRequests = getIPTotalAccess(ip, today);

  // 如果缓存中没有（首次请求），从数据库查询
  if (pathRequests === 0 || todayRequests === 0) {
    const { getDB } = await import('../database.js');
    const db = getDB();

    const dbPathRequests = await db.prepare(`
      SELECT SUM(request_count) as total
      FROM ip_access_logs
      WHERE ip = ? AND path = ? AND created_date = ?
    `).bind(ip, path, today).first();

    const dbTotalRequests = await db.prepare(`
      SELECT SUM(request_count) as total
      FROM ip_access_logs
      WHERE ip = ? AND created_date = ?
    `).bind(ip, today).first();

    // 将数据库中的计数同步到缓存
    if (dbPathRequests?.total) {
      ipAccessCache.set(`${ip}:${path}:${today}`, dbPathRequests.total);
      pathRequests = dbPathRequests.total;
    }

    if (dbTotalRequests?.total) {
      // 更新缓存中的总计数
      todayRequests = dbTotalRequests.total;
    }
  }

  // 增加本次请求的计数到缓存
  pathRequests = incrementIPAccess(ip, path, today);
  todayRequests = getIPTotalAccess(ip, today);

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

  // 7. 检查是否触发封禁
  if (todayRequests > threshold.maxPerDay) {
    // 超过每日限制，永久封禁
    await banIP(env, ip, 'Daily request limit exceeded', {
      totalRequests: todayRequests,
      threshold: threshold.maxPerDay
    });
    return {
      allowed: false,
      blocked: true,
      message: 'Your IP has been permanently banned due to excessive requests.'
    };
  }

  // 检查单个路径的频率（防止刷单一路径）
  if (pathRequests > threshold.maxPerHour) {
    // 单个路径超过每小时限制，永久封禁
    await banIP(env, ip, `Excessive requests to path: ${path}`, {
      path: path,
      count: pathRequests,
      threshold: threshold.maxPerHour
    });
    return {
      allowed: false,
      blocked: true,
      message: 'Your IP has been permanently banned due to excessive requests to a specific endpoint.'
    };
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
  const { getDB } = await import('../database.js');
  const db = getDB();

  const result = await db.prepare(`
    SELECT ip, banned_at, reason, details
    FROM ip_blacklist
    ORDER BY banned_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  const totalResult = await db.prepare("SELECT COUNT(*) as total FROM ip_blacklist").first();
  const total = totalResult?.total || 0;

  // 格式化数据
  const data = (result.results || []).map(item => ({
    ip: item.ip,
    bannedAt: item.banned_at,
    reason: item.reason,
    details: JSON.parse(item.details || '{}')
  }));

  return { data, total };
}

// 永久封禁IP
export async function banIP(env, ip, reason, details = {}) {
  const { getDB } = await import('../database.js');
  const db = getDB();

  await db.prepare(`
    INSERT OR REPLACE INTO ip_blacklist (ip, banned_at, reason, details, permanent)
    VALUES (?, CURRENT_TIMESTAMP, ?, ?, 1)
  `).bind(ip, reason, JSON.stringify(details)).run();

  console.log(`IP ${ip} has been permanently banned. Reason: ${reason}`);
}

// 解封IP
export async function unbanIP(env, ip) {
  const { getDB } = await import('../database.js');
  const db = getDB();

  await db.prepare("DELETE FROM ip_blacklist WHERE ip = ?").bind(ip).run();

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
  const { getDB } = await import('../database.js');
  const db = getDB();

  const today = new Date().toISOString().split('T')[0];

  const result = await db.prepare(`
    SELECT
      SUM(request_count) as total_requests,
      MIN(first_access) as first_access,
      GROUP_CONCAT(path || ':' || request_count, ',') as paths
    FROM ip_access_logs
    WHERE ip = ? AND created_date = ?
  `).bind(ip, today).first();

  const paths = {};
  if (result?.paths) {
    result.paths.split(',').forEach(p => {
      const [path, count] = p.split(':');
      if (path && count) {
        paths[path] = parseInt(count);
      }
    });
  }

  return {
    requests: result?.total_requests || 0,
    paths: paths,
    firstAccess: result?.first_access || null
  };
}

/**
 * 检查IP是否在黑名单中
 * @param {Object} env - Cloudflare Workers环境
 * @param {string} ip - IP地址
 * @returns {Promise<boolean>} 是否被封禁
 */
export async function isIPBlacklisted(env, ip) {
  if (!ip) return false;

  const { getDB } = await import('../database.js');
  const db = getDB();

  const result = await db.prepare("SELECT ip FROM ip_blacklist WHERE ip = ?").bind(ip).first();

  return !!result;
}
