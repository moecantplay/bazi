# Problem and remedy

Status: draft · Milestone: M20 · Ticket: 23

## Problem

Owner, 2026-10-10, after comparing other BaZi tools: "i think adding problem-and-remedy would also be nice."

The old books read a chart through its *problem* (病) and the *remedy* (藥) that removes it. The engine has no such fact. It knows which elements help a chart (`favorable`) and how strong the chart is (`strength`), but not what harms the helpful element, or what would fix that. So the app can't say "this is your chart's sore spot, and this is what eases it", and it can't say whether a day brings the remedy or presses on the problem.

The source passage, *Shen Feng Tong Kao* (神峰通考), 病藥說類第九, checked against [古詩文網](https://m.gushiwen.cn/guwen/bookv_ee4a433ffcc5.aspx) on 2026-10-10:

- 「何以為之病？原八字中原所害之神也；何以為之藥？如八字原有所害之字，而得一字以去之」: "What is the problem? The element in the chart that harms. What is the remedy? When the chart has a harming character and gains one that removes it."
- 「有病方為貴，無傷不是奇；格中如去病，財祿兩相隨。」: "Only a chart with a problem can be noble; one without harm is nothing special. If the problem is removed, prosperity follows."

fate-craft (2026-10-06) applies this rule to Fixture A and reports:
- **Problem:** earth, the helpful element, is wounded. Wood attacks it, and its root 戌 is clashed by 辰.
- **Remedies:** metal (cuts the wood) and fire (bridges wood into earth).

That's one external value to test against. It isn't a golden fixture.

## Goal

The engine reports each chart's problem and remedies, and for any date whether the day brings a remedy or presses on the problem. Content says both in plain words, with the source cited.

## Requirements

- **R1. A natal problem-and-remedy fact.**
  - `natalFacts` emits `{ kind: "problem-remedy"; problem: Element; wounds: Element; remedies: { element: Element; how: "controls" | "bridges" }[]; rootClash?: { branch: Branch; by: Branch } }`.
  - **wounds** is the chart's main helpful element.
  - **problem** is the element that controls it (五行相剋), when that element is present in the chart.
  - **remedies:** the element that controls the problem ("controls"), and the element the problem produces that in turn produces the helpful one ("bridges").
  - **rootClash:** when the helpful element's root branch is clashed inside the chart.
  - Tests are written first.
  - Acceptance: Fixture A gives problem wood, wounds earth, remedies metal (controls) and fire (bridges), rootClash 戌 by 辰, matching fate-craft's read. A chart where the problem element is absent emits no fact.
- **R2. A daily fact.** `dailyFacts` emits `{ kind: "remedy-day"; brings: "remedy" | "problem" }` when the day's stem or branch element is a remedy or the problem.
  - Acceptance: tests over 60 days for Fixture A agree with a direct element check.
- **R3. Sourced and flagged.**
  - The rule's tables carry a source comment citing *Shen Feng Tong Kao* 病藥說類第九.
  - Choices the source doesn't settle go in `flags.md`: using the main helpful element as the one wounded, and treating "bridges" as a remedy.
  - Acceptance: a source comment and a flags entry exist.
- **R4. Plain words.** The content bank gives the problem and each remedy in everyday words. "Your steady side gets pushed around by rush and sprawl; structure and warmth set it right" is the shape. The words "illness" and "medicine" are never used, and no outcome is promised: the verse's "prosperity follows" is dropped (VOICE: no fatalism, no financial claims).
  - Acceptance: the voice and plain-terms tests pass on every line.

- **R5. Periods too, said straight.** A `remedy-period` fact for each luck period and year says whether it brings a remedy, presses on the problem, or both. Content says it plainly, including when a period presses on the problem, and always pairs it with what prevents or reduces it (owner, 2026-10-10). The fact never names an outcome ("the problem flares"); it says what the period asks of the reader and what helps.
  - Acceptance: Fixture A's current period (己卯, wood) reads as pressing on the problem, with remedy wording. Tests cover every luck period of Fixture A.

## Out of scope

- Where it renders. Topic pages use it through [M20-22](../22-topic-page-depth/requirements.md) R14; the You screen and Cycles pick up R5 in the reshape's work.
- fate-craft's severity grading (how bad a problem is). There's no source rule for it yet.

## Open questions

- [x] Do we show the period-level read? Answered (owner, 2026-10-10): "we shouldn't hide anything bad if it's the truth. instead provide remedy to prevent and/or reduce." Yes, as R5: said plainly, always with the remedy.
- [ ] Approve requirements and design.
