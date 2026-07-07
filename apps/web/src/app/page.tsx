/**
 * Entry route. Sends the reader to their chart if a profile exists, or to
 * onboarding if not. Renders nothing but a quiet background while it decides.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const profile = loadProfile();
    router.replace(profile ? "/today" : "/onboarding");
  }, [router]);

  return <main className="min-h-screen bg-paper" aria-hidden />;
}
