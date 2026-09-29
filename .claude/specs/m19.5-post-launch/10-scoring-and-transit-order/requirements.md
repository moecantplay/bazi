# Scoring precedence and transit order

Status: done · Milestone: M19.5 · Ticket: 10

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-09-10 refinement entries (b)–(e), commits `209fd0b`, `5cadd46`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

Scoring rules interacted badly and the headline could follow a weak pattern.

## Goal

Explicit precedence, strength margin, severity-first transits.

## Requirements

- **R1.** Favourable-element +1 never applies to officer-avoided activities.
  - Acceptance: scoring-precedence.test.ts.
- **R2.** favorableElements strength-first; climate leads only when it agrees.
  - Acceptance: tested.
- **R3.** StrengthResult gains margin/narrow; the natal line says "by a narrow margin".
  - Acceptance: tested.
- **R4.** chooseTransits sorts by severity; the hash only breaks ties.
  - Acceptance: tested.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.
