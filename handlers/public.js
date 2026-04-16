// 公开播放列表API - 无需卡密
import { getDB, getHomepageDisplayConfig, getSystemConfig, getBoundAdByAction, generateAdM3U8 } from '../database.js';
import { getCurrentToken, validateToken } from '../utils/token-manager.js';
import { getAllChannels, getAllGroups, getChannelByHash } from '../utils/channel-cache.js';

/**
 * 生成ETag（基于内容SHA256哈希）
 * @param {string} content - 要计算哈希的内容
 * @returns {Promise<string>} ETag字符串
 */
async function generateETag(content) {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `"${hashHex}"`;
}

/**
 * 根据请求类型确定缓存时间
 * @param {string} search - 搜索关键词
 * @param {string} group - 分组过滤
 * @param {boolean} fromCache - 是否从KV缓存读取
 * @returns {number} 缓存时间（秒）
 */
function determineCacheTime(search, group, fromCache) {
  // 有搜索或分组过滤的请求：缓存1小时（减少API调用）
  if (search || group) {
    return 3600; // 60分钟
  }
  // 从KV缓存的默认请求：缓存12小时
  if (fromCache) {
    return 43200; // 12小时
  }
  // 从数据库查询的请求：缓存5分钟
  return 300; // 5分钟
}

// 公开公告API
export async function handlePublicAnnouncement(request, env, ctx) {
  try {
    const db = getDB();

    // 获取最新的启用的公告
    const announcementResult = await db.prepare(`
      SELECT * FROM announcements
      WHERE enabled = 1
      ORDER BY updated_at DESC
      LIMIT 1
    `).first();

    if (!announcementResult) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No active announcement'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 构建响应体
    const responseBody = JSON.stringify({
      success: true,
      data: announcementResult
    });

    // 生成ETag
    const etag = await generateETag(responseBody);

    return new Response(responseBody, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5分钟缓存
        'ETag': etag
      }
    });
  } catch (error) {
    console.error('[Announcement] 获取公告失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 公开商城设置API - 获取商城和订阅功能开关状态
 */
export async function handlePublicMallSettings(request, env, ctx) {
  try {
    const db = getDB();

    // 获取商城设置
    const settings = await db.prepare('SELECT * FROM mall_settings').all();
    const settingsMap = {};
    (settings.results || []).forEach(s => {
      settingsMap[s.key] = s.value;
    });

    // 构建响应体
    const responseBody = JSON.stringify({
      success: true,
      settings: settingsMap
    });

    // 生成ETag
    const etag = await generateETag(responseBody);

    return new Response(responseBody, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5分钟缓存
        'ETag': etag
      }
    });
  } catch (error) {
    console.error('[Mall Settings] 获取商城设置失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 随机推荐频道 - 从 KV 缓存的所有频道中随机获取
async function handleRandomChannels(env, count = 30) {
  console.log('[RandomChannels] 获取随机推荐，数量:', count);

  try {
    // 从 KV 缓存获取所有频道
    const cacheResult = await getAllChannels(env);
    const allChannels = cacheResult.channels || [];

    console.log('[RandomChannels] 从缓存获取频道数量:', allChannels.length, 'fromCache:', cacheResult.fromCache);

    if (allChannels.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        channels: [],
        count: 0
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 随机打乱数组
    const shuffled = [...allChannels].sort(() => 0.5 - Math.random());

    // 取前N个
    const randomChannels = shuffled.slice(0, Math.min(count, allChannels.length));

    console.log('[RandomChannels] 返回随机频道数量:', randomChannels.length, '总频道数:', allChannels.length);

    return new Response(JSON.stringify({
      success: true,
      channels: randomChannels,
      count: randomChannels.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('[RandomChannels] 获取随机推荐失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: '获取随机推荐失败: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 分类分组频道 - 返回按分类名分组的频道数据
async function handleGroupedChannels(env) {
  console.log('[GroupedChannels] 获取分类分组数据');

  try {
    // 从 KV 缓存获取所有频道和分组
    const cacheResult = await getAllChannels(env);
    const groupsResult = await getAllGroups(env);
    const allChannels = cacheResult.channels || [];
    const allGroups = groupsResult.groups || [];

    console.log('[GroupedChannels] 总频道数:', allChannels.length, '总分组数:', allGroups.length);

    if (allChannels.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        grouped: {},
        groups: []
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }

    // 按分类名分组
    const grouped = {};
    for (const groupName of allGroups) {
      grouped[groupName] = [];
    }

    // 将频道分配到对应分组
    for (const channel of allChannels) {
      const groupName = channel.group_title || '';
      if (groupName && grouped[groupName]) {
        grouped[groupName].push(channel);
      }
    }

    // 计算每个分组的频道数量
    const groupsWithCount = allGroups.map(name => ({
      name,
      count: grouped[name]?.length || 0
    }));

    // 按频道数量降序排序
    groupsWithCount.sort((a, b) => b.count - a.count);

    // 生成响应
    const responseBody = JSON.stringify({
      success: true,
      grouped,
      groups: groupsWithCount,
      total_channels: allChannels.length,
      total_groups: allGroups.length
    });

    // 生成ETag
    const etag = await generateETag(responseBody);

    return new Response(responseBody, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'ETag': etag
      }
    });

  } catch (error) {
    console.error('[GroupedChannels] 获取分组频道失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: '获取分组频道失败: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

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

    // 检查数据源是否激活
    if (channel.source_active === 0) {
      return new Response('Channel source is inactive', { status: 404 });
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
    const action = url.searchParams.get('action') || '';

    // 随机推荐接口
    if (action === 'random') {
      const count = parseInt(url.searchParams.get('count') || '30', 10);
      return await handleRandomChannels(env, count);
    }

    // 分类分组接口 - 返回按分类名分组的频道数据
    if (action === 'grouped') {
      return await handleGroupedChannels(env);
    }

    const db = getDB();

    // 获取首页展示配置
    const displayConfig = await getHomepageDisplayConfig();
    console.log('[PublicChannels] displayConfig配置:', JSON.stringify(displayConfig));

    // 优先尝试从 KV 缓存获取所有频道数据（即使有搜索也优先使用缓存）
    // 只有不使用缓存的场景：配置了 host 过滤（因为 play_url LIKE 无法在缓存中高效过滤）
    const useCache = (!displayConfig.hosts || displayConfig.hosts.length === 0);

    console.log('[PublicChannels] useCache:', useCache, 'search:', search, 'group:', group, 'sources:', displayConfig.sources, 'groups:', displayConfig.groups, 'hosts:', displayConfig.hosts, 'hasHeaders:', displayConfig.hasHeaders);

    let shouldUseCache = useCache;  // 使用可变变量来跟踪是否使用缓存
    let allChannels, allGroups, total;
    if (shouldUseCache) {
      console.log('[PublicChannels] 使用 KV 缓存');
      try {
        const cacheResult = await getAllChannels(env);
        const groupsResult = await getAllGroups(env);
        console.log('[PublicChannels] 缓存结果 - channels:', cacheResult.channels?.length || 0, 'fromCache:', cacheResult.fromCache, 'groups:', groupsResult.groups?.length || 0, 'fromCache:', groupsResult.fromCache);
        allChannels = cacheResult.channels || [];
        allGroups = groupsResult.groups || [];

        // 在内存中进行过滤（包括搜索、分组过滤、配置过滤）
        let filteredChannels = allChannels;

        // 数据源过滤
        if (displayConfig.sources && displayConfig.sources.length > 0) {
          filteredChannels = filteredChannels.filter(c =>
            c.is_active && c.source_active &&
            displayConfig.sources.includes(c.source_id)
          );
        } else {
          // 默认只显示激活的频道和数据源
          filteredChannels = filteredChannels.filter(c =>
            c.is_active && c.source_active
          );
        }

        // 分组过滤
        if (displayConfig.groups && displayConfig.groups.length > 0) {
          filteredChannels = filteredChannels.filter(c =>
            displayConfig.groups.includes(c.group_title)
          );
        }

        // Host 过滤
        if (displayConfig.hosts && displayConfig.hosts.length > 0) {
          filteredChannels = filteredChannels.filter(c =>
            displayConfig.hosts.some(host => c.play_url && c.play_url.includes(host))
          );
        }

        // 请求头过滤
        if (displayConfig.hasHeaders !== null && displayConfig.hasHeaders !== undefined) {
          console.log('[PublicChannels] hasHeaders过滤配置:', displayConfig.hasHeaders);
          if (displayConfig.hasHeaders === true) {
            filteredChannels = filteredChannels.filter(c =>
              c.headers && c.headers !== '{}' && c.headers !== '' && c.headers.length > 2
            );
          } else {
            filteredChannels = filteredChannels.filter(c =>
              !c.headers || c.headers === '{}' || c.headers === ''
            );
          }
          console.log('[PublicChannels] hasHeaders条件已添加');
        }

        // 搜索过滤
        if (search) {
          const searchLower = search.toLowerCase();
          filteredChannels = filteredChannels.filter(c =>
            (c.channel_name && c.channel_name.toLowerCase().includes(searchLower)) ||
            (c.group_title && c.group_title.toLowerCase().includes(searchLower))
          );
        }

        // 分组过滤
        if (group) {
          filteredChannels = filteredChannels.filter(c => c.group_title === group);
        }

        // 对过滤后的数据进行排序（与数据库查询的排序逻辑一致）
        if (filteredChannels.length > 0) {
          filteredChannels.sort((a, b) => {
            const groupA = a.group_title || '';
            const groupB = b.group_title || '';
            if (groupA !== groupB) {
              return groupA.localeCompare(groupB, 'zh-CN', { numeric: true });
            }
            const nameA = a.channel_name || '';
            const nameB = b.channel_name || '';
            return nameA.localeCompare(nameB, 'zh-CN', { numeric: true });
          });
        }

        // 计算总数
        total = filteredChannels.length;

        // 分页处理
        const offset = (page - 1) * pageSize;
        const totalPages = Math.ceil(total / pageSize);

        // 分页获取频道数据
        const paginatedChannels = filteredChannels.slice(offset, offset + pageSize);

        // 分组列表也进行过滤（不受group过滤影响）
        let filteredGroups = allGroups;
        if (displayConfig.groups && displayConfig.groups.length > 0) {
          filteredGroups = filteredGroups.filter(g => displayConfig.groups.includes(g));
        }
        if (search) {
          const searchLower = search.toLowerCase();
          filteredGroups = filteredGroups.filter(g =>
            g.toLowerCase().includes(searchLower)
          );
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

        // 构建响应体
        const responseBody = JSON.stringify({
          success: true,
          channels: paginatedChannels,
          groups: filteredGroups.map(g => ({ name: g })),
          pagination
        });

        // 生成ETag
        const etag = await generateETag(responseBody);

        // 确定缓存时间（从KV缓存的请求）
        const cacheTime = determineCacheTime(search, group, true);

        console.log('[PublicChannels] ETag:', etag.substring(0, 20) + '...', 'Cache time:', cacheTime + 's');

        return new Response(responseBody, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${cacheTime}`,
            'ETag': etag
          }
        });
      } catch (cacheError) {
        console.error('[PublicChannels] 获取缓存失败,降级到数据库:', cacheError);
        // 如果缓存获取失败,设置shouldUseCache为false,继续使用数据库查询
        shouldUseCache = false;
      }
    }

    if (!shouldUseCache) {
      console.log('[PublicChannels] 使用数据库查询');
      // 原有的数据库查询逻辑...

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

    let channels = channelsResult.results || [];
    let groups = groupsResult.results?.map(g => g.group_title).filter(g => g) || [];

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

    // 构建响应体
    const responseBody = JSON.stringify({
      success: true,
      channels: channels,
      groups: groups.map(g => ({ name: g })),
      pagination,
      debug: debugInfo  // 添加调试信息
    });

    // 生成ETag
    const etag = await generateETag(responseBody);

    // 确定缓存时间（从数据库查询的请求）
    const cacheTime = determineCacheTime(search, group, false);

    console.log('[PublicChannels] ETag:', etag.substring(0, 20) + '...', 'Cache time:', cacheTime + 's', 'From DB: true');

    return new Response(responseBody, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${cacheTime}`,
        'ETag': etag
      }
    });
    }
  } catch (error) {
    console.error('[PublicChannels] 获取公开频道列表失败:', error);
    console.error('[PublicChannels] 错误堆栈:', error.stack);
    console.error('[PublicChannels] 错误详细信息:', JSON.stringify({
      message: error.message,
      name: error.name,
      cause: error.cause
    }));
    return new Response(JSON.stringify({
      success: false,
      error: '获取频道列表失败: ' + error.message
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
  const tokenParam = url.searchParams.get('token'); // 获取token参数
  const fullBaseUrl = `${url.protocol}//${url.host}`; // 获取完整的 base URL

  // 带Range头的请求不检查缓存，避免VLC的Range请求问题
  const hasRangeHeader = request.headers.has('Range');

  if (!hash) {
    return new Response('Missing channel hash', { status: 400 });
  }

  // 获取客户端IP
  const clientIP = request.headers.get('CF-Connecting-IP') ||
                  request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ||
                  request.headers.get('X-Real-IP') ||
                  'unknown';

  try {
    const db = getDB();

    // 获取系统配置
    const systemConfig = await getSystemConfig();

    // 检查是否是免费订阅请求
    const freeSubId = url.searchParams.get('freesub');

    // 免费订阅验证
    if (freeSubId) {
      // 验证免费订阅是否有效且IP匹配
      const sub = await db.prepare(`
        SELECT * FROM free_subscriptions
        WHERE sub_id = ? AND expired_at > datetime('now')
      `).bind(freeSubId).first();

      if (!sub) {
        // 免费订阅过期播放场景 - 检查是否有广告绑定
        const adBinding = await getBoundAdByAction('freesub_expired', clientIP);
        if (adBinding) {
          // 直接重定向到TS文件
          const adTsUrl = `${fullBaseUrl}/api/ads/${adBinding.id}.ts`;
          console.log('[PublicPlay] Redirecting to ad TS file (freesub expired):', adTsUrl);
          const headers = new Headers({
            'Location': adTsUrl,
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          });
          return new Response(null, { status: 302, headers });
        }

        return new Response(JSON.stringify({
          success: false,
          error: 'Free subscription not found or expired'
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 检查IP是否匹配
      if (sub.ip !== clientIP) {
        console.error('[FreeSub Play] IP mismatch', {
          subId: freeSubId,
          expectedIP: sub.ip,
          actualIP: clientIP
        });

        // 免费订阅IP未授权播放场景 - 检查是否有广告绑定
        const adBinding = await getBoundAdByAction('freesub_unauth', clientIP);
        if (adBinding) {
          // 直接重定向到TS文件
          const adTsUrl = `${fullBaseUrl}/api/ads/${adBinding.id}.ts`;
          console.log('[PublicPlay] Redirecting to ad TS file (freesub unauth):', adTsUrl);
          const headers = new Headers({
            'Location': adTsUrl,
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          });
          return new Response(null, { status: 302, headers });
        }

        return new Response(JSON.stringify({
          success: false,
          error: 'IP address does not match subscription'
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 免费订阅验证通过，查询频道并重定向到真实播放地址
      const channel = await getChannelByHash(env, hash);

      if (!channel || !channel.is_active) {
        // 频道不存在免费播放场景 - 检查是否有广告绑定
        const adBinding = await getBoundAdByAction('freesub_channel_not_found', clientIP);
        if (adBinding) {
          // 直接重定向到TS文件
          const adTsUrl = `${fullBaseUrl}/api/ads/${adBinding.id}.ts`;
          console.log('[PublicPlay] Redirecting to ad TS file (channel not found):', adTsUrl);
          const headers = new Headers({
            'Location': adTsUrl,
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          });
          return new Response(null, { status: 302, headers });
        }

        return new Response('Channel not found', { status: 404 });
      }

      if (channel.source_active === 0) {
        return new Response('Channel source is inactive', { status: 404 });
      }

      // 正常免费播放场景 - 检查是否有广告绑定
      const adBinding = await getBoundAdByAction('freesub_normal', clientIP);
      if (adBinding) {
        // 直接重定向到TS文件
        const adTsUrl = `${fullBaseUrl}/api/ads/${adBinding.id}.ts`;
        console.log('[PublicPlay] Redirecting to ad TS file (normal):', adTsUrl);
        const headers = new Headers({
          'Location': adTsUrl,
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        });
        return new Response(null, { status: 302, headers });
      }

      // 构建播放URL和headers
      const playUrl = channel.play_url;
      let headersObj = {};
      if (channel.headers) {
        try {
          headersObj = JSON.parse(channel.headers);
        } catch (e) {
          console.error('Failed to parse headers:', e);
        }
      }

      console.log('[FreeSub Play] Redirecting to real play URL', {
        subId: freeSubId,
        channel: channel.channel_name,
        playUrl
      });

      // 重定向到真实播放地址
      return Response.redirect(playUrl, 302, {
        'Access-Control-Allow-Origin': '*',
        ...headersObj
      });
    }

    // 查询频道信息（优先从 KV 缓存）
    const channel = await getChannelByHash(env, hash);

    if (!channel || !channel.is_active) {
      return new Response('Channel not found', { status: 404 });
    }

    // 检查数据源是否激活
    if (channel.source_active === 0) {
      return new Response('Channel source is inactive', { status: 404 });
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

    // 返回播放URL和headers配置
    return new Response(JSON.stringify({
      success: true,
      play_url: channel.play_url,
      headers: headersObj,
      channel_name: channel.channel_name
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



// 视频流代理处理

/**
 * 验证用户会话（从 Cookie 或 Authorization 头）
 * @returns {Promise<{userId: number, isVIP: boolean} | null>}
 */
async function verifyUserSession(request, db) {
  try {
    // 支持两种认证方式：Cookie 或 Authorization 头
    let token = null;
    
    // 1. 尝试从 Authorization 头获取（Bearer token）
    const authHeader = request.headers.get('Authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // 2. 如果没有，尝试从 Cookie 获取
    if (!token) {
      const cookieHeader = request.headers.get('Cookie') || '';
      const tokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
      if (tokenMatch) {
        token = tokenMatch[1];
      }
    }

    if (!token) {
      return null;
    }

    // 验证会话
    const session = await db.prepare(`
      SELECT s.user_id
      FROM user_sessions s
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first();

    if (!session) {
      return null;
    }

    // 检查会员状态
    const isMember = await checkMemberStatus(session.user_id, db);

    return {
      userId: session.user_id,
      isVIP: isMember
    };
  } catch (error) {
    console.error('[verifyUserSession] Error:', error);
    return null;
  }
}

/**
 * 检查用户是否为会员
 */
async function checkMemberStatus(userId, db) {
  try {
    const user = await db.prepare('SELECT is_verified FROM users WHERE id = ?').bind(userId).first();
    if (!user || !user.is_verified) {
      return false;
    }

    const now = new Date().toISOString();
    const result = await db.prepare(`
      SELECT o.id
      FROM user_orders o
      JOIN codes c ON o.code = c.code
      WHERE o.user_id = ?
        AND o.status = 'completed'
        AND c.expired_at > ?
      LIMIT 1
    `).bind(userId, now).first();

    return !!result;
  } catch (error) {
    console.error('[checkMemberStatus] Error:', error);
    return false;
  }
}

/**
 * 生成 M3U 内容
 * @param {Array} channels - 频道列表
 * @param {string} token - 播放 token
 * @param {string} prefix - 前缀 (vip/free/fav)
 * @param {string} host - 主机地址
 * @returns {string} M3U 内容
 */
function generateM3UContent(channels, token, prefix, host) {
  const lines = ['#EXTM3U'];
  for (const channel of channels) {
    const infoParts = ['#EXTINF:-1'];
    if (channel.group_title) infoParts.push(`group-title="${channel.group_title}"`);
    if (channel.logo) infoParts.push(`tvg-logo="${channel.logo}"`);
    infoParts.push(',' + channel.channel_name);
    lines.push(infoParts.join(' '));
    lines.push(`${host}/live/${prefix}/${token}/${channel.channel_hash}`);
  }
  return lines.join('\n');
}

/**
 * Handle favorites M3U download
 * POST /api/favorites/m3u
 * Body: { favorites: [{ hash, name, logo, group }] }
 */
export async function handleFavoritesM3U(request, env, ctx) {
  const url = new URL(request.url);
  const db = getDB();

  // 1. 验证用户登录（可选）
  const userSession = await verifyUserSession(request, db);
  const isVIP = userSession?.isVIP || false;

  // 2. 获取当前 token
  const token = await getCurrentToken(env);

  // 3. 如果 token 为 null，返回错误 M3U
  if (!token) {
    return new Response('#EXTM3U\n#EXTINF:-1 ,当前正在维护，请稍后再试', {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }

  // 4. 获取收藏频道列表（从请求体）
  let favoriteChannels = [];
  try {
    const body = await request.json();
    if (body.favorites && Array.isArray(body.favorites)) {
      favoriteChannels = body.favorites.map(f => ({
        channel_hash: f.hash,
        channel_name: f.name,
        logo: f.logo || '',
        group_title: f.group || ''
      }));
    }
  } catch (e) {
    console.error('[handleFavoritesM3U] Failed to parse body:', e);
  }

  // 5. 非 VIP 限制 100 个
  const MAX_FREE_CHANNELS = 100;
  if (!isVIP && favoriteChannels.length > MAX_FREE_CHANNELS) {
    favoriteChannels = favoriteChannels.slice(0, MAX_FREE_CHANNELS);
  }

  // 6. VIP 会员用 vip 前缀（无广告），非会员用 fav 前缀（有广告）
  const prefix = isVIP ? 'vip' : 'fav';
  const host = url.protocol + '//' + url.host;

  const m3uContent = generateM3UContent(favoriteChannels, token, prefix, host);

  return new Response(m3uContent, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
      'Content-Disposition': 'attachment; filename="favorites.m3u"',
      'Cache-Control': 'private, max-age=300'
    }
  });
}

/**
 * Handle channels M3U download (for category pages and public downloads)
 * POST /api/channels/m3u
 * Body: { channels: [{ hash, name, logo, group }] } (可选，不传则下载全部)
 */
export async function handleChannelsM3U(request, env, ctx) {
  const url = new URL(request.url);
  const db = getDB();

  // 1. 验证用户登录（可选，不强制）
  const userSession = await verifyUserSession(request, db);
  const isVIP = userSession?.isVIP || false;

  // 2. 获取当前 token
  const token = await getCurrentToken(env);

  // 3. 如果 token 为 null，返回错误 M3U
  if (!token) {
    return new Response('#EXTM3U\n#EXTINF:-1 ,当前正在维护，请稍后再试', {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }

  let channels = [];
  
  // 4. 尝试从请求体获取频道列表
  try {
    const body = await request.json();
    if (body.channels && Array.isArray(body.channels)) {
      // 使用前端传来的频道列表
      channels = body.channels.map(ch => ({
        channel_hash: ch.hash,
        channel_name: ch.name,
        logo: ch.logo || '',
        group_title: ch.group || ''
      }));
    }
  } catch (e) {
    // 请求体解析失败或为空，使用空列表（将返回空 M3U）
    console.log('[handleChannelsM3U] No channels in request body');
  }

  // 5. 非会员限制 100 个
  const MAX_FREE_CHANNELS = 100;
  if (!isVIP && channels.length > MAX_FREE_CHANNELS) {
    channels = channels.slice(0, MAX_FREE_CHANNELS);
  }

  // 6. VIP 会员用 vip 前缀（无广告），非会员用 fav 前缀（有广告）
  const prefix = isVIP ? 'vip' : 'fav';
  const host = url.protocol + '//' + url.host;

  const m3uContent = generateM3UContent(channels, token, prefix, host);

  return new Response(m3uContent, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
      'Content-Disposition': 'attachment; filename="channels.m3u"',
      'Cache-Control': 'private, max-age=300'
    }
  });
}

// 公开配置API - 获取前端需要的配置（如加密密钥）
export async function handlePublicConfig(request, env, ctx) {
  try {
    const systemConfig = await getSystemConfig();

    // 只返回必要的配置信息
    const publicConfig = {
      enable_play_token: systemConfig.enable_play_token,
      enable_url_encryption: systemConfig.enable_url_encryption,
      url_encryption_key: systemConfig.url_encryption_key || '',
      enable_anti_debug: systemConfig.enable_anti_debug,
      disable_console_logs: systemConfig.disable_console_logs,
      enable_ip_play: systemConfig.enable_ip_play
    };

    // 构建响应体
    const responseBody = JSON.stringify({
      success: true,
      config: publicConfig
    });

    // 生成ETag
    const etag = await generateETag(responseBody);

    return new Response(responseBody, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600', // 10分钟缓存
        'ETag': etag
      }
    });
  } catch (error) {
    console.error('获取公开配置失败:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
