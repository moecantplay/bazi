# Wave 1 — Foundations

Status: done · Milestone: M18.5 · Ticket: 01

Reconstructed 2026-09-29 from: `_sources/plan.md` §M18.5, `_sources/progress.md` §M18.5. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The app ran on M16 tokens and fonts.

## Goal

Trail's tokens, fonts, terrain stamping and restyled primitives.

## Requirements

- **R1.** Bricolage Grotesque + Space Mono alongside Figtree.
  - Acceptance: `next/font/google`.
- **R2.** Tokens generated: terrain-ground × theme + data/signage hues + shape/shadow scale.
  - Acceptance: `generate-tokens.mjs` → `tokens.generated.css`, transcribed from the design-system token source.
- **R3.** `data-terrain` from the day pillar's element; primitives restyled.
  - Acceptance: shipped; token-generator dark-mode fallback bug found and fixed.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.
