// Cloudflare Worker 主入口文件
import { initDB } from './database.js';
import { handleLiveRequest } from './handlers/live.js';
import { handleSubRequest } from './handlers/sub.js';
import { handleAdminRequest } from './handlers/admin.js';
import { handleScheduledEvent } from './handlers/scheduler.js';
import { handleUserActivate } from './handlers/user.js';
import { ADMIN_HTML } from './admin-page.js';
import { USER_ACTIVATE_HTML } from './user-activate.js';
import { LANDING_HTML } from './landing-page.js';

export default {
  async fetch(request, env, ctx) {
    try {
      // 初始化数据库连接
      await initDB(env);

      const url = new URL(request.url);
      const path = url.pathname;

    // 路由处理
    if (path === '/' || path === '') {
      // 首页 - 显示门户页面
      return new Response(LANDING_HTML, {
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
