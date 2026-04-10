// 通用网页页脚组件
import { FLOATING_SIDEBAR_STYLES, FLOATING_SIDEBAR_SCRIPTS } from './floating-sidebar.js';

export const PAGE_FOOTER = `
  <!-- Floating Sidebar - Back to Top Only -->
  <div class="floating-sidebar">
    <button class="sidebar-btn back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Back to Top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <span class="sidebar-tooltip">Back to Top</span>
    </button>
  </div>

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
    /* Floating Sidebar - Back to Top Only */
    .floating-sidebar {
      position: fixed;
      right: 20px;
      bottom: 30px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .sidebar-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.25s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sidebar-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .sidebar-btn:active {
      transform: scale(0.96);
    }

    .sidebar-btn svg {
      width: 20px;
      height: 20px;
      color: #ffffff;
      transition: transform 0.2s ease;
    }

    .sidebar-btn:hover svg {
      transform: translateY(-2px);
    }

    .sidebar-tooltip {
      position: absolute;
      right: 60px;
      top: 50%;
      transform: translateY(-50%);
      background: #1a1a1a;
      color: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }

    .sidebar-tooltip::after {
      content: '';
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-left-color: #1a1a1a;
    }

    .sidebar-btn:hover .sidebar-tooltip {
      opacity: 1;
      transform: translateY(-50%) translateX(-4px);
    }

    @media (max-width: 768px) {
      .floating-sidebar {
        right: 10px;
        bottom: 16px;
      }
      .sidebar-btn {
        width: 42px;
        height: 42px;
      }
      .sidebar-tooltip {
        display: none;
      }
    }

    [data-theme="light"] .sidebar-btn {
      background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%);
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    [data-theme="light"] .sidebar-btn svg {
      color: #333;
    }

    [data-theme="light"] .sidebar-tooltip {
      background: #fff;
      color: #333;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    [data-theme="light"] .sidebar-tooltip::after {
      border-left-color: #fff;
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
    // Floating sidebar back-to-top functionality
    document.addEventListener('DOMContentLoaded', function() {
      const backToTopBtn = document.querySelector('.back-to-top');
      if (backToTopBtn) {
        const toggleVisibility = () => {
          if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
          } else {
            backToTopBtn.style.opacity = '0.35';
            backToTopBtn.style.pointerEvents = 'none';
          }
        };
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
      }
    });
  </script>
`;