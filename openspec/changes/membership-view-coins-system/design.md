## Context

### Current State
The system currently has two parallel user engagement systems:
1. **Free Subscription System**: Based on `free_subscriptions` table, users get free access by IP/fingerprint, check-in extends subscription by 30 days
2. **Paid Subscription System**: Users purchase codes via Xunhupay, check-in is not relevant

### Problem
- No unified currency/points system
- Free users and paid users are siloed
- No referral/agent system for organic growth
- No engagement loop to retain users
- D1 storage for favorites not分层 (all users have no cloud favorites)

### Constraints
- **D1 Free Tier**: 1000万 reads/day, 10万 writes/month - must optimize
- **Cloudflare Workers**: Limited CPU time, no long-running tasks
- **Existing Users**: Migration must handle existing `free_subscriptions` and `checkin_records`
- **No Email Service** (currently used for verification only): Agent withdrawal notifications need email integration

## Goals / Non-Goals

**Goals:**
- Create unified View Coins (收视币) system as single currency for all engagement rewards
- Replace fragmented check-in system with new v2 based on `users` table
- Build Agent system with tiered commissions (10%/15%/20%) and withdrawal capability
- Implement layered favorites: localStorage for regular users, D1 for VIP
- Remove `free_subscriptions` table and related code to simplify architecture

**Non-Goals:**
- Real-time commission withdrawal (manual review process is acceptable)
- Social features (sharing to social media platforms directly)
- Multiple currency support (only View Coins)
- Automatic agent tier downgrade (once achieved, level persists)

## Decisions

### Decision 1: View Coins stored in users table, history in separate table

**Choice**: Store `view_coins` balance in `users` table, transaction history in `user_coins_history`

**Rationale**:
- Fast balance check (single row lookup)
- History enables audit trail and dispute resolution
- Balance in users table = atomic update with user operations

**Alternative Considered**: Store only in history table, calculate balance on-the-fly
- Rejected: Would require expensive SUM queries for every balance check

### Decision 2: Check-in records keep only last 30 days

**Choice**: Auto-delete check-in records older than 30 days

**Rationale**:
- Limits table growth (max ~30 records per user)
- Consecutive days beyond 30 reset anyway (anti-cheat)
- 30 days is enough for legitimate streak tracking

**Alternative Considered**: Keep all records
- Rejected: Unbounded growth, D1 storage costs

### Decision 3: Experience card auto-activation on grant

**Choice**: Check-in milestone cards are automatically activated

**Rationale**:
- User receives reward immediately (surprise & delight)
- Simpler UX - no "activate now" button needed
- Expired cards never accidentally left unactivated

**Alternative Considered**: Manual activation with scheduled time
- Rejected: Adds complexity with marginal benefit

### Decision 4: Commission calculated at purchase time, stored immediately

**Choice**: Calculate and store commission when referred user completes purchase

**Rationale**:
- Deterministic - commission rate based on agent's level at purchase time
- Avoids recalculation issues if agent level changes later
- Simpler than maintaining historical rate references

**Alternative Considered**: Calculate on withdrawal
- Rejected: Rate changes could cause disputes

### Decision 5: Favorites stored as JSON array in single D1 row per user

**Choice**: Single row `user_favorites` with `channel_hashes` as JSON text

**Rationale**:
- Minimizes D1 writes (1 row per user regardless of favorites count)
- Atomic updates via JSON string manipulation
- Simple query (SELECT by user_id)

**Alternative Considered**: One row per favorite (channel_hash, user_id)
- Rejected: Every add/remove is a write. With 1000 users × 100 favorites = 100K rows, higher write usage

**Trade-off**: Cannot use SQL queries on individual favorites
- Mitigation: Parse JSON in application layer

### Decision 6: Agent level upgrade is permanent, downgrade not implemented

**Choice**: Level upgrades are permanent; no automatic downgrade

**Rationale**:
- Reduces complexity (no re-evaluation logic)
- Encourages long-term commitment
- "What you earned stays earned" - good user psychology

**Alternative Considered**: Monthly re-evaluation based on recent referrals
- Rejected: Would require cron job and additional tracking

## Risks / Trade-offs

[Risk: D1 write quota exhaustion] → [Mitigation: All regular user favorites use localStorage, only VIP users write to D1. Target: ~10% of users are VIP, reducing writes by 90%]

[Risk: View Coins inflation/devaluation] → [Mitigation: Earn rates are conservative (1-10 coins/day), redemption is finite (30 coins = 1 month VIP). Monitor economy via admin dashboard]

[Risk: Agent referral fraud (fake signups)] → [Mitigation: Require email verification for all users. Track IP + fingerprint for duplicate detection. Commission only on paid users, not just registrations]

[Risk: Experience card expiration confusion] → [Mitigation: Show countdown timer on VIP badge. Send notification 3 days before expiration. Clear visual distinction between "experience" vs "paid" VIP]

[Risk: Lottery algorithm bias] → [Mitigation: Use cryptographically secure Random (crypto.getRandomValues), not Math.random. Results verifiable server-side]

[Risk: User confusion about coins vs commission] → [Mitigation: Separate UI sections for "View Coins" (for rewards) and "Commission" (for cash). Different colors/icons. Clear labeling]

## Migration Plan

### Phase 1: Database Migration
1. Add new columns to `users` table (backward compatible - all defaults)
2. Create new tables (user_checkin_records, user_coins_history, vip_experience_cards, user_favorites, agent_referrals, agent_commissions)
3. Create indexes for performance
4. **No data migration from old tables yet**

### Phase 2: Deploy New Handlers
1. Deploy `coins-api.js`, `checkin-v2.js`, `agent-api.js`
2. Add new routes to `worker.js`
3. Keep old handlers (`freesub-api.js`, old `checkin.js`) running but disable new signups

### Phase 3: Frontend Changes
1. Add "Login to Save Favorites" prompts
2. Implement check-in page with lottery animation
3. Add View Coins wallet page
4. Add Agent dashboard page

### Phase 4: Cutover
1. Disable old check-in logic in `freesub-api.js`
2. Archive old tables (no delete - preserve data)
3. Remove "Free Subscription" UI elements
4. Enable full new system

### Rollback Plan
- Old handlers kept alive during transition period
- Database changes are backward compatible
- Feature flag system not needed (new endpoints are distinct)

## Open Questions

1. **Email notification for agent withdrawal approval**: Should we implement email sending for withdrawal status changes? (Currently only verification emails are implemented)

2. **Admin panel for commission review**: Manual review requires admin interface. Should we build `/admin/commissions` page or is direct DB manipulation acceptable for v1?

3. **Minimum withdrawal amount**: 500 RMB confirmed, but should there be a processing fee deducted?

4. **Experience card stacking**: If user has both check-in card (14 days) and exchange card (30 days), do they stack or replace? → **Decision: Stack, add durations**

5. **Commission payout currency**: RMB only or support USD via PayPal? → **Decision: RMB only for v1, add USD later if demand exists