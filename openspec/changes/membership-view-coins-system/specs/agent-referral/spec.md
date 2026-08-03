# 代理推荐系统 / Agent Referral System

## 概述 / Overview

追踪用户间的推荐关系。推荐人在被推荐用户完成特定操作时获得收视币奖励。

## 用户交互 / User Interactions

1. **查看推广链接**: 在账户页面查看专属推广链接
2. **分享链接**: 用户通过社交媒体分享推广链接
3. **查看推荐**: 用户查看被推荐用户列表及状态
4. **获得佣金**: 被推荐人购买订阅时，推荐人获得佣金（通过代理佣金系统）

---

## 二、显示和交互位置 / Display & Interaction Locations

### 2.1 推广链接显示位置

```
账户页面（/account）
├── "推广中心"TAB
│   ├── 我的推广码：ABC123
│   ├── 推广链接：https://example.com/?ref=ABC123
│   ├── 一键复制按钮
│   └── 分享到：微信/微博/QQ 按钮
├── 推荐数据统计
│   ├── 已推荐人数
│   ├── 付费用户数
│   └── 累计获得佣金
└── 被推荐用户列表
    └── 详细：邮箱、注册时间、是否付费
```

### 2.2 推广链接格式

```
https://{APP_URL}/?ref={referral_code}
```

### 2.3 推荐人称号

- 所有有推荐码的用户统一称为"推荐人"
- 推荐人自动获得代理资格（见代理佣金系统）
- 在UI上统一显示为"推荐人"身份

## 数据模型 / Data Model

### users 表增强 / Users Table Enhancement
- `referral_code` TEXT UNIQUE: 用户专属推荐码（如 "ABC123"）
- `referrer_id` INTEGER: 推荐人用户ID

### agent_referrals 表
| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER PK | 自增 |
| agent_user_id | INTEGER | 推荐人 |
| referred_user_id | INTEGER | 被推荐人 |
| created_at | DATETIME | 推荐关系创建时间 |
| is_paid_user | INTEGER | 0=否，1=是（已成为付费用户） |

## API 端点 / API Endpoints

### GET /api/agent/referrals
返回被推荐用户列表。

**响应:**
```json
{
  "success": true,
  "referral_code": "ABC123",
  "referral_link": "https://example.com/?ref=ABC123",
  "stats": {
    "total_referrals": 15,
    "paid_referrals": 3
  },
  "referrals": [
    {
      "user_id": 456,
      "email": "us***@gmail.com",
      "registered_at": "2026-04-15",
      "is_paid": true
    }
  ]
}
```

## 推荐奖励机制 / Referral Bonus Schedule

| 事件 | 推荐人奖励 | 被推荐人奖励 |
|------|-----------|-------------|
| 注册 | 5收视币 | 10收视币 |
| 首次签到 | 5收视币 | - |
| 成为付费用户 | 30收视币 | - |

## 业务规则 / Business Rules

1. 用户注册时自动生成 `referral_code`
2. URL中包含 `?ref=CODE` 时，注册时记录为 `referrer_id`
3. 每个用户只能有一个推荐人（注册后不可更改）
4. 重复检测：相同邮箱/IP不能重复推荐
5. 推荐奖励为积分，不可转让

## 验收标准 / Acceptance Criteria

- [ ] 新用户注册时自动获得推荐码
- [ ] 带 ?ref=CODE 注册时正确设置推荐人
- [ ] 注册时立即发放推荐奖励
- [ ] 被推荐人首次签到时发放推荐奖励（通过签到处理器）
- [ ] 被推荐人成为付费用户时发放推荐奖励
- [ ] 用户可查看自己的推荐码和链接