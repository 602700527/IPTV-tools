# Specification: Admin Ticket Management

## ADDED Requirements

### Requirement: Admin can view all tickets
The system SHALL allow administrators to view a list of all tickets with filtering options.

#### Scenario: View all tickets
- **WHEN** administrator visits the ticket management page
- **THEN** system displays all tickets with pagination, ordered by creation date (newest first)

#### Scenario: Filter tickets by status
- **WHEN** administrator selects a status filter (pending/processing/resolved/closed)
- **THEN** system displays only tickets with the selected status

#### Scenario: Filter tickets by type
- **WHEN** administrator selects a ticket type filter (payment/order/technical/other)
- **THEN** system displays only tickets of the selected type

#### Scenario: Search tickets by user email
- **WHEN** administrator enters a search term
- **THEN** system displays tickets from users whose email contains the search term

### Requirement: Admin can view ticket details
The system SHALL allow administrators to view the full details of any ticket.

#### Scenario: View ticket details with replies
- **WHEN** administrator clicks on a ticket
- **THEN** system displays ticket details including user information, order details, and all replies

### Requirement: Admin can reply to tickets
The system SHALL allow administrators to reply to any ticket.

#### Scenario: Add admin reply
- **WHEN** administrator enters reply content and clicks submit
- **THEN** system adds the reply marked as admin, updates ticket status to "processing" if it was "pending"

### Requirement: Admin can change ticket status
The system SHALL allow administrators to change the status of any ticket.

#### Scenario: Mark ticket as resolved
- **WHEN** administrator clicks "Mark Resolved"
- **THEN** system updates ticket status to "resolved" and sets resolved_at timestamp

#### Scenario: Mark ticket as closed
- **WHEN** administrator clicks "Close Ticket"
- **THEN** system updates ticket status to "closed"

#### Scenario: Revert ticket to pending
- **WHEN** administrator changes status from "resolved" back to "pending"
- **THEN** system clears resolved_at timestamp

### Requirement: Email notification on status change
The system SHALL send email notifications to users when their ticket status changes.

#### Scenario: Send email when ticket is resolved
- **WHEN** administrator marks a ticket as resolved
- **THEN** system sends an email to the user notification that the ticket has been resolved

#### Scenario: Send email when ticket is closed
- **WHEN** administrator closes a ticket
- **THEN** system sends an email to the user notification that the ticket has been closed
