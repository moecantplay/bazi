/** The header gear that opens Settings from every tab screen (Settings has no tab of its own). */

import Link from "next/link";

interface Props {
  className?: string;
}

export function SettingsGear({ className = "" }: Props) {
  return (
    <Link href="/settings/" aria-label="Settings" className={`tap-target flex items-center justify-center rounded-full text-ink ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
      </svg>
    </Link>
  );
}
