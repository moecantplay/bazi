# Retire the old Trail composition and ship

Status: draft · Milestone: M19.9 · Ticket: 11

## Problem

When 05–10 land, the old single-look components (`map-hero.tsx`, `waypoint-rail.tsx`, `elevation-profile.tsx`, `signpost.tsx` and others) may be dead or only partly used, and E2E has only run per-screen matrices.

## Goal

No dead Trail code, the whole app verified in every look × theme, and production deployed.

## Requirements

- **R1.** Components used by no look are deleted; ones reused by a look are moved under it.
  - Acceptance: grep shows no unused component; `pnpm verify` green.
- **R2.** Retiring the old composition may unmask things it hid (standing rule, m19/03): rerun the copy audit and every E2E spec after removal, don't trust prior greens.
  - Acceptance: full E2E × 3 looks × 2 themes green after the deletion commit.
- **R3.** Production deployed; live-app check of every look × theme on device.
  - Acceptance: deploy URL + checklist in tasks.md.

## Out of scope

New features.

## Open questions

- [ ] Deploy all three at once, or one look at a time behind the default?
