/**
 * The agency line as a pull quote: Today's content anchor in every look
 * (DESIGN.md v5 §Shared surfaces). Anchor-pair slab, the line in large serif
 * italic under a faint opening quote mark, signed in Space Mono.
 */

import type { TokenLine } from "@daymaster/content";
import { TokenText } from "@/components/token-text";

interface Props {
  line: TokenLine;
}

export function PullQuoteBoard({ line }: Props) {
  return (
    <figure data-agency className="pull-quote">
      <blockquote className="pull-quote-line">
        <TokenText line={line} />
      </blockquote>
      <figcaption className="pull-quote-sign">One small thing · today</figcaption>
    </figure>
  );
}
