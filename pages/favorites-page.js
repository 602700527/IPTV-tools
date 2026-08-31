// Favorites Page - Client-side rendered from localStorage
import { PAGE_HEADER } from '../components/page-header.js';
import { PAGE_FOOTER } from '../components/page-footer.js';
import { HEAD_SCRIPTS } from '../components/head-scripts.js';

export function generateFavoritesPage(options = {}) {
  const { origin = 'https://iptv-search.com', header = PAGE_HEADER } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">
  <meta name="theme-color" content="#e50914">
  <title>My Favorites | IPTV Search</title>
  <meta name="description" content="Your favorite IPTV channels">
  <link rel="canonical" href="${origin}/favorites">
  <!-- 收藏夹页面：仅登录用户可见，禁止搜索引擎索引 -->
  <meta name="robots" content="noindex, follow">

  <script>
    
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
      --text-muted: #8b8b8b;
      --border: 1px solid rgba(255,255,255,0.08);
      --border-hover: 1px solid rgba(229,9,20,0.4);
    }


    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-padding-top: 60px; }
    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: inherit; }

    /* Main Content */
    .page-container { max-width: 1400px; margin: 0 auto; padding: 1rem; }
    
    .page-header { margin-bottom: 1rem; }
    .page-header h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.35rem; line-height: 1.2; }
    .page-header p { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4; }

    /* Batch actions bar */
    .batch-bar { display: flex; align-items: center; gap: 0.5rem; padding: 8px 12px; background: #111111 !important; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); margin-bottom: 12px; flex-wrap: wrap; }
    .batch-bar label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); }
    .batch-bar input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent); }
    .selected-count { font-size: 0.8rem; color: var(--text-secondary); margin-left: auto; }
    .selected-count strong { color: var(--accent); }
    .btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 7px 14px; background: var(--bg-hover); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-primary); font-size: 11px; font-weight: 600; cursor: pointer; transition: all var(--transition); }
    .btn:hover { background: var(--accent); border-color: var(--accent); color: #fff; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--accent); border-color: var(--accent); color: #fff; }
    .btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
    .btn-share { background: var(--trust-blue); border-color: var(--trust-blue); color: #fff; }
    .btn-share:hover { background: #2563eb; border-color: #2563eb; }

    /* Channel list */
    .channel-list { display: flex; flex-direction: column; gap: 0.3rem; }
    .channel-row { display: flex; align-items: center; gap: 0.5rem; padding: 6px 10px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); transition: all var(--transition); margin-bottom: 3px; min-height: 36px; }
    .channel-row:hover { border-color: var(--border-hover); background: var(--bg-hover); }
    .channel-row.selected { border-color: var(--accent); background: rgba(229, 9, 20, 0.1); }
    .channel-checkbox { display: flex; align-items: center; cursor: pointer; }
    .channel-checkbox input { width: 18px; height: 18px; accent-color: var(--accent); cursor: pointer; }
    .channel-link { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
    .ch-logo { width: 40px; height: 28px; object-fit: contain; background: var(--bg-secondary); border-radius: 4px; padding: 0.2rem; }
    .ch-logo-placeholder { width: 40px; height: 28px; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); border-radius: 4px; font-size: 1rem; opacity: 0.5; }
    .ch-info { flex: 1; min-width: 0; line-height: 1.2; }
    .ch-name { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ch-group { font-size: 0.7rem; color: var(--text-muted); }
    .btn-remove { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: transparent; border: none; color: var(--text-muted); border-radius: var(--radius); transition: all var(--transition); }
    .btn-remove:hover { color: var(--accent); background: var(--bg-hover); }
    .btn-remove.active { color: var(--accent); }
    .btn-remove.active svg { fill: var(--accent); }

    /* Spinner */
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; vertical-align: middle; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Empty state */
    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-state-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
    .empty-state h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .empty-state .btn { display: inline-flex; }

    /* VIP hint banner */
    .vip-hint {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 10px 14px;
      margin-bottom: 12px;
      background: rgba(229, 9, 20, 0.06);
      border: 1px solid rgba(229, 9, 20, 0.2);
      border-radius: var(--radius);
      font-size: 0.82rem;
      color: var(--text-secondary);
    }
    .vip-hint-text { flex: 1; min-width: 0; }
    .vip-hint-link {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
      white-space: nowrap;
      transition: color 0.2s;
    }
    .vip-hint-link:hover { color: var(--accent-hover); }
    .vip-hint-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: var(--radius);
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .vip-hint-close:hover { color: var(--text-primary); background: var(--bg-hover); }

    @media (max-width: 768px) {
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
  <a href="#main-content" class="skip-link" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;z-index:99999;">Skip to main content</a>
  <style>.skip-link:focus{position:fixed;left:0;top:0;width:auto;height:auto;padding:0.5rem 1rem;background:#e50914;color:#fff;z-index:99999;font-weight:600;}</style>
<body>
  ${header}

  <main class="page-container" id="main-content">
    <div class="page-header">
      <h1><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" width="28" height="28" style="vertical-align:middle;margin-right:0.3em;color:var(--accent)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>My Favorites</h1>
    </div>

    <div id="vipHint" class="vip-hint" style="display:none;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="flex-shrink:0;color:var(--accent);"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
      <span class="vip-hint-text">VIP users can use favorites as their subscription scheme</span>
      <a href="${origin}/account" class="vip-hint-link">Go to Account →</a>
      <button class="vip-hint-close" onclick="document.getElementById('vipHint').style.display='none';localStorage.setItem('vipHintDismissed','1')" aria-label="Dismiss">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
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
      <button class="btn btn-share" onclick="shareFavorites()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        Share
      </button>
      <span class="selected-count"><strong id="selectedCount">0</strong> selected <span id="downloadLimit" style="color: var(--text-muted); font-size: 0.8rem;"></span></span>
    </div>

    <div id="channelList"></div>
  </main>

  ${PAGE_FOOTER}

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
  
    @media (prefers-reduced-motion: reduce) {
      .guest-gift, .gift-icon { animation: none !important; }
      * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
    }</style>

  <script defer src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"
            onerror="window.__fpLoadFailed=true"></script>

    <script>
      const FAVORITES_KEY = 'favorites';
      const MAX_FREE_DOWNLOAD = 10;
      const BATCH_SIZE = 50;
      const STABLE_ID_KEY = 'iptv_stable_id';

      // Stable anonymous ID fallback (used if FingerprintJS CDN is blocked)
      function getStableId() {
        try {
          let id = localStorage.getItem(STABLE_ID_KEY);
          if (!id) {
            id = 'anon_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
            localStorage.setItem(STABLE_ID_KEY, id);
          }
          return id;
        } catch (e) {
          return 'anon_' + Date.now().toString(36);
        }
      }

      // Fingerprint promise (lazy initialization, with stable-ID fallback)
      let fpPromise = null;

      function getFingerprint() {
        if (!fpPromise) {
          if (typeof FingerprintJS === 'undefined' || window.__fpLoadFailed) {
            // CDN blocked or load failed — use stable localStorage ID instead
            fpPromise = Promise.resolve(getStableId());
          } else {
            fpPromise = FingerprintJS.load().then(fp => fp.get()).then(result => result.visitorId).catch(() => getStableId());
          }
        }
        return fpPromise;
      }

    function escapeHtml(str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }

    // Slugify function for SEO-friendly URLs
    // NOTE: Avoid backslash escapes in regex literals; wrangler's
    // esbuild pass strips backslashes in regex literals, breaking them.
    // Affected regexes can silently misbehave (e.g. eating characters).
    // Use String.fromCharCode to build regex strings at runtime.
    function slugify(str) {
      if (!str) return '';
      var ws = String.fromCharCode(9, 10, 11, 12, 13, 32);
      var reWs = new RegExp('[' + ws + ']+', 'g');
      var reKeep = new RegExp('[^a-zA-Z0-9' + String.fromCharCode(0x4e00) + '-' + String.fromCharCode(0x9fff) + String.fromCharCode(0xff00) + '-' + String.fromCharCode(0xffef) + String.fromCharCode(0xfe00) + '-' + String.fromCharCode(0xfeff) + String.fromCharCode(0x3000) + '-' + String.fromCharCode(0x303f) + String.fromCharCode(0x2000) + '-' + String.fromCharCode(0x206f) + String.fromCharCode(0xfe30) + '-' + String.fromCharCode(0xfe4f) + String.fromCharCode(0x2600) + '-' + String.fromCharCode(0x26ff) + '-]', 'g');
      var reDash = /-+/g;
      var reEdge = /^-+|-+$/g;
      return str.trim().replace(reWs, '-').replace(reKeep, '').replace(reDash, '-').replace(reEdge, '');
    }

    // Build SEO-friendly channel URL (pure slug, no hash)
    function buildChannelUrl(name) {
      return '/channel/' + slugify(name);
    }

    // Toast functions
    function showToast(options) { const { title = '', message = '', type = 'info', duration = 4000, action = null } = options; const container = document.getElementById('toastContainer'); const toast = document.createElement('div'); toast.className = 'toast toast-' + type; const icons = { success: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>', error: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>', warning: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', info: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' }; let actionHtml = ''; if (action) { actionHtml = '<div class="toast-action"><a href="' + action.href + '">' + action.text + '</a></div>'; } toast.innerHTML = '<div class="toast-icon-wrap">' + icons[type] + '</div><div class="toast-content">' + (title ? '<div class="toast-title">' + title + '</div>' : '') + (message ? '<div class="toast-message">' + message + '</div>' : '') + actionHtml + '</div><button class="toast-close" onclick="this.parentElement.remove()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'; container.appendChild(toast); if (duration > 0) { setTimeout(() => { toast.classList.add('toast-exit'); setTimeout(() => toast.remove(), 300); }, duration); } return toast; }
    function showToastSuccess(message, title = 'Success') { return showToast({ type: 'success', title, message }); }
    function showToastError(message, title = 'Error') { return showToast({ type: 'error', title, message, duration: 6000 }); }
    function showToastWarning(message, title = 'Warning', action = null) { return showToast({ type: 'warning', title, message, action }); }
    function showToastInfo(message, title = '', action = null) { return showToast({ type: 'info', title, message, action }); }

    function getFavorites() { try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; } catch { return []; } }
    function saveFavorites(favorites) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }

    // Check if user is logged in
    function isLoggedIn() {
      return !!localStorage.getItem('auth_token');
    }

    // Load favorites from cloud if logged in
    async function loadFavorites() {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return getFavorites();
      }

      try {
        const response = await fetch('${origin}/api/favorites', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await response.json();
        // 仅当 API 成功返回时才用云端数据覆盖 localStorage
        if (data.success && Array.isArray(data.favorites)) {
          const localCount = (JSON.parse(localStorage.getItem('favorites') || '[]') || []).length;
          // 本地数量多于云端时保留本地，避免 5 分钟延迟期间的新增被云端旧数据覆盖
          if (data.favorites.length >= localCount) {
            saveFavorites(data.favorites);
            return data.favorites;
          }
        }
        // 401/403 或其他错误：保留 localStorage 数据，不覆盖
      } catch (e) {
        console.error('Failed to load cloud favorites:', e);
      }

      return getFavorites();
    }

    // Dedup favorites by channel_name
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

    // Best-effort flush on unload
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
        const name = escapeHtml(ch.name);
        const logo = escapeHtml(ch.logo || '');
        const group = escapeHtml(ch.group || '');
        const DQ = String.fromCharCode(34);
        const SQ = String.fromCharCode(39);
        const logoHtml = ch.logo
          ? '<img src=' + DQ + logo + DQ + ' alt=' + DQ + name + DQ + ' class=' + DQ + 'ch-logo' + DQ + ' onerror=' + DQ + 'this.style.display=' + SQ + 'none' + SQ + ';this.nextElementSibling.style.display=' + SQ + 'flex' + SQ + DQ + '>'
            + '<div class="ch-logo-placeholder" style="display:none">📺</div>'
          : '<div class="ch-logo-placeholder">📺</div>';
        const channelUrl = buildChannelUrl(ch.name);
        return '<div class="channel-row" data-name="' + name + '" data-hash="' + (ch.hash || '') + '" data-logo="' + logo + '" data-group="' + group + '">'
          + '<label class="channel-checkbox">'
          + '<input type="checkbox" onchange="updateSelectedCount()">'
          + '<span class="checkmark"></span>'
          + '</label>'
          + '<a href="' + origin + channelUrl + '" class="channel-link">'
          + '<div class="ch-logo">' + logoHtml + '</div>'
          + '<div class="ch-info">'
          + '<div class="ch-name">' + name + '</div>'
          + '<div class="ch-group">' + group + '</div>'
          + '</div>'
          + '</a>'
          + '<button class="btn-remove active" data-hash="' + (ch.hash || '') + '" onclick="removeFavorite(this)" title="Remove from favorites">'
          + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
          + '</button>'
          + '</div>';
      }).join('') + '</div>';
      channelList.innerHTML = html;
    }

    function removeFavorite(btn) {
      const hash = btn.closest('.channel-row').dataset.hash;
      const favorites = getFavorites();
      const newFavorites = favorites.filter(f => f.hash !== hash);
      saveFavorites(newFavorites);
      syncFavoritesToCloud(newFavorites, true);
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
      const count = checked.length;
      document.getElementById('selectedCount').textContent = count;
      
      const limitSpan = document.getElementById('downloadLimit');
      if (count > MAX_FREE_DOWNLOAD) {
        limitSpan.textContent = ' (' + (count - MAX_FREE_DOWNLOAD) + ' over limit)';
        limitSpan.style.color = 'var(--accent)';
      } else {
        limitSpan.textContent = '';
      }
      
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
        showToastWarning('No channels selected', 'Please select at least one channel to remove.');
        return;
      }
      
      const favorites = getFavorites();
      const selectedNames = new Set(selected.map(s => s.name));
      const newFavorites = favorites.filter(f => !selectedNames.has(f.name));
      saveFavorites(newFavorites);
      syncFavoritesToCloud(newFavorites, true);
      showToastSuccess('Removed ' + selected.length + ' channel(s) from favorites');
      renderFavorites();
    }

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

    async function downloadSelectedM3U() {
      // Check if user is logged in
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // 1) 登录提示
        showToast({
          type: 'warning',
          title: 'Please log in',
          message: 'Downloading favorites requires an account. Log in to sync favorites across devices.<br><a href="/login?redirect=/favorites" style="color:#e50914;font-weight:600;">Log in →</a>',
          duration: 5000
        });
        // 2) VIP 营销（FOMO + 价值主张）
        setTimeout(function () {
          const upgradeMessage = '<div style="text-align:center;padding:8px 0;">';
          upgradeMessage += '<div style="background:linear-gradient(135deg,rgba(229,9,20,0.1),rgba(229,9,20,0.05));border:1px solid rgba(229,9,20,0.3);border-radius:12px;padding:14px;margin:8px 0;">';
          upgradeMessage += '<p style="color:#fff;font-size:15px;margin-bottom:6px;">🎁 开通 VIP → <strong style="color:#e50914;">无限下载</strong> 全部频道</p>';
          upgradeMessage += '<p style="color:#aaa;font-size:13px;">云同步收藏 · 多设备共享 · 7 天无理由退款</p>';
          upgradeMessage += '</div>';
          upgradeMessage += '<p style="font-size:12px;color:#666;margin-top:4px;">👥 已有 5000+ 用户升级会员</p>';
          upgradeMessage += '</div>';
          showToast({
            type: 'info',
            title: '解锁全部频道',
            message: upgradeMessage,
            duration: 8000,
            action: { text: '查看会员方案 →', href: '/subscription' }
          });
        }, 800);
        return;
      }

      const selected = getSelectedChannels();
      if (selected.length === 0) {
        showToastWarning('No channels selected', 'Please select at least one channel to download.');
        return;
      }

      // Check member status first
      const isMember = await checkMemberStatus();

      if (!isMember && selected.length > MAX_FREE_DOWNLOAD) {
        // 营销心理：FOMO + 价值主张 + 损失厌恶
        const upgradeMessage = '<div style="text-align:center;padding:8px 0;">';
        upgradeMessage += '<p style="font-size:14px;color:#888;margin-bottom:8px;">已选择 <strong style="color:#e50914;font-size:20px;">' + selected.length + '</strong> 个频道</p>';
        upgradeMessage += '<div style="background:linear-gradient(135deg,rgba(229,9,20,0.1),rgba(229,9,20,0.05));border:1px solid rgba(229,9,20,0.3);border-radius:12px;padding:16px;margin:12px 0;">';
        upgradeMessage += '<p style="color:#fff;font-size:15px;margin-bottom:6px;">免费版仅可下载 <strong style="color:#e50914;">10 个</strong> 频道</p>';
        upgradeMessage += '<p style="color:#aaa;font-size:13px;">开通会员 → 无限制下载所有频道</p>';
        upgradeMessage += '</div>';
        upgradeMessage += '<p style="font-size:12px;color:#666;margin-top:8px;">👥 已有 5000+ 用户升级会员</p>';
        upgradeMessage += '</div>';
        showToast({
          type: 'info',
          title: '🎁 解锁全部频道 - 无限制下载',
          message: upgradeMessage,
          duration: 8000,
          action: { text: '立即升级 →', href: '${origin}/subscription' }
        });
        return;
      }

      // Show loading state
      const btn = document.querySelector('[onclick="downloadSelectedM3U()"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Generating...';
      btn.disabled = true;

      try {
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
        const response = await fetch('${origin}/api/channels/m3u', {
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
        const now = new Date();
        const timeStr = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '_' + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favorites_' + timeStr + '.m3u';
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

    // Theme toggle with icon update
    
    
    // Initialize theme icons on page load
    (function() {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const saved = localStorage.getItem('theme');
      const isDark = saved ? saved === 'dark' : prefersDark;
    })();
    
    

    // Share favorites
    function shareFavorites() {
      const favorites = getFavorites();
      if (favorites.length === 0) {
        showToastWarning('No favorites', 'Add some channels to favorites first!');
        return;
      }
      const text = 'My IPTV Favorites: ' + favorites.map(function(f) { return f.name; }).join(', ');
      const url = window.location.origin;  // Share homepage, not favorites page
      if (navigator.share) {
        navigator.share({ title: 'IPTV Search - Free Live TV Channels', text: text, url: url });
      } else {
        var copyText = text + ' ' + url;
        navigator.clipboard.writeText(copyText);
        showToastSuccess('Copied!', 'Link copied to clipboard');
      }
    }

    // Initialize
    loadFavorites().then(favorites => {
      renderFavorites();
      // VIP hint: show only for VIP members with favorites, not previously dismissed
      if (favorites.length > 0 && localStorage.getItem('vipHintDismissed') !== '1') {
        fetch('${origin}/api/member/status', { credentials: 'include' })
          .then(r => r.json())
          .then(d => { if (d.isMember) document.getElementById('vipHint').style.display = 'flex'; })
          .catch(() => {});
      }
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
</body>
</html>`;
}
