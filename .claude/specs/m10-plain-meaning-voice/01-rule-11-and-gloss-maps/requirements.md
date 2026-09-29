# Rule 11 and central gloss maps

Status: done · Milestone: M10 · Ticket: 01

Reconstructed 2026-09-29 from: `_sources/plan.md` §M10, `_sources/progress.md` §M10, `_sources/decisions-log.md` 2026-07-07. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The owner found the copy too mysterious: terms like ten gods or clash appeared untranslated.

## Goal

A hard rule and one gloss per term, shared by every bank and screen.

## Requirements

- **R1.** VOICE.md rule 11: every system term followed in-line by a plain-life gloss.
  - Acceptance: calibration examples added; "naked jargon" listed as wrong.
- **R2.** Central gloss maps in `vocab.ts` (INTERACTION_GLOSSES, TEN_GOD_GLOSSES, DAY_MASTER_GLOSS, LUCK_PILLAR_GLOSS), exported.
  - Acceptance: exported from the package.
- **R3.** Voice test asserts every gloss exists and is voice-clean.
  - Acceptance: 45 content tests green.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.
