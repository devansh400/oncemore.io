import Link from "next/link";

import { glassFocus, glassPill } from "@/lib/glass";

const navLink = `${glassFocus} grid min-h-11 place-items-center rounded-full px-2 text-sm hover:bg-white/10 sm:px-3`;

export function WorldsNav({
  className,
  onLanding = false,
}: {
  className?: string;
  onLanding?: boolean;
}) {
  return (
    <nav
      aria-label="OnceMore"
      className={`${glassPill} flex items-center justify-between gap-2 px-4 py-2 sm:px-6 ${className ?? ""}`}
    >
      <a
        href="/"
        aria-current={onLanding ? "page" : undefined}
        className={`${glassFocus} flex min-h-11 items-center rounded-full px-1 text-lg leading-none font-semibold tracking-tight sm:text-2xl`}
      >
        oncemore
      </a>
      <div className="flex gap-1 sm:gap-2">
        <a href={onLanding ? "#gl" : "/"} className={navLink}>
          Worlds
        </a>
        <Link href="/design/brand" className={navLink}>
          About
        </Link>
        <a href="mailto:hello@oncemore.io" className={navLink}>
          Contact
        </a>
      </div>
    </nav>
  );
}
