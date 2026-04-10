# Member Ad-Free Specification

## Overview

Controls whether ads are displayed on public pages based on user membership status. Authenticated users with active subscriptions will not see ads when this feature is enabled.

## ADDED Requirements

### Requirement: Member ad-free detection

The system SHALL determine if a visitor qualifies as a "member" (ad-free user) by checking:
1. Valid user session token from cookie
2. User's `is_verified` field is `true`
3. User has at least one completed order with a non-expired activation code

### Requirement: Admin toggle for member ad-free

The system SHALL provide a `member_ad_free_enabled` setting in the `settings` table to globally enable or disable the member ad-free feature.

- When `true`: Eligible members see no ads
- When `false` or missing: All visitors see ads (default behavior)

### Requirement: Ad container conditional rendering

When rendering public HTML pages (homepage, category pages), the system SHALL:
1. Detect visitor's member status via session
2. If member AND feature enabled: Render ad containers with `data-hide-for-member="true"` attribute
3. If non-member OR feature disabled: Render ad containers normally

### Requirement: Member status injection

The system SHALL inject a JavaScript variable `window.IS_MEMBER = true|false` into page headers for frontend ad visibility control.

## MODIFIED Requirements

None.

## REMOVED Requirements

None.
