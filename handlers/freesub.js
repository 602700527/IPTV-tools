// 免费订阅处理器
// 处理免费订阅的创建、验证、续期等逻辑

import { getDB } from '../database.js';
import { getClientIP as getIPFromBlacklist } from '../security/ip-blacklist.js';

// 统一的IP获取函数
export function getClientIP(request) {
  return getIPFromBlacklist(request);
}

/**
 * 创建免费订阅
 * @param {string} ip - 客户端IP
 * @param {string} fingerprint - 浏览器指纹哈希
 * @param {object} fingerprintComponents - 指纹组件详细信息
 * @param {object} env - Cloudflare环境
 * @returns {object} 订阅信息
 */
export async function createFreeSubscription(ip, fingerprint, fingerprintComponents, env) {
  try {
    const db = getDB();

    // 生成唯一的订阅ID
    const subId = generateSubscriptionId();

    // 计算过期时间（默认3天）
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 3);

    // 检查该IP是否已有活跃的免费订阅
    const existing = await db.prepare(`
      SELECT id, fingerprint, expired_at
      FROM free_subscriptions
      WHERE ip = ? AND expired_at > datetime('now')
      ORDER BY expired_at DESC
      LIMIT 1
    `).bind(ip).first();
  
  if (existing) {
    // 检查指纹是否匹配
    if (existing.fingerprint !== fingerprint) {
      console.log('[FreeSub] IP mismatch with existing subscription fingerprint', {
        ip,
        subId: existing.id,
        storedFp: existing.fingerprint.substring(0, 8),
        newFp: fingerprint.substring(0, 8)
      });
    }
    
    // 返回现有订阅
    return await getFreeSubscription(existing.id, db);
  }
  
  // 查找相同指纹的订阅（检测IP变化）
  const fingerprintMatch = await db.prepare(`
    SELECT id, ip, ip_change_count
    FROM free_subscriptions
    WHERE fingerprint = ? AND expired_at > datetime('now')
    ORDER BY expired_at DESC
    LIMIT 1
  `).bind(fingerprint).first();
  
  if (fingerprintMatch) {
    // 指纹匹配但IP不同，可能是同一用户换了IP
    if (fingerprintMatch.ip !== ip) {
      const newIpChangeCount = (fingerprintMatch.ip_change_count || 0) + 1;
      
      if (newIpChangeCount > 3) {
        // IP变化超过3次，标记为可疑
        console.log('[FreeSub] Suspicious activity: IP changed too many times', {
          subId: fingerprintMatch.id,
          oldIp: fingerprintMatch.ip,
          newIp: ip,
          changes: newIpChangeCount
        });
      }
      
      // 更新IP和变化计数
      await db.prepare(`
        UPDATE free_subscriptions
        SET ip = ?, ip_change_count = ?, ip_updated_at = datetime('now')
        WHERE id = ?
      `).bind(ip, newIpChangeCount, fingerprintMatch.id).run();
      
      console.log('[FreeSub] IP updated for existing subscription', {
        subId: fingerprintMatch.id,
        oldIp: fingerprintMatch.ip,
        newIp: ip,
        changes: newIpChangeCount
      });
    }
    
    return await getFreeSubscription(fingerprintMatch.id, db);
  }
  
  // 创建新订阅
  await db.prepare(`
    INSERT INTO free_subscriptions (
      sub_id, ip, fingerprint, fingerprint_components,
      expired_at, total_days, consecutive_days
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `  ).bind(
    subId,
    ip,
    fingerprint,
    JSON.stringify(fingerprintComponents),
    expiredAt.toISOString(),
    3,    // 初始3天
    0     // 初始连续签到0天
  ).run();

  // 获取新创建的订阅ID
  const newSub = await db.prepare(`
    SELECT id FROM free_subscriptions WHERE sub_id = ?
  `).bind(subId).first();

  // 记录创建当天的签到（防止当天签到）
  const today = new Date().toISOString().split('T')[0];
  await db.prepare(`
    INSERT INTO checkin_records (
      subscription_id, checkin_date, reward_days, consecutive_days
    ) VALUES (?, ?, ?, ?)
  `).bind(
    newSub.id,
    today,
    0,    // 创建当天不给奖励
    0     // 连续签到0天
  ).run();

    console.log('[FreeSub] New free subscription created', { subId, ip });

    return await getFreeSubscriptionBySubId(subId, db);
  } catch (error) {
    console.error('[FreeSub] Error creating subscription:', error);
    console.error('[FreeSub] Error stack:', error.stack);
    throw error; // 重新抛出错误，让API处理器统一处理
  }
}

/**
 * 生成订阅ID
 */
function generateSubscriptionId() {
  const prefix = 'free';
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${random}`;
}

/**
 * 根据ID获取订阅
 */
async function getFreeSubscription(id, db) {
  const sub = await db.prepare(`
    SELECT * FROM free_subscriptions WHERE id = ?
  `).bind(id).first();
  
  return formatSubscription(sub);
}

/**
 * 根据订阅ID获取订阅
 */
async function getFreeSubscriptionBySubId(subId, db) {
  const sub = await db.prepare(`
    SELECT * FROM free_subscriptions WHERE sub_id = ?
  `).bind(subId).first();
  
  return formatSubscription(sub);
}

/**
 * 格式化订阅信息
 */
function formatSubscription(sub) {
  if (!sub) return null;
  
  return {
    id: sub.id,
    subId: sub.sub_id,
    ip: sub.ip,
    fingerprint: sub.fingerprint,
    expiredAt: sub.expired_at,
    totalDays: sub.total_days,
    consecutiveDays: sub.consecutive_days,
    ipChangeCount: sub.ip_change_count || 0,
    ipUpdatedAt: sub.ip_updated_at,
    lastCheckIn: sub.last_checkin,
    createdAt: sub.created_at
  };
}

/**
 * 验证订阅是否有效
 */
export async function validateFreeSubscription(subId, request, db) {
  const ip = getClientIP(request);
  
  const sub = await db.prepare(`
    SELECT * FROM free_subscriptions 
    WHERE sub_id = ? AND expired_at > datetime('now')
  `).bind(subId).first();
  
  if (!sub) {
    return { valid: false, reason: 'subscription_not_found_or_expired' };
  }
  
  // 检查IP是否匹配
  if (sub.ip !== ip) {
    // 允许一定程度的IP变化（如家庭网络IP变动）
    // 但需要指纹验证
    return { 
      valid: false, 
      reason: 'ip_mismatch',
      requiresFingerprint: true 
    };
  }
  
  return { valid: true, subscription: formatSubscription(sub) };
}

/**
 * 验证带指纹的订阅
 */
export async function validateFreeSubscriptionWithFingerprint(subId, request, fingerprint, db) {
  const ip = getClientIP(request);
  
  const sub = await db.prepare(`
    SELECT * FROM free_subscriptions 
    WHERE sub_id = ? AND expired_at > datetime('now')
  `).bind(subId).first();
  
  if (!sub) {
    return { valid: false, reason: 'subscription_not_found_or_expired' };
  }
  
  // 检查IP是否匹配
  const ipMatch = sub.ip === ip;
  
  // 检查指纹是否匹配
  const fingerprintMatch = sub.fingerprint === fingerprint;
  
  if (!ipMatch && !fingerprintMatch) {
    return { valid: false, reason: 'ip_and_fingerprint_mismatch' };
  }
  
  if (!ipMatch) {
    // IP不匹配但指纹匹配，更新IP
    const newIpChangeCount = (sub.ip_change_count || 0) + 1;
    
    if (newIpChangeCount <= 3) {
      await db.prepare(`
        UPDATE free_subscriptions
        SET ip = ?, ip_change_count = ?, ip_updated_at = datetime('now')
        WHERE id = ?
      `).bind(ip, newIpChangeCount, sub.id).run();
      
      console.log('[FreeSub] IP updated via fingerprint verification', {
        subId,
        oldIp: sub.ip,
        newIp: ip,
        changes: newIpChangeCount
      });
    } else {
      // IP变化超过限制
      return { valid: false, reason: 'ip_change_limit_exceeded' };
    }
  }
  
  return { valid: true, subscription: formatSubscription(sub) };
}
