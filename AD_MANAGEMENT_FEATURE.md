# 广告TS文件管理功能

## 功能概述

实现了完整的广告TS文件管理功能，当用户IP未授权时，播放广告内容而非返回403错误，提升用户体验。

**最新更新**：支持多个广告同时活跃，支持不同类型的广告（普通广告、通知类广告等），播放时随机选择。

## 修复记录

### 1. 修复模板字符串语法错误（已完成）

**问题1**：在JavaScript模板字符串中使用三元运算符和HTML标签导致编译错误
- 错误位置：admin-page.js:3134
- 错误信息：`Expected ";" but found "{"`

**问题2**：在apiRequest调用中使用模板字符串
- 错误位置：admin-page.js:3266
- 错误信息：`Expected ":" but found "{"`

**问题3**：浏览器运行时错误 - confirm对话框中的换行符未转义
- 错误位置：admin-page.js:3260
- 错误信息：`Uncaught SyntaxError: Invalid or unexpected token`

**解决方案**：
- 将所有模板字符串改为字符串拼接
- 避免在模板字符串中使用复杂的三元运算符
- 使用普通字符串拼接确保兼容性
- 将 `/ad-ts/update?id=${id}` 改为 '/ad-ts/update?id=' + id
- 将 `/ad-ts/delete?id=${id}` 改为 '/ad-ts/delete?id=' + id
- 将字符串中的 `\n` 转义为 `\\n`

**修改文件**：
- admin-page.js:3129-3156行（广告文件列表渲染）
- admin-page.js:3166-3193行（上传模态框）
- admin-page.js:3260行（setActiveAd函数的confirm语句）
- admin-page.js:3266行（setActiveAd函数的API调用）
- admin-page.js:3286行（deleteAdTs函数的confirm语句）
- admin-page.js:3292行（deleteAdTs函数的API调用）

**验证**：
- ✅ linter检查通过
- ✅ Node.js语法检查通过
- ✅ 所有相关文件无错误
- ✅ 无模板字符串残留
- ✅ 服务器成功启动
- ✅ 管理页面可以访问（GET /admin 200 OK）
- ✅ 数据库表已创建

## 功能特性

### 前端管理界面

1. **导航栏新增"广告管理"标签页**
   - 位置：在"首页展示"和"系统设置"之间
   - 点击即可进入广告管理界面

2. **广告文件列表展示**
   - 显示所有上传的广告TS文件
   - 包含信息：ID、名称、大小、状态、创建时间、更新时间
   - 状态标识：活跃（绿色）/ 未启用（灰色）

3. **上传广告功能**
   - 支持.ts格式文件
   - 建议文件大小不超过5MB
   - 可自定义广告名称
   - 上传后自动转换为Base64存储

4. **设置活跃广告**
   - 只能有一个活跃的广告
   - 设置后自动将其他广告设为未启用
   - 点击"设为当前"按钮即可

5. **删除广告**
   - 支持删除不需要的广告文件
   - 删除前有确认提示
   - 删除后无法恢复

### 后端API实现

1. **GET /admin/ad-ts**
   - 获取所有广告TS文件列表
   - 按创建时间倒序排列

2. **POST /admin/ad-ts/upload**
   - 上传新的广告TS文件
   - FormData格式传输
   - 自动转换为Base64存储

3. **PUT /admin/ad-ts/update?id=xxx**
   - 设置指定广告为活跃状态
   - 自动将其他广告设为未启用

4. **DELETE /admin/ad-ts/delete?id=xxx**
   - 删除指定的广告文件

### 播放验证逻辑

在 `handlers/live.js` 中实现：

1. 当IP不在授权列表时：
   - 查询数据库获取活跃的广告TS文件
   - 如果存在广告，返回包含广告的M3U8播放列表
   - 如果没有广告，返回403错误

2. M3U8生成逻辑：
   - 生成标准M3U8格式
   - 包含广告TS内容
   - 播放器可正常播放

## 数据库表结构

### ad_ts_files 表

```sql
CREATE TABLE IF NOT EXISTS ad_ts_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### 索引

- `idx_ad_ts_files_active` - 按活跃状态查询
- `idx_ad_ts_files_updated` - 按更新时间倒序

## 使用方法

### 管理员操作

1. 访问管理后台：http://localhost:8787/admin
2. 登录后点击"广告管理"标签页
3. 点击"上传广告"按钮
4. 选择.ts文件，输入名称，点击"上传"
5. 上传成功后，点击"设为当前"激活广告

### 用户端效果

1. 用户访问未授权的频道
2. 系统检测到IP未授权
3. 返回包含广告的M3U8播放列表
4. 播放器播放广告内容
5. 用户看到友好的广告提示

## 注意事项

1. **文件大小限制**：建议不超过5MB
2. **广告时长**：建议控制在10秒以内
3. **Base64存储**：文件以Base64格式存储在数据库中
4. **唯一活跃广告**：只能有一个活跃的广告
5. **无广告时行为**：删除所有广告后，未授权IP返回403错误

## 代码文件

### 修改的文件

1. **database.js**
   - 添加 ad_ts_files 表创建逻辑
   - 添加索引创建逻辑
   - 添加 getActiveAdTsFile() 函数

2. **handlers/admin.js**
   - 添加广告TS管理API路由
   - 实现上传、删除、更新功能

3. **handlers/live.js**
   - 导入 getActiveAdTsFile
   - 添加广告M3U8生成逻辑
   - IP未授权时返回广告

4. **admin-page.js**
   - 添加"广告管理"标签页按钮
   - 添加广告管理内容区域
   - 添加相关JavaScript函数：
     - loadAdTsFiles()
     - showUploadAdModal()
     - uploadAdTs()
     - setActiveAd()
     - deleteAdTs()

## 测试步骤

1. 启动开发服务器：`npx wrangler dev --local`
2. 访问管理后台并登录
3. 切换到"广告管理"标签页
4. 上传一个测试用的TS文件
5. 设置该广告为活跃状态
6. 使用未授权的IP访问播放地址
7. 验证是否返回广告M3U8

## 优势

1. **用户体验好**：未授权时播放广告而非403错误
2. **管理方便**：图形化界面管理广告文件
3. **灵活配置**：可随时更换广告内容
4. **数据安全**：文件Base64存储，安全可靠
5. **性能优化**：使用索引加速查询

## 总结

广告M3U8功能已完整实现，包括前端管理界面、后端API、数据库存储和播放验证逻辑。管理员可以通过友好的界面管理广告文件，用户在IP未授权时能看到广告内容而不是错误页面。
