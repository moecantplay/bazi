# Today says each thing once

Status: dropped · Milestone: M20 · Ticket: 10

Dropped 2026-09-29: folded into [21 — Today reads as one written piece](../21-composed-daily-reading/requirements.md). A budget and fact ownership over the one-line-per-fact skeleton still leaves the six fixed shapes; 21 replaces the skeleton (owner approved the direction).

## Problem

Today renders about 400 words and repeats its main idea. On 2026-09-29 (Fixture A) "a clash, so something has to move" appears in the headline, the career line, a suggestion and a watch item. Today currently stacks: datebar, week strip, headline + legend tags, map hero, waypoint rail (6–7 lines with fact tags), signpost, journal, and a "Go deeper" fold holding trail signs, activity terrain and guidance.

## Goal

Each fact is spoken once on the screen, and the default view fits a short, fixed budget.

## Requirements

- **R1.** A content budget for the default (unfolded) Today view, agreed with the owner from the mockup: proposal — headline, the day's one main idea (2–3 sentences), at most one secondary note, one thing to do.
  - Acceptance: copy-audit words/day (default view) within the agreed budget for Fixtures A–D.
- **R2.** Each fact is used by at most one visible element; builders pick which element owns it.
  - Acceptance: a presentation test fails if two visible elements cite the same fact over 90 days × Fixtures A–D.
- **R3.** Everything else stays one tap away, not deleted.
- **R4.** Within-day repeats (copy-audit metric) drop to zero for the default view.
- **R5.** The layout is reviewed as an on-device mockup, both themes, before code (decisions log 2026-07-30).

## Out of scope

Rewording (ticket 14). First-run introduction (ticket 11).

## Open questions

- [ ] Budget and layout — decided from the mockup.
- [ ] Which elements survive by default: map hero? week strip? journal?
