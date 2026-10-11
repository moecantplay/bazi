# Tasks — Ahead

Check a task only with a one-line evidence note.

- [x] 1. Tests: content wording and builder, presentation for every fixture and the 1900/2100 edges, E2E Ahead spec (R1–R6) — period-reading.test.ts 5/5; ahead-screen.test.ts 7/7 incl. both edges and a 2020-born reader (it caught the December 2100 and last-stretch crashes the trial had); ahead.spec.ts (the trial's two specs)
- [x] 2. Content: Ahead bank and period builder; exports (R1, R5, R7) — banks/ahead/period.ts, readings/ahead/period-reading.ts
- [x] 3. Presentation: `ahead-screen.ts` with the engine-edge guards (R1, R2, R6, R7) — ahead-screen.ts; `monthView` returns null outside the engine's table, `monthsOfYear` and `yearsOfDecade` stay inside it
- [x] 4. Web: Ahead view, zooms, lists, Plan something, `/ahead/` page; Find a day reads `?activity=` (R1–R4) — components/ahead/*, app/ahead/page.tsx, date-finder `?activity=`; no "trial" in the touched paths
- [x] 5. `pnpm verify`; full E2E in every look; screenshots light and dark; deploy; live check (R7) — `pnpm verify` green; full E2E 237–238/239 per look, every failure a fast Chromium crash that passed on rerun (evidence added to M20-25: memory pressure); screenshots light and dark; deployed 2026-10-11 03:30 GMT, sw `daymaster-893291ed1406` live; production /ahead/ and /dates/?activity=move pass in both themes
