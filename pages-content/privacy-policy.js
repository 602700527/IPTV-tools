// 静态页面内容模块
export const pageTitle = 'Privacy Policy';
export const pageDescription = 'IPTV Search Privacy Policy';

export const styles = `
  :root {
    --bg-primary: #0a0a0a;
    --bg-card: #141414;
    --text-primary: #ffffff;
    --text-secondary: rgba(255,255,255,0.8);
    --text-muted: rgba(255,255,255,0.5);
    --border: rgba(255,255,255,0.1);
    --accent: #e50914;
  }
  .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
  h1 { font-size: 28px; margin-bottom: 20px; color: var(--accent); }
  h2 { font-size: 22px; margin: 30px 0 15px; color: var(--text-primary); }
  h3 { font-size: 18px; margin: 20px 0 10px; color: var(--text-primary); }
  p { margin-bottom: 15px; color: var(--text-secondary); }
  ul { margin-bottom: 15px; padding-left: 30px; color: var(--text-secondary); }
  li { margin-bottom: 8px; }
  .section { background: var(--bg-card); padding: 25px; border-radius: 0; margin-bottom: 20px; border: 1px solid var(--border); }
  .last-updated { color: var(--text-muted); font-size: 14px; margin-bottom: 20px; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  @media (max-width: 768px) {
    .container { padding: 30px 15px; }
    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
    .section { padding: 20px; }
  }
  @media (max-width: 480px) {
    .container { padding: 20px 10px; }
    h1 { font-size: 20px; }
    h2 { font-size: 18px; }
    .section { padding: 15px; }
  }
`;

export const content = `
<div class="container">
  <h1>Privacy Policy</h1>
  <p class="last-updated">Last updated: January 1, 2024</p>

  <div class="section">
    <h2>Introduction</h2>
    <p>IPTV Search ("we" or "us") respects and protects your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information. By using our service, you agree to the terms of this policy.</p>
  </div>

  <div class="section">
    <h2>1. Information Collection</h2>
    <h3>1.1 Types of information we collect:</h3>
    <ul>
      <li><strong>Browsing information:</strong> Your IP address, browser type, device information, access time, and page view records</li>
      <li><strong>Usage information:</strong> Search history, favorites, and channel browsing records (stored locally)</li>
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
      <li>Your favorites and browsing history are stored in your browser's localStorage and are not uploaded to our servers</li>
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
`;