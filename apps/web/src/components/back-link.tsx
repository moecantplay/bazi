/**
 * A quiet "back" affordance for leaf screens that sit outside the bottom nav
 * (the date finder is reached by link from Today and Compare, so it has no tab
 * of its own to return through). Mirrors the trailing-arrow link style used
 * elsewhere, with the arrow leading instead. Falls back to Today when there is
 * no history entry to pop (opened cold from a shared or bookmarked URL).
 */

"use client";

import { useRouter } from "next/navigation";

export function BackLink() {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/today/");
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="tap-target -mb-2 self-start text-[12px] text-ink-soft hover:text-ink"
    >
      &larr; Back
    </button>
  );
}
