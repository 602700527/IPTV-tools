# Admin Static Site Generator - Tasks

## 1. 创建存储层抽象 (utils/static-storage.js)

- [x] 1.1 创建 `StaticStorage` 类
  - `detectEnvironment(env)` - 检测环境
  - `save(path, content)` - 保存文件
  - `exists(path)` - 检查是否存在
  - `delete(path)` - 删除文件
  - `list(prefix)` - 列出文件

- [x] 1.2 实现 KV 存储 (测试环境)
  - 使用 `env.KV` 存储，`static:${path}` 为 key

- [x] 1.3 实现 R2 存储 (生产环境)
  - 使用 `env.R2_BUCKET.put(path, content)`

## 2. 创建 Admin API (handlers/admin-static.js)

- [x] 2.1 `POST /api/admin/static/generate`
  - 接收 `type` 参数 (homepage | categories | channels | all)
  - 调用存储层保存生成的 HTML
  - 返回生成统计

- [x] 2.2 `GET /api/admin/static/status`
  - 返回环境信息
  - 返回文件数量统计
  - 返回最后生成时间

- [x] 2.3 `DELETE /api/admin/static/cache`
  - 清除 KV 缓存 (测试环境)
  - 清除 R2 文件 (生产环境)

## 3. 集成到 worker.js

- [x] 3.1 导入新的 API handler
- [x] 3.2 添加路由 `/api/admin/static/*`
- [x] 3.3 更新 `serveStaticFile()` 使用新的存储层

## 4. 更新管理后台 UI (admin-page.js)

- [x] 4.1 添加「静态页面生成」卡片
  - 环境标识徽章
  - 存储状态指示器
  - 生成选项 (首页/分类/频道/全部)
  - 生成按钮

- [x] 4.2 添加生成进度显示
- [x] 4.3 添加状态刷新按钮
- [x] 4.4 样式优化 (Development 蓝色 / Production 红色)

## 5. 测试

- [x] 5.1 本地环境测试 (`npm run dev`)
  - 生成静态文件到 KV
  - 验证页面访问正常

- [ ] 5.2 生产环境测试
  - 生成静态文件到 R2
  - 验证页面访问正常

## 依赖

- `handlers/seo-handler.js` - 已有的 HTML 生成函数
- `utils/channel-cache.js` - 已有的缓存工具

## 已完成的功能

1. **存储层** (`utils/static-storage.js`)
   - 环境检测 (development/production)
   - KV 存储 (测试环境)
   - R2 存储 (生产环境)
   - 文件管理 (保存/检查/删除/列表)

2. **Admin API** (`handlers/admin-static.js`)
   - `POST /api/admin/static/generate` - 生成静态页面
   - `GET /api/admin/static/status` - 获取状态
   - `DELETE /api/admin/static/cache` - 清除缓存

3. **分类页面增强** (`handlers/seo-handler.js`)
   - 分类导航显示所有分组
   - 当前分类高亮
   - 翻译选择器样式
   - 响应式 CSS

4. **管理后台 UI** (`admin-page.js`)
   - 静态生成标签页
   - 环境/存储状态显示
   - 生成选项 (首页/分类/频道/全部)
   - 白色打钩复选框样式

5. **清理**
   - 删除旧的 `home-page.js` 文件
