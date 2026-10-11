/**
 * The building blocks of a topic page (M20-21 R11, M20-26): a
 * labelled section, paragraphs, where it shows up, the three steps and the
 * dates it comes back.
 */

import Link from "next/link";
import type { TokenLine, TopicWhere } from "@daymaster/content";
import { formatDayShort } from "@daymaster/presentation";
import { TokenText } from "@/components/token-text";
import { topicHref } from "@/lib/topic-href";

export function TopicSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="topic-section">
      <h2 className="kicker">{label}</h2>
      {children}
    </section>
  );
}

export function TopicParagraphs({ lines }: { lines: readonly TokenLine[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <p key={index} className="text-[16px] leading-relaxed text-ink">
          <TokenText line={line} />
        </p>
      ))}
    </>
  );
}

export function TopicWhereCard({ rows }: { rows: readonly TopicWhere[] }) {
  return (
    <TopicSection label="Where it shows up">
      <div className="topic-card-surface">
        {rows.map((row) => (
          <div key={row.label} className="topic-where-row">
            <span className="topic-mono-label">{row.label}</span>
            <p className="topic-where-line">
              <TokenText line={row.line} />
            </p>
          </div>
        ))}
      </div>
    </TopicSection>
  );
}

/** Three numbered steps; a single line (topics not yet written out) keeps the plain bullet. */
export function TopicSteps({ lines }: { lines: readonly TokenLine[] }) {
  return (
    <TopicSection label="Working with it">
      <ol className={lines.length > 1 ? "topic-steps" : "topic-work"}>
        {lines.map((line, index) => (
          <li key={index}>
            {lines.length > 1 && (
              <span className="topic-step-number" aria-hidden>
                {index + 1}
              </span>
            )}
            <span>
              <TokenText line={line} />
            </span>
          </li>
        ))}
      </ol>
    </TopicSection>
  );
}

export function TopicRecurrences({ dates, topic }: { dates: readonly string[]; topic: string }) {
  return (
    <TopicSection label="When it comes back">
      <div className="topic-recurrences">
        {dates.map((date) => (
          <Link key={date} href={topicHref(date, topic)} className="topic-date-chip">
            {formatDayShort(date)}
          </Link>
        ))}
      </div>
    </TopicSection>
  );
}
