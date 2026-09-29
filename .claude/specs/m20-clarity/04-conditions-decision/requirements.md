# Conditions: keep or drop

Status: draft · Milestone: M20 · Ticket: 04

## Problem

`/conditions/` (shipped 2026-09-15) is a trial of Today with a weather app's rhythm, reachable only from Settings. The decision "keep as a second route, promote to Today, or drop" is still open, and tickets 05, 06 and 10 all change code it touches.

## Goal

A recorded decision, carried out, before the restructure starts.

## Requirements

- **R1.** The owner decides: keep, promote to Today, or drop.
- **R2.** If dropped: route, components, `conditions-screen.ts`, `condition-icon-paths.ts`, the Settings link, the E2E spec and their tests are removed; nothing else references them.
  - Acceptance: grep for `conditions` finds nothing outside git history.
- **R3.** If kept or promoted: the ideas carried into ticket 10/11's Today design are listed here, and the "Danger = rain" icon mapping is revisited (VOICE.md verdict concern noted 2026-09-15).
- **R4.** Decision logged in the decisions log.

## Out of scope

Building anything new for Conditions.

## Open questions

- [ ] Keep, promote, or drop? It overlaps heavily with what ticket 11 (first-time reader) will need: a glance hero, hours, days ahead. Recommendation: drop the route, carry its best idea (the hourly strip) into ticket 11's mockups.
