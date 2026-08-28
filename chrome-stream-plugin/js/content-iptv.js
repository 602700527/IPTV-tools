// IPTV Search 站点专用 Content Script
// 仅在 https://iptv-search.com/* 和本地 dev (http://127.0.0.1:*/*) 注入
//
// 设计原则：
// - 不注入通用 content.js 的 test-play 按钮（站内已有专用按钮）
// - 不抢剪贴板、不弹窗干扰用户
// - 通过 chrome.runtime.sendMessage 复用 background 的 PLAY_CLIPBOARD_URL 路径
//   （站内 testPlayChannel() 已经直接调用，无需 content 脚本中转）

(function() {
  "use strict";
  var IS_DEV = /^http:\/\/127\.0\.0\.1(:\d+)?\//i.test(location.href);
  var IS_PROD = /^https:\/\/iptv-search\.com\//i.test(location.href);

  function logSite() {
    var env = IS_PROD ? "prod" : (IS_DEV ? "dev" : "unknown");
    console.log("[StreamPlugin] IPTV Search site detected — env:", env, location.pathname);
  }

  // 检测站内 test-play 按钮是否就绪，注入一个视觉指示器（可选）
  function enhanceExistingButton() {
    var btn = document.querySelector(".btn-test-play");
    if (!btn) return;

    // 给按钮加一个"扩展已连接"的视觉提示（不影响站内逻辑）
    btn.setAttribute("title", btn.title || "测试播放");
    btn.dataset.streamPluginBound = "1";
  }

  function init() {
    logSite();
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