# 免费订阅系统使用指南

## 功能概述

免费订阅系统提供以下功能：

1. **无需注册的免费订阅** - 使用IP+浏览器指纹自动识别用户
2. **30%随机频道** - 每天随机提供30%的活跃频道
3. **IP绑定保护** - 每个订阅绑定到单个IP，防止分享和倒卖
4. **每日签到续期** - 通过签到延长订阅时长，增加网站流量
5. **连续签到奖励** - 连续签到7天奖励2天，30天奖励10天

## 技术架构

### 文件结构

```
c:/Users/60270/Desktop/cfworker2/
├── utils/
│   └── fingerprint.js          # 浏览器指纹生成工具
├── handlers/
│   ├── freesub.js             # 免费订阅核心逻辑
│   ├── freesub-api.js          # 免费订阅API处理
│   └── checkin.js             # 签到功能处理
├── freesub-page.js            # 免费订阅前端页面
├── freesub_tables.sql         # 数据库表结构
├── test-freesub.js            # 测试脚本
└── worker.js                  # 主路由入口（已更新）
```

### 数据库表

#### free_subscriptions（免费订阅表）
- `id` - 主键
- `sub_id` - 订阅ID（唯一）
- `ip` - 绑定的IP地址
- `fingerprint` - 浏览器指纹哈希
- `fingerprint_components` - 指纹组件详情（JSON）
- `expired_at` - 过期时间
- `total_days` - 总天数
- `consecutive_days` - 连续签到天数
- `ip_change_count` - IP变化计数
- `ip_updated_at` - IP更新时间
- `last_checkin` - 最后签到时间
- `created_at` - 创建时间
- `updated_at` - 更新时间

#### checkin_records（签到记录表）
- `id` - 主键
- `subscription_id` - 订阅ID（外键）
- `checkin_date` - 签到日期
- `reward_days` - 奖励天数
- `consecutive_days` - 连续签到天数
- `created_at` - 创建时间

## API接口

### 1. 创建/获取免费订阅

**接口**: `POST /api/freesub/create`

**请求体**:
```json
{
  "fingerprint": "abc123...",
  "fingerprintComponents": {
    "screen": {...},
    "browser": {...},
    "timezone": {...}
  }
}
```

**响应**:
```json
{
  "success": true,
  "subscription": {
    "id": 1,
    "subId": "free_xxxxxx",
    "ip": "1.2.3.4",
    "expiredAt": "2024-01-17T00:00:00.000Z",
    "totalDays": 7,
    "consecutiveDays": 1
  }
}
```

### 2. 每日签到

**接口**: `POST /api/freesub/checkin`

**请求体**:
```json
{
  "subId": "free_xxxxxx",
  "fingerprint": "abc123..."
}
```

**响应**:
```json
{
  "success": true,
  "rewardDays": 1,
  "consecutiveDays": 2,
  "isConsecutive": true,
  "expiredAt": "2024-01-18T00:00:00.000Z",
  "totalDays": 8,
  "message": "连续签到2天，获得1天！"
}
```

### 3. 获取订阅信息

**接口**: `POST /api/freesub/info`

**请求体**:
```json
{
  "subId": "free_xxxxxx",
  "fingerprint": "abc123..."
}
```

**响应**:
```json
{
  "success": true,
  "subscription": {...},
  "stats": {
    "totalCheckIns": 10,
    "totalRewardDays": 15,
    "maxConsecutive": 7,
    "thisMonthCheckIns": 5
  },
  "recentCheckIns": [...]
}
```

### 4. 获取订阅M3U

**接口**: `GET /api/freesub/{subId}.m3u?fp={fingerprint}`

**响应**: M3U格式内容

## 前端使用

### 访问免费订阅页面

在浏览器中访问:
```
https://your-domain.com/freesub
```

### 前端集成

在现有页面中添加免费订阅入口:

```html
<a href="/freesub" class="btn-free-sub">
  🎁 免费订阅
</a>
```

### JavaScript集成

```javascript
// 生成指纹
async function generateFingerprint() {
  const fingerprintComponents = {
    screen: { width: screen.width, height: screen.height },
    browser: { language: navigator.language, platform: navigator.platform },
    timezone: { offset: new Date().getTimezoneOffset() }
  };

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(fingerprintComponents));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 创建订阅
const fingerprint = await generateFingerprint();
const response = await fetch('/api/freesub/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fingerprint, fingerprintComponents })
});
const { subscription } = await response.json();

// 订阅地址
const subUrl = `${location.origin}/api/freesub/${subscription.subId}.m3u?fp=${fingerprint}`;
```

## 签到奖励规则

- 每日签到：+1天
- 连续签到7天：+2天
- 连续签到30天：+10天

## IP绑定机制

1. 首次创建订阅时绑定当前IP
2. 允许IP变化（如家庭网络IP变动），但限制3次
3. IP变化时通过指纹验证身份
4. 超过3次IP变化，订阅将被锁定

## 频道随机算法

- 每天根据日期生成随机种子
- 使用种子从活跃频道中随机选择30%
- 同一天内所有请求返回相同的频道列表
- 第二天自动更新频道列表

## 测试

### 在浏览器控制台运行测试

1. 打开网站首页
2. 按F12打开开发者工具
3. 加载测试脚本:
```javascript
// 在控制台执行
await fetch('/test-freesub.js')
  .then(r => r.text())
  .then(eval);
```

4. 运行所有测试:
```javascript
await testFreeSub.runAllTests();
```

### 单独测试

```javascript
// 测试1: 生成指纹
const { fingerprint } = await testFreeSub.testGenerateFingerprint();

// 测试2: 创建订阅
const sub = await testFreeSub.testCreateFreeSubscription(fingerprint, {...});

// 测试3: 签到
await testFreeSub.testCheckIn(sub.subId, fingerprint);

// 测试4: 获取M3U
await testFreeSub.testGetSubscriptionM3U(sub.subId, fingerprint);
```

## 防护机制

### IP防分享

- 每个订阅绑定单个IP
- 检测到不同IP访问时要求指纹验证
- IP变化超过3次后锁定订阅

### 指纹防伪造

- 使用屏幕分辨率、语言、平台、时区等多维度特征
- SHA-256哈希确保唯一性
- 允许一定程度的特征变化（如调整窗口大小）

### 签到防刷

- 每天每个订阅只能签到一次
- 使用数据库UNIQUE约束确保唯一性

## 注意事项

1. **数据备份**: 定期备份D1数据库
2. **监控日志**: 关注IP变化和可疑活动
3. **性能优化**: 考虑使用KV缓存订阅数据
4. **用户体验**: 提供清晰的使用说明和帮助信息

## 扩展功能建议

1. **邀请奖励**: 邀请好友注册赠送天数
2. **活动奖励**: 特殊日期签到额外奖励
3. **会员升级**: 免费用户可升级为付费用户
4. **数据统计**: 订阅转化率、签到率等数据看板
