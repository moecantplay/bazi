# Design — Today's header in plain words

## Approach

The owner chose option (b): the day-pillar label is replaced by the day's tone in plain words. Each look's hero swaps one span for `DayTonePhrase`, and `dayMeta` is deleted. The animal glyphs on Today become `aria-hidden`, which also suits them as imagery. The previews need no change of their own, because they render the same hero components.

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/banks/daily/day-tone.ts` (R4) | `dayTonePhrase(tone)`: favoured "Leans your way", friction "Take it slow", even "An even day". This is the week legend's vocabulary (DESIGN.md §Instrument), kept in content with the other wording. Unit-tested against the plain-terms list. |
| `components/today/headline.tsx` (R1, R4) | Delete `dayMeta`. Add `DayTonePhrase` (`data-day-tone`), fed by `model.tone`, the same `dayTone` the week strip uses, so the header and the strip agree. |
| `looks/trail/route-hero.tsx`, `looks/dial/today-instrument.tsx` (R1, R4) | The top-right meta span shows the tone phrase. |
| `looks/almanac/poster-field.tsx` (R1, R4) | The foot's second line shows the tone phrase under "Day N of the year". |
| `looks/dial/day-dial.tsx` (R1) | **Found while building:** on any day but today, the dial's centre read "<ANIMAL> DAY". It now reads the weekday ("WEDNESDAY"). DESIGN.md §Instrument is updated to match. |
| `components/elevation-profile.tsx`, `components/glyph-icon.tsx` (R2) | Today's strip icon is `aria-hidden`, and `AnimalIcon` gains a `decorative` prop (hidden, no `<title>`) used by the strip. Chart and Cycles keep the named icon. The dial rim, route NOW disc and poster animal were already inside a labelled `role="img"` or `aria-hidden`. |
| E2E (R1–R4) | `today-plain-header.spec.ts`, run per look: across three days, Today's visible text holds no term from the plain-terms list (copied in the spec, minus "chart") and the header phrase matches the week cell's tone. Today's accessibility snapshot holds no term; link `/url:` lines are excluded because they're never spoken and topic ids name mechanics. The onboarding look step gets the same check. `walkOnboardingToLookStep` is split out of `completeOnboarding`. |

## Alternatives considered

- **Translate the label** ("a fire day of the horse"). It's still a system term in plain clothes. Rule 11 bans element and sign names on Today, not just their old spelling.
- **Move it to the topic page for the day.** It's already there in substance: every topic page's "Where the name comes from" explains the signs.

## Risks

- **A screen reader may lose information.** The sign was never the meaning; the tone and the date are, and they stay on each cell. Checked with the accessibility snapshot.
- **Layout shift in Explorer's top row.** It is checked on device in both themes, as for any Today change.

## Verification

- `pnpm verify` green.
- Full E2E with `E2E_LOOK=trail|almanac|dial`.
- A live check of Today and the onboarding look step in three looks × two themes.
- Deployed to production when green.
