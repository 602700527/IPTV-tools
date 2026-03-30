// SEO 优化处理器 - 为 Googlebot 生成带数据的静态 HTML

import { getAllChannels, getAllGroups } from '../utils/channel-cache.js';
import { PAGE_HEADER } from '../components/page-header.js';
import { PAGE_FOOTER } from '../components/page-footer.js';
import { SEO_HOME_CSS } from '../static-assets.js';



export function isSearchEngineBot(request) {

  const userAgent = request.headers.get('user-agent') || '';

  const bots = ['Googlebot', 'Bingbot', 'bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot', 'facebookexternalhit', 'Twitterbot', 'Applebot', 'Redditbot', 'Slackbot'];

  return bots.some(bot => userAgent.includes(bot));

}



function escapeHtml(str) {

  if (!str) return '';

  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'"'"'/g, '&#039;');

}



function escapeAttr(str) {

  if (!str) return '';

  return String(str).replace(/"/g, '&quot;').replace(/'"'"'/g, '&#039;');

}



function slugify(str) {

  if (!str) return '';

  return str.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');

}

function generateCategorySection(groups, channels, origin) {

  let html = '';

  for (const group of groups) {

    const groupChannels = channels.filter(ch => ch.group_title === group).slice(0, 50);

    if (groupChannels.length === 0) continue;

    const safeGroup = slugify(group);

    html += `

    <section class="category-section">

      <h2 id="${safeGroup}">${escapeHtml(group)} <span class="count">(${groupChannels.length} channels)</span></h2>

      <div class="channel-grid">

        ${groupChannels.map(ch => `

          <div class="channel-card">

            <a href="${origin}/channel/${escapeAttr(ch.channel_hash)}" class="channel-link">

              ${ch.logo ? `<img src="${escapeAttr(ch.logo)}" alt="${escapeAttr(ch.channel_name)} logo" loading="lazy" width="48" height="48">` : '<div class="channel-logo-placeholder">📺</div>'}

              <span class="channel-name">${escapeHtml(ch.channel_name)}</span>

            </a>

          </div>

        `).join('')}

      </div>

      <p><a href="${origin}/category/${safeGroup}">View all ${escapeHtml(group)} channels →</a></p>

    </section>`;

  }

  return html;

}



function generateHomepageJsonLd(channels, groups, origin) {

  return {

    '@context': 'https://schema.org',

    '@type': 'WebSite',

    'name': 'IPTV Search - Free IPTV Channel Search Engine',

    'description': `Search over ${channels.length} free IPTV channels. Browse by category. Updated daily. No registration required.`,

    'url': origin,

    'potentialAction': {

      '@type': 'SearchAction',

      'target': { '@type': 'EntryPoint', 'urlTemplate': `${origin}/?search={search_term_string}` },

      'query-input': 'required name=search_term_string'

    }

  };

}



const SHARED_CSS = `<style>

  *{margin:0;padding:0;box-sizing:border-box}

  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6}

  a{color:#e50914;text-decoration:none}

  header{background:#141414;border-bottom:1px solid rgba(255,255,255,0.1);padding:1rem 2rem;position:sticky;top:0;z-index:100}

  .header-content{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}

  .logo{font-size:1.5rem;font-weight:700;color:#e50914}

  .logo span{color:#fff}

  nav ul{display:flex;gap:1.5rem;list-style:none}

  nav a{color:rgba(255,255,255,0.8);font-size:0.95rem}

  nav a:hover{color:#fff}

  main{max-width:1200px;margin:0 auto;padding:2rem}

  footer{background:#0a0a0a;border-top:1px solid rgba(255,255,255,0.1);padding:2rem;margin-top:3rem;text-align:center;color:rgba(255,255,255,0.5);font-size:0.9rem}

  footer a{color:rgba(255,255,255,0.7)}

  @media(max-width:768px){header{padding:1rem}main{padding:1rem}}

</style>`;



const NAV_HTML = (origin) => `<header><div class="header-content"><a href="${origin}/" class="logo">IPTV<span>Search</span></a><nav><ul><li><a href="${origin}/">Home</a></li><li><a href="${origin}/tutorial">Tutorial</a></li><li><a href="${origin}/privacy-policy">Privacy</a></li><li><a href="${origin}/terms">Terms</a></li></ul></nav></div></header>`;



const FOOTER_HTML = (origin) => `<footer><p>© ${new Date().getFullYear()} IPTV Search</p><p style="margin-top:0.5rem"><a href="${origin}/tutorial">How to Watch</a> · <a href="${origin}/privacy-policy">Privacy Policy</a> · <a href="${origin}/terms">Terms</a> · <a href="${origin}/sitemap.xml">Sitemap</a></p></footer>`;

// =====================================================================
// 方案D: 静态首页 - 完整复刻 home-page.js 布局
// CSS: 外链 /seo-home.css via <link>（32KB 原版样式）
// Play 按钮: admin enable_ip_play 禁用时跳频道页
// =====================================================================
import { getSystemConfig } from '../database.js';

export async function generateSEOHomepage(request, env) {
  const url = new URL(request.url);
  const origin = url.protocol + '//' + url.host;

  const channelsResult = await getAllChannels(env);
  const groupsResult = await getAllGroups(env);
  const channels = channelsResult.channels || [];
  const groups = groupsResult.groups || [];

  const systemConfig = await getSystemConfig(env);
  const enableIpPlay = systemConfig.enable_ip_play !== false;

  const perPage = 100;
  const totalChannels = channels.length;
  const totalPages = Math.max(1, Math.ceil(totalChannels / perPage));

  const pageTitle = 'IPTV Search \u2014 Free IPTV Channel Directory & Search Engine';
  const metaDescription = 'Search over ' + totalChannels + ' free IPTV channels from 100+ countries. Browse live TV by region: USA, Brazil, China, India and more. No registration required. Updated daily.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'IPTV Search',
    'description': 'Free IPTV channel directory with ' + totalChannels + '+ live TV channels.',
    'url': origin,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': { '@type': 'EntryPoint', 'urlTemplate': origin + '/search?q={search_term_string}' },
      'query-input': 'required name=q'
    }
  };

  // ===== Header HTML（静态化，无 JS 事件） =====
  const STATIC_HEADER = '<header class="header">' +
    '<div class="header-left">' +
      '<a href="' + origin + '/" class="logo-link"><div class="logo"><img src="' + origin + '/logo.svg" alt="IPTV Search Logo" /></div></a>' +
      '<div class="online-counter"><span class="online-dot"></span><span class="online-count">' + totalChannels.toLocaleString() + '</span><span>channels</span></div>' +
    '</div>' +
    '<div class="header-right">' +
      '<div class="search-box"><form action="' + origin + '/search" method="get"><input type="text" name="q" class="search-input" placeholder="Search channels..." aria-label="Search channels"></form></div>' +
      '<div class="quick-entries">' +
        '<a class="quick-entry" href="' + origin + '/tutorial" title="How to Watch"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span class="quick-entry-tip">How to Watch</span></a>' +
        '<a class="quick-entry" href="' + origin + '/freesub" title="Plans"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg><span class="quick-entry-tip">Plans</span></a>' +
        '<a class="quick-entry" href="' + origin + '/privacy-policy" title="Privacy"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><span class="quick-entry-tip">Privacy</span></a>' +
      '</div>' +
      '<a class="auth-btn" href="' + origin + '/login">Login</a>' +
      '<div id="translate"><select onchange="if(this.value)location.href=this.value"><option value="' + origin + '/?lang=en">English</option><option value="' + origin + '/?lang=zh-CN">\u4e2d\u6587</option></select></div>' +
    '</div>' +
  '</header>';

  // ===== Sidebar 分组导航 =====
  // 注意：链接使用 ?group= 参数，这样会在首页（home-page.js）显示分类内容，实现 SPA 体验
  const sidebarItems = groups.slice(0, 100).map(function(g) {
    const count = channels.filter(function(ch) { return ch.group_title === g; }).length;
    return '<div class="group-item"><a href="' + origin + '/?group=' + encodeURIComponent(g) + '" style="color:rgba(255,255,255,0.7);text-decoration:none;display:block">' + escapeHtml(g) + ' <span style="opacity:0.5;font-size:0.8em">(' + count + ')</span></a></div>';
  }).join('');

  const STATIC_SIDEBAR = '<aside class="sidebar" id="sidebar"><div class="group-item active"><a href="' + origin + '/" style="color:#fff;text-decoration:none;display:block">All Channels</a></div>' + sidebarItems + '</aside>';

  // ===== Hero Section（首页标语+搜索框） =====
  const HERO_HTML = `
<div class="hero-section" id="heroSection">
  <div class="hero-tagline">
    <h2>Find &amp; Watch Free Live TV — No Sign-up Required</h2>
    <p>Access ` + totalChannels + `+ free live TV channels instantly. No account, no fees, just search and watch.</p>
  </div>
  <div class="hero-search">
    <form action="` + origin + `/search" method="get" class="hero-search-form" id="heroSearchForm">
      <input type="text" name="q" class="hero-search-input" placeholder="Search &apos;CCTV&apos;, &apos;ESPN&apos;, &apos;HBO&apos;..." aria-label="Search IPTV channels" id="heroSearchInput">
      <button type="submit" class="hero-search-btn">Search</button>
    </form>
  </div>
  <div class="hero-stats">
    <span>` + totalChannels + `+ Channels</span>
    <span>|</span>
    <span>` + groups.length + ` Categories</span>
    <span>|</span>
    <span>100+ Countries</span>
  </div>
  <div class="hero-trust">
    <span>✅ No registration</span>
    <span>✅ Updated daily</span>
    <span>✅ Works on any device</span>
  </div>
</div>
`;

  // ===== 频道网格卡片（原版海报样式） =====
  const channelCardsHtml = channels.slice(0, perPage).map(function(ch) {
    var logo;
    if (ch.logo) {
      logo = '<img src="' + escapeAttr(ch.logo) + '" alt="' + escapeHtml(ch.channel_name) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="channel-icon" style="display:none;">\ud83d\udcfa</div>';
    } else {
      logo = '<div class="channel-icon">\ud83d\udcfa</div>';
    }
    return '<div class="channel-card">' +
      '<div class="channel-poster">' +
        '<a href="' + origin + '/channel/' + escapeAttr(ch.channel_hash) + '" style="display:block;width:100%;height:100%;text-decoration:none">' + logo + '</a>' +
      '</div>' +
      '<div class="channel-info">' +
        '<div class="channel-name"><a href="' + origin + '/channel/' + escapeAttr(ch.channel_hash) + '" style="color:#fff;text-decoration:none" title="' + escapeHtml(ch.channel_name) + '">' + escapeHtml(ch.channel_name) + '</a></div>' +
        '<div class="channel-group">' + escapeHtml(ch.group_title || '') + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // ===== 分页导航 =====
  var paginationHtml = '';
  if (totalPages > 1) {
    paginationHtml = '<div class="pagination" style="display:flex;gap:8px;flex-wrap:wrap;margin:20px 0;justify-content:center">' +
      '<a href="' + origin + '/page/2" style="padding:8px 16px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;text-decoration:none;font-size:14px">Next \u2192</a>' +
    '</div>';
  }

  var sectionLabel = 'Browse All Channels <span style="color:rgba(255,255,255,0.5);font-weight:400;font-size:14px;margin-left:12px">' + totalChannels.toLocaleString() + ' channels</span>';

  var faqJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {'@type': 'Question', 'name': 'What is IPTV Search?', 'acceptedAnswer': {'@type': 'Answer', 'text': 'IPTV Search indexes public IPTV channel playlists. Search free IPTV channels by country \u2014 no subscription required.'}},
      {'@type': 'Question', 'name': 'How do I use IPTV channels?', 'acceptedAnswer': {'@type': 'Answer', 'text': 'Find the channel you want, copy its M3U URL, and add it to any IPTV player app such as VLC, IPTV Smarters, or your smart TV.'}},
      {'@type': 'Question', 'name': 'How many channels are available?', 'acceptedAnswer': {'@type': 'Answer', 'text': 'We index ' + totalChannels.toLocaleString() + '+ live TV channels across ' + groups.length + ' categories.'}},
      {'@type': 'Question', 'name': 'Is registration required?', 'acceptedAnswer': {'@type': 'Answer', 'text': 'No. Browse channels, get the M3U URL, and use it with any compatible player \u2014 completely free.'}}
    ]
  });

  // Build HTML using string concatenation
  var html = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '  <title>' + escapeHtml(pageTitle) + '</title>\n' +
    '  <meta name="description" content="' + escapeAttr(metaDescription) + '">\n' +
    '  <meta name="robots" content="index, follow, max-image-preview:large">\n' +
    '  <link rel="canonical" href="' + origin + '/">\n' +
    '  <link rel="alternate" hreflang="en" href="' + origin + '/">\n' +
    '  <link rel="alternate" hreflang="zh-CN" href="' + origin + '/?lang=zh-CN">\n' +
    '  <link rel="alternate" hreflang="x-default" href="' + origin + '/">\n' +
    '  <link rel="icon" type="image/svg+xml" href="' + origin + '/favicon.svg">\n' +
    '  <link rel="apple-touch-icon" href="' + origin + '/apple-touch-icon.png" sizes="180x180">\n' +
    '  <link rel="stylesheet" href="' + origin + '/seo-home.css">\n' +
    '  <meta property="og:type" content="website">\n' +
    '  <meta property="og:url" content="' + origin + '/">\n' +
    '  <meta property="og:locale" content="en_US">\n' +
    '  <meta property="og:title" content="' + escapeAttr(pageTitle) + '">\n' +
    '  <meta property="og:description" content="' + escapeAttr(metaDescription) + '">\n' +
    '  <meta property="og:image" content="' + origin + '/og-image.svg">\n' +
    '  <meta property="og:image:width" content="1200">\n' +
    '  <meta property="og:image:height" content="630">\n' +
    '  <meta property="og:site_name" content="IPTV Search">\n' +
    '  <meta name="twitter:card" content="summary_large_image">\n' +
    '  <meta name="twitter:title" content="' + escapeAttr(pageTitle) + '">\n' +
    '  <meta name="twitter:description" content="' + escapeAttr(metaDescription) + '">\n' +
    '  <meta name="twitter:image" content="' + origin + '/og-image.svg">\n' +
    '  <script type="application/ld+json">' + JSON.stringify(jsonLd) + '</script>\n' +
    '  <script type="application/ld+json">' + faqJsonLd + '</script>\n' +
    '</head>\n' +
    '<body>\n' +
    '  ' + STATIC_HEADER + '\n' +
    '  <style>.hero-section{padding:80px 20px 40px;text-align:center;background:linear-gradient(180deg,#1a1a1a 0%,#0a0a0a 100%)}.hero-section.hidden{display:none}.hero-tagline{max-width:700px;margin:0 auto 24px}.hero-tagline h2{font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:14px}.hero-tagline p{font-size:1.15rem;color:rgba(255,255,255,0.75);max-width:650px;margin:0 auto 30px}.hero-search-form{max-width:650px;margin:0 auto 20px;gap:0;box-shadow:0 8px 32px rgba(229,9,20,0.25)}.hero-search-input{flex:1;padding:16px 20px;border:2px solid #e50914;border-right:none;border-radius:8px 0 0 8px;background:#1a1a1a;color:#fff;font-size:16px}.hero-search-btn{padding:16px 28px;background:#e50914;border:2px solid #e50914;border-radius:0 8px 8px 0;color:#fff;font-size:16px;font-weight:600;cursor:pointer}.hero-stats{color:rgba(255,255,255,0.5);font-size:0.9rem;display:flex;gap:12px;justify-content:center;margin-top:8px}.hero-trust{color:rgba(255,255,255,0.55);font-size:0.85rem;display:flex;gap:20px;justify-content:center;margin-top:16px;flex-wrap:wrap}</style>\n' +
    '  ' + HERO_HTML + '\n' +
    '  <div class="main">\n' +
    '    ' + STATIC_SIDEBAR + '\n' +
    '    <div class="content">\n' +
    '      <h1 class="section-title" style="font-size:18px;font-weight:600;margin-bottom:20px;color:#fff">' + sectionLabel + '</h1>\n' +
    '      <div class="channels-grid">' + channelCardsHtml + '</div>\n' +
    '      ' + paginationHtml + '\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  ' + PAGE_FOOTER + '\n' +
    '</body>\n' +
    '</html>';

  return html;
}


export async function generateCategoryPage(request, env, groupSlug) {

  const url = new URL(request.url);

  const origin = `${url.protocol}//${url.host}`;



  const groupsResult = await getAllGroups(env);

  const groups = groupsResult.groups || [];

  const matchedGroup = groups.find(g => slugify(g) === groupSlug);

  if (!matchedGroup) return null;



  const channelsResult = await getAllChannels(env);

  const allChannels = channelsResult.channels || [];

  const groupChannels = allChannels.filter(ch => ch.group_title === matchedGroup);



  const pageTitle = `${matchedGroup} IPTV Channels - Free Directory`;

  const metaDescription = `Browse ${groupChannels.length} free ${matchedGroup} IPTV channels. Search by country. Copy M3U link to watch in your player. No registration required.`;

  const jsonLd = {

    '@context': 'https://schema.org',

    '@type': 'CollectionPage',

    'name': `${matchedGroup} IPTV Channels`,

    'description': metaDescription,

    'url': `${origin}/category/${groupSlug}`

  };



  const perPage = 100;

  const page = parseInt(url.searchParams.get('page') || '1');

  const totalPages = Math.ceil(groupChannels.length / perPage);

  const pageChannels = groupChannels.slice((page - 1) * perPage, page * perPage);



  const breadcrumbJsonLd = {

    '@context': 'https://schema.org',

    '@type': 'BreadcrumbList',

    'itemListElement': [

      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${origin}/` },

      { '@type': 'ListItem', 'position': 2, 'name': `${matchedGroup} IPTV Channels`, 'item': `${origin}/category/${groupSlug}` }

    ]

  };



  return `<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${escapeHtml(pageTitle)}</title>

  <meta name="description" content="${escapeAttr(metaDescription)}">

  <meta name="robots" content="index, follow, max-image-preview:image">

  <link rel="canonical" href="${origin}/category/${groupSlug}${page > 1 ? `?page=${page}` : ''}">

  <meta property="og:title" content="${escapeAttr(pageTitle)}">

  <meta property="og:description" content="${escapeAttr(metaDescription)}">

  <meta property="og:type" content="website">

  <meta property="og:url" content="${origin}/category/${groupSlug}">
  <meta property="og:locale" content="en_US">

  <meta property="og:image" content="${origin}/og-image.svg">

  <meta property="og:image:width" content="1200">

  <meta property="og:image:height" content="630">

  <meta property="og:image:alt" content="${escapeAttr(matchedGroup)} IPTV Channels on IPTV Search">

  <meta name="twitter:card" content="summary_large_image">

  <meta name="twitter:title" content="${escapeAttr(pageTitle)}">

  <meta name="twitter:description" content="${escapeAttr(metaDescription)}">

  <meta name="twitter:image" content="${origin}/og-image.svg">

  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

  <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>

  ${SHARED_CSS}

  <style>

    .breadcrumb{padding:1rem 0;font-size:0.9rem;color:rgba(255,255,255,0.5)}

    .breadcrumb a{color:#e50914}

    .page-header{background:#141414;border-radius:12px;padding:2rem;margin-bottom:2rem;border:1px solid rgba(255,255,255,0.08)}

    .page-header h1{font-size:1.8rem;margin-bottom:0.5rem}

    .page-header p{color:rgba(255,255,255,0.6)}

    .toc-list{display:flex;flex-wrap:wrap;gap:0.5rem 1rem;list-style:none;margin-bottom:2rem;background:#141414;border-radius:8px;padding:1rem}

    .toc-list a{color:#e50914;font-size:0.9rem}

    .channel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.75rem;margin-bottom:2rem}

    .channel-card{background:#141414;border-radius:6px;padding:0.75rem;border:1px solid rgba(255,255,255,0.05);transition:border-color 0.2s}

    .channel-card:hover{border-color:rgba(229,9,20,0.5)}

    .channel-card a{display:flex;align-items:center;gap:0.75rem;color:#fff}

    .channel-card img{width:36px;height:36px;object-fit:contain;border-radius:4px;flex-shrink:0}

    .channel-card .name{font-size:0.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

    .placeholder{width:36px;height:36px;background:#2a2a2a;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}

    .pagination{display:flex;justify-content:center;gap:0.5rem;flex-wrap:wrap;margin-top:2rem}

    .pagination a,.pagination span{padding:0.5rem 1rem;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:0.9rem}

    .pagination a:hover{background:#e50914;border-color:#e50914;text-decoration:none}

    .pagination .current{background:#e50914;border-color:#e50914}

  </style>

</head>

<body>

  ${NAV_HTML(origin)}

  <main>

    <div class="breadcrumb"><a href="${origin}/">Home</a> &rsaquo; ${escapeHtml(matchedGroup)}</div>

    <div class="page-header">

      <h1>${escapeHtml(matchedGroup)} Channels</h1>

      <p>${groupChannels.length} free live TV streams — updated daily</p>

    </div>

    <div class="toc-list">

      ${groups.map(g => `<a href="${origin}/category/${slugify(g)}">${escapeHtml(g)}</a>`).join('')}

    </div>

    <div class="channel-grid">

      ${pageChannels.map(ch => `

        <div class="channel-card">

          <a href="${origin}/channel/${escapeAttr(ch.channel_hash)}">

            ${ch.logo ? `<img src="${escapeAttr(ch.logo)}" alt="${escapeAttr(ch.channel_name)}">` : '<div class="placeholder">📺</div>'}

            <span class="name">${escapeHtml(ch.channel_name)}</span>

          </a>

        </div>`).join('')}

    </div>

    ${totalPages > 1 ? `<div class="pagination">

      ${page > 1 ? `<a href="${origin}/category/${groupSlug}?page=${page - 1}">&laquo; Previous</a>` : '<span>&laquo; Previous</span>'}

      ${Array.from({length: Math.min(5, totalPages)}, (_, i) => {

        const p = i + 1;

        return p === page ? `<span class="current">${p}</span>` : `<a href="${origin}/category/${groupSlug}?page=${p}">${p}</a>`;

      }).join('')}

      ${page < totalPages ? `<a href="${origin}/category/${groupSlug}?page=${page + 1}">Next &raquo;</a>` : '<span>Next &raquo;</span>'}

    </div>` : ''}

  </main>

  ${FOOTER_HTML(origin)}

</body>

</html>`;

}



export async function generateFullSitemap(request, env) {

  const url = new URL(request.url);

  const origin = `${url.protocol}//${url.host}`;

  const today = new Date().toISOString().split('T')[0];



  const channelsResult = await getAllChannels(env);

  const groupsResult = await getAllGroups(env);

  const channels = channelsResult.channels || [];

  const groups = groupsResult.groups || [];



  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;

  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;



  // 首页

  xml += `  <url><loc>${origin}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority>`;

  xml += `<xhtml:link rel="alternate" hreflang="en" href="${origin}/"/>`;

  xml += `<xhtml:link rel="alternate" hreflang="zh-CN" href="${origin}/?lang=zh-CN"/>`;

  xml += `<xhtml:link rel="alternate" hreflang="x-default" href="${origin}/"/></url>\n`;



  // 分类页

  for (const group of groups) {

    const safeGroup = slugify(group);

    const count = channels.filter(ch => ch.group_title === group).length;

    if (count === 0) continue;

    const p = count > 100 ? '0.9' : count > 50 ? '0.8' : '0.7';

    xml += `  <url><loc>${origin}/category/${safeGroup}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>${p}</priority></url>\n`;

    if (count > 100) {

      const pages = Math.ceil(count / 100);

      for (let pg = 2; pg <= pages; pg++) {

        xml += `  <url><loc>${origin}/category/${safeGroup}?page=${pg}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.6</priority></url>\n`;

      }

    }

  }



  // 静态页

  const staticPages = [

    ['/activate', 'weekly', '0.5'],

    ['/privacy-policy', 'monthly', '0.3'],

    ['/terms', 'monthly', '0.3'],

    ['/tutorial', 'monthly', '0.4'],

    ['/freesub', 'weekly', '0.7'],

    ['/plans', 'weekly', '0.7'],

  ];

  for (const [page, freq, pri] of staticPages) {

    xml += `  <url><loc>${origin}${page}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${pri}</priority></url>\n`;

  }



  xml += `</urlset>`;

  return xml;

}



export async function handleSEOPage(request, env) {

  const url = new URL(request.url);

  const path = url.pathname;



  try {

    if (path === '/sitemap.xml') {

      const xml = await generateFullSitemap(request, env);

      return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=43200', 'X-Seo-Version': '2.0' } });

    }



    if (path === '/' || path === '') {

      return new Response(await generateSEOHomepage(request, env), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'X-Seo-Version': '2.0' } });

    }



    const categoryMatch = path.match(/^\/category\/([a-zA-Z0-9-]+)$/);

    if (categoryMatch) {

      const html = await generateCategoryPage(request, env, categoryMatch[1]);

      if (!html) return await generate404Page(request, env, 'category');

      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=7200', 'X-Seo-Version': '2.0' } });

    }



    return null;

  } catch (error) {

    console.error('[SEO Handler] Error:', error);

    return new Response('Service temporarily unavailable', { status: 503 });

  }

}



/**

 * 生成有用的 404 页面

 * 设计原则：

 * 1. 解释为什么用户会到达这里（IPTV 频道失效是正常的）

 * 2. 提供即时可用的搜索功能

 * 3. 展示热门频道，引导用户继续浏览

 * 4. 包含分类导航，不让用户空手离开

 * 5. HTTP Status 必须是 404，meta robots noindex

 */

export async function generate404Page(request, env, notFoundType = 'page') {

  const url = new URL(request.url);

  const origin = `${url.protocol}//${url.host}`;



  // 并行获取频道和分组数据

  const [channelsResult, groupsResult] = await Promise.all([

    getAllChannels(env),

    getAllGroups(env)

  ]);



  const channels = channelsResult.channels || [];

  const groups = groupsResult.groups || [];



  // 选取展示用的频道（优先选有 logo 的，限制数量避免页面过大）

  const featuredChannels = channels

    .filter(ch => ch.is_active !== 0 && ch.logo)

    .slice(0, 16);



  // 最多显示 10 个分类

  const displayGroups = groups.slice(0, 10);



  const typeLabel = notFoundType === 'channel' ? 'Channel' : notFoundType === 'category' ? 'Category' : 'Page';

  const pageTitle = `404 - ${typeLabel} Not Found | IPTV Search`;

  const metaDescription = `The ${notFoundType} you are looking for no longer exists. IPTV channels go offline frequently as source streams change. Use our search to find similar channels.`;



  const html = `<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${escapeHtml(pageTitle)}</title>

  <meta name="description" content="${escapeAttr(metaDescription)}">

  <meta name="robots" content="noindex, follow">

  <link rel="canonical" href="${origin}/">

  <meta property="og:title" content="${escapeAttr(pageTitle)}">

  <meta property="og:description" content="${escapeAttr(metaDescription)}">

  <meta property="og:type" content="website">

  <meta property="og:url" content="${origin}/">
  <meta property="og:locale" content="en_US">

  <meta property="og:image" content="${origin}/og-image.svg">

  <meta name="twitter:card" content="summary_large_image">

  <meta name="twitter:title" content="${escapeAttr(pageTitle)}">

  <meta name="twitter:description" content="${escapeAttr(metaDescription)}">

  <script type="application/ld+json">

  {

    "@context": "https://schema.org",

    "@type": "WebPage",

    "name": "404 - Page Not Found",

    "description": "The requested page no longer exists.",

    "url": "${origin}/"

  }

  </script>

  ${SHARED_CSS}

  <style>

    .hero{background:linear-gradient(135deg,#1a1a2e,#0f0f1a);padding:4rem 2rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05)}

    .hero-404{font-size:7rem;font-weight:900;color:rgba(229,9,20,0.15);line-height:1;margin-bottom:0.5rem}

    .hero h1{font-size:2rem;margin-bottom:0.75rem;color:#fff}

    .hero p{color:rgba(255,255,255,0.6);max-width:500px;margin:0 auto 1.5rem;font-size:1.05rem}

    .hero-search{background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem;max-width:600px;margin:0 auto}

    .hero-search h2{font-size:1rem;color:rgba(255,255,255,0.7);margin-bottom:0.75rem;font-weight:400}

    .search-form{display:flex;gap:0.5rem}

    .search-form input{flex:1;padding:0.8rem 1rem;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:#0a0a0a;color:#fff;font-size:1rem}

    .search-form input:focus{outline:none;border-color:#e50914}

    .search-form button{padding:0.8rem 1.5rem;background:#e50914;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:1rem;font-weight:600;white-space:nowrap}

    .search-form button:hover{background:#f6121d}

    .why-box{background:#141414;border-radius:12px;padding:1.5rem;margin-top:2rem;border:1px solid rgba(255,255,255,0.08);max-width:600px;margin-left:auto;margin-right:auto}

    .why-box h3{font-size:1.1rem;margin-bottom:0.75rem;color:#fff}

    .why-box p{font-size:0.9rem;color:rgba(255,255,255,0.6);line-height:1.7}

    .section{padding:2rem 0}

    .section-title{font-size:1.3rem;margin-bottom:1.25rem;color:#fff;border-bottom:2px solid #e50914;padding-bottom:0.5rem;display:flex;align-items:center;justify-content:space-between}

    .section-title a{font-size:0.85rem;color:#e50914;font-weight:400}

    .channel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.75rem;margin-bottom:1.5rem}

    .channel-card{background:#141414;border-radius:6px;padding:0.75rem;border:1px solid rgba(255,255,255,0.05);transition:border-color 0.2s}

    .channel-card:hover{border-color:rgba(229,9,20,0.5)}

    .channel-card a{display:flex;align-items:center;gap:0.75rem;color:#fff}

    .channel-card a:hover{text-decoration:none}

    .channel-card img{width:36px;height:36px;object-fit:contain;border-radius:4px;flex-shrink:0}

    .channel-card .name{font-size:0.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

    .placeholder{width:36px;height:36px;background:#2a2a2a;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}

    .category-list{display:flex;flex-wrap:wrap;gap:0.5rem}

    .category-tag{background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:0.4rem 1rem;font-size:0.85rem;color:rgba(255,255,255,0.8);transition:all 0.2s}

    .category-tag:hover{background:#e50914;color:#fff;border-color:#e50914;text-decoration:none}

    .home-actions{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;margin-top:1.5rem}

    .btn-primary{display:inline-block;background:#e50914;color:#fff;padding:0.75rem 2rem;border-radius:8px;font-weight:600;text-align:center}

    .btn-primary:hover{background:#f6121d;text-decoration:none}

    .btn-secondary{display:inline-block;background:#1a1a1a;color:#fff;padding:0.75rem 2rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);text-align:center}

    .btn-secondary:hover{border-color:#e50914;color:#e50914;text-decoration:none}

    @media(max-width:600px){.hero-404{font-size:5rem}.hero h1{font-size:1.5rem}.search-form{flex-direction:column}.channel-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}}

  </style>

</head>

<body>

  ${NAV_HTML(origin)}

  <div class="hero">

    <div class="hero-404">404</div>

    <h1>Sorry, this ${typeLabel.toLowerCase()} is no longer available</h1>

    <p>IPTV channels frequently go offline as source streams change or providers update their feeds. Find something new to watch below.</p>

    <div class="hero-search">

      <h2>Search for channels</h2>

      <form class="search-form" action="${origin}/" method="get">

        <input type="text" name="search" placeholder="Search channels (e.g. BBC, ESPN, CNN...)" aria-label="Search channels">

        <button type="submit">Search</button>

      </form>

    </div>

    <div class="home-actions">

      <a href="${origin}/" class="btn-primary">← Back to Home</a>

      <a href="${origin}/tutorial" class="btn-secondary">How it works</a>

    </div>

  </div>

  <main>

    <div class="why-box">

      <h3>Why am I seeing this page?</h3>

      <p>We index thousands of public IPTV channels from various sources around the world. These channels are provided by third-party broadcasters and their streams can change or become unavailable at any time. When a channel goes offline, we automatically remove it from search results. This is normal — try searching above or browse the categories below to find what you're looking for.</p>

    </div>



    ${featuredChannels.length > 0 ? `

    <section class="section">

      <h2 class="section-title">Popular Channels <a href="${origin}/">View all →</a></h2>

      <div class="channel-grid">

        ${featuredChannels.map(ch => `

          <div class="channel-card">

            <a href="${origin}/channel/${escapeAttr(ch.channel_hash)}">

              ${ch.logo ? `<img src="${escapeAttr(ch.logo)}" alt="${escapeAttr(ch.channel_name)}" loading="lazy">` : '<div class="placeholder">📺</div>'}

              <span class="name">${escapeHtml(ch.channel_name)}</span>

            </a>

          </div>`).join('')}

      </div>

    </section>` : ''}



    ${displayGroups.length > 0 ? `

    <section class="section">

      <h2 class="section-title">Browse by Category</h2>

      <div class="category-list">

        ${displayGroups.map(g => `<a href="${origin}/category/${slugify(g)}" class="category-tag">${escapeHtml(g)}</a>`).join('')}

      </div>

    </section>` : ''}

  </main>

  ${FOOTER_HTML(origin)}

</body>

</html>`;



  return new Response(html, {

    status: 404,

    headers: {

      'Content-Type': 'text/html; charset=utf-8',

      'Cache-Control': 'public, max-age=3600',

      'X-Seo-Version': '2.0'

    }

  });

}
