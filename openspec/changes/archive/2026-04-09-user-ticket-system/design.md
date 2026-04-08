## Why

建立工单系统的技术设计方案。

## Technical Design

### Database Schema

```sql
-- 工单表
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  order_id TEXT NOT NULL,
  type TEXT NOT NULL, -- payment, order, technical, other
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, resolved, closed
  priority TEXT DEFAULT 'normal',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME
);

-- 工单回复表
CREATE TABLE ticket_replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  user_id INTEGER,
  is_admin BOOLEAN DEFAULT 0,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Design

#### 用户 API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tickets | 获取用户工单列表 |
| POST | /api/tickets | 创建新工单 |
| GET | /api/tickets/:id | 获取工单详情 |
| POST | /api/tickets/:id/reply | 添加回复 |
| POST | /api/tickets/:id/close | 关闭工单 |

#### 管理 API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/tickets | 获取工单列表（支持筛选） |
| GET | /admin/tickets/:id | 获取工单详情 |
| POST | /admin/tickets/:id/reply | 管理员回复 |
| POST | /admin/tickets/:id/resolve | 标记已解决 |
| POST | /admin/tickets/:id/close | 关闭工单 |

### File Structure

```
handlers/
  ticket-api.js      # 用户工单 API

handlers/admin.js    # 管理工单 API (handleAdminTickets)

database.js          # 数据库表创建

account-page.js      # 用户账户页工单 UI
admin-page.js        # 管理后台工单 UI
```

### Ticket Flow

1. 用户选择订单 → 填写工单信息 → 提交
2. 系统发送邮件通知管理员
3. 管理员在后台查看并回复
4. 系统发送邮件通知用户
5. 管理员可标记解决或关闭
6. 用户可查看详情和回复

### Email Notifications

- 工单创建：通知管理员
- 工单回复/解决/关闭：通知用户
