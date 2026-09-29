# Tasks — Look preference: store, pre-paint and component switch

Check a task only with a one-line evidence note.

- [x] 1. Add `look` to store types, defaults, migration, backup (R1, R4) — additive v2 field; `store-look.test.ts` 6/6 (written first, red → green); migration/backup needed no change, covered by tests
- [x] 2. Pre-paint `data-look` in layout (R2) — `look-preference.spec.ts`: `dial` present at DOMContentLoaded and after reload
- [x] 3. `useLook` + `LookSwitch` (R3) — moved to 05, their first consumer (no dead code); R3 and 05 updated
- [x] 4. E2E helper + migration spec (R4, R5) — existing `seedStore` suffices; old-store and unknown-value specs green
- [x] 5. Verify: pnpm verify, E2E, live app (R1–R5) — `pnpm verify` exit 0; E2E 37/37; live static build: 7 routes 200, `data-look=trail`, 0 console errors
