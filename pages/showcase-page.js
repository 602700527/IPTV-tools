// 频道展示页 - 用于电商客户展示 (分类筛选 + 搜索)
export function generateShowcasePage(options = {}) {
  const {
    origin = 'https://iptv-search.com',
    channels = [],
    groups = [],
    totalChannels = 0,
    totalGroups = 0
  } = options;

  // 确保 groups 是字符串数组，过滤掉非字符串项
  const groupNames = Array.isArray(groups)
    ? groups.filter(g => typeof g === 'string').sort()
    : [];

  // 预生成所有频道的JSON数据供前端搜索
  const channelsJson = JSON.stringify(channels.map(ch => ({
    name: ch.channel_name || 'Unknown',
    logo: ch.logo || '',
    group: ch.group_title || 'Other',
    hash: ch.channel_hash || ''
  })));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">
  <meta name="theme-color" content="#e50914">
  <title>IPTV Channel Showcase | Premium Live TV</title>
  <meta name="description" content="Browse our premium IPTV channel lineup - ${totalChannels}+ live TV channels across ${totalGroups}+ categories">
  
  <style>
    :root {
      --accent: #e50914;
      --accent-hover: #ff1a1a;
      --bg-primary: #0a0a0a;
      --bg-secondary: #0f0f0f;
      --bg-card: #141414;
      --text-primary: #ffffff;
      --text-secondary: #888888;
      --text-muted: #8b8b8b;
      --border: 1px solid rgba(255,255,255,0.08);
      --radius: 12px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: flex-end;
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg-primary);
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border-bottom: 1px solid var(--border);
      padding: 3rem 2rem;
      text-align: center;
    }

    .hero-badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--accent), #ff3b30);
      color: white;
      padding: 0.4rem 1.2rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .hero h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #fff 0%, #888 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero p {
      color: var(--text-secondary);
      font-size: 1rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 2.5rem;
      margin-top: 1.5rem;
    }

    .stat-item { text-align: center; }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Search & Filter Section */
    .search-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .search-filter-bar {
      display: flex;
      gap: 1rem;
      align-items: stretch;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 280px;
      position: relative;
    }

    .search-box input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 2.75rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text-primary);
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }

    .search-box input:focus {
      border-color: var(--accent);
    }

    .search-box input::placeholder {
      color: var(--text-muted);
    }

    .search-box::before {
      content: '';
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") center/contain no-repeat;
      pointer-events: none;
    }

    .filter-select {
      min-width: 200px;
      padding: 0.875rem 1rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text-primary);
      font-size: 0.95rem;
      outline: none;
      cursor: pointer;
      transition: border-color 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      padding-right: 2.5rem;
    }

    .filter-select:focus,
    .filter-select:hover {
      border-color: var(--accent);
    }

    .results-info {
      margin-top: 1.5rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .results-info span {
      color: var(--accent);
      font-weight: 600;
    }

    /* Channel Grid */
    .channel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .channel-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem 0.75rem;
      text-align: center;
      transition: all 0.25s ease;
      cursor: default;
    }

    .channel-card:hover {
      border-color: var(--accent);
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(229, 9, 20, 0.12);
    }

    .channel-logo {
      width: 70px;
      height: 50px;
      margin: 0 auto 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .channel-logo img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .ch-logo-placeholder {
      width: 50px;
      height: 38px;
      background: var(--bg-secondary);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .channel-name {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .channel-group-tag {
      font-size: 0.7rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary);
    }

    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    /* Search Guidance */
    .search-guidance {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary);
    }

    .search-guidance-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .search-guidance h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .search-guidance p {
      font-size: 0.95rem;
      color: var(--text-muted);
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(229, 9, 20, 0.05) 100%);
      border: 1px solid rgba(229, 9, 20, 0.3);
      border-radius: var(--radius);
      padding: 2.5rem;
      text-align: center;
      margin: 3rem auto;
      max-width: 800px;
    }

    .cta-section h2 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .cta-section p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }

    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, var(--accent), #ff3b30);
      color: white;
      padding: 0.875rem 2rem;
      border-radius: 50px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);
    }

    /* Footer */
    .page-footer {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--border);
      margin-top: 2rem;
    }

    /* Translate Dropdown */
    #translate { position: relative; display: inline-flex; align-items: center; }
    #translateSelectLanguage {
      appearance: none;
      -webkit-appearance: none;
      padding: 0 0.5rem;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 0.75rem;
      cursor: pointer;
      outline: none;
      transition: color 0.2s;
      min-width: 50px;
    }
    #translateSelectLanguage:focus, #translateSelectLanguage:hover { color: var(--accent); }

    /* Responsive */
    @media (max-width: 768px) {
      .hero { padding: 2rem 1rem; }
      .hero h1 { font-size: 1.75rem; }
      .hero-stats { gap: 1.5rem; }
      .stat-value { font-size: 1.5rem; }
      .search-section { padding: 1.5rem 1rem; }
      .search-filter-bar { flex-direction: column; }
      .search-box, .filter-select { min-width: 100%; }
      .channel-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 0.75rem; }
      </style>
</head>
  <a href="#main-content" class="skip-link" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;z-index:99999;">Skip to main content</a>
  <style>.skip-link:focus{position:fixed;left:0;top:0;width:auto;height:auto;padding:0.5rem 1rem;background:#e50914;color:#fff;z-index:99999;font-weight:600;}
    @media (prefers-reduced-motion: reduce) {
      .guest-gift, .gift-icon { animation: none !important; }
      * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
    }</style>
<body>

  <header class="page-header">
    <div id="translate"></div>
  </header>

  <section class="hero">
    <div class="hero-badge" translate>Premium IPTV Service</div>
    <h1 translate>Channel Showcase</h1>
    <p translate>Search and browse our extensive collection of live TV channels</p>
    <div class="hero-stats">
      <div class="stat-item">
        <div class="stat-value">${totalChannels.toLocaleString()}</div>
        <div class="stat-label" translate>Live Channels</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${totalGroups}</div>
        <div class="stat-label" translate>Categories</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">24/7</div>
        <div class="stat-label" translate>Entertainment</div>
      </div>
    </div>
  </section>

  <section class="search-section">
    <div class="search-filter-bar">
      <select id="categorySelect" class="filter-select">
        <option value="" translate>All Categories</option>
        ${groupNames.length === 0 ? '<option disabled>No categories available</option>' : groupNames.map(g => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join('')}
      </select>
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Search channels...">
      </div>
    </div>
    <div class="results-info" id="resultsInfo">
      <span>${totalChannels.toLocaleString()}</span> <span translate>channels available</span>
    </div>
    <div class="channel-grid" id="channelGrid">
      <div class="search-guidance" style="grid-column: 1/-1;">
        <div class="search-guidance-icon">🔍</div>
        <h3 translate>Search for Channels</h3>
        <p translate>Select a category or enter keywords to find channels</p>
      </div>
    </div>
  </section>

  <footer class="page-footer">
    <p>&copy; 2024 IPTV Search. All rights reserved. | <span translate>Premium Live TV Service</span></p>
  </footer>

  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    // All channels data
    const allChannels = ${channelsJson};

    // DOM elements - get them after DOM is ready
    let searchInput, categorySelect, channelGrid, resultsInfo;

    // Initialize translate
    function initTranslate() {
      if (typeof translate !== 'undefined' && translate.language) {
        translate.selectLanguageTag.show = true;
        translate.selectLanguageTag.documentId = 'translate';
        translate.language.setLocal('english');
        translate.service.use('client.edge');
        translate.listener.start();
        translate.setAutoDiscriminateLocalLanguage();
        translate.execute();
      } else {
        setTimeout(initTranslate, 100);
      }
    }

    function escapeHtml(text) {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Render channels
    function renderChannels(channels, hasFilters) {
      // If no filters applied, show guidance
      if (!hasFilters) {
        channelGrid.innerHTML = '<div class="search-guidance" style="grid-column: 1/-1;">' +
          '<div class="search-guidance-icon">🔍</div>' +
          '<h3 translate>Search for Channels</h3>' +
          '<p translate>Select a category or enter keywords to find channels</p>' +
          '</div>';
        resultsInfo.innerHTML = '<span>' + allChannels.length.toLocaleString() + '</span> <span translate>channels available</span>';
        return;
      }

      // If no results
      if (channels.length === 0) {
        channelGrid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;">' +
          '<div class="empty-state-icon">🔍</div>' +
          '<h3 translate>No channels found</h3>' +
          '<p translate>Try adjusting your search or filter criteria</p>' +
          '</div>';
        resultsInfo.innerHTML = '<span translate>0</span> <span translate>channels found</span>';
        return;
      }

      const html = channels.map(ch => {
        const logoHtml = ch.logo
          ? '<img src="' + escapeHtml(ch.logo) + '" alt="' + escapeHtml(ch.name) + '" class="ch-logo" onerror="this.style.display=\\'none\\';this.nextElementSibling.style.display=\\'flex\\'">' +
            '<div class="ch-logo-placeholder" style="display:none">📺</div>'
          : '<div class="ch-logo-placeholder">📺</div>';
        return '<div class="channel-card">' +
          '<div class="channel-logo">' + logoHtml + '</div>' +
          '<div class="channel-name">' + escapeHtml(ch.name) + '</div>' +
          '<div class="channel-group-tag">' + escapeHtml(ch.group) + '</div>' +
          '</div>';
      }).join('');

      channelGrid.innerHTML = html;
      resultsInfo.innerHTML = '<span>' + channels.length + '</span> <span translate>channels found</span>';
    }

    // Filter channels
    function filterChannels() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const selectedCategory = categorySelect.value;

      // Check if any filters are applied
      const hasFilters = searchTerm || selectedCategory;

      let filtered = allChannels;

      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(ch => ch.group === selectedCategory);
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(ch => 
          ch.name.toLowerCase().includes(searchTerm) ||
          ch.group.toLowerCase().includes(searchTerm)
        );
      }

      renderChannels(filtered, hasFilters);
    }

    // Initialize when DOM is ready
    function init() {
      searchInput = document.getElementById('searchInput');
      categorySelect = document.getElementById('categorySelect');
      channelGrid = document.getElementById('channelGrid');
      resultsInfo = document.getElementById('resultsInfo');

      // Add event listeners
      searchInput.addEventListener('input', filterChannels);
      categorySelect.addEventListener('change', filterChannels);

      // Initialize translate
      initTranslate();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  </script>
</body>
</html>`;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}