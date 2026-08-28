// IPTV Search 站点专用 Content Script
// 仅在 https://iptv-search.com/* 和本地 dev (http://127.0.0.1:*/*) 注入
//
// 设计原则：
// - 不注入通用 content.js 的 test-play 按钮（站内已有专用按钮）
// - 不抢剪贴板、不弹窗干扰用户
// - 监听页面 postMessage('IPTV_SEARCH_TEST_PLAY') → 转发给 background
//   页面拿不到 chrome.runtime.id（只扩展上下文有），所以走 postMessage
//   中转是唯一的跨上下文通信路径

(function() {
  "use strict";
  var IS_DEV = /^http:\/\/127\.0\.0\.1(:\d+)?\//i.test(location.href);
  var IS_PROD = /^https:\/\/iptv-search\.com\//i.test(location.href);

  function logSite() {
    var env = IS_PROD ? "prod" : (IS_DEV ? "dev" : "unknown");
    console.log("[StreamPlugin] IPTV Search site detected — env:", env, location.pathname);
  }

  // 站内 test-play 按钮打的 postMessage，中转给 background 打开 player
  function relayTestPlay() {
    window.addEventListener("message", function(event) {
      // 不能用 event.source !== window 过滤：content script 在 isolated world，
      // 有自己的 window 对象，event.source 永远是 page window（不等于）。
      // 改靠 data.type 严格验证（自定义消息类型，外部页面不会触发）。
      var data = event.data;
      if (!data || data.type !== "IPTV_SEARCH_TEST_PLAY") return;
      var url = data.url;
      if (!url || typeof url !== "string" || url.indexOf("http") !== 0) return;

      console.log("[StreamPlugin] Relaying test-play to background:", url);
      chrome.runtime.sendMessage({type: "PLAY_CLIPBOARD_URL", url: url}).then(function() {
        window.dispatchEvent(new CustomEvent("IPTV_SEARCH_TEST_PLAY_OK", {detail: {url: url}}));
      }).catch(function(err) {
        console.warn("[StreamPlugin] Relay failed (extension context lost?):", err && err.message);
        window.dispatchEvent(new CustomEvent("IPTV_SEARCH_TEST_PLAY_FAIL", {detail: {url: url, error: err && err.message}}));
      });
    });
  }

  // 检测站内 test-play 按钮是否就绪，注入一个视觉指示器（可选）
  function enhanceExistingButton() {
    var btn = document.querySelector(".btn-test-play");
    if (!btn) return;

    btn.setAttribute("title", btn.title || "测试播放");
    btn.dataset.streamPluginBound = "1";
  }

  function init() {
    logSite();
    relayTestPlay();
    enhanceExistingButton();

    // 监听 DOM 变化，按钮可能是 SPA 动态注入的
    var observer = new MutationObserver(function() {
      var btn = document.querySelector(".btn-test-play");
      if (btn && !btn.dataset.streamPluginBound) {
        enhanceExistingButton();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();