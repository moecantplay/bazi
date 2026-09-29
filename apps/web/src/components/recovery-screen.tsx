/**
 * Shown by the route error boundaries (app/error.tsx, app/global-error.tsx)
 * when a screen throws while rendering — usually a damaged stored profile the
 * engine can't read. Every gated screen reads the same profile, so the reader
 * may not be able to reach Settings: this screen carries Settings' two data
 * actions itself. Base tokens and Button only, so every look and theme
 * restyles it without a look-specific composition (M19.8-01).
 */

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/button";
import { track } from "@/lib/analytics";
import { downloadBackup, serializeBackup } from "@/lib/backup";
import { deleteAllData } from "@/lib/store";

interface Props {
  onRetry: () => void;
  /** The thrown error's name, for usage counts — never its message. */
  errorName: string;
}

/** Whether a backup can be produced; a store too damaged to serialize hides the button. */
function backupAvailable(): boolean {
  try {
    return serializeBackup() !== null;
  } catch {
    return false;
  }
}

export function RecoveryScreen({ onRetry, errorName }: Props) {
  const pathname = usePathname();
  const [canDownload] = useState(backupAvailable);
  const [confirmingStartOver, setConfirmingStartOver] = useState(false);

  useEffect(() => {
    track({ name: "screen-error", data: { route: pathname, kind: errorName } });
  }, [pathname, errorName]);

  function startOver() {
    track({ name: "data-deleted" });
    deleteAllData();
    // A full load, not a client transition: nothing from the failed render survives.
    window.location.assign("/onboarding/");
  }

  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto flex min-h-screen w-full max-w-app flex-col px-5 pb-10 pt-16">
        <h1 className="font-display text-3xl text-ink">This screen didn&rsquo;t open</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Something in the saved data or the app stopped it. Your chart is still on this device.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <Button className="w-full" onClick={onRetry}>
            Try again
          </Button>
          {canDownload && (
            <Button variant="secondary" className="w-full" onClick={downloadBackup}>
              Download my data
            </Button>
          )}
        </div>

        <section className="mt-12">
          {confirmingStartOver ? (
            <div className="flex flex-col gap-3">
              <p className="text-[15px] leading-relaxed text-ink">
                This erases your chart, your saved people, your day notes, and every preference
                from this device. It can&rsquo;t be undone.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="destructive" onClick={startOver}>
                  Erase and start over
                </Button>
                <Button variant="quiet" onClick={() => setConfirmingStartOver(false)}>
                  Keep it
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="destructive" onClick={() => setConfirmingStartOver(true)}>
              Start over
            </Button>
          )}
        </section>
      </main>
    </div>
  );
}
