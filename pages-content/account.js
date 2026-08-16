// 静态页面内容模块 - 账户中心（Tab 布局优化版）
export const pageTitle = 'My Account - IPTV Search';
export const pageDescription = 'Manage your IPTV Search account, view subscription status and order history.';
export const canonical = 'https://iptv-search.com/account';
export const robots = 'noindex, follow';

export const styles = `
  /* ========================================
     Account Page Styles (Tab Layout)
     ======================================== */

  :root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #141414;
    --bg-card: #1a1a1a;
    --bg-hover: #252525;
    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.15);
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --text-muted: #666666;
    --accent: #e50914;
    --success: #22c55e;
    --warning: #fbbf24;
    --error: #ef4444;
    --tier-gold: #ffd700;
    --tier-emerald: #50c878;
    --radius: 0;
  }

  [data-theme="light"] {
    --bg-primary: #f5f5f5;
    --bg-secondary: #ffffff;
    --bg-card: #ffffff;
    --bg-hover: #f0f0f0;
    --border: rgba(0, 0, 0, 0.08);
    --text-primary: #1a1a1a;
    --text-secondary: #666666;
    --text-muted: #999999;
  }

  .main-content {
    flex: 1;
    width: 100%;
    margin-top: 80px;
    padding: 32px 24px 60px;
  }

  .account-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* User Banner */
  .user-banner {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 24px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .user-avatar {
    width: 56px;
    height: 56px;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .user-avatar.vip-ring {
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.4);
  }

  .user-details h2 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-details p {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0 0 8px 0;
  }

  .user-badges {
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
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge-vip {
    background: rgba(255, 215, 0, 0.15);
    color: var(--tier-gold);
    border: 1px solid rgba(255, 215, 0, 0.3);
  }

  .badge-verified {
    background: rgba(52, 199, 89, 0.15);
    color: var(--success);
    border: 1px solid rgba(52, 199, 89, 0.3);
  }

  .vip-star {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: var(--tier-gold);
    border-radius: 0;
    font-size: 11px;
  }

  .vip-star svg { width: 12px; height: 12px; fill: #000; stroke: none; }

  /* Tab Navigation */
  .tab-nav {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--border);
  }

  .tab-btn {
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
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

  /* Tab Panels */
  .tab-panel { display: none; }
  .tab-panel.active { display: block; }

  /* Cards Grid */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 24px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  .card-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-title svg { width: 18px; height: 18px; color: var(--accent); }

  /* Subscription Card */
  .subscription-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
  }

  .status-dot.expired { background: var(--error); }

  .status-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .sub-url {
    font-family: 'SF Mono', monospace;
    font-size: 12px;
    color: var(--text-secondary);
    background: rgba(0, 0, 0, 0.3);
    padding: 10px 12px;
    border: 1px solid var(--border);
    word-break: break-all;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sub-url-copy {
    padding: 4px 10px;
    background: var(--accent);
    color: #fff;
    border: none;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }

  .format-toggle {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .format-btn {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .format-btn.active {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(229, 9, 20, 0.1);
  }

  .sub-detail {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }

  .sub-detail:last-child { border-bottom: none; }

  .sub-detail-label { color: var(--text-muted); }
  .sub-detail-value { color: var(--text-primary); font-weight: 600; }

  /* Scheme Card */
  .scheme-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .scheme-chip {
    padding: 8px 16px;
    font-size: 13px;
    background: var(--bg-hover);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    font-weight: 500;
  }

  .scheme-chip:hover:not(:disabled) {
    background: var(--bg-card);
    color: var(--text-primary);
    border-color: var(--border-hover);
  }

  .scheme-chip.selected {
    background: rgba(229, 9, 20, 0.15);
    color: var(--text-primary);
    border-color: var(--accent);
  }

  .scheme-chip:disabled { opacity: 0.5; cursor: not-allowed; }

  .scheme-hint {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 8px;
  }

  .scheme-hint a { color: var(--accent); text-decoration: none; font-weight: 600; }

  /* Perks */
  .perks-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .perk-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .perk-item svg { width: 16px; height: 16px; color: var(--success); flex-shrink: 0; }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
  }

  .btn-primary:hover { opacity: 0.9; }

  .btn-secondary {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* Orders List */
  .order-list { display: flex; flex-direction: column; gap: 12px; }

  .order-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 18px;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .order-id {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
  }

  .order-status {
    padding: 4px 10px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .order-status.completed { background: rgba(52, 199, 89, 0.15); color: var(--success); }
  .order-status.pending { background: rgba(255, 204, 0, 0.15); color: var(--warning); }

  .order-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .order-detail { font-size: 12px; }
  .order-detail-label { color: var(--text-muted); margin-bottom: 2px; }
  .order-detail-value { color: var(--text-primary); font-weight: 600; }

  /* Tickets */
  .ticket-list { display: flex; flex-direction: column; gap: 10px; }

  .ticket-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    padding-left: 20px;
  }

  .ticket-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
  }

  .ticket-card.payment::before { background: var(--warning); }
  .ticket-card.order::before { background: var(--success); }
  .ticket-card.technical::before { background: #00d4ff; }

  .ticket-card:hover { border-color: var(--border-hover); }

  .ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .ticket-type {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 3px 8px;
  }

  .ticket-type.payment { background: rgba(255, 204, 0, 0.15); color: var(--warning); }
  .ticket-type.order { background: rgba(52, 199, 89, 0.15); color: var(--success); }
  .ticket-type.technical { background: rgba(0, 212, 255, 0.15); color: #00d4ff; }

  .ticket-subject { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
  .ticket-meta { font-size: 11px; color: var(--text-muted); }

  /* Modal */
  .modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 3000;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .modal.show { display: flex; }

  .modal-content {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 32px;
    max-width: 480px;
    width: 100%;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 24px;
    cursor: pointer;
  }

  /* Toast */
  .toast-container {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toast {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 12px 16px;
    font-size: 13px;
    color: var(--text-primary);
    animation: toastIn 0.3s ease;
  }

  .toast.success { border-color: rgba(52, 199, 89, 0.4); }
  .toast.error { border-color: rgba(239, 68, 68, 0.4); }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Loading */
  .loading { display: none; text-align: center; padding: 40px; }
  .loading.active { display: block; }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 12px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
  }

  /* Responsive */
  @media (max-width: 900px) {
    .cards-grid { grid-template-columns: 1fr; }
    .user-banner { flex-direction: column; align-items: flex-start; }
  }

  @media (max-width: 600px) {
    .main-content { padding: 20px 16px 40px; }
    .tab-btn { padding: 10px 16px; font-size: 13px; }
    .card { padding: 18px; }
    .order-details { grid-template-columns: 1fr; }
  }
`;

export const content = `
<main class="main-content">
  <div class="account-container">

    <!-- User Banner -->
    <div class="user-banner" id="userBanner">
      <div class="user-info">
        <div class="user-avatar" id="userAvatar">?</div>
        <div class="user-details">
          <h2>
            <span id="userName">用户</span>
            <span class="vip-star" id="vipStar" style="display: none;">
              <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </span>
          </h2>
          <p id="userEmail">-</p>
          <div class="user-badges">
            <span class="badge badge-vip" id="vipBadge" style="display: none;">
              <span id="vipTierName">Crown VIP</span>
            </span>
            <span class="badge badge-verified" id="verifiedBadge" style="display: none;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="10" height="10"><polyline points="20 6 9 17 4 12"></polyline></svg>
              已验证
            </span>
            <span class="badge" id="memberBadge" style="background: rgba(229, 9, 20, 0.15); color: var(--accent); border: 1px solid rgba(229, 9, 20, 0.3);">
              成员 <span id="memberSince">-</span>
            </span>
          </div>
        </div>
      </div>
      <div class="action-buttons" id="bannerActions" style="display: none;">
        <button class="btn btn-primary" onclick="window.location.href='/freesub'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          更新 VIP
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-nav">
      <button class="tab-btn active" onclick="switchTab('overview')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        账户概览
      </button>
      <button class="tab-btn" onclick="switchTab('orders')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        订单历史
      </button>
      <button class="tab-btn" onclick="switchTab('tickets')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        工单支持
      </button>
    </div>

    <!-- Tab Panel: Overview -->
    <div id="overviewTab" class="tab-panel active">
      <div class="cards-grid">

        <!-- Subscription Card -->
        <div class="card" id="subscriptionCard">
          <div class="card-header">
            <span class="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h12"/></svg>
              订阅状态
            </span>
            <span class="order-status" id="subscriptionStatus" style="display: none;">
              <span class="status-dot" id="statusDot"></span>
              <span id="statusText">Active</span>
            </span>
          </div>
          <div id="subscriptionContent" style="display: none;">
            <div class="format-toggle">
              <button class="format-btn active" onclick="setSubFormat('m3u')">M3U</button>
              <button class="format-btn" onclick="setSubFormat('txt')">TXT</button>
            </div>
            <div class="sub-url">
              <span id="vipCode">-</span>
              <button class="sub-url-copy" onclick="copyVipCode()">复制</button>
            </div>
            <div class="sub-detail">
              <span class="sub-detail-label">到期时间</span>
              <span class="sub-detail-value" id="vipExpiry">-</span>
            </div>
            <div class="sub-detail">
              <span class="sub-detail-label">持续时间</span>
              <span class="sub-detail-value" id="vipDuration">-</span>
            </div>
            <div class="sub-detail">
              <span class="sub-detail-label">最大 IP 数</span>
              <span class="sub-detail-value" id="vipMaxIps">-</span>
            </div>
          </div>
          <div id="noSubscription" class="empty-state" style="display: none;">
            <p>暂无活跃订阅</p>
          </div>
        </div>

        <!-- Scheme Card -->
        <div class="card" id="schemeCard">
          <div class="card-header">
            <span class="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              线路方案
            </span>
          </div>
          <div class="scheme-chips" id="schemeSwitcher">
            <span style="color: var(--text-muted); font-size: 13px;">加载中...</span>
          </div>
          <div class="scheme-hint" id="schemeHint"></div>
        </div>

        <!-- Perks Card -->
        <div class="card" id="perksCard">
          <div class="card-header">
            <span class="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              VIP 福利
            </span>
          </div>
          <div class="perks-list" id="perksList" style="display: none;">
            <div class="perk-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              无广告观看
            </div>
            <div class="perk-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              无限频道
            </div>
            <div class="perk-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              优先支持
            </div>
            <div class="perk-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              云同步
            </div>
          </div>
          <div id="noPerks" class="empty-state" style="display: none;">
            <p>开通 VIP 解锁专属福利</p>
            <button class="btn btn-primary" style="margin-top: 12px;" onclick="window.location.href='/freesub'">查看方案</button>
          </div>
        </div>

      </div>
    </div>

    <!-- Tab Panel: Orders -->
    <div id="ordersTab" class="tab-panel">
      <div class="order-list" id="ordersList">
        <div class="loading active"><div class="spinner"></div></div>
      </div>
    </div>

    <!-- Tab Panel: Tickets -->
    <div id="ticketsTab" class="tab-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: var(--text-primary);">支持工单</h3>
        <button class="btn btn-primary" onclick="showCreateTicketModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新建工单
        </button>
      </div>
      <div class="ticket-list" id="ticketsList">
        <div class="loading active"><div class="spinner"></div></div>
      </div>
    </div>

  </div>
</main>

<div class="toast-container" id="toastContainer"></div>

<!-- Success Modal -->
<div id="successModal" class="modal">
  <div class="modal-content">
    <button class="modal-close" onclick="closeSuccessModal()">×</button>
    <div style="text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
      <h2 style="margin: 0 0 8px 0; font-size: 20px; color: var(--text-primary);">订阅激活成功</h2>
      <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px;">您的订阅链接已生成</p>
      <div class="sub-url" id="generatedCode" style="margin-bottom: 16px;">-</div>
      <button class="btn btn-primary" style="width: 100%;" onclick="copyCode()">复制订阅链接</button>
    </div>
  </div>
</div>

<!-- Ticket Modal -->
<div id="ticketModal" class="modal">
  <div class="modal-content" style="max-width: 560px;">
    <button class="modal-close" onclick="closeTicketModal()">×</button>
    <h3 style="margin: 0 0 20px 0; font-size: 18px; color: var(--text-primary);">新建工单</h3>
    <form id="ticketForm" style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">关联订单</label>
        <select id="ticketOrderId" style="width: 100%; padding: 10px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--text-primary); font-size: 13px;">
          <option value="">无关联订单</option>
        </select>
      </div>
      <div>
        <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">工单类型</label>
        <select id="ticketType" style="width: 100%; padding: 10px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--text-primary); font-size: 13px;">
          <option value="payment">支付问题</option>
          <option value="order">订单咨询</option>
          <option value="technical">技术问题</option>
          <option value="other">其他</option>
        </select>
      </div>
      <div>
        <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">标题</label>
        <input type="text" id="ticketSubject" maxlength="200" placeholder="简要描述问题" style="width: 100%; padding: 10px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--text-primary); font-size: 13px;">
      </div>
      <div>
        <label style="display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">描述</label>
        <textarea id="ticketDescription" placeholder="请详细描述您的问题..." style="width: 100%; padding: 10px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--text-primary); font-size: 13px; min-height: 100px; resize: vertical;"></textarea>
      </div>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button type="button" class="btn btn-secondary" onclick="closeTicketModal()">取消</button>
        <button type="submit" class="btn btn-primary">提交工单</button>
      </div>
    </form>
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

// Tab switching
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', ['overview', 'orders', 'tickets'][i] === tab);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  document.getElementById(tab + 'Tab').classList.add('active');

  if (tab === 'orders') loadOrderHistory();
  if (tab === 'tickets') loadTickets();
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
      const isVip = !isExpired;

      isVipActive = isVipActive;
      latestActiveCode = latest.code;

      // Show VIP badge
      if (isVip) {
        document.getElementById('vipBadge').style.display = 'inline-flex';
        document.getElementById('vipStar').style.display = 'inline-flex';
        document.getElementById('bannerActions').style.display = 'flex';

        let tierName = 'VIP';
        let remainingDays = isPermanent ? 999 : Math.ceil((expiredAt - now) / 86400000);
        if (isPermanent || remainingDays > 365) tierName = 'Crown VIP';
        else if (remainingDays > 180) tierName = 'Emerald VIP';
        else if (remainingDays > 90) tierName = 'Gold VIP';
        else if (remainingDays > 30) tierName = 'Silver VIP';
        else tierName = 'Bronze VIP';
        document.getElementById('vipTierName').textContent = tierName;

        // Show subscription
        document.getElementById('subscriptionContent').style.display = 'block';
        document.getElementById('noSubscription').style.display = 'none';
        document.getElementById('subscriptionStatus').style.display = 'flex';
        document.getElementById('statusDot').className = 'status-dot' + (isExpired ? ' expired' : '');
        document.getElementById('statusText').textContent = isExpired ? 'Expired' : 'Active';
        document.getElementById('statusText').style.color = isExpired ? 'var(--error)' : 'var(--success)';

        const baseUrl = window.location.origin;
        window._vipCodeBase = baseUrl + '/sub/' + latest.code;
        updateSubUrl();

        if (isExpired) {
          document.getElementById('vipExpiry').textContent = expiredAt?.toLocaleDateString() || 'Expired';
        } else {
          document.getElementById('vipExpiry').textContent = expiredAt?.toLocaleDateString() || 'Permanent';
        }
        document.getElementById('vipDuration').textContent = latest.duration_days ? latest.duration_days + (currentLang === 'zh-CN' ? ' 天' : ' days') : '-';
        document.getElementById('vipMaxIps').textContent = latest.max_ips || 3;

        // Show perks
        document.getElementById('perksList').style.display = 'flex';
        document.getElementById('noPerks').style.display = 'none';

        // Init scheme
        if (latest.sub_mode === 'favorites') currentScheme = { type: 'favorites' };
        else if (latest.topic_id) currentScheme = { type: 'topic', id: latest.topic_id };
        else currentScheme = { type: 'all' };
        loadSchemes();
      } else {
        document.getElementById('noSubscription').style.display = 'block';
        document.getElementById('subscriptionContent').style.display = 'none';
        document.getElementById('subscriptionStatus').style.display = 'none';
        document.getElementById('perksList').style.display = 'none';
        document.getElementById('noPerks').style.display = 'block';
        loadSchemes();
      }
    } else {
      document.getElementById('noSubscription').style.display = 'block';
      document.getElementById('subscriptionContent').style.display = 'none';
      document.getElementById('perksList').style.display = 'none';
      document.getElementById('noPerks').style.display = 'block';
      loadSchemes();
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
      { type: 'all', id: 'all', name: currentLang === 'zh-CN' ? '全部频道' : 'All Channels' },
      { type: 'favorites', id: 'favorites', name: currentLang === 'zh-CN' ? '我的收藏' : 'My Favorites' },
    ];
    topics.forEach(t => availableSchemes.push({ type: 'topic', id: t.id, name: t.name }));
    renderSchemes();
  } catch (e) { console.error('Load schemes error:', e); }
}

function renderSchemes() {
  const container = document.getElementById('schemeSwitcher');
  const hint = document.getElementById('schemeHint');
  if (!container) return;

  const parts = availableSchemes.map(s => {
    const selected = isCurrentScheme(s);
    const disabled = !isVipActive || schemeSwitching ? 'disabled' : '';
    return '<button class="scheme-chip ' + (selected ? 'selected' : '') + '" data-type="' + s.type + '" data-id="' + s.id + '" ' + disabled + '>' + s.name + '</button>';
  }).join('');
  container.innerHTML = parts;

  container.querySelectorAll('.scheme-chip').forEach(chip => {
    chip.addEventListener('click', () => selectScheme(chip.dataset.type, chip.dataset.id));
  });

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

let schemeSwitching = false;
async function selectScheme(type, id) {
  if (schemeSwitching || !isVipActive || !latestActiveCode) return;
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

  schemeSwitching = true;
  renderSchemes();

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
    renderSchemes();
  } finally {
    schemeSwitching = false;
    renderSchemes();
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
  const el = document.getElementById('vipCode');
  if (el && window._vipCodeBase) {
    el.textContent = window._vipCodeBase + '.' + currentSubFormat;
  }
}

function copyVipCode() {
  const text = document.getElementById('vipCode')?.textContent;
  if (text) {
    navigator.clipboard.writeText(text).then(() => showToast(currentLang === 'zh-CN' ? '已复制' : 'Copied', 'success'));
  }
}

// Orders
async function loadOrderHistory() {
  const container = document.getElementById('ordersList');
  container.innerHTML = '<div class="loading active"><div class="spinner"></div></div>';
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
          return '<div class="order-card"><div class="order-header"><span class="order-id">' + o.order_id + '</span><span class="order-status ' + o.status + '">' + o.status + '</span></div><div class="order-details"><div class="order-detail"><div class="order-detail-label">Code</div><div class="order-detail-value">' + (o.code || '-') + '</div></div><div class="order-detail"><div class="order-detail-label">' + (currentLang === 'zh-CN' ? '金额' : 'Amount') + '</div><div class="order-detail-value">¥' + (o.amount || 0).toFixed(2) + '</div></div><div class="order-detail"><div class="order-detail-label">' + (currentLang === 'zh-CN' ? '时长' : 'Duration') + '</div><div class="order-detail-value">' + (o.duration_days ? o.duration_days + (currentLang === 'zh-CN' ? ' 天' : ' days') : '-') + '</div></div><div class="order-detail"><div class="order-detail-label">' + (currentLang === 'zh-CN' ? '日期' : 'Date') + '</div><div class="order-detail-value">' + date + '</div></div></div></div>';
        }).join('');
      }
    }
  } catch (e) { console.error('Load orders error:', e); }
}

// Tickets
async function loadTickets() {
  const container = document.getElementById('ticketsList');
  container.innerHTML = '<div class="loading active"><div class="spinner"></div></div>';
  try {
    const resp = await fetch('/api/tickets', { headers: { 'Authorization': 'Bearer ' + getToken() } });
    const data = await resp.json();
    if (resp.ok && data.success) {
      const tickets = data.tickets || [];
      if (tickets.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>暂无工单</p><button class="btn btn-primary" style="margin-top: 12px;" onclick="showCreateTicketModal()">新建工单</button></div>';
      } else {
        container.innerHTML = tickets.map(t => '<div class="ticket-card ' + t.type + '" onclick="showTicketDetail(' + t.id + ')"><div class="ticket-header"><span class="ticket-type ' + t.type + '">' + t.type + '</span><span class="order-status ' + t.status + '">' + t.status + '</span></div><div class="ticket-subject">' + t.subject + '</div><div class="ticket-meta">' + new Date(t.created_at).toLocaleDateString() + '</div></div>').join('');
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

document.getElementById('ticketForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
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
});

function closeSuccessModal() {
  document.getElementById('successModal').classList.remove('show');
}

function copyCode() {
  const text = document.getElementById('generatedCode')?.textContent;
  if (text) {
    navigator.clipboard.writeText(text).then(() => showToast('已复制', 'success'));
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  loadVipStatus();
});
</script>
`;
