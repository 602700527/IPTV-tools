// Europe IPTV Landing Page
export const pageTitle = 'Europe IPTV Free - Live European TV Channels Streaming';
export const pageDescription = 'Watch free European IPTV channels from UK, France, Germany, Italy, Spain and more. Live TV streaming for all European countries - no signup required.';

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
.country-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}
.country-card{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem;text-align:center;text-decoration:none;transition:all 0.2s}
.country-card:hover{border-color:#e50914;transform:translateY(-4px)}
.country-card h3{font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;color:#fff}
.country-card p{color:rgba(255,255,255,0.6);font-size:0.85rem}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}
.feature-card{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:2rem}
.feature-card h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem;color:#e50914}
.feature-card p{color:rgba(255,255,255,0.7);font-size:0.95rem;line-height:1.6}
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
.country-grid{grid-template-columns:repeat(2,1fr)}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>🇪🇺 Europe IPTV Free</h1>
      <p>Watch free European live TV channels from UK, France, Germany, Italy, Spain and all European countries.</p>
    </div>

    <div class="section">
      <h2 class="section-title">Popular European Countries</h2>
      <div class="country-grid">
        <a href="/uk-iptv-plans" class="country-card">
          <h3>🇬🇧 UK</h3>
          <p>BBC, ITV, Sky News</p>
        </a>
        <a href="/category/French" class="country-card">
          <h3>🇫🇷 French</h3>
          <p>TF1, France 24</p>
        </a>
        <a href="/category/German" class="country-card">
          <h3>🇩🇪 German</h3>
          <p>ARD, ZDF, RTL</p>
        </a>
        <a href="/category/Italian" class="country-card">
          <h3>🇮🇹 Italian</h3>
          <p>RAI, Mediaset</p>
        </a>
        <a href="/category/Spanish" class="country-card">
          <h3>🇪🇸 Spanish</h3>
          <p>TVE, Telecinco</p>
        </a>
        <a href="/category/Portuguese" class="country-card">
          <h3>🇵🇹 Portuguese</h3>
          <p>RTP, SIC</p>
        </a>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Why Choose Europe IPTV?</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3>🇬🇧 UK Channels</h3>
          <p>BBC News, ITV, Channel 4, Sky Sports, and all British TV channels live.</p>
        </div>
        <div class="feature-card">
          <h3>⚽ European Sports</h3>
          <p>Watch UEFA Champions League, Premier League, La Liga, Serie A, and all European sports.</p>
        </div>
        <div class="feature-card">
          <h3>🇫🇷 French Entertainment</h3>
          <p>TF1, France 24, Canal+, and all French TV channels in HD quality.</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Start Watching European TV Now</h2>
      <p>Get instant access to all European IPTV channels for free</p>
      <a href="/free-iptv-trial" class="cta-btn">Free IPTV Trial</a>
    </div>
  </div>
</div>
`;
