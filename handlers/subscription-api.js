// 订阅支付相关 API 处理
import { getTopics, getTopic, applyTopicFilter } from '../database.js';

// 生成随机卡密
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 计算叠加后的过期时间
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

// 获取用户最新的有效订阅code
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

// 获取所有可用主题
export async function handleGetTopics(request, env, ctx) {
  try {
    const topics = await getTopics();
    
    return new Response(JSON.stringify({
      success: true,
      topics: topics.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
        channelCount: 0 // 可以在这里计算实际频道数
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

// 生成订阅卡密
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

      // 续费场景：只延长过期时间和更新 duration_days
      // 保留 topic_id / sub_mode（前端在续费时已隐藏选择器，方案变更请走账户页）
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

// 根据天数获取套餐配置
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

// 计算价格
function calculatePrice(plan, ipCount) {
  const price = plan.basePrice + (plan.pricePerIP * ipCount);
  const discountedPrice = price * (1 - plan.discount / 100);
  return {
    original: price,
    discounted: discountedPrice,
    discount: plan.discount
  };
}
