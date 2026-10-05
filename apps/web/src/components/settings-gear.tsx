/**
 * The header control that opens Settings from every tab screen (Settings has
 * no tab of its own). Tune sliders, not a spoked gear: a gear in this stroke
 * style reads as a second sun beside the Today tab.
 */

import Link from "next/link";

interface Props {
  className?: string;
}

export function SettingsGear({ className = "" }: Props) {
  return (
    <Link href="/settings/" aria-label="Settings" className={`tap-target flex items-center justify-center rounded-full text-ink ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        <path d="M3 7h8M15 7h6M3 12h4M11 12h10M3 17h10M17 17h4" />
        <circle cx="13" cy="7" r="2" />
        <circle cx="9" cy="12" r="2" />
        <circle cx="15" cy="17" r="2" />
      </svg>
    </Link>
  );
}
