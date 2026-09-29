# Design — Copy rewrite

## Approach

Bank by bank, largest repeat offender first (from copy-audit). For each bank:

1. Brief: what the slot is for, the facts it can cite, the rules, 3 good and 3 bad examples from the current bank.
2. Draft (writer or Claude), run checks, owner reads a rendered sample week.
3. Merge; re-run copy-audit.

If a writer is engaged, the brief doubles as their spec; banks stay TypeScript arrays, the writer delivers a spreadsheet and Claude converts it.

## Changes

`packages/content/src/banks/*` only.

## Alternatives considered

- Rewrite everything at once: nothing is reviewable.

## Risks

- Changes every reading users see; ship once, not bank by bank to production, so the voice shifts in one step.

## Verification

Plain-writing and voice tests green; copy-audit targets met; owner sign-off on sample weeks.
