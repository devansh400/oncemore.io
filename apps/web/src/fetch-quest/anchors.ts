/*
 * Pins quest actors to the painted islands. Each island is a W×H plane centred
 * on its group, so a point on the painting (u, v in 0–1, top-left origin) maps
 * to local ((u − ½)W, (½ − v)H, 0). We project that through the scene camera
 * every frame, so the dog and ticket ride the islands as the camera sways.
 */
import type { SceneController } from "@/floating-worlds/scene-types";

export type ScreenPoint = { x: number; y: number; visible: boolean };

type Beat = "embers" | "sneeze" | "bounce" | "boom" | "gate";

/** Spots on each painting, in the scene's island order (og, kerala, stadium, concert, gates). */
export const islandSpots: { dog: [number, number]; ticket: [number, number]; beat: Beat }[] = [
  // OG: the dog on the lantern path, the ticket snagged on the torii's top beam.
  { dog: [0.7, 0.55], ticket: [0.63, 0.31], beat: "embers" },
  // MIB: the dog on the courtyard path, the ticket by the brass lamp at the steps.
  { dog: [0.6, 0.47], ticket: [0.47, 0.4], beat: "sneeze" },
  // Stadium: the dog on the green ledge, the ticket bouncing over the bowl.
  { dog: [0.66, 0.38], ticket: [0.52, 0.12], beat: "bounce" },
  // Concert: the dog on the lit path, the ticket at the right-hand speaker stack.
  { dog: [0.6, 0.56], ticket: [0.72, 0.36], beat: "boom" },
  // Gates: the dog at the foot of the steps, the ticket in the light of the door.
  { dog: [0.66, 0.49], ticket: [0.535, 0.36], beat: "gate" },
];

function transform(m: ArrayLike<number>, x: number, y: number, z: number) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
    m[3] * x + m[7] * y + m[11] * z + m[15],
  ] as const;
}

/** Project a point on island `index`'s painting to viewport pixels. */
export function projectSpot(
  controller: SceneController | null,
  index: number,
  [u, v]: [number, number],
  width: number,
  height: number,
): ScreenPoint | null {
  const debug = controller?.debug;
  const island = debug?.ISLANDS[index];
  if (!debug || !island?.W || !island.H) return null;
  const world = transform(
    island.group.matrixWorld.elements,
    (u - 0.5) * island.W,
    (0.5 - v) * island.H,
    0,
  );
  const view = transform(debug.camera.matrixWorldInverse.elements, world[0], world[1], world[2]);
  const clip = transform(debug.camera.projectionMatrix.elements, view[0], view[1], view[2]);
  if (clip[3] <= 0) return { x: 0, y: 0, visible: false };
  const nx = clip[0] / clip[3];
  const ny = clip[1] / clip[3];
  return {
    x: ((nx + 1) / 2) * width,
    y: ((1 - ny) / 2) * height,
    visible: Math.abs(nx) < 1.3 && Math.abs(ny) < 1.3,
  };
}

/** The island's painted height on screen, for sizing the dog against it. */
export function islandScreenHeight(
  controller: SceneController | null,
  index: number,
  width: number,
  height: number,
) {
  const top = projectSpot(controller, index, [0.5, 0], width, height);
  const bottom = projectSpot(controller, index, [0.5, 1], width, height);
  if (!top || !bottom || !top.visible) return null;
  return Math.hypot(bottom.x - top.x, bottom.y - top.y);
}
