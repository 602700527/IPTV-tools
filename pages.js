// 生成网站地图 XML
export function generateSitemap(origin) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${origin}/activate</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${origin}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
}

// 生成 robots.txt
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# 禁止爬取管理后台
Disallow: /admin/
Disallow: /admin

# 禁止爬取API接口
Disallow: /api/

# 禁止爬取激活页面
Disallow: /activate/

# 网站地图
Sitemap: https://iptv-search.com/sitemap.xml`;
}

// 生成隐私政策页面
export function generatePrivacyPolicy() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - IPTV Live</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6;padding:20px}
    .container{max-width:900px;margin:0 auto}
    h1{font-size:28px;margin-bottom:20px;color:#e50914}
    h2{font-size:22px;margin:30px 0 15px;color:#fff}
    h3{font-size:18px;margin:20px 0 10px;color:rgba(255,255,255,.9)}
    p{margin-bottom:15px;color:rgba(255,255,255,.8)}
    ul{margin-bottom:15px;padding-left:30px;color:rgba(255,255,255,.8)}
    li{margin-bottom:8px}
    .section{background:#141414;padding:25px;border-radius:8px;margin-bottom:20px}
    .last-updated{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:20px}
    a{color:#e50914;text-decoration:none}
    a:hover{text-decoration:underline}
    .lang-switch{position:fixed;top:20px;right:20px;z-index:1000}
    .lang-dropdown{position:relative;display:inline-block}
    .lang-btn{background:#e50914;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;transition:background .2s;display:flex;align-items:center;gap:6px;-webkit-tap-highlight-color:transparent}
    .lang-btn:hover{background:#f7262c}
    .lang-btn:after{content:"▼";font-size:10px}
    .lang-menu{display:none;position:absolute;top:calc(100%+8px);right:0;background:#141414;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.5);min-width:140px;overflow:hidden;animation:fadeIn .2s ease}
    .lang-menu.show{display:block}
    .lang-menu button{display:block;width:100%;padding:12px 16px;background:none;border:none;text-align:left;font-size:14px;color:rgba(255,255,255,.9);cursor:pointer;transition:background .2s}
    .lang-menu button:hover{background:rgba(255,255,255,.1)}
    .lang-menu button.active{background:#e50914;color:white}
    @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
    @media (max-width:768px){
      body{padding:15px}
      h1{font-size:24px}
      h2{font-size:20px}
      .section{padding:20px}
      .lang-switch{top:10px;right:10px}
      .lang-btn{padding:8px 16px;font-size:13px}
      .lang-menu button{padding:10px 14px;font-size:13px}
    }
  </style>
</head>
<body>
  <div class="lang-switch">
    <div class="lang-dropdown">
      <button class="lang-btn" onclick="toggleLangMenu()" id="currentLangBtn">English</button>
      <div class="lang-menu" id="langMenu">
        <button onclick="setLanguage('en')" id="langEn">English</button>
        <button onclick="setLanguage('zh-CN')" id="langZh">简体中文</button>
      </div>
    </div>
  </div>
  <div class="container">
    <h1 data-i18n="title">Privacy Policy</h1>
    <p class="last-updated" data-i18n="lastUpdated">Last Updated: January 1, 2024</p>

    <div class="section">
      <h2 data-i18n="intro">Introduction</h2>
      <p data-i18n="introText">IPTV Live ("we") respects and protects your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information. By using our services, you agree to the terms of this policy.</p>
    </div>

    <div class="section">
      <h2 data-i18n="infoCollection">1. Information Collection</h2>
      <h3 data-i18n="infoTypes">1.1 Types of Information We Collect:</h3>
      <ul>
        <li data-i18n="browsingInfo"><strong>Browsing Information:</strong> Your IP address, browser type, device information, visit time, and page browsing history</li>
        <li data-i18n="usageInfo"><strong>Usage Information:</strong> Channels you watch, search records, favorites, and playback history (stored locally)</li>
        <li data-i18n="techInfo"><strong>Technical Information:</strong> Cookies, web beacons, and other tracking technologies</li>
      </ul>

      <h3 data-i18n="collectionMethods">1.2 Information Collection Methods:</h3>
      <ul>
        <li data-i18n="autoCollection">Automatic collection through browser and server logs</li>
        <li data-i18n="localStorage">Local storage through browser localStorage for user preferences and history</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="infoUsage">2. Information Usage</h2>
      <p data-i18n="usageText">We use collected information to:</p>
      <ul>
        <li data-i18n="usage1">Provide, maintain, and improve our services</li>
        <li data-i18n="usage2">Analyze user usage patterns to optimize user experience</li>
        <li data-i18n="usage3">Prevent fraud, abuse, and security threats</li>
        <li data-i18n="usage4">Comply with legal requirements and regulatory obligations</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="infoStorage">3. Information Storage</h2>
      <ul>
        <li data-i18n="storage1">Your viewing history and favorites are stored locally in your browser's localStorage and are not uploaded to our servers</li>
        <li data-i18n="storage2">Server logs may contain information such as IP addresses but are not linked to personal identity</li>
        <li data-i18n="storage3">Data is protected using industry-standard security measures</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="infoSharing">4. Information Sharing</h2>
      <p data-i18n="sharingText">We do not sell, rent, or trade your personal information. However, we may share information in the following cases:</p>
      <ul>
        <li data-i18n="sharing1"><strong>Service Providers:</strong> Sharing necessary information with third parties that help us provide services (such as Cloudflare)</li>
        <li data-i18n="sharing2"><strong>Legal Requirements:</strong> Responding to legal requests, court orders, or government investigations</li>
        <li data-i18n="sharing3"><strong>Business Transfer:</strong> In the event of a merger, acquisition, or asset transfer</li>
        <li data-i18n="sharing4"><strong>Third-Party Advertising:</strong> We may use third-party advertising services (such as Google AdSense) which may collect your browsing information</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="cookies">5. Cookies</h2>
      <p data-i18n="cookiesText">We use Cookies and similar technologies to:</p>
      <ul>
        <li data-i18n="cookies1">Remember your language preferences and settings</li>
        <li data-i18n="cookies2">Analyze website traffic and usage patterns</li>
        <li data-i18n="cookies3">Provide personalized content</li>
      </ul>
      <p data-i18n="cookiesDisable">You can disable Cookies through your browser settings, but this may affect certain website features.</p>
    </div>

    <div class="section">
      <h2 data-i18n="thirdParty">6. Third-Party Links</h2>
      <p data-i18n="thirdPartyText">Our website may contain links to third-party websites. We are not responsible for the privacy policies and practices of these third-party websites. We recommend reviewing the privacy policies of these websites.</p>
    </div>

    <div class="section">
      <h2 data-i18n="dataSecurity">7. Data Security</h2>
      <p data-i18n="dataSecurityText">We take appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of internet transmission or storage is 100% secure.</p>
    </div>

    <div class="section">
      <h2 data-i18n="yourRights">8. Your Rights</h2>
      <p data-i18n="yourRightsText">Under applicable data protection laws, you may have the following rights:</p>
      <ul>
        <li data-i18n="rights1">Access and obtain a copy of your personal information</li>
        <li data-i18n="rights2">Correct inaccurate information</li>
        <li data-i18n="rights3">Delete your personal information</li>
        <li data-i18n="rights4">Object or restrict certain processing activities</li>
        <li data-i18n="rights5">Data portability</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="childPrivacy">9. Children's Privacy</h2>
      <p data-i18n="childPrivacyText">Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it immediately.</p>
    </div>

    <div class="section">
      <h2 data-i18n="intlTransfer">10. International Data Transfer</h2>
      <p data-i18n="intlTransferText">Your information may be transferred to and processed in countries or regions outside of your own country or region where data protection laws may differ from those in your jurisdiction.</p>
    </div>

    <div class="section">
      <h2 data-i18n="policyChanges">11. Policy Changes</h2>
      <p data-i18n="policyChangesText">We may update this Privacy Policy from time to time. Updated policies will be posted on this page and the "Last Updated" date will be revised. For significant changes, we will notify you through the website.</p>
    </div>

    <div class="section">
      <h2 data-i18n="contactUs">12. Contact Us</h2>
      <p data-i18n="contactUsText">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
      <ul>
        <li data-i18n="email">Email: support@iptv-search.com</li>
        <li data-i18n="website">Website: <a href="https://iptv-search.com">https://iptv-search.com</a></li>
      </ul>
    </div>

    <p style="text-align:center;color:rgba(255,255,255,.5);margin-top:40px;" data-i18n="copyright">&copy; 2024 IPTV Live. All rights reserved.</p>
  </div>
  <script>
    const privacyTranslations = {
      'en': {
        title: 'Privacy Policy',
        lastUpdated: 'Last Updated: January 1, 2024',
        intro: 'Introduction',
        introText: 'IPTV Live ("we") respects and protects your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information. By using our services, you agree to terms of this policy.',
        infoCollection: '1. Information Collection',
        infoTypes: '1.1 Types of Information We Collect:',
        browsingInfo: '<strong>Browsing Information:</strong> Your IP address, browser type, device information, visit time, and page browsing history',
        usageInfo: '<strong>Usage Information:</strong> Channels you watch, search records, favorites, and playback history (stored locally)',
        techInfo: '<strong>Technical Information:</strong> Cookies, web beacons, and other tracking technologies',
        collectionMethods: '1.2 Information Collection Methods:',
        autoCollection: 'Automatic collection through browser and server logs',
        localStorage: 'Local storage through browser localStorage for user preferences and history',
        infoUsage: '2. Information Usage',
        usageText: 'We use collected information to:',
        usage1: 'Provide, maintain, and improve our services',
        usage2: 'Analyze user usage patterns to optimize user experience',
        usage3: 'Prevent fraud, abuse, and security threats',
        usage4: 'Comply with legal requirements and regulatory obligations',
        infoStorage: '3. Information Storage',
        storage1: 'Your viewing history and favorites are stored locally in your browser\\'s localStorage and are not uploaded to our servers',
        storage2: 'Server logs may contain information such as IP addresses but are not linked to personal identity',
        storage3: 'Data is protected using industry-standard security measures',
        infoSharing: '4. Information Sharing',
        sharingText: 'We do not sell, rent, or trade your personal information. However, we may share information in following cases:',
        sharing1: '<strong>Service Providers:</strong> Sharing necessary information with third parties that help us provide services (such as Cloudflare)',
        sharing2: '<strong>Legal Requirements:</strong> Responding to legal requests, court orders, or government investigations',
        sharing3: '<strong>Business Transfer:</strong> In event of a merger, acquisition, or asset transfer',
        sharing4: '<strong>Third-Party Advertising:</strong> We may use third-party advertising services (such as Google AdSense) which may collect your browsing information',
        cookies: '5. Cookies',
        cookiesText: 'We use Cookies and similar technologies to:',
        cookies1: 'Remember your language preferences and settings',
        cookies2: 'Analyze website traffic and usage patterns',
        cookies3: 'Provide personalized content',
        cookiesDisable: 'You can disable Cookies through your browser settings, but this may affect certain website features.',
        thirdParty: '6. Third-Party Links',
        thirdPartyText: 'Our website may contain links to third-party websites. We are not responsible for privacy policies and practices of these third-party websites. We recommend reviewing of privacy policies of these websites.',
        dataSecurity: '7. Data Security',
        dataSecurityText: 'We take appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of internet transmission or storage is 100% secure.',
        yourRights: '8. Your Rights',
        yourRightsText: 'Under applicable data protection laws, you may have following rights:',
        rights1: 'Access and obtain a copy of your personal information',
        rights2: 'Correct inaccurate information',
        rights3: 'Delete your personal information',
        rights4: 'Object or restrict certain processing activities',
        rights5: 'Data portability',
        childPrivacy: '9. Children\\'s Privacy',
        childPrivacyText: 'Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it immediately.',
        intlTransfer: '10. International Data Transfer',
        intlTransferText: 'Your information may be transferred to and processed in countries or regions outside of your own country or region where data protection laws may differ from those in your jurisdiction.',
        policyChanges: '11. Policy Changes',
        policyChangesText: 'We may update this Privacy Policy from time to time. Updated policies will be posted on this page and "Last Updated" date will be revised. For significant changes, we will notify you through website.',
        contactUs: '12. Contact Us',
        contactUsText: 'If you have any questions or concerns about this Privacy Policy, please contact us at:',
        email: 'Email: support@iptv-search.com',
        website: 'Website: <a href="https://iptv-search.com">https://iptv-search.com</a>',
        copyright: '&copy; 2024 IPTV Live. All rights reserved.'
      },
      'zh-CN': {
        title: '隐私政策',
        lastUpdated: '最后更新日期：2024年1月1日',
        intro: '引言',
        introText: 'IPTV Live（以下简称"我们"）尊重并保护您的隐私权。本隐私政策旨在说明我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本政策的条款。',
        infoCollection: '1. 信息收集',
        infoTypes: '1.1 我们收集的信息类型：',
        browsingInfo: '<strong>浏览信息：</strong>您的IP地址、浏览器类型、设备信息、访问时间和页面浏览记录',
        usageInfo: '<strong>使用信息：</strong>您观看的频道、搜索记录、收藏和播放历史（存储在本地）',
        techInfo: '<strong>技术信息：</strong>Cookies、Web信标和其他跟踪技术',
        collectionMethods: '1.2 信息收集方式：',
        autoCollection: '自动收集：通过浏览器和服务器日志',
        localStorage: '本地存储：通过浏览器 localStorage 存储用户偏好和历史记录',
        infoUsage: '2. 信息使用',
        usageText: '我们使用收集的信息用于：',
        usage1: '提供、维护和改进我们的服务',
        usage2: '分析用户使用情况，优化用户体验',
        usage3: '防止欺诈、滥用和安全威胁',
        usage4: '符合法律要求和监管义务',
        infoStorage: '3. 信息存储',
        storage1: '您的观看历史和收藏存储在本地浏览器的 localStorage 中，不会上传到我们的服务器',
        storage2: '服务器日志可能包含IP地址等信息，但不会与个人身份关联',
        storage3: '数据采用行业标准的安全措施进行保护',
        infoSharing: '4. 信息共享',
        sharingText: '我们不会出售、出租或交易您的个人信息。但在以下情况下，我们可能会共享信息：',
        sharing1: '<strong>服务提供商：</strong>与帮助我们提供服务的第三方共享必要信息（如Cloudflare等）',
        sharing2: '<strong>法律要求：</strong>响应法律要求、法院命令或政府调查',
        sharing3: '<strong>业务转让：</strong>在合并、收购或资产转让的情况下',
        sharing4: '<strong>第三方广告：</strong>我们可能使用第三方广告服务（如Google AdSense），这些服务可能会收集您的浏览信息',
        cookies: '5. Cookies',
        cookiesText: '我们使用 Cookies 和类似技术来：',
        cookies1: '记住您的语言偏好和设置',
        cookies2: '分析网站流量和使用模式',
        cookies3: '提供个性化内容',
        cookiesDisable: '您可以通过浏览器设置禁用 Cookies，但这可能会影响网站的某些功能。',
        thirdParty: '6. 第三方链接',
        thirdPartyText: '我们的网站可能包含指向第三方网站的链接。我们对这些第三方网站的隐私政策和做法不承担任何责任。我们建议您查看这些网站的隐私政策。',
        dataSecurity: '7. 数据安全',
        dataSecurityText: '我们采取适当的技术和组织措施来保护您的个人信息免受未经授权的访问、使用或披露。然而，没有任何互联网传输或存储方法是100%安全的。',
        yourRights: '8. 您的权利',
        yourRightsText: '根据适用的数据保护法律，您可能拥有以下权利：',
        rights1: '访问和获取您的个人信息副本',
        rights2: '更正不准确的信息',
        rights3: '删除您的个人信息',
        rights4: '反对或限制某些处理活动',
        rights5: '数据可携带性',
        childPrivacy: '9. 儿童隐私',
        childPrivacyText: '我们的服务不针对13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果我们发现收集了此类信息，将立即删除。',
        intlTransfer: '10. 国际数据传输',
        intlTransferText: '您的信息可能会传输到您所在国家或地区以外的国家或地区，并在那里进行处理。这些国家/地区的数据保护法律可能与您所在司法管辖区不同。',
        policyChanges: '11. 政策变更',
        policyChangesText: '我们可能会不时更新本隐私政策。更新后的政策将在本页面上发布，并更新"最后更新日期"。重大变更时，我们将通过网站通知您。',
        contactUs: '12. 联系我们',
        contactUsText: '如果您对本隐私政策有任何问题或疑虑，请通过以下方式联系我们：',
        email: '电子邮件：support@iptv-search.com',
        website: '网站：<a href="https://iptv-search.com">https://iptv-search.com</a>',
        copyright: '&copy; 2024 IPTV Live. 保留所有权利。'
      }
    };

    let currentLang = localStorage.getItem('privacy_lang') || 'en';

    function toggleLangMenu() {
      const menu = document.getElementById('langMenu');
      menu.classList.toggle('show');
    }

    function setLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('privacy_lang', lang);

      // Update button states
      document.getElementById('langEn').classList.toggle('active', lang === 'en');
      document.getElementById('langZh').classList.toggle('active', lang === 'zh-CN');

      // Update current language button
      const langNames = { 'en': 'English', 'zh-CN': '简体' };
      document.getElementById('currentLangBtn').textContent = langNames[lang] || 'English';

      // Close menu
      document.getElementById('langMenu').classList.remove('show');

      // Update HTML lang attribute
      document.documentElement.lang = lang;

      // Update document title
      document.title = privacyTranslations[lang].title + ' - IPTV Live';

      // Update all elements with data-i18n
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (privacyTranslations[lang] && privacyTranslations[lang][key]) {
          el.innerHTML = privacyTranslations[lang][key];
        }
      });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
      setLanguage(currentLang);

      // Close language menu when clicking outside
      document.addEventListener('click', function(e) {
        const dropdown = document.querySelector('.lang-dropdown');
        if (!dropdown.contains(e.target)) {
          document.getElementById('langMenu').classList.remove('show');
        }
      });
    });
  </script>
</body>
</html>`;
}

// 生成服务条款页面
export function generateTermsOfService() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - IPTV Live</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6;padding:20px}
    .container{max-width:900px;margin:0 auto}
    h1{font-size:28px;margin-bottom:20px;color:#e50914}
    h2{font-size:22px;margin:30px 0 15px;color:#fff}
    h3{font-size:18px;margin:20px 0 10px;color:rgba(255,255,255,.9)}
    p{margin-bottom:15px;color:rgba(255,255,255,.8)}
    ul{margin-bottom:15px;padding-left:30px;color:rgba(255,255,255,.8)}
    li{margin-bottom:8px}
    .section{background:#141414;padding:25px;border-radius:8px;margin-bottom:20px}
    .last-updated{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:20px}
    a{color:#e50914;text-decoration:none}
    a:hover{text-decoration:underline}
    .warning{background:rgba(231,9,20,.1);border-left:4px solid #e50914;padding:15px;margin:15px 0}
    .lang-switch{position:fixed;top:20px;right:20px;z-index:1000}
    .lang-dropdown{position:relative;display:inline-block}
    .lang-btn{background:#e50914;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;transition:background .2s;display:flex;align-items:center;gap:6px;-webkit-tap-highlight-color:transparent}
    .lang-btn:hover{background:#f7262c}
    .lang-btn:after{content:"▼";font-size:10px}
    .lang-menu{display:none;position:absolute;top:calc(100%+8px);right:0;background:#141414;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.5);min-width:140px;overflow:hidden;animation:fadeIn .2s ease}
    .lang-menu.show{display:block}
    .lang-menu button{display:block;width:100%;padding:12px 16px;background:none;border:none;text-align:left;font-size:14px;color:rgba(255,255,255,.9);cursor:pointer;transition:background .2s}
    .lang-menu button:hover{background:rgba(255,255,255,.1)}
    .lang-menu button.active{background:#e50914;color:white}
    @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
    @media (max-width:768px){
      body{padding:15px}
      h1{font-size:24px}
      h2{font-size:20px}
      .section{padding:20px}
      .lang-switch{top:10px;right:10px}
      .lang-btn{padding:8px 16px;font-size:13px}
      .lang-menu button{padding:10px 14px;font-size:13px}
    }
  </style>
</head>
<body>
  <div class="lang-switch">
    <div class="lang-dropdown">
      <button class="lang-btn" onclick="toggleLangMenu()" id="currentLangBtn">English</button>
      <div class="lang-menu" id="langMenu">
        <button onclick="setLanguage('en')" id="langEn">English</button>
        <button onclick="setLanguage('zh-CN')" id="langZh">简体中文</button>
      </div>
    </div>
  </div>
  <div class="container">
    <h1 data-i18n="title">Terms of Service</h1>
    <p class="last-updated" data-i18n="lastUpdated">Last Updated: January 1, 2024</p>

    <div class="section">
      <h2 data-i18n="welcome">Welcome to IPTV Live</h2>
      <p data-i18n="welcomeText">Thank you for using IPTV Live services ("the Service"). By using the Service, you agree to comply with these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
    </div>

    <div class="section">
      <h2 data-i18n="serviceDesc">1. Service Description</h2>
      <h3 data-i18n="serviceContent">1.1 Service Content:</h3>
      <ul>
        <li data-i18n="content1">IPTV Live provides free online TV viewing services</li>
        <li data-i18n="content2">Services include channel lists, search, favorites, and playback history</li>
        <li data-i18n="content3">Users can access the service through web browsers</li>
      </ul>

      <h3 data-i18n="serviceNature">1.2 Service Nature:</h3>
      <ul>
        <li data-i18n="nature1">The Service is a free service and no fees are charged</li>
        <li data-i18n="nature2">We reserve the right to modify, suspend, or terminate the service at any time</li>
        <li data-i18n="nature3">Service availability may be affected by network conditions and technical limitations</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="userResp">2. User Responsibilities</h2>
      <h3 data-i18n="userReq">2.1 Usage Requirements:</h3>
      <ul>
        <li data-i18n="req1">You must be at least 13 years old to use the Service</li>
        <li data-i18n="req2">You are responsible for ensuring your account security</li>
        <li data-i18n="req3">You must not share your account information or credentials</li>
      </ul>

      <h3 data-i18n="prohibited">2.2 Prohibited Activities:</h3>
      <ul>
        <li data-i18n="proh1">Do not use the Service for any illegal purpose</li>
        <li data-i18n="proh2">Do not interfere with or disrupt the normal operation of the Service</li>
        <li data-i18n="proh3">Do not upload viruses, malicious code, or other harmful software</li>
        <li data-i18n="proh4">Do not attempt unauthorized access to our systems or data</li>
        <li data-i18n="proh5">Do not infringe on others' intellectual property or privacy rights</li>
        <li data-i18n="proh6">Do not use automated tools (such as bots, crawlers) to access the Service</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="copyright">3. Content Copyright</h2>
      <div class="warning" data-i18n="disclaimer">
        <strong>Important Notice:</strong>
        <p>IPTV Live serves only as a content aggregation platform providing channel link services. This platform does not own, produce, or store any video content. All channel copyrights belong to their respective owners.</p>
      </div>

      <h3 data-i18n="ip">3.1 Intellectual Property:</h3>
      <ul>
        <li data-i18n="ip1">The website interface, design, text, graphics, etc. are protected by copyright</li>
        <li data-i18n="ip2">Without permission, do not copy, modify, or distribute the website content</li>
        <li data-i18n="ip3">The intellectual property of channel content belongs to its original owners</li>
      </ul>

      <h3 data-i18n="userContent">3.2 User Content:</h3>
      <ul>
        <li data-i18n="uc1">You retain ownership of submitted content</li>
        <li data-i18n="uc2">By using the Service, you grant us the right to display and use related content</li>
        <li data-i18n="uc3">You guarantee you have all necessary rights to submit such content</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="liability">4. Disclaimer</h2>
      <h3 data-i18n="asIs">4.1 Service Provided "As Is":</h3>
      <ul>
        <li data-i18n="asIs1">The Service is provided on an "as is" and "available" basis</li>
        <li data-i18n="asIs2">We make no warranties regarding the accuracy, reliability, or completeness of the Service</li>
        <li data-i18n="asIs3">We do not guarantee that the Service will be uninterrupted or error-free</li>
      </ul>

      <h3 data-i18n="indirect">4.2 Indirect Damages:</h3>
      <p data-i18n="indirectText">In no event shall we be liable for any indirect, incidental, special, or consequential damages, including but not limited to lost profits, data loss, or business interruption.</p>

      <h3 data-i18n="thirdParty">4.3 Third-Party Content:</h3>
      <ul>
        <li data-i18n="tp1">We are not responsible for content or services provided by third parties</li>
        <li data-i18n="tp2">The quality, availability, and accuracy of channel content are the responsibility of content providers</li>
        <li data-i18n="tp3">We are not responsible for copyright issues related to channels</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="interruption">5. Service Interruption</h2>
      <ul>
        <li data-i18n="int1">We reserve the right to modify, suspend, or terminate all or part of the Service at any time</li>
        <li data-i18n="int2">Service interruptions may occur during system maintenance, upgrades, or force majeure</li>
        <li data-i18n="int3">We are not liable for losses caused by service interruptions</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="account">6. Account & Security</h2>
      <ul>
        <li data-i18n="acc1">You are responsible for all activities on your account</li>
        <li data-i18n="acc2">If you discover any unauthorized use of your account, please notify us immediately</li>
        <li data-i18n="acc3">We are not responsible for losses resulting from your failure to protect your account</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="privacy">7. Privacy Protection</h2>
      <p data-i18n="privacyText">Your privacy is important to us. Please review our <a href="/privacy-policy">Privacy Policy</a> to understand how we collect, use, and protect your personal information.</p>
    </div>

    <div class="section">
      <h2 data-i18n="law">8. Applicable Law</h2>
      <p data-i18n="lawText">These terms are governed by the laws of your country/region. If any dispute arises from using the Service, it should be resolved through consultation.</p>
    </div>

    <div class="section">
      <h2 data-i18n="modification">9. Terms Modification</h2>
      <ul>
        <li data-i18n="mod1">We reserve the right to modify these terms at any time</li>
        <li data-i18n="mod2">Modified terms will be posted on this page</li>
        <li data-i18n="mod3">Continued use of the Service indicates your acceptance of the modified terms</li>
        <li data-i18n="mod4">Significant changes will be notified through the website</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="termination">10. Service Termination</h2>
      <ul>
        <li data-i18n="term1">If you violate these terms, we have the right to suspend or terminate your right to use the Service</li>
        <li data-i18n="term2">You may stop using the Service at any time</li>
        <li data-i18n="term3">Some terms will continue to be effective after service termination</li>
      </ul>
    </div>

    <div class="section">
      <h2 data-i18n="forceMajeure">11. Force Majeure</h2>
      <p data-i18n="forceText">We are not liable for service interruptions or delays caused by force majeure events, including but not limited to natural disasters, wars, government actions, cyber attacks, etc.</p>
    </div>

    <div class="section">
      <h2 data-i18n="agreement">12. Entire Agreement</h2>
      <p data-i18n="agreementText">These terms constitute the entire agreement between you and us regarding the use of the Service. These terms supersede all prior agreements or understandings.</p>
    </div>

    <div class="section">
      <h2 data-i18n="severability">13. Severability</h2>
      <p data-i18n="severabilityText">If any term of these terms is deemed unenforceable or invalid, the remaining terms will remain in full force and effect.</p>
    </div>

    <div class="section">
      <h2 data-i18n="contact">14. Contact Us</h2>
      <p data-i18n="contactText">If you have any questions or concerns about these Terms of Service, please contact us at:</p>
      <ul>
        <li data-i18n="email">Email: support@iptv-search.com</li>
        <li data-i18n="website">Website: <a href="https://iptv-search.com">https://iptv-search.com</a></li>
      </ul>
    </div>

    <p style="text-align:center;color:rgba(255,255,255,.5);margin-top:40px;" data-i18n="copyright">&copy; 2024 IPTV Live. All rights reserved.</p>
  </div>
  <script>
    const termsTranslations = {
      'en': {
        title: 'Terms of Service',
        lastUpdated: 'Last Updated: January 1, 2024',
        welcome: 'Welcome to IPTV Live',
        welcomeText: 'Thank you for using IPTV Live services ("the Service"). By using the Service, you agree to comply with these Terms of Service. If you do not agree to these terms, please do not use the Service.',
        serviceDesc: '1. Service Description',
        serviceContent: '1.1 Service Content:',
        content1: 'IPTV Live provides free online TV viewing services',
        content2: 'Services include channel lists, search, favorites, and playback history',
        content3: 'Users can access the service through web browsers',
        serviceNature: '1.2 Service Nature:',
        nature1: 'The Service is a free service and no fees are charged',
        nature2: 'We reserve the right to modify, suspend, or terminate the service at any time',
        nature3: 'Service availability may be affected by network conditions and technical limitations',
        userResp: '2. User Responsibilities',
        userReq: '2.1 Usage Requirements:',
        req1: 'You must be at least 13 years old to use the Service',
        req2: 'You are responsible for ensuring your account security',
        req3: 'You must not share your account information or credentials',
        prohibited: '2.2 Prohibited Activities:',
        proh1: 'Do not use the Service for any illegal purpose',
        proh2: 'Do not interfere with or disrupt the normal operation of the Service',
        proh3: 'Do not upload viruses, malicious code, or other harmful software',
        proh4: 'Do not attempt unauthorized access to our systems or data',
        proh5: 'Do not infringe on others\\' intellectual property or privacy rights',
        proh6: 'Do not use automated tools (such as bots, crawlers) to access the Service',
        copyright: '3. Content Copyright',
        disclaimer: '<strong>Important Notice:</strong> IPTV Live serves only as a content aggregation platform providing channel link services. This platform does not own, produce, or store any video content. All channel copyrights belong to their respective owners.',
        ip: '3.1 Intellectual Property:',
        ip1: 'The website interface, design, text, graphics, etc. are protected by copyright',
        ip2: 'Without permission, do not copy, modify, or distribute the website content',
        ip3: 'The intellectual property of channel content belongs to its original owners',
        userContent: '3.2 User Content:',
        uc1: 'You retain ownership of submitted content',
        uc2: 'By using the Service, you grant us the right to display and use related content',
        uc3: 'You guarantee you have all necessary rights to submit such content',
        liability: '4. Disclaimer',
        asIs: '4.1 Service Provided "As Is":',
        asIs1: 'The Service is provided on an "as is" and "available" basis',
        asIs2: 'We make no warranties regarding the accuracy, reliability, or completeness of the Service',
        asIs3: 'We do not guarantee that the Service will be uninterrupted or error-free',
        indirect: '4.2 Indirect Damages:',
        indirectText: 'In no event shall we be liable for any indirect, incidental, special, or consequential damages, including but not limited to lost profits, data loss, or business interruption.',
        thirdParty: '4.3 Third-Party Content:',
        tp1: 'We are not responsible for content or services provided by third parties',
        tp2: 'The quality, availability, and accuracy of channel content are the responsibility of content providers',
        tp3: 'We are not responsible for copyright issues related to channels',
        interruption: '5. Service Interruption',
        int1: 'We reserve the right to modify, suspend, or terminate all or part of the Service at any time',
        int2: 'Service interruptions may occur during system maintenance, upgrades, or force majeure',
        int3: 'We are not liable for losses caused by service interruptions',
        account: '6. Account & Security',
        acc1: 'You are responsible for all activities on your account',
        acc2: 'If you discover any unauthorized use of your account, please notify us immediately',
        acc3: 'We are not responsible for losses resulting from your failure to protect your account',
        privacy: '7. Privacy Protection',
        privacyText: 'Your privacy is important to us. Please review our <a href="/privacy-policy">Privacy Policy</a> to understand how we collect, use, and protect your personal information.',
        law: '8. Applicable Law',
        lawText: 'These terms are governed by the laws of your country/region. If any dispute arises from using the Service, it should be resolved through consultation.',
        modification: '9. Terms Modification',
        mod1: 'We reserve the right to modify these terms at any time',
        mod2: 'Modified terms will be posted on this page',
        mod3: 'Continued use of the Service indicates your acceptance of the modified terms',
        mod4: 'Significant changes will be notified through the website',
        termination: '10. Service Termination',
        term1: 'If you violate these terms, we have the right to suspend or terminate your right to use the Service',
        term2: 'You may stop using the Service at any time',
        term3: 'Some terms will continue to be effective after service termination',
        forceMajeure: '11. Force Majeure',
        forceText: 'We are not liable for service interruptions or delays caused by force majeure events, including but not limited to natural disasters, wars, government actions, cyber attacks, etc.',
        agreement: '12. Entire Agreement',
        agreementText: 'These terms constitute the entire agreement between you and us regarding the use of the Service. These terms supersede all prior agreements or understandings.',
        severability: '13. Severability',
        severabilityText: 'If any term of these terms is deemed unenforceable or invalid, the remaining terms will remain in full force and effect.',
        contact: '14. Contact Us',
        contactText: 'If you have any questions or concerns about these Terms of Service, please contact us at:',
        email: 'Email: support@iptv-search.com',
        website: 'Website: <a href="https://iptv-search.com">https://iptv-search.com</a>',
        copyright: '&copy; 2024 IPTV Live. All rights reserved.'
      },
      'zh-CN': {
        title: '服务条款',
        lastUpdated: '最后更新日期：2024年1月1日',
        welcome: '欢迎使用 IPTV Live',
        welcomeText: '感谢您使用 IPTV Live 服务（以下简称"本服务"）。通过使用本服务，您同意遵守以下服务条款。如果您不同意这些条款，请不要使用本服务。',
        serviceDesc: '1. 服务说明',
        serviceContent: '1.1 服务内容：',
        content1: 'IPTV Live 提供免费的在线电视观看服务',
        content2: '服务包括频道列表、搜索、收藏、播放历史等功能',
        content3: '用户可以通过网页浏览器访问本服务',
        serviceNature: '1.2 服务性质：',
        nature1: '本服务为免费服务，不收取任何费用',
        nature2: '我们保留随时修改、暂停或终止服务的权利',
        nature3: '服务的可用性可能受到网络状况和技术限制的影响',
        userResp: '2. 用户责任',
        userReq: '2.1 使用要求：',
        req1: '您必须年满13岁才能使用本服务',
        req2: '您有责任确保您的账户安全',
        req3: '您不得共享您的账户信息或凭据',
        prohibited: '2.2 禁止行为：',
        proh1: '不得将本服务用于任何非法目的',
        proh2: '不得干扰或破坏本服务的正常运行',
        proh3: '不得上传病毒、恶意代码或其他有害软件',
        proh4: '不得尝试未经授权访问我们的系统或数据',
        proh5: '不得侵犯他人的知识产权或隐私权',
        proh6: '不得使用自动化工具（如机器人、爬虫）访问本服务',
        copyright: '3. 内容版权',
        disclaimer: '<strong>重要声明：</strong> IPTV Live 仅作为内容聚合平台，提供频道链接服务。本平台不拥有、不制作、不存储任何视频内容。所有频道的版权属于其各自的所有者。',
        ip: '3.1 知识产权：',
        ip1: '本网站的界面、设计、文本、图形等受版权保护',
        ip2: '未经许可，不得复制、修改、分发本网站的内容',
        ip3: '频道内容的知识产权属于其原始所有者',
        userContent: '3.2 用户内容：',
        uc1: '您对提交的内容保留所有权',
        uc2: '通过使用本服务，您授予我们展示和使用相关内容的权利',
        uc3: '您保证拥有所有必要权利来提交这些内容',
        liability: '4. 免责声明',
        asIs: '4.1 服务按"现状"提供：',
        asIs1: '本服务按"现状"和"可用"基础提供',
        asIs2: '我们不对服务的准确性、可靠性或完整性做出任何保证',
        asIs3: '我们不保证服务不会中断或无错误',
        indirect: '4.2 间接损失：',
        indirectText: '在任何情况下，我们都不对任何间接、偶然、特殊或后果性损害承担责任，包括但不限于利润损失、数据丢失或业务中断。',
        thirdParty: '4.3 第三方内容：',
        tp1: '我们不对第三方提供的内容或服务承担责任',
        tp2: '频道内容的质量、可用性和准确性由内容提供者负责',
        tp3: '我们不对频道的版权问题负责',
        interruption: '5. 服务中断',
        int1: '我们保留随时修改、暂停或终止全部或部分服务的权利',
        int2: '服务中断可能发生在系统维护、升级或不可抗力情况下',
        int3: '我们不对服务中断造成的损失承担责任',
        account: '6. 账户与安全',
        acc1: '您对使用您账户的所有活动负责',
        acc2: '如发现任何未经授权使用您账户的情况，请立即通知我们',
        acc3: '我们不对因用户未能保护其账户而造成的损失负责',
        privacy: '7. 隐私保护',
        privacyText: '您的隐私对我们很重要。请查看我们的<a href="/privacy-policy">隐私政策</a>，了解我们如何收集、使用和保护您的个人信息。',
        law: '8. 适用法律',
        lawText: '本条款受您所在国家/地区的法律管辖。如果因使用本服务产生任何争议，应通过协商解决。',
        modification: '9. 条款修改',
        mod1: '我们保留随时修改这些条款的权利',
        mod2: '修改后的条款将在本页面发布',
        mod3: '继续使用本服务即表示您接受修改后的条款',
        mod4: '重大变更将通过网站通知您',
        termination: '10. 终止服务',
        term1: '如果您违反这些条款，我们有权暂停或终止您使用本服务的权利',
        term2: '您可以随时停止使用本服务',
        term3: '服务终止后，某些条款仍将继续有效',
        forceMajeure: '11. 不可抗力',
        forceText: '我们不对因不可抗力事件导致的服务中断或延迟承担责任，包括但不限于自然灾害、战争、政府行为、网络攻击等。',
        agreement: '12. 完整协议',
        agreementText: '这些条款构成您与我们之间关于使用本服务的完整协议。这些条款取代所有先前的协议或谅解。',
        severability: '13. 可分割性',
        severabilityText: '如果这些条款的任何条款被认定为不可执行或无效，其余条款仍将保持完全有效和可执行。',
        contact: '14. 联系我们',
        contactText: '如果您对本服务条款有任何问题或疑虑，请通过以下方式联系我们：',
        email: '电子邮件：support@iptv-search.com',
        website: '网站：<a href="https://iptv-search.com">https://iptv-search.com</a>',
        copyright: '&copy; 2024 IPTV Live. 保留所有权利。'
      }
    };

    let currentLang = localStorage.getItem('terms_lang') || 'en';

    function toggleLangMenu() {
      const menu = document.getElementById('langMenu');
      menu.classList.toggle('show');
    }

    function setLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('terms_lang', lang);

      // Update button states
      document.getElementById('langEn').classList.toggle('active', lang === 'en');
      document.getElementById('langZh').classList.toggle('active', lang === 'zh-CN');

      // Update current language button
      const langNames = { 'en': 'English', 'zh-CN': '简体' };
      document.getElementById('currentLangBtn').textContent = langNames[lang] || 'English';

      // Close menu
      document.getElementById('langMenu').classList.remove('show');

      // Update HTML lang attribute
      document.documentElement.lang = lang;

      // Update all elements with data-i18n
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (termsTranslations[lang] && termsTranslations[lang][key]) {
          el.innerHTML = termsTranslations[lang][key];
        }
      });

      // Update document title
      document.title = termsTranslations[lang].title + ' - IPTV Live';
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
      setLanguage(currentLang);

      // Close language menu when clicking outside
      document.addEventListener('click', function(e) {
        const dropdown = document.querySelector('.lang-dropdown');
        if (!dropdown.contains(e.target)) {
          document.getElementById('langMenu').classList.remove('show');
        }
      });
    });
  </script>
</body>
</html>`;
}
