# Tasks — People

Check a task only with a one-line evidence note.

- [x] 1. Tests: content wording and builder, presentation for every fixture, E2E People spec (R1–R3) — pair-reading.test.ts 3/3 (every relation and link in plain words, the trial's lead kept); pair-screen.test.ts 5/5 fixtures; people.spec.ts
- [x] 2. Content: pair bank and builder; exports (R2, R4) — banks/people/pair.ts, readings/people/pair-reading.ts (character cards shared from banks/ahead/period.ts)
- [x] 3. Presentation: `pair-screen.ts` (R2, R4) — pair-screen.ts
- [x] 4. Web: People view and `/people/` page (R1, R3) — components/people/people-view.tsx, app/people/page.tsx; no "trial" in the touched paths; Compare's rename waits for M24-04, so the spec checks the /compare/ URL
- [x] 5. `pnpm verify`; full E2E in every look; screenshots light and dark; deploy; live check (R4) — `pnpm verify` green; full E2E 240–241/242 per look, every failure a fast Chromium crash passing on rerun (M20-25); screenshots light and dark; deployed 2026-10-11 03:41 GMT, sw `daymaster-1a9e72248a4b` live; production /people/ with a saved person passes in both themes
