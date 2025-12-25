// 门户首页内容
export const LANDING_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>电视直播服务 - 高清 IPTV</title>
  <meta name="description" content="提供高清稳定的电视直播服务，支持多种设备，随时随地观看">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;line-height:1.6;color:#1d1d1f;background:#fff}
    a{text-decoration:none;color:inherit}
    .container{max-width:1200px;margin:0 auto;padding:0 20px}
    .header{position:fixed;top:0;left:0;right:0;background:rgba(255,255,255,.95);backdrop-filter:blur(20px);box-shadow:0 2px 20px rgba(0,0,0,.05);z-index:100}
    .nav{display:flex;justify-content:space-between;align-items:center;height:70px}
    .logo{font-size:24px;font-weight:700;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .nav-links{display:flex;gap:30px;align-items:center}
    .nav-links a{color:#1d1d1f;font-weight:500;font-size:15px;transition:color .2s}
    .nav-links a:hover{color:#667eea}
    .nav-btn{padding:10px 24px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border-radius:8px;font-weight:600;font-size:14px;transition:transform .2s,box-shadow .2s}
    .nav-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(102,126,234,.4)}
    .hero{padding:160px 0 100px;text-align:center;background:linear-gradient(180deg,#f8f9fa 0%,#fff 100%)}
    .hero h1{font-size:56px;font-weight:800;margin-bottom:24px;letter-spacing:-1px}
    .hero h1 span{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .hero p{font-size:20px;color:#86868b;margin-bottom:40px;max-width:700px;margin-left:auto;margin-right:auto}
    .hero-btns{display:flex;gap:20px;justify-content:center}
    .btn{padding:16px 40px;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;transition:all .2s;display:inline-block}
    .btn-primary{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none}
    .btn-primary:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(102,126,234,.4)}
    .btn-secondary{background:white;color:#1d1d1f;border:2px solid #e5e5ea}
    .btn-secondary:hover{border-color:#667eea;color:#667eea}
    .features{padding:100px 0;background:#f8f9fa}
    .features h2{font-size:40px;font-weight:700;text-align:center;margin-bottom:16px}
    .features p.subtitle{text-align:center;color:#86868b;font-size:18px;margin-bottom:60px}
    .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px}
    .feature-card{background:white;padding:40px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.04);transition:transform .2s,box-shadow .2s}
    .feature-card:hover{transform:translateY(-8px);box-shadow:0 12px 40px rgba(0,0,0,.08)}
    .feature-icon{width:60px;height:60px;border-radius:12px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;margin-bottom:24px;font-size:28px}
    .feature-card h3{font-size:22px;font-weight:600;margin-bottom:12px}
    .feature-card p{color:#86868b;font-size:15px}
    .howto{padding:100px 0}
    .howto h2{font-size:40px;font-weight:700;text-align:center;margin-bottom:16px}
    .howto p.subtitle{text-align:center;color:#86868b;font-size:18px;margin-bottom:60px}
    .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:40px;max-width:900px;margin:0 auto}
    .step{text-align:center}
    .step-number{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;font-size:24px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
    .step h3{font-size:20px;font-weight:600;margin-bottom:12px}
    .step p{color:#86868b;font-size:15px}
    .devices{padding:100px 0;background:#f8f9fa}
    .devices h2{font-size:40px;font-weight:700;text-align:center;margin-bottom:16px}
    .devices p.subtitle{text-align:center;color:#86868b;font-size:18px;margin-bottom:60px}
    .device-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:30px;text-align:center}
    .device-item{background:white;padding:30px;border-radius:12px}
    .device-icon{font-size:48px;margin-bottom:16px}
    .device-item h4{font-size:16px;font-weight:600;margin-bottom:4px}
    .device-item p{color:#86868b;font-size:13px}
    .cta{padding:100px 0;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}
    .cta h2{font-size:40px;font-weight:700;color:white;margin-bottom:16px}
    .cta p{color:rgba(255,255,255,.9);font-size:18px;margin-bottom:32px;max-width:600px;margin-left:auto;margin-right:auto}
    .cta .btn{padding:16px 48px;background:white;color:#667eea;border:none;font-size:18px}
    .cta .btn:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,.2)}
    .footer{background:#1d1d1f;color:#86868b;padding:60px 0 30px}
    .footer-content{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:40px;margin-bottom:40px}
    .footer-section h4{color:white;font-size:16px;font-weight:600;margin-bottom:20px}
    .footer-section ul{list-style:none}
    .footer-section li{margin-bottom:12px;font-size:14px}
    .footer-section a:hover{color:#fff}
    .footer-bottom{border-top:1px solid rgba(255,255,255,.1);padding-top:30px;text-align:center;font-size:14px}
    @media (max-width:768px){
      .hero h1{font-size:40px}
      .hero p{font-size:16px}
      .hero-btns{flex-direction:column}
      .nav-links{display:none}
      .features-grid,.steps,.device-grid{grid-template-columns:1fr}
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <div class="logo">📺 IPTV Live</div>
        <div class="nav-links">
          <a href="#features">功能特点</a>
          <a href="#howto">使用教程</a>
          <a href="#devices">支持设备</a>
          <a href="/activate" class="nav-btn">立即激活</a>
        </div>
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <h1>高清稳定的<br><span>电视直播服务</span></h1>
      <p>为您提供丰富的高清频道，流畅稳定的观看体验，支持多种设备，随时随地享受精彩直播</p>
      <div class="hero-btns">
        <a href="/activate" class="btn btn-primary">立即激活</a>
        <a href="#howto" class="btn btn-secondary">了解如何使用</a>
      </div>
    </div>
  </section>

  <section id="features" class="features">
    <div class="container">
      <h2>为什么选择我们</h2>
      <p class="subtitle">专业的直播服务，给您带来极致的观看体验</p>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📺</div>
          <h3>海量频道</h3>
          <p>汇聚国内外热门频道，覆盖新闻、体育、娱乐、电影等丰富内容</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>高速稳定</h3>
          <p>采用全球CDN加速，确保直播流畅无卡顿，高清画质不压缩</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>多端支持</h3>
          <p>支持手机、平板、电视盒子、电脑等多种设备，随时观看</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>安全可靠</h3>
          <p>先进的加密技术保护您的隐私，24小时技术支持保障服务</p>
        </div>
      </div>
    </div>
  </section>

  <section id="howto" class="howto">
    <div class="container">
      <h2>简单三步开始使用</h2>
      <p class="subtitle">无需复杂设置，几分钟内即可开始观看</p>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>获取卡密</h3>
          <p>联系管理员或通过指定渠道获取激活卡密</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>激活服务</h3>
          <p>访问激活页面，输入卡密获取订阅地址</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>添加订阅</h3>
          <p>将订阅地址添加到播放器即可开始观看</p>
        </div>
      </div>
    </div>
  </section>

  <section id="devices" class="devices">
    <div class="container">
      <h2>支持的设备</h2>
      <p class="subtitle">几乎支持所有主流设备和播放器</p>
      <div class="device-grid">
        <div class="device-item">
          <div class="device-icon">📱</div>
          <h4>手机/平板</h4>
          <p>iOS / Android</p>
        </div>
        <div class="device-item">
          <div class="device-icon">💻</div>
          <h4>电脑</h4>
          <p>Windows / Mac / Linux</p>
        </div>
        <div class="device-item">
          <div class="device-icon">📺</div>
          <h4>智能电视</h4>
          <p>Smart TV</p>
        </div>
        <div class="device-item">
          <div class="device-icon">📦</div>
          <h4>电视盒子</h4>
          <p>TV Box</p>
        </div>
        <div class="device-item">
          <div class="device-icon">🎮</div>
          <h4>游戏机</h4>
          <p>PS / Xbox</p>
        </div>
        <div class="device-item">
          <div class="device-icon">⚙️</div>
          <h4>播放器</h4>
          <p>IPTV / PotPlayer</p>
        </div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="container">
      <h2>立即开始体验</h2>
      <p>获取您的激活卡密，畅享高清直播服务</p>
      <a href="/activate" class="btn">立即激活</a>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>关于我们</h4>
          <ul>
            <li><a href="#">公司介绍</a></li>
            <li><a href="#">服务条款</a></li>
            <li><a href="#">隐私政策</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>帮助中心</h4>
          <ul>
            <li><a href="#howto">使用教程</a></li>
            <li><a href="#devices">支持设备</a></li>
            <li><a href="#features">功能特点</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>联系方式</h4>
          <ul>
            <li>邮箱: support@example.com</li>
            <li>时间: 24小时服务</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 IPTV Live. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;
