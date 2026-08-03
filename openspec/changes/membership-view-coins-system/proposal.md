## Why

The current system lacks a unified membership and engagement mechanism. Free subscription users and paid users operate on separate systems with no incentive loop. By introducing View Coins (收视币), Check-in streaks, Agent commissions, and a layered favorites system, we create a sustainable engagement loop that drives both user retention and revenue.

## What Changes

### New Capabilities
- **View Coins System**: Unified currency for check-in rewards, referral bonuses, and VIP redemption
- **Check-in System (v2)**: Based on `users` table (replacing old system based on `free_subscriptions`), with daily lottery and streak milestones
- **VIP Experience Card System**: Check-in milestone rewards (2 weeks) and coins redemption (1 month)
- **Agent Referral System**: Commission-based promotion system with tiered agent levels (10%/15%/20%)
- **Commission Withdrawal System**: Manual withdrawal application with 500 RMB minimum threshold
- **Layered Favorites Storage**: localStorage for regular users, D1 cloud sync for VIP users

### Modifications
- **User Registration**: Auto-generate `referral_code`, track `referrer_id` from URL parameter
- **VIP Status Check**: Expand to include `vip_expired_at` from experience cards (not just codes table)

### Breaking Changes
- **Remove**: `free_subscriptions` table and related `freesub-api.js`
- **Remove**: `/api/freesub/*` routes
- **Remove**: Old `checkin_records` table (replaced by `user_checkin_records`)
- **Remove**: All "Free Subscription" UI elements → replaced with "Login to Save Favorites"

## Capabilities

### New Capabilities
- `view-coins`: Core currency system with earn/spend logic and transaction history
- `check-in-v2`: Daily check-in with lottery bonus and consecutive day tracking
- `vip-experience-card`: Experience card granting and activation (check-in reward + coins redemption)
- `agent-referral`: Referral tracking with commission calculation and tier upgrades
- `agent-commission`: Commission records, withdrawal application, and settlement tracking
- `layered-favorites`: Dual-storage favorites (localStorage for regular, D1 for VIP)

### Modified Capabilities
- `user-auth`: Add referral tracking fields and View Coins balance
- `vip-status`: Expand check to include experience card expiration

## Impact

### Code Changes
- **New files**: `handlers/coins-api.js`, `handlers/checkin-v2.js`, `handlers/agent-api.js`
- **Modified files**: `handlers/auth.js`, `database.js`, `worker.js`
- **Deleted files**: `handlers/freesub-api.js`, `handlers/checkin.js`

### Database Changes
- **Alter users table**: Add 8 new columns (view_coins, consecutive_checkin_days, last_checkin_date, referral_code, referrer_id, agent_level, vip_expired_at, total_commission)
- **New tables**: user_checkin_records, user_coins_history, vip_experience_cards, user_favorites, agent_referrals, agent_commissions
- **Drop tables**: free_subscriptions, checkin_records

### API Changes
- **New endpoints**:
  - `POST /api/coins/check-in` - Check-in with lottery
  - `GET /api/coins/balance` - View coins balance and history
  - `POST /api/coins/redeem` - Redeem coins for VIP
  - `GET /api/agent/dashboard` - Agent commission stats
  - `POST /api/agent/withdraw` - Withdrawal application
  - `GET /api/favorites` - Get favorites (VIP only)
  - `POST /api/favorites` - Save favorite (VIP only)
  - `DELETE /api/favorites/:hash` - Remove favorite

### Frontend Changes
- **New pages**: Check-in page, View Coins wallet, Agent dashboard, Favorites management
- **Modified pages**: Category page (remove free subscription), Account page (add coins/agent tabs)
- **New components**: Lottery animation, Streak progress bar, Promo poster generator