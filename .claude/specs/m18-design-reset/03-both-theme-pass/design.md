# Design — Both-theme pass

Reconstructed 2026-09-29 from: `_sources/progress.md` §M18, `_sources/decisions-log.md` 2026-07-30 entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Both themes are one design, not a light design plus a dark port.

## Changes

Not recorded.

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Scripted parity diff + contrast.

## Decisions

- 2026-07-30 Both themes are one design: (a) review both themes on device with a Light/Dark/System control, parity scripted; (b) contrast computed on rendered text in both themes; (c) the anchor is defined by distance from the ground, so it inverts in dark; (d) no theme rule only in @media — every one needs [data-theme] twins.
