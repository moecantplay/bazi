/**
 * One topic page (M20-21 R11): plain title, the old name once, how it applies
 * today, how it tends to go, how to work with it, and where the name comes
 * from. A date outside Today's range or a topic the day doesn't carry sends
 * the reader back to Today.
 */

"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { TokenLine } from "@daymaster/content";
import { dayTerrain, formatLong, topicPageFor, type StoredProfile } from "@daymaster/presentation";
import { TokenText } from "@/components/token-text";
import { dateFromQuery, todayHref } from "@/lib/topic-href";
import { useTodayLabel } from "@/lib/use-today-label";

interface Props {
  profile: StoredProfile;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="topic-section">
      <h2 className="kicker">{label}</h2>
      {children}
    </section>
  );
}

function Paragraphs({ lines }: { lines: readonly TokenLine[] }) {
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

export function TopicPageView({ profile }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const today = useTodayLabel();
  const date = dateFromQuery(`?${params.toString()}`) ?? today;
  const topic = params.get("topic") ?? "";
  const page = useMemo(() => topicPageFor(profile, date, today, topic), [profile, date, today, topic]);

  useEffect(() => {
    if (page === null) {
      router.replace(todayHref(date));
      return;
    }
    document.documentElement.dataset.terrain = dayTerrain(profile, date);
  }, [page, profile, date, router]);

  if (page === null) {
    return null;
  }

  return (
    <article data-topic-page className="flex flex-col gap-6 pt-6">
      <Link href={todayHref(date)} className="read-more tap-target self-start">
        <span aria-hidden>&lsaquo;</span> Today
      </Link>
      <header className="flex flex-col gap-3">
        <p className="kicker">{formatLong(date)}</p>
        <h1 className="font-display text-[34px] leading-[1.07] tracking-[-0.022em] text-ink [text-wrap:balance]">
          <TokenText line={page.title} />
        </h1>
        {page.oldName && (
          <p className="topic-old-name">
            <TokenText line={page.oldName} />
          </p>
        )}
      </header>
      {page.forYou && (
        <Section label="For you today">
          <Paragraphs lines={[page.forYou]} />
        </Section>
      )}
      {page.stars.length > 0 && (
        <ul className="topic-stars">
          {page.stars.map((star, index) => (
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
      )}
      {page.how.length > 0 && (
        <Section label="How it tends to go">
          <Paragraphs lines={page.how} />
        </Section>
      )}
      {page.work.length > 0 && (
        <Section label="Working with it">
          <ul className="topic-work">
            {page.work.map((line, index) => (
              <li key={index}>
                <TokenText line={line} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section label="Where the name comes from">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          <TokenText line={page.nameOrigin} />
        </p>
      </Section>
    </article>
  );
}
