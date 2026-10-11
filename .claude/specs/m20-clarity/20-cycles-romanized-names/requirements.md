# Cycles: romanized names carry their meaning

Status: dropped · Milestone: M20 · Ticket: 20

> Dropped 2026-10-10 ([M24-01](../../m24-reshape/01-decisions-and-foundation-specs/design.md)): Superseded by M24-07: Ahead uses no romanized names at all (D5).

## Problem

The Cycles decade carousel (2026-09-29, Fixture A) labels each luck pillar with pinyin only: "JǏ · MĂO", "GĒNG · …", beside element and animal icons. The standing English-only rule says romanized names appear only where no translation exists, always with the meaning beside them. An icon may not count as the meaning.

## Goal

Every romanized stem/branch on Cycles has its English meaning beside it, or is replaced by the English.

## Requirements

- **R1.** Decade cards show the English ("yin earth · rabbit") with pinyin secondary or removed.
  - Acceptance: grep of rendered Cycles text in all looks finds no pinyin without its English gloss.

## Out of scope

Chart's pillar columns (already glossed).

## Open questions

- [x] Keep pinyin as a secondary line, or drop it on Cycles? **Drop it**: the standing English-only rule allows romanized names only where no translation exists, and the stem/branch glosses exist (decided under the owner's approval, 2026-09-29).
