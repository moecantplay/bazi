# Design — Structured content token runs

Reconstructed 2026-09-29 from: `_sources/progress.md` §M19 Phases 2, 4, 11, `_sources/decisions-log.md` 2026-08-05 Phase 11 + 2026-08-06 cleanup entries. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

One presenter decides register; `han` typed but not rendered (decision F).

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/tokens.ts`, `types.ts` | runs + finalizeLine |

## Alternatives considered

Not recorded.

## Risks

The gloss-only renderer left term semantics ambiguous (Han char vs English name) — the duplicated-gloss bug fixed in M20-01.

## Verification

Content tests; live check.

## Decisions

- 2026-08-05 Phase 11 review: gloss-only rendering fused adjacent branch names ("rathorse clash") — fixed with joinBranchRuns() + a regression test.
- 2026-08-06 Removing the strip safety net surfaced two hidden Han leaks (compare dayMasterLines, natal-interactions {branches}) and a THEME_FRAMES template leaking literal {tgEn}/{tgCn} — all fixed. Lesson: when retiring a defensive fallback, check what it was hiding.
