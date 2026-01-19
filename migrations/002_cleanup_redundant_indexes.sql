-- 迁移脚本: 清理冗余索引，只保留 3 个核心索引
-- 目的: 优化写入性能，减少索引维护开销
-- 创建时间: 2026-01-17

-- 删除冗余的索引
DROP INDEX IF EXISTS idx_channels_group_title_notnull;
DROP INDEX IF EXISTS idx_channels_group_title_optimized;
DROP INDEX IF EXISTS idx_channels_group;
DROP INDEX IF EXISTS idx_channels_is_active;
DROP INDEX IF EXISTS idx_channels_is_valid;
DROP INDEX IF EXISTS idx_channels_last_checked;
DROP INDEX IF EXISTS idx_channels_name;
DROP INDEX IF EXISTS idx_channels_query;
DROP INDEX IF EXISTS idx_channels_source_id;
DROP INDEX IF EXISTS idx_channels_status;

-- 保留以下 3 个核心索引:
-- 1. idx_channel_hash (channel_hash) - 播放验证必需
-- 2. idx_channels_active_source (is_active, source_id) - 核心查询
-- 3. idx_channels_group_title (group_title) - 分组查询必需
