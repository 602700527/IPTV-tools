// 频道 KV 缓存管理
import { getDB } from '../database.js';
import { toPinyinInitials } from './search-utils.js';

const CHANNELS_CACHE_KEY = 'channels_cache';
const GROUPS_CACHE_KEY = 'groups_cache';
const CACHE_VERSION_KEY = 'channels_cache_version';
const SITEMAP_CACHE_KEY = 'sitemap_xml';
const CHANNEL_GROUPS_KEY = 'channel_groups';  // 按分组存储的频道

// ===== 内存缓存（避免每次搜索都读 KV / 回退 D1）=====
// 数据源：同步定时任务写入 KV 后，同时写入内存
// TTL：5 分钟，过期后重新从 KV 加载
const CHANNELS_MEMORY_CACHE = new Map();
const GROUPS_MEMORY_CACHE = new Map();
const MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 分钟

function isMemoryCacheValid(cache) {
  const entry = cache.get('data');
  return entry && (Date.now() - entry.timestamp < MEMORY_CACHE_TTL);
}

function getMemoryEntry(cache) {
  const entry = cache.get('data');
  return entry && isMemoryCacheValid(cache) ? entry.value : null;
}

function setMemoryEntry(cache, value) {
  cache.set('data', { value, timestamp: Date.now() });
}

/**
 * Slugify function for SEO-friendly URLs
 */
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
 * 将所有频道数据缓存到 KV
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{success: boolean, channels: number, groups: number}>}
 */
export async function cacheChannelsToKV(env) {
  try {
    const db = getDB();

    // 查询所有频道（只包括启用的源和启用的频道）
    const channels = await db.prepare(`
      SELECT
        c.id,
        c.channel_name,
        c.group_title,
        c.type,
        c.description,
        c.logo,
        c.play_url,
        c.headers,
        c.channel_hash,
        c.is_active,
        c.source_id,
        c.original,
        s.name as source_name,
        s.is_active as source_active
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE c.is_active = 1
        AND s.is_active = 1
    `).all();

    // 查询所有分组（只包括启用的源）
    const groupsResult = await db.prepare(`
      SELECT DISTINCT c.group_title
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE c.group_title IS NOT NULL
        AND c.group_title != ''
        AND c.is_active = 1
        AND s.is_active = 1
      ORDER BY c.group_title
    `).all();

    const groups = (groupsResult.results || []).map(r => r.group_title);

    // 生成缓存版本号
    const version = Date.now();

    // 预计算拼音字段，加速搜索匹配
    const channelsWithPinyin = (channels.results || []).map(ch => ({
      ...ch,
      name_pinyin: toPinyinInitials(ch.channel_name || '').toLowerCase(),
      group_pinyin: toPinyinInitials(ch.group_title || '').toLowerCase()
    }));

    // 批量写入 KV
    const cacheData = {
      version,
      channels: channelsWithPinyin,
      groups,
      cached_at: new Date().toISOString()
    };

    // 一次性写入所有数据（批量写入）
    await env.KV.put(CHANNELS_CACHE_KEY, JSON.stringify(cacheData), {
      expirationTtl: 24 * 60 * 60 // 24 小时缓存
    });

    // 单独缓存分组列表
    await env.KV.put(GROUPS_CACHE_KEY, JSON.stringify({
      version,
      groups,
      cached_at: new Date().toISOString()
    }), {
      expirationTtl: 24 * 60 * 60
    });

    // 保存版本号
    await env.KV.put(CACHE_VERSION_KEY, version.toString(), {
      expirationTtl: 24 * 60 * 60
    });

    // 按分组存储频道（加速搜索）
    const groupedChannels = {};
    for (const ch of channelsWithPinyin) {
      const group = ch.group_title || 'Other';
      if (!groupedChannels[group]) {
        groupedChannels[group] = [];
      }
      groupedChannels[group].push(ch);
    }

    // 批量写入分组频道到 KV
    const groupKeys = Object.keys(groupedChannels);
    for (const group of groupKeys) {
      await env.KV.put(`${CHANNEL_GROUPS_KEY}:${group}`, JSON.stringify({
        version,
        channels: groupedChannels[group],
        cached_at: new Date().toISOString()
      }), {
        expirationTtl: 24 * 60 * 60
      });
    }

    // 存储分组索引（group_name -> key mapping）
    const groupIndex = {};
    for (const group of groupKeys) {
      groupIndex[group] = `${CHANNEL_GROUPS_KEY}:${group}`;
    }
    await env.KV.put(`${CHANNEL_GROUPS_KEY}_index`, JSON.stringify({
      version,
      groups: groupIndex,
      cached_at: new Date().toISOString()
    }), {
      expirationTtl: 24 * 60 * 60
    });

    console.log(`[ChannelCache] Cached ${channels.results?.length || 0} channels and ${groups.length} groups to KV`);

    // ===== 同时填充内存缓存（避免搜索时重复读 KV）=====
    setMemoryEntry(CHANNELS_MEMORY_CACHE, {
      channels: channelsWithPinyin,
      groups,
      version,
      cached_at: new Date().toISOString()
    });
    setMemoryEntry(GROUPS_MEMORY_CACHE, {
      groups,
      version,
      cached_at: new Date().toISOString()
    });

    return {
      success: true,
      channels: channels.results?.length || 0,
      groups: groups.length,
      version
    };
  } catch (error) {
    console.error('[ChannelCache] Failed to cache channels:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 从 KV 获取频道缓存
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{channels: Array, groups: Array, version: number, fromCache: boolean}>}
 */
export async function getChannelsFromCache(env) {
  try {
    // 尝试从 KV 获取
    const cacheData = await env.KV.get(CHANNELS_CACHE_KEY, { type: 'json' });

    if (cacheData && cacheData.channels) {
      console.log(`[ChannelCache] Got ${cacheData.channels.length} channels from KV (version: ${cacheData.version})`);
      return {
        channels: cacheData.channels,
        groups: cacheData.groups,
        version: cacheData.version,
        fromCache: true,
        cached_at: cacheData.cached_at
      };
    }

    console.log('[ChannelCache] No cache found in KV');
    return null;
  } catch (error) {
    console.error('[ChannelCache] Failed to get channels from cache:', error);
    return null;
  }
}

/**
 * 从 KV 获取分组缓存
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{groups: Array, version: number, fromCache: boolean}>}
 */
export async function getGroupsFromCache(env) {
  try {
    const cacheData = await env.KV.get(GROUPS_CACHE_KEY, { type: 'json' });

    if (cacheData && cacheData.groups) {
      console.log(`[ChannelCache] Got ${cacheData.groups.length} groups from KV`);
      return {
        groups: cacheData.groups,
        version: cacheData.version,
        fromCache: true,
        cached_at: cacheData.cached_at
      };
    }

    return null;
  } catch (error) {
    console.error('[ChannelCache] Failed to get groups from cache:', error);
    return null;
  }
}

/**
 * 获取频道信息（优先从 KV）
 * @param {Object} env - Cloudflare Workers 环境
 * @param {string} channelHash - 频道哈希
 * @returns {Promise<Object|null>}
 */
export async function getChannelByHash(env, channelHash) {
  try {
    // 尝试从 KV 缓存获取
    const cacheData = await env.KV.get(CHANNELS_CACHE_KEY, { type: 'json' });

    if (cacheData && cacheData.channels) {
      const channel = cacheData.channels.find(c => c.channel_hash === channelHash);
      if (channel) {
        console.log(`[ChannelCache] Got channel ${channelHash} from KV cache`);
        return channel;
      }
    }

    // KV 中没有，从数据库查询
    const db = getDB();
    const channel = await db.prepare(`
      SELECT
        c.id,
        c.channel_name,
        c.group_title,
        c.type,
        c.description,
        c.logo,
        c.play_url,
        c.headers,
        c.channel_hash,
        c.is_active,
        c.source_id,
        s.name as source_name,
        s.is_active as source_active
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE c.channel_hash = ?
        AND c.is_active = 1
        AND s.is_active = 1
    `).bind(channelHash).first();

    return channel;
  } catch (error) {
    console.error('[ChannelCache] Failed to get channel:', error);
    return null;
  }
}

/**
 * 获取所有频道（优先从内存缓存 → KV → 数据库）
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{channels: Array, fromCache: boolean}>}
 */
export async function getAllChannels(env) {
  try {
    // 1. 先检查内存缓存（避免 KV 读取和 D1 查询）
    const memEntry = getMemoryEntry(CHANNELS_MEMORY_CACHE);
    if (memEntry && memEntry.channels) {
      return {
        channels: memEntry.channels,
        fromCache: true
      };
    }

    // 2. 从 KV 获取
    let cacheData = null;
    if (env && env.KV) {
      try {
        cacheData = await env.KV.get(CHANNELS_CACHE_KEY, { type: 'json' });
      } catch (kvError) {
        console.warn('[ChannelCache] KV get failed, falling back to DB:', kvError.message);
      }
    }

    if (cacheData && cacheData.channels) {
      // 写入内存缓存，避免下次再读 KV
      setMemoryEntry(CHANNELS_MEMORY_CACHE, cacheData);
      return {
        channels: cacheData.channels,
        fromCache: true
      };
    }

    // 3. KV 中没有，最后才从数据库查询
    const db = getDB();
    const result = await db.prepare(`
      SELECT
        c.id,
        c.channel_name,
        c.group_title,
        c.type,
        c.description,
        c.logo,
        c.play_url,
        c.headers,
        c.channel_hash,
        c.is_active,
        c.source_id,
        c.original,
        s.name as source_name,
        s.is_active as source_active
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE c.is_active = 1
        AND s.is_active = 1
    `).all();

    const channels = result.results || [];
    // 写入内存缓存（避免下次查 D1）
    if (channels.length > 0) {
      setMemoryEntry(CHANNELS_MEMORY_CACHE, {
        channels,
        groups: [],
        version: Date.now(),
        cached_at: new Date().toISOString()
      });
    }

    return {
      channels,
      fromCache: false
    };
  } catch (error) {
    console.error('[ChannelCache] Failed to get all channels:', error);
    return {
      channels: [],
      fromCache: false
    };
  }
}

/**
 * 获取所有类型（优先从 KV）
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{types: Array, fromCache: boolean}>}
 */
export async function getAllTypes(env) {
  const TYPES_CACHE_KEY = 'types_cache';

  try {
    // 尝试从 KV 获取
    let cacheData = null;
    if (env && env.KV) {
      try {
        cacheData = await env.KV.get(TYPES_CACHE_KEY, { type: 'json' });
      } catch (kvError) {
        console.warn('[ChannelCache] KV get failed for types, falling back to DB:', kvError.message);
      }
    }

    if (cacheData && cacheData.types) {
      return {
        types: cacheData.types,
        fromCache: true
      };
    }

    // KV 中没有，从数据库查询
    const db = getDB();
    const result = await db.prepare(`
      SELECT DISTINCT c.type
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE c.type IS NOT NULL
        AND c.type != ''
        AND c.is_active = 1
        AND s.is_active = 1
      ORDER BY c.type
    `).all();

    const types = (result.results || []).map(r => r.type);

    // 缓存到 KV
    if (env && env.KV && types.length > 0) {
      try {
        await env.KV.put(TYPES_CACHE_KEY, JSON.stringify({
          types,
          cached_at: new Date().toISOString()
        }), {
          expirationTtl: 24 * 60 * 60 // 24 小时
        });
      } catch (kvError) {
        console.warn('[ChannelCache] KV put failed for types:', kvError.message);
      }
    }

    return {
      types,
      fromCache: false
    };
  } catch (error) {
    console.error('[ChannelCache] Failed to get all types:', error);
    return {
      types: [],
      fromCache: false
    };
  }
}

/**
 * 获取所有分组（优先从内存缓存 → KV → 数据库）
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{groups: Array, fromCache: boolean}>}
 */
export async function getAllGroups(env) {
  try {
    // 1. 先检查内存缓存
    const memEntry = getMemoryEntry(GROUPS_MEMORY_CACHE);
    if (memEntry && memEntry.groups) {
      return {
        groups: memEntry.groups,
        fromCache: true
      };
    }

    // 2. 从 KV 获取
    let cacheData = null;
    if (env && env.KV) {
      try {
        cacheData = await env.KV.get(GROUPS_CACHE_KEY, { type: 'json' });
      } catch (kvError) {
        console.warn('[ChannelCache] KV get failed, falling back to DB:', kvError.message);
      }
    }

    if (cacheData && cacheData.groups) {
      setMemoryEntry(GROUPS_MEMORY_CACHE, cacheData);
      return {
        groups: cacheData.groups,
        fromCache: true
      };
    }

    // 3. KV 中没有，从数据库查询
    const db = getDB();
    const result = await db.prepare(`
      SELECT DISTINCT c.group_title
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE c.group_title IS NOT NULL
        AND c.group_title != ''
        AND c.is_active = 1
        AND s.is_active = 1
      ORDER BY c.group_title
    `).all();

    const groups = (result.results || []).map(r => r.group_title);
    // 写入内存缓存
    if (groups.length > 0) {
      setMemoryEntry(GROUPS_MEMORY_CACHE, {
        groups,
        version: Date.now(),
        cached_at: new Date().toISOString()
      });
    }

    return {
      groups,
      fromCache: false
    };
  } catch (error) {
    console.error('[ChannelCache] Failed to get groups:', error);
    return {
      groups: [],
      fromCache: false
    };
  }
}

/**
 * 按分组获取频道（优先从内存缓存 → KV）
 * @param {Object} env - Cloudflare Workers 环境
 * @param {string} groupName - 分组名称
 * @returns {Promise<{channels: Array, fromCache: boolean}>}
 */
export async function getChannelsByGroup(env, groupName) {
  try {
    // 1. 先从主内存缓存过滤（避免 KV 读取）
    const memEntry = getMemoryEntry(CHANNELS_MEMORY_CACHE);
    if (memEntry && memEntry.channels) {
      const filtered = memEntry.channels.filter(ch => ch.group_title === groupName);
      if (filtered.length > 0) {
        return {
          channels: filtered,
          fromCache: true
        };
      }
    }

    // 2. 从 KV 获取分组缓存
    const key = `${CHANNEL_GROUPS_KEY}:${groupName}`;
    let cacheData = null;
    if (env && env.KV) {
      try {
        cacheData = await env.KV.get(key, { type: 'json' });
      } catch (kvError) {
        console.warn('[ChannelCache] KV get failed for group:', kvError.message);
      }
    }

    if (cacheData && cacheData.channels) {
      return {
        channels: cacheData.channels,
        fromCache: true
      };
    }

    // 3. 如果分组缓存不存在，从主缓存获取并过滤
    const mainCacheData = await getAllChannels(env);
    if (mainCacheData.fromCache && mainCacheData.channels.length > 0) {
      const filtered = mainCacheData.channels.filter(
        ch => ch.group_title === groupName
      );
      return {
        channels: filtered,
        fromCache: true
      };
    }

    return { channels: [], fromCache: false };
  } catch (error) {
    console.error('[ChannelCache] Failed to get channels by group:', error);
    return { channels: [], fromCache: false };
  }
}

/**
 * 清空频道缓存（KV + 内存）
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<boolean>}
 */
export async function clearChannelCache(env) {
  try {
    await env.KV.delete(CHANNELS_CACHE_KEY);
    await env.KV.delete(GROUPS_CACHE_KEY);
    await env.KV.delete(CACHE_VERSION_KEY);
    // 同时清空内存缓存
    CHANNELS_MEMORY_CACHE.clear();
    GROUPS_MEMORY_CACHE.clear();
    console.log('[ChannelCache] Cache cleared (KV + memory)');
    return true;
  } catch (error) {
    console.error('[ChannelCache] Failed to clear cache:', error);
    return false;
  }
}

/**
 * 获取缓存状态
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{version: string|null, channelsCached: boolean, groupsCached: boolean}>}
 */
export async function getCacheStatus(env) {
  try {
    const version = await env.KV.get(CACHE_VERSION_KEY);
    
    // 优化：只检查缓存是否存在，不读取完整数据（避免大 JSON 解析慢）
    const [channelsCached, groupsCached, cachedAt] = await Promise.all([
      env.KV.get(CHANNELS_CACHE_KEY) !== null,
      env.KV.get(GROUPS_CACHE_KEY) !== null,
      env.KV.get(CACHE_VERSION_KEY)
    ]);
    
    // 只获取计数（不解析完整 JSON）
    let channelsCount = 0;
    let groupsCount = 0;
    try {
      const channelsData = await env.KV.get(CHANNELS_CACHE_KEY, { type: 'json' });
      channelsCount = channelsData?.channels?.length || 0;
    } catch (e) {
      channelsCount = 0;
    }
    try {
      const groupsData = await env.KV.get(GROUPS_CACHE_KEY, { type: 'json' });
      groupsCount = groupsData?.groups?.length || 0;
    } catch (e) {
      groupsCount = 0;
    }

    return {
      version: version || null,
      channelsCached,
      groupsCached,
      channelsCount,
      groupsCount,
      cachedAt: version || null
    };
  } catch (error) {
    console.error('[ChannelCache] Failed to get cache status:', error);
    return {
      version: null,
      channelsCached: false,
      groupsCached: false,
      channelsCount: 0,
      groupsCount: 0
    };
  }
}

/**
 * 生成sitemap XML并缓存到KV
 * 在数据源同步后调用
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function generateAndCacheSitemap(env) {
  try {
    const db = getDB();
    const baseUrl = env.APP_URL || 'https://iptv-search.com';
    const today = new Date().toISOString().split('T')[0];
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // 静态页面
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/favorites', priority: '0.8', changefreq: 'weekly' },
      { loc: '/plans', priority: '0.8', changefreq: 'weekly' },
      { loc: '/account', priority: '0.6', changefreq: 'monthly' },
      { loc: '/tutorial', priority: '0.7', changefreq: 'monthly' },
      { loc: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
      { loc: '/terms', priority: '0.5', changefreq: 'yearly' },
      { loc: '/usa-iptv', priority: '0.8', changefreq: 'weekly' },
      { loc: '/uk-iptv-plans', priority: '0.8', changefreq: 'weekly' },
      { loc: '/android-iptv-app', priority: '0.8', changefreq: 'weekly' },
      { loc: '/free-iptv-app-review', priority: '0.8', changefreq: 'weekly' }
    ];
    
    staticPages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page.loc}</loc>\n`;
      sitemap += `    <lastmod>${today}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });
    
    // 获取所有分类
    const categoriesResult = await db.prepare(`
      SELECT DISTINCT group_title as category, COUNT(*) as count 
      FROM channels 
      WHERE is_active = 1 AND group_title IS NOT NULL AND group_title != ''
      GROUP BY group_title 
      ORDER BY count DESC
    `).all();
    
    const categories = categoriesResult.results || [];
    
    categories.forEach(cat => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/category/${encodeURIComponent(cat.category)}</loc>\n`;
      sitemap += `    <lastmod>${today}</lastmod>\n`;
      sitemap += '    <changefreq>daily</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });
    
    // 获取频道：每个分类至少1个，最多5000
    const channelsResult = await db.prepare(`
      SELECT c.channel_hash as hash, c.channel_name as name, c.group_title 
      FROM channels c
      WHERE c.is_active = 1
      ORDER BY c.group_title, c.id DESC
    `).all();
    
    const channels = channelsResult.results || [];
    
    // 按分类组织，确保每个分类至少1个
    const categorySeen = new Set();
    const selectedChannels = [];
    
    for (const ch of channels) {
      if (!categorySeen.has(ch.group_title)) {
        selectedChannels.push(ch);
        categorySeen.add(ch.group_title);
        if (selectedChannels.length >= 5000) break;
      }
    }
    
    // 如果还没到5000，随机补充其他频道
    if (selectedChannels.length < 5000) {
      const otherChannels = channels.filter(ch => !selectedChannels.some(s => s.hash === ch.hash));
      for (const ch of otherChannels) {
        selectedChannels.push(ch);
        if (selectedChannels.length >= 5000) break;
      }
    }
    
    selectedChannels.forEach(ch => {
      const channelSlug = slugify(ch.name || '');
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/channel/${channelSlug}</loc>\n`;
      sitemap += `    <lastmod>${today}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.7</priority>\n';
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    
    // 缓存到KV，24小时
    await env.KV.put(SITEMAP_CACHE_KEY, sitemap, {
      expirationTtl: 24 * 60 * 60 // 24小时
    });
    
    console.log(`[ChannelCache] Sitemap cached to KV (${sitemap.length} bytes)`);
    
    return { success: true };
  } catch (error) {
    console.error('[ChannelCache] Failed to generate sitemap:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 从KV获取sitemap
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{sitemap: string|null, fromCache: boolean}>}
 */
export async function getSitemapFromCache(env) {
  try {
    const sitemap = await env.KV.get(SITEMAP_CACHE_KEY);
    
    if (sitemap) {
      console.log('[ChannelCache] Sitemap read from KV cache');
      return { sitemap, fromCache: true };
    }
    
    console.log('[ChannelCache] Sitemap not found in KV');
    return { sitemap: null, fromCache: false };
  } catch (error) {
    console.error('[ChannelCache] Failed to get sitemap from KV:', error);
    return { sitemap: null, fromCache: false };
  }
}
