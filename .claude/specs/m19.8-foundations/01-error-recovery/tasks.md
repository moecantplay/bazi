# Tasks — Recover from a broken screen

Check a task only with a one-line evidence note.

- [x] 1. Write `e2e/error-recovery.spec.ts` (both probes, start over, download) — failing first (R1, R2) — 4/4 failed on the pre-change export
- [x] 2. Move the download helper into `lib/backup.ts`; Settings uses it (R2) — `downloadBackup()`; data-ownership spec still green
- [x] 3. `RecoveryScreen`, `app/error.tsx`, `app/global-error.tsx` (R1–R4) — built; "Start over" confirm button reads "Erase and start over"
- [x] 4. Spec green in all three looks; screenshots look × theme (R3, R4) — 4/4 × trail/almanac/dial; `screens/` (trail-light shows the confirm step); no console errors beyond the seeded engine throw
- [x] 5. `pnpm verify` green; live check (all) — see commit
