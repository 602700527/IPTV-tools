// 流媒体播放器 - Background Service Worker
const LAST_STREAM_URL_KEY = "lastStreamUrl";
const STREAM_HISTORY_KEY = "streamHistory";
const QUEUE_KEY = "iptv_pending_play_urls";
const MAX_HISTORY = 50;

console.log("[StreamPlugin-bg] Background script loaded at", new Date().toISOString());

// 消费存储队列：每次 background 醒来时检查是否有待处理的播放 URL
function drainQueue() {
  chrome.storage.local.get(QUEUE_KEY, function(items) {
    var queue = items[QUEUE_KEY] || [];
    // 兼容旧数据：过滤掉字符串，只保留对象（带 url + channelName）
    queue = queue.filter(function(q) { return q && typeof q === "object" && q.url; });
    if (queue.length === 0) return;
    console.log("[StreamPlugin-bg] Draining queue:", queue.length, "pending URLs");
    // 清空队列
    chrome.storage.local.set({[QUEUE_KEY]: []}, function() {
      // 播放最新的（队列最后一个）
      var item = queue.pop();
      handlePlayClipboardUrl(item.url, item.channelName).then(function() {
        console.log("[StreamPlugin-bg] Queue drained, played:", item.url.slice(0, 60));
      }).catch(function(err) {
        console.error("[StreamPlugin-bg] Failed to play queued URL:", err.message);
      });
    });
  });
}

// background 被唤醒时消费队列（点击扩展图标、context menu、或收到消息都会唤醒）
chrome.runtime.onInstalled.addListener(function() {
  console.log("[StreamPlugin-bg] 插件已安装");
  drainQueue(); // 安装后检查队列
  try {
    chrome.contextMenus.create({ id: "captureStream", title: "捕获当前页面播放地址", contexts: ["page","image","video"] });
    chrome.contextMenus.create({ id: "openPlayer", title: "在播放器中打开", contexts: ["selection"] });
  } catch (e) {
    console.warn("[StreamPlugin-bg] contextMenus.create failed:", e.message);
  }
});

// 监听 storage 变化，有新 URL 入队时立即消费
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area !== "local") return;
  if (changes[QUEUE_KEY]) {
    console.log("[StreamPlugin-bg] Queue changed, draining...");
    drainQueue();
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("[StreamPlugin-bg] Message received:", message.type, message.url || message.title || "");
  if (message.type === "STREAM_URL_FOUND") {
    handleStreamUrl(message.url, message.title, message.tabId, message.channelName);
    sendResponse({success:true});
  } else if (message.type === "PLAY_CLIPBOARD_URL") {
    handlePlayClipboardUrl(message.url).then(function(resp) {
      console.log("[StreamPlugin-bg] handlePlayClipboardUrl success");
      sendResponse(resp);
    }).catch(function(err){
      console.error("[StreamPlugin-bg] handlePlayClipboardUrl error:", err);
      sendResponse({error:err.message});
    });
    return true;
  } else if (message.type === "OPEN_PLAYER_TAB") {
    openPlayerTab(message.url);
    sendResponse({success:true});
  } else if (message.type === "GET_LAST_STREAM") {
    chrome.storage.local.get([LAST_STREAM_URL_KEY], function(items) {
      sendResponse({url: items[LAST_STREAM_URL_KEY]||""});
    });
    return true;
  }
  return false;
});

// 从剪贴板读取URL并打开新标签页播放（channelName 可选，会作为 ?name= 参数带到 player.html）
async function handlePlayClipboardUrl(url, channelName) {
  var cleanUrl = cleanStreamUrl(url);
  if (!cleanUrl) throw new Error("无效的播放地址");

  // 保存到最近和歷史
  await chrome.storage.local.set({lastStreamUrl: cleanUrl});
  var history = (await chrome.storage.local.get(STREAM_HISTORY_KEY)).streamHistory || [];
  var entry = {
    url: cleanUrl,
    channelName: channelName || "",
    title: (typeof document !== 'undefined' ? document.title : '') || cleanUrl,
    timestamp: Date.now(),
    type: detectStreamType(cleanUrl)
  };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
  await chrome.storage.local.set({streamHistory: history});

  // 打开新标签页播放（带上频道名）
  await openPlayerTab(cleanUrl, channelName);
  return {success:true};
}

// 打开播放器页面（复用已有标签或新建）
// channelName 可选；传入后会作为 ?name= 参数带到 player.html
function openPlayerTab(url, channelName) {
  console.log("[StreamPlugin-bg] openPlayerTab called with:", url, "name:", channelName);
  // 同时写 storage 作为"signal log"，DevTools 看不到时也能通过 storage 验证
  chrome.storage.local.set({lastDebugEvent: {ts: Date.now(), type: "openPlayerTab_called", url: url}});
  return new Promise(function(resolve) {
    var playerUrl = chrome.runtime.getURL("pages/player.html") + "?url=" + encodeURIComponent(url);
    if (channelName) playerUrl += "&name=" + encodeURIComponent(channelName);
    console.log("[StreamPlugin-bg] playerUrl:", playerUrl);

    // 先查找已有的player标签页
    chrome.tabs.query({url: chrome.runtime.getURL("pages/player.html") + "*"}, function(tabs) {
      console.log("[StreamPlugin-bg] Existing player tabs:", tabs ? tabs.length : "null");
      if (tabs && tabs.length > 0) {
        // 复用已有标签
        chrome.tabs.update(tabs[0].id, {url: playerUrl, active: true}, function() {
          console.log("[StreamPlugin-bg] Reused tab:", tabs[0].id);
          chrome.storage.local.set({lastDebugEvent: {ts: Date.now(), type: "reused_tab", tabId: tabs[0].id}});
          resolve();
        });
      } else {
        // 新建标签 — 必须传 callback 才能知道成功/失败
        chrome.tabs.create({url: playerUrl, active: true}, function(tab) {
          if (chrome.runtime.lastError) {
            console.error("[StreamPlugin-bg] tabs.create error:", chrome.runtime.lastError.message);
            chrome.storage.local.set({lastDebugEvent: {ts: Date.now(), type: "tabs_create_error", error: chrome.runtime.lastError.message}});
          } else {
            console.log("[StreamPlugin-bg] Created new tab:", tab && tab.id);
            chrome.storage.local.set({lastDebugEvent: {ts: Date.now(), type: "created_tab", tabId: tab && tab.id}});
          }
          resolve();
        });
      }
    });
  });
}

function handleStreamUrl(url, title, tabId, channelName) {
  var cleanUrl = cleanStreamUrl(url);
  if (!cleanUrl) return;
  chrome.storage.local.set({lastStreamUrl: cleanUrl});
  chrome.storage.local.get(STREAM_HISTORY_KEY, function(items) {
    var history = items[STREAM_HISTORY_KEY] || [];
    var entry = {
      url: cleanUrl,
      channelName: channelName || "",
      title: title || cleanUrl,
      timestamp: Date.now(),
      type: detectStreamType(cleanUrl)
    };
    history.unshift(entry);
    if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
    chrome.storage.local.set({streamHistory: history});
    chrome.runtime.sendMessage({type:"STREAM_UPDATED", stream: entry}).catch(function(){});
  });
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "captureStream") {
    chrome.tabs.sendMessage(tab.id, {type:"DETECT_STREAMS"}).then(function(res) {
      if (res && res.urls && res.urls.length > 0) handleStreamUrl(res.urls[0], tab.title, tab.id);
    }).catch(function(){});
  } else if (info.menuItemId === "openPlayer" && info.selectionText) {
    handleStreamUrl(info.selectionText, "选中文本", tab.id);
  }
});

function cleanStreamUrl(url) {
  if (!url) return null;
  url = url.trim().replace(/^['"]|['"]$/g, "");
  return url.startsWith("http") ? url : null;
}

function detectStreamType(url) {
  var lower = url.toLowerCase();
  if (lower.includes(".m3u8")||lower.includes("hls")) return "hls";
  if (lower.includes(".flv")) return "flv";
  if (lower.includes("rtmp")) return "rtmp";
  if (lower.includes(".mpd")||lower.includes("dash")) return "dash";
  return "other";
}
