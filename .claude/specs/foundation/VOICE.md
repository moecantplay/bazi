# Daymaster — VOICE

Every user-facing line in this app obeys this document. When a line and this document disagree, the line is wrong.

## Register

Calm, precise, literary. A well-read friend who takes the system seriously but takes *you* more seriously. Never mystical fog, never horoscope-column cheer, never doom.

## Hard rules

1. **Second person.** The reading is about the reader. "You," not "the native," not "people with this chart."
2. **1–2 sentences per line.** A line is a complete thought, not an essay.
3. **Concrete imagery over abstraction.** The ten day-masters are things: mountain, ocean, lantern. Lean on them. "Energy" and "vibrations" are banned words; so are "the universe," "destiny," and "fate" used as agents.
4. **Zero fatalism.** Nothing is inevitable. The chart describes weather, not verdicts. Never "you will," "you can't," "this year is bad for you." Say what the pattern *tends* to do and hand the reader the wheel.
5. **No directives in regulated domains.** Never tell the reader to take, quit, buy, sell, invest, sue, marry, divorce, or medicate. Career/industry material is framed as *inclination* ("rooms you tend to do well in"), never instruction.
6. **Agency line.** Every daily reading ends with one concrete thing the reader can *do* today. Small, specific, doable before dinner: send the message, take the walk, reread the draft, say no once.
7. **Plain verbs, sentence case.** Buttons say what they do. No "Submit," no "Unleash your potential."
8. **Friction is information.** Clashes, punishments, and weak charts are described as textures with uses, not curses. A clash is movement; a weak day-master is a light pack.
9. **No hour-claims for unknown-time charts.** If the chart has three pillars, nothing may reference the hour pillar, the "hour palace," or anything derived from it.
10. **Chinese respectfully, translated immediately.** Characters appear (子午, 戊), always with the English right there. Never use Chinese as decoration or mystique.
11. **No term without a translation — the classic leads, the translation carries.** A system term — clash, combine, trine, punishment, harm, day-master, a ten-god name, luck pillar, strong/weak — never stands alone. In a full sentence the classical name opens the line, but only framed *as* a name — "The old calendars call today…", "the old name for this year's grain is…" — never as a bare subject that pretends the reader already knows it ("The year's theme is the Indirect Resource note…" is wrong). The same breath then delivers the modern understanding in full: a situation the reader has been in, not a four-word fragment ("The old calendars name this year Indirect Resource (偏印). In everyday terms, learning by your own strange route — hunches, side reading, answers that arrive in the shower."). The rule covers the system's *plumbing* too: a line never assumes the reader knows that every day and year carries one of the twelve animal signs, or that their chart holds signs in its palaces — that context lives one tap away in the glossary entry the line's caption links to (the entry opens with it), so the line itself stays compact and spends its words on the day. Name the source as "the old calendars" or "the old books", never "the classics". A reader meeting the word for the first time gets the meaning without looking anything up. Canonical short glosses live in `src/vocab.ts`; banks and UI captions draw from the same well so a term is always translated the same way.
12. **Layered guidance.** What a day suits arrives in two layers with different rules. The chip layer is scannable labels in the almanac tradition: "Favors" and "Watch" (never "avoid", "inauspicious", "bad luck"), each naming an activity in modern words with its classical category as the gloss (commitments 嫁娶, launches 開市). The prose layer stays weather (rule 4) — what the day's grain makes cheaper or costlier and why — and may close with a soft directive for a small, unregulated act: "sign the small thing today", "give the trip one more day". Postponement, never prohibition; rule 5 stands in full, so nothing directive about money, health, law, marriage, or divorce — a wedding *date* may be called favourable, the wedding itself is never advised. A Watch chip with no prose nearby explaining why is wrong. The agency line still ends every daily reading (rule 6).

## Calibration examples

Day-master card (戊, mountain) — this is the register:
> You are the mountain: slow to move, impossible to ignore. Your problem is never capacity. It is remembering you're allowed to choose what to carry.

Clash day:
> 子午 clash in your career palace — two schedules booked for the same hour, and something has to move. Send the message you've been sitting on.

Ten-god note (classic named first, translated in full):
> The old calendars call today an Eating God day (食神) — put plainly, making for the joy of it, cooking for friends rather than for a review.

Transit line (compact; the sign plumbing lives in the caption's glossary link):
> Today's sign, the 午 (horse), runs straight at the 子 (rat) in your chart's career palace — a clash, two schedules booked for the same hour.

Day-guidance pair (chip + prose, rule 12) — this is the register:
> **Favors** commitments 嫁娶 · launches 開市 — A 成 day, the almanac's "success" note: the day the month's work likes to come together. With your fire running warm too, say yes to the thing you've already half-decided.

Watch chip explained, soft directive (postponement, not prohibition):
> **Watch** moving 移徙 — Today's 戌 sits opposite your home palace — furniture-moving weather it isn't. The boxes will still be there tomorrow; let them wait a day.

Wrong (fatalistic, vague, third person): ~~"Natives with this configuration will face obstacles in relationships this year."~~
Wrong (directive): ~~"A favorable Metal day — a good time to invest."~~
Wrong (mystical filler): ~~"The universe is aligning your energies today."~~
Wrong (naked jargon): ~~"A punishment pattern crosses your roots and career palace."~~ — names the mechanic, translates nothing.
Wrong (verdict chip): ~~"Inauspicious for marriage"~~ — chips lean, they don't sentence.
Wrong (prohibition): ~~"Don't sign anything today."~~ — say "worth one more day" instead.

## Palace vocabulary

Year pillar = roots (family, origins, the world you came from). Month pillar = career palace (work, parents, the structures you operate in). Day branch = home palace (partnership, the inner room). Hour pillar = horizon (children, legacy, what you're building toward). Use these consistently.

## Disclaimer copy (verbatim, onboarding + settings)

> Daymaster is for reflection and entertainment, not advice. BaZi is a living tradition with many schools; this app implements one reading of it, with its assumptions documented. Nothing here predicts your future or diagnoses anything about you. You remain the author.
