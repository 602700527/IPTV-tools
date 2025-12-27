// 公开播放列表API - 无需卡密
import { getDB, getHomepageDisplayConfig } from '../database.js';

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
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const group = url.searchParams.get('group') || '';

    const db = getDB();

    // 获取首页展示配置
    const displayConfig = await getHomepageDisplayConfig();

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
        // 只显示有请求头的频道（headers不为空且不为'{}'）
        const condition = `(c.headers IS NOT NULL AND c.headers <> '{}' AND c.headers <> '')`;
        console.log('[PublicChannels] 只显示有请求头:', condition);
        whereConditions.push(condition);
      } else {
        // 只显示没有请求头的频道（headers为空、'{}'或NULL）
        const condition = `(c.headers IS NULL OR c.headers = '{}' OR c.headers = '')`;
        console.log('[PublicChannels] 只显示无请求头:', condition);
        whereConditions.push(condition);
      }
    }

    if (search) {
      whereConditions.push('(c.channel_name LIKE ? OR c.group_title LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (group) {
      whereConditions.push('c.group_title = ?');
      params.push(group);
    }

    const whereClause = whereConditions.join(' AND ');

    console.log('[PublicChannels] WHERE条件:', whereClause);
    console.log('[PublicChannels] 查询参数:', params);

    // 获取所有频道（不限制数量）
    const channelsResult = await db.prepare(`
      SELECT c.id, c.channel_name, c.group_title, c.logo, c.channel_hash, c.source_id, s.name as source_name, c.headers
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE ${whereClause}
      ORDER BY c.group_title, c.channel_name
    `).bind(...params).all();

    // 获取所有分组（同样需要应用过滤条件）
    const groupsResult = await db.prepare(`
      SELECT DISTINCT group_title
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE ${whereClause}
      ORDER BY group_title
    `).bind(...params).all();

    const channels = channelsResult.results || [];
    const groups = groupsResult.results?.map(g => g.group_title).filter(g => g) || [];

    return new Response(JSON.stringify({
      success: true,
      channels,
      total: channels.length,
      groups
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
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

// 视频流代理处理
