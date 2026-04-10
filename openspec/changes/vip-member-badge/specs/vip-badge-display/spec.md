# VIP Badge Display Specification

## Overview

Display a prominent VIP membership status card in the account center page, showing the member's tier, subscription code, and expiry date with visual distinction using a crown icon with CSS color differentiation.

## ADDED Requirements

### Requirement: VIP status card display

The system SHALL display a VIP status card in the account center page when the user has an active subscription. The card SHALL be positioned above the account info section.

### Requirement: Member tier visual differentiation

The system SHALL display member tier using a single crown icon (👑) with CSS color differentiation:

| Tier | Duration | CSS Filter | Visual Effect |
|------|----------|------------|---------------|
| Monthly | 1 month | `grayscale(100%) brightness(1.5)` | Silver crown |
| Quarterly | 3 months | `hue-rotate(200deg)` | Blue crown |
| Yearly | 12 months | None (default) | Gold crown |
| Permanent | Indefinite | `hue-rotate(300deg) saturate(1.5)` | Rainbow crown |

#### Scenario: Display monthly member badge
- **WHEN** user with monthly subscription views account center
- **THEN** crown icon appears silver (grayscale filter applied)

#### Scenario: Display quarterly member badge
- **WHEN** user with quarterly subscription views account center
- **THEN** crown icon appears blue (hue-rotate filter applied)

#### Scenario: Display yearly member badge
- **WHEN** user with yearly subscription views account center
- **THEN** crown icon appears gold (no filter)

#### Scenario: Display permanent member badge
- **WHEN** user with permanent subscription views account center
- **THEN** crown icon appears with rainbow effect

### Requirement: Subscription details display

The VIP card SHALL display:
- Member tier name (尊享/进阶/至尊/至尊皇冠)
- Subscription type label (月度订阅/季度订阅/年度订阅/永久)
- Subscription code (truncated with copy button)
- Expiry date in YYYY-MM-DD format

#### Scenario: Display subscription with active expiry
- **WHEN** user with active subscription views account center
- **THEN** VIP card shows subscription code and expiry date

#### Scenario: Display expired subscription
- **WHEN** user with expired subscription views account center
- **THEN** VIP card shows "已过期" badge and prominent renewal button

### Requirement: Subscription code copy functionality

The system SHALL provide a one-click copy button to copy the subscription URL to clipboard.

#### Scenario: Copy subscription code
- **WHEN** user clicks copy button on VIP card
- **THEN** subscription URL is copied to clipboard
- **AND** toast notification "已复制" appears

### Requirement: No subscription state

The system SHALL NOT display VIP card when user has no subscription history.

#### Scenario: No subscription - no VIP card shown
- **WHEN** user with no subscription views account center
- **THEN** no VIP status card is displayed

### Requirement: Subscription stacking on purchase

When a member purchases a new subscription, the system SHALL add the new duration to the existing subscription expiry date.

#### Scenario: Stack duration on active subscription
- **WHEN** user has 30 days remaining on active subscription
- **AND** user purchases 90 day subscription
- **THEN** new expiry = current_date + 30 + 90 = 120 days from now
- **AND** tier remains at the higher of the two tiers

#### Scenario: Stack duration on expired subscription
- **WHEN** user has expired subscription (past expiry date)
- **AND** user purchases 90 day subscription
- **THEN** new expiry = current_date + 90 days

### Requirement: Action buttons

The VIP card SHALL include:
- "续费会员" (Renew) button - links to /plans
- "查看套餐" (View Plans) button - links to /plans

#### Scenario: Click renew button
- **WHEN** user clicks "续费会员" button
- **THEN** user is navigated to /plans page
