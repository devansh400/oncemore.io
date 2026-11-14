const COUNT = 330;
const WIDTH = 1920;
const HEIGHT = 1024;
const ROOT = "/mib2/hair-clean-v1/frames";

// Focus points in the original shot. Portrait viewports follow the subject
// instead of permanently cropping the woman, muzzle, or travelling bullet.
const FOCUS = [
  [0, 0.395],
  [1.5, 0.395],
  [2, 0.37],
  [3, 0.61],
  [4, 0.52],
  [5, 0.5],
  [6, 0.5],
  [7, 0.625],
  [8, 0.625],
  [9, 0.77],
  [9.5, 0.815],
  [10, 0.78],
  [10.97, 0.5],
  [11, 0.5],
];

export function focalPoint(frame: number) {
  const time = frame / 30;
  for (let i = 1; i < FOCUS.length; i++) {
    const [end, to] = FOCUS[i];
    const [start, from] = FOCUS[i - 1];
    if (time <= end) {
      const t = Math.max(0, (time - start) / (end - start));
      return from + (to - from) * t * t * (3 - 2 * t);
    }
  }
  return 0.5;
}

export class FrameSequence {
  private context: CanvasRenderingContext2D;
  private controller = new AbortController();
  private blobs = new Map<number, Blob>();
  private bitmaps = new Map<number, ImageBitmap>();
  private fetching = new Set<number>();
  private decoding = new Set<number>();
  private failed = new Set<number>();
  private active = true;
  private visible = true;
  private fetchCount = 0;
  private decodeCount = 0;
  private desired = 0;
  private drawn = -1;
  private width = 0;
  private height = 0;
  private cacheLimit = 12;
  private observer: ResizeObserver;

  constructor(
    private canvas: HTMLCanvasElement,
    private onDraw: (frame: number) => void,
    private onError: () => void,
  ) {
    if (typeof createImageBitmap !== "function") throw new Error("Frame decoding is unavailable");
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas is unavailable");
    this.context = context;
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
    this.pumpFetch();
  }

  setFrame(frame: number) {
    const index = Math.max(0, Math.min(COUNT - 1, Math.round(frame)));
    if (this.desired === index && this.drawn === index) return;
    this.desired = index;
    this.pumpFetch();
    this.pumpDecode();
    this.paint();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) {
      this.resize();
      this.pumpFetch();
      this.pumpDecode();
    }
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const scale = Math.min(dpr, 1920 / Math.max(rect.width, rect.height));
    this.width = Math.max(1, Math.round(rect.width * scale));
    this.height = Math.max(1, Math.round(rect.height * scale));
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.cacheLimit = rect.width < 600 ? 8 : 12;
    const sw = Math.min(WIDTH, (this.width / this.height) * HEIGHT);
    const sx = Math.max(0, Math.min(WIDTH - sw, focalPoint(0) * WIDTH - sw / 2));
    const posterPosition = sw < WIDTH ? (sx / (WIDTH - sw)) * 100 : 50;
    this.canvas.parentElement?.style.setProperty("--poster-x", `${posterPosition}%`);
    this.drawn = -1;
    this.context.imageSmoothingQuality = "high";
    this.paint();
  }

  private nearby() {
    const indices = [this.desired];
    for (let distance = 1; distance <= 8; distance++) {
      if (this.desired + distance < COUNT) indices.push(this.desired + distance);
      if (this.desired - distance >= 0) indices.push(this.desired - distance);
    }
    return indices;
  }

  private nextFetch() {
    const available = (index: number) =>
      !this.blobs.has(index) && !this.fetching.has(index) && !this.failed.has(index);
    // Load the current neighbourhood first, including after a fast jump.
    const next = this.nearby().find(available);
    if (next !== undefined) return next;
    if (available(COUNT - 1)) return COUNT - 1;
    for (let i = 0; i < COUNT; i++) if (available(i)) return i;
    return undefined;
  }

  private pumpFetch() {
    if (!this.active || !this.visible) return;
    while (this.fetchCount < 6) {
      const index = this.nextFetch();
      if (index === undefined) return;
      this.fetchCount++;
      this.fetching.add(index);
      void fetch(`${ROOT}/${String(index).padStart(3, "0")}.webp`, {
        signal: this.controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error("Frame unavailable");
          return response.blob();
        })
        .then((blob) => {
          if (this.active) this.blobs.set(index, blob);
        })
        .catch(() => {
          if (!this.active) return;
          this.failed.add(index);
          if (index === 0 || index === COUNT - 1 || this.failed.size > 8) this.onError();
        })
        .finally(() => {
          this.fetchCount--;
          this.fetching.delete(index);
          this.pumpDecode();
          this.pumpFetch();
        });
    }
  }

  private pumpDecode() {
    if (!this.active || !this.visible) return;
    const neighbourhood = this.nearby().slice(0, this.cacheLimit);
    while (this.decodeCount < 2) {
      const index = neighbourhood.find(
        (index) => this.blobs.has(index) && !this.bitmaps.has(index) && !this.decoding.has(index),
      );
      if (index === undefined) return;
      this.decodeCount++;
      this.decoding.add(index);
      void createImageBitmap(this.blobs.get(index)!)
        .then((bitmap) => {
          if (!this.active) {
            bitmap.close();
            return;
          }
          this.bitmaps.set(index, bitmap);
          // Keep only a bounded working set of decoded frames. Encoded WebPs
          // stay available for instant reverse scrolling without re-fetching.
          while (this.bitmaps.size > this.cacheLimit) {
            const furthest = [...this.bitmaps.keys()].sort(
              (a, b) => Math.abs(b - this.desired) - Math.abs(a - this.desired),
            )[0];
            this.bitmaps.get(furthest)!.close();
            this.bitmaps.delete(furthest);
          }
          this.paint();
        })
        .catch(() => {
          if (this.active) this.onError();
        })
        .finally(() => {
          this.decodeCount--;
          this.decoding.delete(index);
          this.pumpDecode();
        });
    }
  }

  private paint() {
    if (!this.active || !this.visible || !this.bitmaps.size) return;
    const index = this.bitmaps.has(this.desired)
      ? this.desired
      : [...this.bitmaps.keys()].sort(
          (a, b) => Math.abs(a - this.desired) - Math.abs(b - this.desired),
        )[0];
    if (index === this.drawn) return;
    const bitmap = this.bitmaps.get(index)!;
    const scale = Math.max(this.width / WIDTH, this.height / HEIGHT);
    const sw = this.width / scale;
    const sh = this.height / scale;
    const sx = Math.max(0, Math.min(WIDTH - sw, focalPoint(index) * WIDTH - sw / 2));
    // On ultrawide screens crop from below, preserving the woman's head.
    const sy = 0;
    this.context.drawImage(bitmap, sx, sy, sw, sh, 0, 0, this.width, this.height);
    this.drawn = index;
    this.onDraw(index);
  }

  dispose() {
    this.active = false;
    this.controller.abort();
    this.observer.disconnect();
    this.bitmaps.forEach((bitmap) => bitmap.close());
    this.bitmaps.clear();
    this.blobs.clear();
  }
}
