# Tasks — Copy audit baseline

Check a task only with a one-line evidence note.

- [x] 1. Fixtures B–D in presentation test fixtures (R1) — already present: `test/fixtures.ts` `READING_FIXTURES` (A, unknown time, B, C, D), added with M20-21
- [x] 2. Write the metrics unit test first, then `metrics.ts` (R2) — `test/copy-audit-metrics.test.ts` failed (module missing), then 11/11 passed; after review, 3 more cases (duplicates, `;`/`:` split, cap and tie order), 14/14
- [x] 3. `surfaces.ts`: collect Today, topic pages, Ahead, You, People through the view-models (R1, R4) — 450 Today, 2,979 topic, 210 Ahead, 5 You, 5 Your chart (added after review), 20 People views; only view-model calls and `plainGloss`
- [x] 4. `report.ts` and the `copy-audit.ts` entry with `--out`; wire `tsx`, tsconfig `include`, package and root scripts (R3) — `pnpm copy-audit --out <file>` from the root; lockfile reuses tsx 4.23.0; presentation typecheck and lint clean
- [x] 5. Determinism and timing: two runs byte-identical, each under 10 s (R3) — `cmp` identical; 5.4 s (first cut took 50 s; fixed with `seenFrom`, see design)
- [x] 6. Spot-check Fixture A on 2026-10-20 against the running app — Today 16/16 and lead topic page 15/15 audit lines on the page; the reverse check found Today's colour line missing, so it was added (R1 note)
- [x] 7. Commit `baseline.json`, fill the summary table, `pnpm verify` green (R5) — verify green (199 engine / 146 content / 233 presentation / 50 web); reviewer approved on second pass
