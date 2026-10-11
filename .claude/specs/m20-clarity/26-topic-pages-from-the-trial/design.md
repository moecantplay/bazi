# Design — Topic pages as the trial built them

## Approach

Apply the trial's topic-page commits (894387d R13, fdd5e58 R14) to main. Every file except `looks.css` and presentation's `index.ts` was unchanged on main since the trial branched, so the diff applies cleanly. `looks.css` merged by hand, keeping main's Today's-colour comment. The trial-named files are renamed and their comments point here.

## Changes

| Area | Change |
| --- | --- |
| `content/src/banks/topics/suits.ts` (R1) | Good for / Hold off on per topic key. |
| `content/src/banks/topics/depth.ts` (R2) | The written-out depth for the three topics: tagline, where it shows up, steps, closing, and the sore-spot and stage-step words. |
| `content/src/readings/topic-depth.ts`, `topic-page.ts`, `types.ts` (R1, R2) | `TopicPage` gains tagline, where, sore, visual, recurrences and closing. `topicPage(topic, facts, context?)` adds them when a context is given. The types are exported. |
| `presentation/src/topic-page.ts`, `sore-spot.ts`, `dates.ts` (R2, R3) | `topicPageFor` builds the context: strength, sore spot, natal signs, natal clash palaces, stage neighbours, and recurrences in Today's ±30-day range. `formatDayShort` formats the dates. |
| `web/src/components/topic/` (R1, R2) | `topic-page-view.tsx` lays out the sections. New: `topic-sections.tsx`, `topic-suits.tsx`, `topic-sore-spot.tsx`, `topic-visual.tsx` (stage hill, sign tiles), `topic-stars.tsx`. |
| `web/src/app/looks.css` (R1, R2) | Styles for the suits card and the fuller page. |
| Tests | Content `topic-pages.test.ts` (suits for every key, the written topics' shape, voice and source). Presentation `topic-depth.test.ts`. E2E `glossary.spec.ts` (suits headings, the full written page). |

## Alternatives considered

- **Wait for M20-22 to ship the full version.** Production would lag the trial the owner approved, and M20-22 is a large writing job that hasn't started.

## Risks

- **Uneven depth.** Three topics are written out, and the rest show the layout with their current lines. That's exactly the trial's state, and M20-22 closes the gap.
- **The sore spot is unsourced in the engine.** It's cited in presentation and flagged as a stopgap until M20-23.

## Verification

- `pnpm verify`.
- Full E2E in every look.
- The steady-work page screenshotted in both themes.
- Deploy to production, then a live check of a written-out page.
