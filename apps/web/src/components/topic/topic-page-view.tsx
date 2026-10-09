/**
 * One topic page (M20-21 R11; fuller in reshape trial R14): plain title, a
 * short everyday line, the old name once, how it applies today, a drawing of
 * the reader's chart where one fits, how it tends to go, where it shows up,
 * the chart's sore spot, what it's good for, three steps, when it comes back
 * and where the name comes from. A date outside Today's range or a topic the
 * day doesn't carry sends the reader back to Today.
 */

"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { dayTerrain, formatLong, topicPageFor, type StoredProfile } from "@daymaster/presentation";
import { TokenText } from "@/components/token-text";
import { TopicParagraphs, TopicRecurrences, TopicSection, TopicSteps, TopicWhereCard } from "@/components/topic/topic-sections";
import { TopicSoreSpot } from "@/components/topic/topic-sore-spot";
import { TopicStars } from "@/components/topic/topic-stars";
import { TopicSuits } from "@/components/topic/topic-suits";
import { TopicVisualBlock } from "@/components/topic/topic-visual";
import { dateFromQuery, todayHref } from "@/lib/topic-href";
import { useTodayLabel } from "@/lib/use-today-label";

interface Props {
  profile: StoredProfile;
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
        {page.tagline && (
          <p data-topic-tagline className="topic-tagline">
            <TokenText line={page.tagline} />
          </p>
        )}
        {page.oldName && (
          <p className="topic-old-name">
            <TokenText line={page.oldName} />
          </p>
        )}
      </header>
      {page.forYou && (
        <TopicSection label="For you today">
          <TopicParagraphs lines={[page.forYou]} />
        </TopicSection>
      )}
      {page.visual && <TopicVisualBlock visual={page.visual} />}
      {page.stars.length > 0 && <TopicStars stars={page.stars} />}
      {page.how.length > 0 && (
        <TopicSection label="How it tends to go">
          <TopicParagraphs lines={page.how} />
        </TopicSection>
      )}
      {page.where.length > 0 && <TopicWhereCard rows={page.where} />}
      {page.sore && <TopicSoreSpot sore={page.sore} />}
      <TopicSuits goodFor={page.goodFor} holdOff={page.holdOff} />
      {page.work.length > 0 && <TopicSteps lines={page.work} />}
      {page.recurrences.length > 0 && <TopicRecurrences dates={page.recurrences} topic={topic} />}
      <TopicSection label="Where the name comes from">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          <TokenText line={page.nameOrigin} />
        </p>
      </TopicSection>
      <p data-topic-closing className="topic-closing">
        <TokenText line={page.closing} />
      </p>
    </article>
  );
}
