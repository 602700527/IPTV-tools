-- 添加商城设置表
CREATE TABLE IF NOT EXISTS mall_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初始化商城设置
INSERT OR IGNORE INTO mall_settings (key, value) VALUES
  ('mall_enabled', '1'),
  ('subscription_enabled', '1');

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_mall_settings_key ON mall_settings(key);
