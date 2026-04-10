## 1. 数据库配置

- [ ] 1.1 在 `settings` 表添加 `member_ad_free_enabled` 配置项（默认 `'false'`）
- [ ] 1.2 在 `database.js` 的 `getSystemConfig()` 中添加对该配置的读取支持

## 2. 会员状态检测

- [ ] 2.1 在 `handlers/auth.js` 中添加 `checkMemberStatus(userId)` 函数，查询用户是否有有效订阅
- [ ] 2.2 在 `worker.js` 中添加从 cookie 解析 session 并调用会员状态检测的逻辑

## 3. 页头页脚广告隐藏

- [ ] 3.1 修改 `components/page-header.js`，为 Google AdSense 容器添加 `data-hide-for-member="true"` 属性
- [ ] 3.2 修改 `components/page-footer.js`，为第三方广告脚本添加 `data-hide-for-member="true"` 属性
- [ ] 3.3 在 `page-header.js` 的 `<head>` 中注入 `window.IS_MEMBER` 变量
- [ ] 3.4 添加前端 JS 逻辑：读取 `window.IS_MEMBER`，若为 true 且功能启用，隐藏广告容器并阻止广告脚本加载

## 4. 管理后台

- [ ] 4.1 在管理后台的"系统设置"页面添加"会员免广告"开关
- [ ] 4.2 连接到 `updateSystemConfig()` 保存 `member_ad_free_enabled` 设置

## 5. 测试验证

- [ ] 5.1 测试未登录用户：广告正常显示
- [ ] 5.2 测试登录但无订阅用户：广告正常显示
- [ ] 5.3 测试登录且有有效订阅用户：广告隐藏
- [ ] 5.4 测试管理员关闭功能后：所有用户广告正常显示
