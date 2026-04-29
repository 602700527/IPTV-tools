// Token 管理模块 - KV M3U 缓存方案
// 管理播放地址 token 的生成、验证和存储

// Token 验证内存缓存（不消耗 KV 配额）
const tokenCache = new Map();

// 播放次数内存缓存（防止同一 IP 频繁访问）
// key: `${ip}:${hash}:${date}`, value: count
const playCountCache = new Map();
let PLAY_LIMIT = 50; // 每个 IP 每个频道每日限制

// 播放地址映射内存缓存（避免每次播放都读 KV）
const playAddressMapCache = new Map(); // key: token, value: { map: object, expires_at: number }
const PLAY_ADDR_MAP_CACHE_TTL = 60 * 1000; // 60 秒

// 当前活跃token的固定存储key（消除KV.list()调用）
const CURRENT_TOKEN_KEY = 'current_active_token';

// 导出缓存和配置
export { tokenCache, playCountCache, PLAY_LIMIT, playAddressMapCache };

/**
 * 设置每日播放次数限制
 * @param {number} limit 
 */
export function setPlayLimit(limit) {
  PLAY_LIMIT = limit;
}

/**
 * 生成随机字符串作为 token
 * @param {number} length - token 长度
 * @returns {string}
 */
export function generateRandomToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * 获取当前有效的 token
 * 如果没有有效 token，自动生成新的
 * @param {object} env - 环境变量
 * @returns {Promise<string|null>}
 */
export async function getCurrentToken(env) {
  try {
    // 1. 从固定key获取当前活跃token（无需KV.list()）
    const tokenData = await env.KV.get(CURRENT_TOKEN_KEY);

    if (tokenData) {
      const meta = JSON.parse(tokenData);
      // 检查是否过期
      if (new Date(meta.expires_at) > new Date()) {
        return meta.token;
      }
      // 已过期，触发生成新token
      console.log('[Token] Current token expired, generating new one');
    } else {
      console.log('[Token] No current token found, generating new one');
    }

    // 2. 没有有效token，生成新的
    const newToken = await generateTokenAndAddresses(env);
    return newToken;
  } catch (error) {
    console.error('[Token] Failed to get current token:', error);
    return null;
  }
}

/**
 * 获取所有未过期的 token（按创建时间排序，最多返回20个）
 * @param {object} env - 环境变量
 * @returns {Promise<Array<{token: string, created_at: string, expires_at: string}>>}
 */
export async function getAllTokens(env) {
  const list = await env.KV.list({ prefix: 'play_token:' });
  const tokens = [];

  for (const item of list.keys) {
    const token = item.name.replace('play_token:', '');
    const meta = await env.KV.get(item.name);
    if (meta) {
      const data = JSON.parse(meta);
      if (new Date(data.expires_at) > new Date()) {
        tokens.push({
          token,
          created_at: data.created_at,
          expires_at: data.expires_at
        });
      }
    }
  }

  // 按创建时间倒序，只返回最近的 20 个
  tokens.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return tokens.slice(0, 20);
}

/**
 * 生成新 token 并批量写入播放地址映射
 * @param {object} env - 环境变量
 * @param {object} options - 配置选项
 * @param {number} options.ttlHours - token 有效期（小时），默认 72
 * @param {Array} options.channels - 频道列表，如果为 null 则从数据库获取
 * @returns {Promise<string>} 生成的 token
 */
export async function generateTokenAndAddresses(env, options = {}) {
  const { ttlHours = 72, channels = null } = options;
  
  // 1. 生成新 token
  const token = generateRandomToken(32);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ttlHours * 60 * 60 * 1000);

  // 2. 存入 token 元数据（72h TTL）
  await env.KV.put(`play_token:${token}`, JSON.stringify({
    created_at: createdAt.toISOString(),
    expires_at: expiresAt.toISOString()
  }), { expirationTtl: ttlHours * 3600 });

  // 3. 同时更新"当前活跃token"固定key（消除getCurrentToken的KV.list()调用）
  await env.KV.put(CURRENT_TOKEN_KEY, JSON.stringify({
    token,
    created_at: createdAt.toISOString(),
    expires_at: expiresAt.toISOString()
  }), { expirationTtl: ttlHours * 3600 });

  // 3. 获取频道列表
  let channelList = channels;
  if (!channelList) {
    // 如果没有传入频道，从 channels_cache 获取
    try {
      const cached = await env.KV.get('channels_cache', { type: 'json' });
      if (cached && cached.channels) {
        channelList = cached.channels.filter(c => c.is_active && c.source_active);
      }
    } catch (e) {
      console.error('[Token] Failed to get channels from cache:', e);
    }
  }

  if (!channelList || channelList.length === 0) {
    console.log('[Token] No active channels to cache');
    return token;
  }

  // 4. 获取域名黑名单
  let domainBlacklist = [];
  try {
    const blacklistData = await env.KV.get('domain_blacklist', { type: 'json' });
    if (blacklistData && Array.isArray(blacklistData.domains)) {
      domainBlacklist = blacklistData.domains;
    }
  } catch (e) {
    console.log('[Token] No domain blacklist found');
  }

  // 5. 构建播放地址映射表（单个大 JSON）
  const addressMap = {};

  for (const channel of channelList) {
    // 检查域名是否在黑名单中
    let isBlacklisted = false;
    try {
      const hostname = new URL(channel.play_url).hostname;
      isBlacklisted = domainBlacklist.some(d => 
        hostname === d || hostname.endsWith('.' + d)
      );
    } catch (e) {
      // URL 解析失败，跳过
      continue;
    }

    if (isBlacklisted) {
      // 黑名单中的域名不存入 KV，播放时直接透传
      continue;
    }

    addressMap[channel.channel_hash] = channel.play_url;
  }

  // 6. 一次性写入整个播放地址映射表（只需 1 次 KV 写入）
  await env.KV.put(`play_addr_map:${token}`, JSON.stringify(addressMap), {
    expirationTtl: ttlHours * 3600
  });

  console.log(`[Token] Generated ${token}, ${Object.keys(addressMap).length} addresses cached in single KV key`);
  return token;
}

/**
 * 验证 token 是否有效
 * 先查内存缓存，未命中查 KV
 * @param {string} token 
 * @param {object} env - 环境变量
 * @returns {Promise<object|null>} token 元数据或 null
 */
export async function validateToken(token, env) {
  // 1. 先查内存缓存
  const cached = tokenCache.get(token);
  console.log('[Token] validateToken: checking cache for', token, 'cached:', cached ? 'yes' : 'no');
  if (cached && cached.expires_at && new Date(cached.expires_at) > new Date()) {
    return cached;
  }

  // 2. 缓存未命中，查 KV
  const key = `play_token:${token}`;
  console.log('[Token] validateToken: querying KV key:', key);
  const tokenData = await env.KV.get(key);
  console.log('[Token] validateToken: KV result:', tokenData ? 'found' : 'not found');
  if (!tokenData) return null;

  const meta = JSON.parse(tokenData);

  // 3. 检查是否过期
  if (new Date(meta.expires_at) <= new Date()) {
    return null;
  }

  // 4. 存入内存缓存
  tokenCache.set(token, meta);

  return meta;
}

/**
 * 获取播放地址映射表（所有播放地址的大 JSON）
 * 先查内存缓存，未命中查 KV
 * @param {string} token
 * @param {object} env - 环境变量
 * @returns {Promise<object|null>} hash -> play_url 的映射，或 null
 */
export async function getPlayAddressMap(token, env) {
  const key = `play_addr_map:${token}`;

  // 1. 先查内存缓存
  const cached = playAddressMapCache.get(token);
  if (cached && cached.expires_at > Date.now()) {
    console.log('[Token] getPlayAddressMap: cache hit for token:', token.substring(0, 8) + '...');
    return cached.map;
  }

  // 2. 缓存未命中或已过期，查 KV
  console.log('[Token] getPlayAddressMap: cache miss, querying KV:', key);
  try {
    const data = await env.KV.get(key, { type: 'json' });

    // 3. 存入内存缓存（带过期时间）
    if (data) {
      const expiresAt = Date.now() + PLAY_ADDR_MAP_CACHE_TTL;
      playAddressMapCache.set(token, { map: data, expires_at: expiresAt });
    }

    return data || null;
  } catch (e) {
    console.error('[Token] getPlayAddressMap error:', e);
    return null;
  }
}

/**
 * 获取播放地址
 * @param {string} token
 * @param {string} hash - 频道 hash
 * @param {object} env - 环境变量
 * @returns {Promise<string|null>}
 */
export async function getPlayAddress(token, hash, env) {
  const map = await getPlayAddressMap(token, env);
  if (!map) return null;
  return map[hash] || null;
}

/**
 * 删除 token 及关联的所有播放地址
 * @param {string} token
 * @param {object} env - 环境变量
 * @returns {Promise<void>}
 */
export async function invalidateToken(token, env) {
  // 删除 token 元数据
  await env.KV.delete(`play_token:${token}`);

  // 删除播放地址映射表（单个大 JSON）
  await env.KV.delete(`play_addr_map:${token}`);

  // 从内存缓存中移除
  tokenCache.delete(token);
  playAddressMapCache.delete(token);

  console.log(`[Token] Invalidated token: ${token}`);
}

/**
 * 延长 token 有效期
 * @param {string} token 
 * @param {number} additionalHours - 延长的小时数
 * @param {object} env - 环境变量
 * @returns {Promise<boolean>}
 */
export async function extendToken(token, additionalHours, env) {
  const tokenData = await env.KV.get(`play_token:${token}`);
  if (!tokenData) return false;

  const meta = JSON.parse(tokenData);
  const newExpiresAt = new Date(new Date(meta.expires_at).getTime() + additionalHours * 60 * 60 * 1000);

  // 重新存入（KV 不支持修改 TTL，只能重新 put）
  await env.KV.put(`play_token:${token}`, JSON.stringify({
    ...meta,
    expires_at: newExpiresAt.toISOString()
  }), { expirationTtl: additionalHours * 3600 });

  // 更新内存缓存
  if (tokenCache.has(token)) {
    tokenCache.set(token, { ...meta, expires_at: newExpiresAt.toISOString() });
  }

  return true;
}

/**
 * 每天 0:00 清空播放次数缓存
 * 留空，已改为懒清理模式
 */
export function setupDailyCleanup() {
  // 已改为懒清理模式，每天 0 点不会自动清空
  // 下次请求时会自动清理 2 天前的记录
}

/**
 * 检查播放次数是否超限
 * @param {string} ip
 * @param {string} hash - 频道 hash
 * @param {string} date - YYYY-MM-DD 格式
 * @returns {boolean} true 表示未超限可以播放
 */
export function checkPlayCount(ip, hash, date) {
  const playKey = `${ip}:${hash}:${date}`;
  const currentCount = playCountCache.get(playKey) || 0;
  return currentCount < PLAY_LIMIT;
}

/**
 * 懒清理过期的播放次数记录
 */
function cleanExpiredPlayCountCache() {
  const today = new Date().toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  for (const key of playCountCache.keys()) {
    const parts = key.split(':');
    const recordDate = parts[parts.length - 1];
    // 清理 2 天前的记录
    if (recordDate < twoDaysAgo) {
      playCountCache.delete(key);
    }
  }
}

/**
 * 增加播放次数
 * @param {string} ip
 * @param {string} hash - 频道 hash
 * @param {string} date - YYYY-MM-DD 格式
 */
export function incrementPlayCount(ip, hash, date) {
  // 懒清理过期记录
  cleanExpiredPlayCountCache();

  const playKey = `${ip}:${hash}:${date}`;
  const currentCount = playCountCache.get(playKey) || 0;
  playCountCache.set(playKey, currentCount + 1);
}

/**
 * 获取当前播放次数
 * @param {string} ip
 * @param {string} hash - 频道 hash
 * @param {string} date - YYYY-MM-DD 格式
 * @returns {number}
 */
export function getPlayCount(ip, hash, date) {
  const playKey = `${ip}:${hash}:${date}`;
  return playCountCache.get(playKey) || 0;
}
