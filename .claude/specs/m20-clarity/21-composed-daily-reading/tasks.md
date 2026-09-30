# Tasks — Today reads as one written piece

Check a task only with a one-line evidence note.

- [x] 1. Mockup: a composed week for Fixture A and the unknown-time fixture, three looks × two themes; owner picks budget and details layout (R2, R4, R8) — five rounds, v5 approved 2026-09-30; `research/composed-week.html`, https://claude.ai/artifact/3CMt1mepeFPMG1B2dUV7Lw
- [x] 2. VOICE.md amendments from the approved mockup (R7) — rules 2, 6, 11, 12 amended, rule 13 added, calibration examples and palace note updated
- [x] 3. Tests first (red): lead/modifier, no shared 4-word phrase, cell coverage, each fact once, nothing lost, determinism (R1–R6, R9) — `content/test/composed-daily`, `topic-pages`, `presentation/test/today-composed` written first; red on missing API (3 failed / no tests)
- [x] 4. Composer and details builder; new `DailyReading` shape (R1, R2, R4, R9) — `readings/daily/{lead,cards,daily-reading}.ts`; content 114/114
- [x] 5. Cell pools, ≥ 3 differently shaped entries per reachable cell, seeded from the approved mockup copy; 7-day phrase check green (R3) — 5 per sign-link cell, 3 per quiet cell, 420 lines; visit-count stepping (`lead-visit.ts`) after the dump showed 12/60 unique headlines; after: 60/60 headlines, bodies and actions for Fixture A over 60 days; 7-day window and next-visit tests green, 5 fixtures × 90 days
- [x] 6. Guidance: one reason per Watch chip, skip lead-owned facts (R6) — `todaySuits` (plain heading, one Watch reason); Watch-reason tests green over 90 days × 5 fixtures
- [x] 7. Presentation model; waypoints from facts; remove sections (R4, R5) — `todayScreenModel` (reading, suits), `routeWaypointsFor(facts)`, `topicPageFor`; `reading-sections.ts` removed; presentation 191/191
- [x] 8. Today in Explorer, Editorial, Instrument renders the composed first screen, topic cards and suits (R2, R4, R5) — `ReadingBody`, `TopicCards` (per-look layouts), `TodaySuits`; web typecheck/lint/build green
- [x] 8b. Topic page content for every reachable topic key (R11) — `banks/topics/`, `readings/topic-page.ts`; every card and lead over 30 days × 5 fixtures opens a page (`topic-page.test.ts`)
- [x] 8c. Topic page route in three looks; Today keeps its date in `?date` (R11) — `/today/topic/` built as a static route; `?date` in/out via `history.replaceState`; SW matches page navigations ignoring the query
- [x] 9. Retire the per-fact day lines and dos/don'ts banks nothing references (R4, R6) — 7 banks, the old builder, 4 obsolete tests, reading-chapters/idea-cards/waypoint-rail removed; `read-more.ts` kept (Chart, Compare, Dates use it)
- [x] 10. E2E specs updated; decisions log entry — Today, glossary, dates-guidance, conditions specs; decisions.md 2026-09-30 row; CLAUDE.md standing rule
- [ ] 11. Verify: before/after dump, `pnpm verify`, E2E in every look × theme, live check both themes, owner reads a week for two fixtures — done: dump (headlines 15→60/60, actions 19→60/60, ~340→~128 words/screen); `pnpm verify` green; E2E 215/look × 3 looks green (Chromium crash flakes passed on rerun); live check of Today + topic pages, 3 looks × 2 themes, no page/console errors. Open: owner reads a week for two fixtures.
