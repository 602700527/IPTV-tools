## Why

首页需要限时优惠钩子来促进转化，但当前订阅套餐系统缺乏临促能力（flash sale、限时折扣）。通过为每个套餐添加限时促销字段，管理员可在后台配置闪购价格和截止时间，系统自动在首页和订阅页展示促销氛围（倒计时、标签），支付时自动叠加折扣。

## What Changes

- `subscription_plans` 表新增3个字段：`promo_end_date`（DATETIME）、`promo_discount`（INTEGER，0-90）、`promo_label`（TEXT）
- 管理后台「订阅套餐管理」界面扩展 Modal，支持配置和保存这3个字段
- `handlers/plans-api.js` 公开接口 `/api/mall/plans` 返回时携带这3个字段
- `subscription-api.js` 和 `xunhupay-api.js` 中价格计算逻辑叠加 promo 折扣（优先级高于日常 `discount` 字段）
- `subscription-page.js` 前端价格计算、倒计时渲染、促销标签展示
- `pages/home-page.js` 首页在有活跃促销时展示促销横幅

## Capabilities

### New Capabilities

- `plan-promo`: 套餐级限时促销，支持配置促销截止时间、折扣比例、标签文本，系统自动计算折扣、渲染倒计时和促销标识
- `promo-price-calculation`: 支付时价格计算，promo 折扣优先级高于日常折扣，`price = base + ip*pricePerIp` 后乘以 `(1 - promoDiscount/100)`

### Modified Capabilities

- （无现有 spec 涉及订阅套餐定价逻辑，无须修改）

## Impact

| 层级 | 文件 | 影响 |
|------|------|------|
| 数据库 | `database.js` | ALTER TABLE 迁移添加3个字段 |
| 后端 API | `handlers/admin.js` (case 'mall' → plans) | CRUD 读取/写入3个新字段 |
| 后端 API | `handlers/plans-api.js` | `/api/mall/plans` 返回3个新字段 |
| 价格计算 | `handlers/subscription-api.js` | `getPlanFromDB` + `calculatePrice` 叠加 promo 折扣 |
| 价格计算 | `handlers/xunhupay-api.js` | 同上（支付链路） |
| 前端-管理后台 | `admin-page.js` | Modal + 表格渲染扩展3个字段 |
| 前端-用户 | `subscription-page.js` | 价格计算/倒计时/促销标签 |
| 前端-首页 | `pages/home-page.js` | 促销横幅展示 |