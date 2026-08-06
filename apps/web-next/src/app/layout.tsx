import type { Metadata, Viewport } from "next";
import { Figtree, Bricolage_Grotesque, Space_Mono } from "next/font/google";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap"
});

/** Display register (DESIGN.md §Type): headline hook, section titles. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-bricolage",
  display: "swap"
});

/** Label register: kickers, citations, form labels, map/elevation annotations —
    the face that makes the screen read as a map (DESIGN.md §Type). */
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Daymaster",
  description: "Daily readings from your Four Pillars chart.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  appleWebApp: { capable: true, title: "Daymaster", statusBarStyle: "default" }
};

export const viewport: Viewport = {
  // Wood terrain's ground (tokens.generated.css's default before a profile
  // exists and data-terrain is stamped) — matches apps/web's layout.tsx.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0EEE2" },
    { media: "(prefers-color-scheme: dark)", color: "#161911" }
  ],
  width: "device-width",
  initialScale: 1
};

/**
 * Runs before first paint so a pinned theme never flashes. Reads the v2
 * store's `theme` field first; falls back to the legacy `daymaster.theme.v1`
 * key for a device that hasn't opened the app since cutover yet (the
 * migration itself runs later, client-side, the first time something calls
 * `loadStore()` — see lib/store.ts). Mirrors store.ts/store-migration.ts;
 * keep the two in sync.
 */
const THEME_INIT_SCRIPT = `try{var t=null;var raw=localStorage.getItem("daymaster.store.v2");if(raw){try{var parsed=JSON.parse(raw);if(parsed&&(parsed.theme==="light"||parsed.theme==="dark")){t=parsed.theme}}catch(e){}}if(t===null){var legacy=localStorage.getItem("daymaster.theme.v1");if(legacy==="light"||legacy==="dark"){t=legacy}}if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    // suppressHydrationWarning: THEME_INIT_SCRIPT stamps data-theme on <html>
    // before hydration, so this one element's attributes legitimately differ
    // from the server HTML. Suppression is attribute-only and one level deep.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${figtree.variable} ${bricolage.variable} ${spaceMono.variable}`}
    >
      <body className="font-sans">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
