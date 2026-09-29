# Design — Restructure presentation

## Approach

Proposed grouping from file names; task 1 confirms it with the same import analysis used for ticket 05.

```
src/
  index.ts  types.ts
  screens/
    today/        today-screen, map-hero, route-waypoints, activity-terrain, elevation,
                  terrain, day-tone, guidance, guidance-board, reading, streak
    chart/        chart, chart-preview, pillars, pillar-stars, elements
    cycles/       cycle-reading, luck-reading
    compare/      compare
    dates/        date-finder
  shared/         dates, zoned-time, reading-zone, seed-key, display, render-run
  icons/          glyph-icon-paths, animal-icon-paths, condition-icon-paths (if kept)
```

`chart.ts` (`chartFor`) is used by every screen model; if the analysis confirms that, it moves to `shared/`.

Hash: content's `hash.ts` is the older, broader one. Export its primitive from `@daymaster/content`, point presentation's callers at it, delete presentation's copy. Run existing seal/streak/seed tests before and after — any output change means the two implementations differed and the ticket stops for a decision.

## Changes

See tree. `index.ts` re-export paths change; names don't.

## Alternatives considered

- Leaving icons in presentation's root: they are data, not view-models, and the third set is in the app.
- Moving icons to a new package: more ceremony than three files need.

## Risks

- Hash merge changes seeded output if the two implementations differ in salt handling. Guarded by existing tests.

## Verification

Presentation tests unchanged and green; `pnpm verify`; E2E; live Today + Chart.
