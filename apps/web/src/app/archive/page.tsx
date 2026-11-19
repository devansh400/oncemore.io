import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Archive — OnceMore",
  description: "Index of archived OnceMore experiments and campaign pages.",
};

const routes = [
  "/archive/katana",
  "/archive/maa-inti-bangaaram",
  "/archive/mib",
  "/archive/mib-compare",
  "/archive/og-compare",
  "/archive/og2",
  "/archive/oncemore",
  "/archive/oncemore2",
  "/archive/profile",
  "/archive/profile2",
  "/archive/scroll",
  "/archive/scroll2",
  "/archive/signup",
  "/archive/signup-3d",
  "/archive/squish",
  "/archive/squish2",
  "/archive/transition",
];

export default function ArchiveIndexPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Archive</h1>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {routes.map((href) => (
          <li key={href}>
            <Link href={href} style={{ textDecoration: "underline" }}>
              {href}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
