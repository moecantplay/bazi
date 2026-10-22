/**
 * Today's colour (M24-06), the same in every look: one swatch, its name, and
 * why. Sits after What the day suits.
 */

import { COLOUR_SWATCH } from "@daymaster/presentation";
import type { TodayScreen } from "@/components/today/use-today-screen";

interface Props {
  screen: TodayScreen;
}

export function TodayColour({ screen }: Props) {
  const pick = screen.model.colour;
  if (!pick) {
    return null;
  }
  return (
    <section className="suits" aria-label="Today's colour">
      <p className="kicker">Today&rsquo;s colour</p>
      <div className="flex items-center gap-3">
        <span className="day-colour-swatch" style={{ backgroundColor: COLOUR_SWATCH[pick.colour] }} aria-hidden />
        <h3 className="suits-heading capitalize">{pick.colour}</h3>
      </div>
      <p className="text-[14px] leading-relaxed text-ink-soft">{pick.line}</p>
    </section>
  );
}
