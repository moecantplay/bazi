# Tasks — Facts carry their time scope

Check a task only with a one-line evidence note.

- [x] 1. Owner answers the open question; owner approves (R1–R4) — owner, 2026-10-14: "you may start M24-03"; M24-12 ran first.
- [x] 2. Red tests: scope per producer, `ReadingFact["scope"]` type test, `@ts-expect-error` for a year fact into Today (R1, R3) — before the change `tsc` failed with 11 engine, 1 content and 2 presentation errors (missing types, unused `@ts-expect-error`).
- [x] 3. `scope` on every member; `period` replaced (R1, R2) — `facts.ts` has no `period` field; `fact-scope.test.ts` runtime checks pass for all five producers.
- [x] 4. Narrowed producer return types (R3) — `natalFacts: NatalFact[]`, `dailyFacts`/`hourInteractionFacts: DayFact[]`, horizons `PeriodFact[]`; checked by `expectTypeOf`.
- [x] 5. Content and presentation take narrowed types; period readings read `scope` (R2, R3) — content 136/136, presentation 207/207; `dailyReading` and `routeWaypointsFor` reject a year's facts. Changes from the draft are listed in design §Differs.
- [ ] 6. Verify: `pnpm verify`, full E2E, no assertion edited, live-app check, deploy (R4)
