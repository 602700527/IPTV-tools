(function() {
  "use strict";
  var STREAM_PATTERNS = [/\.m3u8(\?.*)?$/i, /\.flv(\?.*)?$/i, /^rtmp[s]?:\/\/.+/i, /\.mpd(\?.*)?$/i, /\.(m3u8?|flv|mp4|ts|webm)(\?|$)/i];
  var PLAY_SELECTORS = ['button[data-testid="play-button"]', 'button.play-btn', 'button[class*="play"]', 'a[class*="play"]', '.play-icon', '.video-play', 'video', 'iframe[src*="player"]'];
  var VIDEO_ATTRS = ["src","data-src","data-video","data-url","poster"];
  var hasInjected = false;
  var lastCopiedUrl = null;

  function detectStreams() {
    var urls = {};
    document.querySelectorAll("video,audio").forEach(function(el){ extractFromEl(el,urls); });
    document.querySelectorAll("source").forEach(function(el){ if(el.src&&isStream(el.src)) urls[el.src]=true; });
    document.querySelectorAll("iframe").forEach(function(el){ if(el.src&&isStream(el.src)) urls[el.src]=true; });
    document.querySelectorAll("a").forEach(function(el){ if(el.href&&isStream(el.href)) urls[el.href]=true; });
    document.querySelectorAll("[data-src],[data-video],[data-url],[data-hls],[data-flv]").forEach(function(el) {
      var val = el.dataset.src||el.dataset.video||el.dataset.url||el.dataset.hls||el.dataset.flv;
      if(val&&isStream(val)) urls[val]=true;
    });
    return Object.keys(urls);
  }

  function extractFromEl(el, urls) {
    VIDEO_ATTRS.forEach(function(attr) { var v=el.getAttribute(attr); if(v&&isStream(v)) urls[v]=true; });
    var p=el.closest("a"); if(p&&p.href&&isStream(p.href)) urls[p.href]=true;
  }

  function isStream(url) {
    if(!url||typeof url!=="string") return false;
    if(url.startsWith("data:")||url.startsWith("blob:")||url.startsWith("//")) return false;
    for(var i=0;i<STREAM_PATTERNS.length;i++) if(STREAM_PATTERNS[i].test(url)) return true;
    return false;
  }

  function sendToBg(url,title) {
    chrome.runtime.sendMessage({type:"STREAM_URL_FOUND",url:url,title:title||document.title,tabId:-1}).catch(function(err){console.warn("[StreamPlugin] Send failed:",err);});
  }

  // ===== 注入「测试播放」按钮 =====
  function injectTestPlayButton() {
    // 匹配复制类按钮的选择器
    var copySelectors = [
      '[class*="copy"]', '[class*="复制链接"]', '[class*="cop"]',
      '[data-action="copy"]', '[title*="复制"]', '[aria-label*="复制"]',
      'button:contains("复制")', 'button:contains("复制链接")'
    ];
    
    // 尝试通过文本匹配找复制按钮
    var copyBtn = null;
    var allBtns = document.querySelectorAll("button, a, span, div");
    for (var i = 0; i < allBtns.length; i++) {
      var el = allBtns[i];
      var text = (el.textContent || "").trim();
      // 只匹配纯文本或近似匹配的复制按钮
      if ((text === "复制" || text === "复制链接" || text === "Copy" || text === "Copy link") && el.tagName === "BUTTON") {
        copyBtn = el;
        break;
      }
      // 检查 class 或 title
      var cls = (el.className || "").toString().toLowerCase();
      var ttl = (el.getAttribute("title") || "").toLowerCase();
      var aria = (el.getAttribute("aria-label") || "").toLowerCase();
      if ((cls.indexOf("copy") !== -1 || ttl.indexOf("复制") !== -1 || aria.indexOf("复制") !== -1) && 
          (el.tagName === "BUTTON" || el.tagName === "A")) {
        copyBtn = el;
        break;
      }
    }
    
    if (!copyBtn) return;
    
    // 创建测试播放按钮
    var testBtn = document.createElement("button");
    testBtn.className = "stream-player-test-btn";
    testBtn.innerHTML = "▶ 测试播放";
    testBtn.title = "复制播放地址并在播放器中打开";
    
    // 样式注入（内联）
    var style = document.createElement("style");
    style.textContent = ".stream-player-test-btn{" +
      "display:inline-flex;align-items:center;gap:4px;" +
      "padding:6px 14px;border-radius:8px;border:1px solid #6366f1;" +
      "background:linear-gradient(135deg,#6366f1,#4f46e5);" +
      "color:#fff;font-size:13px;font-weight:600;cursor:pointer;" +
      "box-shadow:0 2px 8px rgba(99,102,241,0.3);" +
      "transition:all .2s;margin-left:8px;white-space:nowrap;" +
      "}" +
      ".stream-player-test-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(99,102,241,0.5);}" +
      ".stream-player-test-btn:active{transform:translateY(0)}";
    document.head.appendChild(style);
    
    // 点击事件：先复制，再读取剪贴板，然后打开播放器
    testBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Step 1: 触发复制
      var range = document.createRange();
      range.selectNodeContents(copyBtn);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      
      try {
        document.execCommand("copy");
      } catch(err) {
        console.warn("[StreamPlugin] execCommand copy failed:", err);
      }
      sel.removeAllRanges();
      
      // Step 2: 延迟读取剪贴板
      setTimeout(function() {
        readClipboardAndOpen();
      }, 300);
    });
    
    // 插入到复制按钮旁边
    var parent = copyBtn.parentElement;
    if (parent) {
      parent.insertBefore(testBtn, copyBtn.nextSibling);
    } else {
      copyBtn.after(testBtn);
    }
    console.log("[StreamPlugin] 测试播放按钮已注入");
  }

  // 从剪贴板读取URL并打开播放器
  function readClipboardAndOpen() {
    // 优先使用 navigator.clipboard API
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(function(text) {
        processClipboardUrl(text);
      }).catch(function(err) {
        console.warn("[StreamPlugin] clipboard.readText failed:", err);
        // 回退：检查最后复制的URL
        if (lastCopiedUrl) {
          processClipboardUrl(lastCopiedUrl);
        } else {
          sendToBg(null, "剪贴板为空，请先复制播放地址");
        }
      });
    } else {
      // 没有clipboard API，尝试用最后记录的URL
      if (lastCopiedUrl) {
        processClipboardUrl(lastCopiedUrl);
      } else {
        // 发送消息让background提示用户
        chrome.runtime.sendMessage({type:"CLIPBOARD_HINT"}).catch(function(){});
      }
    }
  }

  function processClipboardUrl(text) {
    if (!text || text.indexOf("http") !== 0) {
      console.warn("[StreamPlugin] 剪贴板内容不是URL:", text);
      return;
    }
    console.log("[StreamPlugin] 剪贴板URL:", text);
    // 发送消息到background打开播放器
    chrome.runtime.sendMessage({type:"PLAY_CLIPBOARD_URL", url: text}).catch(function(err) {
      console.warn("[StreamPlugin] Failed to open player:", err);
    });
  }

  // 监听复制事件以记录URL
  document.addEventListener("copy", function(e) {
    var sel = window.getSelection();
    var text = (sel.toString() || "").trim();
    if (text && text.indexOf("http") === 0) {
      lastCopiedUrl = text;
      console.log("[StreamPlugin] 检测到复制操作，记录URL:", text);
    }
  });

  function injectPlayListeners() {
    document.addEventListener("click", function(e) {
      var target=e.target, el=target, matched=false;
      for(var depth=0;depth<5&&el;depth++) {
        for(var i=0;i<PLAY_SELECTORS.length;i++) { if(el.matches&&el.matches(PLAY_SELECTORS[i])){matched=true;break;} }
        if(matched)break; el=el.parentElement;
      }
      if(!matched) return;
      var url=null, checkEl=target;
      for(var d=0;d<5&&checkEl;d++) {
        if(checkEl.href&&isStream(checkEl.href)){url=checkEl.href;break;}
        var attrs=["src","video","url","hls","flv"];
        for(var a=0;a<attrs.length;a++){var dv=checkEl.dataset&&checkEl.dataset[attrs[a]];if(dv&&isStream(dv)){url=dv;break;}}
        if(url)break; checkEl=checkEl.parentElement;
      }
      if(!url){var v=document.querySelector("video");if(v&&v.src&&isStream(v.src))url=v.src;}
      if(!url){var f=document.querySelector("iframe");if(f&&f.src&&isStream(f.src))url=f.src;}
      if(url){e.preventDefault();e.stopPropagation();sendToBg(url,target.textContent?target.textContent.trim():document.title);}
    }, true);
  }

  window.__streamPlayer = {
    detect: detectStreams,
    send: function(url,title){sendToBg(url,title);},
    detectAndSend: function(){var urls=detectStreams();if(urls.length>0){sendToBg(urls[0],document.title);return urls;}return [];}
  };

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.type==="DETECT_STREAMS"){sendResponse({urls:detectStreams()});return true;}
    return false;
  });

  if(!hasInjected){
    hasInjected=true;
    injectPlayListeners();
    injectTestPlayButton();
    console.log("[StreamPlugin] Injected:", location.href);
  }
})();
