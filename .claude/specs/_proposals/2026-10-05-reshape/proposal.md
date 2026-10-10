# Reshape proposal — product, content delivery and roadmap

Status: approved · 2026-10-05, approved 2026-10-10 · Owner chose the full M24 rebuild (2026-10-10): the trial branch is a reference only, never merged, and each M24 ticket ships to production on its own. Carried out in [M24 — Reshape](../../m24-reshape/README.md).

Mockups: [canvas](https://claude.ai/artifact/HVGR4EnLXf7qwv87TEJYjA). The owner decides after using a trial build for a few days: [trial-build/](trial-build/requirements.md).

Owner brief: the roadmap is bloated; the product is still confusing for new users; how content is delivered, the UI/UX and the order of content should all be reworked. Keep the code. Sacred: VOICE.md, on-device/local-first, the spec workflow. Backend, subscriptions and mobile are not sacred.

Evidence: a scripted walk of the live build (`out/`, commit 6602522), Fixture A, 2026-10-05, 390×844, all routes in Explorer light, Today in every look and in dark. Screenshots and page text are in the session scratchpad (`audit/`).

---

## 1. What a new user meets today

| Step | What they see | Problem |
| --- | --- | --- |
| 1 | "When were you born?" and a bare date field | No promise, no sample. Nothing says what the app is (M20-18 is approved but not built). |
| 2–5 | Time, city, sex, disclaimer | Fine on their own. Sex isn't explained. |
| 6 | "Choose your look": three previews headed **"Yang Water · Rat Day"** | A design decision before any value, written in jargon. |
| 7 | "Here is your chart.": eight labels (*yang wood, dog, yang fire, rat…*) and no meaning | The reveal is the moment it should click. Instead it's a wall of terms. |
| 8 | Today | First real value, **seven screens in**. |

## 2. What's wrong, in order of how much it costs the reader

1. **Two voices.** M20-21 made Today plain, but every other screen still uses the old voice:
   - Cycles: "JǏ · MǍO" with no meaning beside it, "rat–rabbit punishment · career palace", and "The old calendars name this month…" three times on one screen. It also has a broken sentence: "insight from the odd angle **is the old name for** this year's grain". A translation is used where the name should be.
   - Chart: "Seven Killings", "Indirect Resource", "day-master", and a 90-word paragraph on strength checks. Stray glosses render as bare words: "doesn't feed your element **out of season**;" "hides inside your branches **rooted**;" "on your side **outnumbered**." These are leftovers from the Chinese-character removal (`vocab.ts:361`, `:384`).
   - Today's header still reads "YANG WATER · RAT DAY", which breaks VOICE rule 11.
2. **The app is ordered by the system, not by the reader's questions.** The tabs are Chart · Today · Cycles · Compare · Settings. Chart, the least useful screen day to day, sits first. Three more screens hide off the tabs: Find a day (from Today), Conditions (from Settings) and topic pages.
3. **Four ways to see Today.** There are three looks, plus Conditions as a "different rhythm" that reuses the same reading. That's a lot to explain to someone who doesn't yet know what a reading is.
4. **Today is still long.** It runs 2.6 screens and about 230 words. Under the composed reading come: map, four waypoint cards (five small signs), suits, ten activities, Find a day, How this reading works, feedback, a tomorrow line and a 7-day elevation strip. That's five "Read more" links competing for attention.
5. **Every period on Cycles has the same shape.** Decade, year and month each get the same three cards (ten-god, element, interaction): nine cards and about 460 words. This is the "inventory, not writing" problem M20-21 fixed on Today, repeated.
6. **Compare opens on an empty form.** It's a full tab that shows a blank form until you type in another person.

## 3. What's wrong with the roadmap

- **The looks trial can't produce its evidence.** M19.9-12 picks the permanent look from usage counts. But counts stay dormant until M21 self-hosts Umami (decision 2026-09-29, no paid services). So the trial would run through all of M19.9 and M20 with nothing to measure.
- **Seven M19.9 tickets would rebuild screens this proposal replaces.** That's about 5 screens × 3 looks × 2 themes of mockups and code for Chart, Cycles, Compare, Settings and Conditions as they are now.
- **M20 has 17 open tickets of mixed weight.** Three are big-bang folder refactors (05–07) placed ahead of user-facing work. Two were partly absorbed by M20-21 (12, 14). One belongs to M23 (15, Expo spike).
- **VOICE.md contradicts itself and CLAUDE.md.** Rule 10 and the calibration examples still show Chinese characters (子午, 戊) that M17.5-05 removed from the app.
- Nothing is pushed-and-pending (`main` = `origin/main`). M19.8-04 CI and M19.8-09 WebKit E2E are the only loose ends in M19.8.

---

## 4. The reshape

### Product in one line

**Daymaster tells you how today is likely to go and one thing to do about it, in plain words. Everything deeper is one tap away, never in the way.**

### One voice everywhere

Apply M20-21's pattern to every screen, not just Today:

- **Lead:** headline → 2–3 sentence body → one thing to do. Everyday words only.
- **Cards:** every other fact gets a plain title and one plain sentence.
- **Topic page:** the old name introduced once, then the mechanics, then where the name comes from.

Romanized names, ten-god names and palace words appear only on topic pages, with their meaning beside them. This retires M20-20 (romanized names on Cycles) by design rather than as a patch.

### Reorder the app around four questions

| Tab | The reader's question | Built from |
| --- | --- | --- |
| **Today** (home) | How's today, and what do I do? | Today, slimmed (below) |
| **Ahead** | What's coming? | Cycles + Find a day + Conditions' ten-day strip and hour list |
| **You** | Who am I in this system? | Chart, rewritten as a portrait. The pillar grid moves to a "Your chart in full" page. |
| **People** | How do I go with someone? | Compare, opening on saved people. Adding someone is one button, not the whole screen. |

Settings moves to a gear in the header: it's a place you visit, not a daily destination. Conditions is dropped (this settles M20-04). Its two useful pieces move to Today (hours) and Ahead (ten days).

**Ahead** reads at four zooms: next 10 days → this month → this year → this decade. Each zoom gets one lead and plain cards, not three identical cards. Find a day is a tool on this screen.

**You** opens with the portrait ("You are the mountain…"), then what suits you, what tends to trip you, and the rooms you do well in. All of it is plain, with each card leading to a topic page.

### Today, slimmed

- **First screen:** date, headline, the look's visual (map, page or dial), body, one thing to do. Same as now, minus the jargon header.
- **Below:** plain cards (unchanged from M20-21), What the day suits, feedback, the week strip.
- **Moved off Today:** Find a day (→ Ahead), How this reading works (→ shown on a reader's first days, then under You), the ten activities list (→ the suits topic page).

### A new user's path: value first, five steps instead of eight

1. **Welcome:** what Daymaster is, plus a live sample of today's reading with no chart (M20-18, already approved).
2. Birth date.
3. Time, with "I don't know" given equal weight.
4. City.
5. Sex, with one line on why it's asked. The disclaimer goes inline on this step, with the existing checkbox.

→ **Today, with a one-line portrait on top** ("You're the mountain. Here's your first day."). This replaces both the look step and the jargon reveal.

The look goes to Settings with a sensible default. A reader's first week shows a one-line intro above each new kind of card, stepped by visit count (M20-11, using the existing `lead-visit` counter).

---

## 5. Decisions only you can make

| # | Decision | My recommendation | Why |
| --- | --- | --- | --- |
| D1 | The four-tab order above (Today · Ahead · You · People, Settings in the header) | Yes | It matches the questions a reader brings, and puts the daily screen first. |
| D2 | **Looks.** (a) Pick one look now. (b) Keep three looks on Today only, with every other screen in the base design. (c) Keep the full trial. | **Decided: (b)** (owner, 2026-10-05) | Today keeps Explorer, Editorial and Instrument. Ahead, You, People, Settings and onboarding are built once, in the base design. |
| D3 | Remove the look step from onboarding | Yes: the look becomes a Settings choice ("Look for Today") | It saves a screen and a jargon preview before any value. Existing readers keep the one-time look note. |
| D4 | Drop Conditions | Yes | Its hours go to Today and its ten days to Ahead. It's a fourth way to see Today. |
| D5 | One voice app-wide (old names only on topic pages) | Yes | Today already proved the pattern. Two voices is the biggest source of confusion. |
| D6 | Usage counts before M21 | Leave dormant | There's no free host without a backend. Your read of the mockups is the evidence for now. |

---

## 6. New roadmap

Milestone numbers follow execution order. Tickets are listed by their origin so nothing is lost.

### M19.8 — Foundations (finish)
- 04 CI first GitHub run, 09 mobile WebKit E2E. Unchanged.

### M20 — Clarity, narrowed to "make the current app honest"
Short. Fixes and guards that apply whatever the reshape decides.
- **21** Composed daily reading: finish (in progress).
- **01** Duplicated glosses, widened to cover the stray Chart glosses ("out of season", "rooted", "outnumbered") and the broken Cycles "is the old name for" sentence.
- **New:** Today header in plain words (drop "Yang Water · Rat Day").
- **New:** VOICE.md cleanup: rule 10 and the examples drop characters to match M17.5-05.
- **09** Quality gates (undefined vars, rendered contrast). They guard every screen the reshape touches, so they go first.
- **16** Flaky migration test.
- **02** Copy audit baseline, widened to every screen, so the reshape has a before/after.

### M24 — Reshape (new; replaces the rest of M19.9 and M20)
1. **Decisions + foundation specs.** D1–D6 recorded. DESIGN.md: the four-tab IA; looks apply to Today only (D2), every other screen is one base design. VOICE.md: "one voice" rule app-wide.
2. **Mockups first.** Today in all three looks; Ahead, You, People, Settings, Welcome and onboarding in the base design; both themes, with real content for Fixture A and the unknown-time fixture. Owner sign-off.
3. **Fact scope types** (from M20-08). Ahead mixes day, month, year and decade facts, which is exactly where the two past scope bugs came from, so this goes first.
4. **Navigation + Settings in the header.** Conditions retired (M20-04 carried out).
5. **Welcome and five-step onboarding** (M20-18 + the look step removed).
6. **Today slimmed.**
7. **Ahead:** Cycles + Find a day + ten days. Four zooms, each composed. Supersedes M20-20.
8. **You:** Chart as a portrait, plus a "Your chart in full" page.
9. **People:** Compare with saved people first.
10. **First week** (M20-11).
11. **Words:** no-repeat rotation (M20-12), voice lint (M20-13) and copy rewrite (M20-14), now over every screen's banks.
12. **Retire the legacy Trail composition** (M19.9-11).

Folder restructure (M20-05/06/07): each screen's folder is reorganised when that screen is rebuilt, inside tickets 4–9, instead of in three big-bang moves beforehand.

### M21 Backend + accounts → M22 Subscriptions → M23 Mobile
- Order unchanged. **M21-01** stands up self-hosted usage counts first, so learning starts as early as possible.
- **M22-01** (free/paid split) is drafted against the new tabs. Today and You stay free (the existing rule). Ahead's deeper zooms and People are the natural candidates for paid.
- **M20-15** Expo spike moves to become M23-00.

### What gets dropped, and why
| Ticket | Disposition |
| --- | --- |
| M19.9-06 Chart, 07 Cycles, 08 Compare/Dates, 09 Settings/onboarding, 10 Conditions in three looks | Dropped: those screens are replaced in M24. |
| M19.9-12 Pick the permanent look | Deferred: whether Today keeps all three looks for good, or narrows to one, is settled once M21-01's usage counts exist. |
| M20-04 Conditions keep/drop | Decided (D4), carried out in M24-4. |
| M20-05/06/07 Restructure | Folded into M24 screen tickets. |
| M20-15 Expo spike | Moved to M23. |
| M20-20 Romanized names on Cycles | Superseded by M24-7. |

**Net:** 24 open tickets across M19.9 and M20 become 7 in M20 plus 12 in M24. The work moves from re-skinning today's screens three times over to building the right screens once.

---

## 7. What this does not change

- Readings are computed on-device. The signed-out app stays complete. The backend is only for identity, sync and entitlements.
- VOICE.md hard rules (no fatalism, no regulated directives, an agency line closes Today's first screen).
- Deterministic selection, the golden fixtures, the engine, the store shape (`daymaster.store.v2`) and the spec workflow.
- The seal as the only cinnabar mass, both themes as one design, and mockups before code.
