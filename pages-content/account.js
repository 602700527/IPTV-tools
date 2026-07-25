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
    --text-muted: #666666;
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

  [data-theme="light"] {
    --bg-primary: #f5f5f5;
    --bg-secondary: #ffffff;
    --bg-card: #ffffff;
    --bg-hover: #f0f0f0;
    --bg-elevated: #ffffff;
    --glass-bg: rgba(0, 0, 0, 0.02);
    --glass-border: rgba(0, 0, 0, 0.08);
    --glass-hover: rgba(0, 0, 0, 0.04);
    --text-primary: #1a1a1a;
    --text-secondary: #666666;
    --text-muted: #999999;
  }

  .main-content { flex: 1; width: 100%; margin-top: 80px; padding: 32px 24px 60px; }

  .dashboard-layout { max-width: 1200px; margin: 0 auto; display: flex; gap: 32px; }

  .sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: fadeInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: var(--radius);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
  }

  .sidebar-item:hover { color: var(--text-primary); background: var(--bg-hover); }

  .sidebar-item.active { color: var(--text-primary); background: rgba(255, 255, 255, 0.08); }

  .sidebar-item svg { width: 20px; height: 20px; flex-shrink: 0; }

  .sidebar-divider { height: 1px; background: var(--glass-border); margin: 12px 0; }

  .sidebar-item.logout { color: var(--error); margin-top: auto; }

  .sidebar-item.logout:hover { background: rgba(255, 59, 48, 0.15); }

  .content-area {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: fadeInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
  }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .card-title svg { width: 22px; height: 22px; color: var(--accent); }

  .profile-hero {
    background: var(--bg-card);
    border-radius: var(--radius);
    padding: 0;
    border: 1px solid var(--border);
    overflow: hidden;
    position: relative;
  }

  .profile-hero-content { padding: 28px; }

  .profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }

  .avatar-wrapper { position: relative; width: 72px; height: 72px; flex-shrink: 0; }

  .avatar {
    width: 72px;
    height: 72px;
    border-radius: var(--radius);
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    position: relative;
    z-index: 1;
  }

  .avatar-ring {
    position: absolute;
    inset: -4px;
    border-radius: var(--radius);
    background: var(--accent);
    opacity: 0.8;
  }

  .avatar-ring.vip-ring { opacity: 1; }

  @keyframes rotate { to { transform: rotate(360deg); } }

  .profile-info { flex: 1; min-width: 0; }

  .profile-name {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .vip-star {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: var(--tier-gold);
    border-radius: var(--radius);
    font-size: 12px;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
  }

  .vip-star svg { width: 14px; height: 14px; fill: #000; stroke: none; }

  .profile-email { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }

  .profile-badges { display: flex; gap: 8px; flex-wrap: wrap; }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: var(--radius);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge-vip {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 170, 0, 0.1));
    color: var(--tier-gold);
    border: 1px solid rgba(255, 215, 0, 0.3);
  }

  .badge-verified {
    background: rgba(52, 199, 89, 0.15);
    color: var(--success);
    border: 1px solid rgba(52, 199, 89, 0.3);
  }

  .badge-member {
    background: rgba(229, 9, 20, 0.15);
    color: var(--accent);
    border: 1px solid rgba(229, 9, 20, 0.3);
  }

  .subscription-section { background: var(--bg-hover); border-radius: var(--radius); padding: 18px; margin-bottom: 20px; }

  .subscription-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }

  .subscription-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .subscription-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: var(--radius);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .subscription-status.active { background: rgba(34, 197, 94, 0.15); color: var(--success); }

  .subscription-status.expired { background: rgba(239, 68, 68, 0.15); color: var(--error); }

  .subscription-status .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  .subscription-status.active .dot { animation: pulse 2s infinite; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .subscription-details { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .subscription-detail { display: flex; flex-direction: column; gap: 4px; }

  .subscription-detail-label { font-size: 11px; color: var(--text-muted); }

  .subscription-detail-value { font-size: 14px; font-weight: 600; color: var(--text-primary); }

  .subscription-detail-value.code {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .copy-btn {
    padding: 4px 8px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .copy-btn:hover { opacity: 0.9; }

  .perks-section { margin-bottom: 20px; }

  .perks-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  .perks-grid { display: flex; flex-wrap: wrap; gap: 8px; }

  .perk-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--bg-hover);
    border-radius: var(--radius);
    font-size: 12px;
    color: var(--text-secondary);
    border: 1px solid var(--glass-border);
  }

  .perk-item svg { width: 14px; height: 14px; color: var(--success); }

  .profile-actions { display: flex; gap: 10px; }

  .btn-renew {
    flex: 1;
    padding: 12px 20px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-renew:hover { transform: translateY(-2px); opacity: 0.9; }

  .btn-renew svg { width: 16px; height: 16px; }

  .btn-plans {
    flex: 1;
    padding: 12px 20px;
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
  }

  .btn-plans:hover { background: var(--bg-hover); color: var(--text-primary); }

  .info-panel {
    background: var(--bg-card);
    border-radius: var(--radius);
    padding: 20px 24px;
    border: 1px solid var(--glass-border);
  }

  .info-panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }

  .info-panel-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }

  .info-list { display: flex; flex-direction: column; }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--glass-border);
  }

  .info-row:last-child { border-bottom: none; }

  .info-label { color: var(--text-secondary); font-size: 13px; }

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

  .order-list { display: flex; flex-direction: column; gap: 12px; }

  .order-card {
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--radius);
    padding: 18px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.25s;
  }

  .order-card:hover { transform: translateX(4px); border-color: rgba(229, 9, 20, 0.3); }

  .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }

  .order-id {
    font-size: 13px;
    font-weight: 700;
    background: var(--gradient-neon);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .order-date { color: var(--text-muted); font-size: 11px; }

  .order-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }

  .order-detail-item { padding: 10px; background: rgba(0, 0, 0, 0.2); border-radius: var(--radius); }

  .order-detail-label {
    color: var(--text-muted);
    font-size: 10px;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .order-detail-value { color: var(--text-primary); font-size: 13px; font-weight: 600; }

  .order-status {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: var(--radius);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .order-status.completed { background: rgba(52, 199, 89, 0.15); color: var(--success); }

  .order-status.pending { background: rgba(255, 204, 0, 0.15); color: var(--warning); }

  .order-status.cancelled { background: rgba(255, 59, 48, 0.15); color: var(--error); }

  .ticket-list { display: flex; flex-direction: column; gap: 10px; }

  .ticket-card {
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--radius);
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.25s;
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
    border-radius: 0;
  }

  .ticket-card.payment::before { background: var(--warning); }
  .ticket-card.order::before { background: var(--success); }
  .ticket-card.technical::before { background: var(--neon-cyan); }
  .ticket-card.other::before { background: var(--text-muted); }

  .ticket-card:hover { transform: translateX(4px); border-color: rgba(255, 255, 255, 0.1); }

  .ticket-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 12px; }

  .ticket-type {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: var(--radius);
    letter-spacing: 0.5px;
  }

  .ticket-type.payment { background: rgba(255, 204, 0, 0.15); color: var(--warning); }
  .ticket-type.order { background: rgba(52, 199, 89, 0.15); color: var(--success); }
  .ticket-type.technical { background: rgba(0, 212, 255, 0.15); color: var(--neon-cyan); }
  .ticket-type.other { background: rgba(255, 255, 255, 0.1); color: var(--text-secondary); }

  .ticket-status {
    padding: 4px 10px;
    border-radius: var(--radius);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .ticket-status.pending { background: rgba(255, 204, 0, 0.15); color: var(--warning); }
  .ticket-status.processing { background: rgba(0, 122, 255, 0.15); color: #007aff; }
  .ticket-status.resolved { background: rgba(52, 199, 89, 0.15); color: var(--success); }
  .ticket-status.closed { background: rgba(142, 142, 147, 0.15); color: #8e8e93; }

  .ticket-subject { color: var(--text-primary); font-size: 14px; font-weight: 600; margin-bottom: 8px; }

  .ticket-meta { color: var(--text-muted); font-size: 11px; display: flex; gap: 12px; }

  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }

  .section-header h3 { font-size: 16px; font-weight: 700; color: var(--text-primary); }

  .btn-accent {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--accent);
    color: #fff;
    border: none;
    padding: 10px 16px;
    border-radius: var(--radius);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
  }

  .btn-accent:hover { transform: translateY(-2px); opacity: 0.9; }

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
  .empty-tickets { text-align: center; padding: 60px 24px; }

  .empty-state svg,
  .empty-tickets svg { width: 80px; height: 80px; margin-bottom: 20px; opacity: 0.3; }

  .empty-state p,
  .empty-tickets p { font-size: 15px; color: var(--text-muted); }

  .empty-tickets h4 { font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 10px; }

  .empty-tickets p { margin-bottom: 24px; }

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
    .dashboard-layout { flex-direction: column; gap: 24px; }

    .sidebar {
      width: 100%;
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: 8px;
      gap: 6px;
    }

    .sidebar-item { flex-shrink: 0; padding: 12px 16px; }

    .sidebar-item.active { box-shadow: inset 0 -3px 0 var(--accent); }

    .sidebar-divider { display: none; }

    .sidebar-item.logout { margin-top: 0; margin-left: auto; }

    :root { --sidebar-width: 100%; }
  }

  @media (max-width: 600px) {
    .main-content { padding: 20px 16px 40px; }

    .vip-header { gap: 14px; }

    .vip-icon-wrapper { width: 52px; height: 52px; }

    .vip-icon { font-size: 22px; }

    .vip-tier { font-size: 18px; }

    .vip-perks { gap: 6px; }

    .perk-item { font-size: 11px; padding: 4px 8px; }

    .vip-actions { flex-direction: column; }

    .order-details { grid-template-columns: 1fr; }

    .card { padding: 18px; }
  }
`;

export const content = `
<main class="main-content">
  <div class="dashboard-layout">
    <nav class="sidebar">
      <button class="sidebar-item active" onclick="switchTab('account')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path></svg>
账号
      </button>
      <button class="sidebar-item" onclick="switchTab('orders')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
命令
      </button>
      <button class="sidebar-item" onclick="switchTab('tickets')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="1"></rect></svg>
门票
      </button>
      <div class="sidebar-divider"></div>
      <button class="sidebar-item" onclick="window.location.href='/plans'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
计划
      </button>
      <button class="sidebar-item logout" onclick="logout()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
登出
      </button>
    </nav>

    <div class="content-area">
      <div id="accountTab" class="tab-panel active">
        <div class="profile-hero" id="profileHero">
          <div class="profile-hero-content">
            <div class="profile-header">
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
已验证
                  </span>
                  <span class="badge badge-member" id="memberBadge">
成员 <span id="memberSince">-</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="subscription-section" id="subscriptionSection" style="display: block;">
              <div class="subscription-header">
                <span class="subscription-title">订阅</span>
                <span class="subscription-status active" id="subscriptionStatus"><span class="dot"></span> Active</span>
              </div>
              <div class="subscription-details">
                <div class="subscription-detail">
                  <span class="subscription-detail-label">订阅网址</span>
                  <span class="subscription-detail-value code">
                    <span id="vipCode" data-code="PERMA34VIP">https://iptv-search.com/sub/PERMA34VIP.m3u</span>
                    <button class="copy-btn" onclick="copyVipCode()">收到</button>
                  </span>
                </div>
                <div class="subscription-detail">
                  <span class="subscription-detail-label">过期</span>
                  <span class="subscription-detail-value" id="vipExpiry">Permanent</span>
                </div>
                <div class="subscription-detail">
                  <span class="subscription-detail-label">持续时间</span>
                  <span class="subscription-detail-value" id="vipDuration">-1 天</span>
                </div>
                <div class="subscription-detail">
                  <span class="subscription-detail-label">最大IP数</span>
                  <span class="subscription-detail-value" id="vipMaxIps">5</span>
                </div>
              </div>
            </div>

            <div class="perks-section" id="perksSection" style="display: block;">
              <div class="perks-title">您的福利</div>
              <div class="perks-grid">
                <span class="perk-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>没有广告</span>
                <span class="perk-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>无限频道</span>
                <span class="perk-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>优先支持</span>
                <span class="perk-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>云同步</span>
              </div>
            </div>

            <div class="profile-actions">
              <button class="btn-renew" id="btnRenew" onclick="window.location.href='/plans'" style="display: inline-flex;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"></path></svg>
更新VIP
              </button>
              <button class="btn-plans" id="btnViewPlans" onclick="window.location.href='/plans'" style="display: none;">查看平面图</button>
            </div>
          </div>
        </div>
      </div>

      <div id="ordersTab" class="tab-panel" style="display: none;">
        <div class="card">
          <div class="card-header">
            <span class="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
骑士团历史
            </span>
          </div>
          <div id="ordersList" class="order-list"></div>
          <div id="ordersLoading" class="loading"><div class="spinner"></div></div>
        </div>
      </div>

      <div id="ticketsTab" class="tab-panel" style="display: none;">
        <div class="card">
          <div class="section-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;vertical-align:-4px;margin-right:8px;"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="1"></rect></svg>
支持工单
            </h3>
            <button class="btn-accent" onclick="showCreateTicketModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
新票
            </button>
          </div>
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
      <h3 id="ticketDetailTitle">门票详情</h3>
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
  const btnRenew = document.getElementById('btnRenew');
  const btnViewPlans = document.getElementById('btnViewPlans');

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
    if (btnRenew) btnRenew.style.display = 'none';
    if (btnViewPlans) btnViewPlans.style.display = 'inline-flex';
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
      if (btnRenew) btnRenew.style.display = 'inline-flex';
      if (btnViewPlans) btnViewPlans.style.display = 'none';
      if (avatarRing) avatarRing.classList.add('vip-ring');

      const baseUrl = window.location.origin;
      const codeText = baseUrl + '/sub/' + latestOrder.code + '.m3u';
      if (vipCodeEl) { vipCodeEl.textContent = codeText; vipCodeEl.dataset.code = latestOrder.code; }

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

      const dayUnit = currentLang === 'zh-CN' ? ' 天' : ' days';
      if (vipDurationEl) vipDurationEl.textContent = latestOrder.duration_days ? latestOrder.duration_days + dayUnit : '-';
      if (vipMaxIpsEl) vipMaxIpsEl.textContent = latestOrder.max_ips || 3;
    }
  } catch (error) {
    console.error('加载VIP状态失败:', error);
  }
}

function copyVipCode() {
  const vipCodeEl = document.getElementById('vipCode');
  if (!vipCodeEl) { console.error('vipCode element not found'); return; }
  const codeText = vipCodeEl.textContent;
  navigator.clipboard.writeText(codeText).then(() => {
    showToast(currentLang === 'zh-CN' ? '订阅地址已复制！' : 'Subscription URL copied!', 'success');
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
          const statusClass = order.status.toLowerCase();
          const statusText = { completed: t('statusCompleted'), pending: t('statusPending'), cancelled: t('statusCancelled') }[order.status] || order.status;
          const dayUnit = currentLang === 'zh-CN' ? ' 天' : ' days';
          const baseUrl = window.location.origin;
          const subUrl = order.code ? (baseUrl + '/sub/' + order.code + '.m3u') : '-';
          return '<div class="order-card"><div class="order-header"><span class="order-id">' + t('orderId') + '：' + order.order_id + '</span><span class="order-status ' + statusClass + '">' + statusText + '</span></div><div class="order-details"><div class="order-detail-item"><div class="order-detail-label">Code</div><div class="order-detail-value">' + (order.code || '-') + '</div></div><div class="order-detail-item"><div class="order-detail-label">' + t('subUrl') + '</div><div class="order-detail-value" style="font-size: 12px; word-break: break-all;">' + subUrl + '</div></div><div class="order-detail-item"><div class="order-detail-label">Validity</div><div class="order-detail-value">' + (order.duration_days ? order.duration_days + dayUnit : '-') + '</div></div><div class="order-detail-item"><div class="order-detail-label">' + t('ipCount') + '</div><div class="order-detail-value">' + (order.max_ips || 3) + '</div></div><div class="order-detail-item"><div class="order-detail-label">' + t('amount') + '</div><div class="order-detail-value">' + (order.amount ? '¥' + order.amount.toFixed(2) : '-') + '</div></div><div class="order-detail-item"><div class="order-detail-label">' + t('orderDate') + '</div><div class="order-detail-value">' + createdDate.toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US') + '</div></div></div></div>';
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
        ticketsListDiv.innerHTML = '<div class="empty-tickets"><svg class="empty-tickets-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg><h4>No tickets yet</h4><p>If you have any questions about your orders, feel free to contact us</p><button class="btn-accent" onclick="showCreateTicketModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Create Your First Ticket</button></div>';
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
    console.error('登出失败:', error);
  } finally {
    localStorage.removeItem('auth_token');
    showToast(t('logoutSuccess'), 'success');
    setTimeout(() => { window.location.href = '/'; }, 500);
  }
}

function showToast(message, type) {
  type = type || 'info';
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
  }, 3000);
}

function showSuccessModal(subUrl) {
  document.getElementById('generatedCode').textContent = subUrl;
  document.getElementById('successModal').classList.add('show');
}

function closeSuccessModal() {
  document.getElementById('successModal').classList.remove('show');
  window.history.replaceState({}, document.title, window.location.pathname);
}

function copyCode() {
  const subUrl = document.getElementById('generatedCode').textContent;
  navigator.clipboard.writeText(subUrl).then(() => {
    showToast(currentLang === 'zh-CN' ? '订阅地址已复制到剪贴板！' : 'Subscription URL copied to clipboard!', 'success');
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
        const subUrl = window.location.origin + '/sub/' + completedOrder.code + '.m3u';
        showSuccessModal(subUrl);
      } else {
        showToast(currentLang === 'zh-CN' ? '暂无订阅信息' : 'No subscription info', 'info');
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

(function() {
  document.documentElement.setAttribute('data-theme', 'dark');
})();

function updateThemeIcons(isDark) {
  const sun = document.querySelector('.sun-icon');
  const moon = document.querySelector('.moon-icon');
  if (sun && moon) {
    sun.style.display = isDark ? 'none' : 'block';
    moon.style.display = isDark ? 'block' : 'none';
  }
}

document.getElementById('themeToggle')?.addEventListener('click', function() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const sun = document.querySelector('.sun-icon');
  const moon = document.querySelector('.moon-icon');
  if (sun && moon) {
    sun.style.display = next === 'dark' ? 'none' : 'block';
    moon.style.display = next === 'dark' ? 'block' : 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  loadVipStatus();
  checkPaymentStatus();
});
</script>
`;
