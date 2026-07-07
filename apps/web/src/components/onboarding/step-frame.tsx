/**
 * Shared layout for a single onboarding step: a serif title, optional helper
 * line, the step's inputs, and a full-width primary button pinned to the bottom.
 * The button label always says what it does.
 */

import type { ReactNode } from "react";
import { Button } from "@/components/button";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
}

export function StepFrame({
  title,
  subtitle,
  children,
  primaryLabel,
  onPrimary,
  primaryDisabled
}: Props) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
      <div className="pt-8">
        <Button className="w-full" onClick={onPrimary} disabled={primaryDisabled}>
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}
