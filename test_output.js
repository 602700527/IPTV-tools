const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u76F4\u64AD\u670D\u52A1\u7BA1\u7406\u540E\u53F0</title>
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
  </style>
</head>
<body>
  <div id="loginOverlay" class="login-overlay hidden">
    <div class="login-box">
      <h2>\u7BA1\u7406\u540E\u53F0\u767B\u5F55</h2>
      <div id="loginError" class="login-error" style="display:none;"></div>
      <input type="password" id="adminKey" placeholder="\u8BF7\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u94A5">
      <button onclick="login()">\u767B\u5F55</button>
    </div>
  </div>
  <div class="container" id="mainContent" style="display:none;">
    <div class="header">
      <h1>\u76F4\u64AD\u670D\u52A1\u7BA1\u7406\u540E\u53F0</h1>
      <button class="logout-btn" onclick="logout()">\u9000\u51FA\u767B\u5F55</button>
    </div>
    <div class="nav-tabs">
      <button class="nav-tab active" onclick="showTab('dashboard')">\u4EEA\u8868\u76D8</button>
      <button class="nav-tab" onclick="showTab('sources')">\u76F4\u64AD\u6E90\u7BA1\u7406</button>
      <button class="nav-tab" onclick="showTab('channels')">\u9891\u9053\u7BA1\u7406</button>
      <button class="nav-tab" onclick="showTab('codes')">\u5361\u5BC6\u7BA1\u7406</button>
      <button class="nav-tab" onclick="showTab('security')">\u5B89\u5168\u76D1\u63A7</button>
    </div>
    <div id="dashboard" class="tab-content active">
      <div class="card">
        <div class="toolbar"><h3>\u7CFB\u7EDF\u6982\u89C8</h3><button class="btn btn-success" onclick="migrateDatabase()" title="\u5347\u7EA7\u6570\u636E\u5E93\u7ED3\u6784">\u5347\u7EA7\u6570\u636E\u5E93</button></div>
        <div class="stats-grid">
          <div class="stat-item"><div class="stat-value" id="statSources">0</div><div class="stat-label">\u76F4\u64AD\u6E90</div></div>
          <div class="stat-item"><div class="stat-value" id="statChannels">0</div><div class="stat-label">\u9891\u9053\u603B\u6570</div></div>
          <div class="stat-item"><div class="stat-value" id="statActiveCodes">0</div><div class="stat-label">\u6D3B\u8DC3\u5361\u5BC6</div></div>
          <div class="stat-item"><div class="stat-value" id="statUnusedCodes">0</div><div class="stat-label">\u672A\u4F7F\u7528\u5361\u5BC6</div></div>
        </div>
      </div>
    </div>
    <div id="sources" class="tab-content">
      <div class="card">
        <div class="toolbar"><h3>\u76F4\u64AD\u6E90\u5217\u8868</h3><div><button class="btn btn-success" onclick="syncAllSources()">\u540C\u6B65\u5168\u90E8</button><button class="btn btn-primary" onclick="showSourceModal()">\u6DFB\u52A0\u6E90</button></div></div>
        <table><thead><tr><th>ID</th><th>\u540D\u79F0</th><th>\u7C7B\u578B</th><th>\u89E3\u6790\u6A21\u5F0F</th><th>\u72B6\u6001</th><th>\u9891\u9053\u6570</th><th>\u6700\u540E\u66F4\u65B0</th><th>\u64CD\u4F5C</th></tr></thead><tbody id="sourcesTable"></tbody></table>
      </div>
      <div class="card">
        <h3>\u5B9A\u65F6\u4EFB\u52A1\u63A7\u5236</h3>
        <p style="margin-bottom:16px;color:#86868b;font-size:14px;">\u81EA\u52A8\u540C\u6B65\u6240\u6709\u5DF2\u542F\u7528\u7684\u6570\u636E\u6E90\uFF08\u9700\u5728wrangler.toml\u4E2D\u914D\u7F6Ecron\u8868\u8FBE\u5F0F\uFF09</p>
        <div style="display:flex;gap:16px;align-items:center;">
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:14px;">Cron\u8868\u8FBE\u5F0F</label>
            <input type="text" id="cronExpression" value="0 2 * * *" style="padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;width:200px;" placeholder="0 2 * * *">
          </div>
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:14px;">\u8BF4\u660E</label>
            <span style="font-size:14px;color:#86868b;">\u793A\u4F8B: 0 2 * * * \u8868\u793A\u6BCF\u5929\u51CC\u66682\u70B9\u6267\u884C</span>
          </div>
        </div>
        <div style="margin-top:16px;">
          <button class="btn btn-primary" onclick="saveCronConfig()">\u4FDD\u5B58\u5B9A\u65F6\u4EFB\u52A1\u914D\u7F6E</button>
        </div>
      </div>
    </div>
    <div id="channels" class="tab-content">
      <div class="card">
        <div class="toolbar"><h3>\u9891\u9053\u5217\u8868</h3><div><select class="filter-select" id="channelSourceFilter" onchange="resetChannelPage()"><option value="">\u5168\u90E8\u6E90</option></select><input type="text" class="search-box" id="channelSearch" placeholder="\u641C\u7D22\u9891\u9053..." oninput="resetChannelPage()"><select class="filter-select" id="channelPageSize" onchange="resetChannelPage()"><option value="10">10\u6761/\u9875</option><option value="20">20\u6761/\u9875</option><option value="30" selected>30\u6761/\u9875</option><option value="50">50\u6761/\u9875</option><option value="100">100\u6761/\u9875</option></select><button class="btn btn-danger" onclick="clearChannels()">\u6E05\u7A7A\u6570\u636E</button></div></div>
        <table><thead><tr><th>\u9891\u9053\u540D\u79F0</th><th>\u5206\u7EC4</th><th>\u76F4\u64AD\u6E90</th><th>\u64AD\u653E\u5730\u5740</th><th>\u8BF7\u6C42\u5934</th><th>\u72B6\u6001</th><th>\u64CD\u4F5C</th></tr></thead><tbody id="channelsTable"></tbody></table>
        <div id="channelPagination" class="pagination"></div>
      </div>
    </div>
    <div id="codes" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>\u5361\u5BC6\u5217\u8868</h3>
          <div>
            <button class="btn btn-success" onclick="toggleAdvancedFilter()">\u9AD8\u7EA7\u67E5\u8BE2</button>
            <button class="btn btn-primary" onclick="exportCodesCSV()">\u5BFC\u51FACSV</button>
            <button class="btn btn-primary" onclick="showGenerateCodeModal()">\u751F\u6210\u5361\u5BC6</button>
          </div>
        </div>
        <div id="advancedFilterPanel" class="card" style="display:none;margin-bottom:16px;padding:16px;background:#f9f9fb;">
          <div class="form-row" style="margin-bottom:12px;">
            <div class="form-group"><label>\u72B6\u6001</label><select class="filter-select" id="codeStatusFilter" onchange="resetCodePage()"><option value="">\u5168\u90E8</option><option value="unused">\u672A\u4F7F\u7528</option><option value="active">\u6D3B\u8DC3</option><option value="disabled">\u7981\u7528</option></select></div>
            <div class="form-group"><label>\u6709\u6548\u671F(\u5929)</label><div style="display:flex;gap:8px;"><input type="number" id="durationMin" placeholder="\u6700\u5C0F" class="search-box" style="width:80px;"><span>-</span><input type="number" id="durationMax" placeholder="\u6700\u5927" class="search-box" style="width:80px;"></div></div>
            <div class="form-group"><label>\u8FC7\u671F\u65F6\u95F4</label><div style="display:flex;gap:8px;"><input type="date" id="expiredFrom" class="search-box"><span>-</span><input type="date" id="expiredTo" class="search-box"></div></div>
          </div>
          <div class="form-row" style="margin-bottom:12px;">
            <div class="form-group"><label>\u6FC0\u6D3B\u65F6\u95F4</label><div style="display:flex;gap:8px;"><input type="date" id="activatedFrom" class="search-box"><span>-</span><input type="date" id="activatedTo" class="search-box"></div></div>
            <div class="form-group"><label>\u5907\u6CE8</label><input type="text" id="remarkFilter" placeholder="\u5907\u6CE8\u5173\u952E\u8BCD" class="search-box" style="width:200px;"></div>
            <div class="form-group"><label>\u6BCF\u9875\u6761\u6570</label><select class="filter-select" id="codePageSize" onchange="resetCodePage()"><option value="10">10\u6761/\u9875</option><option value="20">20\u6761/\u9875</option><option value="30" selected>30\u6761/\u9875</option><option value="50">50\u6761/\u9875</option><option value="100">100\u6761/\u9875</option></select></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="resetCodePage()">\u67E5\u8BE2</button>
            <button class="btn" onclick="clearCodeFilters()">\u91CD\u7F6E</button>
          </div>
        </div>
        <table><thead><tr><th>\u5361\u5BC6</th><th>\u72B6\u6001</th><th>\u6709\u6548\u671F(\u5929)</th><th>\u6700\u5927IP\u6570</th><th>\u6FC0\u6D3B\u65F6\u95F4</th><th>\u8FC7\u671F\u65F6\u95F4</th><th>\u5907\u6CE8</th><th>\u64CD\u4F5C</th></tr></thead><tbody id="codesTable"></tbody></table>
        <div id="codePagination" class="pagination"></div>
      </div>
    </div>
    <div id="security" class="tab-content">
      <div class="card">
        <div class="toolbar"><h3>\u5B89\u5168\u914D\u7F6E</h3><button class="btn btn-primary" onclick="loadSecurityConfig()">\u5237\u65B0\u914D\u7F6E</button></div>
        <div id="securityConfigForm" style="display:none;padding:16px;background:#f9f9fb;border-radius:8px;">
          <div class="form-row" style="margin-bottom:16px;">
            <div class="form-group">
              <label>\u6BCF\u65E5\u64AD\u653E\u6B21\u6570\u9650\u5236\uFF08\u6BCF\u4E2A\u9891\u9053\uFF09</label>
              <input type="number" id="channelDailyLimit" min="1" max="1000" value="100">
              <small style="color:#86868b;font-size:12px;">\u6BCF\u4E2A\u9891\u9053\u6BCF\u5929\u6700\u591A\u64AD\u653E\u6B21\u6570</small>
            </div>
            <div class="form-group">
              <label>\u81EA\u52A8\u5C01\u7981\u65F6\u957F\uFF08\u5929\uFF09</label>
              <input type="number" id="banDurationDays" min="0" max="365" value="7">
              <small style="color:#86868b;font-size:12px;">0\u8868\u793A\u6C38\u4E45\u5C01\u7981</small>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="autoBanOnExceed" checked style="width:auto;">
              <span>\u8D85\u51FA\u9650\u5236\u81EA\u52A8\u5C01\u7981</span>
            </label>
            <small style="color:#86868b;font-size:12px;">\u52FE\u9009\u540E\uFF0C\u9891\u9053\u64AD\u653E\u6B21\u6570\u8D85\u9650\u4F1A\u81EA\u52A8\u5C01\u7981\u5361\u5BC6</small>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="saveSecurityConfig()">\u4FDD\u5B58\u914D\u7F6E</button>
            <button class="btn" onclick="resetSecurityConfig()">\u91CD\u7F6E\u4E3A\u9ED8\u8BA4</button>
          </div>
        </div>
        <div id="noSecurityConfig" class="empty-state">\u70B9\u51FB"\u5237\u65B0\u914D\u7F6E"\u6309\u94AE\u52A0\u8F7D\u5F53\u524D\u914D\u7F6E</div>
      </div>
      <div class="card">
        <div class="toolbar"><h3>\u5361\u5BC6\u989D\u5EA6\u7BA1\u7406</h3><div><input type="text" id="quotaCode" placeholder="\u8F93\u5165\u5361\u5BC6" class="search-box"><button class="btn btn-primary" onclick="loadQuotaInfo()">\u67E5\u8BE2\u989D\u5EA6</button><button class="btn btn-success" onclick="unbanCode()">\u89E3\u5C01\u5361\u5BC6</button></div></div>
        <div id="quotaInfo" style="display:none;">
          <div class="stats-grid">
            <div class="stat-item"><div class="stat-value" id="quotaTotalPlays">0</div><div class="stat-label">\u4ECA\u65E5\u64AD\u653E\u6B21\u6570</div></div>
            <div class="stat-item"><div class="stat-value" id="quotaExceededCount">0</div><div class="stat-label">\u8D85\u9650\u9891\u9053\u6570</div></div>
            <div class="stat-item" id="quotaBanStatus"><div class="stat-value" style="color:#34c759;">\u6B63\u5E38</div><div class="stat-label">\u72B6\u6001</div></div>
            <div class="stat-item"><div class="stat-value" id="quotaBanTime">-</div><div class="stat-label">\u5C01\u7981\u65F6\u95F4</div></div>
          </div>
          <div id="banAlert" style="margin-top:20px;display:none;padding:16px;background:#ffebee;border-left:4px solid #ff3b30;border-radius:4px;">
            <h4 style="margin-bottom:12px;color:#d32f2f;">\u26A0\uFE0F \u5361\u5BC6\u5DF2\u88AB\u5C01\u7981</h4>
            <p style="margin-bottom:8px;"><strong>\u539F\u56E0\uFF1A</strong>\u8BE5\u5361\u5BC6\u4ECA\u65E5\u6709\u9891\u9053\u8D85\u51FA\u64AD\u653E\u989D\u5EA6\uFF08<span id="banLimitText">100</span>\u6B21/\u5929\uFF09</p>
            <p style="margin-bottom:8px;"><strong>\u5C01\u7981\u65F6\u957F\uFF1A</strong><span id="banDurationText">-</span></p>
            <p style="margin-bottom:8px;"><strong>\u5C01\u7981\u5230\u671F\uFF1A</strong><span id="banUntilText">-</span></p>
            <p><strong>\u5F71\u54CD\uFF1A</strong>\u65E0\u6CD5\u4F7F\u7528\u8BA2\u9605\u548C\u64AD\u653E\u529F\u80FD</p>
            <p style="margin-top:8px;"><strong>\u89E3\u51B3\u65B9\u6CD5\uFF1A</strong></p>
            <ul style="margin-left:20px;">
              <li>\u5982\u679C\u662F\u8BEF\u5C01\uFF0C\u70B9\u51FB"\u89E3\u5C01\u5361\u5BC6"\u6309\u94AE\u624B\u52A8\u89E3\u5C01</li>
              <li>\u7B49\u5F85\u5C01\u7981\u65F6\u95F4\u81EA\u52A8\u89E3\u9664</li>
              <li>\u8054\u7CFB\u7BA1\u7406\u5458\u83B7\u53D6\u65B0\u5361\u5BC6</li>
            </ul>
          </div>
        </div>
        <div id="noQuotaData" class="empty-state">\u8BF7\u8F93\u5165\u5361\u5BC6\u67E5\u770B\u989D\u5EA6\u4F7F\u7528\u60C5\u51B5</div>
      </div>
      <div class="card" style="margin-top:20px;">
        <h3>\u989D\u5EA6\u8BF4\u660E</h3>
        <div style="line-height:1.8;color:#86868b;font-size:14px;">
          <p><strong>\u{1F4CA} \u989D\u5EA6\u89C4\u5219\uFF1A</strong></p>
          <ul style="margin-left:20px;margin-bottom:16px;">
            <li>\u6BCF\u4E2A\u9891\u9053\u6BCF\u5929\u64AD\u653E\u6B21\u6570\u9650\u5236\u53EF\u5728\u4E0A\u65B9\u914D\u7F6E\u4E2D\u8BBE\u7F6E</li>
            <li>\u8D85\u8FC7\u989D\u5EA6\u4F1A\u6839\u636E\u914D\u7F6E\u81EA\u52A8\u5C01\u7981\u5361\u5BC6\uFF08\u53EF\u8BBE\u7F6E\u5C01\u7981\u65F6\u957F\uFF09</li>
            <li>\u6BCF\u5929\u51CC\u66680\u70B9\u81EA\u52A8\u91CD\u7F6E\u989D\u5EA6</li>
            <li>\u6240\u6709\u9891\u9053\u72EC\u7ACB\u8BA1\u7B97\u989D\u5EA6</li>
          </ul>
          <p><strong>\u2705 \u6B63\u5E38\u4F7F\u7528\uFF1A</strong></p>
          <p>\u6BCF\u5929\u770B10\u4E2A\u9891\u9053\uFF0C\u6BCF\u4E2A\u9891\u9053\u64AD\u653E10\u6B21\uFF0C\u8FDC\u4F4E\u4E8E\u9650\u5236</p>
          <p style="margin-bottom:16px;">\u6B63\u5E38\u89C2\u770B\u5B8C\u5168\u591F\u7528\uFF0C\u4E0D\u4F1A\u89E6\u53D1\u5C01\u7981</p>
          <p><strong>\u274C \u5F02\u5E38\u884C\u4E3A\uFF1A</strong></p>
          <p>\u4F7F\u7528\u811A\u672C\u6216\u4EE3\u7406\u5237\u64AD\u653E\u5730\u5740\uFF0C\u77ED\u65F6\u95F4\u5185\u5927\u91CF\u64AD\u653E</p>
          <p>\u4F1A\u89E6\u53D1\u81EA\u52A8\u5C01\u7981\u673A\u5236\uFF08\u4E34\u65F6\u6216\u6C38\u4E45\uFF0C\u53D6\u51B3\u4E8E\u914D\u7F6E\uFF09</p>
        </div>
      </div>
    </div>
  </div>
  <div id="loadingOverlay" class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
  <div id="syncIndicator" class="sync-indicator">
    <div class="sync-spinner"></div>
    <span id="syncText">\u6B63\u5728\u540C\u6B65\u4E2D...</span>
  </div>
  <div id="sourceModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3 id="sourceModalTitle">\u6DFB\u52A0\u6E90</h3><button class="close-btn" onclick="closeSourceModal()">&times;</button></div>
      <div class="form-group"><label>\u6E90\u540D\u79F0</label><input type="text" id="sourceName" placeholder="\u8F93\u5165\u6E90\u540D\u79F0"></div>
      <div class="form-group"><label>M3U URL</label><input type="text" id="sourceUrl" placeholder="\u8F93\u5165M3U\u6587\u4EF6URL"></div>
      <div class="form-row"><div class="form-group"><label>\u7C7B\u578B</label><select id="sourceType"><option value="m3u">M3U</option><option value="m3u8">M3U8</option></select></div><div class="form-group"><label>\u89E3\u6790\u6A21\u5F0F</label><select id="sourceParseMode"><option value="strict">\u4E25\u683C</option><option value="loose">\u5BBD\u677E</option></select></div></div>
      <div class="modal-footer"><button class="btn" onclick="closeSourceModal()">\u53D6\u6D88</button><button class="btn btn-primary" onclick="saveSource()">\u4FDD\u5B58</button></div>
    </div>
  </div>
  <div id="generateCodeModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3>\u751F\u6210\u5361\u5BC6</h3><button class="close-btn" onclick="closeGenerateCodeModal()">&times;</button></div>
      <div class="form-row"><div class="form-group"><label>\u751F\u6210\u6570\u91CF</label><input type="number" id="generateCount" value="1" min="1" max="100"></div><div class="form-group"><label>\u6709\u6548\u671F(\u5929)</label><input type="number" id="generateDuration" value="30" min="1"></div></div>
      <div class="form-row"><div class="form-group"><label>\u6700\u5927IP\u6570</label><input type="number" id="generateMaxIps" value="3" min="1"></div><div class="form-group"><label>\u5907\u6CE8</label><input type="text" id="generateRemark" placeholder="\u53EF\u9009\u5907\u6CE8"></div></div>
      <div class="modal-footer"><button class="btn" onclick="closeGenerateCodeModal()">\u53D6\u6D88</button><button class="btn btn-primary" onclick="generateCodes()">\u751F\u6210</button></div>
    </div>
  </div>
  <div id="codeResultModal" class="modal">
    <div class="modal-content" style="max-width:600px">
      <div class="modal-header"><h3>\u751F\u6210\u7684\u5361\u5BC6</h3><button class="close-btn" onclick="closeCodeResultModal()">&times;</button></div>
      <div id="generatedCodesList" class="generated-codes"></div>
      <div class="modal-footer"><button class="btn" onclick="closeCodeResultModal()">\u5173\u95ED</button></div>
    </div>
  </div>
  <div id="codeEditModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3>\u7F16\u8F91\u5361\u5BC6</h3><button class="close-btn" onclick="closeCodeEditModal()">&times;</button></div>
      <div class="form-group"><label>\u5361\u5BC6</label><input type="text" id="editCode" disabled></div>
      <div class="form-group"><label>\u72B6\u6001</label><select id="editStatus"><option value="unused">\u672A\u4F7F\u7528</option><option value="active">\u6D3B\u8DC3</option><option value="disabled">\u7981\u7528</option></select></div>
      <div class="form-group"><label>\u5907\u6CE8</label><input type="text" id="editRemark" placeholder="\u5907\u6CE8\u4FE1\u606F"></div>
      <div class="modal-footer"><button class="btn" onclick="closeCodeEditModal()">\u53D6\u6D88</button><button class="btn btn-primary" onclick="saveCodeEdit()">\u4FDD\u5B58</button></div>
    </div>
  </div>
  <script>
    const API_BASE='/admin';
    const STORAGE_KEY = 'admin_auth_key';
    const SYNC_KEY = 'admin_sync_status';
    let adminKey = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    let currentChannelPage = 1;
    let totalChannelPages = 1;
    let totalChannels = 0;
    let currentCodePage = 1;
    let totalCodePages = 1;
    let totalCodes = 0;

    // Loading\u63A7\u5236
    function showLoading() {
      document.getElementById('loadingOverlay').classList.add('active');
    }

    function hideLoading() {
      document.getElementById('loadingOverlay').classList.remove('active');
    }

    // \u540C\u6B65\u72B6\u6001\u7BA1\u7406
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
        document.getElementById('syncText').textContent = \`\u6B63\u5728\u540C\u6B65\u4E2D... (\${elapsed}\u79D2)\`;
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    }

    // \u5B9A\u671F\u66F4\u65B0\u540C\u6B65\u72B6\u6001\u663E\u793A
    setInterval(updateSyncIndicator, 1000);

    // \u9875\u9762\u52A0\u8F7D\u65F6\u81EA\u52A8\u68C0\u67E5\u767B\u5F55\u72B6\u6001
    if (adminKey) {
      autoLogin();
    } else {
      document.getElementById('loginOverlay').classList.remove('hidden');
    }

    // \u9875\u9762\u52A0\u8F7D\u65F6\u66F4\u65B0\u540C\u6B65\u6307\u793A\u5668
    updateSyncIndicator();

    function autoLogin() {
      fetch(API_BASE + '/init', {
        method: 'GET',
        headers: { 'X-Admin-Key': adminKey }
      })
      .then(res => {
        if (res.ok) {
          document.getElementById('mainContent').style.display = 'block';
          loadDashboard();
        } else {
          clearAuth();
          document.getElementById('loginOverlay').classList.remove('hidden');
        }
      })
      .catch(() => {
        // \u9759\u9ED8\u5931\u8D25\uFF0C\u8BA9\u7528\u6237\u624B\u52A8\u767B\u5F55
        document.getElementById('loginOverlay').classList.remove('hidden');
      });
    }

    function login() {
      const key = document.getElementById('adminKey').value;
      if (!key) {
        showLoginError('\u8BF7\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u94A5');
        return;
      }
      adminKey = key;
      // \u540C\u65F6\u4FDD\u5B58\u5230 localStorage \u548C sessionStorage
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
          loadDashboard();
        } else {
          showLoginError('\u5BC6\u94A5\u65E0\u6548');
          clearAuth();
        }
      })
      .catch(() => {
        showLoginError('\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5');
        clearAuth();
      });
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
      document.getElementById('loginError').style.display = 'none';
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
      if (tabName === 'dashboard') loadDashboard();
      else if (tabName === 'sources') loadSources();
      else if (tabName === 'channels') { loadSources(); loadChannels(); }
      else if (tabName === 'codes') loadCodes();
      else if (tabName === 'security') {
        loadSecurityConfig();
        document.getElementById('quotaInfo').style.display = 'none';
        document.getElementById('noQuotaData').style.display = 'block';
      }
    }

    async function loadDashboard() {
      try {
        showLoading();
        const sources = await apiRequest('/sources', { showLoading: false });
        const sourceList = sources.results || sources;
        document.getElementById('statSources').textContent = sourceList.length || 0;
        const channels = await apiRequest('/channels?page=1&page_size=1', { showLoading: false });
        document.getElementById('statChannels').textContent = channels.pagination?.total || 0;
        const codes = await apiRequest('/codes?page=1&page_size=1000', { showLoading: false });
        const codeList = codes.results || [];
        document.getElementById('statActiveCodes').textContent = codeList.filter(c => c.status === 'active').length;
        document.getElementById('statUnusedCodes').textContent = codeList.filter(c => c.status === 'unused').length;
      } catch (error) {
        showToast('\u52A0\u8F7D\u4EEA\u8868\u76D8\u5931\u8D25', 'error');
      } finally {
        hideLoading();
      }
    }

    async function migrateDatabase() {
      if (!confirm('\u786E\u5B9A\u8981\u5347\u7EA7\u6570\u636E\u5E93\u7ED3\u6784\u5417\uFF1F\u6B64\u64CD\u4F5C\u5C06\u4E3Asources\u8868\u6DFB\u52A0is_active\u5B57\u6BB5\u3002')) {
        return;
      }
      try {
        showLoading();
        const result = await apiRequest('/migrate');
        if (result.success) {
          showToast('\u6570\u636E\u5E93\u5347\u7EA7\u6210\u529F', 'success');
          loadDashboard();
          loadSources();
        } else {
          showToast('\u6570\u636E\u5E93\u5347\u7EA7\u5931\u8D25: ' + result.error, 'error');
        }
      } catch (error) {
        showToast('\u6570\u636E\u5E93\u5347\u7EA7\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function loadSources() {
      try {
        showLoading();
        const sources = await apiRequest('/sources', { showLoading: false });
        const sourceList = sources.results || sources;
        const tbody = document.getElementById('sourcesTable');
        if (!sourceList || sourceList.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="empty-state">\u6682\u65E0\u76F4\u64AD\u6E90</td></tr>';
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
                \${source.is_active ? '\u542F\u7528' : '\u7981\u7528'}
              </span>
            </td>
            <td>\${source.channelCount}</td>
            <td>\${source.last_updated ? new Date(source.last_updated).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : '-'}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm \${source.is_active ? 'btn-danger' : 'btn-success'}" onclick="toggleSource(\${source.id}, \${!source.is_active})">
                  \${source.is_active ? '\u7981\u7528' : '\u542F\u7528'}
                </button>
                <button class="btn btn-sm btn-primary" onclick="syncSource(\${source.id})">\u540C\u6B65</button>
                <button class="btn btn-sm" onclick="editSource(\${source.id})">\u7F16\u8F91</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSource(\${source.id})">\u5220\u9664</button>
              </div>
            </td>
          </tr>
        \`).join('');
        const filterSelect = document.getElementById('channelSourceFilter');
        filterSelect.innerHTML = '<option value="">\u5168\u90E8\u6E90</option>' + sourceList.map(s => \`<option value="\${s.id}">\${escapeHtml(s.name)}</option>\`).join('');
      } catch (error) {
        console.error('\u52A0\u8F7D\u6E90\u5931\u8D25:', error);
      } finally {
        hideLoading();
      }
    }

    function showSourceModal(source = null) {
      document.getElementById('sourceModalTitle').textContent = source ? '\u7F16\u8F91\u6E90' : '\u6DFB\u52A0\u6E90';
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
        showToast('\u8BF7\u586B\u5199\u5B8C\u6574\u4FE1\u606F', 'error');
        return;
      }

      try {
        const editingSourceId = document.getElementById('sourceModal').dataset.editId;
        if (editingSourceId) {
          await apiRequest('/sources', {
            method: 'PUT',
            body: JSON.stringify({ id: parseInt(editingSourceId), name, url, type, parse_mode: parseMode })
          });
          showToast('\u6E90\u66F4\u65B0\u6210\u529F', 'success');
        } else {
          await apiRequest('/sources', {
            method: 'POST',
            body: JSON.stringify({ name, url, type, parse_mode: parseMode })
          });
          showToast('\u6E90\u6DFB\u52A0\u6210\u529F', 'success');
        }
        closeSourceModal();
        loadSources();
      } catch (error) {
        showToast('\u4FDD\u5B58\u5931\u8D25: ' + error.error, 'error');
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
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u6E90\u5417\uFF1F\u6240\u6709\u5173\u8054\u7684\u9891\u9053\u4E5F\u4F1A\u88AB\u5220\u9664\u3002')) return;
      try {
        const result = await apiRequest('/sources/' + id, { method: 'DELETE' });
        showToast(result.message || '\u6E90\u5220\u9664\u6210\u529F', 'success');
        loadSources();
      } catch (error) {
        showToast('\u5220\u9664\u5931\u8D25: ' + error.error, 'error');
      }
    }

    async function toggleSource(id, isActive) {
      try {
        const result = await apiRequest('/sources/toggle/' + id, {
          method: 'PATCH',
          body: JSON.stringify({ is_active: isActive })
        });
        showToast(result.message || '\u64CD\u4F5C\u6210\u529F', 'success');
        loadSources();
      } catch (error) {
        showToast('\u64CD\u4F5C\u5931\u8D25: ' + error.error, 'error');
      }
    }

    async function syncAllSources() {
      if (!confirm('\u786E\u5B9A\u8981\u540C\u6B65\u6240\u6709\u5DF2\u542F\u7528\u7684\u6E90\u5417\uFF1F\u8FD9\u5C06\u5220\u9664\u6240\u6709\u65E7\u9891\u9053\u6570\u636E\u5E76\u91CD\u65B0\u83B7\u53D6\u3002')) return;
      showLoading();
      showToast('\u5F00\u59CB\u540C\u6B65\u6240\u6709\u6E90\uFF0C\u8FD9\u53EF\u80FD\u9700\u8981\u51E0\u5206\u949F...', 'info');
      try {
        const result = await apiRequest('/sync/all', { method: 'POST' });
        if (result.success) {
          const summary = \`\u540C\u6B65\u5B8C\u6210\uFF1A\${result.success_count}\u4E2A\u6210\u529F\uFF0C\${result.fail_count}\u4E2A\u5931\u8D25\`;
          showToast(summary, result.fail_count > 0 ? 'error' : 'success');
          // \u663E\u793A\u8BE6\u7EC6\u7ED3\u679C
          if (result.results && result.results.length > 0) {
            const details = result.results.map(r => {
              const status = r.success ? '\u2713' : '\u2717';
              return \`\${status} \${r.source_name}: \${r.success ? r.new_channels + '\u4E2A\u9891\u9053' : r.error}\`;
            }).join('\\n');
            alert(summary + '\\n\\n\u8BE6\u7EC6\u7ED3\u679C:\\n' + details);
          }
          loadSources();
        } else {
          showToast('\u540C\u6B65\u5931\u8D25: ' + result.error, 'error');
        }
      } catch (error) {
        showToast('\u540C\u6B65\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    function saveCronConfig() {
      const cronExpression = document.getElementById('cronExpression').value.trim();
      if (!cronExpression) {
        showToast('\u8BF7\u8F93\u5165Cron\u8868\u8FBE\u5F0F', 'error');
        return;
      }
      showToast('\u8BF7\u624B\u52A8\u5728 wrangler.toml \u4E2D\u914D\u7F6Ecron\u8868\u8FBE\u5F0F: ' + cronExpression + '\\n\u7136\u540E\u5728Cloudflare\u63A7\u5236\u53F0\u91CD\u65B0\u90E8\u7F72Worker', 'info');
    }

    async function syncSource(id) {
      // \u8BBE\u7F6E\u540C\u6B65\u72B6\u6001
      setSyncStatus('syncing');
      showToast('\u540C\u6B65\u4EFB\u52A1\u5DF2\u5F00\u59CB\uFF0C\u53EF\u4EE5\u5728\u540E\u53F0\u7EE7\u7EED\u6267\u884C', 'info');

      // \u540E\u53F0\u6267\u884C\u540C\u6B65\uFF0C\u4E0D\u7B49\u5F85\u7ED3\u679C
      const syncUrl = API_BASE + '/sync/' + id;
      const syncId = Date.now();

      fetch(syncUrl, {
        method: 'POST',
        headers: {
          'X-Admin-Key': adminKey,
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const message = result.deletedChannels
            ? '\u540C\u6B65\u6210\u529F\uFF1A\u5220\u9664\u4E86 ' + result.deletedChannels + ' \u4E2A\u65E7\u9891\u9053\uFF0C\u65B0\u589E ' + result.channelCount + ' \u4E2A\u9891\u9053'
            : '\u540C\u6B65\u6210\u529F\uFF0C\u5171 ' + result.channelCount + ' \u4E2A\u9891\u9053';
          showToast(message, 'success');
          // \u5982\u679C\u7528\u6237\u8FD8\u5728\u6E90\u5217\u8868\u9875\uFF0C\u5237\u65B0\u6570\u636E
          if (document.getElementById('sources').classList.contains('active')) {
            loadSources();
          }
        } else {
          showToast('\u540C\u6B65\u5931\u8D25: ' + result.error, 'error');
        }
      })
      .catch(error => {
        showToast('\u540C\u6B65\u5931\u8D25: ' + error.error, 'error');
      })
      .finally(() => {
        // \u6E05\u9664\u540C\u6B65\u72B6\u6001
        clearSyncStatus();
      });
    }

    async function loadChannels() {
      try {
        showLoading();
        let url = '/channels';
        const sourceId = document.getElementById('channelSourceFilter').value;
        const search = document.getElementById('channelSearch').value.trim();
        const pageSize = Math.min(parseInt(document.getElementById('channelPageSize').value) || 100, 100);
        const params = new URLSearchParams({
          page: currentChannelPage,
          page_size: pageSize
        });
        if (sourceId) params.append('source_id', sourceId);
        if (search) params.append('search', search);
        url += '?' + params.toString();
        const data = await apiRequest(url, { showLoading: false });
        const channels = data.results || [];
        const pagination = data.pagination || {};
        totalChannelPages = pagination.total_pages || 1;
        totalChannels = pagination.total || 0;
        const tbody = document.getElementById('channelsTable');
        if (channels.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="empty-state">\u6682\u65E0\u9891\u9053</td></tr>';
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
                <button class="btn btn-sm btn-copy" onclick="copyToClipboard('\${escapeHtml(channel.play_url)}')" title="\u590D\u5236\u5730\u5740">\u590D\u5236</button>
              </td>
              <td class="headers-cell">
                \${formatHeaders(channel.headers)}
              </td>
              <td>
                <span class="badge \${channel.is_active ? 'badge-success' : 'badge-danger'}">
                  \${channel.is_active ? '\u542F\u7528' : '\u7981\u7528'}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm \${channel.is_active ? 'btn-danger' : 'btn-success'}"
                    onclick="toggleChannel(\${channel.id}, \${!channel.is_active})">
                    \${channel.is_active ? '\u7981\u7528' : '\u542F\u7528'}
                  </button>
                </div>
              </td>
            </tr>
          \`).join('');
        }
        renderChannelPagination();
      } catch (error) {
        console.error('\u52A0\u8F7D\u9891\u9053\u5931\u8D25:', error);
      } finally {
        hideLoading();
      }
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
      let html = \`<span class="pagination-info">\u5171 \${totalChannels} \u4E2A\u9891\u9053\uFF0C\u7B2C \${currentChannelPage}/\${totalChannelPages} \u9875</span>\`;
      html += \`<button onclick="goToChannelPage(1)" \${currentChannelPage === 1 ? 'disabled' : ''}>\u9996\u9875</button>\`;
      html += \`<button onclick="goToChannelPage(\${currentChannelPage - 1})" \${currentChannelPage === 1 ? 'disabled' : ''}>\u4E0A\u4E00\u9875</button>\`;
      const maxButtons = 5;
      let startPage = Math.max(1, currentChannelPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalChannelPages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToChannelPage(\${i})" class="\${i === currentChannelPage ? 'active' : ''}">\${i}</button>\`;
      }
      html += \`<button onclick="goToChannelPage(\${currentChannelPage + 1})" \${currentChannelPage === totalChannelPages ? 'disabled' : ''}>\u4E0B\u4E00\u9875</button>\`;
      html += \`<button onclick="goToChannelPage(\${totalChannelPages})" \${currentChannelPage === totalChannelPages ? 'disabled' : ''}>\u672B\u9875</button>\`;
      container.innerHTML = html;
    }

    async function toggleChannel(id, isActive) {
      showToast('\u529F\u80FD\u5F00\u53D1\u4E2D', 'error');
    }

    async function clearChannels() {
      if (!confirm('\u786E\u5B9A\u8981\u6E05\u7A7A\u6240\u6709\u9891\u9053\u6570\u636E\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\uFF01')) return;

      try {
        const result = await apiRequest('/channels', { method: 'DELETE' });
        showToast(result.message || '\u6E05\u7A7A\u6210\u529F', 'success');
        loadChannels();
        loadSources(); // \u66F4\u65B0\u6E90\u4E2D\u7684\u9891\u9053\u6570\u7EDF\u8BA1
      } catch (error) {
        showToast('\u6E05\u7A7A\u5931\u8D25: ' + error.error, 'error');
      }
    }

    async function loadCodes() {
      try {
        showLoading();
        let url = '/codes';
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
          tbody.innerHTML = '<tr><td colspan="8" class="empty-state">\u6682\u65E0\u5361\u5BC6</td></tr>';
        } else {
          const statusMap = {
            'unused': { text: '\u672A\u4F7F\u7528', class: 'badge-warning' },
            'active': { text: '\u6D3B\u8DC3', class: 'badge-success' },
            'disabled': { text: '\u7981\u7528', class: 'badge-danger' }
          };
          tbody.innerHTML = codeList.map(code => {
            const status = statusMap[code.status] || { text: code.status, class: 'badge-warning' };
            return \`
              <tr>
                <td><span class="code-display">\${escapeHtml(code.code)}</span></td>
                <td><span class="badge \${status.class}">\${status.text}</span></td>
                <td>\${code.duration_days}</td>
                <td>\${code.max_ips || 3}</td>
                <td>\${code.activated_at ? new Date(code.activated_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : '-'}</td>
                <td>\${code.expired_at ? new Date(code.expired_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : '-'}</td>
                <td>\${escapeHtml(code.remark || '-')}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-sm" onclick="editCode('\${code.code}')">\u7F16\u8F91</button>
                  </div>
                </td>
              </tr>
            \`;
          }).join('');
        }
        renderCodePagination();
      } catch (error) {
        console.error('\u52A0\u8F7D\u5361\u5BC6\u5931\u8D25:', error);
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
      let html = \`<span class="pagination-info">\u5171 \${totalCodes} \u4E2A\u5361\u5BC6\uFF0C\u7B2C \${currentCodePage}/\${totalCodePages} \u9875</span>\`;
      html += \`<button onclick="goToCodePage(1)" \${currentCodePage === 1 ? 'disabled' : ''}>\u9996\u9875</button>\`;
      html += \`<button onclick="goToCodePage(\${currentCodePage - 1})" \${currentCodePage === 1 ? 'disabled' : ''}>\u4E0A\u4E00\u9875</button>\`;
      const maxButtons = 5;
      let startPage = Math.max(1, currentCodePage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalCodePages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToCodePage(\${i})" class="\${i === currentCodePage ? 'active' : ''}">\${i}</button>\`;
      }
      html += \`<button onclick="goToCodePage(\${currentCodePage + 1})" \${currentCodePage === totalCodePages ? 'disabled' : ''}>\u4E0B\u4E00\u9875</button>\`;
      html += \`<button onclick="goToCodePage(\${totalCodePages})" \${currentCodePage === totalCodePages ? 'disabled' : ''}>\u672B\u9875</button>\`;
      container.innerHTML = html;
    }

    function toggleAdvancedFilter() {
      const panel = document.getElementById('advancedFilterPanel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function clearCodeFilters() {
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
          throw new Error('\u5BFC\u51FA\u5931\u8D25');
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
        showToast('\u5BFC\u51FA\u6210\u529F', 'success');
      } catch (error) {
        console.error('\u5BFC\u51FA\u5931\u8D25:', error);
        showToast('\u5BFC\u51FA\u5931\u8D25: ' + error.message, 'error');
      } finally {
        hideLoading();
      }
    }

    function showGenerateCodeModal() {
      document.getElementById('generateCount').value = 1;
      document.getElementById('generateDuration').value = 30;
      document.getElementById('generateMaxIps').value = 3;
      document.getElementById('generateRemark').value = '';
      document.getElementById('generateCodeModal').classList.add('active');
    }

    function closeGenerateCodeModal() {
      document.getElementById('generateCodeModal').classList.remove('active');
    }

    async function generateCodes() {
      const count = parseInt(document.getElementById('generateCount').value);
      const durationDays = parseInt(document.getElementById('generateDuration').value);
      const maxIps = parseInt(document.getElementById('generateMaxIps').value);
      const remark = document.getElementById('generateRemark').value.trim();

      if (!count || count < 1 || count > 100) {
        showToast('\u751F\u6210\u6570\u91CF\u5FC5\u987B\u57281-100\u4E4B\u95F4', 'error');
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
          showToast('\u6210\u529F\u751F\u6210 ' + result.codes.length + ' \u4E2A\u5361\u5BC6', 'success');
          loadCodes();
        } else {
          showToast('\u751F\u6210\u5361\u5BC6\u5931\u8D25', 'error');
        }
      } catch (error) {
        showToast('\u751F\u6210\u5361\u5BC6\u5931\u8D25: ' + error.error, 'error');
      }
    }

    function showGeneratedCodes(codes) {
      const container = document.getElementById('generatedCodesList');
      container.innerHTML = \`<h4>\u5171\u751F\u6210 \${codes.length} \u4E2A\u5361\u5BC6</h4>\` +
        codes.map(c => \`
          <div class="generated-codes-item">
            <span class="code-display">\${escapeHtml(c.code)}</span>
            <span>\${escapeHtml(c.remark || '\u65E0\u5907\u6CE8')}</span>
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
        showToast('\u5361\u5BC6\u66F4\u65B0\u6210\u529F', 'success');
        closeCodeEditModal();
        loadCodes();
      } catch (error) {
        showToast('\u66F4\u65B0\u5931\u8D25: ' + error.error, 'error');
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
          showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25', 'error');
        }
      } catch (error) {
        showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
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
          showToast('\u64AD\u653E\u6B21\u6570\u9650\u5236\u5FC5\u987B\u57281-10000\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }

        if (config.ban_duration_days < 0 || config.ban_duration_days > 365) {
          showToast('\u5C01\u7981\u65F6\u957F\u5FC5\u987B\u57280-365\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }

        const result = await apiRequest('/security/config', {
          method: 'POST',
          body: JSON.stringify(config),
          showLoading: false
        });

        if (result.success) {
          showToast('\u914D\u7F6E\u5DF2\u4FDD\u5B58', 'success');
        } else {
          showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function resetSecurityConfig() {
      if (!confirm('\u786E\u5B9A\u8981\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u914D\u7F6E\u5417\uFF1F\\n\u9ED8\u8BA4\uFF1A\u6BCF\u4E2A\u9891\u9053100\u6B21/\u5929\uFF0C\u5C01\u79817\u5929')) {
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
        showToast('\u8BF7\u8F93\u5165\u5361\u5BC6', 'error');
        return;
      }

      try {
        showLoading();
        const quotaUrl = '/security/quota?code=' + encodeURIComponent(code);
        const data = await apiRequest(quotaUrl, { showLoading: false });

        document.getElementById('quotaInfo').style.display = 'block';
        document.getElementById('noQuotaData').style.display = 'none';

        // \u66F4\u65B0\u7EDF\u8BA1\u6570\u636E
        document.getElementById('quotaTotalPlays').textContent = data.total_plays || 0;
        document.getElementById('quotaExceededCount').textContent = data.exceeded_channels_count || 0;

        // \u66F4\u65B0\u72B6\u6001
        const banStatus = document.getElementById('quotaBanStatus');
        const banTimeEl = document.getElementById('quotaBanTime');
        const banAlert = document.getElementById('banAlert');

        if (data.is_banned) {
          banStatus.innerHTML = '<div class="stat-value" style="color:#ff3b30;">\u5DF2\u5C01\u7981</div><div class="stat-label">\u72B6\u6001</div>';
          const banInfo = data.banned_until ? ' \u81F3 ' + new Date(data.banned_until).toLocaleString('zh-CN') : '';
          banTimeEl.textContent = (data.banned_at ? new Date(data.banned_at).toLocaleString('zh-CN') : '-') + banInfo;
          banAlert.style.display = 'block';

          // \u66F4\u65B0\u5C01\u7981\u8BE6\u7EC6\u4FE1\u606F
          document.getElementById('banLimitText').textContent = data.channel_daily_limit || '\u672A\u77E5';
          document.getElementById('banDurationText').textContent = data.ban_duration_days === 0 ? '\u6C38\u4E45' : (data.ban_duration_days + '\u5929');
          document.getElementById('banUntilText').textContent = data.banned_until ? new Date(data.banned_until).toLocaleString('zh-CN') : '\u6C38\u4E45';
        } else {
          banStatus.innerHTML = '<div class="stat-value" style="color:#34c759;">\u6B63\u5E38</div><div class="stat-label">\u72B6\u6001</div>';
          banTimeEl.textContent = '-';
          banAlert.style.display = 'none';
        }
      } catch (error) {
        showToast('\u52A0\u8F7D\u989D\u5EA6\u4FE1\u606F\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function unbanCode() {
      const code = document.getElementById('quotaCode').value.trim();
      if (!code) {
        showToast('\u8BF7\u8F93\u5165\u5361\u5BC6', 'error');
        return;
      }

      if (!confirm('\u786E\u5B9A\u8981\u89E3\u5C01\u8BE5\u5361\u5BC6\u5417\uFF1F\u89E3\u5C01\u540E\u5361\u5BC6\u5C06\u6062\u590D\u6B63\u5E38\u4F7F\u7528\u3002')) {
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
          showToast('\u5361\u5BC6\u5DF2\u89E3\u5C01', 'success');
          loadQuotaInfo();
          // \u5237\u65B0\u5361\u5BC6\u5217\u8868\u4EE5\u66F4\u65B0\u72B6\u6001
          loadCodes();
        } else {
          showToast('\u89E3\u5C01\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u89E3\u5C01\u5931\u8D25: ' + error.error, 'error');
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
        showToast('\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F', 'success');
      }).catch(err => {
        // \u5907\u7528\u65B9\u6848\uFF1A\u4F7F\u7528 textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F', 'success');
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
  <\/script>
</body>
</html>`;
export {
  ADMIN_HTML
};
