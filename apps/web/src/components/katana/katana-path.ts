// Points sampled from the blade mesh in the asset's local space.
export const TIP: [number, number, number] = [0.306, 0.014, -4.395];
export const BASE: [number, number, number] = [0.017, 0.291, 1.392];

// Midpoint of the blade, used as the pivot for the roll.
export const PIVOT: [number, number, number] = [
  (TIP[0] + BASE[0]) / 2,
  (TIP[1] + BASE[1]) / 2,
  (TIP[2] + BASE[2]) / 2,
];

// Where the guard sits along the blade, from tip (0) to handle (1).
export const GUARD_T = (0 - TIP[2]) / (BASE[2] - TIP[2]);

export function stageIndex(progress: number) {
  // The camera pans vertically, so the guard and handle occupy the final part
  // of the journey while the long blade owns the middle.
  if (progress < 0.1) return 0;
  if (progress < 0.72) return 1;
  if (progress < 0.86) return 2;
  return 3;
}
