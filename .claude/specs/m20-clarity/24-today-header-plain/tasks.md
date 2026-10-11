# Tasks — Today's header in plain words

Check a task only with a one-line evidence note.

- [x] 1. E2E first: no plain-terms match in Today's hero or accessibility snapshot, every look × theme, plus the onboarding look step (R1–R3) — today-plain-header.spec.ts failed first in every look (no tone phrase; the look step showed "YANG"); content test day-tone-phrase.test.ts failed first; the check also caught the dial centre's "GOAT DAY" on other days
- [x] 2. Drop the label from the three heroes and delete `dayMeta` (R1, R3) — `dayMeta` deleted; `DayTonePhrase` in all three heroes (option (b), R4); the dial centre shows the weekday; DESIGN.md §Explorer, §Editorial, §Instrument updated
- [x] 3. Animal glyphs on Today hidden from screen readers (R2) — strip icons `aria-hidden` via `AnimalIcon decorative`; accessibility snapshot check passes in all looks
- [x] 4. `pnpm verify`, full E2E in every look, live check 3 looks × 2 themes plus the onboarding look step; deploy to production (R1–R3) — `pnpm verify` green; full E2E trail 230/230, almanac 230/230, dial 228/230 with both failures traced to Chromium crashes (a 462-run repeat showed one failure, a `SEGV` in the browser, not an assertion); deployed 2026-10-11, production `last-modified` Sun, 11 Oct 2026 02:27:09 GMT, sw `daymaster-dc4014038081` matches the build; scripted check on daymaster-nu.vercel.app: 3 looks × 2 themes show the tone phrase, no pillar or sign words today or the next day, no page errors; the onboarding look step shows none
