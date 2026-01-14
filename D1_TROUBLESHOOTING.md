# D1 数据库故障排查指南

## 问题描述

### 问题 1：Migration Error
错误：`{"message": "Migration error: Error: D1_ERROR"}`

### 问题 2：Transaction Error
错误：`D1_ERROR: To execute a transaction, please use state.storage.transaction() or state.storage.transactionSync() APIs instead of SQL BEGIN TRANSACTION or SAVEPOINT statements`

## 已修复的问题

### 1. FOREIGN KEY 不兼容
**问题**：Cloudflare D1 不支持 FOREIGN KEY 约束

**已修复的表**：
- `channels` 表
- `ad_bindings` 表
- `checkin_records` 表

### 2. 事务 API 不兼容
**问题**：D1 不支持显式的 SQL 事务语句

**已修复**：
- 移除了 `BEGIN TRANSACTION`
- 移除了 `COMMIT`
- 移除了 `ROLLBACK`
- 改用 D1 的 `batch` API（本身就是原子的）

**D1 批量操作的最佳实践**：
```javascript
// ✅ 正确：使用 batch API
await db.batch(statements); // batch 本身就是原子的

// ❌ 错误：使用显式事务
await db.batch([db.prepare('BEGIN TRANSACTION')]);
await db.batch(statements);
await db.batch([db.prepare('COMMIT')]);
```

## 部署步骤

### 1. 本地测试
```bash
# 启动本地开发服务器（使用模拟 D1）
wrangler dev

# 测试 D1 连接
curl http://localhost:8787/test/d1
```

### 2. 部署到生产环境
```bash
# 部署 Worker
wrangler deploy

# 验证 D1 数据库
wrangler d1 execute tv-service-db --command="SELECT 1 as test"

# 测试生产环境 D1 连接
curl https://iptv-search.com/test/d1
```

### 3. 如果仍然失败

#### 检查 D1 数据库是否存在
```bash
# 列出所有 D1 数据库
wrangler d1 list

# 如果 tv-service-db 不存在，创建它
wrangler d1 create tv-service-db

# 更新 wrangler.toml 中的 database_id
```

#### 检查 D1 绑定
在 Cloudflare Dashboard 中：
1. 进入 Workers & Pages
2. 找到 `cf-tv-service` Worker
3. 点击 Settings → Variables
4. 确认 D1 绑定 `DB` 已正确配置

#### 查看详细日志
在 Cloudflare Dashboard 中：
1. 进入 Workers & Pages → cf-tv-service
2. 点击 Logs
3. 过滤错误日志，查看详细的 D1 错误信息

#### 重置数据库（最后手段）
```bash
# ⚠️ 警告：这将删除所有数据

# 备份数据
wrangler d1 export tv-service-db --output=backup.sql

# 删除并重新创建数据库
wrangler d1 delete tv-service-db
wrangler d1 create tv-service-db

# 导入数据
wrangler d1 execute tv-service-db --file=schema.sql

# 重新部署 Worker
wrangler deploy
```

## 常见 D1 错误

### D1_ERROR
通用 D1 错误，可能是：
- 数据库未绑定
- 表结构错误
- 查询超时
- 配额超限

### 解决方案
1. 验证 D1 绑定
2. 检查表结构（已修复 FOREIGN KEY 问题）
3. 增加 Worker 的 CPU 限制
4. 检查 D1 配额使用情况

## 监控和健康检查

### 添加监控端点
- `/test/d1` - D1 连接测试
- `/test/sync` - 手动触发同步
- `/test/sync-all` - 完整同步+缓存

### 健康检查脚本
```bash
#!/bin/bash
# health-check.sh

# 测试 D1 连接
RESULT=$(curl -s https://iptv-search.com/test/d1)
echo $RESULT

# 检查是否成功
if echo $RESULT | grep -q '"success":true'; then
    echo "✓ D1 数据库正常"
    exit 0
else
    echo "✗ D1 数据库异常"
    exit 1
fi
```

## 联系支持

如果问题仍然存在：
1. 收集完整的错误日志
2. 记录复现步骤
3. 提交 Cloudflare Support Ticket
4. 在 Worker Dashboard 中开启 Real-time Logs

## 更新日志
- 2026-01-14: 移除所有 FOREIGN KEY 约束，修复 D1 兼容性问题
- 2026-01-14: 添加 D1 诊断测试路由 `/test/d1`
