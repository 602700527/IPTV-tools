## Why

SEO落地页已创建（/usa-iptv, /uk-iptv-plans, /android-iptv-app, /free-iptv-app-review），但用户访问首页后无法发现这些页面。通过在首页添加「热门专题」栏目，不仅提升用户体验（快速找到目标内容），还能增加内部链接传递PageRank，同时引导用户深入浏览，提升站内停留时间。

## What Changes

- 在首页搜索框下方添加「热门专题」栏目
- 5个专题卡片展示：USA IPTV、UK IPTV、Smart TV、Android IPTV、免费IPTV
- 每个卡片包含：图标、标题、简短描述
- 卡片链接至对应的SEO落地页
- 响应式布局，适配桌面端和移动端
- 保持与现有首页风格一致（Netflix红 + 深色主题）

## Capabilities

### New Capabilities

- `homepage-hot-topics`: 首页热门专题模块，展示5个SEO落地页的入口卡片

### Modified Capabilities

- （无现有 spec 需要修改）

## Impact

- **新增文件**: 可能在 `pages/home-page.js` 中添加模块组件
- **修改文件**: `pages/home-page.js` - 添加「热门专题」HTML结构
- **SEO 影响**: 增强内部链接结构，提升落地页PageRank
- **用户体验**: 用户可快速访问目标专题页面
