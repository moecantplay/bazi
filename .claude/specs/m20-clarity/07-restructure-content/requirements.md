# Restructure content

Status: draft · Milestone: M20 · Ticket: 07

## Problem

`packages/content/src/` puts reading builders (`daily-reading.ts`), reference text (`glossary.ts`, `read-more.ts`) and a 392-line `vocab.ts` grab-bag at the same level. `day-guidance.ts` is 405 lines. `day-guidance.ts` exists both at the root and in `banks/`, meaning different things.

## Goal

A writer can find every piece of wording about one subject in one place, and the builders that assemble readings are separate from the words they assemble.

## Requirements

- **R1.** Files grouped as `readings/` (builders), `banks/` (template wording, unchanged), `vocab/` (glosses split by subject), `reference/` (glossary, read-more), plus `tokens.ts`, `types.ts`, `hash.ts`, `index.ts` at the root.
- **R2.** `vocab.ts` split by subject: stems, branches, interactions, palaces, stars, stages, ten gods, officers, activities.
  - Acceptance: no vocab file over ~150 lines.
- **R3.** No two files share a name within the package.
- **R4.** Rendered output is byte-identical: a snapshot of every line for Fixtures A–D over 60 days is taken before and compared after.
- **R5.** `packages/content/CLAUDE.md` describes where each kind of wording lives.

## Out of scope

Changing wording. Splitting `readings/day-guidance.ts` beyond what R3 needs — that happens naturally in ticket 10.

## Open questions

- [ ] None.
