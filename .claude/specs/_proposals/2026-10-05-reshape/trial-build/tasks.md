# Tasks — Reshape trial build

Check a task only with a one-line evidence note.

- [ ] 1. Branch `trial/reshape` off `main`; confirm the chart-free facts available for the Welcome sample (R1, R3)
- [ ] 2. Four-tab nav, header gear, Settings via Back; remove the Conditions entry; label "Look for Today" (R2)
- [ ] 3. Onboarding: Welcome step, four gathering steps, sex step carries the reason and disclaimer, land on Today (R3)
- [ ] 4. Today: drop the day-pillar label in all three looks; move Find a day and "How this reading works" off Today; first-day banner (R4)
- [ ] 5. Content: `banks/trial/` — period leads, You cards, pair leads; `periodLead` and pair-lead builders; tests for no system terms and determinism (R5, R6, R7)
- [ ] 6. Ahead screen: switch, 10 days, Month / Year / Decade with leads and cards (R5)
- [ ] 7. You screen: portrait lead, plain cards, "Your chart in full" → `/chart/` (R6)
- [ ] 8. People screen: saved list, Add someone, pair lead and cards (R7)
- [ ] 9. E2E updated and added; `pnpm verify` green (R2, R3, R5, R7, R8)
- [ ] 10. Preview deploy (no `--prod`); production `last-modified` unchanged; live check on phone size, light and dark (R1, R8)
- [ ] 11. Hand-off note to the owner: preview link, how to move the chart over, what's final-shape vs placeholder (R8)
- [ ] 12. Ahead packs in more: tappable strip, coming-up days, month picker with best/bumpiest days, month-by-month, year-by-year, next previews; tests; redeploy preview (R9)
- [ ] 13. Ahead reworked as Plan something + Your seasons; single-day lists and their models removed; Find a day reads `?activity=`; tests; redeploy (R10)
- [ ] 14. Year picker on Ahead's Year view; 2100 edge guarded; E2E; redeploy (R11)
- [x] 15. Plan something moved below Your seasons; E2E; redeploy (R12) — 4d74ef0; E2E chromium 76/76 (order asserted), mobile-webkit tabs 5/5; `pnpm verify` green; preview https://daymaster-m7f1cvh1l-gervin-sean-mirandas-projects.vercel.app, production last-modified unchanged
- [x] 16. Good for / Hold off on, on topic pages: bank, builder, card, tests; redeploy preview (R13) — 894387d; `pnpm verify` green; glossary E2E 18/18 across chromium, mobile-chromium and mobile-webkit; label contrast 6.11/5.59 light, 8.89/8.07 dark; preview https://daymaster-mhkge7me0-gervin-sean-mirandas-projects.vercel.app; production last-modified unchanged
- [x] 17. The fuller topic page: banks, builder, sore spot, drawings, recurrences, sections; tests; local dev server for the owner (R14) — fdd5e58; `pnpm verify` green; presentation 207/207 incl. trial-topic-depth 6/6, content 127/127; E2E glossary + today-looks + reshape-tabs 57/57, R14 spec also green against `next dev`; all text ≥ 4.5 in light and dark (3 pages × 2 themes); served at :3001 on the LAN
- [x] 18. Your elements on You: helps / wears-down chips with plain lines and an ease line, replacing "What feeds you" (R15) — 0d27805 on `trial/reshape`; `pnpm verify` green; reshape-tabs + glossary E2E 36/36 (Chromium, WebKit); light and dark checked on the export at phone size; preview deployed, production `last-modified` unchanged
- [x] 19. Colours on You: suit / go-easy-on swatch chips, where line, fix line; classical table sourced, modern shades flagged (R16) — 2c23e1b on `trial/reshape`; `pnpm verify` green; E2E 36/36; light and dark checked; preview deployed
- [x] 20. Today's colour: card after What the day suits in all three looks; steadying rule flagged (R17) — 8be7b49 on `trial/reshape`; mockup https://claude.ai/artifact/9dwonc48gK716NiVKXzcs6 approved; `pnpm verify` green; full E2E 232/233 per look, the one failure per look passing on re-run (known Chromium flake); served at https://daymaster-trial.vercel.app (fixed trial address from 2026-10-10); production unchanged
