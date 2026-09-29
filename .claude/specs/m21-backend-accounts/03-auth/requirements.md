# Sign-up, sign-in, sign-out

Status: draft · Milestone: M21 · Ticket: 03

## Problem

No accounts exist.

## Goal

A user can create an account, sign in and sign out on web without losing local data.

## Requirements

- **R1.** Sign-up / sign-in / sign-out through the provider from 01.
- **R2.** Signing out leaves local data intact and the app fully usable.
  - Acceptance: E2E.
- **R3.** Signed-out users never see a blocking prompt; account entry lives in Settings.
- **R4.** Offline: the app shell and readings work with no network; auth screens say so plainly.
  - Acceptance: E2E with network disabled.

## Out of scope

Sync (04).

## Open questions

- [ ] None.
