// 免费订阅签到处理器
// 处理每日签到、连续签到奖励等逻辑

import { getDB } from '../database.js';

/**
 * 执行签到
 * @param {number} subscriptionId - 订阅ID
 * @param {string} ip - 客户端IP
 * @returns {object} 签到结果
 */
export async function performCheckIn(subscriptionId, ip) {
  const db = getDB();
  
  // 获取订阅信息
  const sub = await db.prepare(`
    SELECT
      fs.*,
      (SELECT checkin_date FROM checkin_records
       WHERE subscription_id = fs.id
       ORDER BY checkin_date DESC LIMIT 1) as last_checkin_date
    FROM free_subscriptions fs
    WHERE fs.id = ?
  `).bind(subscriptionId).first();
  
  if (!sub) {
    return { success: false, reason: 'subscription_not_found' };
  }
  
  // 检查IP是否匹配
  if (sub.ip !== ip) {
    return { success: false, reason: 'ip_mismatch' };
  }
  
  // 检查是否已过期
  if (new Date(sub.expired_at) <= new Date()) {
    return { success: false, reason: 'subscription_expired' };
  }
  
  // 检查今天是否已签到
  const today = new Date().toISOString().split('T')[0];
  const existingCheckIn = await db.prepare(`
    SELECT id, checkin_date FROM checkin_records
    WHERE subscription_id = ? AND checkin_date = ?
  `).bind(subscriptionId, today).first();

  if (existingCheckIn) {
    return {
      success: false,
      reason: 'already_checked_in',
      checkInDate: existingCheckIn.checkin_date
    };
  }

  // 计算上次签到日期
  const lastCheckInDate = sub.last_checkin_date || sub.created_at ? new Date(sub.created_at).toISOString().split('T')[0] : null;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split('T')[0];

  // 计算连续签到天数
  let newConsecutiveDays = 1;
  let isConsecutive = false;

  if (lastCheckInDate === yesterdayDate) {
    // 连续签到
    newConsecutiveDays = (sub.consecutive_days || 0) + 1;
    isConsecutive = true;
  } else if (lastCheckInDate === today) {
    // 已经签到过了（包括创建当天的0天记录）
    return { success: false, reason: 'already_checked_in' };
  } else {
    // 中断了，重新开始
    newConsecutiveDays = 1;
  }
  
  // 计算奖励天数
  let rewardDays = 1; // 默认1天
  
  if (newConsecutiveDays >= 30) {
    rewardDays = 7; // 连续30天，奖励7天
  } else if (newConsecutiveDays >= 7) {
    rewardDays = 2; // 连续7天，奖励2天
  }
  
  // 计算新的过期时间
  const currentExpiredAt = new Date(sub.expired_at);
  const now = new Date();

  // 如果已过期，从今天开始计算；否则从过期时间开始计算
  const startDate = currentExpiredAt <= now ? now : currentExpiredAt;
  const newExpiredAt = new Date(startDate);
  newExpiredAt.setDate(newExpiredAt.getDate() + rewardDays);

  try {
    // 使用 D1 的事务 API
    await db.batch([
      // 记录签到
      db.prepare(`
        INSERT INTO checkin_records (
          subscription_id, checkin_date, reward_days, consecutive_days
        ) VALUES (?, ?, ?, ?)
      `).bind(subscriptionId, today, rewardDays, newConsecutiveDays),

      // 更新订阅信息
      db.prepare(`
        UPDATE free_subscriptions
        SET expired_at = ?,
            last_checkin = ?,
            consecutive_days = ?,
            total_days = total_days + ?,
            ip_change_count = 0
        WHERE id = ?
      `).bind(
        newExpiredAt.toISOString(),
        now.toISOString(),
        newConsecutiveDays,
        rewardDays,
        subscriptionId
      )
    ]);

    console.log('[CheckIn] Successful', {
      subId: sub.sub_id,
      rewardDays,
      consecutiveDays: newConsecutiveDays,
      isConsecutive,
      newExpiredAt: newExpiredAt.toISOString()
    });

    // 返回结果
    return {
      success: true,
      rewardDays,
      consecutiveDays: newConsecutiveDays,
      isConsecutive,
      expiredAt: newExpiredAt.toISOString(),
      totalDays: (sub.total_days || 0) + rewardDays,
      message: isConsecutive
        ? `连续签到${newConsecutiveDays}天，获得${rewardDays}天！`
        : `签到成功，获得${rewardDays}天！`
    };

  } catch (error) {
    console.error('[CheckIn] Transaction failed:', error);
    return { success: false, reason: 'database_error' };
  }
}

/**
 * 获取签到历史
 * @param {number} subscriptionId - 订阅ID
 * @param {number} limit - 限制数量
 * @returns {array} 签到记录
 */
export async function getCheckInHistory(subscriptionId, limit = 30) {
  const db = getDB();
  
  const records = await db.prepare(`
    SELECT * FROM checkin_records
    WHERE subscription_id = ?
    ORDER BY checkin_date DESC
    LIMIT ?
  `).bind(subscriptionId, limit).all();
  
  return records.results || [];
}

/**
 * 获取签到统计
 * @param {number} subscriptionId - 订阅ID
 * @returns {object} 统计信息
 */
export async function getCheckInStats(subscriptionId) {
  const db = getDB();
  
  // 总签到次数
  const totalCheckIns = await db.prepare(`
    SELECT COUNT(*) as count FROM checkin_records
    WHERE subscription_id = ?
  `).bind(subscriptionId).first();
  
  // 总获得天数
  const totalRewardDays = await db.prepare(`
    SELECT SUM(reward_days) as total FROM checkin_records
    WHERE subscription_id = ?
  `).bind(subscriptionId).first();
  
  // 最长连续签到
  const maxConsecutive = await db.prepare(`
    SELECT MAX(consecutive_days) as max FROM checkin_records
    WHERE subscription_id = ?
  `).bind(subscriptionId).first();
  
  // 本月签到次数
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const thisMonthCheckIns = await db.prepare(`
    SELECT COUNT(*) as count FROM checkin_records
    WHERE subscription_id = ? AND checkin_date LIKE ?
  `).bind(subscriptionId, `${currentMonth}%`).first();
  
  return {
    totalCheckIns: totalCheckIns?.count || 0,
    totalRewardDays: totalRewardDays?.total || 0,
    maxConsecutive: maxConsecutive?.max || 0,
    thisMonthCheckIns: thisMonthCheckIns?.count || 0
  };
}
