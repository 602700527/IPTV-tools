// 订阅支付相关 API 处理

// 生成随机卡密
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * 计算叠加后的过期时间
 * @param {Date|null} existingExpiry - 现有订阅过期时间
 * @param {number} newDurationDays - 新购买时长（天数，-1表示永久）
 * @returns {Date|null} 新的过期时间
 */
function calculateStackedExpiry(existingExpiry, newDurationDays) {
  const now = new Date();
  
  // 永久卡密不计算过期时间
  if (newDurationDays === -1) {
    return null; // 永久有效
  }
  
  // 如果没有现有过期时间，或者已过期，从当前时间计算
  const baseDate = existingExpiry && new Date(existingExpiry) > now 
    ? new Date(existingExpiry) 
    : now;
  
  // 叠加新时长
  return new Date(baseDate.getTime() + newDurationDays * 24 * 60 * 60 * 1000);
}

/**
 * 获取用户最新的有效订阅code
 * @returns {Promise<string|null>} 有效订阅的code，如果没有则返回null
 */
async function getUserActiveCode(userId, db) {
  const now = new Date().toISOString();
  
  // 查询用户最新的有效订阅（未过期的）
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

// 生成随机卡密（支持叠加购买）
export async function generateActivationCode(env, durationDays, maxIPs, userId, isTestMode = false, baseUrl = '') {
  const now = new Date();
  let code;
  let expiredAt;
  let isStacked = false;

  try {
    // 检查是否有现有的有效订阅
    const existingCode = await getUserActiveCode(userId, env.DB);
    
    if (existingCode) {
      // 叠加购买：延长现有code的过期时间
      code = existingCode.code;
      expiredAt = calculateStackedExpiry(existingCode.expired_at, durationDays);
      isStacked = true;
      
      // 更新现有code的过期时间
      await env.DB.prepare(`
        UPDATE codes 
        SET expired_at = ?, duration_days = ?
        WHERE code = ?
      `).bind(expiredAt ? expiredAt.toISOString() : null, durationDays, code).run();
      
      console.log('[Subscription] Stacked code:', code, 'for user:', userId, 'new duration:', durationDays, 'new expiry:', expiredAt);
    } else {
      // 新购买：创建新code
      code = generateCode();
      
      // 计算过期时间
      // 永久卡密（duration_days = -1）不设置过期时间
      if (durationDays !== -1) {
        expiredAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
      }
      
      // 生成卡密，状态为 active（已激活），激活时间为当天
      await env.DB.prepare(`
        INSERT INTO codes (code, status, duration_days, activated_at, expired_at, max_ips, remark)
        VALUES (?, 'active', ?, ?, ?, ?, ?)
      `).bind(code, durationDays, now.toISOString(), expiredAt ? expiredAt.toISOString() : null, maxIPs, isTestMode ? `Test purchase by user ${userId}` : `User ${userId} purchase`).run();
      
      console.log('[Subscription] Code generated:', code, 'for user:', userId, 'duration:', durationDays, 'max_ips:', maxIPs);
    }

    // 生成订阅地址
    const subUrl = `${baseUrl}/sub/${code}.m3u`;

    return {
      success: true,
      code: code,
      subUrl: subUrl,
      expiredAt: expiredAt ? expiredAt.toISOString() : null,
      activatedAt: now.toISOString(),
      stacked: isStacked
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
    // 验证用户身份
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

    // 验证 token 并获取用户信息
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
    const { duration_days, max_ips = 3, test_mode = false, payment_id = null } = body;

    // 验证参数（允许 -1 表示永久卡密）
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

    // 获取请求的 host 来构建订阅地址
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    console.log('[Subscription] Creating code for user:', user.id, 'duration:', duration_days, 'ips:', max_ips, 'test_mode:', test_mode);

    // 生成卡密，状态为 active（已激活），激活时间为当天
    const result = await generateActivationCode(env, duration_days, max_ips, user.id, test_mode, baseUrl);

    if (!result.success) {
      return new Response(JSON.stringify(result), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

      // 记录订单（无论是测试模式还是真实支付）
    try {
      // 从数据库获取套餐配置
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

      // 如果没有 payment_id，生成一个（用于测试模式）
      const orderId = payment_id || (test_mode ? 'test_' + Date.now() : 'manual_' + Date.now());

      await env.DB.prepare(`
        INSERT INTO user_orders (user_id, order_id, code, duration_days, amount, status)
        VALUES (?, ?, ?, ?, ?, 'completed')
      `).bind(user.id, orderId, result.code, duration_days, price.discounted).run();

      console.log('[Subscription] Order created:', orderId, 'for user:', user.id);
    } catch (error) {
      console.error('[Subscription] Failed to create order:', error);
      // 不影响卡密生成，所以继续返回
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
