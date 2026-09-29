# Tasks — Chart says one thing about balance

Check a task only with a one-line evidence note.

- [x] 1. Sweep test, failing first (R1) — `content/test/element-balance.test.ts`: exhaustive over all 7,775 count vectors (0–5 per element) instead of 1,000 seeded charts; failed on the old rule (tie, Fixture A, single-element charts)
- [x] 2. Selection rule + lines (R1, R2) — `elementLead()` in natal-reading.ts; no new bank needed (R3 keeps missing lines); content 130/130; the "every dominant element" coverage test now gives each element a real lead
- [x] 3. `pnpm verify`; screenshot Fixture A Chart — verify green; chart + glossary E2E 10/10; `fixture-a-elements.png` shows the balanced line only
