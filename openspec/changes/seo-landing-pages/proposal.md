## Why

GSC数据分析发现5个高搜索量但未覆盖的关键词机会，包括"USA IPTV"、"Smart TV IPTV"、"Android IPTV App"、"UK IPTV"和"免费IPTV"。当前网站缺少针对这些关键词的专属落地页，导致搜索排名落后于竞争对手。通过创建SEO优化落地页，可提升Google搜索可见度，获取更多有机流量。

## What Changes

- 新增 `/usa-iptv` 页面 - 针对 "USA IPTV 频道大全" 关键词
- 新增 `/uk-iptv-plans` 页面 - 针对 "UK IPTV 套餐对比" 关键词（频道介绍方向）
- 优化 `/tutorial` 页面 meta - 针对 "Smart TV IPTV 安装教程" 关键词
- 新增 `/android-iptv-app` 页面 - 针对 "Android IPTV App 推荐" 关键词
- 新增 `/free-iptv-app-review` 页面 - 针对 "免费IPTV App 评测" 关键词
- 更新 sitemap.xml 包含所有新页面
- 所有页面使用静态SEO文本 + 动态API数据渲染

## Capabilities

### New Capabilities

- `seo-landing-usa-iptv`: USA IPTV 落地页，展示美国频道分类（United States），包含频道介绍、订阅引导、FAQ
- `seo-landing-uk-iptv`: UK IPTV 落地页，展示英国频道分类（United Kingdom），包含频道介绍、订阅引导、FAQ
- `seo-landing-android-iptv`: Android IPTV App 推荐页，评测 Televizo、IPTV Smarters Pro、TiviMate 等应用
- `seo-landing-free-iptv`: 免费 IPTV App 评测页，对比 Kodi、VLC、GSE IPTV 等免费选项
- `seo-tutorial-optimization`: 现有教程页面 SEO 优化，调整 meta title/description 覆盖 Smart TV IPTV 关键词

### Modified Capabilities

- （无现有 spec 需要修改）

## Impact

- **新增文件**: `pages-content/usa-iptv.js`, `pages-content/uk-iptv-plans.js`, `pages-content/android-iptv-app.js`, `pages-content/free-iptv-app-review.js`
- **修改文件**: `worker.js` (路由 + 导入), `sitemap.xml` 生成逻辑
- **SEO 影响**: 5个新页面被 Google 索引，提升 5个关键词的搜索可见度
- **依赖**: 数据库中 `channels.group_title = "United States"` / `"United Kingdom"` 的频道数据，前端 JS 调用 `/api/channels?group=` 动态渲染
