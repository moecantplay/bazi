# Design — Glyph icon system

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-07-17 glyph icon entry, commit `6cd09fc`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Owner chose element-hue icons over bare-ink and tinted chips, with fill-encoded polarity.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/glyph-icon-paths.ts`, `components/glyph-icon.tsx` | icons |

## Alternatives considered

Bare-ink icons; tinted chips; stock icon packs (rejected).

## Risks

Not recorded.

## Verification

Owner review.

## Decisions

- 2026-07-17 Glyph icon system: bespoke fine-line set; stock icon packs rejected (license + style mismatch).
