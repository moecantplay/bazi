# Conditions in three looks (or dropped)

Status: draft · Milestone: M19.9 · Ticket: 10

## Problem

`/conditions/` exists (commit dc5caab) but M20-04 hasn't decided whether it stays. Designing it three times first would be waste.

## Goal

Conditions either gets the same treatment as 05–09 or is dropped, decided before any look work on it.

## Requirements

- **R1.** M20-04's keep/drop question is answered before this ticket runs; since M19.9 now runs before M20, that decision moves here.
  - Acceptance: answer recorded in Open questions and in M20-04.
- **R2.** If kept: same requirements as 06–09 (mockups in A/B/C, check.mjs, E2E matrix).
  - Acceptance: as in 06.
- **R3.** If dropped: route and components removed, E2E updated.
  - Acceptance: `pnpm verify` + E2E green without it.

## Out of scope

Anything else in M20-04's scope.

## Open questions

- [ ] Keep or drop Conditions?
