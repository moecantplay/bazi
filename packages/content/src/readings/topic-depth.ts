/**
 * M20-26: the fuller topic page. Adds what the chart context
 * makes possible (sore spot, a drawing of the chart, dates it comes back)
 * and, where a topic has been written out, its fuller wording. Phrases the
 * context presentation computed; does no chart math.
 */

import { LIFE_STAGES, type DayFact } from "@daymaster/bazi-engine";
import { textRun } from "../tokens.js";
import type { TopicContext, TopicPage, TopicSore, TopicVisual } from "../types.js";
import { BRANCH_ANIMALS } from "../vocab.js";
import { INTERACTION_TOPICS } from "../banks/topics/interactions.js";
import { CLASH_ALREADY_IN_CHART, SORE_SPOT_WORDS, SORE_STATUS_LABEL, STAGE_STEPS, TOPIC_DEPTH } from "../banks/topics/depth.js";
import { interactionTopic, rankTransits, type TransitFact } from "./daily/lead.js";
import { lifeAreaOf, type LifeArea } from "./daily/life-areas.js";

const AREA_LABEL: Record<LifeArea, string> = {
  family: "Family",
  work: "Work",
  home: "Home & partner",
  plans: "Long-term plans",
};

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function soreFor(context: TopicContext): TopicSore | null {
  const sore = context.sore;
  if (sore === null) {
    return null;
  }
  const problem = SORE_SPOT_WORDS[sore.problem];
  const [first, second] = sore.remedies.map((element) => SORE_SPOT_WORDS[element]);
  const easing = sore.easing ? SORE_SPOT_WORDS[sore.easing] : first;
  if (!first || !easing) {
    return null;
  }
  const bodies = {
    neither: `Your chart's sore spot is ${problem.problem}. ${first.remedyChip} and ${lowerFirst(second?.remedyChip ?? first.remedyChip)} set it right. Today brings neither on its own, so make some yourself: ${first.action}.`,
    eases: `Your chart's sore spot is ${problem.problem}. Today brings ${lowerFirst(easing.remedyChip)}, which helps. Use it: ${easing.action}.`,
    presses: `Today presses on your sore spot: ${problem.problem}. Staying steady may take more than usual. What helps: ${first.action}.`,
    both: `Today presses on your sore spot, ${problem.problem}, and also brings ${lowerFirst(easing.remedyChip)}, which helps. Use the second to handle the first: ${easing.action}.`,
  };
  return {
    status: sore.status,
    statusLabel: SORE_STATUS_LABEL[sore.status],
    problem: problem.problemChip,
    remedies: sore.remedies.map((element) => SORE_SPOT_WORDS[element].remedyChip),
    body: textRun(bodies[sore.status]),
  };
}

function stageArc(topic: string, context: TopicContext): TopicVisual | null {
  const english = topic.slice("stage:".length);
  if (!context.stageNeighbours || !STAGE_STEPS[english]) {
    return null;
  }
  const label = (name: string) => STAGE_STEPS[name]?.label ?? name;
  return {
    kind: "stage-arc",
    steps: LIFE_STAGES.map((stage) => ({ ...(STAGE_STEPS[stage.english] ?? { label: stage.english, height: 40 }), today: stage.english === english })),
    yesterday: label(context.stageNeighbours.yesterday),
    today: label(english),
    tomorrow: label(context.stageNeighbours.tomorrow),
  };
}

function signTiles(fact: TransitFact, context: TopicContext): TopicVisual {
  const verb = INTERACTION_TOPICS[fact.interaction].verb;
  const today = BRANCH_ANIMALS[fact.transitBranch];
  const friendly = fact.interaction === "six-combine" || fact.interaction === "trine";
  return {
    kind: "signs",
    tone: friendly ? "favors" : "watch",
    signs: context.natalSigns.map(({ palace, branch }) => {
      const met = fact.natalPalaces.includes(palace);
      const same = !met && branch === fact.transitBranch;
      return {
        area: AREA_LABEL[lifeAreaOf(palace)],
        animal: capitalise(BRANCH_ANIMALS[branch]),
        note: met ? `Today's ${today} ${verb} it` : same ? "Same sign as today" : null,
        mark: met ? "met" : same ? "same" : null,
      };
    }),
  };
}

/** The page with its fuller sections added (M20-26). */
export function deepenTopicPage(page: TopicPage, topic: string, facts: readonly DayFact[], context: TopicContext): TopicPage {
  const transit = topic.startsWith("interaction:") ? rankTransits(facts).find((fact) => interactionTopic(fact) === topic) : undefined;
  const visual = transit ? signTiles(transit, context) : topic.startsWith("stage:") ? stageArc(topic, context) : null;
  const deeper: TopicPage = { ...page, sore: soreFor(context), visual, recurrences: context.recurrences };

  const depth = TOPIC_DEPTH[topic];
  if (depth) {
    const variant = depth[context.strength];
    deeper.tagline = textRun(variant.tagline);
    deeper.forYou = variant.forYou ? textRun(variant.forYou) : page.forYou;
    deeper.how = depth.how.map(textRun);
    deeper.goodFor = variant.goodFor.map(textRun);
    deeper.holdOff = variant.holdOff.map(textRun);
    deeper.where = depth.where.map(([label, line]) => ({ label, line: textRun(line) }));
    deeper.work = depth.work.map(textRun);
    deeper.nameOrigin = depth.nameOrigin ? textRun(depth.nameOrigin) : page.nameOrigin;
  }

  const clashInChart = transit?.interaction === "six-clash" && transit.natalPalaces.some((palace) => context.natalClashPalaces.includes(palace));
  if (clashInChart && deeper.how.length > 0) {
    deeper.how = [deeper.how[0]!, textRun(CLASH_ALREADY_IN_CHART), ...deeper.how.slice(1)];
  }
  return deeper;
}
