/**
 * People (M24-09): saved people first, one button to add someone, and for the
 * chosen person a plain pair reading (a lead, then plain cards). The full
 * comparison stays one tap away on the Compare screen.
 */

"use client";

import { useMemo, useState } from "react";
import { formatLong, pairScreenFor, type StoredProfile } from "@daymaster/presentation";
import { Button } from "@/components/button";
import { CompareForm } from "@/components/compare-form";
import { PlainCardList, PlainLeadBlock } from "@/components/plain/plain-reading";
import { addPerson, loadActivePersonId, loadPeople, removePerson, setActivePersonId } from "@/lib/store";
import type { StoredBirth, StoredPerson } from "@/lib/store-types";
import { takeIncomingShare } from "@/lib/share-link";

interface Props {
  profile: StoredProfile;
}

export function PeopleView({ profile }: Props) {
  // A chart that arrived via share link opens the add form, prefilled.
  const [incoming] = useState<StoredBirth | null>(() => takeIncomingShare());
  const [people, setPeople] = useState<StoredPerson[]>(() => loadPeople());
  const [activeId, setActiveId] = useState<string | null>(() => loadActivePersonId() ?? loadPeople()[0]?.id ?? null);
  const [adding, setAdding] = useState(() => incoming !== null || loadPeople().length === 0);

  const active = people.find((person) => person.id === activeId) ?? null;
  const reading = useMemo(() => (active ? pairScreenFor(profile, active.birth) : null), [profile, active]);

  function choose(id: string) {
    setActivePersonId(id);
    setActiveId(id);
  }

  function handleAdd(name: string, birth: StoredBirth) {
    const person = addPerson(name, birth);
    if (person === null) {
      return;
    }
    setPeople(loadPeople());
    choose(person.id);
    setAdding(false);
  }

  function handleRemove(id: string) {
    removePerson(id);
    const remaining = loadPeople();
    setPeople(remaining);
    if (id === activeId) {
      const next = remaining[0]?.id ?? null;
      setActivePersonId(next);
      setActiveId(next);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {people.length > 0 && (
        <ul className="stack" aria-label="Saved people">
          {people.map((person) => {
            const selected = person.id === activeId;
            return (
              <li key={person.id} className={`flex items-center gap-3 px-4 py-2 ${selected ? "ring-2 ring-inset ring-ink" : ""}`}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(person.id)}
                  className="flex-1 rounded-lg px-1 py-1.5 text-left hover:opacity-80"
                >
                  <span className="block text-[15px] font-semibold text-ink">{person.name}</span>
                  <span className="block text-[12px] text-ink-soft">
                    born {formatLong(person.birth.date)} · {person.birth.city.name}
                  </span>
                </button>
                <Button variant="quiet" onClick={() => handleRemove(person.id)} aria-label={`Remove ${person.name}`}>
                  Remove
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      {adding ? (
        <CompareForm onSave={handleAdd} hasSavedPeople={people.length > 0} initialBirth={incoming ?? undefined} />
      ) : (
        <Button variant="secondary" onClick={() => setAdding(true)}>
          Add someone
        </Button>
      )}

      {active && reading && !adding && (
        <>
          <PlainLeadBlock kicker={`You and ${active.name}`} lead={reading.lead} actionLabel="One thing to try" />
          <PlainCardList cards={reading.cards} />
        </>
      )}
    </div>
  );
}
