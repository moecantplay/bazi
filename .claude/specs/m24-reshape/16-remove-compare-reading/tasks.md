# Tasks — Remove the unused compare reading

Check a task only with a one-line evidence note.

- [ ] 1. Snapshot `pairScreenFor` over every fixture pairing (R1)
- [ ] 2. Remove the reading from `compareBundleFor`; delete `compare-reading.ts`, `banks/compare.ts`, `CompareReading` and exports (R1, R2)
- [ ] 3. Trim tests and helpers; drop the plain-writing exclusion (R2, R3)
- [ ] 4. `pnpm verify`, snapshot unchanged, People checked in the running app
