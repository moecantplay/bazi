# Flags — unverifiable values

Engine values that could not be verified against a source, or were chosen between competing schools. CLAUDE.md's non-negotiables require every such value to be listed here. When a flag is resolved, move it to **Resolved** with the evidence; when work is needed to resolve one, open a ticket and link it.

Moved from the old PROGRESS.md (`_sources/progress.md`) on 2026-09-29.

## Open

- Day-officer 宜/忌 activity table (data/day-officer-tables.ts) is INTERPRETIVE: the officer sequence and month/day-branch rule are standard (協紀辨方書 lineage; cross-checked against wonyanconsult.com and fourpillars.pro, 2026-07-08), but per-officer activity lists vary by almanac publisher. Ours is a conservative common core; one printed-almanac golden anchor (Sinarmas 2026, 2026-06-21 成 day) is asserted in tests. Refine if more printed pages become available.
- Equation of time uses the sun's geometric mean longitude from the standard Meeus polynomial (280.46646 + 36000.76983·T + 0.0003032·T², Astronomical Algorithms ch. 25) because astronomy-engine exposes only apparent RA. ACCEPTED: standard published constants, source-commented in src/true-solar-time.ts, validated against known EoT extremes (±20 min bound, Nov ≈ +16.5 min).
- 神煞 學堂, 詞館, 血刃 are OMITTED: the reference app (master-reading screenshot, 2026-07-08) places 學堂@卯, 詞館@申, 血刃@戌 for Fixture A, and none of the classical rule variants I could verify (三命通會 day-stem or nayin-命 keyings) reproduce those placements. Rather than guess a school, they're left out; add once the app's rule can be confirmed (its 神煞 help screen, or more example charts).
- 命宮/身宮 (life/body palace) OMITTED: the formula is school-variant (month/hour indexing differs by lineage) and the reference screenshot doesn't show the 命身胎息 tab, so no golden value exists to pick a school against. 胎元 (single unambiguous rule) IS implemented.
- Luck-start day precision matches the reference app exactly (9y5m25d) when the birth wall-clock is UTC+8; at Asia/Jakarta (UTC+7) the same rule yields 9y5m20d. Both asserted in tests. The pillars, stages, and stars are timezone-insensitive for this chart; only the 起運 day count shifts.
- Element colours (trial R16; `packages/content/src/banks/colours.ts` since M24-08): the five classical colours are sourced (黃帝內經·素問·金匱真言論 ch. 4: 青 赤 黃 白 黑 for Wood, Fire, Earth, Metal, Water). The modern shades beside them (teal; orange, pink; beige, brown; grey, gold; navy) are common feng-shui convention with no classical source, and vary between writers. Kept to two per element.
- Today's colour steadying rule (trial R17, packages/presentation/src/trial-screens.ts `todayColourFor`): on a day whose element wears you down, the colour comes from the helping element that controls the day's element, else the one it produces. This follows the five-element cycles but is our own interpretive choice, not a sourced almanac rule; other writers pick the remedy differently. The day's element is the day stem's.
- Best-hour scoring (M24-13, `packages/bazi-engine/data/best-hour-tables.ts`) is INTERPRETIVE: the parts are standard (Five Rats hour stems, principal hidden stems, six clashes and combines), but no classical table ranks a day's hours per chart. The weights (stem element +2 and the gate, branch element +1, the day's easy hour +1, natal day-branch combine +1, clash −2) and the tie-break (favourable-element order, then the day's first block) are our own, following day-quality's doctrine. Other writers weigh hours differently.

## Resolved

(none yet)
