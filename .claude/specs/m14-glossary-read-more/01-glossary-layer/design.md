# Design — Glossary layer

Reconstructed 2026-09-29 from: `_sources/progress.md` §M14, `_sources/decisions-log.md` 2026-07-13 glossary entry. Records only what those sources say; anything they don't record is marked "Not recorded."

## Approach

Keyed by topic so every line knows its explainer.

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/glossary.ts` | GLOSSARY |
| `apps/web` GlossarySheet, FactTag | UI |

## Alternatives considered

Not recorded.

## Risks

Not recorded.

## Verification

Glossary tests; glossary E2E.

## Decisions

- 2026-07-13 Glossary layer (owner: readings need more context): every fact-tag caption links to a plain-language explainer; GLOSSARY keyed by ReadingLine.topic.
