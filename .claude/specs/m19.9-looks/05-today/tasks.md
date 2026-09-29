# Tasks — Today in three looks

Check a task only with a one-line evidence note.

- [x] 1. Mock Today in all three looks, both themes (R1) — first screens from 01; full-length round with all content + board placement toggle + board styles: `research/today-full.html`
- [x] 2. Owner review; record answers (R1) — board on the first screen; pull-quote board in every look (2026-09-29)
- [x] 3. `readingSections` and `dayOfYear` in presentation, tests first (R3) — 7 new tests red → green; presentation 168/168
- [x] 4. `useLook` + `LookSwitch`, and `useTodayScreen` extracted from TodayView with no visible change (R5) — `today-looks.spec.ts` switch-without-reload green; clock wiring unified as `useNow`
- [x] 5. Shared Today parts: date stepper, pull-quote board, chapters, footer (R2, R3) — `components/today/*`, `components/date-stepper.tsx` (Datebar now composes it), `components/week-legend-link.tsx`
- [x] 6. Explorer composition + route hero + idea cards (R2, R3) — `components/looks/trail/*`; live screenshot `research/app-trail-*.png`
- [x] 7. Editorial composition + poster field + week calendar (R2, R3) — `components/looks/almanac/*`; `research/app-almanac-*.png`
- [x] 8. Instrument composition + day dial + week rings (R2, R3) — `components/looks/dial/*`; `research/app-dial-*.png`
- [x] 9. Motion + reduced motion (R2) — `app/looks.css` arrival classes, keyed on the displayed date; reduced-motion spec green (animation none)
- [x] 10. Amend VOICE.md + CLAUDE.md agency rule; update DESIGN.md to what shipped (R2) — VOICE rule 6 + 12, CLAUDE.md non-negotiable, DESIGN.md §Concept/§Motion/§Shared surfaces/§Looks
- [x] 11. E2E: Today specs per look, first-screen fit, switch without reload (R3, R4) — `E2E_LOOK` matrix (`pnpm e2e:looks`): 44/44 in trail, almanac and dial; two 0 ms Chromium-crash flakes passed on rerun
- [x] 12. Contrast on the rendered app, every look × both themes; design-system cards updated (R2) — live app: 6346 rendered text runs, 3 looks × 2 themes × 10 days (all 5 terrains), chapters and folds open, 0 failures; `check.mjs` 3970 runs, 0 failures, parity holds (pull-quote card)
- [x] 13. Verify: pnpm verify, E2E, live app every look × theme (R1–R5) — `pnpm verify` exit 0; E2E matrix green; static build: 7 routes × 3 looks × 2 themes all 200, 0 console errors. On-device review by the owner still to come (needs 04's Settings control, or a seeded look)
