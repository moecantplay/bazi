# Account deletion and export

Status: draft · Milestone: M21 · Ticket: 05

## Problem

Delete-my-data and backup export only know about local data.

## Goal

Deleting an account deletes it everywhere; export includes the server copy.

## Requirements

- **R1.** Delete account removes server rows and local data and lists what it erased.
  - Acceptance: E2E + database check.
- **R2.** Download-my-data includes the server copy when signed in.
- **R3.** Pre-M21 local profiles migrate untouched when the user first signs in.
  - Acceptance: E2E with a legacy store fixture.

## Out of scope

Admin tooling.

## Open questions

- [ ] None.
