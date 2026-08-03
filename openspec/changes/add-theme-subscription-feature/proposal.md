## Why

当前卡密系统只能通过"有效期"和"IP数限制"区分不同产品，无法实现"内容差异化"。未来需要提供不同价格的主题套餐（如"央视套餐"、"体育套餐"、"全通套餐"），每个主题包含不同的直播源组合，按需销售。

## What Changes

- 新增 `themes` 表存储主题配置（名称、过滤规则）
- 新增 `code_themes` 关联表（卡密与主题多对多关系）
- `codes` 表新增 `theme_ids` JSON字段存储绑定的多个主题ID
- 管理后台：主题CRUD管理界面
- 管理后台：生成卡密时支持选择绑定的主题
- 订阅流程(`/sub/{code}.m3u`)：按卡密绑定的主题规则过滤频道后生成M3U

## Capabilities

### New Capabilities

- `theme-filtering`: 主题过滤规则引擎，支持按数据源/分类/域名/频道名模式/类型等多维度过滤
- `theme-subscription-binding`: 卡密与主题的绑定管理，支持多对多关系

### Modified Capabilities

- `code-generation`: 卡密生成能力扩展，支持指定主题ID
- `subscription-m3u-generation`: 订阅M3U生成逻辑改造，按主题过滤频道

## Impact

- **Database**: 新增 `themes` 表、`code_themes` 关联表，`codes` 表新增 `theme_ids` JSON字段
- **Admin API**: `/admin/themes` CRUD接口，卡密生成接口增加 `theme_ids` 参数
- **Subscription Flow**: `/sub/{code}.m3u` 订阅流程需要读取主题规则并过滤频道
- **UI**: 管理后台增加主题管理页面，卡密生成页面增加主题选择多选框