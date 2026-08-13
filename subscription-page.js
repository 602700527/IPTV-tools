// 订阅页面 - 营销导向版
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
      --bg: #0a0a0a;
      --bg-card: #141414;
      --border: 1px solid rgba(255,255,255,0.08);
      --text: #fff;
      --text-secondary: rgba(255,255,255,0.6);
      --text-muted: rgba(255,255,255,0.4);
      --success: #22c55e;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    
    /* ========== 痛点场景 ========== */
    .pain-section {
      padding: 80px 20px;
      background: linear-gradient(180deg, rgba(229,9,20,0.08) 0%, transparent 100%);
      border-bottom: var(--border);
    }
    .container { max-width: 1000px; margin: 0 auto; }
    
    .pain-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 900;
      margin-bottom: 48px;
      line-height: 1.3;
    }
    .pain-title span { color: var(--accent); }
    
    .pain-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    .pain-card {
      background: var(--bg-card);
      border: var(--border);
      padding: 28px;
      border-radius: 0;
    }
    .pain-card-icon {
      font-size: 2rem;
      margin-bottom: 16px;
    }
    .pain-card-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .pain-card-text {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
    }
    
    /* ========== 解决方案 ========== */
    .solution-section {
      padding: 80px 20px;
    }
    .solution-header {
      text-align: center;
      margin-bottom: 48px;
    }
    .solution-badge {
      display: inline-block;
      background: var(--accent);
      color: #fff;
      padding: 6px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
    }
    .solution-title {
      font-size: 2.2rem;
      font-weight: 900;
      margin-bottom: 12px;
    }
    .solution-subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
    
    .solution-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }
    .solution-card {
      background: var(--bg-card);
      border: var(--border);
      padding: 24px;
      text-align: center;
    }
    .solution-card-icon {
      font-size: 2.5rem;
      margin-bottom: 16px;
    }
    .solution-card-title {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .solution-card-text {
      color: var(--text-secondary);
      font-size: 0.85rem;
      line-height: 1.5;
    }
    
    /* ========== 数据统计 ========== */
    .stats-section {
      padding: 60px 20px;
      background: rgba(229,9,20,0.05);
      border-top: var(--border);
      border-bottom: var(--border);
    }
    .stats-grid {
      display: flex;
      justify-content: center;
      gap: 64px;
      flex-wrap: wrap;
    }
    .stat-item { text-align: center; }
    .stat-value {
      font-size: 3rem;
      font-weight: 900;
      color: var(--accent);
      display: block;
    }
    .stat-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }
    
    /* ========== 对比表格 ========== */
    .comparison-section {
      padding: 80px 20px;
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
      max-width: 800px;
      margin: 0 auto;
    }
    .comparison-table th, .comparison-table td {
      padding: 14px 20px;
      text-align: center;
      border-bottom: var(--border);
    }
    .comparison-table th {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }
    .comparison-table th:first-child { text-align: left; color: var(--text-secondary); }
    .comparison-table th.vip { color: var(--accent); font-weight: 700; }
    .comparison-table td:first-child { text-align: left; }
    .comparison-table .check { color: var(--success); font-size: 1.1rem; }
    .comparison-table .cross { color: var(--text-muted); font-size: 1.1rem; }
    .comparison-table .highlight-cell { background: rgba(229,9,20,0.05); }
    
    /* ========== 用户评价 ========== */
    .testimonials-section {
      padding: 80px 20px;
      background: linear-gradient(180deg, transparent 0%, rgba(229,9,20,0.03) 50%, transparent 100%);
    }
    .testimonials-title {
      text-align: center;
      font-size: 1.6rem;
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
    .testimonial-stars { color: #f59e0b; font-size: 0.9rem; margin-bottom: 12px; }
    .testimonial-text { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }
    
    /* ========== 价格选择 ========== */
    .pricing-section {
      padding: 80px 20px;
    }
    .pricing-wrapper {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 32px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .pricing-left {
      background: transparent;
      border: var(--border);
      padding: 32px;
    }
    .pricing-header { margin-bottom: 24px; }
    .pricing-header h2 { font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
    .pricing-header p { color: var(--text-secondary); font-size: 0.9rem; }
    
    .selector-group { margin-bottom: 24px; }
    .selector-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .selector-bar {
      display: flex;
      background: transparent;
      border: var(--border);
      gap: 0;
    }
    .select-option {
      flex: 1;
      padding: 14px 8px;
      text-align: center;
      cursor: pointer;
      transition: background 0.2s;
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
      font-size: 1rem;
      display: block;
    }
    .select-option .label {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    .select-option.selected .label { color: rgba(255,255,255,0.8); }
    .select-option .price-tag {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: 4px;
    }
    .select-option.selected .price-tag { color: #fff; }
    .select-option .badge {
      position: absolute;
      top: -6px;
      right: 6px;
      background: var(--accent);
      color: #fff;
      font-size: 0.55rem;
      font-weight: 700;
      padding: 2px 6px;
    }
    
    /* Right: Order Card */
    .pricing-right {
      position: sticky;
      top: 80px;
      height: fit-content;
    }
    .order-card {
      background: transparent;
      border: 1px solid rgba(229, 9, 20, 0.3);
      padding: 24px;
    }
    .order-header {
      font-size: 1.1rem;
      font-weight: 800;
      margin-bottom: 16px;
    }
    .order-summary {
      background: transparent;
      border: 1px solid rgba(229, 9, 20, 0.15);
      padding: 16px;
      margin-bottom: 16px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 0.85rem;
    }
    .summary-row .label { color: var(--text-secondary); }
    .summary-row .value { font-weight: 600; }
    .summary-divider {
      height: 1px;
      background: var(--border);
      margin: 10px 0;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 4px;
    }
    .summary-total .label { font-size: 0.95rem; font-weight: 700; }
    .summary-total .price { font-size: 1.6rem; font-weight: 900; color: var(--accent); }
    
    .payment-methods-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .payment-methods-grid {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .payment-method-option {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background: transparent;
      border: var(--border);
      cursor: pointer;
      transition: border-color 0.2s;
      color: var(--text-secondary);
    }
    .payment-method-option:hover { border-color: var(--accent); }
    .payment-method-option.selected {
      border-color: var(--accent);
      background: rgba(229, 9, 20, 0.06);
    }
    .payment-method-option svg { width: 24px; height: 24px; }
    
    .cta-button {
      width: 100%;
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 14px;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
      transition: background 0.2s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .cta-button:hover { background: var(--accent-hover); }
    
    .trust-badges {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    /* ========== 最终CTA ========== */
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
      font-size: 1.1rem;
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
    
    /* ========== 响应式 ========== */
    @media (max-width: 900px) {
      .pricing-wrapper { grid-template-columns: 1fr; }
      .pricing-right { position: static; }
      .stats-grid { gap: 32px; }
    }
    @media (max-width: 768px) {
      .pain-title { font-size: 1.5rem; }
      .solution-title { font-size: 1.6rem; }
      .comparison-table th, .comparison-table td { padding: 10px 8px; font-size: 0.8rem; }
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  
  <main>
    <!-- 痛点场景 -->
    <section class="pain-section">
      <div class="container">
        <h2 class="pain-title">作为<span>海外华人</span>，你是不是也经常遇到这些烦恼？</h2>
        <div class="pain-grid">
          <div class="pain-card">
            <div class="pain-card-icon">😤</div>
            <h3 class="pain-card-title">想家时只能看录像</h3>
            <p class="pain-card-text">春节晚会、世界杯、新闻联播...错过就是错过，等录播永远不如实时观看有感觉。</p>
          </div>
          <div class="pain-card">
            <div class="pain-card-icon">💸</div>
            <h3 class="pain-card-title">找到的IPTV服务不稳定</h3>
            <p class="pain-card-text">买了便宜的订阅，看球赛关键时刻卡顿、断流，花钱买罪受。</p>
          </div>
          <div class="pain-card">
            <div class="pain-card-icon">🤯</div>
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
          <div class="solution-badge">我们的方案</div>
          <h2 class="solution-title">一个链接，解决所有问题</h2>
          <p class="solution-subtitle">无需复杂配置，一个播放列表搞定所有需求</p>
        </div>
        <div class="solution-grid">
          <div class="solution-card">
            <div class="solution-card-icon">📺</div>
            <h3 class="solution-card-title">5000+频道</h3>
            <p class="solution-card-text">央视、卫视、地方台、体育、电影全覆盖</p>
          </div>
          <div class="solution-card">
            <div class="solution-card-icon">⚡</div>
            <h3 class="solution-card-title">秒开不卡</h3>
            <p class="solution-card-text">CDN全球加速，海外访问依然流畅</p>
          </div>
          <div class="solution-card">
            <div class="solution-card-icon">🔧</div>
            <h3 class="solution-card-title">一键使用</h3>
            <p class="solution-card-text">把链接导入VLC/APTV/TVBox就能看</p>
          </div>
          <div class="solution-card">
            <div class="solution-card-icon">👨‍👩‍👧‍👦</div>
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
            <span class="stat-label">在线稳定</span>
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
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  安全支付
                </div>
                <div class="trust-item">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  即时开通
                </div>
                <div class="trust-item">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
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
