# Design — Today in three looks

## Approach

One screen model, one state hook, three compositions. Nothing about *what* Today says changes; each look only arranges it.

- **State** moves out of `today-view.tsx` into `components/today/use-today-screen.ts`: date offset, picker, streak, the About sheet, the terrain stamp, and `todayScreenModel`. `TodayView` becomes the hook plus a `LookSwitch`.
- **Look plumbing** (moved here from 03): `lib/use-look.ts` reads `data-look` with `useSyncExternalStore` and a `MutationObserver` (server snapshot `DEFAULT_LOOK`, so no hydration mismatch); `components/look-switch.tsx` renders the matching child.
- **Shared Today parts** (`components/today/`): `date-stepper.tsx` (‹ date ›, picker, back to today, 30-day note; reuses Datebar's behaviour), `pull-quote-board.tsx` (the new agency board), `reading-chapters.tsx` (accordion segment stack incl. "What the day suits" wrapping the existing `TrailSigns`), `today-footer.tsx` (journal, streak, tomorrow line).
- **Pure logic in `packages/presentation`**, tests first: `readingSections(lines, grainLine)` — reading lines grouped by area in rail order, **dropping the line already used as the one idea** (said once); `dayOfYear(iso)` for Editorial's number.
- **Per look** (`components/looks/<id>/`): Explorer `today-explorer.tsx`, `route-hero.tsx`, `idea-cards.tsx`; Editorial `today-editorial.tsx`, `poster-field.tsx`, `week-calendar.tsx`; Instrument `today-instrument.tsx`, `day-dial.tsx`, `week-rings.tsx`. Hour marks come from the timed `RouteWaypoint`s (`startHour`/`endHour`/`label`), week tones from `elevationWeek`, now from `useDayProgress`.
- **Motion**: the DESIGN.md §Motion classes in `globals.css`, gated on `prefers-reduced-motion: no-preference`; the arrival keys on `dateISO`, so it replays on a new day or date change, not on tab return.
- **First-screen fit** (DESIGN.md §Concept, board on the first screen): the board **begins** above the nav at 390×844 in every look (Editorial field 330px, Instrument dial ≤ 280px), measured in `today-looks.spec.ts`. The whole board fitting would need the headline or hero shrunk further; the owner approved the mockup where it starts on the first screen.
- The legacy components (`map-hero`, `waypoint-rail`, `signpost`, `legend-tags`, `elevation-profile`) **stay**: Conditions still uses them until M19.9-10 decides its fate; ElevationProfile is reused by Explorer.

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
| Signpost board | **pull quote, on the first screen** (owner, 2026-09-29) | same | same |
| Journal, streak, tomorrow line | after the board | same | same |

Titles use data the model already has (area names, citations); no new copy.

## Changes

| Area | Change |
| --- | --- |
| `packages/presentation/src/reading-sections.ts`, `day-of-year.ts` (+ tests) | new pure helpers |
| `apps/web/src/lib/use-look.ts`, `components/look-switch.tsx` | new (from 03) |
| `apps/web/src/components/today/` | `use-today-screen.ts`, `date-stepper.tsx`, `pull-quote-board.tsx`, `reading-chapters.tsx`, `today-footer.tsx` |
| `apps/web/src/components/looks/{trail,almanac,dial}/` | the three compositions and their heroes |
| `apps/web/src/components/today-view.tsx` | hook + `LookSwitch` only |
| `apps/web/src/app/globals.css` | motion classes, board, look-specific rules |
| `apps/web/e2e/` | Today specs run once per look; first-screen fit spec; switch-without-reload spec |
| `foundation/DESIGN.md` | board = pull quote; field/dial sizes as built |
| `foundation/VOICE.md`, `CLAUDE.md` | "agency line ends every daily reading" → "closes the first screen" |

### As built (differences from the plan above)

- **`useNow`** replaces the per-hook timers: Explorer's NOW label, the dial's hand and `useDayProgress` all read one refreshed clock (three consumers, so extracted rather than copied).
- **`DateStepper`** extracted from `Datebar` (which now composes it with the compass mark), so Today's looks and Conditions share one date control.
- **`WeekLegendLink`** extracted from `ElevationProfile`: every look's week keeps the "What the marks mean" explainer and the same accessible day names (`formatLong` + tone word) — found by E2E, since Editorial and Instrument had first shipped without it (a look may not drop content).
- **`AppShell bleed`**: the "Today" heading stays for screen readers and E2E but is visually hidden, and the hero runs edge to edge.
- **"What the day suits" chapter renders lazily**; reading chapters stay in the DOM while collapsed (the whole reading stays one `data-reading-body`).
- **Explorer**: when NOW is inside a timed hour, NOW takes that hour's ring and the mark's disc steps aside; an early hour's label flips down-right instead of running off the left edge.
- **E2E**: `E2E_LOOK` seeds every store in a look and `pnpm e2e:looks` runs the suite three times; `openReading` opens collapsed chapters; the Explorer-only route spec now also asserts no day-long marks on the route.

## Alternatives considered

Pure CSS restyle of one DOM: can't reach Editorial's poster or Instrument's dial, which are different structures. Three route copies (`/today/` per look): triples state logic and invites drift. Per-look boards: owner picked the pull quote everywhere.

## Risks

Three designs of a screen drift apart in behaviour, not just looks. Mitigation: one presentation model per screen (`packages/presentation`), looks differ only in components/CSS; E2E asserts the same facts render in every look.

## Verification

`pnpm verify`; E2E matrix green; `check.mjs` green; live-app check of every look × theme on device.
