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
