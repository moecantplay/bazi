# Research — Co-Star content architecture → Daymaster Today restructure (M17)

Owner brief (2026-07-16): the M15/M16 passes restyled surfaces but did not rearrange content;
"please also rearrange the layouting of the content. i don't mind a full restructure, just bear
in mind our original inspiration was Co Star." Development loops research → execution → testing.

## Sources

Live web (thin on granular layout, consistent on principles):
- Pratt IXD design critique — monochrome, typography-heavy, "leafing through a journal";
  greeting at top; minimal nav; critique: small type + abstract icons hurt discoverability.
  https://ixd.prattsi.org/2024/09/design-critique-co-star-ios-app/
- DeMagSign / Design Matters — one "Day at a glance" push per day; blunt/quirky do–don't
  ("do: extra cheese / don't: ex's instagram"); minimal, restraint-first philosophy.
  https://medium.com/demagsign/how-the-design-of-the-astrology-app-co-star-is-conquering-the-masses-d6b6d235c806
- Diggit Magazine — "insights presented in a minimalistic black-and-white table", charts as
  scientific-looking authority devices.
  https://www.diggitmagazine.com/articles/divine-data-how-co-star-astrology-app-becomes-expert-unknown

Plus first-hand knowledge of the app. Co-Star's day screen architecture, top to bottom:
1. Greeting + date (small).
2. **Hero statement** — the day-at-a-glance line in large type; the screen's one loud thing.
3. **"Day at a glance" chart** — life areas plotted dot-on-axis between TROUBLE and POWER;
   scientific-plot aesthetic, immediately scannable.
4. **Per-area sections** — small-caps area header, short prose, and the astronomical citation
   ("because Venus square your natal Mars…") *after* the prose, small and grey.
5. **Do / Don't** — two stark word lists. No boxes around individual items, no explanations.
6. Minimal bottom nav.

## Derived principles (what to steal)

- One hero moment; everything else is quiet.
- The at-a-glance visualization sits directly under the hero — orientation before prose.
- Prose is organized by *life area*, not by mechanic; the mechanic is a citation UNDER the
  prose, not a heading over it.
- Suggestions are stark lists — words first, justification second.
- Direction + magnitude in one glyph: a dot's position on an axis, not a filled meter.

## What we deliberately do NOT copy

- Do/Don't naming — VOICE.md rule 12 and the 2026-07-08 decision keep "Favors / Watch"
  (postponement, never prohibition).
- Brutal tone — our voice rules stand.
- Black-and-white severity — the M16 Material skin (tonal cards, ink/cinnabar identity) stays;
  this milestone rearranges content, not the surface language.

## New Today architecture (mapping)

| Co-Star | Daymaster |
|---|---|
| Greeting + date | Compact date strip (‹ date ›), unchanged behavior |
| Hero statement | Headline hook + 56px day pillar as ONE hero block |
| Day-at-a-glance dot chart | "At a glance": activities as dot-on-axis rows (watch ← · → favors), leaning rows visible, neutral behind disclosure — MOVED UP from the bottom |
| Per-area sections, citation under prose | Reading lines grouped by the palace they touch — "Career", "Home", "Roots", "Horizon", day-level lines under "The day itself"; fact-tag citation moves BELOW the prose |
| Do / Don't word lists | Favors / Watch: activity words as a plain list (chips retired), fact-cited suggestion lines beneath |
| — | Week strip, finder link, agency card, tomorrow note (unchanged order at the tail) |

The "This day touches your … palaces" line is retired — the area section headers now carry
that information in place.

Plumbing: `ReadingLine.area?: Palace | "overall"` set by the content builders (transit lines →
first natal palace; element/ten-god/star/stage day lines → "overall"). The UI groups by it;
content still does zero chart math.

## Loop log

- Loop 1: research; `ReadingLine.area` plumbed through the daily assembler (area.test.ts);
  Today reordered hero → at-a-glance → area sections → stark board → tail; axis-dot glyph
  replaces the 4-cell meter; citations moved below prose; palace-touch line retired;
  verify + 25/25 E2E green; both-theme screenshots reviewed.
- Loop 2 (critique findings from loop 1 screenshots): 立券交易 wrapped mid-token in glance
  rows → Han token nowrap with label-side wrapping; per-line "Read more" disclosures exempted
  from the one-arrow-per-section rule in DESIGN.md; re-shot, re-gated.
