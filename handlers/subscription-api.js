//  API 
import { getTopics, getTopic, applyTopicFilter } from '../database.js';

// 
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 
function calculateStackedExpiry(existingExpiry, newDurationDays) {
  const now = new Date();
  
  if (newDurationDays === -1) {
    return null;
  }
  
  const baseDate = existingExpiry && new Date(existingExpiry) > now 
    ? new Date(existingExpiry) 
    : now;
  
  return new Date(baseDate.getTime() + newDurationDays * 24 * 60 * 60 * 1000);
}

// code
async function getUserActiveCode(userId, db) {
  const now = new Date().toISOString();
  
  const result = await db.prepare(`
    SELECT c.code, c.expired_at, c.duration_days
    FROM user_orders o
    JOIN codes c ON o.code = c.code
    WHERE o.user_id = ?
      AND o.status = 'completed'
      AND (c.expired_at IS NULL OR c.expired_at > ?)
    ORDER BY o.created_at DESC
    LIMIT 1
  `).bind(userId, now).first();
  
  return result || null;
}

// 
export async function handleGetTopics(request, env, ctx) {
  try {
    const topics = await getTopics();
    
    return new Response(JSON.stringify({
      success: true,
      topics: topics.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
        channelCount: 0 // 
      }))
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Topics] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// 
export async function generateActivationCode(env, durationDays, maxIPs, userId, topicId, isTestMode = false, baseUrl = '', subMode = null) {
  const now = new Date();
  let code;
  let expiredAt;
  let isStacked = false;

  try {
    const existingCode = await getUserActiveCode(userId, env.DB);

    if (existingCode) {
      code = existingCode.code;
      expiredAt = calculateStackedExpiry(existingCode.expired_at, durationDays);
      isStacked = true;

      // ： duration_days
      //  topic_id / sub_mode（，）
      await env.DB.prepare(`
        UPDATE codes
        SET expired_at = ?, duration_days = ?
        WHERE code = ?
      `).bind(expiredAt ? expiredAt.toISOString() : null, durationDays, code).run();

      console.log('[Subscription] Stacked code:', code, 'for user:', userId, 'scheme preserved');
    } else {
      code = generateCode();

      if (durationDays !== -1) {
        expiredAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
      }

      await env.DB.prepare(`
        INSERT INTO codes (code, status, duration_days, activated_at, expired_at, max_ips, topic_id, sub_mode, remark)
        VALUES (?, 'active', ?, ?, ?, ?, ?, ?, ?)
      `).bind(code, durationDays, now.toISOString(), expiredAt ? expiredAt.toISOString() : null, maxIPs, topicId || null, subMode, isTestMode ? `Test purchase by user ${userId}` : `User ${userId} purchase`).run();

      console.log('[Subscription] Code generated:', code, 'for user:', userId, 'duration:', durationDays, 'topic:', topicId, 'mode:', subMode);
    }

    const subUrl = `${baseUrl}/sub/${code}.m3u`;

    return {
      success: true,
      code: code,
      subUrl: subUrl,
      expiredAt: expiredAt ? expiredAt.toISOString() : null,
      activatedAt: now.toISOString(),
      stacked: isStacked,
      topicId: topicId,
      subMode: subMode
    };
  } catch (error) {
    console.error('[Subscription] Failed to generate code:', error);
    return {
      success: false,
      error: 'Failed to generate activation code'
    };
  }
}

// 
async function getPlanFromDB(days, env) {
  const plan = await env.DB.prepare(`
    SELECT days, base_price, price_per_ip, discount
    FROM subscription_plans
    WHERE days = ? AND is_enabled = 1
  `).bind(days).first();

  if (!plan) {
    return null;
  }

  return {
    basePrice: plan.base_price,
    pricePerIP: plan.price_per_ip,
    discount: plan.discount
  };
}

// 
function calculatePrice(plan, ipCount) {
  const extraIps = Math.max(0, ipCount - 1);
  const price = plan.basePrice + (plan.pricePerIP * extraIps);
  const discountedPrice = price * (1 - plan.discount / 100);
  return {
    original: price,
    discounted: discountedPrice,
    discount: plan.discount
  };
}


// 优惠码验证
export async function validateDiscountCode(code, orderAmount, env) {
  if (!code || !code.trim()) {
    return { success: false, error: '请输入优惠码' };
  }
  
  const codeStr = code.trim().toUpperCase();
  const now = new Date().toISOString();
  
  const db = env.DB;
  const record = await db.prepare(
    'SELECT * FROM discount_codes WHERE code = ?'
  ).bind(codeStr).first();
  
  if (!record) {
    return { success: false, error: '优惠码不存在' };
  }
  
  if (record.status !== 'active') {
    return { success: false, error: '优惠码已停用' };
  }
  
  if (record.expires_at && record.expires_at < now) {
    return { success: false, error: '优惠码已过期' };
  }
  
  if (record.usage_limit > 0 && record.used_count >= record.usage_limit) {
    return { success: false, error: '优惠码已达使用上限' };
  }
  
  if (record.min_amount > 0 && orderAmount < record.min_amount) {
    return { success: false, error: '订单金额需满¥' + record.min_amount + '才能使用此优惠码' };
  }
  
  let discountAmount = 0;
  if (record.type === 'percent') {
    discountAmount = orderAmount * (record.value / 100);
  } else {
    discountAmount = record.value;
  }
  
  discountAmount = Math.min(discountAmount, orderAmount);
  
  return {
    success: true,
    code: record.code,
    type: record.type,
    value: record.value,
    discountAmount: Number(discountAmount.toFixed(2)),
    finalAmount: Number((orderAmount - discountAmount).toFixed(2))
  };
}
