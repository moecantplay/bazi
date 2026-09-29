# Tasks — Fix duplicated glosses

Check a task only with a one-line evidence note.

- [ ] 1. Write `rendered-lines.test.ts` (repeated gloss, article mismatch, no Han in output); confirm it fails today (R3, R4)
- [ ] 2. Document the run's meaning in `tokens.ts`; rename `plainGloss` → `plainText` rendering `term` (R1, R2)
- [ ] 3. Fix `branchTokenRuns` and `stemTokenRuns` (R1)
- [ ] 4. Update `TokenText` to render `term` (R2)
- [ ] 5. Fix star, stage, ten-god and officer templates (R3, R4)
- [ ] 6. Audit the remaining term-run constructions against R1
- [ ] 7. `pnpm verify`, E2E, live check of three affected dates
