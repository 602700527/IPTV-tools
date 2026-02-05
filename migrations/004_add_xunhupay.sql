-- 添加虎皮椒支付相关表
CREATE TABLE IF NOT EXISTS payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT 1,
  config TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS xunhupay_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  trade_order_id TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  amount REAL NOT NULL,
  duration_days INTEGER NOT NULL,
  max_ips INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  code TEXT,
  xunhupay_order_id TEXT,
  xunhupay_transaction_id TEXT,
  notify_received BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_order_id ON xunhupay_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_trade_order_id ON xunhupay_orders(trade_order_id);
CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_user_id ON xunhupay_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_xunhupay_orders_status ON xunhupay_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(type);

-- 初始化支付方式
INSERT OR IGNORE INTO payment_methods (type, name, enabled, config) VALUES
  ('alipay', '支付宝', 1, '{"app_id":"","app_secret":"","notify_url":""}'),
  ('wechat', '微信支付', 1, '{"app_id":"","app_secret":"","notify_url":""}'),
  ('paypal', 'PayPal', 0, '{"client_id":"","client_secret":"","mode":"sandbox"}');
