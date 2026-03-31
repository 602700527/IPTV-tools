// 交互式播放站首页
import { PAGE_FOOTER } from './components/page-footer.js';

export const HOME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IPTV Search — Free IPTV Channel Directory &amp; Search Engine</title>

  <!-- ========== SEO Meta Tags ========== -->
  <!-- 基础Meta标签 -->
  <meta name="description" content="Free IPTV link search engine - discover and share public IPTV channels. Find m3u8, m3u playlists. Search free IPTV channels by country. Updated daily.">
  <meta name="keywords" content="IPTV link search,public IPTV channels,m3u,m3u8,flv,mp3,mp4,ts,udp,rtp,video,player,free IPTV,live TV streaming,TV channel search,IPTV playlist">
  <meta name="author" content="IPTV Search">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <meta name="baiduspider" content="index, follow">
  <meta name="revisit-after" content="1 days">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com">
  <meta property="og:title" content="IPTV Search — Free IPTV Channel Directory &amp; Search Engine">
  <meta property="og:description" content="Search and discover public IPTV channels. Find free m3u8, m3u playlists with free IPTV channel links. Updated daily.">
  <meta property="og:image" content="https://iptv-search.com/og-homepage.png">
  <meta property="og:site_name" content="IPTV Search">
  <meta property="og:locale" content="en_US">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://iptv-search.com">
  <meta name="twitter:title" content="IPTV Search - Free IPTV Link Search Engine">
  <meta name="twitter:description" content="Search and discover public IPTV channels. Find free m3u8, m3u playlists with free IPTV channel links.">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://iptv-search.com">

  <!-- ========== Multi-language SEO: Hreflang Tags ========== -->
  <!-- 告诉搜索引擎这是多语言页面，每个语言版本在哪里 -->
  <link rel="alternate" hreflang="en" href="https://iptv-search.com/" />
  <link rel="alternate" hreflang="zh-CN" href="https://iptv-search.com/?lang=zh-CN" />
  <link rel="alternate" hreflang="zh-TW" href="https://iptv-search.com/?lang=zh-TW" />
  <link rel="alternate" hreflang="x-default" href="https://iptv-search.com/" />

  <!-- Favicon - Google搜索结果需要 -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any">
  <link rel="shortcut icon" href="/favicon.ico">

  <!-- Apple Touch Icon - iOS设备 -->
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png" sizes="180x180">

  <!-- Android/iOS图标 -->
  <meta name="msapplication-TileImage" content="/icon-192.png">
  <meta name="msapplication-TileColor" content="#e50914">

  <!-- 移动端优化 -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="IPTV Search">
  <meta name="theme-color" content="#e50914">

  <!-- Open Graph图标 -->
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/svg+xml">

  <!-- 结构化数据 (JSON-LD) -->
  <script type="application/ld+json" id="structured-data">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IPTV Search",
    "url": "https://iptv-search.com",
    "description": "Free IPTV link search engine - discover and share public IPTV channels with m3u8 playlists.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://iptv-search.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "IPTV Search",
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
        "name": "Home",
        "item": "https://iptv-search.com"
      }
    ]
  }
  </script>

  <!-- ========== GEO Optimization: FAQPage Schema (Highest Priority for AI Citations) ========== -->
  <script type="application/ld+json" id="faq-schema">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I find free IPTV channels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Search for IPTV channels using our search engine. We index and share public IPTV channel links free IPTV channels by country. Find m3u8 and m3u playlists that work with VLC, IPTV apps, and other media players."
        }
      },
      {
        "@type": "Question",
        "name": "What devices can I use with IPTV playlists?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IPTV playlists work on all devices: mobile phones (iOS/Android), desktop computers, smart TVs, and streaming devices. Use VLC media player, IPTV apps, or any IPTV-compatible application to play the channels."
        }
      },
      {
        "@type": "Question",
        "name": "What format are the IPTV links?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide IPTV links in standard m3u8 and m3u formats. These are compatible with all major IPTV players and applications. Links include sports, news, entertainment, movies, and international channels."
        }
      },
      {
        "@type": "Question",
        "name": "Is registration required to use IPTV Search?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No registration is required. Search and discover free public IPTV channels instantly. For premium features like M3U subscription links for external players, you can purchase a subscription code."
        }
      },
      {
        "@type": "Question",
        "name": "How many channels are available on IPTV Search?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IPTV Search provides access to 10,000+ channels across multiple categories: sports, news, entertainment, movies, documentaries, kids programming, music, and international content from countries worldwide."
        }
      },
      {
        "@type": "Question",
        "name": "Can I find sports channels on IPTV Search?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, IPTV Search offers extensive sports coverage including football, basketball, tennis, cricket, and more. Find live sports channels from around the world in HD quality without cable subscription."
        }
      }
    ]
  }
  </script>

  <!-- ========== GEO Optimization: Organization Schema (Authority Signal) ========== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "IPTV Search",
    "alternateName": "IPTV Live",
    "url": "https://iptv-search.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://iptv-search.com/logo.svg",
      "width": 200,
      "height": 60
    },
    "description": "IPTV Search is a free IPTV link search engine providing access to 10,000+ public channels including sports, news, entertainment, and movies worldwide.",
    "foundingDate": "2026",
  "sameAs": [
    "https://t.me/+-3ApDTfNb19jNWI1"
  ]
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://iptv-search.com"
    }
  }
  </script>

  <!-- ========== GEO Optimization: WebPage with Wikidata Entity Links (Strongest 2026 Signal) ========== -->
  <script type="application/ld+json" id="webpage-schema">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "IPTV Search - Free IPTV Link Search Engine",
    "url": "https://iptv-search.com",
    "description": "Free IPTV link search engine - discover and share public IPTV channels. Find m3u8, m3u playlists. Search free IPTV channels by country. Updated daily.",
    "dateModified": "${new Date().toISOString().split('T')[0]}",
    "author": {
      "@type": "Organization",
      "name": "IPTV Search",
      "url": "https://iptv-search.com"
    },
    "about": {
      "@type": "Thing",
      "name": "Internet Protocol television",
      "sameAs": "https://www.wikidata.org/wiki/Q170418"
    },
    "mentions": [
      {
        "@type": "Thing",
        "name": "Live streaming",
        "sameAs": "https://www.wikidata.org/wiki/Q2939123"
      },
      {
        "@type": "Thing",
        "name": "Television channel",
        "sameAs": "https://www.wikidata.org/wiki/Q21286"
      },
      {
        "@type": "Thing",
        "name": "Video on demand",
        "sameAs": "https://www.wikidata.org/wiki/Q12747"
      },
      {
        "@type": "Thing",
        "name": "Streaming media",
        "sameAs": "https://www.wikidata.org/wiki/Q215804"
      }
    ]
  }
  </script>

  <!-- ========== GEO Optimization: HowTo Schema ========== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Watch Live TV on IPTV Search",
    "description": "Learn how to watch free live TV channels online using IPTV Search streaming platform.",
    "totalTime": "PT1M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Browse Channels",
        "text": "Browse the channel list organized by categories, or use the search bar to find your favorite channels by name.",
        "image": "https://iptv-search.com/og-image.svg"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Select a Channel",
        "text": "Click on any channel card to start streaming instantly. The built-in video player will open automatically.",
        "image": "https://iptv-search.com/og-image.svg"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Watch or Subscribe",
        "text": "Watch for free in your browser, or get a subscription code to use with external players like VLC, Kodi, or IPTV apps on smart TVs.",
        "image": "https://iptv-search.com/og-image.svg"
      }
    ]
  }
  </script>

  <!-- ========== GEO Optimization: SoftwareApplication Schema ========== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "IPTV Search Streaming Player",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  </script>

  <!-- ========== GEO Optimization: Update Date Meta Tag (Freshness Signal) ========== -->
  <meta name="article:modified_time" content="${new Date().toISOString().split('T')[0]}">
  <meta name="last-modified" content="${new Date().toISOString().split('T')[0]}">

  <link rel="stylesheet" href="/seo-home.css">
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <div class="header-left">
        <a href="/" class="logo-link">
          <div class="logo">
            <img src="/logo.svg" alt="IPTV Search Logo" />
          </div>
        </a>
        <div class="online-counter">
          <span class="online-dot"></span>
          <span class="online-count" id="onlineCount">0</span> <span id="onlineCountText">viewers</span>
        </div>
      </div>
      <div class="header-right">
      <div class="quick-entries">
        <button class="quick-entry ripple" id="historyQuickEntry" onclick="handleQuickEntryClick(event, 'history')" title="History">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span class="quick-entry-tip">History</span>
          <span class="quick-entry-badge" id="historyBadge" style="display:none;">0</span>
        </button>
        <button class="quick-entry ripple" onclick="handleQuickEntryClick(event, 'favorites')" title="Favorites">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span class="quick-entry-tip">My Favorites</span>
          <span class="quick-entry-badge" id="favoritesBadge" style="display:none;">0</span>
        </button>
        <button class="quick-entry ripple" onclick="handlePlansClick()" title="Plans">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          <span class="quick-entry-tip">Plans</span>
        </button>
        
        <div id="authButtons">
          <button class="auth-btn ripple" onclick="openLoginModal()">Login</button>
        </div>
        <!-- Translate.js 语言切换器容器 -->
        <div id="translate" style="margin-left: 12px;"></div>
      </div>
    </div>
    <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
      ☰
    </button>
    </div>
  </header>

  <style>.hero-section{margin-top:70px;padding:40px 20px 30px;text-align:center;background:#0a0a0a}.hero-section.hidden{display:none}.hero-title{font-size:1.8rem;font-weight:800;color:#fff;margin:0 0 24px 0;letter-spacing:-.02em;line-height:1.3}.hero-search-form{display:flex;max-width:700px;margin:0 auto 20px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);box-shadow:0 0 20px rgba(229,9,20,0.15),0 4px 20px rgba(0,0,0,0.3)}.hero-search-input{flex:1;padding:18px 24px;border:none;border-radius:0;background:#1e1e1e;color:#fff;font-size:16px;outline:none;transition:background 0.2s}.hero-search-input::placeholder{color:rgba(255,255,255,0.4)}.hero-search-input:focus{background:#252525}.hero-search-btn{display:flex;align-items:center;justify-content:center;padding:0 24px;background:#2a2a2a;border:none;color:rgba(255,255,255,0.7);cursor:pointer;transition:all 0.2s}.hero-search-btn:hover{background:#e50914;color:#fff}.hero-trust{color:rgba(255,255,255,0.45);font-size:0.85rem;display:flex;gap:20px;justify-content:center;flex-wrap:wrap;max-width:700px;margin:0 auto}</style>
  <div class="hero-section" id="heroSection">
    <h1 class="hero-title">IPTV Search — Free IPTV Channel Directory & Search Engine</h1>
    <div class="hero-search">
      <form action="/search" method="get" class="hero-search-form" id="heroSearchForm">
        <input type="text" name="q" class="hero-search-input" placeholder="Search &apos;CCTV&apos;, &apos;ESPN&apos;, &apos;HBO&apos;..." aria-label="Search IPTV channels" id="heroSearchInput">
        <button type="submit" class="hero-search-btn" aria-label="Search">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
</button>
      </form>
    </div>
    <div class="hero-trust">
      <span>✅ No registration</span>
      <span>✅ Updated daily</span>
      <span>✅ Works on any device</span>
    </div>
  </div>

  <!-- 移动端菜单 -->
  <div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="toggleMobileMenu()"></div>
  <div class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-header">
      <div class="mobile-menu-title">Menu</div>
      <button class="mobile-menu-close" onclick="toggleMobileMenu()">✕</button>
    </div>

    <div class="mobile-section">
      <div class="mobile-section-title">Quick Actions</div>
      <div class="mobile-actions">
        <div class="mobile-action-btn" id="historyMobileAction" onclick="handleMobileAction('history')">
          <span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span>
        </div>
        <div class="mobile-action-btn" onclick="handleMobileAction('favorites')">
          <span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
        </div>
        <div class="mobile-action-btn" onclick="handleMobileAction('random')">
          <span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line><circle cx="16" cy="8" r="2" fill="currentColor"></circle><circle cx="8" cy="16" r="2" fill="currentColor"></circle></svg></span>
        </div>
        <div class="mobile-action-btn" onclick="handleMobileAction('plans')">
          <span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg></span>
        </div>
        <div class="mobile-action-btn" onclick="handleMobileAction('account')">
          <span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span>
        </div>
        <div class="mobile-action-btn" onclick="handleMobileAction('clearCache')">
          <span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span>
        </div>
      </div>
    </div>

    

    <div class="mobile-section">
      <div class="mobile-section-title">Group Navigation</div>
      <div id="mobileGroupList"></div>
    </div>
  </div>

  <!-- 首页分类浏览模式 -->
  <div class="category-browse" id="categoryBrowse">
    <div class="page-container">
      <div class="category-list" id="categoryGrid"></div>
    </div>
  </div>

  <!-- 频道列表区域 - 点击分类后显示 -->
  <div class="content-full" id="contentArea" style="display:none;">
    <div class="page-container">
      <div id="loading" class="loading">
        <div class="spinner"></div>
        <span class="loading-text">Loading...</span>
      </div>

      <div id="channelList" style="display:none;">
        <!-- 公告弹窗 -->
        <div class="announcement-modal" id="announcementModal">
          <div class="announcement-modal-box">
            <div class="announcement-modal-header">
              <div class="announcement-modal-title">
                <span class="announcement-modal-icon">📢</span>
                <span id="announcementTitle">Announcement</span>
              </div>
              <button class="announcement-close" onclick="closeAnnouncement()">&times;</button>
            </div>
            <div class="announcement-modal-body" id="announcementContent">
              <p>Loading...</p>
            </div>
            <div class="announcement-modal-footer">
              <div class="announcement-modal-time" id="announcementTime">
                <span>🕐</span>
                <span>Publishing time loading</span>
              </div>
              <button class="announcement-modal-button" onclick="closeAnnouncement()">Got it</button>
            </div>
          </div>
        </div>

        <!-- ========== GEO Optimization: Direct Answer Block (First 100 Words) ========== -->
        <!-- 这一块对SEO/AI很重要，但影响用户体验，所以用CSS隐藏但保留在DOM中供搜索引擎抓取 -->
        <div class="geo-direct-answer" style="margin-bottom: 20px; padding: 16px 20px; background: linear-gradient(135deg, rgba(229,9,20,0.1) 0%, rgba(184,29,36,0.05) 100%); border-radius: 12px; border-left: 4px solid #e50914; display: none;">
          <p style="font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.9); margin: 0;">
            <strong style="color: #e50914;">IPTV Search</strong> lets you <strong>watch live TV online for free</strong> with 10,000+ HD channels including sports, news, entertainment, and movies.
            <strong>No registration required</strong> — select any channel below to start watching instantly in your browser, or get a subscription for external players like VLC and IPTV apps.
          </p>
          <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 8px 0 0 0;">
            📅 Last updated: February 2026 | 🌐 Available worldwide
          </p>
        </div>

        <div class="channel-table">
          <div class="channel-table-header">
            <span class="cth-logo"></span>
            <span class="cth-name">Channel</span>
            <span class="cth-group">Category</span>
            <span class="cth-action">Favorite</span>
            <span class="cth-action">Copy</span>
          </div>
          <div class="channel-list" id="channelsGrid"></div>
        </div>
        <div class="pagination" id="pagination"></div>

        <!-- 其他分类横向滚动 -->
        <div class="other-categories" id="otherCategories">
          <div class="other-categories-header">
            <span class="other-categories-title">📂 Other Categories</span>
          </div>
          <div class="other-categories-scroll" id="otherCategoriesScroll"></div>
        </div>
      </div>

      <!-- 频道详情视图 -->
      <div id="channelDetailView" class="channel-detail-view page-container" style="display:none;">
        <div class="channel-detail-container" id="channelDetailContainer"></div>
      </div>

      <div id="emptyState" class="empty-state" style="display:none;">
        <div class="empty-icon">📺</div>
        <div class="empty-title">No Channels Found</div>
        <div class="empty-desc">Try other search terms or groups</div>
      </div>
    </div>
  </div>

  <!-- 快捷面板 -->
  <div class="quick-panel" id="quickPanel">
    <div class="quick-panel-header">
      <div class="quick-panel-title" id="quickPanelTitle">📌 Panel</div>
      <button class="quick-panel-close" onclick="closeQuickPanel()">&times;</button>
    </div>
    <div class="quick-panel-content" id="quickPanelContent"></div>
  </div>

  <!-- 加载指示器 -->
  <div class="loading-indicator" id="loadingIndicator">
    <div class="loading-spinner"></div>
    <div class="loading-text" id="loadingText">Loading...</div>
  </div>

      <!-- Toast 提示容器 -->
  <div class="toast-container" id="toastContainer"></div>

  <div class="player-wrapper collapsed" id="playerWrapper">
    <div class="player-header" id="playerHeader">
      <div class="player-info">
        <div class="player-title" id="playerTitle">Channel Name</div>
        <div class="player-group" id="playerGroup">Group</div>
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

  <!-- 悬浮功能栏 - 右下角 -->
  <div class="action-bar" id="actionBar">
    <!-- 下载收藏按钮 -->
    <button class="action-bar-btn download" id="favoritesDownloadBtn" onclick="downloadFavoritesM3U()" title="Download favorites as M3U">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </button>
    <!-- TG群链接按钮 -->
    <a class="action-bar-btn telegram" id="telegramBtn" href="https://t.me/+-3ApDTfNb19jNWI1" target="_blank" rel="noopener noreferrer" title="Join Telegram Group">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
      </svg>
    </a>
    <!-- 返回顶部按钮 -->
    <button class="action-bar-btn top" id="backToTopBtn" onclick="scrollToTop()" title="Back to top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </div>
   
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    // Translate.js 初始化
    function initTranslate() {
      if (typeof translate !== 'undefined' && !window.translate) {
        window.translate = translate;
      }
      if (typeof translate !== 'undefined' && translate.language) {
        // 设置本地语种
        translate.language.setLocal('english');
        // 使用边缘翻译服务
        translate.service.use('client.edge');
        // 开启页面元素动态监控
        translate.listener.start();
        
        // 显式显示语言选择器
        if (translate.selectLanguageTag) {
          translate.selectLanguageTag.show = true;
        }
        
        // 执行翻译（语言选择器会自动从翻译服务获取支持的语言）
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

    // 调试防护功能
    (function() {
      let antiDebugEnabled = false;
      let consoleLogsDisabled = false;

      // 从服务器配置加载调试防护设置
      async function checkAntiDebugConfig() {
        try {
          const response = await fetch(window.location.origin + '/api/config');
          const result = await response.json();
          if (result.success && result.config) {
            antiDebugEnabled = result.config.enable_anti_debug || false;
            consoleLogsDisabled = result.config.disable_console_logs || false;

            // 更新系统配置
            systemConfig.enable_play_token = result.config.enable_play_token !== undefined ? result.config.enable_play_token : false;
            systemConfig.enable_url_encryption = result.config.enable_url_encryption || false;

            if (result.config.enable_url_encryption && result.config.url_encryption_key) {
              DECRYPTION_KEY = result.config.url_encryption_key;
              console.log('[Config] URL加密密钥已加载');
            }

            console.log('[Config] 系统配置已加载:', {
              enable_play_token: systemConfig.enable_play_token,
              enable_url_encryption: systemConfig.enable_url_encryption
            });

            if (antiDebugEnabled) {
              enableAntiDebug();
            }

            if (consoleLogsDisabled) {
              disableConsoleLogs();
            }
          }
        } catch (e) {
          console.log('无法获取调试配置');
        }
      }

      // 启用调试防护
      function enableAntiDebug() {
        console.log('[AntiDebug] 调试防护已启用');

        // 1. 禁用右键菜单
        document.addEventListener('contextmenu', function(e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });

        // 2. 禁用常见开发者快捷键
        document.addEventListener('keydown', function(e) {
          // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
          if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
          ) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }, true);

        // 3. 检测开发者工具（通过调试器检测）
        setInterval(function() {
          const start = performance.now();
          debugger;
          const end = performance.now();
          if (end - start > 100) {
            // 如果检测到调试器，清空页面
            document.body.innerHTML = '';
            window.location.reload();
          }
        }, 2000);

        // 4. 检测窗口尺寸变化（开发者工具打开时窗口高度会改变）
        const threshold = 160;
        const initialHeight = window.innerHeight;
        window.addEventListener('resize', function() {
          const currentHeight = window.innerHeight;
          if (currentHeight < initialHeight - threshold) {
            // 可能是开发者工具打开，刷新页面
            setTimeout(function() {
              if (window.innerHeight < initialHeight - threshold) {
                window.location.reload();
              }
            }, 100);
          }
        });
      }

      // 禁用控制台日志输出
      function disableConsoleLogs() {
        const consoleMethods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
        consoleMethods.forEach(function(method) {
          const original = console[method];
          console[method] = function() {
            // 完全移除所有输出
            // 可以选择性地将重要错误发送到服务器
            // 但这里为了安全考虑，完全禁用输出
          };
        });
      }

      // 页面加载后检查配置
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAntiDebugConfig);
      } else {
        checkAntiDebugConfig();
      }
    })();

    // ========== 工具函数 ==========
    function escapeHtml(str) {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
    function jsEncode(str) {
      if (!str) return '';
      return String(str).replace(/'/g, "\\'");
    }

    // ========== 翻译函数 ==========
    // 默认英文翻译
    function t(key) {
      // 英文文本作为默认值
      const translations = {
        'title': 'IPTV Search - Free IPTV Link Search Engine | M3U8 M3U Playlist Search',
        'searchPlaceholder': 'Search channels...',
        'allChannels': 'All Channels',
        'search': 'Search',
        'history': 'History',
        'favorites': 'Favorites',
        'random': 'Random',
        'plans': 'Plans',
        'clearCache': 'Clear Cache',
        'onlineCount': 'watching',
        'hot': 'Hot',
        'noHistory': 'No watch history',
        'noHistoryDesc': 'Watched channels will appear here',
        'noFavorites': 'No favorites yet',
        'noFavoritesDesc': 'Click the star button on a channel to add to favorites',
        'noChannels': 'No channels found',
        'noChannelsDesc': 'Try a different search term or category',
        'loading': 'Loading channels...',
        'cacheCleared': 'Cache cleared',
        'playing': 'Playing',
        'toastRefresh': 'Unable to play, please refresh and try again.',
        'toastBrowserLimit': 'Playback limited by browser. Please get a subscription and use in your player.',
        'toastChannelLost': 'Channel data lost, please clear cache and try again.',
        'toastSuccess': 'Success',
        'toastError': 'Playback Failed',
        'toastWarning': 'Warning',
        'toastInfo': 'Info',
        'loginTitle': 'Login',
        'registerTitle': 'Register',
        'email': 'Email',
        'password': 'Password',
        'emailCode': 'Email Code',
        'emailPlaceholder': 'Enter email',
        'passwordPlaceholder': 'Enter password (min 8 characters)',
        'codePlaceholder': 'Enter 6-digit code',
        'loginBtn': 'Login',
        'registerBtn': 'Register',
        'getCode': 'Get Code',
        'forgotPassword': 'Forgot password?',
        'noAccount': 'No account?',
        'registerNow': 'Register now',
        'hasAccount': 'Already have an account?',
        'loginNow': 'Login now',
        'emailEmpty': 'Email is required',
        'emailInvalid': 'Invalid email format',
        'passwordEmpty': 'Password is required',
        'passwordTooShort': 'Password must be at least 8 characters',
        'networkError': 'Network error, please try again later',
        'loginSuccess': 'Login successful',
        'loginFailed': 'Login failed',
        'codeSent': 'Verification code sent',
        'sendCodeFailed': 'Failed to send code',
        'registerSuccess': 'Registration successful',
        'registerFailed': 'Registration failed',
        'enterCode': 'Please enter the verification code',
        'enter6DigitCode2': 'Please enter a valid 6-digit code',
        'enterCodeFirst': 'Please enter your email first',
        'needVerifyEmail': 'Please verify your email first',
        'forgotPasswordTitle': 'Reset Password',
        'forgotPasswordDesc': 'Enter your registered email and we will send a reset link',
        'sendResetLink': 'Send Reset Link',
        'backToLogin': 'Back to Login',
        'resetSuccess': 'Reset link sent, please check your email',
        'resetFailed': 'Failed to send reset link',
        'resendCountdown': 'Resend in {count}s',
        'verifyEmailTitle': 'Email Verification',
        'verifyEmailDesc': 'Click the button below to get verification code',
        'verifyEmailBtn': 'Verify Email',
        'enter6DigitCode': 'Enter 6-digit code',
        // 分页相关
        'totalItems': 'Total',
        'page': 'Page',
        'firstPage': 'First',
        'prevPage': 'Prev',
        'nextPage': 'Next',
        'lastPage': 'Last',
        // 面包屑
        'home': 'Home',
        // 收藏相关
        'clearAllFavorites': 'Clear All',
        'confirmClearAllFavorites': 'Are you sure you want to clear all favorites?',
        'favoritesCleared': 'All favorites cleared'
      };
      return translations[key] || key;
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
      // 移动端不需要波纹效果，直接调用对应的操作
      switch (action) {
        case 'history':
          if (!enableIpPlay) return;
          showHistoryInMain();
          break;
        case 'favorites':
          showFavoritesInMain();
          break;
        case 'random':
          showRandomInMain();
          break;
        case 'plans':
          window.location.href = '/plans';
          break;
        case 'account':
          const currentToken = localStorage.getItem('auth_token');
          const currentUserData = JSON.parse(localStorage.getItem('current_user') || 'null');
          if (currentToken && currentUserData) {
            window.location.href = '/account';
          } else {
            openLoginModal();
          }
          break;
        case 'clearCache':
          clearCache();
          loadChannels(1, true, true);  // 强制刷新，跳过缓存
          showPlayingIndicator(t('cacheCleared'));
          break;
      }
    }

    // SEO moved to static English meta tags; removed dynamic SEO blocks

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

      // 关闭下拉菜单（添加空值检查）
      var langDropdown = document.getElementById('langDropdown');
      if (langDropdown) {
        langDropdown.classList.remove('open');
      }

      // 关闭移动端菜单（如果打开）
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
      }

      // 更新 HTML lang 属性
      document.documentElement.lang = lang;

      // ========== 多语言SEO: 动态更新SEO Meta标签 ==========
      updateSEOMetaForLanguage(lang);

      // 保存语言设置
      localStorage.setItem('iptv_language', lang);

      // 刷新页面内容
      updateLanguageContent();
    }

    // ========== 多语言SEO: 更新SEO Meta标签函数 ==========
    function updateSEOMetaForLanguage(lang) {
      const isZhCN = lang === 'zh-CN';
      const origin = window.location.origin;
      const url = isZhCN ? origin + '/?lang=zh-CN' : origin + '/';

      // 中文和英文的SEO数据
      const seoData = {
        'zh-CN': {
          title: 'IPTV Search - 免费IPTV链接搜索引擎 | M3U8 M3U播放列表',
          description: '免费IPTV链接搜索引擎 - 发现和分享公共IPTV频道。提供m3u8、m3u播放列表，包含体育、新闻、电影、娱乐等频道，每日更新。',
          keywords: 'IPTV链接搜索,公共IPTV频道,m3u,m3u8,flv,mp3,mp4,ts,udp,rtp,video,player,免费IPTV,电视直播,电视频道搜索,IPTV播放列表',
          ogTitle: 'IPTV Search - 免费IPTV链接搜索引擎',
          ogDescription: '免费IPTV链接搜索引擎 - 发现和分享公共IPTV频道。提供m3u8、m3u播放列表，包含体育、新闻、电影、娱乐等频道，每日更新。',
          ogLocale: 'zh_CN'
        },
        'en': {
          title: 'IPTV Search - Free IPTV Link Search Engine | M3U8 M3U Playlist Search',
          description: 'Free IPTV link search engine - discover and share public IPTV channels. Find m3u8, m3u playlists. Search free IPTV channels by country. Updated daily.',
          keywords: 'IPTV link search,public IPTV channels,m3u,m3u8,flv,mp3,mp4,ts,udp,rtp,video,player,free IPTV,live TV streaming,TV channel search,IPTV playlist',
          ogTitle: 'IPTV Search - Free IPTV Link Search Engine',
          ogDescription: 'Search and discover public IPTV channels. Find free m3u8, m3u playlists with free IPTV channel links. Updated daily.',
          ogLocale: 'en_US'
        }
      };

      const data = seoData[lang] || seoData['en'];

      // 更新页面标题
      document.title = data.title;

      // 更新Meta标签
      updateMetaTag('name', 'description', data.description);
      updateMetaTag('name', 'keywords', data.keywords);

      // 更新Open Graph标签
      updateMetaTag('property', 'og:title', data.ogTitle);
      updateMetaTag('property', 'og:description', data.ogDescription);
      updateMetaTag('property', 'og:locale', data.ogLocale);

      // 更新Twitter Card标签
      updateMetaTag('name', 'twitter:title', data.ogTitle);
      updateMetaTag('name', 'twitter:description', data.ogDescription);

      // 更新Canonical URL（中文版带lang参数）
      updateMetaTag('link', 'canonical', url, 'href');

      // 更新中文FAQ Schema
      updateFAQSchemaForLanguage(lang);

      // 更新WebPage Schema
      updateWebPageSchemaForLanguage(lang);
    }

    // ========== 多语言SEO: 更新FAQ Schema ==========
    function updateFAQSchemaForLanguage(lang) {
      const faqScript = document.getElementById('faq-schema');
      if (!faqScript) return;

      const isZhCN = lang === 'zh-CN';

      const zhFAQ = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "如何找到免费IPTV频道？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "使用我们的搜索引擎搜索IPTV频道。我们收录并分享公共IPTV频道链接，包括体育、新闻、电影、娱乐等。查找可在VLC、IPTV应用和其他媒体播放器中使用的m3u8和m3u播放列表。"
            }
          },
          {
            "@type": "Question",
            "name": "我可以在哪些设备上使用IPTV播放列表？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "IPTV播放列表适用于所有设备：手机（iOS/Android）、桌面电脑、智能电视和流媒体设备。使用VLC媒体播放器、IPTV应用或任何支持IPTV的应用程序来播放频道。"
            }
          },
          {
            "@type": "Question",
            "name": "IPTV链接是什么格式？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "我们提供标准m3u8和m3u格式的IPTV链接。这些链接兼容所有主流IPTV播放器和应用程序。链接包含体育、新闻、娱乐、电影和国际频道。"
            }
          },
          {
            "@type": "Question",
            "name": "使用IPTV Search需要注册吗？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "无需注册。立即搜索和发现免费公共IPTV频道。对于外部播放器的高级功能（如M3U订阅链接），您可以购买订阅码。"
            }
          },
          {
            "@type": "Question",
            "name": "有多少个频道？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "IPTV Search提供10000+频道，涵盖多个类别：体育、新闻、娱乐、电影、纪录片、少儿节目、音乐以及来自世界各地的国际内容。"
            }
          },
          {
            "@type": "Question",
            "name": "可以在IPTV Search上找到体育频道吗？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "可以。IPTV Search提供丰富的体育赛事频道，包括足球、篮球、网球、板球等。无需有线电视订阅，即可在全球观看高清体育赛事。"
            }
          }
        ]
      };

      const enFAQ = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I find free IPTV channels?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Search for IPTV channels using our search engine. We index and share public IPTV channel links free IPTV channels by country. Find m3u8 and m3u playlists that work with VLC, IPTV apps, and other media players."
            }
          },
          {
            "@type": "Question",
            "name": "What devices can I use with IPTV playlists?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "IPTV playlists work on all devices: mobile phones (iOS/Android), desktop computers, smart TVs, and streaming devices. Use VLC media player, IPTV apps, or any IPTV-compatible application to play the channels."
            }
          },
          {
            "@type": "Question",
            "name": "What format are the IPTV links?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide IPTV links in standard m3u8 and m3u formats. These are compatible with all major IPTV players and applications. Links include sports, news, entertainment, movies, and international channels."
            }
          },
          {
            "@type": "Question",
            "name": "Is registration required to use IPTV Search?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No registration is required. Search and discover free public IPTV channels instantly. For premium features like M3U subscription links for external players, you can purchase a subscription code."
            }
          },
          {
            "@type": "Question",
            "name": "How many channels are available on IPTV Search?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "IPTV Search provides access to 10,000+ channels across multiple categories: sports, news, entertainment, movies, documentaries, kids programming, music, and international content from countries worldwide."
            }
          },
          {
            "@type": "Question",
            "name": "Can I find sports channels on IPTV Search?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, IPTV Search offers extensive sports coverage including football, basketball, tennis, cricket, and more. Find live sports channels from around the world in HD quality without cable subscription."
            }
          }
        ]
      };

      faqScript.textContent = JSON.stringify(isZhCN ? zhFAQ : enFAQ);
    }

    // ========== 多语言SEO: 更新WebPage Schema ==========
    function updateWebPageSchemaForLanguage(lang) {
      const webPageSchemaScript = document.getElementById('webpage-schema');
      if (!webPageSchemaScript) return;

      const isZhCN = lang === 'zh-CN';
      const origin = window.location.origin;

      const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": isZhCN ? "IPTV Search - 免费IPTV链接搜索引擎" : "IPTV Search - Free IPTV Link Search Engine",
        "url": isZhCN ? origin + "/?lang=zh-CN" : origin + "/",
        "description": isZhCN ? 
          "免费IPTV链接搜索引擎 - 发现和分享公共IPTV频道。提供m3u8、m3u播放列表，包含体育、新闻、电影、娱乐等频道，每日更新。" :
          "Free IPTV link search engine - discover and share public IPTV channels. Find m3u8, m3u playlists. Search free IPTV channels by country. Updated daily.",
        "dateModified": "${new Date().toISOString().split('T')[0]}",
        "inLanguage": lang,
        "author": {
          "@type": "Organization",
          "name": "IPTV Search",
          "url": origin
        },
        "about": {
          "@type": "Thing",
          "name": "Internet Protocol television",
          "sameAs": "https://www.wikidata.org/wiki/Q170418"
        },
        "mentions": [
          {
            "@type": "Thing",
            "name": "Live streaming",
            "sameAs": "https://www.wikidata.org/wiki/Q2939123"
          },
          {
            "@type": "Thing",
            "name": "Television channel",
            "sameAs": "https://www.wikidata.org/wiki/Q21286"
          }
        ]
      };

      webPageSchemaScript.textContent = JSON.stringify(schema);
    }

    // 更新页面语言内容
    function updateLanguageContent() {
      // 更新标题
      document.title = t('title');

      // 更新搜索框
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.placeholder = t('searchPlaceholder');
      }

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

      // 更新所有带有 data-i18n-placeholder 属性的元素
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
          el.placeholder = t(key);
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

      // 更新注册表单的获取验证码按钮
      const sendCodeBtn = document.getElementById('sendCodeBtn');
      if (sendCodeBtn && !registerCodeTimer) {
        // 只有在没有倒计时时才更新按钮文本
        sendCodeBtn.textContent = t('getCode');
      }

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
    let DECRYPTION_KEY = window.DECRYPTION_KEY || 'default-secret-key';

    const API_BASE = '/api';
    const AUTH_API_BASE = '/api/auth';
    let currentLanguage = 'en';  // 当前语言
    let authToken = localStorage.getItem('auth_token') || null;
    let currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
    let allChannels = [];
    let allGroups = [];
    let groupedChannels = {};  // 分组后的频道数据 { groupName: [channels] }
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

    // 收藏分页
    let favoritesPage = 1;
    let favoritesTotalPages = 1;

    // 认证状态
    let pendingVerifyEmail = null;
    let resendTimer = null;
    let resendCountdown = 60;

    // 系统配置
    let systemConfig = {
      enable_play_token: false,
      enable_url_encryption: false
    };

    // 公告数据
    let announcement = null;
    let announcementClosed = false;
    let currentSearch = '';
    let favorites = JSON.parse(localStorage.getItem('iptv_favorites') || '[]');
    let playHistory = JSON.parse(localStorage.getItem('iptv_history') || '[]');
    let featuredChannels = [];
    let isUpdatingKey = false;  // 防止重复更新密钥
    let currentPlayingChannel = null;  // 当前播放的频道
    let isLoadingChannels = false;  // 防止重复加载频道
    let pendingChannelLoad = null;  // 待处理的频道加载请求
    let lastErrorTime = 0;  // 防止重复显示相同错误
    let lastErrorMsg = '';   // 记录上一条错误消息
    let enableIpPlay = true;  // IP直连播放开关

    // 默认英文语言
    function detectBrowserLanguage() {
      const savedLanguage = localStorage.getItem('iptv_language');
      if (savedLanguage && ['zh-CN', 'en'].includes(savedLanguage)) {
        return savedLanguage;
      }
      return 'en';
    }

    // 初始化语言
    currentLanguage = detectBrowserLanguage();

    // 页面加载时获取频道列表
    window.addEventListener('DOMContentLoaded', async () => {
      // 初始化语言
      switchLanguage(currentLanguage);

      // ===== Hero 表单拦截：阻止 form submit，改为 SPA 内部搜索（UX Plan A） =====
      const heroForm = document.getElementById('heroSearchForm');
      if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const q = document.getElementById('heroSearchInput').value.trim();
          if (!q) return;
          // 聚焦 header 搜索框并执行搜索
          const searchInput = document.getElementById('searchInput');
          if (searchInput) {
            searchInput.value = q;
            searchInput.focus();
            handleSearch();
            // 如果有 categoryBrowse 显示，先切换过去
            const categoryBrowse = document.getElementById('categoryBrowse');
            const contentArea = document.getElementById('contentArea');
            if (categoryBrowse) categoryBrowse.style.display = 'none';
            if (contentArea) contentArea.style.display = 'block';
            // 隐藏 Hero
            const heroSection = document.getElementById('heroSection');
            if (heroSection) heroSection.classList.add('hidden');
            // 清除当前搜索，回到全量搜索
            currentGroup = '';
            currentSearch = q;
            currentPage = 1;
            loadChannels(1, true);
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      }

      // 获取系统配置
      try {
        await updateEncryptionKey();
      } catch (error) {
        console.error('[Init] 获取系统配置失败:', error);
      }

      // 获取管理员密钥（用于获取系统配置）
      const adminKey = localStorage.getItem('admin_key') || '';

      // 获取IP直连播放配置
      try {
        const configRes = await fetch('/api/config');
        const configData = await configRes.json();
        if (configData.success && configData.config) {
          enableIpPlay = configData.config.enable_ip_play !== false;
        }
      } catch (error) {
        console.error('[Init] 获取直连播放配置失败:', error);
      }

      // 如果IP直连播放已禁用，隐藏历史记录相关按钮
      if (!enableIpPlay) {
        const historyQuickEntry = document.getElementById('historyQuickEntry');
        if (historyQuickEntry) historyQuickEntry.style.display = 'none';
        const historyMobileAction = document.getElementById('historyMobileAction');
        if (historyMobileAction) historyMobileAction.style.display = 'none';
      }

      // 加载公告
      loadAnnouncement();

      // SEO: 静态元数据保持

      // 尝试从缓存加载分组数据，快速渲染分组列表
      const cachedGroups = getFromCache(getCacheKey('groups'));
      if (cachedGroups && cachedGroups.length > 0) {
        allGroups = cachedGroups;
        renderGroups();
        console.log('[Cache] 从缓存加载分组:', allGroups.length, '个分组');
      }

      // 尝试从缓存加载分组频道数据，更新 Hero 统计
      const cachedGrouped = getFromCache(getCacheKey('grouped_channels'));
      if (cachedGrouped) {
        groupedChannels = cachedGrouped.grouped || {};
        updateHeroStatsFromGrouped(cachedGrouped);
        console.log('[Cache] 从缓存加载分组频道统计:', cachedGrouped.total_channels, '频道', cachedGrouped.total_groups, '分组');
      }

      // 检查 URL 是否有 channel 参数，如果有则显示频道详情
      const urlChannel = new URLSearchParams(window.location.search).get('channel');

      // 检查 URL 是否有 group 参数，如果有则加载对应分组
      const urlGroup = getGroupFromUrl();
      if (urlGroup) {
        console.log('[Init] 从 URL 检测到分组:', urlGroup);
        currentGroup = urlGroup;
      }

      loadChannels().then(() => {
        // 如果分组数据还没加载（没有缓存），则用loadChannels的数据更新统计
        if (Object.keys(groupedChannels).length === 0) {
          const heroStatChannels = document.getElementById('statChannels');
          const heroStatGroups = document.getElementById('statGroups');
          const heroTotalDesc = document.getElementById('totalChannels');
          if (heroStatChannels) heroStatChannels.textContent = totalChannels;
          if (heroStatGroups) heroStatGroups.textContent = allGroups.length;
          if (heroTotalDesc) heroTotalDesc.textContent = totalChannels;
        }
        // 频道加载完成后
        const heroSection = document.getElementById('heroSection');
        if (urlGroup) {
          // 有分组参数：切换到频道列表模式 → Hero 始终显示
          const categoryBrowse = document.getElementById('categoryBrowse');
          const contentArea = document.getElementById('contentArea');
          if (categoryBrowse) categoryBrowse.style.display = 'none';
          if (contentArea) contentArea.style.display = 'block';
          renderOtherCategories(urlGroup);
          if (heroSection) heroSection.classList.remove('hidden');
        } else if (urlChannel) {
          // 有 channel 参数：显示频道详情 → Hero 始终显示
          const channel = allChannels.find(ch => ch.channel_hash === urlChannel);
          if (channel) {
            console.log('[Init] 从 URL 检测到频道:', channel.channel_name);
            showChannelDetail(channel.channel_hash, channel.channel_name, channel.group_title || '');
          }
          if (heroSection) heroSection.classList.remove('hidden');
        } else {
          // 无参数：显示分类浏览模式（首页） → 显示 Hero
          showCategoryBrowse();
          renderCategories();
          if (heroSection) heroSection.classList.remove('hidden');
        }
      });

      updateOnlineCounter();
      updateBadges();
      setInterval(updateOnlineCounter, 30000); // 每30秒更新在线人数
    });

    // ========== SEO 优化函数 ==========

    // 动态更新页面SEO元信息 已移除
    function updateSEOMeta() {
      const isZhCN = currentLanguage === 'zh-CN';

      // 更新页面标题
      let title, description;

      if (currentGroup) {
        if (isZhCN) {
          title = currentGroup + ' - IPTV Search 免费IPTV频道';
          description = '浏览' + currentGroup + '分类的IPTV频道，IPTV Search提供' + currentGroup + '相关的公共频道链接，每日更新。';
        } else {
          title = currentGroup + ' - IPTV Search IPTV Channels';
          description = 'Browse ' + currentGroup + ' category IPTV channels on IPTV Search. Find public channel links updated daily.';
        }
      } else if (currentSearch) {
        if (isZhCN) {
          title = currentSearch + ' - IPTV Search 搜索结果';
          description = '搜索"' + currentSearch + '"的频道，找到' + totalChannels + '个相关频道，免费IPTV链接搜索引擎，每日更新。';
        } else {
          title = currentSearch + ' - IPTV Search Search Results';
          description = 'Search for "' + currentSearch + '" channels, found ' + totalChannels + ' related channels on IPTV Search free IPTV link search engine.';
        }
      } else if (currentGroup === 'history') {
        if (isZhCN) {
          title = '播放历史 - IPTV Search';
          description = '查看您的播放历史记录，IPTV Search自动保存最近播放的频道，方便快速访问。';
        } else {
          title = 'Watch History - IPTV Search';
          description = 'View your watch history. IPTV Search automatically saves your recently played channels for quick access.';
        }
      } else if (currentGroup === 'favorites') {
        if (isZhCN) {
          title = '我的收藏 - IPTV Search';
          description = '管理您收藏的频道，IPTV Search收藏功能让您快速访问喜爱的内容。';
        } else {
          title = 'My Favorites - IPTV Search';
          description = 'Manage your favorite channels. IPTV Search favorites feature allows you to quickly access your favorite content.';
        }
      } else if (currentGroup === 'random') {
        if (isZhCN) {
          title = '随机推荐 - IPTV Search';
          description = '随机发现精彩频道，IPTV Search智能推荐让您探索更多优质IPTV内容。';
        } else {
          title = 'Random Picks - IPTV Search';
          description = 'Discover amazing channels randomly. IPTV Search smart recommendations help you explore more quality IPTV content.';
        }
      } else {
        // 默认页面
        if (isZhCN) {
          title = 'IPTV Search - 免费IPTV链接搜索引擎';
          description = '免费IPTV链接搜索引擎 - 发现和分享公共IPTV频道。提供m3u8、m3u播放列表，包含体育、新闻、电影、娱乐等频道，每日更新。';
        } else {
          title = 'IPTV Search - Free IPTV Link Search Engine';
          description = 'Free IPTV link search engine - discover and share public IPTV channels. Find m3u8, m3u playlists. Search free IPTV channels by country. Updated daily.';
        }
      }

      // 更新document title
      document.title = title;

      // 更新meta description
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('name', 'twitter:title', title);
      updateMetaTag('name', 'twitter:description', description);

      // 更新 og:locale
      updateMetaTag('property', 'og:locale', isZhCN ? 'zh_CN' : 'en_US');
    }

    // 更新或创建meta和link标签
    function updateMetaTag(attribute, name, content, valueAttr = 'content') {
      // 特殊处理 link 标签（例如 canonical）
      if (attribute === 'link') {
        let link = document.querySelector(\`link[rel="\${name}"]\`);
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', name);
          document.head.appendChild(link);
        }
        if (valueAttr && content) {
          link.setAttribute(valueAttr, content);
        }
        return;
      }

      // 处理 meta 标签
      let meta = document.querySelector(\`meta[\${attribute}="\${name}"]\`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute(valueAttr, content);
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
          title = '❌ ' + t('toastError');
          break;
        case 'warning':
          title = '⚠️ ' + t('toastWarning');
          break;
        case 'success':
          title = '✅ ' + t('toastSuccess');
          break;
        case 'info':
        default:
          title = 'ℹ️ ' + t('toastInfo');
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

    // 播放错误通知 - 单条显示，10秒自动消失
    let currentPlayErrorToast = null;
    let playErrorToastTimeout = null;

    function showPlayErrorToast(errorType) {
      // 清除之前的定时器
      if (playErrorToastTimeout) {
        clearTimeout(playErrorToastTimeout);
        playErrorToastTimeout = null;
      }

      // 如果已有 toast 正在展示，直接移除（不执行滑出动画）
      if (currentPlayErrorToast && currentPlayErrorToast.parentNode) {
        currentPlayErrorToast.parentNode.removeChild(currentPlayErrorToast);
      }

      const container = document.getElementById('toastContainer');
      if (!container) return;

      // 根据错误类型获取提示信息
      let message;
      switch (errorType) {
        case 'hls_not_loaded':
          message = t('toastBrowserLimit');
          break;
        case 'token_failed':
        case 'key_sync':
        case 'security_check':
          message = t('toastRefresh');
          break;
        case 'channel_lost':
          message = t('toastChannelLost');
          break;
        case 'network':
        case 'decrypt_error':
        case 'media_error':
        case 'cors':
        case 'http_link':
          message = t('toastBrowserLimit');
          break;
        default:
          message = t('toastRefresh');
      }

      const toast = document.createElement('div');
      toast.className = 'toast error';
      toast.innerHTML = \`
        <div style="position:relative;padding-right:30px">
          <div class="toast-title">\${currentLanguage === 'zh-CN' ? '⚠️ 播放失败' : '⚠️ Playback Failed'}</div>
          <div class="toast-message">\${message}</div>
          <button class="toast-close">&times;</button>
        </div>
      \`;

      container.appendChild(toast);

      // 保存当前 toast
      currentPlayErrorToast = toast;

      // 点击关闭按钮
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.onclick = () => {
        removeToast(toast);
        currentPlayErrorToast = null;
      };

      // 10秒后自动移除
      playErrorToastTimeout = setTimeout(() => {
        removeToast(toast);
        currentPlayErrorToast = null;
        playErrorToastTimeout = null;
      }, 10000);
    }

    // 页面加载时获取频道列表
    window.addEventListener('DOMContentLoaded', () => {
      // 尝试从缓存加载分组数据，快速渲染分组列表
      const cachedGroups = getCachedGroups();
      if (cachedGroups && cachedGroups.length > 0) {
        allGroups = cachedGroups;
        renderGroups();
        console.log('[Cache] 从缓存加载分组:', allGroups.length, '个分组');
      }

      loadChannels();
      // Hero 统计数据在 loadChannels().then() 中更新
      updateOnlineCounter();
      updateBadges();
      setInterval(updateOnlineCounter, 30000); // 每30秒更新在线人数
    });

    // ========== 本地缓存工具函数 ==========

    // 缓存键前缀
    const CACHE_PREFIX = 'iptv_cache_';
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时（毫秒）
    const GROUPS_CACHE_KEY = 'iptv_groups'; // 分组数据独立缓存键
    const GROUPS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 分组数据缓存24小时

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
    function setCache(key, value, customDuration = null) {
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

    // 获取分组缓存（独立长期缓存）
    function getCachedGroups() {
      try {
        const cached = localStorage.getItem(GROUPS_CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          if (now - timestamp < GROUPS_CACHE_DURATION) {
            console.log('[Cache] 从分组缓存读取，剩余有效时间:', Math.round((GROUPS_CACHE_DURATION - (now - timestamp)) / (24 * 60 * 60 * 1000)), '天');
            return data;
          } else {
            localStorage.removeItem(GROUPS_CACHE_KEY);
            console.log('[Cache] 分组缓存已过期');
          }
        }
        return null;
      } catch (error) {
        console.error('[Cache] 读取分组缓存失败:', error);
        return null;
      }
    }

    // 缓存分组数据（独立长期缓存）
    function cacheGroups(groups) {
      try {
        const data = {
          timestamp: Date.now(),
          data: groups
        };
        localStorage.setItem(GROUPS_CACHE_KEY, JSON.stringify(data));
        console.log('[Cache] 已缓存分组数据，共', groups.length, '个分组');
      } catch (error) {
        console.error('[Cache] 写入分组缓存失败:', error);
      }
    }

    // 清除缓存
    function clearCache() {
      try {
        // 清除所有 iptv 相关的缓存
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(CACHE_PREFIX) || 
              key === GROUPS_CACHE_KEY || 
              key.startsWith('iptv_')) {
            localStorage.removeItem(key);
          }
        });
        console.log('[Cache] 已清除所有缓存');
        
        // 清除当前页面的所有频道和分组数据
        allChannels = [];
        allGroups = [];
        currentPage = 1;
        totalPages = 1;
        totalChannels = 0;
        currentSearch = '';
        currentGroup = '';
        
        // 清空搜索框
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.value = '';
        }
        
      } catch (error) {
        console.error('[Cache] 清除缓存失败:', error);
      }
    }
    
    async function loadChannels(page = 1, updateGroups = true, forceRefresh = false) {
      // 请求节流：如果正在加载，保存待加载请求
      if (isLoadingChannels) {
        console.log('[LoadChannels] 正在加载，保存待加载请求:', { page, updateGroups });
        pendingChannelLoad = { page, updateGroups };
        return;
      }

      isLoadingChannels = true;
      console.log('[LoadChannels] 开始加载:', { page, updateGroups, currentSearch, currentGroup });

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

        // 优先从分组缓存读取分组数据（强制刷新时跳过）
        if (updateGroups && !forceRefresh) {
          const cachedGroups = getCachedGroups();
          if (cachedGroups) {
            allGroups = cachedGroups;
            renderGroups();
            updateGroups = false; // 已有分组缓存，不需要从API获取
            console.log('[LoadChannels] 使用分组缓存');
          }
        }

        // 尝试从缓存读取（强制刷新时跳过）
        const cachedData = forceRefresh ? null : getFromCache(cacheKey);
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

        // 缓存未命中或强制刷新，从服务器获取
        const response = await fetch(API_BASE + '/channels?' + paramsStr, {
          cache: 'no-store'  // 强制不使用浏览器缓存
        });
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

          // 缓存数据（24小时）
          setCache(cacheKey, data);

          // 单独缓存分组数据（用于快速访问，缓存7天）
          if (updateGroups && data.groups) {
            cacheGroups(data.groups);
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
      } finally {
        isLoadingChannels = false;
        // 如果有待加载的请求，执行它
        if (pendingChannelLoad) {
          const { page, updateGroups } = pendingChannelLoad;
          pendingChannelLoad = null;
          console.log('[LoadChannels] 执行待加载请求:', { page, updateGroups });
          loadChannels(page, updateGroups);
        }
      }
    }
    
    function renderGroups() {
      // 处理 groups 可能是对象数组 [{name: 'xxx'}] 或字符串数组 ['xxx']
      const groupNames = allGroups.map(g => typeof g === 'string' ? g : g.name);

      // 渲染横向筛选标签栏 (Plan B)
      const filterContainer = document.getElementById('filterTagsContainer');
      if (filterContainer) {
        filterContainer.innerHTML = groupNames.map(group =>
          \`<a class="filter-tag" data-group="\${escapeHtml(group)}" href="/?group=\${encodeURIComponent(group)}">
            \${escapeHtml(group)}
          </a>\`
        ).join('');
      }

      // 渲染旧侧边栏分组列表（保留以防需要）
      const container = document.getElementById('groupList');
      if (container) {
        container.innerHTML = groupNames.map(group =>
          \`<a class="group-item ripple" data-group="\${escapeHtml(group)}" href="/?group=\${encodeURIComponent(group)}">
            \${escapeHtml(group)}
          </a>\`
        ).join('');
      }

      // 渲染移动端分组列表
      const mobileContainer = document.getElementById('mobileGroupList');
      const allChannelsText3 = typeof t !== 'undefined' ? t('allChannels') : 'All Channels';
      if (mobileContainer) {
        mobileContainer.innerHTML = \`<a class="mobile-group-item active" data-group="" href="/?group=">\${allChannelsText3}</a>\` +
          groupNames.map(group =>
            \`<a class="mobile-group-item" data-group="\${escapeHtml(group)}" href="/?group=\${encodeURIComponent(group)}">
              \${escapeHtml(group)}
            </a>\`
          ).join('');
      }

      // 更新选中状态（包括硬编码的"全部频道"选项）
      document.querySelectorAll('.group-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === currentGroup) {
          item.classList.add('active');
        }
      });

      // 更新横向筛选标签选中状态 (Plan B)
      document.querySelectorAll('.filter-tag').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === currentGroup) {
          item.classList.add('active');
        }
      });

      // 更新"全部"标签
      const allChannelsFilter = document.getElementById('filterAllChannels');
      if (allChannelsFilter) {
        allChannelsFilter.classList.toggle('active', currentGroup === '');
      }

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

    // ========== 分类浏览模式 ==========
    
    // 加载分组频道数据
    async function loadGroupedChannels() {
      try {
        const cacheKey = getCacheKey('grouped_channels');
        const cached = getFromCache(cacheKey);
        if (cached) {
          groupedChannels = cached.grouped || {};
          // 更新 Hero 统计数据
          updateHeroStatsFromGrouped(cached);
          return cached;
        }

        const response = await fetch(API_BASE + '/channels?action=grouped');
        const data = await response.json();
        
        if (data.success) {
          groupedChannels = data.grouped || {};
          // 缓存一天
          setCache(cacheKey, data, 24 * 60 * 60 * 1000);
          // 更新 Hero 统计数据
          updateHeroStatsFromGrouped(data);
          return data;
        }
        return null;
      } catch (error) {
        console.error('[loadGroupedChannels] 加载失败:', error);
        return null;
      }
    }

    // 从分组数据更新 Hero 统计
    function updateHeroStatsFromGrouped(data) {
      const totalChannels = data.total_channels || 0;
      const totalGroups = data.total_groups || 0;
      
      const heroStatChannels = document.getElementById('statChannels');
      const heroStatGroups = document.getElementById('statGroups');
      const heroTotalDesc = document.getElementById('totalChannels');
      
      if (heroStatChannels) heroStatChannels.textContent = totalChannels;
      if (heroStatGroups) heroStatGroups.textContent = totalGroups;
      if (heroTotalDesc) heroTotalDesc.textContent = totalChannels;
    }

    // 渲染分类浏览页面（类似 epg.pw 的分组展示）
    async function renderCategories() {
      const container = document.getElementById('categoryGrid');
      if (!container) return;

      // 如果还没有加载分组数据，先加载
      if (Object.keys(groupedChannels).length === 0) {
        await loadGroupedChannels();
      }

      const groups = Object.keys(groupedChannels)
        .filter(name => (groupedChannels[name]?.length || 0) >= 8)  // 只显示8个频道以上的分类
        .sort((a, b) => {
          const countA = groupedChannels[a]?.length || 0;
          const countB = groupedChannels[b]?.length || 0;
          return countB - countA;  // 按频道数量降序
        });

      if (groups.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No categories found</p></div>';
        return;
      }

      // 更新统计数据
      const totalChannelsEl = document.getElementById('totalChannelsStat');
      const totalCategoriesEl = document.getElementById('totalCategoriesStat');
      const totalChannels = Object.values(groupedChannels).reduce((sum, chs) => sum + chs.length, 0);
      if (totalChannelsEl) totalChannelsEl.textContent = totalChannels;
      if (totalCategoriesEl) totalCategoriesEl.textContent = groups.length;

      // 渲染每个分类区块
      container.innerHTML = groups.map(groupName => {
        const channels = groupedChannels[groupName] || [];
        
        // 每个分类显示前6个频道预览
        const previewChannels = channels.slice(0, 6);
        const channelsHtml = previewChannels.map(ch => \`
          <div class="category-channel-item" onclick="handleCategoryChannelClick(event, '\${jsEncode(ch.channel_hash)}', '\${jsEncode(ch.channel_name)}', '\${jsEncode(ch.group_title || '')}', '\${jsEncode(groupName)}')">
            \${ch.logo ? \`<img class="cat-ch-logo" src="\${escapeHtml(ch.logo)}" alt="\${escapeHtml(ch.channel_name)}" onerror="this.style.display='none'">\` : ''}
            <span class="cat-ch-name">\${escapeHtml(ch.channel_name)}</span>
          </div>
        \`).join('');

        return \`
          <div class="category-section">
            <div class="category-header" onclick="filterByGroup('\${jsEncode(groupName)}')">
              <span class="cat-name">\${escapeHtml(groupName)}</span>
              <span class="cat-count">\${channels.length} channels</span>
              <span class="cat-arrow">▶</span>
            </div>
            <div class="category-channels-preview">
              \${channelsHtml}
            </div>
          </div>
        \`;
      }).join('');
    }

    // 获取分类图标
    function getCategoryIcon(groupName) {
      const iconMap = {
        '央视': '📺', 'CCTV': '📺',
        '卫视': '🛰️',
        '体育': '⚽', 'Sports': '⚽',
        '电影': '🎬', 'Movies': '🎬',
        '电视剧': '📺', 'Series': '📺',
        '综艺': '🎭', 'Entertainment': '🎭',
        '动漫': '🐱', 'Animation': '🐱', 'Kids': '🐱',
        '音乐': '🎵', 'Music': '🎵',
        '新闻': '📰', 'News': '📰',
        '教育': '📚', 'Education': '📚',
        '纪录': '🎥', 'Documentary': '🎥',
        '财经': '💰', 'Finance': '💰',
        '国际': '🌍', 'International': '🌍',
        '游戏': '🎮', 'Gaming': '🎮',
      };
      return iconMap[groupName] || '📺';
    }

    // 显示分类浏览模式（首页）
    async function showCategoryBrowse() {
      const categoryBrowse = document.getElementById('categoryBrowse');
      const contentArea = document.getElementById('contentArea');
      const detailView = document.getElementById('channelDetailView');

      if (categoryBrowse) categoryBrowse.style.display = 'block';
      if (contentArea) contentArea.style.display = 'none';
      if (detailView) detailView.style.display = 'none';

      // 重置 currentGroup
      currentGroup = '';
      currentSearch = '';
      currentPage = 1;

      // 返回首页时恢复 Hero 显示
      const heroSection = document.getElementById('heroSection');
      if (heroSection) heroSection.classList.remove('hidden');

      // 清空搜索框
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = '';

      // 加载并渲染分类列表
      await renderCategories();

      // 滚动到顶部（Hero区域）
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 更新分组选中状态
      document.querySelectorAll('.group-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === '') {
          item.classList.add('active');
        }
      });

      // 更新横向筛选标签
      document.querySelectorAll('.filter-tag').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === '') {
          item.classList.add('active');
        }
      });

      // 更新"全部"标签
      const allChannelsFilter = document.getElementById('filterAllChannels');
      if (allChannelsFilter) {
        allChannelsFilter.classList.add('active');
      }

      // 更新 URL（只在有变化时才更新，避免重复历史记录）
      const newUrl = new URL(window.location.href);
      const hadGroup = newUrl.searchParams.has('group');
      const hadChannel = newUrl.searchParams.has('channel');
      newUrl.searchParams.delete('group');
      newUrl.searchParams.delete('channel');

      if (hadGroup || hadChannel) {
        history.pushState({ group: '' }, '', newUrl.toString());
      }
    }

    // 渲染"其他分类"横向滚动
    function renderOtherCategories(currentGroup) {
      const container = document.getElementById('otherCategoriesScroll');
      if (!container) return;

      const groupNames = allGroups.map(g => typeof g === 'string' ? g : g.name);
      const otherGroups = groupNames.filter(g => g !== currentGroup);

      container.innerHTML = otherGroups.map(group =>
        \`<button class="other-cat-btn" onclick="filterByGroup('\${jsEncode(group)}')">\${escapeHtml(group)}</button>\`
      ).join('');
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
      
      // 生成频道列表HTML
      const channelListHtml = channels.map(channel => {
        const logo = channel.logo
          ? \`<img src="\${escapeHtml(channel.logo)}" alt="\${escapeHtml(channel.channel_name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="channel-icon" style="display:none;">📺</div>\`
          : '<div class="channel-icon">📺</div>';

        const isFavorited = favorites.some(f => f.hash === channel.channel_hash);

        return \`
          <div class="channel-item" onclick="handleChannelClick(event, '\${jsEncode(channel.channel_hash)}', '\${jsEncode(channel.channel_name)}', '\${jsEncode(channel.group_title || '')}')">
            <div class="ch-icon">\${logo}</div>
            <div class="ch-info">
              <div class="ch-name">\${escapeHtml(channel.channel_name)}</div>
            </div>
            <div class="ch-group">\${escapeHtml(channel.group_title || '')}</div>
            <button class="ch-fav-btn \${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation();toggleFavorite('\${jsEncode(channel.channel_hash)}', '\${jsEncode(channel.channel_name)}', '\${jsEncode(channel.group_title || '')}', this)" title="\${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
              \${isFavorited ? '★' : '☆'}
            </button>
            <button class="ch-copy-btn" onclick="event.stopPropagation();copyPlayLink('\${jsEncode(channel.channel_hash)}')" title="Copy link">
              🔗
            </button>
          </div>
        \`;
      });

      container.innerHTML = channelListHtml.join('');

      // 添加波纹效果
      container.querySelectorAll('.channel-item').forEach(item => {
        item.addEventListener('click', function(e) {
          createRipple(item);
        });
      });
    }

    // ========== URL 处理与 History API 支持 ==========

    // 从 URL 参数中获取分组名称
    function getGroupFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get('group') || '';
    }

    // 处理分组链接点击（使用事件委托）
    document.addEventListener('click', function(event) {
      const target = event.target.closest('.group-item, .mobile-group-item, .filter-tag');
      if (target) {
        event.preventDefault(); // 阻止默认的链接跳转
        const group = target.dataset.group || '';
        filterByGroup(group);
      }
    });

    // 处理浏览器前进/后退按钮
    window.addEventListener('popstate', function(event) {
      const params = new URLSearchParams(window.location.search);
      const channelHash = params.get('channel');

      if (channelHash) {
        // 如果 URL 中有 channel 参数，显示频道详情
        const channel = allChannels.find(ch => ch.channel_hash === channelHash);
        if (channel) {
          showChannelDetail(channel.channel_hash, channel.channel_name, channel.group_title || '');
        } else {
          // 频道未找到，返回列表
          showChannelList();
        }
      } else if (event.state && event.state.channel !== undefined) {
        // 浏览器返回，但没有 channel 参数，显示列表
        showChannelList();
      } else if (event.state && event.state.group !== undefined) {
        // 恢复分组筛选
        const group = event.state.group;
        currentGroup = group;
        currentPage = 1;
        currentSearch = '';

        // 清空搜索框
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';

        // 更新分组选中状态
        document.querySelectorAll('.group-item').forEach(item => {
          item.classList.remove('active');
          if (item.dataset.group === currentGroup) {
            item.classList.add('active');
          }
        });

        // 更新横向筛选标签选中状态 (Plan B)
        document.querySelectorAll('.filter-tag').forEach(item => {
          item.classList.remove('active');
          if (item.dataset.group === currentGroup) {
            item.classList.add('active');
          }
        });

        // 更新"全部"标签
        const allChannelsFilter = document.getElementById('filterAllChannels');
        if (allChannelsFilter) {
          allChannelsFilter.classList.toggle('active', currentGroup === '');
        }

        // 显示列表视图
        showChannelList();

        // 加载对应分组的频道
        loadChannels(1, true);

        console.log('[History] 恢复分组:', group || '全部');
      }
    });

    function filterByGroup(group) {
      // 切换到频道列表模式 → Hero 始终显示
      const categoryBrowse = document.getElementById('categoryBrowse');
      const contentArea = document.getElementById('contentArea');
      if (categoryBrowse) categoryBrowse.style.display = 'none';
      if (contentArea) contentArea.style.display = 'block';
      const heroSection = document.getElementById('heroSection');
      // Hero 始终显示（方便用户查询）
      if (heroSection) {
        heroSection.classList.remove('hidden');
      }

      // 移动端：关闭菜单

      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('open');
      }

      // 添加点击波纹效果（排除"全部频道"按钮）
      const escapedGroup = escapeHtml(group);
      const clickedItem = document.querySelector(\`.group-item[data-group="\${escapedGroup}"]\`);
      if (clickedItem && group !== '') {
        // 只对非"全部频道"按钮添加波纹效果
        createRipple(clickedItem);
      }

      // 显示加载提示
      showLoadingIndicator(t('loadingCache'));

      currentGroup = group;
      currentPage = 1; // 重置到第一页

      // 更新 URL（使用 pushState 保存历史记录，但不刷新页面）
      // 特殊分组（history/favorites/random）不更新 URL
      if (group !== 'history' && group !== 'favorites' && group !== 'random') {
        const newUrl = new URL(window.location.href);
        if (group) {
          newUrl.searchParams.set('group', group);
        } else {
          newUrl.searchParams.delete('group');
        }
        history.pushState({ group: group }, '', newUrl.toString());
      }

      // 清空搜索框和搜索状态
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = '';
      }
      currentSearch = '';

      // 更新标题（现在由面包屑显示）

      // 渲染"其他分类"横向滚动（排除当前分类）
      renderOtherCategories(group);

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

      // 重新加载频道（强制更新分组列表）
      loadChannels(1, true);
    }

    // 处理频道点击 - 打开详情视图
    function handleChannelClick(event, hash, name, group) {
      // 添加点击高亮效果
      const card = event.currentTarget;
      card.classList.add('click-highlight');
      setTimeout(() => {
        card.classList.remove('click-highlight');
      }, 300);

      // 打开频道详情视图
      showChannelDetail(hash, name, group);
    }

    // 处理首页分类频道点击 - 先导航到分类页，再显示详情
    function handleCategoryChannelClick(event, hash, name, group, groupName) {
      // 添加点击高亮效果
      const card = event.currentTarget;
      card.classList.add('click-highlight');
      setTimeout(() => {
        card.classList.remove('click-highlight');
      }, 300);

      // 先导航到分类页（这会设置 ?group=xxx）
      filterByGroup(groupName);
      
      // 延迟后显示频道详情（等 filterByGroup 更新 URL 完成）
      setTimeout(() => {
        showChannelDetail(hash, name, groupName);
      }, 50);
    }

    // 打开频道详情视图 - 紧凑信息流布局
    function showChannelDetail(hash, name, group) {
      const detailView = document.getElementById('channelDetailView');
      const detailContainer = document.getElementById('channelDetailContainer');
      const channelList = document.getElementById('channelList');

      // 查找频道完整信息（优先从allChannels查找，否则从groupedChannels查找）
      let channel = allChannels.find(ch => ch.channel_hash === hash);
      if (!channel && groupedChannels) {
        // 从groupedChannels中查找
        for (const groupName in groupedChannels) {
          const found = groupedChannels[groupName].find(ch => ch.channel_hash === hash);
          if (found) {
            channel = found;
            break;
          }
        }
      }
      const isFavorited = favorites.some(f => f.hash === hash);

      // 获取相关频道（同分组）
      let sameGroupChannels = [];
      if (channel && group) {
        // 优先从allChannels获取
        if (allChannels.length > 0) {
          sameGroupChannels = allChannels.filter(ch => ch.group_title === group && ch.channel_hash !== hash);
        } else if (groupedChannels && groupedChannels[group]) {
          // 否则从groupedChannels获取
          sameGroupChannels = groupedChannels[group].filter(ch => ch.channel_hash !== hash);
        }
      }
      const relatedChannels = sameGroupChannels.slice(0, 8);
      const totalSameGroup = sameGroupChannels.length;

      // 构建 Logo HTML
      const logoHtml = channel && channel.logo
        ? '<img src="' + escapeHtml(channel.logo) + '" alt="' + escapeHtml(name) + '" onerror="this.style.display=&quot;none&quot;;this.nextElementSibling.style.display=&quot;flex&quot;;this.nextElementSibling.style.background=&quot;#1a1a1a&quot;"><div class="cd-detail-logo-placeholder" style="display:none;width:80px;height:80px;background:#1a1a1a;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;">📺</div>'
        : '<div class="cd-detail-logo-placeholder">📺</div>';

      // 构建详情内容 - 紧凑信息流
      detailContainer.innerHTML = 
        // ===== 顶部操作栏 =====
        '<div class="cd-detail-header">' +
          '<button class="cd-back-btn" onclick="showChannelList()">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
            '<span>Back</span>' +
          '</button>' +
          '<div class="cd-header-actions">' +
            '<button class="cd-action-btn' + (isFavorited ? ' active' : '') + '" id="detailFavBtn" title="' + (isFavorited ? 'Remove from favorites' : 'Add to favorites') + '">' +
              (isFavorited ? '★' : '☆') +
            '</button>' +
            '<button class="cd-action-btn" onclick="copyPlayLink(&quot;' + jsEncode(hash) + '&quot;)" title="Copy link">' +
              '🔗' +
            '</button>' +
            '<button class="cd-play-btn" onclick="playChannel(&quot;' + jsEncode(hash) + '&quot;,&quot;' + jsEncode(name) + '&quot;,&quot;' + jsEncode(group || '') + '&quot;)">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' +
              '<span>Play</span>' +
            '</button>' +
          '</div>' +
        '</div>' +

        // ===== 频道主信息 =====
        '<div class="cd-detail-main">' +
          '<div class="cd-detail-logo">' + logoHtml + '</div>' +
          '<div class="cd-detail-info">' +
            '<h1 class="cd-detail-title">' + escapeHtml(name) + '</h1>' +
            '<div class="cd-detail-meta">' +
              (group ? '<span class="cd-detail-tag">' + escapeHtml(group) + '</span>' : '') +
              '<span class="cd-detail-status"><span class="cd-status-dot"></span> Active</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // ===== 信息网格 =====
        '<div class="cd-detail-grid">' +

          // 频道信息
          '<div class="cd-detail-section">' +
            '<h3 class="cd-section-title">Channel Info</h3>' +
            '<div class="cd-info-list">' +
              '<div class="cd-info-item">' +
                '<span class="cd-info-label">Channel</span>' +
                '<span class="cd-info-value">' + escapeHtml(name) + '</span>' +
              '</div>' +
              '<div class="cd-info-item">' +
                '<span class="cd-info-label">Category</span>' +
                '<span class="cd-info-value cd-info-link" onclick="filterByGroup(&quot;' + jsEncode(group) + '&quot;)">' + escapeHtml(group || 'Uncategorized') + '</span>' +
              '</div>' +
              '<div class="cd-info-item">' +
                '<span class="cd-info-label">Channel ID</span>' +
                '<span class="cd-info-value cd-info-id">' + escapeHtml(hash) + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // 播放信息
          '<div class="cd-detail-section">' +
            '<h3 class="cd-section-title">Playback</h3>' +
            '<div class="cd-info-list">' +
              '<div class="cd-info-item">' +
                '<span class="cd-info-label">Quality</span>' +
                '<span class="cd-info-value">HD / SD</span>' +
              '</div>' +
              '<div class="cd-info-item">' +
                '<span class="cd-info-label">Format</span>' +
                '<span class="cd-info-value">M3U8</span>' +
              '</div>' +
              '<div class="cd-info-item">' +
                '<span class="cd-info-label">Protocol</span>' +
                '<span class="cd-info-value">HTTP/HTTPS</span>' +
              '</div>' +
            '</div>' +
          '</div>' +

        '</div>' +

        // ===== 查看更多 =====
        (group ? 
        '<div class="cd-detail-more">' +
          '<a href="/" class="cd-more-link" onclick="event.preventDefault();filterByGroup(&quot;' + jsEncode(group) + '&quot;);return false">' +
            'View all ' + totalSameGroup + ' channels in ' + escapeHtml(group) + ' →' +
          '</a>' +
        '</div>' : '') +

        // ===== 相关频道 =====
        (relatedChannels.length > 0 ? 
        '<div class="cd-related-section">' +
          '<h3 class="cd-section-title">Related Channels</h3>' +
          '<div class="cd-related-scroll" id="relatedChannelsGrid">' +
            relatedChannels.map(ch => {
              const chLogo = ch.logo
                ? '<img src="' + escapeHtml(ch.logo) + '" alt="' + escapeHtml(ch.channel_name) + '" onerror="this.style.display=&quot;none&quot;;this.nextElementSibling.style.display=&quot;flex&quot;"><div class="cd-related-logo-placeholder" style="display:none;">📺</div>'
                : '<div class="cd-related-logo-placeholder">📺</div>';
              return '<div class="cd-related-card" data-channel-hash="' + escapeHtml(ch.channel_hash) + '" data-channel-name="' + escapeHtml(ch.channel_name) + '" data-channel-group="' + escapeHtml(ch.group_title || '') + '">' +
                '<div class="cd-related-poster">' + chLogo + '</div>' +
                '<span class="cd-related-name">' + escapeHtml(ch.channel_name) + '</span>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' : '');

      // 绑定收藏按钮
      const favBtnEl = document.getElementById('detailFavBtn');
      if (favBtnEl) {
        favBtnEl.onclick = function() {
          toggleFavoriteFromDetail(hash, name, group || '');
          const newFav = favorites.some(f => f.hash === hash);
          this.classList.toggle('active', newFav);
          this.textContent = newFav ? '★' : '☆';
          this.title = newFav ? 'Remove from favorites' : 'Add to favorites';
        };
      }

      // 绑定相关频道点击
      const relatedGrid = document.getElementById('relatedChannelsGrid');
      if (relatedGrid) {
        relatedGrid.querySelectorAll('.cd-related-card').forEach(function(card) {
          card.onclick = function() {
            const h = this.getAttribute('data-channel-hash');
            const n = this.getAttribute('data-channel-name');
            const g = this.getAttribute('data-channel-group');
            showChannelDetail(h, n, g);
          };
        });
      }

      // 切换视图
      channelList.style.display = 'none';
      detailView.style.display = 'block';

      // 更新 URL（确保 group 在前面，channel 在后面）
      const newUrl = new URL(window.location.href);
      if (group) {
        newUrl.searchParams.set('group', group);
      } else {
        newUrl.searchParams.delete('group');
      }
      newUrl.searchParams.set('channel', hash);
      history.pushState({ channel: hash, group: group }, '', newUrl.toString());

      // 滚动到顶部
      window.scrollTo(0, 0);
    }

    // 从详情页收藏/取消收藏
    function toggleFavoriteFromDetail(hash, name, group) {
      toggleFavorite(hash, name, group);
      // 更新按钮状态
      const btn = document.querySelector('.channel-detail-btn-favorite');
      if (btn) {
        const isFavorited = favorites.some(f => f.hash === hash);
        btn.classList.toggle('active', isFavorited);
        btn.innerHTML = (isFavorited ? '&#9733;' : '&#9734;') + ' ' + (isFavorited ? 'Favorited' : 'Favorite');
      }
    }

    // 返回频道列表视图
    function showChannelList() {
      const detailView = document.getElementById('channelDetailView');
      const channelList = document.getElementById('channelList');

      // 切换视图
      detailView.style.display = 'none';
      channelList.style.display = 'block';

      // 更新 URL（移除 channel 参数）
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('channel');
      history.pushState({}, '', newUrl.toString());
    }

    // 处理订阅计划按钮点击
    async function handlePlansClick() {
      try {
        const response = await fetch('/api/mall/settings');
        const data = await response.json();
        if (data.success && data.settings.mall_enabled === '1') {
          // 商城开启，跳转到会员订阅页面
          window.location.href = '/plans';
        } else {
          // 商城关闭，跳转到免费订阅页面
          window.location.href = '/freesub';
        }
      } catch (error) {
        console.error('Failed to check mall settings:', error);
        // 如果请求失败，默认跳转到免费订阅页面
        window.location.href = '/freesub';
      }
    }

    // 处理快捷按钮点击
    function handleQuickEntryClick(event, type) {
      const button = event.currentTarget;
      createRipple(button);

      switch (type) {
        case 'history':
          if (!enableIpPlay) return;
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
          // 重新加载频道列表（强制刷新，跳过缓存）
          loadChannels(1, true, true);
          // 显示提示
          showToast(t('cacheCleared'), 'success');
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

      let html = \`<span class="pagination-info">\${t('totalItems')} \${totalChannels}, \${t('page')} \${currentPage}/\${totalPages}</span>\`;
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

    // 收藏分页函数
    function goToFavoritesPage(page) {
      if (page >= 1 && page <= favoritesTotalPages) {
        favoritesPage = page;
        renderFavoritesList();
        window.scrollTo(0, 0);
      }
    }

    function renderFavoritesPagination() {
      const container = document.getElementById('pagination');
      if (favoritesTotalPages <= 1) {
        container.innerHTML = '';
        return;
      }

      const totalFavorites = favorites.length;
      const start = (favoritesPage - 1) * pageSize + 1;
      const end = Math.min(favoritesPage * pageSize, totalFavorites);

      let html = \`<span class="pagination-info">\${t('totalItems')} \${totalFavorites}, \${t('page')} \${favoritesPage}/\${favoritesTotalPages}</span>\`;
      html += \`<button onclick="goToFavoritesPage(1)" \${favoritesPage === 1 ? 'disabled' : ''}>\${t('firstPage')}</button>\`;
      html += \`<button onclick="goToFavoritesPage(\${favoritesPage - 1})" \${favoritesPage === 1 ? 'disabled' : ''}>\${t('prevPage')}</button>\`;

      const maxButtons = 7;
      let startPage = Math.max(1, favoritesPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(favoritesTotalPages, startPage + maxButtons - 1);

      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToFavoritesPage(\${i})" class="\${i === favoritesPage ? 'active' : ''}">\${i}</button>\`;
      }

      html += \`<button onclick="goToFavoritesPage(\${favoritesPage + 1})" \${favoritesPage === favoritesTotalPages ? 'disabled' : ''}>\${t('nextPage')}</button>\`;
      html += \`<button onclick="goToFavoritesPage(\${favoritesTotalPages})" \${favoritesPage === favoritesTotalPages ? 'disabled' : ''}>\${t('lastPage')}</button>\`;

      container.innerHTML = html;
    }

    // 渲染收藏列表（分页）
    function renderFavoritesList() {
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      document.getElementById('loading').style.display = 'none';

      const favoritesItems = favorites.slice((favoritesPage - 1) * pageSize, favoritesPage * pageSize);

      if (favoritesItems.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = t('noFavorites');
        document.querySelector('.empty-desc').textContent = t('noFavoritesDesc');
        return;
      }

      emptyState.style.display = 'none';

      // 清空按钮 HTML
      const clearAllBtn = favorites.length > 0
        ? \`<button class="clear-all-btn" onclick="clearAllFavorites()">🗑️ \${t('clearAllFavorites')}</button>\`
        : '';

      container.innerHTML = clearAllBtn + favoritesItems.map(fav => {
        const channel = allChannels.find(c => c.channel_hash === fav.hash);
        const logo = channel && channel.logo
          ? \`<img src="\${escapeHtml(channel.logo)}" alt="logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="channel-icon" style="display:none;">📺</div>\`
          : '<div class="channel-icon">📺</div>';

        return \`
          <div class="channel-item" onclick="playChannel('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')">
            <div class="ch-icon">\${logo}</div>
            <div class="ch-info">
              <div class="ch-name">\${escapeHtml(fav.name)}</div>
              <div class="ch-group">\${escapeHtml(fav.group)}</div>
            </div>
            <button class="ch-fav-btn favorited" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}', this)">⭐</button>
            <span class="ch-arrow">→</span>
          </div>
        \`;
      }).join('');

      renderFavoritesPagination();
    }

    // 清空所有收藏
    function clearAllFavorites() {
      if (favorites.length === 0) return;

      if (confirm(t('confirmClearAllFavorites') || 'Are you sure you want to clear all favorites?')) {
        favorites = [];
        localStorage.setItem('iptv_favorites', JSON.stringify(favorites));
        updateBadges();
        favoritesPage = 1;
        favoritesTotalPages = 1;
        renderFavoritesList();
        showToast(t('favoritesCleared') || 'All favorites cleared', 'success');
      }
    }

    // ========== GEO Optimization: Dynamic VideoObject Schema Update ==========
    // 动态更新 VideoObject Schema，当用户播放频道时更新
    function updateVideoSchema(channelName, groupTitle) {
      let videoSchema = document.getElementById('video-schema');
      if (!videoSchema) {
        videoSchema = document.createElement('script');
        videoSchema.type = 'application/ld+json';
        videoSchema.id = 'video-schema';
        document.head.appendChild(videoSchema);
      }
      
      const schema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": channelName + " - Live Stream",
        "description": "Watch " + channelName + " live on IPTV Search." + (groupTitle ? " Part of " + groupTitle + " category." : "") + " Free HD streaming with no registration required.",
        "thumbnailUrl": window.location.origin + "/og-image.svg",
        "uploadDate": new Date().toISOString().split('T')[0],
        "duration": "PT0S",
        "publication": {
          "@type": "BroadcastEvent",
          "isLiveBroadcast": true,
          "startDate": new Date().toISOString()
        },
        "publisher": {
          "@type": "Organization",
          "name": "IPTV Search",
          "url": "https://iptv-search.com"
        },
        "contentUrl": window.location.origin,
        "embedUrl": window.location.origin
      };
      
      videoSchema.textContent = JSON.stringify(schema);
      
      // 同时更新页面的 meta 信息
      updateMetaTag('property', 'og:title', channelName + ' - IPTV Search');
      updateMetaTag('property', 'og:description', 'Watch ' + channelName + ' live on IPTV Search. Free HD streaming with 10,000+ channels.');
      updateMetaTag('name', 'twitter:title', channelName + ' - IPTV Search');
      updateMetaTag('name', 'twitter:description', 'Watch ' + channelName + ' live on IPTV Search.');
    }

    function playChannel(hash, name, group, retryCount = 0) {
      // 如果IP直连播放已禁用，忽略播放请求
      if (!enableIpPlay) {
        return;
      }
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

      // 更新当前播放频道
      currentPlayingChannel = hash;
      
      // 更新频道列表中的播放状态
      updatePlayingStatus();

      // GEO: 动态更新 VideoObject Schema
      updateVideoSchema(name, group);

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

      // 根据系统配置决定是否使用token
      const useToken = systemConfig.enable_play_token;

      if (useToken) {
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
              showPlayErrorToast('token_failed');
              throw new Error('Failed to get token');
            }
          })
          .then(res => {
            // 再次检查
            if (requestId !== currentPlayRequestId) {
              throw new Error('Request cancelled');
            }
            // 检查响应状态
            if (!res.ok) {
              if (res.status === 403) {
                showPlayErrorToast('security_check');
              } else {
                showPlayErrorToast('network');
              }
              closePlayer();
              return;
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
                    showPlayErrorToast('decrypt_error');
                    closePlayer();
                  });
                return; // 异步解密，提前返回
              }

              console.log('[PlayChannel] Request #' + requestId + ': Play URL:', playUrl);
              startPlay(playUrl, video);
            } else {
              console.error('Channel temporarily unavailable');
              showPlayErrorToast('channel_lost');
              closePlayer();
            }
          })
          .catch(function(error) {
            if (error.name === 'AbortError' || error.message === 'Request cancelled') {
              console.log('[PlayChannel] Request #' + requestId + ' was cancelled');
              return;  // 静默处理取消的错误
            }
            console.error('[PlayChannel] Playback failed:', error);
            showPlayErrorToast('network');
            closePlayer();
          })
          .finally(() => {
            // 清理控制器
            const index = activeFetchControllers.indexOf(tokenController);
            if (index > -1) activeFetchControllers.splice(index, 1);
            const index2 = activeFetchControllers.indexOf(playController);
            if (index2 > -1) activeFetchControllers.splice(index2, 1);
          });
      } else {
        // 不使用token，直接获取播放地址
        console.log('[PlayChannel] Request #' + requestId + ': Direct play (no token)');
        fetch(window.location.origin + '/api/play/' + hash, {
          signal: playController.signal
        })
          .then(res => {
            // 检查请求是否被取消
            if (requestId !== currentPlayRequestId) {
              throw new Error('Request cancelled');
            }
            // 检查响应状态
            if (!res.ok) {
              if (res.status === 403) {
                showPlayErrorToast('security_check');
              } else {
                showPlayErrorToast('network');
              }
              closePlayer();
              return;
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
                    showPlayErrorToast('decrypt_error');
                    closePlayer();
                  });
                return; // 异步解密，提前返回
              }

              console.log('[PlayChannel] Request #' + requestId + ': Play URL:', playUrl);
              startPlay(playUrl, video);
            } else {
              console.error('Channel temporarily unavailable');
              showPlayErrorToast('channel_lost');
              closePlayer();
            }
          })
          .catch(function(error) {
            if (error.name === 'AbortError' || error.message === 'Request cancelled') {
              console.log('[PlayChannel] Request #' + requestId + ' was cancelled');
              return;  // 静默处理取消的错误
            }
            console.error('[PlayChannel] Playback failed:', error);
            showPlayErrorToast('network');
            closePlayer();
          })
          .finally(() => {
            // 清理控制器
            const index2 = activeFetchControllers.indexOf(playController);
            if (index2 > -1) activeFetchControllers.splice(index2, 1);
          });
      }
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

      // 检测是否为非HTTPS链接
      if (!playUrl.startsWith('https://') && !playUrl.startsWith('http://')) {
        showPlayErrorToast('http_link');
        return;
      }

      // 检测源类型
      const isHls = playUrl.includes('.m3u8') ||
                     playUrl.includes('m3u8') ||
                     playUrl.includes('application/x-mpegURL') ||
                     playUrl.includes('.ts') ||
                     playUrl.endsWith('.ts') ||
                     playUrl.includes('application/x-mpegTS');

      console.log('视频源类型:', { url: playUrl, isHls });

      if (isHls && typeof Hls !== 'undefined' && Hls.isSupported()) {
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
                // 检测是否为 CORS 错误（错误详情包含 cors）
                if (data.details && data.details.toLowerCase().includes('cors')) {
                  showPlayErrorToast('cors');
                } else {
                  showPlayErrorToast('network');
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('尝试恢复媒体错误');
                currentHls.recoverMediaError();
                showPlayErrorToast('media_error');
                break;
              default:
                console.log('无法恢复的错误，销毁Hls实例');
                currentHls.destroy();
                showPlayErrorToast('media_error');
                break;
            }
          }
        });
      } else {
        // 非HLS源或Hls.js未加载，使用原生video播放
        if (isHls && typeof Hls === 'undefined') {
          console.warn('Hls.js 未加载，尝试使用原生video播放');
          showPlayErrorToast('hls_not_loaded');
        } else {
          console.log('使用原生video播放（非HLS）');
        }
        video.src = playUrl;
        video.load();

        video.addEventListener('error', function(e) {
          const errorCode = video.error ? video.error.code : 0;
          console.error('原生video错误:', errorCode, video.error);
          showPlayErrorToast('media_error');
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
      
      // 清除当前播放频道状态
      currentPlayingChannel = null;
      updatePlayingStatus();

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

    // 更新频道列表中的播放状态
    function updatePlayingStatus() {
      // 移除所有卡片的播放状态
      var allCards = document.querySelectorAll('.channel-card');
      for (var i = 0; i < allCards.length; i++) {
        var card = allCards[i];
        card.classList.remove('playing');
        var playingIndicator = card.querySelector('.playing-indicator');
        if (playingIndicator) {
          playingIndicator.remove();
        }
        // 恢复所有卡片的hot标签（如果有的话）
        var hotTag = card.querySelector('.hot-tag');
        if (hotTag && hotTag.style.display === 'none') {
          hotTag.style.display = 'block';
        }
      }

      // 为当前播放的频道添加播放状态
      if (currentPlayingChannel) {
        var selector = ".channel-card[onclick*='" + currentPlayingChannel + "']";
        var playingCard = document.querySelector(selector);
        if (playingCard) {
          playingCard.classList.add('playing');
          // 隐藏hot标签
          var hotTag = playingCard.querySelector('.hot-tag');
          if (hotTag) {
            hotTag.style.display = 'none';
          }
          // 添加播放指示器
          var poster = playingCard.querySelector('.channel-poster');
          if (poster && !poster.querySelector('.playing-indicator')) {
            var indicator = document.createElement('div');
            indicator.className = 'playing-indicator';
            indicator.innerHTML = '<div class="playing-dots"><div class="playing-dot"></div><div class="playing-dot"></div><div class="playing-dot"></div></div><span>Playing</span>';
            poster.appendChild(indicator);
          }
        }
      }
    }

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
          const { enable_play_token, enable_url_encryption, url_encryption_key } = result.config;

          // 更新系统配置
          systemConfig.enable_play_token = enable_play_token;
          systemConfig.enable_url_encryption = enable_url_encryption;

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

    // ========== 公告功能 ==========

    // 加载公告
    async function loadAnnouncement() {
      try {
        const response = await fetch(window.location.origin + '/api/announcement');
        const result = await response.json();

        if (result.success && result.data && result.data.enabled) {
          announcement = result.data;
          const displayFrequency = announcement.display_frequency || 'once';

          // 根据弹出频率决定是否显示公告
          let shouldDisplay = false;

          if (displayFrequency === 'always') {
            // 每次都显示
            shouldDisplay = true;
          } else if (displayFrequency === 'once') {
            // 仅一次（关闭后不再显示）
            const closedKey = 'announcement_closed_' + announcement.id;
            const userClosed = localStorage.getItem(closedKey);
            shouldDisplay = !userClosed;
          } else if (displayFrequency === 'daily') {
            // 每天一次
            const closedKey = 'announcement_closed_' + announcement.id;
            const lastClosed = localStorage.getItem(closedKey);

            if (!lastClosed) {
              shouldDisplay = true;
            } else {
              // 检查是否是今天
              const lastClosedDate = new Date(parseInt(lastClosed));
              const today = new Date();
              shouldDisplay = lastClosedDate.toDateString() !== today.toDateString();
            }
          } else if (displayFrequency === 'weekly') {
            // 每周一次
            const closedKey = 'announcement_closed_' + announcement.id;
            const lastClosed = localStorage.getItem(closedKey);

            if (!lastClosed) {
              shouldDisplay = true;
            } else {
              // 检查是否是同一周
              const lastClosedDate = new Date(parseInt(lastClosed));
              const now = new Date();
              const oneWeek = 7 * 24 * 60 * 60 * 1000;
              shouldDisplay = (now.getTime() - lastClosedDate.getTime()) > oneWeek;
            }
          }

          if (shouldDisplay) {
            renderAnnouncement();
          } else {
            console.log('[Announcement] 公告已根据频率规则隐藏');
          }
        } else {
          console.log('[Announcement] 无有效公告或公告已禁用');
        }
      } catch (error) {
        console.error('[Announcement] 加载公告失败:', error);
      }
    }

    // 渲染公告
    function renderAnnouncement() {
      if (!announcement) return;

      const modal = document.getElementById('announcementModal');
      const titleEl = document.getElementById('announcementTitle');
      const contentEl = document.getElementById('announcementContent');
      const timeEl = document.getElementById('announcementTime');

      titleEl.textContent = announcement.title || '系统公告';
      contentEl.innerHTML = announcement.content || '暂无内容';
      modal.classList.add('active');

      // 格式化时间
      if (announcement.updated_at) {
        const date = new Date(announcement.updated_at);
        const timeStr = date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        timeEl.querySelector('span:last-child').textContent = timeStr;
      } else {
        timeEl.querySelector('span:last-child').textContent = '发布时间未知';
      }
    }

    // 关闭公告
    window.closeAnnouncement = function() {
      if (!announcement) return;

      const modal = document.getElementById('announcementModal');
      modal.classList.remove('active');

      // 根据弹出频率记录关闭时间
      const displayFrequency = announcement.display_frequency || 'once';
      const closedKey = 'announcement_closed_' + announcement.id;

      if (displayFrequency === 'once') {
        // 仅一次：永久记录
        localStorage.setItem(closedKey, 'true');
      } else if (displayFrequency === 'daily' || displayFrequency === 'weekly') {
        // 每天一次或每周一次：记录时间戳
        localStorage.setItem(closedKey, Date.now().toString());
      }
      // 'always' 模式不记录关闭状态

      console.log('[Announcement] 用户关闭公告 ID:', announcement.id, '频率:', displayFrequency);
    }

    // 在线人数显示（模拟）
    function updateOnlineCounter() {
      const count = Math.floor(Math.random() * 601) + 400; // 400-1000
      document.getElementById('onlineCount').textContent = count.toLocaleString();
      document.getElementById('onlineCountText').textContent = 'users online';
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
      // 确保隐藏详情视图，切换到频道列表模式
      const categoryBrowse = document.getElementById('categoryBrowse');
      const contentArea = document.getElementById('contentArea');
      const detailView = document.getElementById('channelDetailView');
      if (categoryBrowse) categoryBrowse.style.display = 'none';
      if (contentArea) contentArea.style.display = 'block';
      if (detailView) detailView.style.display = 'none';

      // 显示加载提示
      showLoadingIndicator(t('loadingRecommendations'));

      // 重新生成随机推荐
      initFeaturedChannels().then(() => {
        // 清除分组选择
        currentGroup = 'random';
        renderGroups();

        // 隐藏加载指示器
        hideLoadingIndicator();

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
            ? \`<img src="\${escapeHtml(channel.logo)}" alt="logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="channel-icon" style="display:none;">📺</div>\`
            : '<div class="channel-icon">📺</div>';
          const isPlaying = currentPlayingChannel === channel.channel_hash;

          return \`
            <div class="channel-item" onclick="handleChannelClick(event, '\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')">
              <div class="ch-icon">\${logo}</div>
              <div class="ch-info">
                <div class="ch-name">\${escapeHtml(channel.channel_name)}</div>
                <div class="ch-group">\${escapeHtml(channel.group_title || '')}</div>
              </div>
              <span class="ch-arrow">→</span>
            </div>
          \`;
        }).join('');

        // 添加波纹效果
        container.querySelectorAll('.channel-item').forEach(item => {
          item.addEventListener('click', function(e) {
            createRipple(item);
          });
        });
      });
    }

    // 复制IP直连播放链接
    async function copyPlayLink(channelHash) {
      // 找到对应的按钮
      const btn = event.currentTarget;
      const originalHTML = btn.innerHTML;
      
      try {
        // 调用API获取播放链接
        const response = await fetch('/api/play/link?hash=' + encodeURIComponent(channelHash));
        const data = await response.json();

        if (data.success && data.play_link) {
          // 复制到剪贴板
          await navigator.clipboard.writeText(data.play_link);
          
          // 视觉反馈：变成绿色勾
          btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          btn.classList.add('copied');
          showToast('Link copied! You can paste it into VLC or other players.', 'success');
          
          // 1.5秒后恢复
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
          }, 1500);
        } else {
          showToast(data.error || 'Failed to get play link', 'error');
        }
        } catch (error) {
        console.error('Copy play link error:', error);
        showToast('Failed to copy play link', 'error');
        // 失败时也恢复
        btn.innerHTML = originalHTML;
      }
    }

    // 下载收藏频道M3U
    async function downloadFavoritesM3U() {
      const btn = document.getElementById('favoritesDownloadBtn');
      const originalContent = btn.innerHTML;

      // 检查是否有收藏
      if (!favorites || favorites.length === 0) {
        showToast('No favorites to download', 'error');
        return;
      }

      // 显示加载状态
      btn.innerHTML = '<div class="download-spinner"></div>';
      btn.disabled = true;

      try {
        // M3U标准格式：#EXTM3U头部后直接跟频道条目
        // 注意：url-tvg不是标准属性，标准中只有tvg-id, tvg-logo, group-title等
        const m3uLines = ['#EXTM3U'];
        var channelCount = 0;

        // 逐个获取播放链接
        for (const fav of favorites) {
          try {
            // 获取播放链接
            const response = await fetch('/api/play/link?hash=' + encodeURIComponent(fav.hash));
            const data = await response.json();

            if (data.success && data.play_link) {
              // 获取频道logo
              let logo = '';
              const channelInfo = getChannelInfoByHash(fav.hash);
              if (channelInfo && channelInfo.logo) {
                logo = channelInfo.logo;
              }

              // 构建EXTINF行 - M3U标准格式：#EXTINF:-1 tvg-logo="..." group-title="...",频道名
              var extInf = '#EXTINF:-1';
              if (logo) {
                extInf += ' tvg-logo="' + escapeHtml(logo) + '" group-title="' + escapeHtml(fav.group) + '",' + escapeHtml(fav.name);
              } else {
                extInf += ' group-title="' + escapeHtml(fav.group) + '",' + escapeHtml(fav.name);
              }

              m3uLines.push(extInf);
              m3uLines.push(data.play_link);
              channelCount++;
            }
          } catch (e) {
            console.error('Failed to get link for', fav.name, e);
            // 跳过失败的频道
          }
        }

        // 如果没有获取到任何链接
        if (channelCount === 0) {
          showToast('Failed to get play links', 'error');
          btn.innerHTML = originalContent;
          btn.disabled = false;
          return;
        }

        // 创建M3U内容
        var m3uContent = m3uLines.join(String.fromCharCode(10));
        var blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
        const url = URL.createObjectURL(blob);

        // 创建下载链接
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favorites_' + new Date().toISOString().slice(0, 10) + '.m3u';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Downloaded ' + channelCount + ' channels', 'success');
      } catch (error) {
        console.error('Download favorites error:', error);
        showToast('Failed to download favorites', 'error');
      } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
      }
    }

    // 返回顶部
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // 根据hash获取频道完整信息（含logo）
    function getChannelInfoByHash(hash) {
      // 优先从当前加载的频道列表中查找
      let channel = allChannels.find(c => c.channel_hash === hash);

      // 如果当前列表中没有，尝试从缓存数据中查找
      if (!channel) {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
          if (key.startsWith(CACHE_PREFIX + 'channels_')) {
            try {
              const cached = JSON.parse(localStorage.getItem(key));
              if (cached && cached.value && cached.value.channels) {
                const found = cached.value.channels.find(c => c.channel_hash === hash);
                if (found) {
                  channel = found;
                  break;
                }
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      return channel;
    }

    // 收藏功能
    function toggleFavorite(hash, name, group, btn) {
      const index = favorites.findIndex(f => f.hash === hash);
      const isFavorited = index === -1; // 添加前是未收藏的，添加后是收藏的

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
        // 重新计算总页数
        favoritesTotalPages = Math.max(1, Math.ceil(favorites.length / pageSize));
        // 如果当前页超出范围，回到第一页
        if (favoritesPage > favoritesTotalPages) {
          favoritesPage = 1;
        }
        renderFavoritesList();
      }

      // 立即更新按钮状态（通过传入的按钮元素）
      if (btn) {
        btn.textContent = isFavorited ? '⭐' : '☆';
        btn.classList.toggle('favorited', isFavorited);
      }

      // 同时更新当前页面所有相同hash的收藏按钮（兼容方式）
      document.querySelectorAll('.ch-fav-btn').forEach(favBtn => {
        // 通过onclick字符串匹配hash
        if (favBtn.getAttribute('onclick') && favBtn.getAttribute('onclick').includes(hash)) {
          favBtn.textContent = isFavorited ? '⭐' : '☆';
          favBtn.classList.toggle('favorited', isFavorited);
        }
      });
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
        return \`<img src="\${escapeHtml(channel.logo)}" alt="logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="channel-icon" style="display:none;">📺</div>\`;
      }
      return '<div class="channel-icon">📺</div>';
    }

    // 播放历史
    function addToHistory(channel) {
      const hash = channel.channel_hash || channel.hash;
      const index = playHistory.findIndex(h => h.hash === hash);
      if (index > -1) {
        playHistory.splice(index, 1);
      }

      // 统一字段名为 hash, name, group
      playHistory.unshift({
        hash: hash,
        name: channel.channel_name,
        group: channel.group_title,
        watchedAt: Date.now()
      });

      // 只保留最近30条
      if (playHistory.length > 30) {
        playHistory = playHistory.slice(0, 30);
      }

      localStorage.setItem('iptv_history', JSON.stringify(playHistory));
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
      // 确保隐藏详情视图，切换到频道列表模式
      const categoryBrowse = document.getElementById('categoryBrowse');
      const contentArea = document.getElementById('contentArea');
      const detailView = document.getElementById('channelDetailView');
      if (categoryBrowse) categoryBrowse.style.display = 'none';
      if (contentArea) contentArea.style.display = 'block';
      if (detailView) detailView.style.display = 'none';

      // 如果IP直连播放已禁用，隐藏历史记录功能
      if (!enableIpPlay) {
        return;
      }
      // 清除分组选择
      currentGroup = 'history';
      renderGroups();

      // 更新面包屑
      // 隐藏加载和分页
      document.getElementById('loading').style.display = 'none';
      document.getElementById('channelList').style.display = 'block';
      document.getElementById('pagination').innerHTML = '';

      // 获取前30条历史记录
      const historyItems = playHistory.slice(0, 30);

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
        // 查找频道信息获取 logo
        const channel = allChannels.find(c => c.channel_hash === h.hash);
        const logo = channel && channel.logo
          ? \`<img src="\${escapeHtml(channel.logo)}" alt="logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="channel-icon" style="display:none;">📺</div>\`
          : '<div class="channel-icon">📺</div>';
        const timeAgo = getTimeAgo(h.watchedAt);

        return \`
          <div class="channel-item" onclick="playChannel('\${escapeHtml(h.hash)}', '\${escapeHtml(h.name)}', '\${escapeHtml(h.group)}')">
            <div class="ch-icon">\${logo}</div>
            <div class="ch-info">
              <div class="ch-name">\${escapeHtml(h.name)}</div>
              <div class="ch-group">\${escapeHtml(h.group)} · \${timeAgo}</div>
            </div>
            <span class="ch-arrow">→</span>
          </div>
        \`;
      }).join('');
    }

    // 在主数据区域显示收藏
    function showFavoritesInMain() {
      // 确保隐藏详情视图，切换到频道列表模式
      const categoryBrowse = document.getElementById('categoryBrowse');
      const contentArea = document.getElementById('contentArea');
      const detailView = document.getElementById('channelDetailView');
      if (categoryBrowse) categoryBrowse.style.display = 'none';
      if (contentArea) contentArea.style.display = 'block';
      if (detailView) detailView.style.display = 'none';

      // 清除分组选择
      currentGroup = 'favorites';
      renderGroups();

      // 隐藏加载
      document.getElementById('loading').style.display = 'none';
      document.getElementById('channelList').style.display = 'block';

      // 重置到第一页
      favoritesPage = 1;
      favoritesTotalPages = Math.max(1, Math.ceil(favorites.length / pageSize));

      // 使用分页渲染收藏列表
      renderFavoritesList();
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

    // ========== 用户认证相关函数 ==========

    // 打开登录模态框
    function openLoginModal() {
      document.getElementById('loginModal').classList.add('open');
      showLoginForm();
    }

    // 关闭认证模态框
    function closeAuthModal() {
      document.getElementById('loginModal').classList.remove('open');
      showLoginForm();  // 重置为登录表单
      if (resendTimer) {
        clearInterval(resendTimer);
        resendTimer = null;
      }
    }

    // 清空表单
    function clearAuthForms() {
      document.querySelectorAll('.form-input').forEach(input => {
        input.value = '';
        input.classList.remove('error');
      });
      document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
      });
      document.querySelectorAll('.verification-input').forEach(input => {
        input.value = '';
        input.classList.remove('error');
      });
      document.getElementById('verifyError').textContent = '';
      pendingVerifyEmail = null;
    }

    // 显示登录表单
    function showLoginForm() {
      clearAuthForms();
      document.getElementById('loginForm').style.display = 'block';
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('verifyForm').style.display = 'none';
      document.getElementById('forgotPasswordForm').style.display = 'none';
    }

    // 显示忘记密码表单
    function showForgotPasswordForm() {
      clearAuthForms();
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('verifyForm').style.display = 'none';
      document.getElementById('forgotPasswordForm').style.display = 'block';
    }

    // 显示注册表单
    function showRegisterForm() {
      clearAuthForms();
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('registerForm').style.display = 'block';
      document.getElementById('verifyForm').style.display = 'none';
      document.getElementById('forgotPasswordForm').style.display = 'none';
    }

    // 处理发送重置链接
    async function handleSendResetLink() {
      const email = document.getElementById('forgotEmail').value.trim();
      const emailError = document.getElementById('forgotEmailError');
      const sendResetBtn = document.getElementById('sendResetBtn');

      // 验证邮箱
      if (!email) {
        emailError.textContent = t('emailPlaceholder');
        emailError.classList.add('show');
        document.getElementById('forgotEmail').classList.add('error');
        return;
      }

      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(email)) {
        emailError.textContent = t('emailFormatError');
        emailError.classList.add('show');
        document.getElementById('forgotEmail').classList.add('error');
        return;
      }

      // 清除错误
      emailError.textContent = '';
      emailError.classList.remove('show');
      document.getElementById('forgotEmail').classList.remove('error');

      // 禁用按钮
      sendResetBtn.disabled = true;
      sendResetBtn.textContent = t('sending') || '发送中...';

      try {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (result.success) {
          showToast(t('resetLinkSent') || '重置链接已发送，请查收邮件', 'success');
          setTimeout(() => {
            showLoginForm();
          }, 2000);
        } else {
          throw new Error(result.error || '发送失败');
        }
      } catch (error) {
        showToast(error.message || '发送失败，请稍后重试', 'error');
      } finally {
        sendResetBtn.disabled = false;
        sendResetBtn.textContent = t('sendResetLink');
      }
    }

    // 显示验证表单
    // 保存注册时的密码用于验证后自动登录
    let pendingVerifyPassword = null;

    function showVerifyForm(email, password = null, autoSend = false) {
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('verifyForm').style.display = 'block';
      pendingVerifyEmail = email;
      pendingVerifyPassword = password; // 保存密码

      // 如果不是自动发送，重置发送按钮状态
      if (!autoSend) {
        const resendLink = document.getElementById('resendLink');
        resendLink.classList.remove('disabled');
        resendLink.textContent = t('getCode');
        if (resendTimer) {
          clearInterval(resendTimer);
          resendTimer = null;
        }
        resendCountdown = 0;
      }

      // 聚焦第一个输入框
      setTimeout(() => {
        document.querySelector('.verification-input').focus();
      }, 100);
    }

    // 处理注册
    async function handleRegister() {
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;
      const code = document.getElementById('registerCode').value.trim();

      // 验证邮箱和密码
      let hasError = false;

      if (!email) {
        showInputError('registerEmail', t('emailEmpty'));
        hasError = true;
      } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
        showInputError('registerEmail', t('emailInvalid'));
        hasError = true;
      } else {
        hideInputError('registerEmail');
      }

      if (!password) {
        showInputError('registerPassword', t('passwordEmpty'));
        hasError = true;
      } else if (password.length < 8) {
        showInputError('registerPassword', t('passwordTooShort'));
        hasError = true;
      } else {
        hideInputError('registerPassword');
      }

      if (!code) {
        document.getElementById('registerCodeError').textContent = t('enterCode');
        document.getElementById('registerCodeError').classList.add('show');
        hasError = true;
      } else if (code.length !== 6) {
        document.getElementById('registerCodeError').textContent = t('enter6DigitCode2');
        document.getElementById('registerCodeError').classList.add('show');
        hasError = true;
      } else {
        document.getElementById('registerCodeError').classList.remove('show');
      }

      if (hasError) return;

      try {
        const response = await fetch(AUTH_API_BASE + '/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, verification_code: code })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // 注册成功，自动登录
          authToken = data.token;
          currentUser = data.user;
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('current_user', JSON.stringify(currentUser));

          showToast(t('registerSuccess'), 'success');
          closeAuthModal();
          updateAuthUI();
        } else {
          showToast(data.error || t('registerFailed'), 'error');
          document.getElementById('registerCode').classList.add('error');
        }
      } catch (error) {
        console.error('注册失败:', error);
        showToast(t('networkError'), 'error');
      }
    }

    // 发送注册验证码
    async function handleSendRegisterCode() {
      const email = document.getElementById('registerEmail').value.trim();

      if (!email) {
        showInputError('registerEmail', t('enterCodeFirst'));
        return;
      }

      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
        showInputError('registerEmail', t('emailInvalid'));
        return;
      }

      hideInputError('registerEmail');

      const sendCodeBtn = document.getElementById('sendCodeBtn');
      if (sendCodeBtn.classList.contains('disabled')) return;

      try {
        const response = await fetch(AUTH_API_BASE + '/send-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showToast(t('codeSent'), 'success');
          startRegisterCodeCountdown();
        } else {
          showToast(data.error || t('sendCodeFailed'), 'error');
        }
      } catch (error) {
        console.error('发送验证码失败:', error);
        showToast(t('networkError'), 'error');
      }
    }

    // 开始注册验证码倒计时
    let registerCodeCountdown = 0;
    let registerCodeTimer = null;

    function startRegisterCodeCountdown() {
      registerCodeCountdown = 60;
      const sendCodeBtn = document.getElementById('sendCodeBtn');
      sendCodeBtn.classList.add('disabled');
      updateRegisterCodeBtn();

      if (registerCodeTimer) {
        clearInterval(registerCodeTimer);
      }

      registerCodeTimer = setInterval(() => {
        registerCodeCountdown--;
        updateRegisterCodeBtn();

        if (registerCodeCountdown <= 0) {
          clearInterval(registerCodeTimer);
          registerCodeTimer = null;
          sendCodeBtn.classList.remove('disabled');
        }
      }, 1000);
    }

    // 更新注册验证码按钮文本
    function updateRegisterCodeBtn() {
      const sendCodeBtn = document.getElementById('sendCodeBtn');
      if (registerCodeCountdown > 0) {
        const text = t('getCodeCountdown').replace('{count}', registerCodeCountdown);
        sendCodeBtn.textContent = text;
      } else {
        sendCodeBtn.textContent = t('getCode');
      }
    }

    // 重置注册验证码倒计时
    function resetRegisterCodeCountdown() {
      if (registerCodeTimer) {
        clearInterval(registerCodeTimer);
        registerCodeTimer = null;
      }
      registerCodeCountdown = 0;
      const sendCodeBtn = document.getElementById('sendCodeBtn');
      if (sendCodeBtn) {
        sendCodeBtn.classList.remove('disabled');
        sendCodeBtn.textContent = t('getCode');
      }
    }

    // 发送验证码
    async function sendVerificationCode(email, password = null) {
      try {
        const response = await fetch(AUTH_API_BASE + '/send-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showToast('验证码已发送到您的邮箱', 'success');
          // 启动倒计时
          startResendCountdown();
        } else {
          showToast(data.error || '发送验证码失败', 'error');
        }
      } catch (error) {
        console.error('发送验证码失败:', error);
        showToast('网络错误，请稍后重试', 'error');
      }
    }

    // 处理验证码输入
    function handleVerificationInput(input) {
      const index = parseInt(input.dataset.index);
      const value = input.value;

      // 只允许数字
      input.value = value.replace(/\\D/g, '');

      // 自动跳到下一个输入框
      if (input.value.length === 1 && index < 5) {
        document.querySelector(\`.verification-input[data-index="\${index + 1}"]\`).focus();
      }
    }

    // 处理验证码键盘事件
    function handleVerificationKeydown(event, input) {
      const index = parseInt(input.dataset.index);

      // Backspace 键处理
      if (event.key === 'Backspace' && !input.value && index > 0) {
        event.preventDefault();
        document.querySelector(\`.verification-input[data-index="\${index - 1}"]\`).focus();
      }
    }

    // 处理邮箱验证
    async function handleVerifyEmail() {
      const inputs = document.querySelectorAll('.verification-input');
      let code = '';
      inputs.forEach(input => {
        code += input.value;
      });

      if (code.length !== 6) {
        document.getElementById('verifyError').textContent = 'Please enter the complete 6-digit code';
        return;
      }

      try {
        const response = await fetch(AUTH_API_BASE + '/verify?email=' + encodeURIComponent(pendingVerifyEmail) + '&code=' + code);
        const data = await response.json();

        if (response.ok && data.success) {
          showToast('Email verified successfully', 'success');
          // 使用返回的 token 自动登录
          authToken = data.token;
          currentUser = data.user;
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('current_user', JSON.stringify(currentUser));

          closeAuthModal();
          updateAuthUI();
        } else {
          showToast(data.error || 'Verification failed', 'error');
          inputs.forEach(input => {
            input.classList.add('error');
          });
        }
      } catch (error) {
        console.error('Verification failed:', error);
        showToast('Network error, please try again later', 'error');
      }
    }

    // 重新发送验证码
    async function handleResendCode() {
      if (!pendingVerifyEmail) return;

      const resendLink = document.getElementById('resendLink');
      if (resendLink.classList.contains('disabled')) return;

      await sendVerificationCode(pendingVerifyEmail);
    }

    // 开始重发倒计时
    function startResendCountdown() {
      resendCountdown = 60;
      const resendLink = document.getElementById('resendLink');
      resendLink.classList.add('disabled');
      updateResendLink();

      if (resendTimer) {
        clearInterval(resendTimer);
      }

      resendTimer = setInterval(() => {
        resendCountdown--;
        updateResendLink();

        if (resendCountdown <= 0) {
          clearInterval(resendTimer);
          resendTimer = null;
          resendLink.classList.remove('disabled');
        }
      }, 1000);
    }

    // 更新重发链接文本
    function updateResendLink() {
      const resendLink = document.getElementById('resendLink');
      if (resendCountdown > 0) {
        const text = t('resendCountdown').replace('{count}', resendCountdown);
        resendLink.textContent = text;
      } else {
        resendLink.textContent = t('getCode');
      }
    }

    // 处理登录
    async function handleLogin() {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      // 验证
      let hasError = false;

      if (!email) {
        showInputError('loginEmail', t('emailEmpty'));
        hasError = true;
      } else {
        hideInputError('loginEmail');
      }

      if (!password) {
        showInputError('loginPassword', t('passwordEmpty'));
        hasError = true;
      } else {
        hideInputError('loginPassword');
      }

      if (hasError) return;

      await performLogin(email, password);
    }

    // 处理 Google 登录
    async function handleGoogleLogin() {
      try {
        // 获取 Google OAuth 授权 URL
        const response = await fetch(AUTH_API_BASE + '/google/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (!data.success) {
          showToast(data.error || 'Failed to initialize Google login', 'error');
          return;
        }
        
        // 保存 state 到 sessionStorage
        sessionStorage.setItem('oauth_state', data.state);
        
        // 跳转到 Google 授权页面
        window.location.href = data.auth_url;
      } catch (error) {
        console.error('Google login error:', error);
        showToast('Google login failed', 'error');
      }
    }

    // 检查 OAuth 回调
    function checkOAuthCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      
      if (code && state) {
        // 清除 URL 参数
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // 显示加载状态
        showToast('Processing Google login...', 'info');
        
        // 使用 code 换取 token
        handleOAuthCallback(code, state);
      } else if (error) {
        showToast('Google login was denied', 'error');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    // 处理 OAuth 回调
    async function handleOAuthCallback(code, state) {
      try {
        // 由于是服务器端重定向，我们直接刷新页面
        // 后端会在 /google/callback 处理并返回 session
        // 页面刷新后会自动读取 localStorage 中的 token
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('OAuth callback error:', error);
        showToast('Login processing failed', 'error');
      }
    }

    // 执行登录
    async function performLogin(email, password) {
      try {
        const response = await fetch(AUTH_API_BASE + '/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          authToken = data.token;
          currentUser = data.user;
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('current_user', JSON.stringify(currentUser));

          showToast(t('loginSuccess'), 'success');
          closeAuthModal();
          updateAuthUI();
        } else {
          if (data.needVerification) {
            // 需要验证邮箱
            showToast(t('needVerifyEmail'), 'warning');
            showVerifyForm(email);
          } else {
            showToast(data.error || t('loginFailed'), 'error');
          }
        }
      } catch (error) {
        console.error('登录失败:', error);
        showToast(t('networkError'), 'error');
      }
    }

    // 处理登出
    async function handleLogout() {
      const currentToken = localStorage.getItem('auth_token');
      try {
        if (currentToken) {
          await fetch(AUTH_API_BASE + '/logout', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + currentToken
            }
          });
        }
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        authToken = null;
        currentUser = null;
        showToast('Logged out successfully', 'success');
        updateAuthUI();
      }
    }

    // 更新认证UI
    function updateAuthUI() {
      const authButtonsDiv = document.getElementById('authButtons');

      // 每次都从 localStorage 重新获取最新的登录状态
      const currentToken = localStorage.getItem('auth_token');
      const currentUserData = JSON.parse(localStorage.getItem('current_user') || 'null');

      if (currentToken && currentUserData) {
        // 已登录状态 - 只显示账户按钮
        authButtonsDiv.innerHTML = \`
          <a href="/account" class="quick-entry ripple" style="text-decoration:none;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span class="quick-entry-tip">Account</span>
          </a>
        \`;
      } else {
        // 未登录状态 - 使用不同颜色的用户图标，表示需要登录
        authButtonsDiv.innerHTML = \`
          <button class="quick-entry ripple" onclick="openLoginModal()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span class="quick-entry-tip">Login</span>
          </button>
        \`;
      }
    }

    // 显示输入错误
    function showInputError(inputId, message) {
      const input = document.getElementById(inputId);
      const errorDiv = document.getElementById(inputId + 'Error');
      input.classList.add('error');
      errorDiv.textContent = message;
      errorDiv.classList.add('show');
    }

    // 隐藏输入错误
    function hideInputError(inputId) {
      const input = document.getElementById(inputId);
      const errorDiv = document.getElementById(inputId + 'Error');
      input.classList.remove('error');
      errorDiv.classList.remove('show');
    }

    // 页面加载时更新认证UI
    updateAuthUI();
    
    // 检查 OAuth 回调
    checkOAuthCallback();
  </script>

  <!-- 登录/注册模态框 -->
  <div class="modal-overlay" id="loginModal">
    <div class="modal">
      <button class="modal-close" onclick="closeAuthModal()">×</button>
      
      <!-- 登录表单 -->
      <div id="loginForm">
        <h2 class="modal-title" data-i18n="loginTitle">Login</h2>
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label" data-i18n="email">Email</label>
            <input type="email" class="form-input" id="loginEmail" data-i18n-placeholder="emailPlaceholder" placeholder="Enter email">
            <div class="form-error" id="loginEmailError"></div>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="password">Password</label>
            <input type="password" class="form-input" id="loginPassword" data-i18n-placeholder="passwordPlaceholder" placeholder="Enter password (min 8 characters)">
            <div class="form-error" id="loginPasswordError"></div>
          </div>
          <button class="btn-primary" onclick="handleLogin()" data-i18n="loginBtn">Login</button>
          <button class="google-login-btn" onclick="handleGoogleLogin()">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span data-i18n="googleLogin">Login with Google</span>
          </button>
          <div style="text-align:center;margin-top:12px;">
            <a href="#" onclick="showForgotPasswordForm()" style="color:rgba(255,255,255,.6);font-size:14px;text-decoration:none;" data-i18n="forgotPassword">Forgot password?</a>
          </div>
        </div>
        <div class="modal-footer">
          <span data-i18n="noAccount">No account?</span><a href="#" onclick="showRegisterForm()" data-i18n="registerNow">Register now</a>
        </div>
      </div>

      <!-- 注册表单 -->
      <div id="registerForm" style="display:none;">
        <h2 class="modal-title" data-i18n="registerTitle">Register</h2>
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label" data-i18n="email">Email</label>
            <input type="email" class="form-input" id="registerEmail" data-i18n-placeholder="emailPlaceholder" placeholder="Enter email">
            <div class="form-error" id="registerEmailError"></div>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="password">Password</label>
            <input type="password" class="form-input" id="registerPassword" data-i18n-placeholder="passwordPlaceholder" placeholder="Enter password (min 8 characters)">
            <div class="form-error" id="registerPasswordError"></div>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="emailCode">Email Code</label>
            <div style="display:flex;gap:10px;">
              <input type="text" class="form-input" id="registerCode" data-i18n-placeholder="codePlaceholder" placeholder="Enter 6-digit code" maxlength="6" oninput="this.value=this.value.replace(/\\D/g,'')" style="flex:1;">
              <button type="button" class="btn-secondary" id="sendCodeBtn" onclick="handleSendRegisterCode()" data-i18n="getCode">Get Code</button>
            </div>
            <div class="form-error" id="registerCodeError"></div>
          </div>
          <button class="btn-primary" onclick="handleRegister()" data-i18n="registerBtn">Register</button>
        </div>
        <div class="modal-footer">
          <span data-i18n="hasAccount">Already have an account?</span><a href="#" onclick="showLoginForm()" data-i18n="loginNow">Login now</a>
        </div>
      </div>

      <!-- 邮箱验证表单 -->
      <div id="verifyForm" style="display:none;">
        <h2 class="modal-title" data-i18n="verifyEmailTitle">Email Verification</h2>
        <p style="text-align:center;color:rgba(255,255,255,.6);font-size:14px;margin-bottom:20px;" data-i18n="verifyEmailDesc">
          Click the button below to get verification code
        </p>
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label" data-i18n="enter6DigitCode">Enter 6-digit code</label>
            <div class="verification-inputs">
              <input type="text" class="verification-input" maxlength="1" data-index="0" oninput="handleVerificationInput(this)" onkeydown="handleVerificationKeydown(event,this)">
              <input type="text" class="verification-input" maxlength="1" data-index="1" oninput="handleVerificationInput(this)" onkeydown="handleVerificationKeydown(event,this)">
              <input type="text" class="verification-input" maxlength="1" data-index="2" oninput="handleVerificationInput(this)" onkeydown="handleVerificationKeydown(event,this)">
              <input type="text" class="verification-input" maxlength="1" data-index="3" oninput="handleVerificationInput(this)" onkeydown="handleVerificationKeydown(event,this)">
              <input type="text" class="verification-input" maxlength="1" data-index="4" oninput="handleVerificationInput(this)" onkeydown="handleVerificationKeydown(event,this)">
              <input type="text" class="verification-input" maxlength="1" data-index="5" oninput="handleVerificationInput(this)" onkeydown="handleVerificationKeydown(event,this)">
            </div>
            <div class="form-error" id="verifyError"></div>
          </div>
          <button class="btn-primary" id="verifyBtn" onclick="handleVerifyEmail()" data-i18n="verifyEmailBtn">Verify Email</button>
          <div style="text-align:center;margin-top:15px;">
            <a class="resend-link" id="resendLink" onclick="handleResendCode()" data-i18n="getCode">Get Code</a>
          </div>
        </div>
      </div>

      <!-- 忘记密码表单 -->
      <div id="forgotPasswordForm" style="display:none;">
        <h2 class="modal-title" data-i18n="forgotPasswordTitle">Reset Password</h2>
        <p style="text-align:center;color:rgba(255,255,255,.6);font-size:14px;margin-bottom:20px;" data-i18n="forgotPasswordDesc">
          Enter your registered email and we will send a reset link
        </p>
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label" data-i18n="email">Email</label>
            <input type="email" class="form-input" id="forgotEmail" data-i18n-placeholder="emailPlaceholder" placeholder="Enter email">
            <div class="form-error" id="forgotEmailError"></div>
          </div>
          <button class="btn-primary" id="sendResetBtn" onclick="handleSendResetLink()" data-i18n="sendResetLink">Send Reset Link</button>
        </div>
        <div class="modal-footer">
          <a href="#" onclick="showLoginForm()" data-i18n="backToLogin">Back to Login</a>
        </div>
      </div>
    </div>
  </div>

  ${PAGE_FOOTER}

  <!-- Google AdSense 广告（延迟加载） -->
  <script>
    // 延迟加载广告脚本，最低优先级
    setTimeout(function() {
      var adsScript = document.createElement('script');
      adsScript.async = true;
      adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2205598928191137';
      adsScript.crossOrigin = 'anonymous';
      adsScript.onload = function() {
        // 脚本加载完成后初始化所有广告位
        (adsbygoogle = window.adsbygoogle || []).push({});
      };
      document.head.appendChild(adsScript);
    }, 3000); // 页面加载3秒后加载广告
  </script>
  <!-- 100%填充 -->
  <script>(function(s){s.dataset.zone='10620252',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
</body>
</html>`;
