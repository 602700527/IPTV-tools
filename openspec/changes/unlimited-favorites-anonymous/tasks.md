## 1. Frontend Constants Update (favorites-page.js)

- [x] 1.1 Remove `MAX_FREE_FAVORITES = 50` constant (no longer needed)
- [x] 1.2 Change `MAX_FREE_DOWNLOAD = 100` to `MAX_FREE_DOWNLOAD = 50`
- [x] 1.3 Add `const DISPLAY_LIMIT = 50` for render limit

## 2. addFavorite Function Update

- [x] 2.1 Remove the `if (!isVIP && favorites.length >= MAX_FREE_FAVORITES)` check that blocks adding
- [x] 2.2 Keep duplicate check `favorites.some(f => f.hash === channel.hash)`
- [x] 2.3 Keep localStorage save for all users
- [x] 2.4 Keep VIP cloud sync call for VIP users

## 3. saveFavorites Function Update

- [x] 3.1 Ensure all users save to localStorage (already works)
- [x] 3.2 Ensure VIP users additionally call `saveVIPFavorites` (already works)
- [x] 3.3 No changes needed - verify existing logic handles "save local first"

## 4. renderFavorites Function - Add Blur Overlay

- [x] 4.1 Add condition to check `!isVIP && favorites.length > DISPLAY_LIMIT`
- [x] 4.2 Slice favorites array to first 50 items for rendering
- [x] 4.3 Append blur overlay HTML after visible channels
- [x] 4.4 Ensure VIP users or ≤50 items render all without blur

## 5. Blur Overlay UI Implementation

- [x] 5.1 Create blur overlay HTML structure with lock icon
- [x] 5.2 Display hidden count: "已隐藏 {hiddenCount} 个频道"
- [x] 5.3 Display marketing text: "开通 VIP 会员解锁全部收藏，无限制浏览"
- [x] 5.4 Add CTA button linking to /plans
- [x] 5.5 Add CSS styling for blur effect (backdrop-filter: blur)

## 6. updateFavoritesInfo Function Update

- [x] 6.1 Update non-VIP info text to show total count and "显示前50条"
- [x] 6.2 Example: "已收藏 {total} 个频道，显示前 50 条 | 升级VIP解锁"
- [x] 6.3 Keep VIP info text unchanged ("VIP会员：无限收藏")

## 7. downloadSelectedM3U Function Update

- [x] 7.1 Update download limit message from 100 to 50
- [x] 7.2 Update marketing message to reference 50 channels
- [x] 7.3 Ensure download limit check matches DISPLAY_LIMIT

## 8. Backend Download Limit (public.js)

- [x] 8.1 Change `MAX_FREE_CHANNELS = 100` to `MAX_FREE_CHANNELS = 50` in handleFavoritesM3U
- [x] 8.2 Verify handleChannelsM3U also has correct limit (should be 100 for general downloads)

## 9. Testing Verification

- [ ] 9.1 Test anonymous user can add favorites without login
- [ ] 9.2 Test non-VIP with >50 favorites sees blur overlay
- [ ] 9.3 Test non-VIP download limited to 50 channels
- [ ] 9.4 Test VIP user sees all favorites without blur
- [ ] 9.5 Test VIP download has no limit
- [ ] 9.6 Test duplicate favorite warning still works