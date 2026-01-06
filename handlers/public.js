// 公开播放列表API - 无需卡密
import { getDB, getHomepageDisplayConfig, getSystemConfig, generatePlayToken, verifyPlayToken, verifyReferer, encryptWithAES } from '../database.js';

// 调试接口 - 查看频道信息
export async function handleChannelDebug(request, env, ctx) {
  const url = new URL(request.url);
  const hash = url.searchParams.get('hash');
  const test = url.searchParams.get('test') === 'true';

  if (!hash) {
    return new Response('Missing hash parameter', { status: 400 });
  }

  try {
    const db = getDB();
    const channel = await db.prepare(`
      SELECT channel_name, group_title, logo, play_url, headers, id, source_id
      FROM channels
      WHERE channel_hash = ? AND is_active = 1
    `).bind(hash).first();

    if (!channel) {
      return new Response('Channel not found', { status: 404 });
    }

    // 解析headers
    let headersObj = {};
    if (channel.headers) {
      try {
        headersObj = JSON.parse(channel.headers);
      } catch (e) {
        headersObj = { error: e.message };
      }
    }

    // 如果test=true，测试不同的headers组合
    if (test) {
      const results = [];

      // 测试URL编码
      const encodedUrl = channel.play_url.replace('id=五星体育', 'id=' + encodeURIComponent('五星体育'));

      const tests = [
        {
          name: '原始URL，GET请求',
          method: 'GET',
          url: channel.play_url,
          headers: { 'User-Agent': 'iPhone' }
        },
        {
          name: 'URL编码中文，GET请求',
          method: 'GET',
          url: encodedUrl,
          headers: { 'User-Agent': 'iPhone' }
        },
        {
          name: 'POST请求，表单数据',
          method: 'POST',
          url: channel.play_url,
          headers: { 'User-Agent': 'iPhone', 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'id=' + encodeURIComponent('五星体育')
        },
        {
          name: 'GET + 完整浏览器headers',
          method: 'GET',
          url: encodedUrl,
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
            'Accept': 'application/x-mpegURL, application/vnd.apple.mpegurl, application/json, video/mp2t, video/mp4',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Referer': new URL(channel.play_url).origin + '/'
          }
        },
        {
          name: 'GET + iPhone headers',
          method: 'GET',
          url: encodedUrl,
          headers: {
            'User-Agent': 'iPhone',
            'Accept': '*/*',
            'Referer': new URL(channel.play_url).origin + '/'
          }
        },
        {
          name: 'GET + m3u8播放器headers',
          method: 'GET',
          url: encodedUrl,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Referer': new URL(channel.play_url).origin + '/',
            'Origin': new URL(channel.play_url).origin
          }
        }
      ];

      for (const testConfig of tests) {
        try {
          const options = {
            method: testConfig.method,
            headers: testConfig.headers,
            redirect: 'follow'
          };

          if (testConfig.body) {
            options.body = testConfig.body;
          }

          const response = await fetch(testConfig.url, options);

          // 读取部分响应内容以便调试
          let responseText = '';
          try {
            responseText = await response.text();
            if (responseText.length > 500) {
              responseText = responseText.substring(0, 500) + '...';
            }
          } catch (e) {
            responseText = '(无法读取响应)';
          }

          results.push({
            name: testConfig.name,
            url: testConfig.url,
            method: testConfig.method,
            headers: testConfig.headers,
            body: testConfig.body,
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('Content-Type'),
            success: response.ok,
            responsePreview: responseText
          });
        } catch (e) {
          results.push({
            name: testConfig.name,
            url: testConfig.url,
            method: testConfig.method,
            headers: testConfig.headers,
            error: e.message,
            success: false
          });
        }
      }

      return new Response(JSON.stringify({
        channel_name: channel.channel_name,
        play_url: channel.play_url,
        encoded_url: encodedUrl,
        headers: channel.headers,
        headers_parsed: headersObj,
        test_results: results
      }, null, 2));
    }

    return new Response(JSON.stringify({
      channel_name: channel.channel_name,
      play_url: channel.play_url,
      headers: channel.headers,
      headers_parsed: headersObj,
      headers_count: Object.keys(headersObj).length
    }, null, 2));

  } catch (error) {
    console.error('获取频道调试信息失败:', error);
    return new Response('Error', { status: 500 });
  }
}

export async function handlePublicChannels(request, env, ctx) {
  console.log('[PublicChannels] ===== 请求开始 =====');
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const group = url.searchParams.get('group') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('page_size') || '50', 10);

    const db = getDB();

    // 获取首页展示配置
    const displayConfig = await getHomepageDisplayConfig();
    console.log('[PublicChannels] displayConfig配置:', JSON.stringify(displayConfig));

    // 构建查询条件
    let whereConditions = ['c.is_active = 1', 's.is_active = 1'];
    let params = [];

    // 如果配置了数据源过滤
    if (displayConfig.sources && displayConfig.sources.length > 0) {
      const placeholders = displayConfig.sources.map(() => '?').join(',');
      whereConditions.push(`c.source_id IN (${placeholders})`);
      params.push(...displayConfig.sources);
    }

    // 如果配置了分类过滤
    if (displayConfig.groups && displayConfig.groups.length > 0) {
      const placeholders = displayConfig.groups.map(() => '?').join(',');
      whereConditions.push(`c.group_title IN (${placeholders})`);
      params.push(...displayConfig.groups);
    }

    // 如果配置了host过滤
    if (displayConfig.hosts && displayConfig.hosts.length > 0) {
      const hostConditions = displayConfig.hosts.map(host => `c.play_url LIKE '%${host}%'`).join(' OR ');
      whereConditions.push(`(${hostConditions})`);
    }

    // 如果配置了请求头过滤
    if (displayConfig.hasHeaders !== null && displayConfig.hasHeaders !== undefined) {
      console.log('[PublicChannels] hasHeaders过滤配置:', displayConfig.hasHeaders);
      if (displayConfig.hasHeaders === true) {
        // 只显示有请求头的频道（headers不为NULL且length>2，即非空对象{}）
        whereConditions.push(`c.headers IS NOT NULL AND length(c.headers) > 2`);
      } else {
        // 只显示没有请求头的频道（headers为NULL、{}或空字符串）
        whereConditions.push(`c.headers IS NULL OR c.headers = '{}' OR c.headers = ''`);
      }
      console.log('[PublicChannels] hasHeaders条件已添加');
    }

    // 搜索过滤（同时影响频道和分组列表）
    if (search) {
      whereConditions.push('(c.channel_name LIKE ? OR c.group_title LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    console.log('[PublicChannels] WHERE条件:', whereClause);
    console.log('[PublicChannels] 查询参数:', params);

    // 构建频道的WHERE条件（包括group过滤）
    let channelWhereConditions = [...whereConditions];
    let channelParams = [...params];

    if (group) {
      channelWhereConditions.push('c.group_title = ?');
      channelParams.push(group);
    }

    const channelWhereClause = channelWhereConditions.join(' AND ');

    // 获取总数量（包含group过滤）
    const countResult = await db.prepare(`
      SELECT COUNT(*) as total
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE ${channelWhereClause}
    `).bind(...channelParams).first();
    const total = countResult ? countResult.total : 0;

    // 分页参数
    const offset = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    // 获取分页频道数据（包含group过滤）
    const channelsResult = await db.prepare(`
      SELECT c.id, c.channel_name, c.group_title, c.logo, c.channel_hash, c.source_id, s.name as source_name, c.headers
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE ${channelWhereClause}
      ORDER BY c.group_title, c.channel_name
      LIMIT ? OFFSET ?
    `).bind(...channelParams, pageSize, offset).all();

    // 获取所有分组（不受group过滤影响，但受search过滤影响）
    const groupsResult = await db.prepare(`
      SELECT DISTINCT group_title
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE ${whereClause}
      ORDER BY group_title
    `).bind(...params).all();

    const channels = channelsResult.results || [];
    const groups = groupsResult.results?.map(g => g.group_title).filter(g => g) || [];

    // 在应用层进行分组内排序（英文 -> 数字 -> 中文）
    if (channels.length > 0) {
      channels.sort((a, b) => {
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

    // 分页信息
    const pagination = {
      page,
      page_size: pageSize,
      total,
      total_pages: totalPages,
      has_prev: page > 1,
      has_next: page < totalPages
    };

    // 调试信息：添加到响应中，方便在浏览器Network面板查看
    const debugInfo = {
      hasHeadersConfig: displayConfig.hasHeaders,
      channelWhereClause: channelWhereClause,
      groupsWhereClause: whereClause,
      channelParamsCount: channelParams.length,
      groupsParamsCount: params.length,
      channelsCount: channels.length,
      groupsCount: groups.length
    };

    console.log('[PublicChannels] 调试信息:', JSON.stringify(debugInfo));

    return new Response(JSON.stringify({
      success: true,
      channels,
      groups,
      pagination,
      debug: debugInfo  // 添加调试信息
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('获取公开频道列表失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: '获取频道列表失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handlePublicPlay(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const hash = pathParts[3]; // /play/{hash}

  if (!hash) {
    return new Response('Missing channel hash', { status: 400 });
  }

  try {
    const db = getDB();

    // 获取系统配置
    const systemConfig = await getSystemConfig();

    // Token验证（如果启用）- 优先验证token
    const tokenParam = url.searchParams.get('token');
    if (systemConfig.enable_play_token) {
      if (!tokenParam) {
        // 如果没有token，返回需要token的响应，前端应该重新请求获取token
        return new Response(JSON.stringify({
          success: false,
          error: 'Token required',
          requireToken: true
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const isValid = await verifyPlayToken(tokenParam, env.SECRET_KEY || 'default-secret-key', env, request, db);
      if (!isValid) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid or expired token'
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Ref验证（在token验证之后）
    if (systemConfig.enable_ref_check) {
      const referer = request.headers.get('Referer');
      if (!verifyReferer(referer, systemConfig.ref_whitelist)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid referer'
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 查询频道信息
    const channel = await db.prepare(`
      SELECT channel_name, group_title, logo, play_url, headers
      FROM channels
      WHERE channel_hash = ? AND is_active = 1
    `).bind(hash).first();

    if (!channel) {
      return new Response('Channel not found', { status: 404 });
    }

    // 解析headers
    let headersObj = {};
    if (channel.headers) {
      try {
        headersObj = JSON.parse(channel.headers);
      } catch (e) {
        console.error('Failed to parse headers:', e);
      }
    }

    // AES-GCM 加密播放URL（使用系统配置的密钥）
    let encryptionKey = env.SECRET_KEY || 'default-secret-key';
    if (systemConfig.enable_url_encryption && systemConfig.url_encryption_key) {
      encryptionKey = systemConfig.url_encryption_key;
    }
    const encryptedUrl = await encryptWithAES(channel.play_url, encryptionKey);

    // 直接返回播放URL和headers配置，让前端Hls.js使用
    return new Response(JSON.stringify({
      success: true,
      play_url: encryptedUrl, // AES-GCM 加密的数据
      headers: headersObj,
      channel_name: channel.channel_name,
      encoded: true, // 标识数据已加密
      encryption: 'aes-gcm' // 标识加密方式
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });

  } catch (error) {
    console.error('获取播放地址失败:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// 获取播放token
export async function handleGetPlayToken(request, env, ctx) {
  const url = new URL(request.url);
  const hash = url.searchParams.get('hash');

  if (!hash) {
    return new Response('Missing channel hash', { status: 400 });
  }

  try {
    const db = getDB();

    // 获取系统配置
    const systemConfig = await getSystemConfig();

    // Ref验证（如果启用）
    if (systemConfig.enable_ref_check) {
      const referer = request.headers.get('Referer');
      if (!verifyReferer(referer, systemConfig.ref_whitelist)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid referer'
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 验证频道是否存在
    const channel = await db.prepare(`
      SELECT channel_name
      FROM channels
      WHERE channel_hash = ? AND is_active = 1
    `).bind(hash).first();

    if (!channel) {
      return new Response('Channel not found', { status: 404 });
    }

    // 获取客户端真实IP（考虑CF代理）
    const clientIp = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For')?.split(',')[0] ||
                    'unknown';

    // 生成带IP绑定的token（将IP哈希后存入nonce，服务器验证时对比）
    const token = await generatePlayToken(hash, clientIp, env.SECRET_KEY || 'default-secret-key');

    return new Response(JSON.stringify({
      success: true,
      token: token,
      expire_seconds: systemConfig.play_token_expire_seconds
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('生成token失败:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// 视频流代理处理

// 公开配置API - 获取前端需要的配置（如加密密钥）
export async function handlePublicConfig(request, env, ctx) {
  try {
    const systemConfig = await getSystemConfig();

    // 只返回必要的配置信息
    const publicConfig = {
      enable_url_encryption: systemConfig.enable_url_encryption,
      url_encryption_key: systemConfig.url_encryption_key || ''
    };

    return new Response(JSON.stringify({
      success: true,
      config: publicConfig
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (error) {
    console.error('获取公开配置失败:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
