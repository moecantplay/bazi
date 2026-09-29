# DESIGN.md: shared base and three looks

Status: draft · Milestone: M19.9 · Ticket: 02

## Problem

`foundation/DESIGN.md` describes one design (Trail) and CLAUDE.md binds 'both themes are one design'. Three permanent looks need a document that says what is shared and what each look owns, or every screen ticket will re-argue it. `design-system/check.mjs` measures 17 cards × 5 terrains × 2 themes (3,310 runs) and has no notion of a look.

## Goal

DESIGN.md v5 has a shared base plus Look A, B and C sections, and the contrast gate measures every look.

## Requirements

- **R1.** DESIGN.md is split into a shared base (tokens, terrains, type families, voice, seal, anchor rule, floor, motion language) and three look sections (hero, composition, surfaces, components that differ).
  - Acceptance: DESIGN.md v5 committed; each look section names its signature object and what it forbids.
- **R2.** The standing rule 'both themes are one design' becomes 'each look is one design in both themes'; CLAUDE.md standing rules updated.
  - Acceptance: CLAUDE.md diff reviewed by owner.
- **R3.** `check.mjs` takes a look dimension; cards are tagged by look (or shared).
  - Acceptance: `node check.mjs` reports runs per look, 0 failures, parity 0 breaks.
- **R4.** A motion section defines the arrival sequence, press springs and reduced-motion behaviour for all looks.
  - Acceptance: section present; values match the 01 mockups.
- **R5.** Decision logged.
  - Acceptance: `decisions.md` row → this ticket.

## Out of scope

Per-screen compositions (06–10 fill in their look sections as they land).

## Open questions

- [ ] Does the Trail name stay for Look A, and what are B and C called in the app (e.g. Trail, Almanac, Dial)?
- [ ] Is terrain-per-day (ground keyed to the day element) shared by all three looks, or does B's tinted field replace it?
