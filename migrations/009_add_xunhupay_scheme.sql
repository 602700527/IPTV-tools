-- 009: xunhupay_orders 加上线路方案字段
-- 让支付完成 → 生成卡密时能把 topic_id / sub_mode 写进去

ALTER TABLE xunhupay_orders ADD COLUMN topic_id INTEGER;
ALTER TABLE xunhupay_orders ADD COLUMN sub_mode TEXT;