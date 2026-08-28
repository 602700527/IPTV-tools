// IPTV Search 站点专用 Content Script
// 仅在 https://iptv-search.com/* 和本地 dev (http://127.0.0.1:*/*) 注入
//
// 工作流：
//   1. 用户点页面上的"复制链接"按钮 → 内容写到剪贴板
//   2. content script 监听页面点击，检测到复制按钮被点 → 300ms 后读剪贴板
//   3. 剪贴板内容是 stream URL → window.open(data:text/html) 开简易 HLS 播放器
//
// 不依赖 chrome.tabs.* / background service worker / chrome-extension:// URL。

(function() {
  "use strict";
  var IS_DEV = /^http:\/\/127\.0\.0\.1(:\d+)?\//i.test(location.href);
  var IS_PROD = /^https:\/\/iptv-search\.com\//i.test(location.href);

  // Stream URL 特征（来自 chrome-stream-plugin 原 content.js）
  var STREAM_PATTERNS = [
    /\.m3u8(\?.*)?$/i, /\.flv(\?.*)?$/i, /^rtmp[s]?:\/\/.+/i,
    /\.mpd(\?.*)?$/i, /\.(m3u8?|flv|mp4|ts|webm)(\?|$)/i
  ];
  function isStream(url) {
    if (!url || typeof url !== "string") return false;
    if (url.startsWith("data:") || url.startsWith("blob:")) return false;
    for (var i = 0; i < STREAM_PATTERNS.length; i++) {
      if (STREAM_PATTERNS[i].test(url)) return true;
    }
    return false;
  }

  // 判断元素是不是"复制"按钮
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

  // 开简易 HLS 播放器（data: URL，不依赖扩展任何 API）
  function openInlinePlayer(url) {
    console.log("[StreamPlugin] Auto-opening inline player for:", url);
    var html = [
      '<!DOCTYPE html>',
      '<html><head><meta charset="utf-8"><title>StreamPlayer</title>',
      '<style>body{margin:0;background:#08090e;color:#e2e8f0;font-family:-apple-system,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh}',
      '.info{margin-top:16px;max-width:90vw;word-break:break-all;background:#161b22;padding:12px;border-radius:8px;font-size:12px;color:#6b9fff;border:1px solid #21262d}',
      '.label{font-size:10px;color:#6b7280;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}',
      'video{width:90vw;max-width:1100px;aspect-ratio:16/9;background:#000;border-radius:12px;border:1px solid #21262d}',
      '</style></head><body>',
      '<video id="v" controls autoplay></video>',
      '<div class="info"><div class="label">Stream URL</div>' + url + '</div>',
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
      console.warn("[StreamPlugin] popup blocked");
    } else {
      console.log("[StreamPlugin] Opened inline player");
    }
  }

  // 从剪贴板读 URL（要权限；user gesture 链里应该可用）
  function readClipboardAndMaybeOpen() {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      console.warn("[StreamPlugin] clipboard.readText unavailable");
      return false;
    }
    navigator.clipboard.readText().then(function(text) {
      var t = (text || "").trim();
      if (isStream(t)) {
        openInlinePlayer(t);
      } else {
        console.log("[StreamPlugin] clipboard not a stream URL:", t.slice(0, 80));
      }
    }).catch(function(err) {
      console.warn("[StreamPlugin] clipboard read failed:", err && err.message);
    });
    return true;
  }

  function logSite() {
    var env = IS_PROD ? "prod" : (IS_DEV ? "dev" : "unknown");
    console.log("[StreamPlugin] IPTV Search site detected — env:", env);
  }

  function init() {
    logSite();

    // 监听页面点击，捕获复制按钮的点击
    document.addEventListener("click", function(e) {
      var t = e.target;
      if (!t || !t.closest) return;
      // 向上找最近带"copy"语义的元素
      var node = t;
      for (var depth = 0; depth < 4 && node; depth++) {
        if (isCopyButton(node)) {
          // 复制按钮被点 → 300ms 后读剪贴板
          setTimeout(readClipboardAndMaybeOpen, 300);
          return;
        }
        node = node.parentElement;
      }
    }, true);

    // 兼容老的 'copy' 事件（用户 Ctrl+C 选中文本）
    document.addEventListener("copy", function() {
      setTimeout(readClipboardAndMaybeOpen, 300);
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();