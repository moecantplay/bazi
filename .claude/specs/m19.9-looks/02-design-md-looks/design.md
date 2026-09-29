# Design — DESIGN.md: shared base and three looks

## Approach

Rewrite DESIGN.md around the 01 mockups: v4's tokens, type, icons, shared components and floor become **§Base**; each look gets a **§Looks** section naming its signature object, composition and what it forbids; v4's Today-specific surfaces and layout move **verbatim** to **§Legacy** (they describe shipped code) until 11 deletes that code. §Motion is new (from the mockups).

Design system: six new cards, built at 390px from the mockup geometry — Explorer `route-hero`, `further-along`; Editorial `poster-field`, `page-and-chapters`; Instrument `day-dial`, `week-rings-and-hours` — plus a shared `components/signpost-board-and-nav`. `build.mjs` maps each group to a look (`shared`, `legacy`, `trail`, `almanac`, `dial`) in `index.json`; `check.mjs` reads it and reports runs per look. The 430px viewport caveat stays documented.

Found while building (in scope for R3, since a gate that can't read the dial's labels can't pass the dial):
- **`check.mjs` never measured SVG text correctly**: it read CSS `color`, but SVG paints with `fill`. It now reads `fill`, against the shape the label sits on when that shape contains it, else the page behind the SVG. Turning it on found 20 failures in two legacy cards (`map-hero` "YOU ARE HERE", `elevation-profile` today label): the card CSS `svg text { fill: var(--mut) }` overrode their pale fill. The shipped components set `fill` with no overriding rule, so the app was unaffected; the cards were fixed (`svg text:not([fill])`). Per the "retiring a safety net" rule, prior greens didn't cover SVG labels.
- **The sprite lacked rat, ox, tiger and pig**; copied verbatim from `animal-icon-paths.ts` so the dial rim shows all twelve.

## Changes

| Area | Change |
| --- | --- |
| `foundation/DESIGN.md` | v5: base + looks |
| `CLAUDE.md` | standing rule wording |
| `foundation/design-system/build.mjs` | look per group in `index.json` |
| `foundation/design-system/check.mjs` | per-look report; SVG labels measured by fill |
| `foundation/design-system/src/cards/look-{shared,explorer,editorial,instrument}.mjs` | new cards |
| `foundation/design-system/src/cards/app.mjs` | shared signpost board & nav card |
| `foundation/design-system/src/cards/trail.mjs` | legacy SVG label fill fix |
| `foundation/design-system/src/sprite.html` | + rat, ox, tiger, pig |
| `decisions.md` | new row |

## Alternatives considered

Three separate DESIGN files: duplicates the base and lets it drift. Keep one design + 'variants' appendix: undersells how different B and C are structurally.

## Risks

Scope creep in the base: anything a look wants to differ on must move out of the base, which reopens settled rules. Mitigation: base changes need owner sign-off in this ticket.

## Verification

Owner review of DESIGN.md v5; `check.mjs` green across looks.
