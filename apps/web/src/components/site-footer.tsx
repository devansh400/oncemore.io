const footerLinks = [
  { href: "#worlds", label: "Worlds" },
  { href: "#studio", label: "Studio" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-bone/10 px-5 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="font-display text-3xl leading-none tracking-tight">
              OnceMore<span className="text-ember">.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/50">
              Interactive fan experiences for the films, shows, and worlds people love.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-4" aria-label="Footer">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50 transition-colors hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-bone/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/60">
            © {new Date().getFullYear()} OnceMore.io — All worlds reserved
          </p>
          <a
            href="#top"
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/50 transition-colors hover:text-ember"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
