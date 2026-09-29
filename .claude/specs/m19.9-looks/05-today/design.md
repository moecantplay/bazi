# Design — Today in three looks

## Approach

Mock first (research/), then build. Shared logic stays in `packages/presentation` and the existing hooks; per-look composition lives in `components/looks/<look>/today/` with a thin switch on `useLook()` at the route (today/). Shared components (buttons, fields, sheets, segment stacks) restyle via `[data-look]` CSS, not forks. Today reuses the 01 mockups directly, so no new mockup round is needed unless the owner refines them. The old Trail Today composition (map hero, waypoint rail) is removed once all three looks ship (11).

### Where every piece of Today goes (mocked in `research/today-full.html`)

| Today content (current) | Explorer | Editorial | Instrument |
| --- | --- | --- | --- |
| Date nav (‹ ›, picker, back to today, 30-day limit) | hero top row | field mast, top right | top row |
| Week (7 days, tap to open a day) | elevation strip, after the journal | calendar strip, after the journal | tone rings above the dial |
| Headline + one idea (grain line) | on the hero / under it | under the field | under the dial |
| Element · animal tags; officer notice | hero meta line; officer in the fold | field foot; officer in the fold | top row; officer in the fold |
| Timed marks (easy/rough hour) | on the route | "The hours" chapter | dial arcs + key |
| Reading sections (rail) | swipe cards, one per line | chapters (collapsed) | chapters (collapsed) |
| Grain line repeated in "The day itself" | dropped from the section (said once) | same | same |
| How this reading works | link after the cards | link after chapters | link after chapters |
| Go deeper: trail signs, Find a day | fold | "What the day suits" chapter | same chapter |
| Signpost board | last, or first screen (open question) | same | same |
| Journal, streak, tomorrow line | after the board | same | same |

Titles use data the model already has (area names, citations); no new copy.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/app/today/` | route renders the look switch |
| `apps/web/src/components/looks/{trail,almanac,dial}/today/` | per-look compositions |
| `foundation/design-system/` | preview cards for this screen × 3 looks |
| `apps/web/e2e/` | look matrix for this screen's specs |

## Alternatives considered

Pure CSS restyle of one DOM: can't reach B's poster or C's dial, which are different structures. Three full route copies: triples logic and invites drift.

## Risks

Three designs of a screen drift apart in behaviour, not just looks. Mitigation: one presentation model per screen (`packages/presentation`), looks differ only in components/CSS; E2E asserts the same facts render in every look.

## Verification

`pnpm verify`; E2E matrix green; `check.mjs` green; live-app check of every look × theme on device.
