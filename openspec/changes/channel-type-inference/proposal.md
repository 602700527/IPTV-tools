## Why

用户需要更好地发现和筛选频道。目前频道只有地区分组（group-title），缺少节目类型维度。通过在数据源同步时自动推断频道类型，用户可以按 movie、animation、sports 等类型筛选频道。

## What Changes

- 新增 `channels.type` 字段（TEXT，允许多值，逗号分隔）
- 同步时解析 M3U 的 `tvg-type` 字段，并转换为标准类型
- 同步时根据 `channel_name` 关键词自动推断 type
- 支持管理员完全控制 type（手动编辑、批量设置）
- M3U 输出时包含 `tvg-type` 字段
- 管理后台支持按 type 筛选频道

## Capabilities

### New Capabilities

- `channel-type-inference`: 频道类型自动推断（tvg-type 映射 + 关键词推断）
- `channel-type-management`: 管理后台类型管理（编辑、批量设置、筛选）

### Modified Capabilities

- `channel-sync`: 数据源同步流程（新增 type 推断逻辑）
- `channel-display`: 频道列表/详情（新增 type 展示）
- `channel-subscription`: 订阅 M3U 生成（输出 tvg-type）

## Impact

- 数据库：`channels` 表新增 `type` 字段
- 配置：`settings` 表新增 `type_mapping_config`（M3U tvg-type 到标准类型的映射）
- 管理后台：频道列表增加 type 列/筛选/编辑
- M3U 输出：增加 `tvg-type` 字段
- KV 缓存：频道数据包含 type 字段
