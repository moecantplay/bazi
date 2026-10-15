# Design — First week

## Approach

**State (R3, R4).** An additive field on the v2 store document, next to `journal` and `lookPromptSeen`:

```ts
/** The reader's first week on Today (M24-10). null = finished, or never started. */
firstWeek: {
  opened: string[];                // ISO dates Today was opened on, oldest first, at most 7
  noted: Partial<Record<IntroPart, string>>; // part → the ISO date its note showed
} | null;
```

- **Older documents.** They lack the field and the sanitiser reads them as `null`, so existing readers skip the week (R3). A malformed value also reads as `null`; it's never thrown on. The sanitiser drops bad dates and unknown parts, dedupes `opened` and caps it at seven, so a hand-edited backup can't stretch the week.
- **New readers.** Onboarding's save writes `{ opened: [], noted: {} }` alongside the profile. That's the only place a first week starts. Edit-birth doesn't touch the field, and delete-all clears the whole document as it does today.
- **Backups.** They carry the field in the same envelope, with no backup code change beyond the sanitiser.

**Choosing the note (R1, R2): pure, in presentation.** `packages/presentation/src/first-week.ts`:

- `IntroPart` is content's `FirstWeekPart` (`"hours" | "character" | "pace" | "element" | "also-today" | "small-signs" | "suits" | "colour" | "journal"`), with `INTRO_ORDER` fixing the order and `FIRST_WEEK_DAYS` = 7.
- `partsOnScreen(profile, dateISO, cards): IntroPart[]` maps card topics (`hours`, `ten-god:*`, `stage:*`, `element:*`, `interaction:*`, `stars`) to parts. Suits and the journal are always on screen for today; colour is on screen when `todayColourFor` returns a pick, as the card itself does.
- `firstWeekNote(state, todayISO, parts) → { part: IntroPart | null; day: number; next: FirstWeekState | null }`, where `day` is the opened day (1–7, 0 once finished) that the kicker and dots show:
  - It records `todayISO` in `opened` if it's new.
  - On the first opened day there's no note; the first-day banner covers it.
  - If a part was already noted on `todayISO`, that part shows again, so a reload gives the same answer. If its card has left the screen since (an edit to the birth details the same day), the note is dropped rather than pointing at nothing.
  - Otherwise, on opened days 2–7, the note goes to the first part in `INTRO_ORDER` that's in `parts` and not in `noted`, and it's recorded.
  - After the seventh opened day, `next` is `null` (finished).
  - `next` equals `state` when nothing changed, so the caller writes only on a change.
- Presentation stays IO-free, so the web layer owns the store write.

**Copy (R6): content.** `packages/content/src/banks/first-week.ts`: `FIRST_WEEK_NOTES: Record<FirstWeekPart, string>`, one or two plain sentences each, naming the part by its words on screen and where it sits ("below" for cards, "further down" for suits and colour, "near the bottom" for the journal). `firstWeekKicker(day)` gives "Your first week · day N". The part names are a content type (`FirstWeekPart`) because presentation depends on content, not the reverse; presentation's `IntroPart` is that type, so a part without a note fails to compile. Two drafts went to the owner side by side: one written in-thread, one written from scratch by the `content-writer` agent. The owner chose the agent's (2026-10-15), as written.

**Web (R1, R5).**

- `components/today/use-first-week-note.ts` is the note's own hook, so `use-today-screen.ts` stays as it was. While today is displayed (`offset === 0`), it reads the stored week, calls `firstWeekNote` with `partsOnScreen(profile, today, model.reading.cards)`, and writes `next` through `setFirstWeek` only when it changed. Browsing another date neither records an open nor shows a note.
- `components/today/first-week-note.tsx` renders the kicker, seven week dots (filled up to today, `aria-hidden`; the kicker already says the day) and the line, with `data-first-week={part}`. It renders nothing when `part` is null.
- **Style: a sunken speech bubble** (owner's pick of four, 2026-10-15: A raised card as first built, B sunken panel, C no container, D sunken bubble with progress). `.first-week-note` in `globals.css` fills with a 7% ink tint of the page instead of the cards' raised `--surface` and shadow, so it reads as a note about the cards rather than one of them. A rotated square tail at the bottom left points at the cards. The kicker's usual ink-soft measured 4.07:1 on that tint in light themes, so inside the note it moves 40% toward ink, which clears AA in every terrain. Tokens only, so both themes and every terrain follow with no `[data-theme]` rules of its own.
- Each of the three compositions places it right after `FirstDayBanner`, so its position matches across looks.
- The banner's own condition (`createdAt` date equals the displayed date) is unchanged. On day one the note is null by construction, so the two never show together.

**Opened day vs. the device zone.** `todayISO` is the device-zone date that Today already uses (`screen.today`), the same day the streak counts.

## Changes

| Area | Change |
| --- | --- |
| `apps/web/src/lib/store.ts` (R3, R4) | `firstWeek` field (`emptyStore` default `null`), read through the sanitiser in `peekStore`; `loadFirstWeek`, `setFirstWeek`; `saveOnboardingResult` starts a week, so onboarding's page needs no change. |
| `apps/web/src/lib/store-types.ts` (R3, R4) | `sanitizeFirstWeek`, next to the other validators. |
| `apps/web/src/lib/store-first-week.test.ts` (R3, R4) | Older documents, onboarding, edit-birth, null, malformed values, backup round-trip. |
| `packages/presentation/src/first-week.ts` + test (R1, R2) | `IntroPart`, `INTRO_ORDER`, `FIRST_WEEK_DAYS`, `FirstWeekState`, `startFirstWeek`, `partsOnScreen`, `firstWeekNote`. |
| `packages/content/src/banks/first-week.ts` + test (R6) | `FIRST_WEEK_NOTES`, `FirstWeekPart`, `firstWeekKicker`; the notes also join `allBankLines`, so the voice test covers them. |
| `apps/web/src/components/today/use-first-week-note.ts` (R1) | Computes the note, writes the state. |
| `apps/web/src/components/today/first-week-note.tsx` (R1, R5) | The note. |
| Three Today compositions (R5) | `<FirstWeekNote screen={screen} />` after `FirstDayBanner`. |
| `foundation/DESIGN.md` (R5) | One line under §Shared surfaces: the first-week note shares the banner's slot and style. |
| E2E `first-week.spec.ts` (R1–R3, R5) | A pinned clock walks Fixture A's week after onboarding: a three-day gap after day one, the element card missing on day 5 so Also today goes first, and nothing on day 8. Plus a same-day reload, the next day showing no note, all three looks on day 2 (the note above the cards), and a seeded old store with no note. |

## Alternatives considered

- **Stepping by `leadVisit` (the proposal's suggestion).** It has no per-reader history, so it can't tell a new reader from an old one (requirements §Problem).
- **Calendar days from `createdAt`, no new state.** Least code, but a reader who skips days misses notes, and you can't tell which parts were already introduced. That's open question 1; the design assumes opened days and drops to the `createdAt` version if you choose calendar days.
- **A line on each card.** It breaks Instrument's half tiles and needs a layout per look (open question 2).
- **A coach-mark tour on day one** (rejected in M20-11): it front-loads everything again.
- **A note on every new part the first time it appears.** That's five or more notes on day two. It's the same flood, one day later.

## Risks

- **A write on every Today mount in week one.** It only writes when `next` differs, so at most once a day for seven days.
- **Store shape change ahead of M21 sync.** It's additive and nullable like `journal`, and a second device inherits the same week. M21's payload picks it up with the rest.
- **Clock and zone edges.** A reader who travels across the date line could open "two days" in one sitting. That's harmless: it's one extra note, and the order still holds.
- **Pre-ship profiles under a week old** skip the week (their store has no field). That's accepted: the only readers affected made a chart in the last few days, and they still had the banner.

## Verification

- Presentation unit tests for `firstWeekNote` and `partsOnScreen`, written first, over Fixture A and the unknown-time fixture.
- Store tests for the sanitiser, backup round-trip and edit-birth.
- Content voice tests over `FIRST_WEEK_NOTES`.
- `pnpm verify`.
- E2E `first-week.spec.ts` plus full E2E in every look.
- The contrast check (`design-system/check.mjs`) with the note in its card set.
- Mockups of days 1, 2 and 5 in 3 looks × 2 themes, taken from the real static build before deploy (as in M24-13) rather than drawn separately; the four styles on day 2; then the week re-shot in the chosen style.
- The design-system card `components/first-week-note` (in `src/cards/app.mjs`) puts the note in the contrast check.
- Deploy, then a live check: onboard fresh (banner), and a seeded day-2 store (note).
