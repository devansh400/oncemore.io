export const EASE = {
  out: "power3.out",
  reveal: "power4.out",
} as const;

export const DURATION = {
  reveal: 1.05,
  hover: 0.45,
  cursor: 0.35,
} as const;

export const SCROLL_START = "top 84%";

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function damp(current: number, target: number, lambda: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}
