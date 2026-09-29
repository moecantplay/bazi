# Review and cutover

Status: done · Milestone: M19 · Ticket: 07

Reconstructed 2026-09-29 from: `_sources/progress.md` §M19 Phases 11, 12, `_sources/decisions-log.md` 2026-08-06 cutover entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The new app had to replace the old one safely.

## Goal

Reviewed, cut over, deployed.

## Requirements

- **R1.** Reviewer pass.
  - Acceptance: REQUEST_CHANGES → fixed → CONFIRMED.
- **R2.** Old apps/web deleted, apps/web-next moved into place; package identity, ports and comments updated.
  - Acceptance: Phase 12.
- **R3.** Deployed to production.
  - Acceptance: CLI static deploy of apps/web/out; live checks on all routes.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.
