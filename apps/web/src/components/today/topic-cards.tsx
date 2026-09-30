/**
 * The plain cards below Today's first screen (M20-21 R4), one per fact the
 * reading didn't lead with, each opening its topic page. Every look lays out
 * the same cards its own way: Explorer as waypoints on a trail, Editorial as
 * a tonal stack of rows, Instrument as readout tiles.
 */

import Link from "next/link";
import type { TopicCard } from "@daymaster/content";
import { TokenText } from "@/components/token-text";
import type { LookPreference } from "@/lib/store-types";
import { topicHref } from "@/lib/topic-href";

const SECTION_TITLE: Record<LookPreference, string> = {
  trail: "Along the way",
  almanac: "Notes on the day",
  dial: "Readings",
};

/** Hours and pace are short enough to sit side by side as Instrument tiles. */
function isHalfTile(topic: string): boolean {
  return topic === "hours" || topic.startsWith("stage:");
}

interface Props {
  cards: TopicCard[];
  dateISO: string;
  look: LookPreference;
}

function CardText({ card }: { card: TopicCard }) {
  return (
    <>
      <span className="topic-card-kicker">{card.kicker}</span>
      {card.titles.map((title, index) => (
        <span key={index} className={card.line ? "topic-card-title" : "topic-card-item"}>
          <TokenText line={title} />
        </span>
      ))}
      {card.line && (
        <span className="topic-card-line">
          <TokenText line={card.line} />
        </span>
      )}
      <span className="topic-card-more">
        Read more <span aria-hidden>&rsaquo;</span>
      </span>
    </>
  );
}

export function TopicCards({ cards, dateISO, look }: Props) {
  if (cards.length === 0) {
    return null;
  }
  return (
    <section data-topic-cards aria-label={SECTION_TITLE[look]} className="flex flex-col gap-3">
      <p className="kicker">{SECTION_TITLE[look]}</p>
      <ul className={`topic-cards topic-cards-${look}`}>
        {cards.map((card) => {
          const half = look === "dial" && isHalfTile(card.topic);
          return (
            <li key={card.topic} className={half ? "topic-card-half" : undefined}>
              <Link href={topicHref(dateISO, card.topic)} data-topic={card.topic} className="topic-card">
                {look === "trail" && <span aria-hidden className="topic-card-node" />}
                <span className="topic-card-body">
                  <CardText card={card} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
