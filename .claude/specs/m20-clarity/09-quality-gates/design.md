# Design — Quality gates

## Approach

- **R1/R2:** `apps/web/scripts/check-css-vars.mjs`. Collect definitions from `globals.css` + `tokens.generated.css` per theme context (`:root`, `[data-theme=light|dark]`, media blocks); collect references by regex over `src/**/*.{css,tsx,ts}` and `tailwind.config.ts`. Fail with file:line for anything undefined in either theme, and for media-only theme rules. Added to the app's `lint` script so `pnpm verify` runs it.
- **R3:** `apps/web/e2e/contrast.spec.ts`. For each route/theme/terrain, walk visible text nodes, read computed `color` and the effective background (walk ancestors, composite alpha), compute the WCAG ratio, apply the large-text threshold by computed size/weight. Terrain forced via the `data-terrain` attribute already stamped pre-paint.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/scripts/check-css-vars.mjs` | New |
| `apps/web/package.json` | `lint` runs it |
| `apps/web/e2e/contrast.spec.ts` | New |

## Alternatives considered

- axe-core for contrast: new dependency, and it skips text over gradients/images (the map hero) — the custom walk handles composited backgrounds the way the 2026-08-05 pass did.

## Risks

- Background detection over SVG/gradient areas is approximate; those elements get an explicit allow-list with a reason each.

## Verification

Each gate proven with a deliberate violation, then reverted.
