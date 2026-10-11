/**
 * One small drawing of the reader's own chart (M20-26): the twelve
 * stages as a hill with today marked, or the chart's signs with the one
 * today meets marked.
 */

import type { TopicVisual } from "@daymaster/content";
import { TopicSection } from "@/components/topic/topic-sections";

function StageArc({ visual }: { visual: Extract<TopicVisual, { kind: "stage-arc" }> }) {
  const neighbours = [
    ["Yesterday", visual.yesterday],
    ["Today", visual.today],
    ["Tomorrow", visual.tomorrow],
  ] as const;
  return (
    <div data-topic-visual="stage-arc" className="topic-card-surface">
      <div className="topic-stage-bars" role="img" aria-label={`Twelve stages, rising to full strength and falling back to rest. Today: ${visual.today}.`}>
        {visual.steps.map((step) => (
          <div key={step.label} className="topic-stage-bar-slot">
            <div className={step.today ? "topic-stage-bar topic-stage-bar-today" : "topic-stage-bar"} style={{ height: step.height }} />
          </div>
        ))}
      </div>
      <div className="topic-stage-neighbours">
        {neighbours.map(([label, name]) => (
          <div key={label} className="topic-stage-neighbour">
            <span className={label === "Today" ? "topic-mono-label topic-tone-accent" : "topic-mono-label"}>{label}</span>
            <span className={label === "Today" ? "topic-stage-name topic-stage-name-today" : "topic-stage-name"}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignTiles({ visual }: { visual: Extract<TopicVisual, { kind: "signs" }> }) {
  return (
    <TopicSection label="Your signs">
      <div data-topic-visual="signs" className="topic-sign-grid">
        {visual.signs.map((sign) => (
          <div key={sign.area} className={sign.mark === "met" ? `topic-sign-tile topic-sign-tile-met-${visual.tone}` : sign.mark === "same" ? "topic-sign-tile topic-sign-tile-same" : "topic-sign-tile"}>
            <span className="topic-mono-label">{sign.area}</span>
            <span className="topic-sign-animal">{sign.animal}</span>
            {sign.note && <span className={sign.mark === "met" ? `topic-sign-note topic-tone-${visual.tone}` : "topic-sign-note"}>{sign.note}</span>}
          </div>
        ))}
      </div>
    </TopicSection>
  );
}

export function TopicVisualBlock({ visual }: { visual: TopicVisual }) {
  return visual.kind === "stage-arc" ? <StageArc visual={visual} /> : <SignTiles visual={visual} />;
}
