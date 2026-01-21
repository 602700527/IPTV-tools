// 通用网页页脚组件
export const PAGE_FOOTER = `
  <footer class="page-footer">
    <div class="footer-content">
      <p class="footer-copyright">&copy; 2024 IPTV Live. <span data-i18n="footerCopyright">免费高清电视在线观看平台</span></p>
      
      <!-- SEO 友好链接 -->
      <div class="footer-links">
        <a href="/sitemap.xml" data-i18n="sitemap">网站地图</a>
        <a href="/robots.txt">Robots</a>
        <a href="/privacy-policy" data-i18n="privacyPolicy">隐私政策</a>
        <a href="/terms" data-i18n="termsOfService">服务条款</a>
      </div>
      
      <!-- Cloudflare托管说明和徽章 -->
      <div class="footer-badges">
        <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">
          <img src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/CHOl0sUhrumCxOXfRotGt/081f81d52274080b2d026fdf163e3009/cloudflare-icon-color_3x.png" alt="Cloudflare">
        </a>
        <span data-i18n="cloudflareBadge">本站由 Cloudflare 提供加速与安全保护</span>
      </div>
      
      <!-- 免责声明 -->
      <div class="footer-disclaimer" data-i18n="disclaimerContent">
        本站播放链接资源均来源于公开网络，本站不产出和储存任何内容。如有版权或内容问题，请联系内容实际产出者。
      </div>
    </div>
  </footer>

  <style>
    .page-footer {
      background: #0a0a0a;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 40px 20px;
      margin-top: 60px;
    }

    .footer-content {
      max-width: 1000px;
      margin: 0 auto;
      text-align: center;
    }

    .footer-copyright {
      color: rgba(255, 255, 255, 0.8);
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
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: rgba(255, 255, 255, 0.9);
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
      color: rgba(255, 255, 255, 0.6);
    }

    .footer-disclaimer {
      margin-top: 15px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
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
`;
