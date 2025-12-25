// 播放请求处理器: /live/{code}/{hash}（简化安全版）
import { getDB, getSecurityConfig } from '../database.js';

export async function handleLiveRequest(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');

    // 验证URL格式
    if (pathParts.length < 4) {
      return new Response('Invalid request format', { status: 400 });
    }

    const code = pathParts[2]; // 卡密
    const hash = pathParts[3]; // 频道hash

    // 1. 检查缓存 (Cache API)
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    let response = await cache.match(cacheKey);

    if (response) {
      // 缓存命中，直接返回
      return response;
    }

    // 2. 缓存未命中，执行鉴权和获取真实链接

    // 2.1 校验卡密
    const db = getDB();
    const auth = await db.prepare("SELECT status, expired_at, max_ips, banned_until FROM codes WHERE code = ?").bind(code).first();

    const now = new Date().toISOString();
    if (!auth || auth.status !== 'active' || auth.expired_at < now) {
      // 卡密无效或已过期
      response = new Response("Forbidden: Invalid or Expired Code", { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 检查是否被封禁（临时封禁）
    if (auth.banned_until && auth.banned_until > now) {
      response = new Response(`Forbidden: Code is banned until ${new Date(auth.banned_until).toLocaleString('zh-CN')}`, { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=60");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 获取安全配置
    const securityConfig = await getSecurityConfig();

    // 2.2 检查每日播放额度（每个频道）
    const today = new Date().toISOString().split('T')[0];
    const channelLimitKey = `channel_limit:${today}:${code}:${hash}`;

    // 获取今日该频道播放次数
    const todayPlays = parseInt(await env.KV.get(channelLimitKey) || '0');

    if (todayPlays >= securityConfig.channel_daily_limit) {
      // 超过额度，自动封禁卡密
      if (securityConfig.auto_ban_on_exceed) {
        const existingRemark = await db.prepare("SELECT remark FROM codes WHERE code = ?").bind(code).first();

        // 计算封禁到期时间
        const bannedUntil = new Date();
        bannedUntil.setDate(bannedUntil.getDate() + securityConfig.ban_duration_days);

        const banReason = `系统自动封禁：频道每日播放次数超出${securityConfig.channel_daily_limit}次，封禁${securityConfig.ban_duration_days}天 (${today})`;

        const newRemark = existingRemark?.remark
          ? `${existingRemark.remark}\n${banReason}`
          : banReason;

        await db.prepare("UPDATE codes SET status = 'disabled', remark = ?, banned_until = ? WHERE code = ?")
          .bind(newRemark, bannedUntil.toISOString(), code)
          .run();

        // 记录封禁信息到KV
        const quotaKey = `code_quota:${today}:${code}`;
        await env.KV.put(quotaKey, JSON.stringify({
          totalPlays: todayPlays,
          exceededChannels: [hash],
          isBanned: true,
          bannedAt: new Date().toISOString(),
          bannedUntil: bannedUntil.toISOString(),
          banDurationDays: securityConfig.ban_duration_days,
          channelDailyLimit: securityConfig.channel_daily_limit
        }), { expirationTtl: 86400 * securityConfig.ban_duration_days + 86400 });

        console.warn(`Code ${code} auto-banned due to exceeding limit: ${todayPlays} plays for channel ${hash}`);
      }

      response = new Response(`Forbidden: Daily play limit (${securityConfig.channel_daily_limit}) exceeded for this channel`, { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 增加播放计数
    const newPlays = todayPlays + 1;
    await env.KV.put(channelLimitKey, newPlays.toString(), { expirationTtl: 86400 }); // 24小时过期

    // 记录总播放次数
    const quotaKey = `code_quota:${today}:${code}`;
    const quotaData = await env.KV.get(quotaKey, { type: "json" }) || {
      totalPlays: 0,
      exceededChannels: [],
      isBanned: false,
      bannedAt: null
    };

    quotaData.totalPlays = (quotaData.totalPlays || 0) + 1;
    await env.KV.put(quotaKey, JSON.stringify(quotaData), { expirationTtl: 86400 });

    // 2.3 IP 并发检测 (KV)
    const clientIP = request.headers.get("CF-Connecting-IP");
    const ipKey = `ips:${code}`;
    const ipData = await env.KV.get(ipKey, { type: "json" });
    const ipList = ipData || [];

    // 清理过期的IP记录
    const nowTime = Date.now();
    const filteredIps = ipList.filter(ip => ip.time > nowTime - 600000); // 10分钟有效期

    // 检查当前IP是否在列表中
    const currentIPRecord = filteredIps.find(ip => ip.address === clientIP);

    if (!currentIPRecord) {
      // 当前IP不在列表中，检查是否超过最大IP数限制
      if (filteredIps.length >= (auth.max_ips || 3)) {
        response = new Response("Forbidden: Too many devices", { status: 403 });
        response.headers.set("Cache-Control", "public, max-age=300");
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      }

      // 添加当前IP到列表
      filteredIps.push({ address: clientIP, time: nowTime });
    } else {
      // 更新当前IP的时间戳
      currentIPRecord.time = nowTime;
    }

    // 异步更新KV，不阻塞响应
    ctx.waitUntil(env.KV.put(ipKey, JSON.stringify(filteredIps), { expirationTtl: 600 }));

    // 3. 获取频道真实链接
    const channel = await db.prepare("SELECT play_url, headers FROM channels WHERE channel_hash = ? AND is_active = 1").bind(hash).first();

    if (!channel) {
      response = new Response("Channel Not Found", { status: 404 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 4. 重定向到真实播放地址
    const headers = new Headers({
      "Location": channel.play_url,
      "Cache-Control": "public, max-age=300, s-maxage=300"
    });

    response = new Response(null, { status: 302, headers });

    // 5. 写入缓存
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (error) {
    console.error('Live request error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

