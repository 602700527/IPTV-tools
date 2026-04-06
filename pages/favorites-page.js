// Favorites Page - Client-side rendered from localStorage

export function generateFavoritesPage(options = {}) {
  const { origin = 'https://iptv-search.com' } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Favorites | IPTV Search</title>
  <meta name="description" content="Your favorite IPTV channels">
  <link rel="canonical" href="${origin}/favorites">
  
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

    /* Header */
    .header { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
    .logo-icon svg { width: 36px; height: 36px; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .search-box { position: relative; width: 300px; }
    .search-box form { display: flex; }
    .search-box input { width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; color: var(--text-primary); font-size: 0.9rem; outline: none; transition: border-color var(--transition); }
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

    /* Main Content */
    .page-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .page-header p { color: var(--text-secondary); font-size: 1rem; }

    /* Batch actions bar */
    .batch-bar { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 1rem; flex-wrap: wrap; }
    .batch-bar label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem; color: var(--text-secondary); }
    .batch-bar input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent); }
    .selected-count { font-size: 0.9rem; color: var(--text-secondary); margin-left: auto; }
    .selected-count strong { color: var(--accent); }
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--bg-hover); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-primary); font-size: 0.85rem; cursor: pointer; transition: all var(--transition); }
    .btn:hover { background: var(--accent); border-color: var(--accent); color: #fff; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--accent); border-color: var(--accent); color: #fff; }
    .btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }

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
    .btn-remove { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: transparent; border: none; color: var(--text-muted); border-radius: var(--radius); transition: all var(--transition); }
    .btn-remove:hover { color: var(--accent); background: var(--bg-hover); }
    .btn-remove.active { color: var(--accent); }
    .btn-remove.active svg { fill: var(--accent); }

    /* Empty state */
    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-state-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
    .empty-state h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .empty-state .btn { display: inline-flex; }

    /* Footer */
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
      .page-container { padding: 1rem; }
      .page-header h1 { font-size: 1.5rem; }
      .batch-bar { padding: 0.75rem; gap: 0.5rem; }
      .btn { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
      .ch-logo { width: 40px; height: 28px; }
      .ch-logo-placeholder { width: 40px; height: 28px; font-size: 1rem; }
      .btn-remove { width: 32px; height: 32px; }
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
        <a href="${origin}/favorites" class="pill-btn active" title="My Favorites">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
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

  <main class="page-container">
    <div class="page-header">
      <h1><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" width="28" height="28" style="vertical-align:middle;margin-right:0.3em;color:var(--accent)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>My Favorites</h1>
      <p>Your saved channels. Select channels to download M3U or remove from favorites.</p>
    </div>

    <div id="batchBar" class="batch-bar" style="display:none;">
      <label>
        <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
        Select All
      </label>
      <button class="btn" onclick="removeSelected()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        Remove
      </button>
      <button class="btn btn-primary" onclick="downloadSelectedM3U()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download M3U
      </button>
      <span class="selected-count"><strong id="selectedCount">0</strong> selected</span>
    </div>

    <div id="channelList"></div>
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

  <script>
    const FAVORITES_KEY = 'favorites';

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function getFavorites() {
      try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
      } catch { return []; }
    }

    function saveFavorites(favorites) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }

    function renderFavorites() {
      const favorites = getFavorites();
      const channelList = document.getElementById('channelList');
      const batchBar = document.getElementById('batchBar');

      if (favorites.length === 0) {
        batchBar.style.display = 'none';
        channelList.innerHTML = \`
          <div class="empty-state">
            <div class="empty-state-icon">⭐</div>
            <h2>No Favorites Yet</h2>
            <p>Start adding channels to your favorites from the category pages or channel detail pages.</p>
            <a href="${origin}/" class="btn btn-primary">Browse Channels</a>
          </div>
        \`;
        return;
      }

      batchBar.style.display = 'flex';
      
      const html = '<div class="channel-list">' + favorites.map(ch => {
        const hash = escapeHtml(ch.hash);
        const name = escapeHtml(ch.name);
        const logo = escapeHtml(ch.logo || '');
        const group = escapeHtml(ch.group || '');
        const logoHtml = ch.logo 
          ? \`<img src="\${logo}" alt="\${name}" class="ch-logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="ch-logo-placeholder" style="display:none">📺</div>\`
          : '<div class="ch-logo-placeholder">📺</div>';
        return \`<div class="channel-row" data-hash="\${hash}" data-name="\${name}" data-logo="\${logo}" data-group="\${group}">
          <label class="channel-checkbox">
            <input type="checkbox" onchange="updateSelectedCount()">
            <span class="checkmark"></span>
          </label>
          <a href="${origin}/channel/\${ch.hash}" class="channel-link">
            <div class="ch-logo">\${logoHtml}</div>
            <div class="ch-info">
              <div class="ch-name">\${name}</div>
              <div class="ch-group">\${group}</div>
            </div>
          </a>
          <button class="btn-remove active" data-hash="\${hash}" onclick="removeFavorite(this)" title="Remove from favorites">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </button>
        </div>\`;
      }).join('') + '</div>';
      channelList.innerHTML = html;
    }

    function removeFavorite(btn) {
      const hash = btn.closest('.channel-row').dataset.hash;
      const favorites = getFavorites();
      const newFavorites = favorites.filter(f => f.hash !== hash);
      saveFavorites(newFavorites);
      renderFavorites();
    }

    function toggleSelectAll() {
      const selectAll = document.getElementById('selectAll');
      const checkboxes = document.querySelectorAll('.channel-row input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
        cb.closest('.channel-row').classList.toggle('selected', selectAll.checked);
      });
      updateSelectedCount();
    }

    function updateSelectedCount() {
      const checked = document.querySelectorAll('.channel-row input[type="checkbox"]:checked');
      document.getElementById('selectedCount').textContent = checked.length;
      
      document.querySelectorAll('.channel-row').forEach(row => {
        const cb = row.querySelector('input[type="checkbox"]');
        row.classList.toggle('selected', cb.checked);
      });
    }

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

    function removeSelected() {
      const selected = getSelectedChannels();
      if (selected.length === 0) {
        alert('Please select at least one channel');
        return;
      }
      
      if (!confirm('Remove ' + selected.length + ' channel(s) from favorites?')) {
        return;
      }
      
      const favorites = getFavorites();
      const selectedHashes = selected.map(s => s.hash);
      const newFavorites = favorites.filter(f => !selectedHashes.includes(f.hash));
      saveFavorites(newFavorites);
      renderFavorites();
    }

    function downloadSelectedM3U() {
      const selected = getSelectedChannels();
      if (selected.length === 0) {
        alert('Please select at least one channel');
        return;
      }
      
      let m3u = '#EXTM3U\\n';
      selected.forEach(ch => {
        const logo = ch.logo ? ' tvg-logo="' + ch.logo + '"' : '';
        m3u += '#EXTINF:-1' + logo + ' group-title="' + ch.group + '",' + ch.name + '\\n';
        m3u += '${origin}/live/' + ch.hash + '\\n';
      });
      
      const blob = new Blob([m3u], { type: 'audio/x-mpegurl' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favorites.m3u';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', function() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    // Initialize
    renderFavorites();
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
