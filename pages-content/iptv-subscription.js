// IPTV Subscription Landing Page
// Note: Year is hardcoded to avoid Cloudflare Workers edge runtime Date issues
export const pageTitle = 'Best IPTV Providers 2026 - Compare Top IPTV Services & Subscriptions';
export const pageDescription = 'Compare the best IPTV providers in 2026. Find reliable IPTV services with 8000+ channels, HD quality, and affordable subscriptions. Trusted IPTV providers reviewed.';

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
.plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:0}
.plan-card{background:transparent;border:var(--border);border-radius:var(--radius);padding:2rem;text-align:center;position:relative}
.plan-card.featured{border-color:var(--accent)}
.plan-card.featured::before{content:"MOST POPULAR";position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:4px 16px;font-size:0.75rem;font-weight:700}
.plan-card h3{font-size:1.25rem;font-weight:600;margin-bottom:1rem;color:var(--text)}
.plan-price{font-size:2.5rem;font-weight:800;color:var(--accent);margin-bottom:0.5rem}
.plan-price span{font-size:1rem;color:var(--text-secondary);font-weight:400}
.plan-period{color:var(--text-secondary);margin-bottom:1.5rem}
.plan-features{list-style:none;padding:0;text-align:left;margin-bottom:1.5rem}
.plan-features li{padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.8)}
.plan-features li:last-child{border-bottom:none}
.plan-btn{display:inline-block;background:var(--accent);color:#fff;padding:12px 32px;font-weight:600;text-decoration:none;transition:background 0.2s;width:100%}
.plan-btn:hover{background:#f7262c}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:0}
.feature-item{background:transparent;border:var(--border);border-radius:var(--radius);padding:1.5rem;text-align:center}
.feature-icon{font-size:2.5rem;margin-bottom:1rem}
.feature-item h3{font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;color:var(--text)}
.feature-item p{color:var(--text-secondary);font-size:0.9rem}
.cta-section{background:transparent;border:var(--border);border-radius:var(--radius);padding:3rem;text-align:center;margin:2rem 0}
.cta-section h2{font-size:1.75rem;font-weight:700;margin-bottom:1rem;color:var(--text)}
.cta-section p{font-size:1.1rem;color:var(--text-secondary);margin-bottom:1.5rem}
.cta-btn{display:inline-block;background:var(--accent);color:#fff;padding:14px 32px;font-weight:600;text-decoration:none}
.cta-btn:hover{background:#f7262c}
@media(max-width:768px){
.main-content{margin-top:80px}
.container{padding:0 16px}
.page-header{padding:2rem 0 1.5rem}
.page-header h1{font-size:1.75rem}
.plan-grid{grid-template-columns:1fr}
}
@media(max-width:480px){
.main-content{margin-top:70px;padding:16px 0}
.container{padding:0 12px}
.page-header{padding:1.5rem 0 1rem}
.page-header h1{font-size:1.4rem}
.page-header p{font-size:0.95rem}
.cta-section{padding:2rem 1rem}
.cta-section h2{font-size:1.4rem}
.cta-btn{padding:12px 24px}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.5rem"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 17 12"/></svg> IPTV Subscription Guide</h1>
      <p>Everything you need to know about IPTV subscriptions. Compare plans, features, and pricing to find the perfect service.</p>
    </div>

    <div class="section">
      <h2 class="section-title">Subscription Plans</h2>
      <div class="plan-grid">
        <div class="plan-card">
          <h3>Monthly</h3>
          <div class="plan-price">$9.99<span>/mo</span></div>
          <div class="plan-period">Billed monthly</div>
          <ul class="plan-features">
            <li>8000+ Live Channels</li>
            <li>HD & 4K Quality</li>
            <li>24/7 Support</li>
            <li>1 Device</li>
          </ul>
          <a href="/plans" class="plan-btn">Get Started</a>
        </div>
        <div class="plan-card featured">
          <h3>Yearly</h3>
          <div class="plan-price">$59.99<span>/yr</span></div>
          <div class="plan-period">Save 50%</div>
          <ul class="plan-features">
            <li>8000+ Live Channels</li>
            <li>HD & 4K Quality</li>
            <li>Priority Support</li>
            <li>3 Devices</li>
          </ul>
          <a href="/plans" class="plan-btn">Get Started</a>
        </div>
        <div class="plan-card">
          <h3>Permanent</h3>
          <div class="plan-price">$199<span>/once</span></div>
          <div class="plan-period">Lifetime access</div>
          <ul class="plan-features">
            <li>8000+ Live Channels</li>
            <li>4K Quality</li>
            <li>VIP Support</li>
            <li>5 Devices</li>
          </ul>
          <a href="/plans" class="plan-btn">Get Started</a>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">What's Included</h2>
      <div class="feature-grid">
        <div class="feature-item">
          <div class="feature-icon">🌍</div>
          <h3>Global Channels</h3>
          <p>8000+ channels from USA, UK, Canada, India, and 100+ countries</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📺</div>
          <h3>HD & 4K Quality</h3>
          <p>Crystal clear picture quality with smart CDN streaming</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📱</div>
          <h3>Multi-Device</h3>
          <p>Watch on Smart TV, phone, tablet, computer, and more</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⏰</div>
          <h3>Catch-Up TV</h3>
          <p>Missed a show? Watch it later with 7-day catch-up</p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Start Your IPTV Journey Today</h2>
      <p>No hidden fees. Cancel anytime. 24-hour money-back guarantee.</p>
      <a href="/plans" class="cta-btn">View All Plans</a>
    </div>
  </div>
</div>
`;
