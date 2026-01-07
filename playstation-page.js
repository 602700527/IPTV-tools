// 交互式播放站首页
export const PLAYSTATION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ========== SEO Meta Tags ========== -->
  <!-- 基础Meta标签 -->
  <meta name="description" content="IPTV Live提供免费的在线电视观看服务，包含10000+高清频道，支持体育、新闻、娱乐、电影等全类型频道，无需注册，一键播放，多设备同步观看。">
  <meta name="keywords" content="IPTV,免费直播,在线看电视,体育直播,新闻直播,高清直播,免费电视,在线视频,直播平台,IPTV Live">
  <meta name="author" content="IPTV Live">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <meta name="baiduspider" content="index, follow">
  <meta name="revisit-after" content="1 days">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com">
  <meta property="og:title" content="IPTV Live - 免费高清电视观看平台">
  <meta property="og:description" content="提供10000+免费高清频道，支持体育、新闻、娱乐、电影等全类型，无需注册，一键播放。">
  <meta property="og:image" content="https://iptv-search.com/og-image.jpg">
  <meta property="og:site_name" content="IPTV Live">
  <meta property="og:locale" content="zh_CN">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://iptv-search.com">
  <meta name="twitter:title" content="IPTV Live - 免费高清电视观看平台">
  <meta name="twitter:description" content="提供10000+免费高清频道，支持体育、新闻、娱乐、电影等全类型。">
  <meta name="twitter:image" content="https://iptv-search.com/og-image.jpg">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://iptv-search.com">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="shortcut icon" href="/favicon.svg">

  <!-- 移动端优化 -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="IPTV Live">
  <meta name="theme-color" content="#e50914">

  <!-- 结构化数据 (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IPTV Live",
    "url": "https://iptv-search.com",
    "description": "提供免费的在线电视观看服务，包含10000+高清频道",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://iptv-search.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "IPTV Live",
      "url": "https://iptv-search.com"
    }
  }
  </script>

  <!-- 面包屑导航结构化数据 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": "https://iptv-search.com"
      }
    ]
  }
  </script>

  <title>IPTV Live - 免费高清电视观看平台</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff}
    ::-webkit-scrollbar{width:8px}
    ::-webkit-scrollbar-track{background:#1a1a1a}
    ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:#555}

    .header{position:fixed;top:0;left:0;right:0;height:70px;background:rgba(20,20,20,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.1);z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 40px}
    .logo{font-size:24px;font-weight:800;background:linear-gradient(135deg,#e50914 0%,#b81d24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .header-left{display:flex;align-items:center;gap:40px}
    .header-right{display:flex;align-items:center;margin-left:auto}
    .search-box{max-width:500px;margin-right:20px}
    .search-input{width:100%;padding:12px 20px;border:1px solid rgba(255,255,255,.2);border-radius:8px;background:rgba(255,255,255,.05);color:#fff;font-size:15px;transition:all .2s}
    .search-input:focus{outline:none;border-color:#e50914;background:rgba(255,255,255,.1)}
    .search-input::placeholder{color:rgba(255,255,255,.5)}
    .nav-links{display:flex;gap:20px;margin-left:auto}
    .nav-links a{color:rgba(255,255,255,.8);text-decoration:none;font-size:14px;transition:color .2s}
    .nav-links a:hover{color:#fff}
    .nav-links a.active{color:#e50914}

    /* 语言切换下拉列表 */
    .lang-switcher{position:relative}
    .lang-dropdown{position:relative;display:inline-block}
    .lang-dropdown-menu{position:absolute;top:100%;right:0;margin-top:8px;background:#1a1a1a;border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:8px 0;min-width:120px;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all .2s;z-index:1000}
    .lang-dropdown.open .lang-dropdown-menu{opacity:1;visibility:visible;transform:translateY(0)}
    .lang-dropdown-item{padding:10px 20px;cursor:pointer;transition:background .15s;color:rgba(255,255,255,.8);font-size:14px}
    .lang-dropdown-item:hover{background:rgba(229,9,20,.15);color:#fff}
    .lang-dropdown-item.active{background:rgba(229,9,20,.2);color:#fff;font-weight:600}

    /* 快捷入口按钮 */
    .quick-entries{display:flex;gap:8px;margin-left:0}
    .quick-entry{position:relative;width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:rgba(255,255,255,.7);font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .quick-entry:hover{background:rgba(255,255,255,.2);color:#fff}
    .quick-entry-badge{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;background:#e50914;border-radius:9px;font-size:11px;font-weight:600;color:#fff;display:flex;align-items:center;justify-content:center;padding:0 5px;display:none}
    .quick-entry-tip{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:6px;white-space:nowrap;font-size:12px;color:rgba(255,255,255,.6);opacity:0;transition:opacity .2s;pointer-events:none}
    .quick-entry:hover .quick-entry-tip{opacity:1}

    .main{display:flex;margin-top:70px;min-height:calc(100vh - 70px)}
    .sidebar{width:260px;background:#141414;border-right:1px solid rgba(255,255,255,.1);overflow-y:auto;padding:20px 0;position:fixed;height:calc(100vh - 70px)}
    .group-item{padding:12px 24px;color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;font-size:14px;border-left:3px solid transparent}
    .group-item:hover{color:#fff;background:rgba(255,255,255,.05)}
    .group-item.active{color:#fff;background:rgba(229,9,20,.1);border-left-color:#e50914}
    .content{flex:1;margin-left:260px;padding:30px}

    .section-title{font-size:18px;font-weight:600;margin-bottom:20px;color:#fff}
    .channels-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
    .channel-card{background:#141414;border-radius:8px;overflow:hidden;cursor:pointer;transition:all .3s;border:2px solid transparent;position:relative}
    .channel-card:hover{transform:scale(1.05);border-color:#e50914;z-index:10;box-shadow:0 8px 30px rgba(0,0,0,.5)}
    .channel-poster{aspect-ratio:16/9;background:#1a1a1a;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .channel-poster img{width:100%;height:100%;object-fit:contain;transition:transform .3s}
    .channel-card:hover .channel-poster img{transform:scale(1.1)}
    .channel-icon{font-size:48px;opacity:.5}
    .play-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(229,9,20,.8);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}
    .channel-card:hover .play-overlay{opacity:1}
    .play-icon{width:60px;height:60px;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center}
    .play-icon::after{content:'';width:0;height:0;border-left:20px solid #fff;border-top:12px solid transparent;border-bottom:12px solid transparent;margin-left:4px}
    .channel-info{padding:14px}
    .channel-name{font-size:14px;font-weight:500;color:#fff;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .channel-group{font-size:12px;color:rgba(255,255,255,.5)}
    .pagination{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:30px;padding:20px 0}
    .pagination button{padding:8px 16px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#fff;border-radius:6px;cursor:pointer;font-size:14px;transition:all .2s}
    .pagination button:hover:not(:disabled){background:rgba(255,255,255,.1);border-color:#e50914}
    .pagination button:disabled{color:rgba(255,255,255,.3);cursor:not-allowed;border-color:rgba(255,255,255,.1)}
    .pagination button.active{background:#e50914;border-color:#e50914}
    .pagination-info{color:rgba(255,255,255,.6);font-size:14px}
    
    /* 播放器样式 - 可折叠的右下角浮窗 */
    .player-wrapper{display:none;position:fixed;right:20px;bottom:20px;z-index:1000;background:#0a0a0a;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.1);transition:all .3s ease}
    .player-wrapper.expanded{width:calc(100vw - 40px);height:calc(100vh - 80px);right:20px;top:70px;bottom:20px}
    .player-wrapper.collapsed{width:480px;height:270px;aspect-ratio:16/9}
    .player-wrapper.active{display:block}
    .player-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.1);cursor:move;user-select:none}
    .player-info{flex:1;min-width:0}
    .player-title{font-size:14px;font-weight:600;color:#fff;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .player-group{font-size:12px;color:rgba(255,255,255,.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .player-controls{display:flex;gap:8px}
    .player-btn{width:32px;height:32px;border-radius:6px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:14px}
    .player-btn:hover{background:rgba(255,255,255,.2)}
    .player-container{position:relative;width:100%;height:calc(100% - 50px);background:#000;display:flex;align-items:center;justify-content:center}
    .player-container video{width:100%;height:100%;object-fit:contain}
    .close-modal{background:rgba(231,9,20,.2)}
    .close-modal:hover{background:rgba(231,9,20,.4)}

    /* AdSense 广告位样式 */
    .ad-banner-top{display:flex;justify-content:center;padding:10px;background:rgba(0,0,0,.2);margin-bottom:10px}
    .ad-banner-bottom{display:flex;justify-content:center;padding:10px;background:rgba(0,0,0,.2);margin-top:10px}
    .ad-sidebar{margin-bottom:20px}
    .ad-responsive{width:100%;max-width:728px}
    .ad-mobile-top{display:none;padding:10px;background:rgba(0,0,0,.2);margin-bottom:10px}
    .ad-mobile-bottom{display:none;padding:10px;background:rgba(0,0,0,.2);margin-top:10px}

    .loading{display:flex;align-items:center;justify-content:center;padding:60px;color:rgba(255,255,255,.5)}
    .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,.1);border-top-color:#e50914;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-left:16px;font-size:14px}
    
    .empty-state{text-align:center;padding:80px 20px;color:rgba(255,255,255,.5)}
    .empty-icon{font-size:64px;margin-bottom:20px;opacity:.3}
    .empty-title{font-size:20px;font-weight:600;margin-bottom:10px}
    .empty-desc{font-size:14px}
    
    .footer{text-align:center;padding:30px;color:rgba(255,255,255,.4);font-size:13px;border-top:1px solid rgba(255,255,255,.1);margin-top:40px;margin-left:260px}

    /* 热门频道标签 */
    .hot-tag{position:absolute;top:8px;left:8px;padding:4px 10px;background:#ff4757;color:white;border-radius:4px;font-size:11px;font-weight:600;z-index:10}
    .hot-tag::before{content:'🔥 ';margin-right:2px}

    /* 收藏功能 */
    .favorite-btn{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.6);border:none;cursor:pointer;color:rgba(255,255,255,.7);font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:10}
    .favorite-btn:hover{background:rgba(0,0,0,.8);color:#fff}
    .favorite-btn.favorited{color:#ffd700}
    .favorite-section{display:none}
    .favorite-section.active{display:block}

    /* 快捷面板 */
    .quick-panel{display:none;position:fixed;top:70px;right:20px;width:400px;max-height:calc(100vh - 100px);background:rgba(20,20,20,.98);border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden;z-index:900;box-shadow:0 8px 40px rgba(0,0,0,.6)}
    .quick-panel.active{display:block;animation:slideIn 0.3s ease}
    @keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    .quick-panel-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.1)}
    .quick-panel-title{font-size:16px;font-weight:600;color:#fff;display:flex;align-items:center;gap:8px}
    .quick-panel-close{width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:rgba(255,255,255,.6);font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .quick-panel-close:hover{background:rgba(255,255,255,.2);color:#fff}
    .quick-panel-content{padding:16px;overflow-y:auto;max-height:calc(100vh - 180px)}
    .quick-panel-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:8px;background:rgba(255,255,255,.03);cursor:pointer;transition:all .2s;margin-bottom:8px}
    .quick-panel-item:hover{background:rgba(255,255,255,.08);transform:translateX(4px)}
    .quick-panel-item-poster{width:80px;height:45px;background:#141414;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .quick-panel-item-poster img{width:100%;height:100%;object-fit:contain}
    .quick-panel-item-icon{font-size:24px;opacity:.5}
    .quick-panel-item-info{flex:1;min-width:0}
    .quick-panel-item-name{font-size:14px;font-weight:500;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .quick-panel-item-group{font-size:12px;color:rgba(255,255,255,.5);margin-top:2px}
    .quick-panel-item-time{font-size:11px;color:rgba(255,255,255,.4)}
    .quick-panel-empty{text-align:center;padding:40px 20px;color:rgba(255,255,255,.5)}
    .quick-panel-empty-icon{font-size:48px;margin-bottom:12px;opacity:.3}
    .quick-panel-empty-text{font-size:14px}

    /* 在线人数显示 */
    .online-counter{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.6);font-size:13px;margin-left:40px}
    .online-dot{width:8px;height:8px;border-radius:50%;background:#34c759;animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .online-count{font-weight:600;color:#34c759}

    /* 点击波纹效果 */
    .ripple{position:relative;overflow:hidden}
    .ripple-effect{position:absolute;border-radius:50%;background:rgba(255,255,255,.3);transform:scale(0);animation:ripple 0.6s linear;pointer-events:none}
    @keyframes ripple{to{transform:scale(4);opacity:0}}

    /* 加载指示器 */
    .loading-indicator{position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:1001;background:rgba(20,20,20,.95);backdrop-filter:blur(20px);padding:16px 32px;border-radius:8px;display:none;align-items:center;gap:12px;box-shadow:0 4px 20px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1)}
    .loading-indicator.active{display:flex;animation:fadeIn 0.3s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    .loading-spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite}
    .loading-text{font-size:14px;color:#fff}

    /* 点击高亮动画 */
    .click-highlight{animation:clickPulse 0.3s ease}
    @keyframes clickPulse{0%{transform:scale(1)}50%{transform:scale(0.95)}100%{transform:scale(1)}}

    /* 播放提示动画 */
    .playing-indicator{display:flex;align-items:center;gap:6px;color:#e50914;font-size:12px;font-weight:600;animation:fadeInUp 0.3s ease}
    @keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .playing-dots{display:flex;gap:3px}
    .playing-dot{width:6px;height:6px;background:#e50914;border-radius:50%;animation:playingDot 1s ease-in-out infinite}
    .playing-dot:nth-child(2){animation-delay:0.2s}
    .playing-dot:nth-child(3){animation-delay:0.4s}
    @keyframes playingDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(0.8)}}

    /* Toast 提示组件（已隐藏） */
    /* .toast-container{position:fixed;top:90px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:12px;pointer-events:none}
    .toast{min-width:320px;max-width:500px;padding:16px 20px;border-radius:10px;color:#fff;font-size:14px;line-height:1.5;box-shadow:0 8px 30px rgba(0,0,0,.4);pointer-events:auto;backdrop-filter:blur(10px);animation:toastSlideIn 0.3s ease;transition:all 0.2s}
    .toast.error{background:linear-gradient(135deg,rgba(231,9,20,.9) 0%,rgba(220,38,38,.9) 100%);border:1px solid rgba(239,68,68,.3)}
    .toast.warning{background:linear-gradient(135deg,rgba(234,179,8,.9) 0%,rgba(245,158,11,.9) 100%);border:1px solid rgba(251,191,36,.3)}
    .toast.success{background:linear-gradient(135deg,rgba(34,197,94,.9) 0%,rgba(22,163,74,.9) 100%);border:1px solid rgba(74,222,128,.3)}
    .toast.info{background:linear-gradient(135deg,rgba(59,130,246,.9) 0%,rgba(37,99,235,.9) 100%);border:1px solid rgba(96,165,250,.3)}
    .toast-title{font-weight:600;margin-bottom:4px;font-size:15px}
    .toast-message{color:rgba(255,255,255,.85);white-space:pre-wrap}
    .toast-close{position:absolute;top:12px;right:12px;width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.15);border:none;cursor:pointer;color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .toast-close:hover{background:rgba(255,255,255,.25);transform:scale(1.1)}
    @keyframes toastSlideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toastSlideOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}
    .toast.hiding{animation:toastSlideOut 0.3s ease forwards} */

    @media (max-width:1024px){
      .sidebar{display:none}
      .content{margin-left:0}
      .footer{margin-left:0}
      .channels-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
      .player-wrapper.collapsed{width:360px;height:200px}
    }
    .mobile-menu-btn{display:none}
    .mobile-menu{display:none}
    .mobile-menu-overlay{display:none}
    .mobile-search-header{display:none}

    @media (max-width:768px){
      .header{padding:0 12px;height:60px;justify-content:flex-start;gap:12px}
      .logo{font-size:18px;flex-shrink:0}
      .header-left{gap:10px}
      .online-counter{font-size:11px;display:none}
      .header-right{display:none}
      .mobile-search-header{display:flex;flex:1;max-width:200px;margin-left:auto}
      .mobile-search-header .search-input{width:100%;padding:8px 12px;font-size:14px}
      .mobile-menu-btn{display:flex;width:40px;height:40px;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:none;border-radius:8px;cursor:pointer;color:rgba(255,255,255,.7);font-size:20px;flex-shrink:0}
      .mobile-menu{display:block;position:fixed;top:0;right:-100%;width:280px;height:100vh;background:#1a1a1a;z-index:1000;transition:right .3s ease;overflow-y:auto;padding:20px}
      .mobile-menu.open{right:0}
      .mobile-menu-overlay{display:block;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:999;opacity:0;visibility:hidden;transition:all .3s}
      .mobile-menu-overlay.open{opacity:1;visibility:visible}
      .mobile-menu-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,.1)}
      .mobile-menu-title{font-size:16px;font-weight:600;color:#fff}
      .ad-banner-top{display:none}
      .ad-banner-bottom{display:none}
      .ad-sidebar{display:none}
      .ad-mobile-top{display:flex;justify-content:center}
      .ad-mobile-bottom{display:flex;justify-content:center}
      .mobile-menu-close{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:none;border-radius:6px;cursor:pointer;color:rgba(255,255,255,.7);font-size:20px}
      .mobile-section{margin-bottom:25px}
      .mobile-section-title{font-size:12px;font-weight:600;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
      .mobile-actions{display:flex;gap:10px;margin-bottom:20px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:5px}
      .mobile-actions::-webkit-scrollbar{display:none}
      .mobile-actions::-webkit-scrollbar{display:none}
      .mobile-action-btn{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:70px;padding:12px 8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,.7);flex-shrink:0}
      .mobile-action-btn:hover{background:rgba(255,255,255,.1);color:#fff}
      .mobile-action-btn .icon{font-size:24px}
      .mobile-action-btn .label{font-size:11px;color:rgba(255,255,255,.6);white-space:nowrap}
      .mobile-lang-menu{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:5px}
      .mobile-lang-menu::-webkit-scrollbar{display:none}
      .mobile-lang-item{padding:10px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,.7);font-size:14px;white-space:nowrap;flex-shrink:0}
      .mobile-lang-item:hover{background:rgba(255,255,255,.1);color:#fff}
      .mobile-lang-item.active{background:rgba(229,9,20,.2);border-color:#e50914;color:#fff;font-weight:600}
      .mobile-group-item{padding:12px 16px;color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;font-size:14px;border-left:3px solid transparent}
      .mobile-group-item:hover{color:#fff;background:rgba(255,255,255,.05)}
      .mobile-group-item.active{color:#fff;background:rgba(229,9,20,.1);border-left-color:#e50914;font-weight:600}
      .sidebar{display:none}
      .sidebar.mobile-open{display:block;position:static;width:100%;height:auto;border-right:none;border-bottom:1px solid rgba(255,255,255,.1);padding:0 0 20px 0}
      .content{margin-left:0;padding:15px}
      .channels-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
      /* 移动端播放器特殊样式 */
      .player-wrapper{position:fixed;top:60px;left:0;right:0;width:100% !important;height:0;overflow:hidden;border-radius:0;box-shadow:0 4px 20px rgba(0,0,0,.5);transition:all .3s ease}
      .player-wrapper.active{height:calc(100vw * 9 / 16 + 50px);min-height:270px;max-height:370px;z-index:999}
      .player-wrapper.expanded{height:calc(100vh - 60px);width:100% !important;right:0 !important;left:0 !important;top:60px;bottom:auto}
      .player-wrapper.collapsed{height:calc(100vw * 9 / 16 + 50px);min-height:270px;max-height:370px;width:100% !important;right:0 !important;left:0 !important;top:60px;bottom:auto}
      .player-container{height:calc(100% - 50px)}
      /* 内容区域添加顶部间距，避免被播放器遮挡 */
      .main{margin-top:60px;padding-top:0}
      .main.player-active{padding-top:330px}
      .main.player-expanded{padding-top:calc(100vh - 60px)}
      .player-title{font-size:12px}
      .player-group{font-size:11px}
      .pagination{flex-wrap:wrap;gap:6px;padding:15px 0}
      .pagination button{padding:6px 12px;font-size:12px}
      .pagination-info{width:100%;text-align:center;margin-bottom:10px}
    }
    @media (max-width:480px){
      .header{padding:0 10px}
      .logo{font-size:16px}
      .mobile-menu{width:100%}
      .mobile-action-btn{min-width:60px;padding:10px 6px}
      .mobile-action-btn .icon{font-size:20px}
      .mobile-action-btn .label{font-size:10px}
      .main{margin-top:60px}
      .channels-grid{grid-template-columns:repeat(2,1fr);gap:8px}
      .channel-card{padding:8px}
      .channel-name{font-size:13px}
      .channel-group{font-size:11px}
    }
  </style>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2205598928191137"
     crossorigin="anonymous"></script>
</head>
<body>
  <header class="header">
    <div class="header-left">
      <div class="logo">IPTV Live</div>
      <div class="online-counter">
        <span class="online-dot"></span>
        <span class="online-count" id="onlineCount">0</span> <span id="onlineCountText">人在观看</span>
      </div>
    </div>
    <div class="header-right">
      <div class="search-box">
        <input type="text" class="search-input" id="searchInput" placeholder="搜索频道..." oninput="handleSearch()">
      </div>
      <div class="quick-entries">
        <button class="quick-entry ripple" onclick="handleQuickEntryClick(event, 'history')" data-tip-key="history">
          🕐
          <span class="quick-entry-tip">播放历史</span>
          <span class="quick-entry-badge" id="historyBadge" style="display:none;">0</span>
        </button>
        <button class="quick-entry ripple" onclick="handleQuickEntryClick(event, 'favorites')" data-tip-key="favorites">
          ⭐
          <span class="quick-entry-tip">我的收藏</span>
          <span class="quick-entry-badge" id="favoritesBadge" style="display:none;">0</span>
        </button>
        <button class="quick-entry ripple" onclick="handleQuickEntryClick(event, 'random')" data-tip-key="random">
          🎯
          <span class="quick-entry-tip">随机推荐</span>
        </button>
        <button class="quick-entry ripple" onclick="handleQuickEntryClick(event, 'clearCache')" data-tip-key="clearCache" style="display:none;">
          🗑️
          <span class="quick-entry-tip">清除缓存</span>
        </button>
        <div class="lang-dropdown" id="langDropdown">
          <button class="quick-entry ripple lang-switcher" onclick="toggleLangDropdown()">
            🌐
            <span class="quick-entry-tip">切换语言</span>
          </button>
          <div class="lang-dropdown-menu">
            <div class="lang-dropdown-item active" data-lang="zh-CN" onclick="switchLanguage('zh-CN')">简体中文</div>
            <div class="lang-dropdown-item" data-lang="zh-TW" onclick="switchLanguage('zh-TW')">繁體中文</div>
            <div class="lang-dropdown-item" data-lang="en" onclick="switchLanguage('en')">English</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-search-header">
      <input type="text" class="search-input" id="mobileHeaderSearchInput" placeholder="搜索..." oninput="handleMobileHeaderSearch()">
    </div>
    <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
      ☰
    </button>
  </header>

  <!-- 移动端菜单 -->
  <div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="toggleMobileMenu()"></div>
  <div class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-header">
      <div class="mobile-menu-title" data-i18n="menu">菜单</div>
      <button class="mobile-menu-close" onclick="toggleMobileMenu()">✕</button>
    </div>

    <div class="mobile-section">
      <div class="mobile-section-title" data-i18n="quickActions">快捷操作</div>
      <div class="mobile-actions">
        <div class="mobile-action-btn" onclick="handleMobileAction('history')">
          <span class="icon">🕐</span>
        </div>
        <div class="mobile-action-btn" onclick="handleMobileAction('favorites')">
          <span class="icon">⭐</span>
        </div>
        <div class="mobile-action-btn" onclick="handleMobileAction('random')">
          <span class="icon">🎯</span>
        </div>
      </div>
    </div>

    <div class="mobile-section">
      <div class="mobile-section-title" data-i18n="language">语言</div>
      <div class="mobile-lang-menu">
        <div class="mobile-lang-item active" data-lang="zh-CN" onclick="switchLanguage('zh-CN')">简体中文</div>
        <div class="mobile-lang-item" data-lang="zh-TW" onclick="switchLanguage('zh-TW')">繁體中文</div>
        <div class="mobile-lang-item" data-lang="en" onclick="switchLanguage('en')">English</div>
      </div>
    </div>

    <div class="mobile-section">
      <div class="mobile-section-title" data-i18n="groupNav">分组导航</div>
      <div id="mobileGroupList"></div>
    </div>
  </div>

  <div class="main">
    <aside class="sidebar" id="sidebar">
      <div class="group-item active" data-group="" onclick="filterByGroup('')">全部频道</div>
      <div id="groupList"></div>
    </aside>

    <div class="content">
      <div id="loading" class="loading">
        <div class="spinner"></div>
        <span class="loading-text">Loading...</span>
      </div>

      <div id="channelList" style="display:none;">
        <div class="section-title" id="sectionTitle">全部频道</div>
        <div class="channels-grid" id="channelsGrid"></div>
        <div class="pagination" id="pagination"></div>

       
      </div>

      <div id="emptyState" class="empty-state" style="display:none;">
        <div class="empty-icon">📺</div>
        <div class="empty-title">未找到频道</div>
        <div class="empty-desc">请尝试其他搜索词或分组</div>
      </div>

    </div>
  </div>

  <!-- 快捷面板 -->
  <div class="quick-panel" id="quickPanel">
    <div class="quick-panel-header">
      <div class="quick-panel-title" id="quickPanelTitle">📌 面板</div>
      <button class="quick-panel-close" onclick="closeQuickPanel()">&times;</button>
    </div>
    <div class="quick-panel-content" id="quickPanelContent"></div>
  </div>

  <!-- 加载指示器 -->
  <div class="loading-indicator" id="loadingIndicator">
    <div class="loading-spinner"></div>
    <div class="loading-text" id="loadingText">Loading...</div>
  </div>

      <!-- Toast 提示容器（已隐藏） -->
  <!-- <div class="toast-container" id="toastContainer"></div> -->

  <footer class="footer">
    <p>&copy; 2024 IPTV Live. 免费高清直播服务</p>
    <!-- SEO 友好链接 -->
    <div style="margin-top:15px;font-size:12px;color:rgba(255,255,255,.4);">
      <a href="/sitemap.xml" style="color:rgba(255,255,255,.6);text-decoration:none;margin:0 10px;">网站地图</a>
      <a href="/robots.txt" style="color:rgba(255,255,255,.6);text-decoration:none;margin:0 10px;">Robots</a>
      <a href="/privacy-policy" style="color:rgba(255,255,255,.6);text-decoration:none;margin:0 10px;">隐私政策</a>
      <a href="/terms" style="color:rgba(255,255,255,.6);text-decoration:none;margin:0 10px;">服务条款</a>
    </div>
  </footer>

  <div class="player-wrapper collapsed" id="playerWrapper">
    <div class="player-header" id="playerHeader">
      <div class="player-info">
        <div class="player-title" id="playerTitle">频道名称</div>
        <div class="player-group" id="playerGroup">分组</div>
      </div>
      <div class="player-controls">
        <button class="player-btn" onclick="togglePlayerSize()" title="切换大小">⛶</button>
        <button class="player-btn close-modal" onclick="closePlayer()" title="关闭">&times;</button>
      </div>
    </div>
    <div class="player-container">
      <video id="videoPlayer" controls autoplay>
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <script>
    // 安全检测：阻止在非原始域名上运行（防止代理）
    (function() {
      const currentDomain = window.location.hostname;
      const originalDomain = window.location.hostname; // 实际部署时应该硬编码你的域名
      // 允许 localhost 和原始域名
      const allowedDomains = [originalDomain, 'localhost', '127.0.0.1'];
      // 注意：这里没有硬编码域名，因为代码是在运行时嵌入的
      // 可以通过 worker 注入一个 ALLOWED_DOMAIN 变量
      if (window.ALLOWED_DOMAINS && !window.ALLOWED_DOMAINS.some(d => currentDomain === d || currentDomain.endsWith('.' + d))) {
        alert('此页面无法在当前域名运行，请访问原始站点');
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#fff;background:#000;"><h1>访问被拒绝</h1></div>';
        throw new Error('Domain mismatch');
      }
    })();

    // ========== 语言配置和翻译 ==========
    const translations = {
      'zh-CN': {
        title: 'IPTV Live - 免费直播',
        searchPlaceholder: '搜索频道...',
        allChannels: '全部频道',
        search: '搜索',
        history: '播放历史',
        favorites: '我的收藏',
        random: '随机推荐',
        clearCache: '清除缓存',
        onlineCount: '人在观看',
        hot: '热门',
        recommend: '推荐',
        quickActions: '快捷操作',
        language: '语言',
        menu: '菜单',
        groupNav: '分组导航',
        noHistory: '暂无播放历史',
        noHistoryDesc: '观看的频道会自动显示在这里',
        noFavorites: '还没有收藏',
        noFavoritesDesc: '点击频道卡片上的星星按钮添加收藏',
        noRecommendations: '暂无推荐频道',
        noRecommendationsDesc: '请稍后再试',
        noChannels: '未找到频道',
        noChannelsDesc: '请尝试其他搜索词或分组',
        loading: '加载频道列表...',
        loadingRecommendations: '正在加载推荐...',
        searching: '搜索中...',
        page: '页',
        totalPages: '共',
        firstPage: '首页',
        prevPage: '上一页',
        nextPage: '下一页',
        lastPage: '末页',
        loadingCache: '正在加载频道...',
        cacheCleared: '缓存已清除',
        playing: '正在播放'
      },
      'zh-TW': {
        title: 'IPTV Live - 免費直播',
        searchPlaceholder: '搜尋頻道...',
        allChannels: '全部頻道',
        search: '搜尋',
        history: '播放歷史',
        favorites: '我的收藏',
        random: '隨機推薦',
        clearCache: '清除緩存',
        onlineCount: '人在觀看',
        hot: '熱門',
        recommend: '推薦',
        quickActions: '快捷操作',
        language: '語言',
        menu: '菜單',
        groupNav: '分組導航',
        noHistory: '暫無播放歷史',
        noHistoryDesc: '觀看的頻道會自動顯示在這裡',
        noFavorites: '還沒有收藏',
        noFavoritesDesc: '點擊頻道卡片上的星星按鈕添加收藏',
        noRecommendations: '暫無推薦頻道',
        noRecommendationsDesc: '請稍後再試',
        noChannels: '未找到頻道',
        noChannelsDesc: '請嘗試其他搜尋詞或分組',
        loading: '加載頻道列表...',
        loadingRecommendations: '正在加載推薦...',
        searching: '搜尋中...',
        page: '頁',
        totalPages: '共',
        firstPage: '首頁',
        prevPage: '上一頁',
        nextPage: '下一頁',
        lastPage: '末頁',
        loadingCache: '正在加載頻道...',
        cacheCleared: '緩存已清除',
        playing: '正在播放'
      },
      'en': {
        title: 'IPTV Live - Free Live TV',
        searchPlaceholder: 'Search channels...',
        allChannels: 'All Channels',
        search: 'Search',
        history: 'Watch History',
        favorites: 'My Favorites',
        random: 'Random Picks',
        clearCache: 'Clear Cache',
        onlineCount: 'viewers online',
        hot: 'HOT',
        recommend: 'RECOMMENDED',
        quickActions: 'Quick Actions',
        language: 'Language',
        menu: 'Menu',
        groupNav: 'Group Navigation',
        noHistory: 'No watch history',
        noHistoryDesc: 'Channels you watch will appear here',
        noFavorites: 'No favorites yet',
        noFavoritesDesc: 'Click the star button on channel cards to add favorites',
        noRecommendations: 'No recommendations',
        noRecommendationsDesc: 'Please try again later',
        noChannels: 'No channels found',
        noChannelsDesc: 'Try different search terms or groups',
        loading: 'Loading channels...',
        loadingRecommendations: 'Loading recommendations...',
        searching: 'Searching...',
        page: 'Page',
        totalPages: 'Total',
        firstPage: 'First',
        prevPage: 'Prev',
        nextPage: 'Next',
        lastPage: 'Last',
        loadingCache: 'Loading channels...',
        cacheCleared: 'Cache cleared',
        playing: 'Now Playing'
      }
    };

    // 获取当前语言的翻译文本
    function t(key) {
      return translations[currentLanguage][key] || translations['zh-CN'][key] || key;
    }

    // 切换语言
    function toggleLangDropdown() {
      const dropdown = document.getElementById('langDropdown');
      dropdown.classList.toggle('open');
    }

    // 移动端菜单
    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      menu.classList.toggle('open');
      overlay.classList.toggle('open');
    }

    function handleMobileSearch() {
      const value = document.getElementById('mobileHeaderSearchInput').value;
      document.getElementById('searchInput').value = value;
      handleSearch();
    }

    function handleMobileHeaderSearch() {
      const value = document.getElementById('mobileHeaderSearchInput').value;
      document.getElementById('searchInput').value = value;
      handleSearch();
    }

    function handleMobileAction(action) {
      toggleMobileMenu();
      handleQuickEntryClick({ preventDefault: () => {} }, action);
    }

    function switchLanguage(lang) {
      currentLanguage = lang;

      // 更新按钮状态
      document.querySelectorAll('.lang-dropdown-item').forEach(item => {
        item.classList.toggle('active', item.dataset.lang === lang);
      });

      // 更新移动端语言菜单状态
      document.querySelectorAll('.mobile-lang-item').forEach(item => {
        item.classList.toggle('active', item.dataset.lang === lang);
      });

      // 关闭下拉菜单
      document.getElementById('langDropdown').classList.remove('open');

      // 关闭移动端菜单（如果打开）
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('open');
      }

      // 更新 HTML lang 属性
      document.documentElement.lang = lang;

      // 保存语言设置
      localStorage.setItem('iptv_language', lang);

      // 刷新页面内容
      updateLanguageContent();
    }

    // 更新页面语言内容
    function updateLanguageContent() {
      // 更新标题
      document.title = t('title');

      // 更新搜索框
      document.getElementById('searchInput').placeholder = t('searchPlaceholder');

      // 更新移动端header搜索框
      const mobileHeaderSearchInput = document.getElementById('mobileHeaderSearchInput');
      if (mobileHeaderSearchInput) {
        mobileHeaderSearchInput.placeholder = t('searchPlaceholder');
      }

      // 更新所有带有 data-i18n 属性的元素
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          el.textContent = t(key);
        }
      });

      // 更新移动端全部频道分组
      const mobileAllChannelsItem = document.querySelector('.mobile-group-item[data-group=""]');
      if (mobileAllChannelsItem) {
        mobileAllChannelsItem.textContent = t('allChannels');
      }

      // 更新快捷按钮提示
      document.querySelectorAll('.quick-entry[data-tip-key]').forEach(btn => {
        const tipKey = btn.dataset.tipKey;
        const tipEl = btn.querySelector('.quick-entry-tip');
        if (tipEl && tipKey) {
          tipEl.textContent = t(tipKey);
          btn.setAttribute('title', t(tipKey));
        }
      });

      // 更新在线人数文本
      document.getElementById('onlineCountText').textContent = t('onlineCount');

      // 更新全部频道分组
      const allChannelsItem = document.querySelector('.group-item[data-group=""]');
      if (allChannelsItem) {
        allChannelsItem.textContent = t('allChannels');
      }

      // 更新移动端分组列表
      document.querySelectorAll('.mobile-group-item[data-group]:not([data-group=""])').forEach(item => {
        // 分组名称不翻译，保持原样
      });

      // 更新移动端语言选项 - 不更新，保持各语言的原名显示
      // 语言选项应该是：简体中文、繁體中文、English，不随选择的语言变化而变化

      // 更新当前页面标题
      const sectionTitle = document.getElementById('sectionTitle');
      if (sectionTitle) {
        if (currentGroup === 'history') {
          sectionTitle.textContent = '🕐 ' + t('history');
        } else if (currentGroup === 'favorites') {
          sectionTitle.textContent = '⭐ ' + t('favorites');
        } else if (currentGroup === 'random') {
          sectionTitle.textContent = '🎯 ' + t('random');
        } else if (currentSearch) {
          sectionTitle.textContent = t('search') + ': ' + currentSearch;
        } else {
          sectionTitle.textContent = currentGroup || t('allChannels');
        }
      }

      // 重新渲染当前内容以更新文本
      if (currentGroup === 'history') {
        showHistoryInMain();
      } else if (currentGroup === 'favorites') {
        showFavoritesInMain();
      } else if (currentGroup === 'random') {
        showRandomInMain();
      } else if (allChannels.length > 0) {
        renderChannels(allChannels);
      }

      // 更新分页
      renderPagination();
    }

    // ========== AES-GCM 解密函数 ==========
    async function decryptAES(encryptedBase64, secret) {
      try {
        // 从密钥派生加密密钥
        const keyData = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        // 从 Base64 解码
        const binaryString = atob(encryptedBase64);
        const combined = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          combined[i] = binaryString.charCodeAt(i);
        }

        // 分离 IV (前 12 bytes)
        const iv = combined.slice(0, 12);
        const encryptedData = combined.slice(12);

        // 解密
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: iv },
          key,
          encryptedData
        );

        return new TextDecoder().decode(decrypted);
      } catch (error) {
        console.error('AES 解密失败:', error);
        throw error;
      }
    }

    // 解密密钥（需要与服务器端SECRET_KEY保持一致）
    // 注意：生产环境中不应该在前端硬编码密钥，应该通过其他方式传递
    // 这里为了演示，使用一个默认值。实际部署时应该通过环境变量或配置注入
    const DECRYPTION_KEY = window.DECRYPTION_KEY || 'default-secret-key';

    const API_BASE = '/api';
    let currentLanguage = 'zh-CN';  // 当前语言
    let allChannels = [];
    let allGroups = [];
    let currentGroup = '';
    let searchTimeout = null;
    let currentHls = null;
    let isPlayerOpen = false;
    let isPlayerExpanded = false;
    let currentPlayRequestId = 0;  // 播放请求ID，用于取消之前的请求
    let activeFetchControllers = [];  // 活跃的 AbortController 列表
    let currentPage = 1;
    let pageSize = 50;
    let totalPages = 1;
    let totalChannels = 0;
    let currentSearch = '';
    let favorites = JSON.parse(localStorage.getItem('iptv_favorites') || '[]');
    let history = JSON.parse(localStorage.getItem('iptv_history') || '[]');
    let featuredChannels = [];
    let isUpdatingKey = false;  // 防止重复更新密钥
    // let lastErrorTime = 0;  // 防止重复显示相同错误（已禁用）
    // let lastErrorMsg = '';   // 记录上一条错误消息（已禁用）

    // 从 localStorage 读取用户语言设置
    const savedLanguage = localStorage.getItem('iptv_language');
    if (savedLanguage && ['zh-CN', 'zh-TW', 'en'].includes(savedLanguage)) {
      currentLanguage = savedLanguage;
    }

    // 页面加载时获取频道列表
    window.addEventListener('DOMContentLoaded', () => {
      // 初始化语言
      switchLanguage(currentLanguage);

      // SEO: 动态更新页面标题和描述
      updateSEOMeta();

      // 尝试从缓存加载分组数据，快速渲染分组列表
      const cachedGroups = getFromCache(getCacheKey('groups'));
      if (cachedGroups && cachedGroups.length > 0) {
        allGroups = cachedGroups;
        renderGroups();
        console.log('[Cache] 从缓存加载分组:', allGroups.length, '个分组');
      }

      loadChannels();
      updateOnlineCounter();
      updateBadges();
      setInterval(updateOnlineCounter, 30000); // 每30秒更新在线人数
    });

    // ========== SEO 优化函数 ==========

    // 动态更新页面SEO元信息
    function updateSEOMeta() {
      // 更新页面标题
      let title = 'IPTV Live - 免费高清直播平台';
      let description = 'IPTV Live提供免费的在线直播服务，包含2000+高清频道，支持体育、新闻、娱乐、电影等全类型频道，无需注册，一键播放，多设备同步观看。';

      if (currentGroup) {
        title = currentGroup + ' - IPTV Live 免费直播';
        description = '观看' + currentGroup + '频道直播，IPTV Live提供' + currentGroup + '相关的免费高清直播内容，实时更新，画面清晰，播放流畅。';
      } else if (currentSearch) {
        title = currentSearch + ' - IPTV Live 搜索结果';
        description = '搜索"' + currentSearch + '"的频道，找到' + totalChannels + '个相关频道，IPTV Live免费高清直播平台。';
      } else if (currentGroup === 'history') {
        title = '播放历史 - IPTV Live';
        description = '查看您的观看历史记录，IPTV Live自动保存最近观看的频道，方便快速访问。';
      } else if (currentGroup === 'favorites') {
        title = '我的收藏 - IPTV Live';
        description = '管理您收藏的频道，IPTV Live收藏功能让您快速访问喜爱的内容。';
      } else if (currentGroup === 'random') {
        title = '随机推荐 - IPTV Live';
        description = '随机发现精彩频道，IPTV Live智能推荐让您探索更多优质直播内容。';
      }

      // 更新document title
      document.title = title;

      // 更新meta description
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('name', 'twitter:title', title);
      updateMetaTag('name', 'twitter:description', description);
    }

    // 更新或创建meta标签
    function updateMetaTag(attribute, name, content) {
      let meta = document.querySelector(\`meta[\${attribute}="\${name}"]\`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    }

    function showToast(message, type = 'info', duration = 4000, checkModal = false) {
      // 如果需要检查modal状态且modal已关闭，则不显示Toast
      if (checkModal && !isModalOpen) {
        console.log('[Toast] Modal已关闭，跳过Toast显示');
        return;
      }

      // 防止重复显示相同错误（1秒内的相同错误只显示一次）
      const now = Date.now();
      if (type === 'error' && message === lastErrorMsg && now - lastErrorTime < 1000) {
        console.log('[Toast] 跳过重复错误');
        return;
      }
      lastErrorMsg = message;
      lastErrorTime = now;

      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = \`toast \${type}\`;

      let title = '';
      switch (type) {
        case 'error':
          title = '❌ 播放失败';
          break;
        case 'warning':
          title = '⚠️ 提示';
          break;
        case 'success':
          title = '✅ 成功';
          break;
        case 'info':
        default:
          title = 'ℹ️ 提示';
          break;
      }

      toast.innerHTML = \`
        <div style="position:relative;padding-right:30px">
          <div class="toast-title">\${title}</div>
          <div class="toast-message">\${message}</div>
          <button class="toast-close">&times;</button>
        </div>
      \`;

      container.appendChild(toast);

      // 点击关闭按钮
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.onclick = () => removeToast(toast);

      // 自动移除
      const timeout = setTimeout(() => removeToast(toast), duration);

      // 鼠标悬停时暂停自动移除
      toast.onmouseenter = () => clearTimeout(timeout);
      toast.onmouseleave = () => {
        setTimeout(() => removeToast(toast), duration);
      };
    }

    function removeToast(toast) {
      if (!toast || toast.classList.contains('hiding')) return;
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }

    // 页面加载时获取频道列表
    window.addEventListener('DOMContentLoaded', () => {
      // 尝试从缓存加载分组数据，快速渲染分组列表
      const cachedGroups = getFromCache(getCacheKey('groups'));
      if (cachedGroups && cachedGroups.length > 0) {
        allGroups = cachedGroups;
        renderGroups();
        console.log('[Cache] 从缓存加载分组:', allGroups.length, '个分组');
      }

      loadChannels();
      updateOnlineCounter();
      updateBadges();
      setInterval(updateOnlineCounter, 30000); // 每30秒更新在线人数
    });

    // ========== 本地缓存工具函数 ==========

    // 缓存键前缀
    const CACHE_PREFIX = 'iptv_cache_';
    const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6小时（毫秒）

    // 生成缓存键
    function getCacheKey(type, params = '') {
      return CACHE_PREFIX + type + '_' + params;
    }

    // 从本地缓存读取
    function getFromCache(key) {
      try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const data = JSON.parse(cached);
        const now = Date.now();

        // 检查是否过期
        if (data.timestamp && now - data.timestamp < CACHE_DURATION) {
          console.log('[Cache] 从缓存读取:', key);
          return data.value;
        } else {
          // 过期删除
          localStorage.removeItem(key);
          console.log('[Cache] 缓存已过期:', key);
          return null;
        }
      } catch (error) {
        console.error('[Cache] 读取缓存失败:', error);
        return null;
      }
    }

    // 写入本地缓存
    function setCache(key, value) {
      try {
        const data = {
          timestamp: Date.now(),
          value: value
        };
        localStorage.setItem(key, JSON.stringify(data));
        console.log('[Cache] 已缓存:', key);
      } catch (error) {
        console.error('[Cache] 写入缓存失败:', error);
      }
    }

    // 清除缓存
    function clearCache() {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
        console.log('[Cache] 已清除所有缓存');
      } catch (error) {
        console.error('[Cache] 清除缓存失败:', error);
      }
    }
    
    async function loadChannels(page = 1, updateGroups = true) {
      try {
        const params = new URLSearchParams({
          page: page,
          page_size: pageSize
        });
        if (currentSearch) {
          params.append('search', currentSearch);
        }
        // 搜索时不要分组限制，只在非搜索状态下才应用分组过滤
        if (currentGroup && !currentSearch) {
          params.append('group', currentGroup);
        }

        // 生成缓存键（搜索时和分组过滤时使用缓存，分页使用缓存）
        const paramsStr = params.toString();
        const cacheKey = getCacheKey('channels', paramsStr);

        // 尝试从缓存读取
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
          // 使用缓存数据
          currentPage = cachedData.pagination?.page || 1;
          totalPages = cachedData.pagination?.total_pages || 1;
          totalChannels = cachedData.pagination?.total || 0;
          allChannels = cachedData.channels || [];

          // 需要更新分组时才更新（搜索时不更新）
          if (updateGroups) {
            allGroups = cachedData.groups || [];
            renderGroups();
          }

          renderChannels(allChannels);
          renderPagination();

          document.getElementById('loading').style.display = 'none';
          document.getElementById('channelList').style.display = 'block';

          // 隐藏加载指示器
          hideLoadingIndicator();

          return;
        }

        // 缓存未命中，从服务器获取
        const response = await fetch(API_BASE + '/channels?' + paramsStr);
        const data = await response.json();


        if (data.success) {
          currentPage = data.pagination?.page || 1;
          totalPages = data.pagination?.total_pages || 1;
          totalChannels = data.pagination?.total || 0;
          allChannels = data.channels || [];

          // 需要更新分组时才更新（搜索时不更新）
          if (updateGroups) {
            allGroups = data.groups || [];
            renderGroups();
          }

          renderChannels(allChannels);
          renderPagination();

          document.getElementById('loading').style.display = 'none';
          document.getElementById('channelList').style.display = 'block';

          // 缓存数据（6小时）
          setCache(cacheKey, data);

          // 单独缓存分组数据（用于快速访问）
          if (updateGroups && data.groups) {
            const groupsCacheKey = getCacheKey('groups');
            setCache(groupsCacheKey, data.groups);
          }

          // 隐藏加载指示器
          hideLoadingIndicator();
        } else {
          showError(t('noChannels') + ': ' + t('noChannelsDesc'));
          hideLoadingIndicator();
        }
      } catch (error) {
        console.error('加载失败:', error);
        showError(t('noChannels') + ': ' + t('noChannelsDesc'));
        hideLoadingIndicator();
      }
    }
    
    function renderGroups() {
      const container = document.getElementById('groupList');
      container.innerHTML = allGroups.map(group =>
        \`<div class="group-item ripple" data-group="\${escapeHtml(group)}" onclick="filterByGroup('\${escapeHtml(group)}')">
          \${escapeHtml(group)}
        </div>\`
      ).join('');

      // 渲染移动端分组列表
      const mobileContainer = document.getElementById('mobileGroupList');
      if (mobileContainer) {
        mobileContainer.innerHTML = \`<div class="mobile-group-item active" data-group="" onclick="filterByGroup('')">\${t('allChannels')}</div>\` +
          allGroups.map(group =>
            \`<div class="mobile-group-item" data-group="\${escapeHtml(group)}" onclick="filterByGroup(&apos;\${escapeHtml(group)}&apos;)">
              \${escapeHtml(group)}
            </div>\`
          ).join('');
      }

      // 更新选中状态（包括硬编码的"全部频道"选项）
      document.querySelectorAll('.group-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === currentGroup) {
          item.classList.add('active');
        }

        // 添加波纹效果
        item.addEventListener('click', function(e) {
          createRipple(item);
        });
      });

      // 更新移动端分组选中状态
      document.querySelectorAll('.mobile-group-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === currentGroup) {
          item.classList.add('active');
        }

        // 添加点击事件关闭菜单
        item.addEventListener('click', function() {
          const mobileMenu = document.getElementById('mobileMenu');
          const overlay = document.getElementById('mobileMenuOverlay');
          if (mobileMenu && overlay) {
            mobileMenu.classList.remove('open');
            overlay.classList.remove('open');
          }
        });
      });
    }
    
    function renderChannels(channels) {
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');

      if (channels.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';
      container.innerHTML = channels.map(channel => {
        const logo = channel.logo
          ? \`<img src="\${escapeHtml(channel.logo)}" alt="\${escapeHtml(channel.channel_name)}">\`
          : '<div class="channel-icon">📺</div>';

        const isFavorited = favorites.some(f => f.hash === channel.channel_hash);
        const hotIndex = Math.floor(Math.random() * 20); // 随机显示热门标签
        const showHotTag = hotIndex === 0;

        return \`
          <div class="channel-card ripple" onclick="handleChannelClick(event, '\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')">
            <div class="channel-poster">
              \${logo}
              \${showHotTag ? '<div class="hot-tag">' + t('hot') + '</div>' : ''}
              <button class="favorite-btn \${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')" data-hash="\${escapeHtml(channel.channel_hash)}">\${isFavorited ? '⭐' : '☆'}</button>
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(channel.channel_name)}</div>
              <div class="channel-group">\${escapeHtml(channel.group_title || '')}</div>
            </div>
          </div>
        \`;
      }).join('');

      // 添加波纹效果
      container.querySelectorAll('.channel-card').forEach(card => {
        card.addEventListener('click', function(e) {
          createRipple(card);
        });
      });
    }
    
    function filterByGroup(group) {
      // 移动端：关闭菜单
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('open');
      }

      // 添加点击波纹效果
      const escapedGroup = escapeHtml(group);
      const clickedItem = document.querySelector(\`.group-item[data-group="\${escapedGroup}"]\`);
      if (clickedItem) {
        createRipple(clickedItem);
      }

      // 显示加载提示
      showLoadingIndicator(t('loadingCache'));

      currentGroup = group;
      currentPage = 1; // 重置到第一页

      // 更新标题
      if (group === 'history') {
        document.getElementById('sectionTitle').textContent = \`🕐 \${t('history')}\`;
      } else if (group === 'favorites') {
        document.getElementById('sectionTitle').textContent = \`⭐ \${t('favorites')}\`;
      } else if (group === 'random') {
        document.getElementById('sectionTitle').textContent = \`🎯 \${t('random')}\`;
      } else {
        document.getElementById('sectionTitle').textContent = group || t('allChannels');
      }

      // 如果是收藏分组，显示收藏列表
      if (group === 'favorites') {
        renderFavorites();
        document.getElementById('pagination').innerHTML = '';
        hideLoadingIndicator();
        return;
      }

      // 如果是播放历史，显示历史列表
      if (group === 'history') {
        showHistoryInMain();
        hideLoadingIndicator();
        return;
      }

      // 如果是随机推荐，显示推荐列表
      if (group === 'random') {
        showRandomInMain();
        hideLoadingIndicator();
        return;
      }

      // 重新加载频道
      loadChannels(1);
    }

    // 处理频道点击
    function handleChannelClick(event, hash, name, group) {
      // 添加点击高亮效果
      const card = event.currentTarget;
      card.classList.add('click-highlight');
      setTimeout(() => {
        card.classList.remove('click-highlight');
      }, 300);

      // 播放频道
      playChannel(hash, name, group);
    }

    // 处理快捷按钮点击
    function handleQuickEntryClick(event, type) {
      const button = event.currentTarget;
      createRipple(button);

      switch (type) {
        case 'history':
          showHistoryInMain();
          break;
        case 'favorites':
          showFavoritesInMain();
          break;
        case 'random':
          showRandomInMain();
          break;
        case 'clearCache':
          // 清除缓存并刷新
          clearCache();
          // 重新加载频道列表
          loadChannels(1, true);
          // 显示提示
          showPlayingIndicator(t('cacheCleared'));
          break;
      }
    }

    // 创建波纹效果
    function createRipple(element) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');

      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';

      element.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    // 显示加载指示器
    function showLoadingIndicator(text) {
      const indicator = document.getElementById('loadingIndicator');
      const loadingText = document.getElementById('loadingText');
      loadingText.textContent = text;
      indicator.classList.add('active');
    }

    // 隐藏加载指示器
    function hideLoadingIndicator() {
      const indicator = document.getElementById('loadingIndicator');
      indicator.classList.remove('active');
    }

    // 显示播放提示
    function showPlayingIndicator(channelName) {
      // 创建播放提示元素
      let indicator = document.getElementById('playingIndicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'playingIndicator';
        indicator.className = 'playing-indicator';
        indicator.style.cssText = 'position:fixed;top:80px;right:20px;z-index:1000;background:rgba(20,20,20,.95);backdrop-filter:blur(20px);padding:12px 20px;border-radius:8px;border:1px solid rgba(255,255,255,.1);box-shadow:0 4px 20px rgba(0,0,0,.5);';
        document.body.appendChild(indicator);
      }

      indicator.innerHTML = \`
        <div class="playing-dots">
          <div class="playing-dot"></div>
          <div class="playing-dot"></div>
          <div class="playing-dot"></div>
        </div>
        <span>\${t('playing')}: \${escapeHtml(channelName)}</span>
      \`;

      // 3秒后自动消失
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.style.animation = 'fadeInUp 0.3s ease reverse';
          setTimeout(() => {
            if (indicator.parentNode) {
              indicator.remove();
            }
          }, 300);
        }
      }, 3000);
    }
    
    function handleSearch() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const keyword = document.getElementById('searchInput').value.trim();

        if (!keyword) {
          currentSearch = '';
          currentPage = 1;
          // 清空搜索时需要更新分组列表
          loadChannels(1, true);
          return;
        }

        showLoadingIndicator(t('searching'));
        currentSearch = keyword;
        currentPage = 1; // 重置到第一页

        // 搜索时不更新分组列表，保持原有分组显示
        loadChannels(1, false);
        document.getElementById('sectionTitle').textContent = \`\${t('search')}: \${escapeHtml(keyword)}\`;
      }, 300);
    }

    function goToPage(page) {
      if (page >= 1 && page <= totalPages) {
        loadChannels(page);
        // 滚动到频道列表顶部
        document.getElementById('channelList').scrollIntoView({ behavior: 'smooth' });
      }
    }

    function renderPagination() {
      const container = document.getElementById('pagination');
      if (totalPages <= 1) {
        container.innerHTML = '';
        return;
      }

      let html = \`<span class="pagination-info">\${t('totalPages')} \${totalChannels}, \${t('page')} \${currentPage}/\${totalPages}</span>\`;
      html += \`<button onclick="goToPage(1)" \${currentPage === 1 ? 'disabled' : ''}>\${t('firstPage')}</button>\`;
      html += \`<button onclick="goToPage(\${currentPage - 1})" \${currentPage === 1 ? 'disabled' : ''}>\${t('prevPage')}</button>\`;

      const maxButtons = 7;
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);

      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToPage(\${i})" class="\${i === currentPage ? 'active' : ''}">\${i}</button>\`;
      }

      html += \`<button onclick="goToPage(\${currentPage + 1})" \${currentPage === totalPages ? 'disabled' : ''}>\${t('nextPage')}</button>\`;
      html += \`<button onclick="goToPage(\${totalPages})" \${currentPage === totalPages ? 'disabled' : ''}>\${t('lastPage')}</button>\`;

      container.innerHTML = html;
    }

    function playChannel(hash, name, group, retryCount = 0) {
      // 生成新的播放请求ID
      const requestId = ++currentPlayRequestId;
      console.log('[PlayChannel] Request #' + requestId + ':', name);

      // 取消之前所有未完成的请求
      abortAllFetches();
      cleanupVideoResources();

      // 检查这个请求是否已经被取消
      if (requestId !== currentPlayRequestId) {
        console.log('[PlayChannel] Request #' + requestId + ' was cancelled');
        return;
      }

      // 显示播放提示
      showPlayingIndicator(name);

      // 添加到历史记录 - 支持直接使用传入的参数
      const channel = allChannels.find(c => c.channel_hash === hash);
      if (channel) {
        addToHistory(channel);
      } else if (hash && name) {
        // 如果在当前列表中找不到频道，直接用传入参数创建历史记录
        addToHistory({
          channel_hash: hash,
          channel_name: name,
          group_title: group
        });
      }

      const playerWrapper = document.getElementById('playerWrapper');
      const video = document.getElementById('videoPlayer');
      const title = document.getElementById('playerTitle');
      const groupName = document.getElementById('playerGroup');

      title.textContent = name;
      groupName.textContent = group;

      // 如果播放器还没打开，先显示出来
      if (!isPlayerOpen) {
        playerWrapper.classList.add('active');
        // 移动端：播放器激活时，在main上添加class
        if (window.innerWidth <= 768) {
          document.querySelector('.main').classList.add('player-active');
        }
      }

      isPlayerOpen = true;

      // 创建新的 AbortController 用于这次请求
      const tokenController = new AbortController();
      const playController = new AbortController();
      activeFetchControllers.push(tokenController, playController);

      // 先获取token，再获取播放地址
      fetch(window.location.origin + '/api/token?hash=' + encodeURIComponent(hash), {
        signal: tokenController.signal
      })
        .then(res => {
          // 检查请求是否被取消
          if (requestId !== currentPlayRequestId) {
            throw new Error('Request cancelled');
          }
          return res.json();
        })
        .then(data => {
          // 再次检查
          if (requestId !== currentPlayRequestId) {
            throw new Error('Request cancelled');
          }

          if (data.success && data.token) {
            console.log('[PlayChannel] Request #' + requestId + ': Token received');
            // 使用token获取播放地址
            return fetch(window.location.origin + '/api/play/' + hash + '?token=' + encodeURIComponent(data.token), {
              signal: playController.signal
            });
          } else {
            throw new Error('Failed to get token');
          }
        })
        .then(res => {
          // 再次检查
          if (requestId !== currentPlayRequestId) {
            throw new Error('Request cancelled');
          }
          return res.json();
        })
        .then(data => {
          // 再次检查
          if (requestId !== currentPlayRequestId) {
            console.log('[PlayChannel] Request #' + requestId + ': Response received but cancelled');
            return;
          }

          if (data.success && data.play_url) {
            let playUrl = data.play_url;

            // 如果返回的是加密的URL，进行解密
            if (data.encoded && data.encryption === 'aes-gcm') {
              decryptAES(playUrl, DECRYPTION_KEY)
                .then(decryptedUrl => {
                  // 最后一次检查
                  if (requestId !== currentPlayRequestId) {
                    console.log('[PlayChannel] Request #' + requestId + ': Decrypted but cancelled');
                    return;
                  }
                  console.log('[PlayChannel] Request #' + requestId + ': URL decrypted:', decryptedUrl);
                  startPlay(decryptedUrl, video);
                })
                .catch(async (e) => {
                  console.error('[PlayChannel] URL decryption failed:', e);

                  // 如果是第一次解密失败，尝试更新密钥并重试
                  if (retryCount === 0) {
                    console.log('[PlayChannel] Try updating key and retry');
                    const keyUpdated = await updateEncryptionKey();
                    if (keyUpdated) {
                      console.log('[PlayChannel] Key updated, retrying');
                      playChannel(hash, name, group, 1);  // 重试一次
                      return;
                    }
                  }

                  // 更新密钥失败或已重试过，关闭播放器
                  console.error('[PlayChannel] Decryption failed, cannot play');
                  closePlayer();
                });
              return; // 异步解密，提前返回
            }

            console.log('[PlayChannel] Request #' + requestId + ': Play URL:', playUrl);
            startPlay(playUrl, video);
          } else {
            console.error('Channel temporarily unavailable');
            closePlayer();
          }
        })
        .catch(function(error) {
          if (error.name === 'AbortError' || error.message === 'Request cancelled') {
            console.log('[PlayChannel] Request #' + requestId + ' was cancelled');
            return;  // 静默处理取消的错误
          }
          console.error('[PlayChannel] Playback failed:', error);
          closePlayer();
        })
        .finally(() => {
          // 清理控制器
          const index = activeFetchControllers.indexOf(tokenController);
          if (index > -1) activeFetchControllers.splice(index, 1);
          const index2 = activeFetchControllers.indexOf(playController);
          if (index2 > -1) activeFetchControllers.splice(index2, 1);
        });
    }

    // 取消所有进行中的 fetch 请求
    function abortAllFetches() {
      if (activeFetchControllers.length > 0) {
        console.log('[Abort] Canceling ' + activeFetchControllers.length + ' pending requests');
        activeFetchControllers.forEach(controller => {
          try {
            controller.abort();
          } catch (e) {
            // 忽略已取消的控制器
          }
        });
        activeFetchControllers = [];
      }
    }

    // 清理视频资源
    function cleanupVideoResources() {
      const video = document.getElementById('videoPlayer');

      // 销毁 HLS 实例
      if (currentHls) {
        console.log('[Cleanup] Destroying HLS instance');
        currentHls.destroy();
        currentHls = null;
      }

      // 停止视频并清空源
      video.pause();
      video.src = '';
      video.load();
      video.removeAttribute('src');

      console.log('[Cleanup] Video resources cleaned');
    }

    function togglePlayerSize() {
      const playerWrapper = document.getElementById('playerWrapper');
      const mainElement = document.querySelector('.main');
      const rect = playerWrapper.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;

      if (!isPlayerExpanded) {
        // 从折叠状态切换到展开状态
        if (isMobile) {
          // 移动端：展开时调整main的padding-top
          mainElement.classList.remove('player-active');
          mainElement.classList.add('player-expanded');
        } else {
          // 桌面端：保存当前中心点
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // 清除定位，让 CSS 类控制
          playerWrapper.style.left = '';
          playerWrapper.style.right = '';
          playerWrapper.style.top = '';
          playerWrapper.style.bottom = '';
        }
      } else {
        // 从展开状态切换到折叠状态
        if (isMobile) {
          // 移动端：折叠时恢复main的padding
          mainElement.classList.remove('player-expanded');
          mainElement.classList.add('player-active');
        } else {
          // 桌面端：恢复到右下角默认位置
          playerWrapper.style.left = '';
          playerWrapper.style.right = '20px';
          playerWrapper.style.top = '';
          playerWrapper.style.bottom = '20px';
        }
      }

      isPlayerExpanded = !isPlayerExpanded;
      playerWrapper.classList.toggle('expanded', isPlayerExpanded);
      playerWrapper.classList.toggle('collapsed', !isPlayerExpanded);
    }

    // 启动播放
    function startPlay(playUrl, video) {
      console.log('开始播放:', playUrl);

      // 检测源类型
      const isHls = playUrl.includes('.m3u8') ||
                     playUrl.includes('m3u8') ||
                     playUrl.includes('application/x-mpegURL') ||
                     playUrl.includes('.ts') ||
                     playUrl.endsWith('.ts') ||
                     playUrl.includes('application/x-mpegTS');

      console.log('视频源类型:', { url: playUrl, isHls });

      if (isHls && Hls.isSupported()) {
        // 使用 Hls.js 播放
        console.log('使用 Hls.js 播放');
        currentHls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30
        });

        currentHls.loadSource(playUrl);
        currentHls.attachMedia(video);

        currentHls.on(Hls.Events.MANIFEST_PARSED, function() {
          console.log('HLS manifest parsed, 开始播放');
          video.play().catch(function(e) { console.error('播放失败:', e); });
        });

        currentHls.on(Hls.Events.ERROR, function(event, data) {
          console.error('HLS错误:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('网络错误:', data);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('尝试恢复媒体错误');
                currentHls.recoverMediaError();
                break;
              default:
                console.log('无法恢复的错误，销毁Hls实例');
                currentHls.destroy();
                break;
            }
          }
        });
      } else {
        // 非HLS源，使用原生video播放
        console.log('使用原生video播放（非HLS）');
        video.src = playUrl;
        video.load();

        video.addEventListener('error', function(e) {
          const errorCode = video.error ? video.error.code : 0;
          console.error('原生video错误:', errorCode, video.error);
        });

        video.addEventListener('play', function() {
          console.log('视频开始播放');
          setTimeout(function() {
            if (video.readyState >= 2) {
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;
              console.log('视频分辨率:', videoWidth, 'x', videoHeight);

              if (videoWidth === 0 || videoHeight === 0) {
                console.warn('检测到黑屏问题: 分辨率为0');
              }
            }
          }, 3000);
        });

        video.play().catch(function(e) {
          console.error('播放失败:', e);
        });
      }
    }
    
    function closePlayer() {
      const playerWrapper = document.getElementById('playerWrapper');
      const mainElement = document.querySelector('.main');

      // 取消所有进行中的请求
      abortAllFetches();

      // 清理视频资源
      cleanupVideoResources();

      isPlayerOpen = false;
      isPlayerExpanded = false;

      playerWrapper.classList.remove('active');
      playerWrapper.classList.remove('expanded');
      playerWrapper.classList.add('collapsed');

      // 移动端：移除main上的播放器相关class
      if (window.innerWidth <= 768) {
        mainElement.classList.remove('player-active');
        mainElement.classList.remove('player-expanded');
      } else {
        // 桌面端：重置定位到默认位置
        playerWrapper.style.left = '';
        playerWrapper.style.right = '20px';
        playerWrapper.style.top = '';
        playerWrapper.style.bottom = '20px';
      }
    }
    
    function showError(message) {
      document.getElementById('loading').innerHTML = \`<div style="color:#e50914">\${escapeHtml(message)}</div>\`;
    }
    
    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // 按ESC关闭播放器
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // 如果播放器展开，先折叠；如果已折叠，则关闭
        if (isPlayerOpen && isPlayerExpanded) {
          togglePlayerSize();
        } else {
          closePlayer();
        }
      }
    });

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', function() {
      console.log('[Player] Page unloading, cleaning up');
      if (currentHls) {
        currentHls.destroy();
        currentHls = null;
      }
    });

    // 点击外部关闭语言下拉菜单
    document.addEventListener('click', function(e) {
      const dropdown = document.getElementById('langDropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    // 播放器拖动功能
    (function() {
      const playerWrapper = document.getElementById('playerWrapper');
      const playerHeader = document.getElementById('playerHeader');
      let isDragging = false;
      let startX, startY, startLeft, startBottom;

      playerHeader.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('player-btn')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = playerWrapper.getBoundingClientRect();
        startLeft = rect.left;
        startBottom = window.innerHeight - rect.bottom;
        playerHeader.style.cursor = 'grabbing';
        e.preventDefault();
      });

      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newLeft = startLeft + dx;
        const newBottom = startBottom - dy;

        // 限制拖动范围，防止超出屏幕
        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;

        playerWrapper.style.right = 'auto';
        playerWrapper.style.left = Math.max(0, Math.min(newLeft, maxX)) + 'px';
        playerWrapper.style.bottom = Math.max(0, Math.min(newBottom, maxY)) + 'px';
        playerWrapper.style.top = 'auto';
      });

      document.addEventListener('mouseup', function() {
        if (isDragging) {
          isDragging = false;
          playerHeader.style.cursor = 'move';
        }
      });

      // 当点击放大时，记录是否被拖动过
      playerWrapper.addEventListener('transitionend', function(e) {
        if (e.propertyName === 'width' && isPlayerExpanded) {
          // 如果已经展开，确保使用 CSS 定位而不是内联样式
          if (playerWrapper.style.left || playerWrapper.style.top) {
            // 清除手动定位，让 CSS 类完全控制
            playerWrapper.style.left = '';
            playerWrapper.style.right = '';
            playerWrapper.style.top = '';
            playerWrapper.style.bottom = '';
          }
        }
      });
    })();

    // ========== 新增功能函数 ==========

    // 更新加密密钥（从服务器获取最新配置）
    async function updateEncryptionKey() {
      if (isUpdatingKey) {
        console.log('[KeyUpdate] 正在更新密钥，跳过重复请求');
        return false;
      }

      try {
        isUpdatingKey = true;
        console.log('[KeyUpdate] 开始获取最新配置');

        const response = await fetch(window.location.origin + '/api/config');
        const result = await response.json();

        if (result.success && result.config) {
          const { enable_url_encryption, url_encryption_key } = result.config;

          // 如果启用了URL加密且有密钥，更新全局密钥
          if (enable_url_encryption && url_encryption_key) {
            DECRYPTION_KEY = url_encryption_key;
            console.log('[KeyUpdate] 密钥已更新');
            return true;
          } else {
            console.log('[KeyUpdate] 未启用URL加密或无密钥');
            return false;
          }
        } else {
          console.error('[KeyUpdate] 获取配置失败:', result);
          return false;
        }
      } catch (error) {
        console.error('[KeyUpdate] 更新密钥失败:', error);
        return false;
      } finally {
        isUpdatingKey = false;
      }
    }

    // 在线人数显示（模拟）
    function updateOnlineCounter() {
      const baseCount = Math.floor(Math.random() * 100) + 50;
      const randomOffset = Math.floor(Math.random() * 20) - 10;
      const count = baseCount + randomOffset;
      document.getElementById('onlineCount').textContent = count.toLocaleString();
    }


    // 随机推荐
    async function initFeaturedChannels() {
      // 从后端获取随机推荐频道
      try {
        const response = await fetch(API_BASE + '/channels?action=random&count=30');
        const data = await response.json();

        if (data.success && data.channels) {
          featuredChannels = data.channels;
          console.log('获取到随机推荐频道:', featuredChannels.length);
        } else {
          console.error('获取随机推荐失败:', data.error);
          featuredChannels = [];
        }
      } catch (error) {
        console.error('获取随机推荐失败:', error);
        featuredChannels = [];
      }
      // 不在这里隐藏加载提示，由调用方控制
    }




    function showRandomInMain() {
      // 显示加载提示
      showLoadingIndicator(t('loadingRecommendations'));

      // 重新生成随机推荐
      initFeaturedChannels().then(() => {
        // 清除分组选择
        currentGroup = 'random';
        renderGroups();

      // 更新标题
      document.getElementById('sectionTitle').textContent = \`🎯 \${t('random')}\`;

        // 隐藏加载和分页
        document.getElementById('loading').style.display = 'none';
        document.getElementById('channelList').style.display = 'block';
        document.getElementById('pagination').innerHTML = '';

        // 获取前30条推荐
        const randomChannels = featuredChannels.slice(0, 30);

        if (!randomChannels || randomChannels.length === 0) {
          const container = document.getElementById('channelsGrid');
          const emptyState = document.getElementById('emptyState');
          container.innerHTML = '';
          emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = t('noRecommendations');
        document.querySelector('.empty-desc').textContent = t('noRecommendationsDesc');
          return;
        }

        // 渲染推荐列表
        const container = document.getElementById('channelsGrid');
        const emptyState = document.getElementById('emptyState');
        emptyState.style.display = 'none';

        container.innerHTML = randomChannels.map((channel, index) => {
          const logo = channel.logo
            ? \`<img src="\${escapeHtml(channel.logo)}" alt="logo">\`
            : '<div class="channel-icon">📺</div>';

          return \`
            <div class="channel-card ripple" onclick="handleChannelClick(event, '\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')">
              <div class="channel-poster">
                \${logo}
                \${index < 5 ? '<div class="hot-tag">' + t('recommend') + '</div>' : ''}
                <div class="play-overlay">
                  <div class="play-icon"></div>
                </div>
              </div>
              <div class="channel-info">
                <div class="channel-name">\${escapeHtml(channel.channel_name)}</div>
                <div class="channel-group">\${escapeHtml(channel.group_title || '')}</div>
              </div>
            </div>
          \`;
        }).join('');

        // 添加波纹效果
        container.querySelectorAll('.channel-card').forEach(card => {
          card.addEventListener('click', function(e) {
            createRipple(card);
          });
        });
      });
    }

    // 收藏功能
    function toggleFavorite(hash, name, group) {
      const index = favorites.findIndex(f => f.hash === hash);
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push({ hash, name, group, addedAt: Date.now() });
      }
      localStorage.setItem('iptv_favorites', JSON.stringify(favorites));

      // 更新徽章
      updateBadges();

      // 如果在收藏页面，重新渲染
      if (currentGroup === 'favorites') {
        renderFavorites();
      }

      // 更新当前页面的收藏按钮状态
      const btn = document.querySelector(\`.favorite-btn[data-hash="\${hash}"]\`);
      if (btn) {
        btn.textContent = index > -1 ? '☆' : '⭐';
        btn.classList.toggle('favorited', index > -1);
      }
    }

    function renderFavorites() {
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      document.getElementById('pagination').innerHTML = '';

      // 获取前30条收藏
      const favoritesItems = favorites.slice(0, 30);

      if (favoritesItems.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = t('noFavorites');
        document.querySelector('.empty-desc').textContent = t('noFavoritesDesc');
        return;
      }

      emptyState.style.display = 'none';
      container.innerHTML = favoritesItems.map(fav => {
        const logo = getLogoByHash(fav.hash);
        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')">
            <div class="channel-poster">
              \${logo}
              <button class="favorite-btn favorited" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')" data-hash="\${escapeHtml(fav.hash)}">⭐</button>
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(fav.name)}</div>
              <div class="channel-group">\${escapeHtml(fav.group)}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function getLogoByHash(hash) {
      // 优先从当前加载的频道列表中查找
      let channel = allChannels.find(c => c.channel_hash === hash);

      // 如果当前列表中没有，尝试从缓存数据中查找
      if (!channel) {
        // 获取所有分页的缓存数据
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(CACHE_PREFIX + 'channels_')) {
            try {
              const cached = JSON.parse(localStorage.getItem(key));
              if (cached && cached.value && cached.value.channels) {
                const found = cached.value.channels.find(c => c.channel_hash === hash);
                if (found) {
                  channel = found;
                }
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        });
      }

      if (channel && channel.logo) {
        return \`<img src="\${escapeHtml(channel.logo)}" alt="logo">\`;
      }
      return '<div class="channel-icon">📺</div>';
    }

    // 播放历史
    function addToHistory(channel) {
      const hash = channel.channel_hash || channel.hash;
      const index = history.findIndex(h => h.hash === hash);
      if (index > -1) {
        history.splice(index, 1);
      }

      // 统一字段名为 hash, name, group
      history.unshift({
        hash: hash,
        name: channel.channel_name,
        group: channel.group_title,
        watchedAt: Date.now()
      });

      // 只保留最近30条
      if (history.length > 30) {
        history = history.slice(0, 30);
      }

      localStorage.setItem('iptv_history', JSON.stringify(history));
      updateBadges();
    }

    function getTimeAgo(timestamp) {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      if (seconds < 60) return '刚刚';
      if (seconds < 3600) return Math.floor(seconds / 60) + '分钟前';
      if (seconds < 86400) return Math.floor(seconds / 3600) + '小时前';
      if (seconds < 604800) return Math.floor(seconds / 86400) + '天前';
      return '一周前';
    }

    // ========== 快捷面板功能 ==========

    // 显示播放历史面板

    function showHistoryInMain() {
      // 清除分组选择
      currentGroup = 'history';
      renderGroups();

      // 更新标题
      document.getElementById('sectionTitle').textContent = \`🕐 \${t('history')}\`;

      // 隐藏加载和分页
      document.getElementById('loading').style.display = 'none';
      document.getElementById('channelList').style.display = 'block';
      document.getElementById('pagination').innerHTML = '';

      // 获取前30条历史记录
      const historyItems = history.slice(0, 30);

      if (historyItems.length === 0) {
        const container = document.getElementById('channelsGrid');
        const emptyState = document.getElementById('emptyState');
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = t('noHistory');
        document.querySelector('.empty-desc').textContent = t('noHistoryDesc');
        return;
      }

      // 渲染历史记录
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      emptyState.style.display = 'none';

      container.innerHTML = historyItems.map(h => {
        const logo = getLogoByHash(h.hash);
        const timeAgo = getTimeAgo(h.watchedAt);
        const logoHtml = logo ? \`<img src="\${escapeHtml(logo)}" alt="\${escapeHtml(h.name)}">\` : '<div class="channel-icon">📺</div>';

        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(h.hash)}', '\${escapeHtml(h.name)}', '\${escapeHtml(h.group)}')">
            <div class="channel-poster">
              \${logoHtml}
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(h.name)}</div>
              <div class="channel-group">\${escapeHtml(h.group)}</div>
              <div class="channel-group" style="margin-top:4px;font-size:11px;color:#e50914">\${timeAgo}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // 在主数据区域显示收藏
    function showFavoritesInMain() {
      // 清除分组选择
      currentGroup = 'favorites';
      renderGroups();

      // 更新标题
      document.getElementById('sectionTitle').textContent = \`⭐ \${t('favorites')}\`;

      // 隐藏加载和分页
      document.getElementById('loading').style.display = 'none';
      document.getElementById('channelList').style.display = 'block';
      document.getElementById('pagination').innerHTML = '';

      // 获取前30条收藏
      const favoritesItems = favorites.slice(0, 30);

      if (favoritesItems.length === 0) {
        const container = document.getElementById('channelsGrid');
        const emptyState = document.getElementById('emptyState');
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = '还没有收藏';
        document.querySelector('.empty-desc').textContent = '点击频道卡片上的星星添加收藏';
        return;
      }

      // 渲染收藏列表
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      emptyState.style.display = 'none';

      container.innerHTML = favoritesItems.map(fav => {
        const logo = getLogoByHash(fav.hash);
        const logoHtml = logo ? \`<img src="\${escapeHtml(logo)}" alt="\${escapeHtml(fav.name)}">\` : '<div class="channel-icon">📺</div>';

        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')">
            <div class="channel-poster">
              \${logoHtml}
              <button class="favorite-btn favorited" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')" data-hash="\${escapeHtml(fav.hash)}">⭐</button>
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(fav.name)}</div>
              <div class="channel-group">\${escapeHtml(fav.group)}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // 显示播放历史面板
    function showHistoryPanel() {
      showHistoryInMain();
    }

    // 显示收藏面板
    function showFavoritesPanel() {
      showFavoritesInMain();
    }

    // 关闭快捷面板
    function closeQuickPanel() {
      const panel = document.getElementById('quickPanel');
      panel.classList.remove('active');
      document.removeEventListener('click', handlePanelOutsideClick);
    }

    // 处理面板外部点击
    function handlePanelOutsideClick(e) {
      const panel = document.getElementById('quickPanel');
      const quickEntries = document.querySelector('.quick-entries');
      if (!panel.contains(e.target) && !quickEntries.contains(e.target)) {
        closeQuickPanel();
      }
    }

    // 更新徽章数量（已禁用，不再显示徽章）
    function updateBadges() {
      // 徽章功能已禁用，不再显示数量
      return;
    }

    // ========== Google AdSense 广告控制 ==========


    // 动态加载广告（可选）
    function loadAdsenseAds() {
      // 如果需要动态加载广告，可以在这里实现
      console.log('AdSense ads ready to load');
    }

    // 页面加载完成后尝试加载广告
    window.addEventListener('load', () => {
      // 如果启用了AdSense，广告会自动加载
      console.log('Page loaded, AdSense ready');
    });
  </script>
</body>
</html>`;
