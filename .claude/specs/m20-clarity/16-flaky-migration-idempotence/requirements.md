# Flaky migration idempotence test

Status: draft · Milestone: M20 · Ticket: 16

## Problem

`apps/web/src/lib/store-migration.test.ts` › "is idempotent: a second call with an already-migrated store leaves it unchanged" fails intermittently. Seen 2026-09-29 during M19.9-03's `pnpm verify` (passed on rerun and 6/6 isolated runs):

```
-   "updatedAt": "2026-09-29T05:23:45.939Z",
+   "updatedAt": "2026-09-29T05:23:45.940Z",
```

`migrateLegacyStore` returns the document built from `emptyStore()` (its `updatedAt`), but `saveStore` writes a fresh `new Date()`, so the second call reads back a different timestamp whenever the two land in different milliseconds. The migration can hand its caller a document that differs from what's on disk.

## Goal

The first migration returns exactly what it saved, and the test is deterministic.

## Requirements

- **R1.** `migrateLegacyStore` returns the document as persisted (including `updatedAt`).
  - Acceptance: the idempotence test passes 200/200 in a loop, and with the clock pinned to tick between calls.

## Out of scope

Other `updatedAt` uses.

## Open questions

- [ ] None.
