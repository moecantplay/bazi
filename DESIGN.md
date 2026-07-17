# Daymaster — DESIGN (ink & cinnabar, Material surfaces)

One page. The UI implements this exactly; deviations go through this file first.
Revised 2026-07-16 (M16, supersedes the same-day M15 surface language): the owner chose a Google/Material-Expressive look and feel — tonal borderless containers, gap separation instead of rules, big varied radii, pill controls, one friendly sans with a bold scale. The ink-and-cinnabar identity (palette, seal, element hues, voice) is unchanged; M15's hairline-ruled editorial prose, Fraunces display, and kicker column-rule are retired.

## Tokens

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F5F6F4` | App background. Cool near-white, never cream. |
| `--ink` | `#181C22` | Text, pillar characters. Blue-black, never brown. |
| `--ink-soft` | `#565D68` | Secondary text, captions, pinyin. AA on paper AND surface. |
| `--cinnabar` | `#BF3A2B` | RESERVED for the seal. Nothing else — no buttons, no accents. |
| `--surface` | `#EAEDE9` | Tonal containers (cards, list stacks, board, sheets). Borderless — the fill IS the edge. Verified: ink 14.49:1, ink-soft 5.63:1, element hues 3.17–5.75 (≥3:1 fills/large-text). |
| `--paper-raised` | `#FFFFFF` | Inputs only — a control fill whose edge is its 1.5px `--ink-soft` border, never fill contrast. |
| `--hairline` | `#D8DBD6` | Rare in-container dividers only. Never a border; between containers, use gaps. |
| scrim | black 40% (both themes) | Mandatory under sheets — a borderless sheet over tonal cards has no edge without it. |

Primary actions are filled `--ink` with `--paper` text (15.77:1), pill-shaped. The day column's "it's you" marker is an ink underline (the app's sole underline; not a link).

Element accents — used ONLY when that element is referenced (balance bars, chip tints, gauge fills, swatch dots, the Today hero fill):

| Element | Hex | | Element | Hex |
|---|---|---|---|---|
| Wood | `#3A7D44` | | Metal | `#7A8494` |
| Fire | `#D0662A` (distinct from cinnabar) | | Water | `#2E5E8C` |
| Earth | `#9C7A3C` | | | |

Element hues are never normal-size text: fills, swatch dots, tinted chip backgrounds behind ink text, or ≥19px bold only (all clear 3:1 on paper and on `--surface`). Labels next to a swatch are always `--ink` or `--ink-soft`.

**Today hero (the one color mass per screen):** an ink-wash, not a flat tint — `.hero-card` layers two radial gradients over `--surface`: the day-stem element pools at the top-left (60% → 38% → 14% → transparent) and the branch element warms the bottom-right corner (34% → transparent), seeded per day via `--hero-stem`/`--hero-branch`, plus a film-grain overlay (inline SVG turbulence, ~8% effective). Everything inside is full `--ink`; only large text may sit in the stem's strongest zone (ink 4.06:1 worst case dark earth/metal — clears 3:1 large-text AA, not 4.5:1), so the 38px mixed-weight headline lives there and nothing else does. The caption zone stays ≤34% tint (ink ≥6.6:1). Below the headline sits the orbit line art (`DayOrbit`): fine 1px ink rings and ticks, the stem glyph 64px at center, the branch in a scalloped `--paper` badge riding the ring (the M3-shape nod), and the two elements as node dots — decorative strokes/nodes are line art like the seal, but the glyphs obey the Han toggle (glosses stand in when it's off). Cinnabar stays seal-only; a Fire day's hero uses `--element-fire`, never cinnabar.

## Dark theme

Same system, inverted paper. Applied when the OS prefers dark (and no explicit choice pins light) or when Settings pins dark via `data-theme="dark"`; preference at `daymaster.theme.v1`, stamped pre-paint.

| Token | Hex | Verified contrast |
|---|---|---|
| `--paper` | `#14171C` | |
| `--ink` | `#E8E6E1` | 14.40:1 on paper, 12.32:1 on surface |
| `--ink-soft` | `#A6ACB6` | 7.87:1 on paper, 6.73:1 on surface |
| `--surface` | `#20252F` | tonal containers, borderless |
| `--paper-raised` | `#1D222B` | inputs only — edge comes from the `--ink-soft` border, not fill (it sits below `--surface`; it is not "higher") |
| `--hairline` | `#2C323C` | rare in-container dividers only |
| `--cinnabar` | `#BF3A2B` | unchanged both themes — 3.30:1 on `--paper`; the seal always sits on `--paper`, never inside a tonal container (2.82:1 on dark surface would fail the 3:1 graphics bar) |
| `--seal-paper` | `#F5F6F4` | seal interior stays stamped-paper white in BOTH themes |

Dark element accents (same usage rule): Wood `#63A871`, Fire `#E0764A`, Earth `#C09B55`, Metal `#96A1B2`, Water `#6FA0D0` — all ≥4.5:1 on paper, ≥3:1 on surface.

Containers are borderless tonal fills in BOTH themes now — the M15 `dark-borderless` carve-out generalizes: nothing non-interactive carries a border in either theme, with one named exception, the agency card's ink top-border (§Surfaces). Interactive controls (inputs, segmented containers) keep their 1.5px `--ink-soft` border in both themes (WCAG 1.4.11). The seal is the only cinnabar mass in both themes and renders on `--paper` only. PWA `theme-color` follows the scheme.

## Type

One Latin family — **Figtree** (via `next/font/google`, self-hosted at build; geometric-humanist, the closest Google-Sans feel on Google Fonts) — carrying a bold Material-style scale, plus the Han register below. Registers:

- **Display — 28–32px/700, -0.01em**: screen titles. Named exception: the Today headline hook is 38px mixed-weight (400 with an extrabold middle run, -0.02em) — the hero's editorial register, used nowhere else.
- **Emphasis — 20–22px/600**: the agency line, the day-master archetype.
- **Body — 15px/400/1.6 `--ink`**: reading prose, explanations, form labels. Reading prose is `--ink`, never `--ink-soft`.
- **Section header — 13px/600 `--ink-soft`, sentence case**: section openers ("Favors", "Your day, by area", "This year"). No rule, no uppercase — Material subheader style. One per section; the Favors/Watch board counts as two sections, one header per column.
- **Caption — 12px `--ink-soft`**: fact tags, pinyin, meta rows. Numeric columns are right-aligned so alignment never depends on font features; apply `tabular-nums` on top where the family provides it.
- **Han register**: `"Songti SC", "Noto Serif SC", serif`, 40–56px in the pillar grid, 64px stem + badge branch in the Today orbit. No CJK webfont. Opt-in: the app is English-first, so outside the seal this register renders only when "Show Chinese characters" is on.

Named exception: form-field text is 16px so iOS never zooms a focused input.

## Captions & links

- A fact-tag caption ("子卯 punishment · career palace") is quiet metadata in the caption register ending in a `›` chevron; the whole row is the tap target that opens its glossary sheet. Never underlined.
- Links and captions are never underlined (the day-column marker is the sole underline and isn't a link). In-flow navigation ("Read more →") is caption-register `--ink-soft`, arrow as affordance, `--ink` on hover.
- Caption rows and arrow-links both get a ≥44px hit area (padding may extend past the visual row — WCAG 2.5.8) and the `--ink` pressed shift on `:active`.
- At most one arrow-link per section. Per-line "Read more →" disclosures inside area sections are exempt — they belong to their line, not the section.

## Surfaces: tonal containers & segment stacks

Separation is fill and gap, never line — and never shadow: in-flow surfaces cast none; a lone card mid-paper is carried by its 24px radius, 16–20px padding, and the tint (1.09:1 light / 1.17:1 dark is deliberately quiet, Material surface-container territory). The only elevation effects in the app are the sheet's scrim and the floating update toast's shadow. Radius scale: **24px** standalone containers (reading cards, board columns, decade card), **28px** sheet top corners, **16px** inputs, **pill** buttons/chips/segmented controls.

- **Content cards**: every reading line (Today, Cycles outlooks, Compare, Chart callouts, guidance groups) is a `--surface` container, radius 24, padding 16–20, separated by 8px gaps. Borderless in both themes.
- **Segment stacks** (Google settings idiom) for lists: area gauges, activity picker, settings toggle rows — each row a `--surface` segment, 2px gaps between rows. Corners per row: first 24/24/8/8, middle 8 all round, last 8/8/24/24; a single-row stack is 24 all round. The 2px inset `--ink` ring marks *selection* (the picker's chosen activity); an unfolded gauge row is expansion, not selection — no ring.
- **Sheets**: `--surface`, 28px top corners, over the mandated 40% black scrim (both themes) — the scrim is the sheet's edge.
- **Chips**: tonal pills, no border — a 10% ink tint over their container (theme-proof on paper and on `--surface`). Where an element is cited, the tint is `color-mix(<element hue> 24%, var(--surface))` with `--ink` text — verified: light Wood 10.77:1 / Fire 11.20:1, dark Wood 8.32:1 / Fire 8.67:1.
- The agency line keeps its distinct container: `--surface`, radius 24, with the ink top-border as the sole decorated container (named exception, restated in §Dark).
- Guidance grouping holds: prose lines sharing one fact tag render as ONE card — caption once, sentences as paragraphs.

## Layout

Mobile-first, single column, max-width 28rem centered; 5-tab bottom nav (Chart · Today · Cycles · Compare · Settings), safe-area padded. `/dates/` is reached from Today and Compare.

**Today** (top to bottom; Co-Star content architecture per docs/research-2026-07-16-costar-layout.md): quiet date strip → week strip → hero card: one 24px-radius ink-wash container (§Today hero), 38px mixed-weight headline hook over the `DayOrbit` line art (stem center, branch badge, element nodes) with the pinyin caption beneath — all `--ink` → "At a glance" segment stack — each activity a bar growing from the center tick of a watch↔favors axis, length = strength (wood-green right, fire-orange left, bare axis when neutral; no round thumb — a dot there read as a draggable slider); leaning rows visible, neutral behind "Show all N areas" → the reading as life-area section cards (Roots/Career/Home/Horizon from `ReadingLine.area`, day-level lines under "The day itself"), prose first and the fact citation BELOW each line → Favors/Watch board (two tonal columns: activity word lists — stark, chipless — over a hairline divider, then the fact-cited suggestions) with its grouped guidance cards directly beneath, officer group first (the M14 arrangement) → finder link → agency card → tomorrow note. The palace-touch sentence is retired — area section headers carry it.

**Onboarding:** one step per screen; ≥8px progress dots, `--ink` current; input directly under the heading, pill primary action in flow directly after — no dead void; back always available; restore link beneath.

**Forms (all screens):** inputs 48px min height, `--paper-raised` fill, 1.5px `--ink-soft` border, radius 16, 16px text, focus ring `--ink` 2px offset 2px. Two-way choices are segmented pills: one container with a 1.5px `--ink-soft` border, selected segment an `--ink` fill. Multi-option pickers: segment stacks (above); the Han category token (≤4 characters, nowrap) never breaks mid-token. Disabled primary: the chips' 10% ink tint as fill, `--ink-soft` text — unpressable, not broken, and still visible on paper or on a card (a `--surface` fill would vanish there).

**Pillar grid (hero):** four columns Year · Month · Day · Hour; palace label (caption), stem + branch characters, pinyin + gloss beneath. Day column carries the ink underline. Unknown time → hour column is an empty frame captioned "hour unknown", never fake data.

**Cycles:** This year / This month outlooks as content cards under section headers; vertical timeline (characters + age span + years, captions tabular); current decade as a 24px tonal card with element chips; annual pillars scroll inside their own row — the page never scrolls sideways.

**Compare:** saved-people list (segment stack), add-person form per Forms spec, both pillar grids, "How your charts meet" as content cards, finder link last.

**Find a day (/dates/):** activity segment stack → date window → optional saved person → pill "Find days" → results as tonal cards (rank, date, officer caption, per-chart leaning swatches in wood-green/fire-orange), verdict inside the top pick.

**Settings:** toggle rows as a segment stack, appearance segmented pill, install hint, data ownership block, full disclaimer, "Delete my data" (ink-outline pill, confirm step).

## The signature: cinnabar seal

Unchanged from M4: deterministic SVG from the four pillars — cinnabar square, rounded 8%, hash-seeded corner notches and rotation jitter, `--seal-paper` 白文 stem characters (three stacked when hour unknown). Chart screen, onboarding reveal, share surfaces — always on `--paper`, never inside a tonal container. The only cinnabar mass anywhere.

On screens without the seal, the recurring signatures are the ink-wash hero card with its orbit line art and the agency card's ink top-border; with Han characters off the orbit renders glosses in the display register (wash and line art kept), and the agency card plus the element accents carry the brand.

## Motion

Springier, still sparse (Material Expressive nod): the seal stamp keeps its 280ms cubic-out moment; sheets slide up 240ms and interactive selections (segments, chips, week cells) settle with a gentle overshoot — `cubic-bezier(0.34, 1.56, 0.64, 1)`, ≤240ms, transform/opacity only. Everything gated behind `prefers-reduced-motion: no-preference`.

## Floor

360px minimum width; visible `:focus-visible` rings (`--ink` 2px offset 2px); WCAG AA — verified: ink/paper 15.77:1, ink-soft/paper 6.13:1, ink-soft/surface 5.63:1 (dark 6.73:1), cinnabar/paper 5.02:1, element hues ≥3:1 on paper and surface per the fills/large-text rule; zero console errors.

## Copy

Sentence case everywhere. Buttons say what they do ("Save chart", never "Submit"). Errors say what happened and how to fix it, in that order: "We couldn't find that city. Try the nearest larger town — timezone is what matters." / "That date is outside the supported range (1900–2100). Check the year."
