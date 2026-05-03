// Search API - GET /api/search?q=xxx
import { getAllChannels, getAllGroups, getChannelsByGroup } from '../../utils/channel-cache.js';
import {
  expandQuery,
  enhancedChannelMatch,
  smartSort
} from '../../utils/search-utils.js';

const SEARCH_CACHE_KEY = 'search_cache:';
const SEARCH_CACHE_TTL = 300; // 5分钟缓存

function slugify(str) {
  if (!str) return '';
  return str.trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 计算搜索词的缓存key
function getSearchCacheKey(query) {
  const normalized = query.toLowerCase().trim();
  return SEARCH_CACHE_KEY + normalized;
}

/**
 * Handle /api/search
 * Returns search results for the given query
 * 使用搜索结果缓存，避免重复计算
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

    // 尝试从缓存获取搜索结果
    const cacheKey = getSearchCacheKey(query);
    try {
      const cached = await env.KV.get(cacheKey, { type: 'json' });
      if (cached) {
        console.log('[API Search] Cache hit for query:', query);
        return new Response(JSON.stringify(cached), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300'
          }
        });
      }
    } catch (e) {
      console.warn('[API Search] Cache read failed:', e.message);
    }

    // 缓存未命中，执行搜索
    const [{ groups }] = await Promise.all([
      getAllGroups(env)
    ]);

    // 扩展搜索词（支持同义词）
    const expandedTerms = expandQuery(query);

    // 尝试按分组缩小搜索范围
    let channelsToSearch = [];
    let searchedByGroup = false;

    // 使用扩展后的搜索词检查匹配到哪个分组
    const matchedGroup = groups.find(g => {
      const groupLower = g.toLowerCase();
      return expandedTerms.some(term => groupLower.includes(term) || term.includes(groupLower));
    });

    if (matchedGroup) {
      // 如果匹配到分组，只搜索该分组
      const groupResult = await getChannelsByGroup(env, matchedGroup);
      if (groupResult.fromCache && groupResult.channels.length > 0) {
        channelsToSearch = groupResult.channels;
        searchedByGroup = true;
        console.log(`[API Search] Group-based search: "${matchedGroup}", channels: ${channelsToSearch.length}`);
      } else {
        // 分组缓存不存在，fallback 到全量
        const allChannelsResult = await getAllChannels(env);
        channelsToSearch = allChannelsResult.channels;
        console.log(`[API Search] Group cache miss, falling back to full search`);
      }
    } else {
      // 没有匹配到分组，直接返回空结果（数据不存在，无需搜索全量）
      console.log(`[API Search] No group matched for query "${query}", returning empty results`);
      channelsToSearch = [];
    }

    // 增强搜索匹配
    const matchedChannels = [];

    for (const ch of channelsToSearch) {
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
          slug: slugify(ch.channel_name),
          hash: ch.channel_hash,
          group: ch.group_title,
          logo: ch.logo
        })),
        suggestedCategories: suggestedCategories
      }
    };

    // 缓存搜索结果（异步，不阻塞响应）
    env.KV.put(cacheKey, JSON.stringify(response), { 
      expirationTtl: SEARCH_CACHE_TTL 
    }).catch(e => console.warn('[API Search] Cache write failed:', e.message));

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