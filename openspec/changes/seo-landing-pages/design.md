## Context

当前网站缺少针对5个高机会关键词的专属落地页。根据GSC数据：
- "USA IPTV 频道大全" - GSC无覆盖
- "Smart TV IPTV 安装教程" - GSC无覆盖
- "Android IPTV App 推荐" - GSC无覆盖
- "UK IPTV 套餐对比" - GSC无覆盖
- "免费IPTV App 评测" - GSC无覆盖

现有 `/tutorial` 页面已覆盖部分 Smart TV 内容，但 SEO meta 未针对该关键词优化。

数据库中频道按 `group_title` 分类，包含 "United States" 和 "United Kingdom" 分组，可用于 USA/UK 落地页的动态内容渲染。

## Goals / Non-Goals

**Goals:**
- 创建5个 SEO 优化落地页，提升关键词搜索排名
- 页面内容符合搜索引擎优化最佳实践（meta 标签、H1 结构、FAQ schema）
- 复用现有 `generateStaticPage()` 架构，保持代码一致性
- sitemap.xml 自动包含新页面，便于 Google 抓取

**Non-Goals:**
- 不做后端数据库修改
- 不做用户认证、支付等业务逻辑
- 不做多语言支持（仅中英文混合内容）
- Smart TV 不新建页面，优化现有 `/tutorial` 即可

## Decisions

### 决策 1: 页面内容架构 - 静态文本 + 动态 API

**选择**: 页面外壳为静态 HTML/SEO meta，频道列表由前端 JS 调用 `/api/channels?group=United%20States` 动态渲染

**原因**:
- SEO 文本（描述、FAQ）可被搜索引擎索引
- 频道数据动态加载，保证实时性
- 复用现有 `handlePublicChannels` API，无需新增接口

**替代方案**:
- 纯静态页面（数据库查好数据写死）: 频道数据无法实时更新
- SSR 渲染: Cloudflare Workers 环境限制，方案复杂

### 决策 2: 复用 `generateStaticPage()` 而非新建渲染函数

**选择**: 复用现有 `generateStaticPage(pageTitle, pageDescription, styles, content)` 函数

**原因**:
- 代码一致性：与 `/tutorial`, `/privacy-policy` 等页面架构一致
- 维护简单：只需关注页面内容 JS 文件，不需要修改 worker.js 渲染逻辑
- 样式复用：`PAGE_HEADER` 和 `PAGE_FOOTER` 组件自动注入

**替代方案**:
- 新建专用渲染函数: 架构膨胀，不必要

### 决策 3: USA/UK 页面内容方向

**USA IPTV**: 频道介绍 + 订阅引导页
- 静态文字介绍美国 IPTV 优势、热门频道（CNN, ESPN, HBO等）
- 动态渲染 `group_title = "United States"` 的频道列表

**UK IPTV**: 频道介绍 + 订阅引导页
- 静态文字介绍英国 IPTV 优势、热门频道（BBC, ITV, Sky Sports等）
- 动态渲染 `group_title = "United Kingdom"` 的频道列表

**原因**: 用户搜索意图为"找频道"，而非"比套餐"（套餐对比需有差异化套餐数据支撑）

### 决策 4: 路由设计

| 页面 | 路由 | HTTP Method |
|------|------|-------------|
| USA IPTV | `GET /usa-iptv` | GET |
| UK IPTV | `GET /uk-iptv-plans` | GET |
| Smart TV (优化) | `GET /tutorial` (已有) | GET |
| Android IPTV | `GET /android-iptv-app` | GET |
| 免费 IPTV | `GET /free-iptv-app-review` | GET |

**原因**: 路由符合用户搜索意图，URL 可读性强

## Risks / Trade-offs

- **[风险] Google 索引周期慢** → **缓解**: 提交 sitemap.xml 后等待 1-4 周
- **[风险] 页面内容与搜索意图不匹配导致跳出率高** → **缓解**: 确保 H1、meta description 与用户期望一致
- **[风险] 动态加载的频道数据影响 SEO** → **缓解**: 静态文字内容占页面主体，频道列表作为补充
- **[权衡] 前端 JS 渲染 vs SSR**: 选择前端渲染是因 Workers 环境限制，但牺牲部分 SEO 效果

## Migration Plan

1. 创建页面内容文件 (`pages-content/*.js`)
2. 修改 `worker.js`: 添加导入和路由
3. 更新 sitemap.xml 静态页面列表
4. 本地测试 `npm run dev` 验证页面可访问
5. 部署 `npm run deploy`
6. 手动提交 sitemap.xml 到 Google Search Console

**Rollback**: git revert 修改即可回滚

## Open Questions

- （无）
