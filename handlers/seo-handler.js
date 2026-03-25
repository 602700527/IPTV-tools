// SEO 优化处理器 - 为 Googlebot 生成带数据的静态 HTML

import { getAllChannels, getAllGroups, getChannelByHash } from '../utils/channel-cache.js';



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

export async function generateSEOHomepage(request, env) {

  const url = new URL(request.url);

  const origin = `${url.protocol}//${url.host}`;

  const channelsResult = await getAllChannels(env);

  const groupsResult = await getAllGroups(env);

  const channels = channelsResult.channels || [];

  const groups = groupsResult.groups || [];



  const pageTitle = `IPTV Search — Free Live TV Channels (${channels.length}+ channels)`;

  const metaDescription = `Search over ${channels.length} free IPTV channels from around the world. Browse live TV by country: USA, Brazil, China, India and more. No registration required. Updated daily.`;

  const jsonLd = generateHomepageJsonLd(channels, groups, origin);

  const categoryHtml = generateCategorySection(groups, channels, origin);



  return `<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${escapeHtml(pageTitle)}</title>

  <meta name="description" content="${escapeAttr(metaDescription)}">

  <meta name="robots" content="index, follow, max-image-preview:large">

  <link rel="canonical" href="${origin}/">

  <link rel="alternate" hreflang="en" href="${origin}/">

  <link rel="alternate" hreflang="x-default" href="${origin}/">

  <meta property="og:title" content="${escapeAttr(pageTitle)}">

  <meta property="og:description" content="${escapeAttr(metaDescription)}">

  <meta property="og:type" content="website">
  <meta property="og:description" content="Search over ${channels.length} free IPTV channels. Browse live TV by country. Updated daily.">
  <meta property="og:url" content="${origin}/">

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

      {

        "@type": "Question",

        "name": "What is IPTV Search?",

        "acceptedAnswer": {

          "@type": "Answer",

          "text": "IPTV Search is a free IPTV channel directory and search tool. We index and organize public IPTV channel playlists so you can easily find sports, news, movies, entertainment, and international TV channels. We do not stream or host any content."

        }

      },

      {

        "@type": "Question",

        "name": "How do I use IPTV channels?",

        "acceptedAnswer": {

          "@type": "Answer",

          "text": "Find the channel you want, copy its M3U playlist URL, and add it to any IPTV player app such as VLC, IPTV Smarters, or your smart TV. No subscription or registration required."

        }

      },

      {

        "@type": "Question",

        "name": "How many channels are available?",

        "acceptedAnswer": {

          "@type": "Answer",

          "text": "We index ${channels.length.toLocaleString()}+ live TV channels across ${groups.length} categories including sports, news, movies, entertainment, kids, music, and international content."

        }

      },

      {

        "@type": "Question",

        "name": "Do I need to register or pay?",

        "acceptedAnswer": {

          "@type": "Answer",

          "text": "No registration and no payment required. Browse channels, find what you want, and use the M3U URL with any compatible player — completely free."

        }

      },

      {

        "@type": "Question",

        "name": "What devices work with IPTV playlists?",

        "acceptedAnswer": {

          "@type": "Answer",

          "text": "M3U playlists work on mobile phones (iOS/Android), smart TVs, streaming devices (Fire TV, Roku), and desktop computers using VLC, IPTV apps, Kodi, or any IPTV-compatible player."

        }

      }

    ]

  }

  </script>

  <script type="application/ld+json">

  {

    "@context": "https://schema.org",

    "@type": "Organization",

    "name": "IPTV Search",

    "url": "${origin}",

    "description": "Free IPTV channel directory and search tool. Browse ${channels.length.toLocaleString()}+ live TV channels across ${groups.length} categories.",

    "logo": { "@type": "ImageObject", "url": "${origin}/logo.svg", "width": 200, "height": 60 }

  }

  </script>

  <script type="application/ld+json">

  {

    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "${origin}/" }]

  }

  </script>

  ${SHARED_CSS}

  <style>

    .hero{background:linear-gradient(135deg,#1a1a2e,#0f0f1a);padding:3rem 2rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05)}

    .hero h1{font-size:2.5rem;margin-bottom:1rem}

    .hero p{font-size:1.2rem;color:rgba(255,255,255,0.7);margin-bottom:2rem}

    .stats{display:flex;justify-content:center;gap:3rem;margin-top:2rem;flex-wrap:wrap}

    .stat{text-align:center}

    .stat-number{font-size:2rem;font-weight:700;color:#e50914}

    .stat-label{color:rgba(255,255,255,0.6);font-size:0.9rem}

    .search-box{background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:2rem;margin-bottom:3rem}

    .search-box h2{margin-bottom:1rem;font-size:1.3rem}

    .search-form{display:flex;gap:0.5rem;max-width:600px;margin:0 auto}

    .search-form input{flex:1;padding:0.8rem 1rem;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:#0a0a0a;color:#fff;font-size:1rem}

    .search-form button{padding:0.8rem 1.5rem;background:#e50914;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:1rem;font-weight:600}

    .category-section{margin-bottom:3rem;padding:1.5rem;background:#141414;border-radius:8px;border:1px solid rgba(255,255,255,0.08)}

    .category-section h2{font-size:1.4rem;margin-bottom:1rem;color:#fff;border-bottom:2px solid #e50914;padding-bottom:0.5rem}

    .category-section h2 .count{font-size:0.9rem;color:rgba(255,255,255,0.5);font-weight:normal}

    .category-section>p{margin-top:1rem;font-size:0.9rem}

    .channel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.75rem}

    .channel-card{background:#1a1a1a;border-radius:6px;padding:0.75rem;border:1px solid rgba(255,255,255,0.05);transition:border-color 0.2s}

    .channel-card:hover{border-color:rgba(229,9,20,0.5)}

    .channel-link{display:flex;align-items:center;gap:0.75rem;color:#fff}

    .channel-link:hover{text-decoration:none}

    .channel-link img{width:36px;height:36px;object-fit:contain;border-radius:4px;flex-shrink:0}

    .channel-logo-placeholder{width:36px;height:36px;background:#2a2a2a;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}

    .channel-name{font-size:0.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

    .toc{background:#1a1a1a;border-radius:8px;padding:1.5rem;margin-bottom:2rem;border:1px solid rgba(255,255,255,0.1)}

    .toc h2{font-size:1.2rem;margin-bottom:1rem}

    .toc-list{display:flex;flex-wrap:wrap;gap:0.5rem 1rem;list-style:none}

    .toc-list a{color:#e50914;font-size:0.9rem}

    @media(max-width:768px){.hero h1{font-size:1.8rem}.stats{gap:1.5rem}.channel-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}}

  </style>

</head>

<body>

  ${NAV_HTML(origin)}

  <div class="hero">

    <h1>Free IPTV Channel Search Engine</h1>

    <p>Search over ${channels.length.toLocaleString()} live TV channels from ${groups.length} categories worldwide</p>

    <div class="stats">

      <div class="stat"><div class="stat-number">${channels.length.toLocaleString()}+</div><div class="stat-label">Live TV Channels</div></div>

      <div class="stat"><div class="stat-number">${groups.length}</div><div class="stat-label">Categories</div></div>

      <div class="stat"><div class="stat-number">Daily</div><div class="stat-label">Updated</div></div>

    </div>

  </div>

  <main>

    <div class="search-box">

      <h2>Search Channels</h2>

      <form class="search-form" action="${origin}/" method="get">

        <input type="text" name="search" placeholder="Search channels (e.g. BBC, ESPN, CNN...)" aria-label="Search channels">

        <button type="submit">Search</button>

      </form>

    </div>

    ${groups.length > 0 ? `<div class="toc"><h2>Browse by Category</h2><ul class="toc-list">${groups.map(g => `<li><a href="#${slugify(g)}">${escapeHtml(g)}</a></li>`).join('')}</ul></div>` : ''}

    ${categoryHtml || '<p>No channels available.</p>'}

  </main>

  ${FOOTER_HTML(origin)}

</body>

</html>`;



  return new Response(html, {

    status: 200,

    headers: {

      'Content-Type': 'text/html; charset=utf-8',

      'Cache-Control': 'public, max-age=3600',

      'X-Seo-Version': '2.0'

    }

  });

}

export async function generateChannelPage(request, env, channelHash) {

  const url = new URL(request.url);

  const origin = `${url.protocol}//${url.host}`;

  const channel = await getChannelByHash(env, channelHash);

  if (!channel) return null;



  const safeGroup = slugify(channel.group_title || '');

  const pageTitle = `${channel.channel_name} — Free Live IPTV Stream`;

  const metaDescription = `Watch ${channel.channel_name} live online free. ${channel.group_title ? `${channel.group_title} channel. ` : ''}No subscription required.`;

  const jsonLd = {

    '@context': 'https://schema.org',

    '@type': 'WebPage',

    'name': channel.channel_name,

    'description': metaDescription,

    'url': `${origin}/channel/${channelHash}`,

    'isPartOf': { '@type': 'WebSite', 'name': 'IPTV Search', 'url': origin }

  };



  const allChannelsResult = await getAllChannels(env);

  const relatedChannels = (allChannelsResult.channels || [])

    .filter(ch => ch.group_title === channel.group_title && ch.channel_hash !== channelHash)

    .slice(0, 12);



  const breadcrumbJsonLd = {

    '@context': 'https://schema.org',

    '@type': 'BreadcrumbList',

    'itemListElement': [

      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${origin}/` },

      ...(channel.group_title ? [{ '@type': 'ListItem', 'position': 2, 'name': channel.group_title, 'item': `${origin}/category/${safeGroup}` }] : []),

      { '@type': 'ListItem', 'position': channel.group_title ? 3 : 2, 'name': channel.channel_name, 'item': `${origin}/channel/${channelHash}` }

    ]

  };



  return `<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${escapeHtml(pageTitle)}</title>

  <meta name="description" content="${escapeAttr(metaDescription)}">

  <meta name="robots" content="index, follow, max-image-preview:large">

  <link rel="canonical" href="${origin}/channel/${channelHash}">

  <link rel="alternate" hreflang="en" href="${origin}/channel/${channelHash}">

  <link rel="alternate" hreflang="x-default" href="${origin}/channel/${channelHash}">

  <meta property="og:title" content="${escapeAttr(pageTitle)}">

  <meta property="og:description" content="${escapeAttr(metaDescription)}">

  <meta property="og:type" content="website">

  <meta property="og:url" content="${origin}/channel/${channelHash}">

  ${channel.logo ? `<meta property="og:image" content="${escapeAttr(channel.logo)}">` : `<meta property="og:image" content="${origin}/og-homepage.png">`}

  <meta property="og:image:width" content="1200">

  <meta property="og:image:height" content="630">

  <meta property="og:site_name" content="IPTV Search">

  <meta name="twitter:card" content="summary_large_image">

  <meta name="twitter:title" content="${escapeAttr(pageTitle)}">

  <meta name="twitter:description" content="${escapeAttr(metaDescription)}">

  ${channel.logo ? `<meta name="twitter:image" content="${escapeAttr(channel.logo)}">` : `<meta name="twitter:image" content="${origin}/og-homepage.png">`}

  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

  <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>

  ${SHARED_CSS}

  <style>

    .breadcrumb{padding:1rem 0;font-size:0.9rem;color:rgba(255,255,255,0.5)}

    .breadcrumb a{color:#e50914}

    .channel-header{display:flex;align-items:center;gap:1.5rem;background:#141414;border-radius:12px;padding:2rem;margin-bottom:2rem;border:1px solid rgba(255,255,255,0.08)}

    .channel-logo{width:80px;height:80px;object-fit:contain;border-radius:8px;flex-shrink:0}

    .channel-logo-placeholder{width:80px;height:80px;background:#2a2a2a;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;flex-shrink:0}

    .channel-info h1{font-size:1.8rem;margin-bottom:0.5rem}

    .channel-meta{display:flex;gap:1rem;flex-wrap:wrap;margin-top:0.5rem}

    .badge{background:rgba(229,9,20,0.15);color:#e50914;padding:0.25rem 0.75rem;border-radius:20px;font-size:0.85rem}

    .play-btn{display:inline-block;background:#e50914;color:#fff;padding:0.75rem 2rem;border-radius:8px;font-weight:600;margin-top:1rem}

    .play-btn:hover{background:#f6121d;text-decoration:none}

    .section{background:#141414;border-radius:12px;padding:1.5rem;margin-bottom:2rem;border:1px solid rgba(255,255,255,0.08)}

    .section h2{font-size:1.2rem;margin-bottom:1rem;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:0.5rem}

    .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.75rem}

    .related-card{background:#1a1a1a;border-radius:6px;padding:0.75rem;border:1px solid rgba(255,255,255,0.05);transition:border-color 0.2s}

    .related-card:hover{border-color:rgba(229,9,20,0.5)}

    .related-card a{display:flex;align-items:center;gap:0.75rem;color:#fff}

    .related-card img{width:32px;height:32px;object-fit:contain;border-radius:4px;flex-shrink:0}

    .related-name{font-size:0.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

    @media(max-width:600px){.channel-header{flex-direction:column;text-align:center}.channel-meta{justify-content:center}}

  </style>

</head>

<body>

  ${NAV_HTML(origin)}

  <main>

    <div class="breadcrumb">

      <a href="${origin}/">Home</a> &rsaquo;

      ${channel.group_title ? `<a href="${origin}/category/${safeGroup}">${escapeHtml(channel.group_title)}</a> &rsaquo;` : ''}

      ${escapeHtml(channel.channel_name)}

    </div>

    <div class="channel-header">

      ${channel.logo ? `<img src="${escapeAttr(channel.logo)}" alt="${escapeAttr(channel.channel_name)} logo" class="channel-logo">` : '<div class="channel-logo-placeholder">📺</div>'}

      <div class="channel-info">

        <h1>${escapeHtml(channel.channel_name)}</h1>

        <div class="channel-meta">

          ${channel.group_title ? `<span class="badge">${escapeHtml(channel.group_title)}</span>` : ''}

          <span class="badge">Free IPTV</span>

          <span class="badge">No Registration</span>

        </div>

        <a href="${origin}/" class="play-btn">Search More Channels →</a>

      </div>

    </div>

    ${relatedChannels.length > 0 ? `

    <div class="section">

      <h2>More ${escapeHtml(channel.group_title || '')} Channels</h2>

      <div class="related-grid">

        ${relatedChannels.map(ch => `

          <div class="related-card">

            <a href="${origin}/channel/${escapeAttr(ch.channel_hash)}">

              ${ch.logo ? `<img src="${escapeAttr(ch.logo)}" alt="${escapeAttr(ch.channel_name)}">` : '📺'}

              <span class="related-name">${escapeHtml(ch.channel_name)}</span>

            </a>

          </div>`).join('')}

      </div>

    </div>` : ''}

  </main>

  ${FOOTER_HTML(origin)}

</body>

</html>`;



  return new Response(html, {

    status: 200,

    headers: {

      'Content-Type': 'text/html; charset=utf-8',

      'Cache-Control': 'public, max-age=3600',

      'X-Seo-Version': '2.0'

    }

  });

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



  const pageTitle = `${matchedGroup} IPTV Channels - Free Live TV [${new Date().getFullYear()}]`;

  const metaDescription = `Watch ${groupChannels.length} free ${matchedGroup} IPTV channels live online. TV from ${matchedGroup} including news, sports and movies. No registration required. Updated daily.`;

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

  <meta property="og:image" content="${origin}/og-homepage.png">

  <meta property="og:image:width" content="1200">

  <meta property="og:image:height" content="630">

  <meta property="og:image:alt" content="${escapeAttr(matchedGroup)} IPTV Channels on IPTV Search">

  <meta name="twitter:card" content="summary_large_image">

  <meta name="twitter:title" content="${escapeAttr(pageTitle)}">

  <meta name="twitter:description" content="${escapeAttr(metaDescription)}">

  <meta name="twitter:image" content="${origin}/og-homepage.png">

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



  // 频道页（最多1000个）

  const activeChannels = channels.filter(ch => ch.is_active !== 0).slice(0, 1000);

  for (const ch of activeChannels) {

    xml += `  <url><loc>${origin}/channel/${escapeAttr(ch.channel_hash)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`;

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



    const channelMatch = path.match(/^\/channel\/([a-zA-Z0-9_-]+)$/);

    if (channelMatch) {

      const html = await generateChannelPage(request, env, channelMatch[1]);

      if (!html) return await generate404Page(request, env, 'channel');

      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=86400', 'X-Seo-Version': '2.0' } });

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

  <meta property="og:image" content="${origin}/og-homepage.png">

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