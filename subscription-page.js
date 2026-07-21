// 订阅购买页面HTML（完全对齐生产环境 - VIP Hero + Privileges + Pricing Wrapper 风格）
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';
import { HEAD_SCRIPTS } from './components/head-scripts.js';

export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>VIP Subscription - IPTV Search</title>
  <meta name="description" content="Upgrade to VIP for unlimited access to 8000+ live TV channels. Ad-free viewing, multi-device support, and priority customer service.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://iptv-search.com/subscription">
  <link rel="alternate" hreflang="en" href="https://iptv-search.com/subscription">
  <link rel="alternate" hreflang="x-default" href="https://iptv-search.com/subscription">
  <meta property="og:title" content="VIP Subscription - IPTV Search">
  <meta property="og:description" content="Upgrade to VIP for unlimited access to 8000+ live TV channels. Ad-free viewing, multi-device support, and priority customer service.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com/subscription">
  <meta property="og:image" content="https://iptv-search.com/og-homepage.png">
  <meta property="og:site_name" content="IPTV Search">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="VIP Subscription - IPTV Search">
  <meta name="twitter:description" content="Upgrade to VIP for unlimited access to 8000+ live TV channels.">
  <meta name="twitter:image" content="https://iptv-search.com/og-homepage.png">

  <style>
    /* ========== VIP Subscription Page - 极简线条风格 ========== */

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* VIP Hero Section */
    .vip-hero {
      position: relative;
      padding: 80px 0 60px;
      text-align: center;
      overflow: hidden;
    }

    .vip-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--accent);
      color: #fff;
      font-weight: 700;
      padding: 8px 20px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 24px;
      border-radius: 0;
    }

    .vip-badge svg {
      width: 16px;
      height: 16px;
      fill: #fff;
    }

    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      line-height: 1.05;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }

    .hero-title .highlight {
      color: var(--accent);
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      max-width: 560px;
      margin: 0 auto 40px;
      line-height: 1.7;
    }

    .stats-row {
      display: flex;
      justify-content: center;
      gap: 64px;
      flex-wrap: wrap;
    }

    .stat-item { text-align: center; }

    .stat-value {
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 900;
      color: var(--accent);
      display: block;
      letter-spacing: -0.02em;
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 4px;
    }

    /* Privileges Section */
    .privileges-section {
      padding: 80px 0;
      background: linear-gradient(180deg, transparent 0%, rgba(229, 9, 20, 0.03) 50%, transparent 100%);
    }

    .section-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .section-title {
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 800;
      margin-bottom: 12px;
      letter-spacing: -0.01em;
    }

    .section-subtitle {
      color: var(--text-secondary);
      font-size: 1.05rem;
    }

    .privileges-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .privilege-card {
      background: transparent;
      border: var(--border);
      border-radius: 0;
      padding: 28px 24px;
      text-align: center;
      transition: border-color 0.3s, transform 0.3s;
      position: relative;
      overflow: hidden;
    }

    .privilege-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--accent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .privilege-card:hover {
      transform: translateY(-4px);
      border-color: var(--border-hover);
    }

    .privilege-card:hover::before { opacity: 1; }

    .privilege-icon {
      width: 56px;
      height: 56px;
      margin: 0 auto 16px;
      background: transparent;
      border: var(--border);
      border-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .privilege-title {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text-primary);
    }

    .privilege-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    /* Pricing Section */
    .pricing-section { padding: 80px 0; }

    .pricing-wrapper {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 32px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .pricing-left {
      background: transparent;
      border: var(--border);
      border-radius: 0;
      padding: 36px;
      position: relative;
      overflow: hidden;
    }

    .pricing-header { margin-bottom: 28px; }

    .pricing-title {
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 6px;
    }

    .pricing-subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .selectors-wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .selector-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .selector-bar {
      display: flex;
      background: transparent;
      border: var(--border);
      padding: 0;
      gap: 0;
    }

    .select-option {
      flex: 1;
      padding: 14px 8px;
      text-align: center;
      cursor: pointer;
      border-radius: 0;
      transition: background 0.2s, color 0.2s;
      border-right: var(--border);
    }

    .select-option:last-child { border-right: none; }

    .select-option:hover {
      background: var(--bg-hover);
    }

    .select-option.selected {
      background: var(--accent);
      color: #fff;
    }

    .select-option .value {
      font-weight: 800;
      font-size: 1.05rem;
      color: inherit;
      display: block;
      margin-bottom: 4px;
    }

    .select-option .label {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .select-option.selected .label {
      color: rgba(255, 255, 255, 0.85);
    }

    .select-option .price-tag {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: 6px;
    }

    .select-option.selected .price-tag { color: #fff; }

    .select-option .original {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-decoration: line-through;
      margin-top: 2px;
    }

    .select-option .countdown-timer {
      display: block;
      font-size: 0.65rem;
      color: var(--accent);
      font-weight: 700;
      margin-top: 4px;
      letter-spacing: 0.5px;
    }

    .select-option.selected .countdown-timer { color: #fff; }

    .select-option .badge {
      position: absolute;
      top: -8px;
      right: 8px;
      background: var(--accent);
      color: #fff;
      font-size: 0.6rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 0;
    }

    /* Pricing Right - Order Card */
    .pricing-right {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .order-card {
      background: transparent;
      border: 1px solid rgba(229, 9, 20, 0.3);
      border-radius: 0;
      padding: 28px;
      position: relative;
      overflow: hidden;
    }

    .order-header {
      font-size: 1.15rem;
      font-weight: 800;
      margin-bottom: 20px;
    }

    .order-summary {
      background: transparent;
      border: 1px solid rgba(229, 9, 20, 0.15);
      border-radius: 0;
      padding: 18px;
      margin-bottom: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 0.9rem;
    }

    .summary-row .label { color: var(--text-secondary); }
    .summary-row .value { font-weight: 600; }
    .summary-row.discount .value { color: var(--success); }

    .summary-divider {
      height: 1px;
      background: var(--border);
      margin: 12px 0;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 6px;
    }

    .summary-total .label {
      font-size: 1.05rem;
      font-weight: 700;
    }

    .summary-total .price {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--accent);
    }

    .payment-methods-section { margin-bottom: 16px; }

    .payment-methods-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }

    .payment-methods-grid {
      display: flex;
      gap: 8px;
    }

    .payment-method-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 10px 8px;
      background: transparent;
      border: var(--border);
      border-radius: 0;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .payment-method-option:hover {
      border-color: var(--accent);
    }

    .payment-method-option.selected {
      border-color: var(--accent);
      background: rgba(229, 9, 20, 0.06);
    }

    .payment-method-option svg {
      width: 24px;
      height: 24px;
    }

    .payment-method-option .method-text {
      font-weight: 700;
      font-size: 0.8rem;
    }

    .cta-section { margin-top: 16px; }

    .cta-button {
      width: 100%;
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 16px 32px;
      border-radius: 0;
      font-size: 1.05rem;
      font-weight: 800;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .cta-button:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }

    /* Trust Badges */
    .trust-badges {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .trust-badges-bottom {
      padding: 16px 0;
      border-top: var(--border);
      margin-top: 24px;
    }

    .trust-badges-bottom .trust-badges {
      margin-top: 0;
      max-width: 1100px;
      margin-left: auto;
      margin-right: auto;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .trust-item svg {
      width: 16px;
      height: 16px;
      fill: var(--success);
    }

    /* Loading Overlay */
    .loading {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 2500;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .loading.show { display: flex; }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* Success Modal */
    .success-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.92);
      backdrop-filter: blur(10px);
      z-index: 3000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .success-modal.show { display: flex; }

    .success-content {
      background: var(--bg-secondary);
      border: 1px solid var(--accent);
      border-radius: 0;
      padding: 40px;
      max-width: 420px;
      text-align: center;
      position: relative;
    }

    .success-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }

    .success-title {
      font-size: 1.6rem;
      font-weight: 800;
      margin-bottom: 10px;
    }

    .success-message {
      color: var(--text-secondary);
      margin-bottom: 24px;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .purchase-details {
      background: transparent;
      border: var(--border);
      border-radius: 0;
      padding: 16px;
      margin-bottom: 16px;
    }

    .purchase-detail-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: var(--border);
    }

    .purchase-detail-item:last-child { border-bottom: none; }

    .purchase-detail-label {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    .purchase-detail-value {
      font-weight: 600;
      font-size: 0.85rem;
    }

    .code-display {
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 0;
      padding: 14px;
      font-family: 'SF Mono', 'Courier New', monospace;
      font-size: 0.85rem;
      word-break: break-all;
      margin-bottom: 16px;
      color: var(--accent);
    }

    .copy-button {
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 14px 32px;
      border-radius: 0;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      transition: background 0.2s;
    }

    .copy-button:hover { background: var(--accent-hover); }

    .next-steps {
      margin-top: 18px;
      padding-top: 14px;
      border-top: var(--border);
    }

    .next-steps-hint {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-bottom: 8px;
    }

    .next-steps-link {
      color: var(--accent);
      font-size: 0.9rem;
      text-decoration: none;
      font-weight: 600;
    }

    .next-steps-link:hover { text-decoration: underline; }

    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 0;
      background: transparent;
      border: var(--border);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    /* Payment Modal */
    .payment-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(12px);
      z-index: 2000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .payment-modal.show { display: flex; }

    .payment-content {
      background: var(--bg-secondary);
      border: var(--border);
      border-radius: 0;
      padding: 0;
      max-width: 480px;
      width: 100%;
      animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes modalSlideIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .payment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: transparent;
      border-bottom: var(--border);
    }

    .payment-title {
      font-size: 1.1rem;
      font-weight: 800;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .payment-title::before {
      content: '';
      width: 4px;
      height: 18px;
      background: var(--accent);
      border-radius: 0;
    }

    .payment-close {
      background: transparent;
      border: var(--border);
      color: var(--text-secondary);
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
      width: 32px;
      height: 32px;
      border-radius: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .payment-close:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    .payment-body { padding: 24px; }

    .qrcode-section {
      background: transparent;
      border: var(--border);
      border-radius: 0;
      padding: 20px;
      text-align: center;
      margin-bottom: 18px;
    }

    .qrcode-wrapper {
      background: #fff;
      padding: 12px;
      border-radius: 0;
      display: inline-block;
      margin-bottom: 14px;
    }

    .modal-qrcode-image {
      width: 200px;
      height: 200px;
      display: block;
    }

    .qrcode-tip {
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      margin: 0 0 10px 0;
    }

    .payment-method-indicator {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin: 0 0 10px 0;
    }

    .payment-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--accent);
      font-size: 0.8rem;
      font-weight: 700;
      padding: 6px 14px;
      background: transparent;
      border: 1px solid var(--accent);
      border-radius: 0;
    }

    .payment-status::before {
      content: '';
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
      animation: statusBlink 1.5s ease-in-out infinite;
    }

    @keyframes statusBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .payment-info {
      background: transparent;
      border: var(--border);
      border-radius: 0;
      padding: 16px 20px;
      margin-bottom: 18px;
    }

    .payment-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: var(--border);
    }

    .payment-info-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .payment-info-item:first-child { padding-top: 0; }

    .payment-info-label {
      color: var(--text-secondary);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .payment-info-value {
      font-size: 0.9rem;
      font-weight: 600;
    }

    .payment-amount { color: var(--accent); font-size: 1.1rem; font-weight: 800; }

    .payment-footer {
      padding: 16px 24px 20px;
      border-top: var(--border);
    }

    .payment-test-button {
      width: 100%;
      background: transparent;
      color: #4CAF50;
      border: 1px solid #4CAF50;
      padding: 12px;
      border-radius: 0;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .pricing-wrapper {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      .pricing-right { position: static; }
      .privileges-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }

    @media (max-width: 600px) {
      .vip-hero { padding: 60px 0 40px; }
      .stats-row { gap: 32px; }
      .privileges-grid { grid-template-columns: 1fr; }
      .privileges-section { padding: 60px 0; }
      .pricing-section { padding: 60px 0; }
      .pricing-left { padding: 24px; }
      .order-card { padding: 20px; }
      .select-option { padding: 10px 4px; }
      .select-option .value { font-size: 0.9rem; }
      .selector-bar { flex-wrap: wrap; }
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}

  <main>
    <!-- VIP Hero -->
    <section class="vip-hero">
      <div class="container">
        <div class="vip-badge">
          <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          VIP Membership
        </div>
        <h1 class="hero-title">
          Unlock the <span class="highlight">Ultimate</span><br>TV Experience
        </h1>
        <p class="hero-subtitle">
          Join thousands of satisfied viewers enjoying premium entertainment with our exclusive VIP membership. No ads, unlimited access, cloud sync, and priority support.
        </p>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-value">150+</span>
            <span class="stat-label">Countries</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">99.9%</span>
            <span class="stat-label">Uptime</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">24/7</span>
            <span class="stat-label">Support</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Privileges Section -->
    <section class="privileges-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">VIP Exclusive Privileges</h2>
          <p class="section-subtitle">Everything you need for the ultimate viewing experience</p>
        </div>
        <div class="privileges-grid">
          <div class="privilege-card">
            <div class="privilege-icon">🚫</div>
            <h3 class="privilege-title">Ad-Free Viewing</h3>
            <p class="privilege-desc">Zero interruptions. Enjoy every moment without annoying ads or pop-ups.</p>
          </div>
          <div class="privilege-card">
            <div class="privilege-icon">❤️</div>
            <h3 class="privilege-title">Unlimited Favorites</h3>
            <p class="privilege-desc">Save as many channels as you want. No limits, no restrictions.</p>
          </div>
          <div class="privilege-card">
            <div class="privilege-icon">☁️</div>
            <h3 class="privilege-title">Cloud Sync</h3>
            <p class="privilege-desc">Your favorites automatically sync across all your devices instantly.</p>
          </div>
          <div class="privilege-card">
            <div class="privilege-icon">📱</div>
            <h3 class="privilege-title">Multi-Device</h3>
            <p class="privilege-desc">Watch on any device: phone, tablet, TV, computer, or streaming box.</p>
          </div>
          <div class="privilege-card">
            <div class="privilege-icon">🏠</div>
            <h3 class="privilege-title">Multi-Home Support</h3>
            <p class="privilege-desc">Use on multiple locations or households with family sharing.</p>
          </div>
          <div class="privilege-card">
            <div class="privilege-icon">⬇️</div>
            <h3 class="privilege-title">Unlimited Downloads</h3>
            <p class="privilege-desc">Download content for offline viewing anytime, anywhere.</p>
          </div>
          <div class="privilege-card">
            <div class="privilege-icon">🔄</div>
            <h3 class="privilege-title">Online Updates</h3>
            <p class="privilege-desc">Subscribe to get the latest channel updates anytime - always up to date and convenient.</p>
          </div>
          <div class="privilege-card">
            <div class="privilege-icon">⚡</div>
            <h3 class="privilege-title">99.9% Uptime</h3>
            <p class="privilege-desc">Rock-solid reliability. Your entertainment is always available when you need it.</p>
          </div>
          <div class="privilege-card">
            <div class="privilege-icon">🎯</div>
            <h3 class="privilege-title">Priority Support</h3>
            <p class="privilege-desc">Skip the queue. Get fast, dedicated customer support from our team.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section">
      <div class="container">
        <div class="pricing-wrapper">
          <!-- Left: Duration & IP Selection -->
          <div class="pricing-left">
            <div class="pricing-header">
              <h2 class="pricing-title">Choose Your Plan</h2>
              <p class="pricing-subtitle">Select duration and device count</p>
            </div>

            <div class="selectors-wrapper">
              <div class="selector-group">
                <div class="selector-label">Duration</div>
                <div class="selector-bar" id="durationGrid">
                  <!-- Dynamically rendered -->
                </div>
              </div>

              <div class="selector-group">
                <div class="selector-label">Devices</div>
                <div class="selector-bar" id="ipGrid">
                  <!-- Dynamically rendered -->
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Order Summary & CTA -->
          <div class="pricing-right">
            <div class="order-card">
              <div class="order-header">Order Summary</div>

              <div class="order-summary">
                <div class="summary-row">
                  <span class="label">Base Price</span>
                  <span class="value" id="basePrice">¥0.00</span>
                </div>
                <div class="summary-row">
                  <span class="label">Device Extension</span>
                  <span class="value" id="ipPrice">¥0.00</span>
                </div>
                <div class="summary-row discount" id="discountRow" style="display: none;">
                  <span class="label">Volume Discount</span>
                  <span class="value" id="discountAmount">-¥0.00</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-total">
                  <span class="label">Total</span>
                  <span class="price" id="totalPrice">¥0.00</span>
                </div>
              </div>

              <div class="payment-methods-section">
                <div class="payment-methods-label">Select Payment Method</div>
                <div class="payment-methods-grid" id="paymentMethodsGrid">
                  <!-- Dynamically loaded from API -->
                </div>
              </div>

              <div class="cta-section">
                <button class="cta-button" onclick="handleSubscribe()">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Trust Badges - Screen Bottom -->
  <div class="trust-badges-bottom">
    <div class="trust-badges">
      <div class="trust-item">
        <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
        Secure Payment
      </div>
      <div class="trust-item">
        <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
        Instant Access
      </div>
      <div class="trust-item">
        <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
        7-Day Refund
      </div>
    </div>
  </div>

  <!-- Payment Modal -->
  <div id="paymentModal" class="payment-modal">
    <div class="payment-content">
      <div class="payment-header">
        <h2 class="payment-title">Complete Payment</h2>
        <button class="payment-close" onclick="closePaymentModal()">×</button>
      </div>
      <div class="payment-body">
        <div class="qrcode-section">
          <div class="qrcode-wrapper">
            <img id="modalQrcodeImage" class="modal-qrcode-image" src="" alt="Payment QR Code">
          </div>
          <p class="qrcode-tip" id="modalQrcodeTip">Scan with Alipay/WeChat to pay</p>
          <p class="payment-method-indicator" id="paymentMethodIndicator"></p>
          <p class="payment-status" id="paymentStatus">Waiting for payment...</p>
        </div>
        <div class="payment-info">
          <div class="payment-info-item">
            <span class="payment-info-label">Plan</span>
            <span class="payment-info-value" id="paymentPlanName">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">Devices</span>
            <span class="payment-info-value" id="paymentIPCount">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">Total</span>
            <span class="payment-info-value payment-amount" id="paymentAmount">-</span>
          </div>
        </div>
      </div>
      <div class="payment-footer">
        <button id="simulatePaymentBtn" class="payment-test-button" style="display: none;" onclick="simulatePaymentSuccess()">[Test Only] Simulate Payment Success</button>
      </div>
    </div>
  </div>

  <!-- Success Modal -->
  <div id="successModal" class="success-modal">
    <div class="success-content">
      <button class="modal-close" onclick="closeModal()">×</button>
      <div class="success-icon">✓</div>
      <h2 class="success-title">Payment Successful!</h2>
      <p class="success-message">Your VIP subscription is now active.</p>
      <div class="purchase-details">
        <div class="purchase-detail-item">
          <span class="purchase-detail-label">Plan</span>
          <span class="purchase-detail-value" id="successPlanName">-</span>
        </div>
        <div class="purchase-detail-item">
          <span class="purchase-detail-label">Devices</span>
          <span class="purchase-detail-value" id="successIPCount">-</span>
        </div>
        <div class="purchase-detail-item">
          <span class="purchase-detail-label">Total Paid</span>
          <span class="purchase-detail-value" id="successAmount">-</span>
        </div>
      </div>
      <div class="code-display" id="generatedCode">-</div>
      <button class="copy-button" onclick="copyCode()">Copy Subscription URL</button>
      <div class="next-steps">
        <p class="next-steps-hint">What's next?</p>
        <a href="/account" class="next-steps-link">View your subscription in Account Page →</a>
      </div>
    </div>
  </div>

  <!-- Loading Overlay -->
  <div id="loading" class="loading">
    <div class="spinner"></div>
    <p>Processing...</p>
  </div>

  <script>
    const API_BASE = '/api';

    // 支付方式名称映射
    const paymentMethodNames = {
      'alipay': 'Alipay',
      'wechat': 'WeChat Pay',
      'coinbase': 'Coinbase',
      'usdt': 'USDT',
      'usdc': 'USDC',
      'paypal': 'PayPal'
    };

    // 支付方式图标 SVG
    const paymentMethodIcons = {
      'alipay': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1677ff"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text></svg>',
      'wechat': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#07c160"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">W</text></svg>',
      'coinbase': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#0052FF"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">₿</text></svg>',
      'usdt': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#26A17B"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="9" font-weight="bold">₮</text></svg>',
      'usdc': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2775CA"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="9" font-weight="bold">$</text></svg>',
      'paypal': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#003087"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">P</text></svg>'
    };

    let selectedPaymentMethod = 'alipay';
    let availablePaymentMethods = [];

    // 套餐配置
    let durationOptions = [];
    let selectedDuration = null;
    let selectedIPs = 1;

    // IP 数量配置
    const ipOptions = [1, 2, 3, 5];

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function calculatePrice(duration) {
      const basePrice = duration.basePrice;
      const ipPrice = duration.pricePerIP * (selectedIPs - 1);
      const original = basePrice + ipPrice;

      const now = Date.now();
      const promoEndDate = duration.promoEndDate ? new Date(duration.promoEndDate).getTime() : 0;
      const isPromoActive = promoEndDate > now && duration.promoDiscount > 0;

      let finalPrice, appliedDiscount, isPromo;
      if (isPromoActive) {
        finalPrice = original * (1 - duration.promoDiscount / 100);
        appliedDiscount = duration.promoDiscount;
        isPromo = true;
      } else {
        finalPrice = original * (1 - duration.discount / 100);
        appliedDiscount = duration.discount;
        isPromo = false;
      }

      return {
        original: original,
        discounted: finalPrice,
        discount: appliedDiscount,
        isPromo: isPromo
      };
    }

    function renderDurationGrid() {
      const container = document.getElementById('durationGrid');
      if (!container) return;

      let html = '';
      durationOptions.forEach(duration => {
        const price = calculatePrice(duration);
        const isSelected = selectedDuration && selectedDuration.days === duration.days;
        const finalPrice = price.discounted.toFixed(0);
        const now = Date.now();
        const promoEndDate = duration.promoEndDate ? new Date(duration.promoEndDate).getTime() : 0;
        const hasPromo = promoEndDate > now && duration.promoDiscount > 0;

        html += '<div class="select-option ' + (isSelected ? 'selected' : '') + '" onclick="selectDuration(' + duration.days + ')">';
        html += '<span class="value">' + escapeHtml(duration.name) + '</span>';

        if (hasPromo) {
          html += '<span class="badge">' + escapeHtml(duration.promoLabel || 'Limited Time') + '</span>';
        } else if (duration.discount > 0) {
          html += '<span class="badge">-' + duration.discount + '%</span>';
        }

        html += '<span class="price-tag">¥' + finalPrice + '</span>';

        if (hasPromo) {
          html += '<span class="original">¥' + price.original.toFixed(0) + '</span>';
        } else if (duration.discount > 0 && price.original !== price.discounted) {
          html += '<span class="original">¥' + price.original.toFixed(0) + '</span>';
        }

        if (hasPromo && promoEndDate > now) {
          html += '<span class="countdown-timer" data-end-time="' + promoEndDate + '"></span>';
        }

        html += '</div>';
      });

      container.innerHTML = html;
      updateCountdowns();
    }

    function renderIPGrid() {
      const container = document.getElementById('ipGrid');
      if (!container) return;

      let html = '';
      ipOptions.forEach(ip => {
        const isSelected = selectedIPs === ip;
        html += '<div class="select-option ' + (isSelected ? 'selected' : '') + '" onclick="selectIP(' + ip + ')">';
        html += '<span class="value">' + ip + '</span>';
        html += '<span class="label">IP' + (ip > 1 ? 's' : '') + '</span>';
        html += '</div>';
      });

      container.innerHTML = html;
    }

    function updateCountdowns() {
      document.querySelectorAll('.countdown-timer').forEach(el => {
        const endTime = parseInt(el.dataset.endTime) || 0;
        if (!endTime) { el.textContent = ''; return; }

        const diff = endTime - Date.now();
        if (diff <= 0) { el.textContent = 'Expired'; return; }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        let text = '';
        if (days > 0) text += days + 'd ';
        text += hours.toString().padStart(2, '0') + ':';
        text += minutes.toString().padStart(2, '0') + ':';
        text += seconds.toString().padStart(2, '0');

        el.textContent = text;
      });
    }

    function updateSummary() {
      if (!selectedDuration) return;

      const price = calculatePrice(selectedDuration);
      const ipPrice = selectedDuration.pricePerIP * (selectedIPs - 1);

      document.getElementById('basePrice').textContent = '¥' + selectedDuration.basePrice.toFixed(2);
      document.getElementById('ipPrice').textContent = '¥' + ipPrice.toFixed(2);

      const discountRow = document.getElementById('discountRow');
      if (price.isPromo) {
        discountRow.style.display = 'flex';
        document.getElementById('discountAmount').textContent = '-' + selectedDuration.promoDiscount + '% (' + escapeHtml(selectedDuration.promoLabel || 'Promo') + ')';
      } else if (price.discount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discountAmount').textContent = '-¥' + (price.original - price.discounted).toFixed(2);
      } else {
        discountRow.style.display = 'none';
      }

      document.getElementById('totalPrice').textContent = '¥' + price.discounted.toFixed(2);
    }

    function selectDuration(days) {
      selectedDuration = durationOptions.find(d => d.days === days);
      renderDurationGrid();
      updateSummary();
    }

    function selectIP(count) {
      selectedIPs = count;
      renderIPGrid();
      updateSummary();
    }

    function getToken() {
      return localStorage.getItem('auth_token');
    }

    function isLoggedIn() {
      return !!getToken();
    }

    function selectPaymentMethod(method) {
      selectedPaymentMethod = method;
      document.querySelectorAll('.payment-method-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.method === method);
      });
    }

    function showLoading(show) {
      document.getElementById('loading').classList.toggle('show', show);
    }

    function showSuccess(subUrl, purchaseDetails) {
      if (purchaseDetails) {
        document.getElementById('successPlanName').textContent = purchaseDetails.plan || '-';
        document.getElementById('successIPCount').textContent = purchaseDetails.ips || '-';
        document.getElementById('successAmount').textContent = purchaseDetails.amount || '-';
      }
      document.getElementById('generatedCode').textContent = subUrl;
      document.getElementById('successModal').classList.add('show');
    }

    function closeModal() {
      document.getElementById('successModal').classList.remove('show');
    }

    function closePaymentModal() {
      const modal = document.getElementById('paymentModal');
      modal.classList.remove('show');
      if (checkPaymentInterval) {
        clearInterval(checkPaymentInterval);
        checkPaymentInterval = null;
      }
    }

    let checkPaymentInterval = null;
    let currentOrderId = null;

    async function handleSubscribe() {
      if (!selectedDuration) {
        alert('Please select a subscription plan');
        return;
      }

      if (!isLoggedIn()) {
        window.location.href = '/login?redirect=/subscription';
        return;
      }

      showLoading(true);

      try {
        const response = await fetch(API_BASE + '/subscription/xunhupay/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({
            duration_days: selectedDuration.days,
            max_ips: selectedIPs,
            payment_method: selectedPaymentMethod
          })
        });

        const result = await response.json();

        if (result.success && result.payment_data) {
          const price = calculatePrice(selectedDuration);

          document.getElementById('paymentPlanName').textContent = selectedDuration.name;
          document.getElementById('paymentIPCount').textContent = selectedIPs + ' IP' + (selectedIPs > 1 ? 's' : '');
          document.getElementById('paymentAmount').textContent = '¥' + price.discounted.toFixed(2);

          const methodIndicator = document.getElementById('paymentMethodIndicator');
          const methodName = paymentMethodNames[selectedPaymentMethod] || selectedPaymentMethod;
          methodIndicator.innerHTML = 'Paying with <strong>' + methodName + '</strong>';

          const qrcodeTip = document.getElementById('modalQrcodeTip');
          if (selectedPaymentMethod === 'coinbase') {
            qrcodeTip.textContent = 'Complete payment via Coinbase';
          } else if (selectedPaymentMethod === 'wechat') {
            qrcodeTip.textContent = 'Scan with WeChat to pay';
          } else {
            qrcodeTip.textContent = 'Scan with Alipay to pay';
          }

          const qrcodeImage = document.getElementById('modalQrcodeImage');
          if (result.payment_data.url_qrcode) {
            qrcodeImage.src = result.payment_data.url_qrcode;
          } else {
            qrcodeImage.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(result.payment_data.url);
          }

          document.getElementById('paymentStatus').textContent = 'Waiting for payment...';
          document.getElementById('paymentStatus').style.color = '';
          document.getElementById('paymentModal').classList.add('show');
          currentOrderId = result.order_id;

          // 开发环境显示调试按钮
          if (isLocalhost()) {
            document.getElementById('simulatePaymentBtn').style.display = 'block';
          }

          startOrderCheck(result.order_id);
        } else {
          alert(result.error || 'Payment initialization failed');
        }
      } catch (error) {
        console.error('Subscription error:', error);
        alert('Network error, please try again');
      } finally {
        showLoading(false);
      }
    }

    function startOrderCheck(orderId) {
      if (checkPaymentInterval) clearInterval(checkPaymentInterval);
      let checkCount = 0;
      const maxChecks = 60;

      checkPaymentInterval = setInterval(async () => {
        checkCount++;
        if (checkCount > maxChecks) {
          clearInterval(checkPaymentInterval);
          document.getElementById('paymentStatus').textContent = 'Payment timeout';
          return;
        }

        try {
          const response = await fetch(API_BASE + '/subscription/xunhupay/check-order?order_id=' + orderId, {
            headers: { 'Authorization': 'Bearer ' + getToken() }
          });
          const result = await response.json();

          if (result.success && result.order && result.order.status === 'completed') {
            clearInterval(checkPaymentInterval);
            document.getElementById('paymentStatus').textContent = 'Payment successful!';
            document.getElementById('paymentStatus').style.color = '#4CAF50';
            setTimeout(() => {
              closePaymentModal();
              const subUrl = window.location.origin + '/sub/' + result.order.code + '.m3u';
              const purchaseDetails = {
                plan: selectedDuration ? selectedDuration.name : '-',
                ips: selectedIPs + ' IP' + (selectedIPs > 1 ? 's' : ''),
                amount: '¥' + (selectedDuration ? calculatePrice(selectedDuration).discounted.toFixed(2) : '0.00')
              };
              showSuccess(subUrl, purchaseDetails);
            }, 1500);
          }
        } catch (error) {
          console.error('Check order error:', error);
        }
      }, 5000);
    }

    async function simulatePaymentSuccess() {
      if (!currentOrderId) {
        alert('No order to simulate');
        return;
      }

      try {
        const response = await fetch(API_BASE + '/subscription/xunhupay/simulate-success?order_id=' + currentOrderId, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + getToken() }
        });

        const result = await response.json();

        if (result.success) {
          clearInterval(checkPaymentInterval);
          document.getElementById('paymentStatus').textContent = 'Payment successful!';
          document.getElementById('paymentStatus').style.color = '#4CAF50';
          setTimeout(() => {
            closePaymentModal();
            const subUrl = window.location.origin + '/sub/' + result.code + '.m3u';
            const purchaseDetails = {
              plan: selectedDuration ? selectedDuration.name : '-',
              ips: selectedIPs + ' IP' + (selectedIPs > 1 ? 's' : ''),
              amount: '¥' + (selectedDuration ? calculatePrice(selectedDuration).discounted.toFixed(2) : '0.00')
            };
            showSuccess(subUrl, purchaseDetails);
          }, 1500);
        } else {
          alert(result.error || 'Simulation failed');
        }
      } catch (error) {
        console.error('Simulate payment error:', error);
        alert('Simulation failed');
      }
    }

    function copyCode() {
      const code = document.getElementById('generatedCode').textContent;
      navigator.clipboard.writeText(code).then(() => {
        alert('Subscription URL copied to clipboard!');
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    }

    function isLocalhost() {
      return window.location.hostname === 'localhost' ||
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname.startsWith('192.168.') ||
             window.location.hostname.startsWith('10.');
    }

    // 加载套餐
    async function loadPlans() {
      try {
        const response = await fetch('/api/mall/plans');
        const data = await response.json();

        if (data.success && data.plans && data.plans.length > 0) {
          durationOptions = data.plans.map(plan => ({
            days: plan.days,
            basePrice: plan.base_price,
            pricePerIP: plan.price_per_ip,
            discount: plan.discount || 0,
            name: plan.name_en || plan.name || ('Plan ' + plan.id),
            promoEndDate: plan.promo_end_date || null,
            promoDiscount: plan.promo_discount || 0,
            promoLabel: plan.promo_label || '',
            isPromoActive: plan.is_promo_active || false
          }));
        } else {
          durationOptions = [
            { days: 30, basePrice: 20, pricePerIP: 9, discount: 0, name: '1 Month', promoEndDate: null, promoDiscount: 0, promoLabel: '', isPromoActive: false },
            { days: 90, basePrice: 79, pricePerIP: 18, discount: 10, name: '3 Months', promoEndDate: null, promoDiscount: 0, promoLabel: '', isPromoActive: false },
            { days: 180, basePrice: 149, pricePerIP: 28, discount: 15, name: '6 Months', promoEndDate: null, promoDiscount: 0, promoLabel: '', isPromoActive: false },
            { days: 365, basePrice: 279, pricePerIP: 49, discount: 25, name: '1 Year', promoEndDate: null, promoDiscount: 0, promoLabel: '', isPromoActive: false }
          ];
        }

        selectedDuration = durationOptions[0];
        renderDurationGrid();
        renderIPGrid();
        updateSummary();
      } catch (error) {
        console.error('Failed to load plans:', error);
        durationOptions = [
          { days: 30, basePrice: 20, pricePerIP: 9, discount: 0, name: '1 Month', promoEndDate: null, promoDiscount: 0, promoLabel: '', isPromoActive: false },
          { days: 90, basePrice: 79, pricePerIP: 18, discount: 10, name: '3 Months', promoEndDate: null, promoDiscount: 0, promoLabel: '', isPromoActive: false },
          { days: 180, basePrice: 149, pricePerIP: 28, discount: 15, name: '6 Months', promoEndDate: null, promoDiscount: 0, promoLabel: '', isPromoActive: false },
          { days: 365, basePrice: 279, pricePerIP: 49, discount: 25, name: '1 Year', promoEndDate: null, promoDiscount: 0, promoLabel: '', isPromoActive: false }
        ];
        selectedDuration = durationOptions[0];
        renderDurationGrid();
        renderIPGrid();
        updateSummary();
      }
    }

    async function loadPaymentMethods() {
      try {
        const response = await fetch('/api/mall/payment-methods');
        const data = await response.json();

        if (data.success && data.payment_methods && data.payment_methods.length > 0) {
          availablePaymentMethods = data.payment_methods.filter(pm => pm.enabled);
          renderPaymentMethods();
        } else {
          const section = document.querySelector('.payment-methods-section');
          if (section) section.style.display = 'none';
        }
      } catch (error) {
        console.error('Failed to load payment methods:', error);
        const section = document.querySelector('.payment-methods-section');
        if (section) section.style.display = 'none';
      }
    }

    function renderPaymentMethods() {
      const grid = document.getElementById('paymentMethodsGrid');
      if (!grid || availablePaymentMethods.length === 0) return;

      let html = '';
      availablePaymentMethods.forEach((pm, index) => {
        const icon = paymentMethodIcons[pm.type] || '<svg viewBox="0 0 24 24" width="24" height="24"><rect width="24" height="24" fill="#888"/></svg>';
        const displayName = escapeHtml(pm.name || paymentMethodNames[pm.type] || pm.type);
        const typeEscaped = escapeHtml(pm.type);
        const isSelected = index === 0 ? ' selected' : '';
        const methodClass = 'method-' + typeEscaped.toLowerCase();
        const divClass = 'payment-method-option ' + methodClass + isSelected;
        const onclickAttr = "selectPaymentMethod('" + typeEscaped + "')";
        html += '<div class="' + divClass + '" data-method="' + typeEscaped + '" onclick="' + onclickAttr + '">' + icon + '<span class="method-text">' + displayName + '</span></div>';
      });

      grid.innerHTML = html;

      if (availablePaymentMethods.length > 0) {
        selectedPaymentMethod = availablePaymentMethods[0].type;
      }
    }

    // 倒计时定时器
    let countdownInterval = setInterval(updateCountdowns, 1000);

    // 页面初始化
    document.addEventListener('DOMContentLoaded', function() {
      loadPlans();
      loadPaymentMethods();
    });
  </script>

  ${PAGE_FOOTER}

</body>
</html>`;