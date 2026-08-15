// 订阅页面 - 营销专家×设计专家联合设计版
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';
import { HEAD_SCRIPTS } from './components/head-scripts.js';

export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP会员 - IPTV搜索 | 一个链接，看遍所有频道</title>
  <meta name="description" content="VIP订阅链接导入播放器，一次性搞定所有频道。不再每次手动搜索，收藏的云同步，多设备随意切换。">
  
  <style>
    :root {
      --accent: #e50914;
      --accent-hover: #f7262c;
      --accent-glow: rgba(229, 9, 20, 0.3);
      --bg: #0a0a0a;
      --bg-card: #141414;
      --bg-elevated: #1a1a1a;
      --border: 1px solid rgba(255,255,255,0.08);
      --border-accent: 1px solid rgba(229,9,20,0.3);
      --text: #fff;
      --text-secondary: rgba(255,255,255,0.7);
      --text-muted: rgba(255,255,255,0.4);
      --success: #22c55e;
      --gold: #ffd700;
      --gradient-hero: linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0a0a0a 100%);
      --gradient-card: linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; }
    
    /* ========== Hero区 ========== */
    .hero-section {
      padding: 80px 20px 60px;
      background: var(--gradient-hero);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero-section::before {
      content: '';
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .container { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(229,9,9,0.15);
      border: 1px solid rgba(229,9,9,0.4);
      color: var(--accent);
      padding: 10px 20px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 0;
      margin-bottom: 24px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(229,9,9,0.4); }
      50% { box-shadow: 0 0 0 10px rgba(229,9,9,0); }
    }

    .hero-badge-new {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(229,9,9,0.1);
      border: 1px solid rgba(229,9,9,0.3);
      color: var(--accent);
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 0;
      margin-bottom: 16px;
    }

    .hero-title {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-title span {
      background: linear-gradient(135deg, var(--accent) 0%, #ff6b6b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-title-large {
      font-size: clamp(2.5rem, 6vw, 3.8rem);
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 24px;
      letter-spacing: -1px;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      margin-bottom: 32px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-subtitle-large {
      font-size: 1.25rem;
      color: var(--text-secondary);
      margin-bottom: 40px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .hero-subtitle-hero {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-bottom: 32px;
      line-height: 2;
    }

    /* ========== Hero Features ========== */
    .hero-features {
      display: flex;
      gap: 24px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 44px;
    }

    .hero-feature {
      display: flex;
      align-items: center;
      gap: 14px;
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(229, 9, 20, 0.05) 100%);
      border: 1px solid rgba(229, 9, 20, 0.4);
      padding: 16px 28px;
      border-radius: 0;
      position: relative;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hero-feature::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s ease;
    }

    .hero-feature::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      transition: width 0.35s ease;
    }

    .hero-feature:hover::before {
      left: 100%;
    }

    .hero-feature:hover::after {
      width: 80%;
    }

    .hero-feature:hover {
      transform: translateY(-3px);
      border-color: rgba(229, 9, 20, 0.7);
      box-shadow: 0 12px 32px rgba(229, 9, 20, 0.25), 0 0 0 1px rgba(229, 9, 20, 0.1);
    }

    .feature-icon {
      font-size: 1.5rem;
      filter: drop-shadow(0 2px 6px rgba(229, 9, 20, 0.4));
      transition: transform 0.3s ease;
    }

    .hero-feature:hover .feature-icon {
      transform: scale(1.15);
    }

    .feature-text {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text);
      letter-spacing: 0.8px;
    }

    .hero-value-box {
      background: var(--gradient-card);
      border: 1px solid var(--border-accent);
      border-radius: 0;
      padding: 24px 32px;
      margin-bottom: 32px;
      text-align: left;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-value-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .hero-value-items {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .hero-value-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .hero-value-item strong {
      color: var(--text);
      font-weight: 600;
    }
    
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }
    .hero-stat {
      text-align: center;
    }
    .hero-stat-value {
      font-size: 2rem;
      font-weight: 900;
      color: var(--accent);
    }
    .hero-stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--accent);
      color: white;
      padding: 16px 36px;
      border-radius: 0;
      font-size: 1.1rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s;
      box-shadow: 0 8px 32px rgba(229,9,20,0.4);
    }
    .hero-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(229,9,20,0.5);
      background: var(--accent-hover);
    }

    /* ========== 对比表共有权益样式 ========== */
    .comparison-table tr.shared {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-muted);
    }
    .comparison-table tr.shared td {
      padding: 10px 16px;
    }
    .comparison-table tr.shared td:first-child {
      border-left: 3px solid var(--text-muted);
      color: var(--text-secondary);
    }
    .comparison-table tr.shared td[class="vip"] {
      border-right: 3px solid var(--text-muted);
    }
    .comparison-table tr.shared .check {
      opacity: 0.6;
    }

    /* ========== 通用区块样式 ========== */
    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(229,9,20,0.1);
      border: 1px solid rgba(229,9,20,0.2);
      color: var(--accent);
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-radius: 0;
      margin-bottom: 20px;
    }
    .section-title {
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: 800;
      margin-bottom: 16px;
    }
    .section-title span {
      background: linear-gradient(135deg, var(--accent) 0%, #ff4757 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .section-desc {
      color: var(--text-secondary);
      font-size: 1.05rem;
      max-width: 600px;
      margin: 0 auto;
    }

    /* ========== 方案区 ========== */
    .solution-section {
      padding: 100px 20px;
      background: linear-gradient(180deg, #0d0d0d 0%, var(--bg) 100%);
    }
    
    .solution-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
    }
    
    .solution-card {
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 0;
      padding: 36px 28px;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .solution-card:hover {
      transform: translateY(-4px);
      border-color: rgba(229,9,20,0.3);
      box-shadow: 0 16px 48px rgba(229,9,20,0.12);
    }
    .solution-icon {
      font-size: 3rem;
      margin-bottom: 20px;
      display: block;
    }
    .solution-card-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .solution-card-text {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }
    
    /* ========== 对比表 ========== */
    .comparison-section {
      padding: 100px 20px;
    }
    
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--gradient-card);
      border-radius: 0;
      overflow: hidden;
      border: var(--border);
    }
    .comparison-table th,
    .comparison-table td {
      padding: 18px 24px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .comparison-table th {
      background: rgba(229,9,20,0.1);
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-secondary);
    }
    .comparison-table th.vip {
      background: rgba(229,9,20,0.2);
      color: var(--accent);
    }
    .comparison-table td {
      color: var(--text-secondary);
    }
    .comparison-table td.vip {
      background: rgba(229,9,20,0.05);
      color: var(--text);
      font-weight: 600;
    }
    .comparison-table tr:last-child td {
      border-bottom: none;
    }
    .comparison-table tr:hover td {
      background: rgba(255,255,255,0.02);
    }
    .comparison-table tr:hover td.vip {
      background: rgba(229,9,20,0.08);
    }
    .check { color: var(--success); }
    .cross { color: #ef4444; }
    
    /* ========== 用户评价区 ========== */
    .testimonials-section {
      padding: 100px 20px;
      background: linear-gradient(180deg, var(--bg) 0%, #0d0d0d 100%);
    }
    
    .testimonials-scroll {
      display: flex;
      gap: 24px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      padding: 20px 0 30px;
      -webkit-overflow-scrolling: touch;
    }
    .testimonials-scroll::-webkit-scrollbar {
      height: 6px;
    }
    .testimonials-scroll::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.05);
      border-radius: 0;
    }
    .testimonials-scroll::-webkit-scrollbar-thumb {
      background: rgba(229,9,20,0.4);
      border-radius: 0;
    }
    .testimonials-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(229,9,20,0.7);
    }
    
    .testimonial-card {
      flex: 0 0 340px;
      scroll-snap-align: start;
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 0;
      padding: 28px;
      transition: all 0.3s ease;
    }
    .testimonial-card:hover {
      border-color: rgba(229,9,20,0.3);
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(229,9,20,0.12);
    }
    
    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }
    .testimonial-avatar {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--accent) 0%, #ff4757 100%);
      border-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
      flex-shrink: 0;
    }
    .testimonial-info {
      flex: 1;
    }
    .testimonial-name {
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 2px;
    }
    .testimonial-meta {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .testimonial-verified {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--success);
      background: rgba(34,197,94,0.1);
      padding: 2px 8px;
      border-radius: 0;
      margin-top: 4px;
    }
    
    .testimonial-stars {
      color: var(--gold);
      font-size: 16px;
      margin-bottom: 12px;
      letter-spacing: 2px;
    }
    
    .testimonial-text {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.7;
      font-style: italic;
    }
    .testimonial-text::before { content: '"'; font-size: 1.4rem; color: var(--accent); }
    .testimonial-text::after { content: '"'; font-size: 1.4rem; color: var(--accent); }
    
    .testimonials-hint {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-top: 24px;
    }
    
    /* ========== 价格区 ========== */
    .pricing-section {
      padding: 100px 20px;
      background: linear-gradient(180deg, #0d0d0d 0%, var(--bg) 100%);
    }
    
    .pricing-wrapper {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 40px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .pricing-wrapper { grid-template-columns: 1fr; }
    }
    
    .pricing-left {
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 0;
      padding: 40px;
    }
    
    .pricing-header h2 {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .pricing-header p {
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .selector-group {
      margin-bottom: 28px;
    }
    .selector-label {
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--text-secondary);
    }
    .selector-bar {
      display: flex;
      gap: 12px;
    }
    .select-option {
      flex: 1;
      padding: 16px 12px;
      background: rgba(255,255,255,0.03);
      border: 2px solid rgba(255,255,255,0.08);
      border-radius: 0;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .select-option:hover {
      border-color: rgba(229,9,20,0.4);
      background: rgba(229,9,20,0.05);
    }
    .select-option.selected {
      border-color: var(--accent);
      background: rgba(229,9,20,0.15);
    }
    .select-option .value {
      font-weight: 700;
      font-size: 1rem;
      display: block;
      margin-bottom: 4px;
    }
    .select-option .label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .select-option .price-tag {
      display: block;
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--accent);
      margin-top: 6px;
    }
    .select-option .badge {
      display: inline-block;
      background: var(--success);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 0;
      margin-top: 4px;
    }

    /* ========== 主题选择器 ========== */
    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
    }
    .theme-card {
      background: rgba(255,255,255,0.03);
      border: 2px solid rgba(255,255,255,0.08);
      border-radius: 0;
      padding: 16px 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .theme-card:hover {
      border-color: rgba(229,9,20,0.4);
      background: rgba(229,9,20,0.05);
    }
    .theme-card.selected {
      border-color: var(--accent);
      background: rgba(229,9,20,0.15);
    }
    .theme-card-icon {
      font-size: 1.8rem;
      margin-bottom: 8px;
    }
    .theme-card-name {
      font-weight: 700;
      font-size: 0.95rem;
      margin-bottom: 4px;
    }
    .theme-card-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    
    .pricing-right {
      background: var(--gradient-card);
      border: var(--border-accent);
      border-radius: 0;
      padding: 32px;
      position: sticky;
      top: 100px;
    }
    
    .order-summary h3 {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14px;
      color: var(--text-secondary);
    }
    .summary-row.total {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text);
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
      margin-top: 16px;
    }
    .summary-row.total span:last-child {
      color: var(--accent);
    }
    
    .payment-methods {
      margin: 24px 0;
    }
    .payment-methods label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
      display: block;
    }
    .payment-options {
      display: flex;
      gap: 12px;
    }
    .payment-option {
      flex: 1;
      padding: 14px;
      background: rgba(255,255,255,0.03);
      border: 2px solid rgba(255,255,255,0.08);
      border-radius: 0;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .payment-option:hover,
    .payment-option.selected {
      border-color: var(--accent);
      background: rgba(229,9,20,0.1);
    }
    .payment-option-icon {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }
    .payment-option-name {
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .subscribe-btn {
      width: 100%;
      padding: 18px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 0;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 16px;
    }
    .subscribe-btn:hover {
      background: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(229,9,20,0.4);
    }
    
    .guarantee-badges {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .guarantee-badges span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    /* ========== 最终CTA ========== */
    .final-cta {
      padding: 100px 20px;
      text-align: center;
      background: linear-gradient(135deg, rgba(229,9,20,0.1) 0%, transparent 100%);
    }
    .final-cta h2 {
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      font-weight: 800;
      margin-bottom: 16px;
    }
    .final-cta p {
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    .final-cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--accent);
      color: white;
      padding: 18px 40px;
      border-radius: 0;
      font-size: 1.1rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s;
    }
    .final-cta-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(229,9,20,0.5);
    }
    
    @media (max-width: 768px) {
      .pain-grid { grid-template-columns: 1fr; }
      .solution-grid { grid-template-columns: 1fr; }
      .testimonial-card { flex: 0 0 280px; }
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  
  <main>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-badge-new">⭐ 专为华人打造</div>
        <h1 class="hero-title-large">
          一个订阅链接，就能看你想看的
        </h1>
        <div class="hero-features">
          <div class="hero-feature">
            <span class="feature-icon">🚀</span>
            <span class="feature-text">告别卡顿失效</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">🚫</span>
            <span class="feature-text">告别广告限制</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">✨</span>
            <span class="feature-text">告别麻烦复杂</span>
          </div>
        </div>
        <a href="#pricing" class="hero-cta">立即订阅，首月 ¥20 →</a>
      </div>
    </section>
      <div class="container">
        <div class="section-header">
          <div class="section-tag">⭐ 会员权益</div>
          <h2 class="section-title">升级<span>VIP</span>，解锁全部功能</h2>
        </div>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>功能</th>
              <th>免费版</th>
              <th class="vip">VIP 会员</th>
            </tr>
          </thead>
          <tbody>
            <!-- 共有权益 -->
            <tr class="shared">
              <td>频道更新</td>
              <td><span class="check">✓</span> 每日更新</td>
              <td class="vip"><span class="check">✓</span> 每日更新</td>
            </tr>
            <tr class="shared">
              <td>高清画质</td>
              <td><span class="check">✓</span> 高清流畅</td>
              <td class="vip"><span class="check">✓</span> 超清流畅</td>
            </tr>
            <tr class="shared">
              <td>稳定在线</td>
              <td><span class="check">✓</span> 99% 在线率</td>
              <td class="vip"><span class="check">✓</span> 99.9% 在线率</td>
            </tr>
            <!-- 差异权益 -->
            <tr>
              <td>搜索结果显示</td>
              <td><span class="cross">✗</span> 前 10 个</td>
              <td class="vip"><span class="check">✓</span> 不限数量</td>
            </tr>
            <tr>
              <td>下载数量</td>
              <td><span class="cross">✗</span> 10 个</td>
              <td class="vip"><span class="check">✓</span> 无限制</td>
            </tr>
            <tr>
              <td>频道收藏</td>
              <td><span class="cross">✗</span> 本地收藏</td>
              <td class="vip"><span class="check">✓</span> 云端同步</td>
            </tr>
            <tr>
              <td>线路地区匹配</td>
              <td><span class="cross">✗</span> 无</td>
              <td class="vip"><span class="check">✓</span> 有</td>
            </tr>
            <tr>
              <td>专属订阅地址</td>
              <td><span class="cross">✗</span> 无</td>
              <td class="vip"><span class="check">✓</span> 有</td>
            </tr>
            <tr>
              <td>多设备支持</td>
              <td><span class="cross">✗</span> 无</td>
              <td class="vip"><span class="check">✓</span> 支持</td>
            </tr>
            <tr>
              <td>广告</td>
              <td><span class="cross">✗</span> 有</td>
              <td class="vip"><span class="check">✓</span> 无</td>
            </tr>
            <tr>
              <td>客服极速响应</td>
              <td><span class="cross">✗</span> 无</td>
              <td class="vip"><span class="check">✓</span> 有</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    
    <!-- 用户评价区 -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">💬 真实评价</div>
          <h2 class="section-title">来自全球华人的<span>真实反馈</span></h2>
          <p class="section-desc">他们的故事，就是你的体验</p>
        </div>
        <div class="testimonials-scroll">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">张</div>
              <div class="testimonial-info">
                <div class="testimonial-name">张先生</div>
                <div class="testimonial-meta">🇺🇸 美国 · 订阅 2 年</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在美国待了快十年，每年春节最愁的就是看春晚。以前用VPN看国内APP，不是卡就是黑屏。朋友推荐了这个，用APTV导入就能看，画质比之前流畅多了。今年终于不用躲在房间里刷手机了，客厅电视上看一家人守着，感觉挺好的。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">李</div>
              <div class="testimonial-info">
                <div class="testimonial-name">李女士</div>
                <div class="testimonial-meta">🇬🇧 英国 · 订阅 1 年</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">给孩子看湖南卫视、给老人看CCTV，各看各的互不打扰。最满意的是看英超完全不卡，用Tivimate导入很方便。有个小问题是有时段性卡顿，客服回复挺快的，帮我调了线路就好了。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">王</div>
              <div class="testimonial-info">
                <div class="testimonial-name">王先生</div>
                <div class="testimonial-meta">🇨🇦 加拿大 · 订阅 8 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">配置真的超简单，用Televizo导入后直接能看。把链接给爸妈发了过去，他们自己导入就能看。现在每天晚饭后全家一起看新闻联播，特别温馨。就是频道有点多，找自己想看的还得挑一挑。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">陈</div>
              <div class="testimonial-info">
                <div class="testimonial-name">陈女士</div>
                <div class="testimonial-meta">📍 北京 · 订阅 3 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">以前在家只能看地方台，现在用APTV能看央视所有频道和湖南卫视。周末全家一起看新闻联播，爸妈可高兴了。用CarPlay在车上也能听广播，挺方便的。就是有时候频道太多要找一会儿。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">刘</div>
              <div class="testimonial-info">
                <div class="testimonial-name">刘先生</div>
                <div class="testimonial-meta">📍 上海 · 订阅 1 年</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在家想看港澳台频道，找了好几个服务都不稳定。这个用Televizo导入就能看，凤凰卫视、阳光卫视都很清晰。偶尔有卡顿，客服响应很快，给我换了线路就好了。性价比高，推荐。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">赵</div>
              <div class="testimonial-info">
                <div class="testimonial-name">赵女士</div>
                <div class="testimonial-meta">🇯🇵 日本 · 订阅 1 年</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在日本工作，平时最喜欢看家乡的新闻和综艺。用GSE Smart IPTV导入后频道很全，连我们省的地面频道都有，就像在家里一样。有时候网速慢会卡一下，但整体体验不错。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">周</div>
              <div class="testimonial-info">
                <div class="testimonial-name">周先生</div>
                <div class="testimonial-meta">🇸🇬 新加坡 · 订阅 3 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★☆</div>
            <p class="testimonial-text">新加坡华人多，办公室同事一起订阅了。5台设备够用，用APTV都很顺。偶尔会小卡顿，但客服响应很快，总体满意。就是感觉价格能再便宜点就好了。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">吴</div>
              <div class="testimonial-info">
                <div class="testimonial-name">吴女士</div>
                <div class="testimonial-meta">📍 成都 · 订阅 4 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">四川人喜欢晚上刷剧看综艺，以前只能看地方台。现在用GSE Smart IPTV能看到湖南卫视、浙江卫视的直播，还能回看。用Tivimate体验更好，界面简洁，操作方便。唯一不满的是想找老电影频道有点难。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">郑</div>
              <div class="testimonial-info">
                <div class="testimonial-name">郑先生</div>
                <div class="testimonial-meta">🇰🇷 韩国 · 订阅 5 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在韩国留学，用Tivimate看国内体育比赛很方便。操作简单，室友都在用，我们群里经常一起聊球赛。画质清晰，基本不卡。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">孙</div>
              <div class="testimonial-info">
                <div class="testimonial-name">孙女士</div>
                <div class="testimonial-meta">🇫🇷 法国 · 订阅 7 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在欧洲生活多年，最想念的就是国内春晚和新闻联播。用APTV导入后解决了我的问题，7天无理由退款也让我放心尝试。虽然偶尔有卡顿，但客服态度很好，整体体验不错。就是希望频道能再分类清楚一点。</p>
          </div>
        </div>
        <p class="testimonials-hint">← 左右滑动查看更多评价 →</p>
      </div>
    </section>

    <!-- 价格区 -->
    <section class="pricing-section" id="pricing">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">💳 选择方案</div>
          <h2 class="section-title">选一个适合你的<span>会员计划</span></h2>
          <p class="section-desc">所有方案均支持7天无理由退款</p>
        </div>
        <div class="pricing-wrapper">
          <div class="pricing-left">
            <div class="selector-group">
              <div class="selector-label">线路选择</div>
              <div class="theme-grid" id="themeGrid">
                <div class="theme-card selected" data-theme="all" id="defaultThemeCard">
                  <div class="theme-card-icon">📺</div>
                  <div class="theme-card-name">全部频道</div>
                  <div class="theme-card-desc">5000+ 国内外频道</div>
                </div>
                <div class="theme-card" data-theme="favorites" id="favoritesCard" style="display:none;">
                  <div class="theme-card-icon">⭐</div>
                  <div class="theme-card-name">我的收藏</div>
                  <div class="theme-card-desc">仅返回您收藏的频道</div>
                </div>
              </div>
            </div>

            <div class="selector-group">
              <div class="selector-label">订阅时长</div>
              <div class="selector-bar" id="durationGrid">
                <div class="select-option selected" onclick="selectDuration(30)">
                  <span class="value">月度</span>
                  <span class="label">30天</span>
                  <span class="price-tag">¥20</span>
                </div>
                <div class="select-option" onclick="selectDuration(90)">
                  <span class="value">季度</span>
                  <span class="label">90天</span>
                  <span class="badge">立省 25%</span>
                  <span class="price-tag">¥45</span>
                </div>
                <div class="select-option" onclick="selectDuration(365)">
                  <span class="value">年度</span>
                  <span class="label">365天</span>
                  <span class="badge">最划算</span>
                  <span class="price-tag">¥168</span>
                </div>
              </div>
            </div>
            
            <div class="selector-group">
              <div class="selector-label">设备数量</div>
              <div class="selector-bar" id="ipGrid">
                <div class="select-option selected" onclick="selectIP(1)">
                  <span class="value">1台</span>
                </div>
                <div class="select-option" onclick="selectIP(2)">
                  <span class="value">2台</span>
                  <span class="label">+¥10/期</span>
                </div>
                <div class="select-option" onclick="selectIP(3)">
                  <span class="value">3台</span>
                  <span class="label">+¥20/期</span>
                </div>
                <div class="select-option" onclick="selectIP(5)">
                  <span class="value">5台</span>
                  <span class="label">+¥30/期</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="pricing-right">
            <div class="order-summary">
              <h3>📋 订单摘要</h3>
              <div class="summary-row">
                <span>基础价格</span>
                <span id="basePrice">¥20.00</span>
              </div>
              <div class="summary-row">
                <span>设备扩展费</span>
                <span id="ipPrice">¥0.00</span>
              </div>
              <div class="summary-row total">
                <span>总计</span>
                <span id="totalPrice">¥20.00</span>
              </div>
            </div>
            
            <div class="payment-methods">
              <label>选择付款方式</label>
              <div class="payment-options">
                <div class="payment-option selected" onclick="selectPayment('alipay')">
                  <div class="payment-option-icon">💳</div>
                  <div class="payment-option-name">支付宝</div>
                </div>
                <div class="payment-option" onclick="selectPayment('wechat')">
                  <div class="payment-option-icon">💚</div>
                  <div class="payment-option-name">微信支付</div>
                </div>
              </div>
            </div>
            
            <p class="theme-hint" id="themeHint" style="display:none;color:var(--accent);font-size:12px;margin-top:8px;"></p>
            <button class="subscribe-btn" onclick="handleSubscribe()">立即订阅</button>
            
            <div class="guarantee-badges">
              <span>🔒 安全支付</span>
              <span>⚡ 即时开通</span>
              <span>↩️ 7天退款</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 最终CTA -->
    <section class="final-cta">
      <div class="container">
        <h2>还在犹豫？试试<span style="color: var(--accent)">7天免费VIP</span></h2>
        <p>注册即送，无需信用卡，体验全部功能后再决定</p>
        <a href="/login#register" class="final-cta-btn">立即注册获取免费VIP →</a>
      </div>
    </section>
  </main>
  
  ${PAGE_FOOTER}
  
  <script>
    // 价格计算逻辑
    let selectedDuration = { days: 30, basePrice: 20 };
    let selectedIPs = 1;
    let selectedPaymentMethod = 'alipay';
    
    function selectDuration(days) {
      const prices = { 30: 20, 90: 45, 365: 168 };
      selectedDuration = { days, basePrice: prices[days] };
      
      document.querySelectorAll('#durationGrid .select-option').forEach(el => {
        el.classList.remove('selected');
      });
      event.currentTarget.classList.add('selected');
      
      updateOrderSummary();
    }
    
    function selectIP(count) {
      selectedIPs = count;
      
      document.querySelectorAll('#ipGrid .select-option').forEach(el => {
        el.classList.remove('selected');
      });
      event.currentTarget.classList.add('selected');
      
      updateOrderSummary();
    }
    
    function selectPayment(method) {
      selectedPaymentMethod = method;
      
      document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.remove('selected');
      });
      event.currentTarget.classList.add('selected');
    }
    
    function updateOrderSummary() {
      const ipPrice = Math.max(0, (selectedIPs - 1) * 10);
      const totalPrice = selectedDuration.basePrice + ipPrice;
      
      document.getElementById('basePrice').textContent = '¥' + selectedDuration.basePrice.toFixed(2);
      document.getElementById('ipPrice').textContent = '¥' + ipPrice.toFixed(2);
      document.getElementById('totalPrice').textContent = '¥' + totalPrice.toFixed(2);
    }
    
    let selectedTheme = null;

    async function loadThemes() {
      try {
        // 检查用户是否已登录且为 VIP
        const isLoggedIn = localStorage.getItem('auth_token');
        if (isLoggedIn) {
          const favoritesCard = document.getElementById('favoritesCard');
          if (favoritesCard) {
            favoritesCard.style.display = 'block';
            favoritesCard.onclick = () => selectTheme('favorites');
          }
        }

        const response = await fetch('/api/subscription/topics');
        const data = await response.json();

        if (data.success && data.topics.length > 0) {
          const grid = document.getElementById('themeGrid');

          data.topics.forEach((topic, index) => {
            const card = document.createElement('div');
            card.setAttribute('class', 'theme-card');
            card.onclick = () => selectTheme(topic.id);
            card.dataset.theme = topic.id;
            const desc = topic.description || '精选频道';
            card.innerHTML = '<div class="theme-card-name">' + topic.name + '</div><div class="theme-card-desc">' + desc + '</div>';
            grid.appendChild(card);
          });
        }

        // 给默认的"全部频道"卡片添加点击事件
        const defaultCard = document.getElementById('defaultThemeCard');
        if (defaultCard) {
          defaultCard.onclick = () => selectTheme(null);
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
      }
    }

    function selectTheme(themeId) {
      selectedTheme = themeId;

      document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('selected');
        const cardTheme = card.dataset.theme;
        if (themeId === null) {
          // 点击"全部频道"，只选中全部频道
          if (cardTheme === 'all') {
            card.classList.add('selected');
          }
        } else if (cardTheme === themeId.toString()) {
          card.classList.add('selected');
        }
      });

      // 如果是 favorites，添加提示
      const hintEl = document.getElementById('themeHint');
      if (hintEl) {
        if (themeId === 'favorites') {
          hintEl.textContent = '订阅后将只返回您收藏的频道';
          hintEl.style.display = 'block';
        } else {
          hintEl.textContent = '';
          hintEl.style.display = 'none';
        }
      }
    }

    // 页面加载时获取主题列表
    loadThemes();

    function handleSubscribe() {
      // 检查登录状态
      const isLoggedIn = localStorage.getItem('auth_token');
      if (!isLoggedIn) {
        showToast('Please login first', 'error');
        window.location.href = '/login?redirect=/subscription';
        return;
      }

      const params = new URLSearchParams({
        duration: selectedDuration.days,
        ips: selectedIPs,
        payment: selectedPaymentMethod
      });
      if (selectedTheme) {
        params.set('theme', selectedTheme);
        // 如果是 favorites，添加 sub_mode
        if (selectedTheme === 'favorites') {
          params.set('sub_mode', 'favorites');
        }
      }
      window.location.href = '/subscribe?' + params.toString();
    }
    
    // 初始化
    updateOrderSummary();

    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:4px;color:#fff;font-size:14px;z-index:9999;animation:fadeIn 0.3s;';
      if (type === 'error') toast.style.background = 'var(--accent)';
      else if (type === 'success') toast.style.background = '#22c55e';
      else toast.style.background = '#3b82f6';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  </script>
</body>
</html>`;
