## ADDED Requirements

### Requirement: VIP Favorites Storage
The system SHALL allow VIP users (subscribers with valid subscription) to save unlimited channel favorites in D1 database.

#### Scenario: Add favorite as VIP
- **WHEN** logged-in VIP user adds a channel to favorites
- **THEN** system SHALL append channel hash to `user_favorites` table in D1
- **AND** system SHALL return success

#### Scenario: Remove favorite as VIP
- **WHEN** logged-in VIP user removes a channel from favorites
- **THEN** system SHALL remove channel hash from D1 `user_favorites` table
- **AND** system SHALL return success

#### Scenario: View favorites as VIP
- **WHEN** logged-in VIP user opens favorites page
- **THEN** system SHALL load favorites from D1 `user_favorites` table
- **AND** system SHALL display all favorited channels

### Requirement: VIP Data Synchronization
The system SHALL sync VIP favorites between frontend and D1 every 5 minutes.

#### Scenario: Periodic sync
- **WHEN** 5 minutes have elapsed since last sync
- **THEN** system SHALL check for local changes
- **AND** system SHALL push any changes to D1
- **AND** system SHALL update `updated_at` timestamp

#### Scenario: Read with D1 fallback
- **WHEN** VIP user loads favorites page
- **THEN** system SHALL first try to load from D1
- **AND** if D1 fails, system SHALL fall back to localStorage if available

### Requirement: Unlimited Favorites
The system SHALL allow VIP users to add unlimited favorites without quantity restrictions.

#### Scenario: VIP no limit
- **WHEN** VIP user adds more than 50 favorites
- **THEN** system SHALL accept all favorites without limit
- **AND** no toast warning SHALL be displayed
