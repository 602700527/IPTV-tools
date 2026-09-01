// Tools Page - Landing page for open-source IPTV tools
export const pageTitle = 'IPTV Tools & Extensions — Free Open Source';
export const pageDescription = 'Download our free IPTV tools: Chrome Stream Player extension for one-click M3U8 capture, and Awesome IPTV Tools collection. All open source on GitHub.';

export const styles = `
*{margin:0;padding:0;box-sizing:border-box}
:root{
--accent:#e50914;
--bg:#0a0a0a;
--bg-card:#141414;
--border:1px solid rgba(255,255,255,0.08);
--text:#fff;
--text-secondary:rgba(255,255,255,0.6);
--text-muted:rgba(255,255,255,0.35);
--radius:0
}
html{scroll-padding-top:70px}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);min-height:100vh;display:flex;flex-direction:column;color:var(--text)}
.main-content{flex:1;width:100%;margin-top:70px;padding:20px 0}
.container{max-width:960px;margin:0 auto;padding:0 20px}
.page-header{text-align:center;padding:3rem 0 2rem}
.page-header h1{font-size:2.25rem;font-weight:800;margin-bottom:0.75rem;letter-spacing:-0.02em}
.page-header p{font-size:1rem;color:var(--text-secondary);max-width:520px;margin:0 auto 2rem}
.tools-grid{display:flex;flex-direction:column;gap:0}
.tool-card{background:transparent;border:var(--border);padding:2rem;border-radius:var(--radius)}
.tool-card+.tool-card{border-top:none}
.tool-card:first-child{border-top:var(--border)}
.tool-top{display:flex;align-items:flex-start;gap:1rem;margin-bottom:1rem}
.tool-icon{width:48px;height:48px;border:var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--accent)}
.tool-icon svg{width:24px;height:24px}
.tool-title-area{flex:1}
.tool-title{font-size:1.15rem;font-weight:700;color:var(--text);margin-bottom:0.25rem;display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap}
.tool-badge{display:inline-block;font-family:monospace;font-size:0.65rem;color:var(--text-muted);border:1px solid var(--border);padding:0.1rem 0.4rem;border-radius:var(--radius)}
.tool-desc{color:var(--text-secondary);font-size:0.85rem;line-height:1.7;margin-bottom:1.25rem}
.tool-features{list-style:none;margin-bottom:1.5rem}
.tool-features li{color:var(--text-secondary);font-size:0.8rem;padding:0.3rem 0;padding-left:1.25rem;position:relative}
.tool-features li::before{content:"▸";position:absolute;left:0;color:var(--accent)}
.tool-actions{display:flex;gap:0.75rem;flex-wrap:wrap}
.tool-btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.25rem;font-size:0.8rem;font-weight:600;border-radius:var(--radius);text-decoration:none;transition:all 0.2s;cursor:pointer;border:none}
.tool-btn-primary{background:var(--accent);color:#fff}
.tool-btn-primary:hover{background:#ff1a1a;transform:translateY(-1px)}
.tool-btn-secondary{background:transparent;color:var(--text);border:var(--border)}
.tool-btn-secondary:hover{border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.04)}
.tool-meta{margin-top:1.5rem;padding-top:1rem;border-top:var(--border);display:flex;gap:1.5rem;flex-wrap:wrap}
.tool-meta-item{font-family:monospace;font-size:0.7rem;color:var(--text-muted)}
.tool-meta-item span{color:var(--text-secondary)}
.cta-banner{margin-top:3rem;padding:2rem;border:var(--border);text-align:center}
.cta-banner h2{font-size:1.25rem;font-weight:700;margin-bottom:0.5rem}
.cta-banner p{color:var(--text-secondary);font-size:0.85rem;margin-bottom:1.25rem}
@media(max-width:640px){
  .container{padding:0 12px}
  .main-content{margin-top:80px;padding:16px 0 0}
  .page-header{padding:2rem 0 1.5rem}
  .page-header h1{font-size:1.6rem}
  .tool-card{padding:1.5rem}
  .tool-top{gap:0.75rem}
  .tool-icon{width:40px;height:40px}
  .tool-actions{flex-direction:column}
  .tool-btn{justify-content:center}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>IPTV Tools &amp; Extensions</h1>
      <p>Free, open-source tools built to enhance your IPTV experience. All source code available on GitHub.</p>
    </div>

    <div class="tools-grid">

      <!-- Tool 1: Chrome Stream Player -->
      <div class="tool-card">
        <div class="tool-top">
          <div class="tool-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
          </div>
          <div class="tool-title-area">
            <div class="tool-title">Chrome Stream Player <span class="tool-badge">v1.0</span></div>
          </div>
        </div>
        <p class="tool-desc">A Chromium browser extension that captures M3U8 (HLS), FLV, and MP4 stream URLs from any webpage and plays them in an embedded popup player. Includes a "Test Play" button that auto-injects onto channel listing pages for one-click playback.</p>
        <ul class="tool-features">
          <li>Supports M3U8/HLS, FLV, and MP4 streams via hls.js and flv.js</li>
          <li>Auto-detects stream URLs on the current page</li>
          <li>"Test Play" button injected onto channel pages</li>
          <li>Clipboard-based playback — paste any stream URL to play</li>
          <li>Playback history stored locally</li>
          <li>Works on Chrome, Brave, and Edge (Chromium-based browsers)</li>
        </ul>
        <div class="tool-actions">
          <a href="https://github.com/goplay-source/IPTV-tools" target="_blank" rel="noopener" class="tool-btn tool-btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            View on GitHub
          </a>
          <a href="/chrome-stream-plugin.zip" download class="tool-btn tool-btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download .zip
          </a>
        </div>
        <div class="tool-meta">
          <div class="tool-meta-item"><span>License:</span> MIT</div>
          <div class="tool-meta-item"><span>Format:</span> Chrome Extension (Manifest V3)</div>
          <div class="tool-meta-item"><span>Install:</span> Load unpacked from chrome://extensions</div>
        </div>
      </div>

      <!-- Tool 2: Awesome IPTV Tools -->
      <div class="tool-card">
        <div class="tool-top">
          <div class="tool-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <div class="tool-title-area">
            <div class="tool-title">Awesome IPTV Tools <span class="tool-badge">Curated</span></div>
          </div>
        </div>
        <p class="tool-desc">A curated collection of open-source IPTV tools, M3U channel list resources, stream validation utilities, and technical references. Covers channel discovery, playlist management, stream quality testing, and directory building.</p>
        <ul class="tool-features">
          <li>Channel list data sources (iptv-org, Guovin, Free-TV)</li>
          <li>Stream validation and liveness checking tools</li>
          <li>M3U parser scripts and playlist management utilities</li>
          <li>Directory and search engine references</li>
          <li>IPTV player applications across platforms</li>
          <li>Technical resources and documentation</li>
        </ul>
        <div class="tool-actions">
          <a href="https://github.com/goplay-source/IPTV-tools" target="_blank" rel="noopener" class="tool-btn tool-btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            View on GitHub
          </a>
        </div>
        <div class="tool-meta">
          <div class="tool-meta-item"><span>License:</span> MIT</div>
          <div class="tool-meta-item"><span>Type:</span> Curated Resource List</div>
          <div class="tool-meta-item"><span>Category:</span> Developer Resources</div>
        </div>
      </div>

    </div>

    <div class="cta-banner">
      <h2>Want More Tools?</h2>
      <p>We're continuously building new utilities for the IPTV community. Have an idea? Open an issue on GitHub.</p>
      <a href="https://github.com/goplay-source/IPTV-tools/issues" target="_blank" rel="noopener" class="tool-btn tool-btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Suggest a Tool
      </a>
    </div>
  </div>
</div>
`;
