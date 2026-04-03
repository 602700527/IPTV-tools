// 静态文件存储层 - 支持 KV (dev) 和 R2 (production)

/**
 * 检测当前环境
 * @param {Object} env - Workers 环境变量
 * @returns {'development' | 'production'} 环境类型
 */
export function detectEnvironment(env) {
  // 生产环境检测：R2 Bucket 已配置
  if (env && env.R2_BUCKET) {
    return 'production';
  }
  // 默认测试环境
  return 'development';
}

/**
 * 获取静态文件存储配置
 * @param {Object} env - Workers 环境变量
 * @returns {Object} 存储配置
 */
export function getStaticConfig(env) {
  const envType = detectEnvironment(env);
  return {
    envType,
    staticSource: envType === 'production' ? 'r2' : 'local',
    storage: envType === 'production' ? 'R2 Bucket' : 'KV Cache',
    canGenerate: true
  };
}

/**
 * 保存静态文件
 * @param {Object} env - Workers 环境变量
 * @param {string} path - 文件路径 (如 /index.html, /category/cctv.html)
 * @param {string} content - 文件内容
 * @returns {Promise<boolean>} 是否成功
 */
export async function saveStaticFile(env, path, content) {
  const envType = detectEnvironment(env);
  const key = path.startsWith('/') ? path.slice(1) : path;

  try {
    if (envType === 'production' && env.R2_BUCKET) {
      // R2 存储
      await env.R2_BUCKET.put(key, content, {
        httpMetadata: {
          contentType: getContentType(key)
        },
        cacheControl: 'public, max-age=86400'
      });
    } else if (env && env.KV) {
      // KV 存储 (测试环境)
      const kvKey = `static:${key}`;
      await env.KV.put(kvKey, content, {
        expirationTtl: 86400 * 30 // 30 天过期
      });
    } else {
      console.error('[StaticStorage] No storage available');
      return false;
    }
    return true;
  } catch (error) {
    console.error('[StaticStorage] Save failed:', error);
    return false;
  }
}

/**
 * 检查静态文件是否存在
 * @param {Object} env - Workers 环境变量
 * @param {string} path - 文件路径
 * @returns {Promise<boolean>} 是否存在
 */
export async function staticFileExists(env, path) {
  const envType = detectEnvironment(env);
  const key = path.startsWith('/') ? path.slice(1) : path;

  try {
    if (envType === 'production' && env.R2_BUCKET) {
      const object = await env.R2_BUCKET.head(key);
      return object !== null;
    } else if (env && env.KV) {
      const kvKey = `static:${key}`;
      const value = await env.KV.get(kvKey);
      return value !== null;
    }
    return false;
  } catch (error) {
    console.error('[StaticStorage] Exists check failed:', error);
    return false;
  }
}

/**
 * 获取静态文件内容
 * @param {Object} env - Workers 环境变量
 * @param {string} path - 文件路径
 * @returns {Promise<string|null>} 文件内容或 null
 */
export async function getStaticFile(env, path) {
  const envType = detectEnvironment(env);
  const key = path.startsWith('/') ? path.slice(1) : path;

  try {
    if (envType === 'production' && env.R2_BUCKET) {
      const object = await env.R2_BUCKET.get(key);
      if (object) {
        return await object.text();
      }
    } else if (env && env.KV) {
      const kvKey = `static:${key}`;
      const value = await env.KV.get(kvKey);
      return value;
    }
    return null;
  } catch (error) {
    console.error('[StaticStorage] Get failed:', error);
    return null;
  }
}

/**
 * 删除静态文件
 * @param {Object} env - Workers 环境变量
 * @param {string} path - 文件路径
 * @returns {Promise<boolean>} 是否成功
 */
export async function deleteStaticFile(env, path) {
  const envType = detectEnvironment(env);
  const key = path.startsWith('/') ? path.slice(1) : path;

  try {
    if (envType === 'production' && env.R2_BUCKET) {
      await env.R2_BUCKET.delete(key);
    } else if (env && env.KV) {
      const kvKey = `static:${key}`;
      await env.KV.delete(kvKey);
    }
    return true;
  } catch (error) {
    console.error('[StaticStorage] Delete failed:', error);
    return false;
  }
}

/**
 * 列出静态文件
 * @param {Object} env - Workers 环境变量
 * @param {string} prefix - 文件前缀
 * @returns {Promise<string[]>} 文件列表
 */
export async function listStaticFiles(env, prefix = '') {
  const envType = detectEnvironment(env);
  const files = [];

  try {
    if (envType === 'production' && env.R2_BUCKET) {
      const objects = await env.R2_BUCKET.list({ prefix });
      files.push(...objects.objects.map(o => o.key));
    } else if (env && env.KV) {
      // KV 不支持前缀列出，需要使用 list 遍历
      const kvPrefix = prefix ? `static:${prefix}` : 'static:';
      const list = await env.KV.list({ prefix: kvPrefix });
      files.push(...list.keys.map(k => k.name.replace('static:', '')));
    }
    return files;
  } catch (error) {
    console.error('[StaticStorage] List failed:', error);
    return [];
  }
}

/**
 * 获取文件 Content-Type
 * @param {string} path - 文件路径
 * @returns {string} Content-Type
 */
function getContentType(path) {
  if (path.endsWith('.html')) return 'text/html; charset=utf-8';
  if (path.endsWith('.css')) return 'text/css; charset=utf-8';
  if (path.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (path.endsWith('.xml')) return 'application/xml; charset=utf-8';
  if (path.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.ico')) return 'image/x-icon';
  return 'application/octet-stream';
}
