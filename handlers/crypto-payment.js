// 加密货币支付处理 (Coinbase Commerce + 直接稳定币支付)
import { generateActivationCode } from './subscription-api.js';

// ========== Coinbase Commerce API ==========

/**
 * 创建 Coinbase Commerce 支付订单
 */
export async function createCoinbaseOrder(env, userId, durationDays, maxIPs, amountCNY, exchangeRate = 7.2) {
  // 从数据库获取 Coinbase 配置
  const configResult = await env.DB.prepare('SELECT config FROM payment_methods WHERE type = ? AND enabled = 1').bind('coinbase').first();

  if (!configResult || !configResult.config) {
    return {
      success: false,
      error: 'Coinbase Commerce payment method not configured'
    };
  }

  const config = JSON.parse(configResult.config);
  const apiKey = config.api_key;

  if (!apiKey) {
    return {
      success: false,
      error: 'Coinbase Commerce API key not configured. Please configure it in the admin panel.'
    };
  }

  try {
    // 将人民币转换为美元
    const amountUSD = (amountCNY / exchangeRate).toFixed(2);

    // 生成唯一订单ID
    const orderId = `coinbase_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // 调用 Coinbase Commerce API 创建 charge
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({
        name: `TV Subscription - ${durationDays} Days`,
        description: `${durationDays} days TV subscription with ${maxIPs} IP limit`,
        local_price: {
          amount: amountUSD,
          currency: 'USD'
        },
        pricing_type: 'fixed_price',
        metadata: {
          user_id: userId,
          duration_days: durationDays,
          max_ips: maxIPs,
          order_id: orderId
        },
        redirect_url: `${env.APP_URL}/subscription`,
        cancel_url: `${env.APP_URL}/subscription`
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Coinbase] API error:', response.status, errorText);
      return {
        success: false,
        error: `Coinbase API error: ${response.status}`
      };
    }

    const data = await response.json();

    // 保存订单到数据库
    await env.DB.prepare(`
      INSERT INTO xunhupay_orders (order_id, user_id, trade_order_id, payment_method, amount, duration_days, max_ips, status, xunhupay_order_id, xunhupay_transaction_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId,
      userId,
      data.data.code,
      'coinbase',
      amountUSD,
      durationDays,
      maxIPs,
      'pending',
      data.data.id,
      data.data.id
    ).run();

    console.log('[Coinbase] Order created:', orderId, 'for user:', userId);

    return {
      success: true,
      order_id: orderId,
      payment_data: {
        code: data.data.code,
        id: data.data.id,
        url: data.data.hosted_url,
        url_qrcode: data.data.qr_code?.uri,
        amount: amountUSD,
        currency: 'USD'
      }
    };
  } catch (error) {
    console.error('[Coinbase] Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create Coinbase order'
    };
  }
}

/**
 * 检查 Coinbase 订单状态
 */
export async function checkCoinbaseOrder(env, orderId) {
  // 从数据库获取 Coinbase 配置
  const configResult = await env.DB.prepare('SELECT config FROM payment_methods WHERE type = ?').bind('coinbase').first();

  if (!configResult || !configResult.config) {
    return {
      success: false,
      error: 'Coinbase Commerce payment method not configured'
    };
  }

  const config = JSON.parse(configResult.config);
  const apiKey = config.api_key;

  if (!apiKey) {
    return {
      success: false,
      error: 'Coinbase Commerce API key not configured. Please configure it in the admin panel.'
    };
  }

  try {
    // 从数据库获取 charge code
    const order = await env.DB.prepare('SELECT trade_order_id, xunhupay_order_id FROM xunhupay_orders WHERE order_id = ?').bind(orderId).first();

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      };
    }

    // 调用 Coinbase Commerce API 获取 charge 状态
    const response = await fetch(`https://api.commerce.coinbase.com/charges/${order.trade_order_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Coinbase API error: ${response.status}`
      };
    }

    const data = await response.json();
    const charge = data.data;

    // 更新数据库中的订单状态
    if (charge.timeline && charge.timeline.length > 0) {
      const lastStatus = charge.timeline[charge.timeline.length - 1];
      let dbStatus = 'pending';

      if (lastStatus.status === 'CONFIRMED' || charge.pricing.local.currency === 'USD' && lastStatus.status === 'COMPLETED') {
        dbStatus = 'completed';
      } else if (lastStatus.status === 'EXPIRED' || lastStatus.status === 'CANCELED') {
        dbStatus = 'failed';
      }

      // 如果订单完成，生成卡密
      if (dbStatus === 'completed') {
        const orderData = await env.DB.prepare(`
          SELECT user_id, duration_days, max_ips, code FROM xunhupay_orders WHERE order_id = ?
        `).bind(orderId).first();

        if (orderData && !orderData.code) {
          const result = await generateActivationCode(
            env,
            orderData.duration_days,
            orderData.max_ips,
            orderData.user_id,
            false,
            env.APP_URL
          );

          if (result.success) {
            await env.DB.prepare(`
              UPDATE xunhupay_orders SET status = ?, code = ? WHERE order_id = ?
            `).bind('completed', result.code, orderId).run();

            console.log('[Coinbase] Payment completed, code generated:', result.code);
          }
        }
      }

      return {
        success: true,
        order: {
          status: dbStatus,
          coinbase_status: lastStatus.status,
          code: orderData?.code || null
        }
      };
    }

    return {
      success: true,
      order: {
        status: 'pending',
        coinbase_status: 'NEW'
      }
    };
  } catch (error) {
    console.error('[Coinbase] Error checking order:', error);
    return {
      success: false,
      error: 'Failed to check order status'
    };
  }
}

/**
 * 处理 Coinbase Webhook 回调
 */
export async function handleCoinbaseWebhook(request, env) {
  // 从数据库获取 Coinbase 配置
  const configResult = await env.DB.prepare('SELECT config FROM payment_methods WHERE type = ?').bind('coinbase').first();

  if (!configResult || !configResult.config) {
    return {
      success: false,
      error: 'Coinbase Commerce payment method not configured'
    };
  }

  const config = JSON.parse(configResult.config);
  const webhookSecret = config.webhook_secret;

  if (!webhookSecret) {
    return {
      success: false,
      error: 'Webhook secret not configured in admin panel'
    };
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('X-CC-Webhook-Signature');

    // 验证 webhook 签名（简化版，生产环境需要使用 HMAC 验证）
    if (!signature) {
      console.error('[Coinbase] No signature provided');
      return {
        success: false,
        error: 'Invalid webhook signature'
      };
    }

    const event = JSON.parse(body);

    // 只处理 charge:confirmed 事件
    if (event.event.type !== 'charge:confirmed') {
      console.log('[Coinbase] Ignoring event type:', event.event.type);
      return { success: true };
    }

    const charge = event.event.data;
    const orderId = charge.metadata?.order_id;

    if (!orderId) {
      console.error('[Coinbase] No order_id in metadata');
      return {
        success: false,
        error: 'No order_id in webhook'
      };
    }

    // 检查订单是否已完成
    const existingOrder = await env.DB.prepare('SELECT status, code FROM xunhupay_orders WHERE order_id = ?').bind(orderId).first();

    if (existingOrder && existingOrder.status === 'completed') {
      console.log('[Coinbase] Order already completed:', orderId);
      return { success: true };
    }

    // 生成卡密
    const userId = charge.metadata?.user_id;
    const durationDays = charge.metadata?.duration_days;
    const maxIPs = charge.metadata?.max_ips;

    if (!userId || !durationDays || !maxIPs) {
      console.error('[Coinbase] Missing metadata');
      return {
        success: false,
        error: 'Missing metadata'
      };
    }

    const result = await generateActivationCode(
      env,
      durationDays,
      maxIPs,
      userId,
      false,
      env.APP_URL
    );

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to generate activation code'
      };
    }

    // 更新订单状态
    await env.DB.prepare(`
      UPDATE xunhupay_orders
      SET status = 'completed', code = ?, notify_received = 1
      WHERE order_id = ?
    `).bind(result.code, orderId).run();

    console.log('[Coinbase] Webhook processed, code generated:', result.code, 'for order:', orderId);

    return {
      success: true,
      code: result.code
    };
  } catch (error) {
    console.error('[Coinbase] Webhook error:', error);
    return {
      success: false,
      error: 'Webhook processing failed'
    };
  }
}

// ========== 直接稳定币支付（手动确认）==========

/**
 * 创建 USDT/USDC 直接支付订单
 */
export async function createCryptoPaymentOrder(env, userId, durationDays, maxIPs, amountCNY, paymentMethod, exchangeRate = 7.2) {
  try {
    // 确定支付方式对应的网络
    let network = '';
    if (paymentMethod === 'usdt') network = 'TRC20';
    if (paymentMethod === 'usdc') network = 'ERC20';

    // 将人民币转换为美元（稳定币通常是美元计价）
    const amountUSD = (amountCNY / exchangeRate).toFixed(2);

    // 生成唯一订单ID
    const orderId = `crypto_${paymentMethod}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // 保存待确认订单
    await env.DB.prepare(`
      INSERT INTO xunhupay_orders (order_id, user_id, trade_order_id, payment_method, amount, duration_days, max_ips, status, xunhupay_order_id, xunhupay_transaction_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId,
      userId,
      orderId,
      paymentMethod,
      amountUSD,
      durationDays,
      maxIPs,
      'pending',
      '',
      ''
    ).run();

    // 从数据库获取钱包地址
    const paymentMethodConfig = await env.DB.prepare('SELECT config FROM payment_methods WHERE type = ?').bind(paymentMethod).first();

    let walletAddress = '';
    if (paymentMethodConfig && paymentMethodConfig.config) {
      const config = JSON.parse(paymentMethodConfig.config);
      walletAddress = config.wallet_address || '';
    }

    console.log('[Crypto] Direct payment order created:', orderId, 'for user:', userId, 'method:', paymentMethod);

    return {
      success: true,
      order_id: orderId,
      payment_data: {
        wallet_address: walletAddress,
        amount: amountUSD,
        currency: paymentMethod.toUpperCase(),
        network: network,
        memo: orderId // 用户需要在转账备注中填写订单ID
      }
    };
  } catch (error) {
    console.error('[Crypto] Error creating payment order:', error);
    return {
      success: false,
      error: 'Failed to create crypto payment order'
    };
  }
}

/**
 * 管理员手动确认加密货币支付
 */
export async function confirmCryptoPayment(env, orderId, adminKey) {
  // 验证管理员权限
  if (adminKey !== env.ADMIN_KEY) {
    return {
      success: false,
      error: 'Unauthorized'
    };
  }

  try {
    // 获取订单信息
    const order = await env.DB.prepare(`
      SELECT user_id, duration_days, max_ips, code, status FROM xunhupay_orders WHERE order_id = ?
    `).bind(orderId).first();

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      };
    }

    if (order.status === 'completed') {
      return {
        success: true,
        code: order.code,
        message: 'Order already completed'
      };
    }

    // 生成卡密
    const result = await generateActivationCode(
      env,
      order.duration_days,
      order.max_ips,
      order.user_id,
      false,
      env.APP_URL
    );

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to generate activation code'
      };
    }

    // 更新订单状态
    await env.DB.prepare(`
      UPDATE xunhupay_orders SET status = 'completed', code = ? WHERE order_id = ?
    `).bind(result.code, orderId).run();

    console.log('[Crypto] Payment confirmed by admin:', orderId, 'code:', result.code);

    return {
      success: true,
      code: result.code
    };
  } catch (error) {
    console.error('[Crypto] Error confirming payment:', error);
    return {
      success: false,
      error: 'Failed to confirm payment'
    };
  }
}
