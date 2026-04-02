// 404 页面处理器

import { getAllChannels, getAllGroups } from '../utils/channel-cache.js';

// HTML 转义
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// 属性转义
function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// 生成 404 页面
export async function generate404Page(request, env, notFoundType = 'page') {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;

  // 获取频道和分组数据
  const [channelsResult, groupsResult] = await Promise.all([
    getAllChannels(env),
    getAllGroups(env)
  ]);

  const channels = channelsResult.channels || [];
  const groups = groupsResult.groups || [];

  // 优先选择有 logo 的频道
  const featuredChannels = channels
    .filter(ch => ch.is_active !== 0 && ch.logo)
    .slice(0, 16);

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

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a0a; color: #fff; line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }

    .hero {
      background: linear-gradient(135deg, #1a1a2e, #0f0f1a);
      padding: 4rem 2rem;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .hero-404 {
      font-size: 7rem;
      font-weight: 900;
      color: rgba(229,9,20,0.15);
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .hero h1 {
      font-size: 2rem;
      margin-bottom: 0.75rem;
      color: #fff;
    }

    .hero p {
      color: rgba(255,255,255,0.6);
      max-width: 500px;
      margin: 0 auto 1.5rem;
      font-size: 1.05rem;
    }

    .hero-search {
      background: #1a1a1a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-search h2 {
      font-size: 1rem;
      color: rgba(255,255,255,0.7);
      margin-bottom: 0.75rem;
      font-weight: 400;
    }

    .search-form {
      display: flex;
      gap: 0.5rem;
    }

    .search-form input {
      flex: 1;
      padding: 0.8rem 1rem;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      background: #0a0a0a;
      color: #fff;
      font-size: 1rem;
    }

    .search-form input:focus {
      outline: none;
      border-color: #e50914;
    }

    .search-form button {
      padding: 0.8rem 1.5rem;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .search-form button:hover {
      background: #f6121d;
    }

    .home-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }

    .btn-primary {
      display: inline-block;
      background: #e50914;
      color: #fff;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
    }

    .btn-primary:hover {
      background: #f6121d;
      text-decoration: none;
    }

    .btn-secondary {
      display: inline-block;
      background: #1a1a1a;
      color: #fff;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.15);
      text-align: center;
    }

    .btn-secondary:hover {
      border-color: #e50914;
      color: #e50914;
      text-decoration: none;
    }

    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .why-box {
      background: #141414;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(255,255,255,0.08);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .why-box h3 {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
      color: #fff;
    }

    .why-box p {
      font-size: 0.9rem;
      color: rgba(255,255,255,0.6);
      line-height: 1.7;
    }

    .section {
      padding: 2rem 0;
    }

    .section-title {
      font-size: 1.3rem;
      margin-bottom: 1.25rem;
      color: #fff;
      border-bottom: 2px solid #e50914;
      padding-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .section-title a {
      font-size: 0.85rem;
      color: #e50914;
      font-weight: 400;
    }

    .channel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .channel-card {
      background: #141414;
      border-radius: 6px;
      padding: 0.75rem;
      border: 1px solid rgba(255,255,255,0.05);
      transition: border-color 0.2s;
    }

    .channel-card:hover {
      border-color: rgba(229,9,20,0.5);
    }

    .channel-card a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #fff;
    }

    .channel-card a:hover {
      text-decoration: none;
    }

    .channel-card img {
      width: 36px;
      height: 36px;
      object-fit: contain;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .placeholder {
      width: 36px;
      height: 36px;
      background: #2a2a2a;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .category-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .category-tag {
      background: #141414;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 0.4rem 1rem;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.8);
      transition: all 0.2s;
    }

    .category-tag:hover {
      background: #e50914;
      color: #fff;
      border-color: #e50914;
      text-decoration: none;
    }

    footer {
      background: #0f0f1a;
      border-top: 1px solid rgba(255,255,255,0.05);
      padding: 2rem;
      text-align: center;
      margin-top: 3rem;
    }

    footer p {
      color: rgba(255,255,255,0.4);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    footer a {
      color: rgba(255,255,255,0.6);
      margin: 0 0.5rem;
      font-size: 0.875rem;
    }

    footer a:hover {
      color: #e50914;
    }

    @media (max-width: 600px) {
      .hero-404 { font-size: 5rem; }
      .hero h1 { font-size: 1.5rem; }
      .search-form { flex-direction: column; }
      .channel-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
    }
  </style>
</head>
<body>
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

  <main class="main">
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
              <span>${escapeHtml(ch.channel_name)}</span>
            </a>
          </div>`).join('')}
      </div>
    </section>` : ''}

    ${displayGroups.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Browse by Category</h2>
      <div class="category-list">
        ${displayGroups.map(g => `<a href="${origin}/category/${escapeAttr(g)}" class="category-tag">${escapeHtml(g)}</a>`).join('')}
      </div>
    </section>` : ''}
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} IPTV Search. Free IPTV Channel Directory & Search Tool</p>
    <a href="${origin}/tutorial">How to Watch</a>
    <a href="${origin}/privacy-policy">Privacy Policy</a>
    <a href="${origin}/terms">Terms of Service</a>
  </footer>
</body>
</html>`;

  return new Response(html, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
