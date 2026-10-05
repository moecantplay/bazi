/**
 * Good for / Hold off on, per topic (reshape trial R13, from M20-22 R4):
 * what kinds of things the topic makes easier and which to put down for the
 * day. Small everyday acts only (VOICE.md rule 12), plain words, no system
 * terms. Written per topic, so each page says something Today's activity
 * chips don't.
 */

import type { Element, InteractionType } from "@daymaster/bazi-engine";

export interface TopicSuits {
  /** 2–3 items. */
  goodFor: readonly string[];
  /** 1–2 items. */
  holdOff: readonly string[];
}

export const TEN_GOD_SUITS: Record<string, TopicSuits> = {
  "Friend": {
    goodFor: ["Pairing up on a task you'd usually do alone", "Catching up with a friend or sibling", "Asking someone in your position how they handle it"],
    holdOff: ["Going it alone to prove a point"],
  },
  "Rob Wealth": {
    goodFor: ["A friendly game or race", "Saying plainly what you're after", "Agreeing who gets credit before you start"],
    holdOff: ["Keeping score with someone close", "Quietly competing for the same slot"],
  },
  "Eating God": {
    goodFor: ["Cooking something new", "Making or mending something with your hands", "A long meal with people you like"],
    holdOff: ["Turning a hobby into a to-do list"],
  },
  "Hurting Officer": {
    goodFor: ["Editing someone's draft", "Pitching a better way of doing something", "Working on a problem that's been stuck"],
    holdOff: ["Giving feedback in front of a group", "Replying to a message that annoyed you"],
  },
  "Indirect Wealth": {
    goodFor: ["Saying yes to an unplanned invitation", "Following up a lead you stumbled on", "Taking a different route home"],
    holdOff: ["Planning every hour of the day", "Turning down an offer before you've heard it out"],
  },
  "Direct Wealth": {
    goodFor: ["Finishing what's nearly done", "Routine tasks you've been dodging", "Keeping a promise exactly as made"],
    holdOff: ["Starting three new things at once", "Shortcuts you'd have to explain later"],
  },
  "Seven Killings": {
    goodFor: ["Doing the hardest task first", "Working to a firm deadline", "Standing your ground, calmly"],
    holdOff: ["Taking on every demand at once", "Picking a fight to let off steam"],
  },
  "Direct Officer": {
    goodFor: ["Doing things by the book", "Arriving on time, every time today", "Admin you've been putting off"],
    holdOff: ["Cutting corners", "Bending a rule you'd have to defend"],
  },
  "Indirect Resource": {
    goodFor: ["Reading something off-topic", "A walk to think", "Learning a skill by an odd route"],
    holdOff: ["Staring at a problem until it gives in", "Deciding before you've slept on it"],
  },
  "Direct Resource": {
    goodFor: ["Asking for advice", "Learning from someone more experienced", "Time with someone who looks out for you"],
    holdOff: ["Insisting on doing it all yourself"],
  },
};

/** By the day's element, then whether it suits the reader or works against them. */
export const ELEMENT_SUITS: Record<Element, { suits: TopicSuits; against: TopicSuits }> = {
  wood: {
    suits: { goodFor: ["Starting something new", "Sketching the first steps of a plan", "Meeting new people"], holdOff: ["Holding an idea back until it's perfect"] },
    against: { goodFor: ["Finishing one thing before starting another", "Trimming the to-do list"], holdOff: ["Signing up for new projects", "Spreading yourself thin"] },
  },
  fire: {
    suits: { goodFor: ["Presenting or sharing your work", "A social plan", "Speaking up in a meeting"], holdOff: ["Hiding in the background"] },
    against: { goodFor: ["Cooling off before you reply", "Quiet work on your own", "A slower evening"], holdOff: ["Heated debates", "Replying in the heat of the moment"] },
  },
  earth: {
    suits: { goodFor: ["Patient, steady tasks", "Sorting out the home", "Keeping to your routines"], holdOff: ["Chasing quick wins"] },
    against: { goodFor: ["A short list", "Light, easy tasks", "Moving at your own pace"], holdOff: ["Taking on someone else's load", "Heavy decisions"] },
  },
  metal: {
    suits: { goodFor: ["A decision you've been weighing", "Editing and cutting back", "Clearing out clutter"], holdOff: ["Going round in circles on a choice"] },
    against: { goodFor: ["A gentler tone in messages", "Listening before you answer", "Loose deadlines"], holdOff: ["Blunt criticism", "Cutting someone off mid-sentence"] },
  },
  water: {
    suits: { goodFor: ["Conversations and catch-ups", "Brainstorming", "Writing freely"], holdOff: ["Rigid plans with no room to move"] },
    against: { goodFor: ["Waiting on replies without chasing", "Tidying up loose ends", "A long walk to think"], holdOff: ["Pushing for a fast answer", "Deadlines you set yourself today"] },
  },
};

/** Your pace, by the stage's English name. */
export const STAGE_SUITS: Record<string, TopicSuits> = {
  "Growth": { goodFor: ["Trying something for the first time", "Small starts", "Asking beginner questions"], holdOff: ["Judging the new thing too early"] },
  "Bath": { goodFor: ["Choosing your company", "Quiet time to reset"], holdOff: ["Taking every opinion to heart", "Oversharing with people you've just met"] },
  "Coming of Age": { goodFor: ["Putting your name to something", "Speaking up when it counts", "Owning a decision"], holdOff: ["Waiting for permission you don't need"] },
  "Taking Office": { goodFor: ["Taking charge of a task", "Work that needs a steady hand", "Helping someone get unstuck"], holdOff: ["Hanging back when you're the right person"] },
  "Peak": { goodFor: ["Your most important task", "A bold ask", "Finishing strong"], holdOff: ["Filling every spare hour", "Promising tomorrow's effort too"] },
  "Decline": { goodFor: ["Wrapping things up", "Handing work over", "An earlier night"], holdOff: ["Launching something big", "Saying yes to more"] },
  "Illness": { goodFor: ["Cutting the list in half", "Easy tasks you can finish", "Asking for an extra day"], holdOff: ["Volunteering for more", "Big decisions you could make tomorrow"] },
  "Stillness": { goodFor: ["Waiting a day before deciding", "Listening more than talking", "Looking back over the week"], holdOff: ["Forcing a decision", "Rushing a reply"] },
  "Storage": { goodFor: ["Filing and sorting", "Putting things back where they belong", "Saving notes for later"], holdOff: ["Opening new threads"] },
  "Severance": { goodFor: ["Ending what's already over", "Clearing a drawer or an inbox", "A clean goodbye"], holdOff: ["Picking up what you just put down", "Reopening old arguments"] },
  "Conception": { goodFor: ["Writing ideas down", "Sketching plans", "Daydreaming on purpose"], holdOff: ["Announcing the idea before it's ready", "Asking for feedback too early"] },
  "Nurture": { goodFor: ["Tending a slow project", "Checking in on someone", "Small, steady habits"], holdOff: ["Digging up a plan to see if it's growing", "Comparing your pace with others"] },
};

/** A sign link, by interaction. */
export const INTERACTION_SUITS: Record<InteractionType, TopicSuits> = {
  "six-clash": {
    goodFor: ["Saying which of two plans moves", "Rescheduling early", "Ending something that's already over"],
    holdOff: ["Double-booking yourself", "Promising both sides you'll make it"],
  },
  punishment: {
    goodFor: ["Fixing a recurring problem at its cause", "Naming a pattern, calmly", "Trying a fresh routine"],
    holdOff: ["The old workaround", "The same argument in the same words"],
  },
  harm: {
    goodFor: ["A second read of important messages", "Asking the clarifying question", "Checking in before assuming"],
    holdOff: ["Reading tone into short replies", "Leaving small misunderstandings for later"],
  },
  "six-combine": {
    goodFor: ["The ask you've been saving", "Settling an agreement", "Making an introduction"],
    holdOff: ["Sitting on a message you mean to send", "Going it alone when help is offered"],
  },
  trine: {
    goodFor: ["Group plans", "Bringing in people already leaning your way", "Starting a shared project"],
    holdOff: ["Doing it all yourself", "Keeping your plans to yourself"],
  },
};
