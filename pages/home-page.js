// Home Page - HTML shell that loads data via API
// This page is rendered on the client side via JavaScript
import { HEAD_SCRIPTS } from '../components/head-scripts.js';

// HTML 
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateHomePage(options = {}) {
  const {
    origin = 'https://iptv-search.com',
    header = '',
    footer = '',
    regionCategories = [],
    typeCategories = [],
    totalChannels = 0,
    totalGroups = 0
  } = options;

  // headerfooter，；
  const pageHeader = header || `<header class="header">...</header>`;
  const pageFooter = footer || `<footer class="page-footer">...</footer>`;

  // Pre-render region categories HTML (SSR)
  const regionGridHtml = regionCategories.length > 0
    ? regionCategories.map(cat => {
        const slug = encodeURIComponent(cat.slug);
        return '<a href="' + origin + '/category/' + slug + '" class="category-card">' +
          '<div class="category-icon">' + (cat.icon || '') + '</div>' +
          '<div class="category-name">' + escapeHtml(cat.name) + '</div>' +
          '<div class="category-count">' + cat.count + ' channels</div>' +
        '</a>';
      }).join('')
    : '<p>No categories found</p>';

  // Pre-render type categories HTML (SSR)
  const typeGridHtml = typeCategories.length > 0
    ? typeCategories.map(t => {
        const slug = encodeURIComponent(t.slug);
        return '<a href="' + origin + '/type/' + slug + '" class="type-card">' +
          '<div class="type-icon">' + (t.icon || '') + '</div>' +
          '<div class="type-name">' + escapeHtml(t.name) + '</div>' +
          '<div class="type-count">' + t.count + ' channels</div>' +
        '</a>';
      }).join('')
    : '<p>No types found</p>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Free IPTV Search - 8000+ Channels from 150+ Countries</title>
  <meta name="description" content="Search 8000+ free IPTV channels from 150+ countries. Browse live TV by region including USA, UK, China, Brazil. No registration. Updated daily.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${origin}/">
  <meta property="og:title" content="iptvsearch - Free IPTV Search Engine | 8000+ Live TV Channels">
  <meta property="og:description" content="Find any IPTV channel instantly. Search live sports, movies, news. Updated daily. No signup required.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/">
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content="${origin}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="iptvsearch - Free IPTV Search Engine | 8000+ Live TV Channels">
  <meta name="twitter:description" content="Find any IPTV channel instantly. Search live sports, movies, news. Updated daily.">




  <!-- JSON-LD structured data (SSR - visible to AI crawlers without JS) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IPTV Search",
    "url": "${origin}",
    "description": "Free IPTV Channel Directory and Search Engine",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "${origin}/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "IPTV Search",
      "url": "${origin}"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "How can I watch IPTV channels for free?", "acceptedAnswer": {"@type": "Answer", "text": "IPTV Search provides free access to watch live TV channels. Simply browse our directory, select a channel, and start watching. No registration or subscription required for basic access."}},
      {"@type": "Question", "name": "What devices support IPTV streaming?", "acceptedAnswer": {"@type": "Answer", "text": "Our IPTV streams work on most devices including Smart TVs (Samsung, LG, Sony), streaming devices (Roku, Firestick, Apple TV), computers, smartphones, and tablets. Use VLC player or any IPTV-compatible app."}},
      {"@type": "Question", "name": "How many channels are available?", "acceptedAnswer": {"@type": "Answer", "text": "We offer over 8000+ live TV channels from around the world, covering news, sports, entertainment, movies, and more. New channels are added regularly."}},
      {"@type": "Question", "name": "Is IPTV legal?", "acceptedAnswer": {"@type": "Answer", "text": "IPTV Search only indexes publicly available streaming links. We do not host or produce any content. Users are responsible for ensuring compliance with their local laws and the content provider's terms of service."}},
      {"@type": "Question", "name": "What are the subscription plans?", "acceptedAnswer": {"@type": "Answer", "text": "We offer free basic access with ads. Premium subscription removes ads, provides HD/4K quality, and allows simultaneous connections. Visit our /freesub page for current pricing."}},
      {"@type": "Question", "name": "Why is my channel not playing?", "acceptedAnswer": {"@type": "Answer", "text": "If a channel won't play, try: 1) Refresh the page, 2) Use a different player, 3) Check your internet connection, 4) Try a different channel. Some links may be temporary."}},
      {"@type": "Question", "name": "Do you offer technical support?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, premium subscribers get 24/7 technical support. Free users can find help in our tutorial section and FAQ."}},
      {"@type": "Question", "name": "How often are channels updated?", "acceptedAnswer": {"@type": "Answer", "text": "We update our channel database daily. Dead links are removed and new channels are added regularly to maintain quality."}},
      {"@type": "Question", "name": "Can I record live TV?", "acceptedAnswer": {"@type": "Answer", "text": "Recording functionality is not available on our free service. Some third-party players support DVR features for IPTV streams."}},
      {"@type": "Question", "name": "What countries channels are available?", "acceptedAnswer": {"@type": "Answer", "text": "We have channels from 150+ countries including USA, UK, Canada, Australia, India, China, Brazil, and many more. Browse by category or country on our homepage."}}
    ]
  }
  </script>

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
      --accent: #e50914;
      --accent-hover: #ff1a1a;
      --transition: 0.2s ease;
      --bg-primary: #0a0a0a;
      --bg-secondary: #0f0f0f;
      --bg-card: transparent;
      --bg-hover: transparent;
      --text-primary: #ffffff;
      --text-secondary: #888888;
      --text-muted: #555555;
      --border: 1px solid rgba(255,255,255,0.08);
      --border-hover: 1px solid rgba(229,9,20,0.4);
    }

    [data-theme="light"] {
      --bg-primary: #ffffff;
      --bg-secondary: #fafafa;
      --bg-card: transparent;
      --bg-hover: transparent;
      --text-primary: #0a0a0a;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: 1px solid rgba(0,0,0,0.1);
      --border-hover: 1px solid rgba(229,9,20,0.5);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-padding-top: 60px; }
    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: inherit; }

    /*  - 、 */
    .header {
      background: var(--bg-primary);
      border-bottom: var(--border);
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 10000;
    }
    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      padding: 0.75rem 0;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      flex-shrink: 0;
    }
    .logo-icon svg { width: 28px; height: 28px; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1.5rem; }

    .search-box { position: relative; }
    .search-box form { display: flex; }
    .search-box input {
      width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; background: transparent;
      border: var(--border); color: var(--text-primary); font-size: 0.9rem;
      outline: none; transition: border-color var(--transition);
    }
    .search-box input:focus { border-color: var(--accent); }
    .search-box input::placeholder { color: var(--text-muted); }
    .search-box::before { display: none; }
    .pill-btn { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .pill-btn:hover { color: var(--accent); }
    .account-btn { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .account-btn:hover { color: var(--accent); }
    .account-btn svg, .pill-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
    #translate { position: relative; display: inline-flex; align-items: center; }
    #translateSelectLanguage {
      appearance: none; -webkit-appearance: none; padding: 0 0.5rem;
      background: transparent; border: none; color: var(--text-secondary);
      font-size: 0.75rem; cursor: pointer; outline: none; transition: color var(--transition);
      min-width: 50px;
    }
    #translateSelectLanguage:focus, #translateSelectLanguage:hover { color: var(--accent); }

    /* Hero -  */
    .hero {
      position: relative;
      padding: 80px 0 60px;
      text-align: center;
      border-bottom: var(--border);
    }
    .hero-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2rem;
    }
    .hero-content { text-align: center; }
    .hero h1 {
      font-size: 4rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 1rem;
      letter-spacing: -0.03em;
      color: var(--text-primary);
    }
    [data-theme="light"] .hero h1 { color: var(--text-primary); }
    .hero p {
      font-size: 1rem;
      color: var(--text-secondary);
      max-width: 500px;
      line-height: 1.6;
      margin: 0 auto;
    }
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 4rem;
      flex-shrink: 0;
    }
    .hero-stat { text-align: center; }
    .hero-stat-value {
      font-size: 3rem;
      font-weight: 800;
      color: var(--text-primary);
      display: block;
      line-height: 1;
      letter-spacing: -0.02em;
    }
    .hero-stat-label {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0.5rem;
    }

    /* Promo Banner */
    .promo-banner {
      display: none;
      background: var(--accent);
      margin: 0 auto;
      max-width: 1400px;
      position: relative;
    }
    .promo-banner.show { display: block; }
    /* Subscription Value Banner - V3 Editorial */
    .sub-value-banner {
      background: var(--bg-primary);
      border-top: 3px solid var(--accent);
      padding: 2.5rem 0;
      margin-top: 2rem;
    }
    .sub-value-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 3rem;
    }
    .sub-value-left {
      flex: 1;
    }
    .sub-value-eyebrow {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--accent);
      margin-bottom: 0.75rem;
    }
    .sub-value-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .sub-value-title span {
      color: var(--accent);
    }
    .sub-value-desc {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-top: 1rem;
      max-width: 480px;
      line-height: 1.6;
    }
    .sub-value-copy-btn {
      background: none;
      border: 1px solid var(--border);
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 0.8rem;
      padding: 0.375rem 0.75rem;
      transition: all 0.2s;
    }
    .sub-value-copy-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    .sub-value-player-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }
    .sub-value-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.5rem;
      background: transparent;
      color: var(--accent);
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      border: 1px solid var(--accent);
      transition: all 0.2s;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .sub-value-cta:hover {
      background: var(--accent);
      color: #fff;
    }
    @media (max-width: 768px) {
      .sub-value-inner {
        flex-direction: column;
        align-items: flex-start;
        gap: 2rem;
      }
      .sub-value-title {
        font-size: 1.75rem;
      }
      .sub-value-cta {
        width: 100%;
        justify-content: center;
      }
    }

    .promo-banner-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      padding: 0.75rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .promo-countdown-box { display: flex; align-items: center; gap: 4px; }
    .promo-countdown-numbers {
      display: flex; gap: 4px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.85rem; font-weight: 600; color: #fff;
    }
    .promo-countdown-numbers .time-unit {
      display: inline-flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.2); padding: 4px 8px; min-width: 32px;
    }
    .promo-countdown-numbers .time-sep { color: rgba(255,255,255,0.5); line-height: 1; }
    .promo-banner-content { text-align: center; }
    .promo-headline { color: #fff; font-size: 0.9rem; font-weight: 500; }
    .promo-cta {
      background: #fff; color: var(--accent);
      font-weight: 600; padding: 0.4rem 1rem; font-size: 0.8rem;
      text-decoration: none; transition: all 0.2s; white-space: nowrap;
    }
    .promo-cta:hover { background: rgba(255,255,255,0.9); }

    /* Section Headers -  */
    .section-header {
      display: flex; align-items: center; gap: 1rem;
      margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: var(--border);
    }
    .section-header h2 {
      font-size: 0.75rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.15em;
      color: var(--text-primary);
    }
    .section-header::after { content: ''; flex: 1; height: 1px; background: var(--border); }

    /* Category Showcase -  */
    .category-showcase { max-width: 1400px; margin: 0 auto; padding: 3rem 0; }
    .showcase-header { text-align: center; margin-bottom: 2rem; }
    .showcase-header h2 { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-primary); }
    .showcase-header p { color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem; }

    .view-toggle { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; justify-content: center; }
    .view-toggle-btn {
      padding: 0.5rem 0; background: transparent; border: none;
      color: var(--text-muted); font-size: 0.75rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.1em;
      cursor: pointer; transition: all 0.2s; position: relative;
    }
    .view-toggle-btn.active { color: var(--accent); }
    .view-toggle-btn.active::after {
      content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
      height: 2px; background: var(--accent);
    }
    .view-toggle-btn:hover { color: var(--text-primary); }
    .view-toggle-btn svg { width: 14px; height: 14px; vertical-align: middle; margin-right: 0.25rem; }

    /* Category & Type Grids -  */
    .category-grid, .type-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 0; }
    .category-card, .type-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 1.5rem 0.75rem; background: transparent;
      border: none; border-right: var(--border); border-bottom: var(--border);
      text-decoration: none; transition: all 0.2s; cursor: pointer; position: relative;
    }
    .category-card:hover, .type-card:hover { background: var(--bg-secondary); }
    .category-card::after, .type-card::after {
      content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px;
      background: var(--accent); transition: width 0.3s ease;
    }
    .category-card:hover::after, .type-card:hover::after { width: 100%; }
    .category-icon, .type-icon {
      width: 40px; height: 40px; margin-bottom: 0.75rem;
      display: flex; align-items: center; justify-content: center;
      color: var(--accent); font-size: 1.5rem;
    }
    .category-icon svg, .type-icon svg { width: 100%; height: 100%; }
    .category-name, .type-name {
      font-size: 0.9rem; font-weight: 600; color: var(--text-primary);
      text-align: center; margin-bottom: 0.25rem;
    }
    .category-count, .type-count { font-size: 0.8rem; color: var(--text-muted); }

    .loading { text-align: center; padding: 4rem; color: var(--text-secondary); }

    /* Hot Topics & Regional -  */
    .hot-topics, .regional-topics { max-width: 1400px; margin: 0 auto; padding: 2rem 0; }
    .hot-topics-header, .regional-topics-header { text-align: center; margin-bottom: 1.5rem; }
    .hot-topics-header h2, .regional-topics-header h2 {
      font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.15em; color: var(--text-primary);
    }
    .hot-topics-header p, .regional-topics-header p { color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem; }
    .hot-topics-grid, .regional-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; }
    .topic-card, .regional-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 2rem 1rem; background: transparent;
      border: none; border-right: var(--border);
      text-decoration: none; transition: all 0.2s; cursor: pointer;
    }
    .topic-card:hover, .regional-card:hover { background: var(--bg-secondary); }
    .topic-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
    .regional-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
    .topic-title, .regional-title {
      font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;
    }
    .topic-desc, .regional-desc { font-size: 0.8rem; color: var(--text-muted); text-align: center; }

    @media (max-width: 768px) {
      .header-inner { flex-wrap: wrap; padding: 0.5rem 1rem; gap: 0.75rem; }
      .logo { flex-shrink: 0; }
      .logo-text { display: none; }
      .header-actions { flex-shrink: 0; gap: 0.75rem; }
      .pill-btn, .account-btn { width: 24px; height: 24px; }
      .account-btn svg, .pill-btn svg { width: 14px; height: 14px; }
      #translateSelectLanguage { min-width: 40px; font-size: 0.7rem; }
      .hero { padding: 60px 0 40px; }
      .hero-inner { flex-direction: column; gap: 2rem; padding: 0 1rem; }
      .hero h1 { font-size: 2rem; }
      .hero-stats { gap: 2rem; }
      .hero-stat-value { font-size: 1.75rem; }
      .category-showcase { padding: 2rem 1rem; }
      .category-grid, .type-grid { grid-template-columns: repeat(4, 1fr); }
      .topic-card, .regional-card { padding: 1.5rem 0.5rem; }
      .hot-topics, .regional-topics { padding: 1.5rem 1rem; }
      .hot-topics-grid, .regional-grid { grid-template-columns: repeat(3, 1fr); gap: 0; }
    }

    @media (max-width: 480px) {
      .hero h1 { font-size: 1.75rem; }
      .hero-stats { gap: 1.5rem; }
      .category-grid, .type-grid { grid-template-columns: repeat(2, 1fr); }
      .hot-topics-grid, .regional-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body>
  <script>
    // Make switchView globally accessible BEFORE any other scripts
    window.switchView = function(view) {
      try {
        const regionGrid = document.getElementById('regionGrid');
        const typeGrid = document.getElementById('typeGrid');
        const toggleBtns = document.querySelectorAll('.view-toggle-btn');

        toggleBtns.forEach(btn => {
          btn.classList.remove('active');
        });

        const activeBtn = document.querySelector('.view-toggle-btn[data-view="' + view + '"]');
        if (activeBtn) {
          activeBtn.classList.add('active');
        }

        if (view === 'region') {
          regionGrid.style.display = '';
          typeGrid.style.display = 'none';
        } else {
          regionGrid.style.display = 'none';
          typeGrid.style.display = '';
        }
      } catch (error) {
        console.error('switchView error:', error);
      }
    };
  </script>

  ${pageHeader}

  <section class="hero">
    <div class="hero-inner">
      <div class="hero-content">
        <h1>Free IPTV Channel Search - 5000+ Live TV Channels from 150+ Countries</h1>
        <p>Overseas Chinese' no.1 Choice | Works with VLC, APTV, Smarters & all platforms</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <div class="hero-stat-value" id="totalGroups">${totalGroups >= 100 ? '100+' : totalGroups}</div>
          <div class="hero-stat-label">Categories</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value">4K</div>
          <div class="hero-stat-label">HD Quality</div>
        </div>
      </div>
    </div>
  </section>


    <!-- Subscription Value Banner - V3 Editorial -->
  <div class="sub-value-banner" id="subValueBanner">
    <div class="sub-value-inner">
      <div class="sub-value-left">
        <div class="sub-value-eyebrow" id="bannerEyebrow">New User Special</div>
        <h2 class="sub-value-title" id="bannerTitle">Your Full Channel<br><span>Playlist</span> Awaits</h2>
        <p class="sub-value-desc" id="bannerDesc">Register now and get instant access to 5000+ IPTV channels. One click to your personal M3U subscription link.</p>
        <div class="sub-value-player-hint" id="bannerPlayerHint">VLC • APTV • TVBox • Tivimate • Televizo • GSE Smart IPTV</div>
      </div>
      <a href="/login#register" class="sub-value-cta" id="bannerCta">Get Free VIP →</a>
    </div>
  </div>

  <script>
    // 
    (function() {
      //  Cookie  localStorage（Cookie  HttpOnly， localStorage）
      var cookieCheck = document.cookie.split('; ').find(function(row) { return row.startsWith('auth_token='); });
      var localStorageCheck = localStorage.getItem('auth_token');
      var isLoggedIn = !!cookieCheck || !!localStorageCheck;
      
      if (isLoggedIn) {
        // ：VIP
        document.getElementById('bannerEyebrow').textContent = '🔥 VIP Exclusive Offer';
        document.getElementById('bannerTitle').innerHTML = 'Unlock All Features<br><span>Enjoy 5000+ Channels</span>';
        document.getElementById('bannerDesc').textContent = 'Upgrade to VIP for unlimited searches, downloads, multi-device sync, and priority support.';
        document.getElementById('bannerCta').href = '/subscription';
        document.getElementById('bannerCta').textContent = 'Upgrade to VIP Now →';
      }
    })();
  </script>

  <!-- Promo Banner - Clean minimalist style -->
  <div class="promo-banner" id="promoBanner">
    <div class="promo-banner-inner">
      <div class="promo-countdown-box">
        <div class="promo-countdown-numbers" id="promoCountdown">00 : 00 : 00 : 00</div>
      </div>
      <div class="promo-banner-content">
        <span class="promo-headline" id="promoTitle">Premium service, limited time offer!</span>
      </div>
      <a href="/subscription" class="promo-cta">Learn More</a>
    </div>
  </div>

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
      <a href="/carplay-aptv" class="topic-card">
        <span class="topic-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M7 2h10"/><circle cx="12" cy="12" r="3"/></svg></span>
        <span class="topic-title">APTV & CarPlay</span>
        <span class="topic-desc">iOS CarPlay TV</span>
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

    <!-- View Mode Toggle -->
    <div class="view-toggle">
      <button class="view-toggle-btn active" data-view="region" onclick="window.switchView('region')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
        By Region
      </button>
      <button class="view-toggle-btn" data-view="type" onclick="window.switchView('type')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        By Type
      </button>
    </div>

    <script>
      // Attach click handlers after DOM is ready
      document.addEventListener('DOMContentLoaded', function() {
        const btns = document.querySelectorAll('.view-toggle-btn');
        btns.forEach(btn => {
          btn.addEventListener('click', function() {
            if (window.switchView) {
              window.switchView(this.dataset.view);
            }
          });
        });
      });
    </script>

    <!-- Region-based Categories (default view) -->
    <div class="category-grid" id="regionGrid">
      ${regionGridHtml}
    </div>

    <!-- Type-based Categories (hidden by default) -->
    <div class="type-grid" id="typeGrid" style="display: none;">
      ${typeGridHtml}
    </div>
  </section>

  ${pageFooter}

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

    // Store home data globally for view switching
    let homeData = null;
    let currentView = 'region';

    // Render region-based categories (skip if SSR already populated)
    function renderRegionCategories(data) {
      const regionGrid = document.getElementById('regionGrid');
      // Already rendered by SSR, only update if empty
      if (regionGrid.querySelector('p')) {
        const categories = data.data?.regionCategories || [];
        if (categories.length > 0) {
          const origin = homeData._origin;
          regionGrid.innerHTML = categories.map(cat => {
            const slug = encodeURIComponent(cat.slug);
            return '<a href="' + origin + '/category/' + slug + '" class="category-card">' +
              '<div class="category-icon">' + (cat.icon || '') + '</div>' +
              '<div class="category-name">' + cat.name + '</div>' +
              '<div class="category-count">' + cat.count + ' channels</div>' +
            '</a>';
          }).join('');
        }
      }
    }

    // Render type-based categories (skip if SSR already populated)
    function renderTypeCategories(data) {
      const typeGrid = document.getElementById('typeGrid');
      // Already rendered by SSR, only update if empty
      if (typeGrid.querySelector('p')) {
        const types = data.data?.typeCategories || [];
        if (types.length > 0) {
          const origin = data._origin;
          typeGrid.innerHTML = types.map(t => {
            const slug = encodeURIComponent(t.slug);
            return '<a href="' + origin + '/type/' + slug + '" class="type-card">' +
              '<div class="type-icon">' + (t.icon || '') + '</div>' +
              '<div class="type-name">' + t.name + '</div>' +
              '<div class="type-count">' + t.count + ' channels</div>' +
            '</a>';
          }).join('');
        }
      }
    }

    // Load home data from API
    async function loadHomeData() {
      try {
        const origin = '${origin}';
        const response = await fetch(origin + '/api/home');
        const data = await response.json();

        // Attach origin for URL generation
        data._origin = origin;
        homeData = data;

        // Update stats
        document.getElementById('totalChannels').textContent =
          (data.data?.totalChannels >= 10000 ? '10,000+' : (data.data?.totalChannels || 0).toLocaleString());
        document.getElementById('totalGroups').textContent =
          (data.data?.totalGroups >= 100 ? '100+' : data.data?.totalGroups || 0);

        // Render region categories (default view)
        renderRegionCategories(data);

      } catch (error) {
        console.error('Failed to load home data:', error);
        document.getElementById('categoryGrid').innerHTML = 
          '<p class="loading">Failed to load categories. Please refresh the page.</p>';
      }
    }

    loadHomeData();

    // Favorites popup - show if user has favorites
    (function() {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favorites.length > 0 && !sessionStorage.getItem('favoritesPopupShown')) {
        setTimeout(() => showFavoritesPopup(favorites), 1500);
        sessionStorage.setItem('favoritesPopupShown', 'true');
      }
    })();

    function showFavoritesPopup(favorites) {
      const modal = document.getElementById('favoritesPopup');
      const list = document.getElementById('favoritesList');
      if (!modal || !list) return;

      list.innerHTML = favorites.slice(0, 5).map(fav => 
        '<div class="fav-item">' +
          '<span class="fav-name">' + fav.name + '</span>' +
          '<span class="fav-group">' + fav.group + '</span>' +
        '</div>'
      ).join('') + (favorites.length > 5 ? '<div class="fav-more">+' + (favorites.length - 5) + ' more...</div>' : '');

      modal.style.display = 'flex';
    }

    function closeFavoritesPopup() {
      document.getElementById('favoritesPopup').style.display = 'none';
    }

    function shareFavorites() {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favorites.length === 0) {
        alert('No favorites to share!');
        return;
      }
      const text = 'My IPTV Favorites: ' + favorites.map(f => f.name).join(', ');
      if (navigator.share) {
        navigator.share({ title: 'My IPTV Favorites', text: text, url: window.location.origin + '/favorites' });
      } else {
        navigator.clipboard.writeText(text + '\n' + window.location.origin + '/favorites');
        alert('Favorites copied to clipboard!');
      }
    }
  </script>

  <!-- Favorites Popup Modal -->
  <div id="favoritesModal" class="favorites-modal" style="display:none;">
    <div class="fav-modal-content">
      <div class="fav-modal-header">
        <h3><span>★</span> Favorites</h3>
        <button class="fav-close" onclick="closeFavoritesPopup()">×</button>
      </div>
      <div class="fav-modal-list" id="favoritesList"></div>
      <div class="fav-modal-actions">
        <a href="/favorites" class="fav-btn fav-btn-primary">View All</a>
        <button class="fav-btn fav-btn-secondary" onclick="shareFavorites()">Share</button>
      </div>
    </div>
  </div>

  <style>
  /* Favorites Modal - centered modal, minimal style */
    .favorites-modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.7);
      animation: fadeIn 0.2s;
    }
    .fav-modal-content {
      background: var(--bg-secondary);
      border: var(--border);
      padding: 1.5rem;
      max-width: 400px;
      width: 90%;
    }
    .fav-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 1rem;
    }
    .fav-modal-header h3 { font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
    .fav-modal-header h3 span { color: var(--accent); }
    .fav-close {
      background: none; border: none; font-size: 1.5rem;
      color: var(--text-muted); cursor: pointer; line-height: 1;
    }
    .fav-modal-list { margin-bottom: 1rem; max-height: 240px; overflow-y: auto; }
    .fav-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.5rem 0.75rem; border-bottom: var(--border);
    }
    .fav-item:last-child { border-bottom: none; }
    .fav-name { font-size: 0.9rem; color: var(--text-primary); }
    .fav-group { font-size: 0.8rem; color: var(--text-muted); }
    .fav-more { text-align: center; font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem; }
    .fav-modal-actions { display: flex; gap: 0.75rem; }
    .fav-btn {
      flex: 1; padding: 0.6rem; font-size: 0.85rem; font-weight: 500;
      text-align: center; cursor: pointer; text-decoration: none; transition: all 0.2s;
    }
    .fav-btn-primary { background: var(--accent); color: #fff; border: none; }
    .fav-btn-primary:hover { background: var(--accent-hover); }
    .fav-btn-secondary { background: transparent; border: var(--border); color: var(--text-primary); }
    .fav-btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @media (max-width: 480px) {
      .fav-modal-content { padding: 1rem; }
      .fav-modal-actions { flex-direction: column; }
    }
  </style>
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
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initTranslate); } else { initTranslate(); }</script>
</body>
</html>`;
}