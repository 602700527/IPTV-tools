// 优化版订阅页面 - 营销导向设计
// 新增：免费vs VIP对比表、用户评价、更清晰的CTA

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
      --radius: 0;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    
    /* ========== Hero Section ========== */
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
    
    /* ========== Pricing Cards ========== */
    .pricing {
      padding: 60px 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .pricing-title {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 40px;
    }
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    .pricing-card {
      background: var(--bg-card);
      border: var(--border);
      padding: 32px 24px;
      text-align: center;
      position: relative;
      transition: transform 0.2s, border-color 0.2s;
    }
    .pricing-card:hover { transform: translateY(-4px); }
    .pricing-card.featured {
      border-color: var(--accent);
      box-shadow: 0 0 40px rgba(229,9,20,0.2);
    }
    .pricing-card.featured::before {
      content: '最受欢迎';
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--accent);
      color: #fff;
      padding: 4px 16px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .pricing-card-duration {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    .pricing-card-price {
      font-size: 2.8rem;
      font-weight: 900;
      color: var(--accent);
      margin-bottom: 4px;
    }
    .pricing-card-price span { font-size: 1rem; color: var(--text-muted); font-weight: 400; }
    .pricing-card-original {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-decoration: line-through;
      margin-bottom: 16px;
    }
    .pricing-card-save {
      display: inline-block;
      background: rgba(34,197,94,0.1);
      color: var(--success);
      padding: 4px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .pricing-card-features {
      list-style: none;
      margin-bottom: 24px;
      text-align: left;
    }
    .pricing-card-features li {
      padding: 8px 0;
      border-bottom: var(--border);
      font-size: 0.9rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pricing-card-features li:last-child { border-bottom: none; }
    .pricing-card-features .check { font-size: 1rem; }
    .pricing-card-btn {
      display: block;
      width: 100%;
      background: var(--accent);
      color: #fff;
      padding: 14px;
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.2s;
      border: none;
    }
    .pricing-card-btn:hover { background: var(--accent-hover); }
    .pricing-card-btn.secondary {
      background: transparent;
      border: 1px solid var(--accent);
      color: var(--accent);
    }
    .pricing-card-btn.secondary:hover { background: rgba(229,9,20,0.1); }
    
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
      align-items: center;
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
      transition: transform 0.2s, background 0.2s;
      border: none;
    }
    .final-cta-btn:hover { background: var(--accent-hover); transform: translateY(-2px); }
    .final-cta-guarantee {
      margin-top: 16px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    
    /* ========== Responsive ========== */
    @media (max-width: 768px) {
      .hero { padding: 60px 20px 40px; }
      .hero-stats { gap: 24px; }
      .comparison-table th, .comparison-table td { padding: 12px 8px; font-size: 0.85rem; }
      .pricing-grid { grid-template-columns: 1fr; }
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
    
    <!-- Pricing Cards -->
    <section class="pricing">
      <h2 class="pricing-title">选择您的会员方案</h2>
      <div class="pricing-grid">
        <!-- Monthly -->
        <div class="pricing-card">
          <div class="pricing-card-duration">月度会员</div>
          <div class="pricing-card-price">¥20<span>/月</span></div>
          <div class="pricing-card-original">原价 ¥40</div>
          <div class="pricing-card-save">立省 50%</div>
          <ul class="pricing-card-features">
            <li><span class="check">✓</span> 5000+ 直播频道</li>
            <li><span class="check">✓</span> 无广告观看</li>
            <li><span class="check">✓</span> 无限收藏</li>
            <li><span class="check">✓</span> 1台设备</li>
            <li><span class="check">✓</span> 7天无理由退款</li>
          </ul>
          <button class="pricing-card-btn secondary" onclick="selectPlan('monthly')">选择月度</button>
        </div>
        
        <!-- Quarterly -->
        <div class="pricing-card">
          <div class="pricing-card-duration">季度会员</div>
          <div class="pricing-card-price">¥45<span>/季</span></div>
          <div class="pricing-card-original">原价 ¥120</div>
          <div class="pricing-card-save">立省 62%</div>
          <ul class="pricing-card-features">
            <li><span class="check">✓</span> 5000+ 直播频道</li>
            <li><span class="check">✓</span> 无广告观看</li>
            <li><span class="check">✓</span> 无限收藏</li>
            <li><span class="check">✓</span> 2台设备</li>
            <li><span class="check">✓</span> 7天无理由退款</li>
          </ul>
          <button class="pricing-card-btn secondary" onclick="selectPlan('quarterly')">选择季度</button>
        </div>
        
        <!-- Yearly - Featured -->
        <div class="pricing-card featured">
          <div class="pricing-card-duration">年度会员</div>
          <div class="pricing-card-price">¥168<span>/年</span></div>
          <div class="pricing-card-original">原价 ¥480</div>
          <div class="pricing-card-save">立省 65%</div>
          <ul class="pricing-card-features">
            <li><span class="check">✓</span> 5000+ 直播频道</li>
            <li><span class="check">✓</span> 无广告观看</li>
            <li><span class="check">✓</span> 无限收藏</li>
            <li><span class="check">✓</span> 5台设备</li>
            <li><span class="check">✓</span> 优先客服支持</li>
            <li><span class="check">✓</span> 7天无理由退款</li>
          </ul>
          <button class="pricing-card-btn" onclick="selectPlan('yearly')">立即订阅</button>
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
        
        <div class="testimential-card">
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
        <div class="faq-answer">月度会员支持1台设备，季度会员支持2台，年度会员支持5台。多设备可以同时在线观看不同内容。</div>
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
    // FAQ Toggle
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        q.parentElement.classList.toggle('open');
      });
    });
    
    // Plan Selection
    function selectPlan(type) {
      const url = type === 'yearly' ? '/subscription?duration=yearly' : 
                  type === 'quarterly' ? '/subscription?duration=quarterly' : 
                  '/subscription?duration=monthly';
      window.location.href = url + '#checkout';
    }
  </script>
</body>
</html>`;
