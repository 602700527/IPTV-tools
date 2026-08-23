/**
 * 使用 Resend 发送邮件
 * @param {string} to - 收件人邮箱
 * @param {string} subject - 邮件主题
 * @param {string} html - HTML 内容
 * @param {object} env - Cloudflare Workers 环境变量
 */
export async function sendEmail(to, subject, html, env) {
  const RESEND_API_KEY = env.RESEND_API_KEY;
  const FROM_EMAIL = env.FROM_EMAIL;

  if (!RESEND_API_KEY || !FROM_EMAIL) {
    console.error('邮件服务未配置: RESEND_API_KEY=', !!RESEND_API_KEY, 'FROM_EMAIL=', FROM_EMAIL);
    throw new Error('邮件服务未配置');
  }

  try {
    console.log('发送邮件到:', to, '主题:', subject);
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: to,
        subject: subject,
        html: html,
      }),
    });

    console.log('Resend API 响应状态:', response.status);
    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API 错误:', error);
      throw new Error(error.message || '邮件发送失败');
    }

    const data = await response.json();
    console.log('邮件发送成功:', data);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('邮件发送失败:', error);
    throw error;
  }
}

/**
 * 生成邮箱验证邮件 HTML
 * @param {string} email - 用户邮箱
 * @param {string} code - 验证码
 * @param {string} verifyUrl - 验证链接
 */
export function generateVerificationEmailHtml(email, code, verifyUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>邮箱验证</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e50914 0%, #b81d24 100%); padding: 30px; text-align: center;">
      <h1 style="color: #000000; margin: 0; font-size: 28px;">📺 TV Live Service</h1>
    </div>
    
    <div style="padding: 40px 30px;">
      <h2 style="color: #000000; font-size: 24px; margin: 0 0 20px;">Email Verification</h2>
      
      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        感谢您注册 TV Live Service！请使用以下验证码验证您的邮箱：
      </p>
      
      <div style="background-color: #f5f5f7; border: 2px solid #e50914; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
        <span style="color: #e50914; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${code}</span>
      </div>
      
      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
        验证码有效期为 <strong>10 分钟</strong>，请尽快验证。如果您没有注册我们的服务，请忽略此邮件。
      </p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background-color: #e50914; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          或点击这里直接验证
        </a>
      </div>
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
 * 生成 VIP 临到期提醒邮件 HTML（T-3 触达用）
 * @param {string} email - 用户邮箱
 * @param {number} daysLeft - 剩余天数（1-3）
 * @param {string} renewUrl - 续费链接
 */
export function generateVipExpiringHtml(email, daysLeft, renewUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>您的 VIP 即将到期</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e50914 0%, #b81d24 100%); padding: 30px; text-align: center;">
      <h1 style="color: #000000; margin: 0; font-size: 28px;">📺 TV Live Service</h1>
    </div>

    <div style="padding: 40px 30px;">
      <h2 style="color: #000000; font-size: 24px; margin: 0 0 20px;">您的 VIP 还有 ${daysLeft} 天到期</h2>

      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        ${email}，您的 VIP 订阅将在 <strong style="color:#e50914;">${daysLeft} 天后到期</strong>。
        续费可保留当前的 IP 数、设备数、收藏夹设置，免广告、HD/4K 画质无中断。
      </p>

      <div style="background-color: #fff5f5; border-left: 4px solid #e50914; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
        <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">
          <strong>到期后会发生什么：</strong><br>
          • 广告恢复显示<br>
          • 画质回落到 SD<br>
          • 同时连接数限制为 1
        </p>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${renewUrl}" style="display: inline-block; background-color: #e50914; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          立即续费 →
        </a>
      </div>
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
 * 生成 VIP 已到期邮件 HTML
 * @param {string} email - 用户邮箱
 * @param {string} renewUrl - 续费链接
 */
export function generateVipExpiredHtml(email, renewUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>您的 VIP 已到期</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e50914 0%, #b81d24 100%); padding: 30px; text-align: center;">
      <h1 style="color: #000000; margin: 0; font-size: 28px;">📺 TV Live Service</h1>
    </div>

    <div style="padding: 40px 30px;">
      <h2 style="color: #000000; font-size: 24px; margin: 0 0 20px;">您的 VIP 已到期</h2>

      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        ${email}，您的 VIP 订阅已于今天到期。
        我们为您保留了 30 天内恢复续费的优惠通道——重新激活后所有收藏夹、设置都还在。
      </p>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${renewUrl}" style="display: inline-block; background-color: #e50914; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          续费并恢复 VIP
        </a>
      </div>
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
 * 生成失活用户 re-engagement 邮件 HTML
 * @param {string} email - 用户邮箱
 * @param {number} daysSince - 距离上次访问天数
 * @param {string} browseUrl - 浏览链接
 */
export function generateReEngagementHtml(email, daysSince, browseUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>想您了 — 来看看新频道</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e50914 0%, #b81d24 100%); padding: 30px; text-align: center;">
      <h1 style="color: #000000; margin: 0; font-size: 28px;">📺 TV Live Service</h1>
    </div>

    <div style="padding: 40px 30px;">
      <h2 style="color: #000000; font-size: 24px; margin: 0 0 20px;">${daysSince} 天没见您了</h2>

      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        ${email}，您的 VIP 订阅还在有效期内，但我们注意到您 ${daysSince} 天没来看节目了。
        最近新上线了不少频道——回来看看吧。
      </p>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${browseUrl}" style="display: inline-block; background-color: #e50914; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          浏览新频道 →
        </a>
      </div>
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
