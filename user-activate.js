// 用户卡密激活页面内容
export const USER_ACTIVATE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Activation - TV Live Service</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:15px}
    .container{background:white;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:30px;max-width:480px;width:100%;position:relative}
    .logo{text-align:center;margin-bottom:25px}
    .logo h1{font-size:24px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
    .logo p{color:#86868b;font-size:13px}
    .lang-switch{position:absolute;top:20px;right:20px;z-index:10}
    .lang-dropdown{position:relative;display:inline-block}
    .lang-btn{background:#667eea;color:white;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:background .2s;display:flex;align-items:center;gap:6px;-webkit-tap-highlight-color:transparent}
    .lang-btn:hover{background:#764ba2}
    .lang-btn:after{content:"▼";font-size:9px}
    .lang-menu{display:none;position:absolute;top:calc(100%+8px);right:0;background:white;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.15);min-width:120px;overflow:hidden;animation:fadeIn .2s ease}
    .lang-menu.show{display:block}
    .lang-menu button{display:block;width:100%;padding:10px 16px;background:none;border:none;text-align:left;font-size:13px;color:#1d1d1f;cursor:pointer;transition:background .2s}
    .lang-menu button:hover{background:#f5f5f7}
    .lang-menu button.active{background:#667eea;color:white}
    @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
    .form-group{margin-bottom:18px}
    .form-group label{display:block;margin-bottom:6px;font-weight:500;color:#1d1d1f;font-size:14px}
    .form-group input{width:100%;padding:12px 14px;border:2px solid #e5e5ea;border-radius:8px;font-size:16px;transition:border-color .2s;letter-spacing:1px;-webkit-appearance:none;height:44px}
    .form-group input:focus{outline:none;border-color:#667eea}
    .btn{width:100%;padding:14px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:transform .2s,box-shadow .2s;-webkit-tap-highlight-color:transparent}
    .btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(102,126,234,.4)}
    .btn:active{transform:translateY(0);scale:.98}
    .btn:disabled{background:#d2d2d7;cursor:not-allowed;transform:none;scale:1}
    .error{color:#ff3b30;text-align:center;margin-bottom:12px;font-size:14px;display:none;padding:12px;background:#ffebee;border-radius:8px}
    .success{color:#34c759;text-align:center;margin-bottom:12px;font-size:14px;display:none;padding:12px;background:#e8f5e9;border-radius:8px}
    .result{display:none;margin-top:25px;padding:20px;background:#f5f5f7;border-radius:12px}
    .result.active{display:block}
    .result h3{font-size:16px;font-weight:600;margin-bottom:14px;color:#1d1d1f}
    .info-item{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e5e5ea}
    .info-item:last-child{border-bottom:none}
    .info-label{color:#86868b;font-size:13px}
    .info-value{color:#1d1d1f;font-weight:500;font-size:13px}
    .sub-url-container{margin-top:14px;padding:14px;background:#667eea;border-radius:8px}
    .sub-url-label{color:white;font-size:11px;margin-bottom:6px}
    .sub-url{color:white;font-size:12px;font-weight:600;word-break:break-all;line-height:1.6;cursor:pointer}
    .sub-url:hover{opacity:.9}
    .copy-btn{width:100%;margin-top:14px;padding:12px;background:#0071e3;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;-webkit-tap-highlight-color:transparent}
    .copy-btn:hover{background:#0077ed}
    .copy-btn:active{scale:.98}
    .instructions{margin-top:16px;padding:14px;background:#fff3e0;border-radius:8px;border-left:4px solid #ff9800}
    .instructions h4{color:#e65100;margin-bottom:10px;font-size:13px}
    .instructions ul{list-style:none;padding:0}
    .instructions li{padding:5px 0;color:#86868b;font-size:12px;line-height:1.5}
    .instructions li:before{content:"✓";color:#ff9800;margin-right:6px;font-weight:bold}
    .instructions.warning li:before{content:"⚠️";margin-right:6px}
    .loading{display:none;text-align:center;padding:20px}
    .loading.active{display:block}
    .spinner{width:40px;height:40px;border:3px solid #e5e5ea;border-top-color:#667eea;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-top:12px;color:#86868b;font-size:14px}
    .captcha-container{display:flex;gap:10px;align-items:center}
    .captcha-input{flex:1;padding:0 12px;border:2px solid #e5e5ea;border-radius:8px;font-size:16px;text-align:center;letter-spacing:3px;-webkit-appearance:none;transition:border-color .2s;height:44px}
    .captcha-input:focus{outline:none;border-color:#667eea}
    .captcha-canvas{width:100px;height:44px;border:2px solid #e5e5ea;border-radius:8px;cursor:pointer;flex-shrink:0}
    .captcha-refresh{padding:8px 12px;background:#f5f5f7;border:2px solid #e5e5ea;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;transition:background .2s;-webkit-tap-highlight-color:transparent;height:44px;white-space:nowrap;flex-shrink:0;min-width:60px}
    .captcha-refresh:hover{background:#e5e5ea}
    @media (max-width:480px){
      body{padding:10px}
      .container{padding:20px;border-radius:12px;padding-top:50px}
      .logo h1{font-size:20px}
      .logo p{font-size:12px}
    .lang-switch{top:15px;right:15px}
    .lang-btn{padding:6px 14px;font-size:12px}
    .lang-menu button{padding:8px 12px;font-size:12px}
      .form-group input{font-size:16px;padding:11px 13px}
      .btn{padding:13px;font-size:15px}
      .result{padding:16px}
      .info-item{padding:8px 0}
      .info-label,.info-value{font-size:12px}
      .sub-url-container{padding:12px}
      .sub-url{font-size:11px}
      .instructions{padding:12px}
      .instructions h4{font-size:12px}
      .instructions li{font-size:11px;padding:4px 0}
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="lang-switch">
      <div class="lang-dropdown">
        <button class="lang-btn" onclick="toggleLangMenu()" id="currentLangBtn">EN</button>
        <div class="lang-menu" id="langMenu">
          <button onclick="setLanguage('en')" id="langEn">English</button>
          <button onclick="setLanguage('zh-CN')" id="langZh">简体中文</button>
        </div>
      </div>
    </div>
    <div class="logo">
      <h1 data-i18n="title">📺 TV Live Service</h1>
      <p data-i18n="subtitle">Activate your code to get subscription URL</p>
    </div>

    <div id="errorBox" class="error"></div>
    <div id="successBox" class="success"></div>

    <div class="form-group">
      <label for="code" data-i18n="enterCode">Enter activation code</label>
      <input type="text" id="code" data-i18n-placeholder="codePlaceholder" placeholder="Enter your activation code" autocomplete="off">
    </div>

    <div class="form-group">
      <label for="captchaInput" data-i18n="captchaLabel">Verification Code</label>
      <div class="captcha-container">
        <input type="text" id="captchaInput" placeholder="" maxlength="6">
        <canvas id="captchaCanvas" width="100" height="44" onclick="refreshCaptcha()"></canvas>
        <button class="captcha-refresh" onclick="refreshCaptcha()" data-i18n="refreshCaptcha">Refresh</button>
      </div>
    </div>

    <button id="activateBtn" class="btn" onclick="activateCode()" data-i18n="activate">Activate Now</button>

    <div id="loading" class="loading">
      <div class="spinner"></div>
      <p class="loading-text" data-i18n="activating">Activating...</p>
    </div>

    <div id="result" class="result">
      <h3 data-i18n="success">✅ Activation Successful</h3>
      <div class="info-item">
        <span class="info-label" data-i18n="codeLabel">Code</span>
        <span class="info-value" id="resultCode">-</span>
      </div>
      <div class="info-item">
        <span class="info-label" data-i18n="durationLabel">Validity</span>
        <span class="info-value" id="resultDuration">-</span>
      </div>
      <div class="info-item">
        <span class="info-label" data-i18n="expiresLabel">Expires</span>
        <span class="info-value" id="resultExpired">-</span>
      </div>

      <div class="sub-url-container">
        <div class="sub-url-label" data-i18n="subUrlLabel">Subscription URL (click to copy)</div>
        <div class="sub-url" id="subUrl" onclick="copySubUrl()">-</div>
      </div>

      <button class="copy-btn" onclick="copySubUrl()" data-i18n="copyUrl">Copy Subscription URL</button>

      <div class="instructions">
        <h4 data-i18n="instructions">📱 Usage Instructions</h4>
        <ul>
          <li data-i18n="instr1">Add subscription URL to your player</li>
          <li data-i18n="instr2">Supports IPTV, PotPlayer and other players</li>
          <li data-i18n="instr3">Supports various TV boxes</li>
          <li data-i18n="instr4">Regularly update subscription list recommended</li>
          <li data-i18n="instr5">Do not use software to test playlist, may trigger system defense</li>
        </ul>
      </div>
      <div class="instructions warning" style="margin-top: 12px; background: #fff3e0; border-left-color: #ff9800;">
        <h4 data-i18n="ipRestrictions" style="color: #e65100;">⚠️ Important Notice</h4>
        <ul>
          <li data-i18n="instr6">Sharing subscription or playback URLs will trigger IP limit detection</li>
          <li data-i18n="instr7">Abuse or sharing may result in code being banned or disabled</li>
          <li data-i18n="instr8">NEVER share your subscription URL or playback URL with others</li>
          <li data-i18n="instr9">Your IP address is logged for security and anti-abuse</li>
        </ul>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = '/api/activate';

    let captchaCode = '';

    const translations = {
      'en': {
        title: '📺 TV Live Service',
        subtitle: 'Activate your code to get subscription URL',
        enterCode: 'Enter activation code',
        codePlaceholder: 'Enter your activation code',
        activate: 'Activate Now',
        activating: 'Activating...',
        success: '✅ Activation Successful',
        codeLabel: 'Code',
        durationLabel: 'Validity',
        expiresLabel: 'Expires',
        subUrlLabel: 'Subscription URL (click to copy)',
        copyUrl: 'Copy Subscription URL',
        instructions: '📱 Usage Instructions',
        instr1: 'Add subscription URL to your player',
        instr2: 'Supports IPTV, PotPlayer and other players',
        instr3: 'Supports various TV boxes',
        instr4: 'Regularly update subscription list recommended',
        instr5: 'Do not use software to test playlist, may trigger system defense',
        ipRestrictions: '⚠️ Important Notice',
        instr6: 'Sharing subscription or playback URLs will trigger IP limit detection',
        instr7: 'Abuse or sharing may result in code being banned or disabled',
        instr8: 'NEVER share your subscription URL or playback URL with others',
        instr9: 'Your IP address is logged for security and anti-abuse',
        enterCodeError: 'Please enter activation code',
        successMsg: 'Code activated successfully!',
        failMsg: 'Activation failed, please check if code is correct',
        networkError: 'Network error, please try again later',
        copiedMsg: 'Subscription URL copied to clipboard',
        days: ' days',
        maxIPs: '3',
        captchaLabel: 'Verification Code',
        refreshCaptcha: 'Refresh',
        captchaError: 'Please enter verification code',
        invalidCaptcha: 'Invalid verification code'
      },
      'zh-CN': {
        title: '📺 电视直播服务',
        subtitle: '卡密激活获取订阅地址',
        enterCode: '请输入卡密',
        codePlaceholder: '输入您的卡密',
        activate: '立即激活',
        activating: '正在激活...',
        success: '✅ 激活成功',
        codeLabel: '卡密',
        durationLabel: '有效期',
        expiresLabel: '过期时间',
        subUrlLabel: '订阅地址（点击复制）',
        copyUrl: '复制订阅地址',
        instructions: '📱 使用说明',
        instr1: '将订阅地址添加到播放器',
        instr2: '支持IPTV、PotPlayer等播放器',
        instr3: '支持各类电视盒子',
        instr4: '建议定期更新订阅列表',
        instr5: '请勿使用软件对播放列表测试，否则可能触发系统防御',
        ipRestrictions: '⚠️ 重要提示',
        instr6: '分享订阅地址或播放地址会触发IP限制检测',
        instr7: '滥用或分享会导致卡密被禁用或封禁',
        instr8: '切勿将您的订阅地址或播放地址分享给他人',
        instr9: '您的IP地址会被记录用于安全验证和防止滥用',
        enterCodeError: '请输入卡密',
        successMsg: '卡密激活成功！',
        failMsg: '激活失败，请检查卡密是否正确',
        networkError: '网络错误，请稍后重试',
        copiedMsg: '订阅地址已复制到剪贴板',
        days: ' 天',
        maxIPs: '3',
        captchaLabel: '验证码',
        refreshCaptcha: '刷新',
        captchaError: '请输入验证码',
        invalidCaptcha: '验证码错误'
      }
    };

    let currentLang = localStorage.getItem('activate_lang') || 'en';

    function t(key) {
      return translations[currentLang][key] || translations['en'][key] || key;
    }

    function toggleLangMenu() {
      const menu = document.getElementById('langMenu');
      menu.classList.toggle('show');
    }

    function setLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('activate_lang', lang);

      // Update button states
      document.getElementById('langEn').classList.toggle('active', lang === 'en');
      document.getElementById('langZh').classList.toggle('active', lang === 'zh-CN');

      // Update current language button
      const langNames = { 'en': 'EN', 'zh-CN': '简体' };
      document.getElementById('currentLangBtn').textContent = langNames[lang] || 'EN';

      // Close menu
      document.getElementById('langMenu').classList.remove('show');

      // Update HTML lang attribute
      document.documentElement.lang = lang;

      // Update document title
      document.title = lang === 'en' ? 'Activation - TV Live Service' : '卡密激活 - 电视直播服务';

      // Update all elements with data-i18n
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        let text = t(key);
        // Replace {maxIPs} placeholder with actual value
        if (text && text.includes('{maxIPs}')) {
          text = text.replace('{maxIPs}', t('maxIPs'));
        }
        el.textContent = text;
      });

      // Update placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
      });
    }

    function showError(message) {
      const errorBox = document.getElementById('errorBox');
      const successBox = document.getElementById('successBox');
      errorBox.textContent = message;
      errorBox.style.display = 'block';
      successBox.style.display = 'none';
      setTimeout(() => {
        errorBox.style.display = 'none';
      }, 5000);
    }

    function showSuccess(message) {
      const errorBox = document.getElementById('errorBox');
      const successBox = document.getElementById('successBox');
      successBox.textContent = message;
      successBox.style.display = 'block';
      errorBox.style.display = 'none';
      setTimeout(() => {
        successBox.style.display = 'none';
      }, 5000);
    }

    function showLoading(show) {
      const loading = document.getElementById('loading');
      const btn = document.getElementById('activateBtn');
      if (show) {
        loading.classList.add('active');
        btn.disabled = true;
      } else {
        loading.classList.remove('active');
        btn.disabled = false;
      }
    }

    async function activateCode() {
      const code = document.getElementById('code').value.trim();
      const captchaInput = document.getElementById('captchaInput').value.trim();

      if (!code) {
        showError(t('enterCodeError'));
        return;
      }

      if (!captchaInput) {
        showError(t('captchaError'));
        return;
      }

      if (captchaInput !== captchaCode) {
        showError(t('invalidCaptcha'));
        refreshCaptcha();
        return;
      }

      showLoading(true);
      document.getElementById('result').classList.remove('active');

      try {
        const response = await fetch(API_BASE + '?code=' + encodeURIComponent(code), {
          method: 'POST'
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess(t('successMsg'));
          showResult(code, data);
          refreshCaptcha();
        } else {
          showError(data.error || t('failMsg'));
          refreshCaptcha();
        }
      } catch (error) {
        console.error('Activation failed:', error);
        showError(t('networkError'));
        refreshCaptcha();
      } finally {
        showLoading(false);
      }
    }

    function showResult(code, data) {
      const result = document.getElementById('result');
      const now = new Date();
      const expiredAt = new Date(data.expired_at);
      const durationDays = Math.ceil((expiredAt - now) / (1000 * 60 * 60 * 24));

      document.getElementById('resultCode').textContent = code;
      document.getElementById('resultDuration').textContent = durationDays + t('days');
      document.getElementById('resultExpired').textContent = expiredAt.toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US');

      const host = window.location.origin;
      const subUrl = host + '/sub/' + code + '.m3u';
      document.getElementById('subUrl').textContent = subUrl;

      result.classList.add('active');
    }

    function copySubUrl() {
      const subUrl = document.getElementById('subUrl').textContent;
      if (subUrl && subUrl !== '-') {
        navigator.clipboard.writeText(subUrl).then(() => {
          showSuccess(t('copiedMsg'));
        }).catch(err => {
          const textarea = document.createElement('textarea');
          textarea.value = subUrl;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showSuccess(t('copiedMsg'));
        });
      }
    }

    function refreshCaptcha() {
      const canvas = document.getElementById('captchaCanvas');
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#f5f5f7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 只使用大写字母和数字，移除易混淆字符
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      captchaCode = '';
      for (let i = 0; i < 4; i++) {
        captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      ctx.font = 'bold 28px Arial';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < captchaCode.length; i++) {
        // 使用深色高对比度颜色
        const colors = [
          '#1a1a1a', '#2d3748', '#1a365d', '#742a2a', '#1c4532', '#553c9a', '#744210', '#285e61'
        ];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        const x = 20 + i * 22;
        const y = 22;
        // 极小的旋转角度，几乎不旋转
        const angle = (Math.random() - 0.5) * 0.05;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(captchaCode[i], 0, 0);
        ctx.restore();
      }

      // 添加 5 条干扰线
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      // 添加少量弯曲干扰线
      for (let i = 0; i < 2; i++) {
        ctx.strokeStyle = 'rgba(180, 180, 180, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.bezierCurveTo(
          Math.random() * canvas.width, Math.random() * canvas.height,
          Math.random() * canvas.width, Math.random() * canvas.height,
          Math.random() * canvas.width, Math.random() * canvas.height
        );
        ctx.stroke();
      }

      // 添加干扰点
      for (let i = 0; i < 15; i++) {
        ctx.fillStyle = 'rgba(180, 180, 180, 0.5)';
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      document.getElementById('captchaInput').value = '';
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
      setLanguage(currentLang);
      refreshCaptcha();

      // Support Enter key activation
      document.getElementById('code').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          activateCode();
        }
      });

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
