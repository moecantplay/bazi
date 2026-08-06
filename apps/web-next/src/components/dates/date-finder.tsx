/**
 * The date finder: pick an activity, a window (default today → +60 days, up to
 * a year), and optionally one saved person, then rank the days best-first for
 * every chart. Everything runs on the stored profile chart with no network. The
 * range is clamped to the engine's supported span before the search, so a wide
 * or out-of-bounds request comes back trimmed with a note, never a crash.
 */

"use client";

import { useMemo, useState } from "react";
import type { ActivityKey } from "@daymaster/bazi-engine";
import {
  addDays,
  dateFinderChartLabels,
  dateFinderVerdictSeedBase,
  findDatesFor,
  MAX_DATE,
  MIN_DATE,
  todayLabel,
  type DateSearch
} from "@daymaster/presentation";
import { Button } from "@/components/button";
import { ActivityPicker } from "@/components/dates/activity-picker";
import { DateResults } from "@/components/dates/date-results";
import { loadActivePersonId, loadPeople } from "@/lib/store";
import type { StoredProfile } from "@/lib/store-types";

const DEFAULT_SPAN_DAYS = 60;
/** "Just me" — the sentinel for searching the profile chart alone. */
const JUST_ME = "me";

const dateFieldClass = "field-input";

interface Props {
  profile: StoredProfile;
}

export function DateFinder({ profile }: Props) {
  const today = todayLabel();
  const people = useMemo(() => loadPeople(), []);

  const [activity, setActivity] = useState<ActivityKey | null>(null);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(() => addDays(today, DEFAULT_SPAN_DAYS));
  const [personId, setPersonId] = useState<string>(() => {
    const active = loadActivePersonId();
    return active !== null && people.some((person) => person.id === active) ? active : JUST_ME;
  });
  const [search, setSearch] = useState<DateSearch | null>(null);
  const [error, setError] = useState<string | null>(null);

  const person = personId === JUST_ME ? null : people.find((p) => p.id === personId) ?? null;

  function run() {
    if (activity === null) {
      setError("Pick what the day is for first.");
      setSearch(null);
      return;
    }
    if (end < start) {
      setError("The end date is before the start date. Check the dates.");
      setSearch(null);
      return;
    }
    setError(null);
    try {
      setSearch(findDatesFor(profile, activity, start, end, person));
    } catch {
      // The range was clamped before the call, so this only fires on truly
      // unexpected input; show a recoverable message rather than crashing.
      setError("We couldn't search that window. Try a shorter range.");
      setSearch(null);
    }
  }

  const chartLabels = dateFinderChartLabels(person?.name ?? null);
  const verdictSeedBase = dateFinderVerdictSeedBase(profile, activity, person?.id ?? null);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[14px] leading-relaxed text-ink-soft">
        Pick what you&rsquo;re planning and a window to look in. Days are ranked for your chart
        {people.length > 0 ? ", and anyone you add" : ""} — best first.
      </p>

      <ActivityPicker value={activity} onChange={setActivity} />

      <fieldset className="flex flex-col gap-3">
        <legend className="kicker">Between</legend>
        <div className="flex items-end gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className="field-label">From</span>
            <input
              type="date"
              value={start}
              min={MIN_DATE}
              max={MAX_DATE}
              onChange={(event) => setStart(event.target.value)}
              className={dateFieldClass}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="field-label">To</span>
            <input
              type="date"
              value={end}
              min={start}
              max={MAX_DATE}
              onChange={(event) => setEnd(event.target.value)}
              className={dateFieldClass}
            />
          </label>
        </div>
        <p className="text-[11px] text-ink-soft">A search covers up to one year.</p>
      </fieldset>

      {people.length > 0 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="kicker">Reading for</legend>
          <div className="flex flex-wrap gap-2">
            <PersonChoice
              label="Just me"
              active={personId === JUST_ME}
              onClick={() => setPersonId(JUST_ME)}
            />
            {people.map((candidate) => (
              <PersonChoice
                key={candidate.id}
                label={candidate.name}
                active={personId === candidate.id}
                onClick={() => setPersonId(candidate.id)}
              />
            ))}
          </div>
        </fieldset>
      )}

      <Button onClick={run}>Find days</Button>

      {error && (
        <p role="alert" className="text-[13px] text-ink">
          {error}
        </p>
      )}

      {search && (
        <section className="flex flex-col gap-3">
          <h2 className="kicker">Best days</h2>
          {search.clampedNote && <p className="text-[12px] text-ink-soft">{search.clampedNote}</p>}
          <DateResults
            candidates={search.candidates}
            chartLabels={chartLabels}
            verdictSeedBase={verdictSeedBase}
          />
        </section>
      )}
    </div>
  );
}

function PersonChoice({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-[13px] ${
        active ? "bg-ink text-paper" : "bg-ink-tint text-ink hover:opacity-80"
      }`}
    >
      {label}
    </button>
  );
}
