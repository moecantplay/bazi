# Design — Compare and Find a day in three looks

## Approach

Mock first (research/), then build. Shared logic stays in `packages/presentation` and the existing hooks; per-look composition lives in `components/looks/<look>/compare-dates/` with a thin switch on `useLook()` at the route (`compare/`, `dates/`). Shared components (buttons, fields, sheets, segment stacks) restyle via `[data-look]` CSS, not forks.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/app/compare/`, `apps/web/src/app/dates/` | route renders the look switch |
| `apps/web/src/components/looks/{trail,almanac,dial}/compare-dates/` | per-look compositions |
| `foundation/design-system/` | preview cards for this screen × 3 looks |
| `apps/web/e2e/` | look matrix for this screen's specs |

## Alternatives considered

Pure CSS restyle of one DOM: can't reach B's poster or C's dial, which are different structures. Three full route copies: triples logic and invites drift.

## Risks

Three designs of a screen drift apart in behaviour, not just looks. Mitigation: one presentation model per screen (`packages/presentation`), looks differ only in components/CSS; E2E asserts the same facts render in every look.

## Verification

`pnpm verify`; E2E matrix green; `check.mjs` green; live-app check of every look × theme on device.
