# User Tickets Specification

## Overview

Allow users to submit support tickets for order-related issues and view ticket status.

## Endpoints

### GET /api/tickets

List all tickets for the authenticated user.

**Response:**
```json
{
  "success": true,
  "tickets": [
    {
      "id": 1,
      "order_id": "ORD123",
      "type": "payment",
      "subject": "Payment issue",
      "status": "pending",
      "created_at": "2026-04-09T10:00:00Z"
    }
  ]
}
```

### POST /api/tickets

Create a new ticket.

**Request:**
```json
{
  "order_id": "ORD123",
  "type": "payment",
  "subject": "Payment issue",
  "description": "I was charged but order not processed"
}
```

**Response:**
```json
{
  "success": true,
  "ticket_id": 1
}
```

### GET /api/tickets/:id

Get ticket details with replies.

**Response:**
```json
{
  "success": true,
  "ticket": { ... },
  "replies": [ ... ]
}
```

### POST /api/tickets/:id/reply

Add a reply to a ticket.

### POST /api/tickets/:id/close

Close a ticket.

## Ticket Types

- `payment`: Payment issues
- `order`: Order inquiry
- `technical`: Technical support
- `other`: Other issues

## Ticket Status

- `pending`: Awaiting admin response
- `processing`: Admin has responded
- `resolved`: Issue resolved
- `closed`: Ticket closed
