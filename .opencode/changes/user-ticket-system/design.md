# Design: User Ticket System

## Context

用户购买订阅后遇到问题时缺乏有效的沟通渠道。目前商城已有订单系统（user_orders、xunhupay_orders 表），但用户无法就订单问题提交工单并追踪处理进度。

现有基础设施：
- 用户系统：users、user_sessions、user_orders 表
- 商城系统：payment_methods、subscription_plans、xunhupay_orders 表
- 邮件系统：Resend API 已配置（FROM_EMAIL = support@iptv-search.com）

## Goals / Non-Goals

**Goals:**
- 用户可以就订单提交工单（支付问题、订单咨询、技术支持、其他）
- 用户可以在账户页面查看工单列表和详情
- 用户可以添加回复并关闭工单
- 管理员可以在后台管理工单（查看、回复、标记状态）
- 工单状态变更时发送邮件通知
- 一个订单只能有一个存活工单（防止重复工单）

**Non-Goals:**
- 不支持客服主动发起工单
- 不支持工单附件上传
- 不支持工单指派给特定管理员
- 不实现工单优先级自动判断（用户手动选择）

## Decisions

### 1. 数据库设计

**tickets 表：**
```sql
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  order_id TEXT NOT NULL,
  type TEXT NOT NULL,           -- payment/order/technical/other
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME
);
```

**ticket_replies 表：**
```sql
CREATE TABLE ticket_replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  user_id INTEGER,
  is_admin BOOLEAN DEFAULT 0,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**决策理由：** 使用独立的 tickets 和 ticket_replies 表，支持多轮对话。type 字段支持4种工单类型。

### 2. API 设计

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/api/tickets` | GET | 获取当前用户工单列表 |
| `/api/tickets` | POST | 创建新工单（需验证订单ownership） |
| `/api/tickets/:id` | GET | 获取工单详情（含回复） |
| `/api/tickets/:id/reply` | POST | 添加回复 |
| `/api/tickets/:id/close` | POST | 关闭工单 |
| `/admin/tickets` | GET | 管理员获取工单列表（支持筛选） |
| `/admin/tickets/:id` | GET | 管理员获取工单详情 |
| `/admin/tickets/:id/reply` | POST | 管理员回复 |
| `/admin/tickets/:id/resolve` | POST | 标记为已解决 |
| `/admin/tickets/:id/close` | POST | 关闭工单 |

**决策理由：** RESTful 设计，与现有 API 风格保持一致。管理员接口与用户接口分离，通过 X-Admin-Key 认证。

### 3. 邮件通知设计

使用 Resend API 发送邮件：

| 事件 | 收件人 | 主题 |
|-----|--------|------|
| 用户提交工单 | 管理员 | 新工单通知 - [类型] - [用户邮箱] |
| 管理员回复 | 用户 | 工单回复通知 - [工单标题] |
| 工单已解决 | 用户 | 工单已解决 - [工单标题] |
| 工单已关闭 | 用户 | 工单已关闭 - [工单标题] |

**决策理由：** 复用现有 Resend 配置，无需新增外部依赖。

### 4. 工单唯一性约束

创建工单前检查：
```sql
SELECT COUNT(*) FROM tickets 
WHERE order_id = ? AND status != 'closed'
```
如果存在则拒绝创建，返回错误信息。

**决策理由：** 防止用户针对同一订单重复提交工单，减少客服工作量。

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|-----|------|---------|
| 邮件发送失败 | 用户/管理员收不到通知 | 记录邮件发送日志，失败不影响工单创建 |
| 并发创建工单 | 可能突破唯一性约束 | 数据库层面加唯一索引 |
| 用户恶意刷工单 | 占用客服资源 | 每个订单限1个工单，已足够限制 |

## Migration Plan

1. **数据库迁移**：在 createTables() 中添加 tickets 和 ticket_replies 表
2. **API 实现**：创建 ticket-api.js handler
3. **前端更新**：account-page.js 添加工单Tab，admin-page.js 添加工单管理Tab
4. **邮件集成**：使用已配置的 Resend API

**回滚计划：** 由于是新增功能，直接删除表和 API 即可回滚。
