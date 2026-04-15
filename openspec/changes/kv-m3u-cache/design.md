# KV 播放地址缓存方案 - 技术设计

## 一、整体架构

### 1.1 数据流

```
┌──────────────────────────────────────────────────────────────────────┐
│                   定时任务（每日，数据源同步后）                          │
│  1. 生成新 token（随机 32 位字符串，默认 72h 有效）                     │
│  2. 获取所有活跃频道 + 域名黑名单                                        │
│  3. 将播放地址映射存入 KV：play_addr:{token}:{hash} → play_url          │
└──────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────┐
│                        M3U 获取接口                                    │
├────────────────┬────────────────┬─────────────────────────────────────┤
│   VIP 订阅      │   免费订阅      │        收藏/页面下载                 │
│ /sub/{code}   │  /freesub     │     /api/favorites/m3u              │
│               │  /sub/{free_*} │     /api/channels/m3u               │
├────────────────┼────────────────┼─────────────────────────────────────┤
│ 验证卡密有效     │ 验证指纹+IP     │      验证用户登录状态               │
│ 获取当前 token │ 获取当前 token │   获取当前 token                    │
│ 全部频道       │ 动态过滤10%    │   限制100/全部                      │
│ 播放地址前缀 vip │ 播放地址前缀 free │  播放地址前缀 fav                 │
└────────────────┴────────────────┴─────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────┐
│                 播放验证 /live/{prefix}/{token}/{hash}                │
├──────────────────────────────────────────────────────────────────────┤
│  prefix = vip | free | fav                                            │
│  1. KV 检查 play_token_{token} 是否存在且未过期                       │
│  2. KV 获取 play_addr:{token}:{hash} → play_url                      │
│  3. 根据 prefix 决定是否触发广告                                       │
│  4. 302 重定向到真实播放地址                                           │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 核心设计原则

| 原则 | 说明 |
|------|------|
| 简化验证 | 下载时验证订阅，播放时只验证 token |
| KV 存地址 | 播放地址映射存 KV，M3U 实时生成（节省存储） |
| 前缀区分 | vip=无广告，free/fav=有广告 |
| 新旧共存 | 旧 token 不会自动失效，可与新 token 共存 |
| 后台可控 | 管理后台可查看/刷新/失效 token |
| 旧路由处理 | 按广告绑定策略，无绑定则 403 |

## 二、KV Key 设计

### 2.1 播放地址映射

| Key | 内容 | TTL |
|-----|------|-----|
| `play_addr:{token}:{hash}` | 真实播放地址 | 72 小时 |

**说明**：定时任务生成 token 后，批量写入所有频道的播放地址映射。

### 2.2 Token 存储

| Key | 内容 | TTL |
|-----|------|-----|
| `play_token:{token}` | Token 元数据 | 默认 72 小时，过期自动删除 |

Token 元数据：
```json
{
  "created_at": "2026-04-15T00:00:00Z",
  "expires_at": "2026-04-18T00:00:00Z",
  "type": "vip"
}
```

**说明**：
- `type` 字段预留，目前通过前缀区分广告类型，暂不使用
- 未来可能用于区分不同渠道的 token

**注意**：KV 的 expirationTtl 是一次性的，设置后无法直接修改。延长有效期需要重新存储。

### 2.3 频道数据缓存（现有）

| Key | 内容 | 用途 | 刷新方式 |
|-----|------|------|----------|
| `channels_cache` | 所有频道的完整数据 | 播放时获取真实播放地址，302 重定向 | `/admin/cache/refresh` |

**说明**：`play_addr` 与 `channels_cache` 是分开的：
- `play_addr`：定时任务生成的播放地址映射，供 M3U 下载用
- `channels_cache`：现有频道数据，备用

## 三、接口设计

### 3.1 VIP 订阅 `/sub/{code}`

```javascript
async function handleVIPSub(code, request, env) {
  const clientIP = getClientIP(request);
  const today = getLocalDate(env);
  
  // 1. 验证卡密有效
  const db = getDB();
  const auth = await db.prepare(
    "SELECT status, expired_at, max_ips FROM codes WHERE code = ?"
  ).bind(code).first();
  
  if (!auth || auth.status !== 'active' || auth.expired_at < new Date().toISOString()) {
    return new Response('Forbidden: Invalid or Expired Code', { status: 403 });
  }
  
  // 2. 检查 IP 限制
  const maxIPs = auth.max_ips || 3;
  const allowed = await checkAndAddVIPIP(db, code, clientIP, today, maxIPs);
  
  if (!allowed) {
    return new Response('Too many unique IPs', { status: 403 });
  }
  
  // 3. 获取当前有效 token
  const token = await getCurrentToken(env);

  // 4. 如果 token 为 null，返回错误 M3U
  if (!token) {
    return new Response('#EXTM3U\n#EXTINF:-1,当前正在维护，请稍后再试', {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }

  // 5. 获取频道列表并实时生成 M3U（播放地址前缀 vip）
  const channels = await getAllChannels(env);
  const m3uContent = generateM3UWithPrefix(channels, token, 'vip');

  return new Response(m3uContent, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

// 实时生成 M3U（播放地址格式：/live/vip/{token}/{hash}）
async function generateM3UWithPrefix(channels, token, prefix) {
  const lines = ['#EXTM3U'];
  
  for (const channel of channels) {
    const extinf = `#EXTINF:-1 tvg-logo="${channel.logo || ''}" group-title="${channel.group_title || ''}",${channel.channel_name}`;
    lines.push(extinf);
    lines.push(`/live/${prefix}/${token}/${channel.channel_hash}`);
  }
  
  return lines.join('\n');
}
```

### 3.2 免费订阅 `/sub/{free_*}`

```javascript
async function handleFreeSub(code, request, env) {
  const clientIP = getClientIP(request);
  const today = getLocalDate(env);

  // 1. 提取 free subscription ID
  const subId = code.substring(5);

  // 2. 验证免费订阅
  const db = getDB();
  const validation = await validateFreeSubscriptionWithFingerprint(subId, request, fingerprint, db);

  if (!validation.valid) {
    return new Response('Forbidden', { status: 403 });
  }

  // 3. 检查当天第 1 IP
  // 逻辑：如果用户几天没访问，数据库没有今天的记录，
  //       则当前IP成为今天的第1个IP，允许访问
  const firstIPAllowed = await checkAndSetFreeFirstIP(db, subId, clientIP, today);

  if (!firstIPAllowed) {
    // 不是今天的第1 IP，检查是否需要更新
    const needsUpdate = await shouldUpdateFreeSubIP(db, subId, clientIP, today);
    if (!needsUpdate) {
      return new Response('Access denied: Only first IP of the day can access', { status: 403 });
    }
  }

  // 4. 获取当前 token
  const token = await getCurrentToken(env);

  // 5. 如果 token 为 null，返回错误 M3U
  if (!token) {
    return new Response('#EXTM3U\n#EXTINF:-1,当前正在维护，请稍后再试', {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }

  // 6. 获取频道并过滤 10%（日期种子）
  let channels = await getAllChannels(env);
  channels = filterChannelsBySeed(channels, today, 0.1);

  // 7. 实时生成 M3U（播放地址前缀 free）
  const m3uContent = generateM3UWithPrefix(channels, token, 'free');

  return new Response(m3uContent, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

// 检查是否应该更新免费订阅的第1 IP
async function shouldUpdateFreeSubIP(db, subId, clientIP, today) {
  // 获取订阅记录中的IP
  const sub = await db.prepare(
    "SELECT ip FROM free_subscriptions WHERE sub_id = ?"
  ).bind(subId).first();

  // 如果订阅中存储的IP就是当前IP，允许
  if (sub && sub.ip === clientIP) {
    return true;
  }

  // 否则，检查今天的订阅IP记录
  const todayIP = await db.prepare(`
    SELECT ip FROM subscription_ips
    WHERE sub_id = ? AND date = ?
  `).bind(subId, today).first();

  // 如果今天没有记录，当前IP成为新的第1 IP
  if (!todayIP) {
    await db.prepare(`
      INSERT INTO subscription_ips (sub_id, ip, date) VALUES (?, ?, ?)
    `).bind(subId, clientIP, today).run();
    return true;
  }

  // 如果今天的记录中的IP就是当前IP，允许
  if (todayIP.ip === clientIP) {
    return true;
  }

  return false;
}
```

### 3.3 收藏/页面下载 `/api/favorites/m3u`

```javascript
async function handleFavoritesM3U(request, env) {
  // 1. 验证用户登录
  const user = await validateUserSession(request, env);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. 检查会员身份
  const isVIP = user.is_vip || user.vip_expired_at > new Date().toISOString();
  
  // 3. 获取当前 token
  const token = await getCurrentToken(env);

  // 4. 如果 token 为 null，返回错误 M3U
  if (!token) {
    return new Response('#EXTM3U\n#EXTINF:-1,当前正在维护，请稍后再试', {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }

  // 5. 获取频道
  let channels = await getAllChannels(env);

  // 6. 非会员限制 100 个
  if (!isVIP) {
    channels = channels.slice(0, 100);
  }

  // 7. VIP 会员用 vip 前缀（无广告），非会员用 fav 前缀（有广告）
  const prefix = isVIP ? 'vip' : 'fav';
  const m3uContent = generateM3UWithPrefix(channels, token, prefix);

  return new Response(m3uContent, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
```

**广告触发逻辑补充**：
- VIP 会员播放收藏 → `prefix=vip` + token 有效 → **不触发广告**
- 非会员播放收藏 → `prefix=fav` + token 有效 → 触发 `fav_normal`

### 3.4 播放验证 `/live/{prefix}/{token}/{hash}`

```javascript
// Token 验证内存缓存（不消耗 KV 配额）
const tokenCache = new Map();
const TOKEN_CACHE_TTL = 60 * 1000;

// 播放次数内存缓存（防止同一 IP 频繁访问）
const playCountCache = new Map(); // key: `${ip}:${date}`, value: count
let PLAY_LIMIT = 100; // 每个 IP 每日限制（可配置）

// 每天 0 点清空播放次数缓存
function setupDailyCleanup() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  setTimeout(() => {
    playCountCache.clear();
    console.log('[Cache] Play count cache cleared at midnight');
    setupDailyCleanup(); // 重新设置下一次清理
  }, msUntilMidnight);
}
setupDailyCleanup();

async function getCurrentToken(env) {
  // 1. 获取当前有效的 token
  const list = await env.KV.list({ prefix: 'play_token:' });

  for (const item of list.keys) {
    const token = item.name.replace('play_token:', '');
    const meta = await env.KV.get(item.name);
    if (meta) {
      const { expires_at } = JSON.parse(meta);
      if (new Date(expires_at) > new Date()) {
        return token;
      }
    }
  }

  // 2. 没有有效 token，触发定时任务生成
  console.log('[Token] No valid token found, triggering generation');
  try {
    await generateTokenAndAddresses(env);
    // 重新获取
    return await getCurrentToken(env);
  } catch (error) {
    console.error('[Token] Failed to generate token:', error);
    // 3. 生成失败：返回 null，M3U 接口应返回错误 M3U（频道名：当前正在维护，请稍后再试）
    return null;
  }
}

async function validateToken(token, env) {
  // 1. 先查内存缓存
  const cached = tokenCache.get(token);
  if (cached && cached.expires_at > Date.now()) {
    return cached;
  }

  // 2. 缓存未命中，查 KV
  const tokenData = await env.KV.get(`play_token:${token}`);
  if (!tokenData) return null;

  const meta = JSON.parse(tokenData);

  // 3. 存入内存缓存
  tokenCache.set(token, meta);
  setTimeout(() => tokenCache.delete(token), TOKEN_CACHE_TTL);

  return meta;
}

async function handleLivePlay(prefix, token, hash, request, env) {
  const clientIP = getClientIP(request);
  const url = new URL(request.url);
  const today = getLocalDate(env);

  // 0. IP 黑名单检查
  const ipCheck = await checkIPRateLimit(env, ctx, clientIP, '/live');
  if (!ipCheck.allowed) {
    return new Response(ipCheck.message, { status: 403 });
  }

  // 1. 验证 token 有效性（内存缓存）
  const tokenMeta = await validateToken(token, env);

  if (!tokenMeta) {
    // Token 不存在，触发过期广告
    const adAction = `${prefix}_expired`;
    const ad = await getBoundAdByAction(adAction, clientIP);
    if (ad) {
      return new Response(null, {
        status: 302,
        headers: { 'Location': `${url.origin}/api/ads/${ad.id}.ts` }
      });
    }
    return new Response('Token expired or invalid', { status: 403 });
  }

  // 2. 检查播放次数限制（内存中）
  const playKey = `${clientIP}:${today}`;
  const currentCount = playCountCache.get(playKey) || 0;

  if (currentCount >= PLAY_LIMIT) {
    // 超限，封禁 IP
    await banIP(env, clientIP, 'Play limit exceeded', { ip: clientIP, date: today, count: currentCount });
    return new Response('IP banned: Play limit exceeded', { status: 403 });
  }

  // 增加播放计数
  playCountCache.set(playKey, currentCount + 1);

  // 3. 获取真实播放地址（从 KV）
  const playUrl = await env.KV.get(`play_addr:${token}:${hash}`);

  if (!playUrl) {
    // KV 中没有，从 channels_cache 获取（兼容旧逻辑）
    const channel = await getChannelByHash(env, hash);
    if (!channel) {
      return Response.json({ error: 'Channel not found' }, { status: 404 });
    }

    // 域名黑名单检查：黑名单中透传原始地址，**不计入播放次数**
    const isBlacklisted = await isChannelBlacklisted(channel, env);
    return new Response(null, {
      status: 302,
      headers: { 'Location': channel.play_url }
    });
  }

  // 4. 根据 prefix 决定是否触发广告
  if (prefix !== 'vip') {
    // free/fav 需要触发广告
    const adAction = `${prefix}_normal`;
    const ad = await getBoundAdByAction(adAction, clientIP);
    if (ad) {
      return new Response(null, {
        status: 302,
        headers: { 'Location': `${url.origin}/api/ads/${ad.id}.ts` }
      });
    }
  }

  // 5. 302 重定向
  return new Response(null, {
    status: 302,
    headers: { 'Location': playUrl }
  });
}
```

### 3.5 旧路由处理 `/live/{code}/{hash}`

```javascript
// 旧路由：/live/{code}/{hash}（3段路径）
// 不做7天过渡期，按广告绑定策略处理
async function handleLegacyLiveRequest(code, hash, request, env) {
  const clientIP = getClientIP(request);
  const url = new URL(request.url);

  // 检查是否绑定了 old_route_normal 广告
  const ad = await getBoundAdByAction('old_route_normal', clientIP);
  if (ad) {
    return new Response(null, {
      status: 302,
      headers: { 'Location': `${url.origin}/api/ads/${ad.id}.ts` }
    });
  }

  // 没绑定广告，返回403
  return new Response('Please update your subscription', { status: 403 });
}
```

## 四、定时任务设计

### 4.1 Token 生成任务

**执行时机**：数据源同步完成后（每天 3:00 之后）

```javascript
async function generateTokenAndAddresses(env) {
  // 1. 生成新 token
  const token = generateRandomToken(32);
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
  
  // 2. 存入 token（72h TTL）
  await env.KV.put(`play_token:${token}`, JSON.stringify({
    created_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString()
  }), { expirationTtl: 72 * 3600 });
  
  // 3. 获取所有活跃频道
  const { channels } = await getAllChannels(env);
  const activeChannels = channels.filter(c => c.is_active && c.source_active);
  
  // 4. 读取域名黑名单
  const domainBlacklist = await getDomainBlacklist(env);
  
  // 5. 批量写入播放地址映射（72h TTL）
  const batch = [];
  for (const channel of activeChannels) {
    let playUrl = channel.play_url;
    
    // 域名黑名单检查：黑名单中透传原始地址
    if (domainBlacklist.length > 0) {
      const hostname = new URL(playUrl).hostname;
      const isBlacklisted = domainBlacklist.some(d => 
        hostname === d || hostname.endsWith('.' + d)
      );
      if (isBlacklisted) {
        // 黑名单中的域名透传，不存入 KV，直接用原始地址
        continue;
      }
    }
    
    batch.push(env.KV.put(`play_addr:${token}:${channel.channel_hash}`, playUrl, {
      expirationTtl: 72 * 3600
    }));
  }
  
  // 批量执行
  await Promise.all(batch);
  
  console.log(`[Token] Generated ${token}, ${batch.length} addresses cached`);
}
```

**注意**：
- 域名黑名单中的频道**不存入 KV**，播放时直接透传原始地址
- Cloudflare KV 批量操作限制单次不超过 25 个 key，10000 频道需分批写入

### 4.2 KV 批量写入实现

```javascript
const BATCH_SIZE = 25; // Cloudflare KV 限制

async function batchWriteAddresses(addresses, env) {
  for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
    const batch = addresses.slice(i, i + BATCH_SIZE);
    const operations = batch.map(({ key, value }) =>
      env.KV.put(key, value, { expirationTtl: 72 * 3600 })
    );
    await Promise.all(operations);
    console.log(`[Token] Written batch ${i / BATCH_SIZE + 1}/${Math.ceil(addresses.length / BATCH_SIZE)}`);
  }
}
```

### 4.3 现有定时任务不变

原有的数据源同步定时任务保持不变，新增 Token 生成任务在其后执行。

## 五、广告操作类型

### 5.1 按前缀和状态区分

| 操作类型 | 触发场景 | 说明 |
|---------|---------|------|
| `vip_expired` | VIP token 过期 | VIP 播放时 token 无效 |
| `free_normal` | 免费订阅正常播放 | free 前缀，token 有效 |
| `free_expired` | 免费订阅 token 过期 | free 前缀，token 无效 |
| `fav_normal` | 收藏正常播放 | fav 前缀，token 有效 |
| `fav_expired` | 收藏 token 过期 | fav 前缀，token 无效 |
| `old_route_normal` | 旧路由访问 | `/live/{code}/{hash}` 格式，提示用户更新订阅 |

**广告触发逻辑**：
- `prefix=vip` + token 有效 → 不触发广告，直接播放
- `prefix=vip` + token 过期 → 触发 `vip_expired`
- `prefix=free` + token 有效 → 触发 `free_normal`
- `prefix=free` + token 过期 → 触发 `free_expired`
- `prefix=fav` + token 有效 → 触发 `fav_normal`（**非会员播放收藏时**）
- `prefix=fav` + token 过期 → 触发 `fav_expired`
- 旧路由 `/live/{code}/{hash}` → 按广告绑定策略处理（绑定广告则返回广告，未绑定则 403）

**收藏下载特殊逻辑**：
- VIP 会员 → `prefix=vip` → 不触发广告
- 非会员 → `prefix=fav` → 触发 `fav_normal`

### 5.2 需删除的操作类型

所有旧的渠道特定操作类型全部删除：
`code_expired`、`code_unauth`、`code_normal`、`code_channel_not_found`、`copy_link_normal`、`copy_link_ip_limit`、`freesub_*`、`play_normal`

## 六、管理后台

### 6.1 Token 管理

| 功能 | 说明 |
|------|------|
| 列表 | 显示所有未过期的 token |
| 刷新 | 手动生成新 token 和播放地址映射 |
| 延长有效期 | 删除旧 KV，重新插入（带新 expirationTtl） |
| 立即失效 | 删除 KV 中的 token 和对应播放地址 |

### 6.2 缓存管理（现有功能保留）

| 功能 | 说明 |
|------|------|
| `/admin/cache/refresh` | 刷新 `channels_cache`（频道数据） |
| `/admin/cache/clear` | 清空频道缓存 |
| `/admin/cache/status` | 查看缓存状态 |

### 6.3 新增设置项

| 设置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `m3u_ttl_hours` | number | 72 | Token 和播放地址有效期（小时），读取失败时也用 72 |
| `play_limit_per_ip` | number | 100 | 每 IP 每日播放次数限制，后台可配置 |

## 七、D1 数据库表设计

### 7.1 需删除的表

| 表名 | 原因 |
|------|------|
| `vip_ip_daily` | IP 限制改为 token 级别追踪，播放次数改用内存缓存 |

## 八、配额设计

### 8.1 Cloudflare Workers 免费配额

| 资源 | 免费额度/天 | 消耗场景 |
|------|------------|---------|
| 请求数 | 100,000 | 每次访问 Worker |
| KV 读取 | 10,000 | 验证 token（首次） |
| KV 写入 | 1,000 | 生成新 token + 播放地址映射 |
| Cache API | 1,000 | 显式缓存响应 |

### 8.2 配额优化策略

**内存缓存**：
- Token 验证结果缓存 60 秒
- 同一 token 多次播放只用 1 次 KV 读取

**批量写入**：
- 定时任务一次性批量写入所有播放地址（1 次 KV 写入 + N 次批量操作）
- 用户下载 M3U 直接返回，无 KV 操作

**配额消耗示例**（1000 用户，每用户播 10 个频道）：

| 场景 | 操作数 | 消耗 |
|------|--------|------|
| 定时任务 | 1 token + N 地址写入 | KV 写入 ~1 |
| 用户下载 M3U | 0 KV 操作 | 0 |
| 用户播放（首次） | 1000 次 KV 读取 | KV 读取 1000 |
| 用户播放（缓存命中） | 9000 次 0 操作 | 0 |
| **总计** | | KV 写入 ~1，KV 读取 1000 |

完全在免费额度内。

## 九、与旧设计对比

| 项目 | 旧设计 | 新设计 |
|------|--------|--------|
| 播放地址格式 | `/live/{code}/{hash}` | `/live/{prefix}/{token}/{hash}` |
| 卡密验证时机 | 下载 + 播放 | 只在下载时 |
| Token 验证 | 无 | 播放时验证（只认token，不检查卡密状态） |
| 广告区分 | 多操作类型 | 按 prefix 区分（vip=无，free/fav=有） |
| 播放地址存储 | 实时获取 | KV 预存 + 域名黑名单透传 |
| M3U 生成 | 实时生成 | 实时生成（从频道列表） |
| IP 限制 | 播放时验证 | 下载时验证（卡密 IP 限制） |
| 旧路由处理 | 直接播放 | 按广告绑定策略（绑定广告返回广告，未绑定403） |
| VIP播放收藏 | 有广告 | **无广告**（使用 `vip` 前缀） |
| 非会员播放收藏 | 有广告 | 有广告（`fav_normal`） |
