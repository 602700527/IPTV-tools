// SEO 优化处理器 - 为 Googlebot 生成带数据的静态 HTML
import { getAllChannels, getAllGroups } from '../utils/channel-cache.js';

/**
 * 检测请求是否来自搜索引擎爬虫
 * @param {Request} request
 * @returns {boolean}
 */
export function isSearchEngineBot(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const googlebot = userAgent.includes('Googlebot');
  const bingbot = userAgent.includes('Bingbot') || userAgent.includes('bingbot');
  const slurp = userAgent.includes('Slurp');
  const duckduckbot = userAgent.includes('DuckDuckBot');
  const baidubot = userAgent.includes('Baiduspider');
  const yandexbot = userAgent.includes('YandexBot');
  
  return googlebot || bingbot || slurp || duckduckbot || baidubot || yandexbot;
}

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 转义 HTML 属性值
 */
function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/**
 * 生成频道分类的 HTML 列表
 */
function generateCategorySection(groups, channels, origin) {
  let html = '';
  
  for (const group of groups) {
    const groupChannels = channels.filter(ch => ch.group_title === group).slice(0, 50);
    if (groupChannels.length === 0) continue;

    const safeGroup = group.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').toLowerCase();
    
    html += `
    <section class="category-section">
      <h2 id="${safeGroup}">${escapeHtml(group)} <span class="count">(${groupChannels.length} channels)</span></h2>
      <div class="channel-grid">
        ${groupChannels.map(ch => `
          <div class="channel-card">
            <a href="${origin}/channel/${ch.channel_hash}" class="channel-link">
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

/**
 * 生成 JSON-LD Schema 数据
 */
function generateJsonLd(channels, groups, origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'IPTV Search - Free IPTV Channel Search Engine',
    'description': `Search over ${channels.length} free IPTV channels from around the world. Browse by category: Sports, News, Entertainment, Movies, Music and more. Updated daily. No registration required.`,
    'url': origin,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${origin}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    'about': {
      '@type': 'Thing',
      'description': `${channels.length} live TV channels from ${groups.length} categories`
    }
  };
}

/**
 * 生成搜索引擎爬虫友好的静态 HTML 首页
 */
export async function generateSEOHomepage(request, env) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;

  // 获取所有频道和分组
  const channelsResult = await getAllChannels(env);
  const groupsResult = await getAllGroups(env);
  
  const channels = channelsResult.channels || [];
  const groups = groupsResult.groups || [];

  const totalChannels = channels.length;
  const totalGroups = groups.length;

  // SEO 元数据
  const pageTitle = `IPTV Search — Free Live TV Channels Search Engine (${totalChannels}+ channels)`;
  const metaDescription = `Search over ${totalChannels} free IPTV channels from around the world. Browse by category: Sports, News, Entertainment, Movies, Music and more. Updated daily. No registration required.`;

  // 生成分类 HTML
  const categoryHtml = generateCategorySection(groups, channels, origin);

  // JSON-LD
  const jsonLd = generateJsonLd(channels, groups, origin);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeAttr(metaDescription)}">
  <meta name="keywords" content="IPTV, live TV, free IPTV, stream, M3U, playlist, sports, news, entertainment, movies">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <link rel="canonical" href="${origin}/">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${escapeAttr(pageTitle)}">
  <meta property="og:description" content="${escapeAttr(metaDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/">
  <meta property="og:site_name" content="IPTV Search">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeAttr(pageTitle)}">
  <meta name="twitter:description" content="${escapeAttr(metaDescription)}">
  
  <!-- JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a0a; color: #fff; line-height: 1.6; }
    a { color: #e50914; text-decoration: none; }
    a:hover { text-decoration: underline; }
    
    header { background: #141414; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
    .header-content { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
    .logo { font-size: 1.5rem; font-weight: 700; color: #e50914; }
    .logo span { color: #fff; }
    nav ul { display: flex; gap: 1.5rem; list-style: none; }
    nav a { color: rgba(255,255,255,0.8); font-size: 0.95rem; }
    nav a:hover { color: #fff; }
    
    .hero { background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%); padding: 3rem 2rem; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.2rem; color: rgba(255,255,255,0.7); margin-bottom: 2rem; }
    .stats { display: flex; justify-content: center; gap: 3rem; margin-top: 2rem; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-number { font-size: 2rem; font-weight: 700; color: #e50914; }
    .stat-label { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
    
    main { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    
    .search-box { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 2rem; margin-bottom: 3rem; }
    .search-box h2 { margin-bottom: 1rem; font-size: 1.3rem; }
    .search-form { display: flex; gap: 0.5rem; max-width: 600px; margin: 0 auto; }
    .search-form input { flex: 1; padding: 0.8rem 1rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; background: #0a0a0a; color: #fff; font-size: 1rem; }
    .search-form button { padding: 0.8rem 1.5rem; background: #e50914; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 600; }
    .search-form button:hover { background: #f6121d; }
    
    .category-section { margin-bottom: 3rem; padding: 1.5rem; background: #141414; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
    .category-section h2 { font-size: 1.4rem; margin-bottom: 1rem; color: #fff; border-bottom: 2px solid #e50914; padding-bottom: 0.5rem; }
    .category-section h2 .count { font-size: 0.9rem; color: rgba(255,255,255,0.5); font-weight: normal; }
    .category-section > p { margin-top: 1rem; font-size: 0.9rem; }
    .category-section > p a { color: #e50914; }
    
    .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
    .channel-card { background: #1a1a1a; border-radius: 6px; padding: 0.75rem; border: 1px solid rgba(255,255,255,0.05); transition: border-color 0.2s; }
    .channel-card:hover { border-color: rgba(229, 9, 20, 0.5); }
    .channel-link { display: flex; align-items: center; gap: 0.75rem; color: #fff; }
    .channel-link:hover { text-decoration: none; }
    .channel-link img { width: 36px; height: 36px; object-fit: contain; border-radius: 4px; flex-shrink: 0; }
    .channel-logo-placeholder { width: 36px; height: 36px; background: #2a2a2a; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
    .channel-name { font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    
    footer { background: #0a0a0a; border-top: 1px solid rgba(255,255,255,0.1); padding: 2rem; margin-top: 3rem; text-align: center; color: rgba(255,255,255,0.5); font-size: 0.9rem; }
    footer a { color: rgba(255,255,255,0.7); }
    
    @media (max-width: 768px) {
      .hero h1 { font-size: 1.8rem; }
      .stats { gap: 1.5rem; }
      .channel-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
      header { padding: 1rem; }
      main { padding: 1rem; }
    }
    
    .toc { background: #1a1a1a; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.1); }
    .toc h2 { font-size: 1.2rem; margin-bottom: 1rem; }
    .toc-list { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; list-style: none; }
    .toc-list a { color: #e50914; font-size: 0.9rem; }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      <a href="${origin}/" class="logo">IPTV<span>Search</span></a>
      <nav>
        <ul>
          <li><a href="${origin}/">Home</a></li>
          <li><a href="${origin}/tutorial">Tutorial</a></li>
          <li><a href="${origin}/privacy-policy">Privacy</a></li>
          <li><a href="${origin}/terms">Terms</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <div class="hero">
    <h1>Free IPTV Channel Search Engine</h1>
    <p>Search over ${totalChannels} live TV channels from ${totalGroups} categories worldwide</p>
    <div class="stats">
      <div class="stat">
        <div class="stat-number">${totalChannels.toLocaleString()}+</div>
        <div class="stat-label">Live TV Channels</div>
      </div>
      <div class="stat">
        <div class="stat-number">${totalGroups}</div>
        <div class="stat-label">Categories</div>
      </div>
      <div class="stat">
        <div class="stat-number">Daily</div>
        <div class="stat-label">Updated</div>
      </div>
    </div>
  </div>

  <main>
    <div class="search-box">
      <h2>Search Channels</h2>
      <form class="search-form" action="${origin}/" method="get">
        <input type="text" name="search" placeholder="Search for channels (e.g. BBC, ESPN, CNN...)" aria-label="Search channels">
        <button type="submit">Search</button>
      </form>
    </div>

    ${groups.length > 0 ? `
    <div class="toc">
      <h2>Browse by Category</h2>
      <ul class="toc-list">
        ${groups.map(g => {
          const safeGroup = g.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').toLowerCase();
          return `<li><a href="#${safeGroup}">${escapeHtml(g)}</a></li>`;
        }).join('')}
      </ul>
    </div>
    ` : ''}

    ${categoryHtml || '<p>No channels available at this time.</p>'}
  </main>

  <footer>
    <p>© ${new Date().getFullYear()} IPTV Search — Free IPTV Link Search Engine</p>
    <p style="margin-top: 0.5rem;">
      <a href="${origin}/tutorial">How to Watch</a> · 
      <a href="${origin}/privacy-policy">Privacy Policy</a> · 
      <a href="${origin}/terms">Terms of Service</a> · 
      <a href="${origin}/sitemap.xml">Sitemap</a>
    </p>
  </footer>
</body>
</html>`;

  return html;
}

/**
 * 处理搜索引擎爬虫的 SEO 请求
 * @param {Request} request
 * @param {Object} env
 * @returns {Promise<Response>}
 */
export async function handleSEOPage(request, env) {
  try {
    const html = await generateSEOHomepage(request, env);
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Seo-Version': '1.0'
      }
    });
  } catch (error) {
    console.error('[SEO Handler] Error generating SEO page:', error);
    return new Response('Service temporarily unavailable', { status: 503 });
  }
}
