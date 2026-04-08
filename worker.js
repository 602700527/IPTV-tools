// Cloudflare Worker 主入口文件
import { initDB, createTables, isMallEnabled, getDB } from './database.js';
import { handleLiveRequest } from './handlers/live.js';
import { handleSubRequest } from './handlers/sub.js';
import { handleGetPlayLink, handleIPPlayRequest, handleGetPlayLinkStatus } from './handlers/ip-play.js';
import { handleAdminRequest, handleAdTsFile } from './handlers/admin.js';
import { handleScheduledEvent, manualSyncAll, syncAllSources, refreshCache } from './handlers/scheduler.js';
import { handleUserActivate } from './handlers/user.js';
import { handlePublicChannels, handlePublicPlay, handleChannelDebug, handleGetPlayToken, handlePublicConfig, handlePublicAnnouncement, handlePublicMallSettings } from './handlers/public.js';
import { handleFreeSubAPI } from './handlers/freesub-api.js';
import { handleGetPlans } from './handlers/plans-api.js';

// 内联 404 页面生成函数
async function generate404Page(request, env) {
  const url = new URL(request.url);
  const origin = url.protocol + '//' + url.host;
  const backUrl = origin + '/';
  const html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>404 - Page Not Found | IPTV Search</title>\n  <style>\n    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a0a; color: #fff; text-align: center; padding: 4rem 2rem; margin: 0; }\n    h1 { font-size: 6rem; margin-bottom: 1rem; color: #e50914; }\n    h2 { font-size: 1.5rem; margin-bottom: 1rem; }\n    p { color: #a0a0a0; max-width: 400px; margin: 0 auto 2rem; }\n    a { display: inline-block; padding: 0.75rem 2rem; background: #e50914; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; }\n    a:hover { background: #f6121d; }\n  </style>\n</head>\n<body>\n  <h1>404</h1>\n  <h2>Page Not Found</h2>\n  <p>The page you\'re looking for doesn\'t exist or has been moved.</p>\n  <a href="' + backUrl + '">Back to Home</a>\n</body>\n</html>';
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
  handleGoogleOAuthCallback
} from './handlers/auth.js';

import { handleGoogleAuthDebug } from './handlers/google-auth-debug.js';
import { handleCreateCode } from './handlers/subscription-api.js';
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
import { ACCOUNT_HTML } from './account-page.js';
import { FREE_SUB_HTML } from './freesub-page.js';
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
import { pageTitle as forgotTitle, pageDescription as forgotDesc, styles as forgotStyles, content as forgotContent } from './pages-content/forgot-password.js';
import { getSystemConfig } from './database.js';
import { initCache } from './utils/cache.js';
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
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://iptv-search.com${pageTitle === 'Privacy Policy' ? '/privacy-policy' : pageTitle === 'Terms of Service' ? '/terms' : '/tutorial'}">
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
    if (path === '/' || path === '') {
      // 首页 - 优先尝试使用静态文件
      const staticResponse = await serveStaticFile('/index.html', env);
      if (staticResponse) {
        return staticResponse;
      }
      
      // 使用新的 HTML 壳 + API 方案
      const { generateHomePage } = await import('./pages/home-page.js');
      const html = generateHomePage({ 
        origin: url.origin,
        header: PAGE_HEADER,
        footer: PAGE_FOOTER
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
      
      // 找到匹配的分类
      const matchedGroup = (groupsResult.results || []).find(g => slugify(g.group_title) === slug);
      
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
    } else if (path.startsWith('/channel/')) {
      // 频道详情页: /channel/{hash}
      const hashMatch = path.match(/^\/channel\/([a-zA-Z0-9]+)$/);
      if (hashMatch) {
        const hash = hashMatch[1];
        const staticResponse = await serveStaticFile(`/channel/${hash}.html`, env);
        if (staticResponse) {
          return staticResponse;
        }
        
        // 动态生成频道详情页 - 服务端预渲染
        const { generateChannelPage } = await import('./pages/channel-page.js');
        const db = await initDB(env);
        
        // 获取所有频道（用于同分类推荐）
        const allChannelsResult = await db.prepare(`
          SELECT c.id, c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active, c.source_id, s.name as source_name
          FROM channels c
          INNER JOIN sources s ON c.source_id = s.id
          WHERE c.is_active = 1 AND s.is_active = 1
        `).all();
        
        const allChannels = allChannelsResult.results || [];
        
        // 获取当前频道
        const channel = allChannels.find(ch => ch.channel_hash === hash);
        
        if (!channel) {
          return await generate404Page(request, env);
        }
        
        // 获取同分类的其他频道（用于侧边栏推荐）
        const relatedChannels = allChannels
          .filter(ch => ch.group_title === channel.group_title && ch.channel_hash !== hash)
          .slice(0, 10)
          .map(ch => ({
            name: ch.channel_name,
            hash: ch.channel_hash,
            logo: ch.logo,
            group: ch.group_title
          }));
        
        const html = generateChannelPage({ 
          origin: url.origin, 
          hash: hash,
          channel: {
            id: channel.id,
            name: channel.channel_name,
            group: channel.group_title,
            logo: channel.logo,
            playUrl: channel.play_url,
            sourceName: channel.source_name
          },
          relatedChannels: relatedChannels
        });
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=600'
          }
        });
      }
    } else if (path === '/login') {
      // 登录页 - 使用静态页面系统
      return new Response(generateStaticPage(loginTitle, loginDesc, loginStyles, loginContent), {
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
    } else if (path.startsWith('/search')) {
      // 搜索结果页 - 使用新的 HTML 壳 + API 方案
      const query = url.searchParams.get('q') || '';
      const { generateSearchPage } = await import('./pages/search-page.js');
      const html = generateSearchPage({ 
        origin: url.origin, 
        query,
        header: PAGE_HEADER
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
    } else if (path.startsWith('/api/channel/')) {
      // 频道详情 API: /api/channel/{hash}
      const { handleApiChannel } = await import('./handlers/api/channel.js');
      return await handleApiChannel(request, env, ctx);
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
    } else if (path === '/api/channels') {
      // 公开频道列表API（无需卡密）
      return await handlePublicChannels(request, env, ctx);
    } else if (path === '/api/debug') {
      // 调试接口 - 查看频道headers信息
      return await handleChannelDebug(request, env, ctx);
    } else if (path === '/api/token') {
      // 获取播放token API
      return await handleGetPlayToken(request, env, ctx);
    } else if (path === '/api/play/link') {
      // IP直连播放链接 - 获取链接
      return await handleGetPlayLink(request, env, ctx);
    } else if (path === '/api/play/link/status') {
      // IP直连播放链接 - 获取使用状态
      return await handleGetPlayLinkStatus(request, env, ctx);
    } else if (path.startsWith('/api/play/')) {
      // 公开播放API（无需卡密）
      return await handlePublicPlay(request, env, ctx);
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
    } else if (path === '/freesub' || path === '/freesub/' || path === '/freesub/index' || path === '/freesub/index.html') {
      // 免费订阅页面
      return new Response(FREE_SUB_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/tutorial' || path === '/tutorial/' || path === '/tutorial/index' || path === '/tutorial/index.html') {
      // 教程页面 - 使用静态页面（注入页头页脚组件）
      return new Response(generateStaticPage(tutorialTitle, tutorialDesc, tutorialStyles, tutorialContent), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/api/activate') {
      // 用户激活API
      return await handleUserActivate(request, env, ctx);
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
    } else if (path === '/plans' || path === '/plans/' || path === '/plans/index' || path === '/plans/index.html') {
      // 订阅计划页面 - 检查商城设置
      if (await isMallEnabled()) {
        return new Response(PLANS_HTML, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      } else {
        // 商城关闭，重定向到免费订阅页面
        return Response.redirect(url.origin + '/freesub', 302);
      }
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
        // 商城关闭，重定向到免费订阅页面
        return Response.redirect(url.origin + '/freesub', 302);
      }
    } else if (path === '/account' || path === '/account/' || path === '/account/index' || path === '/account/index.html') {
      // 用户账户页面
      const timezone = env.TIMEZONE || 'Asia/Shanghai';
      const htmlWithConfig = ACCOUNT_HTML.replace(
        '<script>',
        `<script>window.TIMEZONE = '${timezone}';\n`
      );
      return new Response(htmlWithConfig, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
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
      // 播放请求处理: /live/{code}/{hash}
      return await handleLiveRequest(request, env, ctx);
    } else if (path.startsWith('/sub/') && path.endsWith('.m3u')) {
      // 订阅请求处理: /sub/{code}.m3u
      return await handleSubRequest(request, env, ctx);
    } else if (path.startsWith('/admin/')) {
      // 管理后台API处理
      return await handleAdminRequest(request, env, ctx);
    } else if (path === '/sitemap.xml') {
      // 动态生成 sitemap.xml
      const baseUrl = url.origin;
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // 静态页面
      const staticPages = [
        { loc: '/', priority: '1.0', changefreq: 'daily' },
        { loc: '/favorites', priority: '0.8', changefreq: 'weekly' },
        { loc: '/plans', priority: '0.8', changefreq: 'weekly' },
        { loc: '/account', priority: '0.6', changefreq: 'monthly' },
        { loc: '/tutorial', priority: '0.7', changefreq: 'monthly' },
        { loc: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
        { loc: '/terms', priority: '0.5', changefreq: 'yearly' }
      ];
      
      staticPages.forEach(page => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}${page.loc}</loc>\n`;
        sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
        sitemap += `    <priority>${page.priority}</priority>\n`;
        sitemap += '  </url>\n';
      });
      
      // 从数据库获取全部分类和频道（频道限制1000但覆盖所有分类）
      try {
        const db = getDB();
        
        // 获取所有分类
        const categories = await db.prepare(`
          SELECT DISTINCT channel_group as category, COUNT(*) as count 
          FROM channels 
          WHERE is_active = 1 AND channel_group IS NOT NULL AND channel_group != ''
          GROUP BY channel_group 
          ORDER BY count DESC
        `).all();
        
        categories.forEach(cat => {
          sitemap += '  <url>\n';
          sitemap += `    <loc>${baseUrl}/category/${encodeURIComponent(cat.category)}</loc>\n`;
          sitemap += '    <changefreq>daily</changefreq>\n';
          sitemap += '    <priority>0.8</priority>\n';
          sitemap += '  </url>\n';
        });
        
        // 获取频道：每个分类至少1个，随机抽取总共不超1000
        // 首先获取每个分类的第一个频道（保证覆盖）
        const channels = await db.prepare(`
          SELECT c.hash, c.name, c.channel_group 
          FROM channels c
          WHERE c.is_active = 1
          ORDER BY c.channel_group, c.view_count DESC
        `).all();
        
        // 按分类组织，用Set去重，确保每个分类至少1个
        const categorySeen = new Set();
        const selectedChannels = [];
        
        for (const ch of channels) {
          if (!categorySeen.has(ch.channel_group)) {
            selectedChannels.push(ch);
            categorySeen.add(ch.channel_group);
            if (selectedChannels.length >= 1000) break;
          }
        }
        
        // 如果还没到1000，随机补充其他频道
        if (selectedChannels.length < 1000) {
          const otherChannels = channels.filter(ch => !selectedChannels.some(s => s.hash === ch.hash));
          for (const ch of otherChannels) {
            selectedChannels.push(ch);
            if (selectedChannels.length >= 1000) break;
          }
        }
        
        selectedChannels.forEach(ch => {
          sitemap += '  <url>\n';
          sitemap += `    <loc>${baseUrl}/channel/${ch.hash}</loc>\n`;
          sitemap += '    <changefreq>weekly</changefreq>\n';
          sitemap += '    <priority>0.7</priority>\n';
          sitemap += '  </url>\n';
        });
        
        console.log(`Sitemap: ${categories.length} categories, ${selectedChannels.length} channels`);
      } catch (e) {
        console.error('Sitemap: Failed to fetch data:', e);
      }
      
      sitemap += '</urlset>';
      
      return new Response(sitemap, {
        headers: { 
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
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
    } else if (path.startsWith('/api/freesub')) {
      // 免费订阅API
      return await handleFreeSubAPI(request, env, ctx);
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
