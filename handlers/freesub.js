// 免费订阅处理器
// 处理免费订阅的创建、验证、续期等逻辑

import { getDB } from '../database.js';
import { getClientIP as getIPFromBlacklist } from '../security/ip-blacklist.js';

// 统一的IP获取函数
export function getClientIP(request) {
  return getIPFromBlacklist(request);
}

// 免费订阅总数上限
const MAX_FREE_SUBSCRIPTIONS = 1000;

/**
 * 检查免费订阅数量是否达到上限
 */
async function isFreeSubscriptionLimitReached() {
  const db = getDB();
  // 统计未过期的免费订阅数量
  const result = await db.prepare(`
    SELECT COUNT(*) as count FROM free_subscriptions
    WHERE expired_at > datetime('now')
  `).first();
  return result ? result.count >= MAX_FREE_SUBSCRIPTIONS : false;
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

    // 检查免费订阅总数是否达到上限
    const limitReached = await isFreeSubscriptionLimitReached();
    if (limitReached) {
      throw new Error('FREE_SUBSCRIPTION_LIMIT_REACHED');
    }

    // 生成唯一的订阅ID
    const subId = generateSubscriptionId();

    // 计算过期时间（默认30天）
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 30);

    // 检查该IP是否已有免费订阅（智能管理：查询所有历史记录）
    const existing = await db.prepare(`
      SELECT id, fingerprint, expired_at, consecutive_days, last_checkin
      FROM free_subscriptions
      WHERE ip = ?
      ORDER BY expired_at DESC
      LIMIT 1
    `).bind(ip).first();

    if (existing) {
      const now = new Date();
      const expiredDate = new Date(existing.expired_at);
      const lastCheckin = existing.last_checkin ? new Date(existing.last_checkin) : expiredDate;

      // 计算距离上次签到的时间
      const daysSinceLastCheckin = Math.floor((now - lastCheckin) / (1000 * 60 * 60 * 24));

      // 智能判断：
      // 1. 如果从未签到过（刚创建的订阅），允许无限期续期
      // 2. 如果90天内签过到，保持订阅
      // 3. 超过90天未签到，创建新订阅（清理长期不活跃用户）
      if (!existing.last_checkin || daysSinceLastCheckin <= 90) {
        // 检查指纹是否匹配
        if (existing.fingerprint !== fingerprint) {
          console.log('[FreeSub] IP mismatch with existing subscription fingerprint', {
            ip,
            subId: existing.id,
            storedFp: existing.fingerprint.substring(0, 8),
            newFp: fingerprint.substring(0, 8)
          });
        }

        // 修复Bug 2：即使订阅已过期，只要在90天内有过签到记录，就续期而不是创建新订阅
        // 修复Bug 1：确保过期后7天内仍然可以签到续期
        if (expiredDate <= now) {
          const newExpiredAt = new Date();
          newExpiredAt.setDate(newExpiredAt.getDate() + 30);

          // 如果没有 fp_token，生成一个新的
          const newFpToken = existing.fp_token || generateFpToken();

          await db.prepare(`
            UPDATE free_subscriptions
            SET expired_at = ?,
                updated_at = datetime('now'),
                ip_change_count = 0,
                fingerprint = ?,
                fingerprint_components = ?,
                fp_token = ?
            WHERE id = ?
          `).bind(
            newExpiredAt.toISOString(),
            fingerprint,
            JSON.stringify(fingerprintComponents),
            newFpToken,
            existing.id
          ).run();

          console.log('[FreeSub] Existing expired subscription renewed', {
            subId: existing.id,
            ip,
            oldExpired: existing.expired_at,
            newExpiredAt: newExpiredAt.toISOString()
          });
        }

        // 返回现有订阅（保留连续签到记录）
        return await getFreeSubscription(existing.id, db);
      } else {
        // 超过90天未活跃，创建新订阅（清理僵尸用户）
        console.log('[FreeSub] User inactive for 90+ days, creating new subscription', {
          ip,
          oldSubId: existing.id,
          daysSinceLastCheckin
        });
      }
    }
  
  // 查找相同指纹的订阅（检测IP变化，包含过期记录）
  const fingerprintMatch = await db.prepare(`
    SELECT id, ip, ip_change_count, expired_at
    FROM free_subscriptions
    WHERE fingerprint = ?
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
  
  // 创建新订阅（包含 fp_token）
  const fpToken = generateFpToken();
  await db.prepare(`
    INSERT INTO free_subscriptions (
      sub_id, ip, fingerprint, fingerprint_components, fp_token,
      expired_at, total_days, consecutive_days
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `  ).bind(
    subId,
    ip,
    fingerprint,
    JSON.stringify(fingerprintComponents),
    fpToken,
    expiredAt.toISOString(),
    30,    // 初始30天
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
 * 生成短 Token（6位，用于URL参数）
 */
function generateFpToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
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
    fpToken: sub.fp_token,  // 短Token（6位）
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

  // 允许过期后89天内仍然可以访问（用于签到续期）
  const sub = await db.prepare(`
    SELECT * FROM free_subscriptions
    WHERE sub_id = ? AND expired_at >= datetime('now', '-89 days')
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
 * 支持两种验证方式：
 * 1. fp_token（6位短Token）- 优先
 * 2. fingerprint（64位完整指纹）- 兼容旧版
 */
export async function validateFreeSubscriptionWithFingerprint(subId, request, fingerprintOrToken, db) {
  const ip = getClientIP(request);

  // 修复Bug 1: 允许过期当天和过期后89天内仍然可以访问（允许签到续期）
  const sub = await db.prepare(`
    SELECT * FROM free_subscriptions
    WHERE sub_id = ? AND expired_at >= datetime('now', '-89 days')
  `).bind(subId).first();

  if (!sub) {
    return { valid: false, reason: 'subscription_not_found_or_expired' };
  }

  // 检查IP是否匹配
  const ipMatch = sub.ip === ip;

  // 优先检查 fp_token（6位短Token）
  let tokenMatch = false;
  if (sub.fp_token) {
    tokenMatch = sub.fp_token === fingerprintOrToken;
  }

  // 如果Token不匹配，检查旧版指纹（兼容）
  let fingerprintMatch = false;
  if (!tokenMatch) {
    fingerprintMatch = sub.fingerprint === fingerprintOrToken;
  }

  // 验证：IP匹配 或 Token匹配 或 指纹匹配
  if (!ipMatch && !tokenMatch && !fingerprintMatch) {
    return { valid: false, reason: 'ip_and_fingerprint_mismatch' };
  }

  // 如果IP不匹配但Token/指纹匹配，更新IP
  if (!ipMatch && (tokenMatch || fingerprintMatch)) {
    const newIpChangeCount = (sub.ip_change_count || 0) + 1;

    if (newIpChangeCount <= 3) {
      await db.prepare(`
        UPDATE free_subscriptions
        SET ip = ?, ip_change_count = ?, ip_updated_at = datetime('now')
        WHERE id = ?
      `).bind(ip, newIpChangeCount, sub.id).run();

      console.log('[FreeSub] IP updated via token/fingerprint verification', {
        subId: sub.sub_id,
        oldIp: sub.ip,
        newIp: ip,
        changeCount: newIpChangeCount
      });
    } else {
      console.log('[FreeSub] IP change limit exceeded', {
        subId: sub.sub_id,
        changeCount: newIpChangeCount
      });
    }
  }

  return { valid: true, subscription: formatSubscription(sub) };
}
