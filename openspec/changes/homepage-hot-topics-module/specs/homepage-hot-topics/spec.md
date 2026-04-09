## ADDED Requirements

### Requirement: Hot Topics Module Structure

The system SHALL render a "热门专题" (Hot Topics) module on the homepage between the search box and the channel categories section.

#### Scenario: Module renders on homepage
- **WHEN** a user loads the homepage
- **THEN** the hot topics module SHALL be displayed between the search box and channel list

#### Scenario: Module contains 5 topic cards
- **WHEN** the hot topics module is rendered
- **THEN** it SHALL display exactly 5 topic cards:
  1. USA IPTV - links to `/usa-iptv`
  2. UK IPTV - links to `/uk-iptv-plans`
  3. Smart TV - links to `/tutorial`
  4. Android IPTV - links to `/android-iptv-app`
  5. Free IPTV - links to `/free-iptv-app-review`

#### Scenario: Each card has required elements
- **WHEN** a topic card is rendered
- **THEN** it SHALL display: an icon (emoji), a title, a short description
- **AND** the card SHALL be clickable with a link to the corresponding page

### Requirement: Responsive Layout

The hot topics module SHALL use responsive layout that adapts to screen size.

#### Scenario: Desktop layout
- **WHEN** viewed on desktop (screen width >= 1024px)
- **THEN** the 5 cards SHALL be displayed in a single row with equal width

#### Scenario: Tablet layout
- **WHEN** viewed on tablet (screen width >= 640px and < 1024px)
- **THEN** the cards SHALL wrap to 2 rows as needed

#### Scenario: Mobile layout
- **WHEN** viewed on mobile (screen width < 640px)
- **THEN** the cards SHALL be displayed in a 2-column grid

### Requirement: Visual Consistency

The hot topics cards SHALL visually match the existing homepage design system.

#### Scenario: Card styling matches theme
- **WHEN** cards are rendered
- **THEN** they SHALL use CSS variables consistent with the homepage:
  - Card background: `var(--bg-card)` or similar
  - Accent color: `var(--accent)` or Netflix red `#e50914`
  - Text colors: `var(--text-primary)` and `var(--text-secondary)`
