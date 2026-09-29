# First run shows a reading before asking

Status: approved · Milestone: M20 · Ticket: 18

## Problem

A new visitor's first screen (2026-09-29, 390×844) is a bare "When were you born?" date field with six progress dots. Nothing says what Daymaster is or shows what a reading looks like before the app asks for birth date, time, city and sex. Readers arriving from a share link see the same.

## Goal

The first screen shows what the reader gets — a real sample of Today — and one clear action to get their own.

## Requirements

- **R1.** A welcome screen before the date step: name, one-line promise, a live sample Today (a fixed demo chart, today's date, rendered in the chosen default look), one primary action.
  - Acceptance: mockups in all three looks × both themes approved by the owner before code (standing rule).
- **R2.** VOICE.md holds; the disclaimer still precedes the reveal.
  - Acceptance: owner reads the copy.

## Out of scope

Changing the onboarding steps themselves.

## Open questions

- [x] Sample chart: an anonymous demo chart, or a well-known public figure's (risk: implies endorsement)? **Neither: today's own reading, with no person** (owner, 2026-09-29). The sample describes the day itself — its pillar, officer, easy and rough hours, what it suits — without natal interactions. The design must say which engine facts are chart-free, and whether content has lines for them without "you" as a chart holder (VOICE.md rule 1 still applies: the reader is "you").
