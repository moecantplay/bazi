# Design — You

## Approach

Lift the trial's You code from `trial/reshape` (commits 6c23837, 63818aa, 0d27805, 2c23e1b) into proper homes. Split the trial's one `plain-readings.ts` (which mixed Ahead, You and People) into a shared plain-reading module plus one builder per screen. This ticket brings the shared module and You. Behaviour and wording are the trial's, which the owner lived with. Chart maths stays out of content, per the content package rule: presentation computes the favourable/unfavourable split, and content only phrases it.

## Changes

| Area | Change |
| --- | --- |
| `content/src/readings/plain/plain-reading.ts` (R6) | `PlainLead`, `PlainCard`, `PlainReading`, `CardText` (`[title, line]`); helpers `factOf`, `card`, `capitalise`. |
| `content/src/banks/you/you.ts` (R2, R4) | `STRENGTH_CARDS`, `BALANCE_CARDS`, `ROOMS_TITLE`, `HELPS_YOU`, `WEARS_YOU`, `easeLine`. |
| `content/src/banks/you/portrait.ts` (R1) | `portraitLine`, `portraitRest` (from `DAY_MASTER_LINES`). |
| `content/src/banks/colours.ts` (R3) | `Colour`, `ELEMENT_COLOURS` (classical first; Suwen ch. 4 source comment), `STAPLE_ORDER`, `COLOURS_WHERE`, `colourFixLine`. Shared with Today's colour (M24-06). |
| `content/src/readings/you/you-reading.ts` (R1–R4) | `youReading(facts, seedKey)`, `youElements(helps, wears)`, `youColours(helps, wears)`. |
| `presentation/src/you-screen.ts` (R1–R4) | `youScreenFor`, `youElementsFor`, `youColoursFor`, plus the `elementSplit` helper: favourable in engine order, and the rest as wearing, in `ELEMENT_ORDER`. |
| `presentation/src/colours.ts` (R3) | `COLOUR_SWATCH` (the real-colour fills). |
| `web/src/components/plain/plain-reading.tsx` (R1, R4) | `PlainLeadBlock`, `PlainCardList`. |
| `web/src/components/you/you-view.tsx`, `you-elements.tsx`, `you-colours.tsx`, `app/you/page.tsx` (R1–R5) | As in the trial. |
| Tests | Content: `you-reading.test.ts` (the lead for every stem, plain words, the element and colour splits, determinism). Presentation: `you-screen.test.ts` (every fixture). E2E: `you.spec.ts` (portrait, both element headings, both colour headings, the link to Chart). |
| `flags.md` | Already lists the modern colour shades. The pointer is updated to `banks/colours.ts`. |

**Found while building:** three day-master portraits named an element as a material ("raw metal", "refined metal", "quiet water"), which fails rule 11 on a plain screen. They were reworded in `banks/day-master.ts` with the images kept ("raw iron", "cut and polished", "fine and quiet"). Chart shows the same lines and reads the same way.

## Alternatives considered

- **Cherry-pick the trial commits.** They also carry Ahead, People, navigation and trial names, and they conflict with main's own changes since (M19.9-13, M20-24). Lifting by hand into the new layout is cleaner.
- **Rebuild Chart as You in place.** It's a bigger change, and readers lose the pillar grid before "Your chart in full" has a home. Keeping both, linked, is safer until M24-04.

## Risks

- **An unreachable route ships.** `/you/` has no tab until M24-04. It's harmless: nothing links to it, and it renders for any profile.
- **Divergence from the trial.** Content tests pin the trial's exact wording for one fixture, so the owner sees what they lived with.

## Verification

- `pnpm verify`.
- Full E2E with `E2E_LOOK=trail|almanac|dial`.
- Screenshots of `/you/` in light and dark.
- Deploy to production, then a live check of `/you/` in both themes.
