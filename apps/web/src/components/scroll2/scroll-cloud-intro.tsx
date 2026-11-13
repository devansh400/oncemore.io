"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./scroll-cloud-intro.module.css";

// Original kasumi silhouettes: long horizontal banks with stepped,
// rounded ends, rather than billowing Western cloud shapes.
const largeBanks = [
  {
    side: -1,
    y: -95,
    scale: 1.15,
    path: "M-500 0H870a54 54 0 0 1 0 108H525a36 36 0 0 0 0 72h520a45 45 0 0 1 0 90H310a35 35 0 0 0 0 70h390a42 42 0 0 1 0 84H-500Z",
  },
  {
    side: 1,
    y: 20,
    scale: 1.1,
    path: "M-500 0H720a62 62 0 0 1 0 124H430a32 32 0 0 0 0 64h455a48 48 0 0 1 0 96H210a40 40 0 0 0 0 80h540a45 45 0 0 1 0 90H-500Z",
  },
  {
    side: -1,
    y: 280,
    scale: 1.03,
    path: "M-500 0H640a46 46 0 0 1 0 92H380a33 33 0 0 0 0 66h590a51 51 0 0 1 0 102H240a31 31 0 0 0 0 62h500a43 43 0 0 1 0 86H-500Z",
  },
  {
    side: 1,
    y: 370,
    scale: 1.15,
    path: "M-500 0H770a48 48 0 0 1 0 96H435a38 38 0 0 0 0 76h550a46 46 0 0 1 0 92H320a36 36 0 0 0 0 72h390a38 38 0 0 1 0 76H-500Z",
  },
  {
    side: -1,
    y: 650,
    scale: 1.16,
    path: "M-500 0H820a55 55 0 0 1 0 110H390a30 30 0 0 0 0 60h520a48 48 0 0 1 0 96H250a40 40 0 0 0 0 80h510a48 48 0 0 1 0 96H-500Z",
  },
  {
    side: 1,
    y: 760,
    scale: 1.05,
    path: "M-500 0H700a58 58 0 0 1 0 116H390a35 35 0 0 0 0 70h560a50 50 0 0 1 0 100H200a35 35 0 0 0 0 70h540a40 40 0 0 1 0 80H-500Z",
  },
];

const smallPaths = [
  "M30 0h294a24 24 0 0 1 0 48H207a15 15 0 0 0 0 30h184a25 25 0 0 1 0 50H103a14 14 0 0 0 0 28h104a19 19 0 0 1 0 38H30a23 23 0 0 1 0-46h43a14 14 0 0 0 0-28H22a22 22 0 0 1 0-44h107a14 14 0 0 0 0-28H30a24 24 0 0 1 0-48Z",
  "M22 0h238a22 22 0 0 1 0 44h-69a13 13 0 0 0 0 26h135a21 21 0 0 1 0 42H122a12 12 0 0 0 0 24h79a17 17 0 0 1 0 34H47a21 21 0 0 1 0-42h20a12 12 0 0 0 0-24H22a20 20 0 0 1 0-40h85a10 10 0 0 0 0-20H22a22 22 0 0 1 0-44Z",
];

const details = [
  { side: -1, x: 105, y: 82, scale: 0.95, scaleY: 0.65, depth: 1, delay: 0.05 },
  { side: 1, x: 200, y: 140, scale: 0.6, scaleY: 0.5, depth: 2, delay: 0.17 },
  { side: -1, x: 710, y: 45, scale: 0.48, scaleY: 0.4, depth: 2, delay: 0.1 },
  { side: 1, x: 30, y: 315, scale: 1.1, scaleY: 0.7, depth: 1, delay: 0.12 },
  { side: -1, x: 165, y: 310, scale: 0.46, scaleY: 0.46, depth: 2, delay: 0.22 },
  { side: 1, x: 570, y: 270, scale: 0.57, scaleY: 0.37, depth: 2, delay: 0.08 },
  { side: -1, x: 20, y: 485, scale: 1.18, scaleY: 0.8, depth: 1, delay: 0.1 },
  { side: 1, x: 300, y: 525, scale: 0.42, scaleY: 0.33, depth: 2, delay: 0.2 },
  { side: -1, x: 690, y: 610, scale: 0.65, scaleY: 0.48, depth: 2, delay: 0.14 },
  { side: 1, x: 70, y: 725, scale: 0.94, scaleY: 0.6, depth: 1, delay: 0.04 },
  { side: -1, x: 180, y: 815, scale: 0.52, scaleY: 0.42, depth: 2, delay: 0.18 },
  { side: 1, x: 570, y: 850, scale: 0.45, scaleY: 0.34, depth: 2, delay: 0.25 },
  { side: -1, x: 30, y: 975, scale: 1.12, scaleY: 0.7, depth: 1, delay: 0.07 },
  { side: 1, x: 220, y: 940, scale: 0.74, scaleY: 0.5, depth: 2, delay: 0.15 },
];

const banks = [
  ...largeBanks.map((bank, i) => ({
    ...bank,
    y: bank.y - 35,
    scale: bank.scale * 1.08,
    x: 0,
    // Overlapping background banks form a continuous wall of cloud at entry.
    scaleY: [1.12, 1.08, 1.1, 1.12, 1.12, 1.1][i]!,
    depth: 0,
    delay: (i % 3) * 0.05,
  })),
  ...details.map((bank, i) => ({
    ...bank,
    scale: bank.scale * (bank.depth === 2 ? 1.35 : 1.12),
    scaleY: bank.scaleY * (bank.depth === 2 ? 1.3 : 1.12),
    path: smallPaths[i % smallPaths.length]!,
  })),
];

export function ScrollCloudIntro({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const filterId = useId().replace(/:/g, "");

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(root.current, { autoAlpha: 0 });
        return;
      }
      const clouds = root.current!.querySelectorAll<SVGGElement>("[data-cloud]");
      const entrance = gsap
        .timeline()
        .to(`.${styles.mark}`, { opacity: 0, y: -8, duration: 0.45, ease: "power2.inOut" }, 0.45)
        .fromTo(
          `.${styles.cloudZoom}`,
          { scale: 1.015 },
          { scale: 1.15, duration: 2.8, ease: "power2.inOut" },
          0.15,
        )
        // Hold the opaque cloud wall before opening a window into the scene.
        .to(`.${styles.veil}`, { opacity: 0, duration: 1.25, ease: "power2.inOut" }, 0.78);
      clouds.forEach((cloud, index) => {
        const bank = banks[index]!;
        entrance.to(
          cloud,
          {
            x: bank.side * (2100 + bank.depth * 160),
            y: (index % 2 ? 1 : -1) * bank.depth * 8,
            duration: 2.15 - bank.depth * 0.17,
            ease: "power3.inOut",
          },
          0.65 + bank.delay,
        );
      });
      entrance.set(root.current, { autoAlpha: 0 });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={styles.intro} aria-hidden="true" data-cloud-intro>
      <div className={styles.veil} />
      <div className={styles.cloudZoom}>
        <svg className={styles.clouds} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            {[0, 1, 2].map((depth) => (
              <filter
                key={depth}
                id={`${filterId}-${depth}`}
                x="-30%"
                y="-60%"
                width="160%"
                height="220%"
              >
                <feDropShadow
                  dx="0"
                  dy={depth === 0 ? 5 : 9}
                  stdDeviation={depth === 0 ? 13 : 8}
                  floodColor="#486b60"
                  floodOpacity={depth === 0 ? 0.13 : 0.22}
                />
                <feDropShadow
                  dx="0"
                  dy={depth === 0 ? 1 : 2.5}
                  stdDeviation={depth === 0 ? 2 : 1.8}
                  floodColor="#625c43"
                  floodOpacity={depth === 0 ? 0.07 : 0.18}
                />
              </filter>
            ))}
          </defs>
          {banks.map((bank, index) => (
            <g key={index} data-cloud data-side={bank.side} data-depth={bank.depth}>
              <g
                transform={`translate(${bank.side === 1 ? 1600 - bank.x : bank.x} ${bank.y}) scale(${bank.side === 1 ? -bank.scale : bank.scale} ${bank.scaleY})`}
              >
                <path
                  d={bank.path}
                  fill={
                    bank.depth === 0
                      ? "var(--og-paper, #eee4c9)"
                      : bank.depth === 1
                        ? "var(--og-glow, #f1e9d2)"
                        : "var(--og-mount, #f4eddb)"
                  }
                  stroke="var(--og-muted, #9aa88e)"
                  strokeOpacity=".26"
                  strokeWidth="1.2"
                  filter={`url(#${filterId}-${bank.depth})`}
                />
              </g>
            </g>
          ))}
        </svg>
      </div>
      <div className={styles.mark}>
        <span lang="ja">もう一度</span>
        <small>ONCEMORE</small>
      </div>
    </div>
  );
}
