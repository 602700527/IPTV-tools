# 定时任务同步规则修复说明

## 问题描述

定时任务的同步有bug：没有应用同步规则。原因是：
1. 管理后台中保存同步过滤规则时，只保存在浏览器缓存（localStorage）中
2. 没有保存在数据库中，导致 CF Worker 运行定时任务时，无法取得过滤规则

## 修复方案

### 1. 数据库层 (database.js)

#### 新增函数

- **`getSyncFilterConfig()`**: 从数据库读取同步过滤规则配置
  - 从 `settings` 表中读取 `sync_filter_config` 字段
  - 如果不存在，返回默认空配置
  - 解析 JSON 格式的配置数据

- **`updateSyncFilterConfig(config)`**: 更新同步过滤规则配置到数据库
  - 将配置序列化为 JSON 格式
  - 存储到 `settings` 表的 `sync_filter_config` 字段
  - 如果配置已存在则更新，否则插入新记录

#### 配置格式

同步过滤规则以 JSON 格式存储在数据库中：

```json
{
  "excludeGroups": ["电影", "电视剧", "体育"],
  "excludeUrls": ["example.com", "test.com", "ads"],
  "excludeNames": ["测试", "预告", "广告"],
  "excludeDuplicateUrls": true,
  "groupRenameRules": [
    {"keyword": "央视", "newName": "中央电视台"},
    {"keyword": "CCTV", "newName": "央视频道"}
  ],
  "groupRenameExclude": ["央视", "CCTV", "体育"]
}
```

#### 默认配置

在 `createTables()` 函数中添加了默认配置：
```javascript
'sync_filter_config': '{}'
```

### 2. 管理后台 API (handlers/admin.js)

#### 新增 API 端点

1. **GET `/admin/sync/filter`**: 获取同步过滤规则配置
   - 返回当前存储的同步过滤规则
   - 响应格式：
     ```json
     {
       "success": true,
       "config": { ... }
     }
     ```

2. **POST `/admin/sync/filter`**: 保存同步过滤规则配置
   - 接收过滤规则数据并保存到数据库
   - 请求体格式：
     ```json
     {
       "excludeGroups": [...],
       "excludeUrls": [...],
       "excludeNames": [...],
       "excludeDuplicateUrls": true,
       "groupRenameRules": [...],
       "groupRenameExclude": [...]
     }
     ```
   - 响应格式：
     ```json
     {
       "success": true,
       "message": "同步过滤规则已更新",
       "config": { ... }
     }
     ```

### 3. 定时任务 (handlers/scheduler.js)

#### 修改内容

在 `handleScheduledEvent()` 函数中：

1. 导入 `getSyncFilterConfig` 函数：
   ```javascript
   import { getDB, fetchAndParseM3U, initDB, getSyncFilterConfig } from '../database.js';
   ```

2. 在同步之前从数据库加载过滤规则：
   ```javascript
   let filter = null;
   try {
     filter = await getSyncFilterConfig();
     console.log('[Scheduler] Loaded sync filter config:', filter);
   } catch (error) {
     console.error('[Scheduler] Failed to load sync filter config:', error);
     filter = null;
   }
   ```

3. 在调用 `fetchAndParseM3U()` 时传入过滤规则：
   ```javascript
   const syncResult = await fetchAndParseM3U(source.url, source.id, filter);
   ```

### 4. 前端管理界面 (admin-page.js)

#### 修改的函数

1. **`saveSyncFilters()`**: 保存同步过滤规则
   - 解析表单数据（支持换行符和逗号分隔）
   - 将分组重命名规则解析为结构化数据
   - 调用后端 API 保存到数据库
   - 同时保存到 localStorage（用于回显）
   - 显示成功提示

2. **`loadSyncFilters()`**: 加载同步过滤规则
   - 优先从数据库加载配置
   - 如果数据库加载失败，从 localStorage 加载
   - 将数组数据转换为多行文本格式显示
   - 在切换到"直播源管理"标签时自动加载

3. **`showTab()`**: 标签切换函数
   - 在切换到 `sources` 标签时调用 `loadSyncFilters()`
   - 自动加载最新的同步过滤规则

## 使用说明

### 手动同步

1. 在管理后台进入"直播源管理"标签
2. 点击"同步过滤"按钮展开配置面板
3. 配置过滤规则：
   - 排除分组名、播放地址、频道名
   - 设置是否过滤重复播放地址
   - 配置分组重命名规则
4. 点击"保存规则"按钮
5. 点击"同步全部"或单个源的"同步"按钮
6. 过滤规则将立即应用

### 定时任务

1. 配置过滤规则并保存（步骤同上）
2. 确保在 `wrangler.toml` 中配置了 cron 表达式
3. 部署 Worker 到 Cloudflare
4. 定时任务将自动使用保存的过滤规则进行同步

## 数据迁移

无需手动迁移，修改后的代码会在下次初始化时自动：
1. 检查 `settings` 表是否存在 `sync_filter_config` 配置
2. 如果不存在，插入默认空配置
3. 在首次使用时保存过滤规则

## 注意事项

1. **兼容性**：前端同时支持 localStorage 和数据库存储
   - localStorage 用于快速回显
   - 数据库用于定时任务和跨设备同步
   - 如果 API 调用失败，会回退到 localStorage

2. **数据格式**：
   - 数据库存储的是结构化数组
   - 前端显示时转换为多行文本
   - 保存时再转换回结构化数组

3. **性能影响**：
   - 定时任务增加了数据库读取操作，影响极小
   - 过滤规则仅在同步时加载一次

4. **安全性**：
   - 所有 API 请求都需要管理员密钥验证
   - 配置数据验证确保格式正确

## 测试建议

1. 测试保存过滤规则到数据库
2. 测试手动同步时过滤规则是否生效
3. 测试定时任务是否能正确读取和应用过滤规则
4. 测试不同格式的输入（换行符、逗号分隔）
5. 测试数据库 API 失败时的降级逻辑

## 修改的文件列表

1. `database.js` - 数据库层：添加同步过滤规则的读取和保存函数
2. `handlers/admin.js` - 管理后台 API：添加同步过滤规则的 API 端点
3. `handlers/scheduler.js` - 定时任务：从数据库读取过滤规则并应用
4. `admin-page.js` - 前端界面：修改保存和加载逻辑
