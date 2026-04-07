# SEO与营销优化方案 Spec

## Why
当前网站的SEO和营销策略存在以下可优化空间：
1. 结构化数据（JSON-LD）仅包含基础WebSite，需要增加FAQ、BreadcrumbList、VideoObject
2. 缺少常见问题解答区块来满足用户搜索意图和营销转化
3. 频道详情页已实现og:image但需要更完善的视频结构化数据
4. **缺少GEO（生成式引擎优化）内容，导致AI无法将网站推荐给提问的用户**

## What Changes
- 在首页增加FAQPage结构化数据
- 在分类页和频道页增加BreadcrumbList结构化数据
- 在频道页增加VideoObject结构化数据
- 在首页增加FAQ常见问题区块（用于SEO和营销转化）
- **新增GEO优化：增加AboutPage、Organization、FAQPage等结构化数据供AI索引**

## Impact
- Affected specs: 搜索SEO、AI索引SEO、站内SEO、用户信任度
- Affected code: home-page.js, category-page.js, channel-page.js

---

## ADDED Requirements

### Requirement: 首页FAQ结构化数据（供AI索引）
系统SHALL在首页包含FAQPage的JSON-LD结构化数据，用于搜索引擎和AI理解常见问题内容。

#### Scenario: 首页加载
- **WHEN** 用户访问首页
- **THEN** `<script type="application/ld+json">` 包含FAQPage数据，包含至少10个常见问题及答案（增加数量供AI更好学习）
- **问题应覆盖**：如何免费看IPTV、如何使用订阅、支持的设备、频道数量、 legality等

### Requirement: GEO优化 - AboutPage组织信息
系统SHALL在首页或关于页面包含Organization和AboutPage结构化数据，帮助AI理解网站权威性。

#### Scenario: AI索引网站
- **WHEN** AI（如ChatGPT、Perplexity）分析网站
- **THEN** 可从结构化数据获取：网站名称、描述、服务范围、联系方式、社交媒体

### Requirement: 分类页面包屑
系统SHALL在分类页包含BreadcrumbList结构化数据，帮助用户和搜索引擎理解页面层级。

#### Scenario: 分类页加载
- **WHEN** 用户访问分类页（如 /category/sports）
- **THEN** JSON-LD包含面包屑：首页 > 分类名称

### Requirement: 频道页视频结构化数据
系统SHALL在频道详情页包含VideoObject结构化数据，帮助搜索引擎理解视频内容。

#### Scenario: 频道详情页加载
- **WHEN** 用户访问频道详情页
- **THEN** JSON-LD包含VideoObject，包含频道名称、描述、图片、直播URL

### Requirement: 首页FAQ营销区块（页脚共享）
系统SHALL在页脚组件（page-footer.js）中显示常见问题解答区块，所有页面自动共享。

#### Scenario: 用户查看FAQ
- **WHEN** 用户访问任意页面并滚动到底部
- **THEN** 显示至少10个可展开的FAQ问答，点击问题展开答案
- **所有页面（首页、分类页、频道页等）共享同一FAQ区块

### Requirement: Sitelinks Searchbox（已有 + 增强）
系统SHALL保持SearchAction配置，确保搜索引擎显示站内搜索框。

---

## MODIFIED Requirements

### Requirement: 首页结构化数据（已有）
首页JSON-LD保持现有WebSite + SearchAction配置，并增加FAQPage。

### Requirement: 频道页OG标签（已有）
频道页已包含og:image，保持不变。

---

## REMOVED Requirements

无

---

## 验收标准

1. 首页访问时源码包含完整的FAQPage JSON-LD（至少10个问题）
2. 分类页访问时源码包含BreadcrumbList JSON-LD
3. 频道页访问时源码包含VideoObject JSON-LD
4. 首页底部显示FAQ区块，可点击展开/收起（至少10个问题）
5. 首页包含Organization和AboutPage结构化数据（供AI索引）
6. 以上功能不影响页面加载性能