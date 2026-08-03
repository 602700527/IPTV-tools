# Implementation Tasks - Add Theme Subscription Feature

## 1. Database Migration

- [x] 1.1 在 `database.js` 中添加 `createThemesTable()` 函数
- [x] 1.2 在 `database.js` 中添加 `createCodeThemesTable()` 函数
- [x] 1.3 在 `database.js` 的 `createTables()` 中调用上述两个函数
- [x] 1.4 添加数据库迁移检查，防止重复创建表
- [x] 1.5 `code_themes` 表添加 `(code, theme_id)` 唯一索引
- [x] 1.6 `code_themes` 表添加 `(theme_id)` 查询索引

## 2. Theme CRUD Functions (database.js)

- [x] 2.1 `getAllThemes()` - 获取所有启用的主题
- [x] 2.2 `getTheme(id)` - 获取单个主题详情
- [x] 2.3 `createTheme(name, nameEn, rules, description)` - 创建主题
- [x] 2.4 `updateTheme(id, fields)` - 更新主题
- [x] 2.5 `deleteTheme(id)` - 删除主题（含绑定检查）
- [x] 2.6 `getThemeCount()` - 获取主题数量统计

## 3. Code-Theme Binding Functions (database.js)

- [x] 3.1 `getThemesByCode(code)` - 获取卡密绑定的所有主题
- [x] 3.2 `bindThemeToCode(code, themeId)` - 绑定主题到卡密
- [x] 3.3 `unbindThemeFromCode(code, themeId)` - 解绑主题
- [x] 3.4 `getCodesByThemeId(themeId)` - 获取绑定某主题的所有卡密
- [x] 3.5 `bindThemesToCode(code, themeIds)` - 批量绑定（生成卡密时用）

## 4. Theme Filtering Engine (database.js)

- [x] 4.1 `filterChannels(channels, rules)` - 核心过滤函数
- [x] 4.2 `matchSourceIds(channel, values)` - source_ids 匹配
- [x] 4.3 `matchGroupTitles(channel, values)` - group_titles 匹配
- [x] 4.4 `matchDomains(channel, domainPatterns)` - domains 匹配（含通配符）
- [x] 4.5 `matchChannelPatterns(channel, patterns)` - channel_patterns 匹配
- [x] 4.6 `matchTypes(channel, values)` - types 匹配
- [x] 4.7 `deduplicateChannels(channels)` - 按 channel_hash 去重

## 5. KV Caching for Themes (database.js)

- [x] 5.1 `cacheThemeRules(env, themeId, rules)` - 缓存主题规则到KV
- [x] 5.2 `getThemeRulesFromCache(env, themeId)` - 从KV获取规则
- [x] 5.3 `clearThemeCache(env, themeId)` - 清除单个主题缓存
- [x] 5.4 `clearAllThemeCache(env)` - 清除所有主题缓存

## 6. Admin API - Theme Management (admin.js)

- [x] 6.1 `GET /admin/themes` - 获取所有主题列表
- [x] 6.2 `POST /admin/themes` - 创建新主题
- [x] 6.3 `GET /admin/themes/{id}` - 获取单个主题
- [x] 6.4 `PUT /admin/themes/{id}` - 更新主题
- [x] 6.5 `DELETE /admin/themes/{id}` - 删除主题（含绑定检查）

## 7. Admin API - Code-Theme Binding (admin.js)

- [x] 7.1 `GET /admin/codes/{code}/themes` - 获取卡密的主题列表
- [x] 7.2 `POST /admin/codes/{code}/themes` - 绑定主题
- [x] 7.3 `DELETE /admin/codes/{code}/themes` - 解绑主题

## 8. Admin API - Code Generation Update (admin.js)

- [x] 8.1 修改 `POST /admin/codes` 支持 `theme_ids` 参数
- [x] 8.2 生成卡密后自动绑定指定的主题
- [x] 8.3 批量生成卡密时支持主题绑定

## 9. Subscription Flow Update (sub.js)

- [x] 9.1 修改 `handleSubRequest()` 读取 `code_themes` 获取主题列表
- [x] 9.2 如果有主题绑定，调用 `filterChannels()` 过滤
- [x] 9.3 无主题绑定时返回全部启用频道（保持原有行为）
- [x] 9.4 合并多个主题的过滤结果取并集

## 10. Admin Page - Theme Management (admin-page.js)

- [x] 10.1 添加主题列表显示区域
- [x] 10.2 添加主题创建/编辑表单对话框
- [x] 10.3 添加主题规则JSON编辑器（textarea，支持粘贴JSON）
- [x] 10.4 添加删除确认对话框（含绑定检查）
- [x] 10.5 主题列表显示：名称、描述、规则预览

## 11. Admin Page - Code Generation (admin-page.js)

- [x] 11.1 在生成卡密表单中增加主题选择多选框
- [x] 11.2 显示已选择的主题预览
- [x] 11.3 支持清空选择（全局直播源）

## 12. Admin Page - Code Detail (admin-page.js)

- [x] 12.1 显示卡密绑定的主题列表
- [x] 12.2 支持添加/移除主题绑定
- [x] 12.3 显示主题匹配的频道数预览

## 13. Testing

- [ ] 13.1 本地测试主题CRUD
- [ ] 13.2 本地测试卡密-主题绑定
- [ ] 13.3 本地测试订阅流程（带主题/不带主题）
- [ ] 13.4 测试通配符域名匹配
- [ ] 13.5 测试删除主题保护（有绑定时拒绝）

## 14. Deployment

- [ ] 14.1 初始化数据库迁移
- [ ] 14.2 验证主题功能在生产环境正常
- [ ] 14.3 测试订阅链接生成的M3U内容正确