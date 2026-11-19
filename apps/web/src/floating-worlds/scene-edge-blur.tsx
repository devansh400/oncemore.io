import styles from "./scene-edge-blur.module.css";

export function SceneEdgeBlur() {
  return (
    <div
      aria-hidden="true"
      className={`${styles.edges} pointer-events-none absolute inset-0 backdrop-blur-xl`}
    />
  );
}
