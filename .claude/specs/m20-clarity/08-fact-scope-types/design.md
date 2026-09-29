# Design — Facts carry their time scope

## Approach

Engine work, tests first (engine non-negotiable).

1. Add `FactScope` to `types.ts`. Write the `@ts-expect-error` test and a runtime test asserting every fact from `natalFacts`, `dailyFacts`, `annualPillarFacts`, `monthlyPillarFactsForCalendarMonth`, `luckPillarFacts` carries the right scope — red first.
2. Add `scope` to every member of the union; map `period: "annual" | "monthly" | "luck"` → `"year" | "month" | "decade"`.
3. Export `DayFact = Extract<ReadingFact, { scope: "day" }>`-style narrowed types for each producer; producers return them.
4. Content: `dailyReading(facts: DayFact[] …)`, horizon/luck builders take their scope; delete `transitWhen`, read `fact.scope`. Wording that says "today"/"this year" keys off `scope`.
5. Presentation: `routeWaypoints`, `mapHero` accept `DayFact[]`.

## Changes

| Area | Change |
| --- | --- |
| `bazi-engine/src/types.ts`, `facts.ts`, `horizons.ts` | `scope`, `timing`, narrowed return types |
| `content/src` builders, `vocab.ts` | Take narrowed types; `transitWhen` removed |
| `presentation/src` Today models | Take `DayFact[]` |

## Alternatives considered

- Separate fact unions per producer: stronger, but duplicates shared kinds (transit, star) across unions.

## Risks

Wide but mechanical; `tsc` finds every construction site.

## Verification

Engine, content, presentation suites green; `@ts-expect-error` test holds; `pnpm verify`; E2E; copy-audit output unchanged (ticket 02).
