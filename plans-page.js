// 订阅计划页面HTML
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';

export const PLANS_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">订阅计划 - TV Live Service</title>
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
      margin-top: 80px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 60px 20px;
    }

    .plans-page-header {
      text-align: center;
      margin-bottom: 50px;
    }

    .plans-page-header h1 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #e50914 0%, #b81d24 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .plans-page-header p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 60px;
    }

    .plan-card {
      background: #141414;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 32px;
      position: relative;
      transition: all 0.3s ease;
    }

    .plan-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .plan-card.premium {
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.08) 0%, rgba(184, 29, 36, 0.08) 100%);
      border: 2px solid rgba(229, 9, 20, 0.3);
    }

    

    .plan-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .plan-badge.free {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
    }

    .plan-badge.premium {
      background: linear-gradient(135deg, #e50914 0%, #b81d24 100%);
      color: #fff;
    }

    .plan-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .plan-price {
      font-size: 40px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .plan-price .period {
      font-size: 15px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
    }

    .plan-description {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .plan-features {
      list-style: none;
      margin-bottom: 24px;
    }

    .plan-features li {
      display: flex;
      align-items: center;
      padding: 10px 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
    }

    .plan-features li.disabled {
      color: rgba(255, 255, 255, 0.4);
    }

    .plan-features li svg {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      flex-shrink: 0;
    }

    .plan-features li.enabled svg {
      color: #22c55e;
    }

    .plan-features li.disabled svg {
      color: rgba(255, 255, 255, 0.3);
    }

    .plan-button {
      display: block;
      width: 100%;
      padding: 14px 24px;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .plan-button.free {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .plan-button.free:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .plan-button.premium {
      background: linear-gradient(135deg, #e50914 0%, #b81d24 100%);
      color: #fff;
    }

    .plan-button.premium:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
    }

    .faq-section {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-section h2 {
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 30px;
    }

    .faq-item {
      background: #141414;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      margin-bottom: 12px;
      overflow: hidden;
    }

    .faq-question {
      padding: 16px 20px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.3s ease;
    }

    .faq-question:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .faq-question::after {
      content: '+';
      font-size: 20px;
      font-weight: 300;
      transition: transform 0.3s ease;
    }

    .faq-item.active .faq-question::after {
      transform: rotate(45deg);
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .faq-item.active .faq-answer {
      max-height: 200px;
    }

    .faq-answer-content {
      padding: 0 20px 16px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      line-height: 1.6;
    }

    @media (max-width: 900px) {
      .plans-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .main-content {
        margin-top: 70px;
      }

      .container {
        padding: 30px 15px;
      }

      .plans-page-header h1 {
        font-size: 28px;
      }

      .plans-page-header p {
        font-size: 14px;
      }

      .plans-grid {
        gap: 20px;
      }

      .plan-card {
        padding: 24px 20px;
      }

      .plan-price {
        font-size: 32px;
      }

      .faq-section h2 {
        font-size: 22px;
      }
    }

    @media (max-width: 480px) {
      .main-content {
        margin-top: 60px;
      }

      .container {
        padding: 20px 12px;
      }

      .plans-page-header {
        margin-bottom: 30px;
      }

      .plans-page-header h1 {
        font-size: 24px;
      }

      .plans-page-header p {
        font-size: 13px;
      }

      .plan-card {
        padding: 20px 16px;
      }

      .plan-badge {
        font-size: 11px;
        padding: 3px 10px;
      }

      .plan-name {
        font-size: 20px;
      }

      .plan-price {
        font-size: 28px;
      }

      .plan-price .period {
        font-size: 13px;
      }

      .plan-description {
        font-size: 13px;
      }

      .plan-features li {
        font-size: 13px;
      }

      .plan-features li svg {
        width: 16px;
        height: 16px;
      }

      .plan-button {
        padding: 12px 20px;
        font-size: 14px;
      }

      .faq-section h2 {
        font-size: 20px;
      }

      .faq-question {
        padding: 14px 16px;
        font-size: 14px;
      }

      .faq-answer-content {
        font-size: 13px;
      }
    }

      .plan-card {
        padding: 24px 20px;
      }

      .plan-price {
        font-size: 32px;
      }

      .faq-section h2 {
        font-size: 22px;
      }
    }

    @media (max-width: 480px) {
      .main-content {
        margin-top: 60px;
      }

      .container {
        padding: 20px 12px;
      }

      .plans-page-header {
        margin-bottom: 30px;
      }

      .plans-page-header h1 {
        font-size: 24px;
      }

      .plans-page-header p {
        font-size: 13px;
      }

      .plan-card {
        padding: 20px 16px;
      }

      .plan-badge {
        font-size: 11px;
        padding: 3px 10px;
      }

      .plan-name {
        font-size: 20px;
      }

      .plan-price {
        font-size: 28px;
      }

      .plan-price .period {
        font-size: 13px;
      }

      .plan-description {
        font-size: 13px;
      }

      .plan-features li {
        font-size: 13px;
      }

      .plan-features li svg {
        width: 16px;
        height: 16px;
      }

      .plan-button {
        padding: 12px 20px;
        font-size: 14px;
      }

      .faq-section h2 {
        font-size: 20px;
      }

      .faq-question {
        padding: 14px 16px;
        font-size: 14px;
      }

      .faq-answer-content {
        font-size: 13px;
      }
    }

    @media (max-width: 480px) {
      body {
        padding-top: 50px;
      }

      .plans-page-header h1 {
        font-size: 24px;
      }

      .plan-card {
        padding: 20px 16px;
      }

      .plan-price {
        font-size: 28px;
      }

      .plan-features li {
        font-size: 13px;
      }
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}

  <main class="main-content">
    <div class="container">
      <div class="plans-page-header">
        <h1 data-i18n="headerTitle">选择最适合您的订阅计划</h1>
        <p data-i18n="headerDesc">免费试用或升级到会员，享受更优质的服务体验</p>
      </div>

      <div class="plans-grid">
        <!-- 免费计划 -->
        <div class="plan-card">
          <span class="plan-badge free" data-i18n="freeBadge">免费计划</span>
          <div class="plan-name" data-i18n="freeName">基础订阅</div>
          <div class="plan-price">
            Free<span class="period" data-i18n="freePeriod">/ 永久</span>
          </div>
          <p class="plan-description" data-i18n="freeDesc">适合轻度使用的用户，提供基础的直播频道访问权限</p>

          <ul class="plan-features">
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="freeFeature1">随机精选部分频道</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="freeFeature2">每日更新</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="freeFeature3">支持手机/平板/智能电视/电视盒子/投影仪/电脑播放</span>
            </li>
            <li class="disabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature4">1080P/4K 画质</span>
            </li>
            <li class="disabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature5">无广告</span>
            </li>
            <li class="disabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature6">无需签到</span>
            </li>
            <li class="disabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature7">支持多IP、多设备同时观看</span>
            </li>
          </ul>

          <a href="/freesub" class="plan-button free" data-i18n="freeButton">开始免费订阅</a>
        </div>

        <!-- 会员计划 -->
        <div class="plan-card premium">
          <span class="plan-badge premium" data-i18n="premiumBadge">会员计划</span>
          <div class="plan-name" data-i18n="premiumName">VIP 订阅</div>
          <div class="plan-price">
            ¥6.5<span class="period" data-i18n="premiumPeriod">/ 月</span>
          </div>
          <p class="plan-description" data-i18n="premiumDesc">解锁全部功能，享受极致的观看体验</p>

          <ul class="plan-features">
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature1">完整频道库</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature2">每日更新</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature3">支持手机/平板/智能电视/电视盒子/投影仪/电脑播放</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature4">1080P/4K 画质</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature5">无广告</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature6">无需签到</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature7">支持多IP、多设备同时观看</span>
            </li>
          </ul>

          <a href="/subscription" class="plan-button premium" data-i18n="premiumButton">立即订阅</a>
        </div>
      </div>

      <!-- FAQ -->
      <div class="faq-section">
        <h2 data-i18n="faqTitle">常见问题</h2>
        <div class="faq-item">
          <div class="faq-question" data-i18n="faq1">免费计划需要付费吗？</div>
          <div class="faq-answer">
            <div class="faq-answer-content" data-i18n="faq1Answer">免费计划完全免费，您只需要每天签到即可保持订阅有效。签到简单快速，只需几秒钟即可完成。</div>
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-question" data-i18n="faq2">VIP 订阅可以随时取消吗？</div>
          <div class="faq-answer">
            <div class="faq-answer-content" data-i18n="faq2Answer">是的，您可以随时取消订阅。取消后服务将在当前订阅期结束后停止，不会产生额外费用。</div>
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-question" data-i18n="faq3">如何升级到 VIP 订阅？</div>
          <div class="faq-answer">
            <div class="faq-answer-content" data-i18n="faq3Answer">点击上方"立即订阅"按钮，选择合适的套餐即可升级。支持多种支付方式，安全快捷。</div>
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-question" data-i18n="faq4">VIP 订阅支持哪些播放器？</div>
          <div class="faq-answer">
            <div class="faq-answer-content" data-i18n="faq4Answer">VIP 订阅支持主流 IPTV 播放器（如 APTV、Televizo、IPTV Smarters、TiviMate、KODI）、Web 播放器和专用 App，覆盖各种设备平台。</div>
          </div>
        </div>
      </div>
    </div>
  </main>

  ${PAGE_FOOTER}

  <script>
    // FAQ 展开/收起
    document.querySelectorAll('.faq-question').forEach(item => {
      item.addEventListener('click', () => {
        const parent = item.parentElement;
        parent.classList.toggle('active');
      });
    });

    // 智能语言检测 - 默认英文，简中才显示简中
    function detectBrowserLanguage() {
      const savedLang = localStorage.getItem('plans_lang');
      if (savedLang) return savedLang;

      const browserLang = navigator.language || navigator.userLanguage || 'en';
      return browserLang.startsWith('zh') && (browserLang.includes('CN') || browserLang === 'zh') ? 'zh-CN' : 'en';
    }

    // 翻译配置
    const translations = {
      'zh-CN': {
        'pageTitle': '订阅计划 - TV Live Service',
        'headerTitle': '选择最适合您的订阅计划',
        'headerDesc': '免费试用或升级到会员，享受更优质的服务体验',
        'freeBadge': '免费计划',
        'freeName': '基础订阅',
        'freePeriod': '/ 永久',
        'freeDesc': '适合轻度使用的用户，提供基础的直播频道访问权限',
        'premiumBadge': '会员计划',
        'premiumName': 'VIP 订阅',
        'premiumPeriod': '/ 月',
        'premiumDesc': '解锁全部功能，享受极致的观看体验',
        'freeButton': '开始免费订阅',
        'premiumButton': '立即订阅',
        'recommended': '推荐',
        'faqTitle': '常见问题',
        'faq1': '免费计划需要付费吗？',
        'faq1Answer': '免费计划完全免费，您只需要每天签到即可保持订阅有效。签到简单快速，只需几秒钟即可完成。',
        'faq2': 'VIP 订阅可以随时取消吗？',
        'faq2Answer': '是的，您可以随时取消订阅。取消后服务将在当前订阅期结束后停止，不会产生额外费用。',
        'faq3': '如何升级到 VIP 订阅？',
        'faq3Answer': '点击上方"立即订阅"按钮，选择合适的套餐即可升级。支持多种支付方式，安全快捷。',
        'faq4': 'VIP 订阅支持哪些播放器？',
        'faq4Answer': 'VIP 订阅支持主流 IPTV 播放器（如 APTV、Televizo、IPTV Smarters、TiviMate、KODI）、Web 播放器和专用 App，覆盖各种设备平台。',
        // Features
        'freeFeature1': '随机精选部分频道',
        'freeFeature2': '每日更新',
        'freeFeature3': '支持手机/平板/智能电视/电视盒子/投影仪/电脑播放',
        'vipFeature1': '完整频道库',
        'vipFeature2': '每日更新',
        'vipFeature3': '支持手机/平板/智能电视/电视盒子/投影仪/电脑播放',
        'vipFeature4': '1080P/4K 画质',
        'vipFeature5': '无广告',
        'vipFeature6': '无需签到',
        'vipFeature7': '支持多IP、多设备同时观看'
      },
      'en': {
        'pageTitle': 'Subscription Plans - TV Live Service',
        'headerTitle': 'Choose the plan that fits you',
        'headerDesc': 'Try for free or upgrade to premium for better experience',
        'freeBadge': 'Free Plan',
        'freeName': 'Basic',
        'freePeriod': '/ Forever',
        'freeDesc': 'Perfect for light users with basic channel access',
        'premiumBadge': 'Premium Plan',
        'premiumName': 'VIP Subscription',
        'premiumPeriod': '/ Month',
        'premiumDesc': 'Unlock all features and enjoy premium experience',
        'freeButton': 'Start Free',
        'premiumButton': 'Subscribe Now',
        'recommended': 'Recommended',
        'faqTitle': 'FAQ',
        'faq1': 'Is the free plan really free?',
        'faq1Answer': 'Yes, the free plan is completely free. You just need to sign in daily to keep your subscription active.',
        'faq2': 'Can I cancel VIP anytime?',
        'faq2Answer': 'Yes, you can cancel anytime. The service will continue until the end of your current billing period.',
        'faq3': 'How to upgrade to VIP?',
        'faq3Answer': 'Click "Subscribe Now" button and choose your plan. We support multiple secure payment methods.',
        'faq4': 'What players are supported?',
        'faq4Answer': 'VIP subscription supports major IPTV players (APTV, Televizo, IPTV Smarters, TiviMate, Kodi), web player and dedicated apps, covering various device platforms.',
        // Features
        'freeFeature1': 'Random selected channels',
        'freeFeature2': 'Daily updates',
        'freeFeature3': 'Supports mobile/tablet/smart TV/TV box/projector/computer',
        'vipFeature1': 'Full channel library',
        'vipFeature2': 'Daily updates',
        'vipFeature3': 'Supports mobile/tablet/smart TV/TV box/projector/computer',
        'vipFeature4': '1080P/4K quality',
        'vipFeature5': 'Ad-free',
        'vipFeature6': 'No check-in required',
        'vipFeature7': 'Supports multi-IP and multi-device viewing'
      }
    };

    // 初始化语言
    let currentLang = detectBrowserLanguage();
    updateLanguage(currentLang);

    function updateLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('plans_lang', lang);
      document.documentElement.lang = lang;
      document.title = translations[lang]['pageTitle'];

      // 更新所有带 data-i18n 属性的元素
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
          el.textContent = translations[lang][key];
        }
      });
    }
  </script>
</body>
</html>`;
