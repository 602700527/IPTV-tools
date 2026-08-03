## ADDED Requirements

### Requirement: Local Storage Favorites
The system SHALL allow logged-in non-VIP users to save up to 50 channel favorites in browser localStorage.

#### Scenario: Add favorite within limit
- **WHEN** logged-in non-VIP user adds a channel to favorites
- **THEN** system SHALL save channel hash to localStorage key `user_favorites`
- **AND** system SHALL display success toast

#### Scenario: Add favorite exceeds limit
- **WHEN** logged-in non-VIP user with 50 favorites attempts to add another
- **THEN** system SHALL display toast message "收藏已满，升级VIP解锁无限收藏"
- **AND** system SHALL NOT add the channel to localStorage

#### Scenario: Remove favorite
- **WHEN** logged-in non-VIP user removes a channel from favorites
- **THEN** system SHALL remove the channel hash from localStorage

#### Scenario: View favorites
- **WHEN** logged-in non-VIP user opens favorites page
- **THEN** system SHALL load favorites from localStorage
- **AND** system SHALL display up to 50 channels

### Requirement: Favorites Data Format
The system SHALL store favorites as a JSON array of channel hashes in localStorage.

#### Scenario: Storage format
- **WHEN** system stores favorites
- **THEN** the data structure SHALL be `{ "favorites": ["hash1", "hash2", ...], "updated_at": timestamp }`
- **AND** duplicate hashes SHALL be prevented
