// Android IPTV App Landing Page
export const pageTitle = 'Android IPTV App 推荐 - 最佳IPTV播放器For Android手机/平板';
export const pageDescription = '2024年最佳Android IPTV应用推荐。涵盖Televizo、IPTV Smarters Pro、TiviMate等。兼容Android手机，平板、Android TV。立即下载！';

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
.app-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem}
.app-card{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:2rem;transition:border-color 0.2s}
.app-card:hover{border-color:#e50914}
.app-header{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}
.app-icon{font-size:3rem}
.app-info h3{font-size:1.25rem;font-weight:700;margin-bottom:0.25rem}
.app-info .rating{color:#fbbf24;font-size:0.9rem}
.app-desc{color:rgba(255,255,255,0.7);font-size:0.95rem;line-height:1.7;margin-bottom:1.5rem}
.app-features{list-style:none;padding:0;margin-bottom:1.5rem}
.app-features li{padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.8);font-size:0.9rem}
.app-features li:before{content:"✓ ";color:#22c55e;margin-right:0.5rem}
.pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem}
.pros,.cons{font-size:0.85rem}
.pros h4{color:#22c55e;margin-bottom:0.5rem}
.cons h4{color:#ef4444;margin-bottom:0.5rem}
.pros li,.cons li{padding:0.25rem 0}
.download-btn{display:block;background:#e50914;color:#fff;text-align:center;padding:12px;border-radius:8px;font-weight:600;text-decoration:none;transition:background 0.2s}
.download-btn:hover{background:#f7262c}
.comparison-table{width:100%;border-collapse:collapse;background:#141414;border-radius:12px;overflow:hidden}
.comparison-table th,.comparison-table td{padding:1rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.05)}
.comparison-table th{background:#1a1a1a;font-weight:600}
.comparison-table tr:last-child td{border-bottom:none}
@media(max-width:768px){
.main-content{margin-top:80px}
.container{padding:0 16px}
.page-header{padding:2rem 0 1.5rem}
.page-header h1{font-size:1.75rem}
.app-grid{grid-template-columns:1fr}
.pros-cons{grid-template-columns:1fr}
.comparison-table{font-size:0.85rem}
.comparison-table th,.comparison-table td{padding:0.75rem}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>🤖 Android IPTV App 推荐</h1>
      <p>2024年最佳Android IPTV应用精选，涵盖Televizo、IPTV Smarters Pro、TiviMate等</p>
    </div>

    <div class="section">
      <h2 class="section-title">🏆 热门应用推荐</h2>
      <div class="app-grid">
        <div class="app-card">
          <div class="app-header">
            <span class="app-icon">📺</span>
            <div class="app-info">
              <h3>Televizo</h3>
              <span class="rating">⭐ 4.8/5</span>
            </div>
          </div>
          <p class="app-desc">Android平台最受欢迎的IPTV播放器之一，界面美观，功能丰富，支持EPG电子节目单。</p>
          <ul class="app-features">
            <li>支持M3U/XSPF播放列表</li>
            <li>EPG电子节目单</li>
            <li>支持外链字幕</li>
            <li>画中画模式</li>
          </ul>
          <div class="pros-cons">
            <div class="pros"><h4>优点</h4><ul style="list-style:none;padding:0"><li>界面精美</li><li>播放流畅</li><li>EPG准确</li></ul></div>
            <div class="cons"><h4>缺点</h4><ul style="list-style:none;padding:0"><li>付费应用</li><li>无免费版</li></ul></div>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.levist7.televizo" class="download-btn" target="_blank">Google Play 下载</a>
        </div>

        <div class="app-card">
          <div class="app-header">
            <span class="app-icon">📱</span>
            <div class="app-info">
              <h3>IPTV Smarters Pro</h3>
              <span class="rating">⭐ 4.6/5</span>
            </div>
          </div>
          <p class="app-desc">全球下载量最高的IPTV应用之一，兼容性强，支持多种订阅格式。</p>
          <ul class="app-features">
            <li>多订阅管理</li>
            <li>远程播放列表</li>
            <li>录像功能</li>
            <li>多语言支持</li>
          </ul>
          <div class="pros-cons">
            <div class="pros"><h4>优点</h4><ul style="list-style:none;padding:0"><li>免费使用</li><li>功能全面</li><li>用户基数大</li></ul></div>
            <div class="cons"><h4>缺点</h4><ul style="list-style:none;padding:0"><li>广告较多</li><li>界面较老旧</li></ul></div>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.nst.iptvsmarterspro" class="download-btn" target="_blank">Google Play 下载</a>
        </div>

        <div class="app-card">
          <div class="app-header">
            <span class="app-icon">📺</span>
            <div class="app-info">
              <h3>TiviMate Premium</h3>
              <span class="rating">⭐ 4.7/5</span>
            </div>
          </div>
          <p class="app-desc">专为Android TV打造，界面针对大屏优化，支持频道分组和收藏。</p>
          <ul class="app-features">
            <li>大屏优化UI</li>
            <li>频道分组</li>
            <li>收藏管理</li>
            <li>开机自启</li>
          </ul>
          <div class="pros-cons">
            <div class="pros"><h4>优点</h4><ul style="list-style:none;padding:0"><li>TV端优化好</li><li>播放稳定</li><li>遥控器友好</li></ul></div>
            <div class="cons"><h4>缺点</h4><ul style="list-style:none;padding:0"><li>仅支持TV端</li><li>需要付费</li></ul></div>
          </div>
          <a href="https://play.google.com/store/apps/details?id=ar.tvplayer.tvplayer" class="download-btn" target="_blank">Google Play 下载</a>
        </div>

        <div class="app-card">
          <div class="app-header">
            <span class="app-icon">🎮</span>
            <div class="app-info">
              <h3>GSE IPTV</h3>
              <span class="rating">⭐ 4.5/5</span>
            </div>
          </div>
          <p class="app-desc">开源免费的IPTV播放器，支持本地/远程M3U，界面简洁。</p>
          <ul class="app-features">
            <li>完全免费</li>
            <li>开源无广告</li>
            <li>本地/远程列表</li>
            <li>后台播放</li>
          </ul>
          <div class="pros-cons">
            <div class="pros"><h4>优点</h4><ul style="list-style:none;padding:0"><li>完全免费</li><li>无广告</li><li>轻量级</li></ul></div>
            <div class="cons"><h4>缺点</h4><ul style="list-style:none;padding:0"><li>界面朴素</li><li>EPG支持弱</li></ul></div>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.gseta.iptv" class="download-btn" target="_blank">Google Play 下载</a>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">📊 应用对比</h2>
      <table class="comparison-table">
        <thead>
          <tr><th>应用</th><th>价格</th><th>EPG</th><th>录像</th><th>推荐度</th></tr>
        </thead>
        <tbody>
          <tr><td>Televizo</td><td>付费</td><td>✓</td><td>✓</td><td>⭐⭐⭐⭐⭐</td></tr>
          <tr><td>IPTV Smarters Pro</td><td>免费</td><td>✓</td><td>✓</td><td>⭐⭐⭐⭐</td></tr>
          <tr><td>TiviMate</td><td>付费</td><td>✓</td><td>✗</td><td>⭐⭐⭐⭐⭐</td></tr>
          <tr><td>GSE IPTV</td><td>免费</td><td>✗</td><td>✗</td><td>⭐⭐⭐</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2 class="section-title">❓ 常见问题</h2>
      <div style="background:#141414;border-radius:12px;padding:1.5rem;margin-bottom:1rem">
        <h3 style="margin-bottom:0.5rem">这些App安全吗？</h3>
        <p style="color:rgba(255,255,255,0.7)">推荐的应用均来自Google Play官方商店，经过安全审核，可以放心使用。</p>
      </div>
      <div style="background:#141414;border-radius:12px;padding:1.5rem;margin-bottom:1rem">
        <h3 style="margin-bottom:0.5rem">需要订阅才能使用吗？</h3>
        <p style="color:rgba(255,255,255,0.7)">App本身免费，但需要订阅我们的IPTV服务才能观看直播频道。</p>
      </div>
      <div style="background:#141414;border-radius:12px;padding:1.5rem">
        <h3 style="margin-bottom:0.5rem">手机和电视都能用吗？</h3>
        <p style="color:rgba(255,255,255,0.7)">是的，这些App均支持Android手机、平板和Android TV设备。</p>
      </div>
    </div>
  </div>
</div>
`;
