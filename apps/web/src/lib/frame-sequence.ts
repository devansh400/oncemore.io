/*
 * Scroll-scrubbed image sequence shared by /og-page and /mib-page.
 *
 * Each sequence ships three WebP tiers of the same frames:
 *   preview  480px wide, ~5 KB  — loaded for the whole shot first, so a cold
 *                                 first-visit fling always shows the right
 *                                 moment, softly, instead of a frozen frame.
 *   md       1280px, ~25 KB     — phones and small windows.
 *   hd       1920px, ~55 KB     — larger screens.
 * The detail tier (md or hd) streams around the playhead and upgrades the
 * preview in place. The canvas never exceeds the detail tier's resolution:
 * extra backing pixels add fill cost without adding detail.
 */

export type Tier = "preview" | "md" | "hd";

export type SequenceSource = {
  /** Folder holding `preview/`, `md/` and `hd/` subfolders of `NNN.webp`. */
  root: string;
  count: number;
  /** Full-resolution (hd) frame size. Crop coordinates use this space. */
  width: number;
  height: number;
  /** Highest device pixel ratio the canvas renders at. */
  maxDpr: number;
};

export type SequenceOptions = SequenceSource & {
  /** Source rectangle origin, in hd coordinates, for a `sw × sh` crop. */
  crop: (frame: number, sw: number, sh: number) => [sx: number, sy: number];
  onResize?: (canvasWidth: number, canvasHeight: number) => void;
};

const MD_WIDTH = 1280;
const PREVIEW_DECODED = 48;

export const frameUrl = (source: SequenceSource, tier: Tier, index: number) =>
  `${source.root}/${tier}/${String(index).padStart(3, "0")}.webp`;

/**
 * The whole preview tier in one coverage-ordered file (see
 * scripts/build-preview-pack.mjs). One request instead of hundreds matters
 * most on high-latency mobile networks.
 */
export const packUrl = (source: SequenceSource) => `${source.root}/preview.pack`;

/** The detail tier this device will use. Shared with cache warming. */
export function detailTier(source: SequenceSource, cssWidth: number, cssHeight: number): Tier {
  if (Math.min(cssWidth, cssHeight) < 600) return "md";
  const dpr = Math.min(window.devicePixelRatio || 1, source.maxDpr);
  const cover = Math.max(cssWidth / source.width, cssHeight / source.height);
  // When even 1920 would be shown at ≤ ~1.1× of 1280, 1280 is indistinguishable.
  return cover * dpr <= (MD_WIDTH / source.width) * 1.1 ? "md" : "hd";
}

const FIRST_FRAME_MARK = "sequence:first-frame";

type Connection = { saveData?: boolean; effectiveType?: string };
const connection = () => (navigator as Navigator & { connection?: Connection }).connection;
const saveData = () => Boolean(connection()?.saveData);
/** True unless the browser reports Data Saver or a 3G-or-slower link. */
export const roomyConnection = () =>
  !saveData() && !/(^|-)(2g|3g)$/.test(connection()?.effectiveType ?? "");

type Layer = {
  blobs: Map<number, Blob>;
  bitmaps: Map<number, ImageBitmap>;
  fetching: Set<number>;
  decoding: Set<number>;
};
const layer = (): Layer => ({
  blobs: new Map(),
  bitmaps: new Map(),
  fetching: new Set(),
  decoding: new Set(),
});

export class FrameSequence {
  private context: CanvasRenderingContext2D;
  private controller = new AbortController();
  private observer: ResizeObserver;
  private preview = layer();
  private detail = layer();
  private tier: Tier = "hd";
  private failed = new Set<string>();
  private pack: "loading" | "done" | "failed" = "loading";
  private active = true;
  private visible = true;
  private idle = false;
  private fetchCount = 0;
  private decodeCount = 0;
  private readonly maxDecodes = Math.max(
    2,
    Math.min(4, Math.floor((navigator.hardwareConcurrency || 4) / 2)),
  );
  private desired = 0;
  private direction = 1;
  private drawn = -1;
  private drawnTier: Tier | null = null;
  private width = 0;
  private height = 0;
  private cacheLimit = 12;
  private queue: [Layer, Tier, number][] = [];
  private queueKey = "";

  constructor(
    private canvas: HTMLCanvasElement,
    private options: SequenceOptions,
    private onDraw: (frame: number, tier: Tier) => void,
    private onError: () => void,
  ) {
    if (typeof createImageBitmap !== "function") throw new Error("Frame decoding is unavailable");
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas is unavailable");
    this.context = context;
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
    void this.loadPack();
    this.pump();
  }

  /** Stream the preview pack, publishing each frame as soon as its bytes land. */
  private async loadPack() {
    try {
      const response = await fetch(packUrl(this.options), {
        signal: this.controller.signal,
        priority: "high",
      });
      if (!response.ok || !response.body) throw new Error("Preview pack unavailable");
      const reader = response.body.getReader();
      let buffer = new Uint8Array(1 << 20);
      let length = 0;
      let entries: [frame: number, start: number, end: number][] | null = null;
      let next = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (!this.active) {
          void reader.cancel();
          return;
        }
        if (value) {
          if (length + value.length > buffer.length) {
            const grown = new Uint8Array(Math.max(buffer.length * 2, length + value.length));
            grown.set(buffer.subarray(0, length));
            buffer = grown;
          }
          buffer.set(value, length);
          length += value.length;
        }
        if (!entries && length >= 4) {
          const view = new DataView(buffer.buffer);
          const count = view.getUint32(0, true);
          let offset = 4 + count * 6;
          if (length >= offset) {
            entries = [];
            for (let i = 0; i < count; i++) {
              const size = view.getUint32(6 + i * 6, true);
              entries.push([view.getUint16(4 + i * 6, true), offset, offset + size]);
              offset += size;
            }
          }
        }
        if (entries) {
          const before = next;
          while (next < entries.length && entries[next][2] <= length) {
            const [frame, start, end] = entries[next++];
            this.preview.blobs.set(frame, new Blob([buffer.slice(start, end)], { type: "image/webp" }));
          }
          if (next > before) this.pumpDecode();
        }
        if (done) break;
      }
      if (!entries || next < entries.length) throw new Error("Preview pack truncated");
      this.pack = "done";
    } catch {
      if (!this.active) return;
      // Fall back to individual preview files.
      this.pack = "failed";
    }
    this.queueKey = "";
    this.pumpFetch();
  }

  setFrame(frame: number) {
    const index = Math.max(0, Math.min(this.options.count - 1, Math.round(frame)));
    if (index !== this.desired) {
      this.direction = index > this.desired ? 1 : -1;
      this.desired = index;
      this.pump();
    }
    this.paint();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) {
      this.resize();
      this.pump();
    }
  }

  /** Past the shot: keep the current neighbourhood, stop streaming the rest. */
  setIdle(idle: boolean) {
    if (idle === this.idle) return;
    this.idle = idle;
    this.queueKey = "";
    if (!idle) this.pump();
  }

  private resize() {
    const { clientWidth, clientHeight } = this.canvas;
    if (!clientWidth || !clientHeight) return;
    const { width: W, height: H, maxDpr } = this.options;
    const tier = detailTier(this.options, clientWidth, clientHeight);
    if (tier !== this.tier) {
      this.detail.bitmaps.forEach((bitmap) => bitmap.close());
      this.detail = layer();
      this.tier = tier;
      this.queueKey = "";
    }
    const tierScale = tier === "md" ? MD_WIDTH / W : 1;
    const cover = Math.max(clientWidth / W, clientHeight / H);
    const scale = Math.min(Math.min(window.devicePixelRatio || 1, maxDpr), tierScale / cover);
    const width = Math.max(1, Math.round(clientWidth * scale));
    const height = Math.max(1, Math.round(clientHeight * scale));
    this.cacheLimit = clientWidth < 600 ? 10 : 18;
    this.options.onResize?.(width, height);
    if (this.canvas.width === width && this.canvas.height === height) return;
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    this.context.imageSmoothingQuality = "high";
    this.drawn = -1;
    this.paint();
  }

  /** Frames in priority order around the playhead, weighted toward travel. */
  private around(reach: number) {
    const { count } = this.options;
    const indices = [this.desired];
    for (let distance = 1; distance <= reach; distance++) {
      for (const index of [
        this.desired + distance * this.direction,
        this.desired - Math.ceil(distance / 3) * this.direction,
      ]) {
        if (index >= 0 && index < count && !indices.includes(index)) indices.push(index);
      }
    }
    return indices;
  }

  /*
   * Fetch order: the exact frame in both tiers, a short detail run ahead,
   * preview coverage of the whole shot (sparse first), the decoded detail
   * window, then — while the shot is on screen — the rest of the detail tier
   * outward from the playhead.
   */
  private buildQueue() {
    const { count } = this.options;
    const key = `${this.desired}:${this.direction}:${this.tier}:${this.idle}:${this.pack}`;
    if (key === this.queueKey) return;
    this.queueKey = key;
    const queue: [Layer, Tier, number][] = [];
    const seen = new Set<string>();
    const add = (target: Layer, tier: Tier, index: number) => {
      const id = `${tier}${index}`;
      // Previews come from the pack unless it failed.
      if (tier === "preview" && this.pack !== "failed") return;
      if (seen.has(id)) return;
      seen.add(id);
      queue.push([target, tier, index]);
    };
    const near = this.around(this.cacheLimit);
    add(this.preview, "preview", this.desired);
    add(this.detail, this.tier, this.desired);
    near.slice(1, 5).forEach((index) => add(this.detail, this.tier, index));
    this.around(24).forEach((index) => add(this.preview, "preview", index));
    for (const stride of [16, 4, 1])
      for (let index = 0; index < count; index += stride) add(this.preview, "preview", index);
    near.forEach((index) => add(this.detail, this.tier, index));
    if (!this.idle && !saveData()) {
      add(this.detail, this.tier, count - 1);
      for (let distance = 1; distance < count; distance++) {
        add(this.detail, this.tier, this.desired + distance * this.direction);
        add(this.detail, this.tier, this.desired - distance * this.direction);
      }
    }
    this.queue = queue.filter(([, , index]) => index >= 0 && index < count);
  }

  private pump() {
    this.pumpFetch();
    this.pumpDecode();
  }

  private pumpFetch() {
    if (!this.active || !this.visible) return;
    this.buildQueue();
    // Leave bandwidth for the preview pack until the shot is covered.
    while (this.fetchCount < (this.pack === "loading" ? 3 : 6)) {
      const next = this.queue.find(
        ([target, tier, index]) =>
          !target.blobs.has(index) && !target.fetching.has(index) && !this.failed.has(`${tier}${index}`),
      );
      if (!next) return;
      const [target, tier, index] = next;
      const urgent = index === this.desired || (target === this.preview && this.drawn < 0);
      this.fetchCount++;
      target.fetching.add(index);
      void fetch(frameUrl(this.options, tier, index), {
        signal: this.controller.signal,
        priority: urgent ? "high" : "low",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Frame unavailable");
          return response.blob();
        })
        .then((blob) => {
          if (this.active) target.blobs.set(index, blob);
        })
        .catch(() => {
          if (!this.active) return;
          this.failed.add(`${tier}${index}`);
          const ends = index === 0 || index === this.options.count - 1;
          if ((ends && target === this.detail) || this.failed.size > 8) this.onError();
        })
        .finally(() => {
          this.fetchCount--;
          target.fetching.delete(index);
          this.pump();
        });
    }
  }

  private pumpDecode() {
    if (!this.active || !this.visible) return;
    const detailWindow = this.around(this.cacheLimit).slice(0, this.cacheLimit);
    const previewWindow = this.around(PREVIEW_DECODED).slice(0, PREVIEW_DECODED);
    const wanted = (target: Layer, index: number) =>
      target.blobs.has(index) && !target.bitmaps.has(index) && !target.decoding.has(index);
    while (this.decodeCount < this.maxDecodes) {
      let target: Layer | undefined;
      let index: number | undefined;
      // The exact frame first, sharp if possible; then the sharp window; then
      // cheap previews further out so a fast scroll never lands on nothing.
      if (wanted(this.detail, this.desired)) [target, index] = [this.detail, this.desired];
      else if (!this.detail.bitmaps.has(this.desired) && wanted(this.preview, this.desired))
        [target, index] = [this.preview, this.desired];
      else {
        index = detailWindow.find((i) => wanted(this.detail, i));
        if (index !== undefined) target = this.detail;
        else {
          index = previewWindow.find((i) => wanted(this.preview, i));
          if (index !== undefined) target = this.preview;
        }
      }
      if (!target || index === undefined) return;
      this.decode(target, index, target === this.detail ? detailWindow : previewWindow);
    }
  }

  private decode(target: Layer, index: number, keep: number[]) {
    this.decodeCount++;
    target.decoding.add(index);
    const limit = keep.length;
    void createImageBitmap(target.blobs.get(index)!)
      .then((bitmap) => {
        if (!this.active || !target.blobs.has(index)) {
          bitmap.close();
          return;
        }
        target.bitmaps.set(index, bitmap);
        // Bounded working set of decoded frames; encoded blobs stay for reverse.
        while (target.bitmaps.size > limit) {
          let furthest = -1;
          for (const key of target.bitmaps.keys())
            if (furthest < 0 || Math.abs(key - this.desired) > Math.abs(furthest - this.desired))
              furthest = key;
          target.bitmaps.get(furthest)!.close();
          target.bitmaps.delete(furthest);
        }
        // Presentation happens only on the shared ticker (setFrame).
      })
      .catch(() => {
        if (this.active) this.onError();
      })
      .finally(() => {
        this.decodeCount--;
        target.decoding.delete(index);
        this.pumpDecode();
      });
  }

  private closest(target: Layer) {
    let best = -1;
    for (const key of target.bitmaps.keys())
      if (best < 0 || Math.abs(key - this.desired) < Math.abs(best - this.desired)) best = key;
    return best;
  }

  private paint() {
    if (!this.active || !this.visible) return;
    let target: Layer;
    let tier: Tier;
    let index: number;
    if (this.detail.bitmaps.has(this.desired))
      [target, tier, index] = [this.detail, this.tier, this.desired];
    else if (this.preview.bitmaps.has(this.desired))
      [target, tier, index] = [this.preview, "preview", this.desired];
    else {
      const sharp = this.closest(this.detail);
      const soft = this.closest(this.preview);
      const gap = (i: number) => (i < 0 ? Infinity : Math.abs(i - this.desired));
      if (sharp < 0 && soft < 0) return;
      [target, tier, index] =
        gap(sharp) <= gap(soft) ? [this.detail, this.tier, sharp] : [this.preview, "preview", soft];
      // Keep the last image until a closer one is ready; don't flash backwards
      // as old requests finish after a quick scroll.
      if (this.drawn >= 0 && gap(this.drawn) <= gap(index)) return;
    }
    if (index === this.drawn && tier === this.drawnTier) return;
    const bitmap = target.bitmaps.get(index)!;
    const { width: W, height: H } = this.options;
    const scale = Math.max(this.width / W, this.height / H);
    const sw = this.width / scale;
    const sh = this.height / scale;
    const [sx, sy] = this.options.crop(index, sw, sh);
    const f = bitmap.width / W;
    this.context.drawImage(bitmap, sx * f, sy * f, sw * f, sh * f, 0, 0, this.width, this.height);
    this.drawn = index;
    this.drawnTier = tier;
    // Lets the transition benchmark time the first scrub frame after a dive.
    if (!performance.getEntriesByName(FIRST_FRAME_MARK).length) performance.mark(FIRST_FRAME_MARK);
    this.onDraw(index, tier);
  }

  dispose() {
    this.active = false;
    this.controller.abort();
    this.observer.disconnect();
    for (const target of [this.preview, this.detail]) {
      target.bitmaps.forEach((bitmap) => bitmap.close());
      target.bitmaps.clear();
      target.blobs.clear();
    }
  }
}

/*
 * One low-priority download queue for warming the HTTP cache ahead of a
 * visit. Each URL is fetched once per page; `urgent` URLs jump the queue (the
 * island the visitor is looking at beats background warming of the others).
 */
const warmedUrls = new Set<string>();
const warmQueue: string[] = [];
let warmWorkers = 0;
export function warmUrls(urls: string[], { urgent = false } = {}) {
  const fresh = urls.filter((url) => !warmedUrls.has(url));
  fresh.forEach((url) => warmedUrls.add(url));
  if (urgent) warmQueue.unshift(...fresh);
  else warmQueue.push(...fresh);
  while (warmWorkers < 3 && warmQueue.length) {
    warmWorkers++;
    void (async () => {
      for (let url = warmQueue.shift(); url; url = warmQueue.shift()) {
        try {
          await (await fetch(url, { priority: "low" })).blob();
        } catch {}
      }
      warmWorkers--;
    })();
  }
}

/*
 * Fill the HTTP cache for a sequence before the visitor gets there — e.g.
 * while an island is framed on the home page. Frames are served immutable,
 * so the destination page reads them straight from disk.
 */
export function warmSequence(source: SequenceSource, poster: string) {
  if (saveData()) return;
  const tier = detailTier(source, window.innerWidth, window.innerHeight);
  const urls = [poster, packUrl(source)];
  for (let index = 0; index < 24; index++) urls.push(frameUrl(source, tier, index));
  warmUrls(urls, { urgent: true });
}
