import type { Element } from "@daymaster/bazi-engine";
import { CONDITION_ICON_PATHS } from "@/lib/condition-icon-paths";

const ELEMENT_COLOR: Record<Element, string> = {
  wood: "var(--element-wood)",
  fire: "var(--element-fire)",
  earth: "var(--element-earth)",
  metal: "var(--element-metal)",
  water: "var(--element-water)"
};

interface Props {
  officerKey: string;
  officerName: string;
  /** The day's stem element: the icon takes its hue, like every element mark. */
  element: Element;
  size?: number;
}

/** The day officer drawn as a weather-style condition glyph, in the day's element hue. */
export function ConditionIcon({ officerKey, officerName, element, size = 24 }: Props) {
  const paths = CONDITION_ICON_PATHS[officerKey] ?? CONDITION_ICON_PATHS.ding ?? [];
  return (
    <svg
      role="img"
      aria-label={`${officerName} day`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={ELEMENT_COLOR[element]}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{`${officerName} day`}</title>
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
