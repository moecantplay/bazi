/**
 * The copy audit's counting (M20-02 R2): pure functions over rendered text.
 * Words and 4-word phrases are counted exactly as test/today-composed.test.ts
 * counts them, so the audit and M20-21's guards agree on what a repeat is.
 */

export interface AuditSlot {
  slot: string;
  text: string;
}

/** One screen as the reader sees it: a day's Today, one topic page, one Ahead period. */
export interface AuditView {
  key: string;
  slots: AuditSlot[];
}

export interface SentenceCount {
  sentence: string;
  count: number;
}

export interface RepeatPair {
  view: string;
  first: string;
  second: string;
  phrase: string;
}

export interface DuplicateSentence {
  view: string;
  sentence: string;
  count: number;
}

export interface ViewMetrics {
  views: number;
  sentences: number;
  uniqueSentences: number;
  uniqueRatio: number;
  topRepeats: SentenceCount[];
  wordsPerView: { min: number; average: number; max: number };
  emDashesPerView: { average: number; max: number };
  withinViewRepeats: { pairs: number; examples: RepeatPair[] };
  /** The same sentence more than once on one view; `extra` counts every showing after the first. */
  withinViewDuplicates: { extra: number; examples: DuplicateSentence[] };
}

const TOP_REPEATS = 25;
const REPEAT_EXAMPLES = 10;

/** Sentences split after . ! ? and on line breaks; a title with no full stop is one sentence. */
export function sentencesOf(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function wordsOf(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9'’ ]+/g, " ").split(/\s+/).filter(Boolean);
}

export function wordCount(text: string): number {
  return wordsOf(text).length;
}

export function emDashCount(text: string): number {
  return text.split("—").length - 1;
}

/** Every 4-word phrase of a sentence, in order, never across ; or : (as M20-21's tests split). */
function fourGrams(sentence: string): string[] {
  const grams: string[] = [];
  for (const clause of sentence.split(/[.!?;:]+/)) {
    const words = wordsOf(clause);
    for (let index = 0; index + 4 <= words.length; index += 1) {
      grams.push(words.slice(index, index + 4).join(" "));
    }
  }
  return grams;
}

function round(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function average(values: readonly number[]): number {
  return values.length === 0 ? 0 : round(values.reduce((sum, value) => sum + value, 0) / values.length, 1);
}

/** Pairs of different sentences on one view that share a 4-word phrase, with the first phrase they share. */
function repeatPairsOn(viewKey: string, sentences: readonly string[]): RepeatPair[] {
  const grams = sentences.map(fourGrams);
  const pairs: RepeatPair[] = [];
  for (let first = 0; first < sentences.length; first += 1) {
    const firstGrams = new Set(grams[first]);
    for (let second = first + 1; second < sentences.length; second += 1) {
      if (sentences[second] === sentences[first]) {
        continue;
      }
      const phrase = grams[second]!.find((gram) => firstGrams.has(gram));
      if (phrase !== undefined) {
        pairs.push({ view: viewKey, first: sentences[first]!, second: sentences[second]!, phrase });
      }
    }
  }
  return pairs;
}

/** Code-point order, so ties sort the same on every machine and locale. */
function byCodePoint(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}

/** Sentences said more than once, most first, ties in code-point order. */
function repeatedOf(sentences: readonly string[]): SentenceCount[] {
  const counts = new Map<string, number>();
  for (const sentence of sentences) {
    counts.set(sentence, (counts.get(sentence) ?? 0) + 1);
  }
  return [...counts]
    .filter(([, count]) => count > 1)
    .sort(([a, countA], [b, countB]) => countB - countA || byCodePoint(a, b))
    .map(([sentence, count]) => ({ sentence, count }));
}

/** Every metric over a set of views; with `slot`, only that slot, over the views that have it. */
export function measureViews(views: readonly AuditView[], slot?: string): ViewMetrics {
  const kept = views
    .map((view) => ({ key: view.key, texts: view.slots.filter((entry) => slot === undefined || entry.slot === slot).map((entry) => entry.text) }))
    .filter((view) => view.texts.length > 0);

  const perView = kept.map((view) => ({
    key: view.key,
    sentences: view.texts.flatMap(sentencesOf),
    words: view.texts.reduce((sum, text) => sum + wordCount(text), 0),
    emDashes: view.texts.reduce((sum, text) => sum + emDashCount(text), 0)
  }));
  const allSentences = perView.flatMap((view) => view.sentences);
  const uniqueSentences = new Set(allSentences).size;
  const words = perView.map((view) => view.words);
  const emDashes = perView.map((view) => view.emDashes);
  const pairs = perView.flatMap((view) => repeatPairsOn(view.key, view.sentences));
  const duplicates = perView.flatMap((view) => repeatedOf(view.sentences).map((entry) => ({ view: view.key, ...entry })));

  return {
    views: kept.length,
    sentences: allSentences.length,
    uniqueSentences,
    uniqueRatio: allSentences.length === 0 ? 0 : round(uniqueSentences / allSentences.length, 3),
    topRepeats: repeatedOf(allSentences).slice(0, TOP_REPEATS),
    wordsPerView: {
      min: words.length === 0 ? 0 : Math.min(...words),
      average: average(words),
      max: words.length === 0 ? 0 : Math.max(...words)
    },
    emDashesPerView: { average: average(emDashes), max: emDashes.length === 0 ? 0 : Math.max(...emDashes) },
    withinViewRepeats: { pairs: pairs.length, examples: pairs.slice(0, REPEAT_EXAMPLES) },
    withinViewDuplicates: {
      extra: duplicates.reduce((sum, entry) => sum + entry.count - 1, 0),
      examples: duplicates.slice(0, REPEAT_EXAMPLES)
    }
  };
}

/** Every slot name across the views, once each, in first-seen order. */
export function slotNames(views: readonly AuditView[]): string[] {
  return [...new Set(views.flatMap((view) => view.slots.map((entry) => entry.slot)))];
}
