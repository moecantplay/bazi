# Design — Stripe and entitlements

## Approach

Stripe test mode in staging; webhook signature verified; idempotent handler.

## Changes

| Area | Change |
| --- | --- |
| API | Checkout session, portal, webhook |
| `lib/account/` | Entitlement cache |

## Alternatives considered

Client-side entitlement checks only: trivially bypassed and not shareable with mobile.

## Risks

Webhook ordering; handler uses Stripe's event object as final state.

## Verification

E2E: subscribe → entitlement on; cancel → off.
