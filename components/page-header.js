// 通用网页头部组件（完整版）
export const PAGE_HEADER = `
  <header class="header">
    <div class="header-inner">
      <a href="/" class="logo">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ff3b30;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="36" height="36" fill="url(#tvGradient)" />
            <rect x="4" y="8" width="28" height="18" fill="#0a0a0a" />
            <path d="M14 12 L24 17 L14 22 Z" fill="#fff" />
            <rect x="10" y="28" width="6" height="3" fill="#0a0a0a" />
            <rect x="20" y="28" width="6" height="3" fill="#0a0a0a" />
          </svg>
        </div>
        <div class="logo-text">IPTV<span>Search</span></div>
      </a>
      <div class="header-search-wrapper">
        <form action="/search" method="get" class="header-search-form">
          <div class="header-search-type-wrap">
            <select name="type" class="header-search-type" aria-label="Search type">
              <option value="channel">Channel</option>
              <option value="group">Region</option>
              <option value="type">Type</option>
            </select>
          </div>
          <div class="header-search-divider"></div>
          <input type="text" name="q" class="header-search-input" placeholder="Search channels..." aria-label="Search">
          <button type="submit" class="header-search-submit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </form>
      </div>
      <div class="header-actions">
        <a href="/favorites" class="pill-btn" title="Favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </a>
        <a href="/subscription" class="pill-btn" title="Plans">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </a>
        <a href="/account" class="account-btn guest-gift" title="Get 7 Days Free VIP" id="giftAccountBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
        <div id="translate"></div>
      </div>
    </div>
  </header>

  <div id="ad-container"></div>

  <script>
    // 广告延迟加载：先检查会员状态，是会员则不加载广告
    (function() {
      var adContainer = document.getElementById('ad-container');
      if (!adContainer) return;

      function loadAd() {
        var ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.cssText = 'display:block';
        ins.dataset.adClient = 'ca-pub-2205598928191137';
        ins.dataset.adSlot = '9663554756';
        ins.dataset.adFormat = 'auto';
        ins.dataset.fullWidthResponsive = 'true';
        adContainer.appendChild(ins);

        var script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2205598928191137';
        script1.crossOrigin = 'anonymous';
        adContainer.appendChild(script1);

        var script2 = document.createElement('script');
        script2.text = '(adsbygoogle = window.adsbygoogle || []).push({});';
        adContainer.appendChild(script2);
      }

      fetch('/api/member/status')
        .then(function(response) { return response.json(); })
        .then(function(data) {
          if (data.isMember && data.adFreeEnabled) {
            return;
          }
          loadAd();
        })
        .catch(function() {
          loadAd();
        });
    })();
  </script>

  <script>
    // Gift animation for unauthenticated users
    (function() {
      var btn = document.getElementById('giftAccountBtn');
      if (!btn) return;
      
      // 检查是否已登录（Cookie或localStorage）
      var token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] || localStorage.getItem('auth_token');
      if (token) {
        btn.classList.remove('guest-gift');
        var icon = btn.querySelector('.gift-icon');
        if (icon) icon.remove();
      } else {
        btn.classList.add('guest-gift');
        var giftIcon = document.createElement('span');
        giftIcon.className = 'gift-icon';
        giftIcon.textContent = '🎁';
        btn.appendChild(giftIcon);
      }
    })();
  </script>

  <style>
    :root {
      /* 背景层次 - 纯色极简 */
      --bg-primary: #0a0a0a;
      --bg-secondary: #0f0f0f;
      --bg-card: transparent;
      --bg-hover: transparent;
      --bg-elevated: transparent;

      /* 文字层次 */
      --text-primary: #ffffff;
      --text-secondary: #888888;
      --text-muted: #555555;

      /* 主色调 - 纯红强调 */
      --accent: #e50914;
      --accent-hover: #ff1a1a;

      /* 辅助色系 */
      --premium-red: #e50914;
      --success-green: #22c55e;
      --trust-blue: #3b82f6;
      --alert-orange: #f59e0b;

      /* 边框与阴影 - 极简线条 */
      --border: 1px solid rgba(255,255,255,0.08);
      --border-hover: 1px solid rgba(229,9,20,0.4);
      --border-accent: 1px solid var(--accent);
      --shadow: none;
      --radius: 0;
      --transition: 0.2s ease;
    }

    [data-theme="light"] {
      --bg-primary: #ffffff;
      --bg-secondary: #fafafa;
      --bg-card: transparent;
      --bg-hover: transparent;
      --text-primary: #0a0a0a;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: 1px solid rgba(0,0,0,0.1);
      --border-hover: 1px solid rgba(229,9,20,0.5);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-padding-top: 60px; }
    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: inherit; }

    .header {
      background: var(--bg-primary);
      border-bottom: var(--border);
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 10000;
    }
    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      padding: 0.75rem 0;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      flex-shrink: 0;
    }
    .logo-icon svg { width: 28px; height: 28px; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1.5rem; }

    /* 搜索栏 - 极简线条 */
    .header-search-wrapper { flex: 1; max-width: 480px; margin: 0 1rem; }
    .header-search-form {
      display: flex;
      align-items: center;
      background: transparent;
      border: var(--border);
      padding: 0;
      gap: 0;
      transition: border-color 0.2s;
    }
    .header-search-form:focus-within {
      border-color: var(--accent);
    }

    .header-search-type-wrap {
      display: flex;
      align-items: center;
      padding: 0 0.75rem;
      flex-shrink: 0;
    }
    .header-search-type {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      outline: none;
      min-width: 60px;
      appearance: none;
      -webkit-appearance: none;
    }
    .header-search-type:hover, .header-search-type:focus { color: var(--text-primary); }
    .header-search-type option { background: var(--bg-primary); color: var(--text-primary); }

    .header-search-divider {
      width: 1px;
      height: 20px;
      background: var(--border);
      flex-shrink: 0;
    }

    .header-search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-size: 0.8rem;
      padding: 0.5rem 0.75rem;
      outline: none;
      min-width: 0;
    }
    .header-search-input::placeholder { color: var(--text-muted); }

    .header-search-submit {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent);
      border: none;
      color: #fff;
      font-size: 0;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .header-search-submit:hover { background: var(--accent-hover); }

    /* 图标按钮 - 极简 */
    .pill-btn, .account-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;
      border: none;
      background: transparent;
    }
    .pill-btn:hover, .account-btn:hover { color: var(--accent); }
    .account-btn svg, .pill-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
    
    /* Gift animation for unauthenticated users */
    .guest-gift {
      position: relative;
      animation: giftPulse 2s ease-in-out infinite;
    }
    .gift-icon {
      position: absolute;
      top: -8px;
      right: -8px;
      font-size: 12px;
      animation: giftBounce 1s ease-in-out infinite;
      filter: drop-shadow(0 2px 4px rgba(229, 9, 20, 0.5));
    }
    @keyframes giftPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes giftBounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-3px) rotate(-10deg); }
    }
    .guest-gift:hover .gift-icon {
      animation: giftSpin 0.5s ease-out;
    }
    @keyframes giftSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    #translate { position: relative; display: inline-flex; align-items: center; }
    #translateSelectLanguage {
      appearance: none;
      -webkit-appearance: none;
      padding: 0 0.5rem;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 0.75rem;
      cursor: pointer;
      outline: none;
      transition: color 0.2s;
      min-width: 50px;
    }
    #translateSelectLanguage:focus { color: var(--accent); }
    #translateSelectLanguage:hover { color: var(--accent); }

    @media (max-width: 768px) {
      .header-inner {
        flex-wrap: wrap;
        padding: 0.5rem 1rem;
        gap: 0.75rem;
      }
      .logo { flex-shrink: 0; }
      .logo-text { display: none; }
      .header-actions { flex-shrink: 0; gap: 0.75rem; }
      .pill-btn, .account-btn { width: 24px; height: 24px; }
      .account-btn svg, .pill-btn svg { width: 14px; height: 14px; }
      #translateSelectLanguage { min-width: 40px; font-size: 0.7rem; }
      /* 搜索栏下移到第二行 */
      .header-search-wrapper {
        order: 3;
        width: 100%;
        max-width: none;
        margin: 0.5rem 0 0 0;
        flex: none;
      }
      .header-search-type { min-width: 50px; font-size: 0.7rem; }
      .header-search-input { font-size: 0.75rem; padding: 0.4rem 0.5rem; }
    }

    @media (max-width: 480px) {
      .header-search-type-wrap { padding: 0 0.5rem; }
      .header-search-divider { display: none; }
      .header-search-type { min-width: 40px; }
      .header-search-input { padding: 0.4rem 0.5rem; }
    }
  </style>

`;
