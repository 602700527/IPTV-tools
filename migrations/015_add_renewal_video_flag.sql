-- 15: 在 ad_ts_files 上标记续费营销视频
-- /sub/{code}.m3u 过期/失效时返回单条续费提醒 M3U，stream 指向 is_renewal_video = 1 的 TS

ALTER TABLE ad_ts_files ADD COLUMN is_renewal_video INTEGER DEFAULT 0;

-- 同表只允许一条 is_renewal_video = 1（防误标多条导致顺序不定）
CREATE UNIQUE INDEX IF NOT EXISTS idx_ad_ts_files_renewal_unique
  ON ad_ts_files(is_renewal_video) WHERE is_renewal_video = 1;