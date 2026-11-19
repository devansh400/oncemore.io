/*
 * The vector dog: one rig, posed by a table, rendered to standalone SVG.
 * Same frame contract as the painted art: 1024×1024, facing right, paws on a
 * ground line at y = 900, one fixed scale. Built to files by
 * scripts/build-fetch-dog.ts; painted frames replace these one by one.
 *
 * Lighting follows the scene and the glass system: a low warm sun at the
 * upper right gives every part a warm rim on that side, with cool, deep
 * shadows toward the lower left. Each part is drawn through a mask: a rim
 * layer, then the shaded part offset down-left so a sliver of rim shows.
 */

type Vec = [number, number];
type Eye = "open" | "wide" | "closed" | "happy" | "sad";

type Pose = {
  /** Torso rotation in degrees (positive tips the chest down). */
  rot: number;
  /** Torso centre; y is ignored when grounded. */
  at?: Vec;
  grounded?: boolean;
  /** Whole-body spin about the torso centre (tumbles). */
  spin?: number;
  /** World leg angles from straight down; positive points forward (right). */
  front: [near: number[], far: number[]];
  hind: [near: number[], far: number[]];
  neck: { angle: number; length: number };
  head: {
    rot: number;
    mouth?: number;
    eye?: Eye;
    /** Floppy ear: positive folds forward, negative streams back. */
    flop?: number;
    /** Upright ear: positive lays it back. */
    prick?: number;
    tongue?: boolean;
  };
  tail?: number;
  ticket?: "mouth" | "paws";
  puff?: boolean;
  /** Ground the head too (sleeping). */
  headDown?: boolean;
};

const GROUND = 900;
const CENTRE_X = 468;

/* ---------- Palette ---------- */
const colour = {
  rim: "#FFD7A0",
  coatLight: "#E8A25B",
  coatMid: "#C47637",
  coatDark: "#6F3A28",
  farLight: "#B8693A",
  farDark: "#4A2A2C",
  white: "#FFF4E4",
  whiteShade: "#B9B4C8",
  outline: "#1C1420",
  nose: "#231A1F",
  mouth: "#4E1A22",
  tongue: "#E2777C",
  eye: "#E8A33A",
  pupil: "#1A1216",
  collar: "#6A3B25",
  innerEar: "#C98478",
};

/* ---------- Geometry ---------- */
const rad = (deg: number) => (deg * Math.PI) / 180;
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s];
/** Direction for a world limb angle measured from straight down, positive forward. */
const limbDir = (deg: number): Vec => [Math.sin(rad(deg)), Math.cos(rad(deg))];
const rotate = ([x, y]: Vec, deg: number): Vec => {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [x * c - y * s, x * s + y * c];
};
const f = (n: number) => n.toFixed(1);
const pt = ([x, y]: Vec) => `${f(x)} ${f(y)}`;

/* ---------- Parts, in local coordinates (facing right) ---------- */
const TORSO =
  "M 112 -70 C 40 -82, -90 -78, -150 -66 C -196 -57, -214 -12, -198 28 C -188 58, -162 76, -132 72 C -92 66, -72 40, -32 44 C 18 50, 62 70, 122 82 C 166 88, 198 56, 192 14 C 188 -22, 168 -56, 112 -70 Z";
const TORSO_UNDERSIDE: Vec[] = [
  [-198, 28],
  [-176, 62],
  [-140, 74],
  [-60, 46],
  [40, 58],
  [122, 82],
  [180, 52],
];
const CHEST_BLAZE =
  "M 190 -6 C 198 34, 176 74, 136 84 C 120 70, 146 36, 156 -2 C 162 -22, 184 -26, 190 -6 Z";
const BACK_FUR = "M 96 -72 l -10 -10 l -2 12 M 40 -78 l -10 -9 l -1 11 M -20 -78 l -9 -8 l -1 10";
const SHOULDER: [Vec, Vec] = [
  [124, 22],
  [110, 16],
];
const HIP: [Vec, Vec] = [
  [-150, 24],
  [-136, 18],
];
const NECK_BASE: Vec = [150, -36];
const TAIL_BASE: Vec = [-190, -44];
const TAIL =
  "M -190 -44 C -232 -96, -218 -156, -172 -154 C -140 -152, -136 -120, -158 -110";

const SKULL =
  "M -58 -6 C -60 -44, -26 -62, 8 -60 C 40 -58, 58 -40, 62 -20 L 62 30 C 40 50, -10 58, -38 44 C -58 32, -60 14, -58 -6 Z";
const MUZZLE = "M 26 -34 C 60 -36, 96 -24, 116 -12 C 126 -5, 124 8, 112 11 L 30 16 Z";
const JAW = "M 32 10 L 104 12 C 109 18, 101 26, 88 29 C 66 33, 44 35, 28 30 Z";
const FAR_EAR = "M -34 -28 L -22 -124 L 16 -46 Z";
/* Hangs from the crown behind the eye, never over it. */
const FLOP_EAR =
  "M -36 -38 C -30 -66, 4 -70, 12 -50 C 18 -32, 10 -4, -4 10 C -18 0, -32 -18, -36 -38 Z";
const CHEEK = "M -40 30 q -10 4 -20 2 M -34 38 q -8 6 -18 6";

/* ---------- Poses ---------- */
const stand = {
  rot: 0,
  front: [
    [6, -4],
    [-4, 4],
  ],
  hind: [
    [32, -32, 6],
    [22, -38, 2],
  ],
  neck: { angle: -42, length: 70 },
  head: { rot: 0, eye: "open" as Eye, flop: 0 },
  tail: 0,
} satisfies Pose;

const sit = {
  rot: -42,
  front: [
    [4, 2],
    [-4, -2],
  ],
  hind: [
    [95, -62, 92],
    [88, -66, 90],
  ],
  neck: { angle: -56, length: 64 },
  head: { rot: -12, eye: "open" as Eye, flop: 0 },
  tail: 10,
} satisfies Pose;

export const poses: Record<string, Pose> = {
  "sit-idle": { ...sit, head: { ...sit.head, rot: -22 } },
  "look-up": {
    ...stand,
    neck: { angle: -68, length: 74 },
    head: { rot: -46, eye: "wide", flop: -12, prick: -6 },
    tail: -6,
  },
  "head-tilt": {
    ...sit,
    head: { rot: 24, eye: "wide", flop: 30, prick: 6 },
    neck: { angle: -60, length: 64 },
  },
  crouch: {
    rot: 12,
    front: [
      [-42, 40],
      [-36, 46],
    ],
    hind: [
      [64, -62, 22],
      [56, -66, 16],
    ],
    neck: { angle: -18, length: 60 },
    head: { rot: -14, eye: "wide", flop: -8, prick: -4 },
    tail: -16,
  },
  leap: {
    rot: -28,
    grounded: false,
    at: [CENTRE_X, 600],
    front: [
      [128, 142],
      [116, 130],
    ],
    hind: [
      [-62, -100, -112],
      [-54, -94, -106],
    ],
    neck: { angle: -52, length: 76 },
    head: { rot: -36, mouth: 28, eye: "wide", flop: -115, prick: 24, tongue: true },
    tail: -40,
  },
  snap: {
    rot: -20,
    grounded: false,
    at: [CENTRE_X, 600],
    front: [
      [96, 70],
      [86, 64],
    ],
    hind: [
      [-28, -80, -92],
      [-22, -74, -86],
    ],
    neck: { angle: -50, length: 74 },
    head: { rot: -30, mouth: 0, eye: "closed", flop: -100, prick: 20 },
    tail: -30,
  },
  land: {
    rot: 16,
    front: [
      [22, 10],
      [30, 16],
    ],
    hind: [
      [-36, -84, -70],
      [-30, -78, -64],
    ],
    neck: { angle: -30, length: 66 },
    head: { rot: 6, eye: "wide", flop: 40, prick: -8 },
    tail: -24,
  },
  tumble: {
    rot: 0,
    grounded: false,
    spin: 140,
    at: [CENTRE_X + 20, 560],
    front: [
      [140, 168],
      [-150, -120],
    ],
    hind: [
      [70, 120, 150],
      [-40, -92, -60],
    ],
    neck: { angle: -30, length: 66 },
    head: { rot: 10, mouth: 10, eye: "closed", flop: -60, prick: 20, tongue: true },
    tail: -50,
  },
  sniff: {
    ...stand,
    rot: 6,
    neck: { angle: 26, length: 80 },
    head: { rot: 36, eye: "open", flop: 24 },
    tail: -22,
  },
  sneeze: {
    ...stand,
    rot: 4,
    neck: { angle: -4, length: 66 },
    head: { rot: 30, mouth: 8, eye: "closed", flop: 46, prick: -10 },
    puff: true,
    tail: 6,
  },
  "run-1": {
    rot: -4,
    front: [
      [72, 82],
      [56, 70],
    ],
    hind: [
      [-62, -84, -72],
      [-50, -76, -66],
    ],
    neck: { angle: -34, length: 70 },
    head: { rot: -4, mouth: 8, eye: "open", flop: -70, prick: 16, tongue: true },
    tail: -40,
  },
  "run-2": {
    rot: 3,
    front: [
      [-34, -58],
      [-24, -46],
    ],
    hind: [
      [58, 24, 44],
      [46, 12, 32],
    ],
    neck: { angle: -40, length: 70 },
    head: { rot: 0, mouth: 8, eye: "open", flop: -40, prick: 10, tongue: true },
    tail: -30,
  },
  "howl-start": {
    ...sit,
    neck: { angle: -70, length: 66 },
    head: { rot: -48, mouth: 14, eye: "closed", flop: -10, prick: 4 },
  },
  howl: {
    ...sit,
    rot: -46,
    neck: { angle: -82, length: 72 },
    head: { rot: -80, mouth: 26, eye: "closed", flop: -40, prick: 18 },
    tail: 18,
  },
  whine: {
    ...sit,
    neck: { angle: -44, length: 60 },
    head: { rot: 20, eye: "sad", flop: 56, prick: 44 },
    tail: 30,
  },
  "proud-sit": {
    ...sit,
    rot: -46,
    neck: { angle: -64, length: 68 },
    head: { rot: -20, mouth: 10, eye: "happy", flop: 6, tongue: true },
    tail: 0,
  },
  "carry-sit": {
    ...sit,
    rot: -46,
    neck: { angle: -62, length: 68 },
    head: { rot: -14, mouth: 5, eye: "happy", flop: 6 },
    ticket: "mouth",
    tail: -4,
  },
  "carry-1": {
    rot: -2,
    front: [
      [52, -38],
      [0, 2],
    ],
    hind: [
      [30, -30, 6],
      [8, -70, -40],
    ],
    neck: { angle: -44, length: 70 },
    head: { rot: -8, mouth: 5, eye: "happy", flop: -20 },
    ticket: "mouth",
    tail: -20,
  },
  "carry-2": {
    rot: -2,
    front: [
      [2, 0],
      [52, -38],
    ],
    hind: [
      [8, -70, -40],
      [30, -30, 6],
    ],
    neck: { angle: -44, length: 70 },
    head: { rot: -8, mouth: 5, eye: "happy", flop: 4 },
    ticket: "mouth",
    tail: -8,
  },
  sleep: {
    rot: 0,
    front: [
      [84, 96],
      [80, 94],
    ],
    hind: [
      [96, -66, 92],
      [92, -70, 90],
    ],
    neck: { angle: 18, length: 46 },
    head: { rot: 14, eye: "closed", flop: 50 },
    headDown: true,
    ticket: "paws",
    tail: 60,
  },
};

/* ---------- Rendering ---------- */

type Shape = { d: string; stroke?: number; transform?: string };

let uid = 0;

/** A lit part: rim on the sun's side, shading offset toward the shadow. */
function lit(shapes: Shape[], light: string, dark: string, box: [Vec, Vec], extra = "") {
  const id = `p${uid++}`;
  const [[x0, y0], [x1, y1]] = box;
  const shapeSvg = (paint: string) =>
    shapes
      .map(({ d, stroke, transform }) =>
        stroke
          ? `<path d="${d}" fill="none" stroke="${paint}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"${transform ? ` transform="${transform}"` : ""}/>`
          : `<path d="${d}" fill="${paint}"${transform ? ` transform="${transform}"` : ""}/>`,
      )
      .join("");
  return `<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y0)}" x2="${f(x0)}" y2="${f(y1)}"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
<mask id="${id}m" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000">${shapeSvg("#fff")}</mask>
<g mask="url(#${id}m)"><rect x="-2000" y="-2000" width="4000" height="4000" fill="${colour.rim}"/><g transform="translate(-5 5)">${shapeSvg(`url(#${id}g)`)}</g>${extra}</g>`;
}

/** The dark outline behind a set of shapes, for legibility over busy art. */
function outline(shapes: Shape[], width = 7) {
  return shapes
    .map(({ d, stroke, transform }) =>
      `<path d="${d}" fill="${stroke ? "none" : colour.outline}" stroke="${colour.outline}" stroke-width="${(stroke ?? 0) + width}" stroke-linecap="round" stroke-linejoin="round"${transform ? ` transform="${transform}"` : ""}/>`,
    )
    .join("");
}

type Limb = { joints: Vec[]; widths: number[] };

function buildLimb(start: Vec, angles: number[], lengths: number[], widths: number[]): Limb {
  const joints: Vec[] = [start];
  let point = start;
  angles.forEach((angle, index) => {
    point = add(point, scale(limbDir(angle), lengths[index]));
    joints.push(point);
  });
  return { joints, widths };
}

function limbShapes({ joints, widths }: Limb): Shape[] {
  const shapes: Shape[] = [];
  for (let i = 0; i < joints.length - 1; i++) {
    shapes.push({ d: `M ${pt(joints[i])} L ${pt(joints[i + 1])}`, stroke: widths[i] });
  }
  const paw = joints[joints.length - 1];
  shapes.push({
    d: `M ${f(paw[0] - 6)} ${f(paw[1])} a 19 11 0 1 0 38 0 a 19 11 0 1 0 -38 0 Z`,
  });
  return shapes;
}

function limbBox(limb: Limb): [Vec, Vec] {
  const xs = limb.joints.map(([x]) => x);
  const ys = limb.joints.map(([, y]) => y);
  return [
    [Math.min(...xs) - 30, Math.min(...ys) - 30],
    [Math.max(...xs) + 40, Math.max(...ys) + 20],
  ];
}

function eyeSvg(eye: Eye) {
  const lid = `<path d="M 15 -30 Q 28 -38 41 -29" fill="none" stroke="${colour.coatDark}" stroke-width="4" stroke-linecap="round"/>`;
  switch (eye) {
    case "closed":
      return `<path d="M 16 -24 Q 28 -17 40 -24" fill="none" stroke="${colour.pupil}" stroke-width="4.5" stroke-linecap="round"/>`;
    case "happy":
      return `<path d="M 16 -21 Q 28 -33 40 -21" fill="none" stroke="${colour.pupil}" stroke-width="4.5" stroke-linecap="round"/>`;
    case "wide":
      return `<ellipse cx="29" cy="-24" rx="12" ry="12" fill="${colour.eye}"/><circle cx="31" cy="-24" r="6.5" fill="${colour.pupil}"/><circle cx="34" cy="-28" r="3" fill="#fff"/><path d="M 14 -40 Q 28 -46 42 -38" fill="none" stroke="${colour.coatDark}" stroke-width="4" stroke-linecap="round"/>`;
    case "sad":
      return `<ellipse cx="29" cy="-22" rx="11" ry="11" fill="${colour.eye}"/><circle cx="29" cy="-20" r="6.5" fill="${colour.pupil}"/><circle cx="32" cy="-24" r="3" fill="#fff"/><path d="M 14 -30 Q 26 -40 42 -40" fill="none" stroke="${colour.coatDark}" stroke-width="4" stroke-linecap="round"/>`;
    default:
      return `<ellipse cx="29" cy="-23" rx="10.5" ry="10" fill="${colour.eye}"/><circle cx="31" cy="-23" r="5.5" fill="${colour.pupil}"/><circle cx="34" cy="-26.5" r="2.6" fill="#fff"/>${lid}`;
  }
}

function ticketSvg(transform: string) {
  return `<g transform="${transform}">
<linearGradient id="tk" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0C2"/><stop offset="0.45" stop-color="#F2C76A"/><stop offset="1" stop-color="#A56A22"/></linearGradient>
<path d="M -40 -16 H 40 A 5 5 0 0 1 45 -11 V -5 A 5 5 0 0 0 45 5 V 11 A 5 5 0 0 1 40 16 H -40 A 5 5 0 0 1 -45 11 V 5 A 5 5 0 0 0 -45 -5 V -11 A 5 5 0 0 1 -40 -16 Z" fill="url(#tk)" stroke="${colour.outline}" stroke-width="3"/>
<path d="M 20 -13 V 13" stroke="#7A4A14" stroke-opacity="0.55" stroke-dasharray="2 4"/>
<path d="M -32 -2 H 8" stroke="#7A4A14" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round"/>
<path d="M -32 6 H -6" stroke="#7A4A14" stroke-opacity="0.25" stroke-width="3" stroke-linecap="round"/>
<circle cx="30" cy="-8" r="16" fill="#FFF3D6" opacity="0.25"/>
</g>`;
}

export function renderDog(name: string): string {
  const pose = poses[name];
  if (!pose) throw new Error(`Unknown pose ${name}`);
  uid = 0;

  // Place the torso, then find the ground.
  let centre: Vec = pose.at ?? [CENTRE_X, 640];
  const toWorld = (local: Vec, c: Vec = centre): Vec => add(c, rotate(local, pose.rot));

  const build = (c: Vec) => {
    const w = (local: Vec) => toWorld(local, c);
    const front = SHOULDER.map((anchor, i) =>
      buildLimb(w(anchor), pose.front[i], [92, 88], [40, 26]),
    );
    const hind = HIP.map((anchor, i) =>
      buildLimb(w(anchor), pose.hind[i], [80, 72, 54], [52, 30, 22]),
    );
    const neckBase = w(NECK_BASE);
    const head = add(neckBase, [
      Math.cos(rad(pose.neck.angle)) * pose.neck.length,
      Math.sin(rad(pose.neck.angle)) * pose.neck.length,
    ]);
    return { front, hind, neckBase, head };
  };

  let rig = build(centre);
  if (pose.grounded !== false) {
    const lows = [
      ...[...rig.front, ...rig.hind].map((limb) => limb.joints[limb.joints.length - 1][1] + 11),
      ...TORSO_UNDERSIDE.map((p) => toWorld(p)[1]),
    ];
    if (pose.headDown) lows.push(rig.head[1] + 34);
    centre = [centre[0], centre[1] + (GROUND - Math.max(...lows))];
    rig = build(centre);
  }

  const { front, hind, neckBase, head } = rig;
  const torsoTransform = `translate(${pt(centre)}) rotate(${pose.rot})`;
  // A slightly big head reads younger and friendlier at small sizes.
  const headTransform = `translate(${pt(head)}) rotate(${pose.head.rot}) scale(1.2)`;
  const mouth = pose.head.mouth ?? 0;
  const muzzleTransform = `rotate(${f(-mouth * 0.3)} 30 12)`;
  const jawTransform = `rotate(${f(mouth * 0.7)} 32 12)`;
  const flopTransform = `rotate(${f(pose.head.flop ?? 0)} -12 -52)`;
  const prickTransform = `rotate(${f(-(pose.head.prick ?? 0))} -10 -38)`;
  const tailTransform = `rotate(${f(pose.tail ?? 0)} ${pt(TAIL_BASE)})`;

  const torsoBox: [Vec, Vec] = [
    [-214, -82],
    [198, 88],
  ];
  const headBox: [Vec, Vec] = [
    [-62, -64],
    [126, 40],
  ];

  const neckShape: Shape = { d: `M ${pt(neckBase)} L ${pt(head)}`, stroke: 92 };
  const neckBox: [Vec, Vec] = [
    [Math.min(neckBase[0], head[0]) - 50, Math.min(neckBase[1], head[1]) - 50],
    [Math.max(neckBase[0], head[0]) + 50, Math.max(neckBase[1], head[1]) + 50],
  ];

  // Collar: a band across the neck near the head, with the tag hanging off it.
  const along = (t: number): Vec => add(neckBase, scale([head[0] - neckBase[0], head[1] - neckBase[1]], t));
  const neckDir = Math.atan2(head[1] - neckBase[1], head[0] - neckBase[0]);
  const normal: Vec = [-Math.sin(neckDir), Math.cos(neckDir)];
  const collarCentre = along(0.62);
  const collarA = add(collarCentre, scale(normal, -44));
  const collarB = add(collarCentre, scale(normal, 44));
  const tagAt = add(collarB[1] > collarA[1] ? collarB : collarA, [0, 16]);

  const farFront = front[1];
  const farHind = hind[1];
  const nearFront = front[0];
  const nearHind = hind[0];

  const parts: string[] = [];
  const outlines: string[] = [];

  // Far legs (in shadow).
  for (const limb of [farHind, farFront]) {
    const shapes = limbShapes(limb);
    outlines.push(outline(shapes));
    parts.push(lit(shapes, colour.farLight, colour.farDark, limbBox(limb)));
  }

  // Tail (behind the body).
  const tailShapes: Shape[] = [
    { d: TAIL, stroke: 28, transform: `${torsoTransform} ${tailTransform}` },
  ];
  outlines.push(outline(tailShapes));
  parts.push(
    lit(tailShapes, colour.coatLight, colour.coatDark, [
      [centre[0] - 260, centre[1] - 200],
      [centre[0] - 120, centre[1]],
    ]),
  );

  // Torso.
  const torsoShapes: Shape[] = [{ d: TORSO, transform: torsoTransform }];
  outlines.push(outline(torsoShapes));
  parts.push(
    `<g transform="${torsoTransform}">${lit(
      [{ d: TORSO }],
      colour.coatLight,
      colour.coatDark,
      torsoBox,
      `<path d="${BACK_FUR}" fill="none" stroke="${colour.coatDark}" stroke-opacity="0.5" stroke-width="3" stroke-linecap="round"/>`,
    )}${lit([{ d: CHEST_BLAZE }], colour.white, colour.whiteShade, [
      [120, -20],
      [200, 90],
    ])}</g>`,
  );

  // Neck, then the near legs over the body.
  outlines.push(outline([neckShape]));
  parts.push(lit([neckShape], colour.coatLight, colour.coatMid, neckBox));
  for (const [limb, sock] of [
    [nearHind, false],
    [nearFront, true],
  ] as const) {
    const shapes = limbShapes(limb);
    outlines.push(outline(shapes));
    parts.push(lit(shapes, colour.coatLight, colour.coatDark, limbBox(limb)));
    if (sock) {
      // White socks on the front paws.
      const end = limb.joints[limb.joints.length - 1];
      const before = limb.joints[limb.joints.length - 2];
      const sockStart = add(end, scale([before[0] - end[0], before[1] - end[1]], 0.38));
      const sockShapes: Shape[] = [
        { d: `M ${pt(sockStart)} L ${pt(end)}`, stroke: 24 },
        { d: `M ${f(end[0] - 6)} ${f(end[1])} a 19 11 0 1 0 38 0 a 19 11 0 1 0 -38 0 Z` },
      ];
      parts.push(lit(sockShapes, colour.white, colour.whiteShade, limbBox(limb)));
    }
  }
  // The far front paw gets a sock too.
  {
    const end = farFront.joints[farFront.joints.length - 1];
    parts.push(
      `<ellipse cx="${f(end[0] + 13)}" cy="${f(end[1])}" rx="18" ry="10" fill="${colour.whiteShade}"/>`,
    );
  }

  // Collar band.
  parts.push(
    `<path d="M ${pt(collarA)} L ${pt(collarB)}" stroke="${colour.outline}" stroke-width="20" stroke-linecap="round"/>`,
    `<path d="M ${pt(collarA)} L ${pt(collarB)}" stroke="${colour.collar}" stroke-width="13" stroke-linecap="round"/>`,
  );

  // Head.
  const headParts: string[] = [];
  const headOutline: Shape[] = [
    { d: FAR_EAR, transform: prickTransform },
    { d: SKULL },
    { d: MUZZLE, transform: muzzleTransform },
    { d: JAW, transform: jawTransform },
    { d: FLOP_EAR, transform: flopTransform },
  ];
  headParts.push(outline(headOutline));
  // Upright far ear.
  headParts.push(
    `<g transform="${prickTransform}">${lit([{ d: FAR_EAR }], colour.farLight, colour.farDark, [
      [-40, -130],
      [20, -30],
    ])}<path d="M -24 -38 L -20 -100 L 0 -48 Z" fill="${colour.innerEar}" opacity="0.55"/></g>`,
  );
  // Mouth interior, visible as the jaw drops.
  if (mouth > 2) {
    const upper = rotate([112, 8], -mouth * 0.3);
    const lower = add(rotate([100, 22], mouth * 0.7), [0, 0]);
    headParts.push(
      `<path d="M 30 12 L ${pt(upper)} L ${pt(lower)} Z" fill="${colour.mouth}"/>`,
    );
  }
  headParts.push(
    lit([{ d: SKULL }], colour.coatLight, colour.coatMid, headBox),
    `<g transform="${jawTransform}">${lit([{ d: JAW }], colour.white, colour.whiteShade, [
      [28, 8],
      [110, 36],
    ])}${
      pose.head.tongue && mouth > 4
        ? `<path d="M 60 14 C 74 12, 92 14, 96 22 C 92 34, 70 34, 60 26 Z" fill="${colour.tongue}"/>`
        : ""
    }</g>`,
    `<g transform="${muzzleTransform}">${lit([{ d: MUZZLE }], colour.coatLight, colour.coatMid, [
      [26, -36],
      [126, 16],
    ])}<path d="M 70 12 C 86 6, 100 8, 112 10" fill="none" stroke="${colour.coatDark}" stroke-width="3" stroke-linecap="round"/><ellipse cx="115" cy="-6" rx="12" ry="9" fill="${colour.nose}"/><ellipse cx="118" cy="-10" rx="4" ry="2.4" fill="#fff" opacity="0.55"/></g>`,
    `<path d="${CHEEK}" fill="none" stroke="${colour.white}" stroke-opacity="0.75" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    eyeSvg(pose.head.eye ?? "open"),
    `<g transform="${flopTransform}">${lit([{ d: FLOP_EAR }], colour.coatMid, colour.coatDark, [
      [-20, -66],
      [50, 8],
    ])}</g>`,
  );
  if (pose.ticket === "mouth") {
    headParts.push(ticketSvg(`translate(78 12) rotate(-8) scale(0.92)`));
  }
  if (pose.puff) {
    headParts.push(
      `<g fill="none" stroke="${colour.white}" stroke-width="4" stroke-linecap="round" opacity="0.9"><path d="M 136 4 q 14 -8 26 0"/><path d="M 134 18 q 18 4 28 18"/><path d="M 132 -12 q 12 -16 26 -18"/><circle cx="172" cy="6" r="6"/><circle cx="168" cy="40" r="4"/></g>`,
    );
  }

  // Collar tag, over the head's lower edge so it reads.
  const tag = `<g transform="translate(${pt(tagAt)})"><circle r="13" fill="${colour.outline}"/><circle r="10" fill="#C9D3DE"/><circle cx="-2" cy="-2" r="6" fill="#F4F8FC"/><ellipse cx="3" cy="-4" rx="4" ry="2" fill="#8FCBFF" transform="rotate(-30)"/></g>`;

  let figure = `${outlines.join("")}${parts.join("")}<g transform="${headTransform}">${headParts.join("")}</g>${tag}`;

  if (pose.ticket === "paws") {
    const paw = nearFront.joints[nearFront.joints.length - 1];
    figure = `${ticketSvg(`translate(${pt(add(paw, [30, -6]))}) rotate(-6)`)}${figure}`;
  }
  if (pose.spin) {
    figure = `<g transform="rotate(${pose.spin} ${pt(centre)})">${figure}</g>`;
  }

  // Record the nose and mouth in frame fractions, for aiming rings and props.
  const headPoint = (local: Vec): Vec => {
    let p = rotate(scale(local, 1.2), pose.head.rot);
    p = add(head, p);
    if (pose.spin) p = add(centre, rotate([p[0] - centre[0], p[1] - centre[1]], pose.spin));
    return [Number((p[0] / 1024).toFixed(3)), Number((p[1] / 1024).toFixed(3))];
  };
  posePoints[name] = {
    nose: headPoint(rotate([115, -6], -mouth * 0.3)),
    mouth: headPoint([78, 12]),
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">${figure}</svg>`;
}

/** Filled in by renderDog: nose and mouth per pose, as fractions of the frame. */
export const posePoints: Record<string, { nose: Vec; mouth: Vec }> = {};

export const vectorPoseNames = Object.keys(poses);
