## 1. Database Migration

- [x] 1.1 Add ALTER TABLE migration for `promo_end_date` (DATETIME), `promo_discount` (INTEGER DEFAULT 0), `promo_label` (TEXT DEFAULT '') to `subscription_plans` table in `database.js` createTables(), using try/catch + ALTER TABLE pattern (existing `banned_until` migration as reference)

## 2. Admin API - Plan CRUD with Promo Fields

- [x] 2.1 `handlers/admin.js` case 'mall' → plans GET: include `promo_end_date`, `promo_discount`, `promo_label` in SELECT from `subscription_plans`
- [x] 2.2 `handlers/admin.js` case 'mall' → plans POST INSERT: insert the 3 new promo fields
- [x] 2.3 `handlers/admin.js` case 'mall' → plans PUT UPDATE: update the 3 new promo fields

## 3. Public Plans API - Return Promo Fields

- [x] 3.1 `handlers/plans-api.js` `handleGetPlans`: update SQL SELECT to include `promo_end_date`, `promo_discount`, `promo_label`
- [x] 3.2 `handlers/plans-api.js` `handleGetPlans`: add `is_promo_active` boolean to response (computed from current time vs promo_end_date and promo_discount > 0)

## 4. Price Calculation - Apply Promo Discount

- [x] 4.1 `handlers/subscription-api.js` `getPlanFromDB`: update SQL to SELECT the 3 new promo fields and return them
- [x] 4.2 `handlers/subscription-api.js` `calculatePrice`: modify to check `isPromoActive` (promo_end_date > now AND promo_discount > 0); if active, apply `promo_discount` instead of `discount`; add `isPromo` to return object
- [x] 4.3 `handlers/xunhupay-api.js` `getPlanFromDB`: same SQL change as 4.1
- [x] 4.4 `handlers/xunhupay-api.js` `calculatePrice`: same logic change as 4.2

## 5. Admin Frontend - Modal and Table

- [x] 5.1 `admin-page.js` `showPlanModal`: add 3 promo fields to the add-plan modal HTML (promo_end_date datetime input, promo_discount number input, promo_label text input)
- [x] 5.2 `admin-page.js` `editPlan`: ensure the 3 promo fields are populated from the plan data when opening edit modal
- [x] 5.3 `admin-page.js` `savePlan`: include `promo_end_date`, `promo_discount`, `promo_label` in the POST/PUT request body
- [x] 5.4 `admin-page.js` `renderPlans`: add 3 columns to the plans table (show promo_label badge if not empty, show promo_discount% if > 0)

## 6. Subscription Page Frontend - Pricing with Promo

- [x] 6.1 `subscription-page.js` `loadPlans`: read `promo_end_date`, `promo_discount`, `promo_label`, `is_promo_active` from API response
- [x] 6.2 `subscription-page.js` price calculation: apply promo discount when plan has `is_promo_active: true`, show original price with strikethrough
- [x] 6.3 `subscription-page.js`: add `promo_label` badge display on pricing cards for active promos
- [x] 6.4 `subscription-page.js`: implement per-plan countdown timer using `promo_end_date` (setInterval, update every second, show "Promo Ended" when expired)
- [x] 6.5 `subscription-page.js`: ensure the order summary and payment modal reflect the promo-discounted price

## 7. Homepage - Promo Banner

- [x] 7.1 `pages/home-page.js` `generateHomePage`: call `getPlanFromDB` to find any plan with active promo (or fetch via `/api/mall/plans` and filter in JS)
- [x] 7.2 `pages/home-page.js`: add promo banner HTML section after hero section with:
  - promo_label text
  - countdown timer (days/hours/minutes/seconds) to promo_end_date of the earliest-expiring active promo
  - "Subscribe Now" CTA linking to /subscription
- [x] 7.3 `pages/home-page.js`: hide banner when no active promo exists