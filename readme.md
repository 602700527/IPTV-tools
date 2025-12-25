# Cloudflare TV 直播服务

基于 Cloudflare 生态 (Workers + D1 + KV + Cache API) 的电视直播服务，实现高并发、低延迟和秒级管理。

## 功能特点

- **高性能**：利用 Cache API 实现边缘节点缓存，95% 的播放请求无需访问数据库
- **防盗链**：动态 URL + IP 并发限制 + 每日请求限制
- **灵活管理**：支持多源管理、卡密生成、状态监控、高级查询、CSV导出
- **兼容性**：兼容现有订阅链接格式，支持多种播放器

## 项目结构

```
cfworker2/
├── worker.js             # Worker 主入口文件（路由分发）
├── database.js           # 数据库初始化、表结构管理、M3U解析
├── admin-page.js         # 管理后台页面（包含完整HTML和JavaScript）
├── admin.html            # 管理后台静态页面
├── handlers/
│   ├── live.js           # 播放请求处理器（/live/{code}/{hash}）
│   ├── sub.js            # 订阅请求处理器（/sub/{code}.m3u）
│   └── admin.js          # 管理后台API处理器
├── wrangler.toml         # Cloudflare Workers 配置文件
├── package.json          # 项目依赖配置
└── README.md             # 项目说明文档
```

## 已实现功能

### 1. 管理后台功能

#### 1.1 直播源管理
- **添加源**：支持添加新的M3U/M3U8直播源
- **编辑源**：修改源的名称、URL、类型和解析模式
- **删除源**：删除源及其关联的所有频道数据
- **同步源**：从远程URL获取最新的M3U内容并解析
  - 自动删除旧频道数据
  - 批量插入新频道（每批500条）
  - 更新源的最后更新时间
- **查看频道统计**：显示每个源关联的频道数量
- **解析模式**：
  - 严格模式：标准M3U格式解析
  - 宽松模式：兼容性更强的解析方式

#### 1.2 频道管理
- **列表展示**：分页显示所有频道
- **多维度筛选**：
  - 按直播源筛选
  - 按频道名称或分组名称搜索
- **信息展示**：
  - 频道名称、logo、分组
  - 所属直播源
  - 播放地址（支持复制）
  - 请求头信息（User-Agent、Referer）
  - 启用/禁用状态
- **批量操作**：
  - 清空所有频道数据
  - 启用/禁用单个频道

#### 1.3 卡密管理
- **生成卡密**：
  - 批量生成（1-100个）
  - 设置有效期（天数）
  - 设置最大IP数限制（默认3个）
  - 添加备注信息
  - 自动生成唯一8位随机码
- **编辑卡密**：
  - 修改状态（未使用/活跃/禁用）
  - 更新备注信息
- **高级查询**：
  - 按状态筛选（未使用/活跃/禁用）
  - 按有效期天数范围筛选
  - 按过期时间范围筛选
  - 按激活时间范围筛选
  - 按备注关键词模糊搜索
- **导出CSV**：
  - 支持按当前查询条件导出
  - 导出字段：卡密、状态、有效期(天)、最大IP数、激活时间、过期时间、备注
  - 自动处理CSV特殊字符转义
  - 文件名包含日期，便于区分
- **分页展示**：支持10/20/30/50/100条/页

#### 1.4 仪表盘
- **统计概览**：
  - 直播源总数
  - 频道总数
  - 活跃卡密数
  - 未使用卡密数

### 2. 订阅功能

#### 2.1 订阅链接格式
```
https://your-domain.com/sub/{卡密}.m3u
```

#### 2.2 处理流程
1. **防盗检查**：使用KV存储检查每日请求次数（限制20次/天）
2. **缓存检查**：检查Cache API缓存（1小时有效期）
3. **卡密验证**：验证卡密状态和有效期
4. **M3U生成**：
   - 获取所有启用的频道
   - 生成标准M3U格式
   - 播放地址替换为本地代理地址：`/live/{卡密}/{频道hash}`
   - 保留原始请求头信息（User-Agent、Referer）
5. **缓存设置**：1小时缓存

### 3. 播放功能

#### 3.1 播放链接格式
```
https://your-domain.com/live/{卡密}/{频道hash}
```

#### 3.2 处理流程
1. **缓存检查**：检查Cache API缓存（5分钟有效期）
2. **卡密验证**：验证卡密状态和有效期
3. **IP并发检测**：
   - 使用KV存储记录活跃IP
   - 每个IP记录10分钟有效期
   - 超过最大IP数限制时拒绝请求
4. **获取频道信息**：根据频道hash获取真实播放地址和请求头
5. **302重定向**：重定向到真实播放地址
6. **缓存设置**：5分钟缓存

## 数据库设计

### 表结构

#### sources（直播源表）
```sql
CREATE TABLE sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,              -- 源名称
  url TEXT,               -- M3U文件URL
  type TEXT DEFAULT 'm3u',-- 类型（m3u/m3u8）
  parse_mode TEXT DEFAULT 'strict',-- 解析模式（strict/loose）
  last_updated DATETIME   -- 最后更新时间
)
```

#### channels（频道表）
```sql
CREATE TABLE channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER,      -- 关联的源ID
  channel_name TEXT,      -- 频道名称
  group_title TEXT,       -- 分组名称
  logo TEXT,              -- 频道logo地址
  play_url TEXT,          -- 播放地址
  headers TEXT,           -- 请求头（JSON格式）
  channel_hash TEXT,      -- 频道hash（SHA-256前8位）
  is_active BOOLEAN DEFAULT 1,-- 是否启用
  FOREIGN KEY(source_id) REFERENCES sources(id)
)
```

#### codes（卡密表）
```sql
CREATE TABLE codes (
  code TEXT PRIMARY KEY,  -- 卡密（唯一）
  status TEXT DEFAULT 'unused',-- 状态（unused/active/disabled）
  duration_days INTEGER,  -- 有效期（天数）
  activated_at DATETIME,  -- 激活时间
  expired_at DATETIME,    -- 过期时间
  max_ips INTEGER DEFAULT 3,-- 最大IP数限制
  remark TEXT            -- 备注信息
)
```

### 索引
```sql
-- 频道hash索引（加速播放请求）
CREATE INDEX idx_channel_hash ON channels(channel_hash);

-- 卡密状态索引（加速查询）
CREATE INDEX idx_code_status ON codes(status);
```

## 系统流程图

### 订阅流程图

```
用户请求 /sub/{code}.m3u
        ↓
┌───────────────────────┐
│  检查KV防盗计数器     │
│  每日请求 > 20次?     │
└───────────────────────┘
        ↓ 是
返回 403 Forbidden
        ↓ 否
┌───────────────────────┐
│  检查Cache API缓存    │
│  缓存有效期: 1小时    │
└───────────────────────┘
        ↓ 命中
直接返回缓存响应
        ↓ 未命中
┌───────────────────────┐
│  验证卡密             │
│  检查状态和有效期     │
└───────────────────────┘
        ↓ 无效
返回 403（缓存1小时）
        ↓ 有效
┌───────────────────────┐
│  获取所有启用频道     │
│  从D1数据库查询       │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  生成M3U内容          │
│  - 标准M3U格式        │
│  - 替换播放地址        │
│  - 保留请求头信息      │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  返回M3U响应          │
│  缓存1小时            │
└───────────────────────┘
```

### 播放流程图

```
用户播放频道 /live/{code}/{hash}
        ↓
┌───────────────────────┐
│  检查Cache API缓存    │
│  缓存有效期: 5分钟    │
└───────────────────────┘
        ↓ 命中
直接返回302重定向
        ↓ 未命中
┌───────────────────────┐
│  验证卡密             │
│  检查状态和有效期     │
└───────────────────────┘
        ↓ 无效
返回 403（缓存5分钟）
        ↓ 有效
┌───────────────────────┐
│  IP并发检测           │
│  从KV获取IP列表        │
│  清理10分钟前记录     │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  当前IP在列表中?      │
└───────────────────────┘
        ↓ 是
更新IP时间戳
        ↓ 否
┌───────────────────────┐
│  IP数 >= 最大限制?    │
└───────────────────────┘
        ↓ 是
返回 403（缓存5分钟）
        ↓ 否
添加当前IP到列表
        ↓
┌───────────────────────┐
│  获取频道真实链接      │
│  根据hash查询D1        │
└───────────────────────┘
        ↓ 未找到
返回 404（缓存5分钟）
        ↓ 找到
┌───────────────────────┐
│  302重定向            │
│  Location: 真实URL     │
│  缓存5分钟             │
└───────────────────────┘
```

### M3U解析流程图

```
从远程URL获取M3U内容
        ↓
┌───────────────────────┐
│  提取全局头部信息     │
│  #EXTM3U行            │
│  User-Agent等          │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  按#EXTINF分割        │
│  逐个解析频道块        │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  解析EXTINF行         │
│  - 频道名称           │
│  - 分组名称           │
│  - Logo地址           │
│  - User-Agent         │
│  - Referer            │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  解析EXTVLCOPT行      │
│  提取额外的请求头      │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  提取播放URL行        │
│  解析URL参数          │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  生成频道hash         │
│  SHA-256(URL)前8位    │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  批量插入数据库       │
│  每批500条            │
│  使用batch操作        │
└───────────────────────┘
```

## 安全机制

### 1. 防盗链
- **动态URL**：播放链接包含卡密和频道hash，有效期5分钟
- **请求频率限制**：每个卡密每日最多20次订阅请求
- **缓存策略**：无效请求缓存1小时，减少数据库压力

### 2. IP并发限制
- **默认限制**：每个卡密最多3个IP同时使用
- **记录机制**：使用KV存储记录活跃IP和访问时间
- **自动清理**：10分钟内无访问的IP自动失效
- **实时更新**：异步更新KV，不阻塞响应

### 3. 卡密管理
- **状态控制**：未使用、活跃、禁用三种状态
- **有效期管理**：支持设置卡密有效期，过期自动失效
- **唯一性保证**：自动检测并生成唯一卡密
- **批量操作**：支持批量生成、批量导出

### 4. 数据库安全
- **索引优化**：关键字段建立索引，提高查询效率
- **批量操作**：使用batch操作减少API调用
- **连接管理**：单例模式管理数据库连接

## 缓存策略

### Cache API
- **订阅请求**：缓存1小时
- **播放请求**：缓存5分钟
- **错误响应**：根据类型缓存5分钟或1小时

### KV存储
- **防盗计数器**：TTL 24小时
- **IP并发记录**：TTL 10分钟

### 缓存命中率优化
- 播放请求缓存命中率 > 95%
- 订阅请求缓存命中率 > 80%
- 无效请求缓存减少数据库压力

## API 文档

### 管理后台 API

所有管理 API 请求需要在请求头中包含 `X-Admin-Key`，值为 `wrangler.toml` 中配置的 `ADMIN_KEY`。

#### 初始化数据库
```
GET /admin/init
```

#### 直播源管理
```
# 获取所有源
GET /admin/sources

# 添加新源
POST /admin/sources
Body: {
  "name": "源名称",
  "url": "https://example.com/playlist.m3u",
  "type": "m3u",
  "parse_mode": "strict"
}

# 更新源
PUT /admin/sources
Body: {
  "id": 1,
  "name": "新名称",
  "url": "https://example.com/new.m3u",
  "type": "m3u",
  "parse_mode": "loose"
}

# 删除源（同时删除关联频道）
DELETE /admin/sources/{id}

# 同步源数据
POST /admin/sync/{id}
```

#### 频道管理
```
# 获取频道列表（分页）
GET /admin/channels?page=1&page_size=30&source_id=1&search=关键词

# 清空所有频道
DELETE /admin/channels
```

#### 卡密管理
```
# 获取卡密列表（分页、高级查询）
GET /admin/codes?page=1&page_size=30&status=active
  &expired_from=2025-01-01&expired_to=2025-12-31
  &activated_from=2025-01-01&activated_to=2025-12-31
  &duration_min=30&duration_max=365
  &remark=VIP

# 导出CSV
GET /admin/codes?action=export&status=active&...

# 生成新卡密
POST /admin/codes
Body: {
  "count": 10,
  "duration_days": 30,
  "max_ips": 3,
  "remark": "测试用户"
}

# 更新卡密状态
PUT /admin/codes
Body: {
  "code": "abc123",
  "status": "disabled",
  "remark": "违规使用"
}

# 激活卡密
POST /admin/codes?action=activate
Body: {
  "code": "abc123"
}
```

### 公共API

#### 订阅接口
```
GET /sub/{code}.m3u
```

#### 播放接口
```
GET /live/{code}/{hash}
```

## M3U 解析细节

### 支持的格式

#### 标准M3U格式
```
#EXTM3U
#EXTINF:-1 group-title="央视" tvg-logo="http://example.com/logo.png",CCTV-1
http://example.com/stream.m3u8
```

#### 包含请求头的格式
```
#EXTM3U
#EXTINF:-1 http-user-agent="Mozilla/5.0" referer="http://example.com",Channel Name
http://example.com/stream.m3u8
```

#### VLC选项格式
```
#EXTM3U
#EXTINF:-1,Channel Name
#EXTVLCOPT:http-user-agent=Mozilla/5.0
#EXTVLCOPT:http-referrer=http://example.com
http://example.com/stream.m3u8
```

#### 全局User-Agent
```
#EXTM3U user-agent="Mozilla/5.0"
#EXTINF:-1,Channel Name
http://example.com/stream.m3u8
```

### 解析规则

1. **优先级**：频道级别 > 全局级别
2. **支持的字段**：
   - `group-title`：分组名称
   - `tvg-logo`：logo地址
   - `http-user-agent` / `ua` / `user_agent`：User-Agent
   - `referer`：Referer
3. **URL参数**：从URL参数中提取User-Agent
4. **Hash生成**：SHA-256(播放URL)前8位

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

#### 创建 KV 命名空间
```bash
wrangler kv:namespace create "KV"
```

将返回的 ID 添加到 `wrangler.toml`：
```toml
[[kv_namespaces]]
binding = "KV"
id = "your-kv-id"
preview_id = "your-preview-kv-id"
```

#### 创建 D1 数据库
```bash
wrangler d1 create "tv-service-db"
```

将返回的 ID 添加到 `wrangler.toml`：
```toml
[[d1_databases]]
binding = "DB"
database_name = "tv-service-db"
database_id = "your-database-id"
```

#### 配置管理员密钥
在 `wrangler.toml` 中添加：
```toml
[vars]
ADMIN_KEY = "your-secure-admin-key"
```

### 4. 初始化数据库

通过管理后台初始化：
1. 访问 `https://your-worker.workers.dev/admin`
2. 输入管理员密钥登录
3. 数据库表会自动创建

或使用 API：
```bash
curl -X GET https://your-worker.workers.dev/admin/init \
  -H "X-Admin-Key: your-admin-key"
```

### 5. 本地开发

```bash
npm run dev
```

访问 `http://localhost:8787/admin` 进行管理。

### 6. 部署到 Cloudflare

```bash
npm run deploy
```

## 性能优化

### 1. 数据库优化
- 批量插入：每批500条记录
- 索引优化：关键字段建立索引
- 连接池：单例模式管理连接

### 2. 缓存优化
- 边缘缓存：95%播放请求命中缓存
- 异步更新：KV更新不阻塞响应
- 分级缓存：不同场景使用不同TTL

### 3. 并发处理
- 异步操作：ctx.waitUntil()不阻塞响应
- 批量操作：减少API调用次数
- 连接复用：单例数据库连接

## 监控与统计

### 系统统计
- 直播源数量
- 频道总数
- 活跃卡密数
- 未使用卡密数

### 频道统计
- 每个源的频道数量
- 启用/禁用状态分布

### 卡密统计
- 状态分布（未使用/活跃/禁用）
- 有效期分布
- IP使用情况

## 常见问题

### 1. 如何添加新的直播源？
登录管理后台 -> 直播源管理 -> 添加源 -> 填写源信息 -> 同步数据

### 2. 如何生成卡密？
登录管理后台 -> 卡密管理 -> 生成卡密 -> 设置参数 -> 生成

### 3. 订阅链接无法使用？
- 检查卡密是否已激活且未过期
- 检查每日请求次数是否超限
- 检查是否有可用频道

### 4. 播放卡顿或无法播放？
- 检查卡密是否被禁用或过期
- 检查IP是否超过限制
- 检查原始直播源是否可用

### 5. 如何导出卡密数据？
登录管理后台 -> 卡密管理 -> 设置查询条件 -> 导出CSV

## 许可证

MIT
