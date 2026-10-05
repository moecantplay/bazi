# Tasks — Reshape trial build

Check a task only with a one-line evidence note.

- [x] 1. Branch `trial/reshape` off `main`; confirm the chart-free facts available for the Welcome sample (R1, R3) — branch `trial/reshape` off 6061f48; chart-free Welcome facts = day officer + its favoured activities + easy/rough hours (`hourBlocks` uses the day's sign alone)
- [x] 2. Four-tab nav, header gear, Settings via Back; remove the Conditions entry; label "Look for Today" (R2) — c024283; E2E `reshape-tabs.spec.ts` (four tabs, Settings control, no `/conditions` link)
- [x] 3. Onboarding: Welcome step, four gathering steps, sex step carries the reason and disclaimer, land on Today (R3) — c024283; E2E `onboarding-to-chart.spec.ts` (Welcome → 4 steps → Today, disclaimer gates the action)
- [x] 4. Today: drop the day-pillar label in all three looks; move Find a day and "How this reading works" off Today; first-day banner (R4) — c024283, 6c23837 (banner moved after the board so the board stays on the first screen); E2E green in Explorer, Editorial and Instrument
- [x] 5. Content: `banks/trial/` — period leads, You cards, pair leads; `periodLead` and pair-lead builders; tests for no system terms and determinism (R5, R6, R7) — 63818aa; `content/test/trial-plain.test.ts` (10) and `presentation/test/trial-screens.test.ts` (10) green
- [x] 6. Ahead screen: switch, 10 days, Month / Year / Decade with leads and cards (R5) — 6c23837; E2E Ahead spec green
- [x] 7. You screen: portrait lead, plain cards, "Your chart in full" → `/chart/` (R6) — 6c23837; E2E You spec green
- [x] 8. People screen: saved list, Add someone, pair lead and cards (R7) — 6c23837; E2E People spec green
- [x] 9. E2E updated and added; `pnpm verify` green (R2, R3, R5, R7, R8) — 6c23837; `pnpm verify` green (engine 181, content 124, presentation 201, web 36); E2E 223/224 across chromium, mobile-chromium, mobile-webkit (one 3 ms mobile-chromium crash, passed 27/27 on rerun) + 75/75 Editorial + 75/75 Instrument
- [x] 10. Preview deploy (no `--prod`); production `last-modified` unchanged; live check on phone size, light and dark (R1, R8) — preview https://daymaster-219yj23z3-gervin-sean-mirandas-projects.vercel.app (target preview, behind Vercel login); production etag/last-modified unchanged (Fri 02 Oct 2026 02:01:58 GMT); local walk of the same build, light and dark, no console errors
- [x] 11. Hand-off note to the owner: preview link, how to move the chart over, what's final-shape vs placeholder (R8) — hand-off given to the owner in chat, 2026-10-05
