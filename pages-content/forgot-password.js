// 静态页面内容模块 - 忘记密码页面
export const pageTitle = 'Forgot Password - IPTV Search';
export const pageDescription = 'Reset your IPTV Search account password.';

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
    --text-muted: #666666;
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.15);
    --shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  [data-theme="light"] {
    --bg-primary: #f5f5f5;
    --bg-secondary: #ffffff;
    --bg-card: #ffffff;
    --bg-hover: #f0f0f0;
    --text-primary: #1a1a1a;
    --text-secondary: #666666;
    --text-muted: #999999;
    --border: rgba(0,0,0,0.08);
    --border-hover: rgba(0,0,0,0.15);
    --shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; min-height: 100vh; display: flex; flex-direction: column; transition: background var(--transition), color var(--transition); }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }
  button { cursor: pointer; font-family: inherit; }
  .main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; }
  .form-container { width: 100%; max-width: 400px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; box-shadow: none; }
  .form-header { text-align: center; margin-bottom: 1.5rem; }
  .form-header h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
  .form-header p { color: var(--text-secondary); font-size: 0.9rem; }
  .google-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.875rem; background: #fff; border: none; border-radius: var(--radius); color: #333; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all var(--transition); margin-bottom: 1.5rem; }
  .google-btn:hover { background: #f5f5f5; }
  .google-btn svg { width: 20px; height: 20px; }
  .divider { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.85rem; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .form-group { margin-bottom: 1rem; }
  .form-label { display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-secondary); }
  .form-input { width: 100%; padding: 0.875rem; background: var(--bg-primary); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-primary); font-size: 0.95rem; transition: border-color var(--transition); }
  .form-input:focus { outline: none; border-color: var(--accent); }
  .form-input::placeholder { color: var(--text-muted); }
  .code-input-group { display: flex; gap: 0.5rem; }
  .code-input-group .form-input { flex: 1; }
  .send-code-btn { padding: 0 1rem; background: var(--bg-hover); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-primary); font-size: 0.8rem; white-space: nowrap; transition: all var(--transition); }
  .send-code-btn:hover { background: var(--accent); border-color: var(--accent); color: #fff; }
  .send-code-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .submit-btn { width: 100%; padding: 1rem; background: var(--accent); border: none; border-radius: var(--radius); color: #fff; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all var(--transition); margin-top: 0.5rem; }
  .submit-btn:hover { background: var(--accent-hover); }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .submit-btn .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 0.5rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .form-toggle { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-secondary); }
  .form-toggle a { color: var(--accent); font-weight: 500; }
  .form-toggle a:hover { text-decoration: underline; }
  .toast { position: fixed; top: 100px; left: 50%; transform: translateX(-50%); padding: 1rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: none; opacity: 0; transition: opacity 0.3s; z-index: 1000; }
  .toast.show { opacity: 1; }
  .toast.success { border-color: #22c55e; }
  .toast.error { border-color: #ef4444; }
  @media (max-width: 480px) { .main { padding: 1rem; } .form-container { padding: 1.5rem; } }
`;

export const content = `
<main class="main">
  <div class="form-container">
    <div class="form-header">
      <h1>Reset Password</h1>
      <p>Enter your email to receive a reset code</p>
    </div>

    <button type="button" class="google-btn" id="googleBtn" onclick="handleGoogleLogin()">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span>Continue with Google</span>
    </button>

    <div class="divider"><span>or</span></div>

    <form id="forgotForm" onsubmit="handleSubmit(event)">
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input type="email" id="email" class="form-input" placeholder="your@email.com" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="code">Verification Code</label>
        <div class="code-input-group">
          <input type="text" id="code" class="form-input" placeholder="6-digit code" required maxlength="6" pattern="\\d{6}">
          <button type="button" class="send-code-btn" id="sendCodeBtn" onclick="sendCode()">Send Code</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="newPassword">New Password</label>
        <input type="password" id="newPassword" class="form-input" placeholder="At least 8 characters" required minlength="8">
      </div>
      <button type="submit" class="submit-btn" id="submitBtn">
        <span>Reset Password</span>
      </button>
    </form>

    <div class="form-toggle">
      <a href="/login">Back to Login</a>
    </div>
  </div>
</main>

<div class="toast" id="toast"></div>

<script>
const API_BASE = '/api/auth';

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

let codeCooldown = 0;

async function sendCode() {
  const email = document.getElementById('email').value;
  const btn = document.getElementById('sendCodeBtn');
  if (!email) { showToast('Please enter your email', 'error'); return; }
  
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';

  try {
    const response = await fetch(API_BASE + '/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Code sent to your email!', 'success');
      codeCooldown = 60;
      startCooldown();
    } else {
      showToast(data.error || 'Failed to send code', 'error');
      btn.disabled = false;
      btn.textContent = originalText;
    }
  } catch (error) {
    showToast('Failed to send code', 'error');
    btn.disabled = false;
    btn.textContent = originalText;
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

async function handleGoogleLogin() {
  const btn = document.getElementById('googleBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span><span>Redirecting...</span>';
  try {
    const response = await fetch(API_BASE + '/google/init', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const data = await response.json();
    if (data.success && data.auth_url) window.location.href = data.auth_url;
    else { showToast(data.error || 'Failed', 'error'); btn.disabled = false; btn.innerHTML = originalContent; }
  } catch (error) { showToast('Failed', 'error'); btn.disabled = false; }
}

async function handleSubmit(event) {
  event.preventDefault();
  const btn = document.getElementById('submitBtn');
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span><span>Resetting...</span>';

  const email = document.getElementById('email').value;
  const code = document.getElementById('code').value;
  const newPassword = document.getElementById('newPassword').value;

  try {
    const response = await fetch(API_BASE + '/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Password reset successful!', 'success');
      setTimeout(() => { window.location.href = '/login'; }, 1500);
    } else {
      showToast(data.error || 'Reset failed', 'error');
      btn.disabled = false;
      btn.innerHTML = originalContent;
    }
  } catch (error) {
    showToast('Reset failed', 'error');
    btn.disabled = false;
    btn.innerHTML = originalContent;
  }
}
</script>`;