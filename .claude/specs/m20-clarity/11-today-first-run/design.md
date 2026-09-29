# Design — Today for a first-time reader

## Approach

- Store: add `intro: { firstSeen: ISODate; dismissed: string[] }` to the v2 store document (additive; older documents read as "returning user" so R3 holds).
- Presentation: `introStage(store, todayISO)` → which elements are revealed and which one gets its first-time note today. Pure, tested.
- Web: Today reads the stage; each introducible element has a one-line note slot.
- Copy for notes goes through VOICE.md checks like any other content (lives in `content/reference/`).

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/store/` | `intro` field + sanitiser |
| `presentation/src/screens/today/intro.ts` | `introStage` |
| `content/src/reference/intro.ts` | Note copy |
| `apps/web/src/features/today/` | Reveal + notes |

## Alternatives considered

- A coach-mark tour on day one: front-loads everything again, which is the problem.

## Risks

- Hides features from users who would want them immediately; "More" still exposes everything.

## Verification

Presentation tests for `introStage`; E2E days 1–5 with a pinned clock; existing-profile E2E skips intro; live check.
