// VIP Notification Toast — FOMO / social-proof nudge
// Shows "🎉 X just unlocked VIP" notifications to drive conversions.
// Random interval 30s – 5min. Self-injects on init.

export const VIP_NOTIFICATION_STYLES = `
  /* VIP Notification Toast — fixed bottom-right, slides up over sidebar */
  .vip-toast {
    position: fixed;
    right: 24px;
    bottom: 150px;
    z-index: 9998;
    max-width: 320px;
    min-width: 260px;
    background: rgba(15, 15, 15, 0.94);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(229, 9, 20, 0.28);
    border-radius: 12px;
    padding: 14px 38px 14px 14px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 0 24px rgba(229,9,20,0.18);
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    transform: translateY(140%);
    opacity: 0;
    transition: transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.4s ease;
    pointer-events: auto;
  }
  .vip-toast.vip-toast-visible { transform: translateY(0); opacity: 1; }
  .vip-toast-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e50914, #b81d24);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 0 18px rgba(229,9,20,0.55);
  }
  .vip-toast-icon svg { width: 20px; height: 20px; }
  .vip-toast-body { flex: 1; min-width: 0; line-height: 1.4; }
  .vip-toast-title {
    font-size: 0.88rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 2px;
  }
  .vip-toast-name { color: #ff5566; font-weight: 700; }
  .vip-toast-msg {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.78);
  }
  .vip-toast-meta {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.5);
    margin-top: 4px;
    line-height: 1.35;
  }
  .vip-toast-cta {
    display: inline-block;
    margin-top: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #ff5566;
    text-decoration: none;
    transition: color 0.2s;
  }
  .vip-toast-cta:hover { color: #ff8a99; text-decoration: underline; }
  .vip-toast-close {
    position: absolute;
    top: 6px;
    right: 8px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 4px 6px;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
  }
  .vip-toast-close:hover { color: #fff; background: rgba(255,255,255,0.1); }
  @media (prefers-reduced-motion: reduce) {
    .vip-toast { transition: opacity 0.01ms; transform: none; }
  }
  @media (max-width: 768px) {
    .vip-toast { right: 12px; left: 12px; bottom: 90px; max-width: none; min-width: 0; }
  }
  @media (max-width: 480px) {
    .vip-toast { bottom: 16px; }
  }
`;

export const VIP_NOTIFICATION_HTML = `
  <div class="vip-toast" id="vipToast" role="status" aria-live="polite" hidden>
    <button class="vip-toast-close" aria-label="Close notification" type="button">×</button>
    <div class="vip-toast-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z"/>
      </svg>
    </div>
    <div class="vip-toast-body">
      <div class="vip-toast-title"><span class="vip-toast-name" id="vipToastName"></span></div>
      <div class="vip-toast-msg" id="vipToastMsg"></div>
      <div class="vip-toast-meta" id="vipToastMeta"></div>
      <a href="/subscription" class="vip-toast-cta" id="vipToastCta">View VIP Plans →</a>
    </div>
  </div>
`;

export const VIP_NOTIFICATION_SCRIPTS = `
(function() {
  if (window.__vipToastInited) return;
  window.__vipToastInited = true;

  // Pools — all PII-masked (no real users). Names use English-style city+salutation, masked emails.
  var TEMPLATES = [
    { name: 'Mr. Zhang from Beijing',    msg: '🎉 just unlocked VIP',           meta: '5,000+ channels · 4K · no ads' },
    { name: 'j***8@gmail.com',           msg: '🎉 activated VIP access',         meta: 'now watching Premier League live' },
    { name: 'Ms. Li from Shanghai',      msg: '🎉 renewed yearly VIP',           meta: 'saved 40% · multi-device sync' },
    { name: 'Mr. Wang from Shenzhen',    msg: '🎉 just unlocked VIP',           meta: '4K quality · ad-free streaming' },
    { name: 'Ms. Chen from Guangzhou',   msg: '🎉 upgraded to VIP',             meta: 'now watching CCTV Spring Festival Gala' },
    { name: 'z***9@qq.com',              msg: '🎉 started monthly VIP',          meta: 'can now download all channels' },
    { name: 'Mr. Zhou from Hangzhou',    msg: '🎉 activated all VIP benefits',   meta: 'now watching NBA Finals live' },
    { name: 'Ms. Huang from Chengdu',    msg: '🎉 just renewed VIP',            meta: '7-day free VIP · new user special' },
    { name: "Mr. Liu from Xi'an",        msg: '🎉 signed up for yearly VIP',     meta: 'priority support · dedicated 4K source' },
    { name: 'Ms. Wu from Nanjing',       msg: '🎉 just unlocked VIP',           meta: 'now watching CCTV-1 Spring Gala replay' },
    { name: 'Mr. Xu from Wuhan',         msg: '🎉 activated all VIP benefits',   meta: 'now watching UEFA Champions Final live' },
    { name: 'u***@163.com',              msg: '🎉 just renewed VIP',            meta: 'multi-device sync · 7-day refund' },
    { name: 'c***2@outlook.com',         msg: '🎉 signed up for yearly VIP',     meta: '5,000+ channels · lifetime priority support' },
    { name: 'Mr. Zheng from Kunming',    msg: '🎉 upgraded to VIP',             meta: 'now watching World Cup Final live' },
    { name: 'l***7@gmail.com',           msg: '🎉 just unlocked VIP',           meta: '4K quality · multi-device sync' }
  ];

  var toast      = document.getElementById('vipToast');
  var nameEl     = document.getElementById('vipToastName');
  var msgEl      = document.getElementById('vipToastMsg');
  var metaEl     = document.getElementById('vipToastMeta');
  var closeBtn   = toast ? toast.querySelector('.vip-toast-close') : null;
  var hideTimer  = null;
  var nextTimer  = null;

  if (!toast) return;

  function pickTemplate() {
    return TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  }

  function showToast() {
    if (!toast || !toast.isConnected) return;
    var t = pickTemplate();
    nameEl.textContent = t.name;
    msgEl.textContent  = t.msg;
    metaEl.textContent = t.meta;
    toast.hidden = false;
    void toast.offsetWidth; // force reflow for transition
    toast.classList.add('vip-toast-visible');
    // Display ~15s (slight variation for natural feel)
    var displayMs = 14000 + Math.floor(Math.random() * 2000);
    hideTimer = setTimeout(hideToast, displayMs);
  }

  function hideToast() {
    if (!toast) return;
    toast.classList.remove('vip-toast-visible');
    setTimeout(function() {
      if (toast) toast.hidden = true;
    }, 550);
    scheduleNext();
  }

  function scheduleNext() {
    // Random 30s – 5min (30,000 – 300,000 ms)
    var ms = 30000 + Math.floor(Math.random() * 270000);
    nextTimer = setTimeout(showToast, ms);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      if (hideTimer) clearTimeout(hideTimer);
      hideToast();
    });
  }

  // Pause auto-hide while user is reading / about to click CTA
  toast.addEventListener('mouseenter', function() {
    if (hideTimer) clearTimeout(hideTimer);
  });
  toast.addEventListener('mouseleave', function() {
    if (!toast.classList.contains('vip-toast-visible')) return;
    // Give 7s buffer after user moves cursor away (was 3s for shorter display)
    hideTimer = setTimeout(hideToast, 7000);
  });

  // First show after 25–80s (let the page settle, avoid first-paint clash)
  var firstDelay = 25000 + Math.floor(Math.random() * 55000);
  setTimeout(showToast, firstDelay);
})();
`;