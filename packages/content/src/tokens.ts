/**
 * Structured content runs: the typed alternative to embedding a system term
 * (and its Chinese character) directly inside a prose string. A TokenLine is
 * an ordered sequence of plain text and glossed terms; a presenter decides
 * how a term run renders (plain text, term + gloss, term + han) in exactly
 * one place, so "every term is glossed" becomes a type-level property
 * instead of something only checkable by rendering and regex-stripping.
 *
 * `han` is typed but not yet rendered by any presenter (Han display stays
 * retired, per the 2026-07-17 English-first decision) — it exists so a term
 * run can carry its classical character forward-compatibly.
 */

export type ContentRun =
  | { kind: "text"; text: string }
  | { kind: "term"; term: string; gloss: string; han?: string };

export type TokenLine = ContentRun[];

/**
 * A TokenLine with no embedded terms — plain prose with nothing to gloss
 * (most dos/donts suggestions, generic fallbacks, agency lines). Not a
 * migration shim: a line whose text genuinely carries no system term is
 * correctly and permanently a single text run.
 */
export function textRun(text: string): TokenLine {
  return [{ kind: "text", text }];
}

/**
 * A TokenLine flattened to a plain string, matching TokenText's gloss-only
 * render mode (M19 decision F — a term run shows its gloss, never its han).
 * For consumers that need a plain string (aria-labels, or presentation logic
 * that pre-dates the run type, like the headline's emphasis-run splitter).
 */
export function plainGloss(line: TokenLine): string {
  return line.map((run) => (run.kind === "term" ? run.gloss : run.text)).join("");
}

/**
 * The runs equivalent of a plain-string template `fill`: splices a TokenLine
 * into the template wherever its `{placeholder}` appears, instead of a plain
 * string. Placeholder names are matched longest-first so one name never
 * swallows a longer one that starts with it (e.g. "period" vs
 * "periodPossCap").
 */
export function fillRuns(template: string, subs: Record<string, TokenLine>): TokenLine {
  const keys = Object.keys(subs).sort((a, b) => b.length - a.length);
  if (keys.length === 0) {
    return [{ kind: "text", text: template }];
  }
  const pattern = new RegExp(`\\{(${keys.join("|")})\\}`, "g");
  const runs: TokenLine = [];
  let lastIndex = 0;
  for (const match of template.matchAll(pattern)) {
    const index = match.index;
    if (index > lastIndex) {
      runs.push({ kind: "text", text: template.slice(lastIndex, index) });
    }
    runs.push(...(subs[match[1] as string] as TokenLine));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < template.length) {
    runs.push({ kind: "text", text: template.slice(lastIndex) });
  }
  return runs;
}
