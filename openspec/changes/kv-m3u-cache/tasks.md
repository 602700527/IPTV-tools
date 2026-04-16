# KV 播放地址缓存方案 - 实施任务

## Phase 1: 数据库改动 ✅

### 1.1 新增管理后台设置项 ✅

**文件**: `database.js`

**任务**:
- [x] 在 `getSystemConfig()` 中新增 `m3u_ttl_hours` 设置项读取
- [x] 在 `updateSystemConfig()` 中新增 `m3u_ttl_hours` 设置项写入
- [x] 在 `getSystemConfig()` 中新增 `play_limit_per_ip` 设置项读取
- [x] 在 `updateSystemConfig()` 中新增 `play_limit_per_ip` 设置项写入

**默认值**: `m3u_ttl_hours = 72`（小时），`play_limit_per_ip = 100`（次/日）

### 1.2 删除旧 D1 数据库表 ✅

**文件**: `database.js`

**任务**:
- [x] 删除 `vip_ip_daily` 表（旧设计不再需要）
- [x] 删除 `play_counts` 表（被内存缓存取代）
- [x] 删除 `ip_play_links` 表（复制链接功能改用 token，不再需要 IP 绑定）

### 1.3 删除旧函数 ✅

**文件**: `database.js`

**任务**:
- [x] 删除 `createIPPlayLink()` 函数
- [x] 删除 `getIPPlayLink()` 函数
- [x] 删除 `verifyAndUseIPPlayLink()` 函数
- [x] 删除 `getIPPlayLinkUsage()` 函数

**文件**: `utils/cache.js`

**任务**:
- [x] 删除 `flushCacheToDB()` 函数（不再需要将播放计数刷到数据库）
- [x] 删除 `incrementPlayCount()` 函数（被新的内存缓存取代）
- [x] 删除 `getPlayCount()` 函数（被新的内存缓存取代）

### 1.4 广告操作类型清理 ✅

**文件**: `database.js`、`admin-page.js`

**任务**:
- [x] 删除旧广告操作类型：`code_normal`、`code_expired`、`code_unauth`、`code_channel_not_found`、`freesub_normal`、`freesub_expired`、`freesub_unauth`、`freesub_channel_not_found`、`copy_link_normal`、`copy_link_ip_limit`
- [x] 新增 6 个广告操作类型：`vip_expired`、`free_normal`、`free_expired`、`fav_normal`、`fav_expired`、`old_route_normal`

### 1.5 删除文件 ✅

**任务**:
- [x] 删除 `handlers/ip-play.js` 文件（IP 绑定复制链接功能删除）
- [x] 从 `worker.js` 中移除 `handleIPPlayRequest` 路由引入

### 1.6 管理后台修改 ✅

**文件**: `admin-page.js`

**任务**:
- [x] 删除"IP直链管理"Tab
- [x] 修改广告管理操作类型下拉为新类型
- [x] 删除系统设置中的 `channel_daily_limit`、`auto_ban_on_exceed`、`enable_ip_play` 字段
- [x] 修改频道页复制链接功能，改为生成 `/live/{prefix}/{token}/{hash}` 格式

## Phase 2: Token 管理 ✅

### 2.1 Token 工具函数 ✅

**文件**: `utils/token-manager.js`（新建）

**任务**:
- [x] 实现 `generateRandomToken(length)` - 生成 32 位随机字符串
- [x] 实现 `getCurrentToken(env)` - 获取当前有效的 token（无有效 token 时自动生成新 token）
- [x] 实现 `generateTokenAndAddresses(env)` - 生成 token + 批量写入播放地址（每批 25 个）
- [x] 实现 `getAllTokens(env)` - 列出所有未过期的 token
- [x] 实现 `cleanupPlayCountCache()` - 每天 0:00 清空 `playCountCache`
- [x] Token 生成失败时：返回标准 M3U，频道名为"当前正在维护，请稍后再试"

### 2.2 Token 内存缓存 ✅

**文件**: `utils/token-manager.js`（新建）

**任务**:
- [x] 实现 `validateToken(token, env)` - 先查内存缓存，未命中查 KV
- [x] 实现 `tokenCache = new Map()` - 60 秒 TTL 内存缓存

## Phase 3: 定时任务改动 ✅

### 3.1 Token 生成任务 ✅

**文件**: `handlers/scheduler.js`

**任务**:
- [x] 在现有数据源同步任务完成后调用 `generateTokenAndAddresses(env)`
- [x] 确保域名黑名单中的频道不写入 KV

### 3.2 现有定时任务保持不变 ✅

**说明**：数据源同步、缓存刷新等现有任务保持原样。

## Phase 4: M3U 接口改动 ✅

### 4.1 VIP 订阅接口 ✅

**文件**: `handlers/sub.js`

**任务**:
- [x] 修改 `handleSubRequest()` 函数
- [x] 保留卡密有效性验证
- [x] 保留 IP 限制验证
- [x] 获取当前 token
- [x] 实时生成 M3U，播放地址格式 `/live/vip/{token}/{hash}`
- [x] 设置正确的 Cache-Control 响应头

### 4.2 免费订阅接口 ✅

**文件**: `handlers/freesub-api.js`

**任务**:
- [x] 修改 `handleFreeSubM3U()` 函数
- [x] 保留指纹验证
- [x] 实现第 1 IP 验证逻辑（几天没访问的用户，再次访问时当前 IP 成为新的第 1 IP）
- [x] 获取当前 token
- [x] 动态过滤 10% 频道（日期种子）
- [x] 实时生成 M3U，播放地址格式 `/live/free/{token}/{hash}`

### 4.3 收藏/页面下载接口 ✅

**文件**: `handlers/public.js`

**任务**:
- [x] 删除旧的收藏/下载接口
- [x] 新增 `handleFavoritesM3U()` 函数
- [x] 验证用户登录状态
- [x] 检查会员身份
- [x] 获取当前 token
- [x] 非会员限制 100 个频道
- [x] VIP 会员用 `vip` 前缀（无广告），非会员用 `fav` 前缀（有广告）
- [x] 实时生成 M3U

## Phase 5: 播放验证改动 ✅

### 5.1 播放路由 ✅

**文件**: `handlers/live.js`

**任务**:
- [x] 修改 `handleLiveRequest()` 函数
- [x] 解析 path：`/live/{prefix}/{token}/{hash}`（4段路径）
- [x] 保留 IP 黑名单检查
- [x] 使用 `validateToken(token, env)` 验证 token（带内存缓存）
- [x] 播放次数限制使用内存缓存（`playCountCache`，key: `${ip}:${date}`）
- [x] 超限时封禁 IP（`banIP`）
- [x] 根据 prefix 触发对应广告（`${prefix}_normal` 或 `${prefix}_expired`）
- [x] 302 重定向到真实播放地址

### 5.2 旧路由兼容 ✅

**文件**: `handlers/live.js`

**任务**:
- [x] 新增 `handleLegacyLiveRequest()` 函数
- [x] 处理 `/live/{code}/{hash}` 格式（3段路径）
- [x] 检查是否绑定了 `old_route_normal` 广告
- [x] 已绑定广告：返回广告（302 重定向到广告 TS）
- [x] 未绑定广告：返回 403

### 5.3 域名黑名单透传 ✅

**文件**: `handlers/live.js`

**任务**:
- [x] 如果 KV 中没有 `play_addr:{token}:{hash}`，从 channels_cache 获取
- [x] 检查域名是否在黑名单中
- [x] 黑名单中的频道：透传原始播放地址，**不计入播放次数**
- [x] 非黑名单：返回 KV 中的地址

## Phase 6: 管理后台改动 ✅

### 6.1 Token 管理页面 ✅

**文件**: `handlers/admin.js`

**任务**:
- [x] 新增 `GET /admin/tokens` - 列出所有未过期的 token
- [x] 新增 `POST /admin/tokens/refresh` - 手动生成新 token 和播放地址
- [x] 新增 `POST /admin/tokens/{token}/invalidate` - 让指定 token 立即失效
- [x] 新增 `POST /admin/tokens/{token}/extend` - 延长 token 有效期

### 6.2 系统设置页面 ✅

**文件**: `handlers/admin.js`

**任务**:
- [x] 在系统配置 GET 接口返回 `m3u_ttl_hours` 配置
- [x] 在系统配置 POST 接口处理 `m3u_ttl_hours` 更新
- [x] 在系统配置 GET 接口返回 `play_limit_per_ip` 配置
- [x] 在系统配置 POST 接口处理 `play_limit_per_ip` 更新

### 6.3 广告设置页面 ✅

**文件**: `handlers/admin.js`

**任务**:
- [x] 移除所有旧操作类型配置
- [x] 保留统一的 `play_normal` 配置

### 6.4 缓存管理（现有功能保留）✅

**文件**: `handlers/admin.js`

**任务**:
- [x] 保留 `/admin/cache/refresh` - 刷新频道缓存
- [x] 保留 `/admin/cache/clear` - 清空缓存
- [x] 保留 `/admin/cache/status` - 查看状态

## Phase 7: Admin-page.js UI ✅

### 7.1 UI 修改 ✅

**文件**: `admin-page.js`

**任务**:
- [x] 删除 IP直连播放设置 section（enable_ip_play 复选框）
- [x] 从 loadSystemConfig 移除 enable_ip_play
- [x] 从 saveSystemConfig 移除 enable_ip_play
- [x] 更新 actionTypeOptions 为新类型：`vip_expired`、`free_normal`、`free_expired`、`fav_normal`、`fav_expired`、`old_route_normal`

## Phase 8: 测试与验证 ⏳

### 8.1 功能测试

**任务**:
- [ ] 测试定时任务生成 token 和播放地址
- [ ] 测试 VIP 订阅 M3U 下载
- [ ] 测试免费订阅 M3U 下载（第 1 IP vs 非第 1 IP，指纹验证）
- [ ] 测试收藏 M3U 下载（会员 vs 非会员）
- [ ] 测试播放验证（prefix=vip，token 有效，无广告）
- [ ] 测试播放验证（prefix=vip，token 过期，触发 vip_expired）
- [ ] 测试播放验证（prefix=free，token 有效，触发 free_normal）
- [ ] 测试播放验证（prefix=free，token 过期，触发 free_expired）
- [ ] 测试播放验证（prefix=fav，token 有效，触发 fav_normal）
- [ ] 测试播放验证（prefix=fav，token 过期，触发 fav_expired）
- [ ] 测试播放次数超限触发 IP 封禁
- [ ] 测试域名黑名单透传
- [ ] 测试旧路由 `/live/{code}/{hash}`（绑定广告返回广告，未绑定返回 403）

### 8.2 配额测试

**任务**:
- [ ] 验证 token 内存缓存生效
- [ ] 验证 M3U 下载不消耗 KV 操作
- [ ] 验证 KV 写入配额消耗（定时任务每天 1 次）

### 8.3 兼容性测试

**任务**:
- [ ] 测试旧 M3U 链接在过渡期的行为
- [ ] 测试旧 `/play/{link_id}/{hash}` 链接已不可用（返回 404）

## 文件改动清单

| 文件 | 改动内容 | 状态 |
|------|----------|------|
| `database.js` | 新增设置项、删除旧表（vip_ip_daily、play_counts、ip_play_links）、删除旧函数、清理旧广告类型 | ✅ |
| `handlers/admin.js` | Token 管理页面、系统设置、广告设置 | ✅ |
| `handlers/scheduler.js` | 新增 Token 生成任务调用 | ✅ |
| `handlers/sub.js` | M3U 实时生成，播放地址格式改为 `/live/vip/{token}/{hash}` | ✅ |
| `handlers/freesub-api.js` | M3U 实时生成，播放地址格式改为 `/live/free/{token}/{hash}` | ✅ |
| `handlers/public.js` | 新增收藏下载接口 | ✅ |
| `handlers/live.js` | 改为 prefix/token/hash 解析 + token 验证 + 广告判断 | ✅ |
| `handlers/ip-play.js` | 删除（IP 绑定复制链接功能移除） | ✅ |
| `utils/cache.js` | 删除 flushCacheToDB、incrementPlayCount、getPlayCount | ✅ |
| `utils/token-manager.js` | 新建，Token 生成和管理函数 | ✅ |
| `admin-page.js` | 删除 IP 直链管理 Tab、修改广告操作类型、修改系统设置字段、修改频道页复制链接 | ✅ |
| `worker.js` | 移除 ip-play 路由引入 | ✅ |

## 广告操作类型清单

| 操作类型 | 状态 |
|---------|------|
| `vip_expired` | ✅ 新增（VIP token 过期） |
| `free_normal` | ✅ 新增（免费订阅正常播放） |
| `free_expired` | ✅ 新增（免费订阅 token 过期） |
| `fav_normal` | ✅ 新增（收藏正常播放） |
| `fav_expired` | ✅ 新增（收藏 token 过期） |
| `old_route_normal` | ✅ 新增（旧路由访问） |
| `code_normal` | ❌ 删除 |
| `code_expired` | ❌ 删除 |
| `code_unauth` | ❌ 删除 |
| `code_channel_not_found` | ❌ 删除 |
| `freesub_normal` | ❌ 删除 |
| `freesub_expired` | ❌ 删除 |
| `freesub_unauth` | ❌ 删除 |
| `freesub_channel_not_found` | ❌ 删除 |
| `copy_link_normal` | ❌ 删除 |
| `copy_link_ip_limit` | ❌ 删除 |
| `play_normal` | ❌ 删除 |

## D1 数据库表清单

| 表名 | 用途 | 操作 |
|------|------|------|
| `vip_ip_daily` | VIP 每日 IP 记录 | ❌ 删除 |
| `play_counts` | 每频道每日播放次数 | ❌ 删除（被内存缓存取代） |
| `ip_play_links` | IP 直链播放记录 | ❌ 删除 |
