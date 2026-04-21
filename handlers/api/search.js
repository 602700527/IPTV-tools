// Search API - GET /api/search?q=xxx
import { getAllChannels, getAllGroups } from '../../utils/channel-cache.js';
import { 
  expandQuery, 
  toPinyinInitials, 
  enhancedChannelMatch,
  smartSort 
} from '../../utils/search-utils.js';

function slugify(str) {
  if (!str) return '';
  return str.trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

    // Get all channels and groups from KV cache
    const [{ channels }, { groups }] = await Promise.all([
      getAllChannels(env),
      getAllGroups(env)
    ]);

    // 扩展搜索词（支持同义词）
    const expandedTerms = expandQuery(query);
    const queryPinyin = toPinyinInitials(query).toLowerCase();
    
    // 如果拼音和原始查询不同，也加入拼音搜索
    if (queryPinyin && queryPinyin !== query.toLowerCase()) {
      if (!expandedTerms.includes(queryPinyin)) {
        expandedTerms.push(queryPinyin);
      }
    }

    // 增强搜索匹配
    const matchedChannels = [];
    
    for (const ch of channels) {
      const matchResult = enhancedChannelMatch(ch, expandedTerms);
      if (matchResult.matches) {
        matchedChannels.push({
          channel: ch,
          score: matchResult.score,
          matchType: matchResult.matchType
        });
      }
    }

    // 智能排序
    matchedChannels.sort((a, b) => smartSort(a.channel, b.channel, a.score, b.score));
    
    // 取前100个结果
    const results = matchedChannels.slice(0, 100).map(m => m.channel);

    // Build JSON-LD ItemList
    const itemListElement = results.map((ch, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': ch.channel_name,
      'url': `${env.APP_URL || 'https://iptv-search.com'}/channel/${slugify(ch.channel_name)}`,
      'image': ch.logo || null,
      'description': ch.group_title || 'Other'
    }));

    // If no results, suggest random categories from available groups
    let suggestedCategories = [];
    if (results.length === 0 && groups.length > 0) {
      // Shuffle groups and pick up to 5
      const shuffled = [...groups].sort(() => Math.random() - 0.5);
      suggestedCategories = shuffled.slice(0, 5).map(group => ({
        name: group,
        slug: slugify(group)
      }));
    }

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
        })),
        suggestedCategories: suggestedCategories
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