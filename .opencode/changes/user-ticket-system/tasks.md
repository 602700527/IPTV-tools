# Tasks: User Ticket System

## 1. Database Setup

- [ ] 1.1 Add tickets table schema to database.js (createTables function)
- [ ] 1.2 Add ticket_replies table schema to database.js
- [ ] 1.3 Add indexes for tickets table (user_id, order_id, status, created_at)
- [ ] 1.4 Add indexes for ticket_replies table (ticket_id, created_at)

## 2. User Tickets API

- [ ] 2.1 Create ticket-api.js handler file
- [ ] 2.2 Implement GET /api/tickets - list user tickets
- [ ] 2.3 Implement POST /api/tickets - create new ticket (with order validation)
- [ ] 2.4 Implement GET /api/tickets/:id - get ticket details
- [ ] 2.5 Implement POST /api/tickets/:id/reply - add user reply
- [ ] 2.6 Implement POST /api/tickets/:id/close - close ticket

## 3. Admin Ticket API

- [ ] 3.1 Add /admin/tickets routes to admin.js handler
- [ ] 3.2 Implement GET /admin/tickets - list all tickets with filters
- [ ] 3.3 Implement GET /admin/tickets/:id - get ticket details with user info
- [ ] 3.4 Implement POST /admin/tickets/:id/reply - admin reply
- [ ] 3.5 Implement POST /admin/tickets/:id/resolve - mark as resolved
- [ ] 3.6 Implement POST /admin/tickets/:id/close - close ticket

## 4. Email Notifications

- [ ] 4.1 Create email sending utility function using Resend API
- [ ] 4.2 Implement admin notification on ticket creation
- [ ] 4.3 Implement user notification on admin reply
- [ ] 4.4 Implement user notification on ticket resolved
- [ ] 4.5 Implement user notification on ticket closed

## 5. User Account Page Integration

- [ ] 5.1 Add "My Tickets" tab to account-page.js navigation
- [ ] 5.2 Create ticket list view (matching existing order list style)
- [ ] 5.3 Create new ticket modal with order selection dropdown
- [ ] 5.4 Create ticket detail view with reply thread
- [ ] 5.5 Add ticket status badges (pending/processing/resolved/closed)

## 6. Admin Page Integration

- [ ] 6.1 Add "Ticket Management" tab to admin-page.js (under Mall section)
- [ ] 6.2 Create admin ticket list with filters (status, type, search)
- [ ] 6.3 Create admin ticket detail modal with reply form
- [ ] 6.4 Add status change buttons (Mark Processing, Mark Resolved, Close)
- [ ] 6.5 Add ticket type and priority display

## 7. Route Integration

- [ ] 7.1 Add ticket-api routes to worker.js
- [ ] 7.2 Add admin ticket routes to worker.js
- [ ] 7.3 Test API endpoints

## 8. Testing

- [ ] 8.1 Test creating ticket with valid order
- [ ] 8.2 Test creating ticket with existing open ticket (should fail)
- [ ] 8.3 Test viewing ticket list
- [ ] 8.4 Test adding reply as user
- [ ] 8.5 Test closing ticket as user
- [ ] 8.6 Test admin viewing all tickets
- [ ] 8.7 Test admin replying to ticket
- [ ] 8.8 Test admin changing ticket status
- [ ] 8.9 Test email notifications (check logs)
