// Token 管理模块 - KV M3U 缓存方案
// 管理播放地址 token 的生成、验证和存储

// Token 验证内存缓存（不消耗 KV 配额）
const tokenCache = new Map();
const TOKEN_CACHE_TTL = 60 * 1000; // 60 秒

// 播放次数内存缓存（防止同一 IP 频繁访问）
const playCountCache = new Map(); // key: `${ip}:${date}`, value: count
let PLAY_LIMIT = 100; // 每个 IP 每日限制（可配置）

// 导出缓存和配置
export { tokenCache, playCountCache, PLAY_LIMIT };

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
  // 1. 获取当前有效的 token
  const list = await env.KV.list({ prefix: 'play_token:' });

  for (const item of list.keys) {
    const token = item.name.replace('play_token:', '');
    const meta = await env.KV.get(item.name);
    if (meta) {
      const { expires_at } = JSON.parse(meta);
      if (new Date(expires_at) > new Date()) {
        return token;
      }
    }
  }

  // 2. 没有有效 token，触发定时任务生成
  console.log('[Token] No valid token found, triggering generation');
  try {
    await generateTokenAndAddresses(env);
    // 重新获取
    return await getCurrentToken(env);
  } catch (error) {
    console.error('[Token] Failed to generate token:', error);
    // 3. 生成失败：返回 null
    return null;
  }
}

/**
 * 获取所有未过期的 token
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

  return tokens;
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

  // 5. 批量写入播放地址映射（每批 25 个，KV 限制）
  const BATCH_SIZE = 25;
  const addressesToCache = [];

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

    addressesToCache.push({
      key: `play_addr:${token}:${channel.channel_hash}`,
      value: channel.play_url
    });
  }

  // 分批写入
  for (let i = 0; i < addressesToCache.length; i += BATCH_SIZE) {
    const batch = addressesToCache.slice(i, i + BATCH_SIZE);
    const operations = batch.map(({ key, value }) =>
      env.KV.put(key, value, { expirationTtl: ttlHours * 3600 })
    );
    await Promise.all(operations);
    console.log(`[Token] Written batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(addressesToCache.length / BATCH_SIZE)}`);
  }

  console.log(`[Token] Generated ${token}, ${addressesToCache.length} addresses cached`);
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
  if (cached && cached.expires_at && new Date(cached.expires_at) > new Date()) {
    return cached;
  }

  // 2. 缓存未命中，查 KV
  const tokenData = await env.KV.get(`play_token:${token}`);
  if (!tokenData) return null;

  const meta = JSON.parse(tokenData);

  // 3. 检查是否过期
  if (new Date(meta.expires_at) <= new Date()) {
    return null;
  }

  // 4. 存入内存缓存
  tokenCache.set(token, meta);
  setTimeout(() => tokenCache.delete(token), TOKEN_CACHE_TTL);

  return meta;
}

/**
 * 获取播放地址
 * @param {string} token 
 * @param {string} hash - 频道 hash
 * @param {object} env - 环境变量
 * @returns {Promise<string|null>}
 */
export async function getPlayAddress(token, hash, env) {
  return await env.KV.get(`play_addr:${token}:${hash}`);
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

  // 列出并删除所有关联的播放地址
  const list = await env.KV.list({ prefix: `play_addr:${token}:` });
  for (const item of list.keys) {
    await env.KV.delete(item.name);
  }

  // 从内存缓存中移除
  tokenCache.delete(token);

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
 * 应该在 Worker 启动时调用一次
 */
export function setupDailyCleanup() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  setTimeout(() => {
    playCountCache.clear();
    console.log('[Cache] Play count cache cleared at midnight');
    setupDailyCleanup(); // 重新设置下一次清理
  }, msUntilMidnight);

  console.log(`[Cache] Scheduled play count cache cleanup in ${Math.round(msUntilMidnight / 1000 / 60)} minutes`);
}

/**
 * 检查播放次数是否超限
 * @param {string} ip 
 * @param {string} date - YYYY-MM-DD 格式
 * @returns {boolean} true 表示未超限可以播放
 */
export function checkPlayCount(ip, date) {
  const playKey = `${ip}:${date}`;
  const currentCount = playCountCache.get(playKey) || 0;
  return currentCount < PLAY_LIMIT;
}

/**
 * 增加播放次数
 * @param {string} ip 
 * @param {string} date - YYYY-MM-DD 格式
 */
export function incrementPlayCount(ip, date) {
  const playKey = `${ip}:${date}`;
  const currentCount = playCountCache.get(playKey) || 0;
  playCountCache.set(playKey, currentCount + 1);
}

/**
 * 获取当前播放次数
 * @param {string} ip 
 * @param {string} date - YYYY-MM-DD 格式
 * @returns {number}
 */
export function getPlayCount(ip, date) {
  const playKey = `${ip}:${date}`;
  return playCountCache.get(playKey) || 0;
}
