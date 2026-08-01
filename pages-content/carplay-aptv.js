// APTV & CarPlay Guide Page
export const pageTitle = 'APTV & CarPlay Guide - Watch IPTV on iPhone, iPad & CarPlay';
export const pageDescription = 'Complete tutorial on using APTV for iOS TV streaming, CarPlay integration, TestFlight setup, and troubleshooting. Supports iOS 15+ with live preview and EPG.';

export const styles = `
*{margin:0;padding:0;box-sizing:border-box}
:root{--accent:#e50914;--bg:#0a0a0a;--bg-card:#141414;--border:1px solid rgba(255,255,255,0.08);--text:#fff;--text-secondary:rgba(255,255,255,0.6);--green:#22c55e;--yellow:#fbbf24;--blue:#3b82f6;--radius:0}
html{scroll-padding-top:70px}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);min-height:100vh;display:flex;flex-direction:column;color:var(--text)}
.main-content{flex:1;width:100%;margin-top:70px;padding:20px 0}
.container{max-width:900px;margin:0 auto;padding:0 20px}
.page-header{text-align:center;padding:3rem 0 2rem}
.page-header h1{font-size:2.2rem;font-weight:800;margin-bottom:1rem;color:var(--text)}
.page-header p{font-size:1.1rem;color:var(--text-secondary);max-width:600px;margin:0 auto}
.section{margin-bottom:3rem}
.section-title{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;padding-bottom:0.75rem;border-bottom:var(--border);display:flex;align-items:center;gap:0.75rem}
.section-title .badge{font-size:0.7rem;padding:4px 10px;background:var(--accent);color:#fff;border-radius:2px;font-weight:600}
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
.step-content code{background:var(--bg-card);padding:2px 8px;border-radius:2px;font-size:13px;color:var(--green)}
.code-block{background:transparent;border:var(--border);border-radius:var(--radius);padding:16px;margin:16px 0;font-family:monospace;font-size:13px;word-break:break-all;color:var(--green)}
.tip-box{background:transparent;border:1px solid var(--green);border-radius:var(--radius);padding:16px;margin:16px 0}
.tip-box h4{color:var(--green);font-size:14px;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.tip-box p{color:rgba(255,255,255,0.8);font-size:14px;line-height:1.6}
.warning-box{background:transparent;border:1px solid var(--yellow);border-radius:var(--radius);padding:16px;margin:16px 0}
.warning-box h4{color:var(--yellow);font-size:14px;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.warning-box p{color:rgba(255,255,255,0.8);font-size:14px;line-height:1.6}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin:20px 0}
.feature-card{background:var(--bg-card);border:var(--border);padding:20px;border-radius:var(--radius)}
.feature-card h3{font-size:1rem;font-weight:600;color:var(--text);margin-bottom:8px}
.feature-card p{font-size:0.9rem;color:var(--text-secondary);line-height:1.6}
.carplay-card{background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(229,9,20,0.1));border:1px solid var(--blue);padding:24px;border-radius:var(--radius);margin:20px 0}
.carplay-card h3{color:var(--blue);font-size:1.1rem;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.carplay-card ul{padding-left:20px}
.carplay-card li{margin-bottom:8px;color:rgba(255,255,255,0.8);font-size:0.95rem}
.app-badge{display:inline-flex;align-items:center;gap:8px;background:var(--bg-card);border:var(--border);padding:12px 20px;border-radius:var(--radius);margin:8px 0;font-size:0.9rem;color:var(--text)}
.app-badge svg{width:20px;height:20px;color:var(--accent)}
.tabs-nav{display:flex;gap:0;margin-bottom:24px;flex-wrap:wrap;border-bottom:var(--border)}
.tab-btn{background:transparent;color:var(--text-secondary);border:none;padding:12px 20px;cursor:pointer;font-size:14px;font-weight:500;transition:color 0.2s;white-space:nowrap}
.tab-btn:hover{color:var(--text)}
.tab-btn.active{color:var(--accent);border-bottom:2px solid var(--accent);padding-bottom:11px}
.tab-content{display:none}
.tab-content.active{display:block}
@media(max-width:768px){
  .page-header h1{font-size:1.75rem}
  .feature-grid{grid-template-columns:1fr}
  .step-item{padding:16px;padding-left:36px;margin-left:8px}
  .step-number{left:-6px;top:16px;width:28px;height:28px;font-size:13px}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.5rem"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M7 2h10"/><circle cx="12" cy="12" r="3"/></svg> APTV & CarPlay Guide</h1>
      <p>The complete guide to watching IPTV on iPhone, iPad, Apple TV, and CarPlay using APTV</p>
    </div>

    <div class="section">
      <div class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
        What is APTV?
        <span class="badge">App Store</span>
      </div>
      <div class="step-content">
        <p>APTV is a powerful IPTV player app for iOS that supports live TV streaming via M3U playlists. It offers real-time channel previews, EPG (Electronic Program Guide), iCloud sync, and full CarPlay support. Available on iPhone, iPad, Apple TV, Mac, and Apple Watch.</p>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>📺 Live TV</h3>
            <p>Play M3U/M3U8 playlists with real-time channel preview and EPG support</p>
          </div>
          <div class="feature-card">
            <h3>🚗 CarPlay</h3>
            <p>Full CarPlay integration for in-car entertainment (iOS 15+)</p>
          </div>
          <div class="feature-card">
            <h3>☁️ iCloud Sync</h3>
            <p>All subscriptions and favorites sync across your Apple devices</p>
          </div>
          <div class="feature-card">
            <h3>📺 Apple TV</h3>
            <p>Dedicated tvOS version with remote control support</p>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download & Install
      </div>
      <div class="step-list">
        <div class="step-item">
          <div class="step-number">1</div>
          <div class="step-header">
            <div class="step-title">Open App Store</div>
            <div class="step-desc">Search for APTV</div>
          </div>
          <div class="step-content">
            <p>Open the App Store on your iPhone, iPad, or Apple TV. Search for <strong>"APTV"</strong> and install the free app. You may also see it listed as <strong>"Apple TV"</strong> in some regions.</p>
            <div class="app-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Available on iOS 15.0+ | Apple TV tvOS 15.0+
            </div>
          </div>
        </div>

        <div class="step-item">
          <div class="step-number">2</div>
          <div class="step-header">
            <div class="step-title">Open APTV & Go to Settings</div>
            <div class="step-desc">Add your subscription</div>
          </div>
          <div class="step-content">
            <p>After installing, open APTV. The home screen will be empty initially — you need to add a subscription source first.</p>
            <div class="ui-mockup" style="margin:16px 0">
              <div style="background:var(--bg-card);border:var(--border);border-radius:8px;padding:20px;max-width:300px;margin:0 auto">
                <div style="text-align:center;color:var(--text-secondary);font-size:14px;padding:20px 0">No subscriptions yet</div>
                <div style="text-align:center"><button style="background:var(--accent);color:#fff;border:none;padding:12px 24px;border-radius:4px;font-size:14px;font-weight:600">+ Add Subscription</button></div>
              </div>
            </div>
            <p>Tap the <strong>Settings</strong> icon (gear) in the bottom navigation, then tap <strong>+</strong> in the top right corner.</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-header">
            <div class="step-title">Add M3U Playlist</div>
            <div class="step-desc">Enter your subscription URL</div>
          </div>
          <div class="step-content">
            <p>Select <strong>"Subscription Config"</strong> and enter the following:</p>
            <ul>
              <li><strong>Name:</strong> Any name you like (e.g., "My IPTV")</li>
              <li><strong>URL:</strong> Your subscription M3U URL from the user center</li>
              <li>Enable <strong>"Auto Refresh"</strong> to keep channels updated</li>
            </ul>
            <div class="warning-box">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Note
              </h4>
              <p>The free version of APTV supports only one subscription at a time. For multiple sources, consider the Pro version (one-time purchase).</p>
            </div>
          </div>
        </div>

        <div class="step-item">
          <div class="step-number">4</div>
          <div class="step-header">
            <div class="step-title">Activate & Enjoy</div>
            <div class="step-desc">Enable the subscription</div>
          </div>
          <div class="step-content">
            <p>After adding the subscription, return to the settings list and tap to enable it (you should see a green checkmark). Go back to the home screen and browse your channels!</p>
            <div class="tip-box">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Pro Tip
              </h4>
              <p>Long-press any channel to add it to favorites. You can also enable the preview feature to see a live thumbnail of each channel before selecting it.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M7 2h10"/></svg>
        APTV on CarPlay
      </div>
      <div class="carplay-card">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          CarPlay Support (iOS 15+)
        </h3>
        <p style="color:rgba(255,255,255,0.8);margin-bottom:16px;line-height:1.7">APTV supports CarPlay natively. Once connected, you can browse and watch channels directly from your car's display. This feature works with both wired and wireless CarPlay.</p>
        <ul>
          <li><strong>Connection:</strong> Connect your iPhone to CarPlay via USB or wireless (iOS 13+)</li>
          <li><strong>Open APTV:</strong> The app will appear in your CarPlay app grid</li>
          <li><strong>Browse Channels:</strong> Use the car's touchscreen or physical controls to navigate</li>
          <li><strong>Audio Output:</strong> Audio plays through your car speakers automatically</li>
        </ul>
      </div>
      <div class="warning-box">
        <h4>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Safety Notice
        </h4>
        <p>For safety reasons, video playback is disabled while the vehicle is in motion. You can only watch videos when the car is parked. Audio-only listening works at any time.</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        iOS 26.4 CarPlay Video Update
      </div>
      <div class="step-content">
        <p>In iOS 26.4 (released in 2025), Apple expanded CarPlay to support video playback. This means third-party apps like APTV can now fully leverage CarPlay for video content in supported vehicles.</p>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>🎬 Video on CarPlay</h3>
            <p>Watch videos on your car display when parked. Apple TV+, Disney+, and IPTV apps all supported.</p>
          </div>
          <div class="feature-card">
            <h3>🔊 Audio-only Mode</h3>
            <p>Live TV audio works while driving via your car speakers — perfect for news and radio.</p>
          </div>
          <div class="feature-card">
            <h3>📱 AirPlay Support</h3>
            <p>Stream from any AirPlay-compatible app to your CarPlay display when parked.</p>
          </div>
          <div class="feature-card">
            <h3>🚗 Vehicle Requirements</h3>
            <p>Requires CarPlay-compatible vehicle with video output enabled by the manufacturer.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Troubleshooting
      </div>
      <div class="step-list">
        <div class="step-item">
          <div class="step-header">
            <div class="step-title">Channel not loading?</div>
          </div>
          <div class="step-content">
            <ul>
              <li>Check your internet connection (minimum 5 Mbps for HD)</li>
              <li>Try switching between WiFi and cellular data</li>
              <li>Refresh the subscription in Settings → Subscription Config</li>
              <li>Some channels require specific headers (User-Agent, Referrer)</li>
            </ul>
          </div>
        </div>
        <div class="step-item">
          <div class="step-header">
            <div class="step-title">CarPlay not showing APTV?</div>
          </div>
          <div class="step-content">
            <ul>
              <li>Make sure your iPhone is connected to CarPlay first</li>
              <li>Check that APTV is allowed in CarPlay settings (Settings → General → CarPlay)</li>
              <li>Restart both your iPhone and the car's infotainment system</li>
              <li>Ensure you're on iOS 15 or later</li>
            </ul>
          </div>
        </div>
        <div class="step-item">
          <div class="step-header">
            <div class="step-title">Poor video quality?</div>
          </div>
          <div class="step-content">
            <ul>
              <li>Some streams are SD only — check your subscription plan</li>
              <li>Try enabling "Hardware Decode" in APTV settings</li>
              <li>Close other apps to free up memory</li>
              <li>Use a wired connection instead of WiFi for better stability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Get Your Subscription
      </div>
      <div class="step-content" style="text-align:center;padding:20px 0">
        <p style="margin-bottom:20px;color:var(--text-secondary)">Ready to watch? Get your personalized M3U subscription URL and start streaming in minutes.</p>
        <a href="/subscription" style="display:inline-block;background:var(--accent);color:#fff;padding:14px 32px;border-radius:4px;font-size:16px;font-weight:600;text-decoration:none">Get Subscription →</a>
      </div>
    </div>
  </div>
</div>
`;
