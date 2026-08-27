// Type API - GET /api/type/{slug}
// Handles type-based category browsing (AI-classified types)
import { getAllChannels, getAllTypes } from '../../utils/channel-cache.js';

// Type display names (Chinese)
const typeNames = {
  'movie': '电影', 'animation': '动画', 'entertainment': '综艺',
  'sports': '体育', 'news': '新闻', 'kids': '少儿', 'documentary': '纪录',
  'education': '教育', 'drama': '戏曲', 'music': '音乐', 'fashion': '时尚',
  'game': '游戏', 'travel': '旅游', 'food': '美食', 'finance': '财经',
  'tech': '科技', 'health': '健康', 'comprehensive': '综合'
};

// English display names
const typeNamesEn = {
  'movie': 'Movies', 'animation': 'Animation', 'entertainment': 'Entertainment',
  'sports': 'Sports', 'news': 'News', 'kids': 'Kids', 'documentary': 'Documentary',
  'education': 'Education', 'drama': 'Drama', 'music': 'Music', 'fashion': 'Fashion',
  'game': 'Game', 'travel': 'Travel', 'food': 'Food', 'finance': 'Finance',
  'tech': 'Tech', 'health': 'Health', 'comprehensive': 'Comprehensive'
};

// Direct mapping: slug (lowercase type) -> type key
const typeSlugToKey = {};
Object.keys(typeNames).forEach(key => {
  typeSlugToKey[key.toLowerCase()] = key;
});

// Slugify - same as home.js
function slugify(str) {
  if (!str) return '';
  return str
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Handle /api/type/{slug}
 * Returns channels for the specified type (AI-classified)
 */
export async function handleApiType(request, env) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const slug = decodeURIComponent(pathParts[pathParts.length - 1] || '');

    if (!slug) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Type slug is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Resolve slug to type key
    const typeKey = typeSlugToKey[slug];

    if (!typeKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Type not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all channels from KV cache
    const channelsResult = await getAllChannels(env);
    const channels = channelsResult.channels || [];

    // Filter channels by type
    const typeChannels = channels.filter(ch => ch.type === typeKey);

    // Build JSON-LD ItemList
    const itemListElement = typeChannels.map((ch, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': ch.channel_name,
      'url': `${env.APP_URL || 'https://iptv-search.com'}/channel/${slugify(ch.channel_name)}`,
      'image': ch.logo || null,
      'description': ch.type || 'Other'
    }));

    const response = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'numberOfItems': typeChannels.length,
      'itemListElement': itemListElement,
      data: {
        type: typeKey,
        typeName: typeNamesEn[typeKey] || typeKey,
        slug: slug,
        channelCount: typeChannels.length,
        channels: typeChannels.map(ch => ({
          name: ch.channel_name,
          slug: slugify(ch.channel_name),
          hash: ch.channel_hash,
          group: ch.group_title,
          type: ch.type,
          logo: ch.logo
        }))
      }
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('[API Type] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch type data'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
