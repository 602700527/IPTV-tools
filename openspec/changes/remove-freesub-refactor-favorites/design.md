## Context

现有系统提供免费订阅功能，无需注册即可获取M3U播放列表。收藏功能绑定免费订阅ID（sub_id），数据存储于 `free_subscriptions` 表。

业务目标：
- 移除免费订阅，改为注册制
- 收藏功能分离：普通用户用localStorage（50上限），VIP用户用D1（无限）
- VIP = 现有订阅用户（拥有有效订阅的注册用户）

技术约束：
- Cloudflare Workers 环境（D1 + KV）
- 收藏数据需持久化（D1 for VIP）
- 前端每5分钟同步VIP数据

## Goals / Non-Goals

**Goals:**
- 移除全部免费订阅相关代码和数据表
- 实现本地收藏（localStorage）给普通用户
- 实现VIP无限收藏（D1）给订阅用户
- 50个上限toast提示

**Non-Goals:**
- 不实现签到系统（用户明确不要）
- 不改变现有订阅购买流程
- 不迁移现有免费订阅用户数据（直接作废）

## Decisions

### Decision 1: VIP判断逻辑

**选择**：复用现有 `user_orders` 表判断VIP状态

**理由**：
- 现有订阅用户已有 `user_orders` 记录
- 订阅状态可通过 `expired_at > now()` 判断
- 无需新建VIP标识字段

**替代方案**：
- 新建 `is_vip` 字段 → 增加迁移复杂度
- 基于 `codes` 表 → codes表是卡密，逻辑绕

### Decision 2: 收藏存储格式

**选择**：D1表 `user_favorites`，单一 `favorites` TEXT字段存JSON

**理由**：
- 简单直接，无需多表关联
- JSON格式便于前端直接使用
- D1单条记录最大1MB，足够存储数千hash

**替代方案**：
- `user_favorites` 多行（user_id, channel_hash）→ 查询复杂度增加
- 新建独立KV → 架构不统一

### Decision 3: 普通用户50上限

**选择**：前端硬限制 + toast提示

**理由**：
- localStorage无法服务端校验，纯前端实现
- 达到上限时提示升级VIP，符合商业目标

### Decision 4: VIP数据同步

**选择**：前端每5分钟主动推送变化到D1

**理由**：
- Workers无持久连接，无法服务端推送
- 5分钟粒度平衡数据实时性vs API调用次数

**替代方案**：
- 每次收藏变化立即写D1 → 高频写入，成本高
- 页面关闭时写入 → 用户可能不关闭页面

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 用户同时多设备登录，收藏数据不一致 | 5分钟同步窗口内取D1最新，覆盖本地 |
| localStorage写满50个，用户体验断裂 | 明确toast提示VIP升级路径 |
| D1写入频繁，超出免费额度 | VIP用户量有限，5分钟同步属低频 |

## Migration Plan

### Phase 1: 删除免费订阅
1. 删除 `handlers/freesub.js`、`handlers/freesub-api.js`、`freesub-page.js`
2. 从 `worker.js` 移除 `/freesub/*` 路由
3. 从 `database.js` 移除 `free_subscriptions`、`checkin_records` 表创建逻辑
4. 数据库DROP旧表（`free_subscriptions`、`checkin_records`）

### Phase 2: 重构收藏前端
1. 修改 `pages/favorites-page.js`，判断VIP状态
2. 普通用户：localStorage CRUD
3. VIP用户：D1读写 + 5分钟同步
4. 添加50上限toast提示

### Phase 3: VIP数据层
1. 新建 `user_favorites` 表
2. 添加VIP判断逻辑到 `handlers/auth.js`
3. 添加D1收藏读写API

## Open Questions

1. **现有免费订阅用户的收藏是否作废？** → 确认：直接作废，不迁移

2. **VIP用户首次收藏如何初始化？** → D1无记录时返回空数组，前端处理

3. **收藏hash冲突处理？** → 前端去重，同一频道多次收藏仅存一个hash
