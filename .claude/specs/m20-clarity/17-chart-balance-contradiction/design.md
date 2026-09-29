# Design — Chart says one thing about balance

## Approach

`elementsSection` in `packages/content/src/natal-reading.ts` computes the lead (top count minus second count, from the fact's `counts`) and chooses: lead ≥ 2 → dominant line; then a missing-element line if any is missing, else — only when lead ≤ 1 — the balanced line. No new bank: the "all present but led" case is carried by the dominant line alone. The engine fact is unchanged (`dominant` still names the top element for other consumers).

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/natal-reading.ts`, tests | Selection rule |

## Alternatives considered

Dropping the balanced lines: loses a true statement for genuinely even charts.

## Risks

None.

## Verification

R1 sweep; `pnpm verify`.

## As built

Sweep is exhaustive over count vectors rather than seeded charts: it covers every chart the rule can see. Note for the owner: the element bars scale to the largest count, so Fixture A's Earth bar still reads full next to "sit close to even" — a presentation question, not part of this ticket.
