# Instrument is the default look

Status: draft · Milestone: M19.9 · Ticket: 13

## Problem

The owner wants Instrument as the default look instead of Explorer (owner, 2026-10-10: "also i want instrument to be the default look instead of explorer").

Today the default is Explorer (`trail`) everywhere a reader hasn't chosen:

- `apps/web/src/lib/store.ts:43`: `DEFAULT_LOOK = "trail"`. It is used by the empty store, by parsing an older document, and by the onboarding draft (`components/onboarding/draft.ts:32`), so the look step preselects Explorer.
- `apps/web/src/app/layout.tsx:79`: the server HTML carries `data-look={DEFAULT_LOOK}`. The pre-paint script stamps only `almanac` or `dial`, because a stored `trail` matched the default. **Once the default changes, a reader who chose Explorer would load in Instrument** unless the script also stamps `trail`.
- `foundation/DESIGN.md:12` says "Default `trail`".
- `src/lib/store-look.test.ts` (lines 26–63) and `e2e/look-preference.spec.ts` (lines 45–54) assert `trail` as the default.

A stored `look` can't tell a choice from the default: every save writes the whole store, so readers who never chose carry `look: "trail"` too. `lookPromptSeen` is the only signal. It is set by onboarding's look step or by answering the one-time note on Today (`store.ts:312`, `:327`).

## Goal

A reader who hasn't chosen a look sees Instrument. A reader who chose one keeps it, with no flash of another look on load.

## Requirements

- **R1. New readers get Instrument.**
  - `DEFAULT_LOOK` is `dial`, and the server HTML carries `data-look="dial"`.
  - The onboarding look step preselects Instrument.
  - Acceptance: a unit test checks that an empty store reads `dial`. E2E onboarding from empty lands on Today with `data-look="dial"`.
- **R2. A chosen look survives, with no flash.**
  - The pre-paint script stamps any valid stored look that isn't the default, including `trail`.
  - Acceptance: E2E seeds `look: "trail"` with `lookPromptSeen: true` and sees `data-look="trail"` at first parse, before hydration.
- **R3. Readers who never chose** follow the answer to the open question below.
  - Acceptance: a unit test covers the chosen behaviour for a store with `look: "trail"` and `lookPromptSeen: false`.
- **R4. Docs.**
  - DESIGN.md line 12 says "Default `dial`" (owner, 2026-10-10).
  - `decisions.md` gains a row.
  - Acceptance: both diffs exist.
- **R5. Ships to production on its own.**
  - Acceptance: `pnpm verify` green, full E2E in every look green, a live check of production after `vercel deploy --prod` (new profile → Instrument; a profile with Explorer chosen → Explorer).

## Out of scope

- Picking the permanent look and retiring the others ([12](../12-pick-the-permanent-look/requirements.md)).
- The order of the looks in the picker or in Settings.
- The trial branch, which is a reference only.

## Open questions

- [ ] **Readers who never chose a look** (`lookPromptSeen: false`, still on the old default). Choose one:
  - **(a) Move them to Instrument** (recommended). They never picked Explorer. They'll see the one-time look note on their next visit anyway, with Instrument shown as the current look, so the switch comes with an explanation.
  - **(b) Leave them on Explorer.** Only brand-new readers get Instrument.
- [ ] Approve this ticket (requirements and design).
