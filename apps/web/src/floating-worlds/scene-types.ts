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
    },
  ) => SceneController;
};
