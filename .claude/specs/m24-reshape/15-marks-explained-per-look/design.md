# Design — What the marks mean, per look

## Approach

1. **Entries** (`packages/content/src/marks.ts`, new; spread into `GLOSSARY` from `glossary.ts`). One entry per link, keyed by `MARKS_TOPIC`:
   - `marks:dial`: Instrument's one sheet (owner, 2026-10-13). It covers the rings first, then the dial: the 24-hour ring, rough/easy/best-hour arcs, rim animals, hand.
   - `marks:almanac`: Editorial's three dots.
   - `marks:trail-week`: Explorer's elevation strip, covering the heights and animals.
   - `marks:trail-route`: Explorer's route. It covers the walked stretch, NOW, rough, easy and the best hour.
   The old `WEEK_TOPIC` / `WEEK_ENTRY` is removed: none of the looks drew its marks any more. The legacy `ROUTE_TOPIC` stays for `MapHero` until M24-12. The rough/easy paragraph and the best-hour sentence are shared constants, so Instrument and Explorer say them the same way. They follow `HOURS_TOPIC`'s wording (`banks/topics/day.ts`).
2. **Link** (`marks-legend-link.tsx`, renamed from `week-legend-link.tsx`). `MarksLegendLink` takes a `topic` prop and stamps `data-marks-legend={topic}`. `WEEK_TONE_WORD` moved to its own `week-tone-word.ts`, since it labels week cells and has nothing to do with the link.
3. **Explorer route link** goes in `today-explorer.tsx`, directly under `RouteHero`, not inside it. The hero is a fixed 518px box with the route pinned to its bottom (`looks.css:136`). Putting the link outside also keeps it out of the look previews on Settings, which render `RouteHero` alone.
4. **DESIGN.md**: §Explorer (the route link; the old "every mark labels itself" line is kept as history), §Explorer below-hero, §Editorial and §Instrument each say their link opens that look's own sheet.

## Copy as shipped

**Instrument — The week and the day**
- The seven rings are the days ahead: a solid green ring leans your way, a dashed amber ring is a day to take slower, and a plain grey ring sits even. The filled one is the day on screen; tap any ring to open that day.
- The dial below is the whole day, noon at the top and midnight at the bottom. When you're looking at today, the hand points at now.
- The amber arc is the day's rough hour, when small things tend to jostle: keep it for routine work. The green arc is the easy hour, when plans tend to settle without a fuss: put the conversation that matters there.
- The thin arc with a star, just outside the ring, is your best hour: the two hours whose element your birth chart runs better with. Unlike the rough and easy hours, which everyone shares, that one is yours alone.
- The animals round the edge mark the day's twelve two-hour blocks. The lit ones are the hours above and the one you're in now.

**Editorial — The week**
- Each day carries a dot: green leans your way, amber is a day to take slower, and grey sits even.
- The highlighted cell is the day on screen. Tap any day to open it.

**Explorer, bottom — The week ahead**
- The higher a day sits, the more it leans your way; low days are ones to take slower, and the middle is even. Each point carries that day's animal.
- Today is the filled disc, and a ringed day is the one on screen. Tap any day to open it.

**Explorer, route — Today's route**
- The route is the day, from morning on the left to evening at the flag. The solid stretch is the part you've already walked, and the disc labelled NOW is where you are.
- The amber circle with an X is the day's rough hour, when small things tend to jostle: keep it for routine work. The green circle is the easy hour, when plans tend to settle without a fuss: put the conversation that matters there.
- The star is your best hour: the two hours whose element your birth chart runs better with. Unlike the rough and easy hours, which everyone shares, that one is yours alone.
- When now falls inside one of these hours, the NOW disc wears its colour as a ring. Each mark's label gives its time.

Changed from the draft after the dark-theme screenshots: "dark disc" / "dark cell" became "disc labelled NOW", "filled disc" and "highlighted cell". The anchor pair is light in dark theme, so "dark" named the wrong mark there. A test now bans dark/black/white in these sheets. "On today, the hand…" became "When you're looking at today, the hand…".

## Changes

| Area | Change |
| --- | --- |
| content `marks.ts` (new), `glossary.ts`, `index.ts` | four per-link entries; `WEEK_TOPIC` removed |
| content `test/marks.test.ts` (new), `test/glossary.test.ts` | each sheet pinned to its marks; no retired marks, system terms or theme-bound words; old week test removed |
| web `marks-legend-link.tsx` (renamed), `week-tone-word.ts` (new) | topic prop; tone words split out |
| web `elevation-profile.tsx`, `looks/almanac/week-calendar.tsx`, `looks/dial/today-instrument.tsx`, `looks/dial/week-rings.tsx` | pass their topic / new import path |
| web `looks/trail/today-explorer.tsx` | route link under the hero |
| web `e2e/glossary.spec.ts` | each look's link opens its own sheet |
| `foundation/DESIGN.md` | §Explorer, §Editorial, §Instrument link lines |

## Alternatives considered

- **Fix the one shared entry to describe all three weeks.** Rejected: readers would wade through two looks' marks they can't see.
- **Inline legend under each object instead of a sheet.** Rejected: Instrument already has its key, and Explorer's hero has no room without pushing the reading below the first screen.
- **Link inside the route hero.** Rejected: the hero is fixed-height with the route at its foot, and the previews on Settings would carry the link too.

## Risks

- The route link adds about 40px under Explorer's hero. The "board on the first screen" E2E still passes for trail at 390×844.

## Verification

Content unit tests (R1, R2, R4), E2E per look (R1–R3), screenshots of each look's page and sheet in both themes (R3), `pnpm verify`, deploy.

Mockups: this ticket's mockups were the built pages, screenshotted in both themes before commit, rather than a separate mockup round. The change only adds a text link in the existing style and text in the existing sheet.
