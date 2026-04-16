// 工单系统 API 处理器
import { getDB } from '../database.js';
import { sendEmail } from '../utils/email.js';

/**
 * 获取认证用户
 * @returns {object|null} 用户信息或null
 */
async function getAuthenticatedUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const db = getDB();

  const session = await db.prepare(`
    SELECT s.*, u.email, u.is_verified
    FROM user_sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).bind(token).first();

  return session ? { id: session.user_id, email: session.email, is_verified: session.is_verified } : null;
}

/**
 * 生成工单通知邮件 HTML
 */
function generateTicketEmailHtml(type, subject, userEmail, description) {
  const typeLabels = {
    payment: '支付问题',
    order: '订单咨询',
    technical: '技术支持',
    other: '其他问题'
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>新工单通知</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e50914 0%, #b81d24 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📺 TV Live Service</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px;">新工单通知</p>
    </div>
    
    <div style="padding: 30px;">
      <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 20px;">您收到一个新的工单</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 14px;">用户邮箱</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #1a1a1a; font-size: 14px; font-weight: 500;">${userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 14px;">工单类型</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #e50914; font-size: 14px; font-weight: 500;">${typeLabels[type] || type}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 14px;">工单标题</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #1a1a1a; font-size: 14px; font-weight: 500;">${subject}</td>
        </tr>
      </table>
      
      <div style="margin-top: 20px;">
        <p style="color: #666; font-size: 14px; margin: 0 0 8px;">工单描述：</p>
        <div style="background-color: #f5f5f7; border-radius: 8px; padding: 16px; color: #1a1a1a; font-size: 14px; line-height: 1.6;">
          ${description.replace(/\n/g, '<br>')}
        </div>
      </div>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
        请登录管理后台处理此工单
      </p>
    </div>
    
    <div style="background-color: #f5f5f7; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        此邮件由系统自动发送，请勿回复。
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 生成用户通知邮件 HTML
 */
function generateUserNotificationHtml(action, ticketSubject) {
  const actionLabels = {
    reply: '工单回复通知',
    resolved: '工单已解决',
    closed: '工单已关闭'
  };

  const actionMessages = {
    reply: '管理员已回复您的工单，请查看。',
    resolved: '您的工单已标记为已解决。',
    closed: '您的工单已被关闭。'
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${actionLabels[action]}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e50914 0%, #b81d24 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📺 TV Live Service</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px;">${actionLabels[action]}</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 20px;">${ticketSubject}</h2>
      
      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
        ${actionMessages[action]}
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
        请登录您的账户查看详情
      </p>
    </div>
    
    <div style="background-color: #f5f5f7; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        此邮件由系统自动发送，请勿回复。如有疑问，请联系客服。
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * GET /api/tickets - 获取用户工单列表
 */
export async function handleGetTickets(request, env) {
  try {
    const user = await getAuthenticatedUser(request, env);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();
    const tickets = await db.prepare(`
      SELECT id, order_id, type, subject, status, priority, created_at, updated_at, resolved_at
      FROM tickets
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(user.id).all();

    return new Response(JSON.stringify({
      success: true,
      tickets: tickets.results || []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Ticket] Get tickets error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/tickets - 创建新工单
 */
export async function handleCreateTicket(request, env) {
  try {
    const user = await getAuthenticatedUser(request, env);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { order_id, type, subject, description } = await request.json();

    // 验证必填字段
    if (!order_id || !type || !subject || !description) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证工单类型
    const validTypes = ['payment', 'order', 'technical', 'other'];
    if (!validTypes.includes(type)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid ticket type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();

    // 验证订单属于该用户
    const order = await db.prepare(`
      SELECT * FROM user_orders WHERE order_id = ? AND user_id = ?
    `).bind(order_id, user.id).first();

    if (!order) {
      return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查是否已有存活工单
    const existingTicket = await db.prepare(`
      SELECT id FROM tickets WHERE order_id = ? AND status != 'closed'
    `).bind(order_id).first();

    if (existingTicket) {
      return new Response(JSON.stringify({ success: false, error: 'This order already has an open ticket' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 创建工单
    const result = await db.prepare(`
      INSERT INTO tickets (user_id, order_id, type, subject, description, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).bind(user.id, order_id, type, subject, description).run();

    const ticketId = result.meta.last_row_id;

    // 发送邮件通知管理员
    try {
      const adminEmail = env.ADMIN_EMAIL || 'support@iptv-search.com';
      const emailHtml = generateTicketEmailHtml(type, subject, user.email, description);
      await sendEmail(adminEmail, `新工单通知 - ${type} - ${user.email}`, emailHtml, env);
    } catch (emailError) {
      console.error('[Ticket] Failed to send admin notification email:', emailError);
      // 不阻塞工单创建
    }

    return new Response(JSON.stringify({
      success: true,
      ticket_id: ticketId,
      message: 'Ticket created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Ticket] Create ticket error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/tickets/:id - 获取工单详情
 */
export async function handleGetTicket(request, env, ticketId) {
  try {
    const user = await getAuthenticatedUser(request, env);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();

    // 获取工单
    const ticket = await db.prepare(`
      SELECT * FROM tickets WHERE id = ? AND user_id = ?
    `).bind(ticketId, user.id).first();

    if (!ticket) {
      return new Response(JSON.stringify({ success: false, error: 'Ticket not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取订单信息
    const order = await db.prepare(`
      SELECT * FROM user_orders WHERE order_id = ?
    `).bind(ticket.order_id).first();

    // 获取回复
    const replies = await db.prepare(`
      SELECT id, user_id, is_admin, content, created_at
      FROM ticket_replies
      WHERE ticket_id = ?
      ORDER BY created_at ASC
    `).bind(ticketId).all();

    return new Response(JSON.stringify({
      success: true,
      ticket: ticket,
      order: order,
      replies: replies.results || []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Ticket] Get ticket error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/tickets/:id/reply - 添加回复
 */
export async function handleReplyTicket(request, env, ticketId) {
  try {
    const user = await getAuthenticatedUser(request, env);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return new Response(JSON.stringify({ success: false, error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();

    // 验证工单属于该用户
    const ticket = await db.prepare(`
      SELECT * FROM tickets WHERE id = ? AND user_id = ?
    `).bind(ticketId, user.id).first();

    if (!ticket) {
      return new Response(JSON.stringify({ success: false, error: 'Ticket not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查工单状态
    if (ticket.status === 'closed') {
      return new Response(JSON.stringify({ success: false, error: 'Cannot reply to closed ticket' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 添加回复
    await db.prepare(`
      INSERT INTO ticket_replies (ticket_id, user_id, is_admin, content)
      VALUES (?, ?, 0, ?)
    `).bind(ticketId, user.id, content.trim()).run();

    // 更新工单更新时间
    await db.prepare(`
      UPDATE tickets SET updated_at = datetime('now') WHERE id = ?
    `).bind(ticketId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Reply added successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Ticket] Reply ticket error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/tickets/:id/close - 关闭工单
 */
export async function handleCloseTicket(request, env, ticketId) {
  try {
    const user = await getAuthenticatedUser(request, env);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();

    // 验证工单属于该用户
    const ticket = await db.prepare(`
      SELECT * FROM tickets WHERE id = ? AND user_id = ?
    `).bind(ticketId, user.id).first();

    if (!ticket) {
      return new Response(JSON.stringify({ success: false, error: 'Ticket not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 更新工单状态
    await db.prepare(`
      UPDATE tickets SET status = 'closed', updated_at = datetime('now') WHERE id = ?
    `).bind(ticketId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Ticket closed successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Ticket] Close ticket error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
