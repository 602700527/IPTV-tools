## Why

免费订阅模式无法建立用户粘性，也无法识别高价值用户。现有订阅用户（即VIP）需要专属的收藏功能来提升体验和留存。移除免费订阅、重构收藏系统，为付费转化和用户运营打下基础。

## What Changes

### 移除免费订阅
- **BREAKING** 删除 `handlers/freesub.js` 和 `handlers/freesub-api.js`
- **BREAKING** 删除 `freesub-page.js` 及相关页面路由
- **BREAKING** 删除 `/freesub/*` 全部路由
- **BREAKING** 删除数据库表 `free_subscriptions`
- **BREAKING** 删除数据库表 `checkin_records`（签到奖励后续独立项目）
- **BREAKING** 删除 `free_sub_*` 相关索引

### 重构收藏功能
- 普通注册用户：收藏数据存储于 localStorage，容量限制50个
- VIP用户（现有订阅用户）：收藏数据存储于 D1，无容量限制
- 50个上限时 toast 提示："收藏已满，升级VIP解锁无限收藏"
- VIP收藏数据格式：`favorites` 字段存储 JSON 数组
- 同步机制：前端每5分钟检测变化，有变化则更新D1

### 用户等级定义
- **普通用户**：已注册但无有效订阅
- **VIP用户**：拥有有效订阅的注册用户（现有订阅用户自动成为VIP）

## Capabilities

### New Capabilities
- `registered-user-favorites`: 普通注册用户的本地收藏功能（localStorage，50上限）
- `vip-favorites`: VIP用户的无限收藏功能（D1存储，5分钟同步）

### Modified Capabilities
- `user-auth`: 现有用户认证系统需支持VIP状态判断（订阅用户 = VIP）
- `favorites-page`: 现有收藏页面需适配本地/D1双数据源，显示VIP角标

## Impact

### 需删除的文件
- `handlers/freesub.js`
- `handlers/freesub-api.js`
- `freesub-page.js`

### 需修改的文件
- `worker.js` - 移除 `/freesub/*` 路由
- `database.js` - 删除 `free_subscriptions`、`checkin_records` 表创建逻辑
- `handlers/auth.js` - 添加VIP状态判断逻辑
- `pages/favorites-page.js` - 适配本地/D1双数据源

### 数据库变更
- 删除表：`free_subscriptions`、`checkin_records`
- 删除索引：`idx_free_subscriptions_*`
- 新增表：`user_favorites`（VIP专用）
