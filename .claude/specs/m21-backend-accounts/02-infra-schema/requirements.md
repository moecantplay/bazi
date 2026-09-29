# Infrastructure and schema

Status: draft · Milestone: M21 · Ticket: 02

## Problem

There is no server. Sync needs a database and staging and production environments.

## Goal

Neon Postgres with staging and production, and a schema for users, store documents and entitlements.

## Requirements

- **R1.** Schema: `users`, `store_documents` (versioned envelope, `updatedAt`), `entitlements` (shared with M22/M23).
  - Acceptance: migration files checked in; applied to staging.
- **R2.** Staging environment exists before production and is used by E2E.
- **R3.** Secrets never committed; `.env.example` lists every variable.
  - Acceptance: grep finds no secret in git.

## Out of scope

Auth wiring (03), sync logic (04).

## Open questions

- [ ] Migration tool (plain SQL files vs. an ORM's migrations)? Adding a dependency needs approval.
