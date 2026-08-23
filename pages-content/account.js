// 静态页面内容模块 - 账户中心
export const pageTitle = 'My Account - IPTV Search';
export const pageDescription = 'Manage your IPTV Search account, view subscription status and order history.';
export const canonical = 'https://iptv-search.com/account';
export const robots = 'noindex, follow';

export const styles = `
  /* ========================================
     Account Page Styles
     ======================================== */

  :root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #141414;
    --bg-card: #1a1a1a;
    --bg-hover: #252525;
    --bg-elevated: #222222;
    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.15);
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --text-muted: #8b8b8b;
    --accent: #e50914;
    --accent-hover: #ff1a1a;
    --success: #22c55e;
    --warning: #fbbf24;
    --error: #ef4444;
    --tier-bronze: #cd7f32;
    --tier-silver: #c0c0c0;
    --tier-gold: #ffd700;
    --tier-emerald: #50c878;
    --tier-crown: #ffd700;
    --sidebar-width: 200px;
    --radius: 0;
    --glass-border: rgba(255, 255, 255, 0.08);
    --neon-cyan: #00d4ff;
    --gradient-neon: linear-gradient(135deg, #e50914, #ff3b30);
    --accent-glow: rgba(229, 9, 20, 0.4);
  }


  .main-content { flex: 1; width: 100%; margin-top: 64px; padding: 20px 24px 48px; background: var(--bg-primary); }

  .dashboard-layout { max-width: 780px; margin: 0 auto; display: flex; gap: 20px; }

  .sidebar {
    width: 180px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #141414;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius);
    padding: 12px 8px;
    animation: fadeInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: sticky;
    top: 80px;
    height: fit-content;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
  }

  .sidebar-item:hover { color: var(--text-primary); background: rgba(255, 255, 255, 0.04); }

  .sidebar-item.active {
    color: var(--text-primary);
    background: rgba(229, 9, 20, 0.12);
    border-left: 2px solid var(--accent);
    padding-left: 10px;
  }

  .sidebar-item svg { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.8; }
  .sidebar-item.active svg { opacity: 1; color: var(--accent); }

  .sidebar-divider { height: 1px; background: rgba(255, 255, 255, 0.06); margin: 8px 4px; }

  .sidebar-item.logout {
    color: rgba(239, 68, 68, 0.7);
    margin-top: 8px;
    font-size: 12px;
  }
  .sidebar-item.logout:hover { background: rgba(239, 68, 68, 0.1); color: var(--error); }

  .content-area {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    animation: fadeInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
  }

  .card {
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    transition: none;
  }

  .card:hover { transform: none; box-shadow: none; }

  .card-header { display: none; }
  .card-title { display: none; }
  .card-title svg { display: none; }

  .profile-hero { background: transparent; border: none; overflow: visible; }
  .profile-hero-content { padding: 0; }

  /* 账户主内容卡片 */
  .account-card {
    background: #111111 !important;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: var(--radius);
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .account-section { display: flex; flex-direction: column; gap: 5px; padding: 14px 0 !important; }
  .account-section:last-child { padding-bottom: 14px !important; }

  /* 用户头部：紧凑卡片式 */
  .profile-hero { background: transparent; border: none; overflow: visible; }
  .profile-hero-content { padding: 0; margin-bottom: 12px; }

  .profile-card {
    background: #161616;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--radius);
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .avatar-wrapper { position: relative; width: 44px; height: 44px; flex-shrink: 0; }
  .avatar {
    width: 44px; height: 44px; border-radius: var(--radius);
    background: var(--accent); display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 700; color: #fff; position: relative; z-index: 1;
  }
  .avatar-ring { position: absolute; inset: -2px; border-radius: var(--radius); background: var(--accent); opacity: 0; transition: opacity 0.3s; }
  .avatar-ring.vip-ring { opacity: 0.35; }

  .profile-info { flex: 1; min-width: 0; }
  .profile-name { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; display: flex; align-items: center; gap: 6px; }
  .vip-star { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; flex-shrink: 0; background: linear-gradient(135deg, var(--tier-gold), #ffaa00); border-radius: var(--radius); font-size: 10px; box-shadow: 0 1px 4px rgba(255,215,0,0.25); }
  .vip-star svg { width: 11px; height: 11px; fill: #000; stroke: none; }
  .profile-email { font-size: 11px; color: var(--text-muted); margin-bottom: 6px; }
  .profile-badges { display: flex; gap: 5px; flex-wrap: wrap; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: var(--radius); font-size: 10px; font-weight: 600; letter-spacing: 0.2px; }
  .badge-vip { background: rgba(255,215,0,0.12); color: var(--tier-gold); border: 1px solid rgba(255,215,0,0.3); }
  .badge-verified { background: rgba(34,197,94,0.12); color: var(--success); border: 1px solid rgba(34,197,94,0.3); }
  .badge-member { background: rgba(229,9,20,0.12); color: var(--accent); border: 1px solid rgba(229,9,20,0.3); }

  .profile-meta { flex-shrink: 0; text-align: right; }
  .profile-meta-value { font-size: 18px; font-weight: 700; color: var(--text-primary); line-height: 1; }
  .profile-meta-label { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  /* Subscription区域 - 紧凑行式布局 */
  .subscription-section { background: transparent; border: none; padding: 0; margin: 0; }
  .subscription-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 6px; border-bottom: 1px solid rgba(255, 255, 255, 0.12); padding-bottom: 8px;
  }
  .subscription-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
  .subscription-status { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: var(--radius); font-size: 9px; font-weight: 700; text-transform: uppercase; }
  .subscription-status.active { background: rgba(34,197,94,0.12); color: var(--success); }
  .subscription-status.expired { background: rgba(239,68,68,0.12); color: var(--error); }
  .subscription-status .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .subscription-status.active .dot { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }

  .subscription-details { display: flex; flex-direction: column; gap: 6px; }

  .subscription-detail { display: flex; align-items: center; gap: 8px; }
  .subscription-detail-label { font-size: 11px; color: var(--text-muted); white-space: nowrap; min-width: 60px; }
  .subscription-detail-value { font-size: 12px; font-weight: 600; color: var(--text-primary); flex: 1; }

  .subscription-detail.url-row { display: flex; align-items: center; gap: 6px; }
  .subscription-detail.url-row .subscription-detail-label { min-width: 64px; }

  .subscription-detail-value.code {
    font-family: 'SF Mono', monospace; font-size: 11px;
    display: flex; align-items: center; gap: 6px;
    background: var(--bg-primary); padding: 5px 8px;
    border-radius: var(--radius); border: 1px solid var(--border);
    flex: 1; min-width: 0;
  }
  .subscription-detail.url-row #vipCode {
    flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .sub-format-radios { display: flex; gap: 4px; flex-shrink: 0; }
  .sub-format-radios-modal { justify-content: center; margin-bottom: 12px; }
  .format-radio { color: var(--text-secondary); font-size: 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border: 1px solid var(--glass-border); border-radius: var(--radius); transition: all 0.2s; white-space: nowrap; }
  .format-radio:has(input:checked) { color: var(--text-primary); border-color: var(--accent); background: rgba(229,9,20,0.1); }
  .format-radio input { accent-color: var(--accent); cursor: pointer; }
  .copy-btn { padding: 2px 7px; background: var(--accent); color: #fff; border: none; border-radius: var(--radius); font-size: 9px; font-weight: 600; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
  .copy-btn:hover { opacity: 0.85; }

  /* Expires / Duration / IP 数 - 横向排列 */
  .subscription-detail.info-row {
    display: flex !important; flex-direction: row !important;
    gap: 0; border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 10px; margin-top: 0;
  }
  .subscription-detail.info-row > div { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 0 12px; border-right: 1px solid rgba(255, 255, 255, 0.08); }
  .subscription-detail.info-row > div:last-child { border-right: none; padding-right: 0; }

  /* 福利区域 - 紧凑行式 */
  .perks-section { background: transparent; border: none; padding: 0; margin: 0; }
  .perks-title { font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; border-bottom: 1px solid rgba(255, 255, 255, 0.12); padding-bottom: 8px; }
  .perks-grid { display: flex; flex-wrap: wrap; gap: 4px; }
  .perk-item { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; background: var(--bg-hover); border: 1px solid var(--border); border-radius: var(--radius); font-size: 11px; color: var(--text-secondary); transition: all 0.2s; }
  .perk-item:hover { border-color: var(--border-hover); color: var(--text-primary); }
  .perk-item svg { width: 12px; height: 12px; color: var(--success); flex-shrink: 0; }

  /* 线路方案切换 - 紧凑行式 */
  .scheme-section { background: transparent; border: none; padding: 0; margin: 0; }
  .scheme-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-bottom: 1px solid rgba(255, 255, 255, 0.12); padding-bottom: 8px; }
  .scheme-section-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
  .scheme-section-title svg { width: 15px; height: 15px; color: var(--accent); }
  .scheme-section-hint { font-size: 11px; color: var(--text-muted); }
  .scheme-section-hint a { color: var(--accent); text-decoration: none; font-weight: 600; }
  .scheme-section-hint a:hover { text-decoration: underline; }
  .scheme-switcher { display: flex; flex-wrap: wrap; gap: 4px; }
  .scheme-chip { padding: 4px 10px; font-size: 11px; background: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; white-space: nowrap; font-family: inherit; font-weight: 500; }
  .scheme-chip:hover:not(:disabled) { background: var(--bg-elevated); color: var(--text-primary); border-color: var(--border-hover); }
  .scheme-chip.selected { background: rgba(229,9,20,0.15); color: var(--text-primary); border-color: var(--accent); }
  .scheme-chip:disabled { opacity: 0.5; cursor: not-allowed; }
  .scheme-vip-lock { margin-top: 4px; font-size: 10px; color: var(--text-muted); }
  .scheme-vip-lock a { color: var(--accent); text-decoration: none; font-weight: 600; }
  .scheme-vip-lock a:hover { text-decoration: underline; }




  .info-panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }

  .info-panel-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }

  .info-list { display: flex; flex-direction: column; }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--glass-border);
  }

  .info-row:last-child { border-bottom: none; }

  .info-label { color: var(--text-secondary); font-size: 12px; }

  .info-value {
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .info-value svg { width: 14px; height: 14px; }

  .info-value.verified { color: var(--success); }

  .order-list { display: flex; flex-direction: column; gap: 0; }

  .order-list { display: flex; flex-direction: column; gap: 8px; }

  .order-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 16px;
    transition: border-color 0.2s;
  }
  .order-card:hover { border-color: rgba(255, 255, 255, 0.15); }

  .order-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .order-date-block { }
  .order-date-main { font-size: 16px; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
  .order-date-time { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .order-amount-block { text-align: right; }
  .order-amount { font-size: 22px; font-weight: 700; color: var(--success); line-height: 1; }
  .order-amount-small { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
  .order-amount-old { text-decoration: line-through; color: var(--text-muted); font-size: 13px; margin-right: 6px; }

  .order-meta { display: flex; flex-wrap: wrap; gap: 16px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.06); }
  .order-meta-item { display: flex; flex-direction: column; gap: 2px; }
  .order-meta-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .order-meta-value { font-size: 12px; color: var(--text-primary); }
  .order-meta-value a { color: var(--accent); text-decoration: none; word-break: break-all; }
  .order-meta-value a:hover { text-decoration: underline; }
  .order-meta-value.code { font-family: monospace; font-size: 11px; color: var(--text-secondary); }

  .order-status {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: var(--radius);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .order-status.completed { background: rgba(52, 199, 89, 0.15); color: var(--success); }

  .order-status.pending { background: rgba(255, 204, 0, 0.15); color: var(--warning); }

  .order-status.cancelled { background: rgba(255, 59, 48, 0.15); color: var(--error); }

  .ticket-list { display: flex; flex-direction: column; gap: 6px; }

  .ticket-card {
    background: transparent;
    border-radius: 0;
    padding: 10px 0;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    padding-left: 12px;
  }
  .ticket-card:last-child { border-bottom: none; }

  .ticket-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    border-radius: 0;
  }

  .ticket-card.payment::before { background: var(--warning); }
  .ticket-card.order::before { background: var(--success); }
  .ticket-card.technical::before { background: var(--neon-cyan); }
  .ticket-card.other::before { background: var(--text-muted); }

  .ticket-card:hover { transform: none; border-color: rgba(255, 255, 255, 0.15); background: rgba(255,255,255,0.02); }

  .ticket-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px; }

  .ticket-type {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: var(--radius);
    letter-spacing: 0.5px;
  }

  .ticket-type.payment { background: rgba(255,204,0,0.15); color: var(--warning); }
  .ticket-type.order { background: rgba(52,199,89,0.15); color: var(--success); }
  .ticket-type.technical { background: rgba(0,212,255,0.15); color: var(--neon-cyan); }
  .ticket-type.other { background: rgba(255,255,255,0.1); color: var(--text-secondary); }

  .ticket-status {
    padding: 2px 6px;
    border-radius: var(--radius);
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .ticket-status.pending { background: rgba(255,204,0,0.15); color: var(--warning); }
  .ticket-status.processing { background: rgba(0,122,255,0.15); color: #007aff; }
  .ticket-status.resolved { background: rgba(52,199,89,0.15); color: var(--success); }
  .ticket-status.closed { background: rgba(142,142,147,0.15); color: #8e8e93; }

  .ticket-subject { color: var(--text-primary); font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .ticket-meta { color: var(--text-muted); font-size: 10px; display: flex; gap: 10px; }

  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }

  .section-header h3 { font-size: 16px; font-weight: 700; color: var(--text-primary); }

  .btn-accent {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--accent);
    color: #fff;
    border: none;
    padding: 7px 14px;
    border-radius: var(--radius);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-accent:hover { opacity: 0.85; }

  .success-modal,
  .ticket-modal {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    z-index: 3000;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .success-modal.show,
  .ticket-modal.show { display: flex; }

  .success-content,
  .ticket-modal-content {
    background: linear-gradient(145deg, #1a1a2e, #0a0a0f);
    border-radius: var(--radius);
    padding: 40px;
    max-width: 480px;
    width: 100%;
    text-align: center;
    border: 1px solid var(--glass-border);
    box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5), 0 0 60px rgba(229, 9, 20, 0.15);
    animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  @keyframes modalSlideIn {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .success-icon {
    font-size: 72px;
    margin-bottom: 24px;
    animation: bounceIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
  }

  @keyframes bounceIn {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .success-title { font-size: 28px; font-weight: 800; color: var(--text-primary); margin: 0 0 12px 0; }

  .success-message { color: var(--text-secondary); font-size: 15px; margin-bottom: 28px; }

  .code-display {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    padding: 18px;
    margin-bottom: 24px;
    color: var(--text-primary);
    font-size: 13px;
    word-break: break-all;
    font-family: 'SF Mono', monospace;
    text-align: left;
  }

  .copy-button {
    background: var(--gradient-neon);
    color: #fff;
    border: none;
    padding: 16px 32px;
    border-radius: var(--radius);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
    margin-bottom: 16px;
  }

  .copy-button:hover { transform: translateY(-3px); box-shadow: 0 8px 30px var(--accent-glow); }

  .modal-tips { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--glass-border); }

  .modal-tip { color: var(--text-secondary); font-size: 13px; line-height: 1.6; margin-bottom: 8px; }

  .modal-tip-highlight { color: var(--text-muted); font-size: 12px; margin-top: 16px; }

  .modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    transition: all 0.2s;
  }

  .modal-close:hover { background: rgba(255, 255, 255, 0.1); color: var(--text-primary); transform: rotate(90deg); }

  .ticket-modal-content { max-width: 560px; text-align: left; padding: 32px; }

  .ticket-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--glass-border);
  }

  .ticket-modal-header h3 { margin: 0; font-size: 22px; font-weight: 700; color: var(--text-primary); }

  .ticket-modal-close {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    transition: all 0.2s;
  }

  .ticket-modal-close:hover { background: rgba(255, 255, 255, 0.1); color: var(--text-primary); }

  .form-group { margin-bottom: 22px; }

  .form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    font-size: 15px;
    background: rgba(0, 0, 0, 0.3);
    color: var(--text-primary);
    transition: all 0.3s;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.15);
  }

  .form-group textarea { min-height: 120px; resize: vertical; }

  .btn {
    padding: 14px 28px;
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s;
  }

  .btn-primary { background: var(--gradient-neon); color: #fff; }

  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 24px var(--accent-glow); }

  .btn-secondary { background: rgba(255, 255, 255, 0.06); color: var(--text-primary); border: 1px solid var(--glass-border); }

  .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }

  .btn-danger { background: rgba(255, 59, 48, 0.15); color: var(--error); border: 1px solid rgba(255, 59, 48, 0.3); }

  .btn-danger:hover { background: var(--error); color: #fff; }

  .ticket-reply {
    background: rgba(0, 0, 0, 0.3);
    border-radius: var(--radius);
    padding: 18px;
    margin-bottom: 12px;
    border-left: 4px solid var(--accent);
  }

  .ticket-reply.admin { border-left-color: var(--neon-cyan); }

  .ticket-reply-header { display: flex; justify-content: space-between; margin-bottom: 10px; }

  .ticket-reply-author { font-size: 14px; font-weight: 600; color: var(--text-primary); }

  .ticket-reply.admin .ticket-reply-author { color: var(--neon-cyan); }

  .ticket-reply-time { font-size: 12px; color: var(--text-muted); }

  .ticket-reply-content { color: var(--text-secondary); font-size: 14px; line-height: 1.6; }

  .ticket-reply-form { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--glass-border); }

  .ticket-reply-form textarea { margin-bottom: 14px; }

  .reply-list {
    max-height: 350px;
    overflow-y: auto;
    margin-bottom: 20px;
    padding-right: 8px;
  }

  .reply-list::-webkit-scrollbar { width: 6px; }

  .reply-list::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: var(--radius); }

  .reply-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: var(--radius); }

  .empty-state,
  .empty-tickets { text-align: center; padding: 40px 16px; }

  .empty-state svg,
  .empty-tickets svg { width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.25; }

  .empty-state p,
  .empty-tickets p { font-size: 13px; color: var(--text-muted); }

  .empty-tickets h4 { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }

  .empty-tickets p { margin-bottom: 16px; }

  .loading { display: none; text-align: center; padding: 60px; }

  .loading.active { display: block; }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--glass-border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .toast-container {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4000;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 20px;
    max-width: 420px;
    width: 100%;
    pointer-events: none;
  }

  .toast {
    background: linear-gradient(145deg, #1a1a2e, #0a0a0f);
    backdrop-filter: blur(20px);
    border-radius: var(--radius);
    padding: 16px 20px;
    border: 1px solid var(--glass-border);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    pointer-events: auto;
    animation: toastSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes toastSlideIn {
    from { opacity: 0; transform: translateY(-20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .toast.success { border-color: rgba(52, 199, 89, 0.4); }
  .toast.success .toast-icon { color: var(--success); }
  .toast.error { border-color: rgba(255, 59, 48, 0.4); }
  .toast.error .toast-icon { color: var(--error); }
  .toast.warning { border-color: rgba(255, 204, 0, 0.4); }
  .toast.warning .toast-icon { color: var(--warning); }

  .toast-content { display: flex; align-items: center; gap: 12px; }

  .toast-icon { font-size: 20px; }

  .toast-message { color: var(--text-primary); font-size: 14px; font-weight: 500; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @media (max-width: 900px) {
    .dashboard-layout { flex-direction: column; gap: 12px; }

    .sidebar {
      width: 100%;
      flex-direction: row;
      overflow-x: auto;
      padding: 10px 8px;
      gap: 4px;
      position: static;
      border-radius: var(--radius);
      margin-bottom: 4px;
    }

    .sidebar-item { flex-shrink: 0; padding: 8px 14px; font-size: 13px; }
    .sidebar-item svg { width: 15px; height: 15px; }
    .sidebar-item.active { border-left: none; border-bottom: 2px solid var(--accent); padding-left: 14px; padding-bottom: 6px; }
    .sidebar-divider { display: none; }
    .sidebar-item.logout { margin-top: 0; margin-left: auto; padding: 8px 14px; }

    .main-content { padding: 16px 12px 32px; }
  }

  @media (max-width: 600px) {
    .main-content { padding: 12px 10px 24px; margin-top: 56px; }

    .dashboard-layout { gap: 10px; }

    .account-card { padding: 12px 14px; gap: 0; }
    .account-section { padding: 10px 0 !important; }

    .profile-card { padding: 10px 12px; gap: 10px; flex-wrap: wrap; }
    .avatar-wrapper { width: 40px; height: 40px; }
    .avatar { width: 40px; height: 40px; font-size: 16px; }
    .profile-name { font-size: 14px; }
    .profile-email { font-size: 11px; }
    .profile-meta { display: none; }

    .subscription-detail.info-row { flex-wrap: wrap; gap: 8px; }
    .subscription-detail.info-row > div { flex: 1 1 calc(50% - 4px); border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 4px 0 !important; }
    .subscription-detail.info-row > div:last-child { border-bottom: none; }

    .card { padding: 0; }
  }
`;

export const content = `
<main class="main-content">
  <div class="dashboard-layout">
    <nav class="sidebar">
      <button class="sidebar-item active" onclick="switchTab('account')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path></svg>
Account
      </button>
      <button class="sidebar-item" onclick="switchTab('orders')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
Orders
      </button>
      <button class="sidebar-item" onclick="switchTab('tickets')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="1"></rect></svg>
Tickets
      </button>
      <div class="sidebar-divider"></div>
      <button class="sidebar-item logout" onclick="logout()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
Logout
      </button>
    </nav>

    <div class="content-area">
      <div id="accountTab" class="tab-panel active">
        <div class="profile-hero" id="profileHero">
          <div class="profile-hero-content">
            <div class="profile-card">
              <div class="avatar-wrapper">
                <div class="avatar-ring vip-ring" id="avatarRing"></div>
                <div class="avatar" id="userAvatar">?</div>
              </div>
              <div class="profile-info">
                <div class="profile-name">
                  <span id="userName">用户</span>
                  <span class="vip-star" id="vipStar" style="display: inline-flex;">
                    <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  </span>
                </div>
                <div class="profile-email" id="userEmail">-</div>
                <div class="profile-badges">
                  <span class="badge badge-vip" id="vipBadge" style="display: inline-flex;">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    <span id="vipTierName">Crown VIP</span>
                  </span>
                  <span class="badge badge-verified" id="verifiedBadge" style="display: none;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="10" height="10"><polyline points="20 6 9 17 4 12"></polyline></svg>
Verified
                  </span>
                  <span class="badge badge-member" id="memberBadge">
Member <span id="memberSince">-</span>
                  </span>
                </div>
              </div>
              <div class="profile-meta" id="profileMeta" style="display:none;">
                <div class="profile-meta-value" id="metaValue">-</div>
                <div class="profile-meta-label">Days Left</div>
              </div>
            </div>

            <div class="account-card">
            <div class="account-section">
            <div class="scheme-section" id="schemeSection" style="display:none;">
              <div class="scheme-section-header">
                <span class="scheme-section-title">Current Scheme</span>
                <span class="scheme-section-hint" id="schemeSectionHint"></span>
              </div>
              <div class="scheme-switcher" id="schemeSwitcher"></div>
              <div class="scheme-vip-lock" id="schemeVipLock" style="display:none;">
                🔒 切换线路方案为 VIP exclusive feature. <a href="/subscription">Upgrade to VIP →</a>
              </div>
            </div>

            <div class="account-section">
            <div class="subscription-section" id="subscriptionSection" style="display: block;">
              <div class="subscription-header">
                <span class="subscription-title">Subscription</span>
                <span class="subscription-status active" id="subscriptionStatus"><span class="dot"></span> Active</span>
              </div>
              <div class="subscription-details">
                <div class="subscription-detail url-row">
                  <span class="subscription-detail-label">Subscription URL</span>
                  <div class="sub-format-radios">
                    <label class="format-radio"><input type="radio" name="vipFormat" value="m3u" checked onchange="updateVipCodeFormat()"> M3U</label>
                    <label class="format-radio"><input type="radio" name="vipFormat" value="txt" onchange="updateVipCodeFormat()"> TXT</label>
                  </div>
                  <span class="subscription-detail-value code" id="vipCode" data-code="PERMA34VIP">https://iptv-search.com/sub/PERMA34VIP.m3u</span>
                  <button class="copy-btn" onclick="copyVipCode()">Copy</button>
                </div>
                <div class="subscription-detail info-row">
                  <div>
                    <span class="subscription-detail-label">Expires</span>
                    <span class="subscription-detail-value" id="vipExpiry">Permanent</span>
                  </div>
                  <div>
                    <span class="subscription-detail-label">Duration</span>
                    <span class="subscription-detail-value" id="vipDuration">-1 days</span>
                  </div>
                  <div>
                    <span class="subscription-detail-label">Max IPs</span>
                    <span class="subscription-detail-value" id="vipMaxIps">5</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="account-section">
            <div class="perks-section" id="perksSection" style="display: block;">
              <div class="perks-title">Your Benefits</div>
              <div class="perks-grid">
                <span class="perk-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>No Ads</span>
                <span class="perk-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>Unlimited Channels</span>
                <span class="perk-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>Priority Support</span>
                <span class="perk-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>Cloud Sync</span>
              </div>
            </div>
            </div>
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div id="ordersTab" class="tab-panel" style="display: none;">
        <div class="account-card">
          <div id="ordersList" class="order-list"></div>
          <div id="ordersLoading" class="loading"><div class="spinner"></div></div>
        </div>
      </div>

      <div id="ticketsTab" class="tab-panel" style="display: none;">
        <div class="card">
          <div id="ticketsList" class="ticket-list"></div>
          <div id="ticketsLoading" class="loading"><div class="spinner"></div></div>
        </div>
      </div>
    </div>
  </div>
</main>

<div class="toast-container" id="toastContainer"></div>

<div id="successModal" class="success-modal">
  <div class="success-content">
    <button class="modal-close" onclick="closeSuccessModal()">×</button>
    <div class="success-icon">🎉</div>
    <h2 class="success-title" data-i18n="paymentSuccess">paymentSuccess</h2>
    <p class="success-message" data-i18n="subUrlGenerated">subUrlGenerated</p>
    <div class="sub-format-radios sub-format-radios-modal">
      <label class="format-radio"><input type="radio" name="modalFormat" value="m3u" checked onchange="updateModalCodeFormat()"> M3U</label>
      <label class="format-radio"><input type="radio" name="modalFormat" value="txt" onchange="updateModalCodeFormat()"> TXT</label>
    </div>
    <div class="code-display" id="generatedCode">-</div>
    <button class="copy-button" onclick="copyCode()" data-i18n="copyUrl">copyUrl</button>
    <div class="modal-tips">
      <p class="modal-tip">直接将此URL添加到你的IPTV播放器中</p>
      <p class="modal-tip-highlight">关闭后查看账户内的订单详情</p>
    </div>
  </div>
</div>

<div id="createTicketModal" class="ticket-modal">
  <div class="ticket-modal-content">
    <div class="ticket-modal-header">
      <h3 data-i18n="createNewTicket">createNewTicket</h3>
      <button class="ticket-modal-close" onclick="closeCreateTicketModal()">×</button>
    </div>
    <form id="createTicketForm">
      <div class="form-group">
        <label data-i18n="selectOrder">selectOrder</label>
        <select id="ticketOrderId" required>
          <option value="" data-i18n="selectOrderPlaceholder">selectOrderPlaceholder</option>
        </select>
      </div>
      <div class="form-group">
        <label data-i18n="ticketType">ticketType</label>
        <select id="ticketType" required>
          <option value="payment" data-i18n="typePayment">typePayment</option>
          <option value="order" data-i18n="typeOrder">typeOrder</option>
          <option value="technical" data-i18n="typeTechnical">typeTechnical</option>
          <option value="other" data-i18n="typeOther">typeOther</option>
        </select>
      </div>
      <div class="form-group">
        <label data-i18n="ticketSubject">ticketSubject</label>
        <input type="text" id="ticketSubject" required maxlength="200" placeholder="简要描述你的问题">
      </div>
      <div class="form-group">
        <label data-i18n="ticketDescription">ticketDescription</label>
        <textarea id="ticketDescription" required placeholder="请详细描述你的问题......"></textarea>
      </div>
      <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
        <button type="button" class="btn btn-secondary" onclick="closeCreateTicketModal()" data-i18n="cancel">cancel</button>
        <button type="submit" class="btn btn-primary" data-i18n="submitTicket">submitTicket</button>
      </div>
    </form>
  </div>
</div>

<div id="ticketDetailModal" class="ticket-modal">
  <div class="ticket-modal-content">
    <div class="ticket-modal-header">
      <h3 id="ticketDetailTitle">Tickets详情</h3>
      <button class="ticket-modal-close" onclick="closeTicketDetailModal()">×</button>
    </div>
    <div id="ticketDetailContent"></div>
    <div class="ticket-reply-form" id="ticketReplyForm">
      <textarea id="replyContent" placeholder="请在这里输入你的回复......"></textarea>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button type="button" class="btn btn-danger" onclick="closeTicketAction()" data-i18n="closeTicket">closeTicket</button>
        <button type="button" class="btn btn-primary" onclick="submitTicketReply()" data-i18n="sendReply">sendReply</button>
      </div>
    </div>
  </div>
</div>

<script>
const API_BASE = '/api/auth';

function detectBrowserLanguage() {
  const savedLang = localStorage.getItem('account_lang');
  if (savedLang) return savedLang;
  const browserLang = navigator.language || navigator.userLanguage || 'zh-CN';
  return browserLang.startsWith('zh') && (browserLang.includes('CN') || browserLang === 'zh') ? 'zh-CN' : 'en';
}

let currentLang = detectBrowserLanguage();
function t(key) { return key; }

function setLanguage() {
  const titleKey = document.querySelector('[data-i18n-title]');
  if (titleKey) {
    const key = titleKey.getAttribute('data-i18n-title');
    document.title = t(key);
  }
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setLanguage(currentLang));
} else {
  setLanguage(currentLang);
}

function getToken() { return localStorage.getItem('auth_token'); }

const urlParams = new URLSearchParams(window.location.search);
const urlToken = urlParams.get('token');
if (urlToken) {
  localStorage.setItem('auth_token', urlToken);
  window.history.replaceState({}, document.title, window.location.pathname);
}

if (!getToken()) {
  window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
}

async function validateToken() {
  try {
    const response = await fetch(API_BASE + '/user', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return response.ok;
  } catch (error) {
    console.error('验证token失败:', error);
    return false;
  }
}

(async () => {
  const isValid = await validateToken();
  if (!isValid) {
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
  }
})();

function switchTab(tab) {
  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  if (tab === 'account') sidebarItems[0].classList.add('active');
  else if (tab === 'orders') sidebarItems[1].classList.add('active');
  else if (tab === 'tickets') sidebarItems[2].classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(panel => panel.style.display = 'none');
  document.getElementById(tab + 'Tab').style.display = 'block';

  if (tab === 'account') loadUserInfo();
  else if (tab === 'orders') loadOrderHistory();
  else if (tab === 'tickets') loadTickets();
}

async function loadUserInfo() {
  try {
    const response = await fetch(API_BASE + '/user', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();
    if (response.ok && data.success) {
      const user = data.user;
      const createdDate = new Date(user.created_at);
      document.getElementById('userName').textContent = user.email.split('@')[0];
      document.getElementById('userEmail').textContent = user.email;
      document.getElementById('userAvatar').textContent = user.email.charAt(0).toUpperCase();
      document.getElementById('memberSince').textContent = createdDate.toLocaleDateString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US', { month: 'short', year: 'numeric' });
      if (user.is_verified) {
        document.getElementById('verifiedBadge').style.display = 'inline-flex';
      }
    } else {
      showToast(data.error || t('loadUserInfoFailed'), 'error');
      if (response.status === 401) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error);
    showToast(t('networkError'), 'error');
  }
}

async function loadVipStatus() {
  const profileHero = document.getElementById('profileHero');
  const avatarRing = document.getElementById('avatarRing');
  const vipStar = document.getElementById('vipStar');
  const vipBadge = document.getElementById('vipBadge');
  const vipTierNameEl = document.getElementById('vipTierName');
  const subscriptionSection = document.getElementById('subscriptionSection');
  const vipCodeEl = document.getElementById('vipCode');
  const vipExpiryEl = document.getElementById('vipExpiry');
  const vipDurationEl = document.getElementById('vipDuration');
  const vipMaxIpsEl = document.getElementById('vipMaxIps');
  const subscriptionStatusEl = document.getElementById('subscriptionStatus');
  const vipStatusTextEl = document.getElementById('vipStatusText');
  const perksSection = document.getElementById('perksSection');

  if (!profileHero || !avatarRing) { console.error('Profile hero elements not found'); return; }

  try {
    const response = await fetch(API_BASE + '/orders', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();

    if (vipBadge) vipBadge.style.display = 'none';
    if (vipStar) vipStar.style.display = 'none';
    if (subscriptionSection) subscriptionSection.style.display = 'none';
    if (perksSection) perksSection.style.display = 'none';
    if (avatarRing) avatarRing.classList.remove('vip-ring');
    if (subscriptionStatusEl) subscriptionStatusEl.className = 'subscription-status';

    if (response.ok && data.success && data.orders && data.orders.length > 0) {
      const completedOrders = data.orders.filter(order => order.status === 'completed');
      if (completedOrders.length === 0) return;

      const latestOrder = completedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      const now = new Date();
      const codeExpiredAt = latestOrder.expired_at;
      const isExpired = codeExpiredAt && new Date(codeExpiredAt) < now;
      const isPermanent = latestOrder.code_duration_days === -1 || latestOrder.code_duration_days === null;

      let remainingDays = -1;
      if (!isPermanent && codeExpiredAt) {
        const expiryDate = new Date(codeExpiredAt);
        if (expiryDate > now) remainingDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      }

      let tierName = 'VIP';
      if (isPermanent || remainingDays === -1) tierName = 'Crown VIP';
      else if (remainingDays > 365) tierName = 'Crown VIP';
      else if (remainingDays > 180) tierName = 'Emerald VIP';
      else if (remainingDays > 90) tierName = 'Gold VIP';
      else if (remainingDays > 30) tierName = 'Silver VIP';
      else tierName = 'Bronze VIP';

      if (vipBadge) { vipBadge.style.display = 'inline-flex'; vipTierNameEl.textContent = tierName; }
      if (vipStar) vipStar.style.display = 'inline-flex';
      if (subscriptionSection) subscriptionSection.style.display = 'block';
      if (perksSection) perksSection.style.display = 'block';
      if (avatarRing) avatarRing.classList.add('vip-ring');

      // 右侧Days Left
      const metaEl = document.getElementById('profileMeta');
      const metaValueEl = document.getElementById('metaValue');
      if (metaEl && metaValueEl) {
        if (isExpired) {
          metaEl.style.display = 'none';
        } else {
          metaEl.style.display = 'block';
          metaValueEl.textContent = isPermanent ? '∞' : String(remainingDays);
          metaValueEl.style.color = isPermanent ? 'var(--tier-gold)' : (remainingDays <= 7 ? 'var(--error)' : 'var(--text-primary)');
        }
      }

      const baseUrl = window.location.origin;
      window._vipCodeBase = baseUrl + '/sub/' + latestOrder.code;
      if (vipCodeEl) vipCodeEl.dataset.code = latestOrder.code;
      updateVipCodeFormat();

      let expiryText = 'Permanent';
      if (isExpired) {
        expiryText = codeExpiredAt ? new Date(codeExpiredAt).toLocaleDateString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US') : 'Expired';
        if (subscriptionStatusEl) { subscriptionStatusEl.className = 'subscription-status expired'; subscriptionStatusEl.innerHTML = '<span class="dot"></span> Expired'; }
        if (vipStatusTextEl) vipStatusTextEl.textContent = 'Expired';
      } else if (isPermanent) {
        expiryText = 'Permanent';
        if (subscriptionStatusEl) { subscriptionStatusEl.className = 'subscription-status active'; subscriptionStatusEl.innerHTML = '<span class="dot"></span> Active'; }
        if (vipStatusTextEl) vipStatusTextEl.textContent = 'Active';
      } else {
        expiryText = codeExpiredAt ? new Date(codeExpiredAt).toLocaleDateString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US') : 'Permanent';
        if (subscriptionStatusEl) { subscriptionStatusEl.className = 'subscription-status active'; subscriptionStatusEl.innerHTML = '<span class="dot"></span> Active'; }
        if (vipStatusTextEl) vipStatusTextEl.textContent = 'Active';
      }
      if (vipExpiryEl) vipExpiryEl.textContent = expiryText;

      const dayUnit = currentLang === 'zh-CN' ? ' days' : ' days';
      if (vipDurationEl) vipDurationEl.textContent = latestOrder.duration_days ? latestOrder.duration_days + (currentLang === 'zh-CN' ? ' days' : ' days') : '-';
      if (vipMaxIpsEl) vipMaxIpsEl.textContent = latestOrder.max_ips || 3;

      // 初始化线路方案
      latestActiveCode = latestOrder.code;
      isVipActive = !isExpired;  // VIP 门控：有 active Subscription即可
      if (latestOrder.sub_mode === 'favorites') currentScheme = { type: 'favorites' };
      else if (latestOrder.topic_id) currentScheme = { type: 'topic', id: latestOrder.topic_id };
      else currentScheme = { type: 'all' };
      const schemeEl = document.getElementById('schemeSection');
      const hintEl = document.getElementById('schemeSectionHint');
      if (schemeEl) {
        schemeEl.style.display = 'block';
        if (hintEl) {
          if (isExpired) {
            hintEl.textContent = currentLang === 'zh-CN' ? 'Subscription已Expires，无法切换' : 'Subscription expired';
          } else {
            hintEl.innerHTML = (currentLang === 'zh-CN' ? 'Takes effect immediately · Subscription URL unchanged · Current:' : 'Takes effect immediately · Current: ');
          }
        }
        loadSchemes();
      }
    } else {
      // 无 completed 订单
      latestActiveCode = null;
      currentScheme = { type: 'all' };
      const schemeEl = document.getElementById('schemeSection');
      if (schemeEl) {
        schemeEl.style.display = 'block';
        const hintEl = document.getElementById('schemeSectionHint');
        if (hintEl) hintEl.textContent = currentLang === 'zh-CN' ? '激活Subscription后可切换方案' : 'Activate subscription to switch';
        loadSchemes();
      }
    }
  } catch (error) {
    console.error('加载VIP状态失败:', error);
    const schemeEl = document.getElementById('schemeSection');
    if (schemeEl) {
      schemeEl.style.display = 'block';
      loadSchemes();
    }
  }
}

function getVipFormat() {
  const sel = document.querySelector('input[name="vipFormat"]:checked');
  return sel ? sel.value : 'm3u';
}
function updateVipCodeFormat() {
  if (!window._vipCodeBase) return;
  const vipCodeEl = document.getElementById('vipCode');
  if (vipCodeEl) vipCodeEl.textContent = window._vipCodeBase + '.' + getVipFormat();
}

// ============ 线路方案切换 ============
let currentScheme = { type: 'all' }; // {type:'all'|'favorites'|'topic', id?:number|string}
let availableSchemes = [];
let latestActiveCode = null;
let schemeSwitching = false;
let isVipActive = false; // 由 loadVipStatus 根据 active Subscription设置

function isCurrentScheme(s) {
  if (currentScheme.type === 'all') return s.type === 'all';
  if (currentScheme.type === 'favorites') return s.type === 'favorites';
  if (currentScheme.type === 'topic') return s.type === 'topic' && String(currentScheme.id) === String(s.id);
  return false;
}

function renderSchemeSwitcher() {
  const container = document.getElementById('schemeSwitcher');
  if (!container) return;
  if (availableSchemes.length === 0) {
    container.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">' +
      (currentLang === 'zh-CN' ? '暂无可用方案' : 'No schemes available') + '</span>';
    return;
  }
  const parts = [];
  for (const s of availableSchemes) {
    const selected = isCurrentScheme(s);
    const safeName = String(s.name).replace(/[&<>"']/g, function (c) {
      const m = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return m[c];
    });
    const cls = 'scheme-chip' + (selected ? ' selected' : '');
    const dis = (schemeSwitching || !isVipActive) ? ' disabled' : '';
    parts.push('<button type="button" class="' + cls + '" data-type="' + s.type + '" data-id="' + s.id + '"' + dis + '>' + safeName + '</button>');
  }
  container.innerHTML = parts.join('');
  container.querySelectorAll('.scheme-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      selectScheme(chip.dataset.type, chip.dataset.id);
    });
  });

  // VIP 锁提示
  const lockEl = document.getElementById('schemeVipLock');
  if (lockEl) lockEl.style.display = (!isVipActive && latestActiveCode === null) ? 'block' : 'none';
}

async function loadSchemes() {
  try {
    const resp = await fetch('/api/subscription/topics');
    const data = await resp.json();
    const topics = (data && data.success && Array.isArray(data.topics)) ? data.topics : [];
    availableSchemes = [
      { type: 'all', id: 'all', name: 'All Channels' },
      { type: 'favorites', id: 'favorites', name: 'My Favorites' },
    ];
    topics.forEach(function (t) {
      // id:0 是后端注入的默认"All Channels"，account.js 已硬编码，跳过避免重复
      if (t.id === 0) return;
      availableSchemes.push({ type: 'topic', id: t.id, name: t.name });
    });
    renderSchemeSwitcher();
  } catch (err) {
    console.error('Failed to load schemes:', err);
    const c = document.getElementById('schemeSwitcher');
    if (c) c.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">' +
      (currentLang === 'zh-CN' ? '加载失败' : 'Load failed') + '</span>';
  }
}

async function checkFavoritesCount() {
  try {
    const token = getToken();

    // 测试环境：从 localStorage 读取
    if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
      try {
        const localFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
        return localFavs.length;
      } catch (e) {
        return 0;
      }
    }

    // 生产环境：优先从云端读取，失败时回退到 localStorage
    if (!token) {
      // 无 token，尝试从本地读取
      try {
        return JSON.parse(localStorage.getItem('favorites') || '[]').length;
      } catch (e) {
        return 0;
      }
    }
    try {
      const resp = await fetch('/api/favorites', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.favorites) return data.favorites.length;
      }
    } catch (e) {
      console.warn('Failed to fetch cloud favorites, using local', e.message);
    }
    // 云端失败，回退到本地
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]').length;
    } catch (e) {
      return 0;
    }
  } catch (e) {
    return 0;
  }
}

async function selectScheme(type, id) {
  if (schemeSwitching) return;
  if (!isVipActive) {
    showToast((currentLang === 'zh-CN' ? 'Switching schemes requires VIP. Please' : 'VIP only. Please ') +
      '<a href="/subscription" style="color:#fff;font-weight:600;text-decoration:underline;">' +
      (currentLang === 'zh-CN' ? 'upgrade VIP' : 'subscribe') + ' →</a>', 'error', 6000);
    return;
  }
  if (!latestActiveCode) {
    showToast(currentLang === 'zh-CN' ? '暂未激活Subscription' : 'No active subscription', 'error');
    return;
  }
  if (isCurrentScheme({ type: type, id: id })) return;

  // My Favorites：先检查收藏数
  if (type === 'favorites') {
    const count = await checkFavoritesCount();
    if (count === 0) {
      showToast((currentLang === 'zh-CN' ?
        '你还没有任何收藏，请先到<a href="/favorites" style="color:#fff;font-weight:600;text-decoration:underline;">收藏页</a>添加频道' :
        'No favorites yet. Add some at <a href="/favorites">/favorites</a>'), 'warning', 6000);
      return;
    }
  }

  let nextSubMode = null;
  let nextTopicId = null;
  if (type === 'all') { nextSubMode = null; nextTopicId = null; }
  else if (type === 'favorites') { nextSubMode = 'favorites'; nextTopicId = null; }
  else if (type === 'topic') { nextSubMode = null; nextTopicId = Number(id); }
  else { return; }

  schemeSwitching = true;
  renderSchemeSwitcher();
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  try {
    const subUrl = '/api/user/change-sub-mode?code=' + encodeURIComponent(latestActiveCode);
    const subResp = await fetch(subUrl, { method: 'POST', headers, body: JSON.stringify({ sub_mode: nextSubMode }) });
    const subData = await subResp.json();
    if (!subResp.ok || !subData.success) throw new Error(subData.error || ('HTTP ' + subResp.status));

    const topicUrl = '/api/change-topic?code=' + encodeURIComponent(latestActiveCode);
    const topicResp = await fetch(topicUrl, { method: 'POST', headers, body: JSON.stringify({ topic_id: nextTopicId }) });
    const topicData = await topicResp.json();
    if (!topicResp.ok || !topicData.success) throw new Error(topicData.error || ('HTTP ' + topicResp.status));

    currentScheme = (type === 'topic') ? { type: type, id: nextTopicId } : { type: type };
    renderSchemeSwitcher();
    showToast(currentLang === 'zh-CN' ? 'Scheme updated' : 'Scheme updated', 'success', 3000);
  } catch (err) {
    console.error('Scheme change failed:', err);
    showToast(currentLang === 'zh-CN' ? '更新失败：' + err.message : 'Update failed: ' + err.message, 'error', 5000);
    renderSchemeSwitcher();
  } finally {
    schemeSwitching = false;
    renderSchemeSwitcher();
  }
}
function copyVipCode() {
  const vipCodeEl = document.getElementById('vipCode');
  if (!vipCodeEl) { console.error('vipCode element not found'); return; }
  const codeText = vipCodeEl.textContent;
  navigator.clipboard.writeText(codeText).then(() => {
    showToast(currentLang === 'zh-CN' ? 'Subscription地址已Copy！' : 'Subscription URL copied!', 'success');
  }).catch(err => { console.error('Copy failed:', err); });
}

async function loadOrderHistory() {
  const ordersListDiv = document.getElementById('ordersList');
  const loadingDiv = document.getElementById('ordersLoading');
  ordersListDiv.innerHTML = '';
  loadingDiv.classList.add('active');
  try {
    const response = await fetch(API_BASE + '/orders', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();
    if (response.ok && data.success) {
      const orders = data.orders || [];
      if (orders.length === 0) {
        ordersListDiv.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><p>' + t('noOrders') + '</p></div>';
      } else {
        ordersListDiv.innerHTML = orders.map(order => {
          const createdDate = new Date(order.created_at);
          const statusText = { completed: t('statusCompleted'), pending: t('statusPending'), cancelled: t('statusCancelled') }[order.status] || order.status;
          const baseUrl = window.location.origin;
          const subUrl = order.code ? (baseUrl + '/sub/' + order.code + '.m3u') : '-';
          const dateStr = createdDate.toLocaleDateString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US');
          const timeStr = createdDate.toLocaleTimeString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' });
          let discountBadge = '';
          if (order.discount_code && order.discount_code.trim()) {
            const dc = order.discount_code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            discountBadge = '<span style="font-size:11px;color:#4CAF50;margin-top:4px;display:block;">用优惠码 ' + dc + '</span>';
          }
          return '<div class="order-card">' +
            '<div class="order-top">' +
              '<div class="order-date-block">' +
                '<div class="order-date-main">' + dateStr + '</div>' +
                '<div class="order-date-time">' + timeStr + '</div>' +
                '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Order #' + order.order_id + '</div>' +
              '</div>' +
              '<div class="order-amount-block">' +
                '<div class="order-amount">¥' + order.amount.toFixed(2) + '</div>' +
                discountBadge +
                '<div class="order-amount-small">' + statusText + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="order-meta">' +
              '<div class="order-meta-item"><span class="order-meta-label">订阅天数</span><span class="order-meta-value">' + (order.duration_days || '-') + ' 天</span></div>' +
              '<div class="order-meta-item"><span class="order-meta-label">IP 数量</span><span class="order-meta-value">' + (order.max_ips || 3) + '</span></div>' +
              '<div class="order-meta-item"><span class="order-meta-label">激活码</span><span class="order-meta-value code">' + (order.code || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span></div>' +
              '<div class="order-meta-item"><span class="order-meta-label">订阅地址</span><span class="order-meta-value"><a href="' + subUrl + '" target="_blank">' + subUrl + '</a></span></div>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    } else {
      showToast(data.error || t('loadUserInfoFailed'), 'error');
      if (response.status === 401) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
    }
  } catch (error) {
    console.error('加载订单历史失败:', error);
    showToast(t('networkError'), 'error');
  } finally {
    loadingDiv.classList.remove('active');
  }
}

async function loadTickets() {
  const ticketsListDiv = document.getElementById('ticketsList');
  const loadingDiv = document.getElementById('ticketsLoading');
  ticketsListDiv.innerHTML = '';
  loadingDiv.classList.add('active');
  try {
    const response = await fetch('/api/tickets', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();
    if (response.ok && data.success) {
      const tickets = data.tickets || [];
      if (tickets.length === 0) {
        ticketsListDiv.innerHTML = '<div class="empty-tickets"><svg class="empty-tickets-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg><h4>No tickets yet</h4><p>如果您对订单有任何疑问，欢迎随时联系我们</p><button class="btn-accent" onclick="showCreateTicketModal()">+ 创建您的第一张工单</button></div>';
      } else {
        ticketsListDiv.innerHTML = tickets.map(ticket => {
          const createdDate = new Date(ticket.created_at);
          const typeLabels = { payment: 'Payment', order: 'Order', technical: 'Technical', other: 'Other' };
          return '<div class="ticket-card ' + ticket.type + '" onclick="showTicketDetail(' + ticket.id + ')"><div class="ticket-header"><span class="ticket-type ' + ticket.type + '">' + (typeLabels[ticket.type] || ticket.type) + '</span><span class="ticket-status ' + ticket.status + '">' + ticket.status + '</span></div><div class="ticket-subject">' + ticket.subject + '</div><div class="ticket-meta"><span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Order #' + ticket.order_id + '</span><span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>' + createdDate.toLocaleDateString() + '</span></div></div>';
        }).join('');
      }
    } else {
      showToast(data.error || 'Failed to load tickets', 'error');
    }
  } catch (error) {
    console.error('Load tickets error:', error);
    showToast('Network error', 'error');
  } finally {
    loadingDiv.classList.remove('active');
  }
}

async function showCreateTicketModal() {
  document.getElementById('createTicketModal').classList.add('show');
  try {
    const response = await fetch('/api/auth/orders', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();
    if (data.success && data.orders) {
      const select = document.getElementById('ticketOrderId');
      select.innerHTML = '<option value="">-- Select an order --</option>';
      data.orders.filter(o => o.status === 'completed').forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString();
        select.innerHTML += '<option value="' + order.order_id + '">#' + order.order_id + ' - ' + (order.duration_days || '-') + ' days - ' + (order.amount ? '¥' + order.amount.toFixed(2) : '-') + ' (' + date + ')</option>';
      });
    }
  } catch (error) { console.error('Load orders error:', error); }
}

function closeCreateTicketModal() {
  document.getElementById('createTicketModal').classList.remove('show');
  document.getElementById('createTicketForm').reset();
}

document.getElementById('createTicketForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const order_id = document.getElementById('ticketOrderId').value;
  const type = document.getElementById('ticketType').value;
  const subject = document.getElementById('ticketSubject').value;
  const description = document.getElementById('ticketDescription').value;
  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id, type, subject, description })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Ticket created successfully', 'success');
      closeCreateTicketModal();
      loadTickets();
    } else {
      showToast(data.error || 'Failed to create ticket', 'error');
    }
  } catch (error) {
    console.error('Create ticket error:', error);
    showToast('Network error', 'error');
  }
});

let currentTicketId = null;

async function showTicketDetail(ticketId) {
  currentTicketId = ticketId;
  document.getElementById('ticketDetailModal').classList.add('show');
  try {
    const response = await fetch('/api/tickets/' + ticketId, {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();
    if (data.success) {
      const ticket = data.ticket;
      const replies = data.replies || [];
      const typeLabels = { payment: 'Payment', order: 'Order', technical: 'Technical', other: 'Other' };
      const statusLabels = { pending: 'Pending', processing: 'Processing', resolved: 'Resolved', closed: 'Closed' };
      const createdDate = new Date(ticket.created_at).toLocaleString();
      document.getElementById('ticketDetailTitle').textContent = ticket.subject;
      let html = '<div style="margin-bottom:20px;"><div style="display:flex;gap:12px;margin-bottom:12px;"><span class="ticket-type ' + ticket.type + '">' + typeLabels[ticket.type] + '</span><span class="ticket-status ' + ticket.status + '">' + statusLabels[ticket.status] + '</span></div><div style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;"><span>Order: #' + ticket.order_id + '</span> · <span>Created: ' + createdDate + '</span></div><div style="background:var(--bg-card);padding:16px;border-radius:0;margin-bottom:20px;"><p style="color:var(--text-primary);margin:0;line-height:1.6;">' + ticket.description + '</p></div></div><h4 style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;text-transform:uppercase;">Replies</h4><div class="reply-list">';
      if (replies.length === 0) {
        html += '<p style="color:var(--text-muted);text-align:center;padding:20px;">No replies yet</p>';
      } else {
        replies.forEach(reply => {
          const replyDate = new Date(reply.created_at).toLocaleString();
          const author = reply.is_admin ? 'Support' : 'You';
          html += '<div class="ticket-reply ' + (reply.is_admin ? 'admin' : '') + '"><div class="ticket-reply-header"><span class="ticket-reply-author">' + author + '</span><span class="ticket-reply-time">' + replyDate + '</span></div><div class="ticket-reply-content">' + reply.content + '</div></div>';
        });
      }
      html += '</div>';
      document.getElementById('ticketDetailContent').innerHTML = html;
      document.getElementById('ticketReplyForm').style.display = ticket.status === 'closed' ? 'none' : 'block';
    } else {
      showToast(data.error || 'Failed to load ticket', 'error');
      closeTicketDetailModal();
    }
  } catch (error) {
    console.error('Load ticket error:', error);
    showToast('Network error', 'error');
    closeTicketDetailModal();
  }
}

function closeTicketDetailModal() {
  document.getElementById('ticketDetailModal').classList.remove('show');
  currentTicketId = null;
}

async function submitTicketReply() {
  if (!currentTicketId) return;
  const content = document.getElementById('replyContent').value.trim();
  if (!content) { showToast('Please enter reply content', 'warning'); return; }
  try {
    const response = await fetch('/api/tickets/' + currentTicketId + '/reply', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Reply sent successfully', 'success');
      document.getElementById('replyContent').value = '';
      showTicketDetail(currentTicketId);
    } else {
      showToast(data.error || 'Failed to send reply', 'error');
    }
  } catch (error) {
    console.error('Submit reply error:', error);
    showToast('Network error', 'error');
  }
}

async function closeTicketAction() {
  if (!currentTicketId) return;
  if (!confirm('Are you sure you want to close this ticket?')) return;
  try {
    const response = await fetch('/api/tickets/' + currentTicketId + '/close', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();
    if (data.success) {
      showToast('Ticket closed successfully', 'success');
      closeTicketDetailModal();
      loadTickets();
    } else {
      showToast(data.error || 'Failed to close ticket', 'error');
    }
  } catch (error) {
    console.error('Close ticket error:', error);
    showToast('Network error', 'error');
  }
}

async function logout() {
  try {
    await fetch(API_BASE + '/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
  } catch (error) {
    console.error('Logout失败:', error);
  } finally {
    localStorage.removeItem('auth_token');
    showToast(currentLang === 'zh-CN' ? '已安全退出' : 'Logged out successfully', 'success');
    setTimeout(() => { window.location.href = '/'; }, 500);
  }
}

function showToast(message, type, duration) {
  type = type || 'info';
  const ms = (typeof duration === 'number' && duration > 0) ? duration : 3000;
  const container = document.getElementById('toastContainer');
  const toastEl = document.createElement('div');
  toastEl.className = 'toast ' + type;
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  toastEl.innerHTML = '<div class="toast-content"><span class="toast-icon">' + icons[type] + '</span><span class="toast-message">' + message + '</span></div>';
  container.appendChild(toastEl);
  setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateY(-10px)';
    setTimeout(() => toastEl.remove(), 300);
  }, ms);
}

function getModalFormat() {
  const sel = document.querySelector('input[name="modalFormat"]:checked');
  return sel ? sel.value : 'm3u';
}
function updateModalCodeFormat() {
  if (!window._modalCodeBase) return;
  const codeEl = document.getElementById('generatedCode');
  if (codeEl) codeEl.textContent = window._modalCodeBase + '.' + getModalFormat();
}
function showSuccessModal(codeBase) {
  window._modalCodeBase = codeBase;
  document.getElementById('successModal').classList.add('show');
  updateModalCodeFormat();
}

function closeSuccessModal() {
  document.getElementById('successModal').classList.remove('show');
  window.history.replaceState({}, document.title, window.location.pathname);
}

function copyCode() {
  const subUrl = document.getElementById('generatedCode').textContent;
  navigator.clipboard.writeText(subUrl).then(() => {
    showToast(currentLang === 'zh-CN' ? 'Subscription地址已Copy到剪贴板！' : 'Subscription URL copied to clipboard!', 'success');
  }).catch(err => { console.error('Copy failed:', err); });
}

function checkPaymentStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');
  if (paymentStatus === 'success') loadLatestOrder();
  else if (paymentStatus === 'cancelled') {
    showToast(currentLang === 'zh-CN' ? '支付已取消' : 'Payment cancelled', 'warning');
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

async function loadLatestOrder() {
  try {
    const response = await fetch(API_BASE + '/orders', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') }
    });
    const data = await response.json();
    if (response.ok && data.success && data.orders && data.orders.length > 0) {
      const completedOrder = data.orders.find(order => order.status === 'completed');
      if (completedOrder && completedOrder.code) {
        const codeBase = window.location.origin + '/sub/' + completedOrder.code;
        showSuccessModal(codeBase);
      } else {
        showToast(currentLang === 'zh-CN' ? '暂无Subscription信息' : 'No subscription info', 'info');
      }
    } else {
      showToast(data.error || (currentLang === 'zh-CN' ? '获取订单失败' : 'Failed to get orders'), 'error');
    }
  } catch (error) {
    console.error('Load latest order error:', error);
    showToast(currentLang === 'zh-CN' ? '网络错误' : 'Network error', 'error');
  }
  window.history.replaceState({}, document.title, window.location.pathname);
}







document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  loadVipStatus();
  checkPaymentStatus();
});
</script>
`;
