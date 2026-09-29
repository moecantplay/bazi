# Design — Fix duplicated glosses

## Approach

Make the display name the thing that renders, and make every term run supply one.

1. Redefine the run: `{ kind: "term"; term: string /* English display name */; gloss: string; han?: string }`.
2. Fix the constructors whose `term` is currently a character:
   - `branchTokenRuns`: `term: animal` ("horse"), `gloss`: the animal's short meaning or the animal again, `han: branch`.
   - `stemTokenRuns`: `term`: the stem's English name ("Yang Wood"), `han: stem`.
3. Renderer shows `term`: `TokenText` in `apps/web/src/components/token-text.tsx` and `plainGloss` in `packages/content/src/tokens.ts` (renamed `plainText`; call sites updated).
4. Walk the four broken builders and remove whatever the template now duplicates:
   - `banks/stars.ts` `starDayLine` / `natalStarLine`
   - `banks/stages.ts` `stageDayLine`
   - the ten-god "The old calendars call today …" frame
   - `day-guidance.ts` officer frames (`{officerTerm}` + `{officerGloss}`)
5. Add the render test (R3, R4) before the fix so it goes red first.

## Changes

| Area | Change |
| --- | --- |
| `packages/content/src/tokens.ts` | Run doc comment, `plainGloss` → `plainText` rendering `term` |
| `packages/content/src/vocab.ts` | `branchTokenRuns`, `stemTokenRuns` put the English name in `term` |
| `packages/content/src/banks/{stars,stages}.ts`, `day-guidance.ts`, ten-god frames | Remove duplicated gloss text |
| `apps/web/src/components/token-text.tsx` | Render `term` |
| `packages/content/test/rendered-lines.test.ts` | New: repeated-gloss and article checks |

## Alternatives considered

- **Keep rendering the gloss, delete the gloss text from templates.** Smaller diff, but loses the name ("the old calendars call today …" then has nothing to call it) and breaks the VOICE.md rule "open on the classical name, then translate it".
- **Add a per-run `display` flag.** Keeps both meanings alive; the ambiguity is the bug, so this only hides it.

## Risks

- Every fact tag and branch mention passes through the renderer; any constructor missed renders a character. The render test plus a Han-character check on all output catches it.
- E2E specs asserting exact text may need updates.

## Verification

- New render test red before, green after.
- `pnpm verify`, full E2E, live check of Today for three dates that hit a star, a stage and an officer line.
