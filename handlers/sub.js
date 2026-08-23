// 订阅请求处理器: /sub/{code}.m3u（简化版）

import { getDB, isDomainBlacklisted, getDomainBlacklist, getTopic, applyTopicFilter, getUserFavorites } from '../database.js';

import { getClientIP, checkIPRateLimit } from '../security/ip-blacklist.js';

import { getIPAccessCount, checkAndAddSubscriptionIP, getSubscriptionIPCacheStatus } from '../utils/cache.js';

import { getAllChannels } from '../utils/channel-cache.js';

import { getCurrentToken } from '../utils/token-manager.js';



/**
 * 生成续费营销 M3U — 订阅 URL 过期/失效时返回（非 403）
 * 设计：marketing-email-strategist 框架
 *   - 单一 segment：所有非 active 订阅
 *   - 退出条件：用户续费 → code 重新 active → 自动恢复真实 M3U
 *   - CTA：具体 URL（iptv-search.com/subscription）+ 价值陈述（HD/4K、no ads、multi-device）
 * 视频源：ad_ts_files 中 is_renewal_video = 1 且 is_active = 1 的记录
 *   - 若设了 remote_url → 用远程 TS（推荐，CDN 友好）
 *   - 否则用 /ad-ts/{id}.ts 路由服务本地 base64 content
 *   - 都没设置 → 频道条目仍可见，但点击会 404（CTA 由频道名承载）
 */
async function generateRenewalM3U(db, env, host) {
  const appUrl = env.APP_URL || 'https://iptv-search.com';
  const renewUrl = `${appUrl}/subscription`;
  const logoUrl = `${appUrl}/og-homepage.png`;
  const channelName = `Your VIP Expired — ${renewUrl}`;
  const groupTitle = 'Renewal';

  let streamUrl = '';
  try {
    const row = await db.prepare(
      'SELECT id, remote_url FROM ad_ts_files WHERE is_renewal_video = 1 AND is_active = 1 LIMIT 1'
    ).first();
    if (row) {
      streamUrl = row.remote_url || `${host}/ad-ts/${row.id}.ts`;
    }
  } catch (err) {
    console.error('[Renewal] query ad_ts_files failed:', err.message);
  }

  let m3u = '#EXTM3U\n';
  if (streamUrl) {
    m3u += `#EXTINF:-1 tvg-logo="${logoUrl}" group-title="${groupTitle}",${channelName}\n${streamUrl}\n`;
  } else {
    // 无续费视频时仍返回频道条目：CTA 由 channelName 承载，点击会 404
    m3u += `#EXTINF:-1 tvg-logo="${logoUrl}" group-title="${groupTitle}",${channelName}\nhttp://example.invalid/renew\n`;
  }
  return m3u;
}



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





  // 1. 防盗检查 (缓存)

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD格式



  // 从缓存获取今日订阅请求次数

  const requestCount = getIPAccessCount(clientIP, '/sub', today);



  // 如果超过每日限制，返回403

  if (requestCount > 20) {

    return new Response('Forbidden: Daily request limit exceeded', { status: 403 });

  }



  // 2. 禁用订阅请求的缓存（因为需要实时记录IP）

  // 不使用 Cache API 缓存，确保每次订阅都能记录IP

  // const cache = caches.default;

  // const cacheKey = new Request(url.toString(), request);

  // let response = await cache.match(cacheKey);

  // if (response) {

  //   // 缓存命中

  //   return response;

  // }



  // 3. 生成M3U内容



  // 3.1 校验卡密

  const db = getDB();

  // 查询卡密信息，同时获取 user_id（通过 user_orders 关联）和 sub_mode
  const auth = await db.prepare(`
    SELECT c.status, c.expired_at, c.max_ips, c.topic_id, c.sub_mode, o.user_id
    FROM codes c
    LEFT JOIN user_orders o ON o.code = c.code
    WHERE c.code = ?
  `).bind(code).first();



  const now = new Date().toISOString();

    if (!auth || auth.status !== 'active' || (auth.expired_at && auth.expired_at < now)) {

      // 如果卡密已过期，自动设置为禁用状态

      if (auth && auth.expired_at < now && auth.status === 'active') {

        await db.prepare("UPDATE codes SET status = 'disabled' WHERE code = ?").bind(code).run();

      }

      // 续费营销触达：URL 仍返回有效 M3U，TV 应用列表里看到一条续费提醒频道
      const renewalM3u = await generateRenewalM3U(db, env, url.origin);
      return new Response(renewalM3u, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
          'Cache-Control': 'public, max-age=60'  // 60s — 续费完成后尽快看到真实 M3U
        }
      });

  }

  // IPTV 真实活跃信号：TV 应用拉到订阅 URL（无论是否被 IP 限流）— fire-and-forget
  db.prepare('UPDATE codes SET last_fetched_at = datetime("now"), last_fetch_ip = ? WHERE code = ?')
    .bind(clientIP, code).run().catch(err => {
      console.error('[Sub] touch last_fetched_at failed:', err.message);
    });



  // 3.1.1 检查订阅IP限制（只允许最新的max_ips个IP订阅）- 使用内存缓存

  const maxIPs = auth.max_ips || 3;



  // 使用内存缓存检查和添加订阅IP

  const isAllowed = checkAndAddSubscriptionIP(code, clientIP, today, maxIPs);



  console.log(`[Sub] Code: ${code}, IP: ${clientIP}, Allowed: ${isAllowed}, maxIPs: ${maxIPs}`);

  console.log(`[Sub] Cache status:`, getSubscriptionIPCacheStatus());



  if (!isAllowed) {

    const errorResponse = new Response(`Forbidden: Too many unique IPs (max ${maxIPs})`, { status: 403 });

    errorResponse.headers.set("Cache-Control", "public, max-age=60");

    return errorResponse;

  }



  // 3.2 获取所有频道（优先从 KV 缓存，只获取启用源的频道）

  const cacheResult = await getAllChannels(env);

  let allChannels = cacheResult.channels;



  // 如果 KV 缓存中没有，过滤已启用的频道

  if (!cacheResult.fromCache) {

    allChannels = allChannels.filter(c => c.is_active && c.source_active);

  }

  // 3.1.2 应用专题过滤或收藏夹过滤
  if (auth) {
    // 如果设置了 sub_mode = 'favorites'，只返回用户的收藏夹
    // favorites 存的是 channel_hash，直接精确匹配 channel_hash 避免同名频道混淆
    if (auth.sub_mode === 'favorites' && auth.user_id) {
      try {
        const favorites = await getUserFavorites(auth.user_id);
        if (favorites.length > 0) {
          const favHashes = new Set(favorites.map(f => f.hash).filter(Boolean));
          if (favHashes.size > 0) {
            const placeholders = Array.from(favHashes).map(() => '?').join(', ');
            const favChannelsResult = await db.prepare(
              `SELECT c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash
               FROM channels c
               INNER JOIN sources s ON c.source_id = s.id
               WHERE c.is_active = 1 AND s.is_active = 1
               AND c.channel_hash IN (${placeholders})`
            ).bind(...Array.from(favHashes)).all();
            allChannels = (favChannelsResult && favChannelsResult.results) ? favChannelsResult.results : (favChannelsResult || []);
            console.log(`[Sub] Favorites filter applied: ${allChannels.length} channels for user ${auth.user_id} (matched by channel_hash)`);
          } else {
            console.warn(`[Sub] No valid hashes found in favorites for user ${auth.user_id}`);
            allChannels = [];
          }
        } else {
          console.warn(`[Sub] No favorites found for user ${auth.user_id} (sub_mode=favorites), returning empty M3U`);
          allChannels = [];
        }
      } catch (e) {
        console.error('[Sub] Failed to get favorites:', e.message);
        allChannels = [];
      }
    }
    // 否则按 topic 过滤（原有逻辑）
    else if (auth.topic_id) {
      const topic = await getTopic(auth.topic_id);
      if (topic && topic.rules) {
        try {
          const rules = JSON.parse(topic.rules);
          allChannels = applyTopicFilter(allChannels, rules);
          console.log(`[Sub] Topic filter applied: ${allChannels.length} channels remaining (topic: ${topic.name})`);
        } catch (e) {
          console.error('[Sub] Failed to parse topic rules:', e);
        }
      }
    }
  }



  if (!allChannels || allChannels.length === 0) {

    return new Response('#EXTM3U\n# No channels available', {

      headers: {

        'Content-Type': 'application/vnd.apple.mpegurl',

        'Cache-Control': 'public, max-age=600'

      }

    });

  }



  // 3.3 对频道进行排序

  const sortedChannels = sortChannels(allChannels);



  // 3.4 生成M3U内容（性能优化版）

  const host = url.origin;



  // 获取当前 token 用于 M3U 播放地址

  const token = await getCurrentToken(env);

  if (!token) {

    return new Response('#EXTM3U\n#EXTINF:-1 ,当前正在维护，请稍后再试\nhttp://example.com/stream.m3u8', {

      headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }

    });

  }



  // 加载域名黑名单（缓存到内存中）

  let domainBlacklist = [];

  try {

    const blacklistResult = await getDomainBlacklist();

    if (blacklistResult && blacklistResult.length > 0) {

      domainBlacklist = blacklistResult.map(item => item.domain);

      console.log(`[Sub] Loaded ${domainBlacklist.length} domains to blacklist`);

    }

  } catch (e) {

    console.error('[Sub] Failed to load domain blacklist:', e);

  }



  const m3uContent = buildSubscriptionContent(sortedChannels, 'm3u', host, token, domainBlacklist);



  // 4. 创建响应（增加缓存时间到12小时）

  const response = new Response(m3uContent, {

    headers: {

      'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',

      'Content-Disposition': `attachment; filename="${filename}"`,

      'Cache-Control': 'public, max-age=43200'

    }

  });



  return response;

}



// Generate subscription content (m3u or txt format).

// m3u: standard #EXTINF format

// txt: genre-grouped plain text format, duplicate channel names joined with '#' as URL separator

function buildSubscriptionContent(channels, format, host, token, domainBlacklist) {

  if (format === 'txt') {

    return buildTxtContent(channels, host, token, domainBlacklist);

  }

  return buildM3uContent(channels, host, token, domainBlacklist);

}



function buildM3uContent(channels, host, token, domainBlacklist) {

  const lines = ['#EXTM3U'];

  for (const channel of channels) {

    const infoParts = ['#EXTINF:-1'];

    if (channel.group_title) infoParts.push(`group-title="${channel.group_title}"`);

    if (channel.logo) infoParts.push(`tvg-logo="${channel.logo}"`);

    // 保留 original 字段（保留原始线路信息）
    if (channel.original) infoParts.push(`original="${channel.original}"`);

    // 解析 headers，准备还原成 #EXTVLCOPT 行（与源 m3u 格式一致）
    const vlcOptLines = [];
    if (channel.headers && channel.headers !== '{}') {
      try {
        const headers = JSON.parse(channel.headers);
        if (headers['User-Agent']) {
          vlcOptLines.push(`#EXTVLCOPT:http-user-agent=${headers['User-Agent']}`);
        }
        // Referer 还原为 #EXTVLCOPT:http-referrer=（源 m3u 标准格式）
        if (headers['Referer']) {
          vlcOptLines.push(`#EXTVLCOPT:http-referrer=${headers['Referer']}`);
        }
      } catch (e) { /* ignore parse errors */ }
    }

    infoParts.push(',' + channel.channel_name);
    lines.push(infoParts.join(' '));

    // ⭐ 在 URL 之前输出 #EXTVLCOPT 行（保留原 m3u 格式）
    for (const opt of vlcOptLines) lines.push(opt);

    lines.push(resolvePlayUrl(channel, host, token, domainBlacklist));
  }

  return lines.join('\n');
}


function buildTxtContent(channels, host, token, domainBlacklist) {

  // Map: group -> Map<channelName, urls[]>

  // Same (group, name) entries get URLs joined with '#' as separator.

  const grouped = new Map();

  for (const channel of channels) {

    const group = channel.group_title || '';

    const name = channel.channel_name || '';

    if (!grouped.has(group)) grouped.set(group, new Map());

    const nameMap = grouped.get(group);

    if (!nameMap.has(name)) nameMap.set(name, []);

    nameMap.get(name).push(resolvePlayUrl(channel, host, token, domainBlacklist));

  }

  const out = [];

  for (const [group, nameMap] of grouped) {

    out.push(`${group},#genre#`);

    for (const [name, urls] of nameMap) {

      out.push(`${name},${urls.join('#')}`);

    }

    out.push('');

  }

  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');

}



// Pick play URL: pass-through original if hostname matches blacklist (or *.subdomain),

// otherwise proxy through platform URL.

function resolvePlayUrl(channel, host, token, domainBlacklist) {

  if (channel.play_url) {

    try {

      const hostname = new URL(channel.play_url).hostname;

      if (domainBlacklist.includes(hostname)) return channel.play_url;

      for (const d of domainBlacklist) {

        if (d.startsWith('*.') && hostname.endsWith(d.substring(2))) return channel.play_url;

      }

    } catch (e) { /* fall through to proxy URL */ }

  }

  return `${host}/live/vip/${token}/${channel.channel_hash}`;

}



// Handle subscription TXT download: /sub/{code}.txt

// Same auth/IP/blacklist rules as /sub/{code}.m3u, just a different content format.

export async function handleSubRequestTxt(request, env, ctx) {

  const url = new URL(request.url);

  const pathParts = url.pathname.split('/');

  const filename = pathParts[pathParts.length - 1];

  const code = filename.replace('.txt', '');



  // IP blacklist check

  const { getClientIP, checkIPRateLimit } = await import('../security/ip-blacklist.js');

  const clientIP = getClientIP(request);

  const ipCheck = await checkIPRateLimit(env, ctx, clientIP, '/sub');

  if (!ipCheck.allowed) {

    const response = new Response(ipCheck.message, { status: 403 });

    response.headers.set('X-IP-Blacklisted', 'true');

    return response;

  }



  // Daily request limit

  const { getIPAccessCount } = await import('../utils/cache.js');

  const today = new Date().toISOString().split('T')[0];

  const requestCount = getIPAccessCount(clientIP, '/sub', today);

  if (requestCount > 20) {

    return new Response('Forbidden: Daily request limit exceeded', { status: 403 });

  }



  // Validate card

  const db = getDB();

  const auth = await db.prepare("SELECT c.status, c.expired_at, c.max_ips, c.topic_id, c.sub_mode, o.user_id FROM codes c LEFT JOIN user_orders o ON o.code = c.code WHERE c.code = ?").bind(code).first();

  const now = new Date().toISOString();

  if (!auth || auth.status !== 'active' || (auth.expired_at && auth.expired_at < now)) {

    if (auth && auth.expired_at < now && auth.status === 'active') {

      await db.prepare("UPDATE codes SET status = 'disabled' WHERE code = ?").bind(code).run();

    }

    // 续费营销触达：URL 仍返回有效 M3U
    const renewalM3u = await generateRenewalM3U(db, env, url.origin);
    return new Response(renewalM3u, {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
        'Cache-Control': 'public, max-age=60'
      }
    });

  }

  // IPTV 真实活跃信号：TV 应用拉到订阅 URL — fire-and-forget
  db.prepare('UPDATE codes SET last_fetched_at = datetime("now"), last_fetch_ip = ? WHERE code = ?')
    .bind(clientIP, code).run().catch(err => {
      console.error('[SubTxt] touch last_fetched_at failed:', err.message);
    });



  // IP per-card limit

  const { checkAndAddSubscriptionIP } = await import('../utils/cache.js');

  const maxIPs = auth.max_ips || 3;

  if (!checkAndAddSubscriptionIP(code, clientIP, today, maxIPs)) {

    const errorResponse = new Response(`Forbidden: Too many unique IPs (max ${maxIPs})`, { status: 403 });

    errorResponse.headers.set('Cache-Control', 'public, max-age=60');

    return errorResponse;

  }



  // Fetch channels

  const cacheResult = await getAllChannels(env);

  let allChannels = cacheResult.channels;

  if (!cacheResult.fromCache) {

    allChannels = allChannels.filter(c => c.is_active && c.source_active);

  }

  // 3.1.2 应用专题过滤或收藏夹过滤
  if (auth) {
    // 如果设置了 sub_mode = 'favorites'，只返回用户的收藏夹
    // favorites 存的是 channel_hash，直接精确匹配 channel_hash 避免同名频道混淆
    if (auth.sub_mode === 'favorites' && auth.user_id) {
      try {
        const favorites = await getUserFavorites(auth.user_id);
        if (favorites.length > 0) {
          const favHashes = new Set(favorites.map(f => f.hash).filter(Boolean));
          if (favHashes.size > 0) {
            const placeholders = Array.from(favHashes).map(() => '?').join(', ');
            const favChannelsResult = await db.prepare(
              `SELECT c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash
               FROM channels c
               INNER JOIN sources s ON c.source_id = s.id
               WHERE c.is_active = 1 AND s.is_active = 1
               AND c.channel_hash IN (${placeholders})`
            ).bind(...Array.from(favHashes)).all();
            allChannels = (favChannelsResult && favChannelsResult.results) ? favChannelsResult.results : (favChannelsResult || []);
            console.log(`[SubTxt] Favorites filter applied: ${allChannels.length} channels for user ${auth.user_id} (matched by channel_hash)`);
          } else {
            console.warn(`[SubTxt] No valid hashes found in favorites for user ${auth.user_id}`);
            allChannels = [];
          }
        } else {
          console.warn(`[SubTxt] No favorites found for user ${auth.user_id} (sub_mode=favorites), returning empty M3U`);
          allChannels = [];
        }
      } catch (e) {
        console.error('[SubTxt] Failed to get favorites:', e.message);
        allChannels = [];
      }
    }
    // 否则按 topic 过滤（原有逻辑）
    else if (auth.topic_id) {
      const topic = await getTopic(auth.topic_id);
      if (topic && topic.rules) {
        try {
          const rules = JSON.parse(topic.rules);
          allChannels = applyTopicFilter(allChannels, rules);
          console.log(`[SubTxt] Topic filter applied: ${allChannels.length} channels remaining (topic: ${topic.name})`);
        } catch (e) {
          console.error('[SubTxt] Failed to parse topic rules:', e);
        }
      }
    }
  }

  if (!allChannels || allChannels.length === 0) {

    return new Response('', {

      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=600' }

    });

  }



  // Domain blacklist

  let domainBlacklist = [];

  try {

    const { getDomainBlacklist } = await import('../database.js');

    const blacklistResult = await getDomainBlacklist();

    if (blacklistResult && blacklistResult.length > 0) {

      domainBlacklist = blacklistResult.map(item => item.domain);

    }

  } catch (e) {

    console.error('[SubTxt] Failed to load domain blacklist:', e);

  }



  // Token

  const token = await getCurrentToken(env);

  if (!token) {

    return new Response('', {

      headers: { 'Content-Type': 'text/plain; charset=utf-8' }

    });

  }



  const sortedChannels = sortChannels(allChannels);

  const txtContent = buildSubscriptionContent(sortedChannels, 'txt', url.origin, token, domainBlacklist);

  const response = new Response(txtContent, {

    headers: {

      'Content-Type': 'text/plain; charset=utf-8',

      'Content-Disposition': `attachment; filename="${filename}"`,

      'Cache-Control': 'public, max-age=43200'

    }

  });

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

    

    // 判断分组是否为中文（包含中文字符）

    const isChineseGroup = (str) => /[\u4e00-\u9fa5]/.test(str);

    const groupAIsChinese = isChineseGroup(groupA);

    const groupBIsChinese = isChineseGroup(groupB);

    

    // 中文分组优先排在前面

    if (groupAIsChinese !== groupBIsChinese) {

      return groupAIsChinese ? -1 : 1;

    }

    

    // 先按分组名排序（中文按拼音顺序）

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



