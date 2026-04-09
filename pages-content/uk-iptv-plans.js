// UK IPTV Landing Page
export const pageTitle = 'UK IPTV 套餐对比 - 英国IPTV服务套餐选购指南';
export const pageDescription = '英国IPTV套餐全面对比，涵盖Sky TV、BT Sport、ITV等英国频道。比较价格、频道数量、设备兼容性。选择最适合您的英国IPTV套餐。';

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
.channel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem}
.channel-item{background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:1rem;text-align:center}
.channel-item .name{font-size:0.95rem;color:#fff;margin-top:0.5rem}
.benefit-list{max-width:800px;margin:0 auto}
.benefit-item{display:flex;gap:1rem;padding:1.5rem;background:#141414;border-radius:12px;margin-bottom:1rem}
.benefit-icon{font-size:2rem;flex-shrink:0}
.benefit-content h3{font-size:1.1rem;font-weight:600;margin-bottom:0.5rem}
.benefit-content p{color:rgba(255,255,255,0.7);font-size:0.95rem;line-height:1.6}
.faq-list{max-width:800px;margin:0 auto}
.faq-item{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem;margin-bottom:1rem}
.faq-item h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem}
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
.channel-grid{grid-template-columns:repeat(2,1fr)}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>🇬🇧 UK IPTV 套餐对比</h1>
      <p>英国IPTV服务套餐全面解析，涵盖BBC、ITV、Channel 4、Sky Sports等热门频道</p>
    </div>

    <div class="section">
      <h2 class="section-title">为什么选择英国IPTV？</h2>
      <div class="benefit-list">
        <div class="benefit-item">
          <span class="benefit-icon">🏰</span>
          <div class="benefit-content">
            <h3>英伦特色内容</h3>
            <p>收看BBC News、ITV、Sky Sports、Sky News等正宗英国频道，感受纯正英伦风情</p>
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">⚽</span>
          <div class="benefit-content">
            <h3>体育赛事直播</h3>
            <p>英超联赛、英足总杯、橄榄球、板球等英国本土体育赛事实时转播</p>
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">📺</span>
          <div class="benefit-content">
            <h3>新闻资讯</h3>
            <p>BBC Breaking News、Sky News、Channel 4 News等权威新闻频道，24小时滚动播出</p>
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">🎬</span>
          <div class="benefit-content">
            <h3>娱乐剧集</h3>
            <p>Sky Atlantic、BBC iPlayer、ITV Hub等平台精彩剧集和娱乐节目</p>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">热门英国频道</h2>
      <div id="channelList" class="channel-grid">
        <div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.5);grid-column:1/-1">正在加载频道...</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">常见问题</h2>
      <div class="faq-list">
        <div class="faq-item">
          <h3>UK IPTV套餐包含哪些频道？</h3>
          <p>标准套餐包含BBC、ITV、Channel 4、Sky Sports、Sky News等主流频道。高级套餐还可额外解锁Sky Atlantic、BT Sport等付费频道。</p>
        </div>
        <div class="faq-item">
          <h3>可以同时在多个设备观看吗？</h3>
          <p>根据套餐类型，支持1-3台设备同时在线播放。家庭套餐可满足多人同时使用需求。</p>
        </div>
        <div class="faq-item">
          <h3>是否需要特殊设备？</h3>
          <p>无需卫星天线或有线电视盒。任何支持M3U格式的设备或应用均可使用我们的IPTV服务。</p>
        </div>
        <div class="faq-item">
          <h3>如何开始使用UK IPTV？</h3>
          <p>选择合适的套餐完成订阅，获取订阅地址后在您的设备上配置即可开始观看。</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>开始观看英国IPTV</h2>
      <p>立即订阅，获取BBC、Sky Sports等英国频道访问权限</p>
      <a href="/plans" class="cta-btn">查看套餐 →</a>
    </div>
  </div>
</div>
<script>
(async function() {
  try {
    const res = await fetch('/api/channels?group=United%20Kingdom&page_size=50');
    const data = await res.json();
    const container = document.getElementById('channelList');
    if (data.success && data.channels && data.channels.length > 0) {
      container.innerHTML = data.channels.map(ch => 
        '<a href="/channel/' + ch.channel_hash + '" class="channel-item"><span class="name">' + ch.channel_name + '</span></a>'
      ).join('');
    } else {
      container.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem;grid-column:1/-1">暂无频道数据</p>';
    }
  } catch(e) {
    document.getElementById('channelList').innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem;grid-column:1/-1">加载失败</p>';
  }
})();
</script>
`;
