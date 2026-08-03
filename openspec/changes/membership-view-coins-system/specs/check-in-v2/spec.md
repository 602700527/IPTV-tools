# 签到系统 v2 / Check-in System v2

## 概述 / Overview

基于 `users` 表的每日签到系统（替换原来基于 `free_subscriptions` 的旧系统）。用户通过签到获得收视币和抽奖奖励，连续签到里程碑可解锁VIP体验卡。

## 用户交互 / User Interactions

1. **执行签到**: 用户点击签到按钮，获得收视币 + 抽奖奖励
2. **查看连续进度**: 用户查看连续天数和下一个奖励进度
3. **获得体验卡**: 在连续签到里程碑时，VIP体验卡自动发放

## 数据模型 / Data Model

### user_checkin_records 表
| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER PK | 自增 |
| user_id | INTEGER | 用户ID |
| checkin_date | TEXT | YYYY-MM-DD，与user_id联合唯一 |
| points_earned | INTEGER | 基础收视币 |
| bonus_points | INTEGER | 抽奖奖励收视币 |
| is_consecutive | INTEGER | 1=连续，0=中断 |
| created_at | DATETIME | 时间戳 |

### users 表增强 / Users Table Enhancement
- `consecutive_checkin_days` INTEGER DEFAULT 0
- `last_checkin_date` TEXT

## API 端点 / API Endpoints

### POST /api/coins/check-in
**请求:** 无（用户通过 auth token 识别）

**响应:**
```json
{
  "success": true,
  "earned": {
    "base": 1,
    "bonus": 2,
    "total": 3
  },
  "lottery": {
    "roll": 15,
    "bonus_rate": 0.3,
    "bonus_description": "+30% 奖励"
  },
  "streak": {
    "current": 5,
    "target": 10,
    "reward_pending": "再签到5天获得2周VIP体验卡"
  }
}
```

### GET /api/coins/check-in/status
**响应:**
```json
{
  "success": true,
  "today_checked_in": false,
  "streak": {
    "current_days": 5,
    "last_checkin_date": "2026-05-03",
    "next_milestone": 10,
    "milestone_reward": "2周VIP体验卡"
  }
}
```

## 抽奖算法 / Lottery Algorithm

```javascript
const rand = crypto.getRandomValues(new Uint8Array(1))[0] % 100;
let bonusRate;
if (rand < 10) bonusRate = 0.5;        // 10%概率：+50%
else if (rand < 30) bonusRate = 0.3;   // 20%概率：+30%
else bonusRate = 0.05 + rand / 200;    // 70%概率：+5%~10%

const totalCoins = 1 + Math.floor(1 * bonusRate);
```

## 连续签到规则 / Streak Rules

1. 每天签到一次（按 checkin_date 判断）
2. 昨天也签到则连续天数 +1
3. 中断1天：连续天数衰减50%（向下取整）
4. 中断2天及以上：连续天数归零
5. 中断后从第1天重新计算
6. 第10天（或倍数）发放VIP体验卡
7. **VIP用户不可签到**（签到入口对VIP用户不显示或显示为"VIP会员无需签到"）

## 里程碑奖励 / Milestone Rewards

| 连续天数 | 奖励 | 触发条件 |
|----------|------|----------|
| 10天 | 2周VIP体验卡 | 自动发放+自动激活 |
| 20天 | 无体验卡 | 仅显示进度，继续累积 |
| 30天 | 1个月VIP体验卡 | 自动发放+自动激活 |

**注意**：VIP用户不可签到，无法获得里程碑奖励。

## 验收标准 / Acceptance Criteria

- [ ] 用户每天只能签到一次（按日历日）
- [ ] 抽奖使用加密随机（`crypto.getRandomValues`）
- [ ] 连续天数正确计算（实时计算，不存储）
- [ ] 漏签1天正确衰减50%，漏签2天以上归零
- [ ] 第10天自动发放VIP体验卡
- [ ] 今日已签到时签到优雅失败
- [ ] VIP用户签到时被拒绝

---

## 业务规则 / Business Rules

1. **VIP用户不可签到**：`users.vip_expired_at > now()` 则视为VIP
2. 每天签到一次（按 checkin_date 判断，UTC 0点为基准）
3. 昨天也签到则连续天数 +1
4. 中断1天：连续天数衰减50%（向下取整）
5. 中断2天及以上：连续天数归零
6. 中断后从第1天重新计算
7. 第10天（或倍数）发放VIP体验卡
8. 签到记录只追加，不更新

### VIP状态前置检查

```javascript
// 签到前检查
async function checkIn(userId, db) {
  const user = await db.prepare('SELECT vip_expired_at FROM users WHERE id = ?').bind(userId).first();

  if (user.vip_expired_at && new Date(user.vip_expired_at) > new Date()) {
    return { success: false, error: 'VIP用户无需签到' };
  }
  // ... 继续签到逻辑
}
```