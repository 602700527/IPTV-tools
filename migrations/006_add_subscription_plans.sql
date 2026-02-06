-- 创建订阅套餐表
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_en TEXT,
  days INTEGER NOT NULL,
  base_price REAL NOT NULL,
  price_per_ip REAL NOT NULL,
  discount INTEGER DEFAULT 0,
  is_enabled BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建套餐索引
CREATE INDEX IF NOT EXISTS idx_subscription_plans_enabled ON subscription_plans(is_enabled, sort_order);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_days ON subscription_plans(days);

-- 插入默认套餐数据
INSERT OR IGNORE INTO subscription_plans (name, name_en, days, base_price, price_per_ip, discount, is_enabled, sort_order) VALUES
('1个月', '1 Month', 30, 29, 9, 0, 1, 1),
('3个月', '3 Months', 90, 79, 18, 0, 1, 2),
('半年', '6 Months', 180, 149, 28, 10, 1, 3),
('1年', '1 Year', 365, 279, 49, 20, 1, 4);
