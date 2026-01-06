// 订阅请求处理器: /sub/{code}.m3u（简化版）
import { getDB } from '../database.js';
import { getClientIP, checkIPRateLimit } from '../security/ip-blacklist.js';

export async function handleSubRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');

  // 0. IP黑名单检查（防止撞库）
  const clientIP = getClientIP(request);
  const ipCheck = await checkIPRateLimit(env, ctx, clientIP, '/sub');
  
  if (!ipCheck.allowed) {
    const response = new Response(ipCheck.message, { status: 403 });
    response.headers.set('X-IP-Blacklisted', 'true');
    return response;
  }
  const filename = pathParts[pathParts.length - 1]; // 获取文件名部分，如 "abc123.m3u"

  // 从文件名中提取卡密
  const code = filename.replace('.m3u', '');

  // 1. 防盗检查 (数据库)
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD格式

  // 获取今日订阅请求次数（从ip_access_logs表）
  const subRequests = await db.prepare(`
    SELECT SUM(request_count) as total
    FROM ip_access_logs
    WHERE ip = ? AND path = '/sub' AND created_date = ?
  `).bind(clientIP, today).first();

  const requestCount = subRequests?.total || 0;

  // 如果超过每日限制，返回403
  if (requestCount > 20) {
    return new Response('Forbidden: Daily request limit exceeded', { status: 403 });
  }

  // 异步增加请求计数（在ip_access_logs中记录）
  ctx.waitUntil(db.prepare(`
    INSERT INTO ip_access_logs (ip, path, request_count, created_date)
    VALUES (?, '/sub', 1, ?)
  `).bind(clientIP, today).run());

  // 2. 检查缓存 (Cache API)
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  let response = await cache.match(cacheKey);

  if (response) {
    // 缓存命中
    return response;
  }

  // 3. 缓存未命中，生成M3U内容

  // 3.1 校验卡密
  const db = getDB();
  const auth = await db.prepare("SELECT status, expired_at FROM codes WHERE code = ?").bind(code).first();

  const now = new Date().toISOString();
    if (!auth || auth.status !== 'active' || auth.expired_at < now) {
      // 如果卡密已过期，自动设置为禁用状态
      if (auth && auth.expired_at < now && auth.status === 'active') {
        await db.prepare("UPDATE codes SET status = 'disabled' WHERE code = ?").bind(code).run();
      }
      response = new Response('Forbidden: Invalid or Expired Code', { status: 403 });
      // 403错误只缓存10分钟，确保状态变更快速生效
      response.headers.set("Cache-Control", "public, max-age=600");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

  // 3.2 获取所有频道（只获取启用源的频道）
  const channels = await db.prepare(`
    SELECT c.channel_name, c.group_title, c.logo, c.channel_hash, c.headers
    FROM channels c
    INNER JOIN sources s ON c.source_id = s.id
    WHERE c.is_active = 1 AND s.is_active = 1
  `).all();

  if (!channels.results || channels.results.length === 0) {
    response = new Response('#EXTM3U\n# No channels available', {
      headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
    });
    // 没有频道时缓存10分钟
    response.headers.set("Cache-Control", "public, max-age=600");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  // 3.3 对频道进行排序
  const sortedChannels = sortChannels(channels.results || []);

  // 3.4 生成M3U内容（性能优化版）
  const host = url.origin;
  const m3uLines = ['#EXTM3U'];

  for (const channel of sortedChannels) {
    const infoParts = ['#EXTINF:-1'];
    if (channel.group_title) infoParts.push(`group-title="${channel.group_title}"`);
    if (channel.logo) infoParts.push(`tvg-logo="${channel.logo}"`);

    // 添加请求头信息（优化：只在有headers时才解析）
    if (channel.headers && channel.headers !== '{}') {
      try {
        const headers = JSON.parse(channel.headers);
        // 处理User-Agent
        if (headers['User-Agent']) {
          const ua = headers['User-Agent'].replace(/"/g, '\\"');
          infoParts.push(`http-user-agent="${ua}"`);
        }
        // 处理Referer
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
    // 播放地址格式：/live/{code}/{hash}
    m3uLines.push(`${host}/live/${code}/${channel.channel_hash}`);
  }

  const m3uContent = m3uLines.join('\n');

  // 4. 创建响应（增加缓存时间到12小时）
  response = new Response(m3uContent, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=43200'
    }
  });

  // 5. 写入缓存
  ctx.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
}

// 频道排序函数
function sortChannels(channels) {
  if (!channels || channels.length === 0) {
    return [];
  }

  // 首先按分组排序，然后按频道名排序
  return channels.sort((a, b) => {
    const groupA = a.group_title || '';
    const groupB = b.group_title || '';
    // 先按分组名排序
    if (groupA !== groupB) {
      return groupA.localeCompare(groupB, 'zh-CN', { numeric: true });
    }

    // 同一分组内：英文 -> 数字 -> 中文（数字按数值大小排序）
    const nameA = a.channel_name || '';
    const nameB = b.channel_name || '';

    // 尝试提取CCTV格式的数字
    const cctvMatchA = nameA.match(/^([A-Za-z]+)(\d+)/);
    const cctvMatchB = nameB.match(/^([A-Za-z]+)(\d+)/);

    // 如果都是CCTV格式（字母开头+数字），按数字大小排序
    if (cctvMatchA && cctvMatchB && cctvMatchA[1].toUpperCase() === cctvMatchB[1].toUpperCase()) {
      const numA = parseInt(cctvMatchA[2]);
      const numB = parseInt(cctvMatchB[2]);
      if (numA !== numB) {
        return numA - numB;
      }
      // 数字相同，继续按后缀排序（无后缀的排前面）
      const suffixA = nameA.substring(cctvMatchA[1].length + cctvMatchA[2].length);
      const suffixB = nameB.substring(cctvMatchB[1].length + cctvMatchB[2].length);

      // 如果一个有后缀一个没有，无后缀的排前面
      const hasSuffixA = suffixA.trim().length > 0;
      const hasSuffixB = suffixB.trim().length > 0;
      if (hasSuffixA !== hasSuffixB) {
        return hasSuffixA ? 1 : -1;
      }

      // 都有后缀或都没有后缀，按后缀内容排序
      return suffixA.localeCompare(suffixB, 'zh-CN', { numeric: true });
    }

    // 普通排序：按字符逐个比较
    for (let i = 0; i < Math.min(nameA.length, nameB.length); i++) {
      const charA = nameA.charCodeAt(i);
      const charB = nameB.charCodeAt(i);

      // 英文字母 (A-Z, a-z: 65-90, 97-122)
      const isAlphaA = (charA >= 65 && charA <= 90) || (charA >= 97 && charA <= 122);
      const isAlphaB = (charB >= 65 && charB <= 90) || (charB >= 97 && charB <= 122);

      // 数字 (0-9: 48-57)
      const isDigitA = charA >= 48 && charA <= 57;
      const isDigitB = charB >= 48 && charB <= 57;

      // 中文 (\u4e00-\u9fa5: 19968-40869)
      const isChineseA = charA >= 19968 && charA <= 40869;
      const isChineseB = charB >= 19968 && charB <= 40869;

      // 确定字符类型优先级：英文=1, 数字=2, 中文=3
      const typeA = isAlphaA ? 1 : (isDigitA ? 2 : (isChineseA ? 3 : 4));
      const typeB = isAlphaB ? 1 : (isDigitB ? 2 : (isChineseB ? 3 : 4));

      // 类型不同时，按类型排序
      if (typeA !== typeB) {
        return typeA - typeB;
      }

      // 类型相同时，按字符值排序
      if (charA !== charB) {
        return charA - charB;
      }
    }

    // 所有字符都相等，按长度排序
    return nameA.length - nameB.length;
  });
}

