// 用户认证 API 处理器
import { getDB } from '../database.js';
import { sendEmail, generateVerificationEmailHtml } from '../utils/email.js';

/**
 * 生成 6 位数字验证码
 */
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 密码哈希函数（使用 Web Crypto API）
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 用户注册
 */
export async function handleRegister(request, env, ctx) {
  try {
    const { email, password, verification_code } = await request.json();

    // 验证输入
    if (!email || !password || !verification_code) {
      return new Response(JSON.stringify({ success: false, error: '邮箱、密码和验证码不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ success: false, error: '邮箱格式不正确' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证密码强度（至少 8 位）
    if (password.length < 8) {
      return new Response(JSON.stringify({ success: false, error: '密码至少需要 8 个字符' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证验证码格式
    if (!/^\d{6}$/.test(verification_code)) {
      return new Response(JSON.stringify({ success: false, error: '验证码格式不正确' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();
    const now = new Date();

    // 检查邮箱是否已存在
    const existingUser = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existingUser) {
      return new Response(JSON.stringify({ success: false, error: '该邮箱已被注册' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证验证码
    const verification = await db.prepare(`
      SELECT * FROM email_verifications
      WHERE email = ? AND code = ? AND is_used = 0
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(email, verification_code).first();

    if (!verification) {
      return new Response(JSON.stringify({ success: false, error: '验证码无效或已过期' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查验证码是否过期
    if (new Date(verification.expires_at) < now) {
      return new Response(JSON.stringify({ success: false, error: '验证码已过期' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 生成密码哈希
    const passwordHash = await hashPassword(password);

    // 创建用户
    const result = await db.prepare(`
      INSERT INTO users (email, password_hash, is_verified)
      VALUES (?, ?, 1)
    `).bind(email, passwordHash).run();

    // 标记验证码为已使用
    await db.prepare(`
      UPDATE email_verifications SET is_used = 1
      WHERE id = ?
    `).bind(verification.id).run();

    // 生成会话令牌（自动登录）
    const token = await generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 天后过期

    // 保存会话
    await db.prepare(`
      INSERT INTO user_sessions (user_id, token, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(result.meta.last_row_id, token, expiresAt.toISOString(), now.toISOString()).run();

    // 获取用户信息
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(result.meta.last_row_id).first();

    return new Response(JSON.stringify({
      success: true,
      message: '注册成功',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified,
        created_at: user.created_at
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('注册失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 发送验证码
 */
export async function handleSendVerificationCode(request, env, ctx) {
  try {
    const { email } = await request.json();

    // 验证输入
    if (!email) {
      return new Response(JSON.stringify({ success: false, error: '邮箱不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ success: false, error: '邮箱格式不正确' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();

    // 检查用户是否存在
    const user = await db.prepare('SELECT id, is_verified FROM users WHERE email = ?').bind(email).first();
    if (user && user.is_verified) {
      return new Response(JSON.stringify({ success: false, error: '该邮箱已注册' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查是否频繁发送验证码（1 分钟内只能发送一次）
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const recentCode = await db.prepare(`
      SELECT id FROM email_verifications
      WHERE email = ? AND created_at > ?
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(email, oneMinuteAgo.toISOString()).first();

    if (recentCode) {
      return new Response(JSON.stringify({ success: false, error: '验证码发送过于频繁，请 1 分钟后再试' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 生成验证码
    const code = generateVerificationCode();
    const expiresAt = new Date(now.getTime() + 10 * 60000); // 10 分钟后过期

    // 保存验证码
    await db.prepare(`
      INSERT INTO email_verifications (email, code, expires_at)
      VALUES (?, ?, ?)
    `).bind(email, code, expiresAt.toISOString()).run();

    // 生成验证链接
    const verifyUrl = `${env.APP_URL}/api/auth/verify?email=${encodeURIComponent(email)}&code=${code}`;

    // 发送邮件
    const html = generateVerificationEmailHtml(email, code, verifyUrl);
    await sendEmail(email, '邮箱验证 - TV Live Service', html, env);

    return new Response(JSON.stringify({
      success: true,
      message: '验证码已发送到您的邮箱'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('发送验证码失败:', error);
    return new Response(JSON.stringify({ success: false, error: error.message || '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 验证邮箱
 */
export async function handleVerifyEmail(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const code = url.searchParams.get('code');

    // 验证输入
    if (!email || !code) {
      return new Response(JSON.stringify({ success: false, error: '缺少必要参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();
    const now = new Date();

    // 查询验证码
    const verification = await db.prepare(`
      SELECT * FROM email_verifications
      WHERE email = ? AND code = ? AND is_used = 0
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(email, code).first();

    if (!verification) {
      return new Response(JSON.stringify({ success: false, error: '验证码无效' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查验证码是否过期
    if (new Date(verification.expires_at) < now) {
      return new Response(JSON.stringify({ success: false, error: '验证码已过期' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取用户信息
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: '用户不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 更新用户验证状态
    await db.prepare(`
      UPDATE users SET is_verified = 1, updated_at = ?
      WHERE email = ?
    `).bind(now.toISOString(), email).run();

    // 标记验证码为已使用
    await db.prepare(`
      UPDATE email_verifications SET is_used = 1
      WHERE id = ?
    `).bind(verification.id).run();

    // 生成会话令牌（自动登录）
    const token = await generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 天后过期

    // 保存会话
    await db.prepare(`
      INSERT INTO user_sessions (user_id, token, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(user.id, token, expiresAt.toISOString(), now.toISOString()).run();

    return new Response(JSON.stringify({
      success: true,
      message: '邮箱验证成功',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified,
        created_at: user.created_at
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('验证邮箱失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 用户登录
 */
export async function handleLogin(request, env, ctx) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, error: '邮箱和密码不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();

    // 查询用户
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: '用户不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证密码
    const passwordHash = await hashPassword(password);
    if (user.password_hash !== passwordHash) {
      return new Response(JSON.stringify({ success: false, error: '密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查邮箱是否已验证
    if (!user.is_verified) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '请先验证邮箱',
        needVerification: true
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 生成会话令牌
    const token = await generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 天后过期

    // 保存会话
    await db.prepare(`
      INSERT INTO user_sessions (user_id, token, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(user.id, token, expiresAt.toISOString(), new Date().toISOString()).run();

    return new Response(JSON.stringify({
      success: true,
      message: '登录成功',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified,
        created_at: user.created_at
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('登录失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 用户登出
 */
export async function handleLogout(request, env, ctx) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: '未授权' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const db = getDB();

    // 删除会话
    await db.prepare('DELETE FROM user_sessions WHERE token = ?').bind(token).run();

    return new Response(JSON.stringify({
      success: true,
      message: '登出成功'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('登出失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 获取用户信息
 */
export async function handleGetUserInfo(request, env, ctx) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: '未授权' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const db = getDB();

    // 验证会话
    const session = await db.prepare(`
      SELECT s.*, u.email, u.is_verified, u.created_at, u.updated_at
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first();

    if (!session) {
      return new Response(JSON.stringify({ success: false, error: '会话已过期' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: session.user_id,
        email: session.email,
        is_verified: session.is_verified,
        created_at: session.created_at,
        updated_at: session.updated_at
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 生成随机token（用于密码重置）
 */
function generateResetToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * 生成密码重置邮件HTML
 */
function generateResetEmailHtml(email, resetUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>重置密码 - TV Live Service</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          margin: 0;
          padding: 20px;
          color: #fff;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
          font-size: 32px;
          font-weight: 700;
        }
        .logo span {
          color: #e50914;
        }
        .content {
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          padding: 14px 30px;
          background: linear-gradient(135deg, #e50914 0%, #b81d24 100%);
          color: #fff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
        }
        .warning {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          color: #ffc107;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          IPTV<span>Live</span>
        </div>
        <div class="content">
          <h2 style="margin-top: 0;">密码重置请求</h2>
          <p>您好，</p>
          <p>我们收到了您的密码重置请求。如果这是您发起的操作，请点击下方按钮设置新密码：</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">重置密码</a>
          </p>
          <div class="warning">
            <strong>安全提示：</strong>该链接将在 1 小时后失效，请尽快使用。如果您没有发起此请求，请忽略此邮件。
          </div>
          <p>如果您无法点击上方按钮，请复制以下链接到浏览器地址栏：</p>
          <p style="word-break: break-all; color: rgba(255, 255, 255, 0.6); font-size: 12px;">${resetUrl}</p>
        </div>
        <div class="footer">
          <p>此邮件由系统自动发送，请勿回复。</p>
          <p>&copy; ${new Date().getFullYear()} IPTV Search. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 忘记密码 - 发送重置链接
 */
export async function handleForgotPassword(request, env, ctx) {
  try {
    const { email } = await request.json();

    // 验证输入
    if (!email) {
      return new Response(JSON.stringify({ success: false, error: '邮箱不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ success: false, error: '邮箱格式不正确' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();

    // 检查用户是否存在（为了安全，即使用户不存在也返回成功）
    const user = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();

    if (!user) {
      // 不暴露用户是否存在的信息
      return new Response(JSON.stringify({
        success: true,
        message: '如果该邮箱已注册，重置链接已发送'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 生成重置token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1小时后过期

    // 保存token
    await db.prepare(`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `).bind(user.id, token, expiresAt.toISOString()).run();

    // 生成重置链接
    const appUrl = env.APP_URL || 'http://127.0.0.1:8787';
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    console.log('发送密码重置邮件:', { email, resetUrl });

    // 发送邮件
    try {
      const html = generateResetEmailHtml(email, resetUrl);
      await sendEmail(email, '重置密码 - IPTV Search', html, env);
    } catch (emailError) {
      console.error('发送邮件失败:', emailError);
      // 即使邮件发送失败，也返回成功（为了安全，不暴露用户是否存在）
      return new Response(JSON.stringify({
        success: true,
        message: '重置链接已发送到您的邮箱'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: '重置链接已发送到您的邮箱'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('发送重置链接失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 重置密码
 */
export async function handleResetPassword(request, env, ctx) {
  try {
    const { token, new_password } = await request.json();

    // 验证输入
    if (!token || !new_password) {
      return new Response(JSON.stringify({ success: false, error: '缺少必要参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证密码强度
    if (new_password.length < 8) {
      return new Response(JSON.stringify({ success: false, error: '密码至少需要 8 个字符' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB();
    const now = new Date();

    // 验证token
    const resetToken = await db.prepare(`
      SELECT * FROM password_reset_tokens
      WHERE token = ? AND is_used = 0
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(token).first();

    if (!resetToken) {
      return new Response(JSON.stringify({ success: false, error: '重置链接无效或已过期' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查token是否过期
    if (new Date(resetToken.expires_at) < now) {
      return new Response(JSON.stringify({ success: false, error: '重置链接已过期，请重新申请' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 生成新密码哈希
    const passwordHash = await hashPassword(new_password);

    // 更新用户密码
    await db.prepare(`
      UPDATE users
      SET password_hash = ?, updated_at = ?
      WHERE id = ?
    `).bind(passwordHash, now.toISOString(), resetToken.user_id).run();

    // 标记token为已使用
    await db.prepare(`
      UPDATE password_reset_tokens
      SET is_used = 1
      WHERE token = ?
    `).bind(token).run();

    return new Response(JSON.stringify({
      success: true,
      message: '密码重置成功'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('重置密码失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


/**
 * 获取订单历史
 */
export async function handleGetOrderHistory(request, env, ctx) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: '未授权' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const db = getDB();

    // 验证会话并获取用户 ID
    const session = await db.prepare(`
      SELECT s.user_id
      FROM user_sessions s
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first();

    if (!session) {
      return new Response(JSON.stringify({ success: false, error: '会话已过期' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 查询订单历史，关联codes表获取IP限制和过期时间
    const ordersResult = await db.prepare(`
      SELECT o.*, c.max_ips, c.expired_at, c.duration_days as code_duration_days
      FROM user_orders o
      LEFT JOIN codes c ON o.code = c.code
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      LIMIT 50
    `).bind(session.user_id).all();

    // D1 返回结果在 results 字段中
    const orders = ordersResult.results || [];

    return new Response(JSON.stringify({
      success: true,
      orders: orders
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('获取订单历史失败:', error);
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 生成会话令牌
 */
async function generateSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * 验证会话（供其他处理器使用）
 */
export async function verifySession(token, db) {
  const session = await db.prepare(`
    SELECT s.*, u.email, u.is_verified
    FROM user_sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).bind(token).first();

  return session;
}

/**
 * 检查用户是否为会员（拥有有效订阅）
 * @param {number} userId - 用户ID
 * @param {object} db - 数据库实例
 * @returns {Promise<boolean>} 是否为有效会员
 */
export async function checkMemberStatus(userId, db) {
  try {
    // 检查用户是否验证了邮箱
    const user = await db.prepare('SELECT is_verified FROM users WHERE id = ?').bind(userId).first();
    if (!user || !user.is_verified) {
      return false;
    }

    // 检查用户是否有有效的订阅订单（状态为completed且关联的卡密未过期）
    const now = new Date().toISOString();
    const result = await db.prepare(`
      SELECT o.id
      FROM user_orders o
      JOIN codes c ON o.code = c.code
      WHERE o.user_id = ?
        AND o.status = 'completed'
        AND c.expired_at > ?
      LIMIT 1
    `).bind(userId, now).first();

    return !!result;
  } catch (error) {
    console.error('[checkMemberStatus] Error:', error);
    return false;
  }
}

/**
 * Google OAuth 初始化
 */
export async function handleGoogleOAuthInit(request, env, ctx) {
  try {
    const state = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2,'0')).join('');
    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2,'0')).join('');
    
    await env.KV.put(`oauth_state:${state}`, nonce, { expirationTtl: 600 });
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', `${env.APP_URL}/api/auth/google/callback`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('nonce', nonce);
    authUrl.searchParams.set('access_type', 'offline');
    
    return new Response(JSON.stringify({ success: true, auth_url: authUrl.toString(), state }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Google OAuth Init failed:', error);
    return new Response(JSON.stringify({ success: false, error: 'OAuth init failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function handleGoogleOAuthCallback(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code || !state) {
      return new Response(JSON.stringify({ success: false, error: 'Missing parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const storedNonce = await env.KV.get(`oauth_state:${state}`);
    if (!storedNonce) {
      return new Response(JSON.stringify({ success: false, error: 'State expired or invalid' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    await env.KV.delete(`oauth_state:${state}`);
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${env.APP_URL}/api/auth/google/callback`
      })
    });
    
    const tokenData = await tokenResponse.json();
    const payload = JSON.parse(atob(tokenData.id_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
    
    if (payload.nonce !== storedNonce || payload.aud !== env.GOOGLE_CLIENT_ID) {
      return new Response(JSON.stringify({ success: false, error: 'Token verification failed' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const db = getDB();
    let user = await db.prepare('SELECT * FROM users WHERE google_id = ?').bind(payload.sub).first();
    
    if (!user) {
      const existingEmailUser = await db.prepare('SELECT * FROM users WHERE email = ?').bind(payload.email).first();
      
      if (existingEmailUser) {
        await db.prepare('UPDATE users SET google_id = ?, avatar_url = ? WHERE id = ?').bind(payload.sub, payload.picture, existingEmailUser.id);
        user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(existingEmailUser.id).first();
      } else {
        // 关键修复：创建用户时包含password_hash字段（使用空字符串）
        const result = await db.prepare(`
          INSERT INTO users (email, password_hash, google_id, avatar_url, is_verified, created_at, updated_at)
          VALUES (?, '', ?, ?, 1, datetime('now'), datetime('now'))
        `).bind(payload.email, payload.sub, payload.picture).run();
        
        user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(result.meta.last_row_id).first();
      }
    }
    
    const token = await generateSessionToken();
    await db.prepare('INSERT INTO user_sessions (user_id, token, expires_at, created_at) VALUES (?, ?, datetime("now", "+30 days"), datetime("now"))').bind(user.id, token).run();
    
    // 两种方式返回：
    // 1. 如果是从popup调用，返回JSON（用于postMessage）
    // 2. 如果是重定向调用，设置cookie并重定向到账户页面
    const userAgent = request.headers.get('user-agent') || '';
    
    // 方法2：设置cookie并重定向（推荐）
    const accountUrl = `${env.APP_URL}/account`;
    // 将token作为URL参数（账户页面会保存到localStorage）
    const redirectUrl = `${accountUrl}?token=${token}`;
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
      }
    });
    await db.prepare('INSERT INTO user_sessions (user_id, token, expires_at, created_at) VALUES (?, ?, datetime("now", "+30 days"), datetime("now"))').bind(user.id, token).run();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: payload.name, avatar_url: user.avatar_url, is_verified: user.is_verified }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Google OAuth Error:', error);
    console.error('Error details:', error.message, error.stack);
    return new Response(JSON.stringify({ success: false, error: error.message || 'OAuth callback processing failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

/**
 * 获取会员状态（用于前端判断是否显示广告）
 */
export async function handleGetMemberStatus(request, env, ctx) {
  try {
    const db = getDB();

    // 支持两种认证方式：Cookie 或 Authorization 头
    let token = null;
    
    // 1. 尝试从 Authorization 头获取（Bearer token）
    const authHeader = request.headers.get('Authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // 2. 如果没有，尝试从 Cookie 获取
    if (!token) {
      const cookieHeader = request.headers.get('Cookie') || '';
      const tokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
      if (tokenMatch) {
        token = tokenMatch[1];
      }
    }

    if (!token) {
      return new Response(JSON.stringify({
        success: true,
        isMember: false,
        adFreeEnabled: false
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证会话并获取用户 ID
    const session = await db.prepare(`
      SELECT s.user_id
      FROM user_sessions s
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first();

    if (!session) {
      return new Response(JSON.stringify({
        success: true,
        isMember: false,
        adFreeEnabled: false
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查会员状态
    const isMember = await checkMemberStatus(session.user_id, db);

    // 获取系统配置检查功能开关
    const systemConfig = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('member_ad_free_enabled').first();
    const adFreeEnabled = systemConfig && systemConfig.value === 'true';

    return new Response(JSON.stringify({
      success: true,
      isMember: isMember,
      adFreeEnabled: adFreeEnabled
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[handleGetMemberStatus] Error:', error);
    return new Response(JSON.stringify({
      success: true,
      isMember: false,
      adFreeEnabled: false
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
