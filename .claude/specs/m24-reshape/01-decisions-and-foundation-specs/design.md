# Design — Decisions and foundation specs

## Approach

A docs-only ticket in one commit. Write the decisions first, then edit each standing file so it agrees with them, quoting the proposal's own wording where it already says it well. No rule is rewritten beyond what a decision requires. Rule numbers in VOICE.md stay put, because tickets and tests cite them (for example `plain-terms.ts` cites rules 11 and 13).

## Changes

| Area | Change |
| --- | --- |
| `decisions.md` (R1) | Rows dated 2026-10-05 (D2) and 2026-10-10 (D1, D3–D6, full rebuild, trial direction). Each links to this ticket's design, or to the M24 ticket that will build it. |
| `foundation/DESIGN.md` (R2) | §Looks: Today only, and the base design is every other screen's only design. §IA: four tabs plus the header gear. A new swatch rule beside the cinnabar rule. Line 12's default defers to M19.9-13. Bump to v6 with a changelog line. |
| `foundation/VOICE.md` (R3) | Rule 11 widened to every screen. A sub-rule for element-name chip labels on You. A sub-rule for colour advice. |
| `CLAUDE.md` (R4) | The Design standing rule: "every screen ships in all three" becomes "Today ships in all three; every other screen is the base design", linked here. |
| READMEs (R5) | `m19.9-looks/README.md`, `m20-clarity/README.md` and `.claude/specs/README.md` tables and notes, plus a one-line status note in each moved or dropped ticket's `requirements.md`. |

## Alternatives considered

- **Fold the spec edits into each screen ticket.** Each ticket would edit DESIGN.md for its own screen. This lost because mockups (02) need the whole layout settled first, and parallel edits to one file collide.
- **Leave the M19.9 and M20 tickets alone and only add M24.** This lost because two roadmaps would disagree, which is the bloat the owner asked to remove.

## Risks

- **Dropping tickets loses requirements.** Mitigation: every dropped or moved ticket gets a note naming where its work went, and nothing is deleted.
- **Rule-number drift in VOICE.md breaks cited references.** Mitigation: rules are widened in place, never renumbered. Grep for `rule 1[0-9]` citations before committing.

## Verification

- A link check over every edited file: each relative link resolves.
- `grep -rn "every screen ships in all three"` finds no live rule.
- `pnpm verify` green, as for any commit.
- The owner reads the diff before commit.
