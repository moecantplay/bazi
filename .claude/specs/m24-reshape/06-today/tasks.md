# Tasks — Today slimmed, with Today's colour

Check a task only with a one-line evidence note.

- [x] 1. Tests: day colour (content, presentation for a year per fixture), E2E for the colour, the banner and the moved links (R1–R3) — day-colour.test.ts 1/1; today-colour.test.ts 5/5 (a suiting colour on all 366 days per fixture); E2E: colour (beige on 2026-10-15, below the suits), banner after onboarding, Find a day from Ahead, the explainer on You, neither link on Today
- [x] 2. Content and presentation for Today's colour; `portraitLine` exported (R2, R3) — banks/colours.ts dayColourLine; readings/daily/day-colour.ts; presentation today-colour.ts (elementSplit from M24-08); portraitLine exported
- [x] 3. Web: first-day banner, Today's colour card and swatch style, both links off Today, three compositions (R1–R3) — first-day-banner.tsx, today-colour.tsx, .day-colour-swatch; Find a day link and AboutReadingLink gone from Today; banner before the topic cards and colour after the suits in all three looks
- [x] 4. `pnpm verify`; full E2E in every look; screenshots; deploy; live check (R4) — `pnpm verify` green; full E2E 249/251 per look, every failure a fast Chromium crash that passed on rerun or in the next full run (M20-25); banner and colour screenshotted in 3 looks × 2 themes; deployed 2026-10-11 04:20 GMT, sw `daymaster-e7c6a8f3e465` live; production Today shows Today's colour and neither moved link in all three looks, both themes; You carries the explainer
