/**
 * Weights for the reader's best hour (M24-13): which two-hour block of a day
 * suits a natal chart most.
 *
 * INTERPRETIVE — no classical table ranks hours per chart; flagged in
 * .claude/specs/flags.md. The parts are standard: each block's stem follows
 * the Five Rats rule (五鼠遁, FIVE_RATS in tables.ts), its branch's principal
 * hidden stem comes from HIDDEN_STEMS, and the relations are the six clashes
 * and combines. The weights follow the same doctrine as day-quality.ts — the
 * favourable-element test is the main signal (as for `element-day`), a natal
 * day-branch clash is the personal breaker (日破) and a combine eases the home
 * palace — kept small so every pick is explainable by its reasons.
 */

export const BEST_HOUR_WEIGHTS = {
  /** The block's stem element is one the chart favours. Also the gate: a block without it is never picked. */
  stemElement: 2,
  /** The block branch's principal hidden stem element is one the chart favours. */
  branchElement: 1,
  /** The block is the day's easy hour (its branch six-combines the day's). */
  easyHour: 1,
  /** The block's branch six-combines the natal day branch. */
  natalCombine: 1,
  /** The block's branch clashes the natal day branch. */
  natalClash: -2,
} as const;
