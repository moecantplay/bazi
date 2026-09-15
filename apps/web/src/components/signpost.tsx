/**
 * The agency line as a directional trail-sign board — Today's content anchor
 * (DESIGN.md §Surfaces "Signpost + nav"). Shared by Today and Conditions so
 * the two screens end on the identical object.
 */

import type { TokenLine } from "@daymaster/content";
import { TokenText } from "@/components/token-text";

interface Props {
  line: TokenLine;
}

export function Signpost({ line }: Props) {
  return (
    <>
      <div className="flex">
        <div className="relative mr-5 rounded-l-[18px] bg-anchor py-4 pl-5 pr-4 text-paper">
          <p
            className="font-mono text-[9px] font-bold uppercase tracking-[.2em]"
            style={{ color: "color-mix(in srgb, var(--paper) 55%, var(--ink-soft))" }}
          >
            One small thing before camp
          </p>
          <p className="mt-1.5 text-[16.5px] font-medium leading-snug">
            <TokenText line={line} />
          </p>
          <span
            aria-hidden
            className="absolute left-full top-0 h-full w-5 bg-anchor"
            style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
          />
        </div>
      </div>
      <span aria-hidden className="-mt-6 ml-10 h-6 w-0.5 bg-hairline" />
    </>
  );
}
