# Store sync

Status: draft · Milestone: M21 · Ticket: 04

## Problem

Data lives on one device only.

## Goal

Signed-in devices converge on the same store document.

## Requirements

- **R1.** Whole-envelope sync, last-write-wins on `updatedAt`.
- **R2.** First sign-in uploads the local envelope; if the server has one, the user chooses which to keep (never silent overwrite).
  - Acceptance: E2E two devices.
- **R3.** The streak stays device-local (decisions log 2026-08-05, decision C).
- **R4.** Sync is opportunistic: failures never block the UI and retry later.

## Out of scope

Field-level merge.

## Open questions

- [ ] Is last-write-wins acceptable for the journal (two devices writing the same day)? Proposal: yes for v1, logged.
