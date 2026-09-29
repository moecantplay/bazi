# Design — Settings: everyday choices first

## Approach

Reorder sections in `settings-content.tsx`; new kicker "How your chart is calculated".

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/components/settings-content.tsx` | Section order |

## Alternatives considered

A separate Advanced screen: one more hop for two toggles.

## Risks

E2E selectors that assume order.

## Verification

Mockups; E2E; live check.
