# Tasks — Retire the legacy screens and the trial

Check a task only with a one-line evidence note.

- [x] 1. Owner answers the open questions; owner approves the deletions (R1–R6) — 2026-10-14: Cycles and Compare retired until further notice, trial previews deleted, "ok with deletions"
- [x] 2. Rehome `hourBlocks`; welcome-sample tests unchanged (R1) — `presentation/src/hour-blocks.ts` with its two tests moved to `test/hour-blocks.test.ts`; welcome-sample imports it; presentation 225/225, `pnpm verify` green
- [x] 3. Orphan check in `pnpm verify`, failing on today's orphans (R2) — `apps/web/src/orphans.test.ts` (a vitest test, so `pnpm verify` runs it unwired): failed on `legend-tags.tsx` before any deletion, then on the six legacy Trail files once Conditions was out
- [x] 4. Conditions out, `/conditions/` redirects to Today, E2E for the redirect (R1) — `RetiredRoute` page; 5 components, 2 lib files, `conditions-screen.ts` + its 4 tests, `conditions.spec.ts` deleted; `e2e/retired-routes.spec.ts` 3/3
- [x] 5. Legacy Trail out, `ROUTE_TOPIC` gone, comments updated; orphan check green (R2) — six components deleted; with them went `ActivityTerrainPlot`, the stepper's long date format and the seal's CompassMark exports; `pnpm verify` green (presentation 221, web 42); navigation, date-nav, dates, onboarding, today-looks and redirect E2E 75/75
- [x] 6. Cycles and Compare out, `/cycles/` → Ahead and `/compare/` → People, E2E for both (R3) — both pages are `RetiredRoute`s, links gone from Ahead and People; the orphan check then caught 5 more web files (pickers, carousel, reading-line cards, reduced-motion hook); a module-reachability sweep from live web found 3 presentation and 3 content modules only Cycles used, deleted with their tests (content 134, presentation 206). Compare-only E2E removed; the store-migration tests now check the same store results on People; offline check uses Ahead; `pnpm verify` green
- [ ] 7. Full E2E every look × theme on the final deletion commit (R4)
- [ ] 8. Deploy; live-app check (R6)
- [ ] 9. Archive tag pushed, trial branch deleted, trial alias removed (R5)
- [ ] 10. Docs: M24 README, DESIGN.md, decisions.md (R3, R5)
