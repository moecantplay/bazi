# Design — People

## Approach

Lift the trial's People (trial commits 63818aa, 6c23837) into proper homes, reusing the plain-reading module and Ahead's character cards for "what they bring out in you". The behaviour and wording are the trial's.

## Changes

| Area | Change |
| --- | --- |
| `content/src/banks/people/pair.ts` (R2) | `PAIR_LEADS` (by `ElementRelation`), `PAIR_INTERACTION_CARDS`, `PAIR_AREA_SUFFIX`. |
| `content/src/readings/people/pair-reading.ts` (R2) | `pairReading(compareFacts)`. |
| `presentation/src/pair-screen.ts` (R2) | `pairScreenFor(profile, birth)`, from `compareBundleFor`. |
| `web/src/components/people/people-view.tsx`, `app/people/page.tsx` (R1, R3) | As in the trial: saved list, Add someone (`CompareForm`), plain lead and cards, and a link to `/compare/`. It reads a stashed incoming share, which only exists right after landing from a share link (redirected to `/compare/` until M24-04). |
| Tests | Content `pair-reading.test.ts`; presentation `pair-screen.test.ts` (every fixture against Fixture B); E2E `people.spec.ts` (the trial's People spec). |

## Alternatives considered

- **Restyle Compare.** It keeps the empty-form opening the proposal set out to remove.

## Risks

- **An unreachable route ships until M24-04.** It's harmless.

## Verification

- `pnpm verify`.
- Full E2E in every look.
- Screenshots in light and dark.
- Deploy to production, then a live check of `/people/` with a saved person, in both themes.
