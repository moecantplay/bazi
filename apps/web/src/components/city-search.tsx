/**
 * Birth-city picker. Substring search over the bundled 2,000-city dataset,
 * matching on city and country, fully keyboard operable (arrow keys move the
 * highlight, Enter selects). The dataset's attribution is shown beneath, as its
 * license requires.
 */

"use client";

import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import citiesData from "@/data/cities.json";
import type { StoredCity } from "@/lib/profile";

interface CityDataset {
  attribution: string;
  cities: StoredCity[];
}

const dataset = citiesData as CityDataset;
const MAX_RESULTS = 40;

function matches(city: StoredCity, query: string): boolean {
  const haystack = `${city.name} ${city.country}`.toLowerCase();
  return haystack.includes(query);
}

interface Props {
  selected: StoredCity | null;
  onSelect: (city: StoredCity) => void;
}

export function CitySearch({ selected, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) {
      return [];
    }
    return dataset.cities.filter((city) => matches(city, trimmed)).slice(0, MAX_RESULTS);
  }, [query]);

  function choose(city: StoredCity) {
    onSelect(city);
    setQuery("");
    setActiveIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const city = results[activeIndex];
      if (city) {
        choose(city);
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {selected && (
        <p className="text-sm text-ink">
          Selected: <span className="font-medium">{selected.name}, {selected.country}</span>
        </p>
      )}

      <input
        type="text"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls="city-results"
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Search for your birth city"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-ink-soft bg-paper-raised px-4 py-3 text-base text-ink placeholder:text-ink-soft"
      />

      {results.length > 0 && (
        <ul
          id="city-results"
          ref={listRef}
          role="listbox"
          aria-label="Matching cities"
          className="max-h-64 overflow-y-auto rounded-lg border border-hairline bg-paper-raised"
        >
          {results.map((city, index) => {
            const active = index === activeIndex;
            return (
              <li key={`${city.name}-${city.tz}-${index}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(city)}
                  className={`flex w-full items-baseline justify-between gap-2 px-4 py-2.5 text-left text-sm ${
                    active ? "bg-paper text-ink" : "text-ink"
                  }`}
                >
                  <span>
                    {city.name}, {city.country}
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-soft">{city.tz}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {query.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm text-ink-soft">
          We couldn&rsquo;t find that city. Try the nearest larger town &mdash; timezone is what
          matters.
        </p>
      )}

      <p className="text-[11px] leading-snug text-ink-soft">{dataset.attribution}</p>
    </div>
  );
}
