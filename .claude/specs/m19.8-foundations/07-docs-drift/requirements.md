# Docs match the code

Status: done · Milestone: M19.8 · Ticket: 07

## Problem

- `README.md` says state is `daymaster.profile.v1` (it's `daymaster.store.v2`), lists no `packages/presentation`, says "no network calls" (untrue once ticket 06 is configured), and doesn't mention CI, headers, the E2E-per-look scripts or the deploy runbook.
- Six files carry comments written during the M19 rebuild that describe a *different* `apps/web` ("Ported from apps/web/src/lib/share-link.ts", "Unlike apps/web's six separate keys", "matches apps/web's layout.tsx"). They now point at themselves and mislead the next reader.

## Goal

The README describes the app as it is, and no comment refers to a copy of the app that no longer exists.

## Requirements

- **R1.** README: store key, all four packages, what leaves the device, CI, headers, E2E scripts, deploy steps.
  - Acceptance: every command in the README runs; every path in it exists.
- **R2.** No comment in `apps/web` refers to the pre-rebuild app as if it were a separate codebase.
  - Acceptance: `grep -rn "Ported from apps/web\|Unlike apps/web\|apps/web's \|matches apps/web" apps/web/src apps/web/e2e` returns nothing, or only lines that are accurate.

## Out of scope

The wider `apps/web` restructure (M20-05).

## Open questions

None.
