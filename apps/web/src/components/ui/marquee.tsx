type MarqueeProps = {
  items: string[];
  className?: string;
};

export function Marquee({ items, className = "" }: MarqueeProps) {
  const row = [...items, ...items];

  return (
    <div className={`marquee ${className}`} aria-hidden>
      <div className="marquee__track">
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-6 pr-6 font-mono text-[11px] uppercase tracking-[0.3em] text-bone/55"
          >
            {item}
            <span className="text-ember">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
