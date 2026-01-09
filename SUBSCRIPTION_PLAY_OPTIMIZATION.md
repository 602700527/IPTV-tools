# 订阅和播放IP限制优化说明

## 概述

本次优化实现了更严格的IP限制机制，确保客户在IP经常变动的情况下（宽带用户）能正常使用，同时有效防止卡密泄露。

**核心优化：使用内存缓存大幅减少数据库读写次数**

## 核心机制

### 1. 订阅IP限制（`/sub/{code}.m3u`）

**规则：**
- 只允许最新的 `{max_ips}` 个IP在30分钟内订阅成功
- 如果IP在30分钟内已存在，则不会重复记录（兼容原有逻辑）
- 超过 `{max_ips}` 限制的新IP将被拒绝
- **所有IP检查都在内存中进行，不查询数据库**

**实现细节：**
```javascript
// 使用内存缓存检查和添加订阅IP
const isAllowed = checkAndAddSubscriptionIP(code, clientIP, today, maxIPs);

if (!isAllowed) {
  return 403; // 拒绝订阅
}
```

### 2. 播放IP验证（`/live/{code}/{hash}`）

**规则：**
- 播放时检查当前IP是否在订阅记录的最新 `{max_ips}` 个IP列表中
- 如果当前IP不在列表中，则拒绝播放
- 必须重新订阅才能更新IP列表
- **所有IP检查都在内存中进行，不查询数据库**

**实现细节：**
```javascript
// 使用内存缓存获取授权的订阅IP列表
const authorizedIPs = getAuthorizedSubscriptionIPs(code, today, maxIPs);

// 检查当前播放IP是否在订阅IP列表中
if (!authorizedIPs.has(clientIP)) {
  return 403; // 拒绝播放
}
```

## 内存缓存机制

### 缓存结构

```javascript
// 订阅IP缓存
const subscriptionIPCache = new Map(); // { "code:date": Set<IP> }

// 订阅IP时间戳
const subscriptionIPTimestamp = new Map(); // { "code:ip": timestamp }
```

### 关键函数

#### 1. `checkAndAddSubscriptionIP(code, ip, date, maxIPs)`

检查并添加订阅IP到缓存，返回是否允许订阅：

```javascript
export function checkAndAddSubscriptionIP(code, ip, date, maxIPs) {
  const cacheKey = `${code}:${date}`;
  const timestampKey = `${code}:${ip}`;
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  // 获取或创建IP集合
  if (!subscriptionIPCache.has(cacheKey)) {
    subscriptionIPCache.set(cacheKey, new Set());
  }

  const ipSet = subscriptionIPCache.get(cacheKey);

  // 检查IP是否在30分钟内已存在
  const lastTimestamp = subscriptionIPTimestamp.get(timestampKey);
  if (lastTimestamp && now - lastTimestamp < thirtyMinutes) {
    // 30分钟内已存在，允许但不更新时间戳
    return true;
  }

  // 检查是否超过最大IP数限制
  if (ipSet.size >= maxIPs) {
    return false;
  }

  // 新IP或30分钟后的旧IP，添加到缓存
  ipSet.add(ip);
  subscriptionIPTimestamp.set(timestampKey, now);
  return true;
}
```

#### 2. `getAuthorizedSubscriptionIPs(code, date, maxIPs)`

获取授权的订阅IP列表（用于播放验证）：

```javascript
export function getAuthorizedSubscriptionIPs(code, date, maxIPs) {
  const cacheKey = `${code}:${date}`;
  const ipSet = subscriptionIPCache.get(cacheKey);

  if (!ipSet) {
    return new Set();
  }

  // 过滤出30分钟内的IP，并按时间戳排序，取最新的maxIPs个
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  const validIPs = [];
  for (const ip of ipSet) {
    const timestampKey = `${code}:${ip}`;
    const lastTimestamp = subscriptionIPTimestamp.get(timestampKey);

    if (lastTimestamp && now - lastTimestamp < thirtyMinutes) {
      validIPs.push({ ip, timestamp: lastTimestamp });
    }
  }

  // 按时间戳降序排序，取最新的maxIPs个
  validIPs.sort((a, b) => b.timestamp - a.timestamp);
  const latestIPs = validIPs.slice(0, maxIPs).map(item => item.ip);

  return new Set(latestIPs);
}
```

#### 3. `cleanupExpiredSubscriptionIPs()`

清理过期的订阅IP缓存：

```javascript
export function cleanupExpiredSubscriptionIPs() {
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  let cleanedCount = 0;

  for (const [cacheKey, ipSet] of subscriptionIPCache.entries()) {
    const [code, date] = cacheKey.split(':');

    // 检查每个IP的时间戳
    const toRemove = [];
    for (const ip of ipSet) {
      const timestampKey = `${code}:${ip}`;
      const lastTimestamp = subscriptionIPTimestamp.get(timestampKey);

      if (!lastTimestamp || now - lastTimestamp >= thirtyMinutes) {
        toRemove.push(ip);
        subscriptionIPTimestamp.delete(timestampKey);
        cleanedCount++;
      }
    }

    // 从集合中移除过期IP
    toRemove.forEach(ip => ipSet.delete(ip));

    // 如果集合为空，删除整个缓存项
    if (ipSet.size === 0) {
      subscriptionIPCache.delete(cacheKey);
    }
  }

  return cleanedCount;
}
```

## 缓存刷新机制

### 刷新间隔

- **10分钟刷新一次**（与播放计数缓存保持一致）

### 刷新过程

1. **清理过期IP**：清理30分钟过期的订阅IP
2. **批量写入数据库**：只写入有变动的数据
3. **清空内存缓存**：写入完成后清空缓存
4. **备份到KV**：防止数据丢失

### 数据库表结构

### 表：`subscription_ips`

```sql
CREATE TABLE IF NOT EXISTS subscription_ips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  client_ip TEXT NOT NULL,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_date DATE DEFAULT (DATE('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscription_ips_code_date ON subscription_ips(code, created_date);
CREATE INDEX IF NOT EXISTS idx_subscription_ips_code_ip_date ON subscription_ips(code, client_ip, created_date);
```

**用途：**
- 每10分钟从内存缓存刷新到数据库
- 用于历史记录和数据分析
- Worker重启后可以从数据库恢复（可选）

## 性能优化对比

### 优化前（每次都查询数据库）

**订阅请求：**
```
1. 查询数据库：SELECT DISTINCT client_ip FROM subscription_ips WHERE ...
2. 判断IP是否在30分钟内已存在
3. 如果不存在，检查是否超过max_ips限制
4. 插入数据库：INSERT INTO subscription_ips ...
```

**播放请求：**
```
1. 查询数据库：SELECT DISTINCT client_ip FROM subscription_ips WHERE ... LIMIT ?
2. 判断当前IP是否在授权列表中
```

**问题：**
- 每次订阅/播放都要查询数据库
- 高并发时数据库压力大
- 响应时间长

### 优化后（使用内存缓存）

**订阅请求：**
```
1. 从内存Map中读取：subscriptionIPCache.get(`${code}:${date}`)
2. 检查时间戳：subscriptionIPTimestamp.get(`${code}:${ip}`)
3. 判断是否在30分钟内
4. 更新内存缓存（O(1)操作）
```

**播放请求：**
```
1. 从内存Map中读取：subscriptionIPCache.get(`${code}:${date}`)
2. 过滤30分钟内的IP
3. 按时间戳排序，取最新的max_ips个
4. 检查当前IP是否在列表中
```

**优势：**
- ✅ 所有操作都在内存中，响应极快
- ✅ 不查询数据库，减少数据库压力
- ✅ 每10分钟才批量写入一次数据库
- ✅ 写入时只写入有变动的数据
- ✅ 自动清理过期IP，缓存不会无限增长

## 使用场景分析

### 场景1：宽带用户IP经常变动

**假设：**
- 客户的 `max_ips = 3`
- 客户IP经常变动，但不会同时有多个IP

**效果：**
- 客户订阅成功，IP记录到数据库
- IP变动后，客户重新订阅，新IP加入列表
- 因为只有1个IP在使用，所以始终在 `{max_ips}` 限制内
- 播放验证通过，客户可以正常使用

### 场景2：卡密泄露给10个人

**假设：**
- 客户的 `max_ips = 3`
- 客户将订阅地址泄露给10个人
- 10个人同时尝试订阅

**效果：**
- 前3个IP订阅成功，记录到数据库
- 后7个IP订阅时，检测到已超过 `{max_ips}` 限制，被拒绝
- 前3个IP的播放请求通过验证
- 后7个IP的播放请求被拒绝（IP不在订阅列表中）
- 如果客户自己IP变动，需要重新订阅

### 场景3：只分享播放地址（不分享订阅地址）

**假设：**
- 客户的 `max_ips = 3`
- 客户订阅成功，IP1记录到数据库
- 客户将播放地址泄露给其他人

**效果：**
- 客户的播放请求通过验证（IP1在订阅列表中）
- 其他人的播放请求被拒绝（他们的IP不在订阅列表中）
- 需要重新订阅才能更新IP列表

## 关键特性

### 1. 30分钟窗口期

- 订阅IP只在30分钟内有效
- 30分钟后，旧IP自动失效
- 这样可以避免IP积累过多

### 2. 只记录新IP

- 如果IP在30分钟内已存在，不会重复记录
- 减少数据库写入压力

### 3. 播放和订阅解耦

- 播放验证只检查IP是否在订阅记录中
- 不依赖播放日志中的IP记录
- 移除了旧的IP并发检测逻辑

### 4. 缓存策略

- 订阅成功响应缓存12小时
- 播放成功响应缓存5分钟
- 错误响应缓存时间较短，确保状态变更快速生效

## 兼容性说明

### 保留的功能

- 每日订阅请求次数限制（20次/天）
- 每个频道每日播放次数限制（100次/频道/天）
- 超过播放次数自动封禁卡密（7天）
- IP黑名单机制

### 移除的功能

- 旧的IP并发检测逻辑（基于 `play_logs` 表）
- 播放时记录IP到 `play_logs` 表

## 配置说明

### 卡密配置

在创建或修改卡密时，可以设置 `max_ips` 参数：

```javascript
// 创建卡密
{
  code: "ABC123",
  max_ips: 3  // 允许最多3个不同IP
}

// 修改卡密
UPDATE codes SET max_ips = 5 WHERE code = 'ABC123';
```

### 系统默认值

- 如果不设置 `max_ips`，默认值为 3

## 测试建议

### 1. 测试订阅限制

```bash
# 使用不同IP订阅
curl http://your-worker.com/sub/ABC123.m3u  # IP1: 成功
curl http://your-worker.com/sub/ABC123.m3u  # IP2: 成功
curl http://your-worker.com/sub/ABC123.m3u  # IP3: 成功
curl http://your-worker.com/sub/ABC123.m3u  # IP4: 失败 (Too many unique IPs)
```

### 2. 测试播放验证

```bash
# 使用IP1订阅
curl http://your-worker.com/sub/ABC123.m3u  # IP1: 成功

# 使用IP1播放
curl http://your-worker.com/live/ABC123/abc12345  # IP1: 成功

# 使用IP2播放（未订阅）
curl http://your-worker.com/live/ABC123/abc12345  # IP2: 失败 (IP not authorized)
```

### 3. 测试30分钟窗口

```bash
# 时间0: IP1订阅
curl http://your-worker.com/sub/ABC123.m3u  # 成功

# 时间29分钟: IP1再次订阅
curl http://your-worker.com/sub/ABC123.m3u  # 成功 (30分钟内不重复记录)

# 时间31分钟: IP1再次订阅
curl http://your-worker.com/sub/ABC123.m3u  # 成功 (30分钟后重新记录)

# 时间32分钟: IP4订阅（IP1已过期）
curl http://your-worker.com/sub/ABC123.m3u  # 成功 (窗口期已过)
```

## 性能优化

### 1. 数据库索引

已创建以下索引以提升查询性能：

```sql
CREATE INDEX idx_subscription_ips_code_date ON subscription_ips(code, created_date);
CREATE INDEX idx_subscription_ips_code_ip_date ON subscription_ips(code, client_ip, created_date);
```

### 2. 查询优化

- 使用 `DISTINCT` 去重，减少数据传输
- 使用 `ORDER BY subscribed_at DESC` 确保获取最新IP
- 使用 `LIMIT` 限制返回记录数

### 3. 异步写入

- 使用 `ctx.waitUntil()` 异步写入数据库
- 不阻塞主请求流程

## 注意事项

1. **时间精度**：30分钟窗口期基于服务器时间，确保服务器时钟准确
2. **IP获取**：使用 `CF-Connecting-IP` 或 `X-Forwarded-For` 获取真实IP
3. **数据库清理**：建议定期清理过期的 `subscription_ips` 记录（如90天前的记录）
4. **监控告警**：建议监控订阅失败率，及时发现异常情况

## 总结

本次优化实现了以下目标：

✅ 宽带用户IP经常变动时能正常使用
✅ 防止卡密泄露给多人使用
✅ 防止只分享播放地址
✅ 兼容原有优化逻辑（只记录新IP）
✅ 保持系统性能和稳定性
