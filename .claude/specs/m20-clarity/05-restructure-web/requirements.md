# Restructure apps/web

Status: draft · Milestone: M20 · Ticket: 05

## Problem

`apps/web/src/components/` is one flat folder of 43 files mixing generic controls (`button`, `toggle`), whole screens (`today-view`, `chart-view`) and parts of a single screen (`map-hero`, `waypoint-rail`). Only onboarding, dates and conditions have folders. `lib/` mixes the store, sharing, hooks, icon data and tests. Nothing tells a reader which file belongs to which screen.

## Goal

A reader can find everything for one screen in one folder, and can tell at a glance whether a component is a generic control, a shared domain piece, or part of one screen.

## Requirements

- **R1.** Files are grouped as: `app/` (routes only), `features/<screen>/`, `shared/` (domain components used by 2+ features), `ui/` (generic controls with no domain knowledge), `shell/` (app frame), `lib/<area>/`.
  - Acceptance: no file left directly in `components/`; the folder is gone.
- **R2.** A component used by only one feature lives in that feature's folder.
  - Acceptance: import analysis script shows no feature-only component outside its feature.
- **R3.** Import boundaries are enforced by lint: a feature never imports another feature; `ui/` imports nothing from `features/`, `shared/` or `shell/`; `shared/` never imports `features/`.
  - Acceptance: ESLint rule fails a deliberate violation.
- **R4.** Pure moves: no behaviour change.
  - Acceptance: `pnpm verify`, all E2E, live check of every route; diffs outside import paths are zero.
- **R5.** `apps/web/CLAUDE.md` describes the new layout and its rules.

## Out of scope

Changing any component's behaviour or appearance. Merging or splitting components.

## Open questions

- [ ] Approve the layout in design.md.
