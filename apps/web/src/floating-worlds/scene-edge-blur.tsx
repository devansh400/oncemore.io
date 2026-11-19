import type { CSSProperties } from "react";

import styles from "./scene-edge-blur.module.css";

const layers = Array.from({ length: 8 }, (_, index) => index);

export type Edge = "top" | "bottom" | "left" | "right";
export const allEdges: Edge[] = ["top", "bottom", "left", "right"];

/*
 * The interface gets a lighter blur than the scene. One layer sits above the
 * UI at UI strength; a second sits under the UI, over the scene only. Stacked
 * Gaussian blurs combine as sqrt(a² + b²), so the scene still gets full strength.
 */
export const edgeBlurOverUi = 0.75;
export const edgeBlurUnderUi = Math.sqrt(1 - edgeBlurOverUi ** 2);

/**
 * A progressive blur along one edge of the frame. Render it after whatever it
 * should blur; anything that must stay sharp needs a higher z-index.
 * `className` sets position and stacking, `strength` scales every layer.
 */
export function SceneEdgeBlur({
  className = "absolute",
  edge = "bottom",
  strength = 1,
}: {
  className?: string;
  edge?: Edge;
  strength?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`${styles.blur} ${edge === "bottom" ? "" : styles[edge]} ${className}`}
      style={{ "--strength": strength.toFixed(3) } as CSSProperties}
    >
      {layers.map((layer) => (
        <div key={layer} className={styles.layer} />
      ))}
    </div>
  );
}
