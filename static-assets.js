// 首页静态 HTML 专用 CSS (from home-page.js)
export const SEO_HOME_CSS = `
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff}
    ::-webkit-scrollbar{width:8px}
    ::-webkit-scrollbar-track{background:#1a1a1a}
    ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:#555}

    .header{position:fixed;top:0;left:0;right:0;height:70px;background:rgba(20,20,20,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.1);z-index:100;display:flex;align-items:center;justify-content:center}
    .header-inner{max-width:100%;width:100%;padding:0 40px;display:flex;align-items:center;justify-content:space-between;height:100%}
    .logo-link{text-decoration:none;cursor:pointer;transition:opacity .2s}
    .logo-link:hover{opacity:0.8}
    .logo{display:flex;align-items:center;gap:10px}
    .logo img{height:40px;width:auto}
    .logo-text{font-size:24px;font-weight:800;background:linear-gradient(135deg,#e50914 0%,#b81d24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .header-left{display:flex;align-items:center;gap:24px;flex-shrink:0}
    .header-right{display:flex;align-items:center;margin-left:auto;flex-shrink:0}
    .search-box{max-width:400px;margin-right:16px;flex-shrink:1}
    .search-input{width:100%;padding:12px 20px;border:1px solid rgba(255,255,255,.2);border-radius:8px;background:rgba(255,255,255,.05);color:#fff;font-size:15px;transition:all .2s}
    .search-input:focus{outline:none;border-color:#e50914;background:rgba(255,255,255,.1)}
    .search-input::placeholder{color:rgba(255,255,255,.5)}
    .nav-links{display:flex;gap:20px;margin-left:auto}
    .nav-links a{color:rgba(255,255,255,.8);text-decoration:none;font-size:14px;transition:color .2s}
    .nav-links a:hover{color:#fff}
    .nav-links a.active{color:#e50914}

    
    /* 快捷入口按钮 *\/
    .quick-entries{display:flex;gap:4px;margin-left:0;flex-shrink:0}
    .quick-entry{position:relative;width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:rgba(255,255,255,.7);font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
    .quick-entry svg{width:16px;height:16px}
    .quick-entry:hover{background:rgba(255,255,255,.2);color:#fff}
    .quick-entry-badge{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;background:#e50914;border-radius:9px;font-size:11px;font-weight:600;color:#fff;display:flex;align-items:center;justify-content:center;padding:0 5px;display:none}
    .quick-entry-tip{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:6px;white-space:nowrap;font-size:12px;color:rgba(255,255,255,.6);opacity:0;transition:opacity .2s;pointer-events:none;z-index:10;background:rgba(0,0,0,.8);padding:4px 8px;border-radius:4px}
    .quick-entry:hover .quick-entry-tip{opacity:1}

    .auth-btn{padding:8px 20px;background:linear-gradient(135deg,#e50914 0%,#b81d24 100%);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent}
    .auth-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(229,9,20,.4)}
    .auth-btn:active{transform:translateY(0);scale:.98}

    /* Translate.js 语言切换器样式 *\/
    #translate{display:inline-flex;align-items:center}
    #translate select{height:40px;padding:0 32px 0 12px;border-radius:8px;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.6);color:#fff;cursor:pointer;font-size:14px;font-weight:500;appearance:none;-webkit-appearance:none;-moz-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center}
    #translate select:hover{border-color:rgba(255,255,255,.5);background-color:rgba(0,0,0,.8)}
    #translate select:focus{outline:none;border-color:#e50914}
    #translate select option{background:#1a1a1a;color:#fff}

    .modal-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:2000;backdrop-filter:blur(10px);opacity:0;transition:opacity .3s}
    .modal-overlay.open{display:flex;align-items:center;justify-content:center;opacity:1}
    .modal{background:#1a1a1a;border-radius:16px;padding:30px;max-width:420px;width:90%;position:relative;transform:scale(.9);transition:transform .3s;border:1px solid rgba(255,255,255,.1);box-shadow:0 20px 60px rgba(0,0,0,.5)}
    .modal-overlay.open .modal{transform:scale(1)}
    .modal-close{position:absolute;top:15px;right:15px;background:none;border:none;color:rgba(255,255,255,.6);font-size:24px;cursor:pointer;width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .modal-close:hover{color:#fff;background:rgba(255,255,255,.1)}
    .modal-title{font-size:24px;font-weight:700;color:#fff;margin-bottom:25px;text-align:center}
    .modal-form{display:flex;flex-direction:column;gap:15px}
    .form-group{display:flex;flex-direction:column;gap:6px}
    .form-label{font-size:14px;font-weight:500;color:rgba(255,255,255,.8)}
    .form-input{padding:12px 16px;border:2px solid rgba(255,255,255,.2);border-radius:8px;background:rgba(255,255,255,.05);color:#fff;font-size:15px;transition:all .2s}
    .form-input:focus{outline:none;border-color:#e50914;background:rgba(255,255,255,.1)}
    .form-input::placeholder{color:rgba(255,255,255,.4)}
    .form-input.error{border-color:#ff3b30}
    .form-error{color:#ff3b30;font-size:13px;display:none}
    .form-error.show{display:block}
    .form-help{font-size:12px;color:rgba(255,255,255,.5);margin-top:4px}
    .btn-primary{padding:14px 20px;background:linear-gradient(135deg,#e50914 0%,#b81d24 100%);color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(229,9,20,.4)}
    .btn-primary:active{transform:translateY(0);scale:.98}
    .btn-primary:disabled{background:rgba(229,9,20,.3);cursor:not-allowed;transform:none;scale:1;box-shadow:none}
    .btn-secondary{padding:12px 16px;background:rgba(255,255,255,.1);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent;white-space:nowrap}
    .btn-secondary:hover{background:rgba(255,255,255,.15)}
    .btn-secondary:active{background:rgba(255,255,255,.2);scale:.98}
    .btn-secondary.disabled{opacity:.5;cursor:not-allowed;pointer-events:none}
    .google-login-btn{display:flex;align-items:center;justify-content:center;gap:10px;padding:14px 20px;background:#fff;color:#3c4043;border:none;border-radius:8px;font-size:16px;font-weight:500;cursor:pointer;transition:all .2s;margin-top:10px}
    .google-login-btn:hover{background:#f8f9fa;box-shadow:0 2px 6px rgba(0,0,0,.12)}
    .google-login-btn img{width:20px;height:20px}
    .modal-footer{margin-top:20px;text-align:center;font-size:14px;color:rgba(255,255,255,.6)}
    .modal-footer a{color:#e50914;text-decoration:none;font-weight:500}
    .modal-footer a:hover{text-decoration:underline}
    .verification-inputs{display:flex;gap:8px;justify-content:center;margin:10px 0}
    .verification-input{width:50px;height:50px;border:2px solid rgba(255,255,255,.2);border-radius:8px;background:rgba(255,255,255,.05);color:#fff;font-size:24px;font-weight:600;text-align:center;transition:all .2s}
    .verification-input:focus{outline:none;border-color:#e50914;background:rgba(255,255,255,.1)}
    .verification-input.error{border-color:#ff3b30}
    .resend-link{color:rgba(255,255,255,.6);font-size:13px;text-decoration:none;cursor:pointer}
    .resend-link:hover{color:#e50914;text-decoration:underline}
    .resend-link.disabled{color:rgba(255,255,255,.3);cursor:not-allowed;pointer-events:none}

    .main{display:flex;margin-top:70px;min-height:calc(100vh - 70px)}
    .sidebar{width:260px;background:#141414;border-right:1px solid rgba(255,255,255,.1);overflow-y:auto;padding:20px 0;position:fixed;height:calc(100vh - 70px)}
    .sidebar .group-item,.sidebar .group-item a{padding:12px 24px;color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;font-size:14px;border-left:3px solid transparent;display:block;text-decoration:none}
    .sidebar .group-item a:hover{color:#fff;background:rgba(255,255,255,.05)}
    .sidebar .group-item.active,.sidebar .group-item.active a{color:#fff;background:rgba(229,9,20,.12);border-left-color:#e50914;font-weight:500}
    .sidebar .group-item.active a::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#e50914}
    .content{flex:1;margin-left:260px;padding:30px}

    .section-title{font-size:18px;font-weight:600;margin-bottom:20px;color:#fff}
    .channels-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
    .channel-card{background:#141414;border-radius:8px;overflow:hidden;cursor:pointer;transition:all .3s;border:2px solid transparent;position:relative}
    .channel-card:hover{transform:scale(1.05);border-color:#e50914;z-index:10;box-shadow:0 8px 30px rgba(0,0,0,.5)}
    .channel-poster{aspect-ratio:16/9;background:#1a1a1a;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .channel-poster img{width:100%;height:100%;object-fit:contain;transition:transform .3s}
    .channel-card:hover .channel-poster img{transform:scale(1.1)}
    .channel-icon{font-size:48px;opacity:.5}
    .channel-info{padding:14px}
    .channel-name{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:#fff;margin-bottom:4px;overflow:hidden}
    .channel-name-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0}
    .channel-group{font-size:12px;color:rgba(255,255,255,.5)}
    .pagination{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:30px;padding:20px 0}
    .pagination button{padding:8px 16px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#fff;border-radius:6px;cursor:pointer;font-size:14px;transition:all .2s}
    .pagination button:hover:not(:disabled){background:rgba(255,255,255,.1);border-color:#e50914}
    .pagination button:disabled{color:rgba(255,255,255,.3);cursor:not-allowed;border-color:rgba(255,255,255,.1)}
    .pagination button.active{background:#e50914;border-color:#e50914}
    .pagination-info{color:rgba(255,255,255,.6);font-size:14px}
    
    /* 播放器样式 - 可折叠的右下角浮窗 *\/
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

    /* 悬浮功能栏 - 右下角 *\/
    .action-bar{position:fixed;right:20px;bottom:20px;z-index:1000;display:flex;flex-direction:column;gap:8px}
    .action-bar-btn{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:10px;border:none;cursor:pointer;color:#fff;transition:all .2s;padding:0;background:rgba(255,255,255,.1);box-shadow:0 4px 12px rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.15)}
    .action-bar-btn:hover{transform:translateY(-2px);background:rgba(255,255,255,.15);box-shadow:0 6px 20px rgba(0,0,0,.4)}
    .action-bar-btn:active{transform:translateY(0) scale(0.95)}
    .action-bar-btn svg{width:20px;height:20px;flex-shrink:0}
    .action-bar-btn .spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite}
    .action-bar-btn.download:hover{background:rgba(229,9,20,.2);border-color:rgba(229,9,20,.3)}
    .action-bar-btn.telegram:hover{background:rgba(34,158,217,.2);border-color:rgba(34,158,217,.3)}
    .action-bar-btn.top:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.2)}

    .loading{display:flex;align-items:center;justify-content:center;padding:60px;color:rgba(255,255,255,.5)}
    .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,.1);border-top-color:#e50914;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-left:16px;font-size:14px}
    
    /* 广告卡片样式 - 与频道卡片一致，广告覆盖整个卡片 *\/
    .ad-card{background:#141414;border-radius:8px;overflow:hidden;border:2px solid rgba(255,215,0,.3);position:relative;cursor:pointer;transition:all .3s}
    .ad-card:hover{transform:scale(1.05);border-color:#ffd700;z-index:10;box-shadow:0 8px 30px rgba(255,215,0,.2)}
    .ad-card .channel-poster{aspect-ratio:16/9;visibility:hidden;pointer-events:none}
    .ad-card .ad-label{position:absolute;top:8px;left:8px;padding:4px 10px;background:rgba(255,215,0,.9);color:#000;border-radius:4px;font-size:11px;font-weight:600;z-index:10}
    .ad-card .ad-fullcard{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center}
    .ad-card ins.adsbygoogle{display:block !important;width:100% !important;height:100% !important}
    .ad-card .channel-info{position:absolute;bottom:0;left:0;right:0;padding:14px;background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.7) 100%);z-index:5}
    .ad-card .channel-name{color:#ffd700}
    
    .empty-state{text-align:center;padding:80px 20px;color:rgba(255,255,255,.5)}
    .empty-icon{font-size:64px;margin-bottom:20px;opacity:.3}
    .empty-title{font-size:20px;font-weight:600;margin-bottom:10px}
    .empty-desc{font-size:14px}
    
    .footer{text-align:center;padding:30px;color:rgba(255,255,255,.4);font-size:13px;border-top:1px solid rgba(255,255,255,.1);margin-top:40px;margin-left:260px}

    /* 热门频道标签 *\/
    .hot-tag{position:absolute;top:8px;left:8px;padding:4px 10px;background:#ff4757;color:white;border-radius:4px;font-size:11px;font-weight:600;z-index:10}
    .hot-tag::before{content:'🔥 ';margin-right:2px}

    /* 收藏功能 *\/
    .favorite-btn{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.6);border:none;cursor:pointer;color:rgba(255,255,255,.7);font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:10}
    .favorite-btn:hover{background:rgba(0,0,0,.8);color:#fff}
    .favorite-btn.favorited{color:#ffd700}
    .favorite-section{display:none}
    .favorite-section.active{display:block}

    /* 快捷面板 *\/
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

    /* 在线人数显示 *\/
    .online-counter{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.6);font-size:13px;margin-left:40px}
    .online-dot{width:8px;height:8px;border-radius:50%;background:#34c759;animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .online-count{font-weight:600;color:#34c759}

    /* 点击波纹效果 *\/
    .ripple{position:relative;overflow:hidden}
    .ripple-effect{position:absolute;border-radius:50%;background:rgba(255,255,255,.3);transform:scale(0);animation:ripple 0.6s linear;pointer-events:none}
    @keyframes ripple{to{transform:scale(4);opacity:0}}

    /* 加载指示器 *\/
    .loading-indicator{position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:1001;background:rgba(20,20,20,.95);backdrop-filter:blur(20px);padding:16px 32px;border-radius:8px;display:none;align-items:center;gap:12px;box-shadow:0 4px 20px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1)}
    .loading-indicator.active{display:flex;animation:fadeIn 0.3s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    .loading-spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite}
    .loading-text{font-size:14px;color:#fff}

    /* 点击高亮动画 *\/
    .click-highlight{animation:clickPulse 0.3s ease}
    @keyframes clickPulse{0%{transform:scale(1)}50%{transform:scale(0.95)}100%{transform:scale(1)}}

    /* 播放提示动画 *\/
    .playing-indicator{display:flex;align-items:center;gap:6px;color:#e50914;font-size:12px;font-weight:600;animation:fadeInUp 0.3s ease}
    @keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .playing-dots{display:flex;gap:3px}
    .playing-dot{width:6px;height:6px;background:#e50914;border-radius:50%;animation:playingDot 1s ease-in-out infinite}
    .playing-dot:nth-child(2){animation-delay:0.2s}
    .playing-dot:nth-child(3){animation-delay:0.4s}
    @keyframes playingDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(0.8)}}

    /* 当前播放频道的样式 *\/
    .channel-card.playing{border-color:#e50914;box-shadow:0 0 20px rgba(229,9,20,0.3)}
    .channel-card.playing .channel-poster .playing-indicator{position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.7);padding:4px 8px;border-radius:4px;color:#fff;z-index:5}

    /* Toast 提示组件（已隐藏） *\/
    .toast-container{position:fixed;top:90px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:12px;pointer-events:none}
    .toast{min-width:320px;max-width:500px;padding:16px 20px;border-radius:10px;color:#fff;font-size:14px;line-height:1.5;box-shadow:0 8px 30px rgba(0,0,0,.4);pointer-events:auto;backdrop-filter:blur(10px);animation:toastSlideIn 0.3s ease;transition:all 0.2s}
    .toast.error{background:rgba(26,26,26,.5);border:1px solid rgba(255,255,255,.1)}
    .toast.warning{background:linear-gradient(135deg,rgba(234,179,8,.5) 0%,rgba(245,158,11,.5) 100%);border:1px solid rgba(251,191,36,.3)}
    .toast.success{background:linear-gradient(135deg,rgba(34,197,94,.5) 0%,rgba(22,163,74,.5) 100%);border:1px solid rgba(74,222,128,.3)}
    .toast.info{background:linear-gradient(135deg,rgba(59,130,246,.5) 0%,rgba(37,99,235,.5) 100%);border:1px solid rgba(96,165,250,.3)}
    .toast-title{font-weight:600;margin-bottom:4px;font-size:15px}
    .toast-message{color:rgba(255,255,255,.85);white-space:pre-wrap}
    .toast-close{position:absolute;top:12px;right:12px;width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.15);border:none;cursor:pointer;color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .toast-close:hover{background:rgba(255,255,255,.25);transform:scale(1.1)}
    @keyframes toastSlideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toastSlideOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}
    .toast.hiding{animation:toastSlideOut 0.3s ease forwards}

    /* 公告样式 - 弹窗式通知 *\/
    .announcement-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;z-index:2000;backdrop-filter:blur(4px)}
    .announcement-modal.active{display:flex}
    .announcement-modal-box{background:#1a1a1a;border-radius:16px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1);animation:announcementSlideIn 0.3s ease}
    @keyframes announcementSlideIn{from{opacity:0;transform:scale(0.9) translateY(-20px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .announcement-modal-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.1)}
    .announcement-modal-title{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:600;color:#fff}
    .announcement-modal-icon{font-size:24px}
    .announcement-close{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:rgba(255,255,255,.6);font-size:22px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .announcement-close:hover{background:rgba(255,255,255,.2);color:#fff;transform:rotate(90deg)}
    .announcement-modal-body{padding:24px;color:rgba(255,255,255,.85);font-size:15px;line-height:1.7}
    .announcement-modal-body p{margin-bottom:12px}
    .announcement-modal-body p:last-child{margin-bottom:0}
    .announcement-modal-body a{color:#60a5fa;text-decoration:underline}
    .announcement-modal-footer{display:flex;align-items:center;justify-content:space-between;padding:16px 24px 20px;border-top:1px solid rgba(255,255,255,.1)}
    .announcement-modal-time{display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(255,255,255,.5)}
    .announcement-modal-button{padding:10px 24px;background:#60a5fa;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s}
    .announcement-modal-button:hover{background:#3b82f6}


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
      .mobile-menu-close{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:none;border-radius:6px;cursor:pointer;color:rgba(255,255,255,.7);font-size:20px}
      .mobile-section{margin-bottom:25px}
      .mobile-section-title{font-size:12px;font-weight:600;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
      .mobile-actions{display:flex;gap:10px;margin-bottom:20px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:5px}
      .mobile-actions::-webkit-scrollbar{display:none}
      .mobile-actions::-webkit-scrollbar{display:none}
      .mobile-action-btn{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:65px;padding:12px 8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,.7);flex-shrink:0}
      .mobile-action-btn:hover{background:rgba(255,255,255,.1);color:#fff}
      .mobile-action-btn .icon svg{width:24px;height:24px}
      .mobile-action-btn .label{font-size:11px;color:rgba(255,255,255,.6);white-space:nowrap}
      .mobile-lang-menu{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:5px}
      .mobile-lang-menu::-webkit-scrollbar{display:none}
      .mobile-lang-item{padding:10px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,.7);font-size:14px;white-space:nowrap;flex-shrink:0}
      .mobile-lang-item:hover{background:rgba(255,255,255,.1);color:#fff}
      .mobile-lang-item.active{background:rgba(229,9,20,.2);border-color:#e50914;color:#fff;font-weight:600}
      .mobile-group-item,.mobile-group-item a{padding:12px 16px;color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;font-size:14px;border-left:3px solid transparent;display:block;text-decoration:none}
      .mobile-group-item a:hover{color:#fff;background:rgba(255,255,255,.05)}
      .mobile-group-item.active,.mobile-group-item.active a{color:#fff;background:rgba(229,9,20,.12);border-left-color:#e50914;font-weight:500}
      .sidebar{display:none}
      .sidebar.mobile-open{display:block;position:static;width:100%;height:auto;border-right:none;border-bottom:1px solid rgba(255,255,255,.1);padding:0 0 20px 0}
      .content{margin-left:0;padding:15px}
      .channels-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
      /* 移动端播放器特殊样式 *\/
      .player-wrapper{position:fixed;top:60px;left:0;right:0;width:100% !important;height:0;overflow:hidden;border-radius:0;box-shadow:0 4px 20px rgba(0,0,0,.5);transition:all .3s ease}
      .player-wrapper.active{height:calc(100vw * 9 / 16 + 50px);min-height:270px;max-height:370px;z-index:999}
      .player-wrapper.expanded{height:calc(100vh - 60px);width:100% !important;right:0 !important;left:0 !important;top:60px;bottom:auto}
      .player-wrapper.collapsed{height:calc(100vw * 9 / 16 + 50px);min-height:270px;max-height:370px;width:100% !important;right:0 !important;left:0 !important;top:60px;bottom:auto}
      .player-container{height:calc(100% - 50px)}
      /* 内容区域添加顶部间距，避免被播放器遮挡 *\/
      .main{margin-top:60px;padding-top:0}
      .main.player-active{padding-top:330px}
      .main.player-expanded{padding-top:calc(100vh - 60px)}
      .player-title{font-size:12px}
      .player-group{font-size:11px}
      .pagination{flex-wrap:wrap;gap:6px;padding:15px 0}
      .pagination button{padding:6px 12px;font-size:12px}
      .pagination-info{width:100%;text-align:center;margin-bottom:10px}
      /* 移动端 Toast 通知样式 - 与 PC 端保持一致 *\/
      .toast-container{top:80px}
      .toast{min-width:280px;max-width:90vw;padding:14px 16px;font-size:13px}
      .toast-title{font-size:14px}
      .toast-message{font-size:13px}
      /* 移动端禁用频道卡片的焦点红色外框 *\/
      .channel-card:focus,.channel-card:focus-visible{outline:none;border-color:transparent;box-shadow:none}
      /* 移动端禁用按钮的焦点样式 *\/
      button:focus,button:focus-visible{outline:none}
    }
    @media (max-width:480px){
      .header{padding:0 10px}
      .logo{font-size:16px}
      .mobile-menu{width:100%}
      .mobile-action-btn{min-width:55px;padding:10px 6px}
      .mobile-action-btn .icon svg{width:20px;height:20px}
      .mobile-action-btn .label{font-size:10px}
      .main{margin-top:60px}
      .channels-grid{grid-template-columns:repeat(2,1fr);gap:8px}
      .channel-card{padding:8px}
      .channel-name{font-size:13px}
      .channel-group{font-size:11px}
      /* 移动端验证码输入框适配 *\/
      #registerCode{flex:1 !important;min-width:0}
      #sendCodeBtn{white-space:normal !important;font-size:12px !important;padding:8px 12px !important;flex-shrink:0}
    }
    /* 复制链接按钮 *\/
    .copy-link-btn{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;border:none;border-radius:4px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);cursor:pointer;transition:all 0.2s ease;flex-shrink:0}
    .copy-link-btn svg{width:12px;height:12px}
     .copy-link-btn:hover{background:rgba(229,9,20,0.2);color:#e50914}
    .copy-link-btn:active{transform:scale(0.92)}
    .copy-link-btn.copied{background:rgba(34,197,94,0.2);color:#22c55e}
    .copy-link-btn.copied svg{stroke-width:2.5}

     /* 面包屑导航 - 与section-title统一 *\/
    .section-title{font-size:14px;font-weight:600;margin-bottom:20px;color:#fff}
    .breadcrumb{display:flex;align-items:center;gap:12px;font-size:14px;font-weight:600;margin-bottom:16px;color:rgba(255,255,255,.5)}
    .breadcrumb a{color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s;font-weight:400}
    .breadcrumb a:hover{color:#e50914}
    .breadcrumb-separator{color:rgba(255,255,255,.25);font-weight:400}
    .breadcrumb-current{color:#fff;font-weight:600}
    .breadcrumb-current:hover{color:#e50914}

    /* ========== 频道详情页 - 重新设计 ========== */
    @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .channel-detail-view{padding:0;animation:fadeInUp .4s ease-out}
    .channel-detail-container{max-width:1200px;margin:0 auto;padding:24px}

    /* ========== 频道详情页 - 紧凑信息流 ========== */
    .channel-detail-view{
      padding:0;
    }
    .channel-detail-container{
      max-width:900px;
      margin:0 auto;
    }

    /* 顶部操作栏 */
    .cd-detail-header{
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:16px 20px;
      background:#141414;
      border-bottom:1px solid rgba(255,255,255,.06);
      position:sticky;
      top:70px;
      z-index:10;
    }
    .cd-back-btn{
      display:flex;
      align-items:center;
      gap:6px;
      padding:8px 12px;
      background:rgba(255,255,255,.05);
      border:1px solid rgba(255,255,255,.1);
      border-radius:8px;
      color:#fff;
      font-size:13px;
      cursor:pointer;
      transition:all .2s;
    }
    .cd-back-btn:hover{background:rgba(255,255,255,.1)}
    .cd-header-actions{
      display:flex;
      align-items:center;
      gap:8px;
    }
    .cd-action-btn{
      width:36px;
      height:36px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:rgba(255,255,255,.05);
      border:1px solid rgba(255,255,255,.1);
      border-radius:8px;
      font-size:16px;
      cursor:pointer;
      transition:all .2s;
    }
    .cd-action-btn:hover{background:rgba(255,255,255,.1);transform:scale(1.05)}
    .cd-action-btn.active{color:#ffd700}
    .cd-play-btn{
      display:flex;
      align-items:center;
      gap:6px;
      padding:8px 16px;
      background:#e50914;
      border:none;
      border-radius:8px;
      color:#fff;
      font-size:13px;
      font-weight:600;
      cursor:pointer;
      transition:all .2s;
    }
    .cd-play-btn:hover{background:#f60;transform:scale(1.02)}

    /* 主信息区 */
    .cd-detail-main{
      display:flex;
      align-items:center;
      gap:20px;
      padding:24px 20px;
      background:#1a1a1a;
      border-bottom:1px solid rgba(255,255,255,.04);
    }
    .cd-detail-logo{
      flex-shrink:0;
    }
    .cd-detail-logo img{
      width:80px;
      height:80px;
      object-fit:contain;
      background:#141414;
      border-radius:12px;
      padding:8px;
    }
    .cd-detail-logo-placeholder{
      width:80px;
      height:80px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#141414;
      border-radius:12px;
      font-size:32px;
    }
    .cd-detail-info{
      flex:1;
      min-width:0;
    }
    .cd-detail-title{
      font-size:24px;
      font-weight:800;
      color:#fff;
      margin:0 0 8px 0;
      letter-spacing:-.02em;
    }
    .cd-detail-meta{
      display:flex;
      align-items:center;
      gap:12px;
      flex-wrap:wrap;
    }
    .cd-detail-tag{
      padding:4px 10px;
      background:rgba(229,9,20,.12);
      border:1px solid rgba(229,9,20,.25);
      border-radius:12px;
      font-size:12px;
      color:#e50914;
      font-weight:500;
    }
    .cd-detail-status{
      display:flex;
      align-items:center;
      gap:6px;
      font-size:12px;
      color:rgba(255,255,255,.5);
    }
    .cd-status-dot{
      width:6px;
      height:6px;
      background:#22c55e;
      border-radius:50%;
    }

    /* 信息网格 */
    .cd-detail-grid{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:0;
      background:#141414;
      border-bottom:1px solid rgba(255,255,255,.06);
    }
    .cd-detail-section{
      padding:20px;
    }
    .cd-detail-section:first-child{
      border-right:1px solid rgba(255,255,255,.04);
    }
    .cd-section-title{
      font-size:13px;
      font-weight:600;
      color:rgba(255,255,255,.4);
      text-transform:uppercase;
      letter-spacing:.05em;
      margin:0 0 16px 0;
    }
    .cd-info-list{
      display:flex;
      flex-direction:column;
      gap:12px;
    }
    .cd-info-item{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:16px;
    }
    .cd-info-label{
      font-size:13px;
      color:rgba(255,255,255,.4);
    }
    .cd-info-value{
      font-size:13px;
      color:#fff;
      font-weight:500;
      text-align:right;
    }
    .cd-info-link{
      color:#e50914;
      cursor:pointer;
    }
    .cd-info-link:hover{text-decoration:underline}
    .cd-info-id{
      font-family:monospace;
      font-size:10px;
      color:rgba(255,255,255,.3);
    }

    /* 查看更多 */
    .cd-detail-more{
      padding:16px 20px;
      background:#141414;
      border-bottom:1px solid rgba(255,255,255,.06);
    }
    .cd-more-link{
      display:block;
      text-align:center;
      padding:12px;
      background:rgba(229,9,20,.08);
      border:1px solid rgba(229,9,20,.2);
      border-radius:10px;
      color:#e50914;
      font-size:13px;
      font-weight:500;
      text-decoration:none;
      transition:all .2s;
    }
    .cd-more-link:hover{background:rgba(229,9,20,.15)}

    /* 相关频道 */
    .cd-related-section{
      padding:20px;
    }
    .cd-related-scroll{
      display:flex;
      gap:12px;
      overflow-x:auto;
      padding-bottom:8px;
      scrollbar-width:thin;
      scrollbar-color:rgba(255,255,255,.2) transparent;
    }
    .cd-related-scroll::-webkit-scrollbar{height:4px}
    .cd-related-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:2px}
    .cd-related-card{
      flex-shrink:0;
      width:90px;
      background:#1a1a1a;
      border-radius:12px;
      overflow:hidden;
      cursor:pointer;
      transition:all .2s;
      border:1px solid transparent;
    }
    .cd-related-card:hover{border-color:#e50914;transform:translateY(-2px)}
    .cd-related-poster{
      aspect-ratio:1;
      background:#141414;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:10px;
    }
    .cd-related-poster img{width:100%;height:100%;object-fit:contain}
    .cd-related-logo-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px;opacity:.3}
    .cd-related-name{
      display:block;
      padding:8px;
      font-size:11px;
      color:rgba(255,255,255,.7);
      text-align:center;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    /* 响应式 */
    @media(max-width:600px){
      .cd-detail-header{top:60px;padding:12px 16px}
      .cd-back-btn span{display:none}
      .cd-detail-main{flex-direction:column;text-align:center;padding:20px 16px}
      .cd-detail-title{font-size:20px}
      .cd-detail-meta{justify-content:center}
      .cd-detail-grid{grid-template-columns:1fr}
      .cd-detail-section:first-child{border-right:none;border-bottom:1px solid rgba(255,255,255,.04)}
      .cd-related-card{width:80px}
    }

    /* ========== Plan B 布局 - 工具栏横向筛选 ========== */
    
    /* 横向筛选标签栏 */
    .filter-bar{
      margin-top:70px;
      display:flex;
      align-items:center;
      gap:8px;
      padding:8px 16px;
      background:#1a1a1a;
      border-bottom:1px solid rgba(255,255,255,0.06);
      overflow-x:auto;
      scrollbar-width:none;
      -ms-overflow-style:none;
    }
    .filter-bar::-webkit-scrollbar{display:none}
    .filter-tag{
      flex-shrink:0;
      padding:6px 14px;
      border-radius:16px;
      font-size:13px;
      font-weight:500;
      color:rgba(255,255,255,0.6);
      background:rgba(255,255,255,0.06);
      border:1px solid transparent;
      cursor:pointer;
      transition:all .2s ease;
      white-space:nowrap;
    }
    .filter-tag:hover{color:#fff;background:rgba(255,255,255,0.1)}
    .filter-tag.active{color:#e50914;background:rgba(229,9,20,0.15);border-color:rgba(229,9,20,0.3)}

    /* 操作按钮条 */
    .action-strip{
      display:flex;
      align-items:center;
      gap:12px;
      padding:10px 16px;
      background:#141414;
      border-bottom:1px solid rgba(255,255,255,0.04);
    }
    .action-btn{
      display:inline-flex;
      align-items:center;
      gap:6px;
      padding:8px 14px;
      border-radius:8px;
      font-size:13px;
      font-weight:500;
      color:rgba(255,255,255,0.8);
      background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.1);
      cursor:pointer;
      transition:all .2s ease;
      white-space:nowrap;
    }
    .action-btn:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.2)}
    .action-btn .badge{
      padding:2px 6px;
      border-radius:10px;
      font-size:11px;
      background:rgba(229,9,20,0.2);
      color:#e50914;
    }

    /* 频道列表 */
    .channel-list{
      display:flex;
      flex-direction:column;
      gap:2px;
    }
    /* 频道表格布局 */
    .channel-table{
      background:#1a1a1a;
      border-radius:12px;
      overflow:hidden;
      border:1px solid rgba(255,255,255,0.06);
    }
    .channel-table-header{
      display:grid;
      grid-template-columns:60px 1fr 120px 60px 60px;
      gap:12px;
      padding:12px 20px;
      background:#141414;
      border-bottom:1px solid rgba(255,255,255,0.06);
      font-size:12px;
      font-weight:600;
      color:rgba(255,255,255,0.5);
      text-transform:uppercase;
      letter-spacing:.05em;
    }
    .cth-action{
      text-align:center;
    }
    .channel-list{
      display:block;
      padding:0;
    }
    .channel-item{
      display:grid;
      grid-template-columns:60px 1fr 120px 60px 60px;
      gap:12px;
      padding:14px 20px;
      align-items:center;
      cursor:pointer;
      transition:background .2s;
      border-bottom:1px solid rgba(255,255,255,0.03);
      opacity:0;
      animation:fadeInUp .3s ease forwards;
    }
    .channel-item:last-child{border-bottom:none}
    .channel-item:hover{
      background:rgba(229,9,20,0.06);
    }
    .channel-item .ch-icon{
      width:44px;
      height:44px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#141414;
      border-radius:10px;
      font-size:18px;
      flex-shrink:0;
    }
    .channel-item .ch-icon img,
    .channel-item .ch-icon .channel-icon{width:44px!important;height:44px!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:18px!important;object-fit:contain!important;border-radius:10px!important;background:#141414!important}
    .channel-item .ch-icon .channel-icon{opacity:0.5!important}
    .channel-item .ch-info{
      flex:1;
      min-width:0;
    }
    .channel-item .ch-name{
      font-size:14px;
      font-weight:600;
      color:#fff;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .channel-item .ch-group{
      font-size:13px;
      color:rgba(255,255,255,0.4);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .channel-item .ch-views{
      font-size:12px;
      color:#e50914;
      text-align:center;
    }
    .ch-fav-btn,.ch-copy-btn{
      display:flex;
      align-items:center;
      justify-content:center;
      background:none;
      border:none;
      font-size:16px;
      cursor:pointer;
      padding:6px;
      border-radius:6px;
      transition:all .2s;
    }
    .ch-fav-btn:hover{transform:scale(1.2);background:rgba(255,255,255,0.1)}
    .ch-copy-btn:hover{transform:scale(1.2);background:rgba(255,255,255,0.1)}
    .ch-fav-btn.favorited{color:#ffd700}
    .ch-fav-btn:not(.favorited){color:rgba(255,255,255,0.3)}
    .ch-copy-btn{color:rgba(255,255,255,0.3)}
    .ch-copy-btn:hover{color:#e50914}
    .channel-item .ch-arrow{display:none}
    @keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}

    /* 全宽内容区域 */
    .content-full{
      flex:1;
      margin-top:70px;
      padding:24px 40px;
      min-height:calc(100vh - 70px);
    }

    /* ========== 分类浏览模式 ========== */
    .category-browse{
      margin-top:24px;
      padding:24px;
      min-height:calc(100vh - 70px);
    }
    .page-container{
      max-width:1200px;
      margin:0 auto;
    }
    .browse-header{
      margin-bottom:24px;
    }
    .browse-title{
      font-size:24px;
      font-weight:700;
      color:#fff;
      margin:0 0 4px 0;
    }
    .browse-subtitle{
      font-size:14px;
      color:rgba(255,255,255,0.5);
      margin:0;
    }
    .category-list{
      display:flex;
      flex-direction:column;
      gap:2px;
    }
    .category-item{
      display:flex;
      align-items:center;
      gap:12px;
      padding:16px 20px;
      background:#1a1a1a;
      border-radius:10px;
      cursor:pointer;
      transition:all .2s ease;
      border:1px solid transparent;
    }
    .category-item:hover{
      background:#222;
      border-color:rgba(229,9,20,0.3);
    }
    .category-item .cat-name{
      flex:1;
      font-size:16px;
      font-weight:600;
      color:#fff;
    }
    .category-item .cat-count{
      font-size:13px;
      color:rgba(255,255,255,0.4);
      margin-right:8px;
    }
    .category-item .cat-arrow{
      color:rgba(255,255,255,0.3);
      font-size:18px;
      transition:all .2s;
    }
    .category-item:hover .cat-arrow{
      color:#e50914;
      transform:translateX(4px);
    }
    /* 分类区块样式（带频道预览） */
    .category-section{
      background:#1a1a1a;
      border-radius:16px;
      margin-bottom:16px;
      overflow:hidden;
      border:1px solid rgba(255,255,255,0.06);
      box-shadow:0 4px 24px rgba(0,0,0,0.3);
      transition:all .3s ease;
      opacity:0;
      transform:translateY(20px);
      animation:fadeInUp .5s ease forwards;
    }
    .category-section:hover{
      border-color:rgba(229,9,20,0.4);
      box-shadow:0 8px 40px rgba(229,9,20,0.15),0 4px 24px rgba(0,0,0,0.4);
      transform:translateY(-2px);
    }
    @keyframes fadeInUp{
      to{opacity:1;transform:translateY(0)}
    }
    .category-header{
      display:flex;
      align-items:center;
      gap:16px;
      padding:16px 20px;
      cursor:pointer;
      transition:background .2s;
      border-bottom:1px solid rgba(255,255,255,0.04);
    }
    .category-header:hover{
      background:rgba(255,255,255,0.02);
    }
    .category-header .cat-name{
      flex:1;
      font-size:18px;
      font-weight:700;
      color:#fff;
      letter-spacing:.02em;
    }
    .category-header .cat-count{
      font-size:13px;
      color:rgba(255,255,255,0.4);
      margin-right:8px;
      font-weight:500;
    }
    .category-header .cat-arrow{
      color:rgba(255,255,255,0.3);
      font-size:14px;
      transition:all .3s ease;
      transform:rotate(0deg);
    }
    .category-header:hover .cat-arrow{
      color:#e50914;
      transform:rotate(90deg);
    }
    .category-channels-preview{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(120px,1fr));
      gap:10px;
      padding:16px 20px 20px;
    }
    .category-channel-item{
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:8px;
      padding:16px 12px;
      background:rgba(255,255,255,0.02);
      border-radius:12px;
      cursor:pointer;
      transition:all .25s ease;
      text-align:center;
      border:1px solid transparent;
    }
    .category-channel-item:hover{
      background:rgba(229,9,20,0.08);
      border-color:rgba(229,9,20,0.3);
      transform:translateY(-4px) scale(1.02);
      box-shadow:0 8px 24px rgba(229,9,20,0.2);
    }
    .category-channel-item .cat-ch-logo{
      width:48px;
      height:48px;
      object-fit:contain;
      border-radius:10px;
      background:#2a2a2a;
      padding:4px;
      transition:transform .25s ease;
    }
    .category-channel-item:hover .cat-ch-logo{
      transform:scale(1.1);
    }
    .category-channel-item .cat-ch-name{
      font-size:12px;
      color:rgba(255,255,255,0.85);
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      max-width:100%;
      font-weight:500;
    }
    .category-more{
      display:flex;
      align-items:center;
      justify-content:center;
      padding:12px;
      color:#e50914;
      font-size:13px;
      cursor:pointer;
      grid-column:1/-1;
    }
    .category-more:hover{
      text-decoration:underline;
    }
    .category-grid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
      gap:20px;
      max-width:1200px;
      margin:0 auto;
    }
    .category-card{
      background:#1a1a1a;
      border-radius:16px;
      padding:24px 20px;
      text-align:center;
      cursor:pointer;
      transition:all .3s ease;
      border:2px solid transparent;
    }
    .category-card:hover{
      transform:translateY(-4px);
      border-color:#e50914;
      box-shadow:0 8px 30px rgba(229,9,20,0.2);
    }
    .category-card .cat-icon{
      font-size:48px;
      margin-bottom:12px;
    }
    .category-card .cat-name{
      font-size:16px;
      font-weight:600;
      color:#fff;
      margin-bottom:8px;
    }
    .category-card .cat-count{
      font-size:13px;
      color:rgba(255,255,255,0.5);
    }

    /* ========== 面包屑导航 ========== */
    .breadcrumb{
      display:flex;
      align-items:center;
      gap:8px;
      padding:12px 0;
      font-size:14px;
      color:rgba(255,255,255,0.5);
    }
    .breadcrumb a{
      color:rgba(255,255,255,0.5);
      text-decoration:none;
      transition:color .2s;
    }
    .breadcrumb a:hover{color:#e50914}
    .breadcrumb-sep{color:rgba(255,255,255,0.25)}
    .breadcrumb-current{color:#fff;font-weight:600}

    /* ========== 其他分类横向滚动 ========== */
    .other-categories{
      margin-top:24px;
      padding-top:20px;
    }
    .other-categories-header{
      margin-bottom:12px;
    }
    .other-categories-title{
      font-size:14px;
      font-weight:600;
      color:#fff;
    }
    .other-categories-scroll{
      display:flex;
      gap:10px;
      overflow-x:auto;
      padding-bottom:8px;
      scrollbar-width:none;
      -ms-overflow-style:none;
    }
    .other-categories-scroll::-webkit-scrollbar{display:none}
    .other-cat-btn{
      flex-shrink:0;
      padding:6px 14px;
      background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.1);
      border-radius:20px;
      font-size:13px;
      color:rgba(255,255,255,0.7);
      cursor:pointer;
      transition:all .2s;
      white-space:nowrap;
    }
    .other-cat-btn:hover{
      background:rgba(255,255,255,0.1);
      color:#fff;
      border-color:rgba(255,255,255,0.2);
    }

    /* 响应式适配 */
    @media(max-width:900px){
      .category-browse{padding:24px}
      .content-full{padding:16px 24px}
    }
    @media(max-width:768px){
      .category-browse{margin-top:16px}
      .content-full{margin-top:60px}
    }
    @media(max-width:600px){
      .category-item{padding:12px}
      .category-item .cat-icon{font-size:20px}
      .category-item .cat-name{font-size:14px}
      .channel-table-header{display:none}
      .channel-item{grid-template-columns:48px 1fr 50px 50px;gap:10px;padding:12px 16px}
      .channel-item .ch-icon{width:40px;height:40px;font-size:16px}
      .channel-item .ch-icon img,.channel-item .ch-icon .channel-icon{width:40px!important;height:40px!important;font-size:16px!important}
      .channel-item .ch-name{font-size:13px}
      .channel-item .ch-group{font-size:11px}
      .ch-fav-btn,.ch-copy-btn{font-size:14px;padding:4px}
      .category-browse{padding:16px}
      .content-full{padding:12px 16px}
      .browse-title{font-size:20px}
      .breadcrumb{padding:12px 0;font-size:13px}
    }
  `
    
