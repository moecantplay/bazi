# Chart says one thing about balance

Status: draft · Milestone: M20 · Ticket: 17

## Problem

Fixture A's Chart (2026-09-29) reads "Earth dominates your chart…" and, two paragraphs later, "Your five elements sit close to even. No single note drowns the others…". The counts are Earth 3, Metal 2, Wood/Fire/Water 1. `packages/content/src/banks/elements.ts` picks a `BALANCED_LINES` entry whenever no element is missing, whatever the spread, so any chart with all five elements and a clear leader contradicts itself.

## Goal

The element paragraph never asserts both dominance and evenness.

## Requirements

- **R1.** "Balanced" copy appears only when no element leads by a margin (threshold set in design, from the engine's counts), never alongside a dominant-element line.
  - Acceptance: content test over every golden fixture plus a sweep of 1,000 seeded charts finds no chart that renders both.
- **R2.** A chart with all five elements and a clear leader gets a line that says so without claiming evenness ("nothing missing" is true; "even" isn't).
  - Acceptance: Fixture A's Chart renders no `BALANCED_LINES` entry.

## Out of scope

Rewriting the rest of the bank (M20-14).

## Open questions

- [ ] Threshold for "no element leads": max − second ≤ 1?
