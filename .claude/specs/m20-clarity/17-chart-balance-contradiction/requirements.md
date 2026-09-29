# Chart says one thing about balance

Status: done · Milestone: M20 · Ticket: 17

## Problem

Fixture A's Chart (2026-09-29) reads "Earth dominates your chart…" and, two paragraphs later, "Your five elements sit close to even. No single note drowns the others…". The counts are Earth 3, Metal 2, Wood/Fire/Water 1. `packages/content/src/banks/elements.ts` picks a `BALANCED_LINES` entry whenever no element is missing, whatever the spread, so any chart with all five elements and a clear leader contradicts itself.

## Goal

The element paragraph never asserts both dominance and evenness.

## Requirements

Rule (owner, 2026-09-29): a chart is **balanced** when the largest element count leads the second-largest by at most 1.

- **R1.** A chart gets a dominant-element line only when its top element leads the next by 2 or more, and a balanced line only when it leads by at most 1 and no element is missing. Never both.
  - Acceptance: content test over every golden fixture plus 1,000 seeded charts finds no chart rendering both, and none rendering a dominant line for a lead of 0–1.
- **R2.** Ties no longer produce a dominant line (today a 2-2-1-1-1 chart reads "Wood dominates" by list order).
  - Acceptance: unit test on a tied chart.
- **R3.** A chart with a missing element keeps its missing-element line; it gets a dominant line only under R1.
  - Acceptance: unit test.
- **R4.** Fixture A (Earth 3, Metal 2, others 1) reads balanced: a `BALANCED_LINES` entry and no `DOMINANT_LINES` entry.
  - Acceptance: content test on Fixture A; Chart screenshot.

## Out of scope

Rewriting the rest of the bank (M20-14).

## Open questions

- [x] Threshold for "no element leads": max − second ≤ 1? **Yes** (owner, 2026-09-29). Fixture A therefore reads balanced.
