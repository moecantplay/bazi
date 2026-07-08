/**
 * A quiet Settings section shown only in a browser tab: installing the PWA is
 * both the app-like experience and the data-durability story (browsers evict
 * un-installed sites' storage). Chromium exposes its install prompt through
 * beforeinstallprompt — captured, it becomes an Install button; everywhere
 * else the section explains the browser-menu path.
 */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export function InstallHint() {
  // Assume installed until the effect proves otherwise — no flash of the hint.
  const [standalone, setStandalone] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const iosStandalone =
      "standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true;
    setStandalone(window.matchMedia("(display-mode: standalone)").matches || iosStandalone);

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setStandalone(true);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (standalone) {
    return null;
  }

  return (
    <section>
      <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">
        On your home screen
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink">
        Installed, Daymaster opens like an app, works offline, and your chart is safer from
        browser storage cleanups.
      </p>
      {installPrompt ? (
        <div className="mt-3">
          <Button variant="quiet" onClick={() => void installPrompt.prompt()}>
            Install Daymaster
          </Button>
        </div>
      ) : (
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          Install from your browser&rsquo;s menu — on iPhone: Share, then &ldquo;Add to Home
          Screen&rdquo;.
        </p>
      )}
    </section>
  );
}
