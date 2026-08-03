## ADDED Requirements

### Requirement: Anonymous users can add favorites without login
The system SHALL allow any user, whether logged in or anonymous, to add channels to favorites without requiring authentication.

#### Scenario: Anonymous user adds a favorite
- **WHEN** an anonymous user clicks the add-to-favorites button on a channel page
- **THEN** the system SHALL save the channel to localStorage without checking login status

#### Scenario: Logged-in VIP user adds a favorite
- **WHEN** a VIP user clicks the add-to-favorites button
- **THEN** the system SHALL save the channel to localStorage AND asynchronously sync to D1 cloud storage

#### Scenario: Anonymous user adds duplicate favorite
- **WHEN** an anonymous user attempts to add a channel that already exists in favorites
- **THEN** the system SHALL display a warning message and not add a duplicate

### Requirement: Non-VIP users can add unlimited favorites
The system SHALL impose no quantity limit on the number of favorites a non-VIP user can add to localStorage.

#### Scenario: Non-VIP user adds more than 50 favorites
- **WHEN** a non-VIP user adds their 51st favorite channel
- **THEN** the system SHALL save it to localStorage without blocking or showing limit error

#### Scenario: Non-VIP user storage check before adding
- **WHEN** an anonymous user attempts to add a favorite
- **THEN** the system SHALL only check for duplicate existence, NOT quantity limit

### Requirement: VIP user favorites sync to cloud
The system SHALL sync VIP user's favorites to D1 cloud storage for cross-device access.

#### Scenario: VIP user favorites saved to cloud
- **WHEN** a VIP user adds, removes, or modifies favorites
- **THEN** the system SHALL save to localStorage AND push changes to D1 via /api/favorites/sync

#### Scenario: VIP user on new device loads cloud favorites
- **WHEN** a VIP user visits the favorites page on a new device
- **THEN** the system SHALL load favorites from D1 cloud and cache in localStorage