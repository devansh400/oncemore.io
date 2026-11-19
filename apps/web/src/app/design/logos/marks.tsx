import { type ReactNode, useId } from "react";

/*
 * Logo concepts for OnceMore. Every mark is drawn on a 120-unit grid in
 * currentColor, with one optional accent in var(--logo-accent), so each one
 * works on glass, on Midnight and on Cloud without separate artwork.
 */

const accent = "var(--logo-accent)";

function polar(cx: number, cy: number, r: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
}

/** A clockwise arc. Angles in degrees, 0 at three o'clock. */
function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const [x0, y0] = polar(cx, cy, r, from);
  const [x1, y1] = polar(cx, cy, r, to);
  const sweep = (((to - from) % 360) + 360) % 360;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function Mark({ children, size }: { children: ReactNode; size: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {children}
    </svg>
  );
}

type MarkProps = { size: number };

function Eclipse({ size }: MarkProps) {
  return (
    <Mark size={size}>
      <circle cx="60" cy="60" r="36" stroke="currentColor" strokeWidth="5" opacity="0.22" />
      <path d={arc(60, 60, 36, -150, 60)} stroke={accent} strokeWidth="8" />
      <circle cx="60" cy="60" r="27" fill="currentColor" opacity="0.08" />
    </Mark>
  );
}

function EncoreLoop({ size }: MarkProps) {
  return (
    <Mark size={size}>
      <circle cx="43" cy="60" r="21" stroke="currentColor" strokeWidth="7" />
      <circle cx="77" cy="60" r="21" stroke={accent} strokeWidth="7" />
      {/* The first ring passes back over the second, so the two read as linked. */}
      <path d={arc(43, 60, 21, 18, 56)} stroke="currentColor" strokeWidth="7" />
    </Mark>
  );
}

function Return({ size }: MarkProps) {
  const r = 34;
  const end = 245;
  const [ex, ey] = polar(60, 60, r, end);
  const heading = end + 90;
  const [tx, ty] = polar(ex, ey, 7, heading);
  const [ax, ay] = polar(tx, ty, 13, heading + 145);
  const [bx, by] = polar(tx, ty, 13, heading - 145);
  const [sx, sy] = polar(60, 60, r, -55);
  return (
    <Mark size={size}>
      <path d={arc(60, 60, r, -55, end)} stroke="currentColor" strokeWidth="8" />
      <path d={`M${ax} ${ay}L${tx} ${ty}L${bx} ${by}`} stroke="currentColor" strokeWidth="8" />
      <circle cx={sx} cy={sy} r="7" fill={accent} />
    </Mark>
  );
}

function Horizon({ size }: MarkProps) {
  const clip = useId();
  return (
    <Mark size={size}>
      <defs>
        <clipPath id={clip}>
          <circle cx="60" cy="60" r="37" />
        </clipPath>
      </defs>
      <circle cx="74" cy="46" r="8" fill={accent} />
      <g clipPath={`url(#${clip})`} fill="currentColor">
        <circle cx="38" cy="86" r="17" />
        <circle cx="61" cy="80" r="19" />
        <circle cx="85" cy="88" r="15" />
        <rect x="18" y="88" width="84" height="20" />
      </g>
      <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="5" />
    </Mark>
  );
}

function FloatingWorld({ size }: MarkProps) {
  return (
    <Mark size={size}>
      <circle cx="60" cy="42" r="21" stroke="currentColor" strokeWidth="7" />
      <path
        d="M24 70H96L84 79L76 91L66 98L60 108L53 96L44 90L36 80Z"
        fill="currentColor"
      />
      <circle cx="93" cy="22" r="5" fill={accent} />
    </Mark>
  );
}

function Portal({ size }: MarkProps) {
  return (
    <Mark size={size}>
      <circle cx="60" cy="56" r="44" stroke="currentColor" strokeWidth="3" opacity="0.3" />
      <circle cx="60" cy="60" r="31" stroke="currentColor" strokeWidth="4.5" opacity="0.6" />
      <circle cx="60" cy="64" r="18" stroke={accent} strokeWidth="6.5" />
    </Mark>
  );
}

function FiveWorlds({ size }: MarkProps) {
  const sizes = [9, 6, 7.5, 5.5, 6.5];
  return (
    <Mark size={size}>
      <circle cx="60" cy="60" r="36" stroke="currentColor" strokeWidth="1.5" opacity="0.28" />
      {[-90, -18, 54, 126, 198].map((angle, index) => {
        const [x, y] = polar(60, 60, 36, angle);
        return (
          <circle
            key={angle}
            cx={x}
            cy={y}
            r={sizes[index]}
            fill={index === 0 ? accent : "currentColor"}
          />
        );
      })}
    </Mark>
  );
}

function Summit({ size }: MarkProps) {
  return (
    <Mark size={size}>
      <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="6.5" />
      <path d="M33 78L47 54L60 70L73 54L87 78" stroke="currentColor" strokeWidth="6.5" />
      <circle cx="78" cy="38" r="6" fill={accent} />
    </Mark>
  );
}

function Crescent({ size }: MarkProps) {
  const mask = useId();
  return (
    <Mark size={size}>
      <defs>
        <mask id={mask}>
          <rect width="120" height="120" fill="#fff" />
          <circle cx="74" cy="48" r="30" fill="#000" />
        </mask>
      </defs>
      <circle cx="60" cy="60" r="38" fill="currentColor" mask={`url(#${mask})`} />
      <circle cx="84" cy="40" r="5" fill={accent} />
    </Mark>
  );
}

function Lettermark({ size }: MarkProps) {
  return (
    <Mark size={size}>
      <text
        x="58"
        y="79"
        textAnchor="middle"
        fill="currentColor"
        fontSize="62"
        fontWeight="600"
        letterSpacing="-3"
        style={{ fontFamily: "var(--brand-display)" }}
      >
        om
      </text>
      <circle cx="98" cy="40" r="6" fill={accent} />
    </Mark>
  );
}

function Echo({ size }: MarkProps) {
  return (
    <Mark size={size}>
      <circle cx="80" cy="60" r="26" stroke="currentColor" strokeWidth="6" opacity="0.16" />
      <circle cx="64" cy="60" r="26" stroke="currentColor" strokeWidth="6" opacity="0.42" />
      <circle cx="44" cy="60" r="26" stroke="currentColor" strokeWidth="6.5" />
      <circle cx="44" cy="60" r="5" fill={accent} />
    </Mark>
  );
}

function Keepsake({ size }: MarkProps) {
  const mask = useId();
  return (
    <Mark size={size}>
      <defs>
        <mask id={mask}>
          <rect x="16" y="32" width="88" height="56" rx="10" fill="#fff" />
          <circle cx="16" cy="60" r="8" fill="#000" />
          <circle cx="104" cy="60" r="8" fill="#000" />
          <circle cx="44" cy="60" r="13" stroke="#000" strokeWidth="5.5" fill="none" />
          <path d="M66 50H90M66 60H84M66 70H78" stroke="#000" strokeWidth="4.5" />
        </mask>
      </defs>
      <rect x="16" y="32" width="88" height="56" rx="10" fill="currentColor" mask={`url(#${mask})`} />
      <circle cx="44" cy="60" r="4.5" fill={accent} />
    </Mark>
  );
}

export type Concept = {
  id: string;
  name: string;
  idea: string;
  why: string;
  Mark: (props: MarkProps) => ReactNode;
};

export const concepts: Concept[] = [
  {
    id: "eclipse",
    name: "Eclipse",
    idea: "The O as the eclipse over the Floating Worlds, its lit crescent on the sun's side.",
    why: "It's already the moment a visitor enters the sky in the preloader, so the logo and the opening animation become one gesture.",
    Mark: Eclipse,
  },
  {
    id: "encore",
    name: "Encore loop",
    idea: "Two linked rings: once, and more. The second one is lit.",
    why: "Reads as a pair of Os, a link and an infinity sign at once, which fits a platform built on fans coming back.",
    Mark: EncoreLoop,
  },
  {
    id: "return",
    name: "Return",
    idea: "An O drawn as one stroke that turns back on itself, starting from a point of light.",
    why: "The most literal 'once more'. Clear at any size, and it suggests replay without looking like a media player.",
    Mark: Return,
  },
  {
    id: "horizon",
    name: "Horizon",
    idea: "A window onto the cloud sea, with the low sun just above it.",
    why: "Carries the landing scene into a single badge. Strong as an app icon, quieter in a lockup.",
    Mark: Horizon,
  },
  {
    id: "floating-world",
    name: "Floating world",
    idea: "The O resting on an island of rock, drifting in the sky.",
    why: "Ties the name to the worlds directly. The silhouette is distinctive, but it carries more detail than a favicon wants.",
    Mark: FloatingWorld,
  },
  {
    id: "portal",
    name: "Portal",
    idea: "Rings that step inward and down, like looking into a world.",
    why: "Each campaign is a world you enter. The depth reads even in one colour, and the lit inner ring gives it a focus.",
    Mark: Portal,
  },
  {
    id: "five-worlds",
    name: "Five worlds",
    idea: "Five points of light orbiting one O, one for each island in the sky.",
    why: "Describes the platform: many properties, one place. Built from dots, so it can animate as worlds come online.",
    Mark: FiveWorlds,
  },
  {
    id: "summit",
    name: "Summit",
    idea: "An O framing an M of peaks, with the sun rising over them.",
    why: "A true OM monogram. Feels adventurous and cinematic, and holds together down to small sizes.",
    Mark: Summit,
  },
  {
    id: "crescent",
    name: "Crescent",
    idea: "The O as a crescent moon, with one star in its curve.",
    why: "Night holds the light. The simplest silhouette here, and the one that works best as a single-colour stamp.",
    Mark: Crescent,
  },
  {
    id: "lettermark",
    name: "Lettermark",
    idea: "A tight 'om' in Bricolage Grotesque, with a point of light for a tittle.",
    why: "Keeps the brand typeface front and centre. Pairs naturally with the full wordmark and needs no new symbol.",
    Mark: Lettermark,
  },
  {
    id: "echo",
    name: "Echo",
    idea: "One O and its echoes, fading as they repeat.",
    why: "Repetition made visible: the same moment, once more. Easy to animate, though the echoes thin out at favicon size.",
    Mark: Echo,
  },
  {
    id: "keepsake",
    name: "Keepsake",
    idea: "A ticket stub with the O punched through it.",
    why: "Fans leave every OnceMore experience with something personal, like the OG Fire Cards. This puts the keepsake in the mark.",
    Mark: Keepsake,
  },
];
