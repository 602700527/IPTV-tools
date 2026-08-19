-- 创建直播源配置表
CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, 
  url TEXT, 
  type TEXT DEFAULT 'm3u',
  parse_mode TEXT DEFAULT 'strict',
  last_updated DATETIME
);

-- 创建频道表
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
);

-- 创建频道哈希索引（播放验证必需）
CREATE INDEX IF NOT EXISTS idx_channel_hash ON channels(channel_hash);

-- 删除单列索引（被组合索引覆盖）
-- DROP INDEX IF EXISTS idx_channels_is_active;
-- DROP INDEX IF EXISTS idx_channels_source_id;

-- 创建频道is_active+source_id组合索引（核心查询索引，覆盖大部分JOIN和过滤查询）
CREATE INDEX IF NOT EXISTS idx_channels_active_source ON channels(is_active, source_id);

-- 创建频道group_title索引（分组查询必需）
CREATE INDEX IF NOT EXISTS idx_channels_group_title ON channels(group_title);

-- 注意: 已删除 idx_channels_group_title_notnull 索引以减少写入开销
-- 该索引对DISTINCT查询的优化有限，idx_channels_group_title 已足够

-- 创建源is_active索引（优化订阅查询）
CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active);

-- 创建卡密表
CREATE TABLE IF NOT EXISTS codes (
  code TEXT PRIMARY KEY, 
  status TEXT DEFAULT 'unused',
  duration_days INTEGER, 
  activated_at DATETIME, 
  expired_at DATETIME,
  max_ips INTEGER DEFAULT 3,
  sub_mode TEXT DEFAULT NULL,
  remark TEXT
);

-- 创建卡密状态索引
CREATE INDEX IF NOT EXISTS idx_code_status ON codes(status);

-- 创建播放记录表（只记录IP用于并发检测，10分钟后自动清理）
CREATE TABLE IF NOT EXISTS play_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  channel_hash TEXT NOT NULL,
  client_ip TEXT,
  played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_date DATE DEFAULT (DATE('now'))
);

-- 创建播放记录索引
CREATE INDEX IF NOT EXISTS idx_play_logs_code ON play_logs(code);
CREATE INDEX IF NOT EXISTS idx_play_logs_code_date ON play_logs(code, created_date);
CREATE INDEX IF NOT EXISTS idx_play_logs_code_hash_date ON play_logs(code, channel_hash, created_date);

-- 创建播放计数表（每个频道每天只有1条记录）
CREATE TABLE IF NOT EXISTS play_counts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  channel_hash TEXT NOT NULL,
  play_count INTEGER DEFAULT 0,
  created_date DATE DEFAULT (DATE('now')),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(code, channel_hash, created_date)
);

-- 创建播放计数索引
CREATE INDEX IF NOT EXISTS idx_play_counts_unique ON play_counts(code, channel_hash, created_date);

-- 创建IP访问记录表
CREATE TABLE IF NOT EXISTS ip_access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  path TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  first_access DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_access DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_date DATE DEFAULT (DATE('now'))
);

-- 创建IP访问记录索引
CREATE INDEX IF NOT EXISTS idx_ip_access_logs_ip_date ON ip_access_logs(ip, created_date);
CREATE INDEX IF NOT EXISTS idx_ip_access_logs_ip_path_date ON ip_access_logs(ip, path, created_date);

-- 创建IP黑名单表
CREATE TABLE IF NOT EXISTS ip_blacklist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL UNIQUE,
  banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reason TEXT,
  details TEXT,
  permanent BOOLEAN DEFAULT 1
);

-- 创建IP黑名单索引
CREATE INDEX IF NOT EXISTS idx_ip_blacklist_ip ON ip_blacklist(ip);

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建邮箱索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 创建邮箱验证码表
CREATE TABLE IF NOT EXISTS email_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  is_used BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建验证码索引
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_code ON email_verifications(code);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires ON email_verifications(expires_at);

-- 创建用户会话表
CREATE TABLE IF NOT EXISTS user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建会话索引
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- 创建用户订单表
CREATE TABLE IF NOT EXISTS user_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  order_id TEXT UNIQUE NOT NULL,
  code TEXT,
  duration_days INTEGER,
  amount REAL,
  status TEXT DEFAULT 'completed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建订单索引
CREATE INDEX IF NOT EXISTS idx_user_orders_user_id ON user_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_user_orders_order_id ON user_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_user_orders_created ON user_orders(created_at DESC);

-- 创建已使用token表
CREATE TABLE IF NOT EXISTS used_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME
);

-- 创建已使用token索引
CREATE INDEX IF NOT EXISTS idx_used_tokens_token ON used_tokens(token);

-- 创建公告表
CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  enabled BOOLEAN DEFAULT 1,
  display_frequency TEXT DEFAULT 'once',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建公告索引
CREATE INDEX IF NOT EXISTS idx_announcements_enabled ON announcements(enabled);
CREATE INDEX IF NOT EXISTS idx_announcements_updated ON announcements(updated_at DESC);

-- 创建订阅IP记录表（记录卡密的订阅IP，用于验证播放请求）
CREATE TABLE IF NOT EXISTS subscription_ips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  client_ip TEXT NOT NULL,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_date DATE DEFAULT (DATE('now'))
);

-- 创建订阅IP记录索引
CREATE INDEX IF NOT EXISTS idx_subscription_ips_code_date ON subscription_ips(code, created_date);
CREATE INDEX IF NOT EXISTS idx_subscription_ips_code_ip_date ON subscription_ips(code, client_ip, created_date);

-- 免费订阅表
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
);

-- 免费订阅索引
CREATE INDEX IF NOT EXISTS idx_free_subscriptions_sub_id ON free_subscriptions(sub_id);
CREATE INDEX IF NOT EXISTS idx_free_subscriptions_ip ON free_subscriptions(ip);
CREATE INDEX IF NOT EXISTS idx_free_subscriptions_fingerprint ON free_subscriptions(fingerprint);
CREATE INDEX IF NOT EXISTS idx_free_subscriptions_expired_at ON free_subscriptions(expired_at);
CREATE INDEX IF NOT EXISTS idx_free_subscriptions_ip_fingerprint ON free_subscriptions(ip, fingerprint);

-- 签到记录表
CREATE TABLE IF NOT EXISTS checkin_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscription_id INTEGER NOT NULL,
  checkin_date TEXT NOT NULL,
  reward_days INTEGER DEFAULT 1,
  consecutive_days INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(subscription_id) REFERENCES free_subscriptions(id) ON DELETE CASCADE,
  UNIQUE(subscription_id, checkin_date)
);

-- 签到记录索引
CREATE INDEX IF NOT EXISTS idx_checkin_records_subscription_id ON checkin_records(subscription_id);
CREATE INDEX IF NOT EXISTS idx_checkin_records_date ON checkin_records(checkin_date DESC);
CREATE INDEX IF NOT EXISTS idx_checkin_records_subscription_date ON checkin_records(subscription_id, checkin_date);

-- 广告绑定表
CREATE TABLE IF NOT EXISTS ad_bindings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action_type TEXT NOT NULL, -- 操作类型：code_normal（卡密正常播放）、code_expired（卡密过期播放）、code_unauth（卡密IP未授权）、code_channel_not_found（频道不存在卡密播放）、freesub_normal（免费订阅正常播放）、freesub_expired（免费订阅过期播放）、freesub_channel_not_found（频道不存在免费播放）
  ad_id INTEGER, -- 绑定的广告ID（可选，为空则随机选择）
  cooldown_seconds INTEGER DEFAULT 0, -- 冷却时间（秒），为0则不限制
  priority INTEGER DEFAULT 0, -- 优先级，数字越大优先级越高
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(ad_id) REFERENCES ad_ts_files(id) ON DELETE SET NULL
);

-- 广告绑定索引
CREATE INDEX IF NOT EXISTS idx_ad_bindings_action ON ad_bindings(action_type);
CREATE INDEX IF NOT EXISTS idx_ad_bindings_priority ON ad_bindings(priority DESC);
CREATE INDEX IF NOT EXISTS idx_ad_bindings_ad_id ON ad_bindings(ad_id);

-- IP直连播放链接表（无需卡密，IP绑定限制最多3个IP）
CREATE TABLE IF NOT EXISTS ip_play_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  link_id TEXT NOT NULL UNIQUE,
  creator_ip TEXT NOT NULL,
  channel_hash TEXT NOT NULL,
  used_ips TEXT DEFAULT '[]',
  used_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME
);

-- IP直连播放链接索引
CREATE INDEX IF NOT EXISTS idx_ip_play_links_link_id ON ip_play_links(link_id);
CREATE INDEX IF NOT EXISTS idx_ip_play_links_creator_ip ON ip_play_links(creator_ip);
CREATE INDEX IF NOT EXISTS idx_ip_play_links_channel_hash ON ip_play_links(channel_hash);

-- 用户收藏表（服务端存储，JSON blob 方案，每用户一行）
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id INTEGER PRIMARY KEY,
  favorites TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
