# Glyph icon system

Status: done · Milestone: M17.5 · Ticket: 04

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-07-17 glyph icon entry, commit `6cd09fc`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

English-only mode "looks like something is missing" (owner).

## Goal

Bespoke icons beside every stem/branch wording.

## Requirements

- **R1.** 24×24 fine-line set: 5 elements + 12 zodiac animals in `lib/glyph-icon-paths.ts`; ElementIcon/AnimalIcon + bare GlyphMark.
  - Acceptance: shipped.
- **R2.** Element icons solid = yang / outlined = yin, coloured by element; always beside the wording with aria-label + title; legend line on the chart grid.
  - Acceptance: shipped.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.
