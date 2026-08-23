-- 14: 订阅 URL 访问信号（IPTV 真实活跃信号）
-- /sub/{code}.m3u 和 /sub/{code}.txt 被 TV 应用拉取时更新
-- 用作客户成功（CSM）的活跃信号 — 取代 PR-A 中基于 users.last_seen_at 的错误信号

ALTER TABLE codes ADD COLUMN last_fetched_at DATETIME;
ALTER TABLE codes ADD COLUMN last_fetch_ip TEXT;

-- 索引加速"X 天未活跃"查询（MAX(last_fetched_at) per user + JOIN）
CREATE INDEX IF NOT EXISTS idx_codes_last_fetched ON codes(last_fetched_at);