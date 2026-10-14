# What the marks mean, per look

Status: done · Milestone: M24 · Ticket: 15 · Asked by the owner 2026-10-13; approved by the owner 2026-10-13 ("ok"); copy after review approved 2026-10-14

## Problem

"The instrument has a 'What the marks mean', i think it doesn't really explain what it means. Also Explorer should also have a 'What the marks mean'" (owner, 2026-10-13).

**One explainer, three different weeks.** Every look's week calls the same `WeekLegendLink` (`apps/web/src/components/week-legend-link.tsx`), which opens one glossary entry, `WEEK_ENTRY` (`packages/content/src/glossary.ts:52`). That entry was written for the retired week strip: "A filled dot leans favorable, an open ring leans toward friction, and a short dash means the day sits even". None of the three looks draws those marks any more:

| Look | What the week actually draws | Where |
| --- | --- | --- |
| Instrument | 38px rings: solid green, dashed amber, plain grey; the day on screen filled dark | `looks/dial/week-rings.tsx`, `looks.css:154` |
| Editorial | calendar cells, each with a green, amber or grey dot | `looks/almanac/week-calendar.tsx` |
| Explorer | an elevation line: days that lean your way sit higher, rough days lower, each with that day's animal; today in a dark disc | `elevation-profile.tsx` |

So on Instrument the sheet describes dots and dashes that aren't on the screen.

**The dial is not explained at all.** The link sits under Instrument's week rings and says nothing about the dial below it: a 24-hour ring with noon at the top and midnight at the bottom, an amber arc for the rough hour, a green arc for the easy hour, a thin outer arc with a star for your best hour, the twelve animals on the rim, and a hand pointing at now (`looks/dial/day-dial.tsx`). The key under the dial (`DialKey`) names the hours and colours but not what a rough, easy or best hour is.

**Explorer's route has no explainer.** The route hero (`looks/trail/route-hero.tsx`) draws the solid walked stretch up to NOW, the NOW disc with today's animal, the amber-ringed rough hour with an X, the green-ringed easy hour, and the best-hour star. DESIGN.md §Explorer (line 157) chose this on purpose: "No 'What the marks mean' link: every mark labels itself." The labels give the times ("ROUGH · 3–5 AM"), but not what rough, easy or your best hour mean, or what the solid stretch is. Explorer's only link is at the bottom of the page, under the elevation strip, and it opens the same mismatched week entry.

## Goal

Every "What the marks mean" link opens a sheet that describes exactly the marks drawn above it, in that look, in everyday words. Explorer's route gets its own link.

## Requirements

- **R1. Each look's week has its own explainer that matches what it draws.**
  - Instrument rings, Editorial dots and Explorer elevation each get an entry naming the marks as drawn (shape, colour, height) and what tapping a day does.
  - Acceptance: a content unit test pins each look's entry to its marks (for example, the Instrument entry mentions "dashed" and "ring" and does not mention "dash" alone or "dot"). An E2E test opens the link in each look and finds that look's title.

- **R2. Instrument's explainer covers the dial as well as the week.**
  - The sheet explains the 24-hour ring (noon at the top, midnight at the bottom), the rough arc, the easy arc, the best-hour arc and star, the rim animals, and the hand. It says what a rough, easy and best hour is in plain words: the rough and easy hours belong to the day and everyone shares them; the best hour is yours.
  - Acceptance: content unit test for each mark named; E2E opens the Instrument sheet and finds "best hour".

- **R3. Explorer's route gets a "What the marks mean" link and entry.**
  - Under the route hero. The sheet covers the route (morning to evening), the solid stretch walked up to now, the NOW disc, the rough hour (amber ring and X), the easy hour (green ring), and your best hour (star), with the same plain meanings as R2.
  - DESIGN.md §Explorer line 157 changes to record the link, through this ticket.
  - Acceptance: E2E on Explorer finds the route link and its sheet; screenshots in both themes show the link doesn't crowd the route hero.

- **R4. Copy follows VOICE.md and Today's plain-words rule.**
  - No system terms (no "clash", "combine", "sign" as jargon), no fatalism, every rough mark paired with what to do with it.
  - Acceptance: the existing voice tests run over the new entries; owner reads the copy in the mockups.

## Out of scope

- Changing any mark's drawing, colour or position.
- The legacy `MapHero` and its `ROUTE_TOPIC` entry (retired by M24-12).
- The NOW pill overlap (M24-14).

## Open questions

- [x] Instrument: one sheet for week and dial from the one link, or a second link under the dial key? **One sheet** (owner, 2026-10-13).
- [x] Explorer: keep the bottom link for the elevation strip as well as the new route link, or one sheet that covers both? **Two links**, each with its own sheet (owner, 2026-10-13).
