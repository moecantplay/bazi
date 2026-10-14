# Tasks — Facts carry their time scope

Check a task only with a one-line evidence note.

- [ ] 1. Owner answers the open question; owner approves (R1–R4)
- [ ] 2. Red tests: scope per producer, `ReadingFact["scope"]` type test, `@ts-expect-error` for a year fact into Today (R1, R3)
- [ ] 3. `scope` on every member; `period` replaced (R1, R2)
- [ ] 4. Narrowed producer return types (R3)
- [ ] 5. Content and presentation take narrowed types; period readings read `scope` (R2, R3)
- [ ] 6. Verify: `pnpm verify`, full E2E, no assertion edited, live-app check, deploy (R4)
