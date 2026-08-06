/**
 * The five-tab bottom navigation (Chart - Today - Cycles - Compare - Settings),
 * safe-area padded and shown on every main screen. Hidden during onboarding,
 * which owns the full viewport. Restyled as an anchor-fill pill (DESIGN.md
 * §Surfaces "Signpost + nav"): one of Trail's two fixed anchor objects, along
 * with the Today signpost. The active tab reads full paper; inactive tabs
 * mix toward ink-soft (color-mix, since --paper is a raw hex custom
 * property with no Tailwind alpha-channel plumbing — see globals.css's
 * .border-ink-tint for the same constraint).
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface Tab {
  href: string;
  label: string;
  icon: ReactNode;
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const
};

const TABS: Tab[] = [
  {
    href: "/chart",
    label: "Chart",
    icon: (
      <svg {...iconProps} aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M12 4v16M4 12h16" />
      </svg>
    )
  },
  {
    href: "/today",
    label: "Today",
    icon: (
      <svg {...iconProps} aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
      </svg>
    )
  },
  {
    href: "/cycles",
    label: "Cycles",
    icon: (
      <svg {...iconProps} aria-hidden>
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="7" cy="17" r="2.5" />
        <path d="M7 9.5v5M11 7h9M11 17h9" />
      </svg>
    )
  },
  {
    href: "/compare",
    label: "Compare",
    icon: (
      <svg {...iconProps} aria-hidden>
        <circle cx="9" cy="12" r="5.5" />
        <circle cx="15" cy="12" r="5.5" />
      </svg>
    )
  },
  {
    href: "/settings",
    label: "Settings",
    // Tune sliders, not a spoked gear — a gear drawn in this stroke style
    // reads as a second sun next to the Today tab.
    icon: (
      <svg {...iconProps} aria-hidden>
        <path d="M3 7h8M15 7h6M3 12h4M11 12h10M3 17h10M17 17h4" />
        <circle cx="13" cy="7" r="2" />
        <circle cx="9" cy="12" r="2" />
        <circle cx="15" cy="17" r="2" />
      </svg>
    )
  }
];

const INACTIVE_STYLE = { color: "color-mix(in srgb, var(--paper) 40%, var(--ink-soft))" };

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-10 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto max-w-app px-5 pb-3">
        <ul className="flex items-stretch rounded-full bg-anchor px-2 py-1.5 shadow-nav">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center gap-1 rounded-full py-2 text-[10.5px] font-bold text-paper"
                  style={active ? undefined : INACTIVE_STYLE}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
