# Design — PWA platform polish

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 icon + splash entries, commit `563cecb`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

`public/icon.svg` is the single artwork source; generators rasterize the variants and screenshots.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/scripts/generate-icons.mjs`, `generate-manifest-screenshots.mjs` | generators |

## Alternatives considered

iOS splash images (skipped).

## Risks

Not recorded.

## Verification

Manifest + icon checks.

## Decisions

- 2026-07-08 Icon pipeline: public/icon.svg is the single artwork source; generate-icons.mjs rasterizes any (192/512), maskable (0.78 safe zone), opaque 180px apple-touch.
- 2026-07-08 iOS splash images deliberately skipped: dozens of viewport-pinned PNGs for one launch frame.
