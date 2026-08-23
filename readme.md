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
│   ├── admin.js          # 管理后台API处理器
│   ├── scheduler.js      # 定时任务处理器
│   ├── public.js         # 公共API处理器
│   └── freesub-api.js    # 免费订阅API处理器
├── security/
│   ├── ip-blacklist.js   # IP黑名单安全系统
│   └── code-ban-cache.js # 卡密封禁缓存
├── utils/
│   ├── cache.js         # 缓存管理（内存+KV）
│   └── channel-cache.js # 频道KV缓存
├── wrangler.toml         # Cloudflare Workers 配置文件
├── package.json          # 项目依赖配置
└── README.md             # 项目说明文档
```

## 已实现功能

### 1. 定时任务调度

#### 1.1 任务类型

**数据源自动同步（每日 3:00 执行）**
- 同步所有启用的数据源
- 两阶段同步策略：
  1. **获取阶段**：先获取所有源的新数据（暂存内存）
  2. **写入阶段**：只有成功获取数据的源才删除旧数据并写入新数据
- 防止同步失败导致数据库清空
- 自动更新源的 `last_updated` 时间戳
- 所有源同步成功后才刷新 KV 缓存

**缓存刷新（每日 9:00 和 21:00 执行）**
- 清理过期记录：
  - `play_logs`：超过 10 分钟
  - `play_counts`：7 天前
  - `ip_access_logs`：7 天前
  - `subscription_ips`：30 天前
  - `ad_play_logs`：7 天前
- 刷新频道数据到 KV 缓存

#### 1.2 并发控制

- 使用锁机制防止同一任务并发执行
- 同步任务锁：`syncInProgress`
- 缓存刷新锁：`cacheRefreshInProgress`

#### 1.3 测试接口

**仅在本地开发环境可用**（localhost 或内网 IP）

```bash
# 测试：强制执行所有定时任务（无视时间限制）
GET /test/force-scheduled

# 测试：基于当前时间执行对应任务
GET /test/scheduled

# 测试：单独测试数据源同步
GET /test/sync

# 测试：单独测试缓存刷新
GET /test/cache

# 测试：完整的同步+缓存刷新流程
GET /test/sync-all
```

### 2. 管理后台功能

#### 2.1 直播源管理

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

#### 2.2 频道管理

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

#### 2.3 卡密管理

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

#### 2.4 仪表盘

- **统计概览**：
  - 直播源总数
  - 频道总数
  - 活跃卡密数
  - 未使用卡密数

### 3. 订阅功能

#### 3.1 订阅链接格式

```
https://your-domain.com/sub/{卡密}.m3u
```

#### 3.2 处理流程

1. **防盗检查**：使用KV存储检查每日请求次数（限制20次/天）
2. **缓存检查**：检查Cache API缓存（1小时有效期）
3. **卡密验证**：验证卡密状态和有效期
4. **M3U生成**：
   - 获取所有启用的频道
   - 生成标准M3U格式
   - 播放地址替换为本地代理地址：`/live/{卡密}/{频道hash}`
   - 保留原始请求头信息（User-Agent、Referer）
5. **缓存设置**：1小时缓存

### 4. 播放功能

#### 4.1 播放链接格式

```
https://your-domain.com/live/{卡密}/{频道hash}
```

#### 4.2 处理流程

1. **缓存检查**：检查Cache API缓存（5分钟有效期）
2. **卡密验证**：验证卡密状态和有效期
3. **IP并发检测**：
   - 使用KV存储记录活跃IP
   - 每个IP记录10分钟有效期
   - 超过最大IP数限制时拒绝请求
4. **获取频道信息**：根据频道hash获取真实播放地址和请求头
5. **302重定向**：重定向到真实播放地址
6. **缓存设置**：5分钟缓存

### 5. 广告系统

#### 5.1 广告 TS 文件

- 支持 TS 格式广告文件上传
- 文件以 Base64 格式存储在数据库
- 可设置广告类型（普通/特殊）
- 可启用/禁用广告

#### 5.2 广告绑定

支持多场景广告投放：

| 场景类型 | 说明 |
|---------|------|
| `code_normal` | 卡密正常播放时插入广告 |
| `code_expired` | 卡密过期时播放广告 |
| `code_unauth` | 卡密 IP 未授权时播放广告 |
| `code_channel_not_found` | 频道不存在时播放广告 |
| `freesub_normal` | 免费订阅正常播放时插入广告 |
| `freesub_expired` | 免费订阅过期时播放广告 |
| `freesub_unauth` | 免费订阅 IP 未授权时播放广告 |
| `freesub_channel_not_found` | 免费订阅频道不存在时播放广告 |

#### 5.3 广告冷却时间

- 可配置广告播放冷却时间（秒）
- 同一 IP 在冷却时间内不会重复看到同一广告
- 减少用户体验负面影响

### 6. 免费订阅系统

#### 6.1 功能特点

- 无需卡密的订阅模式
- 生成免费订阅 ID
- 每日访问限制（防滥用）
- IP 授权机制

#### 6.2 订阅流程

```
访问 /freesub 页面 → 生成订阅 ID → 获取订阅链接 → 播放
```

#### 6.3 播放验证

- 检查订阅 ID 状态
- 检查订阅 IP 是否授权
- 超过每日播放额度限制

## 数据库设计

Schema 维护在 `migrations/001-012.sql`（按编号顺序追加，命名格式 `NNN_描述.sql`），由 `schema.sql` 合并为最新全量。首次部署或重置：

```bash
npm run init-db   # = wrangler d1 execute tv-service-db --file=./schema.sql
```

Schema 概览（不在此详列，详见 `migrations/` 与 `schema.sql`）：

| 表 | 用途 |
|---|---|
| `sources` / `channels` | 直播源 + 频道元数据 |
| `users` / `user_sessions` / `user_orders` | 注册用户与认证、订单 |
| `favorites` | 用户收藏 |
| `codes` / `free_subscriptions` / `subscription_plans` / `discount_codes` | 订阅与付费码 |
| `support_tickets` / `mall_settings` / `domain_blacklist` | 客服/商城/反爬 |

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

### 1. IP 黑名单

#### 1.1 访问频率限制

监控 IP 访问频率，超出限制自动封禁。

**分级阈值配置**

| 路径 | 每分钟限制 | 每小时限制 | 每日限制 |
|------|-----------|-----------|---------|
| `/sub` | 可配置 | 可配置 | 可配置 |
| `/live` | 可配置 | 可配置 | 可配置 |
| `/admin` | 10 | 可配置 | 50 |

#### 1.2 封禁机制

- **永久封禁**：每日访问次数超限时，IP 被永久封禁
- **封禁存储**：IP 黑名单存储在 KV 中
- **自动解封**：管理员可手动解封 IP

#### 1.3 缓存策略

- 使用内存缓存记录 IP 访问计数
- 每 10 分钟同步一次到数据库
- 定期备份到 KV 防止 Worker 重启丢失

### 2. 卡密封禁机制

#### 2.1 每日频道播放额度

- 每个卡密每个频道每日有播放次数限制（默认 100 次）
- 超过额度自动封禁卡密
- 封禁时长可配置（默认 7 天）

#### 2.2 封禁流程

```
检测到超限 → 自动禁用卡密 → 添加封禁备注 → 记录 banned_until → 同步到 KV 缓存
```

#### 2.3 封禁状态

- `banned_until` 字段记录封禁到期时间
- 播放请求检查该字段，未到期拒绝访问
- 管理员可手动解封

### 3. 防盗链

- **动态URL**：播放链接包含卡密和频道hash，有效期5分钟
- **请求频率限制**：每个卡密每日最多20次订阅请求
- **缓存策略**：无效请求缓存1小时，减少数据库压力

### 4. IP并发限制

- **默认限制**：每个卡密最多3个IP同时使用
- **记录机制**：使用KV存储记录活跃IP和访问时间
- **自动清理**：10分钟内无访问的IP自动失效
- **实时更新**：异步更新KV，不阻塞响应

### 5. 卡密管理

- **状态控制**：未使用、活跃、禁用三种状态
- **有效期管理**：支持设置卡密有效期，过期自动失效
- **唯一性保证**：自动检测并生成唯一卡密
- **批量操作**：支持批量生成、批量导出

### 6. 数据库安全

- **索引优化**：关键字段建立索引，提高查询效率
- **批量操作**：使用batch操作减少API调用
- **连接管理**：单例模式管理数据库连接

### 7. 缓存策略

#### 7.1 内存缓存 + KV 备份

**内存缓存**

| 缓存类型 | 数据结构 | 说明 |
|---------|---------|------|
| 播放计数 | `Map` | `{code:hash:date: count}` |
| IP 访问计数 | `Map` | `{ip:path:date: count}` |
| 订阅 IP 列表 | `Map<Set>` | `{code:date: Set<IP>}` |
| 订阅 IP 时间戳 | `Map` | `{code:ip: timestamp}` |

**KV 备份**

- 缓存数据定期备份到 KV（10 分钟间隔）
- Worker 重启时自动从 KV 恢复缓存
- 防止数据丢失

#### 7.2 Cache API

| 请求类型 | 缓存时间 | 说明 |
|---------|---------|------|
| 订阅请求 | 1 小时 | 频道列表变化不频繁 |
| 播放请求 | 5 分钟 | 频道可能切换 |
| 错误响应 | 5-60 分钟 | 减少无效请求 |
| 频道缓存 | 24 小时 | KV 缓存所有频道数据 |
| 分组缓存 | 24 小时 | KV 缓存分组列表 |

#### 7.3 KV 存储

| 数据类型 | TTL | 说明 |
|---------|-----|------|
| 频道缓存 | 24 小时 | `channels_cache` |
| 分组缓存 | 24 小时 | `groups_cache` |
| IP 黑名单 | 永久 | `ip_blacklist` |
| 卡密封禁缓存 | 24 小时 | `banned_codes` |
| 内存缓存备份 | 11 分钟 | `memory_cache_backup` |
| 防盗计数器 | 24 小时 | 订阅请求计数 |

### 8. 缓存命中率优化

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

#### 免费订阅接口

```
# 获取免费订阅
POST /api/freesub/subscribe
Body: {
  "device_id": "设备唯一标识"
}

# 获取免费订阅链接
GET /api/freesub/sub/{id}.m3u

# 播放免费订阅频道
GET /api/freesub/play/{id}/{hash}
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

管理员密钥属于**敏感变量**，必须通过 Cloudflare secrets 设置（不要写入 `wrangler.toml` 以免被提交到 git）：

```bash
# 生产环境
wrangler secret put ADMIN_KEY

# 本地开发（写入 .dev.vars，文件已在 .gitignore 中）
echo 'ADMIN_KEY=your-local-dev-key' >> .dev.vars
```

完整敏感变量清单见项目根目录的 `.dev.vars.example`。

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

### 6. 如何测试定时任务？

在本地开发环境中访问：
- `/test/force-scheduled` - 强制执行所有定时任务
- `/test/sync` - 单独测试数据源同步
- `/test/cache` - 单独测试缓存刷新

## 许可证

MIT
