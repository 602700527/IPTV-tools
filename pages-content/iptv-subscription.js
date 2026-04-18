// IPTV Subscription Landing Page
// Note: Year is hardcoded to avoid Cloudflare Workers edge runtime Date issues
export const pageTitle = 'Best IPTV Providers 2026 - Compare Top IPTV Services & Subscriptions';
export const pageDescription = 'Compare the best IPTV providers in 2026. Find reliable IPTV services with 8000+ channels, HD quality, and affordable subscriptions. Trusted IPTV providers reviewed.';

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
.plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}
.plan-card{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:2rem;text-align:center;position:relative}
.plan-card.featured{border-color:#e50914;transform:scale(1.02)}
.plan-card.featured::before{content:"MOST POPULAR";position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#e50914;color:#fff;padding:4px 16px;border-radius:20px;font-size:0.75rem;font-weight:700}
.plan-card h3{font-size:1.25rem;font-weight:600;margin-bottom:1rem}
.plan-price{font-size:2.5rem;font-weight:800;color:#e50914;margin-bottom:0.5rem}
.plan-price span{font-size:1rem;color:rgba(255,255,255,0.5);font-weight:400}
.plan-period{color:rgba(255,255,255,0.6);margin-bottom:1.5rem}
.plan-features{list-style:none;padding:0;text-align:left;margin-bottom:1.5rem}
.plan-features li{padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.8)}
.plan-features li:last-child{border-bottom:none}
.plan-btn{display:inline-block;background:#e50914;color:#fff;padding:12px 32px;border-radius:8px;font-weight:600;text-decoration:none;transition:all 0.2s;width:100%}
.plan-btn:hover{background:#b81d24;transform:translateY(-2px)}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem}
.feature-item{background:#141414;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem;text-align:center}
.feature-icon{font-size:2.5rem;margin-bottom:1rem}
.feature-item h3{font-size:1.1rem;font-weight:600;margin-bottom:0.5rem}
.feature-item p{color:rgba(255,255,255,0.7);font-size:0.9rem}
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
.plan-grid{grid-template-columns:1fr}
.plan-card.featured{transform:none}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>📺 IPTV Subscription Guide 2024</h1>
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
