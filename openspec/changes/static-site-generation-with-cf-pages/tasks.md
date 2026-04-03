# 静态站点生成 - 实现任务

## 🎯 项目目标
将动态渲染的页面改为预生成的静态 HTML，减少 Worker 计算负载，加快页面加载速度。

---

## 📋 任务总览

```
Phase 1: 核心基础设施 (Critical Path)
    ↓
Phase 2: 核心功能 (可独立测试)
    ↓
Phase 3: 用户体验优化
    ↓
Phase 4: 自动化与生产部署
```

---

## 🔴 Phase 1: 核心基础设施 (Critical Path)

**⚠️ 必须先完成这些任务，否则无法进行后续测试**

### 1. 重构 HTML 生成函数

- [ ] 1.1 提取 `generateSEOHomepage()` 到 `handlers/seo-handler.js`
- [ ] 1.2 提取 `generateCategoryPage()` 为独立导出函数
- [ ] 1.3 创建 `generateChannelDetailPage()` 函数
- [ ] 1.4 创建共享工具模块 `utils/html-templates.js` (escape, slugify)
- [ ] 1.5 验证函数在 Workers runtime 和 CLI 环境下都能工作

### 2. 创建静态站点生成器 CLI

- [ ] 2.1 创建 `scripts/generate-static-site.js` Node.js CLI
- [ ] 2.2 添加 D1 数据库连接
- [ ] 2.3 实现首页 HTML 生成
- [ ] 2.4 实现分类页生成 (100/批)
- [ ] 2.5 实现频道详情页生成 (500/批)
- [ ] 2.6 添加 `--type` 参数 (homepage, categories, channels, all)
- [ ] 2.7 添加 `--output-dir` 参数
- [ ] 2.8 实现批处理和进度日志
- [ ] 2.9 测试: `npm run generate-static`

### 3. Worker.js 路由改造

**⚠️ CRITICAL: 这是连接静态文件和 Worker 的关键**

#### 3.1 静态文件服务函数
- [ ] 3.1.1 添加 `serveStaticFile(path, env)` 函数
  - 检测 `env.STATIC_SOURCE === 'r2'`
  - local 模式: 读取 `static-output/` 目录
  - r2 模式: `await env.R2_BUCKET.get(path)`
  - 文件不存在返回 null

#### 3.2 添加缺失路由
- [ ] 3.2.1 `GET /login` → `static-output/login.html`
- [ ] 3.2.2 `GET /favorites` → `static-output/favorites.html`
- [ ] 3.2.3 `GET /channel/{hash}` → `static-output/channel/{hash}.html`
- [ ] 3.2.4 `GET /forgot-password` → `static-output/forgot-password.html`
- [ ] 3.2.5 `GET /404` → `static-output/404.html`

#### 3.3 修改现有路由使用静态文件
- [ ] 3.3.1 `GET /` → 读取 `static-output/index.html` (替代 HOME_HTML)
- [ ] 3.3.2 `GET /category/{slug}` → 读取 `static-output/category/{slug}.html`
- [ ] 3.3.3 `GET /reset-password` → 读取 `static-output/reset-password.html`
- [ ] 3.3.4 `GET /account` → 读取 `static-output/account.html`
- [ ] 3.3.5 `GET /tutorial` → 读取 `static-output/tutorial.html`
- [ ] 3.3.6 `GET /sitemap.xml` → 读取 `static-output/sitemap.xml`
- [ ] 3.3.7 `GET /robots.txt` → 读取 `static-output/robots.txt`

#### 3.4 删除遗留文件 (Phase 1 完成后)
- [ ] 3.4.1 删除 `home-page.js` (HOME_HTML)
- [ ] 3.4.2 删除 `reset-password-page.js` (RESET_PASSWORD_HTML)
- [ ] 3.4.3 删除其他被取代的 HTML 常量文件

### 4. wrangler.toml 环境配置

- [ ] 4.1 添加环境变量:
  ```toml
  [vars]
  STATIC_SOURCE = "local"
  STATIC_OUTPUT_DIR = "static-output"
  ```
- [ ] 4.2 添加 R2 配置 (生产环境):
  ```toml
  [env.production.vars]
  STATIC_SOURCE = "r2"
  
  [[env.production.r2_buckets]]
  binding = "R2_BUCKET"
  bucket_name = "iptv-static-files"
  ```

---

## 🟡 Phase 2: 核心功能 (可独立测试)

### 5. 用户认证系统 (后端已实现 ✅)

**后端 API 状态: 全部完成 ✅**

| API | 状态 |
|-----|------|
| `POST /api/auth/register` | ✅ |
| `POST /api/auth/send-code` | ✅ |
| `POST /api/auth/login` | ✅ |
| `POST /api/auth/forgot-password` | ✅ |
| `POST /api/auth/reset-password` | ✅ |
| `POST /api/auth/logout` | ✅ |
| `GET /api/auth/user` | ✅ |
| `POST /api/auth/google/init` | ✅ |
| `GET /api/auth/google/callback` | ✅ |

**前端模板状态:**

- [x] 5.1 `login.html` ✅ (包含注册 + Google OAuth)
- [x] 5.2 `forgot-password.html` ✅ (包含 Google OAuth)
- [x] 5.3 `reset-password.html` ✅ (包含 Google OAuth)
- [ ] 5.4 登录页添加 "Forgot Password?" 链接
- [ ] 5.5 账户页 `account.html` 状态检查 (当前使用 ACCOUNT_HTML)

### 6. 收藏系统

- [ ] 6.1 创建 `utils/favorites.js` 模块
  - localStorage 读写函数
  - 收藏/取消收藏切换
  - 获取所有收藏
  - 检查是否已收藏

- [ ] 6.2 添加收藏按钮到频道卡片
  - 位置: 卡片右上角
  - 图标: ☆ (未收藏) / ★ (已收藏)
  - 点击无刷新切换状态

- [ ] 6.3 收藏页 `/favorites`
  - 静态页面网格布局
  - "Download M3U" 按钮
  - 空状态提示

- [ ] 6.4 M3U 功能
  - 频道详情页: "Copy M3U" 按钮
  - 收藏页: "Download M3U" 按钮 (最多200个频道)

---

## 🟢 Phase 3: 用户体验优化

### 7. 主题系统 (Dark/Light Mode)

- [ ] 7.1 CSS 变量定义 (dark + light)
- [ ] 7.2 `<head>` 防止闪屏的主题检测脚本
- [ ] 7.3 主题切换按钮 (header)
- [ ] 7.4 无刷新主题切换
- [ ] 7.5 localStorage 持久化

### 8. 翻译系统

- [ ] 8.1 所有静态页面引入 translate.js CDN
- [ ] 8.2 页面加载后调用 `translate.execute()`
- [ ] 8.3 语言选择器集成
- [ ] 8.4 语言偏好 localStorage 持久化

### 9. SEO 优化

- [ ] 9.1 首页 SEO 标签 (title, description, og:*)
- [ ] 9.2 分类页 SEO 标签
- [ ] 9.3 频道详情页 SEO 标签
- [ ] 9.4 JSON-LD Schema (FAQ, BreadcrumbList, VideoObject)
- [ ] 9.5 sitemap.xml 生成
- [ ] 9.6 robots.txt 生成

### 10. 营销增强

- [ ] 10.1 首页 Hero 区域
  - 价值主张文字
  - CTA 按钮 (Start Watching / Browse Channels)
- [ ] 10.2 信任信号 (无注册、设备兼容、HD 质量)
- [ ] 10.3 CTA 按钮样式
- [ ] 10.4 分类页批量下载 M3U

### 11. 移动端优化

- [ ] 11.1 触控目标尺寸 (最小 44x44px)
- [ ] 11.2 响应式断点 (768px, 480px)
- [ ] 11.3 移动端 Header (搜索框宽度、紧凑导航)
- [ ] 11.4 移动端频道网格 (2列)
- [ ] 11.5 汉堡菜单侧边栏

---

## 🔵 Phase 4: 自动化与生产部署

### 12. 调度器集成 (每日 3:00)

- [ ] 12.1 添加静态站点生成到 `handlers/scheduler.js`
- [ ] 12.2 保持 cron trigger: `0 3 * * *`
- [ ] 12.3 错误处理 (生成失败不影响 cron)
- [ ] 12.4 生成统计日志
- [ ] 12.5 测试: `GET /test/scheduled`

### 13. 管理员触发

- [ ] 13.1 Admin UI 添加生成按钮
- [ ] 13.2 使用 `ctx.waitUntil()` 后台生成
- [ ] 13.3 进度跟踪 API: `GET /api/admin/static-generation/status`
- [ ] 13.4 实时进度显示 (当前文件, 已完成/总数)
- [ ] 13.5 日志输出 (成功/失败, 错误详情)

### 14. R2 Bucket 集成 (生产)

- [ ] 14.1 在 Cloudflare dashboard 创建 R2 bucket
- [ ] 14.2 配置 wrangler.toml R2 binding
- [ ] 14.3 修改生成器支持 R2 上传 (`--upload-r2`)
- [ ] 14.4 验证生产环境 Worker 从 R2 读取

### 15. 测试与验证

- [ ] 15.1 运行生成器验证所有文件正确创建
- [ ] 15.2 验证首页 HTML 与现有 `generateSEOHomepage()` 一致
- [ ] 15.3 验证分类页生成所有分组
- [ ] 15.4 验证频道详情页包含所有必需信息
- [ ] 15.5 端到端测试: 首页 → 分类 → 频道 → 播放
- [ ] 15.6 收藏系统跨页面测试
- [ ] 15.7 主题切换持久化测试
- [ ] 15.8 翻译功能测试

---

## 📁 模板文件状态

```
static-preview/
├── homepage.html         ✅ 首页模板
├── category.html        ✅ 分类页模板
├── channel-detail.html  ✅ 频道详情页模板
├── favorites.html       ✅ 收藏页模板
├── login.html          ✅ 登录页 (注册 + Google OAuth)
├── account.html         ✅ 账户页模板
├── forgot-password.html ✅ 忘记密码页 (Google OAuth)
├── reset-password.html  ✅ 重置密码页 (Google OAuth)
├── tutorial.html        ✅ 教程页模板
├── privacy-policy.html ✅ 隐私政策模板
├── terms.html          ✅ 服务条款模板
└── 404.html            ✅ 404 模板
```

---

## 🔗 任务依赖关系

```
                    ┌─────────────────┐
                    │  1. HTML 重构   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  2. 生成器 CLI  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  3. Worker.js   │ ← 关键路径
                    │   路由改造       │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │  5. 用户认证   │ │  6. 收藏系统   │ │  7-11 UX优化 │
    │   (可测试)    │ │   (可测试)    │ │   (可并行)   │
    └───────────────┘ └───────────────┘ └───────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  12-15 自动化    │
                    │  + 生产部署      │
                    └─────────────────┘
```
