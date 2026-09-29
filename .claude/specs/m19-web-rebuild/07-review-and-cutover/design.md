# Design — Review and cutover

Reconstructed 2026-09-29 from: `_sources/progress.md` §M19 Phases 11, 12, `_sources/decisions-log.md` 2026-08-06 cutover entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Commit everything before a destructive step.

## Changes

Not recorded.

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Full verify; E2E; live route check.

## Decisions

- 2026-08-06 Cutover: git mv nested a level too deep because of gitignored artifacts — fixed. All session work was committed just before the cutover. Correction to decision D: no Vercel dashboard step — CLI static deploy of apps/web/out.
