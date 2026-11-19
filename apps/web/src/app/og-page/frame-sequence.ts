import { FRAME_COUNT } from "./frame-timing";

const COUNT = FRAME_COUNT;
const WIDTH = 1920;
const HEIGHT = 1080;
const ROOT = "/og-car/v3/frames";

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
  private direction = 1;
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

  setFrame(index: number) {
    if (index === this.desired && index === this.drawn) return;
    if (index !== this.desired) this.direction = index > this.desired ? 1 : -1;
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
    const { clientWidth, clientHeight } = this.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = Math.min(dpr, 3840 / Math.max(clientWidth, clientHeight));
    this.width = Math.max(1, Math.round(clientWidth * scale));
    this.height = Math.max(1, Math.round(clientHeight * scale));
    if (this.canvas.width === this.width && this.canvas.height === this.height) return;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.cacheLimit = clientWidth < 600 ? 10 : 18;
    this.drawn = -1;
    this.context.imageSmoothingQuality = "high";
    this.paint();
  }

  private nearby() {
    const indices = [this.desired];
    if (this.desired + 1 < COUNT) indices.push(this.desired + 1);
    for (let distance = 1; distance <= this.cacheLimit; distance++) {
      // Decode farther ahead of travel while keeping reverse neighbours warm.
      for (const index of [
        this.desired + distance * this.direction,
        this.desired - Math.ceil(distance / 3) * this.direction,
      ]) {
        if (index >= 0 && index < COUNT && !indices.includes(index)) indices.push(index);
      }
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
    // Establish coverage across the shot before filling every gap. A cold-load
    // fling can then show a nearby frame while its exact neighbourhood loads.
    for (let i = 0; i < COUNT; i += 16) if (available(i)) return i;
    for (let i = 0; i < COUNT; i++) if (available(i)) return i;
    return undefined;
  }

  private pumpFetch() {
    if (!this.active || !this.visible) return;
    while (this.fetchCount < 8) {
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
          const priority = this.nearby().slice(0, this.cacheLimit);
          while (this.bitmaps.size > this.cacheLimit) {
            const furthest = [...this.bitmaps.keys()].find((key) => !priority.includes(key))!;
            this.bitmaps.get(furthest)!.close();
            this.bitmaps.delete(furthest);
          }
          // Present only on the shared ticker. Async decodes must not insert
          // extra, out-of-order paints between display refreshes.
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
    let index = this.desired;
    if (!this.bitmaps.has(index)) {
      let distance = Infinity;
      for (const candidate of this.bitmaps.keys()) {
        if (Math.abs(candidate - this.desired) < distance) {
          index = candidate;
          distance = Math.abs(candidate - this.desired);
        }
      }
      // Keep the last image until a closer one is ready; don't flash backwards
      // as old network/decode requests finish after a quick scroll.
      if (this.drawn >= 0 && Math.abs(this.drawn - this.desired) <= distance) return;
    }
    if (index === this.drawn) return;
    const bitmap = this.bitmaps.get(index)!;
    const scale = Math.max(this.width / WIDTH, this.height / HEIGHT);
    const sw = this.width / scale;
    const sh = this.height / scale;
    const sx = Math.max(0, Math.min(WIDTH - sw, 0.5 * WIDTH - sw / 2));
    const sy = (HEIGHT - sh) / 2;
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
