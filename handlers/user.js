// 用户激活API处理器
import { getDB } from '../database.js';

export async function handleUserActivate(request, env, ctx) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response(JSON.stringify({ success: false, error: '卡密不能为空' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = getDB();

    // 查询卡密
    const codeRecord = await db.prepare('SELECT * FROM codes WHERE code = ?').bind(code).first();

    if (!codeRecord) {
      return new Response(JSON.stringify({ success: false, error: '卡密不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查卡密状态
    if (codeRecord.status === 'disabled') {
      return new Response(JSON.stringify({ success: false, error: '该卡密已被禁用' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查是否已过期
    const now = new Date();
    if (codeRecord.expired_at && new Date(codeRecord.expired_at) < now) {
      return new Response(JSON.stringify({ success: false, error: '该卡密已过期' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查是否被封禁
    if (codeRecord.banned_until) {
      const bannedUntil = new Date(codeRecord.banned_until);
      if (bannedUntil > now) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: `该卡密已被封禁，解封时间：${bannedUntil.toLocaleString('zh-CN')}`
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 如果是未使用的卡密，则激活
    if (codeRecord.status === 'unused') {
      const activatedAt = now.toISOString();
      let expiredAt = codeRecord.expired_at;

      // 如果过期时间未设置，使用有效期天数计算
      if (!expiredAt) {
        const expDate = new Date();
        expDate.setTime(expDate.getTime() + (codeRecord.duration_days || 30) * 24 * 60 * 60 * 1000);
        expiredAt = expDate.toISOString();
      }

      // 更新卡密状态为活跃
      await db.prepare(`
        UPDATE codes SET status = 'active', activated_at = ?, expired_at = ?
        WHERE code = ?
      `).bind(activatedAt, expiredAt, code).run();

      return new Response(JSON.stringify({
        success: true,
        activated_at: activatedAt,
        expired_at: expiredAt,
        message: '卡密激活成功'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 如果已经是活跃状态，直接返回信息
    if (codeRecord.status === 'active') {
      return new Response(JSON.stringify({
        success: true,
        activated_at: codeRecord.activated_at,
        expired_at: codeRecord.expired_at,
        message: '该卡密已激活'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, error: '卡密状态异常' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('激活卡密失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
