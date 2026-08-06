/**
 * Birth-city picker. Substring search over the bundled 2,000-city dataset,
 * matching on city and country, fully keyboard operable (arrow keys move the
 * highlight, Enter selects). The dataset's attribution is shown beneath, as its
 * license requires.
 *
 * The 180KB dataset loads as its own chunk after mount, so the data-entry
 * screens become interactive without parsing it first.
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { StoredCity } from "@/lib/store-types";

interface CityDataset {
  attribution: string;
  cities: StoredCity[];
}

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
  const [searching, setSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dataset, setDataset] = useState<CityDataset | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/data/cities.json")
      .then((module) => {
        if (!cancelled) {
          setDataset(module.default as CityDataset);
        }
      })
      .catch(() => {
        // Chunk unreachable (offline, uncached): search stays empty rather
        // than crashing; the service worker precaches it for repeat visits.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2 || dataset === null) {
      return [];
    }
    return dataset.cities.filter((city) => matches(city, trimmed)).slice(0, MAX_RESULTS);
  }, [query, dataset]);

  function choose(city: StoredCity) {
    onSelect(city);
    setQuery("");
    setSearching(false);
    setActiveIndex(0);
    inputRef.current?.blur();
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

  // While the field is idle it displays the chosen city like a filled input;
  // focusing it clears back to search mode, blurring without a pick restores it.
  const selectedLabel = selected ? `${selected.name}, ${selected.country}` : "";
  const inputValue = searching ? query : selectedLabel;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-soft"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="m17 17-4.2-4.2" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="city-results"
          aria-autocomplete="list"
          aria-label="Search for your birth city"
          autoComplete="off"
          placeholder={selected ? "Search for a different city" : "Search for your birth city"}
          value={inputValue}
          onFocus={() => {
            setSearching(true);
            setQuery("");
            setActiveIndex(0);
          }}
          onBlur={() => {
            setSearching(false);
            setQuery("");
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="field-input pl-11 placeholder:text-ink-soft"
        />
      </div>

      {results.length > 0 && (
        <ul
          id="city-results"
          ref={listRef}
          role="listbox"
          aria-label="Matching cities"
          className="max-h-64 overflow-y-auto rounded-field border-[1.5px] border-ink-soft bg-paper-raised"
        >
          {results.map((city, index) => {
            const active = index === activeIndex;
            return (
              <li key={`${city.name}-${city.tz}-${index}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  // Keep focus in the input so onBlur doesn't dismiss the list
                  // before this click lands.
                  onMouseDown={(event) => event.preventDefault()}
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

      {dataset !== null && query.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm text-ink-soft">
          We couldn&rsquo;t find that city. Try the nearest larger town &mdash; timezone is what
          matters.
        </p>
      )}

      {dataset !== null && (
        <p className="text-[11px] leading-snug text-ink-soft">{dataset.attribution}</p>
      )}
    </div>
  );
}
