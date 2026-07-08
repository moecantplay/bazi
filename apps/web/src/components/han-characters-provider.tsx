/**
 * App-wide access to the "Show Chinese characters" preference. The provider
 * wraps the root layout; any component that renders Han characters reads the
 * flag through useHanCharacters and the Settings toggle writes through it.
 *
 * State initializes straight from localStorage (server-side it falls back to
 * shown). Every consumer sits behind ProfileGate, which renders nothing until
 * after hydration, so the preference is always settled before any Han
 * character can paint — no flash, no hydration mismatch.
 */

"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  loadHanCharactersPreference,
  saveHanCharactersPreference
} from "@/lib/han-characters";

interface HanCharactersContextValue {
  showHanCharacters: boolean;
  setShowHanCharacters: (show: boolean) => void;
}

const HanCharactersContext = createContext<HanCharactersContextValue>({
  showHanCharacters: true,
  setShowHanCharacters: () => undefined
});

interface Props {
  children: ReactNode;
}

export function HanCharactersProvider({ children }: Props) {
  const [showHanCharacters, setShown] = useState(loadHanCharactersPreference);

  function setShowHanCharacters(show: boolean) {
    setShown(show);
    saveHanCharactersPreference(show);
  }

  return (
    <HanCharactersContext.Provider value={{ showHanCharacters, setShowHanCharacters }}>
      {children}
    </HanCharactersContext.Provider>
  );
}

/** The current preference and its setter. Defaults to shown outside a provider. */
export function useHanCharacters(): HanCharactersContextValue {
  return useContext(HanCharactersContext);
}
