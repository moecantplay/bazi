# Design — Conditions trial

Reconstructed 2026-09-29 from: `_sources/decisions-log.md` 2026-09-15 entry, commit `dc5caab`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Pure derivations over existing facts; no new copy.

## Changes

| Area | Change |
| --- | --- |
| `packages/presentation/src/conditions-screen.ts` | model |
| `apps/web` conditions | screen |

## Alternatives considered

Not recorded.

## Risks

"Danger = rain" is close to the verdict line VOICE.md forbids.

## Verification

E2E; live static-export check both themes.

## Decisions

- 2026-09-15 Weather-app rhythm trial at /conditions/. Keep, promote or drop pending — now M20-04. "Danger = rain" icon mapping flagged against VOICE.md.
