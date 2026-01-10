// 免费订阅页面HTML
export const FREE_SUB_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>免费订阅 - 免费观看精选频道</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 600px;
      width: 100%;
      padding: 40px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #333;
      font-size: 28px;
      margin-bottom: 10px;
    }

    .header p {
      color: #666;
      font-size: 14px;
    }

    .card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .card h2 {
      color: #333;
      font-size: 18px;
      margin-bottom: 15px;
    }

    .subscription-info {
      text-align: center;
    }

    .subscription-id {
      font-size: 20px;
      font-weight: bold;
      color: #667eea;
      word-break: break-all;
      margin: 10px 0;
    }

    .subscription-url {
      font-family: monospace;
      background: white;
      padding: 15px;
      border-radius: 8px;
      border: 2px dashed #ddd;
      margin: 15px 0;
      word-break: break-all;
      font-size: 12px;
    }

    .subscription-status {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
    }

    .status-item {
      text-align: center;
    }

    .status-value {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
    }

    .status-label {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }

    .checkin-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 15px;
    }

    .checkin-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .checkin-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .message {
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
      font-size: 14px;
      display: none;
    }

    .message.success {
      background: #d4edda;
      color: #155724;
      display: block;
    }

    .message.error {
      background: #f8d7da;
      color: #721c24;
      display: block;
    }

    .message.info {
      background: #d1ecf1;
      color: #0c5460;
      display: block;
    }

    .features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 20px;
    }

    .feature {
      text-align: center;
      padding: 15px;
      background: white;
      border-radius: 8px;
      border: 1px solid #eee;
    }

    .feature-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .feature-text {
      font-size: 12px;
      color: #666;
    }

    .loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #fff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.8s linear infinite;
      margin-right: 10px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .notice {
      background: #fff3cd;
      border: 1px solid #ffc107;
      color: #856404;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .notice-icon {
      margin-right: 8px;
    }

    .copy-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
      margin-top: 10px;
    }

    .copy-btn:hover {
      background: #5568d3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎁 免费订阅</h1>
      <p>每天30%精选频道，每日签到续期</p>
    </div>

    <div class="notice">
      <span class="notice-icon">⚠️</span>
      <strong>注意：</strong>订阅地址与您的IP和浏览器绑定，请勿分享给他人使用
    </div>

    <div class="card">
      <h2>📺 订阅信息</h2>
      <div class="subscription-info" id="subscriptionInfo">
        <p class="subscription-id" id="subId">加载中...</p>
        <p class="subscription-url" id="subUrl"></p>
        <button class="copy-btn" onclick="copySubscriptionUrl()">复制订阅地址</button>

        <div class="subscription-status">
          <div class="status-item">
            <div class="status-value" id="daysLeft">-</div>
            <div class="status-label">剩余天数</div>
          </div>
          <div class="status-item">
            <div class="status-value" id="consecutiveDays">-</div>
            <div class="status-label">连续签到</div>
          </div>
          <div class="status-item">
            <div class="status-value" id="channelCount">30%</div>
            <div class="status-label">频道数量</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>📅 每日签到</h2>
      <p style="text-align: center; color: #666; margin-bottom: 15px; font-size: 14px;">
        签到可延长订阅时长，连续签到有额外奖励！
      </p>
      <button class="checkin-btn" id="checkInBtn" onclick="checkIn()">
        立即签到
      </button>
      <div class="message" id="message"></div>
    </div>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">🎁</div>
        <div class="feature-text">免费使用</div>
      </div>
      <div class="feature">
        <div class="feature-icon">🔄</div>
        <div class="feature-text">每日30%频道</div>
      </div>
      <div class="feature">
        <div class="feature-icon">✅</div>
        <div class="feature-text">每日+1天</div>
      </div>
      <div class="feature">
        <div class="feature-icon">🔥</div>
        <div class="feature-text">连续7天+2天</div>
      </div>
      <div class="feature">
        <div class="feature-icon">🏆</div>
        <div class="feature-text">连续30天+10天</div>
      </div>
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <div class="feature-text">IP绑定保护</div>
      </div>
    </div>
  </div>

  <script>
    // 全局变量
    let subId = null;
    let fingerprint = null;
    let fingerprintComponents = null;

    // 页面加载时执行
    window.addEventListener('DOMContentLoaded', async () => {
      await generateFingerprint();
      await loadSubscription();
    });

    // 生成指纹
    async function generateFingerprint() {
      try {
        fingerprintComponents = {
          screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
          },
          browser: {
            language: navigator.language,
            platform: navigator.platform,
            userAgent: navigator.userAgent.substring(0, 100)
          },
          timezone: {
            offset: new Date().getTimezoneOffset(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        };

        // 生成哈希
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(fingerprintComponents));
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        fingerprint = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      } catch (error) {
        console.error('指纹生成失败:', error);
        showMessage('指纹生成失败，请刷新页面重试', 'error');
      }
    }

    // 加载订阅信息
    async function loadSubscription() {
      try {
        const response = await fetch('/api/freesub/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fingerprint: fingerprint,
            fingerprintComponents: fingerprintComponents
          })
        });

        const data = await response.json();

        if (data.success) {
          subId = data.subscription.subId;
          displaySubscription(data.subscription);
          await loadSubscriptionInfo();
        } else {
          showMessage(data.error || '加载失败', 'error');
        }
      } catch (error) {
        console.error('加载订阅失败:', error);
        showMessage('网络错误，请稍后重试', 'error');
      }
    }

    // 显示订阅信息
    function displaySubscription(sub) {
      document.getElementById('subId').textContent = sub.subId;
      const subUrl = \`\${window.location.origin}/api/freesub/\${sub.subId}.m3u?fp=\${fingerprint}\`;
      document.getElementById('subUrl').textContent = subUrl;
      document.getElementById('consecutiveDays').textContent = sub.consecutiveDays || 0;

      // 计算剩余天数
      const expiredAt = new Date(sub.expiredAt);
      const now = new Date();
      const daysLeft = Math.max(0, Math.ceil((expiredAt - now) / (1000 * 60 * 60 * 24)));
      document.getElementById('daysLeft').textContent = daysLeft;
    }

    // 加载订阅详细信息
    async function loadSubscriptionInfo() {
      try {
        const response = await fetch('/api/freesub/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subId: subId,
            fingerprint: fingerprint
          })
        });

        const data = await response.json();

        if (data.success) {
          displaySubscription(data.subscription);
        }
      } catch (error) {
        console.error('加载订阅详情失败:', error);
      }
    }

    // 签到
    async function checkIn() {
      const btn = document.getElementById('checkInBtn');
      btn.disabled = true;
      btn.innerHTML = '<span class="loading"></span>签到中...';

      try {
        const response = await fetch('/api/freesub/checkin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subId: subId,
            fingerprint: fingerprint
          })
        });

        const data = await response.json();

        if (data.success) {
          showMessage(\`签到成功！获得\${data.rewardDays}天，剩余\${data.consecutiveDays}天\`, 'success');
          await loadSubscriptionInfo();
        } else {
          showMessage(data.reason === 'already_checked_in' ? '今日已签到' : data.error || '签到失败', 'error');
        }
      } catch (error) {
        console.error('签到失败:', error);
        showMessage('网络错误，请稍后重试', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '立即签到';
      }
    }

    // 复制订阅地址
    function copySubscriptionUrl() {
      const url = document.getElementById('subUrl').textContent;
      navigator.clipboard.writeText(url).then(() => {
        showMessage('订阅地址已复制到剪贴板', 'success');
      }).catch(() => {
        showMessage('复制失败，请手动复制', 'error');
      });
    }

    // 显示消息
    function showMessage(text, type) {
      const messageEl = document.getElementById('message');
      messageEl.textContent = text;
      messageEl.className = 'message ' + type;
      setTimeout(() => {
        messageEl.className = 'message';
      }, 5000);
    }
  </script>
</body>
</html>
`;
