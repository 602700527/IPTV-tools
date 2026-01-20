// 导航栏组件 - 可复用的头部组件
import { LOGO_SVG } from '../assets.js';

// 导航栏 CSS
export const NAVBAR_CSS = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .navbar {
    background: rgba(10, 10, 10, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 15px 0;
  }

  .navbar-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .logo img {
    height: 40px;
    width: auto;
  }

  .nav-actions {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .nav-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;
  }

  .nav-link:hover {
    color: #e50914;
  }

  /* 语言切换按钮 */
  .lang-switch {
    display: flex;
    align-items: center;
  }

  .lang-dropdown {
    position: relative;
    display: inline-block;
  }

  .lang-btn {
    background: #e50914;
    color: white;
    border: none;
    padding: 8px 18px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    -webkit-tap-highlight-color: transparent;
  }

  .lang-btn:hover {
    background: #f7262c;
  }

  .lang-btn:after {
    content: "▼";
    font-size: 9px;
  }

  .lang-menu {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #1a1a1a;
    backdrop-filter: blur(10px);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    min-width: 120px;
    overflow: hidden;
    animation: fadeIn 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .lang-menu.show {
    display: block;
  }

  .lang-menu button {
    display: block;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    text-align: left;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: background 0.2s;
  }

  .lang-menu button:hover {
    background: rgba(229, 9, 20, 0.15);
  }

  .lang-menu button.active {
    background: #e50914;
    color: white;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .navbar-content {
      padding: 0 15px;
    }

    .nav-actions {
      gap: 10px;
    }

    .nav-link {
      font-size: 13px;
    }

    .lang-btn {
      padding: 6px 14px;
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .navbar-content {
      flex-direction: column;
      gap: 10px;
    }

    .nav-actions {
      font-size: 12px;
    }
  }
`;

// 导航栏 HTML
export function renderNavbar(showLangSwitch = false) {
  let langSwitchHTML = '';
  if (showLangSwitch) {
    langSwitchHTML = `
      <div class="lang-switch nav-actions">
        <div class="lang-dropdown">
          <button class="lang-btn" onclick="toggleLangMenu()" id="currentLangBtn">简体</button>
          <div class="lang-menu" id="langMenu">
            <button onclick="setLanguage('zh-CN')" id="langZh">简体中文</button>
            <button onclick="setLanguage('en')" id="langEn">English</button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <nav class="navbar">
      <div class="navbar-content">
        <a href="/" class="logo">
          ${LOGO_SVG}
        </a>
        <div class="nav-actions">
          <a href="/" class="nav-link" data-i18n="navHome">首页</a>
          <a href="/subscription-choice" class="nav-link" data-i18n="navMembership">会员订阅</a>
          <a href="/freesub" class="nav-link" data-i18n="navFree">免费订阅</a>
        </div>
        ${langSwitchHTML}
      </div>
    </nav>
  `;
}

// 导航栏 JavaScript
export const NAVBAR_JS = `
  function toggleLangMenu() {
    document.getElementById('langMenu').classList.toggle('show');
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('page_lang', lang);

    const langEn = document.getElementById('langEn');
    const langZh = document.getElementById('langZh');
    if (langEn) langEn.classList.toggle('active', lang === 'en');
    if (langZh) langZh.classList.toggle('active', lang === 'zh-CN');

    const currentLangBtn = document.getElementById('currentLangBtn');
    if (currentLangBtn) currentLangBtn.textContent = lang === 'en' ? 'EN' : '简体';

    const langMenu = document.getElementById('langMenu');
    if (langMenu) langMenu.classList.remove('show');

    document.documentElement.lang = lang;
    updatePageLanguage(lang);
  }

  function updatePageLanguage(lang) {
    // 更新页面标题
    if (typeof updateTitle === 'function') {
      updateTitle(lang);
    }

    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translations = (typeof getTranslations === 'function') ? getTranslations() : null;
      if (translations && translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }

  // 点击其他地方关闭语言菜单
  document.addEventListener('click', function(e) {
    const langMenu = document.getElementById('langMenu');
    if (langMenu && !e.target.closest('.lang-dropdown')) {
      langMenu.classList.remove('show');
    }
  });
`;

// 默认翻译
export const NAVBAR_TRANSLATIONS = {
  'zh-CN': {
    navHome: '首页',
    navMembership: '会员订阅',
    navFree: '免费订阅'
  },
  'en': {
    navHome: 'Home',
    navMembership: 'Membership',
    navFree: 'Free Subscription'
  }
};
