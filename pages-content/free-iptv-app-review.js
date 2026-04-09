// Free IPTV App Review Landing Page
export const pageTitle = '免费IPTV App 评测 - 最佳免费IPTV播放器推荐2024';
export const pageDescription = '免费IPTV应用全面评测。涵盖Kodi、VLC、GSE IPTV等免费IPTV播放器。功能对比、优缺点分析、下载链接。免费观看直播电视！';

export const styles = `
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-padding-top:70px}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0a0a0a;min-height:100vh;display:flex;flex-direction:column;color:#fff}
.main-content{flex:1;width:100%;margin-top:70px;padding:20px 0}
.container{max-width:1200px;margin:0 auto;padding:0 20px}
.page-header{text-align:center;padding:3rem 0 2rem}
.page-header h1{font-size:2.5rem;font-weight:800;margin-bottom:1rem;background:linear-gradient(135deg,#fff 0%,#999 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.page-header p{font-size:1.1rem;color:rgba(255,255,255,0.7);max-width:600px;margin:0 auto}
.section{margin-bottom:3rem}
.section-title{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;padding-bottom:0.75rem;border-bottom:1px solid rgba(255,255,255,0.1)}
.app-list{max-width:800px;margin:0 auto}
.app-item{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:2rem;margin-bottom:1.5rem;transition:border-color 0.2s}
.app-item:hover{border-color:#e50914}
.app-header{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.app-icon{font-size:2.5rem}
.app-name{font-size:1.25rem;font-weight:700}
.app-badge{display:inline-block;background:#22c55e;color:#000;font-size:0.75rem;padding:2px 8px;border-radius:4px;font-weight:600;margin-left:0.5rem}
.app-desc{color:rgba(255,255,255,0.7);margin-bottom:1rem;line-height:1.7}
.app-meta{display:flex;gap:1.5rem;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:1rem}
.app-meta span{display:flex;align-items:center;gap:0.25rem}
.feature-tags{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem}
.tag{padding:4px 12px;background:rgba(255,255,255,0.05);border-radius:20px;font-size:0.8rem;color:rgba(255,255,255,0.7)}
.tag.highlight{background:rgba(229,9,20,0.2);color:#e50914}
.rating-row{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.rating{font-size:1.5rem;font-weight:700;color:#fbbf24}
.stars{color:#fbbf24}
.rating-text{font-size:0.85rem;color:rgba(255,255,255,0.5)}
.download-link{display:inline-block;background:#e50914;color:#fff;padding:10px 24px;border-radius:8px;font-weight:600;text-decoration:none;transition:background 0.2s}
.download-link:hover{background:#f7262c}
.compare-section{overflow-x:auto}
.compare-table{width:100%;border-collapse:collapse;background:#141414;border-radius:12px;min-width:600px}
.compare-table th,.compare-table td{padding:1rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.05)}
.compare-table th{background:#1a1a1a;font-weight:600;position:sticky;top:0}
.compare-table tr:last-child td{border-bottom:none}
.compare-yes{color:#22c55e}
.compare-no{color:#ef4444}
.compare-maybe{color:#fbbf24}
.tip-box{background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:1.5rem;margin-top:1.5rem}
.tip-box h4{color:#22c55e;margin-bottom:0.5rem}
.tip-box p{color:rgba(255,255,255,0.8);font-size:0.95rem}
.warning-box{background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:12px;padding:1.5rem;margin-top:1rem}
.warning-box h4{color:#fbbf24;margin-bottom:0.5rem}
.warning-box p{color:rgba(255,255,255,0.8);font-size:0.95rem}
@media(max-width:768px){
.main-content{margin-top:80px}
.container{padding:0 16px}
.page-header{padding:2rem 0 1.5rem}
.page-header h1{font-size:1.75rem}
.app-meta{flex-direction:column;gap:0.5rem}
.compare-table{font-size:0.85rem}
.compare-table th,.compare-table td{padding:0.75rem}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>🎬 免费IPTV App 评测</h1>
      <p>2024年最佳免费IPTV播放器精选，功能对比、优缺点分析</p>
    </div>

    <div class="section">
      <h2 class="section-title">🏆 免费应用推荐</h2>
      <div class="app-list">
        <div class="app-item">
          <div class="app-header">
            <span class="app-icon">📺</span>
            <div>
              <div class="app-name">VLC Media Player<span class="app-badge">最推荐</span></div>
            </div>
          </div>
          <p class="app-desc">最流行的开源媒体播放器，支持几乎所有视频格式，包括IPTV流的M3U播放列表。完全免费，无广告。</p>
          <div class="app-meta">
            <span>⭐ 4.7</span>
            <span>📱 Android/iOS/PC/Mac</span>
            <span>💾 开源免费</span>
          </div>
          <div class="feature-tags">
            <span class="tag highlight">M3U支持</span>
            <span class="tag">多平台</span>
            <span class="tag">无广告</span>
            <span class="tag">开源</span>
          </div>
          <a href="https://www.videolan.org/vlc/" class="download-link" target="_blank">免费下载</a>
        </div>

        <div class="app-item">
          <div class="app-header">
            <span class="app-icon">🎮</span>
            <div>
              <div class="app-name">Kodi<span class="app-badge">功能最强</span></div>
            </div>
          </div>
          <p class="app-desc">开源媒体中心，功能极其强大。通过PVR IPTV Simple Client插件可完美支持IPTV。</p>
          <div class="app-meta">
            <span>⭐ 4.5</span>
            <span>📱 全平台</span>
            <span>💾 开源免费</span>
          </div>
          <div class="feature-tags">
            <span class="tag highlight">PVR插件</span>
            <span class="tag">EPG支持</span>
            <span class="tag">录像功能</span>
            <span class="tag">皮肤主题</span>
          </div>
          <a href="https://kodi.tv/download" class="download-link" target="_blank">免费下载</a>
        </div>

        <div class="app-item">
          <div class="app-header">
            <span class="app-icon">🌐</span>
            <div>
              <div class="app-name">GSE IPTV<span class="app-badge">轻量推荐</span></div>
            </div>
          </div>
          <p class="app-desc">专为IPTV设计的轻量级播放器，界面简洁，支持本地和远程M3U播放列表，完全免费无广告。</p>
          <div class="app-meta">
            <span>⭐ 4.3</span>
            <span>📱 Android</span>
            <span>💾 永久免费</span>
          </div>
          <div class="feature-tags">
            <span class="tag highlight">轻量级</span>
            <span class="tag">无广告</span>
            <span class="tag">简单易用</span>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.gseta.iptv" class="download-link" target="_blank">Google Play</a>
        </div>

        <div class="app-item">
          <div class="app-header">
            <span class="app-icon">🍎</span>
            <div>
              <div class="app-name">IPTV Smarters<span class="app-badge">老牌经典</span></div>
            </div>
          </div>
          <p class="app-desc">经典IPTV播放应用，支持多订阅管理、远程播放列表和录像功能。免费版有广告。</p>
          <div class="app-meta">
            <span>⭐ 4.2</span>
            <span>📱 Android/iOS</span>
            <span>💾 免费有广告</span>
          </div>
          <div class="feature-tags">
            <span class="tag highlight">多订阅</span>
            <span class="tag">录像</span>
            <span class="tag">用户基数大</span>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.ipptv.ipv6" class="download-link" target="_blank">Google Play</a>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">📊 功能对比表</h2>
      <div class="compare-section">
        <table class="compare-table">
          <thead>
            <tr><th>应用</th><th>免费</th><th>无广告</th><th>EPG</th><th>M3U</th><th>录像</th><th>多设备</th></tr>
          </thead>
          <tbody>
            <tr><td>VLC</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td><td class="compare-no">✗</td><td class="compare-yes">✓</td><td class="compare-no">✗</td><td class="compare-yes">✓</td></tr>
            <tr><td>Kodi</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td></tr>
            <tr><td>GSE IPTV</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td><td class="compare-no">✗</td><td class="compare-yes">✓</td><td class="compare-no">✗</td><td class="compare-no">✗</td></tr>
            <tr><td>IPTV Smarters</td><td class="compare-yes">✓</td><td class="compare-no">✗</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td><td class="compare-yes">✓</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">💡 使用技巧</h2>
      <div class="tip-box">
        <h4>🎯 如何用VLC观看IPTV</h4>
        <p>1. 复制订阅地址 → 2. 打开VLC → 3. 点击"媒体" → "打开网络串流" → 4. 粘贴订阅地址 → 5. 开始播放</p>
      </div>
      <div class="warning-box">
        <h4>⚠️ 注意</h4>
        <p>免费应用可能存在稳定性问题。建议选择我们推荐的付费订阅服务以获得更稳定的高清播放体验。</p>
      </div>
    </div>

    <div class="section" style="text-align:center;padding:2rem 0">
      <h2 style="font-size:1.5rem;margin-bottom:1rem">想要更好的观看体验？</h2>
      <p style="color:rgba(255,255,255,0.7);margin-bottom:1.5rem">升级到付费订阅，去除广告，享受高清画质和稳定播放</p>
      <a href="/plans" style="display:inline-block;background:#e50914;color:#fff;padding:14px 32px;border-radius:8px;font-weight:600;text-decoration:none">查看套餐 →</a>
    </div>
  </div>
</div>
`;
