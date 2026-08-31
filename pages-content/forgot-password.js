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
    --text-muted: #8b8b8b;
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.15);
    --glass-border: rgba(255, 255, 255, 0.08);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; min-height: 100vh; display: flex; flex-direction: column; transition: background var(--transition), color var(--transition); }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }
  button { cursor: pointer; font-family: inherit; }

  .main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 1.5rem 1rem; }

  .reset-card {
    width: 100%; max-width: 380px;
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.12);
    animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .reset-brand {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 16px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .reset-brand-logo {
    width: 24px; height: 24px; background: var(--accent);
    border-radius: var(--radius); display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .reset-brand-name { font-size: 13px; font-weight: 700; color: var(--text-primary); letter-spacing: 0.3px; }

  .reset-body { padding: 14px 16px; }

  .reset-header { margin-bottom: 12px; }
  .reset-header h1 { font-size: 1.1rem; font-weight: 700; margin-bottom: 2px; }
  .reset-header p { color: var(--text-secondary); font-size: 0.78rem; }

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

  .back-link {
    display: block; text-align: center; padding: 10px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 0.8rem;
  }
  .back-link a { color: var(--text-muted); transition: color var(--transition); }
  .back-link a:hover { color: var(--accent); }

  .toast {
    position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
    background: linear-gradient(145deg, #1a1a2e, #0a0a0f);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius); padding: 10px 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    opacity: 0; transition: opacity 0.3s; z-index: 1000;
    color: var(--text-primary); font-size: 12px; font-weight: 500;
    display: flex; align-items: center; gap: 8px;
  }
  .toast.show { opacity: 1; }
  .toast.success { border-color: rgba(52, 199, 89, 0.4); }
  .toast.error { border-color: rgba(239, 68, 68, 0.4); }

  @media (max-width: 480px) {
    .main { padding: 1rem 0.75rem; }
    .reset-card { max-width: 100%; }
    .reset-body { padding: 12px 14px; }
    .reset-brand { padding: 10px 14px 8px; }
  }
`;

export const content = `
<main class="main">
  <div class="reset-card">
    <div class="reset-brand">
      <div class="reset-brand-logo">▶</div>
      <span class="reset-brand-name">IPTV Search</span>
    </div>

    <div class="reset-body">
      <div class="reset-header">
        <h1>Reset Password</h1>
        <p>Enter your email to receive a reset code</p>
      </div>

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
    </div>

    <div class="back-link">
      <a href="/login">← Back to Login</a>
    </div>
  </div>
</main>

<div class="toast" id="toast"></div>

<script>
const API_BASE = '/api/auth';

function showToast(message, type) {
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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Code sent to your email!', 'success');
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

function handleSubmit(event) {
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span><span>Resetting...</span>';

  const email = document.getElementById('email').value;
  const code = document.getElementById('code').value;
  const newPassword = document.getElementById('newPassword').value;

  try {
    const response = await fetch(API_BASE + '/reset-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Password reset successful!', 'success');
      setTimeout(() => { window.location.href = '/login'; }, 1500);
    } else {
      showToast(data.error || 'Reset failed', 'error');
      btn.disabled = false; btn.innerHTML = originalContent;
    }
  } catch (error) {
    showToast('Reset failed', 'error');
    btn.disabled = false; btn.innerHTML = originalContent;
  }
}
</script>`;
