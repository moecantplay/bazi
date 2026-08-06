# Daymaster — PLAN

Milestone plan expanded from the project brief. Tasks get checked off in PROGRESS.md.

## M0 — Scaffold + tooling + state files
- pnpm monorepo: `apps/web` (Next.js 15, TS strict, Tailwind, static export), `packages/bazi-engine`, `packages/content`
- `pnpm verify` = typecheck + lint + unit tests + build (all packages)
- git init, conventional commits
- State files: PLAN.md, PROGRESS.md, CLAUDE.md
- Subagents in `.claude/agents/`: engine-dev, content-writer, ui-dev, reviewer, test-runner

## M1 — Engine core
- Types: Stem, Branch, Pillar, Chart, LuckPillar, EngineConfig
- Reference tables in `data/` (stems, branches, five tigers, five rats, hidden stems, combines/clashes/trines/punishments/harms) with source comments pointing at brief §11
- Solar-term generator (astronomy-engine): jié instants 1900–2100 → `data/solar-terms.json`; generator unit-tested against anchors (立春 1994 = Feb 4 ±1d, 大雪 1994 = Dec 7 ±1d, 立春 2026 = Feb 4 ±1d)
- `sexagenary`, `yearPillar` (Li Chun boundary), `monthPillar` (jié boundaries + Five Tigers), `dayPillar` (anchor 1949-10-01 = 甲子, lateZiHour config), `hourPillar` (Five Rats), `annualPillar`, `dailyPillar`
- trueSolarTime config (longitude offset + equation of time)
- Golden tests A–D written FIRST; unknown-time (hour: null) accepted

## M2 — Engine derived
- `hiddenStems`, `tenGods` (element relation × polarity; Chinese + English labels)
- `interactions` (six combines, six clashes, trines full/half, punishments, harms; reports involved palaces)
- `luckPillars` (direction rule, start age from days-to-jié ÷ 3, 8 pillars with Gregorian start years)
- `strength` heuristic (documented, constants file), `favorableElements` (climate-first)
- ReadingFact emission for content layer
- ≥15 extra fixtures (jié-edge ±2min, Feb 29, 23:00/01:00 exact, 11:59/12:00, unknown-time, backward luck)
- Coverage ≥90% lines

## M3 — Content
- VOICE.md first
- Line bank: ~120 natal + ~150 daily + luck-transition lines
- Deterministic selection seeded by hash(birth data + ISO date)
- Disclaimer copy
- Content layer does zero chart math (facts in, prose out)

## M4 — UI shell + onboarding + DESIGN.md
- DESIGN.md (ink & cinnabar tokens, type roles, layout, seal spec) → reviewer critique → implement
- App shell, routing, localStorage persistence
- Onboarding: date, time + unknown-time path, offline city picker (bundled dataset, cited source), sex, chart reveal
- Cinnabar seal component (deterministic from pillars)

## M5 — Chart + Today wired end-to-end
- Chart screen: pillar grid hero, day-master card, element balance viz, favorable elements, seal
- Today screen: daily reading, ±30-day nav, today's pillar + touched palaces

## M6 — Cycles + settings + polish
- Cycles: luck timeline, current decade highlighted, annual pillars
- Settings: late-Zi toggle, true-solar-time toggle, disclaimer, delete-my-data
- PWA: manifest + service worker, installable
- A11y/responsive pass (360px, focus, AA contrast)

## M7 — E2E + README + DoD audit
- 3 Playwright flows: onboarding→chart, chart→today→date-nav, settings toggles change output
- README (what/quickstart/architecture/doctrine/screenshot); clean-clone verify
- Re-run every DoD checkbox, fix, re-audit

## M8 (stretch) — Compare
- Second birth entry, two-chart interaction reading, local only

## M9 — Dark mode
- Extend DESIGN.md with a dark theme: dark-paper background tokens, ink/paper roles inverted via CSS variables, element hues re-tuned for AA contrast on dark, seal remains the only cinnabar mass in both themes
- Default from `prefers-color-scheme`, manual override toggle in Settings, persisted in localStorage
- Reviewer critique pass (same bar as M4: contrast, hue rules, seal-only cinnabar hold in dark)
- Extend Playwright settings flow: toggling theme changes rendering, zero console errors

## M15 — Design refinement pass (calm minimal; owner: unhappy with design/UI/layout)
- Revise DESIGN.md: four-register type ladder, captions-not-links, ruled-prose vs boxes surface system, forms spec, dark elevation rule, layout section matching the real app → reviewer critique
- Shared primitives: globals.css utilities, ReadingCard (ruled variant), FactTag (chevron metadata row), section kicker + column-rule, buttons/inputs/segmented control
- Today hierarchy: day-pillar hero, guidance prose grouped by fact tag (one officer block), neutral gauge rows behind disclosure, underline cleanup
- Forms: onboarding (in-flow action, no void), Compare form, Dates finder picker selected states + CJK wrap fix, disabled-button style
- Chart/Cycles/Settings polish + dark fill-not-border pass
- E2E selector updates, full verify, both-theme screenshot review, PROGRESS.md

## M16 — Material look-and-feel (owner: "like how Google works with their UI lately")
- DESIGN.md v3: tonal borderless containers both themes (--surface tint), gap separation, radius scale (24 cards / 28 sheets / 16 inputs / pill controls), segment-stack lists, Figtree replaces Fraunces+Inter with a bold scale, sentence-case section headers (ink column-rule retired), springier selection/sheet motion → reviewer critique
- Keep: ink/cinnabar palette, seal-only cinnabar, element hues, voice, layout order, a11y carve-outs (ink-soft control borders, ≥44px targets, pressed states)
- Implement app-wide: card/stack/chip primitives, parents to gaps, pill buttons + segmented pills, tint chips, week-strip pill cells, sheet slide-up
- Verify + E2E, both-theme screenshot review, PROGRESS/CLAUDE.md

## M10 — Plain-meaning voice pass
- New VOICE.md hard rule: no system term stands alone. Every mechanic named in user-facing copy (ten gods, clash/combine/trine/punishment/harm, palaces, day-master, strength) is immediately followed by a plain-life gloss — a metaphor or everyday situation the reader can recognize
- Central gloss map in `packages/content/src/vocab.ts` so the same term is always translated the same way across banks and screens
- Audit all banks + chart-screen labels against the rule; rewrite lines that cite a mechanic without translating it
- Chart screen: each fact tag (e.g. "Eating God", "Water trine") gets a one-line "what this means for you" description
- Selection stays deterministic (same hash inputs); voice tests updated for the new rule

## v2 arc (approved 2026-07-29): M18 design reset → M19 web rebuild → M20 backend/accounts → M21 subscriptions → M22 mobile
Rationale and diagnosis in docs/discussion-2026-07-23-rewrite-and-roadmap.md. Governing principles for the whole arc:
- Engine, content, and golden fixtures are KEPT — the rewrite is `apps/web` only.
- Readings are computed on-device forever. The backend is identity, sync, and entitlements — never reading generation.
- "Local-only" becomes "local-first": the app works fully offline and signed-out; an account adds sync and paid entitlements, it never gates the core.
- One visual identity, chosen before any app code changes. No blending of directions.

## M18 — Design reset (one identity, chosen on-device, locked in DESIGN.md v4)
- Owner inputs (entry gate): 3–5 screenshots of apps whose look the owner loves (any category); decide mockups-only vs commissioning a designer
- Three full-fidelity throwaway HTML mockups of the SAME Today screen, real Fixture A data, mobile-viewport: (A) editorial/stark — typography-led, near-monochrome, seal as the app's only color mass; (B) full Material Expressive — dynamic color from the day's element, seal simplified to logo; (C) modern almanac — ink/paper/cinnabar as the actual system; each adjusted by the owner's references
- Review ON-DEVICE (installed or served to the phone, both themes), owner picks ONE direction — no blending; runner-up ideas may be grafted only if the winner's system absorbs them without compromise
- DESIGN.md v4 rewritten from the winner: full token set (both themes, computed WCAG ratios like M9/M16), type ladder, radius/shape scale, motion spec, component inventory covering every existing screen, seal/cinnabar rule restated → reviewer critique loop (same bar as M4/M16)
- Mockups preserved under docs/mockups-m18/; decision + rejected directions logged in CLAUDE.md
- No app code changes in this milestone

## M18.5 — Trail rollout (owner choice, 2026-08-05: reskin apps/web in place rather than fold into M19 — see CLAUDE.md)
- Wave 1 — Foundations: Bricolage Grotesque + Space Mono fonts alongside Figtree; globals.css tokens replaced (terrain-ground × theme + data/signage hues + shape/shadow scale, generated from docs/design-system/src/tokens.mjs); `data-terrain` (day pillar's element) stamped pre-paint next to `data-theme`; shared primitives (button, field-input, segmented-control, segment-stack list, bottom sheet) restyled to DESIGN.md v4
- Wave 2 — Today rebuilt: datebar, elevation-profile week strip, headline hook + legend tags, map hero (replaces DayOrbit — per-day waypoint placement, not procedural terrain), waypoint-rail reading (replaces ruled-prose area sections), trail signs (replaces Favors/Watch board — copy becomes "Clear trail"/"Take it slow"), signpost + streak (replaces agency card), nav restyle
- Wave 3 — Chart/Cycles/Compare/Dates/Settings/Onboarding: component-level restyle only, same screen structure, no rail motif outside Today's reading
- Wave 4 — Verify: full pnpm verify, E2E updates for renamed sections, both-theme × all-5-terrain screenshot review, reviewer critique (M15/M16 bar), PROGRESS.md closeout

## M19 — Web rebuild (fresh `apps/web` against DESIGN.md v4; structural debt paid in the same pass)
- New `apps/web` started clean; engine + content + golden fixtures imported day one; old app stays deployed until parity
- New package `packages/presentation`: typed view-models (today screen model, pillar columns, board/gauge/finder rows, streak, share-card data) extracted from the old `apps/web/src/lib`, unit-tested — "no unit tests in web" becomes honest again
- Content emits structured token runs (`{text}` | `{term, gloss, han}`) instead of prose containing Han: one presenter decides register; `stripHanCharacters` + branchToken convention retired; voice rules (term-always-glossed) become structural tests, not regexes
- Single versioned store: ONE document (shape = backup envelope v2 = the future sync payload), one migration function ingesting every legacy `daymaster.*.v1` key; delete-my-data clears one thing
- Screen parity checklist before cutover: onboarding (incl. unknown time, city picker, restore), Today (hero, at-a-glance, areas, board, week strip, streak, agency), Chart, Cycles + horizons, Compare + people, Dates finder, Settings, glossary/read-more sheets, share card + link
- PWA re-established: manifest, generated SW precache pipeline, icon pipeline carried over
- E2E suite rebuilt against the new DOM (same flows + store-migration spec); both-theme 390px screenshot review; clean-clone `pnpm verify` green; Vercel cutover last

## M20 — Backend + accounts (local-first sync)
- Entry decisions: auth provider (Auth.js / Clerk / Neon Auth), hosting shape (Next.js off static export or hybrid static shell + API), privacy posture written down (encrypted at rest, deletion = deletion, no data resale, minimal analytics) — posture is user-facing copy, VOICE.md applies
- Infra: Neon Postgres; schema = users + store documents (versioned envelope) + entitlements; staging environment before production
- Sync: the M19 store document syncs whole-envelope (updatedAt last-write-wins to start); signed-out remains fully functional; sign-in uploads the local envelope, sign-out leaves local data intact
- Account lifecycle: sign-up/sign-in/sign-out, delete-account (server AND local, names everything it erases like M12), export stays (download-my-data now includes server copy)
- Offline PWA unbroken: SW + app shell still work with zero network; sync is opportunistic
- E2E: auth + sync round-trip (two "devices" via storage isolation), deletion, migration of a pre-M20 local profile

## M21 — Subscriptions (web first)
- Entry decision (product): free/paid split confirmed — proposal: daily reading + chart free forever; premium = date finder, year/month horizons, multiple compare people, read-more deep dives
- Stripe: checkout + customer portal; webhook → entitlement record server-side (single entitlements table M22 will reuse); client caches entitlement for offline grace
- Paywall UI in-voice: VOICE.md rules bind upsell copy (no fear, no "unlock your destiny" — plain words about what the features do); gated screens degrade gracefully, never dead-end
- Free tier must remain a complete product (the habit loop), not a crippled demo
- E2E: gate on/off rendering both ways; webhook-driven entitlement flip; existing-user grandfathering decision logged

## M22 — Mobile (Expo/React Native → App Store + Play Store)
- `apps/mobile` (Expo) in the monorepo sharing `bazi-engine` + `content` + `presentation` unchanged; only the component skin is RN-native, implementing DESIGN.md v4
- RevenueCat mapped onto the M21 entitlements record (Apple/Google IAP for subscriptions; Stripe stays web-only)
- Push notifications: daily-reading reminder via the M20 backend — supersedes the 2026-07-08 "push structurally out" decision; opt-in, quiet copy
- Screen parity with web (same checklist as M19) + native affordances: haptics on selection, native share sheet, app icons/splash from the icon pipeline
- Store readiness: App Store + Play listings, screenshots from the real app, privacy nutrition labels matching the M20 posture, review-guideline pass (entertainment framing + disclaimer surfaced — no medical/financial claims, consistent with VOICE.md)
- E2E: Maestro or Detox smoke flows (onboarding → today → paywall), both platforms built in CI
