// 静态页面内容模块 - 登录/注册页面
export const pageTitle = 'Login - IPTV Search';
export const pageDescription = 'Login to your IPTV Search account to manage favorites and subscriptions.';

export const styles = `
  :root {
    --accent: #e50914;
    --accent-hover: #ff1a1a;
    --radius: 0;
    --transition: 0.2s ease;
    --bg-primary: #0a0a0a;
    --bg-secondary: #141414;
    --bg-card: #1a1a1a;
    --bg-hover: #252525;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --text-muted: #8b8b8b;
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.15);
    --glass-border: rgba(255, 255, 255, 0.08);
    --tier-gold: #ffd700;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; min-height: 100vh; display: flex; flex-direction: column; transition: background var(--transition), color var(--transition); }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }
  button { cursor: pointer; font-family: inherit; }

  .main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 1.5rem 1rem; }

  /* ===== 登录卡片 ===== */
  .login-card {
    width: 100%; max-width: 380px;
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.12);
    animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* 顶部品牌栏 */
  .login-brand {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 16px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .login-brand-logo {
    width: 24px; height: 24px; background: var(--accent);
    border-radius: var(--radius); display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .login-brand-name { font-size: 13px; font-weight: 700; color: var(--text-primary); letter-spacing: 0.3px; }

  /* 表单区域 */
  .login-body { padding: 14px 16px; }

  .login-header { margin-bottom: 12px; }
  .login-header h1 { font-size: 1.1rem; font-weight: 700; margin-bottom: 2px; }
  .login-header p { color: var(--text-secondary); font-size: 0.78rem; }

  /* Google 按钮 */
  .google-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    padding: 0.6rem; background: #fff; border: none;
    border-radius: var(--radius); color: #333; font-size: 0.85rem; font-weight: 500;
    cursor: pointer; transition: all var(--transition); margin-bottom: 0.75rem;
  }
  .google-btn:hover { background: #f5f5f5; }
  .google-btn svg { width: 16px; height: 16px; }

  .divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 0.75rem; color: var(--text-muted); font-size: 0.75rem;
  }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* 表单字段 */
  .form-group { margin-bottom: 0.625rem; }
  .form-label { display: block; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.25rem; color: var(--text-secondary); }
  .form-input {
    width: 100%; padding: 0.5625rem 0.75rem;
    background: var(--bg-primary); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--text-primary);
    font-size: 0.875rem; transition: border-color var(--transition);
  }
  .form-input:focus { outline: none; border-color: var(--accent); }
  .form-input::placeholder { color: var(--text-muted); }

  .code-input-group { display: flex; gap: 0.375rem; }
  .code-input-group .form-input { flex: 1; }
  .send-code-btn {
    padding: 0 0.625rem; background: var(--bg-hover); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--text-primary); font-size: 0.75rem;
    white-space: nowrap; transition: all var(--transition);
  }
  .send-code-btn:hover { background: var(--accent); border-color: var(--accent); color: #fff; }
  .send-code-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .submit-btn {
    width: 100%; padding: 0.6875rem; background: var(--accent); border: none;
    border-radius: var(--radius); color: #fff; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; transition: all var(--transition); margin-top: 0.125rem;
  }
  .submit-btn:hover { background: var(--accent-hover); }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .submit-btn .spinner {
    display: inline-block; width: 12px; height: 12px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 0.375rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* 辅助链接 */
  .forgot-link-wrap { text-align: center; margin-top: 0.5rem; }
  .forgot-link-wrap a { color: var(--text-muted); font-size: 0.8rem; transition: color var(--transition); }
  .forgot-link-wrap a:hover { color: var(--accent); }

  /* 登录/注册切换 */
  .form-toggle {
    display: flex; align-items: center; justify-content: center; gap: 4px;
    padding: 10px 16px; border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 0.8rem; color: var(--text-secondary);
  }
  .form-toggle a { color: var(--accent); font-weight: 600; }
  .form-toggle a:hover { text-decoration: underline; }

  .hidden-form { display: none; }

  /* Toast */
  .toast-container {
    position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
    z-index: 4000; display: flex; flex-direction: column; gap: 8px;
    padding: 0 16px; max-width: 400px; width: 100%; pointer-events: none;
  }
  .toast {
    background: linear-gradient(145deg, #1a1a2e, #0a0a0f);
    backdrop-filter: blur(20px);
    border-radius: var(--radius); padding: 10px 14px;
    border: 1px solid var(--glass-border);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    pointer-events: auto;
    animation: toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--text-primary); font-size: 12px; font-weight: 500;
    display: flex; align-items: center; gap: 8px;
  }
  .toast-icon { font-size: 14px; flex-shrink: 0; }
  .toast.success { border-color: rgba(52, 199, 89, 0.4); }
  .toast.success .toast-icon { color: #22c55e; }
  .toast.error { border-color: rgba(239, 68, 68, 0.4); }
  .toast.error .toast-icon { color: #ef4444; }
  @keyframes toastSlideIn {
    from { opacity: 0; transform: translateY(-12px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Trial modal */
  .trial-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; animation: fadeIn 0.2s ease;
  }
  .trial-modal {
    background: var(--bg-secondary); border: 1px solid var(--glass-border);
    border-radius: 8px; padding: 22px; max-width: 380px; width: 90%; text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .trial-modal h2 { margin: 0 0 8px; font-size: 1.2rem; color: var(--text-primary); }
  .trial-modal p { margin: 0 0 14px; color: var(--text-muted); font-size: 0.8rem; line-height: 1.5; }
  .trial-modal .trial-countdown { font-size: 2rem; font-weight: 700; color: var(--accent); margin: 4px 0 14px; }
  .trial-modal .trial-countdown small { display: block; font-size: 0.75rem; font-weight: 400; color: var(--text-muted); margin-top: 2px; }
  .trial-modal .trial-cta { display: block; padding: 10px 14px; margin-bottom: 5px; border-radius: 6px; font-weight: 600; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none; font-size: 0.875rem; width: 100%; }
  .trial-modal .trial-cta.primary { background: var(--accent); color: #fff; }
  .trial-modal .trial-cta.primary:hover { background: var(--accent-hover); }
  .trial-modal .trial-cta.secondary { background: transparent; color: var(--text-muted); border: 1px solid var(--glass-border); }
  .trial-modal .trial-cta.secondary:hover { color: var(--text-primary); }
  .trial-modal-trust-box {
    margin: -2px 0 12px; padding: 8px 10px;
    border: 1px solid rgba(34, 197, 94, 0.25); background: rgba(34, 197, 94, 0.04);
    border-radius: 5px; text-align: left;
  }
  .trial-modal-trust {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.75rem; color: var(--text-muted); line-height: 1.6;
  }
  .trial-trust-check {
    display: inline-flex; align-items: center; justify-content: center;
    width: 13px; height: 13px; border-radius: 50%;
    background: rgba(34, 197, 94, 0.18); color: #22c55e;
    font-size: 0.6rem; font-weight: 700; flex-shrink: 0;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  @media (max-width: 480px) {
    .main { padding: 1rem 0.75rem; }
    .login-card { max-width: 100%; }
    .login-body { padding: 12px 14px; }
    .login-brand { padding: 10px 14px 8px; }
  }
`;

export const content = `
<main class="main">
  <div class="login-card">
    <!-- 品牌栏 -->
    <div class="login-brand">
      <div class="login-brand-logo">▶</div>
      <span class="login-brand-name">IPTV Search</span>
    </div>

    <div class="login-body">
      <!-- 登录表单 -->
      <div id="loginPanel">
        <div class="login-header">
          <h1>Welcome Back</h1>
          <p>Login to manage your favorites and subscriptions</p>
        </div>

        <button type="button" class="google-btn" onclick="handleGoogleLogin('login')">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div class="divider"><span>or</span></div>

        <form onsubmit="handleLogin(event)">
          <div class="form-group">
            <label class="form-label" for="loginEmail">Email</label>
            <input type="email" id="loginEmail" class="form-input" placeholder="your@email.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="loginPassword">Password</label>
            <input type="password" id="loginPassword" class="form-input" placeholder="Enter password" required>
          </div>
          <button type="submit" class="submit-btn" id="loginSubmitBtn">
            <span>Login</span>
          </button>
        </form>

        <div class="forgot-link-wrap">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>

      <!-- 注册表单 -->
      <div id="registerPanel" style="display:none;">
        <div class="login-header">
          <h1>Create Account</h1>
          <p>Register to save favorites and get subscriptions</p>
        </div>

        <button type="button" class="google-btn" onclick="handleGoogleLogin('register')">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div class="divider"><span>or</span></div>

        <form onsubmit="handleRegister(event)">
          <div class="form-group">
            <label class="form-label" for="regEmail">Email</label>
            <input type="email" id="regEmail" class="form-input" placeholder="your@email.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="regPassword">Password</label>
            <input type="password" id="regPassword" class="form-input" placeholder="At least 8 characters" required minlength="8">
          </div>
          <div class="form-group">
            <label class="form-label" for="regCode">Verification Code</label>
            <div class="code-input-group">
              <input type="text" id="regCode" class="form-input" placeholder="6-digit code" required maxlength="6" pattern="\\d{6}">
              <button type="button" class="send-code-btn" id="sendCodeBtn" onclick="sendVerificationCode()">Send Code</button>
            </div>
          </div>
          <button type="submit" class="submit-btn" id="registerSubmitBtn">
            <span>Create Account</span>
          </button>
        </form>
      </div>
    </div>

    <!-- 底部切换 -->
    <div class="form-toggle">
      <span id="toggleText">Don't have an account?</span>
      <a href="#" id="toggleLink" onclick="switchTab('register'); return false;">Register</a>
    </div>
  </div>
</main>

<div class="toast-container" id="toastContainer"></div>

<!-- Trial welcome modal -->
<div class="trial-modal-overlay" id="trialModal" style="display:none;" role="dialog" aria-modal="true">
  <div class="trial-modal">
    <h2>🎉 7 Days of Free VIP!</h2>
    <p>Your trial VIP code is active. Use it on any device with ad-free streaming, HD quality, and 3 simultaneous connections.</p>
    <div class="trial-modal-trust-box">
      <div class="trial-modal-trust"><span class="trial-trust-check">✓</span> No credit card required</div>
      <div class="trial-modal-trust"><span class="trial-trust-check">✓</span> 7 days free, then from $9.99/mo</div>
      <div class="trial-modal-trust"><span class="trial-trust-check">✓</span> 5,000+ channels · 4K · no ads</div>
    </div>
    <div class="trial-countdown">
      <span id="trialDaysLeft">7</span>
      <small>days remaining</small>
    </div>
    <a href="/account" class="trial-cta primary">Open My M3U URL →</a>
    <button type="button" class="trial-cta secondary" id="trialModalDismiss">Browse channels first</button>
  </div>
</div>

<script>
const API_BASE = '/api/auth';

function switchTab(tab) {
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const toggleText = document.getElementById('toggleText');
  const toggleLink = document.getElementById('toggleLink');

  if (tab === 'login') {
    loginPanel.style.display = 'block';
    registerPanel.style.display = 'none';
    toggleText.textContent = "Don't have an account?";
    toggleLink.textContent = 'Register';
    toggleLink.onclick = () => { switchTab('register'); return false; };
  } else {
    loginPanel.style.display = 'none';
    registerPanel.style.display = 'block';
    toggleText.textContent = 'Already have an account?';
    toggleLink.textContent = 'Login';
    toggleLink.onclick = () => { switchTab('login'); return false; };
  }
}

// URL 参数 ?tab=register 直接打开注册
if (new URLSearchParams(window.location.search).get('tab') === 'register') {
  switchTab('register');
}

function showToast(message, type) {
  type = type || 'info';
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toastEl = document.createElement('div');
  toastEl.className = 'toast ' + type;
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  toastEl.innerHTML = '<span class="toast-icon">' + icons[type] + '</span><span>' + message + '</span>';
  container.appendChild(toastEl);
  setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateY(-10px)';
    setTimeout(() => toastEl.remove(), 300);
  }, 3000);
}

let codeCooldown = 0;

async function sendVerificationCode() {
  const email = document.getElementById('regEmail').value;
  const btn = document.getElementById('sendCodeBtn');
  if (!email) { showToast('Please enter your email first', 'error'); return; }
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { showToast('Please enter a valid email', 'error'); return; }

  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';

  try {
    const response = await fetch(API_BASE + '/send-code', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Verification code sent!', 'success');
      codeCooldown = 60;
      startCooldown();
    } else {
      showToast(data.error || 'Failed to send code', 'error');
      btn.disabled = false; btn.textContent = originalText;
    }
  } catch (error) {
    showToast('Failed to send code', 'error');
    btn.disabled = false; btn.textContent = originalText;
  }
}

function startCooldown() {
  const btn = document.getElementById('sendCodeBtn');
  if (codeCooldown > 0) {
    btn.textContent = codeCooldown + 's';
    codeCooldown--;
    setTimeout(startCooldown, 1000);
  } else {
    btn.textContent = 'Send Code';
    btn.disabled = false;
  }
}

async function handleGoogleLogin(source) {
  const btnId = source === 'login' ? 'loginPanel' : 'registerPanel';
  const btn = document.querySelector('#' + btnId + ' .google-btn');
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid rgba(0,0,0,0.3);border-top-color:#333;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:0.5rem;"></span><span>Redirecting...</span>';
  try {
    const response = await fetch(API_BASE + '/google/init', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (data.success && data.auth_url) {
      window.location.href = data.auth_url;
    } else {
      showToast(data.error || 'Failed to initiate Google login', 'error');
      btn.disabled = false; btn.innerHTML = originalContent;
    }
  } catch (error) {
    showToast('Failed to initiate Google login', 'error');
    btn.disabled = false; btn.innerHTML = originalContent;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const btn = document.getElementById('loginSubmitBtn');
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span><span>Logging in...</span>';

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(API_BASE + '/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('auth_token', data.token);
      sessionStorage.setItem('show_welcome_after_redirect', '1');
      showToast('Login successful!', 'success');
      const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';
      setTimeout(() => { window.location.href = redirect; }, 1000);
    } else {
      showToast(data.error || 'Login failed', 'error');
      btn.disabled = false; btn.innerHTML = originalContent;
    }
  } catch (error) {
    showToast('Login failed', 'error');
    btn.disabled = false; btn.innerHTML = originalContent;
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const btn = document.getElementById('registerSubmitBtn');
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span><span>Creating...</span>';

  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const code = document.getElementById('regCode').value;

  try {
    const response = await fetch(API_BASE + '/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, verification_code: code })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('auth_token', data.token);
      showToast('Account created!', 'success');
      if (data.trialCode && data.trialExpiredAt) {
        showTrialModal(data.trialCode, data.trialExpiredAt);
      } else {
        setTimeout(() => { window.location.href = '/'; }, 1000);
      }
    } else {
      showToast(data.error || 'Registration failed', 'error');
      btn.disabled = false; btn.innerHTML = originalContent;
    }
  } catch (error) {
    showToast('Registration failed', 'error');
    btn.disabled = false; btn.innerHTML = originalContent;
  }
}

function showTrialModal(trialCode, trialExpiredAt) {
  const modal = document.getElementById('trialModal');
  const daysEl = document.getElementById('trialDaysLeft');
  const dismiss = document.getElementById('trialModalDismiss');
  if (!modal || !daysEl) return;
  const ms = new Date(trialExpiredAt).getTime() - Date.now();
  const days = ms > 0 ? Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000))) : 0;
  daysEl.textContent = days;
  modal.style.display = 'flex';
  const close = () => { modal.style.display = 'none'; window.location.href = '/'; };
  if (dismiss && !dismiss.dataset.bound) {
    dismiss.addEventListener('click', close);
    dismiss.dataset.bound = '1';
  }
}
</script>`;
