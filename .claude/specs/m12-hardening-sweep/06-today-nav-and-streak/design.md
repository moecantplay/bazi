# Design — Today date nav and streak

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 push entry, commits `a18a62a`, `8a852d2`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Retention via local streak, since push is impossible without a server.

## Changes

| Area | Change |
| --- | --- |
| `apps/web` today, lib/streak | nav + streak |

## Alternatives considered

Push notifications; badge API (skipped — nothing sets one).

## Risks

Not recorded.

## Verification

E2E.

## Decisions

- 2026-07-08 Push notifications are structurally out (web push requires an app server; no backend). Retention = local streak (daymaster.streak.v1) + come-back-tomorrow chrome line. Chrome lines around readings are UI copy — the agency line still ends every reading. (To be superseded once M21 lands a backend.)
