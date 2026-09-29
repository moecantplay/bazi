# Discussion 2026-07-23 — rewrite, redesign, and the road to backend/mobile

Status: **APPROVED 2026-07-29** — owner adopted the full recommendation and sequencing
(design reset → web rebuild → backend/accounts → subscriptions → mobile, in that
order). Milestones M18–M22 in PLAN.md are the executable version of this document.
§5's remaining open questions (visual direction, designer budget, free/paid split,
privacy posture) are now M18/M20/M21 entry tasks rather than blockers to planning.
Trigger: product owner is unsatisfied with the app's look despite many design rounds,
is considering a full from-scratch rewrite, and has named the future roadmap:
backend, accounts, a subscription plan, and native iOS/Android apps.

Open questions for the owner are collected at the end — those are the actual
decisions to make before any of this starts.

---

## 1. The headline recommendation: rewrite the shell, keep the core

A full from-scratch rewrite is the wrong tool for this dissatisfaction, for one
reason: **the pain is visual, but the value is not.**

What this repo actually contains, by risk of rebuilding:

| Layer | What it is | Rebuild risk |
|---|---|---|
| `packages/bazi-engine` | 26 modules of calendrical/astronomical math, golden-fixture-tested, every table source-commented | **High.** This is months of correctness work. A rewrite re-risks the hardest part of the project to fix the easiest. |
| `packages/content` | Voice-tested line bank, glossary, read-more dives — three rounds of owner feedback baked into tested rules | **High.** The voice took real iteration to land; the tests encode taste that would have to be re-learned. |
| `apps/web` | The skin: components, layout, styling, localStorage glue | **Low.** This is the part the owner is unhappy with, and it was always the cheapest layer. |

So the honest version of "rewrite the whole project" is: **rebuild `apps/web`
from an empty directory** — which gives the genuine fresh-start feeling — while
importing engine, content, and the golden fixtures on day one. That is a real
rewrite of everything the owner can see, at a fraction of the risk.

One more reason a scratch rewrite won't fix the look on its own: the design
churn (M15 ruled-prose superseded by M16 Material within a day; hero rebuilt
twice; dark mode descoped then promoted the same day) was a *process* problem —
taste was discovered through shipped implementations instead of before them. A
rewrite that keeps the same process reproduces the same churn with less code.

## 2. The look: diagnosis and the design reset

### Why it reads as unsatisfying

The current UI is a compromise between two identities that each work alone:

1. The **ink / paper / seal / cinnabar** "old almanac" identity (the app's
   original soul — seal-only cinnabar, element hues, ink typography).
2. The **Material 3 Expressive** system adopted at M16 (tonal borderless cards,
   pill shapes, Figtree, springy motion).

Blends of two complete design systems tend to read as *neither* — "a restyled
template" rather than a designed object. Co-Star, the stated inspiration, works
precisely because it is ruthlessly one thing: stark, typography-led,
near-monochrome, almost no chrome. Our app currently has Material's bones
wearing the almanac's jewelry.

### The fix: pick ONE master identity

Three candidate directions, each a full commitment (the other identity survives
only as an accent):

- **A. Editorial / stark (Co-Star's actual lane).** Typography does all the
  work. Near-monochrome ink on paper, generous whitespace, no cards at all,
  the seal as the single mass of color in the entire app. Closest to the
  original inspiration; hardest to execute well because type is everything.
- **B. Full Material Expressive.** Commit completely: bold shape-shifting
  components, oversized type, dynamic color derived from the day's element
  (a Fire day tints the whole app, not just the hero). The seal simplifies
  into a logo. Most "modern app" of the three; least distinctive.
- **C. Modern almanac.** The ink/paper/cinnabar identity taken seriously as
  the *system*, not as decoration: paper texture, vertical rhythm, hairline
  rules as structure (deliberately reversing M16), red used the way a real
  almanac uses it. Most distinctive; risks feeling old if not handled with
  restraint.

### The process (this is the part that actually prevents churn)

Every design decision in this project that went through **mockup → on-device
screenshot → owner picks from 3** stuck on the first shipped version (glyph
treatments, hero, seal logo). Every decision that skipped it got rebuilt. So:

1. Owner collects 3–5 screenshots of apps whose *look* they genuinely love
   (any category — not just astrology apps). This is the cheapest, highest-value
   input the owner can provide.
2. Build the same Today screen as three full-fidelity throwaway HTML mockups,
   one per direction above (adjusted by the references).
3. Review **on-device**, owner picks one direction — no blending.
4. Rewrite DESIGN.md v2 from the winner: tokens, type ladder, radii, both
   themes, motion. Lock it.
5. Only then does app code change.

If budget exists, commissioning a visual identity from a designer is a
legitimate alternative to step 2–3 — the codebase is unusually well set up to
implement a spec exactly (token-driven CSS, no component library lock-in).

## 3. What the future roadmap changes architecturally

### 3.1 Backend + accounts → "local-only" becomes "local-first with sync"

**Keep the principle that readings are computed on-device.** The engine and
content are pure, deterministic TypeScript — a reading needs no server. The
backend's job is *identity, sync, and entitlements* — never reading
generation. This keeps infra cost near zero, keeps the app fully functional
offline, and means the free tier costs us nothing to serve.

- The state model migrates from scattered per-key localStorage
  (`daymaster.profile/people/streak/…`) to **one versioned document** synced to
  the server. The backup envelope (v1) is already exactly this shape — it
  becomes the sync payload. This is also the fix for the per-key migration
  sprawl, so do it once, for both reasons.
- Birth data (date, time, place) is **sensitive personal data**. Decide the
  privacy posture up front: encryption at rest, deletion = deletion, no resale,
  minimal analytics. Done properly this is a marketing point, not a burden.
- Likely stack, given what's already in place: Next.js stays (drop the static
  export for the app, or keep a static shell + API routes), Vercel for
  hosting (already deployed there), **Neon Postgres** for data (MCP already
  connected to this workspace), Auth.js / Clerk / Neon Auth for identity —
  pick when we get there, all three fit.
- Because the engine is pure TS, the exact same package runs server-side if we
  ever want server-rendered readings (share pages, email digests) — one
  codebase, no reimplementation.

### 3.2 Subscriptions

- **Accounts must land first** — entitlements live server-side or the paywall
  is a suggestion.
- The product question to answer before any code: **what is paid?** Natural
  split given the existing feature set: the daily reading stays free (it's the
  habit loop and costs nothing to serve); premium gates the *power* features —
  date finder, year/month horizons, multiple compare people, read-more deep
  dives, full almanac layer.
- Payments: **Stripe on web**. On iOS/Android, digital subscriptions are forced
  through IAP (Apple/Google rules), so plan on **RevenueCat** (or equivalent)
  as the cross-platform entitlement layer from the start rather than bolting
  it on. One entitlement record on our server; Stripe and the app stores are
  just sources that write to it.

### 3.3 Mobile (iOS + Android)

Three paths, honestly compared:

| Path | Cost | What you get | Verdict |
|---|---|---|---|
| PWA as-is | zero (done) | Installable, offline, iOS web push exists since 16.4 | Fine as the *current* state, but no App Store presence, weak discoverability — doesn't meet the stated goal |
| Capacitor wrap | low | The existing web UI in a store shell | Only worth it if speed-to-store beats everything. If the owner dislikes the look, shipping that look in a wrapper helps nothing |
| **Expo / React Native** | high (UI rebuilt in RN) | Real native feel, store presence, push | **Recommended when the time comes** |

The monorepo is already positioned for the Expo path — this is the payoff of
the "zero UI imports" rule: `bazi-engine` and `content` port to React Native
**unchanged**. The only unshareable layer is components. Which motivates the
one structural addition to make *during* the web rebuild, not after:

> **Extract a `packages/presentation` layer** — typed view-models (what the
> Today screen shows, what a pillar column contains, chip/board/gauge data) —
> so the eventual RN app shares engine + content + presentation and rebuilds
> only the component skin. This also fixes the current untested 23-file
> `apps/web/src/lib` sprawl, so it pays for itself even if mobile never ships.

### 3.4 Content register (from the 2026-07-23 rewrite discussion)

If `apps/web` is being rebuilt anyway, take the chance to make content emit
**structured tokens** (`{term, gloss, han}` runs) instead of prose containing
Han characters that gets regex-stripped at render time. Register becomes a
render decision; `stripHanCharacters`, the branchToken convention, and the
regex-based voice checks all get structurally simpler. This is the last of the
old Han-toggle debt.

## 4. Recommended sequencing

1. **Design reset** (references → 3 mockups → on-device pick → DESIGN.md v2).
   Fixes the actual pain. Nothing else starts until the direction is locked.
2. **The rewrite, scoped**: rebuild `apps/web` from empty against DESIGN.md v2,
   importing engine/content/fixtures day one. Fold in the structural items
   while every component is being touched anyway: `packages/presentation`,
   token-based content, single versioned store (sync-shaped).
3. **Backend + accounts**: local-first sync of the versioned document; privacy
   posture decided and written down.
4. **Subscriptions**: free/paid split decided as a product call; Stripe on
   web; entitlements server-side from day one.
5. **Mobile**: Expo app sharing engine/content/presentation; RevenueCat joins
   for IAP.

Each stage is independently shippable; nothing in 1–2 blocks on backend
decisions, and 3–5 build on the store/entitlement shapes that 2 puts in place.

## 5. Open questions for the owner (the real blockers)

1. **Visual direction**: A (editorial/stark), B (full Material), C (modern
   almanac) — or reference apps that point somewhere else? *(Blocks stage 1.)*
2. **Designer budget**: iterate with mockups as before, or commission an
   identity? *(Shapes stage 1.)*
3. **Free vs paid split**: does the proposed gate (daily reading free; finder,
   horizons, compare-people, deep dives paid) match the product vision?
   *(Blocks stage 4, worth deciding early — it can shape the redesign's
   information architecture.)*
4. **Priority order**: is mobile wanted before or after subscriptions?
   *(Reorders stages 4–5.)*
5. **Privacy posture**: is "your birth data is encrypted, deletable, never
   sold" a stance we commit to and market? *(Shapes stage 3.)*
