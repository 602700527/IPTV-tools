import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';

// 生成网站地图 XML（支持多语言hreflang）
export function generateSitemap(origin) {
  const currentDate = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${origin}/" />
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${origin}/?lang=zh-CN" />
    <xhtml:link rel="alternate" hreflang="zh-TW" href="${origin}/?lang=zh-TW" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/" />
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
export function generatePrivacyPolicy(origin = 'https://iptv-search.com') {
  const pageUrl = `${origin}/privacy-policy`;
  const pageTitle = 'Privacy Policy - IPTV Live';
  const metaDescription = 'IPTV Live respects and protects your privacy. Learn how we collect, use, store, and protect your personal information when you use our IPTV streaming service.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${pageUrl}">
  <link rel="alternate" hreflang="en" href="${pageUrl}">
  <link rel="alternate" hreflang="x-default" href="${pageUrl}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${origin}/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="IPTV Live">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${metaDescription}">
  <meta name="twitter:image" content="${origin}/og-homepage.png">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6;padding:0;display:flex;flex-direction:column;min-height:100vh}
    .main-content{flex:1;padding-top:70px}
    .container{max-width:900px;margin:0 auto;padding:40px 20px}
    h1{font-size:28px;margin-bottom:20px;color:#e50914}
    h2{font-size:22px;margin:30px 0 15px;color:#fff}
    h3{font-size:18px;margin:20px 0 10px;color:rgba(255,255,255,.9)}
    p{margin-bottom:15px;color:rgba(255,255,255,.8)}
    ul{margin-bottom:15px;padding-left:30px;color:rgba(255,255,255,.8)}
    li{margin-bottom:8px}
    .section{background:#141414;padding:25px;border-radius:8px;margin-bottom:20px;border:1px solid rgba(255,255,255,0.1)}
    .last-updated{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:20px}
    a{color:#e50914;text-decoration:none}
    a:hover{text-decoration:underline}
    @media (max-width:768px){
      .main-content{padding-top:60px}
      .container{padding:30px 15px}
      h1{font-size:24px}
      h2{font-size:20px}
      .section{padding:20px}
    }
    @media (max-width:480px){
      .main-content{padding-top:50px}
      .container{padding:20px 10px}
      h1{font-size:20px}
      h2{font-size:18px}
      .section{padding:15px}
    }
  </style>
</head>
<body>
${PAGE_HEADER}
  <div class="main-content">
    <div class="container">
      <h1>Privacy Policy</h1>
      <p class="last-updated">Last updated: January 1, 2024</p>

      <div class="section">
        <h2>Introduction</h2>
        <p>IPTV Live ("we" or "us") respects and protects your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information. By using our service, you agree to the terms of this policy.</p>
      </div>

      <div class="section">
        <h2>1. Information Collection</h2>
        <h3>1.1 Types of information we collect:</h3>
        <ul>
          <li><strong>Browsing information:</strong> Your IP address, browser type, device information, access time, and page view records</li>
          <li><strong>Usage information:</strong> Channels you watch, search history, favorites, and playback history (stored locally)</li>
          <li><strong>Technical information:</strong> Cookies, web beacons, and other tracking technologies</li>
        </ul>

        <h3>1.2 How we collect information:</h3>
        <ul>
          <li>Automatic collection: Through browser and server logs</li>
          <li>Local storage: Browser localStorage for user preferences and history</li>
        </ul>
      </div>

      <div class="section">
        <h2>2. Information Use</h2>
        <p>We use the collected information for:</p>
        <ul>
          <li>Providing, maintaining, and improving our services</li>
          <li>Analyzing user usage to optimize experience</li>
          <li>Preventing fraud, abuse, and security threats</li>
          <li>Complying with legal requirements and regulatory obligations</li>
        </ul>
      </div>

      <div class="section">
        <h2>3. Information Storage</h2>
        <ul>
          <li>Your viewing history and favorites are stored in your browser's localStorage and are not uploaded to our servers</li>
          <li>Server logs may contain IP addresses but are not linked to personal identity</li>
          <li>Data is protected with industry-standard security measures</li>
        </ul>
      </div>

      <div class="section">
        <h2>4. Information Sharing</h2>
        <p>We do not sell, rent, or trade your personal information. However, we may share information in the following circumstances:</p>
        <ul>
          <li><strong>Service providers:</strong> Sharing necessary information with third parties who help us provide services (such as Cloudflare)</li>
          <li><strong>Legal requirements:</strong> Responding to legal requests, court orders, or government investigations</li>
          <li><strong>Business transfers:</strong> In case of merger, acquisition, or asset transfer</li>

        </ul>
      </div>

      <div class="section">
        <h2>5. Cookies</h2>
        <p>We use cookies and similar technologies to:</p>
        <ul>
          <li>Remember your language preferences and settings</li>
          <li>Analyze website traffic and usage patterns</li>
          <li>Provide personalized content</li>
        </ul>
        <p>You can disable cookies through your browser settings, but this may affect some features of the website.</p>
      </div>

      <div class="section">
        <h2>6. Third-Party Links</h2>
        <p>Our website may contain links to third-party websites. We are not responsible for the privacy policies or practices of these third-party websites. We recommend that you review the privacy policies of these websites.</p>
      </div>

      <div class="section">
        <h2>7. Data Security</h2>
        <p>We take appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. However, no internet transmission or storage method is 100% secure.</p>
      </div>

      <div class="section">
        <h2>8. Your Rights</h2>
        <p>Under applicable data protection laws, you may have the following rights:</p>
        <ul>
          <li>Access and obtain a copy of your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your personal information</li>
          <li>Object to or restrict certain processing activities</li>
          <li>Data portability</li>
        </ul>
      </div>

      <div class="section">
        <h2>9. Children's Privacy</h2>
        <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover that such information has been collected, we will delete it immediately.</p>
      </div>

      <div class="section">
        <h2>10. International Data Transfer</h2>
        <p>Your information may be transferred to and processed in countries or regions outside your country or region. The data protection laws in those countries/regions may differ from those in your jurisdiction.</p>
      </div>

      <div class="section">
        <h2>11. Policy Changes</h2>
        <p>We may update this Privacy Policy from time to time. The updated policy will be posted on this page, and the "Last Updated" date will be changed. For significant changes, we will notify you through the website.</p>
      </div>

      <div class="section">
        <h2>12. Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
        <ul>
          <li>Email: support@iptv-search.com</li>
          <li>Website: <a href="https://iptv-search.com">https://iptv-search.com</a></li>
        </ul>
      </div>
    </div>
  </div>

${PAGE_FOOTER}
</body>
</html>
`;
}

  // 生成服务条款页面
  export function generateTermsOfService(origin = 'https://iptv-search.com') {
  const pageUrl = `${origin}/terms`;
  const pageTitle = 'Terms of Service - IPTV Live';
  const metaDescription = 'Read the Terms of Service for IPTV Live. Learn the rules, disclaimers, and conditions for using our free IPTV streaming service.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${pageUrl}">
  <link rel="alternate" hreflang="en" href="${pageUrl}">
  <link rel="alternate" hreflang="x-default" href="${pageUrl}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${origin}/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="IPTV Live">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${metaDescription}">
  <meta name="twitter:image" content="${origin}/og-homepage.png">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6;padding:0;display:flex;flex-direction:column;min-height:100vh}
    .main-content{flex:1;padding-top:70px}
    .container{max-width:900px;margin:0 auto;padding:40px 20px}
    h1{font-size:28px;margin-bottom:20px;color:#e50914}
    h2{font-size:22px;margin:30px 0 15px;color:#fff}
    h3{font-size:18px;margin:20px 0 10px;color:rgba(255,255,255,.9)}
    p{margin-bottom:15px;color:rgba(255,255,255,.8)}
    ul{margin-bottom:15px;padding-left:30px;color:rgba(255,255,255,.8)}
    li{margin-bottom:8px}
    .section{background:#141414;padding:25px;border-radius:8px;margin-bottom:20px;border:1px solid rgba(255,255,255,0.1)}
    .last-updated{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:20px}
    a{color:#e50914;text-decoration:none}
    a:hover{text-decoration:underline}
    .warning{background:rgba(231,9,20,.1);border-left:4px solid #e50914;padding:15px;margin:15px 0}
    @media (max-width:768px){
      .main-content{padding-top:60px}
      .container{padding:30px 15px}
      h1{font-size:24px}
      h2{font-size:20px}
      .section{padding:20px}
    }
    @media (max-width:480px){
      .main-content{padding-top:50px}
      .container{padding:20px 10px}
      h1{font-size:20px}
      h2{font-size:18px}
      .section{padding:15px}
    }
  </style>
</head>
<body>
${PAGE_HEADER}
  <div class="main-content">
    <div class="container">
      <h1>Terms of Service</h1>
      <p class="last-updated">Last updated: January 1, 2024</p>

      <div class="section">
        <h2>Welcome to IPTV Live</h2>
        <p>Thank you for using IPTV Live service (the "Service"). By using this Service, you agree to comply with the following Terms of Service. If you do not agree to these terms, please do not use this Service.</p>
      </div>

      <div class="section">
        <h2>1. Service Description</h2>
        <h3>1.1 Service content:</h3>
        <ul>
          <li>IPTV Live provides free online TV viewing services</li>
          <li>Services include channel list, search, favorites, playback history, and other features</li>
          <li>Users can access the Service through a web browser</li>
        </ul>

        <h3>1.2 Nature of Service:</h3>
        <ul>
          <li>This Service is provided free of charge</li>
          <li>We reserve the right to modify, suspend, or terminate the Service at any time</li>
          <li>Service availability may be affected by network conditions and technical limitations</li>
        </ul>
      </div>

      <div class="section">
        <h2>2. User Responsibilities</h2>
        <h3>2.1 Usage requirements:</h3>
        <ul>
          <li>You must be at least 13 years old to use this Service</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You must not share your account information or credentials</li>
        </ul>

        <h3>2.2 Prohibited activities:</h3>
        <ul>
          <li>Do not use this Service for any illegal purposes</li>
          <li>Do not interfere with or disrupt the operation of this Service</li>
          <li>Do not upload viruses, malicious code, or other harmful software</li>
          <li>Do not attempt to unauthorized access to our systems or data</li>
          <li>Do not infringe on the intellectual property or privacy rights of others</li>
          <li>Do not use automated tools (such as robots or crawlers) to access this Service</li>
        </ul>
      </div>

      <div class="section">
        <h2>3. Content Copyright</h2>
        <div class="warning">
          <strong>Important Notice:</strong>
          <p>IPTV Live is only a content aggregation platform providing channel link services. This platform does not own, produce, or store any video content. All channel content copyright belongs to their respective owners.</p>
        </div>

        <h3>3.1 Intellectual property:</h3>
        <ul>
          <li>The website's interface, design, text, graphics, etc. are protected by copyright</li>
          <li>Without permission, do not copy, modify, or distribute the content of this website</li>
          <li>Intellectual property of channel content belongs to its original owners</li>
        </ul>

        <h3>3.2 User content:</h3>
        <ul>
          <li>You retain ownership of content you submit</li>
          <li>By using this Service, you grant us the right to display and use related content</li>
          <li>You warrant that you have all necessary rights to submit such content</li>
        </ul>
      </div>

      <div class="section">
        <h2>4. Disclaimer</h2>
        <h3>4.1 Service provided "as is":</h3>
        <ul>
          <li>This Service is provided on an "as is" and "as available" basis</li>
          <li>We make no warranties regarding the accuracy, reliability, or completeness of the Service</li>
          <li>We do not guarantee that the Service will be uninterrupted or error-free</li>
        </ul>

        <h3>4.2 Indirect damages:</h3>
        <p>In no event shall we be liable for any indirect, incidental, special, or consequential damages, including but not limited to loss of profits, data loss, or business interruption.</p>

        <h3>4.3 Third-party content:</h3>
        <ul>
          <li>We are not responsible for content or services provided by third parties</li>
          <li>The quality, availability, and accuracy of channel content are the responsibility of content providers</li>
          <li>We are not responsible for channel copyright issues</li>
        </ul>
      </div>

      <div class="section">
        <h2>5. Service Interruption</h2>
        <ul>
          <li>We reserve the right to modify, suspend, or terminate all or part of the Service at any time</li>
          <li>Service interruption may occur during system maintenance, upgrades, or force majeure</li>
          <li>We are not responsible for losses caused by service interruption</li>
        </ul>
      </div>

      <div class="section">
        <h2>6. Account and Security</h2>
        <ul>
          <li>You are responsible for all activities using your account</li>
          <li>If you discover any unauthorized use of your account, please notify us immediately</li>
          <li>We are not responsible for losses caused by your failure to protect your account</li>
        </ul>
      </div>

      <div class="section">
        <h2>7. Privacy Protection</h2>
        <p>Your privacy is important to us. Please view our <a href="/privacy-policy">Privacy Policy</a> to learn how we collect, use, and protect your personal information.</p>
      </div>

      <div class="section">
        <h2>8. Applicable Law</h2>
        <p>These terms shall be governed by the laws of your country/region. Any disputes arising from the use of this Service shall be resolved through negotiation.</p>
      </div>

      <div class="section">
        <h2>9. Terms Modification</h2>
        <ul>
          <li>We reserve the right to modify these terms at any time</li>
          <li>Modified terms will be posted on this page</li>
          <li>Continued use of this Service constitutes acceptance of the modified terms</li>
          <li>Significant changes will be notified through the website</li>
        </ul>
      </div>

      <div class="section">
        <h2>10. Service Termination</h2>
        <ul>
          <li>If you violate these terms, we have the right to suspend or terminate your right to use this Service</li>
          <li>You may stop using this Service at any time</li>
          <li>Some terms will remain valid after Service termination</li>
        </ul>
      </div>

      <div class="section">
        <h2>11. Force Majeure</h2>
        <p>We are not responsible for Service interruption or delays caused by force majeure events, including but not limited to natural disasters, war, government actions, cyber attacks, etc.</p>
      </div>

      <div class="section">
        <h2>12. Entire Agreement</h2>
        <p>These terms constitute the entire agreement between you and us regarding the use of this Service. These terms supersede all prior agreements or understandings.</p>
      </div>

      <div class="section">
        <h2>13. Severability</h2>
        <p>If any provision of these terms is found to be unenforceable or invalid, the remaining provisions will remain fully valid and enforceable.</p>
      </div>

      <div class="section">
        <h2>14. Contact Us</h2>
        <p>If you have any questions or concerns about these Terms of Service, please contact us at:</p>
        <ul>
          <li>Email: support@iptv-search.com</li>
          <li>Website: <a href="https://iptv-search.com">https://iptv-search.com</a></li>
        </ul>
      </div>
    </div>
  </div>

  ${PAGE_FOOTER}
</body>
</html>`;
}

