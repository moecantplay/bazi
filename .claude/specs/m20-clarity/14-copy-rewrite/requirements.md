# Copy rewrite

Status: draft · Milestone: M20 · Ticket: 14

## Problem

After tickets 10, 12 and 13 the structure is right, but the words are still the current banks: too few entries for the repeat window, and failing the plain-writing rules.

## Goal

Banks large enough for the repeat window, passing every plain-writing rule, reading like a person wrote them.

## Requirements

- **R1.** Every bank on ticket 12's list reaches its minimum size.
- **R2.** Every ticket 13 rule passes; the `it.fails` markers are gone.
- **R3.** Every entry still passes the existing VOICE.md checks (no fatalism, agency line, rule 12, term glossed).
- **R4.** Copy-audit: unique-sentence ratio, words/day and em-dashes/day meet the targets set in tickets 10, 12, 13.
- **R5.** The owner reads a generated week for two fixtures and signs off.

## Out of scope

Structure changes.

## Open questions

- [ ] Is a human copywriter an option? Recommendation: yes for the core banks (headline, main idea, suggestions, agency — a few hundred short lines). Claude handles structure, coverage, checks and first drafts for the rest; copy written only by Claude is likely to keep reading as generated.
- [ ] Budget/timeline if yes.
