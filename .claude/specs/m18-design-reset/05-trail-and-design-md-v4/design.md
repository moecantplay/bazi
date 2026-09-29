# Design — Trail chosen; DESIGN.md v4

Reconstructed 2026-09-29 from: `_sources/progress.md` §M18, `_sources/decisions-log.md` 2026-08-05 entries. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Trail's dashed route reads as wayfinding and generalizes past the hero; neutral map framing fits the "not a verdict" voice.

## Changes

| Area | Change |
| --- | --- |
| `DESIGN.md` | v4 |
| `foundation/design-system/` | token source + cards + check |

## Alternatives considered

Daybreak, Sky, Compass, Compass II, Forecast — reasons above.

## Risks

Not recorded.

## Verification

check.mjs; reviewer.

## Decisions

- 2026-08-05 M18 direction locked: Trail, over Daybreak and Sky (generic wellness skins past one screen), Compass/Compass II (diagram didn't generalize past the hero), Forecast (weather-report framing fought the voice's "not a verdict" stance).
- 2026-08-05 Icon continuity: Trail reuses the existing icon files; only colour binding moves to theme-keyed hue tokens; sprite.html's inline paths are prototype-only.
- 2026-08-05 Anchor-mass rule resolved: Today has no primary button, so the signpost and a screen's primary CTA never compete.
