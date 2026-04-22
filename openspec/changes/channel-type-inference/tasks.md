## Tasks

### Phase 1: Database & Core Logic

- [ ] **DB: channels 表新增 type 字段**
  - 在 createTables 中添加 migration: `ALTER TABLE channels ADD COLUMN type TEXT DEFAULT ''`
  - 参考 existing migrations (lines 100-109)

- [ ] **DB: settings 表新增 type_mapping_config**
  - 添加默认映射配置
  - 提供 getter/setter 函数

- [ ] **DB: parseM3UContent 添加 tvg-type 解析**
  - 解析 `tvg-type="xxx"` 字段
  - 存入 currentChannel.type

- [ ] **DB: 实现 type 推断逻辑**
  - 实现 TYPE_MAPPING 映射
  - 实现 CHANNEL_TYPE_KEYWORDS 关键词匹配
  - 实现多值合并逻辑
  - 精确匹配优先

- [ ] **DB: INSERT 语句包含 type 字段**
  - parseM3UContent 中的 INSERT 语句
  - writeChannelsToDB 中的 INSERT 语句

### Phase 2: Cache & Output

- [ ] **cacheChannelsToKV: SELECT 包含 type 字段**
  - cacheChannelsToKV 函数
  - getChannelByHash 函数
  - getAllChannels 函数

- [ ] **generateM3UContent: 输出 tvg-type**
  - 在 #EXTINF 行中添加 tvg-type

### Phase 3: Admin API

- [ ] **admin.js: 频道编辑支持 type**
  - PUT /admin/channels/:id 支持更新 type
  - GET /admin/channels 支持 type 筛选参数

- [ ] **admin.js: 批量更新 type API**
  - PUT /admin/channels/batch-type
  - 接收: { ids: [], type: string }

- [ ] **admin.js: type 配置 API**
  - GET /admin/type-config
  - PUT /admin/type-config

### Phase 4: Admin UI

- [ ] **admin-page.js: 频道列表显示 type 列**
  - 添加 type 列
  - 支持按 type 筛选

- [ ] **admin-page.js: 频道编辑支持 type**
  - 编辑弹窗/页面支持修改 type
  - 支持多值输入

- [ ] **admin-page.js: 批量设置 type**
  - 批量选择频道
  - 批量设置 type
  - 或按分组批量设置

- [ ] **admin-page.js: type 配置管理**
  - 查看/编辑 type 映射配置

### Phase 5: Testing & Polish

- [ ] **测试: 本地同步验证**
  - 手动触发同步
  - 检查频道 type 是否正确推断

- [ ] **测试: M3U 输出验证**
  - 生成订阅 M3U
  - 检查 tvg-type 字段

- [ ] **测试: 管理后台功能**
  - 列表/筛选
  - 编辑/批量操作

---

## Task Checklist

```
[ ] DB: channels.type 字段
[ ] DB: type_mapping_config 配置
[ ] M3U: 解析 tvg-type
[ ] M3U: 关键词推断
[ ] M3U: 多值合并
[ ] INSERT: 包含 type
[ ] Cache: SELECT 包含 type
[ ] Cache: getChannelByHash
[ ] Cache: getAllChannels
[ ] M3U 输出: tvg-type
[ ] Admin API: 频道编辑
[ ] Admin API: 批量更新
[ ] Admin API: type 配置
[ ] Admin UI: type 列
[ ] Admin UI: type 筛选
[ ] Admin UI: type 编辑
[ ] Admin UI: 批量设置
[ ] Admin UI: type 配置管理
[ ] 测试验证
```
