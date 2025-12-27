// IPTV Helper - Content Script (ISOLATED World)
// Version: 3.8 - Added detailed logs for headers in main-world.js
// 简化版本，只保留最新实例

console.log('[IPTV Helper] Content script loaded, version: 3.8');

// 检查是否有旧实例，如果有则清理
if (window.IPTV_HELPER_CLEANUP && typeof window.IPTV_HELPER_CLEANUP === 'function') {
  console.log('[IPTV Helper] 🔧 Cleaning up old instances');
  try {
    window.IPTV_HELPER_CLEANUP();
  } catch (e) {
    console.error('[IPTV Helper] Cleanup error:', e);
  }
}

// 当前实例的清理函数
window.IPTV_HELPER_CLEANUP = function() {
  console.log('[IPTV Helper] Cleaning up this instance');
  if (window.iptvMessageHandler) {
    window.removeEventListener('message', window.iptvMessageHandler);
  }
  if (window.iptvCleanupInterval) {
    clearInterval(window.iptvCleanupInterval);
  }
};

// 防止重复初始化（使用最新实例）
if (window.IPTV_HELPER_INITIALIZED) {
  console.log('[IPTV Helper] ⚠️ Old instance detected, replacing');
  // 不退出，继续使用新实例替换旧的
}

window.IPTV_HELPER_INITIALIZED = Date.now(); // 使用时间戳标识当前实例

// 存储已处理的请求ID（使用window属性避免重复声明）
if (!window.iptvProcessedRequests) {
  window.iptvProcessedRequests = new Map();
}

// 定义消息处理函数（使用window属性避免重复声明）
if (window.iptvMessageHandler) {
  window.removeEventListener('message', window.iptvMessageHandler);
}

window.iptvMessageHandler = function(event) {
  console.log('[IPTV Helper ISOLATED] Received message:', event.data);

  // 只处理来自扩展的消息
  if (!event.data) {
    console.log('[IPTV Helper ISOLATED] Message has no data, skipping');
    return;
  }

  if (!event.data.bridgeId) {
    console.log('[IPTV Helper ISOLATED] Message has no bridgeId, skipping');
    return;
  }

  const { bridgeId, requestId } = event.data;
  const uid = `${bridgeId}-${requestId}`;

  // 忽略响应消息（响应没有url字段，只有请求才有url）
  // 只有请求消息才需要处理
  if (!event.data.url) {
    console.log('[IPTV Helper ISOLATED] ⏭ Skipping response message (no url field)');
    return; // 这是一个响应，不是请求
  }

  console.log('[IPTV Helper ISOLATED] ✅ Processing request:', event.data.action, 'uid:', uid);

  // 防止重复处理（使用短时间窗口）
  if (window.iptvProcessedRequests.has(uid)) {
    const lastTime = window.iptvProcessedRequests.get(uid);
    const now = Date.now();
    // 只有在500ms内才认为是重复
    if (now - lastTime < 500) {
      console.log('[IPTV Helper] ⏭ Skipping duplicate request');
      return;
    }
  }
  window.iptvProcessedRequests.set(uid, Date.now());

  // 处理 proxyRequest 请求（从MAIN world转发）
  if (event.data.action === 'proxyRequest') {
    const { url, headers } = event.data;

    console.log('[IPTV Helper ISOLATED] Processing proxyRequest for:', url);

    // 调用background处理代理请求
    chrome.runtime.sendMessage({
      action: 'proxyRequest',
      url: url,
      headers: headers
    }, (response) => {
      console.log('[IPTV Helper ISOLATED] Background proxy response:', response);

      const error = chrome.runtime.lastError;
      let blobUrl = null;

      // ISOLATED world可以创建blob URL
      if (response?.success && response?.data) {
        // 检查HTTP状态码和内容类型
        const status = response?.status || 0;
        const mimeType = response?.mimeType || '';

        // 只处理成功的视频响应（status=200且是视频类型）
        if (status === 200 && (mimeType.startsWith('video/') || mimeType.startsWith('application/'))) {
          try {
            // 将base64转回ArrayBuffer
            const binaryString = atob(response.data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            // 创建Blob和URL
            const blob = new Blob([bytes], { type: mimeType });
            blobUrl = URL.createObjectURL(blob);
            console.log('[IPTV Helper ISOLATED] Created blob URL:', blobUrl, 'mimeType:', mimeType);
          } catch (e) {
            console.error('[IPTV Helper ISOLATED] Failed to create blob:', e);
          }
        } else {
          // HTTP错误或非视频类型
          console.error('[IPTV Helper ISOLATED] Invalid response - Status:', status, 'MimeType:', mimeType);
        }
      }

      const responseData = {
        bridgeId: event.data.bridgeId,
        requestId: event.data.requestId,
        action: 'proxyRequest',
        success: response?.success && blobUrl !== null && !error,
        blobUrl: blobUrl,
        status: response?.status || null,
        headers: response?.headers || null,
        error: null
      };

      // 设置错误信息
      if (error) {
        responseData.error = error.message;
        responseData.success = false;
      } else if (!response?.success) {
        responseData.error = response?.error || 'Proxy request failed';
        responseData.success = false;
      } else if (!blobUrl) {
        // 没有创建blob URL（可能是404或非视频内容）
        const status = response?.status || 0;
        const mimeType = response?.mimeType || '';
        if (status >= 400) {
          responseData.error = `HTTP ${status} - ${mimeType || 'Server Error'}`;
        } else if (mimeType && !mimeType.startsWith('video/')) {
          responseData.error = `Invalid content type: ${mimeType}`;
        } else {
          responseData.error = 'Failed to create blob URL';
        }
        responseData.success = false;
      }

      console.log('[IPTV Helper ISOLATED] 📤 Posting response to MAIN world:', responseData);

      // 发送响应回MAIN world
      window.postMessage(responseData, '*');
    });
    return;
  }

  // 处理 addHeaders 请求
  if (event.data.action === 'addHeaders') {
    const { headers, url } = event.data;

    console.log('[IPTV Helper] Processing addHeaders');

    // 检查 chrome.runtime 是否可用
    if (!chrome?.runtime?.sendMessage) {
      console.warn('[IPTV Helper] ❌ chrome.runtime unavailable');

      // 直接发送失败响应
      window.postMessage({
        bridgeId: bridgeId,
        requestId: requestId,
        action: 'addHeaders',
        success: false,
        error: 'Extension context invalid'
      }, '*');
      return;
    }

    // 发送到 background
    chrome.runtime.sendMessage({
      action: 'autoAddHeaders',
      headers,
      url
    }, (response) => {
      console.log('[IPTV Helper] Background response:', response);
      const error = chrome.runtime.lastError;
      const success = response?.success;

      // 构造响应
      const responseData = {
        bridgeId: bridgeId,
        requestId: requestId,
        action: 'addHeaders',
        success: success && !error,
        error: null
      };

      if (error) {
        responseData.error = error.message;
        console.log('[IPTV Helper] ❌ Sending ERROR response');
      } else if (success) {
        console.log('[IPTV Helper] ✅ Sending SUCCESS response');
      } else {
        responseData.error = 'Failed';
        console.error('[IPTV Helper] ❌ Sending FAILED response');
      }

      // 发送响应
      console.log('[IPTV Helper ISOLATED] 📤 Posting response to MAIN world:', responseData);
      window.postMessage(responseData, '*');
      console.log('[IPTV Helper ISOLATED] ✅ Response posted, waiting for MAIN world to receive...');
    });
  }

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

        window.postMessage({
          bridgeId: event.data.bridgeId,
          requestId: event.data.requestId,
          action: 'getHeaders',
          headers: matchedSource?.headers || null
        }, '*');
      } catch (e) {
        window.postMessage({
          bridgeId: event.data.bridgeId,
          requestId: event.data.requestId,
          action: 'getHeaders',
          headers: null
        }, '*');
      }
    });
  }
};

// 添加事件监听器
window.addEventListener('message', window.iptvMessageHandler);

// 定时清理过期的请求ID（使用window属性避免重复声明）
if (window.iptvCleanupInterval) {
  clearInterval(window.iptvCleanupInterval);
}

window.iptvCleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [uid, timestamp] of window.iptvProcessedRequests) {
    if (now - timestamp > 10000) {
      window.iptvProcessedRequests.delete(uid);
    }
  }
}, 5000);

console.log('[IPTV Helper] ✅ Content script initialized');
