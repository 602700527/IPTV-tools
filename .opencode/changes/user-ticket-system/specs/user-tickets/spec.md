# Specification: User Tickets

## ADDED Requirements

### Requirement: User can view ticket list
The system SHALL allow authenticated users to view a list of their submitted tickets.

#### Scenario: View ticket list with multiple tickets
- **WHEN** user visits the tickets page while authenticated
- **THEN** system displays a list of all tickets belonging to the user, ordered by creation date (newest first)

#### Scenario: View ticket list with no tickets
- **WHEN** user visits the tickets page with no existing tickets
- **THEN** system displays an empty state with message "No tickets yet"

#### Scenario: View ticket list after creating tickets
- **WHEN** user creates a ticket and then views the ticket list
- **THEN** the newly created ticket appears at the top of the list

### Requirement: User can create a new ticket
The system SHALL allow users to create a new ticket linked to a completed order.

#### Scenario: Create ticket successfully
- **WHEN** user selects a completed order, fills in ticket type, subject, and description
- **THEN** system creates a new ticket with status "pending" and displays success message

#### Scenario: Create ticket for order with existing open ticket
- **WHEN** user attempts to create a ticket for an order that already has an open ticket (status != closed)
- **THEN** system rejects the request with error message "This order already has an open ticket"

#### Scenario: Create ticket without selecting order
- **WHEN** user attempts to create a ticket without selecting an order
- **THEN** system displays validation error "Please select an order"

#### Scenario: Create ticket without filling required fields
- **WHEN** user attempts to create a ticket with empty subject or description
- **THEN** system displays validation error for the missing field

### Requirement: User can view ticket details
The system SHALL allow users to view the full details of a ticket including all replies.

#### Scenario: View ticket details
- **WHEN** user clicks on a ticket in the list
- **THEN** system displays ticket subject, description, status, creation time, and all replies in chronological order

#### Scenario: View another user's ticket
- **WHEN** user attempts to view a ticket belonging to another user
- **THEN** system returns 403 Forbidden error

### Requirement: User can reply to a ticket
The system SHALL allow users to add replies to their own open tickets.

#### Scenario: Add reply to open ticket
- **WHEN** user enters reply content and clicks submit on an open ticket
- **THEN** system adds the reply to the ticket and displays it in the conversation thread

#### Scenario: Add reply to closed ticket
- **WHEN** user attempts to add a reply to a closed ticket
- **THEN** system rejects the request with error message "Cannot reply to closed ticket"

### Requirement: User can close a ticket
The system SHALL allow users to close their own tickets.

#### Scenario: Close own ticket
- **WHEN** user clicks "Close Ticket" on their own ticket
- **THEN** system updates ticket status to "closed" and sends confirmation

#### Scenario: Close another user's ticket
- **WHEN** user attempts to close a ticket belonging to another user
- **THEN** system returns 403 Forbidden error

### Requirement: Email notification on ticket creation
The system SHALL send an email notification to the administrator when a new ticket is created.

#### Scenario: Send email to admin on ticket creation
- **WHEN** user creates a new ticket
- **THEN** system sends an email to the configured admin email address with ticket details (type, subject, user email)

### Requirement: Email notification on admin reply
The system SHALL send an email notification to the user when an administrator replies to their ticket.

#### Scenario: Send email to user on admin reply
- **WHEN** administrator replies to a user's ticket
- **THEN** system sends an email notification to the user with the reply content
