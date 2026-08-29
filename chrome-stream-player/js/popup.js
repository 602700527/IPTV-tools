// Popup Menu — simple action dispatcher
// 点击 Open Player → 复用已有 player 标签，没有就新建
(function(){
  document.getElementById("openPlayerBtn").addEventListener("click", function() {
    var playerUrl = chrome.runtime.getURL("pages/player.html");
    // 先查已有 player 标签页
    chrome.tabs.query({ url: chrome.runtime.getURL("pages/player.html") + "*" }, function(tabs) {
      if (tabs && tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true });
        if (typeof tabs[0].windowId !== "undefined") {
          chrome.windows.update(tabs[0].windowId, { focused: true });
        }
        window.close();
      } else {
        chrome.tabs.create({ url: playerUrl, active: true }, function() {
          window.close();
        });
      }
    });
  });
})();
