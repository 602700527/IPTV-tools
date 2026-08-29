(function(){
  var video = document.getElementById("video");
  var emptyState = document.getElementById("emptyState");
  var errorState = document.getElementById("errorState");
  var errorDesc = document.getElementById("errorDesc");
  var directLink = document.getElementById("directLink");
  var urlInput = document.getElementById("urlInput");
  var playBtn = document.getElementById("playBtn");
  var historyList = document.getElementById("historyList");
  playBtn.onclick = handlePlayClick;

  var hlsInst = null;
  var flvInst = null;
  var currentUrl = "";
  var STREAM_HISTORY_KEY = "streamHistory";

  // 从 URL 参数读播放地址 + 频道名（频道名写入 URL input 的 title）
  var params = new URLSearchParams(location.search);
  var initUrl = params.get("url") || "";
  var initName = params.get("name") || "";

  if(initName) urlInput.title = initName;

  if(initUrl){
    urlInput.value = initUrl;
    updateMeta(initUrl);
    startPlay(initUrl);
  } else {
    emptyState.style.display = "flex";
  }

  // 加载播放历史（init 时如需标记 active，会在 loadHistory 里处理）
  loadHistory(initUrl);

  // 回车播放
  urlInput.addEventListener("keydown", function(e) {
    if(e.key === "Enter") handlePlayClick();
  });

  playBtn.onclick = handlePlayClick;

  function handlePlayClick() {
    var url = urlInput.value.trim();
    if(!url){
      showToast("请输入播放地址", "error");
      return;
    }
    updateMeta(url);
    startPlay(url);
  }

  // 折叠 URL：保留协议 + 域名 + 末尾片段（去中间过长部分）
  function truncateUrl(url, max) {
    if (!url) return "";
    max = max || 36;
    if (url.length <= max) return url;
    // 找第三个 / 之后的位置（路径起点）
    var protoEnd = url.indexOf("://");
    if (protoEnd === -1) return url.slice(0, max - 3) + "...";
    var pathStart = url.indexOf("/", protoEnd + 3);
    if (pathStart === -1 || pathStart >= url.length - 8) return url.slice(0, max - 3) + "...";
    var head = url.slice(0, pathStart); // 协议 + 域名
    var tail = url.slice(-12); // 末尾 12 字符
    if (head.length + tail.length + 5 > max) {
      return head.slice(0, max - tail.length - 5) + "..." + tail;
    }
    return head + "/..." + tail;
  }

  function timeAgo(ts) {
    if (!ts) return "";
    var diff = Date.now() - ts;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return Math.floor(diff/60000) + "m ago";
    if (diff < 86400000) return Math.floor(diff/3600000) + "h ago";
    return Math.floor(diff/86400000) + "d ago";
  }

  function loadHistory(markActiveUrl) {
    try {
      chrome.storage.local.get(STREAM_HISTORY_KEY, function(items) {
        var history = (items && items[STREAM_HISTORY_KEY]) || [];
        renderHistory(history, markActiveUrl);
      });
    } catch (e) {
      // chrome.storage 不可用（非扩展环境，例如直接打开 player.html 调试）
      renderHistory([], markActiveUrl);
    }
  }

  function renderHistory(history, markActiveUrl) {
    if (!historyList) return;
    historyList.innerHTML = "";
    updateClearBtn(history.length);
    if (!history.length) {
      historyList.innerHTML = '<li class="history-empty">No plays yet.<br>Click <strong>Test Play</strong> on any channel page.</li>';
      return;
    }
    // 找出当前播放的 history entry（match by URL）
    var activeBtn = null;
    history.slice(0, 20).forEach(function(entry) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "history-item-btn";
      btn.title = entry.url + (entry.channelName ? "  ·  " + entry.channelName : "");
      btn.setAttribute("aria-label", "Play " + (entry.channelName || entry.title || "stream"));
      var name = entry.channelName || entry.title || "Untitled";
      var urlText = truncateUrl(entry.url, 32);
      btn.innerHTML =
        '<div class="history-name">' + escapeHtml(name) + '</div>' +
        '<div class="history-url">' + escapeHtml(urlText) + '</div>' +
        '<div class="history-meta">' +
          '<span class="history-type type-' + (entry.type || "other") + '">' + (entry.type || "?").toUpperCase() + '</span>' +
          '<span class="history-time">' + timeAgo(entry.timestamp) + '</span>' +
        '</div>';
      btn.addEventListener("click", function() {
        urlInput.value = entry.url;
        if (entry.channelName) urlInput.title = entry.channelName;
        setActiveHistory(btn);
        updateMeta(entry.url);
        startPlay(entry.url);
      });
      // 初次渲染时如果当前 URL 匹配 → 高亮
      if (markActiveUrl && entry.url === markActiveUrl) activeBtn = btn;
      li.appendChild(btn);
      historyList.appendChild(li);
    });
    // 渲染完后再设置 active（避免循环中的 DOM 闪烁）
    if (activeBtn) activeBtn.classList.add("active");
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  // 高亮当前正在播放的 history item
  function setActiveHistory(activeBtn) {
    var items = historyList ? historyList.querySelectorAll(".history-item-btn") : [];
    items.forEach(function(b) { b.classList.remove("active"); });
    if (activeBtn) activeBtn.classList.add("active");
  }

  // 营销卡延时出现 — 首次成功播放 30s 后才展开
  var marketingTimer = null;
  function maybeShowMarketing() {
    if (marketingTimer) return;
    marketingTimer = setTimeout(function() {
      var card = document.querySelector(".marketing-card");
      if (card) card.classList.add("show");
    }, 30000);
  }

  // Clear history button — 根据历史数量启用/禁用
  function updateClearBtn(count) {
    var btn = document.getElementById("clearHistoryBtn");
    if (!btn) return;
    btn.disabled = !count;
    btn.textContent = count > 0 ? "Clear (" + count + ")" : "Clear";
  }

  function bindClearBtn() {
    var btn = document.getElementById("clearHistoryBtn");
    if (!btn) return;
    btn.addEventListener("click", function() {
      if (btn.disabled) return;
      if (!confirm("Clear all playback history? This cannot be undone.")) return;
      try {
        chrome.storage.local.set({ [STREAM_HISTORY_KEY]: [] }, function() {
          renderHistory([]);
          showToast("History cleared");
        });
      } catch (e) {
        showToast("Failed to clear", "error");
      }
    });
  }
  bindClearBtn();

  function updateMeta(url) {
    // 占位 — 状态/类型徽章已在 2-栏重构中删除
  }

  function startPlay(url) {
    currentUrl = url;

    destroy();
    video.style.display = "block";
    emptyState.style.display = "none";
    errorState.style.display = "none";

    // 首次视频成功播放 30s 后才显示营销卡（不打扰刚开始看的用户）
    video.addEventListener("playing", maybeShowMarketing, { once: true });

    var t = detType(url);

    if(t==="hls" && typeof Hls!=="undefined" && Hls.isSupported()){
      hlsInst = new Hls({debug:false,enableWorker:true,lowLatencyMode:true});
      hlsInst.loadSource(url);
      hlsInst.attachMedia(video);
      hlsInst.on(Hls.Events.MANIFEST_PARSED, function(){
        video.play().catch(function(){});
      });
      hlsInst.on(Hls.Events.ERROR, function(ev,d){
        if(d.fatal){
          console.error("[HLS] Fatal:", d.type, d.details);
          showError("HLS 播放失败: " + d.details);
        }
      });
    } else if(t==="flv" && typeof flvjs!=="undefined" && flvjs.isSupported()){
      flvInst = flvjs.createPlayer({type:"flv",url:url,isLive:true});
      flvInst.attachMediaElement(video);
      flvInst.load();
      flvInst.play().catch(function(){});
      flvInst.on(flvjs.Events.ERROR, function(tp,d){
        console.error("[FLV] Error:", tp, d);
        showError("FLV 播放失败");
      });
    } else if(url.toLowerCase().indexOf("rtmp")===0){
      showError("RTMP 格式浏览器不支持直接播放，请使用 VLC 或转换工具");
    } else {
      video.src = url;
      video.load();
      video.play().catch(function(){});
      video.addEventListener("error", function(){showError("原生播放失败");},{once:true});
    }
  }

  function showError(msg) {
    video.style.display = "none";
    emptyState.style.display = "none";
    errorState.style.display = "flex";
    errorDesc.textContent = msg || "播放失败";
    directLink.href = currentUrl;
    showToast(msg || "播放失败", "error");
  }

  function destroy() {
    if(hlsInst){hlsInst.destroy();hlsInst=null;}
    if(flvInst){flvInst.pause();flvInst.unload();flvInst.detachMediaElement();flvInst=null;}
    video.removeAttribute("src");
    video.load();
  }

  function detType(url) {
    var l=url.toLowerCase();
    if(l.indexOf(".m3u8")!==-1||l.indexOf("hls")!==-1) return "hls";
    if(l.indexOf("/live/")!==-1) return "hls";
    if(l.indexOf(".flv")!==-1) return "flv";
    if(l.indexOf("rtmp")!==-1) return "rtmp";
    if(l.indexOf(".mpd")!==-1||l.indexOf("dash")!==-1) return "dash";
    return "other";
  }

  function showToast(msg, type) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "toast show" + (type ? " " + type : "");
    setTimeout(function(){ t.className = "toast"; }, 2500);
  }
})();
