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

// 生成随机卡密
export async function generateActivationCode(env, durationDays, maxIPs, userId, isTestMode = false, baseUrl = '') {
  const code = generateCode();
  const now = new Date();

  // 计算过期时间
  let expiredAt = null;
  // 永久卡密（duration_days = -1）不设置过期时间
  if (durationDays !== -1) {
    expiredAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
  }

  try {
    // 生成卡密，状态为 active（已激活），激活时间为当天
    await env.DB.prepare(`
      INSERT INTO codes (code, status, duration_days, activated_at, expired_at, max_ips, remark)
      VALUES (?, 'active', ?, ?, ?, ?, ?)
    `).bind(code, durationDays, now.toISOString(), expiredAt ? expiredAt.toISOString() : null, maxIPs, isTestMode ? `Test purchase by user ${userId}` : `User ${userId} purchase`).run();

    // 获取生成的卡密ID
    const generatedCode = await env.DB.prepare('SELECT code FROM codes WHERE code = ?').bind(code).first();

    // 生成订阅地址
    const subUrl = `${baseUrl}/sub/${code}.m3u`;

    console.log('[Subscription] Code generated:', code, 'for user:', userId, 'duration:', durationDays, 'max_ips:', maxIPs);

    return {
      success: true,
      code: code,
      subUrl: subUrl,
      expiredAt: expiredAt ? expiredAt.toISOString() : null,
      activatedAt: now.toISOString()
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
      // 计算价格（这里应该与前端价格计算一致）
      const plan = getPlanByDays(duration_days);
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
function getPlanByDays(days) {
  const plans = {
    30: { basePrice: 29, pricePerIP: 9, discount: 0 },
    60: { basePrice: 58, pricePerIP: 11, discount: 0 },
    90: { basePrice: 79, pricePerIP: 18, discount: 0 },
    180: { basePrice: 149, pricePerIP: 28, discount: 10 },
    365: { basePrice: 279, pricePerIP: 49, discount: 20 }
  };

  return plans[days] || { basePrice: 29, pricePerIP: 9, discount: 0 };
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
