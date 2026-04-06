// Home Page - HTML shell that loads data via API
// This page is rendered on the client side via JavaScript

export function generateHomePage(options = {}) {
  const { origin = 'https://iptv-search.com' } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IPTV Search - Free Live TV Channel Directory</title>
  <meta name="description" content="Discover 10,000+ free live TV channels. Search by category, country, or genre. Start watching instantly - no signup required!">
  <link rel="canonical" href="${origin}/">
  <meta property="og:title" content="IPTV Search - Free Live TV Channel Directory">
  <meta property="og:description" content="Discover 10,000+ free live TV channels. Search by category, country, or genre.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/">
  <meta property="og:image" content="${origin}/og-image.png">
  
  <script>
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  
  <style>
    :root {
      --bg-primary: #0a0a0a;
      --bg-secondary: #141414;
      --bg-card: #1a1a1a;
      --bg-hover: #252525;
      --text-primary: #ffffff;
      --text-secondary: #a0a0a0;
      --text-muted: #666666;
      --accent: #e50914;
      --accent-hover: #f6121d;
      --border: rgba(255,255,255,0.08);
      --border-hover: rgba(255,255,255,0.15);
      --shadow: 0 4px 20px rgba(0,0,0,0.5);
      --radius: 8px;
      --transition: 0.2s ease;
    }

    [data-theme="light"] {
      --bg-primary: #f5f5f5;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      --bg-hover: #f0f0f0;
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: rgba(0,0,0,0.08);
      --border-hover: rgba(0,0,0,0.15);
      --shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }
    button { cursor: pointer; font-family: inherit; }

    .header { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
    .logo-icon svg { width: 36px; height: 36px; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .search-box { position: relative; width: 300px; }
    .search-box form { display: flex; }
    .search-box input {
      width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 20px; color: var(--text-primary); font-size: 0.9rem; outline: none; transition: border-color var(--transition);
    }
    .search-box input:focus { border-color: var(--accent); }
    .search-box::before {
      content: '🔍'; position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);
      font-size: 0.9rem; pointer-events: none;
    }
    .pill-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .pill-btn:hover { color: var(--accent); }
    .account-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .account-btn:hover { color: var(--accent); }
    .account-btn svg, .pill-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
    .theme-toggle { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; color: var(--text-secondary); cursor: pointer; transition: color var(--transition); border: none; }
    .theme-toggle:hover { color: var(--accent); }
    #translate { position: relative; display: inline-flex; align-items: center; }
    #translateSelectLanguage { appearance: none; -webkit-appearance: none; padding: 0.5rem 2rem 0.5rem 0.75rem; background: transparent; border: none; border-radius: 6px; color: var(--text-secondary); font-size: 0.85rem; cursor: pointer; outline: none; transition: color var(--transition); min-width: 80px; }
    #translateSelectLanguage:focus { color: var(--accent); }
    #translateSelectLanguage:hover { color: var(--accent); }
    #translate::after { content: ""; position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--text-secondary); pointer-events: none; }
    #translate:hover::after { border-top-color: var(--accent); }

    .hero { background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%); padding: 4rem 2rem; text-align: center; border-bottom: 1px solid var(--border); }
    .hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; background: linear-gradient(135deg, #fff 0%, #999 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    [data-theme="light"] .hero h1 { background: linear-gradient(135deg, #1a1a1a 0%, #666 100%); -webkit-background-clip: text; background-clip: text; }
    .hero p { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem; }
    .hero-stats { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
    .hero-stat { text-align: center; }
    .hero-stat-value { font-size: 2rem; font-weight: 700; color: var(--accent); }
    .hero-stat-label { font-size: 0.85rem; color: var(--text-muted); }

    .category-showcase { max-width: 1400px; margin: 0 auto; padding: 3rem 2rem; }
    .showcase-header { text-align: center; margin-bottom: 2.5rem; }
    .showcase-header h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
    .showcase-header p { color: var(--text-secondary); font-size: 1rem; }
    .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; }
    .category-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; text-decoration: none; transition: all 0.25s ease; cursor: pointer; position: relative; overflow: hidden; }
    .category-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(229, 9, 20, 0.15); }
    .category-icon { width: 40px; height: 40px; margin-bottom: 0.75rem; color: var(--accent); }
    .category-icon svg { width: 100%; height: 100%; }
    .category-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; text-align: center; }
    .category-count { font-size: 0.75rem; color: var(--text-muted); }

    .page-footer { background: var(--bg-secondary); border-top: 1px solid var(--border); padding: 2.5rem 1.25rem; margin-top: 3rem; }
    .footer-content { max-width: 1000px; margin: 0 auto; text-align: center; }
    .footer-copyright { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1.25rem; }
    .footer-links { display: flex; justify-content: center; align-items: center; gap: 1.25rem; flex-wrap: wrap; margin-top: 1rem; font-size: 0.75rem; }
    .footer-links a { color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .footer-links a:hover { color: var(--text-primary); }
    .footer-badges { display: flex; align-items: center; justify-content: center; gap: 0.625rem; margin-top: 1.25rem; }
    .footer-badges img { height: 12px; width: auto; opacity: 0.8; transition: opacity var(--transition); }
    .footer-badges img:hover { opacity: 1; }
    .footer-badges span { font-size: 0.75rem; color: var(--text-secondary); }
    .footer-disclaimer { margin-top: 1rem; font-size: 0.7rem; color: var(--text-muted); line-height: 1.5; max-width: 600px; margin-left: auto; margin-right: auto; }

    .loading { text-align: center; padding: 4rem; color: var(--text-secondary); }

    @media (max-width: 768px) {
      .header { padding: 0.5rem 0.75rem; }
      .header-inner { flex-wrap: wrap; justify-content: space-between; gap: 0.5rem; }
      .logo { flex-shrink: 0; }
      .logo-icon svg { width: 32px; height: 32px; }
      .logo-text { display: none; }
      .search-box { width: 100%; order: 3; margin-top: 0.5rem; }
      .search-box input { padding: 0.5rem 1rem 0.5rem 2.5rem; font-size: 0.9rem; }
      .search-box::before { font-size: 0.9rem; left: 0.8rem; }
      .header-actions { gap: 0.25rem; flex-shrink: 0; }
      .header-actions .pill-btn { width: 32px; height: 32px; padding: 0; flex-shrink: 0; }
      .header-actions .pill-btn span { display: none; }
      .theme-toggle { width: 32px; height: 32px; background: transparent; border: none; padding: 0; flex-shrink: 0; }
      .account-btn { width: 32px; height: 32px; padding: 0; flex-shrink: 0; }
      .hero { padding: 2rem 1rem; }
      .hero h1 { font-size: 1.75rem; }
      .hero-stats { gap: 1.5rem; }
      .hero-stat-value { font-size: 1.5rem; }
      .category-showcase { padding: 2rem 1rem; }
      .category-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.75rem; }
      .category-card { padding: 1rem 0.75rem; }
      .category-icon { width: 32px; height: 32px; }
      .category-name { font-size: 0.8rem; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <a href="${origin}/" class="logo">
        <div class="logo-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ff3b30;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="36" height="36" rx="6" fill="url(#tvGradient)" />
            <rect x="4" y="8" width="28" height="18" rx="2" fill="#0a0a0a" />
            <path d="M14 12 L24 17 L14 22 Z" fill="#fff" />
            <rect x="10" y="28" width="6" height="3" rx="1" fill="#0a0a0a" />
            <rect x="20" y="28" width="6" height="3" rx="1" fill="#0a0a0a" />
          </svg>
        </div>
        <div class="logo-text">IPTV<span>Search</span></div>
      </a>
      <div class="search-box">
        <form action="${origin}/search" method="get">
          <input type="text" name="q" placeholder="Search channels..." value="">
        </form>
      </div>
      <div class="header-actions">
        <a href="${origin}/favorites" class="pill-btn" title="My Favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </a>
        <a href="${origin}/plans" class="pill-btn" title="Subscription Plans">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </a>
        <button class="theme-toggle" id="themeToggle" title="Toggle theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>
        <a href="${origin}/account" class="account-btn" title="My Account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
        <div id="translate"></div>
      </div>
    </div>
  </header>

  <section class="hero">
    <h1>Find & Watch Free Live TV</h1>
    <p>Free IPTV Search Engine. Find Live TV Streams, M3U Playlists & HD Channels.</p>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-value" id="totalChannels">--</div>
        <div class="hero-stat-label">Channels</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-value" id="totalGroups">--</div>
        <div class="hero-stat-label">Categories</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-value">4K</div>
        <div class="hero-stat-label">HD Quality</div>
      </div>
    </div>
  </section>

  <section class="category-showcase">
    <div class="showcase-header">
      <h2>Browse by Category</h2>
      <p>Explore our channel collection organized by category</p>
    </div>
    <div class="category-grid" id="categoryGrid">
      <div class="loading">Loading categories...</div>
    </div>
  </section>

  <footer class="page-footer">
    <div class="footer-content">
      <p class="footer-copyright">&copy; ${new Date().getFullYear()} IPTV Search. Free IPTV Channel Directory & Search Tool</p>
      <div class="footer-links">
        <a href="${origin}/tutorial">How to Watch on TV Devices</a>
        <a href="${origin}/sitemap.xml">Sitemap</a>
        <a href="${origin}/robots.txt">Robots</a>
        <a href="${origin}/privacy-policy">Privacy Policy</a>
        <a href="${origin}/terms">Terms of Service</a>
        <a href="mailto:support@iptv-search.com">Contact Us</a>
      </div>
      <div class="footer-badges">
        <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">
          <img src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/CHOl0sUhrumCxOXfRotGt/081f81d52274080b2d026fdf163e3009/cloudflare-icon-color_3x.png" alt="Cloudflare">
        </a>
        <span>This site is powered by Cloudflare for acceleration and security</span>
      </div>
      <div class="footer-disclaimer">This site does not host or provide any IPTV streams. All channels are sourced from publicly available M3U playlists. Channels may go offline at any time as their source streams change.</div>
    </div>
  </footer>

  <!-- JSON-LD structured data will be injected here -->
  <script id="json-ld" type="application/ld+json"></script>

  <script>
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', function() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    // Load home data from API
    async function loadHomeData() {
      try {
        const origin = '${origin}';
        const response = await fetch(origin + '/api/home');
        const data = await response.json();

        // Update stats
        document.getElementById('totalChannels').textContent = 
          (data.data?.totalChannels >= 10000 ? '10,000+' : (data.data?.totalChannels || 0).toLocaleString());
        document.getElementById('totalGroups').textContent = 
          (data.data?.totalGroups >= 100 ? '100+' : data.data?.totalGroups || 0);

        // Render categories
        const categoryGrid = document.getElementById('categoryGrid');
        const categories = data.data?.categories || [];

        if (categories.length > 0) {
          categoryGrid.innerHTML = categories.map(cat => {
            const slug = encodeURIComponent(cat.slug);
            const icon = cat.icon;
            const name = cat.name;
            const count = cat.count;
            return '<a href="' + origin + '/category/' + slug + '" class="category-card">' +
              '<div class="category-icon">' + icon + '</div>' +
              '<div class="category-name">' + name + '</div>' +
              '<div class="category-count">' + count + ' channels</div>' +
            '</a>';
          }).join('');
        } else {
          categoryGrid.innerHTML = '<p>No categories found</p>';
        }

        // Inject JSON-LD
        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "IPTV Search",
          "url": origin,
          "description": "Free IPTV Channel Directory and Search Engine",
          "potentialAction": {
            "@type": "SearchAction",
            "target": origin + "/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
        document.getElementById('json-ld').textContent = JSON.stringify(jsonLd);

      } catch (error) {
        console.error('Failed to load home data:', error);
        document.getElementById('categoryGrid').innerHTML = 
          '<p class="loading">Failed to load categories. Please refresh the page.</p>';
      }
    }

    loadHomeData();
  </script>
  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    function initTranslate() {
      if (typeof translate !== 'undefined' && translate.language) {
        translate.selectLanguageTag.show = true;
        translate.selectLanguageTag.documentId = 'translate';
        translate.language.setLocal('english');
        translate.service.use('client.edge');
        translate.listener.start();
        translate.setAutoDiscriminateLocalLanguage();
        translate.execute();
      } else { setTimeout(initTranslate, 100); }
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initTranslate); } else { initTranslate(); }
  </script>
</body>
</html>`;
}