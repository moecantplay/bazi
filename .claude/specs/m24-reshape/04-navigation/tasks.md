# Tasks — Navigation and Settings in the header

Check a task only with a one-line evidence note.

- [x] 1. Navigation E2E first: four tabs, gear and Back, leaf titles, no Conditions link, "Look for Today", the share link landing on People (R1–R6) — navigation.spec.ts (tabs, gear and Back, leaf titles under their tab, no Conditions link, "Look for Today", previews without the gear) failed first, then passed
- [x] 2. Bottom nav, Settings gear, AppShell; leaf pages with Back and new titles (R1–R3) — bottom-nav four tabs with `matches` (People also lights for /compare, a change from the trial), settings-gear, app-shell, Settings/Chart/Compare/Cycles with Back and new titles
- [x] 3. Today headers: tone and gear together; previews without the gear (R2, R7) — the gear joins the tone phrase in Explorer and Instrument (gap-2 added after screenshots showed them touching) and sits beside the date on Editorial's poster; previews pass showSettings={false}
- [x] 4. Settings: Conditions block gone, toggles regrouped, "Look for Today"; onboarding's share redirect to People (R4–R6) — Conditions block removed; toggles under "How your chart is counted"; "Look for Today"; onboarding's share redirect goes to /people
- [ ] 5. Existing E2E specs updated for the new navigation; `pnpm verify`; full E2E in every look; screenshots; deploy; live check (R8)
