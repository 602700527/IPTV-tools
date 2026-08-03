## ADDED Requirements

### Requirement: Non-VIP users see first 50 favorites only
The system SHALL display only the first 50 favorites for non-VIP users, with remaining favorites hidden behind a blur overlay.

#### Scenario: Non-VIP user with 200 favorites views the page
- **WHEN** a non-VIP user with 200 favorites visits the favorites page
- **THEN** the system SHALL render only the first 50 favorites in the DOM
- **AND** the system SHALL display a blur overlay below the 50th item

#### Scenario: Non-VIP user with 30 favorites views the page
- **WHEN** a non-VIP user with 30 favorites visits the favorites page
- **THEN** the system SHALL render all 30 favorites without blur overlay

#### Scenario: VIP user with 200 favorites views the page
- **WHEN** a VIP user with 200 favorites visits the favorites page
- **THEN** the system SHALL render all 200 favorites without any blur overlay

### Requirement: Blur overlay displays upgrade marketing messaging
The system SHALL display a blur overlay containing marketing messaging and VIP upgrade CTA when content is hidden.

#### Scenario: Blur overlay content structure
- **WHEN** the blur overlay is rendered
- **THEN** it SHALL contain:
  - A lock icon indicating locked content
  - Text showing the count of hidden channels (e.g., "已隐藏 150 个频道")
  - Marketing text: "开通 VIP 会员解锁全部收藏，无限制浏览"
  - A CTA button linking to /plans page with text "🎁 升级VIP，解锁全部"

#### Scenario: Blur overlay visual styling
- **WHEN** the blur overlay is rendered
- **THEN** it SHALL use a semi-transparent background with blur effect
- **AND** the overlay SHALL be non-interactive except for the CTA button

### Requirement: Non-VIP download limited to 50 channels
The system SHALL restrict non-VIP users to downloading a maximum of 50 channels in M3U format.

#### Scenario: Non-VIP user downloads favorites
- **WHEN** a non-VIP user with 100 favorites clicks download M3U
- **THEN** the system SHALL generate an M3U file containing only the first 50 channels

#### Scenario: VIP user downloads favorites
- **WHEN** a VIP user with 100 favorites clicks download M3U
- **THEN** the system SHALL generate an M3U file containing all 100 channels

#### Scenario: Non-VIP user selects channels for download
- **WHEN** a non-VIP user selects 60 channels for download
- **THEN** the system SHALL display a warning message indicating only 50 can be downloaded
- **AND** the download SHALL proceed with only the first 50 selected channels

### Requirement: Favorites info displays correct counts
The system SHALL display accurate counts in the favorites info section.

#### Scenario: Display count for non-VIP with hidden favorites
- **WHEN** a non-VIP user with 200 favorites views the favorites page
- **THEN** the info text SHALL display "已收藏 200 个频道，显示前 50 条"
- **AND** the info text SHALL indicate VIP upgrade path

#### Scenario: Display count for non-VIP with visible favorites
- **WHEN** a non-VIP user with 30 favorites views the favorites page
- **THEN** the info text SHALL display "普通用户：30 个收藏"

#### Scenario: Display count for VIP user
- **WHEN** a VIP user with 200 favorites views the favorites page
- **THEN** the info text SHALL display "VIP会员：无限收藏 | 已收藏 200 个频道"