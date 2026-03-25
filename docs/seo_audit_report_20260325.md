# iptv-search.com 全面 SEO 审计报告

**审计日期：** 2026-03-25
**审计范围：** 首页 `/`、频道详情页 `/channel/{hash}`、分类页 `/category/{slug}`
**依据：** `seo-handler.js` 源代码 + sitemap.xml + robots.txt

---

## 执行摘要

网站架构清晰、SSR 方案合理、sitemap/robots 配置正确，核心 SEO 基础设施可用。
但存在：Schema 类型错误、分类体系描述不符、中文 SEO 缺失、部分 Title/Description 超长等技术问题，需按优先级修复。

---

## A. 关键词策略

### 核心发现：分类体系是按国家/地区，不是内容类型

sitemap.xml 中所有分类 slug 均为小写国家名（brazil/china/usa 等），**不是** Sports/News/Movies。
这对 SEO 策略有重大影响：

| 分类类型 | 核心词模板 |
|----------|-----------|
| 国家分类页 | `{Country} IPTV Channels` |
| 国家+内容 | `{Country} Sports IPTV` |
| 国家+语言 | `China IPTV 中文` |

### 长尾关键词清单（30 个）

| # | 关键词 | 意图 |
|---|--------|------|
| 1 | free iptv m3u download | 信息型 |
| 2 | watch cctv live free online | 导航型 |
| 3 | free sports iptv channels | 信息型 |
| 4 | iptv channel list free | 信息型 |
| 5 | how to watch iptv on smart tv | 信息型 |
| 6 | free iptv player no subscription | 信息型 |
| 7 | brazil iptv channels free | 信息型 |
| 8 | usa live tv channels free | 信息型 |
| 9 | arab iptv free m3u | 信息型 |
| 10 | iptv m3u8 free stream links | 信息型 |
| 11 | nba games live free iptv | 信息型 |
| 12 | football live iptv free | 信息型 |
| 13 | bein sports iptv free | 信息型 |
| 14 | espn free iptv stream | 信息型 |
| 15 | cnn live stream free | 信息型 |
| 16 | hbo iptv free online | 信息型 |
| 17 | iptv chinese channels free | 信息型 |
| 18 | tv philippines iptv free | 信息型 |
| 19 | latin america iptv free | 信息型 |
| 20 | iptv channels updated daily | 信息型 |
| 21 | free iptv no registration required | 信息型 |
| 22 | iptv channel search engine | 导航型 |
| 23 | free movie channels iptv | 信息型 |
| 24 | news channels iptv free | 信息型 |
| 25 | disney plus iptv alternative free | 信息型 |
| 26 | india free iptv channels | 信息型 |
| 27 | europe iptv free channels | 信息型 |
| 28 | iptv links that actually work | 信息型 |
| 29 | free iptv for firestick | 信息型 |
| 30 | world cup iptv free live | 事件型 |

---

## B. Title 模板优化

### 首页 Title

**当前问题**：`${channels.length}` 动态数字导致 Title 不稳定
**建议**：
```
Free IPTV Search — 10,000+ Live TV Channels [2026]
```
字符数：47，含"Free IPTV"完整词组，年份增强新鲜度信号

### 分类页 Title（严重：当前 72 字符，超 60 上限）

**当前**：`{Country} IPTV Channels — {count} Free Live TV Streams` = 72字符 ❌
**建议**：`{Country} IPTV Channels - Free Live TV Streams [2026]` = 51字符 ✅

### 频道页 Title

**当前**：`{channel_name} — Free Live IPTV Stream`（49字符）✅
**建议**：`{channel_name} IPTV - Free Live Stream | {category}`（≤58字符）

---

## C. Meta Description 优化

### 首页 Description

**严重问题**：声称 "Browse by category: Sports, News, Entertainment..." 但分类实际为国家！
**建议**：
```
Search 10,000+ free IPTV channels from 100+ countries. Browse live TV by region: USA, Brazil, China, India and more. No registration. Updated daily.
```
字符数：151，诚实描述分类体系

### 分类页 Description

**建议**：
```
Watch {count} free {country} IPTV channels live. TV from {country} including news, sports & movies. No subscription, no signup. Updated daily.
```

### 频道页 Description

**建议**：
```
{channel_name} IPTV stream free online. Watch live {category} TV channel. No signup required. Updated daily.
```

---

## D. JSON-LD 结构化数据

### 🔴 严重：频道页 Schema 类型错误

**当前**：`TVChannel` — 表示"该页面是电视台官网"
**问题**：iptv-search.com 是目录站，用 TVChannel 语义冲突，Google 可能判定 Schema 滥用

**修复**：改为 `WebPage` 或 `ItemPage`

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{channel_name}",
  "description": "{channel_name} free IPTV channel",
  "url": "https://iptv-search.com/channel/{hash}",
  "isPartOf": {
    "@type": "WebSite",
    "name": "IPTV Search",
    "url": "https://iptv-search.com"
  }
}
```

### 所有页面缺失：BreadcrumbList Schema

每个页面都应包含：

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://iptv-search.com/" },
    { "@type": "ListItem", "position": 2, "name": "{Category}", "item": "https://iptv-search.com/category/{slug}" },
    { "@type": "ListItem", "position": 3, "name": "{channel_name}", "item": "https://iptv-search.com/channel/{hash}" }
  ]
}
```

### ❌ 严禁添加：虚假 AggregateRating

**切勿添加** `ratingValue: 4.8, ratingCount: 12500` 等假数据，属于欺诈

### ❌ 不建议添加：VideoObject

网站是目录站，不托管视频内容，添加 VideoObject 会造成 Schema 与内容不匹配

---

## E. Open Graph 问题

### 🔴 og:image 缺失（首页 + 分类页）

**解决方案**：使用已生成的 `/og-homepage.png`

```html
<meta property="og:image" content="https://iptv-search.com/og-homepage.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
```

### 缺失 og:locale

所有页面应添加：
```html
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="zh_CN">
```

---

## F. 内链问题

### 🔴 频道页"Watch Now →"按钮严重误导

**当前**：`href="${origin}/"` — 点击后跳回首页，不是播放
**对用户**：欺骗感
**对爬虫**：暗示该页"不是播放页"，与 TVChannel Schema 冲突

**修复**：改为说明文字，无链接
```html
<a class="play-btn" style="cursor:default">📺 Copy M3U Link Above to Watch</a>
```

---

## G. 技术 SEO

### Canonical ✅ 基本正确
- 首页：`${origin}/` ✅
- 分类页：`${origin}/category/${slug}` ✅
- 分页 canonical 应指向首页（非带参数 URL）

### hreflang ⚠️ 仅首页有
- sitemap.xml 中只有首页有 hreflang
- 频道页/分类页无语言信号

### HTML lang 属性 ❌ 全部缺失
- 所有页面应为 `<html lang="en">`

### sitemap 频道页 1000 条上限（严重）
- 当前限制 1000 条，但实际 10,000+ 频道
- **大量频道无法被 Google 索引**
- 建议提升至 5000 条

---

## H. 中文 SEO

### 核心问题：无中文内容
- sitemap hreflang `?lang=zh-CN` 无实际中文内容支撑
- 目标用户是中文群体，但无中文页面

### 如果启用中文 URL 参数
| 页面 | 中文 Title 建议 |
|------|---------------|
| 首页 | 免费IPTV搜索 - 10000+全球直播电视频道 |
| 分类页 | {国家}IPTV频道_免费在线观看 |
| 频道页 | {频道名}IPTV免费在线直播 |

---

## 实施优先级

### 🔴 P0（立即修复）
1. 频道页 Schema 从 TVChannel → WebPage
2. 频道页"Watch Now"按钮改为说明文字
3. 首页 Description 去掉 "Sports, News, Movies" 描述（与实际分类不符）
4. 分类页 Title 缩减至 60 字符以内

### 🟡 P1（本周）
5. 所有页面添加 `<html lang="en">`
6. 添加 BreadcrumbList JSON-LD
7. 首页 + 分类页添加 og:image
8. 添加 og:locale

### 🟢 P2（后续）
9. sitemap 频道数上限提升至 5000
10. 频道页/分类页添加 hreflang（HTML head）
11. 中文版页面（或至少中文 Meta）
12. Footer 增加描述性 SEO 文字
