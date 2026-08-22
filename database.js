// 〃＄
let DB = null;
let tablesCreated = false;  // ㄥ

// 
export async function initDB(env) {
  if (!DB) {
    DB = env.DB;
  }
  return DB;
}

// ?
export function getDB() {
  if (!DB) {
    throw new Error('Database not initialized');
  }
  return DB;
}

/**
 * ょ
 * @param {string} channelHash - 
 * @param {string} subId - ID
 * @returns {string} ょ
 */
export function generateFreeSubPlayToken(channelHash, subId) {
  const timestamp = Date.now();
  const data = `${channelHash}|${subId}|${timestamp}`;
  // €base64
  const hash = btoa(data);
  return hash;
}

/**
 * ょ
 * @param {string} token - ょ
 * @param {string} channelHash - 
 * @param {string} subId - ID
 * @param {number} maxAge - €ф?
 * @returns {boolean} 
 */
export function verifyFreeSubPlayToken(token, channelHash, subId, maxAge = 60 * 60 * 1000) {
  try {
    const data = atob(token);
    const parts = data.split('|');

    if (parts.length !== 3) {
      return false;
    }

    const [hashChannelHash, hashSubId, hashTimestamp] = parts;

    // 
    if (hashChannelHash !== channelHash) {
      return false;
    }

    // ID
    if (hashSubId !== subId) {
      return false;
    }

    // ?
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

// ㄧ?
export async function createTables(env) {
  // 
  if (tablesCreated) {
    return;
  }

  const db = env.DB;

  // 〃
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

  // Щ?is_active ?
  try {
    await db.prepare('ALTER TABLE sources ADD COLUMN is_active BOOLEAN DEFAULT 1').run();
    console.log('Migrated sources table: added is_active column');
  } catch (e) {
    // 
    if (!e.message.includes('duplicate column name')) {
      console.error('Migration error:', e);
    }
  }

  // ㄦ1 ?FOREIGN KEYョЩゅ
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
      original TEXT
    )
  `).run();

  // Migrate: add original column to existing channels table if missing
  try {
    const channelCols = await db.prepare('PRAGMA table_info(channels)').all();
    const hasOriginal = (channelCols.results || []).some(c => c.name === 'original');
    if (!hasOriginal) {
      await db.prepare(`ALTER TABLE channels ADD COLUMN original TEXT DEFAULT ''`).run();
      console.log('Migrated channels table: added original column');
    } else {
      console.log('channels.original column already exists');
    }
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
      console.error('Failed to migrate channels.original column:', e);
    }
  }


  // 
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channel_hash ON channels(channel_hash)
  `).run();

  // is_active
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_is_active ON channels(is_active)
  `).run();

  // source_idゆJOINヨ?
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_source_id ON channels(source_id)
  `).run();

  // group_title
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_group_title ON channels(group_title)
  `).run();

  // is_active+source_idㄦ
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_active_source ON channels(is_active, source_id)
  `).run();

  // group_titleISTINCTヨ?
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_group_title_optimized ON channels(group_title, is_active)
  `).run();

  // s_active
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active)
  `).run();

  // Щ?channels.type ?
  try {
    const channelTableInfo = await db.prepare('PRAGMA table_info(channels)').all();
    const channelColumns = channelTableInfo.results || [];
    const hasTypeColumn = channelColumns.some(col => col.name === 'type');

    if (!hasTypeColumn) {
      await db.prepare('ALTER TABLE channels ADD COLUMN type TEXT DEFAULT \'\'').run();
      console.log('Database: Migrated channels table - added type column');
    }

    //  type €
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_channels_type ON channels(type)').run();
    console.log('Database: channels type index created or already exists');
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
      console.error('Database: Failed to migrate channels type column:', e);
    }
  }

  // Щ?channels.description ?
  try {
    const channelColumns = (await db.prepare('PRAGMA table_info(channels)').all()).results || [];
    const hasDescriptionColumn = channelColumns.some(col => col.name === 'description');

    if (!hasDescriptionColumn) {
      await db.prepare('ALTER TABLE channels ADD COLUMN description TEXT DEFAULT \'\'').run();
      console.log('Database: Migrated channels table - added description column');
    }
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
      console.error('Database: Failed to migrate channels description column:', e);
    }
  }

  // ?ㄤ?
  //  channel_name + group_title ?
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS channel_type_mapping (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel_name TEXT NOT NULL,
      group_title TEXT DEFAULT '',
      type TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(channel_name, group_title)
    )
  `).run();

  // Щㄧ channel_type_mapping ㄦ
  try {
    // €ヨ〃
    const tableInfo = await db.prepare('PRAGMA table_info(channel_type_mapping)').all();
    const columns = tableInfo.results || [];
    const columnNames = columns.map(c => c.name);

    //  group_title ?
    if (!columnNames.includes('group_title')) {
      await db.prepare('ALTER TABLE channel_type_mapping ADD COLUMN group_title TEXT DEFAULT \'\'').run();
      console.log('Database: Migrated channel_type_mapping - added group_title column');
    }

    //  description ?
    if (!columnNames.includes('description')) {
      await db.prepare('ALTER TABLE channel_type_mapping ADD COLUMN description TEXT DEFAULT \'\'').run();
      console.log('Database: Migrated channel_type_mapping - added description column');
    }
  } catch (e) {
    console.log('Database: channel_type_mapping migration skipped (columns may already exist)');
  }

  // ?
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channel_type_mapping_name_group ON channel_type_mapping(channel_name, group_title)
  `).run();

  // х type_mapping_configЩ?channel_type_mapping?
  try {
    await db.prepare('DELETE FROM settings WHERE key = ?').bind('type_mapping_config').run();
    console.log('Database: Cleaned up old type_mapping_config from settings');
  } catch (e) {
    // ignore
  }
  console.log('Database: channel_type_mapping table created with group_title and description');

  // ″?
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

  // ″€?
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_code_status ON codes(status)
  `).run();

  // Щ?banned_until ?
  try {
    await db.prepare('ALTER TABLE codes ADD COLUMN banned_until DATETIME').run();
    console.log('Migrated codes table: added banned_until column');
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
      console.error('Migration error:', e);
    }
  }

  // ?
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `).run();

  // ??
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      rules TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Щ?topic_id ?codes ?
  try {
    await db.prepare('ALTER TABLE codes ADD COLUMN topic_id INTEGER REFERENCES topics(id)').run();
    console.log('Migrated codes table: added topic_id column');
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
      console.error('Migration error:', e);
    }
  }

  // ら
  const defaultSettings = {
    'channel_daily_limit': '100',
    'ban_duration_days': '7',
    'auto_ban_on_exceed': 'true',
    // IP?
    'sub_rate_min': '1',
    'sub_rate_hour': '60',
    'sub_rate_day': '500',
    'live_rate_min': '5',
    'live_rate_hour': '300',
    'live_rate_day': '2000',
    'admin_rate_hour': '10',
    // 〉ずSON?
    'homepage_display_config': '{}',
    // IP
    'enable_ip_play': 'true',
    // M3UTTL
    'm3u_ttl_hours': '72',
    // IP
    'play_limit_per_ip': '100',
    // SON?
    'sync_filter_config': '{}',
    // SONM3U tvg-type ?type ?
    'type_mapping_config': JSON.stringify({
      'cinema': 'movie',
      'films': 'movie',
      'film': 'movie',
      'anim': 'animation',
      'animation': 'animation',
      'cartoon': 'animation',
      'entertainment': 'entertainment',
      'sports': 'sports',
      'sport': 'sports',
      'news': 'news',
      'kids': 'kids',
      'children': 'kids',
      'doc': 'documentary',
      'documentary': 'documentary',
      'edu': 'education',
      'education': 'education',
      'drama': 'drama',
      'theater': 'drama',
      'music': 'music'
    })
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    const existing = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
    if (!existing) {
      await db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').bind(key, value).run();
    }
  }

  // Pㄤ€10ㄦ
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

  // 
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_play_logs_code ON play_logs(code)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_play_logs_code_date ON play_logs(code, created_date)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_play_logs_code_hash_date ON play_logs(code, channel_hash, created_date)').run();

  // IP?
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

  // IP
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_ip_access_logs_ip_date ON ip_access_logs(ip, created_date)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_ip_access_logs_ip_path_date ON ip_access_logs(ip, path, created_date)').run();

  // IP〃
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

  // IP?
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_ip_blacklist_ip ON ip_blacklist(ip)').run();

  // ╰oken?
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS used_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME
    )
  `).run();

  // ╰oken
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_used_tokens_token ON used_tokens(token)').run();

  // IP″P
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
    // IP
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_subscription_ips_code_date ON subscription_ips(code, created_date)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_subscription_ips_code_ip_date ON subscription_ips(code, client_ip, created_date)').run();
    console.log('Database: subscription_ips indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create subscription_ips indexes:', e);
  }

  // TS?
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

  // TS
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_ts_files_active ON ad_ts_files(is_active)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_ts_files_type_active ON ad_ts_files(ad_type, is_active)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_ts_files_updated ON ad_ts_files(updated_at DESC)').run();
    console.log('Database: ad_ts_files indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create ad_ts_files indexes:', e);
  }

  // €ュけ
  try {
    // €?ad_ts_files ㄧ?
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

    // €ュ remote_url 
    const hasRemoteUrlColumn = columns.some(col => col.name === 'remote_url');
    if (!hasRemoteUrlColumn) {
      await db.prepare('ALTER TABLE ad_ts_files ADD COLUMN remote_url TEXT').run();
      console.log('Database: Added remote_url column to ad_ts_files table');
    }
  } catch (e) {
    console.error('Database: Failed to migrate ad_ts_files table:', e);
  }

  // ㄦ1 ?FOREIGN KEYョЩゅ
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

  // 
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_bindings_action ON ad_bindings(action_type)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_bindings_priority ON ad_bindings(priority DESC)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_bindings_ad_id ON ad_bindings(ad_id)').run();
    console.log('Database: ad_bindings indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create ad_bindings indexes:', e);
  }

  // ュ?
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

  // ュ
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_play_logs_action_ip_date ON ad_play_logs(action_type, client_ip, created_date)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ad_play_logs_played_at ON ad_play_logs(played_at DESC)').run();
    console.log('Database: ad_play_logs indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create ad_play_logs indexes:', e);
  }






  // ㄦ1 ?FOREIGN KEYョЩゅ
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

  // 
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_checkin_records_subscription_id ON checkin_records(subscription_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_checkin_records_date ON checkin_records(checkin_date DESC)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_checkin_records_subscription_date ON checkin_records(subscription_id, checkin_date)').run();
    console.log('Database: checkin_records indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create checkin_records indexes:', e);
  }

  // ㄦ?
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
        discount_code TEXT DEFAULT '',
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
  // Migrate: 老版本没有 discount_code 列，安全添加
  try {
    await db.prepare('ALTER TABLE user_orders ADD COLUMN discount_code TEXT DEFAULT ""').run();
  } catch (e) {
    // column already exists — no-op
  }

  // ょ?
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

  // ?
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

  // ?
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

  // ?
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

  // 优惠码
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS discount_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL DEFAULT 'percent',
        value REAL NOT NULL,
        usage_limit INTEGER DEFAULT 0,
        used_count INTEGER DEFAULT 0,
        min_amount REAL DEFAULT 0,
        expires_at DATETIME,
        status TEXT DEFAULT 'active',
        remark TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_discount_codes_status ON discount_codes(status)').run();
    console.log('Database: discount_codes table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create discount_codes table:', e);
  }

  // 〃
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
        topic_id INTEGER,
        sub_mode TEXT,
        discount_code TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare('ALTER TABLE xunhupay_orders ADD COLUMN discount_code TEXT DEFAULT ""').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_order_id ON xunhupay_orders(order_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_trade_order_id ON xunhupay_orders(trade_order_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_user_id ON xunhupay_orders(user_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_status ON xunhupay_orders(status)').run();
    console.log('Database: xunhupay_orders table created or already exists');
  } catch (e) {
    console.error('Database: Failed to create xunhupay_orders table:', e);
  }

  // ゆ?
  try {
    const alipayCount = await db.prepare('SELECT COUNT(*) as count FROM payment_methods WHERE type = ?').bind('alipay').first();
    if (!alipayCount || alipayCount.count === 0) {
      await db.prepare(`
        INSERT INTO payment_methods (type, name, enabled, config) VALUES
        ('alipay', '?, 1, '{"app_id":"","app_secret":"","notify_url":""}')
      `).run();
      console.log('Database: Initialized alipay payment method');
    }

    const wechatCount = await db.prepare('SELECT COUNT(*) as count FROM payment_methods WHERE type = ?').bind('wechat').first();
    if (!wechatCount || wechatCount.count === 0) {
      await db.prepare(`
        INSERT INTO payment_methods (type, name, enabled, config) VALUES
        ('wechat', '', 1, '{"app_id":"","app_secret":"","notify_url":""}')
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

    // ?
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

  // ?
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

  // 〃
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

  // ュ?
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

  // ュ
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON tickets(order_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC)').run();
    console.log('Database: tickets indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create tickets indexes:', e);
  }

  // ュ?
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

  // ュ
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON ticket_replies(ticket_id)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_ticket_replies_created_at ON ticket_replies(created_at ASC)').run();
    console.log('Database: ticket_replies indexes created or already exist');
  } catch (e) {
    console.error('Database: Failed to create ticket_replies indexes:', e);
  }

  console.log('Tables created successfully');
  tablesCreated = true;  // ㄥ?
}

// 
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

// IP?
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

// IP?
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

// 〉ず
export async function getHomepageDisplayConfig() {
  const db = getDB();
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('homepage_display_config').first();

  if (!result) {
    // ┖〃
    return {
      sources: [], // ID〃┖ㄧずㄩ
      groups: [],  // 〃?
      hosts: [],    // ost〃┖ㄧずㄩ
      hasHeaders: null, // null=ㄩ, true=ご, false=ご
      manualHosts: [] // ?
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

// 〉ず
export async function updateHomepageDisplayConfig(config) {
  const db = getDB();
  const configJson = JSON.stringify(config);
  await db.prepare('UPDATE settings SET value = ? WHERE key = ?')
    .bind(configJson, 'homepage_display_config')
    .run();
}

// 
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

// 
export async function getSyncFilterConfig() {
  const db = getDB();
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('sync_filter_config').first();

  if (!result) {
    // ┖〃?
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

// 
export async function updateSyncFilterConfig(config) {
  const db = getDB();
  const configJson = JSON.stringify(config);

  // €ラ﹀?
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

//  channel_type_mapping 
export async function getTypeMappingConfig() {
  const db = getDB();
  const result = await db.prepare('SELECT channel_name, group_title, type, description FROM channel_type_mapping ORDER BY channel_name, group_title').all();
  return result.results || [];
}

// ?channel_type_mapping 
// newMappings: [{channel_name: 'CCTV-1', group_title: '', type: 'news', description: '...'}, ...]
export async function updateTypeMappingConfig(newMappings) {
  const db = getDB();

  // 
  await db.prepare('DELETE FROM channel_type_mapping').run();

  // ?
  if (newMappings && newMappings.length > 0) {
    const statements = newMappings.map(m =>
      db.prepare('INSERT INTO channel_type_mapping (channel_name, group_title, type, description) VALUES (?, ?, ?, ?)')
        .bind(m.channel_name || '', m.group_title || '', m.type || '', m.description || '')
    );
    await db.batch(statements);
  }
}

// 
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

// 
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

// CTV
//  emoji 
function removeEmoji(str) {
  if (!str) return str;
  //  emoji 
  return str.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{200D}]|[\u{20E3}]|[\u{E0020}-\u{E007F}]/gu, '');
}

function normalizeChannelName(name) {
  if (!name) return name;

  // CCTVcctv[-\s+]?(\d{1,2})(\+)? €?///
  const cctvRegex = /^cctv[-\s+]?(\d{1,2})(\+)?\b([\u4e00-\u9fa5A-Za-z0-9\s-]*)?/iu;
  
  const match = name.match(cctvRegex);
  if (match) {
    const num = parseInt(match[1]);
    const plus = match[2] || '';
    // 1-17CTV
    if (num >= 1 && num <= 17) {
      const newName = 'CCTV' + num + plus;
      if (match[3] && match[3].trim()) {
        // ""?4K"
        return newName + match[3];
      }
      return newName;
    }
  }

  return name;
}

//  ->  -> €ぇ
function customChannelSort(a, b) {
  const nameA = a.channel_name || '';
  const nameB = b.channel_name || '';

  // CCTV?
  const cctvMatchA = nameA.match(/^([A-Za-z]+)(\d+)/);
  const cctvMatchB = nameB.match(/^([A-Za-z]+)(\d+)/);

  // CCTV?ぇ?
  if (cctvMatchA && cctvMatchB && cctvMatchA[1].toUpperCase() === cctvMatchB[1].toUpperCase()) {
    const numA = parseInt(cctvMatchA[2]);
    const numB = parseInt(cctvMatchB[2]);
    if (numA !== numB) {
      return numA - numB;
    }
    // ?
    const suffixA = nameA.substring(cctvMatchA[1].length + cctvMatchA[2].length);
    const suffixB = nameB.substring(cctvMatchB[1].length + cctvMatchB[2].length);

    // €€€
    const hasSuffixA = suffixA.trim().length > 0;
    const hasSuffixB = suffixB.trim().length > 0;
    if (hasSuffixA !== hasSuffixB) {
      return hasSuffixA ? 1 : -1;
    }

    // ℃
    return suffixA.localeCompare(suffixB, 'zh-CN', { numeric: true });
  }

  // €﹂€
  for (let i = 0; i < Math.min(nameA.length, nameB.length); i++) {
    const charA = nameA.charCodeAt(i);
    const charB = nameB.charCodeAt(i);

    //  (A-Z, a-z: 65-90, 97-122)
    const isAlphaA = (charA >= 65 && charA <= 90) || (charA >= 97 && charA <= 122);
    const isAlphaB = (charB >= 65 && charB <= 90) || (charB >= 97 && charB <= 122);

    //  (0-9: 48-57)
    const isDigitA = charA >= 48 && charA <= 57;
    const isDigitB = charB >= 48 && charB <= 57;

    //  (\u4e00-\u9fa5: 19968-40869)
    const isChineseA = charA >= 19968 && charA <= 40869;
    const isChineseB = charB >= 19968 && charB <= 40869;

    // э=1, =2, =3
    const typeA = isAlphaA ? 1 : (isDigitA ? 2 : (isChineseA ? 3 : 4));
    const typeB = isAlphaB ? 1 : (isDigitB ? 2 : (isChineseB ? 3 : 4));

    // ?
    if (typeA !== typeB) {
      return typeA - typeB;
    }

    // ﹀€?
    if (charA !== charB) {
      return charA - charB;
    }
  }

  // €﹂
  return nameA.length - nameB.length;
}

// ｆM3U?
export async function parseM3UContent(content, sourceId, filter = {}) {
  const db = getDB();
  const channels = [];
  let globalHeaders = {};
  
  // ㄤらRL?
  const processedUrls = new Set();

  //  sourceId ?
  sourceId = parseInt(sourceId);
  if (isNaN(sourceId) || sourceId <= 0) {
    throw new Error('Invalid source ID');
  }

  // ㄥ℃ser-Agent
  const extm3uMatch = content.match(/^#EXTM3U\s*(.*)$/m);
  if (extm3uMatch) {
    const extm3uLine = extm3uMatch[1];
    //  user-agent="..."
    const uaMatch = extm3uLine.match(/user-agent\s*=\s*"([^"]+)"/i);
    if (uaMatch) {
      globalHeaders['User-Agent'] = uaMatch[1];
    }
  }

  //  #EXTINF ?
  const blocks = content.split(/^#EXTINF:/m);
  console.log(`[Sync] Found ${blocks.length - 1} potential channels in M3U`);

  // ┖#EXTM3U
  for (const block of blocks) {
    if (!block.trim()) continue;

    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    const currentChannel = {
      source_id: sourceId,
      headers: {...globalHeaders}
    };

    // ｆ EXTINF ?
    const extinfLine = '#EXTINF:' + lines[0];

    // О - €€?URL 
    const nameMatch = extinfLine.match(/,([^,\n]+)$/);
    if (nameMatch) {
      currentChannel.channel_name = nameMatch[1].trim();
      // CTV
      currentChannel.channel_name = normalizeChannelName(currentChannel.channel_name);
    } else {
      // ℃ tvg-id 
      const idMatch = extinfLine.match(/tvg-id="([^"]+)"/i);
      if (idMatch) {
        currentChannel.channel_name = idMatch[1].trim();
        // 
        currentChannel.channel_name = normalizeChannelName(currentChannel.channel_name);
      } else {
        // ℃ "Unknown" ?URL ?
        currentChannel.channel_name = 'Unknown';
        console.warn('[Sync] No channel name found for line:', extinfLine.substring(0, 100));
      }
    }

    // 
    const groupMatch = extinfLine.match(/group-title\s*=\s*"([^"]+)"/i);
    if (groupMatch) {
      currentChannel.group_title = removeEmoji(groupMatch[1]);
    }

    // logo
    const logoMatch = extinfLine.match(/tvg-logo\s*=\s*"([^"]+)"/i);
    if (logoMatch) {
      currentChannel.logo = logoMatch[1];
    }

    //  tvg-type
    const typeMatch = extinfLine.match(/tvg-type\s*=\s*"([^"]+)"/i);
    if (typeMatch) {
      currentChannel.tvg_type = typeMatch[1];
    }

    //  original 
    const originalMatch = extinfLine.match(/original\s*=\s*"([^"]+)"/i);
    if (originalMatch) {
      currentChannel.original = originalMatch[1];
    }
    
    //  tvg-desc- ?
    const descMatch = extinfLine.match(/tvg-desc\s*=\s*"([^"]+)"/i);
    if (descMatch) {
      currentChannel.description = descMatch[1];
    }

    //  EXTINF ?http-user-agentaser_agent
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

    //  http-header (: http-header="Key=Value" ?http-header="Key: Value")
    const httpHeaderMatch = extinfLine.match(/http-header\s*=\s*"([^"]+)"/i);
    if (httpHeaderMatch) {
      //  = PTV?
      let parts = httpHeaderMatch[1].split('=', 2);
      //  = ?: 
      if (parts.length !== 2 || parts[0].trim() === '') {
        parts = httpHeaderMatch[1].split(':', 2);
      }
      if (parts.length === 2) {
        const headerKey = parts[0].trim();
        const headerValue = parts[1].trim();
        currentChannel.headers[headerKey] = headerValue;
      }
    }

    //  Referer?http-referer ?referer ょ?
    const httpRefererMatch = extinfLine.match(/http-referer\s*=\s*"([^"]+)"/i);
    if (httpRefererMatch) {
      currentChannel.headers['Referer'] = httpRefererMatch[1];
    }
    const refererMatch = extinfLine.match(/(?:^|[^-])referer\s*=\s*"([^"]+)"/i);
    if (refererMatch) {
      currentChannel.headers['Referer'] = refererMatch[1];
    }

    // ユ URL  # €
    let urlLine = null;
    let vlcOptProcessed = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      //  EXTVLCOPT ?URL ?
      if (!vlcOptProcessed && line.startsWith('#EXTVLCOPT:')) {
        //  http-user-agent
        const vlcUAMatch = line.match(/http-user-agent\s*=\s*([^\r\n]+)/i);
        if (vlcUAMatch) {
          currentChannel.headers['User-Agent'] = vlcUAMatch[1];
        }
        //  Referer
        const vlcRefererMatch = line.match(/http-referrer\s*=\s*([^\r\n]+)/i);
        if (vlcRefererMatch) {
          currentChannel.headers['Referer'] = vlcRefererMatch[1];
        }
        vlcOptProcessed = true;
        continue;
      }

      //  URL ?
      if (!line.startsWith('#') && line) {
        urlLine = line;
        break;
      }
    }

    if (!urlLine) continue;

    currentChannel.play_url = urlLine;

    // URLser-Agent
    try {
      const urlObj = new URL(urlLine);
      if (urlObj.searchParams.has('User-Agent')) {
        currentChannel.headers['User-Agent'] = urlObj.searchParams.get('User-Agent');
      }
    } catch (e) {
      // URLｆ
    }

    // ′?
    if (filter) {
      // ?
      if (filter.excludeGroups && filter.excludeGroups.length > 0) {
        if (currentChannel.group_title && filter.excludeGroups.some(keyword =>
          currentChannel.group_title.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding group: "${currentChannel.group_title}" (matched keyword: ${filter.excludeGroups.find(k => currentChannel.group_title.toLowerCase().includes(k.toLowerCase()))})`);
          continue;
        }
      }

      // 
      if (filter.excludeUrls && filter.excludeUrls.length > 0) {
        if (currentChannel.play_url && filter.excludeUrls.some(keyword =>
          currentChannel.play_url.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding URL: "${currentChannel.play_url}" (matched keyword: ${filter.excludeUrls.find(k => currentChannel.play_url.toLowerCase().includes(k.toLowerCase()))})`);
          continue;
        }
      }

      // ?
      if (filter.excludeNames && filter.excludeNames.length > 0) {
        if (currentChannel.channel_name && filter.excludeNames.some(keyword =>
          currentChannel.channel_name.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding channel: "${currentChannel.channel_name}" (matched keyword: ${filter.excludeNames.find(k => currentChannel.channel_name.toLowerCase().includes(k.toLowerCase()))})`);
          continue;
        }
      }

      // 
      if (filter.excludeDuplicateUrls && currentChannel.play_url) {
        if (processedUrls.has(currentChannel.play_url)) {
          console.log(`[Filter] Excluding duplicate URL: "${currentChannel.play_url}"`);
          continue;
        }
        processedUrls.add(currentChannel.play_url);
      }

      // €
      if (currentChannel.group_title && filter.groupRenameRules && filter.groupRenameRules.length > 0) {
        // €ユ﹀〃?
        const shouldExclude = filter.groupRenameExclude && filter.groupRenameExclude.length > 0 &&
          filter.groupRenameExclude.some(exclude => 
            currentChannel.group_title.toLowerCase().includes(exclude.toLowerCase())
          );
        
        if (!shouldExclude) {
          // 
          for (const rule of filter.groupRenameRules) {
            if (currentChannel.group_title.toLowerCase().includes(rule.keyword.toLowerCase())) {
              const originalGroup = currentChannel.group_title;
              currentChannel.group_title = rule.newName;
              console.log(`[Group Rename] "${originalGroup}" -> "${rule.newName}" (matched keyword: "${rule.keyword}")`);
              break; // ㄧ€
            }
          }
        }
      }
    }

    // ========== Type ㄦ ==========
    // ? 1. tvg-type   2. channel_name ? 3. ?
    const inferredTypes = new Set();

    // 1. ?tvg-type type
    if (currentChannel.tvg_type && filter.typeMappingConfig) {
      const mappedType = filter.typeMappingConfig[currentChannel.tvg_type.toLowerCase()];
      if (mappedType) {
        inferredTypes.add(mappedType);
      } else {
        // ㄤ℃€€
        inferredTypes.add(currentChannel.tvg_type.toLowerCase());
      }
    } else if (currentChannel.tvg_type) {
      //  tvg-type€?
      inferredTypes.add(currentChannel.tvg_type.toLowerCase());
    }

    // 2.  channel_name （）
    const channelName = currentChannel.channel_name || '';
    const CHANNEL_TYPE_KEYWORDS = [
      { keywords: ['', '', '', ''], type: 'movie' },
      { keywords: ['', '', '', ''], type: 'animation' },
      { keywords: [''], type: 'entertainment' },
      { keywords: ['', '', '', '', '', '', '', '', '', ''], type: 'sports' },
      { keywords: ['', '', ''], type: 'news' },
      { keywords: ['', '', '', ''], type: 'kids' },
      { keywords: ['', '', '', ''], type: 'documentary' },
      { keywords: ['', '', '', '', ''], type: 'education' },
      { keywords: ['', '', '', '', '', ''], type: 'drama' },
      { keywords: ['', 'MV', '', '', ''], type: 'music' },
    ];

    for (const rule of CHANNEL_TYPE_KEYWORDS) {
      if (rule.keywords.some(kw => channelName.includes(kw))) {
        inferredTypes.add(rule.type);
      }
    }

    // 3.  type
    currentChannel.type = Array.from(inferredTypes).join(',');

    // channel_hash (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(urlLine);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    currentChannel.channel_hash = hashHex.substring(0, 8); // 8

    // €€ null/undefined 
    currentChannel.channel_name = currentChannel.channel_name || 'Unknown';
    currentChannel.group_title = currentChannel.group_title || '';
    currentChannel.logo = currentChannel.logo || '';

    // eadersJSON┖★
    currentChannel.headers = Object.keys(currentChannel.headers).length > 0
      ? JSON.stringify(currentChannel.headers)
      : JSON.stringify({});

    // ︼D1 ?1MB?
    if (currentChannel.channel_name && currentChannel.channel_name.length > 500) {
      currentChannel.channel_name = currentChannel.channel_name.substring(0, 500);
    }
    if (currentChannel.play_url && currentChannel.play_url.length > 2000) {
      console.warn(`[Sync] URL too long, truncating: ${currentChannel.play_url.substring(0, 50)}...`);
      continue; // RL
    }
    if (currentChannel.logo && currentChannel.logo.length > 500) {
      currentChannel.logo = currentChannel.logo.substring(0, 500);
    }

    channels.push(currentChannel);
  }

  // ユ～typeescription?
  //  channel_name + group_title ?
  const typeMap = new Map(); // key: channel_name, value: {type, description}
  const typeMapWithGroup = new Map(); // key: channel_name + '|' + group_title, value: {type, description}
  try {
    const mappingRows = await db.prepare('SELECT channel_name, group_title, type, description FROM channel_type_mapping').all();
    if (mappingRows.results) {
      for (const row of mappingRows.results) {
        const key = row.channel_name + '|' + (row.group_title || '');
        typeMapWithGroup.set(key, { type: row.type, description: row.description || '' });
        // ?channel_name ?group_title ‘?
        if (!typeMap.has(row.channel_name)) {
          typeMap.set(row.channel_name, { type: row.type, description: row.description || '' });
        }
      }
    }
    console.log(`[Sync] Loaded ${typeMapWithGroup.size} channel type mappings (with group)`);
  } catch (e) {
    console.warn('[Sync] Failed to load channel type mapping:', e.message);
  }

  // ?batch API
  console.log(`[Sync] Starting batch insert for ${channels.length} channels`);

  //  ->  -> ?
  if (channels.length > 0) {
    // ?
    channels.sort((a, b) => {
      const groupA = a.group_title || '';
      const groupB = b.group_title || '';
      if (groupA !== groupB) {
        return groupA.localeCompare(groupB, 'zh-CN', { numeric: true });
      }
      // ㄨ
      return customChannelSort(a, b);
    });
    console.log(`[Sync] Channels sorted`);
  }

  if (channels.length > 0) {
    const BATCH_SIZE = 500; // 500?
    let processedCount = 0;

    // D1 ?batch API ㄤ?BEGIN/COMMIT
    // 
    try {
      for (let i = 0; i < channels.length; i += BATCH_SIZE) {
        const batch = channels.slice(i, i + BATCH_SIZE);
        const statements = batch.map(channel => {
          // э?> M3U tvg-desc > ?
          // ㄦ〃ypeescription?channel_name + group_title?
          // ㄤ channel_name €M3Uｆtypeescription
          const compositeKey = channel.channel_name + '|' + (channel.group_title || '');
          let type = channel.type || '';
          let description = channel.description || '';  // ヨM3Uvg-desc

          if (typeMapWithGroup.has(compositeKey)) {
            const mapped = typeMapWithGroup.get(compositeKey);
            type = mapped.type;
            description = mapped.description;  // 〃?
          } else if (typeMap.has(channel.channel_name)) {
            const mapped = typeMap.get(channel.channel_name);
            type = mapped.type || type;
            description = mapped.description || description;  // ㄦ∕3U?
          }

          return db.prepare(`
            INSERT INTO channels (source_id, channel_name, group_title, type, description, logo, play_url, headers, channel_hash, is_active, original)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            channel.source_id,
            channel.channel_name,
            channel.group_title || '',
            type,
            description,
            channel.logo || '',
            channel.play_url,
            channel.headers,
            channel.channel_hash,
            1,  // is_active value
            channel.original || ''  // original column value
          );
        });

        try {
          await db.batch(statements);
          processedCount += batch.length;
          console.log(`[Sync] Batch processed: ${processedCount}/${channels.length}`);
        } catch (batchError) {
          console.error(`[Sync] Batch insert error at batch ${i}:`, batchError);
          // けョㄤ
          if (batch.length > 0) {
            console.error('[Sync] First channel data:', batch[0]);
          }
          // D1 ?batch けヤ
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

// В3Uㄤラ€?
export async function parseM3UContentOnly(content, sourceId, filter = {}) {
  const channels = [];
  let globalHeaders = {};

  // ㄤらRL?
  const processedUrls = new Set();

  //  sourceId ?
  sourceId = parseInt(sourceId);
  if (isNaN(sourceId) || sourceId <= 0) {
    throw new Error('Invalid source ID');
  }

  // ㄥ℃ser-Agent
  const extm3uMatch = content.match(/^#EXTM3U\s*(.*)$/m);
  if (extm3uMatch) {
    const extm3uLine = extm3uMatch[1];
    const uaMatch = extm3uLine.match(/user-agent\s*=\s*"([^"]+)"/i);
    if (uaMatch) {
      globalHeaders['User-Agent'] = uaMatch[1];
    }
  }

  //  #EXTINF ?
  const blocks = content.split(/^#EXTINF:/m);
  console.log(`[Sync] Found ${blocks.length - 1} potential channels in M3U`);

  // ┖#EXTM3U
  for (const block of blocks) {
    if (!block.trim()) continue;

    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    const currentChannel = {
      source_id: sourceId,
      headers: {...globalHeaders}
    };

    // ｆ EXTINF ?
    const extinfLine = '#EXTINF:' + lines[0];

    // О
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

    // 
    const groupMatch = extinfLine.match(/group-title\s*=\s*"([^"]+)"/i);
    if (groupMatch) {
      currentChannel.group_title = removeEmoji(groupMatch[1]);
    }

    // logo
    const logoMatch = extinfLine.match(/tvg-logo\s*=\s*"([^"]+)"/i);
    if (logoMatch) {
      currentChannel.logo = logoMatch[1];
    }

    //  tvg-id, tvg-name, tvg-logo, tvg-chno
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

    //  tvg-type
    const tvgTypeMatch = extinfLine.match(/tvg-type\s*=\s*"([^"]+)"/i);
    if (tvgTypeMatch) {
      currentChannel.tvg_type = tvgTypeMatch[1];
    }

    //  http-user-agentaser_agent
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

    //  http-header
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

    //  Referer
    const httpRefererMatch = extinfLine.match(/http-referer\s*=\s*"([^"]+)"/i);
    if (httpRefererMatch) {
      currentChannel.headers['Referer'] = httpRefererMatch[1];
    }
    const refererMatch = extinfLine.match(/(?:^|[^-])referer\s*=\s*"([^"]+)"/i);
    if (refererMatch) {
      currentChannel.headers['Referer'] = refererMatch[1];
    }

    // ユ URL ?
    let urlLine = null;
    let vlcOptProcessed = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!vlcOptProcessed && line.startsWith('#EXTVLCOPT:')) {
        const vlcUAMatch = line.match(/http-user-agent\s*=\s*([^\r\n]+)/i);
        if (vlcUAMatch) {
          currentChannel.headers['User-Agent'] = vlcUAMatch[1];
        }
        const vlcRefererMatch = line.match(/http-referrer\s*=\s*([^\r\n]+)/i);
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

    // ′
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

    // ========== Type ㄦ ==========
    // ? 1. tvg-type   2. channel_name ? 3. ?
    const inferredTypes = new Set();

    // 1. ?tvg-type type
    if (currentChannel.tvg_type && filter.typeMappingConfig) {
      const mappedType = filter.typeMappingConfig[currentChannel.tvg_type.toLowerCase()];
      if (mappedType) {
        inferredTypes.add(mappedType);
      } else {
        inferredTypes.add(currentChannel.tvg_type.toLowerCase());
      }
    } else if (currentChannel.tvg_type) {
      inferredTypes.add(currentChannel.tvg_type.toLowerCase());
    }

    // 2.  channel_name （）
    const channelName = currentChannel.channel_name || '';
    const CHANNEL_TYPE_KEYWORDS = [
      { keywords: ['', '', '', ''], type: 'movie' },
      { keywords: ['', '', '', ''], type: 'animation' },
      { keywords: [''], type: 'entertainment' },
      { keywords: ['', '', '', '', '', '', '', '', '', ''], type: 'sports' },
      { keywords: ['', '', ''], type: 'news' },
      { keywords: ['', '', '', ''], type: 'kids' },
      { keywords: ['', '', '', ''], type: 'documentary' },
      { keywords: ['', '', '', '', ''], type: 'education' },
      { keywords: ['', '', '', '', '', ''], type: 'drama' },
      { keywords: ['', 'MV', '', '', ''], type: 'music' },
    ];

    for (const rule of CHANNEL_TYPE_KEYWORDS) {
      if (rule.keywords.some(kw => channelName.includes(kw))) {
        inferredTypes.add(rule.type);
      }
    }

    // 3.  type
    currentChannel.type = Array.from(inferredTypes).join(',');

    // channel_hash
    const encoder = new TextEncoder();
    const data = encoder.encode(urlLine);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    currentChannel.channel_hash = hashHex.substring(0, 8);

    // 
    currentChannel.channel_name = currentChannel.channel_name || 'Unknown';
    currentChannel.group_title = currentChannel.group_title || '';
    currentChannel.logo = currentChannel.logo || '';
    currentChannel.url = currentChannel.play_url;
    currentChannel.hash = currentChannel.channel_hash;

    // eadersJSON┖★
    currentChannel.headers = Object.keys(currentChannel.headers).length > 0
      ? JSON.stringify(currentChannel.headers)
      : JSON.stringify({});

    // 
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

  // ?
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

// RLM3UВВユ?
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

    // €?
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

// RLM3UВ?
export async function fetchAndParseM3U(sourceUrl, sourceId, filter = null) {
  try {
    console.log(`[Sync] Fetching M3U from: ${sourceUrl} for source ID: ${sourceId}`);
    if (filter) {
      console.log(`[Sync] Filters:`, filter);
    }
    
    const fetchStartTime = Date.now();
    let response;
    try {
      response = await fetch(sourceUrl);
    } catch (fetchError) {
      console.error(`[Sync] Fetch error: ${fetchError.message}`);
      throw new Error(`Fetch failed: ${fetchError.message}`);
    }
    const fetchEndTime = Date.now();
    console.log(`[Sync] Fetch completed in ${fetchEndTime - fetchStartTime}ms, status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    console.log(`[Sync] M3U content size: ${content.length} bytes`);

    // €ュ︿€┖
    const trimmedContent = content.trimStart();
    if (!trimmedContent || !trimmedContent.startsWith('#EXTM3U')) {
      console.error(`[Sync] Invalid M3U content: starts with ${trimmedContent ? trimmedContent.substring(0, 50) : 'empty'}...`);
      throw new Error('Invalid M3U content');
    }

    const parseStartTime = Date.now();
    const channelCount = await parseM3UContent(content, sourceId, filter);
    const parseEndTime = Date.now();
    console.log(`[Sync] Parse completed in ${parseEndTime - parseStartTime}ms`);

    // € JavaScript ?
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
    const errorMsg = error.message || 'Unknown error';
    return { success: false, error: errorMsg };
  }
}

// S
export async function getActiveAdTsFile(adType = null) {
  const db = getDB();

  let query = 'SELECT * FROM ad_ts_files WHERE is_active = 1';
  const params = [];

  if (adType) {
    query += ' AND ad_type = ?';
    params.push(adType);
  }

  // €
  const adTsFiles = await db.prepare(query).bind(...params).all();
  const ads = adTsFiles.results || [];

  if (ads.length === 0) {
    return null;
  }

  // €?
  const randomIndex = Math.floor(Math.random() * ads.length);
  return ads[randomIndex];
}

/**
 * 
 * @param {string} actionType - 
 * @returns {object|null} 
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
 * 
 * @param {object} data - 
 * @returns {object} ?
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
 * 
 * @param {number} id - ID
 * @param {object} data - 
 * @returns {boolean} 
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
 * 
 * @param {number} id - ID
 * @returns {boolean} 
 */
export async function deleteAdBinding(id) {
  const db = getDB();

  await db.prepare('DELETE FROM ad_bindings WHERE id = ?').bind(id).run();
  return true;
}

/**
 * €?
 * @returns {array} 〃
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
 * ュ
 * @param {string} actionType - 
 * @param {string} clientIP - P
 * @returns {object|null} 
 */
export async function getBoundAdByAction(actionType, clientIP) {
  const db = getDB();

  const binding = await getAdBinding(actionType);
  if (!binding) {
    return null;
  }

  // ℃IDull?
  if (!binding.ad_id) {
    return null;
  }

  console.log(`[AdBinding] Checking cooldown for action: ${actionType}, IP: ${clientIP}, cooldown: ${binding.cooldown_seconds}s`);

  // €ュ?
  if (binding.cooldown_seconds > 0) {
    // SQLiteatetime＄‘?
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
      // ㄥnull
      console.log(`[AdBinding] In cooldown period for ${actionType}, last played: ${recentPlay.last_played_at}`);
      return null;
    }
  }

  // ュ
  await db.prepare(`
    INSERT INTO ad_play_logs (action_type, client_ip, played_at)
    VALUES (?, ?, datetime('now'))
  `).bind(actionType, clientIP).run();

  console.log(`[AdBinding] Ad logged for action: ${actionType}, IP: ${clientIP}`);

  // ?
  if (binding.ad_content) {
    return {
      id: binding.ad_id,
      name: binding.ad_name,
      content: binding.ad_content,
      ad_type: binding.ad_type,
      cooldown_seconds: binding.cooldown_seconds
    };
  }

  // d_idontent?
  const adFile = await db.prepare('SELECT * FROM ad_ts_files WHERE id = ? AND is_active = 1').bind(binding.ad_id).first();
  if (!adFile) {
    return null;
  }

  // ontentヨ?
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

  // RL╤andleAdTsFile
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
 * M3U8
 * @param {object} adTsFile - 
 * @param {string} redirectUrl - RL
 * @param {string} baseUrl - URLS?
 * @param {string} fullBaseUrl - €URL https://example.com?
 * @returns {string} M3U8
 */
export function generateAdM3U8(adTsFile, redirectUrl = null, baseUrl = '/api/ads', fullBaseUrl = null) {
  console.log('[AdM3U8] Generating M3U8 for ad:', adTsFile.id, 'baseUrl:', baseUrl, 'fullBaseUrl:', fullBaseUrl);

  // VLCｆ?
  const tsPath = `${baseUrl}/${adTsFile.id}.ts`;

  console.log('[AdM3U8] TS path:', tsPath);

  // M3U8 - join
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
 * €ㄤ?
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
 * M3U
 */
export function generateM3UContent(channels, subId, isFreeSub = false, baseUrl = '', domainBlacklist = []) {
  let m3u = '#EXTM3U\n';

  // ℃ㄩ
  if (isFreeSub) {
    m3u += '# Free Subscription\n';
  } else {
    m3u += '# Subscription\n';
  }
  m3u += `# ID: ${subId}\n`;
  m3u += `# Channels: ${channels.length}\n`;
  m3u += `# Generated: ${new Date().toISOString()}\n\n`;

  // 
  for (const channel of channels) {
    const headers = channel.headers ? JSON.parse(channel.headers) : {};

    let extinf = '#EXTINF:-1';
    if (channel.logo) {
      extinf += ` tvg-logo="${channel.logo}"`;
    }
    if (channel.group_title) {
      extinf += ` group-title="${channel.group_title}"`;
    }
    if (channel.type) {
      extinf += ` tvg-type="${channel.type}"`;
    }
    extinf += `,${channel.channel_name}\n`;

    m3u += extinf;

    // €ラRLㄥ?
    let playUrl;
    let isBlacklisted = false;

    if (channel.play_url) {
      try {
        const urlObj = new URL(channel.play_url);
        const hostname = urlObj.hostname;

        // €ュㄥ?
        isBlacklisted = domainBlacklist.includes(hostname);

        // €ュ*.example.com  sub.example.com?
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

    // 
    if (isFreeSub) {
      if (isBlacklisted) {
        // ㄩ€?
        playUrl = channel.play_url;
      } else {
        // ﹀ｇ
        const apiUrl = baseUrl || '/api';
        playUrl = `${apiUrl}/play/${channel.channel_hash}?freesub=${subId}`;
      }
    } else {
      // €€ヤㄥRL?
      // €ュ
      playUrl = channel.play_url;
    }

    m3u += `${playUrl}\n`;
  }

  return m3u;
}

// 
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

// ========== ?==========

/**
 * €
 */
export async function getDomainBlacklist() {
  const db = getDB();
  const result = await db.prepare('SELECT * FROM domain_blacklist ORDER BY created_at DESC').all();
  return result.results || [];
}

/**
 * 
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
 * 
 */
export async function removeDomainFromBlacklist(id) {
  const db = getDB();
  const result = await db.prepare('DELETE FROM domain_blacklist WHERE id = ?').bind(id).run();
  return result.meta.changes > 0;
}

/**
 * 
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
 * €ュ﹀
 */
export async function isDomainBlacklisted(playUrl) {
  const db = getDB();
  try {
    const url = new URL(playUrl);
    const hostname = url.hostname;

    // €ュㄥ?
    const exactMatch = await db.prepare('SELECT id FROM domain_blacklist WHERE domain = ?').bind(hostname).first();
    if (exactMatch) {
      return true;
    }

    // €ュ*.example.com  sub.example.com?
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
 * RL
 */
export function extractDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}

// ==================== Topics CRUD ====================

export async function getTopics() {
  const db = getDB();
  const result = await db.prepare('SELECT * FROM topics ORDER BY id DESC').all();
  return result.results || [];
}

export async function getTopic(id) {
  const db = getDB();
  return await db.prepare('SELECT * FROM topics WHERE id = ?').bind(id).first();
}

export async function createTopic(data) {
  const db = getDB();
  const result = await db.prepare(
    'INSERT INTO topics (name, description, rules) VALUES (?, ?, ?)'
  ).bind(
    data.name,
    data.description || '',
    JSON.stringify(data.rules || [])
  ).run();
  const id = result.meta.last_row_id;
  return getTopic(id);
}

export async function updateTopic(id, data) {
  const db = getDB();
  await db.prepare(
    'UPDATE topics SET name = ?, description = ?, rules = ? WHERE id = ?'
  ).bind(
    data.name,
    data.description || '',
    JSON.stringify(data.rules || []),
    id
  ).run();
  return getTopic(id);
}

export async function deleteTopic(id) {
  const db = getDB();
  // Check if any codes are using this topic
  const count = await db.prepare(
    'SELECT COUNT(*) as count FROM codes WHERE topic_id = ?'
  ).bind(id).first();
  if (count && count.count > 0) {
    return { success: false, error: '，' };
  }
  await db.prepare('DELETE FROM topics WHERE id = ?').bind(id).run();
  return { success: true };
}

export function applyTopicFilter(channels, rules) {
  if (!rules || !Array.isArray(rules) || rules.length === 0) {
    return channels;
  }

  //  include  exclude 
  const includeRules = rules.filter(r => r.op === 'include' && r.dimension && r.values);
  const excludeRules = rules.filter(r => r.op === 'exclude' && r.dimension && r.values);

  return channels.filter(channel => {
    //  exclude ： exclude ，
    for (const rule of excludeRules) {
      const { dimension, values } = rule;
      let fieldValue = '';
      if (dimension === 'group_title') fieldValue = channel.group_title || '';
      else if (dimension === 'original') fieldValue = channel.original || '';
      else if (dimension === 'type') fieldValue = channel.type || '';
      else continue;

      const isMatch = values.some(v =>
        dimension === 'original' ? fieldValue.includes(v) : fieldValue === v
      );
      if (isMatch) return false;
    }

    //  include ，
    if (includeRules.length > 0) {
      let anyIncludeMatch = false;
      for (const rule of includeRules) {
        const { dimension, values } = rule;
        let fieldValue = '';
        if (dimension === 'group_title') fieldValue = channel.group_title || '';
        else if (dimension === 'original') fieldValue = channel.original || '';
        else if (dimension === 'type') fieldValue = channel.type || '';
        else continue;

        const isMatch = values.some(v =>
          dimension === 'original' ? fieldValue.includes(v) : fieldValue === v
        );
        if (isMatch) {
          anyIncludeMatch = true;
          break;
        }
      }
      return anyIncludeMatch;
    }

    //  include ，
    return true;
  });
}

// ============  ============

/**
 *  [{name, hash, logo, group}]，hash 
 */
export async function getUserFavorites(userId) {
  const db = getDB();
  try {
    const result = await db.prepare(
      'SELECT favorites FROM user_favorites WHERE user_id = ?'
    ).bind(userId).first();
    if (!result || !result.favorites) return [];
    try {
      return JSON.parse(result.favorites);
    } catch (e) {
      console.error('[getUserFavorites] JSON parse error:', e.message);
      return [];
    }
  } catch (error) {
    console.error('[getUserFavorites] Error:', error);
    return [];
  }
}

/**
 * ：UPSERT  JSON （， D1 ）
 */
export async function saveUserFavorites(userId, favorites) {
  const db = getDB();
  try {
    // Dedup by channel_name
    const seen = {};
    const clean = [];
    for (const fav of (favorites || [])) {
      if (!fav || !fav.name) continue;
      if (seen[fav.name]) continue;
      seen[fav.name] = true;
      clean.push(fav);
    }

    const json = JSON.stringify(clean);
    await db.prepare(
      'INSERT INTO user_favorites (user_id, favorites) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET favorites = ?, updated_at = CURRENT_TIMESTAMP'
    ).bind(userId, json, json).run();
    console.log(`[saveUserFavorites] Saved ${clean.length} favorites for user ${userId}`);
  } catch (error) {
    console.error('[saveUserFavorites] Error:', error);
    throw error;
  }
}

export async function addFavoriteToUser(userId, channelHash, name = '', logo = '', group = '') {
  const db = getDB();
  try {
    await db.prepare(
      'INSERT OR IGNORE INTO user_favorites (user_id, channel_name, logo, `group`) VALUES (?, ?, ?, ?)'
    ).bind(userId, name, logo, group).run();
    return getUserFavorites(userId);
  } catch (error) {
    console.error('[addFavoriteToUser] Error:', error);
    throw error;
  }
}

export async function removeFavoriteFromUser(userId, channelName) {
  const db = getDB();
  try {
    await db.prepare(
      'DELETE FROM user_favorites WHERE user_id = ? AND channel_name = ?'
    ).bind(userId, channelName).run();
    return getUserFavorites(userId);
  } catch (error) {
    console.error('[removeFavoriteFromUser] Error:', error);
    throw error;
  }
}
