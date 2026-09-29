# Design — Solar-term table

Reconstructed 2026-09-29 from: `_sources/plan.md` §M1, `_sources/progress.md` §M1. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Computed via astronomy-engine and embedded as JSON; astronomy-engine loaded through `createRequire`.

## Changes

| Area | Change |
| --- | --- |
| `packages/bazi-engine/data/solar-terms.json` | generated table |
| engine scripts | generator |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Anchor tests; monotonic check.

## Decisions

- 2026-07-07 astronomy-engine loaded via createRequire to dodge its ESM/CJS dual-build inconsistency between vite and tsx.
