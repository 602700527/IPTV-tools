// Home Page - HTML shell that loads data via API
// This page is rendered on the client side via JavaScript
import { HEAD_SCRIPTS } from '../components/head-scripts.js';

// HTML 转义函数
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

  // 如果传入了header和footer，直接使用；否则使用内嵌的
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
  <title>IPTV Search &mdash; Free Channel Directory &amp; 海外电视直播 (2026)</title>
  <meta name="description" content="Search ${totalChannels.toLocaleString()}+ free IPTV channels worldwide. Live sports, news &amp; 海外电视直播 (Chinese overseas TV). Browse by country or category — no signup required. Updated daily.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${origin}/">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">
  <meta name="theme-color" content="#e50914">
  <meta property="og:title" content="IPTV Search &mdash; Free Channel Directory &amp; 海外电视直播 (2026)">
  <meta property="og:description" content="Search ${totalChannels.toLocaleString()}+ free IPTV channels worldwide. Live sports, news &amp; 海外电视直播 (Chinese overseas TV). Browse by country or category — no signup required. Updated daily.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/">
  <meta property="og:locale" content="en">
  <meta property="og:image" content="${origin}/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${origin}/og-image.svg">
  <meta name="twitter:title" content="IPTV Search &mdash; Free Channel Directory &amp; 海外电视直播 (2026)">
  <meta name="twitter:description" content="Search ${totalChannels.toLocaleString()}+ free IPTV channels worldwide. Live sports, news &amp; 海外电视直播 (Chinese overseas TV). Browse by country or category — no signup required. Updated daily.">




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
    "@type": "Organization",
    "name": "IPTV Search",
    "url": "${origin}",
    "logo": "${origin}/favicon.svg",
    "description": "Free IPTV Channel Directory and Search Engine with ${totalChannels.toLocaleString()}+ live TV channels. Free IPTV search, 海外电视直播 for Chinese overseas."
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "How can I watch IPTV channels for free?", "acceptedAnswer": {"@type": "Answer", "text": "IPTV Search provides free access to watch live TV channels. Simply browse our directory, select a channel, and start watching. No registration or subscription required for basic access."}},
      {"@type": "Question", "name": "What devices support IPTV streaming?", "acceptedAnswer": {"@type": "Answer", "text": "Our IPTV streams work on most devices including Smart TVs (Samsung, LG, Sony), streaming devices (Roku, Firestick, Apple TV), computers, smartphones, and tablets. Use VLC player or any IPTV-compatible app."}},
      {"@type": "Question", "name": "How many channels are available?", "acceptedAnswer": {"@type": "Answer", "text": "We offer ${totalChannels.toLocaleString()}+ live TV channels from around the world, covering news, sports, entertainment, movies, and more. New channels are added regularly."}},
      {"@type": "Question", "name": "Is IPTV legal?", "acceptedAnswer": {"@type": "Answer", "text": "IPTV Search only indexes publicly available streaming links. We do not host or produce any content. Users are responsible for ensuring compliance with their local laws and the content provider's terms of service."}},
      {"@type": "Question", "name": "What are the subscription plans?", "acceptedAnswer": {"@type": "Answer", "text": "We offer free basic access with ads. Premium subscription removes ads, provides HD/4K quality, and allows simultaneous connections. Visit our /subscription page for current pricing."}},
      {"@type": "Question", "name": "Why is my channel not playing?", "acceptedAnswer": {"@type": "Answer", "text": "If a channel won't play, try: 1) Refresh the page, 2) Use a different player, 3) Check your internet connection, 4) Try a different channel. Some links may be temporary."}},
      {"@type": "Question", "name": "Do you offer technical support?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, premium subscribers get 24/7 technical support. Free users can find help in our tutorial section and FAQ."}},
      {"@type": "Question", "name": "How often are channels updated?", "acceptedAnswer": {"@type": "Answer", "text": "We update our channel database daily. Dead links are removed and new channels are added regularly to maintain quality."}},
      {"@type": "Question", "name": "Can I record live TV?", "acceptedAnswer": {"@type": "Answer", "text": "Recording functionality is not available on our free service. Some third-party players support DVR features for IPTV streams."}},
      {"@type": "Question", "name": "What countries channels are available?", "acceptedAnswer": {"@type": "Answer", "text": "We have channels from 150+ countries including USA, UK, Canada, Australia, India, China, Brazil, and many more. Special selection of 海外电视直播 (Chinese overseas TV) for 海外华人. Browse by category or country on our homepage."}}
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popular IPTV Topics",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "USA IPTV Channels", "description": "800+ American live TV channels including CNN, ESPN, HBO, NBC, Fox", "url": "${origin}/usa-iptv" },
      { "@type": "ListItem", "position": 2, "name": "UK IPTV Channels", "description": "British live TV including BBC, ITV, Sky Sports, Channel 4", "url": "${origin}/uk-iptv-plans" },
      { "@type": "ListItem", "position": 3, "name": "Smart TV IPTV Setup", "description": "How to watch IPTV on Samsung, LG, Sony Smart TVs step by step", "url": "${origin}/tutorial" },
      { "@type": "ListItem", "position": 4, "name": "Android IPTV Apps", "description": "Best IPTV player apps for Android phones, tablets, and TV boxes", "url": "${origin}/android-iptv-app" },
      { "@type": "ListItem", "position": 5, "name": "Free IPTV App Reviews", "description": "Reviewed free IPTV apps for Firestick, Android, iOS, and Smart TV", "url": "${origin}/free-iptv-app-review" },
      { "@type": "ListItem", "position": 6, "name": "APTV & CarPlay IPTV", "description": "Watch IPTV on Apple TV and CarPlay while driving", "url": "${origin}/carplay-aptv" }
    ]
  }
  </script>

  <script>
    
  </script>
  
<style>
    /* ============================================================
       DESIGN PROPOSAL B — DATA / TECH
       "Information density meets precision"
       Aesthetic: Linear / Vercel / Stripe dashboard
       ============================================================ */
    :root {
      --accent: #e50914;
      --accent-dim: rgba(229, 9, 20, 0.08);
      --accent-border: rgba(229, 9, 20, 0.25);
      --bg-primary: #0a0a0a;
      --bg-secondary: #0f0f0f;
      --bg-elevated: #141414;
      --text-primary: #ffffff;
      --text-secondary: #a0a0a0;
      --text-muted: #555555;
      --text-label: #71717a;
      --border: 1px solid rgba(255, 255, 255, 0.06);
      --border-strong: 1px solid rgba(255, 255, 255, 0.12);
      --mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
      --sans: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      --transition: 0.15s ease;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-padding-top: 70px; scroll-behavior: smooth; }
    body {
      font-family: var(--sans);
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
    }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: inherit; }

    /* Scroll-reveal (motion-safe so crawlers see content) */
    .reveal { opacity: 1; transform: none; transition: opacity 0.5s ease, transform 0.5s ease; }
    @media (prefers-reduced-motion: no-preference) {
      .reveal { opacity: 0; transform: translateY(20px); }
      .reveal.visible { opacity: 1; transform: translateY(0); }
    }
    .stagger-1 { transition-delay: 0.04s !important; }
    .stagger-2 { transition-delay: 0.08s !important; }
    .stagger-3 { transition-delay: 0.12s !important; }
    .stagger-4 { transition-delay: 0.16s !important; }
    .stagger-5 { transition-delay: 0.20s !important; }
    .stagger-6 { transition-delay: 0.24s !important; }
    .stagger-7 { transition-delay: 0.28s !important; }
    .stagger-8 { transition-delay: 0.32s !important; }

    /* ============================================================
       HERO — Data dashboard
       ============================================================ */
    .hero {
      position: relative;
      padding: 2.5rem 0 2rem;
      border-bottom: var(--border);
      overflow: hidden;
    }
    .hero::after {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 50%;
      height: 200%;
      background: linear-gradient(135deg, transparent 40%, rgba(229,9,20,0.04) 50%, transparent 60%);
      pointer-events: none;
    }
    .hero-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      position: relative;
      z-index: 1;
    }
    .hero-statusbar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      padding-bottom: 1.25rem;
      border-bottom: var(--border);
      flex-wrap: wrap;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--mono);
      font-size: 0.65rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-label);
      padding: 0.3rem 0.6rem;
      background: var(--bg-secondary);
      border: var(--border);
      border-radius: 0;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      animation: statusPulse 2s ease-in-out infinite;
    }
    @keyframes statusPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .status-feed {
      font-family: var(--mono);
      font-size: 0.65rem;
      color: var(--text-muted);
      margin-left: auto;
    }
    .status-feed .accent { color: var(--accent); }

    .hero-headline {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .hero h1 {
      font-size: clamp(2rem, 4.5vw, 3.5rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.035em;
      color: var(--text-primary);
    }
    .hero h1 .accent { color: var(--accent); }
    .hero-sub {
      font-size: 0.9rem;
      color: var(--text-secondary);
      max-width: 520px;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .hero-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: var(--border);
      border: var(--border);
      border-radius: 0;
      overflow: hidden;
      margin-bottom: 1.75rem;
    }
    .stat-card {
      background: var(--bg-secondary);
      padding: 1.25rem 1.1rem;
      transition: background var(--transition);
    }
    .stat-card:hover { background: var(--bg-elevated); }
    .stat-label {
      font-family: var(--mono);
      font-size: 0.6rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .stat-value {
      font-family: var(--mono);
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
      letter-spacing: -0.02em;
    }
    .stat-value .unit {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-left: 0.1rem;
    }
    .stat-change {
      font-family: var(--mono);
      font-size: 0.65rem;
      color: #22c55e;
      margin-top: 0.4rem;
    }
    .stat-change.neutral { color: var(--text-muted); }

    .hero-cta-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: var(--mono);
      font-size: 0.78rem;
      flex-wrap: wrap;
    }
    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1.1rem;
      background: var(--accent);
      color: #fff;
      font-family: var(--mono);
      font-weight: 600;
      font-size: 0.78rem;
      text-decoration: none;
      border-radius: 0;
      letter-spacing: 0.02em;
      transition: background var(--transition);
    }
    .hero-cta:hover { background: #ff1a1a; }
    .hero-cta-secondary {
      color: var(--text-muted);
      text-decoration: none;
      transition: color var(--transition);
    }
    .hero-cta-secondary:hover { color: var(--text-primary); }
    .hero-cta-meta {
      color: var(--text-muted);
      font-family: var(--mono);
      font-size: 0.7rem;
    }
    .hero-cta-meta strong { color: #22c55e; font-weight: 600; }

    /* ============================================================
       Section common
       ============================================================ */
    .section {
      padding: 3rem 0;
      border-bottom: var(--border);
    }
    .section-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    .section-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.85rem;
      border-bottom: var(--border);
    }
    .section-label {
      font-family: var(--mono);
      font-size: 0.6rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--accent);
      padding: 0.25rem 0.5rem;
      background: var(--accent-dim);
      border: 1px solid var(--accent-border);
      border-radius: 0;
    }
    .section-title {
      font-size: clamp(1.1rem, 1.8vw, 1.35rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text-primary);
    }
    .section-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
      max-width: 520px;
    }
    .section-count {
      font-family: var(--mono);
      font-size: 0.65rem;
      color: var(--text-muted);
      margin-left: auto;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* ============================================================
       Hot topics
       ============================================================ */
    .hot-topics-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1px;
      background: var(--border);
      border: var(--border);
      border-radius: 0;
      overflow: hidden;
    }
    .topic-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.75rem 0.75rem;
      background: var(--bg-primary);
      text-decoration: none;
      transition: background var(--transition);
      cursor: pointer;
      position: relative;
      min-height: 140px;
    }
    .topic-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: var(--accent);
      transform: scaleX(0);
      transition: transform 0.2s ease;
    }
    .topic-card:hover::before { transform: scaleX(1); }
    .topic-card:hover { background: var(--bg-secondary); }
    .topic-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      margin-bottom: 0.65rem;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }
    .topic-card:hover .topic-icon { color: var(--accent); }
    .topic-card:hover .topic-icon { transform: scale(1.08); }
    .topic-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
      letter-spacing: -0.01em;
    }
    .topic-desc {
      font-family: var(--mono);
      font-size: 0.62rem;
      color: var(--text-muted);
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    @media (max-width: 768px) { .hot-topics-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 480px) { .hot-topics-grid { grid-template-columns: repeat(2, 1fr); } }

    /* ============================================================
       Regional
       ============================================================ */
    .regional-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1px;
      background: var(--border);
      border: var(--border);
      border-radius: 0;
      overflow: hidden;
    }
    .regional-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: var(--bg-primary);
      text-decoration: none;
      transition: background var(--transition);
      cursor: pointer;
      min-height: 160px;
    }
    .regional-card:hover { background: var(--bg-secondary); }
    .regional-card:hover .regional-icon { transform: translateY(-3px); }
    .regional-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      margin-bottom: 0.75rem;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }
    .regional-card:hover .regional-icon { color: var(--accent); }
    .regional-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }
    .regional-desc {
      font-family: var(--mono);
      font-size: 0.62rem;
      color: var(--text-muted);
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    @media (max-width: 768px) { .regional-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 480px) { .regional-grid { grid-template-columns: repeat(2, 1fr); } }

    /* ============================================================
       Category showcase
       ============================================================ */
    .view-toggle {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1.25rem;
    }
    .view-toggle-label {
      font-family: var(--mono);
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .view-toggle-btn {
      padding: 0.4rem 0.9rem;
      background: transparent;
      border: var(--border);
      color: var(--text-muted);
      font-family: var(--mono);
      font-size: 0.7rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition);
      border-radius: 0;
    }
    .view-toggle-btn.active {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .view-toggle-btn:hover:not(.active) {
      color: var(--text-primary);
      border-color: rgba(255,255,255,0.15);
    }
    .view-toggle-btn svg { width: 13px; height: 13px; vertical-align: middle; margin-right: 0.35rem; }
    .category-grid, .type-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 1px;
      background: var(--border);
      border: var(--border);
      border-radius: 0;
      overflow: hidden;
    }
    .category-card, .type-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.4rem 0.5rem;
      background: var(--bg-primary);
      text-decoration: none;
      transition: background var(--transition);
      cursor: pointer;
      min-height: 105px;
    }
    .category-card:hover, .type-card:hover { background: var(--bg-secondary); }
    .category-icon, .type-icon {
      width: 28px;
      height: 28px;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      font-size: 1rem;
      transition: all 0.2s ease;
    }
    .category-card:hover .category-icon,
    .type-card:hover .type-icon { transform: scale(1.12); color: var(--accent); }
    .category-icon svg, .type-icon svg { width: 100%; height: 100%; }
    .category-name, .type-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
      margin-bottom: 0.15rem;
    }
    .category-count, .type-count {
      font-family: var(--mono);
      font-size: 0.6rem;
      color: var(--text-muted);
    }
    .loading { text-align: center; padding: 3rem; color: var(--text-secondary); font-family: var(--mono); }

    /* ============================================================
       Responsive
       ============================================================ */
    @media (max-width: 1024px) {
      .hot-topics-grid { grid-template-columns: repeat(3, 1fr); }
      .category-grid, .type-grid { grid-template-columns: repeat(4, 1fr); }
    }
    @media (max-width: 768px) {
      .hero { padding: 2rem 0 1.5rem; }
      .hero-inner { padding: 0 1rem; }
      .hero-stats-grid { grid-template-columns: repeat(2, 1fr); }
      .hero-statusbar { gap: 0.5rem; }
      .section { padding: 2.25rem 0; }
      .section-inner { padding: 0 1rem; }
    }
    @media (max-width: 480px) {
      .hero-stats-grid { grid-template-columns: 1fr; }
      .hot-topics-grid { grid-template-columns: repeat(2, 1fr); }
      .regional-grid { grid-template-columns: repeat(2, 1fr); }
      .category-grid, .type-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;z-index:99999;">Skip to main content</a>
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

  <section class="hero" id="main-content">
    <div class="hero-inner">
      <div class="hero-statusbar reveal">
        <span class="status-badge"><span class="status-dot"></span> System Online</span>
        <span class="status-badge">Last updated: today</span>
        <span class="status-badge">150+ countries indexed</span>
        <span class="status-badge">Trusted by 240,000+ viewers</span>
        <span class="status-badge">endpoint: /premium</span>
        <span class="status-feed"><span class="accent">&gt;</span> live-feed: active</span>
      </div>
      <div class="hero-headline reveal stagger-1">
        <h1>Free IPTV Channel Directory<br><span class="accent">Worldwide · 海外电视直播</span></h1>
      </div>
      <p class="hero-sub reveal stagger-2">
        Real-time IPTV directory. Search, filter, and stream from 150+ countries. Updated daily. No signup required.
      </p>
      <div class="hero-stats-grid reveal stagger-3">
        <div class="stat-card">
          <div class="stat-label">Total Channels</div>
          <div class="stat-value" id="totalChannels">${totalChannels >= 10000 ? '10,000+' : (totalChannels || 8).toLocaleString()}<span class="unit">+</span></div>
          <div class="stat-change">▲ +120 this week</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Countries</div>
          <div class="stat-value">150<span class="unit">+</span></div>
          <div class="stat-change neutral">global coverage</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Categories</div>
          <div class="stat-value" id="totalGroups">${totalGroups >= 100 ? '100+' : totalGroups}<span class="unit">+</span></div>
          <div class="stat-change">▲ organized</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Quality</div>
          <div class="stat-value">Up to 4K<span class="unit"></span></div>
          <div class="stat-change neutral">● no ads · daily refresh</div>
        </div>
      </div>
      <div class="hero-cta-row reveal stagger-4">
        <a href="/subscription" class="hero-cta">GET_VIP_ACCESS &rarr;</a>
        <span class="hero-cta-meta">from &yen;20/mo &middot; yearly plan <strong>saves 40%</strong></span>
        <a href="#popular-topics" class="hero-cta-secondary">$ browse free IPTV channels</a>
      </div>
    </div>
  </section>

  <section class="section hot-topics" id="popular-topics">
    <div class="section-inner">
      <div class="section-meta reveal">
        <span class="section-label">endpoint: popular</span>
        <h2 class="section-title">Popular Topics</h2>
        <span class="section-count">7 endpoints</span>
      </div>
      <p class="section-desc reveal" style="margin-bottom:1.5rem">Explore curated content by category</p>
      <div class="hot-topics-grid">
        <a href="/usa-iptv" class="topic-card reveal stagger-1">
          <span class="topic-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><path d="M3 7h18M3 11h18M3 15h18M3 19h18"/><rect x="3" y="3" width="8" height="8" fill="currentColor"/></svg></span>
          <span class="topic-title">USA IPTV</span>
          <span class="topic-desc">US Live TV</span>
        </a>
        <a href="/uk-iptv-plans" class="topic-card reveal stagger-2">
          <span class="topic-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><path d="M3 3l18 18M21 3L3 21"/><path d="M12 3v18M3 12h18"/></svg></span>
          <span class="topic-title">UK IPTV</span>
          <span class="topic-desc">British Channels</span>
        </a>
        <a href="/tutorial" class="topic-card reveal stagger-3">
          <span class="topic-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="3" y="4" width="18" height="13"/><path d="M3 9h18"/><path d="M12 17v3"/><path d="M9 20h6"/><path d="M3 3v2M3 3h2"/><path d="M21 3v2M21 3h-2"/><path d="M3 21v-2M3 21h2"/><path d="M21 21v-2M21 21h-2"/><path d="M14 7h4" stroke-dasharray="1 2"/></svg></span>
          <span class="topic-title">Smart TV</span>
          <span class="topic-desc">Setup Guide</span>
        </a>
        <a href="/android-iptv-app" class="topic-card reveal stagger-4">
          <span class="topic-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="6" y="2" width="12" height="20"/><path d="M6 6h12M6 18h12"/><path d="M11 19h2"/><path d="M3 2v2M3 2h2"/><path d="M21 2v2M21 2h-2"/><path d="M3 22v-2M3 22h2"/><path d="M21 22v-2M21 22h-2"/></svg></span>
          <span class="topic-title">Android</span>
          <span class="topic-desc">IPTV Apps</span>
        </a>
        <a href="/free-iptv-app-review" class="topic-card reveal stagger-5">
          <span class="topic-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="2" y="2" width="20" height="20"/><polygon points="10 8 16 12 10 16"/><path d="M2 6v0M22 6v0M2 12v0M22 12v0M2 18v0M22 18v0" stroke-width="1"/></svg></span>
          <span class="topic-title">Free IPTV</span>
          <span class="topic-desc">App Reviews</span>
        </a>
        <a href="/asia-iptv" class="topic-card reveal stagger-7" style="border-color:var(--accent-border);background:var(--accent-dim)">
          <span class="topic-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><path d="M3 7h18M3 11h18M3 15h18M3 19h18"/><circle cx="9" cy="5.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="5.5" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="18.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="18.5" r="1" fill="currentColor" stroke="none"/></svg></span>
          <span class="topic-title">海外华人电视</span>
          <span class="topic-desc">Chinese Overseas TV · CCTV · 凤凰卫视</span>
        </a>
        <a href="/carplay-aptv" class="topic-card reveal stagger-6">
          <span class="topic-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="6" y="2" width="12" height="20"/><circle cx="12" cy="12" r="3"/><path d="M9 5h6M9 19h6"/><path d="M3 2v2M3 2h2"/><path d="M21 2v2M21 2h-2"/><path d="M3 22v-2M3 22h2"/><path d="M21 22v-2M21 22h-2"/></svg></span>
          <span class="topic-title">APTV & CarPlay</span>
          <span class="topic-desc">iOS CarPlay TV</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section regional-topics">
    <div class="section-inner">
      <div class="section-meta reveal">
        <span class="section-label">endpoint: regions</span>
        <h2 class="section-title">Explore by Region</h2>
        <span class="section-count">5 regions</span>
      </div>
      <p class="section-desc reveal" style="margin-bottom:1.5rem">Free IPTV channels from around the world</p>
      <div class="regional-grid">
        <a href="/americas-iptv" class="regional-card reveal stagger-1">
          <span class="regional-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><circle cx="12" cy="12" r="7"/><path d="M5 12h14M12 5v14"/><path d="M12 5c2 2 2 12 0 14M12 5c-2 2-2 12 0 14"/><path d="M2 12h1M21 12h1" stroke-width="1"/><path d="M12 2v1M12 21v1" stroke-width="1"/></svg></span>
          <span class="regional-title">Americas</span>
          <span class="regional-desc">USA, Canada, Brazil</span>
        </a>
        <a href="/europe-iptv" class="regional-card reveal stagger-2">
          <span class="regional-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><circle cx="12" cy="12" r="7"/><path d="M5 12h14M12 5v14"/><path d="M12 5c2 2 2 12 0 14M12 5c-2 2-2 12 0 14"/><path d="M2 12h1M21 12h1" stroke-width="1"/><path d="M12 2v1M12 21v1" stroke-width="1"/></svg></span>
          <span class="regional-title">Europe</span>
          <span class="regional-desc">UK, France, Germany</span>
        </a>
        <a href="/asia-iptv" class="regional-card reveal stagger-3">
          <span class="regional-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><circle cx="12" cy="12" r="7"/><path d="M5 12h14M12 5v14"/><path d="M12 5c2 2 2 12 0 14M12 5c-2 2-2 12 0 14"/><path d="M2 12h1M21 12h1" stroke-width="1"/><path d="M12 2v1M12 21v1" stroke-width="1"/></svg></span>
          <span class="regional-title">Asia</span>
          <span class="regional-desc">China, Japan, Korea</span>
        </a>
        <a href="/middle-east-iptv" class="regional-card reveal stagger-4">
          <span class="regional-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><circle cx="12" cy="12" r="7"/><path d="M5 12h14M12 5v14"/><path d="M12 5c2 2 2 12 0 14M12 5c-2 2-2 12 0 14"/><path d="M2 12h1M21 12h1" stroke-width="1"/><path d="M12 2v1M12 21v1" stroke-width="1"/></svg></span>
          <span class="regional-title">Middle East</span>
          <span class="regional-desc">Arabic, Turkish</span>
        </a>
        <a href="/oceania-iptv" class="regional-card reveal stagger-5">
          <span class="regional-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><circle cx="12" cy="12" r="7"/><path d="M5 12h14M12 5v14"/><path d="M12 5c2 2 2 12 0 14M12 5c-2 2-2 12 0 14"/><path d="M2 12h1M21 12h1" stroke-width="1"/><path d="M12 2v1M12 21v1" stroke-width="1"/></svg></span>
          <span class="regional-title">Oceania</span>
          <span class="regional-desc">Australia, NZ</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section category-showcase">
    <div class="section-inner">
      <div class="section-meta reveal">
        <span class="section-label">endpoint: categories</span>
        <h2 class="section-title">Browse by Category</h2>
        <span class="section-count">8 types loaded</span>
      </div>
      <p class="section-desc reveal" style="margin-bottom:1.25rem">Discover thousands of free live TV channels &mdash; CCTV, Sports, Movies, News and more</p>

      <!-- View Mode Toggle -->
      <div class="view-toggle reveal">
        <span class="view-toggle-label">view mode:</span>
        <button class="view-toggle-btn active" data-view="region" onclick="window.switchView('region')">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="2" y="2" width="20" height="20"/><circle cx="12" cy="12" r="7"/><path d="M5 12h14M12 5v14"/></svg>
          By Region
        </button>
        <button class="view-toggle-btn" data-view="type" onclick="window.switchView('type')">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="2" y="2" width="20" height="20"/><rect x="5" y="5" width="5" height="5"/><rect x="14" y="5" width="5" height="5"/><rect x="5" y="14" width="5" height="5"/><rect x="14" y="14" width="5" height="5"/></svg>
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
    </div>
  </section>

  ${pageFooter}

  <script>
    // ============================================================
    // Scroll-reveal observer + hero particle generator
    // (Proposal A — immersive)
    // ============================================================
    (function setupRevealAndParticles() {
      // Scroll reveal
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      const revealTargets = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
      revealTargets.forEach(el => revealObserver.observe(el));

      // Staggered reveal for SSR-rendered category / type cards
      const cardRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const grid = entry.target;
          const cards = grid.querySelectorAll('.category-card, .type-card');
          cards.forEach((card, i) => {
            card.style.transitionDelay = (0.04 * Math.min(i, 12)) + 's';
            card.classList.add('reveal');
          });
          requestAnimationFrame(() => {
            cards.forEach(card => card.classList.add('visible'));
          });
          cardRevealObserver.unobserve(grid);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.category-grid, .type-grid').forEach(grid => {
        cardRevealObserver.observe(grid);
      });

    })();
  </script>

  <script>
    // Theme toggle with icon update
    
    
    

    

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
        const tcEl = document.getElementById('totalChannels');
        if (tcEl) tcEl.textContent =
          (data.data?.totalChannels >= 10000 ? '10,000+' : (data.data?.totalChannels || 0).toLocaleString());
        const tgEl = document.getElementById('totalGroups');
        if (tgEl) tgEl.textContent =
          (data.data?.totalGroups >= 100 ? '100+' : data.data?.totalGroups || 0);

        // Render region categories (default view)
        renderRegionCategories(data);

      } catch (error) {
        console.error('Failed to load home data:', error);
        const regionGrid = document.getElementById('regionGrid');
        if (regionGrid) {
          regionGrid.innerHTML = '<p class="loading">Failed to load categories. Please refresh the page.</p>';
        }
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
        navigator.clipboard.writeText(text + '\\n' + window.location.origin + '/favorites');
        alert('Favorites copied to clipboard!');
      }
    }
  </script>

  <!-- Favorites Popup Modal -->
  <div id="favoritesModal" class="favorites-modal" style="display:none;">
    <div class="fav-modal-content">
      <div class="fav-modal-header">
        <h3><span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M3 3v3M3 3h3M21 3v3M21 3h-3M3 21v-3M3 21h3M21 21v-3M21 21h-3"/><path d="M12 6l2 5h5l-4 3 1.5 5L12 16l-4.5 3L9 14l-4-3h5z"/></svg></span> Favorites</h3>
        <button class="fav-close" onclick="closeFavoritesPopup()"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M3 3v3M3 3h3M21 3v3M21 3h-3M3 21v-3M3 21h3M21 21v-3M21 21h-3"/><path d="M6 6l12 12M18 6L6 18"/></svg></button>
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
  
    @media (prefers-reduced-motion: reduce) {
      .guest-gift, .gift-icon { animation: none !important; }
      * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
    }</style>
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