// IPTV Helper - Main World Script
// 在页面的 MAIN world 中运行，与页面共享 window 对象

(function() {
  'use strict';

  const CURRENT_VERSION = '3.8';

  // 使用 UUID 而不是 Date.now() 避免冲突
  const BRIDGE_ID = 'iptv-helper-' + crypto.randomUUID();
  let requestId = 0;

  console.log('[IPTV Helper] Main world script loading, version:', CURRENT_VERSION);
  console.log('[IPTV Helper] Bridge ID:', BRIDGE_ID);

  // 调试：全局消息监听器
  window.addEventListener('message', (event) => {
    console.log('[IPTV Helper MAIN] Global message received:', event.data);
  });

  // 跟踪所有活跃的 Promise
  const pendingRequests = new Map(); // Map<requestId, {resolve, reject, handler, timer}>

  // 页面卸载时清理所有请求
  window.addEventListener('beforeunload', () => {
    console.log('[IPTV Helper] Page unloading, cleaning up', pendingRequests.size, 'pending requests');

    for (const [id, { reject, handler, timer }] of pendingRequests.values()) {
      clearTimeout(timer);
      window.removeEventListener('message', handler);
      reject(new Error('Page unloading'));
    }
    pendingRequests.clear();
  });

  // 暴露 API 给页面使用
  window.IPTVHelper = {
    // 代理HTTP请求（解决Mixed Content问题）
    proxyRequest: async function(url, headers) {
      console.log('[IPTV Helper] proxyRequest called:', url);
      console.log('[IPTV Helper] proxyRequest headers:', headers);
      console.log('[IPTV Helper] proxyRequest headers JSON:', JSON.stringify(headers));

      return new Promise((resolve, reject) => {
        const id = ++requestId;

        const message = {
          bridgeId: BRIDGE_ID,
          requestId: id,
          action: 'proxyRequest',
          url: url,
          headers: headers
        };

        const handler = function(event) {
          console.log('[IPTV Helper MAIN] proxyRequest handler received:', event.data);

          // 过滤请求消息（有url字段），只处理响应消息（没有url字段）
          if (event.data.url) {
            console.log('[IPTV Helper MAIN] proxyRequest handler: Skipping request message (has url field)');
            return;
          }

          if (!event.data ||
              event.data.bridgeId !== BRIDGE_ID ||
              event.data.requestId !== id) {
            console.log('[IPTV Helper MAIN] proxyRequest handler: message mismatch');
            return;
          }

          console.log('[IPTV Helper MAIN] proxyRequest handler: MATCHED, success:', event.data.success, 'error:', event.data.error);

          clearTimeout(timer);
          window.removeEventListener('message', handler);
          pendingRequests.delete(id);

          if (event.data.success) {
            resolve(event.data);
          } else {
            reject(new Error(event.data.error || 'Proxy request failed'));
          }
        };

        const timer = setTimeout(() => {
          window.removeEventListener('message', handler);
          pendingRequests.delete(id);
          reject(new Error('Proxy request timeout'));
        }, 30000); // 30秒超时（视频流可能需要更长时间）

        pendingRequests.set(id, { resolve, reject, handler, timer });

        // 通过ISOLATED world发送（因为MAIN world无法访问chrome.runtime）
        window.addEventListener('message', handler);
        window.postMessage(message, '*');
      });
    },

    addHeaders: async function(headers, targetUrl) {
      const id = ++requestId;
      console.log('[IPTV Helper] addHeaders called, request ID:', id, 'targetUrl:', targetUrl);

      // 使用传入的URL，如果没有则使用当前页面URL
      const url = targetUrl || window.location.href;

      return new Promise((resolve, reject) => {
        const message = {
          bridgeId: BRIDGE_ID,
          requestId: id,
          action: 'addHeaders',
          headers: headers,
          url: url
        };

        // 监听响应
        const handler = function(event) {
          console.log('[IPTV Helper MAIN] Received message in handler:', event.data);

          // 只处理来自我们自己的响应
          if (!event.data) {
            console.log('[IPTV Helper MAIN] Message has no data, skipping');
            return;
          }

          // 忽略请求消息（响应消息有 error 或 success 字段，或者 headers 但没有 url）
          if (event.data.url) {
            console.log('[IPTV Helper MAIN] ⏭ Skipping request message (has url field)');
            return;
          }

          if (event.data.bridgeId !== BRIDGE_ID) {
            console.log('[IPTV Helper MAIN] Bridge ID mismatch:', event.data.bridgeId, '!=', BRIDGE_ID);
            return;
          }

          if (event.data.requestId !== id) {
            console.log('[IPTV Helper MAIN] Request ID mismatch:', event.data.requestId, '!=', id);
            return;
          }

          console.log('[IPTV Helper MAIN] ✅✅✅ MATCHED response for request:', id, 'success:', event.data.success);

          // 清理
          clearTimeout(timer);
          window.removeEventListener('message', handler);
          pendingRequests.delete(id);

          if (event.data.success === true) {
            console.log('[IPTV Helper MAIN] ✅✅✅ addHeaders SUCCESS, resolving promise');
            resolve();
          } else {
            console.error('[IPTV Helper MAIN] ❌ addHeaders FAILED:', event.data.error);
            reject(new Error(event.data.error || 'Failed'));
          }
        };

        // 超时处理
        const timer = setTimeout(() => {
          console.error('[IPTV Helper MAIN] ⏰⏰⏰ TIMEOUT for request:', id);
          window.removeEventListener('message', handler);
          pendingRequests.delete(id);
          reject(new Error('Timeout'));
        }, 5000);

        // 保存到 pending
        pendingRequests.set(id, { resolve, reject, handler, timer });

        // 注册handler监听器（必须在postMessage之前）
        console.log('[IPTV Helper] 🎧 Registering handler listener for request:', id);
        window.addEventListener('message', handler);

        // 通过 postMessage 发送到 ISOLATED world
        console.log('[IPTV Helper] 📤 Posting message to ISOLATED world:', message);
        window.postMessage(message, '*');
        console.log('[IPTV Helper] ✅ Message posted, waiting for response...');
      });
    },

    getHeaders: async function(url) {
      if (!url) url = window.location.href;

      const id = ++requestId;
      console.log('[IPTV Helper] getHeaders called, request ID:', id);

      return new Promise((resolve) => {
        const message = {
          bridgeId: BRIDGE_ID,
          requestId: id,
          action: 'getHeaders',
          url: url
        };

        const handler = function(event) {
          if (!event.data ||
              event.data.bridgeId !== BRIDGE_ID ||
              event.data.requestId !== id) {
            return;
          }

          clearTimeout(timer);
          window.removeEventListener('message', handler);
          pendingRequests.delete(id);
          resolve(event.data.headers || null);  // 确保返回null而不是undefined
        };

        const timer = setTimeout(() => {
          window.removeEventListener('message', handler);
          pendingRequests.delete(id);
          resolve(null);
        }, 5000);

        pendingRequests.set(id, { handler, timer });
        window.addEventListener('message', handler);  // 注册handler
        window.postMessage(message, '*');
      });
    },

    // 添加版本和 Bridge ID 信息
    version: CURRENT_VERSION,
    bridgeId: BRIDGE_ID
  };

  // 设置扩展可用标志
  window.EXTENSION_AVAILABLE = true;
  window.IPTVHelperReady = true;

  console.log('[IPTV Helper] ✅ IPTVHelper API available in MAIN world, version:', CURRENT_VERSION);
  console.log('[IPTV Helper] API methods:', Object.keys(window.IPTVHelper));

  // 触发自定义事件，通知页面扩展已就绪
  window.dispatchEvent(new CustomEvent('iptvExtensionReady', {
    detail: {
      version: CURRENT_VERSION,
      bridgeId: BRIDGE_ID,
      timestamp: Date.now()
    }
  }));

  console.log('[IPTV Helper] ✅ Extension ready event dispatched');
})();
