# Design — Your best hour

## Approach

**Engine.** `bestHourFact(chart, dayPillar)` lives in its own `src/best-hour.ts` (`facts.ts` was already past 290 lines), and `dailyFacts` emits it right after the hour-interaction facts. `hourBlockWindow` moved from `facts.ts` to `pillars.ts`, next to the hour-pillar boundaries, so `best-hour.ts` doesn't import `facts.ts` in a cycle; the package index still exports it. Each block's pillar comes from the Five Rats rule (`FIVE_RATS[day.stem]` advanced by slot), the same rule `hourPillar` uses. The candidates are all twelve blocks minus the day's rough hour. Each candidate is scored as follows:

| Contribution | Points | Why |
| --- | --- | --- |
| Block stem's element is in `chart.favorableElements` | +2 | The main signal, and the same test as `element-day`. This is what changes the pick day to day. |
| Block branch's principal hidden stem (`hiddenStems(branch)[0]`) is favourable | +1 | The branch's own element adds weight without dominating. |
| Block branch six-combines the day's branch (the almanac's easy hour) | +1 | Agrees with the day. It also breaks the 5-day Five Rats cycle (period becomes lcm(5, 12) = 60). |
| Block branch six-combines the natal day branch | +1 | The home palace eases (day-quality's `day-combine` doctrine). |
| Block branch clashes the natal day branch | −2 | The personal breaker hour (day-quality's `day-breaker` doctrine). |

- **Gate.** A block counts only if its stem's element is favourable. If no block passes, no fact is emitted.
- **Tie-break.**
  1. The stem element that comes earlier in `favorableElements` wins. That list is already ordered, with the climate corrector first.
  2. If still tied, the earlier block in the day wins, counting from 子 (11 pm–1 am) as the almanac does. 子 is still drawn at the route's EVENING end, which is a display rule, not the day's order.
- **Natal hour pillar.** It is never read, so unknown-time charts get the identical fact.

```ts
| {
    kind: "best-hour";
    hourBranch: Branch;
    hourStem: Stem;
    element: Element;
    startHour: number;
    endHour: number;
    /** Same block as the day's easy hour. */
    isEasyHour: boolean;
    score: number;
    reasons: BestHourReason[]; // stem-element | branch-element | easy-hour | natal-combine | natal-clash
  }
```

The weights live in `data/best-hour-tables.ts` with an "interpretive" source comment, and are flagged in `flags.md`.

**Content.**
- `TopicCard` gains `note: TokenLine | null`, a second sentence on its own line. Only the hours card uses it.
- The hours card (`readings/daily/cards.ts`) keeps "Easiest …" and "Roughest …" and sets `note` to "<window> suits you best." When `isEasyHour` is true, the note is "The easy hour suits you best too." instead, so the window isn't repeated. ("It suits you best too" was rejected: under "Roughest …", "it" reads as the rough hour.)
- `hoursPage` (`readings/topic-page.ts`) adds one sentence to `forYou`: "<window> suits you best: it brings <Element>, and your birth chart runs better with more of it." When `isEasyHour` is true it reads "The easy hour suits you best too: …". The phrasing follows the element page's "Your birth chart runs better with more …".
- The lines live in `BEST_HOUR_LINES` (`banks/topics/day.ts`). Card notes are checked by the composed-daily voice sweep.

**Presentation.**
- The best hour is not a `RouteWaypoint`: it has no interaction, and waypoints feed legacy screens too. `TodayScreenModel` gains `bestHour: BestHourMark | null` (`bestHourMarkFor` in `route-waypoints.ts`), with branch, element, window, label, route `progress` and `isEasyHour`.
- The day's timed waypoints and the best hour are spread together, in the order they fall in the day (unclamped `hourWindowRawProgress`, new in `dates.ts`). `spreadTimed` pushes right first, then pins the last mark at the EVENING end and pushes back left if needed. A year of days for every fixture keeps all marks within 0.2–0.86 and at least 0.14 apart.
- When `isEasyHour`, the best hour has no slot of its own and takes the easy waypoint's position.
- `mapHeroSummary` takes the best hour as an optional third argument and adds "suits you best …" (or "the easy hour suits you best") to the aria-label.
- Conditions (`conditions-screen.ts`, `HourMark`) is unchanged: it has had no link since M24-04 and retires in M24-12.

**Web.**
- `looks/best-hour-star.tsx`: the star badge and the element colour helpers, shared by both looks.
- Explorer: `looks/trail/best-hour-route-mark.tsx` draws your own mark. When your hour is the easy hour, the easy mark gains the star and the "EASY · SUITS YOU · …" label. When NOW is inside your hour, NOW takes its element ring and the disc steps aside. `labelPlacement` and `inBlock` moved to `route-geometry.ts` so the new mark shares them.
- Instrument: `day-dial.tsx` draws the arc at radius 133, the lit animal with its star (or an outer ring on a shared easy halo), and the key line ("Suits you …" or "Easy hour suits you").
- Instrument fit: the second key line pushed the board 3–5px under the nav on 2026-07-07, where it had started about 12px above it. The key now sits 8px under the dial (it was 20px) and the dial is 272px (it was 280px, still within DESIGN.md's "at most 280px").
- Every look: the hours card renders `note` as its own line (`today/topic-cards.tsx`).
- Design-system reference cards (`explorer/route-hero`, `instrument/day-dial`, `instrument/week-rings-and-hours`) carry the best hour, so the contrast gate measures it.

## Changes

| Area | Change |
| --- | --- |
| engine `src/best-hour.ts`, `data/best-hour-tables.ts`, `src/facts.ts`, `src/pillars.ts` | `best-hour` fact, scoring, gate, tie-break; `hourBlockWindow` moved to pillars |
| engine tests | goldens, rough-hour exclusion, unknown-time parity, 365-day sweep |
| content `readings/daily/cards.ts`, `readings/topic-page.ts`, `banks/` | card line, page sentence |
| presentation `route-waypoints.ts`, `dates.ts`, `map-hero.ts`, `today-screen.ts` | `bestHour` on the Today model, joint two-sided spread, aria-label |
| web `looks/trail/route-hero.tsx`, `looks/dial/day-dial.tsx` | the mark and key |
| `foundation/DESIGN.md` | Explorer timed marks, Instrument lit-animal budget |
| `flags.md`, `decisions.md` | scoring flag; decision "the day's hours stay general, yours sits beside them" |

## Alternatives considered

- **Branch vs chart (clash/combine with natal branches).** Rejected again for M19.5-06's reasons: it repeats daily and lights up most blocks.
- **Personalise the easy and rough hours themselves (option A).** Rejected by the owner (2026-10-13). It loses the almanac's read, and the "same for everyone" hours are correct for what they claim to be.
- **Overlay that adjusts the day's hours by chart (option C).** Rejected by the owner (2026-10-13). It is hard to explain on the topic page.
- **Stem element only, no branch or day terms.** Repeats every 5 days, and ties on most days.
- **Ten-god of the block stem as the score.** It changes how a reading is phrased, not whether the hour suits you. It could feed the page's sentence later. Not used for picking.

## Risks

- **Interpretive weights.** No classical table ranks hours per chart. Mitigation: a flag, small and explainable weights, and typed reasons for each pick.
- **Colour overlap (accepted).** Style A uses the hour's element colour, so a wood hour shares the easy hour's green (on the dial key, an identical swatch) and an earth hour sits close to the rough hour's amber. Shown in round 2 alongside a double-ring variant and the ink style B; the owner chose A as built (2026-10-13). The star, the label and, on the dial, the arc's thinner outer track keep it apart.
- **Two "good" hours confuse.** Mitigation: separate labels ("the day's" vs "yours"), merging when the two coincide, and mockup review first.
- **Explorer crowding.** Three labelled marks on a 6am–10pm route. Mitigation: a two-sided spread plus a mockup with three marks close together (worst case).
- **Lopsided charts.** Some charts land on one block often. Over all twelve blocks, 60 days from 2026-10-13: A's top block won 17 days, B's (1–3 pm) 27, C's (11 pm–1 am) 20; each chart used 9–10 different windows. Accepted by the owner as honest.
- **Night picks.** Over the same 60 days, C's pick was a night block (9 pm–5 am) on 32 days, A's on 15 and B's on 9. Accepted by the owner ("if it's true like that").
- **Coinciding with the easy hour.** The pick was the day's easy hour on 14–20 of the 60 days, so the merged card line is common, not an edge case.
- **Night hours on Explorer.** The route draws 6am–10pm, so night blocks clamp to its ends, as the day's easy and rough hours already do. The crowded-route mockup must include a night pick.

## Verification

- Engine tests first, then `pnpm verify`.
- Approved mockups in three looks × two themes before any web code.
- E2E covers each look × theme.
- Rendered contrast is measured in both themes.
- Live-app check with two different profiles on the same date, showing different best hours.
- Deploy per the Vercel setup.
