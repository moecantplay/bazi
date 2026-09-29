# Self-versioning service worker

Status: done · Milestone: M12 · Ticket: 03

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 SW entry, commit `e00a173`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The hand-maintained service worker missed routes offline and needed manual version bumps.

## Goal

A build-generated precache and cache version with a user-accepted update.

## Requirements

- **R1.** Precache + cache version generated from the build output.
  - Acceptance: all 64 files incl. chunks and RSC payloads; never-visited routes render offline, E2E-proven.
- **R2.** Updates install and wait; only a user-accepted Refresh reloads; offline navigations fall back to /today/.
  - Acceptance: shipped.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.
