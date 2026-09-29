# Design — Docs cleanup

## Approach

Moves first, then the rewrite, as separate commits so the history reads cleanly:

1. `git mv` the decisions log content into `docs/decisions.md` (log section cut from CLAUDE.md, pasted verbatim).
2. `git mv PLAN.md PROGRESS.md docs/history/`; `git mv DESIGN.md docs/design.md`; update references (package CLAUDE.md files, agent definitions in `.claude/agents/`, README, code comments).
3. Rewrite root `CLAUDE.md`: what the app is, package map, non-negotiables, the specs workflow, pointers.
4. Archive/delete per the owner's answer.

## Changes

| Area | Change |
| --- | --- |
| `CLAUDE.md` | Rewritten short |
| `docs/decisions.md` | New, verbatim log |
| `docs/history/` | PLAN.md, PROGRESS.md |
| `docs/design.md` | Moved DESIGN.md |
| `.claude/agents/*.md`, package CLAUDE.md files, README | Path updates |

## Alternatives considered

- Condensing the log in place: still loads every session and loses the verbatim history.

## Risks

- `docs/design-system/src/tokens.mjs` is the named source of truth for the app's tokens (`apps/web/scripts/generate-tokens.mjs` copies its values by hand and says so), and `check.mjs` is the contrast gate. Both stay; only the screenshots and prototype cards are candidates for removal.

## Verification

`grep -r "DESIGN.md\|PLAN.md\|PROGRESS.md"` finds only intended references; `pnpm verify` green; `node docs/design-system/check.mjs` still runs.
