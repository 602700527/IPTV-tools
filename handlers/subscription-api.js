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
export async function generateActivationCode(env, durationDays, maxIPs, userId, isTestMode = false) {
  const code = generateCode();
  const now = new Date();

  // 计算过期时间
  const expiredAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  try {
    // 生成卡密
    await env.DB.prepare(`
      INSERT INTO codes (code, status, duration_days, expired_at, max_ips, remark)
      VALUES (?, 'active', ?, ?, ?, ?)
    `).bind(code, durationDays, expiredAt.toISOString(), maxIPs, isTestMode ? `Test purchase by user ${userId}` : `User ${userId} purchase`).run();

    // 获取生成的卡密ID
    const generatedCode = await env.DB.prepare('SELECT code FROM codes WHERE code = ?').bind(code).first();

    console.log('[Subscription] Code generated:', code, 'for user:', userId, 'duration:', durationDays, 'max_ips:', maxIPs);

    return {
      success: true,
      code: code,
      expiredAt: expiredAt.toISOString()
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

    // 验证参数
    if (!duration_days || duration_days < 1 || duration_days > 365) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid duration_days (1-365)'
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

    console.log('[Subscription] Creating code for user:', user.id, 'duration:', duration_days, 'ips:', max_ips, 'test_mode:', test_mode);

    // 生成卡密
    const result = await generateActivationCode(env, duration_days, max_ips, user.id, test_mode);

    if (!result.success) {
      return new Response(JSON.stringify(result), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 如果是真实支付，记录订单
    if (!test_mode && payment_id) {
      try {
        // 计算价格（这里应该与前端价格计算一致）
        const plan = getPlanByDays(duration_days);
        const price = calculatePrice(plan, max_ips);

        await env.DB.prepare(`
          INSERT INTO user_orders (user_id, order_id, code, duration_days, amount, status)
          VALUES (?, ?, ?, ?, ?, 'completed')
        `).bind(user.id, payment_id, result.code, duration_days, price.discounted).run();

        console.log('[Subscription] Order created:', payment_id, 'for user:', user.id);
      } catch (error) {
        console.error('[Subscription] Failed to create order:', error);
        // 不影响卡密生成，所以继续返回
      }
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
    30: { basePrice: 5, pricePerIP: 1.5, discount: 0 },
    60: { basePrice: 8, pricePerIP: 2, discount: 0 },
    90: { basePrice: 12, pricePerIP: 2.5, discount: 0 },
    180: { basePrice: 20, pricePerIP: 4, discount: 10 },
    365: { basePrice: 35, pricePerIP: 7, discount: 20 }
  };

  return plans[days] || { basePrice: 5, pricePerIP: 1.5, discount: 0 };
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

// PayPal Webhook 处理（用于接收真实的 PayPal 支付通知）
export async function handlePayPalWebhook(request, env, ctx) {
  try {
    // 验证 PayPal Webhook（实际生产中需要验证 PayPal 签名）
    // const webhookId = request.headers.get('PayPal-Transmission-Id');
    
    const body = await request.json();
    
    // TODO: 验证 PayPal 签名
    // const isValid = await verifyPayPalSignature(body);
    // if (!isValid) {
    //   return new Response('Invalid signature', { status: 401 });
    // }

    console.log('[PayPal Webhook] Received:', body);

    const { event_type, resource, payment_id } = body;

    // 处理支付完成事件
    if (event_type === 'PAYMENT.CAPTURE.COMPLETED' || event_type === 'PAYMENT.SALE.COMPLETED') {
      // 从 payment_id 或自定义数据中获取用户ID、天数、IP数
      // 这里需要根据实际的 PayPal 集成方式调整
      // 假设从自定义字段获取
      const { user_id, duration_days, max_ips } = resource.custom || {};

      if (!user_id || !duration_days || !max_ips) {
        console.error('[PayPal Webhook] Missing required fields');
        return new Response(JSON.stringify({ success: false }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 生成卡密
      const result = await generateActivationCode(
        env,
        duration_days,
        max_ips,
        user_id,
        false // 不是测试模式
      );

      if (result.success) {
        // 记录订单
        const plan = getPlanByDays(duration_days);
        const price = calculatePrice(plan, max_ips);

        await env.DB.prepare(`
          INSERT INTO user_orders (user_id, order_id, code, duration_days, amount, status)
          VALUES (?, ?, ?, ?, ?, 'completed')
        `).bind(user_id, payment_id, result.code, duration_days, price.discounted).run();

        console.log('[PayPal Webhook] Code generated and order created');
      }

      return new Response(JSON.stringify({
        success: result.success,
        code: result.code
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook received'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[PayPal Webhook] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Webhook processing failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
