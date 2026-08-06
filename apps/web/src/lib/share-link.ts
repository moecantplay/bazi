/**
 * Chart share links: the birth details encoded into a URL, no server anywhere.
 * The engine is deterministic, so the recipient's device recomputes the exact
 * same chart from the payload. Links land on /onboarding/?share=…, which
 * routes them to Compare (or keeps them for after onboarding on a fresh
 * device) — a shared chart is always someone to compare with, never a
 * replacement for your own.
 *
 * Ported from apps/web/src/lib/share-link.ts, adjusted to the v2 store's
 * shapes; the stash key is store.ts's already-reserved `SHARE_INCOMING_KEY`
 * rather than a second copy of the literal.
 */

import { SHARE_INCOMING_KEY } from "./store";
import { isStoredBirth, type StoredBirth } from "./store-types";

export const SHARE_PARAM = "share";

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(encoded: string): string | null {
  try {
    const binary = atob(encoded.replaceAll("-", "+").replaceAll("_", "/"));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/** The absolute share URL for a birth, anchored at this deployment's origin. */
export function buildShareUrl(birth: StoredBirth): string {
  const payload = toBase64Url(JSON.stringify(birth));
  return `${window.location.origin}/onboarding/?${SHARE_PARAM}=${payload}`;
}

/** Decode and validate a share parameter; anything malformed reads as null. */
export function decodeShareParam(value: string): StoredBirth | null {
  const json = fromBase64Url(value);
  if (json === null) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(json);
    return isStoredBirth(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Hold a decoded share for the Compare screen (session-scoped). */
export function stashIncomingShare(birth: StoredBirth): void {
  try {
    window.sessionStorage.setItem(SHARE_INCOMING_KEY, JSON.stringify(birth));
  } catch {
    // Storage denied: the link just won't prefill the form.
  }
}

/** Take (and clear) a stashed share, if one is waiting. */
export function takeIncomingShare(): StoredBirth | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(SHARE_INCOMING_KEY);
    if (raw === null) {
      return null;
    }
    window.sessionStorage.removeItem(SHARE_INCOMING_KEY);
    const parsed: unknown = JSON.parse(raw);
    return isStoredBirth(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
