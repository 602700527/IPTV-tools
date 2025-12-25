// 订阅请求处理器: /sub/{code}.m3u
import { getDB } from '../database.js';

export async function handleSubRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const filename = pathParts[pathParts.length - 1]; // 获取文件名部分，如 "abc123.m3u"

  // 从文件名中提取卡密
  const code = filename.replace('.m3u', '');

  // 1. 防盗检查 (KV)
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD格式
  const limitKey = `limit:sub:${today}:${code}`;

  // 获取当前请求次数
  let requestCount = parseInt(await env.KV.get(limitKey) || '0');

  // 如果超过每日限制，返回403
  if (requestCount > 20) {
    return new Response('Forbidden: Daily request limit exceeded', { status: 403 });
  }

  // 异步增加请求计数
  ctx.waitUntil(env.KV.put(limitKey, (requestCount + 1).toString(), { expirationTtl: 86400 })); // 24小时过期

  // 2. 检查缓存 (Cache API)
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  let response = await cache.match(cacheKey);

  if (response) {
    // 缓存命中，直接返回
    return response;
  }

  // 3. 缓存未命中，生成M3U内容

  // 3.1 校验卡密
  const db = getDB();
  const auth = await db.prepare("SELECT status, expired_at FROM codes WHERE code = ?").bind(code).first();

  const now = new Date().toISOString();
  if (!auth || auth.status !== 'active' || auth.expired_at < now) {
    response = new Response('Forbidden: Invalid or Expired Code', { status: 403 });
    // 缓存1小时，减少无效请求对数据库的压力
    response.headers.set("Cache-Control", "public, max-age=3600");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  // 3.2 获取所有频道（包含 headers）
  const channels = await db.prepare(`
    SELECT channel_name, group_title, logo, channel_hash, headers
    FROM channels
    WHERE is_active = 1
    ORDER BY group_title, channel_name
  `).all();

  if (!channels.results || channels.results.length === 0) {
    response = new Response('#EXTM3U\n# No channels available', {
      headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
    });
    response.headers.set("Cache-Control", "public, max-age=3600");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

    // 3.3 生成M3U内容（包含请求头信息）
  const host = url.origin;
  const m3uLines = ['#EXTM3U'];

  for (const channel of channels.results) {
    const infoParts = ['#EXTINF:-1'];
    if (channel.group_title) infoParts.push(`group-title="${channel.group_title}"`);
    if (channel.logo) infoParts.push(`tvg-logo="${channel.logo}"`);

    // 添加请求头信息
    try {
      const headers = JSON.parse(channel.headers || '{}');
      if (headers['User-Agent']) {
        const ua = headers['User-Agent'].replace(/"/g, '\\"');
        infoParts.push(`http-user-agent="${ua}"`);
      }
      if (headers['Referer']) {
        const referer = headers['Referer'].replace(/"/g, '\\"');
        infoParts.push(`referer="${referer}"`);
      }
    } catch (e) {
      // headers 解析失败，忽略
    }

    infoParts.push(',' + channel.channel_name);

    m3uLines.push(infoParts.join(' '));
    m3uLines.push(`${host}/live/${code}/${channel.channel_hash}`);
  }

  const m3uContent = m3uLines.join('\n');

  // 4. 创建响应
  response = new Response(m3uContent, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600'
    }
  });

  // 5. 写入缓存
  ctx.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
}

