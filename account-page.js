// 用户账户页面内容
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';

export const ACCOUNT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">用户中心 - TV Live Service</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-padding-top:70px}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;min-height:100vh;display:flex;flex-direction:column;color:#fff}
    .main-content{flex:1;width:100%;margin-top:90px;padding:20px 15px 0}
    .container{background:#141414;backdrop-filter:blur(20px);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);padding:40px 30px 30px;max-width:600px;width:100%;margin:0 auto;position:relative}
    .account-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;gap:10px}
    .account-header h1{font-size:24px;font-weight:700;color:#fff;flex:1}
    .header-actions{display:flex;align-items:center;gap:10px}
    .logout-btn{background:rgba(229,9,20,.2);color:#e50914;border:1px solid #e50914;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s;-webkit-tap-highlight-color:transparent;white-space:nowrap}
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
    
    .toast-container{position:fixed;top:100px;left:50%;transform:translateX(-50%);z-index:3001;display:flex;flex-direction:column;gap:10px;padding:0 20px;max-width:600px;width:100%;pointer-events:none}
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
    
    /* 支付成功模态框样式 */
    .success-modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:3000;align-items:center;justify-content:center;padding:20px}
    .success-modal.show{display:flex}
    .success-content{background:linear-gradient(135deg,#1e1e1e 0%,#0a0a0a 100%);border-radius:24px;padding:40px;max-width:480px;width:100%;text-align:center;border:1px solid rgba(229,9,20,0.2);box-shadow:0 25px 80px rgba(0,0,0,0.6);animation:modalSlideIn 0.3s cubic-bezier(0.4,0,0.2,1)}
    @keyframes modalSlideIn{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .success-icon{font-size:64px;margin-bottom:20px}
    .success-title{font-size:24px;font-weight:700;color:#fff;margin:0 0 10px 0}
    .success-message{color:rgba(255,255,255,0.8);font-size:14px;margin-bottom:25px}
    .code-display{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;margin-bottom:20px;color:#fff;font-size:13px;word-break:break-all;font-family:monospace}
    .copy-button{background:linear-gradient(135deg,#e50914 0%,#ff3b30 100%);color:#fff;border:none;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.3s;width:100%;margin-bottom:15px}
    .copy-button:hover{transform:translateY(-2px);box-shadow:0 5px 20px rgba(229,9,20,0.4)}
    .close-button{background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.8);border:1px solid rgba(255,255,255,0.2);padding:14px 28px;border-radius:12px;font-size:14px;cursor:pointer;transition:all 0.3s}
    .close-button:hover{background:rgba(255,255,255,0.15)}
    .modal-tips{margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1)}
    .modal-tip{color:rgba(255,255,255,0.6);font-size:13px;line-height:1.6;margin-bottom:8px}
    .modal-tip:last-child{margin-bottom:0}
    .modal-tip-highlight{color:rgba(255,255,255,0.5);font-size:12px;margin-top:12px}
    .modal-close{position:absolute;top:20px;right:20px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;color:rgba(255,255,255,0.6);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-size:20px;line-height:1}
    .modal-close:hover{background:rgba(255,255,255,0.2);color:rgba(255,255,255,0.9)}
    
    @media (max-width:768px){
      html{scroll-padding-top:60px}
      .main-content{margin-top:80px;padding:15px 10px 0}
      .container{padding:30px 20px;border-radius:12px}
      .account-header h1{font-size:20px}
      .nav-tabs{flex-wrap:wrap;gap:8px;padding-bottom:10px}
      .nav-tab{padding:10px 16px;font-size:13px}
      .info-card,.order-card{padding:16px}
      .order-details{grid-template-columns:1fr}
    }

    @media (max-width:480px){
      html{scroll-padding-top:50px}
      .main-content{margin-top:70px;padding:10px 10px 0}
      .container{padding:25px 15px}
      .account-header{margin-bottom:20px}
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  <div class="main-content">
    <div class="container">
    <div class="account-header">
      <h1 data-i18n="userCenter">👤 用户中心</h1>
      <div class="header-actions">
        <button class="logout-btn" onclick="logout()" data-i18n="logout">退出登录</button>
      </div>
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
    </div>

   <div class="toast-container" id="toastContainer"></div>

  ${PAGE_FOOTER}

   <!-- 支付成功模态框 -->
   <div id="successModal" class="success-modal">
     <div class="success-content">
       <button class="modal-close" onclick="closeSuccessModal()">×</button>
       <div class="success-icon">🎉</div>
       <h2 class="success-title" data-i18n="paymentSuccess">支付成功！</h2>
       <p class="success-message" data-i18n="subUrlGenerated">您的订阅地址已生成</p>
       <div class="code-display" id="generatedCode" style="font-size: 14px; word-break: break-all;">-</div>
       <button class="copy-button" onclick="copyCode()" data-i18n="copyUrl">复制订阅地址</button>
       <div class="modal-tips">
         <p class="modal-tip">您可以直接使用此订阅地址在播放器中添加</p>
         <p class="modal-tip-highlight">此窗口关闭后可在账户页面中查询订单详情</p>
       </div>
     </div>
   </div>
   
   <script>
    const API_BASE = '/api/auth';

    // 智能判断浏览器语言
    function detectBrowserLanguage() {
      const savedLang = localStorage.getItem('account_lang');
      if (savedLang) return savedLang;

      const browserLang = navigator.language || navigator.userLanguage || 'zh-CN';
      return browserLang.startsWith('zh') && (browserLang.includes('CN') || browserLang === 'zh') ? 'zh-CN' : 'en';
    }

    let currentLang = detectBrowserLanguage();

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
        subUrl: 'Subscription URL',
        ipCount: 'Allowed IPs',
        status: 'Status',
        statusCompleted: 'Completed',
        statusPending: 'Pending',
        statusCancelled: 'Cancelled',
        loadUserInfoFailed: 'Failed to load user information',
        networkError: 'Network error, please try again later',
        logoutSuccess: 'Logged out successfully',
        footerCopyright: 'Free HD TV Online Viewing Platform',
        sitemap: 'Sitemap',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        cloudflareBadge: 'This site is accelerated and protected by Cloudflare',
        disclaimerContent: 'The playback link resources on this site are from the public network. This site does not produce or store any content. For copyright or content issues, please contact the actual content provider.'
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
        subUrl: '订阅地址',
        ipCount: '允许IP数',
        status: '状态',
        statusCompleted: '已完成',
        statusPending: '处理中',
        statusCancelled: '已取消',
        loadUserInfoFailed: '加载用户信息失败',
        networkError: '网络错误，请稍后重试',
        logoutSuccess: '已退出登录',
        footerCopyright: '免费高清电视在线观看平台',
        sitemap: '网站地图',
        privacyPolicy: '隐私政策',
        termsOfService: '服务条款',
        cloudflareBadge: '本站由 Cloudflare 提供加速与安全保护',
        disclaimerContent: '本站播放链接资源均来源于公开网络，本站不产出和储存任何内容。如有版权或内容问题，请联系内容实际产出者。'
      }
    };

    function t(key) {
      return translations[currentLang][key] || translations['zh-CN'][key] || key;
    }

    // 设置语言
    function setLanguage() {
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

    // 页面加载时立即执行语言设置
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setLanguage(currentLang));
    } else {
      setLanguage(currentLang);
    }

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
              const baseUrl = window.location.origin;
              const subUrl = order.code ? \`\${baseUrl}/sub/\${order.code}.m3u\` : '-';

              return \`
                <div class="order-card">
                  <div class="order-header">
                    <span class="order-id">\${t('orderId')}：\${order.order_id}</span>
                    <span class="order-status \${statusClass}">\${statusText}</span>
                  </div>
                  <div class="order-details">
                    <div class="order-detail-item">
                      <div class="order-detail-label">Code</div>
                      <div class="order-detail-value">\${order.code || '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">\${t('subUrl')}</div>
                      <div class="order-detail-value" style="font-size: 12px; word-break: break-all;">\${subUrl}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">Validity</div>
                      <div class="order-detail-value">\${order.duration_days ? order.duration_days + dayUnit : '-'}</div>
                    </div>
                    <div class="order-detail-item">
                      <div class="order-detail-label">\${t('ipCount')}</div>
                      <div class="order-detail-value">\${order.max_ips || 3}</div>
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
      const toastEl = document.createElement('div');
      toastEl.className = 'toast ' + type;
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      toastEl.innerHTML = '<div class="toast-content"><span class="toast-icon">' + icons[type] + '</span><span class="toast-message">' + message + '</span></div>';
      
      container.appendChild(toastEl);
      
      setTimeout(() => {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(-10px)';
        setTimeout(() => toastEl.remove(), 300);
      }, 3000);
    }
    
    // 支付成功模态框相关函数
    function showSuccessModal(subUrl) {
      document.getElementById('generatedCode').textContent = subUrl;
      document.getElementById('successModal').classList.add('show');
    }
    
    function closeSuccessModal() {
      document.getElementById('successModal').classList.remove('show');
      // 清除 URL 参数
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    function copyCode() {
      const subUrl = document.getElementById('generatedCode').textContent;
      navigator.clipboard.writeText(subUrl).then(() => {
        showToast(currentLang === 'zh-CN' ? '订阅地址已复制到剪贴板！' : 'Subscription URL copied to clipboard!', 'success');
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    }
    
    // 检查 URL 参数中的支付状态
    function checkPaymentStatus() {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        // 支付成功，获取最新的订单信息
        loadLatestOrder();
      } else if (paymentStatus === 'cancelled') {
        showToast(currentLang === 'zh-CN' ? '支付已取消' : 'Payment cancelled', 'warning');
        // 清除 URL 参数
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
    
    // 加载最新的订单并显示订阅地址
    async function loadLatestOrder() {
      try {
        const response = await fetch(API_BASE + '/orders', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success && data.orders && data.orders.length > 0) {
          // 找到最新的已完成的订单
          const completedOrder = data.orders.find(order => order.status === 'completed');
          if (completedOrder && completedOrder.code) {
            const subUrl = window.location.origin + '/sub/' + completedOrder.code + '.m3u';
            showSuccessModal(subUrl);
          } else {
            showToast(currentLang === 'zh-CN' ? '暂无订阅信息' : 'No subscription info', 'info');
          }
        } else {
          showToast(data.error || (currentLang === 'zh-CN' ? '获取订单失败' : 'Failed to get orders'), 'error');
        }
      } catch (error) {
        console.error('Load latest order error:', error);
        showToast(currentLang === 'zh-CN' ? '网络错误' : 'Network error', 'error');
      }
      
      // 清除 URL 参数
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // 初始化
    document.addEventListener('DOMContentLoaded', () => {
      loadUserInfo();
      checkPaymentStatus(); // 检查支付状态 URL 参数
    });
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
</html>`;
