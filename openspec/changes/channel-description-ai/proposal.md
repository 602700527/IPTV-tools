## Why

用户需要更好地了解每个频道的内容和特色。目前频道列表只显示名称和分类，缺少详细介绍，影响用户体验。AI 可以自动生成频道详情，减少人工编辑工作量。

## What Changes

- 新增 AI 模型配置功能（支持 OpenAI/Claude）
- 新增频道详情生成功能（AI 搜索 + 生成）
- 新增频道详情审核发布功能（管理员审核后发布）
- 新增频道详情展示页面（用户端）
- 新增 R2 存储（永久保存详情文件）
- 数据源同步时自动标记新频道

## Capabilities

### New Capabilities

- `channel-description-ai`: AI 生成频道详情（配置、生成、审核、发布）
- `channel-description-display`: 用户端频道详情展示

### Modified Capabilities

- (none)

## Impact

- 新增 API：`/admin/ai-config`, `/admin/channels/generate-descriptions`, `/channel-description/:hash`
- 新增 D1 表字段：`channels.description_status`, `channels.description_r2_key`
- 新增 R2 Bucket：存储频道详情 JSON 文件
- 新增管理后台 Tab：AI 配置、详情生成、详情审核
- 新增用户端页面：频道详情展示页
