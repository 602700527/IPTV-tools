// Category Page - HTML shell with server-side rendered content

export function generateCategoryPage(options = {}) {
  const { 
    origin = 'https://iptv-search.com', 
    slug = '', 
    category = '',
    categories = [],  // Pre-rendered categories array
    channels = []     // Pre-rendered channels array for current category
  } = options;

  // Build category list HTML
  const categoryListHtml = categories.length > 0 ? categories.map(cat => {
    const isActive = cat.slug === slug ? ' active' : '';
    return '<a href="' + origin + '/category/' + encodeURIComponent(cat.slug) + '" class="category-item' + isActive + '">' +
      '<span class="cat-name">' + escapeHtml(cat.name) + '</span>' +
    '</a>';
  }).join('') : '<div style="padding:1rem;font-size:0.85rem;color:var(--text-muted);">No categories</div>';

  // Build channel list HTML (list view with checkboxes)
  let channelListHtml = '';
  if (channels.length > 0) {
    channelListHtml = '<div class="channel-list">' + channels.map(ch => {
      const logoHtml = ch.logo 
        ? '<img src="' + escapeHtml(ch.logo) + '" alt="' + escapeHtml(ch.name) + '" class="ch-logo">' 
        : '<div class="ch-logo-placeholder">📺</div>';
      return '<div class="channel-row" data-hash="' + escapeHtml(ch.hash) + '" data-name="' + escapeHtml(ch.name) + '" data-logo="' + escapeHtml(ch.logo || '') + '" data-group="' + escapeHtml(ch.group || category) + '">' +
        '<label class="channel-checkbox">' +
          '<input type="checkbox" onchange="updateSelectedCount()">' +
          '<span class="checkmark"></span>' +
        '</label>' +
        '<a href="' + origin + '/channel/' + ch.hash + '" class="channel-link">' +
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
    }).join('') + '</div>';
  } else {
    channelListHtml = '<div class="empty-state"><p>No channels found in this category</p></div>';
  }

  // Generate JSON-LD
  const jsonLd = channels.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": category + " Channels",
    "numberOfItems": channels.length,
    "itemListElement": channels.slice(0, 10).map((ch, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": ch.name,
      "url": origin + "/channel/" + ch.hash
    }))
  } : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(category)} Channels | IPTV Search</title>
  <meta name="description" content="Watch all ${escapeHtml(category)} channels live. Free IPTV streaming.">
  <link rel="canonical" href="${origin}/category/${encodeURIComponent(slug)}">
  <meta property="og:title" content="${escapeHtml(category)} Channels | IPTV Search">
  <meta property="og:description" content="Watch all ${escapeHtml(category)} channels live. Free IPTV streaming.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/category/${encodeURIComponent(slug)}">
  
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

    .category-header { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .category-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .category-header p { color: var(--text-secondary); font-size: 1rem; }
    .category-stats { display: flex; gap: 1.5rem; margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted); }
    .category-stats span { display: flex; align-items: center; gap: 0.3rem; }

    .page-layout { display: flex; max-width: 1400px; margin: 0 auto; padding: 0 2rem 2rem; gap: 2rem; }
    .sidebar { width: 220px; flex-shrink: 0; }
    .sidebar-title { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; padding-left: 0.5rem; }
    .category-list { display: flex; flex-direction: column; gap: 0.25rem; }
    .category-item { display: flex; align-items: center; padding: 0.6rem 0.75rem; border-radius: var(--radius); color: var(--text-secondary); font-size: 0.9rem; transition: all var(--transition); }
    .category-item:hover { background: var(--bg-hover); color: var(--text-primary); }
    .category-item.active { background: var(--accent); color: #fff; }
    .category-item .cat-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .main-container { flex: 1; min-width: 0; }

    /* Batch actions bar */
    .batch-bar { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 1rem; flex-wrap: wrap; }
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

    /* Channel list */
    .channel-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .channel-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); transition: all var(--transition); }
    .channel-row:hover { border-color: var(--border-hover); background: var(--bg-hover); }
    .channel-row.selected { border-color: var(--accent); background: rgba(229, 9, 20, 0.1); }
    .channel-checkbox { display: flex; align-items: center; cursor: pointer; }
    .channel-checkbox input { width: 18px; height: 18px; accent-color: var(--accent); cursor: pointer; }
    .channel-link { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
    .ch-logo { width: 48px; height: 32px; object-fit: contain; background: var(--bg-secondary); border-radius: 4px; padding: 0.25rem; }
    .ch-logo-placeholder { width: 48px; height: 32px; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); border-radius: 4px; font-size: 1.25rem; opacity: 0.5; }
    .ch-info { flex: 1; min-width: 0; }
    .ch-name { font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ch-group { font-size: 0.75rem; color: var(--text-muted); }
    .btn-favorite { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: transparent; border: none; color: var(--text-muted); border-radius: var(--radius); transition: all var(--transition); }
    .btn-favorite:hover { color: var(--accent); background: var(--bg-hover); }
    .btn-favorite.active { color: var(--accent); }
    .btn-favorite.active svg { fill: var(--accent); }

    /* Spinner */
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; vertical-align: middle; }
    @keyframes spin { to { transform: rotate(360deg); } }

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
      .batch-bar { 
        padding: 0.6rem 0.75rem; 
        gap: 0.5rem;
        flex-direction: column;
        align-items: stretch;
      }
      .batch-select-all { padding: 0.25rem 0; }
      .batch-actions { 
        display: flex; 
        gap: 0.5rem; 
        width: 100%;
      }
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
      .batch-actions { flex-direction: column; }
      .batch-actions .btn { width: 100%; }
      .btn-text { display: inline; }
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

  <nav class="breadcrumb">
    <a href="${origin}/">
      <svg class="breadcrumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span class="breadcrumb-text">Home</span>
    </a>
    <span class="breadcrumb-sep">›</span>
    <span class="breadcrumb-current">${escapeHtml(category)}</span>
  </nav>

  <div class="category-header">
    <h1><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" style="vertical-align:middle;margin-right:0.3em"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>${escapeHtml(category)} Channels</h1>
    <p>Watch all ${escapeHtml(category)} channels live.</p>
    <div class="category-stats">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="vertical-align:middle"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg> <span id="channelCount">${channels.length}</span> channels</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="vertical-align:middle"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg> Updated daily</span>
    </div>
  </div>

  <main class="page-layout">
    <aside class="sidebar">
      <div class="sidebar-title">All Categories</div>
      <div class="category-list">
        ${categoryListHtml}
      </div>
    </aside>
    <div class="main-container">
      <div class="batch-bar">
        <label class="batch-select-all">
          <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
          <span class="batch-select-text">全选</span>
        </label>
        <div class="batch-actions">
          <button class="btn btn-favorite-batch" onclick="addSelectedToFavorites()" title="添加收藏">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span class="btn-text">收藏</span>
          </button>
          <button class="btn btn-primary" onclick="downloadSelectedM3U()" title="下载M3U">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span class="btn-text">下载M3U</span>
          </button>
        </div>
        <span class="selected-count"><strong id="selectedCount">0</strong> 已选</span>
      </div>
      <div id="channelList">
        ${channelListHtml}
      </div>
    </div>
  </main>

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

  ${jsonLd ? '<script id="json-ld" type="application/ld+json">' + JSON.stringify(jsonLd) + '</script>' : ''}

  <script>
    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', function() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

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
    function toggleFavorite(btn) {
      const row = btn.closest('.channel-row');
      const hash = row.dataset.hash;
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const index = favorites.findIndex(f => f.hash === hash);
      
      if (index === -1) {
        favorites.push({
          hash: hash,
          name: row.dataset.name,
          logo: row.dataset.logo,
          group: row.dataset.group
        });
        btn.classList.add('active');
        btn.querySelector('svg').setAttribute('fill', 'currentColor');
      } else {
        favorites.splice(index, 1);
        btn.classList.remove('active');
        btn.querySelector('svg').setAttribute('fill', 'none');
      }
      
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Add selected to favorites
    function addSelectedToFavorites() {
      const selected = getSelectedChannels();
      if (selected.length === 0) {
        showToastWarning('No channels selected', 'Please select at least one channel to add to favorites.');
        return;
      }
      
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      let addedCount = 0;
      selected.forEach(ch => {
        if (!favorites.find(f => f.hash === ch.hash)) {
          favorites.push(ch);
          addedCount++;
        }
      });
      
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      // Update button states
      selected.forEach(ch => {
        const btn = document.querySelector('.channel-row[data-hash="' + ch.hash + '"] .btn-favorite');
        if (btn) {
          btn.classList.add('active');
          btn.querySelector('svg').setAttribute('fill', 'currentColor');
        }
      });
      
      showToastSuccess('Added to favorites', addedCount + ' channel(s) have been saved.');
    }

    const MAX_DOWNLOAD = 100;

    // Download selected as M3U
    async function downloadSelectedM3U() {
      const selected = getSelectedChannels();
      if (selected.length === 0) {
        showToastWarning('No channels selected', 'Please select at least one channel to download.');
        return;
      }
      
      if (selected.length > MAX_DOWNLOAD) {
        showToastWarning('Selection exceeds limit', 'Free users can download up to ' + MAX_DOWNLOAD + ' channels at once. Subscribe to get the complete M3U playlist with all channels.', { text: 'View Plans', href: '${origin}/plans' });
        return;
      }
      
      // Show loading state
      const btn = document.querySelector('[onclick="downloadSelectedM3U()"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Generating...';
      btn.disabled = true;
      
      try {
        const origin = '${origin}';
        let m3u = '#EXTM3U\\n';
        
        // Fetch play links for each channel
        for (const ch of selected) {
          const response = await fetch(origin + '/api/play/link?hash=' + encodeURIComponent(ch.hash));
          const data = await response.json();
          
          let playUrl = data.play_link || (origin + '/play/error/' + ch.hash);
          
          const logo = ch.logo ? ' tvg-logo="' + ch.logo + '"' : '';
          m3u += '#EXTINF:-1' + logo + ' group-title="' + ch.group + '",' + ch.name + '\\n';
          m3u += playUrl + '\\n';
        }
        
        const timestamp = new Date().toISOString().replace(/[:-]/g, '').replace('T', '_').slice(0, 15);
        const blob = new Blob([m3u], { type: 'audio/x-mpegurl' });
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

    // Initialize favorite buttons
    document.addEventListener('DOMContentLoaded', function() {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      favorites.forEach(f => {
        const btn = document.querySelector('.channel-row[data-hash="' + f.hash + '"] .btn-favorite');
        if (btn) {
          btn.classList.add('active');
          btn.querySelector('svg').setAttribute('fill', 'currentColor');
        }
      });
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
