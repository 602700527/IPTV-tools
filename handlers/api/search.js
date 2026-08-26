// Search API - GET /api/search?q=xxx
import { getAllChannels, getAllGroups, getChannelsByGroup } from '../../utils/channel-cache.js';
import {
  expandQuery,
  enhancedChannelMatch,
  smartSort
} from '../../utils/search-utils.js';
import { getDB } from '../../database.js';

const SEARCH_CACHE_KEY = 'search_cache:';
const SEARCH_CACHE_TTL = 300; // 5分钟缓存
const FREE_SEARCH_LIMIT = 10; // 免费用户搜索结果限制数量

function slugify(str) {
  if (!str) return '';
  return str.trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 计算搜索词的缓存key
function getSearchCacheKey(query, isVip) {
  const normalized = query.toLowerCase().trim();
  // VIP和免费用户用不同缓存key，避免缓存污染
  return SEARCH_CACHE_KEY + normalized + (isVip ? ':vip' : ':free');
}

/**
 * 检查用户是否是VIP（付费订阅用户）
 */
async function checkUserVipStatus(token) {
  try {
    const db = getDB();
    // 验证token并获取用户信息
    const session = await db.prepare(`
      SELECT u.id, u.email, s.expires_at as session_expires
      FROM users u
      JOIN user_sessions s ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first();

    if (!session) return { isVip: false, reason: 'invalid_session' };

    // 检查是否有有效订阅（通过user_orders表）
    const activeOrder = await db.prepare(`
      SELECT o.code, c.duration_days, c.expired_at
      FROM user_orders o
      LEFT JOIN codes c ON o.code = c.code
      WHERE o.user_id = ? 
        AND o.status = 'completed'
        AND (c.expired_at IS NULL OR c.expired_at > datetime('now'))
      ORDER BY o.created_at DESC
      LIMIT 1
    `).bind(session.id).first();

    return {
      isVip: !!activeOrder,
      userId: session.id,
      userEmail: session.email,
      reason: activeOrder ? 'vip' : 'free_user'
    };
  } catch (e) {
    console.error('[Search VIP Check] Error:', e.message);
    return { isVip: false, reason: 'error' };
  }
}

/**
 * Handle /api/search
 * Returns search results for the given query
 * VIP用户无限制，免费用户限制前5条
 */
export async function handleApiSearch(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
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

    // 检查用户登录状态和VIP身份
    const authHeader = request.headers.get('Authorization');
    let isVip = false;
    let userId = null;
    let userEmail = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const vipStatus = await checkUserVipStatus(token);
      isVip = vipStatus.isVip;
      userId = vipStatus.userId;
      userEmail = vipStatus.userEmail;
    }

    // 尝试从缓存获取搜索结果
    const cacheKey = getSearchCacheKey(query, isVip);
    try {
      const cached = await env.KV.get(cacheKey, { type: 'json' });
      if (cached) {
        console.log('[API Search] Cache hit for query:', query, 'isVip:', isVip);
        // 添加元信息
        cached.meta = {
          isVip,
          isLimited: !isVip && cached.data?.totalResults > FREE_SEARCH_LIMIT,
          freeLimit: FREE_SEARCH_LIMIT,
          userId: userId,
          userEmail: userEmail
        };
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

    const matchedGroup = groups.find(g => {
      const groupLower = g.toLowerCase();
      return expandedTerms.some(term => groupLower.includes(term) || term.includes(groupLower));
    });

    if (matchedGroup) {
      const groupResult = await getChannelsByGroup(env, matchedGroup);
      if (groupResult.fromCache && groupResult.channels.length > 0) {
        channelsToSearch = groupResult.channels;
        searchedByGroup = true;
        console.log(`[API Search] Group-based search: "${matchedGroup}", channels: ${channelsToSearch.length}`);
      } else {
        const allChannelsResult = await getAllChannels(env);
        channelsToSearch = allChannelsResult.channels;
        console.log(`[API Search] Group cache miss, falling back to full search`);
      }
    } else {
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
    
    // 计算实际返回数量
    const maxResults = isVip ? 100 : FREE_SEARCH_LIMIT;
    const results = matchedChannels.slice(0, maxResults).map(m => m.channel);
    const totalResults = matchedChannels.length;
    const isLimited = !isVip && totalResults > FREE_SEARCH_LIMIT;

    // Build JSON-LD ItemList
    const itemListElement = results.map((ch, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': ch.channel_name,
      'url': `${origin}/channel/${slugify(ch.channel_name)}`,
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
        totalResults: totalResults,
        results: results.map(ch => ({
          name: ch.channel_name,
          slug: slugify(ch.channel_name),
          hash: ch.channel_hash,
          group: ch.group_title,
          logo: ch.logo
        })),
        suggestedCategories: suggestedCategories,
        // 新增元信息
        isVip: isVip,
        isLimited: isLimited,
        freeLimit: FREE_SEARCH_LIMIT,
        userId: userId,
        userEmail: userEmail
      }
    };

    // 缓存搜索结果（异步，不阻塞响应）
    env.KV.put(cacheKey, JSON.stringify(response), { 
      expirationTtl: SEARCH_CACHE_TTL 
    }).catch(e => console.warn('[API Search] Cache write failed:', e.message));

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('[API Search] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Search failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export { FREE_SEARCH_LIMIT };
