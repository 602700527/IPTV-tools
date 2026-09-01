// Tutorial Page - Minimal Line Style
export const pageTitle = 'How to Watch IPTV on Firestick, Smart TV, Android & iOS (2026 Setup Guide)';
export const pageDescription = 'Step-by-step guide: how to watch IPTV on Firestick, Apple TV, Android phones, Smart TVs. Install IPTV apps, add your M3U playlist URL, and stream 8,000+ live channels in minutes.';

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
.tabs-container{background:transparent;border:var(--border);border-radius:var(--radius);padding:20px;margin-bottom:30px}
.tabs-nav{display:flex;gap:0;margin-bottom:30px;flex-wrap:wrap;padding-bottom:15px;border-bottom:var(--border)}
.tab-btn{background:transparent;color:var(--text-secondary);border:none;padding:14px 24px;border-radius:var(--radius);cursor:pointer;font-size:15px;font-weight:500;transition:color 0.2s;white-space:nowrap}
.tab-btn:hover{color:var(--text)}
.tab-btn.active{color:var(--accent);border-bottom:2px solid var(--accent);padding-bottom:13px}
.tab-content{display:none}
.tab-content.active{display:block}
.tutorial-section{margin-bottom:40px}
.tutorial-section:last-child{margin-bottom:0}
.section-header{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:15px;border-bottom:var(--border)}
.section-icon{width:48px;height:48px;border:var(--border);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
.section-title h2{font-size:24px;font-weight:700;color:var(--text);margin-bottom:4px}
.section-title p{color:var(--text-secondary);font-size:14px}
.step-list{display:flex;flex-direction:column;gap:0}
.step-item{background:transparent;border:var(--border);padding:24px;padding-left:40px;position:relative;margin-left:12px}
.step-number{position:absolute;left:-8px;top:24px;background:var(--accent);color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700}
.step-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}
.step-title{font-size:18px;font-weight:600;color:var(--text);margin-bottom:4px}
.step-desc{color:var(--text-secondary);font-size:14px}
.step-content{line-height:1.8;color:rgba(255,255,255,0.8);font-size:15px}
.step-content h3{font-size:16px;font-weight:600;color:var(--text);margin:16px 0 8px 0}
.step-content p{margin-bottom:10px}
.step-content ul{padding-left:20px;margin-bottom:10px}
.step-content li{margin-bottom:6px}
.code-block{background:transparent;border:var(--border);border-radius:var(--radius);padding:16px;margin:16px 0;font-family:monospace;font-size:13px;word-break:break-all;color:var(--green)}
.tip-box{background:transparent;border:1px solid var(--green);border-radius:var(--radius);padding:16px;margin:16px 0}
.tip-box h4{color:var(--green);font-size:14px;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.tip-box p{color:rgba(255,255,255,0.8);font-size:14px;line-height:1.6}
.warning-box{background:transparent;border:1px solid var(--yellow);border-radius:var(--radius);padding:16px;margin:16px 0}
.warning-box h4{color:var(--yellow);font-size:14px;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.warning-box p{color:rgba(255,255,255,0.8);font-size:14px;line-height:1.6}
.ui-mockup{background:transparent;border:var(--border);border-radius:var(--radius);padding:24px;margin:16px 0;text-align:center}
.mockup-device{background:transparent;border:var(--border);border-radius:var(--radius);padding:30px;max-width:400px;margin:0 auto}
.mockup-header{display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:15px;border-bottom:var(--border)}
.mockup-nav{width:24px;height:24px;background:var(--accent);border-radius:var(--radius)}
.mockup-title{flex:1;height:8px;background:rgba(255,255,255,0.1);border-radius:var(--radius)}
.mockup-body{background:transparent;border:var(--border);border-radius:var(--radius);padding:20px}
.mockup-input{background:transparent;border:var(--border);border-radius:var(--radius);padding:12px;margin-bottom:12px;text-align:left;color:var(--text-secondary);font-size:13px}
.mockup-button{background:var(--accent);color:#fff;border:none;padding:14px 28px;border-radius:var(--radius);font-size:14px;font-weight:600;cursor:pointer}
.device-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:0;margin-bottom:30px}
.device-card{background:transparent;border:var(--border);border-radius:var(--radius);padding:24px}
.device-card:hover{border-color:var(--accent)}
.device-icon{font-size:40px;margin-bottom:12px}
.device-name{font-size:18px;font-weight:600;color:var(--text);margin-bottom:8px}
.device-desc{color:var(--text-secondary);font-size:14px;margin-bottom:12px}
.device-tag{display:inline-block;background:transparent;border:1px solid var(--accent);color:var(--accent);padding:4px 12px;border-radius:var(--radius);font-size:12px;font-weight:600}
@media(max-width:768px){
.html{scroll-padding-top:60px}
.main-content{margin-top:80px;padding:16px 0 0}
.container{padding:0 12px}
.tabs-container{padding:16px;border-radius:var(--radius);margin-bottom:20px}
.tabs-nav{margin-bottom:20px;padding-bottom:12px;gap:6px}
.tab-btn{padding:10px 14px;font-size:13px;border-radius:var(--radius)}
.tab-btn.active{padding:10px 14px}
.tutorial-section{margin-bottom:24px}
.section-header{flex-direction:row;align-items:flex-start;gap:10px;margin-bottom:16px;padding-bottom:12px}
.section-icon{width:40px;height:40px;font-size:20px;border-radius:var(--radius)}
.section-title h2{font-size:20px}
.section-title p{font-size:12px}
.step-list{gap:0}
.step-item{padding:16px;padding-left:44px;margin-left:8px;border-radius:var(--radius)}
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
.device-grid{grid-template-columns:1fr;gap:0;margin-bottom:20px}
.device-card{padding:20px;border-radius:var(--radius)}
.device-icon{font-size:36px;margin-bottom:10px}
.device-name{font-size:16px}
.device-desc{font-size:13px;margin-bottom:10px}
.device-tag{padding:3px 10px;font-size:11px}
}
@media(max-width:480px){
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
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.5rem"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg> How to Watch IPTV</h1>
      <p>Step-by-step setup guide for Apple TV, Android, Smart TV, and desktop players</p>
    </div>

    <div class="tabs-container">
      <div class="tabs-nav">
        <button class="tab-btn" onclick="switchTab('browser-extension', this)"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg> Browser Extension</button>
        <button class="tab-btn active" onclick="switchTab('ios', this)"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> iOS / Apple TV</button>
        <button class="tab-btn" onclick="switchTab('android', this)"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Android</button>
        <button class="tab-btn" onclick="switchTab('tv', this)"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg> Smart TV</button>
        <button class="tab-btn" onclick="switchTab('desktop', this)"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Desktop Player</button>
        <button class="tab-btn" onclick="switchTab('other', this)"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="13" r="1"/><circle cx="17" cy="15" r="1"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> Other Devices</button>
      </div>

      <div id="tab-browser-extension" class="tab-content">
        <div class="tutorial-section" style="margin-bottom:0;">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg></div>
            <div class="section-title">
              <h2>Chrome Extension — Required for Test Play</h2>
              <p>One-click stream capture on any channel page</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">Download the Extension</div>
                <div class="step-desc">Chrome / Brave / Edge (Chromium-based)</div>
              </div>
              <div class="step-content">
                <p><a href="/chrome-stream-plugin.zip" download style="color:var(--accent);font-weight:600;font-size:15px;">⬇ Download chrome-stream-plugin.zip</a></p>
                <p style="font-size:13px;color:var(--text-secondary);">After downloading, unzip it to a folder you can find later (e.g., <code>~/Downloads/chrome-stream-plugin</code>).</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">Open Chrome Extensions Page</div>
              </div>
              <div class="step-content">
                <p>Navigate to <code>chrome://extensions/</code> in your browser address bar.</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-header">
                <div class="step-title">Enable Developer Mode</div>
                <div class="step-desc">Top-right toggle</div>
              </div>
              <div class="step-content">
                <p>Turn on the <strong>Developer mode</strong> switch in the top-right corner of the extensions page.</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-header">
                <div class="step-title">Load Unpacked Extension</div>
              </div>
              <div class="step-content">
                <p>Click <strong>Load unpacked</strong>, then select the unzipped <code>chrome-stream-plugin</code> folder.</p>
                <div class="tip-box">
                  <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg> Tip</h4>
                  <p>Select the <strong>folder itself</strong>, not files inside it. Chrome reads <code>manifest.json</code> from the root.</p>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">5</div>
              <div class="step-header">
                <div class="step-title">Test It</div>
              </div>
              <div class="step-content">
                <p>Go back to any channel page (e.g., this site's channel pages) and click <strong>Test Play</strong>. The extension will auto-detect the stream URL and open an inline player in a new tab.</p>
                <div class="warning-box">
                  <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> Not Working?</h4>
                  <p>If the Test Play button still says "Plugin not installed", refresh the channel page once after installing.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="tip-box" style="margin-top:24px;border-color:var(--accent)">
            <h4 style="color:var(--accent)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Our Open-Source Tools
            </h4>
            <p style="margin-bottom:8px">We also built these free tools to enhance your IPTV experience. All are open-source on GitHub:</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">
              <a href="https://github.com/goplay-source/IPTV-tools" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:1px solid var(--accent);color:var(--accent);text-decoration:none;border-radius:0;font-size:13px;font-weight:600;transition:background 0.2s,color 0.2s" onmouseover="this.style.background='var(--accent)';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='var(--accent)'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                Chrome Stream Player
              </a>
              <a href="https://github.com/goplay-source/IPTV-tools" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:1px solid rgba(255,255,255,0.2);color:var(--text);text-decoration:none;border-radius:0;font-size:13px;font-weight:600;transition:background 0.2s" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='transparent'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Awesome IPTV Tools
              </a>
            </div>
          </div>
        </div>
      </div>

      <div id="tab-ios" class="tab-content active">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
            <div class="section-title">
              <h2>APTV (Apple TV)</h2>
              <p>The most popular Apple TV player</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">Download & Install APTV</div>
                <div class="step-desc">Search "APTV" or "Apple TV" in App Store</div>
              </div>
              <div class="step-content">
                <p>Open the App Store on your Apple TV, search for "APTV" and install it.</p>
                <div class="tip-box">
                  <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg> Tip</h4>
                  <p>You can also download it on iPhone and use AirPlay to Apple TV</p>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">Open Settings</div>
                <div class="step-desc">Add subscription source</div>
              </div>
              <div class="step-content">
                <p>Open APTV, go to Settings → Add Subscription Source</p>
                <p>Select "M3U Playlist"</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div class="mockup-nav"></div>
                      <div style="color:var(--text);font-size:14px;font-weight:600;flex:1;">APTV Settings</div>
                    </div>
                    <div class="mockup-body">
                      <div class="mockup-input">Add Subscription Source</div>
                      <div style="color:var(--text-secondary);font-size:13px;margin-bottom:8px;">✓ Add Playlist</div>
                      <div style="color:var(--text-secondary);font-size:13px;margin-bottom:8px;">● Add Stream Source</div>
                      <div style="color:var(--text-secondary);font-size:13px;margin-bottom:8px;">● Add EPG Source</div>
                      <div style="color:var(--text-secondary);font-size:13px;">● X-Treme Codes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-header">
                <div class="step-title">Enter Subscription Info</div>
                <div class="step-desc">Fill in name and subscription URL</div>
              </div>
              <div class="step-content">
                <p>Fill in the following information:</p>
                <ul>
                  <li><strong>Name:</strong> Enter any name you like (e.g., IPTV Live)</li>
                  <li><strong>URL:</strong> <a href="/plans" target="_blank" style="color:var(--accent);text-decoration:none;">Click here to get your subscription URL</a></li>
                </ul>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div class="mockup-nav"></div>
                      <div style="color:var(--text);font-size:14px;font-weight:600;flex:1;">Add Playlist</div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:var(--text);font-size:14px;margin-bottom:12px;">Name</div>
                      <div class="mockup-input">IPTV Live</div>
                      <div style="color:var(--text);font-size:14px;margin-bottom:12px;">URL</div>
                      <div class="mockup-input">https://iptv-search.com...</div>
                      <button class="mockup-button">Add</button>
                    </div>
                  </div>
                </div>
                <div class="tip-box">
                  <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg> Get Subscription URL</h4>
                  <p>After logging in, get your subscription URL from the user center or activation page</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg></div>
            <div class="section-title">
              <h2>iPlayTV</h2>
              <p>Player supporting multiple formats</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">Download & Install</div>
                <div class="step-desc">Search and install in App Store</div>
              </div>
              <div class="step-content">
                <p>Search for "iPlayTV" in the App Store on your iPhone or Apple TV</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">Add Subscription Source</div>
              </div>
              <div class="step-content">
                <p>Open the app → Tap "+" → Select "M3U"</p>
                <p>Paste your subscription URL and add it</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="tab-android" class="tab-content">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
            <div class="section-title">
              <h2>Televizo</h2>
              <p>Powerful Android IPTV player</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">Download & Install Televizo</div>
                <div class="step-desc">Search in Google Play Store</div>
              </div>
              <div class="step-content">
                <p>Search for "Televizo" in Google Play on your Android phone or tablet and install it</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">Open Menu</div>
              </div>
              <div class="step-content">
                <p>Open Televizo and tap the menu icon in the top left corner</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:var(--text);font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                        <span style="color:var(--text-secondary);font-size:20px;">☰</span>
                        <span>Televizo</span>
                      </div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:var(--text-secondary);font-size:14px;">Playlist</div>
                      <div style="color:var(--text-secondary);font-size:13px;margin-top:10px;">● Favorites</div>
                      <div style="color:var(--text-secondary);font-size:13px;">● Search</div>
                      <div style="color:var(--text-secondary);font-size:13px;">● Settings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-header">
                <div class="step-title">Add Playlist</div>
              </div>
              <div class="step-content">
                <p>Select "Playlist" → Tap the "+" button</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:var(--text);font-size:14px;font-weight:600;">Add Playlist</div>
                    </div>
                    <div class="mockup-body">
                      <div class="mockup-input">Playlist Name</div>
                      <div class="mockup-input">M3U URL</div>
                      <button class="mockup-button">Add</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg></div>
            <div class="section-title">
              <h2>IPTV Smarters Pro</h2>
              <p>Feature-rich player</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">Download & Install</div>
              </div>
              <div class="step-content">
                <p>Download IPTV Smarters Pro from Google Play</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">Add Playlist</div>
              </div>
              <div class="step-content">
                <p>Select "Add Playlist" → Enter name and M3U URL</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:var(--text);font-size:14px;font-weight:600;">IPTV Smarters Pro</div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:var(--text-secondary);font-size:14px;margin-bottom:20px;">Add Playlist</div>
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

      <div id="tab-tv" class="tab-content">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg></div>
            <div class="section-title">
              <h2>TiviMate Premium</h2>
              <p>Recommended Android TV player</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">Download from Google Play</div>
              </div>
              <div class="step-content">
                <p>Search for TiviMate Premium in Google Play on your Android TV and install it</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">Add Playlist</div>
              </div>
              <div class="step-content">
                <p>Select "Add Playlist" → Choose "M3U Playlist" → Enter URL</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:var(--text);font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:space-between;">
                        <span>TiviMate Premium</span>
                        <span style="font-size:20px;">+</span>
                      </div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:var(--text-secondary);font-size:14px;margin-bottom:20px;">Add Playlist</div>
                      <div class="mockup-input">Playlist Name</div>
                      <div class="mockup-input">M3U URL</div>
                      <button class="mockup-button">Add</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div>
            <div class="section-title">
              <h2>Kodi</h2>
              <p>Open-source media center</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">Install PVR IPTV Simple Client</div>
              </div>
              <div class="step-content">
                <p>Search for and install PVR IPTV Simple Client in Kodi's add-on repository</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">Configure Add-on</div>
              </div>
              <div class="step-content">
                <p>Open add-on settings → Check "M3U Play List" → Enter M3U URL</p>
                <div class="ui-mockup">
                  <div class="mockup-device">
                    <div class="mockup-header">
                      <div style="color:var(--text);font-size:14px;font-weight:600;">Kodi Settings</div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:var(--text-secondary);font-size:13px;margin-bottom:10px;">☑ Enable M3U Play List</div>
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

      <div id="tab-desktop" class="tab-content">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
            <div class="section-title">
              <h2>VLC Media Player</h2>
              <p>Cross-platform media player</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">Open Network Stream</div>
              </div>
              <div class="step-content">
                <p>VLC → Media → Open Network Stream</p>
                <div class="ui-mockup">
                  <div class="mockup-device" style="max-width:500px;">
                    <div class="mockup-header">
                      <div style="color:var(--text);font-size:14px;font-weight:600;">VLC Media Player</div>
                    </div>
                    <div class="mockup-body">
                      <div style="color:var(--text-secondary);font-size:14px;margin-bottom:15px;">Enter network URL</div>
                      <div class="mockup-input">https://iptv-search.com/sub/xxx.m3u</div>
                      <button class="mockup-button">Play</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="tab-other" class="tab-content">
        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="13" r="1"/><circle cx="17" cy="15" r="1"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg></div>
            <div class="section-title">
              <h2>More Players &amp; Firestick</h2>
              <p>Support for Firestick and other M3U playlist URL devices</p>
            </div>
          </div>

          <div class="device-grid">
            <div class="device-card">
              <div class="device-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg></div>
              <div class="device-name">Amazon Firestick</div>
              <div class="device-desc">Best IPTV app for Firestick — sideload via Downloader</div>
              <span class="device-tag">Top Pick</span>
            </div>
            <div class="device-card">
              <div class="device-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
              <div class="device-name">IPTVX</div>
              <div class="device-desc">Premium Android player</div>
              <span class="device-tag">Recommended</span>
            </div>

            <div class="device-card">
              <div class="device-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
              <div class="device-name">GSE IPTV</div>
              <div class="device-desc">Lightweight Android player</div>
              <span class="device-tag">Free</span>
            </div>

            <div class="device-card">
              <div class="device-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
              <div class="device-name">OTT Navigator</div>
              <div class="device-desc">Feature-rich player</div>
              <span class="device-tag">Free</span>
            </div>

            <div class="device-card">
              <div class="device-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg></div>
              <div class="device-name">XCIPTV</div>
              <div class="device-desc">Modern interface design</div>
            </div>
          </div>
        </div>

        <div class="tutorial-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></div>
            <div class="section-title">
              <h2>General Setup Steps</h2>
              <p>Works for most players</p>
            </div>
          </div>

          <div class="step-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-header">
                <div class="step-title">Get Subscription URL</div>
                <div class="step-desc">Get it from user center or activation page</div>
              </div>
              <div class="step-content">
                <p>After logging in, copy the subscription URL from the user center or payment success page</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-header">
                <div class="step-title">Add Playlist</div>
                <div class="step-desc">Select M3U Playlist option</div>
              </div>
              <div class="step-content">
                <p>Find "Add Playlist" or "Add Subscription" option in your player settings</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-header">
                <div class="step-title">Enter Subscription URL</div>
                <div class="step-desc">Paste URL and save</div>
              </div>
              <div class="step-content">
                <p>Paste the copied subscription URL, save, and wait for the channel list to load</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
function switchTab(tabName, btn) {
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(b => b.classList.remove('active'));

  const panel = document.getElementById('tab-' + tabName);
  if (panel) panel.classList.add('active');
  // 显式传按钮就直接用；点击触发时 fallback 从 event 取
  const target = btn || (window.event && window.event.target && window.event.target.closest('.tab-btn'));
  if (target) target.classList.add('active');
}

// URL hash 自动跳到对应 tab（如 /tutorial#browser-extension）
(function() {
  if (!location.hash) return;
  var name = location.hash.replace(/^#/, '');
  if (!name) return;
  function trySwitch() {
    var panel = document.getElementById('tab-' + name);
    if (!panel) return;
    panel.classList.add('active');
    // 遍历 tab 按钮，用 indexOf 匹配 onclick 里的 tab 名（避开外层 template literal 的转义陷阱）
    document.querySelectorAll('.tab-btn').forEach(function(b) {
      var oc = b.getAttribute('onclick') || '';
      if (oc.indexOf("'" + name + "'") !== -1) b.classList.add('active');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trySwitch);
  } else {
    trySwitch();
  }
})();
</script>`;
