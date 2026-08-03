# 收视币系统 / View Coins System

## 概述 / Overview

收视币（View Coins）是系统内所有用户互动奖励的统一虚拟货币。

## 用户交互 / User Interactions

1. **获取收视币**: 用户通过签到、推荐活动获得收视币
2. **查看余额**: 用户查看当前余额和交易历史
3. **消费收视币**: 用户使用收视币兑换VIP会员（30币 = 1个月）

## 数据模型 / Data Model

### users 表增强 / Users Table Enhancement
- `view_coins` INTEGER DEFAULT 0: 当前余额

### user_coins_history 表
| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER PK | 自增 |
| user_id | INTEGER | 用户ID |
| type | TEXT | checkin/invite_register/invite_checkin/invite_purchase/exchange/refund |
| points | INTEGER | 正数收入，负数支出 |
| balance_after | INTEGER | 操作后余额 |
| description | TEXT | 人类可读描述 |
| created_at | DATETIME | 时间戳 |

## API 端点 / API Endpoints

### GET /api/coins/balance
返回当前余额和最近历史。

**响应:**
```json
{
  "success": true,
  "balance": 45,
  "history": [
    { "type": "checkin", "points": 3, "balance_after": 45, "created_at": "..." }
  ]
}
```

### POST /api/coins/add
内部端点，用于添加收视币（由签到、推荐处理器调用）。

**请求:**
```json
{
  "user_id": 123,
  "type": "checkin",
  "points": 5,
  "description": "每日签到奖励"
}
```

### POST /api/coins/deduct
内部端点，用于扣除收视币（由兑换处理器调用）。

**请求:**
```json
{
  "user_id": 123,
  "points": 30,
  "description": "VIP兑换"
}
```

## 业务规则 / Business Rules

1. 余额不能为负（余额不足时扣除失败）
2. 每笔交易记录操作后余额，用于审计
3. 历史记录只能追加（不更新、不删除）
4. 单次交易最大：10,000币
5. 每日获取上限：100币（防刷）
6. **收视币不可兑换现金**，仅限站内兑换VIP

## 验收标准 / Acceptance Criteria

- [ ] 用户可查看当前余额
- [ ] 用户可查看最近50条交易记录
- [ ] 签到处理器可原子性添加收视币
- [ ] 兑换处理器可原子性扣除收视币
- [ ] 余额不足时扣除优雅失败
- [ ] 所有交易都记录时间戳