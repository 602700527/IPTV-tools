// SEO 页面处理器 - 生成静态 HTML
// 支持 Workers runtime 和 CLI 环境

import { getAllChannels, getAllGroups } from '../utils/channel-cache.js';
import { getDB } from '../database.js';

// HTML 转义
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// 属性转义
function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Slugify: 将字符串转换为 URL 友好的 slug
// 支持中文、英文、数字、emoji 和连字符
function slugify(str) {
  if (!str) return '';
  return str
    .trim()
    .replace(/\s+/g, '-')  // 空格转连字符
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')  // 保留中文、英文、数字、emoji和连字符
    .replace(/-+/g, '-')   // 多个连字符合并
    .replace(/^-+|-+$/g, '');  // 去除首尾连字符
}

// 生成频道卡片 HTML - 完全匹配模板
function generateChannelCard(channel, origin) {
  const hash = escapeAttr(channel.channel_hash || '');
  const name = escapeHtml(channel.channel_name || 'Unknown');
  const group = escapeHtml(channel.group_title || 'Other');
  const logo = channel.logo ? escapeAttr(channel.logo) : '';
  const channelUrl = `${origin}/channel/${hash}`;

  return `<div class="channel-card" onclick="location.href='${channelUrl}'">
  <div class="channel-checkbox" onclick="toggleCheckbox(event, this)"></div>
  <button class="star-btn not-starred" onclick="toggleStar(event, this, '${hash}', '${name.replace(/'/g, '\\\'')}', '${group.replace(/'/g, '\\\'')}')">☆</button>
  <div class="channel-poster">
    ${logo ? `<img src="${logo}" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
    <div class="placeholder" style="display:${logo ? 'none' : 'flex'}">📺</div>
    <div class="channel-overlay"><button class="play-btn">▶ Play</button></div>
  </div>
  <div class="channel-info">
    <div class="channel-name">${name}</div>
    <div class="channel-group">${group}</div>
  </div>
</div>`;
}

// 生成频道网格 HTML
function generateChannelGrid(channels, origin) {
  return channels.map(ch => generateChannelCard(ch, origin)).join('\n');
}

// 生成侧边栏分组项 HTML
function generateSidebarItem(group, count, origin, isActive = false) {
  const slug = slugify(group);
  const href = `${origin}/category/${slug}`;
  return `<li class="sidebar-item${isActive ? ' active' : ''}">
  <a href="${href}">
    <span>${escapeHtml(group)}</span>
    <span class="sidebar-count">${count}</span>
  </a>
</li>`;
}

// 生成首页 HTML - 完全匹配 static-preview/homepage.html 模板
/**
 * 生成首页 HTML
 * @param {Object} options - 配置选项
 * @param {string} options.origin - 网站 origin (如 https://iptv-search.com)
 * @param {Object} options.env - Workers 环境变量 (可选, CLI 模式可不传)
 * @param {number} options.limit - 限制显示的频道数量 (默认 100)
 * @returns {Promise<string>} 生成的 HTML 字符串
 */
export async function generateSEOHomepage(options = {}) {
  const { origin = 'https://iptv-search.com', env, limit = 100 } = options;

  let channels = [];
  let groups = [];
  let totalChannels = 0;
  let totalGroups = 0;

  // 在 CLI 环境下直接使用 D1
  if (!env || !env.KV) {
    try {
      const db = getDB();
      
      // Get total counts first (without LIMIT)
      const totalCountResult = await db.prepare(`
        SELECT COUNT(*) as total FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
      `).first();
      totalChannels = totalCountResult?.total || 0;

      const totalGroupsResult = await db.prepare(`
        SELECT COUNT(DISTINCT c.group_title) as total FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
          AND c.group_title IS NOT NULL AND c.group_title != ''
      `).first();
      totalGroups = totalGroupsResult?.total || 0;

      // Get channels with LIMIT for display
      const channelsResult = await db.prepare(`
        SELECT c.id, c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
        ORDER BY c.channel_name
        LIMIT ?
      `).bind(limit).all();
      channels = channelsResult.results || [];

      // Get groups with counts
      const groupsResult = await db.prepare(`
        SELECT c.group_title, COUNT(*) as count
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
          AND c.group_title IS NOT NULL AND c.group_title != ''
        GROUP BY c.group_title
        ORDER BY c.group_title
      `).all();
      groups = (groupsResult.results || []).map(r => ({
        name: r.group_title,
        count: r.count
      }));
    } catch (error) {
      console.error('[SEO] CLI mode D1 query error:', error);
    }
  } else {
    const [channelsResult, groupsResult] = await Promise.all([
      getAllChannels(env),
      getAllGroups(env)
    ]);
    const allChannels = channelsResult.channels || [];
    totalChannels = allChannels.length;
    channels = allChannels.slice(0, limit);
    
    // In KV mode, groups don't have counts - calculate from all channels
    const allGroupsObj = {};
    allChannels.forEach(ch => {
      if (ch.group_title) {
        allGroupsObj[ch.group_title] = (allGroupsObj[ch.group_title] || 0) + 1;
      }
    });
    totalGroups = Object.keys(allGroupsObj).length;
    groups = Object.entries(allGroupsObj).map(([name, count]) => ({ name, count }));
    groups.sort((a, b) => a.name.localeCompare(b.name));
  }

  // 生成分类卡片 - 用于首页展示
  const categorySVGs = {
    'cctv': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 19h10M12 19v-3"/></svg>',
    'sports': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9z"/><path d="M2 12h20M12 2c2.5 2 4 5 4 10s-1.5 8-4 10c-2.5-2-4-5-4-10s1.5-8 4-10z"/></svg>',
    'news': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M18 18h-8M10 6h4M10 10h4M10 14h4"/></svg>',
    'entertainment': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20M10 4v4M14 4v4"/></svg>',
    'movie': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2.5"/><path d="M2 7l5 3-5 3V7zM12 4v13M22 7l-5 3 5 3V7z"/></svg>',
    'music': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    'kids': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>',
    'documentary': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    'regional': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
    'international': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10zM12 2v20"/></svg>',
    'hd': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 9l2 3-2 3M14 15h3M14 9h3"/></svg>',
    '4k': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 15h3v-6H7v6zM11.5 15h2l1-3 1 3zM16 15h2M18 12h1.5"/></svg>',
    'weather': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/><circle cx="12" cy="12" r="4"/></svg>',
    'lifestyle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    'education': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    'religious': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M4 6h16M4 18h16"/></svg>',
    'shopping': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>',
    'other': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 19h10M12 19v-3"/></svg>'
  };
  
  const sidebarItemsHtml = groups.slice(0, 20).map((g, idx) => {
    const count = g.count;
    const slug = slugify(g.name);
    const svgIcon = categorySVGs[slug.toLowerCase()] || categorySVGs['other'];
    return `<a href="${origin}/category/${encodeURIComponent(slug)}" class="category-card">
      <span class="category-icon">${svgIcon}</span>
      <span class="category-name">${escapeHtml(g.name)}</span>
      <span class="category-count">${count} channels</span>
    </a>`;
  }).join('\n');

  // 生成频道卡片 - 分类页使用
  const channelCardsHtml = channels.map(ch => {
    const hash = escapeAttr(ch.channel_hash || '');
    const name = escapeHtml(ch.channel_name || 'Unknown');
    const group = escapeHtml(ch.group_title || 'Other');
    const logo = ch.logo ? escapeAttr(ch.logo) : '';
    const channelUrl = `/channel/${hash}`;
    return `<div class="channel-card" onclick="location.href='${channelUrl}'">
  <button class="star-btn not-starred" onclick="toggleStar(event, this, '${hash}', '${name.replace(/'/g, "\\'")}', '${group.replace(/'/g, "\\'")}')">☆</button>
  <div class="channel-poster">
    ${logo ? `<img src="${logo}" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
    <div class="placeholder" style="display:${logo ? 'none' : 'flex'}">📺</div>
    <div class="channel-overlay">
      <button class="play-btn">▶ Play</button>
    </div>
  </div>
  <div class="channel-info">
    <div class="channel-name">${name}</div>
    <div class="channel-group">${group}</div>
  </div>
</div>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IPTV Search - Free Live TV Channel Directory</title>
  <meta name="description" content="Discover 10,000+ free live TV channels. Search by category, country, or genre. Start watching instantly - no signup required!">
  <meta name="keywords" content="free iptv, live tv, streaming channels, watch tv online, iptv m3u, tv channel list">
  <link rel="canonical" href="${origin}/">
  <meta property="og:title" content="IPTV Search - Free Live TV Channel Directory">
  <meta property="og:description" content="Discover 10,000+ free live TV channels. Search by category, country, or genre. Start watching instantly - no signup required!">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/">
  <meta property="og:image" content="${origin}/og-image.png">
  
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
      --radius: 8px;
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
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; transition: background var(--transition), color var(--transition); }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }
    button { cursor: pointer; font-family: inherit; }

    .header { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; }
    .logo-icon { width: 36px; height: 36px; }
    .logo-icon svg { width: 100%; height: 100%; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1rem; }

    .search-box { position: relative; width: 300px; }
    .search-box input { width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; color: var(--text-primary); font-size: 0.9rem; outline: none; transition: border-color var(--transition); }
    .search-box input:focus { border-color: var(--accent); }
    .search-box::before { content: "🔍"; position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); font-size: 0.9rem; opacity: 0.5; }

    .header-actions .pill-btn span,
    .header-actions .account-btn span { display: none; }
    .pill-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .pill-btn:hover { color: var(--accent); }
    .pill-btn.active { color: var(--accent); }
    .account-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .account-btn:hover { color: var(--accent); }
    .account-btn svg,
    .pill-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

    .theme-toggle { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; color: var(--text-secondary); cursor: pointer; transition: color var(--transition); border: none; }
    .theme-toggle:hover { color: var(--accent); }

    #translate { position: relative; display: inline-flex; align-items: center; }
    #translateSelectLanguage { appearance: none; -webkit-appearance: none; padding: 0.5rem 2rem 0.5rem 0.75rem; background: transparent; border: none; border-radius: 6px; color: var(--text-secondary); font-size: 0.85rem; cursor: pointer; outline: none; transition: color var(--transition); min-width: 80px; }
    #translateSelectLanguage:focus { color: var(--accent); }
    #translateSelectLanguage:hover { color: var(--accent); }
    #translate::after { content: ""; position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--text-secondary); pointer-events: none; }
    #translate:hover::after { border-top-color: var(--accent); }

    .hero { background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%); padding: 4rem 2rem; text-align: center; border-bottom: 1px solid var(--border); }
    .hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; background: linear-gradient(135deg, #fff 0%, #999 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    [data-theme="light"] .hero h1 { background: linear-gradient(135deg, #1a1a1a 0%, #666 100%); -webkit-background-clip: text; background-clip: text; }
    .hero p { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem; }
    .hero-stats { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
    .hero-stat { text-align: center; }
    .hero-stat-value { font-size: 2rem; font-weight: 700; color: var(--accent); }
    .hero-stat-label { font-size: 0.85rem; color: var(--text-muted); }

    .category-showcase { max-width: 1400px; margin: 0 auto; padding: 3rem 2rem; }
    .showcase-header { text-align: center; margin-bottom: 2.5rem; }
    .showcase-header h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
    .showcase-header p { color: var(--text-secondary); font-size: 1rem; }

    .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; }
    .category-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; text-decoration: none; transition: all 0.25s ease; cursor: pointer; position: relative; overflow: hidden; }
    .category-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, var(--accent) 0%, transparent 100%); opacity: 0; transition: opacity 0.25s ease; }
    .category-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(229, 9, 20, 0.15); }
    .category-card:hover::before { opacity: 0.08; }
    .category-icon { width: 40px; height: 40px; margin-bottom: 0.75rem; color: var(--accent); }
    .category-icon svg { width: 100%; height: 100%; }
    .category-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; text-align: center; }
    .category-count { font-size: 0.75rem; color: var(--text-muted); text-align: center; }

    @media (max-width: 768px) {
      .category-showcase { padding: 2rem 1rem; }
      .category-grid { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
      .category-card { padding: 1rem 0.5rem; }
      .category-icon { width: 32px; height: 32px; }
      .category-name { font-size: 0.8rem; }
      .category-count { font-size: 0.7rem; }
      .showcase-header h2 { font-size: 1.5rem; }
    }

    @media (max-width: 480px) {
      .category-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
      .category-card { padding: 0.75rem 0.5rem; }
      .category-icon { font-size: 1.75rem; }
    }

    .content-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .section-title { font-size: 1.25rem; font-weight: 600; }
    .channel-count { color: var(--text-muted); font-weight: 400; font-size: 1rem; }

    .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
    .channel-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all var(--transition); cursor: pointer; position: relative; }
    .channel-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow); }
    .star-btn { position: absolute; top: 0.5rem; right: 0.5rem; width: 32px; height: 32px; background: rgba(0,0,0,0.6); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; cursor: pointer; transition: all var(--transition); z-index: 10; opacity: 0; }
    .channel-card:hover .star-btn { opacity: 1; }
    .star-btn:hover { background: rgba(0,0,0,0.8); transform: scale(1.1); }
    .star-btn.starred { color: #fbbf24; opacity: 1; }
    .star-btn.not-starred { color: rgba(255,255,255,0.5); }
    .channel-poster { aspect-ratio: 16/10; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .channel-poster img { width: 100%; height: 100%; object-fit: contain; padding: 1rem; }
    .channel-poster .placeholder { font-size: 3rem; opacity: 0.3; }
    .channel-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%); opacity: 0; transition: opacity var(--transition); display: flex; align-items: flex-end; justify-content: center; padding: 1rem; }
    .channel-card:hover .channel-overlay { opacity: 1; }
    .play-btn { padding: 0.5rem 1.5rem; background: var(--accent); border: none; border-radius: 20px; color: white; font-size: 0.85rem; font-weight: 600; transform: translateY(10px); transition: transform var(--transition); }
    .channel-card:hover .play-btn { transform: translateY(0); }
    .channel-info { padding: 0.75rem; }
    .channel-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .channel-group { font-size: 0.75rem; color: var(--text-muted); }

    .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem 2rem; font-size: 0.9rem; box-shadow: var(--shadow); transition: transform 0.3s ease; z-index: 1000; }
    .toast.show { transform: translateX(-50%) translateY(0); }

    .page-footer { background: var(--bg-secondary); border-top: 1px solid var(--border); padding: 2.5rem 1.25rem; margin-top: 3rem; }
    .footer-content { max-width: 1000px; margin: 0 auto; text-align: center; }
    .footer-copyright { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem; }
    .footer-links { display: flex; justify-content: center; align-items: center; gap: 1.25rem; flex-wrap: wrap; font-size: 0.75rem; }
    .footer-links a { color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .footer-links a:hover { color: var(--text-primary); }
    .footer-badges { display: flex; align-items: center; justify-content: center; gap: 0.625rem; margin-top: 1.25rem; }
    .footer-badges img { height: 12px; width: auto; opacity: 0.8; transition: opacity var(--transition); }
    .footer-badges img:hover { opacity: 1; }
    .footer-badges span { font-size: 0.75rem; color: var(--text-secondary); }
    .footer-disclaimer { margin-top: 1rem; font-size: 0.7rem; color: var(--text-muted); line-height: 1.5; max-width: 600px; margin-left: auto; margin-right: auto; }

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
      .account-btn span { display: none; }
      .main-container { padding: 1rem; }
      .channel-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
    }
    @media (max-width: 480px) {
      .header-inner { justify-content: space-between; }
      .logo-text { display: none; }
      .search-box { width: 100%; order: 3; margin-top: 0.5rem; }
      .hero { padding: 1.5rem 0.75rem; }
      .hero h1 { font-size: 1.5rem; }
      .hero p { font-size: 0.95rem; }
      .hero-stats { gap: 1rem; }
      .main-container { padding: 0.75rem; }
      .channel-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
      .channel-info { padding: 0.5rem; }
      .channel-name { font-size: 0.8rem; }
      .page-footer { padding: 1.5rem 0.75rem; }
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
        <form action="${origin}/search" method="get" style="display:flex">
          <input type="text" name="q" placeholder="Search channels (CCTV, ESPN, HBO...)" value="">
        </form>
      </div>
      
      <div class="header-actions">
        <a href="${origin}/favorites" class="pill-btn" title="My Favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span>Favorites</span>
        </a>
        <a href="${origin}/plans" class="pill-btn" title="Subscription Plans">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <span>Plans</span>
        </a>
        <button class="theme-toggle" id="themeToggle" title="Toggle theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>
        <a href="${origin}/account" class="account-btn" title="My Account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Account</span>
        </a>
        <div id="translate"></div>
      </div>
    </div>
  </header>

  <section class="hero">
    <h1>Find & Watch Free Live TV</h1>
    <p>Free IPTV Search Engine. Find Live TV Streams, M3U Playlists & HD Channels.</p>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-value">${totalChannels >= 10000 ? '10,000+' : totalChannels.toLocaleString()}+</div>
        <div class="hero-stat-label">Channels</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-value">${totalGroups >= 100 ? '100+' : totalGroups}+</div>
        <div class="hero-stat-label">Categories</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-value">50+</div>
        <div class="hero-stat-label">Countries</div>
      </div>
    </div>
  </section>

  <section class="category-showcase">
    <div class="showcase-header">
      <h2>Explore Free Live TV Channels by Category</h2>
      <p>Browse thousands of free IPTV streams organized by genre, country, and content type</p>
    </div>
    <div class="category-grid">
      ${sidebarItemsHtml}
    </div>
  </section>

  <div class="toast" id="toast"></div>

  <footer class="page-footer">
    <div class="footer-content">
      <p class="footer-copyright">&copy; ${new Date().getFullYear()} IPTV Search. Free IPTV Channel Directory & Search Tool</p>
      <div class="footer-links">
        <a href="${origin}/tutorial">How to Watch on TV Devices</a>
        <a href="${origin}/sitemap.xml">Sitemap</a>
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
      <div class="footer-disclaimer">All streaming links on this site are sourced from the public internet. This site does not produce or store any content. For copyright or content issues, please contact the actual content provider.</div>
    </div>
  </footer>

  <script>
    const FAVORITES_KEY = 'iptv_favorites';
    
    function getFavorites() {
      try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; } catch { return []; }
    }
    
    function saveFavorites(favorites) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      localStorage.setItem(FAVORITES_KEY + '_update', Date.now().toString());
    }

    function toggleStar(event, btn, channelHash, channelName, groupTitle) {
      event.stopPropagation();
      const favorites = getFavorites();
      const index = favorites.findIndex(f => f.channel_hash === channelHash);
      
      if (index > -1) {
        favorites.splice(index, 1);
        btn.classList.remove('starred');
        btn.classList.add('not-starred');
        btn.textContent = '☆';
        showToast('Removed from favorites');
      } else {
        favorites.push({ channel_hash: channelHash, channel_name: channelName, group_title: groupTitle });
        btn.classList.remove('not-starred');
        btn.classList.add('starred');
        btn.textContent = '★';
        showToast('Added to favorites');
      }
      saveFavorites(favorites);
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function initStarButtons() {
      const favorites = getFavorites();
      document.querySelectorAll('.star-btn').forEach(btn => {
        const channelHash = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        const isFavorited = favorites.some(f => f.channel_hash === channelHash);
        if (isFavorited) {
          btn.classList.remove('not-starred');
          btn.classList.add('starred');
          btn.textContent = '★';
        }
      });
    }
    initStarButtons();

    document.getElementById('themeToggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  </script>

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
      } else { setTimeout(initTranslate, 100); }
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initTranslate); } else { initTranslate(); }
  </script>
</body>
</html>`;

  return html;
}

// 生成分类页 HTML
/**
 * 生成分类页 HTML
 * @param {Object} options - 配置选项
 * @param {string} options.origin - 网站 origin
 * @param {string} options.category - 分类名称 (如 "CCTV")
 * @param {string} options.slug - URL slug (如 "cctv")
 * @param {Object} options.env - Workers 环境变量 (可选, CLI 模式可不传)
 * @param {number} options.limit - 限制显示的频道数量
 * @returns {Promise<string>} 生成的 HTML 字符串
 */
export async function generateCategoryPage(options = {}) {
  const { origin = 'https://iptv-search.com', category, slug, env, limit = 500 } = options;

  if (!category) {
    throw new Error('category is required');
  }

  let channels = [];

  // 在 CLI 环境下直接使用 D1
  let allGroups = [];
  if (!env || !env.KV) {
    try {
      const db = getDB();
      const result = await db.prepare(`
        SELECT c.id, c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
          AND c.group_title = ?
        ORDER BY c.channel_name
        LIMIT ?
      `).bind(category, limit).all();
      channels = result.results || [];
      
      // 获取所有分类（CLI 模式）
      const groupsResult = await db.prepare(`
        SELECT DISTINCT c.group_title
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
          AND c.group_title IS NOT NULL AND c.group_title != ''
        ORDER BY c.group_title
      `).all();
      allGroups = (groupsResult.results || []).map(r => r.group_title);
    } catch (error) {
      console.error('[SEO] CLI mode D1 query error:', error);
    }
  } else {
    const channelsResult = await getAllChannels(env);
    channels = (channelsResult.channels || [])
      .filter(ch => ch.is_active !== 0 && ch.group_title === category)
      .slice(0, limit);
    
    // 获取所有分类
    const groupsResult = await getAllGroups(env);
    allGroups = groupsResult.groups || [];
  }

  // 生成分类导航 HTML
  const categoryNavHtml = allGroups.map(g => {
    const gSlug = slugify(g);
    const isActive = g === category;
    return `<li${isActive ? ' class="active"' : ''}><a href="${origin}/category/${encodeURIComponent(gSlug)}">${escapeHtml(g)}</a></li>`;
  }).join('\n      ');

  const displayChannels = channels;
  const channelGrid = generateChannelGrid(displayChannels, origin);
  const channelCount = channels.length;

  // SEO 标签
  const pageTitle = `${category} Live TV - Watch Free ${category} Channels | IPTV Search`;
  const metaDescription = `Watch ${channelCount}+ live ${category} channels streaming free online. No signup required. Browse ${category} official channels.`;
  const canonicalUrl = `${origin}/category/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeAttr(metaDescription)}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="${escapeAttr(pageTitle)}">
  <meta property="og:description" content="${escapeAttr(metaDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "${origin}/"},
      {"@type": "ListItem", "position": 2, "name": "${escapeAttr(category)}", "item": "${canonicalUrl}"}
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
      --radius: 8px;
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

    .header { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; }
    .logo-icon { width: 36px; height: 36px; background: var(--accent); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .search-box { position: relative; width: 300px; }
    .search-box input { width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; color: var(--text-primary); font-size: 0.9rem; outline: none; transition: border-color var(--transition); }
    .search-box input:focus { border-color: var(--accent); }
    .search-box::before { content: "🔍"; position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); font-size: 0.9rem; opacity: 0.5; }

    .header-actions .pill-btn span,
    .header-actions .account-btn span { display: none; }
    .pill-btn {
      display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px;
      color: var(--text-secondary); text-decoration: none;
      transition: color var(--transition);
    }
    .pill-btn:hover { color: var(--accent); }
    .pill-btn.active { color: var(--accent); }
    .pill-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

    .account-btn {
      display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px;
      color: var(--text-secondary); text-decoration: none;
      transition: color var(--transition);
    }
    .account-btn:hover { color: var(--accent); }
    .account-btn svg { width: 18px; height: 18px; }

    .theme-toggle {
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      background: transparent; border: none; color: var(--text-secondary); cursor: pointer; transition: color var(--transition);
    }
    .theme-toggle:hover { color: var(--accent); }

    #translate { position: relative; display: inline-flex; align-items: center; }
    #translateSelectLanguage {
      appearance: none; -webkit-appearance: none; padding: 0.5rem 2rem 0.5rem 0.75rem;
      background: transparent; border: none; border-radius: 6px;
      color: var(--text-secondary); font-size: 0.85rem; cursor: pointer; outline: none;
      transition: color var(--transition); min-width: 80px;
    }
    #translateSelectLanguage:focus { color: var(--accent); }
    #translateSelectLanguage:hover { color: var(--accent); }
    #translate::after { content: ""; position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--text-secondary); pointer-events: none; }
    #translate:hover::after { border-top-color: var(--accent); }

    /* Breadcrumb */
    .breadcrumb { max-width: 1400px; margin: 0 auto; padding: 1.5rem 2rem 0; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); }
    .breadcrumb a { color: var(--accent); }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb span { opacity: 0.5; }

    /* Category Header */
    .category-header { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .category-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .category-header p { color: var(--text-secondary); font-size: 1rem; }
    .category-stats { display: flex; gap: 1.5rem; margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted); }
    .category-stats span { display: flex; align-items: center; gap: 0.3rem; }

    /* Main Content */
    .main-container { max-width: 1400px; margin: 0 auto; padding: 0 2rem 2rem; }
    .content-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .section-title { font-size: 1.25rem; font-weight: 600; }
    .channel-count { color: var(--text-muted); font-weight: 400; font-size: 1rem; }
    .download-m3u { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: var(--accent); border: none; border-radius: 20px; color: white; font-size: 0.85rem; font-weight: 500; text-decoration: none; transition: all var(--transition); }
    .download-m3u:hover { background: var(--accent-hover); transform: translateY(-1px); }
    .download-m3u svg { width: 16px; height: 16px; }

    .search-section { background: var(--bg-secondary); padding: 2rem; border-bottom: 1px solid var(--border); }
    .search-container { max-width: 1400px; margin: 0 auto; }
    .search-hero { text-align: center; margin-bottom: 1.5rem; }
    .search-hero h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .search-hero p { color: var(--text-secondary); font-size: 1rem; }
    .search-box-main { max-width: 600px; margin: 0 auto; }
    .search-form { display: flex; gap: 0.5rem; }
    .search-input {
      flex: 1; padding: 0.875rem 1rem; background: var(--bg-primary); border: 1px solid var(--border);
      border-radius: var(--radius); color: var(--text-primary); font-size: 1rem; outline: none;
      transition: border-color var(--transition);
    }
    .search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(229,9,20,0.2); }
    .search-btn {
      padding: 0.875rem 1.5rem; background: var(--accent); border: none; border-radius: var(--radius);
      color: white; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all var(--transition);
    }
    .search-btn:hover { background: var(--accent-hover); transform: translateY(-1px); }

    .main-container { flex: 1; max-width: 1400px; margin: 0 auto; width: 100%; padding: 1.5rem 2rem; }
    .content-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .section-title { font-size: 1.25rem; font-weight: 600; }
    .channel-count { color: var(--text-secondary); font-size: 0.9rem; }
    .download-m3u { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: var(--accent); border: none; border-radius: 20px; color: white; font-size: 0.85rem; font-weight: 500; text-decoration: none; transition: all var(--transition); }
    .download-m3u:hover { background: var(--accent-hover); transform: translateY(-1px); }
    .download-m3u svg { width: 16px; height: 16px; }

    .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }

    .channel-card {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
      overflow: hidden; transition: all var(--transition); cursor: pointer; position: relative;
    }
    .channel-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow); }

    .star-btn {
      position: absolute; top: 0.5rem; right: 0.5rem; width: 32px; height: 32px;
      background: rgba(0,0,0,0.6); border: none; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; font-size: 1.1rem; cursor: pointer;
      transition: all var(--transition); z-index: 10; opacity: 0;
    }
    .channel-card:hover .star-btn { opacity: 1; }
    .star-btn:hover { background: rgba(0,0,0,0.8); transform: scale(1.1); }
    .star-btn.starred { color: #fbbf24; opacity: 1; }
    .star-btn.not-starred { color: rgba(255,255,255,0.5); }

    .channel-poster { aspect-ratio: 16/10; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .channel-poster img { width: 100%; height: 100%; object-fit: contain; padding: 1rem; }
    .channel-poster .placeholder { font-size: 3rem; opacity: 0.3; }
    .channel-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%); opacity: 0; transition: opacity var(--transition); display: flex; align-items: flex-end; justify-content: center; padding: 1rem; }
    .channel-card:hover .channel-overlay { opacity: 1; }
    .play-btn { padding: 0.5rem 1.5rem; background: var(--accent); border: none; border-radius: 20px; color: white; font-size: 0.85rem; font-weight: 600; transform: translateY(10px); transition: transform var(--transition); }
    .channel-card:hover .play-btn { transform: translateY(0); }
    .channel-info { padding: 0.75rem; }
    .channel-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .channel-group { font-size: 0.75rem; color: var(--text-muted); }

    /* Checkbox for batch select */
    .channel-checkbox {
      position: absolute; top: 0.5rem; left: 0.5rem; width: 20px; height: 20px;
      background: white; border: 2px solid #d2d2d7; border-radius: 4px;
      display: flex; align-items: center; justify-content: center; font-size: 0.9rem; cursor: pointer;
      z-index: 10; opacity: 1; transition: all 0.2s ease;
    }
    .channel-checkbox:hover { border-color: #333333; }
    .channel-card.selected .channel-checkbox { background: white; border-color: #333333; }
    .channel-card.selected .channel-checkbox::after {
      content: ''; position: absolute; left: 6px; top: 2px;
      width: 5px; height: 9px; border: solid black; border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    /* Bulk Actions Bar */
    .bulk-actions-bar {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center;
      justify-content: space-between; flex-wrap: wrap; gap: 1rem;
    }
    .bulk-hint { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.9rem; }
    .bulk-hint svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.7; }
    .bulk-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .bulk-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; border: none; cursor: pointer; transition: all var(--transition); }
    .bulk-btn svg { width: 16px; height: 16px; }
    .bulk-btn-primary { background: var(--accent); color: white; }
    .bulk-btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
    .bulk-btn-secondary { background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border); }
    .bulk-btn-secondary:hover { background: var(--bg-hover); border-color: var(--border-hover); }
    .bulk-btn-download { background: linear-gradient(135deg, #34c759, #30b954); color: white; }
    .bulk-btn-download:hover { background: linear-gradient(135deg, #30b954, #2ca048); transform: translateY(-1px); }
    .bulk-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Category Navigation */
    .category-nav { max-width: 1400px; margin: 0 auto; padding: 0 2rem 1.5rem; }
    .category-nav-list { display: flex; gap: 0.5rem; flex-wrap: wrap; list-style: none; }
    .category-nav-list li a { display: block; padding: 0.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; font-size: 0.85rem; transition: all var(--transition); white-space: nowrap; }
    .category-nav-list li a:hover { background: var(--bg-hover); border-color: var(--border-hover); }
    .category-nav-list li.active a { background: var(--accent); border-color: var(--accent); color: white; }

    /* Toast */
    .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--accent); color: white; padding: 1rem 2rem; border-radius: var(--radius); font-weight: 600; opacity: 0; transition: all 0.3s ease; z-index: 1000; max-width: 90%; text-align: center; }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .toast a { color: #fff; text-decoration: underline; font-weight: 700; }
    .toast.show-link { background: linear-gradient(135deg, var(--accent), #b3080f); padding: 1rem 1.5rem; }

    /* Pagination */
    .pagination { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border); }
    .pagination a, .pagination span { padding: 0.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px; font-size: 0.9rem; transition: all var(--transition); }
    .pagination a:hover { background: var(--bg-hover); border-color: var(--border-hover); }
    .pagination .current { background: var(--accent); border-color: var(--accent); color: white; }

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
    @media (max-width: 900px) {
      .header-actions .pill-btn span { display: none; }
    }
    @media (max-width: 768px) {
      .header { padding: 0.5rem 0.75rem; }
      .header-inner { flex-wrap: wrap; justify-content: space-between; gap: 0.5rem; }
      .logo { font-size: 1.25rem; flex-shrink: 0; }
      .logo-icon svg { width: 32px; height: 32px; }
      .logo-text { display: none; }
      .search-box { width: 100%; order: 3; margin-top: 0.5rem; }
      .search-box input { padding: 0.5rem 1rem 0.5rem 2.5rem; font-size: 0.9rem; }
      .search-box::before { font-size: 0.9rem; left: 0.8rem; }
      .header-actions { gap: 0.25rem; flex-shrink: 0; }
      .header-actions .pill-btn { width: 32px; height: 32px; padding: 0; flex-shrink: 0; }
      .header-actions .pill-btn span { display: none; }
      #translate { flex-shrink: 0; }
      #translateSelectLanguage { padding: 0.25rem 1.5rem 0.25rem 0.5rem; background: transparent; border: none; font-size: 0.75rem; min-width: 60px; }
      .theme-toggle { width: 32px; height: 32px; background: transparent; border: none; padding: 0; flex-shrink: 0; }
      .account-btn { width: 32px; height: 32px; padding: 0; flex-shrink: 0; }
      .account-btn span { display: none; }
      .search-section { padding: 1.5rem 1rem; }
      .search-hero h1 { font-size: 1.5rem; }
      .search-form { flex-direction: column; }
      .search-btn { width: 100%; }
      .breadcrumb { padding: 1rem 1rem 0; font-size: 0.8rem; overflow-x: auto; white-space: nowrap; }
      .category-header { padding: 1.5rem 1rem 1rem; }
      .category-header h1 { font-size: 1.5rem; }
      .category-header p { font-size: 0.9rem; }
      .category-stats { font-size: 0.8rem; flex-wrap: wrap; gap: 0.75rem; }
      .category-nav { padding: 0 1rem 1rem; overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .category-nav-list { display: flex; flex-wrap: nowrap; gap: 0.375rem; }
      .category-nav-list li a { padding: 0.4rem 0.75rem; font-size: 0.8rem; white-space: nowrap; }
      .main-container { padding: 0 1rem 1.5rem; }
      .content-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
      .section-title { font-size: 1.1rem; }
      .channel-count { font-size: 0.9rem; }
      .channel-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
      .bulk-actions-bar { flex-direction: column; align-items: stretch; gap: 0.75rem; padding: 0.75rem; }
      .bulk-hint { font-size: 0.8rem; }
      .bulk-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .bulk-btn { padding: 0.5rem 0.75rem; font-size: 0.8rem; flex: 1; min-width: calc(50% - 0.25rem); justify-content: center; }
      .bulk-btn svg { width: 14px; height: 14px; }
      .bulk-btn-download { order: -1; }
      .pagination { flex-wrap: wrap; gap: 0.375rem; }
      .pagination a, .pagination span { padding: 0.4rem 0.75rem; font-size: 0.85rem; }
    }
    @media (max-width: 480px) {
      .logo-text { display: none; }
      .channel-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
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
        <form action="${origin}/search" method="get" style="display:flex">
          <input type="text" name="q" placeholder="Search channels..." value="">
        </form>
      </div>
      <div class="header-actions">
        <a href="${origin}/favorites" class="pill-btn" title="My Favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>Favorites</span>
        </a>
        <a href="${origin}/plans" class="pill-btn" title="Subscription Plans">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span>Plans</span>
        </a>
        <button class="theme-toggle" id="themeToggle" title="Toggle theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        </button>
        <a href="${origin}/account" class="pill-btn account-btn" title="My Account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Account</span>
        </a>
        <div id="translate"></div>
      </div>
    </div>
  </header>

  <nav class="breadcrumb">
    <a href="${origin}/">Home</a>
    <span>›</span>
    <span>${escapeHtml(category)}</span>
  </nav>

  <div class="category-header">
    <h1><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" style="vertical-align:middle;margin-right:0.3em"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>${escapeHtml(category)} Channels</h1>
    <p>Watch all ${escapeHtml(category)} channels live.</p>
    <div class="category-stats">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="vertical-align:middle"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg> ${channelCount} channels</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="vertical-align:middle"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg> Updated daily</span>
    </div>
  </div>

  <nav class="category-nav">
    <ul class="category-nav-list">
      ${categoryNavHtml}
    </ul>
  </nav>

  <main class="main-container">
    <div class="content-header">
      <h2 class="section-title">All Channels <span class="channel-count">(${channelCount})</span></h2>
    </div>

    <!-- Bulk Actions Bar -->
    <div class="bulk-actions-bar">
      <div class="bulk-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>Select channels to batch add to favorites or download M3U</span>
      </div>
      <div class="bulk-actions">
        <button class="bulk-btn bulk-btn-secondary" onclick="selectAll()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          Select All
        </button>
        <button class="bulk-btn bulk-btn-secondary" onclick="clearSelection()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
          </svg>
          Clear
        </button>
        <button class="bulk-btn bulk-btn-download" onclick="downloadSelectedM3U()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download M3U
        </button>
        <button class="bulk-btn bulk-btn-primary" onclick="addSelectedToFavorites()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Add to Favorites
        </button>
      </div>
    </div>

    <div class="channel-grid">
      ${channelGrid || '<p>No channels found</p>'}
    </div>

    <div class="pagination">
      <span class="current">1</span>
    </div>
  </main>

  <div class="toast" id="toast"></div>

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
      } else { setTimeout(initTranslate, 100); }
    }
    initTranslate();

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

    // Favorites storage
    const FAVORITES_KEY = 'iptv_favorites';
    const MAX_FAVORITES = 200;
    
    function getFavorites() {
      try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; } catch { return []; }
    }

    function saveFavorites(favorites) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      localStorage.setItem(FAVORITES_KEY + '_update', Date.now().toString());
    }

    function toggleStar(event, btn, channelHash, channelName, groupTitle) {
      event.stopPropagation();
      const favorites = getFavorites();
      const index = favorites.findIndex(f => f.channel_hash === channelHash);
      
      if (index > -1) {
        favorites.splice(index, 1);
        btn.classList.remove('starred');
        btn.classList.add('not-starred');
        btn.textContent = '☆';
        showToast('Removed from favorites');
      } else {
        if (favorites.length >= MAX_FAVORITES) {
          showToastWithLink('Maximum ' + MAX_FAVORITES + ' channels reached! For more channels, please <a href="${origin}/plans">get a subscription</a>.');
          return;
        }
        favorites.push({ channel_hash: channelHash, channel_name: channelName, group_title: groupTitle });
        btn.classList.remove('not-starred');
        btn.classList.add('starred');
        btn.textContent = '★';
        showToast('Added to favorites (' + favorites.length + '/' + MAX_FAVORITES + ')');
      }
      saveFavorites(favorites);
    }

    // Batch mode
    function toggleCheckbox(event, checkbox) {
      event.stopPropagation();
      const card = checkbox.closest('.channel-card');
      card.classList.toggle('selected');
      updateSelectedCount();
    }

    function updateSelectedCount() {
      const selected = document.querySelectorAll('.channel-card.selected').length;
    }

    function selectAll() {
      document.querySelectorAll('.channel-card').forEach(card => card.classList.add('selected'));
      updateSelectedCount();
    }

    function clearSelection() {
      document.querySelectorAll('.channel-card.selected').forEach(card => card.classList.remove('selected'));
      updateSelectedCount();
    }

    let skippedChannels = [];

    function addSelectedToFavorites() {
      const favorites = getFavorites();
      const selectedCards = document.querySelectorAll('.channel-card.selected');
      let addedCount = 0;
      let skippedCount = 0;
      const remainingSlots = MAX_FAVORITES - favorites.length;
      
      selectedCards.forEach(card => {
        const starBtn = card.querySelector('.star-btn');
        const onclick = starBtn.getAttribute('onclick');
        const match = onclick.match(/'([^']+)'/g);
        if (match && match.length >= 3) {
          const channelHash = match[0].slice(1, -1);
          const channelName = match[2].slice(1, -1);
          const groupTitle = match[3].slice(1, -1);
          
          if (!favorites.some(f => f.channel_hash === channelHash)) {
            if (addedCount < remainingSlots) {
              favorites.push({ channel_hash: channelHash, channel_name: channelName, group_title: groupTitle });
              addedCount++;
              starBtn.classList.remove('not-starred');
              starBtn.classList.add('starred');
              starBtn.textContent = '★';
            } else {
              skippedCount++;
              skippedChannels.push({ hash: channelHash, name: channelName });
            }
          }
        }
      });
      
      saveFavorites(favorites);
      
      if (skippedCount > 0) {
        showToastWithLink('Added ' + addedCount + ' channels. Maximum ' + MAX_FAVORITES + ' reached! <a href="${origin}/plans">Get subscription</a> for more.');
      } else {
        showToast('Added ' + addedCount + ' channels to favorites (' + favorites.length + '/' + MAX_FAVORITES + ')');
      }
    }

    function downloadSelectedM3U() {
      const selectedCards = document.querySelectorAll('.channel-card.selected');
      if (selectedCards.length === 0) { showToast('Please select at least one channel'); return; }
      if (selectedCards.length > MAX_FAVORITES) {
        showToastWithLink('Maximum ' + MAX_FAVORITES + ' channels per download. <a href="${origin}/plans">Get subscription</a> for full M3U.');
        return;
      }

      let m3uContent = '#EXTM3U\\n\\n';
      
      selectedCards.forEach(card => {
        const starBtn = card.querySelector('.star-btn');
        const onclick = starBtn.getAttribute('onclick');
        const match = onclick.match(/'([^']+)'/g);
        if (match && match.length >= 3) {
          const channelHash = match[0].slice(1, -1);
          const channelName = match[2].slice(1, -1);
          const groupTitle = match[3].slice(1, -1);
          const channelNameEscaped = channelName.replace(/"/g, '\\\\"');
          const groupTitleEscaped = groupTitle.replace(/"/g, '\\\\"');
          m3uContent += '#EXTINF:-1 group-title="' + groupTitleEscaped + '" tvg-name="' + channelNameEscaped + '",' + channelName + '\\n';
          m3uContent += window.location.origin + '/live/' + channelHash + '/' + generateHash(channelHash) + '\\n\\n';
        }
      });

      const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'iptv-channels-' + Date.now() + '.m3u';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded ' + selectedCards.length + ' channels');
    }

    function generateHash(channelHash) {
      let hash = 0;
      const str = channelHash + 'salt';
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16).substring(0, 8);
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.innerHTML = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
    
    function showToastWithLink(message) {
      const toast = document.getElementById('toast');
      toast.innerHTML = message;
      toast.classList.add('show', 'show-link');
      setTimeout(() => toast.classList.remove('show', 'show-link'), 4000);
    }

    // Initialize star buttons based on favorites
    function initStarButtons() {
      const favorites = getFavorites();
      document.querySelectorAll('.star-btn').forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        const match = onclick.match(/'([^']+)'/);
        if (match) {
          const channelHash = match[1];
          const isFavorited = favorites.some(f => f.channel_hash === channelHash);
          if (isFavorited) {
            btn.classList.remove('not-starred');
            btn.classList.add('starred');
            btn.textContent = '★';
          }
        }
      });
    }
    initStarButtons();
  </script>
</body>
</html>`;

  return html;
}

// 生成频道详情页 HTML
/**
 * 生成频道详情页 HTML
 * @param {Object} options - 配置选项
 * @param {string} options.origin - 网站 origin
 * @param {Object} options.channel - 频道数据对象
 * @param {string} options.channelHash - 频道 hash
 * @param {Object} options.env - Workers 环境变量 (可选, CLI 模式可不传)
 * @returns {Promise<string>} 生成的 HTML 字符串
 */
export async function generateChannelDetailPage(options = {}) {
  const { origin = 'https://iptv-search.com', channel, channelHash, env } = options;

  if (!channel || !channelHash) {
    throw new Error('channel and channelHash are required');
  }

  const hash = escapeAttr(channelHash);
  const name = escapeHtml(channel.channel_name || 'Unknown');
  const group = escapeHtml(channel.group_title || 'Other');
  const logo = channel.logo ? escapeAttr(channel.logo) : '';
  const playUrl = channel.play_url ? escapeAttr(channel.play_url) : '';
  const slug = slugify(group);

  // 获取同分类的其他频道 (用于推荐)
  let relatedChannels = [];
  if (!env || !env.KV) {
    try {
      const db = getDB();
      const result = await db.prepare(`
        SELECT c.id, c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
          AND c.group_title = ? AND c.channel_hash != ?
        ORDER BY RANDOM()
        LIMIT 12
      `).bind(group, hash).all();
      relatedChannels = result.results || [];
    } catch (error) {
      console.error('[SEO] CLI mode D1 query error:', error);
    }
  } else {
    const channelsResult = await getAllChannels(env);
    relatedChannels = (channelsResult.channels || [])
      .filter(ch => ch.is_active !== 0 && ch.group_title === group && ch.channel_hash !== hash)
      .slice(0, 12);
  }

  const relatedGrid = generateChannelGrid(relatedChannels.slice(0, 12), origin);

  // SEO 标签
  const pageTitle = `${name} - Watch Live | IPTV Search`;
  const metaDescription = `Watch ${name} live streaming for free. No registration required. ${group} channels on IPTV Search.`;
  const canonicalUrl = `${origin}/channel/${hash}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${escapeAttr(metaDescription)}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${escapeAttr(pageTitle)}">
  <meta property="og:description" content="${escapeAttr(metaDescription)}">
  <meta property="og:type" content="video.other">
  ${logo ? `<meta property="og:image" content="${logo}">` : ''}
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "${escapeAttr(name)} - Live TV",
    "description": "Watch ${escapeAttr(name)} live streaming for free. No registration required.",
    "thumbnailUrl": "${logo || ''}",
    "genre": "TV Channel",
    "publisher": {
      "@type": "Organization",
      "name": "IPTV Search",
      "url": "${origin}"
    }
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "${origin}/"},
      {"@type": "ListItem", "position": 2, "name": "${escapeAttr(group)}", "item": "${origin}/category/${slug}"},
      {"@type": "ListItem", "position": 3, "name": "${escapeAttr(name)}"}
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

    .header { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; }
    .logo-icon { width: 36px; height: 36px; background: var(--accent); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1rem; }

    .header-actions .pill-btn span,
    .header-actions .account-btn span { display: none; }
    .pill-btn {
      display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px;
      color: var(--text-secondary); text-decoration: none;
      transition: color var(--transition);
    }
    .pill-btn:hover { color: var(--accent); }
    .pill-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

    .account-btn {
      display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px;
      color: var(--text-secondary); text-decoration: none;
      transition: color var(--transition);
    }
    .account-btn:hover { color: var(--accent); }
    .account-btn svg { width: 18px; height: 18px; }

    .theme-toggle {
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      background: transparent; border: none; color: var(--text-secondary); cursor: pointer; transition: color var(--transition);
    }
    .theme-toggle:hover { color: var(--accent); }

    #translate { position: relative; display: inline-flex; align-items: center; }
    #translateSelectLanguage {
      appearance: none; -webkit-appearance: none; padding: 0.5rem 2rem 0.5rem 0.75rem;
      background: transparent; border: none; border-radius: 6px;
      color: var(--text-secondary); font-size: 0.85rem; cursor: pointer; outline: none;
      transition: color var(--transition); min-width: 80px;
    }
    #translateSelectLanguage:focus { color: var(--accent); }
    #translateSelectLanguage:hover { color: var(--accent); }
    #translate::after { content: ""; position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--text-secondary); pointer-events: none; }
    #translate:hover::after { border-top-color: var(--accent); }

    .breadcrumb { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 0.75rem 2rem; }
    .breadcrumb-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); }
    .breadcrumb a:hover { color: var(--accent); }
    .breadcrumb span { color: var(--text-muted); }

    .player-section { background: var(--bg-secondary); padding: 2rem; border-bottom: 1px solid var(--border); }
    .player-container { max-width: 1000px; margin: 0 auto; }
    .player-wrapper { position: relative; aspect-ratio: 16/9; background: #000; border-radius: var(--radius); overflow: hidden; margin-bottom: 1.5rem; }
    .player-wrapper iframe { width: 100%; height: 100%; border: none; }
    .player-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
    .player-placeholder .logo-big { max-width: 150px; max-height: 80px; object-fit: contain; }
    .player-placeholder .play-icon { font-size: 4rem; opacity: 0.8; }
    .player-actions { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .action-btn {
      display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem;
      background: var(--accent); border: none; border-radius: 25px; color: white; font-size: 0.95rem; font-weight: 600;
      cursor: pointer; transition: all var(--transition);
    }
    .action-btn:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(229,9,20,0.4); }
    .action-btn.secondary { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); }
    .action-btn.secondary:hover { background: var(--bg-hover); border-color: var(--border-hover); box-shadow: none; }
    .action-btn svg { width: 18px; height: 18px; }

    .channel-info-header { text-align: center; margin-bottom: 1rem; }
    .channel-info-header h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
    .channel-meta { display: flex; justify-content: center; gap: 1rem; font-size: 0.9rem; color: var(--text-secondary); }
    .channel-meta a { color: var(--accent); }
    .channel-meta a:hover { text-decoration: underline; }

    .main-content { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .section-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; }
    .section-title a { font-size: 0.85rem; color: var(--accent); font-weight: 400; }

    .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }

    .channel-card {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
      overflow: hidden; transition: all var(--transition); cursor: pointer; position: relative;
    }
    .channel-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow); }

    .star-btn {
      position: absolute; top: 0.5rem; right: 0.5rem; width: 32px; height: 32px;
      background: rgba(0,0,0,0.6); border: none; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; font-size: 1.1rem; cursor: pointer;
      transition: all var(--transition); z-index: 10; opacity: 0;
    }
    .channel-card:hover .star-btn { opacity: 1; }
    .star-btn:hover { background: rgba(0,0,0,0.8); transform: scale(1.1); }
    .star-btn.starred { color: #fbbf24; opacity: 1; }
    .star-btn.not-starred { color: rgba(255,255,255,0.5); }

    .channel-poster { aspect-ratio: 16/10; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .channel-poster img { width: 100%; height: 100%; object-fit: contain; padding: 1rem; }
    .channel-poster .placeholder { font-size: 2.5rem; opacity: 0.3; }
    .channel-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%); opacity: 0; transition: opacity var(--transition); display: flex; align-items: flex-end; justify-content: center; padding: 1rem; }
    .channel-card:hover .channel-overlay { opacity: 1; }
    .play-btn { padding: 0.5rem 1.5rem; background: var(--accent); border: none; border-radius: 20px; color: white; font-size: 0.85rem; font-weight: 600; transform: translateY(10px); transition: transform var(--transition); }
    .channel-card:hover .play-btn { transform: translateY(0); }
    .channel-info { padding: 0.75rem; }
    .channel-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .channel-group { font-size: 0.75rem; color: var(--text-muted); }

    .page-footer { background: var(--bg-secondary); border-top: 1px solid var(--border); padding: 2rem 1.25rem; margin-top: 3rem; }
    .footer-content { max-width: 1000px; margin: 0 auto; text-align: center; }
    .footer-copyright { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem; }
    .footer-links { display: flex; justify-content: center; align-items: center; gap: 1.25rem; flex-wrap: wrap; font-size: 0.75rem; }
    .footer-links a { color: var(--text-secondary); text-decoration: none; transition: color var(--transition); }
    .footer-links a:hover { color: var(--text-primary); }

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
      .account-btn span { display: none; }
      #translate { flex-shrink: 0; }
      #translateSelectLanguage { padding: 0.25rem 1.5rem 0.25rem 0.5rem; background: transparent; border: none; font-size: 0.75rem; min-width: 60px; }
      .breadcrumb { padding: 0.75rem 1rem; }
      .player-section { padding: 1.5rem 1rem; }
      .player-actions { flex-direction: column; }
      .action-btn { width: 100%; justify-content: center; }
      .main-content { padding: 1.5rem 1rem; }
      .related-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
    }
    @media (max-width: 480px) {
      .channel-info-header h1 { font-size: 1.5rem; }
      .related-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <a href="${origin}/" class="logo">
        <div class="logo-icon">📺</div>
        <div class="logo-text">IPTV<span>Search</span></div>
      </a>
      <div class="header-actions">
        <a href="${origin}/favorites" class="pill-btn">⭐ <span>Favorites</span></a>
        <button class="theme-toggle" id="themeToggle">🌙</button>
        <a href="${origin}/login" class="account-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Login</span>
        </a>
        <div id="translate"></div>
      </div>
    </div>
  </header>

  <nav class="breadcrumb">
    <div class="breadcrumb-inner">
      <a href="${origin}/">Home</a>
      <span>/</span>
      <a href="${origin}/category/${slug}">${group}</a>
      <span>/</span>
      <span>${name}</span>
    </div>
  </nav>

  <section class="player-section">
    <div class="player-container">
      <div class="player-wrapper" id="playerWrapper">
        ${logo ? `<img src="${logo}" alt="${name}" class="logo-big">` : '<div class="placeholder" style="font-size:5rem;opacity:0.3">📺</div>'}
        <div class="play-icon">▶</div>
      </div>
      <div class="channel-info-header">
        <h1>${name}</h1>
        <div class="channel-meta">
          <a href="${origin}/category/${slug}">${group}</a>
        </div>
      </div>
      <div class="player-actions">
        <button class="action-btn" id="playBtn" data-url="${escapeAttr(playUrl)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Watch Now
        </button>
        <button class="action-btn secondary" onclick="copyM3U()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy M3U
        </button>
        <button class="action-btn secondary" id="favoriteBtn" data-hash="${hash}" data-name="${escapeAttr(name)}" data-group="${escapeAttr(group)}" data-logo="${logo}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span id="favoriteText">Add to Favorites</span>
        </button>
      </div>
    </div>
  </section>

  ${relatedChannels.length > 0 ? `
  <main class="main-content">
    <h2 class="section-title">
      More ${group} Channels
      <a href="${origin}/category/${slug}">View all →</a>
    </h2>
    <div class="related-grid">
      ${relatedGrid}
    </div>
  </main>` : ''}

  <footer class="page-footer">
    <div class="footer-content">
      <p class="footer-copyright">&copy; ${new Date().getFullYear()} IPTV Search. Free IPTV Channel Directory & Search Tool</p>
      <div class="footer-links">
        <a href="${origin}/tutorial">How to Watch</a>
        <a href="${origin}/privacy-policy">Privacy Policy</a>
        <a href="${origin}/terms">Terms of Service</a>
      </div>
    </div>
  </footer>

  <script>
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
    });

    // Favorites
    function getFavorites() { return JSON.parse(localStorage.getItem('favorites') || '[]'); }
    function saveFavorites(favorites) { localStorage.setItem('favorites', JSON.stringify(favorites)); }

    const favoriteBtn = document.getElementById('favoriteBtn');
    const favoriteText = document.getElementById('favoriteText');
    const hash = favoriteBtn.dataset.hash;
    const name = favoriteBtn.dataset.name;
    const group = favoriteBtn.dataset.group;
    const logo = favoriteBtn.dataset.logo;

    function updateFavoriteBtn() {
      const favorites = getFavorites();
      const isFavorited = favorites.some(f => f.hash === hash);
      if (isFavorited) {
        favoriteText.textContent = 'Remove from Favorites';
        favoriteBtn.querySelector('svg').setAttribute('fill', '#fbbf24');
      } else {
        favoriteText.textContent = 'Add to Favorites';
        favoriteBtn.querySelector('svg').setAttribute('fill', 'none');
      }
    }

    favoriteBtn.addEventListener('click', () => {
      const favorites = getFavorites();
      const index = favorites.findIndex(f => f.hash === hash);
      if (index >= 0) {
        favorites.splice(index, 1);
      } else {
        if (favorites.length >= 200) { alert('Maximum 200 favorites allowed'); return; }
        favorites.push({ hash, name, group, logo });
      }
      saveFavorites(favorites);
      updateFavoriteBtn();
    });

    updateFavoriteBtn();

    // Initialize star states on related channels
    document.addEventListener('DOMContentLoaded', () => {
      const favorites = getFavorites();
      const favoriteHashes = favorites.map(f => f.hash);
      document.querySelectorAll('.star-btn').forEach(btn => {
        const h = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (favoriteHashes.includes(h)) {
          btn.classList.remove('not-starred');
          btn.classList.add('starred');
          btn.textContent = '★';
        }
      });
    });

    function toggleStar(e, btn, h, n, g) {
      e.stopPropagation();
      const favorites = getFavorites();
      const index = favorites.findIndex(f => f.hash === h);
      if (index >= 0) {
        favorites.splice(index, 1);
        btn.classList.remove('starred');
        btn.classList.add('not-starred');
        btn.textContent = '☆';
      } else {
        if (favorites.length >= 200) { alert('Maximum 200 favorites allowed'); return; }
        favorites.push({ hash: h, name: n, group: g, logo: btn.closest('.channel-card').querySelector('img')?.src || '' });
        btn.classList.remove('not-starred');
        btn.classList.add('starred');
        btn.textContent = '★';
      }
      saveFavorites(favorites);
    }

    // Copy M3U
    function copyM3U() {
      const m3u = '#EXTM3U\\n#EXTINF:-1 tvg-name="' + name + '" tvg-logo="' + (logo || '') + '",' + name + '\\n/live/{code}/' + hash;
      navigator.clipboard.writeText(m3u).then(() => {
        alert('M3U link copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy. Please copy manually.');
      });
    }
  </script>

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
      } else { setTimeout(initTranslate, 100); }
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initTranslate); } else { initTranslate(); }
  </script>
</body>
</html>`;

  return html;
}

// 生成搜索结果页面
/**
 * 生成搜索结果页 HTML
 * @param {Object} options - 配置选项
 * @param {string} options.origin - 网站 origin
 * @param {string} options.query - 搜索关键词
 * @param {Object} options.env - Workers 环境变量
 * @returns {Promise<string>} 生成的 HTML 字符串
 */
export async function generateSearchPage(options = {}) {
  const { origin = 'https://iptv-search.com', query = '', env } = options;

  // 获取所有频道（从 KV 缓存或数据库）
  const { channels } = await getAllChannels(env);

  // 过滤匹配的频道
  const queryLower = query.toLowerCase().trim();
  const results = queryLower
    ? channels.filter(ch => {
        const name = (ch.channel_name || '').toLowerCase();
        const group = (ch.group_title || '').toLowerCase();
        return name.includes(queryLower) || group.includes(queryLower);
      })
    : [];

  // 生成频道卡片 HTML
  const channelGrid = results.length > 0
    ? `<div class="channel-grid">${results.map(ch => generateChannelCard(ch, origin)).join('\n')}</div>`
    : '';

  const pageTitle = query ? `Search: ${query}` : 'Search Channels';
  const resultCount = results.length;
  const resultText = query
    ? `Found <strong>${resultCount}</strong> channels for "<strong>${escapeHtml(query)}</strong>"`
    : 'Enter a search term to find channels';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)} | IPTV Search</title>
  <meta name="robots" content="noindex, follow">
  <meta name="description" content="Search results for ${escapeAttr(query)} - Find live TV channels">
  
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
      --radius: 8px;
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

    .header { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
    .logo-icon svg { width: 36px; height: 36px; }
    .logo-text span { color: var(--accent); }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .search-box { position: relative; width: 300px; }
    .search-box form { display: flex; }
    .search-box input {
      width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 20px; color: var(--text-primary); font-size: 0.9rem; outline: none; transition: border-color var(--transition);
    }
    .search-box input:focus { border-color: var(--accent); }
    .search-box::before {
      content: '🔍'; position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);
      font-size: 0.9rem; pointer-events: none;
    }
    .search-box button { display: none; }
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

    .main-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }

    .search-results-header { margin-bottom: 2rem; }
    .search-results-header h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .search-results-header p { color: var(--text-secondary); font-size: 1rem; }
    .search-results-header strong { color: var(--accent); }

    .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }

    .channel-card {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
      overflow: hidden; transition: all var(--transition); cursor: pointer; position: relative;
    }
    .channel-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow); }

    .star-btn {
      position: absolute; top: 0.5rem; right: 0.5rem; width: 32px; height: 32px;
      background: rgba(0,0,0,0.6); border: none; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; font-size: 1.1rem; cursor: pointer;
      transition: all var(--transition); z-index: 10; opacity: 0;
    }
    .channel-card:hover .star-btn { opacity: 1; }
    .star-btn:hover { background: rgba(0,0,0,0.8); transform: scale(1.1); }
    .star-btn.starred { color: #fbbf24; opacity: 1; }
    .star-btn.not-starred { color: rgba(255,255,255,0.5); }

    .channel-poster { aspect-ratio: 16/10; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .channel-poster img { width: 100%; height: 100%; object-fit: contain; padding: 1rem; }
    .channel-poster .placeholder { font-size: 3rem; opacity: 0.3; }
    .channel-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%); opacity: 0; transition: opacity var(--transition); display: flex; align-items: flex-end; justify-content: center; padding: 1rem; }
    .channel-card:hover .channel-overlay { opacity: 1; }
    .play-btn { padding: 0.5rem 1.5rem; background: var(--accent); border: none; border-radius: 20px; color: white; font-size: 0.85rem; font-weight: 600; transform: translateY(10px); transition: transform var(--transition); }
    .channel-card:hover .play-btn { transform: translateY(0); }
    .channel-info { padding: 0.75rem; }
    .channel-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .channel-group { font-size: 0.75rem; color: var(--text-muted); }

    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-state-icon { font-size: 4rem; opacity: 0.3; margin-bottom: 1rem; }
    .empty-state h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .empty-state .category-list { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 1.5rem; }
    .empty-state .category-tag {
      display: inline-block; padding: 0.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 20px; font-size: 0.85rem; color: var(--text-secondary); transition: all var(--transition);
    }
    .empty-state .category-tag:hover { background: var(--bg-hover); color: var(--accent); border-color: var(--accent); }

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
      .account-btn span { display: none; }
      .main-container { padding: 1rem; }
      .channel-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
    }
    @media (max-width: 480px) {
      .logo-text { display: none; }
      .channel-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
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
          <input type="text" name="q" placeholder="Search channels..." value="${escapeAttr(query)}">
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

  <main class="main-container">
    <div class="search-results-header">
      <h1>🔍 Search Results</h1>
      <p>${results.length > 0 ? resultText : (query ? `No channels found for "<strong>${escapeHtml(query)}</strong>"` : 'Enter a search term to find channels')}</p>
    </div>

    ${results.length > 0 ? channelGrid : ''}

    ${results.length === 0 && query ? `
    <div class="empty-state">
      <div class="empty-state-icon">📺</div>
      <h2>No channels found</h2>
      <p>Try a different search term or browse by category</p>
      <div class="category-list">
        <a href="${origin}/category/央视" class="category-tag">央视</a>
        <a href="${origin}/category/体育" class="category-tag">体育</a>
        <a href="${origin}/category/电影" class="category-tag">电影</a>
        <a href="${origin}/category/综艺" class="category-tag">综艺</a>
        <a href="${origin}/category/儿童" class="category-tag">儿童</a>
      </div>
    </div>
    ` : ''}
  </main>

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
      <div class="footer-disclaimer">This site does not host or provide any IPTV streams. All channels are sourced from publicly available M3U playlists. Channels may go offline at any time as their source streams change.</div>
    </div>
  </footer>

  <script>
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', function() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  </script>
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
      } else { setTimeout(initTranslate, 100); }
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initTranslate); } else { initTranslate(); }
  </script>
</body>
</html>`;

  return html;
}

// 生成 404 页面
export async function generate404Page(request, env, notFoundType = 'page') {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;

  // 获取频道和分组数据
  const [channelsResult, groupsResult] = await Promise.all([
    getAllChannels(env),
    getAllGroups(env)
  ]);

  const channels = channelsResult.channels || [];
  const groups = groupsResult.groups || [];

  // 优先选择有 logo 的频道
  const featuredChannels = channels
    .filter(ch => ch.is_active !== 0 && ch.logo)
    .slice(0, 16);

  const displayGroups = groups.slice(0, 10);

  const typeLabel = notFoundType === 'channel' ? 'Channel' : notFoundType === 'category' ? 'Category' : 'Page';
  const pageTitle = `404 - ${typeLabel} Not Found | IPTV Search`;
  const metaDescription = `The ${notFoundType} you are looking for no longer exists. IPTV channels go offline frequently as source streams change. Use our search to find similar channels.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeAttr(metaDescription)}">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${origin}/">
  <meta property="og:title" content="${escapeAttr(pageTitle)}">
  <meta property="og:description" content="${escapeAttr(metaDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${origin}/">
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content="${origin}/og-image.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(pageTitle)}">
  <meta name="twitter:description" content="${escapeAttr(metaDescription)}">

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a0a; color: #fff; line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }

    .hero {
      background: linear-gradient(135deg, #1a1a2e, #0f0f1a);
      padding: 4rem 2rem;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .hero-404 {
      font-size: 7rem;
      font-weight: 900;
      color: rgba(229,9,20,0.15);
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .hero h1 {
      font-size: 2rem;
      margin-bottom: 0.75rem;
      color: #fff;
    }

    .hero p {
      color: rgba(255,255,255,0.6);
      max-width: 500px;
      margin: 0 auto 1.5rem;
      font-size: 1.05rem;
    }

    .hero-search {
      background: #1a1a1a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-search h2 {
      font-size: 1rem;
      color: rgba(255,255,255,0.7);
      margin-bottom: 0.75rem;
      font-weight: 400;
    }

    .search-form {
      display: flex;
      gap: 0.5rem;
    }

    .search-form input {
      flex: 1;
      padding: 0.8rem 1rem;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      background: #0a0a0a;
      color: #fff;
      font-size: 1rem;
    }

    .search-form input:focus {
      outline: none;
      border-color: #e50914;
    }

    .search-form button {
      padding: 0.8rem 1.5rem;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .search-form button:hover {
      background: #f6121d;
    }

    .home-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }

    .btn-primary {
      display: inline-block;
      background: #e50914;
      color: #fff;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
    }

    .btn-primary:hover {
      background: #f6121d;
      text-decoration: none;
    }

    .btn-secondary {
      display: inline-block;
      background: #1a1a1a;
      color: #fff;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.15);
      text-align: center;
    }

    .btn-secondary:hover {
      border-color: #e50914;
      color: #e50914;
      text-decoration: none;
    }

    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .why-box {
      background: #141414;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(255,255,255,0.08);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .why-box h3 {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
      color: #fff;
    }

    .why-box p {
      font-size: 0.9rem;
      color: rgba(255,255,255,0.6);
      line-height: 1.7;
    }

    .section {
      padding: 2rem 0;
    }

    .section-title {
      font-size: 1.3rem;
      margin-bottom: 1.25rem;
      color: #fff;
      border-bottom: 2px solid #e50914;
      padding-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .section-title a {
      font-size: 0.85rem;
      color: #e50914;
      font-weight: 400;
    }

    .channel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .channel-card {
      background: #141414;
      border-radius: 6px;
      padding: 0.75rem;
      border: 1px solid rgba(255,255,255,0.05);
      transition: border-color 0.2s;
    }

    .channel-card:hover {
      border-color: rgba(229,9,20,0.5);
    }

    .channel-card a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #fff;
    }

    .channel-card a:hover {
      text-decoration: none;
    }

    .channel-card img {
      width: 36px;
      height: 36px;
      object-fit: contain;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .placeholder {
      width: 36px;
      height: 36px;
      background: #2a2a2a;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .category-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .category-tag {
      background: #141414;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 0.4rem 1rem;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.8);
      transition: all 0.2s;
    }

    .category-tag:hover {
      background: #e50914;
      color: #fff;
      border-color: #e50914;
      text-decoration: none;
    }

    footer {
      background: #0f0f1a;
      border-top: 1px solid rgba(255,255,255,0.05);
      padding: 2rem;
      text-align: center;
      margin-top: 3rem;
    }

    footer p {
      color: rgba(255,255,255,0.4);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    footer a {
      color: rgba(255,255,255,0.6);
      margin: 0 0.5rem;
      font-size: 0.875rem;
    }

    footer a:hover {
      color: #e50914;
    }

    @media (max-width: 600px) {
      .hero-404 { font-size: 5rem; }
      .hero h1 { font-size: 1.5rem; }
      .search-form { flex-direction: column; }
      .channel-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-404">404</div>
    <h1>Sorry, this ${typeLabel.toLowerCase()} is no longer available</h1>
    <p>IPTV channels frequently go offline as source streams change or providers update their feeds. Find something new to watch below.</p>

    <div class="hero-search">
      <h2>Search for channels</h2>
      <form class="search-form" action="${origin}/" method="get">
        <input type="text" name="search" placeholder="Search channels (e.g. BBC, ESPN, CNN...)" aria-label="Search channels">
        <button type="submit">Search</button>
      </form>
    </div>

    <div class="home-actions">
      <a href="${origin}/" class="btn-primary">← Back to Home</a>
      <a href="${origin}/tutorial" class="btn-secondary">How it works</a>
    </div>
  </div>

  <main class="main">
    <div class="why-box">
      <h3>Why am I seeing this page?</h3>
      <p>We index thousands of public IPTV channels from various sources around the world. These channels are provided by third-party broadcasters and their streams can change or become unavailable at any time. When a channel goes offline, we automatically remove it from search results. This is normal — try searching above or browse the categories below to find what you're looking for.</p>
    </div>

    ${featuredChannels.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Popular Channels <a href="${origin}/">View all →</a></h2>
      <div class="channel-grid">
        ${featuredChannels.map(ch => `
          <div class="channel-card">
            <a href="${origin}/channel/${escapeAttr(ch.channel_hash)}">
              ${ch.logo ? `<img src="${escapeAttr(ch.logo)}" alt="${escapeAttr(ch.channel_name)}" loading="lazy">` : '<div class="placeholder">📺</div>'}
              <span>${escapeHtml(ch.channel_name)}</span>
            </a>
          </div>`).join('')}
      </div>
    </section>` : ''}

    ${displayGroups.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Browse by Category</h2>
      <div class="category-list">
        ${displayGroups.map(g => `<a href="${origin}/category/${escapeAttr(g)}" class="category-tag">${escapeHtml(g)}</a>`).join('')}
      </div>
    </section>` : ''}
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} IPTV Search. Free IPTV Channel Directory & Search Tool</p>
    <a href="${origin}/tutorial">How to Watch</a>
    <a href="${origin}/privacy-policy">Privacy Policy</a>
    <a href="${origin}/terms">Terms of Service</a>
  </footer>
</body>
</html>`;

  return new Response(html, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
