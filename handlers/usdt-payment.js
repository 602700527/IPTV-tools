// USDT (TRC20) 支付处理
// 通过 epusdt-workers (https://github.com/xiaohuilam/epusdt-workers) 完成链上收款
//
// 必要环境变量（通过 wrangler secret put 配置）：
//   USDT_API_AUTH_TOKEN  — 与 epusdt-workers 的 API_AUTH_TOKEN 一致
//   USDT_WORKER_URL      — epusdt-workers 部署后的 URL（不含尾斜杠）
//
// 签名算法与 epusdt-workers 完全一致：
//   1. 过滤空值与 signature 字段
//   2. 按 key 字典序排序
//   3. 拼接 "key=value&key=value"
//   4. 末尾追加 API_AUTH_TOKEN
//   5. MD5 小写

// ============ 签名工具 ============

function generateSignature(data, bizKey) {
  const keys = Object.keys(data).filter(k => {
    const v = data[k];
    return k !== 'signature' && v !== null && v !== undefined && v !== '';
  }).sort();

  const signStr = keys.map(k => `${k}=${data[k]}`).join('&');
  return md5Hex(signStr + bizKey);
}

// Cloudflare Workers 自带 crypto.subtle，但 MD5 不在 SubtleCrypto 列表里
// 用纯 JS 实现的 MD5（Workers 运行时可用）
function md5Hex(str) {
  function rh(n) {
    let s = '';
    for (let j = 0; j <= 3; j++) {
      s += ((n >> (j * 8 + 4)) & 0x0F).toString(16) + ((n >> (j * 8)) & 0x0F).toString(16);
    }
    return s;
  }
  function ad(x, y) {
    const l = (x & 0xFFFF) + (y & 0xFFFF);
    const m = (x >> 16) + (y >> 16) + (l >> 16);
    return (m << 16) | (l & 0xFFFF);
  }
  function rl(n, c) { return (n << c) | (n >>> (32 - c)); }
  function cm(q, a, b, x, s, t) { return ad(rl(ad(ad(a, q), ad(x, t)), s), b); }
  function ff(a, b, c, d, x, s, t) { return cm((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cm((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cm(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cm(c ^ (b | (~d)), a, b, x, s, t); }

  function s2b(s) {
    const nblk = ((s.length + 8) >> 6) + 1;
    const blks = new Array(nblk * 16).fill(0);
    let i;
    for (i = 0; i < s.length; i++) blks[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = s.length * 8;
    return blks;
  }

  const x = s2b(str);
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const oa = a, ob = b, oc = c, od = d;
    a = ff(a, b, c, d, x[i], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = ii(a, b, c, d, x[i], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = ad(a, oa); b = ad(b, ob); c = ad(c, oc); d = ad(d, od);
  }
  return rh(a) + rh(b) + rh(c) + rh(d);
}

function verifySignature(data, bizKey, signature) {
  return generateSignature(data, bizKey) === signature;
}

// ============ Helper：取订单 CNY 价格 ============

async function getCnyPrice(env, durationDays, maxIps) {
  const plan = await env.DB.prepare(`
    SELECT base_price, price_per_ip, discount
    FROM subscription_plans
    WHERE days = ? AND is_enabled = 1
  `).bind(durationDays).first();

  if (!plan) throw new Error('套餐不存在或已禁用');

  const base = plan.base_price + plan.price_per_ip * maxIps;
  const discounted = base * (1 - (plan.discount || 0) / 100);
  return Number(discounted.toFixed(2));
}

// ============ Handler：创建 USDT 订单 ============

export async function handleUsdtCreateOrder(request, env, ctx) {
  try {
    // 1. 鉴权
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jsonResp({ success: false, error: 'Unauthorized' }, 401);
    }
    const user = await getUserFromToken(env, authHeader.substring(7));
    if (!user) return jsonResp({ success: false, error: 'Invalid token' }, 401);

    // 2. 解析 body
    const body = await request.json().catch(() => ({}));
    const durationDays = Number(body.duration_days);
    const maxIps = Number(body.max_ips);
    const topicId = body.topic_id ? Number(body.topic_id) : null;
    const subMode = body.sub_mode || null;

    if (!durationDays || durationDays < 1 || durationDays > 365) {
      return jsonResp({ success: false, error: 'Invalid duration_days' }, 400);
    }
    if (![1, 2, 3, 5].includes(maxIps)) {
      return jsonResp({ success: false, error: 'Invalid max_ips' }, 400);
    }
    if (!env.USD_WORKER_URL || !env.USD_API_AUTH_TOKEN) {
      return jsonResp({ success: false, error: 'USDT 支付未配置' }, 500);
    }

    // 3. 计算 CNY 价格
    const cnyAmount = await getCnyPrice(env, durationDays, maxIps);

    // 4. 生成本地订单号
    const orderId = `USDT${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 5. 先写 usdt_orders（status=1 表示"待支付"）
    await env.DB.prepare(`
      INSERT INTO usdt_orders (
        order_id, user_id, duration_days, max_ips, amount, currency, status,
        notify_url, redirect_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'CNY', 1, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      orderId,
      user.id,
      durationDays,
      maxIps,
      cnyAmount,
      `${env.APP_URL || ''}/api/subscription/usdt/webhook`,
      `${env.APP_URL || ''}/account?payment=success`
    ).run();

    // 6. 调 epusdt-workers 创建交易
    const notifyUrl = `${env.APP_URL}/api/subscription/usdt/webhook`;
    const redirectUrl = `${env.APP_URL}/account?payment=success`;
    const payload = {
      order_id: orderId,
      amount: cnyAmount.toFixed(2),
      notify_url: notifyUrl,
      redirect_url: redirectUrl,
      currency: 'CNY',
    };
    payload.signature = generateSignature(payload, env.USD_API_AUTH_TOKEN);

    let epusdtResp;
    try {
      epusdtResp = await fetch(`${env.USD_WORKER_URL.replace(/\/$/, '')}/api/v1/order/create-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // 网络失败：标记本地订单失败（删除）
      await env.DB.prepare('DELETE FROM usdt_orders WHERE order_id = ?').bind(orderId).run();
      return jsonResp({ success: false, error: 'USDT 服务不可用，请稍后再试' }, 502);
    }

    const epusdtData = await epusdtResp.json().catch(() => null);
    if (!epusdtResp.ok || !epusdtData || epusdtData.status_code !== 200 || !epusdtData.data) {
      const errMsg = (epusdtData && epusdtData.message) || 'USDT 订单创建失败';
      await env.DB.prepare('DELETE FROM usdt_orders WHERE order_id = ?').bind(orderId).run();
      return jsonResp({ success: false, error: errMsg }, 502);
    }

    const ed = epusdtData.data;

    // 7. 把 epusdt 返回的 trade_id / actual_amount / token 写回本地订单
    await env.DB.prepare(`
      UPDATE usdt_orders SET trade_id = ?, actual_amount = ?, token = ?, updated_at = datetime('now')
      WHERE order_id = ?
    `).bind(ed.trade_id, ed.actual_amount, ed.token, orderId).run();

    // 8. 返回前端
    return jsonResp({
      success: true,
      order_id: orderId,
      trade_id: ed.trade_id,
      amount_cny: cnyAmount,
      amount_usdt: ed.actual_amount,
      token: ed.token,
      expiration_time: ed.expiration_time,
      payment_url: ed.payment_url || null,
    });
  } catch (err) {
    console.error('[UsdtCreateOrder] error:', err);
    return jsonResp({ success: false, error: err.message || 'Server error' }, 500);
  }
}

// ============ Handler：查询订单状态 ============

export async function handleUsdtCheckStatus(request, env, ctx) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jsonResp({ success: false, error: 'Unauthorized' }, 401);
    }
    const user = await getUserFromToken(env, authHeader.substring(7));
    if (!user) return jsonResp({ success: false, error: 'Invalid token' }, 401);

    const url = new URL(request.url);
    const orderId = url.searchParams.get('order_id');
    const tradeId = url.searchParams.get('trade_id');

    const localOrder = orderId
      ? await env.DB.prepare('SELECT * FROM usdt_orders WHERE order_id = ? AND user_id = ?').bind(orderId, user.id).first()
      : await env.DB.prepare('SELECT * FROM usdt_orders WHERE trade_id = ? AND user_id = ?').bind(tradeId, user.id).first();

    if (!localOrder) return jsonResp({ success: false, error: '订单不存在' }, 404);

    // 已被 webhook 标记为已支付：直接返回成功
    if (localOrder.status === 2) {
      return jsonResp({ success: true, status: 2, paid: true });
    }

    // 否则去 epusdt-workers 查
    if (!localOrder.trade_id || !env.USD_WORKER_URL) {
      return jsonResp({ success: true, status: localOrder.status, paid: false });
    }

    try {
      const r = await fetch(`${env.USD_WORKER_URL.replace(/\/$/, '')}/pay/check-status/${localOrder.trade_id}`);
      const d = await r.json().catch(() => null);
      if (d && d.data && d.data.status === 2) {
        return jsonResp({ success: true, status: 2, paid: true });
      }
    } catch (e) {
      // 网络失败不影响本地状态
    }

    return jsonResp({ success: true, status: localOrder.status, paid: false });
  } catch (err) {
    console.error('[UsdtCheckStatus] error:', err);
    return jsonResp({ success: false, error: 'Server error' }, 500);
  }
}

// ============ Handler：webhook 回调 ============

export async function handleUsdtWebhook(request, env, ctx) {
  try {
    const payload = await request.json().catch(() => null);
    if (!payload) return textResp('invalid body', 400);

    if (!env.USD_API_AUTH_TOKEN) {
      return textResp('USDT not configured', 500);
    }

    // 1. 验签（与 epusdt-workers 同算法）
    const sig = payload.signature;
    if (!sig || !verifySignature(payload, env.USD_API_AUTH_TOKEN, sig)) {
      console.error('[UsdtWebhook] signature mismatch');
      return textResp('signature error', 401);
    }

    // 2. 必须 status === 2（已支付）
    if (Number(payload.status) !== 2) {
      return textResp('ok'); // 非支付成功事件也直接 ack，避免重试
    }

    const orderId = payload.order_id;
    const txHash = payload.block_transaction_id || null;

    // 3. 找本地订单
    const localOrder = await env.DB.prepare(
      'SELECT * FROM usdt_orders WHERE order_id = ?'
    ).bind(orderId).first();

    if (!localOrder) {
      console.error('[UsdtWebhook] unknown order_id:', orderId);
      return textResp('ok'); // 未知订单也 ack，避免无限重试
    }

    // 幂等：已处理过的不再叠加
    if (localOrder.status === 2) {
      return textResp('success');
    }

    // 4. 调用 generateActivationCode 叠加订阅
    const { generateActivationCode } = await import('./subscription-api.js');

    const baseUrl = env.APP_URL || '';
    const result = await generateActivationCode(
      env,
      localOrder.duration_days,
      localOrder.max_ips,
      localOrder.user_id,
      null,                  // topic_id 续费场景下保留旧的，前端没传
      false,                 // isTestMode
      baseUrl,
      null                   // subMode 同上
    );

    if (!result.success) {
      console.error('[UsdtWebhook] generateActivationCode failed:', result.error);
      return textResp('internal error', 500); // 返回非 ok 让 epusdt 重试
    }

    // 5. 写 user_orders
    const codeFromResult = result.code;
    await env.DB.prepare(`
      INSERT INTO user_orders (user_id, order_id, code, duration_days, amount, status)
      VALUES (?, ?, ?, ?, ?, 'completed')
    `).bind(localOrder.user_id, localOrder.order_id, codeFromResult, localOrder.duration_days, localOrder.amount).run();

    // 6. 更新 usdt_orders 标记成功
    await env.DB.prepare(`
      UPDATE usdt_orders SET status = 2, block_transaction_id = ?, updated_at = datetime('now')
      WHERE order_id = ?
    `).bind(txHash, orderId).run();

    return textResp('success');
  } catch (err) {
    console.error('[UsdtWebhook] error:', err);
    return textResp('internal error', 500);
  }
}

// ============ Utility ============

function jsonResp(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function textResp(text, status = 200) {
  return new Response(text, { status, headers: { 'Content-Type': 'text/plain' } });
}

async function getUserFromToken(env, token) {
  const row = await env.DB.prepare(`
    SELECT u.id, u.email
    FROM users u
    INNER JOIN user_sessions s ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).bind(token).first();
  return row || null;
}