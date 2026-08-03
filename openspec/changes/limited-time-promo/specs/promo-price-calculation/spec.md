## ADDED Requirements

### Requirement: Promo price calculation
When a plan has an active promo, the system SHALL calculate the final price by applying the `promo_discount` percentage to the base plan price, instead of applying the regular `discount` field.

The calculation formula SHALL be:
```
basePrice = plan.basePrice + (plan.pricePerIP × ipCount)
finalPrice = basePrice × (1 - plan.promo_discount / 100)
```

#### Scenario: Promo active price calculation
- **WHEN** `basePrice` = 29.9, `pricePerIP` = 10, `ipCount` = 1, `promoDiscount` = 30 (active promo)
- **THEN** `finalPrice` SHALL be `27.93` (i.e., 39.9 × 0.7)

#### Scenario: Promo inactive falls back to regular discount
- **WHEN** `basePrice` = 29.9, `pricePerIP` = 10, `ipCount` = 1, `promoDiscount` = 0 (or expired), `discount` = 10
- **THEN** `finalPrice` SHALL be `35.91` (i.e., 39.9 × 0.9)

#### Scenario: No discount when neither promo nor regular discount is active
- **WHEN** `basePrice` = 29.9, `pricePerIP` = 10, `ipCount` = 1, `promoDiscount` = 0, `discount` = 0
- **THEN** `finalPrice` SHALL be `39.9`

### Requirement: Promo discount takes precedence
The system SHALL apply the `promo_discount` when a promo is active, and SHALL NOT additionally apply the regular `discount` field at the same time.

#### Scenario: Promo overrides regular discount
- **WHEN** `promoDiscount` = 30 (active), `discount` = 20, `basePrice` = 30, `pricePerIP` = 0, `ipCount` = 1
- **THEN** `finalPrice` SHALL be `21.0` (30 × 0.7), NOT `30 × 0.8 × 0.7`

### Requirement: Price calculation during payment
Both the XunhuPay payment flow and the internal subscription code generation flow SHALL use the same `getPlanFromDB` + `calculatePrice` logic that respects promo pricing. The discounted price SHALL be recorded in the order record at creation time.

### Requirement: Price calculation result structure
The `calculatePrice` function SHALL return a result object containing:
- `original`: the `basePrice + pricePerIP × ipCount` before any discount
- `discounted`: the final price after applying the active discount (promo or regular)
- `discount`: the discount percentage actually applied (promo or regular)
- `isPromo`: boolean indicating whether the promo discount was applied