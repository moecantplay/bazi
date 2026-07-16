# Daymaster — DESIGN (ink & cinnabar)

One page. The UI implements this exactly; deviations go through this file first.
Revised 2026-07-16 (M15): calm refinement — same identity, real hierarchy. What changed: reading prose is rule-separated, not boxed; a four-register type ladder; captions are quiet metadata, never underlined links; forms have a spec; dark mode separates by fill, not borders.

## Tokens

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F5F6F4` | App background. Cool near-white, never cream. |
| `--ink` | `#181C22` | Text, pillar characters, borders. Blue-black, never brown. |
| `--ink-soft` | `#565D68` | Secondary text, captions, pinyin. AA on paper. |
| `--cinnabar` | `#BF3A2B` | RESERVED for the seal. Nothing else — no buttons, no underlines, no accents. |
| `--paper-raised` | `#FFFFFF` | Boxed surfaces, inputs. |
| `--hairline` | `#D8DBD6` | Dividers only. Input borders use `--ink-soft` (≥3:1 non-text contrast per WCAG 1.4.11). |

Primary actions are filled `--ink` with `--paper` text (15.77:1). The day column's "it's you" marker is an ink underline.

Element accents — used ONLY when that element is referenced (balance viz bars, chip swatches, gauge fills, tags):

| Element | Hex | Note |
|---|---|---|
| Wood | `#3A7D44` | leaf green |
| Fire | `#D0662A` | flame orange — deliberately distinct from cinnabar's red |
| Earth | `#9C7A3C` | loess ochre |
| Metal | `#7A8494` | cool steel |
| Water | `#2E5E8C` | deep river blue |

Element hues are never normal-size text. They appear as fills (bars, swatch dots, chip backgrounds behind ink text) or as large/bold text only (≥19px bold — all five clear the 3:1 large-text threshold on paper; Fire 3.45, Metal 3.49, Earth 3.68, Wood 4.62, Water 6.26). Labels next to a swatch are always `--ink` or `--ink-soft`.

## Dark theme

Same design, inverted paper. Applied when the OS prefers dark (and no explicit choice pins light), or when Settings pins dark via `data-theme="dark"` on `<html>`. Preference lives at `daymaster.theme.v1`; an inline script in the layout stamps the attribute before first paint.

| Token | Hex | Verified contrast on `--paper` |
|---|---|---|
| `--paper` | `#14171C` | ink-paper, blue-black family as light ink |
| `--ink` | `#E8E6E1` | 14.40:1 |
| `--ink-soft` | `#A6ACB6` | 7.87:1 (6.99:1 on raised) |
| `--paper-raised` | `#1D222B` | boxed surfaces, inputs |
| `--hairline` | `#2C323C` | dividers only |
| `--cinnabar` | `#BF3A2B` | unchanged in both themes — 3.30:1 as a graphic mass |
| `--seal-paper` | `#F5F6F4` | seal interior stays stamped-paper white in BOTH themes (5.02:1 on cinnabar); notches keep `--paper` so the chipped corners match the page |

Dark element accents (fills/swatches and ≥19px bold only, same rule as light): Wood `#63A871` 6.30, Fire `#E0764A` 5.87, Earth `#C09B55` 6.90, Metal `#96A1B2` 6.88, Water `#6FA0D0` 6.51 — all clear even the 4.5:1 small-text bar. Fire remains distinct from cinnabar.

**Elevation rule (dark):** boxed surfaces separate from the page by fill (`--paper-raised` on `--paper`), never by border. Hairlines in dark mode are dividers inside a surface only. A bordered box on dark paper is the one thing this theme must never produce — it flattens everything.

The seal is the only cinnabar mass in dark mode too. PWA `theme-color` follows the scheme via two viewport meta entries.

## Type ladder

Four registers. Every text node on every screen is one of these — no ad-hoc sizes.

- **Display — "Fraunces"** (via `next/font/google`): screen titles, the Today headline hook, the day-master archetype line, the agency line. Never body text.
- **Body — "Inter" 15px/1.6 `--ink`**: reading prose, explanations, form labels. Reading prose is `--ink`, never `--ink-soft` — the reading is the product, it doesn't whisper.
- **Kicker — Inter 11px/600, uppercase, 0.08em tracking, `--ink-soft`**: section openers ("FAVORS", "YOUR DAY, BY AREA", "THIS YEAR"). Every kicker sits under a 24px × 2px `--ink` rule — the almanac column-rule, the app's recurring quiet signature. One kicker per section, nothing else uses uppercase.
- **Caption — Inter 12px `--ink-soft`**: fact tags, pinyin, chrome notes, meta rows. `tabular-nums` whenever it carries numbers or dates (gauge values, year rows, age spans).

**Han characters**: `"Songti SC", "Noto Serif SC", serif`. Pillar grid 40–56px; the Today day pillar is a hero at 56px. Pinyin (caption register) and English gloss beneath. No CJK webfont download.

## Captions & links

- A fact-tag caption ("子卯 punishment · career palace") is quiet metadata in the caption register, ending in a `›` chevron; the whole row is the tap target that opens its glossary sheet. **Never underlined.**
- Underlines appear nowhere in the app. In-flow navigation ("Read more →", "Find a day for something →", "How this reading works →") is caption-register `--ink-soft`, arrow as the affordance, `--ink` on hover/active.
- At most one arrow-link per section. If a section wants two, one of them belongs somewhere else.

## Surfaces: ruled prose vs. boxes

Two surface treatments, chosen by function — this is the hierarchy system:

- **Ruled prose** (reading content): no box, no background. Blocks stack directly on `--paper`, separated by `--hairline` rules; each block = caption row + body prose. Applies to Today reading lines, Cycles outlook lines, Compare reading, Chart interpretation paragraphs.
- **Boxes** (`--paper-raised`, radius 12px; hairline border in light, borderless fill in dark): functional objects only — the Favors/Watch board, the agency line (its ink top-border stays), the current-decade card, gauge disclosure rows, inputs, sheets. If everything is a box, nothing is; a box must earn its border by being a *thing*, not a paragraph.
- **Guidance grouping:** prose lines sharing one fact tag render as ONE block — caption once, sentences as paragraphs beneath (kills the triple "成 Success day" stack). The officer block opens the guidance section.

## Layout

Mobile-first, single column, max-width 28rem centered; 5-tab bottom nav (Chart · Today · Cycles · Compare · Settings) with icons + labels, safe-area padded. `/dates/` is reached from Today and Compare, not the nav.

**Today** (top to bottom): quiet date strip (caption register, ‹ › steppers) → headline hook (display, the screen's hero) → day-pillar block (56px Han, pinyin + element dots caption, palace-touch line) → reading as ruled prose → Favors/Watch board (boxed, chips + suggestions + grouped guidance prose) → "Your day, by area": leaning rows visible, neutral rows behind a "Show all N areas" disclosure → week strip → finder link → agency line (boxed, display type) → tomorrow note.

**Onboarding:** one step per screen; progress dots ≥8px with `--ink` current; the step's input directly under the heading and the primary action in flow directly after it — no dead void; back always available. Restore-from-backup link beneath the action.

**Forms (all screens):** inputs 48px min height, `--paper-raised` fill, 1.5px `--ink-soft` border, radius 10px, 16px text, focus ring `--ink` 2px offset 2px. Two-way choices (sex, appearance) are segmented controls: one bordered container, selected segment `--ink` fill with `--paper` text. Multi-option pickers (finder activities): hairline-bordered rows/cards, selected = 2px `--ink` border + raised fill; Han glosses on their own line, `white-space: nowrap`, never mid-phrase wrapped. Disabled primary action: `--paper-raised` fill, `--ink-soft` text, hairline border — unpressable, not broken.

**Pillar grid (hero):** four columns — Year · Month · Day · Hour (labeled clearly). Each column: palace label (caption), stem character, branch character, pinyin + English beneath each. Day column carries a subtle `--ink` underline: it's you. Unknown time → hour column rendered as an empty frame with "hour unknown" caption, never fake data.

**Cycles:** This year / This month outlook as ruled prose under kickers; vertical timeline, one node per luck pillar (pillar characters + age span + Gregorian years, captions tabular), current decade boxed with element-accent tags; annual pillars for the current decade as a compact row that never overflows the column — years scroll or wrap as pairs, no horizontal page scroll.

**Settings:** a plain stacked list — appearance, late-Zi and true-solar-time toggles (each with its one-line explanation), Han-characters toggle, install hint, data ownership block, the disclaimer in full, and "Delete my data" (destructive style: ink outline, confirm step).

## The signature: cinnabar seal

Deterministic SVG generated from the four pillars (hash of the eight characters):

- Square, rounded 8%, `--cinnabar` fill, subtle irregular edge (2–3 hash-seeded corner notches, as if hand-stamped).
- Interior: the four pillar stem characters in a 2×2 grid, `--seal-paper` colored (白文 style); unknown-time charts use the three stems in a vertical stack.
- Hash also seeds: stroke weight of the inner border (1 of 3), grid rotation jitter (±1.5°), and which corner carries the notch.
- Appears: chart screen (top), onboarding reveal, share surfaces. It is the only cinnabar mass on any screen.

## Motion

One orchestrated moment: on first chart reveal the seal "stamps" in (scale 1.15→1.0 + opacity, 280ms cubic-out, one soft 4px paper-shadow pulse), then pillar columns fade up staggered 60ms. Everything else: 120ms opacity/transform only. All gated behind `prefers-reduced-motion: no-preference`; reduced-motion users get instant render.

## Floor

360px minimum width; visible `:focus-visible` rings (`--ink` 2px offset 2px); WCAG AA contrast — verified ratios: ink/paper 15.77:1, ink-soft/paper 6.13:1, cinnabar/paper 5.02:1, paper-on-cinnabar 5.02:1 (seal interior), element hues per the large-text rule above; zero console errors.

## Copy

Sentence case everywhere. Buttons say what they do ("Save chart", "Show my chart" — never "Submit"). Errors say what happened and how to fix it, in that order: "We couldn't find that city. Try the nearest larger town — timezone is what matters." / "That date is outside the supported range (1900–2100). Check the year."
