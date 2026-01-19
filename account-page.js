// 用户账户页面内容
export const ACCOUNT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>用户中心 - TV Live Service</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;min-height:100vh;padding:15px}
    .container{background:#141414;backdrop-filter:blur(20px);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);padding:30px;max-width:600px;width:100%;margin:0 auto}
    .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px}
    .header h1{font-size:24px;font-weight:700;color:#fff}
    .logout-btn{background:rgba(229,9,20,.2);color:#e50914;border:1px solid #e50914;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s;-webkit-tap-highlight-color:transparent}
    .logout-btn:hover{background:#e50914;color:#fff}
    
    .nav-tabs{display:flex;gap:10px;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:15px}
    .nav-tab{background:transparent;color:rgba(255,255,255,.6);border:none;padding:12px 20px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:500;transition:all .2s;-webkit-tap-highlight-color:transparent}
    .nav-tab:hover{color:#fff;background:rgba(255,255,255,.05)}
    .nav-tab.active{color:#fff;background:#e50914}
    
    .tab-content{display:none}
    .tab-content.active{display:block}
    
    .info-card{background:rgba(255,255,255,.03);border-radius:12px;padding:20px;margin-bottom:15px;border:1px solid rgba(255,255,255,.08)}
    .info-item{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.1)}
    .info-item:last-child{border-bottom:none}
    .info-label{color:rgba(255,255,255,.6);font-size:14px}
    .info-value{color:#fff;font-weight:500;font-size:14px}
    
    .order-card{background:rgba(255,255,255,.03);border-radius:12px;padding:20px;margin-bottom:15px;border:1px solid rgba(255,255,255,.08)}
    .order-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}
    .order-id{color:#e50914;font-size:13px;font-weight:600}
    .order-date{color:rgba(255,255,255,.6);font-size:12px}
    .order-details{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .order-detail-item{padding:8px 0}
    .order-detail-label{color:rgba(255,255,255,.6);font-size:12px;margin-bottom:4px}
    .order-detail-value{color:#fff;font-size:13px;font-weight:500}
    .order-status{display:inline-block;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:600}
    .order-status.completed{background:rgba(52,199,89,.2);color:#34c759}
    .order-status.pending{background:rgba(255,204,0,.2);color:#ffcc00}
    .order-status.cancelled{background:rgba(255,59,48,.2);color:#ff3b30}
    
    .empty-state{text-align:center;padding:40px 20px;color:rgba(255,255,255,.4)}
    .empty-state svg{width:60px;height:60px;margin-bottom:15px;opacity:.5}
    .empty-state p{font-size:14px}
    
    .loading{display:none;text-align:center;padding:40px}
    .loading.active{display:block}
    .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,.1);border-top-color:#e50914;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto}
    @keyframes spin{to{transform:rotate(360deg)}}
    
    .toast-container{position:fixed;top:100px;left:50%;transform:translateX(-50%);z-index:1000;display:flex;flex-direction:column;gap:10px;padding:0 20px;max-width:600px;width:100%;pointer-events:none}
    .toast{background:rgba(20,20,20,.95);backdrop-filter:blur(20px);border-radius:10px;padding:14px 18px;border:1px solid rgba(255,255,255,.1);box-shadow:0 8px 24px rgba(0,0,0,.4);pointer-events:auto;animation:slideIn .3s ease}
    @keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    .toast.success{border-color:#34c759}
    .toast.success .toast-icon{color:#34c759}
    .toast.error{border-color:#ff3b30}
    .toast.error .toast-icon{color:#ff3b30}
    .toast.warning{border-color:#ffcc00}
    .toast.warning .toast-icon{color:#ffcc00}
    .toast-content{display:flex;align-items:center;gap:10px}
    .toast-icon{font-size:18px}
    .toast-message{color:#fff;font-size:14px;font-weight:500}
    
    @media (max-width:768px){
      body{padding:10px}
      .container{padding:20px;border-radius:12px}
      .header h1{font-size:20px}
      .nav-tabs{flex-wrap:wrap;gap:8px;padding-bottom:10px}
      .nav-tab{padding:10px 16px;font-size:13px}
      .info-card,.order-card{padding:16px}
      .order-details{grid-template-columns:1fr}
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👤 用户中心</h1>
      <button class="logout-btn" onclick="logout()">退出登录</button>
    </div>
    
    <div class="nav-tabs">
      <button class="nav-tab active" onclick="switchTab('info')">账户信息</button>
      <button class="nav-tab" onclick="switchTab('orders')">订单历史</button>
    </div>
    
    <div id="infoTab" class="tab-content active">
      <div id="userInfo" class="info-card">
        <!-- 用户信息将在这里显示 -->
      </div>
      <div id="infoLoading" class="loading">
        <div class="spinner"></div>
      </div>
    </div>
    
    <div id="ordersTab" class="tab-content">
      <div id="ordersList"></div>
      <div id="ordersLoading" class="loading">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
  
  <div class="toast-container" id="toastContainer"></div>
  
  <script>
    const API_BASE = '/api/auth';
    
    // 获取当前有效的token
    function getToken() {
      return localStorage.getItem('auth_token');
    }
    
    // 检查登录状态
    if (!getToken()) {
      window.location.href = '/';
    }
    
    // 验证token是否有效
    async function validateToken() {
      try {
        const response = await fetch(API_BASE + '/user', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        if (response.status === 401) {
          // token无效，清除登录态并返回首页
          localStorage.removeItem('auth_token');
          window.location.href = '/';
          return false;
        }
        return response.ok;
      } catch (error) {
        console.error('验证token失败:', error);
        return false;
      }
    }
    
    // 页面加载时验证token
    (async () => {
      const isValid = await validateToken();
      if (!isValid) {
        window.location.href = '/';
      }
    })();
    
    function switchTab(tab) {
      document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      event.target.classList.add('active');
      document.getElementById(tab + 'Tab').classList.add('active');
      
      if (tab === 'info') {
        loadUserInfo();
      } else if (tab === 'orders') {
        loadOrderHistory();
      }
    }
    
    async function loadUserInfo() {
      const userInfoDiv = document.getElementById('userInfo');
      const loadingDiv = document.getElementById('infoLoading');
      
      userInfoDiv.innerHTML = '';
      loadingDiv.classList.add('active');
      
      try {
        const response = await fetch(API_BASE + '/user', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          const user = data.user;
          const createdDate = new Date(user.created_at);
          const updatedDate = new Date(user.updated_at);
          
          userInfoDiv.innerHTML = \`
            <div class="info-item">
              <span class="info-label">邮箱</span>
              <span class="info-value">\${user.email}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱状态</span>
              <span class="info-value">\${user.is_verified ? '已验证' : '未验证'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">注册时间</span>
              <span class="info-value">\${createdDate.toLocaleString('zh-CN')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">更新时间</span>
              <span class="info-value">\${updatedDate.toLocaleString('zh-CN')}</span>
            </div>
          \`;
        } else {
          showToast(data.error || '加载用户信息失败', 'error');
          if (response.status === 401) {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
        showToast('网络错误，请稍后重试', 'error');
      } finally {
        loadingDiv.classList.remove('active');
      }
    }
    
    async function loadOrderHistory() {
      const ordersListDiv = document.getElementById('ordersList');
      const loadingDiv = document.getElementById('ordersLoading');
      
      ordersListDiv.innerHTML = '';
      loadingDiv.classList.add('active');
      
      try {
        const response = await fetch(API_BASE + '/orders', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          const orders = data.orders || [];
          
          if (orders.length === 0) {
            ordersListDiv.innerHTML = \`
              <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <p>暂无订单记录</p>
              </div>
            \`;
          } else {
            ordersListDiv.innerHTML = orders.map(order => {
              const createdDate = new Date(order.created_at);
              const statusClass = order.status.toLowerCase();
              const statusText = {
                'completed': '已完成',
                'pending': '待处理',
                'cancelled': '已取消'
              }[order.status] || order.status;
              
              return \`
                <div class="order-card">
                  <div class="order-header">
                    <span class="order-id">订单#\${order.order_id}</span>
                    <span class="order-status \${statusClass}">\${statusText}</span>
                  </div>
                  <div class="order-details">
                    <div class="order-detail-item">
                      <div class="order-detail-label">卡密</div>
                      <div class="order-detail-value">\${order.code || '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">有效期</div>
                      <div class="order-detail-value">\${order.duration_days ? order.duration_days + ' 天' : '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">金额</div>
                      <div class="order-detail-value">\${order.amount ? '¥' + order.amount.toFixed(2) : '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">创建时间</div>
                      <div class="order-detail-value">\${createdDate.toLocaleString('zh-CN')}</div>
                    </div>
                  </div>
                </div>
              \`;
            }).join('');
          }
        } else {
          showToast(data.error || '加载订单历史失败', 'error');
          if (response.status === 401) {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('加载订单历史失败:', error);
        showToast('网络错误，请稍后重试', 'error');
      } finally {
        loadingDiv.classList.remove('active');
      }
    }
    
    async function logout() {
      try {
        await fetch(API_BASE + '/logout', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
      } catch (error) {
        console.error('登出失败:', error);
      } finally {
        localStorage.removeItem('auth_token');
        showToast('已退出登录', 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    }
    
    function showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = \`toast \${type}\`;
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      toast.innerHTML = \`
        <div class="toast-content">
          <span class="toast-icon">\${icons[type]}</span>
          <span class="toast-message">\${message}</span>
        </div>
      \`;
      
      container.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
    
    // 初始化
    document.addEventListener('DOMContentLoaded', () => {
      loadUserInfo();
    });
  </script>
</body>
</html>`;
