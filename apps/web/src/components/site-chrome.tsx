"use client";

import { usePathname } from "next/navigation";

import { CustomCursor } from "./custom-cursor";
import { Grain } from "./grain";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const bare = new Set([
  "/",
  "/design/brand", // Standalone Oncemore identity and design system.
  "/design/brand-dusk",
  "/design/brand-storm",
  "/design/brand-golden-hour",
  "/design/brand-bright",
  "/design/brand-blue-hour",
  "/design/brand-artwork",
  "/archive/maa-inti-bangaaram",
  "/mib-page", // Short-copy variant with its own page chrome.
  "/og-page", // Full-screen, text-free scroll sequence.
  "/archive/mib",
  "/archive/squish",
  "/archive/squish2",
  "/archive/oncemore2",
  "/archive/transition",
  "/archive/katana",
  "/archive/scroll",
  "/archive/scroll2", // Short-copy OG scroll with its own page chrome.
  "/archive/og2", // Illustrated OG journey with its own page chrome.
  "/archive/og-compare",
  "/archive/mib-compare",
  "/archive/signup",
  "/archive/signup-3d",
  "/archive/profile",
  "/archive/profile2",
]);

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = bare.has(pathname);

  return (
    <>
      {!minimal && <SiteHeader />}
      <main id="main" tabIndex={-1}>{children}</main>
      {!minimal && <SiteFooter />}
      {!minimal && (
        <>
          <Grain />
          <CustomCursor />
        </>
      )}
    </>
  );
}
