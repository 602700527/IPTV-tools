// UK IPTV Landing Page
export const pageTitle = 'UK IPTV Plans - British TV Channels and Subscription Guide';
export const pageDescription = 'UK IPTV plans comparison featuring Sky TV, BT Sport, ITV and more. Compare prices, channel counts, and device compatibility. Choose the best UK IPTV plan for you.';

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
.channel-item{background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:1rem;display:flex;align-items:center;justify-content:center;text-decoration:none}
.channel-item:hover{border-color:#e50914}
.channel-item .name{font-size:0.95rem;color:#fff}
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
      <h1><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.5rem"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> UK IPTV Plans</h1>
      <p>Your guide to UK IPTV services featuring BBC, ITV, Channel 4, Sky Sports and more</p>
    </div>

    <div class="section">
      <h2 class="section-title">Why Choose UK IPTV?</h2>
      <div class="benefit-list">
        <div class="benefit-item">
          <span class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg></span>
          <div class="benefit-content">
            <h3>British Content</h3>
            <p>Watch BBC News, ITV, Sky Sports, Sky News and authentic British programming</p>
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10l-1 9H8L7 4z"/><path d="M12 4v9"/></svg></span>
          <div class="benefit-content">
            <h3>Sports Coverage</h3>
            <p>Premier League football, FA Cup, rugby, cricket and British sports events live</p>
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg></span>
          <div class="benefit-content">
            <h3>News & Current Affairs</h3>
            <p>BBC Breaking News, Sky News, Channel 4 News - 24-hour authoritative coverage</p>
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></span>
          <div class="benefit-content">
            <h3>Entertainment & Drama</h3>
            <p>Sky Atlantic, BBC iPlayer, ITV Hub - hit shows and entertainment at your fingertips</p>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Popular British Channels</h2>
      <div id="channelList" class="channel-grid">
        <div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.5);grid-column:1/-1">Loading channels...</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list">
        <div class="faq-item">
          <h3>What channels are included in UK IPTV plans?</h3>
          <p>Standard plans include BBC, ITV, Channel 4, Sky Sports, Sky News and more. Premium plans add Sky Atlantic, BT Sport and other premium channels.</p>
        </div>
        <div class="faq-item">
          <h3>Can I watch on multiple devices?</h3>
          <p>Depending on your plan, you can stream on 1-3 devices simultaneously. Family plans support multiple users.</p>
        </div>
        <div class="faq-item">
          <h3>Do I need special equipment?</h3>
          <p>No satellite dish or cable box needed. Any device or app that supports M3U format works with our IPTV service.</p>
        </div>
        <div class="faq-item">
          <h3>How do I get started?</h3>
          <p>Choose a plan, complete your subscription, get your subscription URL, and start watching on your device.</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Start Watching UK IPTV</h2>
      <p>Subscribe for access to BBC, Sky Sports and British channels</p>
      <p style="margin-top:0.5rem;font-size:0.95rem;opacity:0.9;">Updates pushed to your player - no site login needed. Ensure your player has "auto-update playlist" enabled.</p>
      <a href="/plans" class="cta-btn">View Plans →</a>
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
      container.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem;grid-column:1/-1">No channels available</p>';
    }
  } catch(e) {
    document.getElementById('channelList').innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem;grid-column:1/-1">Failed to load</p>';
  }
})();
</script>
`;
