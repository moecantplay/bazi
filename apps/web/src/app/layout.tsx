import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { HanCharactersProvider } from "@/components/han-characters-provider";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#14171c" }
  ],
  width: "device-width",
  initialScale: 1
};

/**
 * Runs before first paint so a pinned theme never flashes. Mirrors
 * lib/theme.ts (applyThemePreference) — keep the two in sync.
 */
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("daymaster.theme.v1");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    // suppressHydrationWarning: THEME_INIT_SCRIPT stamps data-theme on <html>
    // before hydration, so this one element's attributes legitimately differ
    // from the server HTML. Suppression is attribute-only and one level deep.
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HanCharactersProvider>{children}</HanCharactersProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
