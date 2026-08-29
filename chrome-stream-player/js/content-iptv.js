// IPTV Search 站点专用 Content Script
// 仅在 https://iptv-search.com/* 和本地 dev (http://127.0.0.1:*/*) 注入
//
// 方案：
//   1. content script 读剪贴板 → 写入 chrome.storage.local（持久，service worker 重启不丢）
//   2. background 检测到 storage 变化 → 开 player 标签页
//   3. 即使 service worker 休眠，下次用户点击扩展图标时自动唤醒消费队列
//
// 优势：不依赖 chrome.runtime.sendMessage（service worker 休眠时失效）
//       不依赖 chrome.tabs（content script 上下文不可用）

(function() {
  "use strict";
  var IS_DEV = /^http:\/\/127\.0\.0\.1(:\d+)?\//i.test(location.href);
  var IS_PROD = /^https:\/\/iptv-search\.com\//i.test(location.href);

  var QUEUE_KEY = "iptv_pending_play_urls";
  var STREAM_PATTERNS = [
    /\.m3u8(\?.*)?$/i, /\.flv(\?.*)?$/i, /^rtmp[s]?:\/\/.+/i,
    /\.mpd(\?.*)?$/i, /\.(m3u8?|flv|mp4|ts|webm)(\?|$)/i
  ];
  var IPTV_SEARCH_LIVE_PATTERN = /^https?:\/\/(?:iptv-search\.com|127\.0\.0\.1(?::\d+)?|localhost(?::\d+)?)(?:\/live\/(?:vip|fav)\/\S+)/i;

  function isStream(url) {
    if (!url || typeof url !== "string") return false;
    if (url.startsWith("data:") || url.startsWith("blob:")) return false;
    if (IPTV_SEARCH_LIVE_PATTERN.test(url)) return true;
    for (var i = 0; i < STREAM_PATTERNS.length; i++) {
      if (STREAM_PATTERNS[i].test(url)) return true;
    }
    return false;
  }

  function isCopyButton(el) {
    if (!el) return false;
    var text = (el.textContent || "").trim().toLowerCase();
    if (text === "复制" || text === "复制链接" || text === "copy" || text === "copy link") return true;
    var cls = (el.className || "").toString().toLowerCase();
    var ttl = (el.getAttribute("title") || "").toLowerCase();
    var aria = (el.getAttribute("aria-label") || "").toLowerCase();
    if (cls.indexOf("copy") !== -1 || ttl.indexOf("复制") !== -1 || aria.indexOf("复制") !== -1) return true;
    return false;
  }

  // 读取剪贴板并写入存储队列（background 醒来会自动消费）
  function enqueueFromClipboard() {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      console.warn("[StreamPlugin] clipboard.readText unavailable");
      return;
    }
    navigator.clipboard.readText().then(function(text) {
      var t = (text || "").trim();
      console.log("[StreamPlugin] clipboard read:", t.slice(0, 60));
      if (!isStream(t)) {
        console.log("[StreamPlugin] not a stream URL, skipping");
        return;
      }
      // 写入持久化队列
      chrome.storage.local.get(QUEUE_KEY, function(items) {
        var queue = items[QUEUE_KEY] || [];
        // 去重：避免重复入队相同 URL
        if (queue.indexOf(t) === -1) {
          queue.push(t);
          // 限制队列长度
          if (queue.length > 10) queue = queue.slice(-10);
          chrome.storage.local.set({[QUEUE_KEY]: queue}, function() {
            console.log("[StreamPlugin] URL enqueued to storage (queue length:", queue.length + ")");
          });
        } else {
          console.log("[StreamPlugin] URL already in queue, skipping");
        }
      });
    }).catch(function(err) {
      console.warn("[StreamPlugin] clipboard read failed:", err && err.message);
    });
  }

  function logSite() {
    var env = IS_PROD ? "prod" : (IS_DEV ? "dev" : "unknown");
    console.log("[StreamPlugin] IPTV Search site detected — env:", env);
  }

  function init() {
    logSite();

    document.addEventListener("click", function(e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var node = t;
      for (var depth = 0; depth < 4 && node; depth++) {
        if (isCopyButton(node)) {
          console.log("[StreamPlugin] Copy button clicked, enqueueing...");
          // 等待 copyPlayLink() 完成（500ms），然后读剪贴板入队
          setTimeout(enqueueFromClipboard, 500);
          return;
        }
        node = node.parentElement;
      }
    }, true);

    // 兼容 Ctrl+C
    document.addEventListener("copy", function() {
      setTimeout(enqueueFromClipboard, 500);
    }, true);

    // 监听 storage 变化（同页面内多个 tab 也能感知）
    chrome.storage.onChanged.addListener(function(changes, area) {
      if (area !== "local") return;
      if (changes[QUEUE_KEY]) {
        console.log("[StreamPlugin] Storage changed, queue updated");
        // 如果当前有活跃的 background，它会自动处理；否则等下次交互
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
