// Cloudflare Worker 主入口文件
import { initDB } from './database.js';
import { handleLiveRequest } from './handlers/live.js';
import { handleSubRequest } from './handlers/sub.js';
import { handleAdminRequest } from './handlers/admin.js';
import { handleScheduledEvent } from './handlers/scheduler.js';
import { ADMIN_HTML } from './admin-page.js';

export default {
  async fetch(request, env, ctx) {
    try {
      // 初始化数据库连接
      await initDB(env);

      const url = new URL(request.url);
      const path = url.pathname;

      // 路由处理
      if (path === '/' || path === '') {
        // 首页处理
        return new Response(`
          <html>
            <head>
              <title>电视直播服务</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1>电视直播服务</h1>
              <p>欢迎使用电视直播服务</p>
              <p>请使用您的订阅链接访问服务</p>
              <p>格式: https://sys.iptv-search.com/sub/{卡密}.m3u</p>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
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
      } else if (path.startsWith('/live/')) {
        // 播放请求处理: /live/{code}/{hash}
        return await handleLiveRequest(request, env, ctx);
      } else if (path.startsWith('/sub/') && path.endsWith('.m3u')) {
        // 订阅请求处理: /sub/{code}.m3u
        return await handleSubRequest(request, env, ctx);
      } else if (path.startsWith('/admin/')) {
        // 管理后台API处理
        return await handleAdminRequest(request, env, ctx);
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
