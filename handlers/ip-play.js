// IP直连播放链接处理器
// 无需卡密，IP绑定限制最多3个IP使用
import { getClientIP, checkIPRateLimit } from '../security/ip-blacklist.js';
import { createIPPlayLink, verifyAndUseIPPlayLink, getIPPlayLink, getBoundAdByAction } from '../database.js';
import { getChannelByHash } from '../utils/channel-cache.js';

/**
 * 获取当前IP的播放链接
 * GET /api/play/link?hash={channel_hash}
 */
export async function handleGetPlayLink(request, env, ctx) {
  const url = new URL(request.url);
  const channelHash = url.searchParams.get('hash');

  if (!channelHash) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Missing channel hash'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 获取客户端IP
  const clientIP = getClientIP(request);

  // IP频率限制检查
  const rateLimit = await checkIPRateLimit(env, ctx, clientIP, '/api/play/link');
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      success: false,
      error: rateLimit.message || 'Rate limit exceeded'
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 验证频道是否存在
  const channel = await getChannelByHash(env, channelHash);
  if (!channel) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Channel not found'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 创建播放链接
  const result = await createIPPlayLink(clientIP, channelHash);

  if (!result.success) {
    return new Response(JSON.stringify({
      success: false,
      error: result.error || 'Failed to create link'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 返回完整播放链接
  const fullPlayUrl = `${url.origin}${result.play_url}`;

  return new Response(JSON.stringify({
    success: true,
    play_link: fullPlayUrl,
    link_id: result.link_id
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * 使用IP直连播放链接播放
 * GET /play/{link_id}/{channel_hash}
 */
export async function handleIPPlayRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);

  // pathParts[0] = 'play', pathParts[1] = link_id, pathParts[2] = channel_hash
  if (pathParts.length < 3 || pathParts[0] !== 'play') {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid play link format'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const linkId = pathParts[1];
  const channelHash = pathParts[2];

  // 获取客户端IP
  const clientIP = getClientIP(request);

  // IP频率限制检查
  const rateLimit = await checkIPRateLimit(env, ctx, clientIP, '/play');
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      success: false,
      error: rateLimit.message || 'Rate limit exceeded'
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 验证并使用播放链接
  const result = await verifyAndUseIPPlayLink(linkId, channelHash, clientIP);

  if (!result.success) {
    // 特殊处理：已达最大IP数 - 检查广告绑定 copy_link_ip_limit
    if (result.error.includes('Maximum IP limit')) {
      const adBinding = await getBoundAdByAction('copy_link_ip_limit', clientIP);
      if (adBinding) {
        const adTsUrl = `${url.origin}/api/ads/${adBinding.id}.ts`;
        console.log(`[IPPlay] IP limit reached, serving ad for copy_link_ip_limit, redirecting to: ${adTsUrl}`);
        return new Response(null, {
          status: 302,
          headers: {
            'Location': adTsUrl,
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        });
      }
      // 如果没有配置广告，返回原来的错误响应
      return new Response(JSON.stringify({
        success: false,
        error: 'This link has reached its maximum usage limit (3 IPs).',
        used_count: result.used_count
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 链接不存在
    if (result.error === 'Link not found') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Play link not found or expired'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 频道不存在
    if (result.error === 'Channel not found or inactive') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Channel not found or no longer available'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: result.error
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 获取频道信息（用于headers）
  const channel = await getChannelByHash(env, channelHash);

  // 检查广告绑定 - copy_link_normal
  const adBinding = await getBoundAdByAction('copy_link_normal', clientIP);
  if (adBinding) {
    const adTsUrl = `${url.origin}/api/ads/${adBinding.id}.ts`;
    console.log(`[IPPlay] Serving ad for copy_link_normal, redirecting to: ${adTsUrl}`);
    return new Response(null, {
      status: 302,
      headers: {
        'Location': adTsUrl,
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }

  // 302重定向到真实播放地址
  const headers = new Headers({
    'Location': result.play_url,
    'Cache-Control': 'public, max-age=300, s-maxage=300'
  });

  // 如果频道有自定义headers，添加到响应中
  if (channel && channel.headers) {
    try {
      const channelHeaders = JSON.parse(channel.headers);
      if (channelHeaders['User-Agent']) {
        headers.set('User-Agent', channelHeaders['User-Agent']);
      }
      if (channelHeaders['Referer']) {
        headers.set('Referer', channelHeaders['Referer']);
      }
    } catch (e) {
      // 忽略headers解析错误
    }
  }

  console.log(`[IPPlay] Redirecting to: ${result.play_url}, used_ips: ${result.used_count}/3`);

  return new Response(null, { status: 302, headers });
}

/**
 * 获取播放链接使用情况（可选，用于前端显示）
 * GET /api/play/link/status?link_id={link_id}
 */
export async function handleGetPlayLinkStatus(request, env, ctx) {
  const url = new URL(request.url);
  const linkId = url.searchParams.get('link_id');

  if (!linkId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Missing link_id'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const link = await getIPPlayLink(linkId);

  if (!link) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Link not found'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let usedIps = [];
  try {
    usedIps = JSON.parse(link.used_ips || '[]');
  } catch (e) {
    usedIps = [];
  }

  return new Response(JSON.stringify({
    success: true,
    used_count: link.used_count,
    max_ips: 3,
    remaining: Math.max(0, 3 - link.used_count),
    created_at: link.created_at,
    last_used_at: link.last_used_at
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
