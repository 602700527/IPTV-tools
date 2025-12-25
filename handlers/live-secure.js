// 播放请求处理器（加强版）：/live/{code}/{token}/{hash}
import { getDB } from '../database.js';

// 安全配置
const SECURITY_CONFIG = {
  // 令牌有效期（秒）
  TOKEN_TTL: 600, // 10分钟
  
  // 每个令牌使用次数限制
  TOKEN_MAX_USES: 1,
  
  // 每个卡密每日播放次数限制
  DAILY_PLAY_LIMIT: 500,
  
  // 同一IP同一频道访问频率限制（秒）
  PLAY_FREQUENCY_LIMIT: 60, // 60秒内只能访问一次同一频道
  
  // 异常IP阈值：超过这个数量的不同IP访问则标记为异常
  SUSPICIOUS_IP_THRESHOLD: 10,
  
  // 5分钟内访问超过此数量认为是滥用
  ABUSE_THRESHOLD: 100
};

// 生成随机令牌
function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// 检查令牌有效性
async function validateToken(env, code, token, channelHash) {
  const tokenKey = `token:${code}:${token}`;
  const tokenData = await env.KV.get(tokenKey, { type: "json" });
  
  if (!tokenData) {
    return { valid: false, reason: 'token_not_found' };
  }
  
  const now = Date.now();
  
  // 检查令牌是否过期
  if (now > tokenData.expiresAt) {
    await env.KV.delete(tokenKey);
    return { valid: false, reason: 'token_expired' };
  }
  
  // 检查令牌是否已使用
  if (tokenData.used >= SECURITY_CONFIG.TOKEN_MAX_USES) {
    await env.KV.delete(tokenKey);
    return { valid: false, reason: 'token_already_used' };
  }
  
  // 检查令牌是否属于该频道（令牌和频道hash绑定）
  if (tokenData.channelHash !== channelHash) {
    return { valid: false, reason: 'token_channel_mismatch' };
  }
  
  return { valid: true, data: tokenData };
}

// 记录播放访问（用于异常检测）
async function recordPlayAccess(env, code, channelHash, clientIP) {
  const today = new Date().toISOString().split('T')[0];
  const accessKey = `access:${code}:${today}`;
  
  const accessData = await env.KV.get(accessKey, { type: "json" }) || {
    totalPlays: 0,
    channels: {},
    ips: new Set(),
    lastAccess: 0
  };
  
  // 如果是JSON解析结果，转换ips为Set
  if (accessData.ips && !accessData.ips.add) {
    accessData.ips = new Set(accessData.ips);
  }
  
  // 记录播放
  accessData.totalPlays = (accessData.totalPlays || 0) + 1;
  accessData.lastAccess = Date.now();
  
  // 记录频道播放次数
  const channelKey = channelHash;
  accessData.channels[channelKey] = (accessData.channels[channelKey] || 0) + 1;
  
  // 记录IP
  accessData.ips.add(clientIP);
  
  // 保存回KV（24小时过期）
  await env.KV.put(accessKey, JSON.stringify({
    totalPlays: accessData.totalPlays,
    channels: accessData.channels,
    ips: Array.from(accessData.ips),
    lastAccess: accessData.lastAccess
  }), { expirationTtl: 86400 });
  
  return accessData;
}

// 检查播放频率
async function checkPlayFrequency(env, code, channelHash, clientIP) {
  const now = Date.now();
  const freqKey = `freq:${code}:${clientIP}:${channelHash}`;
  
  const lastPlay = await env.KV.get(freqKey);
  
  if (lastPlay) {
    const lastPlayTime = parseInt(lastPlay);
    const timeDiff = (now - lastPlayTime) / 1000; // 转换为秒
    
    if (timeDiff < SECURITY_CONFIG.PLAY_FREQUENCY_LIMIT) {
      return { 
        allowed: false, 
        reason: 'frequency_limit',
        remainingTime: SECURITY_CONFIG.PLAY_FREQUENCY_LIMIT - timeDiff
      };
    }
  }
  
  // 更新最后播放时间
  await env.KV.put(freqKey, now.toString(), { expirationTtl: 60 });
  
  return { allowed: true };
}

// 检查每日播放限制
async function checkDailyPlayLimit(env, code) {
  const today = new Date().toISOString().split('T')[0];
  const limitKey = `limit:play:${today}:${code}`;
  
  const currentCount = parseInt(await env.KV.get(limitKey) || '0');
  
  if (currentCount >= SECURITY_CONFIG.DAILY_PLAY_LIMIT) {
    return { allowed: false, currentCount, limit: SECURITY_CONFIG.DAILY_PLAY_LIMIT };
  }
  
  // 增加计数
  await env.KV.put(limitKey, (currentCount + 1).toString(), { expirationTtl: 86400 });
  
  return { allowed: true, currentCount: currentCount + 1, limit: SECURITY_CONFIG.DAILY_PLAY_LIMIT };
}

// 检测异常访问模式
async function detectAbuse(env, code, accessData) {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // 检查5分钟内的访问量
  if (accessData.lastAccess && (now - accessData.lastAccess) < 300000) {
    const accesses = await env.KV.get(`abuse:${code}`, { type: "json" }) || { count: 0, startTime: now };
    
    if (accesses.count > SECURITY_CONFIG.ABUSE_THRESHOLD) {
      // 检测到滥用，记录到日志
      console.warn(`Abuse detected for code ${code}: ${accesses.count} accesses in 5 minutes`);
      
      // 标记卡密为可疑状态
      await env.KV.put(`abuse_flag:${code}`, JSON.stringify({
        detectedAt: now,
        accessCount: accesses.count,
        ipCount: accessData.ips ? accessData.ips.length : 0
      }), { expirationTtl: 86400 });
      
      return { suspicious: true, reason: 'high_access_rate' };
    }
  }
  
  // 检查IP数量是否异常
  const ipCount = accessData.ips ? accessData.ips.length : 0;
  if (ipCount > SECURITY_CONFIG.SUSPICIOUS_IP_THRESHOLD) {
    console.warn(`Suspicious activity for code ${code}: ${ipCount} different IPs in one day`);
    
    await env.KV.put(`suspicious:${code}`, JSON.stringify({
      detectedAt: now,
      ipCount: ipCount,
      totalPlays: accessData.totalPlays
    }), { expirationTtl: 86400 });
    
    return { suspicious: true, reason: 'too_many_ips' };
  }
  
  return { suspicious: false };
}

export async function handleLiveRequest(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');

    // 验证URL格式：/live/{code}/{token}/{hash}
    if (pathParts.length < 5) {
      return new Response('Invalid request format. Expected: /live/{code}/{token}/{hash}', { status: 400 });
    }

    const code = pathParts[2]; // 卡密
    const token = pathParts[3]; // 令牌
    const hash = pathParts[4]; // 频道hash

    // 1. 检查缓存 (Cache API) - 缩短缓存时间到2分钟
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    let response = await cache.match(cacheKey);

    if (response) {
      // 缓存命中，直接返回
      return response;
    }

    // 2. 检查令牌
    const tokenValidation = await validateToken(env, code, token, hash);
    if (!tokenValidation.valid) {
      response = new Response(`Forbidden: ${tokenValidation.reason}`, { 
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
      response.headers.set("Cache-Control", "public, max-age=60");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 3. 缓存未命中，执行鉴权和获取真实链接

    // 3.1 校验卡密
    const db = getDB();
    const auth = await db.prepare("SELECT status, expired_at, max_ips FROM codes WHERE code = ?").bind(code).first();

    const now = new Date().toISOString();
    if (!auth || auth.status !== 'active' || auth.expired_at < now) {
      // 卡密无效或已过期
      response = new Response("Forbidden: Invalid or Expired Code", { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=60");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 3.2 IP 并发检测 (KV)
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
        response.headers.set("Cache-Control", "public, max-age=60");
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

    // 4. 检查播放频率限制
    const frequencyCheck = await checkPlayFrequency(env, code, hash, clientIP);
    if (!frequencyCheck.allowed) {
      response = new Response(`Forbidden: Please wait ${Math.ceil(frequencyCheck.remainingTime)} seconds before accessing this channel again`, { 
        status: 429,
        headers: { 'Content-Type': 'text/plain' }
      });
      response.headers.set("Cache-Control", "public, max-age=60");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 5. 检查每日播放限制
    const dailyLimitCheck = await checkDailyPlayLimit(env, code);
    if (!dailyLimitCheck.allowed) {
      response = new Response(`Forbidden: Daily play limit exceeded (${dailyLimitCheck.currentCount}/${dailyLimitCheck.limit})`, { 
        status: 429,
        headers: { 'Content-Type': 'text/plain' }
      });
      response.headers.set("Cache-Control", "public, max-age=60");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 6. 记录播放访问并检测异常
    const accessData = await recordPlayAccess(env, code, hash, clientIP);
    
    // 异步检测滥用（不阻塞响应）
    ctx.waitUntil(detectAbuse(env, code, accessData));

    // 7. 获取频道真实链接
    const channel = await db.prepare("SELECT play_url, headers FROM channels WHERE channel_hash = ? AND is_active = 1").bind(hash).first();

    if (!channel) {
      response = new Response("Channel Not Found", { status: 404 });
      response.headers.set("Cache-Control", "public, max-age=60");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 8. 标记令牌为已使用（一次性令牌）
    const tokenKey = `token:${code}:${token}`;
    const tokenData = await env.KV.get(tokenKey, { type: "json" });
    if (tokenData) {
      tokenData.used = (tokenData.used || 0) + 1;
      await env.KV.put(tokenKey, JSON.stringify(tokenData), { expirationTtl: SECURITY_CONFIG.TOKEN_TTL });
    }

    // 9. 重定向到真实播放地址
    const headers = new Headers({
      "Location": channel.play_url,
      "Cache-Control": "public, max-age=120, s-maxage=120" // 缩短缓存到2分钟
    });

    response = new Response(null, { status: 302, headers });

    // 10. 写入缓存
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (error) {
    console.error('Live request error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
