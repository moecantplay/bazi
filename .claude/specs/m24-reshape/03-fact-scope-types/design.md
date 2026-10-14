# Design — Facts carry their time scope

## Approach

Engine work, tests first (engine non-negotiable).

1. Red tests: a type test for `ReadingFact["scope"]`; a runtime test over Fixture A asserting `natalFacts` → `natal`, `dailyFacts` → `day`, `monthlyPillarFactsForCalendarMonth` → `month`, `annualPillarFacts` → `year`, `luckPillarFacts` → `decade`; `@ts-expect-error` tests for a year fact into `dailyReading` and `routeWaypointsFor`.
2. `FactScope` in `facts.ts`. Each union member gains `scope`. Kinds only one producer makes take a literal (`hour-interaction`: `"day"`); kinds shared across producers (`transit-interaction`, `element-period`, `ten-god-period`) take the producer's scope. `periodFacts` maps `"annual" | "monthly" | "luck"` → `"year" | "month" | "decade"` and drops `period`.
3. Narrowed types: `DayFact = ReadingFact & { scope: "day" }`, `PeriodFact`, `NatalFact`. Producers return them.
4. Content and presentation: Today's path (`dailyReading`, `chooseLead`, `chooseModifier`, `topicCards`, `rankTransits`, `leadCellOf`, `routeWaypointsFor`, `bestHourMarkFor`, `daySoreSpot`) takes `readonly DayFact[]`; Ahead's `periodReading` takes `PeriodFact[]`; `natalReading` / `youReading` take `NatalFact[]`. Shared helpers (`factOf`, `topicPage`) stay generic.
5. Period readings read `fact.scope` in place of `fact.period`.

## Changes

| Area | Change |
| --- | --- |
| engine `facts.ts`, `horizons.ts`, `index.ts` | `scope`, narrowed types and returns |
| engine `test/` | scope per producer; type tests |
| content daily, ahead, you, natal readings; `horizon-reading.ts`, `luck-reading.ts` | narrowed inputs; `period` → `scope` |
| presentation `reading.ts`, `route-waypoints.ts`, `sore-spot.ts`, `ahead-screen.ts`, `cycle-reading.ts`, `luck-reading.ts` | narrowed inputs |

## Alternatives considered

- **Separate unions per producer.** Stronger, but duplicates the kinds two producers share (transit interactions, element and ten-god) and every helper that switches on `kind`.
- **Branded arrays (`DayFacts`) instead of a field.** Lighter on construction sites, but a fact pulled out of the array loses its scope, which is exactly how the 2026-08-21 leak happened.

## Risks

- Wide but mechanical; `tsc` finds every construction site.
- Test fixtures that build facts by hand gain a field; assertions must not change (R4). Review the diff for any edited `expect`.

## Verification

Engine, content and presentation suites green; `@ts-expect-error` tests hold; `pnpm verify`; full E2E; a live-app check of Today, Ahead and You on production after deploy.
