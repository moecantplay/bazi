# Topic pages say enough to be worth the tap

Status: draft · Milestone: M20 · Ticket: 22

## Problem

Owner, 2026-10-05: "i think we're lacking of content. detail page for each topic are just single sentences."

The topic pages from [M20-21](../21-composed-daily-reading/requirements.md) R11 are where a Today card is meant to explain itself in full. In practice they repeat the card and add a sentence or two. Measured for Fixture A over 30 days (2026-10-05 → 2026-11-03), counting the words in For you today, How it tends to go, Working with it and the star lines (not the title, old name or name origin):

| Page | Words | What's actually there |
| --- | --- | --- |
| Your pace (`stage:*`) | 14–27 | For you today is the card's sentence again; one Working with it line; no How it tends to go at all |
| The day's element (`element:*`) | 32–44 | How it tends to go is the card's sentence again; one Working with it line |
| The day's character (`ten-god:*`) | 33–55 | For you today is the card's sentence again; one How sentence, one Working with it line |
| Hours (`hours`) | 56–57 | Two windows, one How sentence, two Working with it lines |
| Small signs (`stars`) | 7–51 | One short line per star |
| Sign links (`interaction:*`) | ~80–90 | Two How sentences, two Working with it lines (bank: `banks/topics/interactions.ts`) |

Three more gaps:

- **Nothing on the page is about the reader beyond the day's facts.** The pages don't use what the engine already knows about the chart: whether it runs strong or weak (`strength` fact), its element balance (`element-balance`), where the day sits in the twelve-stage cycle, or the day's other ten hours.
- **No line has a source.** The engine's tables each cite brief §11 or astronomy-engine, and anything unverifiable goes in `flags.md`. The wording is different: every meaning in `packages/content` ("Direct Wealth = steady work", "the Illness stage = half speed") was written by Claude from general BaZi knowledge, simplified, and never checked against a text or a practitioner (owner, 2026-10-05: "where are we getting the current content from?").
- **The longer writing that exists isn't used.** `read-more.ts` holds 3-paragraph dives for the five sign links, written before M20-21, and nothing renders them on a topic page.

Sources: `packages/content/src/readings/topic-page.ts`, `packages/content/src/banks/topics/day.ts`, `packages/content/src/banks/topics/interactions.ts`, `apps/web/src/components/topic/topic-page-view.tsx`.

## Goal

Every topic page reads as a short, useful article about this day for this reader: several paragraphs on how it tends to go, where it shows up, what it's good for, how to work with it, and parts drawn from the reader's own chart. None of it repeats the card the reader just tapped. Every meaning traces to a cited classical passage, and the wording changes with the combinations the engine already computes (owner chose "1 + 3", 2026-10-06).

## Requirements

- **R1. No repeats of the card.** A page never repeats its card's sentence word for word in any section.
  - Acceptance: a content test renders every topic page for Fixture A and the unknown-time fixture over 60 days. It fails if any page line equals the card line for the same topic and date.
- **R2. How it tends to go: 2–3 paragraphs.** Every page except Small signs has 2–3 paragraphs of 2–4 sentences each, covering how it tends to feel, what it makes easier or harder, and how it usually plays out over the day.
  - Acceptance: a bank test checks paragraph counts for every ten-god (10), element × tone (10), stage (12), sign link (5) and the hours page.
- **R3. Where it shows up.** Ten-god, element, stage and sign-link pages get a "Where it shows up" section with one line each for work, people and home. On a sign-link page, the line for the affected life area leads and is the longest.
  - Acceptance: a bank test confirms all three lines exist for every key. A test on a sign-link page confirms the affected area comes first.
- **R4. Good for / Hold off on.** Each ten-god, element, stage and sign-link page lists 2–3 things the topic is good for and 1–2 to hold off on, in everyday words. The lists are small, everyday acts only (VOICE rule 12): no medical, financial or legal directives.
  - Acceptance: a bank test checks the counts. The voice test (M20-21's R10 term list, plus the rule-12 list) passes on every item.
- **R5. Working with it: three steps.** Every page except Small signs has three concrete steps.
  - Acceptance: a bank test checks there are exactly three steps for every key.
- **R6. For you today is personal.**
  - Ten-god pages say how the day's character meets *this* chart, with separate wording for a chart that runs strong and one that runs weak (see R12).
  - Element pages keep their suits/against line and add what that means for the reader's balance.
  - Stage pages say where the reader is in the cycle: what came before and what comes next.
  - Sign-link pages keep their plain mechanics sentence.
  - Acceptance: presentation tests show that a strong chart and a weak chart get different For you today lines on the same ten-god day.
- **R7. Your chart on the page.** Each page shows one small visual of the reader's own chart, where one fits:
  - **Element:** the chart's five-element balance with today's element added and marked.
  - **Stage:** the twelve stages as an arc, today marked.
  - **Hours:** all twelve two-hour blocks, easy and rough marked. When the page is for today, the current block is marked too.
  - **Sign link:** the reader's four signs, with the one today's sign meets marked. For the unknown-time chart there are three signs.
  - Acceptance:
    - The visuals render in all three looks, light and dark.
    - Every referenced `var(--x)` is defined.
    - Contrast is measured on rendered text in both themes.
    - Unknown-time fixture: the sign-link visual shows three signs, not four.
- **R8. When it comes back.** Each page lists up to three upcoming dates in Today's range (±30 days) that carry the same topic key. Each date opens that day's topic page. When nothing recurs in range, the section is left out.
  - Acceptance: a presentation test confirms the dates are correct for Fixture A against a direct facts scan. E2E opens a recurrence link and lands on that date's topic page.
- **R9. Small signs, fuller.** Each star on the Small signs page gets a 2–3 sentence paragraph plus one step, instead of one line.
  - Acceptance: a bank test covers all 19 star keys.
- **R10. Length.** Measured as in the Problem table, every page except Small signs reaches 180–350 words. Small signs reaches at least 50 words per star listed.
  - Acceptance: a content test asserts the range over 60 days for both fixtures and prints min/max per page type into tasks.md.
- **R11. Voice.** Topic pages follow VOICE.md rule 11 as it stands for topic pages: the old name appears once, framed as a name; no system term stands alone; there's no fatalism, and the page closes on agency (Working with it before Where the name comes from).
  - Acceptance: the M20-21 voice test runs on every topic-page line. The owner reads Fixture A's pages for one week on device.

- **R12. The wording changes with the chart.** Where the classical source says a meaning depends on the chart, the page has a variant for each case:
  - **Ten-god pages:** For you today, How it tends to go, and Good for / Hold off on each have a strong-chart variant and a weak-chart variant (10 × 2).
  - **Element pages:** suits/against, as now (5 × 2).
  - **Sign-link pages:** Where it shows up, by the affected life area (5 × 4).
  - **Stages and small signs:** stay single entries unless their source gives a split.
  - Acceptance: a presentation test renders the same ten-god day for a strong fixture and a weak fixture, and the For you today, How and Good for sections differ.
- **R13. Every meaning cites its source.**
  - Each bank entry carries a `source` field (never rendered, like a term run's `han`) with:
    - the work and chapter;
    - the verbatim passage, or passages;
    - an English translation;
    - which page lines it supports;
    - anything dropped or reframed, and why: gendered readings (wealth as wives), and money, health or legal claims (VOICE rule 12).
  - One source per family:
    - *Zi Ping Zhen Quan* for the day's characters;
    - *San Ming Tong Hui* for stages and small signs;
    - *Di Tian Sui* or *San Ming Tong Hui* for sign links and elements, whichever covers the topic.
  - An entry with no source passage is listed in a new "Content without a source" section of `flags.md`, never silently shipped.
  - Passages come from public-domain full texts that allow reading; ctext.org is not used (its terms forbid scraping). The URL is recorded with each passage.
  - Acceptance:
    - A bank test fails if an entry has no `source` and isn't in `flags.md`.
    - A test confirms no `source` text reaches a rendered `TokenLine`.
    - Each family's translations are checked by a second reader before that family ships (see Open questions).

- **R14. Problem and remedy on the page (owner, 2026-10-10).**
  - Every topic page except Small signs gets a "Your sore spot and what eases it" section, from M20-23's `problem-remedy` and `remedy-day` facts, in plain words.
  - The section says whether today brings what eases your chart, presses on the sore spot, or neither. It closes on what the reader can do, never on an outcome.
  - Acceptance: on a day that brings a remedy and a day that brings the problem (Fixture A, found by the M20-23 daily fact), the section's wording differs. The voice test passes. The section is left out when the chart has no problem fact.
- **R15. Several styles, all original (owner, 2026-10-10: "use their style of interpretations as a variety").**
  - Each page mixes formats seen across other BaZi tools (2026-10-09 comparison), each written fresh:

    | Format | Seen in | On our page |
    | --- | --- | --- |
    | A one-line tagline ("Built slow. Stands long.") | BaZi Script's day-master profile | Under the title: a 2–6 word line per topic, per strong/weak |
    | Do / Hold lists | BaZi Wealth's daily play | Good for / Hold off on (R4; trial R13) |
    | Problem → remedy | fate-craft's classical analysis | R14 |
    | A "this is a description, not a prediction" note | Master Sean Chan | One closing line on every page, from a small rotating set |
    | Plain consequence → action | Ours (M20-21) | For you today and Working with it |

  - Formats, rhythms and section shapes can't be copyrighted, so those are borrowed. Their sentences are not: no line is a reworded version of another product's sentence. Classical passages are the only text we adapt, and those are cited (R13).
  - Acceptance:
    - A bank test checks that every topic has a tagline (strong and weak for ten-gods).
    - During writing, each family's lines are run against the comparison excerpts saved on 2026-10-09 with the existing four-word overlap helper (`fourGrams` in `test/plain-terms.ts`), and any shared four-word run is rewritten. The excerpts stay out of the repo; the result is noted in tasks.md per family.

## Out of scope

- Topic pages for cards on Ahead, You and People (the reshape's M24-11).
- Changing Today's first screen or its cards.
- New engine facts (for example, trine or harm hours). Everything comes from facts the engine already produces, plus M20-23's problem-and-remedy facts.
- Scores and lucky colours or directions (Eastern Fate's format). They're false precision and lean on "energy", which VOICE.md bans.
- New looks-specific layouts beyond rendering the new sections and visuals in each look.

## Open questions

- [ ] **Good for / Hold off on: written per topic, or taken from the day's activity chips?** Today already shows the day's Favors and Watch chips (`today-suits.ts`), so repeating them on every topic page would say the same thing five times a day. Recommended: written per topic (R4 as drafted). The preview the owner picked said "from the day's activities". Being tried on the trial as trial-build R13 (2026-10-05), written per topic.
- [ ] **Who checks the translations?** I can quote the classical text exactly; how I read it is the part that needs a second reader. Candidates: the owner, the source behind the master reading (Fixture A), or another practitioner. A family doesn't ship until its translations are checked.
- [ ] **Tagline register.** BaZi Script's taglines are about the person ("Built slow. Stands long."). Ours would be about the day for this person ("Steady wins it, with backup."). Recommended: day-focused, so a tagline never reads as a fixed verdict on who someone is.
- [ ] Approve requirements and design.
- [ ] Mockups of a ten-god page, a stage page and a sign-link page in Explorer, light and dark, before app code (CLAUDE.md "Mockups first"). The other two looks follow once the base is approved.
