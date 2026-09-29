# Daily reminder notifications

Status: draft · Milestone: M23 · Ticket: 03

## Problem

Push was structurally impossible without a backend (2026-07-08); M21 removes that blocker.

## Goal

An opt-in daily reminder with quiet copy.

## Requirements

- **R1.** Opt-in only, time chosen by the user.
- **R2.** Copy follows VOICE.md; never a teaser that implies a verdict.
- **R3.** Decisions log records that this supersedes 2026-07-08.

## Out of scope

Web push.

## Open questions

- [ ] Local scheduled notifications (no server) may be enough for a fixed daily reminder — prefer that unless content must come from the server.
