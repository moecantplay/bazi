/**
 * Last-resort boundary for an error in the root layout itself. It replaces
 * the layout, so it brings its own <html>, <body> and stylesheet (M19.8-01).
 */

"use client";

import { RecoveryScreen } from "@/components/recovery-screen";
import "./globals.css";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="en">
      <body className="font-sans">
        <RecoveryScreen onRetry={reset} errorName={error.name} />
      </body>
    </html>
  );
}
