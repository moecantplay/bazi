# Research 2026-07-30 — gradients + adjacent 2026 effect trends

Scope: gradient techniques (mesh, grainy, aurora, data-driven) plus the other 2026
effect trends realistic for a daily-reading app — for the M18 "should Today get
visual effects" exploration. Sibling doc covers glassmorphism/liquid-glass and
neumorphism; not repeated here except where directly relevant to a verdict.

**Where we're starting from, not zero:** `.hero-card` in
`apps/web/src/app/globals.css:210` already does two of the things this whole
research space is about — a gradient derived from data (the day's element via
`--hero-stem`/`--hero-branch`, set inline per chart) and a grain overlay
(inline SVG `feTurbulence`, no asset, ~8% effective opacity) to keep the wash
from looking like flat marketing-gradient plastic. Everything below is framed
against that baseline: what's already covered, what a second pass could push
further, and what would just be re-skinning the same idea.

---

## 1. Gradient trends

### Mesh gradients — organic multi-point color blends

The dominant 2026 gradient shape: instead of one linear/radial transition,
several color points blend in 2D space, reading as soft and almost liquid
rather than a single directional sweep
([learnui.design deep-dive](https://www.learnui.design/blog/mesh-gradients.html);
[trend roundup](https://tubikstudio.com/blog/ui-design-trends-2026/)). CSS has
no native mesh-gradient primitive yet, so production implementations fake it
by stacking multiple `radial-gradient()` layers at different positions in one
`background` — 4-5 points is the sweet spot before it turns muddy or costs
noticeable paint time
([gradient-guide summary](https://better-gradient.com/blog/mesh-gradient-css-guide)).
That's structurally what `.hero-card` already does with two radial layers
(stem pool top-left, branch pool bottom-right). A true mesh push would mean
3-4 points instead of 2 — e.g. adding a third, smaller pool seeded by the
day's *ten-god* or *officer* category color, not just stem/branch — which
would need real justification (a third data dimension worth showing), not
just "more points because mesh is trendy."

**Verdict:** don't chase true 4-point mesh on Today. Two element-derived pools
is already the right amount of information density for a hero that also has
to host a 38px headline. Where a mesh recipe *is* worth trying: a **week
strip** or **month/year horizon view**, where each of 7 (or 12) cells could
carry its own small two-point wash keyed to that period's element — mesh
gradients read best as a field of small color decisions, and that's a real
second use case the current single-hero implementation doesn't cover.

### Grainy gradients — noise as an anti-banding and texture layer

Grain-over-gradient solves a real rendering problem (color banding on subtle
transitions, worst on light-to-white ranges) and doubles as texture that
reads as paper/film rather than plastic
([CSS-Tricks](https://css-tricks.com/grainy-gradients/);
[Frontend Masters](https://frontendmasters.com/blog/grainy-gradients/)). The
mechanism is exactly what `.hero-card::after` already does: an SVG
`feTurbulence` filter rendered to a data-URI tile, layered as a pseudo-element
with `mix-blend-mode` or plain opacity. Two production levers worth adding
that the current implementation doesn't use:

- **`baseFrequency` tuning per surface.** Lower frequency (~0.4-0.6) reads as
  coarse film grain (good on a big hero wash); higher (~0.9, what's already
  in use) reads as fine sensor noise (good on small chips/cards). Varying
  this by component size, rather than reusing one 240×240 tile everywhere, is
  the "extend it" move — a second grain tile at coarser frequency for any
  full-bleed surface (e.g. a redesigned week-strip background) would read as
  a deliberate texture system rather than a one-off hero trick.
- **`mix-blend-mode: overlay` or `soft-light` instead of flat opacity.** Flat
  opacity (current approach) always lightens or flattens contrast slightly.
  `overlay` grain darkens dark stops and lightens light stops, which
  preserves contrast better under text — worth testing against the current
  4.06:1 worst-case in the stem's strongest zone, it may buy back a little
  headroom rather than cost it.

**Verdict:** the existing grain technique is already correct and current;
don't replace it. The one genuine gap is dark-mode-specific tuning — confirm
the same `baseFrequency`/opacity pair reads correctly against the inverted
"paper-with-ink" dark anchor (per the 2026-07-30 dual-theme rule), since grain
opacity that looks subtle on a light wash can look muddy on a dark one.

### Aurora gradients — blurred multi-band glow, almost always dark-background

Layered radial/conic gradients blurred together over a near-black base,
reading as northern-lights bands
([Superdesign's Aurora UI writeup](https://superdesign.dev/styles/aurora)).
Static aurora is ~4 gradient layers + one blur; animated aurora (slow hue
drift) is usually a WebGL shader in premium SaaS heroes — overkill for a
mobile PWA hero. The style is explicitly a **dark-surface, saturated-hue**
effect (purple/teal/pink glow against black) — the opposite of this app's
ink/paper restraint and the opposite of "one aurora moment per viewport" being
compatible with an information-dense reading screen.

**Verdict:** skip outright. Aurora's whole appeal is chromatic looseness —
several unrelated hues glowing together — which fights both the deterministic
single-element-hue rule and the "cinnabar/ink is the only bold color event"
identity. Where the *idea* (soft blurred glow bands) has any legitimate use:
a subtler single-hue version is just... what `.hero-card` already is at lower
saturation. Not a new direction, a naming trap.

### Data-driven vs. decorative gradients — the real opportunity here

The most relevant 2026 pattern isn't a texture, it's a *source*: gradients
derived from the content itself rather than picked by a designer. Two
concrete production examples, both directly analogous to "gradient from the
day's element":

- **Cumulus** (weather) — background gradient shifts by time of day *and*
  current weather condition (rain/snow/sun), so the color is a live readout
  of a real external state, not decoration.
- **Gradient Weather** (Android) — explicitly "a UI that shifts with the
  sky"; ships both a weather-driven theme and a Material You (wallpaper
  color) theme as parallel options
  ([subtlesignals.studio](https://subtlesignals.studio/gradientweather/)).
- **Tide Guide** (2026 Apple Design Award, Visuals & Graphics) — palette is
  tuned to match the actual color of the sky through the day, layered under
  Liquid Glass chrome
  ([PhoneArena coverage](https://www.phonearena.com/news/the-best-of-app-store-2026-apple-design-award-winners_id180852)).

Daymaster already has the *better* version of this pattern — the color isn't
inferred from a live sensor, it's computed deterministically from the day
pillar, so it's exactly reproducible and testable, which weather-app gradients
structurally can't be. The finding isn't "add this," it's "the app already
made the correct bet; the design system should say so explicitly" — e.g. the
gradient's element mapping could extend past the hero into more places that
currently render flat (list rows for the week strip, activity/area cards)
using the *same* deterministic input, rather than treating `.hero-card` as a
one-off special case.

**Verdict:** the highest-value gradient work here is breadth, not novelty —
propagate the existing data-driven gradient logic to 1-2 more Today-screen
surfaces (week strip cells, the "at a glance" axis background) rather than
inventing a new gradient *style*.

### Accessibility: text-over-gradient legibility

Universal solution across sources is the **scrim** — a solid-to-transparent
gradient layer sitting between the background gradient and the text, so
contrast doesn't fluctuate letter-to-letter as the underlying gradient's hue
shifts (30-40% dark overlay for light text, 20-30% light overlay for dark
text is the commonly cited range —
[Smashing Magazine](https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/),
[instantgradient.com guide](https://instantgradient.com/blog/accessible_gradient_guide)).
`.hero-card` already sidesteps needing a scrim by a stronger method: it pins
where high-tint gradient stops are allowed to fall (documented in the code
comment — only large text may sit in the stem's strongest zone, captions stay
in the ≤34%-tint area) rather than adding an overlay after the fact. That's
the more rigorous version of the same idea — **worth writing down as the
house rule** ("every gradient defines a text-safe zone with a tint ceiling,
checked against both themes" — already true in practice, not yet stated as a
transferable principle for the next surface that gets a gradient).

---

## 2. Other adjacent 2026 effect trends

### Claymorphism — soft inflated 3D shapes, saturated + shadowed

Distinct from neumorphism in the way that matters for legibility: neumorphism
keeps the shape the same color as the page (crushes contrast), claymorphism
floats a saturated shape *above* the page with a colored drop shadow and inner
highlight, so it stays readable
([pixso.net comparison](https://pixso.net/articles/glassmorphism-vs-neumorphism-vs-claymorphism/)).
By 2026 it's "settled into a niche: onboarding flows, kids' apps, fintech with
a friendly face" — explicitly a warmer, more cartoonish register
([setproduct.com guide](https://www.setproduct.com/blog/claymorphism-design-guide)).

**Verdict:** wrong register for this app entirely. Daymaster's whole voice
discipline (VOICE.md: no fatalism, no cartoon mysticism) and its ink/cinnabar
identity are the opposite of "friendly inflated clay." Reject without a
mockup — this is the trend most likely to read as a costume the app is
wearing rather than an outfit that fits.

### Bento grids — modular card layout, not a surface effect

Apple/Linear-style grid of variably-sized cards, each a distinct content
block ([Mockuuups roundup](https://mockuuups.studio/blog/post/best-bento-grid-design-examples/)).
"Bento 2.0" in 2026 adds exaggerated corner rounding and micro-interactions on
top of the base grid. This is a layout pattern, not a texture — it composes
with gradient/glass rather than competing with them.

**Verdict:** partially already present. The M16 Material pass already ships
tonal-card list segments; a bento treatment would mean deliberately *varying*
card size by content importance (headline hero = 2×1, favors/watch = two 1×1s,
week strip = 1×4 strip) rather than uniform-height stacked cards. Worth a
mockup pass specifically for the "areas" and "favors/watch" sections, where
uneven emphasis (some days have 1 strong signal, others have 3-4) is real
information the current uniform stack currently flattens. Don't apply it to
prose/reading sections — ruled-prose reading blocks are deliberately *not*
boxes per the M15 decision, and bento is a boxes-first pattern.

### Organic/morphing shapes — Material 3 Expressive's real differentiator

M3E's actual 2026 update is a shape library (~35 shapes: squircles, scallops,
bursts) with built-in *morphing* — a button press morphs a round shape
squarer, loading indicators morph continuously, physics-based springs replace
duration+easing
([supercharge.design](https://supercharge.design/blog/material-3-expressive)).
This is the mechanism behind the critics' "must lead with motion, not just
tonal boxes" verdict already on record in this repo's M18 research pass (see
`docs/research-2026-07-29-design-references.md`, Fitbit entry) — container
color alone reads shallow; shape *behavior* is what reviewers actually praise.

**Verdict:** the one item in this whole doc genuinely worth a real
implementation, not just a mockup — but scoped to a single element, not a
system-wide shape morph. Concretely: the existing scalloped-badge shape
already drawn around the branch glyph in `DayOrbit` (per the 2026-07-17 Bold
hero decision) is exactly a Material "scallop" primitive already in the app.
It currently renders static. Giving it a one-time settle-in morph on load (or
a subtle transform on date-nav) would be the "lead with motion" move the
critics are asking for, using an asset that already exists rather than
importing M3E's full shape vocabulary.

### Layered shadow depth without full neumorphism

A middle ground: 2-3 stacked box-shadows (tight dark + soft ambient + faint
colored rim) to suggest elevation, without neumorphism's same-color-as-page
extrusion or claymorphism's saturated bulge. This is closer to how iOS/
Material both actually render elevation in production — small, physically
plausible, invisible as a "style," which is the opposite of the loud trend
items above.

**Verdict:** lowest-risk, lowest-reward item here. If the M16 Material tonal
cards ever get a "why do these feel flat" note in review, this is the fix —
but it's polish, not a design *direction*, and shouldn't be scoped as one of
the three mockup treatments. Fold it into whichever direction wins as a
detail pass, not a headline idea.

---

## 3. Fit summary

| Trend | Additive here? | Why / why not |
|---|---|---|
| Mesh gradient (3-4 point) | No, on Today hero | Already at the right density for a text-bearing hero; two pools is the ceiling before it competes with the headline |
| Mesh gradient (small multi-cell) | **Yes** — week/horizon strips | Real second use case the current single-hero build doesn't cover |
| Grainy overlay (as-is) | Already shipped, keep | Correct technique, current, matches the "print not plastic" identity |
| Grainy overlay (blend-mode + per-surface frequency) | **Yes**, small win | Extends existing system rather than replacing it; may improve dark-mode contrast |
| Aurora gradient | No | Dark-only, multi-hue-glow register fights the deterministic single-element-hue + cinnabar-only-bold-color rules |
| Data-driven gradient (propagate) | **Yes**, highest value | App already made the right architectural bet; extend it, don't reinvent it |
| Scrim-for-text | Superseded by existing tint-zone rule | Already solved more rigorously than the generic technique; just needs to be written down as a transferable rule |
| Claymorphism | No | Wrong register entirely (friendly/cartoonish vs. this app's restrained voice) |
| Bento grid | **Partial** — areas/favors sections only | Real uneven-emphasis information exists there; wrong for ruled-prose reading blocks |
| Organic shape morph (M3E) | **Yes**, scoped to DayOrbit badge | Reuses an asset that already exists; answers the M18 doc's own "must lead with motion" caveat |
| Layered shadow depth | Neutral / later polish | Not a direction, a detail — fold into whichever wins |

---

## 4. Implementation snippets

### 4a. Extending the hero to a 3rd (small, contextual) pool

Only if a mockup wants to test a third data dimension (e.g. the day's
officer/favors color) — additive to the existing two-layer `.hero-card`,
not a replacement:

```css
.hero-card--3pool {
  background:
    radial-gradient(150% 110% at 8% 0%,
      color-mix(in srgb, var(--hero-stem) 60%, var(--surface)) 0%,
      color-mix(in srgb, var(--hero-stem) 38%, var(--surface)) 38%,
      color-mix(in srgb, var(--hero-stem) 14%, var(--surface)) 62%,
      transparent 78%),
    radial-gradient(70% 55% at 100% 104%,
      color-mix(in srgb, var(--hero-branch) 34%, var(--surface)) 0%,
      transparent 62%),
    /* new: small accent pool, keep it under 20% max tint so it never
       competes with the two primary reads */
    radial-gradient(40% 30% at 70% 15%,
      color-mix(in srgb, var(--hero-accent) 18%, var(--surface)) 0%,
      transparent 55%),
    var(--surface);
}
```

### 4b. Small-cell mesh for a week-strip (per-cell 2-point wash)

```css
.week-cell {
  --cell-hue: var(--element-wood); /* set inline per day's element */
  background:
    radial-gradient(120% 90% at 20% 0%,
      color-mix(in srgb, var(--cell-hue) 30%, var(--surface)) 0%,
      transparent 70%),
    radial-gradient(90% 70% at 90% 100%,
      color-mix(in srgb, var(--cell-hue) 16%, var(--surface)) 0%,
      transparent 65%),
    var(--surface);
}
/* faded/quieter day per the week-strip convention already in the
   M18 mockups: */
.week-cell[data-quiet="true"] { filter: saturate(0.5) brightness(0.97); }
```

Both stops must be re-verified against `--surface` in `:root[data-theme="dark"]`
— `color-mix` percentages that clear AA on the light `--surface` (#eaede9)
won't automatically clear it on the dark one (#20252f); check both, not just
the default.

### 4c. Grain variant: coarser tile + overlay blend for full-bleed surfaces

```css
.grain-coarse::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay; /* vs. plain opacity — preserves contrast better */
  opacity: 0.35;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.2'/%3E%3C/svg%3E");
}
```

Lower `baseFrequency` (0.5 vs. the existing 0.9) + `overlay` blend reads as
coarser film grain, appropriate for a large surface (week strip background)
rather than the hero's finer 0.9 tile.

### 4d. DayOrbit scallop-badge settle-in morph (the one real motion recommendation)

Gate behind `prefers-reduced-motion` exactly like the existing
`seal-stamp`/`pillar-rise` animations in `globals.css`:

```css
@media (prefers-reduced-motion: no-preference) {
  .orbit-badge {
    animation: badge-settle 340ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes badge-settle {
    0%   { transform: scale(0.9) rotate(-6deg); }
    70%  { transform: scale(1.03) rotate(1deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
}
```

---

## Cross-cutting observations

1. **The app's existing hero is already ahead of the generic trend writeups**
   — data-driven gradient + grain-for-texture + a documented text-safe tint
   zone is what the wider industry is *converging* toward in 2026, not
   something Daymaster needs to catch up on. The research task here mostly
   found "you already built the good version, do more of it" rather than
   "adopt a new technique."
2. **Every genuinely new idea in this doc is additive to an existing surface**
   (a 3rd hero pool, week-strip mesh, coarser grain, DayOrbit morph) — none
   requires a new visual language. That's consistent with the M18 diagnosis
   that the current look is "an unsatisfying blend," not a blank slate:
   effects work here should sharpen the existing identity, not add a
   competing one.
3. **Aurora and claymorphism are the two clearest "reject outright" items** —
   both are chromatically loud or texturally cartoonish in ways that directly
   conflict with named non-negotiables (cinnabar-only-bold-color, restrained
   voice). Worth naming explicitly so a mockup round doesn't waste a
   treatment slot on either.
4. **The dual-theme contrast rule is the actual bottleneck for all of this,**
   not raw creativity — every recipe above needs its own light/dark
   `color-mix` percentage check, because `--surface` and `--element-*` shift
   in dark mode and a tint that's AA-safe on paper can fail on ink (per the
   2026-07-30 rule, light mode has been the failure mode every time so far).
