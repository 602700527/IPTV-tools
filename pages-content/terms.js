// 静态页面内容模块
export const pageTitle = 'Terms of Service';
export const pageDescription = 'IPTV Search Terms of Service';

export const styles = `
  .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
  h1 { font-size: 28px; margin-bottom: 20px; color: #e50914; }
  h2 { font-size: 22px; margin: 30px 0 15px; color: #fff; }
  h3 { font-size: 18px; margin: 20px 0 10px; color: rgba(255,255,255,0.9); }
  p { margin-bottom: 15px; color: rgba(255,255,255,0.8); }
  ul { margin-bottom: 15px; padding-left: 30px; color: rgba(255,255,255,0.8); }
  li { margin-bottom: 8px; }
  .section { background: #141414; padding: 25px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); }
  .last-updated { color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 20px; }
  a { color: #e50914; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .warning { background: rgba(231,9,20,0.1); border-left: 4px solid #e50914; padding: 15px; margin: 15px 0; }
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
  </div>

  <div class="section">
    <h2>4. Disclaimer</h2>
    <h3>4.1 Service provided "as is":</h3>
    <ul>
      <li>This Service is provided on an "as is" and "as available" basis</li>
      <li>We make no warranties regarding the accuracy, reliability, or completeness of the Service</li>
      <li>We do not guarantee that the Service will be uninterrupted or error-free</li>
    </ul>
  </div>

  <div class="section">
    <h2>5. Privacy Protection</h2>
    <p>Your privacy is important to us. Please view our <a href="/privacy-policy">Privacy Policy</a> to learn how we collect, use, and protect your personal information.</p>
  </div>

  <div class="section">
    <h2>6. Contact Us</h2>
    <p>If you have any questions or concerns about these Terms of Service, please contact us at:</p>
    <ul>
      <li>Email: support@iptv-search.com</li>
      <li>Website: <a href="https://iptv-search.com">https://iptv-search.com</a></li>
    </ul>
  </div>
</div>
`;