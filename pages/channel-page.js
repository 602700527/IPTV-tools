// Channel Detail Page - Server-side rendered matching template exactly
import { PAGE_HEADER } from '../components/page-header.js';
import { PAGE_FOOTER } from '../components/page-footer.js';
import { HEAD_SCRIPTS } from '../components/head-scripts.js';

export function generateChannelPage(options = {}) {
  const { 
    origin = 'https://iptv-search.com', 
    hash = '',
    channel = null,
    relatedChannels = [],
    header = PAGE_HEADER
  } = options;

  if (!channel) {
    return '<html><body>Channel not found</body></html>';
  }

  // Helper functions
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function escapeJs(str) {
    if (!str) return '';
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

  // Slugify function - must match the one in worker.js for consistent URLs
  function slugify(str) {
    if (!str) return '';
    var ws = String.fromCharCode(9, 10, 11, 12, 13, 32);
    var reWs = new RegExp('[' + ws + ']+', 'g');
    var reKeep = new RegExp('[^a-zA-Z0-9' + String.fromCharCode(0x4e00) + '-' + String.fromCharCode(0x9fff) + String.fromCharCode(0xff00) + '-' + String.fromCharCode(0xffef) + String.fromCharCode(0xfe00) + '-' + String.fromCharCode(0xfeff) + String.fromCharCode(0x3000) + '-' + String.fromCharCode(0x303f) + String.fromCharCode(0x2000) + '-' + String.fromCharCode(0x206f) + String.fromCharCode(0xfe30) + '-' + String.fromCharCode(0xfe4f) + String.fromCharCode(0x2600) + '-' + String.fromCharCode(0x26ff) + '-]', 'g');
    var reDash = /-+/g;
    var reEdge = /^-+|-+$/g;
    return str.trim().replace(reWs, '-').replace(reKeep, '').replace(reDash, '-').replace(reEdge, '');
  }

  // Build category slug for breadcrumb
  const categorySlug = slugify(channel.group || '');

  // Build channel slug for SEO-friendly URLs (pure slug, no hash)
  function buildChannelSlug(name) {
    return slugify(name);
  }

  const channelSlug = buildChannelSlug(channel.name);

  // Build logo HTML
  const logoHtml = channel.logo 
    ? '<img src="' + escapeHtml(channel.logo) + '" alt="' + escapeHtml(channel.name) + '" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';this.nextElementSibling.textContent=this.alt.charAt(0)">' +
      '<div class="placeholder" style="display:none"></div>'
    : '<div class="placeholder">' + escapeHtml(channel.name.charAt(0)) + '</div>';

  // Build channel meta badge
  const sourceDisplay = channel.sourceName || 'Unknown';
  
  // Build stats - updated only (category is shown in subtitle)
  const statsHtml = 
    '<div class="stat">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>' +
      '<span>Updated daily</span>' +
    '</div>';

  // Build action buttons - direct intent fulfillment, not redirect through /plans
  const actionButtonsHtml =
    '<a href="' + origin + '/subscription" class="btn btn-primary">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>' +
      'Get VIP Subscription' +
    '</a>' +
    '<a href="' + origin + '/subscription" class="btn btn-secondary" style="margin-left:10px;">' +
      'Try Free' +
    '</a>' +
    '<button class="btn btn-secondary" id="detailStarBtn" onclick="toggleChannelStar()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
      '<span id="starText">Add to Favorites</span>' +
    '</button>' +

    '<button class="btn btn-secondary" onclick="copyPlayLink()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' +
      'Copy Link' +
    '</button>' +

    '<button class="btn btn-secondary btn-test-play" onclick="testPlayChannel()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
      'Test Play' +
    '</button>';

  // Build info card rows
  const description = channel.description || '';
  const hasDescription = description && description.trim().length > 0;
  
  const infoRowsHtml =
    '<div class="info-row">' +
      '<span class="info-label">Channel Name</span>' +
      '<span class="info-value">' + escapeHtml(channel.name) + '</span>' +
    '</div>' +
    '<div class="info-row">' +
      '<span class="info-label">Category</span>' +
      '<span class="info-value"><a href="' + origin + '/category/' + encodeURIComponent(categorySlug) + '" style="color: var(--accent)">' + escapeHtml(channel.group || 'Other') + '</a></span>' +
    '</div>' +
    (hasDescription 
      ? '<div class="info-row description-row">' +
          '<span class="info-label">Description</span>' +
          '<span class="info-value description-value">' + escapeHtml(description) + '</span>' +
        '</div>'
      : '') +
    '<div class="info-row">' +
      '<span class="info-label">Last Updated</span>' +
      '<span class="info-value">' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + '</span>' +
    '</div>';

  // Build related channels grid
  let relatedChannelsHtml = '';
  if (relatedChannels.length > 0) {
    relatedChannelsHtml = '<section class="related-section">' +
      '<div class="account-card">' +
      '<div class="section-header"><h3>More from ' + escapeHtml(channel.group || 'This Category') + '</h3></div>' +
      '<div class="related-grid">' +
      relatedChannels.map(ch => {
        const chLogo = ch.logo
          ? '<img src="' + escapeHtml(ch.logo) + '" alt="' + escapeHtml(ch.name) + '" loading="lazy" decoding="async" onerror="this.style.display=\'none\">' +
            '<div class="placeholder" style="display:none">📺</div>'
          : '<div class="placeholder">📺</div>';
        return '<div class="related-card" onclick="location.href=\'' + origin + '/channel/' + buildChannelSlug(ch.name) + '\">' +
          chLogo +
          '<div class="related-card-info">' +
            '<div class="related-card-name">' + escapeHtml(ch.name) + '</div>' +
            '<div class="related-card-group">' + escapeHtml(ch.group || '') + '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
      '</div></div></section>';;
  }

  // 占位图 SVG (方案E: 深灰背景 + 频道名大字居中)
  const placeholderSvg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
      <rect fill="#1a1a1a" width="640" height="360"/>
      <text fill="#ffffff" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" dominant-baseline="central" x="320" y="180">${escapeHtml(channel.name)}</text>
    </svg>`
  );

  // JSON-LD for SEO
  const jsonLd1 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": channel.name + " - Live TV",
    "description": "Watch " + channel.name + " live streaming for free on IPTV Search. " + channel.group + " category.",
    "thumbnailUrl": channel.logo || placeholderSvg,
    "image": channel.logo || placeholderSvg,
    "uploadDate": "2024-04-10",
    "contentUrl": origin + "/play/" + hash,
    "embedUrl": origin + "/play/" + hash,
    "genre": channel.group || "TV Channel",
    "publisher": {
      "@type": "Organization",
      "name": "IPTV Search",
      "url": origin
    },
    "mainEntity": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": origin + "/"},
        {"@type": "ListItem", "position": 2, "name": channel.group || "Channels", "item": origin + "/category/" + encodeURIComponent(categorySlug)},
        {"@type": "ListItem", "position": 3, "name": channel.name, "item": origin + "/channel/" + channelSlug}
      ]
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">
  <meta name="theme-color" content="#e50914">
  <title>${escapeHtml(channel.name)} - Free IPTV Live Stream | ${escapeHtml(channel.group || 'Live TV')}</title>
  <meta name="description" content="Watch ${escapeHtml(channel.name)} live online free. ${escapeHtml(channel.group)} IPTV streaming with M3U M3U8 download. No signup required.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${origin}/channel/${channelSlug}">
  <meta property="og:url" content="${origin}/channel/${channelSlug}">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="Watch ${escapeHtml(channel.name)} Online - Free ${escapeHtml(channel.group || 'TV')} IPTV M3U M3U8">
  <meta property="og:description" content="Stream ${escapeHtml(channel.name)} live free. Instant M3U M3U8 link - works with all IPTV players. No registration needed.">
  ${channel.logo ? `<meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image" content="${escapeHtml(channel.logo)}">` : ''}
  <meta property="og:type" content="video.other">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Watch ${escapeHtml(channel.name)} Online Free - IPTV M3U M3U8">
  <meta name="twitter:description" content="Stream ${escapeHtml(channel.name)} live free. M3U M3U8 link for all IPTV players.">

  <script type="application/ld+json">${JSON.stringify(jsonLd1)}</script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "${origin}/" },
      { "@type": "ListItem", "position": 2, "name": "${escapeJs(channel.group || 'Other')}", "item": "${origin}/category/${encodeURIComponent(categorySlug)}" },
      { "@type": "ListItem", "position": 3, "name": "${escapeJs(channel.name)}" }
    ]
  }
   </script>

   <script src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"></script>

   <script>
    

    // 初始化 fingerprintJS
    let fpPromise = null;
    function getFingerprint() {
      if (!fpPromise) {
        fpPromise = FingerprintJS.load().then(fp => fp.get()).then(result => result.visitorId);
      }
      return fpPromise;
    }
  </script>

  <style>
    :root {
      --bg-primary: #0a0a0a;
      --bg-secondary: #141414;
      --bg-card: #1a1a1a;
      --bg-hover: #252525;
      --text-primary: #ffffff;
      --text-secondary: #a0a0a0;
      --text-muted: #8b8b8b;
      --accent: #e50914;
      --accent-hover: #f6121d;
      --border: rgba(255,255,255,0.08);
      --border-hover: rgba(255,255,255,0.15);
      --shadow: 0 4px 20px rgba(0,0,0,0.5);
      --radius: 12px;
      --transition: 0.2s ease;
    }


    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-padding-top: 60px; }
    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: inherit; }

    /* Header - Consistent with home page */
    .header { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
    .logo-icon svg { width: 36px; height: 36px; }
    .logo-text span { color: var(--accent); }
    .search-box { position: relative; width: 300px; }
    .search-box form { display: flex; }
    .search-box input { width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; color: var(--text-primary); font-size: 0.9rem; outline: none; transition: border-color var(--transition); }
    .search-box input:focus { border-color: var(--accent); }
    .search-box::before { content: '🔍'; position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); font-size: 0.9rem; pointer-events: none; }
    .pill-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .pill-btn:hover { color: var(--accent); }
    .account-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .account-btn:hover { color: var(--accent); }
    .account-btn svg, .pill-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
    .theme-toggle { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; color: var(--text-secondary); cursor: pointer; transition: color var(--transition); border: none; }
    .theme-toggle:hover { color: var(--accent); }
    #translate { position: relative; display: inline-flex; align-items: center; }
    #translateSelectLanguage { appearance: none; -webkit-appearance: none; padding: 0.5rem 2rem 0.5rem 0.75rem; background: transparent; border: none; border-radius: 6px; color: var(--text-secondary); font-size: 0.85rem; cursor: pointer; outline: none; transition: color var(--transition); min-width: 80px; }
    #translateSelectLanguage:focus { color: var(--accent); }
    #translateSelectLanguage:hover { color: var(--accent); }
    #translate::after { content: ""; position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--text-secondary); pointer-events: none; }
    #translate:hover::after { border-top-color: var(--accent); }

    /* Breadcrumb */
    .breadcrumb { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none; }
    .breadcrumb::-webkit-scrollbar { display: none; }
    .breadcrumb a { color: var(--accent); display: flex; align-items: center; gap: 0.25rem; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb-sep { opacity: 0.5; margin: 0 0.1rem; }
    .breadcrumb-icon { width: 14px; height: 14px; }

    /* Main Content */
    .main-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }

    /* Account-card - tight visual containment from /account */
    .account-card {
      background: #111111 !important;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--radius);
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .account-section { display: flex; flex-direction: column; gap: 5px; padding: 14px 0 !important; }
    .account-section:last-child { padding-bottom: 14px !important; }

    /* Channel Hero - compact side-by-side flex */
    .channel-hero {
      display: flex;
      gap: 18px;
      align-items: flex-start;
      margin-bottom: 0;
    }
    .channel-poster-large {
      flex-shrink: 0;
      width: 200px;
      aspect-ratio: 16/10;
      background: var(--bg-card);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .channel-poster-large img { width: 100%; height: 100%; object-fit: contain; padding: 1.25rem; }
    .channel-poster-large .placeholder { font-size: 3rem; opacity: 0.3; background: var(--bg-hover); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: var(--radius); }
    .channel-details { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }
    .channel-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

    /* Badge tokens */
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: var(--radius); font-size: 10px; font-weight: 600; letter-spacing: 0.2px; }
    .badge-live { background: rgba(229, 9, 20, 0.15); color: var(--accent); border: 1px solid rgba(229, 9, 20, 0.3); }
    .badge-live::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
    .badge-free { background: rgba(34, 197, 94, 0.12); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
    .badge-format { background: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border); }

    .channel-title { font-size: 1.125rem; font-weight: 700; margin: 2px 0 4px; line-height: 1.3; }
    .channel-subtitle { font-size: 0.85rem; color: var(--text-secondary); }
    .channel-stats { display: flex; gap: 6px; flex-wrap: wrap; }
    .stat { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-secondary); padding: 4px 8px; background: var(--bg-hover); border: 1px solid var(--border); border-radius: var(--radius); }
    .stat-icon { font-size: 0.85rem; }

    /* Action Buttons - compact */
    .action-buttons { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
    .btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: var(--radius); font-size: 11px; font-weight: 600; border: none; transition: all var(--transition); cursor: pointer; }
    .btn-primary { background: var(--accent); color: white; }
    .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
    .btn-secondary { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); }
    .btn-secondary:hover { background: var(--bg-hover); border-color: var(--border-hover); }
    .btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-favorited { border-color: var(--accent) !important; }
    .btn-favorited svg { fill: var(--accent); }
    .btn-test-play { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; box-shadow: 0 2px 8px rgba(99,102,241,0.3); }
    .btn-test-play:hover { background: linear-gradient(135deg, #4f46e5, #4338ca); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.5); }


    /* Spinner */
    .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Section header */
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .section-header h3 { font-size: 14px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .section-action { font-size: 11px; color: var(--text-muted); }

    /* Info Card */
    .info-card { background: #111111 !important; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); padding: 16px 18px; margin-bottom: 12px; }
    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); gap: 1rem; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; white-space: nowrap; }
    .info-value { font-size: 13px; color: var(--text-primary); font-weight: 500; text-align: right; }

    /* How to Watch */
    .how-to-watch { background: #111111 !important; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); padding: 16px 18px; margin-bottom: 12px; }
    .how-to-watch .section-header { margin-bottom: 16px; }
    .watch-option { margin-bottom: 1rem; }
    .watch-option:last-child { margin-bottom: 0; }
    .option-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 1rem; }
    .option-icon { font-size: 1.25rem; }
    .option-header h4 { font-size: 0.95rem; font-weight: 600; margin: 0; }
    .option-steps { padding-left: 0.5rem; }
    .step { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; align-items: flex-start; }
    .step:last-child { margin-bottom: 0; }
    .step-number { width: 22px; height: 22px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
    .step-content h4 { font-size: 0.85rem; margin-bottom: 0.15rem; }
    .step-content h4 a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
    .step-content h4 a:hover { text-decoration: none; }
    .step-content p { font-size: 0.78rem; color: var(--text-secondary); }

    /* Perk items grid */
    .perks-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
    .perk-item { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; background: var(--bg-hover); border: 1px solid var(--border); border-radius: var(--radius); font-size: 11px; color: var(--text-secondary); }
    .perk-icon { font-size: 0.85rem; }

    /* Related Section */
    .related-section { margin-top: 1.5rem; }
    .related-section .account-card { margin-bottom: 0; }
    .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; }
    .related-card { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; transition: all var(--transition); text-decoration: none; color: inherit; }
    .related-card:hover { border-color: var(--border-hover); background: var(--bg-hover); transform: translateY(-1px); }
    .related-card img, .related-card .placeholder { width: 36px; height: 36px; object-fit: contain; border-radius: 4px; flex-shrink: 0; }
    .related-card .placeholder { background: var(--bg-hover); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; opacity: 0.4; }
    .related-card-info { min-width: 0; flex: 1; }
    .related-card-name { font-size: 0.82rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .related-card-group { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Toast - glass card, top-centered */
    .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-80px); background: rgba(17, 17, 17, 0.95); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); color: var(--text-primary); padding: 10px 20px; border-radius: var(--radius); font-size: 0.85rem; font-weight: 500; z-index: 10000; opacity: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .toast.toast-success { border-color: rgba(34, 197, 94, 0.3); color: #22c55e; }
    .toast.toast-warning { border-color: rgba(234, 179, 8, 0.3); color: #eab308; }
    .toast.toast-error { border-color: rgba(229, 9, 20, 0.3); color: var(--accent); }

    /* Guest gift animation */
    .guest-gift { animation: giftPulse 2s ease-in-out infinite; }
    @keyframes giftPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    .gift-icon { display: inline-block; animation: giftBounce 1s ease-in-out infinite; }
    @keyframes giftBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

    /* Responsive */
    @media (max-width: 768px) {
      .header { padding: 0.5rem 0.75rem; }
      .header-inner { flex-wrap: wrap; justify-content: space-between; gap: 0.5rem; }
      .logo { flex-shrink: 0; }
      .logo-icon svg { width: 32px; height: 32px; }
      .logo-text { display: none; }
      .search-box { width: 100%; order: 3; margin-top: 0.5rem; }
      .search-box input { padding: 0.5rem 1rem 0.5rem 2.5rem; font-size: 0.9rem; }
      .search-box::before { font-size: 0.9rem; left: 0.8rem; }
      .header-actions { gap: 0.25rem; flex-shrink: 0; }
      .header-actions .pill-btn { width: 32px; height: 32px; padding: 0; flex-shrink: 0; }
      .header-actions .pill-btn span { display: none; }
      .theme-toggle { width: 32px; height: 32px; background: transparent; border: none; padding: 0; flex-shrink: 0; }
      .account-btn { width: 32px; height: 32px; padding: 0; flex-shrink: 0; }
      #translateSelectLanguage { min-width: 50px; padding: 0.5rem 1rem 0.5rem 0.5rem; font-size: 0.75rem; }
      #translate::after { right: 0.4rem; border-top: 4px solid var(--text-secondary); }
      .breadcrumb { padding: 0.75rem 1rem; font-size: 0.8rem; }
      .breadcrumb-text { display: none; }
      .breadcrumb-icon { width: 16px; height: 16px; }
      .breadcrumb-sep { font-size: 1rem; }
      .breadcrumb-current { font-size: 0.8rem; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .breadcrumb-cat { max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .main-container { padding: 1rem; }
      .channel-hero { flex-direction: column; align-items: stretch; }
      .channel-poster-large { width: 100%; }
      .channel-details { text-align: left; }
      .channel-meta { justify-content: flex-start; }
      .channel-title { font-size: 1.25rem; }
      .channel-subtitle { font-size: 0.9rem; }
      .channel-stats { justify-content: flex-start; }
      .action-buttons { flex-direction: row; }
      .action-buttons .btn { flex: 1; justify-content: center; }
      .info-card { padding: 14px 16px; }
      .info-row { padding: 6px 0; font-size: 0.82rem; }
      .info-label { font-size: 10px; }
      .info-value { font-size: 12px; }
      .how-to-watch { padding: 14px 16px; }
      .option-header { flex-direction: column; text-align: center; gap: 0.5rem; padding: 0.75rem; }
      .option-steps { padding-left: 0; }
      .step { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
      .step-number { width: 26px; height: 26px; font-size: 0.75rem; }
      .related-section { margin-top: 1.5rem; }
      .related-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.6rem; }
      .related-card { padding: 0.5rem; gap: 0.5rem; }
      .related-card img, .related-card .placeholder { width: 32px; height: 32px; }
      .related-card-name { font-size: 0.78rem; }
      .related-card-group { font-size: 0.68rem; }
      .toast { top: 12px; bottom: auto; padding: 8px 16px; font-size: 0.82rem; }
      .page-footer { padding: 1.5rem 0.75rem; }
      .footer-links { font-size: 0.7rem; gap: 0.75rem; }
    }

    /* SEO & FAQ - account-card styled */
    .seo-content { background: #111111 !important; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); padding: 16px 18px; margin-bottom: 12px; }
    .seo-content .section-header { margin-bottom: 12px; }
    .seo-content p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 0.5rem; }
    .faq-section { background: #111111 !important; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); padding: 16px 18px; margin-bottom: 12px; }
    .faq-section .section-header { margin-bottom: 12px; }
    .faq-item { background: transparent; border: none; border-radius: 0; padding: 10px 0; border-bottom: 1px solid var(--border); }
    .faq-item:last-child { border-bottom: none; padding-bottom: 0; }
    .faq-item h3 { font-size: 0.88rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--accent); }
    .faq-item p { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.55; }

@media (max-width: 480px) {
      .channel-poster-large { width: 100%; aspect-ratio: 16/9; }
      .channel-title { font-size: 1.05rem; }
      .action-buttons .btn { padding: 6px 10px; font-size: 10px; }
      .related-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
  <a href="#main-content" class="skip-link" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;z-index:99999;">Skip to main content</a>
  <style>.skip-link:focus{position:fixed;left:0;top:0;width:auto;height:auto;padding:0.5rem 1rem;background:#e50914;color:#fff;z-index:99999;font-weight:600;}
    @media (prefers-reduced-motion: reduce) {
      .guest-gift, .gift-icon { animation: none !important; }
      * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
    }</style>
</head>
<body>
  ${header}

  <nav class="breadcrumb">
    <a href="${origin}/">
      <svg class="breadcrumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span class="breadcrumb-text">Home</span>
    </a>
    <span class="breadcrumb-sep">›</span>
    <a href="${origin}/category/${encodeURIComponent(categorySlug)}" class="breadcrumb-cat">${escapeHtml(channel.group || 'Other')}</a>
    <span class="breadcrumb-sep">›</span>
    <span class="breadcrumb-current">${escapeHtml(channel.name)}</span>
  </nav>

  <main class="main-container main-stack" id="main-content">
    <!-- Channel Hero - account-card wrapped -->
    <div class="channel-hero account-card">
      <div class="channel-poster-large">
        ${logoHtml}
      </div>
      <div class="channel-details">
        <div class="channel-meta">
          <span class="badge badge-live">LIVE</span>
          <span class="badge badge-free">Free</span>
          <span class="badge badge-format">${escapeHtml(channel.format || 'M3U8')}</span>
        </div>
        <h1 class="channel-title">${escapeHtml(channel.name)}</h1>
        <p class="channel-subtitle">${escapeHtml(channel.group || 'General Channel')}</p>
        <div class="channel-stats">
          ${statsHtml}
        </div>
        <div class="action-buttons">
          ${actionButtonsHtml}
        </div>
      </div>
    </div>

    <!-- Info Card - account-card wrapped -->
    <div class="info-card">
      <div class="section-header">
        <h3>Channel Information</h3>
        <span class="section-action">Updated ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
      ${infoRowsHtml}
    </div>

    <!-- How to Watch - account-card wrapped -->
    <div class="how-to-watch">
      <div class="section-header">
        <h3>How to Watch</h3>
        <span class="section-action">Select your player</span>
      </div>
      
      <div class="watch-option">
        <div class="option-header">
          <span class="option-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
          <h4>Option 1: Get VIP Subscription (Recommended)</h4>
        </div>
        <div class="option-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4><a href="${origin}/subscription">Choose a VIP Plan &amp; Pay</a></h4>
              <p>Get instant access to all channels with your personal playlist URL. Starts at $9.99/mo.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Open in Your Player</h4>
              <p>Paste your subscription URL into any IPTV player to start watching.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Option 2: Free Method -->
      <div class="watch-option">
        <div class="option-header">
          <span class="option-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
          <h4>Option 2: Free with Favorites</h4>
        </div>
        <div class="option-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4><a href="${origin}/favorites">Add to Favorites</a></h4>
              <p>Click the "Add to Favorites" button above, or <a href="${origin}/favorites">view your favorites</a>.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4><a href="${origin}/favorites">Copy M3U Link</a></h4>
              <p>Go to <a href="${origin}/favorites">My Favorites</a> and click "Download M3U" to export your playlist.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Import to Player</h4>
              <p>Open your IPTV player and import the downloaded M3U file to start watching.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SEO Content Section -->
        <!-- About - account-card -->
    <section class="seo-content account-card">
      <div class="section-header">
        <h3>About ${escapeHtml(channel.name)}</h3>
      </div>
      <div class="account-section">
        <p>${escapeHtml(channel.description || 'Watch ' + channel.name + ' live online for free on IPTV Search. ' + (channel.group || 'This channel') + ' streaming is available in HD quality with M3U and M3U8 playlist support. No registration or subscription required for free access.')}</p>
        <p>Access ${escapeHtml(channel.name)} via our direct stream link, or download the M3U playlist for use in VLC, IPTV Smarters, TiviMate, and other IPTV players. Updated daily to ensure reliable playback.</p>
      </div>
    </section>

    <!-- FAQ - account-card -->
    <section class="faq-section account-card">
      <div class="section-header">
        <h3>Frequently Asked Questions</h3>
      </div>
      <div class="account-section">
      <div class="faq-item">
        <h3>How do I watch ${escapeHtml(channel.name)}?</h3>
        <p>Click the "Try Free" button above to get instant access, or copy the play link and paste it into any IPTV player like VLC, GSE Smart IPTV, or TiviMate.</p>
      </div>
      <div class="faq-item">
        <h3>Is ${escapeHtml(channel.name)} free to watch?</h3>
        <p>Yes. You can watch ${escapeHtml(channel.name)} for free using our basic access. For ad-free HD streaming and simultaneous connections, upgrade to a VIP plan.</p>
      </div>
      <div class="faq-item">
        <h3>What players support this stream?</h3>
        <p>This stream works with VLC Media Player, IPTV Smarters Pro, TiviMate, GSE Smart IPTV, Kodi, and any player that supports M3U8 playlist URLs.</p>
      </div>
      <div class="faq-item">
        <h3>Why is the stream buffering or not loading?</h3>
        <p>Free streams may experience intermittent connectivity. Try refreshing the page, switching to a different player, or using the VIP subscription for a more stable HD connection.</p>
      </div>
      </div>
    </section>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "How do I watch ${escapeJs(channel.name)}?", "acceptedAnswer": {"@type": "Answer", "text": "Click the Try Free button to get instant access, or copy the play link and paste it into any IPTV player like VLC, IPTV Smarters, or TiviMate."}},
        {"@type": "Question", "name": "Is ${escapeJs(channel.name)} free to watch?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. You can watch ${escapeJs(channel.name)} for free using our basic access. For ad-free HD streaming and simultaneous connections, upgrade to a VIP plan."}},
        {"@type": "Question", "name": "What players support this stream?", "acceptedAnswer": {"@type": "Answer", "text": "This stream works with VLC Media Player, IPTV Smarters Pro, TiviMate, GSE Smart IPTV, Kodi, and any player that supports M3U8 playlist URLs."}},
        {"@type": "Question", "name": "Why is the stream buffering or not loading?", "acceptedAnswer": {"@type": "Answer", "text": "Free streams may experience intermittent connectivity. Try refreshing the page, switching to a different player, or using the VIP subscription for a more stable HD connection."}}
      ]
    }
    </script>

    <!-- Related Channels -->
    ${relatedChannelsHtml}
  </main>

  <div class="toast" id="toast">Copied to clipboard!</div>

  ${PAGE_FOOTER}
  <script>
    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function playChannel() {
      showToast('Opening player...');
      setTimeout(() => {
        window.location.href = '${origin}/subscription';
      }, 500);
    }

    async function copyPlayLink() {
      const btn = document.querySelector('[onclick="copyPlayLink()"]');
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;

      try {
        // 获取指纹
        const fingerprint = await getFingerprint();

        const token = localStorage.getItem('auth_token');
        const headers = {
          'X-Fingerprint': fingerprint
        };
        if (token) {
          headers['Authorization'] = 'Bearer ' + token;
        }

        const response = await fetch('${origin}/api/play/link?hash=' + encodeURIComponent(CURRENT_CHANNEL_HASH), { headers });
        const data = await response.json();

        if (data.success && data.play_link) {
          // 尝试复制，如果失败使用降级方案
          await copyToClipboardWithFallback(data.play_link);
        } else {
          showToast(data.error || 'Channel unavailable - please try again later');
        }
      } catch (error) {
        console.error('copyPlayLink error:', error);
        showToast('Network error - please check your connection');
      } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
      }
    }

    async function testPlayChannel() {
      const btn = document.querySelector(".btn-test-play");
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;

      try {
        // 间接触发：点击页面的「复制链接」按钮 → 真实流 URL 写到剪贴板 →
        // content-iptv.js 监听到复制按钮 click，300ms 后读剪贴板 → 匹配 stream URL
        // → 自动 window.open(data:text/html) 开简易 HLS 播放器
        //
        // 优点：
        // - 不暴露真实频道 URL 给任何第三方
        // - 不依赖 background / chrome-extension://（这些在 Edge 都有问题）
        // - 完全靠监听剪贴板，跟 chrome-stream-plugin 原生 UX 一致
        const copyBtn = document.querySelector('[onclick="copyPlayLink()"]');
        if (copyBtn) {
          copyBtn.click();
          showToast("Copying link & opening player...");
        } else {
          // 找不到复制按钮 → fallback 直接拷贝公共测试流到剪贴板，让插件检测
          const testStreamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
          await navigator.clipboard.writeText(testStreamUrl);
          console.log("[TestPlay] Copy fallback test stream:", testStreamUrl);
          showToast("Copying test stream & opening player...");
        }
      } catch (error) {
        console.error("testPlayChannel error:", error);
        showToast("Network error");
      } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
      }
    }

    // 统一的复制函数，同时尝试 Clipboard API 和降级方案
    async function copyToClipboardWithFallback(text) {
      // 优先尝试 Modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          showToast('Link copied! Open in your IPTV player.');
          return;
        } catch (err) {
          // Permission denied 或其他错误，使用降级方案
          console.log('Clipboard API failed, using fallback:', err);
        }
      }

      // 降级方案
      fallbackCopy(text);
    }

    // 降级复制方案（兼容旧版浏览器和非安全上下文）
    function fallbackCopy(text) {
      // 方案1：尝试现代 Selection API
      try {
        const selection = window.getSelection();
        const textarea = document.createElement('textarea');
        textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;padding:0;margin:0;opacity:0;width:1px;height:1px;font-size:1px;';
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        // 尝试选中并复制
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (success) {
          showToast('Link copied! Open in your IPTV player.');
          return;
        }
      } catch (e) {
        console.log('Selection API failed:', e);
      }

      // 方案2：直接在可见元素中选中文字
      try {
        const linkSpan = document.createElement('div');
        linkSpan.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden;white-space:nowrap;';
        linkSpan.textContent = text;
        document.body.appendChild(linkSpan);

        const range = document.createRange();
        range.selectNodeContents(linkSpan);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        const success = document.execCommand('copy');
        selection.removeAllRanges();
        document.body.removeChild(linkSpan);

        if (success) {
          showToast('Link copied! Open in your IPTV player.');
          return;
        }
      } catch (e) {
        console.log('Range API failed:', e);
      }

      // 方案3：提示用户手动复制（最后一个选项）
      const displayText = text.length > 80 ? text.substring(0, 80) + '...' : text;
      showToast('Long-press link to copy: ' + displayText);
    }

    function shareChannel() {
      if (navigator.share) {
        navigator.share({
          title: CURRENT_CHANNEL_NAME + ' - IPTV Search',
          text: CURRENT_CHANNEL_NAME + ' live for free!',
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Link copied to clipboard!');
        });
      }
    }

    // Channel detail page specific
    const CURRENT_CHANNEL_HASH = '${escapeJs(hash)}';
    const CURRENT_CHANNEL_NAME = '${escapeJs(channel.name)}';
    const CURRENT_CHANNEL_GROUP = '${escapeJs(channel.group || '')}';

    // Favorites
    const FAVORITES_KEY = 'favorites';
    
    function getFavorites() {
      try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
      } catch { return []; }
    }

    function saveFavorites(favorites) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      localStorage.setItem(FAVORITES_KEY + '_update', Date.now().toString());
    }

    // Dedup favorites by channel_name (defensive against client state drift)
    function dedupFavorites(favs) {
      const seen = {}; const out = [];
      for (const f of (favs || [])) {
        if (!f || !f.name) continue;
        if (seen[f.name]) continue;
        seen[f.name] = true;
        out.push(f);
      }
      return out;
    }

    // Debounced cloud sync: every save schedules a 5-minute timer.
    // Multiple rapid saves coalesce into a single network request.
    let _syncTimer = null;
    function scheduleCloudSync(favorites) {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      if (_syncTimer) clearTimeout(_syncTimer);
      // 立即同步，不再等待 5 分钟
      syncFavoritesToCloud(favorites, true);
    }

    async function syncFavoritesToCloud(favorites) {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      try {
        const res = await fetch('${origin}/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ favorites: dedupFavorites(favorites) })
        });
        if (!res.ok) {
          const text = await res.text();
          console.error('[syncFavoritesToCloud] HTTP', res.status, text);
        }
      } catch (e) {
        console.error('Failed to sync favorites to cloud:', e);
      }
    }

    // Best-effort flush on page unload
    window.addEventListener('beforeunload', () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const favs = dedupFavorites(JSON.parse(localStorage.getItem('favorites') || '[]'));
      if (!favs.length) return;
      try {
        navigator.sendBeacon('${origin}/api/favorites',
          new Blob([JSON.stringify({ favorites: favs })], { type: 'application/json' }));
      } catch (e) { /* ignore */ }
    });

    function toggleChannelStar() {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        showToast({
          type: 'warning',
          title: 'Please log in',
          message: 'Favorites require an account. Log in to sync across devices.<br><a href="/login?redirect=/favorites" style="color:var(--accent);font-weight:600;">Log in / Sign up →</a>'
        });
        return;
      }
      const favorites = getFavorites();
      const index = favorites.findIndex(f => f.hash === CURRENT_CHANNEL_HASH);
      const starBtn = document.getElementById('detailStarBtn');
      const starText = document.getElementById('starText');

      if (index > -1) {
        favorites.splice(index, 1);
        starBtn.classList.remove('btn-favorited');
        starText.textContent = 'Add to Favorites';
        showToast('Removed from favorites');
      } else {
        const logoImg = document.querySelector('.channel-poster-large img');
        const logo = logoImg && logoImg.src ? logoImg.src : '';

        favorites.push({
          name: CURRENT_CHANNEL_NAME,
          hash: CURRENT_CHANNEL_HASH,
          group: CURRENT_CHANNEL_GROUP,
          logo: logo
        });
        starBtn.classList.add('btn-favorited');
        starText.textContent = 'Remove from Favorites';
        showToast('Added to favorites');
      }

      saveFavorites(favorites);
      // 同步到云端（异步，不阻塞 UI）
      scheduleCloudSync(favorites);
    }

    function initDetailStarButton() {
      const token = localStorage.getItem('auth_token');
      const isFavorited = token ? getFavorites().some(f => f.name === CURRENT_CHANNEL_NAME) : false;
      const starBtn = document.getElementById('detailStarBtn');
      const starText = document.getElementById('starText');

      if (!token) {
        starText.textContent = 'Login to Favorite';
        starBtn.disabled = true;
        starBtn.style.opacity = '0.5';
        starBtn.style.cursor = 'not-allowed';
        return;
      }

      if (isFavorited) {
        starBtn.classList.add('btn-favorited');
        starText.textContent = 'Remove from Favorites';
      }
    }

    

    // Initialize star button state
    initDetailStarButton();
  </script>
</body>
</html>`}