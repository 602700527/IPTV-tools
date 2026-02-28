// Google OAuth 配置诊断脚本
// 访问 /api/auth/google/debug 来检查配置状态

export async function handleGoogleAuthDebug(request, env, ctx) {
  try {
    const diagnostics = {
      config: {},
      kv: {},
      database: {},
      summary: []
    };

    // 1. 检查环境变量
    diagnostics.config.google_client_id_exists = !!env.GOOGLE_CLIENT_ID;
    diagnostics.config.google_client_secret_exists = !!env.GOOGLE_CLIENT_SECRET;
    diagnostics.config.app_url = env.APP_URL;

    if (!env.GOOGLE_CLIENT_ID) {
      diagnostics.summary.push('❌ GOOGLE_CLIENT_ID 未设置');
    }
    if (!env.GOOGLE_CLIENT_SECRET) {
      diagnostics.summary.push('❌ GOOGLE_CLIENT_SECRET 未设置');
    }
    if (!env.APP_URL) {
      diagnostics.summary.push('⚠️ APP_URL 未设置（可能导致重定向URI错误）');
    }

    // 2. 检查 KV 存储连接
    if (env.KV) {
      diagnostics.kv.exists = true;
      try {
        // 测试KV写入
        const testKey = 'oauth_test_check';
        await env.KV.put(testKey, 'test', { expirationTtl: 60 });
        const testValue = await env.KV.get(testKey);
        diagnostics.kv.write_test = testValue === 'test' ? 'PASS' : 'FAIL';
        diagnostics.summary.push('✅ KV 存储工作正常');
      } catch (error) {
        diagnostics.kv.write_test = 'FAIL';
        diagnostics.kv.error = error.message;
        diagnostics.summary.push('❌ KV 存储失败: ' + error.message);
      }
    } else {
      diagnostics.kv.exists = false;
      diagnostics.summary.push('❌ KV 命名空间未绑定');
    }

    // 3. 检查数据库连接
    if (env.DB) {
      diagnostics.database.exists = true;
      try {
        // 测试数据库查询
        const result = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
        diagnostics.database.read_test = result ? 'PASS' : 'FAIL';
        diagnostics.database.user_count = result?.count || 0;

        // 检查是否有google_id字段
        const schemaCheck = await env.DB.prepare("PRAGMA table_info(users)").all();
        const hasGoogleId = schemaCheck.results?.some(col => col.name === 'google_id');
        const hasOauthProvider = schemaCheck.results?.some(col => col.name === 'oauth_provider');
        const hasAvatarUrl = schemaCheck.results?.some(col => col.name === 'avatar_url');

        diagnostics.database.has_google_id_field = hasGoogleId;
        diagnostics.database.has_oauth_provider_field = hasOauthProvider;
        diagnostics.database.has_avatar_url_field = hasAvatarUrl;

        if (hasGoogleId && hasOauthProvider && hasAvatarUrl) {
          diagnostics.summary.push('✅ 数据库迁移已完成（Google OAuth字段存在）');
        } else {
          diagnostics.summary.push('❌ 数据库迁移未完成，请运行: wrangler d1 execute tv-service-db --file=./migrations/008_add_google_oauth.sql');
        }
      } catch (error) {
        diagnostics.database.read_test = 'FAIL';
        diagnostics.database.error = error.message;
        diagnostics.summary.push('❌ 数据库访问失败: ' + error.message);
      }
    } else {
      diagnostics.database.exists = false;
      diagnostics.summary.push('❌ D1 数据库未绑定');
    }

    // 4. 检查回调URL
    if (env.APP_URL) {
      const callbackUrl = `${env.APP_URL}/api/auth/google/callback`;
      diagnostics.callback_url = callbackUrl;
      diagnostics.summary.push(`ℹ️ 配置的回调URL: ${callbackUrl}`);

      // 检查 Google Cloud Console 需要配置的回调URL
      if (env.APP_URL.includes('localhost') || env.APP_URL.includes('127.0.0.1')) {
        diagnostics.summary.push('⚠️ 检测到本地开发环境');
        diagnostics.summary.push('   Google Cloud Console 需要配置: http://localhost:8787/api/auth/google/callback');
      } else {
        diagnostics.summary.push('ℹ️ 生产环境');
        diagnostics.summary.push(`   请确保 Google Cloud Console 已配置: ${callbackUrl}`);
      }
    }

    return new Response(JSON.stringify(diagnostics, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Diagnostics failed:', error);
    return new Response(JSON.stringify({
      summary: ['❌ 诊断脚本执行失败'],
      error: error.message,
      stack: error.stack
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
