# Tasks — Today's header in plain words

Check a task only with a one-line evidence note.

- [x] 1. E2E first: no plain-terms match in Today's hero or accessibility snapshot, every look × theme, plus the onboarding look step (R1–R3) — today-plain-header.spec.ts failed first in every look (no tone phrase; the look step showed "YANG"); content test day-tone-phrase.test.ts failed first; the check also caught the dial centre's "GOAT DAY" on other days
- [x] 2. Drop the label from the three heroes and delete `dayMeta` (R1, R3) — `dayMeta` deleted; `DayTonePhrase` in all three heroes (option (b), R4); the dial centre shows the weekday; DESIGN.md §Explorer, §Editorial, §Instrument updated
- [x] 3. Animal glyphs on Today hidden from screen readers (R2) — strip icons `aria-hidden` via `AnimalIcon decorative`; accessibility snapshot check passes in all looks
- [ ] 4. `pnpm verify`, full E2E in every look, live check 3 looks × 2 themes plus the onboarding look step; deploy to production (R1–R3)
