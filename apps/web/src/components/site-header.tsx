"use client";

import { useEffect, useRef, useState } from "react";

import { Magnetic } from "@/components/ui/magnetic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const links = [
  { href: "#worlds", label: "Worlds" },
  { href: "#studio", label: "Studio" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!headerRef.current) return;
      const setY = gsap.quickTo(headerRef.current, "yPercent", {
        duration: 0.5,
        ease: "power3.out",
      });

      if (open) {
        setY(0);
        return;
      }

      const trigger = ScrollTrigger.create({
        start: "top -100",
        end: 99999,
        onUpdate: (self) => {
          setY(self.direction === 1 ? -110 : 0);
        },
      });

      return () => trigger.kill();
    },
    { scope: headerRef, dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    const focusables = menu?.querySelectorAll<HTMLElement>("a, button");
    focusables?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 will-change-transform ${open ? "z-50" : "z-40"}`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
          <a
            href="#top"
            className="font-display text-2xl leading-none tracking-tight text-bone md:text-3xl"
          >
            OnceMore<span className="text-ember">.</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/55 transition-colors hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-bone/20 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.26em] text-bone transition-colors hover:border-ember hover:text-ember"
              >
                Start a collab
              </a>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-50 flex size-11 items-center justify-center md:hidden"
          >
            <span
              className={`absolute h-px w-6 bg-bone transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute h-px w-6 bg-bone transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        data-lenis-prevent
        className={`fixed inset-0 z-40 flex flex-col bg-ink/97 px-6 pb-10 pt-28 backdrop-blur-xl transition-[opacity,visibility] duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2" aria-label="Mobile">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-bone/10 py-4 font-display text-4xl text-bone"
            >
              <span className="mr-3 font-mono text-[10px] tracking-[0.3em] text-ember">
                0{index + 1}
              </span>
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="mailto:hello@oncemore.io"
          className="mt-auto font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50"
        >
          hello@oncemore.io
        </a>
      </div>
    </>
  );
}
