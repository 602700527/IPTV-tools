## Why

用户需要一个工单系统来提交关于订单的问题和咨询。管理员需要在后台统一处理用户的工单并回复，提升客户服务质量。

## What Changes

- 新增用户工单提交功能（选择订单、工单类型、主题、描述）
- 新增用户工单列表查看功能
- 新增工单详情查看和回复功能
- 新增管理员工单管理界面（列表、详情、回复、解决、关闭）
- 新增工单状态邮件通知（创建通知管理员、状态变更通知用户）
- 数据库新增 `tickets` 和 `ticket_replies` 表

## Capabilities

### New Capabilities
- `user-tickets`: 用户工单提交和查看
- `admin-ticket-management`: 管理员工单处理和回复

### Modified Capabilities
- (none)

## Impact

- 新增 API 端点：`/api/tickets`, `/api/tickets/:id`, `/admin/tickets`
- 新增数据库表：`tickets`, `ticket_replies`
- 新增页面组件：账户页工单 Tab、管理后台工单管理 Tab
