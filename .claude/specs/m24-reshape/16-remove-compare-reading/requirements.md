# Remove the unused compare reading

Status: draft · Milestone: M24 · Ticket: 16 · Found during [M24-11](../11-words/requirements.md) phase 1 review (2026-10-20)

## Problem

M24-12 retired Compare, but its reading still runs. `presentation/src/compare.ts:55` (`compareBundleFor`) calls `compareReading(facts, seedKey)` on every People screen, and `pairScreenFor` (`pair-screen.ts:9`) reads only `.facts`. Nothing in `apps/web` reads `.reading`. So `content/src/compare-reading.ts`, `content/src/banks/compare.ts` (54 lines of copy, 36 of them with em-dashes) and the `CompareReading` type are dead code that tests still maintain. M24-11's plain-writing test excludes `banks/compare.ts` for this reason.

## Goal

The compare facts stay. The retired Compare screen's reading, bank and tests are gone.

## Requirements

- **R1.** `compareBundleFor` stops computing a reading. `CompareBundle` keeps `companionChart` and `facts`, or is replaced by a plain facts call if nothing needs the chart.
  - Acceptance: `pairScreenFor` output unchanged for every fixture pairing (snapshot before and after).
- **R2.** `compare-reading.ts`, `banks/compare.ts`, `CompareReading` and their exports, tests and test-helper entries (`collect.ts`, `voice.test.ts`, `glossary.test.ts`, `compare.test.ts` in both packages) are removed, along with any gloss used only by them.
  - Acceptance: `pnpm verify` green; no remaining import of the removed names.
- **R3.** M24-11's plain-writing test drops its `banks/compare.ts` exclusion.
  - Acceptance: the exclusion list is empty, or lists only other modules with reasons.

## Out of scope

People's own pair reading (`pairReading`, M24-09).

## Open questions

- [ ] None.
