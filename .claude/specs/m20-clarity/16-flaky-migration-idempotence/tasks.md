# Tasks — Flaky migration idempotence test

Check a task only with a one-line evidence note.

- [ ] 1. Make the test deterministic and failing first (fake clock that ticks) (R1)
- [ ] 2. Return the persisted document from `migrateLegacyStore` (R1)
- [ ] 3. Verify: 200× loop, `pnpm verify` (R1)
