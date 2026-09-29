# Stitch prompts — M18 design exploration (stitch.withgoogle.com)

v2 — rewritten after owner feedback: v1 over-specified (hexes, section order,
geometry), which makes Stitch redraw our existing mockups instead of exploring.
Stitch's standard: state what the app is, what the screen must communicate,
and the mood — let it design; steer with one-line follow-ups.

Workflow: run Level 1 two or three times and screenshot anything interesting
BEFORE running Level 2 — its unprompted instincts are the point. Bring
reactions (good or bad) back to Claude to feed round 3 of the HTML mockups.
Stitch output is ideation, not export — implementation stays in our stack with
the repo's real assets and voice.

---

## Level 1 — wide open (run first, multiple times)

Design the home screen of a mobile app called Daymaster. It gives one short
daily reading based on Chinese Four Pillars astrology, translated into plain,
warm, everyday English — no mysticism, no fortune-teller clichés. The screen
must communicate: today's date and its place in the week; the day's character
(today is a Wood day, "the dragon", a day that runs slightly against this
user's grain); a short headline reading; which activities the day favors
(paperwork, learning, big asks) and which it doesn't (moving, travel); a few
short reading paragraphs; and one gentle closing suggestion. Audience: young
adults who use Co-Star or wellness apps. Mood: calm, modern, trustworthy.

## Level 2 — mood-steered (one per direction; still no layout instructions)

### Compass
Same app and content. Explore a design where a diagram does the storytelling —
the five Chinese elements (Wood, Fire, Earth, Metal, Water) as a visual system
the user reads at a glance, with today and "you" marked on it. Soft pastel
palette, friendly and roundy, like a well-designed mood-tracking app.

### Daybreak
Same app and content. Explore a typography-led editorial design — like a
literary magazine made into an app. Almost no color, no cards; type and
whitespace carry everything. One serif headline moment.

### Sky
[Attach the Google Health screenshot as image reference.]
Same app and content. Explore this visual language — soft tinted background,
white rounded cards, gentle status chips — reinterpreted for a daily astrology
reading.

## Level 3 — steering follow-ups (one per message, react to its output)

- "More visual hierarchy — one element should clearly dominate the screen."
- "Explore a version where the week comes before the reading."
- "Less card-like, more editorial."
- "Show the same screen as a Fire day — how does the palette respond?"
- "Now a dark mode version."
- "The reading paragraphs feel buried — give them more presence."
- "Try the activities as something other than a list."

## Real copy (paste only when Stitch's invented text starts steering wrong)

- Headline: "The day runs crosswise. Movement, not misfortune."
- Context: "A Wood day over the dragon — it presses on your Earth, so
  beginnings feel effortful. Pace them rather than force them."
- Officer: "A Receive day — a gathering-in day, taking in what's owed and
  offered."
- Favors: Deals & paperwork · Learning · The big ask. Friction: Moving · Travel.
- Worth doing: "Make the overdue decision." / "Hand one task to the people who
  row with you." Worth postponing: "Aim first, then cut once." / "Hold new
  launches for a smoother day."
- Reading (Your roots): "A trine this year: the year's sign, the horse, joins
  the dog already in your chart's roots — three friends planning one surprise
  without a group chat. Support gathers in that room."
- Closing: "Call a family member you've been meaning to reach."

## Ground rules

- One screen per prompt; new screens (Chart, Cycles) get their own prompt.
- Don't feed it our palettes or layouts up front — that forecloses the
  exploration we're paying for. Constrain only after it has surprised us.
- Its astrology copy will drift mystical if left alone — swap in the real copy
  above the moment wording starts driving the design.
- Judge layout, hierarchy, and mood — not its approximated icons/diagrams;
  implementation uses the repo's traced assets.
