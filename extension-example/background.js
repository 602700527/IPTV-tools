// IPTV Helper - Background Service Worker
// 版本 2.0 - 支持CORS处理和更完善的请求头管理

// 存储多个源站的headers配置
let sourceHeaders = [];

// 跟踪已注入的标签页，避免重复注入
const injectedTabs = new Set();

// 监听扩展安装
chrome.runtime.onInstalled.addListener((details) => {
  // 清空注入状态（扩展重新加载后重新注入）
  injectedTabs.clear();

  if (details.reason === 'install') {
    console.log('[IPTV Helper] Extension installed');
    // 初始化默认配置
    sourceHeaders = [];
    chrome.storage.local.set({ sources: [] });

    // 安装后立即注入到所有标签页
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && (tab.url.startsWith('http') || tab.url.startsWith('file'))) {
          injectContentScript(tab.id, tab.url);
        }
      });
    });
  } else if (details.reason === 'update') {
    console.log('[IPTV Helper] Extension updated from', details.previousVersion);

    // 更新后也注入到所有标签页
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && (tab.url.startsWith('http') || tab.url.startsWith('file'))) {
          injectContentScript(tab.id, tab.url);
        }
      });
    });
  }
});

// 注入 content script 到指定标签页
function injectContentScript(tabId, url) {
  // 检查是否已经注入过
  if (injectedTabs.has(tabId)) {
    console.log('[Inject] Tab already injected, skipping:', tabId);
    return;
  }

  console.log('[Inject] Attempting to inject content scripts to tab:', tabId, url);

  // 注入 MAIN world 脚本
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['main-world.js'],
    world: 'MAIN'
  }, (results) => {
    if (chrome.runtime.lastError) {
      console.log('[Inject] Failed (MAIN):', tabId, url, '-', chrome.runtime.lastError.message);
    } else {
      console.log('[Inject] Success (MAIN):', tabId, url);
    }
  });

  // 注入 ISOLATED world 脚本
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content.js'],
    world: 'ISOLATED'
  }, (results) => {
    if (chrome.runtime.lastError) {
      console.log('[Inject] Failed (ISOLATED):', tabId, url, '-', chrome.runtime.lastError.message);
    } else {
      console.log('[Inject] Success (ISOLATED):', tabId, url);
      // 标记为已注入
      injectedTabs.add(tabId);
    }
  });
}

// 监听来自popup和content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Background] Message received:', request.action);

  if (request.action === 'updateHeaders') {
    sourceHeaders = request.sources || [];
    updateRules(sourceHeaders);
    sendResponse({ success: true });
    return true;
  } else if (request.action === 'getHeaders') {
    sendResponse({ sources: sourceHeaders });
    return true;
  } else if (request.action === 'autoAddHeaders') {
    console.log('[Background] Processing autoAddHeaders');
    console.log('[Background] Headers:', request.headers);
    console.log('[Background] URL:', request.url);

    // 网页播放时自动添加headers配置
    const result = autoAddHeaders(request.headers, request.url);
    sendResponse(result);

    console.log('[Background] autoAddHeaders response sent:', result);
    return true;
  } else if (request.action === 'addSingleConfig') {
    // 添加单个配置
    addSingleConfig(request.domain, request.headers);
    sendResponse({ success: true });
    return true;
  } else if (request.action === 'handleRequest') {
    // 处理跨域请求
    handleCorsRequest(request.url, request.init).then(sendResponse);
    return true; // 保持消息通道打开
  } else if (request.action === 'proxyRequest') {
    // 代理HTTP请求（解决Mixed Content问题）
    handleProxyRequest(request.url, request.headers).then(sendResponse);
    return true; // 保持消息通道打开
  } else if (request.action === 'ping') {
    sendResponse({ success: true, version: '3.1' });
    return true;
  } else if (request.action === 'injectHere') {
    // 手动注入到当前标签页
    if (sender.tab && sender.tab.id) {
      console.log('[ManualInject] Injecting content script to tab:', sender.tab.id);
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ['content.js']
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error('[ManualInject] Failed:', chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          console.log('[ManualInject] Success');
          sendResponse({ success: true });
        }
      });
      return true; // 保持消息通道打开
    } else {
      sendResponse({ success: false, error: 'No tab information' });
      return true;
    }
  }
});

// 自动添加headers配置（从网页接收）
function autoAddHeaders(headers, url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    console.log('[AutoAdd] Processing headers for:', domain);

    // 检查是否已存在
    const existingIndex = sourceHeaders.findIndex(s =>
      s.domain.toLowerCase() === domain.toLowerCase()
    );

    if (existingIndex >= 0) {
      // 检查headers是否相同，避免重复更新
      const existingHeaders = JSON.stringify(sourceHeaders[existingIndex].headers);
      const newHeadersStr = JSON.stringify(headers);

      if (existingHeaders === newHeadersStr) {
        console.log('[AutoAdd] Headers unchanged, skipping update');
        return { success: true, updated: false };
      }

      console.log('[AutoAdd] Updating existing domain config');
      sourceHeaders[existingIndex].headers = { ...headers };
    } else {
      // 自动添加新配置
      const newSource = {
        domain: domain,
        headers: headers,
        autoAdded: true,
        addedAt: Date.now()
      };

      sourceHeaders.push(newSource);
      console.log('[AutoAdd] Added new domain:', domain);
    }

    updateRules(sourceHeaders);

    // 保存到存储
    chrome.storage.local.set({ sources: sourceHeaders }, () => {
      // 静默保存，不输出日志
    });

    // 通知content scripts更新
    notifyContentScripts(headers, url);

    return { success: true, updated: true };
  } catch (e) {
    console.error('[AutoAdd] Error:', e);
    return { success: false, error: e.message };
  }
}

// 通知content scripts有新headers
function notifyContentScripts(headers, url) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && tab.url.startsWith('http')) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'addHeadersToPage',
          headers: headers,
          url: url
        }, (response) => {
          if (chrome.runtime.lastError) {
            // 某些tab可能没有content script
            console.log('[Notify] Tab', tab.id, 'no content script');
          }
        });
      }
    });
  });
}

// 添加单个配置
function addSingleConfig(domain, headers) {
  try {
    // 标准化域名
    let normalizedDomain = domain.trim();
    if (!normalizedDomain.startsWith('http://') && !normalizedDomain.startsWith('https://')) {
      normalizedDomain = 'https://' + normalizedDomain;
    }

    const urlObj = new URL(normalizedDomain);
    const finalDomain = urlObj.hostname;

    console.log('[AddConfig] 添加配置:', finalDomain);

    // 检查是否已存在
    const existingIndex = sourceHeaders.findIndex(s =>
      s.domain.toLowerCase() === finalDomain.toLowerCase()
    );

    if (existingIndex >= 0) {
      // 更新现有配置
      sourceHeaders[existingIndex] = {
        domain: finalDomain,
        headers: headers,
        autoAdded: false
      };
      console.log('[AddConfig] 更新现有配置');
    } else {
      // 添加新配置
      sourceHeaders.push({
        domain: finalDomain,
        headers: headers,
        autoAdded: false
      });
      console.log('[AddConfig] 添加新配置');
    }

    updateRules(sourceHeaders);

    // 保存
    chrome.storage.local.set({ sources: sourceHeaders });

  } catch (e) {
    console.error('[AddConfig] 错误:', e);
  }
}

// 处理代理请求（解决Mixed Content问题）
async function handleProxyRequest(url, headers) {
  console.log('[Proxy] V4 - Handling proxy request for:', url);
  console.log('[Proxy] V4 - Headers:', headers);
  console.log('[Proxy] V4 - Headers JSON:', JSON.stringify(headers));

  // 根据抓包信息分析，不设置 Referer 或者设为空
  const adjustedHeaders = { ...headers };
  if (adjustedHeaders['Referer']) {
    console.log('[Proxy] V4 - 原始 Referer:', adjustedHeaders['Referer']);
    // 尝试移除 Referer（某些服务器可能会检查 Referer）
    delete adjustedHeaders['Referer'];
    console.log('[Proxy] V4 - 已移除 Referer');
  }

  // 提取 URL 的查询部分，手动重新编码中文参数
  let finalUrl = url;
  try {
    const [baseUrl, queryString] = url.split('?');

    if (queryString) {
      console.log('[Proxy] V4 - 查询字符串:', queryString);

      // 检查是否包含中文
      const hasChinese = /[\u4e00-\u9fa5]/.test(queryString);
      console.log('[Proxy] V4 - 是否包含中文:', hasChinese);

      if (hasChinese) {
        // 使用 URLSearchParams 重新编码
        const params = new URLSearchParams(queryString);
        const newQueryString = params.toString();
        finalUrl = `${baseUrl}?${newQueryString}`;
        console.log('[Proxy] V4 - 重新编码后的 URL:', finalUrl);
      } else {
        console.log('[Proxy] V4 - 查询参数不包含中文，保持原样');
      }
    }
  } catch (e) {
    console.error('[Proxy] V4 - URL 编码处理失败:', e);
    finalUrl = url;
  }

  console.log('[Proxy] V4 - 最终 URL:', finalUrl);

  let lastError = null;

  // 只尝试 GET 方法（根据抓包信息，成功的请求是 GET）
  const methods = ['GET'];

  for (const method of methods) {
    console.log(`[Proxy] 尝试 ${method} URL:`, finalUrl);
    console.log(`[Proxy] ${method} Headers:`, JSON.stringify(adjustedHeaders));

    try {
      let fetchOptions = {
        method: method,
        headers: adjustedHeaders || {},
        redirect: 'follow',  // 重要：跟随重定向
        credentials: 'omit'
      };

      const response = await fetch(finalUrl, fetchOptions);
      console.log(`[Proxy] ${method} Response status:`, response.status);

      // 302 也会被 fetch 跟随重定向
      if (response.ok || response.status === 302 || response.status === 301 || response.status === 307 || response.status === 308) {
        // 获取响应体为ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // 将ArrayBuffer转为base64字符串
        const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));

        console.log(`[Proxy] ${method} 成功! 状态码: ${response.status}`);
        return {
          success: true,
          data: base64,
          mimeType: response.headers.get('Content-Type') || 'video/mp2t',
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        };
      }

      const mimeType = response.headers.get('Content-Type') || 'unknown';
      console.error(`[Proxy] ${method} HTTP error:`, response.status, mimeType);

      // 读取响应内容用于调试
      let errorContent = '';
      try {
        errorContent = await response.text();
        if (errorContent.length > 500) {
          errorContent = errorContent.substring(0, 500) + '...';
        }
        console.error(`[Proxy] ${method} Response body:`, errorContent);
      } catch (e) {
        console.error('[Proxy] Failed to read response body:', e);
      }

      lastError = {
        success: false,
        error: `HTTP ${response.status} - ${mimeType}`,
        status: response.status,
        mimeType: mimeType
      };

    } catch (error) {
      console.error(`[Proxy] ${method} Request failed:`, error);
      lastError = {
        success: false,
        error: error.message
      };
    }
  }

  // 所有方法都失败了，返回最后一个错误
  return lastError;
}

// 处理CORS请求
async function handleCorsRequest(url, init) {
  console.log('[CORS] Handling request for:', url);

  try {
    const response = await fetch(url, {
      ...init,
      mode: 'cors',
      credentials: 'include'
    });

    const data = await response.text();
    return {
      success: true,
      data: data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error('[CORS] Request failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 更新请求规则 - 支持多个源站和CORS
function updateRules(sources) {
  console.log('[UpdateRules] 开始更新规则，源站数量:', sources.length);

  // 为每个源站创建规则
  const rules = [];

  sources.forEach((source, index) => {
    const headerActions = Object.entries(source.headers)
      .map(([name, value]) => ({
        header: name,
        operation: 'set',
        value: String(value)
      }));

    // 构建域名匹配模式
    const domain = source.domain.trim();
    let hostname = domain;
    try {
      const urlObj = new URL(domain.startsWith('http') ? domain : 'https://' + domain);
      hostname = urlObj.hostname;
    } catch (e) {
      console.error('[UpdateRules] Invalid domain:', domain);
      return;
    }

    const domainFilter = hostname.replace(/\./g, '\\.');

    // 规则1: 媒体请求
    rules.push({
      id: index * 3 + 1,
      priority: 2,
      action: {
        type: 'modifyHeaders',
        requestHeaders: headerActions
      },
      condition: {
        urlFilter: `*://${domainFilter}/*`,
        resourceTypes: ['media', 'xmlhttprequest', 'main_frame', 'sub_frame', 'other']
      }
    });

    // 规则2: HLS播放列表请求
    rules.push({
      id: index * 3 + 2,
      priority: 3,
      action: {
        type: 'modifyHeaders',
        requestHeaders: headerActions
      },
      condition: {
        urlFilter: `*://${domainFilter}/*.m3u8*`,
        resourceTypes: ['xmlhttprequest', 'other', 'media']
      }
    });

    // 规则3: TS分片请求
    rules.push({
      id: index * 3 + 3,
      priority: 3,
      action: {
        type: 'modifyHeaders',
        requestHeaders: headerActions
      },
      condition: {
        urlFilter: `*://${domainFilter}/*.ts*`,
        resourceTypes: ['xmlhttprequest', 'other', 'media']
      }
    });
  });

  // 先移除所有旧规则
  chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
    const removeIds = existingRules.map(r => r.id);

    console.log('[UpdateRules] 移除旧规则:', removeIds.length, '条');
    console.log('[UpdateRules] 添加新规则:', rules.length, '条');

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: removeIds,
      addRules: rules
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('[UpdateRules] 更新规则失败:', chrome.runtime.lastError);
      } else {
        console.log('[UpdateRules] 规则更新成功');
      }
    });
  });
}

// 初始化时加载保存的多个源配置
chrome.storage.local.get(['sources'], (result) => {
  if (result.sources && result.sources.length > 0) {
    sourceHeaders = result.sources;
    updateRules(sourceHeaders);
    console.log('[Init] 加载', sourceHeaders.length, '个源配置');
  } else {
    console.log('[Init] 没有保存的源配置');
  }
});

// 监听标签页更新，确保content script加载
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 当页面URL改变时，清除注入状态
  if (changeInfo.status === 'loading' && tab.url) {
    injectedTabs.delete(tabId);
  }

  if (changeInfo.status === 'complete' && tab.url) {
    // 注入到所有支持的协议
    if (tab.url.startsWith('http://') || tab.url.startsWith('https://') || tab.url.startsWith('file://')) {
      injectContentScript(tabId, tab.url);
    }
  }
});

// 监听标签页关闭，清理注入状态
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
  console.log('[TabRemoved] Tab closed:', tabId);
});

// 监听扩展图标点击
chrome.action.onClicked.addListener((tab) => {
  console.log('[Action] Extension icon clicked on tab:', tab.id);

  // 手动注入 content script
  if (tab.url) {
    injectContentScript(tab.id, tab.url);
  }
});

console.log('[IPTV Helper] Background service worker initialized');
