# Design — App shell, seal and persistence

Reconstructed 2026-09-29 from: `_sources/plan.md` §M4, `_sources/progress.md` §M4, `_sources/decisions-log.md` 2026-07-07 webpack entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Webpack config resolves the engine's NodeNext `.js` specifiers to `.ts` and shims `node:module` so `createRequire` bundles.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/next.config.mjs` | extensionAlias + NormalModuleReplacementPlugin |
| `apps/web/shims/node-module.mjs` | shim |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Static export builds; seal deterministic.

## Decisions

- 2026-07-07 apps/web webpack config: extensionAlias .js→.ts (engine uses NodeNext specifiers) + NormalModuleReplacementPlugin shims node:module→shims/node-module.mjs so the engine's createRequire bundles for the browser.
