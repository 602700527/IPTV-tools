-- 为 codes 表添加订阅模式字段
-- sub_mode: NULL/空 = 全部频道, 'favorites' = 仅收藏夹
ALTER TABLE codes ADD COLUMN sub_mode TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_codes_sub_mode ON codes(sub_mode);

-- 创建用户收藏表（服务端存储）
CREATE TABLE IF NOT EXISTS user_favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  channel_hash TEXT NOT NULL,
  name TEXT,
  logo TEXT,
  group TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, channel_hash),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_channel_hash ON user_favorites(channel_hash);
