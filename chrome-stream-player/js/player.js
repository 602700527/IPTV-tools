(function(){
  var video = document.getElementById("video");
  var emptyState = document.getElementById("emptyState");
  var errorState = document.getElementById("errorState");
  var errorDesc = document.getElementById("errorDesc");
  var directLink = document.getElementById("directLink");
  var urlInput = document.getElementById("urlInput");
  var playBtn = document.getElementById("playBtn");
  var typeBadge = document.getElementById("typeBadge");
  var statusBadge = document.getElementById("statusBadge");
  var metaType = document.getElementById("metaType");
  var metaStatus = document.getElementById("metaStatus");
  var metaSource = document.getElementById("metaSource");
  playBtn.onclick = handlePlayClick;

  var hlsInst = null;
  var flvInst = null;
  var currentUrl = "";

  // 从 URL 参数或剪贴板回显播放地址
  var params = new URLSearchParams(location.search);
  var initUrl = params.get("url") || "";

  if(initUrl){
    urlInput.value = initUrl;
    metaSource.textContent = "频道页自动填入";
    updateMeta(initUrl);
    startPlay(initUrl);
  } else {
    emptyState.style.display = "flex";
    metaSource.textContent = "—";
  }

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
    metaSource.textContent = "手动输入";
    updateMeta(url);
    startPlay(url);
  }

  function handleClear() {
    urlInput.value = "";
    destroy();
    video.style.display = "none";
    errorState.style.display = "none";
    emptyState.style.display = "flex";
    typeBadge.textContent = "—";
    typeBadge.className = "badge badge-other";
    statusBadge.textContent = "就绪";
    statusBadge.className = "badge badge-loading";
    metaType.textContent = "—";
    metaStatus.textContent = "就绪";
    metaSource.textContent = "—";
    urlInput.focus();
  }

  function updateMeta(url) {
    var t = detType(url);
    typeBadge.textContent = t.toUpperCase();
    typeBadge.className = "badge badge-" + t;
    metaType.textContent = t.toUpperCase();
  }

  function startPlay(url) {
    currentUrl = url;
    statusBadge.textContent = "加载中...";
    statusBadge.className = "badge badge-loading";
    metaStatus.textContent = "加载中...";

    destroy();
    video.style.display = "block";
    emptyState.style.display = "none";
    errorState.style.display = "none";

    var t = detType(url);

    if(t==="hls" && typeof Hls!=="undefined" && Hls.isSupported()){
      hlsInst = new Hls({debug:false,enableWorker:true,lowLatencyMode:true});
      hlsInst.loadSource(url);
      hlsInst.attachMedia(video);
      hlsInst.on(Hls.Events.MANIFEST_PARSED, function(){
        video.play().catch(function(){});
        metaStatus.textContent = "播放中";
        statusBadge.textContent = "播放中";
        statusBadge.className = "badge badge-live";
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
      flvInst.on(flvjs.Events.LOAD_COMPLETE, function(){
        metaStatus.textContent = "直播中";
        statusBadge.textContent = "直播中";
        statusBadge.className = "badge badge-live";
      });
    } else if(url.toLowerCase().indexOf("rtmp")===0){
      showError("RTMP 格式浏览器不支持直接播放，请使用 VLC 或转换工具");
    } else {
      video.src = url;
      video.load();
      video.play().catch(function(){});
      video.addEventListener("error", function(){showError("原生播放失败");},{once:true});
      metaStatus.textContent = "加载中...";
    }
  }

  function showError(msg) {
    video.style.display = "none";
    emptyState.style.display = "none";
    errorState.style.display = "flex";
    errorDesc.textContent = msg || "播放失败";
    directLink.href = currentUrl;
    metaStatus.textContent = "失败";
    statusBadge.textContent = "失败";
    statusBadge.className = "badge badge-error";
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
