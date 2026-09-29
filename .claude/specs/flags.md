# Flags — unverifiable values

Engine values that could not be verified against a source, or were chosen between competing schools. CLAUDE.md's non-negotiables require every such value to be listed here. When a flag is resolved, move it to **Resolved** with the evidence; when work is needed to resolve one, open a ticket and link it.

Moved from PROGRESS.md on 2026-09-29.

## Open

- Day-officer 宜/忌 activity table (data/day-officer-tables.ts) is INTERPRETIVE: the officer sequence and month/day-branch rule are standard (協紀辨方書 lineage; cross-checked against wonyanconsult.com and fourpillars.pro, 2026-07-08), but per-officer activity lists vary by almanac publisher. Ours is a conservative common core; one printed-almanac golden anchor (Sinarmas 2026, 2026-06-21 成 day) is asserted in tests. Refine if more printed pages become available.
- Equation of time uses the sun's geometric mean longitude from the standard Meeus polynomial (280.46646 + 36000.76983·T + 0.0003032·T², Astronomical Algorithms ch. 25) because astronomy-engine exposes only apparent RA. ACCEPTED: standard published constants, source-commented in src/true-solar-time.ts, validated against known EoT extremes (±20 min bound, Nov ≈ +16.5 min).
- 神煞 學堂, 詞館, 血刃 are OMITTED: the reference app (master-reading screenshot, 2026-07-08) places 學堂@卯, 詞館@申, 血刃@戌 for Fixture A, and none of the classical rule variants I could verify (三命通會 day-stem or nayin-命 keyings) reproduce those placements. Rather than guess a school, they're left out; add once the app's rule can be confirmed (its 神煞 help screen, or more example charts).
- 命宮/身宮 (life/body palace) OMITTED: the formula is school-variant (month/hour indexing differs by lineage) and the reference screenshot doesn't show the 命身胎息 tab, so no golden value exists to pick a school against. 胎元 (single unambiguous rule) IS implemented.
- Luck-start day precision matches the reference app exactly (9y5m25d) when the birth wall-clock is UTC+8; at Asia/Jakarta (UTC+7) the same rule yields 9y5m20d. Both asserted in tests. The pillars, stages, and stars are timezone-insensitive for this chart; only the 起運 day count shifts.

## Resolved

(none yet)
