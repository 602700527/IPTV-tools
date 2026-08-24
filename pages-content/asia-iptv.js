// Asia IPTV Landing Page
export const pageTitle = 'Asian IPTV Channels - Live TV from China, Japan, Korea (2026)';
export const pageDescription = 'Watch free Asian IPTV channels from Japan, Korea, China, India, Philippines, Vietnam and more. Live TV streaming for Asia - no signup required.';

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
.container{max-width:1400px;margin:0 auto;padding:0 20px}
.page-header{text-align:center;padding:3rem 0 2rem}
.page-header h1{font-size:2.5rem;font-weight:800;margin-bottom:1rem;color:var(--text)}
.page-header p{font-size:1.1rem;color:var(--text-secondary);max-width:600px;margin:0 auto}
.section{margin-bottom:3rem}
.section-title{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;padding-bottom:0.75rem;border-bottom:var(--border)}
.country-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}
.country-card{background:var(--bg-card);border:var(--border);border-radius:var(--radius);padding:1.5rem;text-align:center;text-decoration:none;transition:all 0.2s}
.country-card:hover{border-color:var(--accent);transform:translateY(-4px)}
.country-card h3{font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;color:var(--text)}
.country-card p{color:var(--text-secondary);font-size:0.85rem}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}
.feature-card{background:var(--bg-card);border:var(--border);border-radius:var(--radius);padding:2rem}
.feature-card h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem;color:var(--accent)}
.feature-card p{color:var(--text-secondary);font-size:0.95rem;line-height:1.6}
.cta-section{background:var(--accent);border-radius:var(--radius);padding:3rem;text-align:center;margin:2rem 0}
.cta-section h2{font-size:1.75rem;font-weight:700;margin-bottom:1rem}
.cta-section p{font-size:1.1rem;opacity:0.9;margin-bottom:1.5rem}
.cta-btn{display:inline-block;background:var(--text);color:var(--accent);padding:14px 32px;border-radius:var(--radius);font-weight:600;text-decoration:none;transition:transform 0.2s}
.cta-btn:hover{transform:scale(1.05)}
@media(max-width:768px){
.main-content{margin-top:80px}
.container{padding:0 16px}
.page-header{padding:2rem 0 1.5rem}
.page-header h1{font-size:1.75rem}
.country-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:480px){
.main-content{margin-top:70px;padding:16px 0}
.container{padding:0 12px}
.page-header{padding:1.5rem 0 1rem}
.page-header h1{font-size:1.4rem}
.page-header p{font-size:0.95rem}
.country-grid{grid-template-columns:1fr}
.feature-grid{grid-template-columns:1fr}
.cta-section{padding:2rem 1rem}
.cta-section h2{font-size:1.4rem}
.cta-btn{padding:12px 24px}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>🌏 Asia IPTV Free</h1>
      <p>Watch free Asian live TV channels from Japan, Korea, China, India, Philippines, Vietnam and all Asian countries.</p>
    </div>

    <div class="section">
      <h2 class="section-title">Popular Asian Countries</h2>
      <div class="country-grid">
        <div class="country-card">
          <h3>🇨🇳 China</h3>
          <p>CCTV, Phoenix TV</p>
        </div>
        <div class="country-card">
          <h3>🇯🇵 Japan</h3>
          <p>NHK, TV Asahi</p>
        </div>
        <div class="country-card">
          <h3>🇰🇷 Korea</h3>
          <p>KBS, MBC, SBS</p>
        </div>
        <div class="country-card">
          <h3>🇮🇳 India</h3>
          <p>Star TV, Zee TV</p>
        </div>
        <div class="country-card">
          <h3>🇵🇭 Philippines</h3>
          <p>GMA, ABS-CBN</p>
        </div>
        <div class="country-card">
          <h3>🇻🇳 Vietnam</h3>
          <p>VTV, HTV</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Why Choose Asia IPTV?</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3>🇯🇵 Japanese Entertainment</h3>
          <p>Watch NHK, TV Asahi, TBS, Fuji TV and all Japanese drama, anime, and news channels.</p>
        </div>
        <div class="feature-card">
          <h3>🇰🇷 Korean Drama & K-Pop</h3>
          <p>KBS, MBC, SBS live streams. Watch Korean dramas and K-pop shows as they air.</p>
        </div>
        <div class="feature-card">
          <h3>🇮🇳 Indian Bollywood</h3>
          <p>Star TV, Zee TV, Sony, and all Hindi, Tamil, Telugu channels from India.</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Start Watching Asian TV Now</h2>
      <p>Get instant access to all Asian IPTV channels for free</p>
      <a href="/subscription" class="cta-btn">Free IPTV Trial</a>
    </div>
  </div>
</div>
`;
