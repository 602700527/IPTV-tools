-- 创建域名黑名单表
CREATE TABLE IF NOT EXISTS domain_blacklist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL UNIQUE,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建域名黑名单索引
CREATE INDEX IF NOT EXISTS idx_domain_blacklist_domain ON domain_blacklist(domain);
