# Convert all docs to specs

Status: done · Milestone: M20 · Ticket: 03

Approved 2026-09-29 by the owner in conversation ("let's convert all docs into a spec-driven manner"), with two decisions: past milestones get **full triplets**; DESIGN.md and VOICE.md become **foundation specs**. Replaces the earlier "Docs cleanup" draft of this ticket, which it fully covers.

## Problem

The project's knowledge is spread across formats that predate the spec workflow:

- `PLAN.md` / `PROGRESS.md` — milestones M0–M19 as plan bullets and evidence checklists.
- The decisions log — 54 KB inside the root `CLAUDE.md`, loaded into every session, much of it superseded.
- `DESIGN.md` (root) and `packages/content/VOICE.md` — living rules with no link to the work that shaped them.
- `docs/` — research notes, the roadmap discussion, M18 mockups, the Trail design-system source, a README screenshot.

## Goal

Everything lives under `.claude/specs/`: living rules as foundation specs, every past milestone as ticket triplets, sources kept verbatim so the reconstruction can be checked, and a short `CLAUDE.md`.

## Requirements

- **R1.** `DESIGN.md` and `VOICE.md` move to `.claude/specs/foundation/` (filenames kept so the ~50 in-code mentions stay correct), with a foundation README stating that every ticket must satisfy them and that they change only through a ticket.
  - Acceptance: files moved with `git mv`; no path reference to the old locations remains.
- **R2.** The Trail design-system source (`docs/design-system/`) moves to `.claude/specs/foundation/design-system/` and still runs.
  - Acceptance: `node .claude/specs/foundation/design-system/check.mjs` runs; token generator comments point at the new path.
- **R3.** Every past milestone (M0–M19, plus the unnumbered 2026-07-17 and post-cutover rounds) becomes a milestone folder of ticket triplets, status `done`.
  - Acceptance: one folder per milestone with a README; every PROGRESS.md checklist item and every decisions-log entry maps to a ticket.
- **R4.** Reconstructed specs contain only what the sources record. Each file names its sources; where a source records no rationale or alternative, the file says "not recorded" rather than inventing one.
  - Acceptance: every requirement and task in a reconstructed ticket traces to a PLAN/PROGRESS line, a decisions-log entry or a commit.
- **R5.** `PLAN.md`, `PROGRESS.md` and the full decisions log are kept verbatim in `.claude/specs/_sources/`.
- **R6.** `.claude/specs/decisions.md` indexes every decision (date, one line, ticket link); new decisions are added there.
- **R7.** Root `CLAUDE.md` holds only the project summary, workflow, non-negotiables and standing rules still in force (each linking its ticket); the decisions log is gone from it.
- **R8.** Research notes, the roadmap discussion and mockups move into the milestone that produced them (`research/` inside that milestone folder); the README screenshot moves with the ticket that captured it.
  - Acceptance: `docs/` is empty and removed.
- **R9.** Agents, skills, package CLAUDE.md files, README, M20–M23 specs and code comments point at the new paths.
  - Acceptance: grep for the old paths finds nothing outside `_sources/`.
- **R10.** `pnpm verify` green; the app's generated tokens unchanged.

## Out of scope

Changing the content of DESIGN.md or VOICE.md. Rewriting history: decisions are recorded as they were made, including ones later superseded (marked as such).

## Open questions

- [x] Past milestones: full triplets (owner, 2026-09-29).
- [x] DESIGN.md / VOICE.md: foundation specs (owner, 2026-09-29).
