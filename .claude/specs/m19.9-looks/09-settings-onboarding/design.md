# Design — Settings and onboarding in three looks

## Approach

Mock first (research/), then build. Shared logic stays in `packages/presentation` and the existing hooks; per-look composition lives in `components/looks/<look>/settings-onboarding/` with a thin switch on `useLook()` at the route (`settings/`, `onboarding/`). Shared components (buttons, fields, sheets, segment stacks) restyle via `[data-look]` CSS, not forks. Onboarding steps are styled in the default look until the user chooses one in 04's step; after that step, the reveal renders in the chosen look.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/app/settings/`, `apps/web/src/app/onboarding/` | route renders the look switch |
| `apps/web/src/components/looks/{trail,almanac,dial}/settings-onboarding/` | per-look compositions |
| `foundation/design-system/` | preview cards for this screen × 3 looks |
| `apps/web/e2e/` | look matrix for this screen's specs |

## Alternatives considered

Pure CSS restyle of one DOM: can't reach B's poster or C's dial, which are different structures. Three full route copies: triples logic and invites drift.

## Risks

Three designs of a screen drift apart in behaviour, not just looks. Mitigation: one presentation model per screen (`packages/presentation`), looks differ only in components/CSS; E2E asserts the same facts render in every look.

## Verification

`pnpm verify`; E2E matrix green; `check.mjs` green; live-app check of every look × theme on device.
