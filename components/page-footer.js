// 通用网页页脚组件
export const PAGE_FOOTER = `
  <footer class="page-footer">
    <div class="footer-content">
  <p class="footer-copyright">&copy; 2024 IPTV Search. Free IPTV Channel Directory & Search Tool</p>
      
      <!-- SEO 友好链接 -->
      <div class="footer-links">
        <a href="/tutorial">How to Watch on TV Devices</a>
        <a href="/sitemap.xml">Sitemap</a>
        <a href="/robots.txt">Robots</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="mailto:support@iptv-search.com">Contact Us</a>
      </div>
      
      <!-- Cloudflare托管说明和徽章 -->
      <div class="footer-badges">
        <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">
          <img src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/CHOl0sUhrumCxOXfRotGt/081f81d52274080b2d026fdf163e3009/cloudflare-icon-color_3x.png" alt="Cloudflare">
        </a>
        <span>This site is powered by Cloudflare for acceleration and security</span>
      </div>
      
      <!-- 免责声明 -->
      <div class="footer-disclaimer">
        All streaming links on this site are sourced from the public internet. This site does not produce or store any content. For copyright or content issues, please contact the actual content provider.
      </div>
    </div>
  </footer>

  <style>
    .page-footer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border);
      padding: 40px 20px;
      margin-top: 60px;
    }

    .footer-content {
      max-width: 1000px;
      margin: 0 auto;
      text-align: center;
    }

    .footer-copyright {
      color: var(--text-secondary);
      font-size: 14px;
      margin-bottom: 20px;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 15px;
      font-size: 12px;
    }

    .footer-links a {
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: var(--text-primary);
    }

    .footer-badges {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
    }

    .footer-badges img {
      height: 12px;
      width: auto;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .footer-badges img:hover {
      opacity: 1;
    }

    .footer-badges span {
      font-size: 12px;
      color: var(--text-muted);
    }

    .footer-disclaimer {
      margin-top: 15px;
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.5;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 768px) {
      .page-footer {
        padding: 30px 15px;
        margin-top: 40px;
      }

      .footer-copyright {
        font-size: 13px;
      }

      .footer-links {
        gap: 12px;
        font-size: 11px;
      }

      .footer-badges span {
        font-size: 11px;
      }

      .footer-disclaimer {
        font-size: 10px;
      }
    }

    @media (max-width: 480px) {
      .page-footer {
        padding: 25px 10px;
        margin-top: 30px;
      }

      .footer-links {
        gap: 10px;
        flex-direction: column;
      }

      .footer-links a {
        margin: 3px 0;
      }

      .footer-badges {
        flex-direction: column;
      }
    }
  </style>
  <!-- Translate.js 自动翻译 -->
  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    function initTranslate() {
      if (typeof translate !== 'undefined' && !window.translate) {
        window.translate = translate;
      }
      if (typeof translate !== 'undefined' && translate.language) {
        translate.selectLanguageTag.show = true;
        translate.selectLanguageTag.documentId = 'translate';
        translate.language.setLocal('english');
        translate.service.use('client.edge');
        translate.listener.start();
        translate.setAutoDiscriminateLocalLanguage();
        translate.execute();
      } else {
        setTimeout(initTranslate, 100);
      }
    }
    initTranslate();

    function changeLanguage(lang) {
      var t = window.translate || translate;
      if (t && t.changeLanguage) {
        t.changeLanguage(lang);
      }
    }
  </script>
`;