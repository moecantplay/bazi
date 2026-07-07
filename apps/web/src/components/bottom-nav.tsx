/**
 * The four-tab bottom navigation (Chart - Today - Cycles - Settings), safe-area
 * padded and shown on every main screen. Hidden during onboarding, which owns
 * the full viewport. The active tab is ink; the rest are ink-soft.
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
    href: "/settings",
    label: "Settings",
    icon: (
      <svg {...iconProps} aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </svg>
    )
  }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-hairline bg-paper-raised pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-app items-stretch">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${
                  active ? "text-ink" : "text-ink-soft"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
