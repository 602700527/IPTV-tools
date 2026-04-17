// 数据库初始化和表结构管理
let DB = null;
let tablesCreated = false;  // 防止重复创建表和索引

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
  // 如果已经创建过，直接返回
  if (tablesCreated) {
    return;
  }

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

  // 创建频道表（注意：D1 不支持 FOREIGN KEY，所以移除外键约束）
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
      is_active BOOLEAN DEFAULT 1
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
    // IP直连播放配置
    'enable_ip_play': 'true',
    // M3U缓存TTL配置
    'm3u_ttl_hours': '72',
    // 每日IP播放限制配置
    'play_limit_per_ip': '100',
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

    // 检查并添加 remote_url 字段（用于远程广告文件）
    const hasRemoteUrlColumn = columns.some(col => col.name === 'remote_url');
    if (!hasRemoteUrlColumn) {
      await db.prepare('ALTER TABLE ad_ts_files ADD COLUMN remote_url TEXT').run();
      console.log('Database: Added remote_url column to ad_ts_files table');
    }
  } catch (e) {
    console.error('Database: Failed to migrate ad_ts_files table:', e);
  }

  // 创建广告绑定表（注意：D1 不支持 FOREIGN KEY，所以移除外键约束）
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS ad_bindings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        ad_id INTEGER,
        cooldown_seconds INTEGER DEFAULT 0,
        priority INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  // 迁移：添加 fp_token 字段（如果不存在）
  try {
    await db.prepare('ALTER TABLE free_subscriptions ADD COLUMN fp_token TEXT').run();
    console.log('Database: Migrated free_subscriptions table - added fp_token column');
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
      // 字段已存在，忽略错误
      console.log('Database: fp_token column already exists');
    }
  }

  // 创建 fp_token 索引
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_free_subscriptions_fp_token ON free_subscriptions(fp_token)').run();
    console.log('Database: fp_token index created or already exists');
  } catch (e) {
    console.error('Database: Failed to create fp_token index:', e);
  }

  // 创建签到记录表（注意：D1 不支持 FOREIGN KEY，所以移除外键约束）
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS checkin_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscription_id INTEGER NOT NULL,
        checkin_date TEXT NOT NULL,
        reward_days INTEGER DEFAULT 1,
        consecutive_days INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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

  // 创建用户系统表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_verified BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)').run();
    console.log('Database: users table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create users table:', e);
  }

  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        is_used BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_email_verifications_code ON email_verifications(code)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_email_verifications_expires ON email_verifications(expires_at)').run();
    console.log('Database: email_verifications table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create email_verifications table:', e);
  }

  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at)').run();
    console.log('Database: user_sessions table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create user_sessions table:', e);
  }

  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        order_id TEXT UNIQUE NOT NULL,
        code TEXT,
        duration_days INTEGER,
        amount REAL,
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_user_orders_user_id ON user_orders(user_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_user_orders_order_id ON user_orders(order_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_user_orders_created ON user_orders(created_at DESC)').run();
    console.log('Database: user_orders table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create user_orders table:', e);
  }

  // 创建密码重置令牌表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        is_used BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at)').run();
    console.log('Database: password_reset_tokens table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create password_reset_tokens table:', e);
  }

  // 创建支付方式表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        enabled BOOLEAN DEFAULT 1,
        config TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(type)').run();
    console.log('Database: payment_methods table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create payment_methods table:', e);
  }

  // 创建商城设置表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS mall_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_mall_settings_key ON mall_settings(key)').run();
    console.log('Database: mall_settings table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create mall_settings table:', e);
  }

  // 创建订阅套餐表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        name_en TEXT,
        days INTEGER NOT NULL,
        base_price REAL NOT NULL,
        price_per_ip REAL NOT NULL,
        discount INTEGER DEFAULT 0,
        is_enabled BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_subscription_plans_enabled ON subscription_plans(is_enabled, sort_order)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_subscription_plans_days ON subscription_plans(days)').run();
    console.log('Database: subscription_plans table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create subscription_plans table:', e);
  }

  // 创建虎皮椒支付订单表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS xunhupay_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        trade_order_id TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        amount REAL NOT NULL,
        duration_days INTEGER NOT NULL,
        max_ips INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        code TEXT,
        xunhupay_order_id TEXT,
        xunhupay_transaction_id TEXT,
        notify_received BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_order_id ON xunhupay_orders(order_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_trade_order_id ON xunhupay_orders(trade_order_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_user_id ON xunhupay_orders(user_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_status ON xunhupay_orders(status)').run();
    console.log('Database: xunhupay_orders table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create xunhupay_orders table:', e);
  }

  // 初始化默认支付方式
  try {
    const alipayCount = await db.prepare('SELECT COUNT(*) as count FROM payment_methods WHERE type = ?').bind('alipay').first();
    if (!alipayCount || alipayCount.count === 0) {
      await db.prepare(`
        INSERT INTO payment_methods (type, name, enabled, config) VALUES
        ('alipay', '支付宝', 1, '{"app_id":"","app_secret":"","notify_url":""}')
      `).run();
      console.log('Database: Initialized alipay payment method');
    }

    const wechatCount = await db.prepare('SELECT COUNT(*) as count FROM payment_methods WHERE type = ?').bind('wechat').first();
    if (!wechatCount || wechatCount.count === 0) {
      await db.prepare(`
        INSERT INTO payment_methods (type, name, enabled, config) VALUES
        ('wechat', '微信支付', 1, '{"app_id":"","app_secret":"","notify_url":""}')
      `).run();
      console.log('Database: Initialized wechat payment method');
    }

    const paypalCount = await db.prepare('SELECT COUNT(*) as count FROM payment_methods WHERE type = ?').bind('paypal').first();
    if (!paypalCount || paypalCount.count === 0) {
      await db.prepare(`
        INSERT INTO payment_methods (type, name, enabled, config) VALUES
        ('paypal', 'PayPal', 0, '{"client_id":"","client_secret":"","mode":"sandbox"}')
      `).run();
      console.log('Database: Initialized paypal payment method');
    }

    // 初始化加密货币支付方式
    const coinbaseCount = await db.prepare('SELECT COUNT(*) as count FROM payment_methods WHERE type = ?').bind('coinbase').first();
    if (!coinbaseCount || coinbaseCount.count === 0) {
      await db.prepare(`
        INSERT INTO payment_methods (type, name, enabled, config) VALUES
        ('coinbase', 'Coinbase Commerce', 0, '{"api_key":"","webhook_secret":"","auto_convert":"usdc"}')
      `).run();
      console.log('Database: Initialized coinbase payment method');
    }

    const usdtCount = await db.prepare('SELECT COUNT(*) as count FROM payment_methods WHERE type = ?').bind('usdt').first();
    if (!usdtCount || usdtCount.count === 0) {
      await db.prepare(`
        INSERT INTO payment_methods (type, name, enabled, config) VALUES
        ('usdt', 'USDT (Tether)', 0, '{"network":"trc20","wallet_address":""}')
      `).run();
      console.log('Database: Initialized usdt payment method');
    }

    const usdcCount = await db.prepare('SELECT COUNT(*) as count FROM payment_methods WHERE type = ?').bind('usdc').first();
    if (!usdcCount || usdcCount.count === 0) {
      await db.prepare(`
        INSERT INTO payment_methods (type, name, enabled, config) VALUES
        ('usdc', 'USDC (USD Coin)', 0, '{"network":"ethereum","wallet_address":""}')
      `).run();
      console.log('Database: Initialized usdc payment method');
    }
  } catch (e) {
    console.error('Database: Failed to initialize payment methods:', e);
  }

  // 初始化商城设置
  try {
    const mallEnabledCount = await db.prepare('SELECT COUNT(*) as count FROM mall_settings WHERE key = ?').bind('mall_enabled').first();
    if (!mallEnabledCount || mallEnabledCount.count === 0) {
      await db.prepare(`
        INSERT INTO mall_settings (key, value) VALUES ('mall_enabled', '1')
      `).run();
      console.log('Database: Initialized mall_enabled setting');
    }

    const subscriptionEnabledCount = await db.prepare('SELECT COUNT(*) as count FROM mall_settings WHERE key = ?').bind('subscription_enabled').first();
    if (!subscriptionEnabledCount || subscriptionEnabledCount.count === 0) {
      await db.prepare(`
        INSERT INTO mall_settings (key, value) VALUES ('subscription_enabled', '1')
      `).run();
      console.log('Database: Initialized subscription_enabled setting');
    }
  } catch (e) {
    console.error('Database: Failed to initialize mall settings:', e);
  }

  // 创建域名黑名单表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS domain_blacklist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain TEXT NOT NULL UNIQUE,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_domain_blacklist_domain ON domain_blacklist(domain)').run();
    console.log('Database: domain_blacklist table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create domain_blacklist table:', e);
  }

  // 创建工单表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        order_id TEXT NOT NULL,
        type TEXT NOT NULL,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'normal',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME
      )
    `).run();
    console.log('Database: tickets table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create tickets table:', e);
  }

  // 创建工单索引
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON tickets(order_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC)').run();
    console.log('Database: tickets indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create tickets indexes:', e);
  }

  // 创建工单回复表
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS ticket_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id INTEGER NOT NULL,
        user_id INTEGER,
        is_admin BOOLEAN DEFAULT 0,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    console.log('Database: ticket_replies table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create ticket_replies table:', e);
  }

  // 创建工单回复索引
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON ticket_replies(ticket_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ticket_replies_created_at ON ticket_replies(created_at ASC)').run();
    console.log('Database: ticket_replies indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create ticket_replies indexes:', e);
  }

  console.log('Tables created successfully');
  tablesCreated = true;  // 标记表已创建，避免重复执行
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
  const settings = await db.prepare('SELECT key, value FROM settings WHERE key IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind('enable_ref_check', 'ref_whitelist', 'enable_play_token', 'play_token_expire_seconds', 'homepage_display_config', 'enable_ip_bind', 'enable_burn_after_read', 'enable_url_encryption', 'url_encryption_key', 'enable_anti_debug', 'disable_console_logs', 'enable_ip_play', 'member_ad_free_enabled', 'm3u_ttl_hours', 'play_limit_per_ip')
    .all();

  const config = {
    homepage_display_config: {},
    enable_ip_play: true,
    member_ad_free_enabled: false,
    m3u_ttl_hours: 72,
    play_limit_per_ip: 100
  };

  settings.results?.forEach(row => {
    if (row.key === 'homepage_display_config') {
      try {
        config.homepage_display_config = JSON.parse(row.value);
      } catch (e) {
        config.homepage_display_config = {};
      }
    } else if (row.key === 'enable_ip_play') {
      config.enable_ip_play = row.value === 'true';
    } else if (row.key === 'member_ad_free_enabled') {
      config.member_ad_free_enabled = row.value === 'true';
    } else if (row.key === 'm3u_ttl_hours') {
      config.m3u_ttl_hours = parseInt(row.value) || 72;
    } else if (row.key === 'play_limit_per_ip') {
      config.play_limit_per_ip = parseInt(row.value) || 100;
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

// 更新系统配置
export async function updateSystemConfig(config) {
  const db = getDB();

  if (config.enable_ip_play !== undefined) {
    await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
      .bind(config.enable_ip_play.toString(), 'enable_ip_play')
      .run();
  }

  if (config.member_ad_free_enabled !== undefined) {
    await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
      .bind('member_ad_free_enabled', config.member_ad_free_enabled.toString())
      .run();
  }

  if (config.m3u_ttl_hours !== undefined) {
    await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
      .bind('m3u_ttl_hours', config.m3u_ttl_hours.toString())
      .run();
  }

  if (config.play_limit_per_ip !== undefined) {
    await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
      .bind('play_limit_per_ip', config.play_limit_per_ip.toString())
      .run();
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

    // D1 的 batch API 本身就是原子的，不需要手动使用 BEGIN/COMMIT
    // 批量插入频道
    try {
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
          // D1 的 batch 操作是原子的，失败会自动回滚
          throw batchError;
        }
      }

      console.log(`[Sync] All batches completed for source ${sourceId}, ${processedCount} channels inserted`);
    } catch (transactionError) {
      console.error(`[Sync] Batch insert error for source ${sourceId}:`, transactionError);
      throw transactionError;
    }
  }

  console.log(`[Sync] Parse completed, returning ${channels.length} channels`);
  return channels.length;
}

// 只解析M3U内容，不写入数据库（用于优化的同步逻辑）
export async function parseM3UContentOnly(content, sourceId, filter = {}) {
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

    // 提取频道名称
    const nameMatch = extinfLine.match(/,([^,\n]+)$/);
    if (nameMatch) {
      currentChannel.channel_name = nameMatch[1].trim();
      currentChannel.channel_name = normalizeChannelName(currentChannel.channel_name);
    } else {
      const idMatch = extinfLine.match(/tvg-id="([^"]+)"/i);
      if (idMatch) {
        currentChannel.channel_name = idMatch[1].trim();
        currentChannel.channel_name = normalizeChannelName(currentChannel.channel_name);
      } else {
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

    // 提取 tvg-id, tvg-name, tvg-logo, tvg-chno
    const tvgIdMatch = extinfLine.match(/tvg-id\s*=\s*"([^"]+)"/i);
    if (tvgIdMatch) {
      currentChannel.tvg_id = tvgIdMatch[1];
    }
    const tvgNameMatch = extinfLine.match(/tvg-name\s*=\s*"([^"]+)"/i);
    if (tvgNameMatch) {
      currentChannel.tvg_name = tvgNameMatch[1];
    }
    const tvgLogoMatch = extinfLine.match(/tvg-logo\s*=\s*"([^"]+)"/i);
    if (tvgLogoMatch) {
      currentChannel.tvg_logo = tvgLogoMatch[1];
    }
    const tvgChnoMatch = extinfLine.match(/tvg-chno\s*=\s*"([^"]+)"/i);
    if (tvgChnoMatch) {
      currentChannel.tvg_chno = tvgChnoMatch[1];
    }

    // 提取 http-user-agent、ua、user_agent
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

    // 提取 http-header
    const httpHeaderMatch = extinfLine.match(/http-header\s*=\s*"([^"]+)"/i);
    if (httpHeaderMatch) {
      let parts = httpHeaderMatch[1].split('=', 2);
      if (parts.length !== 2 || parts[0].trim() === '') {
        parts = httpHeaderMatch[1].split(':', 2);
      }
      if (parts.length === 2) {
        const headerKey = parts[0].trim();
        const headerValue = parts[1].trim();
        currentChannel.headers[headerKey] = headerValue;
      }
    }

    // 提取 Referer
    const httpRefererMatch = extinfLine.match(/http-referer\s*=\s*"([^"]+)"/i);
    if (httpRefererMatch) {
      currentChannel.headers['Referer'] = httpRefererMatch[1];
    }
    const refererMatch = extinfLine.match(/(?:^|[^-])referer\s*=\s*"([^"]+)"/i);
    if (refererMatch) {
      currentChannel.headers['Referer'] = refererMatch[1];
    }

    // 查找 URL 行
    let urlLine = null;
    let vlcOptProcessed = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!vlcOptProcessed && line.startsWith('#EXTVLCOPT:')) {
        const vlcUAMatch = line.match(/http-user-agent\s*=\s*([^\s]+)/i);
        if (vlcUAMatch) {
          currentChannel.headers['User-Agent'] = vlcUAMatch[1];
        }
        const vlcRefererMatch = line.match(/http-referrer\s*=\s*([^\s]+)/i);
        if (vlcRefererMatch) {
          currentChannel.headers['Referer'] = vlcRefererMatch[1];
        }
        vlcOptProcessed = true;
        continue;
      }

      if (!line.startsWith('#') && line) {
        urlLine = line;
        break;
      }
    }

    if (!urlLine) continue;

    currentChannel.play_url = urlLine;

    // 应用过滤条件
    if (filter) {
      if (filter.excludeGroups && filter.excludeGroups.length > 0) {
        if (currentChannel.group_title && filter.excludeGroups.some(keyword =>
          currentChannel.group_title.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding group: "${currentChannel.group_title}"`);
          continue;
        }
      }

      if (filter.excludeUrls && filter.excludeUrls.length > 0) {
        if (currentChannel.play_url && filter.excludeUrls.some(keyword =>
          currentChannel.play_url.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding URL: "${currentChannel.play_url}"`);
          continue;
        }
      }

      if (filter.excludeNames && filter.excludeNames.length > 0) {
        if (currentChannel.channel_name && filter.excludeNames.some(keyword =>
          currentChannel.channel_name.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding channel: "${currentChannel.channel_name}"`);
          continue;
        }
      }

      if (filter.excludeDuplicateUrls && currentChannel.play_url) {
        if (processedUrls.has(currentChannel.play_url)) {
          console.log(`[Filter] Excluding duplicate URL: "${currentChannel.play_url}"`);
          continue;
        }
        processedUrls.add(currentChannel.play_url);
      }

      if (currentChannel.group_title && filter.groupRenameRules && filter.groupRenameRules.length > 0) {
        const shouldExclude = filter.groupRenameExclude && filter.groupRenameExclude.length > 0 &&
          filter.groupRenameExclude.some(exclude => 
            currentChannel.group_title.toLowerCase().includes(exclude.toLowerCase())
          );
        
        if (!shouldExclude) {
          for (const rule of filter.groupRenameRules) {
            if (currentChannel.group_title.toLowerCase().includes(rule.keyword.toLowerCase())) {
              currentChannel.group_title = rule.newName;
              break;
            }
          }
        }
      }
    }

    // 生成channel_hash
    const encoder = new TextEncoder();
    const data = encoder.encode(urlLine);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    currentChannel.channel_hash = hashHex.substring(0, 8);

    // 数据验证
    currentChannel.channel_name = currentChannel.channel_name || 'Unknown';
    currentChannel.group_title = currentChannel.group_title || '';
    currentChannel.logo = currentChannel.logo || '';
    currentChannel.url = currentChannel.play_url;
    currentChannel.hash = currentChannel.channel_hash;

    // 将headers转为JSON字符串（如果为空则存空对象）
    currentChannel.headers = Object.keys(currentChannel.headers).length > 0
      ? JSON.stringify(currentChannel.headers)
      : JSON.stringify({});

    // 限制字段长度
    if (currentChannel.channel_name && currentChannel.channel_name.length > 500) {
      currentChannel.channel_name = currentChannel.channel_name.substring(0, 500);
    }
    if (currentChannel.play_url && currentChannel.play_url.length > 2000) {
      console.warn(`[Sync] URL too long, truncating: ${currentChannel.play_url.substring(0, 50)}...`);
      continue;
    }
    if (currentChannel.logo && currentChannel.logo.length > 500) {
      currentChannel.logo = currentChannel.logo.substring(0, 500);
    }

    channels.push(currentChannel);
  }

  // 对频道进行排序
  if (channels.length > 0) {
    channels.sort((a, b) => {
      const groupA = a.group_title || '';
      const groupB = b.group_title || '';
      if (groupA !== groupB) {
        return groupA.localeCompare(groupB, 'zh-CN', { numeric: true });
      }
      return customChannelSort(a, b);
    });
    console.log(`[Sync] Channels sorted`);
  }

  return { channels, channelCount: channels.length };
}

// 从远程URL获取M3U内容并解析（只解析，不写入数据库）
export async function fetchAndParseM3UOnly(sourceUrl, sourceId, filter = null) {
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

    // 去除开头的空白字符后检查
    const trimmedContent = content.trimStart();
    if (!trimmedContent || !trimmedContent.startsWith('#EXTM3U')) {
      console.error(`[Sync] Invalid M3U content`);
      throw new Error('Invalid M3U content');
    }

    const parseStartTime = Date.now();
    const result = await parseM3UContentOnly(content, sourceId, filter);
    const parseEndTime = Date.now();
    console.log(`[Sync] Parse completed in ${parseEndTime - parseStartTime}ms`);

    console.log(`[Sync] Successfully parsed ${result.channelCount} channels`);
    return { 
      success: true, 
      channelCount: result.channelCount,
      channels: result.channels,
      adBindings: []
    };
  } catch (error) {
    console.error(`[Sync] Error fetching and parsing M3U: ${error.message}`);
    return { success: false, error: error.message, channelCount: 0, channels: [], adBindings: [] };
  }
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

    // 检查内容是否为空或格式不正确（去除开头空白）
    const trimmedContent = content.trimStart();
    if (!trimmedContent || !trimmedContent.startsWith('#EXTM3U')) {
      console.error(`[Sync] Invalid M3U content: starts with ${trimmedContent ? trimmedContent.substring(0, 50) : 'empty'}...`);
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
  if (!adFile) {
    return null;
  }

  // 如果有本地content，直接返回
  if (adFile.content) {
    return {
      id: adFile.id,
      ad_id: adFile.id,
      name: adFile.name,
      content: adFile.content,
      ad_type: adFile.ad_type,
      remote_url: adFile.remote_url,
      cooldown_seconds: binding.cooldown_seconds
    };
  }

  // 如果有远程URL，也返回广告对象（会在handleAdTsFile中获取远程内容）
  if (adFile.remote_url) {
    return {
      id: adFile.id,
      ad_id: adFile.id,
      name: adFile.name,
      content: null,
      ad_type: adFile.ad_type,
      remote_url: adFile.remote_url,
      cooldown_seconds: binding.cooldown_seconds
    };
  }

  return null;

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
export function generateM3UContent(channels, subId, isFreeSub = false, baseUrl = '', domainBlacklist = []) {
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

    // 检查频道URL是否在域名黑名单中
    let playUrl;
    let isBlacklisted = false;

    if (channel.play_url) {
      try {
        const urlObj = new URL(channel.play_url);
        const hostname = urlObj.hostname;

        // 检查完全匹配
        isBlacklisted = domainBlacklist.includes(hostname);

        // 检查子域名匹配（例如：*.example.com 匹配 sub.example.com）
        if (!isBlacklisted) {
          for (const blacklistDomain of domainBlacklist) {
            if (blacklistDomain.startsWith('*.') && hostname.endsWith(blacklistDomain.substring(2))) {
              isBlacklisted = true;
              break;
            }
          }
        }
      } catch (e) {
        console.error('[generateM3UContent] Error parsing channel URL:', e);
      }
    }

    // 免费订阅
    if (isFreeSub) {
      if (isBlacklisted) {
        // 如果域名在黑名单中，直接使用原始播放地址（透传）
        playUrl = channel.play_url;
      } else {
        // 否则使用代理播放地址
        const apiUrl = baseUrl || '/api';
        playUrl = `${apiUrl}/play/${channel.channel_hash}?freesub=${subId}`;
      }
    } else {
      // 普通订阅（如果不是免费订阅，目前逻辑是直接使用原始URL）
      // 如果需要支持普通订阅的透传，可以在这里添加逻辑
      playUrl = channel.play_url;
    }

    m3u += `${playUrl}\n`;
  }

  return m3u;
}

// 商城设置相关函数
export async function getMallSettings() {
  const db = getDB();
  const settings = await db.prepare('SELECT * FROM mall_settings').all();
  const settingsMap = {};
  (settings.results || []).forEach(s => {
    settingsMap[s.key] = s.value;
  });
  return settingsMap;
}

export async function isMallEnabled() {
  const settings = await getMallSettings();
  return settings.mall_enabled === '1';
}

export async function isSubscriptionEnabled() {
  const settings = await getMallSettings();
  return settings.subscription_enabled === '1';
}

// ========== 域名黑名单相关函数 ==========

/**
 * 获取所有域名黑名单
 */
export async function getDomainBlacklist() {
  const db = getDB();
  const result = await db.prepare('SELECT * FROM domain_blacklist ORDER BY created_at DESC').all();
  return result.results || [];
}

/**
 * 添加域名到黑名单
 */
export async function addDomainToBlacklist(domain, reason) {
  const db = getDB();
  const result = await db.prepare(`
    INSERT INTO domain_blacklist (domain, reason)
    VALUES (?, ?)
  `).bind(domain, reason).run();
  return {
    success: true,
    id: result.meta.last_row_id
  };
}

/**
 * 从黑名单删除域名
 */
export async function removeDomainFromBlacklist(id) {
  const db = getDB();
  const result = await db.prepare('DELETE FROM domain_blacklist WHERE id = ?').bind(id).run();
  return result.meta.changes > 0;
}

/**
 * 批量添加域名到黑名单
 */
export async function addMultipleDomainsToBlacklist(domains) {
  const db = getDB();
  const results = [];
  for (const domain of domains) {
    try {
      const result = await db.prepare(`
        INSERT INTO domain_blacklist (domain, reason)
        VALUES (?, ?)
      `).bind(domain.domain, domain.reason || '').run();
      results.push({
        domain: domain.domain,
        success: true,
        id: result.meta.last_row_id
      });
    } catch (e) {
      results.push({
        domain: domain.domain,
        success: false,
        error: e.message
      });
    }
  }
  return results;
}

/**
 * 检查域名是否在黑名单中
 */
export async function isDomainBlacklisted(playUrl) {
  const db = getDB();
  try {
    const url = new URL(playUrl);
    const hostname = url.hostname;

    // 检查完全匹配
    const exactMatch = await db.prepare('SELECT id FROM domain_blacklist WHERE domain = ?').bind(hostname).first();
    if (exactMatch) {
      return true;
    }

    // 检查子域名匹配（例如：*.example.com 匹配 sub.example.com）
    const subdomainMatches = await db.prepare('SELECT domain FROM domain_blacklist WHERE domain LIKE ?').bind('%.' + hostname).all();
    if (subdomainMatches.results && subdomainMatches.results.length > 0) {
      return true;
    }

    return false;
  } catch (e) {
    console.error('[DomainBlacklist] Error checking domain:', e);
    return false;
  }
}

/**
 * 从URL提取域名
 */
export function extractDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}



