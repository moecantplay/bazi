/**
 * A retired screen's address (M24-12): sends old bookmarks and installed
 * apps on to the tab that replaced it, instead of a dead page.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  to: "/today/" | "/ahead/" | "/people/";
}

export function RetiredRoute({ to }: Props) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return <main className="min-h-screen bg-paper" aria-hidden />;
}
