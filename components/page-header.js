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
        <!-- Translate.js 语言切换器容器 -->
        <div id="translate" style="margin-left: 12px;"></div>
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
      width: 44px;
      height: 44px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: all 0.2s;
    }

    .nav-item.home-icon:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    /* Translate.js 语言切换器样式 */
    #translate {
      display: inline-flex;
      align-items: center;
    }

    #translate select {
      height: 40px;
      padding: 0 32px 0 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
    }

    #translate select:hover {
      border-color: rgba(255, 255, 255, 0.5);
      background-color: rgba(0, 0, 0, 0.8);
    }

    #translate select:focus {
      outline: none;
      border-color: #e50914;
    }

    #translate select option {
      background: #1a1a1a;
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

      .nav-item.home-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
      }

      .nav-item.home-icon:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
      }

      .nav-item.home-icon svg {
        width: 16px;
        height: 16px;
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

      .nav-item.home-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      }

      .nav-item.home-icon:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.35);
      }

      .nav-item.home-icon svg {
        width: 15px;
        height: 15px;
      }
    }
  </style>
  
`;
