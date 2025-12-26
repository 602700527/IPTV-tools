// IPTV Helper - Content Script
// 用于处理CORS跨域问题和请求头注入

console.log('[IPTV Helper] Content script loaded in ISOLATED world');

// 监听来自 MAIN world 的消息
window.addEventListener('message', (event) => {
  // 只处理来自扩展的消息
  if (!event.data || !event.data.bridgeId) return;

  console.log('[IPTV Helper] Received bridge message:', event.data.action);

  // 处理 getHeaders 请求
  if (event.data.action === 'getHeaders') {
    const url = event.data.url;

    chrome.storage.local.get(['sources'], (result) => {
      const sources = result.sources || [];

      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        const matchedSource = sources.find(s => {
          const sourceDomain = s.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
          return hostname.includes(sourceDomain) || sourceDomain.includes(hostname);
        });

        // 响应给 MAIN world
        window.postMessage({
          bridgeId: event.data.bridgeId,
          requestId: event.data.requestId,
          action: 'getHeaders',
          headers: matchedSource ? matchedSource.headers : null
        }, '*');

      } catch (e) {
        console.error('[IPTV Helper] getHeaders error:', e);
        window.postMessage({
          bridgeId: event.data.bridgeId,
          requestId: event.data.requestId,
          action: 'getHeaders',
          headers: null
        }, '*');
      }
    });
  }

  // 处理 addHeaders 请求
  if (event.data.action === 'addHeaders') {
    const headers = event.data.headers;
    const url = event.data.url;

    console.log('[IPTV Helper] Sending headers to extension:', headers);

    chrome.runtime.sendMessage({
      action: 'autoAddHeaders',
      headers: headers,
      url: url
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[IPTV Helper] addHeaders error:', chrome.runtime.lastError);

        // 响应错误给 MAIN world
        window.postMessage({
          bridgeId: event.data.bridgeId,
          requestId: event.data.requestId,
          action: 'addHeaders',
          success: false,
          error: chrome.runtime.lastError.message
        }, '*');
      } else {
        console.log('[IPTV Helper] addHeaders success');

        // 响应成功给 MAIN world
        window.postMessage({
          bridgeId: event.data.bridgeId,
          requestId: event.data.requestId,
          action: 'addHeaders',
          success: true
        }, '*');
      }
    });
  }
});

(function() {
  'use strict';

  // 从storage获取配置的headers
  function getHeadersForUrl(url) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['sources'], (result) => {
        const sources = result.sources || [];
        try {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname;

          // 查找匹配的域名配置
          const matchedSource = sources.find(s => {
            const sourceDomain = s.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
            return hostname.includes(sourceDomain) || sourceDomain.includes(hostname);
          });

          if (matchedSource) {
            console.log('[IPTV Helper] Matched headers for:', hostname, matchedSource.headers);
            resolve(matchedSource.headers);
          } else {
            resolve(null);
          }
        } catch (e) {
          console.error('[IPTV Helper] Error parsing URL:', e);
          resolve(null);
        }
      });
    });
  }

  // 拦截fetch请求以添加自定义headers并处理CORS
  const originalFetch = window.fetch;
  window.fetch = async function(input, init = {}) {
    const url = typeof input === 'string' ? input : input.url;

    // 只处理媒体请求和XHR请求
    if (url && (url.includes('.m3u8') || url.includes('.ts') || 
                url.includes('stream') || url.includes('playlist') ||
                url.match(/\.(mp4|webm|ogg)$/i))) {

      console.log('[IPTV Helper] Intercepting fetch for:', url);

      try {
        // 获取自定义headers
        const customHeaders = await getHeadersForUrl(url);

        if (customHeaders) {
          init.headers = init.headers || {};

          // 合并自定义headers
          for (const [key, value] of Object.entries(customHeaders)) {
            init.headers[key] = value;
          }

          console.log('[IPTV Helper] Applied headers:', init.headers);
        }
      } catch (e) {
        console.error('[IPTV Helper] Error getting headers:', e);
      }
    }

    try {
      const response = await originalFetch.call(this, input, init);

      // 处理CORS问题 - 如果遇到CORS错误，尝试通过background处理
      if (!response.ok && response.type === 'opaque') {
        console.log('[IPTV Helper] Detected opaque response (CORS issue):', url);

        // 通知background script处理
        chrome.runtime.sendMessage({
          action: 'handleRequest',
          url: url,
          init: init
        });
      }

      return response;
    } catch (error) {
      console.error('[IPTV Helper] Fetch error:', error);
      throw error;
    }
  };

  // 拦截XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._url = url;
    this._method = method;
    return originalOpen.apply(this, [method, url, ...args]);
  };

  XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    this._headers = this._headers || {};
    this._headers[header.toLowerCase()] = value;
    return originalSetRequestHeader.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = async function(body) {
    const url = this._url;

    // 只处理媒体相关请求
    if (url && (url.includes('.m3u8') || url.includes('.ts') ||
                url.includes('stream') || url.includes('playlist'))) {

      console.log('[IPTV Helper] Intercepting XHR for:', url);

      try {
        // 获取自定义headers
        const customHeaders = await getHeadersForUrl(url);

        if (customHeaders) {
          this._headers = this._headers || {};

          // 合并自定义headers
          for (const [key, value] of Object.entries(customHeaders)) {
            this._headers[key.toLowerCase()] = value;
          }

          console.log('[IPTV Helper] Applied XHR headers:', this._headers);
        }
      } catch (e) {
        console.error('[IPTV Helper] Error getting XHR headers:', e);
      }
    }

    return originalSend.apply(this, arguments);
  };

  // 拦截HLS (m3u8) 请求
  if (typeof Hls !== 'undefined') {
    console.log('[IPTV Helper] Hls.js detected, patching...');

    // 覆盖Hls.js的config
    Hls.DefaultConfig.xhrSetup = function(xhr, url) {
      console.log('[IPTV Helper] Hls.js XHR setup for:', url);

      getHeadersForUrl(url).then(headers => {
        if (headers) {
          for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
          }
        }
      });
    };

    Hls.DefaultConfig.fetchSetup = function(fetchContext, initParams) {
      const url = fetchContext.url;

      getHeadersForUrl(url).then(headers => {
        if (headers) {
          initParams.headers = initParams.headers || {};
          for (const [key, value] of Object.entries(headers)) {
            initParams.headers[key] = value;
          }
        }
      });

      return { context: fetchContext, init: initParams };
    };
  }

  // 监听来自background的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'addHeadersToPage') {
      console.log('[IPTV Helper] Received headers from background:', request.headers);

      // 通知页面有新headers可用
      const event = new CustomEvent('iptvHeadersUpdated', {
        detail: { headers: request.headers, url: request.url }
      });
      window.dispatchEvent(event);

      sendResponse({ success: true });
    }
  });

  // 暴露API给页面使用
  window.IPTVHelper = {
    addHeaders: async function(headers) {
      console.log('[IPTV Helper] Adding headers from page:', headers);

      // 获取当前页面URL
      const url = window.location.href;

      // 通知background script
      chrome.runtime.sendMessage({
        action: 'autoAddHeaders',
        headers: headers,
        url: url
      }, (response) => {
        console.log('[IPTV Helper] Headers add response:', response);
      });
    },

    getHeaders: async function(url) {
      return await getHeadersForUrl(url || window.location.href);
    }
  };

  console.log('[IPTV Helper] Content script initialized');
  console.log('[IPTV Helper] API available at window.IPTVHelper');
})();
