// VIP Notification Toast — FOMO / social-proof nudge
// Shows "🎉 X just unlocked VIP" notifications to drive conversions.
// Locale-aware pools, context-aware gating, session-capped.
// Self-injects on init.

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
  <div class="vip-toast notranslate" id="vipToast" role="status" aria-live="polite" translate="no" hidden>
    <button class="vip-toast-close notranslate" aria-label="Close notification" type="button" translate="no">×</button>
    <div class="vip-toast-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z"/>
      </svg>
    </div>
    <div class="vip-toast-body notranslate" translate="no">
      <div class="vip-toast-title"><span class="vip-toast-name notranslate" id="vipToastName" translate="no"></span></div>
      <div class="vip-toast-msg notranslate" id="vipToastMsg" translate="no"></div>
      <div class="vip-toast-meta notranslate" id="vipToastMeta" translate="no"></div>
      <a href="/subscription" class="vip-toast-cta notranslate" id="vipToastCta" translate="no">View VIP Plans →</a>
    </div>
  </div>
`;

export const VIP_NOTIFICATION_SCRIPTS = `
(function() {
  if (window.__vipToastInited) return;
  window.__vipToastInited = true;

  // Locale-aware pools — real-sounding personas, no fake-looking ***N@domain pattern.
  var POOLS = {
    en: [
      { name: 'James from Manchester',    msg: '🎉 just unlocked VIP',          meta: '5,000+ channels · 4K · no ads' },
      { name: 'Sarah from New York',      msg: '🎉 activated VIP access',       meta: 'now watching Premier League live' },
      { name: 'Priya from Mumbai',        msg: '🎉 just unlocked VIP',          meta: '5,000+ channels · multi-device sync' },
      { name: 'Lukas from Berlin',        msg: '🎉 signed up for yearly VIP',   meta: 'saving 40% · priority support' },
      { name: 'Carlos from Toronto',      msg: '🎉 renewed VIP membership',     meta: '4K quality · 7-day refund' },
      { name: 'Yuki from Sydney',         msg: '🎉 upgraded to VIP',            meta: 'now watching Australian Open live' },
      { name: 'Aisha from Dubai',         msg: '🎉 just unlocked VIP',          meta: '8,000+ channels · no ads · 4K' }
    ],
    zh: [
      { name: '北京 张先生',   msg: '🎉 刚刚开通了 VIP',     meta: '8,000+ 频道 · 4K · 无广告' },
      { name: '上海 李女士',   msg: '🎉 解锁了全部 VIP 权益', meta: '正在观看英超直播' },
      { name: '深圳 王先生',   msg: '🎉 续费了年度 VIP',     meta: '享 6 折优惠 · 多设备同步' },
      { name: '广州 陈女士',   msg: '🎉 刚刚开通了 VIP',     meta: '正在观看央视春晚' },
      { name: '杭州 周先生',   msg: '🎉 升级到了 VIP',       meta: '正在观看 NBA 总决赛' },
      { name: '成都 黄女士',   msg: '🎉 刚刚续费了 VIP',     meta: '7 天免费 · 享终身客服' },
      { name: '武汉 徐先生',   msg: '🎉 解锁了全部 VIP 权益', meta: '正在观看欧冠决赛' }
    ],
    pt: [
      { name: 'Carlos de São Paulo',   msg: '🎉 acabou de liberar VIP',         meta: '5.000+ canais · 4K · sem anúncios' },
      { name: 'Ana do Rio de Janeiro', msg: '🎉 ativou acesso VIP',            meta: 'sincronização em vários dispositivos' },
      { name: 'Pedro de Lisboa',       msg: '🎉 acabou de assinar VIP anual',  meta: 'economize 40% · suporte prioritário' },
      { name: 'Luís do Porto',         msg: '🎉 renovou o VIP',                meta: 'reembolso em 7 dias · cancele a qualquer momento' }
    ],
    es: [
      { name: 'Miguel de Madrid',      msg: '🎉 acaba de activar VIP',         meta: '5.000+ canales · 4K · sin anuncios' },
      { name: 'Sofía de Buenos Aires', msg: '🎉 renovó el VIP anual',          meta: 'ahorra 40% · soporte prioritario' },
      { name: 'Pablo de Barcelona',    msg: '🎉 acaba de desbloquear VIP',     meta: 'sincronización multi-dispositivo' }
    ]
  };

  function pickPool() {
    var lang = (navigator.language || 'en').toLowerCase();
    if (lang.indexOf('zh') === 0) return POOLS.zh;
    if (lang.indexOf('pt') === 0) return POOLS.pt;
    if (lang.indexOf('es') === 0) return POOLS.es;
    return POOLS.en;
  }

  // --- Context guards ------------------------------------------------------
  var path = window.location.pathname;
  var DENY_PATHS = ['/subscription', '/plans', '/login', '/account', '/admin'];
  for (var i = 0; i < DENY_PATHS.length; i++) {
    if (path.indexOf(DENY_PATHS[i]) === 0) return;
  }

  // Logged-in user: skip nudge entirely
  try {
    var hasAuth = !!localStorage.getItem('auth_token') ||
                  document.cookie.indexOf('auth_token=') !== -1;
    if (hasAuth) return;
  } catch (e) { /* localStorage may be blocked */ }

  // 24h suppression after × close
  try {
    var lastClose = parseInt(localStorage.getItem('vip_toast_last_close') || '0', 10);
    if (lastClose && (Date.now() - lastClose) < 24 * 60 * 60 * 1000) return;
  } catch (e) { /* ignore */ }

  // Session cap (3 per session)
  var SESSION_CAP = 3;
  var shown = parseInt(sessionStorage.getItem('vip_toasts_shown') || '0', 10);
  if (shown >= SESSION_CAP) return;

  var toast      = document.getElementById('vipToast');
  var nameEl     = document.getElementById('vipToastName');
  var msgEl      = document.getElementById('vipToastMsg');
  var metaEl     = document.getElementById('vipToastMeta');
  var closeBtn   = toast ? toast.querySelector('.vip-toast-close') : null;
  var hideTimer  = null;
  var nextTimer  = null;

  if (!toast) return;

  var pool = pickPool();

  function pickTemplate() {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function showToast() {
    if (!toast || !toast.isConnected) return;
    if (shown >= SESSION_CAP) return;
    var t = pickTemplate();
    nameEl.textContent = t.name;
    msgEl.textContent  = t.msg;
    metaEl.textContent = t.meta;
    toast.hidden = false;
    void toast.offsetWidth; // force reflow for transition
    toast.classList.add('vip-toast-visible');
    shown++;
    try { sessionStorage.setItem('vip_toasts_shown', String(shown)); } catch (e) {}
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
    if (shown < SESSION_CAP) scheduleNext();
  }

  function scheduleNext() {
    // 90s – 5min after dismissal (was 30s – 5min; 30s trained users to ignore)
    var ms = 90000 + Math.floor(Math.random() * 210000);
    nextTimer = setTimeout(showToast, ms);
  }

  function userClose() {
    try { localStorage.setItem('vip_toast_last_close', String(Date.now())); } catch (e) {}
    if (hideTimer) clearTimeout(hideTimer);
    if (nextTimer) clearTimeout(nextTimer);
    hideToast();
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', userClose);
  }

  // Pause auto-hide while user is reading / about to click CTA
  toast.addEventListener('mouseenter', function() {
    if (hideTimer) clearTimeout(hideTimer);
  });
  toast.addEventListener('mouseleave', function() {
    if (!toast.classList.contains('vip-toast-visible')) return;
    hideTimer = setTimeout(hideToast, 7000);
  });

  // First show after 25–80s (let the page settle, avoid first-paint clash)
  var firstDelay = 25000 + Math.floor(Math.random() * 55000);
  setTimeout(showToast, firstDelay);
})();
`;