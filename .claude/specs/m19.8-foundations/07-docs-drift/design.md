# Design — Docs match the code

## Approach

Rewrite the README's Architecture, Quickstart and privacy paragraphs from the current tree. Reword each stale comment to state what the code does now, keeping the historical fact only where it explains a decision ("the legacy v1 keys", "the pre-M19 app").

## Changes

| Area | Change |
| --- | --- |
| `README.md` | Architecture, quickstart, privacy, CI, deploy |
| `apps/web/src/app/layout.tsx`, `lib/share-link.ts`, `lib/store-migration.ts`, `lib/share-card.ts`, `e2e/helpers.ts`, `e2e/store-migration.spec.ts` | Comment wording |

## Alternatives considered

Deleting the history from the comments entirely — some of it explains why the migration exists.

## Risks

None.

## Verification

Grep in R2; README commands run; `pnpm verify`.
