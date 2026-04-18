// Category API - GET /api/category/{slug}
import { getAllChannels, getAllGroups } from '../../utils/channel-cache.js';

// Slugify - 将字符串转换为 URL 友好的 slug
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
 * Handle /api/category/{slug}
 * Returns channels for the specified category
 */
export async function handleApiCategory(request, env) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const slug = decodeURIComponent(pathParts[pathParts.length - 1] || '');

    if (!slug) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Category slug is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all channels and groups from KV cache
    const [channelsResult, groupsResult] = await Promise.all([
      getAllChannels(env),
      getAllGroups(env)
    ]);

    const channels = channelsResult.channels || [];
    const groups = groupsResult.groups || [];

    // Find matching group by slug
    const matchedGroup = groups.find(g => slugify(g) === slug);

    if (!matchedGroup) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Category not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Filter channels by this group
    const categoryChannels = channels.filter(ch => ch.group_title === matchedGroup);

    // Build JSON-LD ItemList (using slug for SEO-friendly URLs)
    const itemListElement = categoryChannels.map((ch, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': ch.channel_name,
      'url': `${env.APP_URL || 'https://iptv-search.com'}/channel/${slugify(ch.channel_name)}`,
      'image': ch.logo || null,
      'description': ch.group_title || 'Other'
    }));

    const response = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'numberOfItems': categoryChannels.length,
      'itemListElement': itemListElement,
      data: {
        category: matchedGroup,
        slug: slug,
        channelCount: categoryChannels.length,
        channels: categoryChannels.map(ch => ({
          name: ch.channel_name,
          slug: slugify(ch.channel_name),
          hash: ch.channel_hash,
          group: ch.group_title,
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
    console.error('[API Category] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch category data'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}