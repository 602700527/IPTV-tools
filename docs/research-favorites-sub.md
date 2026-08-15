# 需求调研：VIP 用户专属 M3U 订阅链接

## 核心需求
VIP 用户的收藏夹数据 → 专属 M3U 订阅链接

---

## 现状分析

### 已有功能
1. **VIP 收藏 API** (`handlers/favorites-api.js`)
   - `GET /api/favorites` — 返回 favorites 数组
   - `POST /api/favorites` — 添加收藏
   - `DELETE /api/favorites` — 移除收藏
   - `PUT /api/favorites/sync` — 批量同步

2. **M3U 生成** (`handlers/sub.js`)
   - `buildM3uContent(channels, format, host, token, domainBlacklist)`
   - 返回标准 #EXTM3U 格式
   - 支持 group-logo、headers 等字段

3. **订阅路由** (`worker.js`)
   - `/sub/{code}.m3u` — 按 activation code 查询
   - `/live/vip/{token}/{hash}` — 单个频道流

### 数据模型
- Favorites: `[{hash, name, logo, group}]` (localStorage 存储)
- 订阅: 按 activation code 绑定 channels 表
- VIP 状态: `codes` 表 joined with `user_orders`

---

## 方案设计

### 方案 A：新增独立订阅链接（推荐）

**URL**: `/favorites/{user_id}.m3u` 或 `/sub/fav/{code}.m3u`

**流程**:
```
用户访问 /favorites/{user_id}.m3u
  ↓
验证 VIP 状态
  ↓
从 localStorage 或服务端获取 favorites
  ↓
查询 channels 表获取完整流 URL
  ↓
生成 M3U 内容
  ↓
返回
```

**优点**:
- 简洁，一个链接搞定
- 与现有 `/sub/{code}.m3u` 风格一致
- 后端缓存友好

**实现复杂度**: 中等
- 需要新建 handler `handlers/favorites-sub.js`
- 需要路由注册
- 需要登录验证（Cookie or Token）

---

### 方案 B：动态 API 端点

**URL**: `/api/favorites/stream.m3u`

**流程**:
```
POST /api/favorites/stream.m3u
Body: { favorites: [...] }
  ↓
验证 VIP
  ↓
查询 channels 表
  ↓
生成 M3U
  ↓
返回
```

**优点**:
- 灵活，可以传任意 favorites
- 不需要额外的路由

**缺点**:
- 用户需要手动发送请求
- 不太适合 IPTV 播放器直接集成

---

### 方案 C：前端拼接（最简单但体验差）

**流程**:
```
前端获取 favorites
前端查询每个 channel 的 stream URL
前端拼接 M3U 字符串
用户复制粘贴到播放器
```

**缺点**:
- 用户体验差
- 需要多次 API 请求
- 不适合 IPTV 播放器

---

## 推荐方案：方案 A

### 技术细节

#### 1. 新建文件: `handlers/favorites-sub.js`

```javascript
import { isVIPUser } from './auth.js';
import { getUserFavorites } from '../database.js';

export async function handleFavoritesSub(request, env, ctx) {
  // 1. 验证用户身份（Cookie or Token）
  // 2. 验证 VIP 状态
  // 3. 获取 favorites 列表
  // 4. 查询 channels 表获取完整信息
  // 5. 生成 M3U 内容
  // 6. 返回
}
```

#### 2. 路由注册: `worker.js`

```javascript
} else if (path.startsWith('/favorites/')) {
  const userId = path.split('/').pop().replace('.m3u', '');
  return await handleFavoritesSub(request, env, ctx);
}
```

#### 3. 数据查询逻辑

```javascript
// favorites 格式: [{hash, name, logo, group}]
// channels 表字段: channel_hash, channel_name, url, group_title, logo

// 查询 SQL:
SELECT * FROM channels 
WHERE channel_hash IN (/* favorites hashes */)
```

#### 4. M3U 生成

复用 `handlers/sub.js` 的 `buildM3uContent()` 函数：
```javascript
const m3u = buildM3uContent(channels, 'm3u', origin, token, blacklist);
```

#### 5. 用户提示

在订阅页添加文案：
> "您的专属订阅链接: `https://iptv-search.com/favorites/{id}.m3u`"
> 
> 支持一键复制到剪贴板

---

## 安全考虑

1. **用户隔离**: 只能访问自己的 favorites
2. **VIP 验证**: 非 VIP 返回 403
3. **频率限制**: 防止滥用
4. **缓存**: 短期缓存结果（如 5 分钟）

---

## 开发步骤

1. [ ] 创建 `handlers/favorites-sub.js`
2. [ ] 注册路由到 `worker.js`
3. [ ] 实现用户认证（Cookie parse）
4. [ ] 实现 VIP 验证
5. [ ] 实现 favorites 查询 + channels 关联
6. [ ] 集成 M3U 生成
7. [ ] 前端展示订阅链接
8. [ ] 测试 + 部署

---

## 参考资料

- `handlers/sub.js` — 现有订阅处理器
- `handlers/favorites-api.js` — 现有收藏 API
- `handlers/auth.js` — 认证逻辑
- `database.js` — 数据库操作
