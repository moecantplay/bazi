/**
 * Registers the service worker (production only — dev keeps live reloading
 * uncached) and owns the update flow: when a new deploy has installed and is
 * waiting, a quiet bar offers a refresh; accepting posts SKIP_WAITING and
 * reloads once the new worker takes control. Installed PWAs rarely navigate,
 * so we also re-check for updates whenever the app returns to the foreground.
 */

"use client";

import { useEffect, useRef, useState } from "react";

export function ServiceWorker() {
  const [waiting, setWaiting] = useState<globalThis.ServiceWorker | null>(null);
  // Only an update the user accepted may reload the page — clients.claim()
  // also fires controllerchange on the very first install, mid-session.
  const accepted = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let reloading = false;
    const onControllerChange = () => {
      if (!accepted.current || reloading) {
        return;
      }
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    let onVisible: (() => void) | null = null;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // An update may already be waiting from a previous visit.
        if (registration.waiting && navigator.serviceWorker.controller) {
          setWaiting(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) {
            return;
          }
          installing.addEventListener("statechange", () => {
            // "installed" with an existing controller = a new version waiting
            // behind the one running this page (not the first-ever install).
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              setWaiting(installing);
            }
          });
        });

        onVisible = () => {
          if (document.visibilityState === "visible") {
            registration.update().catch(() => {
              // Offline or a flaky check; the next foreground retries.
            });
          }
        };
        document.addEventListener("visibilitychange", onVisible);
      })
      .catch(() => {
        // Registration failures must never break the app; offline is a bonus.
      });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      if (onVisible) {
        document.removeEventListener("visibilitychange", onVisible);
      }
    };
  }, []);

  if (!waiting) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-20 z-50 mx-auto flex w-fit max-w-[92vw] items-center gap-4 rounded-full border border-hairline bg-paper-raised py-2 pl-5 pr-2 shadow-lg"
    >
      <p className="text-[13px] text-ink">A new version is ready.</p>
      <button
        type="button"
        onClick={() => {
          accepted.current = true;
          waiting.postMessage("SKIP_WAITING");
        }}
        className="rounded-full bg-ink px-4 py-1.5 text-[13px] font-medium text-paper"
      >
        Refresh
      </button>
    </div>
  );
}
