# VIP Member Badge - Implementation Tasks

## 1. Account Page - VIP Card HTML Structure

- [x] 1.1 Add VIP status card HTML above the account info section in `account-page.js`
- [x] 1.2 Include tier icon (👑), tier name, subscription type label
- [x] 1.3 Add subscription code display with copy button
- [x] 1.4 Add expiry date display
- [x] 1.5 Add action buttons (续费会员, 查看套餐)

## 2. Account Page - VIP Card CSS Styling

- [x] 2.1 Add `.vip-status-card` styles matching dark theme
- [x] 2.2 Add `.vip-header` with icon and tier info layout
- [x] 2.3 Add tier-based crown filter classes (silver, blue, gold, rainbow)
- [x] 2.4 Add `.vip-subscription` section styles
- [x] 2.5 Add `.vip-actions` button styles
- [x] 2.6 Add responsive styles for mobile view

## 3. Account Page - VIP Card JavaScript Logic

- [x] 3.1 Check subscription status on page load
- [x] 3.2 Show VIP card only when active subscription exists
- [x] 3.3 Hide VIP card when no subscription
- [x] 3.4 Show expired state with "已过期" badge when expired
- [x] 3.5 Implement copy to clipboard function with toast

## 4. Subscription Stacking Logic

- [x] 4.1 Locate subscription purchase handler (likely in `handlers/subscription-api.js` or payment handlers)
- [x] 4.2 Implement `calculateNewExpiry(existingExpiry, newDurationDays)` function
- [x] 4.3 Update purchase flow to stack duration instead of replace
- [x] 4.4 Ensure tier stays at the higher level when stacking
- [x] 4.5 Handle edge case when existing subscription is expired

## 5. Testing

- [ ] 5.1 Test VIP card display for each tier (Monthly, Quarterly, Yearly, Permanent)
- [ ] 5.2 Test copy button functionality
- [ ] 5.3 Test subscription stacking with active subscription
- [ ] 5.4 Test subscription stacking with expired subscription
- [ ] 5.5 Test responsive layout on mobile viewports
