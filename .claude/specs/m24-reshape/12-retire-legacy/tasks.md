# Tasks — Retire the legacy screens and the trial

Check a task only with a one-line evidence note.

- [x] 1. Owner answers the open questions; owner approves the deletions (R1–R6) — 2026-10-14: Cycles and Compare retired until further notice, trial previews deleted, "ok with deletions"
- [x] 2. Rehome `hourBlocks`; welcome-sample tests unchanged (R1) — `presentation/src/hour-blocks.ts` with its two tests moved to `test/hour-blocks.test.ts`; welcome-sample imports it; presentation 225/225, `pnpm verify` green
- [ ] 3. Orphan check script in `pnpm verify`, failing on today's orphans (R2)
- [ ] 4. Conditions out, `/conditions/` redirects to Today, E2E for the redirect (R1)
- [ ] 5. Legacy Trail out, `ROUTE_TOPIC` gone, comments updated; orphan check green (R2)
- [ ] 6. Cycles and Compare out, `/cycles/` → Ahead and `/compare/` → People, E2E for both (R3)
- [ ] 7. Full E2E every look × theme on the final deletion commit (R4)
- [ ] 8. Deploy; live-app check (R6)
- [ ] 9. Archive tag pushed, trial branch deleted, trial alias removed (R5)
- [ ] 10. Docs: M24 README, DESIGN.md, decisions.md (R3, R5)
