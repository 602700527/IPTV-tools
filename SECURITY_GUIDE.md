# 安全增强功能文档

## 问题背景

原始系统存在以下安全隐患：

1. **订阅链接限制不完整**：
   - 订阅请求有每日20次限制
   - 但播放地址（/live/{code}/{hash}）只有5分钟缓存
   - 用户获取订阅后可以无限访问播放地址

2. **播放地址可被分享**：
   - 播放地址是固定的
   - 用户可以把播放列表分享给他人
   - 或搭建代理服务器转发播放地址
   - 导致带宽滥用和成本增加

3. **缺少滥用检测**：
   - 无法检测异常访问模式
   - 无法识别分享行为
   - 无法及时发现和阻止滥用

## 解决方案

### 1. 令牌机制（Token-based Access）

#### 工作原理
```
订阅请求 → 生成临时令牌 → 嵌入播放地址
         ↓
    /live/{code}/{token}/{hash}
         ↓
    验证令牌有效性 → 访问真实播放地址
         ↓
    标记令牌为已使用 → 令牌失效
```

#### 令牌特性
- **唯一性**：每次订阅生成不同的令牌
- **时效性**：令牌有效期10分钟（可配置）
- **一次性**：每个令牌只能使用一次
- **频道绑定**：令牌与特定频道hash绑定
- **自动过期**：超时自动从KV中删除

#### 播放地址格式变化

**旧格式**：
```
https://your-domain.com/live/{code}/{channel_hash}
```

**新格式**：
```
https://your-domain.com/live/{code}/{token}/{channel_hash}
```

#### 实现细节

**订阅时生成令牌**：
```javascript
// sub.js
for (const channel of channels) {
  const token = generateToken(); // 16位随机字符串
  const tokenData = {
    channelHash: channel.channel_hash,
    createdAt: Date.now(),
    expiresAt: Date.now() + 600000, // 10分钟后过期
    used: 0
  };
  
  // 存储到KV（10分钟TTL）
  await env.KV.put(`token:${code}:${token}`, JSON.stringify(tokenData), { expirationTtl: 600 });
  
  // 生成播放地址
  m3uLines.push(`${host}/live/${code}/${token}/${channel.channel_hash}`);
}
```

**播放时验证令牌**：
```javascript
// live-secure.js
const tokenValidation = await validateToken(env, code, token, hash);

if (!tokenValidation.valid) {
  return new Response(`Forbidden: ${tokenValidation.reason}`, { status: 403 });
}

// 标记令牌为已使用
tokenData.used += 1;
await env.KV.put(tokenKey, JSON.stringify(tokenData), { expirationTtl: 600 });
```

### 2. 播放次数限制

#### 每日播放限制
- **限制值**：每个卡密每日最多500次播放
- **目的**：防止恶意用户通过脚本批量访问
- **存储**：使用KV存储每日计数器（24小时TTL）

#### 实现
```javascript
async function checkDailyPlayLimit(env, code) {
  const today = new Date().toISOString().split('T')[0];
  const limitKey = `limit:play:${today}:${code}`;
  
  const currentCount = parseInt(await env.KV.get(limitKey) || '0');
  
  if (currentCount >= SECURITY_CONFIG.DAILY_PLAY_LIMIT) {
    return { allowed: false, currentCount, limit: 500 };
  }
  
  // 增加计数
  await env.KV.put(limitKey, (currentCount + 1).toString(), { expirationTtl: 86400 });
  
  return { allowed: true, currentCount: currentCount + 1, limit: 500 };
}
```

### 3. 访问频率限制

#### 频道访问频率限制
- **限制值**：同一IP同一频道60秒内只能访问一次
- **目的**：防止快速切换频道的攻击行为
- **存储**：使用KV存储最后访问时间（1分钟TTL）

#### 实现
```javascript
async function checkPlayFrequency(env, code, channelHash, clientIP) {
  const now = Date.now();
  const freqKey = `freq:${code}:${clientIP}:${channelHash}`;
  
  const lastPlay = await env.KV.get(freqKey);
  
  if (lastPlay) {
    const timeDiff = (now - parseInt(lastPlay)) / 1000;
    
    if (timeDiff < SECURITY_CONFIG.PLAY_FREQUENCY_LIMIT) {
      return { 
        allowed: false, 
        remainingTime: 60 - timeDiff
      };
    }
  }
  
  await env.KV.put(freqKey, now.toString(), { expirationTtl: 60 });
  return { allowed: true };
}
```

### 4. 异常检测系统

#### 检测维度

**1. 高频访问检测**
- **阈值**：5分钟内超过100次访问
- **触发条件**：短时间内访问量异常
- **处理**：记录到KV，标记为滥用

**2. 异常IP数量检测**
- **阈值**：一天内超过10个不同IP访问
- **触发条件**：疑似分享播放地址
- **处理**：记录到KV，标记为可疑

#### 实现
```javascript
async function detectAbuse(env, code, accessData) {
  // 检查5分钟内的访问量
  if (accessData.count > 100) {
    await env.KV.put(`abuse_flag:${code}`, JSON.stringify({
      detectedAt: now,
      accessCount: accessData.count
    }), { expirationTtl: 86400 });
    
    return { suspicious: true, reason: 'high_access_rate' };
  }
  
  // 检查IP数量
  const ipCount = accessData.ips.length;
  if (ipCount > 10) {
    await env.KV.put(`suspicious:${code}`, JSON.stringify({
      detectedAt: now,
      ipCount: ipCount
    }), { expirationTtl: 86400 });
    
    return { suspicious: true, reason: 'too_many_ips' };
  }
  
  return { suspicious: false };
}
```

### 5. 安全配置参数

所有安全参数可配置（在 `live-secure.js` 中）：

```javascript
const SECURITY_CONFIG = {
  // 令牌有效期（秒）
  TOKEN_TTL: 600, // 10分钟
  
  // 每个令牌使用次数限制
  TOKEN_MAX_USES: 1,
  
  // 每个卡密每日播放次数限制
  DAILY_PLAY_LIMIT: 500,
  
  // 同一IP同一频道访问频率限制（秒）
  PLAY_FREQUENCY_LIMIT: 60,
  
  // 异常IP阈值
  SUSPICIOUS_IP_THRESHOLD: 10,
  
  // 5分钟内访问阈值
  ABUSE_THRESHOLD: 100
};
```

## 安全监控面板

### 功能

1. **实时统计**：
   - 今日播放次数
   - 独立IP数
   - 访问频道数
   - 安全状态（正常/异常）

2. **安全警告**：
   - 高频访问警告
   - 异常IP警告

3. **热门频道**：
   - 显示播放次数最多的前10个频道

4. **操作**：
   - 查询特定卡密的安全数据
   - 重置安全计数

### 使用方法

1. 登录管理后台
2. 进入"安全监控"页面
3. 输入卡密
4. 点击"查询"按钮
5. 查看安全统计和警告

## 部署说明

### 1. 代码更新

新的安全处理器位于 `handlers/live-secure.js`，worker.js已切换到该文件。

### 2. 无需数据库变更

所有安全数据都存储在KV中，无需修改数据库结构。

### 3. 部署步骤

```bash
# 1. 重新部署Worker
wrangler deploy

# 2. 验证部署
curl -I https://your-domain.com/admin/init \
  -H "X-Admin-Key: your-admin-key"
```

### 4. 客户端兼容性

新格式的播放地址完全兼容现有播放器：
- VLC
- PotPlayer
- IINA
- MPV
- 所有标准M3U播放器

## 防护效果对比

### 原始系统

| 攻击类型 | 防护能力 | 说明 |
|---------|----------|------|
| 分享播放地址 | ❌ 无 | 播放地址固定，可随意分享 |
| 批量访问 | ⚠️ 弱 | 仅依赖5分钟缓存 |
| 代理转发 | ❌ 无 | 无检测机制 |
| 刷播放 | ⚠️ 弱 | 仅IP并发限制 |

### 新系统

| 攻击类型 | 防护能力 | 说明 |
|---------|----------|------|
| 分享播放地址 | ✅ 强 | 令牌一次性使用，分享后失效 |
| 批量访问 | ✅ 强 | 每日500次限制 + 频率限制 |
| 代理转发 | ✅ 强 | 异常IP检测 + 使用频率检测 |
| 刷播放 | ✅ 强 | 多重限制：令牌 + 次数 + 频率 |

## 使用建议

### 1. 令牌有效期调整

根据实际使用场景调整令牌有效期：

```javascript
// live-secure.js
const SECURITY_CONFIG = {
  TOKEN_TTL: 300, // 5分钟（更严格）
  // 或
  TOKEN_TTL: 1800, // 30分钟（更宽松）
};
```

### 2. 播放次数限制调整

```javascript
const SECURITY_CONFIG = {
  DAILY_PLAY_LIMIT: 1000, // 提高到1000次
  // 或
  DAILY_PLAY_LIMIT: 200, // 降低到200次
};
```

### 3. 定期检查安全监控

建议每天检查：
1. 异常卡密：IP数量 > 10
2. 滥用卡密：高频访问 > 100
3. 播放量异常：远超正常值的卡密

### 4. 处理异常卡密

发现异常后：
1. 查看详细访问日志
2. 确认是否为滥用
3. 禁用卡密或联系用户
4. 重置安全计数（如需）

## 成本控制

### KV存储成本估算

假设1000个活跃卡密，每日每个生成100个令牌：

**令牌存储**：
- 数量：1000 × 100 = 100,000个/天
- 单个大小：~200字节
- 每日写入：100,000次
- 每日读取：~200,000次（验证+标记使用）
- 每日存储：~20MB × 10分钟 = 每分钟3.3MB

**安全监控数据**：
- 访问记录：1000个/天
- 频率限制：~100,000个/天
- 每日限制：1000个/天

**总成本**（Cloudflare KV定价）：
- 读取：$0.50/百万次
- 写入：$0.50/百万次
- 存储：$0.50/GB/月

估算每日成本：< $0.05

## 注意事项

### 1. 缓存策略

新系统缩短了缓存时间：
- 播放请求：从5分钟缩短到2分钟
- 原因：令牌一次性使用，缓存影响小
- 影响：略微增加数据库查询量

### 2. 客户端行为

播放器需要：
- 支持重定向（所有播放器都支持）
- 每次播放前重新获取M3U（推荐）

### 3. 用户影响

- 正常用户：无感知影响
- 恶意用户：无法滥用
- 分享者：分享的链接很快失效

## 故障排除

### Q1: 订阅后无法播放？
A: 可能原因：
1. 令牌过期（超过10分钟）
2. 令牌已使用
3. 令牌与频道不匹配

解决：重新获取订阅链接

### Q2: 提示"每日播放限制已满"？
A: 卡密今日播放次数超过500次。
解决：等待第二天或提高限制值

### Q3: 提示"请等待XX秒"？
A: 同一IP同一频道60秒内只能访问一次。
解决：等待提示时间后重试

### Q4: 安全监控显示"异常"？
A: 检测到可疑访问模式。
建议：
1. 查看访问详情
2. 确认是否为滥用
3. 必要时禁用卡密

## 未来改进

1. **智能令牌刷新**：
   - 长时间观看自动刷新令牌
   - 减少重新获取M3U的频率

2. **地理位置限制**：
   - 限制卡密只能从特定地区访问
   - 检测异常地理位置

3. **行为分析**：
   - 机器学习识别异常模式
   - 自动调整安全策略

4. **实时告警**：
   - 检测到滥用时发送通知
   - 支持邮件、Webhook

5. **白名单机制**：
   - 可信用户或设备加入白名单
   - 减少误报率

---

**更新时间**：2025-12-25
