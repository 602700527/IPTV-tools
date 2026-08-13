// 优化版订阅页面 - 营销导向 + 完整选择器
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';
import { HEAD_SCRIPTS } from './components/head-scripts.js';

export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP会员 - IPTV搜索 | 5000+频道无广告观看</title>
  <meta name="description" content="升级VIP享受5000+直播频道，无广告、无限收藏、云同步。7天无理由退款保证。">
  
  <style>
    :root {
      --accent: #e50914;
      --accent-hover: #f7262c;
      --success: #22c55e;
      --warning: #f59e0b;
      --bg: #0a0a0a;
      --bg-card: #141414;
      --border: 1px solid rgba(255,255,255,0.08);
      --text: #fff;
      --text-secondary: rgba(255,255,255,0.6);
      --text-muted: rgba(255,255,255,0.4);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    
    /* ========== Hero ========== */
    .hero {
      padding: 80px 20px 60px;
      text-align: center;
      background: linear-gradient(180deg, rgba(229,9,20,0.1) 0%, transparent 100%);
      border-bottom: var(--border);
    }
    .hero-badge {
      display: inline-block;
      background: var(--accent);
      color: #fff;
      padding: 6px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 16px;
    }
    .hero-title span { color: var(--accent); }
    .hero-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto 30px;
    }
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
    }
    .hero-stat { text-align: center; }
    .hero-stat-value { font-size: 2.5rem; font-weight: 900; color: var(--accent); display: block; }
    .hero-stat-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
    
    /* ========== Comparison Table ========== */
    .comparison {
      padding: 80px 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    .comparison-title {
      text-align: center;
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 40px;
    }
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
    }
    .comparison-table th, .comparison-table td {
      padding: 16px 20px;
      text-align: center;
      border-bottom: var(--border);
    }
    .comparison-table th {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }
    .comparison-table th:first-child { text-align: left; color: var(--text-secondary); }
    .comparison-table th.vip { color: var(--accent); font-weight: 700; }
    .comparison-table td:first-child { text-align: left; color: var(--text); }
    .comparison-table tr:hover { background: rgba(255,255,255,0.02); }
    .check { color: var(--success); font-size: 1.2rem; }
    .cross { color: var(--text-muted); font-size: 1.2rem; }
    .highlight-cell { background: rgba(229,9,20,0.05); }
    
    /* ========== Pricing Section (with selectors) ========== */
    .pricing {
      padding: 60px 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .pricing-title {
      text-align: center;
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 40px;
    }
    .pricing-wrapper {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 32px;
    }
    
    /* Left: Selectors */
    .pricing-left {
      background: var(--bg-card);
      border: var(--border);
      padding: 32px;
    }
    .pricing-header { margin-bottom: 28px; }
    .pricing-header h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 6px; }
    .pricing-header p { color: var(--text-secondary); font-size: 0.9rem; }
    
    .selectors-wrapper { display: flex; flex-direction: column; gap: 24px; }
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
      background: var(--bg);
      border: var(--border);
      padding: 0;
      gap: 0;
    }
    .select-option {
      flex: 1;
      padding: 14px 8px;
      text-align: center;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      border-right: var(--border);
      position: relative;
    }
    .select-option:last-child { border-right: none; }
    .select-option:hover { background: rgba(255,255,255,0.05); }
    .select-option.selected {
      background: var(--accent);
      color: #fff;
    }
    .select-option .value {
      font-weight: 800;
      font-size: 1.05rem;
      display: block;
      margin-bottom: 4px;
    }
    .select-option .label {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    .select-option.selected .label { color: rgba(255,255,255,0.85); }
    .select-option .badge {
      position: absolute;
      top: -8px;
      right: 8px;
      background: var(--accent);
      color: #fff;
      font-size: 0.6rem;
      font-weight: 700;
      padding: 2px 8px;
    }
    .select-option.selected .badge { background: #fff; color: var(--accent); }
    .select-option .price-tag {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: 4px;
    }
    .select-option.selected .price-tag { color: #fff; }
    .select-option .original {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }
    
    /* Right: Order Card */
    .pricing-right {
      position: sticky;
      top: 100px;
      height: fit-content;
    }
    .order-card {
      background: var(--bg-card);
      border: 1px solid rgba(229, 9, 20, 0.3);
      padding: 28px;
    }
    .order-header {
      font-size: 1.15rem;
      font-weight: 800;
      margin-bottom: 20px;
    }
    .order-summary {
      background: var(--bg);
      border: 1px solid rgba(229, 9, 20, 0.15);
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
    .summary-total .label { font-size: 1.05rem; font-weight: 700; }
    .summary-total .price { font-size: 1.8rem; font-weight: 900; color: var(--accent); }
    
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
      margin-bottom: 16px;
    }
    .payment-method-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 10px 8px;
      background: var(--bg);
      border: var(--border);
      cursor: pointer;
      transition: border-color 0.2s;
      color: var(--text-secondary);
      font-size: 0.75rem;
    }
    .payment-method-option:hover { border-color: var(--accent); }
    .payment-method-option.selected {
      border-color: var(--accent);
      background: rgba(229, 9, 20, 0.06);
    }
    .payment-method-option .method-text { font-weight: 700; }
    
    .cta-button {
      width: 100%;
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 16px;
      font-size: 1.05rem;
      font-weight: 800;
      cursor: pointer;
      transition: background 0.2s;
    }
    .cta-button:hover { background: var(--accent-hover); }
    
    /* ========== Testimonials ========== */
    .testimonials {
      padding: 80px 20px;
      background: linear-gradient(180deg, transparent 0%, rgba(229,9,20,0.03) 50%, transparent 100%);
    }
    .testimonials-title {
      text-align: center;
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 48px;
    }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .testimonial-card {
      background: var(--bg-card);
      border: var(--border);
      padding: 24px;
    }
    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .testimonial-avatar {
      width: 44px;
      height: 44px;
      background: var(--accent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
    }
    .testimonial-name { font-weight: 600; }
    .testimonial-meta { font-size: 0.8rem; color: var(--text-muted); }
    .testimonial-stars { color: var(--warning); font-size: 0.9rem; margin-bottom: 12px; }
    .testimonial-text { color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; }
    
    /* ========== Trust Badges ========== */
    .trust-section {
      padding: 40px 20px;
      text-align: center;
      border-top: var(--border);
    }
    .trust-badges {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    .trust-item svg { width: 20px; height: 20px; fill: var(--success); }
    
    /* ========== FAQ ========== */
    .faq {
      padding: 80px 20px;
      max-width: 700px;
      margin: 0 auto;
    }
    .faq-title {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 40px;
    }
    .faq-item {
      border-bottom: var(--border);
      padding: 20px 0;
    }
    .faq-question {
      font-weight: 600;
      margin-bottom: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
    }
    .faq-question::after { content: '+'; font-size: 1.5rem; color: var(--accent); }
    .faq-item.open .faq-question::after { content: '-'; }
    .faq-answer {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s, padding 0.3s;
    }
    .faq-item.open .faq-answer {
      max-height: 200px;
      padding-top: 12px;
    }
    
    /* ========== Final CTA ========== */
    .final-cta {
      padding: 80px 20px;
      text-align: center;
      background: linear-gradient(180deg, transparent 0%, rgba(229,9,20,0.1) 100%);
    }
    .final-cta-title {
      font-size: 2rem;
      font-weight: 900;
      margin-bottom: 16px;
    }
    .final-cta-title span { color: var(--accent); }
    .final-cta-subtitle {
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    .final-cta-btn {
      display: inline-block;
      background: var(--accent);
      color: #fff;
      padding: 16px 48px;
      font-size: 1.1rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: transform 0.2s;
      border: none;
    }
    .final-cta-btn:hover { transform: translateY(-2px); }
    .final-cta-guarantee {
      margin-top: 16px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    
    /* ========== Responsive ========== */
    @media (max-width: 900px) {
      .pricing-wrapper { grid-template-columns: 1fr; }
      .pricing-right { position: static; }
    }
    @media (max-width: 768px) {
      .hero { padding: 60px 20px 40px; }
      .hero-stats { gap: 24px; }
      .comparison-table th, .comparison-table td { padding: 12px 8px; font-size: 0.85rem; }
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  
  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-badge">★ VIP会员</div>
      <h1 class="hero-title">解锁<span>终极</span>电视体验</h1>
      <p class="hero-subtitle">与10,000+满意用户一同享受5000+直播频道，无广告干扰，随时随地精彩不断。</p>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-value">150+</span>
          <span class="hero-stat-label">国家频道</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-value">5000+</span>
          <span class="hero-stat-label">直播频道</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-value">99.9%</span>
          <span class="hero-stat-label">稳定在线</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-value">24/7</span>
          <span class="hero-stat-label">技术支持</span>
        </div>
      </div>
    </section>
    
    <!-- Comparison Table -->
    <section class="comparison">
      <h2 class="comparison-title">免费 vs VIP 对比</h2>
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
            <td>可搜索频道</td>
            <td><span class="cross">✗</span> 最多5条</td>
            <td class="highlight-cell"><span class="check">✓</span> 无限制</td>
          </tr>
          <tr>
            <td>频道数量</td>
            <td>受限</td>
            <td class="highlight-cell"><span class="check">✓</span> 5000+ 频道</td>
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
            <td>云同步</td>
            <td><span class="cross">✗</span> 无</td>
            <td class="highlight-cell"><span class="check">✓</span> 全设备同步</td>
          </tr>
          <tr>
            <td>多设备支持</td>
            <td><span class="cross">✗</span> 仅1台</td>
            <td class="highlight-cell"><span class="check">✓</span> 最多5台</td>
          </tr>
          <tr>
            <td>优先支持</td>
            <td><span class="cross">✗</span> 排队</td>
            <td class="highlight-cell"><span class="check">✓</span> 快速响应</td>
          </tr>
        </tbody>
      </table>
    </section>
    
    <!-- Pricing with Selectors -->
    <section class="pricing">
      <h2 class="pricing-title">选择您的会员方案</h2>
      <div class="pricing-wrapper">
        <!-- Left: Duration & IP Selection -->
        <div class="pricing-left">
          <div class="pricing-header">
            <h2>定制您的订阅</h2>
            <p>选择时长和设备数量</p>
          </div>
          
          <div class="selectors-wrapper">
            <div class="selector-group">
              <div class="selector-label">订阅时长</div>
              <div class="selector-bar" id="durationGrid">
                <!-- Dynamically rendered -->
              </div>
            </div>
            
            <div class="selector-group">
              <div class="selector-label">设备数量</div>
              <div class="selector-bar" id="ipGrid">
                <!-- Dynamically rendered -->
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right: Order Summary -->
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
              <div class="summary-row discount" id="discountRow" style="display: none;">
                <span class="label">优惠折扣</span>
                <span class="value" id="discountAmount">-¥0.00</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-total">
                <span class="label">总计</span>
                <span class="price" id="totalPrice">¥20.00</span>
              </div>
            </div>
            
            <div class="payment-methods-section">
              <div class="payment-methods-label">选择付款方式</div>
              <div class="payment-methods-grid" id="paymentMethodsGrid">
                <div class="payment-method-option selected" onclick="selectPayment('alipay')">
                  <svg viewBox="0 0 24 24" fill="#1677FF"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                  <span class="method-text">支付宝</span>
                </div>
                <div class="payment-method-option" onclick="selectPayment('wechat')">
                  <svg viewBox="0 0 24 24" fill="#07C160"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                  <span class="method-text">微信支付</span>
                </div>
              </div>
            </div>
            
            <button class="cta-button" onclick="handleSubscribe()">立即订阅</button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials -->
    <section class="testimonials">
      <h2 class="testimonials-title">用户真实评价</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="testimonial-header">
            <div class="testimonial-avatar">张</div>
            <div>
              <div class="testimonial-name">张先生</div>
              <div class="testimonial-meta">订阅6个月 · 美国</div>
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
              <div class="testimonial-meta">订阅1年 · 英国</div>
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
              <div class="testimonial-meta">订阅3个月 · 加拿大</div>
            </div>
          </div>
          <div class="testimonial-stars">★★★★☆</div>
          <p class="testimonial-text">"体育频道很全，NBA、英超都能看。云同步功能方便，换设备不用重新设置。如果能有更多粤语频道就完美了。总体来说性价比很高。"</p>
        </div>
      </div>
    </section>
    
    <!-- Trust Badges -->
    <section class="trust-section">
      <div class="trust-badges">
        <div class="trust-item">
          <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          <span>安全支付</span>
        </div>
        <div class="trust-item">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <span>即时开通</span>
        </div>
        <div class="trust-item">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <span>7天退款保证</span>
        </div>
        <div class="trust-item">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <span>24/7技术支持</span>
        </div>
      </div>
    </section>
    
    <!-- FAQ -->
    <section class="faq">
      <h2 class="faq-title">常见问题</h2>
      <div class="faq-item">
        <div class="faq-question">VIP会员包含哪些频道？</div>
        <div class="faq-answer">包含5000+直播频道，覆盖中国大陆、港澳台、欧美等150+国家和地区。包括央视、卫视、体育、电影、少儿等全系列频道。</div>
      </div>
      <div class="faq-item">
        <div class="faq-question">可以在多少台设备上使用？</div>
        <div class="faq-answer">根据选择的设备数量，最多支持5台设备同时在线。多设备可以同时观看不同内容。</div>
      </div>
      <div class="faq-item">
        <div class="faq-question">支持哪些播放软件？</div>
        <div class="faq-answer">支持VLC、APTV、TVBox、Tivimate、Televizo、GSE Smart IPTV、途播等主流播放器，也支持iOS CarPlay。</div>
      </div>
      <div class="faq-item">
        <div class="faq-question">不满意可以退款吗？</div>
        <div class="faq-answer">支持7天无理由退款。如果您对服务不满意，在订阅后7天内可申请全额退款，无需任何理由。</div>
      </div>
      <div class="faq-item">
        <div class="faq-question">如何激活VIP会员？</div>
        <div class="faq-answer">注册并支付后，系统会自动为您开通VIP。您可以在账户页面查看订阅状态和播放链接。</div>
      </div>
    </section>
    
    <!-- Final CTA -->
    <section class="final-cta">
      <h2 class="final-cta-title">立即开启<span>无广告</span>观影体验</h2>
      <p class="final-cta-subtitle">注册即送7天免费VIP，无需信用卡，立即体验全部功能</p>
      <button class="final-cta-btn" onclick="window.location.href='/login#register'">立即注册获取免费VIP</button>
      <div class="final-cta-guarantee">7天无理由退款保证 · 安全支付 · 即时开通</div>
    </section>
  </main>
  
  ${PAGE_FOOTER}
  
  <script>
    // 套餐配置
    const durationOptions = [
      { days: 30, name: '月度', basePrice: 20, pricePerIP: 0, discount: 0, promoDiscount: 0 },
      { days: 90, name: '季度', basePrice: 45, pricePerIP: 5, discount: 25, promoDiscount: 0 },
      { days: 365, name: '年度', basePrice: 168, pricePerIP: 10, discount: 30, promoDiscount: 0 }
    ];
    
    const ipOptions = [1, 2, 3, 5];
    
    let selectedDuration = durationOptions[0];
    let selectedIPs = 1;
    let selectedPaymentMethod = 'alipay';
    
    function calculatePrice() {
      const basePrice = selectedDuration.basePrice;
      const ipPrice = selectedDuration.pricePerIP * (selectedIPs - 1);
      const original = basePrice + ipPrice;
      
      const discount = selectedDuration.discount > 0 ? original * (selectedDuration.discount / 100) : 0;
      const finalPrice = original - discount;
      
      return { original, discount, finalPrice };
    }
    
    function renderDurationGrid() {
      const container = document.getElementById('durationGrid');
      if (!container) return;
      
      container.innerHTML = durationOptions.map(d => {
        const price = calculatePriceForDuration(d);
        const isSelected = selectedDuration.days === d.days;
        return \`
          <div class="select-option \${isSelected ? 'selected' : ''}" onclick="selectDuration(\${d.days})">
            <span class="value">\${d.name}</span>
            <span class="label">\${d.days}天</span>
            \${d.discount > 0 ? '<span class="badge">-'\${d.discount}%'</span>' : ''}
            <span class="price-tag">¥\${price.finalPrice.toFixed(0)}</span>
            \${d.discount > 0 ? '<span class="original">¥\${price.original.toFixed(0)}</span>' : ''}
          </div>
        \`;
      }).join('');
    }
    
    function calculatePriceForDuration(d) {
      const original = d.basePrice + d.pricePerIP * (selectedIPs - 1);
      const discount = d.discount > 0 ? original * (d.discount / 100) : 0;
      return { original, discount, finalPrice: original - discount };
    }
    
    function renderIPGrid() {
      const container = document.getElementById('ipGrid');
      if (!container) return;
      
      container.innerHTML = ipOptions.map(ip => {
        const isSelected = selectedIPs === ip;
        const extraPrice = selectedDuration.pricePerIP * (ip - 1);
        return \`
          <div class="select-option \${isSelected ? 'selected' : ''}" onclick="selectIP(\${ip})">
            <span class="value">\${ip}</span>
            <span class="label">IP</span>
            \${extraPrice > 0 ? '<span class="price-tag">+'\${extraPrice}元</span>' : ''}
          </div>
        \`;
      }).join('');
    }
    
    function selectDuration(days) {
      selectedDuration = durationOptions.find(d => d.days === days);
      renderDurationGrid();
      updateOrderSummary();
    }
    
    function selectIP(count) {
      selectedIPs = count;
      renderIPGrid();
      updateOrderSummary();
    }
    
    function selectPayment(method) {
      selectedPaymentMethod = method;
      document.querySelectorAll('.payment-method-option').forEach(el => {
        el.classList.remove('selected');
      });
      event.currentTarget.classList.add('selected');
    }
    
    function updateOrderSummary() {
      const price = calculatePrice();
      document.getElementById('basePrice').textContent = '¥' + price.original.toFixed(2);
      document.getElementById('ipPrice').textContent = '¥' + (price.original - (selectedDuration.basePrice + selectedDuration.pricePerIP)).toFixed(2);
      
      const discountRow = document.getElementById('discountRow');
      if (price.discount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discountAmount').textContent = '-¥' + price.discount.toFixed(2);
      } else {
        discountRow.style.display = 'none';
      }
      
      document.getElementById('totalPrice').textContent = '¥' + price.finalPrice.toFixed(2);
    }
    
    function handleSubscribe() {
      // 跳转到支付流程
      window.location.href = '/subscribe?duration=' + selectedDuration.days + '&ips=' + selectedIPs + '&payment=' + selectedPaymentMethod;
    }
    
    // FAQ Toggle
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        q.parentElement.classList.toggle('open');
      });
    });
    
    // Initialize
    renderDurationGrid();
    renderIPGrid();
    updateOrderSummary();
  </script>
</body>
</html>`;
