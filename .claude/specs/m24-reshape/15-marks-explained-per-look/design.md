# Design — What the marks mean, per look

## Approach

Content first, then wiring.

1. **Entries** (`packages/content/src/glossary.ts`). Replace `WEEK_ENTRY` with one entry per look's week, and add a dial entry and a route entry:
   - `week:dial` — the rings: solid green leans your way, dashed amber means take it slow, plain grey is even, the filled one is the day on screen.
   - `week:almanac` — the dots: green, amber, grey, same meanings; the dark cell is the day on screen.
   - `week:trail` — the elevation line: higher days lean your way, lower days ask for a slower pace, the animal is that day's, today is the dark disc.
   - `dial` — the 24-hour ring, rough/easy/best-hour arcs, rim animals, hand. Instrument's sheet is `week:dial` followed by `dial` (one sheet, two short sections; owner, 2026-10-13).
   - `route` (new key, e.g. `route:trail`, so the legacy `ROUTE_TOPIC` stays untouched until M24-12) — route, walked stretch, NOW, rough, easy, best hour.
   Each paragraph 1–2 sentences, following VOICE.md and the plain-words rule. The rough and easy hours' meanings reuse the wording of `HOURS_TOPIC` (`banks/topics/day.ts`) rather than writing a third version.
2. **Link** (`week-legend-link.tsx`). Becomes `MarksLegendLink` taking the topic as a prop; each look passes its own. `WEEK_TONE_WORD` stays where it is.
3. **Explorer route** (`looks/trail/route-hero.tsx`). The link goes under the route SVG, same button styling as the week link, hidden in the look previews (`showSettings === false` already marks that case).
4. **DESIGN.md** §Explorer line 157: replace "No 'What the marks mean' link: every mark labels itself" with the link under the route; §Instrument line 177 and §Editorial line 169 say the link opens that look's own sheet.

## Draft copy

For the owner to read (task 2). Titles in bold, one line per paragraph.

**Instrument — The week and the day**
- The seven rings are the days ahead. A solid green ring leans your way, a dashed amber ring is a day to take slower, and a plain grey ring sits even. The filled one is the day on screen; tap any ring to open that day.
- The dial below is the whole day, noon at the top and midnight at the bottom. The hand points at now.
- The amber arc is the day's rough hour, when small things tend to jostle: keep it for routine work. The green arc is the easy hour, when plans tend to settle without a fuss: put the conversation that matters there. Everyone shares these two; they belong to the day.
- The thin arc with a star, just outside the ring, is your best hour: the two hours whose element your birth chart runs better with. That one is yours alone.
- The animals round the edge mark the twelve two-hour blocks of the day. The ones lit up are the hours above.

**Editorial — The week**
- Each day carries a dot. Green leans your way, amber is a day to take slower, grey sits even.
- The dark cell is the day on screen. Tap any day to open it.

**Explorer, bottom — The week ahead**
- The line climbs on days that lean your way and dips on days to take slower; a flat stretch sits even. Each point carries that day's animal.
- Today is the dark disc. Tap any day to open it.

**Explorer, route — Today's route**
- The route is the day, morning on the left to evening at the flag. The solid stretch is the part you've already walked; the dark disc is now.
- The amber circle with an X is the day's rough hour, when small things tend to jostle: keep it for routine work. The green circle is the easy hour, when plans tend to settle without a fuss: put the conversation that matters there. Everyone shares these two.
- The star is your best hour: the two hours whose element your birth chart runs better with. That one is yours alone. Each mark's label gives its time.

## Changes

| Area | Change |
| --- | --- |
| content `glossary.ts`, `index.ts`, `test/glossary.test.ts` | per-look week entries, dial entry, route entry; tests pin each to its marks |
| web `week-legend-link.tsx` | topic prop; renamed to fit |
| web `elevation-profile.tsx`, `looks/almanac/week-calendar.tsx`, `looks/dial/today-instrument.tsx` | pass their topic |
| web `looks/trail/route-hero.tsx` | route link under the hero |
| e2e | open each look's link, check its title; screenshots both themes |
| `foundation/DESIGN.md` | §Explorer, §Editorial, §Instrument link lines |

## Alternatives considered

- **Fix the one shared entry to describe all three weeks.** Lost: the reader would wade through two looks' marks they can't see.
- **Inline legend under each object instead of a sheet.** Lost: Instrument already has its key; Explorer's hero has no room without pushing the reading below the first screen.

## Risks

- The route link adds height to Explorer's first screen. Checked in the mockups at 390×844.

## Verification

Content unit tests (R1, R2, R4), E2E per look (R1–R3), screenshots in both themes reviewed by the owner before app code (mockups first), `pnpm verify`, live-app check, deploy.
