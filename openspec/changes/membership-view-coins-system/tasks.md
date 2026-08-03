## 1. Database Migration

- [ ] 1.1 Add new columns to `users` table (view_coins, consecutive_checkin_days, last_checkin_date, referral_code, referrer_id, agent_level, vip_expired_at, total_commission)
- [ ] 1.2 Create `user_checkin_records` table
- [ ] 1.3 Create `user_coins_history` table
- [ ] 1.4 Create `vip_experience_cards` table
- [ ] 1.5 Create `user_favorites` table (for VIP cloud sync)
- [ ] 1.6 Create `agent_referrals` table
- [ ] 1.7 Create `agent_commissions` table
- [ ] 1.8 Create indexes for all new tables
- [ ] 1.9 Add migration script to database.js

## 2. User Registration Enhancement

- [ ] 2.1 Auto-generate unique `referral_code` on registration (6-char alphanumeric)
- [ ] 2.2 Extract `?ref=CODE` from registration URL and save as `referrer_id`
- [ ] 2.3 Prevent duplicate referrer assignment (one per user)
- [ ] 2.4 Add `referral_code` field to user info response

## 3. View Coins System

- [ ] 3.1 Implement `POST /api/coins/check-in` (check-in + lottery)
- [ ] 3.2 Implement `GET /api/coins/balance` (balance + history)
- [ ] 3.3 Implement `POST /api/coins/add` (internal, for add coins)
- [ ] 3.4 Implement `POST /api/coins/deduct` (internal, for redeem)
- [ ] 3.5 Lottery algorithm using crypto.getRandomValues
- [ ] 3.6 Update `user_coins_history` on every transaction
- [ ] 3.7 Add daily earning cap check (max 100 coins/day)

## 4. Check-in System v2

- [ ] 4.1 Track consecutive days (compute on-demand, not store)
- [ ] 4.2 Check if already checked in today (by checkin_date)
- [ ] 4.3 Reset streak if gap > 1 day between check-ins
- [ ] 4.4 Trigger VIP Experience Card grant at day 10
- [ ] 4.5 Implement `GET /api/coins/check-in/status`

## 5. VIP Experience Card System

- [ ] 5.1 Auto-create card record on check-in milestone
- [ ] 5.2 Auto-activate checkin_gift cards immediately
- [ ] 5.3 Implement `GET /api/vip/cards` endpoint
- [ ] 5.4 Implement manual activation for exchange_gift cards
- [ ] 5.5 Update `users.vip_expired_at` on activation
- [ ] 5.6 VIP status check: cards first, then codes table

## 6. Agent Referral System

- [ ] 6.1 Implement `GET /api/agent/referrals` endpoint
- [ ] 6.2 Generate referral link (APP_URL + ?ref=CODE)
- [ ] 6.3 Award 5 coins to referrer on referred registration
- [ ] 6.4 Award 10 coins to referred user on registration
- [ ] 6.5 Award 5 coins to referrer on referred first check-in
- [ ] 6.6 Award 30 coins to referrer when referred becomes paid
- [ ] 6.7 Track referral in agent_referrals table
- [ ] 6.8 Update is_paid_user flag when referred purchases

## 7. Agent Commission System

- [ ] 7.1 Calculate commission rate based on agent level (10%/15%/20%)
- [ ] 7.2 Create agent_commissions record on purchase
- [ ] 7.3 Implement `GET /api/agent/commissions` endpoint
- [ ] 7.4 Auto-upgrade agent level based on conditions
- [ ] 7.5 Implement `POST /api/agent/withdraw` (min 500 RMB)
- [ ] 7.6 Update total_commission on withdrawal
- [ ] 7.7 Admin endpoint to approve/reject withdrawals

## 8. Layered Favorites System

- [ ] 8.1 Implement `GET /api/favorites` (VIP only, returns D1 data)
- [ ] 8.2 Implement `POST /api/favorites/sync` (batch sync, overwrite style)
- [ ] 8.3 Implement `POST /api/favorites/batch-update` (incremental style)
- [ ] 8.4 Check VIP status before favorites API access
- [ ] 8.5 Return 403 for non-VIP users on favorites API
- [ ] 8.6 Frontend: localStorage write buffer for VIP users
- [ ] 8.7 Frontend: 5-minute interval sync check
- [ ] 8.8 Frontend: beforeunload sendBeacon sync
- [ ] 8.9 Frontend: dirty flag management
- [ ] 8.10 Frontend: upgrade from local to cloud sync on VIP activation

## 9. Frontend - Check-in Page

- [ ] 9.1 Create check-in page with lottery animation
- [ ] 9.2 Display consecutive streak progress bar (10 days)
- [ ] 9.3 Show today's check-in status (done/not done)
- [ ] 9.4 Display earned coins and lottery result
- [ ] 9.5 Show next milestone reward info

## 10. Frontend - View Coins Wallet

- [ ] 10.1 Create wallet page with balance display
- [ ] 10.2 Show recent transaction history (last 50)
- [ ] 10.3 Display "Redeem for VIP" button
- [ ] 10.4 Redeem confirmation modal (30 coins = 1 month)

## 11. Frontend - Agent Dashboard

- [ ] 11.1 Create dashboard with referral stats
- [ ] 11.2 Generate and display referral link
- [ ] 11.3 Show commission balance and history
- [ ] 11.4 Display current agent level and upgrade progress
- [ ] 11.5 "Request Withdrawal" button (min 500 RMB)

## 12. Frontend - Favorites Management

- [ ] 12.1 Add favorites button to channel list
- [ ] 12.2 localStorage implementation for regular users
- [ ] 12.3 D1 sync implementation for VIP users
- [ ] 12.4 Display favorites list (merged view)
- [ ] 12.5 Remove favorite functionality
- [ ] 12.6 "Login to Save" prompt for non-authenticated users

## 13. Frontend - Remove Free Subscription UI

- [ ] 13.1 Remove "Free Subscription" from category page
- [ ] 13.2 Replace with "Login to Save Favorites" prompt
- [ ] 13.3 Remove "Free Trial" from account page
- [ ] 13.4 Update all navigation items referencing freesub

## 14. Code Cleanup

- [ ] 14.1 Remove handlers/freesub-api.js
- [ ] 14.2 Remove old handlers/checkin.js (or archive)
- [ ] 14.3 Remove free_subscriptions table references
- [ ] 14.4 Remove /api/freesub/* routes from worker.js
- [ ] 14.5 Archive old tables (do not delete, preserve data)

## 15. Testing

- [ ] 15.1 Test check-in flow (new user, streak tracking)
- [ ] 15.2 Test lottery randomness (verify distribution)
- [ ] 15.3 Test referral flow (both parties receive coins)
- [ ] 15.4 Test commission calculation at each agent level
- [ ] 15.5 Test withdrawal (success and failure cases)
- [ ] 15.6 Test favorites (localStorage vs D1 based on VIP status)
- [ ] 15.7 Test VIP status resolution (cards vs paid)