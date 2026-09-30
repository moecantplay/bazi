/**
 * Today's body (VOICE.md rule 13): how the day's one idea could show up and
 * how to ease it, with "Read more" into the lead's topic page. Every look
 * places it between the headline and the pull quote.
 */

import Link from "next/link";
import type { DailyReading } from "@daymaster/content";
import { TokenText } from "@/components/token-text";
import { topicHref } from "@/lib/topic-href";

interface Props {
  reading: DailyReading;
  dateISO: string;
  /** Arrival stagger step for this look. */
  delay: number;
}

export function ReadingBody({ reading, dateISO, delay }: Props) {
  return (
    <div data-reading-body className="arrive-rise flex flex-col gap-2" style={{ ["--d" as string]: delay }}>
      <p className="text-[16px] leading-relaxed text-ink">
        <TokenText line={reading.body.runs} />
      </p>
      <Link href={topicHref(dateISO, reading.leadTopic)} data-read-more className="read-more tap-target self-start">
        Read more <span aria-hidden>&rsaquo;</span>
      </Link>
    </div>
  );
}
