# Design — Today's header in plain words

## Approach

Remove, don't replace (with option (a)). Each look's hero loses one span. `dayMeta` goes with its last caller. The animal glyphs on Today become `aria-hidden`, which also suits them as imagery. The previews need no change of their own, because they render the same hero components.

## Changes

| Area | Change |
| --- | --- |
| `components/today/headline.tsx` (R1) | Delete `dayMeta`. |
| `looks/trail/route-hero.tsx` (R1) | Drop the meta span. `TodayDateNav` keeps the row, with `justify-between` adjusted so the date sits as it does on days without the label. |
| `looks/dial/today-instrument.tsx` (R1) | The same. |
| `looks/almanac/poster-field.tsx` (R1) | The foot keeps one line, "Day N of the year". |
| `components/elevation-profile.tsx` (R2) | Today's icon: `role="img" aria-label={cell.animal}` becomes `aria-hidden`. The cell button's label already gives the date and tone. |
| Other animal glyphs on Today (R2) | Audit `AnimalIcon`, the dial rim, the route's NOW disc and the poster animal: each is `aria-hidden` or labelled without the sign. |
| E2E (R1–R3) | A new spec, `today-plain-header.spec.ts`: for each look × theme, assert the hero's text and Today's accessibility snapshot contain no term from the plain-terms list (copied into an E2E helper, so `packages/content`'s test file stays the source). The onboarding look step gets the same check. |
| Option (b) only | A `toneWord` span in the freed slot, from `WEEK_TONE_WORD` (`presentation`), in the existing `caption` style. |

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
