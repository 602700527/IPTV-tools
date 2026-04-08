# Admin Ticket Management Specification

## Overview

Allow administrators to view, respond to, and manage user support tickets.

## Endpoints

### GET /admin/tickets

List all tickets with optional filters.

**Query Parameters:**
- `status`: Filter by status (pending, processing, resolved, closed)
- `type`: Filter by type (payment, order, technical, other)
- `search`: Search by email or subject

**Response:**
```json
{
  "success": true,
  "tickets": [
    {
      "id": 1,
      "user_email": "user@example.com",
      "order_id": "ORD123",
      "type": "payment",
      "subject": "Payment issue",
      "status": "pending",
      "created_at": "2026-04-09T10:00:00Z"
    }
  ]
}
```

### GET /admin/tickets/:id

Get ticket details with replies and order info.

### POST /admin/tickets/:id/reply

Reply to a ticket (admin reply).

### POST /admin/tickets/:id/resolve

Mark ticket as resolved.

### POST /admin/tickets/:id/close

Close a ticket.

## Admin UI Features

- Ticket list with filtering and search
- Ticket detail modal
- Reply form
- Status action buttons
