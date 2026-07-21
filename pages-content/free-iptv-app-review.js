// Free IPTV App Review Landing Page
// Note: Year is hardcoded to avoid Cloudflare Workers edge runtime Date issues
export const pageTitle = 'Best Free IPTV Apps 2026 - Top Free IPTV Players Reviewed';
export const pageDescription = 'Comprehensive review of free IPTV apps in 2026. Featuring Kodi, VLC, GSE IPTV and more. Feature comparison, pros & cons analysis, and download links. Watch live TV for free!';

export const styles = `
*{margin:0;padding:0;box-sizing:border-box}
:root{
--accent:#e50914;
--bg:#0a0a0a;
--bg-card:#141414;
--border:1px solid rgba(255,255,255,0.08);
--text:#fff;
--text-secondary:rgba(255,255,255,0.6);
--green:#22c55e;
--yellow:#fbbf24;
--red:#ef4444;
--radius:0
}
html{scroll-padding-top:70px}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);min-height:100vh;display:flex;flex-direction:column;color:var(--text)}
.main-content{flex:1;width:100%;margin-top:70px;padding:20px 0}
.container{max-width:1400px;margin:0 auto;padding:0 20px}
.page-header{text-align:center;padding:3rem 0 2rem}
.page-header h1{font-size:2.5rem;font-weight:800;margin-bottom:1rem;color:var(--text)}
.page-header p{font-size:1.1rem;color:var(--text-secondary);max-width:600px;margin:0 auto}
.section{margin-bottom:3rem}
.section-title{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;padding-bottom:0.75rem;border-bottom:var(--border)}
.app-list{max-width:800px;margin:0 auto}
.app-item{background:transparent;border:var(--border);border-radius:var(--radius);padding:2rem;margin-bottom:0;transition:border-color 0.2s}
.app-item:hover{border-color:var(--accent)}
.app-header{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.app-icon{font-size:2.5rem}
.app-name{font-size:1.25rem;font-weight:700}
.app-badge{display:inline-block;background:var(--green);color:#000;font-size:0.75rem;padding:2px 8px;border-radius:0;font-weight:600;margin-left:0.5rem}
.app-desc{color:var(--text-secondary);margin-bottom:1rem;line-height:1.7}
.app-meta{display:flex;gap:1.5rem;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:1rem}
.app-meta span{display:flex;align-items:center;gap:0.25rem}
.feature-tags{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem}
.tag{padding:4px 12px;background:transparent;border:1px solid var(--border);border-radius:0;font-size:0.8rem;color:var(--text-secondary)}
.tag.highlight{border-color:var(--accent);color:var(--accent)}
.rating-row{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.rating{font-size:1.5rem;font-weight:700;color:var(--yellow)}
.stars{color:var(--yellow)}
.rating-text{font-size:0.85rem;color:rgba(255,255,255,0.5)}
.download-link{display:inline-block;background:var(--accent);color:#fff;padding:10px 24px;border-radius:var(--radius);font-weight:600;text-decoration:none;transition:background 0.2s}
.download-link:hover{background:#f7262c}
.compare-section{overflow-x:auto}
.compare-table{width:100%;border-collapse:collapse;background:transparent;border:var(--border);border-radius:0;min-width:600px}
.compare-table th,.compare-table td{padding:1rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.05)}
.compare-table th{background:rgba(255,255,255,0.03);font-weight:600;position:sticky;top:0}
.compare-table tr:last-child td{border-bottom:none}
.compare-yes{color:var(--green)}
.compare-no{color:var(--red)}
.compare-maybe{color:var(--yellow)}
.tip-box{background:transparent;border:1px solid var(--green);border-radius:var(--radius);padding:1.5rem;margin-top:1.5rem}
.tip-box h4{color:var(--green);margin-bottom:0.5rem}
.tip-box p{color:rgba(255,255,255,0.8);font-size:0.95rem}
.warning-box{background:transparent;border:1px solid var(--yellow);border-radius:var(--radius);padding:1.5rem;margin-top:1rem}
.warning-box h4{color:var(--yellow);margin-bottom:0.5rem}
.warning-box p{color:rgba(255,255,255,0.8);font-size:0.95rem}
.cta-section{text-align:center;padding:2rem 0}
.cta-section h2{font-size:1.5rem;margin-bottom:1rem;color:var(--text)}
.cta-section p{color:var(--text-secondary);margin-bottom:1.5rem}
.cta-section .cta-btn{display:inline-block;background:var(--accent);color:#fff;padding:14px 32px;border-radius:var(--radius);font-weight:600;text-decoration:none}
@media(max-width:768px){
.main-content{margin-top:80px}
.container{padding:0 16px}
.page-header{padding:2rem 0 1.5rem}
.page-header h1{font-size:1.75rem}
.app-meta{flex-direction:column;gap:0.5rem}
.compare-table{font-size:0.85rem}
.compare-table th,.compare-table td{padding:0.75rem}
}
@media(max-width:480px){
.main-content{margin-top:70px;padding:16px 0}
.container{padding:0 12px}
.page-header{padding:1.5rem 0 1rem}
.page-header h1{font-size:1.4rem}
.page-header p{font-size:0.95rem}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.5rem"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> Best Free IPTV Apps</h1>
      <p>Top free IPTV players reviewed - feature comparison, pros & cons</p>
    </div>

    <div class="section">
      <h2 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Our Top Picks</h2>
      <div class="app-list">
        <div class="app-item">
          <div class="app-header">
            <span class="app-icon"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg></span>
            <div>
              <div class="app-name">VLC Media Player<span class="app-badge">Top Pick</span></div>
            </div>
          </div>
          <p class="app-desc">The most popular open-source media player supporting virtually all video formats including IPTV M3U playlists. Completely free with no ads.</p>
          <div class="app-meta">
            <span>⭐ 4.7</span>
            <span>📱 Android/iOS/PC/Mac</span>
            <span>💾 Free & Open Source</span>
          </div>
          <div class="feature-tags">
            <span class="tag highlight">M3U Support</span>
            <span class="tag">Cross-platform</span>
            <span class="tag">No Ads</span>
            <span class="tag">Open Source</span>
          </div>
          <a href="https://www.videolan.org/vlc/" class="download-link" target="_blank">Free Download</a>
        </div>

        <div class="app-item">
          <div class="app-header">
            <span class="app-icon"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></span>
            <div>
              <div class="app-name">Kodi<span class="app-badge">Most Powerful</span></div>
            </div>
          </div>
          <p class="app-desc">Open-source media center with extremely powerful features. Perfect IPTV support via PVR IPTV Simple Client addon.</p>
          <div class="app-meta">
            <span>⭐ 4.5</span>
            <span>📱 All Platforms</span>
            <span>💾 Free & Open Source</span>
          </div>
          <div class="feature-tags">
            <span class="tag highlight">PVR Plugin</span>
            <span class="tag">EPG Support</span>
            <span class="tag">Recording</span>
            <span class="tag">Skins & Themes</span>
          </div>
          <a href="https://kodi.tv/download" class="download-link" target="_blank">Free Download</a>
        </div>

        <div class="app-item">
          <div class="app-header">
            <span class="app-icon"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
            <div>
              <div class="app-name">GSE IPTV<span class="app-badge">Lightweight</span></div>
            </div>
          </div>
          <p class="app-desc">Lightweight IPTV player designed specifically for IPTV with a clean interface, supporting local and remote M3U playlists, completely ad-free.</p>
          <div class="app-meta">
            <span>⭐ 4.3</span>
            <span>📱 Android</span>
            <span>💾 Always Free</span>
          </div>
          <div class="feature-tags">
            <span class="tag highlight">Lightweight</span>
            <span class="tag">No Ads</span>
            <span class="tag">Easy to Use</span>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.gseta.iptv" class="download-link" target="_blank">Google Play</a>
        </div>

        <div class="app-item">
          <div class="app-header">
            <span class="app-icon"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></span>
            <div>
              <div class="app-name">IPTV Smarters<span class="app-badge">Classic</span></div>
            </div>
          </div>
          <p class="app-desc">A classic IPTV player with multi-subscription management, remote playlist support and recording. Free version has ads.</p>
          <div class="app-meta">
            <span>⭐ 4.2</span>
            <span>📱 Android/iOS</span>
            <span>💾 Free with Ads</span>
          </div>
          <div class="feature-tags">
            <span class="tag highlight">Multi-subscription</span>
            <span class="tag">Recording</span>
            <span class="tag">Large User Base</span>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.ipptv.ipv6" class="download-link" target="_blank">Google Play</a>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Feature Comparison</h2>
      <div class="compare-section">
        <table class="compare-table">
          <thead>
            <tr><th>App</th><th>Free</th><th>No Ads</th><th>EPG</th><th>M3U</th><th>Recording</th><th>Multi-device</th></tr>
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
      <h2 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg> Tips</h2>
      <div class="tip-box">
        <h4><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> How to Watch IPTV with VLC</h4>
        <p>1. Copy subscription URL → 2. Open VLC → 3. Click "Media" → "Open Network Stream" → 4. Paste subscription URL → 5. Play</p>
      </div>
      <div class="warning-box">
        <h4><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg> Note</h4>
        <p>Free apps may have stability issues. Consider upgrading to a paid subscription for better HD streaming experience.</p>
      </div>
    </div>

    <div class="section cta-section">
      <h2>Want Better Viewing Experience?</h2>
      <p>Upgrade to paid subscription for ad-free, HD quality and stable streaming</p>
      <a href="/plans" class="cta-btn">View Plans →</a>
    </div>
  </div>
</div>
`;
