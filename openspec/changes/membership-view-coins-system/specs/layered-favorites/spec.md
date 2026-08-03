# 分层收藏系统 / Layered Favorites System

## 概述 / Overview

收藏存储策略因用户类型不同：普通用户存储在本地（localStorage），VIP用户存储在云端（D1）。

---

## 一、显示和交互位置 / Display & Interaction Locations

### 1.1 收藏入口

```
频道列表（category-page）
├── 每个频道右侧：有"收藏"按钮（心形图标）
├── 点击后：
│   ├── 已登录 + VIP → 调用 /api/favorites（云端）
│   ├── 已登录 + 普通用户 → 存储localStorage（本地）
│   └── 未登录 → 提示"登录后保存收藏" → 跳转登录
└── 已收藏状态：心形图标变红
```

### 1.2 收藏页面（/favorites）

```
收藏页面
├── 已登录用户
│   ├── VIP用户
│   │   ├── 显示"云端同步"标签
│   │   ├── 读取 /api/favorites（D1）
│   │   └── 可跨设备查看
│   └── 普通用户
│       ├── 显示"本地存储"标签
│       └── 读取 localStorage（仅当前浏览器）
└── 未登录用户 → 提示登录
```

### 1.3 VIP状态判断

```
用户VIP状态判断：
    ↓
读取 users.vip_expired_at
    ↓
vip_expired_at > now() → VIP用户 → 使用D1云端收藏
vip_expired_at <= now() 或为空 → 普通用户 → 使用localStorage
```

### 1.4 VIP降级时的同步

```
VIP用户变为普通用户时：
    ↓
检测到 users.vip_expired_at <= now()
    ↓
读取 D1 中的收藏列表
    ↓
写入 localStorage（作为本地备份）
    ↓
D1中的收藏数据保留不删除
    ↓
用户可在本地继续访问收藏
    ↓
若用户重新成为VIP（vip_expired_at延期），D1收藏仍然存在
```

---

## 二、数据存储格式 / Storage Format

### 2.1 D1数据库存储（VIP用户）

**表结构：**
```sql
CREATE TABLE user_favorites (
  user_id INTEGER NOT NULL,
  channel_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, channel_hash)
);

CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorites_hash ON user_favorites(channel_hash);
```

**数据格式：**
| user_id | channel_hash | created_at |
|---------|-------------|------------|
| 123 | abc123def456 | 2026-05-04T10:30:00Z |
| 123 | def789ghi012 | 2026-05-03T15:20:00Z |

**特点：**
- 只存储 `channel_hash`，不存储完整频道信息
- 频道详细信息通过 `channel_hash` 从缓存/KV获取
- 单行存储，INSERT按需写入

### 2.2 localStorage存储（普通用户）

**Key格式：** `favorites_${user_id}`

**Value格式：** JSON数组
```json
["abc123def456", "def789ghi012", "ghi345jkl678"]
```

---

## 三、读取策略 / Reading Strategy

### 3.1 前端读取流程

```javascript
async function getFavorites(userId, isVIP) {
  if (isVIP) {
    // VIP用户：从D1读取
    const resp = await fetch('/api/favorites');
    const data = await resp.json();
    return {
      storageType: 'cloud',
      favorites: data.favorites  // channel_hash数组
    };
  } else {
    // 普通用户：从localStorage读取
    const localData = localStorage.getItem(`favorites_${userId}`);
    return {
      storageType: 'local',
      favorites: localData ? JSON.parse(localData) : []
    };
  }
}
```

### 3.2 频道信息补全

```javascript
async function getFavoritesWithChannelInfo(userId, isVIP) {
  const { storageType, favorites } = await getFavorites(userId, isVIP);
  
  // 通过channel_hash批量获取频道信息
  const channels = await getChannelsByHashes(favorites);
  
  return {
    storageType,
    favorites: channels.map(ch => ({
      hash: ch.channel_hash,
      name: ch.channel_name,
      logo: ch.logo,
      group: ch.group_title
    }))
  };
}
```

---

## 四、API端点 / API Endpoints

### GET /api/favorites

**前置条件：** 用户已登录且为VIP

**响应:**
```json
{
  "success": true,
  "storage_type": "cloud",
  "favorites": [
    { "hash": "abc123", "added_at": "2026-05-04T10:30:00Z" },
    { "hash": "def456", "added_at": "2026-05-03T15:20:00Z" }
  ]
}
```

**普通用户调用：** 返回403
```json
{
  "success": false,
  "error": "VIP only",
  "message": "云端收藏仅对VIP用户开放"
}
```

### POST /api/favorites

**前置条件：** 用户已登录且为VIP

**请求:**
```json
{
  "channel_hash": "abc123"
}
```

**响应:**
```json
{
  "success": true,
  "added_at": "2026-05-04T18:30:00Z"
}
```

**重复添加：** 幂等操作，已存在时返回成功
```json
{
  "success": true,
  "message": "Already favorited",
  "added_at": "2026-04-01T10:00:00Z"
}
```

### DELETE /api/favorites/:channel_hash

**前置条件：** 用户已登录且为VIP

**响应:**
```json
{
  "success": true
}
```

---

## 四、数据同步策略 / Data Sync Strategy

### 4.1 localStorage写缓冲（节省D1写入）

**核心思想**：VIP用户的所有操作先写入本地，批量同步到D1。

**存储结构**：
```javascript
// localStorage
{
  "vip_favorites_data": ["abc123", "def456", ...],  // 收藏哈希列表
  "vip_favorites_dirty": "true",                     // 是否有未同步的修改
  "vip_favorites_last_sync": "2026-05-04T10:30:00Z" // 上次同步时间
}
```

### 4.2 同步流程

```
用户操作（添加/删除收藏）
    ↓
立即写入 localStorage（乐观更新）
    ↓
标记 dirty = true
    ↓
UI立即更新（无等待）
    ↓
满足以下任一条件时批量同步到D1：
    ├── 距上次同步超过5分钟
    ├── 页面卸载（beforeunload）
    └── 手动触发同步
```

### 4.3 批量同步API

### POST /api/favorites/sync

批量同步本地收藏到云端（覆盖式）。

**请求:**
```json
{
  "favorites": ["abc123", "def456", "ghi789"]
}
```

**响应:**
```json
{
  "success": true,
  "synced_count": 3,
  "synced_at": "2026-05-04T10:35:00Z"
}
```

**说明**：
- 服务端接收完整列表，直接覆盖D1中的数据
- 适用于 infrequent sync（如页面卸载时）
- 不适用于高频操作（会被rate limit）

### POST /api/favorites/batch-update

批量更新（增量式，用于定期同步）。

**请求:**
```json
{
  "add": ["abc123"],
  "remove": ["def456"]
}
```

**响应:**
```json
{
  "success": true,
  "total_count": 2
}
```

### 4.4 同步触发条件

| 触发条件 | 方式 | 说明 |
|----------|------|------|
| 定时同步 | `setInterval(300000)` | 每5分钟检查dirty标记 |
| 页面卸载 | `navigator.sendBeacon` | 确保页面关闭前发送 |
| 手动刷新 | 用户点击"同步"按钮 | 立即同步 |

### 4.5 数据一致性保证

```
读取流程：
    ↓
检查 dirty 标记
    ↓
如果有未同步修改 → 等待同步完成后再读取
    ↓
从 localStorage 读取最新数据
    ↓
返回给UI
```

### 4.6 D1写入次数对比

| 场景 | 无缓冲 | 有缓冲 |
|------|--------|--------|
| 用户添加10个收藏 | 10次D1写入 | 1次D1写入 |
| 用户删除5个收藏 | 5次D1写入 | 1次D1写入 |
| 混合操作（添加+删除） | 多次D1写入 | 1次D1写入 |

**优化效果**：理论上减少90%+的D1写入次数。

---

## 五、业务规则 / Business Rules

1. **普通用户**：所有操作在客户端localStorage处理，API返回403
2. **VIP用户**：读取从localStorage，批量同步到D1
3. **写缓冲**：所有VIP操作先写localStorage，标记dirty，定时/页面卸载时批量同步
4. **仅存哈希**：D1只存储哈希，不存储完整频道数据
5. **升级同步**：用户从普通升级为VIP时，localStorage数据迁移到D1
6. **降级保留**：VIP过期后，D1收藏数据保留，用户可继续通过localStorage访问
7. **重新VIP**：用户重新成为VIP时，D1收藏仍存在，直接恢复云端同步
8. **重复收藏**：相同哈希可重新添加（幂等操作）
9. **删除**：删除操作立即生效，从localStorage移除，同步时从D1移除

---

## 六、前端交互流程 / Frontend Interaction Flow

### 6.1 VIP用户收藏操作（写缓冲模式）

```
用户点击心形图标
    ↓
检测登录状态（未登录 → 跳转登录）
    ↓
检查VIP状态（vip_expired_at > now）
    ↓
VIP用户
    ├── 添加：写入 localStorage + 标记dirty
    ├── 删除：删除localStorage对应项 + 标记dirty
    └── 乐观更新UI（心形立即变红/变灰）
    ↓
检查同步条件（30秒超时 / beforeunload）
    ↓
批量同步到 /api/favorites/sync
```

### 6.2 收藏页面加载

```
用户打开 /favorites
    ↓
检测登录状态（未登录 → 跳转登录）
    ↓
检查VIP状态
    ├── VIP用户
    │   ├── 检查 dirty 标记
    │   ├── 如有未同步 → 先等待同步完成
    │   ├── 从 localStorage 读取收藏列表
    │   └── 显示"云端同步"标签
    └── 普通用户
        ├── 从 localStorage 读取
        └── 显示"本地存储"标签（提示仅当前浏览器可见）
    ↓
获取收藏的channel_hash列表
    ↓
批量获取频道详细信息
    ↓
渲染收藏列表
```

### 6.3 页面卸载同步

```javascript
window.addEventListener('beforeunload', () => {
  if (localStorage.getItem('vip_favorites_dirty') === 'true') {
    const favorites = localStorage.getItem('vip_favorites_data');
    navigator.sendBeacon('/api/favorites/sync', JSON.stringify({ favorites }));
  }
});
```

---

## 七、验收标准 / Acceptance Criteria

- [ ] 普通用户点击收藏按钮存储到localStorage
- [ ] VIP用户点击收藏按钮写入localStorage并标记dirty
- [ ] 普通用户访问收藏页面显示localStorage数据
- [ ] VIP用户访问收藏页面显示localStorage数据
- [ ] 非VIP用户调用 /api/favorites 返回403
- [ ] 普通用户升级VIP时自动同步收藏到D1
- [ ] VIP过期后用户可继续通过localStorage访问收藏（降级备份）
- [ ] 用户重新成为VIP时直接恢复云端同步（D1数据保留）
- [ ] 删除收藏从localStorage正确移除
- [ ] 页面卸载时通过sendBeacon同步到D1
- [ ] 定时30秒同步检查dirty标记
- [ ] 收藏列表显示频道名称、logo、分组信息
- [ ] 收藏按钮状态正确（已收藏/未收藏）

---

## 八、VIP判断实现 / VIP Check Implementation

```javascript
// 前端VIP判断
function isVIP(vipExpiredAt) {
  if (!vipExpiredAt) return false;
  return new Date(vipExpiredAt) > new Date();
}

// 使用
const user = await getUser();
if (isVIP(user.vip_expired_at)) {
  // VIP用户逻辑：使用写缓冲 + 批量同步
} else {
  // 普通用户逻辑：直接localStorage
}
```

---

## 九、API端点完整列表 / API Endpoints Complete List

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/favorites` | GET | 获取收藏列表（VIP only） |
| `/api/favorites` | POST | 添加收藏（VIP only，已废弃，改用sync） |
| `/api/favorites/:hash` | DELETE | 删除收藏（VIP only，已废弃，改用sync） |
| `/api/favorites/sync` | POST | 批量同步（覆盖式，页面卸载时用） |
| `/api/favorites/batch-update` | POST | 批量更新（增量式，定时同步时用） |