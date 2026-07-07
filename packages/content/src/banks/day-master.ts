/**
 * Day-master archetype blocks, one per Heavenly Stem.
 *
 * Each block's first line is the defining image (always shown first in a
 * reading); the rest are supporting lines the selector draws from. Images are
 * fixed by the brief: 甲 tall tree · 乙 vine · 丙 sun · 丁 lantern · 戊 mountain ·
 * 己 garden soil · 庚 raw metal · 辛 jewel · 壬 ocean · 癸 rain.
 */

import type { Stem } from "@daymaster/bazi-engine";

export const DAY_MASTER_LINES: Record<Stem, readonly string[]> = {
  甲: [
    "You are the tall tree: you grow toward the light on a straight trunk, and you do not bend easily. That upward pull is your gift and your stubbornness both.",
    "A tree needs room and time. When you are crowded or rushed, you tend to feel it first in your shoulders.",
    "You lead by standing where others can see you, not by pushing. People find their bearings against your height.",
    "Your instinct is to keep climbing. It is worth asking, now and then, whether this is the light you actually want.",
    "Rigid looks like strength until the wind comes. Learning where to flex is the tree's longest lesson.",
    "You take root slowly and you leave slowly. Give yourself the seasons you need.",
  ],
  乙: [
    "You are the vine: you climb by finding what to hold, and you reach places a rigid tree never does. Flexibility is your whole method.",
    "You get there by going around. What looks like yielding is usually you choosing the longer, surer route.",
    "You need something to grow along — a person, a project, a structure. Choosing that support well is most of your work.",
    "You bend in weather that would snap others. People tend to underestimate how much of that is deliberate.",
    "Left with nothing to climb, you sprawl. A little scaffolding, and you cover the whole wall.",
    "Your strength is patient and lateral. Trust the slow green way you actually move.",
  ],
  丙: [
    "You are the sun: you warm a room without trying, and hiding has never come naturally to you. Your presence arrives before you do.",
    "You give light generously, sometimes at your own cost. Even the sun sets, and you are allowed to.",
    "People orient their day around your mood more than you know. That is a quiet responsibility.",
    "You run warm and bright, then need the dark to recover. Both halves are yours.",
    "You are made to be seen. The craft is choosing what you shine on.",
    "Your warmth is real, not performance. Let it fall on things worth growing.",
  ],
  丁: [
    "You are the lantern: a smaller, steadier flame that lights the room actually in front of you. You warm the few, not the many.",
    "You burn on something — a purpose, a person, a craft. Tended well, you last the whole night.",
    "Your light is intimate. People come close to you to see clearly, and you let them.",
    "Wind troubles you more than it troubles the sun. Guard your flame; it is smaller and more precise.",
    "You notice detail others miss because you light one corner at a time. That is a real form of care.",
    "You do not need to blaze to matter. A candle has kept whole vigils.",
  ],
  戊: [
    "You are the mountain: slow to move, impossible to ignore. Your problem is never capacity — it is remembering you're allowed to choose what to carry.",
    "People lean on you because you hold. Make sure some of the weight you carry is your own choosing.",
    "You change on a geological clock. What looks like stubbornness is often just your honest pace.",
    "You are the fixed point others navigate by. That is steadying for them and, sometimes, lonely for you.",
    "A mountain does not chase. Let things come to you; enough of them will.",
    "Your stillness is a strength most people never develop. Spend it on what deserves standing for.",
  ],
  己: [
    "You are the garden soil: quiet, fertile, the ground other things grow in. Your work is often visible only in what flourishes around you.",
    "You take in a great deal and make it usable. That patience feeds people who never see the labor.",
    "You adapt to whatever is planted in you. Choosing your plot with care matters more than you let on.",
    "Your generosity is close to the ground and practical. You nourish rather than dazzle.",
    "Overworked soil goes thin. Rest and replenishment are not indulgences for you; they are maintenance.",
    "You hold the whole garden together without announcing it. Notice your own hand in the harvest.",
  ],
  庚: [
    "You are raw metal: unrefined ore with an edge already in it. You are made to cut through, and you feel dull when you don't.",
    "You value directness and clean lines. Bluntness is your honesty, though it lands hard on softer ground.",
    "Pressure and heat are how you take shape. You often become yourself in difficulty, not comfort.",
    "You cut to the decision fast. Slow down just enough to be sure it is the right cut.",
    "Your strength wants a task worthy of it. Idle, metal rusts; used, it sharpens.",
    "You would rather be true than smooth. That is a rare and useful spine.",
  ],
  辛: [
    "You are the jewel: refined metal, cut and polished, valued for precision rather than force. You want things done well or not at all.",
    "You have taste and a low tolerance for the shoddy. That standard is a gift when you don't turn it on yourself.",
    "You shine under the right light and go cold under the wrong one. Setting matters to you.",
    "Small flaws catch your eye first. Aim that precision at the work, not at your own worth.",
    "You are worth more for being finished, not bigger. Refinement is your whole nature.",
    "You draw attention by clarity, not noise. Let the cut speak.",
  ],
  壬: [
    "You are the ocean: wide, deep, in constant motion, holding more than shows on the surface. Your reach is your nature.",
    "You move around obstacles rather than through them, and you always find the sea. Persistence is quiet in you.",
    "Your moods have tides. Learning to read your own weather saves everyone, you included, some storms.",
    "You carry depths others never glimpse. Not all of it needs to be shown to be real.",
    "You connect distant things — people, ideas, ports. That is the ocean's oldest job.",
    "Still water and storm are the same sea. Both belong to you.",
  ],
  癸: [
    "You are the rain: fine, quiet water that soaks in rather than floods. You work by patience and reach places force never touches.",
    "You nourish without spectacle. Whole fields depend on the soft, steady kind of giving you do.",
    "You sense shifts before others — a change of pressure, a mood in the room. Trust that early read.",
    "You are gentle and quietly relentless. Rain has worn down stone that resisted the hammer.",
    "You spread yourself thin when you fall everywhere at once. Aim, and you become a season instead of a drizzle.",
    "Your influence is subtle and lasting. Look for your mark in what quietly grew.",
  ],
};
