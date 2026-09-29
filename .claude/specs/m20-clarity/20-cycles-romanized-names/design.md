# Design — Cycles: romanized names carry their meaning

## Approach

`luck-timeline.tsx` renders `stemDisplay().gloss` / `branchDisplay().gloss` from `presentation/src/display.ts` (already available) instead of pinyin.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/components/luck-timeline.tsx` | Label |

## Alternatives considered

Tooltip gloss: hidden on touch.

## Risks

Card width at 390px.

## Verification

E2E text check; screenshots.
