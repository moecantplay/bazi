"use client";

/**
 * The day's twelve two-hour blocks as a horizontal strip on a dashed rail —
 * the weather app's hourly row. The rough hour (its animal clashes with the
 * day's) carries a crossing mark, the easy hour (its combine partner) a filled
 * node, and today's current block a ringed dot. On today the strip scrolls
 * itself to the current block on first render.
 */

import { useEffect, useRef } from "react";
import type { HourBlock } from "@daymaster/presentation";

interface Props {
  blocks: readonly HourBlock[];
  /** Index of the block containing the current time, or null when not showing today. */
  currentIndex: number | null;
}

const MARK_WORD: Record<NonNullable<HourBlock["mark"]>, string> = {
  rough: "Rough",
  easy: "Easy"
};

export function HoursStrip({ blocks, currentIndex }: Props) {
  const currentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [currentIndex]);

  return (
    <div
      data-hours-strip
      className="overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent 0, #000 18px, #000 calc(100% - 18px), transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 18px, #000 calc(100% - 18px), transparent)"
      }}
    >
      <ul className="relative flex w-max list-none gap-0.5 px-3.5" aria-label="The day's hours">
        <span
          aria-hidden
          className="absolute left-3.5 right-3.5 top-[54px] border-t-2 border-dashed border-ink-soft opacity-55"
        />
        {blocks.map((block, index) => {
          const isNow = index === currentIndex;
          const tag = block.mark ? MARK_WORD[block.mark] : isNow ? "Now" : "";
          return (
            <li
              key={block.branch}
              ref={isNow ? currentRef : undefined}
              data-hour-block={block.animal}
              data-hour-mark={block.mark ?? undefined}
              aria-current={isNow ? "time" : undefined}
              className={`relative flex w-[60px] flex-none flex-col items-center gap-1.5 rounded-[14px] px-0 pb-1.5 pt-1 ${
                isNow ? "bg-ink-tint" : ""
              }`}
            >
              <span
                className={`whitespace-nowrap font-mono text-[9px] font-bold tracking-[.06em] ${
                  isNow ? "text-ink" : "text-ink-soft"
                }`}
              >
                {block.label}
              </span>
              <HourNode mark={block.mark} isNow={isNow} />
              <span className="text-[11px] font-semibold capitalize text-ink">{block.animal}</span>
              <span
                className={`min-h-3 font-mono text-[8px] font-bold uppercase tracking-[.14em] ${
                  block.mark === "rough" ? "text-signal-amber" : "text-ink"
                }`}
              >
                {tag}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface NodeProps {
  mark: HourBlock["mark"];
  isNow: boolean;
}

function HourNode({ mark, isNow }: NodeProps) {
  const filled = mark === "easy" || isNow;
  return (
    <span
      aria-hidden
      className={`relative z-[1] my-1 grid h-[22px] w-[22px] place-items-center rounded-full border-2 ${
        filled ? "border-ink bg-ink" : mark === "rough" ? "border-ink bg-surface" : "border-ink-soft bg-surface"
      }`}
    >
      {mark === "rough" && (
        <svg viewBox="0 0 12 12" width={12} height={12} stroke="var(--ink)" strokeWidth={2} strokeLinecap="round">
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      )}
      {isNow && <span className="h-1.5 w-1.5 rounded-full bg-surface" />}
    </span>
  );
}
