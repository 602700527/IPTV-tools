// VIP用户收藏API处理器
import { getUserFavorites, saveUserFavorites, addFavoriteToUser, removeFavoriteFromUser } from '../database.js';
import { isVIPUser } from './auth.js';

/**
 * 验证用户并获取用户ID
 */
async function getUserIdFromRequest(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, userId: null, error: 'Unauthorized' };
  }

  const token = authHeader.substring(7);
  const db = env.DB;

  try {
    const result = await db.prepare(`
      SELECT u.id FROM users u
      INNER JOIN user_sessions s ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first();

    if (!result) {
      return { success: false, userId: null, error: 'Invalid token' };
    }

    return { success: true, userId: result.id };
  } catch (e) {
    console.error('[FavoritesAPI] Auth error:', e);
    return { success: false, userId: null, error: 'Auth failed' };
  }
}

/**
 * GET /api/favorites - 获取用户收藏
 * 返回完整对象数组: [{hash, name, logo, group}, ...]
 */
export async function handleGetFavorites(request, env) {
  const auth = await getUserIdFromRequest(request, env);
  if (!auth.success) {
    return new Response(JSON.stringify({ success: false, error: auth.error }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const isVIP = await isVIPUser(auth.userId);
  if (!isVIP) {
    return new Response(JSON.stringify({ success: false, error: 'VIP only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 直接返回 getUserFavorites 结果，格式为对象数组
  const favorites = await getUserFavorites(auth.userId);
  return new Response(JSON.stringify({
    success: true,
    favorites,  // 对象数组: [{hash, name, logo, group}, ...]
    isVIP: true,
    count: Array.isArray(favorites) ? favorites.length : 0
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * POST /api/favorites - 添加收藏
 * Body: { channelHash: string }
 */
export async function handleAddFavorite(request, env) {
  const auth = await getUserIdFromRequest(request, env);
  if (!auth.success) {
    return new Response(JSON.stringify({ success: false, error: auth.error }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const isVIP = await isVIPUser(auth.userId);
  if (!isVIP) {
    return new Response(JSON.stringify({ success: false, error: 'VIP only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { channelHash } = await request.json();
    if (!channelHash) {
      return new Response(JSON.stringify({ success: false, error: 'Missing channelHash' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const favorites = await addFavoriteToUser(auth.userId, channelHash);
    return new Response(JSON.stringify({
      success: true,
      favorites
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('[FavoritesAPI] Add error:', e);
    return new Response(JSON.stringify({ success: false, error: 'Failed to add favorite' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * DELETE /api/favorites - 移除收藏
 * Body: { channelHash: string }
 */
export async function handleRemoveFavorite(request, env) {
  const auth = await getUserIdFromRequest(request, env);
  if (!auth.success) {
    return new Response(JSON.stringify({ success: false, error: auth.error }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const isVIP = await isVIPUser(auth.userId);
  if (!isVIP) {
    return new Response(JSON.stringify({ success: false, error: 'VIP only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { channelHash } = await request.json();
    if (!channelHash) {
      return new Response(JSON.stringify({ success: false, error: 'Missing channelHash' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const favorites = await removeFavoriteFromUser(auth.userId, channelHash);
    return new Response(JSON.stringify({
      success: true,
      favorites
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('[FavoritesAPI] Remove error:', e);
    return new Response(JSON.stringify({ success: false, error: 'Failed to remove favorite' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * PUT /api/favorites/sync - 批量同步收藏（完整替换）
 * Body: { favorites: [{hash, name, logo, group}, ...] }  完整对象数组
 * 存储策略: 整个favorites数组作为一个JSON存一次
 */
export async function handleSyncFavorites(request, env) {
  const auth = await getUserIdFromRequest(request, env);
  if (!auth.success) {
    return new Response(JSON.stringify({ success: false, error: auth.error }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const isVIP = await isVIPUser(auth.userId);
  if (!isVIP) {
    return new Response(JSON.stringify({ success: false, error: 'VIP only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { favorites } = await request.json();
    if (!Array.isArray(favorites)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid favorites array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 直接存储整个favorites数组作为JSON，一次写入
    await saveUserFavorites(auth.userId, favorites);

    console.log('[FavoritesAPI] Synced', favorites.length, 'favorites for user:', auth.userId);

    return new Response(JSON.stringify({
      success: true,
      favorites,  // 返回完整对象数组供前端使用
      count: favorites.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('[FavoritesAPI] Sync error:', e);
    return new Response(JSON.stringify({ success: false, error: 'Failed to sync favorites' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
