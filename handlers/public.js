// 公开播放列表API - 无需卡密
import { getDB, getHomepageDisplayConfig, getSystemConfig, generatePlayToken, verifyPlayToken, verifyReferer } from '../database.js';

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

    // Ref验证
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

    // Token验证（如果启用）
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

      const isValid = await verifyPlayToken(tokenParam, env.SECRET_KEY || 'default-secret-key', env, request);
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

    // 直接返回播放URL和headers配置，让前端Hls.js使用
    return new Response(JSON.stringify({
      success: true,
      play_url: channel.play_url,
      headers: headersObj,
      channel_name: channel.channel_name
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
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
