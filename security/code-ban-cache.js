// 卡密封禁KV缓存 - 提高查询性能
// 参考IP黑名单的KV缓存机制

/**
 * 添加被封禁卡密到KV缓存
 * @param {Object} env - Cloudflare Workers环境
 * @param {Object} codeInfo - 卡密信息 {code, status, duration_days, activated_at, expired_at, remark, banned_until}
 */
export async function addBannedCodeToCache(env, codeInfo) {
  const allBannedKey = 'code_banned_all';
  const existingData = await env.KV.get(allBannedKey, { type: 'json' }) || [];

  // 检查是否已存在
  if (existingData.some(item => item.code === codeInfo.code)) {
    // 已存在，更新信息
    const newData = existingData.map(item =>
      item.code === codeInfo.code ? { ...item, ...codeInfo } : item
    );
    await env.KV.put(allBannedKey, JSON.stringify(newData));
  } else {
    // 不存在，添加到列表
    existingData.unshift(codeInfo); // 新的排在前面
    await env.KV.put(allBannedKey, JSON.stringify(existingData));
  }

  // 同时存储单个卡密的封禁信息（用于快速检查）
  await env.KV.put(`code_banned:${codeInfo.code}`, JSON.stringify(codeInfo));
}

/**
 * 从KV缓存中移除被封禁卡密
 * @param {Object} env - Cloudflare Workers环境
 * @param {string} code - 卡密
 */
export async function removeBannedCodeFromCache(env, code) {
  const allBannedKey = 'code_banned_all';
  const existingData = await env.KV.get(allBannedKey, { type: 'json' }) || [];

  // 过滤掉要解封的卡密
  const newData = existingData.filter(item => item.code !== code);

  // 更新存储
  if (newData.length === 0) {
    // 如果没有数据了，删除键
    await env.KV.delete(allBannedKey);
  } else {
    await env.KV.put(allBannedKey, JSON.stringify(newData));
  }

  // 删除单个卡密的封禁信息
  await env.KV.delete(`code_banned:${code}`);
}

/**
 * 从KV缓存获取所有被封禁的卡密列表
 * @param {Object} env - Cloudflare Workers环境
 * @param {number} limit - 返回的最大数量（用于分页）
 * @param {number} offset - 偏移量（用于分页）
 * @returns {Promise<{data: Array, total: number}>} 封禁列表
 */
export async function getBannedCodesFromCache(env, limit = 100, offset = 0) {
  const allBannedKey = 'code_banned_all';
  const allData = await env.KV.get(allBannedKey, { type: 'json' }) || [];

  // 过滤掉已过期的封禁（banned_until小于当前时间）
  const now = new Date().toISOString();
  const validData = allData.filter(item => {
    if (!item.banned_until) return false;
    return new Date(item.banned_until) > new Date(now);
  });

  // 分页返回数据
  const data = validData.slice(offset, offset + limit);
  const total = validData.length;

  return { data, total };
}

/**
 * 同步数据库中的封禁卡密到KV缓存
 * @param {Object} env - Cloudflare Workers环境
 * @param {Object} db - 数据库实例
 * @returns {Promise<number>} 同步的卡密数量
 */
export async function syncBannedCodesToCache(env, db) {
  const now = new Date().toISOString();

  // 从数据库查询所有被封禁的卡密
  const bannedCodes = await db.prepare(`
    SELECT code, status, duration_days, activated_at, expired_at, max_ips, remark, banned_until
    FROM codes
    WHERE banned_until IS NOT NULL AND banned_until > ?
    ORDER BY banned_until DESC
  `).bind(now).all();

  const results = bannedCodes.results || [];

  if (results.length === 0) {
    // 没有封禁卡密，清空KV
    await env.KV.delete('code_banned_all');
    return 0;
  }

  // 更新KV缓存
  await env.KV.put('code_banned_all', JSON.stringify(results));

  // 同时更新单个卡密的缓存
  for (const code of results) {
    await env.KV.put(`code_banned:${code.code}`, JSON.stringify(code));
  }

  console.log(`Synced ${results.length} banned codes to KV cache`);
  return results.length;
}

/**
 * 检查卡密是否在封禁缓存中
 * @param {Object} env - Cloudflare Workers环境
 * @param {string} code - 卡密
 * @returns {Promise<boolean>} 是否被封禁
 */
export async function isCodeBannedInCache(env, code) {
  if (!code) return false;

  const bannedKey = `code_banned:${code}`;
  const bannedData = await env.KV.get(bannedKey, { type: 'json' });

  if (!bannedData) return false;

  // 检查是否已过期
  if (bannedData.banned_until) {
    const now = new Date();
    const bannedUntil = new Date(bannedData.banned_until);
    if (bannedUntil <= now) {
      // 已过期，从缓存中移除
      await removeBannedCodeFromCache(env, code);
      return false;
    }
  }

  return true;
}
