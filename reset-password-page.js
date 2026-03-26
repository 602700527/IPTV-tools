export const RESET_PASSWORD_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - IPTV Live</title>
  <meta name="description" content="Reset your IPTV Live password. Enter your email to receive a password reset link.">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://iptv-search.com/reset-password">
  <link rel="alternate" hreflang="zh-CN" href="https://iptv-search.com/reset-password">
  <link rel="alternate" hreflang="en" href="https://iptv-search.com/reset-password?lang=en">
  <link rel="alternate" hreflang="x-default" href="https://iptv-search.com/reset-password?lang=en">
  <meta property="og:title" content="Reset Password - IPTV Live">
  <meta property="og:description" content="Reset your IPTV Live password. Enter your email to receive a password reset link.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com/reset-password">
  <meta property="og:image" content="https://iptv-search.com/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="IPTV Live">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Reset Password - IPTV Live">
  <meta name="twitter:description" content="Reset your IPTV Live password. Enter your email to receive a password reset link.">
  <meta name="twitter:image" content="https://iptv-search.com/og-homepage.png">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 40px;
      max-width: 450px;
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
      color: #fff;
      font-size: 28px;
      font-weight: 700;
    }
    .logo span {
      color: #e50914;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-label {
      display: block;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 500;
    }
    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      font-size: 15px;
      transition: all 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: #e50914;
      background: rgba(255, 255, 255, 0.1);
    }
    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
    .form-input.error {
      border-color: #ff3b30;
    }
    .form-error {
      color: #ff3b30;
      font-size: 13px;
      display: none;
      margin-top: 5px;
    }
    .form-error.show {
      display: block;
    }
    .form-help {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 5px;
    }
    .btn-primary {
      width: 100%;
      padding: 14px 20px;
      background: linear-gradient(135deg, #e50914 0%, #b81d24 100%);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      -webkit-tap-highlight-color: transparent;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
    }
    .btn-primary:active {
      transform: translateY(0);
      scale: 0.98;
    }
    .btn-primary:disabled {
      background: rgba(229, 9, 20, 0.3);
      cursor: not-allowed;
      transform: none;
      scale: 1;
      box-shadow: none;
    }
    .success-message {
      text-align: center;
      color: #34c759;
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(52, 199, 89, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(52, 199, 89, 0.3);
    }
    .error-message {
      text-align: center;
      color: #ff3b30;
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(255, 59, 48, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(255, 59, 48, 0.3);
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
    .footer a {
      color: #e50914;
      text-decoration: none;
      font-weight: 500;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      .container {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      IPTV<span>Live</span>
    </div>

    <div id="resetForm">
      <h2 style="color: #fff; text-align: center; margin-bottom: 20px;">Reset Password</h2>
       
      <div class="form-group">
        <label class="form-label">New Password</label>
        <input type="password" class="form-input" id="newPassword" placeholder="Enter new password (at least 8 characters)">
        <div class="form-help">Password must be at least 8 characters, recommend including uppercase and lowercase letters and numbers</div>
        <div class="form-error" id="newPasswordError"></div>
      </div>

      <div class="form-group">
        <label class="form-label">Confirm Password</label>
        <input type="password" class="form-input" id="confirmPassword" placeholder="Enter password again">
        <div class="form-error" id="confirmPasswordError"></div>
      </div>

      <button class="btn-primary" id="submitBtn" disabled>Reset Password</button>
      
      <div class="footer">
        <a href="/">Back to Home</a>
      </div>
    </div>

    <div id="successMessage" style="display: none;">
      <div class="success-message">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 10px;">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <p>Password reset successfully!</p>
        <p style="font-size: 14px; color: rgba(52, 199, 89, 0.8); margin-top: 5px;">Redirecting to login page...</p>
      </div>
    </div>

    <div id="errorMessage" style="display: none;">
      <div class="error-message">
        <p id="errorText"></p>
      </div>
      <button class="btn-primary" id="retryBtn">Go Back and Try Again</button>
    </div>
  </div>

  <script>
    // 获取URL中的token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      document.getElementById('resetForm').style.display = 'none';
      document.getElementById('errorMessage').style.display = 'block';
      document.getElementById('errorText').textContent = 'Invalid reset link, please request a new password reset.';
    }

    // Add event listeners
    document.getElementById('newPassword').addEventListener('input', validatePassword);
    document.getElementById('confirmPassword').addEventListener('input', validatePassword);
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);
    document.getElementById('retryBtn').addEventListener('click', () => {
      window.location.href = '/reset-password';
    });

    function validatePassword() {
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const submitBtn = document.getElementById('submitBtn');
      const newPasswordError = document.getElementById('newPasswordError');
      const confirmPasswordError = document.getElementById('confirmPasswordError');

      let isValid = true;

      // Validate new password
      if (newPassword.length < 8) {
        newPasswordError.textContent = 'Password must be at least 8 characters';
        newPasswordError.classList.add('show');
        document.getElementById('newPassword').classList.add('error');
        isValid = false;
      } else {
        newPasswordError.textContent = '';
        newPasswordError.classList.remove('show');
        document.getElementById('newPassword').classList.remove('error');
      }

      // Validate confirm password
      if (confirmPassword && confirmPassword !== newPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        confirmPasswordError.classList.add('show');
        document.getElementById('confirmPassword').classList.add('error');
        isValid = false;
      } else {
        confirmPasswordError.textContent = '';
        confirmPasswordError.classList.remove('show');
        document.getElementById('confirmPassword').classList.remove('error');
      }

      submitBtn.disabled = !isValid || !newPassword || !confirmPassword;
    }

    async function handleSubmit() {
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const submitBtn = document.getElementById('submitBtn');

      if (newPassword !== confirmPassword) {
        showToast('两次输入的密码不一致', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = '正在处理...';

      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token,
            new_password: newPassword
          })
        });

        const result = await response.json();

        if (result.success) {
          document.getElementById('resetForm').style.display = 'none';
          document.getElementById('successMessage').style.display = 'block';
          
          // 3秒后跳转到登录页面
          setTimeout(() => {
            window.location.href = '/?login=true';
          }, 3000);
        } else {
          throw new Error(result.error || '重置失败');
        }
      } catch (error) {
        showToast(error.message || '重置失败，请稍后重试', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '重置密码';
      }
    }

    function showToast(message, type = 'success') {
      // 简单的提示
      const container = document.querySelector('.container');
      const toast = document.createElement('div');
      toast.style.cssText = \`
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: \${type === 'error' ? '#ff3b30' : '#34c759'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      \`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  </script>
  
<!-- Translate.js 自动翻译 -->
<script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
<script>
  function initTranslate() {
    if (typeof translate !== 'undefined' && !window.translate) {
      window.translate = translate;
    }
    if (typeof translate !== 'undefined' && translate.language) {
      translate.language.setLocal('chinese_simplified');
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
</body>
</html>
`;
