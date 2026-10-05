/**
 * Reshape trial: a plain reading in the base design — the lead (kicker,
 * headline, body, one thing to try) and a plain card for every other fact.
 * The shape Today uses (M20-21), for Ahead, You and People.
 */

import type { PlainCard, PlainLead } from "@daymaster/content";

interface LeadProps {
  kicker: string;
  lead: PlainLead;
  /** Label over the one thing to try, e.g. "One thing this month". */
  actionLabel: string;
}

export function PlainLeadBlock({ kicker, lead, actionLabel }: LeadProps) {
  return (
    <section className="flex flex-col gap-3" aria-label={kicker}>
      <p className="kicker">{kicker}</p>
      <h2 className="font-display text-[28px] leading-[1.1] text-ink [text-wrap:balance]">{lead.headline}</h2>
      <p className="text-[15px] leading-relaxed text-ink">{lead.body}</p>
      {lead.action && (
        <div className="card flex flex-col gap-2 p-5">
          <p className="caption">{actionLabel}</p>
          <p className="headline-emphasis text-[20px] leading-snug text-ink">{lead.action}</p>
        </div>
      )}
    </section>
  );
}

interface CardsProps {
  cards: PlainCard[];
}

export function PlainCardList({ cards }: CardsProps) {
  if (cards.length === 0) {
    return null;
  }
  return (
    <ul className="flex flex-col gap-2.5">
      {cards.map((card) => (
        <li key={`${card.topic}:${card.title}`} className="card flex flex-col gap-1 p-4">
          <p className="font-display text-[18px] leading-tight text-ink">{card.title}</p>
          <p className="text-[14px] leading-relaxed text-ink-soft">{card.line}</p>
        </li>
      ))}
    </ul>
  );
}
