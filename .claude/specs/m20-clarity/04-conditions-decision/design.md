# Design — Conditions: keep or drop

## Approach

Depends on the answer.

- **Drop:** one commit removing `apps/web/src/app/conditions/`, `apps/web/src/components/conditions/`, `apps/web/src/lib/condition-icon-paths.ts`, `packages/presentation/src/conditions-screen.ts` (+ export, test), the Settings link, `apps/web/e2e/conditions.spec.ts`. `hourBlocks` / `currentHourBlockIndex` are checked for other callers first and kept if ticket 11 wants them.
- **Keep / promote:** no code in this ticket; list what ticket 10/11 inherit.

## Changes

See approach.

## Alternatives considered

Leaving it undecided: every restructure ticket would reorganise code that may be deleted.

## Risks

None beyond a missed reference; the build and grep catch it.

## Verification

`pnpm verify`, E2E, live check that Settings no longer links to a dead route.
