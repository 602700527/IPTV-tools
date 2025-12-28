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
      <h2>管理后台登录</h2>
      <div id="loginError" class="login-error" style="display:none;"></div>
      <input type="password" id="adminKey" placeholder="请输入管理员密钥">
      <button onclick="login()">登录</button>
    </div>
  </div>
  <div class="container" id="mainContent" style="display:none;">
    <div class="header">
      <h1>直播服务管理后台</h1>
      <button class="logout-btn" onclick="logout()">退出登录</button>
    </div>
    <div class="nav-tabs">
      <button class="nav-tab active" onclick="showTab('dashboard')">仪表盘</button>
      <button class="nav-tab" onclick="showTab('sources')">直播源管理</button>
      <button class="nav-tab" onclick="showTab('channels')">频道管理</button>
      <button class="nav-tab" onclick="showTab('codes')">卡密管理</button>
      <button class="nav-tab" onclick="showTab('security')">安全监控</button>
      <button class="nav-tab" onclick="showTab('ip-blacklist')">IP黑名单</button>
      <button class="nav-tab" onclick="showTab('homepage-display')">首页展示</button>
      <button class="nav-tab" onclick="showTab('sql')">SQL Query</button>
    </div>
    <div id="dashboard" class="tab-content active">
      <div class="card">
        <div class="toolbar"><h3>系统概览</h3><button class="btn btn-success" onclick="migrateDatabase()" title="升级数据库结构">升级数据库</button></div>
        <div class="stats-grid">
          <div class="stat-item"><div class="stat-value" id="statSources">0</div><div class="stat-label">直播源</div></div>
          <div class="stat-item"><div class="stat-value" id="statChannels">0</div><div class="stat-label">频道总数</div></div>
          <div class="stat-item"><div class="stat-value" id="statActiveCodes">0</div><div class="stat-label">活跃卡密</div></div>
          <div class="stat-item"><div class="stat-value" id="statUnusedCodes">0</div><div class="stat-label">未使用卡密</div></div>
          <div class="stat-item"><div class="stat-value" id="statBannedIPs" style="color:#ff3b30">0</div><div class="stat-label">封禁IP</div></div>
        </div>
      </div>
    </div>
    <div id="sources" class="tab-content">
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
          <p style="margin-bottom:16px;color:#86868b;font-size:14px;">在同步源时，可以根据分组名、播放地址或频道名排除不需要的频道。留空则不过滤。</p>
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
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button class="btn btn-primary" onclick="saveSyncFilters()">保存规则</button>
            <button class="btn" onclick="clearSyncFilters()">清空规则</button>
            <button class="btn" onclick="toggleSyncFilter()">收起</button>
          </div>
        </div>
        <table><thead><tr><th>ID</th><th>名称</th><th>类型</th><th>解析模式</th><th>状态</th><th>频道数</th><th>最后更新</th><th>操作</th></tr></thead><tbody id="sourcesTable"></tbody></table>
      </div>
      <div class="card">
        <h3>定时任务控制</h3>
        <p style="margin-bottom:16px;color:#86868b;font-size:14px;">自动同步所有已启用的数据源（需在wrangler.toml中配置cron表达式）</p>
        <div style="display:flex;gap:16px;align-items:center;">
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:14px;">Cron表达式</label>
            <input type="text" id="cronExpression" value="0 2 * * *" style="padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;width:200px;" placeholder="0 2 * * *">
          </div>
          <div>
            <label style="display:block;margin-bottom:8px;font-weight:500;font-size:14px;">说明</label>
            <span style="font-size:14px;color:#86868b;">示例: 0 2 * * * 表示每天凌晨2点执行</span>
          </div>
        </div>
        <div style="margin-top:16px;">
          <button class="btn btn-primary" onclick="saveCronConfig()">保存定时任务配置</button>
        </div>
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
            <button class="btn btn-primary" onclick="exportCodesCSV()">导出CSV</button>
            <button class="btn btn-primary" onclick="showImportCodeModal()">批量导入</button>
            <button class="btn btn-primary" onclick="showGenerateCodeModal()">生成卡密</button>
            <button class="btn btn-danger" onclick="clearCodes()">清空数据</button>
          </div>
        </div>
        <div id="advancedFilterPanel" class="card" style="display:none;margin-bottom:16px;padding:16px;background:#f9f9fb;">
          <div class="form-row" style="margin-bottom:12px;">
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
        <table><thead><tr><th>卡密</th><th>状态</th><th>有效期(天)</th><th>最大IP数</th><th>激活时间</th><th>过期时间</th><th>备注</th><th>操作</th></tr></thead><tbody id="codesTable"></tbody></table>
        <div id="codePagination" class="pagination"></div>
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
    <div id="sql" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>SQL Query</h3>
        </div>
        <div class="form-group">
          <label>SQL Statement</label>
          <textarea id="sqlQuery" rows="6" placeholder="Enter SQL query, e.g.:
SELECT channel_name, headers, play_url 
FROM channels 
WHERE channel_name = 'CCTV1' OR channel_hash = '1e2bc193';"></textarea>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:20px;">
          <button class="btn btn-primary" onclick="executeSQL()">Execute</button>
          <button class="btn" onclick="clearSQLResult()">Clear</button>
        </div>
        <div id="sqlResult" style="display:none;">
          <h4 style="margin-bottom:10px;">Query Results</h4>
          <div id="sqlResultCount" style="margin-bottom:10px;color:#666;"></div>
          <div id="sqlResultTable" style="overflow-x:auto;"></div>
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
      <div class="form-row"><div class="form-group"><label>生成数量</label><input type="number" id="generateCount" value="1" min="1" max="100"></div><div class="form-group"><label>有效期(天)</label><input type="number" id="generateDuration" value="30" min="1"></div></div>
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
        document.getElementById('syncText').textContent = \`正在同步中... (\${elapsed}秒)\`;
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
          loadDashboard();
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
      if (!key) {
        showLoginError('请输入管理员密钥');
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
          loadDashboard();
        } else {
          showLoginError('密钥无效');
          clearAuth();
        }
      })
      .catch(() => {
        showLoginError('登录失败，请重试');
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
        loadBannedCodes(); // 加载封禁卡密列表
      }
      else if (tabName === 'ip-blacklist') {
        loadIPBlacklistConfig();
        loadIPBlacklist();
      }
      else if (tabName === 'homepage-display') loadHomepageDisplayConfig();
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
        
        // 加载封禁IP数量
        const ipBlacklist = await apiRequest('/ip-blacklist', { showLoading: false });
        document.getElementById('statBannedIPs').textContent = ipBlacklist.count || 0;
      } catch (error) {
        showToast('加载仪表盘失败', 'error');
      } finally {
        hideLoading();
      }
    }

    async function migrateDatabase() {
      if (!confirm('确定要升级数据库结构吗？此操作将为sources表添加is_active字段。')) {
        return;
      }
      try {
        showLoading();
        const result = await apiRequest('/migrate');
        if (result.success) {
          showToast('数据库升级成功', 'success');
          loadDashboard();
          loadSources();
        } else {
          showToast('数据库升级失败: ' + result.error, 'error');
        }
      } catch (error) {
        showToast('数据库升级失败: ' + error.error, 'error');
      } finally {
        hideLoading();
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

    function saveCronConfig() {
      const cronExpression = document.getElementById('cronExpression').value.trim();
      if (!cronExpression) {
        showToast('请输入Cron表达式', 'error');
        return;
      }
      showToast('请手动在 wrangler.toml 中配置cron表达式: ' + cronExpression + '\\n然后在Cloudflare控制台重新部署Worker', 'info');
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
      showToast('已清空同步过滤规则', 'success');
    }

    function saveSyncFilters() {
      const filters = {
        excludeGroups: document.getElementById('syncExcludeGroups').value,
        excludeUrls: document.getElementById('syncExcludeUrls').value,
        excludeNames: document.getElementById('syncExcludeNames').value,
        excludeDuplicateUrls: document.getElementById('excludeDuplicateUrls').checked
      };
      localStorage.setItem('syncFilters', JSON.stringify(filters));
      showToast('过滤规则已保存', 'success');
    }

    function loadSyncFilters() {
      const saved = localStorage.getItem('syncFilters');
      if (saved) {
        try {
          const filters = JSON.parse(saved);
          document.getElementById('syncExcludeGroups').value = filters.excludeGroups || '';
          document.getElementById('syncExcludeUrls').value = filters.excludeUrls || '';
          document.getElementById('syncExcludeNames').value = filters.excludeNames || '';
          document.getElementById('excludeDuplicateUrls').checked = filters.excludeDuplicateUrls || false;
        } catch (e) {
          console.error('Failed to load sync filters:', e);
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

      const filter = {
        excludeGroups,
        excludeUrls,
        excludeNames,
        excludeDuplicateUrls: document.getElementById('excludeDuplicateUrls').checked
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

        document.getElementById('statBannedIPs').textContent = data.count || 0;
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

    // SQL Query Function
    async function executeSQL() {
      const sql = document.getElementById('sqlQuery').value.trim();
      if (!sql) {
        showToast('Please enter SQL query', 'error');
        return;
      }

      showLoading();

      try {
        const result = await apiRequest('/sql', {
          method: 'POST',
          body: JSON.stringify({ sql: sql }),
          showLoading: false
        });

        if (result.success) {
          displaySQLResult(result.results, result.meta);
        } else {
          showToast('Query failed: ' + (result.error || 'Unknown error'), 'error');
        }
      } catch (error) {
        showToast('Query failed: ' + error.message, 'error');
      } finally {
        hideLoading();
      }
    }

    function displaySQLResult(results, meta) {
      const container = document.getElementById('sqlResult');
      const countDiv = document.getElementById('sqlResultCount');
      const tableDiv = document.getElementById('sqlResultTable');

      if (!results || results.length === 0) {
        container.style.display = 'none';
        return;
      }

      container.style.display = 'block';
      countDiv.textContent = 'Total: ' + results.length + ' records';

      // Generate table headers
      const columns = Object.keys(results[0]);
      let tableHTML = '<table><thead><tr>';
      columns.forEach(col => {
        tableHTML += '<th>' + escapeHtml(col) + '</th>';
      });
      tableHTML += '</tr></thead><tbody>';

      // 生成数据行
      results.forEach(row => {
        tableHTML += '<tr>';
        columns.forEach(col => {
          let value = row[col];
          // Format JSON object
          if (typeof value === 'object' && value !== null) {
            value = '<pre style="margin:0;padding:5px;background:#f5f5f5;font-size:12px;">' + escapeHtml(JSON.stringify(value, null, 2)) + '</pre>';
          } else if (value === null || value === undefined) {
            value = '<span style="color:#999;">NULL</span>';
          } else {
            value = escapeHtml(String(value));
          }
          tableHTML += '<td>' + value + '</td>';
        });
        tableHTML += '</tr>';
      });

      tableHTML += '</tbody></table>';
      tableDiv.innerHTML = tableHTML;
    }

    function clearSQLResult() {
      document.getElementById('sqlResult').style.display = 'none';
      document.getElementById('sqlQuery').value = '';
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
  </script>
</body>
</html>`;
