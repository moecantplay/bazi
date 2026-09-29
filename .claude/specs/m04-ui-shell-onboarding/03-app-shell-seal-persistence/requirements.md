# App shell, seal and persistence

Status: done · Milestone: M4 · Ticket: 03

Reconstructed 2026-09-29 from: `_sources/plan.md` §M4, `_sources/progress.md` §M4, `_sources/decisions-log.md` 2026-07-07 webpack entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The app needed routing, a persistence layer, its signature seal, and a way to bundle the engine for the browser.

## Goal

Shell + routing, localStorage persistence behind one gateway, and a deterministic seal.

## Requirements

- **R1.** Seal component deterministic from pillars.
  - Acceptance: pure FNV-1a/mulberry32-seeded SVG, cinnabar-only mass.
- **R2.** localStorage persistence through one gateway.
  - Acceptance: `daymaster.profile.v1` via `lib/profile.ts`.
- **R3.** Engine bundles for the browser.
  - Acceptance: webpack extensionAlias + node:module shim.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.
