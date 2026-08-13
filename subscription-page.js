// 订阅页面 - 营销优化版 v2
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';
import { HEAD_SCRIPTS } from './components/head-scripts.js';

export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP会员 - IPTV搜索 | 海外华人必备的国内电视</title>
  <meta name="description" content="海外华人看国内电视直播的终极方案。5000+频道，无广告，支持所有设备。">
  
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
      --gradient-hero: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%);
      --gradient-card: linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; }
    
    /* ========== 痛点场景 - 场景化设计 ========== */
    .pain-section {
      padding: 100px 20px;
      background: var(--gradient-hero);
      position: relative;
      overflow: hidden;
    }
    .pain-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at 30% 50%, rgba(229,9,20,0.08) 0%, transparent 60%);
      pointer-events: none;
    }
    .container { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
    
    .section-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(229,9,20,0.15);
      border: 1px solid rgba(229,9,20,0.3);
      color: var(--accent);
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 24px;
    }
    
    .pain-title {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 60px;
      text-align: center;
      background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .pain-title span { 
      background: linear-gradient(135deg, var(--accent) 0%, #ff4757 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .pain-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .pain-card {
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 16px;
      padding: 32px;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s, border-color 0.3s;
    }
    .pain-card:hover {
      transform: translateY(-4px);
      border-color: rgba(229,9,20,0.4);
    }
    .pain-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .pain-card:hover::before { opacity: 1; }
    
    .pain-card-scene {
      width: 100%;
      height: 160px;
      background: linear-gradient(135deg, rgba(229,9,20,0.1) 0%, rgba(0,0,0,0.3) 100%);
      border-radius: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .pain-card-scene svg { width: 64px; height: 64px; opacity: 0.8; }
    
    .pain-card-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      background: rgba(229,9,20,0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .pain-card-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--text);
    }
    .pain-card-text {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }
    
    /* ========== 解决方案 - 产品优势 ========== */
    .solution-section {
      padding: 100px 20px;
      background: linear-gradient(180deg, var(--bg) 0%, #0d0d0d 100%);
    }
    
    .solution-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .solution-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 900;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .solution-subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
    }
    
    .solution-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }
    
    .solution-card {
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 16px;
      padding: 28px;
      text-align: center;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .solution-card:hover {
      border-color: rgba(229,9,20,0.4);
      transform: translateY(-2px);
    }
    .solution-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: var(--accent);
      border-radius: 3px 3px 0 0;
      opacity: 0;
      transition: opacity 0.3s, width 0.3s;
    }
    .solution-card:hover::after {
      opacity: 1;
      width: 80px;
    }
    
    .solution-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, rgba(229,9,20,0.2) 0%, rgba(229,9,20,0.1) 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 28px;
      border: 1px solid rgba(229,9,20,0.2);
    }
    
    .solution-card-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .solution-card-text {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    /* ========== 数据统计 - 大数字展示 ========== */
    .stats-section {
      padding: 80px 20px;
      background: linear-gradient(135deg, rgba(229,9,20,0.05) 0%, transparent 50%, rgba(229,9,20,0.03) 100%);
      border-top: 1px solid rgba(229,9,20,0.1);
      border-bottom: 1px solid rgba(229,9,20,0.1);
    }
    
    .stats-grid {
      display: flex;
      justify-content: center;
      gap: 80px;
      flex-wrap: wrap;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .stat-item { text-align: center; position: relative; }
    .stat-item:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -40px;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 40px;
      background: rgba(255,255,255,0.1);
    }
    
    .stat-value {
      font-size: 3.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--accent) 0%, #ff4757 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }
    .stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 8px;
      font-weight: 600;
    }
    
    /* ========== 对比表格 ========== */
    .comparison-section {
      padding: 100px 20px;
    }
    
    .comparison-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 48px;
    }
    
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      max-width: 800px;
      margin: 0 auto;
      background: var(--gradient-card);
      border-radius: 16px;
      overflow: hidden;
      border: var(--border);
    }
    
    .comparison-table th, .comparison-table td {
      padding: 18px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .comparison-table th {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      background: rgba(0,0,0,0.3);
    }
    .comparison-table th:first-child { text-align: left; color: var(--text-secondary); }
    .comparison-table th.vip { 
      color: var(--accent); 
      font-weight: 700;
      background: rgba(229,9,20,0.1);
    }
    .comparison-table td:first-child { 
      text-align: left; 
      color: var(--text);
      font-weight: 500;
    }
    .comparison-table tr:last-child td { border-bottom: none; }
    .comparison-table tr:hover td { background: rgba(255,255,255,0.02); }
    .comparison-table .check { color: var(--success); font-size: 1.2rem; }
    .comparison-table .cross { color: var(--text-muted); font-size: 1.2rem; }
    .comparison-table .highlight-cell { 
      background: rgba(229,9,20,0.05);
      color: var(--text);
    }
    
    /* ========== 用户评价 ========== */
    .testimonials-section {
      padding: 100px 20px;
      background: linear-gradient(180deg, transparent 0%, rgba(229,9,20,0.03) 50%, transparent 100%);
    }
    
    .testimonials-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 60px;
    }
    
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1100px;
      margin: 0 auto;
    }
    
    .testimonial-card {
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 16px;
      padding: 28px;
      transition: all 0.3s;
    }
    .testimonial-card:hover {
      border-color: rgba(229,9,20,0.3);
      transform: translateY(-2px);
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
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    
    .testimonial-name { font-weight: 600; font-size: 1rem; }
    .testimonial-meta { font-size: 0.8rem; color: var(--text-muted); }
    
    .testimonial-stars { 
      color: #f59e0b; 
      font-size: 0.9rem; 
      margin-bottom: 12px;
      letter-spacing: 2px;
    }
    
    .testimonial-text { 
      color: var(--text-secondary); 
      font-size: 0.95rem; 
      line-height: 1.7;
      font-style: italic;
    }
    
    /* ========== 价格选择 ========== */
    .pricing-section {
      padding: 100px 20px;
    }
    
    .pricing-wrapper {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 40px;
      max-width: 1000px;
      margin: 0 auto;
      align-items: start;
    }
    
    .pricing-left {
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 20px;
      padding: 40px;
    }
    
    .pricing-header { margin-bottom: 32px; }
    .pricing-header h2 { 
      font-size: 1.5rem; 
      font-weight: 800; 
      margin-bottom: 6px;
    }
    .pricing-header p { color: var(--text-secondary); font-size: 0.95rem; }
    
    .selector-group { margin-bottom: 28px; }
    .selector-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .selector-bar {
      display: flex;
      background: rgba(0,0,0,0.3);
      border: var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .select-option {
      flex: 1;
      padding: 16px 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      border-right: 1px solid rgba(255,255,255,0.05);
      position: relative;
    }
    .select-option:last-child { border-right: none; }
    .select-option:hover { background: rgba(255,255,255,0.03); }
    .select-option.selected {
      background: linear-gradient(135deg, var(--accent) 0%, #b8070f 100%);
      color: #fff;
    }
    .select-option .value {
      font-weight: 800;
      font-size: 1.1rem;
      display: block;
    }
    .select-option .label {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .select-option.selected .label { color: rgba(255,255,255,0.85); }
    .select-option .price-tag {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: 4px;
    }
    .select-option.selected .price-tag { color: #fff; }
    .select-option .badge {
      position: absolute;
      top: 6px;
      right: 6px;
      background: rgba(255,255,255,0.2);
      color: #fff;
      font-size: 0.6rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .select-option.selected .badge { background: rgba(255,255,255,0.3); }
    
    /* Right: Order Card */
    .pricing-right {
      position: sticky;
      top: 100px;
      height: fit-content;
    }
    
    .order-card {
      background: var(--gradient-card);
      border: var(--border-accent);
      border-radius: 20px;
      padding: 32px;
      position: relative;
      overflow: hidden;
    }
    
    .order-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent) 0%, #ff4757 100%);
    }
    
    .order-header {
      font-size: 1.2rem;
      font-weight: 800;
      margin-bottom: 24px;
    }
    
    .order-summary {
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 0.9rem;
    }
    .summary-row .label { color: var(--text-secondary); }
    .summary-row .value { font-weight: 600; }
    
    .summary-divider {
      height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 12px 0;
    }
    
    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
    }
    .summary-total .label { font-size: 1rem; font-weight: 700; }
    .summary-total .price { 
      font-size: 2rem; 
      font-weight: 900; 
      background: linear-gradient(135deg, var(--accent) 0%, #ff4757 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .payment-methods-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    
    .payment-methods-grid {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
    }
    
    .payment-method-option {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
      background: rgba(0,0,0,0.3);
      border: var(--border);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text-secondary);
    }
    .payment-method-option:hover { 
      border-color: var(--accent);
      background: rgba(229,9,20,0.05);
    }
    .payment-method-option.selected {
      border-color: var(--accent);
      background: rgba(229,9,20,0.15);
      color: var(--text);
    }
    .payment-method-option svg { width: 24px; height: 24px; }
    
    .cta-button {
      width: 100%;
      background: linear-gradient(135deg, var(--accent) 0%, #b8070f 100%);
      color: #fff;
      border: none;
      padding: 16px;
      font-size: 1.1rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(229,9,20,0.3);
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(229,9,20,0.4);
    }
    
    .trust-badges {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .trust-item svg { width: 14px; height: 14px; fill: var(--success); }
    
    /* ========== 最终CTA ========== */
    .final-cta {
      padding: 100px 20px;
      text-align: center;
      background: linear-gradient(180deg, transparent 0%, rgba(229,9,20,0.08) 100%);
      position: relative;
    }
    .final-cta::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(229,9,20,0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    
    .final-cta-title {
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 900;
      margin-bottom: 16px;
      position: relative;
    }
    .final-cta-title span { 
      background: linear-gradient(135deg, var(--accent) 0%, #ff4757 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .final-cta-subtitle {
      color: var(--text-secondary);
      margin-bottom: 40px;
      font-size: 1.1rem;
      position: relative;
    }
    .final-cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, var(--accent) 0%, #b8070f 100%);
      color: #fff;
      padding: 18px 56px;
      font-size: 1.15rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
      border-radius: 50px;
      box-shadow: 0 4px 30px rgba(229,9,20,0.4);
      position: relative;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .final-cta-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 40px rgba(229,9,20,0.5);
    }
    .final-cta-guarantee {
      margin-top: 20px;
      font-size: 0.85rem;
      color: var(--text-muted);
      position: relative;
    }
    
    /* ========== 响应式 ========== */
    @media (max-width: 900px) {
      .pricing-wrapper { grid-template-columns: 1fr; }
      .pricing-right { position: static; }
      .stats-grid { gap: 40px; }
      .stat-item:not(:last-child)::after { display: none; }
    }
    @media (max-width: 768px) {
      .pain-section { padding: 60px 20px; }
      .solution-section { padding: 60px 20px; }
      .comparison-section { padding: 60px 20px; }
      .testimonials-section { padding: 60px 20px; }
      .pricing-section { padding: 60px 20px; }
      .final-cta { padding: 60px 20px; }
      .pain-grid { grid-template-columns: 1fr; }
      .comparison-table th, .comparison-table td { padding: 12px 16px; font-size: 0.85rem; }
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  
  <main>
    <!-- 痛点场景 -->
    <section class="pain-section">
      <div class="container">
        <div class="section-badge" style="display: block; text-align: center;">🎯 你遇到的烦恼</div>
        <h2 class="pain-title">作为<span>海外华人</span>，你是不是也经常遇到这些烦恼？</h2>
        <div class="pain-grid">
          <div class="pain-card">
            <div class="pain-card-scene">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="12" width="48" height="32" rx="4" stroke="currentColor" stroke-width="2" fill="rgba(229,9,20,0.1)"/>
                <polygon points="26,22 26,38 40,30" fill="currentColor"/>
                <text x="8" y="52" font-size="10" fill="currentColor" opacity="0.6">❌ 错过精彩</text>
              </svg>
              <div class="pain-card-icon">😤</div>
            </div>
            <h3 class="pain-card-title">想家时只能看录像</h3>
            <p class="pain-card-text">春节晚会、世界杯、新闻联播...错过就是错过，等录播永远不如实时观看有感觉。</p>
          </div>
          
          <div class="pain-card">
            <div class="pain-card-scene">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="2" fill="rgba(229,9,20,0.1)"/>
                <path d="M24 24 L40 32 L24 40" stroke="currentColor" stroke-width="2" fill="none"/>
                <text x="12" y="58" font-size="8" fill="currentColor" opacity="0.6">⚠️ 卡顿断流</text>
              </svg>
              <div class="pain-card-icon">💸</div>
            </div>
            <h3 class="pain-card-title">找到的IPTV服务不稳定</h3>
            <p class="pain-card-text">买了便宜的订阅，看球赛关键时刻卡顿、断流，花钱买罪受。</p>
          </div>
          
          <div class="pain-card">
            <div class="pain-card-scene">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" stroke-width="2" fill="rgba(229,9,20,0.1)"/>
                <line x1="20" y1="20" x2="44" y2="20" stroke="currentColor" stroke-width="2"/>
                <line x1="20" y1="28" x2="36" y2="28" stroke="currentColor" stroke-width="2" opacity="0.5"/>
                <circle cx="32" cy="44" r="6" stroke="currentColor" stroke-width="2" fill="rgba(229,9,20,0.2)"/>
                <text x="8" y="58" font-size="8" fill="currentColor" opacity="0.6">🔧 配置复杂</text>
              </svg>
              <div class="pain-card-icon">🤯</div>
            </div>
            <h3 class="pain-card-title">配置太复杂，老人不会用</h3>
            <p class="pain-card-text">要装软件、要下APP、要找链接...折腾半天，父母想用还是不会。</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 解决方案 -->
    <section class="solution-section">
      <div class="container">
        <div class="solution-header">
          <div class="section-badge" style="margin: 0 auto 20px;">✨ 我们的方案</div>
          <h2 class="solution-title">一个链接，解决所有问题</h2>
          <p class="solution-subtitle">无需复杂配置，一个播放列表搞定所有需求</p>
        </div>
        <div class="solution-grid">
          <div class="solution-card">
            <div class="solution-icon">📺</div>
            <h3 class="solution-card-title">5000+频道</h3>
            <p class="solution-card-text">央视、卫视、地方台、体育、电影全覆盖</p>
          </div>
          <div class="solution-card">
            <div class="solution-icon">⚡</div>
            <h3 class="solution-card-title">秒开不卡</h3>
            <p class="solution-card-text">CDN全球加速，海外访问依然流畅</p>
          </div>
          <div class="solution-card">
            <div class="solution-icon">🔧</div>
            <h3 class="solution-card-title">一键使用</h3>
            <p class="solution-card-text">把链接导入VLC/APTV/TVBox就能看</p>
          </div>
          <div class="solution-card">
            <div class="solution-icon">👨‍👩‍👧‍👦</div>
            <h3 class="solution-card-title">全家共享</h3>
            <p class="solution-card-text">最多5台设备，爸妈也能轻松用</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 数据统计 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">10,000+</span>
            <span class="stat-label">满意用户</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">5000+</span>
            <span class="stat-label">直播频道</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">99.9%</span>
            <span class="stat-label">稳定在线</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">4.8</span>
            <span class="stat-label">用户评分</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 免费vs VIP对比 -->
    <section class="comparison-section">
      <div class="container">
        <h2 class="comparison-title">免费版 vs VIP会员</h2>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>功能</th>
              <th>免费版</th>
              <th class="vip">VIP会员</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>搜索频道次数</td>
              <td><span class="cross">✗</span> 每天5次</td>
              <td class="highlight-cell"><span class="check">✓</span> 无限次</td>
            </tr>
            <tr>
              <td>频道数量</td>
              <td>受限</td>
              <td class="highlight-cell"><span class="check">✓</span> 5000+ 全量</td>
            </tr>
            <tr>
              <td>观看体验</td>
              <td><span class="cross">✗</span> 有广告</td>
              <td class="highlight-cell"><span class="check">✓</span> 无广告</td>
            </tr>
            <tr>
              <td>收藏功能</td>
              <td><span class="cross">✗</span> 无</td>
              <td class="highlight-cell"><span class="check">✓</span> 无限收藏</td>
            </tr>
            <tr>
              <td>多设备使用</td>
              <td><span class="cross">✗</span> 仅1台</td>
              <td class="highlight-cell"><span class="check">✓</span> 最多5台</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    
    <!-- 用户评价 -->
    <section class="testimonials-section">
      <div class="container">
        <h2 class="testimonials-title">用户真实评价</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">张</div>
              <div>
                <div class="testimonial-name">张先生</div>
                <div class="testimonial-meta">美国 · 订阅8个月</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">"在国内生活多年，最想念的就是央视和各省卫视。这个服务让我随时能看到国内节目，画质清晰，基本没有延迟。比之前用的其他IPTV稳定多了。"</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">李</div>
              <div>
                <div class="testimonial-name">李女士</div>
                <div class="testimonial-meta">英国 · 订阅1年</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">"春节回不去家，通过会员看国内直播，感觉就像在家一样。家里老人也可以用，操作简单。最值得的是无广告，看球赛不会被中断。"</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">王</div>
              <div>
                <div class="testimonial-name">王先生</div>
                <div class="testimonial-meta">加拿大 · 订阅3个月</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★☆</div>
            <p class="testimonial-text">"体育频道很全，NBA、英超都能看。云同步功能方便，换设备不用重新设置。如果能有更多粤语频道就完美了。总体来说性价比很高。"</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 价格选择 -->
    <section class="pricing-section">
      <div class="container">
        <div class="pricing-wrapper">
          <div class="pricing-left">
            <div class="pricing-header">
              <h2>选择您的方案</h2>
              <p>选择时长和设备数量</p>
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
                  <span class="badge">-25%</span>
                  <span class="price-tag">¥45</span>
                </div>
                <div class="select-option" onclick="selectDuration(365)">
                  <span class="value">年度</span>
                  <span class="label">365天</span>
                  <span class="badge">-30%</span>
                  <span class="price-tag">¥168</span>
                </div>
              </div>
            </div>
            
            <div class="selector-group">
              <div class="selector-label">设备数量</div>
              <div class="selector-bar" id="ipGrid">
                <div class="select-option selected" onclick="selectIP(1)">
                  <span class="value">1</span>
                  <span class="label">设备</span>
                </div>
                <div class="select-option" onclick="selectIP(2)">
                  <span class="value">2</span>
                  <span class="label">设备</span>
                </div>
                <div class="select-option" onclick="selectIP(3)">
                  <span class="value">3</span>
                  <span class="label">设备</span>
                </div>
                <div class="select-option" onclick="selectIP(5)">
                  <span class="value">5</span>
                  <span class="label">设备</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="pricing-right">
            <div class="order-card">
              <div class="order-header">订单摘要</div>
              
              <div class="order-summary">
                <div class="summary-row">
                  <span class="label">基础价格</span>
                  <span class="value" id="basePrice">¥20.00</span>
                </div>
                <div class="summary-row">
                  <span class="label">设备扩展</span>
                  <span class="value" id="ipPrice">¥0.00</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-total">
                  <span class="label">总计</span>
                  <span class="price" id="totalPrice">¥20.00</span>
                </div>
              </div>
              
              <div class="payment-methods-label">选择付款方式</div>
              <div class="payment-methods-grid" id="paymentMethodsGrid">
                <div class="payment-method-option selected" onclick="selectPayment('alipay')">
                  <svg viewBox="0 0 24 24" fill="#1677FF"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                </div>
                <div class="payment-method-option" onclick="selectPayment('wechat')">
                  <svg viewBox="0 0 24 24" fill="#07C160"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                </div>
              </div>
              
              <button class="cta-button" onclick="handleSubscribe()">立即订阅</button>
              
              <div class="trust-badges">
                <div class="trust-item">
                  <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  安全支付
                </div>
                <div class="trust-item">
                  <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  即时开通
                </div>
                <div class="trust-item">
                  <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  7天退款
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 最终CTA -->
    <section class="final-cta">
      <div class="container">
        <h2 class="final-cta-title">立即开启<span>无广告</span>观影体验</h2>
        <p class="final-cta-subtitle">注册即送7天免费VIP，无需信用卡，立即体验全部功能</p>
        <button class="final-cta-btn" onclick="window.location.href='/login#register'">立即注册获取免费VIP</button>
        <div class="final-cta-guarantee">7天无理由退款保证 · 安全支付 · 即时开通</div>
      </div>
    </section>
  </main>
  
  ${PAGE_FOOTER}
  
  <script>
    const durationOptions = [
      { days: 30, basePrice: 20, pricePerIP: 0, discount: 0 },
      { days: 90, basePrice: 45, pricePerIP: 5, discount: 25 },
      { days: 365, basePrice: 168, pricePerIP: 10, discount: 30 }
    ];
    
    let selectedDuration = durationOptions[0];
    let selectedIPs = 1;
    let selectedPaymentMethod = 'alipay';
    
    function calculatePrice() {
      const basePrice = selectedDuration.basePrice;
      const ipPrice = selectedDuration.pricePerIP * (selectedIPs - 1);
      const original = basePrice + ipPrice;
      const discount = selectedDuration.discount > 0 ? original * (selectedDuration.discount / 100) : 0;
      return { original, discount, finalPrice: original - discount };
    }
    
    function selectDuration(days) {
      selectedDuration = durationOptions.find(d => d.days === days);
      document.querySelectorAll('#durationGrid .select-option').forEach(el => el.classList.remove('selected'));
      event.currentTarget.classList.add('selected');
      updateOrderSummary();
    }
    
    function selectIP(count) {
      selectedIPs = count;
      document.querySelectorAll('#ipGrid .select-option').forEach(el => el.classList.remove('selected'));
      event.currentTarget.classList.add('selected');
      updateOrderSummary();
    }
    
    function selectPayment(method) {
      selectedPaymentMethod = method;
      document.querySelectorAll('.payment-method-option').forEach(el => el.classList.remove('selected'));
      event.currentTarget.classList.add('selected');
    }
    
    function updateOrderSummary() {
      const price = calculatePrice();
      document.getElementById('basePrice').textContent = '¥' + price.original.toFixed(2);
      document.getElementById('ipPrice').textContent = '¥' + (price.original - selectedDuration.basePrice).toFixed(2);
      document.getElementById('totalPrice').textContent = '¥' + price.finalPrice.toFixed(2);
    }
    
    function handleSubscribe() {
      window.location.href = '/subscribe?duration=' + selectedDuration.days + '&ips=' + selectedIPs + '&payment=' + selectedPaymentMethod;
    }
    
    updateOrderSummary();
  </script>
</body>
</html>`;
