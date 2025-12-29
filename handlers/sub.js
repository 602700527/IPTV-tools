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
    // 分组排序逻辑
    const groupComparison = compareGroups(a.group_title || '', b.group_title || '');
    if (groupComparison !== 0) {
      return groupComparison;
    }

    // 频道名排序逻辑（英文、数字、汉字）
    return compareChannelNames(a.channel_name || '', b.channel_name || '');
  });
}

// 分组比较函数：中文分组优先，然后是英文分组
function compareGroups(groupA, groupB) {
  // 检查是否包含中文字符
  const hasChinese = (str) => /[\u4e00-\u9fff]/.test(str);
  
  const aHasChinese = hasChinese(groupA);
  const bHasChinese = hasChinese(groupB);

  // 中文分组优先
  if (aHasChinese && !bHasChinese) return -1;
  if (!aHasChinese && bHasChinese) return 1;

  // 同类型分组按字母顺序排序
  return groupA.localeCompare(groupB, 'zh-CN');
}

// 频道名比较函数：英文 -> 数字 -> 汉字
function compareChannelNames(nameA, nameB) {
  const getType = (str) => {
    // 检查是否以英文字母开头
    if (/^[a-zA-Z]/.test(str)) return 'english';
    // 检查是否以数字开头
    if (/^[0-9]/.test(str)) return 'number';
    // 否则为中文或其他
    return 'chinese';
  };

  const typeA = getType(nameA);
  const typeB = getType(nameB);

  // 类型优先级：英文(0) -> 数字(1) -> 汉字(2)
  const priority = { 'english': 0, 'number': 1, 'chinese': 2 };
  
  if (typeA !== typeB) {
    return priority[typeA] - priority[typeB];
  }

  // 同类型内按字典序排序
  if (typeA === 'chinese') {
    // 中文字符按拼音排序
    return nameA.localeCompare(nameB, 'zh-CN');
  } else {
    // 英文和数字按ASCII排序
    return nameA.localeCompare(nameB, 'en-US');
  }
}

