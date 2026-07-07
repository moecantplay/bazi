# Daymaster — DESIGN (ink & cinnabar)

One page. The UI implements this exactly; deviations go through this file first.

## Tokens

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F5F6F4` | App background. Cool near-white, never cream. |
| `--ink` | `#181C22` | Text, pillar characters, borders. Blue-black, never brown. |
| `--ink-soft` | `#565D68` | Secondary text, captions, pinyin. AA on paper. |
| `--cinnabar` | `#BF3A2B` | RESERVED for the seal. Nothing else — no buttons, no underlines, no accents. |
| `--paper-raised` | `#FFFFFF` | Cards, inputs. |
| `--hairline` | `#D8DBD6` | Dividers only. Input borders use `--ink-soft` (≥3:1 non-text contrast per WCAG 1.4.11). |

Primary actions are filled `--ink` with `--paper` text (15.77:1). The day column's "it's you" marker is an ink underline.

Element accents — used ONLY when that element is referenced (balance viz bars, chip swatches, tags):

| Element | Hex | Note |
|---|---|---|
| Wood | `#3A7D44` | leaf green |
| Fire | `#D0662A` | flame orange — deliberately distinct from cinnabar's red |
| Earth | `#9C7A3C` | loess ochre |
| Metal | `#7A8494` | cool steel |
| Water | `#2E5E8C` | deep river blue |

Element hues are never normal-size text. They appear as fills (bars, swatch dots, chip backgrounds behind ink text) or as large/bold text only (≥19px bold — all five clear the 3:1 large-text threshold on paper; Fire 3.45, Metal 3.49, Earth 3.68, Wood 4.62, Water 6.26). Labels next to a swatch are always `--ink` or `--ink-soft`.

Dark mode is out of scope for v1 (one calm light theme done properly).

## Type roles

- **Display serif — "Fraunces"** (via `next/font/google`, self-hosted at build): screen titles, day-master archetype line, reading pull-lines. Sparingly — never body text.
- **Grotesque — "Inter"**: everything else. Body 16px/1.6, captions 13px.
- **Han characters**: font stack `"Songti SC", "Noto Serif SC", serif`, displayed large (40–56px) in the pillar grid; pinyin (13px, `--ink-soft`) and English gloss beneath. No CJK webfont download — system serif fallbacks are acceptable and keep the bundle offline-safe.

## Layout

Mobile-first, single column, max-width 28rem centered; 4-tab bottom nav (Chart · Today · Cycles · Settings) with icons + labels, safe-area padded.

**Onboarding:** one step per screen (date → time or "I don't know my birth time" → city search over the bundled dataset → sex, with a one-line "used only for luck-cycle direction" note → disclaimer) ending in the seal-stamp chart reveal. Progress dots, back always available.

**Settings:** a plain stacked list — late-Zi toggle, true-solar-time toggle (each with its one-line explanation), the disclaimer in full, and "Delete my data" (destructive style: ink outline, confirm step).

**Pillar grid (hero):** four columns — Hour · Day · Month · Year (right-to-left convention flipped for LTR readers: Year on the left, Hour on the right, labeled clearly). Each column: palace label (caption), stem character, branch character, pinyin + English beneath each. Day column carries a subtle `--ink` underline: it's you. Unknown time → hour column rendered as an empty frame with "hour unknown" caption, never fake data.

**Today:** date strip with ‹ › day navigation (±30), today's pillar as a small two-character block, reading as stacked cards, each card tagged with the fact that produced it (e.g. "子午 clash · career palace"). Final card = the agency line, visually distinct (serif, larger).

**Cycles:** vertical timeline, one node per luck pillar (pillar characters + age span + Gregorian years), current decade card raised with element-accent tags; annual pillars for the current decade as a compact row.

## The signature: cinnabar seal

Deterministic SVG generated from the four pillars (hash of the eight characters):

- Square, rounded 8%, `--cinnabar` fill, subtle irregular edge (2–3 hash-seeded corner notches, as if hand-stamped).
- Interior: the four pillar stem characters in a 2×2 grid, `--paper` colored (white-on-red 白文 style); unknown-time charts use the three stems in a vertical stack.
- Hash also seeds: stroke weight of the inner border (1 of 3), grid rotation jitter (±1.5°), and which corner carries the notch — enough variation that two charts rarely share a seal.
- Appears: chart screen (top), onboarding reveal, share surfaces. It is the only cinnabar mass on any screen.

## Motion

One orchestrated moment: on first chart reveal the seal "stamps" in (scale 1.15→1.0 + opacity, 280ms cubic-out, one soft 4px paper-shadow pulse), then pillar columns fade up staggered 60ms. Everything else: 120ms opacity/transform only. All of it gated behind `prefers-reduced-motion: no-preference`; reduced-motion users get instant render.

## Floor

360px minimum width; visible `:focus-visible` rings (`--ink` 2px offset 2px); WCAG AA contrast — verified ratios: ink/paper 15.77:1, ink-soft/paper 6.13:1, cinnabar/paper 5.02:1, paper-on-cinnabar 5.02:1 (seal interior), element hues per the large-text rule above; zero console errors.

## Copy

Sentence case everywhere. Buttons say what they do ("Save chart", "Show my chart" — never "Submit"). Errors say what happened and how to fix it, in that order: "We couldn't find that city. Try the nearest larger town — timezone is what matters." / "That date is outside the supported range (1900–2100). Check the year."
