// Channel Detail Page - Server-side rendered matching template exactly

export function generateChannelPage(options = {}) {
  const { 
    origin = 'https://iptv-search.com', 
    hash = '',
    channel = null,
    relatedChannels = []
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
    return str
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Build category slug for breadcrumb
  const categorySlug = slugify(channel.group || '');

  // Build logo HTML
  const logoHtml = channel.logo 
    ? '<img src="' + escapeHtml(channel.logo) + '" alt="' + escapeHtml(channel.name) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';this.nextElementSibling.textContent=this.alt.charAt(0)">' +
      '<div class="placeholder" style="display:none"></div>'
    : '<div class="placeholder">' + escapeHtml(channel.name.charAt(0)) + '</div>';

  // Build channel meta badge
  const sourceDisplay = channel.sourceName || 'Unknown';
  
  // Build stats - category and updated
  const statsHtml = 
    '<div class="stat">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>' +
      '<span>' + escapeHtml(channel.group || 'Other') + '</span>' +
    '</div>' +
    '<div class="stat">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>' +
      '<span>Updated daily</span>' +
    '</div>';

  // Build action buttons
  const actionButtonsHtml =
    '<a href="' + origin + '/plans" class="btn btn-primary">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>' +
      'Get Subscription' +
    '</a>' +
    '<button class="btn btn-secondary" id="detailStarBtn" onclick="toggleChannelStar()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
      '<span id="starText">Add to Favorites</span>' +
    '</button>' +

    '<button class="btn btn-secondary" onclick="copyPlayLink()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' +
      'Copy Link' +
    '</button>';

  // Build info card rows
  const infoRowsHtml =
    '<div class="info-row">' +
      '<span class="info-label">Channel Name</span>' +
      '<span class="info-value">' + escapeHtml(channel.name) + '</span>' +
    '</div>' +
    '<div class="info-row">' +
      '<span class="info-label">Category</span>' +
      '<span class="info-value"><a href="' + origin + '/category/' + encodeURIComponent(categorySlug) + '" style="color: var(--accent)">' + escapeHtml(channel.group || 'Other') + '</a></span>' +
    '</div>' +
    '<div class="info-row">' +
      '<span class="info-label">Country/Region</span>' +
      '<span class="info-value">China</span>' +
    '</div>' +
    
    '<div class="info-row">' +
      '<span class="info-label">Last Updated</span>' +
      '<span class="info-value">' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + '</span>' +
    '</div>';

  // Build related channels grid
  let relatedChannelsHtml = '';
  if (relatedChannels.length > 0) {
    relatedChannelsHtml = '<section class="related-section">' +
      '<h2>More from ' + escapeHtml(channel.group || 'This Category') + '</h2>' +
      '<div class="related-grid">' +
      relatedChannels.map(ch => {
        const chLogo = ch.logo 
          ? '<img src="' + escapeHtml(ch.logo) + '" alt="' + escapeHtml(ch.name) + '" onerror="this.style.display=\'none\'">' +
            '<div class="placeholder" style="display:none">📺</div>'
          : '<div class="placeholder">📺</div>';
        return '<div class="related-card" onclick="location.href=\'' + origin + '/channel/' + ch.hash + '\'">' +
          chLogo +
          '<div class="related-card-info">' +
            '<div class="related-card-name">' + escapeHtml(ch.name) + '</div>' +
            '<div class="related-card-group">' + escapeHtml(ch.group || '') + '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
      '</div></section>';
  }

  // JSON-LD for SEO
  const jsonLd1 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": channel.name + " - Live TV",
    "description": "Watch " + channel.name + " live streaming for free on IPTV Search. " + channel.group + " category.",
    "thumbnailUrl": channel.logo || null,
    "image": channel.logo || null,
    "contentUrl": channel.playUrl || origin + "/play/" + hash,
    "embedUrl": channel.playUrl || origin + "/play/" + hash,
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
        {"@type": "ListItem", "position": 3, "name": channel.name, "item": origin + "/channel/" + hash}
      ]
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(channel.name)} | IPTV Search</title>
  <meta name="description" content="Watch ${escapeHtml(channel.name)} live. Free IPTV streaming. No registration required.">
  <link rel="canonical" href="${origin}/channel/${hash}">
  <meta property="og:url" content="${origin}/channel/${hash}">
  <meta property="og:title" content="${escapeHtml(channel.name)} - Watch Live">
  <meta property="og:description" content="Watch ${escapeHtml(channel.name)} live streaming for free">
  ${channel.logo ? '<meta property="og:image" content="' + escapeHtml(channel.logo) + '">' : ''}
  <meta property="og:type" content="video.other">
  
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
   
  <script>
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
   
  <style>
    :root {
      --bg-primary: #0a0a0a;
      --bg-secondary: #141414;
      --bg-card: #1a1a1a;
      --bg-hover: #252525;
      --text-primary: #ffffff;
      --text-secondary: #a0a0a0;
      --text-muted: #666666;
      --accent: #e50914;
      --accent-hover: #f6121d;
      --border: rgba(255,255,255,0.08);
      --border-hover: rgba(255,255,255,0.15);
      --shadow: 0 4px 20px rgba(0,0,0,0.5);
      --radius: 12px;
      --transition: 0.2s ease;
    }

    [data-theme="light"] {
      --bg-primary: #f5f5f5;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      --bg-hover: #f0f0f0;
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: rgba(0,0,0,0.08);
      --border-hover: rgba(0,0,0,0.15);
      --shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }
    button { cursor: pointer; font-family: inherit; }

    /* Header - Consistent with home page */
    .header { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
    .logo-icon svg { width: 36px; height: 36px; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
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
    .breadcrumb { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); overflow-x: auto; white-space: nowrap; scrollbar-width: none; -ms-overflow-style: none; }
    .breadcrumb::-webkit-scrollbar { display: none; }
    .breadcrumb a { color: var(--accent); display: flex; align-items: center; gap: 0.25rem; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb-sep { opacity: 0.5; margin: 0 0.1rem; }
    .breadcrumb-icon { width: 14px; height: 14px; }

    /* Main Content */
    .main-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }

    /* Channel Hero */
    .channel-hero { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; margin-bottom: 2rem; }
    .channel-poster-large { aspect-ratio: 16/10; background: var(--bg-card); border-radius: var(--radius); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .channel-poster-large img { width: 100%; height: 100%; object-fit: contain; padding: 2rem; }
    .channel-poster-large .placeholder { font-size: 4rem; opacity: 0.3; background: var(--bg-hover); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: var(--radius); }
    .channel-details { display: flex; flex-direction: column; justify-content: center; }
    .channel-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .channel-badge { padding: 0.3rem 0.8rem; background: var(--accent); border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .channel-source { font-size: 0.85rem; color: var(--text-muted); }
    .channel-title { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .channel-subtitle { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1rem; }
    .channel-stats { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
    .stat { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); }
    .stat-icon { font-size: 1rem; }

    /* Action Buttons */
    .action-buttons { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem; border-radius: var(--radius); font-size: 1rem; font-weight: 600; border: none; transition: all var(--transition); }
    .btn-primary { background: var(--accent); color: white; }
    .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
    .btn-secondary { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); }
    .btn-secondary:hover { background: var(--bg-hover); border-color: var(--border-hover); }
    .btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-favorited { border-color: var(--accent) !important; }
    .btn-favorited svg { fill: var(--accent); }

    /* Spinner */
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Info Card */
    .info-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem; }
    .info-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-secondary); }
    .info-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: var(--text-muted); font-size: 0.9rem; }
    .info-value { font-weight: 500; font-size: 0.9rem; }

    /* How to Watch */
    .how-to-watch { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem; }
    .how-to-watch h3 { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
    .watch-option { margin-bottom: 1.5rem; }
    .watch-option:last-child { margin-bottom: 0; }
    .option-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 1rem; }
    .option-icon { font-size: 1.25rem; }
    .option-header h4 { font-size: 1rem; font-weight: 600; margin: 0; }
    .option-steps { padding-left: 0.5rem; }
    .step { display: flex; gap: 1rem; margin-bottom: 0.75rem; align-items: flex-start; }
    .step:last-child { margin-bottom: 0; }
    .step-number { width: 24px; height: 24px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
    .step-content h4 { font-size: 0.9rem; margin-bottom: 0.2rem; }
    .step-content h4 a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
    .step-content h4 a:hover { text-decoration: none; }
    .step-content p { font-size: 0.8rem; color: var(--text-secondary); }
    .step-content p a { color: var(--accent); font-weight: 500; }
    .step-content p a:hover { text-decoration: underline; }

    /* Related Channels */
    .related-section { margin-top: 3rem; }
    .related-section h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
    .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .related-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.75rem; display: flex; gap: 0.75rem; align-items: center; transition: all var(--transition); cursor: pointer; }
    .related-card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .related-card img { width: 48px; height: 48px; object-fit: contain; border-radius: 4px; }
    .related-card .placeholder { width: 48px; height: 48px; background: var(--bg-secondary); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; opacity: 0.3; }
    .related-card-info { flex: 1; min-width: 0; }
    .related-card-name { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .related-card-group { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Copy Toast */
    .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--accent); color: white; padding: 1rem 2rem; border-radius: var(--radius); font-weight: 600; opacity: 0; transition: all 0.3s ease; z-index: 1000; }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    /* Footer */
    .page-footer { background: var(--bg-secondary); border-top: 1px solid var(--border); padding: 2.5rem 1.25rem; margin-top: 3rem; }
    .footer-content { max-width: 1000px; margin: 0 auto; text-align: center; }
    .footer-copyright { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1.25rem; }
    .footer-links { display: flex; justify-content: center; align-items: center; gap: 1.25rem; flex-wrap: wrap; margin-top: 1rem; font-size: 0.75rem; }
    .footer-links a { color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .footer-links a:hover { color: var(--text-primary); }
    .footer-badges { display: flex; align-items: center; justify-content: center; gap: 0.625rem; margin-top: 1.25rem; }
    .footer-badges img { height: 12px; width: auto; opacity: 0.8; transition: opacity var(--transition); }
    .footer-badges img:hover { opacity: 1; }
    .footer-badges span { font-size: 0.75rem; color: var(--text-secondary); }
    .footer-disclaimer { margin-top: 1rem; font-size: 0.7rem; color: var(--text-muted); line-height: 1.5; max-width: 600px; margin-left: auto; margin-right: auto; }

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
      .breadcrumb { padding: 0.75rem 1rem; font-size: 0.8rem; }
      .breadcrumb-text { display: none; }
      .breadcrumb-icon { width: 16px; height: 16px; }
      .breadcrumb-sep { font-size: 1rem; }
      .breadcrumb-current { font-size: 0.8rem; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .breadcrumb-cat { max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .main-container { padding: 1rem; }
      .channel-hero { grid-template-columns: 1fr; gap: 1.5rem; }
      .channel-poster-large { aspect-ratio: 16/10; }
      .channel-poster-large img { padding: 1.5rem; }
      .channel-details { text-align: center; }
      .channel-meta { justify-content: center; flex-wrap: wrap; gap: 0.5rem; }
      .channel-title { font-size: 1.5rem; }
      .channel-subtitle { font-size: 1rem; }
      .channel-stats { justify-content: center; flex-wrap: wrap; gap: 1rem; }
      .action-buttons { flex-direction: column; gap: 0.75rem; }
      .action-buttons .btn { width: 100%; justify-content: center; padding: 0.75rem 1rem; }
      .info-card { padding: 1rem; }
      .info-row { padding: 0.5rem 0; font-size: 0.85rem; }
      .how-to-watch { padding: 1rem; }
      .option-header { flex-direction: column; text-align: center; gap: 0.5rem; padding: 0.75rem; }
      .option-steps { padding-left: 0; }
      .step { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
      .step-number { width: 28px; height: 28px; font-size: 0.8rem; }
      .related-section { margin-top: 2rem; }
      .related-section h2 { font-size: 1.1rem; }
      .related-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
      .related-card { padding: 0.5rem; gap: 0.5rem; }
      .related-card img, .related-card .placeholder { width: 36px; height: 36px; }
      .related-card-name { font-size: 0.8rem; }
      .related-card-group { font-size: 0.7rem; }
      .toast { bottom: 1rem; padding: 0.75rem 1.5rem; font-size: 0.85rem; }
      .page-footer { padding: 1.5rem 0.75rem; }
      .footer-links { font-size: 0.7rem; gap: 0.75rem; }
    }

    @media (max-width: 480px) {
      .logo-text { display: none; }
      .search-box { width: 100%; order: 3; margin-top: 0; }
      .channel-hero { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
      .channel-poster-large { width: 80px; height: 80px; }
      .channel-poster-large .placeholder { font-size: 2rem; }
      .channel-title { font-size: 1.25rem; }
      .channel-subtitle { font-size: 0.85rem; }
      .channel-badge { font-size: 0.7rem; padding: 0.25rem 0.6rem; }
      .action-buttons .btn { padding: 0.65rem 0.75rem; font-size: 0.85rem; }
      .info-card h3 { font-size: 0.9rem; }
      .how-to-watch h3 { font-size: 0.95rem; }
      .option-header h4 { font-size: 0.9rem; }
      .related-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <a href="${origin}/" class="logo">
        <div class="logo-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ff3b30;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="36" height="36" rx="6" fill="url(#tvGradient)" />
            <rect x="4" y="8" width="28" height="18" rx="2" fill="#0a0a0a" />
            <path d="M14 12 L24 17 L14 22 Z" fill="#fff" />
            <rect x="10" y="28" width="6" height="3" rx="1" fill="#0a0a0a" />
            <rect x="20" y="28" width="6" height="3" rx="1" fill="#0a0a0a" />
          </svg>
        </div>
        <div class="logo-text">IPTV<span>Search</span></div>
      </a>
      <div class="search-box">
        <form action="${origin}/search" method="get">
          <input type="text" name="q" placeholder="Search channels..." value="">
        </form>
      </div>
      <div class="header-actions">
        <a href="${origin}/favorites" class="pill-btn" title="My Favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </a>
        <a href="${origin}/plans" class="pill-btn" title="Subscription Plans">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </a>
        <button class="theme-toggle" id="themeToggle" title="Toggle theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>
        <a href="${origin}/account" class="account-btn" title="My Account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
        <div id="translate"></div>
      </div>
    </div>
  </header>

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

  <main class="main-container">
    <!-- Channel Hero -->
    <div class="channel-hero">
      <div class="channel-poster-large">
        ${logoHtml}
      </div>
      <div class="channel-details">
        <div class="channel-meta">
          <span class="channel-badge">LIVE</span>
    
        </div>
        <h1 class="channel-title">${escapeHtml(channel.name)}</h1>
        <p class="channel-subtitle">China Central Television - ${escapeHtml(channel.group || 'General Channel')}</p>
        
        <div class="channel-stats">
          ${statsHtml}
        </div>

        <div class="action-buttons">
          ${actionButtonsHtml}
        </div>
      </div>
    </div>

    <!-- Info Card -->
    <div class="info-card">
      <h3>Channel Information</h3>
      ${infoRowsHtml}
    </div>

    <!-- How to Watch -->
    <div class="how-to-watch">
      <h3>How to Watch</h3>
      
      <!-- Option 1: Subscription (Primary) -->
      <div class="watch-option">
        <div class="option-header">
          <span class="option-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
          <h4>Option 1: Get Subscription (Recommended)</h4>
        </div>
        <div class="option-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4><a href="${origin}/plans">Choose a Plan</a></h4>
              <p>Get instant access to all channels with your personal playlist URL.</p>
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

    <!-- Related Channels -->
    ${relatedChannelsHtml}
  </main>

  <div class="toast" id="toast">Copied to clipboard!</div>

  <footer class="page-footer">
    <div class="footer-content">
      <p class="footer-copyright">&copy; ${new Date().getFullYear()} IPTV Search. Free IPTV Channel Directory & Search Tool</p>
      
      <div class="footer-links">
        <a href="${origin}/tutorial">How to Watch on TV Devices</a>
        <a href="${origin}/sitemap.xml">Sitemap</a>
        <a href="${origin}/robots.txt">Robots</a>
        <a href="${origin}/privacy-policy">Privacy Policy</a>
        <a href="${origin}/terms">Terms of Service</a>
        <a href="mailto:support@iptv-search.com">Contact Us</a>
      </div>
      
      <div class="footer-badges">
        <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">
          <img src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/CHOl0sUhrumCxOXfRotGt/081f81d52274080b2d026fdf163e3009/cloudflare-icon-color_3x.png" alt="Cloudflare">
        </a>
        <span>This site is powered by Cloudflare for acceleration and security</span>
      </div>
      
      <div class="footer-disclaimer">
        All streaming links on this site are sourced from the public internet. This site does not produce or store any content. For copyright or content issues, please contact the actual content provider.
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    function initTranslate() {
      if (typeof translate !== 'undefined' && translate.language) {
        translate.selectLanguageTag.show = true;
        translate.selectLanguageTag.documentId = 'translate';
        translate.language.setLocal('english');
        translate.service.use('client.edge');
        translate.listener.start();
        translate.setAutoDiscriminateLocalLanguage();
        translate.execute();
      } else {
        setTimeout(initTranslate, 100);
      }
    }
    initTranslate();
  </script>
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
        window.location.href = '${origin}/freesub';
      }, 500);
    }

    function copyPlayLink() {
      const btn = document.querySelector('[onclick="copyPlayLink()"]');
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;

      fetch('${origin}/api/play/link?hash=' + encodeURIComponent(CURRENT_CHANNEL_HASH))
        .then(response => response.json())
        .then(data => {
          if (data.success && data.play_link) {
            navigator.clipboard.writeText(data.play_link).then(() => {
              showToast('Play link copied! Please use a player like VLC for playback.', 'success');
            }).catch(() => {
              showToast('Failed to copy link');
            });
          } else {
            showToast('Failed to get play link');
          }
        })
        .catch(error => {
          console.error('copyPlayLink error:', error);
          showToast('Channel unavailable');
        })
        .finally(() => {
          btn.innerHTML = originalContent;
          btn.disabled = false;
        });
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

    function toggleChannelStar() {
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
          hash: CURRENT_CHANNEL_HASH,
          name: CURRENT_CHANNEL_NAME,
          group: CURRENT_CHANNEL_GROUP,
          logo: logo
        });
        starBtn.classList.add('btn-favorited');
        starText.textContent = 'Remove from Favorites';
        showToast('Added to favorites');
      }
      
      saveFavorites(favorites);
    }

    function initDetailStarButton() {
      const favorites = getFavorites();
      const isFavorited = favorites.some(f => f.hash === CURRENT_CHANNEL_HASH);
      const starBtn = document.getElementById('detailStarBtn');
      const starText = document.getElementById('starText');
      
      if (isFavorited) {
        starBtn.classList.add('btn-favorited');
        starText.textContent = 'Remove from Favorites';
      }
    }

    const themeToggle = document.getElementById('themeToggle');
    const sunSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    const moonSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeToggle.innerHTML = next === 'dark' ? moonSVG : sunSVG;
    });
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? moonSVG : sunSVG;

    // Initialize star button state
    initDetailStarButton();
  </script>
</body>
</html>`;
}
