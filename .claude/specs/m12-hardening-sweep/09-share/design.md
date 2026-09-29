# Design — Share a chart

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 share entry, commit `3efcfe1`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Birth details in the URL (base64url JSON, /onboarding/?share=); a shared chart is always someone to compare with, never a replacement profile.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/share-card.ts`, `share-link.ts` | share |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

E2E.

## Decisions

- 2026-07-08 Share links encode the birth details in the URL; a shared chart is always "someone to compare with", never a replacement profile. Share card is canvas-drawn on device in the current theme; cinnabar only inside the redrawn seal.
