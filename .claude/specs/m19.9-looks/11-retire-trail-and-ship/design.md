# Design — Retire the old Trail composition and ship

## Approach

Delete after all screens ship, not before. Deploy per the Vercel memory (link inside `out/`).

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/components/` | deletions/moves |
| `apps/web/e2e/` | full matrix |

## Alternatives considered

Keep old Trail as a fourth look: owner chose A, B, C only (2026-09-29).

## Risks

Deleting shared helpers still imported by a look. Mitigation: typecheck + lint unused exports before delete.

## Verification

`pnpm verify`; full E2E matrix; live app every look × theme; production smoke.
