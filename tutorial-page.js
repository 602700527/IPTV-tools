// 教程页面 - 如何添加订阅地址到播放器
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';

export const TUTORIAL_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>使用教程 - TV Live Service</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-padding-top:70px}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;min-height:100vh;display:flex;flex-direction:column;color:#fff}

    /* 主内容区域 */

    .main-content{flex:1;width:100%;margin-top:70px;padding:20px 0 0}

    .container{max-width:1200px;margin:0 auto;padding:0 20px}

    .tabs-container{background:#141414;border-radius:16px;padding:20px;margin-bottom:30px;border:1px solid rgba(255,255,255,0.1)}

    .tabs-nav{display:flex;gap:10px;margin-bottom:30px;flex-wrap:wrap;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,0.1)}

    .tab-btn{background:transparent;color:rgba(255,255,255,0.6);border:none;padding:14px 24px;border-radius:10px;cursor:pointer;font-size:15px;font-weight:500;transition:all 0.3s;-webkit-tap-highlight-color:transparent;white-space:nowrap}
    .tab-btn:hover{color:#fff;background:rgba(255,255,255,0.05)}
    .tab-btn.active{color:#fff;background:linear-gradient(135deg,#e50914 0%,#b81d24 100%)}

    .tab-content{display:none}
    .tab-content.active{display:block}

    .tutorial-section{margin-bottom:40px}
    .tutorial-section:last-child{margin-bottom:0}

    .section-header{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,0.1)}
    .section-icon{width:48px;height:48px;background:linear-gradient(135deg,rgba(229,9,20,0.2) 0%,rgba(184,29,36,0.2) 100%);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px}
    .section-title h2{font-size:24px;font-weight:700;color:#fff;margin-bottom:4px}
    .section-title p{color:rgba(255,255,255,0.5);font-size:14px}

    .step-list{display:flex;flex-direction:column;gap:20px}

    .step-item{background:rgba(255,255,255,0.03);border-radius:12px;padding:24px;padding-left:40px;position:relative;margin-left:12px}
    .step-number{position:absolute;left:-8px;top:24px;background:#e50914;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700}

    .step-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}
    .step-title{font-size:18px;font-weight:600;color:#fff;margin-bottom:4px}
    .step-desc{color:rgba(255,255,255,0.6);font-size:14px}

    .step-content{line-height:1.8;color:rgba(255,255,255,0.8);font-size:15px}

    .step-content h3{font-size:16px;font-weight:600;color:#fff;margin:16px 0 8px 0}
    .step-content p{margin-bottom:10px}
    .step-content ul{padding-left:20px;margin-bottom:10px}
    .step-content li{margin-bottom:6px}

    .code-block{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:16px;margin:16px 0;font-family:monospace;font-size:13px;word-break:break-all;color:#22c55e}

    .tip-box{background:rgba(52,199,89,0.1);border:1px solid rgba(52,199,89,0.3);border-radius:8px;padding:16px;margin:16px 0}
    .tip-box h4{color:#34c759;font-size:14px;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:8px}
    .tip-box p{color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6}

    .warning-box{background:rgba(255,204,0,0.1);border:1px solid rgba(255,204,0,0.3);border-radius:8px;padding:16px;margin:16px 0}
    .warning-box h4{color:#ffcc00;font-size:14px;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:8px}
    .warning-box p{color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6}

    .ui-mockup{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin:16px 0;text-align:center}
    .mockup-device{background:linear-gradient(180deg,#1a1a1a 0%,#0a0a0a 100%);border:2px solid rgba(255,255,255,0.2);border-radius:20px;padding:30px;max-width:400px;margin:0 auto}
    .mockup-header{display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,0.1)}
    .mockup-nav{width:24px;height:24px;background:#e50914;border-radius:6px}
    .mockup-title{flex:1;height:8px;background:rgba(255,255,255,0.1);border-radius:4px}
    .mockup-body{background:#080808;border-radius:10px;padding:20px}
    .mockup-input{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:12px;margin-bottom:12px;text-align:left;color:rgba(255,255,255,0.5);font-size:13px}
    .mockup-button{background:#e50914;color:#fff;border:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}

    .device-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-bottom:30px}

    .device-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;cursor:pointer;transition:all 0.3s}
    .device-card:hover{transform:translateY(-4px);border-color:rgba(229,9,20,0.3);box-shadow:0 8px 24px rgba(229,9,20,0.2)}
    .device-icon{font-size:40px;margin-bottom:12px}
    .device-name{font-size:18px;font-weight:600;color:#fff;margin-bottom:8px}
    .device-desc{color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:12px}
    .device-tag{display:inline-block;background:rgba(229,9,20,0.2);color:#e50914;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600}

    @media (max-width:768px){
      html{scroll-padding-top:60px}
      .main-content{margin-top:80px;padding:16px 0 0}
      .container{padding:0 12px}

      .tabs-container{padding:16px;border-radius:12px;margin-bottom:20px}
      .tabs-nav{margin-bottom:20px;padding-bottom:12px;gap:6px}
      .tab-btn{padding:10px 14px;font-size:13px;border-radius:8px}
      .tab-btn.active{padding:10px 14px}

      .tutorial-section{margin-bottom:24px}
      .section-header{flex-direction:row;align-items:flex-start;gap:10px;margin-bottom:16px;padding-bottom:12px}
      .section-icon{width:40px;height:40px;font-size:20px;border-radius:10px}
      .section-title h2{font-size:20px}
      .section-title p{font-size:12px}

      .step-list{gap:12px}
      .step-item{padding:16px;padding-left:44px;margin-left:8px;border-radius:10px}
      .step-number{left:-12px;top:16px;width:28px;height:28px;font-size:13px}
      .step-header{margin-bottom:10px}
      .step-title{font-size:16px}
      .step-desc{font-size:12px}
      .step-content{font-size:14px;line-height:1.6}
      .step-content h3{font-size:14px;margin:12px 0 6px 0}
      .step-content p{margin-bottom:8px}
      .step-content ul{padding-left:16px;margin-bottom:8px}
      .step-content li{margin-bottom:4px}

      .code-block{padding:12px;margin:12px 0;font-size:12px}
      .tip-box{padding:12px;margin:12px 0}
      .tip-box h4{font-size:13px}
      .tip-box p{font-size:13px}
      .warning-box{padding:12px;margin:12px 0}
      .warning-box h4{font-size:13px}
      .warning-box p{font-size:13px}

      .ui-mockup{padding:20px;margin:12px 0}
      .mockup-device{padding:20px;max-width:100%}
      .mockup-header{margin-bottom:16px;padding-bottom:12px}
      .mockup-body{padding:16px}
      .mockup-input{padding:10px;margin-bottom:10px;font-size:12px}
      .mockup-button{padding:12px 24px;font-size:13px}

      .device-grid{grid-template-columns:1fr;gap:12px;margin-bottom:20px}
      .device-card{padding:20px;border-radius:10px}
      .device-icon{font-size:36px;margin-bottom:10px}
      .device-name{font-size:16px}
      .device-desc{font-size:13px;margin-bottom:10px}
      .device-tag{padding:3px 10px;font-size:11px}
    }

    @media (max-width:480px){
      .main-content{margin-top:70px;padding:12px 0 0}
      .container{padding:0 8px}

      .tabs-container{padding:12px}
      .tabs-nav{gap:4px}
      .tab-btn{padding:8px 12px;font-size:12px}

      .section-header{gap:8px}
      .section-icon{width:36px;height:36px;font-size:18px}
      .section-title h2{font-size:18px}

      .step-item{padding:14px;padding-left:40px;margin-left:6px}
      .step-number{left:-10px;top:14px;width:26px;height:26px;font-size:12px}
      .step-title{font-size:15px}
      .step-content{font-size:13px}

      .ui-mockup{padding:16px}
      .mockup-device{padding:16px}
      .mockup-body{padding:14px}
    }
  </style>
</head>
  <body>
  ${PAGE_HEADER}

  <div class="main-content">
    <div class="container">
      <div class="tabs-container">
        <div class="tabs-nav">
          <button class="tab-btn active" onclick="switchTab('ios')">📱 iOS Apple</button>
          <button class="tab-btn" onclick="switchTab('android')">🤖 Android</button>
          <button class="tab-btn" onclick="switchTab('tv')">📺 智能电视</button>
          <button class="tab-btn" onclick="switchTab('desktop')">💻 电脑播放器</button>
          <button class="tab-btn" onclick="switchTab('other')">🎮 其他设备</button>
        </div>

        <!-- iOS 标签页 -->
      <div id="tab-ios" class="tab-content active">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon">📱</div>
            <div class="section-title">
              <h2>APTV (Apple TV)</h2>
              <p>最流行的Apple TV播放器</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">下载安装 APTV</div>
                <div class="step-desc">App Store 搜索 "APTV" 或 "Apple TV"</div>
              </div>
              <div class="step-content">
                <p>在 Apple TV 上打开 App Store，搜索"APTV"并安装。</p>
                <div class="tip-box">
                  <h4>💡 提示</h4>
                  <p>也可以在 iPhone 上下载后 AirPlay 到 Apple TV</p>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">打开设置</div>
                <div class="step-desc">添加订阅源</div>
              </div>
              <div class="step-content">
                <p>打开 APTV，进入 设置 → 添加订阅源</p>
                <p>选择 "M3U 播放列表"</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:#fff;font-size:14px;font-weight:600">APTV 设置</div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:20px;padding:12px;background:rgba(255,255,255,0.05);border-radius:8px;">添加订阅源</div>
                      <div style="color:rgba(255,255,255,0.5);font-size:13px;">✓ 添加播放列表</div>
                      <div style="color:rgba(255,255,255,0.5);font-size:13px;">● 添加播放源</div>
                      <div style="color:rgba(255,255,255,0.5);font-size:13px;">● 添加EPG源</div>
                      <div style="color:rgba(255,255,255,0.5);font-size:13px;">● X-Treme Codes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-header">
                <div class="step-title">输入订阅信息</div>
                <div class="step-desc">填写名称和订阅地址</div>
              </div>
              <div class="step-content">
                <p>填写以下信息：</p>
                <ul>
                  <li><strong>名称：</strong>输入任意喜欢的名称（如：IPTV Live）</li>
                  <li><strong>URL：</strong>粘贴你的订阅地址</li>
                </ul>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:#fff;font-size:14px;font-weight:600">添加播放列表</div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:rgba(255,255,255,0.8);font-size:14px;margin-bottom:12px;">名称</div>
                      <div class="mockup-input">IPTV Live</div>
                      <div style="color:rgba(255,255,255,0.8);font-size:14px;margin-bottom:12px;">URL</div>
                      <div class="mockup-input">https://iptv-search.com...</div>
                      <button class="mockup-button">添加</button>
                    </div>
                  </div>
                </div>
                <div class="tip-box">
                  <h4>💡 获取订阅地址</h4>
                  <p>登录后在用户中心或激活页面获取订阅地址</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon">🎨</div>
            <div class="section-title">
              <h2>iPlayTV</h2>
              <p>支持多种格式的播放器</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">下载安装</div>
                <div class="step-desc">App Store 搜索安装</div>
              </div>
              <div class="step-content">
                <p>在 iPhone 或 Apple TV 的 App Store 中搜索 "iPlayTV"</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">添加订阅源</div>
              </div>
              <div class="step-content">
                <p>打开应用 → 点击"+"号 → 选择"M3U"</p>
                <p>粘贴订阅地址并添加</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Android 标签页 -->
      <div id="tab-android" class="tab-content">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon">🤖</div>
            <div class="section-title">
              <h2>Televizo</h2>
              <p>Android 强播放器</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">下载安装 Televizo</div>
                <div class="step-desc">Google Play 商店搜索</div>
              </div>
              <div class="step-content">
                <p>在 Android 手机或平板的 Google Play 中搜索 "Televizo" 并安装</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">打开菜单</div>
              </div>
              <div class="step-content">
                <p>打开 Televizo，点击左上角菜单图标</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                        <span style="color:rgba(255,255,255,0.7);font-size:20px;">☰</span>
                        <span>Televizo</span>
                      </div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:rgba(255,255,255,0.7);font-size:14px;">播放列表</div>
                      <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:10px;">● 收藏</div>
                      <div style="color:rgba(255,255,255,0.5);font-size:13px;">● 搜索</div>
                      <div style="color:rgba(255,255,255,0.5);font-size:13px;">● 设置</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-header">
                <div class="step-title">添加播放列表</div>
              </div>
              <div class="step-content">
                <p>选择 "播放列表" → 点击 "+" 号</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:#fff;font-size:14px;font-weight:600">添加播放列表</div>
                    </div>
                    <div class="mockup-body">
                      <div class="mockup-input">播放列表名称</div>
                      <div class="mockup-input">M3U URL</div>
                      <button class="mockup-button">添加</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon">📺</div>
            <div class="section-title">
              <h2>IPTV Smarters Pro</h2>
              <p>功能强大的播放器</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">下载安装</div>
              </div>
              <div class="step-content">
                <p>从 Google Play 下载 IPTV Smarters Pro</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">添加播放列表</div>
              </div>
              <div class="step-content">
                <p>选择 "Add Playlist" → 填写名称和 M3U URL</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:#fff;font-size:14px;font-weight:600;">IPTV Smarters Pro</div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:20px;">Add Playlist</div>
                      <div class="mockup-input">Playlist Name</div>
                      <div class="mockup-input">M3U Playlist URL</div>
                      <button class="mockup-button">Add</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 智能电视 标签页 -->
      <div id="tab-tv" class="tab-content">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon">📺</div>
            <div class="section-title">
              <h2>TiviMate Premium</h2>
              <p>Android TV 播放器推荐</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">从 Google Play 下载</div>
              </div>
              <div class="step-content">
                <p>在 Android TV 的 Google Play 中搜索 TiviMate Premium 并安装</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">添加播放列表</div>
              </div>
              <div class="step-content">
                <p>选择 "添加播放列表" → 选择 "M3U 播放列表" → 输入 URL</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:space-between;">
                        <span>TiviMate Premium</span>
                        <span style="font-size:20px;">+</span>
                      </div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:20px;">添加播放列表</div>
                      <div class="mockup-input">播放列表名称</div>
                      <div class="mockup-input">M3U URL</div>
                      <button class="mockup-button">添加</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon">🎬</div>
            <div class="section-title">
              <h2>Kodi</h2>
              <p>开源媒体中心</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">安装 PVR IPTV Simple Client</div>
              </div>
              <div class="step-content">
                <p>在 Kodi 的插件仓库中搜索并安装 PVR IPTV Simple Client</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">配置插件</div>
              </div>
              <div class="step-content">
                <p>打开插件设置 → 勾选 "M3U Play List" → 输入 M3U URL</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:#fff;font-size:14px;font-weight:600;">Kodi 设置</div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-bottom:10px;">☑ 启用 M3U Play List</div>
                      <div class="mockup-input">M3U Location</div>
                      <div class="mockup-input">M3U Play List URL</div>
                      <button class="mockup-button">OK</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 电脑播放器 标签页 -->
      <div id="tab-desktop" class="tab-content">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon">💻</div>
            <div class="section-title">
              <h2>VLC Media Player</h2>
              <p>跨平台媒体播放器</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">打开网络串流</div>
              </div>
              <div class="step-content">
                <p>VLC → 媒体 → 打开网络串流</p>
                <div class="ui-mockup">
                  <div class="mockup-device" style="max-width: 500px;">
                    <div class="mockup-header">
                      <div style="color:#fff;font-size:14px;font-weight:600;">VLC Media Player</div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:15px;">请输入网络 URL</div>
                      <div class="mockup-input">https://iptv-search.com/sub/xxx.m3u</div>
                      <button class="mockup-button">播放</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他设备 标签页 -->
      <div id="tab-other" class="tab-content">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon">🎮</div>
            <div class="section-title">
              <h2>更多播放器</h2>
              <p>支持更多设备</p>
            </div>
          </div>

          <div class="device-grid">
            <div class="device-card">
              <div class="device-icon">🐧</div>
              <div class="device-name">IPTVX</div>
              <div class="device-desc">Android 高端播放器</div>
              <span class="device-tag">推荐</span>
            </div>

            <div class="device-card">
              <div class="device-icon">📱</div>
              <div class="device-name">GSE IPTV</div>
              <div class="device-desc">Android 轻量级播放器</div>
              <span class="device-tag">免费</span>
            </div>

            <div class="device-card">
              <div class="device-icon">🌐</div>
              <div class="device-name">OTT Navigator</div>
              <div class="device-desc">功能丰富的播放器</div>
              <span class="device-tag">免费</span>
            </div>

            <div class="device-card">
              <div class="device-icon">📺</div>
              <div class="device-name">XCIPTV</div>
              <div class="device-desc">现代界面设计</div>
            </div>
          </div>
        </div>

        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon">📋</div>
            <div class="section-title">
              <h2>通用配置步骤</h2>
              <p>适用于大多数播放器</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">获取订阅地址</div>
                <div class="step-desc">在用户中心或激活页面获取</div>
              </div>
              <div class="step-content">
                <p>登录后，在用户中心或支付成功页面复制订阅地址</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">添加播放列表</div>
                <div class="step-desc">选择 M3U 播放列表选项</div>
              </div>
              <div class="step-content">
                <p>在播放器设置中找到"添加播放列表"或"添加订阅"选项</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-header">
                <div class="step-title">输入订阅地址</div>
                <div class="step-desc">粘贴 URL 并保存</div>
              </div>
              <div class="step-content">
                <p>粘贴复制的订阅地址，保存并等待频道列表加载</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>
    </div>
  </div>

  ${PAGE_FOOTER}

  <script>
    function switchTab(tabName) {
      // 隐藏所有标签页内容
      const contents = document.querySelectorAll('.tab-content');
      contents.forEach(content => content.classList.remove('active'));

      // 移除所有按钮的激活状态
      const buttons = document.querySelectorAll('.tab-btn');
      buttons.forEach(btn => btn.classList.remove('active'));

      // 显示选中的标签页
      document.getElementById('tab-' + tabName).classList.add('active');

      // 激活对应按钮
      event.target.classList.add('active');
    }
  </script>

  <!-- Translate.js 自动翻译 -->
  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    function initTranslate() {
      if (typeof translate !== 'undefined' && !window.translate) {
        window.translate = translate;
      }
      if (typeof translate !== 'undefined' && translate.language) {
        translate.language.setLocal('chinese_simplified');
        translate.service.use('client.edge');
        translate.listener.start();
        translate.setAutoDiscriminateLocalLanguage();
        translate.execute();
      } else {
        setTimeout(initTranslate, 100);
      }
    }
    initTranslate();

    function changeLanguage(lang) {
      var t = window.translate || translate;
      if (t && t.changeLanguage) {
        t.changeLanguage(lang);
      }
    }
  </script>
</body>
</html>`;
