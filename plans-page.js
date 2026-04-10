// 订阅计划页面HTML
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';

export const PLANS_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">订阅计划 - TV Live Service</title>
  <meta name="description" content="查看TV Live Service订阅计划，价格实惠，付费方式多样。立即订阅畅享高清直播电视。">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://iptv-search.com/plans">
  <link rel="alternate" hreflang="zh-CN" href="https://iptv-search.com/plans">
  <link rel="alternate" hreflang="en" href="https://iptv-search.com/plans?lang=en">
  <link rel="alternate" hreflang="x-default" href="https://iptv-search.com/plans?lang=en">
  <meta property="og:title" content="订阅计划 - TV Live Service">
  <meta property="og:description" content="查看TV Live Service订阅计划，价格实惠，付费方式多样。立即订阅畅享高清直播电视。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com/plans">
  <meta property="og:image" content="https://iptv-search.com/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="TV Live Service">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="订阅计划 - TV Live Service">
  <meta name="twitter:description" content="查看TV Live Service订阅计划，价格实惠，付费方式多样。立即订阅畅享高清直播电视。">
  <meta name="twitter:image" content="https://iptv-search.com/og-homepage.png">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --bg-primary: #0a0a0a;
      --bg-secondary: #141414;
      --bg-card: #1a1a1a;
      --bg-hover: #252525;
      --text-primary: #ffffff;
      --text-secondary: rgba(255, 255, 255, 0.7);
      --text-muted: rgba(255, 255, 255, 0.6);
      --border: rgba(255, 255, 255, 0.1);
      --accent: #e50914;
    }

    [data-theme="light"] {
      --bg-primary: #f5f5f5;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      --bg-hover: #f0f0f0;
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: rgba(0, 0, 0, 0.08);
      --accent: #e50914;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg-primary);
      min-height: 100vh;
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .main-content {
      flex: 1;
      width: 100%;
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
      color: var(--text-secondary);
      font-size: 16px;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 60px;
    }

    .plan-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      position: relative;
      transition: all 0.3s ease;
    }

    .plan-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
      border-color: var(--accent);
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
      background: var(--bg-hover);
      color: var(--text-secondary);
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
      color: var(--text-muted);
    }

    .plan-description {
      color: var(--text-muted);
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
      color: var(--text-secondary);
      font-size: 14px;
    }

    .plan-features li.disabled {
      color: var(--text-muted);
      opacity: 0.6;
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
      color: var(--text-muted);
      opacity: 0.5;
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
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    .plan-button.free:hover {
      background: var(--border);
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
      background: var(--bg-card);
      border: 1px solid var(--border);
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
      background: var(--bg-hover);
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
      color: var(--text-secondary);
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
              <span data-i18n="vipFeature5">网站广告</span>
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
            ¥20<span class="period" data-i18n="premiumPeriod">/ 月 起</span>
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
              <span data-i18n="vipFeature4">Channels up to 4K quality (where available)</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature5">Ad-free subscription links</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature8">Website ad-free viewing</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature6">Auto-updates pushed to your player - no site login needed</span>
            </li>
            <li class="enabled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span data-i18n="vipFeature7">Multi-IP & multi-device support</span>
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
            <div class="faq-answer-content" data-i18n="faq1Answer">Free plan is completely free. Simply check in once every 7 days before expiration to keep your subscription active. Quick and easy.</div>
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
        <div class="faq-item">
          <div class="faq-question" data-i18n="faq5">Do I need to visit your site to get channel updates?</div>
          <div class="faq-answer">
            <div class="faq-answer-content" data-i18n="faq5Answer">No! Once subscribed, updates are pushed directly to your player - no need to visit our site or log in. New channels are added automatically. Just make sure your player has "auto-update playlist" or "auto-refresh subscription" enabled.</div>
          </div>
        </div>
      </div>
    </div>
  </main>

  ${PAGE_FOOTER}

  <script>
    // 主题初始化
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved ? saved === 'dark' : prefersDark;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    })();
    function updateThemeIcons(isDark) {
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = isDark ? 'none' : 'block';
        moon.style.display = isDark ? 'block' : 'none';
      }
    }

    // 主题切换
    document.getElementById('themeToggle')?.addEventListener('click', function() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = next === 'dark' ? 'none' : 'block';
        moon.style.display = next === 'dark' ? 'block' : 'none';
      }
    });

    // FAQ 展开/收起
    document.querySelectorAll('.faq-question').forEach(item => {
      item.addEventListener('click', () => {
        const parent = item.parentElement;
        parent.classList.toggle('active');
      });
    });

  </script>
  
  <!-- Translate.js 自动翻译 -->
  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    function initTranslate() {
      if (typeof translate !== 'undefined' && !window.translate) {
        window.translate = translate;
      }
      if (typeof translate !== 'undefined' && translate.language) {
        translate.language.setLocal('chinese_simplified');
        translate.service.use('client.edge');
        translate.listener.start();
        translate.setAutoDiscriminateLocalLanguage();
        translate.execute();
      } else {
        setTimeout(initTranslate, 100);
      }
    }
    initTranslate();
    
    function changeLanguage(lang) {
      var t = window.translate || translate;
      if (t && t.changeLanguage) {
        t.changeLanguage(lang);
      }
    }
  </script>
</body>
</html>`;
