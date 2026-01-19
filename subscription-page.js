// 订阅支付页面HTML
export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">订阅购买 - TV Live Service</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0a;
      min-height: 100vh;
      padding: 15px;
      color: #fff;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .header p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }

    .lang-switch {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
    }

    .lang-dropdown {
      position: relative;
      display: inline-block;
    }

    .lang-btn {
      background: #e50914;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
      -webkit-tap-highlight-color: transparent;
    }

    .lang-btn:hover {
      background: #f7262c;
    }

    .lang-btn:after {
      content: "▼";
      font-size: 9px;
    }

    .lang-menu {
      display: none;
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: #1a1a1a;
      backdrop-filter: blur(10px);
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      min-width: 120px;
      overflow: hidden;
      animation: fadeIn 0.2s ease;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .lang-menu.show {
      display: block;
    }

    .lang-menu button {
      display: block;
      width: 100%;
      padding: 10px 16px;
      background: none;
      border: none;
      text-align: left;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: background 0.2s;
    }

    .lang-menu button:hover {
      background: rgba(229, 9, 20, 0.15);
    }

    .lang-menu button.active {
      background: #e50914;
      color: white;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .plans-container {
      background: #141414;
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px;
      margin-bottom: 40px;
    }

    .selection-section {
      margin-bottom: 30px;
    }

    .selection-label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 15px;
      display: block;
    }

    .option-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .option-card {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      position: relative;
    }

    .option-card:hover {
      border-color: rgba(229, 9, 20, 0.5);
      background: rgba(229, 9, 20, 0.05);
    }

    .option-card.selected {
      border-color: #e50914;
      background: rgba(229, 9, 20, 0.15);
      box-shadow: 0 0 20px rgba(229, 9, 20, 0.2);
    }

    .option-card.selected::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 8px;
      color: #e50914;
      font-size: 16px;
      font-weight: bold;
    }

    .option-title {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }

    .option-subtitle {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
    }

    .option-price {
      font-size: 24px;
      font-weight: 700;
      color: #e50914;
      margin: 10px 0 5px;
    }

    .option-discount {
      display: inline-block;
      background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
      color: white;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 700;
    }

    .payment-summary {
      background: rgba(229, 9, 20, 0.1);
      border: 2px solid #e50914;
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 30px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .summary-row:last-child {
      border-bottom: none;
    }

    .summary-label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
    }

    .summary-value {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }

    .total-row {
      background: rgba(229, 9, 20, 0.2);
      border-radius: 10px;
      padding: 20px;
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-label {
      color: #fff;
      font-size: 18px;
      font-weight: 700;
    }

    .total-price {
      font-size: 36px;
      font-weight: 700;
      color: #e50914;
    }

    .ip-selector {
      margin-bottom: 20px;
    }

    .ip-selector label {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .ip-selector select {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .ip-selector select:focus {
      outline: none;
      border-color: #e50914;
    }

    .payment-section {
      background: #141414;
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px;
      text-align: center;
    }

    .paypal-button {
      background: linear-gradient(135deg, #0070ba 0%, #005ea6 100%);
      color: white;
      border: none;
      padding: 16px 40px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      -webkit-tap-highlight-color: transparent;
    }

    .paypal-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 112, 186, 0.4);
    }

    .paypal-button:active {
      transform: translateY(0);
    }

    .paypal-button:disabled {
      background: rgba(0, 112, 186, 0.3);
      cursor: not-allowed;
      transform: none;
    }

    .paypal-icon {
      width: 24px;
      height: 24px;
    }

    .test-section {
      background: rgba(255, 204, 0, 0.1);
      border: 1px solid rgba(255, 204, 0, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin-top: 30px;
    }

    .test-section h3 {
      color: #ffcc00;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .test-button {
      background: rgba(255, 204, 0, 0.2);
      color: #ffcc00;
      border: 1px solid rgba(255, 204, 0, 0.4);
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
      -webkit-tap-highlight-color: transparent;
    }

    .test-button:hover {
      background: rgba(255, 204, 0, 0.3);
    }

    .success-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }

    .success-modal.show {
      display: flex;
    }

    .success-content {
      background: #141414;
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px;
      max-width: 400px;
      text-align: center;
      border: 2px solid #34c759;
      box-shadow: 0 20px 60px rgba(52, 199, 89, 0.3);
    }

    .success-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }

    .success-title {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }

    .success-message {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .code-display {
      background: rgba(229, 9, 20, 0.1);
      border: 2px solid #e50914;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 15px;
      font-family: 'Courier New', monospace;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .copy-button {
      background: #e50914;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
      -webkit-tap-highlight-color: transparent;
    }

    .copy-button:hover {
      background: #f7262c;
    }

    .close-button {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 12px 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
      -webkit-tap-highlight-color: transparent;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .loading {
      display: none;
      text-align: center;
      padding: 40px;
    }

    .loading.show {
      display: block;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #e50914;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      background: rgba(255, 59, 48, 0.15);
      border: 1px solid rgba(255, 59, 48, 0.3);
      border-radius: 10px;
      padding: 15px;
      margin: 20px auto;
      max-width: 400px;
      text-align: center;
      color: #ff3b30;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .plans-container {
        padding: 15px;
      }

      .option-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .option-card {
        padding: 15px;
      }

      .option-title {
        font-size: 14px;
      }

      .option-price {
        font-size: 20px;
      }

      .payment-summary {
        padding: 15px;
      }

      .summary-row {
        padding: 10px 0;
      }

      .total-row {
        padding: 15px;
      }

      .total-price {
        font-size: 28px;
      }

      .container {
        padding: 15px 10px;
      }

      .header h1 {
        font-size: 24px;
      }

      .paypal-button {
        padding: 14px 30px;
        font-size: 15px;
      }

      .lang-switch {
        top: 15px;
        right: 15px;
      }

      .lang-btn {
        padding: 6px 14px;
        font-size: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="lang-switch">
    <div class="lang-dropdown">
      <button class="lang-btn" onclick="toggleLangMenu()" id="currentLangBtn">简体</button>
      <div class="lang-menu" id="langMenu">
        <button onclick="setLanguage('en')" id="langEn">English</button>
        <button onclick="setLanguage('zh-CN')" id="langZh">简体中文</button>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="header">
      <h1 data-i18n="title">🎫 订阅购买</h1>
      <p data-i18n="subtitle">选择适合您的订阅套餐，享受高清直播服务</p>
    </div>

    <div id="plansContainer" class="plans-container">
      <!-- 时长和IP选择器将通过JS动态生成 -->
    </div>

    <div class="payment-summary" id="paymentSummary">
      <!-- 价格汇总将通过JS动态生成 -->
    </div>

    <div class="payment-section">
      <button class="paypal-button" id="payButton" onclick="processPayment()">
        <svg class="paypal-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.7.7 0 0 1-.693-.592L0 4.528A.702.702 0 0 1 .693 3.75H6.93c.44 0 .813.3.915.713L8.85 11h6.272c2.947 0 5.354-1.938 5.976-4.715l.268-1.218a.702.702 0 0 1 .683-.552h3.744a.702.702 0 0 1 .683.862l-.267 1.218C25.814 9.78 22.528 12.75 18.625 12.75H11.5l-1.325 6a.702.702 0 0 1-.683.552H7.076z"/>
        </svg>
        <span data-i18n="payWithPayPal">使用 PayPal 支付</span>
      </button>
    </div>

    <div class="test-section">
      <h3 data-i18n="testMode">🧪 测试模式</h3>
      <button class="test-button" id="testButton" onclick="testPayment()" data-i18n="testPayment">模拟支付成功</button>
    </div>

    <div id="loading" class="loading">
      <div class="spinner"></div>
      <p data-i18n="processing">处理中...</p>
    </div>

    <div id="errorMessage" class="error-message" style="display: none;"></div>
  </div>

  <div id="successModal" class="success-modal">
    <div class="success-content">
      <div class="success-icon">🎉</div>
      <h2 class="success-title" data-i18n="paymentSuccess">支付成功！</h2>
      <p class="success-message" data-i18n="codeGenerated">您的订阅卡密已生成</p>
      <div class="code-display" id="generatedCode">-</div>
      <button class="copy-button" onclick="copyCode()" data-i18n="copyCode">复制卡密</button>
      <br><br>
      <button class="close-button" onclick="closeModal()" data-i18n="goToActivate">前往激活页面</button>
    </div>
  </div>

  <script>
    const API_BASE = '/api';

    // 智能判断浏览器语言
    function detectBrowserLanguage() {
      const savedLang = localStorage.getItem('subscription_lang');
      if (savedLang) return savedLang;

      const browserLang = navigator.language || navigator.userLanguage || 'en';
      return browserLang.startsWith('zh') && (browserLang.includes('CN') || browserLang === 'zh') ? 'zh-CN' : 'en';
    }

    let currentLang = detectBrowserLanguage();
    let selectedDuration = null;
    let selectedIPs = 3;

    // 时长配置
    const durationOptions = [
      { days: 30, basePrice: 5, pricePerIP: 1.5, discount: 0, name: 'month_1' },
      { days: 90, basePrice: 12, pricePerIP: 2.5, discount: 0, name: 'month_3' },
      { days: 180, basePrice: 20, pricePerIP: 4, discount: 10, name: 'month_6' },
      { days: 365, basePrice: 35, pricePerIP: 7, discount: 20, name: 'month_12' }
    ];

    // IP数量配置
    const ipOptions = [1, 2, 3, 5];

    // 初始化默认选择
    selectedDuration = durationOptions[2];

    // 通用功能特性
    const commonFeatures = [
      { icon: '✓', name: 'feature', label: 'feature_hd_quality' },
      { icon: '✓', name: 'feature', label: 'feature_multi_device' }
    ];

    // 多语言翻译
    const translations = {
      'zh-CN': {
        pageTitle: '订阅购买 - 电视直播服务',
        title: '🎫 订阅购买',
        subtitle: '选择适合您的订阅套餐，享受高清直播服务',
        selectIPs: '选择IP数量',
        payWithPayPal: '使用 PayPal 支付',
        testMode: '🧪 测试模式',
        testPayment: '模拟支付成功',
        processing: '处理中...',
        paymentSuccess: '支付成功！',
        codeGenerated: '您的订阅卡密已生成',
        copyCode: '复制卡密',
        goToActivate: '前往激活页面',
        loginNow: '立即登录',
        loginHint: '请先登录以完成支付',
        feature_hd_quality: 'HD 高清画质',
        feature_multi_device: '多设备同时观看',
        feature_cloud_recording: '云录制功能',
        feature_24_7_support: '24/7 技术支持',
        selectDuration: '选择订阅时长',
        selectIPs: '选择IP数量',
        summary: '订单汇总',
        basePrice: '基础价格',
        ipPrice: 'IP费用',
        discount: '折扣',
        total: '总计',
        ipCount: 'IP数量',
        planNames: {
          'month_1': '1个月',
          'month_3': '3个月',
          'month_6': '半年',
          'month_12': '1年'
        },
        error: {
          notLoggedIn: '请先登录账户',
          paymentError: '支付失败，请重试',
          networkError: '网络错误，请稍后重试',
          selectPlan: '请选择一个套餐'
        }
      },
      'en': {
        pageTitle: 'Subscription Purchase - TV Live Service',
        title: '🎫 Subscribe',
        subtitle: 'Choose the plan that suits you, enjoy HD live streaming',
        selectIPs: 'Select IP Count',
        payWithPayPal: 'Pay with PayPal',
        testMode: '🧪 Test Mode',
        testPayment: 'Simulate Successful Payment',
        processing: 'Processing...',
        paymentSuccess: 'Payment Successful!',
        codeGenerated: 'Your subscription code has been generated',
        copyCode: 'Copy Code',
        goToActivate: 'Go to Activation Page',
        loginNow: 'Login Now',
        loginHint: 'Please login to complete payment',
        feature_hd_quality: 'HD Quality',
        feature_multi_device: 'Multi-device Support',
        feature_cloud_recording: 'Cloud Recording',
        feature_24_7_support: '24/7 Support',
        selectDuration: 'Select Subscription Duration',
        selectIPs: 'Select IP Count',
        summary: 'Order Summary',
        basePrice: 'Base Price',
        ipPrice: 'IP Price',
        discount: 'Discount',
        total: 'Total',
        ipCount: 'IP Count',
        planNames: {
          'month_1': '1 Month',
          'month_3': '3 Months',
          'month_6': '6 Months',
          'month_12': '1 Year'
        },
        error: {
          notLoggedIn: 'Please login first',
          paymentError: 'Payment failed, please try again',
          networkError: 'Network error, please try again later',
          selectPlan: 'Please select a plan'
        }
      }
    };

    function t(key) {
      return translations[currentLang][key] || translations['en'][key] || key;
    }

    function formatPrice(price, currency = 'USD') {
      return \`\${currency} \${price.toFixed(2)}\`;
    }

    function calculatePrice(plan, ipCount) {
      const price = plan.basePrice + (plan.pricePerIP * ipCount);
      const discountedPrice = price * (1 - plan.discount / 100);
      return {
        original: price,
        discounted: discountedPrice,
        discount: plan.discount
      };
    }

    function renderPlans() {
      const container = document.getElementById('plansContainer');
      let html = '';

      // 时长选择器
      html += '<div class="selection-section">';
      html += '<span class="selection-label">' + t('selectDuration') + '</span>';
      html += '<div class="option-grid">';
      durationOptions.forEach(duration => {
        const price = calculatePrice(duration, selectedIPs);
        const isSelected = selectedDuration.name === duration.name;
        html += '<div class="option-card ' + (isSelected ? 'selected' : '') + '" onclick="selectDuration(' + "'" + duration.name + "'" + ')">';
        html += '<div class="option-title">' + t('planNames')[duration.name] + '</div>';
        html += '<div class="option-subtitle">' + duration.days + ' ' + (currentLang === 'zh-CN' ? '天' : 'days') + '</div>';
        html += '<div class="option-price">$' + price.discounted.toFixed(2) + '</div>';
        if (duration.discount > 0) {
          html += '<div class="option-discount">-' + duration.discount + '%</div>';
        }
        html += '</div>';
      });
      html += '</div></div>';

      // IP选择器
      html += '<div class="selection-section">';
      html += '<span class="selection-label">' + t('selectIPs') + '</span>';
      html += '<div class="option-grid">';
      ipOptions.forEach(ip => {
        const isSelected = selectedIPs === ip;
        html += '<div class="option-card ' + (isSelected ? 'selected' : '') + '" onclick="selectIP(' + ip + ')">';
        html += '<div class="option-title">' + ip + ' IP' + (ip > 1 ? 's' : '') + '</div>';
        html += '</div>';
      });
      html += '</div></div>';

      container.innerHTML = html;

      // 渲染价格汇总
      renderPaymentSummary();
    }

    function renderPaymentSummary() {
      const summaryEl = document.getElementById('paymentSummary');
      const price = calculatePrice(selectedDuration, selectedIPs);

      let html = '<h3 style="color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 20px;">' + t('summary') + '</h3>';

      // 基础价格
      html += '<div class="summary-row">';
      html += '<span class="summary-label">' + t('basePrice') + ' (' + selectedDuration.days + ' ' + (currentLang === 'zh-CN' ? '天' : 'days') + ')</span>';
      html += '<span class="summary-value">$' + selectedDuration.basePrice.toFixed(2) + '</span>';
      html += '</div>';

      // IP费用
      html += '<div class="summary-row">';
      html += '<span class="summary-label">' + t('ipPrice') + ' (' + selectedIPs + ' IP)</span>';
      html += '<span class="summary-value">$' + (selectedDuration.pricePerIP * selectedIPs).toFixed(2) + '</span>';
      html += '</div>';

      // 折扣
      if (selectedDuration.discount > 0) {
        const discountAmount = price.original - price.discounted;
        html += '<div class="summary-row">';
        html += '<span class="summary-label" style="color: #ffcc00;">' + t('discount') + ' (' + selectedDuration.discount + '%)</span>';
        html += '<span class="summary-value" style="color: #ffcc00;">-$' + discountAmount.toFixed(2) + '</span>';
        html += '</div>';
      }

      // 总计
      html += '<div class="total-row">';
      html += '<span class="total-label">' + t('total') + '</span>';
      html += '<span class="total-price">$' + price.discounted.toFixed(2) + '</span>';
      html += '</div>';

      summaryEl.innerHTML = html;
    }

    function selectDuration(durationName) {
      selectedDuration = durationOptions.find(d => d.name === durationName);
      renderPlans();
    }

    function selectIP(ipCount) {
      selectedIPs = ipCount;
      renderPlans();
    }

    function getToken() {
      return localStorage.getItem('auth_token');
    }

    function isLoggedIn() {
      return !!getToken();
    }

    async function processPayment() {
      if (!selectedDuration) {
        showError(t('error').selectPlan);
        return;
      }

      if (!isLoggedIn()) {
        // 显示登录提示模态框
        showLoginModal();
        return;
      }

      showLoading(true);
      hideError();

      try {
        // 模拟 PayPal 支付流程
        await simulatePayPalPayment();

      } catch (error) {
        console.error('Payment error:', error);
        showError(t('error').paymentError);
        showLoading(false);
      }
    }

    async function testPayment() {
      if (!selectedPlan) {
        showError(t('error').selectPlan);
        return;
      }

      if (!isLoggedIn()) {
        // 显示登录提示模态框
        showLoginModal();
        return;
      }

      showLoading(true);
      hideError();

      try {
        // 测试模式：直接生成卡密
        const response = await fetch(API_BASE + '/subscription/create-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({
            duration_days: selectedDuration.days,
            max_ips: selectedIPs,
            test_mode: true
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showSuccessModal(data.code);
        } else {
          showError(data.error || t('error').paymentError);
        }
      } catch (error) {
        console.error('Test payment error:', error);
        showError(t('error').networkError);
      } finally {
        showLoading(false);
      }
    }

    async function simulatePayPalPayment() {
      // 真实的 PayPal 支付流程
      const price = calculatePrice(selectedDuration, selectedIPs);

      // 这里应该集成真实的 PayPal SDK
      // const paypal = require('@paypal/checkout-server-sdk');
      // 实际支付流程：
      // 1. 创建 PayPal 订单
      // 2. 用户完成支付
      // 3. PayPal 回调通知服务器
      // 4. 服务器生成卡密

      // 模拟支付成功后的回调
      const response = await fetch(API_BASE + '/subscription/create-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({
          duration_days: plan.days,
          max_ips: selectedIPs,
          payment_id: 'paypal_' + Date.now(),
          amount: price.discounted
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccessModal(data.code);
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    }

    function showLoading(show) {
      document.getElementById('loading').classList.toggle('show', show);
      document.getElementById('payButton').disabled = show;
      document.getElementById('testButton').disabled = show;
    }

    function showError(message) {
      const errorEl = document.getElementById('errorMessage');
      errorEl.textContent = message;
      errorEl.style.display = 'block';

      setTimeout(() => {
        errorEl.style.display = 'none';
      }, 5000);
    }

    function hideError() {
      document.getElementById('errorMessage').style.display = 'none';
    }

    function showLoginModal() {
      const modal = document.createElement('div');
      modal.id = 'loginModal';
      Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      });
      modal.innerHTML = '<div style="background: #141414; border-radius: 20px; padding: 40px; max-width: 400px; text-align: center; border: 2px solid #e50914; box-shadow: 0 20px 60px rgba(229, 9, 20, 0.3);"><div style="font-size: 48px; margin-bottom: 20px;">🔐</div><h2 style="font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 10px;">' + t('error').notLoggedIn + '</h2><p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin-bottom: 30px; line-height: 1.6;">' + t('loginHint') + '</p><button onclick="window.location.href=\\"/account\\"" style="background: #e50914; color: white; border: none; padding: 16px 40px; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.2s;">' + t('loginNow') + '</button><button onclick="document.getElementById(\\'loginModal\\').remove()" style="background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); padding: 16px 30px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 600; margin-top: 15px; transition: all 0.2s;">' + (currentLang === 'zh-CN' ? '稍后登录' : 'Login Later') + '</button></div>';
      document.body.appendChild(modal);
    }

    function showSuccessModal(code) {
      document.getElementById('generatedCode').textContent = code;
      document.getElementById('successModal').classList.add('show');
    }

    function closeModal() {
      document.getElementById('successModal').classList.remove('show');
      window.location.href = '/activate';
    }

    function copyCode() {
      const code = document.getElementById('generatedCode').textContent;
      navigator.clipboard.writeText(code).then(() => {
        alert('Code copied!');
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    }

    function toggleLangMenu() {
      document.getElementById('langMenu').classList.toggle('show');
    }

    function setLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('subscription_lang', lang);

      document.getElementById('langEn').classList.toggle('active', lang === 'en');
      document.getElementById('langZh').classList.toggle('active', lang === 'zh-CN');
      document.getElementById('currentLangBtn').textContent = lang === 'en' ? 'EN' : '简体';
      document.getElementById('langMenu').classList.remove('show');
      document.documentElement.lang = lang;

      document.title = t('pageTitle');
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
      });

      renderPlans();
    }

    // 立即执行语言设置
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setLanguage(currentLang));
    } else {
      setLanguage(currentLang);
    }

    // 页面加载时直接渲染套餐,不检查登录状态
    document.addEventListener('DOMContentLoaded', () => {
      renderPlans();
    });
  </script>
</body>
</html>`;
