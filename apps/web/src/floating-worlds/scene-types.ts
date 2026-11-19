export type World = { title: string; href: string | null };

export type SceneState = {
  stop: number;
  worlds: World[];
  ready: boolean;
  moving: boolean;
  moved: boolean;
  diving: boolean;
  inside: boolean;
};

export type LookState = {
  name: string;
  presets: string[];
  controls: [key: string, label: string, min: number, max: number][];
  values: Record<string, number>;
  hideCloudPath: boolean;
  edgeVignetteEnabled: boolean;
  code: string;
};

export type SceneController = {
  goTo: (stop: number) => void;
  enter: () => void;
  leave: () => void;
  setPreset: (name: string) => void;
  setLookValue: (key: string, value: number) => void;
  setCloudPathHidden: (hidden: boolean) => void;
  setVignetteEnabled: (enabled: boolean) => void;
  resetLook: () => void;
  dispose: () => void;
  /** Live scene internals. Read-only from React; used to project island anchors. */
  debug?: {
    camera: SceneCamera;
    ISLANDS: SceneIsland[];
    /** The current flight between stops; `t` runs 0–1. */
    F: { active: boolean; from: number; to: number; t: number };
  };
};

/** The parts of the bundle's three.js camera that anchor projection reads. */
export type SceneCamera = {
  matrixWorldInverse: { elements: ArrayLike<number> };
  projectionMatrix: { elements: ArrayLike<number> };
};

export type SceneIsland = {
  id: string;
  /** Painted width in world units. */
  W?: number;
  /** Painted height in world units. */
  H?: number;
  group: { matrixWorld: { elements: ArrayLike<number> } };
};

export type SceneModule = {
  mountFloatingWorlds: (
    canvas: HTMLCanvasElement,
    callbacks: {
      onScene: (scene: SceneState) => void;
      onLook: (look: LookState) => void;
      onProgress: (progress: number) => void;
      onVeil: (opacity: number) => void;
      onError: (error: unknown) => void;
      /** Stepping forward from the last island. Return true to stop the wrap to the overview. */
      onEnd?: () => boolean;
      ignoreInput?: (event: Event) => boolean;
      lookStorageKey?: string | null;
    },
  ) => SceneController;
};
