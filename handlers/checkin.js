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

  // 修复Bug 1: 检查是否已过期（允许过期后7天内仍然可以签到续期）
  const now = new Date();
  const expiredDate = new Date(sub.expired_at);
  const daysSinceExpired = Math.floor((now - expiredDate) / (1000 * 60 * 60 * 24));

  if (daysSinceExpired > 7) {
    return { success: false, reason: 'subscription_expired_too_long' };
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

  // 动态计算当前连续签到天数（基于实际签到日期，不依赖存储的consecutive_days）
  const allRecords = await db.prepare(`
    SELECT checkin_date
    FROM checkin_records
    WHERE subscription_id = ?
    ORDER BY checkin_date DESC
  `).bind(subscriptionId).all();

  const checkInDates = (allRecords.results || []).map(r => r.checkin_date);
  console.log('[CheckIn] All check-in dates:', checkInDates);

  // 计算连续签到天数
  let newConsecutiveDays = 1;
  let isConsecutive = false;

  if (checkInDates.length === 0) {
    // 第一次签到
    newConsecutiveDays = 1;
    console.log('[CheckIn] First check-in');
  } else {
    // 检查昨天是否签到
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    const checkedYesterday = checkInDates.includes(yesterdayDate);

    if (checkedYesterday) {
      // 昨天签到过，计算连续天数
      // 从昨天开始向前连续计数
      let streak = 0;
      let checkDate = new Date(yesterday);

      for (let i = 0; i < 365; i++) { // 最多检查365天
        const dateStr = checkDate.toISOString().split('T')[0];
        if (checkInDates.includes(dateStr)) {
          streak++;
        } else {
          break;
        }
        checkDate.setDate(checkDate.getDate() - 1);
      }

      newConsecutiveDays = streak + 1; // 加上今天
      isConsecutive = true;
      console.log('[CheckIn] Consecutive check-in detected:', { streak, newConsecutiveDays });
    } else {
      // 昨天没签到，中断了
      newConsecutiveDays = 1;
      console.log('[CheckIn] Streak broken, yesterday:', yesterdayDate, 'dates:', checkInDates);
    }
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

    // 验证更新是否成功
    const updatedSub = await db.prepare(`
      SELECT consecutive_days FROM free_subscriptions WHERE id = ?
    `).bind(subscriptionId).first();

    console.log('[CheckIn] Verification after update:', {
      subId: sub.sub_id,
      rewardDays,
      consecutiveDays: newConsecutiveDays,
      isConsecutive,
      newExpiredAt: newExpiredAt.toISOString(),
      dbConsecutiveDays: updatedSub?.consecutive_days
    });

    // 清理中断前的旧记录（异步执行，不影响响应）
    // 只保留当前连续签到的那一段记录
    if (!isConsecutive) {
      // 如果中断了，清理所有旧记录，只保留今天的
      cleanupOldCheckInRecords(db, subscriptionId).then(deletedCount => {
        if (deletedCount > 0) {
          console.log(`[CheckIn] Cleaned up ${deletedCount} old check-in records (streak broken)`);
        }
      });
    }

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
 * 清理中断前的旧签到记录
 * 只保留当前连续签到的那一段记录
 * 例如：记录了 1/1, 1/2, 1/3 (连续3天)，然后 1/4 没签到，1/5 重新签到
 * 清理后只保留 1/5 这一条记录
 */
export async function cleanupOldCheckInRecords(db, subscriptionId) {
  try {
    // 获取所有签到记录（按日期降序）
    const allRecords = await db.prepare(`
      SELECT checkin_date
      FROM checkin_records
      WHERE subscription_id = ?
      ORDER BY checkin_date DESC
    `).bind(subscriptionId).all();

    const dates = (allRecords.results || []).map(r => r.checkin_date);

    if (dates.length <= 1) {
      // 只有1条或没有记录，不需要清理
      return 0;
    }

    // 从最新日期开始，找到连续签到的那一段
    const continuousDates = [];
    let checkDate = new Date(dates[0]); // 最新日期

    for (let i = 0; i < dates.length; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(dateStr)) {
        continuousDates.push(dateStr);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 如果所有记录都是连续的，不需要清理
    if (continuousDates.length === dates.length) {
      return 0;
    }

    // 删除不在连续段中的记录
    const idsToDelete = [];
    for (const record of allRecords.results) {
      if (!continuousDates.includes(record.checkin_date)) {
        idsToDelete.push(record.checkin_date);
      }
    }

    if (idsToDelete.length > 0) {
      const placeholders = idsToDelete.map(() => '?').join(',');
      const result = await db.prepare(`
        DELETE FROM checkin_records
        WHERE subscription_id = ? AND checkin_date IN (${placeholders})
      `).bind(subscriptionId, ...idsToDelete).run();

      console.log(`[CheckIn Cleanup] Deleted ${result.meta.changes} old records (kept ${continuousDates.length} continuous records)`);
      return result.meta.changes || 0;
    }

    return 0;
  } catch (error) {
    console.error('[CheckIn Cleanup] Failed to cleanup old records:', error);
    return 0;
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
