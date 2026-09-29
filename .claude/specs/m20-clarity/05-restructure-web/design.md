# Design — Restructure apps/web

## Approach

Mapping comes from who imports each file (analysis run 2026-09-29). Assumes ticket 04 has decided Conditions; if kept, it becomes `features/conditions/`.

```
apps/web/src/
  app/                    routes only — each page renders ProfileGate + one feature view
  shell/                  app-shell, back-link, bottom-nav, profile-gate, service-worker
  ui/                     button, segmented-control, toggle, picker-field, scroll-carousel
  shared/                 token-text, fact-tag, glossary-sheet, reading-card, glyph-icon,
                          pillar-glyph, pillar-columns, seal, city-search
  features/
    today/                today-view, datebar, day-journal, elevation-profile, legend-tags,
                          map-hero, compass-mark, signpost, trail-signs, activity-terrain,
                          waypoint-rail
    chart/                chart-view, element-balance, element-chips, share-actions
    cycles/               luck-timeline, year-picker, month-picker, reading-line-cards
    compare/              compare-form, compare-view
    dates/                (existing components/dates)
    onboarding/           (existing components/onboarding)
    settings/             settings-content, install-hint, edit-birth-flow
  lib/
    store/                store, store-types, store-migration, backup (+ their tests)
    share/                share-link, share-card
    time/                 device-zone, use-day-progress, use-today-label
    hooks/                use-prefers-reduced-motion
  data/                   (unchanged)
```

Notes:
- `compass-mark` renders the seal but is only used by Today → `features/today/`, importing `shared/seal`.
- `streak.ts` goes to `lib/store/` (it is a storage key).
- `condition-icon-paths.ts` leaves with Conditions or moves to presentation's `icons/` (ticket 06).
- Boundaries via `eslint-plugin-import`'s `no-restricted-paths` if already available through the Next lint config, otherwise ESLint's built-in `no-restricted-imports` with patterns — no new dependency unless the owner approves.

One commit per folder group (shell, ui, shared, each feature, lib), each green.

## Changes

See tree. Only import specifiers change inside files.

## Alternatives considered

- **Keep `components/` with subfolders.** Same grouping, less clear name for the "one screen" split.
- **Colocate features inside `app/<route>/`.** Next allows it, but mixes route files with components and couples folder names to URLs.

## Risks

- Playwright specs don't import components, so E2E is unaffected by moves.
- Missed import → build fails immediately; low risk.

## Verification

`pnpm verify`, full E2E, `next dev` smoke of every route (`/`, `/today/`, `/chart/`, `/cycles/`, `/compare/`, `/dates/`, `/settings/`, `/settings/edit/`, `/onboarding/`), lint-boundary violation test.
