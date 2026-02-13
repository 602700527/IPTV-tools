// 免费订阅页面HTML
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';

export const FREE_SUB_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">免费订阅 - TV Live Service</title>

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2205598928191137"
          crossorigin="anonymous"></script>

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
      color: #fff;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      width: 100%;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
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

    .notice {
      background: rgba(255, 204, 0, 0.15);
      border: 2px solid rgba(255, 204, 0, 0.3);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 30px;
    }

    .notice-icon {
      font-size: 16px;
      margin-right: 8px;
    }

    .notice-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .notice-text {
      color: #ffcc00;
      font-size: 14px;
      flex: 1;
    }

    .notice-text strong {
      font-weight: 600;
    }

    .card {
      background: #141414;
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px;
      margin-bottom: 30px;
    }

    .card h2 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 20px;
    }

    .subscription-id {
      font-size: 20px;
      font-weight: 700;
      color: #e50914;
      text-align: center;
      margin-bottom: 15px;
      word-break: break-all;
    }

    .subscription-url {
      font-family: 'Courier New', monospace;
      background: rgba(229, 9, 20, 0.1);
      border: 2px solid rgba(229, 9, 20, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin: 15px 0;
      word-break: break-all;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 25px;
    }

    .status-item {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 20px 15px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .status-value {
      font-size: 28px;
      font-weight: 700;
      color: #e50914;
      margin-bottom: 5px;
    }

    .status-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    .features {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 20px;
      margin-top: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .feature-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      line-height: 1.6;
    }

    .feature-item::before {
      content: '✓';
      color: #34c759;
      font-weight: 700;
      margin-right: 12px;
      font-size: 16px;
    }

    .checkin-section {
      margin-bottom: 20px;
    }

    .checkin-section h2 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 15px;
    }

    .checkin-desc {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin-bottom: 20px;
      text-align: center;
    }

    .captcha-container {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 20px;
    }

    .captcha-input {
      flex: 1;
      padding: 14px 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      font-size: 16px;
      text-align: center;
      letter-spacing: 2px;
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      transition: all 0.3s ease;
      flex-shrink: 1;
    }

    .captcha-input:focus {
      outline: none;
      border-color: #e50914;
      background: rgba(255, 255, 255, 0.1);
    }

    .captcha-canvas {
      width: 100px;
      height: 44px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.05);
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .captcha-canvas:hover {
      border-color: rgba(229, 9, 20, 0.5);
      background: rgba(229, 9, 20, 0.1);
    }

    .checkin-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #e50914 0%, #b81d24 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 14px rgba(229, 9, 20, 0.3);
    }

    .checkin-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
    }

    .checkin-btn:active {
      transform: translateY(0);
      scale: 0.98;
    }

    .checkin-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .message {
      padding: 14px 18px;
      border-radius: 10px;
      margin-top: 15px;
      font-size: 14px;
      display: none;
    }

    .message.success {
      background: rgba(52, 199, 89, 0.15);
      border: 1px solid rgba(52, 199, 89, 0.3);
      color: #34c759;
      display: block;
    }

    .message.error {
      background: rgba(255, 59, 48, 0.15);
      border: 1px solid rgba(255, 59, 48, 0.3);
      color: #ff3b30;
      display: block;
    }

    .copy-btn {
      width: 100%;
      background: #e50914;
      color: white;
      border: none;
      padding: 14px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: all 0.3s ease;
      margin-top: 15px;
    }

    .copy-btn:hover {
      background: #f7262c;
      transform: translateY(-2px);
    }

    .copy-btn:active {
      transform: translateY(0);
      scale: 0.98;
    }

    .loading {
      display: none;
      text-align: center;
      padding: 20px;
    }

    .loading.active {
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

    /* 广告位样式 */
    .ad-wrapper {
      display: flex;
      justify-content: center;
      padding: 20px 0;
      min-height: 90px;
    }

    .ad-ins {
      display: block;
      width: 100%;
      max-width: 300px;
      min-height: 90px;
    }

    ins.adsbygoogle {
      display: block !important;
    }

    body {
      padding-top: 70px !important;
    }

    @media (max-width: 768px) {
      .container {
        padding: 30px 15px;
      }

      .header h1 {
        font-size: 24px;
      }

      .status-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .status-value {
        font-size: 24px;
      }

      .card {
        padding: 20px;
      }

      .captcha-canvas {
        width: 90px;
      }

      .checkin-btn {
        padding: 14px;
        font-size: 15px;
      }

      body {
        padding-top: 60px !important;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 20px 10px;
      }

      .header h1 {
        font-size: 20px;
      }

      .header p {
        font-size: 12px;
      }

      .notice {
        padding: 12px 15px;
      }

      .notice-content {
        flex-direction: column;
        gap: 10px;
      }

      .card {
        padding: 15px;
      }

      .subscription-id {
        font-size: 18px;
      }

      .subscription-url {
        font-size: 12px;
        padding: 12px;
      }

      .status-value {
        font-size: 20px;
      }

      .captcha-container {
        gap: 10px;
      }

      .captcha-input {
        padding: 12px 14px;
        font-size: 14px;
        letter-spacing: 1px;
      }

      .checkin-btn {
        padding: 13px;
        font-size: 14px;
      }

      .copy-btn {
        padding: 12px;
        font-size: 14px;
      }

      .features {
        padding: 15px;
      }

      .feature-item {
        font-size: 13px;
      }

      body {
        padding-top: 50px !important;
      }
    }
  </style>
  
  <!-- Translate.js 自动翻译 -->
  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    // 等待 translate.js 加载完成后初始化
    function initTranslate() {
      console.log('translate:', typeof translate);
      console.log('window.translate:', typeof window.translate);
      
      // 手动将 translate 暴露到 window（兼容某些环境）
      if (typeof translate !== 'undefined' && !window.translate) {
        window.translate = translate;
      }
      
      if (typeof translate !== 'undefined' && translate.language) {
        translate.language.setLocal('chinese_simplified');
        translate.service.use('client.edge');
        translate.listener.start();
        translate.setAutoDiscriminateLocalLanguage();
        translate.execute();
        console.log('Translate.js initialized successfully');
      } else {
        console.log('Waiting for translate.js to load...');
        setTimeout(initTranslate, 100);
      }
    }
    
    // 页面加载完成后也尝试初始化
    window.addEventListener('load', initTranslate);
    initTranslate();
    
    // 语言切换函数
    function changeLanguage(lang) {
      var t = window.translate || translate;
      if (t && t.changeLanguage) {
        console.log('Changing language to:', lang);
        t.changeLanguage(lang);
      } else {
        console.error('Translate.js not loaded yet', {translate: typeof translate, windowTranslate: typeof window.translate});
      }
    }
  </script>
  ${PAGE_HEADER}
  <div class="main-content">
    <div class="container">
      <div class="header">
        <h1 data-i18n="title">🎁 免费订阅</h1>
        <p data-i18n="subtitle">每天随机精选频道，每日签到续期</p>
      </div>

      <div class="notice">
        <div class="notice-content">
          <span class="notice-icon">⚠️</span>
          <div class="notice-text">
            <strong data-i18n="noticeLabel">注意：</strong>
            <span data-i18n="noticeText">订阅地址与您的IP和浏览器绑定，请勿分享给他人使用</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 data-i18n="subscriptionInfo">📺 订阅信息</h2>
        <p class="subscription-id" id="subId" data-i18n="loading">加载中...</p>
        <p class="subscription-url" id="subUrl"></p>
        <button class="copy-btn" onclick="copySubscriptionUrl()" data-i18n="copyUrl">复制订阅地址</button>

        <div class="status-grid">
          <div class="status-item">
            <div class="status-value" id="daysLeft">-</div>
            <div class="status-label" data-i18n="daysLeftLabel">剩余天数</div>
          </div>
          <div class="status-item">
            <div class="status-value" id="consecutiveDays">-</div>
            <div class="status-label" data-i18n="consecutiveDaysLabel">连续签到</div>
          </div>
          <div class="status-item">
            <div class="status-value" id="channelCount" data-i18n="randomChannels">随机精选</div>
            <div class="status-label" data-i18n="channelCountLabel">频道数量</div>
          </div>
        </div>
      </div>

      <div class="card checkin-section">
        <h2 data-i18n="dailyCheckIn">📅 每日签到</h2>
        <p class="checkin-desc" data-i18n="checkInDesc">
          签到可延长订阅时长，连续签到有额外奖励！
        </p>
        <div class="captcha-container">
          <input type="text" class="captcha-input" id="captchaInput" data-i18n-placeholder="captchaPlaceholder" placeholder="输入验证码" maxlength="6">
          <canvas class="captcha-canvas" id="captchaCanvas" width="100" height="44" onclick="refreshCaptcha()"></canvas>
        </div>
        <button class="checkin-btn" id="checkInBtn" onclick="checkIn()" data-i18n="checkInNow">
          立即签到
        </button>
        <div class="message" id="message"></div>

        <div class="features">
          <div class="feature-item" data-i18n="feature1">首次签到有效期3天，每天签到+1天</div>
          <div class="feature-item" data-i18n="feature2">连续7天额外+2天</div>
          <div class="feature-item" data-i18n="feature3">连续30天额外+7天，最多累计30天</div>
        </div>
      </div>

      <!-- 广告位 -->
      <div class="ad-wrapper">
        <ins class="adsbygoogle ad-ins"
             style="display:block"
             data-ad-client="ca-pub-2205598928191137"
             data-ad-slot="9847284765"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  </div>
  ${PAGE_FOOTER}

  <script>
    // Google AdSense 初始化
    (adsbygoogle = window.adsbygoogle || []).push({});

    // 全局变量
    let subId = null;
    let fingerprint = null;
    let fingerprintComponents = null;
    let fpToken = null;  // 6位短Token
    let captchaCode = '';
    
    // 智能判断浏览器语言
    function detectBrowserLanguage() {
      const savedLang = localStorage.getItem('freesub_lang');
      if (savedLang) {
        return savedLang;
      }
      
      const browserLang = navigator.language || navigator.userLanguage || 'zh-CN';
      // 简体中文使用 zh-CN，其他语言使用英文
      return browserLang.startsWith('zh') && (browserLang.includes('CN') || browserLang === 'zh') ? 'zh-CN' : 'en';
    }

    let currentLang = detectBrowserLanguage();

    // 多语言翻译
    const translations = {
      'en': {
        pageTitle: 'Free Subscription - IPTV Live',
        title: '🎁 Free Subscription',
        subtitle: 'Daily selected channels, check in to extend',
        noticeLabel: 'Notice:',
        noticeText: 'Subscription URL is bound to your IP and browser, do not share with others',
        subscriptionInfo: '📺 Subscription Info',
        loading: 'Loading...',
        copyUrl: 'Copy Subscription URL',
        daysLeftLabel: 'Days Left',
        consecutiveDaysLabel: 'Check-in Streak',
        channelCountLabel: 'Channel Count',
        randomChannels: 'Random Selection',
        dailyCheckIn: '📅 Daily Check-in',
        checkInDesc: 'Check in to extend subscription, bonus rewards for consecutive days!',
        checkInNow: 'Check In Now',
        feature1: 'First check-in: 3 days, +1 day per check-in',
        feature2: '7-day streak: +2 bonus days',
        feature3: '30-day streak: +7 bonus days, max 30 days total',
        captchaPlaceholder: 'Enter code',
        checkInProgress: 'Checking in...',
        successCheckIn: 'Check-in successful! Got {days} day(s), streak: {streak}',
        alreadyCheckedIn: 'Already checked in today',
        enterCaptcha: 'Please enter verification code',
        captchaError: 'Invalid verification code',
        networkError: 'Network error, please try again later',
        fingerprintError: 'Fingerprint generation failed, please refresh page',
        copiedSuccess: 'Subscription URL copied to clipboard',
        copyFailed: 'Copy failed, please copy manually',
        days: ' days'
      },
      'zh-CN': {
        pageTitle: '免费订阅 - IPTV Live',
        title: '🎁 免费订阅',
        subtitle: '每天随机精选频道，每日签到续期',
        noticeLabel: '注意：',
        noticeText: '订阅地址与您的IP和浏览器绑定，请勿分享给他人使用',
        subscriptionInfo: '📺 订阅信息',
        loading: '加载中...',
        copyUrl: '复制订阅地址',
        daysLeftLabel: '剩余天数',
        consecutiveDaysLabel: '连续签到',
        channelCountLabel: '频道数量',
        randomChannels: '随机精选',
        dailyCheckIn: '📅 每日签到',
        checkInDesc: '签到可延长订阅时长，连续签到有额外奖励！',
        checkInNow: '立即签到',
        feature1: '首次签到有效期3天，每天签到+1天',
        feature2: '连续7天额外+2天',
        feature3: '连续30天额外+7天，最多累计30天',
        captchaPlaceholder: '输入验证码',
        checkInProgress: '签到中...',
        successCheckIn: '签到成功！获得{days}天，连续签到{streak}天',
        alreadyCheckedIn: '今日已签到',
        enterCaptcha: '请输入验证码',
        captchaError: '验证码错误',
        networkError: '网络错误，请稍后重试',
        fingerprintError: '指纹生成失败，请刷新页面重试',
        copiedSuccess: '订阅地址已复制到剪贴板',
        copyFailed: '复制失败，请手动复制',
        days: '天'
      }
    };

    function t(key) {
      return translations[currentLang][key] || translations['zh-CN'][key] || key;
    }

    // 设置页面标题
    document.title = translations[currentLang].title + ' - IPTV Live';

    // 页面加载时执行
    window.addEventListener('DOMContentLoaded', async () => {
      await generateFingerprint();
      await loadSubscription();
      refreshCaptcha();
    });

    // 生成指纹
    async function generateFingerprint() {
      try {
        fingerprintComponents = {
          screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
          },
          browser: {
            language: navigator.language,
            platform: navigator.platform,
            userAgent: navigator.userAgent.substring(0, 100)
          },
          timezone: {
            offset: new Date().getTimezoneOffset(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        };

        // 生成哈希
        let hashString;
        if (window.crypto && window.crypto.subtle) {
          // 优先使用 Web Crypto API (需要 HTTPS 或 localhost)
          const encoder = new TextEncoder();
          const data = encoder.encode(JSON.stringify(fingerprintComponents));
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          hashString = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
          // 降级方案：使用简单的哈希算法
          hashString = simpleHash(JSON.stringify(fingerprintComponents));
        }

        fingerprint = hashString;
        console.log('[generateFingerprint] Fingerprint generated:', fingerprint);
      } catch (error) {
        console.error('[generateFingerprint] 指纹生成失败:', error);
        // 降级使用简单哈希
        try {
          fingerprint = simpleHash(JSON.stringify(fingerprintComponents));
          console.log('[generateFingerprint] Using fallback hash:', fingerprint);
        } catch (fallbackError) {
          console.error('[generateFingerprint] 降级哈希也失败:', fallbackError);
          showMessage(t('fingerprintError'), 'error');
        }
      }
    }

    // 简单哈希函数（降级方案）
    function simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
      }
      // 转换为16进制字符串
      return Math.abs(hash).toString(16).padStart(32, '0');
    }

    // 加载订阅信息
    async function loadSubscription() {
      try {
        console.log('[loadSubscription] Request body:', {
          fingerprint: fingerprint,
          fingerprintComponents: fingerprintComponents
        });

        const response = await fetch('/api/freesub/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fingerprint: fingerprint,
            fingerprintComponents: fingerprintComponents
          })
        });

        const data = await response.json();

        console.log('[loadSubscription] API response:', data);

        if (data.success) {
          subId = data.subscription.subId;
          fpToken = data.subscription.fpToken;  // 保存短Token
          displaySubscription(data.subscription);
          await loadSubscriptionInfo();
        } else {
          showMessage(data.error || t('loading') + ' failed', 'error');
        }
      } catch (error) {
        console.error('[loadSubscription] 加载订阅失败:', error);
        showMessage(t('networkError'), 'error');
      }
    }

    // 显示订阅信息
    function displaySubscription(sub) {
      console.log('[displaySubscription] Received subscription data:', sub);

      document.getElementById('subId').textContent = sub.subId;

      // 优先使用 fpToken（6位短码），兼容旧版 fingerprint
      var fpValue = sub.fpToken || fingerprint;
      var fullUrl = window.location.origin + '/api/freesub/' + sub.subId + '.m3u?fp=' + fpValue;
      document.getElementById('subUrl').textContent = fullUrl;

      // 确保consecutiveDays有值
      const consecutiveDays = sub.consecutiveDays !== undefined ? sub.consecutiveDays : (sub.consecutive_days !== undefined ? sub.consecutive_days : 0);
      console.log('[displaySubscription] consecutiveDays value:', consecutiveDays, 'raw data:', sub);

      document.getElementById('consecutiveDays').textContent = consecutiveDays;

      // 计算剩余天数（修复Bug 1：显示负天数表示已过期）
      const expiredAt = new Date(sub.expiredAt);
      const now = new Date();
      const daysLeft = Math.ceil((expiredAt - now) / (1000 * 60 * 60 * 24));
      document.getElementById('daysLeft').textContent = daysLeft;

      // 修复Bug 1：如果订阅已过期，显示提示信息
      const daysLeftEl = document.getElementById('daysLeft');
      if (daysLeft < 0) {
        daysLeftEl.style.color = '#ff3b30'; // 红色表示已过期
        // 检查是否在过期后7天内，如果是，提示用户可以签到续期
        if (Math.abs(daysLeft) <= 7) {
          showMessage('订阅已过期，请签到续期（过期后7天内仍可签到）', 'error');
        } else {
          showMessage('订阅已过期超过7天，请重新获取订阅', 'error');
        }
      } else {
        daysLeftEl.style.color = '#e50914'; // 正常颜色
      }
    }

    // 加载订阅详细信息
    async function loadSubscriptionInfo() {
      try {
        const response = await fetch('/api/freesub/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subId: subId,
            fingerprint: fingerprint
          })
        });

        const data = await response.json();

        console.log('[loadSubscriptionInfo] API response:', data);

        if (data.success) {
          fpToken = data.subscription.fpToken;  // 保存短Token
          displaySubscription(data.subscription);
        }
      } catch (error) {
        console.error('加载订阅详情失败:', error);
      }
    }

    // 签到
    async function checkIn() {
      const captchaInput = document.getElementById('captchaInput');
      const captchaValue = captchaInput.value.trim().toUpperCase();

      // 验证验证码
      if (!captchaValue) {
        showMessage(t('enterCaptcha'), 'error');
        return;
      }

      if (captchaValue !== captchaCode) {
        showMessage(t('captchaError'), 'error');
        refreshCaptcha();
        return;
      }

      const btn = document.getElementById('checkInBtn');
      btn.disabled = true;
      btn.innerHTML = '<span class="loading"></span>' + t('checkInProgress');

      try {
        const response = await fetch('/api/freesub/checkin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subId: subId,
            fingerprint: fingerprint,
            captcha: captchaValue
          })
        });

        const data = await response.json();

        if (data.success) {
          showMessage(t('successCheckIn').replace('{days}', data.rewardDays).replace('{streak}', data.consecutiveDays), 'success');
          await loadSubscriptionInfo();
          refreshCaptcha();
        } else {
          showMessage(data.reason === 'already_checked_in' ? t('alreadyCheckedIn') : data.error || t('checkInProgress') + ' failed', 'error');
          if (data.reason === 'invalid_captcha') {
            refreshCaptcha();
          }
        }
      } catch (error) {
        console.error('签到失败:', error);
        showMessage(t('networkError'), 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = t('checkInNow');
      }
    }

    // 复制订阅地址
    function copySubscriptionUrl() {
      const url = document.getElementById('subUrl').textContent;

      navigator.clipboard.writeText(url).then(() => {
        showMessage(t('copiedSuccess'), 'success');
        console.log('[copySubscriptionUrl] Copied URL:', url);
      }).catch(() => {
        showMessage(t('copyFailed'), 'error');
      });
    }

    // 显示消息
    function showMessage(text, type) {
      const messageEl = document.getElementById('message');
      messageEl.textContent = text;
      messageEl.className = 'message ' + type;
      setTimeout(() => {
        messageEl.className = 'message';
      }, 5000);
    }

    // 刷新验证码
    function refreshCaptcha() {
      const canvas = document.getElementById('captchaCanvas');
      const ctx = canvas.getContext('2d');

      // 清空画布
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 只使用大写字母和数字，移除易混淆字符
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      captchaCode = '';
      for (let i = 0; i < 4; i++) {
        captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // 绘制验证码
      ctx.font = 'bold 22px Arial';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < captchaCode.length; i++) {
        // 使用深色高对比度颜色
        const colors = [
          '#1a1a1a', '#2d3748', '#1a365d', '#742a2a', '#1c4532', '#553c9a', '#744210', '#285e61'
        ];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        const x = 20 + i * 18;
        const y = 22;
        // 极小的旋转角度，几乎不旋转
        const angle = (Math.random() - 0.5) * 0.05;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(captchaCode[i], 0, 0);
        ctx.restore();
      }

      // 添加 5 条干扰线
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      // 添加少量弯曲干扰线
      for (let i = 0; i < 2; i++) {
        ctx.strokeStyle = 'rgba(180, 180, 180, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.bezierCurveTo(
          Math.random() * canvas.width, Math.random() * canvas.height,
          Math.random() * canvas.width, Math.random() * canvas.height,
          Math.random() * canvas.width, Math.random() * canvas.height
        );
        ctx.stroke();
      }

      // 添加干扰点
      for (let i = 0; i < 15; i++) {
        ctx.fillStyle = 'rgba(180, 180, 180, 0.5)';
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      // 清空输入框
      document.getElementById('captchaInput').value = '';
    }
  </script>
</body>
</html>
`;
