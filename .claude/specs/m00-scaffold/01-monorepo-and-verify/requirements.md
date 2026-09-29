# Monorepo and verify pipeline

Status: done · Milestone: M0 · Ticket: 01

Reconstructed 2026-09-29 from: `_sources/plan.md` §M0, `_sources/progress.md` §M0, `_sources/decisions-log.md` 2026-07-07 entries, commit `8cea896`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Problem

No project existed; the brief called for a web app on a separate calculation engine and content layer.

## Goal

A pnpm monorepo where one command proves the whole thing typechecks, lints, tests and builds.

## Requirements

- **R1.** pnpm workspace with `apps/web` (Next.js 15, TS strict, Tailwind, static export), `packages/bazi-engine`, `packages/content`.
  - Acceptance: `pnpm-workspace.yaml`; pnpm 9.15.9, Next 15.5.20 resolved.
- **R2.** Root `pnpm verify` = typecheck + lint + unit tests + build across all packages.
  - Acceptance: root `package.json` script.
- **R3.** git repository on `main`, conventional commits; initial commit only on green verify.
  - Acceptance: initial commit after full `pnpm verify` green, static export OK.

## Out of scope

Not recorded.

## Open questions

None — closed at delivery.
