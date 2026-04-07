// Home Page - HTML shell that loads data via API
// This page is rendered on the client side via JavaScript

export function generateHomePage(options = {}) {
  const { origin = 'https://iptv-search.com', header = '', footer = '' } = options;

  // 如果传入了header和footer，直接使用；否则使用内嵌的
  const pageHeader = header || `<header class="header">...</header>`;
  const pageFooter = footer || `<footer class="page-footer">...</footer>`;

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
  ${pageHeader}

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
      <p>Discover thousands of free live TV channels across all categories - CCTV, Sports, Movies, News and more</p>
    </div>
    <div class="category-grid" id="categoryGrid">
      <div class="loading">Loading categories...</div>
    </div>
  </section>

  ${pageFooter}

  <!-- JSON-LD structured data will be injected here -->
  <script id="json-ld" type="application/ld+json"></script>

  <script>
    // Theme toggle with icon update
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved ? saved === 'dark' : prefersDark;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    })();
    
    function updateThemeIcons(isDark) {
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = isDark ? 'none' : 'block';
        moon.style.display = isDark ? 'block' : 'none';
      }
    }

    document.getElementById('themeToggle')?.addEventListener('click', function() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcons(next === 'dark');
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
          },
          "publisher": {
            "@type": "Organization",
            "name": "IPTV Search",
            "url": origin,
            "sameAs": ["https://twitter.com/iptvsearch"]
          },
          "mainEntity": {
            "@type": "FAQPage",
            "name": "Frequently Asked Questions",
            "mainEntity": [
              {"@type": "Question", "name": "How can I watch IPTV channels for free?", "acceptedAnswer": {"@type": "Answer", "text": "IPTV Search provides free access to watch live TV channels. Simply browse our directory, select a channel, and start watching. No registration or subscription required for basic access."}},
              {"@type": "Question", "name": "What devices support IPTV streaming?", "acceptedAnswer": {"@type": "Answer", "text": "Our IPTV streams work on most devices including Smart TVs (Samsung, LG, Sony), streaming devices (Roku, Firestick, Apple TV), computers, smartphones, and tablets. Use VLC player or any IPTV-compatible app."}},
              {"@type": "Question", "name": "How many channels are available?", "acceptedAnswer": {"@type": "Answer", "text": "We offer over 10,000 live TV channels from around the world, covering news, sports, entertainment, movies, and more. New channels are added regularly."}},
              {"@type": "Question", "name": "Is IPTV legal?", "acceptedAnswer": {"@type": "Answer", "text": "IPTV Search only indexes publicly available streaming links. We do not host or produce any content. Users are responsible for ensuring compliance with their local laws and the content provider's terms of service."}},
              {"@type": "Question", "name": "What is the subscription plans?", "acceptedAnswer": {"@type": "Answer", "text": "We offer free basic access with ads. Premium subscription removes ads, provides HD/4K quality, and allows simultaneous connections. Visit our /plans page for current pricing."}},
              {"@type": "Question", "name": "Why is my channel not playing?", "acceptedAnswer": {"@type": "Answer", "text": "If a channel won't play, try: 1) Refresh the page, 2) Use a different player, 3) Check your internet connection, 4) Try a different channel. Some links may be temporary."}},
              {"@type": "Question", "name": "Do you offer technical support?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, premium subscribers get 24/7 technical support. Free users can find help in our tutorial section and FAQ."}},
              {"@type": "Question", "name": "How often are channels updated?", "acceptedAnswer": {"@type": "Answer", "text": "We update our channel database daily. Dead links are removed and new channels are added regularly to maintain quality."}},
              {"@type": "Question", "name": "Can I record live TV?", "acceptedAnswer": {"@type": "Answer", "text": "Recording functionality is not available on our free service. Some third-party players support DVR features for IPTV streams."}},
              {"@type": "Question", "name": "What countries channels are available?", "acceptedAnswer": {"@type": "Answer", "text": "We have channels from 150+ countries including USA, UK, Canada, Australia, India, China, Brazil, and many more. Browse by category or country on our homepage."}}
            ]
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