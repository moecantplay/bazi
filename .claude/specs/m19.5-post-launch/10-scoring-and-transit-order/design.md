# Design — Scoring precedence and transit order

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-09-10 refinement entries (b)–(e), commits `209fd0b`, `5cadd46`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Rules as tests so they can't regress.

## Changes

| Area | Change |
| --- | --- |
| engine `day-quality.ts`, `favorable-elements.ts`, `strength.ts` | precedence |
| content `daily-reading.ts` | severity order |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Engine and content tests.

## Decisions

- 2026-09-10 (b) officer avoid never softened; (c) strength-first favourable elements; (d) strength margin; (e) severity-ordered transits.
