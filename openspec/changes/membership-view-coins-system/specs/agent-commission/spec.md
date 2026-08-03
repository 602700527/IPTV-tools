# 代理佣金系统 / Agent Commission System

## 概述 / Overview

代理在被推荐用户购买时获得佣金。佣金比例取决于代理等级，满500元可申请提现。

## 用户交互 / User Interactions

1. **查看佣金面板**: 用户查看累计佣金、待结算、已提现
2. **申请提现**: 用户在余额≥500元时申请提现
3. **管理员审核**: 管理员审批/拒绝提现申请（手动处理）

### 3.1 佣金面板显示位置

```
账户页面（/account）
├── "推广中心"TAB
│   ├── 代理等级：基础/银牌/金牌
│   ├── 当前佣金比例：10% / 15% / 20%
│   ├── 佣金统计
│   │   ├── 累计获得：¥XXX
│   │   ├── 待入账：¥XXX（7天冷却期）
│   │   └── 已提现：¥XXX
│   ├── 升级进度（如未达到金牌）
│   │   └── "再推荐X个付费用户可升级为金牌代理"
│   └── 佣金明细列表
│       ├── 被推荐人
│       ├── 订单金额
│       ├── 佣金
│       └── 状态（入账中/已入账/已提现）
└── 提现按钮（如余额≥500元）
```

## 数据模型 / Data Model

### users 表增强 / Users Table Enhancement
- `agent_level` INTEGER DEFAULT 0: 0=无，1=基础，2=银牌，3=金牌
- `total_commission` REAL DEFAULT 0: 累计佣金

### agent_commissions 表
| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER PK | 自增 |
| agent_user_id | INTEGER | 代理用户ID |
| referred_user_id | INTEGER | 购买者用户ID |
| order_id | TEXT | 购买订单ID |
| order_amount | REAL | 购买金额（RMB） |
| commission | REAL | 佣金金额 |
| commission_rate | REAL | 购买时佣金比例（0.10/0.15/0.20） |
| status | TEXT | pending/settled/withdrawn |
| created_at | DATETIME | 获得时间 |
| settled_at | DATETIME | 提现时间 |

## 代理等级 / Agent Levels

| 等级 | 佣金比例 | 升级条件 |
|------|---------|----------|
| 无 | N/A | 尚无推荐 |
| 基础 | 10% | 注册即得 |
| 银牌 | 15% | 10个付费推荐 OR 500元累计佣金 |
| 金牌 | 20% | 30个付费推荐 OR 2000元累计佣金 |

## API 端点 / API Endpoints

### GET /api/agent/commissions
返回佣金历史和统计。

**响应:**
```json
{
  "success": true,
  "agent_level": 2,
  "stats": {
    "total_earned": 450.00,
    "pending": 50.00,
    "withdrawn": 400.00,
    "paid_referrals_count": 8
  },
  "level_progress": {
    "current_rate": 0.15,
    "next_rate": 0.20,
    "requirement": "30个付费推荐 或 2000元",
    "current_progress": "8/30个付费推荐"
  },
  "commissions": [
    {
      "id": 1,
      "referred_user_id": 456,
      "order_amount": 100.00,
      "commission": 15.00,
      "rate": 0.15,
      "status": "pending",
      "created_at": "2026-05-01"
    }
  ]
}
```

### POST /api/agent/withdraw
申请提现（最低500元）。

**响应:**
```json
{
  "success": true,
  "withdrawal_id": "WD20260504001",
  "amount": 450.00,
  "status": "pending_review"
}
```

## 业务规则 / Business Rules

1. 佣金在购买时计算（基于代理当前等级），但**7天后才入账**
2. 佣金入账条件：购买后7天内未发生退款
3. 如果7天内发生退款，佣金不发放（也不会产生记录）
4. 佣金立即存储（status=pending），7天后通过定时任务自动变为可提现（status=settled）
5. 等级升级永久生效（无降级）
6. 最低提现额：500元
7. 提现流程：申请 → 管理员审批 → 手动转账 → 标记已提现
8. 佣金单位为人民币，不可转换为收视币

### 定时任务 / Scheduled Task

**每日检查未入账佣金**（`/test/scheduled` 触发）：
```sql
-- 查找7天前创建的pending佣金，检查原订单是否仍有效
SELECT ac.*, uo.status as order_status
FROM agent_commissions ac
LEFT JOIN user_orders uo ON ac.order_id = uo.order_id
WHERE ac.status = 'pending' 
  AND ac.created_at < datetime('now', '-7 days');
```

如果原订单状态仍为`completed`，将佣金状态更新为`settled`。

## 验收标准 / Acceptance Criteria

- [ ] 被推荐用户购买时自动生成佣金记录
- [ ] 佣金比例基于购买时代理等级
- [ ] 代理可查看佣金历史
- [ ] 余额<500元时提现失败
- [ ] 提现创建待审核记录供管理员处理
- [ ] 满足条件时代理等级自动升级