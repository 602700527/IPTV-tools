// 通用网页页脚组件
import { FLOATING_SIDEBAR_STYLES, FLOATING_SIDEBAR_HTML, FLOATING_SIDEBAR_SCRIPTS } from './floating-sidebar.js';

export const PAGE_FOOTER = `
  ${FLOATING_SIDEBAR_HTML}
  <footer class="page-footer">
    <div class="footer-content">
  <p class="footer-copyright">&copy; 2026 IPTV Search. Free IPTV Channel Directory & Search Tool</p>
      
      <!-- FAQ常见问题区块 -->
      <div class="footer-faq">
        <h3 class="footer-faq-title">Frequently Asked Questions</h3>
        <div class="faq-grid">
          <details class="faq-card">
            <summary>How can I watch IPTV for free?</summary>
            <div class="faq-answer">Browse our directory, select a channel, and start watching instantly. No registration required.</div>
          </details>
          <details class="faq-card">
            <summary>What devices are supported?</summary>
            <div class="faq-answer">Smart TVs, Roku, Firestick, Apple TV, computers, smartphones & tablets.</div>
          </details>
          <details class="faq-card">
            <summary>Is using IPTV legal?</summary>
            <div class="faq-answer">We index public links. Users must comply with local laws in their region.</div>
          </details>
          <details class="faq-card">
            <summary>Why isn't a channel playing?</summary>
            <div class="faq-answer">Try refreshing, different player, or check your internet connection.</div>
          </details>
          <details class="faq-card">
            <summary>What are the subscription plans?</summary>
            <div class="faq-answer">Free plan: check in once every 7 days to keep active. Premium: ad-free viewing experience on website with channels up to 4K quality (where available).</div>
          </details>
          <details class="faq-card">
            <summary>How often are channels updated?</summary>
            <div class="faq-answer">Daily updates - dead links removed & new channels added regularly.</div>
          </details>
        </div>
      </div>
      
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
        This site does not host or provide any IPTV streams. All channels are sourced from publicly available M3U playlists. Channels may go offline at any time as their source streams change.
      </div>
    </div>
  </footer>

  <div id="footer-ad-container" data-hide-for-member="true">
    <script>(function(s){s.dataset.zone='10621634',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
  </div>

  <script>
    // 页脚广告显示控制 - 根据会员状态决定是否加载
    (async function() {
      try {
        const response = await fetch('/api/member/status');
        const data = await response.json();
        if (data.isMember && data.adFreeEnabled) {
          // 会员且功能启用，隐藏页脚广告
          var footerAdContainer = document.getElementById('footer-ad-container');
          if (footerAdContainer) {
            footerAdContainer.style.display = 'none';
          }
        }
      } catch (e) {
        // 忽略错误，显示广告
      }
    })();
  </script>

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

    /* FAQ区块样式 */
    .footer-faq {
      margin: 2.5rem 0;
    }

    .footer-faq-title {
      color: var(--text-primary);
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .faq-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      transition: border-color var(--transition);
    }

    .faq-card:hover {
      border-color: var(--accent);
    }

    .faq-card summary {
      padding: 1rem 1.25rem;
      cursor: pointer;
      color: var(--text-primary);
      font-size: 0.95rem;
      font-weight: 500;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .faq-card summary::-webkit-details-marker {
      display: none;
    }

    .faq-card summary::after {
      content: '+';
      font-size: 1.25rem;
      color: var(--accent);
      transition: transform 0.2s;
    }

    .faq-card details[open] summary::after {
      transform: rotate(45deg);
    }

    .faq-card .faq-answer {
      padding: 0 1.25rem 1.25rem;
      color: var(--text-secondary);
      font-size: 0.85rem;
      line-height: 1.6;
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
  <style>
    ${FLOATING_SIDEBAR_STYLES}
  </style>
  <!-- Translate.js 自动翻译 -->
  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    function initTranslate() {
      if (typeof translate !== 'undefined' && !window.translate) {
        window.translate = translate;
      }
      if (typeof translate !== 'undefined' && translate.language) {
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
  <script>
    ${FLOATING_SIDEBAR_SCRIPTS}
  </script>
`;