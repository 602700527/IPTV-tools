// 交互式播放站首页
export const PLAYSTATION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IPTV Live - 免费直播</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff}
    ::-webkit-scrollbar{width:8px}
    ::-webkit-scrollbar-track{background:#1a1a1a}
    ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:#555}
    
    .header{position:fixed;top:0;left:0;right:0;height:70px;background:rgba(20,20,20,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.1);z-index:100;display:flex;align-items:center;padding:0 40px}
    .logo{font-size:24px;font-weight:800;background:linear-gradient(135deg,#e50914 0%,#b81d24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .search-box{flex:1;max-width:500px;margin-left:60px}
    .search-input{width:100%;padding:12px 20px;border:1px solid rgba(255,255,255,.2);border-radius:8px;background:rgba(255,255,255,.05);color:#fff;font-size:15px;transition:all .2s}
    .search-input:focus{outline:none;border-color:#e50914;background:rgba(255,255,255,.1)}
    .search-input::placeholder{color:rgba(255,255,255,.5)}
    .nav-links{display:flex;gap:20px;margin-left:auto}
    .nav-links a{color:rgba(255,255,255,.8);text-decoration:none;font-size:14px;transition:color .2s}
    .nav-links a:hover{color:#fff}
    .nav-links a.active{color:#e50914}

    /* 快捷入口按钮 */
    .quick-entries{display:flex;gap:8px;margin-right:20px;margin-left:20px}
    .quick-entry{position:relative;width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:rgba(255,255,255,.7);font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .quick-entry:hover{background:rgba(255,255,255,.2);color:#fff}
    .quick-entry-badge{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;background:#e50914;border-radius:9px;font-size:11px;font-weight:600;color:#fff;display:flex;align-items:center;justify-content:center;padding:0 5px}
    .quick-entry-tip{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:6px;white-space:nowrap;font-size:12px;color:rgba(255,255,255,.6);opacity:0;transition:opacity .2s;pointer-events:none}
    .quick-entry:hover .quick-entry-tip{opacity:1}
    
    .main{display:flex;margin-top:70px;min-height:calc(100vh - 70px)}
    .sidebar{width:260px;background:#141414;border-right:1px solid rgba(255,255,255,.1);overflow-y:auto;padding:20px 0;position:fixed;height:calc(100vh - 70px)}
    .group-item{padding:12px 24px;color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;font-size:14px;border-left:3px solid transparent}
    .group-item:hover{color:#fff;background:rgba(255,255,255,.05)}
    .group-item.active{color:#fff;background:rgba(229,9,20,.1);border-left-color:#e50914}
    .content{flex:1;margin-left:260px;padding:30px}
    
    .section-title{font-size:18px;font-weight:600;margin-bottom:20px;color:#fff}
    .channels-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
    .channel-card{background:#141414;border-radius:8px;overflow:hidden;cursor:pointer;transition:all .3s;border:2px solid transparent;position:relative}
    .channel-card:hover{transform:scale(1.05);border-color:#e50914;z-index:10;box-shadow:0 8px 30px rgba(0,0,0,.5)}
    .channel-poster{aspect-ratio:16/9;background:#1a1a1a;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .channel-poster img{width:100%;height:100%;object-fit:contain;transition:transform .3s}
    .channel-card:hover .channel-poster img{transform:scale(1.1)}
    .channel-icon{font-size:48px;opacity:.5}
    .play-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(229,9,20,.8);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}
    .channel-card:hover .play-overlay{opacity:1}
    .play-icon{width:60px;height:60px;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center}
    .play-icon::after{content:'';width:0;height:0;border-left:20px solid #fff;border-top:12px solid transparent;border-bottom:12px solid transparent;margin-left:4px}
    .channel-info{padding:14px}
    .channel-name{font-size:14px;font-weight:500;color:#fff;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .channel-group{font-size:12px;color:rgba(255,255,255,.5)}
    .pagination{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:30px;padding:20px 0}
    .pagination button{padding:8px 16px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#fff;border-radius:6px;cursor:pointer;font-size:14px;transition:all .2s}
    .pagination button:hover:not(:disabled){background:rgba(255,255,255,.1);border-color:#e50914}
    .pagination button:disabled{color:rgba(255,255,255,.3);cursor:not-allowed;border-color:rgba(255,255,255,.1)}
    .pagination button.active{background:#e50914;border-color:#e50914}
    .pagination-info{color:rgba(255,255,255,.6);font-size:14px}
    
    /* 播放器样式 - 可折叠的右下角浮窗 */
    .player-wrapper{display:none;position:fixed;right:20px;bottom:20px;z-index:1000;background:#0a0a0a;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.1);transition:all .3s ease}
    .player-wrapper.expanded{width:calc(100vw - 40px);height:calc(100vh - 80px);right:20px;top:70px;bottom:20px}
    .player-wrapper.collapsed{width:480px;height:270px}
    .player-wrapper.active{display:block}
    .player-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.1);cursor:move;user-select:none}
    .player-info{flex:1;min-width:0}
    .player-title{font-size:14px;font-weight:600;color:#fff;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .player-group{font-size:12px;color:rgba(255,255,255,.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .player-controls{display:flex;gap:8px}
    .player-btn{width:32px;height:32px;border-radius:6px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:14px}
    .player-btn:hover{background:rgba(255,255,255,.2)}
    .player-container{position:relative;width:100%;height:calc(100% - 50px);background:#000}
    .player-container video{width:100%;height:100%;object-fit:contain}
    .close-modal{background:rgba(231,9,20,.2)}
    .close-modal:hover{background:rgba(231,9,20,.4)}
    
    .loading{display:flex;align-items:center;justify-content:center;padding:60px;color:rgba(255,255,255,.5)}
    .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,.1);border-top-color:#e50914;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-left:16px;font-size:14px}
    
    .empty-state{text-align:center;padding:80px 20px;color:rgba(255,255,255,.5)}
    .empty-icon{font-size:64px;margin-bottom:20px;opacity:.3}
    .empty-title{font-size:20px;font-weight:600;margin-bottom:10px}
    .empty-desc{font-size:14px}
    
    .footer{text-align:center;padding:30px;color:rgba(255,255,255,.4);font-size:13px;border-top:1px solid rgba(255,255,255,.1);margin-top:40px;margin-left:260px}

    /* 热门频道标签 */
    .hot-tag{position:absolute;top:8px;left:8px;padding:4px 10px;background:#ff4757;color:white;border-radius:4px;font-size:11px;font-weight:600;z-index:10}
    .hot-tag::before{content:'🔥 ';margin-right:2px}

    /* 收藏功能 */
    .favorite-btn{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.6);border:none;cursor:pointer;color:rgba(255,255,255,.7);font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:10}
    .favorite-btn:hover{background:rgba(0,0,0,.8);color:#fff}
    .favorite-btn.favorited{color:#ffd700}
    .favorite-section{display:none}
    .favorite-section.active{display:block}

    /* 快捷面板 */
    .quick-panel{display:none;position:fixed;top:70px;right:20px;width:400px;max-height:calc(100vh - 100px);background:rgba(20,20,20,.98);border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden;z-index:900;box-shadow:0 8px 40px rgba(0,0,0,.6)}
    .quick-panel.active{display:block;animation:slideIn 0.3s ease}
    @keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    .quick-panel-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.1)}
    .quick-panel-title{font-size:16px;font-weight:600;color:#fff;display:flex;align-items:center;gap:8px}
    .quick-panel-close{width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:rgba(255,255,255,.6);font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .quick-panel-close:hover{background:rgba(255,255,255,.2);color:#fff}
    .quick-panel-content{padding:16px;overflow-y:auto;max-height:calc(100vh - 180px)}
    .quick-panel-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:8px;background:rgba(255,255,255,.03);cursor:pointer;transition:all .2s;margin-bottom:8px}
    .quick-panel-item:hover{background:rgba(255,255,255,.08);transform:translateX(4px)}
    .quick-panel-item-poster{width:80px;height:45px;background:#141414;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .quick-panel-item-poster img{width:100%;height:100%;object-fit:contain}
    .quick-panel-item-icon{font-size:24px;opacity:.5}
    .quick-panel-item-info{flex:1;min-width:0}
    .quick-panel-item-name{font-size:14px;font-weight:500;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .quick-panel-item-group{font-size:12px;color:rgba(255,255,255,.5);margin-top:2px}
    .quick-panel-item-time{font-size:11px;color:rgba(255,255,255,.4)}
    .quick-panel-empty{text-align:center;padding:40px 20px;color:rgba(255,255,255,.5)}
    .quick-panel-empty-icon{font-size:48px;margin-bottom:12px;opacity:.3}
    .quick-panel-empty-text{font-size:14px}

    /* 在线人数显示 */
    .online-counter{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.6);font-size:13px}
    .online-dot{width:8px;height:8px;border-radius:50%;background:#34c759;animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .online-count{font-weight:600;color:#34c759}

    /* Toast 提示组件（已隐藏） */
    /* .toast-container{position:fixed;top:90px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:12px;pointer-events:none}
    .toast{min-width:320px;max-width:500px;padding:16px 20px;border-radius:10px;color:#fff;font-size:14px;line-height:1.5;box-shadow:0 8px 30px rgba(0,0,0,.4);pointer-events:auto;backdrop-filter:blur(10px);animation:toastSlideIn 0.3s ease;transition:all 0.2s}
    .toast.error{background:linear-gradient(135deg,rgba(231,9,20,.9) 0%,rgba(220,38,38,.9) 100%);border:1px solid rgba(239,68,68,.3)}
    .toast.warning{background:linear-gradient(135deg,rgba(234,179,8,.9) 0%,rgba(245,158,11,.9) 100%);border:1px solid rgba(251,191,36,.3)}
    .toast.success{background:linear-gradient(135deg,rgba(34,197,94,.9) 0%,rgba(22,163,74,.9) 100%);border:1px solid rgba(74,222,128,.3)}
    .toast.info{background:linear-gradient(135deg,rgba(59,130,246,.9) 0%,rgba(37,99,235,.9) 100%);border:1px solid rgba(96,165,250,.3)}
    .toast-title{font-weight:600;margin-bottom:4px;font-size:15px}
    .toast-message{color:rgba(255,255,255,.85);white-space:pre-wrap}
    .toast-close{position:absolute;top:12px;right:12px;width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.15);border:none;cursor:pointer;color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .toast-close:hover{background:rgba(255,255,255,.25);transform:scale(1.1)}
    @keyframes toastSlideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toastSlideOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}
    .toast.hiding{animation:toastSlideOut 0.3s ease forwards} */

    @media (max-width:1024px){
      .sidebar{display:none}
      .content{margin-left:0}
      .footer{margin-left:0}
      .channels-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
      .player-wrapper.collapsed{width:360px;height:200px}
    }
    @media (max-width:768px){
      .header{padding:0 20px}
      .nav-links{display:none}
      .search-box{margin-left:20px;max-width:300px}
      .channels-grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}
      .player-wrapper{right:10px;bottom:10px;width:calc(100vw - 20px)}
      .player-wrapper.collapsed{height:calc(100vw * 9/16);width:calc(100vw - 20px)}
      .player-wrapper.expanded{width:calc(100vw - 20px);height:calc(100vh - 90px);right:10px;top:70px}
      .player-title{font-size:12px}
      .player-group{font-size:11px}
      .pagination{flex-wrap:wrap;gap:6px;padding:15px 0}
      .pagination button{padding:6px 12px;font-size:12px}
      .pagination-info{width:100%;text-align:center;margin-bottom:10px}
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="logo">📺 IPTV Live</div>
    <div class="search-box">
      <input type="text" class="search-input" id="searchInput" placeholder="搜索频道..." oninput="handleSearch()">
    </div>
    <div class="quick-entries">
      <button class="quick-entry" onclick="showHistoryInMain()" title="播放历史">
        🕐
        <span class="quick-entry-tip">播放历史</span>
        <span class="quick-entry-badge" id="historyBadge" style="display:none;">0</span>
      </button>
      <button class="quick-entry" onclick="showFavoritesInMain()" title="我的收藏">
        ⭐
        <span class="quick-entry-tip">我的收藏</span>
        <span class="quick-entry-badge" id="favoritesBadge" style="display:none;">0</span>
      </button>
      <button class="quick-entry" onclick="showRandomInMain()" title="随机推荐">
        🎯
        <span class="quick-entry-tip">随机推荐</span>
      </button>
    </div>
    <div class="online-counter">
      <span class="online-dot"></span>
      <span class="online-count" id="onlineCount">0</span> 人在观看
    </div>
  </header>
  
  <div class="main">
    <aside class="sidebar" id="sidebar">
      <div class="group-item active" data-group="" onclick="filterByGroup('')">全部频道</div>
      <div id="groupList"></div>
    </aside>

    <div class="content">
      <div id="loading" class="loading">
        <div class="spinner"></div>
        <span class="loading-text">加载频道列表...</span>
      </div>

      <div id="channelList" style="display:none;">
        <div class="section-title" id="sectionTitle">全部频道</div>
        <div class="channels-grid" id="channelsGrid"></div>
        <div class="pagination" id="pagination"></div>
      </div>

      <div id="emptyState" class="empty-state" style="display:none;">
        <div class="empty-icon">📺</div>
        <div class="empty-title">未找到频道</div>
        <div class="empty-desc">请尝试其他搜索词或分组</div>
      </div>

    </div>
  </div>

  <!-- 快捷面板 -->
  <div class="quick-panel" id="quickPanel">
    <div class="quick-panel-header">
      <div class="quick-panel-title" id="quickPanelTitle">📌 面板</div>
      <button class="quick-panel-close" onclick="closeQuickPanel()">&times;</button>
    </div>
    <div class="quick-panel-content" id="quickPanelContent"></div>
  </div>

      <!-- Toast 提示容器（已隐藏） -->
  <!-- <div class="toast-container" id="toastContainer"></div> -->

  <footer class="footer">
    <p>&copy; 2024 IPTV Live. 免费高清直播服务</p>
  </footer>

  <div class="player-wrapper collapsed" id="playerWrapper">
    <div class="player-header" id="playerHeader">
      <div class="player-info">
        <div class="player-title" id="playerTitle">频道名称</div>
        <div class="player-group" id="playerGroup">分组</div>
      </div>
      <div class="player-controls">
        <button class="player-btn" onclick="togglePlayerSize()" title="切换大小">⛶</button>
        <button class="player-btn close-modal" onclick="closePlayer()" title="关闭">&times;</button>
      </div>
    </div>
    <div class="player-container">
      <video id="videoPlayer" controls autoplay>
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <script>
    // 安全检测：阻止在非原始域名上运行（防止代理）
    (function() {
      const currentDomain = window.location.hostname;
      const originalDomain = window.location.hostname; // 实际部署时应该硬编码你的域名
      // 允许 localhost 和原始域名
      const allowedDomains = [originalDomain, 'localhost', '127.0.0.1'];
      // 注意：这里没有硬编码域名，因为代码是在运行时嵌入的
      // 可以通过 worker 注入一个 ALLOWED_DOMAIN 变量
      if (window.ALLOWED_DOMAINS && !window.ALLOWED_DOMAINS.some(d => currentDomain === d || currentDomain.endsWith('.' + d))) {
        alert('此页面无法在当前域名运行，请访问原始站点');
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#fff;background:#000;"><h1>访问被拒绝</h1></div>';
        throw new Error('Domain mismatch');
      }
    })();

    // ========== AES-GCM 解密函数 ==========
    async function decryptAES(encryptedBase64, secret) {
      try {
        // 从密钥派生加密密钥
        const keyData = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        // 从 Base64 解码
        const binaryString = atob(encryptedBase64);
        const combined = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          combined[i] = binaryString.charCodeAt(i);
        }

        // 分离 IV (前 12 bytes)
        const iv = combined.slice(0, 12);
        const encryptedData = combined.slice(12);

        // 解密
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: iv },
          key,
          encryptedData
        );

        return new TextDecoder().decode(decrypted);
      } catch (error) {
        console.error('AES 解密失败:', error);
        throw error;
      }
    }

    // 解密密钥（需要与服务器端SECRET_KEY保持一致）
    // 注意：生产环境中不应该在前端硬编码密钥，应该通过其他方式传递
    // 这里为了演示，使用一个默认值。实际部署时应该通过环境变量或配置注入
    const DECRYPTION_KEY = window.DECRYPTION_KEY || 'default-secret-key';

    const API_BASE = '/api';
    let allChannels = [];
    let allGroups = [];
    let currentGroup = '';
    let searchTimeout = null;
    let currentHls = null;
    let isPlayerOpen = false;
    let isPlayerExpanded = false;
    let currentPage = 1;
    let pageSize = 50;
    let totalPages = 1;
    let totalChannels = 0;
    let currentSearch = '';
    let favorites = JSON.parse(localStorage.getItem('iptv_favorites') || '[]');
    let history = JSON.parse(localStorage.getItem('iptv_history') || '[]');
    let featuredChannels = [];
    let isUpdatingKey = false;  // 防止重复更新密钥
    // let lastErrorTime = 0;  // 防止重复显示相同错误（已禁用）
    // let lastErrorMsg = '';   // 记录上一条错误消息（已禁用）

    /* Toast 提示函数（已禁用）
    function showToast(message, type = 'info', duration = 4000, checkModal = false) {
      // 如果需要检查modal状态且modal已关闭，则不显示Toast
      if (checkModal && !isModalOpen) {
        console.log('[Toast] Modal已关闭，跳过Toast显示');
        return;
      }

      // 防止重复显示相同错误（1秒内的相同错误只显示一次）
      const now = Date.now();
      if (type === 'error' && message === lastErrorMsg && now - lastErrorTime < 1000) {
        console.log('[Toast] 跳过重复错误');
        return;
      }
      lastErrorMsg = message;
      lastErrorTime = now;

      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = \`toast \${type}\`;

      let title = '';
      switch (type) {
        case 'error':
          title = '❌ 播放失败';
          break;
        case 'warning':
          title = '⚠️ 提示';
          break;
        case 'success':
          title = '✅ 成功';
          break;
        case 'info':
        default:
          title = 'ℹ️ 提示';
          break;
      }

      toast.innerHTML = \`
        <div style="position:relative;padding-right:30px">
          <div class="toast-title">\${title}</div>
          <div class="toast-message">\${message}</div>
          <button class="toast-close">&times;</button>
        </div>
      \`;

      container.appendChild(toast);

      // 点击关闭按钮
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.onclick = () => removeToast(toast);

      // 自动移除
      const timeout = setTimeout(() => removeToast(toast), duration);

      // 鼠标悬停时暂停自动移除
      toast.onmouseenter = () => clearTimeout(timeout);
      toast.onmouseleave = () => {
        setTimeout(() => removeToast(toast), duration);
      };
    }

    function removeToast(toast) {
      if (!toast || toast.classList.contains('hiding')) return;
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
    */

    // 页面加载时获取频道列表
    window.addEventListener('DOMContentLoaded', () => {
      loadChannels();
      updateOnlineCounter();
      updateBadges();
      setInterval(updateOnlineCounter, 30000); // 每30秒更新在线人数
    });
    
    async function loadChannels(page = 1) {
      try {
        const params = new URLSearchParams({
          page: page,
          page_size: pageSize
        });
        if (currentSearch) {
          params.append('search', currentSearch);
        }
        if (currentGroup) {
          params.append('group', currentGroup);
        }

        const response = await fetch(API_BASE + '/channels?' + params.toString());
        const data = await response.json();

        if (data.success) {
          currentPage = data.pagination?.page || 1;
          totalPages = data.pagination?.total_pages || 1;
          totalChannels = data.pagination?.total || 0;
          allChannels = data.channels || [];
          allGroups = data.groups || [];

          renderGroups();
          renderChannels(allChannels);
          renderPagination();

          document.getElementById('loading').style.display = 'none';
          document.getElementById('channelList').style.display = 'block';
        } else {
          showError('加载频道列表失败');
        }
      } catch (error) {
        console.error('加载失败:', error);
        showError('网络错误，请稍后重试');
      }
    }
    
    function renderGroups() {
      const container = document.getElementById('groupList');
      container.innerHTML = allGroups.map(group =>
        \`<div class="group-item" data-group="\${escapeHtml(group)}" onclick="filterByGroup('\${escapeHtml(group)}')">
          \${escapeHtml(group)}
        </div>\`
      ).join('');

      // 更新选中状态（包括硬编码的"全部频道"选项）
      document.querySelectorAll('.group-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === currentGroup) {
          item.classList.add('active');
        }
      });
    }
    
    function renderChannels(channels) {
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      
      if (channels.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }
      
      emptyState.style.display = 'none';
      container.innerHTML = channels.map(channel => {
        const logo = channel.logo
          ? \`<img src="\${escapeHtml(channel.logo)}" alt="\${escapeHtml(channel.channel_name)}">\`
          : '<div class="channel-icon">📺</div>';

        const isFavorited = favorites.some(f => f.hash === channel.channel_hash);
        const hotIndex = Math.floor(Math.random() * 20); // 随机显示热门标签
        const showHotTag = hotIndex === 0;

        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')">
            <div class="channel-poster">
              \${logo}
              \${showHotTag ? '<div class="hot-tag">热门</div>' : ''}
              <button class="favorite-btn \${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')" data-hash="\${escapeHtml(channel.channel_hash)}">\${isFavorited ? '⭐' : '☆'}</button>
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(channel.channel_name)}</div>
              <div class="channel-group">\${escapeHtml(channel.group_title || '')}</div>
            </div>
          </div>
        \`;
      }).join('');
    }
    
    function filterByGroup(group) {
      currentGroup = group;
      currentPage = 1; // 重置到第一页

      // 更新标题
      if (group === 'history') {
        document.getElementById('sectionTitle').textContent = '🕐 播放历史';
      } else if (group === 'favorites') {
        document.getElementById('sectionTitle').textContent = '⭐ 我的收藏';
      } else if (group === 'random') {
        document.getElementById('sectionTitle').textContent = '🎯 随机推荐';
      } else {
        document.getElementById('sectionTitle').textContent = group || '全部频道';
      }

      // 如果是收藏分组，显示收藏列表
      if (group === 'favorites') {
        renderFavorites();
        document.getElementById('pagination').innerHTML = '';
        return;
      }

      // 如果是播放历史，显示历史列表
      if (group === 'history') {
        showHistoryInMain();
        return;
      }

      // 如果是随机推荐，显示推荐列表
      if (group === 'random') {
        showRandomInMain();
        return;
      }

      // 重新加载频道
      loadChannels(1);
    }
    
    function handleSearch() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const keyword = document.getElementById('searchInput').value.trim();

        if (!keyword) {
          currentSearch = '';
          currentPage = 1;
          filterByGroup(currentGroup);
          return;
        }

        currentSearch = keyword;
        currentPage = 1; // 重置到第一页

        // 重新加载频道
        loadChannels(1);
        document.getElementById('sectionTitle').textContent = \`搜索: \${escapeHtml(keyword)}\`;
      }, 300);
    }

    function goToPage(page) {
      if (page >= 1 && page <= totalPages) {
        loadChannels(page);
        // 滚动到频道列表顶部
        document.getElementById('channelList').scrollIntoView({ behavior: 'smooth' });
      }
    }

    function renderPagination() {
      const container = document.getElementById('pagination');
      if (totalPages <= 1) {
        container.innerHTML = '';
        return;
      }

      let html = \`<span class="pagination-info">共 \${totalChannels} 个频道，第 \${currentPage}/\${totalPages} 页</span>\`;
      html += \`<button onclick="goToPage(1)" \${currentPage === 1 ? 'disabled' : ''}>首页</button>\`;
      html += \`<button onclick="goToPage(\${currentPage - 1})" \${currentPage === 1 ? 'disabled' : ''}>上一页</button>\`;

      const maxButtons = 7;
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);

      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToPage(\${i})" class="\${i === currentPage ? 'active' : ''}">\${i}</button>\`;
      }

      html += \`<button onclick="goToPage(\${currentPage + 1})" \${currentPage === totalPages ? 'disabled' : ''}>下一页</button>\`;
      html += \`<button onclick="goToPage(\${totalPages})" \${currentPage === totalPages ? 'disabled' : ''}>末页</button>\`;

      container.innerHTML = html;
    }

    function playChannel(hash, name, group, retryCount = 0) {
      // 添加到历史记录 - 支持直接使用传入的参数
      const channel = allChannels.find(c => c.channel_hash === hash);
      if (channel) {
        addToHistory(channel);
      } else if (hash && name) {
        // 如果在当前列表中找不到频道，直接用传入参数创建历史记录
        addToHistory({
          channel_hash: hash,
          channel_name: name,
          group_title: group
        });
      }

      const playerWrapper = document.getElementById('playerWrapper');
      const video = document.getElementById('videoPlayer');
      const title = document.getElementById('playerTitle');
      const groupName = document.getElementById('playerGroup');

      title.textContent = name;
      groupName.textContent = group;

      playerWrapper.classList.add('active');
      isPlayerOpen = true;

      // 销毁之前的Hls实例
      if (currentHls) {
        currentHls.destroy();
        currentHls = null;
      }

      // 先获取token，再获取播放地址
      fetch(window.location.origin + '/api/token?hash=' + encodeURIComponent(hash))
        .then(res => res.json())
        .then(data => {
          if (data.success && data.token) {
            console.log('Token获取成功');
            // 使用token获取播放地址
            return fetch(window.location.origin + '/api/play/' + hash + '?token=' + encodeURIComponent(data.token));
          } else {
            throw new Error('获取Token失败');
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.play_url) {
            let playUrl = data.play_url;

            // 如果返回的是加密的URL，进行解密
            if (data.encoded && data.encryption === 'aes-gcm') {
              decryptAES(playUrl, DECRYPTION_KEY)
                .then(decryptedUrl => {
                  console.log('URL已解密:', decryptedUrl);
                  startPlay(decryptedUrl, video);
                })
                .catch(async (e) => {
                  console.error('URL解密失败:', e);

                  // 如果是第一次解密失败，尝试更新密钥并重试
                  if (retryCount === 0) {
                    console.log('[PlayChannel] 尝试更新密钥并重试');
                    const keyUpdated = await updateEncryptionKey();
                    if (keyUpdated) {
                      console.log('[PlayChannel] 密钥已更新，重新播放');
                      playChannel(hash, name, group, 1);  // 重试一次
                      return;
                    }
                  }

                  // 更新密钥失败或已重试过，关闭播放器
                  console.error('[PlayChannel] 解密失败，无法播放');
                  closePlayer();
                });
              return; // 异步解密，提前返回
            }

            console.log('播放地址:', playUrl);
            startPlay(playUrl, video);
          } else {
            console.error('该频道暂时无法播放');
            closePlayer();
          }
        })
        .catch(function(error) {
          console.error('播放失败:', error);
          closePlayer();
        });
    }

    function togglePlayerSize() {
      const playerWrapper = document.getElementById('playerWrapper');
      isPlayerExpanded = !isPlayerExpanded;
      playerWrapper.classList.toggle('expanded', isPlayerExpanded);
      playerWrapper.classList.toggle('collapsed', !isPlayerExpanded);
    }

    // 启动播放
    function startPlay(playUrl, video) {
      console.log('开始播放:', playUrl);

      // 检测源类型
      const isHls = playUrl.includes('.m3u8') ||
                     playUrl.includes('m3u8') ||
                     playUrl.includes('application/x-mpegURL') ||
                     playUrl.includes('.ts') ||
                     playUrl.endsWith('.ts') ||
                     playUrl.includes('application/x-mpegTS');

      console.log('视频源类型:', { url: playUrl, isHls });

      if (isHls && Hls.isSupported()) {
        // 使用 Hls.js 播放
        console.log('使用 Hls.js 播放');
        currentHls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30
        });

        currentHls.loadSource(playUrl);
        currentHls.attachMedia(video);

        currentHls.on(Hls.Events.MANIFEST_PARSED, function() {
          console.log('HLS manifest parsed, 开始播放');
          video.play().catch(function(e) { console.error('播放失败:', e); });
        });

        currentHls.on(Hls.Events.ERROR, function(event, data) {
          console.error('HLS错误:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('网络错误:', data);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('尝试恢复媒体错误');
                currentHls.recoverMediaError();
                break;
              default:
                console.log('无法恢复的错误，销毁Hls实例');
                currentHls.destroy();
                break;
            }
          }
        });
      } else {
        // 非HLS源，使用原生video播放
        console.log('使用原生video播放（非HLS）');
        video.src = playUrl;
        video.load();

        video.addEventListener('error', function(e) {
          const errorCode = video.error ? video.error.code : 0;
          console.error('原生video错误:', errorCode, video.error);
        });

        video.addEventListener('play', function() {
          console.log('视频开始播放');
          setTimeout(function() {
            if (video.readyState >= 2) {
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;
              console.log('视频分辨率:', videoWidth, 'x', videoHeight);

              if (videoWidth === 0 || videoHeight === 0) {
                console.warn('检测到黑屏问题: 分辨率为0');
              }
            }
          }, 3000);
        });

        video.play().catch(function(e) {
          console.error('播放失败:', e);
        });
      }
    }
    
    function closePlayer() {
      const playerWrapper = document.getElementById('playerWrapper');
      const video = document.getElementById('videoPlayer');

      isPlayerOpen = false;
      isPlayerExpanded = false;

      video.pause();
      video.src = '';
      video.load();

      // 销毁HLS播放器，停止所有网络请求
      if (currentHls) {
        console.log('[Player] Destroying HLS instance');
        currentHls.destroy();
        currentHls = null;
      }

      playerWrapper.classList.remove('active');
      playerWrapper.classList.remove('expanded');
      playerWrapper.classList.add('collapsed');
    }
    
    function showError(message) {
      document.getElementById('loading').innerHTML = \`<div style="color:#e50914">\${escapeHtml(message)}</div>\`;
    }
    
    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // 按ESC关闭播放器
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // 如果播放器展开，先折叠；如果已折叠，则关闭
        if (isPlayerOpen && isPlayerExpanded) {
          togglePlayerSize();
        } else {
          closePlayer();
        }
      }
    });

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', function() {
      console.log('[Player] Page unloading, cleaning up');
      if (currentHls) {
        currentHls.destroy();
        currentHls = null;
      }
    });

    // 播放器拖动功能
    (function() {
      const playerWrapper = document.getElementById('playerWrapper');
      const playerHeader = document.getElementById('playerHeader');
      let isDragging = false;
      let startX, startY, startLeft, startBottom;

      playerHeader.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('player-btn')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = playerWrapper.getBoundingClientRect();
        startLeft = rect.left;
        startBottom = window.innerHeight - rect.bottom;
        playerHeader.style.cursor = 'grabbing';
        e.preventDefault();
      });

      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newLeft = startLeft + dx;
        const newBottom = startBottom - dy;

        playerWrapper.style.right = 'auto';
        playerWrapper.style.left = newLeft + 'px';
        playerWrapper.style.bottom = newBottom + 'px';
        playerWrapper.style.top = 'auto';
      });

      document.addEventListener('mouseup', function() {
        if (isDragging) {
          isDragging = false;
          playerHeader.style.cursor = 'move';
        }
      });
    })();

    // ========== 新增功能函数 ==========

    // 更新加密密钥（从服务器获取最新配置）
    async function updateEncryptionKey() {
      if (isUpdatingKey) {
        console.log('[KeyUpdate] 正在更新密钥，跳过重复请求');
        return false;
      }

      try {
        isUpdatingKey = true;
        console.log('[KeyUpdate] 开始获取最新配置');

        const response = await fetch(window.location.origin + '/api/config');
        const result = await response.json();

        if (result.success && result.config) {
          const { enable_url_encryption, url_encryption_key } = result.config;

          // 如果启用了URL加密且有密钥，更新全局密钥
          if (enable_url_encryption && url_encryption_key) {
            DECRYPTION_KEY = url_encryption_key;
            console.log('[KeyUpdate] 密钥已更新');
            return true;
          } else {
            console.log('[KeyUpdate] 未启用URL加密或无密钥');
            return false;
          }
        } else {
          console.error('[KeyUpdate] 获取配置失败:', result);
          return false;
        }
      } catch (error) {
        console.error('[KeyUpdate] 更新密钥失败:', error);
        return false;
      } finally {
        isUpdatingKey = false;
      }
    }

    // 在线人数显示（模拟）
    function updateOnlineCounter() {
      const baseCount = Math.floor(Math.random() * 100) + 50;
      const randomOffset = Math.floor(Math.random() * 20) - 10;
      const count = baseCount + randomOffset;
      document.getElementById('onlineCount').textContent = count.toLocaleString();
    }


    // 随机推荐
    async function initFeaturedChannels() {
      // 从后端获取随机推荐频道
      try {
        const response = await fetch(API_BASE + '/channels?action=random&count=30');
        const data = await response.json();

        if (data.success && data.channels) {
          featuredChannels = data.channels;
          console.log('获取到随机推荐频道:', featuredChannels.length);
        } else {
          console.error('获取随机推荐失败:', data.error);
          featuredChannels = [];
        }
      } catch (error) {
        console.error('获取随机推荐失败:', error);
        featuredChannels = [];
      }
    }




    function showRandomInMain() {
      // 重新生成随机推荐
      initFeaturedChannels();

      // 清除分组选择
      currentGroup = 'random';
      renderGroups();

      // 更新标题
      document.getElementById('sectionTitle').textContent = '🎯 随机推荐';

      // 隐藏加载和分页
      document.getElementById('loading').style.display = 'none';
      document.getElementById('channelList').style.display = 'block';
      document.getElementById('pagination').innerHTML = '';

      // 获取前30条推荐
      const randomChannels = featuredChannels.slice(0, 30);

      if (!randomChannels || randomChannels.length === 0) {
        const container = document.getElementById('channelsGrid');
        const emptyState = document.getElementById('emptyState');
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = '暂无推荐频道';
        document.querySelector('.empty-desc').textContent = '请稍后再试';
        return;
      }

      // 渲染推荐列表
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      emptyState.style.display = 'none';

      container.innerHTML = randomChannels.map((channel, index) => {
        const logo = channel.logo
          ? \`<img src="\${escapeHtml(channel.logo)}" alt="logo">\`
          : '<div class="channel-icon">📺</div>';

        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')">
            <div class="channel-poster">
              \${logo}
              \${index < 5 ? '<div class="hot-tag">推荐</div>' : ''}
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(channel.channel_name)}</div>
              <div class="channel-group">\${escapeHtml(channel.group_title || '')}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function showRecommendedPanel() {
      showRandomInMain();
    }

    function playFeaturedChannel() {
      showRandomInMain();
    }

    function playFeaturedChannel() {
      // 每次点击都重新生成随机推荐
      initFeaturedChannels();
      // 显示推荐面板
      showRecommendedPanel();
    }

    // 收藏功能
    function toggleFavorite(hash, name, group) {
      const index = favorites.findIndex(f => f.hash === hash);
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push({ hash, name, group, addedAt: Date.now() });
      }
      localStorage.setItem('iptv_favorites', JSON.stringify(favorites));

      // 更新徽章
      updateBadges();

      // 如果在收藏页面，重新渲染
      if (currentGroup === 'favorites') {
        renderFavorites();
      }

      // 更新当前页面的收藏按钮状态
      const btn = document.querySelector(\`.favorite-btn[data-hash="\${hash}"]\`);
      if (btn) {
        btn.textContent = index > -1 ? '☆' : '⭐';
        btn.classList.toggle('favorited', index > -1);
      }
    }

    function renderFavorites() {
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      document.getElementById('pagination').innerHTML = '';

      // 获取前30条收藏
      const favoritesItems = favorites.slice(0, 30);

      if (favoritesItems.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = '还没有收藏';
        document.querySelector('.empty-desc').textContent = '点击频道卡片上的星星按钮添加收藏';
        return;
      }

      emptyState.style.display = 'none';
      container.innerHTML = favoritesItems.map(fav => {
        const logo = getLogoByHash(fav.hash);
        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')">
            <div class="channel-poster">
              \${logo}
              <button class="favorite-btn favorited" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')" data-hash="\${escapeHtml(fav.hash)}">⭐</button>
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(fav.name)}</div>
              <div class="channel-group">\${escapeHtml(fav.group)}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function getLogoByHash(hash) {
      const channel = allChannels.find(c => c.channel_hash === hash);
      if (channel && channel.logo) {
        return \`<img src="\${escapeHtml(channel.logo)}" alt="logo">\`;
      }
      return '<div class="channel-icon">📺</div>';
    }

    // 播放历史
    function addToHistory(channel) {
      const hash = channel.channel_hash || channel.hash;
      const index = history.findIndex(h => h.hash === hash);
      if (index > -1) {
        history.splice(index, 1);
      }

      // 统一字段名为 hash, name, group
      history.unshift({
        hash: hash,
        name: channel.channel_name,
        group: channel.group_title,
        watchedAt: Date.now()
      });

      // 只保留最近20条
      if (history.length > 20) {
        history = history.slice(0, 20);
      }

      localStorage.setItem('iptv_history', JSON.stringify(history));
      updateBadges();
    }

    function getTimeAgo(timestamp) {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      if (seconds < 60) return '刚刚';
      if (seconds < 3600) return Math.floor(seconds / 60) + '分钟前';
      if (seconds < 86400) return Math.floor(seconds / 3600) + '小时前';
      if (seconds < 604800) return Math.floor(seconds / 86400) + '天前';
      return '一周前';
    }

    // ========== 快捷面板功能 ==========

    // 显示播放历史面板

    function showHistoryInMain() {
      // 清除分组选择
      currentGroup = 'history';
      renderGroups();

      // 更新标题
      document.getElementById('sectionTitle').textContent = '🕐 播放历史';

      // 隐藏加载和分页
      document.getElementById('loading').style.display = 'none';
      document.getElementById('channelList').style.display = 'block';
      document.getElementById('pagination').innerHTML = '';

      // 获取前30条历史记录
      const historyItems = history.slice(0, 30);

      if (historyItems.length === 0) {
        const container = document.getElementById('channelsGrid');
        const emptyState = document.getElementById('emptyState');
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = '暂无播放历史';
        document.querySelector('.empty-desc').textContent = '观看的频道会自动显示在这里';
        return;
      }

      // 渲染历史记录
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      emptyState.style.display = 'none';

      container.innerHTML = historyItems.map(h => {
        const logo = getLogoByHash(h.hash);
        const timeAgo = getTimeAgo(h.watchedAt);
        const logoHtml = logo ? \`<img src="\${escapeHtml(logo)}" alt="\${escapeHtml(h.name)}">\` : '<div class="channel-icon">📺</div>';

        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(h.hash)}', '\${escapeHtml(h.name)}', '\${escapeHtml(h.group)}')">
            <div class="channel-poster">
              \${logoHtml}
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(h.name)}</div>
              <div class="channel-group">\${escapeHtml(h.group)}</div>
              <div class="channel-group" style="margin-top:4px;font-size:11px;color:#e50914">\${timeAgo}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // 在主数据区域显示收藏
    function showFavoritesInMain() {
      // 清除分组选择
      currentGroup = 'favorites';
      renderGroups();

      // 更新标题
      document.getElementById('sectionTitle').textContent = '⭐ 我的收藏';

      // 隐藏加载和分页
      document.getElementById('loading').style.display = 'none';
      document.getElementById('channelList').style.display = 'block';
      document.getElementById('pagination').innerHTML = '';

      // 获取前30条收藏
      const favoritesItems = favorites.slice(0, 30);

      if (favoritesItems.length === 0) {
        const container = document.getElementById('channelsGrid');
        const emptyState = document.getElementById('emptyState');
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = '还没有收藏';
        document.querySelector('.empty-desc').textContent = '点击频道卡片上的星星添加收藏';
        return;
      }

      // 渲染收藏列表
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      emptyState.style.display = 'none';

      container.innerHTML = favoritesItems.map(fav => {
        const logo = getLogoByHash(fav.hash);
        const logoHtml = logo ? \`<img src="\${escapeHtml(logo)}" alt="\${escapeHtml(fav.name)}">\` : '<div class="channel-icon">📺</div>';

        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')">
            <div class="channel-poster">
              \${logoHtml}
              <button class="favorite-btn favorited" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')" data-hash="\${escapeHtml(fav.hash)}">⭐</button>
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(fav.name)}</div>
              <div class="channel-group">\${escapeHtml(fav.group)}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // 显示播放历史面板
    function showHistoryPanel() {
      showHistoryInMain();
    }

    // 显示收藏面板
    function showFavoritesPanel() {
      showFavoritesInMain();
    }

    // 关闭快捷面板
    function closeQuickPanel() {
      const panel = document.getElementById('quickPanel');
      panel.classList.remove('active');
      document.removeEventListener('click', handlePanelOutsideClick);
    }

    // 处理面板外部点击
    function handlePanelOutsideClick(e) {
      const panel = document.getElementById('quickPanel');
      const quickEntries = document.querySelector('.quick-entries');
      if (!panel.contains(e.target) && !quickEntries.contains(e.target)) {
        closeQuickPanel();
      }
    }

    // 更新徽章数量
    function updateBadges() {
      const historyBadge = document.getElementById('historyBadge');
      const favoritesBadge = document.getElementById('favoritesBadge');

      if (history.length > 0) {
        historyBadge.textContent = history.length;
        historyBadge.style.display = 'flex';
      } else {
        historyBadge.style.display = 'none';
      }

      if (favorites.length > 0) {
        favoritesBadge.textContent = favorites.length;
        favoritesBadge.style.display = 'flex';
      } else {
        favoritesBadge.style.display = 'none';
      }
    }
  </script>
</body>
</html>`;
