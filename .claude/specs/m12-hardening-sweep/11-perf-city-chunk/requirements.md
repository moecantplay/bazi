# City dataset as its own chunk

Status: done · Milestone: M12 · Ticket: 11

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, commit `d668645`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

The 180KB city list loaded with every onboarding and compare page.

## Goal

Load it after mount.

## Requirements

- **R1.** cities.json is its own post-mount chunk.
  - Acceptance: onboarding first-load JS 266→228kB, compare 269→229kB.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.
