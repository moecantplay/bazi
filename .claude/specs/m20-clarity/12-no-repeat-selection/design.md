# Design — No repeats day to day

## Approach

For a bank of size n used by a template slot:

- `cycle = floor(dayIndex / n)`, `position = dayIndex mod n` where `dayIndex` is days since a fixed epoch.
- Permutation for that cycle = Fisher–Yates seeded by `hash(chartSeed + slot + cycle)`.
- Pick = `permutation[position]`.

Pure function of (chart, slot, date) → R2 holds. Within a cycle no repeats → R1 holds for windows ≤ n. Across a cycle boundary an entry can repeat within fewer than n days; accepted, bounded, and measured by copy-audit.

When a slot's pick depends on a fact (e.g. clash lines), the day index counts only days the slot was used — not computable without looking back, so those slots use the plain cycle over calendar days and accept a skip. Documented in code.

Replaces `pick()` calls in `content/src` for slots listed in the audit's repeat table.

## Changes

| Area | Change |
| --- | --- |
| `content/src/hash.ts` | `cyclePick(bank, seed, slot, dateISO)` |
| `content/src/readings/*` | Use `cyclePick` for daily slots |
| `content/test/` | Window test over 90 days |

## Alternatives considered

- Remembering what was shown (history in the store): breaks determinism across devices and after restore.

## Risks

- Changes every existing daily reading on deploy. Acceptable once; noted in release notes.

## Verification

Window test; determinism test (view order irrelevant); copy-audit vs baseline.
