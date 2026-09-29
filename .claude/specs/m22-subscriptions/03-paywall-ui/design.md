# Design — Paywall UI

## Approach

Mockup first, both themes, on device.

## Changes

| Area | Change |
| --- | --- |
| `content/src/reference/paywall.ts` | Copy |
| `apps/web/src/features/*` | Gate wrappers |

## Alternatives considered

Modal paywalls on free screens: contradicts R3.

## Risks

Upsell creeping into free screens over time; E2E asserts none on Today/Chart.

## Verification

E2E gate on/off both ways; live check both themes.
