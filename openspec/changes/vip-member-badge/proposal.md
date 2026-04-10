# VIP Member Badge - Change Proposal

## Why

Currently, paying members have no visual recognition of their VIP status on the platform. The account center page lacks a prominent member tier display, making it difficult for users to perceive the value of their subscription. Adding a VIP badge system will enhance user experience and reinforce the perceived value of paid memberships.

Additionally, the subscription stacking logic needs to be implemented to support duration accumulation when members renew or purchase additional subscription periods.

## What Changes

1. **Account Center VIP Card**
   - Add a prominent VIP status card at the top of the account info section
   - Display member tier (Monthly/Quarterly/Yearly/Permanent) with distinct icon and color
   - Show subscription details: subscription code, expiry date
   - Include action buttons: "Renew" and "View Plans"

2. **VIP Tier Visual System**
   - Single crown icon (👑) with CSS color differentiation
   - Monthly: Silver crown
   - Quarterly: Blue crown
   - Yearly: Gold crown
   - Permanent: Rainbow gradient crown

3. **Subscription Stacking Logic**
   - When a member purchases a new subscription, add duration to existing expiry
   - If subscription expired, start from current date
   - If member upgrades tier, maintain the higher tier

## Capabilities

### New Capabilities

- `vip-badge-display`: Visual VIP badge/card component for account center page, showing member tier with icon-color differentiation and subscription details

### Modified Capabilities

- `subscription-purchase`: Update purchase logic to stack subscription duration instead of replacing

## Impact

**Files Modified:**
- `account-page.js` - Add VIP status card HTML and styles
- `handlers/subscription-api.js` or `handlers/xunhupay-api.js` - Update subscription stacking logic

**New Dependencies:**
- None

**Database Changes:**
- None (uses existing `codes` table structure)

**API Changes:**
- `/api/member/status` response may need to include tier information (if not already)
