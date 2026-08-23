// About 页面
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';

export const ABOUT_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title data-i18n-title="pageTitle">About IPTV Search - Free IPTV Channel Directory & Search Engine</title>
  <meta name="description" content="IPTV Search is a free online directory and search engine for live TV channels worldwide. 10,000+ channels across 150+ countries, updated daily.">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <link rel="canonical" href="https://iptv-search.com/about">
  <meta property="og:type" content="website">
  <meta property="og:title" content="About IPTV Search">
  <meta property="og:description" content="Free online directory and search engine for live TV channels worldwide. 10,000+ channels across 150+ countries.">
  <meta property="og:url" content="https://iptv-search.com/about">
  <meta property="og:image" content="https://iptv-search.com/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="IPTV Search">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="About IPTV Search">
  <meta name="twitter:description" content="Free online directory and search engine for live TV channels worldwide.">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff;display:flex;flex-direction:column;min-height:100vh}
    .main-content{flex:1;width:100%;margin-top:70px;padding:20px 0}
    .container{max-width:900px;margin:0 auto;padding:40px 20px}
    h1{font-size:2rem;font-weight:800;margin-bottom:1rem;color:#e50914}
    h2{font-size:1.4rem;font-weight:700;margin:2rem 0 1rem;color:#fff}
    p{color:rgba(255,255,255,.8);line-height:1.8;margin-bottom:1rem}
    ul{margin:1rem 0 1.5rem 1.5rem;color:rgba(255,255,255,.8);line-height:1.8}
    li{margin-bottom:.5rem}
    table{width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:.95rem}
    th,td{padding:12px 16px;text-align:left;border:1px solid rgba(255,255,255,.1)}
    th{background:rgba(229,9,20,.1);color:#e50914;font-weight:700}
    td{background:rgba(255,255,255,.02);color:rgba(255,255,255,.8)}
    .section{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px;margin-bottom:24px}
    .disclaimer{background:rgba(229,9,20,.08);border-left:4px solid #e50914;padding:16px 20px;border-radius:0 8px 8px 0;margin:1.5rem 0}
    a{color:#e50914;text-decoration:none}
    a:hover{text-decoration:underline}
    @media(max-width:768px){
      .container{padding:30px 16px}
      h1{font-size:1.6rem}
      h2{font-size:1.2rem}
      table{font-size:.85rem}
      th,td{padding:8px 10px}
    }
    @media(max-width:480px){
      .container{padding:20px 12px}
      .section{padding:16px}
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  <div class="main-content">
    <div class="container">
      <h1>About IPTV Search</h1>

      <div class="section">
        <h2>Who We Are</h2>
        <p data-i18n="whoWeAre">IPTV Search is a free online directory and search engine dedicated to helping users discover live TV channels from around the world. Our mission is to make it easy for anyone to find and watch free IPTV streams, regardless of their technical background.</p>
      </div>

      <div class="section">
        <h2>What We Do</h2>
        <p data-i18n="whatWeDo">We maintain a comprehensive, daily-updated catalog of <strong>10,000+ free IPTV channels</strong> spanning <strong>150+ countries</strong>. Channels are organized by region, category, and language.</p>
        <ul>
          <li><strong>Region:</strong> Americas, Europe, Asia, Oceania, Middle East, Africa</li>
          <li><strong>Category:</strong> News, Sports, Movies, Entertainment, Music, Kids, Documentaries</li>
          <li><strong>Language:</strong> English, Chinese, Arabic, Spanish, French, Portuguese, and many more</li>
        </ul>
      </div>

      <div class="section">
        <h2>Our Data</h2>
        <table>
          <thead>
            <tr><th>Metric</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td>Total Channels</td><td>10,000+</td></tr>
            <tr><td>Countries/Regions</td><td>150+</td></tr>
            <tr><td>Channel Groups</td><td>100+</td></tr>
            <tr><td>Update Frequency</td><td>Daily</td></tr>
            <tr><td>Signup Required</td><td>No (basic access)</td></tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>How It Works</h2>
        <ol style="margin:1rem 0 1.5rem 1.5rem;color:rgba(255,255,255,.8);line-height:2">
          <li data-i18n="step1"><strong>Browse or Search</strong> — Use our search bar or browse by country/category</li>
          <li data-i18n="step2"><strong>Select a Channel</strong> — Click any channel to view its stream link</li>
          <li data-i18n="step3"><strong>Play in Your App</strong> — Copy the M3U/M3U8 link and paste it into your preferred IPTV player (VLC, IPTV Smarters Pro, GSE Smart IPTV, TiviMate, etc.)</li>
        </ol>
      </div>

      <div class="section">
        <h2>Supported Players</h2>
        <ul>
          <li><strong>Smart TVs:</strong> Samsung Tizen, LG webOS, Sony Android TV</li>
          <li><strong>Streaming Devices:</strong> Roku, Amazon Firestick, Apple TV</li>
          <li><strong>Mobile:</strong> iOS (APTV, Televizo), Android (Televizo, IPTV Smarters Pro)</li>
          <li><strong>Desktop:</strong> VLC Media Player, Kodi, GSE Smart IPTV</li>
          <li><strong>Android TV:</strong> TiviMate Premium, IPTV Smarters Pro</li>
        </ul>
      </div>

      <div class="section">
        <h2>Subscription Plans</h2>
        <p data-i18n="plansText">Free users get full access to the channel directory with ads. Premium subscribers enjoy ad-free experience, HD/4K quality streams, simultaneous multi-device connections, and priority technical support.</p>
        <p>See <a href="/plans">our plans page</a> for current pricing.</p>
      </div>

      <div class="disclaimer">
        <h2>Legal Disclaimer</h2>
        <p data-i18n="disclaimer">IPTV Search only indexes publicly available streaming links. We do not host, produce, or distribute any content. Users are responsible for ensuring compliance with their local laws and the terms of service of content providers.</p>
      </div>

      <div class="section">
        <h2>Contact</h2>
        <ul>
          <li>Website: <a href="/">https://iptv-search.com</a></li>
          <li>Tutorials: <a href="/tutorial">https://iptv-search.com/tutorial</a></li>
          <li>FAQ: See the FAQ section on our homepage</li>
        </ul>
      </div>
    </div>
  </div>
  ${PAGE_FOOTER}

  <script>
    // 多语言翻译
    const translations = {
      'en': {
        pageTitle: 'About IPTV Search',
        whoWeAre: 'IPTV Search is a free online directory and search engine dedicated to helping users discover live TV channels from around the world. Our mission is to make it easy for anyone to find and watch free IPTV streams, regardless of their technical background.',
        whatWeDo: 'We maintain a comprehensive, daily-updated catalog of <strong>10,000+ free IPTV channels</strong> spanning <strong>150+ countries</strong>. Channels are organized by region, category, and language.',
        step1: '<strong>Browse or Search</strong> &mdash; Use our search bar or browse by country/category',
        step2: '<strong>Select a Channel</strong> &mdash; Click any channel to view its stream link',
        step3: '<strong>Play in Your App</strong> &mdash; Copy the M3U/M3U8 link and paste it into your preferred IPTV player (VLC, IPTV Smarters Pro, GSE Smart IPTV, TiviMate, etc.)',
        plansText: 'Free users get full access to the channel directory with ads. Premium subscribers enjoy ad-free experience, HD/4K quality streams, simultaneous multi-device connections, and priority technical support.',
        disclaimer: 'IPTV Search only indexes publicly available streaming links. We do not host, produce, or distribute any content. Users are responsible for ensuring compliance with their local laws and the terms of service of content providers.'
      },
      'zh-CN': {
        pageTitle: '关于 IPTV Search',
        whoWeAre: 'IPTV Search 是一个免费的在线目录和搜索引擎，致力于帮助用户发现来自世界各地的直播电视频道。我们的使命是让任何人都能轻松找到并观看免费 IPTV 流媒体，无论他们的技术背景如何。',
        whatWeDo: '我们维护一个全面的、每日更新的目录，包含覆盖 <strong>150+ 个国家/地区</strong>的 <strong>10,000+ 个免费 IPTV 频道</strong>。频道按地区、分类和语言进行组织。',
        step1: '<strong>浏览或搜索</strong> &mdash; 使用搜索栏或按国家/分类浏览',
        step2: '<strong>选择频道</strong> &mdash; 点击任何频道查看其播放链接',
        step3: '<strong>在应用中播放</strong> &mdash; 复制 M3U/M3U8 链接并粘贴到您喜欢的 IPTV 播放器中（VLC、IPTV Smarters Pro、GSE Smart IPTV、TiviMate 等）',
        plansText: '免费用户可完整访问频道目录（含广告）。高级订阅用户可享受无广告体验、HD/4K 画质流媒体、多设备同时连接以及优先技术支持。',
        disclaimer: 'IPTV Search 仅索引公开可用的播放链接。我们不托管、制作或分发任何内容。用户有责任确保其使用符合当地法律及内容提供方服务条款。'
      }
    };

    function detectLang() {
      const saved = localStorage.getItem('iptv_language');
      if (saved && ['zh-CN', 'en'].includes(saved)) return saved;
      const lang = navigator.language || navigator.userLanguage || 'en';
      return lang.startsWith('zh') && (lang.includes('CN') || lang === 'zh') ? 'zh-CN' : 'en';
    }

    const lang = detectLang();
    const t = translations[lang] || translations['en'];
    document.title = t.pageTitle + ' - IPTV Search';

    // 更新所有 data-i18n 元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.innerHTML = t[key];
    });

    // 保存语言偏好
    localStorage.setItem('iptv_language', lang);
  </script>
</body>
</html>
`;
