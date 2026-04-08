# Proposal: User Ticket System

## Why

用户购买订阅后遇到问题时缺乏有效的沟通渠道。目前商城已有订单系统，但用户无法就订单问题提交工单并追踪处理进度。引入工单系统可以让用户就支付、订单、技术等问题提交工单，管理员可以在后台统一处理并回复，提升用户体验和客服效率。

## What Changes

- 新增工单数据库表（tickets、ticket_replies）
- 用户端新增工单管理界面（创建、查看、回复、关闭）
- 管理后台新增工单管理模块
- 集成邮件通知（用户提交工单、管理员回复时发送邮件）
- 工单与订单绑定，一个订单只能有一个存活工单

## Capabilities

### New Capabilities

- `user-tickets`: 用户工单功能，包含创建工单、查看列表、查看详情、添加回复、关闭工单
- `admin-ticket-management`: 管理后台工单管理，包含工单列表、查看详情、回复用户、标记状态

### Modified Capabilities

- 无（现有 specs 无需修改）

## Impact

- **数据库**: 新增 tickets 和 ticket_replies 表
- **API**: 新增 `/api/tickets` 系列接口和 `/admin/tickets` 管理接口
- **前端**: 用户账户页新增工单Tab，管理后台商城管理新增工单管理Tab
- **邮件**: 使用已配置的 Resend API 发送通知邮件
