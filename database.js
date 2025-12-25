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
    'auto_ban_on_exceed': 'true'
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
export async function parseM3UContent(content, sourceId) {
  const db = getDB();
  const channels = [];
  let globalHeaders = {};

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

    // 提取频道名称
    const nameMatch = extinfLine.match(/,(.+)$/);
    if (nameMatch) {
      currentChannel.channel_name = nameMatch[1].trim();
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

    // 提取 Referer
    const refererMatch = extinfLine.match(/referer\s*=\s*"([^"]+)"/i);
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

    // 生成channel_hash (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(urlLine);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    currentChannel.channel_hash = hashHex.substring(0, 8); // 取前8位

    // 将headers转为JSON字符串（如果为空则存空对象）
    currentChannel.headers = Object.keys(currentChannel.headers).length > 0
      ? JSON.stringify(currentChannel.headers)
      : JSON.stringify({});

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
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `).bind(
          channel.source_id,
          channel.channel_name,
          channel.group_title || '',
          channel.logo || '',
          channel.play_url,
          channel.headers,
          channel.channel_hash
        )
      );

      await db.batch(statements);
      processedCount += batch.length;
      console.log(`Batch processed: ${processedCount}/${channels.length}`);
    }
  }

  return channels.length;
}

// 从远程URL获取M3U内容并解析
export async function fetchAndParseM3U(sourceUrl, sourceId) {
  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U: ${response.status}`);
    }

    const content = await response.text();
    const channelCount = await parseM3UContent(content, sourceId);

    // 更新源的最后更新时间（使用 JavaScript 生成当前时间）
    const db = getDB();
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sources SET last_updated = ? WHERE id = ?
    `).bind(now, sourceId).run();

    return { success: true, channelCount };
  } catch (error) {
    console.error('Error fetching and parsing M3U:', error);
    return { success: false, error: error.message };
  }
}
