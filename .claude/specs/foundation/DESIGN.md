# Daymaster — DESIGN (v5: one base, three looks)

One page. The UI implements this exactly; deviations go through this file first.

Revised 2026-09-29 ([M19.9-02](../m19.9-looks/02-design-md-looks/requirements.md)). Users choose one of three **looks** — **Explorer**, **Editorial**, **Instrument** — during onboarding and can change it in Settings; each is a complete design of every screen in both themes. The looks come from the approved M19.9-01 mockups (`m19.9-looks/01-three-directions/research/directions.html`). v4 (Trail, [M18-05](../m18-design-reset/05-trail-and-design-md-v4/design.md)) supplies the whole **base**: tokens, terrains, type families, the anchor pair and the seal rule are unchanged. Trail's Today *composition* (map card, waypoint rail, elevation strip, trail signs) is kept under §Legacy until [M19.9-11](../m19.9-looks/11-retire-trail-and-ship/requirements.md) retires it.

How the parts relate:

- **§Base binds every look.** A look may only add or replace what its own section names. Anything a look wants to change in the base goes through this file with owner sign-off.
- **Each look is one design in both themes** (the v4 rule "both themes are one design", now per look): reviewed on device in both, contrast measured on rendered text in both, every theme rule with `[data-theme]` twins.
- **Every look renders the same facts and actions** from one presentation model; a look moves content, never drops it.
- Stored as `look` (`trail` | `almanac` | `dial`) in `daymaster.store.v2`, stamped on `<html>` as `data-look` before first paint ([M19.9-03](../m19.9-looks/03-look-architecture/design.md)). Default `trail`.

# Base

## Concept

The day, read once. Every look's first screen (390×844, nav visible) carries exactly: the **hero** (the look's signature object), the **headline**, **one idea** (≤ 40 words), and **one thing to do** (the signpost board). Everything else is one tap or swipe away — moved, not deleted. Each fact is said once per screen.

The anchor pair carries two jobs that don't compete: the **bottom nav is fixed chrome** — identical, anchor-filled furniture on every screen and in every look, outside the content budget — while within a screen's own content, **one anchor** (the signpost board on Today; elsewhere, that screen's primary button) is the single boldest object, never fading into the ground in dark mode. The seal is the only cinnabar mass, always, in every look.

The per-day **terrain** (ground keyed to the day element) is shared by all three looks (owner, 2026-09-29).

## Tokens

Two axes, deliberately independent (round 5b decision):

- **GROUND** — paper, ink, the anchor pair, and the hairline — is keyed to the day pillar's **element**, five terrains, light+dark each. Only the ground changes per day; a color never changes *meaning*.
- **DATA + SIGNAGE hues** — the five elements plus amber — are keyed to **theme only**, identical across all five terrains.

Generated from `design-system/src/tokens.mjs` (single source; do not hand-edit the emitted CSS). Every rule ships three times — once under `@media (prefers-color-scheme)` and once under each of `[data-theme="light"]`/`[data-theme="dark"]` — so the app's own Appearance toggle reaches everything the OS scheme does (round 5c finding).

### Ground (per terrain, per theme)

| Terrain (element) | | `bg` (paper) | `ink` | `blk`/`pale` (anchor) | `mut` (soft) | `card` | `line` (hairline) |
|---|---|---|---|---|---|---|---|
| Wood — forest | light | `#F0EEE2` | `#232819` | `#181C10` / `#F0EEE2` | `#686C55` | `#FAF9EF` | rgba(78,82,55,.32) |
| | dark | `#161911` | `#EAEADC` | `#EAEADC` / `#161911` | `#9A9D85` | `#20241A` | rgba(214,216,186,.26) |
| Fire — canyon | light | `#F6EBDC` | `#2C2118` | `#1D140C` / `#F6EBDC` | `#786655` | `#FDF6EA` | rgba(104,74,48,.30) |
| | dark | `#1B1410` | `#F0E5DA` | `#F0E5DA` / `#1B1410` | `#A89283` | `#271F18` | rgba(230,206,186,.22) |
| Earth — dune | light | `#F2ECD4` | `#2A2415` | `#1D180B` / `#F2ECD4` | `#72684D` | `#FBF7E6` | rgba(100,86,44,.30) |
| | dark | `#191610` | `#EDE6D3` | `#EDE6D3` / `#191610` | `#A59A76` | `#241F15` | rgba(224,212,176,.22) |
| Metal — granite | light | `#EEEFED` | `#24262B` | `#14161A` / `#EEEFED` | `#676B72` | `#F9FAFA` | rgba(74,78,88,.26) |
| | dark | `#15171A` | `#E7EAED` | `#E7EAED` / `#15171A` | `#949BA6` | `#1F2226` | rgba(204,210,220,.20) |
| Water — nautical | light | `#E5EDF3` | `#1F2830` | `#101820` / `#E5EDF3` | `#5D6B75` | `#F4F9FC` | rgba(54,76,92,.28) |
| | dark | `#121820` | `#E1EAF1` | `#E1EAF1` / `#121820` | `#8A9BA8` | `#1B232C` | rgba(190,212,228,.20) |

The **anchor pair** (`blk`/`pale`) is the app's one high-contrast mass — the signpost board, the bottom nav, and each look's "now" marker (Explorer's NOW dot, Instrument's hand, today in any week strip). It's defined by *distance from the ground*, not by the color black: in light it's a near-black card with pale text; in dark it **inverts** to a pale card with dark text, so it stays the boldest object on screen rather than sinking into a dark background (round 5c rule, binding — no exceptions).

### Data + signage hues (theme-keyed, fixed across all terrains)

| | Light | Light fill | Dark | Dark fill |
|---|---|---|---|---|
| Wood (`wd`) | `#46672F` | `#D5E1BE` | `#ADCB96` | `#2A3820` |
| Fire (`fr`) | `#9A4323` | `#F5D2BF` | `#EFA47C` | `#412718` |
| Earth (`er`) | `#785D1F` | `#EDDFAC` | `#DCC077` | `#3A3017` |
| Metal (`mt`) | `#626458` | `#E5E3D3` | `#B7B5A6` | `#2B2B22` |
| Water (`wt`) | `#3A607C` | `#CBDBE7` | `#A0BFD7` | `#1F2F3B` |
| Amber (`am`, signage) | `#835D13` | `#F1E2BB` | `#DDB35E` | `#392D13` |

`data-terrain` is computed client-side from the active profile's day-stem element once a profile and date exist (no pre-paint script needed here, unlike `data-theme`: unlike the theme preference, terrain has no meaning before onboarding completes, so there is nothing to flash). It defaults to `wood` — the token generator's fallback — until then.

Amber is **signage, not an element** — "a crossing worth slowing for" (the rough hour in every look, a watch-list heading). It's the only hue allowed to carry a warning tone. Cinnabar is absent from this list by design: it stays reserved for the seal, never a data hue.

Element icons/animal glyphs use these hues exactly as before (element-fill rule: fills, swatch dots, tinted chip backgrounds, ≥19px bold only — never normal-size text color).

### Shape and shadow

| Token | Value | Use |
|---|---|---|
| `--radius-hero` | 24px | Map hero, hero-scale cards |
| `--radius-card` | 20px | Standalone content cards (elevation strip, terrain swatches) |
| `--radius-tile` | 18px | Trail-sign tiles, hue chips |
| `--radius-sheet` | 28px | Bottom sheets (unchanged from M16) |
| `--radius-field` | 14px | Form inputs |
| `--radius-pill` | 999px | Buttons, chips, segmented controls, nav |
| `--rail-width` | 2px | The dashed rail/route line weight |
| `--node-size` | 36px | Waypoint-rail node circles |
| `--tap-min` | 44px | Minimum tap target (WCAG 2.5.8, unchanged) |

Shadows return (M16's "fill and gap, never shadow" rule is retired for standalone cards): `--sh-hero`, `--sh-card`, `--sh-node`, `--sh-nav` — soft, low-opacity, tuned per theme (dark elevates by fill *and* a deeper shadow, still no borders). Segment-stack **lists** (settings rows, saved people, activity picker) stay flat and borderless with 2px gaps, per M16 — round 5's list card found the rail motif doesn't belong there ("hanging settings rows off a dashed route implies a sequence a settings screen doesn't have"), so lists are the one place Trail is quieter than the hero screen, not louder.

Motion: see §Motion below (v5 replaces the M16 note).

## Motion

One motion language for all looks (M19.9-01 mockups):

| Moment | Spec |
| --- | --- |
| Arrival | Plays when Today opens on a new day or the date changes, not on every tab return. Elements rise 14px + fade, 420ms `cubic-bezier(.2,.8,.2,1)`, staggered 70ms in reading order; whole sequence ≤ 1.2s. |
| Hero draw | The look's signature object draws once per arrival: Explorer's route (stroke-dashoffset, 1.1s), Instrument's arcs (1.1s) and hand sweep, Editorial's animal drift (translate 40px + fade, 1.2s). |
| Marks | Pop in with the spring below, after the hero starts. |
| Press | Tappable surfaces scale to .975 (rows .985), 180ms `cubic-bezier(.34,1.56,.64,1)`. Selections and sheets keep the M16 spring (≤ 240ms). |
| Properties | transform, opacity and stroke-dashoffset only. |
| Reduced motion | `prefers-reduced-motion: reduce` shows the final state with no animation at all. Nothing waits at opacity 0. |

## Type
Three families, three jobs (no fourth register):

- **Bricolage Grotesque, 800** — display and section headers. The headline hook (35px/1.07/-.022em by default; each look sets its own size, see §Looks; `text-wrap: balance`) carries an inline serif-italic emphasis run (`ui-serif, "New York", Georgia, serif`, italic 500) for one phrase per headline — the direction's one flourish. Section headers (waypoint titles, sheet titles) are 19px/800/-.012em.
- **Space Mono, 700** — every label, kicker, and citation: date strip, kickers (uppercase, letter-spacing .17em, a 16×2px rule before the text), fact citations ("Dragon–dog clash · today"), map/elevation-profile annotations, form labels, button/chip/nav text. This is what makes the screen read as a map, not just a card stack — it is the single most load-bearing typographic decision in Trail and must not be swapped for a "friendlier" face.
- **Figtree, 400** — body prose only (reading sentences, sheet body, help text), 14–15px/1.62, always full `--ink` (never `--mut`).

Named exceptions, carried forward: 16px form-field text (iOS zoom), the seal's Han register unchanged (stamped paper, always on, independent of any toggle — there is no Han toggle; see CLAUDE.md 2026-07-17 "Chinese characters removed entirely").

## Icons
**No new icon art.** (v5: the design-system sprite gained the four animals it lacked — rat, ox, tiger, pig — copied verbatim from `animal-icon-paths.ts` so Instrument's rim can show all twelve.) The bespoke element set (`lib/glyph-icon-paths.ts` — 5 elements, solid=yang/outlined=yin, 1.7 stroke) and the 12 zodiac silhouettes (`lib/animal-icon-paths.ts` — traced-and-polished Gemini silhouettes) are kept exactly as they are; only their color binding moves from `--element-*` tokens to the new theme-keyed hues (`--wd`/`--fr`/`--er`/`--mt`/`--wt`). The simplified single-path icons inlined in `design-system/src/sprite.html` are prototype chrome only — that file exists so the preview cards are self-contained HTML with no sibling dependency; they are never a second icon source. `components/glyph-icon.tsx` is the only render path in the real app, unchanged in shape.

The legend line changes wording to match the map metaphor: **"element icon solid = yang · outlined = yin"** stays; a chart-screen legend addition is optional, not required (the animals are already always solid, per 2026-07-17).

## Shared surfaces

- **Segment stacks** (settings rows, saved people): unchanged from M16 — flat `--card` fill rows, 2px gaps, first/last corners rounded, 2px inset ink ring for selection. No rail, no shadow.
- **Content cards** elsewhere (Cycles outlooks, Compare "how your charts meet", Dates results): `--card` fill, `--radius-card`, `--sh-card`.
- **Sheets** (glossary, read-more): `--card` fill, `--radius-sheet` top corners, mandatory 40% black scrim (both themes), grab handle, Space Mono kicker, Bricolage title, Figtree body. The dashed rule before a sheet's "Working with it" advice section is the one place the rail motif transfers outside Today — it reads as a further stage of the same route.
- **Signpost board + nav** (the anchor pair, every look — design-system card `components/signpost-board-and-nav`): the agency line on a `blk` board with `pale` text, rounded left, a pointed signpost right edge (clip-path), a Space Mono kicker at 78% pale, and the line in Bricolage 20px/1.22 with the serif-italic emphasis run. The nav is a 60px `blk` pill, five Space Mono uppercase labels, the current tab marked by a 5px `pale` dot above it. On every screen other than Today, that screen's primary button is its content anchor, using the same pair.

## Components
- **Buttons**: primary = `blk` fill/`pale` text, pill; secondary = `card` fill/`ink` text, 1.5px ink-tint border; ghost = transparent, 1.5px dashed border (the dashed rail's one non-map appearance); disabled = a `card`/`bg` fill mix — deliberately **not** an ink tint, which pulls the label's contrast down with it — muted text, and a *solid*, `line`-tinted border (dashed is the ghost button's affordance — a disabled button borrowing it read as indistinguishable from ghost). Never fade the disabled label alone (measured 2.84:1 in testing) — recede the surface, not the text.
- **Form fields**: 52px min height, `card` fill, 1.5px ink-tint border (30% mix), `--radius-field`, 16px text, Space Mono uppercase label above. Focus = solid 2px ink ring (not dashed — dashed reads as "unfinished" here). Error border in `fr`. Disabled: dashed border + receded fill, "unpressable, not broken" copy pattern unchanged.
- **Dropdown select** (the date finder's activity chooser, 2026-09-10 — replaced the ten-row segment stack, which pushed the date window below the fold): closed, it is a `.field-input` showing the chosen option's label with its classical-category caption beneath (placeholder in `--ink-soft` before a pick) and a chevron that flips when open; open, a `paper-raised` listbox with the ink-tint field border and `--sh-card` drops beneath, rows two-line like the old stack, highlighted row on `--surface`, chosen row marked by the same ink dot. Combobox/listbox ARIA with arrow/Home/End/Enter/Escape and outside-tap close; `spring-in` on open, reduced-motion gated.
- **Segmented control**: pill track at 12% `mut` tint — deliberately **not** `ink`, which measured a failing 3.06:1 on the unselected label once the track darkened enough to read as a track; `mut` keeps the track lighter and the label inkier at the same tint strength. Space Mono uppercase labels, selected segment lifts to `card` fill + `--sh-card`.
- **Bottom sheet**: as above under §Surfaces.

## Layout

Mobile-first, single column, max-width 28rem centered; 5-tab bottom nav (Chart · Today · Cycles · Compare · Settings), safe-area padded, `blk`/`pale` anchor fill. `/dates/` reached from Today and Compare, unchanged.

Each look's Today composition is in §Looks. **Onboarding, forms, Chart, Cycles, Compare, Find a day, Settings** keep their current structure in every look until that screen's M19.9 ticket (06–10) writes its per-look section here; the look choice itself is an onboarding step and a Settings control ([M19.9-04](../m19.9-looks/04-choose-your-look/requirements.md)).

## Floor
360px minimum width; visible `:focus-visible` rings (solid ink 2px offset 1-2px); WCAG AA — verified by `design-system/check.mjs` against **rendered** text/background pairs (not token math): 3980 text runs across 24 cards × 2 themes × 5 terrains, reported per look (shared 2770 · legacy 620 · Explorer 180 · Editorial 180 · Instrument 230), 0 failures at the correct threshold (4.5:1 body / 3:1 large-text). Since v5 SVG labels are measured by their `fill` against the shape they sit on (a pill or node that contains them) — before that the check read CSS `color` for SVG text and never saw a label's real paint; turning it on found 20 failures in two legacy cards (a card-only CSS rule overriding the pale fill; the shipped components were unaffected), fixed in M19.9-02, plus a computed theme-parity check (`[data-theme]` forced must equal the matching OS `prefers-color-scheme` render) — 0 breaks. Re-run both checks after any token or card change; they are the gate, not a screenshot eyeballed once. Note the check's own viewport is fixed at 430px — it does not exercise the 360px floor, so a 360px pass is a manual/Wave-4 verification item, not something `check.mjs` currently proves. ≥44px tap targets with a visible pressed state, both themes — unchanged non-negotiable from M15.

## Copy
Sentence case everywhere, VOICE.md rules unchanged. Button/section labels say what they do. "Clear trail" / "Take it slow" replace "Favors"/"Watch" (see §Surfaces); no other user-facing terminology changes in this rollout — the reading sentences themselves are untouched, only their frame.

Look names shown to users: **Explorer**, **Editorial**, **Instrument** (owner, 2026-09-29). Stored ids are `trail`, `almanac`, `dial` and never shown.

# Looks

## Explorer (`trail`) — Trail, distilled

**Signature object: the route hero** (card `explorer/route-hero`). The map *is* the first screen, full-bleed, not a card: Space Mono date left and "yang fire · horse day" right, then the headline at 38px, over faint contour lines (`--line` at 55% opacity, fixed artwork, terrain-recoloured only). Across the lower part runs the day's **route**: 6am at the left (MORNING) climbing to 10pm at the right (EVENING, a small ink flag), dashed ink at 2.2px, with the part of the day already walked drawn **solid at 4px** up to the **NOW** marker (a 42px `blk` disc with the day's animal in `pale`, and a "NOW 10:40" pill *below* it). Only the two **timed marks** ride the route, at their clock position: the easy hour (`wd-f` disc, `wd` ring) and the rough hour (`am-f` disc, `am` ring, a small crossing X), each with its hour animal and a label set **up and to the left** of the mark, the one side the climbing route never occupies.

Changes from v4's map card: day-long relation facts (the "ALL DAY" row, 2026-09-10) leave the map; they are told once, in the reading below. No "What the marks mean" link: every mark labels itself.

Below the hero: the one idea, the signpost board, then **Further along** (card `explorer/further-along`) — the rest of the reading as horizontally snapping 272px cards (`--card`, `--radius-card`, `--sh-card`), each one idea: kicker with its animal, a Bricolage 19px title, two sentences, a citation. The seven-day elevation strip (v4) sits below the fold.

Forbids: more than two marks on the route; anything other than the NOW pill in the anchor pair on the map.

## Editorial (`almanac`) — Almanac page

**Signature object: the poster field** (card `editorial/poster-field`). Each day is a printed page: a 380px field in the **day element's fill hue** (`wd-f`/`fr-f`/`er-f`/`mt-f`/`wt-f`; never a strong hue, never cinnabar), radius 34px, carrying film grain as texture only (no text depends on it: multiply at 22% in light, overlay at 35% in dark). The day-of-year number in Bricolage 64px top-left, the long date in Space Mono top-right, the day's animal in ink at 360px, mirrored to run into the page and cropped off the right edge, and two Space Mono lines at the foot ("Day 272 of the year", "yang fire · horse day").

Below it (card `editorial/page-and-chapters`): the headline at **42px/1.02**, one sentence, the signpost board, a dashed rule labelled "The rest of the day" (the look's one divider), then the rest of the day as **chapters** — a flat segment stack (§Shared surfaces), each row a Space Mono area label over a Bricolage 17px summary with a chevron. A citation line gives the current double-hour.

Forbids: the map, the rail and content cards on Today; any second decorative object competing with the animal.

## Instrument (`dial`) — Day dial

**Signature object: the day dial** (card `instrument/day-dial`). A 24-hour ring, **noon at the top, 6am left, 6pm right, midnight at the bottom** (the same left-to-right day as Explorer's route). A 16px track at `--line` 50%, with the daylight half (6am–6pm) at full `--line`; 24 ticks inside, the four cardinals labelled NOON / 6 PM / MIDNIGHT / 6 AM in Space Mono. The easy hour is a `wd` arc and the rough hour an `am` arc, both round-capped on the track. The twelve two-hour **animals** sit round the rim at their block centres (rat at midnight), at 42% opacity, except three lit ones in a 30px halo: the rough hour (`am-f`/`am`), the easy hour (`wd-f`/`wd`) and the hour you are in (`card`/`ink`). The **hand** is the anchor pair (`blk` line and dot) pointing at now. At the centre, a `card` disc with the day's animal at 50px and the time.

Around it (card `instrument/week-rings-and-hours`): the week as seven 38px **tone rings** above the dial (solid `wd` = leans your way, dashed `am` = take it slow, plain `line` = even; today is a filled anchor-pair disc), and under the reading an **hour legend**, a two-row segment stack (colour swatch, Space Mono hour label, Bricolage 17px plain-words meaning).

Open (for M19.9-05): at 390×844 the signpost board falls just below the fold in the 01 mockup; the dial shrinks (≤ 300px) or the week rings move to meet §Concept's first-screen budget.

Forbids: minute-level precision (the dial reads in two-hour blocks, like the almanac); more than three lit animals.

# Legacy — the v4 Trail composition (retiring)

Kept verbatim because it describes shipped code; removed with that code in M19.9-11. Superseded for new work by §Looks. Design-system cards in the `Trail` group are measured by `check.mjs` as look `legacy`.

## Concept (v4)

The day is a route: today's terrain, today's crossings, the week ahead as an elevation profile. A dashed line is the trail motif throughout — the rail the reading hangs off, the route drawn on the map, the divider before a sheet's advice section. The anchor pair carries two distinct jobs, not one, and they don't compete: the **bottom nav is fixed chrome** — identical, anchor-filled furniture on every screen, present because it's the frame, not because a screen chose it — while within a screen's own content, **one black anchor** (the signpost board on Today; elsewhere, that screen's primary button) stays the single boldest object *in the content*, never fading into the ground in dark mode. "One per screen" is a content-budget rule; the nav sits outside that budget by design, the way a browser's own chrome doesn't count against a page's colour palette. Everything else is quiet: card fill and a soft shadow do the separating, mono labels do the wayfinding, and the reading prose still carries the actual sentences — Trail is a frame for the same voice, not a personality replacing it.

## Surfaces (v4)

- **Map hero** (the day's one generated-per-day object, `--radius-hero`, `--sh-hero`): a fixed decorative contour-line background (terrain-recolored only — the squiggled paths themselves never change) with the compass/orbit mark top-left (existing personal-logo mark, reused as the map's compass rose). Over it, a **route**: a dashed ink line from a fixed "YOU ARE HERE" start point through up to two **waypoint markers** to a fixed evening arrow. Per-day data drives only:
  - **Day-long waypoints** (up to two relation facts — reuse the same citation selection already feeding the waypoint-rail reading, capped to 2 for the map's visual budget): today's sign meeting one in the chart holds from midnight to midnight, so these sit in an **"ALL DAY" row** above the route, right of the compass (mark + animal icon + "CLASH · ALL DAY"), never at a point on the route — a mark's position must never imply a time the fact doesn't have (2026-09-10; earlier builds parked them at two fixed route vertices, which read as "the signs clash at the same time every day"). Each row is prefixed with the number of the waypoint-rail section that tells its story ("01 · CLASH · ALL DAY"), and that section's caption says "all day on the map" back; the hours line is its own last rail section ("The hours", captioned "timed marks on the map"). **Zero citations**: the row is empty.
  - **Timed waypoints** (always two): the day's rough hour and easy hour — the two-hour block whose sign clashes with today's, and the one that combines with it (engine `hour-interaction` facts, the almanac's 時辰吉凶 read). These ride **on the route at their clock position** (block centre on the same 6am–10pm scale as the live marker; small hours clamp toward MORNING, late night toward EVENING; two blocks on one stretch are nudged apart), animal icon and "ROUGH · 5–7 AM" / "EASY · 7–9 AM" label stacked *straight below* the mark — the route always climbs away to the upper right and CLEAR/the evening flag live above it, so below is the one direction that stays clear (beside-the-mark was tried and landed on the line). The live "YOU ARE HERE" pill lifts above its dot while the dot is passing a timed mark's stack. They belong to the day, not the chart, and move with the day's sign.
  - Whether a waypoint gets a **crossing mark** (small circle + X, amber-or-element-hued per the relation's hue) — clash/harm/punishment facts get a crossing; combine/trine facts get a plain node, no crossing. Same grammar in both rows.
  - The route's highlight segment color — reuses the existing `dayTone` (favoured/friction/even): wood-hued highlight + "CLEAR" label when favoured, amber when friction, plain ink with no label when even.
  - The day's own animal glyph at the "YOU ARE HERE" point; the cited relation's animal at its waypoint.
  MORNING/EVENING labels and the arrow are fixed bookends, always present, not data-driven. This keeps the hard new work scoped to *placement and coloring of existing data* on fixed artwork — the same determinism model `DayOrbit` used (fixed ring geometry, data only changes glyphs/labels/colors) — rather than procedural terrain generation.
- **Elevation profile** (`--radius-card`, `--sh-card`): the 7-day strip, replacing the old week-strip bars. A dashed line plots each day's summed `dayTone` as elevation (favoured = higher, friction = lower), today's point filled solid in the anchor pair, each day's own animal glyph riding its point, the animal opacity/emphasis fading with distance from today (today's glyph at full opacity, matching `DayOrbit`'s existing "quiet dip" framing).
- **Waypoint rail** (reading content only): the dashed rail with numbered waypoint nodes, one per life-area section (Roots/Career/Home/Horizon/The day itself — same `ReadingLine.area` grouping as M17), prose first, citation below in Space Mono caption style (the M17 rule holds). This is the **only** place the rail motif is used for structure — round 5's own audit found it doesn't belong on settings/list screens, so those stay plain segment stacks (below).
- **Trail signs** (Favors/Watch): one `--card` with three stacked parts — the 10-activity skyline plot on top, then two **sign rows** ("Clear trail" in wood hue with an ink dot, "Take it slow" in amber with an amber dot — the same dots the skyline uses), each naming its strongest leanings in words with the fact-cited suggestions hanging beneath, then the "Show all 10 in detail" manifest disclosure. The activities the rows name are set in full ink on the skyline's 45° labels; the rest stay `--ink-soft`. Copy: **"Clear trail" / "Take it slow"** replace "Favors"/"Watch" as the row labels (still rule-12 compliant: postponement, never prohibition — "Take it slow" is softer than the old "Watch", not stricter). SUPERSEDES (2026-09-10) the two side-by-side tiles under a separate terrain card — that drew the same ten activities twice on one screen; the rows are the chips, the dots are the rows.
- **Signpost + nav** (the anchor pair): the agency line becomes a directional trail-sign board (`blk` fill, `pale` text, a small triangular "signpost" notch, Space Mono kicker + Bricolage/serif-italic body) with the streak line beneath it in Space Mono caption style, and the bottom nav is a pill in the same anchor fill. The nav is the chrome anchor (§Concept) — present everywhere, outside the per-screen budget. Today's content anchor is the signpost; Today has no separate primary button, so there's no contention between the two. On every other screen (onboarding, settings edit, compare add-person, dates finder), that screen's primary button is its content anchor, using the same `blk`/`pale` pair.

## Today layout (v4)

**Today** (top to bottom): datebar (Space Mono date + compass/orbit mark) → 7-day elevation profile → kicker + headline hook (Bricolage, serif-italic emphasis run) + one line of grain prose → legend tags (element·polarity, zodiac·day-type, a dashed "notice" tag for the day officer) → map hero → waypoint-rail reading (life-area sections, prose-then-citation) → **"Go deeper · what the day suits"** fold (collapsed by default; a daily check-in ends at the signpost) holding **trail signs** (the merged card: 10-activity skyline → Clear trail / Take it slow rows with suggestions → full-manifest disclosure — see §Surfaces) and the "Find a day" link → signpost (agency line) → streak line → **day journal** ("How is it landing?" / "How did it land?": Rang true / Didn't fit as pill toggles, the chosen one in the anchor pair, plus an optional 140-char note field; today and past days only — a day that hasn't happened can't have landed; it is the reader's verdict on the reading, never the reverse) → bottom nav. The old "At a glance" axis-dot rows and the Favors/Watch two-column board with a hairline divider (M17) are retired in favor of trail signs + the map/legend doing the *curated top-3* summary visually; today's terrain (added post-M18.5) is the full 10-activity detail underneath that summary, expressed in the elevation-profile's own dashed-line/tone-height grammar rather than reviving the retired axis-dot/Material board. On the skyline every dot drops a hairline stake to a baseline under the plot, and the ten names hang 45° below that base in 8px Space Mono (owner's pick, from three mocked treatments) — below the base is the one place the route can never be, and the diagonal hang keeps six-letter names clear of each other at a phone's ~29px slot. Rejected: names angled up off each dot (crossed the climbing route), a horizontal staggered lane (detached under a dead gap), and naming only the activities that lean (owner preferred all ten visible).

**Onboarding, Forms, Pillar grid, Cycles, Compare, Find a day, Settings**: unchanged in *structure* from the M15/M16 layout section — same screen composition, same field/segmented-control/segment-list/button components, now rendered in Trail's type and color system instead of Material's. No rail motif on any of these; segment stacks stay flat per §Surfaces.
