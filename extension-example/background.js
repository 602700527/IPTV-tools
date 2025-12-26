// IPTV Helper - Background Service Worker
// 版本 2.0 - 支持CORS处理和更完善的请求头管理

// 存储多个源站的headers配置
let sourceHeaders = [];

// 监听扩展安装
chrome.runtime.onInstalled.addListener((details) => {
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
    }
  });
}

// 监听来自popup和content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[IPTV Helper] Message received:', request.action);

  if (request.action === 'updateHeaders') {
    sourceHeaders = request.sources || [];
    updateRules(sourceHeaders);
    sendResponse({ success: true });
  } else if (request.action === 'getHeaders') {
    sendResponse({ sources: sourceHeaders });
  } else if (request.action === 'autoAddHeaders') {
    // 网页播放时自动添加headers配置
    autoAddHeaders(request.headers, request.url);
    sendResponse({ success: true });
  } else if (request.action === 'addSingleConfig') {
    // 添加单个配置
    addSingleConfig(request.domain, request.headers);
    sendResponse({ success: true });
  } else if (request.action === 'handleRequest') {
    // 处理跨域请求
    handleCorsRequest(request.url, request.init).then(sendResponse);
    return true; // 保持消息通道打开
  } else if (request.action === 'ping') {
    sendResponse({ success: true, version: '2.1' });
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
    }
  }
});

// 自动添加headers配置（从网页接收）
function autoAddHeaders(headers, url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    console.log('[AutoAdd] 接收到headers for:', domain, headers);

    // 检查是否已存在
    const existingIndex = sourceHeaders.findIndex(s =>
      s.domain.toLowerCase() === domain.toLowerCase()
    );

    if (existingIndex >= 0) {
      console.log('[AutoAdd] 域名已存在，更新配置');
      sourceHeaders[existingIndex].headers = { ...headers };
    } else {
      // 自动添加新配置
      const newSource = {
        domain: domain,
        headers: headers,
        autoAdded: true, // 标记为自动添加
        addedAt: Date.now()
      };

      sourceHeaders.push(newSource);
      console.log('[AutoAdd] 自动添加新源站:', domain);
    }

    updateRules(sourceHeaders);

    // 保存到存储
    chrome.storage.local.set({ sources: sourceHeaders }, () => {
      console.log('[AutoAdd] 已保存到存储');
    });

    // 通知content scripts更新
    notifyContentScripts(headers, url);

  } catch (e) {
    console.error('[AutoAdd] 错误:', e);
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
  if (changeInfo.status === 'complete' && tab.url) {
    // 注入到所有支持的协议
    if (tab.url.startsWith('http://') || tab.url.startsWith('https://') || tab.url.startsWith('file://')) {
      injectContentScript(tabId, tab.url);
    }
  }
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
