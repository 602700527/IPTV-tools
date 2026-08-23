// 通用网页页脚组件（极简线条风格）
import {
  VIP_NOTIFICATION_STYLES,
  VIP_NOTIFICATION_HTML,
  VIP_NOTIFICATION_SCRIPTS
} from './vip-notification.js';
import {
  VIP_STRIP_STYLES,
  VIP_STRIP_HTML,
  VIP_STRIP_SCRIPTS
} from './vip-strip.js';

export const PAGE_FOOTER = `
  <!-- Floating Sidebar - Back to Top Only -->
  <div class="floating-sidebar">
    <button class="sidebar-btn back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Back to Top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <span class="sidebar-tooltip">Back to Top</span>
    </button>
  </div>

  <footer class="page-footer">
    <div class="footer-inner">

      <!-- Main Footer Grid - 5 columns -->
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-brand">
          <a href="/" class="footer-logo">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="footerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#e50914"/>
                  <stop offset="100%" style="stop-color:#ff3b30"/>
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="36" height="36" fill="url(#footerGradient)"/>
              <rect x="4" y="8" width="28" height="18" fill="#0a0a0a"/>
              <path d="M14 12 L24 17 L14 22 Z" fill="#fff"/>
            </svg>
            <span>IPTV<span>Search</span></span>
          </a>
          <p class="footer-tagline">Free IPTV Channel Directory<br>Search & Watch Instantly</p>
          <div class="footer-brand-bottom">
            <div class="footer-disclaimer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>This site does not host any IPTV streams. All channels are sourced from publicly available M3U playlists. Channels may go offline at any time.</span>
            </div>
            <div class="footer-badges">
              <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">
                <img src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/CHOl0sUhrumCxOXfRotGt/081f81d52274080b2d026fdf163e3009/cloudflare-icon-color_3x.png" alt="Cloudflare">
              </a>
              <span>Powered by Cloudflare</span>
            </div>
          </div>
          <div class="footer-copyright">&copy; 2026 IPTV Search. All rights reserved.</div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="footer-col-title">Quick Links</h4>
          <div class="footer-col-links">
            <a href="/tutorial">How to Watch on TV</a>
            <a href="/carplay-aptv">APTV & CarPlay Guide</a>
            <a href="/sitemap.xml">Sitemap</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="mailto:support@iptv-search.com">Contact Us</a>
          </div>
        </div>

        <!-- Support -->
        <div class="footer-col">
          <h4 class="footer-col-title">Support</h4>
          <div class="footer-col-links">
            <a href="/subscription">Subscription Plans</a>
            <a href="/favorites">My Favorites</a>
            <a href="/account">My Account</a>
            <a href="/search">Search Channels</a>
          </div>
        </div>

        <!-- FAQ Column -->
        <div class="footer-col footer-faq-col">
          <h4 class="footer-col-title">FAQ</h4>
          <div class="footer-faq-list">
            <details class="footer-faq-item">
              <summary>How to watch for free?</summary>
              <div class="footer-faq-answer">Browse our directory, select a channel, and start watching instantly. No registration required.</div>
            </details>
            <details class="footer-faq-item">
              <summary>What devices supported?</summary>
              <div class="footer-faq-answer">Smart TVs, Roku, Firestick, Apple TV, computers, smartphones & tablets.</div>
            </details>
            <details class="footer-faq-item">
              <summary>Is IPTV legal?</summary>
              <div class="footer-faq-answer">We index public links. Users must comply with local laws in their region.</div>
            </details>
            <details class="footer-faq-item">
              <summary>Channel not playing?</summary>
              <div class="footer-faq-answer">Try refreshing, different player, or check your internet connection.</div>
            </details>
            <details class="footer-faq-item">
              <summary>How often updated?</summary>
              <div class="footer-faq-answer">Daily updates - dead links removed & new channels added regularly.</div>
            </details>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <div id="footer-ad-container"></div>

  <script>
    // 页脚广告延迟加载：先检查会员状态，是会员则不加载广告
    (function() {
      var footerAdContainer = document.getElementById('footer-ad-container');
      if (!footerAdContainer) return;

      fetch('/api/member/status')
        .then(function(response) { return response.json(); })
        .then(function(data) {
          if (data.isMember && data.adFreeEnabled) {
            return;
          }
          var script = document.createElement('script');
          script.src = 'https://nap5k.com/tag.min.js';
          script.dataset.zone = '10621634';
          footerAdContainer.appendChild(script);
        })
        .catch(function() {
          var script = document.createElement('script');
          script.src = 'https://nap5k.com/tag.min.js';
          script.dataset.zone = '10621634';
          footerAdContainer.appendChild(script);
        });
    })();
  </script>

  <style>
    /* Footer - 极简线条风格 */
    .page-footer {
      background: var(--bg-primary);
      border-top: var(--border);
      padding: 0;
      margin-top: 2rem;
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr repeat(3, 1fr);
      gap: 2.5rem;
      padding: 3rem 0;
    }

    .footer-brand { }
    .footer-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-decoration: none;
      color: var(--text-primary);
    }
    .footer-logo svg { width: 32px; height: 32px; }
    .footer-logo span span { color: var(--accent); }
    .footer-tagline {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-top: 0.75rem;
    }
    .footer-brand-bottom {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.25rem;
    }
    .footer-brand .footer-disclaimer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .footer-brand .footer-disclaimer svg { flex-shrink: 0; opacity: 0.6; }

    .footer-brand .footer-badges {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .footer-brand .footer-badges img { height: 14px; width: auto; opacity: 0.7; transition: opacity 0.2s; }
    .footer-brand .footer-badges img:hover { opacity: 1; }
    .footer-brand .footer-badges span { font-size: 0.75rem; color: var(--text-muted); }

    .footer-brand .footer-copyright {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }

    .footer-col { }
    .footer-col-title {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }
    .footer-col-links {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .footer-col-links a {
      font-size: 0.9rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-col-links a:hover { color: var(--accent); }

    /* FAQ Column - Compact */
    .footer-faq-col { }
    .footer-faq-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .footer-faq-item {
      background: transparent;
      border: none;
      border-radius: 0;
    }
    .footer-faq-item summary {
      padding: 0.4rem 0.5rem;
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 0.85rem;
      list-style: none;
    }
    .footer-faq-item summary::-webkit-details-marker { display: none; }
    .footer-faq-item summary:hover {
      color: var(--text-primary);
      background: var(--bg-hover);
    }
    .footer-faq-item[open] summary { color: var(--accent); }
    .footer-faq-answer {
      padding: 0.5rem 0.5rem 0.5rem 1rem;
      font-size: 0.8rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    /* Floating Sidebar - 极简线条 */
    .floating-sidebar {
      position: fixed;
      right: 20px;
      bottom: 30px;
      z-index: 9999;
    }
    .sidebar-btn {
      width: 48px;
      height: 48px;
      border-radius: 0;
      border: 1px solid var(--border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.2s ease;
      background: transparent;
    }
    .sidebar-btn:hover {
      border-color: var(--accent);
      background: var(--bg-hover);
    }
    .sidebar-btn:active {
      transform: scale(0.98);
    }
    .sidebar-btn svg {
      width: 20px;
      height: 20px;
      color: var(--text-primary);
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
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border);
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .sidebar-tooltip::after {
      content: '';
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-left-color: var(--border);
    }
    .sidebar-btn:hover .sidebar-tooltip {
      opacity: 1;
      transform: translateY(-50%) translateX(-4px);
    }

    @media (max-width: 768px) {
      .page-footer {
        padding: 0;
      }
      .footer-inner { padding: 0 1.5rem; }
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        padding: 2.5rem 0;
      }
      .footer-brand {
        grid-column: 1 / -1;
      }
      .footer-brand-bottom { align-items: center; }
      .footer-disclaimer { flex-direction: column; text-align: center; gap: 0.75rem; }
      .footer-badges { justify-content: center; }
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

    @media (max-width: 480px) {
      .footer-inner { padding: 0 1rem; }
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 2rem 0;
      }
      .footer-brand { grid-column: 1; text-align: center; }
      .footer-logo { justify-content: center; }
      .footer-brand-bottom { align-items: center; }
      .footer-disclaimer { flex-direction: column; text-align: center; gap: 0.5rem; }
      .footer-badges { justify-content: center; }
      .footer-tagline { text-align: center; }
      .footer-col-title { text-align: center; }
      .footer-col-links { align-items: center; }
    }

    /* VIP Sticky Strip — persistent bottom offer */
    ${VIP_STRIP_STYLES}
    /* VIP Notification Toast — FOMO nudge */
    ${VIP_NOTIFICATION_STYLES}
  </style>

  <!-- Translate.js 自动翻译 (仅非英文浏览器加载，避免隐私外发 + ~80KB) -->
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

    // 仅在浏览器语言非英文时加载 translate.js（页面本身就是英文）
    (function() {
      var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      if (lang.indexOf('en') === 0) return;
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js';
      s.onload = initTranslate;
      document.head.appendChild(s);
    })();

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
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
          }
        };
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
      }
    });
  </script>

  <!-- VIP Notification Toast — FOMO social-proof nudge -->
  ${VIP_NOTIFICATION_HTML}
  <script>
    ${VIP_NOTIFICATION_SCRIPTS}
  </script>

  <!-- VIP Sticky Strip — persistent bottom offer (deconflicted from FOMO) -->
  ${VIP_STRIP_HTML}
  <script>
    ${VIP_STRIP_SCRIPTS}
  </script>
`;
