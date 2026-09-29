# Design — Smaller first load

## Approach

- R1: `scripts/generate-solar-terms.ts` also emits `data/solar-terms.packed.ts` (Int32 minutes since 1900-01-01T00:00Z per jié, in order; seconds are kept in a second array only if tests show any instant needs them). `solar-terms.ts` decodes it once at module load. The JSON stays as the audit source, test-only.
- R2: dynamic `import()` of the true-solar module behind a preload (`ensureTrueSolarReady()`) called by `ProfileGate` when `config.trueSolarTime` is true; `pillars()` stays synchronous and throws a clear error if called on the true-solar path before preload. Settled: preload (owner, 2026-09-29).

## Changes

| Area | Change |
| --- | --- |
| `packages/bazi-engine/scripts/generate-solar-terms.ts`, `data/`, `src/solar-terms.ts`, `src/pillars.ts` | Packed table; lazy true-solar |
| `apps/web/src/components/profile-gate.tsx` | Preload when needed |

## Alternatives considered

Fetching the table at runtime: adds a network dependency to first render.

## Risks

Precision: must be proven bit-exact against the JSON (R1 test).

## Verification

Engine tests and golden fixtures; E2E; before/after bundle and LCP table.
