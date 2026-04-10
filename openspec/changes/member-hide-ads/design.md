## Context

当前网站所有访问者（包括已登录会员）都会看到广告。需要实现会员专属的无广告体验，以鼓励用户注册和订阅。

**现有系统：**
- 用户系统：`users` 表，`is_verified` 字段标识验证状态
- 订阅系统：通过 `codes` 表（卡密）和 `user_orders` 表管理用户订阅
- 广告渲染：
  - `components/page-header.js` 第 52-56 行：**Google AdSense** (`adsbygoogle`)
  - `components/page-footer.js` 第 63 行：**第三方广告** (`nap5k.com/tag.min.js`)
- 页面渲染：各页面通过 `PAGE_HEADER` 和 `PAGE_FOOTER` 组件引入页头页脚

**约束：**
- Cloudflare Workers 环境，代码部署后难以调试
- 需要复用现有 session 机制，不能引入复杂的新认证流程
- Google AdSense 脚本在客户端执行，需通过前端 JS 控制显示/隐藏

## Goals / Non-Goals

**Goals:**
- 登录的会员且有有效订阅时，隐藏公开页面上的广告
- 提供管理开关，可启用/禁用此功能
- 对未登录用户或已过期订阅用户，广告正常显示

**Non-Goals:**
- 不修改现有广告数据库结构
- 不在播放流中去除广告（仅影响网站页面展示）
- 不影响管理员后台的广告管理功能

## Decisions

### 1. 如何判断用户是"会员"？

**方案：** 检查用户是否同时满足以下条件：
1. 有效的用户 session（通过 cookie 中的 token 验证）
2. `is_verified = true`（邮箱已验证）
3. `user_orders` 表中存在一条状态为 `completed` 的订单，且关联的卡密 `codes` 未过期

**备选方案 A：** 只检查 `is_verified`
- ❌ 不够准确，验证邮箱不代表有有效订阅

**备选方案 B：** 直接检查卡密有效性
- ✅ 最准确，但需要关联查询 `codes` 和 `user_orders`

### 2. 前端如何隐藏广告？

**方案：** 通过 `window.IS_MEMBER` 变量控制广告容器的 `display` 样式。

**实现方式：**
- 后端在页面 `<head>` 中注入 `<script>window.IS_MEMBER = true|false;</script>`
- 广告 `<ins>` 容器添加 `data-hide-for-member="true"` 属性
- 前端 JS 读取 `window.IS_MEMBER`，若为 true 且功能启用，隐藏广告容器

**优点：** 
- 不修改 Google AdSense 脚本加载逻辑
- 纯前端控制，广告不会加载（节省带宽）

### 3. Session 验证位置？

在 `worker.js` 的页面路由处理中，解析 cookie 并验证 session，调用 `checkMemberStatus()` 函数，生成包含 `window.IS_MEMBER` 的页头 HTML。

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|---------|
| 每次页面请求都查询数据库验证会员状态 | 使用内存缓存（如已实现）或设置短暂缓存 TTL |
| 用户刚订阅后 session 未更新 | 依赖 session 中的用户 ID 实时查询订阅状态 |

## Migration Plan

1. **Phase 1**: 添加 `member_ad_free_enabled` 配置项到 `settings` 表
2. **Phase 2**: 在 `handlers/auth.js` 中添加 `checkMemberStatus(userId)` 函数
3. **Phase 3**: 修改 `components/page-header.js`，注入 `window.IS_MEMBER` 并添加广告隐藏逻辑
4. **Phase 4**: 管理员后台添加功能开关
