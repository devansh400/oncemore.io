"use client";

import { usePathname } from "next/navigation";

import { CustomCursor } from "./custom-cursor";
import { Grain } from "./grain";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const bare = new Set([
  "/maa-inti-bangaaram",
  "/mib",
  "/squish",
  "/squish2",
  "/oncemore2",
  "/transition",
  "/katana",
  "/scroll",
  "/signup",
  "/signup-3d",
  "/profile",
  "/profile2",
]);

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = bare.has(pathname);

  return (
    <>
      {!minimal && <SiteHeader />}
      <main id="main">{children}</main>
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
