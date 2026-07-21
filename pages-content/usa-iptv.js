// USA IPTV Landing Page
export const pageTitle = 'USA IPTV Channels - Full Directory of American Live TV Channels';
export const pageDescription = 'Discover USA IPTV channels including CNN, ESPN, HBO, ABC, NBC and more. Get your subscription and start watching American live TV today.';

export const styles = `
*{margin:0;padding:0;box-sizing:border-box}
:root{
--accent:#e50914;
--bg:#0a0a0a;
--bg-card:#141414;
--border:1px solid rgba(255,255,255,0.08);
--text:#fff;
--text-secondary:rgba(255,255,255,0.6);
--radius:0
}
html{scroll-padding-top:70px}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);min-height:100vh;display:flex;flex-direction:column;color:var(--text)}
.main-content{flex:1;width:100%;margin-top:70px;padding:20px 0}
.container{max-width:1200px;margin:0 auto;padding:0 20px}
.page-header{text-align:center;padding:3rem 0 2rem}
.page-header h1{font-size:2.5rem;font-weight:800;margin-bottom:1rem;color:var(--text)}
.page-header p{font-size:1.1rem;color:var(--text-secondary);max-width:600px;margin:0 auto}
.section{margin-bottom:3rem}
.section-title{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;padding-bottom:0.75rem;border-bottom:var(--border)}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:0}
.feature-card{background:transparent;border:var(--border);border-radius:var(--radius);padding:1.5rem}
.feature-card h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem;color:var(--accent)}
.feature-card p{color:var(--text-secondary);font-size:0.95rem;line-height:1.6}
.channel-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0}
.channel-item{background:transparent;border:var(--border);border-radius:var(--radius);padding:1rem;display:flex;align-items:center;gap:0.75rem;text-decoration:none}
.channel-item:hover{border-color:var(--accent)}
.channel-item span{font-size:0.9rem;color:var(--text)}
.faq-list{max-width:800px;margin:0 auto}
.faq-item{background:transparent;border:var(--border);border-radius:var(--radius);padding:1.5rem;margin-bottom:0}
.faq-item h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem;color:var(--text)}
.faq-item p{color:var(--text-secondary);line-height:1.7}
.cta-section{background:transparent;border:var(--border);border-radius:var(--radius);padding:3rem;text-align:center;margin:2rem 0}
.cta-section h2{font-size:1.75rem;font-weight:700;margin-bottom:1rem}
.cta-section p{font-size:1.1rem;opacity:0.9;margin-bottom:1.5rem}
.cta-btn{display:inline-block;background:var(--accent);color:#fff;padding:14px 32px;border-radius:var(--radius);font-weight:600;text-decoration:none;transition:transform 0.2s}
.cta-btn:hover{transform:scale(1.02)}
@media(max-width:768px){
.main-content{margin-top:80px}
.container{padding:0 16px}
.page-header{padding:2rem 0 1.5rem}
.page-header h1{font-size:1.75rem}
.feature-grid{grid-template-columns:1fr}
.channel-list{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:480px){
.main-content{margin-top:70px}
.container{padding:0 12px}
.page-header{padding:1.5rem 0 1rem}
.page-header h1{font-size:1.4rem}
.page-header p{font-size:0.95rem}
.feature-grid{grid-template-columns:1fr}
.channel-list{grid-template-columns:1fr}
.cta-section{padding:2rem 1rem}
.cta-section h2{font-size:1.4rem}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.5rem"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> USA IPTV Channels</h1>
      <p>Discover American IPTV channels including CNN, ESPN, HBO, ABC, NBC and more. HD quality, smooth streaming</p>
    </div>

    <div class="section">
      <h2 class="section-title">Why Choose USA IPTV?</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Rich Channel Selection</h3>
          <p>News, sports, entertainment, movies and more - CNN, Fox News, ESPN, HBO and all the major American networks</p>
        </div>
        <div class="feature-card">
          <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg> HD Quality Streaming</h3>
          <p>720P/1080P/4K quality with smart CDN acceleration for smooth, buffer-free viewing</p>
        </div>
        <div class="feature-card">
          <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Multi-Device Support</h3>
          <p>Smart TVs, phones, tablets, computers - one subscription for your whole family</p>
        </div>
        <div class="feature-card">
          <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Watch Anywhere</h3>
          <p>24/7 live streaming with sports events, news, and hit shows updated in real-time</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Popular American Channels</h2>
      <div id="channelList" class="channel-list">
        <div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.5)">Loading channels...</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list">
        <div class="faq-item">
          <h3>What devices are supported?</h3>
          <p>Smart TVs (Samsung, LG, Sony), Android phones and tablets, Apple TV, and any device that supports M3U playlists.</p>
        </div>
        <div class="faq-item">
          <h3>How often do I need to renew?</h3>
          <p>Flexible subscription cycles - monthly, quarterly, or yearly. Longer subscriptions come with better discounts.</p>
        </div>
        <div class="faq-item">
          <h3>What video quality can I expect?</h3>
          <p>Most channels broadcast in 1080P HD with some in 4K Ultra HD. Smart routing ensures smooth playback.</p>
        </div>
        <div class="faq-item">
          <h3>How do I get started?</h3>
          <p>Visit our plans page, choose a subscription, complete payment, and get your subscription URL to start watching.</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Start Watching USA IPTV</h2>
      <p>Subscribe for access to 8000+ live TV channels</p>
      <p style="margin-top:0.5rem;font-size:0.95rem;opacity:0.9;">Updates pushed to your player - no site login needed. Ensure your player has "auto-update playlist" enabled.</p>
      <a href="/plans" class="cta-btn">View Plans →</a>
    </div>
  </div>
</div>
<script>
(function() {
  fetch('/api/category/United-States')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var container = document.getElementById('channelList');
      var channels = data.data && data.data.channels ? data.data.channels : [];
      if (channels.length > 0) {
        // 随机打乱并取前50个
        channels.sort(function() { return Math.random() - 0.5; });
        channels = channels.slice(0, 50);
        container.innerHTML = channels.map(function(ch) {
          return '<a href="/channel/' + ch.slug + '" class="channel-item"><span>' + ch.name + '</span></a>';
        }).join('');
      } else {
        container.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem">No channels available</p>';
      }
    })
    .catch(function() {
      document.getElementById('channelList').innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem">Failed to load</p>';
    });
})();
</script>
`;
