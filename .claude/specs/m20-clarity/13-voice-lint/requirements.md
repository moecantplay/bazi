# Voice rules the linter enforces

Status: draft · Milestone: M20 · Ticket: 13

## Problem

The copy reads as machine-written: 685 em-dashes in 60 days, a metaphor in nearly every sentence, fixed openers repeated daily ("Today's sign, the horse…", "The day sits at your…"), and "aimed, it cuts through; unaimed, it cuts whatever's near"-style contrast lines. VOICE.md has no rule against any of these, and nothing checks them.

## Goal

The habits that make copy read as generated are named in VOICE.md and fail a test.

## Requirements

- **R1.** VOICE.md gains a "Plain writing" section with concrete rules. Proposal:
  - at most one em-dash per line, and not in every line of a section
  - at most one metaphor or comparison per card
  - banned openers and stock phrases list
  - no "not X, but Y" / "X; un-X, Y" contrast constructions
  - sentences under ~25 words
- **R2.** A content test renders every bank entry and enforces each rule that can be checked mechanically.
  - Acceptance: fails on today's banks (establishing the gap ticket 14 closes); listed failures become ticket 14's worklist.
- **R3.** Rules that can't be checked mechanically (metaphor count) are review checklist items in VOICE.md.

## Out of scope

Fixing the failures (ticket 14).

## Open questions

- [ ] Approve the rule list, or edit it.
