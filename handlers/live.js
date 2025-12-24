// 播放请求处理器: /live/{code}/{hash}
import { getDB } from '../database.js';

export async function handleLiveRequest(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');

    console.log(`Live request received: ${url.pathname}`);

    // 验证URL格式
    if (pathParts.length < 4) {
      return new Response('Invalid request format', { status: 400 });
    }

    const code = pathParts[2]; // 卡密
    const hash = pathParts[3]; // 频道hash

    console.log(`Code: ${code}, Hash: ${hash}`);

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
  const authStmt = db.prepare("SELECT status, expired_at, max_ips FROM codes WHERE code = ?");
  const auth = await authStmt.bind(code).first();

  const now = new Date().toISOString();
  if (!auth || auth.status !== 'active' || auth.expired_at < now) {
    // 卡密无效或已过期
    response = new Response("Forbidden: Invalid or Expired Code", { status: 403 });
    // 缓存5分钟，减少无效请求对数据库的压力
    response.headers.set("Cache-Control", "public, max-age=300");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  // 2.2 IP 并发检测 (KV)
  const clientIP = request.headers.get("CF-Connecting-IP");
  const ipKey = `ips:${code}`;
  let ipList = await env.KV.get(ipKey, { type: "json" }) || [];

  // 清理过期的IP记录
  const nowTime = Date.now();
  ipList = ipList.filter(ip => ip.time > nowTime - 600000); // 10分钟有效期

  // 检查当前IP是否在列表中
  const currentIPRecord = ipList.find(ip => ip.address === clientIP);

  if (!currentIPRecord) {
    // 当前IP不在列表中，检查是否超过最大IP数限制
    if (ipList.length >= (auth.max_ips || 3)) {
      response = new Response("Forbidden: Too many devices", { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 添加当前IP到列表
    ipList.push({ address: clientIP, time: nowTime });

    // 异步更新KV，不阻塞响应
    ctx.waitUntil(env.KV.put(ipKey, JSON.stringify(ipList), { expirationTtl: 600 }));
  } else {
    // 更新当前IP的时间戳
    currentIPRecord.time = nowTime;
    ctx.waitUntil(env.KV.put(ipKey, JSON.stringify(ipList), { expirationTtl: 600 }));
  }

  // 3. 获取频道真实链接
  console.log(`Looking for channel with hash: ${hash}`);
  const channel = await db.prepare("SELECT play_url, headers FROM channels WHERE channel_hash = ? AND is_active = 1").bind(hash).first();

  if (!channel) {
    console.log(`Channel not found for hash: ${hash}`);
    response = new Response("Channel Not Found", { status: 404 });
    response.headers.set("Cache-Control", "public, max-age=300");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  console.log(`Found channel: ${JSON.stringify(channel)}`);

  // 4. 构建重定向响应
  console.log(`Redirecting to: ${channel.play_url}`);

  // 准备响应头
  const headers = new Headers({
    "Location": channel.play_url,
    "Cache-Control": "public, max-age=300, s-maxage=300"
  });

  // 如果有自定义headers，添加到响应中
  if (channel.headers) {
    try {
      const customHeaders = JSON.parse(channel.headers);
      for (const [key, value] of Object.entries(customHeaders)) {
        headers.set(key, value);
      }
    } catch (e) {
      console.error('Error parsing headers:', e);
    }
  }

  // 创建重定向响应
  response = new Response(null, { status: 302, headers });

  // 5. 写入缓存
  ctx.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
  } catch (error) {
    console.error('Error in handleLiveRequest:', error);
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
