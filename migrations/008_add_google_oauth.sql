-- Google OAuth 集成 - 添加用户表字段
-- 添加 google_id (Google 账号唯一标识)
-- 添加 avatar_url (用户头像)

-- 添加 google_id 字段（不带UNIQUE约束，避免有数据时冲突）
ALTER TABLE users ADD COLUMN google_id TEXT;

-- 添加 oauth_provider 字段标识认证提供商 ('email' 或 'google')
ALTER TABLE users ADD COLUMN oauth_provider TEXT DEFAULT 'email';

-- 添加 avatar_url 字段存储用户头像URL
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- 创建 google_id 唯一索引（D1限制：分步创建索引）
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- 创建 oauth_provider 索引（加速查询）
CREATE INDEX IF NOT EXISTS idx_users_oauth_provider ON users(oauth_provider);
ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE;

-- 添加 avatar_url 字段  
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- 添加 oauth_provider 字段标识认证提供商 ('email' 或 'google')
ALTER TABLE users ADD COLUMN oauth_provider TEXT DEFAULT 'email';

-- 创建 oauth_provider 索引 (加速查询)
CREATE INDEX IF NOT EXISTS idx_users_oauth_provider ON users(oauth_provider);

-- 创建 Google ID 索引 (加速查询)
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
