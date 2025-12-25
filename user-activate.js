// 用户卡密激活页面内容
export const USER_ACTIVATE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>卡密激活 - 电视直播服务</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
    .container{background:white;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:40px;max-width:480px;width:100%}
    .logo{text-align:center;margin-bottom:30px}
    .logo h1{font-size:28px;font-weight:700;color:#1d1d1f;margin-bottom:8px}
    .logo p{color:#86868b;font-size:14px}
    .form-group{margin-bottom:20px}
    .form-group label{display:block;margin-bottom:8px;font-weight:500;color:#1d1d1f;font-size:14px}
    .form-group input{width:100%;padding:14px 16px;border:2px solid #e5e5ea;border-radius:8px;font-size:16px;transition:border-color .2s;letter-spacing:1px}
    .form-group input:focus{outline:none;border-color:#667eea}
    .btn{width:100%;padding:14px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:transform .2s,box-shadow .2s}
    .btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(102,126,234,.4)}
    .btn:active{transform:translateY(0)}
    .btn:disabled{background:#d2d2d7;cursor:not-allowed;transform:none}
    .error{color:#ff3b30;text-align:center;margin-bottom:12px;font-size:14px;display:none;padding:12px;background:#ffebee;border-radius:8px}
    .success{color:#34c759;text-align:center;margin-bottom:12px;font-size:14px;display:none;padding:12px;background:#e8f5e9;border-radius:8px}
    .result{display:none;margin-top:30px;padding:24px;background:#f5f5f7;border-radius:12px}
    .result.active{display:block}
    .result h3{font-size:18px;font-weight:600;margin-bottom:16px;color:#1d1d1f}
    .info-item{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e5e5ea}
    .info-item:last-child{border-bottom:none}
    .info-label{color:#86868b;font-size:14px}
    .info-value{color:#1d1d1f;font-weight:500;font-size:14px}
    .sub-url-container{margin-top:16px;padding:16px;background:#667eea;border-radius:8px}
    .sub-url-label{color:white;font-size:12px;margin-bottom:8px}
    .sub-url{color:white;font-size:14px;font-weight:600;word-break:break-all}
    .copy-btn{width:100%;margin-top:16px;padding:12px;background:#0071e3;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s}
    .copy-btn:hover{background:#0077ed}
    .instructions{margin-top:20px;padding:16px;background:#fff3e0;border-radius:8px;border-left:4px solid #ff9800}
    .instructions h4{color:#e65100;margin-bottom:12px;font-size:14px}
    .instructions ul{list-style:none;padding:0}
    .instructions li{padding:6px 0;color:#86868b;font-size:13px}
    .instructions li:before{content:"✓";color:#ff9800;margin-right:8px;font-weight:bold}
    .loading{display:none;text-align:center;padding:20px}
    .loading.active{display:block}
    .spinner{width:40px;height:40px;border:3px solid #e5e5ea;border-top-color:#667eea;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-top:12px;color:#86868b;font-size:14px}
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>📺 电视直播服务</h1>
      <p>卡密激活获取订阅地址</p>
    </div>
    
    <div id="errorBox" class="error"></div>
    <div id="successBox" class="success"></div>
    
    <div class="form-group">
      <label for="code">请输入卡密</label>
      <input type="text" id="code" placeholder="输入您的卡密" autocomplete="off">
    </div>
    
    <button id="activateBtn" class="btn" onclick="activateCode()">立即激活</button>
    
    <div id="loading" class="loading">
      <div class="spinner"></div>
      <p class="loading-text">正在激活...</p>
    </div>
    
    <div id="result" class="result">
      <h3>✅ 激活成功</h3>
      <div class="info-item">
        <span class="info-label">卡密</span>
        <span class="info-value" id="resultCode">-</span>
      </div>
      <div class="info-item">
        <span class="info-label">有效期</span>
        <span class="info-value" id="resultDuration">-</span>
      </div>
      <div class="info-item">
        <span class="info-label">过期时间</span>
        <span class="info-value" id="resultExpired">-</span>
      </div>
      
      <div class="sub-url-container">
        <div class="sub-url-label">订阅地址（点击复制）</div>
        <div class="sub-url" id="subUrl" onclick="copySubUrl()">-</div>
      </div>
      
      <button class="copy-btn" onclick="copySubUrl()">复制订阅地址</button>
      
      <div class="instructions">
        <h4>📱 使用说明</h4>
        <ul>
          <li>将订阅地址添加到播放器</li>
          <li>支持IPTV、PotPlayer等播放器</li>
          <li>支持各类电视盒子</li>
          <li>建议定期更新订阅列表</li>
          <li>请勿使用软件对播放列表测试，否则可能触发平台限制</li>
        </ul>
      </div>
    </div>
  </div>
  
  <script>
    const API_BASE = '/api/activate';
    
    function showError(message) {
      const errorBox = document.getElementById('errorBox');
      const successBox = document.getElementById('successBox');
      errorBox.textContent = message;
      errorBox.style.display = 'block';
      successBox.style.display = 'none';
      setTimeout(() => {
        errorBox.style.display = 'none';
      }, 5000);
    }
    
    function showSuccess(message) {
      const errorBox = document.getElementById('errorBox');
      const successBox = document.getElementById('successBox');
      successBox.textContent = message;
      successBox.style.display = 'block';
      errorBox.style.display = 'none';
      setTimeout(() => {
        successBox.style.display = 'none';
      }, 5000);
    }
    
    function showLoading(show) {
      const loading = document.getElementById('loading');
      const btn = document.getElementById('activateBtn');
      if (show) {
        loading.classList.add('active');
        btn.disabled = true;
      } else {
        loading.classList.remove('active');
        btn.disabled = false;
      }
    }
    
    async function activateCode() {
      const code = document.getElementById('code').value.trim();
      
      if (!code) {
        showError('请输入卡密');
        return;
      }
      
      showLoading(true);
      document.getElementById('result').classList.remove('active');
      
      try {
        const response = await fetch(API_BASE + '?code=' + encodeURIComponent(code), {
          method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          showSuccess('卡密激活成功！');
          showResult(code, data);
        } else {
          showError(data.error || '激活失败，请检查卡密是否正确');
        }
      } catch (error) {
        console.error('激活失败:', error);
        showError('网络错误，请稍后重试');
      } finally {
        showLoading(false);
      }
    }
    
    function showResult(code, data) {
      const result = document.getElementById('result');
      const now = new Date();
      const expiredAt = new Date(data.expired_at);
      const durationDays = Math.ceil((expiredAt - now) / (1000 * 60 * 60 * 24));
      
      document.getElementById('resultCode').textContent = code;
      document.getElementById('resultDuration').textContent = durationDays + ' 天';
      document.getElementById('resultExpired').textContent = expiredAt.toLocaleString('zh-CN');
      
      const host = window.location.origin;
      const subUrl = host + '/sub/' + code + '.m3u';
      document.getElementById('subUrl').textContent = subUrl;
      
      result.classList.add('active');
    }
    
    function copySubUrl() {
      const subUrl = document.getElementById('subUrl').textContent;
      if (subUrl && subUrl !== '-') {
        navigator.clipboard.writeText(subUrl).then(() => {
          showSuccess('订阅地址已复制到剪贴板');
        }).catch(err => {
          const textarea = document.createElement('textarea');
          textarea.value = subUrl;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showSuccess('订阅地址已复制到剪贴板');
        });
      }
    }
    
    // 支持回车键激活
    document.getElementById('code').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        activateCode();
      }
    });
  </script>
</body>
</html>`;
