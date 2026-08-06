# Research 2026-07-30 — glassmorphism/"Liquid Glass" and neumorphism for the M18 effects pass

Owner asked whether the Today screen should pick up glass or soft-UI ("neumorphism")
effects, ahead of throwaway mockups. Findings below are for whoever builds those
mockups next — read `docs/mockups-m18/today-three-treatments.html`'s six
treatments and its `<div class="note">` design log first; this doc assumes that
visual language (ink/paper/cinnabar, element hues, both-themes-verified-by-
computed-contrast) as the baseline any effect gets layered onto.

---

## 1. Glassmorphism / Apple "Liquid Glass"

**What Liquid Glass actually is (technically):** shipped across iOS 26/macOS
Tahoe from WWDC 2025. It is not a static frosted-blur layer — Apple's own
framing is "glass that behaves like a lens": Apple Silicon renders real-time
refraction and specular highlights, background content visibly bends through
the material, the tint adapts to what's behind it (light/dark, colorful/plain),
and highlights shift as the device tilts (motion-reactive, tied to the gyro).
Text is specified to always sit on a solid layer, never directly on the glass
itself — that's Apple's own accessibility guardrail, not an accident.

**It launched to real, sustained criticism**, not just launch-week grumbling:
- Contrast failures were measured, not just felt — testers found panels as low
  as **1.5:1** against a 4.5:1 body-text bar. Because a translucent surface
  inherits whatever sits behind it, a panel could pass on one screen and fail
  on the next — there's no way to guarantee compliance for content the system
  doesn't control. [Access Advisors](https://accessadvisors.nz/blog/liquid-glass)
- Complaints reached critical mass: the American Foundation for the Blind sent
  Apple a public letter (Dec 2025); Reddit accessibility threads racked up
  tens of thousands of upvotes. [MacRumors](https://www.macrumors.com/2025/09/17/ios-26-liquid-glass-critiques/)
- The corner-highlight shimmer also produced an unintended optical illusion —
  asymmetric specular highlights read as slanted icons to some users.
- Apple's own response validates the criticism: iOS 26.1 added a **Tinted**
  toggle to dial it back, and iOS 27 (WWDC 2026, June) shipped a **High
  Contrast Liquid Glass** mode addressing roughly 80% of the accessibility
  feedback. [andrew.ooo](https://andrew.ooo/answers/ios-27-liquid-glass-vs-ios-26-accessibility-changes-june-2026/) ·
  [gulfnews](https://gulfnews.com/technology/companies/apple-yields-tinted-control-in-ios-261-beta-4-tones-down-liquid-glass-after-backlash-1.500315176)

**Where glass (Liquid Glass or plain glassmorphism) works vs. fails**, per
current design consensus ([Setproduct](https://www.setproduct.com/blog/liquid-glass-vs-glassmorphism)):
- Works: small, transient, chrome-like surfaces over a background the app
  controls — nav bars, toolbars, toasts, badges, sheets over a photo/gradient
  the designer picked. Native Liquid Glass genuinely shines on system chrome
  where Apple's renderer solves the contrast math per-frame.
- Fails: long-form text, and any background the surface itself doesn't own —
  colorful photos, another glass layer, dense body copy. "Body copy needs a
  stable contrast ratio. A frosted card over a moving photo cannot promise
  one." Glass-on-glass stacking is its own well-known failure — layered
  blurs compound unpredictably and the material stops reading as material
  at all.
- On the web specifically: there is **no CSS primitive for true Liquid
  Glass** — no real-time refraction, no lens-like bending, no adaptive tint.
  Everything below is an approximation.

**Concrete web implementation techniques:**

1. **Standard glassmorphism** (blur + translucency + edge highlight) —
   universally supported, cheap, the honest baseline:
   ```css
   .glass-card {
     background: rgba(255, 255, 255, 0.12);
     backdrop-filter: blur(16px) saturate(160%);
     -webkit-backdrop-filter: blur(16px) saturate(160%);
     border: 1px solid rgba(255, 255, 255, 0.25);
     box-shadow:
       inset 0 1px 0 rgba(255, 255, 255, 0.4),   /* top edge highlight */
       0 8px 24px rgba(0, 0, 0, 0.12);            /* ambient drop */
   }
   ```
   `saturate()` alongside `blur()` is what keeps colors behind the glass from
   looking washed-out gray — Apple's material does this too.

2. **Faked refraction via SVG `feDisplacementMap`** — the closest the web gets
   to real lensing. `feTurbulence` generates procedural noise; its red/green
   channels drive horizontal/vertical pixel displacement in
   `feDisplacementMap`, bending the content visually behind the glass edge.
   Real projects have rebuilt this convincingly
   ([kube.io](https://kube.io/blog/liquid-glass-css-svg/),
   [LogRocket](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/)),
   but: the bending-refraction filter variant is **Chromium-only today** (not
   Safari/Firefox), it's shape-constrained, ignores Snell's Law (uniform fake
   bending, not physically-accurate), and is real GPU cost per frame. Not
   worth it for a production PWA reading screen — worth it only if a mockup
   wants one hero moment and can fall back gracefully.

3. **Fallback discipline (non-negotiable for this app):** always define a
   solid-background fallback and respect `prefers-reduced-transparency` /
   `prefers-contrast: more`:
   ```css
   @media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
     .glass-card {
       background: var(--card);
       backdrop-filter: none;
       -webkit-backdrop-filter: none;
       border-color: var(--ink-soft, currentColor);
     }
   }
   ```

**Real examples worth a look:** Apple's own Control Center / Camera sheet in
iOS 26+ (the reference implementation, native-only); Windows 11's Mica/Acrylic
materials (a more conservative, longer-lived take on the same idea, ships with
better contrast defaults than Liquid Glass v1); and — already in our own
reference doc — **Moonlitt** (2026 Apple Design Award, Interaction), whose
moon-view glass panels were explicitly flagged there as "Apple-trend, not our
system." That flag still holds after this research: it's the trend, not
something to imitate wholesale.

---

## 2. Neumorphism / Soft UI

**What it is:** a single element, background-colored to match its parent,
sculpted into apparent depth by **two opposing soft shadows only** — no
transparency, no borders. A light shadow up-left + dark shadow down-right
reads as "extruded"; both shadows inset reads as "pressed in." It had a sharp
2020 hype spike (Dribbble-driven) and was largely abandoned by designers
within about a year.

**Why it failed — and this is structural, not a polish problem:**
- The style's entire visual identity depends on element and background being
  *nearly the same color* — contrast is sacrificed by definition, not by a
  bad implementation of it. [Superdesign](https://www.superdesign.dev/styles/neumorphism)
  puts it bluntly: "a structural accessibility problem that no amount of
  polish removes."
- Classic neumorphic buttons measure around **1.1:1** element-to-background
  contrast, against a required 3:1 for non-text UI components (WCAG
  2.1/2.2). Soft shadows don't survive bright sunlight or low vision, and
  don't survive a contrast audit either.
- **Ambiguous affordance**: nothing distinguishes a tappable button from a
  decorative bevel except a shadow direction — users can't tell what's
  interactive without trial and error. This gets worse, not better, on a
  content-dense screen (our exact case: headline, hero, favors/watch lists,
  week strip, prose, bottom nav all in one view) — soft-shadow depth cues that
  read fine on one hero button turn into visual noise across a dozen small
  controls.
- Apple itself dabbled in neumorphic touches early on and pulled back, keeping
  strong contrast in anything functional (Settings, controls) while soft
  shadows survived only as decorative texture elsewhere.

**2025/2026 status:** effectively declined as a standalone system. What
survives is "neumorphism 2.0" / post-neumorphism — soft dual-shadow depth used
as a **restrained accent inside a system that gets its actual contrast from
somewhere else** (real borders, solid fills, tonal color), never as the sole
differentiator between "button" and "background."

---

## 3. Verdict for Daymaster

**Glass — usable, but only as a restrained accent, never the reading surface.**
Fit: a glass treatment on the **week-strip or bottom-nav chrome**, floating
over the hero's ink-wash, is defensible — it's small, transient, sits over a
background we author (so we control contrast), and doesn't carry body text.
A glass **hero card** is the highest-risk placement precisely because the
hero already IS the app's one color mass (element ink-wash, per the
2026-07-17 hero decision) — stacking translucency on top of a wash we already
tuned for AA in both themes reopens exactly the contrast problem the 07-30
both-themes rule was written to close. **Never** on the reading prose (favors/
watch lists, area sections) — that's long-form text on a background we don't
fully control frame-to-frame, the exact case Liquid Glass itself got hammered
for.
**Biggest risk if a mockup builder applies it naively:** glass on the reading
sections turns the app's information-dense screens into the least legible
part of the product, and glass-on-glass (nav floating over a glass hero) will
compound blur unpredictably. Any glass mockup MUST re-run the project's
computed-contrast check in both themes before it's considered a candidate —
this is exactly the failure mode that produced 34 light-mode failures last
round, and glass makes contrast *harder* to guarantee, not easier.

**Neumorphism — much harder to justify here; if used at all, one component,
paired with a real border.** The style's entire premise (element ≈ background)
fights the project's own house rules: --ink-soft borders on every interactive
control in both themes, ≥3:1 non-text contrast, "unpressable not broken" for
disabled states. A responsible use would be a single non-critical decorative
moment — e.g. the day-pillar hero's orbit-ring badge looking subtly
extruded — with a real hairline ring doing the actual affordance work and the
soft shadow riding on top as texture only. It should never touch the
favors/watch board, forms, or bottom nav, where users must be able to tell
what's tappable at a glance.
**Biggest risk if a mockup builder applies it naively:** every button and
chip in the favors/watch board and bottom nav becomes indistinguishable from
its background, which is precisely the "ambiguous affordance" failure mode
that killed neumorphism industry-wide, and it will fail the project's own
contrast gate on both themes, not just light.

---

## 4. CSS starting points for a mockup builder

Token names below are placeholders — map them to whichever treatment's
tokens you're extending in `today-three-treatments.html` (e.g. `--bg`/`--card`/
`--ink`/`--wd`/`--wd-f`, names vary slightly per treatment).

### Glass card — light + dark

```css
.glass-card {
  --glass-tint: 255, 255, 255;   /* flip to 20,20,20-ish for dark below */
  background: rgba(var(--glass-tint), 0.14);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  border: 1px solid rgba(var(--glass-tint), 0.28);
  box-shadow:
    inset 0 1px 0 rgba(var(--glass-tint), 0.35),
    0 8px 20px rgba(0, 0, 0, 0.10);
  border-radius: 24px; /* matches project's card radius scale */
}

:root[data-theme="dark"] .glass-card {
  --glass-tint: 20, 20, 18;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 20px rgba(0, 0, 0, 0.45);
}

/* text on glass: always a solid chip behind it, per Apple's own rule */
.glass-card .label-chip {
  background: var(--card);
  color: var(--ink);
}

@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .glass-card {
    background: var(--card);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

### Neumorphic element — light + dark, with a real affordance ring

Pure two-shadow neumorphism is included for reference, but ships with an
added `outline`/border so it clears 3:1 non-text contrast — the "hybrid"
approach recommended above.

```css
.soft-ui {
  background: var(--bg);
  border-radius: 20px;
  box-shadow:
    6px 6px 14px rgba(0, 0, 0, 0.10),
    -6px -6px 14px rgba(255, 255, 255, 0.75);
  outline: 1px solid var(--ink-soft, rgba(0, 0, 0, 0.18)); /* the affordance fix */
}

.soft-ui:active { /* pressed */
  box-shadow:
    inset 4px 4px 10px rgba(0, 0, 0, 0.12),
    inset -4px -4px 10px rgba(255, 255, 255, 0.7);
}

:root[data-theme="dark"] .soft-ui {
  box-shadow:
    6px 6px 14px rgba(0, 0, 0, 0.55),
    -6px -6px 14px rgba(255, 255, 255, 0.04);
  outline-color: var(--ink-soft, rgba(255, 255, 255, 0.16));
}
```

---

## Cross-cutting observations

1. **Neither effect is a system-wide direction candidate for this app** — both
   are accents at most. Treat them the way the M18 mockups already treat
   texture (film grain on the hero, the Trail treatment's topo paper): one
   deliberate surface, not a skin over the whole screen.
2. **Glass's central promise (adaptive, content-aware contrast) is exactly
   what native Liquid Glass has and the web does not.** Any web "glass"
   mockup is a glassmorphism approximation wearing Liquid Glass's name — say
   so plainly in the mockup notes so the owner isn't comparing our CSS blur
   against Apple's real-time renderer.
3. **Both effects fail for the identical underlying reason**: they let
   *background content* determine foreground contrast instead of the
   designer. That's the opposite of this project's whole design discipline
   post-2026-07-30 (contrast computed and locked per theme, not eyeballed) —
   which is exactly why both need a hard "solid fallback wins" rule if either
   ships at all.
4. **If the owner wants "some depth/wow" without the accessibility debt**,
   the hero's existing ink-wash + film-grain + line-art (2026-07-17 decision)
   already delivers a comparable "digital-tactile" feeling through fills and
   texture, not transparency or shadow-only depth — worth showing the owner
   side-by-side with a glass/neumorphic mockup so the comparison isn't
   effect-vs-nothing, but effect-vs-what-we-already-shipped.

Sources: [MacRumors — Liquid Glass criticism](https://www.macrumors.com/2025/09/17/ios-26-liquid-glass-critiques/) ·
[Access Advisors — Liquid Glass accessibility](https://accessadvisors.nz/blog/liquid-glass) ·
[andrew.ooo — iOS 27 vs 26 accessibility changes](https://andrew.ooo/answers/ios-27-liquid-glass-vs-ios-26-accessibility-changes-june-2026/) ·
[Gulf News — Tinted control backlash](https://gulfnews.com/technology/companies/apple-yields-tinted-control-in-ios-261-beta-4-tones-down-liquid-glass-after-backlash-1.500315176) ·
[Setproduct — Liquid Glass vs glassmorphism vs neumorphism](https://www.setproduct.com/blog/liquid-glass-vs-glassmorphism) ·
[Superdesign — neumorphism 2026 verdict](https://www.superdesign.dev/styles/neumorphism) ·
[kube.io — Liquid Glass in CSS/SVG](https://kube.io/blog/liquid-glass-css-svg/) ·
[LogRocket — Liquid Glass with CSS/SVG](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/) ·
[Webflow — Neumorphism rise and fall](https://webflow.com/blog/neumorphism)
