# Design — Remove the unused compare reading

## Approach

Snapshot `pairScreenFor` for every ordered fixture pairing. Delete the reading path from `compareBundleFor` down: `compareReading`, its bank, its type and its exports. Then delete or trim the tests that only exercised it, re-run the snapshot, and drop the plain-writing exclusion.

## Changes

| Area | Change |
| --- | --- |
| `packages/presentation/src/compare.ts` | No reading in the bundle |
| `packages/content/src/{compare-reading.ts,banks/compare.ts}` | Deleted |
| `packages/content/src/{index.ts,types.ts}` | Exports and `CompareReading` removed |
| `packages/*/test/compare.test.ts`, `content/test/{collect,voice,glossary}.test.ts` | Reading-only cases removed |
| `packages/content/test/plain-writing-rules.ts` | Exclusion dropped |

## Alternatives considered

- Keep it in case Compare returns: M24-12 retired it "until further notice". If it comes back, it will be rebuilt in the plain voice, and this bank would be rewritten anyway.

## Risks

- A gloss shared with live screens gets removed by mistake. Mitigation: remove only names whose every importer is being deleted, and typecheck catches the rest.

## Verification

`pnpm verify` green; `pairScreenFor` snapshot unchanged; People screen check in the running app.
