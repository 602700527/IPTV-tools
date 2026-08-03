## Context

**Current State:**
- Favorites require login to add (returns 401/403 for non-VIP)
- Non-VIP users limited to 50 favorites when adding
- Download limited to 100 channels for non-VIP
- Storage: non-VIP uses localStorage, VIP uses D1 cloud

**Desired State:**
- Any user (anonymous or logged in) can add favorites without login
- No quantity limit when adding favorites
- Non-VIP displays only first 50 favorites, rest hidden behind blur overlay
- Download limited to 50 channels for non-VIP
- Storage: all save to localStorage first, VIP syncs to cloud

**Constraints:**
- VIP-only API (`/api/favorites`) must remain unchanged (it's the cloud sync mechanism)
- Non-VIP users cannot access cloud API
- localStorage has typical 5-10MB limit per domain

## Goals / Non-Goals

**Goals:**
- Remove login requirement for adding favorites
- Remove quantity limit on adding favorites
- Implement blur overlay for non-VIP showing >50 favorites
- Align download limit with display limit (50)

**Non-Goals:**
- No changes to VIP cloud sync API
- No changes to database schema
- No anonymous cloud storage (only local for non-VIP)

## Decisions

### Decision 1: Storage Strategy - "Save Local First, Sync Cloud for VIP"

**Chosen Approach:**
1. All favorites save to localStorage regardless of VIP status
2. VIP users additionally sync to cloud (D1) via API
3. On VIP login, local + cloud merge, deduplicate, push to cloud, clear local

**Alternatives Considered:**
- Separate storage: Keep VIP in cloud only, non-VIP in local only
  - Problem: User loses local favorites if they become VIP

**Rationale:** This ensures data persistence for both user types while maintaining the cloud sync benefit for VIP users.

### Decision 2: Blur Overlay Rendering

**Chosen Approach:**
- Render only first 50 items in DOM
- Append blur overlay div after visible items
- Blur overlay contains: lock icon, hidden count, marketing text, upgrade CTA

**Alternatives Considered:**
- Render all items, use CSS blur on hidden items
  - Problem: DOM still contains all items (security concern)

**Rationale:** Only rendering visible items avoids exposing hidden data in DOM.

### Decision 3: Download Limit Alignment

**Chosen Approach:**
- Non-VIP download: 50 channels (matching display limit)
- VIP download: unlimited

**Rationale:** Consistency between what's shown and what's downloadable prevents user confusion.

## Risks / Trade-offs

[Risk] localStorage overflow for non-VIP with many favorites
→ Mitigation: localStorage typically allows 5-10MB. At ~200 bytes per favorite, that's 25,000+ channels. Unlikely to exceed, but if so, oldest favorites would need to be pruned.

[Risk] VIP user loses local favorites if browser storage cleared
→ Mitigation: On VIP login, existing cloud favorites remain. User can re-add if needed.

[Risk] Blur overlay confuses users who don't understand why content is hidden
→ Mitigation: Clear marketing copy "开通VIP解锁全部收藏" explains the upgrade path.

## Open Questions

1. Should we show a one-time prompt when non-VIP user reaches 50 favorites suggesting upgrade?
   - **Decision:** Yes, the blur overlay itself serves as this prompt.

2. What happens when non-VIP user with 150 favorites becomes VIP?
   - **Flow:** Detect VIP → merge local(150) + cloud(?) → deduplicate → push to cloud → clear local
   - **Note:** This is handled by existing loadVIPFavorites/saveVIPFavorites logic.

3. Does VIP downgrade revert to cloud-only storage?
   - **Decision:** No, localStorage retains existing favorites. Downgrade simply stops cloud sync.