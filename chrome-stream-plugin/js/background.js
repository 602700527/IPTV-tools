// 流媒体播放器 - Background Service Worker
const LAST_STREAM_URL_KEY = "lastStreamUrl";
const STREAM_HISTORY_KEY = "streamHistory";
const MAX_HISTORY = 50;

console.log("[StreamPlugin-bg] Background script loaded at", new Date().toISOString());

chrome.runtime.onInstalled.addListener(function() {
  console.log("[StreamPlugin-bg] 插件已安装");
  try {
    chrome.contextMenus.create({ id: "captureStream", title: "捕获当前页面播放地址", contexts: ["page","image","video"] });
    chrome.contextMenus.create({ id: "openPlayer", title: "在播放器中打开", contexts: ["selection"] });
  } catch (e) {
    console.warn("[StreamPlugin-bg] contextMenus.create failed:", e.message);
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("[StreamPlugin-bg] Message received:", message.type, message.url || message.title || "");
  if (message.type === "STREAM_URL_FOUND") {
    handleStreamUrl(message.url, message.title, message.tabId);
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

// 从剪贴板读取URL并打开新标签页播放
async function handlePlayClipboardUrl(url) {
  var cleanUrl = cleanStreamUrl(url);
  if (!cleanUrl) throw new Error("无效的播放地址");
  
  // 保存到最近和歷史
  await chrome.storage.local.set({lastStreamUrl: cleanUrl});
  var history = (await chrome.storage.local.get(STREAM_HISTORY_KEY)).streamHistory || [];
  var entry = {url: cleanUrl, title: document.title||cleanUrl, timestamp: Date.now(), type: detectStreamType(cleanUrl)};
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
  await chrome.storage.local.set({streamHistory: history});
  
  // 打开新标签页播放
  await openPlayerTab(cleanUrl);
  return {success:true};
}

// 打开播放器页面（复用已有标签或新建）
function openPlayerTab(url) {
  console.log("[StreamPlugin-bg] openPlayerTab called with:", url);
  return new Promise(function(resolve) {
    var playerUrl = chrome.runtime.getURL("pages/player.html") + "?url=" + encodeURIComponent(url);
    console.log("[StreamPlugin-bg] playerUrl:", playerUrl);

    // 先查找已有的player标签页
    chrome.tabs.query({url: chrome.runtime.getURL("pages/player.html") + "*"}, function(tabs) {
      console.log("[StreamPlugin-bg] Existing player tabs:", tabs ? tabs.length : "null");
      if (tabs && tabs.length > 0) {
        // 复用已有标签
        chrome.tabs.update(tabs[0].id, {url: playerUrl, active: true}, function() {
          console.log("[StreamPlugin-bg] Reused tab:", tabs[0].id);
          resolve();
        });
        console.log("[StreamPlugin] Reusing player tab:", tabs[0].id);
        resolve();
      } else {
        // 新建标签
        chrome.tabs.create({url: playerUrl, active: true}, function(tab) {
          if (chrome.runtime.lastError) {
            console.error("[StreamPlugin-bg] tabs.create error:", chrome.runtime.lastError.message);
          } else {
            console.log("[StreamPlugin-bg] Created new tab:", tab && tab.id);
          }
          resolve();
        });
        console.log("[StreamPlugin] Opened new player tab");
      }
    });
  });
}

function handleStreamUrl(url, title, tabId) {
  var cleanUrl = cleanStreamUrl(url);
  if (!cleanUrl) return;
  chrome.storage.local.set({lastStreamUrl: cleanUrl});
  chrome.storage.local.get(STREAM_HISTORY_KEY, function(items) {
    var history = items[STREAM_HISTORY_KEY] || [];
    var entry = {url: cleanUrl, title: title||cleanUrl, timestamp: Date.now(), type: detectStreamType(cleanUrl)};
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
