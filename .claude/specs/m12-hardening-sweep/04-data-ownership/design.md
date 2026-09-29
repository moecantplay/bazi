# Design — Data ownership: edit, backup, restore

Reconstructed 2026-09-29 from: `_sources/progress.md` §M12, `_sources/decisions-log.md` 2026-07-08 backup entry, commits `70d9e59`, `e8fcc73`. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Backup = versioned JSON envelope, the local-only substitute for an account.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/app/settings/edit/` | edit flow |
| `apps/web/src/lib/backup.ts` | backup |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

E2E.

## Decisions

- 2026-07-08 Backup JSON (versioned envelope, v1) is the local-only account substitute and carries profile + people + preferences; streak is deliberately excluded.
