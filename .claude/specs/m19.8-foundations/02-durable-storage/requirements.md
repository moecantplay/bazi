# Ask the browser to keep our data

Status: approved · Milestone: M19.8 · Ticket: 02

## Problem

The chart, saved people and journal live only in `localStorage` (`daymaster.store.v2`), and nothing asks the browser to protect them: `navigator.storage` is never referenced in `apps/web/src`. Under storage pressure every engine may evict "best-effort" site data, and the reader's first sign is onboarding asking for their birth date again.

Safari also deletes script-writable storage for sites that go unvisited for 7 days in a browser tab. Asking for persistence does not reliably lift that cap. Installing to the home screen does, and so will M21 sync. This ticket makes the cheap request; it doesn't claim to solve Safari.

## Goal

Once a chart exists, the app asks the browser to mark its storage persistent, quietly and at most once per load.

## Requirements

- **R1.** When a stored profile is present, the app calls `navigator.storage.persist()` unless `persisted()` already reports true. Browsers without the API are skipped silently.
  - Acceptance: unit tests on an injected storage manager — already persisted → no request; not persisted → one request; API absent → no throw.
- **R2.** The request never blocks rendering and never throws into the UI.
  - Acceptance: E2E spy confirms the call on a gated screen, and the screen renders.

## Out of scope

- UI telling the reader whether storage is persistent, or a stronger install prompt — both are UI changes, mockups first (candidate for M20).
- Safari's 7-day cap: install to home screen, or M21 sync.

## Open questions

None.
