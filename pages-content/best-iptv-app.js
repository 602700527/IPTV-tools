// Best IPTV App Landing Page
// Note: Year is hardcoded to avoid Cloudflare Workers edge runtime Date issues
export const pageTitle = 'Best IPTV Apps & M3U8 Players 2026 - Top IPTV Players for Streaming';
export const pageDescription = 'Discover the best IPTV apps and M3U8 players in 2026. Compare top-rated IPTV Smarters, Perfect Player, GSE IPTV and more. Compatible with Smart TV, Android, iOS devices.';

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
.app-card{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:2rem}
.app-card h3{font-size:1.25rem;font-weight:600;margin-bottom:0.75rem;color:#e50914}
.app-card p{color:rgba(255,255,255,0.7);font-size:0.95rem;line-height:1.6;margin-bottom:1rem}
.app-features{list-style:none;padding:0}
.app-features li{padding:0.5rem 0;color:rgba(255,255,255,0.8);font-size:0.9rem}
.app-features li:before{content:"✓ ";color:#22c55e;margin-right:0.5rem}
.rating{color:#fbbf24;font-size:1.1rem;margin-bottom:0.5rem}
.cta-section{background:linear-gradient(135deg,#e50914 0%,#b81d24 100%);border-radius:16px;padding:3rem;text-align:center;margin:2rem 0}
.cta-section h2{font-size:1.75rem;font-weight:700;margin-bottom:1rem}
.cta-section p{font-size:1.1rem;opacity:0.9;margin-bottom:1.5rem}
.cta-btn{display:inline-block;background:#fff;color:#e50914;padding:14px 32px;border-radius:8px;font-weight:600;text-decoration:none;transition:transform 0.2s}
.cta-btn:hover{transform:scale(1.05)}
.faq-list{max-width:800px;margin:0 auto}
.faq-item{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem;margin-bottom:1rem}
.faq-item h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem;color:#fff}
.faq-item p{color:rgba(255,255,255,0.7);line-height:1.7}
@media(max-width:768px){
.main-content{margin-top:80px}
.container{padding:0 16px}
.page-header{padding:2rem 0 1.5rem}
.page-header h1{font-size:1.75rem}
.app-grid{grid-template-columns:1fr}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>🏆 Best IPTV Apps 2024</h1>
      <p>Top-rated IPTV players for Smart TV, Android, iOS, and more. Find the perfect streaming app for your needs.</p>
    </div>

    <div class="section">
      <h2 class="section-title">Top Rated IPTV Apps</h2>
      <div class="app-grid">
        <div class="app-card">
          <h3>IPTV Smarters Pro</h3>
          <div class="rating">⭐⭐⭐⭐⭐ 4.8/5</div>
          <p>The most popular IPTV player with intuitive interface and multi-screen support.</p>
          <ul class="app-features">
            <li>EPG guide support</li>
            <li>Multi-screen viewing</li>
            <li>VOD support</li>
            <li>Catch-up TV</li>
          </ul>
        </div>
        <div class="app-card">
          <h3>Perfect Player</h3>
          <div class="rating">⭐⭐⭐⭐ 4.5/5</div>
          <p>Lightweight and fast IPTV player perfect for older devices.</p>
          <ul class="app-features">
            <li>Simple interface</li>
            <li>Low resource usage</li>
            <li>Playlist management</li>
            <li>Channel groups</li>
          </ul>
        </div>
        <div class="app-card">
          <h3>GSE Smart IPTV</h3>
          <div class="rating">⭐⭐⭐⭐ 4.6/5</div>
          <p>Feature-rich player with advanced playlist handling and recording.</p>
          <ul class="app-features">
            <li>Multiple playlists</li>
            <li>Cloud storage sync</li>
            <li>Background playback</li>
            <li>AirPlay support</li>
          </ul>
        </div>
        <div class="app-card">
          <h3>XCIPTV Player</h3>
          <div class="rating">⭐⭐⭐⭐ 4.4/5</div>
          <p>Modern UI with built-in EPG and catch-up functionality.</p>
          <ul class="app-features">
            <li>Modern interface</li>
            <li>Auto updates</li>
            <li>Matrix support</li>
            <li>Parental controls</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list">
        <div class="faq-item">
          <h3>What is the best free IPTV app?</h3>
          <p>IPTV Smarters offers a free version with most features. For completely free options, check out Perfect Player's basic version or use our free subscription service.</p>
        </div>
        <div class="faq-item">
          <h3>Which IPTV app works best with our service?</h3>
          <p>IPTV Smarters Pro, GSE Smart IPTV, and XCIPTV are all fully compatible with our M3U playlists and EPG data.</p>
        </div>
        <div class="faq-item">
          <h3>Can I use these apps on Smart TV?</h3>
          <p>Yes! IPTV Smarters and Perfect Player have Smart TV versions for Samsung, LG, and other major brands.</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Ready to Start Streaming?</h2>
      <p>Get our M3U playlist and start watching on any IPTV app</p>
      <a href="/plans" class="cta-btn">View Subscription Plans</a>
    </div>
  </div>
</div>
`;
