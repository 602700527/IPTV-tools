## ADDED Requirements

### Requirement: Plan promo activation
The system SHALL allow each subscription plan to have an optional time-limited promotional configuration, consisting of a promo end datetime, a promo discount percentage, and a promo label text.

### Requirement: Promo activation logic
A plan's promo SHALL be considered **active** when ALL of the following conditions are met:
- `promo_end_date` is not null
- `promo_end_date` is strictly after the current UTC datetime
- `promo_discount` is greater than 0

#### Scenario: Promo is active
- **WHEN** a plan has `promo_end_date` = "2026-05-20T23:59:59Z", `promo_discount` = 30, and current UTC time is "2026-05-14T12:00:00Z"
- **THEN** `isPromoActive` SHALL be `true`

#### Scenario: Promo has expired
- **WHEN** a plan has `promo_end_date` = "2026-05-14T12:00:00Z", `promo_discount` = 30, and current UTC time is "2026-05-14T12:00:01Z"
- **THEN** `isPromoActive` SHALL be `false`

#### Scenario: Promo discount is zero
- **WHEN** a plan has `promo_end_date` = "2026-05-20T23:59:59Z", `promo_discount` = 0, and current UTC time is before the end date
- **THEN** `isPromoActive` SHALL be `false`

#### Scenario: No promo end date set
- **WHEN** a plan has `promo_end_date` = null
- **THEN** `isPromoActive` SHALL be `false`

### Requirement: Admin CRUD for promo fields
The admin panel SHALL allow administrators to configure and persist the three promo fields (`promo_end_date`, `promo_discount`, `promo_label`) for each subscription plan via the existing plan management modal.

### Requirement: Public API returns promo fields
The public endpoint `GET /api/mall/plans` SHALL return the three promo fields for every enabled plan, allowing frontend clients to render promotional information.

### Requirement: Homepage promo banner
When any enabled plan has an active promo, the homepage SHALL display a promotional banner section with:
- The `promo_label` text from the plan with the earliest `promo_end_date`
- A live countdown timer showing days/hours/minutes/seconds remaining until the earliest promo ends
- The banner SHALL automatically disappear when all promos have expired

### Requirement: Subscription page promo display
The subscription page SHALL display for each plan with an active promo:
- The `promo_label` badge (e.g., "🔥 Limited Time")
- The promo price (discounted) alongside the original price with strikethrough
- A live countdown timer specific to that plan's `promo_end_date`

### Requirement: Promo auto-expiry
The system SHALL NOT require administrator action to deactivate a promo once its `promo_end_date` has passed. The promo is considered inactive purely by datetime comparison at request time.