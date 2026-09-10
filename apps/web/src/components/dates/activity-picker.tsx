/**
 * The date-finder's activity chooser: a custom dropdown select over the ten
 * modelled almanac activities. Closed, it reads as a form field (DESIGN.md v4
 * §Components .field-input) showing the chosen activity in modern words with
 * its classical category as a caption, or a placeholder before a choice. Open,
 * it drops a raised listbox beneath the field — every option carries the same
 * label + caption pair, the chosen one marked with an ink dot.
 *
 * Built on the combobox/listbox ARIA pattern rather than a native <select>,
 * which can't render two-line options and looks different on every platform:
 * the trigger is a real button with aria-expanded/aria-controls, the list is
 * role="listbox" with aria-activedescendant tracking a highlighted row.
 * Arrow keys move the highlight (opening the list if closed), Home/End jump,
 * Enter/Space pick, Escape or an outside click closes.
 */

"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ACTIVITY_KEYS, type ActivityKey } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS } from "@daymaster/content";

interface Props {
  value: ActivityKey | null;
  onChange: (activity: ActivityKey) => void;
}

export function ActivityPicker({ value, onChange }: Props) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = value === null ? -1 : ACTIVITY_KEYS.indexOf(value);
  const selectedLabel = value === null ? null : ACTIVITY_LABELS[value];

  function openList() {
    setHighlighted(selectedIndex < 0 ? 0 : selectedIndex);
    setOpen(true);
  }

  function closeList() {
    setOpen(false);
  }

  function choose(index: number) {
    const key = ACTIVITY_KEYS[index];
    if (key) {
      onChange(key);
    }
    closeList();
    triggerRef.current?.focus();
  }

  // Outside click/tap closes the list without picking.
  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted row in view while arrowing through a scrolled list.
  useEffect(() => {
    if (!open) {
      return;
    }
    const row = listRef.current?.children[highlighted];
    if (row instanceof HTMLElement) {
      row.scrollIntoView({ block: "nearest" });
    }
  }, [open, highlighted]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = ACTIVITY_KEYS.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openList();
          return;
        }
        setHighlighted((index) => Math.min(index + 1, last));
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openList();
          return;
        }
        setHighlighted((index) => Math.max(index - 1, 0));
        return;
      case "Home":
        if (open) {
          event.preventDefault();
          setHighlighted(0);
        }
        return;
      case "End":
        if (open) {
          event.preventDefault();
          setHighlighted(last);
        }
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) {
          choose(highlighted);
        } else {
          openList();
        }
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          closeList();
        }
        return;
      case "Tab":
        closeList();
        return;
      default:
        return;
    }
  }

  return (
    <div ref={rootRef} data-activity-select className="relative flex flex-col gap-3">
      <span id={`${listId}-label`} className="kicker">
        What&rsquo;s the day for?
      </span>

      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${listId}-label`}
        aria-activedescendant={open ? `${listId}-${highlighted}` : undefined}
        data-activity={value ?? ""}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={onKeyDown}
        className="field-input flex items-center justify-between gap-3 text-left"
      >
        {selectedLabel ? (
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-[15px] leading-snug text-ink">{selectedLabel.label}</span>
            <span className="caption truncate">{selectedLabel.classical}</span>
          </span>
        ) : (
          <span className="text-ink-soft">Choose an activity</span>
        )}
        <Chevron open={open} />
      </button>

      {open && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-labelledby={`${listId}-label`}
          className="spring-in absolute left-0 right-0 top-full z-20 mt-2 max-h-[60vh] origin-top overflow-y-auto rounded-card border-ink-tint bg-paper-raised p-1 shadow-card"
        >
          {ACTIVITY_KEYS.map((key, index) => {
            const label = ACTIVITY_LABELS[key];
            const selected = value === key;
            const active = index === highlighted;
            return (
              <li
                key={key}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selected}
                data-option={key}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${
                  active ? "bg-surface" : ""
                }`}
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[15px] leading-snug text-ink">{label.label}</span>
                  <span className="caption">{label.classical}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 rounded-full ${selected ? "bg-ink" : "bg-transparent"}`}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-[18px] w-[18px] shrink-0 text-ink-soft transition-transform motion-reduce:transition-none ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}
