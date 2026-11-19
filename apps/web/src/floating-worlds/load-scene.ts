import type { SceneModule } from "./scene-types";

const scenePath = "/floating-worlds/app.js";

export async function loadFloatingWorlds(): Promise<SceneModule> {
  return import(/* webpackIgnore: true */ /* turbopackIgnore: true */ scenePath);
}
