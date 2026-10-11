# Design — Ahead

## Approach

Lift the trial's Ahead (trial commits 7ef4544, c115b3c, 4d74ef0) into proper homes, as M24-08 did for You, reusing its plain-reading module. The behaviour and wording are the trial's.

## Changes

| Area | Change |
| --- | --- |
| `content/src/banks/ahead/period.ts` (R5) | `PERIOD_LEADS`, `PERIOD_QUIET_LEADS`, `PERIOD_ELEMENT_SENTENCES`, `PERIOD_INTERACTION_CARDS`, `PERIOD_TEN_GOD_CARDS`, typed with the shared `CardText`. People (M24-09) reuses the character cards. |
| `content/src/readings/ahead/period-reading.ts` (R1, R5) | `periodReading(facts, span)`: the strongest link leads, using Today's severity order (`rankTransits`), and a quiet period leads with its character. Every other link becomes a card. |
| `presentation/src/ahead-screen.ts` (R1, R2, R6) | `monthView`, `yearView`, `decadeView`, `decadesOf`, `monthsOfYear`, `yearsOfDecade`, `MONTH_NAMES`. **Changed from the trial (R6):** `monthView` returns null for a month outside the engine's solar-term table, catching only `RangeError` as `chart-preview.ts` does. `monthsOfYear` lists only readable months, and `yearsOfDecade` stops at 2100. The trial crashed on December 2100 and on a 2020-born reader's last stretch. |
| `web/src/components/ahead/` (R1–R4) | `ahead-view.tsx`, `period-zooms.tsx` (the month chips now come from `monthsOfYear`), `ahead-lists.tsx`, `plan-something.tsx`; `app/ahead/page.tsx`. |
| `web/src/components/dates/date-finder.tsx` (R3) | Reads `?activity=` and starts on that activity with the default window searched. |
| Tests | Content `period-reading.test.ts`; presentation `ahead-screen.test.ts` (every fixture, both edges, a young reader); E2E `ahead.spec.ts` (the trial's two Ahead specs). |

## Alternatives considered

- **Keep Cycles and restyle it.** That repeats the old three-card shape the proposal set out to remove, and loses the plain leads.
- **Guard the edges in the UI.** That leaves presentation able to throw for any caller. Guarding in presentation covers every caller.

## Risks

- **An unreachable route ships.** `/ahead/` has no tab until M24-04, which is harmless.
- **Cost of the year list.** "Month by month" computes twelve month readings per year switch. The trial ran this on phones without a visible delay.

## Verification

- `pnpm verify`.
- Full E2E with `E2E_LOOK=trail|almanac|dial`.
- Screenshots in light and dark.
- Deploy to production, then a live check of `/ahead/` in both themes.
