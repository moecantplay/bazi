# No repeats day to day

Status: draft · Milestone: M20 · Ticket: 12

## Problem

Selection is a hash pick from each bank per day, so small banks repeat constantly: over 60 days (Fixture A) the top suggestion appeared 34 times, and there were only 15 headlines and 18 agency lines. The element line is one fixed sentence pair per element.

## Goal

The same sentence doesn't come back within a set window, while staying deterministic (same chart + date = same reading).

## Requirements

- **R1.** For each bank, picks cycle through a chart-seeded permutation of the bank instead of an independent hash per day, so no entry repeats until the bank is exhausted.
  - Acceptance: over 90 days, no sentence repeats within N days where the bank has ≥ N entries.
- **R2.** Deterministic: same profile + date always yields the same reading, independent of which days were viewed.
- **R3.** The repeat window N is agreed (proposal: 21 days) and each bank's minimum size follows from it; banks below it are listed for ticket 14.
- **R4.** Copy-audit unique-sentence ratio improves against the ticket 02 baseline.

Since 2026-09-29 the daily banks this applies to are ticket 21's cell pools (headline, body, agency by lead × area × modifier), not the per-fact lines.

## Out of scope

Writing the new bank entries (ticket 14).

## Open questions

- [ ] Repeat window: 21 days?
