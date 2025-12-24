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
      remark TEXT
    )
  `).run();

  // 创建卡密状态索引
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_code_status ON codes(status)
  `).run();

  console.log('Tables created successfully');
}

// 解析M3U内容并提取频道信息
export async function parseM3UContent(content, sourceId) {
  const db = getDB();
  const lines = content.split('\n');
  const channels = [];
  let currentChannel = {};
  let globalHeaders = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 解析全局头部信息
    if (line.startsWith('#EXTM3U')) {
      // 提取全局UA等
      const uaMatch = line.match(/user-agent="([^"]+)"/i);
      if (uaMatch) {
        globalHeaders['User-Agent'] = uaMatch[1];
      }
      continue;
    }

    // 解析频道信息
    if (line.startsWith('#EXTINF:')) {
      // 重置当前频道
      currentChannel = {
        source_id: sourceId,
        headers: {...globalHeaders}
      };

      // 提取频道名称
      const nameMatch = line.match(/,(.+)$/);
      if (nameMatch) {
        currentChannel.channel_name = nameMatch[1];
      }

      // 提取组名
      const groupMatch = line.match(/group-title="([^"]+)"/i);
      if (groupMatch) {
        currentChannel.group_title = groupMatch[1];
      }

      // 提取logo
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      if (logoMatch) {
        currentChannel.logo = logoMatch[1];
      }

      // 检查下一行是否有EXTVLCOPT
      if (i + 1 < lines.length && lines[i + 1].startsWith('#EXTVLCOPT:')) {
        const vlcOptMatch = lines[i + 1].match(/http-user-agent=([^\s]+)/i);
        if (vlcOptMatch) {
          currentChannel.headers['User-Agent'] = vlcOptMatch[1];
        }
        i++; // 跳过已处理的EXTVLCOPT行
      }
    } 
    // 处理URL行
    else if (line && !line.startsWith('#') && currentChannel.channel_name) {
      currentChannel.play_url = line;

      // 提取URL中的参数
      try {
        const urlObj = new URL(line);
        if (urlObj.searchParams.has('User-Agent')) {
          currentChannel.headers['User-Agent'] = urlObj.searchParams.get('User-Agent');
        }
      } catch (e) {
        // 忽略URL解析错误
      }

      // 生成channel_hash (MD5)
      const encoder = new TextEncoder();
      const data = encoder.encode(line);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      currentChannel.channel_hash = hashHex.substring(0, 8); // 取前8位

      // 将headers转为JSON字符串
      currentChannel.headers = JSON.stringify(currentChannel.headers);

      channels.push(currentChannel);
      currentChannel = {};
    }
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

    // 更新源的最后更新时间
    const db = getDB();
    db.prepare(`
      UPDATE sources SET last_updated = datetime('now') WHERE id = ?
    `).bind(sourceId).run();

    return { success: true, channelCount };
  } catch (error) {
    console.error('Error fetching and parsing M3U:', error);
    return { success: false, error: error.message };
  }
}
