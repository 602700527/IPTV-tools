# Google OAuth 集成说明

本文档说明如何使用Google OAuth登录功能。

## 功能概述

此TV流媒体服务支持Google OAuth登录，用户可以使用Google账号快速登录系统。

## 已实施的功能

### 后端
- ✅ 数据库迁移（添加`google_id`, `oauth_provider`, `avatar_url`字段）
- ✅ OAuth授权初始化（GET `/api/auth/google/init`）
- ✅ OAuth回调处理（GET `/api/auth/google/callback`）
- ✅ ID token验证（nonce, aud, iss, exp验证）
- ✅ 用户账号关联逻辑（Google账号关联已有email账号）
- ✅ 会话生成（复用现有session系统）

### 前端
- ✅ Google Auth JavaScript模块（`utils/google-oauth.js`）
- ✅ OAuth回调辅助页面（`google-oauth-callback.html`）

## 配置步骤

### 1. Google Cloud Console 配置

#### 1.1 创建OAuth 2.0 凭据
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择您的项目或创建新项目
3. 进入：API和服务 → 凭据
4. 点击"创建凭据" → "OAuth 2.0 客户端 ID"
5. 应用类型选择：Web 应用程序
6. 配置授权重定向 URI：
   - 生产环境：`https://iptv-search.com/api/auth/google/callback`
   - 开发环境：`http://localhost:8787/api/auth/google/callback`

#### 1.2 获取凭据
创建后会得到：
- Client ID：`1070165774283-e75bs3en213p81iaq3g5dmpt15e6te9l.apps.googleusercontent.com`
- Client Secret：已配置在`wrangler.toml`中

### 2. wrangler.toml 配置

```toml
[vars]
# Google OAuth 配置
GOOGLE_CLIENT_ID = "1070165774283-e75bs3en213p81iaq3g5dmpt15e6te9l.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
```

### 3. 数据库迁移

运行迁移脚本：
```bash
wrangler d1 execute tv-service-db --file=./migrations/008_add_google_oauth.sql
```

## API 接口文档

### 1. OAuth 初始化

**端点**: `GET /api/auth/google/init`

**响应**:
```json
{
  "success": true,
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "state": "a1b2c3..."
}
```

**功能**: 生成OAuth授权URL和state参数（用于CSRF防护）

### 2. OAuth 回调

**端点**: `GET /api/auth/google/callback`

**查询参数**:
- `code`: Google授权码（必需）
- `state`: OAuth state参数（必需）
- `error`: 错误信息（如果用户拒绝授权）

**响应**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "64位hex会话token",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "name": "User Name",
    "avatar_url": "https://...",
    "is_verified": true,
    "created_at": "2025-02-25T...",
    "login_type": "google"
  }
}
```

**功能**: 
1. 验证state参数
2. 兑换授权码获取access token和ID token
3. 验证ID token（nonce, aud, iss, exp）
4. 查找或创建用户
5. 生成会话token
6. 返回登录信息

## 前端集成

### 方式1: 使用Google OAuth模块

1. 引入模块：
```html
<script type="module">
  import GoogleAuth from '/utils/google-oauth.js';

  // 初始化
  GoogleAuth.init({
    onSuccess: (data) => {
      console.log('登录成功:', data);
      // 保存token
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      // 跳转到账户页面
      window.location.href = '/account';
    },
    onError: (error) => {
      console.error('登录失败:', error);
      alert('登录失败: ' + error);
    },
    onInit: () => {
      console.log('Google Auth 初始化完成');
    }
  });

  // 渲染登录按钮
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('google-signin-container');
    if (container) {
      GoogleAuth.renderButton(container);
    }
  });
</script>
```

2. 添加按钮容器：
```html
<div id="google-signin-container" style="text-align: center; margin: 20px 0;"></div>
```

### 方式2: 直接API调用

```javascript
// 1. 获取授权URL
fetch('/api/auth/google/init')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // 2. 打开popup
      const popup = window.open(data.auth_url, 'googleAuthPopup', 'width=500,height=600');

      // 3. 监听消息
      window.addEventListener('message', (event) => {
        if (event.origin === window.location.origin) {
          if (event.data.type === 'google_oauth_success') {
            // 保存token
            localStorage.setItem('auth_token', event.data.token);
            localStorage.setItem('user_info', JSON.stringify(event.data.user));
            // 关闭popup
            popup.close();
            // 跳转
            window.location.href = '/account';
          }
        }
      });
    }
  });
```

### 方式3: 简单跳转（无popup）

```html
<!-- 直接跳转到Google授权页面 -->
<a href="#" onclick="initiateGoogleLogin()">
  <img src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png" alt="Sign in with Google">
</a>

<script>
function initiateGoogleLogin() {
  fetch('/api/auth/google/init')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = data.auth_url;
      }
    });
}
</script>
```

## 安全特性

1. **State参数**: 256位随机数，存储在KV（10分钟TTL），防止CSRF攻击
2. **Nonce验证**: 每次请求生成唯一nonce，验证ID token防止重放攻击
3. **Token验证**: 完整验证Google ID token的所有claims（aud, iss, exp, nonce）
4. **会话管理**: 生成自己的session token，不依赖Google token
5. **HTTPS强制**: 所有OAuth通信必须使用HTTPS

## 数据库变更

### users表新增字段：
```sql
-- Google账号唯一ID
ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE;

-- 认证提供商标识 ('email' 或 'google')
ALTER TABLE users ADD COLUMN oauth_provider TEXT DEFAULT 'email';

-- 用户头像URL
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- 索引
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_oauth_provider ON users(oauth_provider);
```

## 账号关联逻辑

Google OAuth支持以下两种场景：

### 场景1: Google账号直接登录
- 用户首次使用Google账号登录
- 系统自动创建新用户
- `is_verified=1`（Google已验证email）

### 场景2: 关联已有账号
- 用户已使用email+password注册
- 使用相同email的Google账号登录
- 系统自动关联Google账号到现有用户
- 保留原有密码登录功能

## 故障排查

### 问题1: "Client ID not authorized"错误
**原因**: Google Cloud Console中未配置正确的重定向URI

**解决**: 
1. 打开Google Cloud Console
2. 进入API和服务 → 凭据
3. 编辑OAuth 2.0客户端ID
4. 添加完整的回调URL（包括路径）

### 问题2: "State expired or invalid"错误
**原因**: State参数过期（超过10分钟）或已被使用

**解决**: 
- 重新发起登录请求
- 检查KV存储是否正常工作

### 问题3: Popup被浏览器阻止
**原因**: 浏览器弹出窗口拦截器

**解决**: 
- 告诉用户允许此网站的弹出窗口
- 或者使用"简单跳转"方式（无popup）

### 问题4: 登录后未保存token
**原因**: localStorage未启用或cookie被阻塞

**解决**: 
- 检查浏览器隐私设置
- 确保localStorage可用

## 技术细节

### OAuth 2.0 流程

```
┌─────────────────────────────────────────────────────────────┐
│                    Google OAuth 流程                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 用户点击"使用Google登录"                                 │
│                    ↓                                         │
│  2. 前端 → GET /api/auth/google/init                        │
│              ← 返回: auth_url, state                         │
│                    ↓                                         │
│  3. 浏览器打开Google授权页面（popup）                        │
│              - 用户登录并授权                               │
│              - Google返回: code + state                     │
│                    ↓                                         │
│  4. Google OAuth回调 → GET /api/auth/google/callback        │
│              ?code=xxx&state=yyy                            │
│                    ↓                                         │
│  5. 后端验证流程：                                           │
│     ✓ 验证state（从KV获取）                                  │
│     ✓ 兑换code → access_token + id_token                    │
│     ✓ 验证id_token（nonce, aud, iss, exp）                   │
│     ✓ 提取用户信息（email, sub, name, picture）            │
│              ↓                                               │
│  6. 用户处理：                                               │
│     - 查找用户: SELECT WHERE google_id = ?                  │
│     - 不存在？→ 邮箱已注册？→ 关联账号                       │
│     - 不存在？→ 创建新用户                                  │
│     - 已存在？→ 更新avatar                                  │
│              ↓                                               │
│  7. 生成会话：                                               │
│     - 生成32字节随机token                                   │
│     - 插入user_sessions表（30天过期）                       │
│                    ↓                                         │
│  8. 返回：                                                   │
│     - token（会话token）                                    │
│     - user（用户信息）                                      │
│     - 关闭popup通知父窗口                                    │
│     → 跳转到账户页面                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 文件清单

| 文件 | 说明 |
|------|------|
| `migrations/008_add_google_oauth.sql` | 数据库迁移脚本 |
| `handlers/auth.js` | OAuth处理器（已包含Google OAuth函数） |
| `worker.js` | 路由配置（已包含Google OAuth路由） |
| `utils/google-oauth.js` | 前端Google Auth模块 |
| `google-oauth-callback.html` | OAuth回调解理页面 |
| `wrangler.toml` | 环境变量配置 |

## 测试建议

### 1. 本地测试
```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:8787
# 测试Google登录流程
```

### 2. 测试清单
- [ ] 首次Google登录能创建新用户
- [ ] 相同email的账号能正确关联
- [ ] Login返回的token能正常使用
- [ ] Token过期后需要重新登录
- [ ] Popup模式正常工作
- [ ] 错误情况有友好提示

## 后续优化建议

1. **Refresh Token**: 存储Google refresh token，支持长期会话
2. **头像缓存**: 缓存Google头像到本地，减少API调用
3. **多账号支持**: 允许用户绑定多个Google账号
4. **OAuth提供商标记**: 在前端显示"使用Google登录"徽章
5. **监控日志**: 添加OAuth流程的详细日志便于排查问题

## 参考资源

- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In for Web](https://developers.google.com/identity/gsi/web)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
