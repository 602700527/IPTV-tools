// Cloudflare Worker 主入口文件
import { initDB, createTables, isMallEnabled, getDB } from './database.js';
import { handleLiveRequest } from './handlers/live.js';
import { handleSubRequest, handleSubRequestTxt } from './handlers/sub.js';
import { handleAdminRequest, handleAdTsFile } from './handlers/admin.js';
import { handleScheduledEvent, manualSyncAll, syncAllSources, refreshCache } from './handlers/scheduler.js';
import { handleUserActivate, handleUserChangeTopic, handleUserChangeSubMode } from './handlers/user.js';
import { handlePublicPlay, handleChannelDebug, handlePublicConfig, handlePublicAnnouncement, handlePublicMallSettings, handleFavoritesM3U, handleChannelsM3U } from './handlers/public.js';
import { handleGetPlans } from './handlers/plans-api.js';
import { generateAndCacheSitemap, getAllChannels, getAllGroups } from './utils/channel-cache.js';

// 辅助函数：将字符串转换为 URL 友好的 slug
function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '') // 保留中文、字母、数字、下划线、连字符
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 内联 404 页面生成函数
async function generate404Page(request, env) {
  const url = new URL(request.url);
  const origin = url.protocol + '//' + url.host;
  const backUrl = origin + '/';
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Lost Signal | IPTV Search</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg-dark: #0a0a0f;
      --bg-card: #12121a;
      --accent: #e50914;
      --accent-glow: rgba(229, 9, 20, 0.4);
      --text-primary: #ffffff;
      --text-secondary: #8a8a9a;
      --gradient-red: linear-gradient(135deg, #e50914 0%, #b3070f 100%);
    }

    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-dark);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    /* Animated background grid */
    .bg-grid {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        linear-gradient(rgba(229, 9, 20, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(229, 9, 20, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: gridPulse 4s ease-in-out infinite;
    }

    @keyframes gridPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    /* Floating TV icons */
    .floating-icons {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .tv-icon {
      position: absolute;
      font-size: 2rem;
      opacity: 0.1;
      animation: float 20s ease-in-out infinite;
    }

    .tv-icon:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
    .tv-icon:nth-child(2) { top: 20%; right: 15%; animation-delay: -5s; font-size: 1.5rem; }
    .tv-icon:nth-child(3) { bottom: 30%; left: 20%; animation-delay: -10s; font-size: 2.5rem; }
    .tv-icon:nth-child(4) { bottom: 15%; right: 10%; animation-delay: -15s; }
    .tv-icon:nth-child(5) { top: 50%; left: 5%; animation-delay: -7s; font-size: 1.8rem; }
    .tv-icon:nth-child(6) { top: 70%; right: 25%; animation-delay: -12s; }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(5deg); }
      50% { transform: translateY(0) rotate(0deg); }
      75% { transform: translateY(20px) rotate(-5deg); }
    }

    /* Main content */
    .container {
      text-align: center;
      padding: 2rem;
      position: relative;
      z-index: 10;
      max-width: 700px;
    }

    /* Glitch 404 text */
    .error-code {
      font-size: clamp(8rem, 20vw, 14rem);
      font-weight: 900;
      line-height: 1;
      background: var(--gradient-red);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      animation: glitch 3s ease-in-out infinite;
      text-shadow: 0 0 80px var(--accent-glow);
    }

    .error-code::before,
    .error-code::after {
      content: '404';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--gradient-red);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .error-code::before {
      animation: glitch-1 2s ease-in-out infinite;
      clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
    }

    .error-code::after {
      animation: glitch-2 2s ease-in-out infinite;
      clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
    }

    @keyframes glitch {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(2px, -2px); }
      60% { transform: translate(-2px, -2px); }
      80% { transform: translate(2px, 2px); }
    }

    @keyframes glitch-1 {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(4px, -2px); }
      40% { transform: translate(-4px, 2px); }
      60% { transform: translate(4px, 2px); }
      80% { transform: translate(-4px, -2px); }
    }

    @keyframes glitch-2 {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(-4px, 2px); }
      40% { transform: translate(4px, -2px); }
      60% { transform: translate(-4px, -2px); }
      80% { transform: translate(4px, 2px); }
    }

    /* Headline */
    .headline {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      font-weight: 700;
      margin: 1.5rem 0 1rem;
      letter-spacing: -0.02em;
    }

    .headline-accent {
      color: var(--accent);
    }

    /* Subtext */
    .subtext {
      font-size: 1.1rem;
      color: var(--text-secondary);
      max-width: 480px;
      margin: 0 auto 2.5rem;
      line-height: 1.7;
    }

    /* Stats bar */
    .stats-bar {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .stat-icon {
      width: 20px;
      height: 20px;
      opacity: 0.7;
    }

    .stat-number {
      color: var(--text-primary);
      font-weight: 600;
    }

    /* CTA buttons */
    .cta-group {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.9rem 1.8rem;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
    }

    .btn-primary {
      background: var(--gradient-red);
      color: white;
      box-shadow: 0 4px 30px var(--accent-glow);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 40px rgba(229, 9, 20, 0.5);
    }

    .btn-secondary {
      background: var(--bg-card);
      color: var(--text-primary);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .btn svg {
      width: 18px;
      height: 18px;
    }

    /* Quick links */
    .quick-links {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .quick-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .quick-link:hover {
      color: var(--accent);
    }

    .quick-link::before {
      content: '';
      width: 4px;
      height: 4px;
      background: var(--accent);
      border-radius: 50%;
    }

    /* Signal lost animation */
    .signal-lost {
      position: relative;
      margin-bottom: 1rem;
    }

    .signal-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.95); }
    }

    /* Responsive */
    @media (max-width: 600px) {
      .stats-bar { gap: 1rem; }
      .stat-item { font-size: 0.8rem; }
      .cta-group { flex-direction: column; align-items: center; }
      .btn { width: 100%; max-width: 280px; justify-content: center; }
      .quick-links { flex-direction: column; align-items: center; gap: 0.8rem; }
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>

  <div class="floating-icons">
    <div class="tv-icon">📺</div>
    <div class="tv-icon">📺</div>
    <div class="tv-icon">📺</div>
    <div class="tv-icon">📺</div>
    <div class="tv-icon">📺</div>
    <div class="tv-icon">📺</div>
  </div>

  <div class="container">
    <div class="signal-lost">
      <svg class="signal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M5.64 5.64a9 9 0 0 1 12.72 0" stroke="#e50914" opacity="0.3"/>
        <path d="M2.93 2.93a14 14 0 0 1 18.14 0" stroke="#e50914" opacity="0.2"/>
        <path d="M8.5 8.5l7 7" stroke="#e50914" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="2" fill="#e50914"/>
        <path d="M2 2l20 20" stroke="#e50914" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>

    <div class="error-code">404</div>

    <h1 class="headline">Oops! <span class="headline-accent">Signal Lost</span></h1>

    <p class="subtext">
      This channel seems to have gone dark. But don't worry — we've got plenty more to keep you entertained. Let's get you back to watching!
    </p>

    <div class="stats-bar">
      <div class="stat-item">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="7" width="20" height="15" rx="2"/>
          <polyline points="17 2 12 7 7 2"/>
        </svg>
        <span class="stat-number">10,000+</span> Channels
      </div>
      <div class="stat-item">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <span class="stat-number">24/7</span> Live TV
      </div>
      <div class="stat-item">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span class="stat-number">5,000+</span> Happy Users
      </div>
    </div>

    <div class="cta-group">
      <a href="${backUrl}" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Back to Home
      </a>
      <a href="${origin}/favorites" class="btn btn-secondary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        My Favorites
      </a>
      <a href="${origin}/plans" class="btn btn-secondary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        View Plans
      </a>
    </div>

    <div class="quick-links">
      <a href="${origin}/" class="quick-link">Browse All Channels</a>
      <a href="${origin}/category/cctv" class="quick-link">CCTV Channels</a>
      <a href="${origin}/category/sports" class="quick-link">Sports</a>
      <a href="${origin}/category/news" class="quick-link">News</a>
    </div>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

import {
  handleRegister,
  handleSendVerificationCode,
  handleVerifyEmail,
  handleLogin,
  handleLogout,
  handleGetUserInfo,
  handleGetOrderHistory,
  handleForgotPassword,
  handleResetPassword,
  handleGoogleOAuthInit,
  handleGoogleOAuthCallback,
  handleGetMemberStatus
} from './handlers/auth.js';

import { handleGoogleAuthDebug } from './handlers/google-auth-debug.js';
import { handleCreateCode, handleGetTopics } from './handlers/subscription-api.js';
import {
  handleCreateXunhuPayOrder,
  handleXunhuPayNotify,
  handleCheckXunhuPayOrder,
  handleGetXunhuPayOrders,
  handleSimulatePaymentSuccess
} from './handlers/xunhupay-api.js';
import {
  handleGetPaymentMethods,
  handleCreatePaymentMethod,
  handleUpdatePaymentMethod,
  handleDeletePaymentMethod,
  handleGetMallSettings,
  handleUpdateMallSettings
} from './handlers/mall-api.js';
import {
  handleGetTickets,
  handleCreateTicket,
  handleGetTicket,
  handleReplyTicket,
  handleCloseTicket
} from './handlers/ticket-api.js';
import { ADMIN_HTML } from './admin-page.js';
import { USER_ACTIVATE_HTML } from './user-activate.js';
import { SUBSCRIPTION_HTML } from './subscription-page.js';
import { PLANS_HTML } from './plans-page.js';
import { RESET_PASSWORD_HTML } from './reset-password-page.js';
import { generateRobotsTxt } from './legal-pages.js';
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';
import { pageTitle as privacyTitle, pageDescription as privacyDesc, styles as privacyStyles, content as privacyContent } from './pages-content/privacy-policy.js';
import { pageTitle as termsTitle, pageDescription as termsDesc, styles as termsStyles, content as termsContent } from './pages-content/terms.js';
import { pageTitle as tutorialTitle, pageDescription as tutorialDesc, styles as tutorialStyles, content as tutorialContent } from './pages-content/tutorial.js';
import { pageTitle as loginTitle, pageDescription as loginDesc, styles as loginStyles, content as loginContent } from './pages-content/login.js';
import { pageTitle as accountTitle, pageDescription as accountDesc, styles as accountStyles, content as accountContent } from './pages-content/account.js';
import { pageTitle as forgotTitle, pageDescription as forgotDesc, styles as forgotStyles, content as forgotContent } from './pages-content/forgot-password.js';
import { pageTitle as usaIptvTitle, pageDescription as usaIptvDesc, styles as usaIptvStyles, content as usaIptvContent } from './pages-content/usa-iptv.js';
import { pageTitle as ukIptvTitle, pageDescription as ukIptvDesc, styles as ukIptvStyles, content as ukIptvContent } from './pages-content/uk-iptv-plans.js';
import { pageTitle as androidIptvTitle, pageDescription as androidIptvDesc, styles as androidIptvStyles, content as androidIptvContent } from './pages-content/android-iptv-app.js';
import { pageTitle as freeIptvTitle, pageDescription as freeIptvDesc, styles as freeIptvStyles, content as freeIptvContent } from './pages-content/free-iptv-app-review.js';
import { pageTitle as carplayAptvTitle, pageDescription as carplayAptvDesc, styles as carplayAptvStyles, content as carplayAptvContent } from './pages-content/carplay-aptv.js';
import { pageTitle as middleEastIptvTitle, pageDescription as middleEastIptvDesc, styles as middleEastIptvStyles, content as middleEastIptvContent } from './pages-content/middle-east-iptv.js';
import { pageTitle as asiaIptvTitle, pageDescription as asiaIptvDesc, styles as asiaIptvStyles, content as asiaIptvContent } from './pages-content/asia-iptv.js';
import { pageTitle as europeIptvTitle, pageDescription as europeIptvDesc, styles as europeIptvStyles, content as europeIptvContent } from './pages-content/europe-iptv.js';
import { pageTitle as americasIptvTitle, pageDescription as americasIptvDesc, styles as americasIptvStyles, content as americasIptvContent } from './pages-content/americas-iptv.js';
import { pageTitle as oceaniaIptvTitle, pageDescription as oceaniaIptvDesc, styles as oceaniaIptvStyles, content as oceaniaIptvContent } from './pages-content/oceania-iptv.js';
import { llmsTxt } from './pages-content/llms-txt.js';
import { generateShowcasePage } from './pages/showcase-page.js';
import { getSystemConfig } from './database.js';
import { initCache } from './utils/cache.js';
import { getSitemapFromCache } from './utils/channel-cache.js';
import { LOGO_SVG, FAVICON_SVG, OG_IMAGE_SVG, APPLE_TOUCH_ICON_SVG, ICON_192_SVG, FAVICON_ICO_SVG } from './assets.js';
import { SEO_HOME_CSS } from './static-assets.js';
import { ALIPAY_PNG_DATA, WECHAT_PAY_PNG_DATA } from './image-data.js';
import {
  createCoinbaseOrder,
  checkCoinbaseOrder,
  handleCoinbaseWebhook,
  createCryptoPaymentOrder,
  confirmCryptoPayment
} from './handlers/crypto-payment.js';

// 静态文件服务
// 使用统一的存储层，支持 KV (dev) 和 R2 (production)
import { getStaticFile, detectEnvironment } from './utils/static-storage.js';

async function serveStaticFile(filePath, env) {
  try {
    const content = await getStaticFile(env, filePath);
    
    if (content === null) {
      return null; // 文件不存在
    }

    // 根据文件扩展名设置 Content-Type
    let contentType = 'text/html; charset=utf-8';
    if (filePath.endsWith('.css')) {
      contentType = 'text/css; charset=utf-8';
    } else if (filePath.endsWith('.js')) {
      contentType = 'application/javascript; charset=utf-8';
    } else if (filePath.endsWith('.xml')) {
      contentType = 'application/xml; charset=utf-8';
    } else if (filePath.endsWith('.txt')) {
      contentType = 'text/plain; charset=utf-8';
    } else if (filePath.endsWith('.svg')) {
      contentType = 'image/svg+xml';
    } else if (filePath.endsWith('.png')) {
      contentType = 'image/png';
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (filePath.endsWith('.ico')) {
      contentType = 'image/x-icon';
    }

    const envType = detectEnvironment(env);
    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': envType === 'production' ? 'public, max-age=86400' : 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('[StaticFile] Error serving file:', error);
    return null;
  }
}

// 生成静态页面（注入页头页脚组件）
function generateStaticPage(pageTitle, pageDescription, styles, content) {
  // Determine page path and schema type
  let pagePath = '/tutorial';
  let schemaType = 'WebPage';
  let additionalSchema = '';
  if (pageTitle === 'Privacy Policy') {
    pagePath = '/privacy-policy';
    schemaType = 'PrivacyPolicy';
  } else if (pageTitle === 'Terms of Service') {
    pagePath = '/terms';
    schemaType = 'WebPage';
  } else if (pageTitle.toLowerCase().includes('usa')) {
    pagePath = '/usa-iptv';
    schemaType = 'CollectionPage';
  } else if (pageTitle.toLowerCase().includes('uk')) {
    pagePath = '/uk-iptv-plans';
    schemaType = 'CollectionPage';
  } else if (pageTitle.toLowerCase().includes('asia')) {
    pagePath = '/asia-iptv';
    schemaType = 'CollectionPage';
  } else if (pageTitle.toLowerCase().includes('europe')) {
    pagePath = '/europe-iptv';
    schemaType = 'CollectionPage';
  } else if (pageTitle.toLowerCase().includes('americas')) {
    pagePath = '/americas-iptv';
    schemaType = 'CollectionPage';
  } else if (pageTitle.toLowerCase().includes('oceania')) {
    pagePath = '/oceania-iptv';
    schemaType = 'CollectionPage';
  } else if (pageTitle.toLowerCase().includes('middle')) {
    pagePath = '/middle-east-iptv';
    schemaType = 'CollectionPage';
  } else if (pageTitle.toLowerCase().includes('android')) {
    pagePath = '/android-iptv-app';
    schemaType = 'Article';
  } else if (pageTitle.toLowerCase().includes('free iptv app')) {
    pagePath = '/free-iptv-app-review';
    schemaType = 'Article';
  } else if (pageTitle.includes('Tutorial') || pageTitle.includes('How to')) {
    pagePath = '/tutorial';
    schemaType = 'HowTo';
    // Add HowTo structured data
    additionalSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Watch IPTV Channels",
      "description": pageDescription,
      "totalTime": "PT5M",
      "step": [
        {"@type": "HowToStep", "position": 1, "name": "Browse Channels", "text": "Visit iptv-search.com and browse or search for IPTV channels by country or category"},
        {"@type": "HowToStep", "position": 2, "name": "Get M3U URL", "text": "Click on any channel category and copy the M3U playlist URL"},
        {"@type": "HowToStep", "position": 3, "name": "Install Player", "text": "Download an IPTV player like VLC, IPTV Smarters, or TiviMate on your device"},
        {"@type": "HowToStep", "position": 4, "name": "Add Playlist", "text": "Open the player, go to Add Playlist, and paste the M3U URL"},
        {"@type": "HowToStep", "position": 5, "name": "Watch Live", "text": "Select any channel from the list and start watching live TV"}
      ]
    });
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://iptv-search.com${pagePath}">
  <meta property="og:type" content="${schemaType === 'HowTo' ? 'article' : 'website'}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDescription}">
  <meta property="og:url" content="https://iptv-search.com${pagePath}">
  <meta property="og:locale" content="en_US">
  ${additionalSchema ? `<script type="application/ld+json">${additionalSchema}</script>` : ''}
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": pageTitle,
    "description": pageDescription,
    "url": "https://iptv-search.com" + pagePath,
    "isPartOf": {
      "@type": "WebSite",
      "name": "IPTV Search",
      "url": "https://iptv-search.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "IPTV Search",
      "url": "https://iptv-search.com"
    },
    "inLanguage": "en"
  })}</script>
  <style>
    :root {
      --accent: #e50914;
      --bg-primary: #0a0a0a;
      --bg-secondary: #111111;
      --bg-card: #1a1a1a;
      --text-primary: #ffffff;
      --text-secondary: #999999;
      --text-muted: #666666;
      --border: rgba(255,255,255,0.08);
    }
    [data-theme="light"] {
      --bg-primary: #f5f5f5;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: rgba(0,0,0,0.08);
    }
    ${styles}
  </style>
</head>
<body>
${PAGE_HEADER}
${content}
${PAGE_FOOTER}
  <script>
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
  </script>
</body>
</html>`;
}

// 计算订阅价格（从数据库获取套餐配置）
async function calculatePriceForSubscription(durationDays, maxIPs, env) {
  try {
    const plan = await env.DB.prepare(`
      SELECT days, base_price, price_per_ip, discount
      FROM subscription_plans
      WHERE days = ? AND is_enabled = 1
    `).bind(durationDays).first();

    if (!plan) {
      return 0; // 默认价格
    }

    const price = plan.base_price + (plan.price_per_ip * maxIPs);
    const discountedPrice = price * (1 - plan.discount / 100);

    return discountedPrice;
  } catch (error) {
    console.error('Error calculating price:', error);
    return 0;
  }
}


// 缓存初始化标记（防止重复初始化）
let cacheInitialized = false;

export default {
  async fetch(request, env, ctx) {
    try {
      // 初始化数据库连接
      await initDB(env);

      // 确保表结构存在（自动迁移）
      await createTables(env);

      // 初始化缓存（从 KV 恢复）- 只初始化一次
      if (!cacheInitialized) {
        await initCache(env);
        cacheInitialized = true;
        console.log('Cache initialized');
      }

      const url = new URL(request.url);
      const path = url.pathname;

    // CORS预检请求处理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // 静态文件处理
    if (path === '/favicon.svg') {
      // Favicon SVG
      return new Response(FAVICON_SVG, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } else if (path === '/favicon.ico') {
      // Favicon ICO (使用SVG格式，浏览器兼容)
      return new Response(FAVICON_ICO_SVG, {
        headers: {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } else if (path === '/apple-touch-icon.png') {
      // Apple Touch Icon (iOS设备)
      return new Response(APPLE_TOUCH_ICON_SVG, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } else if (path === '/icon-192.png') {
      // Android PWA图标
      return new Response(ICON_192_SVG, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } else if (path === '/logo.svg') {
      // Logo SVG
      return new Response(LOGO_SVG, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } else if (path === '/og-image.svg' || path === '/og-image.jpg') {
      // OG Image SVG (同时支持.jpg和.svg路径)
      return new Response(OG_IMAGE_SVG, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } else if (path === '/seo-home.css') {
      // 首页静态 HTML 专用 CSS
      return new Response(SEO_HOME_CSS, {
        headers: {
          'Content-Type': 'text/css; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } else if (path === '/public/zhifubao.png') {
      // 支付宝官方 logo (返回 base64 数据)
      const imageBuffer = Uint8Array.from(atob(ALIPAY_PNG_DATA), c => c.charCodeAt(0));
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } else if (path === '/public/weixin.png') {
      // 微信支付官方 logo (返回 base64 数据)
      const imageBuffer = Uint8Array.from(atob(WECHAT_PAY_PNG_DATA), c => c.charCodeAt(0));
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    } else if (path === '/sw.js') {
      // Service Worker
      const swContent = `self.options = {
    "domain": "5gvci.com",
    "zoneId": 10620300
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')`;
      return new Response(swContent, {
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // 路由处理
    console.log('[Router] Processing path:', path);
    if (path === '/' || path === '') {
      // 首页 - 优先尝试使用静态文件
      const staticResponse = await serveStaticFile('/index.html', env);
      if (staticResponse) {
        return staticResponse;
      }
      
      // 首页预计算分类数据（用于 SSR）
      const db = await initDB(env);
      const allChannelsResult = await db.prepare(`
        SELECT c.id, c.channel_name, c.group_title, c.type, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active, c.source_id, s.name as source_name
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
      `).all();
      const allChannels = allChannelsResult.results || [];

      // Region categories
      const groupCounts = {};
      allChannels.forEach(ch => {
        const group = ch.group_title || 'Other';
        groupCounts[group] = (groupCounts[group] || 0) + 1;
      });
      const groupsResult = await db.prepare(`
        SELECT DISTINCT c.group_title
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.group_title IS NOT NULL AND c.group_title != ''
          AND c.is_active = 1 AND s.is_active = 1
        ORDER BY c.group_title
      `).all();
      const groups = (groupsResult.results || []).map(r => r.group_title);

      const categorySVGs = {
        'cctv': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 19h10M12 19v-3"/></svg>',
        'other': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 19h10M12 19v-3"/></svg>'
      };
      const regionCategories = groups.map(g => {
        const catSlug = slugify(g);
        return {
          name: g,
          slug: catSlug,
          count: groupCounts[g] || 0,
          icon: categorySVGs[catSlug.toLowerCase()] || categorySVGs['other']
        };
      });

      // Type categories
      const typeNamesEn = {
        'movie': 'Movies', 'animation': 'Animation', 'entertainment': 'Entertainment',
        'sports': 'Sports', 'news': 'News', 'kids': 'Kids', 'documentary': 'Documentary',
        'education': 'Education', 'drama': 'Drama', 'music': 'Music', 'fashion': 'Fashion',
        'game': 'Game', 'travel': 'Travel', 'food': 'Food', 'finance': 'Finance',
        'tech': 'Tech', 'health': 'Health', 'comprehensive': 'Comprehensive'
      };
      const typeCounts = {};
      allChannels.forEach(ch => {
        if (!ch.type) {
          typeCounts['comprehensive'] = (typeCounts['comprehensive'] || 0) + 1;
          return;
        }
        // 拆分逗号分隔的多类型，分别计数
        const types = ch.type.split(',').map(t => t.trim());
        types.forEach(t => {
          if (t) {
            typeCounts[t] = (typeCounts[t] || 0) + 1;
          }
        });
      });
      // 过滤掉 unknown 类型
      const typeCategories = Object.keys(typeCounts)
        .filter(t => t !== 'unknown')
        .map(t => {
          return {
            name: typeNamesEn[t] || t,
            type: t,
            slug: t.toLowerCase(),
            count: typeCounts[t] || 0,
            icon: categorySVGs['other']
          };
        }).sort((a, b) => b.count - a.count);

      // 使用新的 HTML 壳 + 预渲染分类
      const { generateHomePage } = await import('./pages/home-page.js');
      const html = generateHomePage({
        origin: url.origin,
        header: PAGE_HEADER,
        footer: PAGE_FOOTER,
        regionCategories,
        typeCategories,
        totalChannels: allChannels.length,
        totalGroups: groups.length
      });
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60'
        }
      });
    }

    // 分类页路由：/category/{slug}
    const categoryMatch = path.match(/^\/category\/([^\/]+)$/);
    if (categoryMatch) {
      const slug = decodeURIComponent(categoryMatch[1]);
      // 优先尝试使用静态文件（URL 编码的 slug）
      const encodedSlug = encodeURIComponent(slug);
      const staticResponse = await serveStaticFile(`/category/${encodedSlug}.html`, env);
      if (staticResponse) {
        return staticResponse;
      }
      
      // Fallback: 动态生成分类页
      // 需要把 slug 转回真实的 category name（因为数据库存的是原名）
      const db = await initDB(env);
      
      // slugify 函数：和 seo-handler.js 中的一致（支持中文、emoji）
      const slugify = (str) => {
        if (!str) return '';
        return str
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      };
      
      // 获取所有频道（用于构建分类列表）
      const allChannelsResult = await db.prepare(`
        SELECT c.id, c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active, c.source_id, s.name as source_name
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
      `).all();
      
      const allChannels = allChannelsResult.results || [];
      
      // 获取所有分组并计算每个分组的频道数量
      const groupCounts = {};
      allChannels.forEach(ch => {
        const group = ch.group_title || 'Other';
        groupCounts[group] = (groupCounts[group] || 0) + 1;
      });
      
      // 获取所有分组
      const groupsResult = await db.prepare(`
        SELECT DISTINCT c.group_title
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
          AND c.group_title IS NOT NULL AND c.group_title != ''
        ORDER BY c.group_title
      `).all();
      
      // 找到匹配的分类（大小写不敏感匹配）
      const matchedGroup = (groupsResult.results || []).find(g => slugify(g.group_title).toLowerCase() === slug.toLowerCase());
      console.log('[CategoryPage] Looking for slug:', slug, ', Available groups:', groupsResult.results?.map(g => ({name: g.group_title, slug: slugify(g.group_title)})));

      if (!matchedGroup) {
        return await generate404Page(request, env);
      }
      
      // 构建分类列表（用于侧边栏）
      const categorySVGs = {
        'cctv': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 19h10M12 19v-3"/></svg>',
        'sports': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9z"/></svg>',
        'news': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/></svg>',
        'movie': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2.5"/><path d="M2 7l5 3-5 3V7zM12 4v13M22 7l-5 3 5 3V7z"/></svg>',
        'entertainment': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20M10 4v4M14 4v4"/></svg>',
        'music': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
        'kids': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>',
        'other': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 19h10M12 19v-3"/></svg>'
      };
      
      const categories = groupsResult.results.map(g => {
        const catSlug = slugify(g.group_title);
        return {
          name: g.group_title,
          slug: catSlug,
          count: groupCounts[g.group_title] || 0,
          icon: categorySVGs[catSlug.toLowerCase()] || categorySVGs['other']
        };
      });
      
      // 获取当前分类的频道
      const categoryChannels = allChannels
        .filter(ch => ch.group_title === matchedGroup.group_title)
        .map(ch => ({
          name: ch.channel_name,
          hash: ch.channel_hash,
          logo: ch.logo,
          group: ch.group_title
        }));
      
      const { generateCategoryPage } = await import('./pages/category-page.js');
      const html = generateCategoryPage({ 
        origin: url.origin, 
        category: matchedGroup.group_title,
        slug: slug,
        categories: categories,
        channels: categoryChannels
      });
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60'
        }
      });
    }

    // 类型页路由：/type/{slug} (AI分类类型)
    const typeMatch = path.match(/^\/type\/([^\/]+)$/);
    if (typeMatch) {
      const typeSlug = decodeURIComponent(typeMatch[1]);

      // Type display names (English -> Chinese)
      const typeNames = {
        'movie': '电影', 'animation': '动画', 'entertainment': '综艺',
        'sports': '体育', 'news': '新闻', 'kids': '少儿', 'documentary': '纪录',
        'education': '教育', 'drama': '戏曲', 'music': '音乐', 'fashion': '时尚',
        'game': '游戏', 'travel': '旅游', 'food': '美食', 'finance': '财经',
        'tech': '科技', 'health': '健康', 'comprehensive': '综合'
      };

      // Direct mapping: slug (lowercase) -> type key
      const typeSlugToKey = {};
      Object.keys(typeNames).forEach(key => {
        typeSlugToKey[key.toLowerCase()] = key;
      });

      // English display names
      const categoryNames = {
        'movie': 'Movies', 'animation': 'Animation', 'entertainment': 'Entertainment',
        'sports': 'Sports', 'news': 'News', 'kids': 'Kids', 'documentary': 'Documentary',
        'education': 'Education', 'drama': 'Drama', 'music': 'Music', 'fashion': 'Fashion',
        'game': 'Game', 'travel': 'Travel', 'food': 'Food', 'finance': 'Finance',
        'tech': 'Tech', 'health': 'Health', 'comprehensive': 'Comprehensive'
      };

      const typeKey = typeSlugToKey[typeSlug];
      if (!typeKey) {
        return await generate404Page(request, env);
      }

      const db = await initDB(env);

      // 获取所有频道（包含type字段）
      const allChannelsResult = await db.prepare(`
        SELECT c.id, c.channel_name, c.group_title, c.type, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active, c.source_id, s.name as source_name
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
      `).all();

      const allChannels = allChannelsResult.results || [];

      // 获取所有类型并计算每个类型的频道数量（支持逗号分隔的多类型）
      const typeCounts = {};
      allChannels.forEach(ch => {
        if (!ch.type) {
          // 空类型归类为综合
          typeCounts['comprehensive'] = (typeCounts['comprehensive'] || 0) + 1;
          return;
        }
        // 拆分逗号分隔的多类型，分别计数
        const types = ch.type.split(',').map(t => t.trim());
        types.forEach(t => {
          if (t) {
            typeCounts[t] = (typeCounts[t] || 0) + 1;
          }
        });
      });

      // 构建类型列表（用于侧边栏）
      const typeCategories = Object.keys(typeCounts).map(t => {
          return {
            name: categoryNames[t] || t,
            slug: t.toLowerCase(),
            count: typeCounts[t] || 0,
            type: t
          };
        }).sort((a, b) => b.count - a.count);

      // 获取当前类型的频道（支持逗号分隔的多类型）
      const typeChannels = allChannels
        .filter(ch => {
          if (!ch.type) return false;
          // 支持逗号分隔的多类型，如 "sports,news" 也能匹配 "sports"
          const types = ch.type.split(',').map(t => t.trim());
          return types.includes(typeKey);
        })
        .map(ch => ({
          name: ch.channel_name,
          hash: ch.channel_hash,
          logo: ch.logo,
          group: ch.group_title,
          type: ch.type
        }));

      const { generateCategoryPage } = await import('./pages/category-page.js');
      const html = generateCategoryPage({
        origin: url.origin,
        category: categoryNames[typeKey] || typeKey,
        slug: typeSlug,
        categories: typeCategories,
        channels: typeChannels
      });
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60'
        }
      });
    } else if (path.startsWith('/channel/')) {
      // 频道详情页: /channel/{slug}
      // Slug 格式: cctv-1-hd 或 cctv-1-hd-1 (重复名称用数字区分)
      let slugInUrl = path.replace('/channel/', '');
      try {
        slugInUrl = decodeURIComponent(slugInUrl);
      } catch (e) {
      }

      const staticResponse = await serveStaticFile(`/channel/${slugInUrl}.html`, env);
      if (staticResponse) {
        return staticResponse;
      }

      // 动态生成频道详情页 - 服务端预渲染
      const { generateChannelPage } = await import('./pages/channel-page.js');
      const db = await initDB(env);

      // 获取所有频道（用于同分类推荐和 slug 匹配）
      const allChannelsResult = await db.prepare(`
        SELECT c.id, c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active, c.source_id, c.description, s.name as source_name
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
      `).all();

      const allChannels = allChannelsResult.results || [];

      // Slugify 函数（与前端一致）
      const slugify = (str) => {
        if (!str) return '';
        var ws = String.fromCharCode(9, 10, 11, 12, 13, 32); var reWs = new RegExp('[' + ws + ']+', 'g'); var reKeep = new RegExp('[^a-zA-Z0-9' + String.fromCharCode(0x4e00) + '-' + String.fromCharCode(0x9fff) + String.fromCharCode(0xff00) + '-' + String.fromCharCode(0xffef) + String.fromCharCode(0xfe00) + '-' + String.fromCharCode(0xfeff) + String.fromCharCode(0x3000) + '-' + String.fromCharCode(0x303f) + String.fromCharCode(0x2000) + '-' + String.fromCharCode(0x206f) + String.fromCharCode(0xfe30) + '-' + String.fromCharCode(0xfe4f) + String.fromCharCode(0x2600) + '-' + String.fromCharCode(0x26ff) + '-]', 'g'); var reDash = /-+/g; var reEdge = /^-+|-+$/g; return str.trim().replace(reWs, '-').replace(reKeep, '').replace(reDash, '-').replace(reEdge, '');
      };

      // DEBUG: 打印 slug 匹配调试信息
      console.log(`[Channel Page] Looking for slug: "${slugInUrl}"`);
      const matchingChannels = allChannels.filter(ch => slugify(ch.channel_name) === slugInUrl);
      if (matchingChannels.length > 0) {
        console.log(`[Channel Page] Found ${matchingChannels.length} matching channel(s)`);
      } else {
        // 打印最接近的候选者（用于调试）
        const candidates = allChannels
          .map(ch => ({ name: ch.channel_name, slug: slugify(ch.channel_name) }))
          .filter(c => c.slug.includes(slugInUrl.substring(0, Math.min(10, slugInUrl.length))))
          .slice(0, 5);
        console.log(`[Channel Page] No match found. Candidates:`, JSON.stringify(candidates));
      }

      // 通过 slug 查找频道
      let channel = allChannels.find(ch => slugify(ch.channel_name) === slugInUrl);

      // 如果没找到，尝试带数字后缀的格式（如 cctv-1-hd-1）
      if (!channel) {
        const baseSlugMatch = slugInUrl.match(/^(.+)-(\d+)$/);
        if (baseSlugMatch) {
          const baseSlug = baseSlugMatch[1];
          const suffix = parseInt(baseSlugMatch[2]);
          const candidates = allChannels.filter(ch => slugify(ch.channel_name) === baseSlug);
          if (candidates.length >= suffix && suffix > 0) {
            channel = candidates[suffix - 1];
          }
        }
      }

      if (!channel) {
        return await generate404Page(request, env);
      }

      // 获取同分类的其他频道（用于侧边栏推荐）
      const relatedChannels = allChannels
        .filter(ch => ch.group_title === channel.group_title && ch.channel_hash !== channel.channel_hash)
        .slice(0, 10)
        .map(ch => ({
          name: ch.channel_name,
          hash: ch.channel_hash,
          logo: ch.logo,
          group: ch.group_title
        }));

      const html = generateChannelPage({
        origin: url.origin,
        hash: channel.channel_hash,
        channel: {
          id: channel.id,
          name: channel.channel_name,
          group: channel.group_title,
          logo: channel.logo,
          playUrl: channel.play_url,
          sourceName: channel.source_name,
          description: channel.description || ''
        },
        relatedChannels: relatedChannels
      });
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=600'
        }
      });
    } else if (path === '/login') {
      // 登录页 - 使用静态页面系统
      return new Response(generateStaticPage(loginTitle, loginDesc, loginStyles, loginContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/account') {
      // 账户中心 - 需要登录（页面 JS 自动检查 token）
      return new Response(generateStaticPage(accountTitle, accountDesc, accountStyles, accountContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/favorites') {
      // 收藏页 - 使用服务端渲染的收藏页
      const { generateFavoritesPage } = await import('./pages/favorites-page.js');
      const html = generateFavoritesPage({ origin: url.origin });

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60'
        }
      });
    } else if (path.startsWith('/search') || path.startsWith('/zh-hant/search') || path.startsWith('/zh-cn/search')) {
      // 检查是否为旧地址或爬虫，返回 410 Gone
      const userAgent = request.headers.get('user-agent') || '';
      const isBot = /bot|crawler|spider|slurp|mj12bot|semrush|ahrefs/i.test(userAgent);
      if (isBot && !url.searchParams.get('q')) {
        return new Response('Not Found', { 
          status: 410,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      // 搜索结果页 - 使用新的 HTML 壳 + API 方案
      const query = url.searchParams.get('q') || '';
      const { generateSearchPage } = await import('./pages/search-page.js');
      const html = generateSearchPage({ 
        origin: url.origin, 
        query,
        header: PAGE_HEADER,
        footer: PAGE_FOOTER
      });

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60',
          'X-Robots-Tag': 'noindex'
        }
      });
    } else if (path === '/forgot-password') {
      // 忘记密码页 - 使用静态页面系统
      return new Response(generateStaticPage(forgotTitle, forgotDesc, forgotStyles, forgotContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/api/home') {
      // 首页数据 API
      const { handleApiHome } = await import('./handlers/api/home.js');
      return await handleApiHome(request, env, ctx);
    } else if (path.startsWith('/api/search')) {
      // 搜索结果 API
      const { handleApiSearch } = await import('./handlers/api/search.js');
      return await handleApiSearch(request, env, ctx);
    } else if (path.startsWith('/api/category/')) {
      // 分类页数据 API: /api/category/{slug}
      const { handleApiCategory } = await import('./handlers/api/category.js');
      return await handleApiCategory(request, env, ctx);
    } else if (path.startsWith('/api/type/')) {
      // 类型页数据 API: /api/type/{slug} (AI分类类型)
      const { handleApiType } = await import('./handlers/api/type.js');
      return await handleApiType(request, env, ctx);
    } else if (path === '/api/config') {
      // 公开配置API - 获取前端需要的配置（如加密密钥）
      return await handlePublicConfig(request, env, ctx);
    } else if (path === '/api/announcement') {
      // 公开公告API
      return await handlePublicAnnouncement(request, env, ctx);
    } else if (path === '/api/mall/settings') {
      // 公开商城设置API
      return await handlePublicMallSettings(request, env, ctx);
    } else if (path === '/api/mall/plans') {
      // 公开订阅套餐列表API
      return await handleGetPlans(request, env, ctx);
    } else if (path === '/api/mall/payment-methods') {
      // 公开支付方式列表API
      return await handleGetPaymentMethods(request, env, ctx);
    } else if (path === '/api/admin/mall/payment-methods') {
      // 管理员支付方式管理 API（在 admin.js 处理）
      return await handleAdminRequest(request, env, ctx);
    } else if (path === '/api/debug') {
      // 调试接口 - 查看频道headers信息
      return await handleChannelDebug(request, env, ctx);
      } else if (path === '/api/channels/m3u') {
        // M3U 文件生成 API（服务端生成，不暴露 token）
        return await handleChannelsM3U(request, env, ctx);
    } else if (path.startsWith('/api/play/')) {
      // 公开播放API（无需卡密）
      return await handlePublicPlay(request, env, ctx);
    } else if (path === '/showcase' || path === '/showcase/' || path === '/showcase/index' || path === '/showcase/index.html') {
      // 频道展示页 - 用于电商客户展示
      const { getAllChannels, getAllGroups } = await import('./utils/channel-cache.js');
      const { channels } = await getAllChannels(env);
      const { groups } = await getAllGroups(env);
      const { generateShowcasePage } = await import('./pages/showcase-page.js');
      const html = generateShowcasePage({
        origin: url.origin,
        channels: channels,
        groups: groups,
        totalChannels: channels.length,
        totalGroups: groups.length
      });
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/activate' || path === '/activate/' || path === '/activate/index' || path === '/activate/index.html') {
      // 用户激活页面
      const timezone = env.TIMEZONE || 'Asia/Shanghai';
      const htmlWithConfig = USER_ACTIVATE_HTML.replace(
        '<script>',
        `<script>window.TIMEZONE = '${timezone}';\n`
      );
      return new Response(htmlWithConfig, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/tutorial' || path === '/tutorial/' || path === '/tutorial/index' || path === '/tutorial/index.html') {
      // 教程页面 - 使用静态页面（注入页头页脚组件）
      return new Response(generateStaticPage(tutorialTitle, tutorialDesc, tutorialStyles, tutorialContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/carplay-aptv' || path === '/carplay-aptv/' || path === '/carplay-aptv/index' || path === '/carplay-aptv/index.html') {
      // APTV & CarPlay Guide
      return new Response(generateStaticPage(carplayAptvTitle, carplayAptvDesc, carplayAptvStyles, carplayAptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/llms.txt' || path === '/llms.txt/') {
      // AI crawler friendly summary
      return new Response(llmsTxt, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    } else if (path === '/api/activate') {
      // 用户激活API
      return await handleUserActivate(request, env, ctx);
    } else if (path === '/api/change-topic') {
      // 修改用户专题
      return await handleUserChangeTopic(request, env, ctx);
    } else if (path === '/api/user/change-sub-mode') {
      return await handleUserChangeSubMode(request, env, ctx);
    } else if (path === '/api/topics') {
      // 获取专题列表（公开）
      try {
        const { getTopics } = await import('./database.js');
        const topics = await getTopics();
        return new Response(JSON.stringify(topics || []), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    } else if (path === '/api/auth/register') {
      // 用户注册
      return await handleRegister(request, env, ctx);
    } else if (path === '/api/auth/send-code') {
      // 发送验证码
      return await handleSendVerificationCode(request, env, ctx);
    } else if (path === '/api/auth/verify') {
      // 验证邮箱
      return await handleVerifyEmail(request, env, ctx);
    } else if (path === '/api/auth/login') {
      // 用户登录
      return await handleLogin(request, env, ctx);
    } else if (path === '/api/auth/logout') {
      // 用户登出
      return await handleLogout(request, env, ctx);
    } else if (path === '/api/auth/forgot-password') {
      // 忘记密码 - 发送重置链接
      return await handleForgotPassword(request, env, ctx);
    } else if (path === '/api/auth/reset-password') {
      // 重置密码
      return await handleResetPassword(request, env, ctx);
    } else if (path === '/api/auth/user') {
      // 获取用户信息
      return await handleGetUserInfo(request, env, ctx);
    } else if (path === '/api/auth/orders') {
      // 获取订单历史
      return await handleGetOrderHistory(request, env, ctx);
    } else if (path === '/api/member/status') {
      // 获取会员状态（用于前端广告显示控制）
      return await handleGetMemberStatus(request, env, ctx);
    } else if (path === '/api/auth/google/init') {
      // Google OAuth 初始化
      return await handleGoogleOAuthInit(request, env, ctx);
    } else if (path === '/api/auth/google/callback') {
      // Google OAuth 回调
      return await handleGoogleOAuthCallback(request, env, ctx);
    } else if (path === '/api/auth/google/debug') {
      // Google OAuth 诊断
      return await handleGoogleAuthDebug(request, env, ctx);
    } else if (path === '/api/subscription/create-code') {
      // 创建订阅卡密
      return await handleCreateCode(request, env, ctx);
    } else if (path === '/api/subscription/topics') {
      // 获取可用主题列表
      return await handleGetTopics(request, env, ctx);
    } else if (path === '/api/subscription/xunhupay/create-order') {
      // 创建虎皮椒支付订单
      return await handleCreateXunhuPayOrder(request, env, ctx);
    } else if (path === '/api/payment/xunhupay/notify') {
      // 虎皮椒支付回调通知
      return await handleXunhuPayNotify(request, env, ctx);
    } else if (path === '/api/subscription/xunhupay/check-order') {
      // 查询虎皮椒订单状态
      return await handleCheckXunhuPayOrder(request, env, ctx);
    } else if (path === '/api/subscription/xunhupay/simulate-success') {
      // 调试：模拟支付成功（仅本地开发环境）
      const clientIP = request.headers.get('cf-connecting-ip') || url.hostname;
      const isLocalhost = clientIP === '127.0.0.1' || clientIP === '::1' || url.hostname === 'localhost';
      if (!isLocalhost) {
        return new Response(JSON.stringify({ success: false, error: 'Only available in local development' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return await handleSimulatePaymentSuccess(request, env, ctx);
    } else if (path === '/api/subscription/crypto/coinbase-create-order') {
      // 创建 Coinbase Commerce 支付订单
      if (request.method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const token = authHeader.substring(7);
        const userResult = await env.DB.prepare(`
          SELECT u.id FROM users u
          INNER JOIN user_sessions s ON u.id = s.user_id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();

        if (!userResult) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const body = await request.json();
        const price = calculatePriceForSubscription(body.duration_days, body.max_ips, env);
        const result = await createCoinbaseOrder(env, userResult.id, body.duration_days, body.max_ips, price);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response('Method Not Allowed', { status: 405 });
    } else if (path === '/api/subscription/crypto/coinbase-check-order') {
      // 查询 Coinbase 订单状态
      const orderId = url.searchParams.get('order_id');
      if (!orderId) {
        return new Response(JSON.stringify({ success: false, error: 'Missing order_id' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const result = await checkCoinbaseOrder(env, orderId);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (path === '/api/subscription/crypto/webhook') {
      // Coinbase Commerce Webhook 回调
      if (request.method === 'POST') {
        const result = await handleCoinbaseWebhook(request, env);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response('Method Not Allowed', { status: 405 });
    } else if (path === '/api/subscription/crypto/direct-create-order') {
      // 创建直接稳定币支付订单（USDT/USDC）
      if (request.method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const token = authHeader.substring(7);
        const userResult = await env.DB.prepare(`
          SELECT u.id FROM users u
          INNER JOIN user_sessions s ON u.id = s.user_id
          WHERE s.token = ? AND s.expires_at > datetime('now')
        `).bind(token).first();

        if (!userResult) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const body = await request.json();
        const price = calculatePriceForSubscription(body.duration_days, body.max_ips, env);
        const result = await createCryptoPaymentOrder(env, userResult.id, body.duration_days, body.max_ips, price, body.payment_method);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response('Method Not Allowed', { status: 405 });
    } else if (path === '/api/admin/crypto/confirm-payment') {
      // 管理员手动确认加密货币支付
      if (request.method === 'POST') {
        const adminKey = request.headers.get('X-Admin-Key');
        const body = await request.json();
        const order_id = body.order_id;
        const result = await confirmCryptoPayment(env, order_id, adminKey);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response('Method Not Allowed', { status: 405 });
    } else if (path.startsWith('/api/tickets')) {
      // User Ticket API
      if (path === '/api/tickets' && request.method === 'GET') {
        return await handleGetTickets(request, env);
      } else if (path === '/api/tickets' && request.method === 'POST') {
        return await handleCreateTicket(request, env);
      } else if (path.match(/^\/api\/tickets\/\d+$/) && request.method === 'GET') {
        const ticketId = path.split('/')[3];
        return await handleGetTicket(request, env, ticketId);
      } else if (path.match(/^\/api\/tickets\/\d+\/reply$/) && request.method === 'POST') {
        const ticketId = path.split('/')[3];
        return await handleReplyTicket(request, env, ticketId);
      } else if (path.match(/^\/api\/tickets\/\d+\/close$/) && request.method === 'POST') {
        const ticketId = path.split('/')[3];
        return await handleCloseTicket(request, env, ticketId);
      }
      return new Response('Not Found', { status: 404 });
    } else if (path === '/reset-password' || path === '/reset-password/' || path === '/reset-password/index' || path === '/reset-password/index.html') {
      // 重置密码页面
      return new Response(RESET_PASSWORD_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/subscription' || path === '/subscription/' || path === '/subscription/index' || path === '/subscription/index.html') {
      // 订阅购买页面 - 检查商城设置
      if (await isMallEnabled()) {
        return new Response(SUBSCRIPTION_HTML, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      } else {
        // 商城关闭，重定向到首页
        return Response.redirect(url.origin + '/', 302);
      }
    } else if (path === '/admin' || path === '/admin/' || path === '/admin/index' || path === '/admin/index.html') {
      // 管理后台页面（注入时区配置）
      const timezone = env.TIMEZONE || 'Asia/Shanghai';
      const htmlWithConfig = ADMIN_HTML.replace(
        '<script>',
        `<script>window.TIMEZONE = '${timezone}';\n`
      );
      return new Response(htmlWithConfig, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path.startsWith('/play/')) {
      // IP直连播放请求处理: /play/{link_id}/{hash}
      return await handleIPPlayRequest(request, env, ctx);
    } else if (path.startsWith('/live/')) {
      // 播放请求处理: /live/{prefix}/{token}/{hash}
      return await handleLiveRequest(request, env, ctx);
    } else if (path.startsWith('/sub/') && path.endsWith('.txt')) {
      // 订阅请求处理: /sub/{code}.txt (txt format)
      return await handleSubRequestTxt(request, env, ctx);
    } else if (path.startsWith('/sub/') && path.endsWith('.m3u')) {
      // 订阅请求处理: /sub/{code}.m3u
      return await handleSubRequest(request, env, ctx);
    } else if (path === '/favorites.m3u' || path === '/favorites') {
      // 收藏M3U下载（无需验证）
      return await handleFavoritesM3U(env);
    } else if (path.startsWith('/admin/')) {
      // 管理后台API处理
      return await handleAdminRequest(request, env, ctx);
    } else if (path === '/sitemap.xml') {
      // 优先从 KV 缓存读取 sitemap
      try {
        const cacheResult = await getSitemapFromCache(env);
        if (cacheResult.sitemap) {
          return new Response(cacheResult.sitemap, {
            headers: {
              'Content-Type': 'application/xml; charset=utf-8',
              'Cache-Control': 'public, max-age=86400' // 24小时
            }
          });
        }
      } catch (e) {
        console.error('Sitemap: KV cache read failed:', e);
      }

      // KV没有缓存，从 KV 频道缓存生成完整的 sitemap
      console.log('Sitemap: KV cache miss, generating from channel cache...');
      try {
        const baseUrl = url.origin || 'https://iptv-search.com';
        const today = new Date().toISOString().split('T')[0];

        // 从 KV 缓存获取所有频道和分组
        const channelsResult = await getAllChannels(env);
        const groupsResult = await getAllGroups(env);
        const allChannels = channelsResult.channels || [];
        const allGroups = groupsResult.groups || [];

        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // 静态页面
        const staticPages = [
          { loc: '/', priority: '1.0', changefreq: 'daily' },
          { loc: '/favorites', priority: '0.8', changefreq: 'weekly' },
          { loc: '/account', priority: '0.6', changefreq: 'monthly' },
          { loc: '/tutorial', priority: '0.7', changefreq: 'monthly' },
          { loc: '/llms.txt', priority: '0.3', changefreq: 'weekly' },
          { loc: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
          { loc: '/terms', priority: '0.5', changefreq: 'yearly' },
          { loc: '/usa-iptv', priority: '0.8', changefreq: 'weekly' },
          { loc: '/uk-iptv-plans', priority: '0.8', changefreq: 'weekly' },
          { loc: '/android-iptv-app', priority: '0.8', changefreq: 'weekly' },
          { loc: '/free-iptv-app-review', priority: '0.8', changefreq: 'weekly' },
          { loc: '/carplay-aptv', priority: '0.7', changefreq: 'monthly' },
          { loc: '/middle-east-iptv', priority: '0.8', changefreq: 'weekly' },
          { loc: '/asia-iptv', priority: '0.8', changefreq: 'weekly' },
          { loc: '/europe-iptv', priority: '0.8', changefreq: 'weekly' },
          { loc: '/americas-iptv', priority: '0.8', changefreq: 'weekly' },
          { loc: '/oceania-iptv', priority: '0.8', changefreq: 'weekly' }
        ];

        staticPages.forEach(page => {
          sitemap += '  <url>\n';
          sitemap += `    <loc>${baseUrl}${page.loc}</loc>\n`;
          sitemap += `    <lastmod>${today}</lastmod>\n`;
          sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
          sitemap += `    <priority>${page.priority}</priority>\n`;
          sitemap += '  </url>\n';
        });

        // 分类页面（使用 KV 缓存中的分组数据，已有 slug）
        allGroups.forEach(group => {
          sitemap += '  <url>\n';
          sitemap += `    <loc>${baseUrl}/category/${encodeURIComponent(group)}</loc>\n`;
          sitemap += `    <lastmod>${today}</lastmod>\n`;
          sitemap += '    <changefreq>daily</changefreq>\n';
          sitemap += '    <priority>0.8</priority>\n';
          sitemap += '  </url>\n';
        });

        // 频道页面（限制 5000 个避免超限）
        const channelsToInclude = allChannels.slice(0, 5000);
        channelsToInclude.forEach(ch => {
          const channelSlug = slugify(ch.channel_name || '');
          sitemap += '  <url>\n';
          sitemap += `    <loc>${baseUrl}/channel/${channelSlug}</loc>\n`;
          sitemap += `    <lastmod>${today}</lastmod>\n`;
          sitemap += '    <changefreq>weekly</changefreq>\n';
          sitemap += '    <priority>0.7</priority>\n';
          sitemap += '  </url>\n';
        });

        sitemap += '</urlset>';

        console.log(`Sitemap: Generated ${allGroups.length} categories and ${channelsToInclude.length} channels from KV cache`);

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600' // 缓存1小时
          }
        });
      } catch (e) {
        console.error('Sitemap: KV channel cache fallback failed:', e);
      }

      // 最终降级：返回最基础的静态 sitemap
      const baseUrl = url.origin;
      const today = new Date().toISOString().split('T')[0];
      const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/favorites</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/plans</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/account</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${baseUrl}/tutorial</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${baseUrl}/privacy-policy</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>${baseUrl}/terms</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>${baseUrl}/usa-iptv</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/uk-iptv-plans</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/android-iptv-app</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/free-iptv-app-review</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/carplay-aptv</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>`;

      console.log('Sitemap: All fallbacks failed, returning minimal static sitemap');
      return new Response(staticSitemap, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600' // 缓存1小时
        }
      });
    } else if (path === '/robots.txt') {
      // Robots.txt
      return new Response(generateRobotsTxt(), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    } else if (path === '/ads.txt') {
      // AdSense 验证文件
      return new Response('google.com, pub-2205598928191137, DIRECT, f08c47fec0942fa0', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
      });
    } else if (path === '/privacy-policy') {
      // 隐私政策 - 使用静态页面
      return new Response(generateStaticPage(privacyTitle, privacyDesc, privacyStyles, privacyContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/terms') {
      // 服务条款 - 使用静态页面
      return new Response(generateStaticPage(termsTitle, termsDesc, termsStyles, termsContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/usa-iptv') {
      // USA IPTV 落地页
      return new Response(generateStaticPage(usaIptvTitle, usaIptvDesc, usaIptvStyles, usaIptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/uk-iptv-plans') {
      // UK IPTV 落地页
      return new Response(generateStaticPage(ukIptvTitle, ukIptvDesc, ukIptvStyles, ukIptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/android-iptv-app') {
      // Android IPTV App 推荐页
      return new Response(generateStaticPage(androidIptvTitle, androidIptvDesc, androidIptvStyles, androidIptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/free-iptv-app-review') {
      // 免费 IPTV App 评测页
      return new Response(generateStaticPage(freeIptvTitle, freeIptvDesc, freeIptvStyles, freeIptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/middle-east-iptv') {
      // Middle East IPTV 落地页
      return new Response(generateStaticPage(middleEastIptvTitle, middleEastIptvDesc, middleEastIptvStyles, middleEastIptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/asia-iptv') {
      // Asia IPTV 落地页
      return new Response(generateStaticPage(asiaIptvTitle, asiaIptvDesc, asiaIptvStyles, asiaIptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/europe-iptv') {
      // Europe IPTV 落地页
      return new Response(generateStaticPage(europeIptvTitle, europeIptvDesc, europeIptvStyles, europeIptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/americas-iptv') {
      // Americas IPTV 落地页
      return new Response(generateStaticPage(americasIptvTitle, americasIptvDesc, americasIptvStyles, americasIptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/oceania-iptv') {
      // Oceania IPTV 落地页
      return new Response(generateStaticPage(oceaniaIptvTitle, oceaniaIptvDesc, oceaniaIptvStyles, oceaniaIptvContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path.startsWith('/api/ads/')) {
      // 广告TS文件API: /api/ads/{id}.ts
      return await handleAdTsFile(request, env, ctx);
    } else if (path === '/api/test/db') {
      // 生产环境 D1 测试路由（需要简单验证）
      const testKey = url.searchParams.get('key');
      if (testKey !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      }

      try {
        return new Response(JSON.stringify({ success: true, message: 'D1 connection test removed' }), {
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
    } else if (path.startsWith('/test/')) {
      // 测试路由：只允许在本地开发环境使用（localhost 或 127.0.0.1）
      const clientIP = request.headers.get('cf-connecting-ip') || url.hostname;
      const isLocalhost = clientIP === '127.0.0.1' ||
                         clientIP === '::1' ||
                         url.hostname === 'localhost' ||
                         url.hostname.startsWith('127.') ||
                         url.hostname.startsWith('192.168.') ||
                         url.hostname.startsWith('10.');

      if (!isLocalhost) {
        return new Response(JSON.stringify({ success: false, error: 'Test routes only available in local development' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      }

      if (path === '/test/scheduled') {
        // 测试路由：模拟定时任务执行（根据当前时间判断执行哪个任务）
        const mockEvent = {
          scheduledTime: new Date()
        };
        try {
          await handleScheduledEvent(mockEvent, env, ctx);
          return new Response(JSON.stringify({ success: true, message: 'Scheduled event executed based on current time' }), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } else if (path === '/test/force-scheduled') {
        // 测试路由：强制执行所有定时任务（忽略时间限制）
        const mockEvent = {
          scheduledTime: new Date()
        };
        try {
          const db = await initDB(env);
          console.log('[Test] Force executing data source sync...');
          await syncAllSources(db, env);
          console.log('[Test] Force executing cache refresh...');
          await refreshCache(db, env);
          return new Response(JSON.stringify({ 
            success: true, 
            message: 'All scheduled tasks completed (sync + cache refresh)' 
          }), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } else if (path === '/test/sync') {
        // 测试路由：手动触发数据源同步（绕过时间限制）
        try {
          const db = await initDB(env);
          await syncAllSources(db, env);
          return new Response(JSON.stringify({ success: true, message: 'Data source sync completed' }), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } else if (path === '/test/cache') {
        // 测试路由：手动触发缓存刷新（绕过时间限制）
        try {
          const db = await initDB(env);
          await refreshCache(db, env);
          return new Response(JSON.stringify({ success: true, message: 'Cache refresh completed' }), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } else if (path === '/test/sync-all') {
        // 测试路由：完整的同步+缓存刷新流程
        try {
          const db = await initDB(env);
          await syncAllSources(db, env);
          await refreshCache(db, env);
          return new Response(JSON.stringify({ success: true, message: 'Full sync and cache refresh completed' }), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } else if (path === '/test/d1') {
        // 测试路由：D1 数据库诊断（已移除）
        try {
          return new Response(JSON.stringify({ success: true, message: 'D1 connection test removed' }), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } else if (path === '/test/optimize-indexes') {
        // 测试路由：优化 channels 表索引，减少写入次数
        try {
          const db = await initDB(env);
          const action = url.searchParams.get('action');

          if (action === 'check') {
            // 查询当前所有索引
            const indexes = await db.prepare(`
              SELECT name FROM sqlite_master
              WHERE type='index' AND tbl_name='channels'
              ORDER BY name
            `).all();

            return new Response(JSON.stringify({
              success: true,
              action: 'check',
              count: indexes.results?.length || 0,
              indexes: indexes.results?.map(r => r.name) || []
            }), {
              headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });

          } else if (action === 'optimize') {
            // 查询优化前的索引
            const indexesBefore = await db.prepare(`
              SELECT name FROM sqlite_master
              WHERE type='index' AND tbl_name='channels'
            `).all();

            // 删除冗余索引（被组合索引覆盖的单列索引）
            await db.exec(`
              DROP INDEX IF EXISTS idx_channels_is_active;
              DROP INDEX IF EXISTS idx_channels_source_id;
            `);

            // 确保必要索引存在
            await db.exec(`
              CREATE INDEX IF NOT EXISTS idx_channel_hash ON channels(channel_hash);
              CREATE INDEX IF NOT EXISTS idx_channels_active_source ON channels(is_active, source_id);
              CREATE INDEX IF NOT EXISTS idx_channels_group_title ON channels(group_title);
              CREATE INDEX IF NOT EXISTS idx_channels_group_title_notnull ON channels(group_title)
                WHERE group_title IS NOT NULL AND group_title != '';
            `);

            // 查询优化后的索引
            const indexesAfter = await db.prepare(`
              SELECT name FROM sqlite_master
              WHERE type='index' AND tbl_name='channels'
              ORDER BY name
            `).all();

            return new Response(JSON.stringify({
              success: true,
              action: 'optimize',
              message: '索引优化完成',
              indexesBefore: indexesBefore.results?.map(r => r.name) || [],
              indexesAfter: indexesAfter.results?.map(r => r.name) || [],
              beforeCount: indexesBefore.results?.length || 0,
              afterCount: indexesAfter.results?.length || 0,
              writeReduction: '33% (从6个索引减少到4个索引)',
              note: '每次 INSERT/DELETE 操作的索引更新次数减少 2 次，写入性能提升约 33%'
            }), {
              headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });

          } else {
            return new Response(JSON.stringify({
              success: false,
              error: 'Missing action parameter. Use ?action=check or ?action=optimize'
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
          }
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } else {
        return await generate404Page(request, env);
      }
    } else {
      // 默认响应 - 所有未匹配路由
      return await generate404Page(request, env);
    }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },

  // 定时任务处理
  async scheduled(event, env, ctx) {
    await handleScheduledEvent(event, env, ctx);
  }
};
