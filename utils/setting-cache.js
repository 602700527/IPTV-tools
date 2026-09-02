// 配置项 KV 缓存
// ponytail: 硬规矩 — 配置项热路径只走 KV + in-isolate memo，**不打 D1**。
// admin 写入路径用 setCachedSetting() 同步写 D1 + KV；冷 KV → 返回默认值，不回退 D1。

const SETTING_PREFIX = 'setting:';
const SETTING_CACHE_TTL = 24 * 60 * 60; // 24 小时

// in-isolate memo：单次 isolate 内复用，跨 isolate 不共享（依赖 KV 跨 isolate 一致）
const _memo = new Map();

/**
 * 读取配置项（KV only）
 * @param {Object} env - Cloudflare Workers 环境
 * @param {string} key - 配置键
 * @param {string|null} defaultValue - KV miss 时返回的默认值
 * @returns {Promise<string|null>}
 */
export async function getCachedSetting(env, key, defaultValue = null) {
  // 1. in-isolate memo（请求调用链内复用，零成本）
  if (_memo.has(key)) return _memo.get(key);

  // 2. KV（跨 isolate 一致）
  if (env && env.KV) {
    try {
      const v = await env.KV.get(SETTING_PREFIX + key);
      if (v !== null) {
        _memo.set(key, v);
        return v;
      }
    } catch (e) {
      console.warn(`[SettingCache] KV read failed for ${key}:`, e.message);
    }
  }

  // 3. KV miss：返回默认值，**不打 D1**
  _memo.set(key, defaultValue);
  return defaultValue;
}

/**
 * 写入配置项（同时更新 in-isolate memo + KV）
 * admin 修改配置后调用此函数，让热路径立即看到新值。
 * 写入 D1 仍由调用方在外部完成（如 updateSystemConfig），本函数只管 KV 同步。
 * @param {Object} env - Cloudflare Workers 环境
 * @param {string} key - 配置键
 * @param {string} value - 配置值（字符串）
 */
export async function setCachedSetting(env, key, value) {
  _memo.set(key, value);
  if (env && env.KV) {
    try {
      await env.KV.put(SETTING_PREFIX + key, value, { expirationTtl: SETTING_CACHE_TTL });
    } catch (e) {
      console.warn(`[SettingCache] KV write failed for ${key}:`, e.message);
    }
  }
}

/**
 * 清空 in-isolate memo（用于测试或热更新 KV 后强制重读）
 */
export function clearSettingMemo() {
  _memo.clear();
}
