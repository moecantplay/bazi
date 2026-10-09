# Reshape trial build

Status: in-progress · Milestone: proposal (2026-10-05 reshape) · Ticket: trial-build

## Problem

The owner needs to use the reshaped app for a few days before approving the direction in [proposal.md](../proposal.md) (owner, 2026-10-05: "im going to have to use the app for a short period of time in order to make a decision"). The mockups on the [canvas](https://claude.ai/artifact/HVGR4EnLXf7qwv87TEJYjA) show one fixed day (2026-10-05) with draft text, so they can't show:

- whether Today, Ahead and You hold up as the date moves;
- whether five tabs becoming four, and a five-step onboarding, feel right in daily use;
- whether a plain lead reads well on screens other than Today.

The owner chose a throwaway trial build on a preview URL (2026-10-05). It reuses today's content rearranged, with plain wording only on each screen's lead, over a trial of a few days. The looks decision is already made: three looks on Today only (D2, 2026-10-05).

## Goal

The owner can install a preview of the reshaped app on their phone, use it with their own chart for a few days, and decide on the direction. Production and `main` stay untouched.

## Requirements

- **R1. Isolated.** The trial lives on branch `trial/reshape`, is never merged, and deploys as a Vercel **preview** of the existing `daymaster` project. Production (`daymaster-nu.vercel.app`) is untouched.
  - Acceptance: `main` has no trial commits; production's `last-modified` header is unchanged after the deploy; the preview URL serves the trial.
- **R2. Four tabs.** The bottom nav is Today · Ahead · You · People. Settings opens from a gear in each tab screen's header and returns with Back. Conditions is unreachable (its Settings entry removed). Find a day is reached from Ahead.
  - Acceptance: E2E: each tab and the gear navigate; no link to `/conditions/` remains.
- **R3. Value-first onboarding.**
  - A Welcome screen opens the flow. It says what Daymaster is and shows a chart-free sample of today: the day's character and the activities it suits.
  - Four gathering steps follow: date, time, city, then sex with a one-line reason and the verbatim disclaimer.
  - There is no look step and no chart reveal; onboarding lands on Today.
  - Acceptance: E2E completes onboarding in four steps after Welcome and lands on Today. The disclaimer text is unchanged and its checkbox gates the last step.
- **R4. Today, slimmed, in all three looks.**
  - No system terms in the header (drops "Yang Water · Rat Day").
  - Find a day and "How this reading works" leave Today.
  - On the first day after onboarding, a one-line portrait banner sits above the reading.
  - The composed reading is unchanged (M20-21).
  - Acceptance: Today renders in Explorer, Editorial and Instrument, light and dark. The first-day banner shows only on the date the profile was created.
- **R5. Ahead.**
  - One screen with a 10 days / Month / Year / Decade switch, showing one view at a time.
  - **10 days:** the ten-day strip (from Conditions' day model, in plain tone words) plus the Find a day entry.
  - **Month, Year and Decade** each show a plain lead (headline + body + one thing to try) built from that period's strongest fact. The period's other facts follow as cards, reusing existing wording.
  - Acceptance:
    - Every view renders for Fixture A and the unknown-time fixture.
    - A content test fails if a lead contains a system term (M20-21's R10 list).
    - The lead is deterministic, keyed by the period plus the chart.
- **R6. You.**
  - The day-master portrait as the lead, then plain cards: company/strength, balance, what suits you, rooms you tend to do well in, patterns, stars.
  - The current Chart screen moves, unchanged, behind "Your chart in full".
  - Acceptance: the You screen renders for every fixture. A content test fails if a card title or sentence contains a system term.
- **R7. People.**
  - Saved people are listed first, with an "Add someone" button that opens the existing form.
  - A selected person shows a plain pair lead (built from how the two day-masters relate), then the pair's facts as cards.
  - Acceptance: E2E adds a person and sees the pair reading. A content test checks the leads for system terms.
- **R8. Ships for use.**
  - The trial passes the gate below.
  - The owner gets the preview link plus a note on moving their chart: back up from production and restore on the preview. The preview is a separate site, so its storage starts empty.
  - Gate: `pnpm verify` green on the branch; E2E green for the flows changed in R2, R3 and R7; a live check of the preview.
  - Acceptance: `pnpm verify` output, E2E output, and the preview URL recorded in tasks.md.

- **R9. Ahead packs in more (amendment, owner 2026-10-05: "i feel like the Ahead page can pack in more content"; all four options chosen, built straight into the trial).**
  - **10 days:** each day in the strip opens Today on that date. "Coming up" lists the standout days of the next 30 (rough and good), each with that day's Today headline, and each opens Today on its date.
  - **Month:** pick any month of the year. The month's lead and cards, its three best and three bumpiest days (ranked by the day's summed activity leaning, the score behind Find a day) each with that day's headline, and a preview of next month.
  - **Year:** the year's lead and cards, then "Month by month" (each month's headline and tone; tap to read it), and a preview of next year.
  - **Decade:** pick any ten-year stretch. Its lead and cards, "Year by year" (each year's headline; tap to read it), and a preview of the next stretch, saying when it begins.
  - Acceptance: presentation tests build every new section for every fixture. The E2E Ahead spec opens a coming-up day on Today and reads a month from the year list. No new system terms (all headlines come from existing plain banks).

- **R10. Ahead is Seasons + Plan (rework, owner 2026-10-05: "now im losing the purpose of the Ahead page if we already can scrub through days on the Today page, rework the Ahead page"; chose "Seasons + Plan", tab keeps the name "Ahead"). Supersedes R9's single-day parts.**
  - **Plan something** (top): the ten activities as chips. Each opens Find a day with that activity chosen and the default window already searched (`/dates/?activity=<key>`). "Choose your own dates" opens it blank.
  - **Your seasons** (below): Month / Year / Decade, as in R9: month picker, month by month, year by year, next previews.
  - **Removed:** every single-day list (the ten-day strip, Coming up, best and bumpiest days). Days belong to Today, which already moves 30 days either way.
  - Acceptance: E2E: Ahead shows no day strip; a plan chip lands on Find a day with results showing; decade → year → month navigation works.

- **R11. Pick any year (owner, 2026-10-05: "would be great if users can select the Year").** Year view opens with a row of years, the reader's lifetime (birth year to 90 years on, inside 1900–2100), scrolled to the current one. Picking a year reads it; its months open that month of that year.
  - Acceptance: E2E picks a year from the row and reads it; no "next" preview past 2100.

- **R12. Seasons first, Plan last (owner, 2026-10-05: "let's push Plan to the bottom of Ahead page").** Ahead opens on Your seasons; Plan something closes the screen.
  - Acceptance: E2E: the seasons section comes before Plan something in the page.

- **R15. Your elements on You (owner, 2026-10-10: "i think its nice to show the person's element (favourable and non-favourable) on the You page"; chose named chips with a plain line beside each).**
  - A "Your elements" section on You, after the lead. **What helps you** lists the favourable elements in the engine's order, and **What wears you down** lists the rest. Each is a chip with the element's swatch and English name, and an everyday line beside it. One "Ease it" line closes the section and points back to the first helping element.
  - "Wears you down" means the elements the favourable set leaves out. It is the same strength rule read the other way: a weak day master is drained by output, wealth and control, and a strong one by more of itself and its resource. No new table.
  - This section replaces the "What feeds you" card. "Rooms you tend to do well in" stays.
  - **Amends R6:** element names may appear on You, as chip labels only. Every line stays plain, and Today is unchanged.
  - Acceptance: a content test checks that the lines name no system term, that the two lists split all five elements, and that the output is deterministic. A presentation test builds the section for every fixture. The E2E You check sees both headings. Light and dark are checked live.

- **R16. Colours on You (owner, 2026-10-10: "can we add favourable colours for the person to wear and/or add in their lives (and vice-versa for avoiding)"; chose its own card).**
  - A colours card follows Your elements. **Colours that suit you** lists colour chips for each helping element, and **Go easy on** lists them for each wearing element. One line says where colours apply (what you wear, your desk, your room), and one fix line follows the honest-news rule: "If you live in black, add one red thing: a scarf, a bag, a mug."
  - Colours per element:
    - The classical five colours, from the *Huangdi Neijing* (Suwen ch. 4, 金匱真言論): Wood green, Fire red, Earth yellow, Metal white, Water black.
    - At most two modern shades per element, from feng-shui convention. These have no classical source and are flagged in `flags.md`.
  - The card says "go easy on", never "avoid". The swatches are small (no colour mass, so the seal stays the only cinnabar mass), and each colour is named in words beside its swatch.
  - Acceptance:
    - A content test checks that each colour list follows the R15 split and that the lines name no system term.
    - A presentation test builds the card for every fixture.
    - The E2E You check sees both headings.
    - Light and dark are checked live.

- **R17. Today's colour (owner, 2026-10-10: "do you think its a good idea to add what colour is good to wear on the Today page?"; mockup https://claude.ai/artifact/9dwonc48gK716NiVKXzcs6; approved, owner 2026-10-10: "alright build it").**
  - One small card after What the day suits, the same in every look: a swatch, the colour's name, and one line.
  - **How the colour is picked:**
    - On a day whose element (the day stem's) helps you, the colour is that element's ("It matches the day. Wear it, or keep something pink close.").
    - On a day whose element wears you down, it is a helping element that steadies the day: one that keeps the day's element in check, else one the day's element feeds ("It keeps you steady today. A little goes far: a scarf, a mug, a pen.").
    - Every chart always has such a helper, so a day is never left without a colour.
    - The shade within the element follows hash(birth data + date).
  - Wording stays neutral, so it never contradicts the day's lead. It is never on the first screen, and no system terms are used. The steadying rule is interpretive and is flagged in `flags.md`.
  - Acceptance:
    - A presentation test checks every fixture has a colour on every day across a year.
    - A content test checks the lines name no system term.
    - The Today E2E sees the card in each look.
    - Light and dark are checked in all three looks.

## Out of scope

- Writing the full plain banks for Ahead, You and People (proposal M24-11). The trial writes only the leads in R5–R7.
- Topic pages for the new cards: cards on Ahead, You and People link to existing glossary or topic content where it exists, and otherwise don't link.
- Folder restructure, voice lint, no-repeat rotation, the quality gates and the M20 fixes.
- Deploying to production, merging, or changing any foundation spec. DESIGN.md and VOICE.md change only once the direction is approved.

## Open questions

- [x] Approve this ticket (requirements + design) so the build can start. **Approved** (owner, 2026-10-05: "i'll approve it for now because i will dictate based on the feel").
