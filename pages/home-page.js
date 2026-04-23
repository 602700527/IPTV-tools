// Home Page - HTML shell that loads data via API
// This page is rendered on the client side via JavaScript
import { HEAD_SCRIPTS } from '../components/head-scripts.js';

export function generateHomePage(options = {}) {
  const { origin = 'https://iptv-search.com', header = '', footer = '' } = options;

  // 如果传入了header和footer，直接使用；否则使用内嵌的
  const pageHeader = header || `<header class="header">...</header>`;
  const pageFooter = footer || `<footer class="page-footer">...</footer>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[iptvsearch] - Free IPTV Search Engine | 8000+ Live TV Channels M3U M3U8</title>
  <meta name="description" content="Find any IPTV channel instantly. Search live sports, movies, news. Updated daily. No signup required. Compatible with IPTV Smarters Pro, VLC, GSE Smart IPTV, and all M3U M3U8 players.">
  <meta name="keywords" content="iptv search, free IPTV search, IPTV search engine, search IPTV channels, find IPTV, best IPTV search, iptv link finder, M3U search, M3U8 search, live TV search, watch IPTV online, IPTV search free, IPTV M3U, IPTV M3U8, free IPTV, IPTV player">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${origin}/">
  <meta property="og:title" content="[iptvsearch] - Free IPTV Search Engine | 8000+ Live TV Channels">
  <meta property="og:description" content="Find any IPTV channel instantly. Search live sports, movies, news. Updated daily. No signup required.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/">
  <meta property="og:image" content="${origin}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="iptvsearch - Free IPTV Search Engine | 8000+ Live TV Channels">
  <meta name="twitter:description" content="Find any IPTV channel instantly. Search live sports, movies, news. Updated daily.">
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
      /* 背景层次 */
      --bg-primary: #0a0a0a;
      --bg-secondary: #141414;
      --bg-card: #1a1a1a;
      --bg-hover: #252525;
      --bg-elevated: #222222;
      
      /* 文字层次 */
      --text-primary: #ffffff;
      --text-secondary: #a0a0a0;
      --text-muted: #666666;
      
      /* 主色调 - Netflix红 */
      --accent: #e50914;
      --accent-hover: #f7262c;
      
      /* 辅助色系 - 情感多元化 */
      --premium-gold: #fbbf24;
      --success-green: #22c55e;
      --trust-blue: #3b82f6;
      --alert-orange: #f59e0b;
      
      /* 价格高亮 */
      --price-glow: 0 0 20px rgba(229, 9, 20, 0.4);
      
      /* 边框与阴影 */
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
      --bg-elevated: #ffffff;
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
    .hero-stat-value { font-size: 2rem; font-weight: 700; color: var(--accent); text-shadow: var(--price-glow); }
    .hero-stat-label { font-size: 0.85rem; color: var(--text-muted); }
    
    /* Category card hover effect - premium feel */
    .category-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(229, 9, 20, 0.15); }
    
    /* Premium gold for special elements */
    .premium-badge { 
      background: linear-gradient(135deg, var(--premium-gold) 0%, var(--alert-orange) 100%);
      color: #000;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
    }
    
    /* Success green for positive actions */
    .success-highlight { color: var(--success-green); }
    
    /* Alert orange for urgency */
    .alert-badge {
      background: linear-gradient(135deg, var(--alert-orange) 0%, #ea580c 100%);
      color: #fff;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
    }

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

    /* Hot Topics Module */
    .hot-topics { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .hot-topics-header { text-align: center; margin-bottom: 1.5rem; }
    .hot-topics-header h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--text-primary); }
    .hot-topics-header p { color: var(--text-secondary); font-size: 0.9rem; }
    .hot-topics-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
    .topic-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 1.25rem 1rem; background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 12px; text-decoration: none; transition: all 0.25s ease; cursor: pointer;
    }
    .topic-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(229, 9, 20, 0.15); }
    .topic-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .topic-title { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
    .topic-desc { font-size: 0.75rem; color: var(--text-muted); }

    /* Regional Topics Section */
    .regional-topics { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .regional-topics-header { text-align: center; margin-bottom: 1.5rem; }
    .regional-topics-header h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--text-primary); }
    .regional-topics-header p { color: var(--text-secondary); font-size: 0.9rem; }
    .regional-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
    .regional-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 1.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 12px; text-decoration: none; transition: all 0.25s ease; cursor: pointer;
    }
    .regional-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(229, 9, 20, 0.15); }
    .regional-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .regional-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
    .regional-desc { font-size: 0.8rem; color: var(--text-muted); text-align: center; }

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
      .hot-topics { padding: 1.5rem 1rem; }
      .hot-topics-header h2 { font-size: 1.25rem; }
      .hot-topics-grid { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
      .topic-card { padding: 1rem 0.5rem; }
      .topic-icon { font-size: 1.5rem; }
      .topic-title { font-size: 0.85rem; }
      .topic-desc { font-size: 0.7rem; }
      .regional-topics { padding: 1.5rem 1rem; }
      .regional-topics-header h2 { font-size: 1.25rem; }
      .regional-grid { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
      .regional-card { padding: 1rem 0.5rem; }
      .regional-icon { font-size: 2rem; }
      .regional-title { font-size: 0.9rem; }
      .regional-desc { font-size: 0.7rem; }
    }
    @media (max-width: 480px) {
      .hot-topics-grid { grid-template-columns: repeat(2, 1fr); }
      .regional-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
      .regional-card { padding: 0.75rem 0.5rem; }
      .regional-icon { font-size: 1.75rem; }
      .regional-title { font-size: 0.85rem; }
      .regional-desc { font-size: 0.65rem; }
    }
  </style>
</head>
<body>
  ${pageHeader}

  <section class="hero">
    <h1>8,000+ Global Live TV Channels</h1>
    <p>Overseas Chinese' no.1 Choice | Works with VLC, APTV, Smarters & all platforms</p>
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

  <section class="hot-topics">
    <div class="hot-topics-header">
      <h2>Popular Topics</h2>
      <p>Explore curated content by category</p>
    </div>
    <div class="hot-topics-grid">
      <a href="/usa-iptv" class="topic-card">
        <span class="topic-icon">🇺🇸</span>
        <span class="topic-title">USA IPTV</span>
        <span class="topic-desc">US Live TV</span>
      </a>
      <a href="/uk-iptv-plans" class="topic-card">
        <span class="topic-icon">🇬🇧</span>
        <span class="topic-title">UK IPTV</span>
        <span class="topic-desc">British Channels</span>
      </a>
      <a href="/tutorial" class="topic-card">
        <span class="topic-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></span>
        <span class="topic-title">Smart TV</span>
        <span class="topic-desc">Setup Guide</span>
      </a>
      <a href="/android-iptv-app" class="topic-card">
        <span class="topic-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M8 6h.01"/><path d="M16 6h.01"/></svg></span>
        <span class="topic-title">Android</span>
        <span class="topic-desc">IPTV Apps</span>
      </a>
      <a href="/free-iptv-app-review" class="topic-card">
        <span class="topic-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></span>
        <span class="topic-title">Free IPTV</span>
        <span class="topic-desc">App Reviews</span>
      </a>
    </div>
  </section>

  <section class="regional-topics">
    <div class="regional-topics-header">
      <h2>Explore by Region</h2>
      <p>Free IPTV channels from around the world</p>
    </div>
    <div class="regional-grid">
      <a href="/americas-iptv" class="regional-card">
        <span class="regional-icon">🌎</span>
        <span class="regional-title">Americas</span>
        <span class="regional-desc">USA, Canada, Brazil</span>
      </a>
      <a href="/europe-iptv" class="regional-card">
        <span class="regional-icon">🌍</span>
        <span class="regional-title">Europe</span>
        <span class="regional-desc">UK, France, Germany</span>
      </a>
      <a href="/asia-iptv" class="regional-card">
        <span class="regional-icon">🌏</span>
        <span class="regional-title">Asia</span>
        <span class="regional-desc">China, Japan, Korea</span>
      </a>
      <a href="/middle-east-iptv" class="regional-card">
        <span class="regional-icon">🌍</span>
        <span class="regional-title">Middle East</span>
        <span class="regional-desc">Arabic, Turkish</span>
      </a>
      <a href="/oceania-iptv" class="regional-card">
        <span class="regional-icon">🌏</span>
        <span class="regional-title">Oceania</span>
        <span class="regional-desc">Australia, NZ</span>
      </a>
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
            "url": origin
          },
          "mainEntity": {
            "@type": "FAQPage",
            "name": "Frequently Asked Questions",
            "mainEntity": [
              {"@type": "Question", "name": "How can I watch IPTV channels for free?", "acceptedAnswer": {"@type": "Answer", "text": "IPTV Search provides free access to watch live TV channels. Simply browse our directory, select a channel, and start watching. No registration or subscription required for basic access."}},
              {"@type": "Question", "name": "What devices support IPTV streaming?", "acceptedAnswer": {"@type": "Answer", "text": "Our IPTV streams work on most devices including Smart TVs (Samsung, LG, Sony), streaming devices (Roku, Firestick, Apple TV), computers, smartphones, and tablets. Use VLC player or any IPTV-compatible app."}},
              {"@type": "Question", "name": "How many channels are available?", "acceptedAnswer": {"@type": "Answer", "text": "We offer over 8000+ live TV channels from around the world, covering news, sports, entertainment, movies, and more. New channels are added regularly."}},
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