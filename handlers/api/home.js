// Home API - GET /api/home
import { getAllChannels, getAllGroups } from '../../utils/channel-cache.js';

// Slugify - 和 seo-handler.js 保持一致
function slugify(str) {
  if (!str) return '';
  return str
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Category SVG icons
const categorySVGs = {
  'cctv': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 19h10M12 19v-3"/></svg>',
  'sports': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9z"/></svg>',
  'news': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/></svg>',
  'movie': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2.5"/><path d="M2 7l5 3-5 3V7zM12 4v13M22 7l-5 3 5 3V7z"/></svg>',
  'entertainment': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20M10 4v4M14 4v4"/></svg>',
  'music': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  'kids': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>',
  'animation': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  'documentary': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  'education': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  'drama': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  'fashion': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  'game': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h.01M10 12h.01M6 9v6M10 9v6M18 9v6M18 12h.01"/></svg>',
  'travel': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  'food': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>',
  'finance': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  'tech': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>',
  'health': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
  'other': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 19h10M12 19v-3"/></svg>'
};

// Type display names (Chinese) and English labels
const typeNames = {
  'movie': '电影', 'animation': '动画', 'entertainment': '综艺',
  'sports': '体育', 'news': '新闻', 'kids': '少儿', 'documentary': '纪录',
  'education': '教育', 'drama': '戏曲', 'music': '音乐', 'fashion': '时尚',
  'game': '游戏', 'travel': '旅游', 'food': '美食', 'finance': '财经',
  'tech': '科技', 'health': '健康', 'comprehensive': '综合'
};

// English display names for homepage
const typeNamesEn = {
  'movie': 'Movies', 'animation': 'Animation', 'entertainment': 'Entertainment',
  'sports': 'Sports', 'news': 'News', 'kids': 'Kids', 'documentary': 'Documentary',
  'education': 'Education', 'drama': 'Drama', 'music': 'Music', 'fashion': 'Fashion',
  'game': 'Game', 'travel': 'Travel', 'food': 'Food', 'finance': 'Finance',
  'tech': 'Tech', 'health': 'Health', 'comprehensive': 'Comprehensive'
};

// Type colors for visual distinction
const typeColors = {
  'movie': '#e50914',
  'animation': '#ff6b35',
  'entertainment': '#f7b32b',
  'sports': '#2ec4b6',
  'news': '#3a86ff',
  'kids': '#ff006e',
  'documentary': '#8338ec',
  'education': '#06d6a0',
  'drama': '#fb5607',
  'music': '#ffbe0b',
  'fashion': '#ff006e',
  'game': '#00f5d4',
  'travel': '#00bbf9',
  'food': '#f15bb5',
  'finance': '#fee440',
  'tech': '#9b5de5',
  'health': '#00ff87',
  'comprehensive': '#666666'
};

/**
 * Handle /api/home
 * Returns homepage data with categories and stats
 */
export async function handleApiHome(request, env) {
  try {
    // Get all channels and groups from KV cache
    const [channelsResult, groupsResult] = await Promise.all([
      getAllChannels(env),
      getAllGroups(env)
    ]);

    const channels = channelsResult.channels || [];
    const groups = groupsResult.groups || [];

    // ========== Region-based categories (existing) ==========
    const groupCounts = {};
    channels.forEach(ch => {
      const group = ch.group_title || 'Other';
      groupCounts[group] = (groupCounts[group] || 0) + 1;
    });

    const regionCategories = groups.map(g => {
      const slug = slugify(g);
      return {
        name: g,
        slug: slug,
        count: groupCounts[g] || 0,
        icon: categorySVGs[slug.toLowerCase()] || categorySVGs['other']
      };
    });

    // ========== Type-based categories (new) ==========
    const typeCounts = {};
    channels.forEach(ch => {
      const type = ch.type || 'comprehensive';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const typeCategories = Object.keys(typeCounts).map(type => {
      const slug = type.toLowerCase();
      return {
        name: typeNamesEn[type] || typeNamesEn['comprehensive'],
        type: type,
        slug: slug,
        count: typeCounts[type] || 0,
        icon: categorySVGs[slug] || categorySVGs['other'],
        color: typeColors[type] || typeColors['comprehensive']
      };
    }).sort((a, b) => b.count - a.count); // Sort by count descending

    // Featured channels (first 12 with logos)
    const featuredChannels = channels
      .filter(ch => ch.logo)
      .slice(0, 12)
      .map(ch => ({
        name: ch.channel_name,
        hash: ch.channel_hash,
        group: ch.group_title,
        logo: ch.logo
      }));

    const response = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'IPTV Search',
      description: 'Free IPTV Channel Directory and Search Engine',
      url: env.APP_URL || 'https://iptv-search.com',
      data: {
        totalChannels: channels.length,
        totalGroups: groups.length,
        regionCategories: regionCategories,
        typeCategories: typeCategories,
        featuredChannels: featuredChannels
      }
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('[API Home] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch home data'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}