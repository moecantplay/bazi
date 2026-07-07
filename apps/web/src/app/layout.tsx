import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daymaster",
  description: "Daily readings from your Four Pillars chart."
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
