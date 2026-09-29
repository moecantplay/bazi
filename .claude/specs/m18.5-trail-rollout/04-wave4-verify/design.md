# Design — Wave 4 — Verify

Reconstructed 2026-09-29 from: `_sources/plan.md` §M18.5, `_sources/progress.md` §M18.5, `_sources/decisions-log.md` 2026-08-05 M18.5 entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Measure the shipped composition, not only tokens.

## Changes

Not recorded.

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Rendered-contrast pass + E2E.

## Decisions

- 2026-08-05 M18.5 shipped. Lesson: token-level verification does not substitute for measuring the shipped composition — opacity, shared-class reuse and terrain-shifted tokens each reintroduced failures the prototype gate had closed.
