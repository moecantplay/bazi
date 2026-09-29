# Design — Convert all docs to specs

## Approach

1. **Foundation.** `git mv DESIGN.md packages/content/VOICE.md docs/design-system .claude/specs/foundation/`. Fix `check.mjs`'s relative `node_modules` path (two levels deeper). Foundation README.
2. **Sources.** `git mv PLAN.md PROGRESS.md` into `_sources/`; cut the decisions log out of `CLAUDE.md` verbatim into `_sources/decisions-log.md`.
3. **History.** Milestone folders, numbered as they were:

   | Folder | Covers |
   | --- | --- |
   | `m00-scaffold` … `m17-costar-restructure` | PLAN/PROGRESS M0–M17 |
   | `m17.5-english-first` | 2026-07-17 round (English-first, icons, Han removal, seal logo, bold hero) |
   | `m18-design-reset`, `m18.5-trail-rollout`, `m19-web-rebuild` | PLAN/PROGRESS M18–M19 |
   | `m19.5-post-launch` | 2026-08-06 → 2026-09-15 commits and decisions |

   Tickets follow PROGRESS.md's checklist items, merging trivial neighbours. Each file opens with `Reconstructed 2026-09-29 from: …`. Requirements are written from the plan bullet and what was delivered; acceptance criteria are the recorded evidence; design carries the matching decisions-log text (condensed, same facts); tasks are checked with PROGRESS's evidence notes.
4. **Index.** `decisions.md`: every log entry → date, one line, link, and "superseded by" where the log says so.
5. **CLAUDE.md.** Rewritten short: summary, workflow, non-negotiables, standing rules in force.
6. **Research.** Into `research/` of the milestone that produced it: almanac-flags → m13, costar-layout → m17, design-references + effects ×2 + mockups-m18 + roadmap discussion → m18. `screenshot-chart.png` → m07's README ticket.
7. **References.** Sweep paths; bare "DESIGN.md"/"VOICE.md" mentions stay valid because filenames are kept.

## Changes

| Area | Change |
| --- | --- |
| `.claude/specs/foundation/` | DESIGN.md, VOICE.md, design-system/, README |
| `.claude/specs/_sources/` | plan.md, progress.md, decisions-log.md |
| `.claude/specs/m00…m19.5/` | Reconstructed milestones |
| `.claude/specs/decisions.md` | Index |
| `CLAUDE.md`, README, agents, skill, package CLAUDE.md, code comments | Paths and content |

## Alternatives considered

- Milestone summaries instead of full triplets, and leaving history in place: offered; the owner chose full triplets.
- Renaming DESIGN.md to avoid confusion with tickets' `design.md`: would break ~50 in-code mentions for no gain.

## Risks

- Reconstruction drifting into invention. Mitigated by R4 and by keeping `_sources/` for checking.
- The M19 phase plan file referenced by PROGRESS (`~/.claude/plans/woolly-hugging-taco.md`) no longer exists; M19's design is reconstructed from PROGRESS and the decisions log only, and says so.

## Verification

Old-path grep clean; `check.mjs` runs; token generator output identical; `pnpm verify` green; spot-check 5 reconstructed tickets against `_sources/`.
