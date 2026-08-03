## Context

现有订阅套餐系统（`subscription_plans` 表）仅支持静态定价和日常折扣（`discount` 字段，永久折扣比例）。无法实现"闪购"、"限时特价"等营销场景。

目标：在现有套餐管理体系上，为每个套餐增加**限时促销**能力——配置促销截止时间、折扣比例、标签，前端自动展示促销氛围（倒计时、hot badge），支付时自动计算折扣价。

## Goals / Non-Goals

**Goals:**
- 每个套餐可独立配置限时促销（结束时间、折扣、标签）
- promo 折扣**覆盖**日常 discount（促销期 promo 生效，日常 discount 不同时适用）
- 促销展示在前端自动，无需前端硬编码促销规则
- 促销到期自动失效，无需管理员手动关闭

**Non-Goals:**
- 不支持"促销码"（用户输入优惠码场景），那是方案3
- 不支持跨套餐统促（全局优惠横幅那是方案1）
- 不支持叠加使用 promo + 其他优惠
- 不做独立的促销配置页面，复用现有「订阅套餐管理」界面

## Decisions

### 决策1：promo 字段放在 `subscription_plans` 表而非独立表

**选择**：放在 subscription_plans 表。

**理由**：促销本身就是套餐级属性（某个套餐限时打折），与套餐实体强绑定。独立表（promo_codes）用于用户输入优惠码场景（方案3），这里不需要。

**替代方案**：独立促销配置表 → 增加 JOIN 查询复杂度，且每个套餐只能有一个活跃促销（当前需求），无需多表关联。

---

### 决策2：promo_discount 优先级高于日常 discount

**选择**：促销期 promo 折扣生效，日常 discount 不适用。

**理由**：
- 避免"折上折"导致利润不可预期
- 管理员意图明确：闪购价覆盖日常价

**计算公式**：
```
base = plan.basePrice + (plan.pricePerIP * ipCount)
finalPrice = base * (1 - promoDiscount / 100)  // promo 生效时
finalPrice = base * (1 - discount / 100)         // promo 未生效时
```

---

### 决策3：前端倒计时用 setInterval 实时计算，不依赖服务端倒计时状态

**选择**：前端 JS 每秒更新倒计时显示。

**理由**：
- Workers 无状态，刷新页面倒计时会重置
- 每秒计算 `endTime - now` 是纯前端计算，无需请求后端
- `promo_end_date` 存在套餐数据中，通过 `/api/mall/plans` 获取一次即可

---

### 决策4：首页促销横幅不单独查库，通过 subscription_plans 的 promo_end_date 判断

**选择**：在 `generateHomePage()` 中调用 `getPlanFromDB` 获取当前有促销的套餐，取最早结束的作为横幅截止时间。

**理由**：
- 不新增 KV 缓存或独立表
- 首页本身已有动态渲染结构（SSR），加一次 DB 查询可行
- 横幅统一展示全局促销信息（非单套餐）

## Risks / Trade-offs

| Risk | 描述 | Mitigation |
|------|------|------------|
| 前端 JS 倒计时被刷新重置 | 用户刷新页面倒计时重新计算 | 刷新导致倒计时重置是可接受行为，不是 bug |
| 促销结束但用户已在支付流程中 | 用户看到原价但实际付了折扣 | 支付前后端重新校验时间，订单使用计算时价格 |
| 多套餐都配置了促销横幅冲突 | 首页横幅只展示一个倒计时 | 取 `promo_end_date` 最近（最早结束）的作为横幅倒计时 |
| Worker 重启后促销状态丢失 | 数据库是持久化的，不受影响 | D1 数据持久化，无状态丢失问题 |

## Migration Plan

**Step 1**：数据库迁移（ALTER TABLE）
- 在 `createTables()` 中添加3个字段的 ALTER TABLE migration（参考现有 `banned_until` 迁移模式）

**Step 2**：Admin API 扩展（CRUD）
- `handlers/admin.js` case 'mall' → plans 的 INSERT/UPDATE/SELECT 加入新字段

**Step 3**：Plans API 扩展
- `handlers/plans-api.js` `handleGetPlans` 返回新字段

**Step 4**：价格计算改造
- `subscription-api.js` 和 `xunhupay-api.js` 的 `getPlanFromDB` + `calculatePrice` 叠加 promo 折扣

**Step 5**：前端（管理后台）
- `admin-page.js` Modal 表单 + 表格渲染

**Step 6**：前端（用户）
- `subscription-page.js` 价格计算 + 倒计时 + 标签
- `pages/home-page.js` 促销横幅

**Rollback**：删除 ALTER TABLE 列（需确认无数据）或通过 `is_enabled` 关闭促销字段回退逻辑

## Open Questions

1. **首页横幅多个促销时**：取最早结束的倒计时，还是展示所有促销的倒计时？（暂定：取最早结束，显示在 Hero 区域）

2. **促销结束后是否需要通知**：暂无计划，促销结束是静默的

3. **是否支持"永久促销"（不自动过期）**：不支持，`promo_end_date` 必填