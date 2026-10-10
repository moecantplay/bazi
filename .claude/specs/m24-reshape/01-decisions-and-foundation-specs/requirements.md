# Decisions and foundation specs

Status: approved · Milestone: M24 · Ticket: 01

## Problem

The owner approved the reshape and chose the full rebuild (2026-10-10), but nothing outside the proposal says so yet:

- `decisions.md` has no entry for D1–D6 or for what the trial added (R9–R17). Its last row is 2026-09-30.
- `foundation/DESIGN.md` still says every screen ships in all three looks and describes five tabs. Line 12 makes `trail` the default.
- `foundation/VOICE.md` keeps the plain-words rule (11) to Today. The reshape makes it app-wide. The trial also made two calls VOICE.md doesn't cover: element names as chip labels on You (trial R15), and "go easy on", never "avoid", for colours (R16).
- `CLAUDE.md`'s standing rules still say "every screen ships in all three [looks]".
- The M19.9 and M20 READMEs still list tickets the proposal drops, moves or folds in (§6 "What gets dropped"). `.claude/specs/README.md` has no M24 row.

Every later M24 ticket, starting with the mockups (02), is checked against these files, so they have to be right first.

## Goal

The decisions log, DESIGN.md, VOICE.md, CLAUDE.md and the roadmap READMEs describe the reshaped app, and the dropped or moved tickets point to where their work now lives.

## Requirements

- **R1. Decisions recorded.** `decisions.md` gains a row for each item below, each linked to the ticket that records it:
  - D1–D6 from the proposal (§5).
  - The full rebuild, with the trial as a never-merged reference.
  - What the trial settled as product direction: Ahead as Your seasons plus Plan something, with any year (R10–R12); Your elements and Your colours on You (R15, R16); Today's colour (R17).
  - Acceptance: each row exists and its link resolves.
- **R2. DESIGN.md.**
  - The four-tab layout: Today · Ahead · You · People, with Settings behind a header gear.
  - Looks apply to Today only. Every other screen is one base design, in both themes.
  - A colour swatch rule: real-colour swatches are allowed only small, with the colour named beside each, and never as a colour mass. The seal stays the only cinnabar mass.
  - The default look follows [M19.9-13](../../m19.9-looks/13-instrument-default-look/requirements.md).
  - Acceptance: a diff of DESIGN.md shows each change; no section still requires three looks for a screen other than Today.
- **R3. VOICE.md.**
  - Rule 11 (no system terms) applies to every screen, not just Today. Old names appear only on topic pages, with their meaning beside them.
  - The one exception: element names may label chips on You. Sentences never use them.
  - Colour advice says "go easy on", never "avoid", and pairs it with a fix.
  - Acceptance: a diff of VOICE.md shows each change. The rule numbers that other tickets cite are unchanged.
- **R4. CLAUDE.md standing rules.** The Design rule says looks apply to Today only, linking this ticket. Every other rule is untouched.
  - Acceptance: a diff of CLAUDE.md shows only that change.
- **R5. Roadmap bookkeeping.**
  - **M19.9 README:**
    - 06–10 are marked dropped, with the proposal's reason.
    - 11 points to M24-12.
    - 12 is deferred until M21-01 usage counts exist.
    - 13 (default look) is listed.
  - **M20 README:**
    - 04 is marked decided (D4).
    - 05–07 are folded into M24 screen tickets, 08 becomes M24-03, 11 becomes M24-10, and 12–14 become M24-11.
    - 15 moves to M23, 18 becomes M24-05, and 20 is superseded by M24-07.
    - The narrowed order from proposal §6 is written down.
  - **`.claude/specs/README.md`:** gains the M24 row, and the M19.9 and M20 rows reflect their new scope.
  - Acceptance: every ticket the proposal names has a status line or README note that agrees with this list.

## Out of scope

- Any code change. The default look itself is [M19.9-13](../../m19.9-looks/13-instrument-default-look/requirements.md).
- Mockups (ticket 02).
- VOICE.md's Chinese-character cleanup in rule 10 and the examples. It stays with the narrowed M20.
- Drafting tickets 02–12. Each is drafted after the ticket it depends on is approved.

## Open questions

- [x] D1, D3, D4, D5 and D6 were recommendations; only D2 was decided on 2026-10-05. Choosing the full rebuild suggests you accept them all as recommended. Confirm, or name any to change. **Answered: all accepted as recommended** (owner, 2026-10-10: "i accept all your recommendations").
- [x] Approve this ticket (requirements and design) so the decisions and spec edits can be written. **Approved** (owner, 2026-10-10).
