/**
 * The element's sentence, said as its effect and never by name (VOICE.md rule
 * 13). "suits" follows a lead that grinds, or a quiet day that suits you;
 * "against" follows a lead that helps, or a quiet day against your grain. One
 * sentence each, so the body stays within three.
 */

import type { Element } from "@daymaster/bazi-engine";

export const MODIFIERS: Record<Element, { suits: readonly string[]; against: readonly string[] }> = {
  wood: {
    suits: ["Fresh starts come naturally today, so take one.", "You have room to grow today, so use it.", "New ideas take hold for you today."],
    against: ["Plans may sprawl a little today, so keep to one or two.", "Too many starts at once may scatter you today.", "Keep the list short today; it grows fast."],
  },
  fire: {
    suits: ["You come across well today, which helps.", "People warm to you today, so say it out loud.", "You're easy to hear today; use that."],
    against: ["Tempers may run warm today, so take a breath before answering.", "Things may feel a bit heated today; slow down.", "Keep your cool today, even when it's easy not to."],
  },
  earth: {
    suits: ["You're steadier than usual today, so you can answer without heat.", "Your footing is solid today, which makes this easier.", "Patience comes naturally to you today."],
    against: ["The day may feel heavy, so move at your own pace.", "Things may feel slow and stuck today, and that's fine.", "Your load may feel heavier today; share it."],
  },
  metal: {
    suits: ["You're thinking clearly today, so choosing is easier.", "Decisions come easier than usual today.", "Your judgement is sharp today; trust it."],
    against: ["Edges feel sharper today, so go gently.", "Words may land harder than meant today; soften them.", "Criticism may sting more today; take it lightly."],
  },
  water: {
    suits: ["Words come easily to you today.", "Conversations flow your way today.", "You're adaptable today, so a change costs you less."],
    against: ["Things move slower than you'd like today; give them room.", "Progress may feel slow today; give it time.", "Plans may drift today, so write them down."],
  },
};
