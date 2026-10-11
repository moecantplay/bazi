/**
 * Your sore spot and what eases it (M20-26): the chart's problem,
 * its remedies, and whether today eases it, presses on it, both or neither.
 * Bad news is said plainly and always comes with what helps (owner, 2026-10-10).
 */

import type { TopicSore } from "@daymaster/content";
import { TokenText } from "@/components/token-text";
import { TopicSection } from "@/components/topic/topic-sections";

const STATUS_TONE: Record<TopicSore["status"], "favors" | "watch" | "even"> = {
  neither: "even",
  eases: "favors",
  presses: "watch",
  both: "watch",
};

export function TopicSoreSpot({ sore }: { sore: TopicSore }) {
  return (
    <TopicSection label="Your sore spot and what eases it">
      <div data-topic-sore className="topic-card-surface">
        <p className={`topic-sore-status topic-sore-status-${STATUS_TONE[sore.status]}`}>{sore.statusLabel}</p>
        <div className="topic-sore-group">
          <span className="topic-mono-label topic-tone-watch">Your sore spot</span>
          <div className="topic-chip-row">
            <span className="topic-chip topic-chip-watch">{sore.problem}</span>
          </div>
        </div>
        <div className="topic-sore-group">
          <span className="topic-mono-label topic-tone-favors">What eases it</span>
          <div className="topic-chip-row">
            {sore.remedies.map((remedy) => (
              <span key={remedy} className="topic-chip topic-chip-favors">
                {remedy}
              </span>
            ))}
          </div>
        </div>
        <p className="topic-where-line">
          <TokenText line={sore.body} />
        </p>
      </div>
    </TopicSection>
  );
}
