/**
 * Symbolic star (神煞) lines. A star is a recurring motif in the chart, and
 * every line says three things plainly: what sits where (the fact), what the
 * star is in ordinary life (the gloss from vocab.ts), and how it tends to show
 * up. Never predictions (VOICE.md §4).
 */

import type { Palace } from "@daymaster/bazi-engine";
import type { DraftLine } from "../types.js";
import type { ContentRun, TokenLine } from "../tokens.js";
import { STAR_GLOSSES, palaceWord, transitWhen } from "../vocab.js";

/** Everything the builders need from a star / star-day fact. */
export interface StarInput {
  star: string;
  chinese: string;
  english: string;
}

/** How each star tends to show up — the "so what" after the gloss. */
const STAR_TEXTURES: Record<string, string> = {
  "tianyi-nobleman": "When you ask for help, it tends to actually arrive; asking is the skill worth practicing.",
  "tiande-virtue": "Rough patches tend to soften around you early — notice it, and pass it on.",
  "tiande-companion": "Kindness you extend has a way of circling back with interest.",
  "yuede-virtue": "People tend to give you the benefit of the doubt; spend it carefully.",
  "taiji-nobleman": "You do your best thinking one level deeper than the question you were asked.",
  "wenchang-scholar": "Reading, writing, and studying repay you faster than they repay most people.",
  "lushen-emolument": "Steady work tends to feed you reliably — you rarely need to gamble for your bread.",
  "jiangxing-general": "Responsibility finds you even when you don't raise your hand — decide on purpose whether to take it.",
  "huagai-canopy": "Time alone isn't loneliness for you — it's where your best work ripens.",
  "yima-travel-horse": "You think better in motion; a change of scene is a legitimate tool, not an escape.",
  "taohua-peach-blossom": "Attention comes easily; choosing what to do with it is the actual work.",
  "hongluan-phoenix": "Openings for connection appear more often than average — they still need you to say yes.",
  "tianxi-joy": "Small celebrations suit you; mark the minor wins instead of saving joy for the big ones.",
  "hongyan-charm": "First impressions run warm for you; let the second impression be earned too.",
  "yangren-blade": "Your decisiveness is real force — aimed, it cuts through; unaimed, it cuts whatever's near.",
  "feiren-flying-blade": "Speed is where your sharp edge slips; one breath before you act keeps it clean.",
  "zaisha-calamity": "Not a verdict — just a stretch of road worth taking slower and double-checking.",
  "sangmen-mourning": "Endings deserve a nod from you rather than a shrug; you close chapters well when you close them consciously.",
  "kongwang-void": "Plans anchored there benefit from a second anchor somewhere solid.",
};

const GENERIC_TEXTURE = "Read it as a motif your chart keeps returning to, not a fixed trait.";

/** Every star line fragment, for exhaustive voice checking. */
export const STAR_TEMPLATES: readonly string[] = [
  ...Object.values(STAR_TEXTURES),
  GENERIC_TEXTURE,
];

function glossFor(input: StarInput): string {
  return STAR_GLOSSES[input.star] ?? "a recurring motif of its own";
}

function textureFor(input: StarInput): string {
  return STAR_TEXTURES[input.star] ?? GENERIC_TEXTURE;
}

/** Structured equivalent of a star's citation: the star name as a term run. */
function starTermRun(input: StarInput): Extract<ContentRun, { kind: "term" }> {
  return { kind: "term", term: input.english, gloss: glossFor(input), han: input.chinese };
}

/** A natal star line: "The Scholar Star (文昌) sits in your career palace — …". */
export function natalStarLine(input: StarInput, palace: Palace): DraftLine {
  const gloss = glossFor(input);
  const texture = textureFor(input);
  const text = `The ${input.english} (${input.chinese}) sits in your ${palaceWord(palace)} — ${gloss}. ${texture}`;
  const runs: TokenLine = [
    { kind: "text", text: "The " },
    starTermRun(input),
    { kind: "text", text: ` sits in your ${palaceWord(palace)} — ${gloss}. ${texture}` },
  ];
  return {
    text,
    factTag: `${input.chinese} ${input.english} · ${palaceWord(palace)}`,
    factTagRuns: [starTermRun(input), { kind: "text", text: ` · ${palaceWord(palace)}` }],
    topic: `star:${input.star}`,
    runs,
  };
}

/** A daily star line: "Today lights your Peach Blossom (咸池) — …". */
export function starDayLine(input: StarInput, transitPalace: Palace): DraftLine {
  const when = transitWhen(transitPalace);
  const opener = when === "today" ? "Today lights" : "This year lights";
  const gloss = glossFor(input);
  const texture = textureFor(input);
  const text = `${opener} your ${input.english} (${input.chinese}) — ${gloss}. ${texture}`;
  const runs: TokenLine = [
    { kind: "text", text: `${opener} your ` },
    starTermRun(input),
    { kind: "text", text: ` — ${gloss}. ${texture}` },
  ];
  return {
    text,
    factTag: `${input.chinese} ${input.english} · ${when}`,
    factTagRuns: [starTermRun(input), { kind: "text", text: ` · ${when}` }],
    topic: `star:${input.star}`,
    runs,
  };
}
