/**
 * A controlled snap-scroll carousel shared by Cycles' decade/year/month
 * pickers: exactly one item is "active" (centered) at a time, and there is
 * no separate expand/collapse state — whichever item is centered is what the
 * caller reads for below. Swiping and tapping both drive `onActiveChange`.
 *
 * Whenever `activeIndex` changes — whether a click, a parent cascade (e.g.
 * picking a new decade resets the year rail's default), or a genuine user
 * swipe — this carousel just scrolls the matching item to center. The swipe
 * detector below only ever reads the *settled* scroll position (debounced,
 * not sampled continuously mid-animation): an earlier continuous rAF sampler
 * raced with this component's own corrective `scrollIntoView` calls, reading
 * transient in-flight positions from a scroll it had itself started and
 * misreporting them as user gestures. Settling-only avoids that whole class
 * of race by construction — a corrective scroll always resolves to the
 * already-current `activeIndex`, so the settle check is then a no-op.
 */

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface ScrollCarouselProps<T> {
  items: T[];
  itemKey: (item: T, index: number) => string | number;
  axis: "x" | "y";
  /**
   * Card size in px along the scroll axis. Drives the centering spacers AND
   * is set explicitly as each item's width (x) or height (y) — items can't
   * be left to auto-size from content: a column-axis (y) flex item's main
   * axis never stretches to fill its container the way a row-axis (x) one
   * does via cross-axis stretch, so an unset y-axis item used to collapse to
   * whatever height its content computed to, and the active-state outline
   * (drawn on that collapsed box) visibly clipped its own card's text. Item
   * buttons deliberately don't use the shared `.tap-target` enlarge-hit-area
   * class either, for the same reason: every card here is already ≥itemSize
   * on both axes (well past the 44px minimum), so that class's
   * padding/negative-margin trick only fought this explicit sizing —
   * `.tap-target`'s `height:100%` resolved against the button's own
   * border-box, not its parent, so it rendered the card's fill flush to one
   * edge of the (correctly sized) `<li>` instead of filling it.
   */
  itemSize: number;
  activeIndex: number;
  onActiveChange: (index: number) => void;
  renderItem: (item: T, state: { isActive: boolean; distance: number }) => ReactNode;
  /** Extra attributes (e.g. domain-specific data-* hooks) spread onto each `<li>`. */
  itemProps?: (item: T, state: { isActive: boolean; distance: number }) => Record<string, string | undefined>;
  /**
   * Rendered as a sibling *outside* the distance-dimmed wrapper, so it holds
   * full contrast even on a card that isn't the active one — e.g. a "this is
   * really today" marker. Dimming it along with the rest of the card (as a
   * first pass here did, by nesting it inside the opacity-scaled element)
   * measurably failed AA: a light-theme non-active card dims to 0.68 opacity,
   * which composites the marker down to 2.99:1 against its own card fill.
   */
  renderNowMarker?: (item: T) => ReactNode;
  "aria-label": string;
}

export function ScrollCarousel<T>({
  items,
  itemKey,
  axis,
  itemSize,
  activeIndex,
  onActiveChange,
  renderItem,
  itemProps,
  renderNowMarker,
  "aria-label": ariaLabel
}: ScrollCarouselProps<T>) {
  const containerRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef(new Map<string | number, HTMLLIElement>());
  const reducedMotion = usePrefersReducedMotion();
  const mountedRef = useRef(false);

  function scrollToIndex(index: number, smooth: boolean) {
    const item = items[index];
    if (item === undefined) {
      return;
    }
    const el = itemRefs.current.get(itemKey(item, index));
    if (!el) {
      return;
    }
    const behavior = smooth && !reducedMotion ? "smooth" : "instant";
    el.scrollIntoView(
      axis === "y"
        ? { behavior, block: "center", inline: "nearest" }
        : { behavior, inline: "center", block: "nearest" }
    );
  }

  // Center whenever activeIndex changes, from any source (click, a parent
  // cascade, or the settle-detector below reporting a swipe). Skips the very
  // first mount's transition so initial paint lands directly on the right
  // item with no visible scroll.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      scrollToIndex(activeIndex, false);
      return;
    }
    scrollToIndex(activeIndex, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, items.length]);

  // Swiping alone (no tap) must also drive the reading below. Debounced on
  // scroll settling (not sampled continuously) — see file doc comment for
  // why continuous sampling raced with this component's own corrective
  // scrolls above.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    function handleScroll() {
      if (settleTimer !== null) {
        clearTimeout(settleTimer);
      }
      settleTimer = setTimeout(() => {
        settleTimer = null;
        const containerEl = containerRef.current;
        if (!containerEl) {
          return;
        }
        const box = containerEl.getBoundingClientRect();
        const center = axis === "y" ? box.top + box.height / 2 : box.left + box.width / 2;
        let best = -1;
        let bestDist = Infinity;
        items.forEach((item, index) => {
          const el = itemRefs.current.get(itemKey(item, index));
          if (!el) {
            return;
          }
          const r = el.getBoundingClientRect();
          const pos = axis === "y" ? r.top + r.height / 2 : r.left + r.width / 2;
          const dist = Math.abs(pos - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = index;
          }
        });
        if (best !== -1 && best !== activeIndex) {
          onActiveChange(best);
        }
      }, 120);
    }
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (settleTimer !== null) {
        clearTimeout(settleTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, activeIndex]);

  function handleItemClick(index: number) {
    if (index === activeIndex) {
      return;
    }
    onActiveChange(index);
  }

  const spacerStyle = { flex: `0 0 calc((100% - ${itemSize}px)/2)` };
  const itemSizeStyle = axis === "y" ? { height: itemSize } : { width: itemSize };

  return (
    <ul
      ref={containerRef}
      aria-label={ariaLabel}
      className={`flex h-full w-full gap-2 overflow-auto ${
        axis === "y" ? "scroll-carousel-y flex-col" : "scroll-carousel-x"
      }`}
    >
      <li aria-hidden style={spacerStyle} />
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const distance = Math.abs(index - activeIndex);
        const key = itemKey(item, index);
        return (
          <li
            key={key}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(key, el);
              } else {
                itemRefs.current.delete(key);
              }
            }}
            className={`scroll-carousel-item relative flex-none rounded-2xl ${isActive ? "is-active" : ""}`}
            style={itemSizeStyle}
            data-carousel-active={isActive ? "" : undefined}
            {...(itemProps ? itemProps(item, { isActive, distance }) : {})}
          >
            <div className="h-full w-full" style={{ opacity: isActive ? 1 : Math.max(0.38, 1 - distance * 0.32) }}>
              <button
                type="button"
                onClick={() => handleItemClick(index)}
                aria-pressed={isActive}
                className="block h-full w-full"
              >
                {renderItem(item, { isActive, distance })}
              </button>
            </div>
            {renderNowMarker?.(item)}
          </li>
        );
      })}
      <li aria-hidden style={spacerStyle} />
    </ul>
  );
}
