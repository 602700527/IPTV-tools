// Cloudflare Worker 主入口文件
import { initDB, createTables } from './database.js';
import { handleLiveRequest } from './handlers/live.js';
import { handleSubRequest } from './handlers/sub.js';
import { handleAdminRequest, handleAdTsFile } from './handlers/admin.js';
import { handleScheduledEvent, manualSyncAll, syncAllSources, refreshCache } from './handlers/scheduler.js';
import { handleUserActivate } from './handlers/user.js';
import { handlePublicChannels, handlePublicPlay, handleChannelDebug, handleGetPlayToken, handlePublicConfig, handlePublicAnnouncement } from './handlers/public.js';
import { handleFreeSubAPI } from './handlers/freesub-api.js';
import { ADMIN_HTML } from './admin-page.js';
import { USER_ACTIVATE_HTML } from './user-activate.js';
import { PLAYSTATION_HTML } from './playstation-page.js';
import { FREE_SUB_HTML } from './freesub-page.js';
import { generateSitemap, generateRobotsTxt, generatePrivacyPolicy, generateTermsOfService } from './pages.js';
import { getSystemConfig } from './database.js';
import { initCache } from './utils/cache.js';
import { LOGO_SVG, FAVICON_SVG, OG_IMAGE_SVG } from './assets.js';
import { testD1Connection } from './test-d1.js';

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
    if (path === '/favicon.svg' || path === '/favicon.ico') {
      // Favicon SVG
      return new Response(FAVICON_SVG, {
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
    }

    // 路由处理
    if (path === '/' || path === '') {
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

      return new Response(htmlWithConfig, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Frame-Options': 'DENY', // 禁止在iframe中加载
          'Content-Security-Policy': "frame-ancestors 'none'", // 禁止被嵌入任何框架
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        }
      });
    } else if (path === '/api/config') {
      // 公开配置API - 获取前端需要的配置（如加密密钥）
      return await handlePublicConfig(request, env, ctx);
    } else if (path === '/api/announcement') {
      // 公开公告API
      return await handlePublicAnnouncement(request, env, ctx);
    } else if (path === '/api/channels') {
      // 公开频道列表API（无需卡密）
      return await handlePublicChannels(request, env, ctx);
    } else if (path === '/api/debug') {
      // 调试接口 - 查看频道headers信息
      return await handleChannelDebug(request, env, ctx);
    } else if (path === '/api/token') {
      // 获取播放token API
      return await handleGetPlayToken(request, env, ctx);
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
    } else if (path === '/api/activate') {
      // 用户激活API
      return await handleUserActivate(request, env, ctx);
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
      // 网站地图
      return new Response(generateSitemap(url.origin), {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' }
      });
    } else if (path === '/robots.txt') {
      // Robots.txt
      return new Response(generateRobotsTxt(), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
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
        const result = await testD1Connection(env);
        return new Response(JSON.stringify(result), {
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
        // 测试路由：D1 数据库诊断
        try {
          const result = await testD1Connection(env);
          return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } else {
        return new Response('Not Found', { status: 404 });
      }
    } else {
      // 默认响应
      return new Response('Not Found', { status: 404 });
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
