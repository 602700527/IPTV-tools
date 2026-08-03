// 用户卡密激活页面内容
export const USER_ACTIVATE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Activation - TV Live Service</title>
  <meta name="description" content="Activate your TV Live Service account with your card number. Get started with live TV streaming.">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://iptv-search.com/activate">
  <link rel="alternate" hreflang="zh-CN" href="https://iptv-search.com/activate">
  <link rel="alternate" hreflang="en" href="https://iptv-search.com/activate?lang=en">
  <link rel="alternate" hreflang="x-default" href="https://iptv-search.com/activate?lang=en">
  <meta property="og:title" content="Activation - TV Live Service">
  <meta property="og:description" content="Activate your TV Live Service account with your card number. Get started with live TV streaming.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com/activate">
  <meta property="og:image" content="https://iptv-search.com/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="TV Live Service">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Activation - TV Live Service">
  <meta name="twitter:description" content="Activate your TV Live Service account with your card number. Get started with live TV streaming.">
  <meta name="twitter:image" content="https://iptv-search.com/og-homepage.png">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:15px}
    .container{background:#141414;backdrop-filter:blur(20px);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);padding:30px;max-width:480px;width:100%;position:relative;border:1px solid rgba(255,255,255,.1)}
    .logo{text-align:center;margin-bottom:25px}
    .logo h1{font-size:24px;font-weight:700;color:#fff;margin-bottom:8px}
    .logo p{color:rgba(255,255,255,.6);font-size:14px}
    /* Translate.js 语言切换器样式 */
    #translate{position:absolute;top:20px;right:20px;z-index:10}
    #translate select{height:36px;padding:0 28px 0 10px;border-radius:8px;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.6);color:#fff;cursor:pointer;font-size:13px;font-weight:500;appearance:none;-webkit-appearance:none;-moz-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center}
    #translate select:hover{border-color:rgba(255,255,255,.5);background-color:rgba(0,0,0,.8)}
    #translate select:focus{outline:none;border-color:#e50914}
    #translate select option{background:#1a1a1a;color:#fff}
    /* 自定义下拉框样式 */
    .topic-dropdown{position:relative;width:100%;margin-bottom:6px}
    .topic-trigger{width:100%;padding:12px 36px 12px 14px;border:2px solid rgba(255,255,255,.2);border-radius:10px;font-size:14px;background:#1a1a1a;color:#fff;cursor:pointer;text-align:left;transition:border-color .2s;position:relative}
    .topic-trigger:hover{border-color:rgba(255,255,255,.4)}
    .topic-trigger.open{border-color:#e50914;border-radius:10px 10px 0 0}
    .topic-trigger .arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.6);font-size:10px;transition:transform .2s}
    .topic-trigger.open .arrow{transform:translateY(-50%) rotate(180deg)}
    .topic-menu{position:absolute;top:100%;left:0;right:0;background:#1e1e2e;border:2px solid #e50914;border-top:none;border-radius:0 0 10px 10px;z-index:100;display:none;max-height:240px;overflow-y:auto}
    .topic-menu.open{display:block}
    .topic-item{padding:10px 14px;color:rgba(255,255,255,.85);font-size:14px;cursor:pointer;transition:background .15s}
    .topic-item:hover{background:#e50914;color:#fff}
    .topic-item.selected{background:rgba(229,9,20,.2);color:#ff6b6b}
    .topic-item.selected:hover{background:#e50914;color:#fff}
    .form-group{margin-bottom:18px}
    .form-group label{display:block;margin-bottom:6px;font-weight:500;color:rgba(255,255,255,.8);font-size:14px}
    .form-group input{width:100%;padding:12px 14px;border:2px solid rgba(255,255,255,.2);border-radius:10px;font-size:16px;transition:border-color .2s;letter-spacing:1px;-webkit-appearance:none;height:44px;background:rgba(255,255,255,.05);color:#fff}
    .form-group input:focus{outline:none;border-color:#e50914;background:rgba(255,255,255,.1)}
    .form-group input::placeholder{color:rgba(255,255,255,.4)}
    .btn{width:100%;padding:14px;background:linear-gradient(135deg,#e50914 0%,#b81d24 100%);color:white;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;transition:transform .2s,box-shadow .2s;-webkit-tap-highlight-color:transparent;box-shadow:0 4px 14px rgba(229,9,20,.3)}
    .btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(229,9,20,.4)}
    .btn:active{transform:translateY(0);scale:.98}
    .btn:disabled{background:rgba(229,9,20,.3);cursor:not-allowed;transform:none;scale:1;box-shadow:none}
    .error{color:#ff3b30;text-align:center;margin-bottom:12px;font-size:14px;display:none;padding:12px;background:rgba(255,59,48,.15);border:1px solid rgba(255,59,48,.3);border-radius:10px}
    .success{color:#34c759;text-align:center;margin-bottom:12px;font-size:14px;display:none;padding:12px;background:rgba(52,199,89,.15);border:1px solid rgba(52,199,89,.3);border-radius:10px}
    .toast-container { position: fixed; top: 100px; left: 50%; transform: translateX(-50%); z-index: 4000; display: flex; flex-direction: column; gap: 12px; padding: 0 20px; max-width: 420px; width: 100%; pointer-events: none; }
    .toast { background: linear-gradient(145deg, #1a1a2e, #0a0a0f); backdrop-filter: blur(20px); border-radius: var(--radius, 12px); padding: 16px 20px; border: 1px solid var(--glass-border, rgba(255,255,255,.1)); box-shadow: 0 10px 40px rgba(0,0,0,.4); pointer-events: auto; animation: toastSlideIn 0.4s cubic-bezier(0.4,0,0.2,1); color: var(--text-primary, #fff); font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 12px; }
    .toast-icon { font-size: 20px; flex-shrink: 0; }
    .toast-message { color: var(--text-primary, #fff); }
    .toast.success { border-color: rgba(52,199,89,.4); }
    .toast.success .toast-icon { color: #22c55e; }
    .toast.error { border-color: rgba(239,68,68,.4); }
    .toast.error .toast-icon { color: #ef4444; }
    @keyframes toastSlideIn { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .result{display:none;margin-top:25px;padding:20px;background:rgba(255,255,255,.03);border-radius:16px;border:1px solid rgba(255,255,255,.08)}
    .result.active{display:block}
    .result h3{font-size:16px;font-weight:600;margin-bottom:14px;color:#fff}
    .info-item{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.1)}
    .info-item:last-child{border-bottom:none}
    .info-label{color:rgba(255,255,255,.6);font-size:13px}
    .info-value{color:#fff;font-weight:500;font-size:13px}
    .sub-url-container{margin-top:14px;padding:14px;background:rgba(229,9,20,.1);border-radius:10px;border:1px solid rgba(229,9,20,.3)}
    .sub-url-label{color:rgba(229,9,20,.9);font-size:11px;margin-bottom:6px;font-weight:500}
    .sub-url-controls{display:flex;gap:12px;margin-bottom:8px}
    .format-radio{color:rgba(229,9,20,.9);font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
    .format-radio input{accent-color:#e50914;cursor:pointer}
    .sub-url{color:rgba(255,255,255,.9);font-size:12px;font-weight:600;word-break:break-all;line-height:1.6;cursor:pointer}
    .sub-url:hover{opacity:.8}
    .copy-btn{width:100%;margin-top:14px;padding:12px;background:#e50914;color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;-webkit-tap-highlight-color:transparent}
    .copy-btn:hover{background:#f7262c}
    .copy-btn:active{scale:.98}
    .instructions{margin-top:16px;padding:14px;background:rgba(255,204,0,.1);border-radius:10px;border-left:4px solid #ffcc00}
    .instructions h4{color:#ffcc00;margin-bottom:10px;font-size:13px}
    .instructions ul{list-style:none;padding:0}
    .instructions li{padding:5px 0;color:rgba(255,255,255,.7);font-size:12px;line-height:1.5}
    .instructions li:before{content:"✓";color:#ffcc00;margin-right:6px;font-weight:bold}
    .instructions.warning li:before{content:"⚠️";margin-right:6px}
    .loading{display:none;text-align:center;padding:20px}
    .loading.active{display:block}
    .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,.1);border-top-color:#e50914;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-top:12px;color:rgba(255,255,255,.6);font-size:14px}
    .captcha-row{display:flex;gap:10px;align-items:center}
    .captcha-input{flex:1;padding:0 12px;border:2px solid rgba(255,255,255,.2);border-radius:10px;font-size:16px;text-align:center;letter-spacing:2px;-webkit-appearance:none;transition:border-color .2s;height:44px;background:rgba(255,255,255,.05);color:#fff}
    .captcha-input:focus{outline:none;border-color:#e50914;background:rgba(255,255,255,.1)}
    .captcha-question{padding:0 16px;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.2);border-radius:10px;color:#fff;font-size:18px;font-weight:bold;white-space:nowrap;min-width:100px;text-align:center;letter-spacing:1px;display:flex;align-items:center;justify-content:center;height:44px}
    .captcha-refresh{padding:0 14px;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.2);border-radius:10px;cursor:pointer;font-size:20px;color:rgba(255,255,255,.6);transition:all .2s;-webkit-tap-highlight-color:transparent;height:44px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .captcha-refresh:hover{background:rgba(229,9,20,.2);border-color:#e50914;color:#fff}
    @media (max-width:480px){
      body{padding:10px}
      .container{padding:20px;border-radius:12px}
      .logo h1{font-size:20px}
      .logo p{font-size:12px}
      #translate{top:12px;right:12px}
      #translate select{height:32px;font-size:12px;padding:0 24px 0 8px}
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
    <!-- Translate.js 语言切换器 -->
    <div id="translate"></div>
    <div class="logo">
      <h1 data-i18n="title">📺 TV Live Service</h1>
      <p data-i18n="subtitle">Activate your card to get subscription URL</p>
    </div>

    <div id="errorBox" class="error"></div>
    <div id="successBox" class="success"></div>
    <div id="toastContainer" class="toast-container"></div>
    <div class="form-group">
      <label for="code" data-i18n="enterCode">Enter card number</label>
      <input type="text" id="code" data-i18n-placeholder="codePlaceholder" placeholder="Enter your card number" autocomplete="off">
    </div>

    <div class="form-group">
      <label for="captchaInput" data-i18n="captchaLabel">Verification Code</label>
      <div class="captcha-row">
        <input type="text" id="captchaInput" class="captcha-input" placeholder="?" maxlength="4">
        <div class="captcha-question" id="captchaQuestion">5 + 3 = ?</div>
        <button class="captcha-refresh" onclick="refreshCaptcha()" title="Refresh">↻</button>
      </div>
    </div>

    <div class="form-group">
      <label>Match Network (Optional)</label>
      <div class="topic-dropdown">
        <div class="topic-trigger" id="topicTrigger" onclick="toggleTopicMenu()">
          <span id="topicLabel">Not Selected</span>
          <span class="arrow">▼</span>
        </div>
        <div class="topic-menu" id="topicMenu"></div>
      </div>
      <p style="color:rgba(255,255,255,.5);font-size:12px;margin-top:6px;">Select a network to filter channels, or leave unselected for all channels</p>
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
        <div class="sub-url-controls">
          <label class="format-radio"><input type="radio" name="subFormat" value="m3u" checked onchange="updateSubUrlFormat()"> M3U</label>
          <label class="format-radio"><input type="radio" name="subFormat" value="txt" onchange="updateSubUrlFormat()"> TXT</label>
        </div>
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
      <div class="instructions warning" style="margin-top: 12px; background: rgba(255, 59, 48, 0.1); border-left-color: #ff3b30;">
        <h4 data-i18n="ipRestrictions" style="color: #ff3b30;">⚠️ Important Notice</h4>
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

    
    // 翻译函数 - 使用 translate.js 处理页面翻译
    function t(key) {
      return key;
    }

    // 默认英文语言
    function detectBrowserLanguage() {
      const savedLang = localStorage.getItem('activate_lang');
      if (savedLang) return savedLang;
      return 'en';
    }

    let currentLang = detectBrowserLanguage();

    // 页面加载后初始化翻译
    function initPageTranslate() {
      // 设置 HTML lang 属性
      document.documentElement.lang = currentLang;
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
        showError(t('cardNumberError'));
        return;
      }

      if (!captchaInput) {
        showError(t('captchaError'));
        return;
      }

      const userAnswer = parseInt(captchaInput);
      if (isNaN(userAnswer) || userAnswer !== captchaAnswer) {
        showError(t('invalidCaptcha'));
        refreshCaptcha();
        return;
      }

      showLoading(true);
      document.getElementById('result').classList.remove('active');

      try {
        const topicId = getSelectedTopicId();
        const response = await fetch(API_BASE + '?code=' + encodeURIComponent(code), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic_id: topicId || null })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess(t('success'));
          showResult(code, data);
          refreshCaptcha();
        } else {
          showError(data.error || t('fail'));
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

    function showToast(message, type) {
      type = type || 'info';
      const container = document.getElementById('toastContainer');
      if (!container) return;
      const toastEl = document.createElement('div');
      toastEl.className = 'toast ' + type;
      const icons = { success: '\u2713', error: '\u2715', warning: '\u26a0', info: '\u2139' };
      toastEl.innerHTML = '<div class="toast-content"><span class="toast-icon">' + (icons[type] || icons.info) + '</span><span class="toast-message">' + message + '</span></div>';
      container.appendChild(toastEl);
      setTimeout(() => {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(-10px)';
        setTimeout(() => toastEl.remove(), 300);
      }, 3000);
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
      window._activeCode = code;
      window._subUrlBase = host + '/sub/' + code;
      updateSubUrlFormat();

      result.classList.add('active');
    }

    function getSelectedFormat() {
      const sel = document.querySelector('input[name="subFormat"]:checked');
      return sel ? sel.value : 'm3u';
    }
    function updateSubUrlFormat() {
      if (!window._subUrlBase) return;
      const fmt = getSelectedFormat();
      document.getElementById('subUrl').textContent = window._subUrlBase + '.' + fmt;
    }
    function copySubUrl() {
      const subUrl = document.getElementById('subUrl').textContent;
      if (subUrl && subUrl !== '-') {
        navigator.clipboard.writeText(subUrl).then(() => {
          showToast(t('copied Success'), 'success');
        }).catch(err => {
          const textarea = document.createElement('textarea');
          textarea.value = subUrl;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast(t('copied Success'), 'success');
        });
      }
    }

    let captchaAnswer = 0;
    
    function refreshCaptcha() {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      const isPlus = Math.random() > 0.5;
      
      if (isPlus) {
        captchaAnswer = a + b;
        document.getElementById('captchaQuestion').textContent = a + ' + ' + b + ' = ?';
      } else {
        // Ensure positive result for subtraction
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        captchaAnswer = max - min;
        document.getElementById('captchaQuestion').textContent = max + ' - ' + min + ' = ?';
      }
    }

    // 自定义下拉框状态
    let _topicMenuOpen = false;
    let _selectedTopicId = null;

    function toggleTopicMenu() {
      const menu = document.getElementById('topicMenu');
      const trigger = document.getElementById('topicTrigger');
      _topicMenuOpen = !_topicMenuOpen;
      menu.classList.toggle('open', _topicMenuOpen);
      trigger.classList.toggle('open', _topicMenuOpen);
    }

    function selectTopic(id, label) {
      _selectedTopicId = id;
      document.getElementById('topicLabel').textContent = label;
      document.querySelectorAll('.topic-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.id === id);
      });
      toggleTopicMenu();
    }

    function getSelectedTopicId() {
      return _selectedTopicId || null;
    }

    // Load topics for selection
    async function loadTopics() {
      try {
        const resp = await fetch('/api/topics');
        const topics = await resp.json();
        const menu = document.getElementById('topicMenu');
        menu.innerHTML = '';

        // 未选择选项
        const emptyItem = document.createElement('div');
        emptyItem.className = 'topic-item selected';
        emptyItem.dataset.id = '';
        emptyItem.textContent = 'Not Selected';
        emptyItem.onclick = () => selectTopic('', 'Not Selected');
        menu.appendChild(emptyItem);

        if (topics && Array.isArray(topics)) {
          topics.forEach(t => {
            const item = document.createElement('div');
            item.className = 'topic-item';
            item.dataset.id = t.id;
            item.textContent = t.name + (t.description ? ' - ' + t.description : '');
            item.onclick = () => selectTopic(t.id, t.name + (t.description ? ' - ' + t.description : ''));
            menu.appendChild(item);
          });
        }
      } catch(e) {
        console.error('Failed to load topics:', e);
      }
    }

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      const dropdown = document.querySelector('.topic-dropdown');
      if (dropdown && !_dropdown.contains(e.target) && _topicMenuOpen) {
        toggleTopicMenu();
      }
    });

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
      refreshCaptcha();
      loadTopics();

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
  
<!-- Translate.js 自动翻译 -->
<script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
<script>
  function initTranslate() {
    if (typeof translate !== 'undefined' && !window.translate) {
      window.translate = translate;
    }
    if (typeof translate !== 'undefined' && translate.language) {
      // 设置默认语言为英文
      translate.language.setLocal('english');
      // 使用边缘翻译服务
      translate.service.use('client.edge');
      // 开启页面元素动态监控
      translate.listener.start();
      
      // 显式显示语言选择器
      if (translate.selectLanguageTag) {
        translate.selectLanguageTag.show = true;
      }
      
      // 执行翻译，语言选择器会自动生成到 id="translate" 的元素中
      translate.execute();
    } else {
      setTimeout(initTranslate, 100);
    }
  }
  initTranslate();
</script>
</body>
</html>`;
