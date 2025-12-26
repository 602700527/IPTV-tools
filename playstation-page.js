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
    
    .modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.95);z-index:1000;align-items:center;justify-content:center}
    .modal.active{display:flex}
    .modal-content{width:90%;max-width:1200px;background:#0a0a0a;border-radius:12px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.8)}
    .player-container{position:relative;width:100%;padding-top:56.25%;background:#000}
    .player-container video{position:absolute;top:0;left:0;width:100%;height:100%}
    .modal-info{padding:20px 30px;border-top:1px solid rgba(255,255,255,.1)}
    .modal-title{font-size:24px;font-weight:600;margin-bottom:10px}
    .modal-group{color:rgba(255,255,255,.6);font-size:14px}
    .close-modal{position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.2);border:none;cursor:pointer;color:#fff;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:10}
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
    const API_BASE = '/api';
    let allChannels = [];
    let allGroups = [];
    let currentGroup = '';
    let searchTimeout = null;
    let currentHls = null;

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

      // 销毁之前的Hls实例
      if (currentHls) {
        currentHls.destroy();
        currentHls = null;
      }

      // 先请求获取播放URL和headers
      fetch(window.location.origin + '/api/play/' + hash)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.play_url) {
            const playUrl = data.play_url;
            const headers = data.headers || {};

            console.log('播放配置:', { playUrl, headers });

            // 检查是否需要特殊headers
            const needsSpecialHeaders = hasAnyForbiddenHeaders(headers);

            console.log('[PlayStation] 是否需要特殊headers:', needsSpecialHeaders, headers);

            if (needsSpecialHeaders) {
              // 需要特殊headers，等待扩展检测
              console.log('[PlayStation] 需要特殊headers，等待扩展检测...');

              // 设置超时，防止无限等待
              const timeout = setTimeout(() => {
                console.warn('[PlayStation] 扩展检测超时（3秒），直接尝试播放');
                startHlsPlay(playUrl, video);
              }, 3000);

              waitForExtension((available) => {
                clearTimeout(timeout);
                console.log('[PlayStation] 扩展检测结果:', available);

                if (available) {
                  console.log('[PlayStation] 扩展可用，发送headers到扩展');
                  // 扩展可用，自动发送headers到扩展
                  sendHeadersToExtension(playUrl, headers)
                    .then(() => {
                      console.log('[Auto] 已发送headers到扩展，开始播放');
                      startHlsPlay(playUrl, video);
                    })
                    .catch(error => {
                      console.error('[Auto] 发送headers失败:', error);
                      // 即使失败也尝试播放
                      startHlsPlay(playUrl, video);
                    });
                } else {
                  console.log('[PlayStation] 扩展不可用，显示安装提示');
                  // 需要特殊headers但扩展不可用
                  showExtensionDialog(playUrl, headers);
                }
              });
            } else {
              // 不需要特殊headers，直接播放
              console.log('[PlayStation] 不需要特殊headers，直接播放');
              startHlsPlay(playUrl, video);
            }
          } else {
            alert('获取播放地址失败: ' + (data.error || '未知错误'));
            closePlayer();
          }
        })
        .catch(error => {
          console.error('获取播放地址失败:', error);
          alert('网络错误，请稍后重试');
          closePlayer();
        });

      video.onerror = () => {
        console.error('视频播放错误');
      };
    }

    // 发送headers到扩展
    function sendHeadersToExtension(url, headers) {
      return new Promise((resolve, reject) => {
        console.log('[Extension] 尝试发送headers:', headers);

        // 使用 window.IPTVHelper API（由扩展 main-world.js 注入）
        if (window.IPTVHelper && typeof window.IPTVHelper.addHeaders === 'function') {
          console.log('[Extension] 使用 IPTVHelper API');
          window.IPTVHelper.addHeaders(headers, url)  // 传递视频URL
            .then(() => {
              console.log('[Extension] Headers已通过 IPTVHelper 发送');
              resolve();
            })
            .catch(error => {
              console.error('[Extension] IPTVHelper 发送失败:', error);
              reject(error);
            });
          return;
        }

        // 备用方案：直接使用 chrome.runtime（仅在扩展环境中）
        if (window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage) {
          console.log('[Extension] 使用 chrome.runtime API');
          window.chrome.runtime.sendMessage({
            action: 'autoAddHeaders',
            url: url,
            headers: headers
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('[Extension] chrome.runtime error:', chrome.runtime.lastError);
              reject(new Error(chrome.runtime.lastError.message));
            } else if (response && response.success) {
              console.log('[Extension] Headers已发送');
              resolve();
            } else {
              reject(new Error('扩展响应失败'));
            }
          });
          return;
        }

        // 两种方式都不可用
        console.warn('[Extension] 扩展API不可用');
        reject(new Error('扩展不可用，请安装 IPTV Helper 扩展'));
      });
    }

    // 检查是否有浏览器禁止的headers
    function hasAnyForbiddenHeaders(headers) {
      const forbidden = ['user-agent', 'host', 'referer', 'origin', 'cookie'];
      return Object.keys(headers).some(key =>
        forbidden.includes(key.toLowerCase())
      );
    }

    // 检查扩展是否可用
    function checkExtensionAvailable() {
      // 方法1: 检测 IPTVHelper API（最可靠）
      if (window.IPTVHelper && typeof window.IPTVHelper.addHeaders === 'function') {
        console.log('[PlayStation] 扩展检测通过: IPTVHelper API 可用');
        return true;
      }

      // 方法2: 检测 window 标志
      if (typeof window.EXTENSION_AVAILABLE !== 'undefined' && window.EXTENSION_AVAILABLE) {
        console.log('[PlayStation] 扩展检测通过: EXTENSION_AVAILABLE 标志');
        return true;
      }

      // 方法3: 检测 IPTVHelperReady 事件标志
      if (window.IPTVHelperReady) {
        console.log('[PlayStation] 扩展检测通过: IPTVHelperReady 标志');
        return true;
      }

      // 方法4: 检测 DOM 属性
      if (document.documentElement.getAttribute('data-iptv-extension') === 'available') {
        console.log('[PlayStation] 扩展检测通过: DOM 属性');
        return true;
      }

      // 方法5: 检测 chrome.runtime（备用）
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        console.log('[PlayStation] chrome.runtime API 存在（异步检查）');
        // 不在这里发送 ping，因为它是同步检查函数
        return true;
      }

      console.log('[PlayStation] 扩展检测失败：未找到扩展API');
      return false;
    }

    // 等待扩展可用（最多等待3秒）
    function waitForExtension(callback) {
      const maxAttempts = 30;  // 30次 * 100ms = 3秒
      const delay = 100;       // 每次间隔100ms
      let attempts = 0;

      // 监听扩展就绪事件
      const extensionReadyHandler = function(e) {
        console.log('[PlayStation] 收到扩展就绪事件:', e.detail);
        window.removeEventListener('iptvExtensionReady', extensionReadyHandler);
        callback(true);
      };

      window.addEventListener('iptvExtensionReady', extensionReadyHandler);

      function check() {
        attempts++;

        if (checkExtensionAvailable()) {
          console.log('[PlayStation] ✅ 扩展已就绪 (尝试', attempts, '次)');
          window.removeEventListener('iptvExtensionReady', extensionReadyHandler);
          callback(true);
        } else if (attempts >= maxAttempts) {
          console.log('[PlayStation] ❌ 扩展未检测到 (尝试', attempts, '次)');
          window.removeEventListener('iptvExtensionReady', extensionReadyHandler);
          callback(false);
        } else {
          setTimeout(check, delay);
        }
      }

      // 立即检查一次
      check();
    }

    // 显示扩展提示对话框
    function showExtensionDialog(playUrl, headers) {
      const dialog = document.createElement('div');
      dialog.style.cssText =
        'position: fixed;' +
        'top: 0;' +
        'left: 0;' +
        'right: 0;' +
        'bottom: 0;' +
        'background: rgba(0,0,0,0.9);' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'z-index: 2000;';

      const headerList = Object.entries(headers).map(([k, v]) => k + ': ' + v).join('<br>');

      dialog.innerHTML = '<div style="background: #1a1a1a;border-radius: 12px;padding: 30px;max-width: 500px;width: 90%;color: #fff;box-shadow: 0 20px 60px rgba(0,0,0,0.5);">' +
        '<h2 style="margin: 0 0 20px 0; color: #e50914;">需要浏览器扩展</h2>' +
        '<p style="margin-bottom: 20px; line-height: 1.6;">该频道需要特殊Headers（如 User-Agent），但浏览器出于安全考虑不允许网页直接设置这些Headers。</p>' +
        '<div style="background: #2a2a2a;padding: 15px;border-radius: 8px;margin-bottom: 20px;font-family: monospace;font-size: 12px;">' +
        '<strong>需要的Headers:</strong><br>' + headerList +
        '</div>' +
        '<p style="margin-bottom: 20px; color: #aaa;"><strong>解决方案：</strong>请安装浏览器扩展来修改请求Headers</p>' +
        '<div style="margin-bottom: 20px;">' +
        '<button id="downloadExtension" style="background: #4CAF50;color: white;border: none;padding: 12px 24px;border-radius: 6px;cursor: pointer;font-size: 14px;margin-right: 10px;">安装扩展</button>' +
        '<button id="tryPlay" style="background: #666;color: white;border: none;padding: 12px 24px;border-radius: 6px;cursor: pointer;font-size: 14px;">尝试播放</button>' +
        '</div>' +
        '<div style="background: #2a2a2a;padding: 15px;border-radius: 8px;font-size: 13px;">' +
        '<strong>安装步骤（Chrome/Edge）:</strong>' +
        '<ol style="margin: 10px 0 0 20px; line-height: 1.6;">' +
        '<li>打开 chrome://extensions/</li>' +
        '<li>启用"开发者模式"</li>' +
        '<li>点击"加载已解压的扩展程序"</li>' +
        '<li>选择项目目录下的 extension-example 文件夹</li>' +
        '<li>点击扩展图标，设置 User-Agent 为 iPhone</li>' +
        '</ol>' +
        '</div>' +
        '</div>';

      document.body.appendChild(dialog);

      document.getElementById('downloadExtension').onclick = () => {
        alert('请到项目目录 extension-example 文件夹，按照说明安装扩展。');
      };

      document.getElementById('tryPlay').onclick = () => {
        document.body.removeChild(dialog);
        startHlsPlay(playUrl, video);
      };
    }

    // 启动HLS播放
    function startHlsPlay(playUrl, video) {
      console.log('开始播放:', playUrl);

      // 检测源类型
      const isHls = playUrl.includes('.m3u8') ||
                     playUrl.includes('m3u8') ||
                     playUrl.includes('application/x-mpegURL');

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
          video.play().catch(e => console.error('播放失败:', e));
        });

        currentHls.on(Hls.Events.ERROR, function(event, data) {
          console.error('HLS错误:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('网络错误:', data);
                alert('播放失败: 网络错误。可能需要安装浏览器扩展来设置特殊Headers。');
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
        // 非HLS源，直接使用原生video播放
        console.log('使用原生video播放（非HLS）');
        video.src = playUrl;
        video.load();
        video.play().catch(e => {
          console.error('播放失败:', e);
          alert('播放失败: ' + e.message);
        });
      }
    }
    
    function closePlayer() {
      const modal = document.getElementById('playerModal');
      const video = document.getElementById('videoPlayer');
      
      video.pause();
      video.src = '';
      video.load(); // 强制重置
      
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
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePlayer();
      }
    });

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
      console.log('[Player] Page unloading, cleaning up');
      if (currentHls) {
        currentHls.destroy();
        currentHls = null;
      }
    });
  </script>
</body>
</html>`;
