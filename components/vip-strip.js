// VIP Sticky Strip — persistent bottom-of-screen VIP offer
// Companion to FOMO toast. Deconflicted via window.__vipStripVisible flag.
// First show 30s after load; once dismissed (×) or clicked (CTA), suppressed for 7 days.

export const VIP_STRIP_STYLES = `
  .vip-strip {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9997;
    background: rgba(15, 15, 15, 0.96);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(229, 9, 20, 0.4);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transform: translateY(100%);
    opacity: 0;
    transition: transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.4s ease;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 -8px 30px rgba(0,0,0,0.4);
  }
  .vip-strip.vip-strip-visible { transform: translateY(0); opacity: 1; }
  .vip-strip-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(135deg, #e50914, #b81d24);
    font-size: 1rem;
    color: #fff;
    box-shadow: 0 0 12px rgba(229, 9, 20, 0.45);
  }
  .vip-strip-text { flex: 1; min-width: 0; line-height: 1.3; }
  .vip-strip-text strong {
    font-size: 0.95rem;
    font-weight: 700;
    color: #fff;
    display: block;
    margin-bottom: 2px;
  }
  .vip-strip-meta {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.6);
  }
  .vip-strip-cta {
    flex-shrink: 0;
    padding: 0.6rem 1.5rem;
    background: var(--accent);
    color: #fff;
    font-weight: 700;
    font-size: 0.85rem;
    text-decoration: none;
    border-radius: 0;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .vip-strip-cta:hover { background: #ff1a1a; }
  .vip-strip-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
    padding: 6px 8px;
    transition: color 0.2s, background 0.2s;
  }
  .vip-strip-close:hover { color: #fff; background: rgba(255,255,255,0.1); }
  @media (prefers-reduced-motion: reduce) {
    .vip-strip { transition: opacity 0.01ms; transform: none; }
  }
  @media (max-width: 768px) {
    .vip-strip { padding: 10px 12px; gap: 10px; }
    .vip-strip-icon { width: 28px; height: 28px; font-size: 0.9rem; }
    .vip-strip-text strong { font-size: 0.85rem; }
    .vip-strip-meta { font-size: 0.7rem; }
    .vip-strip-cta { padding: 0.5rem 1rem; font-size: 0.78rem; }
  }
  @media (max-width: 380px) {
    .vip-strip-meta { display: none; }
  }
`;

export const VIP_STRIP_HTML = `
  <div class="vip-strip notranslate" id="vipStrip" role="region" aria-label="VIP offer" translate="no" hidden>
    <div class="vip-strip-icon notranslate" aria-hidden="true" translate="no">★</div>
    <div class="vip-strip-text notranslate" translate="no">
      <strong class="notranslate" translate="no">7 days free VIP</strong>
      <span class="vip-strip-meta notranslate" translate="no">&yen;20/mo · 8,000+ channels · 4K · no ads</span>
    </div>
    <a href="/subscription" class="vip-strip-cta notranslate" id="vipStripCta" translate="no">Get Free VIP &rarr;</a>
    <button class="vip-strip-close notranslate" aria-label="Dismiss offer" type="button" translate="no">&times;</button>
  </div>
`;

export const VIP_STRIP_SCRIPTS = `
(function() {
  if (window.__vipStripInited) return;
  window.__vipStripInited = true;

  var DEBUG = /[?&]vipdebug=1\b/.test(window.location.search);

  // Path denylist
  var DENY = ['/subscription', '/plans', '/login', '/account', '/admin'];
  var path = window.location.pathname;
  for (var i = 0; i < DENY.length; i++) {
    if (path.indexOf(DENY[i]) === 0) {
      console.info('[vip-strip] skipped: path=' + path);
      return;
    }
  }

  // Logged-in user: skip (already converted or higher funnel)
  try {
    var hasAuth = !!localStorage.getItem('auth_token') ||
                  document.cookie.indexOf('auth_token=') !== -1;
    if (hasAuth && !DEBUG) {
      console.info('[vip-strip] skipped: logged in (add ?vipdebug=1 to force)');
      return;
    }
  } catch (e) {}

  // 7-day suppression after × close
  try {
    var lastClose = parseInt(localStorage.getItem('vip_strip_last_close') || '0', 10);
    if (lastClose && (Date.now() - lastClose) < 7 * 24 * 60 * 60 * 1000 && !DEBUG) {
      var hoursAgo = Math.round((Date.now() - lastClose) / 3600000);
      console.info('[vip-strip] skipped: closed ' + hoursAgo + 'h ago (add ?vipdebug=1 to force)');
      return;
    }
  } catch (e) {}

  var strip    = document.getElementById('vipStrip');
  var cta      = strip ? strip.querySelector('.vip-strip-cta') : null;
  var closeBtn = strip ? strip.querySelector('.vip-strip-close') : null;
  if (!strip) return;

  window.__vipStripVisible = false;

  function show() {
    if (!strip || strip.hidden === false) return;
    // Defer if FOMO toast is currently visible
    if (window.__vipToastVisible) {
      setTimeout(show, 30000);
      return;
    }
    strip.hidden = false;
    void strip.offsetWidth; // force reflow
    strip.classList.add('vip-strip-visible');
    window.__vipStripVisible = true;
  }

  function dismiss(reason) {
    try {
      localStorage.setItem('vip_strip_last_close', String(Date.now()));
    } catch (e) {}
    strip.classList.remove('vip-strip-visible');
    setTimeout(function() { strip.hidden = true; }, 500);
    window.__vipStripVisible = false;
  }

  if (closeBtn) closeBtn.addEventListener('click', function() { dismiss('close'); });
  if (cta) cta.addEventListener('click', function() { dismiss('cta'); });

  // First show after 30s (let page settle, hero gets the spotlight first).
  // In debug mode (?), show after 5s.
  var firstDelay = DEBUG ? 5000 : 30000;
  console.info('[vip-strip] init OK; first show in ' + (firstDelay/1000) + 's' + (DEBUG ? ' [DEBUG]' : ''));
  setTimeout(show, firstDelay);
})();
`;