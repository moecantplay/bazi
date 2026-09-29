# Design — Copy audit baseline

## Approach

A script in `packages/presentation/scripts/copy-audit.ts`, run with `tsx`, importing `todayScreenModel` and the shared test fixtures. The 2026-09-29 ad-hoc audit (a throwaway vitest file) is the prototype; this makes it permanent.

Wired as `pnpm copy-audit` at the root. Not part of `pnpm verify` — it measures, it does not gate. Tickets that want a gate turn their target into a unit test.

## Changes

| Area | Change |
| --- | --- |
| `packages/presentation/scripts/copy-audit.ts` | New script |
| `packages/presentation/test/fixtures.ts` | Add Fixtures B–D if missing |
| root `package.json` | `copy-audit` script |
| this ticket | `baseline.json` + summary table |

## Alternatives considered

- A vitest file writing a report: mixes measuring with testing and runs on every `pnpm test`.

## Risks

- `tsx` must resolve the engine's `createRequire` astronomy-engine load; it already does for engine scripts.

## Verification

Run twice, identical output (determinism). Numbers for Fixture A match the 2026-09-29 ad-hoc audit over the same 60 days.
