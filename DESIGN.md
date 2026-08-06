# Daymaster — DESIGN (Trail: the day as a route)

One page. The UI implements this exactly; deviations go through this file first.

Revised 2026-08-05 (M18 design reset, supersedes M16/M17's Material surface language in full). Five rounds of on-device Today mockups plus an isolated effects pass (docs/mockups-m18/) — the owner picked **Trail**: the day as a route on a topographic map, over Daybreak (editorial-air), Sky (soft dashboard), Compass/Compass II (diagram-led, warm cream), and Forecast (weather report). Rejected directions and the reasoning are logged in CLAUDE.md. The ink/cinnabar identity's one truly fixed point — **the seal is the only cinnabar mass, always** — is unchanged; everything else in M16/M17 (tonal borderless surfaces, Figtree-only type, gap-not-shadow separation, sentence-case kickers) is retired in favor of Trail's own system below, built out and contrast-verified as a full component set in docs/design-system/ (17 cards, 3310 rendered text runs, 0 contrast failures, theme parity holds — `node docs/design-system/check.mjs`).

## Concept

The day is a route: today's terrain, today's crossings, the week ahead as an elevation profile. A dashed line is the trail motif throughout — the rail the reading hangs off, the route drawn on the map, the divider before a sheet's advice section. The anchor pair carries two distinct jobs, not one, and they don't compete: the **bottom nav is fixed chrome** — identical, anchor-filled furniture on every screen, present because it's the frame, not because a screen chose it — while within a screen's own content, **one black anchor** (the signpost board on Today; elsewhere, that screen's primary button) stays the single boldest object *in the content*, never fading into the ground in dark mode. "One per screen" is a content-budget rule; the nav sits outside that budget by design, the way a browser's own chrome doesn't count against a page's colour palette. Everything else is quiet: card fill and a soft shadow do the separating, mono labels do the wayfinding, and the reading prose still carries the actual sentences — Trail is a frame for the same voice, not a personality replacing it.

## Tokens

Two axes, deliberately independent (round 5b decision):

- **GROUND** — paper, ink, the anchor pair, and the hairline — is keyed to the day pillar's **element**, five terrains, light+dark each. Only the ground changes per day; a color never changes *meaning*.
- **DATA + SIGNAGE hues** — the five elements plus amber — are keyed to **theme only**, identical across all five terrains.

Generated from `docs/design-system/src/tokens.mjs` (single source; do not hand-edit the emitted CSS). Every rule ships three times — once under `@media (prefers-color-scheme)` and once under each of `[data-theme="light"]`/`[data-theme="dark"]` — so the app's own Appearance toggle reaches everything the OS scheme does (round 5c finding).

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

The **anchor pair** (`blk`/`pale`) is the app's one high-contrast mass — the signpost board, the bottom nav, "YOU ARE HERE"/day markers on the map and elevation profile. It's defined by *distance from the ground*, not by the color black: in light it's a near-black card with pale text; in dark it **inverts** to a pale card with dark text, so it stays the boldest object on screen rather than sinking into a dark background (round 5c rule, binding — no exceptions).

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

Amber is **signage, not an element** — "a crossing worth slowing for" (the map's clash marker, a watch-list heading). It's the only hue allowed to carry a warning tone. Cinnabar is absent from this list by design: it stays reserved for the seal, never a data hue.

Element icons/animal glyphs use these hues exactly as before (element-fill rule: fills, swatch dots, tinted chip backgrounds, ≥19px bold only — never normal-size text color).

### Shape, shadow, motion

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

Motion: unchanged from M16 — springy overshoot on selections/sheets (`cubic-bezier(0.34, 1.56, 0.64, 1)`, ≤240ms, transform/opacity only), gated behind `prefers-reduced-motion: no-preference`. The compass/orbit mark and map elements get no additional motion pass in this rollout; the effects-exploration research (glass/neumorphic/gradient, docs/research-2026-07-30-*.md) was run against a *different*, unchosen direction (Daybreak) and does not carry over — if a similar minor-detail pass is wanted on Trail, that's a future decision, not part of this one.

## Type

Three families, three jobs (no fourth register):

- **Bricolage Grotesque, 800** — display and section headers. The headline hook (35px/1.07/-.022em, `text-wrap: balance`) carries an inline serif-italic emphasis run (`ui-serif, "New York", Georgia, serif`, italic 500) for one phrase per headline — the direction's one flourish. Section headers (waypoint titles, sheet titles) are 19px/800/-.012em.
- **Space Mono, 700** — every label, kicker, and citation: date strip, kickers (uppercase, letter-spacing .17em, a 16×2px rule before the text), fact citations ("Dragon–dog clash · today"), map/elevation-profile annotations, form labels, button/chip/nav text. This is what makes the screen read as a map, not just a card stack — it is the single most load-bearing typographic decision in Trail and must not be swapped for a "friendlier" face.
- **Figtree, 400** — body prose only (reading sentences, sheet body, help text), 14–15px/1.62, always full `--ink` (never `--mut`).

Named exceptions, carried forward: 16px form-field text (iOS zoom), the seal's Han register unchanged (stamped paper, always on, independent of any toggle — there is no Han toggle; see CLAUDE.md 2026-07-17 "Chinese characters removed entirely").

## Icons

**No new icon art in this rollout.** The bespoke element set (`lib/glyph-icon-paths.ts` — 5 elements, solid=yang/outlined=yin, 1.7 stroke) and the 12 zodiac silhouettes (`lib/animal-icon-paths.ts` — traced-and-polished Gemini silhouettes) are kept exactly as they are; only their color binding moves from `--element-*` tokens to the new theme-keyed hues (`--wd`/`--fr`/`--er`/`--mt`/`--wt`). The simplified single-path icons inlined in `docs/design-system/src/sprite.html` are prototype chrome only — that file exists so the preview cards are self-contained HTML with no sibling dependency; they are never a second icon source. `components/glyph-icon.tsx` is the only render path in the real app, unchanged in shape.

The legend line changes wording to match the map metaphor: **"element icon solid = yang · outlined = yin"** stays; a chart-screen legend addition is optional, not required (the animals are already always solid, per 2026-07-17).

## Surfaces

- **Map hero** (the day's one generated-per-day object, `--radius-hero`, `--sh-hero`): a fixed decorative contour-line background (terrain-recolored only — the squiggled paths themselves never change) with the compass/orbit mark top-left (existing personal-logo mark, reused as the map's compass rose). Over it, a **route**: a dashed ink line from a fixed "YOU ARE HERE" start point through up to two **waypoint markers** to a fixed evening arrow. Per-day data drives only:
  - Which up to two relation facts appear as waypoints — reuse the same citation selection already feeding the waypoint-rail reading (capped to 2 for the map's visual budget), each rendered as its branch's animal icon at a fixed canonical position on the route: the first-selected citation sits at the early position, the second (if any) at the late position. **Zero citations**: the route runs plain from "YOU ARE HERE" to the evening arrow, no waypoint markers. **One citation**: only the early position is used; the route continues past the unused late position undecorated, same as the zero-waypoint case from that point on.
  - Whether a waypoint gets a **crossing mark** (small circle + X, amber-or-element-hued per the relation's hue) — clash/harm/punishment facts get a crossing; combine/trine facts get a plain node, no crossing.
  - The route's highlight segment color — reuses the existing `dayTone` (favoured/friction/even): wood-hued highlight + "CLEAR" label when favoured, amber when friction, plain ink with no label when even.
  - The day's own animal glyph at the "YOU ARE HERE" point; the cited relation's animal at its waypoint.
  MORNING/EVENING labels and the arrow are fixed bookends, always present, not data-driven. This keeps the hard new work scoped to *placement and coloring of existing data* on fixed artwork — the same determinism model `DayOrbit` used (fixed ring geometry, data only changes glyphs/labels/colors) — rather than procedural terrain generation.
- **Elevation profile** (`--radius-card`, `--sh-card`): the 7-day strip, replacing the old week-strip bars. A dashed line plots each day's summed `dayTone` as elevation (favoured = higher, friction = lower), today's point filled solid in the anchor pair, each day's own animal glyph riding its point, the animal opacity/emphasis fading with distance from today (today's glyph at full opacity, matching `DayOrbit`'s existing "quiet dip" framing).
- **Waypoint rail** (reading content only): the dashed rail with numbered waypoint nodes, one per life-area section (Roots/Career/Home/Horizon/The day itself — same `ReadingLine.area` grouping as M17), prose first, citation below in Space Mono caption style (the M17 rule holds). This is the **only** place the rail motif is used for structure — round 5's own audit found it doesn't belong on settings/list screens, so those stay plain segment stacks (below).
- **Trail signs** (Favors/Watch, `--radius-tile`): two tiles side by side, inset ring in wood hue ("Clear trail") and amber ("Take it slow") respectively — word lists, not chips, continuing the M17 "stark lists" direction. Copy: **"Clear trail" / "Take it slow"** replace "Favors"/"Watch" as the section labels (still rule-12 compliant: postponement, never prohibition — "Take it slow" is softer than the old "Watch", not stricter).
- **Segment stacks** (settings rows, saved people, activity picker): unchanged from M16 — flat `--card` fill rows, 2px gaps, first/last corners rounded, 2px inset ink ring for selection. No rail, no shadow.
- **Content cards** elsewhere (Cycles outlooks, Compare "how your charts meet", Dates results): `--card` fill, `--radius-card`, `--sh-card`.
- **Sheets** (glossary, read-more): `--card` fill, `--radius-sheet` top corners, mandatory 40% black scrim (both themes), grab handle, Space Mono kicker, Bricolage title, Figtree body. The dashed rule before a sheet's "Working with it" advice section is the one place the rail motif transfers outside Today — it reads as a further stage of the same route.
- **Signpost + nav** (the anchor pair): the agency line becomes a directional trail-sign board (`blk` fill, `pale` text, a small triangular "signpost" notch, Space Mono kicker + Bricolage/serif-italic body) with the streak line beneath it in Space Mono caption style, and the bottom nav is a pill in the same anchor fill. The nav is the chrome anchor (§Concept) — present everywhere, outside the per-screen budget. Today's content anchor is the signpost; Today has no separate primary button, so there's no contention between the two. On every other screen (onboarding, settings edit, compare add-person, dates finder), that screen's primary button is its content anchor, using the same `blk`/`pale` pair.

## Components

- **Buttons**: primary = `blk` fill/`pale` text, pill; secondary = `card` fill/`ink` text, 1.5px ink-tint border; ghost = transparent, 1.5px dashed border (the dashed rail's one non-map appearance); disabled = a `card`/`bg` fill mix — deliberately **not** an ink tint, which pulls the label's contrast down with it — muted text, and a *solid*, `line`-tinted border (dashed is the ghost button's affordance — a disabled button borrowing it read as indistinguishable from ghost). Never fade the disabled label alone (measured 2.84:1 in testing) — recede the surface, not the text.
- **Form fields**: 52px min height, `card` fill, 1.5px ink-tint border (30% mix), `--radius-field`, 16px text, Space Mono uppercase label above. Focus = solid 2px ink ring (not dashed — dashed reads as "unfinished" here). Error border in `fr`. Disabled: dashed border + receded fill, "unpressable, not broken" copy pattern unchanged.
- **Segmented control**: pill track at 12% `mut` tint — deliberately **not** `ink`, which measured a failing 3.06:1 on the unselected label once the track darkened enough to read as a track; `mut` keeps the track lighter and the label inkier at the same tint strength. Space Mono uppercase labels, selected segment lifts to `card` fill + `--sh-card`.
- **Bottom sheet**: as above under §Surfaces.

## Layout

Mobile-first, single column, max-width 28rem centered; 5-tab bottom nav (Chart · Today · Cycles · Compare · Settings), safe-area padded, `blk`/`pale` anchor fill. `/dates/` reached from Today and Compare, unchanged.

**Today** (top to bottom): datebar (Space Mono date + compass/orbit mark) → 7-day elevation profile → kicker + headline hook (Bricolage, serif-italic emphasis run) + one line of grain prose → legend tags (element·polarity, zodiac·day-type, a dashed "notice" tag for the day officer) → map hero → waypoint-rail reading (life-area sections, prose-then-citation) → trail signs (Clear trail / Take it slow) → signpost (agency line) → streak line → bottom nav. The old "At a glance" axis-dot rows and the Favors/Watch two-column board with a hairline divider (M17) are retired in favor of trail signs + the map/legend doing that job visually.

**Onboarding, Forms, Pillar grid, Cycles, Compare, Find a day, Settings**: unchanged in *structure* from the M15/M16 layout section — same screen composition, same field/segmented-control/segment-list/button components, now rendered in Trail's type and color system instead of Material's. No rail motif on any of these; segment stacks stay flat per §Surfaces.

## Floor

360px minimum width; visible `:focus-visible` rings (solid ink 2px offset 1-2px); WCAG AA — verified by `docs/design-system/check.mjs` against **rendered** text/background pairs (not token math): 3310 text runs measured across 17 component cards × 2 themes × 5 terrains, 0 failures at the correct threshold (4.5:1 body / 3:1 large-text), plus a computed theme-parity check (`[data-theme]` forced must equal the matching OS `prefers-color-scheme` render) — 0 breaks. Re-run both checks after any token or card change; they are the gate, not a screenshot eyeballed once. Note the check's own viewport is fixed at 430px — it does not exercise the 360px floor, so a 360px pass is a manual/Wave-4 verification item, not something `check.mjs` currently proves. ≥44px tap targets with a visible pressed state, both themes — unchanged non-negotiable from M15.

## Copy

Sentence case everywhere, VOICE.md rules unchanged. Button/section labels say what they do. "Clear trail" / "Take it slow" replace "Favors"/"Watch" (see §Surfaces); no other user-facing terminology changes in this rollout — the reading sentences themselves are untouched, only their frame.
