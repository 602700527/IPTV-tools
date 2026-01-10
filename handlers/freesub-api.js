// 免费订阅API处理器
import { createFreeSubscription, getClientIP, validateFreeSubscriptionWithFingerprint } from './freesub.js';
import { performCheckIn, getCheckInHistory, getCheckInStats } from './checkin.js';
import { getDB, getActiveChannels, generateM3UContent } from '../database.js';

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

      const sub = await createFreeSubscription(ip, fingerprint, body.fingerprintComponents, env);
      return jsonResponse({ success: true, subscription: sub });
    }

    if (path === '/api/freesub/checkin') {
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
    return jsonResponse({ error: 'Internal server error' }, 500);
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

  // 获取活跃频道（30%随机）
  const channels = await getRandomActiveChannels(env);

  if (!channels || channels.length === 0) {
    return new Response('#EXTM3U\n# No channels available', {
      headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
    });
  }

  // 生成M3U内容
  const m3uContent = generateM3UContent(channels, subId);

  return new Response(m3uContent, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'public, max-age=300' // 缓存5分钟
    }
  });
}

/**
 * 获取随机30%的活跃频道
 */
async function getRandomActiveChannels(env) {
  const db = getDB();

  // 获取所有活跃频道
  const allChannels = await db.prepare(`
    SELECT c.*, s.name as source_name
    FROM channels c
    INNER JOIN sources s ON c.source_id = s.id
    WHERE c.is_active = 1 AND s.is_active = 1
    ORDER BY c.group_title, c.channel_name
  `).all();

  if (!allChannels.results || allChannels.results.length === 0) {
    return [];
  }

  const channels = allChannels.results;

  // 计算需要返回的频道数量（30%）
  const targetCount = Math.max(1, Math.floor(channels.length * 0.3));

  // 按日期生成随机种子（同一天返回相同结果）
  const today = new Date().toISOString().split('T')[0];
  let seed = 0;
  for (let i = 0; i < today.length; i++) {
    seed += today.charCodeAt(i);
  }

  // 使用种子随机选择频道
  const selectedChannels = selectRandomChannels(channels, targetCount, seed);

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
