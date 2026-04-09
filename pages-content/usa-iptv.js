// USA IPTV Landing Page
export const pageTitle = 'USA IPTV 频道大全 - 美国IPTV直播频道目录';
export const pageDescription = '探索美国IPTV直播频道大全，涵盖CNN、ESPN、HBO、ABC、NBC等主流电视台。立即获取订阅，开始观看美国直播电视。';

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
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}
.feature-card{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem}
.feature-card h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem;color:#e50914}
.feature-card p{color:rgba(255,255,255,0.7);font-size:0.95rem;line-height:1.6}
.channel-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem}
.channel-item{background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:1rem;display:flex;align-items:center;gap:0.75rem}
.channel-item img{width:40px;height:40px;border-radius:6px;object-fit:contain;background:rgba(255,255,255,0.05)}
.channel-item span{font-size:0.9rem;color:#fff}
.faq-list{max-width:800px;margin:0 auto}
.faq-item{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem;margin-bottom:1rem}
.faq-item h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem;color:#fff}
.faq-item p{color:rgba(255,255,255,0.7);line-height:1.7}
.cta-section{background:linear-gradient(135deg,#e50914 0%,#b81d24 100%);border-radius:16px;padding:3rem;text-align:center;margin:2rem 0}
.cta-section h2{font-size:1.75rem;font-weight:700;margin-bottom:1rem}
.cta-section p{font-size:1.1rem;opacity:0.9;margin-bottom:1.5rem}
.cta-btn{display:inline-block;background:#fff;color:#e50914;padding:14px 32px;border-radius:8px;font-weight:600;text-decoration:none;transition:transform 0.2s}
.cta-btn:hover{transform:scale(1.05)}
@media(max-width:768px){
.main-content{margin-top:80px}
.container{padding:0 16px}
.page-header{padding:2rem 0 1.5rem}
.page-header h1{font-size:1.75rem}
.feature-grid{grid-template-columns:1fr}
.channel-list{grid-template-columns:repeat(2,1fr)}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>🇺🇸 USA IPTV 频道大全</h1>
      <p>探索美国IPTV直播频道，涵盖CNN、ESPN、HBO、ABC、NBC等主流电视台。高清画质，流畅播放</p>
    </div>

    <div class="section">
      <h2 class="section-title">为什么选择美国IPTV？</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3>🇺🇸 丰富频道资源</h3>
          <p>涵盖新闻、体育、娱乐、电影等全品类美国频道，CNN、Fox News、ESPN、HBO等应有尽有</p>
        </div>
        <div class="feature-card">
          <h3>📺 高清流畅播放</h3>
          <p>支持720P/1080P/4K画质，智能CDN加速，保证流畅观看体验</p>
        </div>
        <div class="feature-card">
          <h3>📱 多设备支持</h3>
          <p>兼容Smart TV、手机、平板、电脑等全平台，一个订阅全家共享</p>
        </div>
        <div class="feature-card">
          <h3>⏰ 随时随地观看</h3>
          <p>7x24小时不间断直播，体育赛事、新闻资讯、热门剧集实时更新</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">热门美国频道</h2>
      <div id="channelList" class="channel-list">
        <div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.5)">正在加载频道...</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">常见问题</h2>
      <div class="faq-list">
        <div class="faq-item">
          <h3>美国IPTV支持哪些设备？</h3>
          <p>支持三星、LG、索尼智能电视，Android手机平板，Apple TV，以及任何支持M3U播放列表的设备和应用。</p>
        </div>
        <div class="faq-item">
          <h3>需要多久续订一次？</h3>
          <p>订阅周期灵活，可按月、季度或年订阅。长期订阅享受更多折扣优惠。</p>
        </div>
        <div class="faq-item">
          <h3>画面清晰度如何？</h3>
          <p>大部分频道支持1080P高清播出，部分频道支持4K超高清。采用智能线路分配，确保流畅播放。</p>
        </div>
        <div class="faq-item">
          <h3>如何获取订阅？</h3>
          <p>访问我们的订阅页面选择套餐，完成支付后即可获得订阅地址，开始观看美国IPTV直播。</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>开始观看美国IPTV</h2>
      <p>立即订阅，获取8000+全球直播频道访问权限</p>
      <a href="/plans" class="cta-btn">查看套餐 →</a>
    </div>
  </div>
</div>
<script>
(async function() {
  try {
    const res = await fetch('/api/channels?group=United%20States&page_size=50');
    const data = await res.json();
    const container = document.getElementById('channelList');
    if (data.success && data.channels && data.channels.length > 0) {
      container.innerHTML = data.channels.map(ch => 
        '<a href="/channel/' + ch.channel_hash + '" class="channel-item"><span>' + ch.channel_name + '</span></a>'
      ).join('');
    } else {
      container.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem">暂无频道数据</p>';
    }
  } catch(e) {
    document.getElementById('channelList').innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem">加载失败</p>';
  }
})();
</script>
`;
