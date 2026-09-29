# Copy audit baseline

Status: draft · Milestone: M20 · Ticket: 02

## Problem

Repetition and wordiness were only visible because someone happened to read 60 days in a row. Nothing measures them, so a copy change can make things worse without anyone noticing.

## Goal

One command that measures how Today reads over time, with a committed baseline that later tickets are judged against.

## Requirements

- **R1.** `pnpm copy-audit` renders Today for Fixtures A–D across 90 consecutive days and reports:
  - unique-sentence ratio, overall and per section (headline, lines, dos, donts, guidance, agency)
  - the 25 most repeated sentences with counts
  - words per day (min / average / max)
  - em-dash count per day
  - within-day repeats: pairs of sentences on the same day that share a 4-word phrase
  - Acceptance: runs in under 10 seconds, prints a readable report, writes JSON.
- **R2.** The baseline is committed as `.claude/specs/m20-clarity/02-copy-audit-baseline/baseline.json` and summarised in this ticket.
  - Acceptance: file exists; summary table below filled in.
- **R3.** The audit reuses the real pipeline (`todayScreenModel`), not a copy of it.
  - Acceptance: no reading logic in the audit script.

## Out of scope

Pass/fail thresholds — each copy ticket (10, 12, 13) sets its own target against this baseline.

## Baseline (fill in when done)

| Metric | Fixture A | B | C | D |
| --- | --- | --- | --- | --- |
| Unique sentences | | | | |
| Words/day avg | | | | |
| Em-dashes/day avg | | | | |

## Open questions

- [ ] None.
