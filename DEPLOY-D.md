# iptv-search.com 方案 D 部署指南

## 改动文件清单

### 1. `handlers/seo-handler.js` （重写，1005 行）

**新增函数：**
- `generateStaticHomepage(request, env, page)` — 生成静态分页首页，每页 100 条频道，纯 HTML 无 JS
- `generateSearchPage(request, env)` — 搜索结果页，返回静态 HTML
- `generateChannelPage(request, env, channelHash)` — 增强版频道页，保留静态 HTML 结构，新增三个交互按钮（播放、复制链接、下载 M3U），按钮点击时才通过 `/api/play/link` 获取直链

**修改函数：**
- `handleSEOPage(request, env)` — 首页路由改为调用 `generateStaticHomepage`；新增 `/page/{n}` 分页路由；频道页调用增强后的 `generateChannelPage`；保留 `/sitemap.xml` 和 `/category/{slug}` 逻辑

**删除：**
- `generateSEOHomepage` 函数（已废弃，被 `generateStaticHomepage` 替代）

**新增功能：**
- 首页分页：每页 100 条频道，底部「1 2 3 … N」分页导航
- 搜索框表单改为 `GET /search?q=xxx`
- 频道页嵌入约 2KB JS：点击「播放」跳转 `/play/{link_id}/{hash}`；点击「复制链接」复制直链（带 IP 绑定说明）；点击「下载 M3U」生成含直链的 `.m3u` 文件
- Sitemap 新增 `/page/{n}` 分页 URL

### 2. `worker.js` （修改）

**修改点：**
- 第 12 行 import：移除 `isSearchEngineBot`，新增 `generateStaticHomepage` 和 `generateSearchPage`
- 首页路由（原第 210 行附近）：删除 `if (isSearchEngineBot(request))` cloaking 判断，改为直接调用 `generateStaticHomepage(request, env, 1)` 返回静态 HTML
- 新增 `/page/{n}` 路由 → `generateStaticHomepage(request, env, page)`
- 新增 `/search` 路由 → `generateSearchPage(request, env)`

**死代码（无害）：**
- `HOME_HTML` 和 `getSystemConfig` 仍被 import 但首页路由不再使用，可后续清理

### 3. `home-page.js`（无改动，保留备用）

---

## 部署步骤

### 方式一：通过 Wrangler CLI 部署（推荐）

```bash
cd C:\Users\60270\Desktop\cfworker2

# 预览（可选）
npx wrangler deploy --dry-run

# 正式部署
npx wrangler deploy
```

### 方式二：通过 GitHub Actions（如果配置了 CI/CD）

```bash
git add handlers/seo-handler.js worker.js
git commit -m "feat: 方案D - 首页静态化，消除cloaking"
git push origin main
# GitHub Actions 自动触发部署
```

### 部署后验证

```bash
# 1. 验证首页静态 HTML（普通用户 UA）
curl -A "Mozilla/5.0" https://iptv-search.com/ -o /tmp/home.html
wc -c /tmp/home.html          # 应 < 200KB
grep -c "channel-card" /tmp/home.html  # 应有 ~100 个频道卡片

# 2. 验证 Googlebot 看到相同 HTML（无 cloaking）
curl -A "Googlebot/2.1" https://iptv-search.com/ -o /tmp/home-bot.html
diff /tmp/home.html /tmp/home-bot.html  # 应无差异

# 3. 验证分页路由
curl -A "Mozilla/5.0" https://iptv-search.com/page/2 -o /tmp/page2.html
grep -c "channel-card" /tmp/page2.html  # 应有 ~100 个频道卡片

# 4. 验证频道页有交互按钮
curl -A "Mozilla/5.0" https://iptv-search.com/channel/<SOME_HASH> -o /tmp/ch.html
grep "play-btn" /tmp/ch.html     # 应有 play-btn
grep "m3u-btn" /tmp/ch.html      # 应有 m3u-btn
grep "fetchPlayLink" /tmp/ch.html # 应有 JS fetch 调用

# 5. 验证搜索页
curl -A "Mozilla/5.0" "https://iptv-search.com/search?q=BBC" -o /tmp/search.html
grep "BBC" /tmp/search.html      # 应有 BBC 相关结果

# 6. 验证 IP 直连播放 API（需要真实频道 hash）
curl https://iptv-search.com/api/play/link?hash=<REAL_HASH>
# 应返回: {"success": true, "play_link": "https://iptv-search.com/play/xxx/hash"}
```

---

## 缓存策略

| 页面 | Cache-Control | 说明 |
|------|--------------|------|
| 首页 `/` | `public, max-age=300` | 5 分钟 TTL |
| 分页 `/page/{n}` | `public, max-age=300` | 5 分钟 TTL |
| 频道页 `/channel/{hash}` | `public, max-age=3600` | 1 小时 TTL |
| 分类页 `/category/{slug}` | `public, max-age=7200` | 2 小时 TTL |
| 搜索页 `/search` | `public, max-age=300` | 5 分钟 TTL |
| Sitemap | `public, max-age=43200` | 12 小时 TTL |

**KV 数据更新时主动 Purge：**
- 在 `handlers/scheduler.js` 的定时任务中，更新 KV 数据后调用 `Cache.purge(key)` 清除对应缓存
- 或通过 Cloudflare Dashboard 手动 Purge

---

## IP 绑定逻辑（未改动）

- `/api/play/link?hash=xxx` → 创建 `/play/{link_id}/{hash}` 链接，最多绑定 3 个 IP
- `/play/{link_id}/{hash}` → 验证请求方 IP 是否已绑定，绑定数 < 3 则允许，否则返回 403
- 频道页 JS 调用流程：`点击按钮 → fetch /api/play/link → 获取 /play/{link_id}/{hash} → 跳转/复制/下载`

---

## 验收标准自测清单

- [ ] `curl -A "Mozilla/5.0" https://iptv-search.com/` 返回含 ~100 个频道卡片的完整 HTML
- [ ] `curl -A "Googlebot/2.1" https://iptv-search.com/` 返回与上述完全相同的 HTML（无 cloaking）
- [ ] `curl -A "Mozilla/5.0" https://iptv-search.com/page/2` 返回第 2 页 HTML
- [ ] `curl -A "Mozilla/5.0" https://iptv-search.com/channel/<HASH>` 返回含播放/复制/M3U 按钮的 HTML
- [ ] `curl https://iptv-search.com/api/play/link?hash=<REAL>` 返回 `{success: true, play_link: "..."}`
- [ ] `curl https://iptv-search.com/play/<LINK_ID>/<HASH>` 返回 302 重定向到真实播放 URL
- [ ] `curl -A "Mozilla/5.0" "https://iptv-search.com/search?q=BBC"` 返回搜索结果 HTML
- [ ] 首页 HTML 体积 < 200KB
