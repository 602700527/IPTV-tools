// 用户账户页面内容
export const ACCOUNT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">用户中心 - TV Live Service</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;min-height:100vh;padding:15px}
    .container{background:#141414;backdrop-filter:blur(20px);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);padding:30px;max-width:600px;width:100%;margin:0 auto}
    .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px}
    .header h1{font-size:24px;font-weight:700;color:#fff}
    .logout-btn{background:rgba(229,9,20,.2);color:#e50914;border:1px solid #e50914;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s;-webkit-tap-highlight-color:transparent}
    .logout-btn:hover{background:#e50914;color:#fff}
    
    .nav-tabs{display:flex;gap:10px;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:15px}
    
    .lang-switch{position:absolute;top:15px;right:15px;z-index:10}
    .lang-dropdown{position:relative;display:inline-block}
    .lang-btn{background:#e50914;color:#fff;border:none;padding:8px 18px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;transition:background .2s;display:flex;align-items:center;gap:6px;-webkit-tap-highlight-color:transparent}
    .lang-btn:hover{background:#f7262c}
    .lang-btn:after{content:"▼";font-size:9px}
    .lang-menu{display:none;position:absolute;top:calc(100% + 8px);right:0;background:#1a1a1a;backdrop-filter:blur(10px);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.3);min-width:120px;overflow:hidden;animation:fadeIn .2s ease;border:1px solid rgba(255,255,255,.15)}
    .lang-menu.show{display:block}
    .lang-menu button{display:block;width:100%;padding:10px 16px;background:none;border:none;text-align:left;font-size:13px;color:rgba(255,255,255,.8);cursor:pointer;transition:background .2s}
    .lang-menu button:hover{background:rgba(229,9,20,.15)}
    .lang-menu button.active{background:#e50914;color:#fff}
    @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
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
    <div class="lang-switch">
      <div class="lang-dropdown">
        <button class="lang-btn" onclick="toggleLangMenu()" id="currentLangBtn">简体</button>
        <div class="lang-menu" id="langMenu">
          <button onclick="setLanguage('en')" id="langEn">English</button>
          <button onclick="setLanguage('zh-CN')" id="langZh">简体中文</button>
        </div>
      </div>
    </div>
    <div class="header">
      <h1 data-i18n="userCenter">👤 用户中心</h1>
      <button class="logout-btn" onclick="logout()" data-i18n="logout">退出登录</button>
    </div>
    
    <div class="nav-tabs">
      <button class="nav-tab active" onclick="switchTab('info')" data-i18n="accountInfo">账户信息</button>
      <button class="nav-tab" onclick="switchTab('orders')" data-i18n="orderHistory">订单历史</button>
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
    let currentLang = localStorage.getItem('account_lang') || 'zh-CN';

    const translations = {
      'en': {
        pageTitle: 'User Center - TV Live Service',
        userCenter: '👤 User Center',
        logout: 'Logout',
        accountInfo: 'Account Info',
        orderHistory: 'Order History',
        email: 'Email',
        emailStatus: 'Email Status',
        registeredAt: 'Registered At',
        updatedAt: 'Updated At',
        verified: 'Verified',
        unverified: 'Unverified',
        noOrders: 'No orders yet',
        orderId: 'Order ID',
        orderDate: 'Order Date',
        orderType: 'Order Type',
        paymentMethod: 'Payment Method',
        amount: 'Amount',
        status: 'Status',
        statusCompleted: 'Completed',
        statusPending: 'Pending',
        statusCancelled: 'Cancelled',
        loadUserInfoFailed: 'Failed to load user information',
        networkError: 'Network error, please try again later',
        logoutSuccess: 'Logged out successfully'
      },
      'zh-CN': {
        pageTitle: '用户中心 - TV Live Service',
        userCenter: '👤 用户中心',
        logout: '退出登录',
        accountInfo: '账户信息',
        orderHistory: '订单历史',
        email: '邮箱',
        emailStatus: '邮箱状态',
        registeredAt: '注册时间',
        updatedAt: '更新时间',
        verified: '已验证',
        unverified: '未验证',
        noOrders: '暂无订单记录',
        orderId: '订单号',
        orderDate: '下单时间',
        orderType: '订单类型',
        paymentMethod: '支付方式',
        amount: '金额',
        status: '状态',
        statusCompleted: '已完成',
        statusPending: '处理中',
        statusCancelled: '已取消',
        loadUserInfoFailed: '加载用户信息失败',
        networkError: '网络错误，请稍后重试',
        logoutSuccess: '已退出登录'
      }
    };

    function t(key) {
      return translations[currentLang][key] || translations['zh-CN'][key] || key;
    }

    // 智能判断浏览器语言
    function detectBrowserLanguage() {
      const savedLang = localStorage.getItem('account_lang');
      if (savedLang) return savedLang;
      
      const browserLang = navigator.language || navigator.userLanguage || 'zh-CN';
      return browserLang.startsWith('zh') && (browserLang.includes('CN') || browserLang === 'zh') ? 'zh-CN' : 'en';
    }

    // 切换语言菜单
    function toggleLangMenu() {
      document.getElementById('langMenu').classList.toggle('show');
    }

    // 设置语言
    function setLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('account_lang', lang);

      document.getElementById('langEn').classList.toggle('active', lang === 'en');
      document.getElementById('langZh').classList.toggle('active', lang === 'zh-CN');
      document.getElementById('currentLangBtn').textContent = lang === 'en' ? 'EN' : '简体';
      document.getElementById('langMenu').classList.remove('show');
      document.documentElement.lang = lang;

      const titleKey = document.querySelector('[data-i18n-title]');
      if (titleKey) {
        const key = titleKey.getAttribute('data-i18n-title');
        document.title = t(key);
      }

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
      });
    }

    // 页面加载时执行
    window.addEventListener('DOMContentLoaded', () => {
      currentLang = detectBrowserLanguage();
      setLanguage(currentLang);
    });

    
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
              <span class="info-label">\${t('email')}</span>
              <span class="info-value">\${user.email}</span>
            </div>
            <div class="info-item">
              <span class="info-label">\${t('emailStatus')}</span>
              <span class="info-value">\${user.is_verified ? t('verified') : t('unverified')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">\${t('registeredAt')}</span>
              <span class="info-value">\${createdDate.toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">\${t('updatedAt')}</span>
              <span class="info-value">\${updatedDate.toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US')}</span>
            </div>
          \`;
        } else {
          showToast(data.error || t('loadUserInfoFailed'), 'error');
          if (response.status === 401) {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
        showToast(t('networkError'), 'error');
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
                <p>\${t('noOrders')}</p>
              </div>
            \`;
          } else {
            ordersListDiv.innerHTML = orders.map(order => {
              const createdDate = new Date(order.created_at);
              const statusClass = order.status.toLowerCase();
              const statusText = {
                'completed': t('statusCompleted'),
                'pending': t('statusPending'),
                'cancelled': t('statusCancelled')
              }[order.status] || order.status;
              const dayUnit = currentLang === 'zh-CN' ? ' 天' : ' days';
              
              return \`
                <div class="order-card">
                  <div class="order-header">
                    <span class="order-id">\${t('orderId')}#\${order.order_id}</span>
                    <span class="order-status \${statusClass}">\${statusText}</span>
                  </div>
                  <div class="order-details">
                    <div class="order-detail-item">
                      <div class="order-detail-label">Code</div>
                      <div class="order-detail-value">\${order.code || '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">Validity</div>
                      <div class="order-detail-value">\${order.duration_days ? order.duration_days + dayUnit : '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">\${t('amount')}</div>
                      <div class="order-detail-value">\${order.amount ? '¥' + order.amount.toFixed(2) : '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">\${t('orderDate')}</div>
                      <div class="order-detail-value">\${createdDate.toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US')}</div>
                    </div>
                  </div>
                </div>
              \`;
            }).join('');
          }
        } else {
          showToast(data.error || t('loadUserInfoFailed'), 'error');
          if (response.status === 401) {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('加载订单历史失败:', error);
        showToast(t('networkError'), 'error');
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
        showToast(t('logoutSuccess'), 'success');
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
