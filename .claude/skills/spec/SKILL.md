---
name: spec
description: Daymaster's spec-driven workflow — scaffold a ticket, report milestone status, or execute an approved ticket under .claude/specs/. Use for "/spec new", "/spec status", "/spec run", or whenever the owner asks for new work that has no ticket yet.
---

# /spec

Conventions live in `.claude/specs/README.md` — read it first. This skill is how they're applied.

## `/spec new <milestone> <ticket-name>`

1. Resolve the milestone folder (`.claude/specs/m<n>-*`). If it doesn't exist, ask before creating a milestone — a new milestone is a roadmap decision.
2. Number the ticket after the highest existing one in that milestone; folder name `<nn>-<kebab-name>`.
3. Copy the three files from `.claude/specs/_templates/` and fill them in from what the owner asked plus what the code shows:
   - `requirements.md` — problem with real evidence (file paths, measured numbers, rendered output), numbered requirements each with an observable acceptance check, out of scope, open questions.
   - `design.md` — approach grounded in the actual files, alternatives with the reason they lost, risks, verification.
   - `tasks.md` — ordered, each task traced to R-numbers, verification last.
4. Status `draft`. Add the ticket to the milestone README's table.
5. Tell the owner what's open and what approval is needed. Do not start tasks.

## `/spec status`

For each milestone in `.claude/specs/`, list tickets with the status line from `requirements.md` and task progress (`checked/total` from `tasks.md`). Flag inconsistencies: a README table status that disagrees with the ticket, `done` with unchecked tasks, `in-progress` with no checked tasks, open questions on an `approved` ticket.

## `/spec run <milestone>/<ticket>`

1. Refuse unless status is `approved` or `in-progress`, and no open questions remain. Say what's missing.
2. Set status `in-progress` (ticket and milestone README).
3. Work the tasks in order. Delegate to the matching subagent where one fits (`engine-dev`, `content-writer`, `ui-dev`) and brief it with the ticket path and task numbers; `test-runner` for verification; `reviewer` with the ticket path before closing.
4. After each task: check it in `tasks.md` with a one-line evidence note. If the implementation differed from `design.md`, update the design in the same commit.
5. Anything found that no requirement covers: stop and propose a new ticket (or a requirement change for the owner to approve) — never absorb it silently.
6. When every task is checked and the design's verification passed (`pnpm verify`, E2E and a live-app check for UI work): set status `done`, update the milestone README, log any lasting decision, commit.
