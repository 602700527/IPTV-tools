# 原型更新需求记录

## 日期：2026-04-02

---

## ⚠️ 重要说明：原型文件

**`static-preview/` 目录下的所有文件均为原型文件**，开发实现时必须 **100% 还原**：
- HTML 结构
- CSS 样式（包括颜色、间距、动画）
- SVG 图标
- 交互逻辑

禁止：
- 自行简化或省略任何 UI 元素
- 随意修改颜色、字体、间距等样式
- 用 emoji 替代 SVG 图标
- 省略任何提示文字或说明

---

## 一、需求回顾与确认

### 1. 静态网站生成与存储

**存储方案**：
- 使用 **R2 bucket**：`iptv-static-assets`（已有）
- KV 免费额度不够（8000 操作/天），不采用

**路由处理**：
- 用户访问 `/channel/{hash}` → Workers 从 R2 读取静态文件返回
- 访问过期/不存在频道 → 返回友好 404 页面
  - ⚠️ **需要营销专家和 UI 设计提供文案和设计**
  - 目标：拖住用户失望心理，引导去首页寻找其他喜爱节目

**收藏页处理**：
- **动态页面**，不生成静态文件
- 读取 `localStorage` 中的收藏数据
- 触发 M3U 下载逻辑
- 不影响 SEO（无需 R2 参与）

**Copy M3U Link 逻辑**：
- 复用已有的"生成播放链接"逻辑
- 读取用户 IP 生成专属播放链接
- 支持最多 3 个 IP 同时播放
- 超出限制不返回真实播放地址

### 2. Admin 后台管理

**触发方式**：
- Admin 后台 → 静态生成管理（新增 Tab 或按钮）
- 点击后**后台运行**（`ctx.waitUntil()`）
- 不占用前台请求

**进度与日志**：
- 实时显示：当前生成文件名、完成数/总数
- 日志输出：成功/失败状态、错误详情
- 前端轮询：`GET /api/admin/static-generation/status`

**API 设计**：
```
POST /api/admin/static-generate/start
  - 触发静态生成任务
  - 返回 task_id

GET /api/admin/static-generate/status
  - 返回: { status: 'running'|'completed'|'failed', progress: {...}, logs: [...] }
```

**生成流程**：
1. 首页 `/` → R2
2. 分类页 `/category/{slug}` → R2
3. 频道详情页 `/channel/{hash}` → R2 (8000+)
4. sitemap.xml → R2
5. 完成后更新状态

**定时任务**：
- 每天凌晨 3:00 自动执行
- 使用 `ctx.waitUntil()` 后台处理

### 3. 共享页头页脚组件

**实现方案**：
```
components/
├── header.html    ← 共享头部（含导航、Favorites/Plans pill-btn）
├── footer.html    ← 共享尾部

static-preview/*.html  ← 原型文件引用
        ↓
scripts/inject-components.js  ← 构建时注入
        ↓
handlers/*.js  ← 最终生成函数使用
```

**执行方式**：通过 `scripts/inject-components.js` 构建时注入

---

## 二、需要清理的旧 SEO 逻辑

### 需删除/修改的代码

**worker.js**：
- 第 12 行：移除 `isSearchEngineBot` import
- 第 219-220 行：移除搜索引擎爬虫判断 → 直接返回首页
- 第 259-260 行：移除 category 页的爬虫判断
- 第 551 行：移除爬虫处理

**handlers/seo-handler.js**：
- 整个文件可能需要删除或大幅精简
- 保留 `generate404Page`（404 页面仍需要）

**Python 生成脚本**（全部删除）：
```
handlers/gen_new_homepage.py
handlers/gen_seo_homepage.py
handlers/gen_seo_homepage_new.py
handlers/gen_seo_v2.py
handlers/gen_seo_v3.py
handlers/gen_static.py
handlers/gen_static_assets.py
handlers/gen_static_homepage.py
handlers/generate_seo_homepage_new.js
```

**其他可能相关**：
- 检查 `static-assets.js` 是否复用
- 检查 `components/page-header.js`, `page-footer.js`

### 需保留的代码

**handlers/ip-play.js**：
- `handleGetPlayLink` - 生成播放链接逻辑（Copy M3U Link 需要用）

**handlers/sub.js**：
- 订阅 M3U 生成逻辑

---

## 三、待处理事项

| 优先级 | 事项 | 说明 |
|--------|------|------|
| **高** | 清理旧 SEO 代码 | 删除上述文件和逻辑 |
| **高** | 共享页头页脚组件 | 创建 `components/` 和注入脚本 |
| **高** | 静态生成到 R2 | Admin 触发、进度日志、R2 读取路由 |
| **高** | 友好 404 页面 | **📋 UI/UX + 营销团队负责** - 提供设计和文案，开发实现 |
| **中** | Copy M3U Link | 复用 ip-play.js 已有逻辑 |
| **中** | 收藏页动态化 | 读取 localStorage、触发下载 |
| **低** | 定时任务集成 | 每天 3:00 自动生成 |

---

## 四、已完成的原型更新

所有更新均已在 `static-preview/` 目录下的原型文件中实现，开发时需 100% 还原。

### 1. 页头导航更新 ✅

**涉及文件**：所有页面
- [x] 所有页面添加 Favorites/Plans pill-btn 导航
- [x] Theme toggle 改为 SVG 图标（太阳/月亮切换）
- [x] 按钮使用统一的 pill-btn 样式
- [x] **添加 Account 账号入口按钮**（/account 链接）

### 2. 移动端适配 ✅

**涉及文件**：所有页面（10 个 HTML 文件）
- [x] 响应式断点：768px（移动）、900px（平板）、480px（小屏）
- [x] 频道网格：桌面 4-6 列 → 平板 3 列 → 移动 2 列
- [x] 搜索框：移动端全宽显示
- [x] 按钮最小触摸尺寸 44x44px
- [x] **语言切换栏在移动端保留**（仅缩小，不隐藏）
- [x] Header 按钮横向滚动（overflow-x: auto）

### 3. 频道详情页更新 ✅

**涉及文件**：`channel-detail.html`
- [x] 移除 "Watch Now" 播放按钮
- [x] Action buttons：Add to Favorites / Copy M3U Link / Get Subscription
- [x] "How to Watch" 改为双方案（收藏下载 / 订阅）
- [x] 添加内链到 Favorites 和 Plans 页面
- [x] **移动端海报缩小为 100x100px 正方形，居中显示**
- [x] **Logo 加载失败时显示频道名首字母 + 背景色**

### 4. 收藏页面更新 ✅

**涉及文件**：`favorites.html`
- [x] 页面头部添加 Favorites（高亮）/ Plans pill-btn
- [x] M3U 下载提示移到按钮下方
- [x] Download/Clear All 按钮使用 SVG 图标
- [x] 整体布局优化

### 5. 分类页批量操作优化 ✅

**涉及文件**：`category.html`
- [x] 移除隐藏的"Batch Select"按钮
- [x] 批量操作栏始终可见
- [x] 添加提示文字引导用户
- [x] **添加 Download M3U 按钮**（绿色渐变背景）
- [x] **批量下载也受 200 限制**

### 6. 收藏数量限制 ✅

**涉及文件**：`category.html`, `favorites.html`, `channel-detail.html`
- [x] 收藏上限 200 个频道
- [x] 超限时显示友好提示
- [x] **提示文案含内链**：`Get subscription` → /plans

**提示样式**：
```
┌────────────────────────────────────────────┐
│ ⚠️  Maximum 200 channels.                 │
│     Get subscription → /plans              │
└────────────────────────────────────────────┘
```

### 7. Emoji 替换 ✅

**涉及文件**：所有页面
- [x] 所有按钮、标题、图标改用 SVG
- [x] 保留频道卡片占位符（不影响显示）

### 8. 语言切换栏保留 ✅

**涉及文件**：所有页面
- [x] 移动端不再隐藏 `#translate` 元素
- [x] 语言选择器在移动端显示（尺寸缩小）
- [x] Header 支持横向滚动

### ⚠️ 重要：分类导航必须动态生成

**问题**：`static-preview/category.html` 中的分类导航（央视、卫星电视、体育、新闻...）是**写死在 HTML 中的**，这是**原型演示用的**，**不能直接用于生产环境**。

**需求**：
```
分类导航栏的分类列表，必须从数据源动态读取生成，禁止写死。

数据来源：sources 表 → channels 表的 group_title 或 category 字段
```

**实现要求**：
1. 分类列表从数据库动态获取（去重后的 category/group）
2. 分类顺序可配置（权重字段）
3. 当前激活分类通过 URL 参数 `/category/{slug}` 判断
4. 分类数量不限（原型中写死了 9 个，实际可扩展）

**原型文件中的分类（仅供演示）**：
```html
<!-- ⚠️ 这些是写死的原型数据，生产环境必须从数据库读取 -->
<li><a href="/category/cctv" class="active">CCTV</a></li>
<li><a href="/category/weishi">Satellite TV</a></li>
<li><a href="/category/sports">Sports</a></li>
<!-- ... 更多分类 -->
```

**开发时注意**：静态生成阶段，分类页的分类导航也需要一并生成。

---

### ⚠️ 重要：所有页面文字已英文化

**问题**：原型文件中曾有部分中文内容，现已全部翻译为英文。

**已翻译文件**：`category.html`

**翻译对照表**：
| 中文 | 英文 |
|------|------|
| 央视频道 | CCTV Channels |
| 央视 | CCTV |
| 卫视频道 | Satellite TV |
| 综合频道 | General |
| 财经频道 | Finance |
| 综艺频道 | Entertainment |
| 体育频道 | Sports |
| 体育赛事 | Sports Events |
| 纪录频道 | Documentary |
| 科教频道 | Education |
| 戏曲频道 | Opera |

**开发时**：所有页面显示文字必须与原型一致。

---

### ⚠️ 开发检查清单

开发实现时，需逐一核对以下功能点：

**Header 导航**：
- [ ] Favorites 按钮链接到 /favorites
- [ ] Plans 按钮链接到 /plans
- [ ] Account 按钮链接到 /account
- [ ] Theme toggle 正常工作
- [ ] 语言切换正常工作

**分类页**：
- [ ] 分类导航从数据库动态读取
- [ ] 批量操作栏始终可见
- [ ] Download M3U 按钮功能正常
- [ ] 批量添加受 200 限制
- [ ] 移动端横向滚动正常

**收藏功能**：
- [ ] 收藏上限 200 个
- [ ] 超限提示含订阅链接
- [ ] M3U 下载功能正常

**频道详情页**：
- [ ] Logo 加载失败显示首字母
- [ ] 移动端海报居中
- [ ] Action buttons 功能正常

---

### 9. SEO 优化 ✅

**涉及文件**：所有页面

**已完成的 SEO 优化**：

| 页面 | 优化项 |
|------|--------|
| homepage.html | Title, Description, Keywords, canonical, Open Graph (og:title, og:description, og:type, og:url, og:image) |
| category.html | Title, Description, canonical, Open Graph, BreadcrumbList Schema |
| channel-detail.html | Title, Description, canonical, Open Graph (og:url, og:title, og:description, og:image, og:type), VideoObject Schema, BreadcrumbList Schema |
| privacy-policy.html | canonical |
| terms.html | canonical |
| tutorial.html | canonical |

**域名统一**：
- 所有页面 canonical 和内部链接使用 `https://iptv-search.com/`（非 www）
- 原型文件中的 `www.iptv-search.com` 已全部替换为 `iptv-search.com`

**Open Graph 标签**：
- og:title - 页面标题
- og:description - 页面描述
- og:type - 内容类型
- og:url - 页面 URL
- og:image - 社交分享图片

**Schema Markup**：
- VideoObject - 频道详情页
- BreadcrumbList - 分类页、频道详情页

**待开发时实现**：
- [ ] sitemap.xml 生成
- [ ] robots.txt
- [ ] 频道详情页增强 VideoObject（添加 contentUrl）
- [ ] 首页添加更多相关频道推荐
