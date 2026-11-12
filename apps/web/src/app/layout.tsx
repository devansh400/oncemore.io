import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import { SiteChrome } from "@/components/site-chrome";

const instrument = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnceMore — Interactive fan experiences",
  description:
    "OnceMore builds AI-powered interactive worlds for films, shows, and IP — launched at the exact moment fans are ready to live inside them.",
  openGraph: {
    title: "OnceMore — Interactive fan experiences",
    description:
      "AI-powered interactive worlds for films, shows, and IP. 1M fans in under 42 hours.",
    type: "website",
    siteName: "OnceMore",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnceMore — Interactive fan experiences",
    description:
      "AI-powered interactive worlds for films, shows, and IP. 1M fans in under 42 hours.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${instrument.variable} ${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-svh bg-ink text-bone antialiased">
        <a
          href="#main"
          className="sr-only rounded-full bg-ember px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]"
        >
          Skip to content
        </a>

        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
