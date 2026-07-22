// Search Page - HTML shell that loads data via API
import { PAGE_FOOTER } from '../components/page-footer.js';
import { HEAD_SCRIPTS } from '../components/head-scripts.js';

export function generateSearchPage(options = {}) {
  const { origin = 'https://iptv-search.com', query = '', header = '', footer = '' } = options;
  const pageHeader = header || `<header class="header">...</header>`;
  const pageFooter = footer || `<footer class="page-footer">...</footer>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${query ? `Search ${escapeHtml(query)} IPTV Channels - Free ${escapeHtml(query)} M3U M3U8 Stream Online` : 'IPTV Channel Search - Free M3U M3U8 TV Channels'}</title>
  <meta name="description" content="${query ? `Find free ${escapeHtml(query)} live TV channels online. Search results for ${escapeHtml(query)} - watch IPTV with M3U M3U8 links. No signup required. Compatible with IPTV Smarters Pro, VLC, GSE Smart IPTV, and all players.` : 'Search free IPTV live TV channels online. M3U M3U8 sources for VLC, IPTV Smarters - no signup required.'}">
  <meta name="keywords" content="${query ? `${escapeHtml(query)} IPTV search, search ${escapeHtml(query)} TV channels, find ${escapeHtml(query)} M3U, ${escapeHtml(query)} M3U8, free ${escapeHtml(query)} IPTV, ${escapeHtml(query)} streaming, watch ${escapeHtml(query)} online, IPTV ${escapeHtml(query)} channels` : 'IPTV search, free IPTV search, M3U search, M3U8 search, TV channel search, live streaming search'}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${query ? `Search ${escapeHtml(query)} IPTV Channels - Free ${escapeHtml(query)} Stream` : 'IPTV Channel Search - Free TV Channels'}">
  <meta property="og:description" content="${query ? `Stream free ${escapeHtml(query)} live TV channels. Instant M3U M3U8 links - works with all IPTV players. No registration.` : 'Find free IPTV channels online. Instant M3U M3U8 links for VLC and all IPTV players.'}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${query ? `Search ${escapeHtml(query)} IPTV Channels Free Online` : 'IPTV Channel Search - Free TV Streams'}">
  <meta name="twitter:description" content="${query ? `Stream free ${escapeHtml(query)} live TV. M3U M3U8 links for all IPTV players.` : 'Find and watch free IPTV channels. M3U M3U8 links for VLC and more.'}">

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
    html { scroll-padding-top: 60px; }
    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
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

    .main-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .search-results-header { margin-bottom: 2rem; }
    .search-results-header h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .search-results-header p { color: var(--text-secondary); font-size: 1rem; }
    .search-results-header strong { color: var(--accent); }

    .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
    .channel-card {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
      overflow: hidden; transition: all var(--transition); cursor: pointer; position: relative;
    }
    .channel-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow); }
    .channel-poster { aspect-ratio: 16/10; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .channel-poster img { width: 100%; height: 100%; object-fit: contain; padding: 1rem; }
    .channel-poster .placeholder { font-size: 3rem; opacity: 0.3; }
    .channel-info { padding: 0.75rem; }
    .channel-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .channel-group { font-size: 0.75rem; color: var(--text-muted); }

    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-state-icon { font-size: 4rem; opacity: 0.3; margin-bottom: 1rem; }
    .empty-state h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .empty-state .category-list { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 1.5rem; }
    .empty-state .category-tag {
      display: inline-block; padding: 0.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 20px; font-size: 0.85rem; color: var(--text-secondary); transition: all var(--transition);
    }
    .empty-state .category-tag:hover { background: var(--bg-hover); color: var(--accent); border-color: var(--accent); }

    .search-tips { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem; }
    .search-tips h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary); }
    .search-tips ul { list-style: none; color: var(--text-secondary); }
    .search-tips li { margin-bottom: 0.25rem; padding-left: 1.5rem; position: relative; }
    .search-tips li::before { content: '💡'; position: absolute; left: 0; }
    .search-tips code { background: var(--bg-secondary); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.8rem; color: var(--accent); }

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
    .loading-spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .skeleton-loader {
      background: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-hover) 50%, var(--bg-card) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius);
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .channel-grid.loading-state {
      opacity: 0.6;
      pointer-events: none;
    }

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
      .main-container { padding: 1rem; }
      .channel-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
    }
    @media (max-width: 480px) {
      .logo-text { display: none; }
      .channel-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
    }
  </style>
</head>
<body>
  ${pageHeader}

  <main class="main-container">
    <div class="search-results-header">
      <h1>🔍 Search Results</h1>
      <p id="resultText">Loading...</p>
    </div>

    <div id="searchTips" class="search-tips" style="display: none;">
      <h3>✨ Smart Search Tips</h3>
      <ul>
        <li>Search in <code>Pinyin</code> like <code>YANGZI</code> for 央视 Yangtze River</li>
        <li>Use synonyms like <code>CCTV</code> or <code>Phoenix</code></li>
        <li>Try both Chinese and English names</li>
      </ul>
    </div>

    <div id="resultsContainer">
      <div class="loading">
        <div class="loading-spinner"></div>
        <div>Searching channels...</div>
      </div>
    </div>
  </main>

  ${pageFooter}

  <!-- Static base JSON-LD (SSR) -->
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
  <script id="json-ld" type="application/ld+json"></script>

  <script>
    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    // Slugify function for SEO-friendly URLs
    function slugify(str) {
      if (!str) return '';
      return str.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    }

    // Build SEO-friendly channel URL (pure slug, no hash)
    function buildChannelUrl(name) {
      return '/channel/' + slugify(name);
    }

    // Theme toggle with icon update
    function updateThemeIcons(isDark) {
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = isDark ? 'none' : 'block';
        moon.style.display = isDark ? 'block' : 'none';
      }
    }
    
    // Initialize theme icons on page load
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved ? saved === 'dark' : prefersDark;
      updateThemeIcons(isDark);
    })();
    
    document.getElementById('themeToggle')?.addEventListener('click', function() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcons(next === 'dark');
    });

    // Load search results from API
    async function loadSearchResults() {
      const url = new URL(window.location.href);
      const query = url.searchParams.get('q') || '';
      const origin = '${origin}';
      const resultsContainer = document.getElementById('resultsContainer');
      const resultText = document.getElementById('resultText');

      if (!query) {
        resultText.innerHTML = 'Enter a search term to find channels';
        resultsContainer.innerHTML = '';
        return;
      }

      try {
        const response = await fetch(origin + '/api/search?q=' + encodeURIComponent(query));
        const data = await response.json();
        const results = data.data?.results || [];
        const totalResults = data.data?.totalResults || 0;

        resultText.innerHTML = totalResults > 0
          ? 'Found <strong>' + totalResults + '</strong> channels for "<strong>' + escapeHtml(query) + '</strong>"'
          : 'No channels found for "<strong>' + escapeHtml(query) + '</strong>"';

        if (results.length > 0) {
          resultsContainer.innerHTML = '<div class="channel-grid">' + results.map(ch => {
            const logoHtml = ch.logo ? '<img src="' + escapeHtml(ch.logo) + '" alt="' + escapeHtml(ch.name) + '">' : '<div class="placeholder">📺</div>';
            const channelUrl = '/channel/' + (ch.slug || slugify(ch.name));  // 使用API返回的slug
            return '<a href="' + origin + channelUrl + '" class="channel-card">' +
              '<div class="channel-poster">' + logoHtml + '</div>' +
              '<div class="channel-info">' +
                '<div class="channel-name">' + escapeHtml(ch.name) + '</div>' +
                '<div class="channel-group">' + escapeHtml(ch.group || 'Other') + '</div>' +
              '</div>' +
            '</a>';
          }).join('') + '</div>';

          // Hide tips if we have results
          document.getElementById('searchTips').style.display = 'none';

          // Inject JSON-LD
          const jsonLd = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "numberOfItems": totalResults,
            "itemListElement": results.slice(0, 10).map((ch, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": ch.name,
              "url": origin + '/channel/' + (ch.slug || slugify(ch.name))
            }))
          };
          document.getElementById('json-ld').textContent = JSON.stringify(jsonLd);
        } else {
          // Show search tips when no results
          document.getElementById('searchTips').style.display = 'block';
          
          // Use suggested categories from API (randomly selected from available groups)
          const suggestedCategories = data.data?.suggestedCategories || [];
          let categoryLinks;
          
          if (suggestedCategories.length > 0) {
            categoryLinks = suggestedCategories.map(c => '<a href="' + origin + '/category/' + encodeURIComponent(c.slug) + '" class="category-tag">' + escapeHtml(c.name) + '</a>').join('');
          } else {
            // Fallback to hardcoded categories only if API returns none (e.g., no groups available)
            categoryLinks = [
              { name: '央视', slug: '央视' },
              { name: '体育', slug: '体育' },
              { name: '电影', slug: '电影' }
            ].map(c => '<a href="' + origin + '/category/' + encodeURIComponent(c.slug) + '" class="category-tag">' + c.name + '</a>').join('');
          }
          
          resultsContainer.innerHTML = 
            '<div class="empty-state">' +
              '<div class="empty-state-icon">📺</div>' +
              '<h2>No channels found</h2>' +
              '<p>Try a different search term or browse by category</p>' +
              '<div class="category-list">' + categoryLinks + '</div>' +
            '</div>';
        }
      } catch (error) {
        console.error('Search failed:', error);
        resultText.innerHTML = 'Search failed. Please try again.';
        resultsContainer.innerHTML = '';
      }
    }

    loadSearchResults();
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

// HTML escape helper for use in template
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}