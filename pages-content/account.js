// 静态页面内容模块 - 账户中心（YouTube Studio 风格）
export const pageTitle = 'My Account - IPTV Search';
export const pageDescription = 'Manage your IPTV Search account, view subscription status and order history.';
export const canonical = 'https://iptv-search.com/account';
export const robots = 'noindex, follow';

export const styles = `
  /* ========================================
     Account Page Styles (YouTube Studio Style)
     ======================================== */

  :root {
    --bg-primary: #0f0f0f;
    --bg-secondary: #1a1a1a;
    --bg-sidebar: #121212;
    --bg-card: #1a1a1a;
    --bg-hover: #272727;
    --bg-active: #272727;
    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.15);
    --text-primary: #ffffff;
    --text-secondary: #aaaaaa;
    --text-muted: #717171;
    --accent: #e50914;
    --accent-hover: #f40612;
    --success: #2ea043;
    --warning: #ffb000;
    --error: #ff4e4e;
    --tier-gold: #ffd700;
    --tier-emerald: #50c878;
    --radius: 8px;
    --sidebar-width: 240px;
  }

  [data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f9f9f9;
    --bg-sidebar: #ffffff;
    --bg-card: #ffffff;
    --bg-hover: #f0f0f0;
    --bg-active: #e5e5e5;
    --border: rgba(0, 0, 0, 0.12);
    --border-hover: rgba(0, 0, 0, 0.2);
    --text-primary: #0f0f0f;
    --text-secondary: #606060;
    --text-muted: #909090;
  }

  * { box-sizing: border-box; }

  .main-content {
    flex: 1;
    width: 100%;
    margin-top: 64px;
    background: var(--bg-primary);
    min-height: calc(100vh - 64px);
  }

  .dashboard-layout {
    display: flex;
    min-height: calc(100vh - 64px);
    max-width: 1280px;
    margin: 0 auto;
  }

  /* ===== Sidebar ===== */
  .sidebar {
    width: var(--sidebar-width);
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border);
    padding: 12px 0;
    position: fixed;
    top: 64px;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    z-index: 100;
  }

  .sidebar-section {
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-section:last-child { border-bottom: none; }

  .sidebar-label {
    padding: 8px 24px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 24px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    font-size: 14px;
    font-family: inherit;
  }

  .sidebar-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .sidebar-item.active {
    background: var(--bg-active);
    color: var(--text-primary);
    border-left: 3px solid var(--accent);
    padding-left: 21px;
  }

  .sidebar-item svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .sidebar-logout {
    color: var(--error);
  }

  .sidebar-logout:hover {
    background: rgba(255, 78, 78, 0.1);
    color: var(--error);
  }

  /* ===== Main Content ===== */
  .content-wrapper {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: 24px 32px;
    max-width: 960px;
  }

  /* ===== Section Title ===== */
  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 20px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  /* ===== Profile Card ===== */
  .profile-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .profile-avatar {
    width: 56px;
    height: 56px;
    background: var(--accent);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .profile-avatar.vip {
    background: linear-gradient(135deg, var(--tier-gold), #ffaa00);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
  }

  .profile-info { flex: 1; }

  .profile-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .profile-email {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0 0 8px 0;
  }

  .profile-badges {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 600;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .badge-vip {
    background: rgba(255, 215, 0, 0.15);
    color: var(--tier-gold);
    border: 1px solid rgba(255, 215, 0, 0.3);
  }

  .badge-verified {
    background: rgba(46, 160, 67, 0.15);
    color: var(--success);
    border: 1px solid rgba(46, 160, 67, 0.3);
  }

  .badge-member {
    background: rgba(229, 9, 20, 0.1);
    color: var(--accent);
    border: 1px solid rgba(229, 9, 20, 0.2);
  }

  .vip-star {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: var(--tier-gold);
    border-radius: 4px;
    font-size: 10px;
  }

  .vip-star svg { width: 11px; height: 11px; fill: #000; stroke: none; }

  /* ===== Settings Group ===== */
  .settings-group {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 20px;
    overflow: hidden;
  }

  .settings-group-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-hover);
  }

  .settings-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
  }

  .settings-row:last-child { border-bottom: none; }

  .settings-row:hover { background: var(--bg-hover); }

  .settings-label {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
  }

  .settings-desc {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .settings-value {
    font-size: 14px;
    color: var(--text-secondary);
    text-align: right;
  }

  .settings-value.primary {
    color: var(--text-primary);
    font-weight: 600;
  }

  /* ===== Subscription Status ===== */
  .sub-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .sub-status.active { background: rgba(46, 160, 67, 0.15); color: var(--success); }
  .sub-status.expired { background: rgba(255, 78, 78, 0.15); color: var(--error); }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .sub-status.active .status-dot { animation: pulse 2s infinite; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* ===== Sub URL Box ===== */
  .sub-url-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-top: 8px;
  }

  .sub-url-text {
    font-family: 'SF Mono', monospace;
    font-size: 12px;
    color: var(--text-primary);
    word-break: break-all;
    flex: 1;
  }

  .copy-btn {
    padding: 6px 12px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }

  .copy-btn:hover { background: var(--accent-hover); }

  /* ===== Format Toggle ===== */
  .format-toggle {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }

  .format-btn {
    padding: 5px 10px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
    border-radius: var(--radius);
  }

  .format-btn.active {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(229, 9, 20, 0.1);
  }

  /* ===== Scheme Chips ===== */
  .scheme-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .scheme-chip {
    padding: 8px 14px;
    font-size: 13px;
    background: var(--bg-primary);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
    font-weight: 500;
  }

  .scheme-chip:hover:not(:disabled) {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--border-hover);
  }

  .scheme-chip.selected {
    background: rgba(229, 9, 20, 0.15);
    color: var(--text-primary);
    border-color: var(--accent);
  }

  .scheme-chip:disabled { opacity: 0.4; cursor: not-allowed; }

  .scheme-hint {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
  }

  .scheme-hint a { color: var(--accent); text-decoration: none; font-weight: 500; }

  /* ===== Action Buttons ===== */
  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
  }

  .action-btn:hover { background: var(--accent-hover); }

  .action-btn.secondary {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }

  .action-btn.secondary:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .action-btn svg { width: 14px; height: 14px; }

  /* ===== Orders List ===== */
  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: var(--bg-card);
  }

  .order-item:hover { background: var(--bg-hover); }

  .order-info { flex: 1; }

  .order-id {
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 2px;
  }

  .order-date {
    font-size: 12px;
    color: var(--text-muted);
  }

  .order-meta { text-align: right; }

  .order-amount {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .order-status {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 4px;
  }

  .order-status.completed { background: rgba(46, 160, 67, 0.15); color: var(--success); }
  .order-status.pending { background: rgba(255, 176, 0, 0.15); color: var(--warning); }

  /* ===== Tickets List ===== */
  .ticket-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
  }

  .ticket-item:last-child { border-bottom: none; }
  .ticket-item:hover { background: var(--bg-hover); }

  .ticket-icon {
    width: 32px;
    height: 32px;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .ticket-icon.payment { background: rgba(255, 176, 0, 0.15); }
  .ticket-icon.order { background: rgba(46, 160, 67, 0.15); }
  .ticket-icon.technical { background: rgba(0, 212, 255, 0.15); }
  .ticket-icon.other { background: rgba(255, 255, 255, 0.05); }

  .ticket-info { flex: 1; min-width: 0; }

  .ticket-subject {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ticket-meta {
    font-size: 12px;
    color: var(--text-muted);
    display: flex;
    gap: 12px;
  }

  .ticket-status {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .ticket-status.pending { background: rgba(255, 176, 0, 0.15); color: var(--warning); }
  .ticket-status.processing { background: rgba(0, 122, 255, 0.15); color: #007aff; }
  .ticket-status.resolved { background: rgba(46, 160, 67, 0.15); color: var(--success); }

  /* ===== Modal ===== */
  .modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 1000;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .modal.show { display: flex; }

  .modal-content {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }

  .modal-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .modal-close {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
  }

  .modal-close:hover { color: var(--text-primary); }

  .modal-body { padding: 20px; }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid var(--border);
  }

  /* ===== Form ===== */
  .form-group { margin-bottom: 16px; }

  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 10px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-primary);
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.15s;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--accent);
  }

  .form-textarea { min-height: 100px; resize: vertical; }

  /* ===== Toast ===== */
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toast {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    padding: 12px 16px;
    border-radius: var(--radius);
    font-size: 13px;
    color: var(--text-primary);
    animation: toastIn 0.3s ease;
    min-width: 240px;
  }

  .toast.success { border-left-color: var(--success); }
  .toast.error { border-left-color: var(--error); }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* ===== Loading ===== */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: var(--text-muted);
    font-size: 14px;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ===== Empty State ===== */
  .empty-state {
    text-align: center;
    padding: 48px 20px;
    color: var(--text-muted);
  }

  .empty-state p { font-size: 14px; margin-bottom: 16px; }

  /* ===== Responsive ===== */
  @media (max-width: 900px) {
    .sidebar { transform: translateX(-100%); transition: transform 0.3s; }
    .sidebar.open { transform: translateX(0); }
    .content-wrapper { margin-left: 0; max-width: 100%; }
    .profile-card { flex-direction: column; text-align: center; }
    .profile-badges { justify-content: center; }
  }
`;

export const content = `
<main class="main-content">
  <div class="dashboard-layout">

    <!-- Sidebar -->
    <nav class="sidebar" id="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-label">账户</div>
        <button class="sidebar-item active" onclick="switchSection('dashboard')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          控制面板
        </button>
        <button class="sidebar-item" onclick="switchSection('subscription')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h12"/></svg>
          订阅管理
        </button>
        <button class="sidebar-item" onclick="switchSection('orders')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          订单历史
        </button>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-label">支持</div>
        <button class="sidebar-item" onclick="switchSection('tickets')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          工单支持
        </button>
        <button class="sidebar-item" onclick="window.location.href='/favorites'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          我的收藏
        </button>
      </div>

      <div class="sidebar-section" style="margin-top: auto;">
        <button class="sidebar-item sidebar-logout" onclick="logout()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          登出
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="content-wrapper">

      <!-- Section: Dashboard -->
      <div id="dashboardSection" class="section active">
        <h1 class="section-title">控制面板</h1>

        <!-- Profile Card -->
        <div class="profile-card">
          <div class="profile-avatar" id="userAvatar">?</div>
          <div class="profile-info">
            <h2 class="profile-name">
              <span id="userName">用户</span>
              <span class="vip-star" id="vipStar" style="display: none;">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </span>
            </h2>
            <p class="profile-email" id="userEmail">-</p>
            <div class="profile-badges">
              <span class="badge badge-vip" id="vipBadge" style="display: none;">
                <span id="vipTierName">VIP</span>
              </span>
              <span class="badge badge-verified" id="verifiedBadge" style="display: none;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>
                已验证
              </span>
              <span class="badge badge-member" id="memberBadge" style="display: none;">
                成员 <span id="memberSince">-</span>
              </span>
            </div>
          </div>
          <div id="profileActions" style="display: none;">
            <button class="action-btn" onclick="window.location.href='/freesub'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              续费
            </button>
          </div>
        </div>

        <!-- Subscription Settings -->
        <div class="settings-group">
          <div class="settings-group-title">订阅信息</div>
          <div class="settings-row">
            <div>
              <div class="settings-label">订阅状态</div>
              <div class="settings-desc">当前订阅的有效性</div>
            </div>
            <div id="subStatusBox" style="display: none;">
              <span class="sub-status" id="subStatus">
                <span class="status-dot" id="statusDot"></span>
                <span id="statusText">Active</span>
              </span>
            </div>
          </div>
          <div class="settings-row" id="subUrlRow" style="display: none;">
            <div>
              <div class="settings-label">订阅链接</div>
              <div class="settings-desc">复制到播放器使用</div>
              <div class="format-toggle" id="formatToggle" style="display: none;">
                <button class="format-btn active" onclick="setSubFormat('m3u')">M3U</button>
                <button class="format-btn" onclick="setSubFormat('txt')">TXT</button>
              </div>
              <div class="sub-url-box">
                <span class="sub-url-text" id="subUrlText">-</span>
                <button class="copy-btn" onclick="copySubUrl()">复制</button>
              </div>
            </div>
          </div>
          <div class="settings-row" id="subDetailsRow" style="display: none;">
            <div>
              <div class="settings-label">到期时间</div>
              <div class="settings-desc">订阅有效期</div>
            </div>
            <div class="settings-value primary" id="subExpiry">-</div>
          </div>
          <div class="settings-row" id="subDurationRow" style="display: none;">
            <div>
              <div class="settings-label">订阅时长</div>
              <div class="settings-desc">购买时长</div>
            </div>
            <div class="settings-value" id="subDuration">-</div>
          </div>
          <div class="settings-row" id="subIPsRow" style="display: none;">
            <div>
              <div class="settings-label">最大 IP 数</div>
              <div class="settings-desc">同时在线设备数</div>
            </div>
            <div class="settings-value" id="subIPs">-</div>
          </div>
        </div>

        <!-- No Subscription State -->
        <div class="empty-state" id="noSubState" style="display: none;">
          <p>暂无活跃订阅</p>
          <button class="action-btn" onclick="window.location.href='/freesub'">立即订阅</button>
        </div>

        <!-- Quick Actions -->
        <div class="settings-group">
          <div class="settings-group-title">快捷操作</div>
          <div class="settings-row" onclick="switchSection('orders')" style="cursor: pointer;">
            <div>
              <div class="settings-label">订单历史</div>
              <div class="settings-desc">查看所有订阅记录</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="settings-row" onclick="switchSection('tickets')" style="cursor: pointer;">
            <div>
              <div class="settings-label">工单支持</div>
              <div class="settings-desc">获取帮助和支持</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="settings-row" onclick="window.location.href='/favorites'" style="cursor: pointer;">
            <div>
              <div class="settings-label">我的收藏</div>
              <div class="settings-desc">查看收藏的频道</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </div>

      <!-- Section: Subscription -->
      <div id="subscriptionSection" class="section" style="display: none;">
        <h1 class="section-title">订阅管理</h1>

        <div class="settings-group">
          <div class="settings-group-title">线路方案</div>
          <div class="settings-row" style="flex-direction: column; align-items: flex-start; gap: 12px;">
            <div class="settings-desc" style="margin-bottom: 8px;">选择您要观看的频道方案</div>
            <div class="scheme-list" id="schemeList">
              <div class="loading"><div class="spinner"></div>加载中...</div>
            </div>
            <div class="scheme-hint" id="schemeHint"></div>
          </div>
        </div>

        <div class="settings-group">
          <div class="settings-group-title">当前订阅</div>
          <div class="settings-row" id="subStatusBox2" style="display: none;">
            <div>
              <div class="settings-label">订阅状态</div>
            </div>
            <span class="sub-status" id="subStatus2">
              <span class="status-dot" id="statusDot2"></span>
              <span id="statusText2">Active</span>
            </span>
          </div>
          <div class="settings-row" id="subUrlRow2" style="display: none;">
            <div>
              <div class="settings-label">订阅链接</div>
              <div class="sub-url-box">
                <span class="sub-url-text" id="subUrlText2">-</span>
                <button class="copy-btn" onclick="copySubUrl()">复制</button>
              </div>
            </div>
          </div>
          <div class="settings-row" id="subExpiryRow2" style="display: none;">
            <div>
              <div class="settings-label">到期时间</div>
            </div>
            <div class="settings-value primary" id="subExpiry2">-</div>
          </div>
          <div class="settings-row" id="subDurationRow2" style="display: none;">
            <div>
              <div class="settings-label">订阅时长</div>
            </div>
            <div class="settings-value" id="subDuration2">-</div>
          </div>
          <div class="settings-row" id="subIPsRow2" style="display: none;">
            <div>
              <div class="settings-label">最大 IP 数</div>
            </div>
            <div class="settings-value" id="subIPs2">-</div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <button class="action-btn" onclick="switchSection('dashboard')">返回控制面板</button>
        </div>
      </div>

      <!-- Section: Orders -->
      <div id="ordersSection" class="section" style="display: none;">
        <h1 class="section-title">订单历史</h1>

        <div class="settings-group">
          <div class="settings-group-title">所有订单</div>
          <div class="orders-list" id="ordersList">
            <div class="loading"><div class="spinner"></div>加载中...</div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <button class="action-btn secondary" onclick="switchSection('dashboard')">返回</button>
        </div>
      </div>

      <!-- Section: Tickets -->
      <div id="ticketsSection" class="section" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h1 class="section-title" style="margin: 0; padding: 0; border: none;">工单支持</h1>
          <button class="action-btn" onclick="showCreateTicketModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            新建工单
          </button>
        </div>

        <div class="settings-group">
          <div class="settings-group-title">我的工单</div>
          <div id="ticketsList">
            <div class="loading"><div class="spinner"></div>加载中...</div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <button class="action-btn secondary" onclick="switchSection('dashboard')">返回</button>
        </div>
      </div>

    </div>
  </div>
</main>

<!-- Toast Container -->
<div class="toast-container" id="toastContainer"></div>

<!-- Create Ticket Modal -->
<div id="ticketModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">新建工单</h3>
      <button class="modal-close" onclick="closeTicketModal()">×</button>
    </div>
    <div class="modal-body">
      <form id="ticketForm">
        <div class="form-group">
          <label class="form-label">关联订单（可选）</label>
          <select class="form-select" id="ticketOrderId">
            <option value="">无关联订单</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">工单类型</label>
          <select class="form-select" id="ticketType">
            <option value="payment">支付问题</option>
            <option value="order">订单咨询</option>
            <option value="technical">技术问题</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">标题</label>
          <input type="text" class="form-input" id="ticketSubject" maxlength="200" placeholder="简要描述问题">
        </div>
        <div class="form-group">
          <label class="form-label">详细描述</label>
          <textarea class="form-textarea" id="ticketDescription" placeholder="请详细描述您的问题..."></textarea>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button class="action-btn secondary" onclick="closeTicketModal()">取消</button>
      <button class="action-btn" onclick="submitTicket()">提交工单</button>
    </div>
  </div>
</div>

<script>
const API_BASE = '/api/auth';
let currentLang = navigator.language?.startsWith('zh') ? 'zh-CN' : 'en';
let currentScheme = { type: 'all' };
let availableSchemes = [];
let latestActiveCode = null;
let isVipActive = false;
let currentSubFormat = 'm3u';

function getToken() { return localStorage.getItem('auth_token'); }

// Check auth
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('token')) {
  localStorage.setItem('auth_token', urlParams.get('token'));
  window.history.replaceState({}, document.title, window.location.pathname);
}

if (!getToken()) {
  window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
}

// Section switching
function switchSection(section) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));

  document.getElementById(section + 'Section').style.display = 'block';
  event.target.closest('.sidebar-item')?.classList.add('active') ||
    document.querySelector('.sidebar-item[onclick*="' + section + '"]')?.classList.add('active');

  if (section === 'orders') loadOrders();
  if (section === 'tickets') loadTickets();
}

// Toast
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Load user info
async function loadUserInfo() {
  try {
    const resp = await fetch(API_BASE + '/user', { headers: { 'Authorization': 'Bearer ' + getToken() } });
    const data = await resp.json();
    if (resp.ok && data.success) {
      const user = data.user;
      document.getElementById('userName').textContent = user.email.split('@')[0];
      document.getElementById('userEmail').textContent = user.email;
      document.getElementById('userAvatar').textContent = user.email.charAt(0).toUpperCase();
      const createdDate = new Date(user.created_at);
      document.getElementById('memberSince').textContent = createdDate.toLocaleDateString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US', { month: 'short', year: 'numeric' });
      if (user.is_verified) {
        document.getElementById('verifiedBadge').style.display = 'inline-flex';
      }
    }
  } catch (e) { console.error('Load user info error:', e); }
}

// Load VIP status
async function loadVipStatus() {
  try {
    const resp = await fetch(API_BASE + '/orders', { headers: { 'Authorization': 'Bearer ' + getToken() } });
    const data = await resp.json();

    if (resp.ok && data.success && data.orders?.length > 0) {
      const completed = data.orders.filter(o => o.status === 'completed');
      if (completed.length === 0) return;

      const latest = completed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      const now = new Date();
      const expiredAt = latest.expired_at ? new Date(latest.expired_at) : null;
      const isExpired = expiredAt && expiredAt < now;
      const isPermanent = latest.code_duration_days === -1;
      isVipActive = !isExpired;
      latestActiveCode = latest.code;

      if (isVipActive) {
        document.getElementById('vipBadge').style.display = 'inline-flex';
        document.getElementById('vipStar').style.display = 'inline-flex';
        document.getElementById('memberBadge').style.display = 'inline-flex';
        document.getElementById('profileActions').style.display = 'block';
        document.getElementById('userAvatar').classList.add('vip');

        let tierName = 'VIP';
        let remainingDays = isPermanent ? 999 : Math.ceil((expiredAt - now) / 86400000);
        if (isPermanent || remainingDays > 365) tierName = 'Crown VIP';
        else if (remainingDays > 180) tierName = 'Emerald VIP';
        else if (remainingDays > 90) tierName = 'Gold VIP';
        else if (remainingDays > 30) tierName = 'Silver VIP';
        else tierName = 'Bronze VIP';
        document.getElementById('vipTierName').textContent = tierName;

        // Show subscription info
        document.getElementById('subStatusBox').style.display = 'block';
        document.getElementById('subUrlRow').style.display = 'flex';
        document.getElementById('formatToggle').style.display = 'flex';
        document.getElementById('subDetailsRow').style.display = 'flex';
        document.getElementById('subDurationRow').style.display = 'flex';
        document.getElementById('subIPsRow').style.display = 'flex';
        document.getElementById('noSubState').style.display = 'none';

        document.getElementById('statusDot').className = 'status-dot' + (isExpired ? ' expired' : '');
        document.getElementById('statusText').textContent = isExpired ? '已过期' : '活跃';
        document.getElementById('statusText').style.color = isExpired ? 'var(--error)' : 'var(--success)';

        const baseUrl = window.location.origin;
        window._vipCodeBase = baseUrl + '/sub/' + latest.code;
        updateSubUrl();

        document.getElementById('subExpiry').textContent = expiredAt?.toLocaleDateString() || '永久';
        document.getElementById('subDuration').textContent = latest.duration_days ? latest.duration_days + '天' : '永久';
        document.getElementById('subIPs').textContent = latest.max_ips || 3;

        // Show same in subscription section
        document.getElementById('subStatusBox2').style.display = 'flex';
        document.getElementById('subUrlRow2').style.display = 'flex';
        document.getElementById('subExpiryRow2').style.display = 'flex';
        document.getElementById('subDurationRow2').style.display = 'flex';
        document.getElementById('subIPsRow2').style.display = 'flex';
        document.getElementById('statusDot2').className = 'status-dot' + (isExpired ? ' expired' : '');
        document.getElementById('statusText2').textContent = isExpired ? '已过期' : '活跃';
        document.getElementById('subUrlText2').textContent = window._vipCodeBase + '.m3u';
        document.getElementById('subExpiry2').textContent = document.getElementById('subExpiry').textContent;
        document.getElementById('subDuration2').textContent = document.getElementById('subDuration').textContent;
        document.getElementById('subIPs2').textContent = document.getElementById('subIPs').textContent;

        // Init scheme
        if (latest.sub_mode === 'favorites') currentScheme = { type: 'favorites' };
        else if (latest.topic_id) currentScheme = { type: 'topic', id: latest.topic_id };
        else currentScheme = { type: 'all' };
        loadSchemes();
      }
    }
  } catch (e) { console.error('Load VIP status error:', e); }
}

// Scheme management
async function loadSchemes() {
  try {
    const resp = await fetch('/api/subscription/topics');
    const data = await resp.json();
    const topics = (data?.success && Array.isArray(data.topics)) ? data.topics : [];
    availableSchemes = [
      { type: 'all', id: 'all', name: currentLang === 'zh-CN' ? '全部频道' : 'All Channels', desc: currentLang === 'zh-CN' ? '所有可用频道' : 'All available channels' },
      { type: 'favorites', id: 'favorites', name: currentLang === 'zh-CN' ? '我的收藏' : 'My Favorites', desc: currentLang === 'zh-CN' ? '仅显示收藏的频道' : 'Only favorited channels' },
    ];
    topics.forEach(t => availableSchemes.push({ type: 'topic', id: t.id, name: t.name, desc: t.description || '' }));
    renderSchemes();
  } catch (e) { console.error('Load schemes error:', e); }
}

function renderSchemes() {
  const container = document.getElementById('schemeList');
  const hint = document.getElementById('schemeHint');
  if (!container) return;

  container.innerHTML = availableSchemes.map(s => {
    const selected = isCurrentScheme(s);
    const disabled = !isVipActive ? 'disabled' : '';
    return '<button class="scheme-chip ' + (selected ? 'selected' : '') + '" data-type="' + s.type + '" data-id="' + s.id + '" ' + disabled + ' onclick="selectScheme(\'' + s.type + '\', \'' + s.id + '\')">' +
      s.name + (s.desc ? '<br><span style="font-size:11px;color:var(--text-muted);font-weight:400;">' + s.desc + '</span>' : '') +
    '</button>';
  }).join('');

  if (hint) {
    if (!isVipActive && !latestActiveCode) {
      hint.innerHTML = currentLang === 'zh-CN' ? '激活订阅后可切换方案' : 'Activate subscription to switch';
    } else if (!isVipActive) {
      hint.innerHTML = (currentLang === 'zh-CN' ? '切换线路方案为 VIP 专属功能。<a href="/freesub">开通 VIP →</a>' : 'VIP only. <a href="/freesub">Subscribe →</a>');
    } else {
      hint.textContent = currentLang === 'zh-CN' ? '切换后立即生效' : 'Takes effect immediately';
    }
  }
}

function isCurrentScheme(s) {
  if (currentScheme.type === 'all') return s.type === 'all';
  if (currentScheme.type === 'favorites') return s.type === 'favorites';
  if (currentScheme.type === 'topic') return s.type === 'topic' && String(currentScheme.id) === String(s.id);
  return false;
}

async function selectScheme(type, id) {
  if (!isVipActive || !latestActiveCode) return;
  if (isCurrentScheme({ type, id })) return;

  if (type === 'favorites') {
    try {
      const resp = await fetch('/api/favorites', { headers: { 'Authorization': 'Bearer ' + getToken() } });
      const data = await resp.json();
      if (data?.count === 0) {
        showToast(currentLang === 'zh-CN' ? '还没有收藏，请先添加' : 'No favorites yet');
        return;
      }
    } catch (e) {}
  }

  const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
  try {
    await fetch('/api/user/change-sub-mode?code=' + encodeURIComponent(latestActiveCode), {
      method: 'POST', headers, body: JSON.stringify({ sub_mode: type === 'favorites' ? 'favorites' : null })
    });
    await fetch('/api/change-topic?code=' + encodeURIComponent(latestActiveCode), {
      method: 'POST', headers, body: JSON.stringify({ topic_id: type === 'topic' ? Number(id) : null })
    });
    currentScheme = type === 'topic' ? { type, id: Number(id) } : { type };
    renderSchemes();
    showToast(currentLang === 'zh-CN' ? '线路方案已更新' : 'Scheme updated');
  } catch (e) {
    showToast(currentLang === 'zh-CN' ? '更新失败' : 'Update failed');
  }
}

// Subscription URL
function setSubFormat(fmt) {
  currentSubFormat = fmt;
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === fmt);
  });
  updateSubUrl();
}

function updateSubUrl() {
  const el = document.getElementById('subUrlText');
  if (el && window._vipCodeBase) {
    el.textContent = window._vipCodeBase + '.' + currentSubFormat;
  }
  const el2 = document.getElementById('subUrlText2');
  if (el2 && window._vipCodeBase) {
    el2.textContent = window._vipCodeBase + '.' + currentSubFormat;
  }
}

function copySubUrl() {
  const text = document.getElementById('subUrlText')?.textContent;
  if (text) {
    navigator.clipboard.writeText(text).then(() => showToast(currentLang === 'zh-CN' ? '已复制' : 'Copied', 'success'));
  }
}

// Orders
async function loadOrders() {
  const container = document.getElementById('ordersList');
  container.innerHTML = '<div class="loading"><div class="spinner"></div>加载中...</div>';
  try {
    const resp = await fetch(API_BASE + '/orders', { headers: { 'Authorization': 'Bearer ' + getToken() } });
    const data = await resp.json();
    if (resp.ok && data.success) {
      const orders = data.orders || [];
      if (orders.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>暂无订单</p></div>';
      } else {
        container.innerHTML = orders.map(o => {
          const date = new Date(o.created_at).toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US');
          return '<div class="order-item"><div class="order-info"><div class="order-id">' + o.order_id + '</div><div class="order-date">' + date + '</div></div><div class="order-meta"><div class="order-amount">¥' + (o.amount || 0).toFixed(2) + '</div><span class="order-status ' + o.status + '">' + o.status + '</span></div></div>';
        }).join('');
      }
    }
  } catch (e) { console.error('Load orders error:', e); }
}

// Tickets
async function loadTickets() {
  const container = document.getElementById('ticketsList');
  container.innerHTML = '<div class="loading"><div class="spinner"></div>加载中...</div>';
  try {
    const resp = await fetch('/api/tickets', { headers: { 'Authorization': 'Bearer ' + getToken() } });
    const data = await resp.json();
    if (resp.ok && data.success) {
      const tickets = data.tickets || [];
      if (tickets.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>暂无工单</p><button class="action-btn" style="margin-top: 12px;" onclick="showCreateTicketModal()">新建工单</button></div>';
      } else {
        container.innerHTML = tickets.map(t => '<div class="ticket-item" onclick="showTicketDetail(' + t.id + ')"><div class="ticket-icon ' + t.type + '">' + {payment: '💳', order: '📋', technical: '🔧', other: '❓'}[t.type] + '</div><div class="ticket-info"><div class="ticket-subject">' + t.subject + '</div><div class="ticket-meta"><span>' + new Date(t.created_at).toLocaleDateString() + '</span><span class="ticket-status ' + t.status + '">' + t.status + '</span></div></div></div>').join('');
      }
    }
  } catch (e) { console.error('Load tickets error:', e); }
}

function showCreateTicketModal() {
  document.getElementById('ticketModal').classList.add('show');
  fetch(API_BASE + '/orders', { headers: { 'Authorization': 'Bearer ' + getToken() } })
    .then(r => r.json())
    .then(d => {
      const sel = document.getElementById('ticketOrderId');
      sel.innerHTML = '<option value="">无关联订单</option>';
      (d.orders || []).filter(o => o.status === 'completed').forEach(o => {
        sel.innerHTML += '<option value="' + o.order_id + '">' + o.order_id + ' - ¥' + o.amount + '</option>';
      });
    });
}

function closeTicketModal() {
  document.getElementById('ticketModal').classList.remove('show');
}

async function submitTicket() {
  try {
    const resp = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: document.getElementById('ticketOrderId').value,
        type: document.getElementById('ticketType').value,
        subject: document.getElementById('ticketSubject').value,
        description: document.getElementById('ticketDescription').value
      })
    });
    const data = await resp.json();
    if (data.success) {
      closeTicketModal();
      showToast('工单已提交', 'success');
      loadTickets();
    } else {
      showToast(data.error || '提交失败');
    }
  } catch (e) { showToast('网络错误'); }
}

function logout() {
  localStorage.removeItem('auth_token');
  window.location.href = '/';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  loadVipStatus();
});
</script>
`;
