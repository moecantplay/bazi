# Design — Three directions

## Approach

Research-then-mockups, the pattern that worked in M18 and the 2026-07-17 hero round: real visual mockups, not descriptions, and expect a blend request.

Three directions, all built from existing tokens, fonts and icon art (`packages/presentation/src/animal-icon-paths.ts`, element glyphs), so the difference is composition, hierarchy and motion rather than new assets:

- **A: Trail, distilled.** Keep Trail. The map becomes a full-bleed header that *is* the first screen: date, headline and route on one terrain, route draws in on arrival, the two timed marks are the only labels. The reading becomes three swipeable waypoint cards instead of a 4-section rail. Lowest risk, evolution.
- **B: Almanac page.** Editorial and cinematic, Co-Star-adjacent. A giant day-animal silhouette on the element ground, a big serif-italic headline, one sentence, and the agency line as the only button-like object. Details live in "chapters" below a hard fold. Boldest typography, least chrome.
- **C: Day dial.** An instrument like (Not Boring) Weather and Gentler Streak. A 24-hour ring is the hero: the rough and easy hours are arcs on it, a live hand shows now, today's animal sits at the centre. It's tactile and glanceable and turns the timed facts into the signature object.

All three share: nav always clear of the hero; one anchor per screen; element ground per day; reduced-motion static.

## Changes

| Area | Change |
| --- | --- |
| `research/` | current-state screenshots; `directions.html` (three live mockups, theme toggle); screenshots per direction × theme |
| `foundation/DESIGN.md` | none here; restructured in M19.9-02 |

No app code in this ticket.

## Alternatives considered

- **Restyle in place (polish shadows, spacing, type scale):** doesn't fix the problem, which is hierarchy and length, not finish.
- **Glass/neumorphic effects pass:** researched in M18 (`effects-*.md`) and rejected; reads as trend, not identity.
- **One direction only / pick a winner:** the owner chose to ship all three as a user choice instead (2026-09-29).

## Risks

- M20-10 (Today content budget) now runs after this and must hold for all three looks.
- Direction C adds a new hero object (dial); the map's placement logic (`map-hero.tsx`) would be retired or moved.
- Motion on low-end Android: transform/opacity only, measured on device in rollout tickets.

## Verification

Owner review of the mockups on device in both themes; contrast check on the chosen mockup's rendered text; DESIGN.md diff reviewed.
