/**
 * Ahead's "Plan something" (M24-07): the question Today can't answer, "when
 * should I…?". Each activity opens Find a day already searching for it.
 */

import Link from "next/link";
import { ACTIVITY_KEYS } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS } from "@daymaster/content";

export function PlanSomething() {
  return (
    <section className="card flex flex-col gap-4 p-5" aria-label="Plan something">
      <div className="flex flex-col gap-1">
        <p className="caption">Plan something</p>
        <h2 className="font-display text-[22px] leading-tight text-ink">What are you planning?</h2>
        <p className="text-[14px] leading-relaxed text-ink-soft">Pick one and see the best days in the next two months.</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {ACTIVITY_KEYS.map((activity) => (
          <li key={activity}>
            <Link
              href={`/dates/?activity=${activity}`}
              className="inline-flex min-h-[40px] items-center rounded-full bg-paper px-3.5 text-[14px] font-semibold text-ink"
            >
              {ACTIVITY_LABELS[activity].label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/dates/" className="tap-target self-start text-[13px] text-ink-soft hover:text-ink">
        Choose your own dates &rarr;
      </Link>
    </section>
  );
}
