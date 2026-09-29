# Design — Show Chinese characters toggle

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08, commit `f5b450d`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Stored at `daymaster.han.v1` ("hide" = off, absence = on); content's `stripHanCharacters` strips reading text, branch runs become animal names.

## Changes

| Area | Change |
| --- | --- |
| `apps/web` HanCharactersProvider | toggle |
| `packages/content` stripHanCharacters | strip |

## Alternatives considered

English-first redesign (owner chose the toggle at this point).

## Risks

Not recorded.

## Verification

E2E.

## Decisions

- 2026-07-08 "Show Chinese characters" settings toggle (owner choice over an English-first redesign) — SUPERSEDED 2026-07-17 (default flipped, then characters removed entirely; see M17.5).
