import { preload } from "react-dom";

import { packUrl, type SequenceSource } from "./frame-sequence";

/*
 * Server-side <link rel="preload"> hints, so the poster and the preview pack
 * download alongside the HTML instead of after hydration. `as: "fetch"` with
 * anonymous CORS matches the loader's own `fetch()`, so the preloaded
 * response is reused rather than downloaded twice.
 */
export function preloadSequence(source: SequenceSource, poster: string) {
  preload(poster, { as: "image", fetchPriority: "high" });
  preload(packUrl(source), { as: "fetch", crossOrigin: "anonymous", fetchPriority: "high" });
}
