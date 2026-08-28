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

  // 站内 test-play 按钮打的 postMessage，打开简易播放器窗口
  // 完全用 window.open + data: URL，不依赖 background / chrome.tabs API
  // （content script 在 MV3 里没 chrome.tabs.* 权限）
  function relayTestPlay() {
    window.addEventListener("message", function(event) {
      // 不能用 event.source !== window 过滤：content script 在 isolated world，
      // 有自己的 window 对象，event.source 永远是 page window（不等于）。
      // 改靠 data.type 严格验证（自定义消息类型，外部页面不会触发）。
      var data = event.data;
      if (!data || data.type !== "IPTV_SEARCH_TEST_PLAY") return;
      var url = data.url;
      if (!url || typeof url !== "string" || url.indexOf("http") !== 0) return;

      console.log("[StreamPlugin] Opening inline player for:", url);

      // 用 data: URL 内嵌 HLS.js (CDN) + 视频元素，开新窗口
      // 优点：不依赖扩展 background / chrome.tabs API，永远能跑
      // 缺点：跟扩展原 player.html UI 略不同，但能验证集成链路
      var html = [
        '<!DOCTYPE html>',
        '<html><head><meta charset="utf-8"><title>StreamPlayer Test</title>',
        '<style>body{margin:0;background:#08090e;color:#e2e8f0;font-family:-apple-system,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh}',
        '.info{margin-top:16px;max-width:90vw;word-break:break-all;background:#161b22;padding:12px;border-radius:8px;font-size:12px;color:#6b9fff;border:1px solid #21262d}',
        '.label{font-size:10px;color:#6b7280;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}',
        'video{width:90vw;max-width:1100px;aspect-ratio:16/9;background:#000;border-radius:12px;border:1px solid #21262d}',
        '</style></head><body>',
        '<video id="v" controls autoplay></video>',
        '<div class="info"><div class="label">Test Stream</div>' + url + '</div>',
        '<script src="https://cdn.jsdelivr.net/npm/hls.js@1.5.0/dist/hls.min.js"><\/script>',
        '<script>',
        '(function(){',
        '  var v=document.getElementById("v");',
        '  var u=' + JSON.stringify(url) + ';',
        '  if(v.canPlayType("application/vnd.apple.mpegurl")){',
        '    v.src=u;',
        '  } else if(window.Hls && Hls.isSupported()){',
        '    var h=new Hls();h.loadSource(u);h.attachMedia(v);',
        '    h.on(Hls.Events.ERROR,function(e,d){if(d.fatal)console.error("HLS",d);});',
        '  } else {',
        '    v.src=u;',
        '  }',
        '  v.play().catch(function(){});',
        '})();',
        '<\/script>',
        '</body></html>'
      ].join('\n');

      var dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
      var win = window.open(dataUrl, '_blank');
      if (!win) {
        console.warn("[StreamPlugin] window.open blocked (popup blocker?)");
        window.dispatchEvent(new CustomEvent("IPTV_SEARCH_TEST_PLAY_FAIL", {detail: {url: url, error: "popup_blocked"}}));
      } else {
        console.log("[StreamPlugin] Opened inline player window");
        window.dispatchEvent(new CustomEvent("IPTV_SEARCH_TEST_PLAY_OK", {detail: {url: url}}));
      }
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