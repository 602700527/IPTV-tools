// 通用网页头部组件（完整版）
export const PAGE_HEADER = `
  <header class="header">
    <div class="header-inner">
      <a href="/" class="logo">
        <div class="logo-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ff3b30;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="36" height="36" rx="6" fill="url(#tvGradient)" />
            <rect x="4" y="8" width="28" height="18" rx="2" fill="#0a0a0a" />
            <path d="M14 12 L24 17 L14 22 Z" fill="#fff" />
            <rect x="10" y="28" width="6" height="3" rx="1" fill="#0a0a0a" />
            <rect x="20" y="28" width="6" height="3" rx="1" fill="#0a0a0a" />
          </svg>
        </div>
        <div class="logo-text">IPTV<span>Search</span></div>
      </a>
      <div class="header-actions">
        <a href="/favorites" class="pill-btn" title="My Favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </a>
        <a href="/plans" class="pill-btn" title="Subscription Plans">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </a>
        <button class="theme-toggle" id="themeToggle" title="Toggle theme">
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="display:none;"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <a href="/account" class="account-btn" title="My Account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
        <div id="translate"></div>
      </div>
    </div>
  </header>

  <script>
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved ? saved === 'dark' : prefersDark;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    })();
    function updateThemeIcons(isDark) {
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = isDark ? 'none' : 'block';
        moon.style.display = isDark ? 'block' : 'none';
      }
    }
  </script>

  <style>
    :root {
      --accent: #e50914;
      --accent-hover: #ff1a1a;
      --radius: 8px;
      --transition: 0.2s ease;

      --bg-primary: #0a0a0a;
      --bg-secondary: #111111;
      --bg-card: #1a1a1a;
      --bg-hover: #222222;
      --text-primary: #ffffff;
      --text-secondary: #999999;
      --text-muted: #666666;
      --border: rgba(255,255,255,0.08);
      --border-hover: rgba(255,255,255,0.15);
      --shadow: 0 4px 20px rgba(0,0,0,0.4);
    }

    [data-theme="light"] {
      --bg-primary: #f5f5f5;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      --bg-hover: #f0f0f0;
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: rgba(0,0,0,0.08);
      --border-hover: rgba(0,0,0,0.15);
      --shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-padding-top: 70px; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; transition: background var(--transition), color var(--transition); }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }
    button { cursor: pointer; font-family: inherit; }

    .header { background: #1a1a1a; border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
    .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
    .logo-icon svg { width: 36px; height: 36px; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .pill-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .pill-btn:hover { color: var(--accent); }
    .account-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .account-btn:hover { color: var(--accent); }
    .account-btn svg, .pill-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
    .theme-toggle { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; color: var(--text-secondary); cursor: pointer; transition: color var(--transition); border: none; }
    .theme-toggle:hover { color: var(--accent); }
    #translate { position: relative; display: inline-flex; align-items: center; }
    #translateSelectLanguage { appearance: none; -webkit-appearance: none; padding: 0.5rem 2rem 0.5rem 0.75rem; background: transparent; border: none; border-radius: 6px; color: var(--text-secondary); font-size: 0.85rem; cursor: pointer; outline: none; transition: color var(--transition); min-width: 80px; }
    #translateSelectLanguage:focus { color: var(--accent); }
    #translateSelectLanguage:hover { color: var(--accent); }
    #translate::after { content: ""; position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--text-secondary); pointer-events: none; }
    #translate:hover::after { border-top-color: var(--accent); }

    @media (max-width: 768px) {
      .header { padding: 0.5rem 0.75rem; }
      .header-inner { flex-wrap: wrap; justify-content: space-between; gap: 0.5rem; }
      .logo { flex-shrink: 0; }
      .logo-icon svg { width: 32px; height: 32px; }
      .logo-text { display: none; }
      .header-actions { gap: 0.25rem; flex-shrink: 0; }
      .header-actions .pill-btn { width: 32px; height: 32px; padding: 0; flex-shrink: 0; }
      .header-actions .pill-btn span { display: none; }
      .theme-toggle { width: 32px; height: 32px; background: transparent; border: none; padding: 0; flex-shrink: 0; }
      .account-btn { width: 32px; height: 32px; padding: 0; flex-shrink: 0; }
    }
  </style>

`;