// 数据库初始化和表结构管理
let DB = null;

// 初始化数据库连接
export async function initDB(env) {
  if (!DB) {
    DB = env.DB;
  }
  return DB;
}

// 获取数据库实例
export function getDB() {
  if (!DB) {
    throw new Error('Database not initialized');
  }
  return DB;
}

// 创建表结构
export async function createTables(env) {
  const db = env.DB;

  // 创建直播源配置表
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, 
      url TEXT, 
      type TEXT DEFAULT 'm3u',
      parse_mode TEXT DEFAULT 'strict',
      last_updated DATETIME
    )
  `).run();

  // 迁移：添加 is_active 字段（如果不存在）
  try {
    await db.prepare('ALTER TABLE sources ADD COLUMN is_active BOOLEAN DEFAULT 1').run();
    console.log('Migrated sources table: added is_active column');
  } catch (e) {
    // 字段已存在，忽略错误
    if (!e.message.includes('duplicate column name')) {
      console.error('Migration error:', e);
    }
  }

  // 创建频道表
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS channels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id INTEGER,
      channel_name TEXT, 
      group_title TEXT,
      logo TEXT,
      play_url TEXT, 
      headers TEXT,
      channel_hash TEXT,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY(source_id) REFERENCES sources(id)
    )
  `).run();

  // 创建频道哈希索引
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channel_hash ON channels(channel_hash)
  `).run();

  // 创建频道is_active索引（优化订阅查询）
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_is_active ON channels(is_active)
  `).run();

  // 创建源is_active索引（优化订阅查询）
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active)
  `).run();

  // 创建卡密表
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS codes (
      code TEXT PRIMARY KEY,
      status TEXT DEFAULT 'unused',
      duration_days INTEGER,
      activated_at DATETIME,
      expired_at DATETIME,
      max_ips INTEGER DEFAULT 3,
      remark TEXT,
      banned_until DATETIME
    )
  `).run();

  // 创建卡密状态索引
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_code_status ON codes(status)
  `).run();

  // 迁移：添加 banned_until 字段（如果不存在）
  try {
    await db.prepare('ALTER TABLE codes ADD COLUMN banned_until DATETIME').run();
    console.log('Migrated codes table: added banned_until column');
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
      console.error('Migration error:', e);
    }
  }

  // 创建配置表
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `).run();

  // 初始化默认配置（如果不存在）
  const defaultSettings = {
    'channel_daily_limit': '100',
    'ban_duration_days': '7',
    'auto_ban_on_exceed': 'true',
    // IP黑名单配置
    'sub_rate_min': '1',
    'sub_rate_hour': '60',
    'sub_rate_day': '500',
    'live_rate_min': '5',
    'live_rate_hour': '300',
    'live_rate_day': '2000',
    'admin_rate_hour': '10',
    // 首页展示配置（JSON格式）
    'homepage_display_config': '{}'
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    const existing = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
    if (!existing) {
      await db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').bind(key, value).run();
    }
  }

  console.log('Tables created successfully');
}

// 获取安全配置
export async function getSecurityConfig() {
  const db = getDB();
  const settings = await db.prepare('SELECT key, value FROM settings WHERE key IN (?, ?, ?)')
    .bind('channel_daily_limit', 'ban_duration_days', 'auto_ban_on_exceed')
    .all();

  const config = {
    channel_daily_limit: 100,
    ban_duration_days: 7,
    auto_ban_on_exceed: true
  };

  settings.results?.forEach(row => {
    if (row.key === 'channel_daily_limit') {
      config.channel_daily_limit = parseInt(row.value) || 100;
    } else if (row.key === 'ban_duration_days') {
      config.ban_duration_days = parseInt(row.value) || 7;
    } else if (row.key === 'auto_ban_on_exceed') {
      config.auto_ban_on_exceed = row.value === 'true';
    }
  });

  return config;
}

// 获取IP黑名单配置
export async function getIPBlacklistConfig() {
  const db = getDB();
  const settings = await db.prepare('SELECT key, value FROM settings WHERE key IN (?, ?, ?, ?, ?, ?, ?)')
    .bind('sub_rate_min', 'sub_rate_hour', 'sub_rate_day', 'live_rate_min', 'live_rate_hour', 'live_rate_day', 'admin_rate_hour')
    .all();

  const config = {
    sub_rate_min: 1,
    sub_rate_hour: 60,
    sub_rate_day: 500,
    live_rate_min: 5,
    live_rate_hour: 300,
    live_rate_day: 2000,
    admin_rate_hour: 10
  };

  settings.results?.forEach(row => {
    if (config.hasOwnProperty(row.key)) {
      config[row.key] = parseInt(row.value) || config[row.key];
    }
  });

  return config;
}

// 更新IP黑名单配置
export async function updateIPBlacklistConfig(config) {
  const db = getDB();

  const fields = ['sub_rate_min', 'sub_rate_hour', 'sub_rate_day', 'live_rate_min', 'live_rate_hour', 'live_rate_day', 'admin_rate_hour'];

  for (const field of fields) {
    if (config[field] !== undefined && config[field] > 0) {
      await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
        .bind(config[field].toString(), field)
        .run();
    }
  }
}

// 获取首页展示配置
export async function getHomepageDisplayConfig() {
  const db = getDB();
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('homepage_display_config').first();

  if (!result) {
    // 返回默认配置（空，表示展示所有）
    return {
      sources: [], // 启用的数据源ID列表，空表示全部
      groups: [],  // 启用的分类列表，空表示全部
      hosts: [],    // 启用的host列表，空表示全部
      hasHeaders: null, // null=全部, true=有请求头, false=无请求头
      manualHosts: [] // 手动添加的域名列表
    };
  }

  try {
    const config = JSON.parse(result.value);
    return {
      sources: config.sources || [],
      groups: config.groups || [],
      hosts: config.hosts || [],
      hasHeaders: config.hasHeaders !== undefined ? config.hasHeaders : null,
      manualHosts: config.manualHosts || []
    };
  } catch (e) {
    console.error('Failed to parse homepage_display_config:', e);
    return {
      sources: [],
      groups: [],
      hosts: [],
      hasHeaders: null,
      manualHosts: []
    };
  }
}

// 更新首页展示配置
export async function updateHomepageDisplayConfig(config) {
  const db = getDB();
  const configJson = JSON.stringify(config);
  await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
    .bind(configJson, 'homepage_display_config')
    .run();
}

// 更新安全配置
export async function updateSecurityConfig(config) {
  const db = getDB();

  if (config.channel_daily_limit !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.channel_daily_limit.toString(), 'channel_daily_limit')
      .run();
  }

  if (config.ban_duration_days !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.ban_duration_days.toString(), 'ban_duration_days')
      .run();
  }

  if (config.auto_ban_on_exceed !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.auto_ban_on_exceed.toString(), 'auto_ban_on_exceed')
      .run();
  }
}

// 解析M3U内容并提取频道信息
export async function parseM3UContent(content, sourceId, filter = {}) {
  const db = getDB();
  const channels = [];
  let globalHeaders = {};
  
  // 用于跟踪已处理的播放地址（过滤重复URL）
  const processedUrls = new Set();

  // 确保 sourceId 是整数
  sourceId = parseInt(sourceId);
  if (isNaN(sourceId) || sourceId <= 0) {
    throw new Error('Invalid source ID');
  }

  // 提取全局头部信息（User-Agent等）
  const extm3uMatch = content.match(/^#EXTM3U\s*(.*)$/m);
  if (extm3uMatch) {
    const extm3uLine = extm3uMatch[1];
    // 匹配 user-agent="..."
    const uaMatch = extm3uLine.match(/user-agent\s*=\s*"([^"]+)"/i);
    if (uaMatch) {
      globalHeaders['User-Agent'] = uaMatch[1];
    }
  }

  // 基于 #EXTINF 块进行分割
  const blocks = content.split(/^#EXTINF:/m);

  // 跳过第一个空块（#EXTM3U之前的部分）
  for (const block of blocks) {
    if (!block.trim()) continue;

    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    const currentChannel = {
      source_id: sourceId,
      headers: {...globalHeaders}
    };

    // 解析 EXTINF 行
    const extinfLine = '#EXTINF:' + lines[0];

    // 提取频道名称 - 改进：从最后一个逗号后提取，避免误匹配 URL 中的逗号
    const nameMatch = extinfLine.match(/,([^,\n]+)$/);
    if (nameMatch) {
      currentChannel.channel_name = nameMatch[1].trim();
    } else {
      // 如果没有找到频道名，尝试提取 tvg-id 作为备用
      const idMatch = extinfLine.match(/tvg-id="([^"]+)"/i);
      if (idMatch) {
        currentChannel.channel_name = idMatch[1].trim();
      } else {
        // 完全没有频道名，使用 "Unknown" 避免把 URL 当成频道名
        currentChannel.channel_name = 'Unknown';
        console.warn('[Sync] No channel name found for line:', extinfLine.substring(0, 100));
      }
    }

    // 提取组名
    const groupMatch = extinfLine.match(/group-title\s*=\s*"([^"]+)"/i);
    if (groupMatch) {
      currentChannel.group_title = groupMatch[1];
    }

    // 提取logo
    const logoMatch = extinfLine.match(/tvg-logo\s*=\s*"([^"]+)"/i);
    if (logoMatch) {
      currentChannel.logo = logoMatch[1];
    }

    // 提取 EXTINF 行内的 http-user-agent、ua、user_agent
    const uaMatch = extinfLine.match(/http-user-agent\s*=\s*"([^"]+)"/i);
    if (uaMatch) {
      currentChannel.headers['User-Agent'] = uaMatch[1];
    }
    const uaMatch2 = extinfLine.match(/ua\s*=\s*"([^"]+)"/i);
    if (uaMatch2) {
      currentChannel.headers['User-Agent'] = uaMatch2[1];
    }
    const uaMatch3 = extinfLine.match(/user_agent\s*=\s*"([^"]+)"/i);
    if (uaMatch3) {
      currentChannel.headers['User-Agent'] = uaMatch3[1];
    }

    // 提取 http-header (格式: http-header="Key=Value" 或 http-header="Key: Value")
    const httpHeaderMatch = extinfLine.match(/http-header\s*=\s*"([^"]+)"/i);
    if (httpHeaderMatch) {
      // 先尝试用 = 分割（APTV格式）
      let parts = httpHeaderMatch[1].split('=', 2);
      // 如果 = 分割不成功或值包含多个等号，尝试用 : 分割
      if (parts.length !== 2 || parts[0].trim() === '') {
        parts = httpHeaderMatch[1].split(':', 2);
      }
      if (parts.length === 2) {
        const headerKey = parts[0].trim();
        const headerValue = parts[1].trim();
        currentChannel.headers[headerKey] = headerValue;
      }
    }

    // 提取 Referer（支持 http-referer 和 referer 两种格式）
    const httpRefererMatch = extinfLine.match(/http-referer\s*=\s*"([^"]+)"/i);
    if (httpRefererMatch) {
      currentChannel.headers['Referer'] = httpRefererMatch[1];
    }
    const refererMatch = extinfLine.match(/(?:^|[^-])referer\s*=\s*"([^"]+)"/i);
    if (refererMatch) {
      currentChannel.headers['Referer'] = refererMatch[1];
    }

    // 查找 URL 行（第一个非 # 开头的行）
    let urlLine = null;
    let vlcOptProcessed = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      // 处理 EXTVLCOPT 行（在 URL 之前）
      if (!vlcOptProcessed && line.startsWith('#EXTVLCOPT:')) {
        // 提取 http-user-agent
        const vlcUAMatch = line.match(/http-user-agent\s*=\s*([^\s]+)/i);
        if (vlcUAMatch) {
          currentChannel.headers['User-Agent'] = vlcUAMatch[1];
        }
        // 提取 Referer
        const vlcRefererMatch = line.match(/http-referrer\s*=\s*([^\s]+)/i);
        if (vlcRefererMatch) {
          currentChannel.headers['Referer'] = vlcRefererMatch[1];
        }
        vlcOptProcessed = true;
        continue;
      }

      // 找到 URL 行
      if (!line.startsWith('#') && line) {
        urlLine = line;
        break;
      }
    }

    if (!urlLine) continue;

    currentChannel.play_url = urlLine;

    // 提取URL中的参数（User-Agent等）
    try {
      const urlObj = new URL(urlLine);
      if (urlObj.searchParams.has('User-Agent')) {
        currentChannel.headers['User-Agent'] = urlObj.searchParams.get('User-Agent');
      }
    } catch (e) {
      // 忽略URL解析错误
    }

    // 应用过滤条件（如果提供了）
    if (filter) {
      // 过滤分组名
      if (filter.excludeGroups && filter.excludeGroups.length > 0) {
        if (currentChannel.group_title && filter.excludeGroups.some(keyword =>
          currentChannel.group_title.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding group: "${currentChannel.group_title}" (matched keyword: ${filter.excludeGroups.find(k => currentChannel.group_title.toLowerCase().includes(k.toLowerCase()))})`);
          continue;
        }
      }

      // 过滤播放地址
      if (filter.excludeUrls && filter.excludeUrls.length > 0) {
        if (currentChannel.play_url && filter.excludeUrls.some(keyword =>
          currentChannel.play_url.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding URL: "${currentChannel.play_url}" (matched keyword: ${filter.excludeUrls.find(k => currentChannel.play_url.toLowerCase().includes(k.toLowerCase()))})`);
          continue;
        }
      }

      // 过滤频道名
      if (filter.excludeNames && filter.excludeNames.length > 0) {
        if (currentChannel.channel_name && filter.excludeNames.some(keyword =>
          currentChannel.channel_name.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding channel: "${currentChannel.channel_name}" (matched keyword: ${filter.excludeNames.find(k => currentChannel.channel_name.toLowerCase().includes(k.toLowerCase()))})`);
          continue;
        }
      }

      // 过滤重复播放地址
      if (filter.excludeDuplicateUrls && currentChannel.play_url) {
        if (processedUrls.has(currentChannel.play_url)) {
          console.log(`[Filter] Excluding duplicate URL: "${currentChannel.play_url}"`);
          continue;
        }
        processedUrls.add(currentChannel.play_url);
      }

      // 分组重命名逻辑
      if (currentChannel.group_title && filter.groupRenameRules && filter.groupRenameRules.length > 0) {
        // 检查是否在排除列表中
        const shouldExclude = filter.groupRenameExclude && filter.groupRenameExclude.length > 0 &&
          filter.groupRenameExclude.some(exclude => 
            currentChannel.group_title.toLowerCase().includes(exclude.toLowerCase())
          );
        
        if (!shouldExclude) {
          // 应用重命名规则（按优先级匹配第一个）
          for (const rule of filter.groupRenameRules) {
            if (currentChannel.group_title.toLowerCase().includes(rule.keyword.toLowerCase())) {
              const originalGroup = currentChannel.group_title;
              currentChannel.group_title = rule.newName;
              console.log(`[Group Rename] "${originalGroup}" -> "${rule.newName}" (matched keyword: "${rule.keyword}")`);
              break; // 只应用第一个匹配的规则
            }
          }
        }
      }
    }

    // 生成channel_hash (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(urlLine);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    currentChannel.channel_hash = hashHex.substring(0, 8); // 取前8位

    // 确保所有字段都有值，避免 null/undefined 导致类型错误
    currentChannel.channel_name = currentChannel.channel_name || 'Unknown';
    currentChannel.group_title = currentChannel.group_title || '';
    currentChannel.logo = currentChannel.logo || '';

    // 将headers转为JSON字符串（如果为空则存空对象）
    currentChannel.headers = Object.keys(currentChannel.headers).length > 0
      ? JSON.stringify(currentChannel.headers)
      : JSON.stringify({});

    // 数据验证：限制字段长度（D1 单行限制约 1MB）
    if (currentChannel.channel_name && currentChannel.channel_name.length > 500) {
      currentChannel.channel_name = currentChannel.channel_name.substring(0, 500);
    }
    if (currentChannel.play_url && currentChannel.play_url.length > 2000) {
      console.warn(`[Sync] URL too long, truncating: ${currentChannel.play_url.substring(0, 50)}...`);
      continue; // 跳过过长的URL
    }
    if (currentChannel.logo && currentChannel.logo.length > 500) {
      currentChannel.logo = currentChannel.logo.substring(0, 500);
    }

    channels.push(currentChannel);
  }

  // 批量插入频道，使用 batch 减少API调用
  if (channels.length > 0) {
    const BATCH_SIZE = 500; // 每批500条
    let processedCount = 0;

    for (let i = 0; i < channels.length; i += BATCH_SIZE) {
      const batch = channels.slice(i, i + BATCH_SIZE);
      const statements = batch.map(channel =>
        db.prepare(`
          INSERT INTO channels (source_id, channel_name, group_title, logo, play_url, headers, channel_hash, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          channel.source_id,
          channel.channel_name,
          channel.group_title || '',
          channel.logo || '',
          channel.play_url,
          channel.headers,
          channel.channel_hash,
          1  // is_active 使用数字1
        )
      );

      try {
        await db.batch(statements);
        processedCount += batch.length;
        console.log(`[Sync] Batch processed: ${processedCount}/${channels.length}`);
      } catch (batchError) {
        console.error(`[Sync] Batch insert error at batch ${i}:`, batchError);
        // 记录第一个失败的数据用于调试
        if (batch.length > 0) {
          console.error('[Sync] First channel data:', batch[0]);
        }
        throw batchError;
      }
    }
  }

  return channels.length;
}

// 从远程URL获取M3U内容并解析
export async function fetchAndParseM3U(sourceUrl, sourceId, filter = null) {
  try {
    console.log(`[Sync] Fetching M3U from: ${sourceUrl}`);
    if (filter) {
      console.log(`[Sync] Filters:`, filter);
    }
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    console.log(`[Sync] M3U content size: ${content.length} bytes`);

    const channelCount = await parseM3UContent(content, sourceId, filter);

    // 更新源的最后更新时间（使用 JavaScript 生成当前时间）
    const db = getDB();
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sources SET last_updated = ? WHERE id = ?
    `).bind(now, sourceId).run();

    console.log(`[Sync] Successfully parsed ${channelCount} channels`);
    return { success: true, channelCount };
  } catch (error) {
    console.error(`[Sync] Error fetching and parsing M3U: ${error.message}`);
    console.error(`[Sync] Stack:`, error.stack);
    return { success: false, error: error.message };
  }
}
