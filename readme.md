# Cloudflare TV 直播服务

基于 Cloudflare 生态 (Workers + D1 + KV + Cache API) 的电视直播服务，实现高并发、低延迟和秒级管理。

## 功能特点

- **高性能**：利用 Cache API 实现边缘节点缓存，95% 的播放请求无需访问数据库
- **防盗链**：动态 URL + IP 并发限制 + 每日请求限制
- **灵活管理**：支持多源管理、卡密生成、状态监控
- **兼容性**：兼容现有订阅链接格式

## 项目结构

```
cfworker2/
├── worker.js             # Worker 主入口文件
├── database.js           # 数据库初始化和表结构管理
├── handlers/
│   ├── live.js           # 播放请求处理器
│   ├── sub.js            # 订阅请求处理器
│   └── admin.js          # 管理后台API处理器
├── wrangler.toml         # Cloudflare Workers 配置文件
├── package.json          # 项目依赖配置
└── README.md             # 项目说明文档
```

## 核心流程

### 1. 播放请求流程 (/live/{卡密}/{频道哈希})

1. 检查 Cache API 缓存
   - 命中：直接返回 302 重定向
   - 未命中：进入鉴权流程

2. 鉴权流程
   - 验证卡密状态和有效期
   - 检查 IP 并发限制
   - 获取频道真实播放地址
   - 生成 302 重定向响应
   - 设置 5 分钟缓存

### 2. 订阅请求流程 (/sub/{卡密}.m3u)

1. 防盗检查 (KV 计数)
   - 检查当日请求次数是否超过限制

2. 检查 Cache API 缓存
   - 命中：直接返回 M3U 内容
   - 未命中：进入生成流程

3. M3U 生成流程
   - 验证卡密状态和有效期
   - 获取所有有效频道
   - 生成 M3U 内容，播放地址替换为本地代理地址
   - 设置 1 小时缓存

## 快速开始

### 1. 环境准备

- 安装 Node.js (v16+)
- 安装 Wrangler CLI: `npm install -g wrangler`

### 2. 项目设置

```bash
# 克隆项目
git clone <repository-url>
cd cfworker2

# 安装依赖
npm install

# 登录 Cloudflare
wrangler login
```

### 3. 配置 Cloudflare 资源

1. 创建 KV 命名空间
   ```bash
   wrangler kv:namespace create "KV"
   ```

2. 创建 D1 数据库
   ```bash
   wrangler d1 create "tv-service-db"
   ```

3. 更新 `wrangler.toml` 中的 KV 和 D1 ID

### 4. 初始化数据库

```bash
# 初始化数据库表
npm run init-db
```

### 5. 本地开发

```bash
npm run dev
```

### 6. 部署到 Cloudflare

```bash
npm run deploy
```

## API 文档

### 管理后台 API

所有管理 API 请求需要在请求头中包含 `X-Admin-Key`，值为 `wrangler.toml` 中配置的 `ADMIN_KEY`。

#### 初始化数据库

```
POST /admin/init
```

#### 源管理

- 获取所有源: `GET /admin/sources`
- 添加新源: `POST /admin/sources`
- 更新源: `PUT /admin/sources`
- 删除源: `DELETE /admin/sources/{id}`
- 同步源数据: `GET /admin/sync/{id}`

#### 卡密管理

- 获取卡密列表: `GET /admin/codes`
- 生成新卡密: `POST /admin/codes`
- 更新卡密状态: `PUT /admin/codes`

#### 频道管理

- 获取频道列表: `GET /admin/channels?source_id={id}`

## 安全机制

- **防盗链**：动态 URL + 5分钟有效期
- **IP 并发限制**：默认每个卡密最多3个IP同时使用
- **请求频率限制**：每个卡密每日最多20次订阅请求
- **WAF 规则**：过滤恶意爬虫和高频请求

## 许可证

MIT
