// 用户激活API处理器
import { getDB, getTopics } from '../database.js';

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
      // 自动将过期卡密设置为禁用状态
      await db.prepare("UPDATE codes SET status = 'disabled' WHERE code = ?").bind(code).run();
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
        // 永久卡密（duration_days = -1）不设置过期时间
        if (codeRecord.duration_days === -1) {
          expiredAt = null;
        } else {
          const expDate = new Date();
          expDate.setTime(expDate.getTime() + (codeRecord.duration_days || 30) * 24 * 60 * 60 * 1000);
          expiredAt = expDate.toISOString();
        }
      }

      // 获取请求体中的 topic_id
      let body = null;
      try { body = await request.json(); } catch(e) {}
      const topicId = body ? body.topic_id : null;
      
      // 验证 topic_id 是否存在（如果提供了）
      if (topicId !== null && topicId !== undefined && topicId !== '') {
        const topic = await db.prepare('SELECT id FROM topics WHERE id = ?').bind(topicId).first();
        if (!topic) {
          return new Response(JSON.stringify({ success: false, error: '专题不存在' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // 更新卡密状态为活跃，包含 topic_id
      await db.prepare(`
        UPDATE codes SET status = 'active', activated_at = ?, expired_at = ?, topic_id = ?
        WHERE code = ?
      `).bind(activatedAt, expiredAt, topicId || null, code).run();

      // 获取激活后的卡密信息（包含 topic_id 和 topic name）
      const activatedCode = await db.prepare('SELECT code, topic_id FROM codes WHERE code = ?').bind(code).first();
      
      // 如果有专题，获取专题名称
      let topicName = null;
      if (activatedCode && activatedCode.topic_id) {
        const topic = await db.prepare('SELECT name FROM topics WHERE id = ?').bind(activatedCode.topic_id).first();
        topicName = topic ? topic.name : null;
      }

      return new Response(JSON.stringify({
        success: true,
        activated_at: activatedAt,
        expired_at: expiredAt,
        topic_id: activatedCode ? activatedCode.topic_id : null,
        topic_name: topicName,
        message: '卡密激活成功'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 如果已经是活跃状态，允许更新专题
    if (codeRecord.status === 'active') {
      // 检查是否要更新专题
      let body = null;
      try { body = await request.json(); } catch(e) {}
      const topicId = body ? body.topic_id : null;
      
      if (topicId !== null && topicId !== undefined && topicId !== '') {
        if (topicId > 0) {
          const topic = await db.prepare('SELECT name FROM topics WHERE id = ?').bind(topicId).first();
          if (!topic) {
            return new Response(JSON.stringify({ success: false, error: '专题不存在' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          await db.prepare('UPDATE codes SET topic_id = ? WHERE code = ?').bind(topicId, code).run();
          return new Response(JSON.stringify({
            success: true,
            activated_at: codeRecord.activated_at,
            expired_at: codeRecord.expired_at,
            topic_id: topicId,
            topic_name: topic.name,
            message: '专题已更新'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          await db.prepare('UPDATE codes SET topic_id = NULL WHERE code = ?').bind(code).run();
          return new Response(JSON.stringify({
            success: true,
            activated_at: codeRecord.activated_at,
            expired_at: codeRecord.expired_at,
            topic_id: null,
            topic_name: null,
            message: '已清除专题'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // 不更新专题，返回当前信息
      let topicName = null;
      if (codeRecord.topic_id) {
        const topic = await db.prepare('SELECT name FROM topics WHERE id = ?').bind(codeRecord.topic_id).first();
        topicName = topic ? topic.name : null;
      }
      
      return new Response(JSON.stringify({
        success: true,
        activated_at: codeRecord.activated_at,
        expired_at: codeRecord.expired_at,
        topic_id: codeRecord.topic_id,
        topic_name: topicName,
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
export async function handleUserChangeTopic(request, env, ctx) {
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

    // 只允许激活的卡密修改专题
    if (codeRecord.status !== 'active') {
      return new Response(JSON.stringify({ success: false, error: '该卡密尚未激活' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取请求体
    let body = null;
    try { body = await request.json(); } catch(e) {}
    const topicId = body ? body.topic_id : null;

    // 验证 topic_id（如果不为空）
    if (topicId !== null && topicId !== undefined && topicId !== '' && topicId !== 0) {
      const topic = await db.prepare('SELECT id, name FROM topics WHERE id = ?').bind(topicId).first();
      if (!topic) {
        return new Response(JSON.stringify({ success: false, error: '专题不存在' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 更新 topic_id（0 表示全部频道，null 表示无专题）
    await db.prepare('UPDATE codes SET topic_id = ? WHERE code = ?').bind(topicId === 0 || topicId === '' ? null : topicId || null, code).run();

    // 获取更新后的专题名称
    let topicName = null;
    if (topicId !== null && topicId !== undefined && topicId !== '' && topicId !== 0) {
      const topic = await db.prepare('SELECT name FROM topics WHERE id = ?').bind(topicId).first();
      topicName = topic ? topic.name : null;
    }

    return new Response(JSON.stringify({
      success: true,
      topic_id: topicId === 0 || topicId === '' ? null : topicId || null,
      topic_name: topicName,
      message: '专题修改成功'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('修改专题失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 修改订阅模式（全部频道 / 我的收藏）
export async function handleUserChangeSubMode(request, env, ctx) {
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

    // 只允许激活的卡密修改订阅模式
    if (codeRecord.status !== 'active') {
      return new Response(JSON.stringify({ success: false, error: '该卡密尚未激活' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取请求体
    let body = null;
    try { body = await request.json(); } catch(e) {}
    const subMode = body ? body.sub_mode : null;

    // 验证 sub_mode（只能是 'favorites' 或 null）
    if (subMode !== null && subMode !== undefined && subMode !== '' && subMode !== 'favorites') {
      return new Response(JSON.stringify({ success: false, error: '无效的订阅模式' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 更新 sub_mode
    await db.prepare('UPDATE codes SET sub_mode = ? WHERE code = ?').bind(subMode || null, code).run();

    return new Response(JSON.stringify({
      success: true,
      sub_mode: subMode || null,
      message: '订阅模式修改成功'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('修改订阅模式失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
