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

-- 创建频道哈希索引
CREATE INDEX IF NOT EXISTS idx_channel_hash ON channels(channel_hash);

-- 创建频道is_active索引（优化订阅查询）
CREATE INDEX IF NOT EXISTS idx_channels_is_active ON channels(is_active);

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
