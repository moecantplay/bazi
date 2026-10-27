/**
 * The element's sentence, said as its effect and never by name (VOICE.md rule
 * 13). "suits" follows a lead that grinds, or a quiet day that suits you;
 * "against" follows a lead that helps, or a quiet day against your grain. One
 * sentence each, so the body stays within three.
 */

import type { Element } from "@daymaster/bazi-engine";

export const MODIFIERS: Record<Element, { suits: readonly string[]; against: readonly string[] }> = {
  wood: {
    suits: ["Fresh starts [feel natural|suit you], so try one.", "You have room to [grow|stretch], so use it.", "New ideas [catch on|find their footing] quickly for you.", "Anything you begin has [a fair|a strong] chance of taking root."],
    against: ["Your to-do list may sprawl, so stick to one or two [items|tasks].", "Too many starts at once may scatter you.", "[Cap|Limit] the list at a few items; it grows fast.", "Your attention may [scatter|wander], so give it one job."],
  },
  fire: {
    suits: ["You make a [fine|warm] impression, which helps.", "Others warm to you, so speak up.", "You're easy to hear; use that.", "Your words carry warmth, and [others|listeners] notice."],
    against: ["Tempers may [flare|rise], so [breathe|pause] once and then answer.", "The air may feel heated; [slow down|ease off].", "Stay cool, even when it's easy not to.", "Irritation flares faster, yours included, so pause first."],
  },
  earth: {
    suits: ["You're steadier than usual, so you can answer [calmly|without heat].", "Your footing is solid, which makes this easier.", "You have [patience|calm] to spare.", "Others find you reassuring, and that steadies [the room|everyone]."],
    against: ["Everything may feel heavy, so move at your own pace.", "Progress may feel slow and stuck, and that's fine.", "Your load may feel heavier; [share|split] it.", "It may feel like wading through sand, so pace yourself."],
  },
  metal: {
    suits: ["You're thinking clearly, so choosing is easier.", "Decisions [feel lighter|are simpler] than usual.", "Your judgement is sharp; trust it.", "What [stays|lasts] and what goes is plain to you."],
    against: ["Edges feel sharper, so go gently.", "Words may land harder than meant; soften them.", "Criticism may sting more; [hold|treat] it lightly.", "Others may bristle more easily, so lead with [a kind word|kindness]."],
  },
  water: {
    suits: ["Words [arrive|land] easily for you.", "Conversations [flow|drift] your way.", "You're adaptable, so a change costs you less.", "You read the room well, so [listen first|hear others out], then answer."],
    against: ["Replies move slower than you'd like; give them room.", "Progress may [crawl|dawdle]; give it time.", "Arrangements may drift, so write them down."],
  },
};
