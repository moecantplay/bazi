# Design — Facts carry their time scope

## Approach

Engine work, tests first (engine non-negotiable).

1. Red tests: `bazi-engine/test/fact-scope.test.ts` holds the type tests (`FactScope` is exactly the five scopes, `ReadingFact["scope"]` is `FactScope`, each narrowed type's `scope`, producer return types) and a runtime test over Fixture A: `natalFacts` → `natal`, `dailyFacts` and `hourInteractionFacts` → `day`, `monthlyPillarFactsForCalendarMonth` → `month`, `annualPillarFacts` → `year`, `luckPillarFacts` → `decade`, and no `period` field. `@ts-expect-error` tests pass a year's facts to `dailyReading` (`content/test/fact-scope.test.ts`) and to `routeWaypointsFor` (`presentation/test/route-waypoints.test.ts`).
2. `facts.ts` defines `FactScope`, `TransitScope` (everything but `natal`) and `PeriodScope` (`month | year | decade`). Natal kinds take `scope: "natal"`; day-only kinds (`hour-interaction`, `best-hour`, `element-day`, `ten-god-day`, `star-day`, `stage-day`) take `"day"`; `transit-interaction` takes `TransitScope`; `element-period` and `ten-god-period` take `PeriodScope` in place of `period`.
3. Narrowed types: `NatalFact`, `DayFact`, `PeriodFact` are `ReadingFact & { scope: … }`. Members whose scope can't match drop out of the intersection, so `Extract<DayFact, { kind: K }>` gives only day kinds. Producers return them.
4. `transitInteractionFacts` takes the scope (generic `S extends TransitScope`) and looks up the transit palace in `TRANSIT_PALACE` (`day → daily`, `month → monthly`, `year → annual`, `decade → luck`), so its facts come back typed to the caller's scope. `transitPalace` stays on the fact (out of scope to change).
5. Content and presentation:
   - **Today's path takes `readonly DayFact[]`:** `dailyReading`, `chooseLead`, `chooseModifier`, `topicCards`, `leadCellOf`, `topicPage`, `deepenTopicPage`, `routeWaypointsFor`, `bestHourMarkFor`, `daySoreSpot`, and `DailyBundle.facts`.
   - **Ahead's `periodReading` takes `readonly PeriodFact[]`.**
   - **`natalReading` and `youReading` take `readonly NatalFact[]`.**
   - **Shared helpers are generic over the list's fact type:**
     - `rankTransits<F>` returns `F`'s transit facts, used by both Today and Ahead.
     - `interactionTopic` accepts any transit fact.
     - plain-reading's `factOf<F, K>` returns `Extract<F, { kind: K }>`.

### Differs from the draft

- **`topicPage` narrowed to `DayFact`, not kept generic.** It ranks the day's leads and reads day kinds; its only caller passes `dailyBundleFor(...).facts`.
- **`rankTransits` is generic instead.** Ahead's `periodReading` calls it with period facts, so it has to take any scope.
- **Nothing read `period`.** Period readings key off the `span` argument, so R2's "key off `scope`" needed no rekeying; `scope` is simply the only vocabulary left.
- **Nothing left to type in Cycles.** `horizon-reading.ts`, `luck-reading.ts` and `cycle-reading.ts` were deleted by M24-12 before this ran.

## Changes

| Area | Change |
| --- | --- |
| engine `facts.ts`, `horizons.ts`, `best-hour.ts`, `index.ts` | scopes, narrowed types and returns; `transitInteractionFacts` takes the scope |
| engine `test/` | `fact-scope.test.ts`; whole-object expectations gain `scope`; `period: "annual" \| "monthly" \| "luck"` → `scope: "year" \| "month" \| "decade"` (R2) |
| content `daily/*`, `topic-page.ts`, `topic-depth.ts`, `ahead/period-reading.ts`, `you/you-reading.ts`, `natal-reading.ts`, `plain/plain-reading.ts` | narrowed inputs; generic `rankTransits`, `factOf` |
| content `test/` | `fact-scope.test.ts`; hand-built facts gain `scope`; helpers typed `DayFact` / `NatalFact` / `PeriodFact` |
| presentation `reading.ts`, `route-waypoints.ts`, `sore-spot.ts` | `DayFact` |

## Alternatives considered

- **Separate unions per producer.** Stronger, but duplicates the kinds two producers share (transit interactions, element and ten-god) and every helper that switches on `kind`.
- **Branded arrays (`DayFacts`) instead of a field.** Lighter on construction sites, but a fact pulled out of the array loses its scope, which is exactly how the 2026-08-21 leak happened.

## Risks

- Wide but mechanical; `tsc` finds every construction site.
- Test fixtures that build facts by hand gain a field; assertions must not change (R4). Review the diff for any edited `expect`.

## Verification

- **Suites and `tsc`:** engine, content and presentation suites green, and the `@ts-expect-error` tests hold under `tsc`.
- **`pnpm verify` and E2E:** `pnpm verify` green, then the full E2E in all three looks.
- **Render diff (stands in for M20-02, never built):**
  - A throwaway vitest file serialized every reading path on `main` and on this change, dropping only the `facts` arrays.
  - It covered every `READING_FIXTURES` profile: natal reading, You, `todayScreenModel` for 120 days from 2026-09-01, the topic page of every topic each day names, `monthView` and `yearView` for 2020–2032, and `decadeView` for every luck pillar.
  - The two outputs must be byte-identical.
- **Live check:** Today, Ahead and You on production after deploy.
