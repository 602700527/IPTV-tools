// 频道 KV 缓存管理
import { getDB } from '../database.js';

const CHANNELS_CACHE_KEY = 'channels_cache';
const GROUPS_CACHE_KEY = 'groups_cache';
const CACHE_VERSION_KEY = 'channels_cache_version';

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

    // 批量写入 KV
    const cacheData = {
      version,
      channels: channels.results || [],
      groups,
      cached_at: new Date().toISOString()
    };

    // 一次性写入所有数据（批量写入）
    await env.KV.put(CHANNELS_CACHE_KEY, JSON.stringify(cacheData), {
      expirationTtl: 24 * 60 * 60 // 24 小时
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

    console.log(`[ChannelCache] Cached ${channels.results?.length || 0} channels and ${groups.length} groups to KV`);

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
 * 获取所有频道（优先从 KV）
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{channels: Array, fromCache: boolean}>}
 */
export async function getAllChannels(env) {
  try {
    // 尝试从 KV 获取（检查 KV 是否可用）
    let cacheData = null;
    if (env && env.KV) {
      try {
        cacheData = await env.KV.get(CHANNELS_CACHE_KEY, { type: 'json' });
      } catch (kvError) {
        console.warn('[ChannelCache] KV get failed, falling back to DB:', kvError.message);
      }
    }

    if (cacheData && cacheData.channels) {
      return {
        channels: cacheData.channels,
        fromCache: true
      };
    }

    // KV 中没有，从数据库查询
    const db = getDB();
    const result = await db.prepare(`
      SELECT
        c.id,
        c.channel_name,
        c.group_title,
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
      WHERE c.is_active = 1
        AND s.is_active = 1
    `).all();

    return {
      channels: result.results || [],
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
 * 获取所有分组（优先从 KV）
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<{groups: Array, fromCache: boolean}>}
 */
export async function getAllGroups(env) {
  try {
    // 尝试从 KV 获取（检查 KV 是否可用）
    let cacheData = null;
    if (env && env.KV) {
      try {
        cacheData = await env.KV.get(GROUPS_CACHE_KEY, { type: 'json' });
      } catch (kvError) {
        console.warn('[ChannelCache] KV get failed, falling back to DB:', kvError.message);
      }
    }

    if (cacheData && cacheData.groups) {
      return {
        groups: cacheData.groups,
        fromCache: true
      };
    }

    // KV 中没有，从数据库查询
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

    return {
      groups: (result.results || []).map(r => r.group_title),
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
 * 清空频道缓存
 * @param {Object} env - Cloudflare Workers 环境
 * @returns {Promise<boolean>}
 */
export async function clearChannelCache(env) {
  try {
    await env.KV.delete(CHANNELS_CACHE_KEY);
    await env.KV.delete(GROUPS_CACHE_KEY);
    await env.KV.delete(CACHE_VERSION_KEY);
    console.log('[ChannelCache] Cache cleared');
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
    const channelsCache = await env.KV.get(CHANNELS_CACHE_KEY, { type: 'json' });
    const groupsCache = await env.KV.get(GROUPS_CACHE_KEY, { type: 'json' });

    return {
      version: version || null,
      channelsCached: !!channelsCache,
      groupsCached: !!groupsCache,
      channelsCount: channelsCache?.channels?.length || 0,
      groupsCount: groupsCache?.groups?.length || 0,
      cachedAt: channelsCache?.cached_at || null
    };
  } catch (error) {
    console.error('[ChannelCache] Failed to get cache status:', error);
    return {
      version: null,
      channelsCached: false,
      groupsCached: false
    };
  }
}
