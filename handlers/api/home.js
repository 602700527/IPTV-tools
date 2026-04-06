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
  'other': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 19h10M12 19v-3"/></svg>'
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

    // Calculate channel count per group
    const groupCounts = {};
    channels.forEach(ch => {
      const group = ch.group_title || 'Other';
      groupCounts[group] = (groupCounts[group] || 0) + 1;
    });

    // Build categories array
    const categories = groups.slice(0, 20).map(g => {
      const slug = slugify(g);
      return {
        name: g,
        slug: slug,
        count: groupCounts[g] || 0,
        icon: categorySVGs[slug.toLowerCase()] || categorySVGs['other']
      };
    });

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
        categories: categories,
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
      headers: { 'Content-Type': 'application/json' }
    });
  }
}