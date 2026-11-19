/*
 * Props drawn in code: the golden ticket (it carries the fan's name, so it
 * has to be live), the collar tag that shows the code, and the glyphs etched
 * into each pane. Lit like the scene: warm from the upper right.
 */
import { useId, type SVGProps } from "react";

const markPaths = (
  <>
    <path
      d="M48.7 13.9A25 25 0 1 0 48.7 50.1"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path d="M38 10a24 24 0 0 1 0 44A28 28 0 0 0 38 10Z" fill="currentColor" />
    <circle cx="53" cy="32" r="3" fill="currentColor" />
  </>
);

/** The golden ticket. `name` is frost-etched onto it as the fan types. */
export function GoldenTicket({
  name = "",
  glow = 0.6,
  className,
}: {
  name?: string;
  glow?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const outline =
    "M14 0H226A14 14 0 0 1 240 14V42A12 12 0 0 0 240 66V94A14 14 0 0 1 226 108H14A14 14 0 0 1 0 94V66A12 12 0 0 0 0 42V14A14 14 0 0 1 14 0Z";
  const fontSize = name.length > 16 ? 13 : name.length > 10 ? 16 : 20;

  return (
    <svg viewBox="-12 -12 264 132" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}gold`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF0C2" />
          <stop offset="0.28" stopColor="#F2C76A" />
          <stop offset="0.62" stopColor="#D49433" />
          <stop offset="1" stopColor="#8F5A1E" />
        </linearGradient>
        <linearGradient id={`${id}sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}halo`}>
          <stop offset="0" stopColor="#FFD58A" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFB45C" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}clip`}>
          <path d={outline} />
        </clipPath>
        <filter id={`${id}frost`} x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>
      <ellipse cx="120" cy="54" rx="150" ry="80" fill={`url(#${id}halo)`} opacity={glow} />
      <path d={outline} fill={`url(#${id}gold)`} />
      <g clipPath={`url(#${id}clip)`}>
        {/* Fine guilloche lines. */}
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            d={`M0 ${14 + i * 10} Q60 ${8 + i * 10} 120 ${14 + i * 10} T240 ${14 + i * 10}`}
            fill="none"
            stroke="#7A4A14"
            strokeOpacity="0.12"
          />
        ))}
        <rect
          className="fetch-ticket-sheen"
          x="-120"
          y="-20"
          width="90"
          height="150"
          fill={`url(#${id}sheen)`}
          transform="skewX(-18)"
        />
      </g>
      <path
        d={outline}
        fill="none"
        stroke="#FFF6DD"
        strokeOpacity="0.8"
        strokeWidth="1.2"
        transform="translate(6 6) scale(0.95)"
      />
      {/* Stub perforation. */}
      <path d="M180 8V100" stroke="#6E4214" strokeOpacity="0.45" strokeDasharray="2 5" />
      <g transform="translate(190 34) scale(0.62)" color="#6E4214" opacity="0.8">
        {markPaths}
      </g>
      {/* Admit-one star. */}
      <path
        d="M30 30l3.5 7.2 7.9 1.1-5.7 5.6 1.3 7.9-7-3.7-7 3.7 1.3-7.9-5.7-5.6 7.9-1.1z"
        fill="#6E4214"
        opacity="0.55"
      />
      {name ? (
        <text
          x="104"
          y="64"
          textAnchor="middle"
          fontFamily="var(--brand-display), system-ui, sans-serif"
          fontWeight="600"
          fontSize={fontSize}
          fill="#FFF9EA"
          stroke="#6E4214"
          strokeOpacity="0.35"
          strokeWidth="0.6"
          filter={`url(#${id}frost)`}
        >
          {name}
        </text>
      ) : (
        <path d="M64 62H146" stroke="#6E4214" strokeOpacity="0.3" strokeDasharray="1 4" />
      )}
      <path d={outline} fill="none" stroke="#5A3410" strokeOpacity="0.5" />
    </svg>
  );
}

/** The dog's collar tag, flipped to show the code. */
export function CollarTag({ code, className }: { code: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}metal`} cx="0.68" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.3" stopColor="#D9E6F2" />
          <stop offset="0.75" stopColor="#8A9AAC" />
          <stop offset="1" stopColor="#4C5868" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="14" r="9" fill="none" stroke="#B9C4D0" strokeWidth="4" />
      <circle cx="60" cy="80" r="56" fill={`url(#${id}metal)`} />
      <circle cx="60" cy="80" r="49" fill="none" stroke="#3E4958" strokeOpacity="0.35" />
      <circle cx="60" cy="30" r="5" fill="#3E4958" opacity="0.6" />
      <text
        x="60"
        y="90"
        textAnchor="middle"
        fontFamily="ui-monospace, 'Geist Mono', monospace"
        fontWeight="700"
        fontSize="22"
        letterSpacing="1"
        fill="#2A323D"
        fillOpacity="0.85"
      >
        {code.slice(0, 3)}
        <tspan dx="5">{code.slice(3)}</tspan>
      </text>
      <ellipse cx="80" cy="50" rx="16" ry="7" fill="#8FCBFF" opacity="0.55" transform="rotate(-30 80 50)" />
    </svg>
  );
}

type GlyphProps = SVGProps<SVGSVGElement>;

/* Etched glyphs: one per pane. Thin strokes, read as engraved into glass. */
export function PhoneGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="14" y="5" width="20" height="38" rx="4" />
      <path d="M21 10h6M22 38h4" strokeLinecap="round" />
    </svg>
  );
}

export function MessageGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M8 12h32a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H22l-8 7v-7H8a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3Z" />
      <circle cx="16" cy="23" r="1.6" fill="currentColor" />
      <circle cx="24" cy="23" r="1.6" fill="currentColor" />
      <circle cx="32" cy="23" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function NameTagGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M6 16h36v22a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3Z" />
      <path d="M18 16v-5a6 6 0 0 1 12 0v5" />
      <circle cx="17" cy="28" r="4" />
      <path d="M25 26h11M25 32h8" strokeLinecap="round" />
    </svg>
  );
}

export function PawGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
      <ellipse cx="24" cy="31" rx="9" ry="8" />
      <ellipse cx="13" cy="20" rx="4" ry="5.2" transform="rotate(-18 13 20)" />
      <ellipse cx="20" cy="12.5" rx="4" ry="5.4" />
      <ellipse cx="28" cy="12.5" rx="4" ry="5.4" />
      <ellipse cx="35" cy="20" rx="4" ry="5.2" transform="rotate(18 35 20)" />
    </svg>
  );
}

export function SoundGlyph({ muted, ...props }: GlyphProps & { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 9h4l5-4v14l-5-4H4z" />
      {muted ? (
        <path d="M17 9l5 6M22 9l-5 6" />
      ) : (
        <path d="M16.5 8.5a5 5 0 0 1 0 7M19.5 5.5a9 9 0 0 1 0 13" />
      )}
    </svg>
  );
}

export function CloseGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
