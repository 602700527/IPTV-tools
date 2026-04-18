// Android IPTV App Landing Page
export const pageTitle = 'Best IPTV Apps for Android & Smart TV 2024 - Top IPTV Players';
export const pageDescription = 'Discover the best IPTV apps for Android phones, tablets, and Smart TV in 2024. Featuring IPTV Smarters Pro, TiviMate, Televizo and more. Works on Samsung, LG, Sony Smart TVs.';

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
      <h1><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.5rem"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Best Android IPTV Apps</h1>
      <p>Top IPTV players for Android in 2024 - Televizo, IPTV Smarters Pro, TiviMate and more</p>
    </div>

    <div class="section">
      <h2 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Top Picks</h2>
      <div class="app-grid">
        <div class="app-card">
          <div class="app-header">
            <span class="app-icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg></span>
            <div class="app-info">
              <h3>Televizo</h3>
              <span class="rating">⭐ 4.8/5</span>
            </div>
          </div>
          <p class="app-desc">One of the most popular IPTV players on Android with beautiful UI and rich features, including EPG support.</p>
          <ul class="app-features">
            <li>M3U/XSPF playlist support</li>
            <li>EPG Electronic Program Guide</li>
            <li>External subtitle support</li>
            <li>Picture-in-picture mode</li>
          </ul>
          <div class="pros-cons">
            <div class="pros"><h4>Pros</h4><ul style="list-style:none;padding:0"><li>Beautiful interface</li><li>Smooth playback</li><li>Accurate EPG</li></ul></div>
            <div class="cons"><h4>Cons</h4><ul style="list-style:none;padding:0"><li>Paid app</li><li>No free version</li></ul></div>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.levist7.televizo" class="download-btn" target="_blank">Google Play Download</a>
        </div>

        <div class="app-card">
          <div class="app-header">
            <span class="app-icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></span>
            <div class="app-info">
              <h3>IPTV Smarters Pro</h3>
              <span class="rating">⭐ 4.6/5</span>
            </div>
          </div>
          <p class="app-desc">One of the most downloaded IPTV apps globally with excellent compatibility and multi-subscription support.</p>
          <ul class="app-features">
            <li>Multiple subscription management</li>
            <li>Remote playlist support</li>
            <li>Recording functionality</li>
            <li>Multi-language support</li>
          </ul>
          <div class="pros-cons">
            <div class="pros"><h4>Pros</h4><ul style="list-style:none;padding:0"><li>Free to use</li><li>Full featured</li><li>Large user base</li></ul></div>
            <div class="cons"><h4>Cons</h4><ul style="list-style:none;padding:0"><li>Some ads</li><li>Older interface</li></ul></div>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.nst.iptvsmarterspro" class="download-btn" target="_blank">Google Play Download</a>
        </div>

        <div class="app-card">
          <div class="app-header">
            <span class="app-icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg></span>
            <div class="app-info">
              <h3>TiviMate Premium</h3>
              <span class="rating">⭐ 4.7/5</span>
            </div>
          </div>
          <p class="app-desc">Designed for Android TV with an optimized interface for big screens, channel grouping and favorites.</p>
          <ul class="app-features">
            <li>Big screen optimized UI</li>
            <li>Channel grouping</li>
            <li>Favorites management</li>
            <li>Auto-start on boot</li>
          </ul>
          <div class="pros-cons">
            <div class="pros"><h4>Pros</h4><ul style="list-style:none;padding:0"><li>TV optimized</li><li>Stable playback</li><li>Remote friendly</li></ul></div>
            <div class="cons"><h4>Cons</h4><ul style="list-style:none;padding:0"><li>TV only</li><li>Paid app</li></ul></div>
          </div>
          <a href="https://play.google.com/store/apps/details?id=ar.tvplayer.tvplayer" class="download-btn" target="_blank">Google Play Download</a>
        </div>

        <div class="app-card">
          <div class="app-header">
            <span class="app-icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>
            <div class="app-info">
              <h3>GSE IPTV</h3>
              <span class="rating">⭐ 4.5/5</span>
            </div>
          </div>
          <p class="app-desc">Open-source, free IPTV player with local/remote M3U support and a clean, simple interface.</p>
          <ul class="app-features">
            <li>Completely free</li>
            <li>Open source, no ads</li>
            <li>Local/remote lists</li>
            <li>Background playback</li>
          </ul>
          <div class="pros-cons">
            <div class="pros"><h4>Pros</h4><ul style="list-style:none;padding:0"><li>100% free</li><li>No ads</li><li>Lightweight</li></ul></div>
            <div class="cons"><h4>Cons</h4><ul style="list-style:none;padding:0"><li>Simple UI</li><li>Weak EPG support</li></ul></div>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.gseta.iptv" class="download-btn" target="_blank">Google Play Download</a>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> App Comparison</h2>
      <table class="comparison-table">
        <thead>
          <tr><th>App</th><th>Price</th><th>EPG</th><th>Recording</th><th>Rating</th></tr>
        </thead>
        <tbody>
          <tr><td>Televizo</td><td>Paid</td><td>✓</td><td>✓</td><td>⭐⭐⭐⭐⭐</td></tr>
          <tr><td>IPTV Smarters Pro</td><td>Free</td><td>✓</td><td>✓</td><td>⭐⭐⭐⭐</td></tr>
          <tr><td>TiviMate</td><td>Paid</td><td>✓</td><td>✗</td><td>⭐⭐⭐⭐⭐</td></tr>
          <tr><td>GSE IPTV</td><td>Free</td><td>✗</td><td>✗</td><td>⭐⭐⭐</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> FAQ</h2>
      <div style="background:#141414;border-radius:12px;padding:1.5rem;margin-bottom:1rem">
        <h3 style="margin-bottom:0.5rem">Are these apps safe?</h3>
        <p style="color:rgba(255,255,255,0.7)">All recommended apps are from Google Play official store and have been verified for safety.</p>
      </div>
      <div style="background:#141414;border-radius:12px;padding:1.5rem;margin-bottom:1rem">
        <h3 style="margin-bottom:0.5rem">Do I need a subscription to use these apps?</h3>
        <p style="color:rgba(255,255,255,0.7)">The apps themselves are free, but you need our IPTV subscription to watch live channels.</p>
      </div>
      <div style="background:#141414;border-radius:12px;padding:1.5rem">
        <h3 style="margin-bottom:0.5rem">Can I use them on phone and TV?</h3>
        <p style="color:rgba(255,255,255,0.7)">Yes, these apps support Android phones, tablets, and Android TV devices.</p>
      </div>
    </div>
  </div>
</div>
`;
