# Facts carry their time scope

Status: draft · Milestone: M20 · Ticket: 08

## Problem

Whether a fact is about the day, the month, the year or the decade is mostly implicit. `transit-interaction` and `star-day` infer it from `transitPalace` (via content's `transitWhen`); natal facts carry nothing. Two shipped bugs came from this:

- 2026-08-21: year-pillar facts leaked onto Today because `dailyFacts()` mixed periods and only the prose said which was which.
- 2026-09-10: day-long clashes were drawn at fake hours on the map.

Both were fixed at the call site; the type still allows the mistake.

## Goal

A daily screen cannot receive a year fact without a type error.

## Requirements

- **R1.** Every `ReadingFact` carries `scope: "natal" | "day" | "month" | "year" | "decade"`.
  - Acceptance: the union in `facts.ts` has no member without `scope`.
- **R2.** `element-period` / `ten-god-period`'s `period` field is replaced by `scope`, one vocabulary everywhere.
- **R3.** `dailyFacts()` returns a type narrowed to `scope: "day"`; `dailyReading()` and every Today presentation function accept only that type.
  - Acceptance: a deliberate test passing a year fact to `dailyReading` fails `tsc` (a `@ts-expect-error` test).
- **R4.** Timed facts carry `timing: "all-day" | "hours"`; `hour-interaction` is the only `hours` kind today.
- **R5.** Content's `transitWhen(transitPalace)` is replaced by reading `scope`.
- **R6.** Golden fixtures and every existing test pass unchanged in their assertions (only construction sites gain the field).

## Out of scope

New fact kinds. Changing what any fact means.

## Open questions

- [ ] None.
