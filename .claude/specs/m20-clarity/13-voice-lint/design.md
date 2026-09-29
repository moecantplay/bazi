# Design — Voice rules the linter enforces

## Approach

- VOICE.md: new section, owner-approved wording.
- `content/test/plain-writing.test.ts`: renders every template (existing `collect.ts` gathers them) and checks em-dash count, banned phrase list, contrast-construction regexes, sentence length.
- Test starts as `it.fails` per rule with the current failure count recorded, so `pnpm verify` stays green; ticket 14 flips each to a passing `it` as the rewrite lands.

## Changes

| Area | Change |
| --- | --- |
| `packages/content/VOICE.md` | Plain-writing section |
| `packages/content/test/plain-writing.test.ts` | New |

## Alternatives considered

- A prose linter dependency (e.g. write-good): generic rules, not ours.

## Risks

Regex rules over-match; each has an allow-list with a reason.

## Verification

Test counts match a manual spot check of 20 entries.
