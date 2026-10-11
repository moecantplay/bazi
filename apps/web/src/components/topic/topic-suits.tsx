/**
 * Good for / Hold off on (M20-26): one tonal card, two short lists,
 * tinted like Today's Favors and Watch chips.
 */

import type { TokenLine } from "@daymaster/content";
import { TokenText } from "@/components/token-text";

interface Props {
  goodFor: readonly TokenLine[];
  holdOff: readonly TokenLine[];
}

function SuitsGroup({ label, lean, items }: { label: string; lean: "favors" | "watch"; items: readonly TokenLine[] }) {
  return (
    <section className={`topic-suits-group topic-suits-${lean}`}>
      <h2 className="topic-suits-label">{label}</h2>
      <ul className="topic-suits-list">
        {items.map((item, index) => (
          <li key={index} className="topic-suits-item">
            <TokenText line={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TopicSuits({ goodFor, holdOff }: Props) {
  if (goodFor.length === 0 && holdOff.length === 0) {
    return null;
  }
  return (
    <div data-topic-suits className="topic-suits">
      {goodFor.length > 0 && <SuitsGroup label="Good for" lean="favors" items={goodFor} />}
      {holdOff.length > 0 && <SuitsGroup label="Hold off on" lean="watch" items={holdOff} />}
    </div>
  );
}
