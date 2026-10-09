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
- [ ] 15. Plan something moved below Your seasons; E2E; redeploy (R12)
- [x] 16. Your elements on You: helps / wears-down chips with plain lines and an ease line, replacing "What feeds you"; tests; redeploy (R15) — `pnpm verify` green; reshape-tabs + glossary E2E 36/36 (Chromium, WebKit); light and dark checked on the export at phone size; preview https://daymaster-dq0ytdazr-gervin-sean-mirandas-projects.vercel.app (302 to the Vercel login); production `last-modified` unchanged (Fri, 09 Oct 2026 19:50:47 GMT)
- [x] 17. Colours on You: suit / go-easy-on swatch chips, where line, fix line; classical table sourced, modern shades flagged; tests; redeploy (R16) — `pnpm verify` green; reshape-tabs + glossary E2E 36/36; light and dark checked on the export at phone size; preview https://daymaster-2k9pjk2i0-gervin-sean-mirandas-projects.vercel.app; production `last-modified` unchanged
