# VIP Member Badge - Design Document

## Context

The account center page (`account-page.js`) currently displays user info and subscription details but lacks a prominent VIP status indicator. The existing dark theme uses Netflix-red accent color (#e50914). 

The platform has 4 membership tiers: Monthly, Quarterly, Yearly, Permanent. Members should see their tier with visual distinction using a single crown icon with color differentiation.

**Existing Design Language:**
- Primary accent: #e50914 (Netflix red)
- Background: #0a0a0a (dark), #141414 (card)
- Text: #ffffff (primary), rgba(255,255,255,0.6) (secondary)
- Border: rgba(255,255,255,0.1)

## Goals / Non-Goals

**Goals:**
- Display VIP membership tier with visual distinction on account center page
- Use single crown icon (👑) with CSS-only color differentiation per tier
- Show subscription code and expiry date prominently
- Support subscription duration stacking on purchase
- Maintain mobile-friendly responsive design

**Non-Goals:**
- No changes to homepage header/navigation (no VIP badge there)
- No new database tables required
- No changes to authentication flow

## Decisions

### 1. VIP Badge Visual Design

**Component:** `.vip-status-card`

```
┌─────────────────────────────────────────────────────┐
│  👑 至尊会员                    ┌──────────┐       │
│     年度订阅                      │  ACTIVE  │       │
│                                   └──────────┘       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  订阅地址                                           │
│  ┌───────────────────────────────────┐ [复制]     │
│  │ https://xxx.com/sub/xxxxx.m3u     │             │
│  └───────────────────────────────────┘             │
│                                                     │
│  到期时间                                           │
│  2026-04-10                                        │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐                 │
│  │   续费会员   │  │  查看套餐   │                 │
│  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────┘
```

### 2. Crown Icon Color Differentiation

Using CSS `filter` property on a single emoji icon:

| Tier | CSS Filter | Visual Effect |
|------|-----------|---------------|
| Monthly (尊享) | `grayscale(100%) brightness(1.5)` | Silver |
| Quarterly (进阶) | `hue-rotate(200deg)` | Blue |
| Yearly (至尊) | None (default gold) | Gold |
| Permanent (至尊皇冠) | `hue-rotate(300deg) saturate(1.5)` | Rainbow |

### 3. Subscription Stacking Logic

When processing a new subscription purchase:

```
function calculateNewExpiry(existingExpiry, newDurationDays) {
  const now = new Date();
  const existing = new Date(existingExpiry);
  
  // If expired or no existing, start from now
  const baseDate = existing > now ? existing : now;
  
  // Add new duration
  return addDays(baseDate, newDurationDays);
}
```

**Decision:** No tier upgrades during stacking - if you have Monthly (30 days) and buy Quarterly (90 days), you get 30 + 90 = 120 days at the higher tier automatically.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| CSS filter may not render consistently across browsers | Tested on Chrome/Firefox/Safari - all support modern filter syntax |
| Long subscription codes break layout | CSS `overflow:hidden` + `text-overflow:ellipsis` with tooltip on hover |
| Mobile view space constrained | Card is full-width within container, buttons stack vertically on small screens |

## Component States

**Default (Active Subscription):**
- Full VIP card displayed with tier icon, code, expiry

**Expired Subscription:**
- Card shows "已过期" badge
- "续费会员" button prominently displayed

**No Subscription:**
- No VIP card shown
- "开通会员" button in place of subscription section
