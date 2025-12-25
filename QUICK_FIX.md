# 数据库迁移快速修复指南

## 问题描述

使用"启用/禁用源"功能时出现 `500 Internal Server Error`，错误信息为 `D1_ERROR`。

**原因**：数据库 `sources` 表缺少 `is_active` 字段。

## 解决方案

### 方法1：通过管理后台升级（推荐）

1. 登录管理后台：`https://sys.iptv-search.com/admin`
2. 进入"仪表盘"页面
3. 点击右上角的"升级数据库"按钮
4. 确认升级操作
5. 等待提示"数据库升级成功"
6. 重新加载页面

### 方法2：通过API接口升级

```bash
curl -X GET https://sys.iptv-search.com/admin/migrate \
  -H "X-Admin-Key: your-admin-key"
```

### 方法3：手动执行SQL

登录 Cloudflare D1 控制台执行：

```sql
ALTER TABLE sources ADD COLUMN is_active BOOLEAN DEFAULT 1;
```

### 方法4：重新部署 Worker（会清空数据！⚠️）

```bash
wrangler deploy
```

**注意**：此方法会清空所有现有数据，仅用于测试环境！

## 验证升级成功

升级成功后，执行以下操作验证：

1. 进入"直播源管理"页面
2. 查看源列表是否显示"状态"列
3. 尝试点击"启用/禁用"按钮
4. 确认状态可以正常切换

## 新增功能说明

升级完成后，可以使用以下功能：

### 1. 源的启用/禁用
- **目的**：临时禁用某个源进行维护，或排除有问题的源
- **影响范围**：
  - 订阅链接不会显示禁用源的频道
  - 自动同步不会处理禁用的源
  - 手动同步不会处理禁用的源

### 2. 批量同步
- **位置**：直播源管理页面顶部"同步全部"按钮
- **功能**：同步所有启用的源
- **使用场景**：需要更新所有源数据时

### 3. 定时任务
- **配置文件**：`wrangler.toml` 中的 `[triggers]` 部分
- **默认配置**：每天凌晨2点自动同步所有启用的源
- **自定义**：可修改cron表达式调整执行频率

## 常用Cron表达式

| 表达式 | 说明 |
|---------|------|
| `0 2 * * *` | 每天凌晨2点 |
| `*/30 * * * *` | 每30分钟 |
| `0 */6 * * *` | 每6小时 |
| `0 0 * * 0` | 每周日午夜 |
| `0 0 1 * *` | 每月1号午夜 |

## 修改定时任务配置

1. 编辑 `wrangler.toml` 文件
2. 修改 `crons` 配置项
3. 重新部署 Worker
   ```bash
   wrangler deploy
   ```

## 技术细节

### 数据库变更
```sql
-- 添加 is_active 字段
ALTER TABLE sources ADD COLUMN is_active BOOLEAN DEFAULT 1;

-- 现有数据自动设置为启用（1）
UPDATE sources SET is_active = 1 WHERE is_active IS NULL;
```

### API接口
- `GET /admin/migrate` - 执行数据库迁移
- `PATCH /admin/sources/toggle/{id}` - 切换源状态

### 订阅链接变化
订阅链接只返回**启用源**的频道：
```sql
SELECT c.* 
FROM channels c
INNER JOIN sources s ON c.source_id = s.id
WHERE c.is_active = 1 AND s.is_active = 1
ORDER BY c.group_title, c.channel_name
```

## 注意事项

1. **升级前备份**：建议升级前导出重要数据
2. **测试环境**：先在测试环境验证升级流程
3. **监控日志**：升级后检查 Cloudflare Workers 日志
4. **功能验证**：升级后逐一验证所有功能是否正常

## 故障排除

### Q: 升级后仍然报错？
A: 清除浏览器缓存，重新登录管理后台。

### Q: 数据库迁移失败？
A: 检查：
1. 管理员密钥是否正确
2. D1数据库是否正常运行
3. Cloudflare Workers 是否有足够的权限

### Q: 升级后数据丢失？
A: 迁移只会添加字段，不会删除数据。如遇数据问题，检查 Cloudflare D1 控制台。

### Q: 如何回滚？
A: 删除添加的字段：
```sql
-- SQLite不支持直接删除字段，需要重建表
-- 建议联系技术支持
```

## 联系支持

如遇到问题，请提供以下信息：
- 错误消息
- 操作步骤
- Cloudflare Workers 日志
- D1数据库版本

---
**更新时间**：2025-12-25
