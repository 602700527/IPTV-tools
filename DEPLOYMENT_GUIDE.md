# 部署和生产环境验证指南

## 问题说明

**现象：**
- 本地开发环境：订阅和播放正常工作 ✅
- 生产环境：订阅正常，播放失败（403 Forbidden）❌

**根本原因：**
生产环境的数据库缺少 `subscription_ips` 表。

## 解决方案

### 1. 代码修改

已在 `worker.js` 中添加表创建逻辑：

```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      // 初始化数据库连接
      await initDB(env);

      // 确保表结构存在（自动迁移）
      await createTables(env);  // ✅ 新增
```

### 2. 部署步骤

#### 方法1：使用 Wrangler CLI 部署

```bash
# 1. 登录 Cloudflare（如果未登录）
npx wrangler login

# 2. 部署到生产环境
npx wrangler deploy

# 3. 查看部署日志
npx wrangler tail
```

#### 方法2：通过 Cloudflare Dashboard 部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 选择您的 Worker
4. 点击 **Deploy** 按钮
5. 上传代码文件

### 3. 验证数据库表结构

部署完成后，需要验证 `subscription_ips` 表是否创建成功。

#### 方法1：通过管理后台 API 检查

访问管理后台的数据库初始化接口：

```bash
# 触发表结构创建
curl -X POST https://your-worker.com/admin/api/init-db \
  -H "Content-Type: application/json" \
  -d '{"admin_key": "your-admin-key"}'

# 触发数据库迁移
curl -X POST https://your-worker.com/admin/api/migrate-db \
  -H "Content-Type: application/json" \
  -d '{"admin_key": "your-admin-key"}'
```

**预期响应：**
```json
{
  "success": true,
  "message": "Database tables initialized"
}
```

#### 方法2：通过管理后台界面检查

1. 访问：`https://your-worker.com/admin/`
2. 登录管理后台
3. 查看 **数据库管理** 或 **系统设置** 页面
4. 点击 **初始化数据库** 或 **数据库迁移** 按钮

### 4. 查看 Cloudflare 日志

部署后，查看 Worker 日志确认表是否创建成功：

```bash
# 使用 Wrangler 查看实时日志
npx wrangler tail
```

**预期日志：**
```
Database: subscription_ips table created or already exists
Database: subscription_ips indexes created or already exist
Tables created successfully
```

**如果看到错误：**
```
Database: Failed to create subscription_ips table: [错误信息]
```

### 5. 测试订阅和播放

#### 5.1 测试订阅

```bash
# 订阅
curl -v https://your-worker.com/sub/YOUR_CODE.m3u
```

**预期结果：**
- 状态码：200 OK
- 内容：M3U 格式
- 日志：`[Sub] Code: YOUR_CODE, IP: xxx.xxx.xxx.xxx, Allowed: true`

#### 5.2 测试播放

从M3U中获取播放地址，然后：

```bash
# 播放
curl -v https://your-worker.com/live/YOUR_CODE/CHANNEL_HASH
```

**预期结果：**
- 状态码：302 Found
- Location：真实的播放URL
- 日志：`[Live] Code: YOUR_CODE, IP: xxx.xxx.xxx.xxx, IsAuthorized: true`

## 常见问题排查

### 问题1：部署成功，但表未创建

**现象：**
- 访问订阅正常
- 访问播放返回403
- 日志中没有 "subscription_ips table created"

**原因：**
`createTables(env)` 函数执行失败。

**排查步骤：**

1. 检查 Cloudflare Workers 日志：
```bash
npx wrangler tail
```

2. 查看是否有错误信息：
```
Database: Failed to create subscription_ips table: [错误信息]
```

3. 如果有错误，检查错误信息并修复

**解决方案：**

手动触发表创建：
```bash
curl -X POST https://your-worker.com/admin/api/init-db \
  -H "Content-Type: application/json" \
  -d '{"admin_key": "your-admin-key"}'
```

### 问题2：表创建成功，但仍然403

**现象：**
- 日志显示 "subscription_ips table created"
- 播放仍然返回403

**原因：**
1. Worker 缓存问题
2. 数据库同步延迟
3. Worker 多实例问题

**排查步骤：**

1. 清除浏览器缓存
2. 检查 Worker 日志中的 IP 信息：
```
[Cache checkAndAdd] Code: xxx, IP: xxx.xxx.xxx.xxx, Date: 2025-01-15
```

3. 检查播放验证日志：
```
[Cache getAuthorized] subscriptionIPCache size: 1
[Live] Code: xxx, IP: xxx.xxx.xxx.xxx, IsAuthorized: true
```

**解决方案：**

如果缓存为空，重新订阅一次：
```bash
curl https://your-worker.com/sub/YOUR_CODE.m3u
```

### 问题3：IP 获取失败

**现象：**
```
[Live] Code: xxx, IP: null, Authorized IPs: , IsAuthorized: false
```

**原因：**
生产环境无法获取客户端IP。

**排查步骤：**

1. 检查 HTTP 头部：
   - `CF-Connecting-IP`
   - `X-Forwarded-For`
   - `X-Real-IP`

2. 查看日志：
```
▲ [WARNING] [IP] No client IP found, using 127.0.0.1 for local development
```

**解决方案：**

如果生产环境也出现这个警告，说明 IP 获取逻辑需要调整。

## 部署检查清单

部署前请确认：

- [x] `subscription_ips` 表创建逻辑已添加到 `worker.js`
- [x] `createTables(env)` 在每次 Worker 启动时调用
- [x] 添加了详细的日志输出
- [x] 本地测试通过
- [x] 代码已提交到版本控制

部署后请验证：

- [ ] 查看 Cloudflare 日志，确认 "subscription_ips table created"
- [ ] 测试订阅接口，返回200
- [ ] 测试播放接口，返回302
- [ ] 检查日志中的 IP 信息正常
- [ ] 检查缓存大小和状态

## 性能监控

部署后，建议监控以下指标：

### 1. 数据库查询时间
- 订阅请求：应该在 10-50ms
- 播放请求：应该在 1-5ms（使用内存缓存）

### 2. 缓存命中率
- 内存缓存：应该在 99% 以上
- KV 缓存：频道列表应该在 90% 以上

### 3. 错误率
- 403 错误：应该在 1% 以下
- 500 错误：应该在 0.1% 以下

## 回滚方案

如果部署后出现问题，可以快速回滚：

### 方法1：回滚代码

```bash
# 回滚到上一个版本
git checkout HEAD~1

# 重新部署
npx wrangler deploy
```

### 方法2：通过 Dashboard 回滚

1. 登录 Cloudflare Dashboard
2. 进入 **Workers & Pages**
3. 选择您的 Worker
4. 点击 **Rollback** 按钮
5. 选择之前的版本

## 总结

**关键修改：**
1. ✅ `worker.js` 中添加 `createTables(env)` 调用
2. ✅ 每次 Worker 启动时自动创建/更新表结构
3. ✅ 添加详细的日志输出，方便排查问题

**部署后验证：**
1. ✅ 查看日志确认表创建成功
2. ✅ 测试订阅和播放功能
3. ✅ 监控性能指标

如果遇到问题，请按照上述排查步骤逐一检查。
