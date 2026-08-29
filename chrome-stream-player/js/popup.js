(function(){
  "use strict";
  
  var input = document.getElementById("streamUrl");
  var playBtn = document.getElementById("playBtn");
  var video = document.getElementById("videoPlayer");
  var emptyState = document.getElementById("emptyState");
  var errorState = document.getElementById("errorState");
  var errorDesc = document.getElementById("errorDesc");
  var directLink = document.getElementById("directLink");
  var playerStatus = document.getElementById("playerStatus");
  var statusPill = document.getElementById("statusPill");
  var pillDot = document.getElementById("pillDot");
  var pillText = document.getElementById("pillText");
  var stopBtn = document.getElementById("stopBtn");
  var captureBtn = document.getElementById("captureBtn");
  var clipboardBtn = document.getElementById("clipboardBtn");
  var clearHistoryBtn = document.getElementById("clearHistory");
  var historyCard = document.getElementById("historyCard");
  var historyList = document.getElementById("historyList");
  var statusDot = document.getElementById("statusDot");
  var statusText = document.getElementById("statusText");
  var tabBadge = document.getElementById("tabBadge");
  
  var hlsInst = null;
  var flvInst = null;
  window.__lastCopiedUrl = null;
  
  window.testUrl = function(url) { input.value = url; handlePlay(); };
  
  init();
  
  async function init() {
    await loadTab();
    await loadHist();
    await loadLast();
    
    playBtn.onclick = handlePlay;
    input.onkeypress = function(e) { if(e.key==="Enter") handlePlay(); };
    captureBtn.onclick = captureTab;
    clipboardBtn.onclick = playFromClipboard;
    clearHistoryBtn.onclick = clearHist;
    stopBtn.onclick = stopPlay;
    
    video.addEventListener("playing", function() { setPlayerStatus("playing","正在播放"); });
    video.addEventListener("waiting", function() { setPlayerStatus("buffering","缓冲中..."); });
    video.addEventListener("error", function() { showFallback("播放失败，请检查地址或格式"); });
    
    // 统一消息监听
    chrome.runtime.onMessage.addListener(function(m) {
      if(m.type === "STREAM_UPDATED" && m.stream){
        input.value = m.stream.url;
        loadHist();
        setStatus("loaded", "已接收: " + m.stream.type.toUpperCase());
      } else if(m.type === "CLIPBOARD_HINT"){
        setStatus("error", "请复制播放地址后再试");
      }
    });
  }
  
  function setStatus(type, text) {
    statusDot.className = "status-dot";
    if(type === "error") statusDot.classList.add("error");
    else if(type === "loading") statusDot.classList.add("loading");
    statusText.textContent = text || "就绪";
  }
  
  function setPlayerStatus(state, text) {
    if(!playerStatus) return;
    playerStatus.style.display = "flex";
    pillText.textContent = text;
    pillDot.className = "pill-dot";
    if(state === "buffering") pillDot.classList.add("buffering");
    else if(state === "error") pillDot.classList.add("error");
  }
  
  async function loadTab() {
    try {
      var tabs = await chrome.tabs.query({active:true,currentWindow:true});
      if(tabs&&tabs[0]) tabBadge.textContent = tabs[0].title ? tabs[0].title.substring(0,20) : tabs[0].url||"当前标签";
    } catch(e) { tabBadge.textContent = "无权限"; }
  }
  
  async function loadHist() {
    var r = await chrome.storage.local.get("streamHistory");
    if(r.streamHistory&&r.streamHistory.length) renderHist(r.streamHistory);
  }
  
  function renderHist(h) {
    if(!h.length){historyCard.style.display="none";return;}
    historyCard.style.display="block";
    historyList.innerHTML="";
    for(var i=0;i<Math.min(h.length,10);i++){
      var it=h[i], li=document.createElement("li");
      var timeStr = new Date(it.timestamp).toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"});
      li.innerHTML = '<div class="history-left"><span class="history-url">'+escHtml(it.title||it.url)+'</span><span class="history-time">'+timeStr+'</span></div><span class="history-type type-'+(it.type||"other")+'">'+(it.type||"other").toUpperCase()+'</span>';
      li.onclick = (function(u){return function(){input.value=u;handlePlay();};})(it.url);
      historyList.appendChild(li);
    }
  }
  
  async function loadLast() {
    var r = await chrome.storage.local.get("lastStreamUrl");
    if(r.lastStreamUrl) input.value = r.lastStreamUrl;
  }
  
  function handlePlay() {
    var url = input.value.trim();
    if(!url){setStatus("error","请输入流媒体地址");return;}
    setStatus("loading","加载中...");
    destroy();
    video.style.display = "block";
    emptyState.style.display = "none";
    errorState.style.display = "none";
    playerStatus.style.display = "flex";
    setPlayerStatus("loading","准备中...");
    
    var t = detType(url);
    if(t==="hls" && typeof Hls!=="undefined" && Hls.isSupported()){
      hlsInst = new Hls({debug:false,enableWorker:true,lowLatencyMode:true});
      hlsInst.loadSource(url); hlsInst.attachMedia(video);
      hlsInst.on(Hls.Events.MANIFEST_PARSED, function(){ video.play().catch(function(){}); setStatus("loaded","HLS 播放中"); });
      hlsInst.on(Hls.Events.ERROR, function(ev,d){ if(d.fatal){ console.error("[HLS]",d.type,d.details); showFallback("HLS 播放失败: "+d.details); }});
    } else if(t==="flv" && typeof flvjs!=="undefined" && flvjs.isSupported()){
      flvInst = flvjs.createPlayer({type:"flv",url:url,isLive:true});
      flvInst.attachMediaElement(video); flvInst.load(); flvInst.play().catch(function(){});
      flvInst.on(flvjs.Events.ERROR, function(tp,d){ console.error("[FLV]",tp,d); showFallback("FLV 播放失败"); });
    } else if(url.indexOf("rtmp")===0){
      showFallback("RTMP 格式浏览器不支持直接播放");
    } else {
      video.src = url; video.load(); video.play().catch(function(){});
      video.addEventListener("error", function(){showFallback("原生播放失败");},{once:true});
    }
    chrome.storage.local.set({lastStreamUrl:url});
  }
  
  function showFallback(msg) {
    video.style.display = "none";
    emptyState.style.display = "none";
    errorState.style.display = "flex";
    errorDesc.textContent = msg || "播放失败";
    directLink.href = input.value.trim();
    setStatus("error","播放失败");
    setPlayerStatus("error","播放失败");
  }
  
  function stopPlay() {
    destroy();
    video.style.display = "none";
    emptyState.style.display = "flex";
    errorState.style.display = "none";
    playerStatus.style.display = "none";
    setStatus("loaded","已停止");
  }
  
  function destroy() {
    if(hlsInst){hlsInst.destroy();hlsInst=null;}
    if(flvInst){flvInst.pause();flvInst.unload();flvInst.detachMediaElement();flvInst=null;}
    video.removeAttribute("src"); video.load();
  }
  
  function detType(url) {
    var l=url.toLowerCase();
    if(l.indexOf(".m3u8")!==-1||l.indexOf("hls")!==-1) return "hls";
    if(l.indexOf(".flv")!==-1) return "flv";
    if(l.indexOf("rtmp")!==-1) return "rtmp";
    if(l.indexOf(".mpd")!==-1||l.indexOf("dash")!==-1) return "dash";
    return "other";
  }
  
  async function captureTab() {
    try {
      setStatus("loading","检测中...");
      var tabs = await chrome.tabs.query({active:true,currentWindow:true});
      if(!tabs||!tabs[0]){setStatus("error","无法获取标签页");return;}
      var r = await chrome.tabs.sendMessage(tabs[0].id,{type:"DETECT_STREAMS"});
      if(r&&r.urls&&r.urls.length){
        input.value = r.urls[0];
        setStatus("loaded","检测到 "+r.urls.length+" 个地址");
        handlePlay();
      } else { setStatus("error","未检测到流媒体地址"); }
    } catch(e) { setStatus("error","无法与页面通信"); }
  }
  
  // 从剪贴板读取并打开播放器
  async function playFromClipboard() {
    setStatus("loading","读取剪贴板...");
    try {
      var text = "";
      if(navigator.clipboard && navigator.clipboard.readText){
        text = await navigator.clipboard.readText();
      } else {
        text = window.__lastCopiedUrl || "";
      }
      if(!text || text.indexOf("http")!==0){
        setStatus("error","剪贴板为空或不是有效URL");
        return;
      }
      console.log("[Popup] 剪贴板URL:", text);
      setStatus("loaded","正在打开播放器...");
      chrome.runtime.sendMessage({type:"PLAY_CLIPBOARD_URL",url:text}, function(resp){
        if(chrome.runtime.lastError){
          console.error("[Popup] Error:", chrome.runtime.lastError.message);
          setStatus("error","无法打开播放器");
        } else {
          setStatus("loaded","播放器已打开");
        }
      });
    } catch(e) {
      console.error("[Popup] playFromClipboard error:", e);
      setStatus("error","读取剪贴板失败");
    }
  }
  
  async function clearHist() {
    await chrome.storage.local.set({streamHistory:[]});
    historyCard.style.display = "none";
    historyList.innerHTML = "";
  }
  
  function escHtml(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
})();
