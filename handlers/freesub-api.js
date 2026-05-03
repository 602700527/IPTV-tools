// 免费订阅API处理器
import { createFreeSubscription, getClientIP, validateFreeSubscriptionWithFingerprint } from './freesub.js';
import { performCheckIn, getCheckInHistory, getCheckInStats } from './checkin.js';
import { getDB, getActiveChannels, verifyFreeSubPlayToken, getDomainBlacklist } from '../database.js';
import { getAllChannels } from '../utils/channel-cache.js';
import { getCurrentToken } from '../utils/token-manager.js';

/**
 * 处理免费订阅API请求
 */
export async function handleFreeSubAPI(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  try {
    // 获取客户端IP
    const ip = getClientIP(request);

    // 获取订阅信息（返回M3U）
    if (path.startsWith('/api/freesub/') && path.endsWith('.m3u')) {
      const subId = path.split('/').pop().replace('.m3u', '');
      return await handleFreeSubM3U(subId, request, env);
    }

    // API路由
    if (path === '/api/freesub/create') {
      if (method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      const body = await request.json();
      const fingerprint = body.fingerprint;

      if (!fingerprint) {
        return jsonResponse({ error: 'Fingerprint is required' }, 400);
      }

      try {
        const sub = await createFreeSubscription(ip, fingerprint, body.fingerprintComponents, env);
        return jsonResponse({ success: true, subscription: sub });
      } catch (error) {
        if (error.message === 'FREE_SUBSCRIPTION_LIMIT_REACHED') {
          return jsonResponse({
            success: false,
            error: 'Free subscriptions are sold out. Please try again later~'
          }, 403);
        }
        throw error;
      }
    }

    if (path === '/api/freesub/checkin') {
      if (method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      const body = await request.json();
      const { subId, fingerprint, captcha } = body;

      if (!subId || !fingerprint) {
        return jsonResponse({ error: 'subId and fingerprint are required' }, 400);
      }

      if (!captcha || captcha.length < 3) {
        return jsonResponse({ success: false, reason: 'invalid_captcha', error: '验证码无效' }, 400);
      }

      // 验证订阅
      const db = getDB();
      const validation = await validateFreeSubscriptionWithFingerprint(subId, request, fingerprint, db);

      if (!validation.valid) {
        return jsonResponse({ error: validation.reason }, 403);
      }

      // 执行签到
      const result = await performCheckIn(validation.subscription.id, ip);
      return jsonResponse(result);
    }

    if (path === '/api/freesub/info') {
      if (method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      const body = await request.json();
      const { subId, fingerprint } = body;

      if (!subId || !fingerprint) {
        return jsonResponse({ error: 'subId and fingerprint are required' }, 400);
      }

      // 验证订阅
      const db = getDB();
      const validation = await validateFreeSubscriptionWithFingerprint(subId, request, fingerprint, db);

      if (!validation.valid) {
        return jsonResponse({ error: validation.reason }, 403);
      }

      // 获取签到统计
      const stats = await getCheckInStats(validation.subscription.id);
      const history = await getCheckInHistory(validation.subscription.id, 30);

      console.log('[FreeSub Info] Returning subscription info:', {
        consecutiveDays: validation.subscription.consecutiveDays,
        statsMaxConsecutive: stats.maxConsecutive
      });

      return jsonResponse({
        success: true,
        subscription: validation.subscription,
        stats,
        recentCheckIns: history
      });
    }

    if (path === '/api/freesub/history') {
      if (method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      const body = await request.json();
      const { subId, fingerprint, limit } = body;

      if (!subId || !fingerprint) {
        return jsonResponse({ error: 'subId and fingerprint are required' }, 400);
      }

      // 验证订阅
      const db = getDB();
      const validation = await validateFreeSubscriptionWithFingerprint(subId, request, fingerprint, db);

      if (!validation.valid) {
        return jsonResponse({ error: validation.reason }, 403);
      }

      const history = await getCheckInHistory(validation.subscription.id, limit || 30);
      return jsonResponse({ success: true, history });
    }

    return jsonResponse({ error: 'Not found' }, 404);

  } catch (error) {
    console.error('[FreeSub API] Error:', error);
    console.error('[FreeSub API] Error stack:', error.stack);
    console.error('[FreeSub API] Error details:', {
      message: error.message,
      name: error.name,
      path: url.pathname,
      method: request.method
    });
    return jsonResponse({ error: 'Internal server error', details: error.message }, 500);
  }
}

/**
 * 处理免费订阅M3U请求
 */
async function handleFreeSubM3U(subId, request, env) {
  const ip = getClientIP(request);

  // 获取指纹（从URL参数或Header）
  const url = new URL(request.url);
  const fingerprint = url.searchParams.get('fp') || request.headers.get('X-Fingerprint');

  if (!fingerprint) {
    return new Response('Fingerprint required', { status: 403 });
  }

  // 验证订阅
  const db = getDB();
  const validation = await validateFreeSubscriptionWithFingerprint(subId, request, fingerprint, db);

  if (!validation.valid) {
    return new Response(`Error: ${validation.reason}`, { status: 403 });
  }

  // 更新订阅IP为最新访问IP（新IP顶掉旧IP）
  await db.prepare(`
    UPDATE free_subscriptions
    SET ip = ?, updated_at = datetime('now')
    WHERE sub_id = ?
  `).bind(ip, subId).run();

  console.log('[FreeSub M3U] Updated subscription IP', {
    subId,
    newIp: ip,
    oldIp: validation.subscription.ip
  });

  // 获取活跃频道（从KV缓存中随机提取10%）
  const channels = await getRandomActiveChannelsFromKV(env);

  if (!channels || channels.length === 0) {
    return new Response('#EXTM3U\n# No channels available', {
      headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
    });
  }

  // 加载域名黑名单（缓存到内存中）
  let domainBlacklist = [];
  try {
    const blacklistResult = await getDomainBlacklist();
    if (blacklistResult && blacklistResult.length > 0) {
      domainBlacklist = blacklistResult.map(item => item.domain);
      console.log(`[FreeSub M3U] Loaded ${domainBlacklist.length} domains to blacklist`);
    }
  } catch (e) {
    console.error('[FreeSub M3U] Failed to load domain blacklist:', e);
  }

  // 生成M3U内容（使用token-based URL格式 /live/free/{token}/{hash}）
  const token = await getCurrentToken(env);
  if (!token) {
    return new Response('#EXTM3U\n#EXTINF:-1 ,当前正在维护，请稍后再试\nhttp://example.com/stream.m3u8', {
      headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
    });
  }

  const host = url.protocol + '//' + url.host;
  const m3uLines = ['#EXTM3U'];

  for (const channel of channels) {
    const infoParts = ['#EXTINF:-1'];
    if (channel.group_title) infoParts.push(`group-title="${channel.group_title}"`);
    if (channel.logo) infoParts.push(`tvg-logo="${channel.logo}"`);

    // 添加请求头信息
    if (channel.headers && channel.headers !== '{}') {
      try {
        const headers = JSON.parse(channel.headers);
        if (headers['User-Agent']) {
          const ua = headers['User-Agent'].replace(/"/g, '\\"');
          infoParts.push(`http-user-agent="${ua}"`);
        }
        if (headers['Referer']) {
          const referer = headers['Referer'].replace(/"/g, '\\"');
          infoParts.push(`http-header="Referer: ${referer}"`);
          infoParts.push(`referer="${referer}"`);
        }
      } catch (e) {
        // headers 解析失败，忽略
      }
    }

    infoParts.push(',' + channel.channel_name);
    m3uLines.push(infoParts.join(' '));

    // 检查频道URL是否在域名黑名单中
    let playUrl = `${host}/live/free/${token}/${channel.channel_hash}`;
    if (channel.play_url) {
      try {
        const urlObj = new URL(channel.play_url);
        const hostname = urlObj.hostname;
        let isBlacklisted = domainBlacklist.includes(hostname);
        if (!isBlacklisted) {
          for (const blacklistDomain of domainBlacklist) {
            if (blacklistDomain.startsWith('*.') && hostname.endsWith(blacklistDomain.substring(2))) {
              isBlacklisted = true;
              break;
            }
          }
        }
        if (isBlacklisted) {
          playUrl = channel.play_url;
        }
      } catch (e) {
        console.error('[FreeSub M3U] Error parsing channel URL:', e);
      }
    }

    m3uLines.push(playUrl);
  }

  const m3uContent = m3uLines.join('\n');

  return new Response(m3uContent, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'public, max-age=300' // 允许缓存5分钟
    }
  });
}

/**
 * 获取随机10%的活跃频道（从KV缓存）
 */
async function getRandomActiveChannelsFromKV(env) {
  // 从KV缓存获取所有频道
  const { channels } = await getAllChannels(env);

  if (!channels || channels.length === 0) {
    console.log('[FreeSub] No channels available from KV');
    return [];
  }

  // 过滤出活跃频道
  const activeChannels = channels.filter(c => c.is_active === 1 && c.source_active === 1);

  console.log(`[FreeSub] Got ${activeChannels.length} active channels from KV`);

  // 计算需要返回的频道数量（10%）
  const targetCount = Math.max(1, Math.floor(activeChannels.length * 0.1));

  // 按日期生成随机种子（同一天返回相同结果）
  const today = new Date().toISOString().split('T')[0];
  let seed = 0;
  for (let i = 0; i < today.length; i++) {
    seed += today.charCodeAt(i);
  }

  // 使用种子随机选择频道
  const selectedChannels = selectRandomChannels(activeChannels, targetCount, seed);

  console.log(`[FreeSub] Selected ${selectedChannels.length} channels (10%)`);
  return selectedChannels;
}

/**
 * 使用种子随机选择频道
 */
function selectRandomChannels(channels, targetCount, seed) {
  // 简单的伪随机数生成器
  const random = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const selected = new Set();
  const result = [];

  for (let i = 0; i < channels.length && selected.size < targetCount; i++) {
    const index = Math.floor(random(seed + i) * channels.length);

    if (!selected.has(index)) {
      selected.add(index);
      result.push(channels[index]);
    }
  }

  return result;
}

/**
 * 返回JSON响应
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
