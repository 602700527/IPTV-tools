# M3U KV 缓存规范

## 概述

本规范定义了 M3U 订阅文件的 KV 缓存策略、接口行为和数据格式。

## KV Key 规范

### M3U 文件

| Key | 前缀匹配 | TTL | 内容格式 |
|-----|----------|-----|----------|
| `m3u_vip` | VIP code（无前缀） | `m3u_ttl_hours` | M3U 文件文本 |
| `m3u_free` | `free_*` | `m3u_ttl_hours` | M3U 文件文本 |
| `m3u_fav` | `fav_*` | `m3u_ttl_hours` | M3U 文件文本 |

### 播放地址格式

| 类型 | 播放地址格式 | 示例 |
|------|-------------|------|
| VIP | `/live/{code}/{channel_hash}` | `/live/abc123/cctv1_hash` |
| 免费订阅 | `/live/free_{subId}/{channel_hash}` | `/live/free_abc123/cctv1_hash` |
| 收藏 | `/live/fav_{randomId}/{channel_hash}` | `/live/fav_xyz789/cctv1_hash` |

## M3U 文件格式

### VIP M3U

```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="..." group-title="央视",CCTV-1
/live/abc123/cctv1_hash
#EXTINF:-1 tvg-logo="..." group-title="体育",ESPN
/live/abc123/espn_hash
...
```

### 免费订阅 M3U

```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="..." group-title="央视",CCTV-1
/live/free_abc123/cctv1_hash
...
```

### 收藏下载 M3U

```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="..." group-title="央视",CCTV-1
/live/fav_xyz789/cctv1_hash
...
```

## 接口规范

### GET /sub/{code}.m3u

**行为**：
1. 验证订阅码有效性（status='active', expired_at > now）
2. 验证 IP 是否在当天允许列表中（D1 原子操作）
3. 从 KV 获取 `m3u_vip` 内容

**响应**：
- 成功：200 OK，Content-Type: `application/vnd.apple.mpegurl`
- 订阅码无效：403 Forbidden
- IP 超限：403 Forbidden
- M3U 不可用：503 Service Unavailable（触发回退生成）

### GET /freesub/{subId}.m3u

**行为**：
1. 验证指纹有效性
2. 验证请求 IP 是否为当天第 1 个访问的 IP（D1 原子操作）
3. 从 KV 获取 `m3u_free` 内容

**响应**：
- 成功：200 OK，Content-Type: `application/vnd.apple.mpegurl`
- 指纹无效：403 Forbidden
- 非第 1 IP：403 Forbidden
- M3U 不可用：503 Service Unavailable

### GET /api/favorites/m3u

**行为**：
1. 无需验证
2. 直接从 KV 获取 `m3u_fav` 内容

**响应**：
- 成功：200 OK，Content-Type: `application/vnd.apple.mpegurl`
- M3U 不可用：503 Service Unavailable

### GET /live/{code}/{hash}

**行为**：
1. 确定 M3U 类型（通过 code 前缀）
2. 检查 KV key `m3u_{type}` 是否存在
3. 检查播放次数限制（每个 IP 每频道每日）
4. 未超限：
   - 触发正常播放广告（可选）
   - 302 重定向到真实播放地址
5. 超限：触发超限广告
6. M3U 不存在：触发过期广告

**响应**：
- 成功：302 Found，Location: {play_url}
- 正常播放广告：302 Found，Location: {ad_ts_url}
- 超限/过期广告：302 Found，Location: {ad_ts_url} 或 403 Forbidden
- 频道不存在：404 Not Found

## 广告操作类型

| 操作类型 | 触发条件 |
|---------|---------|
| `vip_normal` | VIP 链接正常播放 |
| `vip_expired` | VIP M3U 已过期 |
| `free_normal` | 免费订阅链接正常播放 |
| `free_expired` | 免费订阅 M3U 已过期 |
| `fav_normal` | 收藏链接正常播放 |
| `fav_expired` | 收藏 M3U 已过期 |

## 定时任务

### 触发时间

数据源同步完成后（每日 3:00 或手动触发）

### 执行流程

1. 获取所有活跃频道
2. 读取域名黑名单
3. 生成 `m3u_vip` → KV（所有频道，域名黑名单过滤）
4. 用日期种子选取 10% 频道，生成 `m3u_free` → KV
5. 生成 `m3u_fav` → KV（所有频道）

### 日期种子算法

```javascript
// 保证同一天结果一致
const today = getLocalDate(env); // 使用配置的时区
let hash = 0;
for (let i = 0; i < today.length; i++) {
  const char = today.charCodeAt(i);
  hash = ((hash << 5) - hash) + char;
  hash = hash & hash;
}
const seed = Math.abs(hash);
```

## 域名黑名单处理

### 规则
- 完全匹配：`example.com` 匹配 `example.com`
- 子域名匹配：`*.example.com` 匹配 `sub.example.com`

### M3U 生成逻辑
- 域名在黑名单中：使用原始播放地址（透传）
- 域名不在黑名单中：使用代理播放地址 `/live/{type}_{hash}`

## 播放次数限制

### 规则
- 每个 IP 每频道每日限制：`channel_daily_limit`（默认 100）
- 存储在 D1 数据库 `play_counts_ip` 表
- 原子操作避免竞态条件

### 超限处理
- 触发对应的超限广告
- 或返回 403 Forbidden

## 错误处理

| 错误场景 | HTTP 状态码 | 响应内容 |
|---------|------------|----------|
| 订阅码无效/过期 | 403 | "Forbidden: Invalid or Expired Code" |
| IP 超限 | 403 | "Forbidden: Too many unique IPs" |
| 非当天第1 IP | 403 | "Access denied: Only first IP of the day can access" |
| 播放次数超限 | 302/403 | 重定向广告或返回错误 |
| M3U 未生成 | 503 | "M3U not available" |
| M3U 已过期 | 302/403 | 重定向广告或返回错误 |
| 频道不存在 | 404 | "Channel not found" |

## 缓存策略

- **M3U 文件**：TTL = `m3u_ttl_hours` 设置值（默认 72 小时）
- **D1 数据**：
  - `vip_ip_daily`：按日期自动过期
  - `play_counts_ip`：按日期自动过期
- **Cache-Control**：对于用户请求，返回 `public, max-age=300` 允许中间节点缓存

## 回退机制

当 KV 中 M3U 不存在时：
1. 记录错误日志
2. 尝试实时生成 M3U
3. 返回实时生成的 M3U

确保服务不会因为定时任务失败而完全中断。
