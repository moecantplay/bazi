/** Route error boundary for every screen under the root layout (M19.8-01). */

"use client";

import { RecoveryScreen } from "@/components/recovery-screen";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ScreenError({ error, reset }: Props) {
  return <RecoveryScreen onRetry={reset} errorName={error.name} />;
}
