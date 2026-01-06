// 卡密封禁查询 - 直接从数据库查询
// 不再使用 KV 缓存，直接从数据库 codes 表查询

/**
 * 添加被封禁卡密标记（已封禁，无需额外操作）
 * @param {Object} env - Cloudflare Workers环境
 * @param {Object} codeInfo - 卡密信息 {code, status, duration_days, activated_at, expired_at, remark, banned_until}
 */
export async function addBannedCodeToCache(env, codeInfo) {
  // 卡密封禁信息已在数据库中更新，无需额外操作
  console.log(`Code ${codeInfo.code} ban status updated in database`);
}

/**
 * 移除被封禁卡密标记（已在数据库中更新）
 * @param {Object} env - Cloudflare Workers环境
 * @param {string} code - 卡密
 */
export async function removeBannedCodeFromCache(env, code) {
  // 卡密封禁信息已在数据库中更新，无需额外操作
  console.log(`Code ${code} unban status updated in database`);
}

/**
 * 从数据库获取所有被封禁的卡密列表
 * @param {Object} env - Cloudflare Workers环境
 * @param {number} limit - 返回的最大数量（用于分页）
 * @param {number} offset - 偏移量（用于分页）
 * @returns {Promise<{data: Array, total: number}>} 封禁列表
 */
export async function getBannedCodesFromCache(env, limit = 100, offset = 0) {
  const { getDB } = await import('../database.js');
  const db = getDB();
  const now = new Date().toISOString();

  const result = await db.prepare(`
    SELECT code, status, duration_days, activated_at, expired_at, max_ips, remark, banned_until
    FROM codes
    WHERE banned_until IS NOT NULL AND banned_until > ?
    ORDER BY banned_until DESC
    LIMIT ? OFFSET ?
  `).bind(now, limit, offset).all();

  const totalResult = await db.prepare(`
    SELECT COUNT(*) as total
    FROM codes
    WHERE banned_until IS NOT NULL AND banned_until > ?
  `).bind(now).first();

  const total = totalResult?.total || 0;

  return { data: result.results || [], total };
}

/**
 * 同步数据库中的封禁卡密（无需同步，直接从数据库查询）
 * @param {Object} env - Cloudflare Workers环境
 * @param {Object} db - 数据库实例
 * @returns {Promise<number>} 同步的卡密数量
 */
export async function syncBannedCodesToCache(env, db) {
  const now = new Date().toISOString();

  const bannedCodes = await db.prepare(`
    SELECT COUNT(*) as count
    FROM codes
    WHERE banned_until IS NOT NULL AND banned_until > ?
  `).bind(now).first();

  const count = bannedCodes?.count || 0;
  console.log(`Found ${count} banned codes in database (no sync needed)`);

  return count;
}

/**
 * 检查卡密是否被封禁（从数据库查询）
 * @param {Object} env - Cloudflare Workers环境
 * @param {string} code - 卡密
 * @returns {Promise<boolean>} 是否被封禁
 */
export async function isCodeBannedInCache(env, code) {
  if (!code) return false;

  const { getDB } = await import('../database.js');
  const db = getDB();
  const now = new Date().toISOString();

  const result = await db.prepare(`
    SELECT banned_until
    FROM codes
    WHERE code = ? AND banned_until IS NOT NULL AND banned_until > ?
  `).bind(code, now).first();

  return !!result;
}
