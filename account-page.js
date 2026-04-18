// 用户账户页面内容
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';
import { HEAD_SCRIPTS } from './components/head-scripts.js';

export const ACCOUNT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">用户中心 - TV Live Service</title>
  <meta name="description" content="管理您的TV Live Service账户，查看订阅状态、订单历史和账户设置。">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://iptv-search.com/account">
  <link rel="alternate" hreflang="zh-CN" href="https://iptv-search.com/account">
  <link rel="alternate" hreflang="en" href="https://iptv-search.com/account?lang=en">
  <link rel="alternate" hreflang="x-default" href="https://iptv-search.com/account?lang=en">
  <meta property="og:title" content="用户中心 - TV Live Service">
  <meta property="og:description" content="管理您的TV Live Service账户，查看订阅状态、订单历史和账户设置。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com/account">
  <meta property="og:image" content="https://iptv-search.com/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="TV Live Service">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="用户中心 - TV Live Service">
  <meta name="twitter:description" content="管理您的TV Live Service账户，查看订阅状态、订单历史和账户设置。">
  <meta name="twitter:image" content="https://iptv-search.com/og-homepage.png">
  <style>
    /* ========================================
       CINEMA DARK - 深邃影院风格
       灵感来源：Netflix/Disney+ 流媒体质感
       ======================================== */
    
    :root {
      /* 深色沉浸式背景 */
      --bg-primary: #0a0a0f;
      --bg-secondary: #12121a;
      --bg-tertiary: #1a1a2e;
      
      /* 玻璃拟态 */
      --glass-bg: rgba(255, 255, 255, 0.03);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-hover: rgba(255, 255, 255, 0.06);
      
      /* 文本 */
      --text-primary: #ffffff;
      --text-secondary: rgba(255, 255, 255, 0.6);
      --text-muted: rgba(255, 255, 255, 0.4);
      
      /* 霓虹强调色渐变 */
      --accent: #e50914;
      --accent-glow: rgba(229, 9, 20, 0.4);
      --neon-cyan: #00d4ff;
      --neon-magenta: #e50914;
      --gradient-neon: linear-gradient(135deg, #e50914 0%, #00d4ff 100%);
      --gradient-glow: linear-gradient(135deg, rgba(229,9,20,0.3) 0%, rgba(0,212,255,0.3) 100%);
      
      /* 状态色 */
      --success: #34c759;
      --warning: #ffcc00;
      --error: #ff3b30;
      
      /* VIP段位色 */
      --tier-bronze: #cd7f32;
      --tier-silver: #c0c0c0;
      --tier-gold: #ffd700;
      --tier-emerald: #50c878;
      --tier-crown: linear-gradient(135deg, #ffd700, #ff69b4, #8a2be2);
    }

    [data-theme="light"] {
      --bg-primary: #f0f2f5;
      --bg-secondary: #ffffff;
      --bg-tertiary: #e8eaed;
      --glass-bg: rgba(0, 0, 0, 0.02);
      --glass-border: rgba(0, 0, 0, 0.08);
      --glass-hover: rgba(0, 0, 0, 0.04);
      --text-primary: #1a1a1f;
      --text-secondary: #666666;
      --text-muted: #999999;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html { scroll-padding-top: 80px; }

    body {
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      color: var(--text-primary);
      transition: background 0.3s, color 0.3s;
      overflow-x: hidden;
    }

    /* 深邃背景纹理 */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(ellipse at 20% 0%, rgba(229, 9, 20, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(0, 212, 255, 0.06) 0%, transparent 50%),
        linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%);
      pointer-events: none;
      z-index: -1;
    }

    /* 网格纹理叠加 */
    body::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: -1;
      opacity: 0.5;
    }

    /* 主内容区 */
    .main-content {
      flex: 1;
      width: 100%;
      margin-top: 80px;
      padding: 24px 16px 60px;
    }

    /* 玻璃拟态容器 */
    .container {
      max-width: 720px;
      width: 100%;
      margin: 0 auto;
      position: relative;
    }

    /* 页面头部 */
    .account-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      gap: 16px;
      animation: fadeInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .account-header h1 {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--text-primary) 0%, rgba(255,255,255,0.8) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logout-btn {
      position: relative;
      background: rgba(229, 9, 20, 0.15);
      color: var(--accent);
      border: 1px solid rgba(229, 9, 20, 0.3);
      padding: 10px 20px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    .logout-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.3), transparent);
      transition: left 0.5s;
    }

    .logout-btn:hover {
      background: var(--accent);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 20px var(--accent-glow);
    }

    .logout-btn:hover::before {
      left: 100%;
    }

    /* ========================================
       VIP 会员状态卡片 - 电影海报风格
       ======================================== */
    
    .vip-status-card {
      position: relative;
      background: linear-gradient(145deg, rgba(20, 20, 30, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: 24px;
      padding: 0;
      margin-bottom: 28px;
      border: 1px solid var(--glass-border);
      overflow: hidden;
      animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .vip-status-card:hover {
      transform: translateY(-4px);
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.4),
        0 0 40px rgba(229, 9, 20, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    /* VIP卡片顶部装饰条 */
    .vip-card-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--gradient-neon);
      opacity: 0.8;
    }

    .vip-card-content {
      padding: 28px 28px 24px;
    }

    .vip-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
    }

    .vip-icon-wrapper {
      position: relative;
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s;
    }

    .vip-icon-wrapper::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, var(--accent), var(--neon-cyan), var(--accent));
      animation: rotate 4s linear infinite;
      opacity: 0.6;
    }

    .vip-icon-wrapper::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: linear-gradient(145deg, #1a1a2e, #0a0a0f);
    }

    .vip-icon {
      position: relative;
      z-index: 1;
      font-size: 32px;
      filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
    }

    /* 段位颜色 */
    .vip-icon-wrapper.tier-bronze::before { background: conic-gradient(from 0deg, #cd7f32, #8b4513, #cd7f32); }
    .vip-icon-wrapper.tier-silver::before { background: conic-gradient(from 0deg, #c0c0c0, #808080, #c0c0c0); }
    .vip-icon-wrapper.tier-gold::before { background: conic-gradient(from 0deg, #ffd700, #ffaa00, #ffd700); }
    .vip-icon-wrapper.tier-emerald::before { background: conic-gradient(from 0deg, #50c878, #228b22, #50c878); }
    .vip-icon-wrapper.tier-crown::before { background: conic-gradient(from 0deg, #ffd700, #ff69b4, #8a2be2, #ffd700); animation: rotate 3s linear infinite; }

    @keyframes rotate {
      to { transform: rotate(360deg); }
    }

    .vip-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .vip-tier {
      font-size: 26px;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.5px;
    }

    .vip-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .vip-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      background: linear-gradient(135deg, rgba(52, 199, 89, 0.2), rgba(52, 199, 89, 0.1));
      color: var(--success);
      border: 1px solid rgba(52, 199, 89, 0.3);
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .vip-badge.expired {
      background: linear-gradient(135deg, rgba(255, 59, 48, 0.2), rgba(255, 59, 48, 0.1));
      color: var(--error);
      border-color: rgba(255, 59, 48, 0.3);
    }

    /* 订阅信息区 */
    .vip-subscription {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .sub-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .sub-item:last-child { border-bottom: none; }

    .sub-label {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .sub-value {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .code-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .code-text {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.05);
      padding: 8px 14px;
      border-radius: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .copy-btn {
      padding: 8px 14px;
      background: var(--gradient-neon);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .copy-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.4s, height 0.4s;
    }

    .copy-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px var(--accent-glow);
    }

    .copy-btn:active::before {
      width: 200px;
      height: 200px;
    }

    /* 特权列表 */
    .vip-perks {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
      padding: 16px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .perk-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-secondary);
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all 0.2s;
    }

    .perk-item:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-1px);
    }

    .perk-icon {
      color: var(--neon-cyan);
      font-weight: 700;
      font-size: 14px;
    }

    /* 操作按钮 */
    .vip-actions {
      display: flex;
      gap: 12px;
    }

    .btn-renew {
      flex: 1;
      padding: 14px 24px;
      background: var(--gradient-neon);
      color: #fff;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .btn-renew::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .btn-renew:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px var(--accent-glow);
    }

    .btn-renew:hover::before {
      left: 100%;
    }

    .btn-plans {
      flex: 1;
      padding: 14px 24px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-primary);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-plans:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    /* ========================================
       导航标签页 - 霓虹胶囊风格
       ======================================== */

    .nav-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      padding: 6px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      border: 1px solid var(--glass-border);
      animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
    }

    .nav-tab {
      flex: 1;
      background: transparent;
      color: var(--text-secondary);
      border: none;
      padding: 14px 20px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .nav-tab::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 3px;
      background: var(--gradient-neon);
      border-radius: 3px 3px 0 0;
      transform: translateX(-50%);
      transition: width 0.3s;
    }

    .nav-tab:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-tab.active {
      color: #fff;
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.3), rgba(0, 212, 255, 0.2));
      box-shadow: 0 0 20px rgba(229, 9, 20, 0.2);
    }

    .nav-tab.active::before {
      width: 40px;
    }

    .tab-content {
      display: none;
      animation: fadeIn 0.4s ease;
    }

    .tab-content.active {
      display: block;
    }

    /* ========================================
       玻璃拟态信息卡片
       ======================================== */

    .info-card {
      background: linear-gradient(145deg, var(--glass-bg), rgba(0, 0, 0, 0.2));
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 16px;
      border: 1px solid var(--glass-border);
      animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      transition: background 0.2s;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item:hover {
      background: rgba(255, 255, 255, 0.02);
      margin: 0 -12px;
      padding: 16px 12px;
      border-radius: 8px;
    }

    .info-label {
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 500;
    }

    .info-value {
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 600;
    }

    /* ========================================
       订单卡片
       ======================================== */

    .order-card {
      background: linear-gradient(145deg, var(--glass-bg), rgba(0, 0, 0, 0.2));
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 16px;
      border: 1px solid var(--glass-border);
      animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .order-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--gradient-neon);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .order-card:hover {
      transform: translateY(-4px) translateX(4px);
      box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(229, 9, 20, 0.1);
    }

    .order-card:hover::before {
      opacity: 1;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .order-id {
      font-size: 14px;
      font-weight: 700;
      background: var(--gradient-neon);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .order-date {
      color: var(--text-muted);
      font-size: 12px;
    }

    .order-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .order-detail-item {
      padding: 12px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    .order-detail-label {
      color: var(--text-muted);
      font-size: 11px;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .order-detail-value {
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 600;
    }

    .order-status {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .order-status.completed {
      background: linear-gradient(135deg, rgba(52, 199, 89, 0.2), rgba(52, 199, 89, 0.1));
      color: var(--success);
      border: 1px solid rgba(52, 199, 89, 0.3);
    }

    .order-status.pending {
      background: linear-gradient(135deg, rgba(255, 204, 0, 0.2), rgba(255, 204, 0, 0.1));
      color: var(--warning);
      border: 1px solid rgba(255, 204, 0, 0.3);
    }

    .order-status.cancelled {
      background: linear-gradient(135deg, rgba(255, 59, 48, 0.2), rgba(255, 59, 48, 0.1));
      color: var(--error);
      border: 1px solid rgba(255, 59, 48, 0.3);
    }

    /* ========================================
       工单卡片
       ======================================== */

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.35s both;
    }

    .section-header h3 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .btn-accent {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--gradient-neon);
      color: #fff;
      border: none;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-accent:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px var(--accent-glow);
    }

    .ticket-card {
      background: linear-gradient(145deg, var(--glass-bg), rgba(0, 0, 0, 0.2));
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 12px;
      border: 1px solid var(--glass-border);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
    }

    .ticket-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      transition: opacity 0.3s;
    }

    .ticket-card.payment::before { background: var(--warning); }
    .ticket-card.order::before { background: var(--success); }
    .ticket-card.technical::before { background: var(--neon-cyan); }
    .ticket-card.other::before { background: var(--text-muted); }

    .ticket-card:hover {
      transform: translateY(-3px) translateX(4px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      background: var(--glass-hover);
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 12px;
    }

    .ticket-type {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 6px 12px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }

    .ticket-type.payment {
      background: linear-gradient(135deg, rgba(255, 204, 0, 0.2), rgba(255, 204, 0, 0.1));
      color: var(--warning);
    }

    .ticket-type.order {
      background: linear-gradient(135deg, rgba(52, 199, 89, 0.2), rgba(52, 199, 89, 0.1));
      color: var(--success);
    }

    .ticket-type.technical {
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.1));
      color: var(--neon-cyan);
    }

    .ticket-type.other {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-secondary);
    }

    .ticket-status {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .ticket-status.pending {
      background: rgba(255, 204, 0, 0.2);
      color: var(--warning);
    }

    .ticket-status.processing {
      background: rgba(0, 122, 255, 0.2);
      color: #007aff;
    }

    .ticket-status.resolved {
      background: rgba(52, 199, 89, 0.2);
      color: var(--success);
    }

    .ticket-status.closed {
      background: rgba(142, 142, 147, 0.2);
      color: #8e8e93;
    }

    .ticket-subject {
      color: var(--text-primary);
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 10px;
      line-height: 1.4;
    }

    .ticket-meta {
      color: var(--text-muted);
      font-size: 12px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .ticket-meta svg {
      width: 12px;
      height: 12px;
      vertical-align: -2px;
      margin-right: 4px;
    }

    /* ========================================
       模态框
       ======================================== */

    .success-modal,
    .ticket-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 3000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .success-modal.show,
    .ticket-modal.show {
      display: flex;
    }

    .success-content,
    .ticket-modal-content {
      background: linear-gradient(145deg, #1a1a2e, #0a0a0f);
      border-radius: 28px;
      padding: 40px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      border: 1px solid var(--glass-border);
      box-shadow: 
        0 30px 100px rgba(0, 0, 0, 0.5),
        0 0 60px rgba(229, 9, 20, 0.15);
      animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
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

    .success-title {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 12px 0;
    }

    .success-message {
      color: var(--text-secondary);
      font-size: 15px;
      margin-bottom: 28px;
    }

    .code-display {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
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
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      width: 100%;
      margin-bottom: 16px;
    }

    .copy-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px var(--accent-glow);
    }

    .modal-tips {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--glass-border);
    }

    .modal-tip {
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.6;
      margin-bottom: 8px;
    }

    .modal-tip-highlight {
      color: var(--text-muted);
      font-size: 12px;
      margin-top: 16px;
    }

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

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
      transform: rotate(90deg);
    }

    /* ========================================
       表单样式
       ======================================== */

    .ticket-modal-content {
      max-width: 560px;
      text-align: left;
      padding: 32px;
    }

    .ticket-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--glass-border);
    }

    .ticket-modal-header h3 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
    }

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

    .ticket-modal-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
    }

    .form-group {
      margin-bottom: 22px;
    }

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
      border-radius: 12px;
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

    .form-group textarea {
      min-height: 120px;
      resize: vertical;
    }

    .btn {
      padding: 14px 28px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary {
      background: var(--gradient-neon);
      color: #fff;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px var(--accent-glow);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-primary);
      border: 1px solid var(--glass-border);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-danger {
      background: rgba(255, 59, 48, 0.15);
      color: var(--error);
      border: 1px solid rgba(255, 59, 48, 0.3);
    }

    .btn-danger:hover {
      background: var(--error);
      color: #fff;
    }

    .ticket-reply {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 12px;
      border-left: 4px solid var(--accent);
    }

    .ticket-reply.admin {
      border-left-color: var(--neon-cyan);
    }

    .ticket-reply-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .ticket-reply-author {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .ticket-reply.admin .ticket-reply-author {
      color: var(--neon-cyan);
    }

    .ticket-reply-time {
      font-size: 12px;
      color: var(--text-muted);
    }

    .ticket-reply-content {
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.6;
    }

    .ticket-reply-form {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--glass-border);
    }

    .ticket-reply-form textarea {
      margin-bottom: 14px;
    }

    .reply-list {
      max-height: 350px;
      overflow-y: auto;
      margin-bottom: 20px;
      padding-right: 8px;
    }

    .reply-list::-webkit-scrollbar {
      width: 6px;
    }

    .reply-list::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }

    .reply-list::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 3px;
    }

    /* ========================================
       空状态 & 加载状态
       ======================================== */

    .empty-state,
    .empty-tickets {
      text-align: center;
      padding: 60px 24px;
    }

    .empty-state svg,
    .empty-tickets svg {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
      opacity: 0.3;
    }

    .empty-state p,
    .empty-tickets p {
      font-size: 15px;
      color: var(--text-muted);
    }

    .empty-tickets h4 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 10px;
    }

    .empty-tickets p {
      margin-bottom: 24px;
    }

    .loading {
      display: none;
      text-align: center;
      padding: 60px;
    }

    .loading.active {
      display: block;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid var(--glass-border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ========================================
       Toast 通知
       ======================================== */

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
      border-radius: 14px;
      padding: 16px 20px;
      border: 1px solid var(--glass-border);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      pointer-events: auto;
      animation: toastSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .toast.success {
      border-color: rgba(52, 199, 89, 0.4);
    }

    .toast.success .toast-icon {
      color: var(--success);
    }

    .toast.error {
      border-color: rgba(255, 59, 48, 0.4);
    }

    .toast.error .toast-icon {
      color: var(--error);
    }

    .toast.warning {
      border-color: rgba(255, 204, 0, 0.4);
    }

    .toast.warning .toast-icon {
      color: var(--warning);
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toast-icon {
      font-size: 20px;
    }

    .toast-message {
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 500;
    }

    /* ========================================
       动画关键帧
       ======================================== */

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ========================================
       响应式设计
       ======================================== */

    @media (max-width: 768px) {
      html { scroll-padding-top: 70px; }
      
      .main-content {
        margin-top: 70px;
        padding: 16px 12px 40px;
      }

      .account-header h1 {
        font-size: 22px;
      }

      .logout-btn {
        padding: 8px 14px;
        font-size: 12px;
      }

      .vip-card-content {
        padding: 20px;
      }

      .vip-header {
        gap: 14px;
        margin-bottom: 18px;
      }

      .vip-icon-wrapper {
        width: 60px;
        height: 60px;
      }

      .vip-icon {
        font-size: 26px;
      }

      .vip-tier {
        font-size: 22px;
      }

      .nav-tabs {
        gap: 4px;
        padding: 4px;
      }

      .nav-tab {
        padding: 12px 10px;
        font-size: 12px;
      }

      .info-card,
      .order-card {
        padding: 18px;
        border-radius: 16px;
      }

      .order-details {
        grid-template-columns: 1fr;
      }

      .vip-actions {
        flex-direction: column;
      }

      .success-content {
        padding: 28px;
      }

      .ticket-modal-content {
        padding: 24px;
      }
    }

    @media (max-width: 480px) {
      .account-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-end;
      }

      .vip-header {
        flex-wrap: wrap;
      }

      .vip-info {
        flex: 1 1 calc(100% - 80px);
      }

      .vip-badge {
        order: -1;
        margin-bottom: 8px;
      }

      .code-row {
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
      }

      .code-text {
        max-width: 160px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .btn-accent {
        width: 100%;
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  <div class="main-content">
    <div class="container">
      <!-- 页面头部 -->
      <div class="account-header">
        <h1 data-i18n="userCenter">👤 Account Center</h1>
        <div class="header-actions">
          <button class="logout-btn" onclick="logout()" data-i18n="logout">Logout</button>
        </div>
      </div>
      
      <!-- VIP会员状态卡片 - 电影海报风格 -->
      <div id="vipStatusCard" class="vip-status-card" style="display: none;">
        <div class="vip-card-glow"></div>
        <div class="vip-card-content">
          <div class="vip-header">
            <div class="vip-icon-wrapper">
              <span class="vip-icon">👑</span>
            </div>
            <div class="vip-info">
              <span class="vip-tier" id="vipTierName">至尊会员</span>
              <span class="vip-subtitle" id="vipSubType">年度订阅</span>
            </div>
            <div class="vip-badge" id="vipBadge">ACTIVE</div>
          </div>
          <div class="vip-subscription">
            <div class="sub-item">
              <span class="sub-label">订阅地址</span>
              <div class="sub-value code-row">
                <span class="code-text" id="vipCode">-</span>
                <button class="copy-btn" onclick="copyVipCode()">复制</button>
              </div>
            </div>
            <div class="sub-item">
              <span class="sub-label">到期时间</span>
              <span class="sub-value" id="vipExpiry">-</span>
            </div>
          </div>
          <div class="vip-perks">
            <div class="perk-item"><span class="perk-icon">✓</span> 无广告打扰</div>
            <div class="perk-item"><span class="perk-icon">✓</span> 无限畅享全部频道</div>
            <div class="perk-item"><span class="perk-icon">✓</span> 优先客服响应</div>
          </div>
          <div class="vip-actions">
            <button class="btn-renew" onclick="window.location.href='/plans'">续费会员</button>
            <button class="btn-plans" onclick="window.location.href='/plans'">查看套餐</button>
          </div>
        </div>
      </div>
      
      <!-- 导航标签页 -->
      <div class="nav-tabs">
        <button class="nav-tab active" onclick="switchTab('info')" data-i18n="accountInfo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; vertical-align: -2px;"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
          Account Info
        </button>
        <button class="nav-tab" onclick="switchTab('orders')" data-i18n="orderHistory">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; vertical-align: -2px;"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          Order History
        </button>
        <button class="nav-tab" onclick="switchTab('tickets')" data-i18n="myTickets">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; vertical-align: -2px;"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          My Tickets
        </button>
      </div>
      
      <!-- 账户信息标签页 -->
      <div id="infoTab" class="tab-content active">
        <div id="userInfo" class="info-card"></div>
        <div id="infoLoading" class="loading">
          <div class="spinner"></div>
        </div>
      </div>
      
      <!-- 订单历史标签页 -->
      <div id="ordersTab" class="tab-content">
        <div id="ordersList"></div>
        <div id="ordersLoading" class="loading">
          <div class="spinner"></div>
        </div>
      </div>
      
      <!-- 工单标签页 -->
      <div id="ticketsTab" class="tab-content">
        <div class="section-header">
          <h3 data-i18n="ticketList">Support Tickets</h3>
          <button class="btn-accent" onclick="showCreateTicketModal()" data-i18n="createTicket">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Ticket
          </button>
        </div>
        <div id="ticketsList"></div>
        <div id="ticketsLoading" class="loading">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  </div>

   <div class="toast-container" id="toastContainer"></div>

  ${PAGE_FOOTER}

   <!-- 支付成功模态框 -->
   <div id="successModal" class="success-modal">
     <div class="success-content">
       <button class="modal-close" onclick="closeSuccessModal()">×</button>
       <div class="success-icon">🎉</div>
       <h2 class="success-title" data-i18n="paymentSuccess">Payment Successful!</h2>
       <p class="success-message" data-i18n="subUrlGenerated">Your subscription URL is ready</p>
       <div class="code-display" id="generatedCode">-</div>
       <button class="copy-button" onclick="copyCode()" data-i18n="copyUrl">Copy Subscription URL</button>
       <div class="modal-tips">
         <p class="modal-tip">Add this URL directly to your IPTV player</p>
         <p class="modal-tip-highlight">View order details in your account after closing</p>
       </div>
     </div>
   </div>
   
   <!-- Create Ticket Modal -->
   <div id="createTicketModal" class="ticket-modal">
     <div class="ticket-modal-content">
       <div class="ticket-modal-header">
         <h3 data-i18n="createNewTicket">Create New Ticket</h3>
         <button class="ticket-modal-close" onclick="closeCreateTicketModal()">×</button>
       </div>
       <form id="createTicketForm">
         <div class="form-group">
           <label data-i18n="selectOrder">Select Order</label>
           <select id="ticketOrderId" required>
             <option value="" data-i18n="selectOrderPlaceholder">-- Select an order --</option>
           </select>
         </div>
         <div class="form-group">
           <label data-i18n="ticketType">Ticket Type</label>
           <select id="ticketType" required>
             <option value="payment" data-i18n="typePayment">Payment Issue</option>
             <option value="order" data-i18n="typeOrder">Order Inquiry</option>
             <option value="technical" data-i18n="typeTechnical">Technical Support</option>
             <option value="other" data-i18n="typeOther">Other</option>
           </select>
         </div>
         <div class="form-group">
           <label data-i18n="ticketSubject">Subject</label>
           <input type="text" id="ticketSubject" required maxlength="200" placeholder="Brief description of your issue">
         </div>
         <div class="form-group">
           <label data-i18n="ticketDescription">Description</label>
           <textarea id="ticketDescription" required placeholder="Please describe your issue in detail..."></textarea>
         </div>
         <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
           <button type="button" class="btn btn-secondary" onclick="closeCreateTicketModal()" data-i18n="cancel">Cancel</button>
           <button type="submit" class="btn btn-primary" data-i18n="submitTicket">Submit Ticket</button>
         </div>
       </form>
     </div>
   </div>
   
   <!-- Ticket Detail Modal -->
   <div id="ticketDetailModal" class="ticket-modal">
     <div class="ticket-modal-content">
       <div class="ticket-modal-header">
         <h3 id="ticketDetailTitle">Ticket Details</h3>
         <button class="ticket-modal-close" onclick="closeTicketDetailModal()">×</button>
       </div>
       <div id="ticketDetailContent"></div>
       <div class="ticket-reply-form" id="ticketReplyForm">
         <textarea id="replyContent" placeholder="Type your reply here..."></textarea>
         <div style="display: flex; gap: 12px; justify-content: flex-end;">
           <button type="button" class="btn btn-danger" onclick="closeTicketAction()" data-i18n="closeTicket">Close Ticket</button>
           <button type="button" class="btn btn-primary" onclick="submitTicketReply()" data-i18n="sendReply">Send Reply</button>
         </div>
       </div>
     </div>
   </div>
    
    <script>
    const API_BASE = '/api/auth';

    // 智能判断浏览器语言
    function detectBrowserLanguage() {
      const savedLang = localStorage.getItem('account_lang');
      if (savedLang) return savedLang;

      const browserLang = navigator.language || navigator.userLanguage || 'zh-CN';
      return browserLang.startsWith('zh') && (browserLang.includes('CN') || browserLang === 'zh') ? 'zh-CN' : 'en';
    }

    let currentLang = detectBrowserLanguage();

    // 翻译函数 - 使用 translate.js 处理页面翻译
    function t(key) {
      return key;
    }

    // 设置语言
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

    // 页面加载时立即执行语言设置
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setLanguage(currentLang));
    } else {
      setLanguage(currentLang);
    }

    // 获取当前有效的token
    function getToken() {
      return localStorage.getItem('auth_token');
    }

    // 检查URL参数中的OAuth token（来自Google登录回调）
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('auth_token', urlToken);
      // 清除URL参数
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    
    // 检查登录状态
    if (!getToken()) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
    
    // 验证token是否有效
    async function validateToken() {
      try {
        const response = await fetch(API_BASE + '/user', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        if (response.status === 401) {
          // token无效，清除登录态并重定向到登录页
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
    
    // 页面加载时验证token
    (async () => {
      const isValid = await validateToken();
      if (!isValid) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
    })();
    
    function switchTab(tab) {
      document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      event.target.classList.add('active');
      document.getElementById(tab + 'Tab').classList.add('active');
      
      if (tab === 'info') {
        loadUserInfo();
      } else if (tab === 'orders') {
        loadOrderHistory();
      } else if (tab === 'tickets') {
        loadTickets();
      }
    }
    
    async function loadUserInfo() {
      const userInfoDiv = document.getElementById('userInfo');
      const loadingDiv = document.getElementById('infoLoading');
      
      userInfoDiv.innerHTML = '';
      loadingDiv.classList.add('active');
      
      try {
        const response = await fetch(API_BASE + '/user', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          const user = data.user;
          const createdDate = new Date(user.created_at);
          const updatedDate = new Date(user.updated_at);
          
          userInfoDiv.innerHTML = \`
            <div class="info-item">
              <span class="info-label">\${t('email')}</span>
              <span class="info-value">\${user.email}</span>
            </div>
            <div class="info-item">
              <span class="info-label">\${t('emailStatus')}</span>
              <span class="info-value">\${user.is_verified ? t('verified') : t('unverified')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">\${t('registeredAt')}</span>
              <span class="info-value">\${createdDate.toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">\${t('updatedAt')}</span>
              <span class="info-value">\${updatedDate.toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US')}</span>
            </div>
          \`;
        } else {
          showToast(data.error || t('loadUserInfoFailed'), 'error');
          if (response.status === 401) {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
        showToast(t('networkError'), 'error');
      } finally {
        loadingDiv.classList.remove('active');
      }
    }
    
    // VIP会员状态加载
    async function loadVipStatus() {
      const vipCard = document.getElementById('vipStatusCard');
      
      try {
        const response = await fetch(API_BASE + '/orders', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success && data.orders && data.orders.length > 0) {
          // 找到最新的已完成的订单
          const completedOrders = data.orders.filter(order => order.status === 'completed');
          if (completedOrders.length === 0) {
            vipCard.style.display = 'none';
            return;
          }
          
          // 按创建时间倒序，找到最新的订阅
          const latestOrder = completedOrders.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          )[0];
          
          // 检查是否过期 - 使用 codes 表的 expired_at
          const now = new Date();
          const codeExpiredAt = latestOrder.expired_at;
          const isExpired = codeExpiredAt && new Date(codeExpiredAt) < now;
          const isPermanent = latestOrder.code_duration_days === -1 || latestOrder.code_duration_days === null;
          
          // 计算剩余天数来判断会员等级（基于实际的过期时间，而非单次购买时长）
          let remainingDays = -1; // 默认永久
          if (!isPermanent && codeExpiredAt) {
            const expiryDate = new Date(codeExpiredAt);
            if (expiryDate > now) {
              remainingDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
            }
          }
          
          // 根据剩余天数判断会员等级（段位制）
          // 青铜 ≤ 30天，白银 31-90天，黄金 91-180天，翡翠 181-365天，皇冠 > 365天或永久
          let tierClass = 'tier-gold';
          let tierName = '黄金会员';
          let subTypeName = '剩余约' + remainingDays + '天';
          
          if (isPermanent || remainingDays === -1) {
            tierClass = 'tier-crown';
            tierName = '皇冠会员';
            subTypeName = '永久有效';
          } else if (remainingDays > 365) {
            tierClass = 'tier-crown';
            tierName = '皇冠会员';
            subTypeName = '剩余约' + remainingDays + '天';
          } else if (remainingDays > 180) {
            tierClass = 'tier-emerald';
            tierName = '翡翠会员';
            subTypeName = '剩余约' + remainingDays + '天';
          } else if (remainingDays > 90) {
            tierClass = 'tier-gold';
            tierName = '黄金会员';
            subTypeName = '剩余约' + remainingDays + '天';
          } else if (remainingDays > 30) {
            tierClass = 'tier-silver';
            tierName = '白银会员';
            subTypeName = '剩余约' + remainingDays + '天';
          } else if (remainingDays > 0) {
            tierClass = 'tier-bronze';
            tierName = '青铜会员';
            subTypeName = '剩余约' + remainingDays + '天';
          } else {
            tierClass = 'tier-bronze';
            tierName = '青铜会员';
            subTypeName = '已过期';
          }
          
          // 设置皇冠颜色
          const iconWrapper = vipCard.querySelector('.vip-icon-wrapper');
          iconWrapper.className = 'vip-icon-wrapper ' + tierClass;
          
          // 设置文本
          document.getElementById('vipTierName').textContent = tierName;
          document.getElementById('vipSubType').textContent = subTypeName;
          
          // 设置订阅代码
          const baseUrl = window.location.origin;
          const codeText = baseUrl + '/sub/' + latestOrder.code + '.m3u';
          document.getElementById('vipCode').textContent = codeText;
          document.getElementById('vipCode').dataset.code = latestOrder.code;
          
          // 设置到期时间和状态
          const vipBadge = document.getElementById('vipBadge');
          let expiryText = '永久有效';
          
          if (isExpired) {
            expiryText = codeExpiredAt ? new Date(codeExpiredAt).toLocaleDateString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US') : '已过期';
            vipBadge.textContent = '已过期';
            vipBadge.classList.add('expired');
          } else if (isPermanent) {
            expiryText = '永久有效';
            vipBadge.textContent = '永久';
            vipBadge.classList.remove('expired');
          } else {
            expiryText = codeExpiredAt ? new Date(codeExpiredAt).toLocaleDateString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US') : '永久有效';
            vipBadge.textContent = 'ACTIVE';
            vipBadge.classList.remove('expired');
          }
          document.getElementById('vipExpiry').textContent = expiryText;
          
          // 显示卡片
          vipCard.style.display = 'block';
        } else {
          vipCard.style.display = 'none';
        }
      } catch (error) {
        console.error('加载VIP状态失败:', error);
        vipCard.style.display = 'none';
      }
    }
    
    // 复制VIP订阅地址
    function copyVipCode() {
      const codeText = document.getElementById('vipCode').textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        showToast(currentLang === 'zh-CN' ? '订阅地址已复制！' : 'Subscription URL copied!', 'success');
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    }
    
    async function loadOrderHistory() {
      const ordersListDiv = document.getElementById('ordersList');
      const loadingDiv = document.getElementById('ordersLoading');
      
      ordersListDiv.innerHTML = '';
      loadingDiv.classList.add('active');
      
      try {
        const response = await fetch(API_BASE + '/orders', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          const orders = data.orders || [];
          
          if (orders.length === 0) {
            ordersListDiv.innerHTML = \`
              <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <p>\${t('noOrders')}</p>
              </div>
            \`;
          } else {
            ordersListDiv.innerHTML = orders.map(order => {
              const createdDate = new Date(order.created_at);
              const statusClass = order.status.toLowerCase();
              const statusText = {
                'completed': t('statusCompleted'),
                'pending': t('statusPending'),
                'cancelled': t('statusCancelled')
              }[order.status] || order.status;
              const dayUnit = currentLang === 'zh-CN' ? ' 天' : ' days';
              const baseUrl = window.location.origin;
              const subUrl = order.code ? \`\${baseUrl}/sub/\${order.code}.m3u\` : '-';

              return \`
                <div class="order-card">
                  <div class="order-header">
                    <span class="order-id">\${t('orderId')}：\${order.order_id}</span>
                    <span class="order-status \${statusClass}">\${statusText}</span>
                  </div>
                  <div class="order-details">
                    <div class="order-detail-item">
                      <div class="order-detail-label">Code</div>
                      <div class="order-detail-value">\${order.code || '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">\${t('subUrl')}</div>
                      <div class="order-detail-value" style="font-size: 12px; word-break: break-all;">\${subUrl}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">Validity</div>
                      <div class="order-detail-value">\${order.duration_days ? order.duration_days + dayUnit : '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">\${t('ipCount')}</div>
                      <div class="order-detail-value">\${order.max_ips || 3}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">\${t('amount')}</div>
                      <div class="order-detail-value">\${order.amount ? '¥' + order.amount.toFixed(2) : '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">\${t('orderDate')}</div>
                      <div class="order-detail-value">\${createdDate.toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US')}</div>
                    </div>
                  </div>
                </div>
              \`;
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
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          const tickets = data.tickets || [];
          
          if (tickets.length === 0) {
ticketsListDiv.innerHTML = \`
              <div class="empty-tickets">
                <svg class="empty-tickets-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                <h4>No tickets yet</h4>
                <p>If you have any questions about your orders, feel free to contact us</p>
                <button class="btn-accent" onclick="showCreateTicketModal()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Create Your First Ticket
                </button>
              </div>
            \`;
          } else {
            ticketsListDiv.innerHTML = tickets.map(ticket => {
              const createdDate = new Date(ticket.created_at);
              const typeLabels = { payment: 'Payment', order: 'Order', technical: 'Technical', other: 'Other' };
              return \`
                <div class="ticket-card \${ticket.type}" onclick="showTicketDetail(\${ticket.id})">
                  <div class="ticket-header">
                    <span class="ticket-type \${ticket.type}">\${typeLabels[ticket.type] || ticket.type}</span>
                    <span class="ticket-status \${ticket.status}">\${ticket.status}</span>
                  </div>
                  <div class="ticket-subject">\${ticket.subject}</div>
                  <div class="ticket-meta">
                    <span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Order #\${ticket.order_id}
                    </span>
                    <span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                      </svg>
                      \${createdDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              \`;
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
      
      // Load orders for dropdown
      try {
        const response = await fetch('/api/auth/orders', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        const data = await response.json();
        
        if (data.success && data.orders) {
          const select = document.getElementById('ticketOrderId');
          select.innerHTML = '<option value="">-- Select an order --</option>';
          
          data.orders.filter(o => o.status === 'completed').forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString();
            select.innerHTML += \`<option value="\${order.order_id}">#\${order.order_id} - \${order.duration_days || '-'} days - \${order.amount ? '¥' + order.amount.toFixed(2) : '-'} (\${date})</option>\`;
          });
        }
      } catch (error) {
        console.error('Load orders error:', error);
      }
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
          headers: {
            'Authorization': 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
          },
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
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          const ticket = data.ticket;
          const replies = data.replies || [];
          const typeLabels = { payment: 'Payment', order: 'Order', technical: 'Technical', other: 'Other' };
          const statusLabels = { pending: 'Pending', processing: 'Processing', resolved: 'Resolved', closed: 'Closed' };
          const createdDate = new Date(ticket.created_at).toLocaleString();
          
          document.getElementById('ticketDetailTitle').textContent = ticket.subject;
          
          let html = \`
            <div style="margin-bottom:20px;">
              <div style="display:flex;gap:12px;margin-bottom:12px;">
                <span class="ticket-type \${ticket.type}">\${typeLabels[ticket.type]}</span>
                <span class="ticket-status \${ticket.status}">\${statusLabels[ticket.status]}</span>
              </div>
              <div style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">
                <span>Order: #\${ticket.order_id}</span> · <span>Created: \${createdDate}</span>
              </div>
              <div style="background:var(--bg-card);padding:16px;border-radius:8px;margin-bottom:20px;">
                <p style="color:var(--text-primary);margin:0;line-height:1.6;">\${ticket.description}</p>
              </div>
            </div>
            <h4 style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;text-transform:uppercase;">Replies</h4>
            <div class="reply-list">
          \`;
          
          if (replies.length === 0) {
            html += '<p style="color:var(--text-muted);text-align:center;padding:20px;">No replies yet</p>';
          } else {
            replies.forEach(reply => {
              const replyDate = new Date(reply.created_at).toLocaleString();
              const author = reply.is_admin ? 'Support' : 'You';
              html += \`
                <div class="ticket-reply \${reply.is_admin ? 'admin' : ''}">
                  <div class="ticket-reply-header">
                    <span class="ticket-reply-author">\${author}</span>
                    <span class="ticket-reply-time">\${replyDate}</span>
                  </div>
                  <div class="ticket-reply-content">\${reply.content}</div>
                </div>
              \`;
            });
          }
          
          html += '</div>';
          document.getElementById('ticketDetailContent').innerHTML = html;
          
          // Show/hide reply form based on ticket status
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
      if (!content) {
        showToast('Please enter reply content', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/tickets/' + currentTicketId + '/reply', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
          },
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
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
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
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
      } catch (error) {
        console.error('登出失败:', error);
      } finally {
        localStorage.removeItem('auth_token');
        showToast(t('logoutSuccess'), 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    }
    
     function showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      const toastEl = document.createElement('div');
      toastEl.className = 'toast ' + type;
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      toastEl.innerHTML = '<div class="toast-content"><span class="toast-icon">' + icons[type] + '</span><span class="toast-message">' + message + '</span></div>';
      
      container.appendChild(toastEl);
      
      setTimeout(() => {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(-10px)';
        setTimeout(() => toastEl.remove(), 300);
      }, 3000);
    }
    
    // 支付成功模态框相关函数
    function showSuccessModal(subUrl) {
      document.getElementById('generatedCode').textContent = subUrl;
      document.getElementById('successModal').classList.add('show');
    }
    
    function closeSuccessModal() {
      document.getElementById('successModal').classList.remove('show');
      // 清除 URL 参数
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    function copyCode() {
      const subUrl = document.getElementById('generatedCode').textContent;
      navigator.clipboard.writeText(subUrl).then(() => {
        showToast(currentLang === 'zh-CN' ? '订阅地址已复制到剪贴板！' : 'Subscription URL copied to clipboard!', 'success');
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    }
    
    // 检查 URL 参数中的支付状态
    function checkPaymentStatus() {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        // 支付成功，获取最新的订单信息
        loadLatestOrder();
      } else if (paymentStatus === 'cancelled') {
        showToast(currentLang === 'zh-CN' ? '支付已取消' : 'Payment cancelled', 'warning');
        // 清除 URL 参数
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
    
    // 加载最新的订单并显示订阅地址
    async function loadLatestOrder() {
      try {
        const response = await fetch(API_BASE + '/orders', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success && data.orders && data.orders.length > 0) {
          // 找到最新的已完成的订单
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
      
      // 清除 URL 参数
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // 主题初始化
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved ? saved === 'dark' : prefersDark;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    })();
    function updateThemeIcons(isDark) {
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = isDark ? 'none' : 'block';
        moon.style.display = isDark ? 'block' : 'none';
      }
    }

    // 主题切换
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
    
    // 初始化
    document.addEventListener('DOMContentLoaded', () => {
      loadUserInfo();
      loadVipStatus(); // 加载VIP会员状态
      checkPaymentStatus(); // 检查支付状态 URL 参数
    });
  </script>
  
  <!-- Translate.js 自动翻译 -->
  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    function initTranslate() {
      if (typeof translate !== 'undefined' && !window.translate) {
        window.translate = translate;
      }
      if (typeof translate !== 'undefined' && translate.language) {
        translate.language.setLocal('chinese_simplified');
        translate.service.use('client.edge');
        translate.listener.start();
        translate.setAutoDiscriminateLocalLanguage();
        translate.execute();
      } else {
        setTimeout(initTranslate, 100);
      }
    }
    initTranslate();
    
    function changeLanguage(lang) {
      var t = window.translate || translate;
      if (t && t.changeLanguage) {
        t.changeLanguage(lang);
      }
    }
  </script>
</body>
</html>`;
