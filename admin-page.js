// 管理后台页面内容
export const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>直播服务管理后台</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#f5f5f7;color:#1d1d1f}
    .login-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}
    .login-box{background:white;padding:40px;border-radius:12px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.3)}
    .login-box h2{margin-bottom:24px;text-align:center;color:#1d1d1f}
    .login-box input{width:100%;padding:12px 16px;border:1px solid #d2d2d7;border-radius:8px;font-size:16px;margin-bottom:16px}
    .login-box button{width:100%;padding:12px;background:#0071e3;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;transition:background .2s}
    .login-box button:hover{background:#0077ed}
    .login-error{color:#ff3b30;text-align:center;margin-bottom:12px;font-size:14px}
    .captcha-container{display:flex;gap:10px;align-items:center;margin-bottom:16px}
    .captcha-input{flex:1;padding:12px 16px;border:1px solid #d2d2d7;border-radius:8px;font-size:16px;text-align:center;letter-spacing:3px}
    .captcha-canvas{width:100px;height:44px;border:1px solid #d2d2d7;border-radius:8px;cursor:pointer;flex-shrink:0}
    .captcha-refresh{padding:12px 16px;background:#f5f5f7;border:1px solid #d2d2d7;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;transition:background .2s;white-space:nowrap;flex-shrink:0}
    .captcha-refresh:hover{background:#e5e5ea}
    .container{max-width:1400px;margin:0 auto;padding:20px}
    .header{background:white;padding:20px 30px;border-radius:12px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .header h1{font-size:24px;font-weight:600}
    .logout-btn{padding:8px 16px;background:#f5f5f7;border:1px solid #d2d2d7;border-radius:6px;cursor:pointer;font-size:14px}
    .logout-btn:hover{background:#e8e8ed}
    .nav-tabs{display:flex;gap:8px;margin-bottom:20px}
    .nav-tab{padding:10px 20px;background:white;border:1px solid #d2d2d7;border-radius:8px;cursor:pointer;font-size:14px;transition:all .2s}
    .nav-tab:hover{background:#f5f5f7}
    .nav-tab.active{background:#0071e3;color:white;border-color:#0071e3}
    .tab-content{display:none}
    .tab-content.active{display:block}
    .card{background:white;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.04);margin-bottom:20px}
    .card h3{margin-bottom:16px;font-size:18px;font-weight:600}
    .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
    .stat-item{padding:20px;background:#f5f5f7;border-radius:8px;text-align:center}
    .stat-value{font-size:32px;font-weight:600;color:#0071e3}
    .stat-label{margin-top:8px;color:#86868b;font-size:14px}
    .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
    .btn{padding:8px 16px;border-radius:6px;border:none;cursor:pointer;font-size:14px;transition:all .2s}
    .btn-primary{background:#0071e3;color:white}
    .btn-primary:hover{background:#0077ed}
    .btn-danger{background:#ff3b30;color:white}
    .btn-danger:hover{background:#ff453a}
    .btn-success{background:#34c759;color:white}
    .btn-success:hover{background:#30d158}
    .btn-sm{padding:4px 8px;font-size:12px}
    table{width:100%;border-collapse:collapse}
    th,td{padding:12px;text-align:left;border-bottom:1px solid #f5f5f7}
    th:first-child,td:first-child{text-align:center;width:40px;}
    th{background:#f5f5f7;font-weight:600;font-size:13px;color:#86868b;text-transform:uppercase}
    tr:hover{background:#f9f9fb}
    .badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500}
    .badge-success{background:#e8f5e9;color:#2e7d32}
    .badge-warning{background:#fff3e0;color:#e65100}
    .badge-danger{background:#ffebee;color:#c62828}
    .modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);align-items:center;justify-content:center;z-index:100}
    .modal.active{display:flex}
    .modal-content{background:white;padding:24px;border-radius:12px;width:100%;max-width:500px;max-height:80vh;overflow-y:auto}
    .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
    .modal-header h3{margin:0}
    .close-btn{background:none;border:none;font-size:24px;cursor:pointer;color:#86868b}
    .form-group{margin-bottom:16px}
    .form-group label{display:block;margin-bottom:6px;font-weight:500;font-size:14px}
    .form-group input,.form-group select,.form-group textarea{width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px}
    .form-group textarea{min-height:80px;resize:vertical}
    .form-row{display:flex;gap:16px}
    .form-row .form-group{flex:1}
    .modal-footer{display:flex;justify-content:flex-end;gap:8px;margin-top:24px}
    .search-box{padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;width:200px}
    .filter-select{padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px}
    .empty-state{text-align:center;padding:40px;color:#86868b}
    .action-buttons{display:flex;gap:4px}
    .toast{position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:8px;color:white;font-size:14px;z-index:1000;animation:slideIn .3s ease}
    .toast.success{background:#34c759}
    .toast.error{background:#ff3b30}
    .toast.info{background:#0071e3}
    @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    .loading-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,.8);display:none;align-items:center;justify-content:center;z-index:2000}
    .loading-overlay.active{display:flex}
    .loading-spinner{width:40px;height:40px;border:3px solid #e5e5ea;border-top-color:#0071e3;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-top:16px;color:#86868b;font-size:14px}
    .sync-indicator{position:fixed;top:80px;right:20px;padding:12px 16px;background:#fff3e0;border:1px solid #ff9800;border-radius:8px;z-index:1500;display:none;align-items:center;gap:8px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
    .sync-indicator.active{display:flex}
    .sync-spinner{width:16px;height:16px;border:2px solid #ffe0b2;border-top-color:#ff9800;border-radius:50%;animation:spin 1s linear infinite}
    .code-display{font-family:'Courier New',monospace;background:#f5f5f7;padding:8px;border-radius:4px;font-size:13px}
    .generated-codes{background:#f5f5f7;padding:16px;border-radius:8px;margin-top:16px}
    .generated-codes h4{margin-bottom:12px}
    .generated-codes-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #e5e5ea}
    .generated-codes-item:last-child{border-bottom:none}
    .pagination{display:flex;justify-content:center;align-items:center;gap:8px;margin-top:20px}
    .pagination button{padding:6px 12px;border:1px solid #d2d2d7;background:white;border-radius:6px;cursor:pointer;font-size:14px}
    .pagination button:hover:not(:disabled){background:#f5f5f7}
    .pagination button:disabled{color:#86868b;cursor:not-allowed}
    .pagination button.active{background:#0071e3;color:white;border-color:#0071e3}
    .pagination-info{color:#86868b;font-size:14px;margin-right:12px}
    .hidden{display:none!important}
    .play-url-cell{max-width:300px;padding:8px}
    .play-url{display:inline-block;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#0071e3;font-size:12px}
    .btn-copy{padding:2px 8px;font-size:11px;margin-left:6px;background:#f5f5f7}
    .btn-copy:hover{background:#e8e8ed}
    .headers-cell{max-width:200px;padding:8px;font-size:11px;color:#86868b}
    .headers-tag{display:inline-block;padding:2px 6px;background:#f5f5f7;border-radius:4px;margin:2px;font-size:10px}
    .ticket-type-badge{display:inline-block;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase}
    .ticket-type-badge.payment{background:rgba(255,204,0,.15);color:#b8860b}
    .ticket-type-badge.order{background:rgba(52,199,89,.15);color:#2e7d32}
    .ticket-type-badge.technical{background:rgba(0,122,255,.15);color:#007aff}
    .ticket-type-badge.other{background:rgba(142,142,147,.15);color:#6e6e73}
    .ticket-status-badge{display:inline-block;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600}
    .ticket-status-badge.pending{background:rgba(255,204,0,.15);color:#b8860b}
    .ticket-status-badge.processing{background:rgba(0,122,255,.15);color:#007aff}
    .ticket-status-badge.resolved{background:rgba(52,199,89,.15);color:#2e7d32}
    .ticket-status-badge.closed{background:rgba(142,142,147,.15);color:#6e6e73}
    /* 自定义白色打钩复选框样式 */
    .custom-checkbox {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      width: 18px;
      height: 18px;
      border: 2px solid #d2d2d7;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      position: relative;
      vertical-align: middle;
      margin: 0;
      padding: 0;
      transition: all 0.2s ease;
    }
    .custom-checkbox:hover {
      border-color: #0071e3;
    }
    .custom-checkbox:checked {
      background: #0071e3;
      border-color: #0071e3;
    }
    .custom-checkbox:checked::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 5px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .custom-checkbox:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
    }
  </style>
</head>
<body>
  <div id="loginOverlay" class="login-overlay hidden">
    <div class="login-box">
      <h2>管理后台登录</h2>
      <div id="loginError" class="login-error" style="display:none;"></div>
      <input type="password" id="adminKey" placeholder="请输入管理员密钥">
      <div class="captcha-container">
        <input type="text" id="captchaInput" placeholder="验证码" maxlength="4">
        <canvas id="captchaCanvas" width="100" height="44" onclick="refreshCaptcha()"></canvas>
      </div>
      <button onclick="login()">登录</button>
    </div>
  </div>
  <div class="container" id="mainContent" style="display:none;">
    <div class="header">
      <h1>直播服务管理后台</h1>
      <button class="logout-btn" onclick="logout()">退出登录</button>
    </div>
    <div class="nav-tabs">
      <button class="nav-tab active" onclick="showTab('sources')">直播源管理</button>
      <button class="nav-tab" onclick="showTab('channels')">频道管理</button>
      <button class="nav-tab" onclick="showTab('codes')">卡密管理</button>
      <button class="nav-tab" onclick="showTab('users')">账户管理</button>
      <button class="nav-tab" onclick="showTab('orders')">订单管理</button>
      <button class="nav-tab" onclick="showTab('mall')">商城管理</button>
      <button class="nav-tab" onclick="showTab('tickets')">工单管理</button>
      <button class="nav-tab" onclick="showTab('security')">安全监控</button>
      <button class="nav-tab" onclick="showTab('ip-blacklist')">IP黑名单</button>
      <button class="nav-tab" onclick="showTab('domain-blacklist')">域名黑名单</button>
      <button class="nav-tab" onclick="showTab('homepage-display')">首页展示</button>
      <button class="nav-tab" onclick="showTab('ad-management')">广告管理</button>
      <button class="nav-tab" onclick="showTab('system-settings')">系统设置</button>
    </div>
    <div id="sources" class="tab-content active">
      <div class="card">
        <div class="toolbar">
          <h3>直播源列表</h3>
          <div style="display:flex;gap:16px;">
            <button class="btn btn-success" onclick="syncAllSources()">同步全部</button>
            <button class="btn btn-primary" onclick="showSourceModal()">添加源</button>
            <button class="btn" onclick="toggleSyncFilter()">同步过滤</button>
          </div>
        </div>
        <div id="syncFilterPanel" class="card" style="display:none;padding:16px;background:#f9f9fb;">
          <h4 style="margin-bottom:12px;font-weight:600;">同步过滤规则</h4>
          <p style="margin-bottom:16px;color:#86868b;font-size:14px;">在同步源时，可以根据分组名、播放地址或频道名排除不需要的频道，也可以重命名分组名。留空则不过滤。</p>
          <div class="form-row">
            <div class="form-group">
              <label>排除分组名（包含以下关键字的分组将不被同步）</label>
              <textarea id="syncExcludeGroups" rows="3" placeholder="例如：电影, 电视剧, 体育&#10;或者每行一个：&#10;电影&#10;电视剧&#10;体育" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
            <div class="form-group">
              <label>排除播放地址（包含以下关键字的URL将不被同步）</label>
              <textarea id="syncExcludeUrls" rows="3" placeholder="例如：example.com, test.com, ads" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>排除频道名（包含以下关键字的频道将不被同步）</label>
              <textarea id="syncExcludeNames" rows="3" placeholder="例如：测试, 预告, 广告" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>
                <input type="checkbox" id="excludeDuplicateUrls" style="margin-right:8px;">
                过滤重复播放地址（只保留每个播放地址的第一个频道）
              </label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>分组重命名规则（根据关键字重命名分组）</label>
              <textarea id="groupRenameRules" rows="4" placeholder="格式：关键字->新分组名&#10;例如：&#10;央视->中央电视台&#10;CCTV->央视频道&#10;体育->体育赛事&#10;电影->影视娱乐&#10;每行一个规则，支持'包含'匹配" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>排除分组重命名（以下分组不重命名）</label>
              <textarea id="groupRenameExclude" rows="2" placeholder="例如：央视, CCTV, 体育&#10;或者每行一个：&#10;央视&#10;CCTV&#10;体育" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button class="btn btn-primary" onclick="saveSyncFilters()">保存规则</button>
            <button class="btn" onclick="clearSyncFilters()">清空规则</button>
            <button class="btn" onclick="toggleSyncFilter()">收起</button>
          </div>
        </div>
        <table><thead><tr><th>ID</th><th>名称</th><th>类型</th><th>解析模式</th><th>状态</th><th>频道数</th><th>最后更新</th><th>操作</th></tr></thead><tbody id="sourcesTable"></tbody></table>
      </div>
    </div>
    <div id="channels" class="tab-content">
      <div class="card">
        <div class="toolbar"><h3>频道列表</h3><div><select class="filter-select" id="channelSourceFilter" onchange="onSourceFilterChange()"><option value="">全部源</option></select><select class="filter-select" id="channelGroupFilter" onchange="resetChannelPage()"><option value="">全部分组</option></select><input type="text" class="search-box" id="channelSearch" placeholder="搜索频道..." oninput="resetChannelPage()"><select class="filter-select" id="channelPageSize" onchange="resetChannelPage()"><option value="10">10条/页</option><option value="20">20条/页</option><option value="30" selected>30条/页</option><option value="50">50条/页</option><option value="100">100条/页</option></select><button class="btn btn-danger" onclick="clearChannels()">清空数据</button></div></div>
        <table><thead><tr><th>频道名称</th><th>分组</th><th>直播源</th><th>播放地址</th><th>请求头</th><th>状态</th><th>操作</th></tr></thead><tbody id="channelsTable"></tbody></table>
        <div id="channelPagination" class="pagination"></div>
      </div>
    </div>
    <div id="codes" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>卡密列表</h3>
          <div>
            <button class="btn btn-success" onclick="toggleAdvancedFilter()">高级查询</button>
            <button class="btn btn-danger" onclick="batchDeleteCodes()">批量删除选中</button>
            <button class="btn btn-primary" onclick="exportCodesCSV()">导出CSV</button>
            <button class="btn btn-primary" onclick="showImportCodeModal()">批量导入</button>
            <button class="btn btn-primary" onclick="showGenerateCodeModal()">生成卡密</button>
            <button class="btn btn-danger" onclick="clearCodes()">清空数据</button>
          </div>
        </div>
        <div id="advancedFilterPanel" class="card" style="display:none;margin-bottom:16px;padding:16px;background:#f9f9fb;">
          <div class="form-row" style="margin-bottom:12px;">
            <div class="form-group"><label>卡密</label><input type="text" id="codeFilter" placeholder="输入卡密关键词" class="search-box" style="width:200px;"></div>
            <div class="form-group"><label>状态</label><select class="filter-select" id="codeStatusFilter" onchange="resetCodePage()"><option value="">全部</option><option value="unused">未使用</option><option value="active">活跃</option><option value="disabled">禁用</option></select></div>
            <div class="form-group"><label>有效期(天)</label><div style="display:flex;gap:8px;"><input type="number" id="durationMin" placeholder="最小" class="search-box" style="width:80px;"><span>-</span><input type="number" id="durationMax" placeholder="最大" class="search-box" style="width:80px;"></div></div>
            <div class="form-group"><label>过期时间</label><div style="display:flex;gap:8px;"><input type="date" id="expiredFrom" class="search-box"><span>-</span><input type="date" id="expiredTo" class="search-box"></div></div>
          </div>
          <div class="form-row" style="margin-bottom:12px;">
            <div class="form-group"><label>激活时间</label><div style="display:flex;gap:8px;"><input type="date" id="activatedFrom" class="search-box"><span>-</span><input type="date" id="activatedTo" class="search-box"></div></div>
            <div class="form-group"><label>备注</label><input type="text" id="remarkFilter" placeholder="备注关键词" class="search-box" style="width:200px;"></div>
            <div class="form-group"><label>每页条数</label><select class="filter-select" id="codePageSize" onchange="resetCodePage()"><option value="10">10条/页</option><option value="20">20条/页</option><option value="30" selected>30条/页</option><option value="50">50条/页</option><option value="100">100条/页</option></select></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="resetCodePage()">查询</button>
            <button class="btn" onclick="clearCodeFilters()">重置</button>
          </div>
        </div>
        <table><thead><tr><th><input type="checkbox" id="selectAllCodes" class="custom-checkbox" onclick="toggleSelectAllCodes()"></th><th>卡密</th><th>状态</th><th>有效期(天)</th><th>最大IP数</th><th>激活时间</th><th>过期时间</th><th>备注</th><th>操作</th></tr></thead><tbody id="codesTable"></tbody></table>
        <div id="codePagination" class="pagination"></div>
      </div>
    </div>
    <div id="tickets" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>Ticket List</h3>
          <div style="display:flex;gap:16px;align-items:center;">
            <select class="filter-select" id="ticketStatusFilter" onchange="loadTickets()">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select class="filter-select" id="ticketTypeFilter" onchange="loadTickets()">
              <option value="all">All Types</option>
              <option value="payment">Payment</option>
              <option value="order">Order</option>
              <option value="technical">Technical</option>
              <option value="other">Other</option>
            </select>
            <input type="text" class="search-box" id="ticketSearch" placeholder="Search by email or subject..." oninput="loadTickets()">
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="ticketsTable"></tbody>
        </table>
        <div id="noTickets" class="empty-state">No tickets found</div>
      </div>
    </div>
    <div id="security" class="tab-content">
      <div class="card">
        <div class="toolbar"><h3>安全配置</h3><button class="btn btn-primary" onclick="loadSecurityConfig()">刷新配置</button></div>
        <div id="securityConfigForm" style="display:none;padding:16px;background:#f9f9fb;border-radius:8px;">
          <div class="form-row" style="margin-bottom:16px;">
            <div class="form-group">
              <label>每日播放次数限制（每个频道）</label>
              <input type="number" id="channelDailyLimit" min="1" max="1000" value="100">
              <small style="color:#86868b;font-size:12px;">每个频道每天最多播放次数</small>
            </div>
            <div class="form-group">
              <label>自动封禁时长（天）</label>
              <input type="number" id="banDurationDays" min="0" max="365" value="7">
              <small style="color:#86868b;font-size:12px;">0表示永久封禁</small>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="autoBanOnExceed" checked style="width:auto;">
              <span>超出限制自动封禁</span>
            </label>
            <small style="color:#86868b;font-size:12px;">勾选后，频道播放次数超限会自动封禁卡密</small>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="saveSecurityConfig()">保存配置</button>
            <button class="btn" onclick="resetSecurityConfig()">重置为默认</button>
          </div>
        </div>
        <div id="noSecurityConfig" class="empty-state">点击"刷新配置"按钮加载当前配置</div>
      </div>
      <div class="card">
        <div class="toolbar"><h3>卡密额度管理</h3><div><input type="text" id="quotaCode" placeholder="输入卡密" class="search-box"><button class="btn btn-primary" onclick="loadQuotaInfo()">查询额度</button><button class="btn btn-success" onclick="unbanCode()">解封卡密</button></div></div>
        <div id="quotaInfo" style="display:none;">
          <div class="stats-grid">
            <div class="stat-item"><div class="stat-value" id="quotaTotalPlays">0</div><div class="stat-label">今日播放次数</div></div>
            <div class="stat-item"><div class="stat-value" id="quotaExceededCount">0</div><div class="stat-label">超限频道数</div></div>
            <div class="stat-item" id="quotaBanStatus"><div class="stat-value" style="color:#34c759;">正常</div><div class="stat-label">状态</div></div>
            <div class="stat-item"><div class="stat-value" id="quotaBanTime">-</div><div class="stat-label">封禁时间</div></div>
          </div>
          <div id="banAlert" style="margin-top:20px;display:none;padding:16px;background:#ffebee;border-left:4px solid #ff3b30;border-radius:4px;">
            <h4 style="margin-bottom:12px;color:#d32f2f;">⚠️ 卡密已被封禁</h4>
            <p style="margin-bottom:8px;"><strong>原因：</strong>该卡密今日有频道超出播放额度（<span id="banLimitText">100</span>次/天）</p>
            <p style="margin-bottom:8px;"><strong>封禁时长：</strong><span id="banDurationText">-</span></p>
            <p style="margin-bottom:8px;"><strong>封禁到期：</strong><span id="banUntilText">-</span></p>
            <p><strong>影响：</strong>无法使用订阅和播放功能</p>
            <p style="margin-top:8px;"><strong>解决方法：</strong></p>
            <ul style="margin-left:20px;">
              <li>如果是误封，点击"解封卡密"按钮手动解封</li>
              <li>等待封禁时间自动解除</li>
              <li>联系管理员获取新卡密</li>
            </ul>
          </div>
          <div id="channelPlaysSection" style="margin-top:20px;display:none;">
            <h4 style="margin-bottom:12px;">频道播放详情</h4>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th>频道名称</th>
                  <th>播放次数</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody id="channelPlaysTable">
              </tbody>
            </table>
          </div>
        </div>
        <div id="noQuotaData" class="empty-state">请输入卡密查看额度使用情况</div>
      </div>
      <div class="card" style="margin-top:20px;">
        <div class="toolbar">
          <h3>卡密封禁列表</h3>
          <button class="btn btn-primary" onclick="loadBannedCodes()">刷新列表</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>卡密</th>
              <th>状态</th>
              <th>有效期(天)</th>
              <th>激活时间</th>
              <th>过期时间</th>
              <th>封禁到期</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="bannedCodesTable"></tbody>
        </table>
        <div id="noBannedCodes" class="empty-state">暂无封禁卡密</div>
      </div>
      <div class="card" style="margin-top:20px;">
        <h3>额度说明</h3>
        <div style="line-height:1.8;color:#86868b;font-size:14px;">
          <p><strong>📊 额度规则[限制用户分享或二次代理]：</strong></p>
          <ul style="margin-left:20px;margin-bottom:16px;">
            <li>每个频道每天播放次数限制可在上方配置中设置</li>
            <li>超过额度会根据配置自动封禁卡密（可设置封禁时长）</li>
            <li>每天凌晨0点自动重置额度</li>
            <li>所有频道独立计算额度</li>
          </ul>
          <p><strong>✅ 正常使用：</strong></p>
          <p>每天看10个频道，每个频道播放10次，远低于限制</p>
          <p style="margin-bottom:16px;">正常观看完全够用，不会触发封禁</p>
          <p><strong>❌ 异常行为：</strong></p>
          <p>使用脚本或代理刷播放地址，短时间内大量播放</p>
          <p>会触发自动封禁机制（临时或永久，取决于配置）</p>
        </div>
      </div>
    </div>
    <div id="ip-blacklist" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>IP黑名单配置</h3>
          <button class="btn btn-primary" onclick="loadIPBlacklistConfig()">刷新配置</button>
        </div>
        <div id="ipBlacklistConfigForm" style="display:none;padding:16px;background:#f9f9fb;border-radius:8px;">
          <h4 style="margin-bottom:16px;">订阅地址（/sub）限制</h4>
          <div class="form-row" style="margin-bottom:16px;">
            <div class="form-group">
              <label>每分钟最大请求</label>
              <input type="number" id="subRateMin" min="1" value="1">
            </div>
            <div class="form-group">
              <label>每小时最大请求</label>
              <input type="number" id="subRateHour" min="1" value="60">
            </div>
            <div class="form-group">
              <label>每天最大请求</label>
              <input type="number" id="subRateDay" min="1" value="500">
            </div>
          </div>

          <h4 style="margin-bottom:16px;">播放地址（/live）限制</h4>
          <div class="form-row" style="margin-bottom:16px;">
            <div class="form-group">
              <label>每分钟最大请求</label>
              <input type="number" id="liveRateMin" min="1" value="5">
            </div>
            <div class="form-group">
              <label>每小时最大请求</label>
              <input type="number" id="liveRateHour" min="1" value="300">
            </div>
            <div class="form-group">
              <label>每天最大请求</label>
              <input type="number" id="liveRateDay" min="1" value="2000">
            </div>
          </div>

          <h4 style="margin-bottom:16px;">管理地址（/admin）限制</h4>
          <div class="form-row" style="margin-bottom:16px;">
            <div class="form-group">
              <label>每小时最大请求</label>
              <input type="number" id="adminRateHour" min="1" value="10">
            </div>
          </div>

          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="saveIPBlacklistConfig()">保存配置</button>
            <button class="btn" onclick="resetIPBlacklistConfig()">重置为默认</button>
          </div>
        </div>
        <div id="noIPBlacklistConfig" class="empty-state">点击"刷新配置"按钮加载当前配置</div>
      </div>
      <div class="card">
        <div class="toolbar">
          <h3>IP黑名单管理</h3>
          <button class="btn btn-primary" onclick="loadIPBlacklist()">刷新列表</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>IP地址</th>
              <th>封禁时间</th>
              <th>封禁原因</th>
              <th>详情</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="ipBlacklistTable"></tbody>
        </table>
        <div id="noIPBlacklist" class="empty-state">暂无封禁IP</div>
      </div>
      <div class="card">
        <h3>手动封禁IP</h3>
        <div class="form-group">
          <label>IP地址</label>
          <input type="text" id="manualBanIP" placeholder="输入要封禁的IP地址">
        </div>
        <div class="form-group">
          <label>封禁原因</label>
          <input type="text" id="manualBanReason" placeholder="输入封禁原因">
        </div>
        <button class="btn btn-danger" onclick="manualBanIP()">封禁</button>
      </div>
      <div class="card">
        <h3>封禁说明</h3>
        <div style="line-height:1.8;color:#86868b;font-size:14px;">
          <p><strong>🔒 自动封禁规则[限制攻击者撞库]：</strong></p>
          <ul style="margin-left:20px;margin-bottom:16px;">
            <li>订阅地址（/sub）：根据配置限制请求频率</li>
            <li>播放地址（/live）：根据配置限制请求频率</li>
            <li>管理地址（/admin）：根据配置限制请求频率</li>
            <li>超出限制会永久封禁该IP</li>
          </ul>
          <p><strong>⚠️ 防撞库保护：</strong></p>
          <p>防止攻击者通过大量尝试订阅地址来破解有效卡密</p>
          <p style="margin-bottom:16px;">超出访问频率会自动封禁IP，保护系统安全</p>
          <p><strong>✅ 管理员操作：</strong></p>
          <p>可以在上方配置调整限制阈值，手动封禁可疑IP或解封误封的IP</p>
        </div>
      </div>
    </div>
    <div id="domain-blacklist" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>域名黑名单</h3>
          <button class="btn btn-primary" onclick="loadDomainBlacklist()">刷新列表</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>域名</th>
              <th>添加时间</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="domainBlacklistTable"></tbody>
        </table>
        <div id="noDomainBlacklist" class="empty-state">暂无黑名单域名</div>
      </div>
      <div class="card">
        <h3>添加域名到黑名单</h3>
        <div class="form-group">
          <label>域名（支持单个或批量）</label>
          <textarea id="domainBlacklistInput" rows="5" placeholder="输入域名，每行一个&#10;例如：&#10;example.com&#10;*.example.com"></textarea>
        </div>
        <div class="form-group">
          <label>备注（可选）</label>
          <input type="text" id="domainBlacklistReason" placeholder="输入备注原因">
        </div>
        <button class="btn btn-danger" onclick="addDomainToBlacklist()">添加到黑名单</button>
      </div>
      <div class="card">
        <h3>黑名单说明</h3>
        <div style="line-height:1.8;color:#86868b;font-size:14px;">
          <p><strong>🚫 域名黑名单功能说明：</strong></p>
          <ul style="margin-left:20px;margin-bottom:16px;">
            <li>黑名单中的域名将不会被代理，直接透传原始播放地址给用户</li>
            <li>适用于禁止Cloudflare访问的直播源</li>
            <li>支持完全匹配域名（如：example.com）和子域名匹配（如：*.example.com）</li>
          </ul>
          <p><strong>📝 域名格式：</strong></p>
          <ul style="margin-left:20px;margin-bottom:16px;">
            <li>完全匹配：example.com（只匹配example.com）</li>
            <li>子域名匹配：*.example.com（匹配所有example.com的子域名）</li>
            <li>支持批量添加，每行一个域名</li>
          </ul>
          <p><strong>💡 使用场景：</strong></p>
          <ul style="margin-left:20px;">
            <li>直播源域名拒绝Cloudflare IP访问</li>
            <li>直播源需要直接从客户端播放</li>
            <li>避免因代理导致的播放失败</li>
          </ul>
        </div>
      </div>
    </div>
    <div id="homepage-display" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>首页展示配置</h3>
          <button class="btn btn-primary" onclick="saveHomepageDisplayConfig()">保存配置</button>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            配置首页展示哪些数据源、分类、host或请求头。留空表示展示全部数据。
          </p>
          <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:12px;border-radius:4px;">
            <strong style="color:#e65100;">注意：</strong>
            <ul style="margin:8px 0 0 20px;color:#666;">
              <li>数据源、分类、host、请求头四个条件是"或(OR)"关系，只要满足任一条件就会展示</li>
              <li>例如：选择了数据源1和分类A，那么数据源1的所有频道和分类A的所有频道都会展示</li>
              <li>"只显示有请求头"：只展示配置了 User-Agent、Referer 等请求头的频道</li>
              <li>"只显示无请求头"：只展示未配置请求头的频道</li>
              <li>域名部分会自动显示系统识别的域名，也支持手动输入域名</li>
              <li>手动添加的域名可以点击"删除"按钮移除</li>
              <li>清空所有选项后会展示所有频道数据</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">数据源</h4>
          <div id="sourceCheckboxes" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
            <div style="color:#86868b;">加载中...</div>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">分类</h4>
          <div id="groupCheckboxes" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
            <div style="color:#86868b;">加载中...</div>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">Host（域名）</h4>
          <div style="margin-bottom:12px;display:flex;gap:8px;">
            <input type="text" id="manualHostInput" placeholder="输入域名，例如：example.com" style="flex:1;padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;">
            <button class="btn btn-primary" onclick="addManualHost()">添加域名</button>
          </div>
          <div id="hostCheckboxes" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
            <div style="color:#86868b;">加载中...</div>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">是否含有请求头</h4>
          <div style="display:flex;gap:16px;align-items:center;">
            <label style="display:flex;align-items:center;padding:10px 20px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="radio" name="hasHeaders" value="null" checked onchange="updateHomepageConfig('hasHeaders', null)" style="margin-right:8px;">
              <span style="font-size:14px;">全部</span>
            </label>
            <label style="display:flex;align-items:center;padding:10px 20px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="radio" name="hasHeaders" value="true" onchange="updateHomepageConfig('hasHeaders', true)" style="margin-right:8px;">
              <span style="font-size:14px;">只显示有请求头</span>
            </label>
            <label style="display:flex;align-items:center;padding:10px 20px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="radio" name="hasHeaders" value="false" onchange="updateHomepageConfig('hasHeaders', false)" style="margin-right:8px;">
              <span style="font-size:14px;">只显示无请求头</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div id="ad-management" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>广告TS文件管理</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="showUploadAdModal()">上传广告</button>
            <button class="btn" onclick="loadAdTsFiles()">刷新列表</button>
          </div>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            上传广告TS文件，在不同播放场景下播放广告内容。支持上传.ts格式的视频文件。
          </p>
          <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:12px;border-radius:4px;">
            <strong style="color:#e65100;">注意事项：</strong>
            <ul style="margin:8px 0 0 20px;color:#666;">
              <li>广告文件以Base64格式存储在数据库中，建议文件大小不超过1MB</li>
              <li>支持不同类型的广告（普通广告、通知类广告等）</li>
              <li>广告时长建议控制在10秒以内</li>
              <li>在广告绑定管理中，可以为不同播放场景绑定特定的广告</li>
              <li>广告绑定中可以设置冷却时间和优先级</li>
            </ul>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>类型</th>
              <th>描述</th>
              <th>大小</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="adTsTable"></tbody>
        </table>
      </div>
      <div class="card">
        <div class="toolbar">
          <h3>广告绑定配置</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="showAdBindingModal()">添加绑定</button>
            <button class="btn" onclick="loadAdBindings()">刷新列表</button>
          </div>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            配置不同场景下播放的广告。支持绑定指定广告或随机播放，并可设置冷却时间。
          </p>
          <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:12px;border-radius:4px;">
            <strong style="color:#e65100;">操作类型说明：</strong>
            <ul style="margin:8px 0 0 20px;color:#666;">
              <li><strong>卡密正常播放</strong>：用户使用有效卡密正常播放时触发</li>
              <li><strong>卡密过期播放</strong>：用户卡密已过期，尝试播放时触发</li>
              <li><strong>卡密IP未授权</strong>：用户IP不在卡密允许范围内时触发</li>
              <li><strong>免费订阅正常播放</strong>：免费订阅用户正常播放时触发</li>
              <li><strong>免费订阅过期播放</strong>：免费订阅已过期，尝试播放时触发</li>
              <li><strong>复制链接正常播放</strong>：用户复制直连播放链接后正常播放时触发</li>
              <li><strong>复制链接超出IP播放</strong>：复制链接达到IP数量上限时触发</li>
            </ul>
            <strong style="color:#e65100;">冷却时间：</strong>
            <p style="margin:8px 0;color:#666;">设置冷却时间后，同一IP在指定时间内不会重复看到同一类型的广告。设置为0表示不限制。</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>操作类型</th>
              <th>绑定广告</th>
              <th>冷却时间</th>
              <th>优先级</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="adBindingTable"></tbody>
        </table>
      </div>
    </div>
    <div id="users" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>账户管理</h3>
          <div style="display:flex;gap:8px;">
            <input type="text" id="userSearch" placeholder="搜索邮箱..." style="padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;" oninput="handleUserSearch()">
          </div>
        </div>
        <div id="usersList" style="margin-top:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f5f5f7;text-align:left;">
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">ID</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">邮箱</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">邮箱验证</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">注册时间</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">操作</th>
              </tr>
            </thead>
            <tbody id="usersTableBody"></tbody>
          </table>
          <div id="usersPagination" style="margin-top:20px;display:flex;justify-content:center;gap:8px;"></div>
        </div>
      </div>
    </div>
    <div id="orders" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>订单管理</h3>
          <div style="display:flex;gap:8px;">
            <input type="text" id="orderUserFilter" placeholder="筛选用户邮箱..." style="padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;" oninput="filterOrders()">
          </div>
        </div>
        <div id="ordersList" style="margin-top:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f5f5f7;text-align:left;">
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">订单ID</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">用户邮箱</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">卡密</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">订阅地址</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">有效期</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">金额</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">状态</th>
                <th style="padding:12px;border-bottom:2px solid #e5e5ea;font-weight:600;">创建时间</th>
              </tr>
            </thead>
            <tbody id="ordersTableBody"></tbody>
          </table>
          <div id="ordersPagination" style="margin-top:20px;display:flex;justify-content:center;gap:8px;"></div>
        </div>
      </div>
    </div>
    <div id="mall" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>商城设置</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="saveMallSettings()">保存设置</button>
            <button class="btn" onclick="loadMallSettings()">刷新设置</button>
          </div>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            配置商城功能开关。关闭商城后，订阅页面的会员订阅模块将不会显示。关闭订阅功能后，用户无法进行付费订阅。
          </p>

          <div class="form-group" style="margin-bottom:20px;">
            <label>商城开关</label>
            <div style="display:flex;align-items:center;gap:12px;padding:16px;background:white;border:1px solid #e5e5ea;border-radius:8px;">
              <input type="checkbox" id="mallEnabled" checked style="width:20px;height:20px;cursor:pointer;">
              <div>
                <div style="font-weight:600;font-size:15px;color:#1d1d1f;">启用商城</div>
                <div style="color:#86868b;font-size:13px;margin-top:2px;">关闭后，订阅页面的会员订阅模块将隐藏</div>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:20px;">
            <label>订阅功能开关</label>
            <div style="display:flex;align-items:center;gap:12px;padding:16px;background:white;border:1px solid #e5e5ea;border-radius:8px;">
              <input type="checkbox" id="subscriptionEnabled" checked style="width:20px;height:20px;cursor:pointer;">
              <div>
                <div style="font-weight:600;font-size:15px;color:#1d1d1f;">启用订阅功能</div>
                <div style="color:#86868b;font-size:13px;margin-top:2px;">关闭后，用户无法进行付费订阅</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="toolbar">
          <h3>订阅套餐管理</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="showPlanModal()">添加套餐</button>
            <button class="btn" onclick="loadPlans()">刷新</button>
          </div>
        </div>
        <div style="padding:16px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            管理订阅套餐的价格和配置。修改后即时生效，订阅页面会自动更新显示。
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>时长</th>
              <th>基础价格</th>
              <th>IP单价</th>
              <th>折扣</th>
              <th>排序</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="plansTableBody"></tbody>
        </table>
      </div>

      <div class="card">
        <div class="toolbar">
          <h3>支付接口管理</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="showPaymentMethodModal()">添加支付方式</button>
          </div>
        </div>
        <div style="padding:16px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            管理支付接口。关闭某个支付方式后，订阅页面对应的支付选项将隐藏。
          </p>

          <div id="paymentMethodsList"></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>类型</th>
              <th>状态</th>
              <th>配置</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="paymentMethodsTableBody"></tbody>
        </table>
      </div>
    </div>
    <div id="system-settings" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>公告管理</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="saveAnnouncement()">保存公告</button>
            <button class="btn" onclick="loadAnnouncement()">刷新公告</button>
          </div>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            发布系统公告，公告将显示在首页顶部。支持选择预设模板快速编辑。
          </p>

          <div class="form-group" style="margin-bottom:16px;">
            <label>公告状态</label>
            <label style="display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="checkbox" id="announcementEnabled" checked style="margin-right:12px;">
              <span style="font-size:14px;">启用公告</span>
            </label>
          </div>

          <div class="form-group" style="margin-bottom:16px;">
            <label>弹出频率</label>
            <select class="filter-select" id="announcementFrequency" style="width:100%;">
              <option value="once">仅一次（关闭后不再显示）</option>
              <option value="daily">每天一次</option>
              <option value="weekly">每周一次</option>
              <option value="always">每次都显示</option>
            </select>
            <p style="margin-top:8px;color:#86868b;font-size:12px;">选择公告的显示频率。设置为"仅一次"时，用户关闭后不会再看到该公告。</p>
          </div>

          <div class="form-group" style="margin-bottom:16px;">
            <label>快速模板</label>
            <select class="filter-select" id="announcementTemplate" onchange="applyAnnouncementTemplate()" style="width:100%;">
              <option value="">-- 选择模板 --</option>
              <option value="update">系统更新通知</option>
              <option value="maintenance">维护通知</option>
              <option value="feature">新功能上线</option>
              <option value="notice">重要提示</option>
              <option value="custom">自定义内容</option>
            </select>
          </div>

          <div class="form-group">
            <label>公告标题</label>
            <input type="text" id="announcementTitleInput" placeholder="输入公告标题" style="width:100%;">
          </div>

          <div class="form-group">
            <label>公告内容（支持HTML）</label>
            <textarea id="announcementContentInput" rows="6" placeholder="输入公告内容" style="font-family:monospace;font-size:13px;"></textarea>
            <p style="margin-top:8px;color:#86868b;font-size:12px;">支持HTML标签，如 &lt;p&gt;、&lt;br&gt;、&lt;strong&gt; 等</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="toolbar">
          <h3>缓存管理</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="refreshCache()">刷新缓存</button>
            <button class="btn btn-danger" onclick="clearCache()">清空缓存</button>
            <button class="btn" onclick="loadCacheStatus()">刷新状态</button>
          </div>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            频道数据会自动缓存到 KV 存储中，提高首页加载速度和减少数据库查询。缓存会在源数据同步后自动更新，也可以手动刷新。
          </p>
          <div id="cacheStatusInfo" style="padding:12px;background:white;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;">
            <div style="color:#86868b;">加载中...</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="toolbar">
          <h3>会员设置</h3>
          <button class="btn btn-primary" onclick="saveSystemConfig()">保存配置</button>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <div style="margin-bottom:24px;">
            <div style="margin-bottom:16px;">
              <label style="display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
                <input type="checkbox" id="enableMemberAdFree" checked style="margin-right:12px;">
                <span style="font-size:14px;">启用会员网站免广告</span>
              </label>
              <p style="margin-top:8px;color:#86868b;font-size:12px;">启用后，会员用户访问网站时将隐藏页面广告</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="loadingOverlay" class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
  <div id="syncIndicator" class="sync-indicator">
    <div class="sync-spinner"></div>
    <span id="syncText">正在同步中...</span>
  </div>
  <div id="sourceModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3 id="sourceModalTitle">添加源</h3><button class="close-btn" onclick="closeSourceModal()">&times;</button></div>
      <div class="form-group"><label>源名称</label><input type="text" id="sourceName" placeholder="输入源名称"></div>
      <div class="form-group"><label>M3U URL</label><input type="text" id="sourceUrl" placeholder="输入M3U文件URL"></div>
      <div class="form-row"><div class="form-group"><label>类型</label><select id="sourceType"><option value="m3u">M3U</option><option value="m3u8">M3U8</option></select></div><div class="form-group"><label>解析模式</label><select id="sourceParseMode"><option value="strict">严格</option><option value="loose">宽松</option></select></div></div>
      <div class="modal-footer"><button class="btn" onclick="closeSourceModal()">取消</button><button class="btn btn-primary" onclick="saveSource()">保存</button></div>
    </div>
  </div>
  <div id="generateCodeModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3>生成卡密</h3><button class="close-btn" onclick="closeGenerateCodeModal()">&times;</button></div>
      <div class="form-row"><div class="form-group"><label>生成数量</label><input type="number" id="generateCount" value="1" min="1" max="100"></div><div class="form-group">
        <label>有效期(天)</label>
        <select id="generateDuration" onchange="togglePermanentCode()">
          <option value="30">30天</option>
          <option value="60">60天</option>
          <option value="90">90天</option>
          <option value="180">180天</option>
          <option value="365">365天</option>
          <option value="custom">自定义</option>
          <option value="-1">永久</option>
        </select>
        <input type="number" id="generateDurationCustom" value="7" min="1" max="3650" placeholder="自定义天数" style="display:none;width:100%;margin-top:8px;">
      </div></div>
      <div class="form-row"><div class="form-group"><label>最大IP数</label><input type="number" id="generateMaxIps" value="3" min="1"></div><div class="form-group"><label>备注</label><input type="text" id="generateRemark" placeholder="可选备注"></div></div>
      <div class="modal-footer"><button class="btn" onclick="closeGenerateCodeModal()">取消</button><button class="btn btn-primary" onclick="generateCodes()">生成</button></div>
    </div>
  </div>
  <div id="codeResultModal" class="modal">
    <div class="modal-content" style="max-width:600px">
      <div class="modal-header"><h3>生成的卡密</h3><button class="close-btn" onclick="closeCodeResultModal()">&times;</button></div>
      <div id="generatedCodesList" class="generated-codes"></div>
      <div class="modal-footer"><button class="btn" onclick="closeCodeResultModal()">关闭</button></div>
    </div>
  </div>
  <div id="codeEditModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3>编辑卡密</h3><button class="close-btn" onclick="closeCodeEditModal()">&times;</button></div>
      <div class="form-group"><label>卡密</label><input type="text" id="editCode" disabled></div>
      <div class="form-group"><label>状态</label><select id="editStatus"><option value="unused">未使用</option><option value="active">活跃</option><option value="disabled">禁用</option></select></div>
      <div class="form-group"><label>备注</label><input type="text" id="editRemark" placeholder="备注信息"></div>
      <div class="modal-footer"><button class="btn" onclick="closeCodeEditModal()">取消</button><button class="btn btn-primary" onclick="saveCodeEdit()">保存</button></div>
    </div>
  </div>
  <div id="importCodeModal" class="modal">
    <div class="modal-content" style="max-width:800px">
      <div class="modal-header"><h3>批量导入卡密</h3><button class="close-btn" onclick="closeImportCodeModal()">&times;</button></div>
      <div style="margin-bottom:16px;padding:12px;background:#e3f2fd;border-left:4px solid #2196f3;border-radius:4px;font-size:13px;color:#1976d2;line-height:1.6;">
        <p style="margin:0;font-weight:600;">CSV文件格式要求：</p>
        <ul style="margin:8px 0 0 20px;">
          <li>第一行为表头：卡密,有效期,激活时间,过期时间,备注</li>
          <li>激活时间和过期时间为可选字段，可留空</li>
          <li>日期格式：北京时间格式（YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DD）</li>
          <li>示例：ABC12345,30,2024-01-01 10:00:00,2024-02-01 10:00:00,VIP卡密</li>
          <li><strong>永久卡密：</strong>有效期字段设为 -1，过期时间字段留空</li>
          <li>永久卡密示例：PERM12345,-1,,,永久VIP</li>
        </ul>
      </div>
      <div class="form-group"><label>选择CSV文件</label><input type="file" id="importFile" accept=".csv" onchange="handleImportFileSelect()"></div>
      <div class="form-group" id="fileInfo" style="display:none;padding:8px;background:#f5f5f7;border-radius:4px;font-size:13px;"><span id="fileName"></span></div>
      <div class="form-group">
        <label>导入选项</label>
        <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <input type="checkbox" id="skipDuplicates" checked style="width:auto;">
          <span style="font-size:14px;">跳过已存在的卡密</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="updateExisting" style="width:auto;">
          <span style="font-size:14px;">更新已存在的卡密数据</span>
        </label>
      </div>
      <div class="modal-footer"><button class="btn" onclick="closeImportCodeModal()">取消</button><button class="btn btn-primary" onclick="importCodesFromCSV()">开始导入</button></div>
    </div>
  </div>
  <div id="planModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3 id="planModalTitle">添加订阅套餐</h3><button class="close-btn" onclick="closePlanModal()">&times;</button></div>
      <input type="hidden" id="planId" value="">
      <div class="form-row">
        <div class="form-group">
          <label>套餐名称（中文）</label>
          <input type="text" id="planName" placeholder="例如：1个月" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
        </div>
        <div class="form-group">
          <label>套餐名称（英文）</label>
          <input type="text" id="planNameEn" placeholder="例如：1 Month" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>时长（天）</label>
          <input type="number" id="planDays" placeholder="30" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <small style="color:#86868b;">输入 -1 表示永久套餐</small>
        </div>
        <div class="form-group">
          <label>基础价格（元）</label>
          <input type="number" id="planBasePrice" min="0" step="0.01" placeholder="29" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>IP单价（元/个）</label>
          <input type="number" id="planPricePerIP" min="0" step="0.01" placeholder="9" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
        </div>
        <div class="form-group">
          <label>折扣（%）</label>
          <input type="number" id="planDiscount" min="0" max="100" placeholder="0" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>排序（数字越小越靠前）</label>
          <input type="number" id="planSortOrder" min="0" placeholder="1" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
        </div>
        <div class="form-group">
          <label>状态</label>
          <label style="display:flex;align-items:center;gap:8px;padding:12px;background:white;border:1px solid #d2d2d7;border-radius:6px;cursor:pointer;">
            <input type="checkbox" id="planEnabled" checked style="width:auto;">
            <span>启用</span>
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closePlanModal()">取消</button>
        <button class="btn btn-primary" onclick="savePlan()">保存</button>
      </div>
    </div>
  </div>
  <div id="paymentMethodModal" class="modal">
    <div class="modal-content" style="max-width:600px;">
      <div class="modal-header">
        <h3 id="paymentMethodModalTitle">添加支付方式</h3>
        <button class="close-btn" onclick="closePaymentMethodModal()">&times;</button>
      </div>
      <input type="hidden" id="paymentMethodId" value="">
      
      <div class="form-group">
        <label>支付类型</label>
        <select id="paymentType" class="form-control" onchange="updatePaymentConfigFields()" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <option value="alipay">支付宝（虎皮椒）</option>
          <option value="wechat">微信支付（虎皮椒）</option>
          <option value="paypal">PayPal</option>
          <option value="coinbase">Coinbase Commerce</option>
          <option value="usdt">USDT（Tether）</option>
          <option value="usdc">USDC（USD Coin）</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>名称</label>
        <input type="text" id="paymentName" value="" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
        <small style="color:#86868b;font-size:12px;">显示在订阅页面的名称</small>
      </div>
      
      <div class="form-group">
        <label>状态</label>
        <label style="display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="paymentEnabled" checked style="width:auto;">
          <span>启用此支付方式</span>
        </label>
      </div>
      
      <!-- 虎皮椒配置 -->
      <div id="xunhuConfigSection" class="config-section">
        <div class="form-group">
          <label style="color:#0071e3;font-weight:600;">虎皮椒配置</label>
          <p style="margin:8px 0;color:#86868b;font-size:13px;">适用于支付宝和微信支付配置</p>
        </div>
        <div class="form-group">
          <label>商户ID (App ID)</label>
          <input type="text" id="appId" value="" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <small style="color:#86868b;font-size:12px;">虎皮椒商户ID</small>
        </div>
        <div class="form-group">
          <label>商户密钥 (App Secret)</label>
          <input type="password" id="appSecret" value="" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <small style="color:#86868b;font-size:12px;">虎皮椒商户密钥</small>
        </div>
        <div class="form-group">
          <label>支付网关地址</label>
          <input type="text" id="gatewayUrl" value="" placeholder="https://api.xunhuweb.com/payment/do.html" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <small style="color:#86868b;font-size:12px;">留空则使用虎皮椒官方网关</small>
        </div>
      </div>
      
      <!-- PayPal 配置 -->
      <div id="paypalConfigSection" class="config-section" style="display:none;">
        <div class="form-group">
          <label style="color:#003087;font-weight:600;">PayPal 配置</label>
          <p style="margin:8px 0;color:#86868b;font-size:12px;">配置 PayPal 客户端 ID 和密钥</p>
        </div>
        <div class="form-group">
          <label>客户端 ID (Client ID)</label>
          <input type="text" id="paypalClientId" value="" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <small style="color:#86868b;font-size:12px;">PayPal 开发者账户获取的 Client ID</small>
        </div>
        <div class="form-group">
          <label>客户端密钥 (Client Secret)</label>
          <input type="password" id="paypalClientSecret" value="" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <small style="color:#86868b;font-size:12px;">PayPal 开发者账户获取的 Client Secret</small>
        </div>
        <div class="form-group">
          <label>运行模式</label>
          <select id="paypalMode" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
            <option value="sandbox">沙盒测试</option>
            <option value="live">生产环境</option>
          </select>
          <small style="color:#86868b;font-size:12px;">沙盒模式用于测试，生产模式用于实际收款</small>
        </div>
      </div>
      
      <!-- Coinbase Commerce 配置 -->
      <div id="coinbaseConfigSection" class="config-section" style="display:none;">
        <div class="form-group">
          <label style="color:#0052FF;font-weight:600;">Coinbase Commerce 配置</label>
          <p style="margin:8px 0;color:#86868b;font-size:12px;">支持 10+ 种加密货币自动转换为 USDC</p>
        </div>
        <div class="form-group">
          <label>API Key</label>
          <input type="text" id="coinbaseApiKey" value="" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <small style="color:#86868b;font-size:12px;">从 https://commerce.coinbase.com/dashboard/settings 获取</small>
        </div>
        <div class="form-group">
          <label>Webhook Secret</label>
          <input type="password" id="coinbaseWebhookSecret" value="" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <small style="color:#86868b;font-size:12px;">用于验证支付回调的签名密钥</small>
        </div>
        <div class="form-group">
          <label>自动转换目标</label>
          <select id="coinbaseAutoConvert" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
            <option value="usdc">USDC (稳定币)</option>
            <option value="btc">BTC (比特币)</option>
            <option value="eth">ETH (以太坊)</option>
          </select>
          <small style="color:#86868b;font-size:12px;">推荐选择 USDC，避免币价波动影响收入</small>
        </div>
        <div style="margin-top:12px;padding:10px;background:#e8f4fd;border-left:4px solid:#0071e3;border-radius:4px;">
          <p style="font-size:12px;color:#1976d2;margin:0;">
            📌 <strong>Webhook 配置：</strong>在 Coinbase 后台设置 <code>https://your-worker.workers.dev/api/subscription/crypto/webhook</code>
          </p>
        </div>
      </div>
      
      <!-- USDT/USDC 配置 -->
      <div id="cryptoConfigSection" class="config-section" style="display:none;">
        <div class="form-group">
          <label style="color:#26A17B;font-weight:600;" id="cryptoConfigLabel">USDT 配置</label>
          <p style="margin:8px 0;color:#86868b;font-size:12px;" id="cryptoConfigDesc">配置 TRC20/ERC20 USDT 钱包地址</p>
        </div>
        <div class="form-group">
          <label>网络类型</label>
          <select id="cryptoNetwork" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
            <option value="trc20">TRC20 (波场 - 费用低 ¥1-2)</option>
            <option value="eth">ETH (以太坊 - 费用高 ¥30-100)</option>
          </select>
          <small style="color:#86868b;font-size:12px;">TRC20 费用更低，推荐使用</small>
        </div>
        <div class="form-group">
          <label>钱包地址</label>
          <input type="text" id="cryptoWalletAddress" value="" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;">
          <small style="color:#86868b;font-size:12px;">你的 USDT/USDC 钱包地址，用户支付到这个地址</small>
        </div>
        <div style="margin-top:12px;padding:10px;background:#fff3e0;border-left:4px solid:#ff9800;border-radius:4px;">
          <p style="font-size:12px;color:#e65100;margin:0;">
            ⚠️ <strong>注意：</strong>此支付方式需要管理员在后台手动确认支付，用户支付后不会自动生成卡密
          </p>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn" onclick="closePaymentMethodModal()">取消</button>
        <button class="btn btn-primary" onclick="savePaymentMethod()">保存</button>
      </div>
    </div>
  </div>
  <script>
    const API_BASE='/admin';
    const STORAGE_KEY = 'admin_auth_key';
    const SYNC_KEY = 'admin_sync_status';
    let adminKey = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    let captchaCode = 'TEST';  // Fixed captcha for testing
    let currentChannelPage = 1;
    let totalChannelPages = 1;
    let totalChannels = 0;
    let currentCodePage = 1;
    let totalCodePages = 1;
    let totalCodes = 0;

    // Loading控制
    function showLoading() {
      document.getElementById('loadingOverlay').classList.add('active');
    }

    function hideLoading() {
      document.getElementById('loadingOverlay').classList.remove('active');
    }

    // 同步状态管理
    function setSyncStatus(status) {
      localStorage.setItem(SYNC_KEY, JSON.stringify({
        status,
        timestamp: Date.now()
      }));
      updateSyncIndicator();
    }

    function getSyncStatus() {
      const data = localStorage.getItem(SYNC_KEY);
      if (!data) return null;
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }

    function clearSyncStatus() {
      localStorage.removeItem(SYNC_KEY);
      updateSyncIndicator();
    }

    function updateSyncIndicator() {
      const syncStatus = getSyncStatus();
      const indicator = document.getElementById('syncIndicator');
      if (syncStatus && syncStatus.status === 'syncing') {
        const elapsed = Math.floor((Date.now() - syncStatus.timestamp) / 1000);
        document.getElementById('syncText').textContent = '正在同步中... (' + elapsed + '秒)';
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    }

    // 定期更新同步状态显示
    setInterval(updateSyncIndicator, 1000);

    // 页面加载时自动检查登录状态
    if (adminKey) {
      autoLogin();
    } else {
      document.getElementById('loginOverlay').classList.remove('hidden');
      refreshCaptcha();
    }

    // 页面加载时更新同步指示器
    updateSyncIndicator();

    function autoLogin() {
      fetch(API_BASE + '/init', {
        method: 'GET',
        headers: { 'X-Admin-Key': adminKey }
      })
      .then(res => {
        if (res.ok) {
          document.getElementById('mainContent').style.display = 'block';
          loadSources();
        } else {
          clearAuth();
          document.getElementById('loginOverlay').classList.remove('hidden');
        }
      })
      .catch(() => {
        // 静默失败，让用户手动登录
        document.getElementById('loginOverlay').classList.remove('hidden');
      });
    }

    function login() {
      const key = document.getElementById('adminKey').value;
      const captchaInput = document.getElementById('captchaInput').value;

      if (!key) {
        showLoginError('请输入管理员密钥');
        return;
      }

      if (!captchaInput) {
        showLoginError('请输入验证码');
        return;
      }

      if (captchaInput !== captchaCode) {
        showLoginError('验证码错误');
        refreshCaptcha();
        return;
      }

      adminKey = key;
      // 同时保存到 localStorage 和 sessionStorage
      localStorage.setItem(STORAGE_KEY, key);
      sessionStorage.setItem(STORAGE_KEY, key);
      fetch(API_BASE + '/init', {
        method: 'GET',
        headers: { 'X-Admin-Key': adminKey }
      })
      .then(res => {
        if (res.ok) {
          document.getElementById('loginOverlay').classList.add('hidden');
          document.getElementById('mainContent').style.display = 'block';
          loadSources();
        } else {
          showLoginError('密钥无效');
          clearAuth();
          refreshCaptcha();
        }
      })
      .catch(() => {
        showLoginError('登录失败，请重试');
        clearAuth();
        refreshCaptcha();
      });
    }

    function refreshCaptcha() {
      // Fixed captcha for testing - always set to 'TEST'
      captchaCode = 'TEST';
      
      const canvas = document.getElementById('captchaCanvas');
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#f5f5f7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw fixed "TEST" text on canvas
      ctx.font = 'bold 28px Arial';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1a1a1a';
      ctx.fillText('TEST', 20, 22);

      ctx.font = 'bold 28px Arial';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < captchaCode.length; i++) {
        // 使用深色高对比度颜色
        const colors = [
          '#1a1a1a', '#2d3748', '#1a365d', '#742a2a', '#1c4532', '#553c9a', '#744210', '#285e61'
        ];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        const x = 20 + i * 22;
        const y = 22;
        // 极小的旋转角度，几乎不旋转
        const angle = (Math.random() - 0.5) * 0.05;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(captchaCode[i], 0, 0);
        ctx.restore();
      }

      // 添加 5 条干扰线
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      // 添加少量弯曲干扰线
      for (let i = 0; i < 2; i++) {
        ctx.strokeStyle = 'rgba(180, 180, 180, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.bezierCurveTo(
          Math.random() * canvas.width, Math.random() * canvas.height,
          Math.random() * canvas.width, Math.random() * canvas.height,
          Math.random() * canvas.width, Math.random() * canvas.height
        );
        ctx.stroke();
      }

      // 添加干扰点
      for (let i = 0; i < 15; i++) {
        ctx.fillStyle = 'rgba(180, 180, 180, 0.5)';
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      document.getElementById('captchaInput').value = '';
    }

    function showLoginError(msg) {
      const el = document.getElementById('loginError');
      el.textContent = msg;
      el.style.display = 'block';
    }

    function logout() {
      clearAuth();
      adminKey = null;
      document.getElementById('mainContent').style.display = 'none';
      document.getElementById('loginOverlay').classList.remove('hidden');
      document.getElementById('adminKey').value = '';
      document.getElementById('captchaInput').value = '';
      document.getElementById('loginError').style.display = 'none';
      refreshCaptcha();
    }

    function clearAuth() {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }

    function apiRequest(url, options = {}) {
      const showLoadingIndicator = options.showLoading !== false;
      delete options.showLoading;

      if (showLoadingIndicator) {
        showLoading();
      }

      options.headers = options.headers || {};
      options.headers['X-Admin-Key'] = adminKey;
      options.headers['Content-Type'] = 'application/json';

      return fetch(API_BASE + url, options).then(res => {
        if (showLoadingIndicator) {
          hideLoading();
        }
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        return res.json();
      }).catch(error => {
        if (showLoadingIndicator) {
          hideLoading();
        }
        throw error;
      });
    }

    function showTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      event.target.classList.add('active');
      if (tabName === 'sources') {
        loadSources();
        loadSyncFilters(); // 加载同步过滤规则
      }
      else if (tabName === 'channels') { loadSources(); loadChannels(); }
      else if (tabName === 'codes') loadCodes();
      else if (tabName === 'users') loadUsers();
      else if (tabName === 'orders') loadOrders();
      else if (tabName === 'mall') {
        loadMallSettings();
        loadPlans();
        loadPaymentMethods();
      }
      else if (tabName === 'tickets') {
        loadTickets();
      }
      else if (tabName === 'security') {
        loadSecurityConfig();
        document.getElementById('quotaInfo').style.display = 'none';
        document.getElementById('noQuotaData').style.display = 'block';
        loadBannedCodes(); // 加载封禁卡密列表
      }
      else if (tabName === 'ip-blacklist') {
        loadIPBlacklistConfig();
        loadIPBlacklist();
      }
      else if (tabName === 'domain-blacklist') {
        loadDomainBlacklist();
      }
      else if (tabName === 'homepage-display') loadHomepageDisplayConfig();
      else if (tabName === 'ad-management') {
        loadAdTsFiles();
        loadAdBindings();
      }
      else if (tabName === 'system-settings') {
        loadSystemConfig();
        loadAnnouncement(); // 加载公告
        loadCacheStatus(); // 加载缓存状态
      }
    }

    async function loadSources() {
      try {
        showLoading();
        // 加载之前保存的过滤规则
        loadSyncFilters();

        const sources = await apiRequest('/sources', { showLoading: false });
        const sourceList = sources.results || sources;
        const tbody = document.getElementById('sourcesTable');
        if (!sourceList || sourceList.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="empty-state">暂无直播源</td></tr>';
          return;
        }
        const sourcesWithCounts = await Promise.all(sourceList.map(async source => {
          try {
            const channels = await apiRequest('/channels?source_id=' + source.id + '&page=1&page_size=1', { showLoading: false });
            source.channelCount = channels.pagination?.total || 0;
          } catch (e) {
            source.channelCount = 0;
          }
          return source;
        }));
        tbody.innerHTML = sourcesWithCounts.map(source => \`
          <tr>
            <td>\${source.id}</td>
            <td>\${escapeHtml(source.name)}</td>
            <td><span class="badge badge-warning">\${escapeHtml(source.type)}</span></td>
            <td>\${escapeHtml(source.parse_mode)}</td>
            <td>
              <span class="badge \${source.is_active ? 'badge-success' : 'badge-danger'}">
                \${source.is_active ? '启用' : '禁用'}
              </span>
            </td>
            <td>\${source.channelCount}</td>
            <td>\${source.last_updated ? new Date(source.last_updated).toLocaleString('zh-CN', { timeZone: window.TIMEZONE || 'Asia/Shanghai' }) : '-'}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm \${source.is_active ? 'btn-danger' : 'btn-success'}" onclick="toggleSource(\${source.id}, \${!source.is_active})">
                  \${source.is_active ? '禁用' : '启用'}
                </button>
                <button class="btn btn-sm btn-primary" onclick="syncSource(\${source.id})">同步</button>
                <button class="btn btn-sm" onclick="editSource(\${source.id})">编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSource(\${source.id})">删除</button>
              </div>
            </td>
          </tr>
        \`).join('');
        const filterSelect = document.getElementById('channelSourceFilter');
        // 只显示已启用的源
        const enabledSources = sourceList.filter(s => s.is_active);
        filterSelect.innerHTML = '<option value="">全部源</option>' + enabledSources.map(s => \`<option value="\${s.id}">\${escapeHtml(s.name)}</option>\`).join('');

        // 加载所有分组并填充分组下拉框
        try {
          const groupsData = await apiRequest('/channels?action=get_groups', { showLoading: false });
          const groupFilter = document.getElementById('channelGroupFilter');
          const groups = groupsData.groups || [];
          groupFilter.innerHTML = '<option value="">全部分组</option>' + groups.map(g => \`<option value="\${escapeHtml(g)}">\${escapeHtml(g)}</option>\`).join('');
        } catch (e) {
          console.error('加载分组失败:', e);
        }
      } catch (error) {
        console.error('加载源失败:', error);
      } finally {
        hideLoading();
      }
    }

    function showSourceModal(source = null) {
      document.getElementById('sourceModalTitle').textContent = source ? '编辑源' : '添加源';
      document.getElementById('sourceName').value = source ? source.name : '';
      document.getElementById('sourceUrl').value = source ? source.url : '';
      document.getElementById('sourceType').value = source ? source.type : 'm3u';
      document.getElementById('sourceParseMode').value = source ? source.parse_mode : 'strict';
      document.getElementById('sourceModal').classList.add('active');
    }

    function closeSourceModal() {
      document.getElementById('sourceModal').classList.remove('active');
      document.getElementById('sourceModal').dataset.editId = '';
    }

    async function saveSource() {
      const name = document.getElementById('sourceName').value.trim();
      const url = document.getElementById('sourceUrl').value.trim();
      const type = document.getElementById('sourceType').value;
      const parseMode = document.getElementById('sourceParseMode').value;

      if (!name || !url) {
        showToast('请填写完整信息', 'error');
        return;
      }

      try {
        const editingSourceId = document.getElementById('sourceModal').dataset.editId;
        if (editingSourceId) {
          await apiRequest('/sources', {
            method: 'PUT',
            body: JSON.stringify({ id: parseInt(editingSourceId), name, url, type, parse_mode: parseMode })
          });
          showToast('源更新成功', 'success');
        } else {
          await apiRequest('/sources', {
            method: 'POST',
            body: JSON.stringify({ name, url, type, parse_mode: parseMode })
          });
          showToast('源添加成功', 'success');
        }
        closeSourceModal();
        loadSources();
      } catch (error) {
        showToast('保存失败: ' + error.error, 'error');
      }
    }

    function editSource(id) {
      apiRequest('/sources').then(data => {
        const sources = data.results || data;
        const source = sources.find(s => s.id === id);
        if (source) {
          document.getElementById('sourceModal').dataset.editId = id;
          showSourceModal(source);
        }
      });
    }

    async function deleteSource(id) {
      if (!confirm('确定要删除这个源吗？所有关联的频道也会被删除。')) return;
      try {
        const result = await apiRequest('/sources/' + id, { method: 'DELETE' });
        showToast(result.message || '源删除成功', 'success');
        loadSources();
      } catch (error) {
        showToast('删除失败: ' + error.error, 'error');
      }
    }

    async function toggleSource(id, isActive) {
      try {
        const result = await apiRequest('/sources/toggle/' + id, {
          method: 'PATCH',
          body: JSON.stringify({ is_active: isActive })
        });
        showToast(result.message || '操作成功', 'success');
        loadSources();
      } catch (error) {
        showToast('操作失败: ' + error.error, 'error');
      }
    }

    async function syncAllSources() {
      if (!confirm('确定要同步所有已启用的源吗？这将删除所有旧频道数据并重新获取。')) return;
      showLoading();
      showToast('开始同步所有源，这可能需要几分钟...', 'info');
      try {
        // 获取过滤规则（支持逗号和换行符分隔）
        const excludeGroups = document.getElementById('syncExcludeGroups').value
          .split(new RegExp('[\\n,]+'))
          .map(s => s.trim())
          .filter(s => s.length > 0);
        const excludeUrls = document.getElementById('syncExcludeUrls').value
          .split(new RegExp('[\\n,]+'))
          .map(s => s.trim())
          .filter(s => s.length > 0);
        const excludeNames = document.getElementById('syncExcludeNames').value
          .split(new RegExp('[\\n,]+'))
          .map(s => s.trim())
          .filter(s => s.length > 0);

        const filter = {
          excludeGroups,
          excludeUrls,
          excludeNames
        };

        console.log('Sync filter:', filter); // 调试日志

        const result = await apiRequest('/sync/all', {
          method: 'POST',
          body: JSON.stringify(filter)
        });
        if (result.success) {
          const summary = \`同步完成：\${result.success_count}个成功，\${result.fail_count}个失败\`;
          showToast(summary, result.fail_count > 0 ? 'error' : 'success');
          // 显示详细结果
          if (result.results && result.results.length > 0) {
            const details = result.results.map(r => {
              const status = r.success ? '✓' : '✗';
              return \`\${status} \${r.source_name}: \${r.success ? r.new_channels + '个频道' : r.error}\`;
            }).join('\\n');
            alert(summary + '\\n\\n详细结果:\\n' + details);
          }
          loadSources();
        } else {
          showToast('同步失败: ' + result.error, 'error');
        }
      } catch (error) {
        showToast('同步失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }


    function toggleSyncFilter() {
      const panel = document.getElementById('syncFilterPanel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function clearSyncFilters() {
      document.getElementById('syncExcludeGroups').value = '';
      document.getElementById('syncExcludeUrls').value = '';
      document.getElementById('syncExcludeNames').value = '';
      document.getElementById('excludeDuplicateUrls').checked = false;
      document.getElementById('groupRenameRules').value = '';
      document.getElementById('groupRenameExclude').value = '';
      showToast('已清空同步过滤规则', 'success');
    }

    async function saveSyncFilters() {
      // 获取过滤规则（支持逗号和换行符分隔）
      const excludeGroups = document.getElementById('syncExcludeGroups').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const excludeUrls = document.getElementById('syncExcludeUrls').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const excludeNames = document.getElementById('syncExcludeNames').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // 解析分组重命名规则
      const groupRenameRules = document.getElementById('groupRenameRules').value
        .split(new RegExp('[\\n]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(rule => {
          const parts = rule.split('->');
          if (parts.length === 2) {
            return {
              keyword: parts[0].trim(),
              newName: parts[1].trim()
            };
          }
          return null;
        })
        .filter(rule => rule !== null);

      const groupRenameExclude = document.getElementById('groupRenameExclude').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const filters = {
        excludeGroups,
        excludeUrls,
        excludeNames,
        excludeDuplicateUrls: document.getElementById('excludeDuplicateUrls').checked,
        groupRenameRules,
        groupRenameExclude
      };

      // 同时保存到 localStorage（用于回显）和数据库（用于定时任务）
      localStorage.setItem('syncFilters', JSON.stringify({
        excludeGroups: document.getElementById('syncExcludeGroups').value,
        excludeUrls: document.getElementById('syncExcludeUrls').value,
        excludeNames: document.getElementById('syncExcludeNames').value,
        excludeDuplicateUrls: document.getElementById('excludeDuplicateUrls').checked,
        groupRenameRules: document.getElementById('groupRenameRules').value,
        groupRenameExclude: document.getElementById('groupRenameExclude').value
      }));

      try {
        const result = await apiRequest('/sync/filter', {
          method: 'POST',
          body: JSON.stringify(filters)
        });
        if (result.success) {
          showToast('过滤规则已保存到数据库，定时任务将自动应用', 'success');
        } else {
          showToast('保存失败: ' + result.error, 'error');
        }
      } catch (error) {
        console.error('Failed to save sync filters:', error);
        showToast('保存失败，仅保存在本地浏览器缓存', 'error');
      }
    }

    async function loadSyncFilters() {
      // 优先从数据库加载，如果失败则从 localStorage 加载
      try {
        const result = await apiRequest('/sync/filter', { showLoading: false });
        if (result.success && result.config) {
          const config = result.config;
          // 将数组转换为多行文本格式用于显示
          document.getElementById('syncExcludeGroups').value = (config.excludeGroups || []).join('\\n');
          document.getElementById('syncExcludeUrls').value = (config.excludeUrls || []).join('\\n');
          document.getElementById('syncExcludeNames').value = (config.excludeNames || []).join('\\n');
          document.getElementById('excludeDuplicateUrls').checked = config.excludeDuplicateUrls || false;

          // 将分组重命名规则数组转换为多行文本格式
          const groupRenameRulesText = (config.groupRenameRules || [])
            .map(rule => rule.keyword + ' -> ' + rule.newName)
            .join('\\n');
          document.getElementById('groupRenameRules').value = groupRenameRulesText;

          document.getElementById('groupRenameExclude').value = (config.groupRenameExclude || []).join('\\n');
          console.log('Loaded sync filters from database:', config);
          return;
        }
      } catch (error) {
        console.error('Failed to load sync filters from database:', error);
      }

      // 如果从数据库加载失败，从 localStorage 加载
      const saved = localStorage.getItem('syncFilters');
      if (saved) {
        try {
          const filters = JSON.parse(saved);
          document.getElementById('syncExcludeGroups').value = filters.excludeGroups || '';
          document.getElementById('syncExcludeUrls').value = filters.excludeUrls || '';
          document.getElementById('syncExcludeNames').value = filters.excludeNames || '';
          document.getElementById('excludeDuplicateUrls').checked = filters.excludeDuplicateUrls || false;
          document.getElementById('groupRenameRules').value = filters.groupRenameRules || '';
          document.getElementById('groupRenameExclude').value = filters.groupRenameExclude || '';
          console.log('Loaded sync filters from localStorage:', filters);
        } catch (e) {
          console.error('Failed to load sync filters from localStorage:', e);
        }
      }
    }

    async function syncSource(id) {
      // 设置同步状态
      setSyncStatus('syncing');
      showToast('同步任务已开始，可以在后台继续执行', 'info');

      // 获取过滤规则（支持逗号和换行符分隔）
      const excludeGroups = document.getElementById('syncExcludeGroups').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const excludeUrls = document.getElementById('syncExcludeUrls').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const excludeNames = document.getElementById('syncExcludeNames').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // 解析分组重命名规则
      const groupRenameRules = document.getElementById('groupRenameRules').value
        .split(new RegExp('[\\n]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(rule => {
          const parts = rule.split('->');
          if (parts.length === 2) {
            return {
              keyword: parts[0].trim(),
              newName: parts[1].trim()
            };
          }
          return null;
        })
        .filter(rule => rule !== null);

      const groupRenameExclude = document.getElementById('groupRenameExclude').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const filter = {
        excludeGroups,
        excludeUrls,
        excludeNames,
        excludeDuplicateUrls: document.getElementById('excludeDuplicateUrls').checked,
        groupRenameRules,
        groupRenameExclude
      };

      console.log('Sync filter:', filter); // 调试日志

      // 后台执行同步，不等待结果
      const syncUrl = API_BASE + '/sync/' + id;
      const syncId = Date.now();

      fetch(syncUrl, {
        method: 'POST',
        headers: {
          'X-Admin-Key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filter)
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const message = result.deletedChannels
            ? '同步成功：删除了 ' + result.deletedChannels + ' 个旧频道，新增 ' + result.channelCount + ' 个频道'
            : '同步成功，共 ' + result.channelCount + ' 个频道';
          showToast(message, 'success');
          // 如果用户还在源列表页，刷新数据
          if (document.getElementById('sources').classList.contains('active')) {
            loadSources();
          }
        } else {
          showToast('同步失败: ' + result.error, 'error');
        }
      })
      .catch(error => {
        showToast('同步失败: ' + error.error, 'error');
      })
      .finally(() => {
        // 清除同步状态
        clearSyncStatus();
      });
    }

    async function loadChannels() {
      try {
        showLoading();
        let url = '/channels';
        const sourceId = document.getElementById('channelSourceFilter').value;
        const groupTitle = document.getElementById('channelGroupFilter').value;
        const search = document.getElementById('channelSearch').value.trim();
        const pageSize = Math.min(parseInt(document.getElementById('channelPageSize').value) || 100, 100);
        const params = new URLSearchParams({
          page: currentChannelPage,
          page_size: pageSize
        });
        if (sourceId) params.append('source_id', sourceId);
        if (groupTitle) params.append('group_title', groupTitle);
        if (search) params.append('search', search);
        url += '?' + params.toString();
        const data = await apiRequest(url, { showLoading: false });
        const channels = data.results || [];
        const pagination = data.pagination || {};
        totalChannelPages = pagination.total_pages || 1;
        totalChannels = pagination.total || 0;
        const tbody = document.getElementById('channelsTable');
        if (channels.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="empty-state">暂无频道</td></tr>';
        } else {
          tbody.innerHTML = channels.map(channel => \`
            <tr>
              <td>
                \${channel.logo ? \`<img src="\${escapeHtml(channel.logo)}" style="width:24px;height:24px;margin-right:8px;vertical-align:middle;">\` : ''}
                \${escapeHtml(channel.channel_name)}
              </td>
              <td>\${escapeHtml(channel.group_title || '-')}</td>
              <td>\${escapeHtml(channel.source_name || '-')}</td>
              <td class="play-url-cell">
                <span class="play-url" title="\${escapeHtml(channel.play_url)}">\${escapeHtml(channel.play_url)}</span>
                <button class="btn btn-sm btn-copy" onclick="copyToClipboard('\${escapeHtml(channel.play_url)}')" title="复制地址">复制</button>
              </td>
              <td class="headers-cell">
                \${formatHeaders(channel.headers)}
              </td>
              <td>
                <span class="badge \${channel.is_active ? 'badge-success' : 'badge-danger'}">
                  \${channel.is_active ? '启用' : '禁用'}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm \${channel.is_active ? 'btn-danger' : 'btn-success'}"
                    onclick="toggleChannel(\${channel.id}, \${!channel.is_active})">
                    \${channel.is_active ? '禁用' : '启用'}
                  </button>
                </div>
              </td>
            </tr>
          \`).join('');
        }
        renderChannelPagination();
      } catch (error) {
        console.error('加载频道失败:', error);
      } finally {
        hideLoading();
      }
    }

    // 源选择改变时，重新加载分组下拉框
    async function onSourceFilterChange() {
      const sourceId = document.getElementById('channelSourceFilter').value;
      const groupFilter = document.getElementById('channelGroupFilter');
      
      if (sourceId) {
        // 获取该源的分组
        try {
          const groupsData = await apiRequest('/channels?action=get_groups&source_id=' + sourceId, { showLoading: false });
          const groups = groupsData.groups || [];
          groupFilter.innerHTML = '<option value="">全部分组</option>' + groups.map(g => \`<option value="\${escapeHtml(g)}">\${escapeHtml(g)}</option>\`).join('');
        } catch (e) {
          console.error('加载分组失败:', e);
        }
      } else {
        // 显示所有分组
        try {
          const groupsData = await apiRequest('/channels?action=get_groups', { showLoading: false });
          const groups = groupsData.groups || [];
          groupFilter.innerHTML = '<option value="">全部分组</option>' + groups.map(g => \`<option value="\${escapeHtml(g)}">\${escapeHtml(g)}</option>\`).join('');
        } catch (e) {
          console.error('加载分组失败:', e);
        }
      }
      
      // 重置分组选择
      groupFilter.value = '';
      
      // 重新加载频道列表
      resetChannelPage();
    }

    function resetChannelPage() {
      currentChannelPage = 1;
      loadChannels();
    }

    function goToChannelPage(page) {
      if (page >= 1 && page <= totalChannelPages) {
        currentChannelPage = page;
        loadChannels();
      }
    }

    function renderChannelPagination() {
      const container = document.getElementById('channelPagination');
      if (totalChannelPages <= 1) {
        container.innerHTML = '';
        return;
      }
      let html = \`<span class="pagination-info">共 \${totalChannels} 个频道，第 \${currentChannelPage}/\${totalChannelPages} 页</span>\`;
      html += \`<button onclick="goToChannelPage(1)" \${currentChannelPage === 1 ? 'disabled' : ''}>首页</button>\`;
      html += \`<button onclick="goToChannelPage(\${currentChannelPage - 1})" \${currentChannelPage === 1 ? 'disabled' : ''}>上一页</button>\`;
      const maxButtons = 5;
      let startPage = Math.max(1, currentChannelPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalChannelPages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToChannelPage(\${i})" class="\${i === currentChannelPage ? 'active' : ''}">\${i}</button>\`;
      }
      html += \`<button onclick="goToChannelPage(\${currentChannelPage + 1})" \${currentChannelPage === totalChannelPages ? 'disabled' : ''}>下一页</button>\`;
      html += \`<button onclick="goToChannelPage(\${totalChannelPages})" \${currentChannelPage === totalChannelPages ? 'disabled' : ''}>末页</button>\`;
      container.innerHTML = html;
    }

    async function toggleChannel(id, isActive) {
      showToast('功能开发中', 'error');
    }

    async function clearChannels() {
      if (!confirm('确定要清空所有频道数据吗？此操作不可恢复！')) return;

      try {
        const result = await apiRequest('/channels', { method: 'DELETE' });
        showToast(result.message || '清空成功', 'success');
        loadChannels();
        loadSources(); // 更新源中的频道数统计
      } catch (error) {
        showToast('清空失败: ' + error.error, 'error');
      }
    }

    async function loadCodes() {
      try {
        showLoading();
        let url = '/codes';
        const codeFilter = document.getElementById('codeFilter').value.trim();
        const statusFilter = document.getElementById('codeStatusFilter').value;
        const durationMin = document.getElementById('durationMin').value;
        const durationMax = document.getElementById('durationMax').value;
        const expiredFrom = document.getElementById('expiredFrom').value;
        const expiredTo = document.getElementById('expiredTo').value;
        const activatedFrom = document.getElementById('activatedFrom').value;
        const activatedTo = document.getElementById('activatedTo').value;
        const remarkFilter = document.getElementById('remarkFilter').value.trim();
        const pageSize = Math.min(parseInt(document.getElementById('codePageSize').value) || 100, 100);
        const params = new URLSearchParams({
          page: currentCodePage,
          page_size: pageSize
        });
        if (codeFilter) params.append('code_search', codeFilter);
        if (statusFilter) params.append('status', statusFilter);
        if (durationMin) params.append('duration_min', durationMin);
        if (durationMax) params.append('duration_max', durationMax);
        if (expiredFrom) params.append('expired_from', expiredFrom);
        if (expiredTo) params.append('expired_to', expiredTo);
        if (activatedFrom) params.append('activated_from', activatedFrom);
        if (activatedTo) params.append('activated_to', activatedTo);
        if (remarkFilter) params.append('remark', remarkFilter);
        url += '?' + params.toString();
        const data = await apiRequest(url, { showLoading: false });
        const codeList = data.results || [];
        const pagination = data.pagination || {};
        totalCodePages = pagination.total_pages || 1;
        totalCodes = pagination.total || 0;
        const tbody = document.getElementById('codesTable');
        if (!codeList || codeList.length === 0) {
          tbody.innerHTML = '<tr><td colspan="8" class="empty-state">暂无卡密</td></tr>';
        } else {
          const statusMap = {
            'unused': { text: '未使用', class: 'badge-warning' },
            'active': { text: '活跃', class: 'badge-success' },
            'disabled': { text: '禁用', class: 'badge-danger' }
          };
          tbody.innerHTML = codeList.map(code => {
            const status = statusMap[code.status] || { text: code.status, class: 'badge-warning' };
            return \`
              <tr>
                <td><input type="checkbox" class="code-checkbox custom-checkbox" value="\${escapeHtml(code.code)}"></td>
                <td><span class="code-display">\${escapeHtml(code.code)}</span></td>
                <td><span class="badge \${status.class}">\${status.text}</span></td>
                <td>\${code.duration_days}</td>
                <td>\${code.max_ips || 3}</td>
                <td>\${code.activated_at ? new Date(code.activated_at).toLocaleString('zh-CN', { timeZone: window.TIMEZONE || 'Asia/Shanghai' }) : '-'}</td>
                <td>\${code.expired_at ? new Date(code.expired_at).toLocaleString('zh-CN', { timeZone: window.TIMEZONE || 'Asia/Shanghai' }) : '-'}</td>
                <td>\${escapeHtml(code.remark || '-')}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-sm" onclick="editCode('\${code.code}')">编辑</button>
                  </div>
                </td>
              </tr>
            \`;
          }).join('');
        }
        renderCodePagination();
      } catch (error) {
        console.error('加载卡密失败:', error);
      } finally {
        hideLoading();
      }
    }

    function resetCodePage() {
      currentCodePage = 1;
      loadCodes();
    }

    function goToCodePage(page) {
      if (page >= 1 && page <= totalCodePages) {
        currentCodePage = page;
        loadCodes();
      }
    }

    function renderCodePagination() {
      const container = document.getElementById('codePagination');
      if (totalCodePages <= 1) {
        container.innerHTML = '';
        return;
      }
      let html = \`<span class="pagination-info">共 \${totalCodes} 个卡密，第 \${currentCodePage}/\${totalCodePages} 页</span>\`;
      html += \`<button onclick="goToCodePage(1)" \${currentCodePage === 1 ? 'disabled' : ''}>首页</button>\`;
      html += \`<button onclick="goToCodePage(\${currentCodePage - 1})" \${currentCodePage === 1 ? 'disabled' : ''}>上一页</button>\`;
      const maxButtons = 5;
      let startPage = Math.max(1, currentCodePage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalCodePages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToCodePage(\${i})" class="\${i === currentCodePage ? 'active' : ''}">\${i}</button>\`;
      }
      html += \`<button onclick="goToCodePage(\${currentCodePage + 1})" \${currentCodePage === totalCodePages ? 'disabled' : ''}>下一页</button>\`;
      html += \`<button onclick="goToCodePage(\${totalCodePages})" \${currentCodePage === totalCodePages ? 'disabled' : ''}>末页</button>\`;
      container.innerHTML = html;
    }

    function toggleAdvancedFilter() {
      const panel = document.getElementById('advancedFilterPanel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function toggleSelectAllCodes() {
      const selectAll = document.getElementById('selectAllCodes');
      const checkboxes = document.querySelectorAll('.code-checkbox');
      checkboxes.forEach(cb => cb.checked = selectAll.checked);
    }

    async function batchDeleteCodes() {
      const checkboxes = document.querySelectorAll('.code-checkbox:checked');
      const codesToDelete = Array.from(checkboxes).map(cb => cb.value);

      if (codesToDelete.length === 0) {
        showToast('请先选择要删除的卡密', 'info');
        return;
      }

      if (!confirm(\`确定要删除选中的 \${codesToDelete.length} 个卡密吗？此操作不可恢复！\`)) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/codes?action=batch_delete', {
          method: 'POST',
          body: JSON.stringify({ codes: codesToDelete })
        });

        showToast(\`成功删除 \${codesToDelete.length} 个卡密\`, 'success');

        // 清空选择
        document.getElementById('selectAllCodes').checked = false;

        // 刷新列表
        loadCodes();
      } catch (error) {
        showToast('批量删除失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    function clearCodeFilters() {
      document.getElementById('codeFilter').value = '';
      document.getElementById('codeStatusFilter').value = '';
      document.getElementById('durationMin').value = '';
      document.getElementById('durationMax').value = '';
      document.getElementById('expiredFrom').value = '';
      document.getElementById('expiredTo').value = '';
      document.getElementById('activatedFrom').value = '';
      document.getElementById('activatedTo').value = '';
      document.getElementById('remarkFilter').value = '';
      resetCodePage();
    }

    async function exportCodesCSV() {
      try {
        showLoading();
        let url = '/codes?action=export';
        const params = new URLSearchParams();
        const statusFilter = document.getElementById('codeStatusFilter').value;
        const durationMin = document.getElementById('durationMin').value;
        const durationMax = document.getElementById('durationMax').value;
        const expiredFrom = document.getElementById('expiredFrom').value;
        const expiredTo = document.getElementById('expiredTo').value;
        const activatedFrom = document.getElementById('activatedFrom').value;
        const activatedTo = document.getElementById('activatedTo').value;
        const remarkFilter = document.getElementById('remarkFilter').value.trim();

        if (statusFilter) params.append('status', statusFilter);
        if (durationMin) params.append('duration_min', durationMin);
        if (durationMax) params.append('duration_max', durationMax);
        if (expiredFrom) params.append('expired_from', expiredFrom);
        if (expiredTo) params.append('expired_to', expiredTo);
        if (activatedFrom) params.append('activated_from', activatedFrom);
        if (activatedTo) params.append('activated_to', activatedTo);
        if (remarkFilter) params.append('remark', remarkFilter);

        if (params.toString()) {
          url += '&' + params.toString();
        }

        const response = await fetch(API_BASE + url, {
          headers: { 'X-Admin-Key': adminKey }
        });

        if (!response.ok) {
          throw new Error('导出失败');
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'codes_export_' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        showToast('导出成功', 'success');
      } catch (error) {
        console.error('导出失败:', error);
        showToast('导出失败: ' + error.message, 'error');
      } finally {
        hideLoading();
      }
    }

    function showGenerateCodeModal() {
      document.getElementById('generateCount').value = 1;
      document.getElementById('generateDuration').value = 30;
      document.getElementById('generateDurationCustom').value = 7;
      document.getElementById('generateDurationCustom').style.display = 'none';
      document.getElementById('generateMaxIps').value = 3;
      document.getElementById('generateRemark').value = '';
      document.getElementById('generateCodeModal').classList.add('active');
    }

    function closeGenerateCodeModal() {
      document.getElementById('generateCodeModal').classList.remove('active');
    }

    function togglePermanentCode() {
      const durationSelect = document.getElementById('generateDuration');
      const customInput = document.getElementById('generateDurationCustom');

      if (durationSelect.value === 'custom') {
        customInput.style.display = 'block';
      } else {
        customInput.style.display = 'none';
      }
    }

    async function generateCodes() {
      const count = parseInt(document.getElementById('generateCount').value);
      const durationSelect = document.getElementById('generateDuration');
      const customInput = document.getElementById('generateDurationCustom');
      let durationDays = parseInt(durationSelect.value);

      // 如果选择自定义，使用自定义输入框的值
      if (durationSelect.value === 'custom') {
        durationDays = parseInt(customInput.value);

        if (!durationDays || durationDays < 1) {
          showToast('自定义天数必须大于0', 'error');
          return;
        }
        if (durationDays > 3650) {
          showToast('自定义天数不能超过3650天', 'error');
          return;
        }
      }

      const maxIps = parseInt(document.getElementById('generateMaxIps').value);
      const remark = document.getElementById('generateRemark').value.trim();

      if (!count || count < 1 || count > 100) {
        showToast('生成数量必须在1-100之间', 'error');
        return;
      }

      try {
        const result = await apiRequest('/codes', {
          method: 'POST',
          body: JSON.stringify({ count, duration_days: durationDays, max_ips: maxIps, remark })
        });

        if (result.success && result.codes) {
          showGeneratedCodes(result.codes);
          closeGenerateCodeModal();
          showToast('成功生成 ' + result.codes.length + ' 个卡密', 'success');
          loadCodes();
        } else {
          showToast('生成卡密失败', 'error');
        }
      } catch (error) {
        showToast('生成卡密失败: ' + error.error, 'error');
      }
    }

    function showGeneratedCodes(codes) {
      const container = document.getElementById('generatedCodesList');
      container.innerHTML = \`<h4>共生成 \${codes.length} 个卡密</h4>\` +
        codes.map(c => \`
          <div class="generated-codes-item">
            <span class="code-display">\${escapeHtml(c.code)}</span>
            <span>\${escapeHtml(c.remark || '无备注')}</span>
          </div>
        \`).join('');
      document.getElementById('codeResultModal').classList.add('active');
    }

    function closeCodeResultModal() {
      document.getElementById('codeResultModal').classList.remove('active');
    }

    function editCode(code) {
      apiRequest('/codes?code=' + encodeURIComponent(code)).then(targetCode => {
        if (targetCode) {
          document.getElementById('editCode').value = targetCode.code;
          document.getElementById('editStatus').value = targetCode.status;
          document.getElementById('editRemark').value = targetCode.remark || '';
          document.getElementById('codeEditModal').classList.add('active');
        }
      });
    }

    function closeCodeEditModal() {
      document.getElementById('codeEditModal').classList.remove('active');
    }

    async function saveCodeEdit() {
      const code = document.getElementById('editCode').value;
      const status = document.getElementById('editStatus').value;
      const remark = document.getElementById('editRemark').value.trim();

      try {
        await apiRequest('/codes', {
          method: 'PUT',
          body: JSON.stringify({ code, status, remark })
        });
        showToast('卡密更新成功', 'success');
        closeCodeEditModal();
        loadCodes();
      } catch (error) {
        showToast('更新失败: ' + error.error, 'error');
      }
    }

    function showImportCodeModal() {
      document.getElementById('importFile').value = '';
      document.getElementById('fileInfo').style.display = 'none';
      document.getElementById('importCodeModal').classList.add('active');
    }

    function closeImportCodeModal() {
      document.getElementById('importCodeModal').classList.remove('active');
    }

    function handleImportFileSelect() {
      const fileInput = document.getElementById('importFile');
      const fileInfo = document.getElementById('fileInfo');
      const fileName = document.getElementById('fileName');

      if (fileInput.files && fileInput.files[0]) {
        fileName.textContent = '已选择: ' + fileInput.files[0].name + ' (' + formatFileSize(fileInput.files[0].size) + ')';
        fileInfo.style.display = 'block';
      } else {
        fileInfo.style.display = 'none';
      }
    }

    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    async function importCodesFromCSV() {
      const fileInput = document.getElementById('importFile');

      if (!fileInput.files || !fileInput.files[0]) {
        showToast('请选择CSV文件', 'error');
        return;
      }

      try {
        showLoading();
        const file = fileInput.files[0];
        const text = await file.text();
        const lines = text.split('\\n').map(line => line.trim()).filter(line => line);

        if (lines.length < 2) {
          showToast('CSV文件内容为空或格式不正确', 'error');
          hideLoading();
          return;
        }

        const skipDuplicates = document.getElementById('skipDuplicates').checked;
        const updateExisting = document.getElementById('updateExisting').checked;

        const codes = [];
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 1; i < lines.length; i++) {
          const parts = parseCSVLine(lines[i]);

          if (parts.length < 2) {
            errorCount++;
            errors.push('Row ' + (i + 1) + ': Format error, need at least 2 columns');
            continue;
          }

          const code = parts[0].trim();
          const durationDays = parseInt(parts[1]);
          const activatedAt = parts[2] ? parts[2].trim() : null;
          const expiredAt = parts[3] ? parts[3].trim() : null;
          const remark = parts[4] ? parts[4].trim() : '';

          if (!code || isNaN(durationDays)) {
            errorCount++;
            errors.push('Row ' + (i + 1) + ': Invalid code or duration format');
            continue;
          }

          codes.push({
            code,
            duration_days: durationDays,
            activated_at: activatedAt,
            expired_at: expiredAt,
            remark
          });
        }

        if (codes.length === 0) {
          showToast('没有有效的卡密数据', 'error');
          hideLoading();
          return;
        }

        const result = await apiRequest('/codes?action=import', {
          method: 'POST',
          body: JSON.stringify({
            codes,
            skip_duplicates: skipDuplicates,
            update_existing: updateExisting
          }),
          showLoading: false
        });

        if (result.success) {
          successCount = result.imported || 0;
          skipCount = result.skipped || 0;
          errorCount = result.errors || 0;

          let message = '导入完成: ';
          message += '成功 ' + successCount + ' 条';
          if (skipCount > 0) message += ', 跳过 ' + skipCount + ' 条';
          if (errorCount > 0) message += ', 失败 ' + errorCount + ' 条';

          showToast(message, successCount > 0 ? 'success' : 'error');
          closeImportCodeModal();
          loadCodes();
        } else {
          showToast('导入失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('导入失败:', error);
        showToast('导入失败: ' + (error.error || error.message), 'error');
      } finally {
        hideLoading();
      }
    }

    function parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }

      result.push(current);
      return result;
    }

    async function clearCodes() {
      if (!confirm('确定要清空所有卡密数据吗？此操作不可恢复！')) return;

      try {
        showLoading();
        const result = await apiRequest('/codes', {
          method: 'DELETE'
        });
        showToast(result.message || '清空成功', 'success');
        loadCodes();
      } catch (error) {
        showToast('清空失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function loadSecurityConfig() {
      try {
        showLoading();
        const data = await apiRequest('/security/config', { showLoading: false });

        if (data.success && data.config) {
          document.getElementById('securityConfigForm').style.display = 'block';
          document.getElementById('noSecurityConfig').style.display = 'none';

          document.getElementById('channelDailyLimit').value = data.config.channel_daily_limit;
          document.getElementById('banDurationDays').value = data.config.ban_duration_days;
          document.getElementById('autoBanOnExceed').checked = data.config.auto_ban_on_exceed;
        } else {
          showToast('加载配置失败', 'error');
        }
      } catch (error) {
        showToast('加载配置失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function saveSecurityConfig() {
      try {
        showLoading();
        const config = {
          channel_daily_limit: parseInt(document.getElementById('channelDailyLimit').value),
          ban_duration_days: parseInt(document.getElementById('banDurationDays').value),
          auto_ban_on_exceed: document.getElementById('autoBanOnExceed').checked
        };

        if (config.channel_daily_limit < 1 || config.channel_daily_limit > 10000) {
          showToast('播放次数限制必须在1-10000之间', 'error');
          hideLoading();
          return;
        }

        if (config.ban_duration_days < 0 || config.ban_duration_days > 365) {
          showToast('封禁时长必须在0-365之间', 'error');
          hideLoading();
          return;
        }

        const result = await apiRequest('/security/config', {
          method: 'POST',
          body: JSON.stringify(config),
          showLoading: false
        });

        if (result.success) {
          showToast('配置已保存', 'success');
        } else {
          showToast('保存配置失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('保存配置失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function resetSecurityConfig() {
      if (!confirm('确定要重置为默认配置吗？\\n默认：每个频道100次/天，封禁7天')) {
        return;
      }

      document.getElementById('channelDailyLimit').value = 100;
      document.getElementById('banDurationDays').value = 7;
      document.getElementById('autoBanOnExceed').checked = true;

      await saveSecurityConfig();
    }

    async function loadQuotaInfo() {
      const code = document.getElementById('quotaCode').value.trim();
      if (!code) {
        showToast('请输入卡密', 'error');
        return;
      }

      try {
        showLoading();
        const quotaUrl = '/security/quota?code=' + encodeURIComponent(code);
        const data = await apiRequest(quotaUrl, { showLoading: false });

        document.getElementById('quotaInfo').style.display = 'block';
        document.getElementById('noQuotaData').style.display = 'none';

        // 更新统计数据
        document.getElementById('quotaTotalPlays').textContent = data.total_plays || 0;
        document.getElementById('quotaExceededCount').textContent = data.exceeded_channels_count || 0;

        // 更新状态
        const banStatus = document.getElementById('quotaBanStatus');
        const banTimeEl = document.getElementById('quotaBanTime');
        const banAlert = document.getElementById('banAlert');

        if (data.is_banned) {
          banStatus.innerHTML = '<div class="stat-value" style="color:#ff3b30;">已封禁</div><div class="stat-label">状态</div>';
          const timezone = window.TIMEZONE || 'Asia/Shanghai';
          const banInfo = data.banned_until ? ' 至 ' + new Date(data.banned_until).toLocaleString('zh-CN', { timeZone: timezone }) : '';
          banTimeEl.textContent = (data.banned_at ? new Date(data.banned_at).toLocaleString('zh-CN', { timeZone: timezone }) : '-') + banInfo;
          banAlert.style.display = 'block';

          // 更新封禁详细信息
          document.getElementById('banLimitText').textContent = data.channel_daily_limit || '未知';
          document.getElementById('banDurationText').textContent = data.ban_duration_days === 0 ? '永久' : (data.ban_duration_days + '天');
          document.getElementById('banUntilText').textContent = data.banned_until ? new Date(data.banned_until).toLocaleString('zh-CN', { timeZone: timezone }) : '永久';
        } else {
          banStatus.innerHTML = '<div class="stat-value" style="color:#34c759;">正常</div><div class="stat-label">状态</div>';
          banTimeEl.textContent = '-';
          banAlert.style.display = 'none';
        }

        // 显示频道播放详情
        const channelPlaysSection = document.getElementById('channelPlaysSection');
        const channelPlaysTable = document.getElementById('channelPlaysTable');

        console.log('Quota data:', data);
        console.log('Channel plays section:', channelPlaysSection);
        console.log('Channel plays table:', channelPlaysTable);
        console.log('Channel plays:', data.details?.channelPlays);

        if (!channelPlaysSection || !channelPlaysTable) {
          console.error('DOM elements not found');
          return;
        }

        const channelPlays = data.details?.channelPlays || {};
        const channelNames = data.channel_names || {};

        if (Object.keys(channelPlays).length > 0) {
          channelPlaysSection.style.display = 'block';

          // 获取当前配置的播放次数限制
          const dailyLimit = data.channel_daily_limit || 100;

          const tableRows = Object.entries(channelPlays)
            .sort((a, b) => b[1] - a[1]) // 按播放次数降序排列
            .map(([hash, count]) => {
              const isExceeded = count >= dailyLimit;
              const statusBadge = isExceeded
                ? '<span class="badge badge-danger">超限</span>'
                : '<span class="badge badge-success">正常</span>';
              const channelName = channelNames[hash] || hash; // 如果找不到名称，显示hash
              return '<tr>' +
                '<td>' + escapeHtml(channelName) + '</td>' +
                '<td>' + count + '</td>' +
                '<td>' + statusBadge + '</td>' +
                '</tr>';
            }).join('');

          channelPlaysTable.innerHTML = tableRows || '<tr><td colspan="3" class="empty-state">暂无播放数据</td></tr>';
        } else {
          channelPlaysSection.style.display = 'none';
        }
      } catch (error) {
        showToast('加载额度信息失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function unbanCode() {
      const code = document.getElementById('quotaCode').value.trim();
      if (!code) {
        showToast('请输入卡密', 'error');
        return;
      }

      if (!confirm('确定要解封该卡密吗？解封后卡密将恢复正常使用。')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/security/unban', {
          method: 'POST',
          body: JSON.stringify({ code }),
          showLoading: false
        });

        if (result.success) {
          showToast('卡密已解封', 'success');
          loadQuotaInfo();
          // 刷新卡密列表以更新状态
          loadCodes();
        } else {
          showToast('解封失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('解封失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // 加载封禁卡密列表
    async function loadBannedCodes() {
      try {
        showLoading();
        const data = await apiRequest('/security/banned-codes', { showLoading: false });
        const tbody = document.getElementById('bannedCodesTable');
        const noDataDiv = document.getElementById('noBannedCodes');

        if (!data.codes || data.codes.length === 0) {
          tbody.innerHTML = '';
          noDataDiv.style.display = 'block';
          return;
        }

        noDataDiv.style.display = 'none';
        const timezone = window.TIMEZONE || 'Asia/Shanghai';
        const statusMap = {
          'active': { text: '活跃', class: 'badge-success' },
          'disabled': { text: '禁用', class: 'badge-danger' }
        };

        tbody.innerHTML = data.codes.map(code => {
          const status = statusMap[code.status] || { text: code.status, class: 'badge-warning' };
          const isExpired = code.banned_until && new Date(code.banned_until) <= new Date();
          return \`
            <tr>
              <td><span class="code-display">\${escapeHtml(code.code)}</span></td>
              <td><span class="badge \${status.class}">\${status.text}</span></td>
              <td>\${code.duration_days}</td>
              <td>\${code.activated_at ? new Date(code.activated_at).toLocaleString('zh-CN', { timeZone: timezone }) : '-'}</td>
              <td>\${code.expired_at ? new Date(code.expired_at).toLocaleString('zh-CN', { timeZone: timezone }) : '-'}</td>
              <td>
                \${code.banned_until
                  ? (isExpired
                    ? '<span style="color:#ff3b30;">已过期</span>'
                    : new Date(code.banned_until).toLocaleString('zh-CN', { timeZone: timezone })
                  )
                  : '-'}
              </td>
              <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="\${escapeHtml(code.remark || '')}">
                \${escapeHtml(code.remark || '-')}
              </td>
              <td>
                <button class="btn btn-sm btn-success" onclick="unbanCodeFromList('\${escapeHtml(code.code)}')">解封</button>
              </td>
            </tr>
          \`;
        }).join('');
      } catch (error) {
        console.error('加载封禁卡密失败:', error);
        showToast('加载失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // 从列表解封卡密
    async function unbanCodeFromList(code) {
      if (!confirm('确定要解封卡密 ' + code + ' 吗？')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/security/unban', {
          method: 'POST',
          body: JSON.stringify({ code }),
          showLoading: false
        });

        if (result.success) {
          showToast('卡密已解封', 'success');
          loadBannedCodes(); // 刷新封禁列表
          loadCodes(); // 刷新卡密列表
        } else {
          showToast('解封失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('解封失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = 'toast ' + type;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板', 'success');
      }).catch(err => {
        // 备用方案：使用 textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('已复制到剪贴板', 'success');
      });
    }

    function formatHeaders(headersStr) {
      if (!headersStr || headersStr === '{}') return '-';

      try {
        const headers = JSON.parse(headersStr);
        const tags = [];

        if (headers['User-Agent']) {
          let ua = headers['User-Agent'];
          if (ua.length > 20) {
            ua = ua.substring(0, 20) + '...';
          }
          tags.push(\`<span class="headers-tag" title="\${escapeHtml(headers['User-Agent'])}">UA: \${escapeHtml(ua)}</span>\`);
        }

        if (headers['Referer']) {
          let referer = headers['Referer'];
          if (referer.length > 20) {
            referer = referer.substring(0, 20) + '...';
          }
          tags.push(\`<span class="headers-tag" title="\${escapeHtml(headers['Referer'])}">Ref: \${escapeHtml(referer)}</span>\`);
        }

        return tags.join('');
      } catch (e) {
        return headersStr;
      }
    }

    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // IP黑名单管理
    async function loadIPBlacklist() {
      try {
        showLoading();
        const data = await apiRequest('/ip-blacklist', { showLoading: false });
        const tbody = document.getElementById('ipBlacklistTable');
        const noDataDiv = document.getElementById('noIPBlacklist');

        if (!data.ips || data.ips.length === 0) {
          tbody.innerHTML = '';
          noDataDiv.style.display = 'block';
          return;
        }

        noDataDiv.style.display = 'none';
        const timezone = window.TIMEZONE || 'Asia/Shanghai';

        tbody.innerHTML = data.ips.map(item => \`
          <tr>
            <td><span class="code-display">\${escapeHtml(item.ip)}</span></td>
            <td>\${item.bannedAt ? new Date(item.bannedAt).toLocaleString('zh-CN', { timeZone: timezone }) : '-'}</td>
            <td>\${escapeHtml(item.reason)}</td>
            <td>\${item.details ? '<button class="btn btn-sm" onclick="showIPDetails(\\\`' + JSON.stringify(item).replace(/"/g, '&quot;') + '\\\`)">查看</button>' : '-'}</td>
            <td>
              <button class="btn btn-sm btn-success" onclick="unbanIP('\${escapeHtml(item.ip)}')">解封</button>
            </td>
          </tr>
        \`).join('');

        const statElement = document.getElementById('statBannedIPs');
        if (statElement) {
          statElement.textContent = data.count || 0;
        }
      } catch (error) {
        console.error('加载IP黑名单失败:', error);
        showToast('加载失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function unbanIP(ip) {
      if (!confirm('确定要解封IP ' + ip + ' 吗？')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/ip-blacklist/remove?ip=' + encodeURIComponent(ip), {
          method: 'DELETE',
          showLoading: false
        });

        if (result.success) {
          showToast('IP已解封', 'success');
          loadIPBlacklist();
        } else {
          showToast('解封失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('解封失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function manualBanIP() {
      const ip = document.getElementById('manualBanIP').value.trim();
      const reason = document.getElementById('manualBanReason').value.trim();

      if (!ip) {
        showToast('请输入IP地址', 'error');
        return;
      }

      if (!reason) {
        showToast('请输入封禁原因', 'error');
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/ip-blacklist/ban', {
          method: 'POST',
          body: JSON.stringify({ ip, reason }),
          showLoading: false
        });

        if (result.success) {
          showToast('IP已封禁', 'success');
          document.getElementById('manualBanIP').value = '';
          document.getElementById('manualBanReason').value = '';
          loadIPBlacklist();
        } else {
          showToast('封禁失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('封禁失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    function showIPDetails(item) {
      const details = item.details || {};
      let detailsText = '封禁IP：' + item.ip + '\\n';
      detailsText += '封禁时间：' + (item.bannedAt || '-') + '\\n';
      detailsText += '封禁原因：' + item.reason + '\\n\\n';
      detailsText += '详细信息：\\n';
      for (const [key, value] of Object.entries(details)) {
        detailsText += key + ': ' + value + '\\n';
      }
      alert(detailsText);
    }

    // IP黑名单配置管理
    async function loadIPBlacklistConfig() {
      try {
        showLoading();
        const data = await apiRequest('/ip-blacklist-config', { showLoading: false });

        if (data.success && data.config) {
          document.getElementById('ipBlacklistConfigForm').style.display = 'block';
          document.getElementById('noIPBlacklistConfig').style.display = 'none';

          document.getElementById('subRateMin').value = data.config.sub_rate_min || 1;
          document.getElementById('subRateHour').value = data.config.sub_rate_hour || 60;
          document.getElementById('subRateDay').value = data.config.sub_rate_day || 500;
          document.getElementById('liveRateMin').value = data.config.live_rate_min || 5;
          document.getElementById('liveRateHour').value = data.config.live_rate_hour || 300;
          document.getElementById('liveRateDay').value = data.config.live_rate_day || 2000;
          document.getElementById('adminRateHour').value = data.config.admin_rate_hour || 10;
        } else {
          showToast('加载配置失败', 'error');
        }
      } catch (error) {
        showToast('加载配置失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function saveIPBlacklistConfig() {
      try {
        showLoading();
        const config = {
          sub_rate_min: parseInt(document.getElementById('subRateMin').value),
          sub_rate_hour: parseInt(document.getElementById('subRateHour').value),
          sub_rate_day: parseInt(document.getElementById('subRateDay').value),
          live_rate_min: parseInt(document.getElementById('liveRateMin').value),
          live_rate_hour: parseInt(document.getElementById('liveRateHour').value),
          live_rate_day: parseInt(document.getElementById('liveRateDay').value),
          admin_rate_hour: parseInt(document.getElementById('adminRateHour').value)
        };

        // 验证配置值
        if (config.sub_rate_min < 1 || config.sub_rate_min > 60) {
          showToast('订阅每分钟限制必须在1-60之间', 'error');
          hideLoading();
          return;
        }
        if (config.sub_rate_hour < 1 || config.sub_rate_hour > 10000) {
          showToast('订阅每小时限制必须在1-10000之间', 'error');
          hideLoading();
          return;
        }
        if (config.sub_rate_day < 1 || config.sub_rate_day > 100000) {
          showToast('订阅每天限制必须在1-100000之间', 'error');
          hideLoading();
          return;
        }

        if (config.live_rate_min < 1 || config.live_rate_min > 60) {
          showToast('播放每分钟限制必须在1-60之间', 'error');
          hideLoading();
          return;
        }
        if (config.live_rate_hour < 1 || config.live_rate_hour > 10000) {
          showToast('播放每小时限制必须在1-10000之间', 'error');
          hideLoading();
          return;
        }
        if (config.live_rate_day < 1 || config.live_rate_day > 100000) {
          showToast('播放每天限制必须在1-100000之间', 'error');
          hideLoading();
          return;
        }

        if (config.admin_rate_hour < 1 || config.admin_rate_hour > 1000) {
          showToast('管理每小时限制必须在1-1000之间', 'error');
          hideLoading();
          return;
        }

        const result = await apiRequest('/ip-blacklist-config', {
          method: 'POST',
          body: JSON.stringify(config),
          showLoading: false
        });

        if (result.success) {
          showToast('配置已保存', 'success');
        } else {
          showToast('保存配置失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('保存配置失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function resetIPBlacklistConfig() {
      if (!confirm('确定要重置为默认配置吗？\\n订阅：每分钟1次，每小时60次，每天500次\\n播放：每分钟5次，每小时300次，每天2000次\\n管理：每小时10次')) {
        return;
      }

      document.getElementById('subRateMin').value = 1;
      document.getElementById('subRateHour').value = 60;
      document.getElementById('subRateDay').value = 500;
      document.getElementById('liveRateMin').value = 5;
      document.getElementById('liveRateHour').value = 300;
      document.getElementById('liveRateDay').value = 2000;
      document.getElementById('adminRateHour').value = 10;

      await saveIPBlacklistConfig();
    }

    // 域名黑名单管理
    async function loadDomainBlacklist() {
      try {
        showLoading();
        const data = await apiRequest('/domain-blacklist', { showLoading: false });
        const tbody = document.getElementById('domainBlacklistTable');
        const noDataDiv = document.getElementById('noDomainBlacklist');

        if (!data.domains || data.domains.length === 0) {
          tbody.innerHTML = '';
          noDataDiv.style.display = 'block';
          return;
        }

        noDataDiv.style.display = 'none';
        const timezone = window.TIMEZONE || 'Asia/Shanghai';

        tbody.innerHTML = data.domains.map(item => \`
          <tr>
            <td><span class="code-display">\${escapeHtml(item.domain)}</span></td>
            <td>\${item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', { timeZone: timezone }) : '-'}</td>
            <td>\${escapeHtml(item.reason || '-')}</td>
            <td>
              <button class="btn btn-sm btn-danger" onclick="removeDomainFromBlacklist('\${item.id}')">删除</button>
            </td>
          </tr>
        \`).join('');
      } catch (error) {
        showToast('加载域名黑名单失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function addDomainToBlacklist() {
      const input = document.getElementById('domainBlacklistInput');
      const reasonInput = document.getElementById('domainBlacklistReason');
      const reason = reasonInput.value.trim();

      if (!input.value.trim()) {
        showToast('请输入域名', 'error');
        return;
      }

      // 分行处理，支持批量添加
      const lines = input.value.split('\\n').filter(line => line.trim());
      const domains = lines.map(line => ({
        domain: line.trim(),
        reason: reason
      }));

      try {
        showLoading();

        if (domains.length === 1) {
          // 单个添加
          const data = await apiRequest('/domain-blacklist', {
            method: 'POST',
            body: JSON.stringify({
              domain: domains[0].domain,
              reason: reason
            })
          });

          if (data.success) {
            showToast('域名已添加到黑名单', 'success');
            input.value = '';
            reasonInput.value = '';
            await loadDomainBlacklist();
          } else {
            showToast('添加失败: ' + data.error, 'error');
          }
        } else {
          // 批量添加
          const data = await apiRequest('/domain-blacklist', {
            method: 'POST',
            body: JSON.stringify({
              domains: domains
            })
          });

          if (data.success) {
            const successCount = data.results.filter(r => r.success).length;
            const failCount = data.results.filter(r => !r.success).length;

            if (failCount > 0) {
              const failedDomains = data.results.filter(r => !r.success).map(r => r.domain).join(', ');
              showToast(\`成功添加 \${successCount} 个域名，失败 \${failCount} 个\n\${failedDomains}\`, 'warning');
            } else {
              showToast(\`成功添加 \${successCount} 个域名到黑名单\`, 'success');
            }

            input.value = '';
            reasonInput.value = '';
            await loadDomainBlacklist();
          } else {
            showToast('批量添加失败', 'error');
          }
        }
      } catch (error) {
        showToast('添加失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function removeDomainFromBlacklist(id) {
      if (!confirm('确定要从黑名单中删除该域名吗？')) {
        return;
      }

      try {
        showLoading();
        const data = await apiRequest(\`/domain-blacklist/\${id}\`, {
          method: 'DELETE'
        });

        if (data.success) {
          showToast('域名已从黑名单中删除', 'success');
          await loadDomainBlacklist();
        } else {
          showToast('删除失败: ' + data.error, 'error');
        }
      } catch (error) {
        showToast('删除失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // 首页展示配置管理
    let homepageConfig = {
      sources: [],
      groups: [],
      hosts: [],
      hasHeaders: null,
      manualHosts: [] // 跟踪手动添加的域名
    };

    async function loadHomepageDisplayConfig() {
      try {
        showLoading();
        const data = await apiRequest('/homepage-display', { showLoading: false });

        if (data.success) {
          homepageConfig = data.config;

          // 兼容旧数据：将字符串的hasHeaders转换为布尔值
          if (typeof homepageConfig.hasHeaders === 'string') {
            if (homepageConfig.hasHeaders === 'null') {
              homepageConfig.hasHeaders = null;
            } else if (homepageConfig.hasHeaders === 'true') {
              homepageConfig.hasHeaders = true;
            } else if (homepageConfig.hasHeaders === 'false') {
              homepageConfig.hasHeaders = false;
            }
            console.log('[loadHomepageDisplayConfig] 兼容旧数据，hasHeaders从字符串转换:', homepageConfig.hasHeaders);
          }

          // 保存系统识别的域名，用于区分手动添加的域名
          homepageConfig.systemHosts = data.options.hosts || [];

          // 确保 manualHosts 数组存在
          if (!homepageConfig.manualHosts) {
            homepageConfig.manualHosts = [];
          }

          // 合并系统识别的域名和手动添加的域名（去重）
          const allHosts = [...new Set([...homepageConfig.systemHosts, ...homepageConfig.manualHosts])];
          const optionsWithHosts = { ...data.options, hosts: allHosts };
          renderHomepageOptions(optionsWithHosts);
        } else {
          showToast('加载配置失败', 'error');
        }
      } catch (error) {
        showToast('加载配置失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    function renderHomepageOptions(options) {
      // 渲染数据源选项
      const sourcesContainer = document.getElementById('sourceCheckboxes');
      if (options.sources && options.sources.length > 0) {
        sourcesContainer.innerHTML = options.sources.map(source => {
          const isChecked = homepageConfig.sources.includes(source.id) ? 'checked' : '';
          return \`
            <label style="display:flex;align-items:center;padding:8px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;transition:all .2s;">
              <input type="checkbox" value="\${source.id}" \${isChecked} onchange="updateHomepageConfig('sources', \${source.id}, this.checked)" style="margin-right:8px;">
              <span style="font-size:14px;">\${escapeHtml(source.name)}</span>
            </label>
          \`;
        }).join('');
      } else {
        sourcesContainer.innerHTML = '<div style="color:#86868b;">暂无数据源</div>';
      }

      // 渲染分类选项
      const groupsContainer = document.getElementById('groupCheckboxes');
      if (options.groups && options.groups.length > 0) {
        groupsContainer.innerHTML = options.groups.map(group => {
          const isChecked = homepageConfig.groups.includes(group) ? 'checked' : '';
          return \`
            <label style="display:flex;align-items:center;padding:8px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;transition:all .2s;">
              <input type="checkbox" value="\${escapeHtml(group)}" \${isChecked} onchange="updateHomepageConfig('groups', '\${escapeHtml(group)}', this.checked)" style="margin-right:8px;">
              <span style="font-size:14px;">\${escapeHtml(group)}</span>
            </label>
          \`;
        }).join('');
      } else {
        groupsContainer.innerHTML = '<div style="color:#86868b;">暂无分类</div>';
      }

      // 渲染host选项（只渲染选中的域名）
      const hostsContainer = document.getElementById('hostCheckboxes');
      if (homepageConfig.hosts && homepageConfig.hosts.length > 0) {
        hostsContainer.innerHTML = homepageConfig.hosts.map(host => {
          const isChecked = true; // 都在 homepageConfig.hosts 中，所以都是选中状态
          const isManual = !homepageConfig.systemHosts || !homepageConfig.systemHosts.includes(host);
          return \`
            <label style="display:flex;align-items:center;padding:8px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;transition:all .2s;position:relative;">
              <input type="checkbox" value="\${escapeHtml(host)}" checked onchange="updateHomepageConfig('hosts', '\${escapeHtml(host)}', this.checked)" style="margin-right:8px;">
              <span style="font-size:14px;flex:1;">\${escapeHtml(host)}</span>
              \${isManual ? '<button onclick="event.stopPropagation();removeManualHost(\\\`' + escapeHtml(host) + '\\\`)" style="padding:2px 8px;font-size:11px;margin-left:8px;border:1px solid #ff3b30;background:white;color:#ff3b30;border-radius:4px;cursor:pointer;">删除</button>' : ''}
            </label>
          \`;
        }).join('');
      } else {
        hostsContainer.innerHTML = '<div style="color:#86868b;">暂无选中的Host，请从下方添加或手动输入</div>';
      }

      // 渲染"是否含有请求头"选项
      const hasHeadersRadios = document.getElementsByName('hasHeaders');
      for (const radio of hasHeadersRadios) {
        if (homepageConfig.hasHeaders === null && radio.value === 'null') {
          radio.checked = true;
        } else if (homepageConfig.hasHeaders === true && radio.value === 'true') {
          radio.checked = true;
        } else if (homepageConfig.hasHeaders === false && radio.value === 'false') {
          radio.checked = true;
        }
      }
    }

    function updateHomepageConfig(type, value, checked) {
      if (type === 'hasHeaders') {
        // 将字符串转换为布尔值
        if (value === 'null') {
          homepageConfig.hasHeaders = null;
        } else if (value === 'true') {
          homepageConfig.hasHeaders = true;
        } else if (value === 'false') {
          homepageConfig.hasHeaders = false;
        } else {
          homepageConfig.hasHeaders = value;
        }
        console.log('[updateHomepageConfig] hasHeaders更新为:', homepageConfig.hasHeaders, '原始值:', value);
      } else if (type === 'hosts') {
        if (checked) {
          if (!homepageConfig.hosts.includes(value)) {
            homepageConfig.hosts.push(value);
          }
        } else {
          // 取消选中：从 hosts 中移除
          homepageConfig.hosts = homepageConfig.hosts.filter(item => item !== value);
          // 如果是手动添加的域名，同时从 manualHosts 中移除
          if (homepageConfig.manualHosts && homepageConfig.manualHosts.includes(value)) {
            homepageConfig.manualHosts = homepageConfig.manualHosts.filter(item => item !== value);
          }
        }
      } else {
        if (checked) {
          if (!homepageConfig[type].includes(value)) {
            homepageConfig[type].push(value);
          }
        } else {
          homepageConfig[type] = homepageConfig[type].filter(item => item !== value);
        }
      }
    }

    function addManualHost() {
      const input = document.getElementById('manualHostInput');
      const host = input.value.trim();

      if (!host) {
        showToast('请输入域名', 'error');
        return;
      }

      // 验证域名格式（简单验证）
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$/;
      if (!domainRegex.test(host)) {
        showToast('域名格式不正确，请输入有效的域名', 'error');
        return;
      }

      // 检查是否已在配置中存在
      if (homepageConfig.hosts.includes(host)) {
        showToast('该域名已存在', 'error');
        return;
      }

      // 添加到配置中并自动选中
      homepageConfig.hosts.push(host);
      // 记录为手动添加的域名
      if (!homepageConfig.manualHosts) {
        homepageConfig.manualHosts = [];
      }
      homepageConfig.manualHosts.push(host);
      input.value = '';

      // 重新渲染列表
      loadHomepageDisplayConfig();
      showToast('域名已添加', 'success');
    }

    function removeManualHost(host) {
      if (!confirm('确定要删除域名 ' + host + ' 吗？')) {
        return;
      }

      // 从配置中移除
      homepageConfig.hosts = homepageConfig.hosts.filter(item => item !== host);
      // 从手动添加的域名列表中移除
      if (homepageConfig.manualHosts) {
        homepageConfig.manualHosts = homepageConfig.manualHosts.filter(item => item !== host);
      }

      // 重新渲染列表
      loadHomepageDisplayConfig();
      showToast('域名已删除', 'success');
    }

    async function saveHomepageDisplayConfig() {
      try {
        showLoading();
        // 只保存需要的字段
        const configToSave = {
          sources: homepageConfig.sources,
          groups: homepageConfig.groups,
          hosts: homepageConfig.hosts,
          hasHeaders: homepageConfig.hasHeaders,
          manualHosts: homepageConfig.manualHosts || [] // 保存手动添加的域名列表
        };
        const result = await apiRequest('/homepage-display', {
          method: 'POST',
          body: JSON.stringify(configToSave),
          showLoading: false
        });

        if (result.success) {
          showToast('首页展示配置已保存', 'success');
        } else {
          showToast('保存配置失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('保存配置失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // 系统设置管理
    async function loadSystemConfig() {
      try {
        showLoading();
        const data = await apiRequest('/system-config', { showLoading: false });

        if (data.success && data.config) {
          document.getElementById('enableMemberAdFree').checked = data.config.member_ad_free_enabled !== undefined ? data.config.member_ad_free_enabled : true;
        } else {
          showToast('加载配置失败', 'error');
        }
      } catch (error) {
        showToast('加载配置失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function saveSystemConfig() {
      try {
        showLoading();
        const config = {
          member_ad_free_enabled: document.getElementById('enableMemberAdFree').checked
        };

        const result = await apiRequest('/system-config', {
          method: 'POST',
          body: JSON.stringify(config),
          showLoading: false
        });

        if (result.success) {
          showToast('系统配置已保存', 'success');
        } else {
          showToast('保存配置失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('保存配置失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // ========== 公告管理 ==========

    // 公告模板
    const announcementTemplates = {
      update: {
        title: '📣 系统更新通知',
        content: '<p>系统已完成重要更新，本次更新包含：</p><p><strong>✨ 新增功能：</strong></p><ul><li>优化播放体验，提升加载速度</li><li>修复已知问题，提升稳定性</li></ul><p>如有问题，请联系客服。</p>'
      },
      maintenance: {
        title: '🔧 系统维护通知',
        content: '<p>系统将于 <strong>YYYY-MM-DD HH:MM</strong> 进行维护升级。</p><p>维护期间，部分功能可能无法正常使用，预计维护时间 <strong>X 小时</strong>。</p><p>给您带来的不便，敬请谅解！</p><p>维护完成后，系统会自动恢复正常服务。</p>'
      },
      feature: {
        title: '🎉 新功能上线',
        content: '<p>为了给您带来更好的使用体验，我们隆重推出新功能！</p><p><strong>✨ 本次更新亮点：</strong></p><ul><li>支持更多频道源</li><li>优化播放性能</li><li>全新的用户界面</li></ul><p>快来体验新功能吧！</p>'
      },
      notice: {
        title: '⚠️ 重要提示',
        content: '<p><strong>重要通知：</strong></p><p>1. 请勿分享账号信息给他人</p><p>2. 注意保护个人隐私</p><p>3. 如发现异常情况，请及时联系客服</p><p>感谢您的配合！</p>'
      },
      custom: {
        title: '',
        content: ''
      }
    };

    // 加载公告
    async function loadAnnouncement() {
      try {
        showLoading();
        const result = await apiRequest('/announcement', { showLoading: false });

        if (result.success && result.data) {
          const announcementData = result.data;
          document.getElementById('announcementTitleInput').value = announcementData.title || '';
          document.getElementById('announcementContentInput').value = announcementData.content || '';
          document.getElementById('announcementEnabled').checked = announcementData.enabled === 1;
          document.getElementById('announcementFrequency').value = announcementData.display_frequency || 'once';
        } else {
          // 清空表单
          document.getElementById('announcementTitleInput').value = '';
          document.getElementById('announcementContentInput').value = '';
          document.getElementById('announcementEnabled').checked = false;
          document.getElementById('announcementFrequency').value = 'once';
          document.getElementById('announcementTemplate').value = '';
        }
      } catch (error) {
        showToast('加载公告失败: ' + (error.error || '未知错误'), 'error');
      } finally {
        hideLoading();
      }
    }

    // 保存公告
    async function saveAnnouncement() {
      try {
        showLoading();

        const title = document.getElementById('announcementTitleInput').value.trim();
        const content = document.getElementById('announcementContentInput').value.trim();
        const enabled = document.getElementById('announcementEnabled').checked;
        const displayFrequency = document.getElementById('announcementFrequency').value;

        if (!title) {
          showToast('请输入公告标题', 'error');
          hideLoading();
          return;
        }

        if (!content) {
          showToast('请输入公告内容', 'error');
          hideLoading();
          return;
        }

        // 先获取现有公告
        const getResult = await apiRequest('/announcement', { showLoading: false });
        const data = {
          title,
          content,
          enabled,
          display_frequency: displayFrequency
        };

        // 如果已有公告，则更新
        if (getResult.success && getResult.data) {
          data.id = getResult.data.id;
        }

        const result = await apiRequest('/announcement', {
          method: 'POST',
          body: JSON.stringify(data),
          showLoading: false
        });

        if (result.success) {
          showToast('公告保存成功', 'success');
        } else {
          showToast('保存公告失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('保存公告失败: ' + (error.error || '未知错误'), 'error');
      } finally {
        hideLoading();
      }
    }

    // 应用公告模板
    function applyAnnouncementTemplate() {
      const templateKey = document.getElementById('announcementTemplate').value;

      if (templateKey && announcementTemplates[templateKey]) {
        const template = announcementTemplates[templateKey];
        document.getElementById('announcementTitleInput').value = template.title;
        document.getElementById('announcementContentInput').value = template.content;
      }
    }

    // 缓存管理
    async function loadCacheStatus() {
      try {
        const statusDiv = document.getElementById('cacheStatusInfo');
        statusDiv.innerHTML = '<div style="color:#86868b;">加载中...</div>';

        const data = await apiRequest('/cache/status', { showLoading: false });

        if (data.success) {
          const hasCache = data.channelsCached || data.groupsCached;
          let html = '';

          if (hasCache) {
            html = '<div style="color:#2e7d32;">✓ 缓存状态：</div>';
            if (data.channelsCached) {
              html += '<div style="margin-top:8px;">• 频道数据：<span style="color:#0071e3;font-weight:600;">已缓存 (' + (data.channelsCount || 0) + ' 个)</span></div>';
            } else {
              html += '<div style="margin-top:8px;">• 频道数据：<span style="color:#ff9800;">未缓存</span></div>';
            }
            if (data.groupsCached) {
              html += '<div style="margin-top:4px;">• 分组列表：<span style="color:#0071e3;font-weight:600;">已缓存 (' + (data.groupsCount || 0) + ' 个)</span></div>';
            } else {
              html += '<div style="margin-top:4px;">• 分组列表：<span style="color:#ff9800;">未缓存</span></div>';
            }
            if (data.cachedAt) {
              const cachedTime = new Date(data.cachedAt);
              html += '<div style="margin-top:8px;font-size:12px;color:#86868b;">缓存时间：' + cachedTime.toLocaleString('zh-CN') + '</div>';
            }
            if (data.version) {
              html += '<div style="margin-top:4px;font-size:12px;color:#86868b;">缓存版本：' + data.version + '</div>';
            }
          } else {
            html = '<div style="color:#ff9800;">⚠ 缓存状态：</div>';
            html += '<div style="margin-top:8px;">当前无缓存数据，请点击"刷新缓存"按钮</div>';
          }

          statusDiv.innerHTML = html;
        } else {
          statusDiv.innerHTML = '<div style="color:#ff3b30;">加载缓存状态失败</div>';
        }
      } catch (error) {
        console.error('加载缓存状态失败:', error);
        const statusDiv = document.getElementById('cacheStatusInfo');
        statusDiv.innerHTML = '<div style="color:#ff3b30;">加载缓存状态失败: ' + (error.error || '未知错误') + '</div>';
      }
    }

    async function refreshCache() {
      if (!confirm('确定要刷新频道缓存吗？\\n\\n此操作将从数据库读取所有频道数据并缓存到KV存储中。')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/cache/refresh', {
          method: 'POST',
          showLoading: false
        });

        if (result.success) {
          showToast('缓存刷新成功：' + (result.channels || 0) + ' 个频道，' + (result.groups || 0) + ' 个分组', 'success');
          // 刷新缓存状态显示
          await loadCacheStatus();
        } else {
          showToast('缓存刷新失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('缓存刷新失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function clearCache() {
      if (!confirm('确定要清空频道缓存吗？\\n\\n⚠️ 注意：清空后，首页和播放请求将从数据库读取数据，可能会导致加载速度变慢。')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/cache/clear', {
          method: 'POST',
          showLoading: false
        });

        if (result.success) {
          showToast('缓存已清空', 'success');
          // 刷新缓存状态显示
          await loadCacheStatus();
        } else {
          showToast('缓存清空失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showToast('缓存清空失败: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // ========== 广告TS文件管理 ==========
    async function loadAdTsFiles() {
      try {
        const result = await apiRequest('/ad-ts', { method: 'GET', showLoading: false });

        if (result.success && result.files) {
          window.adTsFiles = result.files;
          const tbody = document.getElementById('adTsTable');
          tbody.innerHTML = '';

          if (result.files.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:#86868b;">暂无广告文件</td></tr>';
            return;
          }

          result.files.forEach(file => {
            const sizeKB = Math.round(file.content.length * 0.75 / 1024 * 100) / 100;
            const isActive = file.is_active === 1;
            const tr = document.createElement('tr');

            const statusHtml = isActive
              ? '<span class="badge badge-success">活跃</span>'
              : '<span class="badge">未启用</span>';

            const actionHtml = isActive
              ? '<button class="btn btn-warning btn-sm" onclick="disableAdTs(' + file.id + ')">禁用</button>'
              : '<button class="btn btn-primary btn-sm" onclick="setActiveAd(' + file.id + ')">启用</button>';

            tr.innerHTML = '<td>' + file.id + '</td>' +
              '<td>' + escapeHtml(file.name) + '</td>' +
              '<td>' + escapeHtml(file.ad_type || 'normal') + '</td>' +
              '<td>' + escapeHtml(file.description || '') + '</td>' +
              '<td>' + sizeKB + ' KB</td>' +
              '<td>' + statusHtml + '</td>' +
              '<td>' + formatDateTime(file.created_at) + '</td>' +
              '<td>' + formatDateTime(file.updated_at) + '</td>' +
              '<td>' +
                '<div class="action-buttons">' +
                  actionHtml +
                  '<button class="btn btn-danger btn-sm" onclick="deleteAdTs(' + file.id + ')">删除</button>' +
                '</div>' +
              '</td>';

            tbody.appendChild(tr);
          });
        } else {
          showToast('加载广告文件列表失败', 'error');
        }
      } catch (error) {
        console.error('加载广告文件列表失败:', error);
        showToast('加载广告文件列表失败', 'error');
      }
    }

    function showUploadAdModal() {
      const modalHtml = '<div id="uploadAdModal" class="modal active">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<h3>添加广告</h3>' +
            '<button class="close-btn" onclick="closeUploadAdModal()">&times;</button>' +
          '</div>' +
          '<div style="padding:20px;">' +
            '<div class="form-group">' +
              '<label>广告名称</label>' +
              '<input type="text" id="adFileName" placeholder="例如：2024新年广告" style="width:100%;">' +
            '</div>' +
            '<div class="form-group">' +
              '<label>广告类型</label>' +
              '<select id="adType" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">' +
                '<option value="normal">普通广告</option>' +
                '<option value="notice">通知类广告</option>' +
                '<option value="promotion">促销广告</option>' +
                '<option value="other">其他</option>' +
              '</select>' +
            '</div>' +
            '<div class="form-group">' +
              '<label>广告描述</label>' +
              '<input type="text" id="adDescription" placeholder="例如：春节促销活动" style="width:100%;">' +
            '</div>' +
            '<div class="form-group">' +
              '<label>广告来源 (二选一)</label>' +
              '<div style="display:flex;gap:8px;align-items:center;margin-top:8px;">' +
                '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;">' +
                  '<input type="radio" name="adSource" value="upload" checked onclick="toggleAdSource(&quot;upload&quot;)"> 上传TS文件' +
                '</label>' +
                '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;">' +
                  '<input type="radio" name="adSource" value="remote" onclick="toggleAdSource(&quot;remote&quot;)"> 远程URL' +
                '</label>' +
              '</div>' +
            '</div>' +
            '<div id="uploadSection">' +
              '<div class="form-group">' +
                '<label>选择TS文件</label>' +
                '<input type="file" id="adTsFile" accept=".ts" style="width:100%;">' +
                '<small style="color:#86868b;font-size:12px;margin-top:4px;display:block;">' +
                  ' 支持.ts格式，建议文件大小不超过800KB' +
                '</small>' +
              '</div>' +
            '</div>' +
            '<div id="remoteSection" style="display:none;">' +
              '<div class="form-group">' +
                '<label>远程广告URL</label>' +
                '<input type="url" id="adRemoteUrl" placeholder="https://example.com/ad.ts" style="width:100%;">' +
                '<small style="color:#86868b;font-size:12px;margin-top:4px;display:block;">' +
                  ' 输入广告TS文件的直接下载链接' +
                '</small>' +
              '</div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label>' +
                '<input type="checkbox" id="adIsActive" checked style="margin-right:8px;">' +
                '启用广告' +
              '</label>' +
            '</div>' +
            '<div class="modal-footer">' +
              '<button class="btn" onclick="closeUploadAdModal()">取消</button>' +
              '<button class="btn btn-primary" onclick="uploadAdTs()">保存</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function toggleAdSource(source) {
      document.getElementById('uploadSection').style.display = source === 'upload' ? 'block' : 'none';
      document.getElementById('remoteSection').style.display = source === 'remote' ? 'block' : 'none';
    }

    function closeUploadAdModal() {
      const modal = document.getElementById('uploadAdModal');
      if (modal) {
        modal.remove();
      }
    }

    async function uploadAdTs() {
      const fileInput = document.getElementById('adTsFile');
      const nameInput = document.getElementById('adFileName');
      const typeInput = document.getElementById('adType');
      const descInput = document.getElementById('adDescription');
      const activeInput = document.getElementById('adIsActive');
      const remoteUrlInput = document.getElementById('adRemoteUrl');

      // 获取选择的广告来源
      const sourceRadio = document.querySelector('input[name="adSource"]:checked');
      const source = sourceRadio ? sourceRadio.value : 'upload';

      const name = nameInput ? nameInput.value : '';
      const adType = typeInput ? typeInput.value : 'normal';
      const description = descInput ? descInput.value : '';
      const isActive = activeInput ? activeInput.checked : true;
      const remoteUrl = remoteUrlInput ? remoteUrlInput.value.trim() : '';

      // 验证：必须选择其一
      if (source === 'upload') {
        if (!fileInput.files || fileInput.files.length === 0) {
          showToast('请选择TS文件', 'error');
          return;
        }
        const file = fileInput.files[0];
        if (!file.name.endsWith('.ts')) {
          showToast('只支持.ts格式的文件', 'error');
          return;
        }
      } else if (source === 'remote') {
        if (!remoteUrl) {
          showToast('请输入远程广告URL', 'error');
          return;
        }
        // 简单验证URL格式
        try {
          new URL(remoteUrl);
        } catch (e) {
          showToast('远程URL格式无效', 'error');
          return;
        }
      }

      try {
        showLoading();

        const formData = new FormData();

        if (source === 'upload') {
          const file = fileInput.files[0];
          formData.append('file', file);
          formData.append('name', name || file.name);
        } else {
          formData.append('name', name || '远程广告');
        }

        formData.append('ad_type', adType);
        formData.append('description', description);
        formData.append('is_active', isActive.toString());
        formData.append('remote_url', remoteUrl);

        const response = await fetch('/admin/ad-ts/upload', {
          method: 'POST',
          headers: {
            'X-Admin-Key': adminKey
          },
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          showToast(source === 'remote' ? '远程广告添加成功' : '广告上传成功', 'success');
          closeUploadAdModal();
          // 刷新列表
          await loadAdTsFiles();
        } else {
          showToast('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('广告操作失败:', error);
        showToast('操作失败: ' + (error.message || '未知错误'), 'error');
      } finally {
        hideLoading();
      }
    }

    async function setActiveAd(id) {
      if (!confirm('确定要启用此广告吗？\\n\\n启用后，未授权IP可能会播放此广告。')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/ad-ts/update?id=' + id, {
          method: 'PUT',
          showLoading: false
        });

        if (result.success) {
          showToast('广告已启用', 'success');
          await loadAdTsFiles();
        } else {
          showToast('启用失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('启用广告失败:', error);
        showToast('启用失败: ' + (error.error || '未知错误'), 'error');
      } finally {
        hideLoading();
      }
    }

    async function disableAdTs(id) {
      if (!confirm('确定要禁用此广告吗？\\n\\n禁用后，未授权IP将不会播放此广告。')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/ad-ts/disable?id=' + id, {
          method: 'PUT',
          showLoading: false
        });

        if (result.success) {
          showToast('广告已禁用', 'success');
          await loadAdTsFiles();
        } else {
          showToast('禁用失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('禁用广告失败:', error);
        showToast('禁用失败: ' + (error.error || '未知错误'), 'error');
      } finally {
        hideLoading();
      }
    }

    // ========== 广告绑定管理 ==========

    async function loadAdBindings() {
      try {
        showLoading();
        const result = await apiRequest('/ad-bindings', { showLoading: false });

        if (result.success) {
          window.adBindings = result.bindings || [];
          renderAdBindings(window.adBindings);
        } else {
          showToast('加载广告绑定列表失败', 'error');
        }
      } catch (error) {
        console.error('加载广告绑定失败:', error);
        showToast('加载广告绑定列表失败', 'error');
      } finally {
        hideLoading();
      }
    }

    function renderAdBindings(bindings) {
      const tbody = document.getElementById('adBindingTable');
      if (!bindings || bindings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#86868b;">暂无广告绑定</td></tr>';
        return;
      }

      tbody.innerHTML = bindings.map(binding => {
        return '<tr>' +
          '<td>' + binding.id + '</td>' +
          '<td>' + escapeHtml(binding.action_type_label) + '</td>' +
          '<td>' + escapeHtml(binding.ad_name || '不播放广告') + '</td>' +
          '<td>' + escapeHtml(binding.cooldown_display) + '</td>' +
          '<td>' + binding.priority + '</td>' +
          '<td>' + formatDateTime(binding.created_at) + '</td>' +
          '<td>' +
            '<button class="btn btn-sm" onclick="editAdBinding(' + binding.id + ')">编辑</button> ' +
            '<button class="btn btn-danger btn-sm" onclick="deleteAdBinding(' + binding.id + ')">删除</button>' +
          '</td>' +
          '</tr>';
      }).join('');
    }

    function showAdBindingModal(binding = null) {
      const actionTypeOptions = [
        { value: 'vip_expired', label: 'VIPtoken过期' },
        { value: 'free_normal', label: '免费token正常播放' },
        { value: 'free_expired', label: '免费token过期' },
        { value: 'fav_normal', label: '收藏token正常播放' },
        { value: 'fav_expired', label: '收藏token过期' },
        { value: 'old_route_normal', label: '旧路由正常播放' }
      ];

      let adOptions = '<option value="">不播放广告</option>';
      if (window.adTsFiles && window.adTsFiles.length > 0) {
        window.adTsFiles.forEach(ad => {
          const selected = binding && binding.ad_id === ad.id ? 'selected' : '';
          adOptions += '<option value="' + ad.id + '" ' + selected + '>' + escapeHtml(ad.name) + '</option>';
        });
      }

      const modalHtml = '<div id="adBindingModal" class="modal active">' +
        '<div class="modal-overlay" onclick="hideAdBindingModal()">' +
          '<div class="modal-content" onclick="event.stopPropagation()">' +
            '<h3>' + (binding ? '编辑广告绑定' : '添加广告绑定') + '</h3>' +
            '<div class="form-group">' +
              '<label>操作类型</label>' +
              '<select id="bindingActionType" class="filter-select" style="width:100%;">' +
                '<option value="">-- 请选择 --</option>' +
                actionTypeOptions.map(opt =>
                  '<option value="' + opt.value + '" ' + (binding && binding.action_type === opt.value ? 'selected' : '') + '>' +
                    opt.label +
                  '</option>'
                ).join('') +
              '</select>' +
            '</div>' +
            '<div class="form-group">' +
              '<label>绑定广告（可选）</label>' +
              '<select id="bindingAdId" class="filter-select" style="width:100%;">' +
                adOptions +
              '</select>' +
              '<p style="margin-top:8px;color:#86868b;font-size:12px;">选择要绑定的广告，留空则不播放广告</p>' +
            '</div>' +
            '<div class="form-group">' +
              '<label>冷却时间（秒）</label>' +
              '<input type="number" id="bindingCooldown" value="' + (binding ? binding.cooldown_seconds : 0) + '" min="0" placeholder="0表示不限制" style="width:100%;">' +
              '<p style="margin-top:8px;color:#86868b;font-size:12px;">同一IP在指定时间内不会重复看到此类型广告，设置为0表示不限制</p>' +
            '</div>' +
            '<div class="form-group">' +
              '<label>优先级</label>' +
              '<input type="number" id="bindingPriority" value="' + (binding ? binding.priority : 0) + '" min="0" max="100" placeholder="数字越大优先级越高" style="width:100%;">' +
              '<p style="margin-top:8px;color:#86868b;font-size:12px;">优先级，数字越大优先级越高</p>' +
            '</div>' +
            '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">' +
              '<button class="btn" onclick="hideAdBindingModal()">取消</button>' +
              '<button class="btn btn-primary" onclick="saveAdBinding(' + (binding ? binding.id : '') + ')">保存</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

      const existingModal = document.getElementById('adBindingModal');
      if (existingModal) {
        existingModal.remove();
      }
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function hideAdBindingModal() {
      const modal = document.getElementById('adBindingModal');
      if (modal) {
        modal.remove();
      }
    }

    async function saveAdBinding(id) {
      const actionType = document.getElementById('bindingActionType').value;
      const adId = document.getElementById('bindingAdId').value;
      const cooldown = parseInt(document.getElementById('bindingCooldown').value, 10);
      const priority = parseInt(document.getElementById('bindingPriority').value, 10);

      if (!actionType) {
        showToast('请选择操作类型', 'error');
        return;
      }

      if (isNaN(cooldown) || cooldown < 0) {
        showToast('冷却时间必须大于等于0', 'error');
        return;
      }

      if (isNaN(priority) || priority < 0) {
        showToast('优先级必须大于等于0', 'error');
        return;
      }

      try {
        showLoading();
        const url = id ? '/ad-bindings/update?id=' + id : '/ad-bindings/create';
        const method = id ? 'PUT' : 'POST';
        const result = await apiRequest(url, {
          method: method,
          body: JSON.stringify({
            action_type: actionType,
            ad_id: adId ? parseInt(adId, 10) : null,
            cooldown_seconds: cooldown,
            priority: priority
          }),
          showLoading: false
        });

        if (result.success) {
          showToast('保存成功', 'success');
          hideAdBindingModal();
          await loadAdBindings();
        } else {
          showToast('保存失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('保存广告绑定失败:', error);
        showToast('保存失败: ' + (error.error || '未知错误'), 'error');
      } finally {
        hideLoading();
      }
    }

    function editAdBinding(id) {
      const binding = window.adBindings && window.adBindings.find(b => b.id === id);
      if (binding) {
        showAdBindingModal(binding);
      }
    }

    async function deleteAdBinding(id) {
      if (!confirm('确定要删除此广告绑定吗？')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/ad-bindings/delete?id=' + id, {
          method: 'DELETE',
          showLoading: false
        });

        if (result.success) {
          showToast('删除成功', 'success');
          await loadAdBindings();
        } else {
          showToast('删除失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('删除广告绑定失败:', error);
        showToast('删除失败: ' + (error.error || '未知错误'), 'error');
      } finally {
        hideLoading();
      }
    }

    async function deleteAdTs(id) {
      if (!confirm('确定要删除此广告文件吗？\\n\\n删除后将无法恢复。')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/ad-ts/delete?id=' + id, {
          method: 'DELETE',
          showLoading: false
        });

        if (result.success) {
          showToast('广告已删除', 'success');
          await loadAdTsFiles();
        } else {
          showToast('删除失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('删除广告失败:', error);
        showToast('删除失败: ' + (error.error || '未知错误'), 'error');
      } finally {
        hideLoading();
      }
    }

    function formatDateTime(dateStr) {
      if (!dateStr) return '-';
      const date = new Date(dateStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // ========== 用户管理相关函数 ==========
    let userPage = 1;
    let userPageSize = 20;
    let totalUserPages = 1;
    let totalUsers = 0;

    async function loadUsers() {
      const response = await fetch(API_BASE + '/users?page=' + userPage + '&pageSize=' + userPageSize + '&search=' + encodeURIComponent(document.getElementById('userSearch').value), {
        headers: { 'X-Admin-Key': adminKey }
      });
      const data = await response.json();
      if (data.success) {
        totalUsers = data.pagination.total;
        totalUserPages = data.pagination.totalPages;
        renderUsers(data.users);
        renderUserPagination();
      }
    }

    function renderUsers(users) {
      const tbody = document.getElementById('usersTableBody');
      if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:#86868b;">暂无用户数据</td></tr>';
        return;
      }
      tbody.innerHTML = users.map(user => {
        const createdDate = new Date(user.created_at);
        return \`
          <tr style="border-bottom:1px solid #e5e5ea;">
            <td style="padding:12px;">\${user.id}</td>
            <td style="padding:12px;">\${escapeHtml(user.email)}</td>
            <td style="padding:12px;">
              <span style="padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600;background:\${user.is_verified ? '#e8f5e9' : '#ffebee'};color:\${user.is_verified ? '#1b5e20' : '#c62828'};">
                \${user.is_verified ? '已验证' : '未验证'}
              </span>
            </td>
            <td style="padding:12px;">\${formatDateTime(createdDate)}</td>
            <td style="padding:12px;">
              <button class="btn" onclick="toggleUserVerification(\${user.id}, \${user.is_verified})" style="padding:4px 12px;font-size:12px;">
                \${user.is_verified ? '取消验证' : '通过验证'}
              </button>
              <button class="btn" onclick="deleteUser(\${user.id})" style="padding:4px 12px;font-size:12px;background:#f44336;color:white;">删除</button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function renderUserPagination() {
      const container = document.getElementById('usersPagination');
      if (totalUserPages <= 1) {
        container.innerHTML = '';
        return;
      }
      let html = \`<span class="pagination-info">共 \${totalUsers} 个用户，第 \${userPage}/\${totalUserPages} 页</span>\`;
      html += \`<button onclick="goToUserPage(1)" \${userPage === 1 ? 'disabled' : ''}>首页</button>\`;
      html += \`<button onclick="goToUserPage(\${userPage - 1})" \${userPage === 1 ? 'disabled' : ''}>上一页</button>\`;
      const maxButtons = 5;
      let startPage = Math.max(1, userPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalUserPages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToUserPage(\${i})" class="\${i === userPage ? 'active' : ''}">\${i}</button>\`;
      }
      html += \`<button onclick="goToUserPage(\${userPage + 1})" \${userPage === totalUserPages ? 'disabled' : ''}>下一页</button>\`;
      html += \`<button onclick="goToUserPage(\${totalUserPages})" \${userPage === totalUserPages ? 'disabled' : ''}>末页</button>\`;
      container.innerHTML = html;
    }

    function goToUserPage(page) {
      if (page < 1 || page > totalUserPages || page === userPage) return;
      userPage = page;
      loadUsers();
    }

    async function toggleUserVerification(id, currentStatus) {
      if (!confirm(\`确定要\${currentStatus ? '取消验证' : '通过验证'}此用户吗？\`)) return;
      const response = await fetch(API_BASE + '/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
        body: JSON.stringify({ id, is_verified: !currentStatus })
      });
      const data = await response.json();
      if (data.success) {
        showToast('用户状态更新成功', 'success');
        loadUsers();
      } else {
        showToast(data.error || '操作失败', 'error');
      }
    }

    async function deleteUser(id) {
      if (!confirm('确定要删除此用户吗？此操作不可恢复！')) return;
      const response = await fetch(API_BASE + '/users?id=' + id, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey }
      });
      const data = await response.json();
      if (data.success) {
        showToast('用户删除成功', 'success');
        loadUsers();
      } else {
        showToast(data.error || '删除失败', 'error');
      }
    }

    let userSearchTimeout = null;
    function handleUserSearch() {
      clearTimeout(userSearchTimeout);
      userSearchTimeout = setTimeout(() => {
        userPage = 1;
        loadUsers();
      }, 300);
    }

    // ========== 订单管理相关函数 ==========
    let orderPage = 1;
    let orderPageSize = 20;
    let totalOrderPages = 1;
    let totalOrders = 0;

    async function loadOrders() {
      const userFilter = document.getElementById('orderUserFilter').value;
      let url = API_BASE + '/orders?page=' + orderPage + '&pageSize=' + orderPageSize;
      if (userFilter) url += '&email=' + encodeURIComponent(userFilter);
      const response = await fetch(url, {
        headers: { 'X-Admin-Key': adminKey }
      });
      const data = await response.json();
      if (data.success) {
        totalOrders = data.pagination.total;
        totalOrderPages = data.pagination.totalPages;
        renderOrders(data.orders);
        renderOrderPagination();
      }
    }

    function renderOrders(orders) {
      const tbody = document.getElementById('ordersTableBody');
      if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:20px;color:#86868b;">暂无订单数据</td></tr>';
        return;
      }
      const baseUrl = window.location.origin;
      tbody.innerHTML = orders.map(order => {
        const createdDate = new Date(order.created_at);
        const statusClass = {
          'completed': '#e8f5e9',
          'pending': '#fff3e0',
          'cancelled': '#ffebee'
        }[order.status] || '#f5f5f7';
        const statusText = {
          'completed': '已完成',
          'pending': '待处理',
          'cancelled': '已取消'
        }[order.status] || order.status;
        const subUrl = order.code ? \`\${baseUrl}/sub/\${order.code}.m3u\` : '-';
        return \`
          <tr style="border-bottom:1px solid #e5e5ea;">
            <td style="padding:12px;">\${escapeHtml(order.order_id)}</td>
            <td style="padding:12px;">\${escapeHtml(order.email)}</td>
            <td style="padding:12px;">\${order.code ? escapeHtml(order.code) : '-'}</td>
            <td style="padding:12px;font-size:12px;word-break:break-all;max-width:250px;">\${subUrl}</td>
            <td style="padding:12px;">\${order.duration_days ? order.duration_days + ' 天' : '-'}</td>
            <td style="padding:12px;">\${order.amount ? '$' + order.amount.toFixed(2) : '-'}</td>
            <td style="padding:12px;">
              <span style="padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600;background:\${statusClass};">
                \${statusText}
              </span>
            </td>
            <td style="padding:12px;">\${formatDateTime(createdDate)}</td>
          </tr>
        \`;
      }).join('');
    }

    function renderOrderPagination() {
      const container = document.getElementById('ordersPagination');
      if (totalOrderPages <= 1) {
        container.innerHTML = '';
        return;
      }
      let html = \`<span class="pagination-info">共 \${totalOrders} 个订单，第 \${orderPage}/\${totalOrderPages} 页</span>\`;
      html += \`<button onclick="goToOrderPage(1)" \${orderPage === 1 ? 'disabled' : ''}>首页</button>\`;
      html += \`<button onclick="goToOrderPage(\${orderPage - 1})" \${orderPage === 1 ? 'disabled' : ''}>上一页</button>\`;
      const maxButtons = 5;
      let startPage = Math.max(1, orderPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalOrderPages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToOrderPage(\${i})" class="\${i === orderPage ? 'active' : ''}">\${i}</button>\`;
      }
      html += \`<button onclick="goToOrderPage(\${orderPage + 1})" \${orderPage === totalOrderPages ? 'disabled' : ''}>下一页</button>\`;
      html += \`<button onclick="goToOrderPage(\${totalOrderPages})" \${orderPage === totalOrderPages ? 'disabled' : ''}>末页</button>\`;
      container.innerHTML = html;
    }

    function goToOrderPage(page) {
      if (page < 1 || page > totalOrderPages || page === orderPage) return;
      orderPage = page;
      loadOrders();
    }

    let orderFilterTimeout = null;
    function filterOrders() {
      clearTimeout(orderFilterTimeout);
      orderFilterTimeout = setTimeout(() => {
        orderPage = 1;
        loadOrders();
      }, 300);
    }

    // ========== 商城管理相关函数 ==========

    // 订阅套餐管理
    async function loadPlans() {
      try {
        const response = await fetch(API_BASE + '/mall/plans', {
          headers: { 'X-Admin-Key': adminKey }
        });
        const data = await response.json();
        if (data.success) {
          renderPlans(data.plans || []);
        }
      } catch (error) {
        console.error('Failed to load plans:', error);
      }
    }

    function renderPlans(plans) {
      const tbody = document.getElementById('plansTableBody');
      if (plans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:20px;color:#86868b;">暂无套餐数据</td></tr>';
        return;
      }
      tbody.innerHTML = plans.map(plan => {
        const statusClass = plan.is_enabled ? 'badge-success' : 'badge-danger';
        const statusText = plan.is_enabled ? '已启用' : '已禁用';
        const daysText = plan.days === -1 ? '永久' : plan.days + ' 天';
        return \`
          <tr>
            <td>\${plan.id}</td>
            <td>
              <div>\${escapeHtml(plan.name)}</div>
              <div style="font-size:12px;color:#86868b;">\${escapeHtml(plan.name_en || '')}</div>
            </td>
            <td>\${daysText}</td>
            <td>¥\${parseFloat(plan.base_price).toFixed(2)}</td>
            <td>¥\${parseFloat(plan.price_per_ip).toFixed(2)}</td>
            <td>\${plan.discount}%</td>
            <td>\${plan.sort_order}</td>
            <td><span class="badge \${statusClass}">\${statusText}</span></td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="editPlan(\${plan.id})">编辑</button>
                <button class="btn btn-sm \${plan.is_enabled ? 'btn-danger' : 'btn-success'}" onclick="togglePlan(\${plan.id}, \${!plan.is_enabled})">
                  \${plan.is_enabled ? '禁用' : '启用'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePlan(\${plan.id})">删除</button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function showPlanModal() {
      document.getElementById('planModalTitle').textContent = '添加订阅套餐';
      document.getElementById('planId').value = '';
      document.getElementById('planName').value = '';
      document.getElementById('planNameEn').value = '';
      document.getElementById('planDays').value = '30';
      document.getElementById('planBasePrice').value = '20';
      document.getElementById('planPricePerIP').value = '9';
      document.getElementById('planDiscount').value = '0';
      document.getElementById('planSortOrder').value = '1';
      document.getElementById('planEnabled').checked = true;
      document.getElementById('planModal').classList.add('active');
    }

    function closePlanModal() {
      document.getElementById('planModal').classList.remove('active');
    }

    function editPlan(id) {
      fetch(API_BASE + '/mall/plans', {
        headers: { 'X-Admin-Key': adminKey }
      }).then(res => res.json()).then(data => {
        if (data.success) {
          const plan = data.plans.find(p => p.id === id);
          if (plan) {
            document.getElementById('planModalTitle').textContent = '编辑订阅套餐';
            document.getElementById('planId').value = plan.id;
            document.getElementById('planName').value = plan.name;
            document.getElementById('planNameEn').value = plan.name_en || '';
            document.getElementById('planDays').value = plan.days;
            document.getElementById('planBasePrice').value = plan.base_price;
            document.getElementById('planPricePerIP').value = plan.price_per_ip;
            document.getElementById('planDiscount').value = plan.discount;
            document.getElementById('planSortOrder').value = plan.sort_order;
            document.getElementById('planEnabled').checked = plan.is_enabled ? true : false;
            document.getElementById('planModal').classList.add('active');
          }
        }
      });
    }

    async function savePlan() {
      const id = document.getElementById('planId').value;
      const name = document.getElementById('planName').value.trim();
      const nameEn = document.getElementById('planNameEn').value.trim();
      const days = parseInt(document.getElementById('planDays').value);
      const basePrice = parseFloat(document.getElementById('planBasePrice').value);
      const pricePerIP = parseFloat(document.getElementById('planPricePerIP').value);
      const discount = parseInt(document.getElementById('planDiscount').value);
      const sortOrder = parseInt(document.getElementById('planSortOrder').value);
      const isEnabled = document.getElementById('planEnabled').checked ? 1 : 0;

      if (!name || days === '' || isNaN(basePrice) || isNaN(pricePerIP)) {
        showToast('请填写完整信息', 'error');
        return;
      }

      if (days !== -1 && days < 1) {
        showToast('天数必须大于0，或输入-1表示永久套餐', 'error');
        return;
      }

      try {
        const response = await fetch(API_BASE + '/mall/plans', {
          method: id ? 'PUT' : 'POST',
          headers: {
            'X-Admin-Key': adminKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: id || null,
            name,
            name_en: nameEn || null,
            days,
            base_price: basePrice,
            price_per_ip: pricePerIP,
            discount: discount || 0,
            sort_order: sortOrder || 0,
            is_enabled: isEnabled
          })
        });
        const data = await response.json();
        if (data.success) {
          showToast(id ? '套餐已更新' : '套餐已添加', 'success');
          closePlanModal();
          loadPlans();
        } else {
          showToast('保存失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('Failed to save plan:', error);
        showToast('保存失败', 'error');
      }
    }

    async function togglePlan(id, isEnabled) {
      try {
        const response = await fetch(API_BASE + '/mall/plans/' + id + '/toggle', {
          method: 'PUT',
          headers: {
            'X-Admin-Key': adminKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_enabled: isEnabled ? 1 : 0 })
        });
        const data = await response.json();
        if (data.success) {
          showToast('套餐状态已更新', 'success');
          loadPlans();
        } else {
          showToast('操作失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('Failed to toggle plan:', error);
        showToast('操作失败', 'error');
      }
    }

    async function deletePlan(id) {
      if (!confirm('确定要删除这个套餐吗？')) {
        return;
      }
      try {
        const response = await fetch(API_BASE + '/mall/plans/' + id, {
          method: 'DELETE',
          headers: { 'X-Admin-Key': adminKey }
        });
        const data = await response.json();
        if (data.success) {
          showToast('套餐已删除', 'success');
          loadPlans();
        } else {
          showToast('删除失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('Failed to delete plan:', error);
        showToast('删除失败', 'error');
      }
    }

    async function loadMallSettings() {
      try {
        const response = await fetch(API_BASE + '/mall/settings', {
          headers: { 'X-Admin-Key': adminKey }
        });
        const data = await response.json();
        if (data.success) {
          document.getElementById('mallEnabled').checked = data.settings.mall_enabled === '1';
          document.getElementById('subscriptionEnabled').checked = data.settings.subscription_enabled === '1';
        }
      } catch (error) {
        console.error('Failed to load mall settings:', error);
      }
    }

    async function saveMallSettings() {
      try {
        const response = await fetch(API_BASE + '/mall/settings', {
          method: 'PUT',
          headers: {
            'X-Admin-Key': adminKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mall_enabled: document.getElementById('mallEnabled').checked ? '1' : '0',
            subscription_enabled: document.getElementById('subscriptionEnabled').checked ? '1' : '0'
          })
        });
        const data = await response.json();
        if (data.success) {
          showToast('商城设置已保存', 'success');
        } else {
          showToast('保存失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('Failed to save mall settings:', error);
        showToast('保存失败', 'error');
      }
    }

    async function loadPaymentMethods() {
      try {
        const response = await fetch(API_BASE + '/mall/payment-methods', {
          headers: { 'X-Admin-Key': adminKey }
        });
        const data = await response.json();
        if (data.success) {
          renderPaymentMethods(data.payment_methods || []);
        }
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      }
    }

    function renderPaymentMethods(methods) {
      const tbody = document.getElementById('paymentMethodsTableBody');
      if (methods.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#86868b;">暂无支付方式</td></tr>';
        return;
      }
      tbody.innerHTML = methods.map(method => {
        const statusClass = method.enabled ? 'badge-success' : 'badge-danger';
        const statusText = method.enabled ? '已启用' : '已禁用';
        let configText = '未配置';
        try {
          const config = typeof method.config === 'string' ? JSON.parse(method.config) : method.config;
          configText = config && Object.keys(config).length > 0 ? '已配置' : '未配置';
        } catch (e) {
          console.error('Failed to parse config:', e);
        }
        return \`
          <tr>
            <td>\${method.id}</td>
            <td>\${method.name}</td>
            <td>\${method.type}</td>
            <td><span class="badge \${statusClass}">\${statusText}</span></td>
            <td>\${configText}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm \${method.enabled ? 'btn-danger' : 'btn-success'}" onclick="togglePaymentMethod(\${method.id}, \${!method.enabled})">
                  \${method.enabled ? '禁用' : '启用'}
                </button>
                <button class="btn btn-sm btn-primary" onclick="editPaymentMethod(\${method.id})">配置</button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function showPaymentMethodModal() {
      document.getElementById('paymentMethodModalTitle').textContent = '添加支付方式';
      document.getElementById('paymentMethodId').value = '';
      document.getElementById('paymentType').value = 'alipay';
      document.getElementById('paymentName').value = '';
      document.getElementById('paymentEnabled').checked = true;
      
      // 重置所有配置字段
      document.getElementById('appId').value = '';
      document.getElementById('appSecret').value = '';
      document.getElementById('gatewayUrl').value = '';
      document.getElementById('paypalClientId').value = '';
      document.getElementById('paypalClientSecret').value = '';
      document.getElementById('paypalMode').value = 'sandbox';
      document.getElementById('coinbaseApiKey').value = '';
      document.getElementById('coinbaseWebhookSecret').value = '';
      document.getElementById('coinbaseAutoConvert').value = 'usdc';
      document.getElementById('cryptoNetwork').value = 'trc20';
      document.getElementById('cryptoWalletAddress').value = '';
      
      // 默认显示虎皮椒配置
      updatePaymentConfigFields();
      
      document.getElementById('paymentMethodModal').classList.add('active');
    }

    function closePaymentMethodModal() {
      document.getElementById('paymentMethodModal').classList.remove('active');
    }

    // 根据支付类型动态更新配置字段显示
    function updatePaymentConfigFields() {
      const paymentType = document.getElementById('paymentType').value;
      
      // 隐藏所有配置区域
      document.getElementById('xunhuConfigSection').style.display = 'none';
      document.getElementById('paypalConfigSection').style.display = 'none';
      document.getElementById('coinbaseConfigSection').style.display = 'none';
      document.getElementById('cryptoConfigSection').style.display = 'none';
      
      // 根据类型显示对应配置
      switch (paymentType) {
        case 'alipay':
        case 'wechat':
          document.getElementById('xunhuConfigSection').style.display = 'block';
          break;
        case 'paypal':
          document.getElementById('paypalConfigSection').style.display = 'block';
          break;
        case 'coinbase':
          document.getElementById('coinbaseConfigSection').style.display = 'block';
          break;
        case 'usdt':
        case 'usdc':
          document.getElementById('cryptoConfigSection').style.display = 'block';
          // 更新标签和说明
          if (paymentType === 'usdt') {
            document.getElementById('cryptoConfigLabel').textContent = 'USDT 配置';
            document.getElementById('cryptoConfigDesc').textContent = '配置 TRC20/ERC20 USDT 钱包地址';
          } else {
            document.getElementById('cryptoConfigLabel').textContent = 'USDC 配置';
            document.getElementById('cryptoConfigDesc').textContent = '配置以太坊 ERC20 USDC 钱包地址';
            // USDC 只支持以太坊
            document.getElementById('cryptoNetwork').value = 'eth';
            document.getElementById('cryptoNetwork').disabled = true;
          }
          break;
      }
    }

    function editPaymentMethod(id) {
      fetch(API_BASE + '/mall/payment-methods', {
        headers: { 'X-Admin-Key': adminKey }
      }).then(res => res.json()).then(data => {
        if (data.success) {
          const method = data.payment_methods.find(m => m.id === id);
          if (method) {
            const config = JSON.parse(method.config || '{}');
            document.getElementById('paymentMethodModalTitle').textContent = '配置支付方式 - ' + method.name;
            document.getElementById('paymentMethodId').value = method.id;
            document.getElementById('paymentType').value = method.type;
            document.getElementById('paymentName').value = method.name;
            document.getElementById('paymentEnabled').checked = method.enabled ? true : false;
            
            // 根据类型恢复配置字段
            switch (method.type) {
              case 'alipay':
              case 'wechat':
                document.getElementById('appId').value = config.app_id || '';
                document.getElementById('appSecret').value = config.app_secret || '';
                document.getElementById('gatewayUrl').value = config.gateway_url || '';
                break;
              case 'paypal':
                document.getElementById('paypalClientId').value = config.client_id || '';
                document.getElementById('paypalClientSecret').value = config.client_secret || '';
                document.getElementById('paypalMode').value = config.mode || 'sandbox';
                break;
              case 'coinbase':
                document.getElementById('coinbaseApiKey').value = config.api_key || '';
                document.getElementById('coinbaseWebhookSecret').value = config.webhook_secret || '';
                document.getElementById('coinbaseAutoConvert').value = config.auto_convert || 'usdc';
                break;
              case 'usdt':
              case 'usdc':
                document.getElementById('cryptoNetwork').value = config.network || 'trc20';
                document.getElementById('cryptoWalletAddress').value = config.wallet_address || '';
                break;
            }
            
            // 更新配置字段显示
            updatePaymentConfigFields();
            
            document.getElementById('paymentMethodModal').classList.add('active');
          }
        }
      }).catch(error => {
        console.error('Failed to load payment method:', error);
        showToast('加载失败', 'error');
      });
    }

    function savePaymentMethod() {
      const id = document.getElementById('paymentMethodId')?.value;
      const type = document.getElementById('paymentType').value;
      const name = document.getElementById('paymentName').value.trim();
      const enabled = document.getElementById('paymentEnabled').checked;
      
      if (!name) {
        showToast('请输入支付方式名称', 'error');
        return;
      }
      
      // 根据类型构建配置
      let config = {};
      
      switch (type) {
        case 'alipay':
        case 'wechat':
          config = {
            app_id: document.getElementById('appId').value.trim(),
            app_secret: document.getElementById('appSecret').value.trim(),
            gateway_url: document.getElementById('gatewayUrl').value.trim() || 'https://api.xunhuweb.com/payment/do.html'
          };
          if (!config.app_id || !config.app_secret) {
            showToast('请填写完整的虎皮椒配置', 'error');
            return;
          }
          break;
        case 'paypal':
          config = {
            client_id: document.getElementById('paypalClientId').value.trim(),
            client_secret: document.getElementById('paypalClientSecret').value.trim(),
            mode: document.getElementById('paypalMode').value
          };
          if (!config.client_id || !config.client_secret) {
            showToast('请填写完整的 PayPal 配置', 'error');
            return;
          }
          break;
        case 'coinbase':
          config = {
            api_key: document.getElementById('coinbaseApiKey').value.trim(),
            webhook_secret: document.getElementById('coinbaseWebhookSecret').value.trim(),
            auto_convert: document.getElementById('coinbaseAutoConvert').value
          };
          if (!config.api_key || !config.webhook_secret) {
            showToast('请填写完整的 Coinbase 配置', 'error');
            return;
          }
          break;
        case 'usdt':
        case 'usdc':
          config = {
            network: document.getElementById('cryptoNetwork').value,
            wallet_address: document.getElementById('cryptoWalletAddress').value.trim()
          };
          if (!config.wallet_address) {
            showToast('请填写钱包地址', 'error');
            return;
          }
          break;
      }
      
      const requestConfig = {
        method: 'POST',
        headers: {
          'X-Admin-Key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: type,
          name: name,
          enabled: enabled,
          config: config
        })
      };
      
      // 如果是编辑，则使用 PUT 方法并添加 id
      if (id) {
        requestConfig.method = 'PUT';
        const configData = JSON.parse(requestConfig.body);
        configData.id = parseInt(id);
        requestConfig.body = JSON.stringify(configData);
      }
      
      fetch(API_BASE + '/mall/payment-methods', requestConfig).then(res => res.json()).then(data => {
        if (data.success) {
          closePaymentMethodModal();
          loadPaymentMethods();
          showToast('保存成功', 'success');
        } else {
          showToast('保存失败: ' + (data.error || '未知错误'), 'error');
        }
      }).catch(error => {
        console.error('Failed to save payment method:', error);
        showToast('保存失败', 'error');
      }).finally(() => {
        // 恢复 USDC 的 network select 状态
        document.getElementById('cryptoNetwork').disabled = false;
      });
    }

    function togglePaymentMethod(id, enabled) {
      fetch(API_BASE + '/mall/payment-methods/' + id, {
        method: 'PUT',
        headers: {
          'X-Admin-Key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enabled: enabled
        })
      }).then(res => res.json()).then(data => {
        if (data.success) {
          loadPaymentMethods();
          showToast(enabled ? '已启用' : '已禁用', 'success');
        } else {
          showToast('操作失败: ' + (data.error || '未知错误'), 'error');
        }
      }).catch(error => {
        console.error('Failed to toggle payment method:', error);
        showToast('操作失败', 'error');
      });
    }

    // ========== Ticket Management ==========
    async function loadTickets() {
      const status = document.getElementById('ticketStatusFilter').value;
      const type = document.getElementById('ticketTypeFilter').value;
      const search = document.getElementById('ticketSearch').value;
      let url = API_BASE + '/tickets?';
      if (status && status !== 'all') url += 'status=' + encodeURIComponent(status) + '&';
      if (type && type !== 'all') url += 'type=' + encodeURIComponent(type) + '&';
      if (search) url += 'search=' + encodeURIComponent(search) + '&';
      const response = await fetch(url, { headers: { 'X-Admin-Key': adminKey } });
      const data = await response.json();
      if (data.success) renderTickets(data.tickets || []);
    }

    function renderTickets(tickets) {
      const tbody = document.getElementById('ticketsTable');
      const noTickets = document.getElementById('noTickets');
      if (tickets.length === 0) { tbody.innerHTML = ''; noTickets.style.display = 'block'; return; }
      noTickets.style.display = 'none';
      const typeLabels = { payment: 'Payment', order: 'Order', technical: 'Technical', other: 'Other' };
      const statusLabels = { pending: 'Pending', processing: 'Processing', resolved: 'Resolved', closed: 'Closed' };
      tbody.innerHTML = tickets.map(t => '<tr style="border-bottom:1px solid #e5e5ea;"><td style="padding:12px;">' + t.id + '</td><td style="padding:12px;">' + escapeHtml(t.user_email) + '</td><td style="padding:12px;"><span class="ticket-type-badge ' + t.type + '">' + (typeLabels[t.type] || t.type) + '</span></td><td style="padding:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(t.subject) + '</td><td style="padding:12px;"><span class="ticket-status-badge ' + t.status + '">' + (statusLabels[t.status]) + '</span></td><td style="padding:12px;font-size:12px;color:#86868b;">' + new Date(t.created_at).toLocaleString() + '</td><td style="padding:12px;"><button class="btn" onclick="showTicketDetail(' + t.id + ')" style="padding:4px 12px;font-size:12px;">View</button></td></tr>').join('');
    }

    let currentTicketId = null;

    async function showTicketDetail(ticketId) {
      currentTicketId = ticketId;
      showLoading();
      try {
        const response = await fetch(API_BASE + '/tickets/' + ticketId, { headers: { 'X-Admin-Key': adminKey } });
        const data = await response.json();
        if (data.success) { renderTicketModal(data); hideLoading(); }
        else { showToast('Failed to load ticket', 'error'); hideLoading(); }
      } catch (error) { console.error('Load ticket error:', error); showToast('Failed to load ticket', 'error'); hideLoading(); }
    }

    function renderTicketModal(data) {
      const ticket = data.ticket;
      const order = data.order;
      const replies = data.replies || [];
      const typeLabels = { payment: 'Payment', order: 'Order', technical: 'Technical', other: 'Other' };
      const statusLabels = { pending: 'Pending', processing: 'Processing', resolved: 'Resolved', closed: 'Closed' };
      const modal = document.createElement('div');
      modal.id = 'ticketDetailModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;';
      modal.innerHTML = '<div style="background:white;border-radius:12px;width:90%;max-width:700px;max-height:90vh;overflow-y:auto;padding:24px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;"><h3 style="margin:0;">Ticket #' + ticket.id + '</h3><button onclick="closeTicketModal()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#86868b;">x</button></div><div style="margin-bottom:16px;"><div style="display:flex;gap:12px;margin-bottom:12px;"><span class="ticket-type-badge ' + ticket.type + '">' + typeLabels[ticket.type] + '</span><span class="ticket-status-badge ' + ticket.status + '">' + statusLabels[ticket.status] + '</span></div><div style="font-size:14px;color:#86868b;"><div>User: ' + escapeHtml(ticket.user_email) + '</div><div>Order: #' + ticket.order_id + (order ? ' (¥' + order.amount + ', ' + order.duration_days + ' days)' : '') + '</div><div>Created: ' + new Date(ticket.created_at).toLocaleString() + '</div></div></div><div style="background:#f5f5f7;padding:16px;border-radius:8px;margin-bottom:20px;"><h4 style="margin:0 0 8px;font-size:14px;color:#86868b;">Subject</h4><p style="margin:0;font-size:16px;font-weight:600;">' + escapeHtml(ticket.subject) + '</p><h4 style="margin:16px 0 8px;font-size:14px;color:#86868b;">Description</h4><p style="margin:0;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;">' + escapeHtml(ticket.description) + '</p></div><h4 style="margin:0 0 16px;font-size:14px;color:#86868b;text-transform:uppercase;">Replies</h4><div id="ticketReplies" style="max-height:300px;overflow-y:auto;margin-bottom:20px;">' + (replies.length === 0 ? '<p style="text-align:center;color:#86868b;padding:20px;">No replies yet</p>' : replies.map(r => '<div style="background:' + (r.is_admin ? '#e3f2fd' : '#f5f5f7') + ';border-radius:8px;padding:12px;margin-bottom:12px;' + (r.is_admin ? 'border-left:3px solid #0071e3;' : '') + '"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><strong style="color:' + (r.is_admin ? '#0071e3' : '#1a1a1a') + '">' + (r.is_admin ? 'Support' : escapeHtml(r.user_email || 'User')) + '</strong><span style="font-size:12px;color:#86868b;">' + new Date(r.created_at).toLocaleString() + '</span></div><p style="margin:0;color:#1a1a1a;line-height:1.5;">' + escapeHtml(r.content) + '</p></div>').join('')) + '</div>' + (ticket.status !== 'closed' ? '<div style="border-top:1px solid #e5e5ea;padding-top:20px;"><textarea id="adminReplyContent" placeholder="Type your reply..." style="width:100%;min-height:80px;padding:12px;border:1px solid #d2d2d7;border-radius:8px;margin-bottom:12px;font-size:14px;resize:vertical;"></textarea><div style="display:flex;gap:8px;justify-content:flex-end;"><button class="btn" onclick="resolveTicket()" style="background:#34c759;color:white;">Mark Resolved</button><button class="btn" onclick="closeTicketFromAdmin()" style="background:#86868b;color:white;">Close Ticket</button><button class="btn btn-primary" onclick="submitAdminReply()">Send Reply</button></div></div>' : '<p style="text-align:center;color:#86868b;padding:20px;border-top:1px solid #e5e5ea;">This ticket is closed</p>') + '</div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', function(e) { if (e.target === modal) closeTicketModal(); });
    }

    function closeTicketModal() { var m = document.getElementById('ticketDetailModal'); if (m) m.remove(); currentTicketId = null; }

    async function submitAdminReply() {
      var content = document.getElementById('adminReplyContent').value.trim();
      if (!content) { showToast('Please enter reply content', 'warning'); return; }
      var response = await fetch(API_BASE + '/tickets/' + currentTicketId + '/reply', { method: 'POST', headers: { 'X-Admin-Key': adminKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ content: content }) });
      var data = await response.json();
      if (data.success) { showToast('Reply sent successfully', 'success'); showTicketDetail(currentTicketId); }
      else { showToast('Failed to send reply', 'error'); }
    }

    async function resolveTicket() {
      var response = await fetch(API_BASE + '/tickets/' + currentTicketId + '/resolve', { method: 'POST', headers: { 'X-Admin-Key': adminKey } });
      var data = await response.json();
      if (data.success) { showToast('Ticket marked as resolved', 'success'); closeTicketModal(); loadTickets(); }
      else { showToast('Failed to resolve ticket', 'error'); }
    }

    async function closeTicketFromAdmin() {
      if (!confirm('Close this ticket?')) return;
      var response = await fetch(API_BASE + '/tickets/' + currentTicketId + '/close', { method: 'POST', headers: { 'X-Admin-Key': adminKey } });
      var data = await response.json();
      if (data.success) { showToast('Ticket closed', 'success'); closeTicketModal(); loadTickets(); }
      else { showToast('Failed to close ticket', 'error'); }
    }
  </script>
</body>
</html>`;
