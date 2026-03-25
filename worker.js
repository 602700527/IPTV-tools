// Cloudflare Worker 主入口文件
import { initDB, createTables, isMallEnabled } from './database.js';
import { handleLiveRequest } from './handlers/live.js';
import { handleSubRequest } from './handlers/sub.js';
import { handleGetPlayLink, handleIPPlayRequest, handleGetPlayLinkStatus } from './handlers/ip-play.js';
import { handleAdminRequest, handleAdTsFile } from './handlers/admin.js';
import { handleScheduledEvent, manualSyncAll, syncAllSources, refreshCache } from './handlers/scheduler.js';
import { handleUserActivate } from './handlers/user.js';
import { handlePublicChannels, handlePublicPlay, handleChannelDebug, handleGetPlayToken, handlePublicConfig, handlePublicAnnouncement, handlePublicMallSettings } from './handlers/public.js';
import { handleFreeSubAPI } from './handlers/freesub-api.js';
import { handleGetPlans } from './handlers/plans-api.js';
import { handleSEOPage, generate404Page, isSearchEngineBot } from './handlers/seo-handler.js';
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
import { ADMIN_HTML } from './admin-page.js';
import { USER_ACTIVATE_HTML } from './user-activate.js';
import { ACCOUNT_HTML } from './account-page.js';
import { PLAYSTATION_HTML } from './playstation-page.js';
import { FREE_SUB_HTML } from './freesub-page.js';
import { SUBSCRIPTION_HTML } from './subscription-page.js';
import { PLANS_HTML } from './plans-page.js';
import { RESET_PASSWORD_HTML } from './reset-password-page.js';
import { TUTORIAL_HTML } from './tutorial-page.js';
import { generateRobotsTxt, generatePrivacyPolicy, generateTermsOfService } from './legal-pages.js';
import { getSystemConfig } from './database.js';
import { initCache } from './utils/cache.js';
import { LOGO_SVG, FAVICON_SVG, OG_IMAGE_SVG, APPLE_TOUCH_ICON_SVG, ICON_192_SVG, FAVICON_ICO_SVG } from './assets.js';
import { ALIPAY_PNG_DATA, WECHAT_PAY_PNG_DATA } from './image-data.js';
import {
  createCoinbaseOrder,
  checkCoinbaseOrder,
  handleCoinbaseWebhook,
  createCryptoPaymentOrder,
  confirmCryptoPayment
} from './handlers/crypto-payment.js';

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
      // SEO: 如果是搜索引擎爬虫，返回带数据的静态 HTML
      if (isSearchEngineBot(request)) {
        return await handleSEOPage(request, env);
      }
      // 首页 - 显示交互式播放站，添加安全头防止代理
      // 注入允许的域名配置和解密密钥
      const systemConfig = await getSystemConfig();
      const allowedDomains = [url.hostname];
      const decryptionKey = systemConfig.enable_url_encryption && systemConfig.url_encryption_key
        ? systemConfig.url_encryption_key
        : env.SECRET_KEY || 'default-secret-key';

      const htmlWithConfig = PLAYSTATION_HTML.replace(
        '<script>',
        `<script>window.ALLOWED_DOMAINS = ${JSON.stringify(allowedDomains)};\nwindow.DECRYPTION_KEY = '${decryptionKey}';\nwindow.ENABLE_URL_ENCRYPTION = ${systemConfig.enable_url_encryption};\n`
      );

      // 生成ETag（基于HTML内容）
      const encoder = new TextEncoder();
      const data = encoder.encode(htmlWithConfig);
      const hash = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hash));
      const etag = `"${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}"`;

      return new Response(htmlWithConfig, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=600', // 10分钟缓存
          'ETag': etag,
          'X-Frame-Options': 'SAMEORIGIN', // 允许同源iframe（某些广告需要）
          'X-Content-Type-Options': 'nosniff', // 防止MIME类型嗅探
          'Referrer-Policy': 'strict-origin-when-cross-origin', // 严格的引用策略
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()' // 限制敏感权限
        }
      });
    }

    // SEO 路由：/channel/{hash} 和 /category/{slug}（给搜索引擎爬虫）
    const channelMatch = path.match(/^\/channel\/([a-zA-Z0-9_-]+)$/);
    const categoryMatch = path.match(/^\/category\/([a-zA-Z0-9-]+)$/);
    if (channelMatch || categoryMatch) {
      return await handleSEOPage(request, env);
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
      // 教程页面
      return new Response(TUTORIAL_HTML, {
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
      // 网站地图（动态生成，包含所有频道和分类）
      return await handleSEOPage(request, env);
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
      // 隐私政策
      return new Response(generatePrivacyPolicy(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else if (path === '/terms') {
      // 服务条款
      return new Response(generateTermsOfService(), {
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
