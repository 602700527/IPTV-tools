# KV M3U 缓存方案 - 技术设计

## 一、整体架构

### 1.1 数据流

```
┌──────────────────────────────────────────────────────────────────────┐
│                   定时任务（数据源同步后）                               │
│  1. 同步数据源                                                         │
│  2. 读取域名黑名单                                                     │
│  3. 生成 m3u_vip（所有频道，带黑名单过滤）→ KV                         │
│  4. 生成 m3u_free（10%频道，用日期种子）→ KV                          │
│  5. 生成 m3u_fav（所有频道）→ KV                                      │
└──────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────┐
│                        M3U 获取接口                                    │
├────────────────┬────────────────┬─────────────────────────────────┤
│   VIP 订阅      │   免费订阅      │        收藏下载                   │
│ /sub/{code}   │   /freesub     │        /api/favorites/m3u          │
├────────────────┼────────────────┼─────────────────────────────────┤
│ 验证订阅码有效性 │ 验证指纹+第1IP  │        无验证                     │
│ 验证 IP 限制    │                │                                  │
│   ↓            │    ↓          │        ↓                         │
│ 从 KV 获取     │ 从 KV 获取     │      从 KV 获取                   │
│ m3u_vip      │ m3u_free     │      m3u_fav                     │
└────────────────┴────────────────┴─────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────┐
│                     播放验证 /live/{code}/{hash}                     │
├──────────────────────────────────────────────────────────────────────┤
│  1. 检查 M3U 是否存在（通过 code 前缀匹配 KV key）                     │
│  2. 检查播放次数限制（每个IP每频道每日）                                │
│  3. 未超限：302 重定向到真实播放地址 + 触发正常播放广告                │
│  4. 超限：触发过期/超限广告                                            │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Code 前缀设计

| 前缀 | 用途 | M3U 内容 | KV Key |
|------|------|----------|--------|
| 无前缀（VIP code） | VIP 订阅 | 所有频道 | `m3u_vip` |
| `free_` | 免费订阅 | 10%频道（日期种子确定） | `m3u_free` |
| `fav_` | 收藏下载 | 所有频道 | `m3u_fav` |

**说明**：VIP 订阅使用现有的订阅码（如 `abc123def`），在播放链接中直接使用。

## 二、KV Key 设计

### 2.1 M3U 存储

| Key | 内容 | TTL |
|-----|------|-----|
| `m3u_vip` | VIP M3U 文件（所有频道） | `m3u_ttl_hours` |
| `m3u_free` | 免费订阅 M3U（10%频道） | `m3u_ttl_hours` |
| `m3u_fav` | 收藏下载 M3U | `m3u_ttl_hours` |

### 2.2 播放次数限制（D1 数据库）

使用 D1 数据库存储，原子操作避免竞态条件：

| 表 | 字段 | 说明 |
|----|------|------|
| `play_counts_ip` | code, ip, channel_hash, date, count | 每个IP每频道每日播放次数 |

## 三、接口设计

### 3.1 VIP 订阅 `/sub/{code}`

```javascript
async function handleVIPSub(code, request, env) {
  const clientIP = getClientIP(request);
  const today = getLocalDate(env); // 使用配置的时区
  
  // 1. 验证订阅码有效（现有逻辑不变）
  const db = getDB();
  const auth = await db.prepare(
    "SELECT status, expired_at, max_ips FROM codes WHERE code = ?"
  ).bind(code).first();
  
  const now = new Date().toISOString();
  if (!auth || auth.status !== 'active' || auth.expired_at < now) {
    return new Response('Forbidden: Invalid or Expired Code', { status: 403 });
  }
  
  // 2. 检查 IP 限制（D1 原子操作）
  const maxIPs = auth.max_ips || 3;
  const allowed = await checkAndAddVIPIP(db, code, clientIP, today, maxIPs);
  
  if (!allowed) {
    return new Response('Too many unique IPs', { status: 403 });
  }
  
  // 3. 从 KV 获取 M3U
  const m3u = await env.KV.get('m3u_vip');
  if (!m3u) {
    // 回退：实时生成
    const channels = await getAllChannels(env);
    const m3u = await generateM3UWithBlacklist(channels, 'vip');
    return new Response(m3u, {
      headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
    });
  }
  
  return new Response(m3u, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

// D1 原子操作：检查并添加 IP
async function checkAndAddVIPIP(db, code, ip, date, maxIPs) {
  // 使用事务确保原子性
  const todayRecord = await db.prepare(
    "SELECT ips FROM vip_ip_daily WHERE code = ? AND date = ?"
  ).bind(code, date).first();
  
  let ips = [];
  if (todayRecord && todayRecord.ips) {
    ips = JSON.parse(todayRecord.ips);
  }
  
  if (!ips.includes(ip)) {
    if (ips.length >= maxIPs) {
      return false; // 超过限制
    }
    ips.push(ip);
  }
  
  // 原子更新
  await db.prepare(`
    INSERT OR REPLACE INTO vip_ip_daily (code, date, ips) VALUES (?, ?, ?)
  `).bind(code, date, JSON.stringify(ips)).run();
  
  return true;
}
```

### 3.2 免费订阅 `/freesub/{subId}.m3u`

```javascript
async function handleFreeSub(request, env, subId) {
  const clientIP = getClientIP(request);
  const today = getLocalDate(env);
  
  // 1. 验证免费订阅（现有指纹 + IP 逻辑保持）
  const db = getDB();
  const validation = await validateFreeSubscriptionWithFingerprint(
    subId, request, fingerprint, db
  );
  
  if (!validation.valid) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // 2. 检查当天第 1 IP（D1 原子操作）
  const firstIPAllowed = await checkAndSetFreeFirstIP(db, subId, clientIP, today);
  
  if (!firstIPAllowed) {
    return new Response('Access denied: Only first IP of the day can access', { status: 403 });
  }
  
  // 3. 从 KV 获取 M3U
  const m3u = await env.KV.get('m3u_free');
  if (!m3u) {
    const channels = await getAllChannels(env);
    const m3u = await generateFreeM3U(channels, today);
    return new Response(m3u, {
      headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
    });
  }
  
  return new Response(m3u, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
```

### 3.3 收藏下载 `/api/favorites/m3u`

```javascript
// 前端直接请求，无验证
async function handleFavoritesM3U(request, env) {
  const m3u = await env.KV.get('m3u_fav');
  if (!m3u) {
    return new Response('M3U not available', { status: 503 });
  }
  
  return new Response(m3u, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
```

### 3.4 播放验证 `/live/{code}/{hash}`

```javascript
async function handleLivePlay(code, hash, request, env) {
  const clientIP = getClientIP(request);
  const url = new URL(request.url);
  const today = getLocalDate(env);
  
  // 1. 确定 M3U 类型（通过 code 前缀）
  let m3uType = 'vip';
  if (code.startsWith('free_')) m3uType = 'free';
  else if (code.startsWith('fav_')) m3uType = 'fav';
  
  // 2. 检查 M3U 是否存在
  const m3uKey = `m3u_${m3uType}`;
  const m3uExists = await env.KV.get(m3uKey);
  
  if (!m3uExists) {
    // M3U 过期，触发过期广告
    const adAction = `${m3uType}_expired`;
    return await triggerAd(adAction, clientIP, url);
  }
  
  // 3. 检查播放次数限制（每个 IP 每频道每日）
  const db = getDB();
  const playLimitReached = await incrementPlayCount(db, code, clientIP, hash, today);
  
  if (playLimitReached) {
    // 超限，触发超限广告
    const adAction = `${m3uType}_exceeded`;
    return await triggerAd(adAction, clientIP, url);
  }
  
  // 4. 获取真实播放地址
  const channel = await getChannelByHash(env, hash);
  if (!channel) {
    return new Response('Channel not found', { status: 404 });
  }
  
  // 5. 域名黑名单检查，决定是否透传
  let playUrl = channel.play_url;
  const isBlacklisted = await isChannelBlacklisted(channel, env);
  if (isBlacklisted) {
    playUrl = channel.play_url; // 透传原始地址
  }
  
  // 6. 触发正常播放广告（可选）
  const adAction = `${m3uType}_normal`;
  const ad = await getBoundAdByAction(adAction, clientIP);
  if (ad) {
    // 重定向到广告
    return new Response(null, {
      status: 302,
      headers: { 'Location': `${url.origin}/api/ads/${ad.id}.ts` }
    });
  }
  
  // 7. 302 重定向到真实播放地址
  return new Response(null, {
    status: 302,
    headers: { 'Location': playUrl }
  });
}

// 触发广告
async function triggerAd(action, clientIP, url) {
  const ad = await getBoundAdByAction(action, clientIP);
  if (ad) {
    return new Response(null, {
      status: 302,
      headers: { 'Location': `${url.origin}/api/ads/${ad.id}.ts` }
    });
  }
  return new Response('Link expired or limit reached', { status: 403 });
}

// 播放次数检查与递增（原子操作）
async function incrementPlayCount(db, code, ip, hash, date) {
  // 查询当前次数
  const record = await db.prepare(`
    SELECT count FROM play_counts_ip 
    WHERE code = ? AND ip = ? AND channel_hash = ? AND date = ?
  `).bind(code, ip, hash, date).first();
  
  const currentCount = record ? record.count : 0;
  
  // 检查限制（从系统配置获取）
  const limit = 100; // channel_daily_limit
  
  if (currentCount >= limit) {
    return true; // 超限
  }
  
  // 递增
  await db.prepare(`
    INSERT OR REPLACE INTO play_counts_ip (code, ip, channel_hash, date, count)
    VALUES (?, ?, ?, ?, ?)
  `).bind(code, ip, hash, date, currentCount + 1).run();
  
  return false; // 未超限
}
```

## 四、定时任务设计

### 4.1 任务流程

```javascript
async function pregenerateAllM3U(env) {
  // 1. 获取所有频道
  const { channels } = await getAllChannels(env);
  const activeChannels = channels.filter(c => c.is_active && c.source_active);
  
  // 2. 读取域名黑名单
  const domainBlacklist = await getDomainBlacklist(env);
  
  // 3. 生成 VIP M3U（所有频道，带域名黑名单过滤）
  const vipM3U = await generateM3UWithBlacklist(activeChannels, 'vip', domainBlacklist);
  await env.KV.put('m3u_vip', vipM3U, { 
    expirationTtl: getM3UTTL(env) * 3600
  });
  
  // 4. 生成免费订阅 M3U（10%频道，用日期种子）
  const today = getLocalDate(env);
  const seed = generateDateSeed(today);
  const freeChannels = selectWithSeed(activeChannels, 0.1, seed);
  const freeM3U = await generateM3UWithBlacklist(freeChannels, 'free', domainBlacklist);
  await env.KV.put('m3u_free', freeM3U, { 
    expirationTtl: getM3UTTL(env) * 3600
  });
  
  // 5. 生成收藏下载 M3U
  const favM3U = await generateM3UWithBlacklist(activeChannels, 'fav', domainBlacklist);
  await env.KV.put('m3u_fav', favM3U, { 
    expirationTtl: getM3UTTL(env) * 3600
  });
  
  console.log(`[M3U] Generated: VIP ${activeChannels.length}, Free ${freeChannels.length}, Fav ${activeChannels.length}`);
}

// 生成 M3U（域名黑名单过滤）
async function generateM3UWithBlacklist(channels, type, domainBlacklist) {
  const lines = ['#EXTM3U'];
  
  for (const channel of channels) {
    const playUrl = channel.play_url;
    let finalUrl = playUrl;
    
    // 检查域名黑名单
    if (domainBlacklist.length > 0) {
      const hostname = new URL(playUrl).hostname;
      const isBlacklisted = domainBlacklist.some(d => 
        hostname === d || hostname.endsWith('.' + d)
      );
      
      if (isBlacklisted) {
        finalUrl = playUrl; // 透传，不走代理
      } else {
        // 走代理
        finalUrl = `/live/${type}_${channel.channel_hash}`;
      }
    } else {
      finalUrl = `/live/${type}_${channel.channel_hash}`;
    }
    
    const extinf = `#EXTINF:-1 tvg-logo="${channel.logo || ''}" group-title="${channel.group_title || ''}",${channel.channel_name}`;
    lines.push(extinf);
    lines.push(finalUrl);
  }
  
  return lines.join('\n');
}

// 日期种子（保证同一天结果一致）
function generateDateSeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// 种子随机选择
function selectWithSeed(channels, percent, seed) {
  const target = Math.floor(channels.length * percent);
  const selected = new Set();
  
  // 使用 mulberry32 PRNG
  const random = mulberry32(seed);
  
  while (selected.size < target) {
    const idx = Math.floor(random() * channels.length);
    selected.add(idx);
  }
  
  return channels.filter((_, i) => selected.has(i));
}

function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

## 五、广告操作类型

### 5.1 新增操作类型（6个）

| 操作类型 | 触发场景 | 说明 |
|---------|---------|------|
| `vip_normal` | VIP 链接正常播放 | 每次播放时触发 |
| `vip_expired` | VIP M3U 过期 | M3U TTL 到期后播放 |
| `free_normal` | 免费订阅正常播放 | 每次播放时触发 |
| `free_expired` | 免费订阅 M3U 过期 | M3U TTL 到期后播放 |
| `fav_normal` | 收藏链接正常播放 | 每次播放时触发 |
| `fav_expired` | 收藏 M3U 过期 | M3U TTL 到期后播放 |

### 5.2 需删除的操作类型

| 操作类型 | 旧用途 | 处理 |
|---------|-------|------|
| `code_expired` | 卡密过期 | 删除 |
| `code_unauth` | IP 未授权 | 删除 |
| `copy_link_normal` | IP 直连正常 | 删除 |
| `copy_link_ip_limit` | IP 直连超限 | 删除 |

## 六、管理后台设置

### 6.1 新增设置项

| 设置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `m3u_ttl_hours` | number | 72 | M3U 有效期（小时） |

### 6.2 广告配置界面

- 新增 6 个操作类型配置项
- 删除 4 个旧操作类型配置项

## 七、数据兼容性

### 7.1 过渡策略

1. 部署新代码后，旧的 M3U 仍可使用（直到 TTL 到期）
2. TTL 到期后，用户下载新 M3U，自动走新逻辑
3. 建议在更新日志中说明

### 7.2 旧 `/play/{link_id}/{hash}` 链接

- **废弃**，不再生成新链接
- 已有链接自然过期后不再可用

## 八、D1 数据库表设计

### 8.1 新增表：VIP 每日 IP 记录

```sql
CREATE TABLE IF NOT EXISTS vip_ip_daily (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  date TEXT NOT NULL,
  ips TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(code, date)
);
CREATE INDEX IF NOT EXISTS idx_vip_ip_daily_code_date ON vip_ip_daily(code, date);
```

### 8.2 新增表：IP 每频道播放次数

```sql
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
CREATE INDEX IF NOT EXISTS idx_play_counts_ip_lookup ON play_counts_ip(code, ip, channel_hash, date);
```

## 九、存储估算

假设：
- 总频道数：10,000
- M3U 平均大小：约 500KB
- 3 个 M3U 文件

| 内容 | 大小 |
|------|------|
| m3u_vip | ~500KB |
| m3u_free | ~50KB（10%频道） |
| m3u_fav | ~500KB |
| **总计** | ~1MB |

Cloudflare KV 免费版限制：
- 存储：1GB
- 每月读取：100,000 次

完全满足需求。
