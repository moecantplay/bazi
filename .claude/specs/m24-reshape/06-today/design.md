# Design — Today slimmed, with Today's colour

## Approach

Apply the trial's Today changes (commits c024283, 8be7b49) to main's three Today compositions, which M20-24 and M24-04 have changed since. Today's colour reuses M24-08's colour bank and element split. As before, presentation picks the element and content phrases it, keeping chart maths out of content.

## Changes

| Area | Change |
| --- | --- |
| `content/src/banks/colours.ts` (R3) | `dayColourLine(mode, colour)`. |
| `content/src/readings/daily/day-colour.ts` (R3) | `dayColour(element, mode, seedKey)` picks a shade of the element by hash. |
| `content/src/index.ts` (R2, R3) | Exports `portraitLine` and `dayColour`. |
| `presentation/src/today-colour.ts` (R3) | `todayColourFor(profile, dateISO)`: the day stem's element. If it helps the reader, that element; else a helper that controls it, else the helper it produces. One always exists (the reasoning is in the comment). Uses `elementSplit` (M24-08) and `dailyBundleFor`. |
| `web/src/components/today/first-day-banner.tsx` (R2) | Renders when the profile's `createdAt` date equals the displayed date. |
| `web/src/components/today/today-colour.tsx`, `app/looks.css` (R3) | The card in the `.suits` tonal style. `.day-colour-swatch` is a 28px real-colour circle with an inset ring. |
| `web/src/components/today/today-suits.tsx` (R1) | Drop the Find a day link. |
| Three Today compositions (R1–R3) | Drop `AboutReadingLink`. Add `FirstDayBanner` before the topic cards, and `TodayColour` after `TodaySuits`. |
| E2E | chart-today-datenav (Today's colour), onboarding-to-chart (banner), dates-guidance (Find a day from Ahead), glossary (the explainer on You), today-looks (neither link on Today). |

## Alternatives considered

- **Colour inside What the day suits.** It's shorter, but a colour isn't an activity, and the trial's separate card was approved.

## Risks

- **Real-colour swatches in the base design.** DESIGN.md's swatch rule (M24-01) covers them: small, named, ringed, never a mass.

## Verification

- `pnpm verify`.
- Full E2E in every look.
- Screenshots of Today in 3 looks × 2 themes.
- Deploy to production, then a live check of Today in each look.
