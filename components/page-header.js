// 通用网页头部组件
export const PAGE_HEADER = `
  <header class="page-header">
    <div class="header-container">
      <a href="/" class="header-logo">
        <img src="/logo.svg" alt="IPTV Live" width="160" height="48" />
      </a>
      <nav class="header-nav">
        <a href="/" class="nav-item home-icon" title="首页">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </a>
        <!-- 语言切换器 -->
        <select id="headerLangSelect" onchange="if(typeof changeLanguage==='function'){changeLanguage(this.value)}" style="margin-left: 12px; height: 40px; padding: 0 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.3); background: rgba(0,0,0,0.6); color: #fff; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center;">
          <option value="chinese_simplified">中文</option>
          <option value="english">English</option>
          <option value="japanese">日本語</option>
          <option value="korean">한국어</option>
          <option value="spanish">Español</option>
          <option value="french">Français</option>
          <option value="german">Deutsch</option>
          <option value="portuguese">Português</option>
          <option value="russian">Русский</option>
          <option value="arabic">العربية</option>
          <option value="hindi">हिन्दी</option>
          <option value="thai">ไทย</option>
          <option value="vietnamese">Tiếng Việt</option>
          <option value="italian">Italiano</option>
          <option value="dutch">Nederlands</option>
          <option value="polish">Polski</option>
          <option value="turkish">Türkçe</option>
        </select>
      </nav>
    </div>
  </header>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-padding-top: 70px;
    }

    body {
      margin: 0;
      padding: 0;
    }

    .page-header {
      background: rgba(20, 20, 20, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .header-container {
      max-width: 100%;
      margin: 0;
      padding: 0 20px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .header-logo {
      text-decoration: none;
      display: flex;
      align-items: center;
      transition: opacity 0.2s;
    }

    .header-logo:hover {
      opacity: 0.8;
    }

    .header-logo img {
      width: 160px;
      height: 48px;
    }

    .header-nav {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .nav-item {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .nav-item.home-icon {
      width: 40px;
      height: 40px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
    }

    .nav-item.home-icon:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    @media (max-width: 768px) {
      html {
        scroll-padding-top: 60px;
      }

      .header-container {
        padding: 0 15px;
        height: 60px;
      }

      .header-logo img {
        width: 130px;
        height: 39px;
      }

      .header-nav {
        gap: 4px;
      }

      .nav-item {
        font-size: 13px;
        padding: 6px 10px;
      }
    }

    @media (max-width: 480px) {
      html {
        scroll-padding-top: 50px;
      }

      .header-container {
        padding: 0 10px;
      }

      .header-logo img {
        width: 110px;
        height: 33px;
      }

      .nav-item {
        font-size: 12px;
        padding: 5px 8px;
      }
    }
  </style>
`;
