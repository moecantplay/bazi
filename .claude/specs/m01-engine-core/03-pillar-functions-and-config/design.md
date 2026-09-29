# Design — Pillar functions and engine config

Reconstructed 2026-09-29 from: `_sources/plan.md` §M1, `_sources/progress.md` §M1, `_sources/decisions-log.md` 2026-07-07 entries. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Input conventions fixed up front: instant = JS Date (absolute UTC); IANA zone string for local reading; dailyPillar takes "YYYY-MM-DD"; longitude east-positive.

## Changes

| Area | Change |
| --- | --- |
| `packages/bazi-engine/src/pillars.ts`, `sexagenary.ts`, `true-solar-time.ts` | pillar and time functions |

## Alternatives considered

Equation of time purely from astronomy-engine: not possible — it exposes only apparent RA, hence the Meeus exception.

## Risks

Not recorded.

## Verification

Unit tests per function; EoT validated against known extremes (±20 min bound).

## Decisions

- 2026-07-07 Day-pillar anchor: 1949-10-01 = 甲子 per brief §4.4.
- 2026-07-07 Engine input conventions: instant = JS Date (absolute UTC); IANA zone for local reading; dailyPillar takes "YYYY-MM-DD"; longitude east-positive; out-of-table years (pre-1900/post-2100) throw RangeError.
- 2026-07-07 EoT mean longitude from the Meeus polynomial (source-commented) — accepted exception to "astronomy-engine only" (see flags.md).
