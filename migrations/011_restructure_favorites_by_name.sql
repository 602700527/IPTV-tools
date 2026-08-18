-- Migration 011: 重构 user_favorites 表，改为按 channel_name 存储
-- 原因：原设计存 channel_hash，但 hash 随 token 轮换失效；
--       改为存 channel_name，M3U 生成时动态查 channels 表获取最新 hash + play_url

-- SQLite 不支持 DROP COLUMN，需要重建表
CREATE TABLE IF NOT EXISTS user_favorites_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  channel_name TEXT NOT NULL,
  logo TEXT,
  \group\ TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, channel_name),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_user_favorites_new_user_id ON user_favorites_new(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_new_channel_name ON user_favorites_new(channel_name);

-- 迁移旧数据：用 name 字段回填（旧的 channel_hash 无法反推 name，直接丢弃）
INSERT OR IGNORE INTO user_favorites_new (user_id, channel_name, logo, \group\, created_at)
SELECT user_id, name, logo, group_name, created_at
FROM user_favorites;

DROP TABLE user_favorites;
ALTER TABLE user_favorites_new RENAME TO user_favorites;
