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
  <title>Free IPTV Search - 8000+ Channels from 150+ Countries</title>
  <meta name="description" content="Search 8000+ free IPTV channels from 150+ countries. Browse live TV by region including USA, UK, China, Brazil. No registration. Updated daily.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${origin}/">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">
  <meta name="theme-color" content="#e50914">
  <meta property="og:title" content="iptvsearch - Free IPTV Search Engine | 8000+ Live TV Channels">
  <meta property="og:description" content="Find any IPTV channel instantly. Search live sports, movies, news. Updated daily. No signup required.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/">
  <meta property="og:locale" content="en">
  <meta property="og:image" content="${origin}/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${origin}/og-image.svg">
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
    "@type": "Organization",
    "name": "IPTV Search",
    "url": "${origin}",
    "logo": "${origin}/favicon.svg",
    "description": "Free IPTV Channel Directory and Search Engine with 8,000+ live TV channels from 150+ countries."
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
      {"@type": "Question", "name": "What are the subscription plans?", "acceptedAnswer": {"@type": "Answer", "text": "We offer free basic access with ads. Premium subscription removes ads, provides HD/4K quality, and allows simultaneous connections. Visit our /subscription page for current pricing."}},
      {"@type": "Question", "name": "Why is my channel not playing?", "acceptedAnswer": {"@type": "Answer", "text": "If a channel won't play, try: 1) Refresh the page, 2) Use a different player, 3) Check your internet connection, 4) Try a different channel. Some links may be temporary."}},
      {"@type": "Question", "name": "Do you offer technical support?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, premium subscribers get 24/7 technical support. Free users can find help in our tutorial section and FAQ."}},
      {"@type": "Question", "name": "How often are channels updated?", "acceptedAnswer": {"@type": "Answer", "text": "We update our channel database daily. Dead links are removed and new channels are added regularly to maintain quality."}},
      {"@type": "Question", "name": "Can I record live TV?", "acceptedAnswer": {"@type": "Answer", "text": "Recording functionality is not available on our free service. Some third-party players support DVR features for IPTV streams."}},
      {"@type": "Question", "name": "What countries channels are available?", "acceptedAnswer": {"@type": "Answer", "text": "We have channels from 150+ countries including USA, UK, Canada, Australia, India, China, Brazil, and many more. Browse by category or country on our homepage."}}
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popular IPTV Topics",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "USA IPTV", "url": "${origin}/usa-iptv" },
      { "@type": "ListItem", "position": 2, "name": "UK IPTV", "url": "${origin}/uk-iptv-plans" },
      { "@type": "ListItem", "position": 3, "name": "Smart TV Setup", "url": "${origin}/tutorial" },
      { "@type": "ListItem", "position": 4, "name": "Android IPTV Apps", "url": "${origin}/android-iptv-app" },
      { "@type": "ListItem", "position": 5, "name": "Free IPTV App Reviews", "url": "${origin}/free-iptv-app-review" },
      { "@type": "ListItem", "position": 6, "name": "APTV & CarPlay", "url": "${origin}/carplay-aptv" }
    ]
  }
  </script>

  <script>
    
  </script>
  
  <style>
    /* ============================================================
       Design tokens (Proposal A — immersive / cinematic)
       ============================================================ */
    :root {
      --accent: #e50914;
      --accent-hover: #ff1a1a;
      --accent-glow: rgba(229, 9, 20, 0.6);
      --accent-subtle: rgba(229, 9, 20, 0.08);
      --accent-mid: rgba(229, 9, 20, 0.3);
      --bg-primary: #0a0a0a;
      --bg-deep: #050505;
      --bg-secondary: #0f0f0f;
      --bg-card: rgba(255, 255, 255, 0.03);
      --bg-card-hover: rgba(255, 255, 255, 0.06);
      --text-primary: #ffffff;
      --text-secondary: rgba(255, 255, 255, 0.7);
      --text-muted: rgba(255, 255, 255, 0.4);
      --border: 1px solid rgba(255, 255, 255, 0.08);
      --border-glow: 1px solid rgba(229, 9, 20, 0.3);
      --radius-lg: 12px;
      --radius-md: 8px;
      --radius-sm: 4px;
      --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      --transition-slow: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-padding-top: 70px; scroll-behavior: smooth; }
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-deep);
      color: var(--text-primary);
      line-height: 1.6;
      overflow-x: hidden;
    }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: inherit; }

    /* ============================================================
       Scroll-reveal system
       ============================================================ */
    @media (prefers-reduced-motion: no-preference) {
      .reveal {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }
    /* Default: visible (crawlers + reduced-motion users see content immediately) */
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-left {
      opacity: 0;
      transform: translateX(-60px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }
    .reveal-scale {
      opacity: 0;
      transform: scale(0.92);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .reveal-scale.visible { opacity: 1; transform: scale(1); }

    .stagger-1 { transition-delay: 0.05s !important; }
    .stagger-2 { transition-delay: 0.10s !important; }
    .stagger-3 { transition-delay: 0.15s !important; }
    .stagger-4 { transition-delay: 0.20s !important; }
    .stagger-5 { transition-delay: 0.25s !important; }
    .stagger-6 { transition-delay: 0.30s !important; }
    .stagger-7 { transition-delay: 0.35s !important; }
    .stagger-8 { transition-delay: 0.40s !important; }

    @media (prefers-reduced-motion: reduce) {
      .reveal, .reveal-left, .reveal-scale { transition-duration: 0.01ms !important; }
    }

    /* ============================================================
       HERO — full-bleed cinematic
       ============================================================ */
    .hero {
      position: relative;
      min-height: 82vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 0;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      background:
        radial-gradient(ellipse 80% 60% at 50% 40%, rgba(229, 9, 20, 0.12) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 20% 80%, rgba(229, 9, 20, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse 40% 30% at 80% 20%, rgba(200, 8, 18, 0.05) 0%, transparent 50%),
        linear-gradient(180deg, #080808 0%, #0a0a0a 50%, #050505 100%);
    }
    .hero-bg::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.008) 2px,
        rgba(255,255,255,0.008) 4px
      );
      pointer-events: none;
    }
    .hero-bg::after {
      content: '';
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 400px;
      background: radial-gradient(ellipse, rgba(229,9,20,0.15) 0%, transparent 70%);
      animation: ambientPulse 6s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes ambientPulse {
      0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
      50% { opacity: 1; transform: translateX(-50%) scale(1.15); }
    }
    .hero-particles {
      position: absolute;
      inset: 0;
      z-index: 1;
      overflow: hidden;
      pointer-events: none;
    }
    .particle {
      position: absolute;
      width: 2px;
      height: 2px;
      background: var(--accent);
      border-radius: 50%;
      opacity: 0;
      animation: floatParticle linear infinite;
    }
    @keyframes floatParticle {
      0% { opacity: 0; transform: translateY(100vh) scale(0); }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { opacity: 0; transform: translateY(-20px) scale(1); }
    }
    .hero-inner {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 0 2rem;
      max-width: 900px;
    }
    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      background: rgba(229, 9, 20, 0.1);
      border: 1px solid rgba(229, 9, 20, 0.25);
      border-radius: 0;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--accent);
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
    }
    .hero-eyebrow-dot {
      width: 6px;
      height: 6px;
      background: var(--accent);
      border-radius: 50%;
      animation: dotPulse 2s ease-in-out infinite;
    }
    @keyframes dotPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }
    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 900;
      line-height: 1.02;
      letter-spacing: -0.035em;
      color: #fff;
      margin-bottom: 1.25rem;
      text-shadow: 0 0 80px rgba(229, 9, 20, 0.3);
    }
    .hero h1 .accent-line {
      background: linear-gradient(135deg, var(--accent) 0%, #ff6b6b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-sub {
      font-size: clamp(1rem, 1.8vw, 1.2rem);
      color: var(--text-secondary);
      max-width: 560px;
      margin: 0 auto 2.5rem;
      line-height: 1.7;
      font-weight: 300;
    }
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 0;
      flex-wrap: wrap;
    }
    .hero-stat { text-align: center; padding: 0 3rem; position: relative; }
    .hero-stat:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background: rgba(255,255,255,0.08);
    }
    .hero-stat-value {
      font-size: 3.5rem;
      font-weight: 900;
      color: #fff;
      line-height: 1;
      letter-spacing: -0.03em;
      text-shadow: 0 0 60px rgba(255,255,255,0.1);
    }
    .hero-stat-label {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      margin-top: 0.6rem;
      font-weight: 500;
    }
    .hero-social-proof {
      display: inline-block;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      padding: 0.4rem 1rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0;
    }
    .hero-cta-wrap {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2.5rem;
      flex-wrap: wrap;
    }
    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 2rem;
      background: var(--accent);
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      border-radius: 0;
      box-shadow: 0 0 40px rgba(229, 9, 20, 0.4), 0 4px 20px rgba(0,0,0,0.4);
      transition: all var(--transition);
    }
    .hero-cta:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 0 60px rgba(229, 9, 20, 0.5); }
    .hero-cta-arrow { transition: transform 0.2s; }
    .hero-cta:hover .hero-cta-arrow { transform: translateX(4px); }
    .hero-cta-secondary {
      display: inline-flex;
      align-items: center;
      padding: 0.85rem 2rem;
      background: transparent;
      color: #fff;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      border-radius: 0;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all var(--transition);
    }
    .hero-cta-secondary:hover { border-color: #fff; background: rgba(255, 255, 255, 0.06); }
    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      animation: scrollBounce 2.5s ease-in-out infinite;
    }
    .scroll-indicator-line {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, var(--accent), transparent);
      animation: scrollLine 2s ease-in-out infinite;
    }
    @keyframes scrollBounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(6px); }
    }
    @keyframes scrollLine {
      0% { opacity: 0; height: 0; }
      50% { opacity: 1; height: 40px; }
      100% { opacity: 0; height: 40px; }
    }

    /* ============================================================
       Section common
       ============================================================ */
    .section { padding: 5rem 0; position: relative; }
    .section-inner { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
    .section-label {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: var(--accent);
      margin-bottom: 0.75rem;
    }
    .section-title {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.025em;
      line-height: 1.1;
      margin-bottom: 0.5rem;
    }
    .section-desc {
      font-size: 0.95rem;
      color: var(--text-secondary);
      max-width: 500px;
      line-height: 1.6;
    }


    /* ============================================================
       Hot Topics — cinematic cards with hover glow
       ============================================================ */
    .hot-topics {
      background: linear-gradient(180deg, var(--bg-deep) 0%, #0c0000 50%, var(--bg-deep) 100%);
    }
    .hot-topics-header { margin-bottom: 2.5rem; }
    .hot-topics-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1px;
    }
    .topic-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      background: rgba(255,255,255,0.02);
      text-decoration: none;
      overflow: hidden;
      transition: all var(--transition);
      cursor: pointer;
    }
    .topic-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      transition: width 0.4s ease;
    }
    .topic-card:hover::before { width: 80%; }
    .topic-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, rgba(229,9,20,0.08) 0%, transparent 70%);
      opacity: 0;
      transition: opacity var(--transition);
    }
    .topic-card:hover::after { opacity: 1; }
    .topic-card:hover { background: rgba(255,255,255,0.04); }
    .topic-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 0 20px rgba(229,9,20,0.3));
      transition: transform 0.3s ease;
    }
    .topic-card:hover .topic-icon { transform: scale(1.1); }
    .topic-title {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.3rem;
      position: relative;
      z-index: 1;
      letter-spacing: -0.01em;
    }
    .topic-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: center;
      position: relative;
      z-index: 1;
    }

    /* ============================================================
       Regional — map-inspired cards with ambient glow
       ============================================================ */
    .regional-topics { padding: 5rem 0; }
    .regional-topics-header { margin-bottom: 2.5rem; }
    .regional-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1px;
    }
    .regional-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      background: rgba(255,255,255,0.015);
      text-decoration: none;
      overflow: hidden;
      transition: all var(--transition);
      cursor: pointer;
      min-height: 200px;
    }
    .regional-card::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      transform: scaleX(0);
      transition: transform 0.4s ease;
    }
    .regional-card:hover::before { transform: scaleX(1); }
    .regional-card:hover { background: rgba(255,255,255,0.04); }
    .regional-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      position: relative;
      z-index: 1;
      transition: transform 0.4s ease;
    }
    .regional-card:hover .regional-icon { transform: scale(1.15) translateY(-4px); }
    .regional-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.25rem;
      position: relative;
      z-index: 1;
    }
    .regional-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: center;
      position: relative;
      z-index: 1;
    }

    /* ============================================================
       Category Showcase — cinematic grid
       ============================================================ */
    .category-showcase {
      background: linear-gradient(180deg, var(--bg-deep) 0%, #0c0000 30%, var(--bg-deep) 100%);
      padding: 5rem 0;
    }
    .showcase-header { text-align: center; margin-bottom: 3rem; }
    .showcase-header .section-desc { margin: 0.75rem auto 0; }
    .view-toggle {
      display: flex;
      justify-content: center;
      gap: 0;
      margin-bottom: 2.5rem;
    }
    .view-toggle-btn {
      padding: 0.6rem 1.5rem;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.08);
      color: var(--text-muted);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      cursor: pointer;
      transition: all var(--transition);
    }
    .view-toggle-btn:first-child { border-radius: 0; }
    .view-toggle-btn:last-child { border-radius: 0; border-left: none; }
    .view-toggle-btn.active {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .view-toggle-btn:hover:not(.active) {
      color: var(--text-primary);
      border-color: rgba(255,255,255,0.2);
    }
    .view-toggle-btn svg { width: 14px; height: 14px; vertical-align: middle; margin-right: 0.4rem; }

    .category-grid, .type-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 1px;
      background: rgba(255,255,255,0.03);
    }
    .category-card, .type-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 0.75rem;
      background: rgba(5, 5, 5, 0.9);
      text-decoration: none;
      transition: all var(--transition);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      min-height: 140px;
    }
    .category-card::before, .type-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
    .category-card:hover::before, .type-card:hover::before { transform: scaleX(1); }
    .category-card:hover, .type-card:hover { background: rgba(229, 9, 20, 0.06); }
    .category-icon, .type-icon {
      width: 44px;
      height: 44px;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
      font-size: 1.5rem;
      transition: all var(--transition);
      filter: drop-shadow(0 0 8px rgba(229,9,20,0.3));
    }
    .category-card:hover .category-icon,
    .type-card:hover .type-icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 16px rgba(229,9,20,0.6));
    }
    .category-icon svg, .type-icon svg { width: 100%; height: 100%; }
    .category-name, .type-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
      margin-bottom: 0.2rem;
    }
    .category-count, .type-count { font-size: 0.7rem; color: var(--text-muted); }
    .loading { text-align: center; padding: 4rem; color: var(--text-secondary); }


    /* ============================================================
       Responsive
       ============================================================ */
    @media (max-width: 1024px) {
      .hot-topics-grid { grid-template-columns: repeat(3, 1fr); }
      .category-grid, .type-grid { grid-template-columns: repeat(4, 1fr); }
    }
    @media (max-width: 768px) {
      .hero { min-height: 70vh; }
      .hero-inner { padding: 0 1.5rem; }
      .hero-stats { gap: 1.5rem; }
      .hero-stat-value { font-size: 2.5rem; }
      .hero-stat { padding: 0 1.5rem; }
      .section { padding: 3.5rem 0; }
      .section-inner { padding: 0 1.5rem; }
      .hero-stat:not(:last-child)::after { display: none; }
      .hot-topics-grid { grid-template-columns: repeat(3, 1fr); }
      .regional-grid { grid-template-columns: repeat(3, 1fr); }
      .category-grid, .type-grid { grid-template-columns: repeat(4, 1fr); }
    }
    @media (max-width: 480px) {
      .hero h1 { font-size: 2rem; }
      .hero-stats { flex-direction: column; gap: 1.5rem; }
      .hero-stat-value { font-size: 2rem; }
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
    <div class="hero-bg"></div>
    <div class="hero-particles" id="heroParticles"></div>
    <div class="hero-inner">
      <div class="hero-eyebrow reveal stagger-1">
        <span class="hero-eyebrow-dot"></span>
        Live TV &middot; No Signup Required
      </div>
      <h1 class="reveal stagger-2">
        The Largest<br>
        <span class="accent-line">Free IPTV Search</span>
      </h1>
      <p class="hero-social-proof reveal stagger-3">⭐⭐⭐⭐⭐ Trusted by 240,000+ viewers across 150 countries</p>
      <p class="hero-sub reveal stagger-3" style="transition-delay:0.18s">
        Stream 8,000+ live channels from 150+ countries. Sports, movies, news & entertainment. Sports, movies, news &amp; entertainment &mdash; all in one place.
      </p>
      <div class="hero-stats reveal stagger-4">
        <div class="hero-stat">
          <div class="hero-stat-value" id="totalChannels">${totalChannels >= 10000 ? '10,000+' : (totalChannels || 0).toLocaleString()}</div>
          <div class="hero-stat-label">Channels</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value" id="totalGroups">${totalGroups >= 100 ? '100+' : totalGroups}</div>
          <div class="hero-stat-label">Categories</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value">4K</div>
          <div class="hero-stat-label">4K Quality</div>
        </div>
      </div>
      <div class="hero-cta-wrap reveal stagger-5">
        <a href="/subscription" class="hero-cta">Get Free VIP<span class="hero-cta-arrow">→</span></a>
        <a href="#popular-topics" class="hero-cta-secondary">Browse Channels</a>
      </div>
    </div>
    <div class="scroll-indicator">
      <div class="scroll-indicator-line"></div>
      <span>Scroll</span>
    </div>
  </section>





  <section class="section hot-topics" id="popular-topics">
    <div class="section-inner">
      <div class="hot-topics-header">
        <p class="section-label reveal">Featured</p>
        <h2 class="section-title reveal stagger-1">Popular Topics</h2>
        <p class="section-desc reveal stagger-2">Explore curated content by category</p>
      </div>
      <div class="hot-topics-grid">
        <a href="/usa-iptv" class="topic-card reveal stagger-1">
          <span class="topic-icon">🇺🇸</span>
          <span class="topic-title">USA IPTV</span>
          <span class="topic-desc">US Live TV</span>
        </a>
        <a href="/uk-iptv-plans" class="topic-card reveal stagger-2">
          <span class="topic-icon">🇬🇧</span>
          <span class="topic-title">UK IPTV</span>
          <span class="topic-desc">British Channels</span>
        </a>
        <a href="/tutorial" class="topic-card reveal stagger-3">
          <span class="topic-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></span>
          <span class="topic-title">Smart TV</span>
          <span class="topic-desc">Setup Guide</span>
        </a>
        <a href="/android-iptv-app" class="topic-card reveal stagger-4">
          <span class="topic-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M8 6h.01"/><path d="M16 6h.01"/></svg></span>
          <span class="topic-title">Android</span>
          <span class="topic-desc">IPTV Apps</span>
        </a>
        <a href="/free-iptv-app-review" class="topic-card reveal stagger-5">
          <span class="topic-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></span>
          <span class="topic-title">Free IPTV</span>
          <span class="topic-desc">App Reviews</span>
        </a>
        <a href="/carplay-aptv" class="topic-card reveal stagger-6">
          <span class="topic-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M7 2h10"/><circle cx="12" cy="12" r="3"/></svg></span>
          <span class="topic-title">APTV & CarPlay</span>
          <span class="topic-desc">iOS CarPlay TV</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section regional-topics">
    <div class="section-inner">
      <div class="regional-topics-header">
        <p class="section-label reveal">Geography</p>
        <h2 class="section-title reveal stagger-1">Explore by Region</h2>
        <p class="section-desc reveal stagger-2">Free IPTV channels from around the world</p>
      </div>
      <div class="regional-grid">
        <a href="/americas-iptv" class="regional-card reveal stagger-1">
          <span class="regional-icon">🌎</span>
          <span class="regional-title">Americas</span>
          <span class="regional-desc">USA, Canada, Brazil</span>
        </a>
        <a href="/europe-iptv" class="regional-card reveal stagger-2">
          <span class="regional-icon">🌍</span>
          <span class="regional-title">Europe</span>
          <span class="regional-desc">UK, France, Germany</span>
        </a>
        <a href="/asia-iptv" class="regional-card reveal stagger-3">
          <span class="regional-icon">🌏</span>
          <span class="regional-title">Asia</span>
          <span class="regional-desc">China, Japan, Korea</span>
        </a>
        <a href="/middle-east-iptv" class="regional-card reveal stagger-4">
          <span class="regional-icon">🕌</span>
          <span class="regional-title">Middle East</span>
          <span class="regional-desc">Arabic, Turkish</span>
        </a>
        <a href="/oceania-iptv" class="regional-card reveal stagger-5">
          <span class="regional-icon">🦘</span>
          <span class="regional-title">Oceania</span>
          <span class="regional-desc">Australia, NZ</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section category-showcase">
    <div class="section-inner">
      <div class="showcase-header">
        <p class="section-label reveal" style="text-align:center">Directory</p>
        <h2 class="section-title reveal stagger-1" style="text-align:center">Browse by Category</h2>
        <p class="section-desc reveal stagger-2" style="text-align:center;margin:0.75rem auto 0">Discover thousands of free live TV channels &mdash; CCTV, Sports, Movies, News and more</p>
      </div>

      <!-- View Mode Toggle -->
      <div class="view-toggle reveal stagger-3">
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

      // Hero particle generator
      const particleContainer = document.getElementById('heroParticles');
      if (particleContainer) {
        for (let i = 0; i < 8; i++) {
          const p = document.createElement('div');
          p.className = 'particle';
          p.style.left = Math.random() * 100 + '%';
          p.style.animationDuration = (8 + Math.random() * 12) + 's';
          p.style.animationDelay = (Math.random() * 10) + 's';
          const size = 1 + Math.random() * 2;
          p.style.width = size + 'px';
          p.style.height = size + 'px';
          particleContainer.appendChild(p);
        }
      }
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
        document.getElementById('totalChannels').textContent =
          (data.data?.totalChannels >= 10000 ? '10,000+' : (data.data?.totalChannels || 0).toLocaleString());
        document.getElementById('totalGroups').textContent =
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