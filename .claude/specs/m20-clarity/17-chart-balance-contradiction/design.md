# Design — Chart says one thing about balance

## Approach

Selection in `natal-reading.ts`: pick a dominant-element line or a balanced line, not both, keyed on the margin from R1. Add a small `ALL_PRESENT_LINES` bank ("nothing missing") for R2, written by content-writer under VOICE.md.

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/banks/elements.ts`, `natal-reading.ts`, tests | Selection rule, new lines |

## Alternatives considered

Dropping the balanced lines: loses a true statement for genuinely even charts.

## Risks

None.

## Verification

R1 sweep; `pnpm verify`.
