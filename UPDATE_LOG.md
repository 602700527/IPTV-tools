# 功能更新说明

## 更新内容

### 1. 数据源禁用功能

#### 数据库变更
在 `sources` 表中新增 `is_active` 字段：
```sql
ALTER TABLE sources ADD COLUMN is_active BOOLEAN DEFAULT 1;
```

#### API接口

**切换源的启用/禁用状态**
```
PATCH /admin/sources/toggle/{id}
Content-Type: application/json

Body: {
  "is_active": true  // true: 启用, false: 禁用, 不传: 自动切换
}
```

**更新源时同时更新状态**
```
PUT /admin/sources
Body: {
  "id": 1,
  "name": "源名称",
  "url": "https://example.com/playlist.m3u",
  "type": "m3u",
  "parse_mode": "strict",
  "is_active": 1  // 新增字段
}
```

#### 前端功能
- 在直播源列表中显示源的启用/禁用状态（徽章显示）
- 每个源添加"启用/禁用"按钮
- 按钮颜色根据状态动态变化（启用时显示红色禁用按钮，禁用时显示绿色启用按钮）

#### 订阅功能变更
订阅链接只会返回**启用源**的频道：
```sql
SELECT c.* 
FROM channels c
INNER JOIN sources s ON c.source_id = s.id
WHERE c.is_active = 1 AND s.is_active = 1
```

### 2. 自动同步定时任务

#### 功能说明
- 自动同步所有**启用状态**的数据源
- 删除旧频道数据，获取最新频道数据
- 同步过程中记录详细的日志信息

#### 定时任务处理器

**新建文件**: `handlers/scheduler.js`

**主要功能**:
1. `handleScheduledEvent()`: Cloudflare定时事件处理器
   - 获取所有启用的源
   - 逐个同步源数据
   - 记录同步结果和日志

2. `manualSyncAll()`: 手动同步所有启用的源
   - 返回详细的同步结果
   - 包含每个源的同步状态

#### 配置方法

**在 `wrangler.toml` 中配置**:
```toml
[triggers]
crons = ["0 2 * * *"]  # 每天凌晨2点执行
```

**常用Cron表达式**:
- `0 2 * * *` - 每天凌晨2点
- `*/30 * * * *` - 每30分钟
- `0 */6 * * *` - 每6小时
- `0 0 * * 0` - 每周日午夜
- `0 0 1 * *` - 每月1号午夜

**部署步骤**:
1. 修改 `wrangler.toml` 中的cron表达式
2. 重新部署Worker: `wrangler deploy`
3. 在Cloudflare控制台确认定时任务已配置

#### API接口

**手动触发同步所有源**
```
POST /admin/sync/all
```

**响应示例**:
```json
{
  "success": true,
  "message": "同步完成：3个成功，0个失败",
  "total_sources": 3,
  "success_count": 3,
  "fail_count": 0,
  "results": [
    {
      "source_id": 1,
      "source_name": "央视源",
      "success": true,
      "deleted_channels": 100,
      "new_channels": 105,
      "error": null
    },
    {
      "source_id": 2,
      "source_name": "卫视源",
      "success": true,
      "deleted_channels": 80,
      "new_channels": 82,
      "error": null
    },
    {
      "source_id": 3,
      "source_name": "其他源",
      "success": true,
      "deleted_channels": 50,
      "new_channels": 48,
      "error": null
    }
  ]
}
```

#### 前端功能

**新增"同步全部"按钮**:
- 位置：直播源管理页面顶部工具栏
- 功能：手动触发所有启用源的同步
- 确认：点击后会显示确认对话框
- 反馈：显示同步进度和结果

**定时任务控制面板**:
- 位置：直播源管理页面，列表下方
- 显示当前cron表达式
- 允许修改cron表达式（需要手动部署）
- 提供cron表达式说明

### 3. Worker配置更新

**在 `worker.js` 中添加定时任务处理器**:
```javascript
export default {
  async fetch(request, env, ctx) { ... },
  
  // 新增定时任务处理
  async scheduled(event, env, ctx) {
    await handleScheduledEvent(event, env, ctx);
  }
};
```

## 使用指南

### 启用/禁用数据源

1. 登录管理后台
2. 进入"直播源管理"页面
3. 找到要操作的源
4. 点击"启用"或"禁用"按钮
5. 确认操作后状态会立即更新

### 设置定时同步

1. 登录管理后台
2. 进入"直播源管理"页面
3. 找到"定时任务控制"区域
4. 修改cron表达式（例如：`0 2 * * *` 表示每天凌晨2点）
5. 点击"保存定时任务配置"
6. 根据提示在Cloudflare控制台重新部署Worker

### 手动同步所有源

1. 登录管理后台
2. 进入"直播源管理"页面
3. 点击顶部"同步全部"按钮
4. 确认操作
5. 等待同步完成（可能需要几分钟）
6. 查看同步结果和详细信息

## 注意事项

### 数据库升级

如果系统已经运行，需要手动添加 `is_active` 字段：

**方法1: 通过SQL执行**
```sql
ALTER TABLE sources ADD COLUMN is_active BOOLEAN DEFAULT 1;
```

**方法2: 重新初始化数据库**
```bash
curl -X GET https://your-worker.workers.dev/admin/init \
  -H "X-Admin-Key: your-admin-key"
```

**注意**: 重新初始化会清空所有数据，请谨慎使用！

### 同步操作的影响

1. **单个源同步**：只删除和更新该源的频道数据
2. **全部同步**：删除所有启用源的旧数据，重新获取
3. **定时同步**：后台自动执行，不影响用户访问

### 性能考虑

- 同步操作会删除旧频道数据，建议在低峰期执行
- 大量源同时同步可能占用较多资源
- 缓存会在下次请求时自动更新

### 监控建议

- 定期检查定时任务日志
- 监控同步失败的源
- 关注频道数量变化
- 检查磁盘空间使用（如适用）

## 常见问题

### Q1: 禁用源后，已生成的订阅链接还能使用吗？
A: 可以，但不会显示该源的频道。如果用户播放该源的频道，会返回404错误。

### Q2: 如何临时禁用一个源进行维护？
A: 点击源的"禁用"按钮即可。禁用后该源不会出现在订阅链接中，也不会被自动同步。

### Q3: 定时任务执行失败怎么办？
A: 检查Cloudflare Workers日志，查看具体错误信息。常见原因：
- 源URL不可访问
- 网络超时
- 数据库连接问题

### Q4: 可以设置多个定时任务吗？
A: 可以，在 `wrangler.toml` 中配置多个cron表达式：
```toml
[triggers]
crons = ["0 2 * * *", "0 14 * * *"]  # 每天凌晨2点和下午2点
```

### Q5: 如何取消定时任务？
A: 从 `wrangler.toml` 中删除 `[triggers]` 部分，然后重新部署：
```bash
wrangler deploy
```

## 技术细节

### 定时任务流程

```
触发定时任务
    ↓
获取所有启用的源 (WHERE is_active = 1)
    ↓
逐个同步源
    ├─ 获取旧频道数
    ├─ 删除旧频道
    ├─ 获取M3U内容
    ├─ 解析并插入新频道
    └─ 记录结果
    ↓
统计同步结果
    ├─ 成功数量
    ├─ 失败数量
    ├─ 删除总数
    └─ 新增总数
    ↓
记录日志
```

### 状态管理

**源的启用/禁用状态**:
- 存储位置：`sources.is_active` 字段
- 默认值：1（启用）
- 影响范围：
  - 订阅生成
  - 自动同步
  - 手动同步

**日志级别**:
- `info`: 同步开始/完成
- `error`: 同步失败
- `debug`: 详细的同步步骤

## 未来改进

1. **增量同步**: 只同步变化的频道，减少数据量
2. **并行同步**: 多个源同时同步，提高效率
3. **失败重试**: 自动重试失败的源
4. **通知机制**: 同步完成后发送通知
5. **统计报表**: 同步历史和趋势分析
