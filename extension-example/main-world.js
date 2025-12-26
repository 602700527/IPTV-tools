// IPTV Helper - Main World Script
// 在页面的 MAIN world 中运行，与页面共享 window 对象

'use strict';

console.log('[IPTV Helper] Main world script loaded at', new Date().toISOString());

// 设置扩展可用标志
window.EXTENSION_AVAILABLE = true;
window.IPTVHelperReady = true;
console.log('[IPTV Helper] ✅ EXTENSION_AVAILABLE flag set in MAIN world');

// 创建与 ISOLATED world 的通信
const BRIDGE_ID = 'iptv-helper-bridge-' + Date.now();
let requestId = 0;

// 暴露 API 给页面使用
window.IPTVHelper = {
  addHeaders: async function(headers) {
    console.log('[IPTV Helper] addHeaders called:', headers);
    const url = window.location.href;

    return new Promise((resolve, reject) => {
      const id = ++requestId;
      const message = {
        bridgeId: BRIDGE_ID,
        requestId: id,
        action: 'addHeaders',
        headers: headers,
        url: url
      };

      // 通过 postMessage 发送到 ISOLATED world
      window.postMessage(message, '*');

      // 监听响应
      const handler = function(event) {
        if (event.data &&
            event.data.bridgeId === BRIDGE_ID &&
            event.data.requestId === id) {
          window.removeEventListener('message', handler);
          if (event.data.success) {
            console.log('[IPTV Helper] addHeaders success');
            resolve();
          } else {
            reject(new Error(event.data.error || 'Failed'));
          }
        }
      };

      window.addEventListener('message', handler);

      // 超时
      setTimeout(() => {
        window.removeEventListener('message', handler);
        reject(new Error('Timeout'));
      }, 5000);
    });
  },

  getHeaders: async function(url) {
    if (!url) url = window.location.href;

    console.log('[IPTV Helper] getHeaders called for:', url);

    return new Promise((resolve) => {
      const id = ++requestId;
      const message = {
        bridgeId: BRIDGE_ID,
        requestId: id,
        action: 'getHeaders',
        url: url
      };

      // 通过 postMessage 发送到 ISOLATED world
      window.postMessage(message, '*');

      // 监听响应
      const handler = function(event) {
        if (event.data &&
            event.data.bridgeId === BRIDGE_ID &&
            event.data.requestId === id) {
          window.removeEventListener('message', handler);
          resolve(event.data.headers);
        }
      };

      window.addEventListener('message', handler);

      // 超时
      setTimeout(() => {
        window.removeEventListener('message', handler);
        resolve(null);
      }, 5000);
    });
  }
};

console.log('[IPTV Helper] ✅ IPTVHelper API available in MAIN world');
console.log('[IPTV Helper] API methods:', Object.keys(window.IPTVHelper));

// 触发自定义事件，通知页面扩展已就绪
window.dispatchEvent(new CustomEvent('iptvExtensionReady', {
  detail: {
    version: '2.2',
    timestamp: Date.now()
  }
}));

console.log('[IPTV Helper] ✅ Extension ready event dispatched');
