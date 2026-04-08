// 用户账户页面内容
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';

export const ACCOUNT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">用户中心 - TV Live Service</title>
  <meta name="description" content="管理您的TV Live Service账户，查看订阅状态、订单历史和账户设置。">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://iptv-search.com/account">
  <link rel="alternate" hreflang="zh-CN" href="https://iptv-search.com/account">
  <link rel="alternate" hreflang="en" href="https://iptv-search.com/account?lang=en">
  <link rel="alternate" hreflang="x-default" href="https://iptv-search.com/account?lang=en">
  <meta property="og:title" content="用户中心 - TV Live Service">
  <meta property="og:description" content="管理您的TV Live Service账户，查看订阅状态、订单历史和账户设置。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com/account">
  <meta property="og:image" content="https://iptv-search.com/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="TV Live Service">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="用户中心 - TV Live Service">
  <meta name="twitter:description" content="管理您的TV Live Service账户，查看订阅状态、订单历史和账户设置。">
  <meta name="twitter:image" content="https://iptv-search.com/og-homepage.png">
  <style>
    :root {
      --bg-primary: #0a0a0a;
      --bg-secondary: #141414;
      --bg-card: rgba(255,255,255,0.03);
      --bg-hover: rgba(255,255,255,0.05);
      --text-primary: #ffffff;
      --text-secondary: rgba(255,255,255,0.6);
      --text-muted: rgba(255,255,255,0.4);
      --border: rgba(255,255,255,0.1);
      --border-light: rgba(255,255,255,0.08);
      --accent: #e50914;
      --accent-hover: #f7262c;
      --success: #34c759;
      --warning: #ffcc00;
      --error: #ff3b30;
    }

    [data-theme="light"] {
      --bg-primary: #f5f5f5;
      --bg-secondary: #ffffff;
      --bg-card: rgba(0,0,0,0.03);
      --bg-hover: rgba(0,0,0,0.05);
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: rgba(0,0,0,0.1);
      --border-light: rgba(0,0,0,0.05);
    }

    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-padding-top:70px}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:var(--bg-primary);min-height:100vh;display:flex;flex-direction:column;color:var(--text-primary);transition:background .2s,color .2s}
    .main-content{flex:1;width:100%;margin-top:90px;padding:20px 15px 0}
    .container{background:var(--bg-secondary);backdrop-filter:blur(20px);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.15);padding:40px 30px 30px;max-width:600px;width:100%;margin:0 auto;position:relative;border:1px solid var(--border)}
    .account-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;gap:10px}
    .account-header h1{font-size:24px;font-weight:700;color:var(--text-primary);flex:1}
    .header-actions{display:flex;align-items:center;gap:10px}
    .logout-btn{background:rgba(229,9,20,.2);color:var(--accent);border:1px solid var(--accent);padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s;-webkit-tap-highlight-color:transparent;white-space:nowrap}
    .logout-btn:hover{background:var(--accent);color:#fff}

    .nav-tabs{display:flex;gap:10px;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:15px}

    .nav-tab{background:transparent;color:var(--text-secondary);border:none;padding:12px 20px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:500;transition:all .2s;-webkit-tap-highlight-color:transparent}
    .nav-tab:hover{color:var(--text-primary);background:var(--bg-hover)}
    .nav-tab.active{color:#fff;background:var(--accent)}
    
    .tab-content{display:none}
    .tab-content.active{display:block}
    
    .info-card{background:var(--bg-card);border-radius:12px;padding:20px;margin-bottom:15px;border:1px solid var(--border-light)}
    .info-item{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)}
    .info-item:last-child{border-bottom:none}
    .info-label{color:var(--text-secondary);font-size:14px}
    .info-value{color:var(--text-primary);font-weight:500;font-size:14px}
    
    .order-card{background:var(--bg-card);border-radius:12px;padding:20px;margin-bottom:15px;border:1px solid var(--border-light)}
    .order-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}
    .order-id{color:var(--accent);font-size:13px;font-weight:600}
    .order-date{color:var(--text-secondary);font-size:12px}
    .order-details{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .order-detail-item{padding:8px 0}
    .order-detail-label{color:var(--text-secondary);font-size:12px;margin-bottom:4px}
    .order-detail-value{color:var(--text-primary);font-size:13px;font-weight:500}
    .order-status{display:inline-block;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:600}
    .order-status.completed{background:rgba(52,199,89,.2);color:#34c759}
    .order-status.pending{background:rgba(255,204,0,.2);color:#ffcc00}
    .order-status.cancelled{background:rgba(255,59,48,.2);color:#ff3b30}
    
    .empty-state{text-align:center;padding:40px 20px;color:var(--text-muted)}
    .empty-state svg{width:60px;height:60px;margin-bottom:15px;opacity:.5}
    .empty-state p{font-size:14px}
    
    .loading{display:none;text-align:center;padding:40px}
    .loading.active{display:block}
    .spinner{width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto}
    @keyframes spin{to{transform:rotate(360deg)}}
    
    .toast-container{position:fixed;top:100px;left:50%;transform:translateX(-50%);z-index:3001;display:flex;flex-direction:column;gap:10px;padding:0 20px;max-width:600px;width:100%;pointer-events:none}
    .toast{background:var(--bg-secondary);backdrop-filter:blur(20px);border-radius:10px;padding:14px 18px;border:1px solid var(--border);box-shadow:0 8px 24px rgba(0,0,0,.15);pointer-events:auto;animation:slideIn .3s ease}
    @keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    .toast.success{border-color:var(--success)}
    .toast.success .toast-icon{color:var(--success)}
    .toast.error{border-color:var(--error)}
    .toast.error .toast-icon{color:var(--error)}
    .toast.warning{border-color:var(--warning)}
    .toast.warning .toast-icon{color:var(--warning)}
    .toast-content{display:flex;align-items:center;gap:10px}
    .toast-icon{font-size:18px}
    .toast-message{color:var(--text-primary);font-size:14px;font-weight:500}
    
    /* 支付成功模态框样式 */
    .success-modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:3000;align-items:center;justify-content:center;padding:20px}
    .success-modal.show{display:flex}
    .success-content{background:var(--bg-secondary);border-radius:24px;padding:40px;max-width:480px;width:100%;text-align:center;border:1px solid rgba(229,9,20,0.2);box-shadow:0 25px 80px rgba(0,0,0,0.3);animation:modalSlideIn 0.3s cubic-bezier(0.4,0,0.2,1)}
    @keyframes modalSlideIn{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .success-icon{font-size:64px;margin-bottom:20px}
    .success-title{font-size:24px;font-weight:700;color:var(--text-primary);margin:0 0 10px 0}
    .success-message{color:var(--text-secondary);font-size:14px;margin-bottom:25px}
    .code-display{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:20px;color:var(--text-primary);font-size:13px;word-break:break-all;font-family:monospace}
    .copy-button{background:linear-gradient(135deg,var(--accent) 0%,#ff3b30 100%);color:#fff;border:none;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.3s;width:100%;margin-bottom:15px}
    .copy-button:hover{transform:translateY(-2px);box-shadow:0 5px 20px rgba(229,9,20,0.4)}
    .close-button{background:var(--bg-hover);color:var(--text-secondary);border:1px solid var(--border);padding:14px 28px;border-radius:12px;font-size:14px;cursor:pointer;transition:all 0.3s}
    .close-button:hover{background:var(--bg-card)}
    .modal-tips{margin-top:20px;padding-top:20px;border-top:1px solid var(--border)}
    .modal-tip{color:var(--text-secondary);font-size:13px;line-height:1.6;margin-bottom:8px}
    .modal-tip:last-child{margin-bottom:0}
    .modal-tip-highlight{color:var(--text-muted);font-size:12px;margin-top:12px}
    .modal-close{position:absolute;top:20px;right:20px;width:32px;height:32px;border-radius:50%;background:var(--bg-hover);border:none;color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-size:20px;line-height:1}
    .modal-close:hover{background:var(--bg-card);color:var(--text-primary)}
    
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
    
    /* Ticket styles */
    .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
    .section-header h3{font-size:18px;font-weight:600;color:var(--text-primary)}
    .btn-accent{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--accent) 0%,#ff3b30 100%);color:#fff;border:none;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
    .btn-accent:hover{transform:translateY(-2px);box-shadow:0 4px 15px rgba(229,9,20,.3)}
    .ticket-card{background:var(--bg-card);border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid var(--border-light);cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
    .ticket-card::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:var(--accent);opacity:0;transition:opacity .2s}
    .ticket-card:hover{background:var(--bg-hover);transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,0,0,.1)}
    .ticket-card:hover::before{opacity:1}
    .ticket-card.payment::before{background:#ffcc00}
    .ticket-card.order::before{background:#34c759}
    .ticket-card.technical::before{background:#007aff}
    .ticket-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:10px}
    .ticket-type{font-size:11px;font-weight:600;text-transform:uppercase;padding:5px 10px;border-radius:6px;background:rgba(229,9,20,.15);color:var(--accent)}
    .ticket-type.payment{background:rgba(255,204,0,.15);color:#ffcc00}
    .ticket-type.order{background:rgba(52,199,89,.15);color:#34c759}
    .ticket-type.technical{background:rgba(0,122,255,.15);color:#007aff}
    .ticket-status{padding:5px 12px;border-radius:6px;font-size:11px;font-weight:600;flex-shrink:0}
    .ticket-status.pending{background:rgba(255,204,0,.15);color:#ffcc00}
    .ticket-status.processing{background:rgba(0,122,255,.15);color:#007aff}
    .ticket-status.resolved{background:rgba(52,199,89,.15);color:#34c759}
    .ticket-status.closed{background:rgba(142,142,147,.15);color:#8e8e93}
    .ticket-subject{color:var(--text-primary);font-size:15px;font-weight:600;margin-bottom:10px;line-height:1.4}
    .ticket-meta{color:var(--text-secondary);font-size:12px;display:flex;gap:16px;flex-wrap:wrap}
    .ticket-meta svg{width:12px;height:12px;vertical-align:-2px;margin-right:4px}
    .ticket-modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.85);backdrop-filter:blur(12px);z-index:3000;align-items:center;justify-content:center;padding:20px}
    .ticket-modal.show{display:flex}
    .ticket-modal-content{background:var(--bg-secondary);border-radius:20px;padding:30px;max-width:520px;width:100%;max-height:85vh;overflow-y:auto;border:1px solid var(--border);animation:modalSlideIn .3s cubic-bezier(0.4,0,0.2,1)}
    .ticket-modal-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border)}
    .ticket-modal-header h3{margin:0;font-size:20px;font-weight:600;color:var(--text-primary)}
    .ticket-modal-close{width:36px;height:36px;border-radius:50%;background:var(--bg-hover);border:none;color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;transition:all .2s}
    .ticket-modal-close:hover{background:var(--bg-card);color:var(--text-primary)}
    .form-group{margin-bottom:20px}
    .form-group label{display:block;margin-bottom:8px;font-weight:600;font-size:13px;color:var(--text-secondary)}
    .form-group input,.form-group select,.form-group textarea{width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:10px;font-size:14px;background:var(--bg-primary);color:var(--text-primary);transition:border-color .2s,box-shadow .2s}
    .form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(229,9,20,.1)}
    .form-group textarea{min-height:120px;resize:vertical}
    .btn{padding:12px 24px;border-radius:10px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all .2s}
    .btn-primary{background:var(--accent);color:#fff}
    .btn-primary:hover{background:var(--accent-hover);transform:translateY(-1px)}
    .btn-secondary{background:var(--bg-hover);color:var(--text-primary);border:1px solid var(--border)}
    .btn-secondary:hover{background:var(--bg-card)}
    .btn-danger{background:rgba(255,59,48,.15);color:#ff3b30;border:1px solid #ff3b30}
    .btn-danger:hover{background:#ff3b30;color:#fff}
    .ticket-reply{background:var(--bg-card);border-radius:12px;padding:16px;margin-bottom:12px;border-left:3px solid var(--accent)}
    .ticket-reply.admin{border-left-color:#007aff}
    .ticket-reply-header{display:flex;justify-content:space-between;margin-bottom:8px}
    .ticket-reply-author{font-size:13px;font-weight:600;color:var(--text-primary)}
    .ticket-reply.admin .ticket-reply-author{color:#007aff}
    .ticket-reply-time{font-size:11px;color:var(--text-muted)}
    .ticket-reply-content{color:var(--text-secondary);font-size:14px;line-height:1.5}
    .ticket-reply-form{margin-top:20px;padding-top:20px;border-top:1px solid var(--border)}
    .ticket-reply-form textarea{margin-bottom:12px}
    .reply-list{max-height:400px;overflow-y:auto;margin-bottom:20px}
    .empty-tickets{text-align:center;padding:50px 20px}
    .empty-tickets-icon{width:64px;height:64px;margin:0 auto 16px;opacity:.4}
    .empty-tickets h4{font-size:16px;font-weight:600;color:var(--text-primary);margin-bottom:8px}
    .empty-tickets p{font-size:13px;color:var(--text-muted);margin-bottom:20px}
  </style>
</head>
<body>
  ${PAGE_HEADER}
  <div class="main-content">
    <div class="container">
    <div class="account-header">
      <h1 data-i18n="userCenter">👤 Account Center</h1>
      <div class="header-actions">
        <button class="logout-btn" onclick="logout()" data-i18n="logout">Logout</button>
      </div>
    </div>
    
    <div class="nav-tabs">
      <button class="nav-tab active" onclick="switchTab('info')" data-i18n="accountInfo">Account Info</button>
      <button class="nav-tab" onclick="switchTab('orders')" data-i18n="orderHistory">Order History</button>
      <button class="nav-tab" onclick="switchTab('tickets')" data-i18n="myTickets">My Tickets</button>
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
    
    <div id="ticketsTab" class="tab-content">
      <div class="section-header">
        <h3 data-i18n="ticketList">Ticket List</h3>
        <button class="btn-accent" onclick="showCreateTicketModal()" data-i18n="createTicket">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Ticket
        </button>
      </div>
      <div id="ticketsList"></div>
      <div id="ticketsLoading" class="loading">
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
       <h2 class="success-title" data-i18n="paymentSuccess">Payment Successful!</h2>
       <p class="success-message" data-i18n="subUrlGenerated">Your subscription URL has been generated</p>
       <div class="code-display" id="generatedCode" style="font-size: 14px; word-break: break-all;">-</div>
       <button class="copy-button" onclick="copyCode()" data-i18n="copyUrl">Copy URL</button>
       <div class="modal-tips">
         <p class="modal-tip">You can add this URL directly to your player</p>
         <p class="modal-tip-highlight">You can view order details in your account page after closing</p>
       </div>
     </div>
    </div>
    
    <!-- Create Ticket Modal -->
    <div id="createTicketModal" class="ticket-modal">
      <div class="ticket-modal-content">
        <div class="ticket-modal-header">
          <h3 data-i18n="createNewTicket">Create New Ticket</h3>
          <button class="ticket-modal-close" onclick="closeCreateTicketModal()">×</button>
        </div>
        <form id="createTicketForm">
          <div class="form-group">
            <label data-i18n="selectOrder">Select Order</label>
            <select id="ticketOrderId" required>
              <option value="" data-i18n="selectOrderPlaceholder">-- Select an order --</option>
            </select>
          </div>
          <div class="form-group">
            <label data-i18n="ticketType">Ticket Type</label>
            <select id="ticketType" required>
              <option value="payment" data-i18n="typePayment">Payment Issue</option>
              <option value="order" data-i18n="typeOrder">Order Inquiry</option>
              <option value="technical" data-i18n="typeTechnical">Technical Support</option>
              <option value="other" data-i18n="typeOther">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label data-i18n="ticketSubject">Subject</label>
            <input type="text" id="ticketSubject" required maxlength="200" placeholder="Enter ticket subject">
          </div>
          <div class="form-group">
            <label data-i18n="ticketDescription">Description</label>
            <textarea id="ticketDescription" required placeholder="Describe your issue in detail"></textarea>
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="button" class="btn btn-secondary" onclick="closeCreateTicketModal()" data-i18n="cancel">Cancel</button>
            <button type="submit" class="btn btn-primary" data-i18n="submitTicket">Submit Ticket</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Ticket Detail Modal -->
    <div id="ticketDetailModal" class="ticket-modal">
      <div class="ticket-modal-content">
        <div class="ticket-modal-header">
          <h3 id="ticketDetailTitle">Ticket Details</h3>
          <button class="ticket-modal-close" onclick="closeTicketDetailModal()">×</button>
        </div>
        <div id="ticketDetailContent"></div>
        <div class="ticket-reply-form" id="ticketReplyForm">
          <textarea id="replyContent" placeholder="Enter your reply..." style="width:100%;min-height:80px;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-primary);color:var(--text-primary);margin-bottom:12px;font-size:14px;"></textarea>
          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button type="button" class="btn btn-danger" onclick="closeTicketAction()" data-i18n="closeTicket">Close Ticket</button>
            <button type="button" class="btn btn-primary" onclick="submitTicketReply()" data-i18n="sendReply">Send Reply</button>
          </div>
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

    // 翻译函数 - 使用 translate.js 处理页面翻译
    function t(key) {
      return key;
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

    // 检查URL参数中的OAuth token（来自Google登录回调）
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('auth_token', urlToken);
      // 清除URL参数
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    
    // 检查登录状态
    if (!getToken()) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
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
          // token无效，清除登录态并重定向到登录页
          localStorage.removeItem('auth_token');
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
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
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
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
      } else if (tab === 'tickets') {
        loadTickets();
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
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
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
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }
        }
      } catch (error) {
        console.error('加载订单历史失败:', error);
        showToast(t('networkError'), 'error');
      } finally {
        loadingDiv.classList.remove('active');
      }
    }
    
    async function loadTickets() {
      const ticketsListDiv = document.getElementById('ticketsList');
      const loadingDiv = document.getElementById('ticketsLoading');
      
      ticketsListDiv.innerHTML = '';
      loadingDiv.classList.add('active');
      
      try {
        const response = await fetch('/api/tickets', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          const tickets = data.tickets || [];
          
          if (tickets.length === 0) {
ticketsListDiv.innerHTML = \`
              <div class="empty-tickets">
                <svg class="empty-tickets-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                <h4>No tickets yet</h4>
                <p>If you have any questions about your orders, feel free to contact us</p>
                <button class="btn-accent" onclick="showCreateTicketModal()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Create Your First Ticket
                </button>
              </div>
            \`;
          } else {
            ticketsListDiv.innerHTML = tickets.map(ticket => {
              const createdDate = new Date(ticket.created_at);
              const typeLabels = { payment: 'Payment', order: 'Order', technical: 'Technical', other: 'Other' };
              return \`
                <div class="ticket-card \${ticket.type}" onclick="showTicketDetail(\${ticket.id})">
                  <div class="ticket-header">
                    <span class="ticket-type \${ticket.type}">\${typeLabels[ticket.type] || ticket.type}</span>
                    <span class="ticket-status \${ticket.status}">\${ticket.status}</span>
                  </div>
                  <div class="ticket-subject">\${ticket.subject}</div>
                  <div class="ticket-meta">
                    <span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Order #\${ticket.order_id}
                    </span>
                    <span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                      </svg>
                      \${createdDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              \`;
            }).join('');
          }
        } else {
          showToast(data.error || 'Failed to load tickets', 'error');
        }
      } catch (error) {
        console.error('Load tickets error:', error);
        showToast('Network error', 'error');
      } finally {
        loadingDiv.classList.remove('active');
      }
    }
    
    async function showCreateTicketModal() {
      document.getElementById('createTicketModal').classList.add('show');
      
      // Load orders for dropdown
      try {
        const response = await fetch('/api/auth/orders', {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        const data = await response.json();
        
        if (data.success && data.orders) {
          const select = document.getElementById('ticketOrderId');
          select.innerHTML = '<option value="">-- Select an order --</option>';
          
          data.orders.filter(o => o.status === 'completed').forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString();
            select.innerHTML += \`<option value="\${order.order_id}">#\${order.order_id} - \${order.duration_days || '-'} days - \${order.amount ? '¥' + order.amount.toFixed(2) : '-'} (\${date})</option>\`;
          });
        }
      } catch (error) {
        console.error('Load orders error:', error);
      }
    }
    
    function closeCreateTicketModal() {
      document.getElementById('createTicketModal').classList.remove('show');
      document.getElementById('createTicketForm').reset();
    }
    
    document.getElementById('createTicketForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const order_id = document.getElementById('ticketOrderId').value;
      const type = document.getElementById('ticketType').value;
      const subject = document.getElementById('ticketSubject').value;
      const description = document.getElementById('ticketDescription').value;
      
      try {
        const response = await fetch('/api/tickets', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ order_id, type, subject, description })
        });
        
        const data = await response.json();
        
        if (data.success) {
          showToast('Ticket created successfully', 'success');
          closeCreateTicketModal();
          loadTickets();
        } else {
          showToast(data.error || 'Failed to create ticket', 'error');
        }
      } catch (error) {
        console.error('Create ticket error:', error);
        showToast('Network error', 'error');
      }
    });
    
    let currentTicketId = null;
    
    async function showTicketDetail(ticketId) {
      currentTicketId = ticketId;
      document.getElementById('ticketDetailModal').classList.add('show');
      
      try {
        const response = await fetch('/api/tickets/' + ticketId, {
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          const ticket = data.ticket;
          const replies = data.replies || [];
          const typeLabels = { payment: 'Payment', order: 'Order', technical: 'Technical', other: 'Other' };
          const statusLabels = { pending: 'Pending', processing: 'Processing', resolved: 'Resolved', closed: 'Closed' };
          const createdDate = new Date(ticket.created_at).toLocaleString();
          
          document.getElementById('ticketDetailTitle').textContent = ticket.subject;
          
          let html = \`
            <div style="margin-bottom:20px;">
              <div style="display:flex;gap:12px;margin-bottom:12px;">
                <span class="ticket-type \${ticket.type}">\${typeLabels[ticket.type]}</span>
                <span class="ticket-status \${ticket.status}">\${statusLabels[ticket.status]}</span>
              </div>
              <div style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">
                <span>Order: #\${ticket.order_id}</span> · <span>Created: \${createdDate}</span>
              </div>
              <div style="background:var(--bg-card);padding:16px;border-radius:8px;margin-bottom:20px;">
                <p style="color:var(--text-primary);margin:0;line-height:1.6;">\${ticket.description}</p>
              </div>
            </div>
            <h4 style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;text-transform:uppercase;">Replies</h4>
            <div class="reply-list">
          \`;
          
          if (replies.length === 0) {
            html += '<p style="color:var(--text-muted);text-align:center;padding:20px;">No replies yet</p>';
          } else {
            replies.forEach(reply => {
              const replyDate = new Date(reply.created_at).toLocaleString();
              const author = reply.is_admin ? 'Support' : 'You';
              html += \`
                <div class="ticket-reply \${reply.is_admin ? 'admin' : ''}">
                  <div class="ticket-reply-header">
                    <span class="ticket-reply-author">\${author}</span>
                    <span class="ticket-reply-time">\${replyDate}</span>
                  </div>
                  <div class="ticket-reply-content">\${reply.content}</div>
                </div>
              \`;
            });
          }
          
          html += '</div>';
          document.getElementById('ticketDetailContent').innerHTML = html;
          
          // Show/hide reply form based on ticket status
          document.getElementById('ticketReplyForm').style.display = ticket.status === 'closed' ? 'none' : 'block';
        } else {
          showToast(data.error || 'Failed to load ticket', 'error');
          closeTicketDetailModal();
        }
      } catch (error) {
        console.error('Load ticket error:', error);
        showToast('Network error', 'error');
        closeTicketDetailModal();
      }
    }
    
    function closeTicketDetailModal() {
      document.getElementById('ticketDetailModal').classList.remove('show');
      currentTicketId = null;
    }
    
    async function submitTicketReply() {
      if (!currentTicketId) return;
      
      const content = document.getElementById('replyContent').value.trim();
      if (!content) {
        showToast('Please enter reply content', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/tickets/' + currentTicketId + '/reply', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content })
        });
        
        const data = await response.json();
        
        if (data.success) {
          showToast('Reply sent successfully', 'success');
          document.getElementById('replyContent').value = '';
          showTicketDetail(currentTicketId);
        } else {
          showToast(data.error || 'Failed to send reply', 'error');
        }
      } catch (error) {
        console.error('Submit reply error:', error);
        showToast('Network error', 'error');
      }
    }
    
    async function closeTicketAction() {
      if (!currentTicketId) return;
      
      if (!confirm('Are you sure you want to close this ticket?')) return;
      
      try {
        const response = await fetch('/api/tickets/' + currentTicketId + '/close', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          showToast('Ticket closed successfully', 'success');
          closeTicketDetailModal();
          loadTickets();
        } else {
          showToast(data.error || 'Failed to close ticket', 'error');
        }
      } catch (error) {
        console.error('Close ticket error:', error);
        showToast('Network error', 'error');
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
    
    // 主题初始化
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved ? saved === 'dark' : prefersDark;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    })();
    function updateThemeIcons(isDark) {
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = isDark ? 'none' : 'block';
        moon.style.display = isDark ? 'block' : 'none';
      }
    }

    // 主题切换
    document.getElementById('themeToggle')?.addEventListener('click', function() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = next === 'dark' ? 'none' : 'block';
        moon.style.display = next === 'dark' ? 'block' : 'none';
      }
    });
    
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
