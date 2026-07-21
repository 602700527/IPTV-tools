// 播放请求处理器: /live/{prefix}/{token}/{hash}（新格式）
import { getDB, getBoundAdByAction, getDomainBlacklist } from '../database.js';
import { getClientIP, checkIPRateLimit } from '../security/ip-blacklist.js';
import { checkPlayCount, incrementPlayCount, validateToken, getPlayAddress } from '../utils/token-manager.js';
import { getChannelByHash } from '../utils/channel-cache.js';

export async function handleLiveRequest(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');

    // 只支持新格式: /live/{prefix}/{token}/{hash}
    if (pathParts.length !== 5) {
      return new Response('Invalid request format', { status: 400 });
    }

    // 0. IP黑名单检查
    const clientIP = getClientIP(request);
    const ipCheck = await checkIPRateLimit(env, ctx, clientIP, '/live');
    if (!ipCheck.allowed) {
      return new Response(ipCheck.message, { status: 403 });
    }

    return await handleNewLiveRequest(request, env, ctx, pathParts, `${url.protocol}//${url.host}`);
  } catch (error) {
    console.error('Live request error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * 处理新格式: /live/{prefix}/{token}/{hash}
 * prefix: vip（无广告）、free（有广告）
 */
async function handleNewLiveRequest(request, env, ctx, pathParts, fullBaseUrl) {
  const prefix = pathParts[2];  // vip | free
  const token = pathParts[3];
  const hash = pathParts[4];

  const url = new URL(request.url);
  const clientIP = getClientIP(request);
  const today = new Date().toISOString().split('T')[0];

  // 1. 检查缓存
  const hasRangeHeader = request.headers.has('Range');
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  let response = await cache.match(cacheKey);

  if (response && !hasRangeHeader) {
    if (response.status === 403 || response.status === 302) {
      response = null; // 重新验证
    } else {
      return response;
    }
  }

  // 2. 验证 token
  console.log('[Live] Validating token:', token, 'hash:', hash);
  const tokenMeta = await validateToken(token, env);
  console.log('[Live] Token validation result:', tokenMeta ? 'valid' : 'invalid');

  if (!tokenMeta) {
    // Token 无效或过期 → vip_expired / free_expired
    const adAction = `${prefix}_expired`;
    const adBinding = await getBoundAdByAction(adAction, clientIP);
    if (adBinding) {
      return redirectToAd(adBinding, fullBaseUrl, cacheKey, cache, ctx);
    }
    response = new Response('Token invalid or expired', { status: 403 });
    response.headers.set('Cache-Control', 'public, max-age=300');
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  // 3. 获取频道信息
  let playUrl = await getPlayAddress(token, hash, env);
  console.log('[Live] getPlayAddress result:', playUrl ? 'found' : 'not found', 'token:', token, 'hash:', hash);
  let channel = null;

  if (!playUrl) {
    // KV 中没有，从 channels_cache 获取
    channel = await getChannelByHash(env, hash);
    if (!channel || !channel.is_active) {
      // 频道不存在 → channel_not_found
      const adBinding = await getBoundAdByAction('channel_not_found', clientIP);
      if (adBinding) {
        return redirectToAd(adBinding, fullBaseUrl, cacheKey, cache, ctx);
      }
      response = new Response('Channel not found', { status: 404 });
      response.headers.set('Cache-Control', 'public, max-age=300');
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }
    playUrl = channel.play_url;
  }

  // 4. 检查域名是否在黑名单中
  let isBlacklisted = false;
  if (playUrl) {
    try {
      const hostname = new URL(playUrl).hostname;
      const blacklistData = await env.KV.get('domain_blacklist', { type: 'json' });
      if (blacklistData && Array.isArray(blacklistData.domains)) {
        isBlacklisted = blacklistData.domains.some(d =>
          hostname === d || hostname.endsWith('.' + d)
        );
      }
    } catch (e) {
      // URL 解析失败
    }
  }

  // 5. 黑名单域名透传，不计入播放次数
  if (isBlacklisted) {
    console.log(`[Live] Domain blacklisted, passing through: ${hash}`);
    response = new Response(null, { status: 302, headers: { 'Location': playUrl } });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  // 6. 播放次数限制（每 IP 每频道每天 50 次）
  if (!checkPlayCount(clientIP, hash, today)) {
    // 超限 → vip_limit_exceeded / free_limit_exceeded
    const adAction = `${prefix}_limit_exceeded`;
    const adBinding = await getBoundAdByAction(adAction, clientIP);
    if (adBinding) {
      return redirectToAd(adBinding, fullBaseUrl, cacheKey, cache, ctx);
    }
    response = new Response('Daily play limit exceeded', { status: 403 });
    response.headers.set('Cache-Control', 'public, max-age=300');
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  // 7. 增加播放计数
  incrementPlayCount(clientIP, hash, today);

  // 8. VIP 用户无广告，直接重定向
  if (prefix === 'vip') {
    response = new Response(null, { status: 302, headers: { 'Location': playUrl } });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  // 9. 非 VIP 用户，触发正常播放广告
  const adAction = `${prefix}_normal`;
  const adBinding = await getBoundAdByAction(adAction, clientIP);
  if (adBinding) {
    return redirectToAd(adBinding, fullBaseUrl, cacheKey, cache, ctx);
  }

  // 没有绑定广告，直接播放
  response = new Response(null, { status: 302, headers: { 'Location': playUrl } });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

/**
 * 重定向到广告 TS 文件
 */
function redirectToAd(adBinding, fullBaseUrl, cacheKey, cache, ctx) {
  const adTsUrl = `${fullBaseUrl}/api/ads/${adBinding.id}.ts`;
  console.log('[Live] Redirecting to ad TS file:', adTsUrl);
  const headers = new Headers({
    'Location': adTsUrl,
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  });
  const response = new Response(null, { status: 302, headers });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

