-- 010: USDT (TRC20) 支付订单表
-- 由 cfworker2 直接管理；epusdt-workers 通过 HTTP API 协作
-- 表名 usdt_orders 避免与 xunhupay_orders 字段语义混淆

CREATE TABLE IF NOT EXISTS usdt_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trade_id TEXT UNIQUE,                       -- epusdt-workers 生成的 trade id
  order_id TEXT UNIQUE NOT NULL,              -- cfworker2 自己的订单号 (TV...)
  user_id INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,             -- 套餐天数
  max_ips INTEGER NOT NULL,                   -- 套餐 IP 数
  amount REAL NOT NULL,                       -- CNY 价格
  actual_amount REAL,                         -- USDT 实际金额
  token TEXT,                                 -- TRC20 钱包地址
  block_transaction_id TEXT,                  -- 链上 tx hash
  currency TEXT DEFAULT 'CNY',
  status INTEGER DEFAULT 1 NOT NULL,          -- 1=待支付, 2=已支付, 3=过期
  notify_url TEXT,
  redirect_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_usdt_orders_user_id ON usdt_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_usdt_orders_status ON usdt_orders(status);