// Favorites Page - Client-side rendered from localStorage
import { PAGE_HEADER } from '../components/page-header.js';
import { PAGE_FOOTER } from '../components/page-footer.js';

export function generateFavoritesPage(options = {}) {
  const { origin = 'https://iptv-search.com', header = PAGE_HEADER } = options;

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

    /* Spinner */
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; vertical-align: middle; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Empty state */
    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-state-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
    .empty-state h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .empty-state .btn { display: inline-flex; }

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
  ${header}

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
  </style>

  <script>
    const FAVORITES_KEY = 'favorites';
    const MAX_FREE_DOWNLOAD = 100;
    const BATCH_SIZE = 50;

    function escapeHtml(str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }

    // Toast functions
    function showToast(options) { const { title = '', message = '', type = 'info', duration = 4000, action = null } = options; const container = document.getElementById('toastContainer'); const toast = document.createElement('div'); toast.className = 'toast toast-' + type; const icons = { success: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>', error: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>', warning: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', info: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' }; let actionHtml = ''; if (action) { actionHtml = '<div class="toast-action"><a href="' + action.href + '">' + action.text + '</a></div>'; } toast.innerHTML = '<div class="toast-icon-wrap">' + icons[type] + '</div><div class="toast-content">' + (title ? '<div class="toast-title">' + title + '</div>' : '') + (message ? '<div class="toast-message">' + message + '</div>' : '') + actionHtml + '</div><button class="toast-close" onclick="this.parentElement.remove()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'; container.appendChild(toast); if (duration > 0) { setTimeout(() => { toast.classList.add('toast-exit'); setTimeout(() => toast.remove(), 300); }, duration); } return toast; }
    function showToastSuccess(message, title = 'Success') { return showToast({ type: 'success', title, message }); }
    function showToastError(message, title = 'Error') { return showToast({ type: 'error', title, message, duration: 6000 }); }
    function showToastWarning(message, title = 'Warning', action = null) { return showToast({ type: 'warning', title, message, action }); }
    function showToastInfo(message, title = '', action = null) { return showToast({ type: 'info', title, message, action }); }

    function getFavorites() { try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; } catch { return []; } }
    function saveFavorites(favorites) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }

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
        showToastWarning('No channels selected', 'Please select at least one channel to remove.');
        return;
      }
      
      const favorites = getFavorites();
      const selectedHashes = selected.map(s => s.hash);
      const newFavorites = favorites.filter(f => !selectedHashes.includes(f.hash));
      saveFavorites(newFavorites);
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
      const selected = getSelectedChannels();
      if (selected.length === 0) {
        showToastWarning('No channels selected', 'Please select at least one channel to download.');
        return;
      }
      
      // Check member status first
      const isMember = await checkMemberStatus();
      
      if (!isMember && selected.length > MAX_FREE_DOWNLOAD) {
        // Marketing Psychology: FOMO + Value Proposition + Loss Aversion
        const upgradeMessage = 'You selected <strong style="color:#e50914">' + selected.length + '</strong> channels<br><br>' +
          '💔 Free users can download up to <strong>' + MAX_FREE_DOWNLOAD + '</strong> channels<br>' +
          '🎁 <strong style="color:#34c759">Upgrade to Premium</strong> - download all 10,000+ channels at once<br><br>' +
          '<span style="font-size:12px;color:#888;">👥 5,000+ users already upgraded - enjoy unlimited access</span>';
        showToast({
          type: 'info',
          title: '🎁 Unlock All Channels - No More Limits',
          message: upgradeMessage,
          duration: 8000,
          action: { text: 'Upgrade Now →', href: '${origin}/plans' }
        });
        return;
      }
      
      // Show loading state
      const btn = document.querySelector('[onclick="downloadSelectedM3U()"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Generating...';
      btn.disabled = true;
      
      try {
        let m3u = '#EXTM3U\\n';
        
        // Process function for each channel
        const processChannel = async (ch) => {
          const response = await fetch('${origin}/api/play/link?hash=' + encodeURIComponent(ch.hash));
          const data = await response.json();
          let playUrl = data.play_link || ('${origin}/play/error/' + ch.hash);
          const logo = ch.logo ? ' tvg-logo="' + ch.logo + '"' : '';
          return '#EXTINF:-1' + logo + ' group-title="' + ch.group + '",' + ch.name + '\\n' + playUrl + '\\n';
        };
        
        // Use batch processing for members (no limit), direct for free users (under limit)
        if (isMember && selected.length > BATCH_SIZE) {
          // Add progress element if not exists
          let progressEl = document.getElementById('downloadProgress');
          if (!progressEl) {
            const progressSpan = document.createElement('span');
            progressSpan.id = 'downloadProgress';
            progressSpan.style.cssText = 'margin-left: 10px; font-size: 0.85rem; color: var(--text-muted);';
            btn.parentNode.appendChild(progressSpan);
          }
          
          // Process in batches with progress updates
          const lines = await processChannelsInBatches(selected, processChannel, BATCH_SIZE);
          m3u += lines.join('');
          
          // Remove progress element
          const progEl = document.getElementById('downloadProgress');
          if (progEl) progEl.remove();
        } else {
          // Direct processing for small batches or non-members
          for (const ch of selected) {
            m3u += await processChannel(ch);
          }
        }
        
        const blob = new Blob([m3u], { type: 'audio/x-mpegurl' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const now = new Date();
        const timeStr = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '_' + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
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
