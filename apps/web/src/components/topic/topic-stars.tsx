/** The small-signs page's list: each star's plain title, one line and its old name (M20-21 R11). */

import type { StarEntry } from "@daymaster/content";
import { TokenText } from "@/components/token-text";

export function TopicStars({ stars }: { stars: readonly StarEntry[] }) {
  return (
    <ul className="topic-stars">
      {stars.map((star, index) => (
        <li key={index} className="topic-star">
          <span className="topic-card-title">
            <TokenText line={star.title} />
          </span>
          <span className="topic-card-line">
            <TokenText line={star.line} />
          </span>
          <span className="topic-card-kicker">
            Old name · <TokenText line={star.oldName} />
          </span>
        </li>
      ))}
    </ul>
  );
}
