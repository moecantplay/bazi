# Today for a first-time reader

Status: draft · Milestone: M20 · Ticket: 11

## Problem

A new user lands on Today straight after onboarding and meets the full vocabulary at once: day pillar, map, waypoints, fact tags, clash/combine/trine, palaces. Nothing is introduced; the glossary is there but only if you know to tap.

## Goal

A first-time reader understands what they are looking at on day one, and meets the deeper layers gradually.

## Requirements

- **R1.** Day one shows only the ticket-10 default view plus a one-line "how to read this" note that can be dismissed.
- **R2.** Deeper elements (map, fact tags, activity terrain) are introduced over the first few days, one at a time, each with a one-sentence explanation the first time it appears.
  - Acceptance: a stored first-seen date drives it; an E2E test walks days 1–5.
- **R3.** Returning users (existing profiles) skip the introduction.
- **R4.** The introduction state lives in the single store (sync-shaped), not a new localStorage key.
- **R5.** Reviewed as an on-device mockup first.

## Out of scope

Onboarding flow changes.

## Open questions

- [ ] Days-based reveal, or reveal on first tap into "More"? Mockup both.
- [ ] Does anything from Conditions (ticket 04) belong here, e.g. the hourly strip?
