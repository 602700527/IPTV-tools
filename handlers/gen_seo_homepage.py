#!/usr/bin/env python3
"""Generate the redesigned generateSEOHomepage for seo-handler.js"""
import textwrap

# Read files
with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'r', encoding='utf-8') as f:
    home_content = f.read()

with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'r', encoding='utf-8') as f:
    seo_content = f.read()

# Extract CSS from home-page.js
style_start = home_content.index('<style>') + 7
style_end = home_content.index('</style>')
css = home_content[style_start:style_end]
print(f"CSS: {len(css)} chars")

# Escape CSS for JS template literal
def escape_js(s):
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

css_escaped = escape_js(css)

# Build channel cards JS code
channels = []  # we'll put placeholder - actual channel data comes from DB

# The new function (as a Python string, no leading indent for JS parts)
NEW_FUNC_PREFIX = r"""// =====================================================================
// 方案D: 静态首页 - 完整复刻 home-page.js 布局
// 静态 HTML = 原版 CSS + 原版 Header/Sidebar + 频道网格（海报卡片）
// Play 按钮点击 → 调用 /api/play/link → redirect 到直链（admin 可禁用）
// =====================================================================
import { getSystemConfig } from '../database.js';

export async function generateSEOHomepage(request, env) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;

  const channelsResult = await getAllChannels(env);
  const groupsResult = await getAllGroups(env);
  const channels = channelsResult.channels || [];
  const groups = groupsResult.groups || [];

  const systemConfig = await getSystemConfig(env);
  const enableIpPlay = systemConfig.enable_ip_play !== false;

  const perPage = 100;
  const totalChannels = channels.length;
  const totalPages = Math.max(1, Math.ceil(totalChannels / perPage));

  const pageTitle = `IPTV Search \u2014 Free IPTV Channel Directory & Search Engine`;
  const metaDescription = `Search over ${channels.length} free IPTV channels from around the world. Sports, news, movies, entertainment. No registration required. Updated daily.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'IPTV Search',
    'description': `Free IPTV channel directory with ${channels.length}+ live TV channels.`,
    'url': origin,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': { '@type': 'EntryPoint', 'urlTemplate': `${origin}/search?q={search_term_string}` },
      'query-input': 'required name=q'
    }
  };

  // ===== 原版完整 CSS（32KB） =====
  const ORIGINAL_CSS = `"""

CSS_BLOCK = css_escaped + """`;

  # ===== Header HTML（静态化版本） =====
  const STATIC_HEADER = `
    <header class="header">
      <div class="header-left">
        <a href="${origin}/" class="logo-link">
          <div class="logo">
            <img src="${origin}/logo.svg" alt="IPTV Search Logo" />
          </div>
        </a>
        <div class="online-counter">
          <span class="online-dot"></span>
          <span class="online-count">${totalChannels.toLocaleString()}</span>
          <span>channels</span>
        </div>
      </div>
      <div class="header-right">
        <div class="search-box">
          <form action="${origin}/search" method="get">
            <input type="text" name="q" class="search-input" placeholder="Search channels..." aria-label="Search channels">
          </form>
        </div>
        <div class="quick-entries">
          <a class="quick-entry" href="${origin}/tutorial" title="How to Watch">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span class="quick-entry-tip">How to Watch</span>
          </a>
          <a class="quick-entry" href="${origin}/freesub" title="Plans">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            <span class="quick-entry-tip">Plans</span>
          </a>
          <a class="quick-entry" href="${origin}/privacy-policy" title="Privacy">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span class="quick-entry-tip">Privacy</span>
          </a>
        </div>
        <a class="auth-btn" href="${origin}/login">Login</a>
        <div id="translate">
          <select onchange="if(this.value)location.href=this.value">
            <option value="${origin}/?lang=en">English</option>
            <option value="${origin}/?lang=zh-CN">\u4e2d\u6587</option>
          </select>
        </div>
      </div>
    </header>`;

  // ===== Sidebar 分组导航 =====
  const sidebarItems = groups.slice(0, 100).map(g => {
    const safeGroup = slugify(g);
    const count = channels.filter(ch => ch.group_title === g).length;
    return `<div class="group-item"><a href="${origin}/category/${safeGroup}" style="color:rgba(255,255,255,0.7);text-decoration:none;display:block">${escapeHtml(g)} <span style="opacity:0.5;font-size:0.8em">(${count})</span></a></div>`;
  }).join('');

  const STATIC_SIDEBAR = `
    <aside class="sidebar" id="sidebar">
      <div class="group-item active"><a href="${origin}/" style="color:#fff;text-decoration:none;display:block">All Channels</a></div>
      ${sidebarItems}
    </aside>`;

  // ===== 频道网格卡片（原版海报样式） =====
  const channelCardsHtml = channels.slice(0, perPage).map(ch => {
    const logo = ch.logo
      ? `<img src="${escapeAttr(ch.logo)}" alt="${escapeHtml(ch.channel_name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="channel-icon" style="display:none;">\uD83D\uDCFA</div>`
      : `<div class="channel-icon">\uD83D\uDCFA</div>`;
    return `<div class="channel-card">
      <div class="channel-poster">
        <a href="${origin}/channel/${escapeAttr(ch.channel_hash)}" style="display:block;width:100%;height:100%;text-decoration:none">
          ${logo}
        </a>
        <a href="${origin}/channel/${escapeAttr(ch.channel_hash)}" class="play-overlay" style="display:flex;align-items:center;justify-content:center;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(229,9,20,0.8);opacity:0;transition:opacity .3s;text-decoration:none">
          <div style="width:60px;height:60px;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </a>
      </div>
      <div class="channel-info">
        <div class="channel-name">
          <a href="${origin}/channel/${escapeAttr(ch.channel_hash)}" style="color:#fff;text-decoration:none" title="${escapeHtml(ch.channel_name)}">${escapeHtml(ch.channel_name)}</a>
        </div>
        <div class="channel-group">${escapeHtml(ch.group_title || '')}</div>
      </div>
    </div>`;
  }).join('');

  // ===== 分页导航 =====
  let paginationHtml = '';
  if (totalPages > 1) {
    paginationHtml = `<div class="pagination" style="display:flex;gap:8px;flex-wrap:wrap;margin:20px 0;justify-content:center">`;
    paginationHtml += `<a href="${origin}/page/2" style="padding:8px 16px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;text-decoration:none;font-size:14px">Next \u2192</a>`;
    paginationHtml += `</div>`;
  }

  // ===== Play 覆盖层 JS（调用 /api/play/link → redirect） =====
  const playOverlayJS = `
    <script>
    window.enableIpPlay = """ + ('true' if enableIpPlay else 'false') + """;
    document.querySelectorAll(".play-overlay").forEach(function(overlay) {
      overlay.addEventListener("click", function(e) {
        e.preventDefault();
        if (!window.enableIpPlay) {
          window.location.href = overlay.getAttribute("href");
          return;
        }
        var href = overlay.getAttribute("href");
        var parts = href.split("/channel/");
        var hash = parts[1] || "";
        var apiUrl = "${origin}/api/play/link?hash=" + hash;
        var btn = overlay.querySelector("div") || overlay;
        btn.style.opacity = "0.5";
        fetch(apiUrl)
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data.success && data.play_link) {
              window.location.href = data.play_link;
            } else {
              window.location.href = href;
            }
          })
          .catch(function() {
            window.location.href = href;
          });
      });
    });
    </script>""";

  const sectionLabel = `All Channels <span style="color:rgba(255,255,255,0.5);font-weight:400;font-size:14px;margin-left:12px">${totalChannels.toLocaleString()} channels</span>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeAttr(metaDescription)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${origin}/">
  <link rel="alternate" hreflang="en" href="${origin}/">
  <link rel="alternate" hreflang="zh-CN" href="${origin}/?lang=zh-CN">
  <link rel="alternate" hreflang="x-default" href="${origin}/">
  <link rel="icon" type="image/svg+xml" href="${origin}/favicon.svg">
  <link rel="apple-touch-icon" href="${origin}/apple-touch-icon.png" sizes="180x180">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/">
  <meta property="og:title" content="${escapeAttr(pageTitle)}">
  <meta property="og:description" content="${escapeAttr(metaDescription)}">
  <meta property="og:image" content="${origin}/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="IPTV Search">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(pageTitle)}">
  <meta name="twitter:description" content="${escapeAttr(metaDescription)}">
  <meta name="twitter:image" content="${origin}/og-homepage.png">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "What is IPTV Search?", "acceptedAnswer": {"@type": "Answer", "text": "IPTV Search indexes public IPTV channel playlists. Find sports, news, movies, entertainment, and international TV channels \u2014 no subscription required."}},
      {"@type": "Question", "name": "How do I use IPTV channels?", "acceptedAnswer": {"@type": "Answer", "text": "Find the channel you want, copy its M3U URL, and add it to any IPTV player app such as VLC, IPTV Smarters, or your smart TV."}},
      {"@type": "Question", "name": "How many channels are available?", "acceptedAnswer": {"@type": "Answer", "text": "We index ${channels.length.toLocaleString()}+ live TV channels across ${groups.length} categories."}},
      {"@type": "Question", "name": "Is registration required?", "acceptedAnswer": {"@type": "Answer", "text": "No. Browse channels, get the M3U URL, and use it with any compatible player \u2014 completely free."}}
    ]
  }
  </script>
  <style>${ORIGINAL_CSS}</style>
</head>
<body>
  ${STATIC_HEADER}

  <div class="main">
    ${STATIC_SIDEBAR}

    <div class="content">
      <div class="section-title" style="font-size:18px;font-weight:600;margin-bottom:20px;color:#fff">
        ${sectionLabel}
      </div>
      <div class="channels-grid">
        ${channelCardsHtml}
      </div>
      ${paginationHtml}
    </div>
  </div>

  ${PAGE_FOOTER}
  ${playOverlayJS}
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Seo-Version': '3.0'
    }
  });
}
"""

# Assemble the full function
new_func = NEW_FUNC_PREFIX + CSS_BLOCK + NEW_FUNC_SUFFIX

# Find and replace
func_start = seo_content.index('export async function generateSEOHomepage')
func_end = seo_content.index('export async function generateChannelPage')
print(f"Replacing chars {func_start} to {func_end} ({func_end - func_start} chars)")

new_seo = seo_content[:func_start] + new_func + '\n\n' + seo_content[func_end:]

with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'w', encoding='utf-8') as f:
    f.write(new_seo)

print(f"Written: {len(new_seo)} chars. Done!")
