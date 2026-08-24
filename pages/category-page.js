// Category Page - HTML shell with server-side rendered content











import { PAGE_HEADER } from '../components/page-header.js';











import { PAGE_FOOTER } from '../components/page-footer.js';











import { HEAD_SCRIPTS } from '../components/head-scripts.js';























export function generateCategoryPage(options = {}) {











  const {











    origin = 'https://iptv-search.com',











    slug = '',











    category = '',











    categories = [],  // Pre-rendered categories array











    channels = [],     // Pre-rendered channels array for current category











    header = PAGE_HEADER











  } = options;























  // Slugify function for SEO-friendly URLs











  function slugify(str) {











    if (!str) return '';











    var ws = String.fromCharCode(9, 10, 11, 12, 13, 32); var reWs = new RegExp('[' + ws + ']+', 'g'); var reKeep = new RegExp('[^a-zA-Z0-9' + String.fromCharCode(0x4e00) + '-' + String.fromCharCode(0x9fff) + String.fromCharCode(0xff00) + '-' + String.fromCharCode(0xffef) + String.fromCharCode(0xfe00) + '-' + String.fromCharCode(0xfeff) + String.fromCharCode(0x3000) + '-' + String.fromCharCode(0x303f) + String.fromCharCode(0x2000) + '-' + String.fromCharCode(0x206f) + String.fromCharCode(0xfe30) + '-' + String.fromCharCode(0xfe4f) + String.fromCharCode(0x2600) + '-' + String.fromCharCode(0x26ff) + '-]', 'g'); var reDash = /-+/g; var reEdge = /^-+|-+$/g; return str.trim().replace(reWs, '-').replace(reKeep, '').replace(reDash, '-').replace(reEdge, '');











  }























  // Build SEO-friendly channel URL (pure slug, no hash)










  function escapeJs(str) {
    if (!str) return '';
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
  }


  function buildChannelUrl(name) {











    return '/channel/' + slugify(name);











  }























  // Build category list HTML











  const categoryListHtml = categories.length > 0 ? categories.map(cat => {











    const isActive = cat.slug === slug ? ' active' : '';











    return '<a href="' + origin + '/category/' + encodeURIComponent(cat.slug) + '" class="category-item' + isActive + '">' +











      '<span class="cat-name">' + escapeHtml(cat.name) + '</span>' +











    '</a>';











  }).join('') : '<div style="padding:1rem;font-size:0.85rem;color:var(--text-muted);">No categories</div>';























  // Build channel list HTML (list view with checkboxes)











  let channelListHtml = '';











  const INITIAL_BATCH = 50;











  if (channels.length > 0) {











    // Only render the first batch in HTML. Remaining channels are generated on-demand











    // via loadMoreChannels() when the user scrolls near the bottom. This prevents











    // the browser from parsing/rendering thousands of DOM nodes on page load.











    channelListHtml = channels.slice(0, INITIAL_BATCH).map((ch, idx) => {











      const logoHtml = ch.logo 











        ? '<img src="' + escapeHtml(ch.logo) + '" alt="' + escapeHtml(ch.name) + '" class="ch-logo">' 











        : '<div class="ch-logo-placeholder">📺</div>';











      return '<div class="channel-row" data-hash="' + escapeHtml(ch.hash) + '" data-name="' + escapeHtml(ch.name) + '" data-logo="' + escapeHtml(ch.logo || '') + '" data-group="' + escapeHtml(ch.group || category) + '">' +











        '<label class="channel-checkbox">' +











          '<input type="checkbox" onchange="updateSelectedCount()">' +











          '<span class="checkmark"></span>' +











        '</label>' +











        '<a href="' + origin + buildChannelUrl(ch.name) + '" class="channel-link">' +











          '<div class="ch-logo">' + logoHtml + '</div>' +











          '<div class="ch-info">' +











            '<div class="ch-name">' + escapeHtml(ch.name) + '</div>' +











            '<div class="ch-group">' + escapeHtml(ch.group || category) + '</div>' +











          '</div>' +











        '</a>' +











        '<button class="btn-favorite" data-hash="' + escapeHtml(ch.hash) + '" onclick="toggleFavorite(this)" title="Add to favorites">' +











          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +











        '</button>' +











      '</div>';











    }).join('');











  } else {











    channelListHtml = '<div class="empty-state"><p>No channels found in this category</p></div>';











  }























  // Generate JSON-LD











  // Build JSON-LD structured data











  // Schema.org CollectionPage + BreadcrumbList + ItemList











  const channelItemList = {











    "@type": "ItemList",











    "name": category + " Channels",











    "description": "List of " + category + " live TV channels available on IPTV Search",











    "numberOfItems": channels.length,











    "itemListElement": channels.slice(0, 50).map((ch, i) => ({











      "@type": "ListItem",











      "position": i + 1,











      "item": {











        "@type": "VideoObject",











        "name": ch.name,











        "url": origin + buildChannelUrl(ch.name),











        "uploadDate": "2024-01-01",











        "thumbnailUrl": ch.logo || (origin + "/og-image.jpg"),











        "description": "Watch " + ch.name + " live from " + (ch.group || category) + " on IPTV Search"











      }











    }))











  };























  const jsonLd = channels.length > 0 ? {











    "@context": "https://schema.org",











    "@type": "CollectionPage",











    "name": category + " Channels",











    "description": "Watch all " + category + " channels live on IPTV Search. Free IPTV streaming.",











    "url": origin + "/category/" + slug,











    "inLanguage": "en",











    "isPartOf": {











      "@type": "WebSite",











      "name": "IPTV Search",











      "url": origin











    },











    "publisher": {











      "@type": "Organization",











      "name": "IPTV Search",











      "url": origin,











      "logo": {











        "@type": "ImageObject",











        "url": origin + "/logo.svg"











      }











    },











    "breadcrumb": {











      "@type": "BreadcrumbList",











      "itemListElement": [











        {"@type": "ListItem", "position": 1, "name": "Home", "item": origin + "/"},











        {"@type": "ListItem", "position": 2, "name": category, "item": origin + "/category/" + slug}











      ]











    },











    "mainEntity": channelItemList











  } : {











    "@context": "https://schema.org",











    "@type": "CollectionPage",











    "name": category + " Channels",











    "description": "IPTV channels from " + category,











    "url": origin + "/category/" + slug,











    "publisher": {











      "@type": "Organization",











      "name": "IPTV Search",











      "url": origin











    }











  };























  return `<!DOCTYPE html>











<html lang="en">











<head>











  ${HEAD_SCRIPTS}











  <meta charset="UTF-8">











  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">
  <meta name="theme-color" content="#e50914">











  <title>${escapeHtml(category)} IPTV Channels - Free Live TV Streams</title>











  <meta name="description" content="Watch free ${escapeHtml(category)} IPTV channels live online. ${escapeHtml(category)} TV streaming - no signup required. Compatible with IPTV Smarters.">











  <meta name="robots" content="index, follow">











  <link rel="canonical" href="${origin}/category/${encodeURIComponent(slug)}">











  <meta property="og:locale" content="en_US">











  <meta property="og:title" content="Watch ${escapeHtml(category)} IPTV Channels - Free ${escapeHtml(category)} Live Stream">











  <meta property="og:description" content="Stream free ${escapeHtml(category)} IPTV channels online. No signup required. Works with IPTV Smarters, VLC, GSE, and all M3U players.">











  <meta property="og:type" content="website">











  <meta property="og:url" content="${origin}/category/${encodeURIComponent(slug)}">











  <meta name="twitter:card" content="summary_large_image">











  <meta name="twitter:title" content="Watch ${escapeHtml(category)} IPTV Channels Free Online">











  <meta name="twitter:description" content="Stream free ${escapeHtml(category)} live TV channels. No signup, no fees. Compatible with all IPTV players.">















































   <script src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"></script>























   <script>











     























     // 初始化 fingerprintJS











     let fpPromise = null;











     function getFingerprint() {











       if (!fpPromise) {











         fpPromise = FingerprintJS.load().then(fp => fp.get()).then(result => result.visitorId);











       }











       return fpPromise;











     }











   </script>











   











   <style>











    :root {











      --bg-primary: #0a0a0a;











      --bg-secondary: #141414;











      --bg-card: #1a1a1a;











      --bg-hover: #252525;











      --text-primary: #ffffff;











      --text-secondary: #a0a0a0;











      --text-muted: #8b8b8b;











      --accent: #e50914;











      --accent-hover: #f6121d;











      --border: rgba(255,255,255,0.08);











      --border-hover: rgba(255,255,255,0.15);











      --shadow: 0 4px 20px rgba(0,0,0,0.5);











      --radius: 8px;











      --transition: 0.2s ease;











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











    .search-box::before { content: '🔍'; position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); font-size: 0.9rem; pointer-events: none; }











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























    .breadcrumb { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none; }











    .breadcrumb::-webkit-scrollbar { display: none; }











    .breadcrumb a { color: var(--accent); display: flex; align-items: center; gap: 0.25rem; }











    .breadcrumb a:hover { text-decoration: underline; }











    .breadcrumb-sep { opacity: 0.5; margin: 0 0.1rem; }











    .breadcrumb-icon { width: 14px; height: 14px; }























        .account-card {
      background: #111111 !important;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--radius);
      gap: 0;
    }
.category-header { max-width: 1400px; margin: 0 auto 0.75rem; padding: 14px 16px; gap: 6px; }











    .category-header h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.35rem; line-height: 1.2; }











    .category-header p { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4; }











    .category-stats { display: flex; gap: 1rem; margin-top: 0.6rem; font-size: 0.8rem; color: var(--text-muted); }











    .category-stats span { display: flex; align-items: center; gap: 0.3rem; }























    .page-layout { display: flex; max-width: 1400px; margin: 0 auto; padding: 0 0 2rem; gap: 1.5rem; }











    .sidebar { width: 220px; flex-shrink: 0; max-height: calc(100vh - 180px); overflow-y: auto; position: sticky; top: 80px; padding: 16px 18px; }











    .sidebar::-webkit-scrollbar { width: 4px; }











    .sidebar::-webkit-scrollbar-track { background: transparent; }











    .sidebar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }











    .sidebar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }











    .sidebar-title { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; padding-left: 0.5rem; }











    .category-list { display: flex; flex-direction: column; gap: 0.25rem; }











    .category-item { display: flex; align-items: center; padding: 0.4rem 0.6rem; border-radius: var(--radius); color: var(--text-secondary); font-size: 0.82rem; transition: all var(--transition); }











    .category-item:hover { background: var(--bg-hover); color: var(--text-primary); }











    .category-item.active { background: var(--accent); color: #fff; }











    .category-item .cat-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }











    .main-container { flex: 1; min-width: 0; }























    /* Batch actions bar */











    .batch-bar { display: flex; align-items: center; gap: 0.5rem; padding: 10px 14px; background: #111111 !important; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); margin-bottom: 12px; flex-wrap: wrap; }











    .batch-select-all { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); flex-shrink: 0; }











    .batch-bar input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent); }











    .batch-actions { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }











    .selected-count { font-size: 0.8rem; color: var(--text-secondary); margin-left: auto; flex-shrink: 0; }











    .selected-count strong { color: var(--accent); }











    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.5rem 0.75rem; background: var(--bg-hover); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-primary); font-size: 0.8rem; cursor: pointer; transition: all var(--transition); white-space: nowrap; }











    .btn:hover { background: var(--accent); border-color: var(--accent); color: #fff; }











    .btn svg { width: 16px; height: 16px; flex-shrink: 0; }











    .btn-primary { background: var(--accent); border-color: var(--accent); color: #fff; }











    .btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }











    .btn-favorite-batch { min-width: 44px; }











    .btn-favorite-batch:hover svg { stroke: var(--accent); }











    .btn-shuffle { min-width: 44px; }











    .btn-shuffle:hover svg { stroke: var(--accent); }























    /* Load more section */











    .loading-indicator {











      display: flex;











      align-items: center;











      justify-content: center;











      gap: 0.75rem;











      padding: 1.5rem;











      color: var(--text-secondary);











      font-size: 0.9rem;











    }











    .loading-indicator .spinner {











      width: 20px;











      height: 20px;











      border: 2px solid var(--border);











      border-top-color: var(--accent);











      border-radius: 50%;











      animation: spin 0.8s linear infinite;











    }











    @keyframes spin { to { transform: rotate(360deg); } }























    @media (max-width: 768px) {











      .sidebar { display: none; }
      .mobile-categories-link { display: inline-flex; align-items: center; gap: 0.4rem; padding: 6px 12px; margin-bottom: 8px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-secondary); font-size: 0.8rem; text-decoration: none; }
        .category-header { padding: 14px 16px; gap: 6px; }
        .category-header h1 { font-size: 1.25rem; }
        .category-header p { font-size: 0.85rem; }
        .category-stats { gap: 0.75rem; flex-wrap: wrap; font-size: 0.8rem; margin-top: 0.75rem; }
        .cat-info-row { gap: 0.3rem 0.75rem; margin-top: 0.65rem; padding-top: 0.65rem; font-size: 0.7rem; }
        .cat-info-panel { padding: 0.65rem 0 0.1rem; font-size: 0.8rem; }
        .cat-info-faq-q { font-size: 0.82rem; }
        .cat-info-faq-a { font-size: 0.78rem; padding-left: 2.8rem; }
        .batch-bar { padding: 8px 12px; gap: 0.4rem; }
        .batch-actions { flex: 1; justify-content: flex-end; }
        .channel-list { gap: 0.4rem; }
        .channel-row { padding: 8px 12px; gap: 0.5rem; }
        .ch-name { font-size: 0.85rem; }
        .ch-group { font-size: 0.7rem; }
        .btn-favorite { width: 32px; height: 32px; }












      .page-layout { flex-direction: column; padding: 0 0.75rem 1.5rem; }











      .batch-actions { gap: 0.25rem; }











      .batch-actions .btn { padding: 0.4rem 0.5rem; font-size: 0.75rem; }











      .batch-actions .btn svg { width: 14px; height: 14px; }











      .batch-actions .btn .btn-text { display: none; }











      .btn-shuffle, .btn-favorite-batch { min-width: 32px; }











    }























    /* Channel list */











    .channel-list { display: flex; flex-direction: column; gap: 0.5rem; }











    .channel-row { display: flex; align-items: center; gap: 0.5rem; padding: 7px 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); transition: all var(--transition); margin-bottom: 4px; }











    .channel-row:hover { border-color: var(--border-hover); background: var(--bg-hover); }











    .channel-row.selected { border-color: var(--accent); background: rgba(229, 9, 20, 0.1); }











    .channel-checkbox { display: flex; align-items: center; cursor: pointer; }











    .channel-checkbox input { width: 18px; height: 18px; accent-color: var(--accent); cursor: pointer; }











    .channel-link { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }











    .ch-logo { width: 40px; height: 28px; object-fit: contain; background: var(--bg-secondary); border-radius: 4px; padding: 0.2rem; }











    .ch-logo-placeholder { width: 48px; height: 32px; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); border-radius: 4px; font-size: 1.25rem; opacity: 0.5; }











    .ch-info { flex: 1; min-width: 0; }











    .ch-name { font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }











    .ch-group { font-size: 0.75rem; color: var(--text-muted); }











    .btn-favorite { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: transparent; border: none; color: var(--text-muted); border-radius: var(--radius); transition: all var(--transition); }











    .btn-favorite:hover { color: var(--accent); background: var(--bg-hover); }











    .btn-favorite.active { color: var(--accent); }











    .btn-favorite.active svg { fill: var(--accent); }











    .btn-favorite:disabled, .btn-favorite[disabled] { cursor: default; opacity: 0.85; }























    /* Already-favorited row: dim the checkbox, add a subtle star tint */











    .channel-row.is-favorited { background: rgba(229, 9, 20, 0.04); }











    .channel-row.is-favorited .ch-name::before {











      content: '★ ';











      color: var(--accent);











      font-size: 0.9em;











    }











    .channel-row.is-favorited input[type="checkbox"]:disabled { opacity: 0.4; cursor: not-allowed; }























    /* Spinner */











    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; vertical-align: middle; }











    @keyframes spin { to { transform: rotate(360deg); } }























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











      #translateSelectLanguage { min-width: 50px; padding: 0.5rem 1rem 0.5rem 0.5rem; font-size: 0.75rem; }











      #translate::after { right: 0.4rem; border-top: 4px solid var(--text-secondary); }











      











      /* Breadcrumb mobile */











      .breadcrumb { padding: 0.75rem 1rem; }











      .breadcrumb-text { display: none; }











      .breadcrumb-icon { width: 16px; height: 16px; }











      .breadcrumb-sep { font-size: 1rem; }











      .breadcrumb-current { font-size: 0.8rem; }











      











      .category-header { padding: 1rem; }











      .category-header h1 { font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }











      .category-header p { font-size: 0.85rem; }











      .page-layout { flex-direction: column; padding: 0 0.75rem 1.5rem; gap: 1rem; }











      .sidebar { width: 100%; }











      .category-list { flex-direction: row; flex-wrap: wrap; gap: 0.5rem; }











      .category-item { padding: 0.4rem 0.75rem; font-size: 0.8rem; }











      .main-container { width: 100%; }











      











      /* Batch bar mobile - stacked layout */











      .batch-bar { padding: 8px 12px; gap: 0.5rem; }











      .batch-select-all { padding: 0.25rem 0; }











      .batch-actions { display: flex; gap: 0.5rem; }











      .batch-actions .btn { 











        flex: 1; 











        justify-content: center;











        padding: 0.5rem 0.5rem;











        font-size: 0.8rem;











      }











      .batch-actions .btn svg { width: 16px; height: 16px; }











      .selected-count { 











        text-align: center; 











        margin: 0;











        padding-top: 0.5rem;











        border-top: 1px solid var(--border);











      }











      











      .ch-logo { width: 40px; height: 28px; }











      .ch-logo-placeholder { width: 40px; height: 28px; font-size: 1rem; }











      .btn-favorite { width: 32px; height: 32px; }











    }











    











    @media (max-width: 480px) {
      .batch-actions { flex-direction: row; flex-wrap: wrap; gap: 0.35rem; }
      .batch-actions .btn { flex: 1; min-width: 0; padding: 0.5rem 0.4rem; font-size: 0.7rem; }
      .batch-actions .btn svg { width: 13px; height: 13px; }
      .batch-actions .btn .btn-text { display: none; }
      .batch-select-all { font-size: 0.75rem; }
      .selected-count { font-size: 0.7rem; }
      .category-header h1 { font-size: 1.05rem; }
      .cat-info-row { gap: 0.3rem 0.7rem; font-size: 0.65rem; }
      .batch-bar { padding: 6px 10px; gap: 0.35rem; }
    }











      .batch-actions .btn { width: 100%; }











      .btn-text { display: inline; }











    }











  </style>











</head>

  <a href="#main-content" class="skip-link" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;z-index:99999;">Skip to main content</a>
  <style>.skip-link:focus{position:fixed;left:0;top:0;width:auto;height:auto;padding:0.5rem 1rem;background:#e50914;color:#fff;z-index:99999;font-weight:600;}</style>
<body>











  ${header}























  <nav class="breadcrumb">











    <a href="${origin}/">











      <svg class="breadcrumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>











      <span class="breadcrumb-text">Home</span>











    </a>











    <span class="breadcrumb-sep">›</span>











    <span class="breadcrumb-current">${escapeHtml(category)}</span>











  </nav>























  <div class="category-header account-card">











    <h1><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" style="vertical-align:middle;margin-right:0.3em"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>${escapeHtml(category)} Channels</h1>











    <p>Watch all ${escapeHtml(category)} channels live.</p>











    <div class="category-stats">











      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="vertical-align:middle"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg> <span id="channelCount">${channels.length}</span> channels</span>











      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="vertical-align:middle"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg> Updated daily</span>











    </div>

<!-- Hero Stats Band — SEO/FAQ as chip row in the page header (Option A from designer review) -->
    <div class="cat-info-row" role="tablist">
      <button class="cat-info-chip" type="button" role="tab" data-panel="about" aria-selected="false">
        About
      </button>
      <button class="cat-info-chip" type="button" role="tab" data-panel="faq" aria-selected="false">
        FAQ <span class="cat-info-chip__num">· 4</span>
      </button>
      <button class="cat-info-chip" type="button" role="tab" data-panel="players" aria-selected="false">
        Players <span class="cat-info-chip__num">· 5</span>
      </button>
    </div>

    <div class="cat-info-panels">
      <div class="cat-info-panel" data-panel="about" hidden>
        <p>Watch free ${escapeHtml(category)} IPTV channels live online on IPTV Search. Browse ${escapeHtml(category)} live TV streams in HD quality with <code>M3U</code> and <code>M3U8</code> playlist support. No registration or subscription required for basic access. Our ${escapeHtml(category)} channel directory is updated daily to ensure reliable playback.</p>
        <p>Access all ${escapeHtml(category)} channels via direct stream links, or download the M3U playlist for use in <code>VLC</code>, <code>IPTV Smarters</code>, <code>TiviMate</code>, <code>GSE Smart IPTV</code>, <code>Kodi</code>, and other popular IPTV players.</p>
      </div>

      <div class="cat-info-panel" data-panel="faq" hidden>
        <details class="cat-info-faq-item">
          <summary>
            <span class="cat-info-faq-num">Q.01</span>
            <span class="cat-info-faq-q">How do I watch ${escapeHtml(category)} channels?</span>
            <span class="cat-info-faq-icon" aria-hidden="true"></span>
          </summary>
          <div class="cat-info-faq-a"><p>Browse the channel list below, click on any channel to get its stream link, or copy the M3U playlist URL to import into your preferred IPTV player.</p></div>
        </details>
        <details class="cat-info-faq-item">
          <summary>
            <span class="cat-info-faq-num">Q.02</span>
            <span class="cat-info-faq-q">Are ${escapeHtml(category)} channels free to watch?</span>
            <span class="cat-info-faq-icon" aria-hidden="true"></span>
          </summary>
          <div class="cat-info-faq-a"><p>Yes, you can watch ${escapeHtml(category)} channels for free with basic access. For ad-free HD streaming and multiple simultaneous connections, consider upgrading to a VIP subscription.</p></div>
        </details>
        <details class="cat-info-faq-item">
          <summary>
            <span class="cat-info-faq-num">Q.03</span>
            <span class="cat-info-faq-q">What IPTV players work with ${escapeHtml(category)} streams?</span>
            <span class="cat-info-faq-icon" aria-hidden="true"></span>
          </summary>
          <div class="cat-info-faq-a"><p>Our ${escapeHtml(category)} streams are compatible with VLC Media Player, IPTV Smarters Pro, TiviMate, GSE Smart IPTV, Kodi, and any player that supports M3U8 playlist URLs.</p></div>
        </details>
        <details class="cat-info-faq-item">
          <summary>
            <span class="cat-info-faq-num">Q.04</span>
            <span class="cat-info-faq-q">Why is a ${escapeHtml(category)} stream not loading?</span>
            <span class="cat-info-faq-icon" aria-hidden="true"></span>
          </summary>
          <div class="cat-info-faq-a"><p>Free streams may occasionally be unavailable due to source changes. Try refreshing the page, switching to a different player, or checking our ${escapeHtml(category)} channel list for alternative streams.</p></div>
        </details>
      </div>

      <div class="cat-info-panel" data-panel="players" hidden>
        <ul class="cat-info-players-list">
          <li>VLC</li>
          <li>IPTV Smarters</li>
          <li>TiviMate</li>
          <li>GSE Smart IPTV</li>
          <li>Kodi</li>
        </ul>
      </div>
    </div>

    <script>
      // Hero band — chip switching
      (function() {
        document.querySelectorAll('.cat-info-row').forEach(function(row) {
          var chips = row.querySelectorAll('.cat-info-chip');
          // Find the sibling panels container (next element after row in the same .category-header)
          var container = row.parentElement;
          var panels = container.querySelectorAll('.cat-info-panel');
          chips.forEach(function(chip) {
            chip.addEventListener('click', function() {
              var target = chip.getAttribute('data-panel');
              var wasActive = chip.classList.contains('is-active');
              chips.forEach(function(c) {
                c.classList.remove('is-active');
                c.setAttribute('aria-selected', 'false');
              });
              panels.forEach(function(p) {
                var on = !wasActive && p.getAttribute('data-panel') === target;
                p.classList.toggle('is-open', on);
                if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
              });
              if (!wasActive) {
                chip.classList.add('is-active');
                chip.setAttribute('aria-selected', 'true');
              }
            });
          });
        });

      })();
    </script>











  </div>























  <main class="page-layout" id="main-content">











    <aside class="sidebar account-card">











      <div class="sidebar-title">All Categories</div>











      <div class="category-list">











        ${categoryListHtml}











      </div>











    </aside>











    <div class="main-container">











            <a href="/" class="mobile-categories-link" aria-label="Browse all categories">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        Browse all categories
      </a>
<div class="batch-bar">











        <label class="batch-select-all">











          <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">











          <span class="batch-select-text">Select all</span>











        </label>











        <div class="batch-actions">











          <button class="btn btn-favorite-batch" onclick="addSelectedToFavorites()" title="Add to Favorites">











            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>











            <span class="btn-text">Favorite</span>











          </button>











          <button class="btn btn-primary" onclick="downloadSelectedM3U()" title="Download M3U">











            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>











            <span class="btn-text">Download</span>











          </button>











          <button class="btn btn-shuffle" onclick="shuffleChannels()" title="Shuffle">











            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>











            <span class="btn-text">Shuffle</span>











          </button>











        </div>











        <span class="selected-count"><strong id="selectedCount">0</strong> selected</span>











      </div>











      <div id="channelList" data-has-more="true">











        ${channelListHtml}











      </div>











      <div id="loadingIndicator" class="loading-indicator" style="display:none;">











        <div class="spinner"></div>











        <span>Loading more channels...</span>











      </div>











    </div>











  </main>










    <!-- SEO + FAQ — single container, tab-switched to save vertical space -->
    

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "How do I watch ${escapeJs(category)} channels?", "acceptedAnswer": {"@type": "Answer", "text": "Browse the channel list, click on any channel to get its stream link, or copy the M3U playlist URL to import into your preferred IPTV player."}},
        {"@type": "Question", "name": "Are ${escapeJs(category)} channels free to watch?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, you can watch ${escapeJs(category)} channels for free with basic access. For ad-free HD streaming and multiple simultaneous connections, upgrade to a VIP subscription."}},
        {"@type": "Question", "name": "What IPTV players work with ${escapeJs(category)} streams?", "acceptedAnswer": {"@type": "Answer", "text": "Our ${escapeJs(category)} streams are compatible with VLC Media Player, IPTV Smarters Pro, TiviMate, GSE Smart IPTV, Kodi, and any player that supports M3U8 playlist URLs."}},
        {"@type": "Question", "name": "Why is a ${escapeJs(category)} stream not loading?", "acceptedAnswer": {"@type": "Answer", "text": "Free streams may occasionally be unavailable due to source changes. Try refreshing the page, switching to a different player, or checking our ${escapeJs(category)} channel list for alternative streams."}}
      ]
    }
    </script>














  ${PAGE_FOOTER}























  ${jsonLd ? '<script id="json-ld" type="application/ld+json">' + JSON.stringify(jsonLd) + '</script>' : ''}























  <script>











    function escapeHtml(str) {











      if (!str) return '';











      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');











    }























    // Theme toggle with icon update











    











    











    // Initialize theme icons on page load











        (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved ? saved === 'dark' : prefersDark;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    })();











    











    























    // Select all toggle











    function toggleSelectAll() {











      const selectAll = document.getElementById('selectAll');











      const checkboxes = document.querySelectorAll('.channel-row input[type="checkbox"]');











      checkboxes.forEach(cb => {











        cb.checked = selectAll.checked;











        cb.closest('.channel-row').classList.toggle('selected', selectAll.checked);











      });











      updateSelectedCount();











    }























    // Update selected count











    function updateSelectedCount() {











      const checked = document.querySelectorAll('.channel-row input[type="checkbox"]:checked');











      document.getElementById('selectedCount').textContent = checked.length;











      











      // Update row visual state











      document.querySelectorAll('.channel-row').forEach(row => {











        const cb = row.querySelector('input[type="checkbox"]');











        row.classList.toggle('selected', cb.checked);











      });











    }























    // Get selected channels











    function getSelectedChannels() {











      const selected = [];











      document.querySelectorAll('.channel-row input[type="checkbox"]:checked').forEach(cb => {











        const row = cb.closest('.channel-row');











        selected.push({











          hash: row.dataset.hash,











          name: row.dataset.name,











          logo: row.dataset.logo,











          group: row.dataset.group











        });











      });











      return selected;











    }























    // Toggle favorite











    // Dedup favorites by channel_name (defensive against client state drift)
    function dedupFavorites(favs) {
      const seen = {}; const out = [];
      for (const f of (favs || [])) {
        if (!f || !f.name) continue;
        if (seen[f.name]) continue;
        seen[f.name] = true;
        out.push(f);
      }
      return out;
    }

    let _syncTimer = null;
    function scheduleCloudSync(favorites) {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      if (_syncTimer) clearTimeout(_syncTimer);
      // 立即同步，不再等待 5 分钟
      syncFavoritesToCloud(dedupFavorites(favorites), true);
    }

    async function syncFavoritesToCloud(favorites, force) {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      if (!force) {
        if (_syncTimer) clearTimeout(_syncTimer);
        _syncTimer = setTimeout(() => syncFavoritesToCloud(dedupFavorites(favorites), true), 5 * 60 * 1000);
        return;
      }
      try {
        const res = await fetch('${origin}/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ favorites: dedupFavorites(favorites) })
        });
        if (!res.ok) {
          const text = await res.text();
          console.error('[syncFavoritesToCloud] HTTP', res.status, text);
        }
      } catch (e) {
        console.error('Failed to sync favorites to cloud:', e);
      }
    }

    // Best-effort flush on page unload
    window.addEventListener('beforeunload', () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const favs = dedupFavorites(JSON.parse(localStorage.getItem('favorites') || '[]'));
      if (!favs.length) return;
      try {
        navigator.sendBeacon('${origin}/api/favorites',
          new Blob([JSON.stringify({ favorites: favs })], { type: 'application/json' }));
      } catch (e) { /* ignore */ }
    });

    function toggleFavorite(btn) {

      const token = localStorage.getItem('auth_token');
      if (!token) {
        showToast({
          type: 'warning',
          title: 'Please log in',
          message: 'Favorites require an account. Log in to sync across devices.<br><a href="/login?redirect=/favorites" style="color:var(--accent);font-weight:600;">Log in / Sign up →</a>'
        });
        return;
      }

      const row = btn.closest('.channel-row');
      const name = row.dataset.name;
      const hash = row.dataset.hash;
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const index = favorites.findIndex(f => f.hash === hash);

      if (index === -1) {
        favorites.push({
          name: name,
          hash: hash,
          logo: row.dataset.logo,
          group: row.dataset.group
        });

        btn.classList.add('active');

        btn.querySelector('svg').setAttribute('fill', 'currentColor');



      } else {
        favorites.splice(index, 1);
        btn.classList.remove('active');
        btn.querySelector('svg').setAttribute('fill', 'none');
        localStorage.setItem('favorites', JSON.stringify(favorites));
        syncFavoritesToCloud(favorites, true);
        return;
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));
      syncFavoritesToCloud(favorites, true);

    }



    // Shuffle channels (display random order)











    function shuffleChannels() {











      const channelList = document.getElementById('channelList');











      const rows = Array.from(channelList.querySelectorAll('.channel-row'));











      // Fisher-Yates shuffle











      for (let i = rows.length - 1; i > 0; i--) {











        const j = Math.floor(Math.random() * (i + 1));











        [rows[i], rows[j]] = [rows[j], rows[i]];











      }











      rows.forEach(row => channelList.appendChild(row));











    }























    // Infinite scroll state — lazy-load channels on-demand instead of pre-rendering all.


    // Client-side helper functions (also used by loadMoreChannels on scroll)
    function escapeHtml(s) {
      if (s == null) return '';
      return String(s).replace(/[&<>"']/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function buildChannelUrl(name) {
      var ws = String.fromCharCode(9, 10, 11, 12, 13, 32);
      var reWs = new RegExp('[' + ws + ']+', 'g');
      var reKeep = new RegExp('[^a-zA-Z0-9' + String.fromCharCode(0x4e00) + '-' + String.fromCharCode(0x9fff) + String.fromCharCode(0xff00) + '-' + String.fromCharCode(0xffef) + String.fromCharCode(0xfe30) + '-' + String.fromCharCode(0xfe4f) + '-]', 'g');
      return '/channel/' + String(name).trim().replace(reWs, '-').replace(reKeep, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    }

    var channels = ${JSON.stringify(channels)};





    var totalChannels = ${channels.length};





    var loadedCount = 0;











    var batchSize = 50;











    var isLoading = false;























    function loadMoreChannels() {











      if (isLoading) return;











      isLoading = true;











      document.getElementById('loadingIndicator').style.display = 'flex';























      setTimeout(function() {











        var start = loadedCount;











        var end = Math.min(start + batchSize, totalChannels);











        











        // Dynamically create DOM nodes for this batch (they don't exist in HTML yet)











        var container = document.getElementById('channelList');











        var fragment = document.createDocumentFragment();











        for (var i = start; i < end; i++) {











          var ch = channels[i];











          var logoHtml = ch.logo 











            ? '<img src="' + escapeHtml(ch.logo) + '" alt="' + escapeHtml(ch.name) + '" class="ch-logo" loading="lazy" decoding="async">' 











            : '<div class="ch-logo-placeholder">📺</div>';











          var row = document.createElement('div');











          row.className = 'channel-row';











          row.dataset.hash = ch.hash;











          row.dataset.name = ch.name;











          row.dataset.logo = ch.logo || '';











          row.dataset.group = ch.group || category;











          row.innerHTML = '<label class="channel-checkbox">' +











            '<input type="checkbox" onchange="updateSelectedCount()">' +











            '<span class="checkmark"></span>' +











          '</label>' +











          '<a href="' + origin + buildChannelUrl(ch.name) + '" class="channel-link">' +











            '<div class="ch-logo">' + logoHtml + '</div>' +











            '<div class="ch-info">' +











              '<div class="ch-name">' + escapeHtml(ch.name) + '</div>' +











              '<div class="ch-group">' + escapeHtml(ch.group || category) + '</div>' +











            '</div>' +











          '</a>' +











          '<button class="btn-favorite" data-hash="' + escapeHtml(ch.hash) + '" onclick="toggleFavorite(this)" title="Add to favorites">' +











            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +











          '</button>';











          fragment.appendChild(row);











        }











        container.appendChild(fragment);











        











        // Re-apply favorite state on newly-created rows (they have no data-applied-fav yet)











        var newRows = container.querySelectorAll('.channel-row:not([data-applied-fav])');











        applyFavoriteStateToRows(newRows, 0, newRows.length);











        











        loadedCount = end;











        document.getElementById('loadingIndicator').style.display = 'none';











        isLoading = false;























        if (loadedCount >= totalChannels) {











          container.removeAttribute('data-has-more');











        }











      }, 300);











    }























    // Mark rows already in localStorage as favorited (button .active,











    // aria-pressed, row .is-favorited). Used by both init and infinite scroll.











    function applyFavoriteStateToRows(rows, from, to) {











      try {











        var favs = JSON.parse(localStorage.getItem('favorites') || '[]');











        if (!favs.length) return;











        var hashSet = {};











        for (var i = 0; i < favs.length; i++) hashSet[favs[i].hash] = true;











        for (var j = from; j < to && j < rows.length; j++) {











          var row = rows[j];











          row.setAttribute('data-applied-fav', 'true');











          var h = row.dataset.hash;











          if (hashSet[h]) {











            var btn = row.querySelector('.btn-favorite');











            if (btn) {











              btn.classList.add('active');











              btn.setAttribute('aria-pressed', 'true');











              var svg = btn.querySelector('svg');











              if (svg) svg.setAttribute('fill', 'currentColor');











            }











            row.classList.add('is-favorited');











            var cb = row.querySelector('input[type="checkbox"]');











            if (cb) { cb.checked = false; cb.disabled = true; }











          }











        }











      } catch (e) { /* localStorage may be unavailable */ }











    }























    // Scroll event listener for infinite scroll











    window.addEventListener('scroll', function() {











      var container = document.getElementById('channelList');











      if (!container || !container.hasAttribute('data-has-more') || isLoading) return;











      











      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;











      var windowHeight = window.innerHeight;











      var docHeight = document.documentElement.scrollHeight;











      











      if (scrollTop + windowHeight >= docHeight - 500) {











        loadMoreChannels();











      }











    });























    // Add selected to favorites











    // Tracks three outcomes distinctly so the toast can give clear feedback:











    //   addedCount  = newly added to favorites this click











    //   skippedCount = already in favorites before this click











    //   selected    = total selection size (for empty/all-skipped edge cases)











    function addSelectedToFavorites() {

      const token = localStorage.getItem('auth_token');
      if (!token) {
        showToast({
          type: 'warning',
          title: 'Please log in',
          message: 'Favorites require an account. Log in to sync across devices.<br><a href="/login?redirect=/favorites" style="color:var(--accent);font-weight:600;">Log in / Sign up →</a>'
        });
        return;
      }

      const selected = getSelectedChannels();

      if (selected.length === 0) {

        showToastWarning('No channels selected', 'Please select at least one channel to add to favorites.');

        return;

      }

      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

      const existingNames = {};

      for (let i = 0; i < favorites.length; i++) existingNames[favorites[i].name] = true;

      let addedCount = 0;

      let skippedCount = 0;

      selected.forEach(ch => {

        if (existingNames[ch.name]) {

          skippedCount++;

        } else {

          favorites.push(ch);

          existingNames[ch.name] = true;

          addedCount++;

        }

      });

      localStorage.setItem('favorites', JSON.stringify(favorites));
      syncFavoritesToCloud(favorites, true);

      // Update button states: mark added rows as favorited, and uncheck +

      // disable rows that were skipped (already in favorites).

      selected.forEach(ch => {

        const row = document.querySelector('.channel-row[data-name="' + CSS.escape(ch.name) + '"]');

        if (!row) return;

        const btn = row.querySelector('.btn-favorite');

        if (existingNames[ch.name]) {

          if (btn) {

            btn.classList.add('active');

            btn.setAttribute('aria-pressed', 'true');

            const svg = btn.querySelector('svg');

            if (svg) svg.setAttribute('fill', 'currentColor');

          }

          row.classList.add('is-favorited');

          const cb = row.querySelector('input[type="checkbox"]');

          if (cb) { cb.checked = false; cb.disabled = true; }

        }

      });

      // Show success/skip toast
      if (addedCount === 0 && skippedCount > 0) {
        showToastInfo(
          skippedCount + ' channel' + (skippedCount === 1 ? '' : 's') + ' already in favorites',
          'Nothing new added'
        );
      } else if (addedCount > 0 && skippedCount === 0) {
        showToastSuccess(
          addedCount + ' channel' + (addedCount === 1 ? '' : 's') + ' added to favorites',
          'Added'
        );
      } else if (addedCount > 0 && skippedCount > 0) {
        showToastInfo(
          addedCount + ' added, ' + skippedCount + ' already in favorites',
          'Partial'
        );
      }

    }



    const MAX_FREE_DOWNLOAD = 100;











    const BATCH_SIZE = 50;























    // Check if user is a member











    async function checkMemberStatus() {











      try {











        // 从 localStorage 获取 token（账户系统使用 localStorage 存储）











        const token = localStorage.getItem('auth_token');











        const headers = {};











        if (token) {











          headers['Authorization'] = 'Bearer ' + token;











        }











        const response = await fetch('${origin}/api/member/status', { headers });











        const data = await response.json();











        return data.isMember === true;











      } catch (e) {











        console.error('Failed to check member status:', e);











        return false;











      }











    }























    // Process channels in batches to prevent UI freezing











    async function processChannelsInBatches(channels, processFn, batchSize) {











      const results = [];











      const totalBatches = Math.ceil(channels.length / batchSize);











      











      for (let i = 0; i < channels.length; i += batchSize) {











        const batch = channels.slice(i, i + batchSize);











        const batchIndex = Math.floor(i / batchSize) + 1;











        











        // Update progress











        updateDownloadProgress(batchIndex, totalBatches);











        











        // Process this batch











        const batchResults = await Promise.all(batch.map(processFn));











        results.push(...batchResults);











        











        // Yield to main thread between batches to prevent freezing











        if (i + batchSize < channels.length) {











          await new Promise(resolve => setTimeout(resolve, 0));











        }











      }











      return results;











    }























    function updateDownloadProgress(current, total) {











      const progressEl = document.getElementById('downloadProgress');











      if (progressEl) {











        progressEl.textContent = 'Processing ' + current + '/' + total + ' batches...';











      }











    }























    // Download selected as M3U (一次性请求，服务端生成)











    async function downloadSelectedM3U() {











      const selected = getSelectedChannels();











      if (selected.length === 0) {











        showToastWarning('No channels selected', 'Please select at least one channel to download.');











        return;











      }























      // Show loading state











      const btn = document.querySelector('[onclick="downloadSelectedM3U()"]');











      const originalText = btn.innerHTML;











      btn.innerHTML = '<span class="spinner"></span> Generating...';











      btn.disabled = true;























      try {











        const origin = '${origin}';























        // 获取指纹











        const fingerprint = await getFingerprint();























        // 获取 auth token（如果用户已登录）











        const authToken = localStorage.getItem('auth_token');











        const headers = {











          'Content-Type': 'application/json',











          'X-Fingerprint': fingerprint











        };











        if (authToken) {











          headers['Authorization'] = 'Bearer ' + authToken;











        }























        // 发送一次性请求，服务端生成完整 M3U（不暴露真实 token）











        const response = await fetch(origin + '/api/channels/m3u', {











          method: 'POST',











          headers,











          body: JSON.stringify({











            channels: selected.map(ch => ({











              hash: ch.hash,











              name: ch.name,











              logo: ch.logo || '',











              group: ch.group











            }))











          })











        });























        if (!response.ok) {











          throw new Error('Failed to generate M3U');











        }























        // 直接下载返回的 M3U 文件











        const blob = await response.blob();











        const timestamp = new Date().toISOString().replace(/[:-]/g, '').replace('T', '_').slice(0, 15);











        const url = URL.createObjectURL(blob);











        const a = document.createElement('a');











        a.href = url;











        a.download = 'channels_' + timestamp + '.m3u';











        document.body.appendChild(a);











        a.click();











        document.body.removeChild(a);











        URL.revokeObjectURL(url);























        showToastSuccess('Download started!', selected.length + ' channels ready to import into your player.');











      } catch (error) {











        console.error('M3U download error:', error);











        showToastError('Download failed', 'Failed to generate M3U. Please try again.');











      } finally {











        btn.innerHTML = originalText;











        btn.disabled = false;











      }











    }























    // Initialize favorite buttons: mark already-favorited rows on first paint.











    // Since we now lazy-load DOM nodes, we only apply to the initial batch (first 50).











    document.addEventListener('DOMContentLoaded', function() {











      var allRows = document.querySelectorAll('.channel-row');











      applyFavoriteStateToRows(allRows, 0, allRows.length);











    });











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























  <!-- Toast Container -->











  <div id="toastContainer" class="toast-container"></div>























  <style>











  .toast-container { position: fixed; top: 80px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }











  .toast { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 14px 18px; box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2); display: flex; align-items: flex-start; gap: 14px; min-width: 300px; max-width: 400px; pointer-events: auto; animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }











  .toast.toast-exit { animation: toastSlideOut 0.3s ease forwards; }











  .toast-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }











  .toast-icon-wrap svg { width: 18px; height: 18px; }











  .toast.toast-success .toast-icon-wrap { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4); }











  .toast.toast-error .toast-icon-wrap { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); }











  .toast.toast-warning .toast-icon-wrap { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); }











  .toast.toast-info .toast-icon-wrap { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }











  .toast-content { flex: 1; min-width: 0; padding-top: 2px; }











  .toast-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; }











  .toast-message { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; }











  .toast-action { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }











  .toast-action a { color: var(--accent); font-weight: 600; font-size: 0.875rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }











  .toast-action a:hover { text-decoration: underline; }











  .toast-action a::after { content: '→'; font-size: 1em; }











  .toast-close { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; margin: -6px -6px -6px 0; border-radius: 8px; flex-shrink: 0; opacity: 0.6; transition: opacity 0.2s, background 0.2s; }











  .toast-close:hover { opacity: 1; background: var(--bg-hover); }











  @keyframes toastSlideIn { from { transform: translateX(120%) scale(0.8); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }











  @keyframes toastSlideOut { from { transform: translateX(0) scale(1); opacity: 1; } to { transform: translateX(120%) scale(0.8); opacity: 0; } }











  @media (max-width: 480px) { .toast-container { top: auto; bottom: 24px; left: 16px; right: 16px; } .toast { min-width: auto; width: 100%; } }












    /* Hero Stats Band — SEO/FAQ as chip row inside .category-header
       (Option A from designer review). 4 chips (About / FAQ / Players /
       M3U/M3U8), click any to expand its inline panel below. */
    .cat-info-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 1.25rem;
      align-items: center;
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
      font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .cat-info-chip {
      appearance: none;
      background: transparent;
      border: none;
      padding: 0.4rem 0.2rem;
      margin: 0;
      font-family: inherit;
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      cursor: pointer;
      position: relative;
      transition: color 0.15s ease;
    }
    .cat-info-chip:hover { color: var(--text-secondary); }
    .cat-info-chip.is-active { color: var(--accent); }
    .cat-info-chip.is-active::after {
      content: '';
      position: absolute;
      left: 0; right: 0; bottom: -1.25rem;
      height: 1.5px;
      background: var(--accent);
    }
    .cat-info-chip__num {
      margin-left: 0.3rem;
      color: var(--text-muted);
      font-size: 0.68rem;
    }
    .cat-info-chip.is-active .cat-info-chip__num { color: var(--accent); }

    /* Panel container */
    .cat-info-panels { margin-top: 0.5rem; }
    .cat-info-panel {
      display: none;
      margin-top: 0.75rem;
      padding: 1.25rem 0 0.25rem;
      border-top: 1px dashed var(--border);
      font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .cat-info-panel.is-open { display: block; }

    /* About panel — prose with inline code keywords */
    .cat-info-panel[data-panel="about"] p {
      font-size: 0.82rem;
      line-height: 1.7;
      color: var(--text-secondary);
      margin: 0 0 0.7rem;
      max-width: 64ch;
    }
    .cat-info-panel[data-panel="about"] p:last-child { margin-bottom: 0; }
    .cat-info-panel[data-panel="about"] code {
      font-family: inherit;
      font-size: inherit;
      color: var(--accent);
      background: transparent;
      border: none;
      padding: 0;
      font-weight: 500;
    }

    /* Players panel */
    .cat-info-players-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 1rem;
      font-size: 0.82rem;
    }
    .cat-info-players-list li { color: var(--accent); }
    .cat-info-players-list li::before { content: '› '; color: var(--text-muted); }

    /* FAQ panel — collapsible items */
    .cat-info-faq-item {
      border-top: 1px solid var(--border);
    }
    .cat-info-faq-item:last-child { border-bottom: 1px solid var(--border); }
    .cat-info-faq-item summary {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.75rem 0.25rem;
      cursor: pointer;
      list-style: none;
      user-select: none;
    }
    .cat-info-faq-item summary::-webkit-details-marker { display: none; }
    .cat-info-faq-item summary::marker { display: none; content: ''; }
    .cat-info-faq-num {
      color: var(--text-muted);
      min-width: 2.6rem;
      font-size: 0.7rem;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }
    .cat-info-faq-q {
      flex: 1;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-primary);
      line-height: 1.45;
    }
    .cat-info-faq-item summary:hover .cat-info-faq-q { color: var(--accent); }
    .cat-info-faq-icon {
      width: 12px; height: 12px;
      position: relative;
      flex-shrink: 0;
      transition: transform 0.18s ease;
    }
    .cat-info-faq-icon::before,
    .cat-info-faq-icon::after {
      content: '';
      position: absolute;
      background: var(--text-muted);
      transition: transform 0.18s ease, opacity 0.18s ease;
    }
    .cat-info-faq-icon::before { top: 50%; left: 0; width: 100%; height: 1.5px; transform: translateY(-50%); }
    .cat-info-faq-icon::after  { top: 0; left: 50%; width: 1.5px; height: 100%; transform: translateX(-50%); }
    .cat-info-faq-item[open] .cat-info-faq-icon::after { transform: translateX(-50%) rotate(90deg); opacity: 0; }
    .cat-info-faq-item[open] summary .cat-info-faq-q { color: var(--accent); }

    .cat-info-faq-a {
      padding: 0 0.25rem 0.85rem 3.3rem;
      color: var(--text-secondary);
      font-size: 0.82rem;
      line-height: 1.65;
    }
    .cat-info-faq-a p { margin: 0; }

    /* responsive — chip row horizontal scroll on mobile */
    @media (max-width: 640px) {
      .cat-info-row {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .cat-info-row::-webkit-scrollbar { display: none; }
      .cat-info-chip { flex-shrink: 0; font-size: 0.7rem; }
      .cat-info-panel[data-panel="about"] p,
      .cat-info-faq-q { font-size: 0.8rem; }
      .cat-info-faq-a { padding-left: 2.9rem; font-size: 0.78rem; }
    }
  </style>























  <script>











  function showToast(options) { const { title = '', message = '', type = 'info', duration = 4000, action = null } = options; const container = document.getElementById('toastContainer'); const toast = document.createElement('div'); toast.className = 'toast toast-' + type; const icons = { success: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>', error: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>', warning: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', info: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' }; let actionHtml = ''; if (action) { actionHtml = '<div class="toast-action"><a href="' + action.href + '">' + action.text + '</a></div>'; } toast.innerHTML = '<div class="toast-icon-wrap">' + icons[type] + '</div><div class="toast-content">' + (title ? '<div class="toast-title">' + title + '</div>' : '') + (message ? '<div class="toast-message">' + message + '</div>' : '') + actionHtml + '</div><button class="toast-close" onclick="this.parentElement.remove()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'; container.appendChild(toast); if (duration > 0) { setTimeout(() => { toast.classList.add('toast-exit'); setTimeout(() => toast.remove(), 300); }, duration); } return toast; }











  function showToastSuccess(message, title = 'Success') { return showToast({ type: 'success', title, message }); }











  function showToastError(message, title = 'Error') { return showToast({ type: 'error', title, message, duration: 6000 }); }











  function showToastWarning(message, title = 'Warning', action = null) { return showToast({ type: 'warning', title, message, action }); }











  function showToastInfo(message, title = '', action = null) { return showToast({ type: 'info', title, message, action }); }











  </script>











</body>











</html>`;











}























function escapeHtml(str) {











  if (!str) return '';











  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');











}











