# Design — NOW pill covers an hour label

## Approach

The pill leaves the disc and takes a fixed spot in the route's bottom-right corner, the one region nothing else ever reaches (owner's pick from the [mockups](https://claude.ai/artifact/8bHzRgAQ2mJB42dd6SJawc), 2026-10-14).

- **Where.** In the route's 390×250 viewBox: `x 282, y 224, 88×20`, radius 10, text centred at `(326, 237.5)`. Its text baseline sits level with MORNING's (y 236) on the opposite side, so the two read as the route's floor. The route at x 282–370 runs at y ≈ 60–80, EVENING and the flag sit above it, and the lowest label a mark can carry ends at y ≈ 215 (a down-right label for a mark at progress 0.2). Measured: at least 7px clear in every case (unit test, R2).
- **What it says.** Unchanged: "NOW 10:00" in the anchor pair. The disc keeps the animal and the ring that marks the hour you're in.
- **Geometry in one place.** `route-geometry.ts` gains `NOW_PILL` (the box) and `labelBox(x, y, text)` (the box `labelPlacement` produces, using the same 7.1px character width). `route-hero.tsx` draws the pill from `NOW_PILL`. The pill gets `data-now-pill` for the E2E.
- **No pill when there's no NOW** (another day, or before 6 am / after 10 pm): unchanged, it renders only with the disc.

## Changes

| Area | Change |
| --- | --- |
| web `looks/trail/route-geometry.ts` | `NOW_PILL`, `labelBox` |
| web `looks/trail/route-geometry.test.ts` (new) | the R2 sweep |
| web `looks/trail/route-hero.tsx` | pill drawn at `NOW_PILL`, out of the disc's group |
| web `e2e/best-hour.spec.ts` | R1: the pill holds still across the day |
| `foundation/DESIGN.md` §Explorer | the pill's new place (R3) |

## Alternatives considered

- **Move the label.** No free side: up-left runs off the edge, which is why the label went down-right, and the pill passes through down-right.
- **Lift the pill above its disc while it passes a label** (the legacy map's "YOU ARE HERE"). Runs into the climbing route in 75% of the cases that need it.
- **Try seven spots around the disc in turn.** Still about 30% of cases with no clear spot.
- **Fixed caption** (plain text like MORNING) in the same corner. The owner chose the pill: it keeps "now" as the map's one anchor-pair shape.

## Risks

- The pill is no longer next to the disc. The mockups showed it still reads as now: it's the only other anchor-pair shape on the map and carries the word NOW.

## Verification

Unit sweep (R2), E2E (R1), `pnpm verify`, E2E for today-looks and best-hour, rendered contrast unchanged (same pair on the same fill), live-app check in both themes after deploy.
