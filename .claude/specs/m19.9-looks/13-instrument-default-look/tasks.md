# Tasks — Instrument is the default look

Check a task only with a one-line evidence note.

- [x] 1. Tests first: default `dial`, never-chosen store per the answer, seeded `trail` at first parse (R1–R3) — store-look.test.ts 6 failing before the change; look-preference.spec.ts adds chosen trail/almanac at first parse and a never-chosen case
- [x] 2. `DEFAULT_LOOK` → `dial`; the never-chosen rule in `store.ts` if (a) (R1, R3) — apps/web lib tests 38/38; also `saveLookPreference` now sets `lookPromptSeen` (design updated)
- [x] 3. Pre-paint script stamps any valid non-default look, mirroring `store.ts` (R2, R3) — default interpolated from `DEFAULT_LOOK`; look-preference E2E 100/100 across 10 repeats in two looks
- [x] 4. DESIGN.md line 12 and the decisions row (R4) — both in this commit
- [x] 5. `pnpm verify` and full E2E in every look green (R5) — `pnpm verify` green; full E2E: the 9 failures per look were stale Explorer-default specs (look-picker, onboarding-to-chart), updated; after that trail 220/221, almanac and dial 219/221 each, every remaining failure passing on repeat (look-preference 100/100, usage-counts 27/27 on WebKit)
- [ ] 6. Deploy to production; live check: new profile → Instrument, Explorer reader → Explorer with no flash, both themes (R5)
