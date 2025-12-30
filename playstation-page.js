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
    .nav-links{display:flex;gap:30px;margin-left:auto}
    .nav-links a{color:rgba(255,255,255,.8);text-decoration:none;font-size:14px;transition:color .2s}
    .nav-links a:hover{color:#fff}
    .nav-links a.active{color:#e50914}
    
    .main{display:flex;margin-top:70px;min-height:calc(100vh - 70px)}
    .sidebar{width:260px;background:#141414;border-right:1px solid rgba(255,255,255,.1);overflow-y:auto;padding:20px 0;position:fixed;height:calc(100vh - 70px)}
    .group-item{padding:12px 24px;color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;font-size:14px;border-left:3px solid transparent}
    .group-item:hover{color:#fff;background:rgba(255,255,255,.05)}
    .group-item.active{color:#fff;background:rgba(229,9,20,.1);border-left-color:#e50914}
    .content{flex:1;margin-left:260px;padding:30px}
    
    .section-title{font-size:18px;font-weight:600;margin-bottom:20px;color:#fff}
    .channels-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
    .channel-card{background:#141414;border-radius:8px;overflow:hidden;cursor:pointer;transition:all .3s;border:2px solid transparent}
    .channel-card:hover{transform:scale(1.05);border-color:#e50914;z-index:10;box-shadow:0 8px 30px rgba(0,0,0,.5)}
    .channel-poster{aspect-ratio:16/9;background:#1a1a1a;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .channel-poster img{width:100%;height:100%;object-fit:contain}
    .channel-icon{font-size:48px;opacity:.5}
    .play-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(229,9,20,.8);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}
    .channel-card:hover .play-overlay{opacity:1}
    .play-icon{width:60px;height:60px;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center}
    .play-icon::after{content:'';width:0;height:0;border-left:20px solid #fff;border-top:12px solid transparent;border-bottom:12px solid transparent;margin-left:4px}
    .channel-info{padding:14px}
    .channel-name{font-size:14px;font-weight:500;color:#fff;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .channel-group{font-size:12px;color:rgba(255,255,255,.5)}
    
    .modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.95);z-index:2000;align-items:center;justify-content:center}
    .modal.active{display:flex}
    .modal-content{width:90%;max-width:1200px;background:#0a0a0a;border-radius:12px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.8)}
    .player-container{position:relative;width:100%;padding-top:56.25%;background:#000}
    .player-container video{position:absolute;top:0;left:0;width:100%;height:100%}
    .modal-info{padding:20px 30px;border-top:1px solid rgba(255,255,255,.1)}
    .modal-title{font-size:24px;font-weight:600;margin-bottom:10px}
    .modal-group{color:rgba(255,255,255,.6);font-size:14px}
    .close-modal{position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.2);border:none;cursor:pointer;color:#fff;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:2010}
    .close-modal:hover{background:rgba(255,255,255,.3)}
    
    .loading{display:flex;align-items:center;justify-content:center;padding:60px;color:rgba(255,255,255,.5)}
    .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,.1);border-top-color:#e50914;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-left:16px;font-size:14px}
    
    .empty-state{text-align:center;padding:80px 20px;color:rgba(255,255,255,.5)}
    .empty-icon{font-size:64px;margin-bottom:20px;opacity:.3}
    .empty-title{font-size:20px;font-weight:600;margin-bottom:10px}
    .empty-desc{font-size:14px}
    
    .footer{text-align:center;padding:30px;color:rgba(255,255,255,.4);font-size:13px;border-top:1px solid rgba(255,255,255,.1);margin-top:40px;margin-left:260px}

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
    }
    @media (max-width:768px){
      .header{padding:0 20px}
      .nav-links{display:none}
      .search-box{margin-left:20px;max-width:300px}
      .channels-grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}
      .modal-content{width:100%;max-width:none;border-radius:0}
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="logo">📺 IPTV Live</div>
    <div class="search-box">
      <input type="text" class="search-input" id="searchInput" placeholder="搜索频道..." oninput="handleSearch()">
    </div>
    <div class="nav-links">
      <a href="/" class="active">首页</a>
      <a href="/activate">激活卡密</a>
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
      </div>
      
      <div id="emptyState" class="empty-state" style="display:none;">
        <div class="empty-icon">📺</div>
        <div class="empty-title">未找到频道</div>
        <div class="empty-desc">请尝试其他搜索词或分组</div>
      </div>
    </div>
  </div>

  <!-- Toast 提示容器（已隐藏） -->
  <!-- <div class="toast-container" id="toastContainer"></div> -->

  <footer class="footer">
    <p>&copy; 2024 IPTV Live. 免费高清直播服务</p>
  </footer>
  
  <div class="modal" id="playerModal">
    <button class="close-modal" onclick="closePlayer()">&times;</button>
    <div class="modal-content">
      <div class="player-container">
        <video id="videoPlayer" controls autoplay>
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="modal-info">
        <div class="modal-title" id="modalTitle">频道名称</div>
        <div class="modal-group" id="modalGroup">分组</div>
      </div>
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

    const API_BASE = '/api';
    let allChannels = [];
    let allGroups = [];
    let currentGroup = '';
    let searchTimeout = null;
    let currentHls = null;
    let isModalOpen = false;  // 跟踪模态框是否打开
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
    });
    
    async function loadChannels() {
      try {
        const response = await fetch(API_BASE + '/channels');
        const data = await response.json();
        
        if (data.success) {
          allChannels = data.channels || [];
          allGroups = data.groups || [];
          
          renderGroups();
          renderChannels(allChannels);
          
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
        
        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')">
            <div class="channel-poster">
              \${logo}
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
      
      // 更新UI状态
      document.querySelectorAll('.group-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === group) {
          item.classList.add('active');
        }
      });
      
      document.getElementById('sectionTitle').textContent = group || '全部频道';
      
      // 过滤频道
      const filtered = group 
        ? allChannels.filter(c => c.group_title === group)
        : allChannels;
      
      renderChannels(filtered);
    }
    
    function handleSearch() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
        
        if (!keyword) {
          filterByGroup(currentGroup);
          return;
        }
        
        // 搜索过滤
        const filtered = allChannels.filter(c => 
          c.channel_name.toLowerCase().includes(keyword) ||
          (c.group_title && c.group_title.toLowerCase().includes(keyword))
        );
        
        renderChannels(filtered);
        document.getElementById('sectionTitle').textContent = \`搜索: \${escapeHtml(document.getElementById('searchInput').value)}\`;
      }, 300);
    }
    
    function playChannel(hash, name, group) {
      const modal = document.getElementById('playerModal');
      const video = document.getElementById('videoPlayer');
      const title = document.getElementById('modalTitle');
      const groupName = document.getElementById('modalGroup');

      title.textContent = name;
      groupName.textContent = group;

      modal.classList.add('active');
      isModalOpen = true;

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
            console.log('播放地址:', data.play_url);
            startPlay(data.play_url, video);
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
      const modal = document.getElementById('playerModal');
      const video = document.getElementById('videoPlayer');

      isModalOpen = false;  // 标记模态框已关闭

      video.pause();
      video.src = '';
      video.load();

      // 销毁HLS播放器，停止所有网络请求
      if (currentHls) {
        console.log('[Player] Destroying HLS instance');
        currentHls.destroy();
        currentHls = null;
      }

      modal.classList.remove('active');
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
        closePlayer();
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
  </script>
</body>
</html>`;
