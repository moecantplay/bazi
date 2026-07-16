/**
 * Shared layout for a single onboarding step: a serif title, optional helper
 * line, the step's inputs, and the full-width primary action in flow directly
 * after them (DESIGN.md §Layout — no dead void between input and button).
 * The button label always says what it does. The title takes focus when the
 * step mounts so screen readers announce where the flow has moved.
 */

"use client";

import { useEffect, useRef, type ReactNode } from "react";
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
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-3xl text-ink outline-none">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>}
      <div className="mt-8">{children}</div>
      <div className="mt-10">
        <Button className="w-full" onClick={onPrimary} disabled={primaryDisabled}>
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}
