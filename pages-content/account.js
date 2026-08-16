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
    --border-hover: rgba(255, 255, 255, 0.2);
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
    --header-height: 56px;
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

  .sidebar-item .badge {
    margin-left: auto;
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
  }

  .sidebar-logout {
    margin-top: auto;
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
    max-width: calc(100% - var(--sidebar-width));
  }

  /* ===== Page Header ===== */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .page-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 4px 0 0 0;
  }

  /* ===== Profile Card ===== */
  .profile-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .profile-avatar {
    width: 64px;
    height: 64px;
    background: var(--accent);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
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
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .profile-email {
    font-size: 14px;
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
    padding: 4px 10px;
    font-size: 11px;
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

  .profile-actions {
    display: flex;
    gap: 10px;
  }

  /* ===== Stats Grid ===== */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .stat-value.vip { color: var(--tier-gold); }
  .stat-value.active { color: var(--success); }
  .stat-value.expired { color: var(--error); }

  .stat-change {
    font-size: 12px;
    color: var(--text-secondary);
  }

  /* ===== Content Cards ===== */
  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
  }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }

  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-title svg { width: 18px; height: 18px; color: var(--accent); }

  .card-body { padding: 20px; }

  /* ===== Subscription Card ===== */
  .sub-status {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: rgba(46, 160, 67, 0.1);
    border: 1px solid rgba(46, 160, 67, 0.2);
    border-radius: var(--radius);
  }

  .sub-status.expired {
    background: rgba(255, 78, 78, 0.1);
    border-color: rgba(255, 78, 78, 0.2);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
  }

  .status-dot.expired { background: var(--error); }

  .status-text {
    font-size: 14px;
    font-weight: 600;
    color: var(--success);
  }

  .status-text.expired { color: var(--error); }

  .sub-url-box {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .sub-url-text {
    font-family: 'SF Mono', monospace;
    font-size: 13px;
    color: var(--text-primary);
    word-break: break-all;
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

  .sub-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .sub-detail {
    text-align: center;
    padding: 12px;
    background: var(--bg-primary);
    border-radius: var(--radius);
  }

  .sub-detail-label {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .sub-detail-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* ===== Scheme Card ===== */
  .scheme-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .scheme-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.15s;
  }

  .scheme-item:hover:not(:disabled) {
    border-color: var(--border-hover);
    background: var(--bg-hover);
  }

  .scheme-item.selected {
    border-color: var(--accent);
    background: rgba(229, 9, 20, 0.1);
  }

  .scheme-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .scheme-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .scheme-desc {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .scheme-check {
    width: 20px;
    height: 20px;
    color: var(--accent);
  }

  .scheme-hint {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .scheme-hint a {
    color: var(--accent);
    text-decoration: none;
  }

  /* ===== Quick Actions ===== */
  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
  }

  .action-btn:hover {
    background: var(--bg-hover);
    border-color: var(--border-hover);
  }

  .action-btn svg { width: 18px; height: 18px; color: var(--accent); }

  .action-btn.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  .action-btn.primary:hover {
    background: var(--accent-hover);
  }

  .action-btn.primary svg { color: #fff; }

  /* ===== Orders List ===== */
  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .order-info { flex: 1; }

  .order-id {
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 4px;
  }

  .order-date {
    font-size: 12px;
    color: var(--text-muted);
  }

  .order-meta {
    text-align: right;
  }

  .order-amount {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .order-status {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 4px;
  }

  .order-status.completed {
    background: rgba(46, 160, 67, 0.15);
    color: var(--success);
  }

  .order-status.pending {
    background: rgba(255, 176, 0, 0.15);
    color: var(--warning);
  }

  /* ===== Tickets List ===== */
  .ticket-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.15s;
  }

  .ticket-item:hover {
    border-color: var(--border-hover);
    background: var(--bg-hover);
  }

  .ticket-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
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
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .ticket-status.pending { background: rgba(255, 176, 0, 0.15); color: var(--warning); }
  .ticket-status.processing { background: rgba(0, 122, 255, 0.15); color: #007aff; }
  .ticket-status.resolved { background: rgba(46, 160, 67, 0.15); color: var(--success); }

  /* ===== Buttons ===== */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    font-family: inherit;
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
  }

  .btn-primary:hover { background: var(--accent-hover); }

  .btn-secondary {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .btn svg { width: 16px; height: 16px; }

  /* ===== Tabs ===== */
  .tab-nav {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
  }

  .tab-btn {
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    cursor: pointer;
    position: relative;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: inherit;
  }

  .tab-btn:hover { color: var(--text-primary); }

  .tab-btn.active {
    color: var(--accent);
  }

  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent);
  }

  .tab-btn svg { width: 16px; height: 16px; }

  .tab-panel { display: none; }
  .tab-panel.active { display: block; }

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
    padding: 0;
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
    max-width: 360px;
  }

  .toast.success { border-left-color: var(--success); }
  .toast.error { border-left-color: var(--error); }
  .toast.warning { border-left-color: var(--warning); }

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
  }

  .spinner {
    width: 24px;
    height: 24px;
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

  .empty-state svg {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .empty-state p {
    font-size: 14px;
    margin-bottom: 16px;
  }

  /* ===== Responsive ===== */
  @media (max-width: 1200px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .content-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s;
    }
    .sidebar.open { transform: translateX(0); }
    .content-wrapper { margin-left: 0; max-width: 100%; }
    .stats-grid { grid-template-columns: 1fr; }
    .profile-card { flex-direction: column; text-align: center; }
    .profile-badges { justify-content: center; }
    .profile-actions { justify-content: center; }
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
          <span class="badge" id="ticketBadge" style="display: none;">0</span>
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
        <div class="page-header">
          <div>
            <h1 class="page-title">控制面板</h1>
            <p class="page-subtitle">管理您的账户和订阅</p>
          </div>
        </div>

        <!-- Profile Card -->
        <div class="profile-card">
          <div class="profile-avatar" id="userAvatar">?</div>
          <div class="profile-info">
            <h2 class="profile-name">
              <span id="userName">用户</span>
              <span class="vip-star" id="vipStar" style="display: none;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
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
          <div class="profile-actions" id="profileActions" style="display: none;">
            <button class="btn btn-primary" onclick="window.location.href='/freesub'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              续费
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">订阅状态</div>
            <div class="stat-value" id="statStatus">-</div>
            <div class="stat-change" id="statStatusChange">-</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">剩余天数</div>
            <div class="stat-value" id="statDays">-</div>
            <div class="stat-change" id="statDaysChange">-</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">线路方案</div>
            <div class="stat-value" id="statScheme">全部频道</div>
            <div class="stat-change">可切换</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">最大 IP 数</div>
            <div class="stat-value" id="statIPs">-</div>
            <div class="stat-change">当前设备</div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
          <!-- Subscription Card -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h12"/></svg>
                订阅信息
              </span>
              <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="window.location.href='/freesub'">管理订阅</button>
            </div>
            <div class="card-body">
              <div class="sub-status" id="subStatusBox" style="display: none;">
                <span class="status-dot" id="statusDot"></span>
                <span class="status-text" id="statusText">Active</span>
              </div>
              <div class="sub-url-box" id="subUrlBox" style="display: none;">
                <span class="sub-url-text" id="subUrlText">-</span>
                <button class="copy-btn" onclick="copySubUrl()">复制</button>
              </div>
              <div class="sub-details" id="subDetails" style="display: none;">
                <div class="sub-detail">
                  <div class="sub-detail-label">到期时间</div>
                  <div class="sub-detail-value" id="subExpiry">-</div>
                </div>
                <div class="sub-detail">
                  <div class="sub-detail-label">时长</div>
                  <div class="sub-detail-value" id="subDuration">-</div>
                </div>
                <div class="sub-detail">
                  <div class="sub-detail-label">IP 限制</div>
                  <div class="sub-detail-value" id="subIPs">-</div>
                </div>
              </div>
              <div class="empty-state" id="noSubState">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h12"/></svg>
                <p>暂无活跃订阅</p>
                <button class="btn btn-primary" onclick="window.location.href='/freesub'">立即订阅</button>
              </div>
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                快捷操作
              </span>
            </div>
            <div class="card-body">
              <div class="quick-actions">
                <button class="action-btn" onclick="switchSection('orders')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  查看订单历史
                </button>
                <button class="action-btn" onclick="switchSection('tickets')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                  提交工单
                </button>
                <a class="action-btn" href="/favorites">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  我的收藏
                </a>
                <a class="action-btn primary" href="/freesub">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                  续费/升级
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Subscription -->
      <div id="subscriptionSection" class="section" style="display: none;">
        <div class="page-header">
          <div>
            <h1 class="page-title">订阅管理</h1>
            <p class="page-subtitle">管理您的订阅方案和线路</p>
          </div>
        </div>

        <div class="content-grid">
          <div class="card">
            <div class="card-header">
              <span class="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                线路方案
              </span>
            </div>
            <div class="card-body">
              <div class="scheme-list" id="schemeList">
                <div class="loading"><div class="spinner"></div>加载中...</div>
              </div>
              <div class="scheme-hint" id="schemeHint"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h12"/></svg>
                当前订阅
              </span>
            </div>
            <div class="card-body">
              <div class="sub-status" id="subStatusBox2" style="display: none;">
                <span class="status-dot" id="statusDot2"></span>
                <span class="status-text" id="statusText2">Active</span>
              </div>
              <div class="sub-url-box" id="subUrlBox2" style="display: none;">
                <span class="sub-url-text" id="subUrlText2">-</span>
                <button class="copy-btn" onclick="copySubUrl()">复制</button>
              </div>
              <div class="sub-details" id="subDetails2" style="display: none;">
                <div class="sub-detail">
                  <div class="sub-detail-label">到期时间</div>
                  <div class="sub-detail-value" id="subExpiry2">-</div>
                </div>
                <div class="sub-detail">
                  <div class="sub-detail-label">时长</div>
                  <div class="sub-detail-value" id="subDuration2">-</div>
                </div>
                <div class="sub-detail">
                  <div class="sub-detail-label">IP 限制</div>
                  <div class="sub-detail-value" id="subIPs2">-</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Orders -->
      <div id="ordersSection" class="section" style="display: none;">
        <div class="page-header">
          <div>
            <h1 class="page-title">订单历史</h1>
            <p class="page-subtitle">查看您的所有订阅记录</p>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">所有订单</span>
          </div>
          <div class="card-body">
            <div class="orders-list" id="ordersList">
              <div class="loading"><div class="spinner"></div>加载中...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Tickets -->
      <div id="ticketsSection" class="section" style="display: none;">
        <div class="page-header">
          <div>
            <h1 class="page-title">工单支持</h1>
            <p class="page-subtitle">获取帮助和支持</p>
          </div>
          <button class="btn btn-primary" onclick="showCreateTicketModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            新建工单
          </button>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="orders-list" id="ticketsList">
              <div class="loading"><div class="spinner"></div>加载中...</div>
            </div>
          </div>
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
      <button class="btn btn-secondary" onclick="closeTicketModal()">取消</button>
      <button class="btn btn-primary" onclick="submitTicket()">提交工单</button>
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
  event.target.closest('.sidebar-item').classList.add('active');

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

      // Show VIP elements
      if (isVipActive) {
        document.getElementById('vipBadge').style.display = 'inline-flex';
        document.getElementById('vipStar').style.display = 'inline-flex';
        document.getElementById('memberBadge').style.display = 'inline-flex';
        document.getElementById('profileActions').style.display = 'flex';
        document.getElementById('userAvatar').classList.add('vip');

        let tierName = 'VIP';
        let remainingDays = isPermanent ? 999 : Math.ceil((expiredAt - now) / 86400000);
        if (isPermanent || remainingDays > 365) tierName = 'Crown VIP';
        else if (remainingDays > 180) tierName = 'Emerald VIP';
        else if (remainingDays > 90) tierName = 'Gold VIP';
        else if (remainingDays > 30) tierName = 'Silver VIP';
        else tierName = 'Bronze VIP';
        document.getElementById('vipTierName').textContent = tierName;

        // Update stats
        const statusEl = document.getElementById('statStatus');
        statusEl.textContent = isExpired ? '已过期' : '活跃';
        statusEl.className = 'stat-value ' + (isExpired ? 'expired' : 'active');
        document.getElementById('statStatusChange').textContent = isExpired ? '请续费' : '持续服务中';

        if (isPermanent) {
          document.getElementById('statDays').textContent = '永久';
          document.getElementById('statDaysChange').textContent = '无限期';
        } else {
          document.getElementById('statDays').textContent = remainingDays;
          document.getElementById('statDaysChange').textContent = '天后到期';
        }

        document.getElementById('statIPs').textContent = latest.max_ips || 3;

        // Show subscription info
        document.getElementById('subStatusBox').style.display = 'flex';
        document.getElementById('subUrlBox').style.display = 'flex';
        document.getElementById('subDetails').style.display = 'grid';
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

        // Init scheme
        if (latest.sub_mode === 'favorites') currentScheme = { type: 'favorites' };
        else if (latest.topic_id) currentScheme = { type: 'topic', id: latest.topic_id };
        else currentScheme = { type: 'all' };
        document.getElementById('statScheme').textContent = getSchemeName(currentScheme);
        loadSchemes();
      }
    }
  } catch (e) { console.error('Load VIP status error:', e); }
}

function getSchemeName(scheme) {
  if (scheme.type === 'all') return currentLang === 'zh-CN' ? '全部频道' : 'All Channels';
  if (scheme.type === 'favorites') return currentLang === 'zh-CN' ? '我的收藏' : 'My Favorites';
  return '线路 ' + scheme.id;
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
    return '<div class="scheme-item ' + (selected ? 'selected' : '') + '" data-type="' + s.type + '" data-id="' + s.id + '" ' + disabled + ' onclick="selectScheme(\'' + s.type + '\', \'' + s.id + '\')">' +
      '<div><div class="scheme-name">' + s.name + '</div><div class="scheme-desc">' + s.desc + '</div></div>' +
      (selected ? '<svg class="scheme-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
    '</div>';
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
    document.getElementById('statScheme').textContent = getSchemeName(currentScheme);
    renderSchemes();
    showToast(currentLang === 'zh-CN' ? '线路方案已更新' : 'Scheme updated');
  } catch (e) {
    showToast(currentLang === 'zh-CN' ? '更新失败' : 'Update failed');
  }
}

// Subscription URL
function updateSubUrl() {
  const el = document.getElementById('subUrlText');
  if (el && window._vipCodeBase) {
    el.textContent = window._vipCodeBase + '.' + currentSubFormat;
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
        container.innerHTML = '<div class="empty-state"><p>暂无工单</p><button class="btn btn-primary" style="margin-top: 12px;" onclick="showCreateTicketModal()">新建工单</button></div>';
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
