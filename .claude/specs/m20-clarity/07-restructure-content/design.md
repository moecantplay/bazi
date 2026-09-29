# Design — Restructure content

## Approach

1. Snapshot first: a temporary script (the copy-audit from ticket 02 in JSON mode) dumps every rendered line; saved outside the repo.
2. Moves:
   ```
   src/
     readings/    daily, natal, compare, horizon, luck, guidance (was day-guidance.ts)
     banks/       unchanged
     vocab/       stems, branches, interactions, palaces, stars, stages, ten-gods,
                  officers, activities, index.ts (re-exports)
     reference/   glossary, read-more
     tokens.ts  types.ts  hash.ts  index.ts
   ```
3. Re-dump and diff: must be empty.

Ticket 01 lands first because it rewrites the vocab run constructors; moving them first would double the diff.

## Changes

See tree. Public exports unchanged.

## Alternatives considered

- Splitting vocab by kind (glosses vs. run builders): subject is how a writer searches.

## Risks

Low; pure moves with an output diff as proof.

## Verification

Empty before/after diff; content tests green; `pnpm verify`.
