# Facts carry their time scope

Status: done · Milestone: M24 · Ticket: 03 · Carried from [M20-08](../../m20-clarity/08-fact-scope-types/requirements.md); approved by the owner 2026-10-14

## Problem

Whether a fact is about the birth chart, the day, the month, the year or the decade is still implicit in the type. `ReadingFact` (`packages/bazi-engine/src/facts.ts:33–96`) is one union for every producer: `natalFacts`, `dailyFacts`, `periodFacts` (`horizons.ts:25`, behind `annualPillarFacts`, `monthlyPillarFactsForCalendarMonth`, `luckPillarFacts`). Only two kinds say their period, `element-period` and `ten-god-period`, and they use their own vocabulary (`period: "annual" | "monthly" | "luck"`). `transit-interaction` produced for a year looks exactly like one produced for a day, apart from `transitPalace`.

Every consumer takes plain `ReadingFact[]`: 29 signatures across content and presentation, among them `dailyReading` (`content/src/readings/daily/daily-reading.ts:70`), `chooseLead`, `topicCards`, `routeWaypointsFor` and `periodReading` (Ahead). Nothing stops a year's facts reaching Today. Two shipped bugs came from exactly this (M20-08):

- 2026-08-21: year-pillar facts leaked onto Today because `dailyFacts()` mixed periods and only the prose said which was which.
- 2026-09-10: day-long clashes were drawn at fake hours on the map.

Both were fixed at the call site; the type still allows them.

Changed since M20-08 was written: content's `transitWhen` is gone (no references in `packages/` or `apps/web/src`), and no consumer reads `period` or `transitPalace` to decide scope. Consumers stay correct only because each calls the right producer. M20-08's R5 is moot.

## Goal

A daily screen cannot receive a month, year, decade or birth-chart fact without a type error.

## Requirements

- **R1.** Every `ReadingFact` carries `scope: "natal" | "day" | "month" | "year" | "decade"`.
  - Acceptance: a type test asserts `ReadingFact["scope"]` is exactly that union and every member has it; a runtime test asserts each producer's facts carry the right scope for Fixture A.
- **R2.** `element-period` / `ten-god-period` drop `period` for `scope`: one vocabulary everywhere.
  - Acceptance: no `period: "annual" | "monthly" | "luck"` field remains in `facts.ts`; content's period readings key off `scope`.
- **R3.** Producers return narrowed types (`DayFact`, `PeriodFact`, `NatalFact`); Today's consumers accept only `DayFact`.
  - Acceptance: `@ts-expect-error` tests pass a year fact to `dailyReading` and to `routeWaypointsFor`, and `tsc` holds.
- **R4.** Nothing a reader sees changes.
  - Acceptance: golden fixtures and every existing test keep their assertions (only construction sites gain the field); the M20-02 copy-audit output, if it exists by then, is byte-identical; full E2E green.
  - M20-02 was never built, so a one-off render diff stands in for it (design §Verification).

## Out of scope

- New fact kinds; changing what any fact means.
- An hours-or-all-day `timing` on facts (M20-08 R4). `hour-interaction` and `best-hour` already carry their window; the route keeps reading those.

## Open questions

- [x] Order against [M24-12](../12-retire-legacy/requirements.md). Cycles (`horizon-reading.ts`, `luck-reading.ts`, `cycle-reading.ts`) and Conditions consume facts; if M24-12 retires them, run it first so this ticket doesn't type code about to be deleted. **Resolved:** M24-12 ran first and deleted them (live 2026-10-14).
