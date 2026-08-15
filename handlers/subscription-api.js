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

      await env.DB.prepare(`
        UPDATE codes
        SET expired_at = ?, duration_days = ?, topic_id = ?, sub_mode = ?
        WHERE code = ?
      `).bind(expiredAt ? expiredAt.toISOString() : null, durationDays, topicId || null, subMode, code).run();

      console.log('[Subscription] Stacked code:', code, 'for user:', userId, 'topic:', topicId, 'mode:', subMode);
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

// 处理创建卡密请求
export async function handleCreateCode(request, env, ctx) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);

    const user = await env.DB.prepare(`
      SELECT u.id, u.email
      FROM users u
      INNER JOIN user_sessions s ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first();

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid token'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { duration_days, max_ips = 3, topic_id = null, test_mode = false, payment_id = null, sub_mode = null } = body;

    if (!duration_days || (duration_days !== -1 && (duration_days < 1 || duration_days > 365))) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid duration_days (1-365 or -1 for permanent)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (![1, 2, 3, 5].includes(max_ips)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid max_ips (1, 2, 3, or 5)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证主题存在（如果指定了主题）
    if (topic_id) {
      const topic = await getTopic(topic_id);
      if (!topic) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid topic_id'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    console.log('[Subscription] Creating code for user:', user.id, 'duration:', duration_days, 'ips:', max_ips, 'topic:', topic_id, 'mode:', sub_mode);

    const result = await generateActivationCode(env, duration_days, max_ips, user.id, topic_id, test_mode, baseUrl, sub_mode);

    if (!result.success) {
      return new Response(JSON.stringify(result), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const plan = await getPlanFromDB(duration_days, env);
      if (!plan) {
        return new Response(JSON.stringify({
          success: false,
          error: '套餐不存在或已禁用'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const price = calculatePrice(plan, max_ips);

      const orderId = payment_id || (test_mode ? 'test_' + Date.now() : 'manual_' + Date.now());

      await env.DB.prepare(`
        INSERT INTO user_orders (user_id, order_id, code, duration_days, amount, topic_id, status)
        VALUES (?, ?, ?, ?, ?, ?, 'completed')
      `).bind(user.id, orderId, result.code, duration_days, price.discounted, topic_id || null).run();

      console.log('[Subscription] Order created:', orderId, 'for user:', user.id, 'topic:', topic_id, 'mode:', sub_mode);
    } catch (error) {
      console.error('[Subscription] Failed to create order:', error);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Subscription] handleCreateCode error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
