"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { CompareForm } from "@/components/compare-form";
import { CompareView } from "@/components/compare-view";
import { ProfileGate } from "@/components/profile-gate";
import { formatLong } from "@/lib/dates";
import {
  addPerson,
  loadActivePersonId,
  loadPeople,
  removePerson,
  setActivePersonId,
  type StoredPerson
} from "@/lib/people";
import type { StoredBirth } from "@/lib/profile";
import { takeIncomingShare } from "@/lib/share-link";

export default function ComparePage() {
  // A chart that arrived via share link prefills the add-person form.
  const [incoming] = useState<StoredBirth | null>(() => takeIncomingShare());
  const [people, setPeople] = useState<StoredPerson[]>(() => loadPeople());
  const [activeId, setActiveId] = useState<string | null>(() =>
    incoming !== null ? null : loadActivePersonId()
  );

  const active = people.find((person) => person.id === activeId) ?? null;

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
  }

  function handleChangePerson() {
    setActivePersonId(null);
    setActiveId(null);
  }

  function handleRemove(id: string) {
    removePerson(id);
    setPeople(loadPeople());
  }

  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Compare">
          {active ? (
            <CompareView
              profile={profile}
              person={active}
              onChangePerson={handleChangePerson}
            />
          ) : (
            <div className="flex flex-col gap-8">
              {people.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">
                    Saved people
                  </h2>
                  <ul className="flex flex-col divide-y divide-hairline">
                    {people.map((person) => (
                      <li key={person.id} className="flex items-center gap-3 py-2">
                        <button
                          type="button"
                          onClick={() => choose(person.id)}
                          className="flex-1 rounded-lg px-1 py-1.5 text-left hover:bg-paper-raised"
                        >
                          <span className="block text-[15px] text-ink">{person.name}</span>
                          <span className="block text-[12px] text-ink-soft">
                            born {formatLong(person.birth.date)} · {person.birth.city.name}
                          </span>
                        </button>
                        <Button
                          variant="quiet"
                          onClick={() => handleRemove(person.id)}
                          aria-label={`Remove ${person.name}`}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <CompareForm
                onSave={handleAdd}
                hasSavedPeople={people.length > 0}
                initialBirth={incoming ?? undefined}
              />
            </div>
          )}
        </AppShell>
      )}
    </ProfileGate>
  );
}
