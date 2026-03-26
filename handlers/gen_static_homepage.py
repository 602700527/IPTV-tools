#!/usr/bin/env python3
"""Generate the new generateStaticHomepage function"""
import re

# Read the original home-page.js
with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'r', encoding='utf-8') as f:
    home_content = f.read()

# Read current seo-handler.js
with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'r', encoding='utf-8') as f:
    seo_content = f.read()

# Extract CSS
style_start = home_content.index('<style>') + 7
style_end = home_content.index('</style>')
css = home_content[style_start:style_end]

# Extract just the header HTML (the static part - logo, search, quick entries)
# We want the header structure but without JS event handlers
# Find the header section in home-page.js body
body_start = home_content.index('<body>')
header_start = home_content.index('<header', body_start)
header_end = home_content.index('</header>') + len('</header>')
header_html = home_content[header_start:header_end]

# Clean up the header - remove onclick, oninput, etc. handlers
# Also simplify quick entries to just static links
# Keep the search as a form submit

# For the static version, simplify the header:
# - Logo: keep
# - Online counter: static text "Free IPTV"
# - Search: GET form submit to /search
# - Quick entries: just show icons (no JS), as decorative/static
# - Auth: just show Login link

# The sidebar and main content will be generated dynamically in the JS function

# Now build the new generateStaticHomepage function
new_function = f'''// ======================
// 方案D: 静态首页生成器 - 原版布局
// 使用原版 home-page.js CSS，完整复刻 Header + Sidebar + 频道网格布局
// ======================
export async function generateStaticHomepage(request, env, page = 1) {{
  const url = new URL(request.url);
  const origin = `${{url.protocol}}//${{url.host}}`;
  
  const channelsResult = await getAllChannels(env);
  const groupsResult = await getAllGroups(env);
  const channels = channelsResult.channels || [];
  const groups = groupsResult.groups || [];

  const perPage = 100;
  const totalChannels = channels.length;
  const totalPages = Math.max(1, Math.ceil(totalChannels / perPage));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (safePage - 1) * perPage;
  const pageChannels = channels.slice(startIndex, startIndex + perPage);

  const canonicalUrl = safePage === 1 ? origin + '/' : origin + '/page/' + safePage;
  const pageTitle = safePage === 1
    ? `IPTV Search — Free IPTV Channel Directory & Search Engine`
    : `IPTV Channels Page ${{safePage}} of ${{totalPages}} | IPTV Search`;
  const metaDescription = safePage === 1
    ? `Search over ${{totalChannels}} free IPTV channels from around the world. Sports, news, movies, entertainment. No registration required. Updated daily.`
    : `Browse IPTV channels page ${{safePage}} of ${{totalPages}}. Over ${{totalChannels}} free live TV streams.`;

  const jsonLd = {{
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'IPTV Search',
    'description': `Free IPTV channel directory with ${{totalChannels}}+ live TV channels.`,
    'url': origin,
    'potentialAction': {{
      '@type': 'SearchAction',
      'target': {{ '@type': 'EntryPoint', 'urlTemplate': `${{origin}}/search?q={{search_term_string}}` }},
      'query-input': 'required name=q'
    }}
  }};

  // ======================
  // 原版 CSS (从 home-page.js 提取，共 {css.count(chr(10))} 行)
  // ======================
  const ORIGINAL_CSS = `{css}`;

  // ======================
  // 原版 Header HTML (简化版，移除 JS 依赖)
  // ======================
  const STATIC_HEADER = `
    <header class="header">
      <div class="header-left">
        <a href="${{origin}}/" class="logo-link">
          <div class="logo">
            <img src="${{origin}}/logo.svg" alt="IPTV Search Logo" />
          </div>
        </a>
        <div class="online-counter">
          <span class="online-dot"></span>
          <span class="online-count">${{totalChannels.toLocaleString()}}</span>
          <span>channels</span>
        </div>
      </div>
      <div class="header-right">
        <div class="search-box">
          <form action="${{origin}}/search" method="get">
            <input type="text" name="q" class="search-input" placeholder="Search channels..." aria-label="Search channels">
          </form>
        </div>
        <div class="quick-entries">
          <a class="quick-entry" href="${{origin}}/tutorial" title="How to Watch">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span class="quick-entry-tip">How to Watch</span>
          </a>
          <a class="quick-entry" href="${{origin}}/freesub" title="Plans">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            <span class="quick-entry-tip">Plans</span>
          </a>
          <a class="quick-entry" href="${{origin}}/privacy-policy" title="Privacy">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span class="quick-entry-tip">Privacy</span>
          </a>
        </div>
        <a class="auth-btn" href="${{origin}}/login">Login</a>
        <div id="translate">
          <select onchange="if(this.value){{location.href=this.value.replace(/__LANG__/g,document.documentElement.lang||'en')}}">
            <option value="${{origin}}/?lang=en">English</option>
            <option value="${{origin}}/?lang=zh-CN">中文</option>
          </select>
        </div>
      </div>
    </header>`;

  // ======================
  // Sidebar: 分组导航
  // ======================
  const sidebarGroupsHtml = groups.slice(0, 100).map(g => {{
    const safeGroup = slugify(g);
    const count = channels.filter(ch => ch.group_title === g).length;
    return `<div class="group-item"><a href="${{origin}}/category/${{safeGroup}}" style="color:rgba(255,255,255,0.7);text-decoration:none;display:block">${{escapeHtml(g)}} <span style="opacity:0.5;font-size:0.8em">(${{count}})</span></a></div>`;
  }}).join('\\n');

  const STATIC_SIDEBAR = `
    <aside class="sidebar" id="sidebar">
      <div class="group-item active"><a href="${{origin}}/" style="color:#fff;text-decoration:none;display:block">All Channels</a></div>
      ${{sidebarGroupsHtml}}
    </aside>`;

  // ======================
  // 频道卡片网格 (原版 poster 样式)
  // ======================
  const channelCardsHtml = pageChannels.map(ch => {{
    const logo = ch.logo
      ? `<img src="${{escapeAttr(ch.logo)}}" alt="${{escapeHtml(ch.channel_name)}}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="channel-icon" style="display:none;">📺</div>`
      : `<div class="channel-icon">📺</div>`;
    return `
        <div class="channel-card">
          <div class="channel-poster">
            <a href="${{origin}}/channel/${{escapeAttr(ch.channel_hash)}}" style="display:block;width:100%;height:100%;">
              ${{logo}}
            </a>
            <div class="play-overlay">
              <a href="${{origin}}/channel/${{escapeAttr(ch.channel_hash)}}" class="play-icon" style="display:flex;align-items:center;justify-content:center;width:60px;height:60px;border:3px solid #fff;border-radius:50%;text-decoration:none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </a>
            </div>
          </div>
          <div class="channel-info">
            <div class="channel-name">
              <a href="${{origin}}/channel/${{escapeAttr(ch.channel_hash)}}" style="color:#fff;text-decoration:none" title="${{escapeHtml(ch.channel_name)}}">${{escapeHtml(ch.channel_name)}}</a>
            </div>
            <div class="channel-group">${{escapeHtml(ch.group_title || '')}}</div>
          </div>
        </div>`;
  }}).join('\\n');

  // ======================
  // 分页导航
  // ======================
  let paginationHtml = '';
  if (totalPages > 1) {{
    const maxVisible = 7;
    paginationHtml = `<div class="pagination" style="display:flex;gap:8px;flex-wrap:wrap;margin:20px 0;justify-content:center">`;
    if (safePage > 1) {{
      paginationHtml += `<a href="${{safePage === 2 ? origin + '/' : origin + '/page/' + (safePage - 1)}}" style="padding:8px 16px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;text-decoration:none;font-size:14px">← Prev</a>`;
    }}
    const half = Math.floor(maxVisible / 2);
    let startP = Math.max(1, safePage - half);
    let endP = Math.min(totalPages, startP + maxVisible - 1);
    if (endP - startP < maxVisible - 1) startP = Math.max(1, endP - maxVisible + 1);
    if (startP > 1) {{
      paginationHtml += `<a href="${{origin}}/" style="padding:8px 16px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;text-decoration:none;font-size:14px">1</a>`;
      if (startP > 2) paginationHtml += `<span style="padding:8px;color:rgba(255,255,255,0.4)">…</span>`;
    }}
    for (let p = startP; p <= endP; p++) {{
      if (p === safePage) {{
        paginationHtml += `<span style="padding:8px 16px;background:#e50914;border:1px solid #e50914;border-radius:6px;color:#fff;font-size:14px">${{p}}</span>`;
      }} else {{
        paginationHtml += `<a href="${{p === 1 ? origin + '/' : origin + '/page/' + p}}" style="padding:8px 16px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;text-decoration:none;font-size:14px">${{p}}</a>`;
      }}
    }}
    if (endP < totalPages) {{
      if (endP < totalPages - 1) paginationHtml += `<span style="padding:8px;color:rgba(255,255,255,0.4)">…</span>`;
      paginationHtml += `<a href="${{origin}}/page/${{totalPages}}" style="padding:8px 16px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;text-decoration:none;font-size:14px">${{totalPages}}</a>`;
    }}
    if (safePage < totalPages) {{
      paginationHtml += `<a href="${{origin}}/page/${{safePage + 1}}" style="padding:8px 16px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;text-decoration:none;font-size:14px">Next →</a>`;
    }}
    paginationHtml += `</div>`;
  }}

  // ======================
  // 组内频道计数（用于分组导航）
  // ======================
  const groupCounts = groups.map(g => ({{ name: g, count: channels.filter(ch => ch.group_title === g).length })));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${{escapeHtml(pageTitle)}}</title>
  <meta name="description" content="${{escapeAttr(metaDescription)}}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${{canonicalUrl}}">
  <link rel="alternate" hreflang="en" href="${{origin}}/">
  <link rel="alternate" hreflang="zh-CN" href="${{origin}}/?lang=zh-CN">
  <link rel="alternate" hreflang="x-default" href="${{origin}}/">
  <link rel="icon" type="image/svg+xml" href="${{origin}}/favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${{canonicalUrl}}">
  <meta property="og:title" content="${{escapeAttr(pageTitle)}}">
  <meta property="og:description" content="${{escapeAttr(metaDescription)}}">
  <meta property="og:image" content="${{origin}}/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="IPTV Search">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${{escapeAttr(pageTitle)}}">
  <meta name="twitter:description" content="${{escapeAttr(metaDescription)}}">
  <meta name="twitter:image" content="${{origin}}/og-homepage.png">
  <link rel="alternate" hreflang="en" href="${{origin}}/" />
  <link rel="alternate" hreflang="zh-CN" href="${{origin}}/?lang=zh-CN" />
  <link rel="alternate" hreflang="zh-TW" href="${{origin}}/?lang=zh-TW" />
  <link rel="alternate" hreflang="x-default" href="${{origin}}/" />
  <script type="application/ld+json">${{JSON.stringify(jsonLd)}}</script>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {{"@type": "Question", "name": "What is IPTV Search?", "acceptedAnswer": {{"@type": "Answer", "text": "IPTV Search indexes public IPTV channel playlists. Find sports, news, movies, entertainment, and international TV channels — no subscription required."}}}},
      {{"@type": "Question", "name": "How do I use IPTV channels?", "acceptedAnswer": {{"@type": "Answer", "text": "Find the channel you want, copy its M3U URL, and add it to any IPTV player app such as VLC, IPTV Smarters, or your smart TV."}}}},
      {{"@type": "Question", "name": "How many channels are available?", "acceptedAnswer": {{"@type": "Answer", "text": "We index ${{totalChannels.toLocaleString()}}+ live TV channels across ${{groups.length}} categories."}}}},
      {{"@type": "Question", "name": "Is registration required?", "acceptedAnswer": {{"@type": "Answer", "text": "No. Browse channels, get the M3U URL, and use it with any compatible player — completely free."}}}}
    ]
  }}
  </script>
  <style>${{ORIGINAL_CSS}}</style>
</head>
<body>
  ${{STATIC_HEADER}}

  <div class="main">
    ${{STATIC_SIDEBAR}}

    <div class="content">
      <div class="section-title" style="font-size:18px;font-weight:600;margin-bottom:20px;color:#fff">
        ${{safePage === 1 ? 'All Channels' : 'Page ' + safePage + ' of ' + totalPages}}
        <span style="color:rgba(255,255,255,0.5);font-weight:400;font-size:14px;margin-left:12px">${{totalChannels.toLocaleString()}} channels</span>
      </div>
      <div class="channels-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
        ${{channelCardsHtml}}
      </div>
      ${{paginationHtml}}
    </div>
  </div>

  <footer style="background:#141414;border-top:1px solid rgba(255,255,255,0.1);padding:20px 40px;text-align:center;color:rgba(255,255,255,0.5);font-size:14px">
    <p>© ${{new Date().getFullYear()}} IPTV Search · <a href="${{origin}}/tutorial" style="color:rgba(255,255,255,0.7)">How to Watch</a> · <a href="${{origin}}/privacy-policy" style="color:rgba(255,255,255,0.7)">Privacy</a> · <a href="${{origin}}/terms" style="color:rgba(255,255,255,0.7)">Terms</a> · <a href="${{origin}}/sitemap.xml" style="color:rgba(255,255,255,0.7)">Sitemap</a></p>
  </footer>
</body>
</html>`;

  return new Response(html, {{
    status: 200,
    headers: {{
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Seo-Version': '3.0'
    }}
  });
}}
'''

# Find the start and end of the existing generateStaticHomepage function
func_start_marker = 'export async function generateStaticHomepage'
func_end_marker = 'export async function generateChannelPage'

func_start_idx = seo_content.index(func_start_marker)
func_end_idx = seo_content.index(func_end_marker)

print(f"Function found: chars {func_start_idx} to {func_end_idx}")
print(f"Old function length: {func_end_idx - func_start_idx}")

# Replace the function
new_seo_content = seo_content[:func_start_idx] + new_function + '\n\n' + seo_content[func_end_idx:]

# Write the new file
with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'w', encoding='utf-8') as f:
    f.write(new_seo_content)

print(f"New file written. Total length: {len(new_seo_content)}")
print("Done!")
