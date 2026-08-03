## 1. Remove Free Subscription Files

- [x] 1.1 Delete `handlers/freesub.js`
- [x] 1.2 Delete `handlers/freesub-api.js`
- [x] 1.3 Delete `freesub-page.js`
- [x] 1.4 Remove `/freesub/*` routes from `worker.js`
- [x] 1.5 Remove `handleFreeSubAPI` import from `worker.js`

## 2. Remove Free Subscription Database Schema

- [x] 2.1 Remove `free_subscriptions` table creation from `database.js`
- [x] 2.2 Remove `checkin_records` table creation from `database.js`
- [x] 2.3 Remove `idx_free_subscriptions_*` indexes
- [ ] 2.4 DROP existing `free_subscriptions` table in D1 (manual SQL)
- [ ] 2.5 DROP existing `checkin_records` table in D1 (manual SQL)
- [x] 2.6 Remove `freesub-page.js` imports from `worker.js`

## 3. Create VIP Favorites Database Layer

- [x] 3.1 Add `user_favorites` table creation to `database.js`
- [x] 3.2 Create indexes for `user_favorites` (user_id primary, updated_at)
- [x] 3.3 Add `getUserFavorites(userId)` function
- [x] 3.4 Add `saveUserFavorites(userId, favorites)` function
- [x] 3.5 Add `addFavoriteToUser(userId, channelHash)` function
- [x] 3.6 Add `removeFavoriteFromUser(userId, channelHash)` function

## 4. Add VIP Status Check

- [x] 4.1 Add `isVIPUser(userId)` function to `handlers/auth.js`
- [x] 4.2 Check `user_orders` table for valid subscription (expired_at > now)
- [x] 4.3 Export `isVIPUser` for use in other handlers

## 5. Refactor Favorites Page (Frontend)

- [x] 5.1 Modify `pages/favorites-page.js` to detect user VIP status
- [x] 5.2 Implement localStorage favorites for non-VIP users
- [x] 5.3 Implement 50 favorites limit check for non-VIP users
- [x] 5.4 Add toast notification when limit reached: "收藏已满，升级VIP解锁无限收藏"
- [x] 5.5 Implement D1 favorites loading for VIP users
- [x] 5.6 Implement 5-minute sync interval for VIP favorites
- [x] 5.7 Show VIP badge/indicator for VIP users on favorites page

## 6. Add Favorites API Endpoints (VIP)

- [x] 6.1 Create `handlers/favorites-api.js` with GET/POST/DELETE handlers
- [x] 6.2 Add `GET /api/favorites` - get user favorites from D1
- [x] 6.3 Add `POST /api/favorites` - add channel to favorites
- [x] 6.4 Add `DELETE /api/favorites` - remove channel from favorites
- [x] 6.5 Add `PUT /api/favorites/sync` - bulk sync favorites to D1
- [x] 6.6 Add routes in `worker.js` for `/api/favorites/*`

## 7. Update Existing Routes for VIP Logic

- [x] 7.1 Update `favorites-page.js` SSR to pass VIP status
- [x] 7.2 Update `/favorites.m3u` route to use D1 for VIP users (already supported via verifyUserSession)
- [x] 7.3 Ensure favorites M3U works for both localStorage and D1 sources (already working)

## 8. Testing

- [ ] 8.1 Test non-VIP user: add 50 favorites (should work)
- [ ] 8.2 Test non-VIP user: add 51st favorite (should show toast)
- [ ] 8.3 Test VIP user: add more than 50 favorites (should work)
- [ ] 8.4 Test VIP favorites sync to D1
- [ ] 8.5 Test favorites page loads correctly for both user types
- [ ] 8.6 Verify free subscription routes return 404
- [ ] 8.7 Run playwright tests

## 9. Cleanup

- [x] 9.1 Verify no remaining freesub references (removed)
- [x] 9.2 checkin.js doesn't exist (no removal needed)
- [x] 9.3 Update AGENTS.md with new routes