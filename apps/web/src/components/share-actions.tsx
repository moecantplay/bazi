/**
 * The Chart screen's share row: the card image (Web Share sheet, or a straight
 * download) and the chart link (share sheet, or copied to the clipboard). The
 * status line under the buttons says what actually happened.
 */

"use client";

import { useState, type RefObject } from "react";
import { Button } from "@/components/button";
import { shareChartCard } from "@/lib/share-card";
import { buildShareUrl } from "@/lib/share-link";
import type { StoredBirth } from "@/lib/profile";

interface Props {
  sealContainerRef: RefObject<HTMLDivElement | null>;
  pillarLine: string;
  archetype: string;
  birth: StoredBirth;
}

export function ShareActions({ sealContainerRef, pillarLine, archetype, birth }: Props) {
  const [status, setStatus] = useState<string | null>(null);

  async function handleImage() {
    const sealSvg = sealContainerRef.current?.querySelector("svg");
    if (!sealSvg) {
      setStatus("The seal isn’t ready yet — try again in a moment.");
      return;
    }
    const result = await shareChartCard({ sealSvg, pillarLine, archetype });
    if (result === "downloaded") {
      setStatus("Card saved to your downloads.");
    } else if (result === "failed") {
      setStatus("The card couldn’t be drawn on this browser.");
    } else {
      setStatus(null);
    }
  }

  async function handleLink() {
    const url = buildShareUrl(birth);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ url });
        setStatus(null);
        return;
      } catch {
        // Dismissed the sheet; nothing to report.
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied. Anyone who opens it can compare charts with you.");
    } catch {
      setStatus("Couldn’t reach the clipboard — you can share from a mobile browser instead.");
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">Share</h2>
      <div className="flex flex-wrap gap-3">
        <Button variant="quiet" onClick={() => void handleImage()}>
          Share as image
        </Button>
        <Button variant="quiet" onClick={() => void handleLink()}>
          Copy chart link
        </Button>
      </div>
      {status && (
        <p role="status" className="text-[13px] text-ink-soft">
          {status}
        </p>
      )}
      <p className="text-[12px] leading-relaxed text-ink-soft">
        The link carries only birth details — the chart is recomputed on the other side, and
        nothing is stored anywhere but your devices.
      </p>
    </section>
  );
}
