-- 数据库迁移脚本：添加订阅模式功能
-- 执行顺序：先运行 ALTER TABLE，再运行 CREATE TABLE

-- 1. 为 codes 表添加 sub_mode 字段
ALTER TABLE codes ADD COLUMN sub_mode TEXT DEFAULT NULL;

-- 2. 创建用户收藏表（服务端存储）
CREATE TABLE IF NOT EXISTS user_favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  channel_hash TEXT NOT NULL,
  name TEXT,
  logo TEXT,
  group_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, channel_hash),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_channel_hash ON user_favorites(channel_hash);
