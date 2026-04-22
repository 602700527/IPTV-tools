## Tasks

### Phase 1: Database & Core Logic

- [x] **DB: channels 表新增 type 字段**
  - 在 createTables 中添加 migration: `ALTER TABLE channels ADD COLUMN type TEXT DEFAULT ''`
  - 参考 existing migrations (lines 100-109)

- [x] **DB: settings 表新增 type_mapping_config**
  - 添加默认映射配置
  - 提供 getter/setter 函数

- [x] **DB: parseM3UContent 添加 tvg-type 解析**
  - 解析 `tvg-type="xxx"` 字段
  - 存入 currentChannel.type

- [x] **DB: 实现 type 推断逻辑**
  - 实现 TYPE_MAPPING 映射
  - 实现 CHANNEL_TYPE_KEYWORDS 关键词匹配
  - 实现多值合并逻辑
  - 精确匹配优先

- [x] **DB: INSERT 语句包含 type 字段**
  - parseM3UContent 中的 INSERT 语句
  - writeChannelsToDB 中的 INSERT 语句

### Phase 2: Cache & Output

- [x] **cacheChannelsToKV: SELECT 包含 type 字段**
  - cacheChannelsToKV 函数
  - getChannelByHash 函数
  - getAllChannels 函数

- [x] **generateM3UContent: 输出 tvg-type**
  - 在 #EXTINF 行中添加 tvg-type

### Phase 3: Admin API

- [x] **admin.js: 频道编辑支持 type**
  - PUT /admin/channels/:id 支持更新 type
  - GET /admin/channels 支持 type 筛选参数

- [x] **admin.js: 批量更新 type API**
  - PUT /admin/channels/batch-type
  - 接收: { ids: [], type: string }

- [x] **admin.js: type 配置 API**
  - GET /admin/type-config
  - PUT /admin/type-config

### Phase 4: Admin UI

- [x] **admin-page.js: 频道列表显示 type 列**
  - 添加 type 列
  - 支持按 type 筛选

- [x] **admin-page.js: 频道编辑支持 type**
  - 编辑弹窗/页面支持修改 type
  - 支持多值输入

- [x] **admin-page.js: 批量设置 type**
  - 批量选择频道
  - 批量设置 type
  - 或按分组批量设置

- [x] **admin-page.js: type 配置管理**
  - 查看/编辑 type 映射配置（textarea 编辑模式，格式: type:keywords1,keywords2）

### Phase 5: Testing & Polish

- [x] **测试: 本地同步验证**
  - 手动触发同步
  - 检查频道 type 是否正确推断

- [x] **测试: M3U 输出验证**
  - 生成订阅 M3U
  - 检查 tvg-type 字段

- [x] **测试: 管理后台功能**
  - 列表/筛选
  - 编辑/批量操作

---

## Task Checklist

```
[x] DB: channels.type 字段
[x] DB: type_mapping_config 配置
[x] M3U: 解析 tvg-type
[x] M3U: 关键词推断
[x] M3U: 多值合并
[x] INSERT: 包含 type
[x] Cache: SELECT 包含 type
[x] Cache: getChannelByHash
[x] Cache: getAllChannels
[x] M3U 输出: tvg-type
[x] Admin API: 频道编辑
[x] Admin API: 批量更新
[x] Admin API: type 配置
[x] Admin UI: type 列
[x] Admin UI: type 筛选
[x] Admin UI: type 编辑
[x] Admin UI: 批量设置
[x] Admin UI: type 配置管理
[x] 测试验证
```