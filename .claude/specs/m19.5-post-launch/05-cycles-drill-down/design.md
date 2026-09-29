# Design — Cycles drill-down

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-08-21 luck + horizon entries, commit `1798b62`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Period-generic `periodFacts`/`periodLines` meant "This decade…" needed no new copy. Seeds keyed on the selected pillar, not the calendar.

## Changes

| Area | Change |
| --- | --- |
| engine `horizons.ts` | period facts |
| content `luck-reading.ts`, `horizon-reading.ts` | readings |
| apps/web luck-timeline, month-picker | UI |

## Alternatives considered

Wiring in the unused luckTransitionLines handover blurb (rejected).

## Risks

Not recorded.

## Verification

E2E; live check both themes.

## Decisions

- 2026-08-21 Luck timeline interactive (owner picked the fuller option).
- 2026-08-21 HorizonOutlook folded into LuckTimeline; decade/year/month one selectable drill-down.
