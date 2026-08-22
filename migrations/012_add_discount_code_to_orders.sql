-- 12: 为订单表添加 discount_code 字段，记录用户使用的优惠码
-- 用于支付成功后的订单历史记录展示

ALTER TABLE xunhupay_orders ADD COLUMN discount_code TEXT DEFAULT '';
ALTER TABLE usdt_orders ADD COLUMN discount_code TEXT DEFAULT '';
ALTER TABLE user_orders ADD COLUMN discount_code TEXT DEFAULT '';
