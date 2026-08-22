// 虎皮椒支付 API 处理
import { generateActivationCode, validateDiscountCode } from './subscription-api.js';

/**
 * 生成虎皮椒签名
 * @param {object} data - 待签名的数据
 * @param {string} appSecret - 应用密钥
 * @returns {string} MD5签名
 */
function generateXunhuPayHash(data, appSecret) {
  // 1. 按参数名ASCII码从小到大排序
  const sortedKeys = Object.keys(data).sort();
  
  // 2. 拼接字符串，跳过空值和hash字段
  const stringA = sortedKeys
    .filter(key => key !== 'hash' && key !== 'HASH' && data[key] !== '' && data[key] !== null)
    .map(key => `${key}=${data[key]}`)
    .join('&');
  
  // 3. 在最后拼接appSecret
  const stringSignTemp = stringA + appSecret;
  
  // 4. MD5加密
  return md5(stringSignTemp);
}

/**
 * MD5哈希函数（简化版，实际使用crypto.subtle）
 * @param {string} str - 待哈希字符串
 * @returns {string} MD5哈希值
 */
async function md5(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 创建虎皮椒支付订单
 */
export async function handleCreateXunhuPayOrder(request, env, ctx) {
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
    const { duration_days, max_ips, payment_method, topic_id = null, sub_mode = null, discount_code = null } = body;

    // 验证参数
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

    if (!['alipay', 'wechat'].includes(payment_method)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid payment method (alipay or wechat)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    // 应用优惠码
    if (discount_code) {
      const discountResult = await validateDiscountCode(discount_code, price.discounted, env);
      if (!discountResult.success) {
        return new Response(JSON.stringify({ success: false, error: discountResult.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      price.discounted = discountResult.finalAmount;
    }

    // 根据支付方式获取对应的配置
    const paymentMethodConfig = await env.DB.prepare(`
      SELECT * FROM payment_methods WHERE type = ? AND enabled = 1
    `).bind(payment_method).first();

    if (!paymentMethodConfig) {
      console.error('[XunhuPay] Payment method not found or disabled:', payment_method);
      return new Response(JSON.stringify({
        success: false,
        error: `支付方式 ${payment_method} 未启用或未配置`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const config = JSON.parse(paymentMethodConfig.config || '{}');
    const appId = config.app_id;
    const appSecret = config.app_secret;
    const gatewayUrl = config.gateway_url || env.XUNHUPAY_GATEWAY || 'https://api.xunhuweb.com/payment/do.html';

    if (!appId || !appSecret) {
      console.error('[XunhuPay] Configuration missing for payment method:', payment_method);
      return new Response(JSON.stringify({
        success: false,
        error: `${paymentMethodConfig.name} 配置不完整，请填写商户ID和密钥`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 生成订单号
    const tradeOrderId = `TV${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const nonceStr = Math.random().toString(36).substring(2, 15);
    const timestamp = Math.floor(Date.now() / 1000);

    // 构建请求数据
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const notifyUrl = `${baseUrl}/api/payment/xunhupay/notify`;
    const returnUrl = `${baseUrl}/account?payment=success`;
    const callbackUrl = `${baseUrl}/account?payment=cancelled`;

    const requestData = {
      version: '1.1',
      appid: appId,
      trade_order_id: tradeOrderId,
      total_fee: price.discounted.toFixed(2),
      title: `TV订阅 ${duration_days}天 ${max_ips}IP`,
      time: timestamp,
      notify_url: notifyUrl,
      return_url: returnUrl,
      callback_url: callbackUrl,
      nonce_str: nonceStr,
      attach: JSON.stringify({ user_id: user.id, duration_days, max_ips }),
      plugins: 'cf-worker-tv' // 可选，用于识别对接程序
    };

    // 生成签名
    requestData.hash = await generateXunhuPayHash(requestData, appSecret);

    console.log('[XunhuPay] Request data:', requestData);

    // 将订单数据提交到虎皮椒支付网关
    const formData = new FormData();
    Object.keys(requestData).forEach(key => {
      formData.append(key, requestData[key]);
    });

    const xunhuResponse = await fetch(gatewayUrl, {
      method: 'POST',
      body: formData
    });

    const xunhuResponseText = await xunhuResponse.text();
    console.log('[XunhuPay] Response status:', xunhuResponse.status);
    console.log('[XunhuPay] Response text:', xunhuResponseText);

    // 虎皮椒返回的数据可能是 JSON 或 URL-encoded
    let paymentData;
    try {
      // 尝试解析 JSON
      paymentData = JSON.parse(xunhuResponseText);
      console.log('[XunhuPay] Parsed JSON:', paymentData);
    } catch (e) {
      // 如果不是 JSON，可能是 URL-encoded 格式
      console.log('[XunhuPay] Failed to parse as JSON, trying URL-encoded');
      const params = new URLSearchParams(xunhuResponseText);
      paymentData = {};
      params.forEach((value, key) => {
        paymentData[key.toLowerCase()] = value; // 统一转小写
      });
      console.log('[XunhuPay] Parsed URL-encoded:', paymentData);
    }

    // 检查虎皮椒响应
    const errcode = paymentData.errcode !== undefined ? paymentData.errcode : 0;
    if (errcode !== 0) {
      console.error('[XunhuPay] Failed to create order:', paymentData);
      return new Response(JSON.stringify({
        success: false,
        error: paymentData?.errmsg || 'Failed to create payment order'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 标准化参数名（处理大小写不一致的情况）
    const standardizedPaymentData = {
      openid: paymentData.openid || paymentData.ORDERID || paymentData.orderid || '',
      url_qrcode: paymentData.url_qrcode || paymentData.URL_QRCODE || '',
      url: paymentData.url || paymentData.URL || '',
      errcode: paymentData.errcode || paymentData.ERRCODE || 0,
      errmsg: paymentData.errmsg || paymentData.ERRMSG || '',
      hash: paymentData.hash || paymentData.HASH || ''
    };

    console.log('[XunhuPay] Standardized payment data:', standardizedPaymentData);

    // 保存订单信息到数据库
    await env.DB.prepare(`
      INSERT INTO xunhupay_orders (order_id, user_id, trade_order_id, payment_method, amount, duration_days, max_ips, status, xunhupay_order_id, topic_id, sub_mode, discount_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `).bind(tradeOrderId, user.id, tradeOrderId, payment_method, price.discounted, duration_days, max_ips, standardizedPaymentData.openid || '', topic_id || null, sub_mode, discount_code || '').run();

    console.log('[XunhuPay] Order created:', tradeOrderId, 'for user:', user.id);

    // 返回虎皮椒返回的支付信息
    return new Response(JSON.stringify({
      success: true,
      order_id: tradeOrderId,
      payment_data: standardizedPaymentData,
      payment_url: gatewayUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[XunhuPay] Create order error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 处理虎皮椒支付回调通知
 */
export async function handleXunhuPayNotify(request, env, ctx) {
  try {
    // 获取请求体（FORM表单）
    const formData = await request.formData();
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    console.log('[XunhuPay] Notify received:', data);

    // 验证必需参数
    if (!data.trade_order_id || !data.hash) {
      console.error('[XunhuPay] Missing required parameters');
      return new Response('FAIL', { status: 400 });
    }

    // 查询订单信息
    const order = await env.DB.prepare(`
      SELECT * FROM xunhupay_orders WHERE trade_order_id = ?
    `).bind(data.trade_order_id).first();

    if (!order) {
      console.error('[XunhuPay] Order not found:', data.trade_order_id);
      return new Response('FAIL', { status: 404 });
    }

    // 根据订单的支付方式获取对应的配置
    const paymentMethodConfig = await env.DB.prepare(`
      SELECT * FROM payment_methods WHERE type = ?
    `).bind(order.payment_method).first();

    if (!paymentMethodConfig) {
      console.error('[XunhuPay] Payment method not found:', order.payment_method);
      return new Response('FAIL', { status: 404 });
    }

    const config = JSON.parse(paymentMethodConfig.config || '{}');
    const appSecret = config.app_secret;

    if (!appSecret) {
      console.error('[XunhuPay] App Secret not configured for payment method:', order.payment_method);
      return new Response('FAIL', { status: 500 });
    }

    // 验证签名
    const calculatedHash = await generateXunhuPayHash(data, appSecret);
    if (calculatedHash.toLowerCase() !== data.hash.toLowerCase()) {
      console.error('[XunhuPay] Invalid signature');
      return new Response('FAIL', { status: 401 });
    }

    // 检查支付状态
    // OD: 订单支付完成, WD: 订单退款, 其他状态需要确认
    if (data.status !== 'OD' && data.status !== 'WD') {
      console.warn('[XunhuPay] Payment not completed yet, status:', data.status);
      // 返回 FAIL 让虎皮椒稍后重试
      return new Response('FAIL', { status: 200 });
    }

    // 如果是退款状态，标记为已退款但不需要生成卡密
    if (data.status === 'WD') {
      console.log('[XunhuPay] Order refunded:', data.trade_order_id);
      return new Response('SUCCESS');
    }

    // 验证金额
    if (parseFloat(data.total_fee) !== parseFloat(order.amount)) {
      console.error('[XunhuPay] Amount mismatch');
      return new Response('FAIL', { status: 400 });
    }

    // 检查订单是否已处理
    if (order.status === 'completed') {
      console.log('[XunhuPay] Order already completed');
      return new Response('SUCCESS');
    }

    // 更新订单状态
    await env.DB.prepare(`
      UPDATE xunhupay_orders
      SET status = 'completed',
          xunhupay_order_id = ?,
          xunhupay_transaction_id = ?,
          notify_received = 1,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(data.open_order_id || '', data.transaction_id || '', order.id).run();

    // 生成卡密（带 topic_id / sub_mode 保留订阅人选择的方案）
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const result = await generateActivationCode(
      env,
      order.duration_days,
      order.max_ips,
      order.user_id,
      order.topic_id || null,
      false,
      baseUrl,
      order.sub_mode || null
    );

    if (result.success) {
      // 更新订单，添加卡密
      await env.DB.prepare(`
        UPDATE xunhupay_orders SET code = ? WHERE id = ?
      `).bind(result.code, order.id).run();

      // 记录到user_orders
      await env.DB.prepare(`
        INSERT INTO user_orders (user_id, order_id, code, duration_days, amount, discount_code, status)
        VALUES (?, ?, ?, ?, ?, ?, 'completed')
      `).bind(order.user_id, order.order_id, result.code, order.duration_days, order.amount, order.discount_code || '').run();

      console.log('[XunhuPay] Order completed and code generated:', result.code);
    }

    return new Response('SUCCESS');

  } catch (error) {
    console.error('[XunhuPay] Notify error:', error);
    return new Response('FAIL', { status: 500 });
  }
}

/**
 * 查询虎皮椒订单状态
 */
export async function handleCheckXunhuPayOrder(request, env, ctx) {
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

    const user = await env.DB.prepare(`
      SELECT u.id
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

    const url = new URL(request.url);
    const orderId = url.searchParams.get('order_id');

    if (!orderId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing order_id'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 查询订单状态
    const order = await env.DB.prepare(`
      SELECT * FROM xunhupay_orders 
      WHERE order_id = ? AND user_id = ?
    `).bind(orderId, user.id).first();

    if (!order) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Order not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      order: {
        id: order.order_id,
        status: order.status,
        amount: order.amount,
        duration_days: order.duration_days,
        max_ips: order.max_ips,
        code: order.code || null, // 返回卡密信息
        created_at: order.created_at
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[XunhuPay] Check order error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 根据天数获取套餐配置
 */
/**
 * 从数据库获取套餐配置
 */
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

/**
 * 计算价格
 */
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

/**
 * 获取支付方式配置
 */
async function getPaymentConfig(db, type) {
  return await db.prepare(`
    SELECT * FROM payment_methods WHERE type = ?
  `).bind(type).first();
}

/**
 * 获取支付方式列表（支持管理员和公开访问）
 * - 管理员访问（需要 X-Admin-Key）：返回所有支付方式，包括 config
 * - 公开访问：只返回已启用的支付方式，不包含 config
 */
export async function handleGetPaymentMethods(request, env, ctx) {
  try {
    const adminKey = request.headers.get('X-Admin-Key');
    const isAdmin = adminKey === env.ADMIN_KEY;

    // 构建查询
    let query = 'SELECT * FROM payment_methods';
    if (!isAdmin) {
      query += ' WHERE enabled = 1';
    }
    query += ' ORDER BY id';

    const result = await env.DB.prepare(query).all();

    const methods = result.results || [];
    const formattedMethods = methods.map(m => ({
      id: m.id,
      type: m.type,
      name: m.name,
      enabled: m.enabled ? 1 : 0,
      config: isAdmin ? (m.config || '{}') : undefined, // 管理员才返回 config
      created_at: m.created_at,
      updated_at: m.updated_at
    }));

    return new Response(JSON.stringify({
      success: true,
      payment_methods: formattedMethods
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Payment] Get methods error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 管理员：更新支付方式配置
 */
export async function handleUpdatePaymentMethod(request, env, ctx) {
  try {
    const adminKey = request.headers.get('X-Admin-Key');
    if (adminKey !== env.ADMIN_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { type, name, enabled, config } = body;

    // 验证参数
    const validTypes = ['alipay', 'wechat'];
    if (!validTypes.includes(type)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid payment type'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 更新或插入支付方式
    const existing = await env.DB.prepare(`
      SELECT * FROM payment_methods WHERE type = ?
    `).bind(type).first();

    if (existing) {
      await env.DB.prepare(`
        UPDATE payment_methods
        SET name = ?,
            enabled = ?,
            config = ?,
            updated_at = datetime('now')
        WHERE type = ?
      `).bind(name, enabled ? 1 : 0, JSON.stringify(config), type).run();
    } else {
      await env.DB.prepare(`
        INSERT INTO payment_methods (type, name, enabled, config)
        VALUES (?, ?, ?, ?)
      `).bind(type, name, enabled ? 1 : 0, JSON.stringify(config)).run();
    }

    console.log('[Payment] Payment method updated:', type);

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment method updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Payment] Update method error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 管理员：切换支付方式启用状态
 */
export async function handleTogglePaymentMethod(request, env, ctx, id) {
  try {
    const adminKey = request.headers.get('X-Admin-Key');
    if (adminKey !== env.ADMIN_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { enabled } = body;

    // 更新支付方式状态
    await env.DB.prepare(`
      UPDATE payment_methods
      SET enabled = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(enabled ? 1 : 0, id).run();

    console.log('[Payment] Payment method toggled:', id, 'enabled:', enabled);

    return new Response(JSON.stringify({
      success: true,
      message: enabled ? '已启用' : '已禁用'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Payment] Toggle method error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 管理员：获取虎皮椒订单列表
 */
export async function handleGetXunhuPayOrders(request, env, ctx) {
  try {
    const adminKey = request.headers.get('X-Admin-Key');
    if (adminKey !== env.ADMIN_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const pageSize = parseInt(url.searchParams.get('page_size')) || 20;
    const status = url.searchParams.get('status') || '';

    const offset = (page - 1) * pageSize;

    let query = 'SELECT * FROM xunhupay_orders';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const result = await env.DB.prepare(query).bind(...params).all();
    const orders = result.results || [];

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as count FROM xunhupay_orders';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await env.DB.prepare(countQuery).bind(...params.slice(0, -2)).first();

    return new Response(JSON.stringify({
      success: true,
      orders,
      total: countResult?.count || 0,
      page,
      page_size: pageSize
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Payment] Get orders error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 调试：模拟支付成功（仅本地开发环境使用）
 * 注意：此接口仅用于测试，不应在生产环境暴露
 */
export async function handleSimulatePaymentSuccess(request, env, ctx) {
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

    const url = new URL(request.url);
    const orderId = url.searchParams.get('order_id');

    if (!orderId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing order_id'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 查询订单信息
    const order = await env.DB.prepare(`
      SELECT * FROM xunhupay_orders WHERE order_id = ? AND user_id = ?
    `).bind(orderId, user.id).first();

    if (!order) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Order not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查订单是否已处理
    if (order.status === 'completed') {
      return new Response(JSON.stringify({
        success: true,
        message: 'Order already completed',
        code: order.code
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 模拟支付成功，更新订单状态
    await env.DB.prepare(`
      UPDATE xunhupay_orders
      SET status = 'completed',
          notify_received = 1,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(order.id).run();

    // 生成卡密（带 topic_id / sub_mode）
    const baseUrl = `${url.protocol}//${url.host}`;
    const result = await generateActivationCode(
      env,
      order.duration_days,
      order.max_ips,
      order.user_id,
      order.topic_id || null,
      false,
      baseUrl,
      order.sub_mode || null
    );

    if (result.success) {
      // 更新订单，添加卡密
      await env.DB.prepare(`
        UPDATE xunhupay_orders SET code = ? WHERE id = ?
      `).bind(result.code, order.id).run();

      // 记录到 user_orders
      await env.DB.prepare(`
        INSERT INTO user_orders (user_id, order_id, code, duration_days, amount, discount_code, status)
        VALUES (?, ?, ?, ?, ?, ?, 'completed')
      `).bind(order.user_id, order.order_id, result.code, order.duration_days, order.amount, order.discount_code || '').run();

      console.log('[SimulatePayment] Order completed and code generated:', result.code);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment simulated successfully',
      code: result.success ? result.code : null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[SimulatePayment] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
