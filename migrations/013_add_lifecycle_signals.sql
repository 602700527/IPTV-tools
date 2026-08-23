-- 13: 用户活跃信号 + 生命周期邮件去重
-- 给"客户成功"作为一等公民写进数据模型；PR-A 只采集不发送。
-- PR-B 将基于 lifecycle_emails 表 + expiry_reminded_at 字段做去重触达。

ALTER TABLE users ADD COLUMN last_seen_at DATETIME;
ALTER TABLE users ADD COLUMN last_login_ip TEXT;
ALTER TABLE user_orders ADD COLUMN expiry_reminded_at DATETIME;

CREATE TABLE IF NOT EXISTS lifecycle_emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  email_type TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  channel TEXT DEFAULT 'email',
  UNIQUE(user_id, email_type)
);

CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_codes_status_expired ON codes(status, expired_at);
CREATE INDEX IF NOT EXISTS idx_user_orders_expiry_reminded ON user_orders(expiry_reminded_at);