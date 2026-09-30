/**
 * Today's first-screen pools, indexed the way the composer looks them up:
 * interaction × life area for a lead that pulls on the chart, the day's
 * character for a quiet day, and element × tone for the element's sentence.
 */

import type { InteractionType } from "@daymaster/bazi-engine";
import {
  CLASH_AGENCY,
  CLASH_BODIES,
  CLASH_HEADLINES,
  HARM_AGENCY,
  HARM_BODIES,
  HARM_HEADLINES,
  PUNISHMENT_AGENCY,
  PUNISHMENT_BODIES,
  PUNISHMENT_HEADLINES,
} from "../../banks/daily/friction.js";
import {
  COMBINE_AGENCY,
  COMBINE_BODIES,
  COMBINE_HEADLINES,
  TRINE_AGENCY,
  TRINE_BODIES,
  TRINE_HEADLINES,
} from "../../banks/daily/support.js";
import type { LifeArea } from "./life-areas.js";

export { LIFE_AREAS } from "./life-areas.js";
export { MODIFIERS } from "../../banks/daily/modifiers.js";
export { QUIET_AGENCY, QUIET_BODIES, QUIET_HEADLINES } from "../../banks/daily/quiet.js";

type ByArea = Record<LifeArea, readonly string[]>;

export const BODY_BASES: Record<InteractionType, ByArea> = {
  "six-clash": CLASH_BODIES,
  punishment: PUNISHMENT_BODIES,
  harm: HARM_BODIES,
  "six-combine": COMBINE_BODIES,
  trine: TRINE_BODIES,
};

export const HEADLINES: Record<InteractionType, ByArea> = {
  "six-clash": CLASH_HEADLINES,
  punishment: PUNISHMENT_HEADLINES,
  harm: HARM_HEADLINES,
  "six-combine": COMBINE_HEADLINES,
  trine: TRINE_HEADLINES,
};

export const AGENCY: Record<InteractionType, ByArea> = {
  "six-clash": CLASH_AGENCY,
  punishment: PUNISHMENT_AGENCY,
  harm: HARM_AGENCY,
  "six-combine": COMBINE_AGENCY,
  trine: TRINE_AGENCY,
};
