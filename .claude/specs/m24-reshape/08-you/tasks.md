# Tasks — You

Check a task only with a one-line evidence note.

- [x] 1. Tests first: content (lead per stem, elements, colours, plain words), presentation (every fixture), E2E You spec (R1–R5) — you-reading.test.ts failed first (missing modules), then caught 3 portraits naming an element as a material (庚 "raw metal", 辛 "refined metal", 癸 "quiet water"), reworded in day-master.ts ("raw iron", "cut and polished", "fine and quiet"); you-screen.test.ts 5/5 fixtures; you.spec.ts
- [x] 2. Content: plain-reading module, You and colour banks, You builder; exports (R1–R4, R6) — readings/plain/plain-reading.ts, readings/you/you-reading.ts, banks/you/{you,portrait}.ts, banks/colours.ts; content tests 121/121
- [x] 3. Presentation: `you-screen.ts`, `colours.ts`; exports (R2–R4, R6) — you-screen.ts (elementSplit, youScreenFor, youElementsFor, youColoursFor), colours.ts
- [x] 4. Web: plain-reading components, You view, elements, colours, `/you/` page (R1–R5) — components/plain/plain-reading.tsx, components/you/*, app/you/page.tsx; no "trial" left in the touched paths
- [ ] 5. `pnpm verify`; full E2E in every look; screenshots light and dark; deploy; live check (R7)
