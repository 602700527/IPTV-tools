# Admin Static Site Generator - Design

## Decision 1: 环境检测策略

### 问题
需要在运行时判断当前是测试环境还是生产环境。

### 解决方案
```javascript
function detectEnvironment(env) {
  // 方式1: 检查 R2 Bucket 是否配置（生产环境必须有）
  if (env.R2_BUCKET) {
    return 'production';
  }
  
  // 方式2: 检查环境变量
  if (env.ENVIRONMENT === 'production') {
    return 'production';
  }
  
  // 默认测试环境
  return 'development';
}

function getStaticConfig(env) {
  const envType = detectEnvironment(env);
  return {
    envType,
    staticSource: envType === 'production' ? 'r2' : 'local',
    storage: envType === 'production' ? 'R2 Bucket' : 'KV Cache',
    canGenerate: true // 两种环境都能生成
  };
}
```

## Decision 2: 存储层抽象

### 接口设计
```javascript
class StaticStorage {
  async save(path, content) {
    // 根据环境自动选择存储后端
  }
  
  async exists(path) {
    // 检查文件是否存在
  }
  
  async delete(path) {
    // 删除文件
  }
  
  async list(prefix) {
    // 列出文件
  }
}
```

### 实现
- **测试环境**: 使用 KV 存储，`static:${path}` 为 key
- **生产环境**: 使用 R2 Bucket，直接 `put(path, content)`

## Decision 3: Admin API 设计

### 端点

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/admin/static/generate` | 触发静态页面生成 |
| GET | `/api/admin/static/status` | 获取生成状态和环境信息 |

### POST /api/admin/static/generate

**请求体**:
```json
{
  "type": "all" // homepage | categories | channels | all
}
```

**响应**:
```json
{
  "success": true,
  "message": "Static pages generated successfully",
  "stats": {
    "total": 10500,
    "success": 10500,
    "failed": 0,
    "duration": 45000
  },
  "environment": "production",
  "storage": "R2 Bucket"
}
```

### GET /api/admin/static/status

**响应**:
```json
{
  "environment": "production",
  "staticSource": "r2",
  "storage": "R2 Bucket",
  "lastGenerated": "2026-04-03T10:30:00Z",
  "fileCount": {
    "homepage": 1,
    "categories": 120,
    "channels": 10380
  }
}
```

## Decision 4: 管理后台 UI

### 静态页面管理面板

位置: 管理后台 → 工具 → 静态页面生成

**UI 元素**:
1. 环境标识徽章 (Development / Production)
2. 存储状态指示器
3. 生成选项卡片:
   - 首页
   - 分类页
   - 频道页
   - 全部
4. 生成按钮
5. 生成日志/结果显示区域
6. 最后生成时间

### 样式
- Development 环境: 蓝色边框，🔧 图标
- Production 环境: 红色边框，☁️ 图标

## Decision 5: 错误处理

| 场景 | 处理方式 |
|------|----------|
| R2 Bucket 不可用 | 返回 503，提示配置检查 |
| KV 不可用 (dev) | 回退到内存缓存（仅当前请求） |
| 生成超时 | 分批处理，每批 1000 条 |
| 数据库无数据 | 返回空结果，提示先添加数据源 |
