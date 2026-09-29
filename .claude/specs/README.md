# Specs

All planned work is written here before it is built. `PLAN.md` / `PROGRESS.md` are
the pre-2026-09-29 history and are no longer updated.

## Milestones

| Milestone | Status |
| --- | --- |
| [M20 — Clarity](m20-clarity/README.md) | drafting — current |
| [M21 — Backend + accounts](m21-backend-accounts/README.md) | not started |
| [M22 — Subscriptions](m22-subscriptions/README.md) | not started |
| [M23 — Mobile](m23-mobile/README.md) | not started |

M21–M23 were M20–M22 in `PLAN.md`; renumbered on 2026-09-29 when M20 Clarity was put first.

## Layout

```
.claude/specs/
  flags.md                    live list of unverifiable engine values (CLAUDE.md non-negotiable)
  _templates/                 copy these to start a ticket
  m20-clarity/                one folder per milestone, numbered in execution order
    README.md                 goal, ticket order, status table
    01-fix-duplicated-glosses/
      requirements.md         what and why: problem, requirements, acceptance criteria
      design.md               how: approach, files touched, alternatives, risks, verification
      tasks.md                ordered checklist, each task traced to a requirement
```

- Milestone folder: `m<number>-<kebab-name>`. Numbers follow the order work actually happens.
- Ticket folder: `<two-digit order>-<kebab-name>`. Small: one reviewable change, a few commits at most.
- Every ticket has exactly the three files, even if one is short.

## Lifecycle

The status line at the top of `requirements.md` is the ticket's single source of status:

| Status | Meaning |
| --- | --- |
| `draft` | Written, not reviewed. Open questions may remain. |
| `approved` | Owner signed off on requirements **and** design. Only now may tasks start. |
| `in-progress` | Tasks being executed. |
| `done` | Every task checked with evidence; verification in design.md passed. |
| `dropped` | Not doing it; one line saying why stays in the file. |

Rules:

1. Requirements and design are approved by the owner before any task is executed.
2. Open questions live in `requirements.md` under **Open questions** until answered; answers are written back in place.
3. A task is checked only with a one-line evidence note (test run, commit, screenshot), same bar as the old PROGRESS.md.
4. If implementation diverges from the design, update `design.md` in the same commit — the spec describes what shipped.
5. Commit only on a green `pnpm verify`; UI tickets also need E2E green and a live-app check.
6. Decisions that outlive a ticket still go to the decisions log.
7. Work that isn't in a ticket gets one first — including a "small" change. A bug found mid-ticket either fits the current ticket's requirements or becomes a new ticket.

## Working with Claude

- `/spec new <milestone> <ticket-name>` — scaffold a ticket from the templates and draft it.
- `/spec status` — every milestone's tickets and their status.
- `/spec run <milestone>/<ticket>` — execute an `approved` ticket's tasks.

Subagents (`.claude/agents/`) are briefed with the ticket's path and report back by task number.
