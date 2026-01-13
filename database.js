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

/**
 * 生成免费订阅播放令牌（简化版，用于免费订阅）
 * @param {string} channelHash - 频道哈希
 * @param {string} subId - 订阅ID
 * @returns {string} 令牌
 */
export function generateFreeSubPlayToken(channelHash, subId) {
  const timestamp = Date.now();
  const data = `${channelHash}|${subId}|${timestamp}`;
  // 使用简单的base64编码
  const hash = btoa(data);
  return hash;
}

/**
 * 验证免费订阅播放令牌
 * @param {string} token - 令牌
 * @param {string} channelHash - 频道哈希
 * @param {string} subId - 订阅ID
 * @param {number} maxAge - 最大有效期（毫秒），默认1小时
 * @returns {boolean} 是否有效
 */
export function verifyFreeSubPlayToken(token, channelHash, subId, maxAge = 60 * 60 * 1000) {
  try {
    const data = atob(token);
    const parts = data.split('|');

    if (parts.length !== 3) {
      return false;
    }

    const [hashChannelHash, hashSubId, hashTimestamp] = parts;

    // 验证频道哈希
    if (hashChannelHash !== channelHash) {
      return false;
    }

    // 验证订阅ID
    if (hashSubId !== subId) {
      return false;
    }

    // 验证时间戳
    const timestamp = parseInt(hashTimestamp, 10);
    const now = Date.now();

    if (isNaN(timestamp) || now - timestamp > maxAge) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('[verifyFreeSubPlayToken] Error:', error);
    return false;
  }
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

  // 创建source_id索引（优化删除操作和JOIN查询）
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_source_id ON channels(source_id)
  `).run();

  // 创建group_title索引（优化分组查询）
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_group_title ON channels(group_title)
  `).run();

  // 创建is_active+source_id组合索引（优化频道列表查询）
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_active_source ON channels(is_active, source_id)
  `).run();

  // 创建group_title优化索引（优化DISTINCT查询）
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_group_title_optimized ON channels(group_title, is_active)
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
    'homepage_display_config': '{}',
    // 系统安全配置
    'enable_ref_check': 'false',
    'ref_whitelist': '',
    'enable_play_token': 'true',
    'play_token_expire_seconds': '3600',
    'enable_ip_bind': 'true',
    'enable_burn_after_read': 'true',
    // URL加密配置
    'enable_url_encryption': 'false',
    'url_encryption_key': '',
    // 调试防护配置
    'enable_anti_debug': 'false',
    'disable_console_logs': 'false',
    // 同步过滤规则配置（JSON格式）
    'sync_filter_config': '{}'
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    const existing = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
    if (!existing) {
      await db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').bind(key, value).run();
    }
  }

  // 创建播放记录表（只记录IP用于并发检测，10分钟后自动清理）
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS play_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      channel_hash TEXT NOT NULL,
      client_ip TEXT,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_date DATE DEFAULT (DATE('now'))
    )
  `).run();

  // 创建播放记录索引
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_play_logs_code ON play_logs(code)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_play_logs_code_date ON play_logs(code, created_date)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_play_logs_code_hash_date ON play_logs(code, channel_hash, created_date)').run();

  // 创建播放计数表（每个频道每天只有1条记录）
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS play_counts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      channel_hash TEXT NOT NULL,
      play_count INTEGER DEFAULT 0,
      created_date DATE DEFAULT (DATE('now')),
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(code, channel_hash, created_date)
    )
  `).run();

  // 创建播放计数索引
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_play_counts_unique ON play_counts(code, channel_hash, created_date)').run();

  // 创建IP访问记录表
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ip_access_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      path TEXT NOT NULL,
      request_count INTEGER DEFAULT 1,
      first_access DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_access DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_date DATE DEFAULT (DATE('now'))
    )
  `).run();

  // 创建IP访问记录索引
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_ip_access_logs_ip_date ON ip_access_logs(ip, created_date)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_ip_access_logs_ip_path_date ON ip_access_logs(ip, path, created_date)').run();

  // 创建IP黑名单表
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ip_blacklist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL UNIQUE,
      banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reason TEXT,
      details TEXT,
      permanent BOOLEAN DEFAULT 1
    )
  `).run();

  // 创建IP黑名单索引
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_ip_blacklist_ip ON ip_blacklist(ip)').run();

  // 创建已使用token表
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS used_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME
    )
  `).run();

  // 创建已使用token索引
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_used_tokens_token ON used_tokens(token)').run();

  // 创建公告表
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      enabled BOOLEAN DEFAULT 1,
      display_frequency TEXT DEFAULT 'once',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // 迁移：添加 display_frequency 字段（如果不存在）
  try {
    await db.prepare('ALTER TABLE announcements ADD COLUMN display_frequency TEXT DEFAULT \'once\'').run();
    console.log('Migrated announcements table: added display_frequency column');
  } catch (e) {
    // 字段已存在，忽略错误
    if (!e.message.includes('duplicate column name')) {
      console.error('Migration error:', e);
    }
  }

  // 创建公告索引
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_announcements_enabled ON announcements(enabled)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_announcements_updated ON announcements(updated_at DESC)').run();

  // 创建订阅IP记录表（记录卡密的订阅IP，用于验证播放请求）
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS subscription_ips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        client_ip TEXT NOT NULL,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_date DATE DEFAULT (DATE('now'))
      )
    `).run();
    console.log('Database: subscription_ips table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create subscription_ips table:', e);
  }

  try {
    // 创建订阅IP记录索引
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_subscription_ips_code_date ON subscription_ips(code, created_date)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_subscription_ips_code_ip_date ON subscription_ips(code, client_ip, created_date)').run();
    console.log('Database: subscription_ips indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create subscription_ips indexes:', e);
  }

  // 创建广告TS文件表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS ad_ts_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        content TEXT NOT NULL,
        ad_type TEXT DEFAULT 'normal',
        description TEXT,
        is_active BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    console.log('Database: ad_ts_files table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create ad_ts_files table:', e);
  }

  // 创建广告TS文件索引
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_ts_files_active ON ad_ts_files(is_active)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_ts_files_type_active ON ad_ts_files(ad_type, is_active)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_ts_files_updated ON ad_ts_files(updated_at DESC)').run();
    console.log('Database: ad_ts_files indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create ad_ts_files indexes:', e);
  }

  // 检查并添加缺失的列（用于迁移旧数据库）
  try {
    // 检查 ad_ts_files 表结构
    const tableInfo = await db.prepare('PRAGMA table_info(ad_ts_files)').all();
    const columns = tableInfo.results || [];

    const hasAdTypeColumn = columns.some(col => col.name === 'ad_type');
    const hasIsActiveColumn = columns.some(col => col.name === 'is_active');
    const hasDescriptionColumn = columns.some(col => col.name === 'description');

    if (!hasAdTypeColumn) {
      await db.prepare('ALTER TABLE ad_ts_files ADD COLUMN ad_type TEXT DEFAULT "normal"').run();
      console.log('Database: Added ad_type column to ad_ts_files table');
    }

    if (!hasIsActiveColumn) {
      await db.prepare('ALTER TABLE ad_ts_files ADD COLUMN is_active INTEGER DEFAULT 0').run();
      console.log('Database: Added is_active column to ad_ts_files table');
    }

    if (!hasDescriptionColumn) {
      await db.prepare('ALTER TABLE ad_ts_files ADD COLUMN description TEXT').run();
      console.log('Database: Added description column to ad_ts_files table');
    }
  } catch (e) {
    console.error('Database: Failed to migrate ad_ts_files table:', e);
  }

  // 创建广告绑定表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS ad_bindings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        ad_id INTEGER,
        cooldown_seconds INTEGER DEFAULT 0,
        priority INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(ad_id) REFERENCES ad_ts_files(id) ON DELETE SET NULL
      )
    `).run();
    console.log('Database: ad_bindings table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create ad_bindings table:', e);
  }

  // 创建广告绑定索引
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_bindings_action ON ad_bindings(action_type)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_bindings_priority ON ad_bindings(priority DESC)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_bindings_ad_id ON ad_bindings(ad_id)').run();
    console.log('Database: ad_bindings indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create ad_bindings indexes:', e);
  }

  // 创建广告播放日志表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS ad_play_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        client_ip TEXT NOT NULL,
        played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_date DATE DEFAULT (DATE('now'))
      )
    `).run();
    console.log('Database: ad_play_logs table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create ad_play_logs table:', e);
  }

  // 创建广告播放日志索引
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_play_logs_action_ip_date ON ad_play_logs(action_type, client_ip, created_date)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_play_logs_played_at ON ad_play_logs(played_at DESC)').run();
    console.log('Database: ad_play_logs indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create ad_play_logs indexes:', e);
  }

  // 创建免费订阅表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS free_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sub_id TEXT NOT NULL UNIQUE,
        ip TEXT NOT NULL,
        fingerprint TEXT NOT NULL,
        fingerprint_components TEXT NOT NULL,
        expired_at DATETIME NOT NULL,
        total_days INTEGER DEFAULT 7,
        consecutive_days INTEGER DEFAULT 1,
        ip_change_count INTEGER DEFAULT 0,
        ip_updated_at DATETIME,
        last_checkin DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    console.log('Database: free_subscriptions table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create free_subscriptions table:', e);
  }

  // 创建免费订阅索引
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_free_subscriptions_sub_id ON free_subscriptions(sub_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_free_subscriptions_ip ON free_subscriptions(ip)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_free_subscriptions_fingerprint ON free_subscriptions(fingerprint)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_free_subscriptions_expired_at ON free_subscriptions(expired_at)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_free_subscriptions_ip_fingerprint ON free_subscriptions(ip, fingerprint)').run();
    console.log('Database: free_subscriptions indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create free_subscriptions indexes:', e);
  }

  // 创建签到记录表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS checkin_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscription_id INTEGER NOT NULL,
        checkin_date TEXT NOT NULL,
        reward_days INTEGER DEFAULT 1,
        consecutive_days INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(subscription_id) REFERENCES free_subscriptions(id) ON DELETE CASCADE,
        UNIQUE(subscription_id, checkin_date)
      )
    `).run();
    console.log('Database: checkin_records table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create checkin_records table:', e);
  }

  // 创建签到记录索引
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_checkin_records_subscription_id ON checkin_records(subscription_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_checkin_records_date ON checkin_records(checkin_date DESC)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_checkin_records_subscription_date ON checkin_records(subscription_id, checkin_date)').run();
    console.log('Database: checkin_records indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create checkin_records indexes:', e);
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

// 获取系统安全配置
export async function getSystemConfig() {
  const db = getDB();
  const settings = await db.prepare('SELECT key, value FROM settings WHERE key IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind('enable_ref_check', 'ref_whitelist', 'enable_play_token', 'play_token_expire_seconds', 'homepage_display_config', 'enable_ip_bind', 'enable_burn_after_read', 'enable_url_encryption', 'url_encryption_key', 'enable_anti_debug', 'disable_console_logs')
    .all();

  const config = {
    enable_ref_check: false,
    ref_whitelist: '',
    enable_play_token: false,
    play_token_expire_seconds: 3600,
    homepage_display_config: {},
    enable_ip_bind: false,
    enable_burn_after_read: false,
    enable_url_encryption: false,
    url_encryption_key: '',
    enable_anti_debug: false,
    disable_console_logs: false
  };

  settings.results?.forEach(row => {
    if (row.key === 'enable_ref_check') {
      config.enable_ref_check = row.value === 'true';
    } else if (row.key === 'ref_whitelist') {
      config.ref_whitelist = row.value || '';
    } else if (row.key === 'enable_play_token') {
      config.enable_play_token = row.value === 'true';
    } else if (row.key === 'play_token_expire_seconds') {
      config.play_token_expire_seconds = parseInt(row.value) || 3600;
    } else if (row.key === 'homepage_display_config') {
      try {
        config.homepage_display_config = JSON.parse(row.value);
      } catch (e) {
        config.homepage_display_config = {};
      }
    } else if (row.key === 'enable_ip_bind') {
      config.enable_ip_bind = row.value === 'true';
    } else if (row.key === 'enable_burn_after_read') {
      config.enable_burn_after_read = row.value === 'true';
    } else if (row.key === 'enable_url_encryption') {
      config.enable_url_encryption = row.value === 'true';
    } else if (row.key === 'url_encryption_key') {
      config.url_encryption_key = row.value || '';
    } else if (row.key === 'enable_anti_debug') {
      config.enable_anti_debug = row.value === 'true';
    } else if (row.key === 'disable_console_logs') {
      config.disable_console_logs = row.value === 'true';
    }
  });

  return config;
}

// 获取同步过滤规则配置
export async function getSyncFilterConfig() {
  const db = getDB();
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('sync_filter_config').first();

  if (!result) {
    // 返回默认配置（空，表示不过滤）
    return {
      excludeGroups: [],
      excludeUrls: [],
      excludeNames: [],
      excludeDuplicateUrls: false,
      groupRenameRules: [],
      groupRenameExclude: []
    };
  }

  try {
    return JSON.parse(result.value);
  } catch (e) {
    console.error('Failed to parse sync_filter_config:', e);
    return {
      excludeGroups: [],
      excludeUrls: [],
      excludeNames: [],
      excludeDuplicateUrls: false,
      groupRenameRules: [],
      groupRenameExclude: []
    };
  }
}

// 更新同步过滤规则配置
export async function updateSyncFilterConfig(config) {
  const db = getDB();
  const configJson = JSON.stringify(config);

  // 检查配置是否存在
  const existing = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('sync_filter_config').first();

  if (existing) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(configJson, 'sync_filter_config')
      .run();
  } else {
    await db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)')
      .bind('sync_filter_config', configJson)
      .run();
  }
}

// 更新系统安全配置
export async function updateSystemConfig(config) {
  const db = getDB();

  if (config.enable_ref_check !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.enable_ref_check.toString(), 'enable_ref_check')
      .run();
  }

  if (config.ref_whitelist !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.ref_whitelist || '', 'ref_whitelist')
      .run();
  }

  if (config.enable_play_token !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.enable_play_token.toString(), 'enable_play_token')
      .run();
  }

  if (config.play_token_expire_seconds !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.play_token_expire_seconds.toString(), 'play_token_expire_seconds')
      .run();
  }

  if (config.enable_ip_bind !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.enable_ip_bind.toString(), 'enable_ip_bind')
      .run();
  }

  if (config.enable_burn_after_read !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.enable_burn_after_read.toString(), 'enable_burn_after_read')
      .run();
  }

  if (config.enable_url_encryption !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.enable_url_encryption.toString(), 'enable_url_encryption')
      .run();
  }

  if (config.url_encryption_key !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.url_encryption_key || '', 'url_encryption_key')
      .run();
  }

  if (config.enable_anti_debug !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.enable_anti_debug.toString(), 'enable_anti_debug')
      .run();
  }

  if (config.disable_console_logs !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.disable_console_logs.toString(), 'disable_console_logs')
      .run();
  }
}

// 生成随机加密密钥
export function generateEncryptionKey(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// 生成播放token（HMAC签名，带随机数防重放，IP绑定）
export async function generatePlayToken(channelHash, clientIp, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomUUID(); // 添加随机数防重放
  
  // 将IP地址哈希后嵌入nonce中（服务器验证时对比真实IP）
  const ipEncoder = new TextEncoder();
  const ipHashBuffer = await crypto.subtle.digest('SHA-256', ipEncoder.encode(clientIp || 'unknown'));
  const ipHashArray = Array.from(new Uint8Array(ipHashBuffer));
  const ipHash = ipHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(`${channelHash}:${timestamp}:${nonce}`);
  
  // 使用crypto.subtle.sign创建HMAC
  const keyData = encoder.encode(secret || 'default-secret-key');
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  ).then(key => {
    return crypto.subtle.sign('HMAC', key, data);
  }).then(signature => {
    const signatureArray = Array.from(new Uint8Array(signature));
    const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // 格式: channelHash:timestamp:nonce:ipHash:signatureHex
    return `${channelHash}:${timestamp}:${nonce}:${ipHash}:${signatureHex}`;
  });
}

// 验证播放token（阅后即焚 + IP绑定）
export async function verifyPlayToken(token, secret, env, request, db = null) {
  try {
    const parts = token.split(':');
    if (parts.length !== 5) {
      console.log('[Token] Invalid token format');
      return false;
    }

    const [channelHash, timestampStr, nonce, ipHash, signature] = parts;
    const timestamp = parseInt(timestampStr);
    const now = Math.floor(Date.now() / 1000);

    // 获取系统配置
    const config = await getSystemConfig();
    const expireSeconds = config.play_token_expire_seconds || 3600;

    // 验证token是否过期
    if (now - timestamp > expireSeconds) {
      console.log('[Token] Token expired');
      return false;
    }

    // 验证IP绑定（请求者的IP必须与生成token时的IP一致）
    if (request && config.enable_ip_bind !== false) {
      const clientIp = request.headers.get('CF-Connecting-IP') ||
                      request.headers.get('X-Forwarded-For')?.split(',')[0] ||
                      'unknown';

      const ipEncoder = new TextEncoder();
      const requestIpHashBuffer = await crypto.subtle.digest('SHA-256', ipEncoder.encode(clientIp || 'unknown'));
      const requestIpHashArray = Array.from(new Uint8Array(requestIpHashBuffer));
      const requestIpHash = requestIpHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (requestIpHash !== ipHash) {
        console.log('[Token] IP mismatch (anti-proxy protection)', { expected: ipHash.substring(0, 8), got: requestIpHash.substring(0, 8) });
        return false;
      }
    }

    // 检查是否已被使用（数据库存储，阅后即焚）
    if (db && config.enable_burn_after_read !== false) {
      const usedResult = await db.prepare(`
        SELECT id FROM used_tokens WHERE token = ?
      `).bind(token).first();

      if (usedResult) {
        console.log('[Token] Token already used (replay attack prevented)', { token: token.substring(0, 30) + '...' });
        return false;
      }
    }

    // 验证签名
    const encoder = new TextEncoder();
    const data = encoder.encode(`${channelHash}:${timestampStr}:${nonce}`);
    const keyData = encoder.encode(secret || 'default-secret-key');

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureArray = new Uint8Array(signature.match(/.{2}/g).map(byte => parseInt(byte, 16)));
    const isValid = await crypto.subtle.verify('HMAC', key, signatureArray, data);

    if (!isValid) {
      console.log('[Token] Invalid signature');
      return false;
    }

    // 验证通过后，立即标记为已使用（阅后即焚）
    if (db && config.enable_burn_after_read !== false) {
      await db.prepare(`
        INSERT INTO used_tokens (token, used_at, expires_at)
        VALUES (?, CURRENT_TIMESTAMP, datetime('now', '+' || ? || ' seconds'))
      `).bind(token, expireSeconds).run();
      console.log('[Token] Token marked as used (burn after read)', { token, expireSeconds });
    }

    return true;
  } catch (e) {
    console.error('Token verification error:', e);
    return false;
  }
}

// 验证Referrer
export function verifyReferer(referer, whitelist) {
  if (!whitelist || whitelist.trim() === '') return true;
  
  const allowedDomains = whitelist.split(',').map(d => d.trim()).filter(d => d);
  if (allowedDomains.length === 0) return true;

  if (!referer) return false;

  try {
    const refererUrl = new URL(referer);
    return allowedDomains.some(domain => {
      if (domain === '*') return true;
      return refererUrl.hostname === domain || refererUrl.hostname.endsWith('.' + domain);
    });
  } catch (e) {
    return false;
  }
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

// 规范化频道名称（如CCTV等格式）
function normalizeChannelName(name) {
  if (!name) return name;

  // CCTV格式规范化：cctv[-\s+]?(\d{1,2})(\+)? 后续可选中文/英文/数字/空格/横线
  const cctvRegex = /^cctv[-\s+]?(\d{1,2})(\+)?\b([\u4e00-\u9fa5A-Za-z0-9\s-]*)?/iu;
  
  const match = name.match(cctvRegex);
  if (match) {
    const num = parseInt(match[1]);
    const plus = match[2] || '';
    // 只规范化1-17的CCTV频道
    if (num >= 1 && num <= 17) {
      const newName = 'CCTV' + num + plus;
      if (match[3] && match[3].trim()) {
        // 保留后缀内容（如"高清"、"4K"等）
        return newName + match[3];
      }
      return newName;
    }
  }

  return name;
}

// 自定义排序函数：英文 -> 数字 -> 中文（数字按数值大小排序）
function customChannelSort(a, b) {
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
  console.log(`[Sync] Found ${blocks.length - 1} potential channels in M3U`);

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
      // 规范化频道名（CCTV等格式）
      currentChannel.channel_name = normalizeChannelName(currentChannel.channel_name);
    } else {
      // 如果没有找到频道名，尝试提取 tvg-id 作为备用
      const idMatch = extinfLine.match(/tvg-id="([^"]+)"/i);
      if (idMatch) {
        currentChannel.channel_name = idMatch[1].trim();
        // 规范化频道名
        currentChannel.channel_name = normalizeChannelName(currentChannel.channel_name);
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
  console.log(`[Sync] Starting batch insert for ${channels.length} channels`);

  // 对频道按分组内进行排序（英文 -> 数字 -> 中文）
  if (channels.length > 0) {
    // 先按分组名排序
    channels.sort((a, b) => {
      const groupA = a.group_title || '';
      const groupB = b.group_title || '';
      if (groupA !== groupB) {
        return groupA.localeCompare(groupB, 'zh-CN', { numeric: true });
      }
      // 同一分组内使用自定义排序
      return customChannelSort(a, b);
    });
    console.log(`[Sync] Channels sorted`);
  }

  if (channels.length > 0) {
    const BATCH_SIZE = 500; // 每批500条
    let processedCount = 0;

    // 使用事务确保数据一致性
    try {
      // 开始事务
      await db.batch([db.prepare('BEGIN TRANSACTION')]);
      console.log(`[Sync] Transaction started for source ${sourceId}`);

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
          // 回滚事务
          await db.batch([db.prepare('ROLLBACK')]);
          console.log(`[Sync] Transaction rolled back for source ${sourceId}`);
          throw batchError;
        }
      }

      // 提交事务
      await db.batch([db.prepare('COMMIT')]);
      console.log(`[Sync] Transaction committed for source ${sourceId}, ${processedCount} channels inserted`);
    } catch (transactionError) {
      console.error(`[Sync] Transaction error for source ${sourceId}:`, transactionError);
      throw transactionError;
    }
  }

  console.log(`[Sync] Parse completed, returning ${channels.length} channels`);
  return channels.length;
}

// 从远程URL获取M3U内容并解析
export async function fetchAndParseM3U(sourceUrl, sourceId, filter = null) {
  try {
    console.log(`[Sync] Fetching M3U from: ${sourceUrl} for source ID: ${sourceId}`);
    if (filter) {
      console.log(`[Sync] Filters:`, filter);
    }
    
    const fetchStartTime = Date.now();
    const response = await fetch(sourceUrl);
    const fetchEndTime = Date.now();
    console.log(`[Sync] Fetch completed in ${fetchEndTime - fetchStartTime}ms`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    console.log(`[Sync] M3U content size: ${content.length} bytes`);
    
    // 检查内容是否为空或格式不正确
    if (!content || !content.startsWith('#EXTM3U')) {
      console.error(`[Sync] Invalid M3U content: starts with ${content ? content.substring(0, 50) : 'empty'}...`);
      throw new Error('Invalid M3U content');
    }

    const parseStartTime = Date.now();
    const channelCount = await parseM3UContent(content, sourceId, filter);
    const parseEndTime = Date.now();
    console.log(`[Sync] Parse completed in ${parseEndTime - parseStartTime}ms`);

    // 更新源的最后更新时间（使用 JavaScript 生成当前时间）
    const db = getDB();
    const now = new Date().toISOString();
    await db.prepare(`
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

// ========== AES-GCM 加密/解密函数 ==========

// AES-GCM 加密函数
export async function encryptWithAES(text, secret) {
  try {
    // 从密钥派生加密密钥
    const keyData = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // 生成随机 IV (12 bytes for GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const textData = new TextEncoder().encode(text);

    // 加密
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      textData
    );

    // 将 IV 和加密数据合并，然后转为 Base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // 转为 Base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('AES 加密失败:', error);
    throw error;
  }
}

// AES-GCM 解密函数
export async function decryptWithAES(encryptedBase64, secret) {
  try {
    // 从密钥派生加密密钥
    const keyData = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    // 从 Base64 解码
    const binaryString = atob(encryptedBase64);
    const combined = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i);
    }

    // 分离 IV (前 12 bytes)
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    // 解密
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('AES 解密失败:', error);
    throw error;
  }
}

// 获取当前活跃的广告TS文件
export async function getActiveAdTsFile(adType = null) {
  const db = getDB();

  let query = 'SELECT * FROM ad_ts_files WHERE is_active = 1';
  const params = [];

  if (adType) {
    query += ' AND ad_type = ?';
    params.push(adType);
  }

  // 获取所有符合条件的活跃广告
  const adTsFiles = await db.prepare(query).bind(...params).all();
  const ads = adTsFiles.results || [];

  if (ads.length === 0) {
    return null;
  }

  // 随机选择一个广告
  const randomIndex = Math.floor(Math.random() * ads.length);
  return ads[randomIndex];
}

/**
 * 获取广告绑定配置
 * @param {string} actionType - 操作类型
 * @returns {object|null} 广告绑定配置
 */
export async function getAdBinding(actionType) {
  const db = getDB();

  const binding = await db.prepare(`
    SELECT ab.*, ats.name as ad_name, ats.content as ad_content, ats.ad_type as ad_type
    FROM ad_bindings ab
    LEFT JOIN ad_ts_files ats ON ab.ad_id = ats.id
    WHERE ab.action_type = ?
    ORDER BY ab.priority DESC
    LIMIT 1
  `).bind(actionType).first();

  return binding;
}

/**
 * 创建广告绑定
 * @param {object} data - 绑定数据
 * @returns {object} 创建的绑定
 */
export async function createAdBinding(data) {
  const db = getDB();

  const result = await db.prepare(`
    INSERT INTO ad_bindings (action_type, ad_id, cooldown_seconds, priority)
    VALUES (?, ?, ?, ?)
  `).bind(
    data.action_type,
    data.ad_id || null,
    data.cooldown_seconds || 0,
    data.priority || 0
  ).run();

  const binding = await db.prepare(`
    SELECT * FROM ad_bindings WHERE id = ?
  `).bind(result.meta.last_row_id).first();

  return binding;
}

/**
 * 更新广告绑定
 * @param {number} id - 绑定ID
 * @param {object} data - 绑定数据
 * @returns {boolean} 是否成功
 */
export async function updateAdBinding(id, data) {
  const db = getDB();

  await db.prepare(`
    UPDATE ad_bindings
    SET ad_id = ?,
        cooldown_seconds = ?,
        priority = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `).bind(
    data.ad_id || null,
    data.cooldown_seconds || 0,
    data.priority || 0,
    id
  ).run();

  return true;
}

/**
 * 删除广告绑定
 * @param {number} id - 绑定ID
 * @returns {boolean} 是否成功
 */
export async function deleteAdBinding(id) {
  const db = getDB();

  await db.prepare('DELETE FROM ad_bindings WHERE id = ?').bind(id).run();
  return true;
}

/**
 * 获取所有广告绑定
 * @returns {array} 绑定列表
 */
export async function getAllAdBindings() {
  const db = getDB();

  const result = await db.prepare(`
    SELECT ab.*, ats.name as ad_name, ats.ad_type as ad_type
    FROM ad_bindings ab
    LEFT JOIN ad_ts_files ats ON ab.ad_id = ats.id
    ORDER BY ab.action_type, ab.priority DESC
  `).all();

  return result.results || [];
}

/**
 * 根据操作类型获取绑定广告（检查冷却时间）
 * @param {string} actionType - 操作类型
 * @param {string} clientIP - 客户端IP
 * @returns {object|null} 广告数据
 */
export async function getBoundAdByAction(actionType, clientIP) {
  const db = getDB();

  const binding = await getAdBinding(actionType);
  if (!binding) {
    return null;
  }

  // 如果没有绑定广告ID，返回null（不播放广告）
  if (!binding.ad_id) {
    return null;
  }

  console.log(`[AdBinding] Checking cooldown for action: ${actionType}, IP: ${clientIP}, cooldown: ${binding.cooldown_seconds}s`);

  // 检查冷却时间
  if (binding.cooldown_seconds > 0) {
    // 使用SQLite的datetime函数计算冷却时间，确保时区一致
    const recentPlay = await db.prepare(`
      SELECT COUNT(*) as count,
             MAX(played_at) as last_played_at,
             datetime('now') as now,
             datetime('now', '-' || ? || ' seconds') as cooldown_before
      FROM ad_play_logs
      WHERE action_type = ? AND client_ip = ? AND played_at > datetime('now', '-' || ? || ' seconds')
    `).bind(binding.cooldown_seconds, actionType, clientIP, binding.cooldown_seconds).first();

    console.log('[AdBinding] Cooldown check result:', recentPlay);

    if (recentPlay && recentPlay.count > 0) {
      // 在冷却期内，返回null
      console.log(`[AdBinding] In cooldown period for ${actionType}, last played: ${recentPlay.last_played_at}`);
      return null;
    }
  }

  // 记录播放日志
  await db.prepare(`
    INSERT INTO ad_play_logs (action_type, client_ip, played_at)
    VALUES (?, ?, datetime('now'))
  `).bind(actionType, clientIP).run();

  console.log(`[AdBinding] Ad logged for action: ${actionType}, IP: ${clientIP}`);

  // 返回绑定的特定广告
  if (binding.ad_content) {
    return {
      id: binding.ad_id,
      name: binding.ad_name,
      content: binding.ad_content,
      ad_type: binding.ad_type,
      cooldown_seconds: binding.cooldown_seconds
    };
  }

  // 如果有ad_id但没有content，查询广告详情
  const adFile = await db.prepare('SELECT * FROM ad_ts_files WHERE id = ? AND is_active = 1').bind(binding.ad_id).first();
  if (!adFile || !adFile.content) {
    return null;
  }

  return {
    id: adFile.id,
    name: adFile.name,
    content: adFile.content,
    ad_type: adFile.ad_type,
    cooldown_seconds: binding.cooldown_seconds
  };
}

/**
 * 生成广告M3U8内容
 * @param {object} adTsFile - 广告文件对象
 * @param {string} redirectUrl - 广告播放后的重定向URL（可选，未使用）
 * @param {string} baseUrl - 基础URL（用于生成TS文件路径）
 * @param {string} fullBaseUrl - 完整的基础URL（如 https://example.com）
 * @returns {string} M3U8内容
 */
export function generateAdM3U8(adTsFile, redirectUrl = null, baseUrl = '/api/ads', fullBaseUrl = null) {
  console.log('[AdM3U8] Generating M3U8 for ad:', adTsFile.id, 'baseUrl:', baseUrl, 'fullBaseUrl:', fullBaseUrl);

  // 使用相对路径（让VLC自动解析）
  const tsPath = `${baseUrl}/${adTsFile.id}.ts`;

  console.log('[AdM3U8] TS path:', tsPath);

  // 生成M3U8内容 - 使用标准格式，不使用数组join
  const m3u8 = '#EXTM3U8\n' +
                '#EXT-X-VERSION:3\n' +
                '#EXT-X-TARGETDURATION:10.000\n' +
                '#EXT-X-MEDIA-SEQUENCE:0\n' +
                '#EXTINF:10.000,\n' +
                tsPath + '\n' +
                '#EXT-X-ENDLIST\n';

  console.log('[AdM3U8] Generated M3U8 length:', m3u8.length);
  console.log('[AdM3U8] M3U8 preview:', m3u8.substring(0, 100));

  return m3u8;
}

/**
 * 获取所有活跃频道（用于免费订阅）
 */
export async function getActiveChannels() {
  const db = getDB();

  const result = await db.prepare(`
    SELECT c.*, s.name as source_name
    FROM channels c
    INNER JOIN sources s ON c.source_id = s.id
    WHERE c.is_active = 1 AND s.is_active = 1
    ORDER BY c.group_title, c.channel_name
  `).all();

  return result.results || [];
}

/**
 * 生成M3U内容
 */
export function generateM3UContent(channels, subId, isFreeSub = false, baseUrl = '') {
  let m3u = '#EXTM3U\n';

  // 添加订阅信息注释
  if (isFreeSub) {
    m3u += '# Free Subscription\n';
  } else {
    m3u += '# Subscription\n';
  }
  m3u += `# ID: ${subId}\n`;
  m3u += `# Channels: ${channels.length}\n`;
  m3u += `# Generated: ${new Date().toISOString()}\n\n`;

  // 添加频道
  for (const channel of channels) {
    const headers = channel.headers ? JSON.parse(channel.headers) : {};

    let extinf = '#EXTINF:-1';
    if (channel.logo) {
      extinf += ` tvg-logo="${channel.logo}"`;
    }
    if (channel.group_title) {
      extinf += ` group-title="${channel.group_title}"`;
    }
    extinf += `,${channel.channel_name}\n`;

    m3u += extinf;

    // 免费订阅直接使用freesub参数，不使用令牌
    if (isFreeSub) {
      const playUrl = baseUrl || '/api';
      m3u += `${playUrl}/play/${channel.channel_hash}?freesub=${subId}\n`;
    } else {
      m3u += `${channel.play_url}\n`;
    }
  }

  return m3u;
}

