// Search API - GET /api/search?q=xxx
import { getAllChannels } from '../../utils/channel-cache.js';

/**
 * Handle /api/search
 * Returns search results for the given query
 */
export async function handleApiSearch(request, env) {
  try {
    const url = new URL(request.url);
    const query = (url.searchParams.get('q') || '').trim();

    if (!query) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Query parameter "q" is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all channels from KV cache
    const { channels } = await getAllChannels(env);
    const queryLower = query.toLowerCase();

    // Filter channels matching query
    const results = channels.filter(ch => {
      const name = (ch.channel_name || '').toLowerCase();
      const group = (ch.group_title || '').toLowerCase();
      return name.includes(queryLower) || group.includes(queryLower);
    }).slice(0, 100); // Limit to 100 results

    // Build JSON-LD ItemList
    const itemListElement = results.map((ch, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': ch.channel_name,
      'url': `${env.APP_URL || 'https://iptv-search.com'}/channel/${ch.channel_hash}`,
      'image': ch.logo || null,
      'description': ch.group_title || 'Other'
    }));

    const response = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'numberOfItems': results.length,
      'itemListElement': itemListElement,
      data: {
        query: query,
        totalResults: results.length,
        results: results.map(ch => ({
          name: ch.channel_name,
          hash: ch.channel_hash,
          group: ch.group_title,
          logo: ch.logo
        }))
      }
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    console.error('[API Search] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Search failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}