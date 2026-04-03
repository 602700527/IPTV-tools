// Admin Static Site Generator API
import { getDB } from '../database.js';
import { generateSEOHomepage, generateCategoryPage, generateChannelDetailPage } from './seo-handler.js';
import { 
  detectEnvironment, 
  getStaticConfig, 
  saveStaticFile, 
  staticFileExists,
  getStaticFile,
  deleteStaticFile,
  listStaticFiles 
} from '../utils/static-storage.js';

// Slugify - 和 seo-handler.js 保持一致
// 支持中文、英文、数字、emoji 和连字符
function slugify(str) {
  if (!str) return '';
  return str
    .trim()
    .replace(/\s+/g, '-')  // 空格转连字符
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')  // 保留中文、英文、数字、emoji和连字符
    .replace(/-+/g, '-')   // 多个连字符合并
    .replace(/^-+|-+$/g, '');  // 去除首尾连字符
}

/**
 * 处理静态页面生成请求
 * @param {Request} request
 * @param {Object} env
 * @returns {Response}
 */
export async function handleAdminStaticGenerate(request, env) {
  // 管理员验证
  const adminKey = request.headers.get('X-Admin-Key');
  if (adminKey !== env.ADMIN_KEY) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const startTime = Date.now();
  const config = getStaticConfig(env);

  try {
    const body = await request.json();
    const type = body.type || 'all';

    const stats = {
      total: 0,
      success: 0,
      failed: 0,
      homepage: 0,
      categories: 0,
      channels: 0
    };

    // 获取数据库连接
    const db = getDB();
    const envType = detectEnvironment(env);
    
    // 根据环境设置 origin
    // 开发环境：使用相对 URL（空字符串），这样生成的 HTML 中链接是相对的
    // 生产环境：使用 APP_URL，生成绝对 URL
    const origin = envType === 'production' ? (env.APP_URL || 'https://iptv-search.com') : '';

    // 生成首页
    if (type === 'homepage' || type === 'all') {
      console.log('[AdminStatic] Generating homepage...');
      const html = await generateSEOHomepage({ origin, env, limit: 100 });
      const saved = await saveStaticFile(env, '/index.html', html);
      if (saved) {
        stats.homepage = 1;
        stats.success++;
      } else {
        stats.failed++;
      }
      stats.total++;
    }

    // 生成分类页
    if (type === 'categories' || type === 'all') {
      console.log('[AdminStatic] Generating category pages...');
      
      const groupsResult = await db.prepare(`
        SELECT c.group_title, COUNT(*) as count
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
          AND c.group_title IS NOT NULL AND c.group_title != ''
        GROUP BY c.group_title
        ORDER BY c.group_title
      `).all();

      const groups = groupsResult.results || [];
      let batchSuccess = 0;
      let batchFailed = 0;

      // 分批处理：每批 100 个分类
      const BATCH_SIZE = 100;
      for (let i = 0; i < groups.length; i += BATCH_SIZE) {
        const batch = groups.slice(i, i + BATCH_SIZE);
        
        await Promise.all(batch.map(async (group) => {
          const categoryName = group.group_title;
          const slug = slugify(categoryName);
          
          try {
            const html = await generateCategoryPage({ 
              origin, 
              category: categoryName, 
              slug, 
              env, 
              limit: 500 
            });
            
            // 使用 URL 编码的 slug 存储，以确保 Unicode 字符正确处理
            const encodedSlug = encodeURIComponent(slug);
            const saved = await saveStaticFile(env, `/category/${encodedSlug}.html`, html);
            if (saved) {
              batchSuccess++;
            } else {
              batchFailed++;
            }
          } catch (error) {
            console.error(`[AdminStatic] Failed to generate category ${categoryName}:`, error);
            batchFailed++;
          }
        }));

        console.log(`[AdminStatic] Category batch ${i / BATCH_SIZE + 1}: ${batchSuccess} success, ${batchFailed} failed`);
      }

      stats.categories = batchSuccess;
      stats.success += batchSuccess;
      stats.failed += batchFailed;
      stats.total += groups.length;
    }

    // 生成频道详情页
    if (type === 'channels' || type === 'all') {
      console.log('[AdminStatic] Generating channel pages...');
      
      const countResult = await db.prepare(`
        SELECT COUNT(*) as total
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
      `).first();
      
      const totalChannels = countResult?.total || 0;
      const BATCH_SIZE = 500;
      let batchSuccess = 0;
      let batchFailed = 0;

      for (let offset = 0; offset < totalChannels; offset += BATCH_SIZE) {
        const channelsResult = await db.prepare(`
          SELECT c.id, c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active
          FROM channels c
          INNER JOIN sources s ON c.source_id = s.id
          WHERE c.is_active = 1 AND s.is_active = 1
          ORDER BY c.id
          LIMIT ? OFFSET ?
        `).bind(BATCH_SIZE, offset).all();

        const channels = channelsResult.results || [];

        await Promise.all(channels.map(async (channel) => {
          try {
            const html = await generateChannelDetailPage({ 
              origin, 
              channel, 
              channelHash: channel.channel_hash, 
              env 
            });
            
            const saved = await saveStaticFile(env, `/channel/${channel.channel_hash}.html`, html);
            if (saved) {
              batchSuccess++;
            } else {
              batchFailed++;
            }
          } catch (error) {
            console.error(`[AdminStatic] Failed to generate channel ${channel.channel_name}:`, error);
            batchFailed++;
          }
        }));

        console.log(`[AdminStatic] Channel batch ${offset / BATCH_SIZE + 1}: ${batchSuccess} success, ${batchFailed} failed`);
      }

      stats.channels = batchSuccess;
      stats.success += batchSuccess;
      stats.failed += batchFailed;
      stats.total += totalChannels;
    }

    const duration = Date.now() - startTime;

    return new Response(JSON.stringify({
      success: stats.failed === 0,
      message: stats.failed === 0 ? 'Static pages generated successfully' : 'Generation completed with some failures',
      stats: {
        total: stats.total,
        success: stats.success,
        failed: stats.failed,
        duration
      },
      generated: {
        homepage: stats.homepage,
        categories: stats.categories,
        channels: stats.channels
      },
      environment: config.envType,
      storage: config.storage
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[AdminStatic] Generation failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Generation failed',
      message: error.message,
      environment: config.envType,
      storage: config.storage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 获取静态文件状态
 * @param {Request} request
 * @param {Object} env
 * @returns {Response}
 */
export async function handleAdminStaticStatus(request, env) {
  // 管理员验证
  const adminKey = request.headers.get('X-Admin-Key');
  if (adminKey !== env.ADMIN_KEY) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const config = getStaticConfig(env);

  try {
    // 统计文件数量
    const files = await listStaticFiles(env);
    
    let homepage = 0;
    let categories = 0;
    let channels = 0;

    files.forEach(f => {
      if (f === 'index.html') homepage = 1;
      else if (f.startsWith('category/')) categories++;
      else if (f.startsWith('channel/')) channels++;
    });

    // 获取最后生成时间 (从 KV metadata 或 R2 metadata)
    let lastGenerated = null;
    try {
      if (config.envType === 'production' && env.R2_BUCKET) {
        const object = await env.R2_BUCKET.head('index.html');
        if (object && object.httpMetadata) {
          lastGenerated = object.uploaded ? new Date(object.uploaded).toISOString() : null;
        }
      } else if (env && env.KV) {
        const kvKey = 'static:index.html';
        const value = await env.KV.getWithMetadata(kvKey);
        if (value && value.metadata && value.metadata.generated) {
          lastGenerated = value.metadata.generated;
        }
      }
    } catch (e) {
      console.warn('[AdminStatic] Could not get last generated time:', e);
    }

    return new Response(JSON.stringify({
      success: true,
      environment: config.envType,
      staticSource: config.staticSource,
      storage: config.storage,
      lastGenerated,
      fileCount: {
        homepage,
        categories,
        channels,
        total: files.length
      },
      capabilities: {
        canGenerate: true,
        canDelete: true,
        supportsBatch: true
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[AdminStatic] Status check failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Status check failed',
      message: error.message,
      environment: config.envType,
      storage: config.storage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 清除静态文件缓存
 * @param {Request} request
 * @param {Object} env
 * @returns {Response}
 */
export async function handleAdminStaticClearCache(request, env) {
  // 管理员验证
  const adminKey = request.headers.get('X-Admin-Key');
  if (adminKey !== env.ADMIN_KEY) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const config = getStaticConfig(env);

  try {
    const files = await listStaticFiles(env);
    let deleted = 0;

    await Promise.all(files.map(async (f) => {
      const success = await deleteStaticFile(env, f);
      if (success) deleted++;
    }));

    return new Response(JSON.stringify({
      success: true,
      message: config.envType === 'production' ? 'R2 files deleted' : 'KV cache cleared',
      deleted,
      environment: config.envType,
      storage: config.storage
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[AdminStatic] Cache clear failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Cache clear failed',
      message: error.message,
      environment: config.envType,
      storage: config.storage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
