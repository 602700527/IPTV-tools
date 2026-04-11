# KV M3U 缓存方案 - 实施任务

## Phase 1: 数据库改动

### 1.1 新增管理后台设置项

**文件**: `database.js`

**任务**:
- [ ] 在 `getSystemConfig()` 中新增 `m3u_ttl_hours` 设置项读取
- [ ] 在 `updateSystemConfig()` 中新增 `m3u_ttl_hours` 设置项写入

**默认值**: `72`（小时）

### 1.2 新增 D1 数据库表

**文件**: `database.js`

**任务**:
- [ ] 创建 `vip_ip_daily` 表（VIP 每日 IP 记录）
- [ ] 创建 `play_counts_ip` 表（IP 每频道播放次数）

```sql
CREATE TABLE IF NOT EXISTS vip_ip_daily (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  date TEXT NOT NULL,
  ips TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(code, date)
);

CREATE TABLE IF NOT EXISTS play_counts_ip (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  ip TEXT NOT NULL,
  channel_hash TEXT NOT NULL,
  date TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(code, ip, channel_hash, date)
);
```

### 1.3 广告操作类型管理

**文件**: `database.js`

**任务**:
- [ ] 新增函数 `addAdBinding(actionType, adId, priority, cooldownSeconds)`
- [ ] 新增函数 `deleteAdBinding(actionType)` - 删除指定操作类型
- [ ] 在初始化时自动删除旧操作类型：`code_expired`、`code_unauth`、`copy_link_normal`、`copy_link_ip_limit`

## Phase 2: 管理后台改动

### 2.1 系统设置页面

**文件**: `handlers/admin.js`

**任务**:
- [ ] 在系统配置 GET 接口返回 `m3u_ttl_hours` 配置
- [ ] 在系统配置 POST 接口处理 `m3u_ttl_hours` 更新

### 2.2 广告设置页面

**文件**: `handlers/admin.js`

**任务**:
- [ ] 在广告绑定列表中移除 4 个旧操作类型
- [ ] 新增 6 个新操作类型的管理界面：`vip_normal`、`vip_expired`、`free_normal`、`free_expired`、`fav_normal`、`fav_expired`

## Phase 3: 定时任务改动

### 3.1 M3U 预生成函数

**文件**: `handlers/scheduler.js`（或新建 `handlers/m3u-generator.js`）

**任务**:
- [ ] 新增 `generateAllM3U(env)` 函数
- [ ] 实现 `generateM3UWithBlacklist(channels, type, domainBlacklist)` - 带域名黑名单过滤
- [ ] 实现 `selectWithSeed(channels, percent, seed)` - 种子随机选择函数（使用 mulberry32 PRNG）
- [ ] 实现 `getM3UTTL(env)` - 获取 TTL 设置值
- [ ] 实现 `getLocalDate(env)` - 获取本地日期（使用配置的时区）

### 3.2 定时任务集成

**文件**: `handlers/scheduler.js`

**任务**:
- [ ] 在现有 3:00 定时任务（数据源同步）完成后调用 `generateAllM3U(env)`
- [ ] 确保错误处理和日志记录

## Phase 4: M3U 获取接口改动

### 4.1 VIP 订阅接口

**文件**: `handlers/sub.js`

**任务**:
- [ ] 修改 `handleSubRequest()` 函数
- [ ] 移除实时生成 M3U 的逻辑
- [ ] 新增从 KV 获取 `m3u_vip` 的逻辑
- [ ] 保留订阅码有效性验证（status, expired_at）
- [ ] 新增 IP 限制验证（使用 D1 `vip_ip_daily` 表，原子操作）
- [ ] 添加 KV 读取失败时的回退生成逻辑
- [ ] 设置正确的 Cache-Control 响应头

### 4.2 免费订阅接口

**文件**: `handlers/freesub-api.js`

**任务**:
- [ ] 修改 `handleFreeSubM3U()` 函数
- [ ] 移除实时获取频道和 10% 过滤逻辑
- [ ] 新增从 KV 获取 `m3u_free` 的逻辑
- [ ] 保留现有指纹验证逻辑
- [ ] 新增当天第 1 IP 验证逻辑（使用 D1）
- [ ] 添加 KV 读取失败时的回退生成逻辑

### 4.3 收藏下载接口

**文件**: 新建 `handlers/favorites-m3u.js`

**任务**:
- [ ] 创建 `handleFavoritesM3U()` 函数
- [ ] 无需验证，直接返回 KV 中 `m3u_fav` 内容
- [ ] 添加 KV 读取失败时的回退生成逻辑

**文件**: `pages/favorites-page.js`

**任务**:
- [ ] 修改前端下载逻辑，改为调用 `/api/favorites/m3u`

## Phase 5: 播放验证改动

### 5.1 播放路由改造

**文件**: `handlers/live.js`

**任务**:
- [ ] 修改 `handleLiveRequest()` 函数
- [ ] 新增根据 code 前缀判断 M3U 类型
- [ ] 新增检查 KV key `m3u_{type}` 是否存在的逻辑
- [ ] 新增播放次数限制检查（D1 `play_counts_ip` 表）
- [ ] 实现正常播放广告触发（`{type}_normal`）
- [ ] 实现过期广告触发（`{type}_expired`）
- [ ] 保留频道不存在时的 404 处理

### 5.2 域名黑名单透传

**文件**: `handlers/live.js`

**任务**:
- [ ] 实现 `isChannelBlacklisted(channel, env)` - 检查域名是否在黑名单中
- [ ] 黑名单中的频道：透传原始播放地址
- [ ] 非黑名单频道：返回代理地址

## Phase 6: 废弃旧接口

### 6.1 IP 直连接口

**文件**: `handlers/ip-play.js`

**任务**:
- [ ] 标记 `/api/play/link` 为废弃（不再调用）
- [ ] 保留 `/play/{link_id}/{hash}` 播放逻辑（向后兼容）
- [ ] 移除相关广告绑定调用

### 6.2 旧广告逻辑清理

**文件**: `database.js`

**任务**:
- [ ] 清理 `getBoundAdByAction` 中对旧操作类型的支持
- [ ] 确保旧操作类型不会被触发

## Phase 7: 测试与验证

### 7.1 功能测试

**任务**:
- [ ] 测试 VIP 订阅 M3U 下载
- [ ] 测试免费订阅 M3U 下载（第 1 IP vs 非第 1 IP，指纹验证）
- [ ] 测试收藏 M3U 下载
- [ ] 测试播放验证（M3U 未过期场景）
- [ ] 测试播放验证（M3U 已过期场景，6 种广告）
- [ ] 测试 VIP IP 限制（max_ips）
- [ ] 测试播放次数限制
- [ ] 测试域名黑名单透传

### 7.2 性能测试

**任务**:
- [ ] 测试定时任务执行时间（10000+ 频道）
- [ ] 测试 KV 读取响应时间
- [ ] 测试 D1 原子操作
- [ ] 验证无数据库写入（M3U 下载场景）

### 7.3 竞态条件测试

**任务**:
- [ ] 并发请求测试 VIP IP 限制
- [ ] 并发请求测试播放次数限制
- [ ] 验证不会超出限制

### 7.4 兼容性测试

**任务**:
- [ ] 测试旧 M3U 链接在过渡期的行为
- [ ] 测试旧的 `/play/{link_id}/{hash}` 链接是否仍可用

## 文件改动清单

| 文件 | 改动内容 |
|------|----------|
| `database.js` | 新增设置项读写、新增广告绑定函数、新增 D1 表 |
| `handlers/admin.js` | 管理后台设置项、新增广告类型 |
| `handlers/scheduler.js` | 新增 M3U 预生成定时任务 |
| `handlers/sub.js` | 改为从 KV 获取 M3U + D1 IP 验证 |
| `handlers/freesub-api.js` | 改为从 KV 获取 M3U |
| `handlers/favorites-m3u.js` | 新建，收藏下载接口 |
| `handlers/live.js` | 改为检查 KV + D1 播放次数 + 广告触发 |
| `handlers/ip-play.js` | 标记废弃、移除旧广告逻辑 |
| `pages/favorites-page.js` | 改为调用新接口 |

## 广告操作类型清单

| 操作类型 | 触发场景 | 状态 |
|---------|---------|------|
| `vip_normal` | VIP 链接正常播放 | 新增 |
| `vip_expired` | VIP M3U 过期 | 新增 |
| `free_normal` | 免费订阅正常播放 | 新增 |
| `free_expired` | 免费订阅 M3U 过期 | 新增 |
| `fav_normal` | 收藏链接正常播放 | 新增 |
| `fav_expired` | 收藏 M3U 过期 | 新增 |
| `code_expired` | 卡密过期 | 删除 |
| `code_unauth` | IP 未授权 | 删除 |
| `copy_link_normal` | IP 直连正常 | 删除 |
| `copy_link_ip_limit` | IP 直连超限 | 删除 |

## D1 数据库表清单

| 表名 | 用途 | 操作 |
|------|------|------|
| `vip_ip_daily` | VIP 每日 IP 记录 | 新增 |
| `play_counts_ip` | IP 每频道播放次数 | 新增 |
