# Design — Terrain labels

Reconstructed 2026-09-29 from: commits `93a82cd`, `3dc4d77`, `063b267`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Below the baseline is the one place the route can never be.

## Changes

Not recorded.

## Alternatives considered

Staggered lane; leaning-only names (both shipped then replaced).

## Risks

Not recorded.

## Verification

Attempt 1 (`93a82cd`) measured zero label-box overlaps at 320/360/430 in both themes. Attempt 2 (`3dc4d77`) was chosen from a mockup of three candidates reviewed in both themes; the owner then picked option B from that same mockup (`063b267`), whose E2E asserts all ten names are on the plot.

## Decisions

None logged for this ticket.
