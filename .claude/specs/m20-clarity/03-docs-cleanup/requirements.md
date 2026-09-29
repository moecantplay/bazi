# Docs cleanup

Status: draft · Milestone: M20 · Ticket: 03

## Problem

- The root `CLAUDE.md` is 54 KB, almost all decisions log, much of it superseded. It loads into every working session.
- `PLAN.md`, `PROGRESS.md`, `DESIGN.md` sit at the repo root beside the code.
- `docs/` is 7 MB: 34 design-system screenshots, the M18 mockups, research for rejected directions.

## Goal

A short `CLAUDE.md` with only current rules, one place for history, and a `docs/` folder that holds only what is still used.

## Requirements

- **R1.** Root `CLAUDE.md` holds only current conventions and non-negotiables, about 60–80 lines, and points to `.claude/specs/` and the decisions log.
  - Acceptance: no superseded rule remains; every still-true rule from the log is kept (condensed) or linked.
- **R2.** The full decisions log moves verbatim to `docs/decisions.md`.
  - Acceptance: nothing lost; `git diff --stat` shows the move.
- **R3.** `PLAN.md` and `PROGRESS.md` move to `docs/history/` with a header saying `.claude/specs/` replaced them.
- **R4.** `DESIGN.md` moves to `docs/design.md`; every reference updated.
  - Acceptance: grep finds no stale path.
- **R5.** Material that is no longer used is archived or deleted per the owner's answer below.

## Out of scope

Rewriting DESIGN.md or VOICE.md content.

## Open questions

- [ ] Archive (`docs/archive/`) or delete (git keeps history) the rejected-direction research, M18 mockups and design-system screenshots? Recommendation: delete the screenshots and rejected-direction research, keep `docs/design-system/src/tokens.mjs` and `check.mjs` (the named token source and the contrast check).
- [ ] Keep `DESIGN.md` at the root instead? It is read often; root visibility has some value.
