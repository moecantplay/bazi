# Restructure presentation

Status: draft · Milestone: M20 · Ticket: 06

## Problem

`packages/presentation/src/` is 32 flat files mixing screen models (`today-screen`), date and time utilities (`dates`, `zoned-time`), SVG path data (`glyph-icon-paths`, `animal-icon-paths`) and single-feature logic (`map-hero`, `route-waypoints`). A third icon set lives in `apps/web/src/lib/condition-icon-paths.ts`. Presentation has its own `hash.ts` duplicating content's FNV hashing.

## Goal

Presentation is organised the same way as the app (by screen, plus shared), with one home for icon data and one hash.

## Requirements

- **R1.** Files grouped as `screens/<screen>/`, `shared/`, `icons/`, mirroring ticket 05's feature names.
  - Acceptance: no loose files in `src/` besides `index.ts` and `types.ts`.
- **R2.** All icon path data lives in `icons/`.
- **R3.** One FNV hash implementation, exported from `@daymaster/content` and used by presentation.
  - Acceptance: presentation's `hash.ts` deleted; the seal, streak wording and every seeded pick produce byte-identical output (existing tests pin them).
- **R4.** The package's public API (`index.ts` exports) is unchanged apart from the removed hash.
- **R5.** Tests move beside their groups or mirror the tree under `test/`.

## Out of scope

Changing any view-model's output.

## Open questions

- [ ] Approve the grouping in design.md.
