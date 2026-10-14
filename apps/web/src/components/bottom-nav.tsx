/**
 * The four-tab bottom navigation (Today - Ahead - You - People), safe-area
 * padded and shown on every main screen; Settings opens from the header gear
 * (AppShell). Hidden during onboarding,
 * which owns the full viewport. Restyled as an anchor-fill pill (DESIGN.md
 * §Surfaces "Signpost + nav"), the chrome's fixed anchor object. The active
 * tab reads full paper; inactive tabs
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
  /** Route prefixes that light this tab (a tab's leaf screens count as the tab). */
  matches: string[];
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
    href: "/today",
    label: "Today",
    matches: ["/today"],
    icon: (
      <svg {...iconProps} aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
      </svg>
    )
  },
  {
    href: "/ahead",
    label: "Ahead",
    matches: ["/ahead", "/dates"],
    icon: (
      <svg {...iconProps} aria-hidden>
        <path d="M4 18c3-1 4-5 7-6s5 1 9-6" />
        <path d="M15 6h5v5" />
      </svg>
    )
  },
  {
    href: "/you",
    label: "You",
    matches: ["/you", "/chart"],
    icon: (
      <svg {...iconProps} aria-hidden>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
      </svg>
    )
  },
  {
    href: "/people",
    label: "People",
    matches: ["/people"],
    icon: (
      <svg {...iconProps} aria-hidden>
        <circle cx="9" cy="12" r="5.5" />
        <circle cx="15" cy="12" r="5.5" />
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
            const active = tab.matches.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
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
