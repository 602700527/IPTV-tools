# 广告管理功能 - 快速启动指南

## 启动步骤

### 1. 启动开发服务器

```bash
cd c:\Users\60270\Desktop\cfworker2
npx wrangler dev --local
```

服务器启动后会显示：
- 监听地址：http://127.0.0.1:8787
- 绑定信息：KV, DB, ADMIN_KEY, TIMEZONE

### 2. 初始化数据库

访问 http://127.0.0.1:8787/admin/init
- 系统会自动创建所有必要的数据库表
- 包括新增的 ad_ts_files 表

### 3. 登录管理后台

访问 http://127.0.0.1:8787/admin
- 默认密钥：`admin-key-please-change-in-production`
- 输入密钥后点击"登录"

### 4. 使用广告管理功能

1. 点击"广告管理"标签页
2. 点击"上传广告"按钮
3. 选择一个.ts文件（建议使用10秒内的广告视频）
4. 输入广告名称
5. 点击"上传"
6. 上传成功后，点击"设为当前"激活广告

## 功能测试

### 测试广告播放

1. 使用未授权的IP访问播放地址：
   ```
   http://127.0.0.1:8787/live/{code}/{hash}
   ```
2. 验证是否返回包含广告的M3U8内容
3. 使用播放器测试是否能正常播放广告

### 测试广告管理

1. 上传多个广告文件
2. 切换不同的活跃广告
3. 删除不需要的广告
4. 刷新列表验证数据正确显示

## 常见问题

### Q: 为什么上传广告后没看到效果？
A: 需要点击"设为当前"按钮将广告设为活跃状态。

### Q: 如何更换广告？
A: 上传新广告后点击"设为当前"即可，系统会自动将旧广告设为未启用。

### Q: 删除广告后会发生什么？
A: 删除所有广告后，未授权IP将返回403错误。

### Q: 支持哪些文件格式？
A: 目前只支持.ts格式，建议文件大小不超过5MB。

## API文档

### 获取广告列表
```http
GET /admin/ad-ts
Headers: X-Admin-Key: your-key
```

### 上传广告
```http
POST /admin/ad-ts/upload
Headers:
  X-Admin-Key: your-key
  Content-Type: multipart/form-data
Body:
  file: [binary]
  name: 广告名称
```

### 设置活跃广告
```http
PUT /admin/ad-ts/update?id=123
Headers: X-Admin-Key: your-key
```

### 删除广告
```http
DELETE /admin/ad-ts/delete?id=123
Headers: X-Admin-Key: your-key
```

## 注意事项

1. ⚠️ 生产环境请修改 ADMIN_KEY
2. ⚠️ 建议广告时长控制在10秒以内
3. ⚠️ 文件大小建议不超过5MB
4. ⚠️ 只能有一个活跃的广告
5. ✅ 上传后记得点击"设为当前"激活

## 技术栈

- **前端**：原生JavaScript + HTML
- **后端**：Cloudflare Workers
- **数据库**：Cloudflare D1 (SQLite)
- **存储**：Base64编码存储在数据库中
- **播放格式**：M3U8 + TS

## 文件清单

### 修改的文件
1. `database.js` - 数据库表和查询函数
2. `handlers/admin.js` - 后端API接口
3. `handlers/live.js` - 播放验证逻辑
4. `admin-page.js` - 前端管理界面

### 新增的文件
1. `AD_MANAGEMENT_FEATURE.md` - 功能文档
2. `QUICK_START.md` - 快速启动指南

## 下一步

功能已完成，可以开始使用：
1. 启动服务器
2. 登录管理后台
3. 上传广告文件
4. 测试播放效果

祝使用愉快！🎉
