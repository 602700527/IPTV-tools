## Why

Currently, adding favorites requires login and non-VIP users are limited to 50 channels. This creates a barrier for anonymous users who want to try the service. We should allow anonymous users to add favorites without login, remove the 50-item limit on adding, and display a blur overlay for non-VIP users showing the first 50 items with marketing messaging to upgrade.

## What Changes

- **Remove login requirement for adding favorites**: Any user (anonymous or logged in) can add favorites
- **Remove quantity limit on adding**: Non-VIP users can add unlimited favorites to localStorage
- **Display limit with blur overlay**: Non-VIP users see only first 50 favorites, the rest are hidden behind a blur overlay with VIP upgrade messaging
- **Download limit**: Non-VIP users can download up to 50 channels in M3U (down from 100)
- **VIP users**: Full access with unlimited favorites, stored in cloud (D1)
- **Storage strategy**: All favorites saved to localStorage first. VIP users also sync to D1 cloud. When VIP user logs in, local favorites merge with cloud favorites, deduplicated.

## Capabilities

### New Capabilities
- `anonymous-favorites`: Allow anonymous (non-logged-in) users to add and store favorites locally without quantity limit, with display/download restrictions for non-VIP
- `favorites-blur-overlay`: Non-VIP users viewing >50 favorites see a blur overlay blocking items 51+, with marketing CTA to upgrade to VIP

### Modified Capabilities
- `user-favorites` (existing): Change requirement from "login required" to "login optional". Storage location unchanged (local for non-VIP, cloud for VIP). Add display truncation for non-VIP.

## Impact

### Affected Files
- `pages/favorites-page.js`: Core changes - remove 50-item add limit, add blur overlay rendering, update download limit
- `handlers/public.js`: Download limit 100→50 for non-VIP

### Unaffected (no changes needed)
- `handlers/favorites-api.js`: VIP-only API remains unchanged
- `database.js`: Storage schema unchanged
- `handlers/auth.js`: No changes

### Dependent Systems
- localStorage: Will store more data for non-VIP users (up to unlimited)
- D1: VIP favorites remain unchanged