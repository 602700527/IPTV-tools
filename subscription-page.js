// 订阅页面 - 简洁版
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';
import { HEAD_SCRIPTS } from './components/head-scripts.js';

export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP会员 - IPTV搜索</title>
  <meta name="description" content="升级VIP享受5000+直播频道，无广告、无限收藏、云同步。">
  
  <style>
    :root {
      --accent: #e50914;
      --accent-hover: #f7262c;
      --bg: #0a0a0a;
      --border: 1px solid rgba(255,255,255,0.08);
      --text: #fff;
      --text-secondary: rgba(255,255,255,0.6);
      --text-muted: rgba(255,255,255,0.4);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    
    .hero {
      padding: 60px 20px 40px;
      text-align: center;
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
      margin-bottom: 16px;
    }
    .hero-title {
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 900;
      margin-bottom: 12px;
    }
    .hero-title span { color: var(--accent); }
    .hero-subtitle {
      font-size: 1rem;
      color: var(--text-secondary);
      max-width: 500px;
      margin: 0 auto;
    }
    
    .container { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
    
    .pricing-wrapper {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 32px;
    }
    
    /* Left: Selectors */
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
      padding: 0;
      gap: 0;
    }
    .select-option {
      flex: 1;
      padding: 12px 8px;
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
      gap: 24px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    @media (max-width: 800px) {
      .pricing-wrapper { grid-template-columns: 1fr; }
      .pricing-right { position: static; }
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  
  <main>
    <section class="hero">
      <div class="hero-badge">★ VIP会员</div>
      <h1 class="hero-title">解锁<span>终极</span>电视体验</h1>
      <p class="hero-subtitle">5000+直播频道 · 无广告 · 云同步 · 优先支持</p>
    </section>
    
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
                <span class="label">IP</span>
              </div>
              <div class="select-option" onclick="selectIP(2)">
                <span class="value">2</span>
                <span class="label">IPs</span>
              </div>
              <div class="select-option" onclick="selectIP(3)">
                <span class="value">3</span>
                <span class="label">IPs</span>
              </div>
              <div class="select-option" onclick="selectIP(5)">
                <span class="value">5</span>
                <span class="label">IPs</span>
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
