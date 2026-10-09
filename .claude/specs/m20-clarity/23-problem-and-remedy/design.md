# Design — Problem and remedy

## Approach

This is engine work, test-first (`engine-dev`). It uses only the element-cycle functions the engine already exports (`produces`, `controls`, `controlledBy`) and the chart's `favorableElements`. There are no new constants.

1. `src/problem-remedy.ts`: `problemRemedy(chart): ProblemRemedy | null`.
   - **wounds** = `favorableElements[0]`.
   - **problem** = `controlledBy(wounds)`, when that element is present: its count in `fiveElementCounts` is greater than 0.
   - **remedies** = `[controlledBy(problem) as "controls", produces(problem) as "bridges"]`. A bridge counts only if `produces(produces(problem)) === wounds`, which always holds in the five-element cycle. It's asserted anyway.
   - **rootClash**: the natal branch whose main element is `wounds`, when a natal six-clash names it.
2. `facts.ts`: `natalFacts` adds the `problem-remedy` fact. `dailyFacts` adds `remedy-day` from the day stem's and branch's elements.
3. `packages/content`: a `banks/problem-remedy.ts` bank, one plain line per element as problem and per element as remedy, each with its `source` (the M20-22 R13 shape).

## Changes

| Area | Change |
| --- | --- |
| `packages/bazi-engine/src/problem-remedy.ts` | New; source comment cites 神峰通考 病藥說類第九 |
| `packages/bazi-engine/src/facts.ts` | `problem-remedy` natal fact; `remedy-day` daily fact |
| `packages/bazi-engine/test/problem-remedy.test.ts` | Fixture A against fate-craft's read; an absent-problem chart; 60-day daily check |
| `packages/content/src/banks/problem-remedy.ts` | Plain lines with sources |
| `.claude/specs/flags.md` | The two rule choices (R3) |

## Alternatives considered

- **Derive it in content from `favorable` alone.** Lost: content does no chart math (package rule).
- **fate-craft's full method** (病藥 strength grading, per-decade timing). Lost for now: it needs grading rules we can't source yet. R1 covers the core definition the source gives.

## Risks

- **A single external check.** fate-craft is one tool, not a golden source. The flags entry records that.
- **Weak vs strong.** For a strong chart, the helpful element is one that drains the self, so the "problem" can be the self's own element. The R1 rule handles that without a special case; tests cover a strong fixture.

## Verification

- `pnpm verify` green.
- Fixture A matches fate-craft's problem and remedies.
- The fact shows on topic pages through M20-22.
